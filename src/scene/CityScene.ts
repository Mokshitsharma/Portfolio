import {
  AdditiveBlending,
  BoxGeometry,
  BufferGeometry,
  Color,
  CylinderGeometry,
  DoubleSide,
  Float32BufferAttribute,
  FogExp2,
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  RingGeometry,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderer,
} from 'three';
import {
  GRID,
  PITCH,
  avenue,
  buildings,
  categoryHex,
  categoryOrder,
  chapters,
  dispatchRoute,
  gates,
  pathLength,
  pointAt,
  states,
  type SceneState,
} from './layout';

// The home page city. One imperative object: React never re-renders for it. The host page calls setProgress()
// from its scroll handler; this class owns the render loop.

const NIGHT = new Color('#08111d');
const FOG_DENSITY = 0.028;
const SODIUM = new Color('#f2b13c');
const SIGNAL = new Color('#8ea8ff');
const PAPER = new Color('#e8ecf1');

const fogChunk = /* glsl */ `
  uniform vec3 uFog;
  uniform float uFogDensity;
  vec3 applyFog(vec3 c, float depth) {
    float f = 1.0 - exp(-uFogDensity * uFogDensity * depth * depth);
    return mix(c, uFog, clamp(f, 0.0, 1.0));
  }
  // Additive layers (routes, gates) fade out with distance instead of turning fog-coloured.
  vec3 fadeFog(vec3 c, float depth) {
    return c * exp(-uFogDensity * uFogDensity * depth * depth);
  }
`;

const fogUniforms = () => ({ uFog: { value: NIGHT.clone() }, uFogDensity: { value: FOG_DENSITY } });

/* ------------------------------------------------------------------ Buildings */

const buildingVert = /* glsl */ `
  attribute vec3 aColor;
  attribute float aCat;
  attribute float aSeed;
  attribute vec3 aSize;
  uniform float uLit[7];
  varying vec3 vLocal;
  varying vec3 vNormal;
  varying vec3 vColor;
  varying vec3 vSize;
  varying float vLit;
  varying float vTower;
  varying float vSeed;
  varying float vDepth;
  varying float vWorldY;
  void main() {
    vLocal = position + vec3(0.5, 0.0, 0.5);
    vNormal = normal;
    vColor = aColor;
    vSize = aSize;
    vSeed = aSeed;
    vTower = aCat < 0.0 ? 0.0 : 1.0;
    vLit = aCat < 0.0 ? 0.0 : uLit[int(aCat)];
    vec4 world = modelMatrix * instanceMatrix * vec4(position, 1.0);
    vWorldY = world.y;
    vec4 mv = viewMatrix * world;
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const buildingFrag = /* glsl */ `
  ${fogChunk}
  varying vec3 vLocal;
  varying vec3 vNormal;
  varying vec3 vColor;
  varying vec3 vSize;
  varying float vLit;
  varying float vTower;
  varying float vSeed;
  varying float vDepth;
  varying float vWorldY;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 45758.5453); }
  void main() {
    vec3 n = normalize(vNormal);
    float side = abs(n.x) > 0.5 ? 1.0 : 0.0;
    float top = step(0.5, n.y);
    float u = side > 0.5 ? vLocal.z : vLocal.x;
    float span = side > 0.5 ? vSize.z : vSize.x;
    float cols = max(2.0, floor(span / 0.15));
    float rows = vWorldY / 0.19;
    vec2 cell = vec2(floor(u * cols), floor(rows));
    vec2 f = vec2(fract(u * cols), fract(rows));
    float win = step(0.28, f.x) * step(f.x, 0.72) * step(0.32, f.y) * step(f.y, 0.78) * (1.0 - top) * step(0.18, vWorldY);
    float h = hash(cell + vSeed * 97.0 + n.xz * 13.0);

    float light = 0.5 + 0.5 * max(dot(n, normalize(vec3(-0.45, 0.75, 0.5))), 0.0);
    vec3 base = vec3(0.045, 0.078, 0.125) * light;

    // Towers: dense windows in the project's colour when its district is lit, faint when it is not.
    float on = step(0.3, h);
    vec3 tower = vColor * win * on * (0.75 + 0.6 * h) * mix(0.07, 1.0, vLit);
    tower += vColor * top * 0.22 * vLit;
    // Filler: a few warm windows, so the city reads as inhabited without competing with the towers.
    vec3 filler = vec3(1.0, 0.78, 0.5) * win * step(0.94, h) * 0.35;

    vec3 c = base + mix(filler, tower, vTower);
    gl_FragColor = vec4(applyFog(c, vDepth), 1.0);
  }
