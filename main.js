import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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
renderer.setAnimationLoop(animate);

// 🛠️ FIX: Append renderer to #canvas-container instead of body
document.getElementById('canvas-container').appendChild(renderer.domElement);

const topLight = new THREE.DirectionalLight(0xffffff, 2.0);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(topLight);
scene.add(ambientLight);

camera.position.z = 5;

// 🛠️ FIX: Load GLTF Model Properly
const loader = new GLTFLoader();
loader.load('/LOGO.glb', function (gltf) {
    let model = gltf.scene;
    model.position.set(0, 0, 0);
    model.scale.set(1, 1, 1);  
    scene.add(model);
}, undefined, function (error) {
    console.error(error);
});

// 🛠️ FIX: Handle window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// 🛠️ FIX: Parallax Effect on Scroll
window.addEventListener("scroll", () => {
  let scrollPosition = window.scrollY;
  camera.position.z = 5 + scrollPosition * 0.005; // Moves slightly back
});

// Animation loop
function animate() {
    scene.rotation.y += 0.02;
    renderer.render(scene, camera);
}