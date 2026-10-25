import type { Project } from "@/content/portfolio";

/** Generated brand-colour cover art, used until real project photography is uploaded. */
export function ProjectCover({ project, className = "" }: { project: Project; className?: string }) {
  const { from, to, mark } = project.cover;
  const id = `g-${project.slug}`;
  return (
    <svg viewBox="0 0 600 450" role="img" aria-label={project.title} className={`h-full w-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="600" height="450" fill={`url(#${id})`} />
      <circle cx="470" cy="110" r="150" fill={mark} opacity="0.12" />
      <circle cx="120" cy="400" r="190" fill="#000" opacity="0.14" />
      <text x="40" y="410" fontSize="120" fontWeight="700" fill={mark} opacity="0.92" fontFamily="var(--font-geist-sans), sans-serif" letterSpacing="-6">
        {project.title.replace(/^(Identité visuelle|Production 3D)\s*/i, "").slice(0, 2).toUpperCase()}
      </text>
    </svg>
  );
}
