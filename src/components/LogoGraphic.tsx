import React from 'react';
import vedLogoWordmark from '../assets/images/ved-logo-wordmark.svg';
import vedLogoWordmarkDark from '../assets/images/ved-logo-wordmark-dark.svg';
import vedLogoIcon from '../assets/images/ved-logo-icon.svg';

interface LogoGraphicProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  showText?: boolean;
  variant?: 'wordmark' | 'icon' | 'auto';
  theme?: 'light' | 'dark' | 'auto';
  customLogoUrl?: string;
  alt?: string;
}

export const LogoGraphic: React.FC<LogoGraphicProps> = ({
  className = '',
  size = 'md',
  showText = false,
  variant = 'auto',
  theme = 'auto',
  customLogoUrl,
  alt = 'Ved Enterprises Logo & Wordmark',
}) => {
  // If showText is explicitly requested or variant is 'wordmark', use full logo wordmark
  const isWordmark = variant === 'wordmark' || showText;

  if (isWordmark) {
    const heightClasses = {
      sm: 'h-9 sm:h-11',
      md: 'h-12 sm:h-14',
      lg: 'h-16 sm:h-20',
      xl: 'h-24 sm:h-28',
      custom: '',
    }[size];

    if (customLogoUrl) {
      return (
        <img
          src={customLogoUrl}
          alt={alt}
          className={`w-auto object-contain ${heightClasses} ${className}`}
        />
      );
    }

    if (theme === 'dark') {
      return (
        <img
          src={vedLogoWordmarkDark}
          alt={alt}
          className={`w-auto object-contain ${heightClasses} ${className}`}
        />
      );
    }

    if (theme === 'light') {
      return (
        <img
          src={vedLogoWordmark}
          alt={alt}
          className={`w-auto object-contain ${heightClasses} ${className}`}
        />
      );
    }

    // Default: auto theme via Tailwind dark mode class
    return (
      <div className={`inline-flex items-center shrink-0 ${className}`}>
        <img
          src={vedLogoWordmark}
          alt={alt}
          className={`w-auto object-contain dark:hidden ${heightClasses}`}
        />
        <img
          src={vedLogoWordmarkDark}
          alt={alt}
          className={`w-auto object-contain hidden dark:block ${heightClasses}`}
        />
      </div>
    );
  }

  // Otherwise icon-only variant
  const iconSizeClasses = {
    sm: 'w-10 h-10 sm:w-11 sm:h-11',
    md: 'w-14 h-14 sm:w-16 sm:h-16',
    lg: 'w-20 h-20 sm:w-24 sm:h-24',
    xl: 'w-32 h-32 sm:w-36 sm:h-36',
    custom: '',
  }[size];

  const iconSrc = customLogoUrl || vedLogoIcon;

  return (
    <div className={`relative shrink-0 flex items-center justify-center ${iconSizeClasses} ${className}`}>
      <img
        src={iconSrc}
        alt={alt}
        className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-300 hover:scale-105"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
