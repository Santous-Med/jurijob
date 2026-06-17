import React from 'react';

const NAVY = '#0B2545';
const GOLD = '#C8A046';

const SIZES = {
  compact: { font: 14, gap: 3, clip: 16 },
  header:  { font: 24, gap: 5, clip: 26 },
  large:   { font: 40, gap: 8, clip: 44 },
  hero:    { font: 64, gap: 12, clip: 70 }
};

export default function Logo({ variant = 'dark', size = 'header', style = {} }) {
  const d = SIZES[size] || SIZES.header;
  const textColor = variant === 'light' ? '#FFFFFF' : NAVY;
  
  return (
    <div
      role="img"
      aria-label="JURIJOB"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${d.gap}px`,
        fontFamily: "'Montserrat', system-ui, sans-serif",
        fontWeight: 800,
        fontSize: `${d.font}px`,
        letterSpacing: '-0.01em',
        lineHeight: 1,
        userSelect: 'none',
        ...style
      }}
    >
      <span style={{ color: textColor }}>JURI</span>
      <svg
        width={d.clip}
        height={d.clip}
        viewBox="0 0 24 24"
        fill="none"
        style={{ flexShrink: 0 }}
        aria-hidden="true"
      >
        <path
          d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"
          stroke={GOLD}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span style={{ color: textColor }}>JOB</span>
    </div>
  );
}