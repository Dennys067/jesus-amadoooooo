import React from 'react';

interface LogoProps {
  className?: string;
  src?: string | null;
}

export default function Logo({ className = "w-12 h-12", src }: LogoProps) {
  if (src) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 rounded-full overflow-hidden ${className}`} id="arena-prime-logo-img">
        <img
          src={src}
          alt="Arena Prime"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`} id="arena-prime-logo-svg">
      {/* High-fidelity responsive replica of the Arena Prime circular beach tennis club logo */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-[0_4px_12px_rgba(249,115,22,0.35)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Radial and Linear Gradients to match the hot glow outline in the image */}
          <linearGradient id="neon-glow-border" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff00a0" /> {/* Neon Fuchsia/Magenta top */}
            <stop offset="40%" stopColor="#ff4500" /> {/* Vivid Orange/Red */}
            <stop offset="80%" stopColor="#ffcc00" /> {/* Radiant Gold/Yellow */}
            <stop offset="100%" stopColor="#00ffcc" /> {/* Aqua corner glow */}
          </linearGradient>
          
          <linearGradient id="neon-yellow-bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e2ff00" /> {/* Bright electric neon yellow */}
            <stop offset="100%" stopColor="#ccff00" /> {/* Hot lime tint */}
          </linearGradient>

          <filter id="subtle-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" floodColor="#000" />
          </filter>
        </defs>

        {/* 1. External glow circle border */}
        <circle cx="100" cy="100" r="97" fill="url(#neon-glow-border)" />

        {/* 2. Black gap spacer ring */}
        <circle cx="100" cy="100" r="91" fill="#000000" />

        {/* 3. Deep Orange outer-inner ring */}
        <circle cx="100" cy="100" r="85" fill="#f95c00" />

        {/* 4. Electric Neon Yellow/Lime background circle */}
        <circle cx="100" cy="100" r="74" fill="url(#neon-yellow-bg)" />

        {/* 5. Curved Top Subtitle: BEACH */}
        <path id="curve-top" d="M 45,75 A 60,60 0 0,1 155,75" fill="none" stroke="transparent" />
        <text className="font-display font-black" fontSize="13" letterSpacing="5" fill="#f95c00">
          <textPath href="#curve-top" startOffset="50%" textAnchor="middle">
            BEACH
          </textPath>
        </text>

        {/* 6. Curved Bottom Subtitle: CLUB */}
        <path id="curve-bottom" d="M 45,130 A 62,62 0 0,0 155,130" fill="none" stroke="transparent" />
        <text className="font-display font-black" fontSize="13" letterSpacing="5" fill="#f95c00">
          <textPath href="#curve-bottom" startOffset="50%" textAnchor="middle">
            CLUB
          </textPath>
        </text>

        {/* 7. Central vintage/retro groovy wavy banner & custom type shapes */}
        <g filter="url(#subtle-shadow)">
          {/* Retro separation wave path inside the yellow background */}
          <path
            d="M 28,103 C 55,80 145,125 172,103"
            fill="none"
            stroke="#f95c00"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Bold custom wavy "ARENA" typography */}
          <text
            x="100"
            y="94"
            textAnchor="middle"
            fill="#e04e00"
            fontWeight="900"
            fontSize="36"
            letterSpacing="-0.5"
            fontFamily="'Space Grotesk', 'Impact', sans-serif"
            fontStyle="italic"
            transform="scale(1, 1.15)"
            style={{ transformOrigin: '100px 94px' }}
          >
            ARENA
          </text>

          {/* Bold custom wavy "PRIME" typography */}
          <text
            x="100"
            y="135"
            textAnchor="middle"
            fill="#e04e00"
            fontWeight="900"
            fontSize="34"
            letterSpacing="-0.5"
            fontFamily="'Space Grotesk', 'Impact', sans-serif"
            fontStyle="italic"
            transform="scale(1, 1.15)"
            style={{ transformOrigin: '100px 135px' }}
          >
            PRIME
          </text>
        </g>
      </svg>
    </div>
  );
}
