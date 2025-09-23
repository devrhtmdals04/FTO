import * as THREE from 'three';
import { BallView } from '../state';
import { WORLD } from './pitch';

export class Ball {
  mesh: THREE.Mesh;

  constructor() {
    const geometry = new THREE.SphereGeometry(WORLD.BALL.R, 16, 16);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
  }

  update(state: BallView) {
    // state.y from the 2D view is the z in the 3D scene.
    // state.z from the 2D view (height) is the y in the 3D scene.
    this.mesh.position.set(state.x, state.z, state.y);
  }
}