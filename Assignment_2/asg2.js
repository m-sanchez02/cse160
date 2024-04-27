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


// Global variables related to UI elements
let g_stats = 0; // Debug stats

let g_globalAngleX = 0;
let g_globalAngleY = 0;

let g_yellowAngle = 0;
let g_yellowAnimation = false;

let g_magentaAngle = 0;
let g_magentaAnimation = false;

var x_val = 0;
var y_val = 0;


// Set up actions for the HTML UI elements
function addActionsForHTMLUI() {
  
  // Slider Events
  document.getElementById('magenta_slider').addEventListener('mousemove', function() { g_magentaAngle = parseInt(this.value); renderScene(); }  );
  document.getElementById('yellow_slider').addEventListener('mousemove', function() { g_yellowAngle = parseInt(this.value); renderScene(); });
  document.getElementById('xcamera_slider').addEventListener('mousemove', function() { g_globalAngleX = parseInt(this.value); renderScene(); });
  document.getElementById('ycamera_slider').addEventListener('mousemove', function() { g_globalAngleY = parseInt(this.value); renderScene(); });

  // Button Events
  document.getElementById('on_animYellow').onclick = function() { g_yellowAnimation = true; };
  document.getElementById('off_animYellow').onclick = function() { g_yellowAnimation = false; };
  document.getElementById('on_animMag').onclick = function() { g_magentaAnimation = true; };
  document.getElementById('off_animMag').onclick = function() { g_magentaAnimation = false; };

  // Button Events (statistics and drawing)
  document.getElementById('stats').onclick = function() { g_stats = 1; };
}


function main() {
  
  // Set up canvas and GL variables
  setupWebGL();

  // Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

  // Set up actions for the HTML UI elements
  addActionsForHTMLUI();

  // Register function (event handler) to be called on a mouse press/move
  canvas.onmousedown = function(ev) { let [x, y] = convertCDEventToGL(ev); x_val = x; y_val = y; };
  // //canvas.onmousemove = mouseMove;
  canvas.onmousemove = function(ev) {if (ev.buttons == 1) { click(ev); } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  requestAnimationFrame(tick);
}


var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;
function tick() {
  g_seconds = performance.now()/1000.0-g_startTime;

  updateAnimationAngles();

  renderScene();

  requestAnimationFrame(tick);
}


function updateAnimationAngles() {
  if (g_yellowAnimation) {
    g_yellowAngle = (45*Math.sin(g_seconds));
    document.getElementById('yellow_slider').value = g_yellowAngle;
  }

  if (g_magentaAnimation) {
    g_magentaAngle = (45*Math.sin(3*g_seconds));
    document.getElementById('magenta_slider').value = g_magentaAngle;
  }
}


function click(ev) {
  var [x, y] = convertCDEventToGL(ev);
  g_globalAngleX -= 150 * (x - x_val);
  x_val = x;
  
  g_globalAngleY -= 150 * (y - y_val);
  y_val = y;
}


function convertCDEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return ([x, y]);
}


