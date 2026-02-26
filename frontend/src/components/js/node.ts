import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

type NodeSide = "left" | "right";

/**
 * Converts geographic latitude and longitude coordinates into a 3D position
 * on a sphere surface.
 *
 * The conversion assumes:
 * - Y axis is the polar axis (north/south)
 * - Radius is measured from the sphere center
 * - Latitude is in degrees (-90 to 90)
 * - Longitude is in degrees (-180 to 180)
 *
 * @param lat - Latitude in degrees.
 * @param lon - Longitude in degrees.
 * @param radius - Sphere radius.
 * @returns {THREE.Vector3} Cartesian coordinates on the sphere surface.
 */
function latLonToVector3(
  lat: number,
  lon: number,
  radius: number,
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180); // polar angle from +Y
  const theta = (lon + 180) * (Math.PI / 180); // azimuthal angle

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}
/**
 * Represents an interactive button displayed inside a Node label.
 */
export interface NodeButton {
  /**
   * Text displayed on the button.
   */
  label: string;

  /**
   * Click handler executed when the button is pressed.
   */
  onClick: () => void;
}

/**
 * Configuration options used when creating a Node.
 */
export interface NodeOptions {
  /**
   * Optional side alignment of the label.
   * Currently reserved for future layout logic.
   * @default "right"
   */
  side?: "left" | "right";

  /**
   * Title displayed at the top of the label.
   * @default "Node"
   */
  title?: string;

  /**
   * Secondary descriptive text displayed below the title.
   */
  description?: string;

  /**
   * Optional interactive buttons displayed inside the label.
   */
  buttons?: NodeButton[];

  /**
   * Geographic latitude on Earth surface.
   */
  lat: number;

  /**
   * Geographic longitude on Earth surface.
   */
  lon: number;

  /**
   * Distance from Earth surface to floating label in world units.
   * @default 6
   */
  floatDistance?: number;
}

/**
 * Node
 * ----
 * Represents an interactive geographic marker attached to a rotating Earth object.
 *
 * Features:
 * - Anchors to Earth using latitude/longitude coordinates
 * - Renders a glowing 3D marker on the surface
 * - Displays a floating CSS2D label
 * - Draws a dashed line connecting marker to label
 * - Smooth floating animation along radial direction
 * - Supports interactive buttons inside the label
 *
 * The marker is attached as a child of the Earth object,
 * ensuring it rotates naturally with the globe.
 *
 * The label floats outward from the Earth's surface
 * and animates smoothly over time.
 *
 * @example
 * const node = new Node(scene, earth, {
 *   title: "Europe",
 *   description: "Server: EU-West-1",
 *   lat: 51,
 *   lon: 10,
 *   floatDistance: 4,
 *   buttons: [
 *     { label: "Connect", onClick: () => console.log("Connecting...") }
 *   ]
 * });
 */
export class Node {
  private scene: THREE.Scene;
  private earth: THREE.Object3D;
  private labelObject: CSS2DObject;
  private marker: THREE.Mesh;
  private line: THREE.Line;
  private basePosition: THREE.Vector3;
  private floatOffset: number;
  private floatDistance: number;
  /**
   * Creates a new floating geographic node.
   *
   * @param scene - The Three.js scene where label and line are added.
   * @param earth - The Earth object used as positional reference.
   * @param options - Configuration for geographic location and UI content.
   */

  constructor(scene: THREE.Scene, earth: THREE.Object3D, options: NodeOptions) {
    const {
      side = "right",
      title = "Node",
      description = "",
      buttons = [],
      lat,
      lon,
      floatDistance = 6,
    } = options;

    this.scene = scene;
    this.earth = earth;
    this.floatOffset = Math.random() * 10;
    this.floatDistance = floatDistance;

    // Create marker first
    this.marker = this.createMarker(lat, lon);

    // Position label near marker, offset outward from Earth center
    const markerWorld = new THREE.Vector3();
    this.marker.getWorldPosition(markerWorld);

    // Direction from Earth center to marker (normalized)
    const earthWorld = new THREE.Vector3();
    this.earth.getWorldPosition(earthWorld);
    const direction = markerWorld.clone().sub(earthWorld).normalize();

    // Base position: marker + offset outward
    this.basePosition = markerWorld
      .clone()
      .add(direction.multiplyScalar(floatDistance));

    this.labelObject = this.createLabel(title, description, buttons);
    this.line = this.createDottedLine();

    this.scene.add(this.labelObject);
    this.scene.add(this.line);
  }

