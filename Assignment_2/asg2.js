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

let g_globalAngleX = 30;
let g_globalAngleY = 0;
let g_globalTransformZ = 0;

let g_legsAngle = 0;
let g_legsAnimation = false;

let g_secondJointAngle = 0;

let g_tailAngleX = 15;
let g_tailAngleY = 0;
let g_tailAnimation = false;

let x_val = 0;
let y_val = 0;

let g_headTransform = 0;
let g_walkAnimation = false;

let g_shiftAnimation = false;


// Set up actions for the HTML UI elements
function addActionsForHTMLUI() {
  
  // Slider Events
  document.getElementById('joint_slider').addEventListener('mousemove', function() { g_secondJointAngle = parseInt(this.value); renderScene(); }  );
  document.getElementById('legs_slider').addEventListener('mousemove', function() { g_legsAngle = parseInt(this.value); renderScene(); });
  document.getElementById('tail_sliderX').addEventListener('mousemove', function() { g_tailAngleX = parseInt(this.value); renderScene(); }  );
  document.getElementById('tail_sliderY').addEventListener('mousemove', function() { g_tailAngleY = parseInt(this.value); renderScene(); });

  document.getElementById('xcamera_slider').addEventListener('mousemove', function() { g_globalAngleX = parseInt(this.value); renderScene(); });
  document.getElementById('ycamera_slider').addEventListener('mousemove', function() { g_globalAngleY = parseInt(this.value); renderScene(); });

  // Button Events
  document.getElementById('on_animLegs').onclick = function() { g_legsAnimation = true; };
  document.getElementById('off_animLegs').onclick = function() { g_legsAnimation = false; };
  document.getElementById('on_animTail').onclick = function() { g_tailAnimation = true; };
  document.getElementById('off_animTail').onclick = function() { g_tailAnimation = false; };
  document.getElementById('on_animWalk').onclick = function() { g_walkAnimation = true; };
  document.getElementById('off_animWalk').onclick = function() { 
    g_walkAnimation = false; 
    g_tailAnimation = false;
    g_legsAnimation = false;
    g_headTransform = 0;
  };

  document.getElementById('res_animLegs').onclick = function() {g_legsAngle = 0; document.getElementById('legs_slider').value = 0;};
  document.getElementById('res_animTail').onclick = function() {g_tailAngleX = 15; g_tailAngleY = 0; document.getElementById('tail_sliderX').value = 15; document.getElementById('tail_sliderY').value = 0};

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
  canvas.onmousedown = function(ev) { 
    let [x, y] = convertCDEventToGL(ev); x_val = x; y_val = y; 
    if (ev.shiftKey) {
      if (g_shiftAnimation) {
        g_legsAngle = 0;
        g_globalTransformZ = 0;
        g_tailAngleX = 15;
      }
      g_shiftAnimation = !g_shiftAnimation;
    }
  };
  
  
    // //canvas.onmousemove = mouseMove;
  canvas.onmousemove = function(ev) {if (ev.buttons == 1) { click(ev); } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.5, 0.5, 0.7, 1.0);

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
  if (g_legsAnimation) {
    g_legsAngle = (30*Math.sin(5*g_seconds));
    document.getElementById('legs_slider').value = g_legsAngle;
  }

  if (g_tailAnimation) {
    g_tailAngleY = (45*Math.sin(8*g_seconds));
    document.getElementById('tail_sliderY').value = g_tailAngleY;
  }

  if (g_walkAnimation) {
    g_tailAnimation = true;
    g_legsAnimation = true;
    g_headTransform = (0.03*Math.sin(5*g_seconds));
  }

  if (g_shiftAnimation) {
    g_legsAngle = 40*(1-Math.sin(4*g_seconds));
    g_globalTransformZ = (1-Math.sin(4*g_seconds))/3;
    g_tailAngleX = (30*Math.sin(4*g_seconds));
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

  var globalRotMat = new Matrix4();
  globalRotMat.translate(0, g_globalTransformZ, 0);
  globalRotMat.rotate(g_globalAngleX,0,1,0);
  globalRotMat.rotate((g_globalAngleY % 360), 1, 0, 0);
  globalRotMat.scale(0.9, 0.9, 0.9);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements)

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  
  // Head
  var wolfFace = new Cube();
  wolfFace.color = [0.8, 0.8, 0.8, 1.0];

  wolfFace.matrix.translate(-0.2, -0.245+g_headTransform, -0.575);
  var FacetoMouth = new Matrix4(wolfFace.matrix);
  var FacetoEarL = new Matrix4(wolfFace.matrix);
  var FacetoEarR = new Matrix4(wolfFace.matrix);
  var PupilL = new Matrix4(wolfFace.matrix);
  var PupilR = new Matrix4(wolfFace.matrix);
  var ScleraL = new Matrix4(wolfFace.matrix);
  var ScleraR = new Matrix4(wolfFace.matrix);
  wolfFace.matrix.scale(0.4, 0.4, 0.175);

  wolfFace.render();


  var wolfPupilL = new Cube();
  wolfPupilL.color = [0.2, 0.2, 0.2, 1];

  wolfPupilL.matrix = PupilL;
  wolfPupilL.matrix.translate(.25, 0.2, -0.001);
  wolfPupilL.matrix.scale(0.075, 0.075, 0.075);

  wolfPupilL.render();


  var wolfPupilR = new Cube();
  wolfPupilR.color = [0.2, 0.2, 0.2, 1];

  wolfPupilR.matrix = PupilR;
  wolfPupilR.matrix.translate(.075, 0.2, -0.001);
  wolfPupilR.matrix.scale(0.075, 0.075, 0.075);

  wolfPupilR.render();
  
  
  var wolfScleraL = new Cube();
  wolfScleraL.color = [1, 1, 1, 1];

  wolfScleraL.matrix = ScleraL;
  wolfScleraL.matrix.translate(.3251, 0.2, -0.001);
  wolfScleraL.matrix.scale(0.075, 0.075, 0.075);
  
  wolfScleraL.render();


  var wolfScleraR = new Cube();
  wolfScleraR.color = [1, 1, 1, 1]

  wolfScleraR.matrix = ScleraR;
  wolfScleraR.matrix.translate(-0.001, 0.2, -0.001);
  wolfScleraR.matrix.scale(0.075, 0.075, 0.075);

  wolfScleraR.render();


  var wolfMouth = new Cube();
  wolfMouth.color = [0.85, 0.83, 0.78, 1.0];

  wolfMouth.matrix = FacetoMouth;
  wolfMouth.matrix.translate(0.1, 0, -0.2);
  var Lip = new Matrix4(wolfMouth.matrix);
  var Nose = new Matrix4(wolfMouth.matrix);
  wolfMouth.matrix.scale(0.2, 0.2, 0.205);

  wolfMouth.render();


  var wolfNose = new Cube();
  wolfNose.color = [0.2, 0.2, 0.2, 1];

  wolfNose.matrix = Nose;
  wolfNose.matrix.translate(0.068, 0.1351, -0.001);
  wolfNose.matrix.scale(0.065, 0.065, 0.065);

  wolfNose.render();

  var wolfLip = new Cube();
  wolfLip.color = [0.2, 0.2, 0.2, 1];

  wolfLip.matrix = Lip;
  wolfLip.matrix.translate(-0.001, 0.0001, -0.001);
  wolfLip.matrix.scale(0.203, 0.065, 0.2003);

  wolfLip.render();


  var wolfEarL = new Cube();
  wolfEarL.color = [0.2, 0.2, 0.2, 1.0];
  
  wolfEarL.matrix = FacetoEarL;
  wolfEarL.matrix.translate(0, 0.4, 0.125);
  wolfEarL.matrix.scale(0.15, 0.14, 0.05);

  wolfEarL.render();


  var wolfEarR = new Cube();
  wolfEarR.color = [0.2, 0.2, 0.2, 1.0];
  
  wolfEarR.matrix = FacetoEarR;
  wolfEarR.matrix.translate(0.25, 0.4, 0.125);
  wolfEarR.matrix.scale(0.15, 0.14, 0.05);

  wolfEarR.render()


  // Body 
  var wolfCollar = new Cube();
  wolfCollar.color = [0.8, 0.0, 0.0, 1.0];

  wolfCollar.matrix.translate(-0.245, -0.245, -0.4001);
  wolfCollar.matrix.scale(0.49, 0.44, 0.1);

  wolfCollar.render();


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
  wolfTail.matrix.rotate(-g_tailAngleY, 0, 0, 1);
  wolfTail.matrix.rotate(-g_tailAngleX, 1, 0, 0);
  wolfTail.matrix.scale(0.1, 0.45, 0.1);

  wolfTail.render();


  // Upper Legs
  var wolfUpLegLT = new Cube();
  wolfUpLegLT.color = [0.8, 0.8, 0.8, 1.0];

  wolfUpLegLT.matrix.setTranslate(0.075, -0.09, -0.2699);
  wolfUpLegLT.matrix.rotate(180, 1, 0, 0);
  if (!g_shiftAnimation) {
    wolfUpLegLT.matrix.rotate(g_legsAngle, 1, 0, 0);
  } else {
    wolfUpLegLT.matrix.rotate(-g_legsAngle, 0, 0, 1);
  }
  var UpLTtoLB = new Matrix4(wolfUpLegLT.matrix);
  wolfUpLegLT.matrix.scale(0.125, 0.35, 0.125);

  wolfUpLegLT.render();


  var wolfUpLegLB = new Cube();
  wolfUpLegLB.color = [0.8, 0.8, 0.8, 1.0];

  wolfUpLegLB.matrix = UpLTtoLB;
  wolfUpLegLB.matrix.translate(0, 0.35, 0);
  wolfUpLegLB.matrix.rotate(g_secondJointAngle, 1, 0, 0);
  wolfUpLegLB.matrix.scale(0.125, 0.225, 0.125);

  wolfUpLegLB.render();


  var wolfUpLegRT = new Cube();
  wolfUpLegRT.color = [0.8, 0.8, 0.8, 1.0];

  wolfUpLegRT.matrix.setTranslate(-0.2, -0.09, -0.2699);
  wolfUpLegRT.matrix.rotate(180, 1, 0, 0);
  if (!g_shiftAnimation) {
    wolfUpLegRT.matrix.rotate(-g_legsAngle, 1, 0, 0);
  } else {
    wolfUpLegRT.matrix.rotate(g_legsAngle, 0, 0, 1);
  }
  var UpRTtoRB = new Matrix4(wolfUpLegRT.matrix);
  wolfUpLegRT.matrix.scale(0.125, 0.35, 0.125);

  wolfUpLegRT.render();


  var wolfUpLegRB = new Cube();
  wolfUpLegRB.color = [0.8, 0.8, 0.8, 1.0];

  wolfUpLegRB.matrix = UpRTtoRB;
  wolfUpLegRB.matrix.translate(0, 0.35, 0);
  wolfUpLegRB.matrix.rotate(g_secondJointAngle, 1, 0, 0);
  wolfUpLegRB.matrix.scale(0.125, 0.225, 0.125);

  wolfUpLegRB.render();


  // Lower Legs
  var wolfLowLegLT = new Cube();
  wolfLowLegLT.color = [0.8, 0.8, 0.8, 1.0];

  wolfLowLegLT.matrix.setTranslate(0.075, -0.08, 0.4999);
  wolfLowLegLT.matrix.rotate(180, 1, 0, 0);
  if (!g_shiftAnimation) {
    wolfLowLegLT.matrix.rotate(-g_legsAngle, 1, 0, 0);
  } else {
    wolfLowLegLT.matrix.rotate(-g_legsAngle, 0, 0, 1);
  }
  
  var LowLTtoLB = new Matrix4(wolfLowLegLT.matrix);
  wolfLowLegLT.matrix.scale(0.125, 0.35, 0.125);

  wolfLowLegLT.render();


  var wolfLowLegLB = new Cube();
  wolfLowLegLB.color = [0.8, 0.8, 0.8, 1.0];

  wolfLowLegLB.matrix = LowLTtoLB;
  wolfLowLegLB.matrix.translate(0, 0.35, 0);
  wolfLowLegLB.matrix.rotate(g_secondJointAngle, 1, 0, 0);
  wolfLowLegLB.matrix.scale(0.125, 0.23, 0.125);

  wolfLowLegLB.render();


  var wolfLowLegRT = new Cube();
  wolfLowLegRT.color = [0.8, 0.8, 0.8, 1.0];

  wolfLowLegRT.matrix.setTranslate(-0.2, -0.08, 0.4999);
  wolfLowLegRT.matrix.rotate(180, 1, 0, 0);
  if (!g_shiftAnimation) {
    wolfLowLegRT.matrix.rotate(g_legsAngle, 1, 0, 0);
  } else {
    wolfLowLegRT.matrix.rotate(g_legsAngle, 0, 0, 1);
  }
  var LowRTtoRB = new Matrix4(wolfLowLegRT.matrix);
  wolfLowLegRT.matrix.scale(0.125, 0.35, 0.125);

  wolfLowLegRT.render();


  var wolfLowLegRB = new Cube();
  wolfLowLegRB.color = [0.8, 0.8, 0.8, 1.0];

  wolfLowLegRB.matrix = LowRTtoRB;
  wolfLowLegRB.matrix.translate(0, 0.35, 0);
  wolfLowLegRB.matrix.rotate(g_secondJointAngle, 1, 0, 0);
  wolfLowLegRB.matrix.scale(0.125, 0.23, 0.125);

  wolfLowLegRB.render();


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