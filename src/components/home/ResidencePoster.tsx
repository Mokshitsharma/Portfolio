// Still elevation of the residence in morning light: what the first viewport shows before the 3D scene loads, and
// the backdrop for the whole page when WebGL is unavailable. Drawn in SVG so it is in the prerendered HTML.

export default function ResidencePoster({ className = '' }: { className?: string }) {
  const mullions = [0, 1, 2, 3, 4].map((k) => 760 + k * 74);
  return (
    <svg viewBox="0 0 1200 720" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden focusable="false">
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
      </defs>
      <rect width="1200" height="560" fill="url(#rp-sky)" />
      <rect y="560" width="1200" height="160" fill="url(#rp-ground)" />
      {/* left mass, right mass, their sunlit and shaded faces, canopy */}
      <rect x="250" y="360" width="400" height="200" fill="#d9d1c3" />
      <rect x="720" y="290" width="400" height="270" fill="#e6dfd2" />
      <rect x="230" y="348" width="560" height="14" fill="#3a3530" />
      <rect x="230" y="362" width="560" height="26" fill="#000" opacity="0.07" />
      {/* glass ribbon reflecting the sky */}
      <rect x="760" y="330" width="300" height="180" fill="url(#rp-glass)" />
      {mullions.map((x) => <rect key={x} x={x - 2} y="330" width="4" height="180" fill="#2c2a27" />)}
      <rect x="760" y="418" width="300" height="4" fill="#2c2a27" />
      {/* the walnut door */}
      <rect x="650" y="380" width="70" height="180" fill="#7a5032" />
      <rect x="650" y="380" width="70" height="180" fill="#fff" opacity="0.06" />
      {/* the entrance portal: low boundary wall, two piers, the lintel with its brass nameplate, the gate leaves */}
      <rect x="120" y="512" width="960" height="48" fill="#e2d8c6" />
      <rect x="120" y="510" width="960" height="3" fill="#d2b077" />
      <rect x="540" y="430" width="28" height="130" fill="#e6ddcc" />
      <rect x="802" y="430" width="28" height="130" fill="#e6ddcc" />
      <rect x="532" y="392" width="306" height="40" fill="#e8dfcf" />
      <rect x="556" y="399" width="258" height="26" fill="#ecd9ad" stroke="#b8975e" strokeWidth="1.5" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((k) => <rect key={k} x={574 + k * 14.5} y="472" width="7" height="86" fill="#7a5032" />)}
      <rect x="568" y="470" width="234" height="4" fill="#d2b077" />
      <rect x="270" y="535" width="150" height="25" fill="#c7bda9" />
      <rect x="880" y="540" width="180" height="20" fill="#c7bda9" />
      {/* long morning shadows on the ground */}
      <path d="M250 560 L650 560 L560 610 L170 610 Z" fill="#6b5a45" opacity="0.12" />
      <path d="M720 560 L1120 560 L1020 620 L640 620 Z" fill="#6b5a45" opacity="0.1" />
    </svg>
  );
}
