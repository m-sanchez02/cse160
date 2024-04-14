// asg1.js
// Built off of ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_PointSize;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_PointSize;
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
let u_PointSize;

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

  // Get the storage location of u_PointSize
  u_PointSize = gl.getUniformLocation(gl.program, 'u_PointSize');
  if (!u_PointSize) {
    console.log('Failed to get the storage location of u_PointSize');
    return;
  }
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Global variables related to UI elements
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedColorCopy = [];
let g_size = 5.0;
let g_selectedType = POINT;
let g_count = 10; // Number of segments on a circle
let g_stats = 0;
let g_rainbow = false;

// Set up actions for the HTML UI elements
function addActionsForHTMLUI() {
  
  // Color Slider and Checkbox Events
  document.getElementById('red_slider').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/255; document.getElementById('red_val').value = this.value;}  );
  document.getElementById('green_slider').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/255; document.getElementById('green_val').value = this.value;}  );
  document.getElementById('blue_slider').addEventListener('mouseup', function() {g_selectedColor[2] = this.value/255; document.getElementById('blue_val').value = this.value;}  );
  document.getElementById('alpha_slider').addEventListener('mouseup', function() {g_selectedColor[3] = this.value/100; }  );

  // Size/Segment Slider Events
  document.getElementById('size_slider').addEventListener('mouseup', function() { g_size = this.value; });
  document.getElementById('segment_slider').addEventListener('mouseup', function() { g_count = this.value; });

  // Button Events (canvas manipulation)
  document.getElementById('clear').onclick = function() { g_shapesList = []; renderAllShapes(); };
  document.getElementById('undo').onclick = function() { g_shapesList.pop(); renderAllShapes(); };
  document.getElementById('rainbow').onclick = function() { rainbowToggle(); };

  // Button Events (shape change)
  document.getElementById('square').onclick = function() { g_selectedType = POINT; };
  document.getElementById('triangle').onclick = function() { g_selectedType = TRIANGLE; };
  document.getElementById('circle').onclick = function() { g_selectedType = CIRCLE; };

  // Button Events (statistics and drawing)
  document.getElementById('stats').onclick = function() { g_stats = 1; };
  document.getElementById('drawing').onclick = function() { drawImage();};
  
  // RGB Numerical Value Events
  document.getElementById('red_val').addEventListener('input', function () {g_selectedColor[0] = this.value/255; document.getElementById('red_slider').value = this.value; });
  document.getElementById('green_val').addEventListener('input', function() { g_selectedColor[1] = this.value/255; document.getElementById('green_slider').value = this.value;});
  document.getElementById('blue_val').addEventListener('input', function() {g_selectedColor[2] = this.value/255; document.getElementById('blue_slider').value = this.value;});
}

function main() {
  
  // Set up canvas and GL variables
  setupWebGL();

  // Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

  // Set up actions for the HTML UI elements
  addActionsForHTMLUI();

  // Register function (event handler) to be called on a mouse press/move
  canvas.onmousedown = click;
  //canvas.onmousemove = mouseMove;
  canvas.onmousemove = function(ev) { if (ev.buttons == 1) { click(ev); }};

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

// Global variables (list of shapes on canvas)
var g_shapesList = []; // The array containing the position of a mouse press and the color and size of a point
var cur_color = 0;

function click(ev) {
  // Store the coordinates to g_points array
  let [x, y] = convertCDEventToGL(ev);

  // Create and store new point
  let point;
  if (g_selectedType == POINT) {
    point = new Point();
  } else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
    point.settings = false;
  } else {
    point = new Circle();
    point.count = g_count;
  }

  point.position = [x, y];

  
  if (g_rainbow) {
    rainbowMode();
  }

  point.color = g_selectedColor.slice();
  point.size = g_size;

  g_shapesList.push(point);

  renderAllShapes();
}

function convertCDEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return ([x, y]);
}

function renderAllShapes() {
  var startTime = performance.now();

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }

  var duration = performance.now() - startTime;
  if (g_stats === 1) {
    sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration), "numdot");
  }
}

function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}

