import React from 'react';
import LogoSrc from '../assets/logo-municipalidad.svg';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-32 h-32'
  };

  return (
    <img 
      src={LogoSrc} 
      alt="Logo Municipalidad de Guardia Mitre" 
      className={`${sizeClasses[size]} object-contain ${className}`}
    />
  );
};
