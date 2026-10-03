import React from 'react';
import vedLogoSvg from '../assets/images/ved_enterprises_logo.svg';

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

  const logoSrc = customLogoUrl || vedLogoSvg;

  return (
    <div className="inline-flex items-center gap-3 shrink-0">
      {/* Clean Logo Frame with solid white background under the logo */}
      <div
        className={`relative flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-md border border-amber-500/30 flex items-center justify-center p-1 ${sizeClasses} ${className}`}
        style={{ backgroundColor: '#ffffff' }}
      >
        <img
          src={logoSrc}
          alt="Ved Enterprises Logo"
          className="w-full h-full object-contain bg-white transition-transform duration-300 transform-gpu"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Fallback to SVG if image fails to load
            e.currentTarget.style.display = 'none';
          }}
        />
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
