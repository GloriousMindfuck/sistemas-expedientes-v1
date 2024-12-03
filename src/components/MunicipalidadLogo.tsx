import React from 'react';
import { MunicipalidadColors } from '../styles/colors';

interface MunicipalidadLogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'white' | 'dark';
}

const MunicipalidadLogo: React.FC<MunicipalidadLogoProps> = ({ 
  size = 'medium', 
  variant = 'default' 
}) => {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-32 h-32'
  };

  const variantStyles = {
    default: {
      bg: MunicipalidadColors.primary[500],
      text: 'text-white'
    },
    white: {
      bg: 'bg-white',
      text: `text-${MunicipalidadColors.primary[500]}`
    },
    dark: {
      bg: MunicipalidadColors.primary[900],
      text: 'text-white'
    }
  };

  const { bg, text } = variantStyles[variant];

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${bg} 
        ${text}
        rounded-full 
        flex 
        items-center 
        justify-center 
        shadow-md 
        transform 
        transition-all 
        duration-300 
        hover:scale-105
      `}
    >
      <div className="text-center font-bold">
        <span className="text-xl">GM</span>
        <br />
        <span className="text-xs">Guardia Mitre</span>
      </div>
    </div>
  );
};

export default MunicipalidadLogo;
