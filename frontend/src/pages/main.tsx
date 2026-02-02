import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { loadObject, type SceneObject } from "../components/js/loader";
import { Curve } from "../components/js/curve";


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x20a7db);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(25, 15, 40);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const dLight = new THREE.DirectionalLight(0xffffff, 1);
dLight.position.set(0, 10, 2);
scene.add(dLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const earthGeometry = new THREE.SphereGeometry(10, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial({ color: 0x2233ff });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

let plane: THREE.Object3D | null = null;

const planeObject: SceneObject = {
  fileName: "/src/public/plane.gltf",
  coords: new THREE.Vector3(0.5, 0.5, 0.5),
};

loadObject(planeObject, scene, (obj) => {
  plane = obj;
});

const orbitRadius = 15;
const numPoints = 50;

const orbitPoints: THREE.Vector3[] = [];
for (let i = 0; i < numPoints; i++) {
  const angle = (i / numPoints) * Math.PI * 2;
  const x = Math.cos(angle) * orbitRadius;
  const z = Math.sin(angle) * orbitRadius;
  const y = Math.sin(angle * 3) * 3;
  orbitPoints.push(new THREE.Vector3(x, y, z));
}

const orbitCurve = new Curve(orbitPoints, true);
orbitCurve.draw(scene, 0xff0000, 0.2);

function animate() {
  const time = Date.now() * 0.0005;

  if (plane) {
    orbitCurve.lookAt(plane, time, 0.4);
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();


window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
