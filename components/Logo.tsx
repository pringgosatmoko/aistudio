
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };

  const textSizes = {
    sm: 'text-[10px]',
    md: 'text-sm',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`relative ${sizes[size]}`}>
        {/* Animated Glowing Ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 animate-pulse blur-md opacity-60"></div>
        <div className="absolute -inset-1 rounded-full border border-white/10"></div>
        
        {/* Logo Image Container */}
        <div className="absolute inset-0 rounded-full bg-slate-950 flex items-center justify-center overflow-hidden border border-slate-800 shadow-2xl">
          <img 
            src="logo.png" 
            alt="SATMOKO AI" 
            className="w-full h-full object-cover scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=SA';
            }}
          />
        </div>
      </div>
      
      {showText && (
        <div className="text-center">
          <h1 className={`${textSizes[size]} font-black text-white tracking-[0.2em] uppercase italic`}>
            SATMOKO STUDIO
          </h1>
          <p className="text-[8px] md:text-[10px] text-amber-500 font-black tracking-[0.4em] uppercase mt-1">
            AI CREATIVE
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;
