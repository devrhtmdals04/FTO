import * as THREE from 'three';
import { WORLD } from './pitch';

const XT_GRID_COLS = 16;
const XT_GRID_ROWS = 12;

export function createXtGrid(xtMap: number[][], teamId: 'home' | 'away') {
    const group = new THREE.Group();

    const { W, H } = WORLD.FIELD;

    const gridGeo = new THREE.BufferGeometry();
    const gridMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });

    const vertices = [];
    const cellW = W / XT_GRID_COLS;
    const cellH = H / XT_GRID_ROWS;

    for (let i = 0; i <= XT_GRID_COLS; i++) {
        vertices.push(-W / 2 + i * cellW, 0.01, -H / 2);
        vertices.push(-W / 2 + i * cellW, 0.01, H / 2);
    }

    for (let i = 0; i <= XT_GRID_ROWS; i++) {
        vertices.push(-W / 2, 0.01, -H / 2 + i * cellH);
        vertices.push(W / 2, 0.01, -H / 2 + i * cellH);
    }

    gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const grid = new THREE.LineSegments(gridGeo, gridMat);
    group.add(grid);

    const maxXt = xtMap.flat().reduce((max, v) => Math.max(max, v), 0);

    const mapToUse = teamId === 'home' ? xtMap : [...xtMap].reverse();

    for (let col = 0; col < XT_GRID_COLS; col++) {
        for (let row = 0; row < XT_GRID_ROWS; row++) {
            const xtValue = mapToUse[col][row];
            const normalizedXt = xtValue / maxXt;

            const color = new THREE.Color(normalizedXt, 0, 1 - normalizedXt);

            const cellMat = new THREE.MeshBasicMaterial({
                color,
                transparent: true,
                opacity: 0.5
            });

            const cellGeo = new THREE.PlaneGeometry(cellW, cellH);
            const cellMesh = new THREE.Mesh(cellGeo, cellMat);

            cellMesh.position.set(
                -W / 2 + col * cellW + cellW / 2,
                0.01,
                -H / 2 + row * cellH + cellH / 2
            );
            cellMesh.rotation.x = -Math.PI / 2;
            group.add(cellMesh);
        }
    }

    return group;
}
