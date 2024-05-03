class Camera {
    constructor() {
        this.fov = 60;
        this.g_eye = new Vector3([0,0,2]);
        this.g_at = new Vector3([0,0,-100]);
        this.g_up = new Vector3([0,1,0]);
        this.alpha = 15;
    }
    
    moveForward() {
        var f = new Vector3();
        f.set(this.g_at);
        f.sub(this.g_eye);

        f.normalize();
        f.mul(0.2);

        this.g_eye.add(f);
        this.g_at.add(f);
    }
    
    moveBackwards() {
        var b = new Vector3();
        b.set(this.g_eye);
        b.sub(this.g_at);

        b.normalize();
        b.mul(0.2);

        this.g_eye.add(b);
        this.g_at.add(b);
    }
    
    moveLeft() {
        var l = new Vector3();
        l.set(this.g_at);
        l.sub(this.g_eye);

        var s = Vector3.cross(this.g_up, l);

        s.normalize();
        s.mul(0.2);

        this.g_eye.add(s);
        this.g_at.add(s);
    }
    moveRight() {
        var r = new Vector3();
        r.set(this.g_at);
        r.sub(this.g_eye);

        var s = Vector3.cross(r, this.g_up);

        s.normalize();
        s.mul(0.2);
        
        this.g_eye.add(s);
        this.g_at.add(s);
    }

    panLeft() {
        var f = new Vector3();
        f.set(this.g_at);
        f.sub(this.g_eye);

        var rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(this.alpha, this.g_up.elements[0], this.g_up.elements[1], this.g_up.elements[2]);
        var f_prime = rotationMatrix.multiplyVector3(f);

        this.g_at.set(this.g_eye);
        this.g_at.add(f_prime);
    }
    panRight() {
        var f = new Vector3();
        f.set(this.g_at);
        f.sub(this.g_eye);

        var rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(-this.alpha, this.g_up.elements[0], this.g_up.elements[1], this.g_up.elements[2]);
        var f_prime = rotationMatrix.multiplyVector3(f);

        this.g_at.set(this.g_eye);
        this.g_at.add(f_prime);
    }
}