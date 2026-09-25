import React from 'react';

export const ChurchLogo: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="The Covenant Nation Crest"
    >
      {/* Outer Glow / Halo */}
      <circle cx="60" cy="60" r="56" fill="#fef3c7" fillOpacity="0.4" />

      {/* Royal Crown */}
      <path
        d="M44 26L48 36L60 30L72 36L76 26L74 40H46L44 26Z"
        fill="#D97706"
        stroke="#78350F"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="44" cy="25" r="2" fill="#F59E0B" />
      <circle cx="60" cy="29" r="2.5" fill="#EF4444" />
      <circle cx="76" cy="25" r="2" fill="#F59E0B" />
      <circle cx="52" cy="34" r="1.5" fill="#3B82F6" />
      <circle cx="68" cy="34" r="1.5" fill="#3B82F6" />

      {/* Left Rampant Lion Supporter */}
      <path
        d="M26 44C26 42 29 40 32 42C34 43 35 46 34 48C36 49 37 53 36 56C38 58 39 63 36 67C37 70 36 75 33 78L29 78C27 75 29 71 27 68C24 67 22 62 25 58C23 54 23 48 26 44Z"
        fill="#D97706"
        stroke="#92400E"
        strokeWidth="1"
      />
      {/* Lion mane details */}
      <path
        d="M29 48C30 50 32 50 33 48"
        stroke="#FDE68A"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Right Rampant Lion Supporter */}
      <path
        d="M94 44C94 42 91 40 88 42C86 43 85 46 86 48C84 49 83 53 84 56C82 58 81 63 84 67C83 70 84 75 87 78L91 78C93 75 91 71 93 68C96 67 98 62 95 58C97 54 97 48 94 44Z"
        fill="#D97706"
        stroke="#92400E"
        strokeWidth="1"
      />
      <path
        d="M91 48C90 50 88 50 87 48"
        stroke="#FDE68A"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Central Escutcheon / Shield */}
      <path
        d="M40 38H80V64C80 77 60 88 60 88C60 88 40 77 40 64V38Z"
        fill="#991B1B"
        stroke="#F59E0B"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Inner Shield Gold Border */}
      <path
        d="M44 42H76V63C76 73 60 82 60 82C60 82 44 73 44 63V42Z"
        fill="#7F1D1D"
        stroke="#FBBF24"
        strokeWidth="1"
      />

      {/* Radiant Golden Cross in Shield */}
      <path
        d="M57 46H63V57H74V63H63V76H57V63H46V57H57V46Z"
        fill="#F59E0B"
        stroke="#B45309"
        strokeWidth="1"
      />

      {/* Open Bible at the Center of the Cross */}
      <path
        d="M52 56C56 55 59 57 60 58C61 57 64 55 68 56V65C64 64 61 66 60 67C59 66 56 64 52 65V56Z"
        fill="#FFFBEB"
        stroke="#78350F"
        strokeWidth="0.8"
      />
      <line x1="60" y1="58" x2="60" y2="67" stroke="#92400E" strokeWidth="0.8" />
      <line x1="54" y1="59" x2="58" y2="58" stroke="#B45309" strokeWidth="0.6" />
      <line x1="54" y1="62" x2="58" y2="61" stroke="#B45309" strokeWidth="0.6" />
      <line x1="62" y1="58" x2="66" y2="59" stroke="#B45309" strokeWidth="0.6" />
      <line x1="62" y1="61" x2="66" y2="62" stroke="#B45309" strokeWidth="0.6" />

      {/* Bottom Golden Ribbon / Motto Banner */}
      <path
        d="M22 89L34 83L38 90H82L86 83L98 89L93 96L84 94L82 99H38L36 94L27 96L22 89Z"
        fill="#D97706"
        stroke="#78350F"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M34 88H86V96H34V88Z"
        fill="#F59E0B"
        stroke="#92400E"
        strokeWidth="0.8"
      />
      <text
        x="60"
        y="94"
        textAnchor="middle"
        fontSize="5.2"
        fontWeight="bold"
        fill="#78350F"
        fontFamily="sans-serif"
        letterSpacing="0.6"
      >
        THE COVENANT NATION
      </text>
    </svg>
  );
};