`;

/* ------------------------------------------------------------------ Ground */

const groundVert = /* glsl */ `
  varying vec2 vXZ;
  varying float vDepth;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vXZ = world.xz;
    vec4 mv = viewMatrix * world;
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const groundFrag = /* glsl */ `
  ${fogChunk}
  uniform float uPitch;
  uniform float uHalf;
  uniform float uExtent;
  uniform vec3 uSodium;
  varying vec2 vXZ;
  varying float vDepth;
  void main() {
    vec2 s = vXZ / uPitch + uHalf + 0.5;
    vec2 d = abs(fract(s + 0.5) - 0.5) * uPitch;
    float street = 1.0 - smoothstep(0.16, 0.2, min(d.x, d.y));
    float inside = 1.0 - smoothstep(uExtent - 0.5, uExtent + 2.5, max(abs(vXZ.x), abs(vXZ.y)));
    // Sodium streetlights pool at each crossing.
    float r = length(d);
    float pool = exp(-r * r * 9.0) * inside;
    vec3 c = vec3(0.02, 0.04, 0.07) + street * inside * vec3(0.035, 0.05, 0.075) + uSodium * pool * 0.32;
    gl_FragColor = vec4(applyFog(c, vDepth), 1.0);
  }
`;

/* ------------------------------------------------------------------ Routes */

const routeVert = /* glsl */ `
  attribute float aAlong;
  attribute float aSide;
  varying float vAlong;
  varying float vSide;
  varying float vDepth;
  void main() {
    vAlong = aAlong;
    vSide = aSide;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const routeFrag = /* glsl */ `
  ${fogChunk}
  uniform vec3 uColor;
  uniform float uDraw;
  uniform float uRunner; // position of the moving delivery, 0-1
  uniform float uRunnerOn;
  uniform float uHead; // position of the agent-chapter token, 0-1
  uniform float uHeadOn;
  uniform float uLength;
  varying float vAlong;
  varying float vSide;
  varying float vDepth;
  float blip(float at, float width) {
    float x = (vAlong - at) * uLength / width;
    return exp(-x * x);
  }
  void main() {
    float core = 1.0 - smoothstep(0.15, 1.0, abs(vSide));
    float drawn = step(vAlong, uDraw);
    float a = 0.42 * core * drawn;
    a += blip(uDraw, 0.35) * core * step(uDraw, 0.999) * 1.4;
    float trail = smoothstep(uRunner - 2.2 / uLength, uRunner, vAlong) * step(vAlong, uRunner);
    a += (blip(uRunner, 0.22) * 1.6 + trail * 0.5) * core * uRunnerOn * drawn;
    a += blip(uHead, 0.3) * core * 2.2 * uHeadOn;
    vec3 c = fadeFog(uColor * a, vDepth);
    gl_FragColor = vec4(c, a);
  }
