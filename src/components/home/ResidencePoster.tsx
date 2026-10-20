// Still elevation of the residence in morning light: what the first viewport shows before the 3D scene loads, and
// the backdrop for the whole page when WebGL is unavailable. Drawn in SVG so it is in the prerendered HTML.
// Anchored to the right edge, so the gateway and its nameplate sit clear of the text column on wide screens and
// stay in view on phones, as in the 3D arrival.

const SLATS = Array.from({ length: 10 }, (_, k) => k);

export default function ResidencePoster({ className = '' }: { className?: string }) {
  const mullions = [0, 1, 2, 3].map((k) => 640 + k * 70);
  return (
    <svg viewBox="0 0 1200 720" preserveAspectRatio="xMaxYMax slice" className={className} aria-hidden focusable="false">
      <defs>
        <linearGradient id="rp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9c4d8" />
          <stop offset="0.6" stopColor="#dfe8ec" />
          <stop offset="1" stopColor="#f4ead8" />
        </linearGradient>
        <linearGradient id="rp-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ddd3c1" />
          <stop offset="1" stopColor="#efe8db" />
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
      </defs>
      <rect width="1200" height="580" fill="url(#rp-sky)" />
      <rect y="580" width="1200" height="140" fill="url(#rp-ground)" />
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
      <rect x="380" y="548" width="820" height="40" fill="#e2d8c6" />
      <rect x="380" y="546" width="820" height="3" fill="#d2b077" />
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
      {/* an olive tree beside the gate, and the path to it */}
      <circle cx="900" cy="470" r="34" fill="#a3ad7c" />
      <circle cx="878" cy="490" r="24" fill="#8e9a6c" />
      <rect x="896" y="490" width="6" height="92" fill="#6b4428" />
      <path d="M1000 588 L1120 588 L1180 720 L940 720 Z" fill="#e8dfcf" />
      {/* long morning shadows on the ground */}
      <path d="M380 588 L840 588 L740 640 L280 640 Z" fill="#6b5a45" opacity="0.1" />
    </svg>
  );
}
