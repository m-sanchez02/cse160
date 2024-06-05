import * as THREE from 'three';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import {PointerLockControls} from '../Assignment_5/resources/modifiedAddons/PointerLockControls.js';

// Code built off of the Three.js manual and documentation, links provide on the Canvas for the assignment
function main() {
    // Setup canvas and renderer
    const canvas = document.querySelector('#c');

    const clock = new THREE.Clock();
    
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas, alpha: true});

    // Setup camera
    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 15;
    camera.position.y = 5;

    // Create a scene
    const scene = new THREE.Scene();

    {
        const loader = new THREE.CubeTextureLoader();

        // Source of panorama image
        // https://www.vecteezy.com/photo/11244770-panorama-milky-way-galaxy-bridge-as-seen-from-thailand-on-a-clear-summer-night
        const texture = loader.load([
            'resources/images/cubemap/px.jpg',
            'resources/images/cubemap/nx.jpg',
            'resources/images/cubemap/py.jpg',
            'resources/images/cubemap/ny.jpg',
            'resources/images/cubemap/pz.jpg',
            'resources/images/cubemap/nz.jpg'
        ]);
        scene.background = texture;

        const color = 0xFFFFFF;
        const near = 1;
        const far = 75;
        scene.fog = new THREE.Fog(color, near, far);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const controls = new PointerLockControls(camera, document.body);

    canvas.addEventListener('click', function() {
        controls.lock();
    });

    let forward = false;
    let backward = false;
    let right = false;
    let left = false;
    document.onkeydown = keydown;
    document.onkeyup = keyup;

    function keydown(ev) {
        if (ev.keyCode == 87) {
            forward = true;
        }
        if (ev.keyCode == 83) {
            backward = true;
        }
        if (ev.keyCode == 68) {
            right = true;
        }
        if (ev.keyCode == 65) {
            left = true;
        }
    }
    
    function keyup(ev) {
        if (ev.keyCode == 87) {
            forward = false;
        }
        if (ev.keyCode == 83) {
            backward = false;
        }
        if (ev.keyCode == 68) {
            right = false;
        }
        if (ev.keyCode == 65) {
            left = false;
        }
    }

    function cameraMovement() {
        if (forward) {
            controls.moveForward(0.03);
        }
        if (backward) {
            controls.moveForward(-0.03);
        }
        if (right) {
            controls.moveRight(0.03);
        }
        if (left) {
            controls.moveRight(-0.03);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Directional Light (sky)
    const color = 0xFFFFFF;
    const intensity = 0.25;
    const directionalLight = new THREE.DirectionalLight(color, intensity);
    directionalLight.position.set(-1, 3, 4);
    scene.add(directionalLight);

    // Ambient Light (blueish hue around world)
    const ambientLight = new THREE.AmbientLight(0x0335fc, 2.5);
    ambientLight.position.set(0, 2, 0);
    scene.add(ambientLight);

    // Point Light (campfire light)
    const pointLight = new THREE.PointLight(0xFFFFFF, 30);
    pointLight.position.set(-8.4, 1, -0.5);
    scene.add(pointLight);

    // Spot Light (car headlights)
    // GTR
    const spotlightGTRL = new THREE.SpotLight(0xFFFFFF, 150);
    scene.add(spotlightGTRL);
    scene.add(spotlightGTRL.target);
    spotlightGTRL.angle = Math.PI/4;
    spotlightGTRL.position.set(12, -0.35, -14);
    spotlightGTRL.target.position.set(11.5, 2, 17);
    spotlightGTRL.penumbra = 0.5;
    
    const spotlightGTRR = new THREE.SpotLight(0xFFFFFF, 150);
    scene.add(spotlightGTRR);
    scene.add(spotlightGTRR.target);
    spotlightGTRR.angle = Math.PI/4;
    spotlightGTRR.position.set(11, -0.35, -14);
    spotlightGTRR.target.position.set(11.5, 2, 17);
    spotlightGTRR.penumbra = 0.5;

    // Cop
    const spotlightCopL = new THREE.SpotLight(0xFFFFFF, 150);
    scene.add(spotlightCopL);
    scene.add(spotlightCopL.target);
    spotlightCopL.angle = Math.PI/4;
    spotlightCopL.position.set(12, -0.35, 3.75);
    spotlightCopL.target.position.set(11.5, 2, 17);
    spotlightCopL.penumbra = 0.5;
    
    const spotlightCopR = new THREE.SpotLight(0xFFFFFF, 150);
    scene.add(spotlightCopR);
    scene.add(spotlightCopR.target);
    spotlightCopR.angle = Math.PI/4;
    spotlightCopR.position.set(11, -0.35, 3.75);
    spotlightCopR.target.position.set(11.5, 2, 17);
    spotlightCopR.penumbra = 0.5;

    // Charger
    const spotlightChargerL = new THREE.SpotLight(0xFFFFFF, 150);
    scene.add(spotlightChargerL);
    scene.add(spotlightChargerL.target);
    spotlightChargerL.angle = Math.PI/4;
    spotlightChargerL.position.set(14.5, -0.35, 14);
    spotlightChargerL.target.position.set(14.25, 2, -17);
    spotlightChargerL.penumbra = 0.5;

    const spotlightChargerR = new THREE.SpotLight(0xFFFFFF, 150);
    scene.add(spotlightChargerR);
    scene.add(spotlightChargerR.target);
    spotlightChargerR.angle = Math.PI/4;
    spotlightChargerR.position.set(14, -0.35, 14);
    spotlightChargerR.target.position.set(14.25, 2, -17);
    spotlightChargerR.penumbra = 0.5;

    // Van
    const spotlightVanL = new THREE.SpotLight(0xFFFFFF, 150);
    scene.add(spotlightVanL);
    scene.add(spotlightVanL.target);
    spotlightVanL.angle = Math.PI/4;
    spotlightVanL.position.set(14.75, -0.35, -4.5);
    spotlightVanL.target.position.set(14.25, 2, -17);
    spotlightVanL.penumbra = 0.5;

    const spotlightVanR = new THREE.SpotLight(0xFFFFFF, 150);
    scene.add(spotlightVanR);
    scene.add(spotlightVanR.target);
    spotlightVanR.angle = Math.PI/4;
    spotlightVanR.position.set(13.75, -0.35, -4.5);
    spotlightVanR.target.position.set(14.25, 2, -17);
    spotlightVanR.penumbra = 0.5;
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Texture loader
    const loader = new THREE.TextureLoader();

    // Add a plane
    const planeGeometry = new THREE.PlaneGeometry(40, 40);

    // Load texture image for plane
    const planeTexture = loader.load('resources/images/grass.jpg');
    planeTexture.colorSpace = THREE.SRGBColorSpace;
    const planeMaterial = new THREE.MeshPhongMaterial({map: planeTexture, shininess: 0})
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);
    plane.rotation.x = -(Math.PI/2);
    plane.position.y = -1;

    // Main Road
    const roadWidth = 5;
    const roadHeight = 0.3;
    const roadDepth = 40;
    const roadGeometry = new THREE.BoxGeometry(roadWidth, roadHeight, roadDepth);
    const roadMaterial = new THREE.MeshPhongMaterial({color: 0x3d3d3d, shininess: 0});
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    scene.add(road);
    road.position.set(13, -1.05, 0);

    function makeRoadDashes(x, z) {
        const dashesGeometry = new THREE.BoxGeometry(0.2, 0.2, 1.5);
        const dashesMaterial = new THREE.MeshPhongMaterial({color: 0xf2ee05, shininess: 100});
        const dashes = new THREE.Mesh(dashesGeometry, dashesMaterial);
        road.add(dashes);
        dashes.position.y = 0.0505;
        dashes.position.x = x;
        dashes.position.z = z;
    }
    
    // Road dashes
    var dash_zCoord = -18;
    for (var i = 0; i < 10; i++) {
        makeRoadDashes(0, dash_zCoord);
        dash_zCoord += 4;
    }

    // Dirt Road
    const dirtRoadWidth = 4;
    const dirtRoadHeight = 0.3;
    const dirtRoadDepth = 15;
    const dirtRoadGeometry = new THREE.BoxGeometry(dirtRoadWidth, dirtRoadHeight, dirtRoadDepth);
    const dirtRoadMaterial = new THREE.MeshPhongMaterial({color: 0x855000, shininess: 0});
    const dirtRoad = new THREE.Mesh(dirtRoadGeometry, dirtRoadMaterial);
    scene.add(dirtRoad);
    dirtRoad.rotation.y = Math.PI/2;
    dirtRoad.position.set(3, -1.05, -1);

    // Trees
    function makeTree(x, z) {
        const radiusTop = 0.2;
        const radiusBottom = radiusTop;
        const cylinderHeight = 2;
        const radialSegments = 12;
        const cylinderGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, cylinderHeight, radialSegments);

        const coneRadius = 1;
        const coneHeight = 2;
        const coneSegments = 20;
        const coneGeometry = new THREE.ConeGeometry(coneRadius, coneHeight, coneSegments);

        const cylinderMaterial = new THREE.MeshPhongMaterial({color: 0x664216});
        const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        scene.add(cylinder);
        cylinder.position.x = x;
        cylinder.position.z = z;

        const coneMaterial = new THREE.MeshPhongMaterial({color: 0x0f8a04})
        const cone = new THREE.Mesh(coneGeometry, coneMaterial);
        cylinder.add(cone);
        cone.position.y = 1;

        const cone2 = new THREE.Mesh(coneGeometry, coneMaterial);
        cone.add(cone2);
        cone2.position.y = 1.25;
    }

    const Trees = [
        "left road trees",
        makeTree(9, -17),
        makeTree(7, -15),
        makeTree(9, -13),
        makeTree(7, -11),
        makeTree(9, -9),
        makeTree(7, -7),
        makeTree(9, -5),
        makeTree(9, 3),
        makeTree(7, 5),
        makeTree(9, 7),
        makeTree(7, 9),
        makeTree(9, 11),
        makeTree(7, 13),
        makeTree(9, 15),
        makeTree(7, 17),
        makeTree(9, 19),
        "right road trees",
        makeTree(18, -17),
        makeTree(16, -16),
        makeTree(19, -15),
        makeTree(18, -14),
        makeTree(19, -13),
        makeTree(16, -12),
        makeTree(18, -11),
        makeTree(16, -10),
        makeTree(19, -9),
        makeTree(18, -8),
        makeTree(19, -7),
        makeTree(16, -6),
        makeTree(18, -5),
        makeTree(16, -4),
        makeTree(19, -3),
        makeTree(18, -2),
        makeTree(19, -1),
        makeTree(16, 0),
        makeTree(18, 0),
        makeTree(16, 1),
        makeTree(19, 2),
        makeTree(18, 3),
        makeTree(19, 4),
        makeTree(16, 5),
        makeTree(18, 6),
        makeTree(16, 7),
        makeTree(19, 8),
        makeTree(18, 9),
        makeTree(19, 10),
        makeTree(16, 11),
        makeTree(18, 12),
        makeTree(16, 13),
        makeTree(19, 14),
        makeTree(18, 15),
        makeTree(19, 16),
        makeTree(16, 17),
        makeTree(18, 18),
        makeTree(16, 19),
        "camp trees",
        makeTree(5, 5),
        makeTree(-15, 8),
        makeTree(-6, -14),
        makeTree(-3, 12),
        makeTree(-11, 15),
        makeTree(-18, 0),
        makeTree(-16, 4),
        makeTree(-14, 7),
        makeTree(-8, -7),
        makeTree(-12, -8),
        makeTree(-2, 3),
        makeTree(-14, 12),
        makeTree(-2, -12),
        makeTree(-5, -5),
        makeTree(-17, -15),
        makeTree(-14, -12),
        makeTree(1, 11),
        makeTree(-1, 8),
        makeTree(-9, 6),
        makeTree(-17, -3),
        makeTree(-12, 5),
        makeTree(-5, 9),
        makeTree(-6, 11),
        makeTree(-9, 10),
        makeTree(-11, 17),
        makeTree(0, 18),
        makeTree(-2, 16),
        makeTree(-6, 16),
        makeTree(0, -4),
        makeTree(-16, -6),
        makeTree(-18, -9)
    ];

    // From three.js manual on billboards
    // https://threejs.org/manual/#en/billboards
    function makeLabelCanvas( size, name ) {

		const borderSize = 12;
		const ctx = document.createElement( 'canvas' ).getContext( '2d' );
		const font = `${size}px bold sans-serif`;
		ctx.font = font;
		// measure how long the name will be
		const doubleBorderSize = borderSize * 2;
		const width = ctx.measureText( name ).width + doubleBorderSize;
		const height = size + doubleBorderSize;
		ctx.canvas.width = width;
		ctx.canvas.height = height;

		// need to set font again after resizing canvas
		ctx.font = font;
		ctx.textBaseline = 'top';

		ctx.fillStyle = 'black';
		ctx.fillRect( 0, 0, width, height );
		ctx.fillStyle = 'white';
		ctx.fillText( name, borderSize, borderSize );

		return ctx.canvas;

	}

    // People
    function makePeople(x, y, z, c, size, name) {
        const canvas = makeLabelCanvas( size, name );
		const texture = new THREE.CanvasTexture( canvas );
		// because our canvas is likely not a power of 2
		// in both dimensions set the filtering appropriately.
		texture.minFilter = THREE.LinearFilter;
		texture.wrapS = THREE.ClampToEdgeWrapping;
		texture.wrapT = THREE.ClampToEdgeWrapping;

        const root = new THREE.Object3D();
        root.position.x = x;
        root.position.y = y;
        root.position.z = z;

        const radius = 0.2;
        const widthSegments = 15;
        const heightSegments = 15;
        const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        const sphereMaterial = new THREE.MeshPhongMaterial({color: c});
        const head = new THREE.Mesh(sphereGeometry, sphereMaterial);
        root.add(head);
        head.position.y = 0.6;

        const radiusTop = 0.3;
        const radiusBottom = 0.1;
        const height = 0.75;
        const radialSegments = 16;
        const cylinderGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
        const cylinderMaterial = new THREE.MeshPhongMaterial({color: c});
        const body = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        root.add(body);

        const labelMaterial = new THREE.SpriteMaterial( {
			map: texture,
			transparent: true,
		} );

        const labelBaseScale = 0.005;

        const label = new THREE.Sprite(labelMaterial);
		root.add( label );
        label.scale.x = canvas.width  * labelBaseScale;
        label.scale.y = canvas.height * labelBaseScale;
		label.position.y = head.position.y + radius + size * labelBaseScale;

        scene.add(root);
        
    }

    const People = [
        makePeople(-7.3, -.5, 0.6, 0xFFFFFF, 35, 'Miguel' ),
        makePeople(-8.5, -.5, -2.25, 0x00c8ff, 35, 'Alexis'),
        makePeople(-7, -.5, -1.5, 0x67ed42, 35, 'Albert'),
        makePeople(-9.5, -.5, 0.5, 0xbb00ff, 35, 'Gabriel')
    ];

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();

    // Nissan GTR by David Sirera [CC-BY] via Poly Pizza
    mtlLoader.load('resources/models/Cars/GTR/GTR.mtl', (mtl) => {
        mtl.preload();
        objLoader.setMaterials(mtl);
    });
    objLoader.load('resources/models/Cars/GTR/GTR.obj', (root) => {
        scene.add(root);
        root.scale.set(0.5, 0.5, 0.5);
        root.position.set(11.5, -0.50, -15);
    });

    // Dodge Charger by David Sirera [CC-BY] via Poly Pizza
    mtlLoader.load('resources/models/Cars/Charger/dodge.mtl', (mtl) => {
        mtl.preload();
        objLoader.setMaterials(mtl);
    });
    objLoader.load('resources/models/Cars/Charger/dodge.obj', (root) => {
        scene.add(root);
        root.scale.set(0.5, 0.5, 0.5);
        root.position.set(14.25, -0.75, 15);
        root.rotation.y = Math.PI;
    });

    // Van by Poly by Google [CC-BY] via Poly Pizza
    mtlLoader.load('resources/models/Cars/Van/1387 Van.mtl', (mtl) => {
        mtl.preload();
        objLoader.setMaterials(mtl);
    });
    objLoader.load('resources/models/Cars/Van/1387 Van.obj', (root) => {
        scene.add(root);
        root.scale.set(0.035, 0.035, 0.035);
        root.position.set(14.25, -0.9, -4);
        root.rotation.y = Math.PI;

        let root2 = root.clone();
        scene.add(root2);
        root2.position.x = -5.5;
        root2.position.z = 4;
        root2.position.y = -1;
        root2.rotation.y = Math.PI/4;
    });

    // Police Car by Quaternius
    mtlLoader.load('resources/models/Cars/Police/Cop.mtl', (mtl) => {
        mtl.preload();
        objLoader.setMaterials(mtl);
    });
    objLoader.load('resources/models/Cars/Police/Cop.obj', (root) => {
        scene.add(root);
        root.scale.set(0.85, 0.85, 0.85);
        root.position.set(11.5, -0.9, 3);
    });

    // Telephone pole by Poly by Google [CC-BY] via Poly Pizza
    mtlLoader.load('resources/models/Environment/TelephonePole/telephonePole.mtl', (mtl) => {
        mtl.preload();
        objLoader.setMaterials(mtl);
    });
    objLoader.load('resources/models/Environment/TelephonePole/telephonePole.obj', (root) => {
        scene.add(root);
        root.scale.set(0.5, 0.5, 0.5);
        root.position.set(5, -1, -17);
        root.rotation.y = Math.PI/2;
        let root2 = root.clone();
        scene.add(root2);
        root2.position.x = 0.25;
        let root3 = root.clone();
        scene.add(root3);
        root3.position.x = -4.5;
        let root4 = root.clone();
        scene.add(root4);
        root4.position.x = -9.25;
        let root5 = root.clone();
        scene.add(root5);
        root5.position.x = -14;
    });

    // Camping Related Objects
    // Tent by J-Toastie [CC-BY] via Poly Pizza
    mtlLoader.load('resources/models/Camping/Tent/Tent.mtl', (mtl) => {
        mtl.preload();
        objLoader.setMaterials(mtl);
    });
    objLoader.load('resources/models/Camping/Tent/Tent.obj', (root) => {
        scene.add(root);
        root.scale.set(1.2, 1.2, 1.2);
        root.position.set(-11, -0.2, 2);
        root.rotation.y = (3*Math.PI)/4;
        let root2 = root.clone();
        scene.add(root2);
        root2.position.set(-11, -0.2, -2);
        root2.rotation.y = (2*Math.PI)/3;
        let root3 = root.clone();
        scene.add(root3);
        root3.position.set(-8, -0.2, 3);
        root3.rotation.y = 0;
        let root4 = root.clone();
        scene.add(root4);
        root4.position.set(-8, -0.2, -4);
        root4.rotation.y = Math.PI;
    });

    // Campfire by J-Toastie [CC-BY] via Poly Pizza
    mtlLoader.load('resources/models/Camping/Campfire/Campfire.mtl', (mtl) => {
        mtl.preload();
        objLoader.setMaterials(mtl);
    });
    objLoader.load('resources/models/Camping/Campfire/Campfire.obj', (root) => {
        scene.add(root);
        root.scale.set(1.1, 1.1, 1.1);
        root.position.set(-8.5, -0.825, -0.5);
    });

    // Fire by J-Toastie [CC-BY] via Poly Pizza
    let fireRotationY = 0;
    let fireTranslationY = 0;
    mtlLoader.load('resources/models/Camping/Campfire/fire.mtl', (mtl) => {
        mtl.preload();
        objLoader.setMaterials(mtl);
    });
    objLoader.load('resources/models/Camping/Campfire/fire.obj', (root) => {
        scene.add(root);
        root.scale.set(1.1, 1.1, 1.1);
        root.position.set(-8.4, 0, -0.5);
        root.rotation.y = fireRotationY;
        root.position.y = -0.9 + fireTranslationY;
        root.name = 'fire';
    });

    // Log by J-Toastie [CC-BY] via Poly Pizza
    mtlLoader.load('resources/models/Camping/Campfire/Log.mtl', (mtl) => {
        mtl.preload();
        objLoader.setMaterials(mtl);
    });
    objLoader.load('resources/models/Camping/Campfire/Log.obj', (root) => {
        scene.add(root);
        root.scale.set(1.1, 1.1, 1.1);
        root.position.set(-6.75, -0.8, .75);
        root.rotation.y = -Math.PI/6;
        let root2 = root.clone();
        scene.add(root2);
        root.position.set(-6.5, -0.8, -1.5);
        root.rotation.y = Math.PI/4;
    });

    // Grass Patch by Danni Bittman [CC-BY] via Poly Pizza
    mtlLoader.load('resources/models/Environment/grass/grass_patch/materials.mtl', (mtl) => {
        mtl.preload();
        objLoader.setMaterials(mtl);
    });
    objLoader.load('resources/models/Environment/grass/grass_patch/model.obj', (root) => {
        for (var i = -18; i < 10; i++) {
            for (var j = -18; j < 20; j += 2) {
                if (-14 < i && i < -5 && -7 < j && j < 6) {
                    continue;
                }
                if (-14 < i && i >= -5 && -5 < j && j < 4) {
                    continue;
                }

                let rootCpy = root.clone();
                scene.add(rootCpy);
                rootCpy.position.set(i, -0.75, j);
            }
        }
    });


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Function to change drawingbuffer size of canvas (resolves low resolution issue)
    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    // Render function that renders the objects, rotating over time
    function render(time) {
        time *= 0.001;  // convert time to seconds

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
        if (scene.getObjectByName('fire')) {
            scene.getObjectByName('fire').rotation.y += 0.025;
            scene.getObjectByName('fire').position.y = -0.9 + (1-Math.sin(3*time))/6;
        }
        cameraMovement();
        

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
    
}

main();