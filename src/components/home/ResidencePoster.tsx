// What the first viewport shows before the 3D scene loads, and the backdrop for the whole page when WebGL is
// unavailable: a still of the scene's own arrival frame, rendered from it (reduced motion, no HTML on top), so the
// live house fades in over an identical picture instead of replacing a different one.
// Two frames, chosen by the same rule the scene uses for its camera (Residence.resize: wide when the width is at
// least 1024 px and the aspect at least 1.1): 1920x1080 for wide screens, 390x844 at 2x for tall ones.
// Re-render both whenever the arrival changes (camera, gate, nameplate, lighting): private/tools/still.cjs.

export default function ResidencePoster({ className = '' }: { className?: string }) {
  return (
    <picture className={className} aria-hidden>
      <source media="(min-width: 1024px) and (min-aspect-ratio: 11/10)" srcSet="/images/residence-arrival-wide.webp" width={1920} height={1080} />
      <img
        src="/images/residence-arrival-tall.webp"
        width={780}
        height={1688}
        alt=""
        fetchPriority="high"
        decoding="async"
        className="h-full w-full object-cover"
      />
    </picture>
  );
}
