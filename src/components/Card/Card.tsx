import React from 'react';
import { LucideIcon } from 'lucide-react';

import './Card.css';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  onClick?: () => void;
  className?: string;
  clickable?: boolean;
  icon?: LucideIcon;
  iconSize?: number;
}

export function Card({
  children,
  title,
  onClick,
  className = '',
  clickable = false,
  icon: Icon,
  iconSize = 16
}: CardProps) {
  const cardClasses = [
    'card',
    clickable || onClick ? 'card-clickable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={onClick}>
      {title && (
        <div className="card-header">
          <h2 className="card-title">{title}</h2>
          {Icon && (
            <div className="card-header-icon">
              <Icon size={iconSize} />
            </div>
          )}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
      {(clickable || onClick) && Icon && !title && (
        <div className="card-action-icon">
          <Icon size={iconSize} />
        </div>
      )}
    </div>
  );
}