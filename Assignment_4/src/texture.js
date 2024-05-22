function sendImageToTEXTURE0(image) {
    var texture0 = gl.createTexture();   // Create a texture object
    if (!texture0) {
        console.log('Failed to create the texture object');
        return false;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable texture unit0
    gl.activeTexture(gl.TEXTURE0);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture0);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler0, 0);

    console.log('finished loadTexture0');
}

function sendImageToTEXTURE1(image) {
var texture1 = gl.createTexture();   // Create a texture object
if (!texture1) {
    console.log('Failed to create the texture object');
    return false;
}

gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
// Enable texture unit0
gl.activeTexture(gl.TEXTURE1);
// Bind the texture object to the target
gl.bindTexture(gl.TEXTURE_2D, texture1);

// Set the texture parameters
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
// Set the texture image
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

// Set the texture unit 0 to the sampler
gl.uniform1i(u_Sampler1, 1);

console.log('finished loadTexture1');
}

function sendImageToTEXTURE2(image) {
    var texture2 = gl.createTexture();   // Create a texture object
    if (!texture2) {
        console.log('Failed to create the texture object');
        return false;
    }
    
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable texture unit0
    gl.activeTexture(gl.TEXTURE2);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    
    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    
    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler2, 2);
    
    console.log('finished loadTexture2');
}