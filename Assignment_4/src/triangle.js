class Triangle {
    constructor() {
        this.type = 'triangle';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
    }
    
    render() {
        var xy = this.position;
        var rgba = this.color;
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        
        // Draw
        var d = this.size/200.0; // delta
        drawTriangle([xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d]);
    }
}

function drawTriangle(vertices) {
    var n = 3; // Number of vertices
    
    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    
      // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

      // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
    
    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function drawCube(vertices, buffer) {
  var vertexBuffer;
  if (!buffer) {
    // Create a buffer object
    vertexBuffer = gl.createBuffer();
    console.log("creating buffer");
  } else {
    vertexBuffer = buffer;
  }

  if (!vertexBuffer) {
      console.log('Failed to create/load the buffer object');
      return -1;
  }

  var n = 3; // Number of vertices
  
    // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);
  
  // Draw
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

//////////////////////////////////////////////////////////////////////////

function drawCubeUVNormal(vertices, uv, norm, verBuf, uvBuf, normBuf) {
  var vertexBuffer;
  if (!verBuf) {
    // Create a buffer object
    vertexBuffer = gl.createBuffer();
    console.log("creating buffer");
    if (!vertexBuffer) {
      console.log('Failed to create/load the buffer object');
      return -1;
    }
  } else {
    vertexBuffer = verBuf;
  }

  var n = 3 // Number of vertices
  
  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  var uvBuffer;
  if (!uvBuf) {
    // Create a buffer object
    uvBuffer = gl.createBuffer();
    console.log("creating buffer");
    if (!uvBuffer) {
      console.log('Failed to create/load the buffer object');
      return -1;
    }
  } else {
    uvBuffer = uvBuf;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

    // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
  
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
  
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_UV);

  var normalBuffer;
  if (!normBuf) {
    normalBuffer = gl.createBuffer();
    console.log("creating buffer");
    if (!normalBuffer) {
      console.log('Failed to create/load the buffer object');
      return -1;
    }
  } else {
    normalBuffer = normBuf;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

    // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(norm), gl.DYNAMIC_DRAW);
  
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
  
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Normal);

  // Draw
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

////////////////////////////////////////////////////////////////////////////////////

function drawCubeFast(vertices, uv) {
  var vertexBuffer = gl.createBuffer();

  if (!vertexBuffer) {
      console.log('Failed to create/load the buffer object');
      return -1;
  }

  var n = vertices.length/3; // Number of vertices

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(a_Position);

  var uvBuffer = gl.createBuffer();
  if (!uvBuffer) {
    console.log('Failed to create/load the buffer object');
      return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
  
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(a_UV);

  // Draw
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

////////////////////////////////////////////////////////////////////////////////////

var g_vertexBuffer = null;
var g_uvBuffer = null;
var g_normalBuffer = null;
function initTriangle() {
  g_vertexBuffer = gl.createBuffer();
  if (!g_vertexBuffer) {
    console.log('Failed to create/load the buffer object');
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexBuffer);

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(a_Position);
}

function initUV() {
  g_uvBuffer = gl.createBuffer();
  if (!g_uvBuffer) {
    console.log('Failed to create/load the buffer object');
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, g_uvBuffer);

  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(a_UV);
}

function initNormal() {
  g_normalBuffer = gl.createBuffer();
  if (!g_normalBuffer) {
    console.log('Failed to create/load the buffer object');
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, g_normalBuffer);

  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(a_Normal);
}

function drawCubeFaster(vertices, uv, normals) {

  var n = vertices.length/3;
  if (g_vertexBuffer == null) {
    initTriangle();
  }

  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  

  if (g_uvBuffer == null) {
    initUV();
  }
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
  
  if (g_normalBuffer == null) {
    initNormal();
  }

  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);

  // Draw
  gl.drawArrays(gl.TRIANGLES, 0, n);

  g_vertexBuffer = null;
  g_uvBuffer = null;
  g_normalBuffer = null;
}
