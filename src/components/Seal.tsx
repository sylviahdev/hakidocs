/**
 * HakiDocs crest — a gold scales-of-justice seal.
 * Used as the brand mark in the navbar, hero, and on generated documents
 * (where it reads like an official embossed stamp).
 */
export default function Seal({
  className = "",
  size = 40,
  title = "HakiDocs seal",
}: {
  className?: string;
  size?: number;
  title?: string;
}) {
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

      {/* Outer ring */}
      <circle
        cx="50"
        cy="50"
        r="47"
        fill="none"
        stroke="url(#haki-gold)"
        strokeWidth="2.5"
      />
      <circle
        cx="50"
        cy="50"
        r="41"
        fill="none"
        stroke="url(#haki-gold)"
        strokeWidth="1"
        strokeDasharray="1 3"
      />

      {/* Scales of justice */}
      <g
        fill="none"
        stroke="url(#haki-gold)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Central pillar */}
        <path d="M50 28 V70" />
        {/* Base */}
        <path d="M40 72 H60" />
        {/* Beam */}
        <path d="M30 36 H70" />
        <circle cx="50" cy="30" r="2.4" fill="url(#haki-gold)" stroke="none" />
        {/* Left pan strings + pan */}
        <path d="M30 36 L24 50 M30 36 L36 50" />
        <path d="M22 50 a8 5 0 0 0 16 0" />
        {/* Right pan strings + pan */}
        <path d="M70 36 L64 50 M70 36 L76 50" />
        <path d="M62 50 a8 5 0 0 0 16 0" />
      </g>
    </svg>
  );
}
