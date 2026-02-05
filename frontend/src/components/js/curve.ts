import * as THREE from "three";

/**
 * A 3D curve that can be drawn as a tube mesh in a Three.js scene
 */
export class Curve {
  /** Array of 3D points that define the curve path */
  points: THREE.Vector3[];

  /** Whether the curve forms a closed loop */
  closed: boolean;

  /** The underlying Catmull-Rom spline curve */
  path: THREE.CatmullRomCurve3;

  /** The mesh object representing the curve in the scene */
  pathObject: THREE.Mesh | null = null;

  constructor(points: THREE.Vector3[], closed = false) {
    this.points = points;
    this.closed = closed;
    this.path = new THREE.CatmullRomCurve3(this.points, this.closed);
  }

  /**
   * Draws the curve as a tube mesh in the scene
   * @param scene - The Three.js scene to add the curve to
   * @param color - Color of the curve tube
   * @param radius - Radius of the curve tube
   * @returns True if successful, false if not enough points
   */
  draw(
    scene: THREE.Scene,
    color: THREE.ColorRepresentation = 0xff0000,
    radius = 0.2,
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
      this.closed,
    );
    const tubeMaterial = new THREE.MeshStandardMaterial({ color });
    this.pathObject = new THREE.Mesh(tubeGeometry, tubeMaterial);
    scene.add(this.pathObject);
    console.log("Curve.draw(): Objeced created successfully!");
    return true;
  }

  /**
   * Animates an object along the curve path
   * @param object - The object to move along the curve
   * @param elapsedTime - Current animation time
   * @param speed - Speed multiplier for movement along the curve
   */
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
