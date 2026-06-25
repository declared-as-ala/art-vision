// Premium branded loading screen shown during page transitions.
export default function LoadingScreen({ label = "Chargement…" }: { label?: string }) {
  return (
    <div className="min-h-screen hero-gradient flex flex-col items-center justify-center gap-10 px-6">
      {/* AV monogram with rotating glow ring + shine sweep */}
      <div className="relative flex items-center justify-center">
        {/* Rotating light ring */}
        <div className="logo-ring absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full" aria-hidden />

        {/* Glow blur behind logo */}
        <div className="absolute w-20 h-20 sm:w-24 sm:h-24 bg-brand-magenta/25 blur-[60px] rounded-full" aria-hidden />

        {/* Logo mark */}
        <img
          src="/logo-mark.svg"
          alt="Art Vision"
          className="relative w-16 sm:w-20 h-auto object-contain animate-logo-float drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
        />

        {/* Shine sweep overlay */}
        <div className="logo-shine absolute inset-0 w-16 sm:w-20 h-auto mx-auto" aria-hidden />
      </div>

      {/* Indeterminate progress bar */}
      <div className="w-48 h-[3px] rounded-full bg-white/10 overflow-hidden">
        <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-brand-purple via-brand-magenta to-brand-orange animate-loading-bar shadow-[0_0_10px_rgba(215,40,136,0.5)]" />
      </div>

      <p className="text-[11px] uppercase tracking-[0.25em] text-white/40 font-semibold">{label}</p>
    </div>
  );
}
