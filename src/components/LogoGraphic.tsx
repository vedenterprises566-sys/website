import React from 'react';
import vedLogoImg from '../assets/images/ved_enterprises_logo.png';

interface LogoGraphicProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  customLogoUrl?: string;
}

export const LogoGraphic: React.FC<LogoGraphicProps> = ({
  className = '',
  size = 'md',
  showText = false,
  customLogoUrl,
}) => {
  const sizeClasses = {
    sm: 'w-11 h-11 sm:w-12 sm:h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24 sm:w-28 sm:h-28',
    xl: 'w-36 h-36 sm:w-40 sm:h-40',
  }[size];

  const logoSrc = customLogoUrl || vedLogoImg;

  return (
    <div className="inline-flex items-center gap-3 shrink-0">
      {/* Single Clean Logo Frame without outer double card */}
      <div className={`relative flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-md border border-amber-500/30 flex items-center justify-center ${sizeClasses} ${className}`}>
        {logoSrc ? (
          <img
            src={logoSrc}
            alt="Ved Enterprises Logo"
            className="w-full h-full object-cover scale-[1.38] transition-transform duration-300 transform-gpu"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Fallback to SVG if image fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <svg
            viewBox="0 0 200 280"
            className="w-full h-full drop-shadow-sm"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="100" cy="90" r="55" fill="url(#goldAura)" opacity="0.25" />
            <path
              d="M100 260 C98 210, 96 160, 100 20"
              stroke="#1e293b"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M100 20 C135 35, 165 85, 145 150 C130 190, 105 230, 100 260 C95 230, 70 190, 55 150 C35 85, 65 35, 100 20 Z"
              fill="url(#featherGlow)"
              stroke="#1e293b"
              strokeWidth="2.5"
            />
            <ellipse cx="100" cy="70" rx="32" ry="42" fill="#1e3a8a" stroke="#1e293b" strokeWidth="2" />
            <ellipse cx="100" cy="70" rx="24" ry="32" fill="#0284c7" />
            <ellipse cx="100" cy="70" rx="16" ry="22" fill="#d97706" />
            <ellipse cx="100" cy="70" rx="9" ry="13" fill="#0f172a" />
          </svg>
        )}
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none font-serif">
            VED <span className="text-red-600 dark:text-red-500">ENTERPRISES</span>
          </span>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 tracking-wider uppercase mt-1">
            Yarns, Fabrics & Textile Traders • Ludhiana
          </span>
        </div>
      )}
    </div>
  );
};
