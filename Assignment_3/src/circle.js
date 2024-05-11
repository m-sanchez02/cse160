class Circle {
    constructor() {
        this.type = 'circle';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
        this.count = 10;
    }
    
    render() {
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;
        var segments = this.count;
        
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        var d = size/200.0; // delta
        var alpha = 360/segments; // alpha
        for (var angle = 0; angle < 360; angle+=alpha) {
            // Specify center point and angles
            var center = [xy[0], xy[1]];
            var angle1 = angle;
            var angle2 = angle + alpha;

            // Calculate xy endpoint for vertices that stem from center point, including size
            var vertex1 = [Math.cos(angle1*Math.PI/180)*d, Math.sin(angle1*Math.PI/180)*d];
            var vertex2 = [Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d];

            // Add calculated endpoints to the center point
            var point_a = [center[0]+vertex1[0], center[1]+vertex1[1]];
            var point_b = [center[0]+vertex2[0], center[1]+vertex2[1]];

            // Draw
            drawTriangle([center[0], center[1], point_a[0], point_a[1], point_b[0], point_b[1]]);
        }
    }
}
