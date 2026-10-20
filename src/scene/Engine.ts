import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  LineSegments,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderer,
} from 'three';
import { SHAPES, smooth } from './chapters';
import { LAYER_HALF, LAYER_Y, corePoint, fieldPoint, kindFor, kindHex, layerPoint, planePoint, ringPoint, rng } from './shapes';

// The home page engine: one particle system that blends between five shapes as the page scrolls.
// Colour carries the rule behind the agent work: blue where a model proposes, cyan where code decides,
// violet where a person approves. React never re-renders for it; the page calls setShape() on scroll.

type V3 = [number, number, number];

// Camera position and target for each shape, in shape order.
const CAMS: { pos: V3; look: V3 }[] = [
  { pos: [0, 0.8, 9.2], look: [0, 0, 0] },
  { pos: [9.6, 5.4, 11.6], look: [0, -0.2, 0] },
  { pos: [0, 7.2, 6.4], look: [0, -1.4, 0] },
  { pos: [0, 0, 10], look: [0, 0, -3] },
  { pos: [0, 1.9, 13.5], look: [0, 0, 0] },
];

const pointVert = /* glsl */ `
  attribute vec3 aP0;
  attribute vec3 aP1;
  attribute vec3 aP2;
  attribute vec3 aP3;
  attribute vec3 aP4;
  attribute vec4 aInfo; // kind, seed, size, flows between layers
  uniform float uW[5];
  uniform float uTime;
  uniform float uDrift;
  uniform float uIntro;
  uniform float uPx;
  uniform float uFocus; // distance at which points are drawn at full size and brightness
  uniform vec3 uKind[4];
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec3 p = aP0 * uW[0] + aP1 * uW[1] + aP2 * uW[2] + aP3 * uW[3] + aP4 * uW[4];
    float seed = aInfo.y;
    // In the layers shape some points travel upward through every layer: data on its way to a product.
    float flow = aInfo.w * uW[1];
    float rise = fract(uTime * 0.07 + seed * 7.0);
    p.y = mix(p.y, -2.6 + rise * 5.2, flow);
    p += uDrift * 0.035 * vec3(sin(uTime * 0.6 + seed * 40.0), cos(uTime * 0.5 + seed * 23.0), sin(uTime * 0.4 + seed * 11.0));
    p *= mix(0.04, 1.0, uIntro);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float depth = -mv.z;
    gl_PointSize = aInfo.z * uPx * (uFocus / depth) * (1.0 + uW[1] * 0.5);
    int k = int(aInfo.x + 0.5);
    vColor = k == 0 ? uKind[0] : k == 1 ? uKind[1] : k == 2 ? uKind[2] : uKind[3];
    float glint = 1.0 + flow * 1.6 * smoothstep(0.0, 0.1, rise) * smoothstep(1.0, 0.85, rise);
    vAlpha = clamp(1.5 - (depth - uFocus) / 9.0, 0.18, 1.0) * glint * (0.55 + 0.45 * uIntro);
  }
`;

const pointFrag = /* glsl */ `
  uniform float uBright;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d);
    a *= a;
    gl_FragColor = vec4(vColor * a * vAlpha * uBright, 1.0);
  }
`;

const lineVert = /* glsl */ `
  attribute float aT;
  attribute float aSeed;
  varying float vT;
  varying float vSeed;
  varying float vDepth;
  uniform float uIntro;
  void main() {
    vT = aT;
    vSeed = aSeed;
    vec4 mv = modelViewMatrix * vec4(position * mix(0.04, 1.0, uIntro), 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const lineFrag = /* glsl */ `
  uniform float uOpacity;
  uniform float uTime;
  uniform float uPulse;
  uniform vec3 uColor;
  uniform vec3 uHot;
  varying float vT;
  varying float vSeed;
  varying float vDepth;
  void main() {
    // A signal crosses each link now and then.
    float head = fract(uTime * 0.22 + vSeed);
    float pulse = uPulse * smoothstep(0.12, 0.0, abs(vT - head)) * step(0.55, fract(vSeed * 13.0));
    float fade = clamp(1.4 - (vDepth - 7.0) / 8.0, 0.2, 1.0);
    vec3 c = mix(uColor * 0.5, uHot, pulse);
    gl_FragColor = vec4(c * uOpacity * fade * (0.35 + pulse), 1.0);
  }