function renderScene() {
  var startTime = performance.now(); // Debug information

  var globalRotMat = new Matrix4().rotate(g_globalAngleX,0,1,0);
  globalRotMat.rotate((g_globalAngleY % 360), 1, 0, 0);
  globalRotMat.scale(0.9, 0.9, 0.9);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements)

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Head
  var wolfFace = new Cube();
  wolfFace.color = [0.8, 0.8, 0.8, 1.0];
  wolfFace.matrix.translate(-0.2, -0.245, -0.575);
  wolfFace.matrix.scale(0.4, 0.4, 0.175);
  wolfFace.render();

  var wolfNose = new Cube();
  wolfNose.color = [0.85, 0.83, 0.78, 1.0];
  wolfNose.matrix.translate(-0.1, -0.245, -0.775);
  wolfNose.matrix.scale(0.2, 0.2, 0.205);
  wolfNose.render();

  // var wolfEarL = new Cube();
  // wolfEarL.color = [0.85, 0.83, 0.78, 1.0];
  // wolfNose.matrix.translate(-0.1, -0.245, -0.775);
  // wolfNose.matrix.scale(0.2, 0.2, 0.205);

  // var wolfEarR = new Cube();

  // Body 
  var wolfBodyPuffy = new Cube();
  wolfBodyPuffy.color = [0.8, 0.8, 0.8, 1.0];
  wolfBodyPuffy.matrix.translate(-0.25, -0.25, -0.4);
  wolfBodyPuffy.matrix.scale(0.5, 0.45, 0.35);
  wolfBodyPuffy.render();

  var wolfBody = new Cube();
  wolfBody.color = [0.8, 0.8, 0.8, 1.0];
  wolfBody.matrix.translate(-0.2, -0.245, -0.1);
  wolfBody.matrix.scale(0.4, 0.4, 0.6);
  wolfBody.render();

  var wolfTail = new Cube();
  wolfTail.color = [0.8, 0.8, 0.8, 1.0];
  wolfTail.matrix.translate(-0.05, 0, 0.425);
  wolfTail.matrix.rotate(90, 1, 0, 0);
  wolfTail.matrix.rotate(-g_magentaAngle, 0, 0, 1);
  wolfTail.matrix.scale(0.1, 0.45, 0.1);
  wolfTail.render();

  // Upper Legs
  // var wolfUpLegLT = new Cube();
  // wolfUpLegLT.color = [0.8, 0.8, 0.8, 1.0];
  // wolfUpLegLT.matrix.translate(0.075, -0.475, -0.4);
  // wolfUpLegLT.matrix.rotate(-g_yellowAngle, 1, 0, 0);
  // var LeftLegJoint = new Matrix4(wolfUpLegLT.matrix);
  // wolfUpLegLT.matrix.scale(0.125, 0.225, 0.125);
  // wolfUpLegLT.render();

  // var wolfUpLegLB = new Cube();
  // wolfUpLegLB.color = [0.8, 0.8, 0.8, 1.0];
  // wolfUpLegLB.matrix = LeftLegJoint;
  // wolfUpLegLB.matrix.translate(0, -0.225, 0);
  // wolfUpLegLB.matrix.rotate(-g_magentaAngle, 1, 1, 1);
  // wolfUpLegLB.matrix.scale(0.125, 0.225, 0.125);
  // wolfUpLegLB.render();

  // var wolfUpLegRT = new Cube();
  // wolfUpLegRT.color = [0.8, 0.8, 0.8, 1.0];
  // wolfUpLegRT.matrix.translate(-0.2, -0.475, -0.4);
  // wolfUpLegRT.matrix.scale(0.125, 0.225, 0.125);
  // wolfUpLegRT.render();

  // var wolfUpLegRB = new Cube();
  // wolfUpLegRB.color = [0.8, 0.8, 0.8, 1.0];
  // wolfUpLegRB.matrix.translate(-0.2, -0.7, -0.4);
  // wolfUpLegRB.matrix.scale(0.125, 0.225, 0.125);
  // wolfUpLegRB.render();

  // Lower Legs
  var wolfLowLegLT = new Cube();
  wolfLowLegLT.color = [0.8, 0.8, 0.8, 1.0];

  wolfLowLegLT.matrix.setTranslate(0.075, -0.08, 0.4999);
  wolfLowLegLT.matrix.rotate(180, 1, 0, 0);
  wolfLowLegLT.matrix.rotate(-g_yellowAngle, 1, 0, 0);
  var LowLTtoLB = new Matrix4(wolfLowLegLT.matrix);
  wolfLowLegLT.matrix.scale(0.125, 0.35, 0.125);

  wolfLowLegLT.render();


  var wolfLowLegLB = new Cube();
  wolfLowLegLB.color = [0.8, 0.8, 0.8, 1.0];

  wolfLowLegLB.matrix = LowLTtoLB;
  wolfLowLegLB.matrix.translate(0, 0.35, 0);
  wolfLowLegLB.matrix.rotate(-g_magentaAngle, 1, 0, 0);
  wolfLowLegLB.matrix.scale(0.125, 0.23, 0.125);

  wolfLowLegLB.render();


  var wolfLowLegRT = new Cube();
  wolfLowLegRT.color = [0.8, 0.8, 0.8, 1.0];

  wolfLowLegRT.matrix.setTranslate(-0.2, -0.08, 0.4999);
  wolfLowLegRT.matrix.rotate(180, 1, 0, 0);
  wolfLowLegRT.matrix.rotate(-g_yellowAngle, 1, 0, 0);

  var LowRTtoRB = new Matrix4(wolfLowLegRT.matrix);
  wolfLowLegRT.matrix.scale(0.125, 0.35, 0.125);

  wolfLowLegRT.render();


  // var wolfLowLegRB = new Cube();
  // wolfLowLegRB.color = [0.8, 0.8, 0.8, 1.0];
  // wolfLowLegRB.matrix.translate(-0.2, -0.7, 0.375);
  // wolfLowLegRB.matrix.scale(0.125, 0.23, 0.125);
  // wolfLowLegRB.render();
















  
    // var body = new Cube();
  // body.color = [1.0, 0.0, 0.0, 1.0];
  // body.matrix.translate(-.25, -.75, 0.0);
  // body.matrix.rotate(-5,1,0,0);
  // body.matrix.scale(0.5, 0.3, 0.5);
  // body.render();

  // var leftArm = new Cube();
  // leftArm.color = [1, 1, 0, 1];
  // leftArm.matrix.stTranslate(0, -1, 0.0);
  // leftArm.matrix.rotate(-5,1,0,0);
  // leftArm.matrix.rotate(-g_yellowAngle,0,0,1);

  // var yellowCoordinates= new Matrix4(leftArm.matrix);

  // leftArm.matrix.scale(0.25, 0.7, 0.5);
  // leftArm.matrix.translate(-.5,0,0);
  // leftArm.render();

  // var box = new Cube();
  // box.color = [1,0,1,1];
  // box.matrix = yellowCoordinates;
  // box.matrix.translate(0, 0.65, 0);
  // box.matrix.rotate(-g_magentaAngle,0,0,1);
  // box.matrix.scale(.3,.3,.3);
  // box.matrix.translate(-.5,0, -0.001);
  // box.render();

  // Debug information
  var duration = performance.now() - startTime;
  if (g_stats === 1) {
    sendTextToHTML("fps: " + Math.floor(1000/duration), "numdot");
  }
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