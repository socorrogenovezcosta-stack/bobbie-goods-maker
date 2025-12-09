
import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

interface HeroProps {
    compact?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ compact = false }) => {
  return (
    <div className="text-center relative">
      <div className={`absolute -left-12 text-yellow-400 animate-bounce ${compact ? '-top-6' : '-top-12'}`}>
        <Sparkles size={compact ? 32 : 48} />
      </div>
      <div className={`absolute -right-8 text-pink-400 animate-pulse ${compact ? 'top-0' : 'top-0'}`}>
        <Heart size={compact ? 24 : 32} fill="currentColor" />
      </div>
      
      <h1 className={`${compact ? 'text-4xl md:text-5xl' : 'text-5xl md:text-7xl'} font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 drop-shadow-sm mb-4 tracking-tight`}>
        Bobbie Goods Maker
      </h1>
      
      {!compact && (
        <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed bg-white/50 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-white/60">
            Transforme suas fotos em desenhos <span className="text-pink-500 font-bold">super fofos</span> e prontos para colorir! O mundo mágico do Bobbie Goods espera por você. ✨
        </p>
      )}
      
      {compact && (
          <p className="text-lg text-slate-500 font-medium">
              Pronto para criar sua próxima obra de arte?
          </p>
      )}
    </div>
  );
};
