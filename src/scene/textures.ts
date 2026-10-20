import { CanvasTexture, RepeatWrapping, SRGBColorSpace, TextureLoader } from 'three';
import { rng } from './rng';

// Procedural surfaces for the residence, drawn once into small canvases. No downloaded textures, so the scene
// has no remote assets and no licences to track. Each texture covers `size` metres; geometry UVs are scaled to
// world metres (see boxUV in Residence.ts), so one texture tiles evenly across walls of any size.

function canvas(px: number, draw: (g: CanvasRenderingContext2D, px: number) => void) {
  const c = document.createElement('canvas');
  c.width = c.height = px;
  draw(c.getContext('2d')!, px);
  const t = new CanvasTexture(c);
  t.wrapS = t.wrapT = RepeatWrapping;
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function grain(g: CanvasRenderingContext2D, px: number, seed: number, amount: number, alpha: number) {
  const r = rng(seed);
  for (let i = 0; i < amount; i++) {
    const v = Math.floor(r() * 255);
    g.fillStyle = `rgba(${v},${v},${v},${alpha * r()})`;
    g.fillRect(r() * px, r() * px, 1 + r() * 2, 1 + r() * 2);
  }
}

/** Board-formed concrete, 2 m square: soft mottling, horizontal board joints, a few tie holes. */
export function concrete(base = '#cfc8bb') {
  return canvas(512, (g, px) => {
    g.fillStyle = base;
    g.fillRect(0, 0, px, px);
    const r = rng(11);
    for (let i = 0; i < 160; i++) {
      const x = r() * px;
      const y = r() * px;
      const rad = 20 + r() * 90;
      const grd = g.createRadialGradient(x, y, 0, x, y, rad);
      // Mostly warm highlights with a few soft darker patches, so pale concrete reads as stone, not as stains.
      const dark = r() < 0.3;
      grd.addColorStop(0, dark ? `rgba(90,74,54,${0.012 + r() * 0.016})` : `rgba(255,250,240,${0.03 + r() * 0.04})`);
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = grd;
      g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
    grain(g, px, 12, 9000, 0.07);
    g.fillStyle = 'rgba(80,64,44,0.14)';
    for (let k = 1; k < 4; k++) g.fillRect(0, (k * px) / 4, px, 2);
    g.fillStyle = 'rgba(80,64,44,0.3)';
    for (const [x, y] of [[0.25, 0.125], [0.75, 0.125], [0.25, 0.625], [0.75, 0.625]]) {
      g.beginPath();
      g.arc(x * px, y * px, 3, 0, Math.PI * 2);
      g.fill();
    }
  });
}

/** Walnut or oak, 1 m square: long vertical grain with darker figure lines. */
export function walnut(base = '#5a3a26') {
  return canvas(256, (g, px) => {
    g.fillStyle = base;
    g.fillRect(0, 0, px, px);
    const r = rng(21);
    for (let i = 0; i < 70; i++) {
      const x = r() * px;
      const w = 0.5 + r() * 2.5;
      const dark = r() < 0.6;
      g.strokeStyle = dark ? `rgba(30,16,8,${0.15 + r() * 0.25})` : `rgba(160,110,70,${0.08 + r() * 0.12})`;
      g.lineWidth = w;
      g.beginPath();
      g.moveTo(x, 0);
      for (let y = 0; y <= px; y += 16) g.lineTo(x + Math.sin(y / 40 + i) * 3, y);
      g.stroke();
    }
    grain(g, px, 22, 2500, 0.08);
  });
}

/** Large-format stone tiles, 2 m square: four 1 m tiles with fine joints. */
export function stone(base = '#d6cdbd', joint = 'rgba(90,70,50,0.28)') {
  return canvas(256, (g, px) => {
    g.fillStyle = base;
    g.fillRect(0, 0, px, px);
    const r = rng(31);
    for (let i = 0; i < 4; i++) {
      const v = r() * 18 - 9;
      g.fillStyle = `rgba(${v > 0 ? 255 : 0},${v > 0 ? 255 : 0},${v > 0 ? 255 : 0},${Math.abs(v) / 255})`;
      g.fillRect((i % 2) * (px / 2), Math.floor(i / 2) * (px / 2), px / 2, px / 2);
    }
    grain(g, px, 32, 3500, 0.09);
    g.fillStyle = joint;
    g.fillRect(0, 0, px, 1.5);
    g.fillRect(0, px / 2, px, 1.5);
    g.fillRect(0, 0, 1.5, px);
    g.fillRect(px / 2, 0, 1.5, px);
  });
}

/** The brass nameplate on the entrance portal: pale champagne brass with deep engraved lettering, so the name keeps
 *  its contrast in full sun and under the plate light. */
export function nameplate(name: string, line: string) {
  const w = 2048;
  const h = 512;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  const brass = g.createLinearGradient(0, 0, w, h);
  brass.addColorStop(0, '#d9bf8c');
  brass.addColorStop(0.45, '#f1dfb4');
  brass.addColorStop(0.62, '#e6cd98');
  brass.addColorStop(1, '#cfb07a');
  g.fillStyle = brass;
  g.fillRect(0, 0, w, h);
  // Brushed finish
  const r = rng(41);
  for (let i = 0; i < 1400; i++) {
    g.fillStyle = `rgba(255,248,230,${r() * 0.07})`;
    g.fillRect(0, r() * h, w, 1);
  }
  // A bevelled edge, cut and polished.
  g.strokeStyle = 'rgba(120,88,40,0.6)';
  g.lineWidth = 8;
  g.strokeRect(20, 20, w - 40, h - 40);
  g.strokeStyle = 'rgba(255,248,228,0.7)';
  g.lineWidth = 3;
  g.strokeRect(30, 30, w - 60, h - 60);
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const engrave = (text: string, y: number, size: number, spacing: number, weight: number) => {
    // Shrink the lettering until it fits the plate with a margin either side.
    const ctx = g as CanvasRenderingContext2D & { letterSpacing?: string };
    let px = size;
    for (;;) {
      g.font = `${weight} ${px}px "Archivo Variable", Archivo, sans-serif`;
      ctx.letterSpacing = `${(spacing * px) / size}px`;
      if (g.measureText(text).width <= w * 0.86 || px < 12) break;
      px -= 2;
    }
    // Engraved: a light lip below the cut and a dark fill.
    g.fillStyle = 'rgba(255,246,222,0.75)';
    g.fillText(text, w / 2 + 2, y + 3);
    g.fillStyle = '#1f150a';
    g.fillText(text, w / 2, y);
  };
  engrave(name, h * 0.43, 200, 40, 680);
  engrave(line, h * 0.76, 62, 14, 560);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

export interface FrameContent {
  title: string;
  line: string;
  skills: string[];
  projects: string[];
}

/** The face of a framed board in the gallery: the domain's title, what it is, its skills and its projects. */
export function framePrint(content: FrameContent) {
  const w = 720;
  const h = 880;
  const pad = 64;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  g.fillStyle = '#f6f1e7';
  g.fillRect(0, 0, w, h);
  grain(g, w, 51, 2500, 0.04);
  const wrap = (text: string, font: string, max: number) => {
    g.font = font;
    const lines: string[] = [];
    let line = '';
    for (const word of text.split(' ')) {
      const next = line ? `${line} ${word}` : word;
      if (g.measureText(next).width > max && line) {
        lines.push(line);
        line = word;
      } else line = next;
    }
    if (line) lines.push(line);
    return lines;
  };
  let y = 96;
  g.fillStyle = '#85632d';
  g.fillRect(pad, y, 64, 4);
  y += 70;
  g.fillStyle = '#221e19';
  const titleFont = '400 60px "Source Serif 4 Variable", "Source Serif 4", Georgia, serif';
  for (const l of wrap(content.title, titleFont, w - pad * 2)) {
    g.font = titleFont;
    g.fillText(l, pad, y);
    y += 68;
  }
  y += 6;
  g.fillStyle = '#5c5449';
  const bodyFont = '400 27px "Archivo Variable", Archivo, sans-serif';
  for (const l of wrap(content.line, bodyFont, w - pad * 2)) {
    g.font = bodyFont;
    g.fillText(l, pad, y);
    y += 38;
  }
  y += 28;
  g.fillStyle = '#d2c6b1';
  g.fillRect(pad, y, w - pad * 2, 2);
  y += 48;
  const skillFont = '500 26px "Archivo Variable", Archivo, sans-serif';
  for (const s of content.skills.slice(0, 5)) {
    const lines = wrap(s, skillFont, w - pad * 2 - 30);
    g.fillStyle = '#85632d';
    g.fillRect(pad, y - 16, 12, 12);
    g.fillStyle = '#221e19';
    lines.slice(0, 2).forEach((l, k) => {
      g.font = skillFont;
      g.fillText(l, pad + 30, y + k * 34);
    });
    y += 34 * Math.min(2, lines.length) + 14;
  }
  y += 14;
  g.fillStyle = '#5c5449';
  g.font = '600 22px "Archivo Variable", Archivo, sans-serif';
  g.fillText('Projects', pad, y);
  y += 36;
  g.fillStyle = '#221e19';
  const projFont = '400 24px "Archivo Variable", Archivo, sans-serif';
  for (const l of wrap(content.projects.join(', '), projFont, w - pad * 2).slice(0, 3)) {
    g.font = projFont;
    g.fillText(l, pad, y);
    y += 34;
  }
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** A soft wash of light for a room's back wall: bright at the top, falling away to the floor. */
export function wash() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 256;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(32, 0, 4, 32, 0, 260);
  grd.addColorStop(0, '#ffffff');
  grd.addColorStop(0.45, '#6a6a6a');
  grd.addColorStop(1, '#0a0a0a');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 256);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

/** A soft pool of light, white at the centre and falling off to nothing: laid over a wall or floor with additive
 *  blending where a sconce, picture light or downlight throws its light. */
export function glow() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.35, 'rgba(255,255,255,0.45)');
  grd.addColorStop(0.7, 'rgba(255,255,255,0.1)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function wrapText(g: CanvasRenderingContext2D, text: string, font: string, max: number) {
  g.font = font;
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (g.measureText(next).width > max && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

export interface RoomContent {
  title: string;
  line: string;
  tint: string;
  projects: string[]; // the room's featured projects, by name
  count: number;
  figure?: RoomFigure; // the evidence on the room's focal display
  screen?: string; // a screenshot for the room's monitor, from /public/images
}

export interface CertContent {
  title: string;
  issuer: string;
  date?: string;
}

/** A framed credential on the study wall, set as type: issuer, title and date. Not a picture of the certificate. */
export function certPrint(content: CertContent, diploma = false) {
  const w = 600;
  const h = diploma ? 460 : 420;
  const pad = 48;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  g.fillStyle = '#fffcf5';
  g.fillRect(0, 0, w, h);
  g.strokeStyle = '#d9c9ad';
  g.lineWidth = 3;
  g.strokeRect(22, 22, w - 44, h - 44);
  const ctx = g as CanvasRenderingContext2D & { letterSpacing?: string };
  g.textAlign = 'center';
  let y = 92;
  g.fillStyle = '#85632d';
  g.font = '680 30px "Archivo Variable", Archivo, sans-serif';
  ctx.letterSpacing = '4px';
  g.fillText(content.issuer.toUpperCase(), w / 2, y);
  ctx.letterSpacing = '0px';
  y += 70;
  g.fillStyle = '#221e19';
  const titleFont = `460 ${diploma ? 46 : 54}px "Source Serif 4 Variable", "Source Serif 4", Georgia, serif`;
  for (const l of wrapText(g, content.title, titleFont, w - pad * 2).slice(0, 4)) {
    g.font = titleFont;
    g.fillText(l, w / 2, y);
    y += diploma ? 54 : 62;
  }
  if (content.date) {
    g.fillStyle = '#5c5449';
    g.font = '500 24px "Archivo Variable", Archivo, sans-serif';
    g.fillText(content.date, w / 2, h - 60);
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/* ------------------------------------------------------------ Room displays */

// Each project room's focal display shows that room's own evidence, from the same records as the HTML room.
export type RoomFigure =
  | { kind: 'calibration'; bins: { bin: string; predicted: number; observed: number }[]; caption: string }
  | { kind: 'flow'; stages: { label: string; kind: 'model' | 'rule' | 'human' | 'io' }[]; caption: string }
  | { kind: 'ledger'; rows: { value: string; name: string }[]; caption: string }
  | { kind: 'benchmark'; rows: { n: string; brute: number; kd: number }[]; caption: string };

function sheet(w: number, h: number, tint: string) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  g.fillStyle = '#f8f3ea';
  g.fillRect(0, 0, w, h);
  grain(g, w, 71, 2500, 0.03);
  g.fillStyle = tint;
  g.fillRect(0, 0, w, 10);
  return { c, g };
}

function finish(c: HTMLCanvasElement) {
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function heading(g: CanvasRenderingContext2D, kicker: string, title: string, tint: string, x: number, y: number, size = 64) {
  const ctx = g as CanvasRenderingContext2D & { letterSpacing?: string };
  g.textAlign = 'left';
  g.fillStyle = tint;
  g.font = '650 24px "Archivo Variable", Archivo, sans-serif';
  ctx.letterSpacing = '5px';
  g.fillText(kicker.toUpperCase(), x, y);
  ctx.letterSpacing = '0px';
  g.fillStyle = '#221e19';
  g.font = `420 ${size}px "Source Serif 4 Variable", "Source Serif 4", Georgia, serif`;
  g.fillText(title, x, y + size + 6);
}

/** The focal display of a project room, drawn from its figure. */
export function figurePrint(room: RoomContent, figure: RoomFigure) {
  const tint = room.tint;
  const kicker = `${room.count} projects in this room`;
  if (figure.kind === 'calibration') {
    // A wide screen: the calibration chart on the left, the featured projects on the right.
    const { c, g } = sheet(1400, 760, tint);
    heading(g, kicker, room.title, tint, 70, 90);
    const [x0, y0, cw, chh] = [90, 250, 700, 360];
    g.lineWidth = 2;
    g.font = '500 22px "Archivo Variable", Archivo, sans-serif';
    for (let k = 0; k <= 3; k++) {
      const y = y0 + chh - (k / 3) * chh;
      g.strokeStyle = '#d2c6b1';
      g.beginPath();
      g.moveTo(x0 + 60, y);
      g.lineTo(x0 + cw, y);
      g.stroke();
      g.fillStyle = '#5c5449';
      g.fillText(`${k * 10}%`, x0, y + 8);
    }
    figure.bins.forEach((b, k) => {
      const bx = x0 + 110 + k * 210;
      const ph = Math.min(1, b.predicted / 0.3) * chh;
      const oh = Math.min(1, b.observed / 0.3) * chh;
      g.strokeStyle = tint;
      g.lineWidth = 4;
      g.strokeRect(bx, y0 + chh - ph, 70, ph);
      g.fillStyle = '#85632d';
      g.fillRect(bx + 80, y0 + chh - oh, 70, oh);
      g.fillStyle = '#221e19';
      g.font = '600 24px "Archivo Variable", Archivo, sans-serif';
      g.fillText(b.bin, bx + 20, y0 + chh + 40);
    });
    g.fillStyle = '#5c5449';
    g.font = '450 22px "Archivo Variable", Archivo, sans-serif';
    g.fillText(figure.caption, x0, y0 + chh + 92);
    g.fillStyle = '#d2c6b1';
    g.fillRect(860, 230, 2, 460);
    g.fillStyle = '#221e19';
    g.font = '600 26px "Archivo Variable", Archivo, sans-serif';
    g.fillText('Featured in this room', 900, 270);
    room.projects.forEach((name, k) => {
      g.fillStyle = tint;
      g.fillRect(900, 322 + k * 92, 16, 16);
      g.fillStyle = '#221e19';
      const font = '460 42px "Source Serif 4 Variable", "Source Serif 4", Georgia, serif';
      wrapText(g, name, font, 440).slice(0, 2).forEach((l, n) => {
        g.font = font;
        g.fillText(l, 930, 340 + k * 92 + n * 42);
      });
    });
    return finish(c);
  }
  if (figure.kind === 'flow') {
    // A long, low panel: one agent run from left to right, each stage marked by who acts.
    const { c, g } = sheet(1800, 620, tint);
    heading(g, kicker, room.title, tint, 70, 84, 58);
    const n = figure.stages.length;
    const x0 = 120;
    const span = 1800 - 2 * x0;
    const y = 320;
    g.strokeStyle = '#c9b89a';
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(x0, y);
    g.lineTo(x0 + span, y);
    g.stroke();
    figure.stages.forEach((s, k) => {
      const x = x0 + (k / Math.max(1, n - 1)) * span;
      g.lineWidth = 5;
      if (s.kind === 'rule') {
        g.fillStyle = '#85632d';
        g.fillRect(x - 18, y - 18, 36, 36);
      } else if (s.kind === 'io') {
        g.fillStyle = '#f8f3ea';
        g.fillRect(x - 18, y - 18, 36, 36);
        g.strokeStyle = '#5c5449';
        g.strokeRect(x - 18, y - 18, 36, 36);
      } else {
        g.beginPath();
        g.arc(x, y, 19, 0, Math.PI * 2);
        g.fillStyle = s.kind === 'human' ? '#ffffff' : '#f8f3ea';
        g.fill();
        g.strokeStyle = s.kind === 'model' ? '#2d6c88' : '#221e19';
        g.stroke();
      }
      g.fillStyle = '#221e19';
      g.textAlign = 'center';
      const font = '560 30px "Archivo Variable", Archivo, sans-serif';
      wrapText(g, s.label, font, 170).slice(0, 2).forEach((l, m) => {
        g.font = font;
        g.fillText(l, x, y + 66 + m * 34 + (k % 2) * 76);
      });
      g.textAlign = 'left';
    });
    g.fillStyle = '#5c5449';
    g.font = '450 24px "Archivo Variable", Archivo, sans-serif';
    g.fillText(figure.caption, x0, 580);
    return finish(c);
  }
  if (figure.kind === 'ledger') {
    // A tall ledger board: one counted figure per analysis.
    const { c, g } = sheet(1000, 1200, tint);
    heading(g, kicker, room.title, tint, 70, 90, 60);
    figure.rows.slice(0, 6).forEach((r, k) => {
      const y = 310 + k * 170;
      g.fillStyle = '#d2c6b1';
      g.fillRect(70, y - 50, 860, 2);
      g.fillStyle = tint;
      g.font = '440 84px "Source Serif 4 Variable", "Source Serif 4", Georgia, serif';
      g.fillText(r.value, 70, y + 44);
      g.fillStyle = '#221e19';
      const font = '560 40px "Archivo Variable", Archivo, sans-serif';
      wrapText(g, r.name, font, 480).slice(0, 2).forEach((l, m) => {
        g.font = font;
        g.fillText(l, 440, y + 22 + m * 46);
      });
    });
    g.fillStyle = '#5c5449';
    g.font = '450 24px "Archivo Variable", Archivo, sans-serif';
    g.fillText(figure.caption, 70, 1150);
    return finish(c);
  }
  // Benchmark: brute force against the k-d tree, two bars per size on a log scale.
  const { c, g } = sheet(1200, 760, tint);
  heading(g, kicker, room.title, tint, 60, 84, 56);
  const max = Math.log10(2000);
  figure.rows.forEach((r, k) => {
    const y = 250 + k * 108;
    g.fillStyle = '#221e19';
    g.font = '600 26px "Archivo Variable", Archivo, sans-serif';
    g.fillText(`${r.n} points`, 60, y + 40);
    const w1 = (Math.log10(r.brute + 1) / max) * 700;
    const w2 = (Math.log10(r.kd + 1) / max) * 700;
    g.fillStyle = '#c9bda7';
    g.fillRect(290, y, w1, 28);
    g.fillStyle = tint;
    g.fillRect(290, y + 36, w2, 28);
    g.fillStyle = '#5c5449';
    g.font = '450 22px "Archivo Variable", Archivo, sans-serif';
    g.fillText(`brute force ${r.brute} ms`, 300 + w1, y + 22);
    g.fillText(`k-d tree ${r.kd} ms`, 300 + w2, y + 58);
  });
  g.fillStyle = '#5c5449';
  g.font = '450 23px "Archivo Variable", Archivo, sans-serif';
  g.fillText(figure.caption, 60, 720);
  return finish(c);
}

/** The sign over a room's doorway, lettered in the room's colour. */
export function doorSign(title: string, tint: string) {
  const w = 1024;
  const h = 160;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  g.fillStyle = '#f6f0e4';
  g.fillRect(0, 0, w, h);
  g.fillStyle = tint;
  g.fillRect(0, h - 10, w, 10);
  const ctx = g as CanvasRenderingContext2D & { letterSpacing?: string };
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  let px = 64;
  for (;;) {
    g.font = `650 ${px}px "Archivo Variable", Archivo, sans-serif`;
    ctx.letterSpacing = `${px * 0.14}px`;
    if (g.measureText(title.toUpperCase()).width < w * 0.88 || px < 20) break;
    px -= 2;
  }
  g.fillStyle = '#221e19';
  g.fillText(title.toUpperCase(), w / 2, h / 2 - 4);
  return finish(c);
}

/** A screenshot shown on a screen in the room, loaded from the site's own images. */
export function screenImage(src: string) {
  const t = new TextureLoader().load(src);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

export interface Invitation {
  kicker: string;
  title: string;
  email: string;
  line: string;
}

/** The courtyard's focal wall: the closing invitation, set like brass letters inlaid in limestone. */
export function invitationPrint(inv: Invitation) {
  const w = 2000;
  const h = 1026;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  const stoneFill = g.createLinearGradient(0, 0, 0, h);
  stoneFill.addColorStop(0, '#f6f0e5');
  stoneFill.addColorStop(1, '#ede4d4');
  g.fillStyle = stoneFill;
  g.fillRect(0, 0, w, h);
  grain(g, w, 81, 9000, 0.05);
  const ctx = g as CanvasRenderingContext2D & { letterSpacing?: string };
  g.textAlign = 'center';
  g.fillStyle = '#85632d';
  g.font = '650 40px "Archivo Variable", Archivo, sans-serif';
  ctx.letterSpacing = '10px';
  g.fillText(inv.kicker.toUpperCase(), w / 2, 170);
  ctx.letterSpacing = '0px';
  g.fillStyle = '#c9a464';
  g.fillRect(w / 2 - 60, 210, 120, 4);
  g.fillStyle = '#221e19';
  const titleFont = '420 128px "Source Serif 4 Variable", "Source Serif 4", Georgia, serif';
  const lines = wrapText(g, inv.title, titleFont, w - 260);
  lines.slice(0, 2).forEach((l, k) => {
    g.font = titleFont;
    g.fillText(l, w / 2, 380 + k * 140);
  });
  const y = 380 + Math.min(2, lines.length) * 140 + 60;
  // The address in brass: a darker cut under a bright face.
  g.font = '500 78px "Source Serif 4 Variable", "Source Serif 4", Georgia, serif';
  g.fillStyle = '#5e4420';
  g.fillText(inv.email, w / 2 + 2, y + 3);
  g.fillStyle = '#9a7434';
  g.fillText(inv.email, w / 2, y);
  g.fillStyle = '#5c5449';
  g.font = '450 40px "Archivo Variable", Archivo, sans-serif';
  g.fillText(inv.line, w / 2, y + 110);
  return finish(c);
}