`;

function ribbon(path: [number, number][], width: number, y: number) {
  const total = pathLength(path);
  const pos: number[] = [];
  const along: number[] = [];
  const side: number[] = [];
  const index: number[] = [];
  let walked = 0;
  for (let i = 1; i < path.length; i++) {
    const [ax, az] = path[i - 1];
    const [bx, bz] = path[i];
    const len = Math.hypot(bx - ax, bz - az);
    const nx = (-(bz - az) / len) * (width / 2);
    const nz = ((bx - ax) / len) * (width / 2);
    // Extend each segment by half a width so corners close.
    const ex = ((bx - ax) / len) * (width / 2);
    const ez = ((bz - az) / len) * (width / 2);
    const t0 = (walked - width / 2) / total;
    const t1 = (walked + len + width / 2) / total;
    const base = pos.length / 3;
    pos.push(ax - ex + nx, y, az - ez + nz, ax - ex - nx, y, az - ez - nz, bx + ex + nx, y, bz + ez + nz, bx + ex - nx, y, bz + ez - nz);
    along.push(t0, t0, t1, t1);
    side.push(1, -1, 1, -1);
    index.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
    walked += len;
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3));
  g.setAttribute('aAlong', new Float32BufferAttribute(along, 1));
  g.setAttribute('aSide', new Float32BufferAttribute(side, 1));
  g.setIndex(index);
  return { geometry: g, length: total };
}

/* ------------------------------------------------------------------ Gates */

const gateVert = /* glsl */ `
  varying vec2 vUv;
  varying float vDepth;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const gateFrag = /* glsl */ `
  ${fogChunk}
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  varying float vDepth;
  void main() {
    float sheet = pow(1.0 - vUv.y, 1.6) * 0.35;
    float edge = (1.0 - smoothstep(0.0, 0.035, vUv.x)) + smoothstep(0.965, 1.0, vUv.x);
    float a = (sheet + edge * (1.0 - vUv.y * 0.6) * 0.9) * uOpacity;
    gl_FragColor = vec4(fadeFog(uColor * a, vDepth), a);
  }
`;

/* ------------------------------------------------------------------ Scene */

export interface CitySceneOptions {
  reducedMotion: boolean;
  onFail: () => void; // WebGL lost or too slow: the host shows the still poster
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

export class CityScene {
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new PerspectiveCamera(32, 1, 0.1, 200);
  private buildingMat: ShaderMaterial;
  private routeMat: ShaderMaterial;
  private avenueMat: ShaderMaterial;
  private gateMats: ShaderMaterial[] = [];
  private gateMeshes: Mesh[] = [];
  private ringMat: MeshBasicMaterial;
  private disposables: { dispose: () => void }[] = [];
  private frame = 0;
  private running = false;
  private start = performance.now();
  private last = 0;
  private slowFrames: number[] = [];
  private slowWindows = 0;
  private chapter = 0;
  private progress = 0;
  private pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  private finePointer = window.matchMedia('(pointer: fine)').matches;
  private look = new Vector3();

  constructor(private canvas: HTMLCanvasElement, private opts: CitySceneOptions) {
    this.renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', alpha: false });
    this.renderer.setClearColor(NIGHT, 1);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.finePointer ? 2 : 1.5));
    this.scene.fog = new FogExp2(NIGHT.getHex(), FOG_DENSITY);

    // Buildings, one instanced draw call. Geometry sits on y = 0 so scaling sets the height.
    const box = new BoxGeometry(1, 1, 1);
    box.translate(0, 0.5, 0);
    this.buildingMat = new ShaderMaterial({
      vertexShader: buildingVert,
      fragmentShader: buildingFrag,
      uniforms: { ...fogUniforms(), uLit: { value: categoryOrder.map(() => 0) } },
    });
    const city = new InstancedMesh(box, this.buildingMat, buildings.length);
    const m = new Matrix4();
    const color: number[] = [];
    const cat: number[] = [];
    const seed: number[] = [];
    const size: number[] = [];
    buildings.forEach((b, i) => {
      m.makeScale(b.width, b.height, b.depth).setPosition(b.x, 0, b.z);
      city.setMatrixAt(i, m);
      const c = new Color(b.category < 0 ? '#000000' : categoryHex[categoryOrder[b.category]]);
      color.push(c.r, c.g, c.b);
      cat.push(b.category);
      seed.push(b.seed);
      size.push(b.width, b.height, b.depth);
    });
    box.setAttribute('aColor', new InstancedBufferAttribute(new Float32Array(color), 3));
    box.setAttribute('aCat', new InstancedBufferAttribute(new Float32Array(cat), 1));
    box.setAttribute('aSeed', new InstancedBufferAttribute(new Float32Array(seed), 1));
    box.setAttribute('aSize', new InstancedBufferAttribute(new Float32Array(size), 3));
    this.scene.add(city);
    this.disposables.push(box, this.buildingMat);

