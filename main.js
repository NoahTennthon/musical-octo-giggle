import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const track = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.carousel-slide'); // Get all slides
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let index = 0;
const totalSlides = slides.length; // Get total number of slides

function updateCarousel() {
  track.style.transform = `translateX(-${index * (100 / totalSlides)}%)`;
}

// Next Button
nextBtn.addEventListener('click', () => {
    index = (index + 1) % totalSlides; // Loop back to first slide
    updateCarousel();
});

// Prev Button
prevBtn.addEventListener('click', () => {
    index = (index - 1 + totalSlides) % totalSlides; // Loop back to last slide
    updateCarousel();
});

// Auto-scroll every 5 seconds
setInterval(() => {
    index = (index + 1) % totalSlides;
    updateCarousel();
}, 5000);

fetch("nav.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("navbar-container").innerHTML = data;
    })
    .catch(error => console.error("Error loading navbar:", error));



    document.addEventListener("DOMContentLoaded", function () {
      const dropdown = document.querySelector(".dropbtn");
      const dropdownContent = document.querySelector(".dropdown-content");
  
      dropdown.addEventListener("click", function (event) {
          event.preventDefault(); // Prevents page jump
          dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
      });
  
      // Close dropdown if clicking outside
      document.addEventListener("click", function (event) {
          if (!dropdown.contains(event.target) && !dropdownContent.contains(event.target)) {
              dropdownContent.style.display = "none";
          }
      });
  });

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