import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BackSide,
  BoxGeometry,
  CatmullRomCurve3,
  Color,
  ConeGeometry,
  DirectionalLight,
  FogExp2,
  Group,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  SRGBColorSpace,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
  type Material,
  type Texture,
} from 'three';
import { STATIONS, smooth } from './chapters';
import { concrete, framePrint, nameplate, stone, walnut, wash } from './textures';

// The residence: one procedural scene, walked by a camera that follows the station number `s` from the scroll
// (see chapters.ts). Plan of the house, looking down, entrance at the bottom:
//
//            rooms  ML   Agents  Data  Software
//                  [  ]  [  ]    [  ]  [  ]      z -38 to -43
//            ┌──────────── atrium ─────────────┐┌──── study ───┐ courtyard
//            │                                  ══              │  (its far wall sinks
//            └───────────┐          ┌──────────┘└──────────────┘   and the roof lifts)
//                        │ gallery  │   five lit frames, z 0 to -24
//                        └── door ──┘   pivot door at z 0
//                          nameplate wall outside

type V3 = [number, number, number];

const FRAME_Z = [-4.5, -8.5, -12.5, -16.5, -20.5];
const FRAME_SIDE = [-1, 1, -1, 1, -1]; // left wall, right wall
export const ROOM_X = [-5.4, -1.8, 1.8, 5.4];
const ROOM_TINT = ['#8fd0db', '#e2b877', '#ece4d6', '#cf915d']; // ML glass, agents brass, data bone, software walnut

// Camera position and target for every station, in station order (14).
const CAMERA: { pos: V3; look: V3 }[] = [
  { pos: [6.4, 1.75, 16.5], look: [-0.9, 2.0, 0] }, // 0 arrival
  { pos: [0.4, 1.65, 4.2], look: [0, 1.7, -6] }, // 1 at the door
  ...FRAME_Z.map((z, k) => ({ pos: [-FRAME_SIDE[k] * 0.45, 1.62, z + 3.3] as V3, look: [FRAME_SIDE[k] * 1.9, 1.72, z - 0.2] as V3 })), // 2-6
  { pos: [0, 2.0, -25.8], look: [0, 2.1, -38] }, // 7 atrium
  ...ROOM_X.map((x) => ({ pos: [x, 1.7, -35.4] as V3, look: [x, 1.55, -43] as V3 })), // 8-11
  { pos: [9.4, 1.62, -30.6], look: [16, 1.3, -31.6] }, // 12 study
  { pos: [13.2, 3.1, -31], look: [28, 1.2, -31] }, // 13 courtyard
];

const skyVert = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const skyFrag = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uMid;
  uniform vec3 uHorizon;
  uniform float uOpen;
  varying vec3 vDir;
  void main() {
    float h = clamp(vDir.y, -0.2, 1.0);
    vec3 c = mix(uHorizon, uMid, smoothstep(0.0, 0.18, h));
    c = mix(c, uTop, smoothstep(0.18, 0.7, h));
    // The courtyard sky is a little brighter: the house opens up at the end.
    c *= 1.0 + uOpen * 0.35;
    gl_FragColor = vec4(c, 1.0);
  }
