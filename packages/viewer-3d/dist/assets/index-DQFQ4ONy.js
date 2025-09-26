var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(async () => {
  var _a2, _b;
  (function() {
    const e = document.createElement("link").relList;
    if (e && e.supports && e.supports("modulepreload")) return;
    for (const i of document.querySelectorAll('link[rel="modulepreload"]')) n(i);
    new MutationObserver((i) => {
      for (const r of i) if (r.type === "childList") for (const o of r.addedNodes) o.tagName === "LINK" && o.rel === "modulepreload" && n(o);
    }).observe(document, {
      childList: true,
      subtree: true
    });
    function t(i) {
      const r = {};
      return i.integrity && (r.integrity = i.integrity), i.referrerPolicy && (r.referrerPolicy = i.referrerPolicy), i.crossOrigin === "use-credentials" ? r.credentials = "include" : i.crossOrigin === "anonymous" ? r.credentials = "omit" : r.credentials = "same-origin", r;
    }
    function n(i) {
      if (i.ep) return;
      i.ep = true;
      const r = t(i);
      fetch(i.href, r);
    }
  })();
  const Ya = "169", Xi = {
    ROTATE: 0,
    DOLLY: 1,
    PAN: 2
  }, Bi = {
    ROTATE: 0,
    PAN: 1,
    DOLLY_PAN: 2,
    DOLLY_ROTATE: 3
  }, du = 0, wc = 1, fu = 2, rh = 1, pu = 2, bn = 3, Pn = 0, Ut = 1, Yt = 2, jn = 0, Yi = 1, Rc = 2, Cc = 3, Pc = 4, mu = 5, li = 100, gu = 101, _u = 102, xu = 103, vu = 104, yu = 200, Mu = 201, Su = 202, Eu = 203, ea = 204, ta = 205, bu = 206, Tu = 207, Au = 208, wu = 209, Ru = 210, Cu = 211, Pu = 212, Iu = 213, Lu = 214, na = 0, ia = 1, sa = 2, $i = 3, ra = 4, oa = 5, aa = 6, ca = 7, oh = 0, Du = 1, Uu = 2, Kn = 0, Nu = 1, Fu = 2, Ou = 3, Bu = 4, ku = 5, zu = 6, Hu = 7, Ic = "attached", Vu = "detached", ah = 300, Zi = 301, Ji = 302, la = 303, ha = 304, Qr = 306, Qi = 1e3, Xn = 1001, Vr = 1002, Pt = 1003, ch = 1004, Ts = 1005, zt = 1006, Rr = 1007, wn = 1008, In = 1009, lh = 1010, hh = 1011, Ds = 1012, qa = 1013, pi = 1014, on = 1015, zs = 1016, ja = 1017, Ka = 1018, es = 1020, uh = 35902, dh = 1021, fh = 1022, $t = 1023, ph = 1024, mh = 1025, qi = 1026, ts = 1027, $a = 1028, Za = 1029, gh = 1030, Ja = 1031, Qa = 1033, Cr = 33776, Pr = 33777, Ir = 33778, Lr = 33779, ua = 35840, da = 35841, fa = 35842, pa = 35843, ma = 36196, ga = 37492, _a = 37496, xa = 37808, va = 37809, ya = 37810, Ma = 37811, Sa = 37812, Ea = 37813, ba = 37814, Ta = 37815, Aa = 37816, wa = 37817, Ra = 37818, Ca = 37819, Pa = 37820, Ia = 37821, Dr = 36492, La = 36494, Da = 36495, _h = 36283, Ua = 36284, Na = 36285, Fa = 36286, xh = 2200, Gu = 2201, Wu = 2202, Us = 2300, Ns = 2301, lo = 2302, ki = 2400, zi = 2401, Gr = 2402, ec = 2500, Xu = 2501, Yu = 0, vh = 1, Oa = 2, qu = 3200, ju = 3201, yh = 0, Ku = 1, Wn = "", Rt = "srgb", Et = "srgb-linear", tc = "display-p3", eo = "display-p3-linear", Wr = "linear", rt = "srgb", Xr = "rec709", Yr = "p3", xi = 7680, Lc = 519, $u = 512, Zu = 513, Ju = 514, Mh = 515, Qu = 516, ed = 517, td = 518, nd = 519, Ba = 35044, Dc = "300 es", Rn = 2e3, qr = 2001;
  class Jn {
    addEventListener(e, t) {
      this._listeners === void 0 && (this._listeners = {});
      const n = this._listeners;
      n[e] === void 0 && (n[e] = []), n[e].indexOf(t) === -1 && n[e].push(t);
    }
    hasEventListener(e, t) {
      if (this._listeners === void 0) return false;
      const n = this._listeners;
      return n[e] !== void 0 && n[e].indexOf(t) !== -1;
    }
    removeEventListener(e, t) {
      if (this._listeners === void 0) return;
      const i = this._listeners[e];
      if (i !== void 0) {
        const r = i.indexOf(t);
        r !== -1 && i.splice(r, 1);
      }
    }
    dispatchEvent(e) {
      if (this._listeners === void 0) return;
      const n = this._listeners[e.type];
      if (n !== void 0) {
        e.target = this;
        const i = n.slice(0);
        for (let r = 0, o = i.length; r < o; r++) i[r].call(this, e);
        e.target = null;
      }
    }
  }
  const bt = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "0a",
    "0b",
    "0c",
    "0d",
    "0e",
    "0f",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "1a",
    "1b",
    "1c",
    "1d",
    "1e",
    "1f",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "2a",
    "2b",
    "2c",
    "2d",
    "2e",
    "2f",
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "3a",
    "3b",
    "3c",
    "3d",
    "3e",
    "3f",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
    "49",
    "4a",
    "4b",
    "4c",
    "4d",
    "4e",
    "4f",
    "50",
    "51",
    "52",
    "53",
    "54",
    "55",
    "56",
    "57",
    "58",
    "59",
    "5a",
    "5b",
    "5c",
    "5d",
    "5e",
    "5f",
    "60",
    "61",
    "62",
    "63",
    "64",
    "65",
    "66",
    "67",
    "68",
    "69",
    "6a",
    "6b",
    "6c",
    "6d",
    "6e",
    "6f",
    "70",
    "71",
    "72",
    "73",
    "74",
    "75",
    "76",
    "77",
    "78",
    "79",
    "7a",
    "7b",
    "7c",
    "7d",
    "7e",
    "7f",
    "80",
    "81",
    "82",
    "83",
    "84",
    "85",
    "86",
    "87",
    "88",
    "89",
    "8a",
    "8b",
    "8c",
    "8d",
    "8e",
    "8f",
    "90",
    "91",
    "92",
    "93",
    "94",
    "95",
    "96",
    "97",
    "98",
    "99",
    "9a",
    "9b",
    "9c",
    "9d",
    "9e",
    "9f",
    "a0",
    "a1",
    "a2",
    "a3",
    "a4",
    "a5",
    "a6",
    "a7",
    "a8",
    "a9",
    "aa",
    "ab",
    "ac",
    "ad",
    "ae",
    "af",
    "b0",
    "b1",
    "b2",
    "b3",
    "b4",
    "b5",
    "b6",
    "b7",
    "b8",
    "b9",
    "ba",
    "bb",
    "bc",
    "bd",
    "be",
    "bf",
    "c0",
    "c1",
    "c2",
    "c3",
    "c4",
    "c5",
    "c6",
    "c7",
    "c8",
    "c9",
    "ca",
    "cb",
    "cc",
    "cd",
    "ce",
    "cf",
    "d0",
    "d1",
    "d2",
    "d3",
    "d4",
    "d5",
    "d6",
    "d7",
    "d8",
    "d9",
    "da",
    "db",
    "dc",
    "dd",
    "de",
    "df",
    "e0",
    "e1",
    "e2",
    "e3",
    "e4",
    "e5",
    "e6",
    "e7",
    "e8",
    "e9",
    "ea",
    "eb",
    "ec",
    "ed",
    "ee",
    "ef",
    "f0",
    "f1",
    "f2",
    "f3",
    "f4",
    "f5",
    "f6",
    "f7",
    "f8",
    "f9",
    "fa",
    "fb",
    "fc",
    "fd",
    "fe",
    "ff"
  ];
  let Uc = 1234567;
  const Cs = Math.PI / 180, ns = 180 / Math.PI;
  function an() {
    const s = Math.random() * 4294967295 | 0, e = Math.random() * 4294967295 | 0, t = Math.random() * 4294967295 | 0, n = Math.random() * 4294967295 | 0;
    return (bt[s & 255] + bt[s >> 8 & 255] + bt[s >> 16 & 255] + bt[s >> 24 & 255] + "-" + bt[e & 255] + bt[e >> 8 & 255] + "-" + bt[e >> 16 & 15 | 64] + bt[e >> 24 & 255] + "-" + bt[t & 63 | 128] + bt[t >> 8 & 255] + "-" + bt[t >> 16 & 255] + bt[t >> 24 & 255] + bt[n & 255] + bt[n >> 8 & 255] + bt[n >> 16 & 255] + bt[n >> 24 & 255]).toLowerCase();
  }
  function St(s, e, t) {
    return Math.max(e, Math.min(t, s));
  }
  function nc(s, e) {
    return (s % e + e) % e;
  }
  function id(s, e, t, n, i) {
    return n + (s - e) * (i - n) / (t - e);
  }
  function sd(s, e, t) {
    return s !== e ? (t - s) / (e - s) : 0;
  }
  function Ps(s, e, t) {
    return (1 - t) * s + t * e;
  }
  function rd(s, e, t, n) {
    return Ps(s, e, 1 - Math.exp(-t * n));
  }
  function od(s, e = 1) {
    return e - Math.abs(nc(s, e * 2) - e);
  }
  function ad(s, e, t) {
    return s <= e ? 0 : s >= t ? 1 : (s = (s - e) / (t - e), s * s * (3 - 2 * s));
  }
  function cd(s, e, t) {
    return s <= e ? 0 : s >= t ? 1 : (s = (s - e) / (t - e), s * s * s * (s * (s * 6 - 15) + 10));
  }
  function ld(s, e) {
    return s + Math.floor(Math.random() * (e - s + 1));
  }
  function hd(s, e) {
    return s + Math.random() * (e - s);
  }
  function ud(s) {
    return s * (0.5 - Math.random());
  }
  function dd(s) {
    s !== void 0 && (Uc = s);
    let e = Uc += 1831565813;
    return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
  }
  function fd(s) {
    return s * Cs;
  }
  function pd(s) {
    return s * ns;
  }
  function md(s) {
    return (s & s - 1) === 0 && s !== 0;
  }
  function gd(s) {
    return Math.pow(2, Math.ceil(Math.log(s) / Math.LN2));
  }
  function _d(s) {
    return Math.pow(2, Math.floor(Math.log(s) / Math.LN2));
  }
  function xd(s, e, t, n, i) {
    const r = Math.cos, o = Math.sin, a = r(t / 2), c = o(t / 2), l = r((e + n) / 2), h = o((e + n) / 2), u = r((e - n) / 2), d = o((e - n) / 2), f = r((n - e) / 2), g = o((n - e) / 2);
    switch (i) {
      case "XYX":
        s.set(a * h, c * u, c * d, a * l);
        break;
      case "YZY":
        s.set(c * d, a * h, c * u, a * l);
        break;
      case "ZXZ":
        s.set(c * u, c * d, a * h, a * l);
        break;
      case "XZX":
        s.set(a * h, c * g, c * f, a * l);
        break;
      case "YXY":
        s.set(c * f, a * h, c * g, a * l);
        break;
      case "ZYZ":
        s.set(c * g, c * f, a * h, a * l);
        break;
      default:
        console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: " + i);
    }
  }
  function rn(s, e) {
    switch (e.constructor) {
      case Float32Array:
        return s;
      case Uint32Array:
        return s / 4294967295;
      case Uint16Array:
        return s / 65535;
      case Uint8Array:
        return s / 255;
      case Int32Array:
        return Math.max(s / 2147483647, -1);
      case Int16Array:
        return Math.max(s / 32767, -1);
      case Int8Array:
        return Math.max(s / 127, -1);
      default:
        throw new Error("Invalid component type.");
    }
  }
  function Je(s, e) {
    switch (e.constructor) {
      case Float32Array:
        return s;
      case Uint32Array:
        return Math.round(s * 4294967295);
      case Uint16Array:
        return Math.round(s * 65535);
      case Uint8Array:
        return Math.round(s * 255);
      case Int32Array:
        return Math.round(s * 2147483647);
      case Int16Array:
        return Math.round(s * 32767);
      case Int8Array:
        return Math.round(s * 127);
      default:
        throw new Error("Invalid component type.");
    }
  }
  const nn = {
    DEG2RAD: Cs,
    RAD2DEG: ns,
    generateUUID: an,
    clamp: St,
    euclideanModulo: nc,
    mapLinear: id,
    inverseLerp: sd,
    lerp: Ps,
    damp: rd,
    pingpong: od,
    smoothstep: ad,
    smootherstep: cd,
    randInt: ld,
    randFloat: hd,
    randFloatSpread: ud,
    seededRandom: dd,
    degToRad: fd,
    radToDeg: pd,
    isPowerOfTwo: md,
    ceilPowerOfTwo: gd,
    floorPowerOfTwo: _d,
    setQuaternionFromProperEuler: xd,
    normalize: Je,
    denormalize: rn
  };
  class ye {
    constructor(e = 0, t = 0) {
      ye.prototype.isVector2 = true, this.x = e, this.y = t;
    }
    get width() {
      return this.x;
    }
    set width(e) {
      this.x = e;
    }
    get height() {
      return this.y;
    }
    set height(e) {
      this.y = e;
    }
    set(e, t) {
      return this.x = e, this.y = t, this;
    }
    setScalar(e) {
      return this.x = e, this.y = e, this;
    }
    setX(e) {
      return this.x = e, this;
    }
    setY(e) {
      return this.y = e, this;
    }
    setComponent(e, t) {
      switch (e) {
        case 0:
          this.x = t;
          break;
        case 1:
          this.y = t;
          break;
        default:
          throw new Error("index is out of range: " + e);
      }
      return this;
    }
    getComponent(e) {
      switch (e) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        default:
          throw new Error("index is out of range: " + e);
      }
    }
    clone() {
      return new this.constructor(this.x, this.y);
    }
    copy(e) {
      return this.x = e.x, this.y = e.y, this;
    }
    add(e) {
      return this.x += e.x, this.y += e.y, this;
    }
    addScalar(e) {
      return this.x += e, this.y += e, this;
    }
    addVectors(e, t) {
      return this.x = e.x + t.x, this.y = e.y + t.y, this;
    }
    addScaledVector(e, t) {
      return this.x += e.x * t, this.y += e.y * t, this;
    }
    sub(e) {
      return this.x -= e.x, this.y -= e.y, this;
    }
    subScalar(e) {
      return this.x -= e, this.y -= e, this;
    }
    subVectors(e, t) {
      return this.x = e.x - t.x, this.y = e.y - t.y, this;
    }
    multiply(e) {
      return this.x *= e.x, this.y *= e.y, this;
    }
    multiplyScalar(e) {
      return this.x *= e, this.y *= e, this;
    }
    divide(e) {
      return this.x /= e.x, this.y /= e.y, this;
    }
    divideScalar(e) {
      return this.multiplyScalar(1 / e);
    }
    applyMatrix3(e) {
      const t = this.x, n = this.y, i = e.elements;
      return this.x = i[0] * t + i[3] * n + i[6], this.y = i[1] * t + i[4] * n + i[7], this;
    }
    min(e) {
      return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this;
    }
    max(e) {
      return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this;
    }
    clamp(e, t) {
      return this.x = Math.max(e.x, Math.min(t.x, this.x)), this.y = Math.max(e.y, Math.min(t.y, this.y)), this;
    }
    clampScalar(e, t) {
      return this.x = Math.max(e, Math.min(t, this.x)), this.y = Math.max(e, Math.min(t, this.y)), this;
    }
    clampLength(e, t) {
      const n = this.length();
      return this.divideScalar(n || 1).multiplyScalar(Math.max(e, Math.min(t, n)));
    }
    floor() {
      return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
    }
    ceil() {
      return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
    }
    round() {
      return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
    }
    roundToZero() {
      return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this;
    }
    negate() {
      return this.x = -this.x, this.y = -this.y, this;
    }
    dot(e) {
      return this.x * e.x + this.y * e.y;
    }
    cross(e) {
      return this.x * e.y - this.y * e.x;
    }
    lengthSq() {
      return this.x * this.x + this.y * this.y;
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    manhattanLength() {
      return Math.abs(this.x) + Math.abs(this.y);
    }
    normalize() {
      return this.divideScalar(this.length() || 1);
    }
    angle() {
      return Math.atan2(-this.y, -this.x) + Math.PI;
    }
    angleTo(e) {
      const t = Math.sqrt(this.lengthSq() * e.lengthSq());
      if (t === 0) return Math.PI / 2;
      const n = this.dot(e) / t;
      return Math.acos(St(n, -1, 1));
    }
    distanceTo(e) {
      return Math.sqrt(this.distanceToSquared(e));
    }
    distanceToSquared(e) {
      const t = this.x - e.x, n = this.y - e.y;
      return t * t + n * n;
    }
    manhattanDistanceTo(e) {
      return Math.abs(this.x - e.x) + Math.abs(this.y - e.y);
    }
    setLength(e) {
      return this.normalize().multiplyScalar(e);
    }
    lerp(e, t) {
      return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this;
    }
    lerpVectors(e, t, n) {
      return this.x = e.x + (t.x - e.x) * n, this.y = e.y + (t.y - e.y) * n, this;
    }
    equals(e) {
      return e.x === this.x && e.y === this.y;
    }
    fromArray(e, t = 0) {
      return this.x = e[t], this.y = e[t + 1], this;
    }
    toArray(e = [], t = 0) {
      return e[t] = this.x, e[t + 1] = this.y, e;
    }
    fromBufferAttribute(e, t) {
      return this.x = e.getX(t), this.y = e.getY(t), this;
    }
    rotateAround(e, t) {
      const n = Math.cos(t), i = Math.sin(t), r = this.x - e.x, o = this.y - e.y;
      return this.x = r * n - o * i + e.x, this.y = r * i + o * n + e.y, this;
    }
    random() {
      return this.x = Math.random(), this.y = Math.random(), this;
    }
    *[Symbol.iterator]() {
      yield this.x, yield this.y;
    }
  }
  class De {
    constructor(e, t, n, i, r, o, a, c, l) {
      De.prototype.isMatrix3 = true, this.elements = [
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ], e !== void 0 && this.set(e, t, n, i, r, o, a, c, l);
    }
    set(e, t, n, i, r, o, a, c, l) {
      const h = this.elements;
      return h[0] = e, h[1] = i, h[2] = a, h[3] = t, h[4] = r, h[5] = c, h[6] = n, h[7] = o, h[8] = l, this;
    }
    identity() {
      return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1), this;
    }
    copy(e) {
      const t = this.elements, n = e.elements;
      return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t[6] = n[6], t[7] = n[7], t[8] = n[8], this;
    }
    extractBasis(e, t, n) {
      return e.setFromMatrix3Column(this, 0), t.setFromMatrix3Column(this, 1), n.setFromMatrix3Column(this, 2), this;
    }
    setFromMatrix4(e) {
      const t = e.elements;
      return this.set(t[0], t[4], t[8], t[1], t[5], t[9], t[2], t[6], t[10]), this;
    }
    multiply(e) {
      return this.multiplyMatrices(this, e);
    }
    premultiply(e) {
      return this.multiplyMatrices(e, this);
    }
    multiplyMatrices(e, t) {
      const n = e.elements, i = t.elements, r = this.elements, o = n[0], a = n[3], c = n[6], l = n[1], h = n[4], u = n[7], d = n[2], f = n[5], g = n[8], _ = i[0], m = i[3], p = i[6], E = i[1], M = i[4], b = i[7], I = i[2], A = i[5], w = i[8];
      return r[0] = o * _ + a * E + c * I, r[3] = o * m + a * M + c * A, r[6] = o * p + a * b + c * w, r[1] = l * _ + h * E + u * I, r[4] = l * m + h * M + u * A, r[7] = l * p + h * b + u * w, r[2] = d * _ + f * E + g * I, r[5] = d * m + f * M + g * A, r[8] = d * p + f * b + g * w, this;
    }
    multiplyScalar(e) {
      const t = this.elements;
      return t[0] *= e, t[3] *= e, t[6] *= e, t[1] *= e, t[4] *= e, t[7] *= e, t[2] *= e, t[5] *= e, t[8] *= e, this;
    }
    determinant() {
      const e = this.elements, t = e[0], n = e[1], i = e[2], r = e[3], o = e[4], a = e[5], c = e[6], l = e[7], h = e[8];
      return t * o * h - t * a * l - n * r * h + n * a * c + i * r * l - i * o * c;
    }
    invert() {
      const e = this.elements, t = e[0], n = e[1], i = e[2], r = e[3], o = e[4], a = e[5], c = e[6], l = e[7], h = e[8], u = h * o - a * l, d = a * c - h * r, f = l * r - o * c, g = t * u + n * d + i * f;
      if (g === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
      const _ = 1 / g;
      return e[0] = u * _, e[1] = (i * l - h * n) * _, e[2] = (a * n - i * o) * _, e[3] = d * _, e[4] = (h * t - i * c) * _, e[5] = (i * r - a * t) * _, e[6] = f * _, e[7] = (n * c - l * t) * _, e[8] = (o * t - n * r) * _, this;
    }
    transpose() {
      let e;
      const t = this.elements;
      return e = t[1], t[1] = t[3], t[3] = e, e = t[2], t[2] = t[6], t[6] = e, e = t[5], t[5] = t[7], t[7] = e, this;
    }
    getNormalMatrix(e) {
      return this.setFromMatrix4(e).invert().transpose();
    }
    transposeIntoArray(e) {
      const t = this.elements;
      return e[0] = t[0], e[1] = t[3], e[2] = t[6], e[3] = t[1], e[4] = t[4], e[5] = t[7], e[6] = t[2], e[7] = t[5], e[8] = t[8], this;
    }
    setUvTransform(e, t, n, i, r, o, a) {
      const c = Math.cos(r), l = Math.sin(r);
      return this.set(n * c, n * l, -n * (c * o + l * a) + o + e, -i * l, i * c, -i * (-l * o + c * a) + a + t, 0, 0, 1), this;
    }
    scale(e, t) {
      return this.premultiply(ho.makeScale(e, t)), this;
    }
    rotate(e) {
      return this.premultiply(ho.makeRotation(-e)), this;
    }
    translate(e, t) {
      return this.premultiply(ho.makeTranslation(e, t)), this;
    }
    makeTranslation(e, t) {
      return e.isVector2 ? this.set(1, 0, e.x, 0, 1, e.y, 0, 0, 1) : this.set(1, 0, e, 0, 1, t, 0, 0, 1), this;
    }
    makeRotation(e) {
      const t = Math.cos(e), n = Math.sin(e);
      return this.set(t, -n, 0, n, t, 0, 0, 0, 1), this;
    }
    makeScale(e, t) {
      return this.set(e, 0, 0, 0, t, 0, 0, 0, 1), this;
    }
    equals(e) {
      const t = this.elements, n = e.elements;
      for (let i = 0; i < 9; i++) if (t[i] !== n[i]) return false;
      return true;
    }
    fromArray(e, t = 0) {
      for (let n = 0; n < 9; n++) this.elements[n] = e[n + t];
      return this;
    }
    toArray(e = [], t = 0) {
      const n = this.elements;
      return e[t] = n[0], e[t + 1] = n[1], e[t + 2] = n[2], e[t + 3] = n[3], e[t + 4] = n[4], e[t + 5] = n[5], e[t + 6] = n[6], e[t + 7] = n[7], e[t + 8] = n[8], e;
    }
    clone() {
      return new this.constructor().fromArray(this.elements);
    }
  }
  const ho = new De();
  function Sh(s) {
    for (let e = s.length - 1; e >= 0; --e) if (s[e] >= 65535) return true;
    return false;
  }
  function Fs(s) {
    return document.createElementNS("http://www.w3.org/1999/xhtml", s);
  }
  function vd() {
    const s = Fs("canvas");
    return s.style.display = "block", s;
  }
  const Nc = {};
  function Ur(s) {
    s in Nc || (Nc[s] = true, console.warn(s));
  }
  function yd(s, e, t) {
    return new Promise(function(n, i) {
      function r() {
        switch (s.clientWaitSync(e, s.SYNC_FLUSH_COMMANDS_BIT, 0)) {
          case s.WAIT_FAILED:
            i();
            break;
          case s.TIMEOUT_EXPIRED:
            setTimeout(r, t);
            break;
          default:
            n();
        }
      }
      setTimeout(r, t);
    });
  }
  function Md(s) {
    const e = s.elements;
    e[2] = 0.5 * e[2] + 0.5 * e[3], e[6] = 0.5 * e[6] + 0.5 * e[7], e[10] = 0.5 * e[10] + 0.5 * e[11], e[14] = 0.5 * e[14] + 0.5 * e[15];
  }
  function Sd(s) {
    const e = s.elements;
    e[11] === -1 ? (e[10] = -e[10] - 1, e[14] = -e[14]) : (e[10] = -e[10], e[14] = -e[14] + 1);
  }
  const Fc = new De().set(0.8224621, 0.177538, 0, 0.0331941, 0.9668058, 0, 0.0170827, 0.0723974, 0.9105199), Oc = new De().set(1.2249401, -0.2249404, 0, -0.0420569, 1.0420571, 0, -0.0196376, -0.0786361, 1.0982735), ds = {
    [Et]: {
      transfer: Wr,
      primaries: Xr,
      luminanceCoefficients: [
        0.2126,
        0.7152,
        0.0722
      ],
      toReference: (s) => s,
      fromReference: (s) => s
    },
    [Rt]: {
      transfer: rt,
      primaries: Xr,
      luminanceCoefficients: [
        0.2126,
        0.7152,
        0.0722
      ],
      toReference: (s) => s.convertSRGBToLinear(),
      fromReference: (s) => s.convertLinearToSRGB()
    },
    [eo]: {
      transfer: Wr,
      primaries: Yr,
      luminanceCoefficients: [
        0.2289,
        0.6917,
        0.0793
      ],
      toReference: (s) => s.applyMatrix3(Oc),
      fromReference: (s) => s.applyMatrix3(Fc)
    },
    [tc]: {
      transfer: rt,
      primaries: Yr,
      luminanceCoefficients: [
        0.2289,
        0.6917,
        0.0793
      ],
      toReference: (s) => s.convertSRGBToLinear().applyMatrix3(Oc),
      fromReference: (s) => s.applyMatrix3(Fc).convertLinearToSRGB()
    }
  }, Ed = /* @__PURE__ */ new Set([
    Et,
    eo
  ]), Ge = {
    enabled: true,
    _workingColorSpace: Et,
    get workingColorSpace() {
      return this._workingColorSpace;
    },
    set workingColorSpace(s) {
      if (!Ed.has(s)) throw new Error(`Unsupported working color space, "${s}".`);
      this._workingColorSpace = s;
    },
    convert: function(s, e, t) {
      if (this.enabled === false || e === t || !e || !t) return s;
      const n = ds[e].toReference, i = ds[t].fromReference;
      return i(n(s));
    },
    fromWorkingColorSpace: function(s, e) {
      return this.convert(s, this._workingColorSpace, e);
    },
    toWorkingColorSpace: function(s, e) {
      return this.convert(s, e, this._workingColorSpace);
    },
    getPrimaries: function(s) {
      return ds[s].primaries;
    },
    getTransfer: function(s) {
      return s === Wn ? Wr : ds[s].transfer;
    },
    getLuminanceCoefficients: function(s, e = this._workingColorSpace) {
      return s.fromArray(ds[e].luminanceCoefficients);
    }
  };
  function ji(s) {
    return s < 0.04045 ? s * 0.0773993808 : Math.pow(s * 0.9478672986 + 0.0521327014, 2.4);
  }
  function uo(s) {
    return s < 31308e-7 ? s * 12.92 : 1.055 * Math.pow(s, 0.41666) - 0.055;
  }
  let vi;
  class bd {
    static getDataURL(e) {
      if (/^data:/i.test(e.src) || typeof HTMLCanvasElement > "u") return e.src;
      let t;
      if (e instanceof HTMLCanvasElement) t = e;
      else {
        vi === void 0 && (vi = Fs("canvas")), vi.width = e.width, vi.height = e.height;
        const n = vi.getContext("2d");
        e instanceof ImageData ? n.putImageData(e, 0, 0) : n.drawImage(e, 0, 0, e.width, e.height), t = vi;
      }
      return t.width > 2048 || t.height > 2048 ? (console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons", e), t.toDataURL("image/jpeg", 0.6)) : t.toDataURL("image/png");
    }
    static sRGBToLinear(e) {
      if (typeof HTMLImageElement < "u" && e instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && e instanceof ImageBitmap) {
        const t = Fs("canvas");
        t.width = e.width, t.height = e.height;
        const n = t.getContext("2d");
        n.drawImage(e, 0, 0, e.width, e.height);
        const i = n.getImageData(0, 0, e.width, e.height), r = i.data;
        for (let o = 0; o < r.length; o++) r[o] = ji(r[o] / 255) * 255;
        return n.putImageData(i, 0, 0), t;
      } else if (e.data) {
        const t = e.data.slice(0);
        for (let n = 0; n < t.length; n++) t instanceof Uint8Array || t instanceof Uint8ClampedArray ? t[n] = Math.floor(ji(t[n] / 255) * 255) : t[n] = ji(t[n]);
        return {
          data: t,
          width: e.width,
          height: e.height
        };
      } else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."), e;
    }
  }
  let Td = 0;
  class Eh {
    constructor(e = null) {
      this.isSource = true, Object.defineProperty(this, "id", {
        value: Td++
      }), this.uuid = an(), this.data = e, this.dataReady = true, this.version = 0;
    }
    set needsUpdate(e) {
      e === true && this.version++;
    }
    toJSON(e) {
      const t = e === void 0 || typeof e == "string";
      if (!t && e.images[this.uuid] !== void 0) return e.images[this.uuid];
      const n = {
        uuid: this.uuid,
        url: ""
      }, i = this.data;
      if (i !== null) {
        let r;
        if (Array.isArray(i)) {
          r = [];
          for (let o = 0, a = i.length; o < a; o++) i[o].isDataTexture ? r.push(fo(i[o].image)) : r.push(fo(i[o]));
        } else r = fo(i);
        n.url = r;
      }
      return t || (e.images[this.uuid] = n), n;
    }
  }
  function fo(s) {
    return typeof HTMLImageElement < "u" && s instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && s instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && s instanceof ImageBitmap ? bd.getDataURL(s) : s.data ? {
      data: Array.from(s.data),
      width: s.width,
      height: s.height,
      type: s.data.constructor.name
    } : (console.warn("THREE.Texture: Unable to serialize Texture."), {});
  }
  let Ad = 0;
  class mt extends Jn {
    constructor(e = mt.DEFAULT_IMAGE, t = mt.DEFAULT_MAPPING, n = Xn, i = Xn, r = zt, o = wn, a = $t, c = In, l = mt.DEFAULT_ANISOTROPY, h = Wn) {
      super(), this.isTexture = true, Object.defineProperty(this, "id", {
        value: Ad++
      }), this.uuid = an(), this.name = "", this.source = new Eh(e), this.mipmaps = [], this.mapping = t, this.channel = 0, this.wrapS = n, this.wrapT = i, this.magFilter = r, this.minFilter = o, this.anisotropy = l, this.format = a, this.internalFormat = null, this.type = c, this.offset = new ye(0, 0), this.repeat = new ye(1, 1), this.center = new ye(0, 0), this.rotation = 0, this.matrixAutoUpdate = true, this.matrix = new De(), this.generateMipmaps = true, this.premultiplyAlpha = false, this.flipY = true, this.unpackAlignment = 4, this.colorSpace = h, this.userData = {}, this.version = 0, this.onUpdate = null, this.isRenderTargetTexture = false, this.pmremVersion = 0;
    }
    get image() {
      return this.source.data;
    }
    set image(e = null) {
      this.source.data = e;
    }
    updateMatrix() {
      this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e) {
      return this.name = e.name, this.source = e.source, this.mipmaps = e.mipmaps.slice(0), this.mapping = e.mapping, this.channel = e.channel, this.wrapS = e.wrapS, this.wrapT = e.wrapT, this.magFilter = e.magFilter, this.minFilter = e.minFilter, this.anisotropy = e.anisotropy, this.format = e.format, this.internalFormat = e.internalFormat, this.type = e.type, this.offset.copy(e.offset), this.repeat.copy(e.repeat), this.center.copy(e.center), this.rotation = e.rotation, this.matrixAutoUpdate = e.matrixAutoUpdate, this.matrix.copy(e.matrix), this.generateMipmaps = e.generateMipmaps, this.premultiplyAlpha = e.premultiplyAlpha, this.flipY = e.flipY, this.unpackAlignment = e.unpackAlignment, this.colorSpace = e.colorSpace, this.userData = JSON.parse(JSON.stringify(e.userData)), this.needsUpdate = true, this;
    }
    toJSON(e) {
      const t = e === void 0 || typeof e == "string";
      if (!t && e.textures[this.uuid] !== void 0) return e.textures[this.uuid];
      const n = {
        metadata: {
          version: 4.6,
          type: "Texture",
          generator: "Texture.toJSON"
        },
        uuid: this.uuid,
        name: this.name,
        image: this.source.toJSON(e).uuid,
        mapping: this.mapping,
        channel: this.channel,
        repeat: [
          this.repeat.x,
          this.repeat.y
        ],
        offset: [
          this.offset.x,
          this.offset.y
        ],
        center: [
          this.center.x,
          this.center.y
        ],
        rotation: this.rotation,
        wrap: [
          this.wrapS,
          this.wrapT
        ],
        format: this.format,
        internalFormat: this.internalFormat,
        type: this.type,
        colorSpace: this.colorSpace,
        minFilter: this.minFilter,
        magFilter: this.magFilter,
        anisotropy: this.anisotropy,
        flipY: this.flipY,
        generateMipmaps: this.generateMipmaps,
        premultiplyAlpha: this.premultiplyAlpha,
        unpackAlignment: this.unpackAlignment
      };
      return Object.keys(this.userData).length > 0 && (n.userData = this.userData), t || (e.textures[this.uuid] = n), n;
    }
    dispose() {
      this.dispatchEvent({
        type: "dispose"
      });
    }
    transformUv(e) {
      if (this.mapping !== ah) return e;
      if (e.applyMatrix3(this.matrix), e.x < 0 || e.x > 1) switch (this.wrapS) {
        case Qi:
          e.x = e.x - Math.floor(e.x);
          break;
        case Xn:
          e.x = e.x < 0 ? 0 : 1;
          break;
        case Vr:
          Math.abs(Math.floor(e.x) % 2) === 1 ? e.x = Math.ceil(e.x) - e.x : e.x = e.x - Math.floor(e.x);
          break;
      }
      if (e.y < 0 || e.y > 1) switch (this.wrapT) {
        case Qi:
          e.y = e.y - Math.floor(e.y);
          break;
        case Xn:
          e.y = e.y < 0 ? 0 : 1;
          break;
        case Vr:
          Math.abs(Math.floor(e.y) % 2) === 1 ? e.y = Math.ceil(e.y) - e.y : e.y = e.y - Math.floor(e.y);
          break;
      }
      return this.flipY && (e.y = 1 - e.y), e;
    }
    set needsUpdate(e) {
      e === true && (this.version++, this.source.needsUpdate = true);
    }
    set needsPMREMUpdate(e) {
      e === true && this.pmremVersion++;
    }
  }
  mt.DEFAULT_IMAGE = null;
  mt.DEFAULT_MAPPING = ah;
  mt.DEFAULT_ANISOTROPY = 1;
  class Ye {
    constructor(e = 0, t = 0, n = 0, i = 1) {
      Ye.prototype.isVector4 = true, this.x = e, this.y = t, this.z = n, this.w = i;
    }
    get width() {
      return this.z;
    }
    set width(e) {
      this.z = e;
    }
    get height() {
      return this.w;
    }
    set height(e) {
      this.w = e;
    }
    set(e, t, n, i) {
      return this.x = e, this.y = t, this.z = n, this.w = i, this;
    }
    setScalar(e) {
      return this.x = e, this.y = e, this.z = e, this.w = e, this;
    }
    setX(e) {
      return this.x = e, this;
    }
    setY(e) {
      return this.y = e, this;
    }
    setZ(e) {
      return this.z = e, this;
    }
    setW(e) {
      return this.w = e, this;
    }
    setComponent(e, t) {
      switch (e) {
        case 0:
          this.x = t;
          break;
        case 1:
          this.y = t;
          break;
        case 2:
          this.z = t;
          break;
        case 3:
          this.w = t;
          break;
        default:
          throw new Error("index is out of range: " + e);
      }
      return this;
    }
    getComponent(e) {
      switch (e) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        case 2:
          return this.z;
        case 3:
          return this.w;
        default:
          throw new Error("index is out of range: " + e);
      }
    }
    clone() {
      return new this.constructor(this.x, this.y, this.z, this.w);
    }
    copy(e) {
      return this.x = e.x, this.y = e.y, this.z = e.z, this.w = e.w !== void 0 ? e.w : 1, this;
    }
    add(e) {
      return this.x += e.x, this.y += e.y, this.z += e.z, this.w += e.w, this;
    }
    addScalar(e) {
      return this.x += e, this.y += e, this.z += e, this.w += e, this;
    }
    addVectors(e, t) {
      return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this.w = e.w + t.w, this;
    }
    addScaledVector(e, t) {
      return this.x += e.x * t, this.y += e.y * t, this.z += e.z * t, this.w += e.w * t, this;
    }
    sub(e) {
      return this.x -= e.x, this.y -= e.y, this.z -= e.z, this.w -= e.w, this;
    }
    subScalar(e) {
      return this.x -= e, this.y -= e, this.z -= e, this.w -= e, this;
    }
    subVectors(e, t) {
      return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this.w = e.w - t.w, this;
    }
    multiply(e) {
      return this.x *= e.x, this.y *= e.y, this.z *= e.z, this.w *= e.w, this;
    }
    multiplyScalar(e) {
      return this.x *= e, this.y *= e, this.z *= e, this.w *= e, this;
    }
    applyMatrix4(e) {
      const t = this.x, n = this.y, i = this.z, r = this.w, o = e.elements;
      return this.x = o[0] * t + o[4] * n + o[8] * i + o[12] * r, this.y = o[1] * t + o[5] * n + o[9] * i + o[13] * r, this.z = o[2] * t + o[6] * n + o[10] * i + o[14] * r, this.w = o[3] * t + o[7] * n + o[11] * i + o[15] * r, this;
    }
    divideScalar(e) {
      return this.multiplyScalar(1 / e);
    }
    setAxisAngleFromQuaternion(e) {
      this.w = 2 * Math.acos(e.w);
      const t = Math.sqrt(1 - e.w * e.w);
      return t < 1e-4 ? (this.x = 1, this.y = 0, this.z = 0) : (this.x = e.x / t, this.y = e.y / t, this.z = e.z / t), this;
    }
    setAxisAngleFromRotationMatrix(e) {
      let t, n, i, r;
      const c = e.elements, l = c[0], h = c[4], u = c[8], d = c[1], f = c[5], g = c[9], _ = c[2], m = c[6], p = c[10];
      if (Math.abs(h - d) < 0.01 && Math.abs(u - _) < 0.01 && Math.abs(g - m) < 0.01) {
        if (Math.abs(h + d) < 0.1 && Math.abs(u + _) < 0.1 && Math.abs(g + m) < 0.1 && Math.abs(l + f + p - 3) < 0.1) return this.set(1, 0, 0, 0), this;
        t = Math.PI;
        const M = (l + 1) / 2, b = (f + 1) / 2, I = (p + 1) / 2, A = (h + d) / 4, w = (u + _) / 4, U = (g + m) / 4;
        return M > b && M > I ? M < 0.01 ? (n = 0, i = 0.707106781, r = 0.707106781) : (n = Math.sqrt(M), i = A / n, r = w / n) : b > I ? b < 0.01 ? (n = 0.707106781, i = 0, r = 0.707106781) : (i = Math.sqrt(b), n = A / i, r = U / i) : I < 0.01 ? (n = 0.707106781, i = 0.707106781, r = 0) : (r = Math.sqrt(I), n = w / r, i = U / r), this.set(n, i, r, t), this;
      }
      let E = Math.sqrt((m - g) * (m - g) + (u - _) * (u - _) + (d - h) * (d - h));
      return Math.abs(E) < 1e-3 && (E = 1), this.x = (m - g) / E, this.y = (u - _) / E, this.z = (d - h) / E, this.w = Math.acos((l + f + p - 1) / 2), this;
    }
    setFromMatrixPosition(e) {
      const t = e.elements;
      return this.x = t[12], this.y = t[13], this.z = t[14], this.w = t[15], this;
    }
    min(e) {
      return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this.w = Math.min(this.w, e.w), this;
    }
    max(e) {
      return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this.w = Math.max(this.w, e.w), this;
    }
    clamp(e, t) {
      return this.x = Math.max(e.x, Math.min(t.x, this.x)), this.y = Math.max(e.y, Math.min(t.y, this.y)), this.z = Math.max(e.z, Math.min(t.z, this.z)), this.w = Math.max(e.w, Math.min(t.w, this.w)), this;
    }
    clampScalar(e, t) {
      return this.x = Math.max(e, Math.min(t, this.x)), this.y = Math.max(e, Math.min(t, this.y)), this.z = Math.max(e, Math.min(t, this.z)), this.w = Math.max(e, Math.min(t, this.w)), this;
    }
    clampLength(e, t) {
      const n = this.length();
      return this.divideScalar(n || 1).multiplyScalar(Math.max(e, Math.min(t, n)));
    }
    floor() {
      return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this.w = Math.floor(this.w), this;
    }
    ceil() {
      return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this.w = Math.ceil(this.w), this;
    }
    round() {
      return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this.w = Math.round(this.w), this;
    }
    roundToZero() {
      return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this.w = Math.trunc(this.w), this;
    }
    negate() {
      return this.x = -this.x, this.y = -this.y, this.z = -this.z, this.w = -this.w, this;
    }
    dot(e) {
      return this.x * e.x + this.y * e.y + this.z * e.z + this.w * e.w;
    }
    lengthSq() {
      return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }
    manhattanLength() {
      return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
    }
    normalize() {
      return this.divideScalar(this.length() || 1);
    }
    setLength(e) {
      return this.normalize().multiplyScalar(e);
    }
    lerp(e, t) {
      return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this.w += (e.w - this.w) * t, this;
    }
    lerpVectors(e, t, n) {
      return this.x = e.x + (t.x - e.x) * n, this.y = e.y + (t.y - e.y) * n, this.z = e.z + (t.z - e.z) * n, this.w = e.w + (t.w - e.w) * n, this;
    }
    equals(e) {
      return e.x === this.x && e.y === this.y && e.z === this.z && e.w === this.w;
    }
    fromArray(e, t = 0) {
      return this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this.w = e[t + 3], this;
    }
    toArray(e = [], t = 0) {
      return e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e[t + 3] = this.w, e;
    }
    fromBufferAttribute(e, t) {
      return this.x = e.getX(t), this.y = e.getY(t), this.z = e.getZ(t), this.w = e.getW(t), this;
    }
    random() {
      return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this.w = Math.random(), this;
    }
    *[Symbol.iterator]() {
      yield this.x, yield this.y, yield this.z, yield this.w;
    }
  }
  class wd extends Jn {
    constructor(e = 1, t = 1, n = {}) {
      super(), this.isRenderTarget = true, this.width = e, this.height = t, this.depth = 1, this.scissor = new Ye(0, 0, e, t), this.scissorTest = false, this.viewport = new Ye(0, 0, e, t);
      const i = {
        width: e,
        height: t,
        depth: 1
      };
      n = Object.assign({
        generateMipmaps: false,
        internalFormat: null,
        minFilter: zt,
        depthBuffer: true,
        stencilBuffer: false,
        resolveDepthBuffer: true,
        resolveStencilBuffer: true,
        depthTexture: null,
        samples: 0,
        count: 1
      }, n);
      const r = new mt(i, n.mapping, n.wrapS, n.wrapT, n.magFilter, n.minFilter, n.format, n.type, n.anisotropy, n.colorSpace);
      r.flipY = false, r.generateMipmaps = n.generateMipmaps, r.internalFormat = n.internalFormat, this.textures = [];
      const o = n.count;
      for (let a = 0; a < o; a++) this.textures[a] = r.clone(), this.textures[a].isRenderTargetTexture = true;
      this.depthBuffer = n.depthBuffer, this.stencilBuffer = n.stencilBuffer, this.resolveDepthBuffer = n.resolveDepthBuffer, this.resolveStencilBuffer = n.resolveStencilBuffer, this.depthTexture = n.depthTexture, this.samples = n.samples;
    }
    get texture() {
      return this.textures[0];
    }
    set texture(e) {
      this.textures[0] = e;
    }
    setSize(e, t, n = 1) {
      if (this.width !== e || this.height !== t || this.depth !== n) {
        this.width = e, this.height = t, this.depth = n;
        for (let i = 0, r = this.textures.length; i < r; i++) this.textures[i].image.width = e, this.textures[i].image.height = t, this.textures[i].image.depth = n;
        this.dispose();
      }
      this.viewport.set(0, 0, e, t), this.scissor.set(0, 0, e, t);
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e) {
      this.width = e.width, this.height = e.height, this.depth = e.depth, this.scissor.copy(e.scissor), this.scissorTest = e.scissorTest, this.viewport.copy(e.viewport), this.textures.length = 0;
      for (let n = 0, i = e.textures.length; n < i; n++) this.textures[n] = e.textures[n].clone(), this.textures[n].isRenderTargetTexture = true;
      const t = Object.assign({}, e.texture.image);
      return this.texture.source = new Eh(t), this.depthBuffer = e.depthBuffer, this.stencilBuffer = e.stencilBuffer, this.resolveDepthBuffer = e.resolveDepthBuffer, this.resolveStencilBuffer = e.resolveStencilBuffer, e.depthTexture !== null && (this.depthTexture = e.depthTexture.clone()), this.samples = e.samples, this;
    }
    dispose() {
      this.dispatchEvent({
        type: "dispose"
      });
    }
  }
  class mi extends wd {
    constructor(e = 1, t = 1, n = {}) {
      super(e, t, n), this.isWebGLRenderTarget = true;
    }
  }
  class bh extends mt {
    constructor(e = null, t = 1, n = 1, i = 1) {
      super(null), this.isDataArrayTexture = true, this.image = {
        data: e,
        width: t,
        height: n,
        depth: i
      }, this.magFilter = Pt, this.minFilter = Pt, this.wrapR = Xn, this.generateMipmaps = false, this.flipY = false, this.unpackAlignment = 1, this.layerUpdates = /* @__PURE__ */ new Set();
    }
    addLayerUpdate(e) {
      this.layerUpdates.add(e);
    }
    clearLayerUpdates() {
      this.layerUpdates.clear();
    }
  }
  class Rd extends mt {
    constructor(e = null, t = 1, n = 1, i = 1) {
      super(null), this.isData3DTexture = true, this.image = {
        data: e,
        width: t,
        height: n,
        depth: i
      }, this.magFilter = Pt, this.minFilter = Pt, this.wrapR = Xn, this.generateMipmaps = false, this.flipY = false, this.unpackAlignment = 1;
    }
  }
  class Ht {
    constructor(e = 0, t = 0, n = 0, i = 1) {
      this.isQuaternion = true, this._x = e, this._y = t, this._z = n, this._w = i;
    }
    static slerpFlat(e, t, n, i, r, o, a) {
      let c = n[i + 0], l = n[i + 1], h = n[i + 2], u = n[i + 3];
      const d = r[o + 0], f = r[o + 1], g = r[o + 2], _ = r[o + 3];
      if (a === 0) {
        e[t + 0] = c, e[t + 1] = l, e[t + 2] = h, e[t + 3] = u;
        return;
      }
      if (a === 1) {
        e[t + 0] = d, e[t + 1] = f, e[t + 2] = g, e[t + 3] = _;
        return;
      }
      if (u !== _ || c !== d || l !== f || h !== g) {
        let m = 1 - a;
        const p = c * d + l * f + h * g + u * _, E = p >= 0 ? 1 : -1, M = 1 - p * p;
        if (M > Number.EPSILON) {
          const I = Math.sqrt(M), A = Math.atan2(I, p * E);
          m = Math.sin(m * A) / I, a = Math.sin(a * A) / I;
        }
        const b = a * E;
        if (c = c * m + d * b, l = l * m + f * b, h = h * m + g * b, u = u * m + _ * b, m === 1 - a) {
          const I = 1 / Math.sqrt(c * c + l * l + h * h + u * u);
          c *= I, l *= I, h *= I, u *= I;
        }
      }
      e[t] = c, e[t + 1] = l, e[t + 2] = h, e[t + 3] = u;
    }
    static multiplyQuaternionsFlat(e, t, n, i, r, o) {
      const a = n[i], c = n[i + 1], l = n[i + 2], h = n[i + 3], u = r[o], d = r[o + 1], f = r[o + 2], g = r[o + 3];
      return e[t] = a * g + h * u + c * f - l * d, e[t + 1] = c * g + h * d + l * u - a * f, e[t + 2] = l * g + h * f + a * d - c * u, e[t + 3] = h * g - a * u - c * d - l * f, e;
    }
    get x() {
      return this._x;
    }
    set x(e) {
      this._x = e, this._onChangeCallback();
    }
    get y() {
      return this._y;
    }
    set y(e) {
      this._y = e, this._onChangeCallback();
    }
    get z() {
      return this._z;
    }
    set z(e) {
      this._z = e, this._onChangeCallback();
    }
    get w() {
      return this._w;
    }
    set w(e) {
      this._w = e, this._onChangeCallback();
    }
    set(e, t, n, i) {
      return this._x = e, this._y = t, this._z = n, this._w = i, this._onChangeCallback(), this;
    }
    clone() {
      return new this.constructor(this._x, this._y, this._z, this._w);
    }
    copy(e) {
      return this._x = e.x, this._y = e.y, this._z = e.z, this._w = e.w, this._onChangeCallback(), this;
    }
    setFromEuler(e, t = true) {
      const n = e._x, i = e._y, r = e._z, o = e._order, a = Math.cos, c = Math.sin, l = a(n / 2), h = a(i / 2), u = a(r / 2), d = c(n / 2), f = c(i / 2), g = c(r / 2);
      switch (o) {
        case "XYZ":
          this._x = d * h * u + l * f * g, this._y = l * f * u - d * h * g, this._z = l * h * g + d * f * u, this._w = l * h * u - d * f * g;
          break;
        case "YXZ":
          this._x = d * h * u + l * f * g, this._y = l * f * u - d * h * g, this._z = l * h * g - d * f * u, this._w = l * h * u + d * f * g;
          break;
        case "ZXY":
          this._x = d * h * u - l * f * g, this._y = l * f * u + d * h * g, this._z = l * h * g + d * f * u, this._w = l * h * u - d * f * g;
          break;
        case "ZYX":
          this._x = d * h * u - l * f * g, this._y = l * f * u + d * h * g, this._z = l * h * g - d * f * u, this._w = l * h * u + d * f * g;
          break;
        case "YZX":
          this._x = d * h * u + l * f * g, this._y = l * f * u + d * h * g, this._z = l * h * g - d * f * u, this._w = l * h * u - d * f * g;
          break;
        case "XZY":
          this._x = d * h * u - l * f * g, this._y = l * f * u - d * h * g, this._z = l * h * g + d * f * u, this._w = l * h * u + d * f * g;
          break;
        default:
          console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: " + o);
      }
      return t === true && this._onChangeCallback(), this;
    }
    setFromAxisAngle(e, t) {
      const n = t / 2, i = Math.sin(n);
      return this._x = e.x * i, this._y = e.y * i, this._z = e.z * i, this._w = Math.cos(n), this._onChangeCallback(), this;
    }
    setFromRotationMatrix(e) {
      const t = e.elements, n = t[0], i = t[4], r = t[8], o = t[1], a = t[5], c = t[9], l = t[2], h = t[6], u = t[10], d = n + a + u;
      if (d > 0) {
        const f = 0.5 / Math.sqrt(d + 1);
        this._w = 0.25 / f, this._x = (h - c) * f, this._y = (r - l) * f, this._z = (o - i) * f;
      } else if (n > a && n > u) {
        const f = 2 * Math.sqrt(1 + n - a - u);
        this._w = (h - c) / f, this._x = 0.25 * f, this._y = (i + o) / f, this._z = (r + l) / f;
      } else if (a > u) {
        const f = 2 * Math.sqrt(1 + a - n - u);
        this._w = (r - l) / f, this._x = (i + o) / f, this._y = 0.25 * f, this._z = (c + h) / f;
      } else {
        const f = 2 * Math.sqrt(1 + u - n - a);
        this._w = (o - i) / f, this._x = (r + l) / f, this._y = (c + h) / f, this._z = 0.25 * f;
      }
      return this._onChangeCallback(), this;
    }
    setFromUnitVectors(e, t) {
      let n = e.dot(t) + 1;
      return n < Number.EPSILON ? (n = 0, Math.abs(e.x) > Math.abs(e.z) ? (this._x = -e.y, this._y = e.x, this._z = 0, this._w = n) : (this._x = 0, this._y = -e.z, this._z = e.y, this._w = n)) : (this._x = e.y * t.z - e.z * t.y, this._y = e.z * t.x - e.x * t.z, this._z = e.x * t.y - e.y * t.x, this._w = n), this.normalize();
    }
    angleTo(e) {
      return 2 * Math.acos(Math.abs(St(this.dot(e), -1, 1)));
    }
    rotateTowards(e, t) {
      const n = this.angleTo(e);
      if (n === 0) return this;
      const i = Math.min(1, t / n);
      return this.slerp(e, i), this;
    }
    identity() {
      return this.set(0, 0, 0, 1);
    }
    invert() {
      return this.conjugate();
    }
    conjugate() {
      return this._x *= -1, this._y *= -1, this._z *= -1, this._onChangeCallback(), this;
    }
    dot(e) {
      return this._x * e._x + this._y * e._y + this._z * e._z + this._w * e._w;
    }
    lengthSq() {
      return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
    }
    length() {
      return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
    }
    normalize() {
      let e = this.length();
      return e === 0 ? (this._x = 0, this._y = 0, this._z = 0, this._w = 1) : (e = 1 / e, this._x = this._x * e, this._y = this._y * e, this._z = this._z * e, this._w = this._w * e), this._onChangeCallback(), this;
    }
    multiply(e) {
      return this.multiplyQuaternions(this, e);
    }
    premultiply(e) {
      return this.multiplyQuaternions(e, this);
    }
    multiplyQuaternions(e, t) {
      const n = e._x, i = e._y, r = e._z, o = e._w, a = t._x, c = t._y, l = t._z, h = t._w;
      return this._x = n * h + o * a + i * l - r * c, this._y = i * h + o * c + r * a - n * l, this._z = r * h + o * l + n * c - i * a, this._w = o * h - n * a - i * c - r * l, this._onChangeCallback(), this;
    }
    slerp(e, t) {
      if (t === 0) return this;
      if (t === 1) return this.copy(e);
      const n = this._x, i = this._y, r = this._z, o = this._w;
      let a = o * e._w + n * e._x + i * e._y + r * e._z;
      if (a < 0 ? (this._w = -e._w, this._x = -e._x, this._y = -e._y, this._z = -e._z, a = -a) : this.copy(e), a >= 1) return this._w = o, this._x = n, this._y = i, this._z = r, this;
      const c = 1 - a * a;
      if (c <= Number.EPSILON) {
        const f = 1 - t;
        return this._w = f * o + t * this._w, this._x = f * n + t * this._x, this._y = f * i + t * this._y, this._z = f * r + t * this._z, this.normalize(), this;
      }
      const l = Math.sqrt(c), h = Math.atan2(l, a), u = Math.sin((1 - t) * h) / l, d = Math.sin(t * h) / l;
      return this._w = o * u + this._w * d, this._x = n * u + this._x * d, this._y = i * u + this._y * d, this._z = r * u + this._z * d, this._onChangeCallback(), this;
    }
    slerpQuaternions(e, t, n) {
      return this.copy(e).slerp(t, n);
    }
    random() {
      const e = 2 * Math.PI * Math.random(), t = 2 * Math.PI * Math.random(), n = Math.random(), i = Math.sqrt(1 - n), r = Math.sqrt(n);
      return this.set(i * Math.sin(e), i * Math.cos(e), r * Math.sin(t), r * Math.cos(t));
    }
    equals(e) {
      return e._x === this._x && e._y === this._y && e._z === this._z && e._w === this._w;
    }
    fromArray(e, t = 0) {
      return this._x = e[t], this._y = e[t + 1], this._z = e[t + 2], this._w = e[t + 3], this._onChangeCallback(), this;
    }
    toArray(e = [], t = 0) {
      return e[t] = this._x, e[t + 1] = this._y, e[t + 2] = this._z, e[t + 3] = this._w, e;
    }
    fromBufferAttribute(e, t) {
      return this._x = e.getX(t), this._y = e.getY(t), this._z = e.getZ(t), this._w = e.getW(t), this._onChangeCallback(), this;
    }
    toJSON() {
      return this.toArray();
    }
    _onChange(e) {
      return this._onChangeCallback = e, this;
    }
    _onChangeCallback() {
    }
    *[Symbol.iterator]() {
      yield this._x, yield this._y, yield this._z, yield this._w;
    }
  }
  class R {
    constructor(e = 0, t = 0, n = 0) {
      R.prototype.isVector3 = true, this.x = e, this.y = t, this.z = n;
    }
    set(e, t, n) {
      return n === void 0 && (n = this.z), this.x = e, this.y = t, this.z = n, this;
    }
    setScalar(e) {
      return this.x = e, this.y = e, this.z = e, this;
    }
    setX(e) {
      return this.x = e, this;
    }
    setY(e) {
      return this.y = e, this;
    }
    setZ(e) {
      return this.z = e, this;
    }
    setComponent(e, t) {
      switch (e) {
        case 0:
          this.x = t;
          break;
        case 1:
          this.y = t;
          break;
        case 2:
          this.z = t;
          break;
        default:
          throw new Error("index is out of range: " + e);
      }
      return this;
    }
    getComponent(e) {
      switch (e) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        case 2:
          return this.z;
        default:
          throw new Error("index is out of range: " + e);
      }
    }
    clone() {
      return new this.constructor(this.x, this.y, this.z);
    }
    copy(e) {
      return this.x = e.x, this.y = e.y, this.z = e.z, this;
    }
    add(e) {
      return this.x += e.x, this.y += e.y, this.z += e.z, this;
    }
    addScalar(e) {
      return this.x += e, this.y += e, this.z += e, this;
    }
    addVectors(e, t) {
      return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this;
    }
    addScaledVector(e, t) {
      return this.x += e.x * t, this.y += e.y * t, this.z += e.z * t, this;
    }
    sub(e) {
      return this.x -= e.x, this.y -= e.y, this.z -= e.z, this;
    }
    subScalar(e) {
      return this.x -= e, this.y -= e, this.z -= e, this;
    }
    subVectors(e, t) {
      return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this;
    }
    multiply(e) {
      return this.x *= e.x, this.y *= e.y, this.z *= e.z, this;
    }
    multiplyScalar(e) {
      return this.x *= e, this.y *= e, this.z *= e, this;
    }
    multiplyVectors(e, t) {
      return this.x = e.x * t.x, this.y = e.y * t.y, this.z = e.z * t.z, this;
    }
    applyEuler(e) {
      return this.applyQuaternion(Bc.setFromEuler(e));
    }
    applyAxisAngle(e, t) {
      return this.applyQuaternion(Bc.setFromAxisAngle(e, t));
    }
    applyMatrix3(e) {
      const t = this.x, n = this.y, i = this.z, r = e.elements;
      return this.x = r[0] * t + r[3] * n + r[6] * i, this.y = r[1] * t + r[4] * n + r[7] * i, this.z = r[2] * t + r[5] * n + r[8] * i, this;
    }
    applyNormalMatrix(e) {
      return this.applyMatrix3(e).normalize();
    }
    applyMatrix4(e) {
      const t = this.x, n = this.y, i = this.z, r = e.elements, o = 1 / (r[3] * t + r[7] * n + r[11] * i + r[15]);
      return this.x = (r[0] * t + r[4] * n + r[8] * i + r[12]) * o, this.y = (r[1] * t + r[5] * n + r[9] * i + r[13]) * o, this.z = (r[2] * t + r[6] * n + r[10] * i + r[14]) * o, this;
    }
    applyQuaternion(e) {
      const t = this.x, n = this.y, i = this.z, r = e.x, o = e.y, a = e.z, c = e.w, l = 2 * (o * i - a * n), h = 2 * (a * t - r * i), u = 2 * (r * n - o * t);
      return this.x = t + c * l + o * u - a * h, this.y = n + c * h + a * l - r * u, this.z = i + c * u + r * h - o * l, this;
    }
    project(e) {
      return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix);
    }
    unproject(e) {
      return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld);
    }
    transformDirection(e) {
      const t = this.x, n = this.y, i = this.z, r = e.elements;
      return this.x = r[0] * t + r[4] * n + r[8] * i, this.y = r[1] * t + r[5] * n + r[9] * i, this.z = r[2] * t + r[6] * n + r[10] * i, this.normalize();
    }
    divide(e) {
      return this.x /= e.x, this.y /= e.y, this.z /= e.z, this;
    }
    divideScalar(e) {
      return this.multiplyScalar(1 / e);
    }
    min(e) {
      return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this;
    }
    max(e) {
      return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this;
    }
    clamp(e, t) {
      return this.x = Math.max(e.x, Math.min(t.x, this.x)), this.y = Math.max(e.y, Math.min(t.y, this.y)), this.z = Math.max(e.z, Math.min(t.z, this.z)), this;
    }
    clampScalar(e, t) {
      return this.x = Math.max(e, Math.min(t, this.x)), this.y = Math.max(e, Math.min(t, this.y)), this.z = Math.max(e, Math.min(t, this.z)), this;
    }
    clampLength(e, t) {
      const n = this.length();
      return this.divideScalar(n || 1).multiplyScalar(Math.max(e, Math.min(t, n)));
    }
    floor() {
      return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this;
    }
    ceil() {
      return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this;
    }
    round() {
      return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this;
    }
    roundToZero() {
      return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this;
    }
    negate() {
      return this.x = -this.x, this.y = -this.y, this.z = -this.z, this;
    }
    dot(e) {
      return this.x * e.x + this.y * e.y + this.z * e.z;
    }
    lengthSq() {
      return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    manhattanLength() {
      return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    }
    normalize() {
      return this.divideScalar(this.length() || 1);
    }
    setLength(e) {
      return this.normalize().multiplyScalar(e);
    }
    lerp(e, t) {
      return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this;
    }
    lerpVectors(e, t, n) {
      return this.x = e.x + (t.x - e.x) * n, this.y = e.y + (t.y - e.y) * n, this.z = e.z + (t.z - e.z) * n, this;
    }
    cross(e) {
      return this.crossVectors(this, e);
    }
    crossVectors(e, t) {
      const n = e.x, i = e.y, r = e.z, o = t.x, a = t.y, c = t.z;
      return this.x = i * c - r * a, this.y = r * o - n * c, this.z = n * a - i * o, this;
    }
    projectOnVector(e) {
      const t = e.lengthSq();
      if (t === 0) return this.set(0, 0, 0);
      const n = e.dot(this) / t;
      return this.copy(e).multiplyScalar(n);
    }
    projectOnPlane(e) {
      return po.copy(this).projectOnVector(e), this.sub(po);
    }
    reflect(e) {
      return this.sub(po.copy(e).multiplyScalar(2 * this.dot(e)));
    }
    angleTo(e) {
      const t = Math.sqrt(this.lengthSq() * e.lengthSq());
      if (t === 0) return Math.PI / 2;
      const n = this.dot(e) / t;
      return Math.acos(St(n, -1, 1));
    }
    distanceTo(e) {
      return Math.sqrt(this.distanceToSquared(e));
    }
    distanceToSquared(e) {
      const t = this.x - e.x, n = this.y - e.y, i = this.z - e.z;
      return t * t + n * n + i * i;
    }
    manhattanDistanceTo(e) {
      return Math.abs(this.x - e.x) + Math.abs(this.y - e.y) + Math.abs(this.z - e.z);
    }
    setFromSpherical(e) {
      return this.setFromSphericalCoords(e.radius, e.phi, e.theta);
    }
    setFromSphericalCoords(e, t, n) {
      const i = Math.sin(t) * e;
      return this.x = i * Math.sin(n), this.y = Math.cos(t) * e, this.z = i * Math.cos(n), this;
    }
    setFromCylindrical(e) {
      return this.setFromCylindricalCoords(e.radius, e.theta, e.y);
    }
    setFromCylindricalCoords(e, t, n) {
      return this.x = e * Math.sin(t), this.y = n, this.z = e * Math.cos(t), this;
    }
    setFromMatrixPosition(e) {
      const t = e.elements;
      return this.x = t[12], this.y = t[13], this.z = t[14], this;
    }
    setFromMatrixScale(e) {
      const t = this.setFromMatrixColumn(e, 0).length(), n = this.setFromMatrixColumn(e, 1).length(), i = this.setFromMatrixColumn(e, 2).length();
      return this.x = t, this.y = n, this.z = i, this;
    }
    setFromMatrixColumn(e, t) {
      return this.fromArray(e.elements, t * 4);
    }
    setFromMatrix3Column(e, t) {
      return this.fromArray(e.elements, t * 3);
    }
    setFromEuler(e) {
      return this.x = e._x, this.y = e._y, this.z = e._z, this;
    }
    setFromColor(e) {
      return this.x = e.r, this.y = e.g, this.z = e.b, this;
    }
    equals(e) {
      return e.x === this.x && e.y === this.y && e.z === this.z;
    }
    fromArray(e, t = 0) {
      return this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this;
    }
    toArray(e = [], t = 0) {
      return e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e;
    }
    fromBufferAttribute(e, t) {
      return this.x = e.getX(t), this.y = e.getY(t), this.z = e.getZ(t), this;
    }
    random() {
      return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this;
    }
    randomDirection() {
      const e = Math.random() * Math.PI * 2, t = Math.random() * 2 - 1, n = Math.sqrt(1 - t * t);
      return this.x = n * Math.cos(e), this.y = t, this.z = n * Math.sin(e), this;
    }
    *[Symbol.iterator]() {
      yield this.x, yield this.y, yield this.z;
    }
  }
  const po = new R(), Bc = new Ht();
  class dn {
    constructor(e = new R(1 / 0, 1 / 0, 1 / 0), t = new R(-1 / 0, -1 / 0, -1 / 0)) {
      this.isBox3 = true, this.min = e, this.max = t;
    }
    set(e, t) {
      return this.min.copy(e), this.max.copy(t), this;
    }
    setFromArray(e) {
      this.makeEmpty();
      for (let t = 0, n = e.length; t < n; t += 3) this.expandByPoint(Qt.fromArray(e, t));
      return this;
    }
    setFromBufferAttribute(e) {
      this.makeEmpty();
      for (let t = 0, n = e.count; t < n; t++) this.expandByPoint(Qt.fromBufferAttribute(e, t));
      return this;
    }
    setFromPoints(e) {
      this.makeEmpty();
      for (let t = 0, n = e.length; t < n; t++) this.expandByPoint(e[t]);
      return this;
    }
    setFromCenterAndSize(e, t) {
      const n = Qt.copy(t).multiplyScalar(0.5);
      return this.min.copy(e).sub(n), this.max.copy(e).add(n), this;
    }
    setFromObject(e, t = false) {
      return this.makeEmpty(), this.expandByObject(e, t);
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e) {
      return this.min.copy(e.min), this.max.copy(e.max), this;
    }
    makeEmpty() {
      return this.min.x = this.min.y = this.min.z = 1 / 0, this.max.x = this.max.y = this.max.z = -1 / 0, this;
    }
    isEmpty() {
      return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
    }
    getCenter(e) {
      return this.isEmpty() ? e.set(0, 0, 0) : e.addVectors(this.min, this.max).multiplyScalar(0.5);
    }
    getSize(e) {
      return this.isEmpty() ? e.set(0, 0, 0) : e.subVectors(this.max, this.min);
    }
    expandByPoint(e) {
      return this.min.min(e), this.max.max(e), this;
    }
    expandByVector(e) {
      return this.min.sub(e), this.max.add(e), this;
    }
    expandByScalar(e) {
      return this.min.addScalar(-e), this.max.addScalar(e), this;
    }
    expandByObject(e, t = false) {
      e.updateWorldMatrix(false, false);
      const n = e.geometry;
      if (n !== void 0) {
        const r = n.getAttribute("position");
        if (t === true && r !== void 0 && e.isInstancedMesh !== true) for (let o = 0, a = r.count; o < a; o++) e.isMesh === true ? e.getVertexPosition(o, Qt) : Qt.fromBufferAttribute(r, o), Qt.applyMatrix4(e.matrixWorld), this.expandByPoint(Qt);
        else e.boundingBox !== void 0 ? (e.boundingBox === null && e.computeBoundingBox(), qs.copy(e.boundingBox)) : (n.boundingBox === null && n.computeBoundingBox(), qs.copy(n.boundingBox)), qs.applyMatrix4(e.matrixWorld), this.union(qs);
      }
      const i = e.children;
      for (let r = 0, o = i.length; r < o; r++) this.expandByObject(i[r], t);
      return this;
    }
    containsPoint(e) {
      return e.x >= this.min.x && e.x <= this.max.x && e.y >= this.min.y && e.y <= this.max.y && e.z >= this.min.z && e.z <= this.max.z;
    }
    containsBox(e) {
      return this.min.x <= e.min.x && e.max.x <= this.max.x && this.min.y <= e.min.y && e.max.y <= this.max.y && this.min.z <= e.min.z && e.max.z <= this.max.z;
    }
    getParameter(e, t) {
      return t.set((e.x - this.min.x) / (this.max.x - this.min.x), (e.y - this.min.y) / (this.max.y - this.min.y), (e.z - this.min.z) / (this.max.z - this.min.z));
    }
    intersectsBox(e) {
      return e.max.x >= this.min.x && e.min.x <= this.max.x && e.max.y >= this.min.y && e.min.y <= this.max.y && e.max.z >= this.min.z && e.min.z <= this.max.z;
    }
    intersectsSphere(e) {
      return this.clampPoint(e.center, Qt), Qt.distanceToSquared(e.center) <= e.radius * e.radius;
    }
    intersectsPlane(e) {
      let t, n;
      return e.normal.x > 0 ? (t = e.normal.x * this.min.x, n = e.normal.x * this.max.x) : (t = e.normal.x * this.max.x, n = e.normal.x * this.min.x), e.normal.y > 0 ? (t += e.normal.y * this.min.y, n += e.normal.y * this.max.y) : (t += e.normal.y * this.max.y, n += e.normal.y * this.min.y), e.normal.z > 0 ? (t += e.normal.z * this.min.z, n += e.normal.z * this.max.z) : (t += e.normal.z * this.max.z, n += e.normal.z * this.min.z), t <= -e.constant && n >= -e.constant;
    }
    intersectsTriangle(e) {
      if (this.isEmpty()) return false;
      this.getCenter(fs), js.subVectors(this.max, fs), yi.subVectors(e.a, fs), Mi.subVectors(e.b, fs), Si.subVectors(e.c, fs), Un.subVectors(Mi, yi), Nn.subVectors(Si, Mi), ei.subVectors(yi, Si);
      let t = [
        0,
        -Un.z,
        Un.y,
        0,
        -Nn.z,
        Nn.y,
        0,
        -ei.z,
        ei.y,
        Un.z,
        0,
        -Un.x,
        Nn.z,
        0,
        -Nn.x,
        ei.z,
        0,
        -ei.x,
        -Un.y,
        Un.x,
        0,
        -Nn.y,
        Nn.x,
        0,
        -ei.y,
        ei.x,
        0
      ];
      return !mo(t, yi, Mi, Si, js) || (t = [
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ], !mo(t, yi, Mi, Si, js)) ? false : (Ks.crossVectors(Un, Nn), t = [
        Ks.x,
        Ks.y,
        Ks.z
      ], mo(t, yi, Mi, Si, js));
    }
    clampPoint(e, t) {
      return t.copy(e).clamp(this.min, this.max);
    }
    distanceToPoint(e) {
      return this.clampPoint(e, Qt).distanceTo(e);
    }
    getBoundingSphere(e) {
      return this.isEmpty() ? e.makeEmpty() : (this.getCenter(e.center), e.radius = this.getSize(Qt).length() * 0.5), e;
    }
    intersect(e) {
      return this.min.max(e.min), this.max.min(e.max), this.isEmpty() && this.makeEmpty(), this;
    }
    union(e) {
      return this.min.min(e.min), this.max.max(e.max), this;
    }
    applyMatrix4(e) {
      return this.isEmpty() ? this : (_n[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(e), _n[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(e), _n[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(e), _n[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(e), _n[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(e), _n[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(e), _n[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(e), _n[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(e), this.setFromPoints(_n), this);
    }
    translate(e) {
      return this.min.add(e), this.max.add(e), this;
    }
    equals(e) {
      return e.min.equals(this.min) && e.max.equals(this.max);
    }
  }
  const _n = [
    new R(),
    new R(),
    new R(),
    new R(),
    new R(),
    new R(),
    new R(),
    new R()
  ], Qt = new R(), qs = new dn(), yi = new R(), Mi = new R(), Si = new R(), Un = new R(), Nn = new R(), ei = new R(), fs = new R(), js = new R(), Ks = new R(), ti = new R();
  function mo(s, e, t, n, i) {
    for (let r = 0, o = s.length - 3; r <= o; r += 3) {
      ti.fromArray(s, r);
      const a = i.x * Math.abs(ti.x) + i.y * Math.abs(ti.y) + i.z * Math.abs(ti.z), c = e.dot(ti), l = t.dot(ti), h = n.dot(ti);
      if (Math.max(-Math.max(c, l, h), Math.min(c, l, h)) > a) return false;
    }
    return true;
  }
  const Cd = new dn(), ps = new R(), go = new R();
  class fn {
    constructor(e = new R(), t = -1) {
      this.isSphere = true, this.center = e, this.radius = t;
    }
    set(e, t) {
      return this.center.copy(e), this.radius = t, this;
    }
    setFromPoints(e, t) {
      const n = this.center;
      t !== void 0 ? n.copy(t) : Cd.setFromPoints(e).getCenter(n);
      let i = 0;
      for (let r = 0, o = e.length; r < o; r++) i = Math.max(i, n.distanceToSquared(e[r]));
      return this.radius = Math.sqrt(i), this;
    }
    copy(e) {
      return this.center.copy(e.center), this.radius = e.radius, this;
    }
    isEmpty() {
      return this.radius < 0;
    }
    makeEmpty() {
      return this.center.set(0, 0, 0), this.radius = -1, this;
    }
    containsPoint(e) {
      return e.distanceToSquared(this.center) <= this.radius * this.radius;
    }
    distanceToPoint(e) {
      return e.distanceTo(this.center) - this.radius;
    }
    intersectsSphere(e) {
      const t = this.radius + e.radius;
      return e.center.distanceToSquared(this.center) <= t * t;
    }
    intersectsBox(e) {
      return e.intersectsSphere(this);
    }
    intersectsPlane(e) {
      return Math.abs(e.distanceToPoint(this.center)) <= this.radius;
    }
    clampPoint(e, t) {
      const n = this.center.distanceToSquared(e);
      return t.copy(e), n > this.radius * this.radius && (t.sub(this.center).normalize(), t.multiplyScalar(this.radius).add(this.center)), t;
    }
    getBoundingBox(e) {
      return this.isEmpty() ? (e.makeEmpty(), e) : (e.set(this.center, this.center), e.expandByScalar(this.radius), e);
    }
    applyMatrix4(e) {
      return this.center.applyMatrix4(e), this.radius = this.radius * e.getMaxScaleOnAxis(), this;
    }
    translate(e) {
      return this.center.add(e), this;
    }
    expandByPoint(e) {
      if (this.isEmpty()) return this.center.copy(e), this.radius = 0, this;
      ps.subVectors(e, this.center);
      const t = ps.lengthSq();
      if (t > this.radius * this.radius) {
        const n = Math.sqrt(t), i = (n - this.radius) * 0.5;
        this.center.addScaledVector(ps, i / n), this.radius += i;
      }
      return this;
    }
    union(e) {
      return e.isEmpty() ? this : this.isEmpty() ? (this.copy(e), this) : (this.center.equals(e.center) === true ? this.radius = Math.max(this.radius, e.radius) : (go.subVectors(e.center, this.center).setLength(e.radius), this.expandByPoint(ps.copy(e.center).add(go)), this.expandByPoint(ps.copy(e.center).sub(go))), this);
    }
    equals(e) {
      return e.center.equals(this.center) && e.radius === this.radius;
    }
    clone() {
      return new this.constructor().copy(this);
    }
  }
  const xn = new R(), _o = new R(), $s = new R(), Fn = new R(), xo = new R(), Zs = new R(), vo = new R();
  class Hs {
    constructor(e = new R(), t = new R(0, 0, -1)) {
      this.origin = e, this.direction = t;
    }
    set(e, t) {
      return this.origin.copy(e), this.direction.copy(t), this;
    }
    copy(e) {
      return this.origin.copy(e.origin), this.direction.copy(e.direction), this;
    }
    at(e, t) {
      return t.copy(this.origin).addScaledVector(this.direction, e);
    }
    lookAt(e) {
      return this.direction.copy(e).sub(this.origin).normalize(), this;
    }
    recast(e) {
      return this.origin.copy(this.at(e, xn)), this;
    }
    closestPointToPoint(e, t) {
      t.subVectors(e, this.origin);
      const n = t.dot(this.direction);
      return n < 0 ? t.copy(this.origin) : t.copy(this.origin).addScaledVector(this.direction, n);
    }
    distanceToPoint(e) {
      return Math.sqrt(this.distanceSqToPoint(e));
    }
    distanceSqToPoint(e) {
      const t = xn.subVectors(e, this.origin).dot(this.direction);
      return t < 0 ? this.origin.distanceToSquared(e) : (xn.copy(this.origin).addScaledVector(this.direction, t), xn.distanceToSquared(e));
    }
    distanceSqToSegment(e, t, n, i) {
      _o.copy(e).add(t).multiplyScalar(0.5), $s.copy(t).sub(e).normalize(), Fn.copy(this.origin).sub(_o);
      const r = e.distanceTo(t) * 0.5, o = -this.direction.dot($s), a = Fn.dot(this.direction), c = -Fn.dot($s), l = Fn.lengthSq(), h = Math.abs(1 - o * o);
      let u, d, f, g;
      if (h > 0) if (u = o * c - a, d = o * a - c, g = r * h, u >= 0) if (d >= -g) if (d <= g) {
        const _ = 1 / h;
        u *= _, d *= _, f = u * (u + o * d + 2 * a) + d * (o * u + d + 2 * c) + l;
      } else d = r, u = Math.max(0, -(o * d + a)), f = -u * u + d * (d + 2 * c) + l;
      else d = -r, u = Math.max(0, -(o * d + a)), f = -u * u + d * (d + 2 * c) + l;
      else d <= -g ? (u = Math.max(0, -(-o * r + a)), d = u > 0 ? -r : Math.min(Math.max(-r, -c), r), f = -u * u + d * (d + 2 * c) + l) : d <= g ? (u = 0, d = Math.min(Math.max(-r, -c), r), f = d * (d + 2 * c) + l) : (u = Math.max(0, -(o * r + a)), d = u > 0 ? r : Math.min(Math.max(-r, -c), r), f = -u * u + d * (d + 2 * c) + l);
      else d = o > 0 ? -r : r, u = Math.max(0, -(o * d + a)), f = -u * u + d * (d + 2 * c) + l;
      return n && n.copy(this.origin).addScaledVector(this.direction, u), i && i.copy(_o).addScaledVector($s, d), f;
    }
    intersectSphere(e, t) {
      xn.subVectors(e.center, this.origin);
      const n = xn.dot(this.direction), i = xn.dot(xn) - n * n, r = e.radius * e.radius;
      if (i > r) return null;
      const o = Math.sqrt(r - i), a = n - o, c = n + o;
      return c < 0 ? null : a < 0 ? this.at(c, t) : this.at(a, t);
    }
    intersectsSphere(e) {
      return this.distanceSqToPoint(e.center) <= e.radius * e.radius;
    }
    distanceToPlane(e) {
      const t = e.normal.dot(this.direction);
      if (t === 0) return e.distanceToPoint(this.origin) === 0 ? 0 : null;
      const n = -(this.origin.dot(e.normal) + e.constant) / t;
      return n >= 0 ? n : null;
    }
    intersectPlane(e, t) {
      const n = this.distanceToPlane(e);
      return n === null ? null : this.at(n, t);
    }
    intersectsPlane(e) {
      const t = e.distanceToPoint(this.origin);
      return t === 0 || e.normal.dot(this.direction) * t < 0;
    }
    intersectBox(e, t) {
      let n, i, r, o, a, c;
      const l = 1 / this.direction.x, h = 1 / this.direction.y, u = 1 / this.direction.z, d = this.origin;
      return l >= 0 ? (n = (e.min.x - d.x) * l, i = (e.max.x - d.x) * l) : (n = (e.max.x - d.x) * l, i = (e.min.x - d.x) * l), h >= 0 ? (r = (e.min.y - d.y) * h, o = (e.max.y - d.y) * h) : (r = (e.max.y - d.y) * h, o = (e.min.y - d.y) * h), n > o || r > i || ((r > n || isNaN(n)) && (n = r), (o < i || isNaN(i)) && (i = o), u >= 0 ? (a = (e.min.z - d.z) * u, c = (e.max.z - d.z) * u) : (a = (e.max.z - d.z) * u, c = (e.min.z - d.z) * u), n > c || a > i) || ((a > n || n !== n) && (n = a), (c < i || i !== i) && (i = c), i < 0) ? null : this.at(n >= 0 ? n : i, t);
    }
    intersectsBox(e) {
      return this.intersectBox(e, xn) !== null;
    }
    intersectTriangle(e, t, n, i, r) {
      xo.subVectors(t, e), Zs.subVectors(n, e), vo.crossVectors(xo, Zs);
      let o = this.direction.dot(vo), a;
      if (o > 0) {
        if (i) return null;
        a = 1;
      } else if (o < 0) a = -1, o = -o;
      else return null;
      Fn.subVectors(this.origin, e);
      const c = a * this.direction.dot(Zs.crossVectors(Fn, Zs));
      if (c < 0) return null;
      const l = a * this.direction.dot(xo.cross(Fn));
      if (l < 0 || c + l > o) return null;
      const h = -a * Fn.dot(vo);
      return h < 0 ? null : this.at(h / o, r);
    }
    applyMatrix4(e) {
      return this.origin.applyMatrix4(e), this.direction.transformDirection(e), this;
    }
    equals(e) {
      return e.origin.equals(this.origin) && e.direction.equals(this.direction);
    }
    clone() {
      return new this.constructor().copy(this);
    }
  }
  class Ce {
    constructor(e, t, n, i, r, o, a, c, l, h, u, d, f, g, _, m) {
      Ce.prototype.isMatrix4 = true, this.elements = [
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
      ], e !== void 0 && this.set(e, t, n, i, r, o, a, c, l, h, u, d, f, g, _, m);
    }
    set(e, t, n, i, r, o, a, c, l, h, u, d, f, g, _, m) {
      const p = this.elements;
      return p[0] = e, p[4] = t, p[8] = n, p[12] = i, p[1] = r, p[5] = o, p[9] = a, p[13] = c, p[2] = l, p[6] = h, p[10] = u, p[14] = d, p[3] = f, p[7] = g, p[11] = _, p[15] = m, this;
    }
    identity() {
      return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
    }
    clone() {
      return new Ce().fromArray(this.elements);
    }
    copy(e) {
      const t = this.elements, n = e.elements;
      return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t[6] = n[6], t[7] = n[7], t[8] = n[8], t[9] = n[9], t[10] = n[10], t[11] = n[11], t[12] = n[12], t[13] = n[13], t[14] = n[14], t[15] = n[15], this;
    }
    copyPosition(e) {
      const t = this.elements, n = e.elements;
      return t[12] = n[12], t[13] = n[13], t[14] = n[14], this;
    }
    setFromMatrix3(e) {
      const t = e.elements;
      return this.set(t[0], t[3], t[6], 0, t[1], t[4], t[7], 0, t[2], t[5], t[8], 0, 0, 0, 0, 1), this;
    }
    extractBasis(e, t, n) {
      return e.setFromMatrixColumn(this, 0), t.setFromMatrixColumn(this, 1), n.setFromMatrixColumn(this, 2), this;
    }
    makeBasis(e, t, n) {
      return this.set(e.x, t.x, n.x, 0, e.y, t.y, n.y, 0, e.z, t.z, n.z, 0, 0, 0, 0, 1), this;
    }
    extractRotation(e) {
      const t = this.elements, n = e.elements, i = 1 / Ei.setFromMatrixColumn(e, 0).length(), r = 1 / Ei.setFromMatrixColumn(e, 1).length(), o = 1 / Ei.setFromMatrixColumn(e, 2).length();
      return t[0] = n[0] * i, t[1] = n[1] * i, t[2] = n[2] * i, t[3] = 0, t[4] = n[4] * r, t[5] = n[5] * r, t[6] = n[6] * r, t[7] = 0, t[8] = n[8] * o, t[9] = n[9] * o, t[10] = n[10] * o, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this;
    }
    makeRotationFromEuler(e) {
      const t = this.elements, n = e.x, i = e.y, r = e.z, o = Math.cos(n), a = Math.sin(n), c = Math.cos(i), l = Math.sin(i), h = Math.cos(r), u = Math.sin(r);
      if (e.order === "XYZ") {
        const d = o * h, f = o * u, g = a * h, _ = a * u;
        t[0] = c * h, t[4] = -c * u, t[8] = l, t[1] = f + g * l, t[5] = d - _ * l, t[9] = -a * c, t[2] = _ - d * l, t[6] = g + f * l, t[10] = o * c;
      } else if (e.order === "YXZ") {
        const d = c * h, f = c * u, g = l * h, _ = l * u;
        t[0] = d + _ * a, t[4] = g * a - f, t[8] = o * l, t[1] = o * u, t[5] = o * h, t[9] = -a, t[2] = f * a - g, t[6] = _ + d * a, t[10] = o * c;
      } else if (e.order === "ZXY") {
        const d = c * h, f = c * u, g = l * h, _ = l * u;
        t[0] = d - _ * a, t[4] = -o * u, t[8] = g + f * a, t[1] = f + g * a, t[5] = o * h, t[9] = _ - d * a, t[2] = -o * l, t[6] = a, t[10] = o * c;
      } else if (e.order === "ZYX") {
        const d = o * h, f = o * u, g = a * h, _ = a * u;
        t[0] = c * h, t[4] = g * l - f, t[8] = d * l + _, t[1] = c * u, t[5] = _ * l + d, t[9] = f * l - g, t[2] = -l, t[6] = a * c, t[10] = o * c;
      } else if (e.order === "YZX") {
        const d = o * c, f = o * l, g = a * c, _ = a * l;
        t[0] = c * h, t[4] = _ - d * u, t[8] = g * u + f, t[1] = u, t[5] = o * h, t[9] = -a * h, t[2] = -l * h, t[6] = f * u + g, t[10] = d - _ * u;
      } else if (e.order === "XZY") {
        const d = o * c, f = o * l, g = a * c, _ = a * l;
        t[0] = c * h, t[4] = -u, t[8] = l * h, t[1] = d * u + _, t[5] = o * h, t[9] = f * u - g, t[2] = g * u - f, t[6] = a * h, t[10] = _ * u + d;
      }
      return t[3] = 0, t[7] = 0, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this;
    }
    makeRotationFromQuaternion(e) {
      return this.compose(Pd, e, Id);
    }
    lookAt(e, t, n) {
      const i = this.elements;
      return Bt.subVectors(e, t), Bt.lengthSq() === 0 && (Bt.z = 1), Bt.normalize(), On.crossVectors(n, Bt), On.lengthSq() === 0 && (Math.abs(n.z) === 1 ? Bt.x += 1e-4 : Bt.z += 1e-4, Bt.normalize(), On.crossVectors(n, Bt)), On.normalize(), Js.crossVectors(Bt, On), i[0] = On.x, i[4] = Js.x, i[8] = Bt.x, i[1] = On.y, i[5] = Js.y, i[9] = Bt.y, i[2] = On.z, i[6] = Js.z, i[10] = Bt.z, this;
    }
    multiply(e) {
      return this.multiplyMatrices(this, e);
    }
    premultiply(e) {
      return this.multiplyMatrices(e, this);
    }
    multiplyMatrices(e, t) {
      const n = e.elements, i = t.elements, r = this.elements, o = n[0], a = n[4], c = n[8], l = n[12], h = n[1], u = n[5], d = n[9], f = n[13], g = n[2], _ = n[6], m = n[10], p = n[14], E = n[3], M = n[7], b = n[11], I = n[15], A = i[0], w = i[4], U = i[8], j = i[12], x = i[1], S = i[5], k = i[9], B = i[13], H = i[2], K = i[6], z = i[10], Q = i[14], G = i[3], ae = i[7], ce = i[11], ge = i[15];
      return r[0] = o * A + a * x + c * H + l * G, r[4] = o * w + a * S + c * K + l * ae, r[8] = o * U + a * k + c * z + l * ce, r[12] = o * j + a * B + c * Q + l * ge, r[1] = h * A + u * x + d * H + f * G, r[5] = h * w + u * S + d * K + f * ae, r[9] = h * U + u * k + d * z + f * ce, r[13] = h * j + u * B + d * Q + f * ge, r[2] = g * A + _ * x + m * H + p * G, r[6] = g * w + _ * S + m * K + p * ae, r[10] = g * U + _ * k + m * z + p * ce, r[14] = g * j + _ * B + m * Q + p * ge, r[3] = E * A + M * x + b * H + I * G, r[7] = E * w + M * S + b * K + I * ae, r[11] = E * U + M * k + b * z + I * ce, r[15] = E * j + M * B + b * Q + I * ge, this;
    }
    multiplyScalar(e) {
      const t = this.elements;
      return t[0] *= e, t[4] *= e, t[8] *= e, t[12] *= e, t[1] *= e, t[5] *= e, t[9] *= e, t[13] *= e, t[2] *= e, t[6] *= e, t[10] *= e, t[14] *= e, t[3] *= e, t[7] *= e, t[11] *= e, t[15] *= e, this;
    }
    determinant() {
      const e = this.elements, t = e[0], n = e[4], i = e[8], r = e[12], o = e[1], a = e[5], c = e[9], l = e[13], h = e[2], u = e[6], d = e[10], f = e[14], g = e[3], _ = e[7], m = e[11], p = e[15];
      return g * (+r * c * u - i * l * u - r * a * d + n * l * d + i * a * f - n * c * f) + _ * (+t * c * f - t * l * d + r * o * d - i * o * f + i * l * h - r * c * h) + m * (+t * l * u - t * a * f - r * o * u + n * o * f + r * a * h - n * l * h) + p * (-i * a * h - t * c * u + t * a * d + i * o * u - n * o * d + n * c * h);
    }
    transpose() {
      const e = this.elements;
      let t;
      return t = e[1], e[1] = e[4], e[4] = t, t = e[2], e[2] = e[8], e[8] = t, t = e[6], e[6] = e[9], e[9] = t, t = e[3], e[3] = e[12], e[12] = t, t = e[7], e[7] = e[13], e[13] = t, t = e[11], e[11] = e[14], e[14] = t, this;
    }
    setPosition(e, t, n) {
      const i = this.elements;
      return e.isVector3 ? (i[12] = e.x, i[13] = e.y, i[14] = e.z) : (i[12] = e, i[13] = t, i[14] = n), this;
    }
    invert() {
      const e = this.elements, t = e[0], n = e[1], i = e[2], r = e[3], o = e[4], a = e[5], c = e[6], l = e[7], h = e[8], u = e[9], d = e[10], f = e[11], g = e[12], _ = e[13], m = e[14], p = e[15], E = u * m * l - _ * d * l + _ * c * f - a * m * f - u * c * p + a * d * p, M = g * d * l - h * m * l - g * c * f + o * m * f + h * c * p - o * d * p, b = h * _ * l - g * u * l + g * a * f - o * _ * f - h * a * p + o * u * p, I = g * u * c - h * _ * c - g * a * d + o * _ * d + h * a * m - o * u * m, A = t * E + n * M + i * b + r * I;
      if (A === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      const w = 1 / A;
      return e[0] = E * w, e[1] = (_ * d * r - u * m * r - _ * i * f + n * m * f + u * i * p - n * d * p) * w, e[2] = (a * m * r - _ * c * r + _ * i * l - n * m * l - a * i * p + n * c * p) * w, e[3] = (u * c * r - a * d * r - u * i * l + n * d * l + a * i * f - n * c * f) * w, e[4] = M * w, e[5] = (h * m * r - g * d * r + g * i * f - t * m * f - h * i * p + t * d * p) * w, e[6] = (g * c * r - o * m * r - g * i * l + t * m * l + o * i * p - t * c * p) * w, e[7] = (o * d * r - h * c * r + h * i * l - t * d * l - o * i * f + t * c * f) * w, e[8] = b * w, e[9] = (g * u * r - h * _ * r - g * n * f + t * _ * f + h * n * p - t * u * p) * w, e[10] = (o * _ * r - g * a * r + g * n * l - t * _ * l - o * n * p + t * a * p) * w, e[11] = (h * a * r - o * u * r - h * n * l + t * u * l + o * n * f - t * a * f) * w, e[12] = I * w, e[13] = (h * _ * i - g * u * i + g * n * d - t * _ * d - h * n * m + t * u * m) * w, e[14] = (g * a * i - o * _ * i - g * n * c + t * _ * c + o * n * m - t * a * m) * w, e[15] = (o * u * i - h * a * i + h * n * c - t * u * c - o * n * d + t * a * d) * w, this;
    }
    scale(e) {
      const t = this.elements, n = e.x, i = e.y, r = e.z;
      return t[0] *= n, t[4] *= i, t[8] *= r, t[1] *= n, t[5] *= i, t[9] *= r, t[2] *= n, t[6] *= i, t[10] *= r, t[3] *= n, t[7] *= i, t[11] *= r, this;
    }
    getMaxScaleOnAxis() {
      const e = this.elements, t = e[0] * e[0] + e[1] * e[1] + e[2] * e[2], n = e[4] * e[4] + e[5] * e[5] + e[6] * e[6], i = e[8] * e[8] + e[9] * e[9] + e[10] * e[10];
      return Math.sqrt(Math.max(t, n, i));
    }
    makeTranslation(e, t, n) {
      return e.isVector3 ? this.set(1, 0, 0, e.x, 0, 1, 0, e.y, 0, 0, 1, e.z, 0, 0, 0, 1) : this.set(1, 0, 0, e, 0, 1, 0, t, 0, 0, 1, n, 0, 0, 0, 1), this;
    }
    makeRotationX(e) {
      const t = Math.cos(e), n = Math.sin(e);
      return this.set(1, 0, 0, 0, 0, t, -n, 0, 0, n, t, 0, 0, 0, 0, 1), this;
    }
    makeRotationY(e) {
      const t = Math.cos(e), n = Math.sin(e);
      return this.set(t, 0, n, 0, 0, 1, 0, 0, -n, 0, t, 0, 0, 0, 0, 1), this;
    }
    makeRotationZ(e) {
      const t = Math.cos(e), n = Math.sin(e);
      return this.set(t, -n, 0, 0, n, t, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
    }
    makeRotationAxis(e, t) {
      const n = Math.cos(t), i = Math.sin(t), r = 1 - n, o = e.x, a = e.y, c = e.z, l = r * o, h = r * a;
      return this.set(l * o + n, l * a - i * c, l * c + i * a, 0, l * a + i * c, h * a + n, h * c - i * o, 0, l * c - i * a, h * c + i * o, r * c * c + n, 0, 0, 0, 0, 1), this;
    }
    makeScale(e, t, n) {
      return this.set(e, 0, 0, 0, 0, t, 0, 0, 0, 0, n, 0, 0, 0, 0, 1), this;
    }
    makeShear(e, t, n, i, r, o) {
      return this.set(1, n, r, 0, e, 1, o, 0, t, i, 1, 0, 0, 0, 0, 1), this;
    }
    compose(e, t, n) {
      const i = this.elements, r = t._x, o = t._y, a = t._z, c = t._w, l = r + r, h = o + o, u = a + a, d = r * l, f = r * h, g = r * u, _ = o * h, m = o * u, p = a * u, E = c * l, M = c * h, b = c * u, I = n.x, A = n.y, w = n.z;
      return i[0] = (1 - (_ + p)) * I, i[1] = (f + b) * I, i[2] = (g - M) * I, i[3] = 0, i[4] = (f - b) * A, i[5] = (1 - (d + p)) * A, i[6] = (m + E) * A, i[7] = 0, i[8] = (g + M) * w, i[9] = (m - E) * w, i[10] = (1 - (d + _)) * w, i[11] = 0, i[12] = e.x, i[13] = e.y, i[14] = e.z, i[15] = 1, this;
    }
    decompose(e, t, n) {
      const i = this.elements;
      let r = Ei.set(i[0], i[1], i[2]).length();
      const o = Ei.set(i[4], i[5], i[6]).length(), a = Ei.set(i[8], i[9], i[10]).length();
      this.determinant() < 0 && (r = -r), e.x = i[12], e.y = i[13], e.z = i[14], en.copy(this);
      const l = 1 / r, h = 1 / o, u = 1 / a;
      return en.elements[0] *= l, en.elements[1] *= l, en.elements[2] *= l, en.elements[4] *= h, en.elements[5] *= h, en.elements[6] *= h, en.elements[8] *= u, en.elements[9] *= u, en.elements[10] *= u, t.setFromRotationMatrix(en), n.x = r, n.y = o, n.z = a, this;
    }
    makePerspective(e, t, n, i, r, o, a = Rn) {
      const c = this.elements, l = 2 * r / (t - e), h = 2 * r / (n - i), u = (t + e) / (t - e), d = (n + i) / (n - i);
      let f, g;
      if (a === Rn) f = -(o + r) / (o - r), g = -2 * o * r / (o - r);
      else if (a === qr) f = -o / (o - r), g = -o * r / (o - r);
      else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: " + a);
      return c[0] = l, c[4] = 0, c[8] = u, c[12] = 0, c[1] = 0, c[5] = h, c[9] = d, c[13] = 0, c[2] = 0, c[6] = 0, c[10] = f, c[14] = g, c[3] = 0, c[7] = 0, c[11] = -1, c[15] = 0, this;
    }
    makeOrthographic(e, t, n, i, r, o, a = Rn) {
      const c = this.elements, l = 1 / (t - e), h = 1 / (n - i), u = 1 / (o - r), d = (t + e) * l, f = (n + i) * h;
      let g, _;
      if (a === Rn) g = (o + r) * u, _ = -2 * u;
      else if (a === qr) g = r * u, _ = -1 * u;
      else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + a);
      return c[0] = 2 * l, c[4] = 0, c[8] = 0, c[12] = -d, c[1] = 0, c[5] = 2 * h, c[9] = 0, c[13] = -f, c[2] = 0, c[6] = 0, c[10] = _, c[14] = -g, c[3] = 0, c[7] = 0, c[11] = 0, c[15] = 1, this;
    }
    equals(e) {
      const t = this.elements, n = e.elements;
      for (let i = 0; i < 16; i++) if (t[i] !== n[i]) return false;
      return true;
    }
    fromArray(e, t = 0) {
      for (let n = 0; n < 16; n++) this.elements[n] = e[n + t];
      return this;
    }
    toArray(e = [], t = 0) {
      const n = this.elements;
      return e[t] = n[0], e[t + 1] = n[1], e[t + 2] = n[2], e[t + 3] = n[3], e[t + 4] = n[4], e[t + 5] = n[5], e[t + 6] = n[6], e[t + 7] = n[7], e[t + 8] = n[8], e[t + 9] = n[9], e[t + 10] = n[10], e[t + 11] = n[11], e[t + 12] = n[12], e[t + 13] = n[13], e[t + 14] = n[14], e[t + 15] = n[15], e;
    }
  }
  const Ei = new R(), en = new Ce(), Pd = new R(0, 0, 0), Id = new R(1, 1, 1), On = new R(), Js = new R(), Bt = new R(), kc = new Ce(), zc = new Ht();
  class un {
    constructor(e = 0, t = 0, n = 0, i = un.DEFAULT_ORDER) {
      this.isEuler = true, this._x = e, this._y = t, this._z = n, this._order = i;
    }
    get x() {
      return this._x;
    }
    set x(e) {
      this._x = e, this._onChangeCallback();
    }
    get y() {
      return this._y;
    }
    set y(e) {
      this._y = e, this._onChangeCallback();
    }
    get z() {
      return this._z;
    }
    set z(e) {
      this._z = e, this._onChangeCallback();
    }
    get order() {
      return this._order;
    }
    set order(e) {
      this._order = e, this._onChangeCallback();
    }
    set(e, t, n, i = this._order) {
      return this._x = e, this._y = t, this._z = n, this._order = i, this._onChangeCallback(), this;
    }
    clone() {
      return new this.constructor(this._x, this._y, this._z, this._order);
    }
    copy(e) {
      return this._x = e._x, this._y = e._y, this._z = e._z, this._order = e._order, this._onChangeCallback(), this;
    }
    setFromRotationMatrix(e, t = this._order, n = true) {
      const i = e.elements, r = i[0], o = i[4], a = i[8], c = i[1], l = i[5], h = i[9], u = i[2], d = i[6], f = i[10];
      switch (t) {
        case "XYZ":
          this._y = Math.asin(St(a, -1, 1)), Math.abs(a) < 0.9999999 ? (this._x = Math.atan2(-h, f), this._z = Math.atan2(-o, r)) : (this._x = Math.atan2(d, l), this._z = 0);
          break;
        case "YXZ":
          this._x = Math.asin(-St(h, -1, 1)), Math.abs(h) < 0.9999999 ? (this._y = Math.atan2(a, f), this._z = Math.atan2(c, l)) : (this._y = Math.atan2(-u, r), this._z = 0);
          break;
        case "ZXY":
          this._x = Math.asin(St(d, -1, 1)), Math.abs(d) < 0.9999999 ? (this._y = Math.atan2(-u, f), this._z = Math.atan2(-o, l)) : (this._y = 0, this._z = Math.atan2(c, r));
          break;
        case "ZYX":
          this._y = Math.asin(-St(u, -1, 1)), Math.abs(u) < 0.9999999 ? (this._x = Math.atan2(d, f), this._z = Math.atan2(c, r)) : (this._x = 0, this._z = Math.atan2(-o, l));
          break;
        case "YZX":
          this._z = Math.asin(St(c, -1, 1)), Math.abs(c) < 0.9999999 ? (this._x = Math.atan2(-h, l), this._y = Math.atan2(-u, r)) : (this._x = 0, this._y = Math.atan2(a, f));
          break;
        case "XZY":
          this._z = Math.asin(-St(o, -1, 1)), Math.abs(o) < 0.9999999 ? (this._x = Math.atan2(d, l), this._y = Math.atan2(a, r)) : (this._x = Math.atan2(-h, f), this._y = 0);
          break;
        default:
          console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " + t);
      }
      return this._order = t, n === true && this._onChangeCallback(), this;
    }
    setFromQuaternion(e, t, n) {
      return kc.makeRotationFromQuaternion(e), this.setFromRotationMatrix(kc, t, n);
    }
    setFromVector3(e, t = this._order) {
      return this.set(e.x, e.y, e.z, t);
    }
    reorder(e) {
      return zc.setFromEuler(this), this.setFromQuaternion(zc, e);
    }
    equals(e) {
      return e._x === this._x && e._y === this._y && e._z === this._z && e._order === this._order;
    }
    fromArray(e) {
      return this._x = e[0], this._y = e[1], this._z = e[2], e[3] !== void 0 && (this._order = e[3]), this._onChangeCallback(), this;
    }
    toArray(e = [], t = 0) {
      return e[t] = this._x, e[t + 1] = this._y, e[t + 2] = this._z, e[t + 3] = this._order, e;
    }
    _onChange(e) {
      return this._onChangeCallback = e, this;
    }
    _onChangeCallback() {
    }
    *[Symbol.iterator]() {
      yield this._x, yield this._y, yield this._z, yield this._order;
    }
  }
  un.DEFAULT_ORDER = "XYZ";
  class Th {
    constructor() {
      this.mask = 1;
    }
    set(e) {
      this.mask = (1 << e | 0) >>> 0;
    }
    enable(e) {
      this.mask |= 1 << e | 0;
    }
    enableAll() {
      this.mask = -1;
    }
    toggle(e) {
      this.mask ^= 1 << e | 0;
    }
    disable(e) {
      this.mask &= ~(1 << e | 0);
    }
    disableAll() {
      this.mask = 0;
    }
    test(e) {
      return (this.mask & e.mask) !== 0;
    }
    isEnabled(e) {
      return (this.mask & (1 << e | 0)) !== 0;
    }
  }
  let Ld = 0;
  const Hc = new R(), bi = new Ht(), vn = new Ce(), Qs = new R(), ms = new R(), Dd = new R(), Ud = new Ht(), Vc = new R(1, 0, 0), Gc = new R(0, 1, 0), Wc = new R(0, 0, 1), Xc = {
    type: "added"
  }, Nd = {
    type: "removed"
  }, Ti = {
    type: "childadded",
    child: null
  }, yo = {
    type: "childremoved",
    child: null
  };
  class ot extends Jn {
    constructor() {
      super(), this.isObject3D = true, Object.defineProperty(this, "id", {
        value: Ld++
      }), this.uuid = an(), this.name = "", this.type = "Object3D", this.parent = null, this.children = [], this.up = ot.DEFAULT_UP.clone();
      const e = new R(), t = new un(), n = new Ht(), i = new R(1, 1, 1);
      function r() {
        n.setFromEuler(t, false);
      }
      function o() {
        t.setFromQuaternion(n, void 0, false);
      }
      t._onChange(r), n._onChange(o), Object.defineProperties(this, {
        position: {
          configurable: true,
          enumerable: true,
          value: e
        },
        rotation: {
          configurable: true,
          enumerable: true,
          value: t
        },
        quaternion: {
          configurable: true,
          enumerable: true,
          value: n
        },
        scale: {
          configurable: true,
          enumerable: true,
          value: i
        },
        modelViewMatrix: {
          value: new Ce()
        },
        normalMatrix: {
          value: new De()
        }
      }), this.matrix = new Ce(), this.matrixWorld = new Ce(), this.matrixAutoUpdate = ot.DEFAULT_MATRIX_AUTO_UPDATE, this.matrixWorldAutoUpdate = ot.DEFAULT_MATRIX_WORLD_AUTO_UPDATE, this.matrixWorldNeedsUpdate = false, this.layers = new Th(), this.visible = true, this.castShadow = false, this.receiveShadow = false, this.frustumCulled = true, this.renderOrder = 0, this.animations = [], this.userData = {};
    }
    onBeforeShadow() {
    }
    onAfterShadow() {
    }
    onBeforeRender() {
    }
    onAfterRender() {
    }
    applyMatrix4(e) {
      this.matrixAutoUpdate && this.updateMatrix(), this.matrix.premultiply(e), this.matrix.decompose(this.position, this.quaternion, this.scale);
    }
    applyQuaternion(e) {
      return this.quaternion.premultiply(e), this;
    }
    setRotationFromAxisAngle(e, t) {
      this.quaternion.setFromAxisAngle(e, t);
    }
    setRotationFromEuler(e) {
      this.quaternion.setFromEuler(e, true);
    }
    setRotationFromMatrix(e) {
      this.quaternion.setFromRotationMatrix(e);
    }
    setRotationFromQuaternion(e) {
      this.quaternion.copy(e);
    }
    rotateOnAxis(e, t) {
      return bi.setFromAxisAngle(e, t), this.quaternion.multiply(bi), this;
    }
    rotateOnWorldAxis(e, t) {
      return bi.setFromAxisAngle(e, t), this.quaternion.premultiply(bi), this;
    }
    rotateX(e) {
      return this.rotateOnAxis(Vc, e);
    }
    rotateY(e) {
      return this.rotateOnAxis(Gc, e);
    }
    rotateZ(e) {
      return this.rotateOnAxis(Wc, e);
    }
    translateOnAxis(e, t) {
      return Hc.copy(e).applyQuaternion(this.quaternion), this.position.add(Hc.multiplyScalar(t)), this;
    }
    translateX(e) {
      return this.translateOnAxis(Vc, e);
    }
    translateY(e) {
      return this.translateOnAxis(Gc, e);
    }
    translateZ(e) {
      return this.translateOnAxis(Wc, e);
    }
    localToWorld(e) {
      return this.updateWorldMatrix(true, false), e.applyMatrix4(this.matrixWorld);
    }
    worldToLocal(e) {
      return this.updateWorldMatrix(true, false), e.applyMatrix4(vn.copy(this.matrixWorld).invert());
    }
    lookAt(e, t, n) {
      e.isVector3 ? Qs.copy(e) : Qs.set(e, t, n);
      const i = this.parent;
      this.updateWorldMatrix(true, false), ms.setFromMatrixPosition(this.matrixWorld), this.isCamera || this.isLight ? vn.lookAt(ms, Qs, this.up) : vn.lookAt(Qs, ms, this.up), this.quaternion.setFromRotationMatrix(vn), i && (vn.extractRotation(i.matrixWorld), bi.setFromRotationMatrix(vn), this.quaternion.premultiply(bi.invert()));
    }
    add(e) {
      if (arguments.length > 1) {
        for (let t = 0; t < arguments.length; t++) this.add(arguments[t]);
        return this;
      }
      return e === this ? (console.error("THREE.Object3D.add: object can't be added as a child of itself.", e), this) : (e && e.isObject3D ? (e.removeFromParent(), e.parent = this, this.children.push(e), e.dispatchEvent(Xc), Ti.child = e, this.dispatchEvent(Ti), Ti.child = null) : console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", e), this);
    }
    remove(e) {
      if (arguments.length > 1) {
        for (let n = 0; n < arguments.length; n++) this.remove(arguments[n]);
        return this;
      }
      const t = this.children.indexOf(e);
      return t !== -1 && (e.parent = null, this.children.splice(t, 1), e.dispatchEvent(Nd), yo.child = e, this.dispatchEvent(yo), yo.child = null), this;
    }
    removeFromParent() {
      const e = this.parent;
      return e !== null && e.remove(this), this;
    }
    clear() {
      return this.remove(...this.children);
    }
    attach(e) {
      return this.updateWorldMatrix(true, false), vn.copy(this.matrixWorld).invert(), e.parent !== null && (e.parent.updateWorldMatrix(true, false), vn.multiply(e.parent.matrixWorld)), e.applyMatrix4(vn), e.removeFromParent(), e.parent = this, this.children.push(e), e.updateWorldMatrix(false, true), e.dispatchEvent(Xc), Ti.child = e, this.dispatchEvent(Ti), Ti.child = null, this;
    }
    getObjectById(e) {
      return this.getObjectByProperty("id", e);
    }
    getObjectByName(e) {
      return this.getObjectByProperty("name", e);
    }
    getObjectByProperty(e, t) {
      if (this[e] === t) return this;
      for (let n = 0, i = this.children.length; n < i; n++) {
        const o = this.children[n].getObjectByProperty(e, t);
        if (o !== void 0) return o;
      }
    }
    getObjectsByProperty(e, t, n = []) {
      this[e] === t && n.push(this);
      const i = this.children;
      for (let r = 0, o = i.length; r < o; r++) i[r].getObjectsByProperty(e, t, n);
      return n;
    }
    getWorldPosition(e) {
      return this.updateWorldMatrix(true, false), e.setFromMatrixPosition(this.matrixWorld);
    }
    getWorldQuaternion(e) {
      return this.updateWorldMatrix(true, false), this.matrixWorld.decompose(ms, e, Dd), e;
    }
    getWorldScale(e) {
      return this.updateWorldMatrix(true, false), this.matrixWorld.decompose(ms, Ud, e), e;
    }
    getWorldDirection(e) {
      this.updateWorldMatrix(true, false);
      const t = this.matrixWorld.elements;
      return e.set(t[8], t[9], t[10]).normalize();
    }
    raycast() {
    }
    traverse(e) {
      e(this);
      const t = this.children;
      for (let n = 0, i = t.length; n < i; n++) t[n].traverse(e);
    }
    traverseVisible(e) {
      if (this.visible === false) return;
      e(this);
      const t = this.children;
      for (let n = 0, i = t.length; n < i; n++) t[n].traverseVisible(e);
    }
    traverseAncestors(e) {
      const t = this.parent;
      t !== null && (e(t), t.traverseAncestors(e));
    }
    updateMatrix() {
      this.matrix.compose(this.position, this.quaternion, this.scale), this.matrixWorldNeedsUpdate = true;
    }
    updateMatrixWorld(e) {
      this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || e) && (this.matrixWorldAutoUpdate === true && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), this.matrixWorldNeedsUpdate = false, e = true);
      const t = this.children;
      for (let n = 0, i = t.length; n < i; n++) t[n].updateMatrixWorld(e);
    }
    updateWorldMatrix(e, t) {
      const n = this.parent;
      if (e === true && n !== null && n.updateWorldMatrix(true, false), this.matrixAutoUpdate && this.updateMatrix(), this.matrixWorldAutoUpdate === true && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), t === true) {
        const i = this.children;
        for (let r = 0, o = i.length; r < o; r++) i[r].updateWorldMatrix(false, true);
      }
    }
    toJSON(e) {
      const t = e === void 0 || typeof e == "string", n = {};
      t && (e = {
        geometries: {},
        materials: {},
        textures: {},
        images: {},
        shapes: {},
        skeletons: {},
        animations: {},
        nodes: {}
      }, n.metadata = {
        version: 4.6,
        type: "Object",
        generator: "Object3D.toJSON"
      });
      const i = {};
      i.uuid = this.uuid, i.type = this.type, this.name !== "" && (i.name = this.name), this.castShadow === true && (i.castShadow = true), this.receiveShadow === true && (i.receiveShadow = true), this.visible === false && (i.visible = false), this.frustumCulled === false && (i.frustumCulled = false), this.renderOrder !== 0 && (i.renderOrder = this.renderOrder), Object.keys(this.userData).length > 0 && (i.userData = this.userData), i.layers = this.layers.mask, i.matrix = this.matrix.toArray(), i.up = this.up.toArray(), this.matrixAutoUpdate === false && (i.matrixAutoUpdate = false), this.isInstancedMesh && (i.type = "InstancedMesh", i.count = this.count, i.instanceMatrix = this.instanceMatrix.toJSON(), this.instanceColor !== null && (i.instanceColor = this.instanceColor.toJSON())), this.isBatchedMesh && (i.type = "BatchedMesh", i.perObjectFrustumCulled = this.perObjectFrustumCulled, i.sortObjects = this.sortObjects, i.drawRanges = this._drawRanges, i.reservedRanges = this._reservedRanges, i.visibility = this._visibility, i.active = this._active, i.bounds = this._bounds.map((a) => ({
        boxInitialized: a.boxInitialized,
        boxMin: a.box.min.toArray(),
        boxMax: a.box.max.toArray(),
        sphereInitialized: a.sphereInitialized,
        sphereRadius: a.sphere.radius,
        sphereCenter: a.sphere.center.toArray()
      })), i.maxInstanceCount = this._maxInstanceCount, i.maxVertexCount = this._maxVertexCount, i.maxIndexCount = this._maxIndexCount, i.geometryInitialized = this._geometryInitialized, i.geometryCount = this._geometryCount, i.matricesTexture = this._matricesTexture.toJSON(e), this._colorsTexture !== null && (i.colorsTexture = this._colorsTexture.toJSON(e)), this.boundingSphere !== null && (i.boundingSphere = {
        center: i.boundingSphere.center.toArray(),
        radius: i.boundingSphere.radius
      }), this.boundingBox !== null && (i.boundingBox = {
        min: i.boundingBox.min.toArray(),
        max: i.boundingBox.max.toArray()
      }));
      function r(a, c) {
        return a[c.uuid] === void 0 && (a[c.uuid] = c.toJSON(e)), c.uuid;
      }
      if (this.isScene) this.background && (this.background.isColor ? i.background = this.background.toJSON() : this.background.isTexture && (i.background = this.background.toJSON(e).uuid)), this.environment && this.environment.isTexture && this.environment.isRenderTargetTexture !== true && (i.environment = this.environment.toJSON(e).uuid);
      else if (this.isMesh || this.isLine || this.isPoints) {
        i.geometry = r(e.geometries, this.geometry);
        const a = this.geometry.parameters;
        if (a !== void 0 && a.shapes !== void 0) {
          const c = a.shapes;
          if (Array.isArray(c)) for (let l = 0, h = c.length; l < h; l++) {
            const u = c[l];
            r(e.shapes, u);
          }
          else r(e.shapes, c);
        }
      }
      if (this.isSkinnedMesh && (i.bindMode = this.bindMode, i.bindMatrix = this.bindMatrix.toArray(), this.skeleton !== void 0 && (r(e.skeletons, this.skeleton), i.skeleton = this.skeleton.uuid)), this.material !== void 0) if (Array.isArray(this.material)) {
        const a = [];
        for (let c = 0, l = this.material.length; c < l; c++) a.push(r(e.materials, this.material[c]));
        i.material = a;
      } else i.material = r(e.materials, this.material);
      if (this.children.length > 0) {
        i.children = [];
        for (let a = 0; a < this.children.length; a++) i.children.push(this.children[a].toJSON(e).object);
      }
      if (this.animations.length > 0) {
        i.animations = [];
        for (let a = 0; a < this.animations.length; a++) {
          const c = this.animations[a];
          i.animations.push(r(e.animations, c));
        }
      }
      if (t) {
        const a = o(e.geometries), c = o(e.materials), l = o(e.textures), h = o(e.images), u = o(e.shapes), d = o(e.skeletons), f = o(e.animations), g = o(e.nodes);
        a.length > 0 && (n.geometries = a), c.length > 0 && (n.materials = c), l.length > 0 && (n.textures = l), h.length > 0 && (n.images = h), u.length > 0 && (n.shapes = u), d.length > 0 && (n.skeletons = d), f.length > 0 && (n.animations = f), g.length > 0 && (n.nodes = g);
      }
      return n.object = i, n;
      function o(a) {
        const c = [];
        for (const l in a) {
          const h = a[l];
          delete h.metadata, c.push(h);
        }
        return c;
      }
    }
    clone(e) {
      return new this.constructor().copy(this, e);
    }
    copy(e, t = true) {
      if (this.name = e.name, this.up.copy(e.up), this.position.copy(e.position), this.rotation.order = e.rotation.order, this.quaternion.copy(e.quaternion), this.scale.copy(e.scale), this.matrix.copy(e.matrix), this.matrixWorld.copy(e.matrixWorld), this.matrixAutoUpdate = e.matrixAutoUpdate, this.matrixWorldAutoUpdate = e.matrixWorldAutoUpdate, this.matrixWorldNeedsUpdate = e.matrixWorldNeedsUpdate, this.layers.mask = e.layers.mask, this.visible = e.visible, this.castShadow = e.castShadow, this.receiveShadow = e.receiveShadow, this.frustumCulled = e.frustumCulled, this.renderOrder = e.renderOrder, this.animations = e.animations.slice(), this.userData = JSON.parse(JSON.stringify(e.userData)), t === true) for (let n = 0; n < e.children.length; n++) {
        const i = e.children[n];
        this.add(i.clone());
      }
      return this;
    }
  }
  ot.DEFAULT_UP = new R(0, 1, 0);
  ot.DEFAULT_MATRIX_AUTO_UPDATE = true;
  ot.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = true;
  const tn = new R(), yn = new R(), Mo = new R(), Mn = new R(), Ai = new R(), wi = new R(), Yc = new R(), So = new R(), Eo = new R(), bo = new R(), To = new Ye(), Ao = new Ye(), wo = new Ye();
  class qt {
    constructor(e = new R(), t = new R(), n = new R()) {
      this.a = e, this.b = t, this.c = n;
    }
    static getNormal(e, t, n, i) {
      i.subVectors(n, t), tn.subVectors(e, t), i.cross(tn);
      const r = i.lengthSq();
      return r > 0 ? i.multiplyScalar(1 / Math.sqrt(r)) : i.set(0, 0, 0);
    }
    static getBarycoord(e, t, n, i, r) {
      tn.subVectors(i, t), yn.subVectors(n, t), Mo.subVectors(e, t);
      const o = tn.dot(tn), a = tn.dot(yn), c = tn.dot(Mo), l = yn.dot(yn), h = yn.dot(Mo), u = o * l - a * a;
      if (u === 0) return r.set(0, 0, 0), null;
      const d = 1 / u, f = (l * c - a * h) * d, g = (o * h - a * c) * d;
      return r.set(1 - f - g, g, f);
    }
    static containsPoint(e, t, n, i) {
      return this.getBarycoord(e, t, n, i, Mn) === null ? false : Mn.x >= 0 && Mn.y >= 0 && Mn.x + Mn.y <= 1;
    }
    static getInterpolation(e, t, n, i, r, o, a, c) {
      return this.getBarycoord(e, t, n, i, Mn) === null ? (c.x = 0, c.y = 0, "z" in c && (c.z = 0), "w" in c && (c.w = 0), null) : (c.setScalar(0), c.addScaledVector(r, Mn.x), c.addScaledVector(o, Mn.y), c.addScaledVector(a, Mn.z), c);
    }
    static getInterpolatedAttribute(e, t, n, i, r, o) {
      return To.setScalar(0), Ao.setScalar(0), wo.setScalar(0), To.fromBufferAttribute(e, t), Ao.fromBufferAttribute(e, n), wo.fromBufferAttribute(e, i), o.setScalar(0), o.addScaledVector(To, r.x), o.addScaledVector(Ao, r.y), o.addScaledVector(wo, r.z), o;
    }
    static isFrontFacing(e, t, n, i) {
      return tn.subVectors(n, t), yn.subVectors(e, t), tn.cross(yn).dot(i) < 0;
    }
    set(e, t, n) {
      return this.a.copy(e), this.b.copy(t), this.c.copy(n), this;
    }
    setFromPointsAndIndices(e, t, n, i) {
      return this.a.copy(e[t]), this.b.copy(e[n]), this.c.copy(e[i]), this;
    }
    setFromAttributeAndIndices(e, t, n, i) {
      return this.a.fromBufferAttribute(e, t), this.b.fromBufferAttribute(e, n), this.c.fromBufferAttribute(e, i), this;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e) {
      return this.a.copy(e.a), this.b.copy(e.b), this.c.copy(e.c), this;
    }
    getArea() {
      return tn.subVectors(this.c, this.b), yn.subVectors(this.a, this.b), tn.cross(yn).length() * 0.5;
    }
    getMidpoint(e) {
      return e.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
    }
    getNormal(e) {
      return qt.getNormal(this.a, this.b, this.c, e);
    }
    getPlane(e) {
      return e.setFromCoplanarPoints(this.a, this.b, this.c);
    }
    getBarycoord(e, t) {
      return qt.getBarycoord(e, this.a, this.b, this.c, t);
    }
    getInterpolation(e, t, n, i, r) {
      return qt.getInterpolation(e, this.a, this.b, this.c, t, n, i, r);
    }
    containsPoint(e) {
      return qt.containsPoint(e, this.a, this.b, this.c);
    }
    isFrontFacing(e) {
      return qt.isFrontFacing(this.a, this.b, this.c, e);
    }
    intersectsBox(e) {
      return e.intersectsTriangle(this);
    }
    closestPointToPoint(e, t) {
      const n = this.a, i = this.b, r = this.c;
      let o, a;
      Ai.subVectors(i, n), wi.subVectors(r, n), So.subVectors(e, n);
      const c = Ai.dot(So), l = wi.dot(So);
      if (c <= 0 && l <= 0) return t.copy(n);
      Eo.subVectors(e, i);
      const h = Ai.dot(Eo), u = wi.dot(Eo);
      if (h >= 0 && u <= h) return t.copy(i);
      const d = c * u - h * l;
      if (d <= 0 && c >= 0 && h <= 0) return o = c / (c - h), t.copy(n).addScaledVector(Ai, o);
      bo.subVectors(e, r);
      const f = Ai.dot(bo), g = wi.dot(bo);
      if (g >= 0 && f <= g) return t.copy(r);
      const _ = f * l - c * g;
      if (_ <= 0 && l >= 0 && g <= 0) return a = l / (l - g), t.copy(n).addScaledVector(wi, a);
      const m = h * g - f * u;
      if (m <= 0 && u - h >= 0 && f - g >= 0) return Yc.subVectors(r, i), a = (u - h) / (u - h + (f - g)), t.copy(i).addScaledVector(Yc, a);
      const p = 1 / (m + _ + d);
      return o = _ * p, a = d * p, t.copy(n).addScaledVector(Ai, o).addScaledVector(wi, a);
    }
    equals(e) {
      return e.a.equals(this.a) && e.b.equals(this.b) && e.c.equals(this.c);
    }
  }
  const Ah = {
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    rebeccapurple: 6697881,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074
  }, Bn = {
    h: 0,
    s: 0,
    l: 0
  }, er = {
    h: 0,
    s: 0,
    l: 0
  };
  function Ro(s, e, t) {
    return t < 0 && (t += 1), t > 1 && (t -= 1), t < 1 / 6 ? s + (e - s) * 6 * t : t < 1 / 2 ? e : t < 2 / 3 ? s + (e - s) * 6 * (2 / 3 - t) : s;
  }
  class Se {
    constructor(e, t, n) {
      return this.isColor = true, this.r = 1, this.g = 1, this.b = 1, this.set(e, t, n);
    }
    set(e, t, n) {
      if (t === void 0 && n === void 0) {
        const i = e;
        i && i.isColor ? this.copy(i) : typeof i == "number" ? this.setHex(i) : typeof i == "string" && this.setStyle(i);
      } else this.setRGB(e, t, n);
      return this;
    }
    setScalar(e) {
      return this.r = e, this.g = e, this.b = e, this;
    }
    setHex(e, t = Rt) {
      return e = Math.floor(e), this.r = (e >> 16 & 255) / 255, this.g = (e >> 8 & 255) / 255, this.b = (e & 255) / 255, Ge.toWorkingColorSpace(this, t), this;
    }
    setRGB(e, t, n, i = Ge.workingColorSpace) {
      return this.r = e, this.g = t, this.b = n, Ge.toWorkingColorSpace(this, i), this;
    }
    setHSL(e, t, n, i = Ge.workingColorSpace) {
      if (e = nc(e, 1), t = St(t, 0, 1), n = St(n, 0, 1), t === 0) this.r = this.g = this.b = n;
      else {
        const r = n <= 0.5 ? n * (1 + t) : n + t - n * t, o = 2 * n - r;
        this.r = Ro(o, r, e + 1 / 3), this.g = Ro(o, r, e), this.b = Ro(o, r, e - 1 / 3);
      }
      return Ge.toWorkingColorSpace(this, i), this;
    }
    setStyle(e, t = Rt) {
      function n(r) {
        r !== void 0 && parseFloat(r) < 1 && console.warn("THREE.Color: Alpha component of " + e + " will be ignored.");
      }
      let i;
      if (i = /^(\w+)\(([^\)]*)\)/.exec(e)) {
        let r;
        const o = i[1], a = i[2];
        switch (o) {
          case "rgb":
          case "rgba":
            if (r = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a)) return n(r[4]), this.setRGB(Math.min(255, parseInt(r[1], 10)) / 255, Math.min(255, parseInt(r[2], 10)) / 255, Math.min(255, parseInt(r[3], 10)) / 255, t);
            if (r = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a)) return n(r[4]), this.setRGB(Math.min(100, parseInt(r[1], 10)) / 100, Math.min(100, parseInt(r[2], 10)) / 100, Math.min(100, parseInt(r[3], 10)) / 100, t);
            break;
          case "hsl":
          case "hsla":
            if (r = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a)) return n(r[4]), this.setHSL(parseFloat(r[1]) / 360, parseFloat(r[2]) / 100, parseFloat(r[3]) / 100, t);
            break;
          default:
            console.warn("THREE.Color: Unknown color model " + e);
        }
      } else if (i = /^\#([A-Fa-f\d]+)$/.exec(e)) {
        const r = i[1], o = r.length;
        if (o === 3) return this.setRGB(parseInt(r.charAt(0), 16) / 15, parseInt(r.charAt(1), 16) / 15, parseInt(r.charAt(2), 16) / 15, t);
        if (o === 6) return this.setHex(parseInt(r, 16), t);
        console.warn("THREE.Color: Invalid hex color " + e);
      } else if (e && e.length > 0) return this.setColorName(e, t);
      return this;
    }
    setColorName(e, t = Rt) {
      const n = Ah[e.toLowerCase()];
      return n !== void 0 ? this.setHex(n, t) : console.warn("THREE.Color: Unknown color " + e), this;
    }
    clone() {
      return new this.constructor(this.r, this.g, this.b);
    }
    copy(e) {
      return this.r = e.r, this.g = e.g, this.b = e.b, this;
    }
    copySRGBToLinear(e) {
      return this.r = ji(e.r), this.g = ji(e.g), this.b = ji(e.b), this;
    }
    copyLinearToSRGB(e) {
      return this.r = uo(e.r), this.g = uo(e.g), this.b = uo(e.b), this;
    }
    convertSRGBToLinear() {
      return this.copySRGBToLinear(this), this;
    }
    convertLinearToSRGB() {
      return this.copyLinearToSRGB(this), this;
    }
    getHex(e = Rt) {
      return Ge.fromWorkingColorSpace(Tt.copy(this), e), Math.round(St(Tt.r * 255, 0, 255)) * 65536 + Math.round(St(Tt.g * 255, 0, 255)) * 256 + Math.round(St(Tt.b * 255, 0, 255));
    }
    getHexString(e = Rt) {
      return ("000000" + this.getHex(e).toString(16)).slice(-6);
    }
    getHSL(e, t = Ge.workingColorSpace) {
      Ge.fromWorkingColorSpace(Tt.copy(this), t);
      const n = Tt.r, i = Tt.g, r = Tt.b, o = Math.max(n, i, r), a = Math.min(n, i, r);
      let c, l;
      const h = (a + o) / 2;
      if (a === o) c = 0, l = 0;
      else {
        const u = o - a;
        switch (l = h <= 0.5 ? u / (o + a) : u / (2 - o - a), o) {
          case n:
            c = (i - r) / u + (i < r ? 6 : 0);
            break;
          case i:
            c = (r - n) / u + 2;
            break;
          case r:
            c = (n - i) / u + 4;
            break;
        }
        c /= 6;
      }
      return e.h = c, e.s = l, e.l = h, e;
    }
    getRGB(e, t = Ge.workingColorSpace) {
      return Ge.fromWorkingColorSpace(Tt.copy(this), t), e.r = Tt.r, e.g = Tt.g, e.b = Tt.b, e;
    }
    getStyle(e = Rt) {
      Ge.fromWorkingColorSpace(Tt.copy(this), e);
      const t = Tt.r, n = Tt.g, i = Tt.b;
      return e !== Rt ? `color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})` : `rgb(${Math.round(t * 255)},${Math.round(n * 255)},${Math.round(i * 255)})`;
    }
    offsetHSL(e, t, n) {
      return this.getHSL(Bn), this.setHSL(Bn.h + e, Bn.s + t, Bn.l + n);
    }
    add(e) {
      return this.r += e.r, this.g += e.g, this.b += e.b, this;
    }
    addColors(e, t) {
      return this.r = e.r + t.r, this.g = e.g + t.g, this.b = e.b + t.b, this;
    }
    addScalar(e) {
      return this.r += e, this.g += e, this.b += e, this;
    }
    sub(e) {
      return this.r = Math.max(0, this.r - e.r), this.g = Math.max(0, this.g - e.g), this.b = Math.max(0, this.b - e.b), this;
    }
    multiply(e) {
      return this.r *= e.r, this.g *= e.g, this.b *= e.b, this;
    }
    multiplyScalar(e) {
      return this.r *= e, this.g *= e, this.b *= e, this;
    }
    lerp(e, t) {
      return this.r += (e.r - this.r) * t, this.g += (e.g - this.g) * t, this.b += (e.b - this.b) * t, this;
    }
    lerpColors(e, t, n) {
      return this.r = e.r + (t.r - e.r) * n, this.g = e.g + (t.g - e.g) * n, this.b = e.b + (t.b - e.b) * n, this;
    }
    lerpHSL(e, t) {
      this.getHSL(Bn), e.getHSL(er);
      const n = Ps(Bn.h, er.h, t), i = Ps(Bn.s, er.s, t), r = Ps(Bn.l, er.l, t);
      return this.setHSL(n, i, r), this;
    }
    setFromVector3(e) {
      return this.r = e.x, this.g = e.y, this.b = e.z, this;
    }
    applyMatrix3(e) {
      const t = this.r, n = this.g, i = this.b, r = e.elements;
      return this.r = r[0] * t + r[3] * n + r[6] * i, this.g = r[1] * t + r[4] * n + r[7] * i, this.b = r[2] * t + r[5] * n + r[8] * i, this;
    }
    equals(e) {
      return e.r === this.r && e.g === this.g && e.b === this.b;
    }
    fromArray(e, t = 0) {
      return this.r = e[t], this.g = e[t + 1], this.b = e[t + 2], this;
    }
    toArray(e = [], t = 0) {
      return e[t] = this.r, e[t + 1] = this.g, e[t + 2] = this.b, e;
    }
    fromBufferAttribute(e, t) {
      return this.r = e.getX(t), this.g = e.getY(t), this.b = e.getZ(t), this;
    }
    toJSON() {
      return this.getHex();
    }
    *[Symbol.iterator]() {
      yield this.r, yield this.g, yield this.b;
    }
  }
  const Tt = new Se();
  Se.NAMES = Ah;
  let Fd = 0;
  class cn extends Jn {
    constructor() {
      super(), this.isMaterial = true, Object.defineProperty(this, "id", {
        value: Fd++
      }), this.uuid = an(), this.name = "", this.type = "Material", this.blending = Yi, this.side = Pn, this.vertexColors = false, this.opacity = 1, this.transparent = false, this.alphaHash = false, this.blendSrc = ea, this.blendDst = ta, this.blendEquation = li, this.blendSrcAlpha = null, this.blendDstAlpha = null, this.blendEquationAlpha = null, this.blendColor = new Se(0, 0, 0), this.blendAlpha = 0, this.depthFunc = $i, this.depthTest = true, this.depthWrite = true, this.stencilWriteMask = 255, this.stencilFunc = Lc, this.stencilRef = 0, this.stencilFuncMask = 255, this.stencilFail = xi, this.stencilZFail = xi, this.stencilZPass = xi, this.stencilWrite = false, this.clippingPlanes = null, this.clipIntersection = false, this.clipShadows = false, this.shadowSide = null, this.colorWrite = true, this.precision = null, this.polygonOffset = false, this.polygonOffsetFactor = 0, this.polygonOffsetUnits = 0, this.dithering = false, this.alphaToCoverage = false, this.premultipliedAlpha = false, this.forceSinglePass = false, this.visible = true, this.toneMapped = true, this.userData = {}, this.version = 0, this._alphaTest = 0;
    }
    get alphaTest() {
      return this._alphaTest;
    }
    set alphaTest(e) {
      this._alphaTest > 0 != e > 0 && this.version++, this._alphaTest = e;
    }
    onBeforeRender() {
    }
    onBeforeCompile() {
    }
    customProgramCacheKey() {
      return this.onBeforeCompile.toString();
    }
    setValues(e) {
      if (e !== void 0) for (const t in e) {
        const n = e[t];
        if (n === void 0) {
          console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);
          continue;
        }
        const i = this[t];
        if (i === void 0) {
          console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);
          continue;
        }
        i && i.isColor ? i.set(n) : i && i.isVector3 && n && n.isVector3 ? i.copy(n) : this[t] = n;
      }
    }
    toJSON(e) {
      const t = e === void 0 || typeof e == "string";
      t && (e = {
        textures: {},
        images: {}
      });
      const n = {
        metadata: {
          version: 4.6,
          type: "Material",
          generator: "Material.toJSON"
        }
      };
      n.uuid = this.uuid, n.type = this.type, this.name !== "" && (n.name = this.name), this.color && this.color.isColor && (n.color = this.color.getHex()), this.roughness !== void 0 && (n.roughness = this.roughness), this.metalness !== void 0 && (n.metalness = this.metalness), this.sheen !== void 0 && (n.sheen = this.sheen), this.sheenColor && this.sheenColor.isColor && (n.sheenColor = this.sheenColor.getHex()), this.sheenRoughness !== void 0 && (n.sheenRoughness = this.sheenRoughness), this.emissive && this.emissive.isColor && (n.emissive = this.emissive.getHex()), this.emissiveIntensity !== void 0 && this.emissiveIntensity !== 1 && (n.emissiveIntensity = this.emissiveIntensity), this.specular && this.specular.isColor && (n.specular = this.specular.getHex()), this.specularIntensity !== void 0 && (n.specularIntensity = this.specularIntensity), this.specularColor && this.specularColor.isColor && (n.specularColor = this.specularColor.getHex()), this.shininess !== void 0 && (n.shininess = this.shininess), this.clearcoat !== void 0 && (n.clearcoat = this.clearcoat), this.clearcoatRoughness !== void 0 && (n.clearcoatRoughness = this.clearcoatRoughness), this.clearcoatMap && this.clearcoatMap.isTexture && (n.clearcoatMap = this.clearcoatMap.toJSON(e).uuid), this.clearcoatRoughnessMap && this.clearcoatRoughnessMap.isTexture && (n.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(e).uuid), this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture && (n.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(e).uuid, n.clearcoatNormalScale = this.clearcoatNormalScale.toArray()), this.dispersion !== void 0 && (n.dispersion = this.dispersion), this.iridescence !== void 0 && (n.iridescence = this.iridescence), this.iridescenceIOR !== void 0 && (n.iridescenceIOR = this.iridescenceIOR), this.iridescenceThicknessRange !== void 0 && (n.iridescenceThicknessRange = this.iridescenceThicknessRange), this.iridescenceMap && this.iridescenceMap.isTexture && (n.iridescenceMap = this.iridescenceMap.toJSON(e).uuid), this.iridescenceThicknessMap && this.iridescenceThicknessMap.isTexture && (n.iridescenceThicknessMap = this.iridescenceThicknessMap.toJSON(e).uuid), this.anisotropy !== void 0 && (n.anisotropy = this.anisotropy), this.anisotropyRotation !== void 0 && (n.anisotropyRotation = this.anisotropyRotation), this.anisotropyMap && this.anisotropyMap.isTexture && (n.anisotropyMap = this.anisotropyMap.toJSON(e).uuid), this.map && this.map.isTexture && (n.map = this.map.toJSON(e).uuid), this.matcap && this.matcap.isTexture && (n.matcap = this.matcap.toJSON(e).uuid), this.alphaMap && this.alphaMap.isTexture && (n.alphaMap = this.alphaMap.toJSON(e).uuid), this.lightMap && this.lightMap.isTexture && (n.lightMap = this.lightMap.toJSON(e).uuid, n.lightMapIntensity = this.lightMapIntensity), this.aoMap && this.aoMap.isTexture && (n.aoMap = this.aoMap.toJSON(e).uuid, n.aoMapIntensity = this.aoMapIntensity), this.bumpMap && this.bumpMap.isTexture && (n.bumpMap = this.bumpMap.toJSON(e).uuid, n.bumpScale = this.bumpScale), this.normalMap && this.normalMap.isTexture && (n.normalMap = this.normalMap.toJSON(e).uuid, n.normalMapType = this.normalMapType, n.normalScale = this.normalScale.toArray()), this.displacementMap && this.displacementMap.isTexture && (n.displacementMap = this.displacementMap.toJSON(e).uuid, n.displacementScale = this.displacementScale, n.displacementBias = this.displacementBias), this.roughnessMap && this.roughnessMap.isTexture && (n.roughnessMap = this.roughnessMap.toJSON(e).uuid), this.metalnessMap && this.metalnessMap.isTexture && (n.metalnessMap = this.metalnessMap.toJSON(e).uuid), this.emissiveMap && this.emissiveMap.isTexture && (n.emissiveMap = this.emissiveMap.toJSON(e).uuid), this.specularMap && this.specularMap.isTexture && (n.specularMap = this.specularMap.toJSON(e).uuid), this.specularIntensityMap && this.specularIntensityMap.isTexture && (n.specularIntensityMap = this.specularIntensityMap.toJSON(e).uuid), this.specularColorMap && this.specularColorMap.isTexture && (n.specularColorMap = this.specularColorMap.toJSON(e).uuid), this.envMap && this.envMap.isTexture && (n.envMap = this.envMap.toJSON(e).uuid, this.combine !== void 0 && (n.combine = this.combine)), this.envMapRotation !== void 0 && (n.envMapRotation = this.envMapRotation.toArray()), this.envMapIntensity !== void 0 && (n.envMapIntensity = this.envMapIntensity), this.reflectivity !== void 0 && (n.reflectivity = this.reflectivity), this.refractionRatio !== void 0 && (n.refractionRatio = this.refractionRatio), this.gradientMap && this.gradientMap.isTexture && (n.gradientMap = this.gradientMap.toJSON(e).uuid), this.transmission !== void 0 && (n.transmission = this.transmission), this.transmissionMap && this.transmissionMap.isTexture && (n.transmissionMap = this.transmissionMap.toJSON(e).uuid), this.thickness !== void 0 && (n.thickness = this.thickness), this.thicknessMap && this.thicknessMap.isTexture && (n.thicknessMap = this.thicknessMap.toJSON(e).uuid), this.attenuationDistance !== void 0 && this.attenuationDistance !== 1 / 0 && (n.attenuationDistance = this.attenuationDistance), this.attenuationColor !== void 0 && (n.attenuationColor = this.attenuationColor.getHex()), this.size !== void 0 && (n.size = this.size), this.shadowSide !== null && (n.shadowSide = this.shadowSide), this.sizeAttenuation !== void 0 && (n.sizeAttenuation = this.sizeAttenuation), this.blending !== Yi && (n.blending = this.blending), this.side !== Pn && (n.side = this.side), this.vertexColors === true && (n.vertexColors = true), this.opacity < 1 && (n.opacity = this.opacity), this.transparent === true && (n.transparent = true), this.blendSrc !== ea && (n.blendSrc = this.blendSrc), this.blendDst !== ta && (n.blendDst = this.blendDst), this.blendEquation !== li && (n.blendEquation = this.blendEquation), this.blendSrcAlpha !== null && (n.blendSrcAlpha = this.blendSrcAlpha), this.blendDstAlpha !== null && (n.blendDstAlpha = this.blendDstAlpha), this.blendEquationAlpha !== null && (n.blendEquationAlpha = this.blendEquationAlpha), this.blendColor && this.blendColor.isColor && (n.blendColor = this.blendColor.getHex()), this.blendAlpha !== 0 && (n.blendAlpha = this.blendAlpha), this.depthFunc !== $i && (n.depthFunc = this.depthFunc), this.depthTest === false && (n.depthTest = this.depthTest), this.depthWrite === false && (n.depthWrite = this.depthWrite), this.colorWrite === false && (n.colorWrite = this.colorWrite), this.stencilWriteMask !== 255 && (n.stencilWriteMask = this.stencilWriteMask), this.stencilFunc !== Lc && (n.stencilFunc = this.stencilFunc), this.stencilRef !== 0 && (n.stencilRef = this.stencilRef), this.stencilFuncMask !== 255 && (n.stencilFuncMask = this.stencilFuncMask), this.stencilFail !== xi && (n.stencilFail = this.stencilFail), this.stencilZFail !== xi && (n.stencilZFail = this.stencilZFail), this.stencilZPass !== xi && (n.stencilZPass = this.stencilZPass), this.stencilWrite === true && (n.stencilWrite = this.stencilWrite), this.rotation !== void 0 && this.rotation !== 0 && (n.rotation = this.rotation), this.polygonOffset === true && (n.polygonOffset = true), this.polygonOffsetFactor !== 0 && (n.polygonOffsetFactor = this.polygonOffsetFactor), this.polygonOffsetUnits !== 0 && (n.polygonOffsetUnits = this.polygonOffsetUnits), this.linewidth !== void 0 && this.linewidth !== 1 && (n.linewidth = this.linewidth), this.dashSize !== void 0 && (n.dashSize = this.dashSize), this.gapSize !== void 0 && (n.gapSize = this.gapSize), this.scale !== void 0 && (n.scale = this.scale), this.dithering === true && (n.dithering = true), this.alphaTest > 0 && (n.alphaTest = this.alphaTest), this.alphaHash === true && (n.alphaHash = true), this.alphaToCoverage === true && (n.alphaToCoverage = true), this.premultipliedAlpha === true && (n.premultipliedAlpha = true), this.forceSinglePass === true && (n.forceSinglePass = true), this.wireframe === true && (n.wireframe = true), this.wireframeLinewidth > 1 && (n.wireframeLinewidth = this.wireframeLinewidth), this.wireframeLinecap !== "round" && (n.wireframeLinecap = this.wireframeLinecap), this.wireframeLinejoin !== "round" && (n.wireframeLinejoin = this.wireframeLinejoin), this.flatShading === true && (n.flatShading = true), this.visible === false && (n.visible = false), this.toneMapped === false && (n.toneMapped = false), this.fog === false && (n.fog = false), Object.keys(this.userData).length > 0 && (n.userData = this.userData);
      function i(r) {
        const o = [];
        for (const a in r) {
          const c = r[a];
          delete c.metadata, o.push(c);
        }
        return o;
      }
      if (t) {
        const r = i(e.textures), o = i(e.images);
        r.length > 0 && (n.textures = r), o.length > 0 && (n.images = o);
      }
      return n;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e) {
      this.name = e.name, this.blending = e.blending, this.side = e.side, this.vertexColors = e.vertexColors, this.opacity = e.opacity, this.transparent = e.transparent, this.blendSrc = e.blendSrc, this.blendDst = e.blendDst, this.blendEquation = e.blendEquation, this.blendSrcAlpha = e.blendSrcAlpha, this.blendDstAlpha = e.blendDstAlpha, this.blendEquationAlpha = e.blendEquationAlpha, this.blendColor.copy(e.blendColor), this.blendAlpha = e.blendAlpha, this.depthFunc = e.depthFunc, this.depthTest = e.depthTest, this.depthWrite = e.depthWrite, this.stencilWriteMask = e.stencilWriteMask, this.stencilFunc = e.stencilFunc, this.stencilRef = e.stencilRef, this.stencilFuncMask = e.stencilFuncMask, this.stencilFail = e.stencilFail, this.stencilZFail = e.stencilZFail, this.stencilZPass = e.stencilZPass, this.stencilWrite = e.stencilWrite;
      const t = e.clippingPlanes;
      let n = null;
      if (t !== null) {
        const i = t.length;
        n = new Array(i);
        for (let r = 0; r !== i; ++r) n[r] = t[r].clone();
      }
      return this.clippingPlanes = n, this.clipIntersection = e.clipIntersection, this.clipShadows = e.clipShadows, this.shadowSide = e.shadowSide, this.colorWrite = e.colorWrite, this.precision = e.precision, this.polygonOffset = e.polygonOffset, this.polygonOffsetFactor = e.polygonOffsetFactor, this.polygonOffsetUnits = e.polygonOffsetUnits, this.dithering = e.dithering, this.alphaTest = e.alphaTest, this.alphaHash = e.alphaHash, this.alphaToCoverage = e.alphaToCoverage, this.premultipliedAlpha = e.premultipliedAlpha, this.forceSinglePass = e.forceSinglePass, this.visible = e.visible, this.toneMapped = e.toneMapped, this.userData = JSON.parse(JSON.stringify(e.userData)), this;
    }
    dispose() {
      this.dispatchEvent({
        type: "dispose"
      });
    }
    set needsUpdate(e) {
      e === true && this.version++;
    }
    onBuild() {
      console.warn("Material: onBuild() has been removed.");
    }
  }
  class Zt extends cn {
    constructor(e) {
      super(), this.isMeshBasicMaterial = true, this.type = "MeshBasicMaterial", this.color = new Se(16777215), this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new un(), this.combine = oh, this.reflectivity = 1, this.refractionRatio = 0.98, this.wireframe = false, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.fog = true, this.setValues(e);
    }
    copy(e) {
      return super.copy(e), this.color.copy(e.color), this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.specularMap = e.specularMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.envMapRotation.copy(e.envMapRotation), this.combine = e.combine, this.reflectivity = e.reflectivity, this.refractionRatio = e.refractionRatio, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.fog = e.fog, this;
    }
  }
  const ft = new R(), tr = new ye();
  class vt {
    constructor(e, t, n = false) {
      if (Array.isArray(e)) throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");
      this.isBufferAttribute = true, this.name = "", this.array = e, this.itemSize = t, this.count = e !== void 0 ? e.length / t : 0, this.normalized = n, this.usage = Ba, this.updateRanges = [], this.gpuType = on, this.version = 0;
    }
    onUploadCallback() {
    }
    set needsUpdate(e) {
      e === true && this.version++;
    }
    setUsage(e) {
      return this.usage = e, this;
    }
    addUpdateRange(e, t) {
      this.updateRanges.push({
        start: e,
        count: t
      });
    }
    clearUpdateRanges() {
      this.updateRanges.length = 0;
    }
    copy(e) {
      return this.name = e.name, this.array = new e.array.constructor(e.array), this.itemSize = e.itemSize, this.count = e.count, this.normalized = e.normalized, this.usage = e.usage, this.gpuType = e.gpuType, this;
    }
    copyAt(e, t, n) {
      e *= this.itemSize, n *= t.itemSize;
      for (let i = 0, r = this.itemSize; i < r; i++) this.array[e + i] = t.array[n + i];
      return this;
    }
    copyArray(e) {
      return this.array.set(e), this;
    }
    applyMatrix3(e) {
      if (this.itemSize === 2) for (let t = 0, n = this.count; t < n; t++) tr.fromBufferAttribute(this, t), tr.applyMatrix3(e), this.setXY(t, tr.x, tr.y);
      else if (this.itemSize === 3) for (let t = 0, n = this.count; t < n; t++) ft.fromBufferAttribute(this, t), ft.applyMatrix3(e), this.setXYZ(t, ft.x, ft.y, ft.z);
      return this;
    }
    applyMatrix4(e) {
      for (let t = 0, n = this.count; t < n; t++) ft.fromBufferAttribute(this, t), ft.applyMatrix4(e), this.setXYZ(t, ft.x, ft.y, ft.z);
      return this;
    }
    applyNormalMatrix(e) {
      for (let t = 0, n = this.count; t < n; t++) ft.fromBufferAttribute(this, t), ft.applyNormalMatrix(e), this.setXYZ(t, ft.x, ft.y, ft.z);
      return this;
    }
    transformDirection(e) {
      for (let t = 0, n = this.count; t < n; t++) ft.fromBufferAttribute(this, t), ft.transformDirection(e), this.setXYZ(t, ft.x, ft.y, ft.z);
      return this;
    }
    set(e, t = 0) {
      return this.array.set(e, t), this;
    }
    getComponent(e, t) {
      let n = this.array[e * this.itemSize + t];
      return this.normalized && (n = rn(n, this.array)), n;
    }
    setComponent(e, t, n) {
      return this.normalized && (n = Je(n, this.array)), this.array[e * this.itemSize + t] = n, this;
    }
    getX(e) {
      let t = this.array[e * this.itemSize];
      return this.normalized && (t = rn(t, this.array)), t;
    }
    setX(e, t) {
      return this.normalized && (t = Je(t, this.array)), this.array[e * this.itemSize] = t, this;
    }
    getY(e) {
      let t = this.array[e * this.itemSize + 1];
      return this.normalized && (t = rn(t, this.array)), t;
    }
    setY(e, t) {
      return this.normalized && (t = Je(t, this.array)), this.array[e * this.itemSize + 1] = t, this;
    }
    getZ(e) {
      let t = this.array[e * this.itemSize + 2];
      return this.normalized && (t = rn(t, this.array)), t;
    }
    setZ(e, t) {
      return this.normalized && (t = Je(t, this.array)), this.array[e * this.itemSize + 2] = t, this;
    }
    getW(e) {
      let t = this.array[e * this.itemSize + 3];
      return this.normalized && (t = rn(t, this.array)), t;
    }
    setW(e, t) {
      return this.normalized && (t = Je(t, this.array)), this.array[e * this.itemSize + 3] = t, this;
    }
    setXY(e, t, n) {
      return e *= this.itemSize, this.normalized && (t = Je(t, this.array), n = Je(n, this.array)), this.array[e + 0] = t, this.array[e + 1] = n, this;
    }
    setXYZ(e, t, n, i) {
      return e *= this.itemSize, this.normalized && (t = Je(t, this.array), n = Je(n, this.array), i = Je(i, this.array)), this.array[e + 0] = t, this.array[e + 1] = n, this.array[e + 2] = i, this;
    }
    setXYZW(e, t, n, i, r) {
      return e *= this.itemSize, this.normalized && (t = Je(t, this.array), n = Je(n, this.array), i = Je(i, this.array), r = Je(r, this.array)), this.array[e + 0] = t, this.array[e + 1] = n, this.array[e + 2] = i, this.array[e + 3] = r, this;
    }
    onUpload(e) {
      return this.onUploadCallback = e, this;
    }
    clone() {
      return new this.constructor(this.array, this.itemSize).copy(this);
    }
    toJSON() {
      const e = {
        itemSize: this.itemSize,
        type: this.array.constructor.name,
        array: Array.from(this.array),
        normalized: this.normalized
      };
      return this.name !== "" && (e.name = this.name), this.usage !== Ba && (e.usage = this.usage), e;
    }
  }
  class wh extends vt {
    constructor(e, t, n) {
      super(new Uint16Array(e), t, n);
    }
  }
  class Rh extends vt {
    constructor(e, t, n) {
      super(new Uint32Array(e), t, n);
    }
  }
  class at extends vt {
    constructor(e, t, n) {
      super(new Float32Array(e), t, n);
    }
  }
  let Od = 0;
  const Gt = new Ce(), Co = new ot(), Ri = new R(), kt = new dn(), gs = new dn(), xt = new R();
  class yt extends Jn {
    constructor() {
      super(), this.isBufferGeometry = true, Object.defineProperty(this, "id", {
        value: Od++
      }), this.uuid = an(), this.name = "", this.type = "BufferGeometry", this.index = null, this.attributes = {}, this.morphAttributes = {}, this.morphTargetsRelative = false, this.groups = [], this.boundingBox = null, this.boundingSphere = null, this.drawRange = {
        start: 0,
        count: 1 / 0
      }, this.userData = {};
    }
    getIndex() {
      return this.index;
    }
    setIndex(e) {
      return Array.isArray(e) ? this.index = new (Sh(e) ? Rh : wh)(e, 1) : this.index = e, this;
    }
    getAttribute(e) {
      return this.attributes[e];
    }
    setAttribute(e, t) {
      return this.attributes[e] = t, this;
    }
    deleteAttribute(e) {
      return delete this.attributes[e], this;
    }
    hasAttribute(e) {
      return this.attributes[e] !== void 0;
    }
    addGroup(e, t, n = 0) {
      this.groups.push({
        start: e,
        count: t,
        materialIndex: n
      });
    }
    clearGroups() {
      this.groups = [];
    }
    setDrawRange(e, t) {
      this.drawRange.start = e, this.drawRange.count = t;
    }
    applyMatrix4(e) {
      const t = this.attributes.position;
      t !== void 0 && (t.applyMatrix4(e), t.needsUpdate = true);
      const n = this.attributes.normal;
      if (n !== void 0) {
        const r = new De().getNormalMatrix(e);
        n.applyNormalMatrix(r), n.needsUpdate = true;
      }
      const i = this.attributes.tangent;
      return i !== void 0 && (i.transformDirection(e), i.needsUpdate = true), this.boundingBox !== null && this.computeBoundingBox(), this.boundingSphere !== null && this.computeBoundingSphere(), this;
    }
    applyQuaternion(e) {
      return Gt.makeRotationFromQuaternion(e), this.applyMatrix4(Gt), this;
    }
    rotateX(e) {
      return Gt.makeRotationX(e), this.applyMatrix4(Gt), this;
    }
    rotateY(e) {
      return Gt.makeRotationY(e), this.applyMatrix4(Gt), this;
    }
    rotateZ(e) {
      return Gt.makeRotationZ(e), this.applyMatrix4(Gt), this;
    }
    translate(e, t, n) {
      return Gt.makeTranslation(e, t, n), this.applyMatrix4(Gt), this;
    }
    scale(e, t, n) {
      return Gt.makeScale(e, t, n), this.applyMatrix4(Gt), this;
    }
    lookAt(e) {
      return Co.lookAt(e), Co.updateMatrix(), this.applyMatrix4(Co.matrix), this;
    }
    center() {
      return this.computeBoundingBox(), this.boundingBox.getCenter(Ri).negate(), this.translate(Ri.x, Ri.y, Ri.z), this;
    }
    setFromPoints(e) {
      const t = [];
      for (let n = 0, i = e.length; n < i; n++) {
        const r = e[n];
        t.push(r.x, r.y, r.z || 0);
      }
      return this.setAttribute("position", new at(t, 3)), this;
    }
    computeBoundingBox() {
      this.boundingBox === null && (this.boundingBox = new dn());
      const e = this.attributes.position, t = this.morphAttributes.position;
      if (e && e.isGLBufferAttribute) {
        console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.", this), this.boundingBox.set(new R(-1 / 0, -1 / 0, -1 / 0), new R(1 / 0, 1 / 0, 1 / 0));
        return;
      }
      if (e !== void 0) {
        if (this.boundingBox.setFromBufferAttribute(e), t) for (let n = 0, i = t.length; n < i; n++) {
          const r = t[n];
          kt.setFromBufferAttribute(r), this.morphTargetsRelative ? (xt.addVectors(this.boundingBox.min, kt.min), this.boundingBox.expandByPoint(xt), xt.addVectors(this.boundingBox.max, kt.max), this.boundingBox.expandByPoint(xt)) : (this.boundingBox.expandByPoint(kt.min), this.boundingBox.expandByPoint(kt.max));
        }
      } else this.boundingBox.makeEmpty();
      (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) && console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);
    }
    computeBoundingSphere() {
      this.boundingSphere === null && (this.boundingSphere = new fn());
      const e = this.attributes.position, t = this.morphAttributes.position;
      if (e && e.isGLBufferAttribute) {
        console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.", this), this.boundingSphere.set(new R(), 1 / 0);
        return;
      }
      if (e) {
        const n = this.boundingSphere.center;
        if (kt.setFromBufferAttribute(e), t) for (let r = 0, o = t.length; r < o; r++) {
          const a = t[r];
          gs.setFromBufferAttribute(a), this.morphTargetsRelative ? (xt.addVectors(kt.min, gs.min), kt.expandByPoint(xt), xt.addVectors(kt.max, gs.max), kt.expandByPoint(xt)) : (kt.expandByPoint(gs.min), kt.expandByPoint(gs.max));
        }
        kt.getCenter(n);
        let i = 0;
        for (let r = 0, o = e.count; r < o; r++) xt.fromBufferAttribute(e, r), i = Math.max(i, n.distanceToSquared(xt));
        if (t) for (let r = 0, o = t.length; r < o; r++) {
          const a = t[r], c = this.morphTargetsRelative;
          for (let l = 0, h = a.count; l < h; l++) xt.fromBufferAttribute(a, l), c && (Ri.fromBufferAttribute(e, l), xt.add(Ri)), i = Math.max(i, n.distanceToSquared(xt));
        }
        this.boundingSphere.radius = Math.sqrt(i), isNaN(this.boundingSphere.radius) && console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this);
      }
    }
    computeTangents() {
      const e = this.index, t = this.attributes;
      if (e === null || t.position === void 0 || t.normal === void 0 || t.uv === void 0) {
        console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");
        return;
      }
      const n = t.position, i = t.normal, r = t.uv;
      this.hasAttribute("tangent") === false && this.setAttribute("tangent", new vt(new Float32Array(4 * n.count), 4));
      const o = this.getAttribute("tangent"), a = [], c = [];
      for (let U = 0; U < n.count; U++) a[U] = new R(), c[U] = new R();
      const l = new R(), h = new R(), u = new R(), d = new ye(), f = new ye(), g = new ye(), _ = new R(), m = new R();
      function p(U, j, x) {
        l.fromBufferAttribute(n, U), h.fromBufferAttribute(n, j), u.fromBufferAttribute(n, x), d.fromBufferAttribute(r, U), f.fromBufferAttribute(r, j), g.fromBufferAttribute(r, x), h.sub(l), u.sub(l), f.sub(d), g.sub(d);
        const S = 1 / (f.x * g.y - g.x * f.y);
        isFinite(S) && (_.copy(h).multiplyScalar(g.y).addScaledVector(u, -f.y).multiplyScalar(S), m.copy(u).multiplyScalar(f.x).addScaledVector(h, -g.x).multiplyScalar(S), a[U].add(_), a[j].add(_), a[x].add(_), c[U].add(m), c[j].add(m), c[x].add(m));
      }
      let E = this.groups;
      E.length === 0 && (E = [
        {
          start: 0,
          count: e.count
        }
      ]);
      for (let U = 0, j = E.length; U < j; ++U) {
        const x = E[U], S = x.start, k = x.count;
        for (let B = S, H = S + k; B < H; B += 3) p(e.getX(B + 0), e.getX(B + 1), e.getX(B + 2));
      }
      const M = new R(), b = new R(), I = new R(), A = new R();
      function w(U) {
        I.fromBufferAttribute(i, U), A.copy(I);
        const j = a[U];
        M.copy(j), M.sub(I.multiplyScalar(I.dot(j))).normalize(), b.crossVectors(A, j);
        const S = b.dot(c[U]) < 0 ? -1 : 1;
        o.setXYZW(U, M.x, M.y, M.z, S);
      }
      for (let U = 0, j = E.length; U < j; ++U) {
        const x = E[U], S = x.start, k = x.count;
        for (let B = S, H = S + k; B < H; B += 3) w(e.getX(B + 0)), w(e.getX(B + 1)), w(e.getX(B + 2));
      }
    }
    computeVertexNormals() {
      const e = this.index, t = this.getAttribute("position");
      if (t !== void 0) {
        let n = this.getAttribute("normal");
        if (n === void 0) n = new vt(new Float32Array(t.count * 3), 3), this.setAttribute("normal", n);
        else for (let d = 0, f = n.count; d < f; d++) n.setXYZ(d, 0, 0, 0);
        const i = new R(), r = new R(), o = new R(), a = new R(), c = new R(), l = new R(), h = new R(), u = new R();
        if (e) for (let d = 0, f = e.count; d < f; d += 3) {
          const g = e.getX(d + 0), _ = e.getX(d + 1), m = e.getX(d + 2);
          i.fromBufferAttribute(t, g), r.fromBufferAttribute(t, _), o.fromBufferAttribute(t, m), h.subVectors(o, r), u.subVectors(i, r), h.cross(u), a.fromBufferAttribute(n, g), c.fromBufferAttribute(n, _), l.fromBufferAttribute(n, m), a.add(h), c.add(h), l.add(h), n.setXYZ(g, a.x, a.y, a.z), n.setXYZ(_, c.x, c.y, c.z), n.setXYZ(m, l.x, l.y, l.z);
        }
        else for (let d = 0, f = t.count; d < f; d += 3) i.fromBufferAttribute(t, d + 0), r.fromBufferAttribute(t, d + 1), o.fromBufferAttribute(t, d + 2), h.subVectors(o, r), u.subVectors(i, r), h.cross(u), n.setXYZ(d + 0, h.x, h.y, h.z), n.setXYZ(d + 1, h.x, h.y, h.z), n.setXYZ(d + 2, h.x, h.y, h.z);
        this.normalizeNormals(), n.needsUpdate = true;
      }
    }
    normalizeNormals() {
      const e = this.attributes.normal;
      for (let t = 0, n = e.count; t < n; t++) xt.fromBufferAttribute(e, t), xt.normalize(), e.setXYZ(t, xt.x, xt.y, xt.z);
    }
    toNonIndexed() {
      function e(a, c) {
        const l = a.array, h = a.itemSize, u = a.normalized, d = new l.constructor(c.length * h);
        let f = 0, g = 0;
        for (let _ = 0, m = c.length; _ < m; _++) {
          a.isInterleavedBufferAttribute ? f = c[_] * a.data.stride + a.offset : f = c[_] * h;
          for (let p = 0; p < h; p++) d[g++] = l[f++];
        }
        return new vt(d, h, u);
      }
      if (this.index === null) return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."), this;
      const t = new yt(), n = this.index.array, i = this.attributes;
      for (const a in i) {
        const c = i[a], l = e(c, n);
        t.setAttribute(a, l);
      }
      const r = this.morphAttributes;
      for (const a in r) {
        const c = [], l = r[a];
        for (let h = 0, u = l.length; h < u; h++) {
          const d = l[h], f = e(d, n);
          c.push(f);
        }
        t.morphAttributes[a] = c;
      }
      t.morphTargetsRelative = this.morphTargetsRelative;
      const o = this.groups;
      for (let a = 0, c = o.length; a < c; a++) {
        const l = o[a];
        t.addGroup(l.start, l.count, l.materialIndex);
      }
      return t;
    }
    toJSON() {
      const e = {
        metadata: {
          version: 4.6,
          type: "BufferGeometry",
          generator: "BufferGeometry.toJSON"
        }
      };
      if (e.uuid = this.uuid, e.type = this.type, this.name !== "" && (e.name = this.name), Object.keys(this.userData).length > 0 && (e.userData = this.userData), this.parameters !== void 0) {
        const c = this.parameters;
        for (const l in c) c[l] !== void 0 && (e[l] = c[l]);
        return e;
      }
      e.data = {
        attributes: {}
      };
      const t = this.index;
      t !== null && (e.data.index = {
        type: t.array.constructor.name,
        array: Array.prototype.slice.call(t.array)
      });
      const n = this.attributes;
      for (const c in n) {
        const l = n[c];
        e.data.attributes[c] = l.toJSON(e.data);
      }
      const i = {};
      let r = false;
      for (const c in this.morphAttributes) {
        const l = this.morphAttributes[c], h = [];
        for (let u = 0, d = l.length; u < d; u++) {
          const f = l[u];
          h.push(f.toJSON(e.data));
        }
        h.length > 0 && (i[c] = h, r = true);
      }
      r && (e.data.morphAttributes = i, e.data.morphTargetsRelative = this.morphTargetsRelative);
      const o = this.groups;
      o.length > 0 && (e.data.groups = JSON.parse(JSON.stringify(o)));
      const a = this.boundingSphere;
      return a !== null && (e.data.boundingSphere = {
        center: a.center.toArray(),
        radius: a.radius
      }), e;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e) {
      this.index = null, this.attributes = {}, this.morphAttributes = {}, this.groups = [], this.boundingBox = null, this.boundingSphere = null;
      const t = {};
      this.name = e.name;
      const n = e.index;
      n !== null && this.setIndex(n.clone(t));
      const i = e.attributes;
      for (const l in i) {
        const h = i[l];
        this.setAttribute(l, h.clone(t));
      }
      const r = e.morphAttributes;
      for (const l in r) {
        const h = [], u = r[l];
        for (let d = 0, f = u.length; d < f; d++) h.push(u[d].clone(t));
        this.morphAttributes[l] = h;
      }
      this.morphTargetsRelative = e.morphTargetsRelative;
      const o = e.groups;
      for (let l = 0, h = o.length; l < h; l++) {
        const u = o[l];
        this.addGroup(u.start, u.count, u.materialIndex);
      }
      const a = e.boundingBox;
      a !== null && (this.boundingBox = a.clone());
      const c = e.boundingSphere;
      return c !== null && (this.boundingSphere = c.clone()), this.drawRange.start = e.drawRange.start, this.drawRange.count = e.drawRange.count, this.userData = e.userData, this;
    }
    dispose() {
      this.dispatchEvent({
        type: "dispose"
      });
    }
  }
  const qc = new Ce(), ni = new Hs(), nr = new fn(), jc = new R(), ir = new R(), sr = new R(), rr = new R(), Po = new R(), or = new R(), Kc = new R(), ar = new R();
  class tt extends ot {
    constructor(e = new yt(), t = new Zt()) {
      super(), this.isMesh = true, this.type = "Mesh", this.geometry = e, this.material = t, this.updateMorphTargets();
    }
    copy(e, t) {
      return super.copy(e, t), e.morphTargetInfluences !== void 0 && (this.morphTargetInfluences = e.morphTargetInfluences.slice()), e.morphTargetDictionary !== void 0 && (this.morphTargetDictionary = Object.assign({}, e.morphTargetDictionary)), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
    }
    updateMorphTargets() {
      const t = this.geometry.morphAttributes, n = Object.keys(t);
      if (n.length > 0) {
        const i = t[n[0]];
        if (i !== void 0) {
          this.morphTargetInfluences = [], this.morphTargetDictionary = {};
          for (let r = 0, o = i.length; r < o; r++) {
            const a = i[r].name || String(r);
            this.morphTargetInfluences.push(0), this.morphTargetDictionary[a] = r;
          }
        }
      }
    }
    getVertexPosition(e, t) {
      const n = this.geometry, i = n.attributes.position, r = n.morphAttributes.position, o = n.morphTargetsRelative;
      t.fromBufferAttribute(i, e);
      const a = this.morphTargetInfluences;
      if (r && a) {
        or.set(0, 0, 0);
        for (let c = 0, l = r.length; c < l; c++) {
          const h = a[c], u = r[c];
          h !== 0 && (Po.fromBufferAttribute(u, e), o ? or.addScaledVector(Po, h) : or.addScaledVector(Po.sub(t), h));
        }
        t.add(or);
      }
      return t;
    }
    raycast(e, t) {
      const n = this.geometry, i = this.material, r = this.matrixWorld;
      i !== void 0 && (n.boundingSphere === null && n.computeBoundingSphere(), nr.copy(n.boundingSphere), nr.applyMatrix4(r), ni.copy(e.ray).recast(e.near), !(nr.containsPoint(ni.origin) === false && (ni.intersectSphere(nr, jc) === null || ni.origin.distanceToSquared(jc) > (e.far - e.near) ** 2)) && (qc.copy(r).invert(), ni.copy(e.ray).applyMatrix4(qc), !(n.boundingBox !== null && ni.intersectsBox(n.boundingBox) === false) && this._computeIntersections(e, t, ni)));
    }
    _computeIntersections(e, t, n) {
      let i;
      const r = this.geometry, o = this.material, a = r.index, c = r.attributes.position, l = r.attributes.uv, h = r.attributes.uv1, u = r.attributes.normal, d = r.groups, f = r.drawRange;
      if (a !== null) if (Array.isArray(o)) for (let g = 0, _ = d.length; g < _; g++) {
        const m = d[g], p = o[m.materialIndex], E = Math.max(m.start, f.start), M = Math.min(a.count, Math.min(m.start + m.count, f.start + f.count));
        for (let b = E, I = M; b < I; b += 3) {
          const A = a.getX(b), w = a.getX(b + 1), U = a.getX(b + 2);
          i = cr(this, p, e, n, l, h, u, A, w, U), i && (i.faceIndex = Math.floor(b / 3), i.face.materialIndex = m.materialIndex, t.push(i));
        }
      }
      else {
        const g = Math.max(0, f.start), _ = Math.min(a.count, f.start + f.count);
        for (let m = g, p = _; m < p; m += 3) {
          const E = a.getX(m), M = a.getX(m + 1), b = a.getX(m + 2);
          i = cr(this, o, e, n, l, h, u, E, M, b), i && (i.faceIndex = Math.floor(m / 3), t.push(i));
        }
      }
      else if (c !== void 0) if (Array.isArray(o)) for (let g = 0, _ = d.length; g < _; g++) {
        const m = d[g], p = o[m.materialIndex], E = Math.max(m.start, f.start), M = Math.min(c.count, Math.min(m.start + m.count, f.start + f.count));
        for (let b = E, I = M; b < I; b += 3) {
          const A = b, w = b + 1, U = b + 2;
          i = cr(this, p, e, n, l, h, u, A, w, U), i && (i.faceIndex = Math.floor(b / 3), i.face.materialIndex = m.materialIndex, t.push(i));
        }
      }
      else {
        const g = Math.max(0, f.start), _ = Math.min(c.count, f.start + f.count);
        for (let m = g, p = _; m < p; m += 3) {
          const E = m, M = m + 1, b = m + 2;
          i = cr(this, o, e, n, l, h, u, E, M, b), i && (i.faceIndex = Math.floor(m / 3), t.push(i));
        }
      }
    }
  }
  function Bd(s, e, t, n, i, r, o, a) {
    let c;
    if (e.side === Ut ? c = n.intersectTriangle(o, r, i, true, a) : c = n.intersectTriangle(i, r, o, e.side === Pn, a), c === null) return null;
    ar.copy(a), ar.applyMatrix4(s.matrixWorld);
    const l = t.ray.origin.distanceTo(ar);
    return l < t.near || l > t.far ? null : {
      distance: l,
      point: ar.clone(),
      object: s
    };
  }
  function cr(s, e, t, n, i, r, o, a, c, l) {
    s.getVertexPosition(a, ir), s.getVertexPosition(c, sr), s.getVertexPosition(l, rr);
    const h = Bd(s, e, t, n, ir, sr, rr, Kc);
    if (h) {
      const u = new R();
      qt.getBarycoord(Kc, ir, sr, rr, u), i && (h.uv = qt.getInterpolatedAttribute(i, a, c, l, u, new ye())), r && (h.uv1 = qt.getInterpolatedAttribute(r, a, c, l, u, new ye())), o && (h.normal = qt.getInterpolatedAttribute(o, a, c, l, u, new R()), h.normal.dot(n.direction) > 0 && h.normal.multiplyScalar(-1));
      const d = {
        a,
        b: c,
        c: l,
        normal: new R(),
        materialIndex: 0
      };
      qt.getNormal(ir, sr, rr, d.normal), h.face = d, h.barycoord = u;
    }
    return h;
  }
  class Vs extends yt {
    constructor(e = 1, t = 1, n = 1, i = 1, r = 1, o = 1) {
      super(), this.type = "BoxGeometry", this.parameters = {
        width: e,
        height: t,
        depth: n,
        widthSegments: i,
        heightSegments: r,
        depthSegments: o
      };
      const a = this;
      i = Math.floor(i), r = Math.floor(r), o = Math.floor(o);
      const c = [], l = [], h = [], u = [];
      let d = 0, f = 0;
      g("z", "y", "x", -1, -1, n, t, e, o, r, 0), g("z", "y", "x", 1, -1, n, t, -e, o, r, 1), g("x", "z", "y", 1, 1, e, n, t, i, o, 2), g("x", "z", "y", 1, -1, e, n, -t, i, o, 3), g("x", "y", "z", 1, -1, e, t, n, i, r, 4), g("x", "y", "z", -1, -1, e, t, -n, i, r, 5), this.setIndex(c), this.setAttribute("position", new at(l, 3)), this.setAttribute("normal", new at(h, 3)), this.setAttribute("uv", new at(u, 2));
      function g(_, m, p, E, M, b, I, A, w, U, j) {
        const x = b / w, S = I / U, k = b / 2, B = I / 2, H = A / 2, K = w + 1, z = U + 1;
        let Q = 0, G = 0;
        const ae = new R();
        for (let ce = 0; ce < z; ce++) {
          const ge = ce * S - B;
          for (let We = 0; We < K; We++) {
            const $e = We * x - k;
            ae[_] = $e * E, ae[m] = ge * M, ae[p] = H, l.push(ae.x, ae.y, ae.z), ae[_] = 0, ae[m] = 0, ae[p] = A > 0 ? 1 : -1, h.push(ae.x, ae.y, ae.z), u.push(We / w), u.push(1 - ce / U), Q += 1;
          }
        }
        for (let ce = 0; ce < U; ce++) for (let ge = 0; ge < w; ge++) {
          const We = d + ge + K * ce, $e = d + ge + K * (ce + 1), W = d + (ge + 1) + K * (ce + 1), Z = d + (ge + 1) + K * ce;
          c.push(We, $e, Z), c.push($e, W, Z), G += 6;
        }
        a.addGroup(f, G, j), f += G, d += Q;
      }
    }
    copy(e) {
      return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
    }
    static fromJSON(e) {
      return new Vs(e.width, e.height, e.depth, e.widthSegments, e.heightSegments, e.depthSegments);
    }
  }
  function is(s) {
    const e = {};
    for (const t in s) {
      e[t] = {};
      for (const n in s[t]) {
        const i = s[t][n];
        i && (i.isColor || i.isMatrix3 || i.isMatrix4 || i.isVector2 || i.isVector3 || i.isVector4 || i.isTexture || i.isQuaternion) ? i.isRenderTargetTexture ? (console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."), e[t][n] = null) : e[t][n] = i.clone() : Array.isArray(i) ? e[t][n] = i.slice() : e[t][n] = i;
      }
    }
    return e;
  }
  function wt(s) {
    const e = {};
    for (let t = 0; t < s.length; t++) {
      const n = is(s[t]);
      for (const i in n) e[i] = n[i];
    }
    return e;
  }
  function kd(s) {
    const e = [];
    for (let t = 0; t < s.length; t++) e.push(s[t].clone());
    return e;
  }
  function Ch(s) {
    const e = s.getRenderTarget();
    return e === null ? s.outputColorSpace : e.isXRRenderTarget === true ? e.texture.colorSpace : Ge.workingColorSpace;
  }
  const zd = {
    clone: is,
    merge: wt
  };
  var Hd = `void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`, Vd = `void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;
  class Zn extends cn {
    constructor(e) {
      super(), this.isShaderMaterial = true, this.type = "ShaderMaterial", this.defines = {}, this.uniforms = {}, this.uniformsGroups = [], this.vertexShader = Hd, this.fragmentShader = Vd, this.linewidth = 1, this.wireframe = false, this.wireframeLinewidth = 1, this.fog = false, this.lights = false, this.clipping = false, this.forceSinglePass = true, this.extensions = {
        clipCullDistance: false,
        multiDraw: false
      }, this.defaultAttributeValues = {
        color: [
          1,
          1,
          1
        ],
        uv: [
          0,
          0
        ],
        uv1: [
          0,
          0
        ]
      }, this.index0AttributeName = void 0, this.uniformsNeedUpdate = false, this.glslVersion = null, e !== void 0 && this.setValues(e);
    }
    copy(e) {
      return super.copy(e), this.fragmentShader = e.fragmentShader, this.vertexShader = e.vertexShader, this.uniforms = is(e.uniforms), this.uniformsGroups = kd(e.uniformsGroups), this.defines = Object.assign({}, e.defines), this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.fog = e.fog, this.lights = e.lights, this.clipping = e.clipping, this.extensions = Object.assign({}, e.extensions), this.glslVersion = e.glslVersion, this;
    }
    toJSON(e) {
      const t = super.toJSON(e);
      t.glslVersion = this.glslVersion, t.uniforms = {};
      for (const i in this.uniforms) {
        const o = this.uniforms[i].value;
        o && o.isTexture ? t.uniforms[i] = {
          type: "t",
          value: o.toJSON(e).uuid
        } : o && o.isColor ? t.uniforms[i] = {
          type: "c",
          value: o.getHex()
        } : o && o.isVector2 ? t.uniforms[i] = {
          type: "v2",
          value: o.toArray()
        } : o && o.isVector3 ? t.uniforms[i] = {
          type: "v3",
          value: o.toArray()
        } : o && o.isVector4 ? t.uniforms[i] = {
          type: "v4",
          value: o.toArray()
        } : o && o.isMatrix3 ? t.uniforms[i] = {
          type: "m3",
          value: o.toArray()
        } : o && o.isMatrix4 ? t.uniforms[i] = {
          type: "m4",
          value: o.toArray()
        } : t.uniforms[i] = {
          value: o
        };
      }
      Object.keys(this.defines).length > 0 && (t.defines = this.defines), t.vertexShader = this.vertexShader, t.fragmentShader = this.fragmentShader, t.lights = this.lights, t.clipping = this.clipping;
      const n = {};
      for (const i in this.extensions) this.extensions[i] === true && (n[i] = true);
      return Object.keys(n).length > 0 && (t.extensions = n), t;
    }
  }
  class Ph extends ot {
    constructor() {
      super(), this.isCamera = true, this.type = "Camera", this.matrixWorldInverse = new Ce(), this.projectionMatrix = new Ce(), this.projectionMatrixInverse = new Ce(), this.coordinateSystem = Rn;
    }
    copy(e, t) {
      return super.copy(e, t), this.matrixWorldInverse.copy(e.matrixWorldInverse), this.projectionMatrix.copy(e.projectionMatrix), this.projectionMatrixInverse.copy(e.projectionMatrixInverse), this.coordinateSystem = e.coordinateSystem, this;
    }
    getWorldDirection(e) {
      return super.getWorldDirection(e).negate();
    }
    updateMatrixWorld(e) {
      super.updateMatrixWorld(e), this.matrixWorldInverse.copy(this.matrixWorld).invert();
    }
    updateWorldMatrix(e, t) {
      super.updateWorldMatrix(e, t), this.matrixWorldInverse.copy(this.matrixWorld).invert();
    }
    clone() {
      return new this.constructor().copy(this);
    }
  }
  const kn = new R(), $c = new ye(), Zc = new ye();
  class Ct extends Ph {
    constructor(e = 50, t = 1, n = 0.1, i = 2e3) {
      super(), this.isPerspectiveCamera = true, this.type = "PerspectiveCamera", this.fov = e, this.zoom = 1, this.near = n, this.far = i, this.focus = 10, this.aspect = t, this.view = null, this.filmGauge = 35, this.filmOffset = 0, this.updateProjectionMatrix();
    }
    copy(e, t) {
      return super.copy(e, t), this.fov = e.fov, this.zoom = e.zoom, this.near = e.near, this.far = e.far, this.focus = e.focus, this.aspect = e.aspect, this.view = e.view === null ? null : Object.assign({}, e.view), this.filmGauge = e.filmGauge, this.filmOffset = e.filmOffset, this;
    }
    setFocalLength(e) {
      const t = 0.5 * this.getFilmHeight() / e;
      this.fov = ns * 2 * Math.atan(t), this.updateProjectionMatrix();
    }
    getFocalLength() {
      const e = Math.tan(Cs * 0.5 * this.fov);
      return 0.5 * this.getFilmHeight() / e;
    }
    getEffectiveFOV() {
      return ns * 2 * Math.atan(Math.tan(Cs * 0.5 * this.fov) / this.zoom);
    }
    getFilmWidth() {
      return this.filmGauge * Math.min(this.aspect, 1);
    }
    getFilmHeight() {
      return this.filmGauge / Math.max(this.aspect, 1);
    }
    getViewBounds(e, t, n) {
      kn.set(-1, -1, 0.5).applyMatrix4(this.projectionMatrixInverse), t.set(kn.x, kn.y).multiplyScalar(-e / kn.z), kn.set(1, 1, 0.5).applyMatrix4(this.projectionMatrixInverse), n.set(kn.x, kn.y).multiplyScalar(-e / kn.z);
    }
    getViewSize(e, t) {
      return this.getViewBounds(e, $c, Zc), t.subVectors(Zc, $c);
    }
    setViewOffset(e, t, n, i, r, o) {
      this.aspect = e / t, this.view === null && (this.view = {
        enabled: true,
        fullWidth: 1,
        fullHeight: 1,
        offsetX: 0,
        offsetY: 0,
        width: 1,
        height: 1
      }), this.view.enabled = true, this.view.fullWidth = e, this.view.fullHeight = t, this.view.offsetX = n, this.view.offsetY = i, this.view.width = r, this.view.height = o, this.updateProjectionMatrix();
    }
    clearViewOffset() {
      this.view !== null && (this.view.enabled = false), this.updateProjectionMatrix();
    }
    updateProjectionMatrix() {
      const e = this.near;
      let t = e * Math.tan(Cs * 0.5 * this.fov) / this.zoom, n = 2 * t, i = this.aspect * n, r = -0.5 * i;
      const o = this.view;
      if (this.view !== null && this.view.enabled) {
        const c = o.fullWidth, l = o.fullHeight;
        r += o.offsetX * i / c, t -= o.offsetY * n / l, i *= o.width / c, n *= o.height / l;
      }
      const a = this.filmOffset;
      a !== 0 && (r += e * a / this.getFilmWidth()), this.projectionMatrix.makePerspective(r, r + i, t, t - n, e, this.far, this.coordinateSystem), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
    }
    toJSON(e) {
      const t = super.toJSON(e);
      return t.object.fov = this.fov, t.object.zoom = this.zoom, t.object.near = this.near, t.object.far = this.far, t.object.focus = this.focus, t.object.aspect = this.aspect, this.view !== null && (t.object.view = Object.assign({}, this.view)), t.object.filmGauge = this.filmGauge, t.object.filmOffset = this.filmOffset, t;
    }
  }
  const Ci = -90, Pi = 1;
  class Gd extends ot {
    constructor(e, t, n) {
      super(), this.type = "CubeCamera", this.renderTarget = n, this.coordinateSystem = null, this.activeMipmapLevel = 0;
      const i = new Ct(Ci, Pi, e, t);
      i.layers = this.layers, this.add(i);
      const r = new Ct(Ci, Pi, e, t);
      r.layers = this.layers, this.add(r);
      const o = new Ct(Ci, Pi, e, t);
      o.layers = this.layers, this.add(o);
      const a = new Ct(Ci, Pi, e, t);
      a.layers = this.layers, this.add(a);
      const c = new Ct(Ci, Pi, e, t);
      c.layers = this.layers, this.add(c);
      const l = new Ct(Ci, Pi, e, t);
      l.layers = this.layers, this.add(l);
    }
    updateCoordinateSystem() {
      const e = this.coordinateSystem, t = this.children.concat(), [n, i, r, o, a, c] = t;
      for (const l of t) this.remove(l);
      if (e === Rn) n.up.set(0, 1, 0), n.lookAt(1, 0, 0), i.up.set(0, 1, 0), i.lookAt(-1, 0, 0), r.up.set(0, 0, -1), r.lookAt(0, 1, 0), o.up.set(0, 0, 1), o.lookAt(0, -1, 0), a.up.set(0, 1, 0), a.lookAt(0, 0, 1), c.up.set(0, 1, 0), c.lookAt(0, 0, -1);
      else if (e === qr) n.up.set(0, -1, 0), n.lookAt(-1, 0, 0), i.up.set(0, -1, 0), i.lookAt(1, 0, 0), r.up.set(0, 0, 1), r.lookAt(0, 1, 0), o.up.set(0, 0, -1), o.lookAt(0, -1, 0), a.up.set(0, -1, 0), a.lookAt(0, 0, 1), c.up.set(0, -1, 0), c.lookAt(0, 0, -1);
      else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: " + e);
      for (const l of t) this.add(l), l.updateMatrixWorld();
    }
    update(e, t) {
      this.parent === null && this.updateMatrixWorld();
      const { renderTarget: n, activeMipmapLevel: i } = this;
      this.coordinateSystem !== e.coordinateSystem && (this.coordinateSystem = e.coordinateSystem, this.updateCoordinateSystem());
      const [r, o, a, c, l, h] = this.children, u = e.getRenderTarget(), d = e.getActiveCubeFace(), f = e.getActiveMipmapLevel(), g = e.xr.enabled;
      e.xr.enabled = false;
      const _ = n.texture.generateMipmaps;
      n.texture.generateMipmaps = false, e.setRenderTarget(n, 0, i), e.render(t, r), e.setRenderTarget(n, 1, i), e.render(t, o), e.setRenderTarget(n, 2, i), e.render(t, a), e.setRenderTarget(n, 3, i), e.render(t, c), e.setRenderTarget(n, 4, i), e.render(t, l), n.texture.generateMipmaps = _, e.setRenderTarget(n, 5, i), e.render(t, h), e.setRenderTarget(u, d, f), e.xr.enabled = g, n.texture.needsPMREMUpdate = true;
    }
  }
  class Ih extends mt {
    constructor(e, t, n, i, r, o, a, c, l, h) {
      e = e !== void 0 ? e : [], t = t !== void 0 ? t : Zi, super(e, t, n, i, r, o, a, c, l, h), this.isCubeTexture = true, this.flipY = false;
    }
    get images() {
      return this.image;
    }
    set images(e) {
      this.image = e;
    }
  }
  class Wd extends mi {
    constructor(e = 1, t = {}) {
      super(e, e, t), this.isWebGLCubeRenderTarget = true;
      const n = {
        width: e,
        height: e,
        depth: 1
      }, i = [
        n,
        n,
        n,
        n,
        n,
        n
      ];
      this.texture = new Ih(i, t.mapping, t.wrapS, t.wrapT, t.magFilter, t.minFilter, t.format, t.type, t.anisotropy, t.colorSpace), this.texture.isRenderTargetTexture = true, this.texture.generateMipmaps = t.generateMipmaps !== void 0 ? t.generateMipmaps : false, this.texture.minFilter = t.minFilter !== void 0 ? t.minFilter : zt;
    }
    fromEquirectangularTexture(e, t) {
      this.texture.type = t.type, this.texture.colorSpace = t.colorSpace, this.texture.generateMipmaps = t.generateMipmaps, this.texture.minFilter = t.minFilter, this.texture.magFilter = t.magFilter;
      const n = {
        uniforms: {
          tEquirect: {
            value: null
          }
        },
        vertexShader: `

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,
        fragmentShader: `

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`
      }, i = new Vs(5, 5, 5), r = new Zn({
        name: "CubemapFromEquirect",
        uniforms: is(n.uniforms),
        vertexShader: n.vertexShader,
        fragmentShader: n.fragmentShader,
        side: Ut,
        blending: jn
      });
      r.uniforms.tEquirect.value = t;
      const o = new tt(i, r), a = t.minFilter;
      return t.minFilter === wn && (t.minFilter = zt), new Gd(1, 10, this).update(e, o), t.minFilter = a, o.geometry.dispose(), o.material.dispose(), this;
    }
    clear(e, t, n, i) {
      const r = e.getRenderTarget();
      for (let o = 0; o < 6; o++) e.setRenderTarget(this, o), e.clear(t, n, i);
      e.setRenderTarget(r);
    }
  }
  const Io = new R(), Xd = new R(), Yd = new De();
  class Gn {
    constructor(e = new R(1, 0, 0), t = 0) {
      this.isPlane = true, this.normal = e, this.constant = t;
    }
    set(e, t) {
      return this.normal.copy(e), this.constant = t, this;
    }
    setComponents(e, t, n, i) {
      return this.normal.set(e, t, n), this.constant = i, this;
    }
    setFromNormalAndCoplanarPoint(e, t) {
      return this.normal.copy(e), this.constant = -t.dot(this.normal), this;
    }
    setFromCoplanarPoints(e, t, n) {
      const i = Io.subVectors(n, t).cross(Xd.subVectors(e, t)).normalize();
      return this.setFromNormalAndCoplanarPoint(i, e), this;
    }
    copy(e) {
      return this.normal.copy(e.normal), this.constant = e.constant, this;
    }
    normalize() {
      const e = 1 / this.normal.length();
      return this.normal.multiplyScalar(e), this.constant *= e, this;
    }
    negate() {
      return this.constant *= -1, this.normal.negate(), this;
    }
    distanceToPoint(e) {
      return this.normal.dot(e) + this.constant;
    }
    distanceToSphere(e) {
      return this.distanceToPoint(e.center) - e.radius;
    }
    projectPoint(e, t) {
      return t.copy(e).addScaledVector(this.normal, -this.distanceToPoint(e));
    }
    intersectLine(e, t) {
      const n = e.delta(Io), i = this.normal.dot(n);
      if (i === 0) return this.distanceToPoint(e.start) === 0 ? t.copy(e.start) : null;
      const r = -(e.start.dot(this.normal) + this.constant) / i;
      return r < 0 || r > 1 ? null : t.copy(e.start).addScaledVector(n, r);
    }
    intersectsLine(e) {
      const t = this.distanceToPoint(e.start), n = this.distanceToPoint(e.end);
      return t < 0 && n > 0 || n < 0 && t > 0;
    }
    intersectsBox(e) {
      return e.intersectsPlane(this);
    }
    intersectsSphere(e) {
      return e.intersectsPlane(this);
    }
    coplanarPoint(e) {
      return e.copy(this.normal).multiplyScalar(-this.constant);
    }
    applyMatrix4(e, t) {
      const n = t || Yd.getNormalMatrix(e), i = this.coplanarPoint(Io).applyMatrix4(e), r = this.normal.applyMatrix3(n).normalize();
      return this.constant = -i.dot(r), this;
    }
    translate(e) {
      return this.constant -= e.dot(this.normal), this;
    }
    equals(e) {
      return e.normal.equals(this.normal) && e.constant === this.constant;
    }
    clone() {
      return new this.constructor().copy(this);
    }
  }
  const ii = new fn(), lr = new R();
  class ic {
    constructor(e = new Gn(), t = new Gn(), n = new Gn(), i = new Gn(), r = new Gn(), o = new Gn()) {
      this.planes = [
        e,
        t,
        n,
        i,
        r,
        o
      ];
    }
    set(e, t, n, i, r, o) {
      const a = this.planes;
      return a[0].copy(e), a[1].copy(t), a[2].copy(n), a[3].copy(i), a[4].copy(r), a[5].copy(o), this;
    }
    copy(e) {
      const t = this.planes;
      for (let n = 0; n < 6; n++) t[n].copy(e.planes[n]);
      return this;
    }
    setFromProjectionMatrix(e, t = Rn) {
      const n = this.planes, i = e.elements, r = i[0], o = i[1], a = i[2], c = i[3], l = i[4], h = i[5], u = i[6], d = i[7], f = i[8], g = i[9], _ = i[10], m = i[11], p = i[12], E = i[13], M = i[14], b = i[15];
      if (n[0].setComponents(c - r, d - l, m - f, b - p).normalize(), n[1].setComponents(c + r, d + l, m + f, b + p).normalize(), n[2].setComponents(c + o, d + h, m + g, b + E).normalize(), n[3].setComponents(c - o, d - h, m - g, b - E).normalize(), n[4].setComponents(c - a, d - u, m - _, b - M).normalize(), t === Rn) n[5].setComponents(c + a, d + u, m + _, b + M).normalize();
      else if (t === qr) n[5].setComponents(a, u, _, M).normalize();
      else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: " + t);
      return this;
    }
    intersectsObject(e) {
      if (e.boundingSphere !== void 0) e.boundingSphere === null && e.computeBoundingSphere(), ii.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);
      else {
        const t = e.geometry;
        t.boundingSphere === null && t.computeBoundingSphere(), ii.copy(t.boundingSphere).applyMatrix4(e.matrixWorld);
      }
      return this.intersectsSphere(ii);
    }
    intersectsSprite(e) {
      return ii.center.set(0, 0, 0), ii.radius = 0.7071067811865476, ii.applyMatrix4(e.matrixWorld), this.intersectsSphere(ii);
    }
    intersectsSphere(e) {
      const t = this.planes, n = e.center, i = -e.radius;
      for (let r = 0; r < 6; r++) if (t[r].distanceToPoint(n) < i) return false;
      return true;
    }
    intersectsBox(e) {
      const t = this.planes;
      for (let n = 0; n < 6; n++) {
        const i = t[n];
        if (lr.x = i.normal.x > 0 ? e.max.x : e.min.x, lr.y = i.normal.y > 0 ? e.max.y : e.min.y, lr.z = i.normal.z > 0 ? e.max.z : e.min.z, i.distanceToPoint(lr) < 0) return false;
      }
      return true;
    }
    containsPoint(e) {
      const t = this.planes;
      for (let n = 0; n < 6; n++) if (t[n].distanceToPoint(e) < 0) return false;
      return true;
    }
    clone() {
      return new this.constructor().copy(this);
    }
  }
  function Lh() {
    let s = null, e = false, t = null, n = null;
    function i(r, o) {
      t(r, o), n = s.requestAnimationFrame(i);
    }
    return {
      start: function() {
        e !== true && t !== null && (n = s.requestAnimationFrame(i), e = true);
      },
      stop: function() {
        s.cancelAnimationFrame(n), e = false;
      },
      setAnimationLoop: function(r) {
        t = r;
      },
      setContext: function(r) {
        s = r;
      }
    };
  }
  function qd(s) {
    const e = /* @__PURE__ */ new WeakMap();
    function t(a, c) {
      const l = a.array, h = a.usage, u = l.byteLength, d = s.createBuffer();
      s.bindBuffer(c, d), s.bufferData(c, l, h), a.onUploadCallback();
      let f;
      if (l instanceof Float32Array) f = s.FLOAT;
      else if (l instanceof Uint16Array) a.isFloat16BufferAttribute ? f = s.HALF_FLOAT : f = s.UNSIGNED_SHORT;
      else if (l instanceof Int16Array) f = s.SHORT;
      else if (l instanceof Uint32Array) f = s.UNSIGNED_INT;
      else if (l instanceof Int32Array) f = s.INT;
      else if (l instanceof Int8Array) f = s.BYTE;
      else if (l instanceof Uint8Array) f = s.UNSIGNED_BYTE;
      else if (l instanceof Uint8ClampedArray) f = s.UNSIGNED_BYTE;
      else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: " + l);
      return {
        buffer: d,
        type: f,
        bytesPerElement: l.BYTES_PER_ELEMENT,
        version: a.version,
        size: u
      };
    }
    function n(a, c, l) {
      const h = c.array, u = c.updateRanges;
      if (s.bindBuffer(l, a), u.length === 0) s.bufferSubData(l, 0, h);
      else {
        u.sort((f, g) => f.start - g.start);
        let d = 0;
        for (let f = 1; f < u.length; f++) {
          const g = u[d], _ = u[f];
          _.start <= g.start + g.count + 1 ? g.count = Math.max(g.count, _.start + _.count - g.start) : (++d, u[d] = _);
        }
        u.length = d + 1;
        for (let f = 0, g = u.length; f < g; f++) {
          const _ = u[f];
          s.bufferSubData(l, _.start * h.BYTES_PER_ELEMENT, h, _.start, _.count);
        }
        c.clearUpdateRanges();
      }
      c.onUploadCallback();
    }
    function i(a) {
      return a.isInterleavedBufferAttribute && (a = a.data), e.get(a);
    }
    function r(a) {
      a.isInterleavedBufferAttribute && (a = a.data);
      const c = e.get(a);
      c && (s.deleteBuffer(c.buffer), e.delete(a));
    }
    function o(a, c) {
      if (a.isInterleavedBufferAttribute && (a = a.data), a.isGLBufferAttribute) {
        const h = e.get(a);
        (!h || h.version < a.version) && e.set(a, {
          buffer: a.buffer,
          type: a.type,
          bytesPerElement: a.elementSize,
          version: a.version
        });
        return;
      }
      const l = e.get(a);
      if (l === void 0) e.set(a, t(a, c));
      else if (l.version < a.version) {
        if (l.size !== a.array.byteLength) throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");
        n(l.buffer, a, c), l.version = a.version;
      }
    }
    return {
      get: i,
      remove: r,
      update: o
    };
  }
  class fi extends yt {
    constructor(e = 1, t = 1, n = 1, i = 1) {
      super(), this.type = "PlaneGeometry", this.parameters = {
        width: e,
        height: t,
        widthSegments: n,
        heightSegments: i
      };
      const r = e / 2, o = t / 2, a = Math.floor(n), c = Math.floor(i), l = a + 1, h = c + 1, u = e / a, d = t / c, f = [], g = [], _ = [], m = [];
      for (let p = 0; p < h; p++) {
        const E = p * d - o;
        for (let M = 0; M < l; M++) {
          const b = M * u - r;
          g.push(b, -E, 0), _.push(0, 0, 1), m.push(M / a), m.push(1 - p / c);
        }
      }
      for (let p = 0; p < c; p++) for (let E = 0; E < a; E++) {
        const M = E + l * p, b = E + l * (p + 1), I = E + 1 + l * (p + 1), A = E + 1 + l * p;
        f.push(M, b, A), f.push(b, I, A);
      }
      this.setIndex(f), this.setAttribute("position", new at(g, 3)), this.setAttribute("normal", new at(_, 3)), this.setAttribute("uv", new at(m, 2));
    }
    copy(e) {
      return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
    }
    static fromJSON(e) {
      return new fi(e.width, e.height, e.widthSegments, e.heightSegments);
    }
  }
  var jd = `#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`, Kd = `#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`, $d = `#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`, Zd = `#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`, Jd = `#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`, Qd = `#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`, ef = `#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`, tf = `#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`, nf = `#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`, sf = `#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`, rf = `vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`, of = `vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`, af = `float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`, cf = `#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`, lf = `#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`, hf = `#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`, uf = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`, df = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`, ff = `#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`, pf = `#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`, mf = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`, gf = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`, _f = `#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`, xf = `#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`, vf = `#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`, yf = `vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`, Mf = `#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`, Sf = `#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`, Ef = `#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`, bf = `#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`, Tf = "gl_FragColor = linearToOutputTexel( gl_FragColor );", Af = `
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`, wf = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`, Rf = `#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`, Cf = `#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`, Pf = `#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`, If = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`, Lf = `#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`, Df = `#ifdef USE_FOG
	varying float vFogDepth;
#endif`, Uf = `#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`, Nf = `#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`, Ff = `#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`, Of = `#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`, Bf = `LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`, kf = `varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`, zf = `uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`, Hf = `#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`, Vf = `ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`, Gf = `varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`, Wf = `BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`, Xf = `varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`, Yf = `PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`, qf = `struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`, jf = `
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`, Kf = `#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`, $f = `#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`, Zf = `#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`, Jf = `#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`, Qf = `#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`, ep = `#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`, tp = `#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`, np = `#ifdef USE_MAP
	uniform sampler2D map;
#endif`, ip = `#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`, sp = `#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`, rp = `float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`, op = `#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`, ap = `#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`, cp = `#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`, lp = `#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`, hp = `#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`, up = `#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`, dp = `float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`, fp = `#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`, pp = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, mp = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, gp = `#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`, _p = `#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`, xp = `#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`, vp = `#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`, yp = `#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`, Mp = `#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`, Sp = `#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`, Ep = `vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`, bp = `#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`, Tp = `vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`, Ap = `#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`, wp = `#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`, Rp = `float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`, Cp = `#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`, Pp = `#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`, Ip = `#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`, Lp = `#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`, Dp = `float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`, Up = `#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`, Np = `#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`, Fp = `#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`, Op = `#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`, Bp = `float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`, kp = `#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`, zp = `#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`, Hp = `#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`, Vp = `#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`, Gp = `#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`, Wp = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`, Xp = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`, Yp = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`, qp = `#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;
  const jp = `varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`, Kp = `uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, $p = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, Zp = `#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, Jp = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, Qp = `uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, em = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`, tm = `#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`, nm = `#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`, im = `#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`, sm = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`, rm = `uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, om = `uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`, am = `uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`, cm = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`, lm = `uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, hm = `#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, um = `#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, dm = `#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`, fm = `#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, pm = `#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`, mm = `#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`, gm = `#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, _m = `#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, xm = `#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`, vm = `#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, ym = `#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, Mm = `#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, Sm = `uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`, Em = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`, bm = `#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, Tm = `uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`, Am = `uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`, wm = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`, Le = {
    alphahash_fragment: jd,
    alphahash_pars_fragment: Kd,
    alphamap_fragment: $d,
    alphamap_pars_fragment: Zd,
    alphatest_fragment: Jd,
    alphatest_pars_fragment: Qd,
    aomap_fragment: ef,
    aomap_pars_fragment: tf,
    batching_pars_vertex: nf,
    batching_vertex: sf,
    begin_vertex: rf,
    beginnormal_vertex: of,
    bsdfs: af,
    iridescence_fragment: cf,
    bumpmap_pars_fragment: lf,
    clipping_planes_fragment: hf,
    clipping_planes_pars_fragment: uf,
    clipping_planes_pars_vertex: df,
    clipping_planes_vertex: ff,
    color_fragment: pf,
    color_pars_fragment: mf,
    color_pars_vertex: gf,
    color_vertex: _f,
    common: xf,
    cube_uv_reflection_fragment: vf,
    defaultnormal_vertex: yf,
    displacementmap_pars_vertex: Mf,
    displacementmap_vertex: Sf,
    emissivemap_fragment: Ef,
    emissivemap_pars_fragment: bf,
    colorspace_fragment: Tf,
    colorspace_pars_fragment: Af,
    envmap_fragment: wf,
    envmap_common_pars_fragment: Rf,
    envmap_pars_fragment: Cf,
    envmap_pars_vertex: Pf,
    envmap_physical_pars_fragment: Hf,
    envmap_vertex: If,
    fog_vertex: Lf,
    fog_pars_vertex: Df,
    fog_fragment: Uf,
    fog_pars_fragment: Nf,
    gradientmap_pars_fragment: Ff,
    lightmap_pars_fragment: Of,
    lights_lambert_fragment: Bf,
    lights_lambert_pars_fragment: kf,
    lights_pars_begin: zf,
    lights_toon_fragment: Vf,
    lights_toon_pars_fragment: Gf,
    lights_phong_fragment: Wf,
    lights_phong_pars_fragment: Xf,
    lights_physical_fragment: Yf,
    lights_physical_pars_fragment: qf,
    lights_fragment_begin: jf,
    lights_fragment_maps: Kf,
    lights_fragment_end: $f,
    logdepthbuf_fragment: Zf,
    logdepthbuf_pars_fragment: Jf,
    logdepthbuf_pars_vertex: Qf,
    logdepthbuf_vertex: ep,
    map_fragment: tp,
    map_pars_fragment: np,
    map_particle_fragment: ip,
    map_particle_pars_fragment: sp,
    metalnessmap_fragment: rp,
    metalnessmap_pars_fragment: op,
    morphinstance_vertex: ap,
    morphcolor_vertex: cp,
    morphnormal_vertex: lp,
    morphtarget_pars_vertex: hp,
    morphtarget_vertex: up,
    normal_fragment_begin: dp,
    normal_fragment_maps: fp,
    normal_pars_fragment: pp,
    normal_pars_vertex: mp,
    normal_vertex: gp,
    normalmap_pars_fragment: _p,
    clearcoat_normal_fragment_begin: xp,
    clearcoat_normal_fragment_maps: vp,
    clearcoat_pars_fragment: yp,
    iridescence_pars_fragment: Mp,
    opaque_fragment: Sp,
    packing: Ep,
    premultiplied_alpha_fragment: bp,
    project_vertex: Tp,
    dithering_fragment: Ap,
    dithering_pars_fragment: wp,
    roughnessmap_fragment: Rp,
    roughnessmap_pars_fragment: Cp,
    shadowmap_pars_fragment: Pp,
    shadowmap_pars_vertex: Ip,
    shadowmap_vertex: Lp,
    shadowmask_pars_fragment: Dp,
    skinbase_vertex: Up,
    skinning_pars_vertex: Np,
    skinning_vertex: Fp,
    skinnormal_vertex: Op,
    specularmap_fragment: Bp,
    specularmap_pars_fragment: kp,
    tonemapping_fragment: zp,
    tonemapping_pars_fragment: Hp,
    transmission_fragment: Vp,
    transmission_pars_fragment: Gp,
    uv_pars_fragment: Wp,
    uv_pars_vertex: Xp,
    uv_vertex: Yp,
    worldpos_vertex: qp,
    background_vert: jp,
    background_frag: Kp,
    backgroundCube_vert: $p,
    backgroundCube_frag: Zp,
    cube_vert: Jp,
    cube_frag: Qp,
    depth_vert: em,
    depth_frag: tm,
    distanceRGBA_vert: nm,
    distanceRGBA_frag: im,
    equirect_vert: sm,
    equirect_frag: rm,
    linedashed_vert: om,
    linedashed_frag: am,
    meshbasic_vert: cm,
    meshbasic_frag: lm,
    meshlambert_vert: hm,
    meshlambert_frag: um,
    meshmatcap_vert: dm,
    meshmatcap_frag: fm,
    meshnormal_vert: pm,
    meshnormal_frag: mm,
    meshphong_vert: gm,
    meshphong_frag: _m,
    meshphysical_vert: xm,
    meshphysical_frag: vm,
    meshtoon_vert: ym,
    meshtoon_frag: Mm,
    points_vert: Sm,
    points_frag: Em,
    shadow_vert: bm,
    shadow_frag: Tm,
    sprite_vert: Am,
    sprite_frag: wm
  }, te = {
    common: {
      diffuse: {
        value: new Se(16777215)
      },
      opacity: {
        value: 1
      },
      map: {
        value: null
      },
      mapTransform: {
        value: new De()
      },
      alphaMap: {
        value: null
      },
      alphaMapTransform: {
        value: new De()
      },
      alphaTest: {
        value: 0
      }
    },
    specularmap: {
      specularMap: {
        value: null
      },
      specularMapTransform: {
        value: new De()
      }
    },
    envmap: {
      envMap: {
        value: null
      },
      envMapRotation: {
        value: new De()
      },
      flipEnvMap: {
        value: -1
      },
      reflectivity: {
        value: 1
      },
      ior: {
        value: 1.5
      },
      refractionRatio: {
        value: 0.98
      }
    },
    aomap: {
      aoMap: {
        value: null
      },
      aoMapIntensity: {
        value: 1
      },
      aoMapTransform: {
        value: new De()
      }
    },
    lightmap: {
      lightMap: {
        value: null
      },
      lightMapIntensity: {
        value: 1
      },
      lightMapTransform: {
        value: new De()
      }
    },
    bumpmap: {
      bumpMap: {
        value: null
      },
      bumpMapTransform: {
        value: new De()
      },
      bumpScale: {
        value: 1
      }
    },
    normalmap: {
      normalMap: {
        value: null
      },
      normalMapTransform: {
        value: new De()
      },
      normalScale: {
        value: new ye(1, 1)
      }
    },
    displacementmap: {
      displacementMap: {
        value: null
      },
      displacementMapTransform: {
        value: new De()
      },
      displacementScale: {
        value: 1
      },
      displacementBias: {
        value: 0
      }
    },
    emissivemap: {
      emissiveMap: {
        value: null
      },
      emissiveMapTransform: {
        value: new De()
      }
    },
    metalnessmap: {
      metalnessMap: {
        value: null
      },
      metalnessMapTransform: {
        value: new De()
      }
    },
    roughnessmap: {
      roughnessMap: {
        value: null
      },
      roughnessMapTransform: {
        value: new De()
      }
    },
    gradientmap: {
      gradientMap: {
        value: null
      }
    },
    fog: {
      fogDensity: {
        value: 25e-5
      },
      fogNear: {
        value: 1
      },
      fogFar: {
        value: 2e3
      },
      fogColor: {
        value: new Se(16777215)
      }
    },
    lights: {
      ambientLightColor: {
        value: []
      },
      lightProbe: {
        value: []
      },
      directionalLights: {
        value: [],
        properties: {
          direction: {},
          color: {}
        }
      },
      directionalLightShadows: {
        value: [],
        properties: {
          shadowIntensity: 1,
          shadowBias: {},
          shadowNormalBias: {},
          shadowRadius: {},
          shadowMapSize: {}
        }
      },
      directionalShadowMap: {
        value: []
      },
      directionalShadowMatrix: {
        value: []
      },
      spotLights: {
        value: [],
        properties: {
          color: {},
          position: {},
          direction: {},
          distance: {},
          coneCos: {},
          penumbraCos: {},
          decay: {}
        }
      },
      spotLightShadows: {
        value: [],
        properties: {
          shadowIntensity: 1,
          shadowBias: {},
          shadowNormalBias: {},
          shadowRadius: {},
          shadowMapSize: {}
        }
      },
      spotLightMap: {
        value: []
      },
      spotShadowMap: {
        value: []
      },
      spotLightMatrix: {
        value: []
      },
      pointLights: {
        value: [],
        properties: {
          color: {},
          position: {},
          decay: {},
          distance: {}
        }
      },
      pointLightShadows: {
        value: [],
        properties: {
          shadowIntensity: 1,
          shadowBias: {},
          shadowNormalBias: {},
          shadowRadius: {},
          shadowMapSize: {},
          shadowCameraNear: {},
          shadowCameraFar: {}
        }
      },
      pointShadowMap: {
        value: []
      },
      pointShadowMatrix: {
        value: []
      },
      hemisphereLights: {
        value: [],
        properties: {
          direction: {},
          skyColor: {},
          groundColor: {}
        }
      },
      rectAreaLights: {
        value: [],
        properties: {
          color: {},
          position: {},
          width: {},
          height: {}
        }
      },
      ltc_1: {
        value: null
      },
      ltc_2: {
        value: null
      }
    },
    points: {
      diffuse: {
        value: new Se(16777215)
      },
      opacity: {
        value: 1
      },
      size: {
        value: 1
      },
      scale: {
        value: 1
      },
      map: {
        value: null
      },
      alphaMap: {
        value: null
      },
      alphaMapTransform: {
        value: new De()
      },
      alphaTest: {
        value: 0
      },
      uvTransform: {
        value: new De()
      }
    },
    sprite: {
      diffuse: {
        value: new Se(16777215)
      },
      opacity: {
        value: 1
      },
      center: {
        value: new ye(0.5, 0.5)
      },
      rotation: {
        value: 0
      },
      map: {
        value: null
      },
      mapTransform: {
        value: new De()
      },
      alphaMap: {
        value: null
      },
      alphaMapTransform: {
        value: new De()
      },
      alphaTest: {
        value: 0
      }
    }
  }, ln = {
    basic: {
      uniforms: wt([
        te.common,
        te.specularmap,
        te.envmap,
        te.aomap,
        te.lightmap,
        te.fog
      ]),
      vertexShader: Le.meshbasic_vert,
      fragmentShader: Le.meshbasic_frag
    },
    lambert: {
      uniforms: wt([
        te.common,
        te.specularmap,
        te.envmap,
        te.aomap,
        te.lightmap,
        te.emissivemap,
        te.bumpmap,
        te.normalmap,
        te.displacementmap,
        te.fog,
        te.lights,
        {
          emissive: {
            value: new Se(0)
          }
        }
      ]),
      vertexShader: Le.meshlambert_vert,
      fragmentShader: Le.meshlambert_frag
    },
    phong: {
      uniforms: wt([
        te.common,
        te.specularmap,
        te.envmap,
        te.aomap,
        te.lightmap,
        te.emissivemap,
        te.bumpmap,
        te.normalmap,
        te.displacementmap,
        te.fog,
        te.lights,
        {
          emissive: {
            value: new Se(0)
          },
          specular: {
            value: new Se(1118481)
          },
          shininess: {
            value: 30
          }
        }
      ]),
      vertexShader: Le.meshphong_vert,
      fragmentShader: Le.meshphong_frag
    },
    standard: {
      uniforms: wt([
        te.common,
        te.envmap,
        te.aomap,
        te.lightmap,
        te.emissivemap,
        te.bumpmap,
        te.normalmap,
        te.displacementmap,
        te.roughnessmap,
        te.metalnessmap,
        te.fog,
        te.lights,
        {
          emissive: {
            value: new Se(0)
          },
          roughness: {
            value: 1
          },
          metalness: {
            value: 0
          },
          envMapIntensity: {
            value: 1
          }
        }
      ]),
      vertexShader: Le.meshphysical_vert,
      fragmentShader: Le.meshphysical_frag
    },
    toon: {
      uniforms: wt([
        te.common,
        te.aomap,
        te.lightmap,
        te.emissivemap,
        te.bumpmap,
        te.normalmap,
        te.displacementmap,
        te.gradientmap,
        te.fog,
        te.lights,
        {
          emissive: {
            value: new Se(0)
          }
        }
      ]),
      vertexShader: Le.meshtoon_vert,
      fragmentShader: Le.meshtoon_frag
    },
    matcap: {
      uniforms: wt([
        te.common,
        te.bumpmap,
        te.normalmap,
        te.displacementmap,
        te.fog,
        {
          matcap: {
            value: null
          }
        }
      ]),
      vertexShader: Le.meshmatcap_vert,
      fragmentShader: Le.meshmatcap_frag
    },
    points: {
      uniforms: wt([
        te.points,
        te.fog
      ]),
      vertexShader: Le.points_vert,
      fragmentShader: Le.points_frag
    },
    dashed: {
      uniforms: wt([
        te.common,
        te.fog,
        {
          scale: {
            value: 1
          },
          dashSize: {
            value: 1
          },
          totalSize: {
            value: 2
          }
        }
      ]),
      vertexShader: Le.linedashed_vert,
      fragmentShader: Le.linedashed_frag
    },
    depth: {
      uniforms: wt([
        te.common,
        te.displacementmap
      ]),
      vertexShader: Le.depth_vert,
      fragmentShader: Le.depth_frag
    },
    normal: {
      uniforms: wt([
        te.common,
        te.bumpmap,
        te.normalmap,
        te.displacementmap,
        {
          opacity: {
            value: 1
          }
        }
      ]),
      vertexShader: Le.meshnormal_vert,
      fragmentShader: Le.meshnormal_frag
    },
    sprite: {
      uniforms: wt([
        te.sprite,
        te.fog
      ]),
      vertexShader: Le.sprite_vert,
      fragmentShader: Le.sprite_frag
    },
    background: {
      uniforms: {
        uvTransform: {
          value: new De()
        },
        t2D: {
          value: null
        },
        backgroundIntensity: {
          value: 1
        }
      },
      vertexShader: Le.background_vert,
      fragmentShader: Le.background_frag
    },
    backgroundCube: {
      uniforms: {
        envMap: {
          value: null
        },
        flipEnvMap: {
          value: -1
        },
        backgroundBlurriness: {
          value: 0
        },
        backgroundIntensity: {
          value: 1
        },
        backgroundRotation: {
          value: new De()
        }
      },
      vertexShader: Le.backgroundCube_vert,
      fragmentShader: Le.backgroundCube_frag
    },
    cube: {
      uniforms: {
        tCube: {
          value: null
        },
        tFlip: {
          value: -1
        },
        opacity: {
          value: 1
        }
      },
      vertexShader: Le.cube_vert,
      fragmentShader: Le.cube_frag
    },
    equirect: {
      uniforms: {
        tEquirect: {
          value: null
        }
      },
      vertexShader: Le.equirect_vert,
      fragmentShader: Le.equirect_frag
    },
    distanceRGBA: {
      uniforms: wt([
        te.common,
        te.displacementmap,
        {
          referencePosition: {
            value: new R()
          },
          nearDistance: {
            value: 1
          },
          farDistance: {
            value: 1e3
          }
        }
      ]),
      vertexShader: Le.distanceRGBA_vert,
      fragmentShader: Le.distanceRGBA_frag
    },
    shadow: {
      uniforms: wt([
        te.lights,
        te.fog,
        {
          color: {
            value: new Se(0)
          },
          opacity: {
            value: 1
          }
        }
      ]),
      vertexShader: Le.shadow_vert,
      fragmentShader: Le.shadow_frag
    }
  };
  ln.physical = {
    uniforms: wt([
      ln.standard.uniforms,
      {
        clearcoat: {
          value: 0
        },
        clearcoatMap: {
          value: null
        },
        clearcoatMapTransform: {
          value: new De()
        },
        clearcoatNormalMap: {
          value: null
        },
        clearcoatNormalMapTransform: {
          value: new De()
        },
        clearcoatNormalScale: {
          value: new ye(1, 1)
        },
        clearcoatRoughness: {
          value: 0
        },
        clearcoatRoughnessMap: {
          value: null
        },
        clearcoatRoughnessMapTransform: {
          value: new De()
        },
        dispersion: {
          value: 0
        },
        iridescence: {
          value: 0
        },
        iridescenceMap: {
          value: null
        },
        iridescenceMapTransform: {
          value: new De()
        },
        iridescenceIOR: {
          value: 1.3
        },
        iridescenceThicknessMinimum: {
          value: 100
        },
        iridescenceThicknessMaximum: {
          value: 400
        },
        iridescenceThicknessMap: {
          value: null
        },
        iridescenceThicknessMapTransform: {
          value: new De()
        },
        sheen: {
          value: 0
        },
        sheenColor: {
          value: new Se(0)
        },
        sheenColorMap: {
          value: null
        },
        sheenColorMapTransform: {
          value: new De()
        },
        sheenRoughness: {
          value: 1
        },
        sheenRoughnessMap: {
          value: null
        },
        sheenRoughnessMapTransform: {
          value: new De()
        },
        transmission: {
          value: 0
        },
        transmissionMap: {
          value: null
        },
        transmissionMapTransform: {
          value: new De()
        },
        transmissionSamplerSize: {
          value: new ye()
        },
        transmissionSamplerMap: {
          value: null
        },
        thickness: {
          value: 0
        },
        thicknessMap: {
          value: null
        },
        thicknessMapTransform: {
          value: new De()
        },
        attenuationDistance: {
          value: 0
        },
        attenuationColor: {
          value: new Se(0)
        },
        specularColor: {
          value: new Se(1, 1, 1)
        },
        specularColorMap: {
          value: null
        },
        specularColorMapTransform: {
          value: new De()
        },
        specularIntensity: {
          value: 1
        },
        specularIntensityMap: {
          value: null
        },
        specularIntensityMapTransform: {
          value: new De()
        },
        anisotropyVector: {
          value: new ye()
        },
        anisotropyMap: {
          value: null
        },
        anisotropyMapTransform: {
          value: new De()
        }
      }
    ]),
    vertexShader: Le.meshphysical_vert,
    fragmentShader: Le.meshphysical_frag
  };
  const hr = {
    r: 0,
    b: 0,
    g: 0
  }, si = new un(), Rm = new Ce();
  function Cm(s, e, t, n, i, r, o) {
    const a = new Se(0);
    let c = r === true ? 0 : 1, l, h, u = null, d = 0, f = null;
    function g(E) {
      let M = E.isScene === true ? E.background : null;
      return M && M.isTexture && (M = (E.backgroundBlurriness > 0 ? t : e).get(M)), M;
    }
    function _(E) {
      let M = false;
      const b = g(E);
      b === null ? p(a, c) : b && b.isColor && (p(b, 1), M = true);
      const I = s.xr.getEnvironmentBlendMode();
      I === "additive" ? n.buffers.color.setClear(0, 0, 0, 1, o) : I === "alpha-blend" && n.buffers.color.setClear(0, 0, 0, 0, o), (s.autoClear || M) && (n.buffers.depth.setTest(true), n.buffers.depth.setMask(true), n.buffers.color.setMask(true), s.clear(s.autoClearColor, s.autoClearDepth, s.autoClearStencil));
    }
    function m(E, M) {
      const b = g(M);
      b && (b.isCubeTexture || b.mapping === Qr) ? (h === void 0 && (h = new tt(new Vs(1, 1, 1), new Zn({
        name: "BackgroundCubeMaterial",
        uniforms: is(ln.backgroundCube.uniforms),
        vertexShader: ln.backgroundCube.vertexShader,
        fragmentShader: ln.backgroundCube.fragmentShader,
        side: Ut,
        depthTest: false,
        depthWrite: false,
        fog: false
      })), h.geometry.deleteAttribute("normal"), h.geometry.deleteAttribute("uv"), h.onBeforeRender = function(I, A, w) {
        this.matrixWorld.copyPosition(w.matrixWorld);
      }, Object.defineProperty(h.material, "envMap", {
        get: function() {
          return this.uniforms.envMap.value;
        }
      }), i.update(h)), si.copy(M.backgroundRotation), si.x *= -1, si.y *= -1, si.z *= -1, b.isCubeTexture && b.isRenderTargetTexture === false && (si.y *= -1, si.z *= -1), h.material.uniforms.envMap.value = b, h.material.uniforms.flipEnvMap.value = b.isCubeTexture && b.isRenderTargetTexture === false ? -1 : 1, h.material.uniforms.backgroundBlurriness.value = M.backgroundBlurriness, h.material.uniforms.backgroundIntensity.value = M.backgroundIntensity, h.material.uniforms.backgroundRotation.value.setFromMatrix4(Rm.makeRotationFromEuler(si)), h.material.toneMapped = Ge.getTransfer(b.colorSpace) !== rt, (u !== b || d !== b.version || f !== s.toneMapping) && (h.material.needsUpdate = true, u = b, d = b.version, f = s.toneMapping), h.layers.enableAll(), E.unshift(h, h.geometry, h.material, 0, 0, null)) : b && b.isTexture && (l === void 0 && (l = new tt(new fi(2, 2), new Zn({
        name: "BackgroundMaterial",
        uniforms: is(ln.background.uniforms),
        vertexShader: ln.background.vertexShader,
        fragmentShader: ln.background.fragmentShader,
        side: Pn,
        depthTest: false,
        depthWrite: false,
        fog: false
      })), l.geometry.deleteAttribute("normal"), Object.defineProperty(l.material, "map", {
        get: function() {
          return this.uniforms.t2D.value;
        }
      }), i.update(l)), l.material.uniforms.t2D.value = b, l.material.uniforms.backgroundIntensity.value = M.backgroundIntensity, l.material.toneMapped = Ge.getTransfer(b.colorSpace) !== rt, b.matrixAutoUpdate === true && b.updateMatrix(), l.material.uniforms.uvTransform.value.copy(b.matrix), (u !== b || d !== b.version || f !== s.toneMapping) && (l.material.needsUpdate = true, u = b, d = b.version, f = s.toneMapping), l.layers.enableAll(), E.unshift(l, l.geometry, l.material, 0, 0, null));
    }
    function p(E, M) {
      E.getRGB(hr, Ch(s)), n.buffers.color.setClear(hr.r, hr.g, hr.b, M, o);
    }
    return {
      getClearColor: function() {
        return a;
      },
      setClearColor: function(E, M = 1) {
        a.set(E), c = M, p(a, c);
      },
      getClearAlpha: function() {
        return c;
      },
      setClearAlpha: function(E) {
        c = E, p(a, c);
      },
      render: _,
      addToRenderList: m
    };
  }
  function Pm(s, e) {
    const t = s.getParameter(s.MAX_VERTEX_ATTRIBS), n = {}, i = d(null);
    let r = i, o = false;
    function a(x, S, k, B, H) {
      let K = false;
      const z = u(B, k, S);
      r !== z && (r = z, l(r.object)), K = f(x, B, k, H), K && g(x, B, k, H), H !== null && e.update(H, s.ELEMENT_ARRAY_BUFFER), (K || o) && (o = false, b(x, S, k, B), H !== null && s.bindBuffer(s.ELEMENT_ARRAY_BUFFER, e.get(H).buffer));
    }
    function c() {
      return s.createVertexArray();
    }
    function l(x) {
      return s.bindVertexArray(x);
    }
    function h(x) {
      return s.deleteVertexArray(x);
    }
    function u(x, S, k) {
      const B = k.wireframe === true;
      let H = n[x.id];
      H === void 0 && (H = {}, n[x.id] = H);
      let K = H[S.id];
      K === void 0 && (K = {}, H[S.id] = K);
      let z = K[B];
      return z === void 0 && (z = d(c()), K[B] = z), z;
    }
    function d(x) {
      const S = [], k = [], B = [];
      for (let H = 0; H < t; H++) S[H] = 0, k[H] = 0, B[H] = 0;
      return {
        geometry: null,
        program: null,
        wireframe: false,
        newAttributes: S,
        enabledAttributes: k,
        attributeDivisors: B,
        object: x,
        attributes: {},
        index: null
      };
    }
    function f(x, S, k, B) {
      const H = r.attributes, K = S.attributes;
      let z = 0;
      const Q = k.getAttributes();
      for (const G in Q) if (Q[G].location >= 0) {
        const ce = H[G];
        let ge = K[G];
        if (ge === void 0 && (G === "instanceMatrix" && x.instanceMatrix && (ge = x.instanceMatrix), G === "instanceColor" && x.instanceColor && (ge = x.instanceColor)), ce === void 0 || ce.attribute !== ge || ge && ce.data !== ge.data) return true;
        z++;
      }
      return r.attributesNum !== z || r.index !== B;
    }
    function g(x, S, k, B) {
      const H = {}, K = S.attributes;
      let z = 0;
      const Q = k.getAttributes();
      for (const G in Q) if (Q[G].location >= 0) {
        let ce = K[G];
        ce === void 0 && (G === "instanceMatrix" && x.instanceMatrix && (ce = x.instanceMatrix), G === "instanceColor" && x.instanceColor && (ce = x.instanceColor));
        const ge = {};
        ge.attribute = ce, ce && ce.data && (ge.data = ce.data), H[G] = ge, z++;
      }
      r.attributes = H, r.attributesNum = z, r.index = B;
    }
    function _() {
      const x = r.newAttributes;
      for (let S = 0, k = x.length; S < k; S++) x[S] = 0;
    }
    function m(x) {
      p(x, 0);
    }
    function p(x, S) {
      const k = r.newAttributes, B = r.enabledAttributes, H = r.attributeDivisors;
      k[x] = 1, B[x] === 0 && (s.enableVertexAttribArray(x), B[x] = 1), H[x] !== S && (s.vertexAttribDivisor(x, S), H[x] = S);
    }
    function E() {
      const x = r.newAttributes, S = r.enabledAttributes;
      for (let k = 0, B = S.length; k < B; k++) S[k] !== x[k] && (s.disableVertexAttribArray(k), S[k] = 0);
    }
    function M(x, S, k, B, H, K, z) {
      z === true ? s.vertexAttribIPointer(x, S, k, H, K) : s.vertexAttribPointer(x, S, k, B, H, K);
    }
    function b(x, S, k, B) {
      _();
      const H = B.attributes, K = k.getAttributes(), z = S.defaultAttributeValues;
      for (const Q in K) {
        const G = K[Q];
        if (G.location >= 0) {
          let ae = H[Q];
          if (ae === void 0 && (Q === "instanceMatrix" && x.instanceMatrix && (ae = x.instanceMatrix), Q === "instanceColor" && x.instanceColor && (ae = x.instanceColor)), ae !== void 0) {
            const ce = ae.normalized, ge = ae.itemSize, We = e.get(ae);
            if (We === void 0) continue;
            const $e = We.buffer, W = We.type, Z = We.bytesPerElement, pe = W === s.INT || W === s.UNSIGNED_INT || ae.gpuType === qa;
            if (ae.isInterleavedBufferAttribute) {
              const le = ae.data, Pe = le.stride, Ee = ae.offset;
              if (le.isInstancedInterleavedBuffer) {
                for (let Be = 0; Be < G.locationSize; Be++) p(G.location + Be, le.meshPerAttribute);
                x.isInstancedMesh !== true && B._maxInstanceCount === void 0 && (B._maxInstanceCount = le.meshPerAttribute * le.count);
              } else for (let Be = 0; Be < G.locationSize; Be++) m(G.location + Be);
              s.bindBuffer(s.ARRAY_BUFFER, $e);
              for (let Be = 0; Be < G.locationSize; Be++) M(G.location + Be, ge / G.locationSize, W, ce, Pe * Z, (Ee + ge / G.locationSize * Be) * Z, pe);
            } else {
              if (ae.isInstancedBufferAttribute) {
                for (let le = 0; le < G.locationSize; le++) p(G.location + le, ae.meshPerAttribute);
                x.isInstancedMesh !== true && B._maxInstanceCount === void 0 && (B._maxInstanceCount = ae.meshPerAttribute * ae.count);
              } else for (let le = 0; le < G.locationSize; le++) m(G.location + le);
              s.bindBuffer(s.ARRAY_BUFFER, $e);
              for (let le = 0; le < G.locationSize; le++) M(G.location + le, ge / G.locationSize, W, ce, ge * Z, ge / G.locationSize * le * Z, pe);
            }
          } else if (z !== void 0) {
            const ce = z[Q];
            if (ce !== void 0) switch (ce.length) {
              case 2:
                s.vertexAttrib2fv(G.location, ce);
                break;
              case 3:
                s.vertexAttrib3fv(G.location, ce);
                break;
              case 4:
                s.vertexAttrib4fv(G.location, ce);
                break;
              default:
                s.vertexAttrib1fv(G.location, ce);
            }
          }
        }
      }
      E();
    }
    function I() {
      U();
      for (const x in n) {
        const S = n[x];
        for (const k in S) {
          const B = S[k];
          for (const H in B) h(B[H].object), delete B[H];
          delete S[k];
        }
        delete n[x];
      }
    }
    function A(x) {
      if (n[x.id] === void 0) return;
      const S = n[x.id];
      for (const k in S) {
        const B = S[k];
        for (const H in B) h(B[H].object), delete B[H];
        delete S[k];
      }
      delete n[x.id];
    }
    function w(x) {
      for (const S in n) {
        const k = n[S];
        if (k[x.id] === void 0) continue;
        const B = k[x.id];
        for (const H in B) h(B[H].object), delete B[H];
        delete k[x.id];
      }
    }
    function U() {
      j(), o = true, r !== i && (r = i, l(r.object));
    }
    function j() {
      i.geometry = null, i.program = null, i.wireframe = false;
    }
    return {
      setup: a,
      reset: U,
      resetDefaultState: j,
      dispose: I,
      releaseStatesOfGeometry: A,
      releaseStatesOfProgram: w,
      initAttributes: _,
      enableAttribute: m,
      disableUnusedAttributes: E
    };
  }
  function Im(s, e, t) {
    let n;
    function i(l) {
      n = l;
    }
    function r(l, h) {
      s.drawArrays(n, l, h), t.update(h, n, 1);
    }
    function o(l, h, u) {
      u !== 0 && (s.drawArraysInstanced(n, l, h, u), t.update(h, n, u));
    }
    function a(l, h, u) {
      if (u === 0) return;
      e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n, l, 0, h, 0, u);
      let f = 0;
      for (let g = 0; g < u; g++) f += h[g];
      t.update(f, n, 1);
    }
    function c(l, h, u, d) {
      if (u === 0) return;
      const f = e.get("WEBGL_multi_draw");
      if (f === null) for (let g = 0; g < l.length; g++) o(l[g], h[g], d[g]);
      else {
        f.multiDrawArraysInstancedWEBGL(n, l, 0, h, 0, d, 0, u);
        let g = 0;
        for (let _ = 0; _ < u; _++) g += h[_];
        for (let _ = 0; _ < d.length; _++) t.update(g, n, d[_]);
      }
    }
    this.setMode = i, this.render = r, this.renderInstances = o, this.renderMultiDraw = a, this.renderMultiDrawInstances = c;
  }
  function Lm(s, e, t, n) {
    let i;
    function r() {
      if (i !== void 0) return i;
      if (e.has("EXT_texture_filter_anisotropic") === true) {
        const w = e.get("EXT_texture_filter_anisotropic");
        i = s.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
      } else i = 0;
      return i;
    }
    function o(w) {
      return !(w !== $t && n.convert(w) !== s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT));
    }
    function a(w) {
      const U = w === zs && (e.has("EXT_color_buffer_half_float") || e.has("EXT_color_buffer_float"));
      return !(w !== In && n.convert(w) !== s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE) && w !== on && !U);
    }
    function c(w) {
      if (w === "highp") {
        if (s.getShaderPrecisionFormat(s.VERTEX_SHADER, s.HIGH_FLOAT).precision > 0 && s.getShaderPrecisionFormat(s.FRAGMENT_SHADER, s.HIGH_FLOAT).precision > 0) return "highp";
        w = "mediump";
      }
      return w === "mediump" && s.getShaderPrecisionFormat(s.VERTEX_SHADER, s.MEDIUM_FLOAT).precision > 0 && s.getShaderPrecisionFormat(s.FRAGMENT_SHADER, s.MEDIUM_FLOAT).precision > 0 ? "mediump" : "lowp";
    }
    let l = t.precision !== void 0 ? t.precision : "highp";
    const h = c(l);
    h !== l && (console.warn("THREE.WebGLRenderer:", l, "not supported, using", h, "instead."), l = h);
    const u = t.logarithmicDepthBuffer === true, d = t.reverseDepthBuffer === true && e.has("EXT_clip_control");
    if (d === true) {
      const w = e.get("EXT_clip_control");
      w.clipControlEXT(w.LOWER_LEFT_EXT, w.ZERO_TO_ONE_EXT);
    }
    const f = s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS), g = s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS), _ = s.getParameter(s.MAX_TEXTURE_SIZE), m = s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE), p = s.getParameter(s.MAX_VERTEX_ATTRIBS), E = s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS), M = s.getParameter(s.MAX_VARYING_VECTORS), b = s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS), I = g > 0, A = s.getParameter(s.MAX_SAMPLES);
    return {
      isWebGL2: true,
      getMaxAnisotropy: r,
      getMaxPrecision: c,
      textureFormatReadable: o,
      textureTypeReadable: a,
      precision: l,
      logarithmicDepthBuffer: u,
      reverseDepthBuffer: d,
      maxTextures: f,
      maxVertexTextures: g,
      maxTextureSize: _,
      maxCubemapSize: m,
      maxAttributes: p,
      maxVertexUniforms: E,
      maxVaryings: M,
      maxFragmentUniforms: b,
      vertexTextures: I,
      maxSamples: A
    };
  }
  function Dm(s) {
    const e = this;
    let t = null, n = 0, i = false, r = false;
    const o = new Gn(), a = new De(), c = {
      value: null,
      needsUpdate: false
    };
    this.uniform = c, this.numPlanes = 0, this.numIntersection = 0, this.init = function(u, d) {
      const f = u.length !== 0 || d || n !== 0 || i;
      return i = d, n = u.length, f;
    }, this.beginShadows = function() {
      r = true, h(null);
    }, this.endShadows = function() {
      r = false;
    }, this.setGlobalState = function(u, d) {
      t = h(u, d, 0);
    }, this.setState = function(u, d, f) {
      const g = u.clippingPlanes, _ = u.clipIntersection, m = u.clipShadows, p = s.get(u);
      if (!i || g === null || g.length === 0 || r && !m) r ? h(null) : l();
      else {
        const E = r ? 0 : n, M = E * 4;
        let b = p.clippingState || null;
        c.value = b, b = h(g, d, M, f);
        for (let I = 0; I !== M; ++I) b[I] = t[I];
        p.clippingState = b, this.numIntersection = _ ? this.numPlanes : 0, this.numPlanes += E;
      }
    };
    function l() {
      c.value !== t && (c.value = t, c.needsUpdate = n > 0), e.numPlanes = n, e.numIntersection = 0;
    }
    function h(u, d, f, g) {
      const _ = u !== null ? u.length : 0;
      let m = null;
      if (_ !== 0) {
        if (m = c.value, g !== true || m === null) {
          const p = f + _ * 4, E = d.matrixWorldInverse;
          a.getNormalMatrix(E), (m === null || m.length < p) && (m = new Float32Array(p));
          for (let M = 0, b = f; M !== _; ++M, b += 4) o.copy(u[M]).applyMatrix4(E, a), o.normal.toArray(m, b), m[b + 3] = o.constant;
        }
        c.value = m, c.needsUpdate = true;
      }
      return e.numPlanes = _, e.numIntersection = 0, m;
    }
  }
  function Um(s) {
    let e = /* @__PURE__ */ new WeakMap();
    function t(o, a) {
      return a === la ? o.mapping = Zi : a === ha && (o.mapping = Ji), o;
    }
    function n(o) {
      if (o && o.isTexture) {
        const a = o.mapping;
        if (a === la || a === ha) if (e.has(o)) {
          const c = e.get(o).texture;
          return t(c, o.mapping);
        } else {
          const c = o.image;
          if (c && c.height > 0) {
            const l = new Wd(c.height);
            return l.fromEquirectangularTexture(s, o), e.set(o, l), o.addEventListener("dispose", i), t(l.texture, o.mapping);
          } else return null;
        }
      }
      return o;
    }
    function i(o) {
      const a = o.target;
      a.removeEventListener("dispose", i);
      const c = e.get(a);
      c !== void 0 && (e.delete(a), c.dispose());
    }
    function r() {
      e = /* @__PURE__ */ new WeakMap();
    }
    return {
      get: n,
      dispose: r
    };
  }
  class sc extends Ph {
    constructor(e = -1, t = 1, n = 1, i = -1, r = 0.1, o = 2e3) {
      super(), this.isOrthographicCamera = true, this.type = "OrthographicCamera", this.zoom = 1, this.view = null, this.left = e, this.right = t, this.top = n, this.bottom = i, this.near = r, this.far = o, this.updateProjectionMatrix();
    }
    copy(e, t) {
      return super.copy(e, t), this.left = e.left, this.right = e.right, this.top = e.top, this.bottom = e.bottom, this.near = e.near, this.far = e.far, this.zoom = e.zoom, this.view = e.view === null ? null : Object.assign({}, e.view), this;
    }
    setViewOffset(e, t, n, i, r, o) {
      this.view === null && (this.view = {
        enabled: true,
        fullWidth: 1,
        fullHeight: 1,
        offsetX: 0,
        offsetY: 0,
        width: 1,
        height: 1
      }), this.view.enabled = true, this.view.fullWidth = e, this.view.fullHeight = t, this.view.offsetX = n, this.view.offsetY = i, this.view.width = r, this.view.height = o, this.updateProjectionMatrix();
    }
    clearViewOffset() {
      this.view !== null && (this.view.enabled = false), this.updateProjectionMatrix();
    }
    updateProjectionMatrix() {
      const e = (this.right - this.left) / (2 * this.zoom), t = (this.top - this.bottom) / (2 * this.zoom), n = (this.right + this.left) / 2, i = (this.top + this.bottom) / 2;
      let r = n - e, o = n + e, a = i + t, c = i - t;
      if (this.view !== null && this.view.enabled) {
        const l = (this.right - this.left) / this.view.fullWidth / this.zoom, h = (this.top - this.bottom) / this.view.fullHeight / this.zoom;
        r += l * this.view.offsetX, o = r + l * this.view.width, a -= h * this.view.offsetY, c = a - h * this.view.height;
      }
      this.projectionMatrix.makeOrthographic(r, o, a, c, this.near, this.far, this.coordinateSystem), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
    }
    toJSON(e) {
      const t = super.toJSON(e);
      return t.object.zoom = this.zoom, t.object.left = this.left, t.object.right = this.right, t.object.top = this.top, t.object.bottom = this.bottom, t.object.near = this.near, t.object.far = this.far, this.view !== null && (t.object.view = Object.assign({}, this.view)), t;
    }
  }
  const Hi = 4, Jc = [
    0.125,
    0.215,
    0.35,
    0.446,
    0.526,
    0.582
  ], hi = 20, Lo = new sc(), Qc = new Se();
  let Do = null, Uo = 0, No = 0, Fo = false;
  const ai = (1 + Math.sqrt(5)) / 2, Ii = 1 / ai, el = [
    new R(-ai, Ii, 0),
    new R(ai, Ii, 0),
    new R(-Ii, 0, ai),
    new R(Ii, 0, ai),
    new R(0, ai, -Ii),
    new R(0, ai, Ii),
    new R(-1, 1, -1),
    new R(1, 1, -1),
    new R(-1, 1, 1),
    new R(1, 1, 1)
  ];
  class tl {
    constructor(e) {
      this._renderer = e, this._pingPongRenderTarget = null, this._lodMax = 0, this._cubeSize = 0, this._lodPlanes = [], this._sizeLods = [], this._sigmas = [], this._blurMaterial = null, this._cubemapMaterial = null, this._equirectMaterial = null, this._compileMaterial(this._blurMaterial);
    }
    fromScene(e, t = 0, n = 0.1, i = 100) {
      Do = this._renderer.getRenderTarget(), Uo = this._renderer.getActiveCubeFace(), No = this._renderer.getActiveMipmapLevel(), Fo = this._renderer.xr.enabled, this._renderer.xr.enabled = false, this._setSize(256);
      const r = this._allocateTargets();
      return r.depthBuffer = true, this._sceneToCubeUV(e, n, i, r), t > 0 && this._blur(r, 0, 0, t), this._applyPMREM(r), this._cleanup(r), r;
    }
    fromEquirectangular(e, t = null) {
      return this._fromTexture(e, t);
    }
    fromCubemap(e, t = null) {
      return this._fromTexture(e, t);
    }
    compileCubemapShader() {
      this._cubemapMaterial === null && (this._cubemapMaterial = sl(), this._compileMaterial(this._cubemapMaterial));
    }
    compileEquirectangularShader() {
      this._equirectMaterial === null && (this._equirectMaterial = il(), this._compileMaterial(this._equirectMaterial));
    }
    dispose() {
      this._dispose(), this._cubemapMaterial !== null && this._cubemapMaterial.dispose(), this._equirectMaterial !== null && this._equirectMaterial.dispose();
    }
    _setSize(e) {
      this._lodMax = Math.floor(Math.log2(e)), this._cubeSize = Math.pow(2, this._lodMax);
    }
    _dispose() {
      this._blurMaterial !== null && this._blurMaterial.dispose(), this._pingPongRenderTarget !== null && this._pingPongRenderTarget.dispose();
      for (let e = 0; e < this._lodPlanes.length; e++) this._lodPlanes[e].dispose();
    }
    _cleanup(e) {
      this._renderer.setRenderTarget(Do, Uo, No), this._renderer.xr.enabled = Fo, e.scissorTest = false, ur(e, 0, 0, e.width, e.height);
    }
    _fromTexture(e, t) {
      e.mapping === Zi || e.mapping === Ji ? this._setSize(e.image.length === 0 ? 16 : e.image[0].width || e.image[0].image.width) : this._setSize(e.image.width / 4), Do = this._renderer.getRenderTarget(), Uo = this._renderer.getActiveCubeFace(), No = this._renderer.getActiveMipmapLevel(), Fo = this._renderer.xr.enabled, this._renderer.xr.enabled = false;
      const n = t || this._allocateTargets();
      return this._textureToCubeUV(e, n), this._applyPMREM(n), this._cleanup(n), n;
    }
    _allocateTargets() {
      const e = 3 * Math.max(this._cubeSize, 112), t = 4 * this._cubeSize, n = {
        magFilter: zt,
        minFilter: zt,
        generateMipmaps: false,
        type: zs,
        format: $t,
        colorSpace: Et,
        depthBuffer: false
      }, i = nl(e, t, n);
      if (this._pingPongRenderTarget === null || this._pingPongRenderTarget.width !== e || this._pingPongRenderTarget.height !== t) {
        this._pingPongRenderTarget !== null && this._dispose(), this._pingPongRenderTarget = nl(e, t, n);
        const { _lodMax: r } = this;
        ({ sizeLods: this._sizeLods, lodPlanes: this._lodPlanes, sigmas: this._sigmas } = Nm(r)), this._blurMaterial = Fm(r, e, t);
      }
      return i;
    }
    _compileMaterial(e) {
      const t = new tt(this._lodPlanes[0], e);
      this._renderer.compile(t, Lo);
    }
    _sceneToCubeUV(e, t, n, i) {
      const a = new Ct(90, 1, t, n), c = [
        1,
        -1,
        1,
        1,
        1,
        1
      ], l = [
        1,
        1,
        1,
        -1,
        -1,
        -1
      ], h = this._renderer, u = h.autoClear, d = h.toneMapping;
      h.getClearColor(Qc), h.toneMapping = Kn, h.autoClear = false;
      const f = new Zt({
        name: "PMREM.Background",
        side: Ut,
        depthWrite: false,
        depthTest: false
      }), g = new tt(new Vs(), f);
      let _ = false;
      const m = e.background;
      m ? m.isColor && (f.color.copy(m), e.background = null, _ = true) : (f.color.copy(Qc), _ = true);
      for (let p = 0; p < 6; p++) {
        const E = p % 3;
        E === 0 ? (a.up.set(0, c[p], 0), a.lookAt(l[p], 0, 0)) : E === 1 ? (a.up.set(0, 0, c[p]), a.lookAt(0, l[p], 0)) : (a.up.set(0, c[p], 0), a.lookAt(0, 0, l[p]));
        const M = this._cubeSize;
        ur(i, E * M, p > 2 ? M : 0, M, M), h.setRenderTarget(i), _ && h.render(g, a), h.render(e, a);
      }
      g.geometry.dispose(), g.material.dispose(), h.toneMapping = d, h.autoClear = u, e.background = m;
    }
    _textureToCubeUV(e, t) {
      const n = this._renderer, i = e.mapping === Zi || e.mapping === Ji;
      i ? (this._cubemapMaterial === null && (this._cubemapMaterial = sl()), this._cubemapMaterial.uniforms.flipEnvMap.value = e.isRenderTargetTexture === false ? -1 : 1) : this._equirectMaterial === null && (this._equirectMaterial = il());
      const r = i ? this._cubemapMaterial : this._equirectMaterial, o = new tt(this._lodPlanes[0], r), a = r.uniforms;
      a.envMap.value = e;
      const c = this._cubeSize;
      ur(t, 0, 0, 3 * c, 2 * c), n.setRenderTarget(t), n.render(o, Lo);
    }
    _applyPMREM(e) {
      const t = this._renderer, n = t.autoClear;
      t.autoClear = false;
      const i = this._lodPlanes.length;
      for (let r = 1; r < i; r++) {
        const o = Math.sqrt(this._sigmas[r] * this._sigmas[r] - this._sigmas[r - 1] * this._sigmas[r - 1]), a = el[(i - r - 1) % el.length];
        this._blur(e, r - 1, r, o, a);
      }
      t.autoClear = n;
    }
    _blur(e, t, n, i, r) {
      const o = this._pingPongRenderTarget;
      this._halfBlur(e, o, t, n, i, "latitudinal", r), this._halfBlur(o, e, n, n, i, "longitudinal", r);
    }
    _halfBlur(e, t, n, i, r, o, a) {
      const c = this._renderer, l = this._blurMaterial;
      o !== "latitudinal" && o !== "longitudinal" && console.error("blur direction must be either latitudinal or longitudinal!");
      const h = 3, u = new tt(this._lodPlanes[i], l), d = l.uniforms, f = this._sizeLods[n] - 1, g = isFinite(r) ? Math.PI / (2 * f) : 2 * Math.PI / (2 * hi - 1), _ = r / g, m = isFinite(r) ? 1 + Math.floor(h * _) : hi;
      m > hi && console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${hi}`);
      const p = [];
      let E = 0;
      for (let w = 0; w < hi; ++w) {
        const U = w / _, j = Math.exp(-U * U / 2);
        p.push(j), w === 0 ? E += j : w < m && (E += 2 * j);
      }
      for (let w = 0; w < p.length; w++) p[w] = p[w] / E;
      d.envMap.value = e.texture, d.samples.value = m, d.weights.value = p, d.latitudinal.value = o === "latitudinal", a && (d.poleAxis.value = a);
      const { _lodMax: M } = this;
      d.dTheta.value = g, d.mipInt.value = M - n;
      const b = this._sizeLods[i], I = 3 * b * (i > M - Hi ? i - M + Hi : 0), A = 4 * (this._cubeSize - b);
      ur(t, I, A, 3 * b, 2 * b), c.setRenderTarget(t), c.render(u, Lo);
    }
  }
  function Nm(s) {
    const e = [], t = [], n = [];
    let i = s;
    const r = s - Hi + 1 + Jc.length;
    for (let o = 0; o < r; o++) {
      const a = Math.pow(2, i);
      t.push(a);
      let c = 1 / a;
      o > s - Hi ? c = Jc[o - s + Hi - 1] : o === 0 && (c = 0), n.push(c);
      const l = 1 / (a - 2), h = -l, u = 1 + l, d = [
        h,
        h,
        u,
        h,
        u,
        u,
        h,
        h,
        u,
        u,
        h,
        u
      ], f = 6, g = 6, _ = 3, m = 2, p = 1, E = new Float32Array(_ * g * f), M = new Float32Array(m * g * f), b = new Float32Array(p * g * f);
      for (let A = 0; A < f; A++) {
        const w = A % 3 * 2 / 3 - 1, U = A > 2 ? 0 : -1, j = [
          w,
          U,
          0,
          w + 2 / 3,
          U,
          0,
          w + 2 / 3,
          U + 1,
          0,
          w,
          U,
          0,
          w + 2 / 3,
          U + 1,
          0,
          w,
          U + 1,
          0
        ];
        E.set(j, _ * g * A), M.set(d, m * g * A);
        const x = [
          A,
          A,
          A,
          A,
          A,
          A
        ];
        b.set(x, p * g * A);
      }
      const I = new yt();
      I.setAttribute("position", new vt(E, _)), I.setAttribute("uv", new vt(M, m)), I.setAttribute("faceIndex", new vt(b, p)), e.push(I), i > Hi && i--;
    }
    return {
      lodPlanes: e,
      sizeLods: t,
      sigmas: n
    };
  }
  function nl(s, e, t) {
    const n = new mi(s, e, t);
    return n.texture.mapping = Qr, n.texture.name = "PMREM.cubeUv", n.scissorTest = true, n;
  }
  function ur(s, e, t, n, i) {
    s.viewport.set(e, t, n, i), s.scissor.set(e, t, n, i);
  }
  function Fm(s, e, t) {
    const n = new Float32Array(hi), i = new R(0, 1, 0);
    return new Zn({
      name: "SphericalGaussianBlur",
      defines: {
        n: hi,
        CUBEUV_TEXEL_WIDTH: 1 / e,
        CUBEUV_TEXEL_HEIGHT: 1 / t,
        CUBEUV_MAX_MIP: `${s}.0`
      },
      uniforms: {
        envMap: {
          value: null
        },
        samples: {
          value: 1
        },
        weights: {
          value: n
        },
        latitudinal: {
          value: false
        },
        dTheta: {
          value: 0
        },
        mipInt: {
          value: 0
        },
        poleAxis: {
          value: i
        }
      },
      vertexShader: rc(),
      fragmentShader: `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,
      blending: jn,
      depthTest: false,
      depthWrite: false
    });
  }
  function il() {
    return new Zn({
      name: "EquirectangularToCubeUV",
      uniforms: {
        envMap: {
          value: null
        }
      },
      vertexShader: rc(),
      fragmentShader: `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,
      blending: jn,
      depthTest: false,
      depthWrite: false
    });
  }
  function sl() {
    return new Zn({
      name: "CubemapToCubeUV",
      uniforms: {
        envMap: {
          value: null
        },
        flipEnvMap: {
          value: -1
        }
      },
      vertexShader: rc(),
      fragmentShader: `

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,
      blending: jn,
      depthTest: false,
      depthWrite: false
    });
  }
  function rc() {
    return `

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`;
  }
  function Om(s) {
    let e = /* @__PURE__ */ new WeakMap(), t = null;
    function n(a) {
      if (a && a.isTexture) {
        const c = a.mapping, l = c === la || c === ha, h = c === Zi || c === Ji;
        if (l || h) {
          let u = e.get(a);
          const d = u !== void 0 ? u.texture.pmremVersion : 0;
          if (a.isRenderTargetTexture && a.pmremVersion !== d) return t === null && (t = new tl(s)), u = l ? t.fromEquirectangular(a, u) : t.fromCubemap(a, u), u.texture.pmremVersion = a.pmremVersion, e.set(a, u), u.texture;
          if (u !== void 0) return u.texture;
          {
            const f = a.image;
            return l && f && f.height > 0 || h && f && i(f) ? (t === null && (t = new tl(s)), u = l ? t.fromEquirectangular(a) : t.fromCubemap(a), u.texture.pmremVersion = a.pmremVersion, e.set(a, u), a.addEventListener("dispose", r), u.texture) : null;
          }
        }
      }
      return a;
    }
    function i(a) {
      let c = 0;
      const l = 6;
      for (let h = 0; h < l; h++) a[h] !== void 0 && c++;
      return c === l;
    }
    function r(a) {
      const c = a.target;
      c.removeEventListener("dispose", r);
      const l = e.get(c);
      l !== void 0 && (e.delete(c), l.dispose());
    }
    function o() {
      e = /* @__PURE__ */ new WeakMap(), t !== null && (t.dispose(), t = null);
    }
    return {
      get: n,
      dispose: o
    };
  }
  function Bm(s) {
    const e = {};
    function t(n) {
      if (e[n] !== void 0) return e[n];
      let i;
      switch (n) {
        case "WEBGL_depth_texture":
          i = s.getExtension("WEBGL_depth_texture") || s.getExtension("MOZ_WEBGL_depth_texture") || s.getExtension("WEBKIT_WEBGL_depth_texture");
          break;
        case "EXT_texture_filter_anisotropic":
          i = s.getExtension("EXT_texture_filter_anisotropic") || s.getExtension("MOZ_EXT_texture_filter_anisotropic") || s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
          break;
        case "WEBGL_compressed_texture_s3tc":
          i = s.getExtension("WEBGL_compressed_texture_s3tc") || s.getExtension("MOZ_WEBGL_compressed_texture_s3tc") || s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
          break;
        case "WEBGL_compressed_texture_pvrtc":
          i = s.getExtension("WEBGL_compressed_texture_pvrtc") || s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
          break;
        default:
          i = s.getExtension(n);
      }
      return e[n] = i, i;
    }
    return {
      has: function(n) {
        return t(n) !== null;
      },
      init: function() {
        t("EXT_color_buffer_float"), t("WEBGL_clip_cull_distance"), t("OES_texture_float_linear"), t("EXT_color_buffer_half_float"), t("WEBGL_multisampled_render_to_texture"), t("WEBGL_render_shared_exponent");
      },
      get: function(n) {
        const i = t(n);
        return i === null && Ur("THREE.WebGLRenderer: " + n + " extension not supported."), i;
      }
    };
  }
  function km(s, e, t, n) {
    const i = {}, r = /* @__PURE__ */ new WeakMap();
    function o(u) {
      const d = u.target;
      d.index !== null && e.remove(d.index);
      for (const g in d.attributes) e.remove(d.attributes[g]);
      for (const g in d.morphAttributes) {
        const _ = d.morphAttributes[g];
        for (let m = 0, p = _.length; m < p; m++) e.remove(_[m]);
      }
      d.removeEventListener("dispose", o), delete i[d.id];
      const f = r.get(d);
      f && (e.remove(f), r.delete(d)), n.releaseStatesOfGeometry(d), d.isInstancedBufferGeometry === true && delete d._maxInstanceCount, t.memory.geometries--;
    }
    function a(u, d) {
      return i[d.id] === true || (d.addEventListener("dispose", o), i[d.id] = true, t.memory.geometries++), d;
    }
    function c(u) {
      const d = u.attributes;
      for (const g in d) e.update(d[g], s.ARRAY_BUFFER);
      const f = u.morphAttributes;
      for (const g in f) {
        const _ = f[g];
        for (let m = 0, p = _.length; m < p; m++) e.update(_[m], s.ARRAY_BUFFER);
      }
    }
    function l(u) {
      const d = [], f = u.index, g = u.attributes.position;
      let _ = 0;
      if (f !== null) {
        const E = f.array;
        _ = f.version;
        for (let M = 0, b = E.length; M < b; M += 3) {
          const I = E[M + 0], A = E[M + 1], w = E[M + 2];
          d.push(I, A, A, w, w, I);
        }
      } else if (g !== void 0) {
        const E = g.array;
        _ = g.version;
        for (let M = 0, b = E.length / 3 - 1; M < b; M += 3) {
          const I = M + 0, A = M + 1, w = M + 2;
          d.push(I, A, A, w, w, I);
        }
      } else return;
      const m = new (Sh(d) ? Rh : wh)(d, 1);
      m.version = _;
      const p = r.get(u);
      p && e.remove(p), r.set(u, m);
    }
    function h(u) {
      const d = r.get(u);
      if (d) {
        const f = u.index;
        f !== null && d.version < f.version && l(u);
      } else l(u);
      return r.get(u);
    }
    return {
      get: a,
      update: c,
      getWireframeAttribute: h
    };
  }
  function zm(s, e, t) {
    let n;
    function i(d) {
      n = d;
    }
    let r, o;
    function a(d) {
      r = d.type, o = d.bytesPerElement;
    }
    function c(d, f) {
      s.drawElements(n, f, r, d * o), t.update(f, n, 1);
    }
    function l(d, f, g) {
      g !== 0 && (s.drawElementsInstanced(n, f, r, d * o, g), t.update(f, n, g));
    }
    function h(d, f, g) {
      if (g === 0) return;
      e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n, f, 0, r, d, 0, g);
      let m = 0;
      for (let p = 0; p < g; p++) m += f[p];
      t.update(m, n, 1);
    }
    function u(d, f, g, _) {
      if (g === 0) return;
      const m = e.get("WEBGL_multi_draw");
      if (m === null) for (let p = 0; p < d.length; p++) l(d[p] / o, f[p], _[p]);
      else {
        m.multiDrawElementsInstancedWEBGL(n, f, 0, r, d, 0, _, 0, g);
        let p = 0;
        for (let E = 0; E < g; E++) p += f[E];
        for (let E = 0; E < _.length; E++) t.update(p, n, _[E]);
      }
    }
    this.setMode = i, this.setIndex = a, this.render = c, this.renderInstances = l, this.renderMultiDraw = h, this.renderMultiDrawInstances = u;
  }
  function Hm(s) {
    const e = {
      geometries: 0,
      textures: 0
    }, t = {
      frame: 0,
      calls: 0,
      triangles: 0,
      points: 0,
      lines: 0
    };
    function n(r, o, a) {
      switch (t.calls++, o) {
        case s.TRIANGLES:
          t.triangles += a * (r / 3);
          break;
        case s.LINES:
          t.lines += a * (r / 2);
          break;
        case s.LINE_STRIP:
          t.lines += a * (r - 1);
          break;
        case s.LINE_LOOP:
          t.lines += a * r;
          break;
        case s.POINTS:
          t.points += a * r;
          break;
        default:
          console.error("THREE.WebGLInfo: Unknown draw mode:", o);
          break;
      }
    }
    function i() {
      t.calls = 0, t.triangles = 0, t.points = 0, t.lines = 0;
    }
    return {
      memory: e,
      render: t,
      programs: null,
      autoReset: true,
      reset: i,
      update: n
    };
  }
  function Vm(s, e, t) {
    const n = /* @__PURE__ */ new WeakMap(), i = new Ye();
    function r(o, a, c) {
      const l = o.morphTargetInfluences, h = a.morphAttributes.position || a.morphAttributes.normal || a.morphAttributes.color, u = h !== void 0 ? h.length : 0;
      let d = n.get(a);
      if (d === void 0 || d.count !== u) {
        let j = function() {
          w.dispose(), n.delete(a), a.removeEventListener("dispose", j);
        };
        d !== void 0 && d.texture.dispose();
        const f = a.morphAttributes.position !== void 0, g = a.morphAttributes.normal !== void 0, _ = a.morphAttributes.color !== void 0, m = a.morphAttributes.position || [], p = a.morphAttributes.normal || [], E = a.morphAttributes.color || [];
        let M = 0;
        f === true && (M = 1), g === true && (M = 2), _ === true && (M = 3);
        let b = a.attributes.position.count * M, I = 1;
        b > e.maxTextureSize && (I = Math.ceil(b / e.maxTextureSize), b = e.maxTextureSize);
        const A = new Float32Array(b * I * 4 * u), w = new bh(A, b, I, u);
        w.type = on, w.needsUpdate = true;
        const U = M * 4;
        for (let x = 0; x < u; x++) {
          const S = m[x], k = p[x], B = E[x], H = b * I * 4 * x;
          for (let K = 0; K < S.count; K++) {
            const z = K * U;
            f === true && (i.fromBufferAttribute(S, K), A[H + z + 0] = i.x, A[H + z + 1] = i.y, A[H + z + 2] = i.z, A[H + z + 3] = 0), g === true && (i.fromBufferAttribute(k, K), A[H + z + 4] = i.x, A[H + z + 5] = i.y, A[H + z + 6] = i.z, A[H + z + 7] = 0), _ === true && (i.fromBufferAttribute(B, K), A[H + z + 8] = i.x, A[H + z + 9] = i.y, A[H + z + 10] = i.z, A[H + z + 11] = B.itemSize === 4 ? i.w : 1);
          }
        }
        d = {
          count: u,
          texture: w,
          size: new ye(b, I)
        }, n.set(a, d), a.addEventListener("dispose", j);
      }
      if (o.isInstancedMesh === true && o.morphTexture !== null) c.getUniforms().setValue(s, "morphTexture", o.morphTexture, t);
      else {
        let f = 0;
        for (let _ = 0; _ < l.length; _++) f += l[_];
        const g = a.morphTargetsRelative ? 1 : 1 - f;
        c.getUniforms().setValue(s, "morphTargetBaseInfluence", g), c.getUniforms().setValue(s, "morphTargetInfluences", l);
      }
      c.getUniforms().setValue(s, "morphTargetsTexture", d.texture, t), c.getUniforms().setValue(s, "morphTargetsTextureSize", d.size);
    }
    return {
      update: r
    };
  }
  function Gm(s, e, t, n) {
    let i = /* @__PURE__ */ new WeakMap();
    function r(c) {
      const l = n.render.frame, h = c.geometry, u = e.get(c, h);
      if (i.get(u) !== l && (e.update(u), i.set(u, l)), c.isInstancedMesh && (c.hasEventListener("dispose", a) === false && c.addEventListener("dispose", a), i.get(c) !== l && (t.update(c.instanceMatrix, s.ARRAY_BUFFER), c.instanceColor !== null && t.update(c.instanceColor, s.ARRAY_BUFFER), i.set(c, l))), c.isSkinnedMesh) {
        const d = c.skeleton;
        i.get(d) !== l && (d.update(), i.set(d, l));
      }
      return u;
    }
    function o() {
      i = /* @__PURE__ */ new WeakMap();
    }
    function a(c) {
      const l = c.target;
      l.removeEventListener("dispose", a), t.remove(l.instanceMatrix), l.instanceColor !== null && t.remove(l.instanceColor);
    }
    return {
      update: r,
      dispose: o
    };
  }
  class Dh extends mt {
    constructor(e, t, n, i, r, o, a, c, l, h = qi) {
      if (h !== qi && h !== ts) throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");
      n === void 0 && h === qi && (n = pi), n === void 0 && h === ts && (n = es), super(null, i, r, o, a, c, h, n, l), this.isDepthTexture = true, this.image = {
        width: e,
        height: t
      }, this.magFilter = a !== void 0 ? a : Pt, this.minFilter = c !== void 0 ? c : Pt, this.flipY = false, this.generateMipmaps = false, this.compareFunction = null;
    }
    copy(e) {
      return super.copy(e), this.compareFunction = e.compareFunction, this;
    }
    toJSON(e) {
      const t = super.toJSON(e);
      return this.compareFunction !== null && (t.compareFunction = this.compareFunction), t;
    }
  }
  const Uh = new mt(), rl = new Dh(1, 1), Nh = new bh(), Fh = new Rd(), Oh = new Ih(), ol = [], al = [], cl = new Float32Array(16), ll = new Float32Array(9), hl = new Float32Array(4);
  function as(s, e, t) {
    const n = s[0];
    if (n <= 0 || n > 0) return s;
    const i = e * t;
    let r = ol[i];
    if (r === void 0 && (r = new Float32Array(i), ol[i] = r), e !== 0) {
      n.toArray(r, 0);
      for (let o = 1, a = 0; o !== e; ++o) a += t, s[o].toArray(r, a);
    }
    return r;
  }
  function gt(s, e) {
    if (s.length !== e.length) return false;
    for (let t = 0, n = s.length; t < n; t++) if (s[t] !== e[t]) return false;
    return true;
  }
  function _t(s, e) {
    for (let t = 0, n = e.length; t < n; t++) s[t] = e[t];
  }
  function to(s, e) {
    let t = al[e];
    t === void 0 && (t = new Int32Array(e), al[e] = t);
    for (let n = 0; n !== e; ++n) t[n] = s.allocateTextureUnit();
    return t;
  }
  function Wm(s, e) {
    const t = this.cache;
    t[0] !== e && (s.uniform1f(this.addr, e), t[0] = e);
  }
  function Xm(s, e) {
    const t = this.cache;
    if (e.x !== void 0) (t[0] !== e.x || t[1] !== e.y) && (s.uniform2f(this.addr, e.x, e.y), t[0] = e.x, t[1] = e.y);
    else {
      if (gt(t, e)) return;
      s.uniform2fv(this.addr, e), _t(t, e);
    }
  }
  function Ym(s, e) {
    const t = this.cache;
    if (e.x !== void 0) (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z) && (s.uniform3f(this.addr, e.x, e.y, e.z), t[0] = e.x, t[1] = e.y, t[2] = e.z);
    else if (e.r !== void 0) (t[0] !== e.r || t[1] !== e.g || t[2] !== e.b) && (s.uniform3f(this.addr, e.r, e.g, e.b), t[0] = e.r, t[1] = e.g, t[2] = e.b);
    else {
      if (gt(t, e)) return;
      s.uniform3fv(this.addr, e), _t(t, e);
    }
  }
  function qm(s, e) {
    const t = this.cache;
    if (e.x !== void 0) (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z || t[3] !== e.w) && (s.uniform4f(this.addr, e.x, e.y, e.z, e.w), t[0] = e.x, t[1] = e.y, t[2] = e.z, t[3] = e.w);
    else {
      if (gt(t, e)) return;
      s.uniform4fv(this.addr, e), _t(t, e);
    }
  }
  function jm(s, e) {
    const t = this.cache, n = e.elements;
    if (n === void 0) {
      if (gt(t, e)) return;
      s.uniformMatrix2fv(this.addr, false, e), _t(t, e);
    } else {
      if (gt(t, n)) return;
      hl.set(n), s.uniformMatrix2fv(this.addr, false, hl), _t(t, n);
    }
  }
  function Km(s, e) {
    const t = this.cache, n = e.elements;
    if (n === void 0) {
      if (gt(t, e)) return;
      s.uniformMatrix3fv(this.addr, false, e), _t(t, e);
    } else {
      if (gt(t, n)) return;
      ll.set(n), s.uniformMatrix3fv(this.addr, false, ll), _t(t, n);
    }
  }
  function $m(s, e) {
    const t = this.cache, n = e.elements;
    if (n === void 0) {
      if (gt(t, e)) return;
      s.uniformMatrix4fv(this.addr, false, e), _t(t, e);
    } else {
      if (gt(t, n)) return;
      cl.set(n), s.uniformMatrix4fv(this.addr, false, cl), _t(t, n);
    }
  }
  function Zm(s, e) {
    const t = this.cache;
    t[0] !== e && (s.uniform1i(this.addr, e), t[0] = e);
  }
  function Jm(s, e) {
    const t = this.cache;
    if (e.x !== void 0) (t[0] !== e.x || t[1] !== e.y) && (s.uniform2i(this.addr, e.x, e.y), t[0] = e.x, t[1] = e.y);
    else {
      if (gt(t, e)) return;
      s.uniform2iv(this.addr, e), _t(t, e);
    }
  }
  function Qm(s, e) {
    const t = this.cache;
    if (e.x !== void 0) (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z) && (s.uniform3i(this.addr, e.x, e.y, e.z), t[0] = e.x, t[1] = e.y, t[2] = e.z);
    else {
      if (gt(t, e)) return;
      s.uniform3iv(this.addr, e), _t(t, e);
    }
  }
  function eg(s, e) {
    const t = this.cache;
    if (e.x !== void 0) (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z || t[3] !== e.w) && (s.uniform4i(this.addr, e.x, e.y, e.z, e.w), t[0] = e.x, t[1] = e.y, t[2] = e.z, t[3] = e.w);
    else {
      if (gt(t, e)) return;
      s.uniform4iv(this.addr, e), _t(t, e);
    }
  }
  function tg(s, e) {
    const t = this.cache;
    t[0] !== e && (s.uniform1ui(this.addr, e), t[0] = e);
  }
  function ng(s, e) {
    const t = this.cache;
    if (e.x !== void 0) (t[0] !== e.x || t[1] !== e.y) && (s.uniform2ui(this.addr, e.x, e.y), t[0] = e.x, t[1] = e.y);
    else {
      if (gt(t, e)) return;
      s.uniform2uiv(this.addr, e), _t(t, e);
    }
  }
  function ig(s, e) {
    const t = this.cache;
    if (e.x !== void 0) (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z) && (s.uniform3ui(this.addr, e.x, e.y, e.z), t[0] = e.x, t[1] = e.y, t[2] = e.z);
    else {
      if (gt(t, e)) return;
      s.uniform3uiv(this.addr, e), _t(t, e);
    }
  }
  function sg(s, e) {
    const t = this.cache;
    if (e.x !== void 0) (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z || t[3] !== e.w) && (s.uniform4ui(this.addr, e.x, e.y, e.z, e.w), t[0] = e.x, t[1] = e.y, t[2] = e.z, t[3] = e.w);
    else {
      if (gt(t, e)) return;
      s.uniform4uiv(this.addr, e), _t(t, e);
    }
  }
  function rg(s, e, t) {
    const n = this.cache, i = t.allocateTextureUnit();
    n[0] !== i && (s.uniform1i(this.addr, i), n[0] = i);
    let r;
    this.type === s.SAMPLER_2D_SHADOW ? (rl.compareFunction = Mh, r = rl) : r = Uh, t.setTexture2D(e || r, i);
  }
  function og(s, e, t) {
    const n = this.cache, i = t.allocateTextureUnit();
    n[0] !== i && (s.uniform1i(this.addr, i), n[0] = i), t.setTexture3D(e || Fh, i);
  }
  function ag(s, e, t) {
    const n = this.cache, i = t.allocateTextureUnit();
    n[0] !== i && (s.uniform1i(this.addr, i), n[0] = i), t.setTextureCube(e || Oh, i);
  }
  function cg(s, e, t) {
    const n = this.cache, i = t.allocateTextureUnit();
    n[0] !== i && (s.uniform1i(this.addr, i), n[0] = i), t.setTexture2DArray(e || Nh, i);
  }
  function lg(s) {
    switch (s) {
      case 5126:
        return Wm;
      case 35664:
        return Xm;
      case 35665:
        return Ym;
      case 35666:
        return qm;
      case 35674:
        return jm;
      case 35675:
        return Km;
      case 35676:
        return $m;
      case 5124:
      case 35670:
        return Zm;
      case 35667:
      case 35671:
        return Jm;
      case 35668:
      case 35672:
        return Qm;
      case 35669:
      case 35673:
        return eg;
      case 5125:
        return tg;
      case 36294:
        return ng;
      case 36295:
        return ig;
      case 36296:
        return sg;
      case 35678:
      case 36198:
      case 36298:
      case 36306:
      case 35682:
        return rg;
      case 35679:
      case 36299:
      case 36307:
        return og;
      case 35680:
      case 36300:
      case 36308:
      case 36293:
        return ag;
      case 36289:
      case 36303:
      case 36311:
      case 36292:
        return cg;
    }
  }
  function hg(s, e) {
    s.uniform1fv(this.addr, e);
  }
  function ug(s, e) {
    const t = as(e, this.size, 2);
    s.uniform2fv(this.addr, t);
  }
  function dg(s, e) {
    const t = as(e, this.size, 3);
    s.uniform3fv(this.addr, t);
  }
  function fg(s, e) {
    const t = as(e, this.size, 4);
    s.uniform4fv(this.addr, t);
  }
  function pg(s, e) {
    const t = as(e, this.size, 4);
    s.uniformMatrix2fv(this.addr, false, t);
  }
  function mg(s, e) {
    const t = as(e, this.size, 9);
    s.uniformMatrix3fv(this.addr, false, t);
  }
  function gg(s, e) {
    const t = as(e, this.size, 16);
    s.uniformMatrix4fv(this.addr, false, t);
  }
  function _g(s, e) {
    s.uniform1iv(this.addr, e);
  }
  function xg(s, e) {
    s.uniform2iv(this.addr, e);
  }
  function vg(s, e) {
    s.uniform3iv(this.addr, e);
  }
  function yg(s, e) {
    s.uniform4iv(this.addr, e);
  }
  function Mg(s, e) {
    s.uniform1uiv(this.addr, e);
  }
  function Sg(s, e) {
    s.uniform2uiv(this.addr, e);
  }
  function Eg(s, e) {
    s.uniform3uiv(this.addr, e);
  }
  function bg(s, e) {
    s.uniform4uiv(this.addr, e);
  }
  function Tg(s, e, t) {
    const n = this.cache, i = e.length, r = to(t, i);
    gt(n, r) || (s.uniform1iv(this.addr, r), _t(n, r));
    for (let o = 0; o !== i; ++o) t.setTexture2D(e[o] || Uh, r[o]);
  }
  function Ag(s, e, t) {
    const n = this.cache, i = e.length, r = to(t, i);
    gt(n, r) || (s.uniform1iv(this.addr, r), _t(n, r));
    for (let o = 0; o !== i; ++o) t.setTexture3D(e[o] || Fh, r[o]);
  }
  function wg(s, e, t) {
    const n = this.cache, i = e.length, r = to(t, i);
    gt(n, r) || (s.uniform1iv(this.addr, r), _t(n, r));
    for (let o = 0; o !== i; ++o) t.setTextureCube(e[o] || Oh, r[o]);
  }
  function Rg(s, e, t) {
    const n = this.cache, i = e.length, r = to(t, i);
    gt(n, r) || (s.uniform1iv(this.addr, r), _t(n, r));
    for (let o = 0; o !== i; ++o) t.setTexture2DArray(e[o] || Nh, r[o]);
  }
  function Cg(s) {
    switch (s) {
      case 5126:
        return hg;
      case 35664:
        return ug;
      case 35665:
        return dg;
      case 35666:
        return fg;
      case 35674:
        return pg;
      case 35675:
        return mg;
      case 35676:
        return gg;
      case 5124:
      case 35670:
        return _g;
      case 35667:
      case 35671:
        return xg;
      case 35668:
      case 35672:
        return vg;
      case 35669:
      case 35673:
        return yg;
      case 5125:
        return Mg;
      case 36294:
        return Sg;
      case 36295:
        return Eg;
      case 36296:
        return bg;
      case 35678:
      case 36198:
      case 36298:
      case 36306:
      case 35682:
        return Tg;
      case 35679:
      case 36299:
      case 36307:
        return Ag;
      case 35680:
      case 36300:
      case 36308:
      case 36293:
        return wg;
      case 36289:
      case 36303:
      case 36311:
      case 36292:
        return Rg;
    }
  }
  class Pg {
    constructor(e, t, n) {
      this.id = e, this.addr = n, this.cache = [], this.type = t.type, this.setValue = lg(t.type);
    }
  }
  class Ig {
    constructor(e, t, n) {
      this.id = e, this.addr = n, this.cache = [], this.type = t.type, this.size = t.size, this.setValue = Cg(t.type);
    }
  }
  class Lg {
    constructor(e) {
      this.id = e, this.seq = [], this.map = {};
    }
    setValue(e, t, n) {
      const i = this.seq;
      for (let r = 0, o = i.length; r !== o; ++r) {
        const a = i[r];
        a.setValue(e, t[a.id], n);
      }
    }
  }
  const Oo = /(\w+)(\])?(\[|\.)?/g;
  function ul(s, e) {
    s.seq.push(e), s.map[e.id] = e;
  }
  function Dg(s, e, t) {
    const n = s.name, i = n.length;
    for (Oo.lastIndex = 0; ; ) {
      const r = Oo.exec(n), o = Oo.lastIndex;
      let a = r[1];
      const c = r[2] === "]", l = r[3];
      if (c && (a = a | 0), l === void 0 || l === "[" && o + 2 === i) {
        ul(t, l === void 0 ? new Pg(a, s, e) : new Ig(a, s, e));
        break;
      } else {
        let u = t.map[a];
        u === void 0 && (u = new Lg(a), ul(t, u)), t = u;
      }
    }
  }
  class Nr {
    constructor(e, t) {
      this.seq = [], this.map = {};
      const n = e.getProgramParameter(t, e.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; ++i) {
        const r = e.getActiveUniform(t, i), o = e.getUniformLocation(t, r.name);
        Dg(r, o, this);
      }
    }
    setValue(e, t, n, i) {
      const r = this.map[t];
      r !== void 0 && r.setValue(e, n, i);
    }
    setOptional(e, t, n) {
      const i = t[n];
      i !== void 0 && this.setValue(e, n, i);
    }
    static upload(e, t, n, i) {
      for (let r = 0, o = t.length; r !== o; ++r) {
        const a = t[r], c = n[a.id];
        c.needsUpdate !== false && a.setValue(e, c.value, i);
      }
    }
    static seqWithValue(e, t) {
      const n = [];
      for (let i = 0, r = e.length; i !== r; ++i) {
        const o = e[i];
        o.id in t && n.push(o);
      }
      return n;
    }
  }
  function dl(s, e, t) {
    const n = s.createShader(e);
    return s.shaderSource(n, t), s.compileShader(n), n;
  }
  const Ug = 37297;
  let Ng = 0;
  function Fg(s, e) {
    const t = s.split(`
`), n = [], i = Math.max(e - 6, 0), r = Math.min(e + 6, t.length);
    for (let o = i; o < r; o++) {
      const a = o + 1;
      n.push(`${a === e ? ">" : " "} ${a}: ${t[o]}`);
    }
    return n.join(`
`);
  }
  function Og(s) {
    const e = Ge.getPrimaries(Ge.workingColorSpace), t = Ge.getPrimaries(s);
    let n;
    switch (e === t ? n = "" : e === Yr && t === Xr ? n = "LinearDisplayP3ToLinearSRGB" : e === Xr && t === Yr && (n = "LinearSRGBToLinearDisplayP3"), s) {
      case Et:
      case eo:
        return [
          n,
          "LinearTransferOETF"
        ];
      case Rt:
      case tc:
        return [
          n,
          "sRGBTransferOETF"
        ];
      default:
        return console.warn("THREE.WebGLProgram: Unsupported color space:", s), [
          n,
          "LinearTransferOETF"
        ];
    }
  }
  function fl(s, e, t) {
    const n = s.getShaderParameter(e, s.COMPILE_STATUS), i = s.getShaderInfoLog(e).trim();
    if (n && i === "") return "";
    const r = /ERROR: 0:(\d+)/.exec(i);
    if (r) {
      const o = parseInt(r[1]);
      return t.toUpperCase() + `

` + i + `

` + Fg(s.getShaderSource(e), o);
    } else return i;
  }
  function Bg(s, e) {
    const t = Og(e);
    return `vec4 ${s}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`;
  }
  function kg(s, e) {
    let t;
    switch (e) {
      case Nu:
        t = "Linear";
        break;
      case Fu:
        t = "Reinhard";
        break;
      case Ou:
        t = "Cineon";
        break;
      case Bu:
        t = "ACESFilmic";
        break;
      case zu:
        t = "AgX";
        break;
      case Hu:
        t = "Neutral";
        break;
      case ku:
        t = "Custom";
        break;
      default:
        console.warn("THREE.WebGLProgram: Unsupported toneMapping:", e), t = "Linear";
    }
    return "vec3 " + s + "( vec3 color ) { return " + t + "ToneMapping( color ); }";
  }
  const dr = new R();
  function zg() {
    Ge.getLuminanceCoefficients(dr);
    const s = dr.x.toFixed(4), e = dr.y.toFixed(4), t = dr.z.toFixed(4);
    return [
      "float luminance( const in vec3 rgb ) {",
      `	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,
      "	return dot( weights, rgb );",
      "}"
    ].join(`
`);
  }
  function Hg(s) {
    return [
      s.extensionClipCullDistance ? "#extension GL_ANGLE_clip_cull_distance : require" : "",
      s.extensionMultiDraw ? "#extension GL_ANGLE_multi_draw : require" : ""
    ].filter(As).join(`
`);
  }
  function Vg(s) {
    const e = [];
    for (const t in s) {
      const n = s[t];
      n !== false && e.push("#define " + t + " " + n);
    }
    return e.join(`
`);
  }
  function Gg(s, e) {
    const t = {}, n = s.getProgramParameter(e, s.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < n; i++) {
      const r = s.getActiveAttrib(e, i), o = r.name;
      let a = 1;
      r.type === s.FLOAT_MAT2 && (a = 2), r.type === s.FLOAT_MAT3 && (a = 3), r.type === s.FLOAT_MAT4 && (a = 4), t[o] = {
        type: r.type,
        location: s.getAttribLocation(e, o),
        locationSize: a
      };
    }
    return t;
  }
  function As(s) {
    return s !== "";
  }
  function pl(s, e) {
    const t = e.numSpotLightShadows + e.numSpotLightMaps - e.numSpotLightShadowsWithMaps;
    return s.replace(/NUM_DIR_LIGHTS/g, e.numDirLights).replace(/NUM_SPOT_LIGHTS/g, e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g, e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g, t).replace(/NUM_RECT_AREA_LIGHTS/g, e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g, e.numPointLights).replace(/NUM_HEMI_LIGHTS/g, e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g, e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g, e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g, e.numPointLightShadows);
  }
  function ml(s, e) {
    return s.replace(/NUM_CLIPPING_PLANES/g, e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g, e.numClippingPlanes - e.numClipIntersection);
  }
  const Wg = /^[ \t]*#include +<([\w\d./]+)>/gm;
  function ka(s) {
    return s.replace(Wg, Yg);
  }
  const Xg = /* @__PURE__ */ new Map();
  function Yg(s, e) {
    let t = Le[e];
    if (t === void 0) {
      const n = Xg.get(e);
      if (n !== void 0) t = Le[n], console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.', e, n);
      else throw new Error("Can not resolve #include <" + e + ">");
    }
    return ka(t);
  }
  const qg = /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
  function gl(s) {
    return s.replace(qg, jg);
  }
  function jg(s, e, t, n) {
    let i = "";
    for (let r = parseInt(e); r < parseInt(t); r++) i += n.replace(/\[\s*i\s*\]/g, "[ " + r + " ]").replace(/UNROLLED_LOOP_INDEX/g, r);
    return i;
  }
  function _l(s) {
    let e = `precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;
    return s.precision === "highp" ? e += `
#define HIGH_PRECISION` : s.precision === "mediump" ? e += `
#define MEDIUM_PRECISION` : s.precision === "lowp" && (e += `
#define LOW_PRECISION`), e;
  }
  function Kg(s) {
    let e = "SHADOWMAP_TYPE_BASIC";
    return s.shadowMapType === rh ? e = "SHADOWMAP_TYPE_PCF" : s.shadowMapType === pu ? e = "SHADOWMAP_TYPE_PCF_SOFT" : s.shadowMapType === bn && (e = "SHADOWMAP_TYPE_VSM"), e;
  }
  function $g(s) {
    let e = "ENVMAP_TYPE_CUBE";
    if (s.envMap) switch (s.envMapMode) {
      case Zi:
      case Ji:
        e = "ENVMAP_TYPE_CUBE";
        break;
      case Qr:
        e = "ENVMAP_TYPE_CUBE_UV";
        break;
    }
    return e;
  }
  function Zg(s) {
    let e = "ENVMAP_MODE_REFLECTION";
    if (s.envMap) switch (s.envMapMode) {
      case Ji:
        e = "ENVMAP_MODE_REFRACTION";
        break;
    }
    return e;
  }
  function Jg(s) {
    let e = "ENVMAP_BLENDING_NONE";
    if (s.envMap) switch (s.combine) {
      case oh:
        e = "ENVMAP_BLENDING_MULTIPLY";
        break;
      case Du:
        e = "ENVMAP_BLENDING_MIX";
        break;
      case Uu:
        e = "ENVMAP_BLENDING_ADD";
        break;
    }
    return e;
  }
  function Qg(s) {
    const e = s.envMapCubeUVHeight;
    if (e === null) return null;
    const t = Math.log2(e) - 2, n = 1 / e;
    return {
      texelWidth: 1 / (3 * Math.max(Math.pow(2, t), 7 * 16)),
      texelHeight: n,
      maxMip: t
    };
  }
  function e_(s, e, t, n) {
    const i = s.getContext(), r = t.defines;
    let o = t.vertexShader, a = t.fragmentShader;
    const c = Kg(t), l = $g(t), h = Zg(t), u = Jg(t), d = Qg(t), f = Hg(t), g = Vg(r), _ = i.createProgram();
    let m, p, E = t.glslVersion ? "#version " + t.glslVersion + `
` : "";
    t.isRawShaderMaterial ? (m = [
      "#define SHADER_TYPE " + t.shaderType,
      "#define SHADER_NAME " + t.shaderName,
      g
    ].filter(As).join(`
`), m.length > 0 && (m += `
`), p = [
      "#define SHADER_TYPE " + t.shaderType,
      "#define SHADER_NAME " + t.shaderName,
      g
    ].filter(As).join(`
`), p.length > 0 && (p += `
`)) : (m = [
      _l(t),
      "#define SHADER_TYPE " + t.shaderType,
      "#define SHADER_NAME " + t.shaderName,
      g,
      t.extensionClipCullDistance ? "#define USE_CLIP_DISTANCE" : "",
      t.batching ? "#define USE_BATCHING" : "",
      t.batchingColor ? "#define USE_BATCHING_COLOR" : "",
      t.instancing ? "#define USE_INSTANCING" : "",
      t.instancingColor ? "#define USE_INSTANCING_COLOR" : "",
      t.instancingMorph ? "#define USE_INSTANCING_MORPH" : "",
      t.useFog && t.fog ? "#define USE_FOG" : "",
      t.useFog && t.fogExp2 ? "#define FOG_EXP2" : "",
      t.map ? "#define USE_MAP" : "",
      t.envMap ? "#define USE_ENVMAP" : "",
      t.envMap ? "#define " + h : "",
      t.lightMap ? "#define USE_LIGHTMAP" : "",
      t.aoMap ? "#define USE_AOMAP" : "",
      t.bumpMap ? "#define USE_BUMPMAP" : "",
      t.normalMap ? "#define USE_NORMALMAP" : "",
      t.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
      t.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
      t.displacementMap ? "#define USE_DISPLACEMENTMAP" : "",
      t.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
      t.anisotropy ? "#define USE_ANISOTROPY" : "",
      t.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
      t.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
      t.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
      t.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
      t.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
      t.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
      t.specularMap ? "#define USE_SPECULARMAP" : "",
      t.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
      t.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
      t.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
      t.metalnessMap ? "#define USE_METALNESSMAP" : "",
      t.alphaMap ? "#define USE_ALPHAMAP" : "",
      t.alphaHash ? "#define USE_ALPHAHASH" : "",
      t.transmission ? "#define USE_TRANSMISSION" : "",
      t.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
      t.thicknessMap ? "#define USE_THICKNESSMAP" : "",
      t.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
      t.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
      t.mapUv ? "#define MAP_UV " + t.mapUv : "",
      t.alphaMapUv ? "#define ALPHAMAP_UV " + t.alphaMapUv : "",
      t.lightMapUv ? "#define LIGHTMAP_UV " + t.lightMapUv : "",
      t.aoMapUv ? "#define AOMAP_UV " + t.aoMapUv : "",
      t.emissiveMapUv ? "#define EMISSIVEMAP_UV " + t.emissiveMapUv : "",
      t.bumpMapUv ? "#define BUMPMAP_UV " + t.bumpMapUv : "",
      t.normalMapUv ? "#define NORMALMAP_UV " + t.normalMapUv : "",
      t.displacementMapUv ? "#define DISPLACEMENTMAP_UV " + t.displacementMapUv : "",
      t.metalnessMapUv ? "#define METALNESSMAP_UV " + t.metalnessMapUv : "",
      t.roughnessMapUv ? "#define ROUGHNESSMAP_UV " + t.roughnessMapUv : "",
      t.anisotropyMapUv ? "#define ANISOTROPYMAP_UV " + t.anisotropyMapUv : "",
      t.clearcoatMapUv ? "#define CLEARCOATMAP_UV " + t.clearcoatMapUv : "",
      t.clearcoatNormalMapUv ? "#define CLEARCOAT_NORMALMAP_UV " + t.clearcoatNormalMapUv : "",
      t.clearcoatRoughnessMapUv ? "#define CLEARCOAT_ROUGHNESSMAP_UV " + t.clearcoatRoughnessMapUv : "",
      t.iridescenceMapUv ? "#define IRIDESCENCEMAP_UV " + t.iridescenceMapUv : "",
      t.iridescenceThicknessMapUv ? "#define IRIDESCENCE_THICKNESSMAP_UV " + t.iridescenceThicknessMapUv : "",
      t.sheenColorMapUv ? "#define SHEEN_COLORMAP_UV " + t.sheenColorMapUv : "",
      t.sheenRoughnessMapUv ? "#define SHEEN_ROUGHNESSMAP_UV " + t.sheenRoughnessMapUv : "",
      t.specularMapUv ? "#define SPECULARMAP_UV " + t.specularMapUv : "",
      t.specularColorMapUv ? "#define SPECULAR_COLORMAP_UV " + t.specularColorMapUv : "",
      t.specularIntensityMapUv ? "#define SPECULAR_INTENSITYMAP_UV " + t.specularIntensityMapUv : "",
      t.transmissionMapUv ? "#define TRANSMISSIONMAP_UV " + t.transmissionMapUv : "",
      t.thicknessMapUv ? "#define THICKNESSMAP_UV " + t.thicknessMapUv : "",
      t.vertexTangents && t.flatShading === false ? "#define USE_TANGENT" : "",
      t.vertexColors ? "#define USE_COLOR" : "",
      t.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
      t.vertexUv1s ? "#define USE_UV1" : "",
      t.vertexUv2s ? "#define USE_UV2" : "",
      t.vertexUv3s ? "#define USE_UV3" : "",
      t.pointsUvs ? "#define USE_POINTS_UV" : "",
      t.flatShading ? "#define FLAT_SHADED" : "",
      t.skinning ? "#define USE_SKINNING" : "",
      t.morphTargets ? "#define USE_MORPHTARGETS" : "",
      t.morphNormals && t.flatShading === false ? "#define USE_MORPHNORMALS" : "",
      t.morphColors ? "#define USE_MORPHCOLORS" : "",
      t.morphTargetsCount > 0 ? "#define MORPHTARGETS_TEXTURE_STRIDE " + t.morphTextureStride : "",
      t.morphTargetsCount > 0 ? "#define MORPHTARGETS_COUNT " + t.morphTargetsCount : "",
      t.doubleSided ? "#define DOUBLE_SIDED" : "",
      t.flipSided ? "#define FLIP_SIDED" : "",
      t.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
      t.shadowMapEnabled ? "#define " + c : "",
      t.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "",
      t.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
      t.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
      t.reverseDepthBuffer ? "#define USE_REVERSEDEPTHBUF" : "",
      "uniform mat4 modelMatrix;",
      "uniform mat4 modelViewMatrix;",
      "uniform mat4 projectionMatrix;",
      "uniform mat4 viewMatrix;",
      "uniform mat3 normalMatrix;",
      "uniform vec3 cameraPosition;",
      "uniform bool isOrthographic;",
      "#ifdef USE_INSTANCING",
      "	attribute mat4 instanceMatrix;",
      "#endif",
      "#ifdef USE_INSTANCING_COLOR",
      "	attribute vec3 instanceColor;",
      "#endif",
      "#ifdef USE_INSTANCING_MORPH",
      "	uniform sampler2D morphTexture;",
      "#endif",
      "attribute vec3 position;",
      "attribute vec3 normal;",
      "attribute vec2 uv;",
      "#ifdef USE_UV1",
      "	attribute vec2 uv1;",
      "#endif",
      "#ifdef USE_UV2",
      "	attribute vec2 uv2;",
      "#endif",
      "#ifdef USE_UV3",
      "	attribute vec2 uv3;",
      "#endif",
      "#ifdef USE_TANGENT",
      "	attribute vec4 tangent;",
      "#endif",
      "#if defined( USE_COLOR_ALPHA )",
      "	attribute vec4 color;",
      "#elif defined( USE_COLOR )",
      "	attribute vec3 color;",
      "#endif",
      "#ifdef USE_SKINNING",
      "	attribute vec4 skinIndex;",
      "	attribute vec4 skinWeight;",
      "#endif",
      `
`
    ].filter(As).join(`
`), p = [
      _l(t),
      "#define SHADER_TYPE " + t.shaderType,
      "#define SHADER_NAME " + t.shaderName,
      g,
      t.useFog && t.fog ? "#define USE_FOG" : "",
      t.useFog && t.fogExp2 ? "#define FOG_EXP2" : "",
      t.alphaToCoverage ? "#define ALPHA_TO_COVERAGE" : "",
      t.map ? "#define USE_MAP" : "",
      t.matcap ? "#define USE_MATCAP" : "",
      t.envMap ? "#define USE_ENVMAP" : "",
      t.envMap ? "#define " + l : "",
      t.envMap ? "#define " + h : "",
      t.envMap ? "#define " + u : "",
      d ? "#define CUBEUV_TEXEL_WIDTH " + d.texelWidth : "",
      d ? "#define CUBEUV_TEXEL_HEIGHT " + d.texelHeight : "",
      d ? "#define CUBEUV_MAX_MIP " + d.maxMip + ".0" : "",
      t.lightMap ? "#define USE_LIGHTMAP" : "",
      t.aoMap ? "#define USE_AOMAP" : "",
      t.bumpMap ? "#define USE_BUMPMAP" : "",
      t.normalMap ? "#define USE_NORMALMAP" : "",
      t.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
      t.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
      t.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
      t.anisotropy ? "#define USE_ANISOTROPY" : "",
      t.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
      t.clearcoat ? "#define USE_CLEARCOAT" : "",
      t.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
      t.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
      t.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
      t.dispersion ? "#define USE_DISPERSION" : "",
      t.iridescence ? "#define USE_IRIDESCENCE" : "",
      t.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
      t.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
      t.specularMap ? "#define USE_SPECULARMAP" : "",
      t.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
      t.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
      t.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
      t.metalnessMap ? "#define USE_METALNESSMAP" : "",
      t.alphaMap ? "#define USE_ALPHAMAP" : "",
      t.alphaTest ? "#define USE_ALPHATEST" : "",
      t.alphaHash ? "#define USE_ALPHAHASH" : "",
      t.sheen ? "#define USE_SHEEN" : "",
      t.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
      t.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
      t.transmission ? "#define USE_TRANSMISSION" : "",
      t.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
      t.thicknessMap ? "#define USE_THICKNESSMAP" : "",
      t.vertexTangents && t.flatShading === false ? "#define USE_TANGENT" : "",
      t.vertexColors || t.instancingColor || t.batchingColor ? "#define USE_COLOR" : "",
      t.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
      t.vertexUv1s ? "#define USE_UV1" : "",
      t.vertexUv2s ? "#define USE_UV2" : "",
      t.vertexUv3s ? "#define USE_UV3" : "",
      t.pointsUvs ? "#define USE_POINTS_UV" : "",
      t.gradientMap ? "#define USE_GRADIENTMAP" : "",
      t.flatShading ? "#define FLAT_SHADED" : "",
      t.doubleSided ? "#define DOUBLE_SIDED" : "",
      t.flipSided ? "#define FLIP_SIDED" : "",
      t.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
      t.shadowMapEnabled ? "#define " + c : "",
      t.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "",
      t.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
      t.decodeVideoTexture ? "#define DECODE_VIDEO_TEXTURE" : "",
      t.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
      t.reverseDepthBuffer ? "#define USE_REVERSEDEPTHBUF" : "",
      "uniform mat4 viewMatrix;",
      "uniform vec3 cameraPosition;",
      "uniform bool isOrthographic;",
      t.toneMapping !== Kn ? "#define TONE_MAPPING" : "",
      t.toneMapping !== Kn ? Le.tonemapping_pars_fragment : "",
      t.toneMapping !== Kn ? kg("toneMapping", t.toneMapping) : "",
      t.dithering ? "#define DITHERING" : "",
      t.opaque ? "#define OPAQUE" : "",
      Le.colorspace_pars_fragment,
      Bg("linearToOutputTexel", t.outputColorSpace),
      zg(),
      t.useDepthPacking ? "#define DEPTH_PACKING " + t.depthPacking : "",
      `
`
    ].filter(As).join(`
`)), o = ka(o), o = pl(o, t), o = ml(o, t), a = ka(a), a = pl(a, t), a = ml(a, t), o = gl(o), a = gl(a), t.isRawShaderMaterial !== true && (E = `#version 300 es
`, m = [
      f,
      "#define attribute in",
      "#define varying out",
      "#define texture2D texture"
    ].join(`
`) + `
` + m, p = [
      "#define varying in",
      t.glslVersion === Dc ? "" : "layout(location = 0) out highp vec4 pc_fragColor;",
      t.glslVersion === Dc ? "" : "#define gl_FragColor pc_fragColor",
      "#define gl_FragDepthEXT gl_FragDepth",
      "#define texture2D texture",
      "#define textureCube texture",
      "#define texture2DProj textureProj",
      "#define texture2DLodEXT textureLod",
      "#define texture2DProjLodEXT textureProjLod",
      "#define textureCubeLodEXT textureLod",
      "#define texture2DGradEXT textureGrad",
      "#define texture2DProjGradEXT textureProjGrad",
      "#define textureCubeGradEXT textureGrad"
    ].join(`
`) + `
` + p);
    const M = E + m + o, b = E + p + a, I = dl(i, i.VERTEX_SHADER, M), A = dl(i, i.FRAGMENT_SHADER, b);
    i.attachShader(_, I), i.attachShader(_, A), t.index0AttributeName !== void 0 ? i.bindAttribLocation(_, 0, t.index0AttributeName) : t.morphTargets === true && i.bindAttribLocation(_, 0, "position"), i.linkProgram(_);
    function w(S) {
      if (s.debug.checkShaderErrors) {
        const k = i.getProgramInfoLog(_).trim(), B = i.getShaderInfoLog(I).trim(), H = i.getShaderInfoLog(A).trim();
        let K = true, z = true;
        if (i.getProgramParameter(_, i.LINK_STATUS) === false) if (K = false, typeof s.debug.onShaderError == "function") s.debug.onShaderError(i, _, I, A);
        else {
          const Q = fl(i, I, "vertex"), G = fl(i, A, "fragment");
          console.error("THREE.WebGLProgram: Shader Error " + i.getError() + " - VALIDATE_STATUS " + i.getProgramParameter(_, i.VALIDATE_STATUS) + `

Material Name: ` + S.name + `
Material Type: ` + S.type + `

Program Info Log: ` + k + `
` + Q + `
` + G);
        }
        else k !== "" ? console.warn("THREE.WebGLProgram: Program Info Log:", k) : (B === "" || H === "") && (z = false);
        z && (S.diagnostics = {
          runnable: K,
          programLog: k,
          vertexShader: {
            log: B,
            prefix: m
          },
          fragmentShader: {
            log: H,
            prefix: p
          }
        });
      }
      i.deleteShader(I), i.deleteShader(A), U = new Nr(i, _), j = Gg(i, _);
    }
    let U;
    this.getUniforms = function() {
      return U === void 0 && w(this), U;
    };
    let j;
    this.getAttributes = function() {
      return j === void 0 && w(this), j;
    };
    let x = t.rendererExtensionParallelShaderCompile === false;
    return this.isReady = function() {
      return x === false && (x = i.getProgramParameter(_, Ug)), x;
    }, this.destroy = function() {
      n.releaseStatesOfProgram(this), i.deleteProgram(_), this.program = void 0;
    }, this.type = t.shaderType, this.name = t.shaderName, this.id = Ng++, this.cacheKey = e, this.usedTimes = 1, this.program = _, this.vertexShader = I, this.fragmentShader = A, this;
  }
  let t_ = 0;
  class n_ {
    constructor() {
      this.shaderCache = /* @__PURE__ */ new Map(), this.materialCache = /* @__PURE__ */ new Map();
    }
    update(e) {
      const t = e.vertexShader, n = e.fragmentShader, i = this._getShaderStage(t), r = this._getShaderStage(n), o = this._getShaderCacheForMaterial(e);
      return o.has(i) === false && (o.add(i), i.usedTimes++), o.has(r) === false && (o.add(r), r.usedTimes++), this;
    }
    remove(e) {
      const t = this.materialCache.get(e);
      for (const n of t) n.usedTimes--, n.usedTimes === 0 && this.shaderCache.delete(n.code);
      return this.materialCache.delete(e), this;
    }
    getVertexShaderID(e) {
      return this._getShaderStage(e.vertexShader).id;
    }
    getFragmentShaderID(e) {
      return this._getShaderStage(e.fragmentShader).id;
    }
    dispose() {
      this.shaderCache.clear(), this.materialCache.clear();
    }
    _getShaderCacheForMaterial(e) {
      const t = this.materialCache;
      let n = t.get(e);
      return n === void 0 && (n = /* @__PURE__ */ new Set(), t.set(e, n)), n;
    }
    _getShaderStage(e) {
      const t = this.shaderCache;
      let n = t.get(e);
      return n === void 0 && (n = new i_(e), t.set(e, n)), n;
    }
  }
  class i_ {
    constructor(e) {
      this.id = t_++, this.code = e, this.usedTimes = 0;
    }
  }
  function s_(s, e, t, n, i, r, o) {
    const a = new Th(), c = new n_(), l = /* @__PURE__ */ new Set(), h = [], u = i.logarithmicDepthBuffer, d = i.reverseDepthBuffer, f = i.vertexTextures;
    let g = i.precision;
    const _ = {
      MeshDepthMaterial: "depth",
      MeshDistanceMaterial: "distanceRGBA",
      MeshNormalMaterial: "normal",
      MeshBasicMaterial: "basic",
      MeshLambertMaterial: "lambert",
      MeshPhongMaterial: "phong",
      MeshToonMaterial: "toon",
      MeshStandardMaterial: "physical",
      MeshPhysicalMaterial: "physical",
      MeshMatcapMaterial: "matcap",
      LineBasicMaterial: "basic",
      LineDashedMaterial: "dashed",
      PointsMaterial: "points",
      ShadowMaterial: "shadow",
      SpriteMaterial: "sprite"
    };
    function m(x) {
      return l.add(x), x === 0 ? "uv" : `uv${x}`;
    }
    function p(x, S, k, B, H) {
      const K = B.fog, z = H.geometry, Q = x.isMeshStandardMaterial ? B.environment : null, G = (x.isMeshStandardMaterial ? t : e).get(x.envMap || Q), ae = G && G.mapping === Qr ? G.image.height : null, ce = _[x.type];
      x.precision !== null && (g = i.getMaxPrecision(x.precision), g !== x.precision && console.warn("THREE.WebGLProgram.getParameters:", x.precision, "not supported, using", g, "instead."));
      const ge = z.morphAttributes.position || z.morphAttributes.normal || z.morphAttributes.color, We = ge !== void 0 ? ge.length : 0;
      let $e = 0;
      z.morphAttributes.position !== void 0 && ($e = 1), z.morphAttributes.normal !== void 0 && ($e = 2), z.morphAttributes.color !== void 0 && ($e = 3);
      let W, Z, pe, le;
      if (ce) {
        const Lt = ln[ce];
        W = Lt.vertexShader, Z = Lt.fragmentShader;
      } else W = x.vertexShader, Z = x.fragmentShader, c.update(x), pe = c.getVertexShaderID(x), le = c.getFragmentShaderID(x);
      const Pe = s.getRenderTarget(), Ee = H.isInstancedMesh === true, Be = H.isBatchedMesh === true, Qe = !!x.map, ke = !!x.matcap, C = !!G, Nt = !!x.aoMap, Fe = !!x.lightMap, He = !!x.bumpMap, Te = !!x.normalMap, it = !!x.displacementMap, Re = !!x.emissiveMap, T = !!x.metalnessMap, v = !!x.roughnessMap, N = x.anisotropy > 0, Y = x.clearcoat > 0, $ = x.dispersion > 0, X = x.iridescence > 0, _e = x.sheen > 0, ne = x.transmission > 0, he = N && !!x.anisotropyMap, Ve = Y && !!x.clearcoatMap, J = Y && !!x.clearcoatNormalMap, ue = Y && !!x.clearcoatRoughnessMap, Ae = X && !!x.iridescenceMap, we = X && !!x.iridescenceThicknessMap, de = _e && !!x.sheenColorMap, Oe = _e && !!x.sheenRoughnessMap, Ie = !!x.specularMap, nt = !!x.specularColorMap, P = !!x.specularIntensityMap, re = ne && !!x.transmissionMap, V = ne && !!x.thicknessMap, q = !!x.gradientMap, ie = !!x.alphaMap, oe = x.alphaTest > 0, ze = !!x.alphaHash, dt = !!x.extensions;
      let It = Kn;
      x.toneMapped && (Pe === null || Pe.isXRRenderTarget === true) && (It = s.toneMapping);
      const Xe = {
        shaderID: ce,
        shaderType: x.type,
        shaderName: x.name,
        vertexShader: W,
        fragmentShader: Z,
        defines: x.defines,
        customVertexShaderID: pe,
        customFragmentShaderID: le,
        isRawShaderMaterial: x.isRawShaderMaterial === true,
        glslVersion: x.glslVersion,
        precision: g,
        batching: Be,
        batchingColor: Be && H._colorsTexture !== null,
        instancing: Ee,
        instancingColor: Ee && H.instanceColor !== null,
        instancingMorph: Ee && H.morphTexture !== null,
        supportsVertexTextures: f,
        outputColorSpace: Pe === null ? s.outputColorSpace : Pe.isXRRenderTarget === true ? Pe.texture.colorSpace : Et,
        alphaToCoverage: !!x.alphaToCoverage,
        map: Qe,
        matcap: ke,
        envMap: C,
        envMapMode: C && G.mapping,
        envMapCubeUVHeight: ae,
        aoMap: Nt,
        lightMap: Fe,
        bumpMap: He,
        normalMap: Te,
        displacementMap: f && it,
        emissiveMap: Re,
        normalMapObjectSpace: Te && x.normalMapType === Ku,
        normalMapTangentSpace: Te && x.normalMapType === yh,
        metalnessMap: T,
        roughnessMap: v,
        anisotropy: N,
        anisotropyMap: he,
        clearcoat: Y,
        clearcoatMap: Ve,
        clearcoatNormalMap: J,
        clearcoatRoughnessMap: ue,
        dispersion: $,
        iridescence: X,
        iridescenceMap: Ae,
        iridescenceThicknessMap: we,
        sheen: _e,
        sheenColorMap: de,
        sheenRoughnessMap: Oe,
        specularMap: Ie,
        specularColorMap: nt,
        specularIntensityMap: P,
        transmission: ne,
        transmissionMap: re,
        thicknessMap: V,
        gradientMap: q,
        opaque: x.transparent === false && x.blending === Yi && x.alphaToCoverage === false,
        alphaMap: ie,
        alphaTest: oe,
        alphaHash: ze,
        combine: x.combine,
        mapUv: Qe && m(x.map.channel),
        aoMapUv: Nt && m(x.aoMap.channel),
        lightMapUv: Fe && m(x.lightMap.channel),
        bumpMapUv: He && m(x.bumpMap.channel),
        normalMapUv: Te && m(x.normalMap.channel),
        displacementMapUv: it && m(x.displacementMap.channel),
        emissiveMapUv: Re && m(x.emissiveMap.channel),
        metalnessMapUv: T && m(x.metalnessMap.channel),
        roughnessMapUv: v && m(x.roughnessMap.channel),
        anisotropyMapUv: he && m(x.anisotropyMap.channel),
        clearcoatMapUv: Ve && m(x.clearcoatMap.channel),
        clearcoatNormalMapUv: J && m(x.clearcoatNormalMap.channel),
        clearcoatRoughnessMapUv: ue && m(x.clearcoatRoughnessMap.channel),
        iridescenceMapUv: Ae && m(x.iridescenceMap.channel),
        iridescenceThicknessMapUv: we && m(x.iridescenceThicknessMap.channel),
        sheenColorMapUv: de && m(x.sheenColorMap.channel),
        sheenRoughnessMapUv: Oe && m(x.sheenRoughnessMap.channel),
        specularMapUv: Ie && m(x.specularMap.channel),
        specularColorMapUv: nt && m(x.specularColorMap.channel),
        specularIntensityMapUv: P && m(x.specularIntensityMap.channel),
        transmissionMapUv: re && m(x.transmissionMap.channel),
        thicknessMapUv: V && m(x.thicknessMap.channel),
        alphaMapUv: ie && m(x.alphaMap.channel),
        vertexTangents: !!z.attributes.tangent && (Te || N),
        vertexColors: x.vertexColors,
        vertexAlphas: x.vertexColors === true && !!z.attributes.color && z.attributes.color.itemSize === 4,
        pointsUvs: H.isPoints === true && !!z.attributes.uv && (Qe || ie),
        fog: !!K,
        useFog: x.fog === true,
        fogExp2: !!K && K.isFogExp2,
        flatShading: x.flatShading === true,
        sizeAttenuation: x.sizeAttenuation === true,
        logarithmicDepthBuffer: u,
        reverseDepthBuffer: d,
        skinning: H.isSkinnedMesh === true,
        morphTargets: z.morphAttributes.position !== void 0,
        morphNormals: z.morphAttributes.normal !== void 0,
        morphColors: z.morphAttributes.color !== void 0,
        morphTargetsCount: We,
        morphTextureStride: $e,
        numDirLights: S.directional.length,
        numPointLights: S.point.length,
        numSpotLights: S.spot.length,
        numSpotLightMaps: S.spotLightMap.length,
        numRectAreaLights: S.rectArea.length,
        numHemiLights: S.hemi.length,
        numDirLightShadows: S.directionalShadowMap.length,
        numPointLightShadows: S.pointShadowMap.length,
        numSpotLightShadows: S.spotShadowMap.length,
        numSpotLightShadowsWithMaps: S.numSpotLightShadowsWithMaps,
        numLightProbes: S.numLightProbes,
        numClippingPlanes: o.numPlanes,
        numClipIntersection: o.numIntersection,
        dithering: x.dithering,
        shadowMapEnabled: s.shadowMap.enabled && k.length > 0,
        shadowMapType: s.shadowMap.type,
        toneMapping: It,
        decodeVideoTexture: Qe && x.map.isVideoTexture === true && Ge.getTransfer(x.map.colorSpace) === rt,
        premultipliedAlpha: x.premultipliedAlpha,
        doubleSided: x.side === Yt,
        flipSided: x.side === Ut,
        useDepthPacking: x.depthPacking >= 0,
        depthPacking: x.depthPacking || 0,
        index0AttributeName: x.index0AttributeName,
        extensionClipCullDistance: dt && x.extensions.clipCullDistance === true && n.has("WEBGL_clip_cull_distance"),
        extensionMultiDraw: (dt && x.extensions.multiDraw === true || Be) && n.has("WEBGL_multi_draw"),
        rendererExtensionParallelShaderCompile: n.has("KHR_parallel_shader_compile"),
        customProgramCacheKey: x.customProgramCacheKey()
      };
      return Xe.vertexUv1s = l.has(1), Xe.vertexUv2s = l.has(2), Xe.vertexUv3s = l.has(3), l.clear(), Xe;
    }
    function E(x) {
      const S = [];
      if (x.shaderID ? S.push(x.shaderID) : (S.push(x.customVertexShaderID), S.push(x.customFragmentShaderID)), x.defines !== void 0) for (const k in x.defines) S.push(k), S.push(x.defines[k]);
      return x.isRawShaderMaterial === false && (M(S, x), b(S, x), S.push(s.outputColorSpace)), S.push(x.customProgramCacheKey), S.join();
    }
    function M(x, S) {
      x.push(S.precision), x.push(S.outputColorSpace), x.push(S.envMapMode), x.push(S.envMapCubeUVHeight), x.push(S.mapUv), x.push(S.alphaMapUv), x.push(S.lightMapUv), x.push(S.aoMapUv), x.push(S.bumpMapUv), x.push(S.normalMapUv), x.push(S.displacementMapUv), x.push(S.emissiveMapUv), x.push(S.metalnessMapUv), x.push(S.roughnessMapUv), x.push(S.anisotropyMapUv), x.push(S.clearcoatMapUv), x.push(S.clearcoatNormalMapUv), x.push(S.clearcoatRoughnessMapUv), x.push(S.iridescenceMapUv), x.push(S.iridescenceThicknessMapUv), x.push(S.sheenColorMapUv), x.push(S.sheenRoughnessMapUv), x.push(S.specularMapUv), x.push(S.specularColorMapUv), x.push(S.specularIntensityMapUv), x.push(S.transmissionMapUv), x.push(S.thicknessMapUv), x.push(S.combine), x.push(S.fogExp2), x.push(S.sizeAttenuation), x.push(S.morphTargetsCount), x.push(S.morphAttributeCount), x.push(S.numDirLights), x.push(S.numPointLights), x.push(S.numSpotLights), x.push(S.numSpotLightMaps), x.push(S.numHemiLights), x.push(S.numRectAreaLights), x.push(S.numDirLightShadows), x.push(S.numPointLightShadows), x.push(S.numSpotLightShadows), x.push(S.numSpotLightShadowsWithMaps), x.push(S.numLightProbes), x.push(S.shadowMapType), x.push(S.toneMapping), x.push(S.numClippingPlanes), x.push(S.numClipIntersection), x.push(S.depthPacking);
    }
    function b(x, S) {
      a.disableAll(), S.supportsVertexTextures && a.enable(0), S.instancing && a.enable(1), S.instancingColor && a.enable(2), S.instancingMorph && a.enable(3), S.matcap && a.enable(4), S.envMap && a.enable(5), S.normalMapObjectSpace && a.enable(6), S.normalMapTangentSpace && a.enable(7), S.clearcoat && a.enable(8), S.iridescence && a.enable(9), S.alphaTest && a.enable(10), S.vertexColors && a.enable(11), S.vertexAlphas && a.enable(12), S.vertexUv1s && a.enable(13), S.vertexUv2s && a.enable(14), S.vertexUv3s && a.enable(15), S.vertexTangents && a.enable(16), S.anisotropy && a.enable(17), S.alphaHash && a.enable(18), S.batching && a.enable(19), S.dispersion && a.enable(20), S.batchingColor && a.enable(21), x.push(a.mask), a.disableAll(), S.fog && a.enable(0), S.useFog && a.enable(1), S.flatShading && a.enable(2), S.logarithmicDepthBuffer && a.enable(3), S.reverseDepthBuffer && a.enable(4), S.skinning && a.enable(5), S.morphTargets && a.enable(6), S.morphNormals && a.enable(7), S.morphColors && a.enable(8), S.premultipliedAlpha && a.enable(9), S.shadowMapEnabled && a.enable(10), S.doubleSided && a.enable(11), S.flipSided && a.enable(12), S.useDepthPacking && a.enable(13), S.dithering && a.enable(14), S.transmission && a.enable(15), S.sheen && a.enable(16), S.opaque && a.enable(17), S.pointsUvs && a.enable(18), S.decodeVideoTexture && a.enable(19), S.alphaToCoverage && a.enable(20), x.push(a.mask);
    }
    function I(x) {
      const S = _[x.type];
      let k;
      if (S) {
        const B = ln[S];
        k = zd.clone(B.uniforms);
      } else k = x.uniforms;
      return k;
    }
    function A(x, S) {
      let k;
      for (let B = 0, H = h.length; B < H; B++) {
        const K = h[B];
        if (K.cacheKey === S) {
          k = K, ++k.usedTimes;
          break;
        }
      }
      return k === void 0 && (k = new e_(s, S, x, r), h.push(k)), k;
    }
    function w(x) {
      if (--x.usedTimes === 0) {
        const S = h.indexOf(x);
        h[S] = h[h.length - 1], h.pop(), x.destroy();
      }
    }
    function U(x) {
      c.remove(x);
    }
    function j() {
      c.dispose();
    }
    return {
      getParameters: p,
      getProgramCacheKey: E,
      getUniforms: I,
      acquireProgram: A,
      releaseProgram: w,
      releaseShaderCache: U,
      programs: h,
      dispose: j
    };
  }
  function r_() {
    let s = /* @__PURE__ */ new WeakMap();
    function e(o) {
      return s.has(o);
    }
    function t(o) {
      let a = s.get(o);
      return a === void 0 && (a = {}, s.set(o, a)), a;
    }
    function n(o) {
      s.delete(o);
    }
    function i(o, a, c) {
      s.get(o)[a] = c;
    }
    function r() {
      s = /* @__PURE__ */ new WeakMap();
    }
    return {
      has: e,
      get: t,
      remove: n,
      update: i,
      dispose: r
    };
  }
  function o_(s, e) {
    return s.groupOrder !== e.groupOrder ? s.groupOrder - e.groupOrder : s.renderOrder !== e.renderOrder ? s.renderOrder - e.renderOrder : s.material.id !== e.material.id ? s.material.id - e.material.id : s.z !== e.z ? s.z - e.z : s.id - e.id;
  }
  function xl(s, e) {
    return s.groupOrder !== e.groupOrder ? s.groupOrder - e.groupOrder : s.renderOrder !== e.renderOrder ? s.renderOrder - e.renderOrder : s.z !== e.z ? e.z - s.z : s.id - e.id;
  }
  function vl() {
    const s = [];
    let e = 0;
    const t = [], n = [], i = [];
    function r() {
      e = 0, t.length = 0, n.length = 0, i.length = 0;
    }
    function o(u, d, f, g, _, m) {
      let p = s[e];
      return p === void 0 ? (p = {
        id: u.id,
        object: u,
        geometry: d,
        material: f,
        groupOrder: g,
        renderOrder: u.renderOrder,
        z: _,
        group: m
      }, s[e] = p) : (p.id = u.id, p.object = u, p.geometry = d, p.material = f, p.groupOrder = g, p.renderOrder = u.renderOrder, p.z = _, p.group = m), e++, p;
    }
    function a(u, d, f, g, _, m) {
      const p = o(u, d, f, g, _, m);
      f.transmission > 0 ? n.push(p) : f.transparent === true ? i.push(p) : t.push(p);
    }
    function c(u, d, f, g, _, m) {
      const p = o(u, d, f, g, _, m);
      f.transmission > 0 ? n.unshift(p) : f.transparent === true ? i.unshift(p) : t.unshift(p);
    }
    function l(u, d) {
      t.length > 1 && t.sort(u || o_), n.length > 1 && n.sort(d || xl), i.length > 1 && i.sort(d || xl);
    }
    function h() {
      for (let u = e, d = s.length; u < d; u++) {
        const f = s[u];
        if (f.id === null) break;
        f.id = null, f.object = null, f.geometry = null, f.material = null, f.group = null;
      }
    }
    return {
      opaque: t,
      transmissive: n,
      transparent: i,
      init: r,
      push: a,
      unshift: c,
      finish: h,
      sort: l
    };
  }
  function a_() {
    let s = /* @__PURE__ */ new WeakMap();
    function e(n, i) {
      const r = s.get(n);
      let o;
      return r === void 0 ? (o = new vl(), s.set(n, [
        o
      ])) : i >= r.length ? (o = new vl(), r.push(o)) : o = r[i], o;
    }
    function t() {
      s = /* @__PURE__ */ new WeakMap();
    }
    return {
      get: e,
      dispose: t
    };
  }
  function c_() {
    const s = {};
    return {
      get: function(e) {
        if (s[e.id] !== void 0) return s[e.id];
        let t;
        switch (e.type) {
          case "DirectionalLight":
            t = {
              direction: new R(),
              color: new Se()
            };
            break;
          case "SpotLight":
            t = {
              position: new R(),
              direction: new R(),
              color: new Se(),
              distance: 0,
              coneCos: 0,
              penumbraCos: 0,
              decay: 0
            };
            break;
          case "PointLight":
            t = {
              position: new R(),
              color: new Se(),
              distance: 0,
              decay: 0
            };
            break;
          case "HemisphereLight":
            t = {
              direction: new R(),
              skyColor: new Se(),
              groundColor: new Se()
            };
            break;
          case "RectAreaLight":
            t = {
              color: new Se(),
              position: new R(),
              halfWidth: new R(),
              halfHeight: new R()
            };
            break;
        }
        return s[e.id] = t, t;
      }
    };
  }
  function l_() {
    const s = {};
    return {
      get: function(e) {
        if (s[e.id] !== void 0) return s[e.id];
        let t;
        switch (e.type) {
          case "DirectionalLight":
            t = {
              shadowIntensity: 1,
              shadowBias: 0,
              shadowNormalBias: 0,
              shadowRadius: 1,
              shadowMapSize: new ye()
            };
            break;
          case "SpotLight":
            t = {
              shadowIntensity: 1,
              shadowBias: 0,
              shadowNormalBias: 0,
              shadowRadius: 1,
              shadowMapSize: new ye()
            };
            break;
          case "PointLight":
            t = {
              shadowIntensity: 1,
              shadowBias: 0,
              shadowNormalBias: 0,
              shadowRadius: 1,
              shadowMapSize: new ye(),
              shadowCameraNear: 1,
              shadowCameraFar: 1e3
            };
            break;
        }
        return s[e.id] = t, t;
      }
    };
  }
  let h_ = 0;
  function u_(s, e) {
    return (e.castShadow ? 2 : 0) - (s.castShadow ? 2 : 0) + (e.map ? 1 : 0) - (s.map ? 1 : 0);
  }
  function d_(s) {
    const e = new c_(), t = l_(), n = {
      version: 0,
      hash: {
        directionalLength: -1,
        pointLength: -1,
        spotLength: -1,
        rectAreaLength: -1,
        hemiLength: -1,
        numDirectionalShadows: -1,
        numPointShadows: -1,
        numSpotShadows: -1,
        numSpotMaps: -1,
        numLightProbes: -1
      },
      ambient: [
        0,
        0,
        0
      ],
      probe: [],
      directional: [],
      directionalShadow: [],
      directionalShadowMap: [],
      directionalShadowMatrix: [],
      spot: [],
      spotLightMap: [],
      spotShadow: [],
      spotShadowMap: [],
      spotLightMatrix: [],
      rectArea: [],
      rectAreaLTC1: null,
      rectAreaLTC2: null,
      point: [],
      pointShadow: [],
      pointShadowMap: [],
      pointShadowMatrix: [],
      hemi: [],
      numSpotLightShadowsWithMaps: 0,
      numLightProbes: 0
    };
    for (let l = 0; l < 9; l++) n.probe.push(new R());
    const i = new R(), r = new Ce(), o = new Ce();
    function a(l) {
      let h = 0, u = 0, d = 0;
      for (let j = 0; j < 9; j++) n.probe[j].set(0, 0, 0);
      let f = 0, g = 0, _ = 0, m = 0, p = 0, E = 0, M = 0, b = 0, I = 0, A = 0, w = 0;
      l.sort(u_);
      for (let j = 0, x = l.length; j < x; j++) {
        const S = l[j], k = S.color, B = S.intensity, H = S.distance, K = S.shadow && S.shadow.map ? S.shadow.map.texture : null;
        if (S.isAmbientLight) h += k.r * B, u += k.g * B, d += k.b * B;
        else if (S.isLightProbe) {
          for (let z = 0; z < 9; z++) n.probe[z].addScaledVector(S.sh.coefficients[z], B);
          w++;
        } else if (S.isDirectionalLight) {
          const z = e.get(S);
          if (z.color.copy(S.color).multiplyScalar(S.intensity), S.castShadow) {
            const Q = S.shadow, G = t.get(S);
            G.shadowIntensity = Q.intensity, G.shadowBias = Q.bias, G.shadowNormalBias = Q.normalBias, G.shadowRadius = Q.radius, G.shadowMapSize = Q.mapSize, n.directionalShadow[f] = G, n.directionalShadowMap[f] = K, n.directionalShadowMatrix[f] = S.shadow.matrix, E++;
          }
          n.directional[f] = z, f++;
        } else if (S.isSpotLight) {
          const z = e.get(S);
          z.position.setFromMatrixPosition(S.matrixWorld), z.color.copy(k).multiplyScalar(B), z.distance = H, z.coneCos = Math.cos(S.angle), z.penumbraCos = Math.cos(S.angle * (1 - S.penumbra)), z.decay = S.decay, n.spot[_] = z;
          const Q = S.shadow;
          if (S.map && (n.spotLightMap[I] = S.map, I++, Q.updateMatrices(S), S.castShadow && A++), n.spotLightMatrix[_] = Q.matrix, S.castShadow) {
            const G = t.get(S);
            G.shadowIntensity = Q.intensity, G.shadowBias = Q.bias, G.shadowNormalBias = Q.normalBias, G.shadowRadius = Q.radius, G.shadowMapSize = Q.mapSize, n.spotShadow[_] = G, n.spotShadowMap[_] = K, b++;
          }
          _++;
        } else if (S.isRectAreaLight) {
          const z = e.get(S);
          z.color.copy(k).multiplyScalar(B), z.halfWidth.set(S.width * 0.5, 0, 0), z.halfHeight.set(0, S.height * 0.5, 0), n.rectArea[m] = z, m++;
        } else if (S.isPointLight) {
          const z = e.get(S);
          if (z.color.copy(S.color).multiplyScalar(S.intensity), z.distance = S.distance, z.decay = S.decay, S.castShadow) {
            const Q = S.shadow, G = t.get(S);
            G.shadowIntensity = Q.intensity, G.shadowBias = Q.bias, G.shadowNormalBias = Q.normalBias, G.shadowRadius = Q.radius, G.shadowMapSize = Q.mapSize, G.shadowCameraNear = Q.camera.near, G.shadowCameraFar = Q.camera.far, n.pointShadow[g] = G, n.pointShadowMap[g] = K, n.pointShadowMatrix[g] = S.shadow.matrix, M++;
          }
          n.point[g] = z, g++;
        } else if (S.isHemisphereLight) {
          const z = e.get(S);
          z.skyColor.copy(S.color).multiplyScalar(B), z.groundColor.copy(S.groundColor).multiplyScalar(B), n.hemi[p] = z, p++;
        }
      }
      m > 0 && (s.has("OES_texture_float_linear") === true ? (n.rectAreaLTC1 = te.LTC_FLOAT_1, n.rectAreaLTC2 = te.LTC_FLOAT_2) : (n.rectAreaLTC1 = te.LTC_HALF_1, n.rectAreaLTC2 = te.LTC_HALF_2)), n.ambient[0] = h, n.ambient[1] = u, n.ambient[2] = d;
      const U = n.hash;
      (U.directionalLength !== f || U.pointLength !== g || U.spotLength !== _ || U.rectAreaLength !== m || U.hemiLength !== p || U.numDirectionalShadows !== E || U.numPointShadows !== M || U.numSpotShadows !== b || U.numSpotMaps !== I || U.numLightProbes !== w) && (n.directional.length = f, n.spot.length = _, n.rectArea.length = m, n.point.length = g, n.hemi.length = p, n.directionalShadow.length = E, n.directionalShadowMap.length = E, n.pointShadow.length = M, n.pointShadowMap.length = M, n.spotShadow.length = b, n.spotShadowMap.length = b, n.directionalShadowMatrix.length = E, n.pointShadowMatrix.length = M, n.spotLightMatrix.length = b + I - A, n.spotLightMap.length = I, n.numSpotLightShadowsWithMaps = A, n.numLightProbes = w, U.directionalLength = f, U.pointLength = g, U.spotLength = _, U.rectAreaLength = m, U.hemiLength = p, U.numDirectionalShadows = E, U.numPointShadows = M, U.numSpotShadows = b, U.numSpotMaps = I, U.numLightProbes = w, n.version = h_++);
    }
    function c(l, h) {
      let u = 0, d = 0, f = 0, g = 0, _ = 0;
      const m = h.matrixWorldInverse;
      for (let p = 0, E = l.length; p < E; p++) {
        const M = l[p];
        if (M.isDirectionalLight) {
          const b = n.directional[u];
          b.direction.setFromMatrixPosition(M.matrixWorld), i.setFromMatrixPosition(M.target.matrixWorld), b.direction.sub(i), b.direction.transformDirection(m), u++;
        } else if (M.isSpotLight) {
          const b = n.spot[f];
          b.position.setFromMatrixPosition(M.matrixWorld), b.position.applyMatrix4(m), b.direction.setFromMatrixPosition(M.matrixWorld), i.setFromMatrixPosition(M.target.matrixWorld), b.direction.sub(i), b.direction.transformDirection(m), f++;
        } else if (M.isRectAreaLight) {
          const b = n.rectArea[g];
          b.position.setFromMatrixPosition(M.matrixWorld), b.position.applyMatrix4(m), o.identity(), r.copy(M.matrixWorld), r.premultiply(m), o.extractRotation(r), b.halfWidth.set(M.width * 0.5, 0, 0), b.halfHeight.set(0, M.height * 0.5, 0), b.halfWidth.applyMatrix4(o), b.halfHeight.applyMatrix4(o), g++;
        } else if (M.isPointLight) {
          const b = n.point[d];
          b.position.setFromMatrixPosition(M.matrixWorld), b.position.applyMatrix4(m), d++;
        } else if (M.isHemisphereLight) {
          const b = n.hemi[_];
          b.direction.setFromMatrixPosition(M.matrixWorld), b.direction.transformDirection(m), _++;
        }
      }
    }
    return {
      setup: a,
      setupView: c,
      state: n
    };
  }
  function yl(s) {
    const e = new d_(s), t = [], n = [];
    function i(h) {
      l.camera = h, t.length = 0, n.length = 0;
    }
    function r(h) {
      t.push(h);
    }
    function o(h) {
      n.push(h);
    }
    function a() {
      e.setup(t);
    }
    function c(h) {
      e.setupView(t, h);
    }
    const l = {
      lightsArray: t,
      shadowsArray: n,
      camera: null,
      lights: e,
      transmissionRenderTarget: {}
    };
    return {
      init: i,
      state: l,
      setupLights: a,
      setupLightsView: c,
      pushLight: r,
      pushShadow: o
    };
  }
  function f_(s) {
    let e = /* @__PURE__ */ new WeakMap();
    function t(i, r = 0) {
      const o = e.get(i);
      let a;
      return o === void 0 ? (a = new yl(s), e.set(i, [
        a
      ])) : r >= o.length ? (a = new yl(s), o.push(a)) : a = o[r], a;
    }
    function n() {
      e = /* @__PURE__ */ new WeakMap();
    }
    return {
      get: t,
      dispose: n
    };
  }
  class p_ extends cn {
    constructor(e) {
      super(), this.isMeshDepthMaterial = true, this.type = "MeshDepthMaterial", this.depthPacking = qu, this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.wireframe = false, this.wireframeLinewidth = 1, this.setValues(e);
    }
    copy(e) {
      return super.copy(e), this.depthPacking = e.depthPacking, this.map = e.map, this.alphaMap = e.alphaMap, this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this;
    }
  }
  class m_ extends cn {
    constructor(e) {
      super(), this.isMeshDistanceMaterial = true, this.type = "MeshDistanceMaterial", this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.setValues(e);
    }
    copy(e) {
      return super.copy(e), this.map = e.map, this.alphaMap = e.alphaMap, this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this;
    }
  }
  const g_ = `void main() {
	gl_Position = vec4( position, 1.0 );
}`, __ = `uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;
  function x_(s, e, t) {
    let n = new ic();
    const i = new ye(), r = new ye(), o = new Ye(), a = new p_({
      depthPacking: ju
    }), c = new m_(), l = {}, h = t.maxTextureSize, u = {
      [Pn]: Ut,
      [Ut]: Pn,
      [Yt]: Yt
    }, d = new Zn({
      defines: {
        VSM_SAMPLES: 8
      },
      uniforms: {
        shadow_pass: {
          value: null
        },
        resolution: {
          value: new ye()
        },
        radius: {
          value: 4
        }
      },
      vertexShader: g_,
      fragmentShader: __
    }), f = d.clone();
    f.defines.HORIZONTAL_PASS = 1;
    const g = new yt();
    g.setAttribute("position", new vt(new Float32Array([
      -1,
      -1,
      0.5,
      3,
      -1,
      0.5,
      -1,
      3,
      0.5
    ]), 3));
    const _ = new tt(g, d), m = this;
    this.enabled = false, this.autoUpdate = true, this.needsUpdate = false, this.type = rh;
    let p = this.type;
    this.render = function(A, w, U) {
      if (m.enabled === false || m.autoUpdate === false && m.needsUpdate === false || A.length === 0) return;
      const j = s.getRenderTarget(), x = s.getActiveCubeFace(), S = s.getActiveMipmapLevel(), k = s.state;
      k.setBlending(jn), k.buffers.color.setClear(1, 1, 1, 1), k.buffers.depth.setTest(true), k.setScissorTest(false);
      const B = p !== bn && this.type === bn, H = p === bn && this.type !== bn;
      for (let K = 0, z = A.length; K < z; K++) {
        const Q = A[K], G = Q.shadow;
        if (G === void 0) {
          console.warn("THREE.WebGLShadowMap:", Q, "has no shadow.");
          continue;
        }
        if (G.autoUpdate === false && G.needsUpdate === false) continue;
        i.copy(G.mapSize);
        const ae = G.getFrameExtents();
        if (i.multiply(ae), r.copy(G.mapSize), (i.x > h || i.y > h) && (i.x > h && (r.x = Math.floor(h / ae.x), i.x = r.x * ae.x, G.mapSize.x = r.x), i.y > h && (r.y = Math.floor(h / ae.y), i.y = r.y * ae.y, G.mapSize.y = r.y)), G.map === null || B === true || H === true) {
          const ge = this.type !== bn ? {
            minFilter: Pt,
            magFilter: Pt
          } : {};
          G.map !== null && G.map.dispose(), G.map = new mi(i.x, i.y, ge), G.map.texture.name = Q.name + ".shadowMap", G.camera.updateProjectionMatrix();
        }
        s.setRenderTarget(G.map), s.clear();
        const ce = G.getViewportCount();
        for (let ge = 0; ge < ce; ge++) {
          const We = G.getViewport(ge);
          o.set(r.x * We.x, r.y * We.y, r.x * We.z, r.y * We.w), k.viewport(o), G.updateMatrices(Q, ge), n = G.getFrustum(), b(w, U, G.camera, Q, this.type);
        }
        G.isPointLightShadow !== true && this.type === bn && E(G, U), G.needsUpdate = false;
      }
      p = this.type, m.needsUpdate = false, s.setRenderTarget(j, x, S);
    };
    function E(A, w) {
      const U = e.update(_);
      d.defines.VSM_SAMPLES !== A.blurSamples && (d.defines.VSM_SAMPLES = A.blurSamples, f.defines.VSM_SAMPLES = A.blurSamples, d.needsUpdate = true, f.needsUpdate = true), A.mapPass === null && (A.mapPass = new mi(i.x, i.y)), d.uniforms.shadow_pass.value = A.map.texture, d.uniforms.resolution.value = A.mapSize, d.uniforms.radius.value = A.radius, s.setRenderTarget(A.mapPass), s.clear(), s.renderBufferDirect(w, null, U, d, _, null), f.uniforms.shadow_pass.value = A.mapPass.texture, f.uniforms.resolution.value = A.mapSize, f.uniforms.radius.value = A.radius, s.setRenderTarget(A.map), s.clear(), s.renderBufferDirect(w, null, U, f, _, null);
    }
    function M(A, w, U, j) {
      let x = null;
      const S = U.isPointLight === true ? A.customDistanceMaterial : A.customDepthMaterial;
      if (S !== void 0) x = S;
      else if (x = U.isPointLight === true ? c : a, s.localClippingEnabled && w.clipShadows === true && Array.isArray(w.clippingPlanes) && w.clippingPlanes.length !== 0 || w.displacementMap && w.displacementScale !== 0 || w.alphaMap && w.alphaTest > 0 || w.map && w.alphaTest > 0) {
        const k = x.uuid, B = w.uuid;
        let H = l[k];
        H === void 0 && (H = {}, l[k] = H);
        let K = H[B];
        K === void 0 && (K = x.clone(), H[B] = K, w.addEventListener("dispose", I)), x = K;
      }
      if (x.visible = w.visible, x.wireframe = w.wireframe, j === bn ? x.side = w.shadowSide !== null ? w.shadowSide : w.side : x.side = w.shadowSide !== null ? w.shadowSide : u[w.side], x.alphaMap = w.alphaMap, x.alphaTest = w.alphaTest, x.map = w.map, x.clipShadows = w.clipShadows, x.clippingPlanes = w.clippingPlanes, x.clipIntersection = w.clipIntersection, x.displacementMap = w.displacementMap, x.displacementScale = w.displacementScale, x.displacementBias = w.displacementBias, x.wireframeLinewidth = w.wireframeLinewidth, x.linewidth = w.linewidth, U.isPointLight === true && x.isMeshDistanceMaterial === true) {
        const k = s.properties.get(x);
        k.light = U;
      }
      return x;
    }
    function b(A, w, U, j, x) {
      if (A.visible === false) return;
      if (A.layers.test(w.layers) && (A.isMesh || A.isLine || A.isPoints) && (A.castShadow || A.receiveShadow && x === bn) && (!A.frustumCulled || n.intersectsObject(A))) {
        A.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse, A.matrixWorld);
        const B = e.update(A), H = A.material;
        if (Array.isArray(H)) {
          const K = B.groups;
          for (let z = 0, Q = K.length; z < Q; z++) {
            const G = K[z], ae = H[G.materialIndex];
            if (ae && ae.visible) {
              const ce = M(A, ae, j, x);
              A.onBeforeShadow(s, A, w, U, B, ce, G), s.renderBufferDirect(U, null, B, ce, A, G), A.onAfterShadow(s, A, w, U, B, ce, G);
            }
          }
        } else if (H.visible) {
          const K = M(A, H, j, x);
          A.onBeforeShadow(s, A, w, U, B, K, null), s.renderBufferDirect(U, null, B, K, A, null), A.onAfterShadow(s, A, w, U, B, K, null);
        }
      }
      const k = A.children;
      for (let B = 0, H = k.length; B < H; B++) b(k[B], w, U, j, x);
    }
    function I(A) {
      A.target.removeEventListener("dispose", I);
      for (const U in l) {
        const j = l[U], x = A.target.uuid;
        x in j && (j[x].dispose(), delete j[x]);
      }
    }
  }
  const v_ = {
    [na]: ia,
    [sa]: aa,
    [ra]: ca,
    [$i]: oa,
    [ia]: na,
    [aa]: sa,
    [ca]: ra,
    [oa]: $i
  };
  function y_(s) {
    function e() {
      let P = false;
      const re = new Ye();
      let V = null;
      const q = new Ye(0, 0, 0, 0);
      return {
        setMask: function(ie) {
          V !== ie && !P && (s.colorMask(ie, ie, ie, ie), V = ie);
        },
        setLocked: function(ie) {
          P = ie;
        },
        setClear: function(ie, oe, ze, dt, It) {
          It === true && (ie *= dt, oe *= dt, ze *= dt), re.set(ie, oe, ze, dt), q.equals(re) === false && (s.clearColor(ie, oe, ze, dt), q.copy(re));
        },
        reset: function() {
          P = false, V = null, q.set(-1, 0, 0, 0);
        }
      };
    }
    function t() {
      let P = false, re = false, V = null, q = null, ie = null;
      return {
        setReversed: function(oe) {
          re = oe;
        },
        setTest: function(oe) {
          oe ? pe(s.DEPTH_TEST) : le(s.DEPTH_TEST);
        },
        setMask: function(oe) {
          V !== oe && !P && (s.depthMask(oe), V = oe);
        },
        setFunc: function(oe) {
          if (re && (oe = v_[oe]), q !== oe) {
            switch (oe) {
              case na:
                s.depthFunc(s.NEVER);
                break;
              case ia:
                s.depthFunc(s.ALWAYS);
                break;
              case sa:
                s.depthFunc(s.LESS);
                break;
              case $i:
                s.depthFunc(s.LEQUAL);
                break;
              case ra:
                s.depthFunc(s.EQUAL);
                break;
              case oa:
                s.depthFunc(s.GEQUAL);
                break;
              case aa:
                s.depthFunc(s.GREATER);
                break;
              case ca:
                s.depthFunc(s.NOTEQUAL);
                break;
              default:
                s.depthFunc(s.LEQUAL);
            }
            q = oe;
          }
        },
        setLocked: function(oe) {
          P = oe;
        },
        setClear: function(oe) {
          ie !== oe && (s.clearDepth(oe), ie = oe);
        },
        reset: function() {
          P = false, V = null, q = null, ie = null;
        }
      };
    }
    function n() {
      let P = false, re = null, V = null, q = null, ie = null, oe = null, ze = null, dt = null, It = null;
      return {
        setTest: function(Xe) {
          P || (Xe ? pe(s.STENCIL_TEST) : le(s.STENCIL_TEST));
        },
        setMask: function(Xe) {
          re !== Xe && !P && (s.stencilMask(Xe), re = Xe);
        },
        setFunc: function(Xe, Lt, gn) {
          (V !== Xe || q !== Lt || ie !== gn) && (s.stencilFunc(Xe, Lt, gn), V = Xe, q = Lt, ie = gn);
        },
        setOp: function(Xe, Lt, gn) {
          (oe !== Xe || ze !== Lt || dt !== gn) && (s.stencilOp(Xe, Lt, gn), oe = Xe, ze = Lt, dt = gn);
        },
        setLocked: function(Xe) {
          P = Xe;
        },
        setClear: function(Xe) {
          It !== Xe && (s.clearStencil(Xe), It = Xe);
        },
        reset: function() {
          P = false, re = null, V = null, q = null, ie = null, oe = null, ze = null, dt = null, It = null;
        }
      };
    }
    const i = new e(), r = new t(), o = new n(), a = /* @__PURE__ */ new WeakMap(), c = /* @__PURE__ */ new WeakMap();
    let l = {}, h = {}, u = /* @__PURE__ */ new WeakMap(), d = [], f = null, g = false, _ = null, m = null, p = null, E = null, M = null, b = null, I = null, A = new Se(0, 0, 0), w = 0, U = false, j = null, x = null, S = null, k = null, B = null;
    const H = s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
    let K = false, z = 0;
    const Q = s.getParameter(s.VERSION);
    Q.indexOf("WebGL") !== -1 ? (z = parseFloat(/^WebGL (\d)/.exec(Q)[1]), K = z >= 1) : Q.indexOf("OpenGL ES") !== -1 && (z = parseFloat(/^OpenGL ES (\d)/.exec(Q)[1]), K = z >= 2);
    let G = null, ae = {};
    const ce = s.getParameter(s.SCISSOR_BOX), ge = s.getParameter(s.VIEWPORT), We = new Ye().fromArray(ce), $e = new Ye().fromArray(ge);
    function W(P, re, V, q) {
      const ie = new Uint8Array(4), oe = s.createTexture();
      s.bindTexture(P, oe), s.texParameteri(P, s.TEXTURE_MIN_FILTER, s.NEAREST), s.texParameteri(P, s.TEXTURE_MAG_FILTER, s.NEAREST);
      for (let ze = 0; ze < V; ze++) P === s.TEXTURE_3D || P === s.TEXTURE_2D_ARRAY ? s.texImage3D(re, 0, s.RGBA, 1, 1, q, 0, s.RGBA, s.UNSIGNED_BYTE, ie) : s.texImage2D(re + ze, 0, s.RGBA, 1, 1, 0, s.RGBA, s.UNSIGNED_BYTE, ie);
      return oe;
    }
    const Z = {};
    Z[s.TEXTURE_2D] = W(s.TEXTURE_2D, s.TEXTURE_2D, 1), Z[s.TEXTURE_CUBE_MAP] = W(s.TEXTURE_CUBE_MAP, s.TEXTURE_CUBE_MAP_POSITIVE_X, 6), Z[s.TEXTURE_2D_ARRAY] = W(s.TEXTURE_2D_ARRAY, s.TEXTURE_2D_ARRAY, 1, 1), Z[s.TEXTURE_3D] = W(s.TEXTURE_3D, s.TEXTURE_3D, 1, 1), i.setClear(0, 0, 0, 1), r.setClear(1), o.setClear(0), pe(s.DEPTH_TEST), r.setFunc($i), Fe(false), He(wc), pe(s.CULL_FACE), C(jn);
    function pe(P) {
      l[P] !== true && (s.enable(P), l[P] = true);
    }
    function le(P) {
      l[P] !== false && (s.disable(P), l[P] = false);
    }
    function Pe(P, re) {
      return h[P] !== re ? (s.bindFramebuffer(P, re), h[P] = re, P === s.DRAW_FRAMEBUFFER && (h[s.FRAMEBUFFER] = re), P === s.FRAMEBUFFER && (h[s.DRAW_FRAMEBUFFER] = re), true) : false;
    }
    function Ee(P, re) {
      let V = d, q = false;
      if (P) {
        V = u.get(re), V === void 0 && (V = [], u.set(re, V));
        const ie = P.textures;
        if (V.length !== ie.length || V[0] !== s.COLOR_ATTACHMENT0) {
          for (let oe = 0, ze = ie.length; oe < ze; oe++) V[oe] = s.COLOR_ATTACHMENT0 + oe;
          V.length = ie.length, q = true;
        }
      } else V[0] !== s.BACK && (V[0] = s.BACK, q = true);
      q && s.drawBuffers(V);
    }
    function Be(P) {
      return f !== P ? (s.useProgram(P), f = P, true) : false;
    }
    const Qe = {
      [li]: s.FUNC_ADD,
      [gu]: s.FUNC_SUBTRACT,
      [_u]: s.FUNC_REVERSE_SUBTRACT
    };
    Qe[xu] = s.MIN, Qe[vu] = s.MAX;
    const ke = {
      [yu]: s.ZERO,
      [Mu]: s.ONE,
      [Su]: s.SRC_COLOR,
      [ea]: s.SRC_ALPHA,
      [Ru]: s.SRC_ALPHA_SATURATE,
      [Au]: s.DST_COLOR,
      [bu]: s.DST_ALPHA,
      [Eu]: s.ONE_MINUS_SRC_COLOR,
      [ta]: s.ONE_MINUS_SRC_ALPHA,
      [wu]: s.ONE_MINUS_DST_COLOR,
      [Tu]: s.ONE_MINUS_DST_ALPHA,
      [Cu]: s.CONSTANT_COLOR,
      [Pu]: s.ONE_MINUS_CONSTANT_COLOR,
      [Iu]: s.CONSTANT_ALPHA,
      [Lu]: s.ONE_MINUS_CONSTANT_ALPHA
    };
    function C(P, re, V, q, ie, oe, ze, dt, It, Xe) {
      if (P === jn) {
        g === true && (le(s.BLEND), g = false);
        return;
      }
      if (g === false && (pe(s.BLEND), g = true), P !== mu) {
        if (P !== _ || Xe !== U) {
          if ((m !== li || M !== li) && (s.blendEquation(s.FUNC_ADD), m = li, M = li), Xe) switch (P) {
            case Yi:
              s.blendFuncSeparate(s.ONE, s.ONE_MINUS_SRC_ALPHA, s.ONE, s.ONE_MINUS_SRC_ALPHA);
              break;
            case Rc:
              s.blendFunc(s.ONE, s.ONE);
              break;
            case Cc:
              s.blendFuncSeparate(s.ZERO, s.ONE_MINUS_SRC_COLOR, s.ZERO, s.ONE);
              break;
            case Pc:
              s.blendFuncSeparate(s.ZERO, s.SRC_COLOR, s.ZERO, s.SRC_ALPHA);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", P);
              break;
          }
          else switch (P) {
            case Yi:
              s.blendFuncSeparate(s.SRC_ALPHA, s.ONE_MINUS_SRC_ALPHA, s.ONE, s.ONE_MINUS_SRC_ALPHA);
              break;
            case Rc:
              s.blendFunc(s.SRC_ALPHA, s.ONE);
              break;
            case Cc:
              s.blendFuncSeparate(s.ZERO, s.ONE_MINUS_SRC_COLOR, s.ZERO, s.ONE);
              break;
            case Pc:
              s.blendFunc(s.ZERO, s.SRC_COLOR);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", P);
              break;
          }
          p = null, E = null, b = null, I = null, A.set(0, 0, 0), w = 0, _ = P, U = Xe;
        }
        return;
      }
      ie = ie || re, oe = oe || V, ze = ze || q, (re !== m || ie !== M) && (s.blendEquationSeparate(Qe[re], Qe[ie]), m = re, M = ie), (V !== p || q !== E || oe !== b || ze !== I) && (s.blendFuncSeparate(ke[V], ke[q], ke[oe], ke[ze]), p = V, E = q, b = oe, I = ze), (dt.equals(A) === false || It !== w) && (s.blendColor(dt.r, dt.g, dt.b, It), A.copy(dt), w = It), _ = P, U = false;
    }
    function Nt(P, re) {
      P.side === Yt ? le(s.CULL_FACE) : pe(s.CULL_FACE);
      let V = P.side === Ut;
      re && (V = !V), Fe(V), P.blending === Yi && P.transparent === false ? C(jn) : C(P.blending, P.blendEquation, P.blendSrc, P.blendDst, P.blendEquationAlpha, P.blendSrcAlpha, P.blendDstAlpha, P.blendColor, P.blendAlpha, P.premultipliedAlpha), r.setFunc(P.depthFunc), r.setTest(P.depthTest), r.setMask(P.depthWrite), i.setMask(P.colorWrite);
      const q = P.stencilWrite;
      o.setTest(q), q && (o.setMask(P.stencilWriteMask), o.setFunc(P.stencilFunc, P.stencilRef, P.stencilFuncMask), o.setOp(P.stencilFail, P.stencilZFail, P.stencilZPass)), it(P.polygonOffset, P.polygonOffsetFactor, P.polygonOffsetUnits), P.alphaToCoverage === true ? pe(s.SAMPLE_ALPHA_TO_COVERAGE) : le(s.SAMPLE_ALPHA_TO_COVERAGE);
    }
    function Fe(P) {
      j !== P && (P ? s.frontFace(s.CW) : s.frontFace(s.CCW), j = P);
    }
    function He(P) {
      P !== du ? (pe(s.CULL_FACE), P !== x && (P === wc ? s.cullFace(s.BACK) : P === fu ? s.cullFace(s.FRONT) : s.cullFace(s.FRONT_AND_BACK))) : le(s.CULL_FACE), x = P;
    }
    function Te(P) {
      P !== S && (K && s.lineWidth(P), S = P);
    }
    function it(P, re, V) {
      P ? (pe(s.POLYGON_OFFSET_FILL), (k !== re || B !== V) && (s.polygonOffset(re, V), k = re, B = V)) : le(s.POLYGON_OFFSET_FILL);
    }
    function Re(P) {
      P ? pe(s.SCISSOR_TEST) : le(s.SCISSOR_TEST);
    }
    function T(P) {
      P === void 0 && (P = s.TEXTURE0 + H - 1), G !== P && (s.activeTexture(P), G = P);
    }
    function v(P, re, V) {
      V === void 0 && (G === null ? V = s.TEXTURE0 + H - 1 : V = G);
      let q = ae[V];
      q === void 0 && (q = {
        type: void 0,
        texture: void 0
      }, ae[V] = q), (q.type !== P || q.texture !== re) && (G !== V && (s.activeTexture(V), G = V), s.bindTexture(P, re || Z[P]), q.type = P, q.texture = re);
    }
    function N() {
      const P = ae[G];
      P !== void 0 && P.type !== void 0 && (s.bindTexture(P.type, null), P.type = void 0, P.texture = void 0);
    }
    function Y() {
      try {
        s.compressedTexImage2D.apply(s, arguments);
      } catch (P) {
        console.error("THREE.WebGLState:", P);
      }
    }
    function $() {
      try {
        s.compressedTexImage3D.apply(s, arguments);
      } catch (P) {
        console.error("THREE.WebGLState:", P);
      }
    }
    function X() {
      try {
        s.texSubImage2D.apply(s, arguments);
      } catch (P) {
        console.error("THREE.WebGLState:", P);
      }
    }
    function _e() {
      try {
        s.texSubImage3D.apply(s, arguments);
      } catch (P) {
        console.error("THREE.WebGLState:", P);
      }
    }
    function ne() {
      try {
        s.compressedTexSubImage2D.apply(s, arguments);
      } catch (P) {
        console.error("THREE.WebGLState:", P);
      }
    }
    function he() {
      try {
        s.compressedTexSubImage3D.apply(s, arguments);
      } catch (P) {
        console.error("THREE.WebGLState:", P);
      }
    }
    function Ve() {
      try {
        s.texStorage2D.apply(s, arguments);
      } catch (P) {
        console.error("THREE.WebGLState:", P);
      }
    }
    function J() {
      try {
        s.texStorage3D.apply(s, arguments);
      } catch (P) {
        console.error("THREE.WebGLState:", P);
      }
    }
    function ue() {
      try {
        s.texImage2D.apply(s, arguments);
      } catch (P) {
        console.error("THREE.WebGLState:", P);
      }
    }
    function Ae() {
      try {
        s.texImage3D.apply(s, arguments);
      } catch (P) {
        console.error("THREE.WebGLState:", P);
      }
    }
    function we(P) {
      We.equals(P) === false && (s.scissor(P.x, P.y, P.z, P.w), We.copy(P));
    }
    function de(P) {
      $e.equals(P) === false && (s.viewport(P.x, P.y, P.z, P.w), $e.copy(P));
    }
    function Oe(P, re) {
      let V = c.get(re);
      V === void 0 && (V = /* @__PURE__ */ new WeakMap(), c.set(re, V));
      let q = V.get(P);
      q === void 0 && (q = s.getUniformBlockIndex(re, P.name), V.set(P, q));
    }
    function Ie(P, re) {
      const q = c.get(re).get(P);
      a.get(re) !== q && (s.uniformBlockBinding(re, q, P.__bindingPointIndex), a.set(re, q));
    }
    function nt() {
      s.disable(s.BLEND), s.disable(s.CULL_FACE), s.disable(s.DEPTH_TEST), s.disable(s.POLYGON_OFFSET_FILL), s.disable(s.SCISSOR_TEST), s.disable(s.STENCIL_TEST), s.disable(s.SAMPLE_ALPHA_TO_COVERAGE), s.blendEquation(s.FUNC_ADD), s.blendFunc(s.ONE, s.ZERO), s.blendFuncSeparate(s.ONE, s.ZERO, s.ONE, s.ZERO), s.blendColor(0, 0, 0, 0), s.colorMask(true, true, true, true), s.clearColor(0, 0, 0, 0), s.depthMask(true), s.depthFunc(s.LESS), s.clearDepth(1), s.stencilMask(4294967295), s.stencilFunc(s.ALWAYS, 0, 4294967295), s.stencilOp(s.KEEP, s.KEEP, s.KEEP), s.clearStencil(0), s.cullFace(s.BACK), s.frontFace(s.CCW), s.polygonOffset(0, 0), s.activeTexture(s.TEXTURE0), s.bindFramebuffer(s.FRAMEBUFFER, null), s.bindFramebuffer(s.DRAW_FRAMEBUFFER, null), s.bindFramebuffer(s.READ_FRAMEBUFFER, null), s.useProgram(null), s.lineWidth(1), s.scissor(0, 0, s.canvas.width, s.canvas.height), s.viewport(0, 0, s.canvas.width, s.canvas.height), l = {}, G = null, ae = {}, h = {}, u = /* @__PURE__ */ new WeakMap(), d = [], f = null, g = false, _ = null, m = null, p = null, E = null, M = null, b = null, I = null, A = new Se(0, 0, 0), w = 0, U = false, j = null, x = null, S = null, k = null, B = null, We.set(0, 0, s.canvas.width, s.canvas.height), $e.set(0, 0, s.canvas.width, s.canvas.height), i.reset(), r.reset(), o.reset();
    }
    return {
      buffers: {
        color: i,
        depth: r,
        stencil: o
      },
      enable: pe,
      disable: le,
      bindFramebuffer: Pe,
      drawBuffers: Ee,
      useProgram: Be,
      setBlending: C,
      setMaterial: Nt,
      setFlipSided: Fe,
      setCullFace: He,
      setLineWidth: Te,
      setPolygonOffset: it,
      setScissorTest: Re,
      activeTexture: T,
      bindTexture: v,
      unbindTexture: N,
      compressedTexImage2D: Y,
      compressedTexImage3D: $,
      texImage2D: ue,
      texImage3D: Ae,
      updateUBOMapping: Oe,
      uniformBlockBinding: Ie,
      texStorage2D: Ve,
      texStorage3D: J,
      texSubImage2D: X,
      texSubImage3D: _e,
      compressedTexSubImage2D: ne,
      compressedTexSubImage3D: he,
      scissor: we,
      viewport: de,
      reset: nt
    };
  }
  function Ml(s, e, t, n) {
    const i = M_(n);
    switch (t) {
      case dh:
        return s * e;
      case ph:
        return s * e;
      case mh:
        return s * e * 2;
      case $a:
        return s * e / i.components * i.byteLength;
      case Za:
        return s * e / i.components * i.byteLength;
      case gh:
        return s * e * 2 / i.components * i.byteLength;
      case Ja:
        return s * e * 2 / i.components * i.byteLength;
      case fh:
        return s * e * 3 / i.components * i.byteLength;
      case $t:
        return s * e * 4 / i.components * i.byteLength;
      case Qa:
        return s * e * 4 / i.components * i.byteLength;
      case Cr:
      case Pr:
        return Math.floor((s + 3) / 4) * Math.floor((e + 3) / 4) * 8;
      case Ir:
      case Lr:
        return Math.floor((s + 3) / 4) * Math.floor((e + 3) / 4) * 16;
      case da:
      case pa:
        return Math.max(s, 16) * Math.max(e, 8) / 4;
      case ua:
      case fa:
        return Math.max(s, 8) * Math.max(e, 8) / 2;
      case ma:
      case ga:
        return Math.floor((s + 3) / 4) * Math.floor((e + 3) / 4) * 8;
      case _a:
        return Math.floor((s + 3) / 4) * Math.floor((e + 3) / 4) * 16;
      case xa:
        return Math.floor((s + 3) / 4) * Math.floor((e + 3) / 4) * 16;
      case va:
        return Math.floor((s + 4) / 5) * Math.floor((e + 3) / 4) * 16;
      case ya:
        return Math.floor((s + 4) / 5) * Math.floor((e + 4) / 5) * 16;
      case Ma:
        return Math.floor((s + 5) / 6) * Math.floor((e + 4) / 5) * 16;
      case Sa:
        return Math.floor((s + 5) / 6) * Math.floor((e + 5) / 6) * 16;
      case Ea:
        return Math.floor((s + 7) / 8) * Math.floor((e + 4) / 5) * 16;
      case ba:
        return Math.floor((s + 7) / 8) * Math.floor((e + 5) / 6) * 16;
      case Ta:
        return Math.floor((s + 7) / 8) * Math.floor((e + 7) / 8) * 16;
      case Aa:
        return Math.floor((s + 9) / 10) * Math.floor((e + 4) / 5) * 16;
      case wa:
        return Math.floor((s + 9) / 10) * Math.floor((e + 5) / 6) * 16;
      case Ra:
        return Math.floor((s + 9) / 10) * Math.floor((e + 7) / 8) * 16;
      case Ca:
        return Math.floor((s + 9) / 10) * Math.floor((e + 9) / 10) * 16;
      case Pa:
        return Math.floor((s + 11) / 12) * Math.floor((e + 9) / 10) * 16;
      case Ia:
        return Math.floor((s + 11) / 12) * Math.floor((e + 11) / 12) * 16;
      case Dr:
      case La:
      case Da:
        return Math.ceil(s / 4) * Math.ceil(e / 4) * 16;
      case _h:
      case Ua:
        return Math.ceil(s / 4) * Math.ceil(e / 4) * 8;
      case Na:
      case Fa:
        return Math.ceil(s / 4) * Math.ceil(e / 4) * 16;
    }
    throw new Error(`Unable to determine texture byte length for ${t} format.`);
  }
  function M_(s) {
    switch (s) {
      case In:
      case lh:
        return {
          byteLength: 1,
          components: 1
        };
      case Ds:
      case hh:
      case zs:
        return {
          byteLength: 2,
          components: 1
        };
      case ja:
      case Ka:
        return {
          byteLength: 2,
          components: 4
        };
      case pi:
      case qa:
      case on:
        return {
          byteLength: 4,
          components: 1
        };
      case uh:
        return {
          byteLength: 4,
          components: 3
        };
    }
    throw new Error(`Unknown texture type ${s}.`);
  }
  function S_(s, e, t, n, i, r, o) {
    const a = e.has("WEBGL_multisampled_render_to_texture") ? e.get("WEBGL_multisampled_render_to_texture") : null, c = typeof navigator > "u" ? false : /OculusBrowser/g.test(navigator.userAgent), l = new ye(), h = /* @__PURE__ */ new WeakMap();
    let u;
    const d = /* @__PURE__ */ new WeakMap();
    let f = false;
    try {
      f = typeof OffscreenCanvas < "u" && new OffscreenCanvas(1, 1).getContext("2d") !== null;
    } catch {
    }
    function g(T, v) {
      return f ? new OffscreenCanvas(T, v) : Fs("canvas");
    }
    function _(T, v, N) {
      let Y = 1;
      const $ = Re(T);
      if (($.width > N || $.height > N) && (Y = N / Math.max($.width, $.height)), Y < 1) if (typeof HTMLImageElement < "u" && T instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && T instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && T instanceof ImageBitmap || typeof VideoFrame < "u" && T instanceof VideoFrame) {
        const X = Math.floor(Y * $.width), _e = Math.floor(Y * $.height);
        u === void 0 && (u = g(X, _e));
        const ne = v ? g(X, _e) : u;
        return ne.width = X, ne.height = _e, ne.getContext("2d").drawImage(T, 0, 0, X, _e), console.warn("THREE.WebGLRenderer: Texture has been resized from (" + $.width + "x" + $.height + ") to (" + X + "x" + _e + ")."), ne;
      } else return "data" in T && console.warn("THREE.WebGLRenderer: Image in DataTexture is too big (" + $.width + "x" + $.height + ")."), T;
      return T;
    }
    function m(T) {
      return T.generateMipmaps && T.minFilter !== Pt && T.minFilter !== zt;
    }
    function p(T) {
      s.generateMipmap(T);
    }
    function E(T, v, N, Y, $ = false) {
      if (T !== null) {
        if (s[T] !== void 0) return s[T];
        console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '" + T + "'");
      }
      let X = v;
      if (v === s.RED && (N === s.FLOAT && (X = s.R32F), N === s.HALF_FLOAT && (X = s.R16F), N === s.UNSIGNED_BYTE && (X = s.R8)), v === s.RED_INTEGER && (N === s.UNSIGNED_BYTE && (X = s.R8UI), N === s.UNSIGNED_SHORT && (X = s.R16UI), N === s.UNSIGNED_INT && (X = s.R32UI), N === s.BYTE && (X = s.R8I), N === s.SHORT && (X = s.R16I), N === s.INT && (X = s.R32I)), v === s.RG && (N === s.FLOAT && (X = s.RG32F), N === s.HALF_FLOAT && (X = s.RG16F), N === s.UNSIGNED_BYTE && (X = s.RG8)), v === s.RG_INTEGER && (N === s.UNSIGNED_BYTE && (X = s.RG8UI), N === s.UNSIGNED_SHORT && (X = s.RG16UI), N === s.UNSIGNED_INT && (X = s.RG32UI), N === s.BYTE && (X = s.RG8I), N === s.SHORT && (X = s.RG16I), N === s.INT && (X = s.RG32I)), v === s.RGB_INTEGER && (N === s.UNSIGNED_BYTE && (X = s.RGB8UI), N === s.UNSIGNED_SHORT && (X = s.RGB16UI), N === s.UNSIGNED_INT && (X = s.RGB32UI), N === s.BYTE && (X = s.RGB8I), N === s.SHORT && (X = s.RGB16I), N === s.INT && (X = s.RGB32I)), v === s.RGBA_INTEGER && (N === s.UNSIGNED_BYTE && (X = s.RGBA8UI), N === s.UNSIGNED_SHORT && (X = s.RGBA16UI), N === s.UNSIGNED_INT && (X = s.RGBA32UI), N === s.BYTE && (X = s.RGBA8I), N === s.SHORT && (X = s.RGBA16I), N === s.INT && (X = s.RGBA32I)), v === s.RGB && N === s.UNSIGNED_INT_5_9_9_9_REV && (X = s.RGB9_E5), v === s.RGBA) {
        const _e = $ ? Wr : Ge.getTransfer(Y);
        N === s.FLOAT && (X = s.RGBA32F), N === s.HALF_FLOAT && (X = s.RGBA16F), N === s.UNSIGNED_BYTE && (X = _e === rt ? s.SRGB8_ALPHA8 : s.RGBA8), N === s.UNSIGNED_SHORT_4_4_4_4 && (X = s.RGBA4), N === s.UNSIGNED_SHORT_5_5_5_1 && (X = s.RGB5_A1);
      }
      return (X === s.R16F || X === s.R32F || X === s.RG16F || X === s.RG32F || X === s.RGBA16F || X === s.RGBA32F) && e.get("EXT_color_buffer_float"), X;
    }
    function M(T, v) {
      let N;
      return T ? v === null || v === pi || v === es ? N = s.DEPTH24_STENCIL8 : v === on ? N = s.DEPTH32F_STENCIL8 : v === Ds && (N = s.DEPTH24_STENCIL8, console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")) : v === null || v === pi || v === es ? N = s.DEPTH_COMPONENT24 : v === on ? N = s.DEPTH_COMPONENT32F : v === Ds && (N = s.DEPTH_COMPONENT16), N;
    }
    function b(T, v) {
      return m(T) === true || T.isFramebufferTexture && T.minFilter !== Pt && T.minFilter !== zt ? Math.log2(Math.max(v.width, v.height)) + 1 : T.mipmaps !== void 0 && T.mipmaps.length > 0 ? T.mipmaps.length : T.isCompressedTexture && Array.isArray(T.image) ? v.mipmaps.length : 1;
    }
    function I(T) {
      const v = T.target;
      v.removeEventListener("dispose", I), w(v), v.isVideoTexture && h.delete(v);
    }
    function A(T) {
      const v = T.target;
      v.removeEventListener("dispose", A), j(v);
    }
    function w(T) {
      const v = n.get(T);
      if (v.__webglInit === void 0) return;
      const N = T.source, Y = d.get(N);
      if (Y) {
        const $ = Y[v.__cacheKey];
        $.usedTimes--, $.usedTimes === 0 && U(T), Object.keys(Y).length === 0 && d.delete(N);
      }
      n.remove(T);
    }
    function U(T) {
      const v = n.get(T);
      s.deleteTexture(v.__webglTexture);
      const N = T.source, Y = d.get(N);
      delete Y[v.__cacheKey], o.memory.textures--;
    }
    function j(T) {
      const v = n.get(T);
      if (T.depthTexture && T.depthTexture.dispose(), T.isWebGLCubeRenderTarget) for (let Y = 0; Y < 6; Y++) {
        if (Array.isArray(v.__webglFramebuffer[Y])) for (let $ = 0; $ < v.__webglFramebuffer[Y].length; $++) s.deleteFramebuffer(v.__webglFramebuffer[Y][$]);
        else s.deleteFramebuffer(v.__webglFramebuffer[Y]);
        v.__webglDepthbuffer && s.deleteRenderbuffer(v.__webglDepthbuffer[Y]);
      }
      else {
        if (Array.isArray(v.__webglFramebuffer)) for (let Y = 0; Y < v.__webglFramebuffer.length; Y++) s.deleteFramebuffer(v.__webglFramebuffer[Y]);
        else s.deleteFramebuffer(v.__webglFramebuffer);
        if (v.__webglDepthbuffer && s.deleteRenderbuffer(v.__webglDepthbuffer), v.__webglMultisampledFramebuffer && s.deleteFramebuffer(v.__webglMultisampledFramebuffer), v.__webglColorRenderbuffer) for (let Y = 0; Y < v.__webglColorRenderbuffer.length; Y++) v.__webglColorRenderbuffer[Y] && s.deleteRenderbuffer(v.__webglColorRenderbuffer[Y]);
        v.__webglDepthRenderbuffer && s.deleteRenderbuffer(v.__webglDepthRenderbuffer);
      }
      const N = T.textures;
      for (let Y = 0, $ = N.length; Y < $; Y++) {
        const X = n.get(N[Y]);
        X.__webglTexture && (s.deleteTexture(X.__webglTexture), o.memory.textures--), n.remove(N[Y]);
      }
      n.remove(T);
    }
    let x = 0;
    function S() {
      x = 0;
    }
    function k() {
      const T = x;
      return T >= i.maxTextures && console.warn("THREE.WebGLTextures: Trying to use " + T + " texture units while this GPU supports only " + i.maxTextures), x += 1, T;
    }
    function B(T) {
      const v = [];
      return v.push(T.wrapS), v.push(T.wrapT), v.push(T.wrapR || 0), v.push(T.magFilter), v.push(T.minFilter), v.push(T.anisotropy), v.push(T.internalFormat), v.push(T.format), v.push(T.type), v.push(T.generateMipmaps), v.push(T.premultiplyAlpha), v.push(T.flipY), v.push(T.unpackAlignment), v.push(T.colorSpace), v.join();
    }
    function H(T, v) {
      const N = n.get(T);
      if (T.isVideoTexture && Te(T), T.isRenderTargetTexture === false && T.version > 0 && N.__version !== T.version) {
        const Y = T.image;
        if (Y === null) console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");
        else if (Y.complete === false) console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");
        else {
          $e(N, T, v);
          return;
        }
      }
      t.bindTexture(s.TEXTURE_2D, N.__webglTexture, s.TEXTURE0 + v);
    }
    function K(T, v) {
      const N = n.get(T);
      if (T.version > 0 && N.__version !== T.version) {
        $e(N, T, v);
        return;
      }
      t.bindTexture(s.TEXTURE_2D_ARRAY, N.__webglTexture, s.TEXTURE0 + v);
    }
    function z(T, v) {
      const N = n.get(T);
      if (T.version > 0 && N.__version !== T.version) {
        $e(N, T, v);
        return;
      }
      t.bindTexture(s.TEXTURE_3D, N.__webglTexture, s.TEXTURE0 + v);
    }
    function Q(T, v) {
      const N = n.get(T);
      if (T.version > 0 && N.__version !== T.version) {
        W(N, T, v);
        return;
      }
      t.bindTexture(s.TEXTURE_CUBE_MAP, N.__webglTexture, s.TEXTURE0 + v);
    }
    const G = {
      [Qi]: s.REPEAT,
      [Xn]: s.CLAMP_TO_EDGE,
      [Vr]: s.MIRRORED_REPEAT
    }, ae = {
      [Pt]: s.NEAREST,
      [ch]: s.NEAREST_MIPMAP_NEAREST,
      [Ts]: s.NEAREST_MIPMAP_LINEAR,
      [zt]: s.LINEAR,
      [Rr]: s.LINEAR_MIPMAP_NEAREST,
      [wn]: s.LINEAR_MIPMAP_LINEAR
    }, ce = {
      [$u]: s.NEVER,
      [nd]: s.ALWAYS,
      [Zu]: s.LESS,
      [Mh]: s.LEQUAL,
      [Ju]: s.EQUAL,
      [td]: s.GEQUAL,
      [Qu]: s.GREATER,
      [ed]: s.NOTEQUAL
    };
    function ge(T, v) {
      if (v.type === on && e.has("OES_texture_float_linear") === false && (v.magFilter === zt || v.magFilter === Rr || v.magFilter === Ts || v.magFilter === wn || v.minFilter === zt || v.minFilter === Rr || v.minFilter === Ts || v.minFilter === wn) && console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."), s.texParameteri(T, s.TEXTURE_WRAP_S, G[v.wrapS]), s.texParameteri(T, s.TEXTURE_WRAP_T, G[v.wrapT]), (T === s.TEXTURE_3D || T === s.TEXTURE_2D_ARRAY) && s.texParameteri(T, s.TEXTURE_WRAP_R, G[v.wrapR]), s.texParameteri(T, s.TEXTURE_MAG_FILTER, ae[v.magFilter]), s.texParameteri(T, s.TEXTURE_MIN_FILTER, ae[v.minFilter]), v.compareFunction && (s.texParameteri(T, s.TEXTURE_COMPARE_MODE, s.COMPARE_REF_TO_TEXTURE), s.texParameteri(T, s.TEXTURE_COMPARE_FUNC, ce[v.compareFunction])), e.has("EXT_texture_filter_anisotropic") === true) {
        if (v.magFilter === Pt || v.minFilter !== Ts && v.minFilter !== wn || v.type === on && e.has("OES_texture_float_linear") === false) return;
        if (v.anisotropy > 1 || n.get(v).__currentAnisotropy) {
          const N = e.get("EXT_texture_filter_anisotropic");
          s.texParameterf(T, N.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(v.anisotropy, i.getMaxAnisotropy())), n.get(v).__currentAnisotropy = v.anisotropy;
        }
      }
    }
    function We(T, v) {
      let N = false;
      T.__webglInit === void 0 && (T.__webglInit = true, v.addEventListener("dispose", I));
      const Y = v.source;
      let $ = d.get(Y);
      $ === void 0 && ($ = {}, d.set(Y, $));
      const X = B(v);
      if (X !== T.__cacheKey) {
        $[X] === void 0 && ($[X] = {
          texture: s.createTexture(),
          usedTimes: 0
        }, o.memory.textures++, N = true), $[X].usedTimes++;
        const _e = $[T.__cacheKey];
        _e !== void 0 && ($[T.__cacheKey].usedTimes--, _e.usedTimes === 0 && U(v)), T.__cacheKey = X, T.__webglTexture = $[X].texture;
      }
      return N;
    }
    function $e(T, v, N) {
      let Y = s.TEXTURE_2D;
      (v.isDataArrayTexture || v.isCompressedArrayTexture) && (Y = s.TEXTURE_2D_ARRAY), v.isData3DTexture && (Y = s.TEXTURE_3D);
      const $ = We(T, v), X = v.source;
      t.bindTexture(Y, T.__webglTexture, s.TEXTURE0 + N);
      const _e = n.get(X);
      if (X.version !== _e.__version || $ === true) {
        t.activeTexture(s.TEXTURE0 + N);
        const ne = Ge.getPrimaries(Ge.workingColorSpace), he = v.colorSpace === Wn ? null : Ge.getPrimaries(v.colorSpace), Ve = v.colorSpace === Wn || ne === he ? s.NONE : s.BROWSER_DEFAULT_WEBGL;
        s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, v.flipY), s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL, v.premultiplyAlpha), s.pixelStorei(s.UNPACK_ALIGNMENT, v.unpackAlignment), s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL, Ve);
        let J = _(v.image, false, i.maxTextureSize);
        J = it(v, J);
        const ue = r.convert(v.format, v.colorSpace), Ae = r.convert(v.type);
        let we = E(v.internalFormat, ue, Ae, v.colorSpace, v.isVideoTexture);
        ge(Y, v);
        let de;
        const Oe = v.mipmaps, Ie = v.isVideoTexture !== true, nt = _e.__version === void 0 || $ === true, P = X.dataReady, re = b(v, J);
        if (v.isDepthTexture) we = M(v.format === ts, v.type), nt && (Ie ? t.texStorage2D(s.TEXTURE_2D, 1, we, J.width, J.height) : t.texImage2D(s.TEXTURE_2D, 0, we, J.width, J.height, 0, ue, Ae, null));
        else if (v.isDataTexture) if (Oe.length > 0) {
          Ie && nt && t.texStorage2D(s.TEXTURE_2D, re, we, Oe[0].width, Oe[0].height);
          for (let V = 0, q = Oe.length; V < q; V++) de = Oe[V], Ie ? P && t.texSubImage2D(s.TEXTURE_2D, V, 0, 0, de.width, de.height, ue, Ae, de.data) : t.texImage2D(s.TEXTURE_2D, V, we, de.width, de.height, 0, ue, Ae, de.data);
          v.generateMipmaps = false;
        } else Ie ? (nt && t.texStorage2D(s.TEXTURE_2D, re, we, J.width, J.height), P && t.texSubImage2D(s.TEXTURE_2D, 0, 0, 0, J.width, J.height, ue, Ae, J.data)) : t.texImage2D(s.TEXTURE_2D, 0, we, J.width, J.height, 0, ue, Ae, J.data);
        else if (v.isCompressedTexture) if (v.isCompressedArrayTexture) {
          Ie && nt && t.texStorage3D(s.TEXTURE_2D_ARRAY, re, we, Oe[0].width, Oe[0].height, J.depth);
          for (let V = 0, q = Oe.length; V < q; V++) if (de = Oe[V], v.format !== $t) if (ue !== null) if (Ie) {
            if (P) if (v.layerUpdates.size > 0) {
              const ie = Ml(de.width, de.height, v.format, v.type);
              for (const oe of v.layerUpdates) {
                const ze = de.data.subarray(oe * ie / de.data.BYTES_PER_ELEMENT, (oe + 1) * ie / de.data.BYTES_PER_ELEMENT);
                t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY, V, 0, 0, oe, de.width, de.height, 1, ue, ze, 0, 0);
              }
              v.clearLayerUpdates();
            } else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY, V, 0, 0, 0, de.width, de.height, J.depth, ue, de.data, 0, 0);
          } else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY, V, we, de.width, de.height, J.depth, 0, de.data, 0, 0);
          else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");
          else Ie ? P && t.texSubImage3D(s.TEXTURE_2D_ARRAY, V, 0, 0, 0, de.width, de.height, J.depth, ue, Ae, de.data) : t.texImage3D(s.TEXTURE_2D_ARRAY, V, we, de.width, de.height, J.depth, 0, ue, Ae, de.data);
        } else {
          Ie && nt && t.texStorage2D(s.TEXTURE_2D, re, we, Oe[0].width, Oe[0].height);
          for (let V = 0, q = Oe.length; V < q; V++) de = Oe[V], v.format !== $t ? ue !== null ? Ie ? P && t.compressedTexSubImage2D(s.TEXTURE_2D, V, 0, 0, de.width, de.height, ue, de.data) : t.compressedTexImage2D(s.TEXTURE_2D, V, we, de.width, de.height, 0, de.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : Ie ? P && t.texSubImage2D(s.TEXTURE_2D, V, 0, 0, de.width, de.height, ue, Ae, de.data) : t.texImage2D(s.TEXTURE_2D, V, we, de.width, de.height, 0, ue, Ae, de.data);
        }
        else if (v.isDataArrayTexture) if (Ie) {
          if (nt && t.texStorage3D(s.TEXTURE_2D_ARRAY, re, we, J.width, J.height, J.depth), P) if (v.layerUpdates.size > 0) {
            const V = Ml(J.width, J.height, v.format, v.type);
            for (const q of v.layerUpdates) {
              const ie = J.data.subarray(q * V / J.data.BYTES_PER_ELEMENT, (q + 1) * V / J.data.BYTES_PER_ELEMENT);
              t.texSubImage3D(s.TEXTURE_2D_ARRAY, 0, 0, 0, q, J.width, J.height, 1, ue, Ae, ie);
            }
            v.clearLayerUpdates();
          } else t.texSubImage3D(s.TEXTURE_2D_ARRAY, 0, 0, 0, 0, J.width, J.height, J.depth, ue, Ae, J.data);
        } else t.texImage3D(s.TEXTURE_2D_ARRAY, 0, we, J.width, J.height, J.depth, 0, ue, Ae, J.data);
        else if (v.isData3DTexture) Ie ? (nt && t.texStorage3D(s.TEXTURE_3D, re, we, J.width, J.height, J.depth), P && t.texSubImage3D(s.TEXTURE_3D, 0, 0, 0, 0, J.width, J.height, J.depth, ue, Ae, J.data)) : t.texImage3D(s.TEXTURE_3D, 0, we, J.width, J.height, J.depth, 0, ue, Ae, J.data);
        else if (v.isFramebufferTexture) {
          if (nt) if (Ie) t.texStorage2D(s.TEXTURE_2D, re, we, J.width, J.height);
          else {
            let V = J.width, q = J.height;
            for (let ie = 0; ie < re; ie++) t.texImage2D(s.TEXTURE_2D, ie, we, V, q, 0, ue, Ae, null), V >>= 1, q >>= 1;
          }
        } else if (Oe.length > 0) {
          if (Ie && nt) {
            const V = Re(Oe[0]);
            t.texStorage2D(s.TEXTURE_2D, re, we, V.width, V.height);
          }
          for (let V = 0, q = Oe.length; V < q; V++) de = Oe[V], Ie ? P && t.texSubImage2D(s.TEXTURE_2D, V, 0, 0, ue, Ae, de) : t.texImage2D(s.TEXTURE_2D, V, we, ue, Ae, de);
          v.generateMipmaps = false;
        } else if (Ie) {
          if (nt) {
            const V = Re(J);
            t.texStorage2D(s.TEXTURE_2D, re, we, V.width, V.height);
          }
          P && t.texSubImage2D(s.TEXTURE_2D, 0, 0, 0, ue, Ae, J);
        } else t.texImage2D(s.TEXTURE_2D, 0, we, ue, Ae, J);
        m(v) && p(Y), _e.__version = X.version, v.onUpdate && v.onUpdate(v);
      }
      T.__version = v.version;
    }
    function W(T, v, N) {
      if (v.image.length !== 6) return;
      const Y = We(T, v), $ = v.source;
      t.bindTexture(s.TEXTURE_CUBE_MAP, T.__webglTexture, s.TEXTURE0 + N);
      const X = n.get($);
      if ($.version !== X.__version || Y === true) {
        t.activeTexture(s.TEXTURE0 + N);
        const _e = Ge.getPrimaries(Ge.workingColorSpace), ne = v.colorSpace === Wn ? null : Ge.getPrimaries(v.colorSpace), he = v.colorSpace === Wn || _e === ne ? s.NONE : s.BROWSER_DEFAULT_WEBGL;
        s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, v.flipY), s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL, v.premultiplyAlpha), s.pixelStorei(s.UNPACK_ALIGNMENT, v.unpackAlignment), s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL, he);
        const Ve = v.isCompressedTexture || v.image[0].isCompressedTexture, J = v.image[0] && v.image[0].isDataTexture, ue = [];
        for (let q = 0; q < 6; q++) !Ve && !J ? ue[q] = _(v.image[q], true, i.maxCubemapSize) : ue[q] = J ? v.image[q].image : v.image[q], ue[q] = it(v, ue[q]);
        const Ae = ue[0], we = r.convert(v.format, v.colorSpace), de = r.convert(v.type), Oe = E(v.internalFormat, we, de, v.colorSpace), Ie = v.isVideoTexture !== true, nt = X.__version === void 0 || Y === true, P = $.dataReady;
        let re = b(v, Ae);
        ge(s.TEXTURE_CUBE_MAP, v);
        let V;
        if (Ve) {
          Ie && nt && t.texStorage2D(s.TEXTURE_CUBE_MAP, re, Oe, Ae.width, Ae.height);
          for (let q = 0; q < 6; q++) {
            V = ue[q].mipmaps;
            for (let ie = 0; ie < V.length; ie++) {
              const oe = V[ie];
              v.format !== $t ? we !== null ? Ie ? P && t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + q, ie, 0, 0, oe.width, oe.height, we, oe.data) : t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + q, ie, Oe, oe.width, oe.height, 0, oe.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()") : Ie ? P && t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + q, ie, 0, 0, oe.width, oe.height, we, de, oe.data) : t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + q, ie, Oe, oe.width, oe.height, 0, we, de, oe.data);
            }
          }
        } else {
          if (V = v.mipmaps, Ie && nt) {
            V.length > 0 && re++;
            const q = Re(ue[0]);
            t.texStorage2D(s.TEXTURE_CUBE_MAP, re, Oe, q.width, q.height);
          }
          for (let q = 0; q < 6; q++) if (J) {
            Ie ? P && t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + q, 0, 0, 0, ue[q].width, ue[q].height, we, de, ue[q].data) : t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + q, 0, Oe, ue[q].width, ue[q].height, 0, we, de, ue[q].data);
            for (let ie = 0; ie < V.length; ie++) {
              const ze = V[ie].image[q].image;
              Ie ? P && t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + q, ie + 1, 0, 0, ze.width, ze.height, we, de, ze.data) : t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + q, ie + 1, Oe, ze.width, ze.height, 0, we, de, ze.data);
            }
          } else {
            Ie ? P && t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + q, 0, 0, 0, we, de, ue[q]) : t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + q, 0, Oe, we, de, ue[q]);
            for (let ie = 0; ie < V.length; ie++) {
              const oe = V[ie];
              Ie ? P && t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + q, ie + 1, 0, 0, we, de, oe.image[q]) : t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + q, ie + 1, Oe, we, de, oe.image[q]);
            }
          }
        }
        m(v) && p(s.TEXTURE_CUBE_MAP), X.__version = $.version, v.onUpdate && v.onUpdate(v);
      }
      T.__version = v.version;
    }
    function Z(T, v, N, Y, $, X) {
      const _e = r.convert(N.format, N.colorSpace), ne = r.convert(N.type), he = E(N.internalFormat, _e, ne, N.colorSpace);
      if (!n.get(v).__hasExternalTextures) {
        const J = Math.max(1, v.width >> X), ue = Math.max(1, v.height >> X);
        $ === s.TEXTURE_3D || $ === s.TEXTURE_2D_ARRAY ? t.texImage3D($, X, he, J, ue, v.depth, 0, _e, ne, null) : t.texImage2D($, X, he, J, ue, 0, _e, ne, null);
      }
      t.bindFramebuffer(s.FRAMEBUFFER, T), He(v) ? a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER, Y, $, n.get(N).__webglTexture, 0, Fe(v)) : ($ === s.TEXTURE_2D || $ >= s.TEXTURE_CUBE_MAP_POSITIVE_X && $ <= s.TEXTURE_CUBE_MAP_NEGATIVE_Z) && s.framebufferTexture2D(s.FRAMEBUFFER, Y, $, n.get(N).__webglTexture, X), t.bindFramebuffer(s.FRAMEBUFFER, null);
    }
    function pe(T, v, N) {
      if (s.bindRenderbuffer(s.RENDERBUFFER, T), v.depthBuffer) {
        const Y = v.depthTexture, $ = Y && Y.isDepthTexture ? Y.type : null, X = M(v.stencilBuffer, $), _e = v.stencilBuffer ? s.DEPTH_STENCIL_ATTACHMENT : s.DEPTH_ATTACHMENT, ne = Fe(v);
        He(v) ? a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER, ne, X, v.width, v.height) : N ? s.renderbufferStorageMultisample(s.RENDERBUFFER, ne, X, v.width, v.height) : s.renderbufferStorage(s.RENDERBUFFER, X, v.width, v.height), s.framebufferRenderbuffer(s.FRAMEBUFFER, _e, s.RENDERBUFFER, T);
      } else {
        const Y = v.textures;
        for (let $ = 0; $ < Y.length; $++) {
          const X = Y[$], _e = r.convert(X.format, X.colorSpace), ne = r.convert(X.type), he = E(X.internalFormat, _e, ne, X.colorSpace), Ve = Fe(v);
          N && He(v) === false ? s.renderbufferStorageMultisample(s.RENDERBUFFER, Ve, he, v.width, v.height) : He(v) ? a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER, Ve, he, v.width, v.height) : s.renderbufferStorage(s.RENDERBUFFER, he, v.width, v.height);
        }
      }
      s.bindRenderbuffer(s.RENDERBUFFER, null);
    }
    function le(T, v) {
      if (v && v.isWebGLCubeRenderTarget) throw new Error("Depth Texture with cube render targets is not supported");
      if (t.bindFramebuffer(s.FRAMEBUFFER, T), !(v.depthTexture && v.depthTexture.isDepthTexture)) throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");
      (!n.get(v.depthTexture).__webglTexture || v.depthTexture.image.width !== v.width || v.depthTexture.image.height !== v.height) && (v.depthTexture.image.width = v.width, v.depthTexture.image.height = v.height, v.depthTexture.needsUpdate = true), H(v.depthTexture, 0);
      const Y = n.get(v.depthTexture).__webglTexture, $ = Fe(v);
      if (v.depthTexture.format === qi) He(v) ? a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER, s.DEPTH_ATTACHMENT, s.TEXTURE_2D, Y, 0, $) : s.framebufferTexture2D(s.FRAMEBUFFER, s.DEPTH_ATTACHMENT, s.TEXTURE_2D, Y, 0);
      else if (v.depthTexture.format === ts) He(v) ? a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER, s.DEPTH_STENCIL_ATTACHMENT, s.TEXTURE_2D, Y, 0, $) : s.framebufferTexture2D(s.FRAMEBUFFER, s.DEPTH_STENCIL_ATTACHMENT, s.TEXTURE_2D, Y, 0);
      else throw new Error("Unknown depthTexture format");
    }
    function Pe(T) {
      const v = n.get(T), N = T.isWebGLCubeRenderTarget === true;
      if (v.__boundDepthTexture !== T.depthTexture) {
        const Y = T.depthTexture;
        if (v.__depthDisposeCallback && v.__depthDisposeCallback(), Y) {
          const $ = () => {
            delete v.__boundDepthTexture, delete v.__depthDisposeCallback, Y.removeEventListener("dispose", $);
          };
          Y.addEventListener("dispose", $), v.__depthDisposeCallback = $;
        }
        v.__boundDepthTexture = Y;
      }
      if (T.depthTexture && !v.__autoAllocateDepthBuffer) {
        if (N) throw new Error("target.depthTexture not supported in Cube render targets");
        le(v.__webglFramebuffer, T);
      } else if (N) {
        v.__webglDepthbuffer = [];
        for (let Y = 0; Y < 6; Y++) if (t.bindFramebuffer(s.FRAMEBUFFER, v.__webglFramebuffer[Y]), v.__webglDepthbuffer[Y] === void 0) v.__webglDepthbuffer[Y] = s.createRenderbuffer(), pe(v.__webglDepthbuffer[Y], T, false);
        else {
          const $ = T.stencilBuffer ? s.DEPTH_STENCIL_ATTACHMENT : s.DEPTH_ATTACHMENT, X = v.__webglDepthbuffer[Y];
          s.bindRenderbuffer(s.RENDERBUFFER, X), s.framebufferRenderbuffer(s.FRAMEBUFFER, $, s.RENDERBUFFER, X);
        }
      } else if (t.bindFramebuffer(s.FRAMEBUFFER, v.__webglFramebuffer), v.__webglDepthbuffer === void 0) v.__webglDepthbuffer = s.createRenderbuffer(), pe(v.__webglDepthbuffer, T, false);
      else {
        const Y = T.stencilBuffer ? s.DEPTH_STENCIL_ATTACHMENT : s.DEPTH_ATTACHMENT, $ = v.__webglDepthbuffer;
        s.bindRenderbuffer(s.RENDERBUFFER, $), s.framebufferRenderbuffer(s.FRAMEBUFFER, Y, s.RENDERBUFFER, $);
      }
      t.bindFramebuffer(s.FRAMEBUFFER, null);
    }
    function Ee(T, v, N) {
      const Y = n.get(T);
      v !== void 0 && Z(Y.__webglFramebuffer, T, T.texture, s.COLOR_ATTACHMENT0, s.TEXTURE_2D, 0), N !== void 0 && Pe(T);
    }
    function Be(T) {
      const v = T.texture, N = n.get(T), Y = n.get(v);
      T.addEventListener("dispose", A);
      const $ = T.textures, X = T.isWebGLCubeRenderTarget === true, _e = $.length > 1;
      if (_e || (Y.__webglTexture === void 0 && (Y.__webglTexture = s.createTexture()), Y.__version = v.version, o.memory.textures++), X) {
        N.__webglFramebuffer = [];
        for (let ne = 0; ne < 6; ne++) if (v.mipmaps && v.mipmaps.length > 0) {
          N.__webglFramebuffer[ne] = [];
          for (let he = 0; he < v.mipmaps.length; he++) N.__webglFramebuffer[ne][he] = s.createFramebuffer();
        } else N.__webglFramebuffer[ne] = s.createFramebuffer();
      } else {
        if (v.mipmaps && v.mipmaps.length > 0) {
          N.__webglFramebuffer = [];
          for (let ne = 0; ne < v.mipmaps.length; ne++) N.__webglFramebuffer[ne] = s.createFramebuffer();
        } else N.__webglFramebuffer = s.createFramebuffer();
        if (_e) for (let ne = 0, he = $.length; ne < he; ne++) {
          const Ve = n.get($[ne]);
          Ve.__webglTexture === void 0 && (Ve.__webglTexture = s.createTexture(), o.memory.textures++);
        }
        if (T.samples > 0 && He(T) === false) {
          N.__webglMultisampledFramebuffer = s.createFramebuffer(), N.__webglColorRenderbuffer = [], t.bindFramebuffer(s.FRAMEBUFFER, N.__webglMultisampledFramebuffer);
          for (let ne = 0; ne < $.length; ne++) {
            const he = $[ne];
            N.__webglColorRenderbuffer[ne] = s.createRenderbuffer(), s.bindRenderbuffer(s.RENDERBUFFER, N.__webglColorRenderbuffer[ne]);
            const Ve = r.convert(he.format, he.colorSpace), J = r.convert(he.type), ue = E(he.internalFormat, Ve, J, he.colorSpace, T.isXRRenderTarget === true), Ae = Fe(T);
            s.renderbufferStorageMultisample(s.RENDERBUFFER, Ae, ue, T.width, T.height), s.framebufferRenderbuffer(s.FRAMEBUFFER, s.COLOR_ATTACHMENT0 + ne, s.RENDERBUFFER, N.__webglColorRenderbuffer[ne]);
          }
          s.bindRenderbuffer(s.RENDERBUFFER, null), T.depthBuffer && (N.__webglDepthRenderbuffer = s.createRenderbuffer(), pe(N.__webglDepthRenderbuffer, T, true)), t.bindFramebuffer(s.FRAMEBUFFER, null);
        }
      }
      if (X) {
        t.bindTexture(s.TEXTURE_CUBE_MAP, Y.__webglTexture), ge(s.TEXTURE_CUBE_MAP, v);
        for (let ne = 0; ne < 6; ne++) if (v.mipmaps && v.mipmaps.length > 0) for (let he = 0; he < v.mipmaps.length; he++) Z(N.__webglFramebuffer[ne][he], T, v, s.COLOR_ATTACHMENT0, s.TEXTURE_CUBE_MAP_POSITIVE_X + ne, he);
        else Z(N.__webglFramebuffer[ne], T, v, s.COLOR_ATTACHMENT0, s.TEXTURE_CUBE_MAP_POSITIVE_X + ne, 0);
        m(v) && p(s.TEXTURE_CUBE_MAP), t.unbindTexture();
      } else if (_e) {
        for (let ne = 0, he = $.length; ne < he; ne++) {
          const Ve = $[ne], J = n.get(Ve);
          t.bindTexture(s.TEXTURE_2D, J.__webglTexture), ge(s.TEXTURE_2D, Ve), Z(N.__webglFramebuffer, T, Ve, s.COLOR_ATTACHMENT0 + ne, s.TEXTURE_2D, 0), m(Ve) && p(s.TEXTURE_2D);
        }
        t.unbindTexture();
      } else {
        let ne = s.TEXTURE_2D;
        if ((T.isWebGL3DRenderTarget || T.isWebGLArrayRenderTarget) && (ne = T.isWebGL3DRenderTarget ? s.TEXTURE_3D : s.TEXTURE_2D_ARRAY), t.bindTexture(ne, Y.__webglTexture), ge(ne, v), v.mipmaps && v.mipmaps.length > 0) for (let he = 0; he < v.mipmaps.length; he++) Z(N.__webglFramebuffer[he], T, v, s.COLOR_ATTACHMENT0, ne, he);
        else Z(N.__webglFramebuffer, T, v, s.COLOR_ATTACHMENT0, ne, 0);
        m(v) && p(ne), t.unbindTexture();
      }
      T.depthBuffer && Pe(T);
    }
    function Qe(T) {
      const v = T.textures;
      for (let N = 0, Y = v.length; N < Y; N++) {
        const $ = v[N];
        if (m($)) {
          const X = T.isWebGLCubeRenderTarget ? s.TEXTURE_CUBE_MAP : s.TEXTURE_2D, _e = n.get($).__webglTexture;
          t.bindTexture(X, _e), p(X), t.unbindTexture();
        }
      }
    }
    const ke = [], C = [];
    function Nt(T) {
      if (T.samples > 0) {
        if (He(T) === false) {
          const v = T.textures, N = T.width, Y = T.height;
          let $ = s.COLOR_BUFFER_BIT;
          const X = T.stencilBuffer ? s.DEPTH_STENCIL_ATTACHMENT : s.DEPTH_ATTACHMENT, _e = n.get(T), ne = v.length > 1;
          if (ne) for (let he = 0; he < v.length; he++) t.bindFramebuffer(s.FRAMEBUFFER, _e.__webglMultisampledFramebuffer), s.framebufferRenderbuffer(s.FRAMEBUFFER, s.COLOR_ATTACHMENT0 + he, s.RENDERBUFFER, null), t.bindFramebuffer(s.FRAMEBUFFER, _e.__webglFramebuffer), s.framebufferTexture2D(s.DRAW_FRAMEBUFFER, s.COLOR_ATTACHMENT0 + he, s.TEXTURE_2D, null, 0);
          t.bindFramebuffer(s.READ_FRAMEBUFFER, _e.__webglMultisampledFramebuffer), t.bindFramebuffer(s.DRAW_FRAMEBUFFER, _e.__webglFramebuffer);
          for (let he = 0; he < v.length; he++) {
            if (T.resolveDepthBuffer && (T.depthBuffer && ($ |= s.DEPTH_BUFFER_BIT), T.stencilBuffer && T.resolveStencilBuffer && ($ |= s.STENCIL_BUFFER_BIT)), ne) {
              s.framebufferRenderbuffer(s.READ_FRAMEBUFFER, s.COLOR_ATTACHMENT0, s.RENDERBUFFER, _e.__webglColorRenderbuffer[he]);
              const Ve = n.get(v[he]).__webglTexture;
              s.framebufferTexture2D(s.DRAW_FRAMEBUFFER, s.COLOR_ATTACHMENT0, s.TEXTURE_2D, Ve, 0);
            }
            s.blitFramebuffer(0, 0, N, Y, 0, 0, N, Y, $, s.NEAREST), c === true && (ke.length = 0, C.length = 0, ke.push(s.COLOR_ATTACHMENT0 + he), T.depthBuffer && T.resolveDepthBuffer === false && (ke.push(X), C.push(X), s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER, C)), s.invalidateFramebuffer(s.READ_FRAMEBUFFER, ke));
          }
          if (t.bindFramebuffer(s.READ_FRAMEBUFFER, null), t.bindFramebuffer(s.DRAW_FRAMEBUFFER, null), ne) for (let he = 0; he < v.length; he++) {
            t.bindFramebuffer(s.FRAMEBUFFER, _e.__webglMultisampledFramebuffer), s.framebufferRenderbuffer(s.FRAMEBUFFER, s.COLOR_ATTACHMENT0 + he, s.RENDERBUFFER, _e.__webglColorRenderbuffer[he]);
            const Ve = n.get(v[he]).__webglTexture;
            t.bindFramebuffer(s.FRAMEBUFFER, _e.__webglFramebuffer), s.framebufferTexture2D(s.DRAW_FRAMEBUFFER, s.COLOR_ATTACHMENT0 + he, s.TEXTURE_2D, Ve, 0);
          }
          t.bindFramebuffer(s.DRAW_FRAMEBUFFER, _e.__webglMultisampledFramebuffer);
        } else if (T.depthBuffer && T.resolveDepthBuffer === false && c) {
          const v = T.stencilBuffer ? s.DEPTH_STENCIL_ATTACHMENT : s.DEPTH_ATTACHMENT;
          s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER, [
            v
          ]);
        }
      }
    }
    function Fe(T) {
      return Math.min(i.maxSamples, T.samples);
    }
    function He(T) {
      const v = n.get(T);
      return T.samples > 0 && e.has("WEBGL_multisampled_render_to_texture") === true && v.__useRenderToTexture !== false;
    }
    function Te(T) {
      const v = o.render.frame;
      h.get(T) !== v && (h.set(T, v), T.update());
    }
    function it(T, v) {
      const N = T.colorSpace, Y = T.format, $ = T.type;
      return T.isCompressedTexture === true || T.isVideoTexture === true || N !== Et && N !== Wn && (Ge.getTransfer(N) === rt ? (Y !== $t || $ !== In) && console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.") : console.error("THREE.WebGLTextures: Unsupported texture color space:", N)), v;
    }
    function Re(T) {
      return typeof HTMLImageElement < "u" && T instanceof HTMLImageElement ? (l.width = T.naturalWidth || T.width, l.height = T.naturalHeight || T.height) : typeof VideoFrame < "u" && T instanceof VideoFrame ? (l.width = T.displayWidth, l.height = T.displayHeight) : (l.width = T.width, l.height = T.height), l;
    }
    this.allocateTextureUnit = k, this.resetTextureUnits = S, this.setTexture2D = H, this.setTexture2DArray = K, this.setTexture3D = z, this.setTextureCube = Q, this.rebindTextures = Ee, this.setupRenderTarget = Be, this.updateRenderTargetMipmap = Qe, this.updateMultisampleRenderTarget = Nt, this.setupDepthRenderbuffer = Pe, this.setupFrameBufferTexture = Z, this.useMultisampledRTT = He;
  }
  function E_(s, e) {
    function t(n, i = Wn) {
      let r;
      const o = Ge.getTransfer(i);
      if (n === In) return s.UNSIGNED_BYTE;
      if (n === ja) return s.UNSIGNED_SHORT_4_4_4_4;
      if (n === Ka) return s.UNSIGNED_SHORT_5_5_5_1;
      if (n === uh) return s.UNSIGNED_INT_5_9_9_9_REV;
      if (n === lh) return s.BYTE;
      if (n === hh) return s.SHORT;
      if (n === Ds) return s.UNSIGNED_SHORT;
      if (n === qa) return s.INT;
      if (n === pi) return s.UNSIGNED_INT;
      if (n === on) return s.FLOAT;
      if (n === zs) return s.HALF_FLOAT;
      if (n === dh) return s.ALPHA;
      if (n === fh) return s.RGB;
      if (n === $t) return s.RGBA;
      if (n === ph) return s.LUMINANCE;
      if (n === mh) return s.LUMINANCE_ALPHA;
      if (n === qi) return s.DEPTH_COMPONENT;
      if (n === ts) return s.DEPTH_STENCIL;
      if (n === $a) return s.RED;
      if (n === Za) return s.RED_INTEGER;
      if (n === gh) return s.RG;
      if (n === Ja) return s.RG_INTEGER;
      if (n === Qa) return s.RGBA_INTEGER;
      if (n === Cr || n === Pr || n === Ir || n === Lr) if (o === rt) if (r = e.get("WEBGL_compressed_texture_s3tc_srgb"), r !== null) {
        if (n === Cr) return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;
        if (n === Pr) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
        if (n === Ir) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
        if (n === Lr) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
      } else return null;
      else if (r = e.get("WEBGL_compressed_texture_s3tc"), r !== null) {
        if (n === Cr) return r.COMPRESSED_RGB_S3TC_DXT1_EXT;
        if (n === Pr) return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        if (n === Ir) return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        if (n === Lr) return r.COMPRESSED_RGBA_S3TC_DXT5_EXT;
      } else return null;
      if (n === ua || n === da || n === fa || n === pa) if (r = e.get("WEBGL_compressed_texture_pvrtc"), r !== null) {
        if (n === ua) return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        if (n === da) return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        if (n === fa) return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
        if (n === pa) return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
      } else return null;
      if (n === ma || n === ga || n === _a) if (r = e.get("WEBGL_compressed_texture_etc"), r !== null) {
        if (n === ma || n === ga) return o === rt ? r.COMPRESSED_SRGB8_ETC2 : r.COMPRESSED_RGB8_ETC2;
        if (n === _a) return o === rt ? r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : r.COMPRESSED_RGBA8_ETC2_EAC;
      } else return null;
      if (n === xa || n === va || n === ya || n === Ma || n === Sa || n === Ea || n === ba || n === Ta || n === Aa || n === wa || n === Ra || n === Ca || n === Pa || n === Ia) if (r = e.get("WEBGL_compressed_texture_astc"), r !== null) {
        if (n === xa) return o === rt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR : r.COMPRESSED_RGBA_ASTC_4x4_KHR;
        if (n === va) return o === rt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR : r.COMPRESSED_RGBA_ASTC_5x4_KHR;
        if (n === ya) return o === rt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR : r.COMPRESSED_RGBA_ASTC_5x5_KHR;
        if (n === Ma) return o === rt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR : r.COMPRESSED_RGBA_ASTC_6x5_KHR;
        if (n === Sa) return o === rt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR : r.COMPRESSED_RGBA_ASTC_6x6_KHR;
        if (n === Ea) return o === rt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR : r.COMPRESSED_RGBA_ASTC_8x5_KHR;
        if (n === ba) return o === rt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR : r.COMPRESSED_RGBA_ASTC_8x6_KHR;
        if (n === Ta) return o === rt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR : r.COMPRESSED_RGBA_ASTC_8x8_KHR;
        if (n === Aa) return o === rt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR : r.COMPRESSED_RGBA_ASTC_10x5_KHR;
        if (n === wa) return o === rt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR : r.COMPRESSED_RGBA_ASTC_10x6_KHR;
        if (n === Ra) return o === rt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR : r.COMPRESSED_RGBA_ASTC_10x8_KHR;
        if (n === Ca) return o === rt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR : r.COMPRESSED_RGBA_ASTC_10x10_KHR;
        if (n === Pa) return o === rt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR : r.COMPRESSED_RGBA_ASTC_12x10_KHR;
        if (n === Ia) return o === rt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR : r.COMPRESSED_RGBA_ASTC_12x12_KHR;
      } else return null;
      if (n === Dr || n === La || n === Da) if (r = e.get("EXT_texture_compression_bptc"), r !== null) {
        if (n === Dr) return o === rt ? r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT : r.COMPRESSED_RGBA_BPTC_UNORM_EXT;
        if (n === La) return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
        if (n === Da) return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
      } else return null;
      if (n === _h || n === Ua || n === Na || n === Fa) if (r = e.get("EXT_texture_compression_rgtc"), r !== null) {
        if (n === Dr) return r.COMPRESSED_RED_RGTC1_EXT;
        if (n === Ua) return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;
        if (n === Na) return r.COMPRESSED_RED_GREEN_RGTC2_EXT;
        if (n === Fa) return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
      } else return null;
      return n === es ? s.UNSIGNED_INT_24_8 : s[n] !== void 0 ? s[n] : null;
    }
    return {
      convert: t
    };
  }
  class b_ extends Ct {
    constructor(e = []) {
      super(), this.isArrayCamera = true, this.cameras = e;
    }
  }
  class hn extends ot {
    constructor() {
      super(), this.isGroup = true, this.type = "Group";
    }
  }
  const T_ = {
    type: "move"
  };
  class Bo {
    constructor() {
      this._targetRay = null, this._grip = null, this._hand = null;
    }
    getHandSpace() {
      return this._hand === null && (this._hand = new hn(), this._hand.matrixAutoUpdate = false, this._hand.visible = false, this._hand.joints = {}, this._hand.inputState = {
        pinching: false
      }), this._hand;
    }
    getTargetRaySpace() {
      return this._targetRay === null && (this._targetRay = new hn(), this._targetRay.matrixAutoUpdate = false, this._targetRay.visible = false, this._targetRay.hasLinearVelocity = false, this._targetRay.linearVelocity = new R(), this._targetRay.hasAngularVelocity = false, this._targetRay.angularVelocity = new R()), this._targetRay;
    }
    getGripSpace() {
      return this._grip === null && (this._grip = new hn(), this._grip.matrixAutoUpdate = false, this._grip.visible = false, this._grip.hasLinearVelocity = false, this._grip.linearVelocity = new R(), this._grip.hasAngularVelocity = false, this._grip.angularVelocity = new R()), this._grip;
    }
    dispatchEvent(e) {
      return this._targetRay !== null && this._targetRay.dispatchEvent(e), this._grip !== null && this._grip.dispatchEvent(e), this._hand !== null && this._hand.dispatchEvent(e), this;
    }
    connect(e) {
      if (e && e.hand) {
        const t = this._hand;
        if (t) for (const n of e.hand.values()) this._getHandJoint(t, n);
      }
      return this.dispatchEvent({
        type: "connected",
        data: e
      }), this;
    }
    disconnect(e) {
      return this.dispatchEvent({
        type: "disconnected",
        data: e
      }), this._targetRay !== null && (this._targetRay.visible = false), this._grip !== null && (this._grip.visible = false), this._hand !== null && (this._hand.visible = false), this;
    }
    update(e, t, n) {
      let i = null, r = null, o = null;
      const a = this._targetRay, c = this._grip, l = this._hand;
      if (e && t.session.visibilityState !== "visible-blurred") {
        if (l && e.hand) {
          o = true;
          for (const _ of e.hand.values()) {
            const m = t.getJointPose(_, n), p = this._getHandJoint(l, _);
            m !== null && (p.matrix.fromArray(m.transform.matrix), p.matrix.decompose(p.position, p.rotation, p.scale), p.matrixWorldNeedsUpdate = true, p.jointRadius = m.radius), p.visible = m !== null;
          }
          const h = l.joints["index-finger-tip"], u = l.joints["thumb-tip"], d = h.position.distanceTo(u.position), f = 0.02, g = 5e-3;
          l.inputState.pinching && d > f + g ? (l.inputState.pinching = false, this.dispatchEvent({
            type: "pinchend",
            handedness: e.handedness,
            target: this
          })) : !l.inputState.pinching && d <= f - g && (l.inputState.pinching = true, this.dispatchEvent({
            type: "pinchstart",
            handedness: e.handedness,
            target: this
          }));
        } else c !== null && e.gripSpace && (r = t.getPose(e.gripSpace, n), r !== null && (c.matrix.fromArray(r.transform.matrix), c.matrix.decompose(c.position, c.rotation, c.scale), c.matrixWorldNeedsUpdate = true, r.linearVelocity ? (c.hasLinearVelocity = true, c.linearVelocity.copy(r.linearVelocity)) : c.hasLinearVelocity = false, r.angularVelocity ? (c.hasAngularVelocity = true, c.angularVelocity.copy(r.angularVelocity)) : c.hasAngularVelocity = false));
        a !== null && (i = t.getPose(e.targetRaySpace, n), i === null && r !== null && (i = r), i !== null && (a.matrix.fromArray(i.transform.matrix), a.matrix.decompose(a.position, a.rotation, a.scale), a.matrixWorldNeedsUpdate = true, i.linearVelocity ? (a.hasLinearVelocity = true, a.linearVelocity.copy(i.linearVelocity)) : a.hasLinearVelocity = false, i.angularVelocity ? (a.hasAngularVelocity = true, a.angularVelocity.copy(i.angularVelocity)) : a.hasAngularVelocity = false, this.dispatchEvent(T_)));
      }
      return a !== null && (a.visible = i !== null), c !== null && (c.visible = r !== null), l !== null && (l.visible = o !== null), this;
    }
    _getHandJoint(e, t) {
      if (e.joints[t.jointName] === void 0) {
        const n = new hn();
        n.matrixAutoUpdate = false, n.visible = false, e.joints[t.jointName] = n, e.add(n);
      }
      return e.joints[t.jointName];
    }
  }
  const A_ = `
void main() {

	gl_Position = vec4( position, 1.0 );

}`, w_ = `
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;
  class R_ {
    constructor() {
      this.texture = null, this.mesh = null, this.depthNear = 0, this.depthFar = 0;
    }
    init(e, t, n) {
      if (this.texture === null) {
        const i = new mt(), r = e.properties.get(i);
        r.__webglTexture = t.texture, (t.depthNear != n.depthNear || t.depthFar != n.depthFar) && (this.depthNear = t.depthNear, this.depthFar = t.depthFar), this.texture = i;
      }
    }
    getMesh(e) {
      if (this.texture !== null && this.mesh === null) {
        const t = e.cameras[0].viewport, n = new Zn({
          vertexShader: A_,
          fragmentShader: w_,
          uniforms: {
            depthColor: {
              value: this.texture
            },
            depthWidth: {
              value: t.z
            },
            depthHeight: {
              value: t.w
            }
          }
        });
        this.mesh = new tt(new fi(20, 20), n);
      }
      return this.mesh;
    }
    reset() {
      this.texture = null, this.mesh = null;
    }
    getDepthTexture() {
      return this.texture;
    }
  }
  class C_ extends Jn {
    constructor(e, t) {
      super();
      const n = this;
      let i = null, r = 1, o = null, a = "local-floor", c = 1, l = null, h = null, u = null, d = null, f = null, g = null;
      const _ = new R_(), m = t.getContextAttributes();
      let p = null, E = null;
      const M = [], b = [], I = new ye();
      let A = null;
      const w = new Ct();
      w.layers.enable(1), w.viewport = new Ye();
      const U = new Ct();
      U.layers.enable(2), U.viewport = new Ye();
      const j = [
        w,
        U
      ], x = new b_();
      x.layers.enable(1), x.layers.enable(2);
      let S = null, k = null;
      this.cameraAutoUpdate = true, this.enabled = false, this.isPresenting = false, this.getController = function(W) {
        let Z = M[W];
        return Z === void 0 && (Z = new Bo(), M[W] = Z), Z.getTargetRaySpace();
      }, this.getControllerGrip = function(W) {
        let Z = M[W];
        return Z === void 0 && (Z = new Bo(), M[W] = Z), Z.getGripSpace();
      }, this.getHand = function(W) {
        let Z = M[W];
        return Z === void 0 && (Z = new Bo(), M[W] = Z), Z.getHandSpace();
      };
      function B(W) {
        const Z = b.indexOf(W.inputSource);
        if (Z === -1) return;
        const pe = M[Z];
        pe !== void 0 && (pe.update(W.inputSource, W.frame, l || o), pe.dispatchEvent({
          type: W.type,
          data: W.inputSource
        }));
      }
      function H() {
        i.removeEventListener("select", B), i.removeEventListener("selectstart", B), i.removeEventListener("selectend", B), i.removeEventListener("squeeze", B), i.removeEventListener("squeezestart", B), i.removeEventListener("squeezeend", B), i.removeEventListener("end", H), i.removeEventListener("inputsourceschange", K);
        for (let W = 0; W < M.length; W++) {
          const Z = b[W];
          Z !== null && (b[W] = null, M[W].disconnect(Z));
        }
        S = null, k = null, _.reset(), e.setRenderTarget(p), f = null, d = null, u = null, i = null, E = null, $e.stop(), n.isPresenting = false, e.setPixelRatio(A), e.setSize(I.width, I.height, false), n.dispatchEvent({
          type: "sessionend"
        });
      }
      this.setFramebufferScaleFactor = function(W) {
        r = W, n.isPresenting === true && console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.");
      }, this.setReferenceSpaceType = function(W) {
        a = W, n.isPresenting === true && console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.");
      }, this.getReferenceSpace = function() {
        return l || o;
      }, this.setReferenceSpace = function(W) {
        l = W;
      }, this.getBaseLayer = function() {
        return d !== null ? d : f;
      }, this.getBinding = function() {
        return u;
      }, this.getFrame = function() {
        return g;
      }, this.getSession = function() {
        return i;
      }, this.setSession = async function(W) {
        if (i = W, i !== null) {
          if (p = e.getRenderTarget(), i.addEventListener("select", B), i.addEventListener("selectstart", B), i.addEventListener("selectend", B), i.addEventListener("squeeze", B), i.addEventListener("squeezestart", B), i.addEventListener("squeezeend", B), i.addEventListener("end", H), i.addEventListener("inputsourceschange", K), m.xrCompatible !== true && await t.makeXRCompatible(), A = e.getPixelRatio(), e.getSize(I), i.renderState.layers === void 0) {
            const Z = {
              antialias: m.antialias,
              alpha: true,
              depth: m.depth,
              stencil: m.stencil,
              framebufferScaleFactor: r
            };
            f = new XRWebGLLayer(i, t, Z), i.updateRenderState({
              baseLayer: f
            }), e.setPixelRatio(1), e.setSize(f.framebufferWidth, f.framebufferHeight, false), E = new mi(f.framebufferWidth, f.framebufferHeight, {
              format: $t,
              type: In,
              colorSpace: e.outputColorSpace,
              stencilBuffer: m.stencil
            });
          } else {
            let Z = null, pe = null, le = null;
            m.depth && (le = m.stencil ? t.DEPTH24_STENCIL8 : t.DEPTH_COMPONENT24, Z = m.stencil ? ts : qi, pe = m.stencil ? es : pi);
            const Pe = {
              colorFormat: t.RGBA8,
              depthFormat: le,
              scaleFactor: r
            };
            u = new XRWebGLBinding(i, t), d = u.createProjectionLayer(Pe), i.updateRenderState({
              layers: [
                d
              ]
            }), e.setPixelRatio(1), e.setSize(d.textureWidth, d.textureHeight, false), E = new mi(d.textureWidth, d.textureHeight, {
              format: $t,
              type: In,
              depthTexture: new Dh(d.textureWidth, d.textureHeight, pe, void 0, void 0, void 0, void 0, void 0, void 0, Z),
              stencilBuffer: m.stencil,
              colorSpace: e.outputColorSpace,
              samples: m.antialias ? 4 : 0,
              resolveDepthBuffer: d.ignoreDepthValues === false
            });
          }
          E.isXRRenderTarget = true, this.setFoveation(c), l = null, o = await i.requestReferenceSpace(a), $e.setContext(i), $e.start(), n.isPresenting = true, n.dispatchEvent({
            type: "sessionstart"
          });
        }
      }, this.getEnvironmentBlendMode = function() {
        if (i !== null) return i.environmentBlendMode;
      }, this.getDepthTexture = function() {
        return _.getDepthTexture();
      };
      function K(W) {
        for (let Z = 0; Z < W.removed.length; Z++) {
          const pe = W.removed[Z], le = b.indexOf(pe);
          le >= 0 && (b[le] = null, M[le].disconnect(pe));
        }
        for (let Z = 0; Z < W.added.length; Z++) {
          const pe = W.added[Z];
          let le = b.indexOf(pe);
          if (le === -1) {
            for (let Ee = 0; Ee < M.length; Ee++) if (Ee >= b.length) {
              b.push(pe), le = Ee;
              break;
            } else if (b[Ee] === null) {
              b[Ee] = pe, le = Ee;
              break;
            }
            if (le === -1) break;
          }
          const Pe = M[le];
          Pe && Pe.connect(pe);
        }
      }
      const z = new R(), Q = new R();
      function G(W, Z, pe) {
        z.setFromMatrixPosition(Z.matrixWorld), Q.setFromMatrixPosition(pe.matrixWorld);
        const le = z.distanceTo(Q), Pe = Z.projectionMatrix.elements, Ee = pe.projectionMatrix.elements, Be = Pe[14] / (Pe[10] - 1), Qe = Pe[14] / (Pe[10] + 1), ke = (Pe[9] + 1) / Pe[5], C = (Pe[9] - 1) / Pe[5], Nt = (Pe[8] - 1) / Pe[0], Fe = (Ee[8] + 1) / Ee[0], He = Be * Nt, Te = Be * Fe, it = le / (-Nt + Fe), Re = it * -Nt;
        if (Z.matrixWorld.decompose(W.position, W.quaternion, W.scale), W.translateX(Re), W.translateZ(it), W.matrixWorld.compose(W.position, W.quaternion, W.scale), W.matrixWorldInverse.copy(W.matrixWorld).invert(), Pe[10] === -1) W.projectionMatrix.copy(Z.projectionMatrix), W.projectionMatrixInverse.copy(Z.projectionMatrixInverse);
        else {
          const T = Be + it, v = Qe + it, N = He - Re, Y = Te + (le - Re), $ = ke * Qe / v * T, X = C * Qe / v * T;
          W.projectionMatrix.makePerspective(N, Y, $, X, T, v), W.projectionMatrixInverse.copy(W.projectionMatrix).invert();
        }
      }
      function ae(W, Z) {
        Z === null ? W.matrixWorld.copy(W.matrix) : W.matrixWorld.multiplyMatrices(Z.matrixWorld, W.matrix), W.matrixWorldInverse.copy(W.matrixWorld).invert();
      }
      this.updateCamera = function(W) {
        if (i === null) return;
        let Z = W.near, pe = W.far;
        _.texture !== null && (_.depthNear > 0 && (Z = _.depthNear), _.depthFar > 0 && (pe = _.depthFar)), x.near = U.near = w.near = Z, x.far = U.far = w.far = pe, (S !== x.near || k !== x.far) && (i.updateRenderState({
          depthNear: x.near,
          depthFar: x.far
        }), S = x.near, k = x.far);
        const le = W.parent, Pe = x.cameras;
        ae(x, le);
        for (let Ee = 0; Ee < Pe.length; Ee++) ae(Pe[Ee], le);
        Pe.length === 2 ? G(x, w, U) : x.projectionMatrix.copy(w.projectionMatrix), ce(W, x, le);
      };
      function ce(W, Z, pe) {
        pe === null ? W.matrix.copy(Z.matrixWorld) : (W.matrix.copy(pe.matrixWorld), W.matrix.invert(), W.matrix.multiply(Z.matrixWorld)), W.matrix.decompose(W.position, W.quaternion, W.scale), W.updateMatrixWorld(true), W.projectionMatrix.copy(Z.projectionMatrix), W.projectionMatrixInverse.copy(Z.projectionMatrixInverse), W.isPerspectiveCamera && (W.fov = ns * 2 * Math.atan(1 / W.projectionMatrix.elements[5]), W.zoom = 1);
      }
      this.getCamera = function() {
        return x;
      }, this.getFoveation = function() {
        if (!(d === null && f === null)) return c;
      }, this.setFoveation = function(W) {
        c = W, d !== null && (d.fixedFoveation = W), f !== null && f.fixedFoveation !== void 0 && (f.fixedFoveation = W);
      }, this.hasDepthSensing = function() {
        return _.texture !== null;
      }, this.getDepthSensingMesh = function() {
        return _.getMesh(x);
      };
      let ge = null;
      function We(W, Z) {
        if (h = Z.getViewerPose(l || o), g = Z, h !== null) {
          const pe = h.views;
          f !== null && (e.setRenderTargetFramebuffer(E, f.framebuffer), e.setRenderTarget(E));
          let le = false;
          pe.length !== x.cameras.length && (x.cameras.length = 0, le = true);
          for (let Ee = 0; Ee < pe.length; Ee++) {
            const Be = pe[Ee];
            let Qe = null;
            if (f !== null) Qe = f.getViewport(Be);
            else {
              const C = u.getViewSubImage(d, Be);
              Qe = C.viewport, Ee === 0 && (e.setRenderTargetTextures(E, C.colorTexture, d.ignoreDepthValues ? void 0 : C.depthStencilTexture), e.setRenderTarget(E));
            }
            let ke = j[Ee];
            ke === void 0 && (ke = new Ct(), ke.layers.enable(Ee), ke.viewport = new Ye(), j[Ee] = ke), ke.matrix.fromArray(Be.transform.matrix), ke.matrix.decompose(ke.position, ke.quaternion, ke.scale), ke.projectionMatrix.fromArray(Be.projectionMatrix), ke.projectionMatrixInverse.copy(ke.projectionMatrix).invert(), ke.viewport.set(Qe.x, Qe.y, Qe.width, Qe.height), Ee === 0 && (x.matrix.copy(ke.matrix), x.matrix.decompose(x.position, x.quaternion, x.scale)), le === true && x.cameras.push(ke);
          }
          const Pe = i.enabledFeatures;
          if (Pe && Pe.includes("depth-sensing")) {
            const Ee = u.getDepthInformation(pe[0]);
            Ee && Ee.isValid && Ee.texture && _.init(e, Ee, i.renderState);
          }
        }
        for (let pe = 0; pe < M.length; pe++) {
          const le = b[pe], Pe = M[pe];
          le !== null && Pe !== void 0 && Pe.update(le, Z, l || o);
        }
        ge && ge(W, Z), Z.detectedPlanes && n.dispatchEvent({
          type: "planesdetected",
          data: Z
        }), g = null;
      }
      const $e = new Lh();
      $e.setAnimationLoop(We), this.setAnimationLoop = function(W) {
        ge = W;
      }, this.dispose = function() {
      };
    }
  }
  const ri = new un(), P_ = new Ce();
  function I_(s, e) {
    function t(m, p) {
      m.matrixAutoUpdate === true && m.updateMatrix(), p.value.copy(m.matrix);
    }
    function n(m, p) {
      p.color.getRGB(m.fogColor.value, Ch(s)), p.isFog ? (m.fogNear.value = p.near, m.fogFar.value = p.far) : p.isFogExp2 && (m.fogDensity.value = p.density);
    }
    function i(m, p, E, M, b) {
      p.isMeshBasicMaterial || p.isMeshLambertMaterial ? r(m, p) : p.isMeshToonMaterial ? (r(m, p), u(m, p)) : p.isMeshPhongMaterial ? (r(m, p), h(m, p)) : p.isMeshStandardMaterial ? (r(m, p), d(m, p), p.isMeshPhysicalMaterial && f(m, p, b)) : p.isMeshMatcapMaterial ? (r(m, p), g(m, p)) : p.isMeshDepthMaterial ? r(m, p) : p.isMeshDistanceMaterial ? (r(m, p), _(m, p)) : p.isMeshNormalMaterial ? r(m, p) : p.isLineBasicMaterial ? (o(m, p), p.isLineDashedMaterial && a(m, p)) : p.isPointsMaterial ? c(m, p, E, M) : p.isSpriteMaterial ? l(m, p) : p.isShadowMaterial ? (m.color.value.copy(p.color), m.opacity.value = p.opacity) : p.isShaderMaterial && (p.uniformsNeedUpdate = false);
    }
    function r(m, p) {
      m.opacity.value = p.opacity, p.color && m.diffuse.value.copy(p.color), p.emissive && m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity), p.map && (m.map.value = p.map, t(p.map, m.mapTransform)), p.alphaMap && (m.alphaMap.value = p.alphaMap, t(p.alphaMap, m.alphaMapTransform)), p.bumpMap && (m.bumpMap.value = p.bumpMap, t(p.bumpMap, m.bumpMapTransform), m.bumpScale.value = p.bumpScale, p.side === Ut && (m.bumpScale.value *= -1)), p.normalMap && (m.normalMap.value = p.normalMap, t(p.normalMap, m.normalMapTransform), m.normalScale.value.copy(p.normalScale), p.side === Ut && m.normalScale.value.negate()), p.displacementMap && (m.displacementMap.value = p.displacementMap, t(p.displacementMap, m.displacementMapTransform), m.displacementScale.value = p.displacementScale, m.displacementBias.value = p.displacementBias), p.emissiveMap && (m.emissiveMap.value = p.emissiveMap, t(p.emissiveMap, m.emissiveMapTransform)), p.specularMap && (m.specularMap.value = p.specularMap, t(p.specularMap, m.specularMapTransform)), p.alphaTest > 0 && (m.alphaTest.value = p.alphaTest);
      const E = e.get(p), M = E.envMap, b = E.envMapRotation;
      M && (m.envMap.value = M, ri.copy(b), ri.x *= -1, ri.y *= -1, ri.z *= -1, M.isCubeTexture && M.isRenderTargetTexture === false && (ri.y *= -1, ri.z *= -1), m.envMapRotation.value.setFromMatrix4(P_.makeRotationFromEuler(ri)), m.flipEnvMap.value = M.isCubeTexture && M.isRenderTargetTexture === false ? -1 : 1, m.reflectivity.value = p.reflectivity, m.ior.value = p.ior, m.refractionRatio.value = p.refractionRatio), p.lightMap && (m.lightMap.value = p.lightMap, m.lightMapIntensity.value = p.lightMapIntensity, t(p.lightMap, m.lightMapTransform)), p.aoMap && (m.aoMap.value = p.aoMap, m.aoMapIntensity.value = p.aoMapIntensity, t(p.aoMap, m.aoMapTransform));
    }
    function o(m, p) {
      m.diffuse.value.copy(p.color), m.opacity.value = p.opacity, p.map && (m.map.value = p.map, t(p.map, m.mapTransform));
    }
    function a(m, p) {
      m.dashSize.value = p.dashSize, m.totalSize.value = p.dashSize + p.gapSize, m.scale.value = p.scale;
    }
    function c(m, p, E, M) {
      m.diffuse.value.copy(p.color), m.opacity.value = p.opacity, m.size.value = p.size * E, m.scale.value = M * 0.5, p.map && (m.map.value = p.map, t(p.map, m.uvTransform)), p.alphaMap && (m.alphaMap.value = p.alphaMap, t(p.alphaMap, m.alphaMapTransform)), p.alphaTest > 0 && (m.alphaTest.value = p.alphaTest);
    }
    function l(m, p) {
      m.diffuse.value.copy(p.color), m.opacity.value = p.opacity, m.rotation.value = p.rotation, p.map && (m.map.value = p.map, t(p.map, m.mapTransform)), p.alphaMap && (m.alphaMap.value = p.alphaMap, t(p.alphaMap, m.alphaMapTransform)), p.alphaTest > 0 && (m.alphaTest.value = p.alphaTest);
    }
    function h(m, p) {
      m.specular.value.copy(p.specular), m.shininess.value = Math.max(p.shininess, 1e-4);
    }
    function u(m, p) {
      p.gradientMap && (m.gradientMap.value = p.gradientMap);
    }
    function d(m, p) {
      m.metalness.value = p.metalness, p.metalnessMap && (m.metalnessMap.value = p.metalnessMap, t(p.metalnessMap, m.metalnessMapTransform)), m.roughness.value = p.roughness, p.roughnessMap && (m.roughnessMap.value = p.roughnessMap, t(p.roughnessMap, m.roughnessMapTransform)), p.envMap && (m.envMapIntensity.value = p.envMapIntensity);
    }
    function f(m, p, E) {
      m.ior.value = p.ior, p.sheen > 0 && (m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen), m.sheenRoughness.value = p.sheenRoughness, p.sheenColorMap && (m.sheenColorMap.value = p.sheenColorMap, t(p.sheenColorMap, m.sheenColorMapTransform)), p.sheenRoughnessMap && (m.sheenRoughnessMap.value = p.sheenRoughnessMap, t(p.sheenRoughnessMap, m.sheenRoughnessMapTransform))), p.clearcoat > 0 && (m.clearcoat.value = p.clearcoat, m.clearcoatRoughness.value = p.clearcoatRoughness, p.clearcoatMap && (m.clearcoatMap.value = p.clearcoatMap, t(p.clearcoatMap, m.clearcoatMapTransform)), p.clearcoatRoughnessMap && (m.clearcoatRoughnessMap.value = p.clearcoatRoughnessMap, t(p.clearcoatRoughnessMap, m.clearcoatRoughnessMapTransform)), p.clearcoatNormalMap && (m.clearcoatNormalMap.value = p.clearcoatNormalMap, t(p.clearcoatNormalMap, m.clearcoatNormalMapTransform), m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale), p.side === Ut && m.clearcoatNormalScale.value.negate())), p.dispersion > 0 && (m.dispersion.value = p.dispersion), p.iridescence > 0 && (m.iridescence.value = p.iridescence, m.iridescenceIOR.value = p.iridescenceIOR, m.iridescenceThicknessMinimum.value = p.iridescenceThicknessRange[0], m.iridescenceThicknessMaximum.value = p.iridescenceThicknessRange[1], p.iridescenceMap && (m.iridescenceMap.value = p.iridescenceMap, t(p.iridescenceMap, m.iridescenceMapTransform)), p.iridescenceThicknessMap && (m.iridescenceThicknessMap.value = p.iridescenceThicknessMap, t(p.iridescenceThicknessMap, m.iridescenceThicknessMapTransform))), p.transmission > 0 && (m.transmission.value = p.transmission, m.transmissionSamplerMap.value = E.texture, m.transmissionSamplerSize.value.set(E.width, E.height), p.transmissionMap && (m.transmissionMap.value = p.transmissionMap, t(p.transmissionMap, m.transmissionMapTransform)), m.thickness.value = p.thickness, p.thicknessMap && (m.thicknessMap.value = p.thicknessMap, t(p.thicknessMap, m.thicknessMapTransform)), m.attenuationDistance.value = p.attenuationDistance, m.attenuationColor.value.copy(p.attenuationColor)), p.anisotropy > 0 && (m.anisotropyVector.value.set(p.anisotropy * Math.cos(p.anisotropyRotation), p.anisotropy * Math.sin(p.anisotropyRotation)), p.anisotropyMap && (m.anisotropyMap.value = p.anisotropyMap, t(p.anisotropyMap, m.anisotropyMapTransform))), m.specularIntensity.value = p.specularIntensity, m.specularColor.value.copy(p.specularColor), p.specularColorMap && (m.specularColorMap.value = p.specularColorMap, t(p.specularColorMap, m.specularColorMapTransform)), p.specularIntensityMap && (m.specularIntensityMap.value = p.specularIntensityMap, t(p.specularIntensityMap, m.specularIntensityMapTransform));
    }
    function g(m, p) {
      p.matcap && (m.matcap.value = p.matcap);
    }
    function _(m, p) {
      const E = e.get(p).light;
      m.referencePosition.value.setFromMatrixPosition(E.matrixWorld), m.nearDistance.value = E.shadow.camera.near, m.farDistance.value = E.shadow.camera.far;
    }
    return {
      refreshFogUniforms: n,
      refreshMaterialUniforms: i
    };
  }
  function L_(s, e, t, n) {
    let i = {}, r = {}, o = [];
    const a = s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);
    function c(E, M) {
      const b = M.program;
      n.uniformBlockBinding(E, b);
    }
    function l(E, M) {
      let b = i[E.id];
      b === void 0 && (g(E), b = h(E), i[E.id] = b, E.addEventListener("dispose", m));
      const I = M.program;
      n.updateUBOMapping(E, I);
      const A = e.render.frame;
      r[E.id] !== A && (d(E), r[E.id] = A);
    }
    function h(E) {
      const M = u();
      E.__bindingPointIndex = M;
      const b = s.createBuffer(), I = E.__size, A = E.usage;
      return s.bindBuffer(s.UNIFORM_BUFFER, b), s.bufferData(s.UNIFORM_BUFFER, I, A), s.bindBuffer(s.UNIFORM_BUFFER, null), s.bindBufferBase(s.UNIFORM_BUFFER, M, b), b;
    }
    function u() {
      for (let E = 0; E < a; E++) if (o.indexOf(E) === -1) return o.push(E), E;
      return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."), 0;
    }
    function d(E) {
      const M = i[E.id], b = E.uniforms, I = E.__cache;
      s.bindBuffer(s.UNIFORM_BUFFER, M);
      for (let A = 0, w = b.length; A < w; A++) {
        const U = Array.isArray(b[A]) ? b[A] : [
          b[A]
        ];
        for (let j = 0, x = U.length; j < x; j++) {
          const S = U[j];
          if (f(S, A, j, I) === true) {
            const k = S.__offset, B = Array.isArray(S.value) ? S.value : [
              S.value
            ];
            let H = 0;
            for (let K = 0; K < B.length; K++) {
              const z = B[K], Q = _(z);
              typeof z == "number" || typeof z == "boolean" ? (S.__data[0] = z, s.bufferSubData(s.UNIFORM_BUFFER, k + H, S.__data)) : z.isMatrix3 ? (S.__data[0] = z.elements[0], S.__data[1] = z.elements[1], S.__data[2] = z.elements[2], S.__data[3] = 0, S.__data[4] = z.elements[3], S.__data[5] = z.elements[4], S.__data[6] = z.elements[5], S.__data[7] = 0, S.__data[8] = z.elements[6], S.__data[9] = z.elements[7], S.__data[10] = z.elements[8], S.__data[11] = 0) : (z.toArray(S.__data, H), H += Q.storage / Float32Array.BYTES_PER_ELEMENT);
            }
            s.bufferSubData(s.UNIFORM_BUFFER, k, S.__data);
          }
        }
      }
      s.bindBuffer(s.UNIFORM_BUFFER, null);
    }
    function f(E, M, b, I) {
      const A = E.value, w = M + "_" + b;
      if (I[w] === void 0) return typeof A == "number" || typeof A == "boolean" ? I[w] = A : I[w] = A.clone(), true;
      {
        const U = I[w];
        if (typeof A == "number" || typeof A == "boolean") {
          if (U !== A) return I[w] = A, true;
        } else if (U.equals(A) === false) return U.copy(A), true;
      }
      return false;
    }
    function g(E) {
      const M = E.uniforms;
      let b = 0;
      const I = 16;
      for (let w = 0, U = M.length; w < U; w++) {
        const j = Array.isArray(M[w]) ? M[w] : [
          M[w]
        ];
        for (let x = 0, S = j.length; x < S; x++) {
          const k = j[x], B = Array.isArray(k.value) ? k.value : [
            k.value
          ];
          for (let H = 0, K = B.length; H < K; H++) {
            const z = B[H], Q = _(z), G = b % I, ae = G % Q.boundary, ce = G + ae;
            b += ae, ce !== 0 && I - ce < Q.storage && (b += I - ce), k.__data = new Float32Array(Q.storage / Float32Array.BYTES_PER_ELEMENT), k.__offset = b, b += Q.storage;
          }
        }
      }
      const A = b % I;
      return A > 0 && (b += I - A), E.__size = b, E.__cache = {}, this;
    }
    function _(E) {
      const M = {
        boundary: 0,
        storage: 0
      };
      return typeof E == "number" || typeof E == "boolean" ? (M.boundary = 4, M.storage = 4) : E.isVector2 ? (M.boundary = 8, M.storage = 8) : E.isVector3 || E.isColor ? (M.boundary = 16, M.storage = 12) : E.isVector4 ? (M.boundary = 16, M.storage = 16) : E.isMatrix3 ? (M.boundary = 48, M.storage = 48) : E.isMatrix4 ? (M.boundary = 64, M.storage = 64) : E.isTexture ? console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group.") : console.warn("THREE.WebGLRenderer: Unsupported uniform value type.", E), M;
    }
    function m(E) {
      const M = E.target;
      M.removeEventListener("dispose", m);
      const b = o.indexOf(M.__bindingPointIndex);
      o.splice(b, 1), s.deleteBuffer(i[M.id]), delete i[M.id], delete r[M.id];
    }
    function p() {
      for (const E in i) s.deleteBuffer(i[E]);
      o = [], i = {}, r = {};
    }
    return {
      bind: c,
      update: l,
      dispose: p
    };
  }
  class D_ {
    constructor(e = {}) {
      const { canvas: t = vd(), context: n = null, depth: i = true, stencil: r = false, alpha: o = false, antialias: a = false, premultipliedAlpha: c = true, preserveDrawingBuffer: l = false, powerPreference: h = "default", failIfMajorPerformanceCaveat: u = false } = e;
      this.isWebGLRenderer = true;
      let d;
      if (n !== null) {
        if (typeof WebGLRenderingContext < "u" && n instanceof WebGLRenderingContext) throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");
        d = n.getContextAttributes().alpha;
      } else d = o;
      const f = new Uint32Array(4), g = new Int32Array(4);
      let _ = null, m = null;
      const p = [], E = [];
      this.domElement = t, this.debug = {
        checkShaderErrors: true,
        onShaderError: null
      }, this.autoClear = true, this.autoClearColor = true, this.autoClearDepth = true, this.autoClearStencil = true, this.sortObjects = true, this.clippingPlanes = [], this.localClippingEnabled = false, this._outputColorSpace = Rt, this.toneMapping = Kn, this.toneMappingExposure = 1;
      const M = this;
      let b = false, I = 0, A = 0, w = null, U = -1, j = null;
      const x = new Ye(), S = new Ye();
      let k = null;
      const B = new Se(0);
      let H = 0, K = t.width, z = t.height, Q = 1, G = null, ae = null;
      const ce = new Ye(0, 0, K, z), ge = new Ye(0, 0, K, z);
      let We = false;
      const $e = new ic();
      let W = false, Z = false;
      const pe = new Ce(), le = new Ce(), Pe = new R(), Ee = new Ye(), Be = {
        background: null,
        fog: null,
        environment: null,
        overrideMaterial: null,
        isScene: true
      };
      let Qe = false;
      function ke() {
        return w === null ? Q : 1;
      }
      let C = n;
      function Nt(y, L) {
        return t.getContext(y, L);
      }
      try {
        const y = {
          alpha: true,
          depth: i,
          stencil: r,
          antialias: a,
          premultipliedAlpha: c,
          preserveDrawingBuffer: l,
          powerPreference: h,
          failIfMajorPerformanceCaveat: u
        };
        if ("setAttribute" in t && t.setAttribute("data-engine", `three.js r${Ya}`), t.addEventListener("webglcontextlost", q, false), t.addEventListener("webglcontextrestored", ie, false), t.addEventListener("webglcontextcreationerror", oe, false), C === null) {
          const L = "webgl2";
          if (C = Nt(L, y), C === null) throw Nt(L) ? new Error("Error creating WebGL context with your selected attributes.") : new Error("Error creating WebGL context.");
        }
      } catch (y) {
        throw console.error("THREE.WebGLRenderer: " + y.message), y;
      }
      let Fe, He, Te, it, Re, T, v, N, Y, $, X, _e, ne, he, Ve, J, ue, Ae, we, de, Oe, Ie, nt, P;
      function re() {
        Fe = new Bm(C), Fe.init(), Ie = new E_(C, Fe), He = new Lm(C, Fe, e, Ie), Te = new y_(C), He.reverseDepthBuffer && Te.buffers.depth.setReversed(true), it = new Hm(C), Re = new r_(), T = new S_(C, Fe, Te, Re, He, Ie, it), v = new Um(M), N = new Om(M), Y = new qd(C), nt = new Pm(C, Y), $ = new km(C, Y, it, nt), X = new Gm(C, $, Y, it), we = new Vm(C, He, T), J = new Dm(Re), _e = new s_(M, v, N, Fe, He, nt, J), ne = new I_(M, Re), he = new a_(), Ve = new f_(Fe), Ae = new Cm(M, v, N, Te, X, d, c), ue = new x_(M, X, He), P = new L_(C, it, He, Te), de = new Im(C, Fe, it), Oe = new zm(C, Fe, it), it.programs = _e.programs, M.capabilities = He, M.extensions = Fe, M.properties = Re, M.renderLists = he, M.shadowMap = ue, M.state = Te, M.info = it;
      }
      re();
      const V = new C_(M, C);
      this.xr = V, this.getContext = function() {
        return C;
      }, this.getContextAttributes = function() {
        return C.getContextAttributes();
      }, this.forceContextLoss = function() {
        const y = Fe.get("WEBGL_lose_context");
        y && y.loseContext();
      }, this.forceContextRestore = function() {
        const y = Fe.get("WEBGL_lose_context");
        y && y.restoreContext();
      }, this.getPixelRatio = function() {
        return Q;
      }, this.setPixelRatio = function(y) {
        y !== void 0 && (Q = y, this.setSize(K, z, false));
      }, this.getSize = function(y) {
        return y.set(K, z);
      }, this.setSize = function(y, L, F = true) {
        if (V.isPresenting) {
          console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");
          return;
        }
        K = y, z = L, t.width = Math.floor(y * Q), t.height = Math.floor(L * Q), F === true && (t.style.width = y + "px", t.style.height = L + "px"), this.setViewport(0, 0, y, L);
      }, this.getDrawingBufferSize = function(y) {
        return y.set(K * Q, z * Q).floor();
      }, this.setDrawingBufferSize = function(y, L, F) {
        K = y, z = L, Q = F, t.width = Math.floor(y * F), t.height = Math.floor(L * F), this.setViewport(0, 0, y, L);
      }, this.getCurrentViewport = function(y) {
        return y.copy(x);
      }, this.getViewport = function(y) {
        return y.copy(ce);
      }, this.setViewport = function(y, L, F, O) {
        y.isVector4 ? ce.set(y.x, y.y, y.z, y.w) : ce.set(y, L, F, O), Te.viewport(x.copy(ce).multiplyScalar(Q).round());
      }, this.getScissor = function(y) {
        return y.copy(ge);
      }, this.setScissor = function(y, L, F, O) {
        y.isVector4 ? ge.set(y.x, y.y, y.z, y.w) : ge.set(y, L, F, O), Te.scissor(S.copy(ge).multiplyScalar(Q).round());
      }, this.getScissorTest = function() {
        return We;
      }, this.setScissorTest = function(y) {
        Te.setScissorTest(We = y);
      }, this.setOpaqueSort = function(y) {
        G = y;
      }, this.setTransparentSort = function(y) {
        ae = y;
      }, this.getClearColor = function(y) {
        return y.copy(Ae.getClearColor());
      }, this.setClearColor = function() {
        Ae.setClearColor.apply(Ae, arguments);
      }, this.getClearAlpha = function() {
        return Ae.getClearAlpha();
      }, this.setClearAlpha = function() {
        Ae.setClearAlpha.apply(Ae, arguments);
      }, this.clear = function(y = true, L = true, F = true) {
        let O = 0;
        if (y) {
          let D = false;
          if (w !== null) {
            const ee = w.texture.format;
            D = ee === Qa || ee === Ja || ee === Za;
          }
          if (D) {
            const ee = w.texture.type, se = ee === In || ee === pi || ee === Ds || ee === es || ee === ja || ee === Ka, fe = Ae.getClearColor(), me = Ae.getClearAlpha(), Me = fe.r, be = fe.g, xe = fe.b;
            se ? (f[0] = Me, f[1] = be, f[2] = xe, f[3] = me, C.clearBufferuiv(C.COLOR, 0, f)) : (g[0] = Me, g[1] = be, g[2] = xe, g[3] = me, C.clearBufferiv(C.COLOR, 0, g));
          } else O |= C.COLOR_BUFFER_BIT;
        }
        L && (O |= C.DEPTH_BUFFER_BIT, C.clearDepth(this.capabilities.reverseDepthBuffer ? 0 : 1)), F && (O |= C.STENCIL_BUFFER_BIT, this.state.buffers.stencil.setMask(4294967295)), C.clear(O);
      }, this.clearColor = function() {
        this.clear(true, false, false);
      }, this.clearDepth = function() {
        this.clear(false, true, false);
      }, this.clearStencil = function() {
        this.clear(false, false, true);
      }, this.dispose = function() {
        t.removeEventListener("webglcontextlost", q, false), t.removeEventListener("webglcontextrestored", ie, false), t.removeEventListener("webglcontextcreationerror", oe, false), he.dispose(), Ve.dispose(), Re.dispose(), v.dispose(), N.dispose(), X.dispose(), nt.dispose(), P.dispose(), _e.dispose(), V.dispose(), V.removeEventListener("sessionstart", vc), V.removeEventListener("sessionend", yc), Qn.stop();
      };
      function q(y) {
        y.preventDefault(), console.log("THREE.WebGLRenderer: Context Lost."), b = true;
      }
      function ie() {
        console.log("THREE.WebGLRenderer: Context Restored."), b = false;
        const y = it.autoReset, L = ue.enabled, F = ue.autoUpdate, O = ue.needsUpdate, D = ue.type;
        re(), it.autoReset = y, ue.enabled = L, ue.autoUpdate = F, ue.needsUpdate = O, ue.type = D;
      }
      function oe(y) {
        console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ", y.statusMessage);
      }
      function ze(y) {
        const L = y.target;
        L.removeEventListener("dispose", ze), dt(L);
      }
      function dt(y) {
        It(y), Re.remove(y);
      }
      function It(y) {
        const L = Re.get(y).programs;
        L !== void 0 && (L.forEach(function(F) {
          _e.releaseProgram(F);
        }), y.isShaderMaterial && _e.releaseShaderCache(y));
      }
      this.renderBufferDirect = function(y, L, F, O, D, ee) {
        L === null && (L = Be);
        const se = D.isMesh && D.matrixWorld.determinant() < 0, fe = cu(y, L, F, O, D);
        Te.setMaterial(O, se);
        let me = F.index, Me = 1;
        if (O.wireframe === true) {
          if (me = $.getWireframeAttribute(F), me === void 0) return;
          Me = 2;
        }
        const be = F.drawRange, xe = F.attributes.position;
        let Ze = be.start * Me, st = (be.start + be.count) * Me;
        ee !== null && (Ze = Math.max(Ze, ee.start * Me), st = Math.min(st, (ee.start + ee.count) * Me)), me !== null ? (Ze = Math.max(Ze, 0), st = Math.min(st, me.count)) : xe != null && (Ze = Math.max(Ze, 0), st = Math.min(st, xe.count));
        const ct = st - Ze;
        if (ct < 0 || ct === 1 / 0) return;
        nt.setup(D, O, fe, F, me);
        let Ft, qe = de;
        if (me !== null && (Ft = Y.get(me), qe = Oe, qe.setIndex(Ft)), D.isMesh) O.wireframe === true ? (Te.setLineWidth(O.wireframeLinewidth * ke()), qe.setMode(C.LINES)) : qe.setMode(C.TRIANGLES);
        else if (D.isLine) {
          let ve = O.linewidth;
          ve === void 0 && (ve = 1), Te.setLineWidth(ve * ke()), D.isLineSegments ? qe.setMode(C.LINES) : D.isLineLoop ? qe.setMode(C.LINE_LOOP) : qe.setMode(C.LINE_STRIP);
        } else D.isPoints ? qe.setMode(C.POINTS) : D.isSprite && qe.setMode(C.TRIANGLES);
        if (D.isBatchedMesh) if (D._multiDrawInstances !== null) qe.renderMultiDrawInstances(D._multiDrawStarts, D._multiDrawCounts, D._multiDrawCount, D._multiDrawInstances);
        else if (Fe.get("WEBGL_multi_draw")) qe.renderMultiDraw(D._multiDrawStarts, D._multiDrawCounts, D._multiDrawCount);
        else {
          const ve = D._multiDrawStarts, Mt = D._multiDrawCounts, je = D._multiDrawCount, Jt = me ? Y.get(me).bytesPerElement : 1, _i = Re.get(O).currentProgram.getUniforms();
          for (let Ot = 0; Ot < je; Ot++) _i.setValue(C, "_gl_DrawID", Ot), qe.render(ve[Ot] / Jt, Mt[Ot]);
        }
        else if (D.isInstancedMesh) qe.renderInstances(Ze, ct, D.count);
        else if (F.isInstancedBufferGeometry) {
          const ve = F._maxInstanceCount !== void 0 ? F._maxInstanceCount : 1 / 0, Mt = Math.min(F.instanceCount, ve);
          qe.renderInstances(Ze, ct, Mt);
        } else qe.render(Ze, ct);
      };
      function Xe(y, L, F) {
        y.transparent === true && y.side === Yt && y.forceSinglePass === false ? (y.side = Ut, y.needsUpdate = true, Ys(y, L, F), y.side = Pn, y.needsUpdate = true, Ys(y, L, F), y.side = Yt) : Ys(y, L, F);
      }
      this.compile = function(y, L, F = null) {
        F === null && (F = y), m = Ve.get(F), m.init(L), E.push(m), F.traverseVisible(function(D) {
          D.isLight && D.layers.test(L.layers) && (m.pushLight(D), D.castShadow && m.pushShadow(D));
        }), y !== F && y.traverseVisible(function(D) {
          D.isLight && D.layers.test(L.layers) && (m.pushLight(D), D.castShadow && m.pushShadow(D));
        }), m.setupLights();
        const O = /* @__PURE__ */ new Set();
        return y.traverse(function(D) {
          if (!(D.isMesh || D.isPoints || D.isLine || D.isSprite)) return;
          const ee = D.material;
          if (ee) if (Array.isArray(ee)) for (let se = 0; se < ee.length; se++) {
            const fe = ee[se];
            Xe(fe, F, D), O.add(fe);
          }
          else Xe(ee, F, D), O.add(ee);
        }), E.pop(), m = null, O;
      }, this.compileAsync = function(y, L, F = null) {
        const O = this.compile(y, L, F);
        return new Promise((D) => {
          function ee() {
            if (O.forEach(function(se) {
              Re.get(se).currentProgram.isReady() && O.delete(se);
            }), O.size === 0) {
              D(y);
              return;
            }
            setTimeout(ee, 10);
          }
          Fe.get("KHR_parallel_shader_compile") !== null ? ee() : setTimeout(ee, 10);
        });
      };
      let Lt = null;
      function gn(y) {
        Lt && Lt(y);
      }
      function vc() {
        Qn.stop();
      }
      function yc() {
        Qn.start();
      }
      const Qn = new Lh();
      Qn.setAnimationLoop(gn), typeof self < "u" && Qn.setContext(self), this.setAnimationLoop = function(y) {
        Lt = y, V.setAnimationLoop(y), y === null ? Qn.stop() : Qn.start();
      }, V.addEventListener("sessionstart", vc), V.addEventListener("sessionend", yc), this.render = function(y, L) {
        if (L !== void 0 && L.isCamera !== true) {
          console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");
          return;
        }
        if (b === true) return;
        if (y.matrixWorldAutoUpdate === true && y.updateMatrixWorld(), L.parent === null && L.matrixWorldAutoUpdate === true && L.updateMatrixWorld(), V.enabled === true && V.isPresenting === true && (V.cameraAutoUpdate === true && V.updateCamera(L), L = V.getCamera()), y.isScene === true && y.onBeforeRender(M, y, L, w), m = Ve.get(y, E.length), m.init(L), E.push(m), le.multiplyMatrices(L.projectionMatrix, L.matrixWorldInverse), $e.setFromProjectionMatrix(le), Z = this.localClippingEnabled, W = J.init(this.clippingPlanes, Z), _ = he.get(y, p.length), _.init(), p.push(_), V.enabled === true && V.isPresenting === true) {
          const ee = M.xr.getDepthSensingMesh();
          ee !== null && ro(ee, L, -1 / 0, M.sortObjects);
        }
        ro(y, L, 0, M.sortObjects), _.finish(), M.sortObjects === true && _.sort(G, ae), Qe = V.enabled === false || V.isPresenting === false || V.hasDepthSensing() === false, Qe && Ae.addToRenderList(_, y), this.info.render.frame++, W === true && J.beginShadows();
        const F = m.state.shadowsArray;
        ue.render(F, y, L), W === true && J.endShadows(), this.info.autoReset === true && this.info.reset();
        const O = _.opaque, D = _.transmissive;
        if (m.setupLights(), L.isArrayCamera) {
          const ee = L.cameras;
          if (D.length > 0) for (let se = 0, fe = ee.length; se < fe; se++) {
            const me = ee[se];
            Sc(O, D, y, me);
          }
          Qe && Ae.render(y);
          for (let se = 0, fe = ee.length; se < fe; se++) {
            const me = ee[se];
            Mc(_, y, me, me.viewport);
          }
        } else D.length > 0 && Sc(O, D, y, L), Qe && Ae.render(y), Mc(_, y, L);
        w !== null && (T.updateMultisampleRenderTarget(w), T.updateRenderTargetMipmap(w)), y.isScene === true && y.onAfterRender(M, y, L), nt.resetDefaultState(), U = -1, j = null, E.pop(), E.length > 0 ? (m = E[E.length - 1], W === true && J.setGlobalState(M.clippingPlanes, m.state.camera)) : m = null, p.pop(), p.length > 0 ? _ = p[p.length - 1] : _ = null;
      };
      function ro(y, L, F, O) {
        if (y.visible === false) return;
        if (y.layers.test(L.layers)) {
          if (y.isGroup) F = y.renderOrder;
          else if (y.isLOD) y.autoUpdate === true && y.update(L);
          else if (y.isLight) m.pushLight(y), y.castShadow && m.pushShadow(y);
          else if (y.isSprite) {
            if (!y.frustumCulled || $e.intersectsSprite(y)) {
              O && Ee.setFromMatrixPosition(y.matrixWorld).applyMatrix4(le);
              const se = X.update(y), fe = y.material;
              fe.visible && _.push(y, se, fe, F, Ee.z, null);
            }
          } else if ((y.isMesh || y.isLine || y.isPoints) && (!y.frustumCulled || $e.intersectsObject(y))) {
            const se = X.update(y), fe = y.material;
            if (O && (y.boundingSphere !== void 0 ? (y.boundingSphere === null && y.computeBoundingSphere(), Ee.copy(y.boundingSphere.center)) : (se.boundingSphere === null && se.computeBoundingSphere(), Ee.copy(se.boundingSphere.center)), Ee.applyMatrix4(y.matrixWorld).applyMatrix4(le)), Array.isArray(fe)) {
              const me = se.groups;
              for (let Me = 0, be = me.length; Me < be; Me++) {
                const xe = me[Me], Ze = fe[xe.materialIndex];
                Ze && Ze.visible && _.push(y, se, Ze, F, Ee.z, xe);
              }
            } else fe.visible && _.push(y, se, fe, F, Ee.z, null);
          }
        }
        const ee = y.children;
        for (let se = 0, fe = ee.length; se < fe; se++) ro(ee[se], L, F, O);
      }
      function Mc(y, L, F, O) {
        const D = y.opaque, ee = y.transmissive, se = y.transparent;
        m.setupLightsView(F), W === true && J.setGlobalState(M.clippingPlanes, F), O && Te.viewport(x.copy(O)), D.length > 0 && Xs(D, L, F), ee.length > 0 && Xs(ee, L, F), se.length > 0 && Xs(se, L, F), Te.buffers.depth.setTest(true), Te.buffers.depth.setMask(true), Te.buffers.color.setMask(true), Te.setPolygonOffset(false);
      }
      function Sc(y, L, F, O) {
        if ((F.isScene === true ? F.overrideMaterial : null) !== null) return;
        m.state.transmissionRenderTarget[O.id] === void 0 && (m.state.transmissionRenderTarget[O.id] = new mi(1, 1, {
          generateMipmaps: true,
          type: Fe.has("EXT_color_buffer_half_float") || Fe.has("EXT_color_buffer_float") ? zs : In,
          minFilter: wn,
          samples: 4,
          stencilBuffer: r,
          resolveDepthBuffer: false,
          resolveStencilBuffer: false,
          colorSpace: Ge.workingColorSpace
        }));
        const ee = m.state.transmissionRenderTarget[O.id], se = O.viewport || x;
        ee.setSize(se.z, se.w);
        const fe = M.getRenderTarget();
        M.setRenderTarget(ee), M.getClearColor(B), H = M.getClearAlpha(), H < 1 && M.setClearColor(16777215, 0.5), M.clear(), Qe && Ae.render(F);
        const me = M.toneMapping;
        M.toneMapping = Kn;
        const Me = O.viewport;
        if (O.viewport !== void 0 && (O.viewport = void 0), m.setupLightsView(O), W === true && J.setGlobalState(M.clippingPlanes, O), Xs(y, F, O), T.updateMultisampleRenderTarget(ee), T.updateRenderTargetMipmap(ee), Fe.has("WEBGL_multisampled_render_to_texture") === false) {
          let be = false;
          for (let xe = 0, Ze = L.length; xe < Ze; xe++) {
            const st = L[xe], ct = st.object, Ft = st.geometry, qe = st.material, ve = st.group;
            if (qe.side === Yt && ct.layers.test(O.layers)) {
              const Mt = qe.side;
              qe.side = Ut, qe.needsUpdate = true, Ec(ct, F, O, Ft, qe, ve), qe.side = Mt, qe.needsUpdate = true, be = true;
            }
          }
          be === true && (T.updateMultisampleRenderTarget(ee), T.updateRenderTargetMipmap(ee));
        }
        M.setRenderTarget(fe), M.setClearColor(B, H), Me !== void 0 && (O.viewport = Me), M.toneMapping = me;
      }
      function Xs(y, L, F) {
        const O = L.isScene === true ? L.overrideMaterial : null;
        for (let D = 0, ee = y.length; D < ee; D++) {
          const se = y[D], fe = se.object, me = se.geometry, Me = O === null ? se.material : O, be = se.group;
          fe.layers.test(F.layers) && Ec(fe, L, F, me, Me, be);
        }
      }
      function Ec(y, L, F, O, D, ee) {
        y.onBeforeRender(M, L, F, O, D, ee), y.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse, y.matrixWorld), y.normalMatrix.getNormalMatrix(y.modelViewMatrix), D.onBeforeRender(M, L, F, O, y, ee), D.transparent === true && D.side === Yt && D.forceSinglePass === false ? (D.side = Ut, D.needsUpdate = true, M.renderBufferDirect(F, L, O, D, y, ee), D.side = Pn, D.needsUpdate = true, M.renderBufferDirect(F, L, O, D, y, ee), D.side = Yt) : M.renderBufferDirect(F, L, O, D, y, ee), y.onAfterRender(M, L, F, O, D, ee);
      }
      function Ys(y, L, F) {
        L.isScene !== true && (L = Be);
        const O = Re.get(y), D = m.state.lights, ee = m.state.shadowsArray, se = D.state.version, fe = _e.getParameters(y, D.state, ee, L, F), me = _e.getProgramCacheKey(fe);
        let Me = O.programs;
        O.environment = y.isMeshStandardMaterial ? L.environment : null, O.fog = L.fog, O.envMap = (y.isMeshStandardMaterial ? N : v).get(y.envMap || O.environment), O.envMapRotation = O.environment !== null && y.envMap === null ? L.environmentRotation : y.envMapRotation, Me === void 0 && (y.addEventListener("dispose", ze), Me = /* @__PURE__ */ new Map(), O.programs = Me);
        let be = Me.get(me);
        if (be !== void 0) {
          if (O.currentProgram === be && O.lightsStateVersion === se) return Tc(y, fe), be;
        } else fe.uniforms = _e.getUniforms(y), y.onBeforeCompile(fe, M), be = _e.acquireProgram(fe, me), Me.set(me, be), O.uniforms = fe.uniforms;
        const xe = O.uniforms;
        return (!y.isShaderMaterial && !y.isRawShaderMaterial || y.clipping === true) && (xe.clippingPlanes = J.uniform), Tc(y, fe), O.needsLights = hu(y), O.lightsStateVersion = se, O.needsLights && (xe.ambientLightColor.value = D.state.ambient, xe.lightProbe.value = D.state.probe, xe.directionalLights.value = D.state.directional, xe.directionalLightShadows.value = D.state.directionalShadow, xe.spotLights.value = D.state.spot, xe.spotLightShadows.value = D.state.spotShadow, xe.rectAreaLights.value = D.state.rectArea, xe.ltc_1.value = D.state.rectAreaLTC1, xe.ltc_2.value = D.state.rectAreaLTC2, xe.pointLights.value = D.state.point, xe.pointLightShadows.value = D.state.pointShadow, xe.hemisphereLights.value = D.state.hemi, xe.directionalShadowMap.value = D.state.directionalShadowMap, xe.directionalShadowMatrix.value = D.state.directionalShadowMatrix, xe.spotShadowMap.value = D.state.spotShadowMap, xe.spotLightMatrix.value = D.state.spotLightMatrix, xe.spotLightMap.value = D.state.spotLightMap, xe.pointShadowMap.value = D.state.pointShadowMap, xe.pointShadowMatrix.value = D.state.pointShadowMatrix), O.currentProgram = be, O.uniformsList = null, be;
      }
      function bc(y) {
        if (y.uniformsList === null) {
          const L = y.currentProgram.getUniforms();
          y.uniformsList = Nr.seqWithValue(L.seq, y.uniforms);
        }
        return y.uniformsList;
      }
      function Tc(y, L) {
        const F = Re.get(y);
        F.outputColorSpace = L.outputColorSpace, F.batching = L.batching, F.batchingColor = L.batchingColor, F.instancing = L.instancing, F.instancingColor = L.instancingColor, F.instancingMorph = L.instancingMorph, F.skinning = L.skinning, F.morphTargets = L.morphTargets, F.morphNormals = L.morphNormals, F.morphColors = L.morphColors, F.morphTargetsCount = L.morphTargetsCount, F.numClippingPlanes = L.numClippingPlanes, F.numIntersection = L.numClipIntersection, F.vertexAlphas = L.vertexAlphas, F.vertexTangents = L.vertexTangents, F.toneMapping = L.toneMapping;
      }
      function cu(y, L, F, O, D) {
        L.isScene !== true && (L = Be), T.resetTextureUnits();
        const ee = L.fog, se = O.isMeshStandardMaterial ? L.environment : null, fe = w === null ? M.outputColorSpace : w.isXRRenderTarget === true ? w.texture.colorSpace : Et, me = (O.isMeshStandardMaterial ? N : v).get(O.envMap || se), Me = O.vertexColors === true && !!F.attributes.color && F.attributes.color.itemSize === 4, be = !!F.attributes.tangent && (!!O.normalMap || O.anisotropy > 0), xe = !!F.morphAttributes.position, Ze = !!F.morphAttributes.normal, st = !!F.morphAttributes.color;
        let ct = Kn;
        O.toneMapped && (w === null || w.isXRRenderTarget === true) && (ct = M.toneMapping);
        const Ft = F.morphAttributes.position || F.morphAttributes.normal || F.morphAttributes.color, qe = Ft !== void 0 ? Ft.length : 0, ve = Re.get(O), Mt = m.state.lights;
        if (W === true && (Z === true || y !== j)) {
          const Vt = y === j && O.id === U;
          J.setState(O, y, Vt);
        }
        let je = false;
        O.version === ve.__version ? (ve.needsLights && ve.lightsStateVersion !== Mt.state.version || ve.outputColorSpace !== fe || D.isBatchedMesh && ve.batching === false || !D.isBatchedMesh && ve.batching === true || D.isBatchedMesh && ve.batchingColor === true && D.colorTexture === null || D.isBatchedMesh && ve.batchingColor === false && D.colorTexture !== null || D.isInstancedMesh && ve.instancing === false || !D.isInstancedMesh && ve.instancing === true || D.isSkinnedMesh && ve.skinning === false || !D.isSkinnedMesh && ve.skinning === true || D.isInstancedMesh && ve.instancingColor === true && D.instanceColor === null || D.isInstancedMesh && ve.instancingColor === false && D.instanceColor !== null || D.isInstancedMesh && ve.instancingMorph === true && D.morphTexture === null || D.isInstancedMesh && ve.instancingMorph === false && D.morphTexture !== null || ve.envMap !== me || O.fog === true && ve.fog !== ee || ve.numClippingPlanes !== void 0 && (ve.numClippingPlanes !== J.numPlanes || ve.numIntersection !== J.numIntersection) || ve.vertexAlphas !== Me || ve.vertexTangents !== be || ve.morphTargets !== xe || ve.morphNormals !== Ze || ve.morphColors !== st || ve.toneMapping !== ct || ve.morphTargetsCount !== qe) && (je = true) : (je = true, ve.__version = O.version);
        let Jt = ve.currentProgram;
        je === true && (Jt = Ys(O, L, D));
        let _i = false, Ot = false, oo = false;
        const ht = Jt.getUniforms(), Dn = ve.uniforms;
        if (Te.useProgram(Jt.program) && (_i = true, Ot = true, oo = true), O.id !== U && (U = O.id, Ot = true), _i || j !== y) {
          He.reverseDepthBuffer ? (pe.copy(y.projectionMatrix), Md(pe), Sd(pe), ht.setValue(C, "projectionMatrix", pe)) : ht.setValue(C, "projectionMatrix", y.projectionMatrix), ht.setValue(C, "viewMatrix", y.matrixWorldInverse);
          const Vt = ht.map.cameraPosition;
          Vt !== void 0 && Vt.setValue(C, Pe.setFromMatrixPosition(y.matrixWorld)), He.logarithmicDepthBuffer && ht.setValue(C, "logDepthBufFC", 2 / (Math.log(y.far + 1) / Math.LN2)), (O.isMeshPhongMaterial || O.isMeshToonMaterial || O.isMeshLambertMaterial || O.isMeshBasicMaterial || O.isMeshStandardMaterial || O.isShaderMaterial) && ht.setValue(C, "isOrthographic", y.isOrthographicCamera === true), j !== y && (j = y, Ot = true, oo = true);
        }
        if (D.isSkinnedMesh) {
          ht.setOptional(C, D, "bindMatrix"), ht.setOptional(C, D, "bindMatrixInverse");
          const Vt = D.skeleton;
          Vt && (Vt.boneTexture === null && Vt.computeBoneTexture(), ht.setValue(C, "boneTexture", Vt.boneTexture, T));
        }
        D.isBatchedMesh && (ht.setOptional(C, D, "batchingTexture"), ht.setValue(C, "batchingTexture", D._matricesTexture, T), ht.setOptional(C, D, "batchingIdTexture"), ht.setValue(C, "batchingIdTexture", D._indirectTexture, T), ht.setOptional(C, D, "batchingColorTexture"), D._colorsTexture !== null && ht.setValue(C, "batchingColorTexture", D._colorsTexture, T));
        const ao = F.morphAttributes;
        if ((ao.position !== void 0 || ao.normal !== void 0 || ao.color !== void 0) && we.update(D, F, Jt), (Ot || ve.receiveShadow !== D.receiveShadow) && (ve.receiveShadow = D.receiveShadow, ht.setValue(C, "receiveShadow", D.receiveShadow)), O.isMeshGouraudMaterial && O.envMap !== null && (Dn.envMap.value = me, Dn.flipEnvMap.value = me.isCubeTexture && me.isRenderTargetTexture === false ? -1 : 1), O.isMeshStandardMaterial && O.envMap === null && L.environment !== null && (Dn.envMapIntensity.value = L.environmentIntensity), Ot && (ht.setValue(C, "toneMappingExposure", M.toneMappingExposure), ve.needsLights && lu(Dn, oo), ee && O.fog === true && ne.refreshFogUniforms(Dn, ee), ne.refreshMaterialUniforms(Dn, O, Q, z, m.state.transmissionRenderTarget[y.id]), Nr.upload(C, bc(ve), Dn, T)), O.isShaderMaterial && O.uniformsNeedUpdate === true && (Nr.upload(C, bc(ve), Dn, T), O.uniformsNeedUpdate = false), O.isSpriteMaterial && ht.setValue(C, "center", D.center), ht.setValue(C, "modelViewMatrix", D.modelViewMatrix), ht.setValue(C, "normalMatrix", D.normalMatrix), ht.setValue(C, "modelMatrix", D.matrixWorld), O.isShaderMaterial || O.isRawShaderMaterial) {
          const Vt = O.uniformsGroups;
          for (let co = 0, uu = Vt.length; co < uu; co++) {
            const Ac = Vt[co];
            P.update(Ac, Jt), P.bind(Ac, Jt);
          }
        }
        return Jt;
      }
      function lu(y, L) {
        y.ambientLightColor.needsUpdate = L, y.lightProbe.needsUpdate = L, y.directionalLights.needsUpdate = L, y.directionalLightShadows.needsUpdate = L, y.pointLights.needsUpdate = L, y.pointLightShadows.needsUpdate = L, y.spotLights.needsUpdate = L, y.spotLightShadows.needsUpdate = L, y.rectAreaLights.needsUpdate = L, y.hemisphereLights.needsUpdate = L;
      }
      function hu(y) {
        return y.isMeshLambertMaterial || y.isMeshToonMaterial || y.isMeshPhongMaterial || y.isMeshStandardMaterial || y.isShadowMaterial || y.isShaderMaterial && y.lights === true;
      }
      this.getActiveCubeFace = function() {
        return I;
      }, this.getActiveMipmapLevel = function() {
        return A;
      }, this.getRenderTarget = function() {
        return w;
      }, this.setRenderTargetTextures = function(y, L, F) {
        Re.get(y.texture).__webglTexture = L, Re.get(y.depthTexture).__webglTexture = F;
        const O = Re.get(y);
        O.__hasExternalTextures = true, O.__autoAllocateDepthBuffer = F === void 0, O.__autoAllocateDepthBuffer || Fe.has("WEBGL_multisampled_render_to_texture") === true && (console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"), O.__useRenderToTexture = false);
      }, this.setRenderTargetFramebuffer = function(y, L) {
        const F = Re.get(y);
        F.__webglFramebuffer = L, F.__useDefaultFramebuffer = L === void 0;
      }, this.setRenderTarget = function(y, L = 0, F = 0) {
        w = y, I = L, A = F;
        let O = true, D = null, ee = false, se = false;
        if (y) {
          const me = Re.get(y);
          if (me.__useDefaultFramebuffer !== void 0) Te.bindFramebuffer(C.FRAMEBUFFER, null), O = false;
          else if (me.__webglFramebuffer === void 0) T.setupRenderTarget(y);
          else if (me.__hasExternalTextures) T.rebindTextures(y, Re.get(y.texture).__webglTexture, Re.get(y.depthTexture).__webglTexture);
          else if (y.depthBuffer) {
            const xe = y.depthTexture;
            if (me.__boundDepthTexture !== xe) {
              if (xe !== null && Re.has(xe) && (y.width !== xe.image.width || y.height !== xe.image.height)) throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");
              T.setupDepthRenderbuffer(y);
            }
          }
          const Me = y.texture;
          (Me.isData3DTexture || Me.isDataArrayTexture || Me.isCompressedArrayTexture) && (se = true);
          const be = Re.get(y).__webglFramebuffer;
          y.isWebGLCubeRenderTarget ? (Array.isArray(be[L]) ? D = be[L][F] : D = be[L], ee = true) : y.samples > 0 && T.useMultisampledRTT(y) === false ? D = Re.get(y).__webglMultisampledFramebuffer : Array.isArray(be) ? D = be[F] : D = be, x.copy(y.viewport), S.copy(y.scissor), k = y.scissorTest;
        } else x.copy(ce).multiplyScalar(Q).floor(), S.copy(ge).multiplyScalar(Q).floor(), k = We;
        if (Te.bindFramebuffer(C.FRAMEBUFFER, D) && O && Te.drawBuffers(y, D), Te.viewport(x), Te.scissor(S), Te.setScissorTest(k), ee) {
          const me = Re.get(y.texture);
          C.framebufferTexture2D(C.FRAMEBUFFER, C.COLOR_ATTACHMENT0, C.TEXTURE_CUBE_MAP_POSITIVE_X + L, me.__webglTexture, F);
        } else if (se) {
          const me = Re.get(y.texture), Me = L || 0;
          C.framebufferTextureLayer(C.FRAMEBUFFER, C.COLOR_ATTACHMENT0, me.__webglTexture, F || 0, Me);
        }
        U = -1;
      }, this.readRenderTargetPixels = function(y, L, F, O, D, ee, se) {
        if (!(y && y.isWebGLRenderTarget)) {
          console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
          return;
        }
        let fe = Re.get(y).__webglFramebuffer;
        if (y.isWebGLCubeRenderTarget && se !== void 0 && (fe = fe[se]), fe) {
          Te.bindFramebuffer(C.FRAMEBUFFER, fe);
          try {
            const me = y.texture, Me = me.format, be = me.type;
            if (!He.textureFormatReadable(Me)) {
              console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");
              return;
            }
            if (!He.textureTypeReadable(be)) {
              console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");
              return;
            }
            L >= 0 && L <= y.width - O && F >= 0 && F <= y.height - D && C.readPixels(L, F, O, D, Ie.convert(Me), Ie.convert(be), ee);
          } finally {
            const me = w !== null ? Re.get(w).__webglFramebuffer : null;
            Te.bindFramebuffer(C.FRAMEBUFFER, me);
          }
        }
      }, this.readRenderTargetPixelsAsync = async function(y, L, F, O, D, ee, se) {
        if (!(y && y.isWebGLRenderTarget)) throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
        let fe = Re.get(y).__webglFramebuffer;
        if (y.isWebGLCubeRenderTarget && se !== void 0 && (fe = fe[se]), fe) {
          const me = y.texture, Me = me.format, be = me.type;
          if (!He.textureFormatReadable(Me)) throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");
          if (!He.textureTypeReadable(be)) throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");
          if (L >= 0 && L <= y.width - O && F >= 0 && F <= y.height - D) {
            Te.bindFramebuffer(C.FRAMEBUFFER, fe);
            const xe = C.createBuffer();
            C.bindBuffer(C.PIXEL_PACK_BUFFER, xe), C.bufferData(C.PIXEL_PACK_BUFFER, ee.byteLength, C.STREAM_READ), C.readPixels(L, F, O, D, Ie.convert(Me), Ie.convert(be), 0);
            const Ze = w !== null ? Re.get(w).__webglFramebuffer : null;
            Te.bindFramebuffer(C.FRAMEBUFFER, Ze);
            const st = C.fenceSync(C.SYNC_GPU_COMMANDS_COMPLETE, 0);
            return C.flush(), await yd(C, st, 4), C.bindBuffer(C.PIXEL_PACK_BUFFER, xe), C.getBufferSubData(C.PIXEL_PACK_BUFFER, 0, ee), C.deleteBuffer(xe), C.deleteSync(st), ee;
          } else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.");
        }
      }, this.copyFramebufferToTexture = function(y, L = null, F = 0) {
        y.isTexture !== true && (Ur("WebGLRenderer: copyFramebufferToTexture function signature has changed."), L = arguments[0] || null, y = arguments[1]);
        const O = Math.pow(2, -F), D = Math.floor(y.image.width * O), ee = Math.floor(y.image.height * O), se = L !== null ? L.x : 0, fe = L !== null ? L.y : 0;
        T.setTexture2D(y, 0), C.copyTexSubImage2D(C.TEXTURE_2D, F, 0, 0, se, fe, D, ee), Te.unbindTexture();
      }, this.copyTextureToTexture = function(y, L, F = null, O = null, D = 0) {
        y.isTexture !== true && (Ur("WebGLRenderer: copyTextureToTexture function signature has changed."), O = arguments[0] || null, y = arguments[1], L = arguments[2], D = arguments[3] || 0, F = null);
        let ee, se, fe, me, Me, be;
        F !== null ? (ee = F.max.x - F.min.x, se = F.max.y - F.min.y, fe = F.min.x, me = F.min.y) : (ee = y.image.width, se = y.image.height, fe = 0, me = 0), O !== null ? (Me = O.x, be = O.y) : (Me = 0, be = 0);
        const xe = Ie.convert(L.format), Ze = Ie.convert(L.type);
        T.setTexture2D(L, 0), C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL, L.flipY), C.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL, L.premultiplyAlpha), C.pixelStorei(C.UNPACK_ALIGNMENT, L.unpackAlignment);
        const st = C.getParameter(C.UNPACK_ROW_LENGTH), ct = C.getParameter(C.UNPACK_IMAGE_HEIGHT), Ft = C.getParameter(C.UNPACK_SKIP_PIXELS), qe = C.getParameter(C.UNPACK_SKIP_ROWS), ve = C.getParameter(C.UNPACK_SKIP_IMAGES), Mt = y.isCompressedTexture ? y.mipmaps[D] : y.image;
        C.pixelStorei(C.UNPACK_ROW_LENGTH, Mt.width), C.pixelStorei(C.UNPACK_IMAGE_HEIGHT, Mt.height), C.pixelStorei(C.UNPACK_SKIP_PIXELS, fe), C.pixelStorei(C.UNPACK_SKIP_ROWS, me), y.isDataTexture ? C.texSubImage2D(C.TEXTURE_2D, D, Me, be, ee, se, xe, Ze, Mt.data) : y.isCompressedTexture ? C.compressedTexSubImage2D(C.TEXTURE_2D, D, Me, be, Mt.width, Mt.height, xe, Mt.data) : C.texSubImage2D(C.TEXTURE_2D, D, Me, be, ee, se, xe, Ze, Mt), C.pixelStorei(C.UNPACK_ROW_LENGTH, st), C.pixelStorei(C.UNPACK_IMAGE_HEIGHT, ct), C.pixelStorei(C.UNPACK_SKIP_PIXELS, Ft), C.pixelStorei(C.UNPACK_SKIP_ROWS, qe), C.pixelStorei(C.UNPACK_SKIP_IMAGES, ve), D === 0 && L.generateMipmaps && C.generateMipmap(C.TEXTURE_2D), Te.unbindTexture();
      }, this.copyTextureToTexture3D = function(y, L, F = null, O = null, D = 0) {
        y.isTexture !== true && (Ur("WebGLRenderer: copyTextureToTexture3D function signature has changed."), F = arguments[0] || null, O = arguments[1] || null, y = arguments[2], L = arguments[3], D = arguments[4] || 0);
        let ee, se, fe, me, Me, be, xe, Ze, st;
        const ct = y.isCompressedTexture ? y.mipmaps[D] : y.image;
        F !== null ? (ee = F.max.x - F.min.x, se = F.max.y - F.min.y, fe = F.max.z - F.min.z, me = F.min.x, Me = F.min.y, be = F.min.z) : (ee = ct.width, se = ct.height, fe = ct.depth, me = 0, Me = 0, be = 0), O !== null ? (xe = O.x, Ze = O.y, st = O.z) : (xe = 0, Ze = 0, st = 0);
        const Ft = Ie.convert(L.format), qe = Ie.convert(L.type);
        let ve;
        if (L.isData3DTexture) T.setTexture3D(L, 0), ve = C.TEXTURE_3D;
        else if (L.isDataArrayTexture || L.isCompressedArrayTexture) T.setTexture2DArray(L, 0), ve = C.TEXTURE_2D_ARRAY;
        else {
          console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");
          return;
        }
        C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL, L.flipY), C.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL, L.premultiplyAlpha), C.pixelStorei(C.UNPACK_ALIGNMENT, L.unpackAlignment);
        const Mt = C.getParameter(C.UNPACK_ROW_LENGTH), je = C.getParameter(C.UNPACK_IMAGE_HEIGHT), Jt = C.getParameter(C.UNPACK_SKIP_PIXELS), _i = C.getParameter(C.UNPACK_SKIP_ROWS), Ot = C.getParameter(C.UNPACK_SKIP_IMAGES);
        C.pixelStorei(C.UNPACK_ROW_LENGTH, ct.width), C.pixelStorei(C.UNPACK_IMAGE_HEIGHT, ct.height), C.pixelStorei(C.UNPACK_SKIP_PIXELS, me), C.pixelStorei(C.UNPACK_SKIP_ROWS, Me), C.pixelStorei(C.UNPACK_SKIP_IMAGES, be), y.isDataTexture || y.isData3DTexture ? C.texSubImage3D(ve, D, xe, Ze, st, ee, se, fe, Ft, qe, ct.data) : L.isCompressedArrayTexture ? C.compressedTexSubImage3D(ve, D, xe, Ze, st, ee, se, fe, Ft, ct.data) : C.texSubImage3D(ve, D, xe, Ze, st, ee, se, fe, Ft, qe, ct), C.pixelStorei(C.UNPACK_ROW_LENGTH, Mt), C.pixelStorei(C.UNPACK_IMAGE_HEIGHT, je), C.pixelStorei(C.UNPACK_SKIP_PIXELS, Jt), C.pixelStorei(C.UNPACK_SKIP_ROWS, _i), C.pixelStorei(C.UNPACK_SKIP_IMAGES, Ot), D === 0 && L.generateMipmaps && C.generateMipmap(ve), Te.unbindTexture();
      }, this.initRenderTarget = function(y) {
        Re.get(y).__webglFramebuffer === void 0 && T.setupRenderTarget(y);
      }, this.initTexture = function(y) {
        y.isCubeTexture ? T.setTextureCube(y, 0) : y.isData3DTexture ? T.setTexture3D(y, 0) : y.isDataArrayTexture || y.isCompressedArrayTexture ? T.setTexture2DArray(y, 0) : T.setTexture2D(y, 0), Te.unbindTexture();
      }, this.resetState = function() {
        I = 0, A = 0, w = null, Te.reset(), nt.reset();
      }, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", {
        detail: this
      }));
    }
    get coordinateSystem() {
      return Rn;
    }
    get outputColorSpace() {
      return this._outputColorSpace;
    }
    set outputColorSpace(e) {
      this._outputColorSpace = e;
      const t = this.getContext();
      t.drawingBufferColorSpace = e === tc ? "display-p3" : "srgb", t.unpackColorSpace = Ge.workingColorSpace === eo ? "display-p3" : "srgb";
    }
  }
  class U_ extends ot {
    constructor() {
      super(), this.isScene = true, this.type = "Scene", this.background = null, this.environment = null, this.fog = null, this.backgroundBlurriness = 0, this.backgroundIntensity = 1, this.backgroundRotation = new un(), this.environmentIntensity = 1, this.environmentRotation = new un(), this.overrideMaterial = null, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", {
        detail: this
      }));
    }
    copy(e, t) {
      return super.copy(e, t), e.background !== null && (this.background = e.background.clone()), e.environment !== null && (this.environment = e.environment.clone()), e.fog !== null && (this.fog = e.fog.clone()), this.backgroundBlurriness = e.backgroundBlurriness, this.backgroundIntensity = e.backgroundIntensity, this.backgroundRotation.copy(e.backgroundRotation), this.environmentIntensity = e.environmentIntensity, this.environmentRotation.copy(e.environmentRotation), e.overrideMaterial !== null && (this.overrideMaterial = e.overrideMaterial.clone()), this.matrixAutoUpdate = e.matrixAutoUpdate, this;
    }
    toJSON(e) {
      const t = super.toJSON(e);
      return this.fog !== null && (t.object.fog = this.fog.toJSON()), this.backgroundBlurriness > 0 && (t.object.backgroundBlurriness = this.backgroundBlurriness), this.backgroundIntensity !== 1 && (t.object.backgroundIntensity = this.backgroundIntensity), t.object.backgroundRotation = this.backgroundRotation.toArray(), this.environmentIntensity !== 1 && (t.object.environmentIntensity = this.environmentIntensity), t.object.environmentRotation = this.environmentRotation.toArray(), t;
    }
  }
  class Bh {
    constructor(e, t) {
      this.isInterleavedBuffer = true, this.array = e, this.stride = t, this.count = e !== void 0 ? e.length / t : 0, this.usage = Ba, this.updateRanges = [], this.version = 0, this.uuid = an();
    }
    onUploadCallback() {
    }
    set needsUpdate(e) {
      e === true && this.version++;
    }
    setUsage(e) {
      return this.usage = e, this;
    }
    addUpdateRange(e, t) {
      this.updateRanges.push({
        start: e,
        count: t
      });
    }
    clearUpdateRanges() {
      this.updateRanges.length = 0;
    }
    copy(e) {
      return this.array = new e.array.constructor(e.array), this.count = e.count, this.stride = e.stride, this.usage = e.usage, this;
    }
    copyAt(e, t, n) {
      e *= this.stride, n *= t.stride;
      for (let i = 0, r = this.stride; i < r; i++) this.array[e + i] = t.array[n + i];
      return this;
    }
    set(e, t = 0) {
      return this.array.set(e, t), this;
    }
    clone(e) {
      e.arrayBuffers === void 0 && (e.arrayBuffers = {}), this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = an()), e.arrayBuffers[this.array.buffer._uuid] === void 0 && (e.arrayBuffers[this.array.buffer._uuid] = this.array.slice(0).buffer);
      const t = new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]), n = new this.constructor(t, this.stride);
      return n.setUsage(this.usage), n;
    }
    onUpload(e) {
      return this.onUploadCallback = e, this;
    }
    toJSON(e) {
      return e.arrayBuffers === void 0 && (e.arrayBuffers = {}), this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = an()), e.arrayBuffers[this.array.buffer._uuid] === void 0 && (e.arrayBuffers[this.array.buffer._uuid] = Array.from(new Uint32Array(this.array.buffer))), {
        uuid: this.uuid,
        buffer: this.array.buffer._uuid,
        type: this.array.constructor.name,
        stride: this.stride
      };
    }
  }
  const At = new R();
  class Os {
    constructor(e, t, n, i = false) {
      this.isInterleavedBufferAttribute = true, this.name = "", this.data = e, this.itemSize = t, this.offset = n, this.normalized = i;
    }
    get count() {
      return this.data.count;
    }
    get array() {
      return this.data.array;
    }
    set needsUpdate(e) {
      this.data.needsUpdate = e;
    }
    applyMatrix4(e) {
      for (let t = 0, n = this.data.count; t < n; t++) At.fromBufferAttribute(this, t), At.applyMatrix4(e), this.setXYZ(t, At.x, At.y, At.z);
      return this;
    }
    applyNormalMatrix(e) {
      for (let t = 0, n = this.count; t < n; t++) At.fromBufferAttribute(this, t), At.applyNormalMatrix(e), this.setXYZ(t, At.x, At.y, At.z);
      return this;
    }
    transformDirection(e) {
      for (let t = 0, n = this.count; t < n; t++) At.fromBufferAttribute(this, t), At.transformDirection(e), this.setXYZ(t, At.x, At.y, At.z);
      return this;
    }
    getComponent(e, t) {
      let n = this.array[e * this.data.stride + this.offset + t];
      return this.normalized && (n = rn(n, this.array)), n;
    }
    setComponent(e, t, n) {
      return this.normalized && (n = Je(n, this.array)), this.data.array[e * this.data.stride + this.offset + t] = n, this;
    }
    setX(e, t) {
      return this.normalized && (t = Je(t, this.array)), this.data.array[e * this.data.stride + this.offset] = t, this;
    }
    setY(e, t) {
      return this.normalized && (t = Je(t, this.array)), this.data.array[e * this.data.stride + this.offset + 1] = t, this;
    }
    setZ(e, t) {
      return this.normalized && (t = Je(t, this.array)), this.data.array[e * this.data.stride + this.offset + 2] = t, this;
    }
    setW(e, t) {
      return this.normalized && (t = Je(t, this.array)), this.data.array[e * this.data.stride + this.offset + 3] = t, this;
    }
    getX(e) {
      let t = this.data.array[e * this.data.stride + this.offset];
      return this.normalized && (t = rn(t, this.array)), t;
    }
    getY(e) {
      let t = this.data.array[e * this.data.stride + this.offset + 1];
      return this.normalized && (t = rn(t, this.array)), t;
    }
    getZ(e) {
      let t = this.data.array[e * this.data.stride + this.offset + 2];
      return this.normalized && (t = rn(t, this.array)), t;
    }
    getW(e) {
      let t = this.data.array[e * this.data.stride + this.offset + 3];
      return this.normalized && (t = rn(t, this.array)), t;
    }
    setXY(e, t, n) {
      return e = e * this.data.stride + this.offset, this.normalized && (t = Je(t, this.array), n = Je(n, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = n, this;
    }
    setXYZ(e, t, n, i) {
      return e = e * this.data.stride + this.offset, this.normalized && (t = Je(t, this.array), n = Je(n, this.array), i = Je(i, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = n, this.data.array[e + 2] = i, this;
    }
    setXYZW(e, t, n, i, r) {
      return e = e * this.data.stride + this.offset, this.normalized && (t = Je(t, this.array), n = Je(n, this.array), i = Je(i, this.array), r = Je(r, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = n, this.data.array[e + 2] = i, this.data.array[e + 3] = r, this;
    }
    clone(e) {
      if (e === void 0) {
        console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");
        const t = [];
        for (let n = 0; n < this.count; n++) {
          const i = n * this.data.stride + this.offset;
          for (let r = 0; r < this.itemSize; r++) t.push(this.data.array[i + r]);
        }
        return new vt(new this.array.constructor(t), this.itemSize, this.normalized);
      } else return e.interleavedBuffers === void 0 && (e.interleavedBuffers = {}), e.interleavedBuffers[this.data.uuid] === void 0 && (e.interleavedBuffers[this.data.uuid] = this.data.clone(e)), new Os(e.interleavedBuffers[this.data.uuid], this.itemSize, this.offset, this.normalized);
    }
    toJSON(e) {
      if (e === void 0) {
        console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");
        const t = [];
        for (let n = 0; n < this.count; n++) {
          const i = n * this.data.stride + this.offset;
          for (let r = 0; r < this.itemSize; r++) t.push(this.data.array[i + r]);
        }
        return {
          itemSize: this.itemSize,
          type: this.array.constructor.name,
          array: t,
          normalized: this.normalized
        };
      } else return e.interleavedBuffers === void 0 && (e.interleavedBuffers = {}), e.interleavedBuffers[this.data.uuid] === void 0 && (e.interleavedBuffers[this.data.uuid] = this.data.toJSON(e)), {
        isInterleavedBufferAttribute: true,
        itemSize: this.itemSize,
        data: this.data.uuid,
        offset: this.offset,
        normalized: this.normalized
      };
    }
  }
  class kh extends cn {
    constructor(e) {
      super(), this.isSpriteMaterial = true, this.type = "SpriteMaterial", this.color = new Se(16777215), this.map = null, this.alphaMap = null, this.rotation = 0, this.sizeAttenuation = true, this.transparent = true, this.fog = true, this.setValues(e);
    }
    copy(e) {
      return super.copy(e), this.color.copy(e.color), this.map = e.map, this.alphaMap = e.alphaMap, this.rotation = e.rotation, this.sizeAttenuation = e.sizeAttenuation, this.fog = e.fog, this;
    }
  }
  let Li;
  const _s = new R(), Di = new R(), Ui = new R(), Ni = new ye(), xs = new ye(), zh = new Ce(), fr = new R(), vs = new R(), pr = new R(), Sl = new ye(), ko = new ye(), El = new ye();
  class N_ extends ot {
    constructor(e = new kh()) {
      if (super(), this.isSprite = true, this.type = "Sprite", Li === void 0) {
        Li = new yt();
        const t = new Float32Array([
          -0.5,
          -0.5,
          0,
          0,
          0,
          0.5,
          -0.5,
          0,
          1,
          0,
          0.5,
          0.5,
          0,
          1,
          1,
          -0.5,
          0.5,
          0,
          0,
          1
        ]), n = new Bh(t, 5);
        Li.setIndex([
          0,
          1,
          2,
          0,
          2,
          3
        ]), Li.setAttribute("position", new Os(n, 3, 0, false)), Li.setAttribute("uv", new Os(n, 2, 3, false));
      }
      this.geometry = Li, this.material = e, this.center = new ye(0.5, 0.5);
    }
    raycast(e, t) {
      e.camera === null && console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'), Di.setFromMatrixScale(this.matrixWorld), zh.copy(e.camera.matrixWorld), this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse, this.matrixWorld), Ui.setFromMatrixPosition(this.modelViewMatrix), e.camera.isPerspectiveCamera && this.material.sizeAttenuation === false && Di.multiplyScalar(-Ui.z);
      const n = this.material.rotation;
      let i, r;
      n !== 0 && (r = Math.cos(n), i = Math.sin(n));
      const o = this.center;
      mr(fr.set(-0.5, -0.5, 0), Ui, o, Di, i, r), mr(vs.set(0.5, -0.5, 0), Ui, o, Di, i, r), mr(pr.set(0.5, 0.5, 0), Ui, o, Di, i, r), Sl.set(0, 0), ko.set(1, 0), El.set(1, 1);
      let a = e.ray.intersectTriangle(fr, vs, pr, false, _s);
      if (a === null && (mr(vs.set(-0.5, 0.5, 0), Ui, o, Di, i, r), ko.set(0, 1), a = e.ray.intersectTriangle(fr, pr, vs, false, _s), a === null)) return;
      const c = e.ray.origin.distanceTo(_s);
      c < e.near || c > e.far || t.push({
        distance: c,
        point: _s.clone(),
        uv: qt.getInterpolation(_s, fr, vs, pr, Sl, ko, El, new ye()),
        face: null,
        object: this
      });
    }
    copy(e, t) {
      return super.copy(e, t), e.center !== void 0 && this.center.copy(e.center), this.material = e.material, this;
    }
  }
  function mr(s, e, t, n, i, r) {
    Ni.subVectors(s, t).addScalar(0.5).multiply(n), i !== void 0 ? (xs.x = r * Ni.x - i * Ni.y, xs.y = i * Ni.x + r * Ni.y) : xs.copy(Ni), s.copy(e), s.x += xs.x, s.y += xs.y, s.applyMatrix4(zh);
  }
  const bl = new R(), Tl = new Ye(), Al = new Ye(), F_ = new R(), wl = new Ce(), gr = new R(), zo = new fn(), Rl = new Ce(), Ho = new Hs();
  class O_ extends tt {
    constructor(e, t) {
      super(e, t), this.isSkinnedMesh = true, this.type = "SkinnedMesh", this.bindMode = Ic, this.bindMatrix = new Ce(), this.bindMatrixInverse = new Ce(), this.boundingBox = null, this.boundingSphere = null;
    }
    computeBoundingBox() {
      const e = this.geometry;
      this.boundingBox === null && (this.boundingBox = new dn()), this.boundingBox.makeEmpty();
      const t = e.getAttribute("position");
      for (let n = 0; n < t.count; n++) this.getVertexPosition(n, gr), this.boundingBox.expandByPoint(gr);
    }
    computeBoundingSphere() {
      const e = this.geometry;
      this.boundingSphere === null && (this.boundingSphere = new fn()), this.boundingSphere.makeEmpty();
      const t = e.getAttribute("position");
      for (let n = 0; n < t.count; n++) this.getVertexPosition(n, gr), this.boundingSphere.expandByPoint(gr);
    }
    copy(e, t) {
      return super.copy(e, t), this.bindMode = e.bindMode, this.bindMatrix.copy(e.bindMatrix), this.bindMatrixInverse.copy(e.bindMatrixInverse), this.skeleton = e.skeleton, e.boundingBox !== null && (this.boundingBox = e.boundingBox.clone()), e.boundingSphere !== null && (this.boundingSphere = e.boundingSphere.clone()), this;
    }
    raycast(e, t) {
      const n = this.material, i = this.matrixWorld;
      n !== void 0 && (this.boundingSphere === null && this.computeBoundingSphere(), zo.copy(this.boundingSphere), zo.applyMatrix4(i), e.ray.intersectsSphere(zo) !== false && (Rl.copy(i).invert(), Ho.copy(e.ray).applyMatrix4(Rl), !(this.boundingBox !== null && Ho.intersectsBox(this.boundingBox) === false) && this._computeIntersections(e, t, Ho)));
    }
    getVertexPosition(e, t) {
      return super.getVertexPosition(e, t), this.applyBoneTransform(e, t), t;
    }
    bind(e, t) {
      this.skeleton = e, t === void 0 && (this.updateMatrixWorld(true), this.skeleton.calculateInverses(), t = this.matrixWorld), this.bindMatrix.copy(t), this.bindMatrixInverse.copy(t).invert();
    }
    pose() {
      this.skeleton.pose();
    }
    normalizeSkinWeights() {
      const e = new Ye(), t = this.geometry.attributes.skinWeight;
      for (let n = 0, i = t.count; n < i; n++) {
        e.fromBufferAttribute(t, n);
        const r = 1 / e.manhattanLength();
        r !== 1 / 0 ? e.multiplyScalar(r) : e.set(1, 0, 0, 0), t.setXYZW(n, e.x, e.y, e.z, e.w);
      }
    }
    updateMatrixWorld(e) {
      super.updateMatrixWorld(e), this.bindMode === Ic ? this.bindMatrixInverse.copy(this.matrixWorld).invert() : this.bindMode === Vu ? this.bindMatrixInverse.copy(this.bindMatrix).invert() : console.warn("THREE.SkinnedMesh: Unrecognized bindMode: " + this.bindMode);
    }
    applyBoneTransform(e, t) {
      const n = this.skeleton, i = this.geometry;
      Tl.fromBufferAttribute(i.attributes.skinIndex, e), Al.fromBufferAttribute(i.attributes.skinWeight, e), bl.copy(t).applyMatrix4(this.bindMatrix), t.set(0, 0, 0);
      for (let r = 0; r < 4; r++) {
        const o = Al.getComponent(r);
        if (o !== 0) {
          const a = Tl.getComponent(r);
          wl.multiplyMatrices(n.bones[a].matrixWorld, n.boneInverses[a]), t.addScaledVector(F_.copy(bl).applyMatrix4(wl), o);
        }
      }
      return t.applyMatrix4(this.bindMatrixInverse);
    }
  }
  class Hh extends ot {
    constructor() {
      super(), this.isBone = true, this.type = "Bone";
    }
  }
  class Vh extends mt {
    constructor(e = null, t = 1, n = 1, i, r, o, a, c, l = Pt, h = Pt, u, d) {
      super(null, o, a, c, l, h, i, r, u, d), this.isDataTexture = true, this.image = {
        data: e,
        width: t,
        height: n
      }, this.generateMipmaps = false, this.flipY = false, this.unpackAlignment = 1;
    }
  }
  const Cl = new Ce(), B_ = new Ce();
  class oc {
    constructor(e = [], t = []) {
      this.uuid = an(), this.bones = e.slice(0), this.boneInverses = t, this.boneMatrices = null, this.boneTexture = null, this.init();
    }
    init() {
      const e = this.bones, t = this.boneInverses;
      if (this.boneMatrices = new Float32Array(e.length * 16), t.length === 0) this.calculateInverses();
      else if (e.length !== t.length) {
        console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."), this.boneInverses = [];
        for (let n = 0, i = this.bones.length; n < i; n++) this.boneInverses.push(new Ce());
      }
    }
    calculateInverses() {
      this.boneInverses.length = 0;
      for (let e = 0, t = this.bones.length; e < t; e++) {
        const n = new Ce();
        this.bones[e] && n.copy(this.bones[e].matrixWorld).invert(), this.boneInverses.push(n);
      }
    }
    pose() {
      for (let e = 0, t = this.bones.length; e < t; e++) {
        const n = this.bones[e];
        n && n.matrixWorld.copy(this.boneInverses[e]).invert();
      }
      for (let e = 0, t = this.bones.length; e < t; e++) {
        const n = this.bones[e];
        n && (n.parent && n.parent.isBone ? (n.matrix.copy(n.parent.matrixWorld).invert(), n.matrix.multiply(n.matrixWorld)) : n.matrix.copy(n.matrixWorld), n.matrix.decompose(n.position, n.quaternion, n.scale));
      }
    }
    update() {
      const e = this.bones, t = this.boneInverses, n = this.boneMatrices, i = this.boneTexture;
      for (let r = 0, o = e.length; r < o; r++) {
        const a = e[r] ? e[r].matrixWorld : B_;
        Cl.multiplyMatrices(a, t[r]), Cl.toArray(n, r * 16);
      }
      i !== null && (i.needsUpdate = true);
    }
    clone() {
      return new oc(this.bones, this.boneInverses);
    }
    computeBoneTexture() {
      let e = Math.sqrt(this.bones.length * 4);
      e = Math.ceil(e / 4) * 4, e = Math.max(e, 4);
      const t = new Float32Array(e * e * 4);
      t.set(this.boneMatrices);
      const n = new Vh(t, e, e, $t, on);
      return n.needsUpdate = true, this.boneMatrices = t, this.boneTexture = n, this;
    }
    getBoneByName(e) {
      for (let t = 0, n = this.bones.length; t < n; t++) {
        const i = this.bones[t];
        if (i.name === e) return i;
      }
    }
    dispose() {
      this.boneTexture !== null && (this.boneTexture.dispose(), this.boneTexture = null);
    }
    fromJSON(e, t) {
      this.uuid = e.uuid;
      for (let n = 0, i = e.bones.length; n < i; n++) {
        const r = e.bones[n];
        let o = t[r];
        o === void 0 && (console.warn("THREE.Skeleton: No bone found with UUID:", r), o = new Hh()), this.bones.push(o), this.boneInverses.push(new Ce().fromArray(e.boneInverses[n]));
      }
      return this.init(), this;
    }
    toJSON() {
      const e = {
        metadata: {
          version: 4.6,
          type: "Skeleton",
          generator: "Skeleton.toJSON"
        },
        bones: [],
        boneInverses: []
      };
      e.uuid = this.uuid;
      const t = this.bones, n = this.boneInverses;
      for (let i = 0, r = t.length; i < r; i++) {
        const o = t[i];
        e.bones.push(o.uuid);
        const a = n[i];
        e.boneInverses.push(a.toArray());
      }
      return e;
    }
  }
  class za extends vt {
    constructor(e, t, n, i = 1) {
      super(e, t, n), this.isInstancedBufferAttribute = true, this.meshPerAttribute = i;
    }
    copy(e) {
      return super.copy(e), this.meshPerAttribute = e.meshPerAttribute, this;
    }
    toJSON() {
      const e = super.toJSON();
      return e.meshPerAttribute = this.meshPerAttribute, e.isInstancedBufferAttribute = true, e;
    }
  }
  const Fi = new Ce(), Pl = new Ce(), _r = [], Il = new dn(), k_ = new Ce(), ys = new tt(), Ms = new fn();
  class z_ extends tt {
    constructor(e, t, n) {
      super(e, t), this.isInstancedMesh = true, this.instanceMatrix = new za(new Float32Array(n * 16), 16), this.instanceColor = null, this.morphTexture = null, this.count = n, this.boundingBox = null, this.boundingSphere = null;
      for (let i = 0; i < n; i++) this.setMatrixAt(i, k_);
    }
    computeBoundingBox() {
      const e = this.geometry, t = this.count;
      this.boundingBox === null && (this.boundingBox = new dn()), e.boundingBox === null && e.computeBoundingBox(), this.boundingBox.makeEmpty();
      for (let n = 0; n < t; n++) this.getMatrixAt(n, Fi), Il.copy(e.boundingBox).applyMatrix4(Fi), this.boundingBox.union(Il);
    }
    computeBoundingSphere() {
      const e = this.geometry, t = this.count;
      this.boundingSphere === null && (this.boundingSphere = new fn()), e.boundingSphere === null && e.computeBoundingSphere(), this.boundingSphere.makeEmpty();
      for (let n = 0; n < t; n++) this.getMatrixAt(n, Fi), Ms.copy(e.boundingSphere).applyMatrix4(Fi), this.boundingSphere.union(Ms);
    }
    copy(e, t) {
      return super.copy(e, t), this.instanceMatrix.copy(e.instanceMatrix), e.morphTexture !== null && (this.morphTexture = e.morphTexture.clone()), e.instanceColor !== null && (this.instanceColor = e.instanceColor.clone()), this.count = e.count, e.boundingBox !== null && (this.boundingBox = e.boundingBox.clone()), e.boundingSphere !== null && (this.boundingSphere = e.boundingSphere.clone()), this;
    }
    getColorAt(e, t) {
      t.fromArray(this.instanceColor.array, e * 3);
    }
    getMatrixAt(e, t) {
      t.fromArray(this.instanceMatrix.array, e * 16);
    }
    getMorphAt(e, t) {
      const n = t.morphTargetInfluences, i = this.morphTexture.source.data.data, r = n.length + 1, o = e * r + 1;
      for (let a = 0; a < n.length; a++) n[a] = i[o + a];
    }
    raycast(e, t) {
      const n = this.matrixWorld, i = this.count;
      if (ys.geometry = this.geometry, ys.material = this.material, ys.material !== void 0 && (this.boundingSphere === null && this.computeBoundingSphere(), Ms.copy(this.boundingSphere), Ms.applyMatrix4(n), e.ray.intersectsSphere(Ms) !== false)) for (let r = 0; r < i; r++) {
        this.getMatrixAt(r, Fi), Pl.multiplyMatrices(n, Fi), ys.matrixWorld = Pl, ys.raycast(e, _r);
        for (let o = 0, a = _r.length; o < a; o++) {
          const c = _r[o];
          c.instanceId = r, c.object = this, t.push(c);
        }
        _r.length = 0;
      }
    }
    setColorAt(e, t) {
      this.instanceColor === null && (this.instanceColor = new za(new Float32Array(this.instanceMatrix.count * 3).fill(1), 3)), t.toArray(this.instanceColor.array, e * 3);
    }
    setMatrixAt(e, t) {
      t.toArray(this.instanceMatrix.array, e * 16);
    }
    setMorphAt(e, t) {
      const n = t.morphTargetInfluences, i = n.length + 1;
      this.morphTexture === null && (this.morphTexture = new Vh(new Float32Array(i * this.count), i, this.count, $a, on));
      const r = this.morphTexture.source.data.data;
      let o = 0;
      for (let l = 0; l < n.length; l++) o += n[l];
      const a = this.geometry.morphTargetsRelative ? 1 : 1 - o, c = i * e;
      r[c] = a, r.set(n, c + 1);
    }
    updateMorphTargets() {
    }
    dispose() {
      return this.dispatchEvent({
        type: "dispose"
      }), this.morphTexture !== null && (this.morphTexture.dispose(), this.morphTexture = null), this;
    }
  }
  class no extends cn {
    constructor(e) {
      super(), this.isLineBasicMaterial = true, this.type = "LineBasicMaterial", this.color = new Se(16777215), this.map = null, this.linewidth = 1, this.linecap = "round", this.linejoin = "round", this.fog = true, this.setValues(e);
    }
    copy(e) {
      return super.copy(e), this.color.copy(e.color), this.map = e.map, this.linewidth = e.linewidth, this.linecap = e.linecap, this.linejoin = e.linejoin, this.fog = e.fog, this;
    }
  }
  const jr = new R(), Kr = new R(), Ll = new Ce(), Ss = new Hs(), xr = new fn(), Vo = new R(), Dl = new R();
  class ac extends ot {
    constructor(e = new yt(), t = new no()) {
      super(), this.isLine = true, this.type = "Line", this.geometry = e, this.material = t, this.updateMorphTargets();
    }
    copy(e, t) {
      return super.copy(e, t), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
    }
    computeLineDistances() {
      const e = this.geometry;
      if (e.index === null) {
        const t = e.attributes.position, n = [
          0
        ];
        for (let i = 1, r = t.count; i < r; i++) jr.fromBufferAttribute(t, i - 1), Kr.fromBufferAttribute(t, i), n[i] = n[i - 1], n[i] += jr.distanceTo(Kr);
        e.setAttribute("lineDistance", new at(n, 1));
      } else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
      return this;
    }
    raycast(e, t) {
      const n = this.geometry, i = this.matrixWorld, r = e.params.Line.threshold, o = n.drawRange;
      if (n.boundingSphere === null && n.computeBoundingSphere(), xr.copy(n.boundingSphere), xr.applyMatrix4(i), xr.radius += r, e.ray.intersectsSphere(xr) === false) return;
      Ll.copy(i).invert(), Ss.copy(e.ray).applyMatrix4(Ll);
      const a = r / ((this.scale.x + this.scale.y + this.scale.z) / 3), c = a * a, l = this.isLineSegments ? 2 : 1, h = n.index, d = n.attributes.position;
      if (h !== null) {
        const f = Math.max(0, o.start), g = Math.min(h.count, o.start + o.count);
        for (let _ = f, m = g - 1; _ < m; _ += l) {
          const p = h.getX(_), E = h.getX(_ + 1), M = vr(this, e, Ss, c, p, E);
          M && t.push(M);
        }
        if (this.isLineLoop) {
          const _ = h.getX(g - 1), m = h.getX(f), p = vr(this, e, Ss, c, _, m);
          p && t.push(p);
        }
      } else {
        const f = Math.max(0, o.start), g = Math.min(d.count, o.start + o.count);
        for (let _ = f, m = g - 1; _ < m; _ += l) {
          const p = vr(this, e, Ss, c, _, _ + 1);
          p && t.push(p);
        }
        if (this.isLineLoop) {
          const _ = vr(this, e, Ss, c, g - 1, f);
          _ && t.push(_);
        }
      }
    }
    updateMorphTargets() {
      const t = this.geometry.morphAttributes, n = Object.keys(t);
      if (n.length > 0) {
        const i = t[n[0]];
        if (i !== void 0) {
          this.morphTargetInfluences = [], this.morphTargetDictionary = {};
          for (let r = 0, o = i.length; r < o; r++) {
            const a = i[r].name || String(r);
            this.morphTargetInfluences.push(0), this.morphTargetDictionary[a] = r;
          }
        }
      }
    }
  }
  function vr(s, e, t, n, i, r) {
    const o = s.geometry.attributes.position;
    if (jr.fromBufferAttribute(o, i), Kr.fromBufferAttribute(o, r), t.distanceSqToSegment(jr, Kr, Vo, Dl) > n) return;
    Vo.applyMatrix4(s.matrixWorld);
    const c = e.ray.origin.distanceTo(Vo);
    if (!(c < e.near || c > e.far)) return {
      distance: c,
      point: Dl.clone().applyMatrix4(s.matrixWorld),
      index: i,
      face: null,
      faceIndex: null,
      barycoord: null,
      object: s
    };
  }
  const Ul = new R(), Nl = new R();
  class cc extends ac {
    constructor(e, t) {
      super(e, t), this.isLineSegments = true, this.type = "LineSegments";
    }
    computeLineDistances() {
      const e = this.geometry;
      if (e.index === null) {
        const t = e.attributes.position, n = [];
        for (let i = 0, r = t.count; i < r; i += 2) Ul.fromBufferAttribute(t, i), Nl.fromBufferAttribute(t, i + 1), n[i] = i === 0 ? 0 : n[i - 1], n[i + 1] = n[i] + Ul.distanceTo(Nl);
        e.setAttribute("lineDistance", new at(n, 1));
      } else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
      return this;
    }
  }
  class H_ extends ac {
    constructor(e, t) {
      super(e, t), this.isLineLoop = true, this.type = "LineLoop";
    }
  }
  class Gh extends cn {
    constructor(e) {
      super(), this.isPointsMaterial = true, this.type = "PointsMaterial", this.color = new Se(16777215), this.map = null, this.alphaMap = null, this.size = 1, this.sizeAttenuation = true, this.fog = true, this.setValues(e);
    }
    copy(e) {
      return super.copy(e), this.color.copy(e.color), this.map = e.map, this.alphaMap = e.alphaMap, this.size = e.size, this.sizeAttenuation = e.sizeAttenuation, this.fog = e.fog, this;
    }
  }
  const Fl = new Ce(), Ha = new Hs(), yr = new fn(), Mr = new R();
  class V_ extends ot {
    constructor(e = new yt(), t = new Gh()) {
      super(), this.isPoints = true, this.type = "Points", this.geometry = e, this.material = t, this.updateMorphTargets();
    }
    copy(e, t) {
      return super.copy(e, t), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
    }
    raycast(e, t) {
      const n = this.geometry, i = this.matrixWorld, r = e.params.Points.threshold, o = n.drawRange;
      if (n.boundingSphere === null && n.computeBoundingSphere(), yr.copy(n.boundingSphere), yr.applyMatrix4(i), yr.radius += r, e.ray.intersectsSphere(yr) === false) return;
      Fl.copy(i).invert(), Ha.copy(e.ray).applyMatrix4(Fl);
      const a = r / ((this.scale.x + this.scale.y + this.scale.z) / 3), c = a * a, l = n.index, u = n.attributes.position;
      if (l !== null) {
        const d = Math.max(0, o.start), f = Math.min(l.count, o.start + o.count);
        for (let g = d, _ = f; g < _; g++) {
          const m = l.getX(g);
          Mr.fromBufferAttribute(u, m), Ol(Mr, m, c, i, e, t, this);
        }
      } else {
        const d = Math.max(0, o.start), f = Math.min(u.count, o.start + o.count);
        for (let g = d, _ = f; g < _; g++) Mr.fromBufferAttribute(u, g), Ol(Mr, g, c, i, e, t, this);
      }
    }
    updateMorphTargets() {
      const t = this.geometry.morphAttributes, n = Object.keys(t);
      if (n.length > 0) {
        const i = t[n[0]];
        if (i !== void 0) {
          this.morphTargetInfluences = [], this.morphTargetDictionary = {};
          for (let r = 0, o = i.length; r < o; r++) {
            const a = i[r].name || String(r);
            this.morphTargetInfluences.push(0), this.morphTargetDictionary[a] = r;
          }
        }
      }
    }
  }
  function Ol(s, e, t, n, i, r, o) {
    const a = Ha.distanceSqToPoint(s);
    if (a < t) {
      const c = new R();
      Ha.closestPointToPoint(s, c), c.applyMatrix4(n);
      const l = i.ray.origin.distanceTo(c);
      if (l < i.near || l > i.far) return;
      r.push({
        distance: l,
        distanceToRay: Math.sqrt(a),
        point: c,
        index: e,
        face: null,
        faceIndex: null,
        barycoord: null,
        object: o
      });
    }
  }
  class G_ extends mt {
    constructor(e, t, n, i, r, o, a, c, l) {
      super(e, t, n, i, r, o, a, c, l), this.isCanvasTexture = true, this.needsUpdate = true;
    }
  }
  class lc extends yt {
    constructor(e = 1, t = 32, n = 0, i = Math.PI * 2) {
      super(), this.type = "CircleGeometry", this.parameters = {
        radius: e,
        segments: t,
        thetaStart: n,
        thetaLength: i
      }, t = Math.max(3, t);
      const r = [], o = [], a = [], c = [], l = new R(), h = new ye();
      o.push(0, 0, 0), a.push(0, 0, 1), c.push(0.5, 0.5);
      for (let u = 0, d = 3; u <= t; u++, d += 3) {
        const f = n + u / t * i;
        l.x = e * Math.cos(f), l.y = e * Math.sin(f), o.push(l.x, l.y, l.z), a.push(0, 0, 1), h.x = (o[d] / e + 1) / 2, h.y = (o[d + 1] / e + 1) / 2, c.push(h.x, h.y);
      }
      for (let u = 1; u <= t; u++) r.push(u, u + 1, 0);
      this.setIndex(r), this.setAttribute("position", new at(o, 3)), this.setAttribute("normal", new at(a, 3)), this.setAttribute("uv", new at(c, 2));
    }
    copy(e) {
      return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
    }
    static fromJSON(e) {
      return new lc(e.radius, e.segments, e.thetaStart, e.thetaLength);
    }
  }
  class Bs extends yt {
    constructor(e = 1, t = 1, n = 1, i = 32, r = 1, o = false, a = 0, c = Math.PI * 2) {
      super(), this.type = "CylinderGeometry", this.parameters = {
        radiusTop: e,
        radiusBottom: t,
        height: n,
        radialSegments: i,
        heightSegments: r,
        openEnded: o,
        thetaStart: a,
        thetaLength: c
      };
      const l = this;
      i = Math.floor(i), r = Math.floor(r);
      const h = [], u = [], d = [], f = [];
      let g = 0;
      const _ = [], m = n / 2;
      let p = 0;
      E(), o === false && (e > 0 && M(true), t > 0 && M(false)), this.setIndex(h), this.setAttribute("position", new at(u, 3)), this.setAttribute("normal", new at(d, 3)), this.setAttribute("uv", new at(f, 2));
      function E() {
        const b = new R(), I = new R();
        let A = 0;
        const w = (t - e) / n;
        for (let U = 0; U <= r; U++) {
          const j = [], x = U / r, S = x * (t - e) + e;
          for (let k = 0; k <= i; k++) {
            const B = k / i, H = B * c + a, K = Math.sin(H), z = Math.cos(H);
            I.x = S * K, I.y = -x * n + m, I.z = S * z, u.push(I.x, I.y, I.z), b.set(K, w, z).normalize(), d.push(b.x, b.y, b.z), f.push(B, 1 - x), j.push(g++);
          }
          _.push(j);
        }
        for (let U = 0; U < i; U++) for (let j = 0; j < r; j++) {
          const x = _[j][U], S = _[j + 1][U], k = _[j + 1][U + 1], B = _[j][U + 1];
          e > 0 && (h.push(x, S, B), A += 3), t > 0 && (h.push(S, k, B), A += 3);
        }
        l.addGroup(p, A, 0), p += A;
      }
      function M(b) {
        const I = g, A = new ye(), w = new R();
        let U = 0;
        const j = b === true ? e : t, x = b === true ? 1 : -1;
        for (let k = 1; k <= i; k++) u.push(0, m * x, 0), d.push(0, x, 0), f.push(0.5, 0.5), g++;
        const S = g;
        for (let k = 0; k <= i; k++) {
          const H = k / i * c + a, K = Math.cos(H), z = Math.sin(H);
          w.x = j * z, w.y = m * x, w.z = j * K, u.push(w.x, w.y, w.z), d.push(0, x, 0), A.x = K * 0.5 + 0.5, A.y = z * 0.5 * x + 0.5, f.push(A.x, A.y), g++;
        }
        for (let k = 0; k < i; k++) {
          const B = I + k, H = S + k;
          b === true ? h.push(H, H + 1, B) : h.push(H + 1, H, B), U += 3;
        }
        l.addGroup(p, U, b === true ? 1 : 2), p += U;
      }
    }
    copy(e) {
      return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
    }
    static fromJSON(e) {
      return new Bs(e.radiusTop, e.radiusBottom, e.height, e.radialSegments, e.heightSegments, e.openEnded, e.thetaStart, e.thetaLength);
    }
  }
  class hc extends yt {
    constructor(e = 0.5, t = 1, n = 32, i = 1, r = 0, o = Math.PI * 2) {
      super(), this.type = "RingGeometry", this.parameters = {
        innerRadius: e,
        outerRadius: t,
        thetaSegments: n,
        phiSegments: i,
        thetaStart: r,
        thetaLength: o
      }, n = Math.max(3, n), i = Math.max(1, i);
      const a = [], c = [], l = [], h = [];
      let u = e;
      const d = (t - e) / i, f = new R(), g = new ye();
      for (let _ = 0; _ <= i; _++) {
        for (let m = 0; m <= n; m++) {
          const p = r + m / n * o;
          f.x = u * Math.cos(p), f.y = u * Math.sin(p), c.push(f.x, f.y, f.z), l.push(0, 0, 1), g.x = (f.x / t + 1) / 2, g.y = (f.y / t + 1) / 2, h.push(g.x, g.y);
        }
        u += d;
      }
      for (let _ = 0; _ < i; _++) {
        const m = _ * (n + 1);
        for (let p = 0; p < n; p++) {
          const E = p + m, M = E, b = E + n + 1, I = E + n + 2, A = E + 1;
          a.push(M, b, A), a.push(b, I, A);
        }
      }
      this.setIndex(a), this.setAttribute("position", new at(c, 3)), this.setAttribute("normal", new at(l, 3)), this.setAttribute("uv", new at(h, 2));
    }
    copy(e) {
      return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
    }
    static fromJSON(e) {
      return new hc(e.innerRadius, e.outerRadius, e.thetaSegments, e.phiSegments, e.thetaStart, e.thetaLength);
    }
  }
  class uc extends yt {
    constructor(e = 1, t = 32, n = 16, i = 0, r = Math.PI * 2, o = 0, a = Math.PI) {
      super(), this.type = "SphereGeometry", this.parameters = {
        radius: e,
        widthSegments: t,
        heightSegments: n,
        phiStart: i,
        phiLength: r,
        thetaStart: o,
        thetaLength: a
      }, t = Math.max(3, Math.floor(t)), n = Math.max(2, Math.floor(n));
      const c = Math.min(o + a, Math.PI);
      let l = 0;
      const h = [], u = new R(), d = new R(), f = [], g = [], _ = [], m = [];
      for (let p = 0; p <= n; p++) {
        const E = [], M = p / n;
        let b = 0;
        p === 0 && o === 0 ? b = 0.5 / t : p === n && c === Math.PI && (b = -0.5 / t);
        for (let I = 0; I <= t; I++) {
          const A = I / t;
          u.x = -e * Math.cos(i + A * r) * Math.sin(o + M * a), u.y = e * Math.cos(o + M * a), u.z = e * Math.sin(i + A * r) * Math.sin(o + M * a), g.push(u.x, u.y, u.z), d.copy(u).normalize(), _.push(d.x, d.y, d.z), m.push(A + b, 1 - M), E.push(l++);
        }
        h.push(E);
      }
      for (let p = 0; p < n; p++) for (let E = 0; E < t; E++) {
        const M = h[p][E + 1], b = h[p][E], I = h[p + 1][E], A = h[p + 1][E + 1];
        (p !== 0 || o > 0) && f.push(M, b, A), (p !== n - 1 || c < Math.PI) && f.push(b, I, A);
      }
      this.setIndex(f), this.setAttribute("position", new at(g, 3)), this.setAttribute("normal", new at(_, 3)), this.setAttribute("uv", new at(m, 2));
    }
    copy(e) {
      return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
    }
    static fromJSON(e) {
      return new uc(e.radius, e.widthSegments, e.heightSegments, e.phiStart, e.phiLength, e.thetaStart, e.thetaLength);
    }
  }
  class Ln extends cn {
    constructor(e) {
      super(), this.isMeshStandardMaterial = true, this.defines = {
        STANDARD: ""
      }, this.type = "MeshStandardMaterial", this.color = new Se(16777215), this.roughness = 1, this.metalness = 0, this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.emissive = new Se(0), this.emissiveIntensity = 1, this.emissiveMap = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = yh, this.normalScale = new ye(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.roughnessMap = null, this.metalnessMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new un(), this.envMapIntensity = 1, this.wireframe = false, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.flatShading = false, this.fog = true, this.setValues(e);
    }
    copy(e) {
      return super.copy(e), this.defines = {
        STANDARD: ""
      }, this.color.copy(e.color), this.roughness = e.roughness, this.metalness = e.metalness, this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.emissive.copy(e.emissive), this.emissiveMap = e.emissiveMap, this.emissiveIntensity = e.emissiveIntensity, this.bumpMap = e.bumpMap, this.bumpScale = e.bumpScale, this.normalMap = e.normalMap, this.normalMapType = e.normalMapType, this.normalScale.copy(e.normalScale), this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.roughnessMap = e.roughnessMap, this.metalnessMap = e.metalnessMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.envMapRotation.copy(e.envMapRotation), this.envMapIntensity = e.envMapIntensity, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.flatShading = e.flatShading, this.fog = e.fog, this;
    }
  }
  class pn extends Ln {
    constructor(e) {
      super(), this.isMeshPhysicalMaterial = true, this.defines = {
        STANDARD: "",
        PHYSICAL: ""
      }, this.type = "MeshPhysicalMaterial", this.anisotropyRotation = 0, this.anisotropyMap = null, this.clearcoatMap = null, this.clearcoatRoughness = 0, this.clearcoatRoughnessMap = null, this.clearcoatNormalScale = new ye(1, 1), this.clearcoatNormalMap = null, this.ior = 1.5, Object.defineProperty(this, "reflectivity", {
        get: function() {
          return St(2.5 * (this.ior - 1) / (this.ior + 1), 0, 1);
        },
        set: function(t) {
          this.ior = (1 + 0.4 * t) / (1 - 0.4 * t);
        }
      }), this.iridescenceMap = null, this.iridescenceIOR = 1.3, this.iridescenceThicknessRange = [
        100,
        400
      ], this.iridescenceThicknessMap = null, this.sheenColor = new Se(0), this.sheenColorMap = null, this.sheenRoughness = 1, this.sheenRoughnessMap = null, this.transmissionMap = null, this.thickness = 0, this.thicknessMap = null, this.attenuationDistance = 1 / 0, this.attenuationColor = new Se(1, 1, 1), this.specularIntensity = 1, this.specularIntensityMap = null, this.specularColor = new Se(1, 1, 1), this.specularColorMap = null, this._anisotropy = 0, this._clearcoat = 0, this._dispersion = 0, this._iridescence = 0, this._sheen = 0, this._transmission = 0, this.setValues(e);
    }
    get anisotropy() {
      return this._anisotropy;
    }
    set anisotropy(e) {
      this._anisotropy > 0 != e > 0 && this.version++, this._anisotropy = e;
    }
    get clearcoat() {
      return this._clearcoat;
    }
    set clearcoat(e) {
      this._clearcoat > 0 != e > 0 && this.version++, this._clearcoat = e;
    }
    get iridescence() {
      return this._iridescence;
    }
    set iridescence(e) {
      this._iridescence > 0 != e > 0 && this.version++, this._iridescence = e;
    }
    get dispersion() {
      return this._dispersion;
    }
    set dispersion(e) {
      this._dispersion > 0 != e > 0 && this.version++, this._dispersion = e;
    }
    get sheen() {
      return this._sheen;
    }
    set sheen(e) {
      this._sheen > 0 != e > 0 && this.version++, this._sheen = e;
    }
    get transmission() {
      return this._transmission;
    }
    set transmission(e) {
      this._transmission > 0 != e > 0 && this.version++, this._transmission = e;
    }
    copy(e) {
      return super.copy(e), this.defines = {
        STANDARD: "",
        PHYSICAL: ""
      }, this.anisotropy = e.anisotropy, this.anisotropyRotation = e.anisotropyRotation, this.anisotropyMap = e.anisotropyMap, this.clearcoat = e.clearcoat, this.clearcoatMap = e.clearcoatMap, this.clearcoatRoughness = e.clearcoatRoughness, this.clearcoatRoughnessMap = e.clearcoatRoughnessMap, this.clearcoatNormalMap = e.clearcoatNormalMap, this.clearcoatNormalScale.copy(e.clearcoatNormalScale), this.dispersion = e.dispersion, this.ior = e.ior, this.iridescence = e.iridescence, this.iridescenceMap = e.iridescenceMap, this.iridescenceIOR = e.iridescenceIOR, this.iridescenceThicknessRange = [
        ...e.iridescenceThicknessRange
      ], this.iridescenceThicknessMap = e.iridescenceThicknessMap, this.sheen = e.sheen, this.sheenColor.copy(e.sheenColor), this.sheenColorMap = e.sheenColorMap, this.sheenRoughness = e.sheenRoughness, this.sheenRoughnessMap = e.sheenRoughnessMap, this.transmission = e.transmission, this.transmissionMap = e.transmissionMap, this.thickness = e.thickness, this.thicknessMap = e.thicknessMap, this.attenuationDistance = e.attenuationDistance, this.attenuationColor.copy(e.attenuationColor), this.specularIntensity = e.specularIntensity, this.specularIntensityMap = e.specularIntensityMap, this.specularColor.copy(e.specularColor), this.specularColorMap = e.specularColorMap, this;
    }
  }
  function Sr(s, e, t) {
    return !s || !t && s.constructor === e ? s : typeof e.BYTES_PER_ELEMENT == "number" ? new e(s) : Array.prototype.slice.call(s);
  }
  function W_(s) {
    return ArrayBuffer.isView(s) && !(s instanceof DataView);
  }
  function X_(s) {
    function e(i, r) {
      return s[i] - s[r];
    }
    const t = s.length, n = new Array(t);
    for (let i = 0; i !== t; ++i) n[i] = i;
    return n.sort(e), n;
  }
  function Bl(s, e, t) {
    const n = s.length, i = new s.constructor(n);
    for (let r = 0, o = 0; o !== n; ++r) {
      const a = t[r] * e;
      for (let c = 0; c !== e; ++c) i[o++] = s[a + c];
    }
    return i;
  }
  function Wh(s, e, t, n) {
    let i = 1, r = s[0];
    for (; r !== void 0 && r[n] === void 0; ) r = s[i++];
    if (r === void 0) return;
    let o = r[n];
    if (o !== void 0) if (Array.isArray(o)) do
      o = r[n], o !== void 0 && (e.push(r.time), t.push.apply(t, o)), r = s[i++];
    while (r !== void 0);
    else if (o.toArray !== void 0) do
      o = r[n], o !== void 0 && (e.push(r.time), o.toArray(t, t.length)), r = s[i++];
    while (r !== void 0);
    else do
      o = r[n], o !== void 0 && (e.push(r.time), t.push(o)), r = s[i++];
    while (r !== void 0);
  }
  class Gs {
    constructor(e, t, n, i) {
      this.parameterPositions = e, this._cachedIndex = 0, this.resultBuffer = i !== void 0 ? i : new t.constructor(n), this.sampleValues = t, this.valueSize = n, this.settings = null, this.DefaultSettings_ = {};
    }
    evaluate(e) {
      const t = this.parameterPositions;
      let n = this._cachedIndex, i = t[n], r = t[n - 1];
      e: {
        t: {
          let o;
          n: {
            i: if (!(e < i)) {
              for (let a = n + 2; ; ) {
                if (i === void 0) {
                  if (e < r) break i;
                  return n = t.length, this._cachedIndex = n, this.copySampleValue_(n - 1);
                }
                if (n === a) break;
                if (r = i, i = t[++n], e < i) break t;
              }
              o = t.length;
              break n;
            }
            if (!(e >= r)) {
              const a = t[1];
              e < a && (n = 2, r = a);
              for (let c = n - 2; ; ) {
                if (r === void 0) return this._cachedIndex = 0, this.copySampleValue_(0);
                if (n === c) break;
                if (i = r, r = t[--n - 1], e >= r) break t;
              }
              o = n, n = 0;
              break n;
            }
            break e;
          }
          for (; n < o; ) {
            const a = n + o >>> 1;
            e < t[a] ? o = a : n = a + 1;
          }
          if (i = t[n], r = t[n - 1], r === void 0) return this._cachedIndex = 0, this.copySampleValue_(0);
          if (i === void 0) return n = t.length, this._cachedIndex = n, this.copySampleValue_(n - 1);
        }
        this._cachedIndex = n, this.intervalChanged_(n, r, i);
      }
      return this.interpolate_(n, r, e, i);
    }
    getSettings_() {
      return this.settings || this.DefaultSettings_;
    }
    copySampleValue_(e) {
      const t = this.resultBuffer, n = this.sampleValues, i = this.valueSize, r = e * i;
      for (let o = 0; o !== i; ++o) t[o] = n[r + o];
      return t;
    }
    interpolate_() {
      throw new Error("call to abstract method");
    }
    intervalChanged_() {
    }
  }
  class Y_ extends Gs {
    constructor(e, t, n, i) {
      super(e, t, n, i), this._weightPrev = -0, this._offsetPrev = -0, this._weightNext = -0, this._offsetNext = -0, this.DefaultSettings_ = {
        endingStart: ki,
        endingEnd: ki
      };
    }
    intervalChanged_(e, t, n) {
      const i = this.parameterPositions;
      let r = e - 2, o = e + 1, a = i[r], c = i[o];
      if (a === void 0) switch (this.getSettings_().endingStart) {
        case zi:
          r = e, a = 2 * t - n;
          break;
        case Gr:
          r = i.length - 2, a = t + i[r] - i[r + 1];
          break;
        default:
          r = e, a = n;
      }
      if (c === void 0) switch (this.getSettings_().endingEnd) {
        case zi:
          o = e, c = 2 * n - t;
          break;
        case Gr:
          o = 1, c = n + i[1] - i[0];
          break;
        default:
          o = e - 1, c = t;
      }
      const l = (n - t) * 0.5, h = this.valueSize;
      this._weightPrev = l / (t - a), this._weightNext = l / (c - n), this._offsetPrev = r * h, this._offsetNext = o * h;
    }
    interpolate_(e, t, n, i) {
      const r = this.resultBuffer, o = this.sampleValues, a = this.valueSize, c = e * a, l = c - a, h = this._offsetPrev, u = this._offsetNext, d = this._weightPrev, f = this._weightNext, g = (n - t) / (i - t), _ = g * g, m = _ * g, p = -d * m + 2 * d * _ - d * g, E = (1 + d) * m + (-1.5 - 2 * d) * _ + (-0.5 + d) * g + 1, M = (-1 - f) * m + (1.5 + f) * _ + 0.5 * g, b = f * m - f * _;
      for (let I = 0; I !== a; ++I) r[I] = p * o[h + I] + E * o[l + I] + M * o[c + I] + b * o[u + I];
      return r;
    }
  }
  class Xh extends Gs {
    constructor(e, t, n, i) {
      super(e, t, n, i);
    }
    interpolate_(e, t, n, i) {
      const r = this.resultBuffer, o = this.sampleValues, a = this.valueSize, c = e * a, l = c - a, h = (n - t) / (i - t), u = 1 - h;
      for (let d = 0; d !== a; ++d) r[d] = o[l + d] * u + o[c + d] * h;
      return r;
    }
  }
  class q_ extends Gs {
    constructor(e, t, n, i) {
      super(e, t, n, i);
    }
    interpolate_(e) {
      return this.copySampleValue_(e - 1);
    }
  }
  class mn {
    constructor(e, t, n, i) {
      if (e === void 0) throw new Error("THREE.KeyframeTrack: track name is undefined");
      if (t === void 0 || t.length === 0) throw new Error("THREE.KeyframeTrack: no keyframes in track named " + e);
      this.name = e, this.times = Sr(t, this.TimeBufferType), this.values = Sr(n, this.ValueBufferType), this.setInterpolation(i || this.DefaultInterpolation);
    }
    static toJSON(e) {
      const t = e.constructor;
      let n;
      if (t.toJSON !== this.toJSON) n = t.toJSON(e);
      else {
        n = {
          name: e.name,
          times: Sr(e.times, Array),
          values: Sr(e.values, Array)
        };
        const i = e.getInterpolation();
        i !== e.DefaultInterpolation && (n.interpolation = i);
      }
      return n.type = e.ValueTypeName, n;
    }
    InterpolantFactoryMethodDiscrete(e) {
      return new q_(this.times, this.values, this.getValueSize(), e);
    }
    InterpolantFactoryMethodLinear(e) {
      return new Xh(this.times, this.values, this.getValueSize(), e);
    }
    InterpolantFactoryMethodSmooth(e) {
      return new Y_(this.times, this.values, this.getValueSize(), e);
    }
    setInterpolation(e) {
      let t;
      switch (e) {
        case Us:
          t = this.InterpolantFactoryMethodDiscrete;
          break;
        case Ns:
          t = this.InterpolantFactoryMethodLinear;
          break;
        case lo:
          t = this.InterpolantFactoryMethodSmooth;
          break;
      }
      if (t === void 0) {
        const n = "unsupported interpolation for " + this.ValueTypeName + " keyframe track named " + this.name;
        if (this.createInterpolant === void 0) if (e !== this.DefaultInterpolation) this.setInterpolation(this.DefaultInterpolation);
        else throw new Error(n);
        return console.warn("THREE.KeyframeTrack:", n), this;
      }
      return this.createInterpolant = t, this;
    }
    getInterpolation() {
      switch (this.createInterpolant) {
        case this.InterpolantFactoryMethodDiscrete:
          return Us;
        case this.InterpolantFactoryMethodLinear:
          return Ns;
        case this.InterpolantFactoryMethodSmooth:
          return lo;
      }
    }
    getValueSize() {
      return this.values.length / this.times.length;
    }
    shift(e) {
      if (e !== 0) {
        const t = this.times;
        for (let n = 0, i = t.length; n !== i; ++n) t[n] += e;
      }
      return this;
    }
    scale(e) {
      if (e !== 1) {
        const t = this.times;
        for (let n = 0, i = t.length; n !== i; ++n) t[n] *= e;
      }
      return this;
    }
    trim(e, t) {
      const n = this.times, i = n.length;
      let r = 0, o = i - 1;
      for (; r !== i && n[r] < e; ) ++r;
      for (; o !== -1 && n[o] > t; ) --o;
      if (++o, r !== 0 || o !== i) {
        r >= o && (o = Math.max(o, 1), r = o - 1);
        const a = this.getValueSize();
        this.times = n.slice(r, o), this.values = this.values.slice(r * a, o * a);
      }
      return this;
    }
    validate() {
      let e = true;
      const t = this.getValueSize();
      t - Math.floor(t) !== 0 && (console.error("THREE.KeyframeTrack: Invalid value size in track.", this), e = false);
      const n = this.times, i = this.values, r = n.length;
      r === 0 && (console.error("THREE.KeyframeTrack: Track is empty.", this), e = false);
      let o = null;
      for (let a = 0; a !== r; a++) {
        const c = n[a];
        if (typeof c == "number" && isNaN(c)) {
          console.error("THREE.KeyframeTrack: Time is not a valid number.", this, a, c), e = false;
          break;
        }
        if (o !== null && o > c) {
          console.error("THREE.KeyframeTrack: Out of order keys.", this, a, c, o), e = false;
          break;
        }
        o = c;
      }
      if (i !== void 0 && W_(i)) for (let a = 0, c = i.length; a !== c; ++a) {
        const l = i[a];
        if (isNaN(l)) {
          console.error("THREE.KeyframeTrack: Value is not a valid number.", this, a, l), e = false;
          break;
        }
      }
      return e;
    }
    optimize() {
      const e = this.times.slice(), t = this.values.slice(), n = this.getValueSize(), i = this.getInterpolation() === lo, r = e.length - 1;
      let o = 1;
      for (let a = 1; a < r; ++a) {
        let c = false;
        const l = e[a], h = e[a + 1];
        if (l !== h && (a !== 1 || l !== e[0])) if (i) c = true;
        else {
          const u = a * n, d = u - n, f = u + n;
          for (let g = 0; g !== n; ++g) {
            const _ = t[u + g];
            if (_ !== t[d + g] || _ !== t[f + g]) {
              c = true;
              break;
            }
          }
        }
        if (c) {
          if (a !== o) {
            e[o] = e[a];
            const u = a * n, d = o * n;
            for (let f = 0; f !== n; ++f) t[d + f] = t[u + f];
          }
          ++o;
        }
      }
      if (r > 0) {
        e[o] = e[r];
        for (let a = r * n, c = o * n, l = 0; l !== n; ++l) t[c + l] = t[a + l];
        ++o;
      }
      return o !== e.length ? (this.times = e.slice(0, o), this.values = t.slice(0, o * n)) : (this.times = e, this.values = t), this;
    }
    clone() {
      const e = this.times.slice(), t = this.values.slice(), n = this.constructor, i = new n(this.name, e, t);
      return i.createInterpolant = this.createInterpolant, i;
    }
  }
  mn.prototype.TimeBufferType = Float32Array;
  mn.prototype.ValueBufferType = Float32Array;
  mn.prototype.DefaultInterpolation = Ns;
  class cs extends mn {
    constructor(e, t, n) {
      super(e, t, n);
    }
  }
  cs.prototype.ValueTypeName = "bool";
  cs.prototype.ValueBufferType = Array;
  cs.prototype.DefaultInterpolation = Us;
  cs.prototype.InterpolantFactoryMethodLinear = void 0;
  cs.prototype.InterpolantFactoryMethodSmooth = void 0;
  class Yh extends mn {
  }
  Yh.prototype.ValueTypeName = "color";
  class ss extends mn {
  }
  ss.prototype.ValueTypeName = "number";
  class j_ extends Gs {
    constructor(e, t, n, i) {
      super(e, t, n, i);
    }
    interpolate_(e, t, n, i) {
      const r = this.resultBuffer, o = this.sampleValues, a = this.valueSize, c = (n - t) / (i - t);
      let l = e * a;
      for (let h = l + a; l !== h; l += 4) Ht.slerpFlat(r, 0, o, l - a, o, l, c);
      return r;
    }
  }
  class rs extends mn {
    InterpolantFactoryMethodLinear(e) {
      return new j_(this.times, this.values, this.getValueSize(), e);
    }
  }
  rs.prototype.ValueTypeName = "quaternion";
  rs.prototype.InterpolantFactoryMethodSmooth = void 0;
  class ls extends mn {
    constructor(e, t, n) {
      super(e, t, n);
    }
  }
  ls.prototype.ValueTypeName = "string";
  ls.prototype.ValueBufferType = Array;
  ls.prototype.DefaultInterpolation = Us;
  ls.prototype.InterpolantFactoryMethodLinear = void 0;
  ls.prototype.InterpolantFactoryMethodSmooth = void 0;
  class os extends mn {
  }
  os.prototype.ValueTypeName = "vector";
  class ks {
    constructor(e = "", t = -1, n = [], i = ec) {
      this.name = e, this.tracks = n, this.duration = t, this.blendMode = i, this.uuid = an(), this.duration < 0 && this.resetDuration();
    }
    static parse(e) {
      const t = [], n = e.tracks, i = 1 / (e.fps || 1);
      for (let o = 0, a = n.length; o !== a; ++o) t.push($_(n[o]).scale(i));
      const r = new this(e.name, e.duration, t, e.blendMode);
      return r.uuid = e.uuid, r;
    }
    static toJSON(e) {
      const t = [], n = e.tracks, i = {
        name: e.name,
        duration: e.duration,
        tracks: t,
        uuid: e.uuid,
        blendMode: e.blendMode
      };
      for (let r = 0, o = n.length; r !== o; ++r) t.push(mn.toJSON(n[r]));
      return i;
    }
    static CreateFromMorphTargetSequence(e, t, n, i) {
      const r = t.length, o = [];
      for (let a = 0; a < r; a++) {
        let c = [], l = [];
        c.push((a + r - 1) % r, a, (a + 1) % r), l.push(0, 1, 0);
        const h = X_(c);
        c = Bl(c, 1, h), l = Bl(l, 1, h), !i && c[0] === 0 && (c.push(r), l.push(l[0])), o.push(new ss(".morphTargetInfluences[" + t[a].name + "]", c, l).scale(1 / n));
      }
      return new this(e, -1, o);
    }
    static findByName(e, t) {
      let n = e;
      if (!Array.isArray(e)) {
        const i = e;
        n = i.geometry && i.geometry.animations || i.animations;
      }
      for (let i = 0; i < n.length; i++) if (n[i].name === t) return n[i];
      return null;
    }
    static CreateClipsFromMorphTargetSequences(e, t, n) {
      const i = {}, r = /^([\w-]*?)([\d]+)$/;
      for (let a = 0, c = e.length; a < c; a++) {
        const l = e[a], h = l.name.match(r);
        if (h && h.length > 1) {
          const u = h[1];
          let d = i[u];
          d || (i[u] = d = []), d.push(l);
        }
      }
      const o = [];
      for (const a in i) o.push(this.CreateFromMorphTargetSequence(a, i[a], t, n));
      return o;
    }
    static parseAnimation(e, t) {
      if (!e) return console.error("THREE.AnimationClip: No animation in JSONLoader data."), null;
      const n = function(u, d, f, g, _) {
        if (f.length !== 0) {
          const m = [], p = [];
          Wh(f, m, p, g), m.length !== 0 && _.push(new u(d, m, p));
        }
      }, i = [], r = e.name || "default", o = e.fps || 30, a = e.blendMode;
      let c = e.length || -1;
      const l = e.hierarchy || [];
      for (let u = 0; u < l.length; u++) {
        const d = l[u].keys;
        if (!(!d || d.length === 0)) if (d[0].morphTargets) {
          const f = {};
          let g;
          for (g = 0; g < d.length; g++) if (d[g].morphTargets) for (let _ = 0; _ < d[g].morphTargets.length; _++) f[d[g].morphTargets[_]] = -1;
          for (const _ in f) {
            const m = [], p = [];
            for (let E = 0; E !== d[g].morphTargets.length; ++E) {
              const M = d[g];
              m.push(M.time), p.push(M.morphTarget === _ ? 1 : 0);
            }
            i.push(new ss(".morphTargetInfluence[" + _ + "]", m, p));
          }
          c = f.length * o;
        } else {
          const f = ".bones[" + t[u].name + "]";
          n(os, f + ".position", d, "pos", i), n(rs, f + ".quaternion", d, "rot", i), n(os, f + ".scale", d, "scl", i);
        }
      }
      return i.length === 0 ? null : new this(r, c, i, a);
    }
    resetDuration() {
      const e = this.tracks;
      let t = 0;
      for (let n = 0, i = e.length; n !== i; ++n) {
        const r = this.tracks[n];
        t = Math.max(t, r.times[r.times.length - 1]);
      }
      return this.duration = t, this;
    }
    trim() {
      for (let e = 0; e < this.tracks.length; e++) this.tracks[e].trim(0, this.duration);
      return this;
    }
    validate() {
      let e = true;
      for (let t = 0; t < this.tracks.length; t++) e = e && this.tracks[t].validate();
      return e;
    }
    optimize() {
      for (let e = 0; e < this.tracks.length; e++) this.tracks[e].optimize();
      return this;
    }
    clone() {
      const e = [];
      for (let t = 0; t < this.tracks.length; t++) e.push(this.tracks[t].clone());
      return new this.constructor(this.name, this.duration, e, this.blendMode);
    }
    toJSON() {
      return this.constructor.toJSON(this);
    }
  }
  function K_(s) {
    switch (s.toLowerCase()) {
      case "scalar":
      case "double":
      case "float":
      case "number":
      case "integer":
        return ss;
      case "vector":
      case "vector2":
      case "vector3":
      case "vector4":
        return os;
      case "color":
        return Yh;
      case "quaternion":
        return rs;
      case "bool":
      case "boolean":
        return cs;
      case "string":
        return ls;
    }
    throw new Error("THREE.KeyframeTrack: Unsupported typeName: " + s);
  }
  function $_(s) {
    if (s.type === void 0) throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");
    const e = K_(s.type);
    if (s.times === void 0) {
      const t = [], n = [];
      Wh(s.keys, t, n, "value"), s.times = t, s.values = n;
    }
    return e.parse !== void 0 ? e.parse(s) : new e(s.name, s.times, s.values, s.interpolation);
  }
  const Yn = {
    enabled: false,
    files: {},
    add: function(s, e) {
      this.enabled !== false && (this.files[s] = e);
    },
    get: function(s) {
      if (this.enabled !== false) return this.files[s];
    },
    remove: function(s) {
      delete this.files[s];
    },
    clear: function() {
      this.files = {};
    }
  };
  class Z_ {
    constructor(e, t, n) {
      const i = this;
      let r = false, o = 0, a = 0, c;
      const l = [];
      this.onStart = void 0, this.onLoad = e, this.onProgress = t, this.onError = n, this.itemStart = function(h) {
        a++, r === false && i.onStart !== void 0 && i.onStart(h, o, a), r = true;
      }, this.itemEnd = function(h) {
        o++, i.onProgress !== void 0 && i.onProgress(h, o, a), o === a && (r = false, i.onLoad !== void 0 && i.onLoad());
      }, this.itemError = function(h) {
        i.onError !== void 0 && i.onError(h);
      }, this.resolveURL = function(h) {
        return c ? c(h) : h;
      }, this.setURLModifier = function(h) {
        return c = h, this;
      }, this.addHandler = function(h, u) {
        return l.push(h, u), this;
      }, this.removeHandler = function(h) {
        const u = l.indexOf(h);
        return u !== -1 && l.splice(u, 2), this;
      }, this.getHandler = function(h) {
        for (let u = 0, d = l.length; u < d; u += 2) {
          const f = l[u], g = l[u + 1];
          if (f.global && (f.lastIndex = 0), f.test(h)) return g;
        }
        return null;
      };
    }
  }
  const J_ = new Z_();
  class hs {
    constructor(e) {
      this.manager = e !== void 0 ? e : J_, this.crossOrigin = "anonymous", this.withCredentials = false, this.path = "", this.resourcePath = "", this.requestHeader = {};
    }
    load() {
    }
    loadAsync(e, t) {
      const n = this;
      return new Promise(function(i, r) {
        n.load(e, i, t, r);
      });
    }
    parse() {
    }
    setCrossOrigin(e) {
      return this.crossOrigin = e, this;
    }
    setWithCredentials(e) {
      return this.withCredentials = e, this;
    }
    setPath(e) {
      return this.path = e, this;
    }
    setResourcePath(e) {
      return this.resourcePath = e, this;
    }
    setRequestHeader(e) {
      return this.requestHeader = e, this;
    }
  }
  hs.DEFAULT_MATERIAL_NAME = "__DEFAULT";
  const Sn = {};
  class Q_ extends Error {
    constructor(e, t) {
      super(e), this.response = t;
    }
  }
  class qh extends hs {
    constructor(e) {
      super(e);
    }
    load(e, t, n, i) {
      e === void 0 && (e = ""), this.path !== void 0 && (e = this.path + e), e = this.manager.resolveURL(e);
      const r = Yn.get(e);
      if (r !== void 0) return this.manager.itemStart(e), setTimeout(() => {
        t && t(r), this.manager.itemEnd(e);
      }, 0), r;
      if (Sn[e] !== void 0) {
        Sn[e].push({
          onLoad: t,
          onProgress: n,
          onError: i
        });
        return;
      }
      Sn[e] = [], Sn[e].push({
        onLoad: t,
        onProgress: n,
        onError: i
      });
      const o = new Request(e, {
        headers: new Headers(this.requestHeader),
        credentials: this.withCredentials ? "include" : "same-origin"
      }), a = this.mimeType, c = this.responseType;
      fetch(o).then((l) => {
        if (l.status === 200 || l.status === 0) {
          if (l.status === 0 && console.warn("THREE.FileLoader: HTTP Status 0 received."), typeof ReadableStream > "u" || l.body === void 0 || l.body.getReader === void 0) return l;
          const h = Sn[e], u = l.body.getReader(), d = l.headers.get("X-File-Size") || l.headers.get("Content-Length"), f = d ? parseInt(d) : 0, g = f !== 0;
          let _ = 0;
          const m = new ReadableStream({
            start(p) {
              E();
              function E() {
                u.read().then(({ done: M, value: b }) => {
                  if (M) p.close();
                  else {
                    _ += b.byteLength;
                    const I = new ProgressEvent("progress", {
                      lengthComputable: g,
                      loaded: _,
                      total: f
                    });
                    for (let A = 0, w = h.length; A < w; A++) {
                      const U = h[A];
                      U.onProgress && U.onProgress(I);
                    }
                    p.enqueue(b), E();
                  }
                }, (M) => {
                  p.error(M);
                });
              }
            }
          });
          return new Response(m);
        } else throw new Q_(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`, l);
      }).then((l) => {
        switch (c) {
          case "arraybuffer":
            return l.arrayBuffer();
          case "blob":
            return l.blob();
          case "document":
            return l.text().then((h) => new DOMParser().parseFromString(h, a));
          case "json":
            return l.json();
          default:
            if (a === void 0) return l.text();
            {
              const u = /charset="?([^;"\s]*)"?/i.exec(a), d = u && u[1] ? u[1].toLowerCase() : void 0, f = new TextDecoder(d);
              return l.arrayBuffer().then((g) => f.decode(g));
            }
        }
      }).then((l) => {
        Yn.add(e, l);
        const h = Sn[e];
        delete Sn[e];
        for (let u = 0, d = h.length; u < d; u++) {
          const f = h[u];
          f.onLoad && f.onLoad(l);
        }
      }).catch((l) => {
        const h = Sn[e];
        if (h === void 0) throw this.manager.itemError(e), l;
        delete Sn[e];
        for (let u = 0, d = h.length; u < d; u++) {
          const f = h[u];
          f.onError && f.onError(l);
        }
        this.manager.itemError(e);
      }).finally(() => {
        this.manager.itemEnd(e);
      }), this.manager.itemStart(e);
    }
    setResponseType(e) {
      return this.responseType = e, this;
    }
    setMimeType(e) {
      return this.mimeType = e, this;
    }
  }
  class e0 extends hs {
    constructor(e) {
      super(e);
    }
    load(e, t, n, i) {
      this.path !== void 0 && (e = this.path + e), e = this.manager.resolveURL(e);
      const r = this, o = Yn.get(e);
      if (o !== void 0) return r.manager.itemStart(e), setTimeout(function() {
        t && t(o), r.manager.itemEnd(e);
      }, 0), o;
      const a = Fs("img");
      function c() {
        h(), Yn.add(e, this), t && t(this), r.manager.itemEnd(e);
      }
      function l(u) {
        h(), i && i(u), r.manager.itemError(e), r.manager.itemEnd(e);
      }
      function h() {
        a.removeEventListener("load", c, false), a.removeEventListener("error", l, false);
      }
      return a.addEventListener("load", c, false), a.addEventListener("error", l, false), e.slice(0, 5) !== "data:" && this.crossOrigin !== void 0 && (a.crossOrigin = this.crossOrigin), r.manager.itemStart(e), a.src = e, a;
    }
  }
  class t0 extends hs {
    constructor(e) {
      super(e);
    }
    load(e, t, n, i) {
      const r = new mt(), o = new e0(this.manager);
      return o.setCrossOrigin(this.crossOrigin), o.setPath(this.path), o.load(e, function(a) {
        r.image = a, r.needsUpdate = true, t !== void 0 && t(r);
      }, n, i), r;
    }
  }
  class io extends ot {
    constructor(e, t = 1) {
      super(), this.isLight = true, this.type = "Light", this.color = new Se(e), this.intensity = t;
    }
    dispose() {
    }
    copy(e, t) {
      return super.copy(e, t), this.color.copy(e.color), this.intensity = e.intensity, this;
    }
    toJSON(e) {
      const t = super.toJSON(e);
      return t.object.color = this.color.getHex(), t.object.intensity = this.intensity, this.groundColor !== void 0 && (t.object.groundColor = this.groundColor.getHex()), this.distance !== void 0 && (t.object.distance = this.distance), this.angle !== void 0 && (t.object.angle = this.angle), this.decay !== void 0 && (t.object.decay = this.decay), this.penumbra !== void 0 && (t.object.penumbra = this.penumbra), this.shadow !== void 0 && (t.object.shadow = this.shadow.toJSON()), this.target !== void 0 && (t.object.target = this.target.uuid), t;
    }
  }
  const Go = new Ce(), kl = new R(), zl = new R();
  class dc {
    constructor(e) {
      this.camera = e, this.intensity = 1, this.bias = 0, this.normalBias = 0, this.radius = 1, this.blurSamples = 8, this.mapSize = new ye(512, 512), this.map = null, this.mapPass = null, this.matrix = new Ce(), this.autoUpdate = true, this.needsUpdate = false, this._frustum = new ic(), this._frameExtents = new ye(1, 1), this._viewportCount = 1, this._viewports = [
        new Ye(0, 0, 1, 1)
      ];
    }
    getViewportCount() {
      return this._viewportCount;
    }
    getFrustum() {
      return this._frustum;
    }
    updateMatrices(e) {
      const t = this.camera, n = this.matrix;
      kl.setFromMatrixPosition(e.matrixWorld), t.position.copy(kl), zl.setFromMatrixPosition(e.target.matrixWorld), t.lookAt(zl), t.updateMatrixWorld(), Go.multiplyMatrices(t.projectionMatrix, t.matrixWorldInverse), this._frustum.setFromProjectionMatrix(Go), n.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1), n.multiply(Go);
    }
    getViewport(e) {
      return this._viewports[e];
    }
    getFrameExtents() {
      return this._frameExtents;
    }
    dispose() {
      this.map && this.map.dispose(), this.mapPass && this.mapPass.dispose();
    }
    copy(e) {
      return this.camera = e.camera.clone(), this.intensity = e.intensity, this.bias = e.bias, this.radius = e.radius, this.mapSize.copy(e.mapSize), this;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    toJSON() {
      const e = {};
      return this.intensity !== 1 && (e.intensity = this.intensity), this.bias !== 0 && (e.bias = this.bias), this.normalBias !== 0 && (e.normalBias = this.normalBias), this.radius !== 1 && (e.radius = this.radius), (this.mapSize.x !== 512 || this.mapSize.y !== 512) && (e.mapSize = this.mapSize.toArray()), e.camera = this.camera.toJSON(false).object, delete e.camera.matrix, e;
    }
  }
  class n0 extends dc {
    constructor() {
      super(new Ct(50, 1, 0.5, 500)), this.isSpotLightShadow = true, this.focus = 1;
    }
    updateMatrices(e) {
      const t = this.camera, n = ns * 2 * e.angle * this.focus, i = this.mapSize.width / this.mapSize.height, r = e.distance || t.far;
      (n !== t.fov || i !== t.aspect || r !== t.far) && (t.fov = n, t.aspect = i, t.far = r, t.updateProjectionMatrix()), super.updateMatrices(e);
    }
    copy(e) {
      return super.copy(e), this.focus = e.focus, this;
    }
  }
  class i0 extends io {
    constructor(e, t, n = 0, i = Math.PI / 3, r = 0, o = 2) {
      super(e, t), this.isSpotLight = true, this.type = "SpotLight", this.position.copy(ot.DEFAULT_UP), this.updateMatrix(), this.target = new ot(), this.distance = n, this.angle = i, this.penumbra = r, this.decay = o, this.map = null, this.shadow = new n0();
    }
    get power() {
      return this.intensity * Math.PI;
    }
    set power(e) {
      this.intensity = e / Math.PI;
    }
    dispose() {
      this.shadow.dispose();
    }
    copy(e, t) {
      return super.copy(e, t), this.distance = e.distance, this.angle = e.angle, this.penumbra = e.penumbra, this.decay = e.decay, this.target = e.target.clone(), this.shadow = e.shadow.clone(), this;
    }
  }
  const Hl = new Ce(), Es = new R(), Wo = new R();
  class s0 extends dc {
    constructor() {
      super(new Ct(90, 1, 0.5, 500)), this.isPointLightShadow = true, this._frameExtents = new ye(4, 2), this._viewportCount = 6, this._viewports = [
        new Ye(2, 1, 1, 1),
        new Ye(0, 1, 1, 1),
        new Ye(3, 1, 1, 1),
        new Ye(1, 1, 1, 1),
        new Ye(3, 0, 1, 1),
        new Ye(1, 0, 1, 1)
      ], this._cubeDirections = [
        new R(1, 0, 0),
        new R(-1, 0, 0),
        new R(0, 0, 1),
        new R(0, 0, -1),
        new R(0, 1, 0),
        new R(0, -1, 0)
      ], this._cubeUps = [
        new R(0, 1, 0),
        new R(0, 1, 0),
        new R(0, 1, 0),
        new R(0, 1, 0),
        new R(0, 0, 1),
        new R(0, 0, -1)
      ];
    }
    updateMatrices(e, t = 0) {
      const n = this.camera, i = this.matrix, r = e.distance || n.far;
      r !== n.far && (n.far = r, n.updateProjectionMatrix()), Es.setFromMatrixPosition(e.matrixWorld), n.position.copy(Es), Wo.copy(n.position), Wo.add(this._cubeDirections[t]), n.up.copy(this._cubeUps[t]), n.lookAt(Wo), n.updateMatrixWorld(), i.makeTranslation(-Es.x, -Es.y, -Es.z), Hl.multiplyMatrices(n.projectionMatrix, n.matrixWorldInverse), this._frustum.setFromProjectionMatrix(Hl);
    }
  }
  class r0 extends io {
    constructor(e, t, n = 0, i = 2) {
      super(e, t), this.isPointLight = true, this.type = "PointLight", this.distance = n, this.decay = i, this.shadow = new s0();
    }
    get power() {
      return this.intensity * 4 * Math.PI;
    }
    set power(e) {
      this.intensity = e / (4 * Math.PI);
    }
    dispose() {
      this.shadow.dispose();
    }
    copy(e, t) {
      return super.copy(e, t), this.distance = e.distance, this.decay = e.decay, this.shadow = e.shadow.clone(), this;
    }
  }
  class o0 extends dc {
    constructor() {
      super(new sc(-5, 5, 5, -5, 0.5, 500)), this.isDirectionalLightShadow = true;
    }
  }
  class jh extends io {
    constructor(e, t) {
      super(e, t), this.isDirectionalLight = true, this.type = "DirectionalLight", this.position.copy(ot.DEFAULT_UP), this.updateMatrix(), this.target = new ot(), this.shadow = new o0();
    }
    dispose() {
      this.shadow.dispose();
    }
    copy(e) {
      return super.copy(e), this.target = e.target.clone(), this.shadow = e.shadow.clone(), this;
    }
  }
  class a0 extends io {
    constructor(e, t) {
      super(e, t), this.isAmbientLight = true, this.type = "AmbientLight";
    }
  }
  class Is {
    static decodeText(e) {
      if (console.warn("THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."), typeof TextDecoder < "u") return new TextDecoder().decode(e);
      let t = "";
      for (let n = 0, i = e.length; n < i; n++) t += String.fromCharCode(e[n]);
      try {
        return decodeURIComponent(escape(t));
      } catch {
        return t;
      }
    }
    static extractUrlBase(e) {
      const t = e.lastIndexOf("/");
      return t === -1 ? "./" : e.slice(0, t + 1);
    }
    static resolveURL(e, t) {
      return typeof e != "string" || e === "" ? "" : (/^https?:\/\//i.test(t) && /^\//.test(e) && (t = t.replace(/(^https?:\/\/[^\/]+).*/i, "$1")), /^(https?:)?\/\//i.test(e) || /^data:.*,.*$/i.test(e) || /^blob:.*$/i.test(e) ? e : t + e);
    }
  }
  class c0 extends hs {
    constructor(e) {
      super(e), this.isImageBitmapLoader = true, typeof createImageBitmap > "u" && console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."), typeof fetch > "u" && console.warn("THREE.ImageBitmapLoader: fetch() not supported."), this.options = {
        premultiplyAlpha: "none"
      };
    }
    setOptions(e) {
      return this.options = e, this;
    }
    load(e, t, n, i) {
      e === void 0 && (e = ""), this.path !== void 0 && (e = this.path + e), e = this.manager.resolveURL(e);
      const r = this, o = Yn.get(e);
      if (o !== void 0) {
        if (r.manager.itemStart(e), o.then) {
          o.then((l) => {
            t && t(l), r.manager.itemEnd(e);
          }).catch((l) => {
            i && i(l);
          });
          return;
        }
        return setTimeout(function() {
          t && t(o), r.manager.itemEnd(e);
        }, 0), o;
      }
      const a = {};
      a.credentials = this.crossOrigin === "anonymous" ? "same-origin" : "include", a.headers = this.requestHeader;
      const c = fetch(e, a).then(function(l) {
        return l.blob();
      }).then(function(l) {
        return createImageBitmap(l, Object.assign(r.options, {
          colorSpaceConversion: "none"
        }));
      }).then(function(l) {
        return Yn.add(e, l), t && t(l), r.manager.itemEnd(e), l;
      }).catch(function(l) {
        i && i(l), Yn.remove(e), r.manager.itemError(e), r.manager.itemEnd(e);
      });
      Yn.add(e, c), r.manager.itemStart(e);
    }
  }
  class l0 {
    constructor(e, t, n) {
      this.binding = e, this.valueSize = n;
      let i, r, o;
      switch (t) {
        case "quaternion":
          i = this._slerp, r = this._slerpAdditive, o = this._setAdditiveIdentityQuaternion, this.buffer = new Float64Array(n * 6), this._workIndex = 5;
          break;
        case "string":
        case "bool":
          i = this._select, r = this._select, o = this._setAdditiveIdentityOther, this.buffer = new Array(n * 5);
          break;
        default:
          i = this._lerp, r = this._lerpAdditive, o = this._setAdditiveIdentityNumeric, this.buffer = new Float64Array(n * 5);
      }
      this._mixBufferRegion = i, this._mixBufferRegionAdditive = r, this._setIdentity = o, this._origIndex = 3, this._addIndex = 4, this.cumulativeWeight = 0, this.cumulativeWeightAdditive = 0, this.useCount = 0, this.referenceCount = 0;
    }
    accumulate(e, t) {
      const n = this.buffer, i = this.valueSize, r = e * i + i;
      let o = this.cumulativeWeight;
      if (o === 0) {
        for (let a = 0; a !== i; ++a) n[r + a] = n[a];
        o = t;
      } else {
        o += t;
        const a = t / o;
        this._mixBufferRegion(n, r, 0, a, i);
      }
      this.cumulativeWeight = o;
    }
    accumulateAdditive(e) {
      const t = this.buffer, n = this.valueSize, i = n * this._addIndex;
      this.cumulativeWeightAdditive === 0 && this._setIdentity(), this._mixBufferRegionAdditive(t, i, 0, e, n), this.cumulativeWeightAdditive += e;
    }
    apply(e) {
      const t = this.valueSize, n = this.buffer, i = e * t + t, r = this.cumulativeWeight, o = this.cumulativeWeightAdditive, a = this.binding;
      if (this.cumulativeWeight = 0, this.cumulativeWeightAdditive = 0, r < 1) {
        const c = t * this._origIndex;
        this._mixBufferRegion(n, i, c, 1 - r, t);
      }
      o > 0 && this._mixBufferRegionAdditive(n, i, this._addIndex * t, 1, t);
      for (let c = t, l = t + t; c !== l; ++c) if (n[c] !== n[c + t]) {
        a.setValue(n, i);
        break;
      }
    }
    saveOriginalState() {
      const e = this.binding, t = this.buffer, n = this.valueSize, i = n * this._origIndex;
      e.getValue(t, i);
      for (let r = n, o = i; r !== o; ++r) t[r] = t[i + r % n];
      this._setIdentity(), this.cumulativeWeight = 0, this.cumulativeWeightAdditive = 0;
    }
    restoreOriginalState() {
      const e = this.valueSize * 3;
      this.binding.setValue(this.buffer, e);
    }
    _setAdditiveIdentityNumeric() {
      const e = this._addIndex * this.valueSize, t = e + this.valueSize;
      for (let n = e; n < t; n++) this.buffer[n] = 0;
    }
    _setAdditiveIdentityQuaternion() {
      this._setAdditiveIdentityNumeric(), this.buffer[this._addIndex * this.valueSize + 3] = 1;
    }
    _setAdditiveIdentityOther() {
      const e = this._origIndex * this.valueSize, t = this._addIndex * this.valueSize;
      for (let n = 0; n < this.valueSize; n++) this.buffer[t + n] = this.buffer[e + n];
    }
    _select(e, t, n, i, r) {
      if (i >= 0.5) for (let o = 0; o !== r; ++o) e[t + o] = e[n + o];
    }
    _slerp(e, t, n, i) {
      Ht.slerpFlat(e, t, e, t, e, n, i);
    }
    _slerpAdditive(e, t, n, i, r) {
      const o = this._workIndex * r;
      Ht.multiplyQuaternionsFlat(e, o, e, t, e, n), Ht.slerpFlat(e, t, e, t, e, o, i);
    }
    _lerp(e, t, n, i, r) {
      const o = 1 - i;
      for (let a = 0; a !== r; ++a) {
        const c = t + a;
        e[c] = e[c] * o + e[n + a] * i;
      }
    }
    _lerpAdditive(e, t, n, i, r) {
      for (let o = 0; o !== r; ++o) {
        const a = t + o;
        e[a] = e[a] + e[n + o] * i;
      }
    }
  }
  const fc = "\\[\\]\\.:\\/", h0 = new RegExp("[" + fc + "]", "g"), pc = "[^" + fc + "]", u0 = "[^" + fc.replace("\\.", "") + "]", d0 = /((?:WC+[\/:])*)/.source.replace("WC", pc), f0 = /(WCOD+)?/.source.replace("WCOD", u0), p0 = /(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC", pc), m0 = /\.(WC+)(?:\[(.+)\])?/.source.replace("WC", pc), g0 = new RegExp("^" + d0 + f0 + p0 + m0 + "$"), _0 = [
    "material",
    "materials",
    "bones",
    "map"
  ];
  class x0 {
    constructor(e, t, n) {
      const i = n || Ke.parseTrackName(t);
      this._targetGroup = e, this._bindings = e.subscribe_(t, i);
    }
    getValue(e, t) {
      this.bind();
      const n = this._targetGroup.nCachedObjects_, i = this._bindings[n];
      i !== void 0 && i.getValue(e, t);
    }
    setValue(e, t) {
      const n = this._bindings;
      for (let i = this._targetGroup.nCachedObjects_, r = n.length; i !== r; ++i) n[i].setValue(e, t);
    }
    bind() {
      const e = this._bindings;
      for (let t = this._targetGroup.nCachedObjects_, n = e.length; t !== n; ++t) e[t].bind();
    }
    unbind() {
      const e = this._bindings;
      for (let t = this._targetGroup.nCachedObjects_, n = e.length; t !== n; ++t) e[t].unbind();
    }
  }
  class Ke {
    constructor(e, t, n) {
      this.path = t, this.parsedPath = n || Ke.parseTrackName(t), this.node = Ke.findNode(e, this.parsedPath.nodeName), this.rootNode = e, this.getValue = this._getValue_unbound, this.setValue = this._setValue_unbound;
    }
    static create(e, t, n) {
      return e && e.isAnimationObjectGroup ? new Ke.Composite(e, t, n) : new Ke(e, t, n);
    }
    static sanitizeNodeName(e) {
      return e.replace(/\s/g, "_").replace(h0, "");
    }
    static parseTrackName(e) {
      const t = g0.exec(e);
      if (t === null) throw new Error("PropertyBinding: Cannot parse trackName: " + e);
      const n = {
        nodeName: t[2],
        objectName: t[3],
        objectIndex: t[4],
        propertyName: t[5],
        propertyIndex: t[6]
      }, i = n.nodeName && n.nodeName.lastIndexOf(".");
      if (i !== void 0 && i !== -1) {
        const r = n.nodeName.substring(i + 1);
        _0.indexOf(r) !== -1 && (n.nodeName = n.nodeName.substring(0, i), n.objectName = r);
      }
      if (n.propertyName === null || n.propertyName.length === 0) throw new Error("PropertyBinding: can not parse propertyName from trackName: " + e);
      return n;
    }
    static findNode(e, t) {
      if (t === void 0 || t === "" || t === "." || t === -1 || t === e.name || t === e.uuid) return e;
      if (e.skeleton) {
        const n = e.skeleton.getBoneByName(t);
        if (n !== void 0) return n;
      }
      if (e.children) {
        const n = function(r) {
          for (let o = 0; o < r.length; o++) {
            const a = r[o];
            if (a.name === t || a.uuid === t) return a;
            const c = n(a.children);
            if (c) return c;
          }
          return null;
        }, i = n(e.children);
        if (i) return i;
      }
      return null;
    }
    _getValue_unavailable() {
    }
    _setValue_unavailable() {
    }
    _getValue_direct(e, t) {
      e[t] = this.targetObject[this.propertyName];
    }
    _getValue_array(e, t) {
      const n = this.resolvedProperty;
      for (let i = 0, r = n.length; i !== r; ++i) e[t++] = n[i];
    }
    _getValue_arrayElement(e, t) {
      e[t] = this.resolvedProperty[this.propertyIndex];
    }
    _getValue_toArray(e, t) {
      this.resolvedProperty.toArray(e, t);
    }
    _setValue_direct(e, t) {
      this.targetObject[this.propertyName] = e[t];
    }
    _setValue_direct_setNeedsUpdate(e, t) {
      this.targetObject[this.propertyName] = e[t], this.targetObject.needsUpdate = true;
    }
    _setValue_direct_setMatrixWorldNeedsUpdate(e, t) {
      this.targetObject[this.propertyName] = e[t], this.targetObject.matrixWorldNeedsUpdate = true;
    }
    _setValue_array(e, t) {
      const n = this.resolvedProperty;
      for (let i = 0, r = n.length; i !== r; ++i) n[i] = e[t++];
    }
    _setValue_array_setNeedsUpdate(e, t) {
      const n = this.resolvedProperty;
      for (let i = 0, r = n.length; i !== r; ++i) n[i] = e[t++];
      this.targetObject.needsUpdate = true;
    }
    _setValue_array_setMatrixWorldNeedsUpdate(e, t) {
      const n = this.resolvedProperty;
      for (let i = 0, r = n.length; i !== r; ++i) n[i] = e[t++];
      this.targetObject.matrixWorldNeedsUpdate = true;
    }
    _setValue_arrayElement(e, t) {
      this.resolvedProperty[this.propertyIndex] = e[t];
    }
    _setValue_arrayElement_setNeedsUpdate(e, t) {
      this.resolvedProperty[this.propertyIndex] = e[t], this.targetObject.needsUpdate = true;
    }
    _setValue_arrayElement_setMatrixWorldNeedsUpdate(e, t) {
      this.resolvedProperty[this.propertyIndex] = e[t], this.targetObject.matrixWorldNeedsUpdate = true;
    }
    _setValue_fromArray(e, t) {
      this.resolvedProperty.fromArray(e, t);
    }
    _setValue_fromArray_setNeedsUpdate(e, t) {
      this.resolvedProperty.fromArray(e, t), this.targetObject.needsUpdate = true;
    }
    _setValue_fromArray_setMatrixWorldNeedsUpdate(e, t) {
      this.resolvedProperty.fromArray(e, t), this.targetObject.matrixWorldNeedsUpdate = true;
    }
    _getValue_unbound(e, t) {
      this.bind(), this.getValue(e, t);
    }
    _setValue_unbound(e, t) {
      this.bind(), this.setValue(e, t);
    }
    bind() {
      let e = this.node;
      const t = this.parsedPath, n = t.objectName, i = t.propertyName;
      let r = t.propertyIndex;
      if (e || (e = Ke.findNode(this.rootNode, t.nodeName), this.node = e), this.getValue = this._getValue_unavailable, this.setValue = this._setValue_unavailable, !e) {
        console.warn("THREE.PropertyBinding: No target node found for track: " + this.path + ".");
        return;
      }
      if (n) {
        let l = t.objectIndex;
        switch (n) {
          case "materials":
            if (!e.material) {
              console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.", this);
              return;
            }
            if (!e.material.materials) {
              console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.", this);
              return;
            }
            e = e.material.materials;
            break;
          case "bones":
            if (!e.skeleton) {
              console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.", this);
              return;
            }
            e = e.skeleton.bones;
            for (let h = 0; h < e.length; h++) if (e[h].name === l) {
              l = h;
              break;
            }
            break;
          case "map":
            if ("map" in e) {
              e = e.map;
              break;
            }
            if (!e.material) {
              console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.", this);
              return;
            }
            if (!e.material.map) {
              console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.", this);
              return;
            }
            e = e.material.map;
            break;
          default:
            if (e[n] === void 0) {
              console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.", this);
              return;
            }
            e = e[n];
        }
        if (l !== void 0) {
          if (e[l] === void 0) {
            console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.", this, e);
            return;
          }
          e = e[l];
        }
      }
      const o = e[i];
      if (o === void 0) {
        const l = t.nodeName;
        console.error("THREE.PropertyBinding: Trying to update property for track: " + l + "." + i + " but it wasn't found.", e);
        return;
      }
      let a = this.Versioning.None;
      this.targetObject = e, e.needsUpdate !== void 0 ? a = this.Versioning.NeedsUpdate : e.matrixWorldNeedsUpdate !== void 0 && (a = this.Versioning.MatrixWorldNeedsUpdate);
      let c = this.BindingType.Direct;
      if (r !== void 0) {
        if (i === "morphTargetInfluences") {
          if (!e.geometry) {
            console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.", this);
            return;
          }
          if (!e.geometry.morphAttributes) {
            console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.", this);
            return;
          }
          e.morphTargetDictionary[r] !== void 0 && (r = e.morphTargetDictionary[r]);
        }
        c = this.BindingType.ArrayElement, this.resolvedProperty = o, this.propertyIndex = r;
      } else o.fromArray !== void 0 && o.toArray !== void 0 ? (c = this.BindingType.HasFromToArray, this.resolvedProperty = o) : Array.isArray(o) ? (c = this.BindingType.EntireArray, this.resolvedProperty = o) : this.propertyName = i;
      this.getValue = this.GetterByBindingType[c], this.setValue = this.SetterByBindingTypeAndVersioning[c][a];
    }
    unbind() {
      this.node = null, this.getValue = this._getValue_unbound, this.setValue = this._setValue_unbound;
    }
  }
  Ke.Composite = x0;
  Ke.prototype.BindingType = {
    Direct: 0,
    EntireArray: 1,
    ArrayElement: 2,
    HasFromToArray: 3
  };
  Ke.prototype.Versioning = {
    None: 0,
    NeedsUpdate: 1,
    MatrixWorldNeedsUpdate: 2
  };
  Ke.prototype.GetterByBindingType = [
    Ke.prototype._getValue_direct,
    Ke.prototype._getValue_array,
    Ke.prototype._getValue_arrayElement,
    Ke.prototype._getValue_toArray
  ];
  Ke.prototype.SetterByBindingTypeAndVersioning = [
    [
      Ke.prototype._setValue_direct,
      Ke.prototype._setValue_direct_setNeedsUpdate,
      Ke.prototype._setValue_direct_setMatrixWorldNeedsUpdate
    ],
    [
      Ke.prototype._setValue_array,
      Ke.prototype._setValue_array_setNeedsUpdate,
      Ke.prototype._setValue_array_setMatrixWorldNeedsUpdate
    ],
    [
      Ke.prototype._setValue_arrayElement,
      Ke.prototype._setValue_arrayElement_setNeedsUpdate,
      Ke.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate
    ],
    [
      Ke.prototype._setValue_fromArray,
      Ke.prototype._setValue_fromArray_setNeedsUpdate,
      Ke.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate
    ]
  ];
  class v0 {
    constructor(e, t, n = null, i = t.blendMode) {
      this._mixer = e, this._clip = t, this._localRoot = n, this.blendMode = i;
      const r = t.tracks, o = r.length, a = new Array(o), c = {
        endingStart: ki,
        endingEnd: ki
      };
      for (let l = 0; l !== o; ++l) {
        const h = r[l].createInterpolant(null);
        a[l] = h, h.settings = c;
      }
      this._interpolantSettings = c, this._interpolants = a, this._propertyBindings = new Array(o), this._cacheIndex = null, this._byClipCacheIndex = null, this._timeScaleInterpolant = null, this._weightInterpolant = null, this.loop = Gu, this._loopCount = -1, this._startTime = null, this.time = 0, this.timeScale = 1, this._effectiveTimeScale = 1, this.weight = 1, this._effectiveWeight = 1, this.repetitions = 1 / 0, this.paused = false, this.enabled = true, this.clampWhenFinished = false, this.zeroSlopeAtStart = true, this.zeroSlopeAtEnd = true;
    }
    play() {
      return this._mixer._activateAction(this), this;
    }
    stop() {
      return this._mixer._deactivateAction(this), this.reset();
    }
    reset() {
      return this.paused = false, this.enabled = true, this.time = 0, this._loopCount = -1, this._startTime = null, this.stopFading().stopWarping();
    }
    isRunning() {
      return this.enabled && !this.paused && this.timeScale !== 0 && this._startTime === null && this._mixer._isActiveAction(this);
    }
    isScheduled() {
      return this._mixer._isActiveAction(this);
    }
    startAt(e) {
      return this._startTime = e, this;
    }
    setLoop(e, t) {
      return this.loop = e, this.repetitions = t, this;
    }
    setEffectiveWeight(e) {
      return this.weight = e, this._effectiveWeight = this.enabled ? e : 0, this.stopFading();
    }
    getEffectiveWeight() {
      return this._effectiveWeight;
    }
    fadeIn(e) {
      return this._scheduleFading(e, 0, 1);
    }
    fadeOut(e) {
      return this._scheduleFading(e, 1, 0);
    }
    crossFadeFrom(e, t, n) {
      if (e.fadeOut(t), this.fadeIn(t), n) {
        const i = this._clip.duration, r = e._clip.duration, o = r / i, a = i / r;
        e.warp(1, o, t), this.warp(a, 1, t);
      }
      return this;
    }
    crossFadeTo(e, t, n) {
      return e.crossFadeFrom(this, t, n);
    }
    stopFading() {
      const e = this._weightInterpolant;
      return e !== null && (this._weightInterpolant = null, this._mixer._takeBackControlInterpolant(e)), this;
    }
    setEffectiveTimeScale(e) {
      return this.timeScale = e, this._effectiveTimeScale = this.paused ? 0 : e, this.stopWarping();
    }
    getEffectiveTimeScale() {
      return this._effectiveTimeScale;
    }
    setDuration(e) {
      return this.timeScale = this._clip.duration / e, this.stopWarping();
    }
    syncWith(e) {
      return this.time = e.time, this.timeScale = e.timeScale, this.stopWarping();
    }
    halt(e) {
      return this.warp(this._effectiveTimeScale, 0, e);
    }
    warp(e, t, n) {
      const i = this._mixer, r = i.time, o = this.timeScale;
      let a = this._timeScaleInterpolant;
      a === null && (a = i._lendControlInterpolant(), this._timeScaleInterpolant = a);
      const c = a.parameterPositions, l = a.sampleValues;
      return c[0] = r, c[1] = r + n, l[0] = e / o, l[1] = t / o, this;
    }
    stopWarping() {
      const e = this._timeScaleInterpolant;
      return e !== null && (this._timeScaleInterpolant = null, this._mixer._takeBackControlInterpolant(e)), this;
    }
    getMixer() {
      return this._mixer;
    }
    getClip() {
      return this._clip;
    }
    getRoot() {
      return this._localRoot || this._mixer._root;
    }
    _update(e, t, n, i) {
      if (!this.enabled) {
        this._updateWeight(e);
        return;
      }
      const r = this._startTime;
      if (r !== null) {
        const c = (e - r) * n;
        c < 0 || n === 0 ? t = 0 : (this._startTime = null, t = n * c);
      }
      t *= this._updateTimeScale(e);
      const o = this._updateTime(t), a = this._updateWeight(e);
      if (a > 0) {
        const c = this._interpolants, l = this._propertyBindings;
        switch (this.blendMode) {
          case Xu:
            for (let h = 0, u = c.length; h !== u; ++h) c[h].evaluate(o), l[h].accumulateAdditive(a);
            break;
          case ec:
          default:
            for (let h = 0, u = c.length; h !== u; ++h) c[h].evaluate(o), l[h].accumulate(i, a);
        }
      }
    }
    _updateWeight(e) {
      let t = 0;
      if (this.enabled) {
        t = this.weight;
        const n = this._weightInterpolant;
        if (n !== null) {
          const i = n.evaluate(e)[0];
          t *= i, e > n.parameterPositions[1] && (this.stopFading(), i === 0 && (this.enabled = false));
        }
      }
      return this._effectiveWeight = t, t;
    }
    _updateTimeScale(e) {
      let t = 0;
      if (!this.paused) {
        t = this.timeScale;
        const n = this._timeScaleInterpolant;
        if (n !== null) {
          const i = n.evaluate(e)[0];
          t *= i, e > n.parameterPositions[1] && (this.stopWarping(), t === 0 ? this.paused = true : this.timeScale = t);
        }
      }
      return this._effectiveTimeScale = t, t;
    }
    _updateTime(e) {
      const t = this._clip.duration, n = this.loop;
      let i = this.time + e, r = this._loopCount;
      const o = n === Wu;
      if (e === 0) return r === -1 ? i : o && (r & 1) === 1 ? t - i : i;
      if (n === xh) {
        r === -1 && (this._loopCount = 0, this._setEndings(true, true, false));
        e: {
          if (i >= t) i = t;
          else if (i < 0) i = 0;
          else {
            this.time = i;
            break e;
          }
          this.clampWhenFinished ? this.paused = true : this.enabled = false, this.time = i, this._mixer.dispatchEvent({
            type: "finished",
            action: this,
            direction: e < 0 ? -1 : 1
          });
        }
      } else {
        if (r === -1 && (e >= 0 ? (r = 0, this._setEndings(true, this.repetitions === 0, o)) : this._setEndings(this.repetitions === 0, true, o)), i >= t || i < 0) {
          const a = Math.floor(i / t);
          i -= t * a, r += Math.abs(a);
          const c = this.repetitions - r;
          if (c <= 0) this.clampWhenFinished ? this.paused = true : this.enabled = false, i = e > 0 ? t : 0, this.time = i, this._mixer.dispatchEvent({
            type: "finished",
            action: this,
            direction: e > 0 ? 1 : -1
          });
          else {
            if (c === 1) {
              const l = e < 0;
              this._setEndings(l, !l, o);
            } else this._setEndings(false, false, o);
            this._loopCount = r, this.time = i, this._mixer.dispatchEvent({
              type: "loop",
              action: this,
              loopDelta: a
            });
          }
        } else this.time = i;
        if (o && (r & 1) === 1) return t - i;
      }
      return i;
    }
    _setEndings(e, t, n) {
      const i = this._interpolantSettings;
      n ? (i.endingStart = zi, i.endingEnd = zi) : (e ? i.endingStart = this.zeroSlopeAtStart ? zi : ki : i.endingStart = Gr, t ? i.endingEnd = this.zeroSlopeAtEnd ? zi : ki : i.endingEnd = Gr);
    }
    _scheduleFading(e, t, n) {
      const i = this._mixer, r = i.time;
      let o = this._weightInterpolant;
      o === null && (o = i._lendControlInterpolant(), this._weightInterpolant = o);
      const a = o.parameterPositions, c = o.sampleValues;
      return a[0] = r, c[0] = t, a[1] = r + e, c[1] = n, this;
    }
  }
  const y0 = new Float32Array(1);
  class M0 extends Jn {
    constructor(e) {
      super(), this._root = e, this._initMemoryManager(), this._accuIndex = 0, this.time = 0, this.timeScale = 1;
    }
    _bindAction(e, t) {
      const n = e._localRoot || this._root, i = e._clip.tracks, r = i.length, o = e._propertyBindings, a = e._interpolants, c = n.uuid, l = this._bindingsByRootAndName;
      let h = l[c];
      h === void 0 && (h = {}, l[c] = h);
      for (let u = 0; u !== r; ++u) {
        const d = i[u], f = d.name;
        let g = h[f];
        if (g !== void 0) ++g.referenceCount, o[u] = g;
        else {
          if (g = o[u], g !== void 0) {
            g._cacheIndex === null && (++g.referenceCount, this._addInactiveBinding(g, c, f));
            continue;
          }
          const _ = t && t._propertyBindings[u].binding.parsedPath;
          g = new l0(Ke.create(n, f, _), d.ValueTypeName, d.getValueSize()), ++g.referenceCount, this._addInactiveBinding(g, c, f), o[u] = g;
        }
        a[u].resultBuffer = g.buffer;
      }
    }
    _activateAction(e) {
      if (!this._isActiveAction(e)) {
        if (e._cacheIndex === null) {
          const n = (e._localRoot || this._root).uuid, i = e._clip.uuid, r = this._actionsByClip[i];
          this._bindAction(e, r && r.knownActions[0]), this._addInactiveAction(e, i, n);
        }
        const t = e._propertyBindings;
        for (let n = 0, i = t.length; n !== i; ++n) {
          const r = t[n];
          r.useCount++ === 0 && (this._lendBinding(r), r.saveOriginalState());
        }
        this._lendAction(e);
      }
    }
    _deactivateAction(e) {
      if (this._isActiveAction(e)) {
        const t = e._propertyBindings;
        for (let n = 0, i = t.length; n !== i; ++n) {
          const r = t[n];
          --r.useCount === 0 && (r.restoreOriginalState(), this._takeBackBinding(r));
        }
        this._takeBackAction(e);
      }
    }
    _initMemoryManager() {
      this._actions = [], this._nActiveActions = 0, this._actionsByClip = {}, this._bindings = [], this._nActiveBindings = 0, this._bindingsByRootAndName = {}, this._controlInterpolants = [], this._nActiveControlInterpolants = 0;
      const e = this;
      this.stats = {
        actions: {
          get total() {
            return e._actions.length;
          },
          get inUse() {
            return e._nActiveActions;
          }
        },
        bindings: {
          get total() {
            return e._bindings.length;
          },
          get inUse() {
            return e._nActiveBindings;
          }
        },
        controlInterpolants: {
          get total() {
            return e._controlInterpolants.length;
          },
          get inUse() {
            return e._nActiveControlInterpolants;
          }
        }
      };
    }
    _isActiveAction(e) {
      const t = e._cacheIndex;
      return t !== null && t < this._nActiveActions;
    }
    _addInactiveAction(e, t, n) {
      const i = this._actions, r = this._actionsByClip;
      let o = r[t];
      if (o === void 0) o = {
        knownActions: [
          e
        ],
        actionByRoot: {}
      }, e._byClipCacheIndex = 0, r[t] = o;
      else {
        const a = o.knownActions;
        e._byClipCacheIndex = a.length, a.push(e);
      }
      e._cacheIndex = i.length, i.push(e), o.actionByRoot[n] = e;
    }
    _removeInactiveAction(e) {
      const t = this._actions, n = t[t.length - 1], i = e._cacheIndex;
      n._cacheIndex = i, t[i] = n, t.pop(), e._cacheIndex = null;
      const r = e._clip.uuid, o = this._actionsByClip, a = o[r], c = a.knownActions, l = c[c.length - 1], h = e._byClipCacheIndex;
      l._byClipCacheIndex = h, c[h] = l, c.pop(), e._byClipCacheIndex = null;
      const u = a.actionByRoot, d = (e._localRoot || this._root).uuid;
      delete u[d], c.length === 0 && delete o[r], this._removeInactiveBindingsForAction(e);
    }
    _removeInactiveBindingsForAction(e) {
      const t = e._propertyBindings;
      for (let n = 0, i = t.length; n !== i; ++n) {
        const r = t[n];
        --r.referenceCount === 0 && this._removeInactiveBinding(r);
      }
    }
    _lendAction(e) {
      const t = this._actions, n = e._cacheIndex, i = this._nActiveActions++, r = t[i];
      e._cacheIndex = i, t[i] = e, r._cacheIndex = n, t[n] = r;
    }
    _takeBackAction(e) {
      const t = this._actions, n = e._cacheIndex, i = --this._nActiveActions, r = t[i];
      e._cacheIndex = i, t[i] = e, r._cacheIndex = n, t[n] = r;
    }
    _addInactiveBinding(e, t, n) {
      const i = this._bindingsByRootAndName, r = this._bindings;
      let o = i[t];
      o === void 0 && (o = {}, i[t] = o), o[n] = e, e._cacheIndex = r.length, r.push(e);
    }
    _removeInactiveBinding(e) {
      const t = this._bindings, n = e.binding, i = n.rootNode.uuid, r = n.path, o = this._bindingsByRootAndName, a = o[i], c = t[t.length - 1], l = e._cacheIndex;
      c._cacheIndex = l, t[l] = c, t.pop(), delete a[r], Object.keys(a).length === 0 && delete o[i];
    }
    _lendBinding(e) {
      const t = this._bindings, n = e._cacheIndex, i = this._nActiveBindings++, r = t[i];
      e._cacheIndex = i, t[i] = e, r._cacheIndex = n, t[n] = r;
    }
    _takeBackBinding(e) {
      const t = this._bindings, n = e._cacheIndex, i = --this._nActiveBindings, r = t[i];
      e._cacheIndex = i, t[i] = e, r._cacheIndex = n, t[n] = r;
    }
    _lendControlInterpolant() {
      const e = this._controlInterpolants, t = this._nActiveControlInterpolants++;
      let n = e[t];
      return n === void 0 && (n = new Xh(new Float32Array(2), new Float32Array(2), 1, y0), n.__cacheIndex = t, e[t] = n), n;
    }
    _takeBackControlInterpolant(e) {
      const t = this._controlInterpolants, n = e.__cacheIndex, i = --this._nActiveControlInterpolants, r = t[i];
      e.__cacheIndex = i, t[i] = e, r.__cacheIndex = n, t[n] = r;
    }
    clipAction(e, t, n) {
      const i = t || this._root, r = i.uuid;
      let o = typeof e == "string" ? ks.findByName(i, e) : e;
      const a = o !== null ? o.uuid : e, c = this._actionsByClip[a];
      let l = null;
      if (n === void 0 && (o !== null ? n = o.blendMode : n = ec), c !== void 0) {
        const u = c.actionByRoot[r];
        if (u !== void 0 && u.blendMode === n) return u;
        l = c.knownActions[0], o === null && (o = l._clip);
      }
      if (o === null) return null;
      const h = new v0(this, o, t, n);
      return this._bindAction(h, l), this._addInactiveAction(h, a, r), h;
    }
    existingAction(e, t) {
      const n = t || this._root, i = n.uuid, r = typeof e == "string" ? ks.findByName(n, e) : e, o = r ? r.uuid : e, a = this._actionsByClip[o];
      return a !== void 0 && a.actionByRoot[i] || null;
    }
    stopAllAction() {
      const e = this._actions, t = this._nActiveActions;
      for (let n = t - 1; n >= 0; --n) e[n].stop();
      return this;
    }
    update(e) {
      e *= this.timeScale;
      const t = this._actions, n = this._nActiveActions, i = this.time += e, r = Math.sign(e), o = this._accuIndex ^= 1;
      for (let l = 0; l !== n; ++l) t[l]._update(i, e, r, o);
      const a = this._bindings, c = this._nActiveBindings;
      for (let l = 0; l !== c; ++l) a[l].apply(o);
      return this;
    }
    setTime(e) {
      this.time = 0;
      for (let t = 0; t < this._actions.length; t++) this._actions[t].time = 0;
      return this.update(e);
    }
    getRoot() {
      return this._root;
    }
    uncacheClip(e) {
      const t = this._actions, n = e.uuid, i = this._actionsByClip, r = i[n];
      if (r !== void 0) {
        const o = r.knownActions;
        for (let a = 0, c = o.length; a !== c; ++a) {
          const l = o[a];
          this._deactivateAction(l);
          const h = l._cacheIndex, u = t[t.length - 1];
          l._cacheIndex = null, l._byClipCacheIndex = null, u._cacheIndex = h, t[h] = u, t.pop(), this._removeInactiveBindingsForAction(l);
        }
        delete i[n];
      }
    }
    uncacheRoot(e) {
      const t = e.uuid, n = this._actionsByClip;
      for (const o in n) {
        const a = n[o].actionByRoot, c = a[t];
        c !== void 0 && (this._deactivateAction(c), this._removeInactiveAction(c));
      }
      const i = this._bindingsByRootAndName, r = i[t];
      if (r !== void 0) for (const o in r) {
        const a = r[o];
        a.restoreOriginalState(), this._removeInactiveBinding(a);
      }
    }
    uncacheAction(e, t) {
      const n = this.existingAction(e, t);
      n !== null && (this._deactivateAction(n), this._removeInactiveAction(n));
    }
  }
  class Vl {
    constructor(e = 1, t = 0, n = 0) {
      return this.radius = e, this.phi = t, this.theta = n, this;
    }
    set(e, t, n) {
      return this.radius = e, this.phi = t, this.theta = n, this;
    }
    copy(e) {
      return this.radius = e.radius, this.phi = e.phi, this.theta = e.theta, this;
    }
    makeSafe() {
      return this.phi = Math.max(1e-6, Math.min(Math.PI - 1e-6, this.phi)), this;
    }
    setFromVector3(e) {
      return this.setFromCartesianCoords(e.x, e.y, e.z);
    }
    setFromCartesianCoords(e, t, n) {
      return this.radius = Math.sqrt(e * e + t * t + n * n), this.radius === 0 ? (this.theta = 0, this.phi = 0) : (this.theta = Math.atan2(e, n), this.phi = Math.acos(St(t / this.radius, -1, 1))), this;
    }
    clone() {
      return new this.constructor().copy(this);
    }
  }
  const zn = new R(), Er = new Ce(), Xo = new Ce();
  class S0 extends cc {
    constructor(e) {
      const t = Kh(e), n = new yt(), i = [], r = [], o = new Se(0, 0, 1), a = new Se(0, 1, 0);
      for (let l = 0; l < t.length; l++) {
        const h = t[l];
        h.parent && h.parent.isBone && (i.push(0, 0, 0), i.push(0, 0, 0), r.push(o.r, o.g, o.b), r.push(a.r, a.g, a.b));
      }
      n.setAttribute("position", new at(i, 3)), n.setAttribute("color", new at(r, 3));
      const c = new no({
        vertexColors: true,
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
        transparent: true
      });
      super(n, c), this.isSkeletonHelper = true, this.type = "SkeletonHelper", this.root = e, this.bones = t, this.matrix = e.matrixWorld, this.matrixAutoUpdate = false;
    }
    updateMatrixWorld(e) {
      const t = this.bones, n = this.geometry, i = n.getAttribute("position");
      Xo.copy(this.root.matrixWorld).invert();
      for (let r = 0, o = 0; r < t.length; r++) {
        const a = t[r];
        a.parent && a.parent.isBone && (Er.multiplyMatrices(Xo, a.matrixWorld), zn.setFromMatrixPosition(Er), i.setXYZ(o, zn.x, zn.y, zn.z), Er.multiplyMatrices(Xo, a.parent.matrixWorld), zn.setFromMatrixPosition(Er), i.setXYZ(o + 1, zn.x, zn.y, zn.z), o += 2);
      }
      n.getAttribute("position").needsUpdate = true, super.updateMatrixWorld(e);
    }
    dispose() {
      this.geometry.dispose(), this.material.dispose();
    }
  }
  function Kh(s) {
    const e = [];
    s.isBone === true && e.push(s);
    for (let t = 0; t < s.children.length; t++) e.push.apply(e, Kh(s.children[t]));
    return e;
  }
  const br = new dn();
  class E0 extends cc {
    constructor(e, t = 16776960) {
      const n = new Uint16Array([
        0,
        1,
        1,
        2,
        2,
        3,
        3,
        0,
        4,
        5,
        5,
        6,
        6,
        7,
        7,
        4,
        0,
        4,
        1,
        5,
        2,
        6,
        3,
        7
      ]), i = new Float32Array(8 * 3), r = new yt();
      r.setIndex(new vt(n, 1)), r.setAttribute("position", new vt(i, 3)), super(r, new no({
        color: t,
        toneMapped: false
      })), this.object = e, this.type = "BoxHelper", this.matrixAutoUpdate = false, this.update();
    }
    update(e) {
      if (e !== void 0 && console.warn("THREE.BoxHelper: .update() has no longer arguments."), this.object !== void 0 && br.setFromObject(this.object), br.isEmpty()) return;
      const t = br.min, n = br.max, i = this.geometry.attributes.position, r = i.array;
      r[0] = n.x, r[1] = n.y, r[2] = n.z, r[3] = t.x, r[4] = n.y, r[5] = n.z, r[6] = t.x, r[7] = t.y, r[8] = n.z, r[9] = n.x, r[10] = t.y, r[11] = n.z, r[12] = n.x, r[13] = n.y, r[14] = t.z, r[15] = t.x, r[16] = n.y, r[17] = t.z, r[18] = t.x, r[19] = t.y, r[20] = t.z, r[21] = n.x, r[22] = t.y, r[23] = t.z, i.needsUpdate = true, this.geometry.computeBoundingSphere();
    }
    setFromObject(e) {
      return this.object = e, this.update(), this;
    }
    copy(e, t) {
      return super.copy(e, t), this.object = e.object, this;
    }
    dispose() {
      this.geometry.dispose(), this.material.dispose();
    }
  }
  class b0 extends Jn {
    constructor(e, t = null) {
      super(), this.object = e, this.domElement = t, this.enabled = true, this.state = -1, this.keys = {}, this.mouseButtons = {
        LEFT: null,
        MIDDLE: null,
        RIGHT: null
      }, this.touches = {
        ONE: null,
        TWO: null
      };
    }
    connect() {
    }
    disconnect() {
    }
    dispose() {
    }
    update() {
    }
  }
  typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register", {
    detail: {
      revision: Ya
    }
  }));
  typeof window < "u" && (window.__THREE__ ? console.warn("WARNING: Multiple instances of Three.js being imported.") : window.__THREE__ = Ya);
  const Gl = {
    type: "change"
  }, mc = {
    type: "start"
  }, $h = {
    type: "end"
  }, Tr = new Hs(), Wl = new Gn(), T0 = Math.cos(70 * nn.DEG2RAD), pt = new R(), Dt = 2 * Math.PI, et = {
    NONE: -1,
    ROTATE: 0,
    DOLLY: 1,
    PAN: 2,
    TOUCH_ROTATE: 3,
    TOUCH_PAN: 4,
    TOUCH_DOLLY_PAN: 5,
    TOUCH_DOLLY_ROTATE: 6
  }, Yo = 1e-6;
  class A0 extends b0 {
    constructor(e, t = null) {
      super(e, t), this.state = et.NONE, this.enabled = true, this.target = new R(), this.cursor = new R(), this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minTargetRadius = 0, this.maxTargetRadius = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = false, this.dampingFactor = 0.05, this.enableZoom = true, this.zoomSpeed = 1, this.enableRotate = true, this.rotateSpeed = 1, this.enablePan = true, this.panSpeed = 1, this.screenSpacePanning = true, this.keyPanSpeed = 7, this.zoomToCursor = false, this.autoRotate = false, this.autoRotateSpeed = 2, this.keys = {
        LEFT: "ArrowLeft",
        UP: "ArrowUp",
        RIGHT: "ArrowRight",
        BOTTOM: "ArrowDown"
      }, this.mouseButtons = {
        LEFT: Xi.ROTATE,
        MIDDLE: Xi.DOLLY,
        RIGHT: Xi.PAN
      }, this.touches = {
        ONE: Bi.ROTATE,
        TWO: Bi.DOLLY_PAN
      }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this._domElementKeyEvents = null, this._lastPosition = new R(), this._lastQuaternion = new Ht(), this._lastTargetPosition = new R(), this._quat = new Ht().setFromUnitVectors(e.up, new R(0, 1, 0)), this._quatInverse = this._quat.clone().invert(), this._spherical = new Vl(), this._sphericalDelta = new Vl(), this._scale = 1, this._panOffset = new R(), this._rotateStart = new ye(), this._rotateEnd = new ye(), this._rotateDelta = new ye(), this._panStart = new ye(), this._panEnd = new ye(), this._panDelta = new ye(), this._dollyStart = new ye(), this._dollyEnd = new ye(), this._dollyDelta = new ye(), this._dollyDirection = new R(), this._mouse = new ye(), this._performCursorZoom = false, this._pointers = [], this._pointerPositions = {}, this._controlActive = false, this._onPointerMove = R0.bind(this), this._onPointerDown = w0.bind(this), this._onPointerUp = C0.bind(this), this._onContextMenu = F0.bind(this), this._onMouseWheel = L0.bind(this), this._onKeyDown = D0.bind(this), this._onTouchStart = U0.bind(this), this._onTouchMove = N0.bind(this), this._onMouseDown = P0.bind(this), this._onMouseMove = I0.bind(this), this._interceptControlDown = O0.bind(this), this._interceptControlUp = B0.bind(this), this.domElement !== null && this.connect(), this.update();
    }
    connect() {
      this.domElement.addEventListener("pointerdown", this._onPointerDown), this.domElement.addEventListener("pointercancel", this._onPointerUp), this.domElement.addEventListener("contextmenu", this._onContextMenu), this.domElement.addEventListener("wheel", this._onMouseWheel, {
        passive: false
      }), this.domElement.getRootNode().addEventListener("keydown", this._interceptControlDown, {
        passive: true,
        capture: true
      }), this.domElement.style.touchAction = "none";
    }
    disconnect() {
      this.domElement.removeEventListener("pointerdown", this._onPointerDown), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.domElement.removeEventListener("pointerup", this._onPointerUp), this.domElement.removeEventListener("pointercancel", this._onPointerUp), this.domElement.removeEventListener("wheel", this._onMouseWheel), this.domElement.removeEventListener("contextmenu", this._onContextMenu), this.stopListenToKeyEvents(), this.domElement.getRootNode().removeEventListener("keydown", this._interceptControlDown, {
        capture: true
      }), this.domElement.style.touchAction = "auto";
    }
    dispose() {
      this.disconnect();
    }
    getPolarAngle() {
      return this._spherical.phi;
    }
    getAzimuthalAngle() {
      return this._spherical.theta;
    }
    getDistance() {
      return this.object.position.distanceTo(this.target);
    }
    listenToKeyEvents(e) {
      e.addEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = e;
    }
    stopListenToKeyEvents() {
      this._domElementKeyEvents !== null && (this._domElementKeyEvents.removeEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = null);
    }
    saveState() {
      this.target0.copy(this.target), this.position0.copy(this.object.position), this.zoom0 = this.object.zoom;
    }
    reset() {
      this.target.copy(this.target0), this.object.position.copy(this.position0), this.object.zoom = this.zoom0, this.object.updateProjectionMatrix(), this.dispatchEvent(Gl), this.update(), this.state = et.NONE;
    }
    update(e = null) {
      const t = this.object.position;
      pt.copy(t).sub(this.target), pt.applyQuaternion(this._quat), this._spherical.setFromVector3(pt), this.autoRotate && this.state === et.NONE && this._rotateLeft(this._getAutoRotationAngle(e)), this.enableDamping ? (this._spherical.theta += this._sphericalDelta.theta * this.dampingFactor, this._spherical.phi += this._sphericalDelta.phi * this.dampingFactor) : (this._spherical.theta += this._sphericalDelta.theta, this._spherical.phi += this._sphericalDelta.phi);
      let n = this.minAzimuthAngle, i = this.maxAzimuthAngle;
      isFinite(n) && isFinite(i) && (n < -Math.PI ? n += Dt : n > Math.PI && (n -= Dt), i < -Math.PI ? i += Dt : i > Math.PI && (i -= Dt), n <= i ? this._spherical.theta = Math.max(n, Math.min(i, this._spherical.theta)) : this._spherical.theta = this._spherical.theta > (n + i) / 2 ? Math.max(n, this._spherical.theta) : Math.min(i, this._spherical.theta)), this._spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this._spherical.phi)), this._spherical.makeSafe(), this.enableDamping === true ? this.target.addScaledVector(this._panOffset, this.dampingFactor) : this.target.add(this._panOffset), this.target.sub(this.cursor), this.target.clampLength(this.minTargetRadius, this.maxTargetRadius), this.target.add(this.cursor);
      let r = false;
      if (this.zoomToCursor && this._performCursorZoom || this.object.isOrthographicCamera) this._spherical.radius = this._clampDistance(this._spherical.radius);
      else {
        const o = this._spherical.radius;
        this._spherical.radius = this._clampDistance(this._spherical.radius * this._scale), r = o != this._spherical.radius;
      }
      if (pt.setFromSpherical(this._spherical), pt.applyQuaternion(this._quatInverse), t.copy(this.target).add(pt), this.object.lookAt(this.target), this.enableDamping === true ? (this._sphericalDelta.theta *= 1 - this.dampingFactor, this._sphericalDelta.phi *= 1 - this.dampingFactor, this._panOffset.multiplyScalar(1 - this.dampingFactor)) : (this._sphericalDelta.set(0, 0, 0), this._panOffset.set(0, 0, 0)), this.zoomToCursor && this._performCursorZoom) {
        let o = null;
        if (this.object.isPerspectiveCamera) {
          const a = pt.length();
          o = this._clampDistance(a * this._scale);
          const c = a - o;
          this.object.position.addScaledVector(this._dollyDirection, c), this.object.updateMatrixWorld(), r = !!c;
        } else if (this.object.isOrthographicCamera) {
          const a = new R(this._mouse.x, this._mouse.y, 0);
          a.unproject(this.object);
          const c = this.object.zoom;
          this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), this.object.updateProjectionMatrix(), r = c !== this.object.zoom;
          const l = new R(this._mouse.x, this._mouse.y, 0);
          l.unproject(this.object), this.object.position.sub(l).add(a), this.object.updateMatrixWorld(), o = pt.length();
        } else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."), this.zoomToCursor = false;
        o !== null && (this.screenSpacePanning ? this.target.set(0, 0, -1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position) : (Tr.origin.copy(this.object.position), Tr.direction.set(0, 0, -1).transformDirection(this.object.matrix), Math.abs(this.object.up.dot(Tr.direction)) < T0 ? this.object.lookAt(this.target) : (Wl.setFromNormalAndCoplanarPoint(this.object.up, this.target), Tr.intersectPlane(Wl, this.target))));
      } else if (this.object.isOrthographicCamera) {
        const o = this.object.zoom;
        this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), o !== this.object.zoom && (this.object.updateProjectionMatrix(), r = true);
      }
      return this._scale = 1, this._performCursorZoom = false, r || this._lastPosition.distanceToSquared(this.object.position) > Yo || 8 * (1 - this._lastQuaternion.dot(this.object.quaternion)) > Yo || this._lastTargetPosition.distanceToSquared(this.target) > Yo ? (this.dispatchEvent(Gl), this._lastPosition.copy(this.object.position), this._lastQuaternion.copy(this.object.quaternion), this._lastTargetPosition.copy(this.target), true) : false;
    }
    _getAutoRotationAngle(e) {
      return e !== null ? Dt / 60 * this.autoRotateSpeed * e : Dt / 60 / 60 * this.autoRotateSpeed;
    }
    _getZoomScale(e) {
      const t = Math.abs(e * 0.01);
      return Math.pow(0.95, this.zoomSpeed * t);
    }
    _rotateLeft(e) {
      this._sphericalDelta.theta -= e;
    }
    _rotateUp(e) {
      this._sphericalDelta.phi -= e;
    }
    _panLeft(e, t) {
      pt.setFromMatrixColumn(t, 0), pt.multiplyScalar(-e), this._panOffset.add(pt);
    }
    _panUp(e, t) {
      this.screenSpacePanning === true ? pt.setFromMatrixColumn(t, 1) : (pt.setFromMatrixColumn(t, 0), pt.crossVectors(this.object.up, pt)), pt.multiplyScalar(e), this._panOffset.add(pt);
    }
    _pan(e, t) {
      const n = this.domElement;
      if (this.object.isPerspectiveCamera) {
        const i = this.object.position;
        pt.copy(i).sub(this.target);
        let r = pt.length();
        r *= Math.tan(this.object.fov / 2 * Math.PI / 180), this._panLeft(2 * e * r / n.clientHeight, this.object.matrix), this._panUp(2 * t * r / n.clientHeight, this.object.matrix);
      } else this.object.isOrthographicCamera ? (this._panLeft(e * (this.object.right - this.object.left) / this.object.zoom / n.clientWidth, this.object.matrix), this._panUp(t * (this.object.top - this.object.bottom) / this.object.zoom / n.clientHeight, this.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), this.enablePan = false);
    }
    _dollyOut(e) {
      this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale /= e : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = false);
    }
    _dollyIn(e) {
      this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale *= e : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = false);
    }
    _updateZoomParameters(e, t) {
      if (!this.zoomToCursor) return;
      this._performCursorZoom = true;
      const n = this.domElement.getBoundingClientRect(), i = e - n.left, r = t - n.top, o = n.width, a = n.height;
      this._mouse.x = i / o * 2 - 1, this._mouse.y = -(r / a) * 2 + 1, this._dollyDirection.set(this._mouse.x, this._mouse.y, 1).unproject(this.object).sub(this.object.position).normalize();
    }
    _clampDistance(e) {
      return Math.max(this.minDistance, Math.min(this.maxDistance, e));
    }
    _handleMouseDownRotate(e) {
      this._rotateStart.set(e.clientX, e.clientY);
    }
    _handleMouseDownDolly(e) {
      this._updateZoomParameters(e.clientX, e.clientX), this._dollyStart.set(e.clientX, e.clientY);
    }
    _handleMouseDownPan(e) {
      this._panStart.set(e.clientX, e.clientY);
    }
    _handleMouseMoveRotate(e) {
      this._rotateEnd.set(e.clientX, e.clientY), this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
      const t = this.domElement;
      this._rotateLeft(Dt * this._rotateDelta.x / t.clientHeight), this._rotateUp(Dt * this._rotateDelta.y / t.clientHeight), this._rotateStart.copy(this._rotateEnd), this.update();
    }
    _handleMouseMoveDolly(e) {
      this._dollyEnd.set(e.clientX, e.clientY), this._dollyDelta.subVectors(this._dollyEnd, this._dollyStart), this._dollyDelta.y > 0 ? this._dollyOut(this._getZoomScale(this._dollyDelta.y)) : this._dollyDelta.y < 0 && this._dollyIn(this._getZoomScale(this._dollyDelta.y)), this._dollyStart.copy(this._dollyEnd), this.update();
    }
    _handleMouseMovePan(e) {
      this._panEnd.set(e.clientX, e.clientY), this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd), this.update();
    }
    _handleMouseWheel(e) {
      this._updateZoomParameters(e.clientX, e.clientY), e.deltaY < 0 ? this._dollyIn(this._getZoomScale(e.deltaY)) : e.deltaY > 0 && this._dollyOut(this._getZoomScale(e.deltaY)), this.update();
    }
    _handleKeyDown(e) {
      let t = false;
      switch (e.code) {
        case this.keys.UP:
          e.ctrlKey || e.metaKey || e.shiftKey ? this._rotateUp(Dt * this.rotateSpeed / this.domElement.clientHeight) : this._pan(0, this.keyPanSpeed), t = true;
          break;
        case this.keys.BOTTOM:
          e.ctrlKey || e.metaKey || e.shiftKey ? this._rotateUp(-Dt * this.rotateSpeed / this.domElement.clientHeight) : this._pan(0, -this.keyPanSpeed), t = true;
          break;
        case this.keys.LEFT:
          e.ctrlKey || e.metaKey || e.shiftKey ? this._rotateLeft(Dt * this.rotateSpeed / this.domElement.clientHeight) : this._pan(this.keyPanSpeed, 0), t = true;
          break;
        case this.keys.RIGHT:
          e.ctrlKey || e.metaKey || e.shiftKey ? this._rotateLeft(-Dt * this.rotateSpeed / this.domElement.clientHeight) : this._pan(-this.keyPanSpeed, 0), t = true;
          break;
      }
      t && (e.preventDefault(), this.update());
    }
    _handleTouchStartRotate(e) {
      if (this._pointers.length === 1) this._rotateStart.set(e.pageX, e.pageY);
      else {
        const t = this._getSecondPointerPosition(e), n = 0.5 * (e.pageX + t.x), i = 0.5 * (e.pageY + t.y);
        this._rotateStart.set(n, i);
      }
    }
    _handleTouchStartPan(e) {
      if (this._pointers.length === 1) this._panStart.set(e.pageX, e.pageY);
      else {
        const t = this._getSecondPointerPosition(e), n = 0.5 * (e.pageX + t.x), i = 0.5 * (e.pageY + t.y);
        this._panStart.set(n, i);
      }
    }
    _handleTouchStartDolly(e) {
      const t = this._getSecondPointerPosition(e), n = e.pageX - t.x, i = e.pageY - t.y, r = Math.sqrt(n * n + i * i);
      this._dollyStart.set(0, r);
    }
    _handleTouchStartDollyPan(e) {
      this.enableZoom && this._handleTouchStartDolly(e), this.enablePan && this._handleTouchStartPan(e);
    }
    _handleTouchStartDollyRotate(e) {
      this.enableZoom && this._handleTouchStartDolly(e), this.enableRotate && this._handleTouchStartRotate(e);
    }
    _handleTouchMoveRotate(e) {
      if (this._pointers.length == 1) this._rotateEnd.set(e.pageX, e.pageY);
      else {
        const n = this._getSecondPointerPosition(e), i = 0.5 * (e.pageX + n.x), r = 0.5 * (e.pageY + n.y);
        this._rotateEnd.set(i, r);
      }
      this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
      const t = this.domElement;
      this._rotateLeft(Dt * this._rotateDelta.x / t.clientHeight), this._rotateUp(Dt * this._rotateDelta.y / t.clientHeight), this._rotateStart.copy(this._rotateEnd);
    }
    _handleTouchMovePan(e) {
      if (this._pointers.length === 1) this._panEnd.set(e.pageX, e.pageY);
      else {
        const t = this._getSecondPointerPosition(e), n = 0.5 * (e.pageX + t.x), i = 0.5 * (e.pageY + t.y);
        this._panEnd.set(n, i);
      }
      this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd);
    }
    _handleTouchMoveDolly(e) {
      const t = this._getSecondPointerPosition(e), n = e.pageX - t.x, i = e.pageY - t.y, r = Math.sqrt(n * n + i * i);
      this._dollyEnd.set(0, r), this._dollyDelta.set(0, Math.pow(this._dollyEnd.y / this._dollyStart.y, this.zoomSpeed)), this._dollyOut(this._dollyDelta.y), this._dollyStart.copy(this._dollyEnd);
      const o = (e.pageX + t.x) * 0.5, a = (e.pageY + t.y) * 0.5;
      this._updateZoomParameters(o, a);
    }
    _handleTouchMoveDollyPan(e) {
      this.enableZoom && this._handleTouchMoveDolly(e), this.enablePan && this._handleTouchMovePan(e);
    }
    _handleTouchMoveDollyRotate(e) {
      this.enableZoom && this._handleTouchMoveDolly(e), this.enableRotate && this._handleTouchMoveRotate(e);
    }
    _addPointer(e) {
      this._pointers.push(e.pointerId);
    }
    _removePointer(e) {
      delete this._pointerPositions[e.pointerId];
      for (let t = 0; t < this._pointers.length; t++) if (this._pointers[t] == e.pointerId) {
        this._pointers.splice(t, 1);
        return;
      }
    }
    _isTrackingPointer(e) {
      for (let t = 0; t < this._pointers.length; t++) if (this._pointers[t] == e.pointerId) return true;
      return false;
    }
    _trackPointer(e) {
      let t = this._pointerPositions[e.pointerId];
      t === void 0 && (t = new ye(), this._pointerPositions[e.pointerId] = t), t.set(e.pageX, e.pageY);
    }
    _getSecondPointerPosition(e) {
      const t = e.pointerId === this._pointers[0] ? this._pointers[1] : this._pointers[0];
      return this._pointerPositions[t];
    }
    _customWheelEvent(e) {
      const t = e.deltaMode, n = {
        clientX: e.clientX,
        clientY: e.clientY,
        deltaY: e.deltaY
      };
      switch (t) {
        case 1:
          n.deltaY *= 16;
          break;
        case 2:
          n.deltaY *= 100;
          break;
      }
      return e.ctrlKey && !this._controlActive && (n.deltaY *= 10), n;
    }
  }
  function w0(s) {
    this.enabled !== false && (this._pointers.length === 0 && (this.domElement.setPointerCapture(s.pointerId), this.domElement.addEventListener("pointermove", this._onPointerMove), this.domElement.addEventListener("pointerup", this._onPointerUp)), !this._isTrackingPointer(s) && (this._addPointer(s), s.pointerType === "touch" ? this._onTouchStart(s) : this._onMouseDown(s)));
  }
  function R0(s) {
    this.enabled !== false && (s.pointerType === "touch" ? this._onTouchMove(s) : this._onMouseMove(s));
  }
  function C0(s) {
    switch (this._removePointer(s), this._pointers.length) {
      case 0:
        this.domElement.releasePointerCapture(s.pointerId), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.domElement.removeEventListener("pointerup", this._onPointerUp), this.dispatchEvent($h), this.state = et.NONE;
        break;
      case 1:
        const e = this._pointers[0], t = this._pointerPositions[e];
        this._onTouchStart({
          pointerId: e,
          pageX: t.x,
          pageY: t.y
        });
        break;
    }
  }
  function P0(s) {
    let e;
    switch (s.button) {
      case 0:
        e = this.mouseButtons.LEFT;
        break;
      case 1:
        e = this.mouseButtons.MIDDLE;
        break;
      case 2:
        e = this.mouseButtons.RIGHT;
        break;
      default:
        e = -1;
    }
    switch (e) {
      case Xi.DOLLY:
        if (this.enableZoom === false) return;
        this._handleMouseDownDolly(s), this.state = et.DOLLY;
        break;
      case Xi.ROTATE:
        if (s.ctrlKey || s.metaKey || s.shiftKey) {
          if (this.enablePan === false) return;
          this._handleMouseDownPan(s), this.state = et.PAN;
        } else {
          if (this.enableRotate === false) return;
          this._handleMouseDownRotate(s), this.state = et.ROTATE;
        }
        break;
      case Xi.PAN:
        if (s.ctrlKey || s.metaKey || s.shiftKey) {
          if (this.enableRotate === false) return;
          this._handleMouseDownRotate(s), this.state = et.ROTATE;
        } else {
          if (this.enablePan === false) return;
          this._handleMouseDownPan(s), this.state = et.PAN;
        }
        break;
      default:
        this.state = et.NONE;
    }
    this.state !== et.NONE && this.dispatchEvent(mc);
  }
  function I0(s) {
    switch (this.state) {
      case et.ROTATE:
        if (this.enableRotate === false) return;
        this._handleMouseMoveRotate(s);
        break;
      case et.DOLLY:
        if (this.enableZoom === false) return;
        this._handleMouseMoveDolly(s);
        break;
      case et.PAN:
        if (this.enablePan === false) return;
        this._handleMouseMovePan(s);
        break;
    }
  }
  function L0(s) {
    this.enabled === false || this.enableZoom === false || this.state !== et.NONE || (s.preventDefault(), this.dispatchEvent(mc), this._handleMouseWheel(this._customWheelEvent(s)), this.dispatchEvent($h));
  }
  function D0(s) {
    this.enabled === false || this.enablePan === false || this._handleKeyDown(s);
  }
  function U0(s) {
    switch (this._trackPointer(s), this._pointers.length) {
      case 1:
        switch (this.touches.ONE) {
          case Bi.ROTATE:
            if (this.enableRotate === false) return;
            this._handleTouchStartRotate(s), this.state = et.TOUCH_ROTATE;
            break;
          case Bi.PAN:
            if (this.enablePan === false) return;
            this._handleTouchStartPan(s), this.state = et.TOUCH_PAN;
            break;
          default:
            this.state = et.NONE;
        }
        break;
      case 2:
        switch (this.touches.TWO) {
          case Bi.DOLLY_PAN:
            if (this.enableZoom === false && this.enablePan === false) return;
            this._handleTouchStartDollyPan(s), this.state = et.TOUCH_DOLLY_PAN;
            break;
          case Bi.DOLLY_ROTATE:
            if (this.enableZoom === false && this.enableRotate === false) return;
            this._handleTouchStartDollyRotate(s), this.state = et.TOUCH_DOLLY_ROTATE;
            break;
          default:
            this.state = et.NONE;
        }
        break;
      default:
        this.state = et.NONE;
    }
    this.state !== et.NONE && this.dispatchEvent(mc);
  }
  function N0(s) {
    switch (this._trackPointer(s), this.state) {
      case et.TOUCH_ROTATE:
        if (this.enableRotate === false) return;
        this._handleTouchMoveRotate(s), this.update();
        break;
      case et.TOUCH_PAN:
        if (this.enablePan === false) return;
        this._handleTouchMovePan(s), this.update();
        break;
      case et.TOUCH_DOLLY_PAN:
        if (this.enableZoom === false && this.enablePan === false) return;
        this._handleTouchMoveDollyPan(s), this.update();
        break;
      case et.TOUCH_DOLLY_ROTATE:
        if (this.enableZoom === false && this.enableRotate === false) return;
        this._handleTouchMoveDollyRotate(s), this.update();
        break;
      default:
        this.state = et.NONE;
    }
  }
  function F0(s) {
    this.enabled !== false && s.preventDefault();
  }
  function O0(s) {
    s.key === "Control" && (this._controlActive = true, this.domElement.getRootNode().addEventListener("keyup", this._interceptControlUp, {
      passive: true,
      capture: true
    }));
  }
  function B0(s) {
    s.key === "Control" && (this._controlActive = false, this.domElement.getRootNode().removeEventListener("keyup", this._interceptControlUp, {
      passive: true,
      capture: true
    }));
  }
  const $r = {
    FIELD: {
      W: 105,
      H: 68
    },
    GOAL: {
      W: 7.32,
      H: 2.44,
      D: 1.5
    },
    BALL: {
      R: 0.11
    }
  }, lt = {
    LINE: 0.12,
    CIRCLE_R: 9.15,
    PEN_WIDTH: 40.32,
    PEN_DEPTH: 16.5,
    GOAL_AREA_WIDTH: 18.32,
    GOAL_AREA_DEPTH: 5.5,
    PEN_SPOT: 11,
    D_RADIUS: 9.15,
    CORNER_R: 1
  };
  function k0() {
    const s = new hn(), { W: e, H: t } = $r.FIELD, n = new tt(new fi(e, t), new Ln({
      color: 2981184,
      roughness: 1
    }));
    n.rotation.x = -Math.PI / 2, n.receiveShadow = true, s.add(n);
    const i = 6e-3, r = (d, f, g, _, m = lt.LINE) => {
      const p = g - d, E = _ - f, M = Math.hypot(p, E), b = new fi(M, m), I = new Zt({
        color: 16777215
      }), A = new tt(b, I);
      return A.position.set((d + g) / 2, i, (f + _) / 2), A.rotation.x = -Math.PI / 2, A.rotation.z = Math.atan2(E, p), A.renderOrder = 2, s.add(A), A;
    };
    r(-e / 2, -t / 2, e / 2, -t / 2), r(e / 2, -t / 2, e / 2, t / 2), r(e / 2, t / 2, -e / 2, t / 2), r(-e / 2, t / 2, -e / 2, -t / 2), r(0, -t / 2, 0, t / 2);
    const o = (d, f, g, _, m = 0, p = Math.PI * 2, E = false) => {
      const M = 6e-3 + (E ? 1e-4 : 0), b = new hc(g, _, 64, 1, m, p), I = new Zt({
        color: 16777215,
        side: Yt
      }), A = new tt(b, I);
      return A.position.set(d, M, f), A.rotation.x = -Math.PI / 2, A.renderOrder = 2, s.add(A), A;
    }, a = (d, f, g) => {
      const _ = new lc(g, 24), m = new Zt({
        color: 16777215
      }), p = new tt(_, m);
      return p.position.set(d, 6e-3, f), p.rotation.x = -Math.PI / 2, p.renderOrder = 3, s.add(p), p;
    };
    o(0, 0, lt.CIRCLE_R - lt.LINE / 2, lt.CIRCLE_R + lt.LINE / 2), a(0, 0, lt.LINE * 0.7);
    const c = (d, f, g, _) => {
      const m = (p, E, M, b) => s.add(l(p, E, M, b));
      m(d, f, g, f), m(g, f, g, _), m(g, _, d, _), m(d, _, d, f);
    }, l = (d, f, g, _) => {
      const m = g - d, p = _ - f, E = Math.hypot(m, p), M = new fi(E, lt.LINE), b = new Zt({
        color: 16777215
      }), I = new tt(M, b);
      return I.position.set((d + g) / 2, 6e-3, (f + _) / 2), I.rotation.x = -Math.PI / 2, I.rotation.z = Math.atan2(p, m), I.renderOrder = 2, I;
    }, h = (d) => {
      const f = d < 0 ? -e / 2 : e / 2, g = d;
      c(f, -40.32 / 2, f - g * lt.PEN_DEPTH, lt.PEN_WIDTH / 2), c(f, -18.32 / 2, f - g * lt.GOAL_AREA_DEPTH, lt.GOAL_AREA_WIDTH / 2), a(f - g * lt.PEN_SPOT, 0, lt.LINE * 0.7);
      const _ = f - g * lt.PEN_SPOT, m = Math.abs(lt.PEN_SPOT - lt.PEN_DEPTH), p = Math.acos(m / lt.D_RADIUS), E = g < 0 ? -p : Math.PI - p, M = p * 2;
      o(_, 0, lt.D_RADIUS - lt.LINE / 2, lt.D_RADIUS + lt.LINE / 2, E, M);
    };
    h(-1), h(1);
    const u = (d, f) => {
      const g = d * (e / 2 - 1e-3), _ = f * (t / 2 - 1e-3), m = f > 0 ? d > 0 ? Math.PI : Math.PI * 1.5 : d > 0 ? Math.PI / 2 : 0, p = Math.PI / 2;
      o(g, _, 0, lt.CORNER_R * 2, m, p, true);
    };
    return u(-1, -1), u(1, -1), u(-1, 1), u(1, 1), z0(s), s;
  }
  function z0(s) {
    const { W: e } = $r.FIELD, t = $r.GOAL, n = 0.06, i = (r) => {
      const o = r * (e / 2 + n), a = new hn(), c = new Bs(n, n, t.H, 8), l = new Ln({
        color: 16777215,
        roughness: 0.4
      }), h = new Bs(n, n, t.W, 8), u = new tt(c, l);
      u.position.set(o, t.H / 2, -7.32 / 2);
      const d = new tt(c, l);
      d.position.set(o, t.H / 2, t.W / 2);
      const f = new tt(h, l);
      f.rotation.x = Math.PI / 2, f.position.set(o, t.H, 0), [
        u,
        d,
        f
      ].forEach((A) => {
        A.castShadow = true, A.receiveShadow = true;
      });
      const g = t.D * r, _ = new tt(c, l);
      _.position.set(o + g, t.H / 2, -7.32 / 2);
      const m = new tt(c, l);
      m.position.set(o + g, t.H / 2, t.W / 2);
      const p = new tt(h, l);
      p.rotation.x = Math.PI / 2, p.position.set(o + g, t.H, 0), [
        _,
        m,
        p
      ].forEach((A) => {
        A.castShadow = true, A.receiveShadow = true;
      });
      const E = new Zt({
        color: 13421772,
        wireframe: true,
        side: Yt
      }), M = new yt(), b = new Float32Array([
        o,
        0,
        -7.32 / 2,
        o,
        0,
        t.W / 2,
        o,
        t.H,
        -7.32 / 2,
        o,
        t.H,
        t.W / 2,
        o + g,
        0,
        -7.32 / 2,
        o + g,
        0,
        t.W / 2,
        o + g,
        t.H,
        -7.32 / 2,
        o + g,
        t.H,
        t.W / 2
      ]);
      M.setAttribute("position", new vt(b, 3)), M.setIndex([
        0,
        4,
        6,
        0,
        6,
        2,
        1,
        3,
        7,
        1,
        7,
        5,
        4,
        5,
        7,
        4,
        7,
        6,
        2,
        6,
        7,
        2,
        7,
        3,
        0,
        5,
        4,
        0,
        1,
        5
      ]);
      const I = new tt(M, E);
      I.receiveShadow = true, a.add(u, d, f, _, m, p, I), s.add(a);
    };
    i(-1), i(1);
  }
  class H0 {
    constructor() {
      __publicField(this, "mesh");
      const e = new uc($r.BALL.R, 16, 16), t = new Ln({
        color: 16777215
      });
      this.mesh = new tt(e, t), this.mesh.castShadow = true;
    }
    update(e) {
      this.mesh.position.set(e.x, e.z, e.y);
    }
  }
  function Xl(s, e) {
    if (e === Yu) return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."), s;
    if (e === Oa || e === vh) {
      let t = s.getIndex();
      if (t === null) {
        const o = [], a = s.getAttribute("position");
        if (a !== void 0) {
          for (let c = 0; c < a.count; c++) o.push(c);
          s.setIndex(o), t = s.getIndex();
        } else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."), s;
      }
      const n = t.count - 2, i = [];
      if (e === Oa) for (let o = 1; o <= n; o++) i.push(t.getX(0)), i.push(t.getX(o)), i.push(t.getX(o + 1));
      else for (let o = 0; o < n; o++) o % 2 === 0 ? (i.push(t.getX(o)), i.push(t.getX(o + 1)), i.push(t.getX(o + 2))) : (i.push(t.getX(o + 2)), i.push(t.getX(o + 1)), i.push(t.getX(o)));
      i.length / 3 !== n && console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");
      const r = s.clone();
      return r.setIndex(i), r.clearGroups(), r;
    } else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:", e), s;
  }
  class Zh extends hs {
    constructor(e) {
      super(e), this.dracoLoader = null, this.ktx2Loader = null, this.meshoptDecoder = null, this.pluginCallbacks = [], this.register(function(t) {
        return new Y0(t);
      }), this.register(function(t) {
        return new q0(t);
      }), this.register(function(t) {
        return new nx(t);
      }), this.register(function(t) {
        return new ix(t);
      }), this.register(function(t) {
        return new sx(t);
      }), this.register(function(t) {
        return new K0(t);
      }), this.register(function(t) {
        return new $0(t);
      }), this.register(function(t) {
        return new Z0(t);
      }), this.register(function(t) {
        return new J0(t);
      }), this.register(function(t) {
        return new X0(t);
      }), this.register(function(t) {
        return new Q0(t);
      }), this.register(function(t) {
        return new j0(t);
      }), this.register(function(t) {
        return new tx(t);
      }), this.register(function(t) {
        return new ex(t);
      }), this.register(function(t) {
        return new G0(t);
      }), this.register(function(t) {
        return new rx(t);
      }), this.register(function(t) {
        return new ox(t);
      });
    }
    load(e, t, n, i) {
      const r = this;
      let o;
      if (this.resourcePath !== "") o = this.resourcePath;
      else if (this.path !== "") {
        const l = Is.extractUrlBase(e);
        o = Is.resolveURL(l, this.path);
      } else o = Is.extractUrlBase(e);
      this.manager.itemStart(e);
      const a = function(l) {
        i ? i(l) : console.error(l), r.manager.itemError(e), r.manager.itemEnd(e);
      }, c = new qh(this.manager);
      c.setPath(this.path), c.setResponseType("arraybuffer"), c.setRequestHeader(this.requestHeader), c.setWithCredentials(this.withCredentials), c.load(e, function(l) {
        try {
          r.parse(l, o, function(h) {
            t(h), r.manager.itemEnd(e);
          }, a);
        } catch (h) {
          a(h);
        }
      }, n, a);
    }
    setDRACOLoader(e) {
      return this.dracoLoader = e, this;
    }
    setKTX2Loader(e) {
      return this.ktx2Loader = e, this;
    }
    setMeshoptDecoder(e) {
      return this.meshoptDecoder = e, this;
    }
    register(e) {
      return this.pluginCallbacks.indexOf(e) === -1 && this.pluginCallbacks.push(e), this;
    }
    unregister(e) {
      return this.pluginCallbacks.indexOf(e) !== -1 && this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e), 1), this;
    }
    parse(e, t, n, i) {
      let r;
      const o = {}, a = {}, c = new TextDecoder();
      if (typeof e == "string") r = JSON.parse(e);
      else if (e instanceof ArrayBuffer) if (c.decode(new Uint8Array(e, 0, 4)) === Jh) {
        try {
          o[Ue.KHR_BINARY_GLTF] = new ax(e);
        } catch (u) {
          i && i(u);
          return;
        }
        r = JSON.parse(o[Ue.KHR_BINARY_GLTF].content);
      } else r = JSON.parse(c.decode(e));
      else r = e;
      if (r.asset === void 0 || r.asset.version[0] < 2) {
        i && i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
        return;
      }
      const l = new yx(r, {
        path: t || this.resourcePath || "",
        crossOrigin: this.crossOrigin,
        requestHeader: this.requestHeader,
        manager: this.manager,
        ktx2Loader: this.ktx2Loader,
        meshoptDecoder: this.meshoptDecoder
      });
      l.fileLoader.setRequestHeader(this.requestHeader);
      for (let h = 0; h < this.pluginCallbacks.length; h++) {
        const u = this.pluginCallbacks[h](l);
        u.name || console.error("THREE.GLTFLoader: Invalid plugin found: missing name"), a[u.name] = u, o[u.name] = true;
      }
      if (r.extensionsUsed) for (let h = 0; h < r.extensionsUsed.length; ++h) {
        const u = r.extensionsUsed[h], d = r.extensionsRequired || [];
        switch (u) {
          case Ue.KHR_MATERIALS_UNLIT:
            o[u] = new W0();
            break;
          case Ue.KHR_DRACO_MESH_COMPRESSION:
            o[u] = new cx(r, this.dracoLoader);
            break;
          case Ue.KHR_TEXTURE_TRANSFORM:
            o[u] = new lx();
            break;
          case Ue.KHR_MESH_QUANTIZATION:
            o[u] = new hx();
            break;
          default:
            d.indexOf(u) >= 0 && a[u] === void 0 && console.warn('THREE.GLTFLoader: Unknown extension "' + u + '".');
        }
      }
      l.setExtensions(o), l.setPlugins(a), l.parse(n, i);
    }
    parseAsync(e, t) {
      const n = this;
      return new Promise(function(i, r) {
        n.parse(e, t, i, r);
      });
    }
  }
  function V0() {
    let s = {};
    return {
      get: function(e) {
        return s[e];
      },
      add: function(e, t) {
        s[e] = t;
      },
      remove: function(e) {
        delete s[e];
      },
      removeAll: function() {
        s = {};
      }
    };
  }
  const Ue = {
    KHR_BINARY_GLTF: "KHR_binary_glTF",
    KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
    KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
    KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat",
    KHR_MATERIALS_DISPERSION: "KHR_materials_dispersion",
    KHR_MATERIALS_IOR: "KHR_materials_ior",
    KHR_MATERIALS_SHEEN: "KHR_materials_sheen",
    KHR_MATERIALS_SPECULAR: "KHR_materials_specular",
    KHR_MATERIALS_TRANSMISSION: "KHR_materials_transmission",
    KHR_MATERIALS_IRIDESCENCE: "KHR_materials_iridescence",
    KHR_MATERIALS_ANISOTROPY: "KHR_materials_anisotropy",
    KHR_MATERIALS_UNLIT: "KHR_materials_unlit",
    KHR_MATERIALS_VOLUME: "KHR_materials_volume",
    KHR_TEXTURE_BASISU: "KHR_texture_basisu",
    KHR_TEXTURE_TRANSFORM: "KHR_texture_transform",
    KHR_MESH_QUANTIZATION: "KHR_mesh_quantization",
    KHR_MATERIALS_EMISSIVE_STRENGTH: "KHR_materials_emissive_strength",
    EXT_MATERIALS_BUMP: "EXT_materials_bump",
    EXT_TEXTURE_WEBP: "EXT_texture_webp",
    EXT_TEXTURE_AVIF: "EXT_texture_avif",
    EXT_MESHOPT_COMPRESSION: "EXT_meshopt_compression",
    EXT_MESH_GPU_INSTANCING: "EXT_mesh_gpu_instancing"
  };
  class G0 {
    constructor(e) {
      this.parser = e, this.name = Ue.KHR_LIGHTS_PUNCTUAL, this.cache = {
        refs: {},
        uses: {}
      };
    }
    _markDefs() {
      const e = this.parser, t = this.parser.json.nodes || [];
      for (let n = 0, i = t.length; n < i; n++) {
        const r = t[n];
        r.extensions && r.extensions[this.name] && r.extensions[this.name].light !== void 0 && e._addNodeRef(this.cache, r.extensions[this.name].light);
      }
    }
    _loadLight(e) {
      const t = this.parser, n = "light:" + e;
      let i = t.cache.get(n);
      if (i) return i;
      const r = t.json, c = ((r.extensions && r.extensions[this.name] || {}).lights || [])[e];
      let l;
      const h = new Se(16777215);
      c.color !== void 0 && h.setRGB(c.color[0], c.color[1], c.color[2], Et);
      const u = c.range !== void 0 ? c.range : 0;
      switch (c.type) {
        case "directional":
          l = new jh(h), l.target.position.set(0, 0, -1), l.add(l.target);
          break;
        case "point":
          l = new r0(h), l.distance = u;
          break;
        case "spot":
          l = new i0(h), l.distance = u, c.spot = c.spot || {}, c.spot.innerConeAngle = c.spot.innerConeAngle !== void 0 ? c.spot.innerConeAngle : 0, c.spot.outerConeAngle = c.spot.outerConeAngle !== void 0 ? c.spot.outerConeAngle : Math.PI / 4, l.angle = c.spot.outerConeAngle, l.penumbra = 1 - c.spot.innerConeAngle / c.spot.outerConeAngle, l.target.position.set(0, 0, -1), l.add(l.target);
          break;
        default:
          throw new Error("THREE.GLTFLoader: Unexpected light type: " + c.type);
      }
      return l.position.set(0, 0, 0), l.decay = 2, Tn(l, c), c.intensity !== void 0 && (l.intensity = c.intensity), l.name = t.createUniqueName(c.name || "light_" + e), i = Promise.resolve(l), t.cache.add(n, i), i;
    }
    getDependency(e, t) {
      if (e === "light") return this._loadLight(t);
    }
    createNodeAttachment(e) {
      const t = this, n = this.parser, r = n.json.nodes[e], a = (r.extensions && r.extensions[this.name] || {}).light;
      return a === void 0 ? null : this._loadLight(a).then(function(c) {
        return n._getNodeRef(t.cache, a, c);
      });
    }
  }
  class W0 {
    constructor() {
      this.name = Ue.KHR_MATERIALS_UNLIT;
    }
    getMaterialType() {
      return Zt;
    }
    extendParams(e, t, n) {
      const i = [];
      e.color = new Se(1, 1, 1), e.opacity = 1;
      const r = t.pbrMetallicRoughness;
      if (r) {
        if (Array.isArray(r.baseColorFactor)) {
          const o = r.baseColorFactor;
          e.color.setRGB(o[0], o[1], o[2], Et), e.opacity = o[3];
        }
        r.baseColorTexture !== void 0 && i.push(n.assignTexture(e, "map", r.baseColorTexture, Rt));
      }
      return Promise.all(i);
    }
  }
  class X0 {
    constructor(e) {
      this.parser = e, this.name = Ue.KHR_MATERIALS_EMISSIVE_STRENGTH;
    }
    extendMaterialParams(e, t) {
      const i = this.parser.json.materials[e];
      if (!i.extensions || !i.extensions[this.name]) return Promise.resolve();
      const r = i.extensions[this.name].emissiveStrength;
      return r !== void 0 && (t.emissiveIntensity = r), Promise.resolve();
    }
  }
  class Y0 {
    constructor(e) {
      this.parser = e, this.name = Ue.KHR_MATERIALS_CLEARCOAT;
    }
    getMaterialType(e) {
      const n = this.parser.json.materials[e];
      return !n.extensions || !n.extensions[this.name] ? null : pn;
    }
    extendMaterialParams(e, t) {
      const n = this.parser, i = n.json.materials[e];
      if (!i.extensions || !i.extensions[this.name]) return Promise.resolve();
      const r = [], o = i.extensions[this.name];
      if (o.clearcoatFactor !== void 0 && (t.clearcoat = o.clearcoatFactor), o.clearcoatTexture !== void 0 && r.push(n.assignTexture(t, "clearcoatMap", o.clearcoatTexture)), o.clearcoatRoughnessFactor !== void 0 && (t.clearcoatRoughness = o.clearcoatRoughnessFactor), o.clearcoatRoughnessTexture !== void 0 && r.push(n.assignTexture(t, "clearcoatRoughnessMap", o.clearcoatRoughnessTexture)), o.clearcoatNormalTexture !== void 0 && (r.push(n.assignTexture(t, "clearcoatNormalMap", o.clearcoatNormalTexture)), o.clearcoatNormalTexture.scale !== void 0)) {
        const a = o.clearcoatNormalTexture.scale;
        t.clearcoatNormalScale = new ye(a, a);
      }
      return Promise.all(r);
    }
  }
  class q0 {
    constructor(e) {
      this.parser = e, this.name = Ue.KHR_MATERIALS_DISPERSION;
    }
    getMaterialType(e) {
      const n = this.parser.json.materials[e];
      return !n.extensions || !n.extensions[this.name] ? null : pn;
    }
    extendMaterialParams(e, t) {
      const i = this.parser.json.materials[e];
      if (!i.extensions || !i.extensions[this.name]) return Promise.resolve();
      const r = i.extensions[this.name];
      return t.dispersion = r.dispersion !== void 0 ? r.dispersion : 0, Promise.resolve();
    }
  }
  class j0 {
    constructor(e) {
      this.parser = e, this.name = Ue.KHR_MATERIALS_IRIDESCENCE;
    }
    getMaterialType(e) {
      const n = this.parser.json.materials[e];
      return !n.extensions || !n.extensions[this.name] ? null : pn;
    }
    extendMaterialParams(e, t) {
      const n = this.parser, i = n.json.materials[e];
      if (!i.extensions || !i.extensions[this.name]) return Promise.resolve();
      const r = [], o = i.extensions[this.name];
      return o.iridescenceFactor !== void 0 && (t.iridescence = o.iridescenceFactor), o.iridescenceTexture !== void 0 && r.push(n.assignTexture(t, "iridescenceMap", o.iridescenceTexture)), o.iridescenceIor !== void 0 && (t.iridescenceIOR = o.iridescenceIor), t.iridescenceThicknessRange === void 0 && (t.iridescenceThicknessRange = [
        100,
        400
      ]), o.iridescenceThicknessMinimum !== void 0 && (t.iridescenceThicknessRange[0] = o.iridescenceThicknessMinimum), o.iridescenceThicknessMaximum !== void 0 && (t.iridescenceThicknessRange[1] = o.iridescenceThicknessMaximum), o.iridescenceThicknessTexture !== void 0 && r.push(n.assignTexture(t, "iridescenceThicknessMap", o.iridescenceThicknessTexture)), Promise.all(r);
    }
  }
  class K0 {
    constructor(e) {
      this.parser = e, this.name = Ue.KHR_MATERIALS_SHEEN;
    }
    getMaterialType(e) {
      const n = this.parser.json.materials[e];
      return !n.extensions || !n.extensions[this.name] ? null : pn;
    }
    extendMaterialParams(e, t) {
      const n = this.parser, i = n.json.materials[e];
      if (!i.extensions || !i.extensions[this.name]) return Promise.resolve();
      const r = [];
      t.sheenColor = new Se(0, 0, 0), t.sheenRoughness = 0, t.sheen = 1;
      const o = i.extensions[this.name];
      if (o.sheenColorFactor !== void 0) {
        const a = o.sheenColorFactor;
        t.sheenColor.setRGB(a[0], a[1], a[2], Et);
      }
      return o.sheenRoughnessFactor !== void 0 && (t.sheenRoughness = o.sheenRoughnessFactor), o.sheenColorTexture !== void 0 && r.push(n.assignTexture(t, "sheenColorMap", o.sheenColorTexture, Rt)), o.sheenRoughnessTexture !== void 0 && r.push(n.assignTexture(t, "sheenRoughnessMap", o.sheenRoughnessTexture)), Promise.all(r);
    }
  }
  class $0 {
    constructor(e) {
      this.parser = e, this.name = Ue.KHR_MATERIALS_TRANSMISSION;
    }
    getMaterialType(e) {
      const n = this.parser.json.materials[e];
      return !n.extensions || !n.extensions[this.name] ? null : pn;
    }
    extendMaterialParams(e, t) {
      const n = this.parser, i = n.json.materials[e];
      if (!i.extensions || !i.extensions[this.name]) return Promise.resolve();
      const r = [], o = i.extensions[this.name];
      return o.transmissionFactor !== void 0 && (t.transmission = o.transmissionFactor), o.transmissionTexture !== void 0 && r.push(n.assignTexture(t, "transmissionMap", o.transmissionTexture)), Promise.all(r);
    }
  }
  class Z0 {
    constructor(e) {
      this.parser = e, this.name = Ue.KHR_MATERIALS_VOLUME;
    }
    getMaterialType(e) {
      const n = this.parser.json.materials[e];
      return !n.extensions || !n.extensions[this.name] ? null : pn;
    }
    extendMaterialParams(e, t) {
      const n = this.parser, i = n.json.materials[e];
      if (!i.extensions || !i.extensions[this.name]) return Promise.resolve();
      const r = [], o = i.extensions[this.name];
      t.thickness = o.thicknessFactor !== void 0 ? o.thicknessFactor : 0, o.thicknessTexture !== void 0 && r.push(n.assignTexture(t, "thicknessMap", o.thicknessTexture)), t.attenuationDistance = o.attenuationDistance || 1 / 0;
      const a = o.attenuationColor || [
        1,
        1,
        1
      ];
      return t.attenuationColor = new Se().setRGB(a[0], a[1], a[2], Et), Promise.all(r);
    }
  }
  class J0 {
    constructor(e) {
      this.parser = e, this.name = Ue.KHR_MATERIALS_IOR;
    }
    getMaterialType(e) {
      const n = this.parser.json.materials[e];
      return !n.extensions || !n.extensions[this.name] ? null : pn;
    }
    extendMaterialParams(e, t) {
      const i = this.parser.json.materials[e];
      if (!i.extensions || !i.extensions[this.name]) return Promise.resolve();
      const r = i.extensions[this.name];
      return t.ior = r.ior !== void 0 ? r.ior : 1.5, Promise.resolve();
    }
  }
  class Q0 {
    constructor(e) {
      this.parser = e, this.name = Ue.KHR_MATERIALS_SPECULAR;
    }
    getMaterialType(e) {
      const n = this.parser.json.materials[e];
      return !n.extensions || !n.extensions[this.name] ? null : pn;
    }
    extendMaterialParams(e, t) {
      const n = this.parser, i = n.json.materials[e];
      if (!i.extensions || !i.extensions[this.name]) return Promise.resolve();
      const r = [], o = i.extensions[this.name];
      t.specularIntensity = o.specularFactor !== void 0 ? o.specularFactor : 1, o.specularTexture !== void 0 && r.push(n.assignTexture(t, "specularIntensityMap", o.specularTexture));
      const a = o.specularColorFactor || [
        1,
        1,
        1
      ];
      return t.specularColor = new Se().setRGB(a[0], a[1], a[2], Et), o.specularColorTexture !== void 0 && r.push(n.assignTexture(t, "specularColorMap", o.specularColorTexture, Rt)), Promise.all(r);
    }
  }
  class ex {
    constructor(e) {
      this.parser = e, this.name = Ue.EXT_MATERIALS_BUMP;
    }
    getMaterialType(e) {
      const n = this.parser.json.materials[e];
      return !n.extensions || !n.extensions[this.name] ? null : pn;
    }
    extendMaterialParams(e, t) {
      const n = this.parser, i = n.json.materials[e];
      if (!i.extensions || !i.extensions[this.name]) return Promise.resolve();
      const r = [], o = i.extensions[this.name];
      return t.bumpScale = o.bumpFactor !== void 0 ? o.bumpFactor : 1, o.bumpTexture !== void 0 && r.push(n.assignTexture(t, "bumpMap", o.bumpTexture)), Promise.all(r);
    }
  }
  class tx {
    constructor(e) {
      this.parser = e, this.name = Ue.KHR_MATERIALS_ANISOTROPY;
    }
    getMaterialType(e) {
      const n = this.parser.json.materials[e];
      return !n.extensions || !n.extensions[this.name] ? null : pn;
    }
    extendMaterialParams(e, t) {
      const n = this.parser, i = n.json.materials[e];
      if (!i.extensions || !i.extensions[this.name]) return Promise.resolve();
      const r = [], o = i.extensions[this.name];
      return o.anisotropyStrength !== void 0 && (t.anisotropy = o.anisotropyStrength), o.anisotropyRotation !== void 0 && (t.anisotropyRotation = o.anisotropyRotation), o.anisotropyTexture !== void 0 && r.push(n.assignTexture(t, "anisotropyMap", o.anisotropyTexture)), Promise.all(r);
    }
  }
  class nx {
    constructor(e) {
      this.parser = e, this.name = Ue.KHR_TEXTURE_BASISU;
    }
    loadTexture(e) {
      const t = this.parser, n = t.json, i = n.textures[e];
      if (!i.extensions || !i.extensions[this.name]) return null;
      const r = i.extensions[this.name], o = t.options.ktx2Loader;
      if (!o) {
        if (n.extensionsRequired && n.extensionsRequired.indexOf(this.name) >= 0) throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");
        return null;
      }
      return t.loadTextureImage(e, r.source, o);
    }
  }
  class ix {
    constructor(e) {
      this.parser = e, this.name = Ue.EXT_TEXTURE_WEBP, this.isSupported = null;
    }
    loadTexture(e) {
      const t = this.name, n = this.parser, i = n.json, r = i.textures[e];
      if (!r.extensions || !r.extensions[t]) return null;
      const o = r.extensions[t], a = i.images[o.source];
      let c = n.textureLoader;
      if (a.uri) {
        const l = n.options.manager.getHandler(a.uri);
        l !== null && (c = l);
      }
      return this.detectSupport().then(function(l) {
        if (l) return n.loadTextureImage(e, o.source, c);
        if (i.extensionsRequired && i.extensionsRequired.indexOf(t) >= 0) throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");
        return n.loadTexture(e);
      });
    }
    detectSupport() {
      return this.isSupported || (this.isSupported = new Promise(function(e) {
        const t = new Image();
        t.src = "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA", t.onload = t.onerror = function() {
          e(t.height === 1);
        };
      })), this.isSupported;
    }
  }
  class sx {
    constructor(e) {
      this.parser = e, this.name = Ue.EXT_TEXTURE_AVIF, this.isSupported = null;
    }
    loadTexture(e) {
      const t = this.name, n = this.parser, i = n.json, r = i.textures[e];
      if (!r.extensions || !r.extensions[t]) return null;
      const o = r.extensions[t], a = i.images[o.source];
      let c = n.textureLoader;
      if (a.uri) {
        const l = n.options.manager.getHandler(a.uri);
        l !== null && (c = l);
      }
      return this.detectSupport().then(function(l) {
        if (l) return n.loadTextureImage(e, o.source, c);
        if (i.extensionsRequired && i.extensionsRequired.indexOf(t) >= 0) throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");
        return n.loadTexture(e);
      });
    }
    detectSupport() {
      return this.isSupported || (this.isSupported = new Promise(function(e) {
        const t = new Image();
        t.src = "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=", t.onload = t.onerror = function() {
          e(t.height === 1);
        };
      })), this.isSupported;
    }
  }
  class rx {
    constructor(e) {
      this.name = Ue.EXT_MESHOPT_COMPRESSION, this.parser = e;
    }
    loadBufferView(e) {
      const t = this.parser.json, n = t.bufferViews[e];
      if (n.extensions && n.extensions[this.name]) {
        const i = n.extensions[this.name], r = this.parser.getDependency("buffer", i.buffer), o = this.parser.options.meshoptDecoder;
        if (!o || !o.supported) {
          if (t.extensionsRequired && t.extensionsRequired.indexOf(this.name) >= 0) throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");
          return null;
        }
        return r.then(function(a) {
          const c = i.byteOffset || 0, l = i.byteLength || 0, h = i.count, u = i.byteStride, d = new Uint8Array(a, c, l);
          return o.decodeGltfBufferAsync ? o.decodeGltfBufferAsync(h, u, d, i.mode, i.filter).then(function(f) {
            return f.buffer;
          }) : o.ready.then(function() {
            const f = new ArrayBuffer(h * u);
            return o.decodeGltfBuffer(new Uint8Array(f), h, u, d, i.mode, i.filter), f;
          });
        });
      } else return null;
    }
  }
  class ox {
    constructor(e) {
      this.name = Ue.EXT_MESH_GPU_INSTANCING, this.parser = e;
    }
    createNodeMesh(e) {
      const t = this.parser.json, n = t.nodes[e];
      if (!n.extensions || !n.extensions[this.name] || n.mesh === void 0) return null;
      const i = t.meshes[n.mesh];
      for (const l of i.primitives) if (l.mode !== Xt.TRIANGLES && l.mode !== Xt.TRIANGLE_STRIP && l.mode !== Xt.TRIANGLE_FAN && l.mode !== void 0) return null;
      const o = n.extensions[this.name].attributes, a = [], c = {};
      for (const l in o) a.push(this.parser.getDependency("accessor", o[l]).then((h) => (c[l] = h, c[l])));
      return a.length < 1 ? null : (a.push(this.parser.createNodeMesh(e)), Promise.all(a).then((l) => {
        const h = l.pop(), u = h.isGroup ? h.children : [
          h
        ], d = l[0].count, f = [];
        for (const g of u) {
          const _ = new Ce(), m = new R(), p = new Ht(), E = new R(1, 1, 1), M = new z_(g.geometry, g.material, d);
          for (let b = 0; b < d; b++) c.TRANSLATION && m.fromBufferAttribute(c.TRANSLATION, b), c.ROTATION && p.fromBufferAttribute(c.ROTATION, b), c.SCALE && E.fromBufferAttribute(c.SCALE, b), M.setMatrixAt(b, _.compose(m, p, E));
          for (const b in c) if (b === "_COLOR_0") {
            const I = c[b];
            M.instanceColor = new za(I.array, I.itemSize, I.normalized);
          } else b !== "TRANSLATION" && b !== "ROTATION" && b !== "SCALE" && g.geometry.setAttribute(b, c[b]);
          ot.prototype.copy.call(M, g), this.parser.assignFinalMaterial(M), f.push(M);
        }
        return h.isGroup ? (h.clear(), h.add(...f), h) : f[0];
      }));
    }
  }
  const Jh = "glTF", bs = 12, Yl = {
    JSON: 1313821514,
    BIN: 5130562
  };
  class ax {
    constructor(e) {
      this.name = Ue.KHR_BINARY_GLTF, this.content = null, this.body = null;
      const t = new DataView(e, 0, bs), n = new TextDecoder();
      if (this.header = {
        magic: n.decode(new Uint8Array(e.slice(0, 4))),
        version: t.getUint32(4, true),
        length: t.getUint32(8, true)
      }, this.header.magic !== Jh) throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
      if (this.header.version < 2) throw new Error("THREE.GLTFLoader: Legacy binary file detected.");
      const i = this.header.length - bs, r = new DataView(e, bs);
      let o = 0;
      for (; o < i; ) {
        const a = r.getUint32(o, true);
        o += 4;
        const c = r.getUint32(o, true);
        if (o += 4, c === Yl.JSON) {
          const l = new Uint8Array(e, bs + o, a);
          this.content = n.decode(l);
        } else if (c === Yl.BIN) {
          const l = bs + o;
          this.body = e.slice(l, l + a);
        }
        o += a;
      }
      if (this.content === null) throw new Error("THREE.GLTFLoader: JSON content not found.");
    }
  }
  class cx {
    constructor(e, t) {
      if (!t) throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
      this.name = Ue.KHR_DRACO_MESH_COMPRESSION, this.json = e, this.dracoLoader = t, this.dracoLoader.preload();
    }
    decodePrimitive(e, t) {
      const n = this.json, i = this.dracoLoader, r = e.extensions[this.name].bufferView, o = e.extensions[this.name].attributes, a = {}, c = {}, l = {};
      for (const h in o) {
        const u = Va[h] || h.toLowerCase();
        a[u] = o[h];
      }
      for (const h in e.attributes) {
        const u = Va[h] || h.toLowerCase();
        if (o[h] !== void 0) {
          const d = n.accessors[e.attributes[h]], f = Ki[d.componentType];
          l[u] = f.name, c[u] = d.normalized === true;
        }
      }
      return t.getDependency("bufferView", r).then(function(h) {
        return new Promise(function(u, d) {
          i.decodeDracoFile(h, function(f) {
            for (const g in f.attributes) {
              const _ = f.attributes[g], m = c[g];
              m !== void 0 && (_.normalized = m);
            }
            u(f);
          }, a, l, Et, d);
        });
      });
    }
  }
  class lx {
    constructor() {
      this.name = Ue.KHR_TEXTURE_TRANSFORM;
    }
    extendTexture(e, t) {
      return (t.texCoord === void 0 || t.texCoord === e.channel) && t.offset === void 0 && t.rotation === void 0 && t.scale === void 0 || (e = e.clone(), t.texCoord !== void 0 && (e.channel = t.texCoord), t.offset !== void 0 && e.offset.fromArray(t.offset), t.rotation !== void 0 && (e.rotation = t.rotation), t.scale !== void 0 && e.repeat.fromArray(t.scale), e.needsUpdate = true), e;
    }
  }
  class hx {
    constructor() {
      this.name = Ue.KHR_MESH_QUANTIZATION;
    }
  }
  class Qh extends Gs {
    constructor(e, t, n, i) {
      super(e, t, n, i);
    }
    copySampleValue_(e) {
      const t = this.resultBuffer, n = this.sampleValues, i = this.valueSize, r = e * i * 3 + i;
      for (let o = 0; o !== i; o++) t[o] = n[r + o];
      return t;
    }
    interpolate_(e, t, n, i) {
      const r = this.resultBuffer, o = this.sampleValues, a = this.valueSize, c = a * 2, l = a * 3, h = i - t, u = (n - t) / h, d = u * u, f = d * u, g = e * l, _ = g - l, m = -2 * f + 3 * d, p = f - d, E = 1 - m, M = p - d + u;
      for (let b = 0; b !== a; b++) {
        const I = o[_ + b + a], A = o[_ + b + c] * h, w = o[g + b + a], U = o[g + b] * h;
        r[b] = E * I + M * A + m * w + p * U;
      }
      return r;
    }
  }
  const ux = new Ht();
  class dx extends Qh {
    interpolate_(e, t, n, i) {
      const r = super.interpolate_(e, t, n, i);
      return ux.fromArray(r).normalize().toArray(r), r;
    }
  }
  const Xt = {
    POINTS: 0,
    LINES: 1,
    LINE_LOOP: 2,
    LINE_STRIP: 3,
    TRIANGLES: 4,
    TRIANGLE_STRIP: 5,
    TRIANGLE_FAN: 6
  }, Ki = {
    5120: Int8Array,
    5121: Uint8Array,
    5122: Int16Array,
    5123: Uint16Array,
    5125: Uint32Array,
    5126: Float32Array
  }, ql = {
    9728: Pt,
    9729: zt,
    9984: ch,
    9985: Rr,
    9986: Ts,
    9987: wn
  }, jl = {
    33071: Xn,
    33648: Vr,
    10497: Qi
  }, qo = {
    SCALAR: 1,
    VEC2: 2,
    VEC3: 3,
    VEC4: 4,
    MAT2: 4,
    MAT3: 9,
    MAT4: 16
  }, Va = {
    POSITION: "position",
    NORMAL: "normal",
    TANGENT: "tangent",
    TEXCOORD_0: "uv",
    TEXCOORD_1: "uv1",
    TEXCOORD_2: "uv2",
    TEXCOORD_3: "uv3",
    COLOR_0: "color",
    WEIGHTS_0: "skinWeight",
    JOINTS_0: "skinIndex"
  }, Hn = {
    scale: "scale",
    translation: "position",
    rotation: "quaternion",
    weights: "morphTargetInfluences"
  }, fx = {
    CUBICSPLINE: void 0,
    LINEAR: Ns,
    STEP: Us
  }, jo = {
    OPAQUE: "OPAQUE",
    MASK: "MASK",
    BLEND: "BLEND"
  };
  function px(s) {
    return s.DefaultMaterial === void 0 && (s.DefaultMaterial = new Ln({
      color: 16777215,
      emissive: 0,
      metalness: 1,
      roughness: 1,
      transparent: false,
      depthTest: true,
      side: Pn
    })), s.DefaultMaterial;
  }
  function oi(s, e, t) {
    for (const n in t.extensions) s[n] === void 0 && (e.userData.gltfExtensions = e.userData.gltfExtensions || {}, e.userData.gltfExtensions[n] = t.extensions[n]);
  }
  function Tn(s, e) {
    e.extras !== void 0 && (typeof e.extras == "object" ? Object.assign(s.userData, e.extras) : console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + e.extras));
  }
  function mx(s, e, t) {
    let n = false, i = false, r = false;
    for (let l = 0, h = e.length; l < h; l++) {
      const u = e[l];
      if (u.POSITION !== void 0 && (n = true), u.NORMAL !== void 0 && (i = true), u.COLOR_0 !== void 0 && (r = true), n && i && r) break;
    }
    if (!n && !i && !r) return Promise.resolve(s);
    const o = [], a = [], c = [];
    for (let l = 0, h = e.length; l < h; l++) {
      const u = e[l];
      if (n) {
        const d = u.POSITION !== void 0 ? t.getDependency("accessor", u.POSITION) : s.attributes.position;
        o.push(d);
      }
      if (i) {
        const d = u.NORMAL !== void 0 ? t.getDependency("accessor", u.NORMAL) : s.attributes.normal;
        a.push(d);
      }
      if (r) {
        const d = u.COLOR_0 !== void 0 ? t.getDependency("accessor", u.COLOR_0) : s.attributes.color;
        c.push(d);
      }
    }
    return Promise.all([
      Promise.all(o),
      Promise.all(a),
      Promise.all(c)
    ]).then(function(l) {
      const h = l[0], u = l[1], d = l[2];
      return n && (s.morphAttributes.position = h), i && (s.morphAttributes.normal = u), r && (s.morphAttributes.color = d), s.morphTargetsRelative = true, s;
    });
  }
  function gx(s, e) {
    if (s.updateMorphTargets(), e.weights !== void 0) for (let t = 0, n = e.weights.length; t < n; t++) s.morphTargetInfluences[t] = e.weights[t];
    if (e.extras && Array.isArray(e.extras.targetNames)) {
      const t = e.extras.targetNames;
      if (s.morphTargetInfluences.length === t.length) {
        s.morphTargetDictionary = {};
        for (let n = 0, i = t.length; n < i; n++) s.morphTargetDictionary[t[n]] = n;
      } else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.");
    }
  }
  function _x(s) {
    let e;
    const t = s.extensions && s.extensions[Ue.KHR_DRACO_MESH_COMPRESSION];
    if (t ? e = "draco:" + t.bufferView + ":" + t.indices + ":" + Ko(t.attributes) : e = s.indices + ":" + Ko(s.attributes) + ":" + s.mode, s.targets !== void 0) for (let n = 0, i = s.targets.length; n < i; n++) e += ":" + Ko(s.targets[n]);
    return e;
  }
  function Ko(s) {
    let e = "";
    const t = Object.keys(s).sort();
    for (let n = 0, i = t.length; n < i; n++) e += t[n] + ":" + s[t[n]] + ";";
    return e;
  }
  function Ga(s) {
    switch (s) {
      case Int8Array:
        return 1 / 127;
      case Uint8Array:
        return 1 / 255;
      case Int16Array:
        return 1 / 32767;
      case Uint16Array:
        return 1 / 65535;
      default:
        throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.");
    }
  }
  function xx(s) {
    return s.search(/\.jpe?g($|\?)/i) > 0 || s.search(/^data\:image\/jpeg/) === 0 ? "image/jpeg" : s.search(/\.webp($|\?)/i) > 0 || s.search(/^data\:image\/webp/) === 0 ? "image/webp" : "image/png";
  }
  const vx = new Ce();
  class yx {
    constructor(e = {}, t = {}) {
      this.json = e, this.extensions = {}, this.plugins = {}, this.options = t, this.cache = new V0(), this.associations = /* @__PURE__ */ new Map(), this.primitiveCache = {}, this.nodeCache = {}, this.meshCache = {
        refs: {},
        uses: {}
      }, this.cameraCache = {
        refs: {},
        uses: {}
      }, this.lightCache = {
        refs: {},
        uses: {}
      }, this.sourceCache = {}, this.textureCache = {}, this.nodeNamesUsed = {};
      let n = false, i = -1, r = false, o = -1;
      if (typeof navigator < "u") {
        const a = navigator.userAgent;
        n = /^((?!chrome|android).)*safari/i.test(a) === true;
        const c = a.match(/Version\/(\d+)/);
        i = n && c ? parseInt(c[1], 10) : -1, r = a.indexOf("Firefox") > -1, o = r ? a.match(/Firefox\/([0-9]+)\./)[1] : -1;
      }
      typeof createImageBitmap > "u" || n && i < 17 || r && o < 98 ? this.textureLoader = new t0(this.options.manager) : this.textureLoader = new c0(this.options.manager), this.textureLoader.setCrossOrigin(this.options.crossOrigin), this.textureLoader.setRequestHeader(this.options.requestHeader), this.fileLoader = new qh(this.options.manager), this.fileLoader.setResponseType("arraybuffer"), this.options.crossOrigin === "use-credentials" && this.fileLoader.setWithCredentials(true);
    }
    setExtensions(e) {
      this.extensions = e;
    }
    setPlugins(e) {
      this.plugins = e;
    }
    parse(e, t) {
      const n = this, i = this.json, r = this.extensions;
      this.cache.removeAll(), this.nodeCache = {}, this._invokeAll(function(o) {
        return o._markDefs && o._markDefs();
      }), Promise.all(this._invokeAll(function(o) {
        return o.beforeRoot && o.beforeRoot();
      })).then(function() {
        return Promise.all([
          n.getDependencies("scene"),
          n.getDependencies("animation"),
          n.getDependencies("camera")
        ]);
      }).then(function(o) {
        const a = {
          scene: o[0][i.scene || 0],
          scenes: o[0],
          animations: o[1],
          cameras: o[2],
          asset: i.asset,
          parser: n,
          userData: {}
        };
        return oi(r, a, i), Tn(a, i), Promise.all(n._invokeAll(function(c) {
          return c.afterRoot && c.afterRoot(a);
        })).then(function() {
          for (const c of a.scenes) c.updateMatrixWorld();
          e(a);
        });
      }).catch(t);
    }
    _markDefs() {
      const e = this.json.nodes || [], t = this.json.skins || [], n = this.json.meshes || [];
      for (let i = 0, r = t.length; i < r; i++) {
        const o = t[i].joints;
        for (let a = 0, c = o.length; a < c; a++) e[o[a]].isBone = true;
      }
      for (let i = 0, r = e.length; i < r; i++) {
        const o = e[i];
        o.mesh !== void 0 && (this._addNodeRef(this.meshCache, o.mesh), o.skin !== void 0 && (n[o.mesh].isSkinnedMesh = true)), o.camera !== void 0 && this._addNodeRef(this.cameraCache, o.camera);
      }
    }
    _addNodeRef(e, t) {
      t !== void 0 && (e.refs[t] === void 0 && (e.refs[t] = e.uses[t] = 0), e.refs[t]++);
    }
    _getNodeRef(e, t, n) {
      if (e.refs[t] <= 1) return n;
      const i = n.clone(), r = (o, a) => {
        const c = this.associations.get(o);
        c != null && this.associations.set(a, c);
        for (const [l, h] of o.children.entries()) r(h, a.children[l]);
      };
      return r(n, i), i.name += "_instance_" + e.uses[t]++, i;
    }
    _invokeOne(e) {
      const t = Object.values(this.plugins);
      t.push(this);
      for (let n = 0; n < t.length; n++) {
        const i = e(t[n]);
        if (i) return i;
      }
      return null;
    }
    _invokeAll(e) {
      const t = Object.values(this.plugins);
      t.unshift(this);
      const n = [];
      for (let i = 0; i < t.length; i++) {
        const r = e(t[i]);
        r && n.push(r);
      }
      return n;
    }
    getDependency(e, t) {
      const n = e + ":" + t;
      let i = this.cache.get(n);
      if (!i) {
        switch (e) {
          case "scene":
            i = this.loadScene(t);
            break;
          case "node":
            i = this._invokeOne(function(r) {
              return r.loadNode && r.loadNode(t);
            });
            break;
          case "mesh":
            i = this._invokeOne(function(r) {
              return r.loadMesh && r.loadMesh(t);
            });
            break;
          case "accessor":
            i = this.loadAccessor(t);
            break;
          case "bufferView":
            i = this._invokeOne(function(r) {
              return r.loadBufferView && r.loadBufferView(t);
            });
            break;
          case "buffer":
            i = this.loadBuffer(t);
            break;
          case "material":
            i = this._invokeOne(function(r) {
              return r.loadMaterial && r.loadMaterial(t);
            });
            break;
          case "texture":
            i = this._invokeOne(function(r) {
              return r.loadTexture && r.loadTexture(t);
            });
            break;
          case "skin":
            i = this.loadSkin(t);
            break;
          case "animation":
            i = this._invokeOne(function(r) {
              return r.loadAnimation && r.loadAnimation(t);
            });
            break;
          case "camera":
            i = this.loadCamera(t);
            break;
          default:
            if (i = this._invokeOne(function(r) {
              return r != this && r.getDependency && r.getDependency(e, t);
            }), !i) throw new Error("Unknown type: " + e);
            break;
        }
        this.cache.add(n, i);
      }
      return i;
    }
    getDependencies(e) {
      let t = this.cache.get(e);
      if (!t) {
        const n = this, i = this.json[e + (e === "mesh" ? "es" : "s")] || [];
        t = Promise.all(i.map(function(r, o) {
          return n.getDependency(e, o);
        })), this.cache.add(e, t);
      }
      return t;
    }
    loadBuffer(e) {
      const t = this.json.buffers[e], n = this.fileLoader;
      if (t.type && t.type !== "arraybuffer") throw new Error("THREE.GLTFLoader: " + t.type + " buffer type is not supported.");
      if (t.uri === void 0 && e === 0) return Promise.resolve(this.extensions[Ue.KHR_BINARY_GLTF].body);
      const i = this.options;
      return new Promise(function(r, o) {
        n.load(Is.resolveURL(t.uri, i.path), r, void 0, function() {
          o(new Error('THREE.GLTFLoader: Failed to load buffer "' + t.uri + '".'));
        });
      });
    }
    loadBufferView(e) {
      const t = this.json.bufferViews[e];
      return this.getDependency("buffer", t.buffer).then(function(n) {
        const i = t.byteLength || 0, r = t.byteOffset || 0;
        return n.slice(r, r + i);
      });
    }
    loadAccessor(e) {
      const t = this, n = this.json, i = this.json.accessors[e];
      if (i.bufferView === void 0 && i.sparse === void 0) {
        const o = qo[i.type], a = Ki[i.componentType], c = i.normalized === true, l = new a(i.count * o);
        return Promise.resolve(new vt(l, o, c));
      }
      const r = [];
      return i.bufferView !== void 0 ? r.push(this.getDependency("bufferView", i.bufferView)) : r.push(null), i.sparse !== void 0 && (r.push(this.getDependency("bufferView", i.sparse.indices.bufferView)), r.push(this.getDependency("bufferView", i.sparse.values.bufferView))), Promise.all(r).then(function(o) {
        const a = o[0], c = qo[i.type], l = Ki[i.componentType], h = l.BYTES_PER_ELEMENT, u = h * c, d = i.byteOffset || 0, f = i.bufferView !== void 0 ? n.bufferViews[i.bufferView].byteStride : void 0, g = i.normalized === true;
        let _, m;
        if (f && f !== u) {
          const p = Math.floor(d / f), E = "InterleavedBuffer:" + i.bufferView + ":" + i.componentType + ":" + p + ":" + i.count;
          let M = t.cache.get(E);
          M || (_ = new l(a, p * f, i.count * f / h), M = new Bh(_, f / h), t.cache.add(E, M)), m = new Os(M, c, d % f / h, g);
        } else a === null ? _ = new l(i.count * c) : _ = new l(a, d, i.count * c), m = new vt(_, c, g);
        if (i.sparse !== void 0) {
          const p = qo.SCALAR, E = Ki[i.sparse.indices.componentType], M = i.sparse.indices.byteOffset || 0, b = i.sparse.values.byteOffset || 0, I = new E(o[1], M, i.sparse.count * p), A = new l(o[2], b, i.sparse.count * c);
          a !== null && (m = new vt(m.array.slice(), m.itemSize, m.normalized)), m.normalized = false;
          for (let w = 0, U = I.length; w < U; w++) {
            const j = I[w];
            if (m.setX(j, A[w * c]), c >= 2 && m.setY(j, A[w * c + 1]), c >= 3 && m.setZ(j, A[w * c + 2]), c >= 4 && m.setW(j, A[w * c + 3]), c >= 5) throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.");
          }
          m.normalized = g;
        }
        return m;
      });
    }
    loadTexture(e) {
      const t = this.json, n = this.options, r = t.textures[e].source, o = t.images[r];
      let a = this.textureLoader;
      if (o.uri) {
        const c = n.manager.getHandler(o.uri);
        c !== null && (a = c);
      }
      return this.loadTextureImage(e, r, a);
    }
    loadTextureImage(e, t, n) {
      const i = this, r = this.json, o = r.textures[e], a = r.images[t], c = (a.uri || a.bufferView) + ":" + o.sampler;
      if (this.textureCache[c]) return this.textureCache[c];
      const l = this.loadImageSource(t, n).then(function(h) {
        h.flipY = false, h.name = o.name || a.name || "", h.name === "" && typeof a.uri == "string" && a.uri.startsWith("data:image/") === false && (h.name = a.uri);
        const d = (r.samplers || {})[o.sampler] || {};
        return h.magFilter = ql[d.magFilter] || zt, h.minFilter = ql[d.minFilter] || wn, h.wrapS = jl[d.wrapS] || Qi, h.wrapT = jl[d.wrapT] || Qi, i.associations.set(h, {
          textures: e
        }), h;
      }).catch(function() {
        return null;
      });
      return this.textureCache[c] = l, l;
    }
    loadImageSource(e, t) {
      const n = this, i = this.json, r = this.options;
      if (this.sourceCache[e] !== void 0) return this.sourceCache[e].then((u) => u.clone());
      const o = i.images[e], a = self.URL || self.webkitURL;
      let c = o.uri || "", l = false;
      if (o.bufferView !== void 0) c = n.getDependency("bufferView", o.bufferView).then(function(u) {
        l = true;
        const d = new Blob([
          u
        ], {
          type: o.mimeType
        });
        return c = a.createObjectURL(d), c;
      });
      else if (o.uri === void 0) throw new Error("THREE.GLTFLoader: Image " + e + " is missing URI and bufferView");
      const h = Promise.resolve(c).then(function(u) {
        return new Promise(function(d, f) {
          let g = d;
          t.isImageBitmapLoader === true && (g = function(_) {
            const m = new mt(_);
            m.needsUpdate = true, d(m);
          }), t.load(Is.resolveURL(u, r.path), g, void 0, f);
        });
      }).then(function(u) {
        return l === true && a.revokeObjectURL(c), Tn(u, o), u.userData.mimeType = o.mimeType || xx(o.uri), u;
      }).catch(function(u) {
        throw console.error("THREE.GLTFLoader: Couldn't load texture", c), u;
      });
      return this.sourceCache[e] = h, h;
    }
    assignTexture(e, t, n, i) {
      const r = this;
      return this.getDependency("texture", n.index).then(function(o) {
        if (!o) return null;
        if (n.texCoord !== void 0 && n.texCoord > 0 && (o = o.clone(), o.channel = n.texCoord), r.extensions[Ue.KHR_TEXTURE_TRANSFORM]) {
          const a = n.extensions !== void 0 ? n.extensions[Ue.KHR_TEXTURE_TRANSFORM] : void 0;
          if (a) {
            const c = r.associations.get(o);
            o = r.extensions[Ue.KHR_TEXTURE_TRANSFORM].extendTexture(o, a), r.associations.set(o, c);
          }
        }
        return i !== void 0 && (o.colorSpace = i), e[t] = o, o;
      });
    }
    assignFinalMaterial(e) {
      const t = e.geometry;
      let n = e.material;
      const i = t.attributes.tangent === void 0, r = t.attributes.color !== void 0, o = t.attributes.normal === void 0;
      if (e.isPoints) {
        const a = "PointsMaterial:" + n.uuid;
        let c = this.cache.get(a);
        c || (c = new Gh(), cn.prototype.copy.call(c, n), c.color.copy(n.color), c.map = n.map, c.sizeAttenuation = false, this.cache.add(a, c)), n = c;
      } else if (e.isLine) {
        const a = "LineBasicMaterial:" + n.uuid;
        let c = this.cache.get(a);
        c || (c = new no(), cn.prototype.copy.call(c, n), c.color.copy(n.color), c.map = n.map, this.cache.add(a, c)), n = c;
      }
      if (i || r || o) {
        let a = "ClonedMaterial:" + n.uuid + ":";
        i && (a += "derivative-tangents:"), r && (a += "vertex-colors:"), o && (a += "flat-shading:");
        let c = this.cache.get(a);
        c || (c = n.clone(), r && (c.vertexColors = true), o && (c.flatShading = true), i && (c.normalScale && (c.normalScale.y *= -1), c.clearcoatNormalScale && (c.clearcoatNormalScale.y *= -1)), this.cache.add(a, c), this.associations.set(c, this.associations.get(n))), n = c;
      }
      e.material = n;
    }
    getMaterialType() {
      return Ln;
    }
    loadMaterial(e) {
      const t = this, n = this.json, i = this.extensions, r = n.materials[e];
      let o;
      const a = {}, c = r.extensions || {}, l = [];
      if (c[Ue.KHR_MATERIALS_UNLIT]) {
        const u = i[Ue.KHR_MATERIALS_UNLIT];
        o = u.getMaterialType(), l.push(u.extendParams(a, r, t));
      } else {
        const u = r.pbrMetallicRoughness || {};
        if (a.color = new Se(1, 1, 1), a.opacity = 1, Array.isArray(u.baseColorFactor)) {
          const d = u.baseColorFactor;
          a.color.setRGB(d[0], d[1], d[2], Et), a.opacity = d[3];
        }
        u.baseColorTexture !== void 0 && l.push(t.assignTexture(a, "map", u.baseColorTexture, Rt)), a.metalness = u.metallicFactor !== void 0 ? u.metallicFactor : 1, a.roughness = u.roughnessFactor !== void 0 ? u.roughnessFactor : 1, u.metallicRoughnessTexture !== void 0 && (l.push(t.assignTexture(a, "metalnessMap", u.metallicRoughnessTexture)), l.push(t.assignTexture(a, "roughnessMap", u.metallicRoughnessTexture))), o = this._invokeOne(function(d) {
          return d.getMaterialType && d.getMaterialType(e);
        }), l.push(Promise.all(this._invokeAll(function(d) {
          return d.extendMaterialParams && d.extendMaterialParams(e, a);
        })));
      }
      r.doubleSided === true && (a.side = Yt);
      const h = r.alphaMode || jo.OPAQUE;
      if (h === jo.BLEND ? (a.transparent = true, a.depthWrite = false) : (a.transparent = false, h === jo.MASK && (a.alphaTest = r.alphaCutoff !== void 0 ? r.alphaCutoff : 0.5)), r.normalTexture !== void 0 && o !== Zt && (l.push(t.assignTexture(a, "normalMap", r.normalTexture)), a.normalScale = new ye(1, 1), r.normalTexture.scale !== void 0)) {
        const u = r.normalTexture.scale;
        a.normalScale.set(u, u);
      }
      if (r.occlusionTexture !== void 0 && o !== Zt && (l.push(t.assignTexture(a, "aoMap", r.occlusionTexture)), r.occlusionTexture.strength !== void 0 && (a.aoMapIntensity = r.occlusionTexture.strength)), r.emissiveFactor !== void 0 && o !== Zt) {
        const u = r.emissiveFactor;
        a.emissive = new Se().setRGB(u[0], u[1], u[2], Et);
      }
      return r.emissiveTexture !== void 0 && o !== Zt && l.push(t.assignTexture(a, "emissiveMap", r.emissiveTexture, Rt)), Promise.all(l).then(function() {
        const u = new o(a);
        return r.name && (u.name = r.name), Tn(u, r), t.associations.set(u, {
          materials: e
        }), r.extensions && oi(i, u, r), u;
      });
    }
    createUniqueName(e) {
      const t = Ke.sanitizeNodeName(e || "");
      return t in this.nodeNamesUsed ? t + "_" + ++this.nodeNamesUsed[t] : (this.nodeNamesUsed[t] = 0, t);
    }
    loadGeometries(e) {
      const t = this, n = this.extensions, i = this.primitiveCache;
      function r(a) {
        return n[Ue.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a, t).then(function(c) {
          return Kl(c, a, t);
        });
      }
      const o = [];
      for (let a = 0, c = e.length; a < c; a++) {
        const l = e[a], h = _x(l), u = i[h];
        if (u) o.push(u.promise);
        else {
          let d;
          l.extensions && l.extensions[Ue.KHR_DRACO_MESH_COMPRESSION] ? d = r(l) : d = Kl(new yt(), l, t), i[h] = {
            primitive: l,
            promise: d
          }, o.push(d);
        }
      }
      return Promise.all(o);
    }
    loadMesh(e) {
      const t = this, n = this.json, i = this.extensions, r = n.meshes[e], o = r.primitives, a = [];
      for (let c = 0, l = o.length; c < l; c++) {
        const h = o[c].material === void 0 ? px(this.cache) : this.getDependency("material", o[c].material);
        a.push(h);
      }
      return a.push(t.loadGeometries(o)), Promise.all(a).then(function(c) {
        const l = c.slice(0, c.length - 1), h = c[c.length - 1], u = [];
        for (let f = 0, g = h.length; f < g; f++) {
          const _ = h[f], m = o[f];
          let p;
          const E = l[f];
          if (m.mode === Xt.TRIANGLES || m.mode === Xt.TRIANGLE_STRIP || m.mode === Xt.TRIANGLE_FAN || m.mode === void 0) p = r.isSkinnedMesh === true ? new O_(_, E) : new tt(_, E), p.isSkinnedMesh === true && p.normalizeSkinWeights(), m.mode === Xt.TRIANGLE_STRIP ? p.geometry = Xl(p.geometry, vh) : m.mode === Xt.TRIANGLE_FAN && (p.geometry = Xl(p.geometry, Oa));
          else if (m.mode === Xt.LINES) p = new cc(_, E);
          else if (m.mode === Xt.LINE_STRIP) p = new ac(_, E);
          else if (m.mode === Xt.LINE_LOOP) p = new H_(_, E);
          else if (m.mode === Xt.POINTS) p = new V_(_, E);
          else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: " + m.mode);
          Object.keys(p.geometry.morphAttributes).length > 0 && gx(p, r), p.name = t.createUniqueName(r.name || "mesh_" + e), Tn(p, r), m.extensions && oi(i, p, m), t.assignFinalMaterial(p), u.push(p);
        }
        for (let f = 0, g = u.length; f < g; f++) t.associations.set(u[f], {
          meshes: e,
          primitives: f
        });
        if (u.length === 1) return r.extensions && oi(i, u[0], r), u[0];
        const d = new hn();
        r.extensions && oi(i, d, r), t.associations.set(d, {
          meshes: e
        });
        for (let f = 0, g = u.length; f < g; f++) d.add(u[f]);
        return d;
      });
    }
    loadCamera(e) {
      let t;
      const n = this.json.cameras[e], i = n[n.type];
      if (!i) {
        console.warn("THREE.GLTFLoader: Missing camera parameters.");
        return;
      }
      return n.type === "perspective" ? t = new Ct(nn.radToDeg(i.yfov), i.aspectRatio || 1, i.znear || 1, i.zfar || 2e6) : n.type === "orthographic" && (t = new sc(-i.xmag, i.xmag, i.ymag, -i.ymag, i.znear, i.zfar)), n.name && (t.name = this.createUniqueName(n.name)), Tn(t, n), Promise.resolve(t);
    }
    loadSkin(e) {
      const t = this.json.skins[e], n = [];
      for (let i = 0, r = t.joints.length; i < r; i++) n.push(this._loadNodeShallow(t.joints[i]));
      return t.inverseBindMatrices !== void 0 ? n.push(this.getDependency("accessor", t.inverseBindMatrices)) : n.push(null), Promise.all(n).then(function(i) {
        const r = i.pop(), o = i, a = [], c = [];
        for (let l = 0, h = o.length; l < h; l++) {
          const u = o[l];
          if (u) {
            a.push(u);
            const d = new Ce();
            r !== null && d.fromArray(r.array, l * 16), c.push(d);
          } else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.', t.joints[l]);
        }
        return new oc(a, c);
      });
    }
    loadAnimation(e) {
      const t = this.json, n = this, i = t.animations[e], r = i.name ? i.name : "animation_" + e, o = [], a = [], c = [], l = [], h = [];
      for (let u = 0, d = i.channels.length; u < d; u++) {
        const f = i.channels[u], g = i.samplers[f.sampler], _ = f.target, m = _.node, p = i.parameters !== void 0 ? i.parameters[g.input] : g.input, E = i.parameters !== void 0 ? i.parameters[g.output] : g.output;
        _.node !== void 0 && (o.push(this.getDependency("node", m)), a.push(this.getDependency("accessor", p)), c.push(this.getDependency("accessor", E)), l.push(g), h.push(_));
      }
      return Promise.all([
        Promise.all(o),
        Promise.all(a),
        Promise.all(c),
        Promise.all(l),
        Promise.all(h)
      ]).then(function(u) {
        const d = u[0], f = u[1], g = u[2], _ = u[3], m = u[4], p = [];
        for (let E = 0, M = d.length; E < M; E++) {
          const b = d[E], I = f[E], A = g[E], w = _[E], U = m[E];
          if (b === void 0) continue;
          b.updateMatrix && b.updateMatrix();
          const j = n._createAnimationTracks(b, I, A, w, U);
          if (j) for (let x = 0; x < j.length; x++) p.push(j[x]);
        }
        return new ks(r, void 0, p);
      });
    }
    createNodeMesh(e) {
      const t = this.json, n = this, i = t.nodes[e];
      return i.mesh === void 0 ? null : n.getDependency("mesh", i.mesh).then(function(r) {
        const o = n._getNodeRef(n.meshCache, i.mesh, r);
        return i.weights !== void 0 && o.traverse(function(a) {
          if (a.isMesh) for (let c = 0, l = i.weights.length; c < l; c++) a.morphTargetInfluences[c] = i.weights[c];
        }), o;
      });
    }
    loadNode(e) {
      const t = this.json, n = this, i = t.nodes[e], r = n._loadNodeShallow(e), o = [], a = i.children || [];
      for (let l = 0, h = a.length; l < h; l++) o.push(n.getDependency("node", a[l]));
      const c = i.skin === void 0 ? Promise.resolve(null) : n.getDependency("skin", i.skin);
      return Promise.all([
        r,
        Promise.all(o),
        c
      ]).then(function(l) {
        const h = l[0], u = l[1], d = l[2];
        d !== null && h.traverse(function(f) {
          f.isSkinnedMesh && f.bind(d, vx);
        });
        for (let f = 0, g = u.length; f < g; f++) h.add(u[f]);
        return h;
      });
    }
    _loadNodeShallow(e) {
      const t = this.json, n = this.extensions, i = this;
      if (this.nodeCache[e] !== void 0) return this.nodeCache[e];
      const r = t.nodes[e], o = r.name ? i.createUniqueName(r.name) : "", a = [], c = i._invokeOne(function(l) {
        return l.createNodeMesh && l.createNodeMesh(e);
      });
      return c && a.push(c), r.camera !== void 0 && a.push(i.getDependency("camera", r.camera).then(function(l) {
        return i._getNodeRef(i.cameraCache, r.camera, l);
      })), i._invokeAll(function(l) {
        return l.createNodeAttachment && l.createNodeAttachment(e);
      }).forEach(function(l) {
        a.push(l);
      }), this.nodeCache[e] = Promise.all(a).then(function(l) {
        let h;
        if (r.isBone === true ? h = new Hh() : l.length > 1 ? h = new hn() : l.length === 1 ? h = l[0] : h = new ot(), h !== l[0]) for (let u = 0, d = l.length; u < d; u++) h.add(l[u]);
        if (r.name && (h.userData.name = r.name, h.name = o), Tn(h, r), r.extensions && oi(n, h, r), r.matrix !== void 0) {
          const u = new Ce();
          u.fromArray(r.matrix), h.applyMatrix4(u);
        } else r.translation !== void 0 && h.position.fromArray(r.translation), r.rotation !== void 0 && h.quaternion.fromArray(r.rotation), r.scale !== void 0 && h.scale.fromArray(r.scale);
        return i.associations.has(h) || i.associations.set(h, {}), i.associations.get(h).nodes = e, h;
      }), this.nodeCache[e];
    }
    loadScene(e) {
      const t = this.extensions, n = this.json.scenes[e], i = this, r = new hn();
      n.name && (r.name = i.createUniqueName(n.name)), Tn(r, n), n.extensions && oi(t, r, n);
      const o = n.nodes || [], a = [];
      for (let c = 0, l = o.length; c < l; c++) a.push(i.getDependency("node", o[c]));
      return Promise.all(a).then(function(c) {
        for (let h = 0, u = c.length; h < u; h++) r.add(c[h]);
        const l = (h) => {
          const u = /* @__PURE__ */ new Map();
          for (const [d, f] of i.associations) (d instanceof cn || d instanceof mt) && u.set(d, f);
          return h.traverse((d) => {
            const f = i.associations.get(d);
            f != null && u.set(d, f);
          }), u;
        };
        return i.associations = l(r), r;
      });
    }
    _createAnimationTracks(e, t, n, i, r) {
      const o = [], a = e.name ? e.name : e.uuid, c = [];
      Hn[r.path] === Hn.weights ? e.traverse(function(d) {
        d.morphTargetInfluences && c.push(d.name ? d.name : d.uuid);
      }) : c.push(a);
      let l;
      switch (Hn[r.path]) {
        case Hn.weights:
          l = ss;
          break;
        case Hn.rotation:
          l = rs;
          break;
        case Hn.position:
        case Hn.scale:
          l = os;
          break;
        default:
          switch (n.itemSize) {
            case 1:
              l = ss;
              break;
            case 2:
            case 3:
            default:
              l = os;
              break;
          }
          break;
      }
      const h = i.interpolation !== void 0 ? fx[i.interpolation] : Ns, u = this._getArrayFromAccessor(n);
      for (let d = 0, f = c.length; d < f; d++) {
        const g = new l(c[d] + "." + Hn[r.path], t.array, u, h);
        i.interpolation === "CUBICSPLINE" && this._createCubicSplineTrackInterpolant(g), o.push(g);
      }
      return o;
    }
    _getArrayFromAccessor(e) {
      let t = e.array;
      if (e.normalized) {
        const n = Ga(t.constructor), i = new Float32Array(t.length);
        for (let r = 0, o = t.length; r < o; r++) i[r] = t[r] * n;
        t = i;
      }
      return t;
    }
    _createCubicSplineTrackInterpolant(e) {
      e.createInterpolant = function(n) {
        const i = this instanceof rs ? dx : Qh;
        return new i(this.times, this.values, this.getValueSize() / 3, n);
      }, e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = true;
    }
  }
  function Mx(s, e, t) {
    const n = e.attributes, i = new dn();
    if (n.POSITION !== void 0) {
      const a = t.json.accessors[n.POSITION], c = a.min, l = a.max;
      if (c !== void 0 && l !== void 0) {
        if (i.set(new R(c[0], c[1], c[2]), new R(l[0], l[1], l[2])), a.normalized) {
          const h = Ga(Ki[a.componentType]);
          i.min.multiplyScalar(h), i.max.multiplyScalar(h);
        }
      } else {
        console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
        return;
      }
    } else return;
    const r = e.targets;
    if (r !== void 0) {
      const a = new R(), c = new R();
      for (let l = 0, h = r.length; l < h; l++) {
        const u = r[l];
        if (u.POSITION !== void 0) {
          const d = t.json.accessors[u.POSITION], f = d.min, g = d.max;
          if (f !== void 0 && g !== void 0) {
            if (c.setX(Math.max(Math.abs(f[0]), Math.abs(g[0]))), c.setY(Math.max(Math.abs(f[1]), Math.abs(g[1]))), c.setZ(Math.max(Math.abs(f[2]), Math.abs(g[2]))), d.normalized) {
              const _ = Ga(Ki[d.componentType]);
              c.multiplyScalar(_);
            }
            a.max(c);
          } else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
        }
      }
      i.expandByVector(a);
    }
    s.boundingBox = i;
    const o = new fn();
    i.getCenter(o.center), o.radius = i.min.distanceTo(i.max) / 2, s.boundingSphere = o;
  }
  function Kl(s, e, t) {
    const n = e.attributes, i = [];
    function r(o, a) {
      return t.getDependency("accessor", o).then(function(c) {
        s.setAttribute(a, c);
      });
    }
    for (const o in n) {
      const a = Va[o] || o.toLowerCase();
      a in s.attributes || i.push(r(n[o], a));
    }
    if (e.indices !== void 0 && !s.index) {
      const o = t.getDependency("accessor", e.indices).then(function(a) {
        s.setIndex(a);
      });
      i.push(o);
    }
    return Ge.workingColorSpace !== Et && "COLOR_0" in n && console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Ge.workingColorSpace}" not supported.`), Tn(s, e), Mx(s, e, t), Promise.all(i).then(function() {
      return e.targets !== void 0 ? mx(s, e.targets, t) : s;
    });
  }
  function Sx(s) {
    const e = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map(), n = s.clone();
    return eu(s, n, function(i, r) {
      e.set(r, i), t.set(i, r);
    }), n.traverse(function(i) {
      if (!i.isSkinnedMesh) return;
      const r = i, o = e.get(i), a = o.skeleton.bones;
      r.skeleton = o.skeleton.clone(), r.bindMatrix.copy(o.bindMatrix), r.skeleton.bones = a.map(function(c) {
        return t.get(c);
      }), r.bind(r.skeleton, r.bindMatrix);
    }), n;
  }
  function eu(s, e, t) {
    t(s, e);
    for (let n = 0; n < s.children.length; n++) eu(s.children[n], e.children[n], t);
  }
  const $o = /* @__PURE__ */ new Map();
  function Ex(s) {
    const e = document.createElement("canvas"), t = e.getContext("2d");
    e.width = 128, e.height = 32, t.font = "Bold 20px Arial", t.fillStyle = "rgba(255, 255, 255, 0.9)", t.textAlign = "center", t.textBaseline = "middle", t.fillText(s, e.width / 2, e.height / 2);
    const n = new G_(e), i = new kh({
      map: n
    }), r = new N_(i);
    return r.scale.set(4, 1, 1), r;
  }
  async function bx(s = "/assets/player.glb") {
    if ($o.has(s)) return $o.get(s);
    const n = (await new Zh().loadAsync(s)).scene;
    n.traverse((r) => {
      const o = r;
      if (o.isMesh && (o.castShadow = true, o.receiveShadow = true, !(o.material instanceof Ln))) {
        const a = new Ln({
          color: 16777215
        });
        a.skinning = o.isSkinnedMesh === true, o.material = a;
      }
    });
    const i = new E0(n, 16776960);
    return n.add(i), $o.set(s, n), n;
  }
  function Tx(s, e) {
    const t = Sx(s), n = new M0(t);
    t.children.forEach((u, d) => {
      d > 0 && (u.visible = false);
    });
    const i = [];
    t.traverse((u) => {
      const d = u;
      if (!d.isMesh) return;
      const f = (d.name || "").toLowerCase();
      if (f.includes("jersey") || f.includes("shirt") || f.includes("body") || f.includes("torso")) {
        const g = d.material.clone();
        d.material = g, i.push(g);
      }
    });
    const r = new Bs(0.25, 0.25, 1.8, 16), o = new Ln({
      color: 16777215
    }), a = new tt(r, o);
    a.castShadow = true, a.receiveShadow = true, a.position.y = 1.8 / 2, a.visible = false, t.add(a);
    const c = Ex("IDLE");
    c.position.y = 2.2, c.visible = false, t.add(c);
    const l = new S0(t);
    l.visible = false, t.add(l);
    const h = {
      root: t,
      mixer: n,
      materials: i,
      debugMesh: a,
      debugText: c,
      skeletonHelper: l
    };
    return tu(h, e === 0 ? 2062260 : 14034728), t.traverse((u) => {
      u.isSkinnedMesh && (Array.isArray(u.material) ? u.material : [
        u.material
      ]).forEach((f) => {
        "skinning" in f && f.skinning !== true && (f.skinning = true);
      });
    }), h;
  }
  function tu(s, e, t = 0) {
    for (const n of s.materials) n.color.set(e), n.emissive.set(t);
    s.debugMesh && s.debugMesh.material.color.set(e);
  }
  function Ax(s, e) {
    const t = e.vis_y ?? e.vis ?? 1, n = e.vis_xz ?? e.vis ?? 1, i = -Math.atan2(e.h[1], e.h[0]) + Math.PI / 2;
    if (s.root.position.set(e.x, 0, e.y), s.root.rotation.set(0, i, 0), s.root.scale.set(n, t, n), s.debugText) {
      s.debugText.scale.set(4 / n, 1 / t, 1);
      const a = 1.8 * t, c = 0.4;
      s.debugText.position.y = (a + c) / t;
    }
  }
  function wx(s, e) {
    if (!s.debugText) return;
    const t = s.debugText, n = t.material.map.image, i = n.getContext("2d");
    i.clearRect(0, 0, n.width, n.height), i.fillText(e, n.width / 2, n.height / 2), t.material.map.needsUpdate = true;
  }
  function nu(s) {
    return s.replace(/^(mixamorig:?)/i, "").replace(/\d+/g, "").replace(/[^a-z]/gi, "").toLowerCase();
  }
  function Rx(s) {
    const e = /* @__PURE__ */ new Map();
    return s.traverse((t) => {
      t.isBone && t.name && e.set(nu(t.name), t.name);
    }), e;
  }
  function Cx(s, e) {
    const t = Rx(e), n = s.tracks.map((i) => {
      const r = /^([^.]*)\.(.*)$/.exec(i.name);
      if (!r) return i;
      const [, o, a] = r, c = nu(o), l = t.get(c);
      if (!l || l === o) return i;
      const h = i.constructor, u = new h(`${l}.${a}`, i.times, i.values);
      return u.interpolation = i.interpolation, u;
    });
    return new ks(s.name, s.duration, n);
  }
  function Px(s, e = {}) {
    if (!(s == null ? void 0 : s.tracks) || !e.removeRootPos) return s;
    const t = e.rootName || "Hips", n = new RegExp(`^${t.replace(/[.*+?^${}()|[\\\]]/g, "$&")}.position$`), i = s.tracks.filter((r) => !n.test(r.name));
    return new ks(s.name, s.duration, i);
  }
  function Ix(s, e) {
    const n = e.tracks.map((i) => i.name.split(".")[0]).filter((i, r, o) => o.indexOf(i) === r).slice(0, 6).filter((i) => !s.getObjectByName(i));
    n.length && console.warn("[anim-binder] skeleton name mismatch, missing bones:", JSON.stringify(n));
  }
  async function Lx({ loader: s, mixer: e, model: t, clipSources: n, policy: i }) {
    var _a3;
    const r = Array.isArray(n) ? n.map((a) => [
      Dx(a),
      a
    ]) : Object.entries(n), o = {};
    for (const [a, c] of r) {
      const l = await new Promise((f, g) => s.load(c, f, void 0, g));
      if (!((_a3 = l.animations) == null ? void 0 : _a3.length)) {
        console.warn(`[anim-binder] ${a}: animations not found in`, c);
        continue;
      }
      let h = l.animations[0].clone();
      h.name = a, h = Cx(h, t), (i ? i(a) : Ux(a)) === "inplace" && (h = Px(h, {
        removeRootPos: true
      })), Ix(t, h);
      const d = e.clipAction(h);
      a === "Idle" && d.play(), o[a] = d;
    }
    return o;
  }
  function Dx(s) {
    return (s.split("?")[0].split("/").pop() || "").replace(/\.(glb|gltf)$/i, "").toLowerCase().replace(/[_-]/g, " ").replace(/\b\w/g, (t) => t.toUpperCase());
  }
  function Ux(s) {
    const e = s.toLowerCase();
    return /(run|jog|walk|sprint)/.test(e) ? "locomotion" : /(kick|shoot|pass|tackle|header|celebrat|idle|turn|look|wave)/.test(e) ? "inplace" : "raw";
  }
  const En = {
    clipUrls: {
      Idle: "/assets/idle.glb",
      Run: "/assets/run.glb",
      Walk: "/assets/jog.glb",
      KickR: "/assets/kick_r.glb"
    },
    eventMap: {
      KickL: {
        name: "KickR",
        lockMs: 250
      },
      KickR: {
        name: "KickR",
        lockMs: 250
      },
      Header: {
        name: "Header",
        lockMs: 300
      },
      Trap: {
        name: "Trap",
        lockMs: 200
      },
      Tackle: {
        name: "Tackle",
        lockMs: 350
      }
    },
    locomotionMap: {
      idle: "Idle",
      walk: "Walk",
      run: "Run"
    }
  };
  class Nx {
    constructor() {
      __publicField(this, "group", new hn());
      __publicField(this, "ready", false);
      __publicField(this, "isMasterDebug", false);
      __publicField(this, "skeletonVisible", false);
      __publicField(this, "playerModelVisible", true);
      __publicField(this, "modelUrl", "/assets/player.glb");
      __publicField(this, "inst", []);
      __publicField(this, "ctrl", []);
      __publicField(this, "lockUntil", []);
      __publicField(this, "isPlayerMoving", []);
      __publicField(this, "playerIndexMap", []);
    }
    destroy() {
      for (const e of this.inst) this.group.remove(e.root);
      this.inst = [], this.ctrl = [], this.lockUntil = [], this.isPlayerMoving = [], this.playerIndexMap = [], this.ready = false;
    }
    async init(e = 22, t) {
      console.log(`PlayerSystem.init() called with playerCount: ${e}`);
      const n = t ?? this.modelUrl;
      this.modelUrl = n;
      const i = await bx(n), r = new Zh();
      this.lockUntil = new Array(e).fill(0), this.isPlayerMoving = new Array(e).fill(false), this.playerIndexMap = Array.from({
        length: e
      }, (o, a) => a);
      for (let o = 0; o < e; o++) {
        const a = Tx(i, o < 11 ? 0 : 1), c = await Lx({
          loader: r,
          mixer: a.mixer,
          model: a.root,
          clipSources: En.clipUrls
        }), { idle: l, walk: h, run: u } = En.locomotionMap;
        c[l] && c[l].setEffectiveWeight(1).play(), c[h] && c[h].setEffectiveWeight(0).play(), c[u] && c[u].setEffectiveWeight(0).play(), Object.values(En.eventMap).forEach((d) => {
          const f = c[d.name];
          f && (f.setLoop(xh, 0), f.clampWhenFinished = true, f.enabled = true, f.setEffectiveWeight(0), f.play());
        }), this.inst.push(a), this.ctrl.push(c), this.group.add(a.root);
      }
      this.ready = true;
    }
    getModelUrl() {
      return this.modelUrl;
    }
    setTeamColor(e, t) {
      for (let n = 0; n < 11; n++) {
        const i = e === 0 ? n : 11 + n;
        this.inst[i] && tu(this.inst[i], t);
      }
    }
    toggleMasterDebug(e) {
      this.isMasterDebug = e ?? !this.isMasterDebug, console.log(`[Debug] Master Debug Mode: ${this.isMasterDebug}`);
      for (const t of this.inst) t.debugText && (t.debugText.visible = this.isMasterDebug);
      return this.isMasterDebug || (this.toggleSkeleton(false), this.togglePlayerModel(true)), this.isMasterDebug;
    }
    toggleSkeleton(e) {
      this.skeletonVisible = e ?? !this.skeletonVisible, console.log(`[Debug] Skeletons visible: ${this.skeletonVisible}`);
      for (const t of this.inst) t.skeletonHelper && (t.skeletonHelper.visible = this.skeletonVisible);
    }
    togglePlayerModel(e) {
      this.playerModelVisible = e ?? !this.playerModelVisible, console.log(`[Debug] Player model visible: ${this.playerModelVisible}`);
      for (const t of this.inst) {
        const n = t.root.children[0];
        n && (n.visible = this.playerModelVisible);
      }
    }
    update(e, t) {
      if (this.ready) for (let n = 0; n < this.inst.length; n++) {
        const i = this.playerIndexMap[n] ?? n, r = e[i], o = this.inst[n], a = this.ctrl[n];
        if (!r || !o || !a) continue;
        Ax(o, r);
        const c = r.speed ?? 0, l = nn.clamp(c, 0, 7), { idle: h, walk: u, run: d } = En.locomotionMap, _ = nn.smoothstep(l, 1, 4), m = 1 - _;
        if (a[h] && a[h].setEffectiveWeight(m), a[d] && a[d].setEffectiveWeight(_), a[u] && a[u].setEffectiveWeight(0), this.isMasterDebug) {
          n === 0 && console.log(`[Debug] P${i}: speed=${c.toFixed(2)}, wIdle=${m.toFixed(2)}, wRun=${_.toFixed(2)}`);
          const p = this.getCurrentActionName(n);
          wx(o, p);
        }
        o.mixer.update(t);
      }
    }
    setPlayerIndex(e, t) {
      !Number.isInteger(e) || e < 0 || e >= this.playerIndexMap.length || Number.isInteger(t) && (this.playerIndexMap[e] = t);
    }
    resetPlayerIndexMap() {
      this.playerIndexMap = Array.from({
        length: this.inst.length
      }, (e, t) => t);
    }
    applyEvents(e) {
      if (!(!this.ready || !e)) for (const t of e) {
        const n = En.eventMap[t.kind];
        n && this.playOneShot(t.pid, n.name, n.lockMs);
      }
    }
    playOneShot(e, t, n) {
      const i = performance.now();
      if (i < this.lockUntil[e]) return;
      const r = this.ctrl[e], o = r[t];
      if (!o) return;
      if (t === "KickL" || t === "KickR") {
        const l = r[En.eventMap.KickL.name], h = r[En.eventMap.KickR.name];
        l && l.getEffectiveWeight() > 0.01 && l.fadeOut(0.05), h && h.getEffectiveWeight() > 0.01 && h.fadeOut(0.05);
      }
      o.reset(), o.setEffectiveTimeScale(1), o.fadeIn(0.08).play(), this.lockUntil[e] = i + n;
      const a = this.inst[e].mixer, c = (l) => {
        l.action === o && (o.fadeOut(0.08), a.removeEventListener("finished", c));
      };
      a.addEventListener("finished", c);
    }
    getCurrentActionName(e) {
      const t = this.ctrl[e];
      if (!t) return "UNKNOWN";
      for (const u of Object.values(En.eventMap)) {
        const d = t[u.name];
        if (d && d.isRunning() && d.getEffectiveWeight() > 0.5) return u.name.toUpperCase();
      }
      let n = 0, i = "IDLE";
      const { idle: r, walk: o, run: a } = En.locomotionMap, c = t[r];
      if (c) {
        const u = c.getEffectiveWeight();
        u > n && (n = u, i = r.toUpperCase());
      }
      const l = t[o];
      if (l) {
        const u = l.getEffectiveWeight();
        u > n && (n = u, i = o.toUpperCase());
      }
      const h = t[a];
      return h && h.getEffectiveWeight() > n && (i = a.toUpperCase()), i;
    }
    setFarLOD(e) {
      this.group.visible = !e;
    }
  }
  class Fx {
    constructor() {
      __publicField(this, "element");
      this.element = document.createElement("div"), this.element.style.position = "absolute", this.element.style.top = "10px", this.element.style.left = "10px", this.element.style.color = "white", this.element.style.fontFamily = "monospace", document.body.appendChild(this.element);
    }
    update(e, t) {
      this.element.innerText = `Tick: ${e}
FPS: ${t.toFixed(1)}`;
    }
  }
  let Ne, ws = null;
  function Ls() {
    return (ws === null || ws.byteLength === 0) && (ws = new Uint8Array(Ne.memory.buffer)), ws;
  }
  let Fr = typeof TextDecoder < "u" ? new TextDecoder("utf-8", {
    ignoreBOM: true,
    fatal: true
  }) : {
    decode: () => {
      throw Error("TextDecoder not available");
    }
  };
  typeof TextDecoder < "u" && Fr.decode();
  const Ox = 2146435072;
  let Zo = 0;
  function Bx(s, e) {
    return Zo += e, Zo >= Ox && (Fr = typeof TextDecoder < "u" ? new TextDecoder("utf-8", {
      ignoreBOM: true,
      fatal: true
    }) : {
      decode: () => {
        throw Error("TextDecoder not available");
      }
    }, Fr.decode(), Zo = e), Fr.decode(Ls().subarray(s, s + e));
  }
  function Rs(s, e) {
    return s = s >>> 0, Bx(s, e);
  }
  let Vi = 0;
  const Or = typeof TextEncoder < "u" ? new TextEncoder("utf-8") : {
    encode: () => {
      throw Error("TextEncoder not available");
    }
  }, kx = typeof Or.encodeInto == "function" ? function(s, e) {
    return Or.encodeInto(s, e);
  } : function(s, e) {
    const t = Or.encode(s);
    return e.set(t), {
      read: s.length,
      written: t.length
    };
  };
  function Ar(s, e, t) {
    if (t === void 0) {
      const a = Or.encode(s), c = e(a.length, 1) >>> 0;
      return Ls().subarray(c, c + a.length).set(a), Vi = a.length, c;
    }
    let n = s.length, i = e(n, 1) >>> 0;
    const r = Ls();
    let o = 0;
    for (; o < n; o++) {
      const a = s.charCodeAt(o);
      if (a > 127) break;
      r[i + o] = a;
    }
    if (o !== n) {
      o !== 0 && (s = s.slice(o)), i = t(i, n, n = o + s.length * 3, 1) >>> 0;
      const a = Ls().subarray(i + o, i + n), c = kx(s, a);
      o += c.written, i = t(i, n, o, 1) >>> 0;
    }
    return Vi = o, i;
  }
  let ci = null;
  function Wt() {
    return (ci === null || ci.buffer.detached === true || ci.buffer.detached === void 0 && ci.buffer !== Ne.memory.buffer) && (ci = new DataView(Ne.memory.buffer)), ci;
  }
  function zx(s) {
    const e = Ne.__externref_table_alloc();
    return Ne.__wbindgen_export_4.set(e, s), e;
  }
  function Jo(s, e) {
    try {
      return s.apply(this, e);
    } catch (t) {
      const n = zx(t);
      Ne.__wbindgen_exn_store(n);
    }
  }
  function Br(s, e) {
    return s = s >>> 0, Ls().subarray(s / 1, s / 1 + e);
  }
  function Oi(s) {
    return s == null;
  }
  function Wa(s) {
    const e = typeof s;
    if (e == "number" || e == "boolean" || s == null) return `${s}`;
    if (e == "string") return `"${s}"`;
    if (e == "symbol") {
      const i = s.description;
      return i == null ? "Symbol" : `Symbol(${i})`;
    }
    if (e == "function") {
      const i = s.name;
      return typeof i == "string" && i.length > 0 ? `Function(${i})` : "Function";
    }
    if (Array.isArray(s)) {
      const i = s.length;
      let r = "[";
      i > 0 && (r += Wa(s[0]));
      for (let o = 1; o < i; o++) r += ", " + Wa(s[o]);
      return r += "]", r;
    }
    const t = /\[object ([^\]]+)\]/.exec(toString.call(s));
    let n;
    if (t && t.length > 1) n = t[1];
    else return toString.call(s);
    if (n == "Object") try {
      return "Object(" + JSON.stringify(s) + ")";
    } catch {
      return "Object";
    }
    return s instanceof Error ? `${s.name}: ${s.message}
${s.stack}` : n;
  }
  const $l = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => Ne.__wbg_wasmengine_free(s >>> 0, 1));
  class Hx {
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, $l.unregister(this), e;
    }
    free() {
      const e = this.__destroy_into_raw();
      Ne.__wbg_wasmengine_free(e, 0);
    }
    constructor(e) {
      const t = Ne.wasmengine_new(e);
      return this.__wbg_ptr = t >>> 0, $l.register(this, this.__wbg_ptr, this), this;
    }
    tick() {
      Ne.wasmengine_tick(this.__wbg_ptr);
    }
    set_ai_active(e, t) {
      Ne.wasmengine_set_ai_active(this.__wbg_ptr, e, t);
    }
    snapshot() {
      const e = Ne.wasmengine_snapshot(this.__wbg_ptr);
      var t = Br(e[0], e[1]).slice();
      return Ne.__wbindgen_free(e[0], e[1] * 1, 1), t;
    }
    delta() {
      const e = Ne.wasmengine_delta(this.__wbg_ptr);
      var t = Br(e[0], e[1]).slice();
      return Ne.__wbindgen_free(e[0], e[1] * 1, 1), t;
    }
    command(e) {
      Ne.wasmengine_command(this.__wbg_ptr, e);
    }
    getPlayerDataJson() {
      let e, t;
      try {
        const n = Ne.wasmengine_getPlayerDataJson(this.__wbg_ptr);
        return e = n[0], t = n[1], Rs(n[0], n[1]);
      } finally {
        Ne.__wbindgen_free(e, t, 1);
      }
    }
    view() {
      const e = Ne.wasmengine_view(this.__wbg_ptr);
      var t = Br(e[0], e[1]).slice();
      return Ne.__wbindgen_free(e[0], e[1] * 1, 1), t;
    }
  }
  const Vx = /* @__PURE__ */ new Set([
    "basic",
    "cors",
    "default"
  ]);
  async function Gx(s, e) {
    if (typeof Response == "function" && s instanceof Response) {
      if (typeof WebAssembly.instantiateStreaming == "function") try {
        return await WebAssembly.instantiateStreaming(s, e);
      } catch (n) {
        if (s.ok && Vx.has(s.type) && s.headers.get("Content-Type") !== "application/wasm") console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", n);
        else throw n;
      }
      const t = await s.arrayBuffer();
      return await WebAssembly.instantiate(t, e);
    } else {
      const t = await WebAssembly.instantiate(s, e);
      return t instanceof WebAssembly.Instance ? {
        instance: t,
        module: s
      } : t;
    }
  }
  function Wx() {
    const s = {};
    return s.wbg = {}, s.wbg.__wbg_Error_1f3748b298f99708 = function(e, t) {
      return Error(Rs(e, t));
    }, s.wbg.__wbg_String_eecc4a11987127d6 = function(e, t) {
      const n = String(t), i = Ar(n, Ne.__wbindgen_malloc, Ne.__wbindgen_realloc), r = Vi;
      Wt().setInt32(e + 4 * 1, r, true), Wt().setInt32(e + 4 * 0, i, true);
    }, s.wbg.__wbg_call_2f8d426a20a307fe = function() {
      return Jo(function(e, t) {
        return e.call(t);
      }, arguments);
    }, s.wbg.__wbg_debug_75215abdc8f82abb = function(e, t, n, i) {
      console.debug(e, t, n, i);
    }, s.wbg.__wbg_done_4a7743b6f942c9f3 = function(e) {
      return e.done;
    }, s.wbg.__wbg_entries_17f7acbc2d691c0d = function(e) {
      return Object.entries(e);
    }, s.wbg.__wbg_error_29e66bad9fc546cd = function(e, t, n, i) {
      console.error(e, t, n, i);
    }, s.wbg.__wbg_error_41f0589870426ea4 = function(e) {
      console.error(e);
    }, s.wbg.__wbg_error_7534b8e9a36f1ab4 = function(e, t) {
      let n, i;
      try {
        n = e, i = t, console.error(Rs(e, t));
      } finally {
        Ne.__wbindgen_free(n, i, 1);
      }
    }, s.wbg.__wbg_get_27b4bcbec57323ca = function() {
      return Jo(function(e, t) {
        return Reflect.get(e, t);
      }, arguments);
    }, s.wbg.__wbg_get_59c6316d15f9f1d0 = function(e, t) {
      return e[t >>> 0];
    }, s.wbg.__wbg_info_4c14802bfaf2f5be = function(e, t, n, i) {
      console.info(e, t, n, i);
    }, s.wbg.__wbg_instanceof_ArrayBuffer_59339a3a6f0c10ea = function(e) {
      let t;
      try {
        t = e instanceof ArrayBuffer;
      } catch {
        t = false;
      }
      return t;
    }, s.wbg.__wbg_instanceof_Uint8Array_91f3c5adee7e6672 = function(e) {
      let t;
      try {
        t = e instanceof Uint8Array;
      } catch {
        t = false;
      }
      return t;
    }, s.wbg.__wbg_isArray_bc2498eba6fcb71f = function(e) {
      return Array.isArray(e);
    }, s.wbg.__wbg_isSafeInteger_6091d6e3ee1b65fd = function(e) {
      return Number.isSafeInteger(e);
    }, s.wbg.__wbg_iterator_96378c3c9a17347c = function() {
      return Symbol.iterator;
    }, s.wbg.__wbg_length_246fa1f85a0dea5b = function(e) {
      return e.length;
    }, s.wbg.__wbg_length_904c0910ed998bf3 = function(e) {
      return e.length;
    }, s.wbg.__wbg_log_cd247da40b37223b = function(e, t, n, i) {
      console.log(e, t, n, i);
    }, s.wbg.__wbg_new_8a6f238a6ece86ea = function() {
      return new Error();
    }, s.wbg.__wbg_new_9190433fb67ed635 = function(e) {
      return new Uint8Array(e);
    }, s.wbg.__wbg_next_2e6b37020ac5fe58 = function() {
      return Jo(function(e) {
        return e.next();
      }, arguments);
    }, s.wbg.__wbg_next_3de8f2669431a3ff = function(e) {
      return e.next;
    }, s.wbg.__wbg_prototypesetcall_c5f74efd31aea86b = function(e, t, n) {
      Uint8Array.prototype.set.call(Br(e, t), n);
    }, s.wbg.__wbg_stack_0ed75d68575b0f3c = function(e, t) {
      const n = t.stack, i = Ar(n, Ne.__wbindgen_malloc, Ne.__wbindgen_realloc), r = Vi;
      Wt().setInt32(e + 4 * 1, r, true), Wt().setInt32(e + 4 * 0, i, true);
    }, s.wbg.__wbg_value_09d0b4eaab48b91d = function(e) {
      return e.value;
    }, s.wbg.__wbg_warn_426509218f81762d = function(e, t, n, i) {
      console.warn(e, t, n, i);
    }, s.wbg.__wbg_wbindgenbigintgetasi64_7637cb1a7fb9a81e = function(e, t) {
      const n = t, i = typeof n == "bigint" ? n : void 0;
      Wt().setBigInt64(e + 8 * 1, Oi(i) ? BigInt(0) : i, true), Wt().setInt32(e + 4 * 0, !Oi(i), true);
    }, s.wbg.__wbg_wbindgenbooleanget_59f830b1a70d2530 = function(e) {
      const t = e, n = typeof t == "boolean" ? t : void 0;
      return Oi(n) ? 16777215 : n ? 1 : 0;
    }, s.wbg.__wbg_wbindgendebugstring_bb652b1bc2061b6d = function(e, t) {
      const n = Wa(t), i = Ar(n, Ne.__wbindgen_malloc, Ne.__wbindgen_realloc), r = Vi;
      Wt().setInt32(e + 4 * 1, r, true), Wt().setInt32(e + 4 * 0, i, true);
    }, s.wbg.__wbg_wbindgenin_192b210aa1c401e9 = function(e, t) {
      return e in t;
    }, s.wbg.__wbg_wbindgenisbigint_7d76a1ca6454e439 = function(e) {
      return typeof e == "bigint";
    }, s.wbg.__wbg_wbindgenisfunction_ea72b9d66a0e1705 = function(e) {
      return typeof e == "function";
    }, s.wbg.__wbg_wbindgenisobject_dfe064a121d87553 = function(e) {
      const t = e;
      return typeof t == "object" && t !== null;
    }, s.wbg.__wbg_wbindgenjsvaleq_f27272c0a890df7f = function(e, t) {
      return e === t;
    }, s.wbg.__wbg_wbindgenjsvallooseeq_9dd7bb4b95ac195c = function(e, t) {
      return e == t;
    }, s.wbg.__wbg_wbindgennumberget_d855f947247a3fbc = function(e, t) {
      const n = t, i = typeof n == "number" ? n : void 0;
      Wt().setFloat64(e + 8 * 1, Oi(i) ? 0 : i, true), Wt().setInt32(e + 4 * 0, !Oi(i), true);
    }, s.wbg.__wbg_wbindgenstringget_43fe05afe34b0cb1 = function(e, t) {
      const n = t, i = typeof n == "string" ? n : void 0;
      var r = Oi(i) ? 0 : Ar(i, Ne.__wbindgen_malloc, Ne.__wbindgen_realloc), o = Vi;
      Wt().setInt32(e + 4 * 1, o, true), Wt().setInt32(e + 4 * 0, r, true);
    }, s.wbg.__wbg_wbindgenthrow_4c11a24fca429ccf = function(e, t) {
      throw new Error(Rs(e, t));
    }, s.wbg.__wbindgen_cast_2241b6af4c4b2941 = function(e, t) {
      return Rs(e, t);
    }, s.wbg.__wbindgen_cast_4625c577ab2ec9ee = function(e) {
      return BigInt.asUintN(64, e);
    }, s.wbg.__wbindgen_cast_9ae0607507abb057 = function(e) {
      return e;
    }, s.wbg.__wbindgen_init_externref_table = function() {
      const e = Ne.__wbindgen_export_4, t = e.grow(4);
      e.set(0, void 0), e.set(t + 0, void 0), e.set(t + 1, null), e.set(t + 2, true), e.set(t + 3, false);
    }, s;
  }
  function Xx(s, e) {
    return Ne = s.exports, iu.__wbindgen_wasm_module = e, ci = null, ws = null, Ne.__wbindgen_start(), Ne;
  }
  async function iu(s) {
    if (Ne !== void 0) return Ne;
    typeof s < "u" && (Object.getPrototypeOf(s) === Object.prototype ? { module_or_path: s } = s : console.warn("using deprecated parameters for the initialization function; pass a single object instead")), typeof s > "u" && (s = new URL("/assets/engine_bg-Dd4HcJnu.wasm", import.meta.url));
    const e = Wx();
    (typeof s == "string" || typeof Request == "function" && s instanceof Request || typeof URL == "function" && s instanceof URL) && (s = fetch(s));
    const { instance: t, module: n } = await Gx(await s, e);
    return Xx(t, n);
  }
  const Zl = 2, Yx = 32, Xa = 22, Jl = 20 + Xa * Yx;
  function qx(s) {
    if (s.length < Jl) throw new Error(`view data length ${s.length} < expected ${Jl}`);
    const e = new DataView(s.buffer, s.byteOffset, s.byteLength);
    let t = 0;
    const n = e.getUint8(t);
    if (t += 1, t += 3, n !== Zl) throw new Error(`VIEW_VERSION mismatch: got ${n}, expected ${Zl}`);
    const i = e.getUint32(t, true);
    t += 4;
    const r = e.getFloat32(t, true);
    t += 4;
    const o = e.getFloat32(t, true);
    t += 4;
    const a = e.getFloat32(t, true);
    t += 4;
    const c = new Array(Xa);
    for (let l = 0; l < Xa; l++) {
      const h = e.getFloat32(t, true);
      t += 4;
      const u = e.getFloat32(t, true);
      t += 4;
      const d = e.getFloat32(t, true);
      t += 4;
      const f = e.getFloat32(t, true);
      t += 4;
      const g = e.getFloat32(t, true);
      t += 4;
      const _ = e.getFloat32(t, true);
      t += 4;
      const m = e.getFloat32(t, true);
      t += 4;
      const p = e.getUint8(t);
      t += 1, t += 3;
      const E = Math.hypot(d, f) || 1;
      c[l] = {
        x: h,
        y: u,
        h: [
          d / E,
          f / E
        ],
        vis: g,
        vis_y: _,
        vis_xz: m,
        team: p === 0 ? 0 : 1
      };
    }
    return {
      tick: i,
      ball: {
        x: r,
        y: o,
        z: a
      },
      players: c
    };
  }
  function jx() {
    let s = false, e, t = 0, n = [];
    const r = (async () => {
      try {
        await iu(), e = new Hx(BigInt(42));
        const a = e.getPlayerDataJson();
        if (a) try {
          n = JSON.parse(a).map((l, h) => ({
            ...l,
            index: h,
            team: h < 11 ? 0 : 1
          }));
        } catch (c) {
          console.error("Failed to parse player profile data:", c), n = [];
        }
        s = true, console.log("WASM Engine initialized successfully.");
      } catch (a) {
        console.error("Failed to initialize WASM Engine:", a);
      }
    })();
    return {
      get: () => {
        if (!s) return {
          tick: t,
          ball: {
            x: 0,
            y: 0,
            z: 0
          },
          players: Array.from({
            length: 22
          }, (l, h) => ({
            x: 0,
            y: 0,
            h: [
              1,
              0
            ],
            vis: 1,
            team: h < 11 ? 0 : 1
          }))
        };
        e.tick();
        const a = e.view();
        if (a.length === 0) return {
          tick: t,
          ball: {
            x: 0,
            y: 0,
            z: 0
          },
          players: Array.from({
            length: 22
          }, (l, h) => ({
            x: 0,
            y: 0,
            h: [
              1,
              0
            ],
            vis: 1,
            team: h < 11 ? 0 : 1
          }))
        };
        const c = qx(a);
        return t = c.tick, c;
      },
      ready: () => r,
      getPlayerProfiles: () => n,
      engine: new Proxy({}, {
        get: (a, c) => s ? Reflect.get(e, c) : () => console.warn("Engine not ready yet.")
      })
    };
  }
  const gi = new U_();
  gi.background = new Se(1714714);
  const sn = new Ct(75, window.innerWidth / window.innerHeight, 0.1, 1e3);
  sn.position.set(0, 80, 100);
  const us = new D_({
    antialias: true
  });
  us.setSize(window.innerWidth, window.innerHeight);
  us.shadowMap.enabled = true;
  (_a2 = document.getElementById("app")) == null ? void 0 : _a2.appendChild(us.domElement);
  const ui = new A0(sn, us.domElement);
  ui.target.set(0, 0, 0);
  ui.enableDamping = true;
  const Kx = new a0(16777215, 0.8);
  gi.add(Kx);
  const gc = new jh(16777215, 1.2);
  gc.position.set(-100, 100, 50);
  gc.castShadow = true;
  gi.add(gc);
  const $x = k0();
  gi.add($x);
  const su = new H0();
  gi.add(su.mesh);
  const Zx = new Fx(), ut = new Nx();
  gi.add(ut.group);
  const $n = jx(), so = document.getElementById("player-count"), Ql = document.getElementById("apply-player-count"), Jx = document.getElementById("auto-play-duration"), eh = document.getElementById("mode-indicator"), th = document.getElementById("debug-controls"), An = document.getElementById("player-model-url"), nh = document.getElementById("apply-player-model"), Cn = document.getElementById("player-profile-select"), Gi = document.getElementById("debug-info-panel");
  let Zr = false, kr = 0, qn = [], jt = null, zr = ((_b = An == null ? void 0 : An.value) == null ? void 0 : _b.trim()) || "/assets/player.glb", _c = parseInt((so == null ? void 0 : so.value) ?? "1", 10) || 1;
  function ru(s) {
    const e = s < 22;
    eh && (eh.textContent = e ? `Debug Mode (${s} player${s > 1 ? "s" : ""})` : "Simulation Mode"), th && (th.style.display = e ? "block" : "none"), Zr = e, !e && Gi && (Gi.style.display = "none"), Ws();
  }
  function Ws() {
    if (!Gi) return;
    if (!ut.isMasterDebug) {
      Gi.style.display = "none";
      return;
    }
    const s = jt != null ? qn[jt] : void 0, e = s ? s.team === 0 ? "Home" : "Away" : "", t = s ? s.foot === "L" ? "Left" : "Right" : "", n = s ? `
        <div><strong>${s.name}</strong> \u2014 ${e} Team</div>
        <div>Height ${s.height_cm} cm | Weight ${s.weight_kg} kg</div>
        <div>Foot ${t} | Weak Foot ${s.weak_foot}</div>
        <div>Pace ${s.pace} | Accel ${s.accel} | Agility ${s.agility} | Stamina ${s.stamina} | Strength ${s.strength}</div>
        <div>First Touch ${s.first_touch} | Passing ${s.passing} | Vision ${s.vision}</div>
        <div>Finishing ${s.finishing} | Shot Power ${s.shot_power} | Heading ${s.heading} | Jumping ${s.jumping}</div>
        <div>Tackling ${s.tackling} | Interception ${s.interception}</div>
    ` : "<div>Select a player to see profile details.</div>";
    Gi.innerHTML = `
        <strong>Debug Hotkeys:</strong><br>
        [1] Toggle Skeleton<br>
        [2] Toggle Model
        <hr>
        <strong>Player Profile</strong><br>
        ${n}
    `, Gi.style.display = "block";
  }
  function xc() {
    if (ut.ready) {
      if (_c >= 22) {
        ut.resetPlayerIndexMap();
        return;
      }
      ut.resetPlayerIndexMap(), jt != null && ut.setPlayerIndex(0, jt);
    }
  }
  async function Jr(s) {
    const e = parseInt(so.value, 10) || 1;
    await $n.ready();
    const t = ut.getModelUrl(), n = (s ?? zr).trim() || "/assets/player.glb";
    zr = n, An && An.value !== n && (An.value = n), ut.destroy();
    try {
      await ut.init(e, n);
    } catch (i) {
      if (console.error(`Failed to load player model from '${n}'`, i), t && t !== n) zr = t, An && (An.value = t), await ut.init(e, t), typeof window < "u" && typeof window.alert == "function" && window.alert(`Failed to load model from "${n}". Reverting to "${t}".`);
      else throw i;
    }
    _c = e, ru(e);
    for (let i = 0; i < 22; i++) $n.engine.set_ai_active(i, i < e);
    ut.setTeamColor(0, 2062260), ut.setTeamColor(1, 14034728), xc(), jt != null && !qn[jt] && (jt = qn.length ? qn[0].index : null, Cn && jt != null && (Cn.value = jt.toString())), Ws();
  }
  Ql && Ql.addEventListener("click", () => {
    Jr().catch((s) => console.error("Failed to restart player system", s));
  });
  nh && (nh.addEventListener("click", () => {
    const s = An.value.trim();
    Jr(s).catch((e) => console.error("Failed to apply player model", e));
  }), An.addEventListener("keydown", (s) => {
    if (s.key === "Enter") {
      s.preventDefault();
      const e = An.value.trim();
      Jr(e).catch((t) => console.error("Failed to apply player model", t));
    }
  }));
  Cn && Cn.addEventListener("change", () => {
    const s = parseInt(Cn.value, 10);
    jt = Number.isNaN(s) ? null : s, xc(), Ws();
  });
  await (async function() {
    await $n.ready(), qn = $n.getPlayerProfiles(), Cn && (Cn.innerHTML = "", qn.forEach((e) => {
      const t = document.createElement("option"), n = e.index % 11 + 1, i = e.team === 0 ? "Home" : "Away";
      t.value = e.index.toString(), t.textContent = `${i} #${n} \u2014 ${e.name}`, Cn.appendChild(t);
    }), qn.length && (jt = qn[0].index, Cn.value = jt.toString()));
    const s = parseInt(so.value, 10) || 1;
    await ut.init(s, zr), _c = s, ru(s);
    for (let e = 0; e < 22; e++) $n.engine.set_ai_active(e, e < s);
    ut.setTeamColor(0, 2062260), ut.setTeamColor(1, 14034728), xc(), Ws();
  })();
  const Hr = 1 / 20;
  let wr = 0, ih = performance.now() / 1e3, di = $n.get(), Kt = di, Qo = 0;
  const ou = new Float32Array(22);
  function sh() {
    di = Kt, Kt = $n.get();
    for (let s = 0; s < Kt.players.length; s++) {
      const e = di.players[s], t = Kt.players[s];
      if (e && t) {
        const n = t.x - e.x, i = t.y - e.y;
        ou[s] = Math.hypot(n, i) / Hr;
      }
    }
  }
  function au() {
    const s = performance.now() / 1e3, e = s - ih;
    ih = s;
    let t = kr > s;
    if (!Zr || t) for (wr += e; wr >= Hr; ) sh(), wr -= Hr;
    !t && kr > 0 && (console.log("Auto-play finished."), kr = 0, sh());
    const n = Zr ? 1 : wr / Hr, i = Kt.players.map((o, a) => {
      const c = di.players[a];
      if (!c) return o;
      const l = ou[a] || 0, h = nn.lerp(c.x, o.x, n), u = nn.lerp(c.y, o.y, n), d = nn.lerp(c.h[0], o.h[0], n), f = nn.lerp(c.h[1], o.h[1], n), g = Math.hypot(d, f) || 1;
      return {
        ...o,
        x: h,
        y: u,
        h: [
          d / g,
          f / g
        ],
        speed: l
      };
    });
    ut.update(i, e), su.update({
      x: nn.lerp(di.ball.x, Kt.ball.x, n),
      y: nn.lerp(di.ball.y, Kt.ball.y, n),
      z: nn.lerp(di.ball.z, Kt.ball.z, n)
    });
    const r = 1 / e;
    Qo = Qo * 0.95 + r * 0.05, Qx(), ui.update(e), Zx.update(Kt.tick, Qo), us.render(gi, sn), requestAnimationFrame(au);
  }
  const Wi = {};
  window.addEventListener("keydown", (s) => {
    if (!(s.target instanceof HTMLInputElement)) {
      if (Wi[s.code] = true, s.code === "KeyM") {
        const e = !ut.isMasterDebug;
        so.value = (e ? 1 : 22).toString(), Jr().then(() => {
          ut.toggleMasterDebug(e), Ws();
        }).catch((t) => console.error("Failed to toggle master debug", t));
      }
      if (ut.isMasterDebug && (s.code === "Digit1" && ut.toggleSkeleton(), s.code === "Digit2" && ut.togglePlayerModel()), Zr && !s.repeat) {
        const e = Kt.tick;
        let t = null;
        if (s.code === "KeyD" && (t = {
          apply_tick: e + 2,
          type: "shoot",
          tx: 52.5,
          ty: 0,
          power: 0.8
        }), s.code === "KeyS") {
          const n = {
            x: Kt.players[0].x,
            y: Kt.players[0].y
          };
          t = {
            apply_tick: e + 2,
            type: "ground_pass",
            tx: n.x + 15,
            ty: n.y
          };
        }
        if (t) {
          $n.engine.command(t);
          const n = parseFloat(Jx.value) || 5;
          kr = performance.now() / 1e3 + n, console.log(`Command sent, auto-playing for ${n}s...`);
        }
      }
    }
  });
  window.addEventListener("keyup", (s) => {
    Wi[s.code] = false;
  });
  function Qx() {
    const s = new R();
    sn.getWorldDirection(s), s.y = 0, s.normalize();
    const e = new R().crossVectors(sn.up, s).normalize();
    Wi.KeyW && (sn.position.addScaledVector(s, Vn), ui.target.addScaledVector(s, Vn)), Wi.KeyS && (sn.position.addScaledVector(s, -Vn), ui.target.addScaledVector(s, -Vn)), Wi.KeyA && (sn.position.addScaledVector(e, Vn), ui.target.addScaledVector(e, Vn)), Wi.KeyD && (sn.position.addScaledVector(e, -Vn), ui.target.addScaledVector(e, -Vn));
  }
  const Vn = 1;
  window.addEventListener("resize", () => {
    sn.aspect = window.innerWidth / window.innerHeight, sn.updateProjectionMatrix(), us.setSize(window.innerWidth, window.innerHeight);
  });
  requestAnimationFrame(au);
})();
