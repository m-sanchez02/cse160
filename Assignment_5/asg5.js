import * as THREE from 'three';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    const scene = new THREE.Scene();

    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);

    const radius = 0.5;  
    const widthSegments = 12;  
    const heightSegments = 8;  
    const sphereGeometry = new THREE.SphereGeometry( radius, widthSegments, heightSegments );
    const sphereMaterial = new THREE.MeshPhongMaterial({color: 0xFF6800});
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    sphere.position.x = 2;

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const boxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const boxMaterial = new THREE.MeshPhongMaterial({color: 0x44aa88});
    const cube = new THREE.Mesh(boxGeometry, boxMaterial);
    scene.add(cube);

    const radiusTop = 0.5;
    const radiusBottom = 0.5;
    const cylinderHeight = 1;
    const radialSegments = 12;
    const cylinderGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, cylinderHeight, radialSegments);
    const cylinderMaterial = new THREE.MeshPhongMaterial({color: 0x0097FF});
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    scene.add(cylinder);
    cylinder.position.x = -2;

    function render(time) {
        time *= 0.001;  // convert time to seconds
        
        cube.rotation.x = time;
        cube.rotation.y = time;
        sphere.rotation.x = time;
        sphere.rotation.y = time;
        cylinder.rotation.x = time;

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

main();