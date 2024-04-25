// asg1.js
// Built off of ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`;

// Global variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

// Setup WebGL
function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});

  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

// Initialize shaders and connect JS Variables to GLSL
function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Enable alpha blending for transparancy
  // Derived from WebGL Programming Guide Textbook Chapter 10: Alpha Blending
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }
  
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Global variables related to UI elements
// let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
// // let g_selectedColorCopy = [];
// let g_size = 5.0;
// let g_selectedType = POINT;
// let g_count = 10; // Number of segments on a circle
let g_stats = 0; // Debug stats
let g_globalAngle = 0;
// let g_rainbow = false; // Rainbow Toggle (false = off, true = on)
let g_yellowAngle = 0;
let g_magentaAngle = 0;
let g_yellowAnimation = false;
let g_magentaAnimation = false;

// Set up actions for the HTML UI elements
function addActionsForHTMLUI() {
  
  // Color Slider Events
  document.getElementById('magenta_slider').addEventListener('mousemove', function() { g_magentaAngle = this.value; renderScene(); }  );
  // document.getElementById('green_slider').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/255; document.getElementById('green_val').value = this.value;}  );
  // document.getElementById('blue_slider').addEventListener('mouseup', function() {g_selectedColor[2] = this.value/255; document.getElementById('blue_val').value = this.value;}  );
  // document.getElementById('alpha_slider').addEventListener('mouseup', function() {g_selectedColor[3] = this.value/100; }  );

  // Size/Segment Slider Events
  document.getElementById('camera_slider').addEventListener('mousemove', function() { g_globalAngle = this.value; renderScene(); });
  document.getElementById('yellow_slider').addEventListener('mousemove', function() { g_yellowAngle = this.value; renderScene(); });

  // Button Events (canvas manipulation)
  document.getElementById('clear').onclick = function() { g_shapesList = []; renderScene(); };
  document.getElementById('undo').onclick = function() { g_shapesList.pop(); renderScene(); };
  // document.getElementById('rainbow').onclick = function() { rainbowToggle(); };

  // Button Events (shape change)
  document.getElementById('on_animYellow').onclick = function() { g_yellowAnimation = true; };
  document.getElementById('off_animYellow').onclick = function() { g_yellowAnimation = false; };
  document.getElementById('on_animMag').onclick = function() { g_magentaAnimation = true; };
  document.getElementById('off_animMag').onclick = function() { g_magentaAnimation = false; };
  // document.getElementById('circle').onclick = function() { g_selectedType = CIRCLE; };

  // Button Events (statistics and drawing)
  document.getElementById('stats').onclick = function() { g_stats = 1; };
  document.getElementById('drawing').onclick = function() { drawImage();};
  
  // RGB Numerical Value Events
  // document.getElementById('red_val').addEventListener('input', function () {g_selectedColor[0] = this.value/255; document.getElementById('red_slider').value = this.value; });
  // document.getElementById('green_val').addEventListener('input', function() { g_selectedColor[1] = this.value/255; document.getElementById('green_slider').value = this.value;});
  // document.getElementById('blue_val').addEventListener('input', function() {g_selectedColor[2] = this.value/255; document.getElementById('blue_slider').value = this.value;});
}

function main() {
  
  // Set up canvas and GL variables
  setupWebGL();

  // Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

  // Set up actions for the HTML UI elements
  addActionsForHTMLUI();

  // Register function (event handler) to be called on a mouse press/move
  // canvas.onmousedown = click;
  // //canvas.onmousemove = mouseMove;
  // canvas.onmousemove = function(ev) { if (ev.buttons == 1) { click(ev); }};

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);
  //renderScene();
  requestAnimationFrame(tick);
}

// // Global variables (list of shapes on canvas)
// var g_shapesList = []; // The array containing the position of a mouse press and the color and size of a point
// var cur_color = 0; // Value to decide what color increases/decreases

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;

function tick() {
  g_seconds = performance.now()/1000.0-g_startTime;
  console.log(g_seconds);

  updateAnimationAngles();

  renderScene();

  requestAnimationFrame(tick);
}

function updateAnimationAngles() {
  if (g_yellowAnimation) {
    g_yellowAngle = (45*Math.sin(g_seconds));
  }
  if (g_magentaAnimation) {
    g_magentaAngle = (45*Math.sin(3*g_seconds));
  }
}

// function click(ev) {
//   // Store the coordinates to g_points array
//   let [x, y] = convertCDEventToGL(ev);

//   // Create and store new point
//   let point;
//   if (g_selectedType == POINT) {
//     point = new Point();
//   } else if (g_selectedType == TRIANGLE) {
//     point = new Triangle();
//     point.settings = false;
//   } else {
//     point = new Circle();
//     point.count = g_count;
//   }

//   point.position = [x, y];

//   // Check for rainbow mode
//   // if (g_rainbow) {
//   //   rainbowMode();
//   // }

//   point.color = g_selectedColor.slice();
//   point.size = g_size;

//   g_shapesList.push(point);

//   renderScene();
// }

// function convertCDEventToGL(ev) {
//   var x = ev.clientX; // x coordinate of a mouse pointer
//   var y = ev.clientY; // y coordinate of a mouse pointer
//   var rect = ev.target.getBoundingClientRect();

//   x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
//   y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
//   return ([x, y]);
// }

function renderScene() {
  var startTime = performance.now(); // Debug information

  var globalRotMat = new Matrix4().rotate(g_globalAngle,0,1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements)

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);
  // Render shapes onto <canvas>
  // var len = g_shapesList.length;
  // for(var i = 0; i < len; i++) {
  //   g_shapesList[i].render();
  // }

  var body = new Cube();
  body.color = [1.0, 0.0, 0.0, 1.0];
  body.matrix.translate(-.25, -.75, 0.0);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(0.5, 0.3, 0.5);
  body.render();

  var leftArm = new Cube();
  leftArm.color = [1, 1, 0, 1];
  leftArm.matrix.setTranslate(0, -0.5, 0.0);
  leftArm.matrix.rotate(-5,1,0,0);

  leftArm.matrix.rotate(-g_yellowAngle,0,0,1);

  // if (g_yellowAnimation) {
  //   leftArm.matrix.rotate(45*Math.sin(g_seconds),0,0,1);
  // } else {
  //   leftArm.matrix.rotate(-g_yellowAngle,0,0,1);
  // }

  
  var yellowCoordinates= new Matrix4(leftArm.matrix);
  leftArm.matrix.scale(0.25, 0.7, 0.5);
  leftArm.matrix.translate(-.5,0,0);
  leftArm.render();

  var box = new Cube();
  box.color = [1,0,1,1];
  box.matrix = yellowCoordinates;
  box.matrix.translate(0, 0.65, 0);
  box.matrix.rotate(-g_magentaAngle,0,0,1);
  box.matrix.scale(.3,.3,.3);
  box.matrix.translate(-.5,0, -0.001);
  // box.matrix.translate(-.1,.1,0,0);
  // box.matrix.rotate(-30,1,0,0);
  // box.matrix.scale(0.2,0.4,.2);
  box.render();

  // Debug information
  var duration = performance.now() - startTime;
  // if (g_stats === 1) {
  //   sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration), "numdot");
  // }
}






// Debug stats
function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}