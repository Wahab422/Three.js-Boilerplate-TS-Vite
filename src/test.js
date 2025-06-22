import * as THREE from 'three';
import { GUI } from 'dat.gui';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Loading Manager (optional)
const loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = () => console.log("✅ All textures loaded!");

// Texture Loader
const textureLoader = new THREE.TextureLoader(loadingManager);
const texture = textureLoader.load(
    './assets/flag.jpg',
    (texture) => console.log("✅ Texture loaded successfully!"),
    (xhr) => console.log(`📡 Loading: ${(xhr.loaded / xhr.total) * 100}%`),
    (error) => console.error("❌ Error loading texture:", error)
);

// Create Material with Texture
const material = new THREE.MeshBasicMaterial({ map: texture });
const geometry = new THREE.PlaneGeometry(5, 3);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Camera Position
camera.position.z = 5;

// GUI Setup
const gui = new GUI();
const textureControls = {
    visible: true,
    repeatX: 1,
    repeatY: 1,
    wrapS: texture.wrapS,
    wrapT: texture.wrapT,
    magFilter: texture.magFilter,
    minFilter: texture.minFilter
};

// Toggle visibility
gui.add(textureControls, 'visible').onChange((value) => {
    material.visible = value;
});

// Repeat texture
gui.add(textureControls, 'repeatX', 1, 5, 0.1).onChange((value) => {
    texture.repeat.x = value;
    texture.needsUpdate = true;
});
gui.add(textureControls, 'repeatY', 1, 5, 0.1).onChange((value) => {
    texture.repeat.y = value;
    texture.needsUpdate = true;
});

// Wrapping modes
const wrapOptions = {
    "Clamp to Edge": THREE.ClampToEdgeWrapping,
    "Repeat": THREE.RepeatWrapping,
    "Mirrored Repeat": THREE.MirroredRepeatWrapping
};
gui.add(textureControls, 'wrapS', wrapOptions).onChange((value) => {
    texture.wrapS = value;
    texture.needsUpdate = true;
});
gui.add(textureControls, 'wrapT', wrapOptions).onChange((value) => {
    texture.wrapT = value;
    texture.needsUpdate = true;
});

// Filters
const filterOptions = {
    "Nearest": THREE.NearestFilter,
    "Linear": THREE.LinearFilter
};
gui.add(textureControls, 'magFilter', filterOptions).onChange((value) => {
    texture.magFilter = value;
    texture.needsUpdate = true;
});
gui.add(textureControls, 'minFilter', filterOptions).onChange((value) => {
    texture.minFilter = value;
    texture.needsUpdate = true;
});

// Animation Loop
function animate() {
    reque
