import * as THREE from 'three';

// --- Field & pitch metrics (meters) ---
export const WORLD = {
  FIELD: { W: 105, H: 68 },
  GOAL:  { W: 7.32, H: 2.44, D: 1.5, THICK: 0.12 },
  BALL:  { R: 0.11, M: 0.43 },
};
export const PITCH = {
  LINE: 0.12,                // line thickness
  CIRCLE_R: 9.15,            // center circle radius
  PEN_WIDTH: 40.32,          // penalty area width
  PEN_DEPTH: 16.5,           // penalty area depth
  GOAL_AREA_WIDTH: 18.32,    // goal area width
  GOAL_AREA_DEPTH: 5.5,      // goal area depth
  PEN_SPOT: 11.0,            // penalty mark distance from goal line
  D_RADIUS: 9.15,            // penalty arc radius
  CORNER_R: 1.0,             // corner arc radius
};

export function createPitch() {
    const group = new THREE.Group();

    const { W, H } = WORLD.FIELD;

    // Grass plane
    const grass = new THREE.Mesh(
      new THREE.PlaneGeometry(W, H),
      new THREE.MeshStandardMaterial({ color: 0x2d7d40, roughness: 1 })
    );
    grass.rotation.x = -Math.PI/2;
    grass.receiveShadow = true;
    group.add(grass);

    const lineY = 0.006; // slightly above grass

    // Helper: fat line between two points (XZ plane)
    const addLine = (x1: number,z1: number,x2: number,z2: number,thickness = PITCH.LINE) => {
      const dx = x2 - x1, dz = z2 - z1;
      const len = Math.hypot(dx, dz);
      const geo = new THREE.PlaneGeometry(len, thickness);
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const m = new THREE.Mesh(geo, mat);
      m.position.set((x1+x2)/2, lineY, (z1+z2)/2);
      m.rotation.x = -Math.PI/2;
      m.rotation.z = Math.atan2(dz, dx);
      m.renderOrder = 2;
      group.add(m);
      return m;
    };

    // Outer rectangle
    addLine(-W/2, -H/2,  W/2, -H/2);
    addLine( W/2, -H/2,  W/2,  H/2);
    addLine( W/2,  H/2, -W/2,  H/2);
    addLine(-W/2,  H/2, -W/2, -H/2);

    // Halfway line
    addLine(0, -H/2, 0, H/2);

    const addRing = (cx: number, cz: number, rIn: number, rOut: number, thetaStart=0, thetaLen=Math.PI*2, thin=false) => {
        const y = 0.006 + (thin? 0.0001 : 0);
        const geo = new THREE.RingGeometry(rIn, rOut, 64, 1, thetaStart, thetaLen);
        const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const m = new THREE.Mesh(geo, mat);
        m.position.set(cx, y, cz);
        m.rotation.x = -Math.PI/2;
        m.renderOrder = 2;
        group.add(m);
        return m;
    }

    const addSpot = (x: number, z: number, r: number) => {
        const geo = new THREE.CircleGeometry(r, 24);
        const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const m = new THREE.Mesh(geo, mat);
        m.position.set(x, 0.006, z);
        m.rotation.x = -Math.PI/2;
        m.renderOrder = 3;
        group.add(m);
        return m;
    }

    // Center circle & spot
    addRing(0, 0, PITCH.CIRCLE_R - PITCH.LINE/2, PITCH.CIRCLE_R + PITCH.LINE/2);
    addSpot(0, 0, PITCH.LINE*0.7);

    const addRect = (x1: number,z1: number,x2: number,z2: number) => {
        const addEdge = (a: number,b: number,c: number,d: number) => group.add(_edge(a,b,c,d));
        addEdge(x1,z1, x2,z1);
        addEdge(x2,z1, x2,z2);
        addEdge(x2,z2, x1,z2);
        addEdge(x1,z2, x1,z1);
    }

    const _edge = (x1: number,z1: number,x2: number,z2: number) => {
        const dx = x2-x1, dz = z2-z1, len = Math.hypot(dx,dz);
        const geo = new THREE.PlaneGeometry(len, PITCH.LINE);
        const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const m = new THREE.Mesh(geo, mat);
        m.position.set((x1+x2)/2, 0.006, (z1+z2)/2);
        m.rotation.x = -Math.PI/2; m.rotation.z = Math.atan2(dz,dx);
        m.renderOrder = 2; return m;
    }

    // Boxes & spots
    const box = (sign: number) => {
      const xGoal = sign < 0 ? -W/2 : W/2;
      const s = sign; // -1 left goal, +1 right goal
      // Penalty box
      addRect(
        xGoal, -PITCH.PEN_WIDTH/2,
        xGoal - s*PITCH.PEN_DEPTH, PITCH.PEN_WIDTH/2
      );
      // Goal area
      addRect(
        xGoal, -PITCH.GOAL_AREA_WIDTH/2,
        xGoal - s*PITCH.GOAL_AREA_DEPTH, PITCH.GOAL_AREA_WIDTH/2
      );
      // Penalty spot
      addSpot(xGoal - s*PITCH.PEN_SPOT, 0, PITCH.LINE*0.7);
      // D arc
      const cx = xGoal - s*PITCH.PEN_SPOT;
      const dx = Math.abs(PITCH.PEN_SPOT - PITCH.PEN_DEPTH); // x-dist from arc center to pen line
      const angle = Math.acos(dx / PITCH.D_RADIUS); // half angle of the arc
      const thetaStart = s < 0 ? -angle : Math.PI - angle;
      const thetaLen = angle * 2;
      addRing(cx, 0, PITCH.D_RADIUS - PITCH.LINE/2, PITCH.D_RADIUS + PITCH.LINE/2, thetaStart, thetaLen);
    };
    box(-1); box(+1);

    // Corners (quarter-ring)
    const corner = (sx: number, sz: number) => {
      const cx = sx * (W/2 - 0.001);
      const cz = sz * (H/2 - 0.001);
      const start = sz>0 ? (sx>0 ? Math.PI : Math.PI*1.5) : (sx>0 ? Math.PI/2 : 0);
      const len   = Math.PI/2;
      addRing(cx, cz, 0, PITCH.CORNER_R*2, start, len, true);
    };
    corner(-1,-1); corner(+1,-1); corner(-1,+1); corner(+1,+1);

    // Goals (simple posts + bar + back depth)
    addGoals(group);

    return group;
}

