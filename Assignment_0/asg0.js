// asg0.js
var canvas = document.getElementById('example');

// Get the rendering context for 2DCG
var ctx = canvas.getContext('2d');

function main() {
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    // Transformed canvas to appropriate x/y axis direction 
    // credit: https://stackoverflow.com/questions/4335400/in-html5-canvas-can-i-make-the-y-axis-go-up-rather-than-down
    ctx.transform(1, 0, 0, -1, 0, canvas.height); 

    // Fill canvas with black color
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Instantiate a new vector
    let v1 = new Vector3([2.25, 2.25, 0]);

    // Draw vector on canvas
    drawVector(v1, "red");
}

// Derived and modified from CSE160 Assignment 0 Youtube Helper Videos
function drawVector(v, color) {
    // Define center of canvas
    let cx = canvas.width/2;
    let cy = canvas.height/2;

    // Set given line color
    ctx.strokeStyle = color;

    // Create the path of the line using given vector points
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + (v.elements[0]*20), cy + (v.elements[1]*20));
    ctx.stroke();
}

function handleDrawEvent() {
    // Reset the canvas to a blank state
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Get the values of the x and y coordinate from user input for both vectors
    let x1 = document.getElementById("v1-x").value;
    let y1 = document.getElementById("v1-y").value;

    let x2 = document.getElementById("v2-x").value;
    let y2 = document.getElementById("v2-y").value;

    // Instantiate new vectors v1 and v2
    let v1 = new Vector3([x1, y1, 0]);
    let v2 = new Vector3([x2, y2, 0]);

    // Draw vectors v1 and v2 on canvas
    drawVector(v1, "red");
    drawVector(v2, "blue");
}

function handleDrawOperationEvent() {
    // Reset the canvas to a blank state
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Get the values of the x and y coordinate from user input for both vectors
    let x1 = document.getElementById("v1-x").value;
    let y1 = document.getElementById("v1-y").value;

    let x2 = document.getElementById("v2-x").value;
    let y2 = document.getElementById("v2-y").value;

    // Instantiate new vectors v1 and v2
    let v1 = new Vector3([x1, y1, 0]);
    let v2 = new Vector3([x2, y2, 0]);

    // Draw vectors v1 and v2 on canvas
    drawVector(v1, "red");
    drawVector(v2, "blue");

    // Get selected operation
    let op = document.getElementById("op-select").value;

    // Get scalar value (for mul and div)
    let scalar = document.getElementById("scalar").value;

    // Perform desired operation on vector v1
    switch(op){
        case "add":
            // Add vector v1 with vector v2
            v1.add(v2);

            // Draw modified vector v1 on canvas
            drawVector(v1, "green");
            break;
        case "sub":
            // Subtract vector v1 with vector v2
            v1.sub(v2);

            // Draw modified vector v1 on canvas
            drawVector(v1, "green");
            break;
        case "div":
            // Divide vectors v1 and v2 with given scalar value
            v1.div(scalar);
            v2.div(scalar);

            // Draw modified vectors v1 and v2 on canvas
            drawVector(v1, "green");
            drawVector(v2, "green");
            break;
        case "mul":
            // Multiply vectors v1 and v2 with given scalar value
            v1.mul(scalar);
            v2.mul(scalar);

            // Draw modified vectors v1 and v2 on canvas
            drawVector(v1, "green");
            drawVector(v2, "green");
            break;
        case "mag":
            // Print the magnitudes of vectors v1 and v2 into console
            console.log("Magnitude v1: " + v1.magnitude());
            console.log("Magnitude v2: " + v2.magnitude());
            break;
        case "nor":
            // Normalize vectors v1 and v2
            v1.normalize();
            v2.normalize();

            // Draw modified vectors v1 and v2 on canvas
            drawVector(v1, "green");
            drawVector(v2, "green");
            break;
        case "dot":
            // Call angleBetween, passing vectors v1 and v2, then printing result in console
            angleBetween(v1, v2);
            break;
        case "cross":
            // Call areaTriangle, passing vectors v1 and v2, then printing result in console
            areaTriangle(v1, v2);
            break;
        case "default":
            break;
    }
}

// Calculates the angle between two vectors
function angleBetween(v1, v2) {
    let d = Vector3.dot(v1, v2);

    let m1 = v1.magnitude();
    let m2 = v2.magnitude();

    let a = Math.acos(d / (m1 * m2)) * (180/Math.PI);
    console.log("Angle: " + a);
}

// Calculates the area of the triangle formed by two vectors
function areaTriangle(v1, v2) {
    let v3 = Vector3.cross(v1, v2);

    console.log("Area of the triangle: " + (v3.magnitude()/2));
}// asg0.js
var canvas = document.getElementById('example');

