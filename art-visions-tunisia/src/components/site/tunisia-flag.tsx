// Flag of Tunisia: red field, white disc, red crescent and five-pointed star.
const star = (cx: number, cy: number, R: number, rot: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? R : R * 0.382;
    const a = ((rot + i * 36) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");

export function TunisiaFlag({ className = "", title = "Drapeau de la Tunisie" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 900 600" role="img" aria-label={title} className={className}>
      <rect width="900" height="600" fill="#E70013" />
      <circle cx="450" cy="300" r="150" fill="#fff" />
      <circle cx="435" cy="300" r="120" fill="#E70013" />
      <circle cx="458" cy="300" r="96" fill="#fff" />
      <polygon points={star(477, 300, 62, -90)} fill="#E70013" transform="rotate(18 477 300)" />
    </svg>
  );
}
