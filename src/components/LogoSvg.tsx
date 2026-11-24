import React from 'react';

interface LogoSvgProps {
  size?: number;
  animated?: boolean;
  idSuffix?: string;
}

export const LogoSvg: React.FC<LogoSvgProps> = ({
  size = 180,
  animated = true,
  idSuffix = 'main',
}) => {
  const heartPath =
    'M50 88 C 10 60 6 28 27 19 C 40 14 50 22 50 31 C 50 22 60 14 73 19 C 94 28 90 60 50 88 Z';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 220 220"
      role="img"
      aria-label="שפת הקשר"
      className="drop-shadow-[0_10px_28px_rgba(201,86,107,0.28)]"
    >
      <defs>
        <linearGradient id={`rose-${idSuffix}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c9566b" />
          <stop offset="100%" stopColor="#e58a8f" />
        </linearGradient>
        <linearGradient id={`gold-${idSuffix}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d49a3a" />
          <stop offset="100%" stopColor="#f3cf82" />
        </linearGradient>
        <radialGradient id={`halo-${idSuffix}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e58a8f" stopOpacity="0.22" />
          <stop offset="65%" stopColor="#d49a3a" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#d49a3a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft Rose-Gold Halo */}
      <circle cx="110" cy="110" r="104" fill={`url(#halo-${idSuffix})`} />

      {/* Outer Golden Ring */}
      <circle
        className={animated ? 'logo-draw' : ''}
        pathLength={1}
        cx="110"
        cy="110"
        r="92"
        fill="none"
        stroke={`url(#gold-${idSuffix})`}
        strokeWidth="3.5"
      />

      {/* Connecting Flowing Waves */}
      <path
        className={animated ? 'logo-wave' : ''}
        pathLength={1}
        d="M 38 148 Q 74 128 110 148 T 182 148"
        stroke={`url(#gold-${idSuffix})`}
      />
      <path
        className={animated ? 'logo-wave' : ''}
        pathLength={1}
        d="M 46 160 Q 78 142 110 160 T 174 160"
        stroke={`url(#rose-${idSuffix})`}
      />

      {/* Interlocking Hearts */}
      <g transform="translate(26 56) rotate(-12 55 50) scale(1.06)">
        <path
          className={animated ? 'logo-draw' : ''}
          pathLength={1}
          d={heartPath}
          fill="none"
          stroke={`url(#rose-${idSuffix})`}
        />
      </g>

      <g transform="translate(76 56) rotate(12 55 50) scale(1.06)">
        <path
          className={animated ? 'logo-draw logo-draw-delay' : ''}
          pathLength={1}
          d={heartPath}
          fill="none"
          stroke={`url(#gold-${idSuffix})`}
        />
      </g>

      {/* Center Glowing Heart */}
      <g transform="translate(88 92) scale(0.44)">
        <path
          className={animated ? 'logo-heart-center' : ''}
          d={heartPath}
          fill={`url(#rose-${idSuffix})`}
        />
      </g>
    </svg>
  );
};
