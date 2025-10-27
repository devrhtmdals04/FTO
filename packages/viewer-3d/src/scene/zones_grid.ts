import * as THREE from 'three';
import { WORLD } from './pitch';

const ZONES_GRID_COLS = 7;
const ZONES_GRID_ROWS = 5;

const LONGITUDINAL_ZONES = [
    'OwnGoalLine',
    'DefensiveThird',
    'DefensiveMid',
    'Center',
    'AttackingMid',
    'AttackingThird',
    'OpponentGoalLine',
];

const LATERAL_ZONES = [
    'RightWing',
    'RightHalfSpace',
    'Center',
    'LeftHalfSpace',
    'LeftWing',
];

function createTextSprite(text: string) {
    const fontface = 'Arial';
    const fontsize = 18;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    context.font = `bolder ${fontsize}px ${fontface}`;
    const metrics = context.measureText(text);
    const textWidth = metrics.width;

    context.fillStyle = 'rgba(255, 255, 255, 0.95)';
    context.fillText(text, 0, fontsize);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(10, 5, 1.0);
    return sprite;
}

export function createZonesGrid(teamId: 'home' | 'away') {
    const group = new THREE.Group();

    const { W, H } = WORLD.FIELD;

    const gridGeo = new THREE.BufferGeometry();
    const gridMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });

    const vertices = [];
    const cellW = W / ZONES_GRID_COLS;
    const cellH = H / ZONES_GRID_ROWS;

    for (let i = 0; i <= ZONES_GRID_COLS; i++) {
        vertices.push(-W / 2 + i * cellW, 0.01, -H / 2);
        vertices.push(-W / 2 + i * cellW, 0.01, H / 2);
    }

    for (let i = 0; i <= ZONES_GRID_ROWS; i++) {
        vertices.push(-W / 2, 0.01, -H / 2 + i * cellH);
        vertices.push(W / 2, 0.01, -H / 2 + i * cellH);
    }

    gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const grid = new THREE.LineSegments(gridGeo, gridMat);
    group.add(grid);

    const longitudinalZones = teamId === 'home' ? LONGITUDINAL_ZONES : [...LONGITUDINAL_ZONES].reverse();
    const lateralZones = teamId === 'home' ? [...LATERAL_ZONES].reverse() : LATERAL_ZONES;

    for (let col = 0; col < ZONES_GRID_COLS; col++) {
        for (let row = 0; row < ZONES_GRID_ROWS; row++) {
            const longitudinalZone = longitudinalZones[col];
            const lateralZone = lateralZones[row];
            const zoneName = `${longitudinalZone}
${lateralZone}`;

            const textSprite = createTextSprite(zoneName);
            textSprite.position.set(
                -W / 2 + col * cellW + cellW / 2,
                0.1,
                -H / 2 + row * cellH + cellH / 2
            );
            textSprite.rotation.x = -Math.PI / 2;
            if (teamId === 'away') {
                textSprite.rotation.z = Math.PI;
            }
            group.add(textSprite);
        }
    }

    return group;
}