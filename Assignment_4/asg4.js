// asg4.js
// Built off of ColoredPoint.js (c) 2012 matsuda
// Code mostly based on tutorials by Professor James Davis and the WebGL textbook

// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  varying vec4 v_vertPos;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = a_Normal;
    v_vertPos = u_ModelMatrix * a_Position;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;
  uniform vec3 u_LightColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform int u_whichTexture;
  uniform vec3 u_lightPos;
  varying vec4 v_vertPos;
  uniform vec3 u_cameraPos;
  uniform bool u_lightOn;
  void main() {
    if (u_whichTexture == -3) {
      gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);
    } else if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV,1.0,1.0);
    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    } else if (u_whichTexture == 2) {
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    } else {
      gl_FragColor = vec4(1.0, 0.2, 0.2, 1.0);
    }

    vec3 lightVector = u_lightPos - vec3(v_vertPos);
    float r = length(lightVector);

    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N,L), 0.0);

    vec3 R;

    if (u_whichTexture == 0) {
      R = reflect(L, N);  
    } else {
      R = reflect(-L, N);
    }
    
    vec3 E = normalize(u_cameraPos-vec3(v_vertPos));

    float specular = pow(max(dot(E,R), 0.0), 12.0);

    if (u_lightOn) {
      gl_FragColor[0] -= (1.0 - u_LightColor[0]);
      gl_FragColor[1] -= (1.0 - u_LightColor[1]);
      gl_FragColor[2] -= (1.0 - u_LightColor[2]);
    }

    vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7;
    vec3 ambient = vec3(gl_FragColor) * 0.3;

    if (u_lightOn && u_whichTexture != -3) {
      if (u_whichTexture == -2 || u_whichTexture >= 1) {
        gl_FragColor = vec4(diffuse+ambient, 1.0);
      } else {
        gl_FragColor = vec4(specular+diffuse+ambient, 1);
      }
    }
  }`;


// Global variables
let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_whichTexture;
let u_lightPos;
let u_cameraPos;
let u_lightOn;
let u_LightColor;
let camera = new Camera();

function initTextures() {
  var image0 = new Image();  // Create the image object
  if (!image0) {
    console.log('Failed to create the image object');
    return false;
  }

  var image1 = new Image();  // Create the image object
  if (!image1) {
    console.log('Failed to create the image object');
    return false;
  }

  var image2 = new Image();
  if (!image2) {
    console.log('Failed to create the image object');
    return false;
  }

  // Register the event handler to be called on loading an image
  image0.onload = function(){ sendImageToTEXTURE0(image0); };
  // Tell the browser to load an image
  image0.src = 'resources/sky.jpg';

  // Add more texture loading
  image1.onload = function(){ sendImageToTEXTURE1(image1); };
  
  image1.src = 'resources/floor.png';

  image2.onload = function(){ sendImageToTEXTURE2(image2); };
  
  image2.src = 'resources/brick.png';
  
  return true;
}

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

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of a_Normal
  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
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

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }

  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return false;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return false;
  }

  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos) {
    console.log('Failed to get the storage location of u_lightPos');
    return false;
  }

  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if (!u_cameraPos) {
    console.log('Failed to get the storage location of u_cameraPos');
    return false;
  }

  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if (!u_lightOn) {
    console.log('Failed to get the storage location of u_lightOn');
    return false;
  }

  u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
  if (!u_LightColor) {
    console.log('Failed to get the storage location of u_LightColor');
    return false;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}


// Global variables related to UI elements
let g_globalAngleX = 180;
let g_globalAngleY = 0;

let g_FOV = 60;
let g_normalOn = false;

let g_lightPosition = [0, 10, 0];
let g_lightColor = [1.0, 1.0, 1.0];
let g_lightOn = true;
let lightAnim = false;


// Set up actions for the HTML UI elements
function addActionsForHTMLUI() {
  document.getElementById('normalOn').onclick = function() {g_normalOn=true};
  document.getElementById('normalOff').onclick = function() {g_normalOn=false};

  document.getElementById('lightOn').onclick = function() {g_lightOn=true};
  document.getElementById('lightOff').onclick = function() {g_lightOn=false};
  document.getElementById('lightAnimOn').onclick = function() {lightAnim=true};
  document.getElementById('lightAnimOff').onclick = function() {lightAnim=false};

  document.getElementById('resetCameraPos').onclick = function() { camera.reset() };
  document.getElementById('resetLightPos').onclick = function() { 
    g_lightPosition = [0, 10, 0];
    document.getElementById('light_sliderx').value = g_lightPosition[0]*25;
    document.getElementById('light_slidery').value = g_lightPosition[1]*25;
    document.getElementById('light_sliderz').value = g_lightPosition[2]*25;
  };


  document.getElementById('fov_slider').addEventListener('mousemove', function() { camera.fov = parseInt(this.value); });

  document.getElementById('rlight_slider').addEventListener('mousemove', function() { g_lightColor[0] = this.value/255; renderScene(); });
  document.getElementById('glight_slider').addEventListener('mousemove', function() { g_lightColor[1] = this.value/255; renderScene(); });
  document.getElementById('blight_slider').addEventListener('mousemove', function() { g_lightColor[2] = this.value/255; renderScene(); });

  document.getElementById('light_sliderx').addEventListener('mousemove', function() { g_lightPosition[0] = this.value/25; renderScene(); });
  document.getElementById('light_slidery').addEventListener('mousemove', function() { g_lightPosition[1] = this.value/25; renderScene(); });
  document.getElementById('light_sliderz').addEventListener('mousemove', function() { g_lightPosition[2] = this.value/25; renderScene(); });
}


function main() {
  
  // Set up canvas and GL variables
  setupWebGL();

  // Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

  // Set up actions for the HTML UI elements
  addActionsForHTMLUI();

  document.onkeydown = keydown;
  document.onkeyup = keyup;

  initTextures();
  
  canvas.addEventListener("click", async() => {  await canvas.requestPointerLock(); });
  canvas.addEventListener("mousemove", mouseMovement);

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  requestAnimationFrame(tick);
}


function mouseMovement(event) {
  if (document.pointerLockElement == canvas) {
    if (event.movementX < 0) {
      camera.panLeft(-event.movementX * 0.1);
    } else {
      camera.panRight(event.movementX * 0.1);
    }
    if (event.movementY < 0) {
      camera.panUp(-event.movementY * 0.1);
    } else {
      camera.panDown(event.movementY * 0.1);
    }
    if (event.movementX > 50 || event.movementX < -50) {
      console.log(event.movementX);
    }
    if (event.movementY > 50 || event.movementY < -50) {
      console.log(event.movementY);
    }
  }
}



var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;

// FPS counter calculation code from https://stackoverflow.com/questions/8279729/calculate-fps-in-canvas-using-requestanimationframe
// By sebix
var fps = 0;
var counter = [];

function tick(timestamp) {
  g_seconds = performance.now()/1000.0-g_startTime;
  while (counter.length > 0 && counter[0] <= timestamp - 1000) {
    counter.shift();
  }

  counter.push(timestamp)
  fps = counter.length;

  updateAnimationAngles();

  renderScene();

  requestAnimationFrame(tick);
}

function updateAnimationAngles() {
  g_legsAngle = 30*(1-Math.sin(5*g_seconds));
  g_tailAngleY = (45*Math.sin(8*g_seconds));
  g_bodyTransform = (1-Math.sin(5*g_seconds))/3;
  g_headTransform = -(0.03*Math.sin(5*g_seconds));
  g_bodyRotate += 0.5;

  if (lightAnim) {
    g_lightPosition[0] = 15*Math.cos(g_seconds);
    document.getElementById('light_sliderx').value = g_lightPosition[0]*25;

    g_lightPosition[2] = 15*Math.sin(g_seconds);
    document.getElementById('light_sliderz').value = g_lightPosition[2]*25;
  }
}

var forward = false;
var backward = false;
var left = false;
var right = false;
var panL = false;
var panR = false;
var panU = false;
var panD = false;

function keydown(ev) {
  if (ev.keyCode == 87) {
    forward = true;
  }
  if (ev.keyCode == 83) {
    backward = true;
  }
  if (ev.keyCode == 68) {
    right = true;
  }
  if (ev.keyCode == 65) {
    left = true;
  }
  if (ev.keyCode == 81) {
    panL = true;
  }
  if (ev.keyCode == 69) {
    panR = true;
  }
  if (ev.keyCode == 90) {
    panU = true;
  }
  if (ev.keyCode == 88) {
    panD = true;
  }
  if (ev.keyCode == 16) {
    camera.mult = 0.125;
  }
  if (ev.keyCode == 82) {
    camera.reset();
  }
}

function keyup(ev) {
  if (ev.keyCode == 87) {
    forward = false;
  }
  if (ev.keyCode == 83) {
    backward = false;
  }
  if (ev.keyCode == 68) {
    right = false;
  }
  if (ev.keyCode == 65) {
    left = false;
  }
  if (ev.keyCode == 81) {
    panL = false;
  }
  if (ev.keyCode == 69) {
    panR = false;
  }
  if (ev.keyCode == 90) {
    panU = false;
  }
  if (ev.keyCode == 88) {
    panD = false;
  }
  if (ev.keyCode == 16) {
    camera.mult = 0.05;
  }
}

function cameraMovement() {
  if (forward) {
    camera.moveForward();
  }
  if (backward) {
    camera.moveBackwards();
  }
  if (right) {
    camera.moveRight();
  }
  if (left) {
    camera.moveLeft();
  }
  if (panL) {
    camera.panLeft(1);
  }
  if (panR) {
    camera.panRight(1);
  }
  if (panU) {
    camera.panUp(1);
  }
  if (panD) {
    camera.panDown(1);
  }
}

function renderScene() {
  var startTime = performance.now(); // Debug information

  cameraMovement();

  // Set view of view matrix
  var viewMat = new Matrix4();
  viewMat.setLookAt(
    camera.g_eye.elements[0], camera.g_eye.elements[1], camera.g_eye.elements[2], 
    camera.g_at.elements[0], camera.g_at.elements[1], camera.g_at.elements[2], 
    camera.g_up.elements[0], camera.g_up.elements[1], camera.g_up.elements[2]
  );
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  
  // Set perspective of projection matrix
  var projMat = new Matrix4();
  projMat.setPerspective(camera.fov, canvas.width/canvas.height, .1, 1000);  
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);


  // Set global rotation matrix
  var globalRotMat = new Matrix4();
  globalRotMat.rotate(g_globalAngleX,0,1,0);
  globalRotMat.rotate((g_globalAngleY % 360), 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements)


  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);


  // Ground plane
  var floor = new Cube();
  floor.color = [1.0, 1.0, 1.0, 1.0];
  floor.textureNum = 1;
  floor.matrix.translate(0, -.75, 0.0);
  floor.matrix.scale(36,.25, 36);
  floor.matrix.translate(-.5, 0, -0.5);
  floor.renderFastest();

  // Test box
  var testBox = new Cube();
  testBox.color = [0.5, 0.5, 0.5, 1.0];
  if (g_normalOn) {
    testBox.textureNum = -3;
  } else {
    testBox.textureNum = -1;
  }
  testBox.matrix.scale(2, 2, 2);
  testBox.matrix.translate(2, 1, 0);
  testBox.renderFastest();
  
  // Skybox
  var skybox = new Cube();
  skybox.color = [135/255, 206/255, 235/255, 1.0];
  if (g_normalOn) {
    skybox.textureNum = -3;
  } else {
    skybox.textureNum = -2;
  }
  skybox.matrix.scale(-40, -40, -40);
  skybox.matrix.translate(-.5, -.5, -0.5);
  skybox.renderFastest();

  // Sphere
  var roundSphere = new Sphere();
  if (g_normalOn) {
    roundSphere.textureNum = -3;
  } else {
    roundSphere.textureNum = 0;
  }
  roundSphere.matrix.translate(-1, 3, 1);
  roundSphere.render();

  gl.uniform3f(u_lightPos, g_lightPosition[0], g_lightPosition[1], g_lightPosition[2]);

  gl.uniform3f(u_cameraPos, camera.g_eye.elements[0], camera.g_eye.elements[1], camera.g_eye.elements[2]);

  gl.uniform1i(u_lightOn, g_lightOn);

  gl.uniform3f(u_LightColor, g_lightColor[0], g_lightColor[1], g_lightColor[2]);

  // Light cube
  var light = new Cube();
  light.color = [1, 1, 0, 1];
  light.matrix.translate(g_lightPosition[0], g_lightPosition[1], g_lightPosition[2]);
  light.matrix.scale(-0.3, -0.3, -0.3);
  light.matrix.translate(-0.5, -0.5, -0.5);
  light.renderFastest();


  // Draw cubes (walls and border)
  drawMap();

  // Draw dog (shading is slightly weird)
  renderDog();

  // Debug information
  var duration = performance.now() - startTime;
  
  sendTextToHTML("ms: " + Math.ceil(duration) + " fps: " + Math.floor(fps), "numdot");
  sendTextToHTML("X: "+ camera.g_eye.elements[2].toPrecision(3), "x_coord");
  sendTextToHTML("Z: "+ camera.g_eye.elements[0].toPrecision(3), "z_coord");
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