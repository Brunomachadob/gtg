import React from "react";

import './Card.css';

export interface CardProps {
  color: 'blue' | 'green' | 'red' | 'orange' | 'purple';
  title: string
  onClick?: () => void;
  icon: React.ReactNode;
  leftIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export function Card({ title, children, color, icon, leftIcon, onClick }: CardProps) {

  return (
    <div className={`card card-${color}`} onClick={onClick}>
      <div className="card-header">
        <div className="card-header-left">
          <div className="card-icon">
            {icon}
          </div>
          <div className="card-header-title">{title}</div>
        </div>
        {
          leftIcon &&
          <div className="card-header-right">
            <button className="card-icon">
              {leftIcon}
            </button>
          </div>
        }
      </div>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}