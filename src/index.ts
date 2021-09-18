import * as THREE from 'three'
import { CameraHelper } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa8def0);

// CAMERA
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 5;
camera.position.z = 5;
camera.position.x = 0;

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true
controls.target = new THREE.Vector3(0, 0, 0);
controls.update();

// AMBIENT LIGHT
scene.add(new THREE.AmbientLight(0xffffff, 0.7));
directionalLight()

// FLOOR
generateFloor()


var model: THREE.Group
var mixer: THREE.AnimationMixer
var animationsMap: Map<string, THREE.AnimationAction> = new Map() // Walk, Run, Idle

const loader = new GLTFLoader();
loader.load( 'models/Soldier.glb', function ( gltf ) {
    model = gltf.scene;
    model.traverse( function ( object: any ) {
        if ( object.isMesh ) object.castShadow = true;
    } );
    scene.add( model );

    const gltfAnimations = gltf.animations;
    mixer = new THREE.AnimationMixer( model );
    gltfAnimations.forEach( (a: THREE.AnimationClip) => {
        animationsMap.set(a.name, mixer.clipAction(a))
    })

    animationsMap.get('Idle')?.play()
} );

const clock = new THREE.Clock();
// ANIMATE
function animate() {
    let mixerUpdateDelta = clock.getDelta();

    if (mixer) {
        mixer.update( mixerUpdateDelta );
    }

    controls.update()
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
document.body.appendChild(renderer.domElement);
animate();

// RESIZE HANDLER
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

function generateFloor() {
    // TEXTURES
    const textureLoader = new THREE.TextureLoader();

    const sandBaseColor = textureLoader.load("./textures/sand/Sand 002_COLOR.jpg");
    const sandNormalMap = textureLoader.load("./textures/sand/Sand 002_NRM.jpg");
    const sandHeightMap = textureLoader.load("./textures/sand/Sand 002_DISP.jpg");
    const sandAmbientOcclusion = textureLoader.load("./textures/sand/Sand 002_OCC.jpg");

    const WIDTH = 4
    const LENGTH = 4
    const NUM_X = 10
    const NUM_Z = 10

    const geometry = new THREE.PlaneGeometry(WIDTH, LENGTH, 512, 512);
    const material = new THREE.MeshStandardMaterial(
        {
            map: sandBaseColor, normalMap: sandNormalMap,
            displacementMap: sandHeightMap, displacementScale: 0.1,
            aoMap: sandAmbientOcclusion
        })

    for (let i = 0; i < NUM_X; i++) {
        for (let j = 0; j < NUM_Z; j++) {
            const floor = new THREE.Mesh(geometry, material)
            floor.receiveShadow = true
            floor.rotation.x = - Math.PI / 2

            floor.position.x = i * WIDTH - (NUM_X / 2) * WIDTH
            floor.position.z = j * LENGTH - (NUM_Z / 2) * LENGTH

            scene.add(floor)
        }
    }
}

function directionalLight () {
    const dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
    dirLight.position.set( - 60, 100, - 10 );
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = - 50;
    dirLight.shadow.camera.left = - 50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    scene.add( dirLight );
    // scene.add( new THREE.CameraHelper(dirLight.shadow.camera))
}