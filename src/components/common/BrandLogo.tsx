import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'compact' | 'light';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ variant = 'full', className = '' }) => {
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <div className="w-9 h-9 rounded-lg bg-brand-700 flex items-center justify-center shadow-sm text-white shrink-0 relative overflow-hidden">
          <svg viewBox="0 0 40 40" className="w-6 h-6 fill-none stroke-current" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Architectural Beam / Stylized Structural 'U' and 'C' */}
            <path d="M10 12 v14 a6 6 0 0 0 12 0 v-14" stroke="white" />
            <path d="M30 14 a6 6 0 0 0 -8 -1" stroke="#FDE8E8" strokeWidth="3" />
            <path d="M7 32 h26" stroke="#FDE8E8" strokeWidth="2.5" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-slate-900 tracking-tight leading-none text-base">
            UNLIMITED
          </span>
          <span className="text-[10px] tracking-widest text-brand-700 font-bold uppercase mt-0.5">
            CONSTRUCTION
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Brand Icon Shield */}
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-700 to-brand-800 flex items-center justify-center shadow-md text-white shrink-0 relative border border-brand-900/20">
        <svg viewBox="0 0 40 40" className="w-6 h-6 fill-none stroke-current" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Foundation & Structural U/C framing */}
          <path d="M11 12 v13 a5 5 0 0 0 10 0 v-13" stroke="white" />
          <path d="M29 14 a6 6 0 0 0 -8 -1" stroke="#FDE8E8" strokeWidth="3" />
          <path d="M8 32 h24" stroke="#FDE8E8" strokeWidth="2.5" />
          <circle cx="20" cy="8" r="1.5" fill="#FDE8E8" />
        </svg>
      </div>

      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-slate-900 tracking-tight leading-none text-base sm:text-lg">
            UNLIMITED
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-700" />
        </div>
        <span className="text-[10px] tracking-[0.2em] font-bold text-brand-700 uppercase leading-none mt-1">
          CONSTRUCTION
        </span>
        <span className="text-[9px] text-slate-400 font-medium tracking-wide mt-1 truncate">
          CA LIC #1040445 • NANCY PARAMO
        </span>
      </div>
    </div>
  );
};