`;

const plateFrag = /* glsl */ `
  uniform float uOpacity;
  uniform vec3 uColor;
  void main() { gl_FragColor = vec4(uColor * uOpacity, 1.0); }
`;

const plateVert = /* glsl */ `
  void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

export interface EngineOptions {
  reducedMotion: boolean;
  light: boolean; // phones and small screens: fewer points
  onFail: () => void;
}

export class Engine {
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new PerspectiveCamera(36, 1, 0.1, 80);
  private group = new Group();
  private points: ShaderMaterial;
  private links: ShaderMaterial;
  private plates: ShaderMaterial;
  private disposables: { dispose: () => void }[] = [];
  private shape = 0;
  private running = false;
  private frame = 0;
  private start = performance.now();
  private last = 0;
  private samples: number[] = [];
  private slowWindows = 0;
  private pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  private look = new Vector3();
  private wide = true;

  constructor(private canvas: HTMLCanvasElement, private opts: EngineOptions) {
    this.renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setClearColor(new Color('#05070c'));
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.light ? 1.5 : 2));

    const count = opts.light ? 2400 : 5600;
    const r = rng(27);
    const P = Array.from({ length: SHAPES }, () => new Float32Array(count * 3));
    const info = new Float32Array(count * 4);
    const hubs: { p: V3; shell: number }[] = [];
    for (let i = 0; i < count; i++) {
      const core = corePoint(r);
      const shapes: V3[] = [core.p, layerPoint(r, i % LAYER_Y.length), planePoint(r), fieldPoint(r), ringPoint(r)];
      shapes.forEach((s, k) => P[k].set(s, i * 3));
      const flows = r() < 0.2 ? 1 : 0;
      info.set([kindFor(r), r(), core.hub ? 1.9 : core.shell < 0 ? 0.8 : 0.9 + r() * 0.6, flows], i * 4);
      if (core.hub) hubs.push({ p: core.p, shell: core.shell });
    }

    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(P[0], 3));
    P.forEach((arr, k) => geo.setAttribute(`aP${k}`, new Float32BufferAttribute(arr, 3)));
    geo.setAttribute('aInfo', new Float32BufferAttribute(info, 4));
    this.points = new ShaderMaterial({
      vertexShader: pointVert,
      fragmentShader: pointFrag,
      uniforms: {
        uW: { value: [1, 0, 0, 0, 0] },
        uTime: { value: 0 },
        uDrift: { value: opts.reducedMotion ? 0 : 1 },
        uIntro: { value: opts.reducedMotion ? 1 : 0 },
        uPx: { value: this.renderer.getPixelRatio() * 2.1 },
        uFocus: { value: 7 },
        uBright: { value: 1 },
        uKind: { value: kindHex.map((h) => new Color(h)) },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: AdditiveBlending,
    });
    const cloud = new Points(geo, this.points);
    cloud.frustumCulled = false;
    this.group.add(cloud);

    // Links between nearby hubs on the same shell: a mesh over each sphere, and a few spokes between shells.
    const segs: number[] = [];
    const ts: number[] = [];
    const seeds: number[] = [];
    const maxLinks = opts.light ? 500 : 1100;
    for (let a = 0; a < hubs.length && segs.length / 6 < maxLinks; a++) {
      let made = 0;
      const A = hubs[a];
      const reach = [0.36, 0.22, 0.16][A.shell];
      for (let b = a + 1; b < hubs.length && made < 3; b++) {
        const B = hubs[b];
        const dx = A.p[0] - B.p[0];
        const dy = A.p[1] - B.p[1];
        const dz = A.p[2] - B.p[2];
        const d = dx * dx + dy * dy + dz * dz;
        const spoke = B.shell === A.shell + 1 && d < 0.95 && r() < 0.06;
        if ((B.shell === A.shell && d < reach && d > 0.01) || spoke) {
          segs.push(...A.p, ...B.p);
          ts.push(0, 1);
          const s = r();
          seeds.push(s, s);
          made++;
        }
      }
    }
    const lineGeo = new BufferGeometry();
    lineGeo.setAttribute('position', new Float32BufferAttribute(segs, 3));
    lineGeo.setAttribute('aT', new Float32BufferAttribute(ts, 1));
    lineGeo.setAttribute('aSeed', new Float32BufferAttribute(seeds, 1));
    this.links = new ShaderMaterial({
      vertexShader: lineVert,
      fragmentShader: lineFrag,
      uniforms: {
        uOpacity: { value: 1 },
        uTime: { value: 0 },
        uPulse: { value: opts.reducedMotion ? 0 : 1 },
        uIntro: { value: opts.reducedMotion ? 1 : 0 },
        uColor: { value: new Color(kindHex[0]) },
        uHot: { value: new Color(kindHex[1]) },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: AdditiveBlending,
    });
    const lines = new LineSegments(lineGeo, this.links);
    lines.frustumCulled = false;
    this.group.add(lines);

    // Outlines of the five layers, drawn while the engine is in its layers shape.
    const [hx, hz] = LAYER_HALF;
    const plate: number[] = [];
    LAYER_Y.forEach((y) => {
      const c: V3[] = [[-hx, y, -hz], [hx, y, -hz], [hx, y, hz], [-hx, y, hz]];
      c.forEach((p, k) => plate.push(...p, ...c[(k + 1) % 4]));
    });
    const plateGeo = new BufferGeometry();
    plateGeo.setAttribute('position', new Float32BufferAttribute(plate, 3));
    this.plates = new ShaderMaterial({
      vertexShader: plateVert,
      fragmentShader: plateFrag,
      uniforms: { uOpacity: { value: 0 }, uColor: { value: new Color('#8b95a7') } },
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: AdditiveBlending,
    });
    this.group.add(new LineSegments(plateGeo, this.plates));

    this.scene.add(this.group);
    this.disposables.push(geo, lineGeo, plateGeo, this.points, this.links, this.plates);

    this.resize();
    window.addEventListener('resize', this.resize);
    document.addEventListener('visibilitychange', this.onVisibility);
    canvas.addEventListener('webglcontextlost', this.onLost);
    if (!opts.reducedMotion && window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('pointermove', this.onPointer, { passive: true });
    }
  }

  /** Continuous shape index, 0-4 (see SHAPES in chapters.ts). */
  setShape(shape: number) {
    this.shape = shape;
    if (!this.running) this.render(performance.now());
  }

  play() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const tick = (now: number) => {
      if (!this.running) return;
      this.frame = requestAnimationFrame(tick);
      this.watchFrameTime(now);
      this.render(now);
    };
    this.frame = requestAnimationFrame(tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.frame);
  }

  dispose() {
    this.stop();
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('pointermove', this.onPointer);
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.canvas.removeEventListener('webglcontextlost', this.onLost);
    this.disposables.forEach((d) => d.dispose());
    this.renderer.dispose();
  }

  private onVisibility = () => {
    if (document.hidden) this.stop();
    else if (!this.opts.reducedMotion) this.play();
  };

  private onLost = (e: Event) => {
    e.preventDefault();
    this.stop();
    this.opts.onFail();
  };

  private onPointer = (e: PointerEvent) => {
    this.pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    this.pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
  };

  // Below 30 fps, drop the pixel ratio once; below 20 fps after that, stop and let the poster show.
  private watchFrameTime(now: number) {
    const dt = now - this.last;
    this.last = now;
    if (now - this.start < 2500) return;
    this.samples.push(dt);
    const spent = this.samples.reduce((a, b) => a + b, 0);
    if (this.samples.length < 60 && spent < 2000) return;
    const median = [...this.samples].sort((a, b) => a - b)[Math.floor(this.samples.length / 2)];
    this.samples = [];
    this.canvas.dataset.frameMs = median.toFixed(1);
    const ratio = this.renderer.getPixelRatio();
    if (median <= (ratio > 1 ? 34 : 50)) {
      this.slowWindows = 0;
      return;
    }
    if (++this.slowWindows < 2) return;
    this.slowWindows = 0;
    if (ratio > 1) {
      this.renderer.setPixelRatio(1);
      this.points.uniforms.uPx.value = 2.1;
      this.resize();
    } else {
      this.stop();
      this.opts.onFail();
    }
  }

  private resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    const aspect = w / h;
    this.wide = aspect >= 1.1 && w >= 1024;
    this.camera.aspect = aspect;
    // Narrow screens need a wider lens to keep the whole engine in frame.
    this.camera.fov = aspect >= 1 ? 36 : Math.min(70, 36 / Math.pow(aspect, 0.85));
    // Wide screens: the engine sits right of the text. Tall screens: above it.
    if (this.wide) this.camera.setViewOffset(w, h, -w * 0.17, 0, w, h);
    else this.camera.setViewOffset(w, h, 0, h * 0.16, w, h);
    this.camera.updateProjectionMatrix();
    if (!this.running) this.render(performance.now());
  };

  private render(now: number) {
    const time = (now - this.start) / 1000;
    const reduced = this.opts.reducedMotion;
    const weights = Array.from({ length: SHAPES }, (_, k) => Math.max(0, 1 - Math.abs(this.shape - k)));

    const u = this.points.uniforms;
    u.uW.value = weights;
    u.uTime.value = reduced ? 0 : time;
    // The opening: the engine unfolds from a point once, in under two seconds, and never blocks the page.
    const intro = reduced ? 1 : smooth(0.1, 1.9, time);
    u.uIntro.value = intro;
    // Shapes seen from further back keep their point size and brightness.
    u.uFocus.value = 7 + weights[1] * 7 + weights[4] * 3.5;
    // Reading chapters keep the field quiet.
    u.uBright.value = 1 - weights[3] * 0.45;

    const l = this.links.uniforms;
    l.uOpacity.value = weights[0] * 0.9 + weights[4] * 0.0;
    l.uTime.value = reduced ? 0 : time;
    l.uIntro.value = intro;
    this.plates.uniforms.uOpacity.value = weights[1] * 0.22;

    // Slow turn in the core and ring shapes, a small lean towards the pointer everywhere.
    this.pointer.x += (this.pointer.tx - this.pointer.x) * 0.04;
    this.pointer.y += (this.pointer.ty - this.pointer.y) * 0.04;
    const spin = reduced ? 0.6 : time * 0.045 * (weights[0] + weights[4] + weights[1] * 0.4) + 0.6;
    this.group.rotation.set(this.pointer.y * 0.12, spin + this.pointer.x * 0.3, 0);

    const mix3 = (pick: (c: (typeof CAMS)[number]) => V3) =>
      weights.reduce<V3>((acc, w, k) => [acc[0] + pick(CAMS[k])[0] * w, acc[1] + pick(CAMS[k])[1] * w, acc[2] + pick(CAMS[k])[2] * w], [0, 0, 0]);
    const pos = mix3((c) => c.pos);
    const look = mix3((c) => c.look);
    // Phones see the engine from a little further back.
    const back = this.wide ? 1 : 1.15;
    this.camera.position.set(pos[0] * back, pos[1] * back, pos[2] * back);
    this.look.set(...look);
    this.camera.lookAt(this.look);

    this.renderer.render(this.scene, this.camera);
  }
}