  private createLabel(
    title: string,
    description: string,
    buttons: NodeButton[],
  ) {
    const div = document.createElement("div");
    div.style.background = "white";
    div.style.padding = "12px 16px";
    div.style.borderRadius = "8px";
    div.style.fontSize = "14px";
    div.style.color = "black";
    div.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
    div.style.pointerEvents = "auto";
    div.style.minWidth = "150px";

    // Title
    const titleEl = document.createElement("div");
    titleEl.style.fontWeight = "bold";
    titleEl.style.marginBottom = description ? "4px" : "0";
    titleEl.textContent = title;
    div.appendChild(titleEl);

    // Description
    if (description) {
      const descEl = document.createElement("div");
      descEl.style.fontSize = "12px";
      descEl.style.color = "#666";
      descEl.style.marginBottom = buttons.length > 0 ? "8px" : "0";
      descEl.textContent = description;
      div.appendChild(descEl);
    }

    // Buttons
    if (buttons.length > 0) {
      const buttonContainer = document.createElement("div");
      buttonContainer.style.display = "flex";
      buttonContainer.style.gap = "8px";
      buttonContainer.style.marginTop = "8px";

      buttons.forEach((btn) => {
        const button = document.createElement("button");
        button.textContent = btn.label;
        button.style.padding = "6px 12px";
        button.style.border = "none";
        button.style.borderRadius = "4px";
        button.style.background = "#1e293b";
        button.style.color = "white";
        button.style.cursor = "pointer";
        button.style.fontSize = "12px";
        button.style.fontWeight = "500";

        button.onmouseover = () => {
          button.style.background = "#334155";
        };
        button.onmouseout = () => {
          button.style.background = "#1e293b";
        };
        button.onclick = (e) => {
          e.stopPropagation();
          btn.onClick();
        };

        buttonContainer.appendChild(button);
      });

      div.appendChild(buttonContainer);
    }

    const label = new CSS2DObject(div);
    label.position.copy(this.basePosition);

    return label;
  }

  private createMarker(lat: number, lon: number) {
    const geometry = new THREE.SphereGeometry(0.04, 16, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffcc00,
      emissive: 0xffaa00,
      emissiveIntensity: 1.5,
    });
    const marker = new THREE.Mesh(geometry, material);

    // Place marker at lat/lon on Earth's surface (local space, radius = 1.0)
    const localPos = latLonToVector3(lat, lon, 1.0);
    marker.position.copy(localPos);

    this.earth.add(marker); // child of Earth so it rotates with it
    return marker;
  }

  private createDottedLine() {
    const material = new THREE.LineDashedMaterial({
      color: 0xffffff,
      dashSize: 0.5,
      gapSize: 0.3,
    });
    const geometry = new THREE.BufferGeometry();
    const line = new THREE.Line(geometry, material);
    return line;
  }
  /**
   * Updates node position and animation.
   *
   * Should be called every frame inside the main animation loop.
   *
   * Responsibilities:
   * - Recalculates world position of marker
   * - Keeps label positioned outward from Earth's surface
   * - Applies floating animation along radial direction
   * - Updates dashed connection line geometry
   *
   * @param _time - Time value (typically based on elapsed time or Date.now()).
   */
  public update(_time: number) {
    // Get current marker world position (it rotates with Earth)
    const markerWorld = new THREE.Vector3();
    this.marker.getWorldPosition(markerWorld);

    // Update base position to follow marker
    const earthWorld = new THREE.Vector3();
    this.earth.getWorldPosition(earthWorld);
    const direction = markerWorld.clone().sub(earthWorld).normalize();
    this.basePosition = markerWorld
      .clone()
      .add(direction.multiplyScalar(this.floatDistance));

    // Float animation
    const floatY = Math.sin(_time + this.floatOffset) * 0.8;
    const newPos = this.basePosition.clone();
    newPos.add(direction.multiplyScalar(floatY)); // float along radial direction
    this.labelObject.position.copy(newPos);

    // Update line
    const labelWorld = new THREE.Vector3();
    this.labelObject.getWorldPosition(labelWorld);

    const positions = new Float32Array([
      markerWorld.x,
      markerWorld.y,
      markerWorld.z,
      labelWorld.x,
      labelWorld.y,
      labelWorld.z,
    ]);

    this.line.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    this.line.computeLineDistances();
  }
}
