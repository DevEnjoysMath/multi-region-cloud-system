import * as THREE from "three";

export class Curve {
  points: THREE.Vector3[];
  closed: boolean;
  path: THREE.CatmullRomCurve3;
  pathObject: THREE.Mesh | null = null;

  constructor(points: THREE.Vector3[], closed = false) {
    this.points = points;
    this.closed = closed;
    this.path = new THREE.CatmullRomCurve3(this.points, this.closed);
  }

  draw(
    scene: THREE.Scene,
    color: THREE.ColorRepresentation = 0xff0000,
    radius = 0.2
  ): boolean {

    if (this.points.length < 2) {
        console.warn("Curve.draw(): not enough points");
        return false;
    }

    if (this.pathObject) {
      scene.remove(this.pathObject);
      this.pathObject.geometry.dispose();
      (this.pathObject.material as THREE.Material).dispose();
    }

    const tubeGeometry = new THREE.TubeGeometry(
      this.path,
      100,
      radius,
      8,
      this.closed
    );

    const tubeMaterial = new THREE.MeshStandardMaterial({ color });
    this.pathObject = new THREE.Mesh(tubeGeometry, tubeMaterial);
    scene.add(this.pathObject);

    console.log("Curve.draw(): Objeced created successfully!");
    return true;
  }

  lookAt(object: THREE.Object3D, elapsedTime: number, speed = 0.2): void {
    if (!Number.isFinite(elapsedTime)) return;
    if (!this.path) return;
  
    const t = (elapsedTime * speed) % 1;
  
    const position = this.path.getPointAt(t);
    object.position.copy(position);
  
    const tangent = this.path.getTangentAt(t);
    object.lookAt(position.clone().add(tangent));
  }
}