function addGoals(group: THREE.Group) {
    const { W } = WORLD.FIELD;
    const G = WORLD.GOAL;
    const postR = 0.06;

    const make = (sign: number) => {
      const xLine = sign * (W/2 + postR); // Place posts just outside the field
      const goalGroup = new THREE.Group();

      const postGeoV = new THREE.CylinderGeometry(postR, postR, G.H, 8);
      const postMat  = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
      const barGeo   = new THREE.CylinderGeometry(postR, postR, G.W, 8);

      // Frame: posts + bars
      const lp = new THREE.Mesh(postGeoV, postMat); lp.position.set(xLine, G.H/2, -G.W/2);
      const rp = new THREE.Mesh(postGeoV, postMat); rp.position.set(xLine, G.H/2,  G.W/2);
      const bar= new THREE.Mesh(barGeo,  postMat);  bar.rotation.x = Math.PI/2; bar.position.set(xLine, G.H, 0);
      [lp, rp, bar].forEach(m=>{ m.castShadow=true; m.receiveShadow=true; });

      const depth = G.D * sign;
      const backL = new THREE.Mesh(postGeoV, postMat); backL.position.set(xLine+depth, G.H/2, -G.W/2);
      const backR = new THREE.Mesh(postGeoV, postMat); backR.position.set(xLine+depth, G.H/2,  G.W/2);
      const backBar = new THREE.Mesh(barGeo, postMat); backBar.rotation.x = Math.PI/2; backBar.position.set(xLine+depth, G.H, 0);
      [backL, backR, backBar].forEach(m=>{ m.castShadow=true; m.receiveShadow=true; });

      // Net
      const netMat = new THREE.MeshBasicMaterial({ color: 0xcccccc, wireframe: true, side: THREE.DoubleSide });
      const netGeo = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        xLine,       0,   -G.W/2, // 0: flb
        xLine,       0,    G.W/2, // 1: frb
        xLine,       G.H, -G.W/2, // 2: flt
        xLine,       G.H,  G.W/2, // 3: frt
        xLine+depth, 0,   -G.W/2, // 4: blb
        xLine+depth, 0,    G.W/2, // 5: brb
        xLine+depth, G.H, -G.W/2, // 6: blt
        xLine+depth, G.H,  G.W/2, // 7: brt
      ]);
      netGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      netGeo.setIndex([
        // left side
        0, 4, 6, 0, 6, 2,
        // right side
        1, 3, 7, 1, 7, 5,
        // back
        4, 5, 7, 4, 7, 6,
        // top
        2, 6, 7, 2, 7, 3,
        // bottom
        0, 5, 4, 0, 1, 5
      ]);
      const net = new THREE.Mesh(netGeo, netMat);
      net.receiveShadow = true;

      goalGroup.add(lp, rp, bar, backL, backR, backBar, net);
      group.add(goalGroup);
    };

    make(-1);
    make(+1);
}
