import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { loadObject, type SceneObject } from "../components/js/loader";
import { Curve } from "../components/js/curve";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import { Node } from "../components/js/node";
import { useNavigate } from "react-router-dom";

/**
 * ThreeScene
 * ----------
 * A React component that renders an interactive 3D scene using Three.js.
 *
 * Features:
 * - WebGL renderer with antialiasing
 * - Perspective camera with orbit controls
 * - Directional and ambient lighting
 * - GLTF-loaded Earth and Plane models
 * - Custom animated orbit curve
 * - Floating interactive geographic nodes (CSS2D labels)
 * - Responsive resizing
 *
 * Scene Overview:
 * - The Earth model acts as the central object.
 * - A Plane object moves dynamically along a predefined 3D orbit path.
 * - Two interactive nodes ("North America" and "Europe") are positioned
 *   on the Earth using latitude/longitude coordinates.
 * - Nodes float slightly above the surface and include clickable buttons.
 *
 * Animation Loop:
 * - Updates plane position/orientation along orbit curve.
 * - Updates floating node positions.
 * - Renders both WebGL and CSS2D layers.
 *
 * External Dependencies:
 * - three
 * - OrbitControls (three/addons)
 * - CSS2DRenderer (three/addons)
 * - loadObject (GLTF loader utility)
 * - Curve (custom orbit curve class)
 * - Node (custom Earth-anchored label class)
 *
 * Lifecycle:
 * - Initializes scene and renderer on mount.
 * - Adds resize listener.
 * - Cleans up animation frame, event listeners,
 *   controls, and renderers on unmount.
 *
 *
 * @returns {JSX.Element} Fullscreen Three.js canvas container.
 */
export default function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x20a7db);
    mount.appendChild(renderer.domElement);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(25, 15, 40);

    // Controls
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.update();

    // Lights
    const dLight = new THREE.DirectionalLight(0xffffff, 1);
    dLight.position.set(0, 10, 2);
    scene.add(dLight);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Earth
    let earth: THREE.Object3D | null = null;
    const earthObject: SceneObject = {
      fileName: "/public/earth.gltf",
      coords: new THREE.Vector3(10, 10, 10),
    };
    loadObject(earthObject, scene, (obj) => {
      earth = obj;
    });

    // Plane
    let plane: THREE.Object3D | null = null;
    const planeObject: SceneObject = {
      fileName: "/public/plane.gltf",
      coords: new THREE.Vector3(0.5, 0.5, 0.5),
    };
    loadObject(planeObject, scene, (obj) => {
      plane = obj;
    });

    // Orbit Curve
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
    orbitCurve.draw(scene, 0xff0000, 0);
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0px";
    labelRenderer.domElement.style.pointerEvents = "none";
    mount.appendChild(labelRenderer.domElement);

    let nodeLeft: Node | null = null;
    let nodeRight: Node | null = null;

    loadObject(earthObject, scene, (obj) => {
      earth = obj;
      nodeRight = new Node(scene, earth, {
        title: "North America",
        description: "Server: US-East-1",
        lat: 40,
        lon: -100,
        floatDistance: 4,
        buttons: [
          {
            label: "Connect",
            onClick: () => console.log("Connecting to North America server..."),
          },
          {
            label: "Details",
            onClick: () => console.log("Show details for NA"),
          },
        ],
      });

      nodeLeft = new Node(scene, earth, {
        title: "Europe",
        description: "Server: EU-West-1",
        lat: 51,
        lon: 10,
        floatDistance: 4,
        buttons: [
          {
            label: "Connect",
            onClick: () => console.log("Connecting to Europe server..."),
          },
        ],
      });
    });

    // Animation
    let animationId: number;
    function animate() {
      animationId = requestAnimationFrame(animate);
      const time = Date.now() * 0.0005;
      if (plane) {
        orbitCurve.lookAt(plane, time, 0.4);
      }
      nodeLeft?.update(time);
      nodeRight?.update(time);

      labelRenderer.render(scene, camera);
      renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      orbit.dispose();
      renderer.dispose();
      mount.removeChild(labelRenderer.domElement);
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen">
      {/* nav button to go to dashboardd */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-2 rounded-full bg-indigo-600 text-white font-semibold
                   shadow-md hover:shadow-lg hover:bg-indigo-700
                   transition-all duration-200
                   hover:scale-[1.03] active:scale-[0.98]"
        >
          Dashboard
        </button>
      </div>

      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}
