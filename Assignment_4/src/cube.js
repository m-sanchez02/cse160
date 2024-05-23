class Cube {
    constructor() {
        this.type = 'cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.textureNum=-2;
        this.cubeVerts = [
            0.0, 0.0, 0.0,   1.0, 1.0, 0.0,   1.0, 0.0, 0.0,
            0.0, 0.0, 0.0,   0.0, 1.0, 0.0,   1.0, 1.0, 0.0,
            1.0, 0.0, 1.0,   1.0, 1.0, 1.0,   0.0, 1.0, 1.0,
            1.0, 0.0, 1.0,   0.0, 1.0, 1.0,   0.0, 0.0, 1.0,
            1.0, 0.0, 0.0,   1.0, 1.0, 0.0,   1.0, 1.0, 1.0,
            1.0, 0.0, 0.0,   1.0, 1.0, 1.0,   1.0, 0.0, 1.0,
            0.0, 0.0, 1.0,   0.0, 1.0, 1.0,   0.0, 1.0, 0.0,
            0.0, 0.0, 1.0,   0.0, 1.0, 0.0,   0.0, 0.0, 0.0,
            1.0, 0.0, 0.0,   1.0, 0.0, 1.0,   0.0, 0.0, 1.0,
            1.0, 0.0, 0.0,   0.0, 0.0, 1.0,   0.0, 0.0, 0.0,
            0.0, 1.0, 0.0,   0.0, 1.0, 1.0,   1.0, 1.0, 1.0,
            0.0, 1.0, 0.0,   1.0, 1.0, 1.0,   1.0, 1.0, 0.0
        ]; 
        this.cubeUV = [
            1,0, 0,1, 0,0,
            1,0, 1,1, 0,1,
            1,0, 1,1, 0,1,
            1,0, 0,1, 0,0,
            1,0, 1,1, 0,1,
            1,0, 0,1, 0,0,
            1,0, 1,1, 0,1,
            1,0, 0,1, 0,0,
            1,0, 1,1, 0,1,
            1,0, 0,1, 0,0,
            1,0, 1,1, 0,1,
            1,0, 0,1, 0,0
        ];
        this.cubeNormals = [
            0,0,-1, 0,0,-1, 0,0,-1,
            0,0,-1, 0,0,-1, 0,0,-1,
            0,1,0, 0,1,0, 0,1,0,
            0,1,0, 0,1,0, 0,1,0,
            1,0,0, 1,0,0, 1,0,0,
            1,0,0, 1,0,0, 1,0,0,
            -1,0,0, -1,0,0, -1,0,0,
            -1,0,0, -1,0,0, -1,0,0,
            0,-1,0, 0,-1,0, 0,-1,0,
            0,-1,0, 0,-1,0, 0,-1,0,
            0,0,1, 0,0,1, 0,0,1,
            0,0,1, 0,0,1, 0,0,1
        ];
    }
    
    render() {
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, this.textureNum);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        var vertexBuffer = gl.createBuffer();
        var uvBuffer = gl.createBuffer();
        var normalBuffer = gl.createBuffer();
        if (!vertexBuffer || !uvBuffer || !normalBuffer) {
            console.log('Failed to create/load the buffer object');
            return -1;
        }
        
        // Front (the UV coords are flipped compared to the other sides 
        // due to triangle order being flipped aka top tri then bot tri
        // while front is bot tri then top tri)

        drawCubeUVNormal( [0.0, 0.0, 0.0,   1.0, 1.0, 0.0,   1.0, 0.0, 0.0], [1,0, 0,1, 0,0], [0,0,-1,   0,0,-1,   0,0,-1], vertexBuffer, uvBuffer, normalBuffer);
        drawCubeUVNormal( [0.0, 0.0, 0.0,   0.0, 1.0, 0.0,   1.0, 1.0, 0.0], [1,0, 1,1, 0,1], [0,0,-1,   0,0,-1,   0,0,-1], vertexBuffer, uvBuffer, normalBuffer);

        // Back
        drawCubeUVNormal( [1.0, 0.0, 1.0,   1.0, 1.0, 1.0,   0.0, 1.0, 1.0], [1,0, 1,1, 0,1], [0,0,1,   0,0,1,   0,0,1], vertexBuffer, uvBuffer, normalBuffer);
        drawCubeUVNormal( [1.0, 0.0, 1.0,   0.0, 1.0, 1.0,   0.0, 0.0, 1.0], [1,0, 0,1, 0,0], [0,0,1,   0,0,1,   0,0,1], vertexBuffer, uvBuffer, normalBuffer);

        // Right
        drawCubeUVNormal( [1.0, 0.0, 0.0,   1.0, 1.0, 0.0,   1.0, 1.0, 1.0], [1,0, 1,1, 0,1], [1,0,0,   1,0,0,   1,0,0], vertexBuffer, uvBuffer, normalBuffer);
        drawCubeUVNormal( [1.0, 0.0, 0.0,   1.0, 1.0, 1.0,   1.0, 0.0, 1.0], [1,0, 0,1, 0,0], [1,0,0,   1,0,0,   1,0,0], vertexBuffer, uvBuffer, normalBuffer);
        
        // Left
        drawCubeUVNormal( [0.0, 0.0, 1.0,   0.0, 1.0, 1.0,   0.0, 1.0, 0.0], [1,0, 1,1, 0,1], [-1,0,0,   -1,0,0,   -1,0,0], vertexBuffer, uvBuffer, normalBuffer);
        drawCubeUVNormal( [0.0, 0.0, 1.0,   0.0, 1.0, 0.0,   0.0, 0.0, 0.0], [1,0, 0,1, 0,0], [-1,0,0,   -1,0,0,   -1,0,0], vertexBuffer, uvBuffer, normalBuffer);
        
        // Bottom
        drawCubeUVNormal( [1.0, 0.0, 0.0,   1.0, 0.0, 1.0,   0.0, 0.0, 1.0], [1,0, 1,1, 0,1], [0,-1,0,   0,-1,0,   0,-1,0], vertexBuffer, uvBuffer, normalBuffer);
        drawCubeUVNormal( [1.0, 0.0, 0.0,   0.0, 0.0, 1.0,   0.0, 0.0, 0.0], [1,0, 0,1, 0,0], [0,-1,0,   0,-1,0,   0,-1,0], vertexBuffer, uvBuffer, normalBuffer);
        
        // Top
        drawCubeUVNormal( [0.0, 1.0, 0.0,   0.0, 1.0, 1.0,   1.0, 1.0, 1.0], [1,0, 1,1, 0,1], [0,1,0,   0,1,0,   0,1,0], vertexBuffer, uvBuffer, normalBuffer);
        drawCubeUVNormal( [0.0, 1.0, 0.0,   1.0, 1.0, 1.0,   1.0, 1.0, 0.0], [1,0, 0,1, 0,0], [0,1,0,   0,1,0,   0,1,0], vertexBuffer, uvBuffer, normalBuffer);
    }

    renderFast() {
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, this.textureNum);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        var vertices = [];

        vertices = vertices.concat([0.0, 0.0, 0.0,   1.0, 1.0, 0.0,   1.0, 0.0, 0.0]);
        vertices = vertices.concat([0.0, 0.0, 0.0,   0.0, 1.0, 0.0,   1.0, 1.0, 0.0]);

        vertices = vertices.concat([1.0, 0.0, 1.0,   1.0, 1.0, 1.0,   0.0, 1.0, 1.0]);
        vertices = vertices.concat([1.0, 0.0, 1.0,   0.0, 1.0, 1.0,   0.0, 0.0, 1.0]);

        vertices = vertices.concat([1.0, 0.0, 0.0,   1.0, 1.0, 0.0,   1.0, 1.0, 1.0]);
        vertices = vertices.concat([1.0, 0.0, 0.0,   1.0, 1.0, 1.0,   1.0, 0.0, 1.0]);

        vertices = vertices.concat([0.0, 0.0, 1.0,   0.0, 1.0, 1.0,   0.0, 1.0, 0.0]);
        vertices = vertices.concat([0.0, 0.0, 1.0,   0.0, 1.0, 0.0,   0.0, 0.0, 0.0]);

        vertices = vertices.concat([1.0, 0.0, 0.0,   1.0, 0.0, 1.0,   0.0, 0.0, 1.0]);
        vertices = vertices.concat([1.0, 0.0, 0.0,   0.0, 0.0, 1.0,   0.0, 0.0, 0.0]);

        vertices = vertices.concat([0.0, 1.0, 0.0,   0.0, 1.0, 1.0,   1.0, 1.0, 1.0]);
        vertices = vertices.concat([0.0, 1.0, 0.0,   1.0, 1.0, 1.0,   1.0, 1.0, 0.0]);

        var uv = [];
        uv = uv.concat([1,0, 0,1, 0,0])
        uv = uv.concat([1,0, 1,1, 0,1])

        uv = uv.concat([1,0, 1,1, 0,1])
        uv = uv.concat([1,0, 0,1, 0,0])

        uv = uv.concat([1,0, 1,1, 0,1])
        uv = uv.concat([1,0, 0,1, 0,0])

        uv = uv.concat([1,0, 1,1, 0,1])
        uv = uv.concat([1,0, 0,1, 0,0])

        uv = uv.concat([1,0, 1,1, 0,1])
        uv = uv.concat([1,0, 0,1, 0,0])

        uv = uv.concat([1,0, 1,1, 0,1])
        uv = uv.concat([1,0, 0,1, 0,0])

        drawCubeFaster(vertices, uv);
    }

    renderFaster() {
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, this.textureNum);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        if (g_vertexBuffer == null) {
            initTriangle();
        }
        
          // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.cubeVerts), gl.DYNAMIC_DRAW);
        
        
        if (g_uvBuffer == null) {
            initUV();
        }
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.cubeUV), gl.DYNAMIC_DRAW);
        
        if (g_normalBuffer == null) {
            initNormal();
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.cubeNormals), gl.DYNAMIC_DRAW);

        // Draw
        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }
}

