import * as THREE from 'three';
import { PlayerView } from '../state';

const homeColor = new THREE.Color(0x4aa3ff);
const awayColor = new THREE.Color(0xff5c5c);

export class Players {
  mesh: THREE.InstancedMesh;
  count: number;

  constructor(count: number) {
    this.count = count;
    const geometry = new THREE.CylinderGeometry(0.4, 0.4, 1.8, 8); // radius, height
    geometry.translate(0, 0.9, 0); // move pivot to the base
    const material = new THREE.MeshStandardMaterial();
    this.mesh = new THREE.InstancedMesh(geometry, material, count);
    this.mesh.castShadow = true;
    this.mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(count * 3), 3);
  }

  update(players: PlayerView[]) {
    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();

    for (let i = 0; i < players.length; i++) {
      const p = players[i];

      // Position and Rotation from heading
      const angle = Math.atan2(p.h[0], p.h[1]); // heading vector to angle
      matrix.makeRotationY(angle);
      matrix.setPosition(p.x, 0, p.y); // p.y is z in 3d space, and players are on the ground (y=0 in 3D)

      // Apply visual scale
      const scaleMatrix = new THREE.Matrix4().makeScale(p.vis, p.vis, p.vis);
      matrix.premultiply(scaleMatrix);

      this.mesh.setMatrixAt(i, matrix);

      // Color based on team
      if (this.mesh.instanceColor) {
        (p.team === 0 ? homeColor : awayColor).toArray(this.mesh.instanceColor.array, i * 3);
      }
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) {
        this.mesh.instanceColor.needsUpdate = true;
    }
  }
}
