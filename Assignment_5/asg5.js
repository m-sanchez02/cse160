import * as THREE from 'three';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';

// Code built off of the Three.js manual and documentation, links provide on the Canvas for the assignment
function main() {
    // Setup canvas and renderer
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

    // Setup camera
    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 4;

    // Create a scene
    const scene = new THREE.Scene();

    // Change background color of scene
    // Line of code resourced from Stack Overflow, credit to Samuel RIGAUD
    // https://stackoverflow.com/questions/16177056/changing-three-js-background-to-transparent-or-other-color
    scene.background = new THREE.Color(0x808080); 

    // Add a light source
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);

    // Add a sphere
    const radius = 0.5;   
    const widthSegments = 12;  
    const heightSegments = 8;  
    const sphereGeometry = new THREE.SphereGeometry( radius, widthSegments, heightSegments );
    const sphereMaterial = new THREE.MeshPhongMaterial({color: 0xFF6800});
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    sphere.position.x = 2;

    // Add a cube
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const boxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    // Load texture image for cube
    const loader = new THREE.TextureLoader();
    const texture = loader.load('resources/images/bricks.jpg');
    texture.colorSpace = THREE.SRGBColorSpace;

    const boxMaterial = new THREE.MeshPhongMaterial({map: texture});
    const cube = new THREE.Mesh(boxGeometry, boxMaterial);
    scene.add(cube);
    cube.position.y = 1;

    // Add a cylinder
    const radiusTop = 0.5;
    const radiusBottom = 0.5;
    const cylinderHeight = 1;
    const radialSegments = 12;
    const cylinderGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, cylinderHeight, radialSegments);
    const cylinderMaterial = new THREE.MeshPhongMaterial({color: 0x0097FF});
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    scene.add(cylinder);
    cylinder.position.x = -2;

    // Custom 3D model (Nissan GTR by David Sirera [CC-BY] via Poly Pizza)
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    mtlLoader.load('resources/models/GTR.mtl', (mtl) => {
        mtl.preload();
        objLoader.setMaterials(mtl);
    })
    objLoader.load('resources/models/GTR.obj', (root) => {
        scene.add(root);
        root.scale.set(0.5, 0.5, 0.5);
        root.position.y = -0.5;
        root.rotation.y = 0.5;
    });

    // Render function that renders the objects, rotating over time
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