    // Ground with streets and sodium pools.
    const groundGeo = new PlaneGeometry(90, 90);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMat = new ShaderMaterial({
      vertexShader: groundVert,
      fragmentShader: groundFrag,
      uniforms: {
        ...fogUniforms(),
        uPitch: { value: PITCH },
        uHalf: { value: (GRID - 1) / 2 },
        uExtent: { value: (GRID / 2) * PITCH },
        uSodium: { value: SODIUM.clone() },
      },
    });
    this.scene.add(new Mesh(groundGeo, groundMat));
    this.disposables.push(groundGeo, groundMat);

    // The dispatch route and the career avenue.
    const routeUniforms = (c: Color, len: number) => ({
      ...fogUniforms(),
      uColor: { value: c.clone() },
      uDraw: { value: 0 },
      uRunner: { value: 0 },
      uRunnerOn: { value: 0 },
      uHead: { value: 0 },
      uHeadOn: { value: 0 },
      uLength: { value: len },
    });
    const route = ribbon(dispatchRoute, 0.14, 0.02);
    this.routeMat = new ShaderMaterial({
      vertexShader: routeVert, fragmentShader: routeFrag, uniforms: routeUniforms(SODIUM, route.length),
      transparent: true, depthWrite: false, blending: AdditiveBlending,
    });
    this.scene.add(new Mesh(route.geometry, this.routeMat));
    const av = ribbon(avenue, 0.1, 0.015);
    this.avenueMat = new ShaderMaterial({
      vertexShader: routeVert, fragmentShader: routeFrag, uniforms: routeUniforms(SODIUM, av.length),
      transparent: true, depthWrite: false, blending: AdditiveBlending,
    });
    this.scene.add(new Mesh(av.geometry, this.avenueMat));
    this.disposables.push(route.geometry, this.routeMat, av.geometry, this.avenueMat);

    // Gates across the route: blue where a model acts, amber where code decides, white where a person does.
    const gateGeo = new PlaneGeometry(1.05, 1.5);
    gateGeo.translate(0, 0.75, 0);
    const gateColor = { model: SIGNAL, rule: SODIUM, human: PAPER };
    for (const g of gates) {
      const [x, z] = pointAt(dispatchRoute, g.at);
      const [x2, z2] = pointAt(dispatchRoute, Math.min(1, g.at + 0.01));
      const mat = new ShaderMaterial({
        vertexShader: gateVert, fragmentShader: gateFrag,
        uniforms: { ...fogUniforms(), uColor: { value: gateColor[g.kind].clone() }, uOpacity: { value: 0 } },
        transparent: true, depthWrite: false, blending: AdditiveBlending, side: DoubleSide,
      });
      const mesh = new Mesh(gateGeo, mat);
      mesh.position.set(x, 0, z);
      // Face along the route, so the plane stands across the street.
      mesh.rotation.y = Math.atan2(x2 - x, z2 - z);
      mesh.scale.y = 0.001;
      this.scene.add(mesh);
      this.gateMats.push(mat);
      this.gateMeshes.push(mesh);
      this.disposables.push(mat);
    }
    this.disposables.push(gateGeo);

