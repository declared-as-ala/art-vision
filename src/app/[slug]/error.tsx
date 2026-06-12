"use client";

export default function ErrorState({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen bg-brand-navy pt-40 text-center text-white">
      <h1 className="text-2xl font-bold">Impossible d&apos;afficher cette page</h1>
      <button onClick={reset} className="mt-6 rounded-lg bg-brand-orange px-5 py-3 font-semibold">
        Réessayer
      </button>
    </div>
  );
}