`;

export interface ResidenceOptions {
  reducedMotion: boolean;
  light: boolean; // phones and small screens: no shadows, lower pixel ratio
  name: string;
  line: string;
  frames: string[]; // titles printed on the five gallery frames, in walking order
  onFail: () => void;
}

export class Residence {
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new PerspectiveCamera(42, 1, 0.05, 260);
  private path: CatmullRomCurve3;
  private s = 0;
  private running = false;
  private frame = 0;
  private start = performance.now();
  private last = 0;
  private samples: number[] = [];
  private slowWindows = 0;
  private pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  private wide = true;
  private disposables: { dispose: () => void }[] = [];

  private door = new Group();
  private doorLight!: PointLight;
  private guide!: PointLight;
  private spill!: MeshBasicMaterial;
  private framePanels: MeshStandardMaterial[] = [];
  private frameCones: MeshBasicMaterial[] = [];
  private roomWalls: MeshStandardMaterial[] = [];
  private sinking: Mesh[] = [];
  private lifting: Mesh[] = [];
  private skyMat!: ShaderMaterial;
  private hemi!: HemisphereLight;
  private fog = new FogExp2(0x15141a, 0.03);
  private look = new Vector3();
  private tmp = new Vector3();

  constructor(private canvas: HTMLCanvasElement, private opts: ResidenceOptions) {
    this.renderer = new WebGLRenderer({ canvas, antialias: !opts.light, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.light ? 1.5 : 1.75));
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = !opts.light;
    this.renderer.shadowMap.type = PCFShadowMap;
    this.scene.fog = this.fog;
    this.scene.background = new Color(0x15141a);

    this.path = new CatmullRomCurve3(CAMERA.map((c) => new Vector3(...c.pos)), false, 'centripetal', 0.5);
    this.build();

    this.resize();
    window.addEventListener('resize', this.resize);
    document.addEventListener('visibilitychange', this.onVisibility);
    canvas.addEventListener('webglcontextlost', this.onLost);
    if (!opts.reducedMotion && window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('pointermove', this.onPointer, { passive: true });
    }
  }

  /* ------------------------------------------------------------------ building */

  private tex(t: Texture) {
    this.disposables.push(t);
    return t;
  }

  private mat<M extends Material>(m: M) {
    this.disposables.push(m);
    return m;
  }

  /** A box from its min and max corners, with UVs in world metres divided by `tile`. */
  private box(min: V3, max: V3, material: Material, tile = 2, shadows = true) {
    const [w, h, d] = [max[0] - min[0], max[1] - min[1], max[2] - min[2]];
    const g = new BoxGeometry(w, h, d);
    const uv = g.attributes.uv;
    // Face order px, nx, py, ny, pz, nz; four vertices each.
    const dims: [number, number][] = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
    for (let f = 0; f < 6; f++) {
      for (let v = 0; v < 4; v++) {
        const i = f * 4 + v;
        uv.setXY(i, (uv.getX(i) * dims[f][0]) / tile, (uv.getY(i) * dims[f][1]) / tile);
      }
    }
    this.disposables.push(g);
    const m = new Mesh(g, material);
    m.position.set((min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2);
    m.castShadow = shadows && !this.opts.light;
    m.receiveShadow = shadows && !this.opts.light;
    this.scene.add(m);
    return m;
  }

  private build() {
    const light = this.opts.light;
    const concreteTex = this.tex(concrete());
    const concreteInTex = this.tex(concrete('#3e3b38'));
    const walnutTex = this.tex(walnut());
    const pavingTex = this.tex(stone('#26241f'));
    const floorTex = this.tex(stone('#1c1a18', 'rgba(0,0,0,0.65)'));

    const concreteMat = this.mat(new MeshStandardMaterial({ map: concreteTex, roughness: 0.93, color: '#bdb6ad' }));
    const innerMat = this.mat(new MeshStandardMaterial({ map: concreteInTex, roughness: 0.9, color: '#cfc7bc' }));
    const steelMat = this.mat(new MeshStandardMaterial({ color: '#17171a', metalness: 0.7, roughness: 0.42 }));
    const walnutMat = this.mat(new MeshStandardMaterial({ map: walnutTex, roughness: 0.55, color: '#d8c2ae' }));
    const groundMat = this.mat(new MeshStandardMaterial({ map: pavingTex, roughness: 0.96 }));
    const floorMat = this.mat(new MeshStandardMaterial({ map: floorTex, roughness: 0.32, metalness: 0.15 }));
    const ceilMat = this.mat(new MeshStandardMaterial({ color: '#131211', roughness: 0.95 }));
    const glowMat = this.mat(new MeshStandardMaterial({ color: '#000', emissive: '#f0a35a', emissiveIntensity: 0.55 }));
    const stripMat = this.mat(new MeshStandardMaterial({ color: '#000', emissive: '#ffd2a0', emissiveIntensity: 1.1 }));
    const edgeMat = this.mat(new MeshStandardMaterial({ color: '#000', emissive: '#c9a46a', emissiveIntensity: 0.12 }));
    const washTex = this.tex(wash());

    /* sky and ground */
    this.skyMat = this.mat(
      new ShaderMaterial({
        vertexShader: skyVert,
        fragmentShader: skyFrag,
        side: BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          uTop: { value: new Color('#0b0d14') },
          uMid: { value: new Color('#2b2f40') },
          uHorizon: { value: new Color('#8a5a3c') },
          uOpen: { value: 0 },
        },
      }),
    );
    const skyGeo = new SphereGeometry(200, 32, 16);
    this.disposables.push(skyGeo);
    this.scene.add(new Mesh(skyGeo, this.skyMat));
    this.box([-60, -0.2, -80], [60, 0, 40], groundMat, 2);

    /* lights */
    this.hemi = new HemisphereLight('#7884a3', '#2e241a', 1.15);
    this.scene.add(this.hemi);
    const dusk = new DirectionalLight('#ffb27c', 2.4);
    dusk.position.set(-14, 9, 12);
    dusk.target.position.set(0, 0, -2);
    this.scene.add(dusk, dusk.target);
    if (!light) {
      dusk.castShadow = true;
      dusk.shadow.mapSize.set(1024, 1024);
      Object.assign(dusk.shadow.camera, { left: -16, right: 16, top: 12, bottom: -6, near: 1, far: 50 });
      dusk.shadow.bias = -0.0006;
    }
    this.doorLight = new PointLight('#ffc187', 0, 16, 1.6);
    this.doorLight.position.set(0, 2.6, -2.2);
    this.guide = new PointLight('#ffd6a0', 0, 13, 1.5);
    const lamp = new PointLight('#ffbd7a', 9, 9, 1.7);
    lamp.position.set(13.2, 1.55, -31.8);
    const porch = new PointLight('#ffcf9a', 14, 11, 1.6); // under the canopy, over the door and the path
    porch.position.set(0, 3.5, 1.5);
    this.scene.add(this.doorLight, this.guide, lamp, porch);

    /* exterior: two concrete masses, a steel canopy, a glass ribbon, the pivot door */
    const H = 3.4; // door and hallway height
    this.box([-11, 0, -2], [-1.2, 3.8, 0], concreteMat); // left mass
    this.box([1.2, 0, -2], [8, 5.4, 0], concreteMat); // right mass
    this.box([-1.2, H, -2], [1.2, 3.8, 0], concreteMat); // lintel
    this.box([-12, 3.8, -2.2], [2.6, 4.05, 2.8], steelMat); // canopy slab over the entrance
    this.box([-12, 3.72, 2.62], [2.6, 3.8, 2.8], stripMat, 2, false); // light line under the canopy edge
    // Glass ribbon in the right mass, lit from inside, with steel mullions.
    this.box([2.1, 1.0, -0.06], [7.2, 4.4, 0.02], glowMat, 2, false);
    for (let x = 2.1; x <= 7.21; x += 1.275) this.box([x - 0.04, 1.0, -0.02], [x + 0.04, 4.4, 0.08], steelMat);
    this.box([2.1, 2.66, -0.02], [7.2, 2.74, 0.08], steelMat);
    // Entrance path: stone slabs from the gate to the street.
    for (let k = 0; k < 7; k++) this.box([-0.8, 0, 1.2 + k * 1.6], [0.8, 0.03, 2.2 + k * 1.6], concreteMat, 2);
    // Nameplate wall, angled towards the arriving visitor.
    const fin = this.box([-4.8, 0, 2.8], [-2.2, 1.9, 3.12], concreteMat);
    fin.rotation.y = 0.32;
    const plateTex = this.tex(nameplate(this.opts.name, this.opts.line));
    const plateMat = this.mat(new MeshStandardMaterial({ map: plateTex, metalness: 0.75, roughness: 0.38 }));
    const plateGeo = new PlaneGeometry(1.9, 0.71);
    this.disposables.push(plateGeo);
    const plate = new Mesh(plateGeo, plateMat);
    plate.position.set(0, 0.25, 0.165);
    fin.add(plate);
    const plateLight = new PointLight('#ffcf96', 2.2, 3.2, 2);
    plateLight.position.set(0, -0.6, 0.7);
    fin.add(plateLight);
    // Low planters along the facade.
    this.box([-10.5, 0, 0.2], [-5.5, 0.55, 1.2], concreteMat);
    this.box([3, 0, 0.2], [7.5, 0.45, 1.0], concreteMat);

    // The pivot door: walnut slab turning on an axis a third of the way across.
    const doorGeo = new BoxGeometry(2.36, H - 0.02, 0.12);
    this.disposables.push(doorGeo);
    const slab = new Mesh(doorGeo, walnutMat);
    slab.position.set(0.39, (H - 0.02) / 2, 0);
    slab.castShadow = !light;
    const handle = new Mesh(new BoxGeometry(0.04, 1.4, 0.06), steelMat);
    this.disposables.push(handle.geometry);
    handle.position.set(1.35, 1.25, 0.1);
    this.door.add(slab, handle);
    this.door.position.set(-0.39, 0, -0.06);
    this.scene.add(this.door);
    // Light that spills onto the path as the door opens.
    this.spill = this.mat(new MeshBasicMaterial({ color: '#ffb877', transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false }));
    const spillGeo = new PlaneGeometry(2.6, 6);
    this.disposables.push(spillGeo);
    const spill = new Mesh(spillGeo, this.spill);
    spill.rotation.x = -Math.PI / 2;
    spill.position.set(0, 0.035, 2.9);
    this.scene.add(spill);

    /* gallery: hallway with five framed panels */
    const GZ = -24;
    this.box([-1.9, 0, GZ], [1.9, 0.01, -0.06], floorMat, 2, false);
    this.box([-2.2, 0, GZ], [-1.9, H, -2], innerMat); // left wall (behind the facade)
    this.box([1.9, 0, GZ], [2.2, H, -2], innerMat);
    this.box([-2.2, H, GZ], [2.2, H + 0.3, -0.06], ceilMat, 2, false);
    this.box([-0.05, H - 0.02, GZ], [0.05, H, -0.4], stripMat, 2, false); // ceiling light line
    // Facade return walls between the outside and the hallway.
    this.box([-2.2, 0, -2], [-1.2, H, -0.06], innerMat);
    this.box([1.2, 0, -2], [2.2, H, -0.06], innerMat);
    FRAME_Z.forEach((z, k) => {
      const side = FRAME_SIDE[k];
      const x = side * 1.9;
      const inward = -side; // frames face the middle of the hallway
      const t = 0.07;
      const [w, h, y0] = [1.5, 1.9, 0.8];
      const face = x + inward * 0.06;
      // walnut frame
      this.box([Math.min(x, face), y0, z - w / 2], [Math.max(x, face), y0 + t, z + w / 2], walnutMat, 1);
      this.box([Math.min(x, face), y0 + h - t, z - w / 2], [Math.max(x, face), y0 + h, z + w / 2], walnutMat, 1);
      this.box([Math.min(x, face), y0, z - w / 2], [Math.max(x, face), y0 + h, z - w / 2 + t], walnutMat, 1);
      this.box([Math.min(x, face), y0, z + w / 2 - t], [Math.max(x, face), y0 + h, z + w / 2], walnutMat, 1);
      // recessed panel that lights as the visitor reaches it
      const print = this.tex(framePrint(this.opts.frames[k] ?? ''));
      const panel = this.mat(new MeshStandardMaterial({ map: print, emissive: '#ffffff', emissiveMap: print, emissiveIntensity: 0.12, roughness: 0.85 }));
      this.framePanels.push(panel);
      const px = x + inward * 0.02;
      this.box([Math.min(x, px), y0 + t, z - w / 2 + t], [Math.max(x, px), y0 + h - t, z + w / 2 - t], panel, 2, false);
      // a soft cone from the ceiling
      const cone = this.mat(new MeshBasicMaterial({ color: '#ffd8a0', transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false }));
      this.frameCones.push(cone);
      const coneGeo = new ConeGeometry(0.9, H - 0.2, 24, 1, true);
      this.disposables.push(coneGeo);
      const c = new Mesh(coneGeo, cone);
      c.position.set(x + inward * 0.55, (H - 0.2) / 2, z);
      this.scene.add(c);
    });

    /* atrium with four doorways */
    const AZ0 = -24;
    const AZ1 = -38;
    const AH = 6;
    this.box([-8, 0, AZ1], [8, 0.01, AZ0], floorMat, 2, false);
    this.box([-8.3, 0, AZ1], [-8, AH, AZ0], innerMat); // left
    // right wall with an opening to the study between z -33 and -29
    this.box([8, 0, AZ1], [8.3, AH, -33], innerMat);
    this.box([8, 0, -29], [8.3, AH, AZ0], innerMat);
    this.box([8, H, -33], [8.3, AH, -29], innerMat);
    // front wall either side of the gallery mouth
    this.box([-8.3, 0, AZ0], [-2.2, AH, AZ0 + 0.3], innerMat);
    this.box([2.2, 0, AZ0], [8.3, AH, AZ0 + 0.3], innerMat);
    this.box([-2.2, H, AZ0], [2.2, AH, AZ0 + 0.3], innerMat);
    this.box([-8.3, AH, AZ1 - 0.3], [8.3, AH + 0.3, AZ0 + 0.3], ceilMat, 2, false);
    // back wall with four doorways, each 2.2 m wide
    const edges = [-8.3, ...ROOM_X.flatMap((x) => [x - 1.1, x + 1.1]), 8.3];
    for (let k = 0; k < edges.length; k += 2) this.box([edges[k], 0, AZ1 - 0.3], [edges[k + 1], AH, AZ1], innerMat);
    ROOM_X.forEach((x, k) => {
      this.box([x - 1.1, H, AZ1 - 0.3], [x + 1.1, AH, AZ1], innerMat);
      this.box([x - 1.12, H - 0.04, AZ1 + 0.01], [x + 1.12, H, AZ1 + 0.05], steelMat); // steel head
      // the room behind: a short volume whose back wall carries the room's light
      const wall = this.mat(new MeshStandardMaterial({ color: '#000', emissive: ROOM_TINT[k], emissiveMap: washTex, emissiveIntensity: 0.2, roughness: 1 }));
      this.roomWalls.push(wall);
      this.box([x - 1.6, 0, -43.3], [x + 1.6, AH, -43], wall, 2, false);
      this.box([x - 1.6, 0, -43], [x + 1.6, 0.01, AZ1 - 0.3], floorMat, 2, false);
      this.box([x - 1.9, 0, -43], [x - 1.6, AH, AZ1 - 0.3], innerMat);
      this.box([x + 1.6, 0, -43], [x + 1.9, AH, AZ1 - 0.3], innerMat);
      this.box([x - 1.9, H + 0.4, -43], [x + 1.9, H + 0.7, AZ1 - 0.3], ceilMat, 2, false);
      this.box([x - 0.5, 0, -41.6], [x + 0.5, 0.9, -40.8], concreteMat); // plinth
    });

    /* study: desk, lamp, shelves, framed credentials */
    const SX0 = 8.3;
    const SX1 = 16;
    const SZ0 = -27;
    const SZ1 = -35;
    const SH = 3.2;
    this.box([SX0, 0, SZ1], [SX1, 0.01, SZ0], walnutMat, 1, false); // walnut floor
    this.box([SX0, 0, SZ1 - 0.3], [SX1, SH, SZ1], innerMat); // back wall (credentials)
    this.box([SX0, 0, SZ0], [SX1, SH, SZ0 + 0.3], innerMat); // front wall (shelves)
    this.box([12.4, 0.74, -32.4], [14.6, 0.8, -31.2], walnutMat, 1); // desk top
    this.box([12.5, 0, -32.3], [12.6, 0.74, -31.3], steelMat);
    this.box([14.4, 0, -32.3], [14.5, 0.74, -31.3], steelMat);
    this.box([13.15, 0.8, -32.0], [13.2, 1.35, -31.95], steelMat); // lamp stem
    this.box([12.95, 1.35, -32.15], [13.45, 1.5, -31.8], glowMat, 1, false); // lamp shade
    for (let k = 0; k < 4; k++) this.box([9.2, 0.6 + k * 0.6, SZ0 + 0.3], [12.2, 0.64 + k * 0.6, SZ0 + 0.62], walnutMat, 1);
    for (let k = 0; k < 3; k++) {
      const x = 9.6 + k * 1.9;
      this.box([x, 1.2, SZ1 + 0.01], [x + 1.4, 2.3, SZ1 + 0.06], walnutMat, 1);
      this.box([x + 0.08, 1.28, SZ1 + 0.06], [x + 1.32, 2.22, SZ1 + 0.07], glowMat, 1, false);
    }
    // The far wall and the roof are what open onto the courtyard.
    this.sinking.push(this.box([SX1, 0, SZ1 - 0.3], [SX1 + 0.3, SH, SZ0 + 0.3], innerMat));
    this.lifting.push(this.box([SX0, SH, SZ1 - 0.3], [SX1 + 0.3, SH + 0.3, SZ0 + 0.3], ceilMat, 2, false));

    /* courtyard: reflecting pool, low walls, one stone bench */
    const water = this.mat(new MeshStandardMaterial({ color: '#0d1a20', metalness: 0.85, roughness: 0.12, emissive: '#1b2a33', emissiveIntensity: 0.25 }));
    this.box([19, 0.0, -34], [30, 0.05, -28], water, 2, false);
    this.box([18.8, 0, -34.2], [30.2, 0.12, -34], concreteMat);
    this.box([18.8, 0, -28], [30.2, 0.12, -27.8], concreteMat);
    this.box([20, 0, -38], [34, 1.1, -37.6], concreteMat);
    this.box([20, 0, -24.4], [34, 1.1, -24], concreteMat);
    this.box([22, 0, -36.2], [26, 0.45, -35.4], concreteMat);
    this.box([34, 0, -38], [34.4, 4.6, -24], concreteMat); // a tall wall that catches the last light
    this.box([18.8, 0.12, -28.06], [30.2, 0.14, -28], edgeMat, 2, false);
  }

  /* ------------------------------------------------------------------ public */

  /** Continuous station number, 0 to STATIONS - 1. */
  setStation(s: number) {
    this.s = Math.min(STATIONS - 1, Math.max(0, s));
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

  /* ------------------------------------------------------------------ internals */

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

  // Below 30 fps, drop the pixel ratio and shadows once; below 20 fps after that, stop and let the poster show.
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
    const degraded = this.renderer.getPixelRatio() <= 1 && !this.renderer.shadowMap.enabled;
    if (median <= (degraded ? 50 : 34)) {
      this.slowWindows = 0;
      return;
    }
    if (++this.slowWindows < 2) return;
    this.slowWindows = 0;
    if (!degraded) {
      this.renderer.setPixelRatio(1);
      this.renderer.shadowMap.enabled = false;
      this.scene.traverse((o) => {
        const m = (o as Mesh).material as Material | undefined;
        if (m) m.needsUpdate = true;
      });
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
    this.camera.fov = aspect >= 1 ? 42 : Math.min(72, 42 / Math.pow(aspect, 0.7));
    // Wide screens: the house sits right of the text. Tall screens: above it.
    if (this.wide) this.camera.setViewOffset(w, h, -w * 0.14, 0, w, h);
    else this.camera.setViewOffset(w, h, 0, h * 0.12, w, h);
    this.camera.updateProjectionMatrix();
    if (!this.running) this.render(performance.now());
  };

  private render(now: number) {
    const time = (now - this.start) / 1000;
    const s = this.s;
    const reduced = this.opts.reducedMotion;

    // Camera along the path through every station; the target blends between neighbouring stations.
    this.path.getPoint(s / (STATIONS - 1), this.tmp);
    const i = Math.min(STATIONS - 2, Math.floor(s));
    const f = smooth(0, 1, s - i);
    const [a, b] = [CAMERA[i].look, CAMERA[i + 1].look];
    this.look.set(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f);
    // A slow breath of movement at the start and a small lean towards the pointer.
    this.pointer.x += (this.pointer.tx - this.pointer.x) * 0.05;
    this.pointer.y += (this.pointer.ty - this.pointer.y) * 0.05;
    const breathe = reduced ? 0 : Math.sin(time * 0.35) * 0.08 * (1 - smooth(0, 1, s));
    this.camera.position.set(this.tmp.x + breathe, this.tmp.y + breathe * 0.4, this.tmp.z);
    this.look.x += this.pointer.x * 0.35;
    this.look.y -= this.pointer.y * 0.2;
    this.camera.lookAt(this.look);

    // The door opens between the arrival and the threshold, and closes again on the way back.
    const open = smooth(0.08, 0.95, s);
    this.door.rotation.y = open * 1.42;
    this.doorLight.intensity = open * 26;
    this.spill.opacity = open * 0.22 * (1 - smooth(1.6, 2.4, s));

    // Inside, a soft light travels just ahead of the visitor.
    const inside = smooth(1.1, 2, s);
    this.camera.getWorldDirection(this.tmp);
    this.guide.position.set(this.camera.position.x + this.tmp.x * 2.6, 3.0, this.camera.position.z + this.tmp.z * 2.6);
    this.guide.intensity = inside * 16 * (1 - smooth(11.6, 12.4, s) * 0.6);

    // Frames light as the visitor reaches them.
    this.framePanels.forEach((m, k) => {
      const near = Math.max(0, 1 - Math.abs(s - (2 + k)) * 1.1);
      m.emissiveIntensity = 0.12 + near * 0.55;
      this.frameCones[k].opacity = near * 0.03;
    });

    // Rooms brighten while their chapter is read.
    this.roomWalls.forEach((m, k) => {
      const near = Math.max(0, 1 - Math.abs(s - (8 + k)));
      m.emissiveIntensity = 0.03 + smooth(6.5, 7, s) * 0.04 + near * 0.12;
    });

    // The courtyard: the study's far wall sinks into the floor and its roof lifts away.
    const unfold = smooth(12.25, 12.95, s);
    this.sinking.forEach((m) => (m.position.y = 1.6 - unfold * 3.25));
    this.lifting.forEach((m) => (m.position.y = 3.35 + unfold * 7));
    this.skyMat.uniforms.uOpen.value = unfold;
    this.hemi.intensity = 1.15 + unfold * 0.9;

    // Fog: thin outside, thicker in the gallery so its far end disappears, thin again in the courtyard.
    const indoors = smooth(1.2, 2.2, s) * (1 - unfold);
    this.fog.density = 0.022 + indoors * 0.03;
    this.renderer.toneMappingExposure = 1.05 + unfold * 0.15;

    this.renderer.render(this.scene, this.camera);
  }
}