function drawImage() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  g_shapesList = [];
  var listTriangles = [
  [-1.0, -1.0, 1.0, 1.0, 1.0, -1.0],
  [-1.0, -1.0, -1.0, 1.0, 1.0, 1.0],
  [-1.0, -1.0, 1.0, -0.6, 1.0, -1.0],
  [-1.0, -1.0, -1.0, -0.6, 1.0, -0.6],
  [-0.8, -0.7, -0.8, -0.6, -0.4, -0.7],
  [-0.8, -0.6, -0.4, -0.6, -0.4, -0.7],
  [-0.1, -0.7, -0.1, -0.6, 0.3, -0.7],
  [-0.1, -0.6, 0.3, -0.6, 0.3, -0.7],
  [0.6, -0.7, 0.6, -0.6, 1.0, -0.7],
  [0.6, -0.6, 1.0, -0.6, 1.0, -0.7],
  [-1.0, -0.4, -0.8, 0.0, -0.8, -0.4],
  [-0.8, -0.4, -0.8, 0.0, -0.6, -0.2],
  [-0.8, 0.0, -0.4, 0.0, -0.4, -0.4],
  [-0.6, 0.0, -0.6, 0.2, -0.2, 0.0],
  [-0.6, 0.2, -0.2, 0.4, -0.2, 0.0],
  [-0.4, -0.4, -0.4, 0.0, -0.2, -0.4],
  [-0.4, 0.0, -0.2, 0.0, -0.2, -0.4],
  [-0.2, -0.4, -0.2, 0.4, 0.2, -0.4],
  [-0.2, 0.4, 0.2, 0.4, 0.2, -0.4],
  [0.2, -0.4, 0.2, 0.0, 0.4, -0.2],
  [0.2, 0.0, 0.6, 0.0, 0.6, -0.4],
  [0.6, -0.4, 0.6, 0.0, 1.0, -0.4],
  [0.6, 0.0, 0.8, 0.0, 0.8, -0.2],
  [0.8, -0.2, 1.0, -0.2, 1.0, -0.4],
  [-0.8, 0.0, -0.6, 0.2, -0.6, 0.0],
  [0.8, -0.2, 0.8, 0.0, 1.0, -0.2],
  [0.2, 0.0, 0.2, 0.4, 0.6, 0.0],
  [-0.8, -0.4, -0.6, -0.2, -0.4, -0.4],
  [-0.8, -0.4, -0.4, -0.4, -0.6, -0.6],
  [0.2, -0.4, 0.4, -0.2, 0.6, -0.4],
  [0.2, -0.4, 0.6, -0.4, 0.4, -0.6],
  [-0.8, 0.2, -0.8, 0.4, -0.6, 0.2]
  ];

  var i = 0;
  for (i; i < 2; i++) {
    let point = new Triangle();
    point.settings = true;
    point.position = listTriangles[i];
    point.color = [0.0, 135/255, 165/255, 1.0];
    g_shapesList.push(point);
    renderAllShapes();
  }
  for (i; i < 4; i++) {
    let point = new Triangle();
    point.settings = true;
    point.position = listTriangles[i];
    point.color = [150/255, 150/255, 150/255, 1.0];
    g_shapesList.push(point);
    renderAllShapes();
  }
  for (i; i < 10; i++) {
    let point = new Triangle();
    point.settings = true;
    point.position = listTriangles[i];
    point.color = [1.0, 1.0, 0.0, 1.0];
    g_shapesList.push(point);
    renderAllShapes();
  }
  for (i; i < 24; i++) {
    let point = new Triangle();
    point.settings = true;
    point.position = listTriangles[i];
    point.color = [0.0, 200/255, 0.0, 1.0];
    g_shapesList.push(point);
    renderAllShapes();
  }
  for (i; i < 25; i++) {
    let point = new Triangle();
    point.settings = true;
    point.position = listTriangles[i];
    point.color = [1.0, 0.0, 0.0, 1.0];
    g_shapesList.push(point);
    renderAllShapes();
  }
  for (i; i < 26; i++) {
    let point = new Triangle();
    point.settings = true;
    point.position = listTriangles[i];
    point.color = [1.0, 1.0, 0.0, 1.0];
    g_shapesList.push(point);
    renderAllShapes();
  }
  for (i; i < 27; i++) {
    let point = new Triangle();
    point.settings = true;
    point.position = listTriangles[i];
    point.color = [200/255, 200/255, 200/255, 1.0];
    g_shapesList.push(point);
    renderAllShapes();
  }
  for (i; i < 31; i++) {
    let point = new Triangle();
    point.settings = true;
    point.position = listTriangles[i];
    point.color = [50/255, 50/255, 50/255, 1.0];
    g_shapesList.push(point);
    renderAllShapes();
  }
  for (i; i < 32; i++) {
    let point = new Triangle();
    point.settings = true;
    point.position = listTriangles[i];
    point.color = [0.0, 0.0, 0.0, 1.0];
    g_shapesList.push(point);
    renderAllShapes();
  }
}

function rainbowToggle() {
  g_rainbow = !g_rainbow; 
  if (g_rainbow) {
    g_selectedColorCopy = g_selectedColor.slice(); 
    g_selectedColor = [1.0, 0.0, 0.0, 1.0]; 
    cur_color = 0;
  } else {
    g_selectedColor = g_selectedColorCopy.slice();
  }
}

function rainbowMode() {
  switch(cur_color) {
    case 0:
      g_selectedColor[1] += 0.01;
      if (g_selectedColor[1] > 0.9) {
        cur_color = 1;
      }
      break;
    case 1:
      g_selectedColor[0] -= 0.01;
      if (g_selectedColor[0] < 0.1) {
        cur_color = 2;
      }
      break;
    case 2:
      g_selectedColor[2] += 0.01;
      if (g_selectedColor[2] > 0.9) {
        cur_color = 3;
      }
      break;
    case 3:
      g_selectedColor[1] -= 0.01;
      if (g_selectedColor[1] < 0.1) {
        cur_color = 4;
      }
      break;
    case 4:
      g_selectedColor[0] += 0.01;
      if (g_selectedColor[0] > 0.9) {
        cur_color = 5;
      }
      break;
    case 5:
      g_selectedColor[2] -= 0.01;
      if (g_selectedColor[2] < 0.1) {
        cur_color = 0;
      }
      break;
    default:
      break;
  }
}