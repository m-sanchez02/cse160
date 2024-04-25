class Cube {
    constructor() {
        this.type = 'cube';
        //this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        //this.size = 5.0;
        //this.settings = false;
        this.matrix = new Matrix4();
    }
    
    render() {
        var rgba = this.color;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        
        // Front
        drawTriangle3D( [0.0, 0.0, 0.0,   1.0, 1.0, 0.0,   1.0, 0.0, 0.0] );
        drawTriangle3D( [0.0, 0.0, 0.0,   0.0, 1.0, 0.0,   1.0, 1.0, 0.0] );

        // Back
        drawTriangle3D( [1.0, 0.0, 1.0,   1.0, 1.0, 1.0,   0.0, 1.0, 1.0] );
        drawTriangle3D( [1.0, 0.0, 1.0,   0.0, 1.0, 1.0,   0.0, 0.0, 1.0] );
        
        // Right
        drawTriangle3D( [1.0, 0.0, 0.0,   1.0, 1.0, 0.0,   1.0, 1.0, 1.0] );
        drawTriangle3D( [1.0, 0.0, 0.0,   1.0, 1.0, 1.0,   1.0, 0.0, 1.0] );
        
        // Left
        drawTriangle3D( [0.0, 0.0, 1.0,   0.0, 1.0, 1.0,   0.0, 1.0, 0.0] );
        drawTriangle3D( [0.0, 0.0, 1.0,   0.0, 1.0, 0.0,   0.0, 0.0, 0.0] );
        
        // Bottom
        drawTriangle3D( [1.0, 0.0, 0.0,   1.0, 0.0, 1.0,   0.0, 0.0, 1.0] );
        drawTriangle3D( [1.0, 0.0, 0.0,   0.0, 0.0, 1.0,   0.0, 0.0, 0.0] );
        
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);

        // Top
        drawTriangle3D( [0.0, 1.0, 0.0,   0.0, 1.0, 1.0,   1.0, 1.0, 1.0] );
        drawTriangle3D( [0.0, 1.0, 0.0,   1.0, 1.0, 1.0,   1.0, 1.0, 0.0] );
        
        
        
    }
}