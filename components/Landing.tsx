
import React from 'react';
import { Hero } from './Hero';
import { Upload, Wand2, Palette, ArrowRight } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="w-full max-w-6xl flex flex-col items-center gap-16 animate-fade-in pb-12">
      
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center mt-8">
        <Hero />
        <button 
          onClick={onStart}
          className="mt-8 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-bold text-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3 animate-bounce-subtle"
        >
          Começar a Criar
          <ArrowRight size={24} />
        </button>
      </div>

      {/* How it Works Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full px-4">
        {[
          {
            icon: Upload,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
            title: '1. Envie sua Foto',
            desc: 'Escolha uma foto do seu pet, quarto ou momento favorito.'
          },
          {
            icon: Wand2,
            color: 'text-purple-500',
            bg: 'bg-purple-50',
            title: '2. Mágica IA',
            desc: 'Nossa IA transforma a foto em um desenho estilo Bobbie Goods.'
          },
          {
            icon: Palette,
            color: 'text-pink-500',
            bg: 'bg-pink-50',
            title: '3. Pinte e Relaxe',
            desc: 'Baixe para imprimir ou pinte digitalmente aqui mesmo.'
          }
        ].map((step, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
            <div className={`w-16 h-16 ${step.bg} ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
              <step.icon size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">{step.title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* Example Section */}
      <div className="w-full bg-white/60 backdrop-blur-sm rounded-[3rem] p-8 md:p-12 border-4 border-white shadow-xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-300 via-pink-300 to-yellow-300"></div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-slate-700 mb-8">
          Do Real para o <span className="text-pink-500">Mágico</span>
        </h2>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
           <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-2xl opacity-75 blur-lg group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-64 h-64 bg-slate-200 rounded-xl overflow-hidden shadow-2xl rotate-3 transition-transform group-hover:rotate-0">
                  <img src="https://images.unsplash.com/photo-1517849845537-4d257902454a?w=500&auto=format&fit=crop&q=60" alt="Dog Real" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white py-2 font-bold text-sm">Foto Original</div>
              </div>
           </div>
           
           <ArrowRight size={40} className="text-slate-300 rotate-90 md:rotate-0" />

           <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl opacity-75 blur-lg group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-64 h-64 bg-white rounded-xl overflow-hidden shadow-2xl -rotate-3 transition-transform group-hover:rotate-0 border-4 border-white flex items-center justify-center">
                   <div className="text-center p-4">
                      <div className="text-6xl mb-2">🐶</div>
                      <p className="text-slate-400 text-sm font-bold">Desenho Fofo Gerado</p>
                  </div>
                   <div className="absolute bottom-0 left-0 right-0 bg-pink-500/80 text-white py-2 font-bold text-sm">Estilo Bobbie Goods</div>
              </div>
           </div>
        </div>
      </div>

    </div>
  );
};
