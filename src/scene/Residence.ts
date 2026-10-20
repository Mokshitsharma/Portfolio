import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BackSide,
  BoxGeometry,
  CatmullRomCurve3,
  CylinderGeometry,
  Color,
  DirectionalLight,
  FogExp2,
  Group,
  HemisphereLight,
  IcosahedronGeometry,
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
  TorusGeometry,
  Vector3,
  WebGLRenderer,
  type Material,
  type Texture,
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { STATIONS, smooth } from './chapters';
import { certPrint, concrete, doorSign, figurePrint, framePrint, glow, nameplate, invitationPrint, screenImage, stone, walnut, wash, type Invitation, type CertContent, type FrameContent, type RoomContent } from './textures';

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
//                          nameplate wall outside, right of the path

type V3 = [number, number, number];

const FRAME_Z = [-4.5, -8.5, -12.5, -16.5, -20.5];
// The five boards hang on the right-hand wall of the gallery. At each one the camera stands square to the board,
// 3.45 m back and a little to its left, so the board is read face on and sits right of the chapter's text column
// instead of behind it (the view is shifted right on wide screens; see resize()).
const BOARD_X = 1.9;
const BOARD_DIST = 3.45;
const BOARD_SHIFT = 0.2;
export const ROOM_X = [-5.4, -1.8, 1.8, 5.4];
const ROOM_TINT = ['#2d6c88', '#85632d', '#4a6488', '#a35a24']; // ML sky blue, agents brass, data slate blue, software amber

// The front boundary: a limestone portal with the nameplate on its lintel and a pair of gate leaves.
const GATE_Z = 9.1;
const GATE_HALF = 1.7; // half the clear opening

// Camera position and target for every station, in station order (14).
const CAMERA: { pos: V3; look: V3 }[] = [
  { pos: [-0.9, 1.7, 19.4], look: [-0.5, 2.1, 0] }, // 0 arrival: in front of the portal, its nameplate in full view
  { pos: [0.4, 1.65, 4.2], look: [0, 1.7, -6] }, // 1 at the door
  ...FRAME_Z.map((z) => {
    const cz = z - BOARD_SHIFT;
    return { pos: [BOARD_X - 0.065 - BOARD_DIST, 1.69, cz] as V3, look: [BOARD_X, 1.69, cz] as V3 }; // 2-6, square to each board
  }),
  { pos: [0, 2.0, -25.8], look: [0, 2.1, -38] }, // 7 atrium
  // 8-11: framed by each doorway, turned a few degrees left so the room sits right of the text column
  ...ROOM_X.map((x) => ({ pos: [x, 1.65, -35.7] as V3, look: [x - 1.4, 1.62, -44] as V3 })),
  { pos: [12.9, 1.6, -29.9], look: [13.5, 1.55, -35] }, // 12 study, facing the credentials wall
  { pos: [17.4, 2.6, -31.0], look: [30.6, 1.7, -31.2] }, // 13 courtyard, down the rill to the focal wall
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
    // The courtyard sky brightens a touch: the house opens up at the end.
    c *= 1.0 + uOpen * 0.08;
    gl_FragColor = vec4(c, 1.0);
  }
