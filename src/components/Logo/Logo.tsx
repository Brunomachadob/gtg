import React from 'react';

export interface LogoProps {
  variant?: 'full' | 'icon';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  variant = 'full', 
  size = 'medium', 
  className = '' 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return variant === 'full' ? 'h-8' : 'h-6 w-6';
      case 'large':
        return variant === 'full' ? 'h-16' : 'h-12 w-12';
      default:
        return variant === 'full' ? 'h-12' : 'h-8 w-8';
    }
  };

  if (variant === 'icon') {
    return (
      <svg
        className={`${getSizeClasses()} ${className}`}
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <circle cx="16" cy="16" r="14" fill="url(#iconGradient)" stroke="#6366f1" strokeWidth="1.5"/>

        {/* Simple pull-up bar */}
        <g transform="translate(16, 16)">
          {/* Main bar */}
          <rect x="-10" y="-2" width="20" height="2" fill="white" rx="1"/>
          {/* Bar supports */}
          <rect x="-12" y="-2" width="2" height="6" fill="white" rx="1"/>
          <rect x="10" y="-2" width="2" height="6" fill="white" rx="1"/>
        </g>

        {/* Gradient definition */}
        <defs>
          <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:'#8b5cf6', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#6366f1', stopOpacity:1}} />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  return (
    <svg
      className={`${getSizeClasses()} ${className}`}
      viewBox="0 0 200 60"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle for the icon */}
      <circle cx="30" cy="30" r="25" fill="url(#fullGradient)" stroke="#6366f1" strokeWidth="2"/>

      {/* Simple pull-up bar */}
      <g transform="translate(30, 30)">
        {/* Main bar */}
        <rect x="-18" y="-3" width="36" height="4" fill="white" rx="2"/>
        {/* Bar supports */}
        <rect x="-22" y="-3" width="3" height="10" fill="white" rx="1.5"/>
        <rect x="19" y="-3" width="3" height="10" fill="white" rx="1.5"/>
      </g>

      {/* Text */}
      <text x="70" y="25" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="#333">
        Grease the
      </text>
      <text x="70" y="45" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="#6366f1">
        Groove
      </text>

      {/* Gradient definition */}
      <defs>
        <linearGradient id="fullGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#8b5cf6', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#6366f1', stopOpacity:1}} />
        </linearGradient>
      </defs>
    </svg>
  );
};
