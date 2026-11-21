import React from 'react';

export default function Logo({ size = 'normal', showText = true }) {
  const isLarge = size === 'large';

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: isLarge ? '12px' : '9px', textDecoration: 'none' }}>
      {/* Custom Mountain + Airplane + Swoosh SVG Icon */}
      <svg
        width={isLarge ? "42" : "32"}
        height={isLarge ? "32" : "24"}
        viewBox="0 0 100 76"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', flexShrink: 0 }}
      >
        {/* Warm Orange Base Swoosh */}
        <path
          d="M6 56C24 64 56 68 86 48C74 54 48 58 20 52Z"
          fill="#F29A38"
        />
        {/* Forest Green Mountain Growth Peak */}
        <path
          d="M12 50L38 18L56 38L68 24L82 46"
          stroke="#145C38"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Secondary inner mountain ridge */}
        <path
          d="M38 18L44 48"
          stroke="#10452C"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Airplane taking off at top right */}
        <g transform="translate(68, 8) rotate(-15) scale(0.9)">
          <path
            d="M14 6L22 10L14 14L10 22L8 20L10 13L2 11L1 8L10 9L11 4L14 6Z"
            fill="#145C38"
          />
        </g>
      </svg>

      {showText && (
        <span
          className="font-serif"
          style={{
            fontSize: isLarge ? '26px' : '21px',
            fontWeight: 800,
            letterSpacing: '-0.4px',
            color: '#18251C',
            lineHeight: 1
          }}
        >
          StockPilot <span style={{ color: '#145C38' }}>AI</span>
        </span>
      )}
    </div>
  );
}
