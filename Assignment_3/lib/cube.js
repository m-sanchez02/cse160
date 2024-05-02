class Cube {
    constructor() {
        this.type = 'cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.frontc = [1.0, 1.0, 1.0, 1.0];
    }
    
    render() {
        var rgba = this.color;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        var vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
            console.log('Failed to create/load the buffer object');
            return -1;
        }
        
        // Front
        drawCubeUV( [0.0, 0.0, 0.0,   1.0, 1.0, 0.0,   1.0, 0.0, 0.0], [0,0, 1,1, 1,0], vertexBuffer );
        drawCubeUV( [0.0, 0.0, 0.0,   0.0, 1.0, 0.0,   1.0, 1.0, 0.0], [0,0, 0,1, 1,1], vertexBuffer );

        gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);

        // Back
        drawCubeUV( [1.0, 0.0, 1.0,   1.0, 1.0, 1.0,   0.0, 1.0, 1.0], [1,0, 1,1, 0,1], vertexBuffer );
        drawCubeUV( [1.0, 0.0, 1.0,   0.0, 1.0, 1.0,   0.0, 0.0, 1.0], [1,0, 0,1, 0,0], vertexBuffer );

        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
        
        // Right
        drawCubeUV( [1.0, 0.0, 0.0,   1.0, 1.0, 0.0,   1.0, 1.0, 1.0], [1,0, 1,1, 1,1], vertexBuffer );
        drawCubeUV( [1.0, 0.0, 0.0,   1.0, 1.0, 1.0,   1.0, 0.0, 1.0], [1,0, 1,1, 1,0], vertexBuffer );
        
        gl.uniform4f(u_FragColor, rgba[0]*1.05, rgba[1]*1.05, rgba[2]*1.05, rgba[3]);

        // Left
        drawCubeUV( [0.0, 0.0, 1.0,   0.0, 1.0, 1.0,   0.0, 1.0, 0.0], [0,0, 0,1, 0,1], vertexBuffer );
        drawCubeUV( [0.0, 0.0, 1.0,   0.0, 1.0, 0.0,   0.0, 0.0, 0.0], [0,0, 0,1, 0,0], vertexBuffer );
        
        gl.uniform4f(u_FragColor, rgba[0]*.75, rgba[1]*.75, rgba[2]*.75, rgba[3]);

        // Bottom
        drawCubeUV( [1.0, 0.0, 0.0,   1.0, 0.0, 1.0,   0.0, 0.0, 1.0], [1,0, 1,0, 0,0], vertexBuffer );
        drawCubeUV( [1.0, 0.0, 0.0,   0.0, 0.0, 1.0,   0.0, 0.0, 0.0], [1,0, 0,0, 0,0], vertexBuffer );
        
        gl.uniform4f(u_FragColor, rgba[0]*1.1, rgba[1]*1.1, rgba[2]*1.1, rgba[3]);

        // Top
        drawCubeUV( [0.0, 1.0, 0.0,   0.0, 1.0, 1.0,   1.0, 1.0, 1.0], [0,1, 0,1, 1,1], vertexBuffer );
        drawCubeUV( [0.0, 1.0, 0.0,   1.0, 1.0, 1.0,   1.0, 1.0, 0.0], [0,1, 1,1, 1,1], vertexBuffer );
        
        
        
    }
}