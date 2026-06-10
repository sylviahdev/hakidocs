/**
 * HakiDocs crest — a navy heraldic shield with a gold rim bearing gold scales
 * of justice. Used as the brand mark in the navbar, hero, and on generated
 * documents (where it reads like an embossed crest). Navy + gold palette.
 */
export default function Seal({
  className = "",
  size = 40,
  title = "HakiDocs crest",
}: {
  className?: string;
  size?: number;
  title?: string;
}) {
  // Heraldic shield: flat top, curved sides, pointed base.
  const shield = "M14 14 H86 V44 C86 66 71 82 50 90 C29 82 14 66 14 44 Z";

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={title}
    >
      <defs>
        <linearGradient id="haki-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e7cb6b" />
          <stop offset="45%" stopColor="#c9a227" />
          <stop offset="100%" stopColor="#8c6c19" />
        </linearGradient>
      </defs>

      {/* Navy shield. */}
      <path d={shield} fill="#16284a" />

      {/* Gold rim. */}
      <path
        d={shield}
        fill="none"
        stroke="url(#haki-gold)"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />

      {/* Gold scales of justice. */}
      <g
        fill="none"
        stroke="url(#haki-gold)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M50 30 V66" />
        <path d="M41 68 H59" />
        <path d="M32 38 H68" />
        <path d="M32 38 L26 50 M32 38 L38 50" />
        <path d="M24 50 a8 5 0 0 0 16 0" />
        <path d="M68 38 L62 50 M68 38 L74 50" />
        <path d="M60 50 a8 5 0 0 0 16 0" />
      </g>
      <circle cx="50" cy="32" r="2.4" fill="url(#haki-gold)" />
    </svg>
  );
}
