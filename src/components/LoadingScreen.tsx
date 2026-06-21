// Premium branded loading screen shown during page transitions.
export default function LoadingScreen({ label = "Chargement…" }: { label?: string }) {
  return (
    <div className="min-h-screen hero-gradient flex flex-col items-center justify-center gap-8 px-6">
      {/* Animated AV monogram with glow */}
      <div className="relative">
        <div className="absolute inset-0 -z-10 bg-brand-magenta/30 blur-[70px] rounded-full animate-logo-glow" aria-hidden />
        <img
          src="/logo-mark.svg"
          alt="Art Vision"
          className="w-20 sm:w-24 h-auto object-contain animate-logo-float drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
        />
      </div>

      {/* Indeterminate progress bar */}
      <div className="w-48 h-1 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-brand-purple via-brand-magenta to-brand-orange animate-loading-bar" />
      </div>

      <p className="text-[11px] uppercase tracking-[0.25em] text-white/45 font-semibold">{label}</p>
    </div>
  );
}
