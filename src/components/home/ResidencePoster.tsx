// Still elevation of the residence in morning light: what the first viewport shows before the 3D scene loads, and
// the backdrop for the whole page when WebGL is unavailable. Drawn in SVG so it is in the prerendered HTML.
// The drawing is defined once and shown through two crops. Wide screens: the gateway stands right of the text
// column, where the 3D arrival puts it, clear of the chapter rail. Phones: a close crop on the gateway, so the
// lintel with its nameplate and the gate below it sit together above the hero text instead of behind it.

const SLATS = Array.from({ length: 10 }, (_, k) => k);

function Art() {
  const mullions = [0, 1, 2, 3].map((k) => 640 + k * 70);
  return (
    <g id="rp-art">
      {/* sky and ground run past the edges of both crops */}
      <rect x="-100" width="1600" height="580" fill="url(#rp-sky)" />
      <rect x="-100" y="580" width="1600" height="640" fill="url(#rp-ground)" />
      {/* the house behind: left mass with its canopy, right mass with the glass ribbon */}
      <rect x="380" y="400" width="460" height="180" fill="#ddd5c7" />
      <rect x="360" y="388" width="520" height="12" fill="#3a3530" />
      <rect x="600" y="340" width="460" height="240" fill="#e6dfd2" />
      <rect x="630" y="370" width="290" height="170" fill="url(#rp-glass)" />
      {mullions.map((x) => <rect key={x} x={x - 2} y="370" width="4" height="170" fill="#2c2a27" />)}
      <rect x="630" y="452" width="290" height="4" fill="#2c2a27" />
      {/* the walnut door, framed in limestone, on the axis of the gateway */}
      <rect x="1018" y="420" width="84" height="160" fill="#efe7d9" />
      <rect x="1030" y="430" width="60" height="150" fill="#7a5032" />
      {/* the boundary: low limestone wall with a brass coping */}
      <rect x="380" y="548" width="1020" height="40" fill="#e2d8c6" />
      <rect x="380" y="546" width="1020" height="3" fill="#d2b077" />
      {/* the gateway: two piers, a lintel with the brass nameplate, the slatted gate leaves */}
      <rect x="958" y="350" width="26" height="238" fill="#ebe3d4" />
      <rect x="1136" y="350" width="26" height="238" fill="#ebe3d4" />
      <rect x="946" y="296" width="228" height="56" fill="#efe8da" />
      <rect x="958" y="305" width="204" height="38" fill="url(#rp-brass)" stroke="#a88a52" strokeWidth="1.5" />
      <text x="1060" y="326" textAnchor="middle" fontFamily="Archivo, sans-serif" fontWeight="680" fontSize="15" letterSpacing="3.4" fill="#1f150a">MOKSHIT SHARMA</text>
      <text x="1060" y="337" textAnchor="middle" fontFamily="Archivo, sans-serif" fontWeight="560" fontSize="4.6" letterSpacing="1.2" fill="#3a2a14">APPLIED AI · MACHINE LEARNING · SOFTWARE ENGINEERING</text>
      <rect x="946" y="351" width="228" height="2" fill="#fff4dc" />
      {SLATS.map((k) => <rect key={k} x={990 + k * 14.6} y="478" width="7" height="104" fill="#7a5032" />)}
      <rect x="984" y="476" width="152" height="4" fill="#d2b077" />
      <rect x="984" y="580" width="152" height="3" fill="#d2b077" />
      {/* olive trees either side of the gate, and the path to it */}
      <circle cx="900" cy="470" r="34" fill="#a3ad7c" />
      <circle cx="878" cy="490" r="24" fill="#8e9a6c" />
      <rect x="896" y="490" width="6" height="92" fill="#6b4428" />
      <circle cx="1232" cy="482" r="28" fill="#a3ad7c" />
      <circle cx="1252" cy="498" r="20" fill="#8e9a6c" />
      <rect x="1229" y="498" width="5" height="84" fill="#6b4428" />
      <path d="M1000 588 L1120 588 L1398 1200 L722 1200 Z" fill="#e8dfcf" />
      {/* long morning shadows on the ground */}
      <path d="M380 588 L840 588 L740 640 L280 640 Z" fill="#6b5a45" opacity="0.1" />
    </g>
  );
}

export default function ResidencePoster({ className = '' }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <svg width="0" height="0" className="absolute" focusable="false">
        <defs>
          <linearGradient id="rp-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a9c4d8" />
            <stop offset="0.6" stopColor="#dfe8ec" />
            <stop offset="1" stopColor="#f4ead8" />
          </linearGradient>
          <linearGradient id="rp-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ddd3c1" />
            <stop offset="0.2" stopColor="#efe8db" />
            <stop offset="1" stopColor="#f2ece1" />
          </linearGradient>
          <linearGradient id="rp-glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#c9dae3" />
            <stop offset="0.5" stopColor="#9fb8c6" />
            <stop offset="1" stopColor="#d7e3e9" />
          </linearGradient>
          <linearGradient id="rp-brass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d9bf8c" />
            <stop offset="0.5" stopColor="#f1dfb4" />
            <stop offset="1" stopColor="#cfb07a" />
          </linearGradient>
          <Art />
        </defs>
      </svg>
      <svg viewBox="424 180 900 540" preserveAspectRatio="xMaxYMax slice" className="absolute inset-0 hidden h-full w-full md:block" focusable="false">
        <use href="#rp-art" />
      </svg>
      <svg viewBox="825 202 470 1017" preserveAspectRatio="xMidYMin slice" className="absolute inset-0 h-full w-full md:hidden" focusable="false">
        <use href="#rp-art" />
      </svg>
    </div>
  );
}
