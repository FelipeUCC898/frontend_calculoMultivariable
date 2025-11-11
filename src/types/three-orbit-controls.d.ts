declare module 'three/examples/jsm/controls/OrbitControls' {
  import * as THREE from 'three';

  export class OrbitControls extends THREE.EventDispatcher {
    constructor(object: THREE.Camera, domElement?: HTMLElement);
    enabled: boolean;
    target: THREE.Vector3;
    enableZoom: boolean;
    enableRotate: boolean;
    enablePan: boolean;
    enableDamping: boolean;
    dampingFactor: number;
    enableKeys: boolean;
    keys: string[];
    mouseButtons: { LEFT: number; MIDDLE: number; RIGHT: number };
    update(): void;
    dispose(): void;
    reset(): void;
  }
}
