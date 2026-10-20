import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';
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
export function concrete(base = '#57534e') {
  return canvas(512, (g, px) => {
    g.fillStyle = base;
    g.fillRect(0, 0, px, px);
    const r = rng(11);
    for (let i = 0; i < 160; i++) {
      const x = r() * px;
      const y = r() * px;
      const rad = 20 + r() * 90;
      const grd = g.createRadialGradient(x, y, 0, x, y, rad);
      const v = r() < 0.5 ? 0 : 255;
      grd.addColorStop(0, `rgba(${v},${v},${v},${0.035 + r() * 0.04})`);
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = grd;
      g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
    grain(g, px, 12, 9000, 0.12);
    g.fillStyle = 'rgba(0,0,0,0.28)';
    for (let k = 1; k < 4; k++) g.fillRect(0, (k * px) / 4, px, 2);
    g.fillStyle = 'rgba(0,0,0,0.45)';
    for (const [x, y] of [[0.25, 0.125], [0.75, 0.125], [0.25, 0.625], [0.75, 0.625]]) {
      g.beginPath();
      g.arc(x * px, y * px, 3, 0, Math.PI * 2);
      g.fill();
    }
  });
}

/** Walnut, 1 m square: long vertical grain with darker figure lines. */
export function walnut() {
  return canvas(256, (g, px) => {
    g.fillStyle = '#5a3a26';
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
export function stone(base = '#2b2926', joint = 'rgba(0,0,0,0.5)') {
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

/** The brass nameplate on the entrance wall. */
export function nameplate(name: string, line: string) {
  const w = 1024;
  const h = 384;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  const brass = g.createLinearGradient(0, 0, w, h);
  brass.addColorStop(0, '#8a6a3c');
  brass.addColorStop(0.45, '#c9a46a');
  brass.addColorStop(1, '#7a5a30');
  g.fillStyle = brass;
  g.fillRect(0, 0, w, h);
  // Brushed finish
  const r = rng(41);
  for (let i = 0; i < 900; i++) {
    g.fillStyle = `rgba(255,240,210,${r() * 0.05})`;
    g.fillRect(0, r() * h, w, 1);
  }
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const engrave = (text: string, y: number, size: number, spacing: number) => {
    g.font = `600 ${size}px "Archivo Variable", Archivo, sans-serif`;
    (g as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = `${spacing}px`;
    g.fillStyle = 'rgba(255,236,200,0.35)';
    g.fillText(text, w / 2 + 1, y + 2);
    g.fillStyle = '#2a1d0e';
    g.fillText(text, w / 2, y);
  };
  engrave(name, h * 0.42, 92, 18);
  engrave(line, h * 0.72, 34, 8);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** The face of a framed panel in the gallery: the domain's title, as if printed and hung. */
export function framePrint(title: string) {
  const w = 480;
  const h = 608;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  g.fillStyle = '#1b1916';
  g.fillRect(0, 0, w, h);
  grain(g, w, 51, 2500, 0.06);
  g.fillStyle = '#c9a46a';
  g.fillRect(48, 92, 56, 3);
  g.fillStyle = '#efe9df';
  g.font = '400 52px "Source Serif 4 Variable", "Source Serif 4", Georgia, serif';
  // Wrap the title into lines that fit the panel.
  const words = title.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (g.measureText(next).width > w - 96 && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  lines.push(line);
  lines.forEach((l, k) => g.fillText(l, 48, 170 + k * 62));
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  return t;
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
