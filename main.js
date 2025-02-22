import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// --- Three.js Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000
);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Lighting
const topLight = new THREE.DirectionalLight(0xffffff, 2.0);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(topLight);
scene.add(ambientLight);

// Set camera position
camera.position.z = 5;

// --- Load Model ---
let model;
const loader = new GLTFLoader();
loader.load('/LOGO.glb', function (gltf) {
    model = gltf.scene;
    model.position.set(0, 0, 0);
    model.scale.set(1, 1, 1);
    scene.add(model);
}, undefined, function (error) {
    console.error(error);
});

// --- Resize Handler ---
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// --- Animation Loop ---
function animate() {
    // Rotate model slowly counter-clockwise
    if (model) {
        model.rotation.y -= 0.005;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();

// --- Fade in Landing Screen on Load ---
document.addEventListener("DOMContentLoaded", () => {
    const landing = document.getElementById('landing');
    // Trigger fade-in
    landing.classList.add('visible');
});

// --- Hover/Touch Interaction ---
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let isHovered = false;

function updatePointer(x, y) {
    pointer.x = ( x / window.innerWidth ) * 2 - 1;
    pointer.y = - ( y / window.innerHeight ) * 2 + 1;
}

function onPointerMove(x, y) {
    updatePointer(x, y);
    raycaster.setFromCamera(pointer, camera);
    if (model) {
        const intersects = raycaster.intersectObject(model, true);
        if (intersects.length > 0) {
            if (!isHovered) {
                isHovered = true;
                model.scale.set(1.1, 1.1, 1.1);
            }
        } else {
            if (isHovered) {
                isHovered = false;
                model.scale.set(1, 1, 1);
            }
        }
    }
}

window.addEventListener('mousemove', (event) => {
    onPointerMove(event.clientX, event.clientY);
}, false);

// For mobile touch move
window.addEventListener('touchmove', (event) => {
    if (event.touches.length > 0) {
        const touch = event.touches[0];
        onPointerMove(touch.clientX, touch.clientY);
    }
}, false);

// --- Click/Touch to Enter Main Content ---
function onEnter() {
    if (!model) return; // Ensure model is loaded
    // Check if click/touch intersects the model
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(model, true);
    if (intersects.length > 0) {
        // Fade out landing and reveal main content
        const landing = document.getElementById('landing');
        landing.style.opacity = 0;
        setTimeout(() => {
            landing.style.display = 'none';
            document.getElementById('main-content').classList.add('visible');
        }, 1000); // Match the CSS transition duration
    }
}

// Mouse click event
window.addEventListener('click', (event) => {
    updatePointer(event.clientX, event.clientY);
    onEnter();
}, false);

// Touch event
window.addEventListener('touchend', (event) => {
    if (event.changedTouches.length > 0) {
        const touch = event.changedTouches[0];
        updatePointer(touch.clientX, touch.clientY);
        onEnter();
    }
}, false);