`;

export interface ResidenceOptions {
  reducedMotion: boolean;
  light: boolean; // phones and small screens: no shadows, lower pixel ratio
  name: string;
  line: string;
  frames: FrameContent[]; // what is printed on the five gallery boards, in walking order
  rooms: RoomContent[]; // the display on each project room's back wall, in ROOM_X order
  credentials: CertContent[]; // the framed credentials on the study wall, the degree first
  invitation?: Invitation; // what the courtyard's focal wall says
  onFail: () => void;
}

type Facing = 'x+' | 'x-' | 'z+' | 'y+';

// Shared dimensions and materials the four room builders draw from.
interface RoomKit {
  H: number;
  AH: number;
  AZ1: number;
  innerMat: MeshStandardMaterial;
  floorMat: MeshStandardMaterial;
  ceilMat: MeshStandardMaterial;
  oakMat: MeshStandardMaterial;
  walnutMat: MeshStandardMaterial;
  steelMat: MeshStandardMaterial;
  brassMat: MeshStandardMaterial;
  sconceMat: MeshStandardMaterial;
  stripMat: MeshStandardMaterial;
  limeMat: MeshStandardMaterial;
  leafMat: MeshStandardMaterial;
  oakTex: Texture;
  walnutTex: Texture;
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
  private gate: Group[] = [];
  private doorLight!: PointLight;
  private guide!: PointLight;
  private roomLight!: PointLight;
  private spill!: MeshBasicMaterial;
  private framePanels: MeshBasicMaterial[] = [];
  private roomWalls: MeshStandardMaterial[] = [];
  private sinking: Mesh[] = [];
  private lifting: Mesh[] = [];
  private skyMat!: ShaderMaterial;
  private hemi!: HemisphereLight;
  private fog = new FogExp2(0xe4e8e8, 0.01);
  private fogOut = new Color(0xe4e8e8);
  private fogIn = new Color(0xf1eadf);
  private look = new Vector3();
  private tmp = new Vector3();
  private glowTex!: Texture;
  private glowMats = new Map<string, MeshBasicMaterial>();
  private washTex!: Texture;
  private limeTex!: Texture;

  constructor(private canvas: HTMLCanvasElement, private opts: ResidenceOptions) {
    this.renderer = new WebGLRenderer({ canvas, antialias: !opts.light, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.light ? 1.5 : 1.75));
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.enabled = !opts.light;
    this.renderer.shadowMap.type = PCFShadowMap;
    this.scene.fog = this.fog;
    this.scene.background = new Color(0xe4e8e8);

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
    m.userData.merge = true;
    this.scene.add(m);
    return m;
  }

  /** Exclude a box from merging, because it moves. */
  private keep(m: Mesh) {
    m.userData.merge = false;
    return m;
  }

  /**
   * Merge every static box and light pool that shares a material (and shadow settings) into one mesh. The house is a
   * few thousand boxes; drawn one by one they cost a draw call each, merged they cost a few dozen.
   */
  private mergeStatic() {
    const groups = new Map<string, Mesh[]>();
    for (const o of [...this.scene.children]) {
      const m = o as Mesh;
      if (!m.isMesh || !m.userData.merge) continue;
      const mat = m.material as Material;
      const key = `${mat.uuid}|${m.castShadow}|${m.receiveShadow}|${m.renderOrder}`;
      const list = groups.get(key) ?? [];
      list.push(m);
      groups.set(key, list);
    }
    for (const list of groups.values()) {
      if (list.length < 2) continue;
      const geos = list.map((m) => {
        m.updateMatrix();
        return m.geometry.clone().applyMatrix4(m.matrix);
      });
      const merged = mergeGeometries(geos);
      geos.forEach((g) => g.dispose());
      if (!merged) continue;
      this.disposables.push(merged);
      const first = list[0];
      const mesh = new Mesh(merged, first.material);
      mesh.castShadow = first.castShadow;
      mesh.receiveShadow = first.receiveShadow;
      mesh.renderOrder = first.renderOrder;
      list.forEach((m) => this.scene.remove(m));
      this.scene.add(mesh);
    }
  }

  private orient(mesh: Mesh, facing: Facing) {
    if (facing === 'y+') mesh.rotation.x = -Math.PI / 2;
    else if (facing !== 'z+') mesh.rotation.y = facing === 'x+' ? Math.PI / 2 : -Math.PI / 2;
  }

  /** A flat print (board, display, certificate): unlit and outside tone mapping, so its type shows in its own
   *  colours at any exposure. */
  private print(t: Texture, w: number, h: number, at: V3, facing: Facing, tint = 1) {
    const m = this.mat(new MeshBasicMaterial({ map: this.tex(t), toneMapped: false, fog: false }));
    m.color.setScalar(tint);
    const g = new PlaneGeometry(w, h);
    this.disposables.push(g);
    const mesh = new Mesh(g, m);
    mesh.position.set(...at);
    this.orient(mesh, facing);
    this.scene.add(mesh);
    return m;
  }

  /**
   * A pool of light on a surface, where a sconce, picture light or downlight throws its light. Additive, so it
   * brightens the wall or floor under it with a soft falloff, for the cost of one quad.
   */
  private pool(at: V3, w: number, h: number, facing: Facing, color = '#ffd9a8', strength = 0.35) {
    const key = `${color}-${strength}`;
    let m = this.glowMats.get(key);
    if (!m) {
      m = this.mat(new MeshBasicMaterial({ map: this.glowTex, color, transparent: true, opacity: strength, blending: AdditiveBlending, depthWrite: false }));
      this.glowMats.set(key, m);
    }
    const g = new PlaneGeometry(w, h);
    this.disposables.push(g);
    const mesh = new Mesh(g, m);
    mesh.position.set(...at);
    this.orient(mesh, facing);
    mesh.renderOrder = 1;
    mesh.userData.merge = true;
    this.scene.add(mesh);
    return mesh;
  }

  /** A frame of four bars around a rectangle on a wall facing +z or -x, `depth` deep. */
  private frameAround(cx: number, cy: number, cz: number, w: number, h: number, facing: 'x-' | 'z+', mat: Material, t = 0.06, depth = 0.05) {
    if (facing === 'z+') {
      this.box([cx - w / 2, cy - h / 2, cz], [cx + w / 2, cy - h / 2 + t, cz + depth], mat, 1);
      this.box([cx - w / 2, cy + h / 2 - t, cz], [cx + w / 2, cy + h / 2, cz + depth], mat, 1);
      this.box([cx - w / 2, cy - h / 2, cz], [cx - w / 2 + t, cy + h / 2, cz + depth], mat, 1);
      this.box([cx + w / 2 - t, cy - h / 2, cz], [cx + w / 2, cy + h / 2, cz + depth], mat, 1);
    } else {
      this.box([cx - depth, cy - h / 2, cz - w / 2], [cx, cy - h / 2 + t, cz + w / 2], mat, 1);
      this.box([cx - depth, cy + h / 2 - t, cz - w / 2], [cx, cy + h / 2, cz + w / 2], mat, 1);
      this.box([cx - depth, cy - h / 2, cz - w / 2], [cx, cy + h / 2, cz - w / 2 + t], mat, 1);
      this.box([cx - depth, cy - h / 2, cz + w / 2 - t], [cx, cy + h / 2, cz + w / 2], mat, 1);
    }
  }

  /** A picture light: a brass bar glowing on its underside, and the pool it throws on the wall below. */
  private pictureLight(cx: number, y: number, cz: number, w: number, facing: 'x-' | 'z+', brass: Material, glowFace: Material, poolW: number, poolH: number) {
    if (facing === 'z+') {
      this.box([cx - w / 2, y, cz + 0.02], [cx + w / 2, y + 0.06, cz + 0.13], brass, 1, false);
      this.box([cx - w / 2 + 0.02, y - 0.005, cz + 0.03], [cx + w / 2 - 0.02, y, cz + 0.12], glowFace, 1, false);
      this.pool([cx, y - poolH * 0.38, cz + 0.006], poolW, poolH, 'z+', '#ffdcae', 0.4);
    } else {
      this.box([cx - 0.13, y, cz - w / 2], [cx - 0.02, y + 0.06, cz + w / 2], brass, 1, false);
      this.box([cx - 0.12, y - 0.005, cz - w / 2 + 0.02], [cx - 0.03, y, cz + w / 2 - 0.02], glowFace, 1, false);
      this.pool([cx - 0.006, y - poolH * 0.38, cz], poolW, poolH, 'x-', '#ffdcae', 0.4);
    }
  }

  private build() {
    const light = this.opts.light;
    this.glowTex = this.tex(glow());
    const concreteTex = this.tex(concrete());
    const concreteInTex = this.tex(concrete('#ebe4d7'));
    const limeTex = this.tex(concrete('#e2d8c6'));
    this.limeTex = limeTex;
    const walnutTex = this.tex(walnut());
    const oakTex = this.tex(walnut('#b8905f'));
    const pavingTex = this.tex(stone('#d3c9b8'));
    const floorTex = this.tex(stone('#e2d9c9', 'rgba(90,70,50,0.2)'));

    const concreteMat = this.mat(new MeshStandardMaterial({ map: concreteTex, roughness: 0.92 }));
    const limeMat = this.mat(new MeshStandardMaterial({ map: limeTex, roughness: 0.8 }));
    const innerMat = this.mat(new MeshStandardMaterial({ map: concreteInTex, roughness: 0.88 }));
    const steelMat = this.mat(new MeshStandardMaterial({ color: '#2f2d2b', metalness: 0.6, roughness: 0.4 }));
    const walnutMat = this.mat(new MeshStandardMaterial({ map: walnutTex, roughness: 0.5, color: '#f0dcc6' }));
    const oakMat = this.mat(new MeshStandardMaterial({ map: oakTex, roughness: 0.55 }));
    const groundMat = this.mat(new MeshStandardMaterial({ map: pavingTex, roughness: 0.95 }));
    const floorMat = this.mat(new MeshStandardMaterial({ map: floorTex, roughness: 0.34, metalness: 0.05 }));
    const ceilMat = this.mat(new MeshStandardMaterial({ color: '#f4efe6', roughness: 0.95 }));
    const soffitMat = this.mat(new MeshStandardMaterial({ color: '#efe9de', roughness: 0.9 }));
    // Daylight glass: a pale reflection of the sky, with a little warmth from the rooms behind it.
    const glowMat = this.mat(new MeshStandardMaterial({ color: '#a9c1cd', metalness: 0.5, roughness: 0.1, emissive: '#fff3e0', emissiveIntensity: 0.18 }));
    const stripMat = this.mat(new MeshStandardMaterial({ color: '#fff', emissive: '#fff6e8', emissiveIntensity: 1.1 }));
    const edgeMat = this.mat(new MeshStandardMaterial({ color: '#000', emissive: '#c39a6b', emissiveIntensity: 0.4 }));
    // Brushed champagne brass. Low metalness: with no environment map to reflect, a mirror-bright metal renders dark.
    const brassMat = this.mat(new MeshStandardMaterial({ color: '#d2b077', metalness: 0.35, roughness: 0.38 }));
    const sconceMat = this.mat(new MeshStandardMaterial({ color: '#fff', emissive: '#ffe7c4', emissiveIntensity: 1.3 }));
    const leafMat = this.mat(new MeshStandardMaterial({ color: '#8e9a6c', roughness: 0.85 }));
    this.washTex = this.tex(wash());

    /* sky and ground */
    this.skyMat = this.mat(
      new ShaderMaterial({
        vertexShader: skyVert,
        fragmentShader: skyFrag,
        side: BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          uTop: { value: new Color('#7fa6c4') },
          uMid: { value: new Color('#cddde6') },
          uHorizon: { value: new Color('#f3e3c8') },
          uOpen: { value: 0 },
        },
      }),
    );
    const skyGeo = new SphereGeometry(200, 32, 16);
    this.disposables.push(skyGeo);
    this.scene.add(new Mesh(skyGeo, this.skyMat));
    this.box([-60, -0.2, -80], [60, 0, 40], groundMat, 2);

    /* lights */
    this.hemi = new HemisphereLight('#eef2f6', '#d6c4a6', 2.1);
    this.scene.add(this.hemi);
    // Morning sun, low from the left: long soft shadows across the facade and the path.
    const sun = new DirectionalLight('#fff0d8', 3.4);
    sun.position.set(-12, 16, 14);
    sun.target.position.set(0, 0, -2);
    this.scene.add(sun, sun.target);
    if (!light) {
      sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024);
      Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 14, bottom: -8, near: 1, far: 56 });
      sun.shadow.bias = -0.0006;
    }
    this.doorLight = new PointLight('#ffd2a0', 0, 16, 1.6);
    this.doorLight.position.set(0, 2.6, -2.2);
    // A soft light that travels just ahead of the visitor inside.
    this.guide = new PointLight('#fff1dc', 0, 12, 1.4);
    const porch = new PointLight('#fff0d8', 3, 11, 1.6); // under the canopy, over the door and the path
    porch.position.set(0, 3.0, 1.8);
    this.scene.add(this.doorLight, this.guide, porch);

    this.buildEntrance({ concreteMat, limeMat, steelMat, walnutMat, brassMat, soffitMat, stripMat, glowMat, sconceMat, leafMat });

    /* gallery: hallway with five framed boards, each under its own picture light */
    const H = 3.4; // door and hallway height
    const GZ = -24;
    this.box([-1.9, 0, GZ], [1.9, 0.01, -0.06], floorMat, 2, false);
    this.box([-2.2, 0, GZ], [-1.9, H, -2], innerMat); // left wall (behind the facade)
    this.box([1.9, 0, GZ], [2.2, H, -2], innerMat);
    this.box([-2.2, H, GZ], [2.2, H + 0.3, -0.06], ceilMat, 2, false);
    // A recessed light cove down each side of the ceiling: a slot of light that washes the upper walls.
    for (const x of [-1.62, 1.62]) this.box([x - 0.05, H - 0.012, GZ + 0.4], [x + 0.05, H, -0.6], stripMat, 2, false);
    for (const x of [-1.9 + 0.006, 1.9 - 0.006]) {
      for (let z = -3; z > GZ; z -= 3) this.pool([x, 2.85, z], 3.2, 1.6, x < 0 ? 'x+' : 'x-', '#ffe2bd', 0.1);
    }
    // Facade return walls between the outside and the hallway.
    this.box([-2.2, 0, -2], [-1.2, H, -0.06], innerMat);
    this.box([1.2, 0, -2], [2.2, H, -0.06], innerMat);
    FRAME_Z.forEach((z, k) => {
      const x = BOARD_X;
      const [w, h, y0] = [1.3, 1.59, 0.9];
      const t = 0.07;
      this.frameAround(x, y0 + h / 2, z, w, h, 'x-', oakMat, t, 0.06);
      this.box([x - 0.02, y0 + t, z - w / 2 + t], [x, y0 + h - t, z + w / 2 - t], ceilMat, 2, false); // backing
      const panel = this.print(framePrint(this.opts.frames[k] ?? { title: '', line: '', skills: [], projects: [] }), w - 2 * t, h - 2 * t, [x - 0.065, y0 + h / 2, z], 'x-');
      this.framePanels.push(panel);
      this.pictureLight(x, y0 + h + 0.12, z, 0.84, 'x-', brassMat, sconceMat, 2.0, 1.6);
      // a recessed downlight in the ceiling in front of the board, and its pool on the floor
      this.box([x - 0.95, H - 0.015, z - 0.14], [x - 0.67, H, z + 0.14], stripMat, 1, false);
      this.pool([x - 0.7, 0.012, z], 1.8, 1.8, 'y+', '#ffe6c4', 0.12);
    });
    // Wall sconces on the left wall, between the boards, with an up-and-down wash.
    for (const z of [-2.5, -6.5, -10.5, -14.5, -18.5, -22.5]) {
      this.box([-1.9, 1.9, z - 0.07], [-1.84, 2.45, z + 0.07], brassMat, 1, false);
      this.box([-1.84, 1.95, z - 0.05], [-1.82, 2.4, z + 0.05], sconceMat, 1, false);
      this.pool([-1.894, 2.2, z], 0.9, 2.4, 'x+', '#ffd9a8', 0.45);
    }
    for (const z of [-7, -17]) {
      const g = new PointLight('#fff0dc', 6, 11, 1.5);
      g.position.set(0, 3.0, z);
      this.scene.add(g);
    }

    /* atrium with four doorways */
    const AZ0 = -24;
    const AZ1 = -38;
    const AH = 6;
    this.box([-8, 0, AZ1], [8, 0.01, AZ0], floorMat, 2, false);
    this.box([-8.3, 0, AZ1], [-8, AH, AZ0], innerMat); // left
    // right wall with a wide opening to the study between z -34.6 and -28.5
    this.box([8, 0, AZ1], [8.3, AH, -34.6], innerMat);
    this.box([8, 0, -28.5], [8.3, AH, AZ0], innerMat);
    this.box([8, H, -34.6], [8.3, AH, -28.5], innerMat);
    // front wall either side of the gallery mouth
    this.box([-8.3, 0, AZ0], [-2.2, AH, AZ0 + 0.3], innerMat);
    this.box([2.2, 0, AZ0], [8.3, AH, AZ0 + 0.3], innerMat);
    this.box([-2.2, H, AZ0], [2.2, AH, AZ0 + 0.3], innerMat);
    this.box([-8.3, AH, AZ1 - 0.3], [8.3, AH + 0.3, AZ0 + 0.3], ceilMat, 2, false);
    // A long skylight down the middle of the ceiling.
    this.box([-6, AH - 0.01, -32.2], [6, AH, -29.8], stripMat, 2, false);
    // back wall with four doorways, each 2.2 m wide
    const edges = [-8.3, ...ROOM_X.flatMap((x) => [x - 1.1, x + 1.1]), 8.3];
    for (let k = 0; k < edges.length; k += 2) this.box([edges[k], 0, AZ1 - 0.3], [edges[k + 1], AH, AZ1], innerMat);

    // Atrium lighting: four pendants over the floor, a sconce between each pair of doorways, one fill light.
    for (const x of [-4.5, -1.5, 1.5, 4.5]) {
      this.box([x - 0.012, 4.4, -31.012], [x + 0.012, AH, -30.988], steelMat, 1, false);
      this.box([x - 0.3, 4.25, -31.3], [x + 0.3, 4.4, -30.7], sconceMat, 1, false);
      this.pool([x, 0.012, -31], 3.2, 3.2, 'y+', '#ffe2b8', 0.14);
    }
    for (const x of [-7.2, -3.6, 0, 3.6, 7.2]) {
      this.box([x - 0.08, 2.3, AZ1 + 0.01], [x + 0.08, 2.75, AZ1 + 0.06], sconceMat, 1, false);
      this.pool([x, 2.5, AZ1 + 0.012], 1.4, 3.2, 'z+', '#ffd9a8', 0.4);
    }
    const atriumLight = new PointLight('#fff1dc', 18, 26, 1.3);
    atriumLight.position.set(0, 4.8, -31);
    this.scene.add(atriumLight);

    /* project rooms: four different spaces behind the four doorways, each built around its own evidence */
    const R: RoomKit = { H, AH, AZ1, innerMat, floorMat, ceilMat, oakMat, walnutMat, steelMat, brassMat, sconceMat, stripMat, limeMat, leafMat, oakTex, walnutTex };
    ROOM_X.forEach((x, k) => {
      const tint = ROOM_TINT[k];
      const room = this.opts.rooms[k];
      // The doorway: steel head, and a lettered sign in the room's colour above it, readable from the atrium.
      this.box([x - 1.1, H, AZ1 - 0.3], [x + 1.1, AH, AZ1], innerMat);
      this.box([x - 1.12, H - 0.04, AZ1 + 0.01], [x + 1.12, H, AZ1 + 0.05], steelMat);
      if (room) this.print(doorSign(room.title, tint), 1.9, 0.3, [x, H + 0.42, AZ1 + 0.012], 'z+', 0.97);
      [this.labRoom, this.controlRoom, this.archiveRoom, this.studioRoom][k].call(this, x, tint, R, room);
    });
    // One light follows the visitor from room to room (see render), so the room being read is always lit.
    this.roomLight = new PointLight('#fff0dc', 0, 9, 1.4);
    this.roomLight.position.set(0, 3.1, -40.2);
    this.scene.add(this.roomLight);

    /* study: credentials wall, bookcase, desk, lamp */
    const SX0 = 8.3;
    const SX1 = 16;
    const SZ0 = -27;
    const SZ1 = -35;
    const SH = 3.2;
    this.box([SX0, 0, SZ1], [SX1, 0.01, SZ0], oakMat, 1, false); // oak floor
    this.box([SX0, 0, SZ1 - 0.3], [SX1, SH, SZ1], innerMat); // back wall (credentials)
    this.box([SX0, 0, SZ0], [SX1, SH, SZ0 + 0.3], innerMat); // front wall
    // The credentials wall: the degree and every certificate, three by three, each typeset in an oak frame.
    const [cw, ch, gap] = [0.86, 0.6, 0.16];
    this.opts.credentials.slice(0, 9).forEach((c, k) => {
      const cx = 12.6 + (k % 3) * (cw + gap);
      const cy = 2.42 - Math.floor(k / 3) * (ch + gap);
      this.frameAround(cx, cy, SZ1, cw, ch, 'z+', oakMat, 0.04, 0.035);
      this.print(certPrint(c, k === 0), cw - 0.08, ch - 0.08, [cx, cy, SZ1 + 0.036], 'z+', 0.97);
    });
    for (const x of [13.1, 14.6]) this.pictureLight(x, 2.98, SZ1, 1.0, 'z+', brassMat, sconceMat, 2.6, 2.6);
    // A low oak credenza on the left of the back wall, kept below eye level so it never sits behind the text.
    this.box([8.5, 0, SZ1 + 0.01], [11.7, 0.62, SZ1 + 0.45], this.mat(new MeshStandardMaterial({ map: oakTex, roughness: 0.6, color: '#d9c1a0' })), 1);
    const bookMats = ['#7d5a3a', '#2d6c88', '#c9a464', '#5c5449', '#a35a24', '#d8cdb8', '#4a6488'].map((c) => this.mat(new MeshStandardMaterial({ color: c, roughness: 0.75 })));
    let bx = 8.7;
    let bk = 0;
    while (bx < 10.6) {
      const w = 0.05 + ((bk * 37) % 5) * 0.012;
      const h = 0.26 + ((bk * 53) % 7) * 0.02;
      this.box([bx, 0.62, SZ1 + 0.08], [bx + w, 0.62 + h, SZ1 + 0.32], bookMats[bk % bookMats.length], 1, false);
      bx += w + 0.012;
      bk++;
    }
    // Walnut desk with a monitor and a lamp.
    this.box([9.3, 0.74, -32.6], [11.5, 0.8, -31.5], walnutMat, 1);
    this.box([9.4, 0, -32.5], [9.5, 0.74, -31.6], steelMat);
    this.box([11.3, 0, -32.5], [11.4, 0.74, -31.6], steelMat);
    this.box([10.1, 0.8, -32.35], [10.16, 1.05, -32.3], steelMat); // monitor stand
    this.box([9.75, 1.0, -32.38], [10.55, 1.5, -32.33], steelMat); // monitor
    this.box([9.78, 1.03, -32.33], [10.52, 1.47, -32.325], this.mat(new MeshStandardMaterial({ color: '#dfe8ee', emissive: '#e8f1f6', emissiveIntensity: 0.6 })), 1, false);
    this.box([11.05, 0.8, -32.3], [11.1, 1.3, -32.25], brassMat); // lamp stem
    this.box([10.9, 1.3, -32.42], [11.25, 1.45, -32.1], sconceMat, 1, false); // lamp shade
    this.pool([11.0, 0.81, -31.95], 1.4, 1.4, 'y+', '#ffd9a8', 0.35);
    // A pendant over the room and a fill light in the ceiling.
    this.box([12.98, 2.4, -31.52], [13.02, SH, -31.48], steelMat, 1, false);
    this.box([12.7, 2.25, -31.8], [13.3, 2.4, -31.2], sconceMat, 1, false);
    this.pool([13, 0.012, -31.5], 3.2, 3.2, 'y+', '#ffe2b8', 0.16);
    const studyLight = new PointLight('#fff1dc', 10, 14, 1.4);
    studyLight.position.set(12.4, 2.9, -31.2);
    this.scene.add(studyLight);

    // The far wall and the roof are what open onto the courtyard.
    this.sinking.push(this.keep(this.box([SX1, 0, SZ1 - 0.3], [SX1 + 0.3, SH, SZ0 + 0.3], innerMat)));
    this.lifting.push(this.keep(this.box([SX0, SH, SZ1 - 0.3], [SX1 + 0.3, SH + 0.3, SZ0 + 0.3], ceilMat, 2, false)));

    this.courtyard(R, concreteMat);
    this.mergeStatic();
  }

  /* ------------------------------------------------------------------ the four project rooms */

  /** Side walls, floor, ceiling and back wall of a room `depth` deep behind the atrium, `height` high. */
  private shell(x: number, back: number, height: number, R: RoomKit, floor: Material, wall: MeshStandardMaterial) {
    const z0 = R.AZ1 - 0.3;
    this.box([x - 1.6, 0, back], [x + 1.6, 0.01, z0], floor, 2, false);
    this.box([x - 1.9, 0, back], [x - 1.6, R.AH, z0], R.innerMat);
    this.box([x + 1.6, 0, back], [x + 1.9, R.AH, z0], R.innerMat);
    this.box([x - 1.9, height, back], [x + 1.9, height + 0.3, z0], R.ceilMat, 2, false);
    this.roomWalls.push(wall);
    return wall;
  }

  private tintWall(tint: string) {
    return this.mat(new MeshStandardMaterial({ color: '#f2ece2', emissive: tint, emissiveMap: this.washTex, emissiveIntensity: 0.05, roughness: 1 }));
  }

  /** A pane of daylight: glass the sky shows through, for windows that open onto nothing but sky. */
  private daylight(min: V3, max: V3) {
    const m = this.mat(new MeshStandardMaterial({ color: '#dfeaf0', emissive: '#eef5fa', emissiveIntensity: 0.85, roughness: 0.2 }));
    return this.box(min, max, m, 2, false);
  }

  /**
   * Room 1, machine learning: a bright laboratory. A tall white room with a clerestory of daylight, one wide screen
   * on the back wall showing the CricXAI calibration chart, a long oak lab bench down the left wall with two
   * monitors, a glass-fronted cabinet of blue binders on the right, and a linear pendant over a blue-grey rug.
   */
  private labRoom(x: number, tint: string, R: RoomKit, room?: RoomContent) {
    const back = -43.6;
    const wall = this.shell(x, back, R.H + 0.9, R, R.floorMat, this.tintWall(tint));
    this.box([x - 1.6, 0, back - 0.3], [x + 1.6, R.H + 1.2, back], wall, 2, false);
    this.daylight([x - 1.6, R.H + 0.25, back - 0.02], [x + 1.6, R.H + 0.75, back + 0.01]); // clerestory
    for (const dx of [-0.8, 0, 0.8]) this.box([x + dx - 0.03, R.H + 0.25, back], [x + dx + 0.03, R.H + 0.75, back + 0.04], R.steelMat, 1, false);
    // The wide screen: a slim steel bezel, the chart and the featured projects.
    if (room?.figure) {
      this.box([x - 1.36, 1.06, back], [x + 1.36, 2.6, back + 0.06], R.steelMat, 1);
      this.print(figurePrint(room, room.figure), 2.62, 1.43, [x, 1.83, back + 0.065], 'z+', 0.97);
      this.pool([x, 1.9, back + 0.005], 3.4, 2.6, 'z+', '#eef4ff', 0.22);
    }
    // Lab bench down the left wall: oak top on steel legs, two monitors facing into the room.
    this.box([x - 1.6, 0.86, back + 0.4], [x - 1.0, 0.92, -38.8], R.oakMat, 1);
    for (const z of [back + 0.6, -40.8, -39.0]) this.box([x - 1.5, 0, z - 0.03], [x - 1.44, 0.86, z + 0.03], R.steelMat);
    const screenMat = this.mat(new MeshStandardMaterial({ color: '#dfe9f0', emissive: '#e3eef6', emissiveIntensity: 0.55 }));
    for (const z of [-41.8, -40.3]) {
      this.box([x - 1.5, 0.92, z - 0.03], [x - 1.46, 1.12, z + 0.03], R.steelMat);
      this.box([x - 1.5, 1.08, z - 0.36], [x - 1.46, 1.5, z + 0.36], R.steelMat);
      this.box([x - 1.46, 1.11, z - 0.33], [x - 1.455, 1.47, z + 0.33], screenMat, 1, false);
    }
    this.box([x - 1.0, 0, -40.9], [x - 0.6, 0.62, -40.5], R.walnutMat); // stool
    // Glass-fronted cabinet on the right with binders in the room's blue and in sand.
    const cab = this.mat(new MeshStandardMaterial({ map: R.oakTex, color: '#e3cfb2', roughness: 0.6 }));
    this.box([x + 1.15, 0, back + 0.3], [x + 1.6, 2.3, -40.4], cab, 1);
    const blue = this.mat(new MeshStandardMaterial({ color: tint, roughness: 0.7 }));
    const sand = this.mat(new MeshStandardMaterial({ color: '#d8cdb8', roughness: 0.7 }));
    for (let shelf = 0; shelf < 4; shelf++) {
      const y = 0.25 + shelf * 0.52;
      for (let n = 0; n < 6; n++) {
        const z = back + 0.42 + n * 0.42;
        this.box([x + 1.12, y, z], [x + 1.15, y + 0.34, z + 0.3], (n + shelf) % 3 === 0 ? sand : blue, 1, false);
      }
    }
    const glass = this.mat(new MeshStandardMaterial({ color: '#d8e6ec', transparent: true, opacity: 0.22, roughness: 0.05, depthWrite: false }));
    this.box([x + 1.1, 0.05, back + 0.32], [x + 1.115, 2.25, -40.42], glass, 1, false);
    // Linear pendant over a blue-grey rug, in a cool working white.
    this.box([x - 0.012, 3.05, -41.0], [x + 0.012, R.H + 0.9, -40.98], R.steelMat, 1, false);
    this.box([x - 1.0, 2.98, -41.04], [x + 1.0, 3.05, -40.94], R.steelMat, 1, false);
    this.box([x - 0.98, 2.975, -41.03], [x + 0.98, 2.98, -40.95], R.stripMat, 1, false);
    this.pool([x, 0.013, -41], 3.0, 2.6, 'y+', '#f2f6ff', 0.2);
    this.box([x - 0.9, 0.01, -42.4], [x + 0.7, 0.02, -39.4], this.mat(new MeshStandardMaterial({ color: '#b9c6cc', roughness: 1 })), 1, false);
  }

  /**
   * Room 2, agentic AI: a low, warm control room. A coffered oak ceiling, vertical walnut slats down the left wall, a
   * tall slot window on the right, a round walnut table under a brass ring light, and along the back wall one long
   * panel that reads like a run of the agent: SettleAI's stages, each marked by who acts.
   */
  private controlRoom(x: number, tint: string, R: RoomKit, room?: RoomContent) {
    const back = -42.7;
    const floor = this.mat(new MeshStandardMaterial({ map: R.walnutTex, color: '#f3dcc0', roughness: 0.45 }));
    const wall = this.shell(x, back, R.H + 0.15, R, floor, this.tintWall(tint));
    this.box([x - 1.6, 0, back - 0.3], [x + 1.6, R.H + 0.45, back], wall, 2, false);
    // Coffers: a grid of oak beams under the ceiling.
    for (const dx of [-0.8, 0, 0.8]) this.box([x + dx - 0.04, R.H + 0.02, back], [x + dx + 0.04, R.H + 0.15, R.AZ1 - 0.3], R.oakMat, 1, false);
    for (let z = back + 0.9; z < R.AZ1 - 0.5; z += 1.1) this.box([x - 1.6, R.H + 0.02, z - 0.04], [x + 1.6, R.H + 0.15, z + 0.04], R.oakMat, 1, false);
    // Walnut slats down the left wall.
    for (let z = back + 0.15; z < R.AZ1 - 0.4; z += 0.16) this.box([x - 1.6, 0, z], [x - 1.55, R.H, z + 0.09], R.walnutMat, 1, false);
    // A tall slot window on the right, framed in brass.
    this.daylight([x + 1.585, 0.5, -41.7], [x + 1.6, 3.0, -40.1]);
    this.box([x + 1.56, 0.45, -41.75], [x + 1.6, 0.5, -40.05], R.brassMat, 1, false);
    this.box([x + 1.56, 3.0, -41.75], [x + 1.6, 3.05, -40.05], R.brassMat, 1, false);
    this.pool([x + 0.6, 0.013, -40.9], 2.4, 1.8, 'y+', '#f4f8ff', 0.18);
    // The run of the agent, in a brass frame, under a picture light.
    if (room?.figure) {
      this.frameAround(x, 1.72, back, 3.02, 1.08, 'z+', R.brassMat, 0.04, 0.04);
      this.print(figurePrint(room, room.figure), 2.94, 1.0, [x, 1.72, back + 0.042], 'z+', 0.97);
      this.pictureLight(x, 2.42, back, 1.6, 'z+', R.brassMat, R.sconceMat, 3.4, 1.8);
    }
    // Round walnut table on a single pedestal, three oak chairs.
    const top = new CylinderGeometry(0.68, 0.68, 0.05, 40);
    const stem = new CylinderGeometry(0.07, 0.22, 0.72, 16);
    this.disposables.push(top, stem);
    const t = new Mesh(top, R.walnutMat);
    t.position.set(x, 0.745, -40.6);
    const st = new Mesh(stem, R.steelMat);
    st.position.set(x, 0.36, -40.6);
    t.castShadow = st.castShadow = !this.opts.light;
    this.scene.add(t, st);
    const linen = this.mat(new MeshStandardMaterial({ color: '#e6dccb', roughness: 0.95 }));
    for (const a of [Math.PI * 0.15, Math.PI * 0.85, Math.PI * 1.5]) {
      const cx = x + Math.cos(a) * 0.95;
      const cz = -40.6 + Math.sin(a) * 0.95;
      this.box([cx - 0.22, 0.42, cz - 0.22], [cx + 0.22, 0.48, cz + 0.22], linen);
      this.box([cx - 0.2, 0, cz - 0.2], [cx + 0.2, 0.42, cz + 0.2], R.oakMat);
    }
    // Brass ring light over the table, glowing on its underside.
    const ring = new TorusGeometry(0.5, 0.028, 10, 48);
    const glowRing = new TorusGeometry(0.5, 0.012, 6, 48);
    this.disposables.push(ring, glowRing);
    const r1 = new Mesh(ring, R.brassMat);
    r1.rotation.x = Math.PI / 2;
    r1.position.set(x, 2.45, -40.6);
    const r2 = new Mesh(glowRing, R.sconceMat);
    r2.rotation.x = Math.PI / 2;
    r2.position.set(x, 2.42, -40.6);
    this.scene.add(r1, r2);
    for (const a of [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3]) {
      const cx = x + Math.cos(a) * 0.5;
      const cz = -40.6 + Math.sin(a) * 0.5;
      this.box([cx - 0.006, 2.45, cz - 0.006], [cx + 0.006, R.H + 0.02, cz + 0.006], R.steelMat, 1, false);
    }
    this.pool([x, 0.77, -40.6], 1.6, 1.6, 'y+', '#ffd9a8', 0.32);
    this.pool([x, 0.013, -40.6], 3.0, 3.0, 'y+', '#ffe2b8', 0.14);
  }

  /**
   * Room 3, data and analytics: a double-height archive. Floor-to-ceiling oak shelving full of ledger binders down
   * both walls, a brass library ladder, a long reading table with a lamp, a skylight down the room, and on the back
   * wall a tall ledger board with one counted figure per analysis.
   */
  private archiveRoom(x: number, tint: string, R: RoomKit, room?: RoomContent) {
    const back = -44.6;
    const ceil = R.AH - 0.3;
    const wall = this.shell(x, back, ceil, R, R.oakMat, this.tintWall(tint));
    this.box([x - 1.6, 0, back - 0.3], [x + 1.6, ceil, back], wall, 2, false);
    this.box([x - 0.35, ceil - 0.01, back + 0.3], [x + 0.35, ceil, R.AZ1 - 0.6], R.stripMat, 1, false); // skylight
    // Shelving down both walls: oak uprights and shelves, binders in slate blue, sand, ivory and walnut.
    const binders = [tint, '#d8cdb8', '#efe7d8', '#7d5a3a', '#9aa9b8'].map((c) => this.mat(new MeshStandardMaterial({ color: c, roughness: 0.75 })));
    for (const side of [-1, 1]) {
      const wx = x + side * 1.6;
      const inner = wx - side * 0.38;
      const [xa, xb] = side < 0 ? [wx, inner] : [inner, wx];
      for (let z = back + 0.1; z <= -38.6; z += 1.15) this.box([xa, 0, z - 0.03], [xb, 4.6, z + 0.03], R.oakMat, 1);
      for (let y = 0.1; y <= 4.6; y += 0.5) {
        this.box([xa, y, back + 0.1], [xb, y + 0.03, -38.6], R.oakMat, 1, false);
        if (y > 4.3) continue;
        let z = back + 0.16;
        let n = Math.round(y * 10);
        while (z < -38.75) {
          const w = 0.22 + ((n * 37) % 5) * 0.06;
          const h = 0.3 + ((n * 53) % 4) * 0.03;
          const [ba, bb] = side < 0 ? [wx + 0.04, inner - 0.04] : [inner + 0.04, wx - 0.04];
          this.box([ba, y + 0.03, z], [bb, y + 0.03 + h, Math.min(z + w, -38.7)], binders[n % binders.length], 1, false);
          z += w + 0.02 + (n % 7 === 0 ? 0.2 : 0);
          n++;
        }
      }
    }
    // Brass ladder leaning on the right-hand shelves.
    for (const dz of [-0.25, 0.25]) {
      const rail = this.box([x + 1.0, 0, -41.2 + dz - 0.02], [x + 1.04, 4.2, -41.2 + dz + 0.02], R.brassMat, 1);
      rail.rotation.z = -0.13;
    }
    for (let y = 0.35; y < 4; y += 0.35) {
      const rung = this.box([x + 1.02 - y * 0.13, y, -41.45], [x + 1.04 - y * 0.13, y + 0.025, -40.95], R.brassMat, 1, false);
      rung.position.x += 0.26;
    }
    // The ledger board, tall, in oak, under a picture light.
    if (room?.figure) {
      this.frameAround(x, 2.15, back, 1.62, 1.92, 'z+', R.oakMat, 0.06, 0.05);
      this.print(figurePrint(room, room.figure), 1.5, 1.8, [x, 2.15, back + 0.052], 'z+', 0.97);
      this.pictureLight(x, 3.25, back, 1.0, 'z+', R.brassMat, R.sconceMat, 2.6, 2.6);
    }
    // A long oak reading table down the middle, with a brass lamp and two open ledgers.
    this.box([x - 0.45, 0.74, -42.6], [x + 0.45, 0.8, -40.0], R.oakMat, 1);
    for (const z of [-42.4, -40.2]) this.box([x - 0.4, 0, z - 0.04], [x + 0.4, 0.74, z + 0.04], R.oakMat);
    this.box([x + 0.15, 0.8, -41.0], [x + 0.19, 1.25, -40.96], R.brassMat);
    this.box([x + 0.02, 1.22, -41.12], [x + 0.3, 1.32, -40.84], R.sconceMat, 1, false);
    const paper = this.mat(new MeshStandardMaterial({ color: '#fbf6ec', roughness: 0.9 }));
    this.box([x - 0.3, 0.8, -41.9], [x + 0.05, 0.81, -41.5], paper, 1, false);
    this.box([x - 0.3, 0.8, -40.6], [x + 0.05, 0.81, -40.2], paper, 1, false);
    this.pool([x, 0.81, -41.0], 1.2, 1.6, 'y+', '#ffd9a8', 0.3);
    this.pool([x, 0.013, -41.3], 2.6, 4.2, 'y+', '#fff0d8', 0.12);
  }

  /**
   * Room 4, software: the studio at the end of the corridor. The back wall is one big window onto an olive tree and
   * the sky, with a walnut standing desk in front of it carrying two screens that face the visitor: Movigo's retailer
   * app on a portrait screen, and RouteCore's k-d tree benchmark on a landscape one. Track lights, polished
   * limestone and an amber rug.
   */
  private studioRoom(x: number, tint: string, R: RoomKit, room?: RoomContent) {
    const back = -44.2;
    const wall = this.shell(x, back, R.H + 0.4, R, R.limeMat, this.tintWall(tint));
    this.box([x - 1.6, R.H + 0.1, back - 0.3], [x + 1.6, R.H + 0.4, back], wall, 2, false); // header over the window
    // The window: steel frame and mullions, clear glass, the tree and the sky beyond.
    const glass = this.mat(new MeshStandardMaterial({ color: '#d4e3ea', transparent: true, opacity: 0.18, roughness: 0.05, depthWrite: false }));
    this.box([x - 1.6, 0.25, back - 0.17], [x + 1.6, R.H + 0.1, back - 0.15], glass, 1, false);
    this.box([x - 1.6, 0, back - 0.3], [x + 1.6, 0.25, back], R.limeMat); // sill
    for (const dx of [-1.6, -0.55, 0.55, 1.6]) this.box([x + dx - 0.04, 0.25, back - 0.22], [x + dx + 0.04, R.H + 0.1, back - 0.1], R.steelMat, 1);
    this.box([x - 1.6, 2.45, back - 0.22], [x + 1.6, 2.51, back - 0.1], R.steelMat, 1);
    this.tree(x + 0.6, back - 2.2, 1.25, R.leafMat, R.walnutMat);
    this.pool([x, 0.013, back + 1.2], 3.2, 2.4, 'y+', '#f4f8ff', 0.2);
    // Walnut standing desk with two screens facing the room.
    this.box([x - 1.0, 0.98, -42.9], [x + 1.0, 1.03, -42.3], R.walnutMat, 1);
    for (const dx of [-0.92, 0.92]) this.box([x + dx - 0.04, 0, -42.64], [x + dx + 0.04, 0.98, -42.56], R.steelMat);
    if (room?.screen) {
      this.box([x - 0.82, 1.08, -42.78], [x - 0.22, 1.86, -42.74], R.steelMat, 1);
      this.print(screenImage(room.screen), 0.56, 0.73, [x - 0.52, 1.47, -42.735], 'z+', 0.97);
      this.box([x - 0.54, 1.03, -42.8], [x - 0.5, 1.1, -42.76], R.steelMat);
    }
    if (room?.figure) {
      this.box([x - 0.12, 1.14, -42.78], [x + 1.0, 1.86, -42.74], R.steelMat, 1);
      this.print(figurePrint(room, room.figure), 1.08, 0.68, [x + 0.44, 1.5, -42.735], 'z+', 0.97);
      this.box([x + 0.42, 1.03, -42.8], [x + 0.46, 1.14, -42.76], R.steelMat);
    }
    // Track lights on a steel rail, and an amber rug.
    this.box([x - 0.012, R.H + 0.25, -40.8], [x + 0.012, R.H + 0.4, -40.78], R.steelMat, 1, false);
    this.box([x - 0.02, R.H + 0.22, back + 0.4], [x + 0.02, R.H + 0.26, -39.0], R.steelMat, 1, false);
    for (const z of [-43.2, -42.0, -40.8, -39.6]) {
      this.box([x - 0.05, R.H + 0.08, z - 0.05], [x + 0.05, R.H + 0.22, z + 0.05], R.steelMat, 1, false);
      this.box([x - 0.04, R.H + 0.075, z - 0.04], [x + 0.04, R.H + 0.08, z + 0.04], R.sconceMat, 1, false);
    }
    this.pool([x, 1.5, -42.73], 2.6, 1.6, 'z+', '#ffe6c4', 0.18);
    this.box([x - 1.1, 0.01, -42.0], [x + 1.1, 0.02, -39.3], this.mat(new MeshStandardMaterial({ color: '#c99a6a', roughness: 1 })), 1, false);
    // A low oak bench on the left wall.
    this.box([x - 1.6, 0.4, -41.6], [x - 1.2, 0.46, -39.4], R.oakMat, 1);
    this.box([x - 1.58, 0, -41.5], [x - 1.22, 0.4, -39.5], R.walnutMat);
  }

  /**
   * The courtyard, where the walk ends: an elevated limestone terrace that opens off the study when its far wall
   * sinks. Three zones, read left to right from the study: a planted bed and a long, narrow reflecting rill; in the
   * middle, the focal wall, limestone with the invitation set in brass; on the right, an oak deck under a slatted
   * pergola with a linen lounge. Glass balustrades with a brass rail close the terrace, and beyond them is sky.
   */
  private courtyard(R: RoomKit, concreteMat: Material) {
    const [X0, X1, Z0, Z1] = [16.3, 33, -38, -24];
    this.box([X0, 0, Z0], [X1, 0.02, Z1], R.limeMat, 2); // terrace paving
    // Glass balustrades on the three open edges, with a brass handrail and slim posts.
    const glass = this.mat(new MeshStandardMaterial({ color: '#d4e3ea', transparent: true, opacity: 0.2, roughness: 0.05, depthWrite: false }));
    const edges: [V3, V3][] = [
      [[X1 - 0.03, 0.02, Z0], [X1, 1.0, Z1]],
      [[X0, 0.02, Z0], [X1, 1.0, Z0 + 0.03]],
      [[X0, 0.02, Z1 - 0.03], [X1, 1.0, Z1]],
    ];
    for (const [a, b] of edges) {
      this.box(a, b, glass, 1, false);
      this.box([a[0] - 0.02, 1.0, a[2] - 0.02], [b[0] + 0.02, 1.05, b[2] + 0.02], R.brassMat, 1, false);
    }
    for (let z = Z0; z <= Z1; z += 2) this.box([X1 - 0.05, 0, z - 0.02], [X1 + 0.02, 1.0, z + 0.02], R.steelMat, 1);
    for (let x = X0 + 1.4; x < X1; x += 2) {
      this.box([x - 0.02, 0, Z0 - 0.02], [x + 0.02, 1.0, Z0 + 0.05], R.steelMat, 1);
      this.box([x - 0.02, 0, Z1 - 0.05], [x + 0.02, 1.0, Z1 + 0.02], R.steelMat, 1);
    }

    /* left: a planted bed along the edge, and the rill */
    this.box([X0 + 0.6, 0, Z0 + 0.1], [X1 - 0.6, 0.5, Z0 + 1.4], R.limeMat); // planter wall
    const soil = this.mat(new MeshStandardMaterial({ color: '#7f8a5e', roughness: 1 }));
    this.box([X0 + 0.7, 0.5, Z0 + 0.2], [X1 - 0.7, 0.52, Z0 + 1.3], soil, 1, false);
    const grass = this.mat(new MeshStandardMaterial({ color: '#a3ad7c', roughness: 0.9 }));
    for (let x = X0 + 1.2; x < X1 - 1; x += 0.75) {
      const g = new IcosahedronGeometry(0.32, 0);
      this.disposables.push(g);
      const m = new Mesh(g, grass);
      m.position.set(x, 0.66, Z0 + 0.75 + Math.sin(x * 3) * 0.2);
      m.scale.set(1.2, 0.7 + ((x * 7) % 3) * 0.12, 1);
      this.scene.add(m);
    }
    this.tree(20.5, Z0 + 0.8, 1.05, R.leafMat, R.walnutMat);
    this.tree(26.8, Z0 + 0.7, 1.2, R.leafMat, R.walnutMat);
    const water = this.mat(new MeshStandardMaterial({ color: '#7d9ca6', metalness: 0.5, roughness: 0.06, emissive: '#c4dbe3', emissiveIntensity: 0.22 }));
    this.box([17.2, 0.02, -31.45], [30.0, 0.06, -30.55], water, 2, false);
    this.box([17.1, 0.02, -31.6], [30.1, 0.1, -31.45], R.limeMat); // coping
    this.box([17.1, 0.02, -30.55], [30.1, 0.1, -30.4], R.limeMat);
    this.box([17.1, 0.1, -31.62], [30.1, 0.105, -31.6], R.brassMat, 1, false);
    this.box([17.1, 0.1, -30.4], [30.1, 0.105, -30.38], R.brassMat, 1, false);
    this.pool([23.6, 0.07, -31], 13, 1.6, 'y+', '#eaf4ff', 0.12);

    /* middle: the focal wall, with the invitation in brass on limestone */
    const wallMat = this.mat(new MeshStandardMaterial({ map: this.limeTex, color: '#f3ece0', roughness: 0.75 }));
    this.box([30.6, 0, -33.4], [31.15, 4.0, -28.6], wallMat);
    this.box([30.55, 0.02, -33.2], [30.6, 0.07, -28.8], R.sconceMat, 1, false); // light slot at its foot
    this.pool([30.595, 1.6, -31], 5.0, 3.6, 'x-', '#ffe2bd', 0.3);
    const inv = this.opts.invitation;
    if (inv) {
      this.box([30.56, 1.05, -33.0], [30.6, 3.15, -29.0], R.brassMat, 1, false);
      this.print(invitationPrint(inv), 3.9, 2.0, [30.555, 2.1, -31], 'x-', 0.97);
    }
    // Olive trees in tall limestone planters either side of it.
    for (const z of [-35.0, -27.0]) {
      this.box([30.3, 0, z - 0.55], [31.4, 0.8, z + 0.55], R.limeMat);
      this.tree(30.85, z, 1.15, R.leafMat, R.walnutMat);
    }

    /* right: an oak deck under a slatted pergola, with a linen lounge */
    const [DX0, DX1, DZ0, DZ1] = [22.6, 29.6, -28.0, -24.4];
    this.box([DX0, 0, DZ0], [DX1, 0.2, DZ1], this.mat(new MeshStandardMaterial({ map: R.oakTex, color: '#e9d2b0', roughness: 0.6 })), 1);
    this.box([DX0 - 0.6, 0, DZ0 - 0.5], [DX0 + 0.6, 0.1, DZ0 + 0.6], R.limeMat); // step up
    for (const [x, z] of [[DX0 + 0.2, DZ0 + 0.2], [DX1 - 0.2, DZ0 + 0.2], [DX0 + 0.2, DZ1 - 0.25], [DX1 - 0.2, DZ1 - 0.25]]) {
      this.box([x - 0.06, 0.2, z - 0.06], [x + 0.06, 3.1, z + 0.06], R.steelMat);
    }
    for (const z of [DZ0 + 0.2, DZ1 - 0.25]) this.box([DX0 - 0.3, 3.1, z - 0.08], [DX1 + 0.3, 3.32, z + 0.08], R.walnutMat, 1);
    for (let x = DX0; x <= DX1; x += 0.32) this.box([x - 0.03, 3.32, DZ0 - 0.2], [x + 0.03, 3.46, DZ1 + 0.2], R.oakMat, 1);
    for (const z of [DZ0 + 0.2, DZ1 - 0.25]) this.box([DX0, 3.085, z - 0.03], [DX1, 3.1, z + 0.03], R.stripMat, 1, false); // lights under the beams
    const linen = this.mat(new MeshStandardMaterial({ color: '#ece4d6', roughness: 0.95 }));
    const cushion = this.mat(new MeshStandardMaterial({ color: '#d9cbb3', roughness: 0.95 }));
    // L-shaped sofa against the back of the deck, a low walnut table, two lounge chairs facing it.
    this.box([23.6, 0.2, DZ1 - 1.0], [28.2, 0.62, DZ1 - 0.2], linen);
    this.box([23.6, 0.62, DZ1 - 0.45], [28.2, 1.05, DZ1 - 0.2], cushion);
    this.box([23.6, 0.2, DZ1 - 2.6], [24.4, 0.62, DZ1 - 1.0], linen);
    this.box([25.2, 0.2, DZ1 - 2.3], [27.2, 0.55, DZ1 - 1.5], R.walnutMat);
    for (const x of [25.6, 27.1]) {
      this.box([x - 0.4, 0.2, DZ0 + 0.5], [x + 0.4, 0.58, DZ0 + 1.3], linen);
      this.box([x - 0.4, 0.58, DZ0 + 0.5], [x + 0.4, 0.95, DZ0 + 0.72], cushion);
    }
    const vase = this.mat(new MeshStandardMaterial({ color: '#c9b79a', roughness: 0.8 }));
    this.box([26.0, 0.55, DZ1 - 2.0], [26.2, 0.8, DZ1 - 1.8], vase);
    // A floor lantern at the end of the sofa, and the warm light the pergola throws on the deck.
    this.box([28.7, 0.2, DZ1 - 0.75], [28.76, 1.4, DZ1 - 0.69], R.brassMat);
    this.box([28.58, 1.4, DZ1 - 0.87], [28.88, 1.75, DZ1 - 0.57], R.sconceMat, 1, false);
    this.pool([(DX0 + DX1) / 2, 0.21, (DZ0 + DZ1) / 2], 7.4, 4.0, 'y+', '#ffe2b8', 0.16);
    this.pool([28.73, 0.21, DZ1 - 0.72], 2.0, 2.0, 'y+', '#ffd9a8', 0.3);
    const pergolaLight = new PointLight('#fff0d8', 5, 9, 1.5);
    pergolaLight.position.set(26.1, 2.8, -26.2);
    this.scene.add(pergolaLight);

    // Low path lights along the terrace, from the study to the wall.
    for (const x of [19.5, 23.5, 27.5]) {
      for (const z of [-32.4, -29.6]) {
        this.box([x - 0.06, 0.02, z - 0.06], [x + 0.06, 0.4, z + 0.06], concreteMat);
        this.box([x - 0.065, 0.3, z - 0.065], [x + 0.065, 0.36, z + 0.065], R.sconceMat, 1, false);
        this.pool([x, 0.025, z], 1.5, 1.5, 'y+', '#ffd9a8', 0.2);
      }
    }
  }

  /** A small olive tree: a trunk and a loose crown of leaf masses. */
  private tree(x: number, z: number, scale: number, leafMat: Material, trunkMat: Material) {
    this.box([x - 0.06 * scale, 0, z - 0.06 * scale], [x + 0.06 * scale, 1.5 * scale, z + 0.06 * scale], trunkMat, 1);
    const geo = new IcosahedronGeometry(0.55 * scale, 1);
    this.disposables.push(geo);
    const blobs: V3[] = [[0, 1.8, 0], [0.38, 1.6, 0.12], [-0.34, 1.65, -0.1], [0.08, 2.15, -0.06], [-0.12, 1.55, 0.32]];
    for (const [dx, dy, dz] of blobs) {
      const m = new Mesh(geo, leafMat);
      m.position.set(x + dx * scale, dy * scale, z + dz * scale);
      m.scale.setScalar(0.75 + (dx + dz + 1) * 0.2);
      m.castShadow = !this.opts.light;
      this.scene.add(m);
    }
  }

  /** The front of the house: boundary wall, portal with the nameplate, gate, path, facade and the pivot door. */
  private buildEntrance(m: Record<'concreteMat' | 'limeMat' | 'steelMat' | 'walnutMat' | 'brassMat' | 'soffitMat' | 'stripMat' | 'glowMat' | 'sconceMat' | 'leafMat', MeshStandardMaterial>) {
    const light = this.opts.light;
    const H = 3.4;
    const { concreteMat, limeMat, steelMat, walnutMat, brassMat, soffitMat, stripMat, glowMat, sconceMat, leafMat } = m;

    /* facade: two concrete masses, a canopy with downlights, a glass ribbon */
    this.box([-11, 0, -2], [-1.2, 3.8, 0], concreteMat); // left mass
    this.box([1.2, 0, -2], [8, 5.4, 0], concreteMat); // right mass
    this.box([-1.2, H, -2], [1.2, 3.8, 0], concreteMat); // lintel
    this.box([-12, 3.8, -2.2], [2.6, 4.05, 2.8], soffitMat); // canopy slab over the entrance, pale underside
    this.box([-12, 3.8, 2.72], [2.6, 4.08, 2.84], steelMat); // its blackened steel fascia
    this.box([-12, 3.72, 2.62], [2.6, 3.8, 2.8], stripMat, 2, false); // light line under the canopy edge
    for (const x of [-4.5, -2.2, 0, 2.0]) {
      this.box([x - 0.12, 3.79, 1.38], [x + 0.12, 3.8, 1.62], stripMat, 1, false); // recessed downlights
      this.pool([x, 0.13, 1.5], 2.2, 2.2, 'y+', '#ffe6c4', 0.1);
    }
    // Glass ribbon in the right mass, lit from inside, with steel mullions.
    this.box([2.1, 1.0, -0.06], [7.2, 4.4, 0.02], glowMat, 2, false);
    for (let x = 2.1; x <= 7.21; x += 1.275) this.box([x - 0.04, 1.0, -0.02], [x + 0.04, 4.4, 0.08], steelMat);
    this.box([2.1, 2.66, -0.02], [7.2, 2.74, 0.08], steelMat);
    // Low planters along the facade, planted.
    this.box([-10.5, 0, 0.2], [-5.5, 0.55, 1.2], concreteMat);
    this.box([3, 0, 0.2], [7.5, 0.45, 1.0], concreteMat);
    for (const [x, z, sc] of [[-9.2, 0.7, 0.55], [-7.6, 0.7, 0.5], [-6.3, 0.7, 0.45], [4.2, 0.6, 0.45], [6.4, 0.6, 0.5]] as V3[]) {
      const g = new IcosahedronGeometry(sc, 1);
      this.disposables.push(g);
      const b = new Mesh(g, leafMat);
      b.position.set(x, 0.5 + sc * 0.6, z);
      b.scale.set(1.3, 0.8, 1);
      b.castShadow = !light;
      this.scene.add(b);
    }

    /* the door portal: a deep limestone surround with a brass reveal, on a two-step threshold */
    this.box([-1.62, 0.24, -0.1], [-1.24, H + 0.4, 0.32], limeMat); // jambs
    this.box([1.24, 0.24, -0.1], [1.62, H + 0.4, 0.32], limeMat);
    this.box([-1.62, H, -0.1], [1.62, H + 0.4, 0.32], limeMat); // head
    this.box([-1.25, 0.24, -0.08], [-1.2, H + 0.02, 0.1], brassMat, 1, false); // brass reveal
    this.box([1.2, 0.24, -0.08], [1.25, H + 0.02, 0.1], brassMat, 1, false);
    this.box([-1.25, H - 0.03, -0.08], [1.25, H + 0.02, 0.1], brassMat, 1, false);
    this.box([-1.9, 0, 0], [1.9, 0.12, 1.4], limeMat, 2); // threshold steps
    this.box([-1.7, 0.12, 0], [1.7, 0.24, 0.8], limeMat, 2);
    for (const x of [-2.05, 2.05]) {
      this.box([x - 0.09, 1.9, 0], [x + 0.09, 2.6, 0.14], brassMat); // sconce back plate
      this.box([x - 0.06, 1.95, 0.14], [x + 0.06, 2.55, 0.16], sconceMat, 1, false); // its glowing face
      this.pool([x, 2.25, 0.012], 1.2, 2.8, 'z+', '#ffd9a8', 0.5);
    }

    // The pivot door: fluted walnut turning on an axis a third of the way across, with a full-height brass pull.
    const doorH = H - 0.26;
    const doorGeo = new BoxGeometry(2.36, doorH, 0.1);
    this.disposables.push(doorGeo);
    const slab = new Mesh(doorGeo, walnutMat);
    slab.position.set(0.39, 0.24 + doorH / 2, 0);
    slab.castShadow = !light;
    this.door.add(slab);
    const fluteGeo = new BoxGeometry(0.07, doorH - 0.28, 0.035);
    this.disposables.push(fluteGeo);
    for (let k = 0; k < 13; k++) {
      const flute = new Mesh(fluteGeo, walnutMat);
      flute.position.set(0.39 - 1.06 + k * 0.177, 0.24 + doorH / 2, 0.065);
      flute.castShadow = !light;
      this.door.add(flute);
    }
    const pullGeo = new BoxGeometry(0.045, 1.9, 0.06);
    this.disposables.push(pullGeo);
    const pull = new Mesh(pullGeo, brassMat);
    pull.position.set(1.36, 1.35, 0.15);
    this.door.add(pull);
    this.door.position.set(-0.39, 0, -0.06);
    this.scene.add(this.door);
    // Light that spills onto the path as the door opens.
    this.spill = this.mat(new MeshBasicMaterial({ color: '#ffb877', transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false }));
    const spillGeo = new PlaneGeometry(2.6, 6);
    this.disposables.push(spillGeo);
    const spill = new Mesh(spillGeo, this.spill);
    spill.rotation.x = -Math.PI / 2;
    spill.position.set(0, 0.035, 4.2);
    this.scene.add(spill);

    /* the path: limestone slabs from the gate to the steps, with low bollard lights either side */
    for (let k = 0; k < 5; k++) this.box([-0.9, 0, 1.6 + k * 1.5], [0.9, 0.03, 2.6 + k * 1.5], limeMat, 2);
    for (const z of [3.0, 6.0]) {
      for (const x of [-1.45, 1.45]) {
        this.box([x - 0.08, 0, z - 0.08], [x + 0.08, 0.62, z + 0.08], steelMat);
        this.box([x - 0.085, 0.5, z - 0.085], [x + 0.085, 0.58, z + 0.085], sconceMat, 1, false);
        this.pool([x, 0.035, z], 1.6, 1.6, 'y+', '#ffd9a8', 0.22);
      }
    }

    /* the boundary: a low limestone wall, two piers and a lintel carrying the nameplate */
    const [pz0, pz1] = [GATE_Z - 0.3, GATE_Z + 0.3];
    for (const [a, b] of [[-12, -GATE_HALF - 0.6], [GATE_HALF + 0.6, 10]]) {
      this.box([a, 0, GATE_Z - 0.18], [b, 1.05, GATE_Z + 0.18], limeMat);
      this.box([a, 1.05, GATE_Z - 0.21], [b, 1.09, GATE_Z + 0.21], brassMat, 1, false); // brass coping
    }
    for (const sx of [-1, 1]) {
      const [a, b] = sx < 0 ? [-GATE_HALF - 0.6, -GATE_HALF] : [GATE_HALF, GATE_HALF + 0.6];
      this.box([a, 0, pz0], [b, 2.75, pz1], limeMat); // pier
      this.box([a + 0.06, 0.05, pz1], [b - 0.06, 0.09, pz1 + 0.01], sconceMat, 1, false); // uplight slot at its foot
      this.pool([(a + b) / 2, 1.2, pz1 + 0.005], 0.9, 2.6, 'z+', '#ffdcae', 0.32);
    }
    // Lintel over both piers: limestone, with a light line under it and the brass nameplate on its face.
    const LY0 = 2.75;
    const LY1 = 3.6;
    this.box([-GATE_HALF - 0.75, LY0, pz0 - 0.05], [GATE_HALF + 0.75, LY1, pz1 + 0.05], limeMat);
    this.box([-GATE_HALF - 0.75, LY0 - 0.02, pz1 + 0.02], [GATE_HALF + 0.75, LY0, pz1 + 0.05], sconceMat, 1, false);
    const plateTex = this.tex(nameplate(this.opts.name, this.opts.line));
    // A little emission keeps the plate legible against the sky at any exposure.
    const plateMat = this.mat(new MeshStandardMaterial({ map: plateTex, metalness: 0.25, roughness: 0.42, emissive: '#ffffff', emissiveMap: plateTex, emissiveIntensity: 0.32 }));
    const plateGeo = new BoxGeometry(3.9, 0.73, 0.03);
    this.disposables.push(plateGeo);
    const plate = new Mesh(plateGeo, [brassMat, brassMat, brassMat, brassMat, plateMat, brassMat]);
    plate.position.set(0, (LY0 + LY1) / 2, pz1 + 0.07);
    this.scene.add(plate);
    const plateLight = new PointLight('#fff2dc', 4, 4.2, 1.6);
    plateLight.position.set(0, LY0 - 0.5, pz1 + 1.4);
    this.scene.add(plateLight);

    // Two gate leaves: walnut slats in a slim brass frame, hinged at the piers, opening inward as the visitor arrives.
    const leafW = GATE_HALF;
    const leafH = 1.9;
    const slatGeo = new BoxGeometry(0.09, leafH - 0.16, 0.05);
    const railGeo = new BoxGeometry(leafW, 0.06, 0.07);
    const stileGeo = new BoxGeometry(0.06, leafH, 0.07);
    this.disposables.push(slatGeo, railGeo, stileGeo);
    for (const sx of [-1, 1]) {
      const g = new Group();
      const dir = -sx; // the leaf extends from its hinge towards the middle
      const add = (geo: BoxGeometry, mat: Material, x: number, y: number) => {
        const mesh = new Mesh(geo, mat);
        mesh.position.set(x, y, 0);
        mesh.castShadow = !light;
        g.add(mesh);
      };
      add(railGeo, brassMat, (dir * leafW) / 2, 0.2);
      add(railGeo, brassMat, (dir * leafW) / 2, 0.2 + leafH - 0.06);
      add(stileGeo, brassMat, dir * 0.03, 0.2 + leafH / 2);
      add(stileGeo, brassMat, dir * (leafW - 0.03), 0.2 + leafH / 2);
      for (let k = 0; k < 11; k++) add(slatGeo, walnutMat, dir * (0.14 + k * 0.142), 0.2 + leafH / 2);
      g.position.set(sx * GATE_HALF, 0, GATE_Z);
      this.scene.add(g);
      this.gate.push(g);
    }

    // Olive trees in the forecourt, either side of the path.
    this.tree(-4.6, 5.2, 1, leafMat, walnutMat);
    this.tree(4.4, 4.6, 0.9, leafMat, walnutMat);
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

  // Below 25 fps, drop the pixel ratio and shadows once; below about 16 fps after that, stop and let the poster show.
  // (Laptops on battery often cap animation at 30 fps, so the first threshold sits clear of 33 ms.)
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
    if (median <= (degraded ? 60 : 40)) {
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
    // At the gallery boards and the credentials wall the camera holds still and square, so the lean fades out.
    const steady = Math.max(smooth(1.5, 2, s) * (1 - smooth(6.3, 6.8, s)), smooth(11.4, 12, s) * (1 - smooth(12.2, 12.6, s)));
    const lean = 1 - steady * 0.9;
    this.look.x += this.pointer.x * 0.35 * lean;
    this.look.y -= this.pointer.y * 0.2 * lean;
    this.camera.lookAt(this.look);

    // The gate swings open as the visitor walks up, then the door opens between the gate and the threshold; both
    // close again on the way back.
    const gate = smooth(0.02, 0.5, s) * 1.75;
    this.gate[0].rotation.y = gate;
    this.gate[1].rotation.y = -gate;
    const open = smooth(0.08, 0.95, s);
    this.door.rotation.y = open * 1.42;
    this.doorLight.intensity = open * 12;
    this.spill.opacity = open * 0.08 * (1 - smooth(1.6, 2.4, s));

    // Inside, a soft light travels just ahead of the visitor.
    const inside = smooth(1.1, 2, s);
    this.camera.getWorldDirection(this.tmp);
    this.guide.position.set(this.camera.position.x + this.tmp.x * 2.6, 3.0, this.camera.position.z + this.tmp.z * 2.6);
    this.guide.intensity = inside * 10 * (1 - smooth(11.6, 12.4, s) * 0.6);

    // The room light stands in whichever room is being read, sliding between rooms with the camera.
    const r = Math.min(3, Math.max(0, s - 8));
    const k = Math.min(2, Math.floor(r));
    this.roomLight.position.x = ROOM_X[k] + (ROOM_X[k + 1] - ROOM_X[k]) * smooth(0, 1, r - k);
    this.roomLight.intensity = 9 * smooth(6.6, 7.6, s) * (1 - smooth(11.2, 11.9, s));

    // Boards brighten a little as the visitor reaches them; all of them stay readable.
    this.framePanels.forEach((m, n) => {
      const near = Math.max(0, 1 - Math.abs(s - (2 + n)) * 1.1);
      m.color.setScalar(0.94 + near * 0.06);
    });

    // Rooms brighten while their chapter is read.
    this.roomWalls.forEach((m, n) => {
      const near = Math.max(0, 1 - Math.abs(s - (8 + n)));
      m.emissiveIntensity = 0.06 + near * 0.3;
    });

    // The courtyard: the study's far wall sinks into the floor and its roof lifts away.
    const unfold = smooth(12.25, 12.95, s);
    this.sinking.forEach((m) => (m.position.y = 1.6 - unfold * 3.25));
    this.lifting.forEach((m) => (m.position.y = 3.35 + unfold * 7));
    this.skyMat.uniforms.uOpen.value = unfold;
    this.hemi.intensity = 2.1 + unfold * 0.3;

    // Haze: cool daylight outside; indoors a thin warm haze that softens distance without greying the rooms.
    const indoors = smooth(1.2, 2.2, s) * (1 - unfold);
    this.fog.density = 0.01 + indoors * 0.004;
    this.fog.color.copy(this.fogOut).lerp(this.fogIn, indoors);
    this.renderer.toneMappingExposure = 0.98 + indoors * 0.03 + unfold * 0.06;

    this.renderer.render(this.scene, this.camera);
  }
}
