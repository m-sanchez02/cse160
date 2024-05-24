class Camera {
    constructor() {
        this.fov = 60;
        this.g_eye = new Vector3([0,0,2]);
        this.g_at = new Vector3([0,0,-100]);
        this.g_up = new Vector3([0,1,0]);
        this.mult = 0.05;
    }
    
    moveForward() {
        var f = new Vector3();
        f.set(this.g_at);
        f.sub(this.g_eye);

        f.normalize();
        f.mul(this.mult);

        this.g_eye.add(f);
        this.g_at.add(f);
    }
    
    moveBackwards() {
        var b = new Vector3();
        b.set(this.g_eye);
        b.sub(this.g_at);

        b.normalize();
        b.mul(this.mult);

        this.g_eye.add(b);
        this.g_at.add(b);
    }
    
    moveLeft() {
        var l = new Vector3();
        l.set(this.g_at);
        l.sub(this.g_eye);

        var s = Vector3.cross(this.g_up, l);

        s.normalize();
        s.mul(this.mult);

        this.g_eye.add(s);
        this.g_at.add(s);
    }
    moveRight() {
        var r = new Vector3();
        r.set(this.g_at);
        r.sub(this.g_eye);

        var s = Vector3.cross(r, this.g_up);

        s.normalize();
        s.mul(this.mult);
        
        this.g_eye.add(s);
        this.g_at.add(s);
    }

    panLeft(alpha) {
        var f = new Vector3();
        f.set(this.g_at);
        f.sub(this.g_eye);

        var rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(alpha, this.g_up.elements[0], this.g_up.elements[1], this.g_up.elements[2]);
        var f_prime = rotationMatrix.multiplyVector3(f);

        this.g_at.set(this.g_eye);
        this.g_at.add(f_prime);
    }
    panRight(alpha) {
        var f = new Vector3();
        f.set(this.g_at);
        f.sub(this.g_eye);

        var rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(-alpha, this.g_up.elements[0], this.g_up.elements[1], this.g_up.elements[2]);
        var f_prime = rotationMatrix.multiplyVector3(f);

        this.g_at.set(this.g_eye);
        this.g_at.add(f_prime);
    }

    panUp(alpha) {
        var f = new Vector3();
        f.set(this.g_at);
        f.sub(this.g_eye);

        // Code on line 93 derived from HOF entry "Minecraft: Home Edition" by jwdicker 
        // https://people.ucsc.edu/~jwdicker/Asgn3/BlockyWorld.html
        var newG_UP = Vector3.cross(f, this.g_up);

        var rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(alpha, newG_UP.elements[0], newG_UP.elements[1], newG_UP.elements[2]);
        var f_prime = rotationMatrix.multiplyVector3(f);

        this.g_at.set(this.g_eye);
        this.g_at.add(f_prime);
    }
    panDown(alpha) {
        var f = new Vector3();
        f.set(this.g_at);
        f.sub(this.g_eye);

        // Code on line 109 derived from HOF entry "Minecraft: Home Edition" by jwdicker 
        // https://people.ucsc.edu/~jwdicker/Asgn3/BlockyWorld.html
        var newG_UP = Vector3.cross(f, this.g_up);

        var rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(-alpha, newG_UP.elements[0], newG_UP.elements[1], newG_UP.elements[2]);
        var f_prime = rotationMatrix.multiplyVector3(f);

        this.g_at.set(this.g_eye);
        this.g_at.add(f_prime);
    }

    reset() {
        this.g_eye.elements[0] = 0;
        this.g_eye.elements[1] = 0;
        this.g_eye.elements[2] = 2;

        this.g_at.elements[0] = 0;
        this.g_at.elements[1] = 0;
        this.g_at.elements[2] = 0;

        this.g_up.elements[0] = 0;
        this.g_up.elements[1] = 1;
        this.g_up.elements[2] = 0;
    }
}