// Get the rendering context for 2DCG
var ctx = canvas.getContext('2d');

function main() {
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    // Transformed canvas to appropriate x/y axis direction 
    // credit: https://stackoverflow.com/questions/4335400/in-html5-canvas-can-i-make-the-y-axis-go-up-rather-than-down
    ctx.transform(1, 0, 0, -1, 0, canvas.height); 

    // Fill canvas with black color
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Instantiate a new vector
    let v1 = new Vector3([2.25, 2.25, 0]);

    // Draw vector on canvas
    drawVector(v1, "red");
}

// Derived and modified from CSE160 Assignment 0 Youtube Helper Videos
function drawVector(v, color) {
    // Define center of canvas
    let cx = canvas.width/2;
    let cy = canvas.height/2;

    // Set given line color
    ctx.strokeStyle = color;

    // Create the path of the line using given vector points
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + (v.elements[0]*20), cy + (v.elements[1]*20));
    ctx.stroke();
}

function handleDrawEvent() {
    // Reset the canvas to a blank state
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Get the values of the x and y coordinate from user input for both vectors
    let x1 = document.getElementById("v1-x").value;
    let y1 = document.getElementById("v1-y").value;

    let x2 = document.getElementById("v2-x").value;
    let y2 = document.getElementById("v2-y").value;

    // Instantiate new vectors v1 and v2
    let v1 = new Vector3([x1, y1, 0]);
    let v2 = new Vector3([x2, y2, 0]);

    // Draw vectors v1 and v2 on canvas
    drawVector(v1, "red");
    drawVector(v2, "blue");
}

function handleDrawOperationEvent() {
    // Reset the canvas to a blank state
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Get the values of the x and y coordinate from user input for both vectors
    let x1 = document.getElementById("v1-x").value;
    let y1 = document.getElementById("v1-y").value;

    let x2 = document.getElementById("v2-x").value;
    let y2 = document.getElementById("v2-y").value;

    // Instantiate new vectors v1 and v2
    let v1 = new Vector3([x1, y1, 0]);
    let v2 = new Vector3([x2, y2, 0]);

    // Draw vectors v1 and v2 on canvas
    drawVector(v1, "red");
    drawVector(v2, "blue");

    // Get selected operation
    let op = document.getElementById("op-select").value;

    // Get scalar value (for mul and div)
    let scalar = document.getElementById("scalar").value;

    // Perform desired operation on vector v1
    switch(op){
        case "add":
            // Add vector v1 with vector v2
            v1.add(v2);

            // Draw modified vector v1 on canvas
            drawVector(v1, "green");
            break;
        case "sub":
            // Subtract vector v1 with vector v2
            v1.sub(v2);

            // Draw modified vector v1 on canvas
            drawVector(v1, "green");
            break;
        case "div":
            // Divide vectors v1 and v2 with given scalar value
            v1.div(scalar);
            v2.div(scalar);

            // Draw modified vectors v1 and v2 on canvas
            drawVector(v1, "green");
            drawVector(v2, "green");
            break;
        case "mul":
            // Multiply vectors v1 and v2 with given scalar value
            v1.mul(scalar);
            v2.mul(scalar);

            // Draw modified vectors v1 and v2 on canvas
            drawVector(v1, "green");
            drawVector(v2, "green");
            break;
        case "mag":
            // Print the magnitudes of vectors v1 and v2 into console
            console.log("Magnitude v1: " + v1.magnitude());
            console.log("Magnitude v2: " + v2.magnitude());
            break;
        case "nor":
            // Normalize vectors v1 and v2
            v1.normalize();
            v2.normalize();

            // Draw modified vectors v1 and v2 on canvas
            drawVector(v1, "green");
            drawVector(v2, "green");
            break;
        case "dot":
            // Call angleBetween, passing vectors v1 and v2, then printing result in console
            angleBetween(v1, v2);
            break;
        case "cross":
            // Call areaTriangle, passing vectors v1 and v2, then printing result in console
            areaTriangle(v1, v2);
            break;
        case "default":
            break;
    }
}

// Calculates the angle between two vectors
function angleBetween(v1, v2) {
    let d = Vector3.dot(v1, v2);

    let m1 = v1.magnitude();
    let m2 = v2.magnitude();

    let a = Math.acos(d / (m1 * m2)) * (180/Math.PI);
    console.log("Angle: " + a);
}

// Calculates the area of the triangle formed by two vectors
function areaTriangle(v1, v2) {
    let v3 = Vector3.cross(v1, v2);

    console.log("Area of the triangle: " + (v3.magnitude()/2));
}