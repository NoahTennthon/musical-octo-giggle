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

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);



const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
const topLight = new THREE.DirectionalLight(0xffffff, 2.0)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
// scene.add(cube);
scene.add(topLight);
scene.add(ambientLight);

camera.position.z = 5;

let globe;
const loader = new GLTFLoader();

loader.load( '/LOGO.glb', function ( gltf ) {
	scene.add( gltf.scene );
    // gltf.scene.rotation.x += 0.01;

}, undefined, function ( error ) {

	console.error( error );

} ); 

function animate() {
//   cube.rotation.x += 0.01;
//   cube.rotation.y += 0.01;
    camera.rotation.z += 0.01;
    scene.rotation.y += 0.01;
    scene.rotation.x += 0.01;
    topLight.rotation.x += 0.02;
    ambientLight.rotation.x += 0.02;
    topLight.rotation.y += 0.02;
    ambientLight.rotation.y += 0.02;

  renderer.render(scene, camera);
}
