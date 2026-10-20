// Still elevation of the residence at dusk: what the first viewport shows before the 3D scene loads, and the
// backdrop for the whole page when WebGL is unavailable. Drawn in SVG so it is in the prerendered HTML.

export default function ResidencePoster({ className = '' }: { className?: string }) {
  const mullions = [0, 1, 2, 3, 4].map((k) => 760 + k * 74);
  return (
    <svg viewBox="0 0 1200 720" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden focusable="false">
      <defs>
        <linearGradient id="rp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b0d14" />
          <stop offset="0.55" stopColor="#2b2f40" />
          <stop offset="1" stopColor="#8a5a3c" />
        </linearGradient>
        <linearGradient id="rp-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d1b18" />
          <stop offset="1" stopColor="#0d0c0b" />
        </linearGradient>
        <linearGradient id="rp-spill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffbe80" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffbe80" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1200" height="560" fill="url(#rp-sky)" />
      <rect y="560" width="1200" height="160" fill="url(#rp-ground)" />
      {/* left mass, right mass, canopy */}
      <rect x="250" y="360" width="400" height="200" fill="#34312d" />
      <rect x="720" y="290" width="400" height="270" fill="#3b3833" />
      <rect x="230" y="348" width="560" height="14" fill="#141416" />
      <rect x="230" y="360" width="560" height="2" fill="#ffd9a8" opacity="0.8" />
      {/* glass ribbon, lit from inside */}
      <rect x="760" y="330" width="300" height="180" fill="#e7a35e" opacity="0.85" />
      {mullions.map((x) => <rect key={x} x={x - 2} y="330" width="4" height="180" fill="#17171a" />)}
      <rect x="760" y="418" width="300" height="4" fill="#17171a" />
      {/* the door, with a line of light at its edge */}
      <rect x="650" y="380" width="70" height="180" fill="#4a3020" />
      <rect x="716" y="380" width="4" height="180" fill="#ffc98e" />
      <path d="M650 560 L720 560 L760 720 L610 720 Z" fill="url(#rp-spill)" />
      {/* nameplate wall and planters */}
      <rect x="430" y="490" width="150" height="70" fill="#47433e" />
      <rect x="455" y="505" width="100" height="22" fill="#b8924f" />
      <rect x="270" y="535" width="150" height="25" fill="#2c2a27" />
      <rect x="880" y="540" width="180" height="20" fill="#2c2a27" />
    </svg>
  );
}
