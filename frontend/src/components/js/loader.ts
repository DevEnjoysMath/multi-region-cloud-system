import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export interface SceneObject {
  fileName: string;
  coords: THREE.Vector3;
}

export function loadObject(
  object: SceneObject,
  scene: THREE.Scene,
  onLoad?: (obj: THREE.Object3D) => void,
) {
  const loader = new GLTFLoader();

  loader.load(
    object.fileName,

    (gltf) => {
      const mesh = gltf.scene;
      mesh.scale.copy(object.coords);
      scene.add(mesh);
      onLoad?.(mesh);
      console.log(
        object.fileName + ".loadObject(): Object loaded successfully!",
      );
    },

    undefined,

    (error) => {
      console.error(
        object.fileName + ".loadObject(): Error loading object:",
        error,
      );

      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        wireframe: true,
      });

      const cube = new THREE.Mesh(geometry, material);
      cube.scale.copy(object.coords);
      scene.add(cube);
      onLoad?.(cube);

      console.log(object.fileName + ".loadObject(): Cube loaded sadfully.");
    },
  );
}