    // Dispatch radius around the booking: a fixed, server-configured radius, so the ring does not grow.
    const [rx, rz] = dispatchRoute[0];
    const ringGeo = new RingGeometry(2.45, 2.5, 128);
    ringGeo.rotateX(-Math.PI / 2);
    this.ringMat = new MeshBasicMaterial({ color: SODIUM, transparent: true, opacity: 0, depthWrite: false, blending: AdditiveBlending });
    const ring = new Mesh(ringGeo, this.ringMat);
    ring.position.set(rx, 0.03, rz);
    this.scene.add(ring);
    this.disposables.push(ringGeo, this.ringMat);

    // Pins: the retailer who booked, and the drop-off.
    const pinGeo = new CylinderGeometry(0.035, 0.035, 1.3, 8);
    pinGeo.translate(0, 0.65, 0);
    const end = dispatchRoute[dispatchRoute.length - 1];
    for (const [[x, z], c] of [[dispatchRoute[0], SODIUM], [end, PAPER]] as const) {
      const mat = new MeshBasicMaterial({ color: c });
      const pin = new Mesh(pinGeo, mat);
      pin.position.set(x, 0, z);
      this.scene.add(pin);
      this.disposables.push(mat);
    }
    this.disposables.push(pinGeo);

    this.resize();
    window.addEventListener('resize', this.resize);
    document.addEventListener('visibilitychange', this.onVisibility);
    canvas.addEventListener('webglcontextlost', this.onLost);
    if (this.finePointer && !opts.reducedMotion) window.addEventListener('pointermove', this.onPointer, { passive: true });
  }

  /** Which chapter is on screen and how far through it the reader is (0-1). */
  setProgress(chapter: number, progress: number) {
    this.chapter = chapter;
    this.progress = progress;
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

  /* -------------------------------------------------------------- internals */

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

  // If frames stay slow, drop the pixel ratio once; if they are still slow, give up and let the poster show.
  private watchFrameTime(now: number) {
    const dt = now - this.last;
    this.last = now;
    if (now - this.start < 2500) return; // shader compile and first upload
    this.slowFrames.push(dt);
    // Judge every 60 frames or every 2 seconds, whichever comes first, so a very slow device gives up quickly.
    // The median ignores one-off stalls (a tab switch, a long scroll jump); two slow windows in a row are needed.
    const spent = this.slowFrames.reduce((a, b) => a + b, 0);
    if (this.slowFrames.length < 60 && spent < 2000) return;
    const median = [...this.slowFrames].sort((a, b) => a - b)[Math.floor(this.slowFrames.length / 2)];
    this.slowFrames = [];
    this.canvas.dataset.frameMs = median.toFixed(1);
    if (median <= 33) {
      this.slowWindows = 0;
      return;
    }
    if (++this.slowWindows < 2) return;
    this.slowWindows = 0;
    if (this.renderer.getPixelRatio() > 1) {
      this.renderer.setPixelRatio(1);
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
    // Keep the horizontal field of view of a 32-degree lens at 1.4:1, so phones see the same city width.
    const hf = 2 * Math.atan(Math.tan((16 * Math.PI) / 180) * 1.4);
    const vf = Math.min(68, (2 * Math.atan(Math.tan(hf / 2) / aspect) * 180) / Math.PI);
    this.camera.fov = Math.max(32, vf);
    this.camera.aspect = aspect;
    // Shift the frame so the city sits right of the text on wide screens and above it on tall ones.
    if (aspect >= 1) this.camera.setViewOffset(w, h, -w * 0.1, 0, w, h);
    else this.camera.setViewOffset(w, h, 0, h * 0.14, w, h);
    this.camera.updateProjectionMatrix();
    if (!this.running) this.render(performance.now());
  };

  private stateAt(): SceneState & { head: number; headOn: number } {
    const i = this.chapter;
    const from = states[chapters[i].id];
    const to = states[chapters[Math.min(i + 1, chapters.length - 1)].id];
    // Hold while the chapter is read, then travel to the next one in its last stretch.
    const t = this.opts.reducedMotion ? 0 : smooth(0.4, 1, this.progress);
    const mix = (a: number, b: number) => lerp(a, b, t);
    const v3 = (a: number[], b: number[]) => a.map((x, k) => mix(x, b[k])) as [number, number, number];
    const s: SceneState = {
      cam: v3(from.cam, to.cam),
      look: v3(from.look, to.look),
      lit: from.lit.map((x, k) => mix(x, to.lit[k])),
      route: mix(from.route, to.route),
      routeAgent: mix(from.routeAgent, to.routeAgent),
      gates: mix(from.gates, to.gates),
      ring: mix(from.ring, to.ring),
      avenue: mix(from.avenue, to.avenue),
      dim: mix(from.dim, to.dim),
    };
    // In the agents chapter a token walks the route with the scroll: past the model gate, past the code gate,
    // then it waits at the person gate before it goes on.
    let head = 0;
    let headOn = 0;
    if (chapters[i].id === 'agents') {
      const p = this.opts.reducedMotion ? 0.6 : this.progress;
      const wait = gates[2].at - 0.02;
      head = p < 0.5 ? lerp(0.02, wait, p / 0.5) : p < 0.75 ? wait : lerp(wait, 1, (p - 0.75) / 0.25);
      headOn = 1 - smooth(0.85, 1, p);
    } else if (chapters[i].id === 'movigo') {
      headOn = smooth(0.7, 1, this.progress) * (this.opts.reducedMotion ? 0 : 1);
      head = 0.02;
    }
    return { ...s, head, headOn };
  }

  dimAt() {
    return this.stateAt().dim;
  }

  private render(now: number) {
    const s = this.stateAt();
    const time = (now - this.start) / 1000;
    const reduced = this.opts.reducedMotion;

    // The opening: the route draws once while the camera settles.
    const intro = reduced ? 1 : smooth(0.2, 2.6, time);
    const drift = reduced ? 0 : 1;

    this.pointer.x += (this.pointer.tx - this.pointer.x) * 0.04;
    this.pointer.y += (this.pointer.ty - this.pointer.y) * 0.04;
    this.camera.position.set(
      s.cam[0] + Math.sin(time * 0.11) * 0.35 * drift + this.pointer.x * 0.7,
      s.cam[1] + (1 - intro) * 5 + Math.sin(time * 0.07) * 0.15 * drift - this.pointer.y * 0.35,
      s.cam[2] + Math.cos(time * 0.09) * 0.35 * drift,
    );
    this.look.set(s.look[0], s.look[1], s.look[2]);
    this.camera.lookAt(this.look);

    (this.buildingMat.uniforms.uLit.value as number[]).splice(0, 7, ...s.lit);

    const ru = this.routeMat.uniforms;
    ru.uDraw.value = Math.min(intro, s.route);
    (ru.uColor.value as Color).copy(SODIUM).lerp(SIGNAL, s.routeAgent);
    // A delivery runs the route in a loop, about one trip every nine seconds.
    ru.uRunner.value = reduced ? 0 : (time / 9) % 1;
    ru.uRunnerOn.value = reduced ? 0 : intro * (1 - s.routeAgent) * (1 - s.gates);
    ru.uHead.value = s.head;
    ru.uHeadOn.value = s.headOn;

    const au = this.avenueMat.uniforms;
    au.uDraw.value = s.avenue;

    this.gateMeshes.forEach((g, k) => {
      g.scale.y = Math.max(0.001, s.gates);
      // The person gate brightens while the token waits at it.
      const waiting = k === 2 && Math.abs(s.head - (gates[2].at - 0.02)) < 0.005 && s.headOn > 0.5 ? 0.6 : 0;
      this.gateMats[k].uniforms.uOpacity.value = s.gates * (0.8 + waiting);
    });

    this.ringMat.opacity = s.ring * intro * (reduced ? 0.6 : 0.45 + 0.25 * Math.sin(time * 1.6));

    this.renderer.render(this.scene, this.camera);
  }
}

