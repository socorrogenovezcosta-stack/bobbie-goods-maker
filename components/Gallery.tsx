import React from 'react';
import { Trash2, Download } from 'lucide-react';
import { SavedDrawing } from '../types';

interface GalleryProps {
  drawings: SavedDrawing[];
  onDelete: (id: string) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ drawings, onDelete }) => {
  if (drawings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in text-center">
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 border-4 border-pink-100">
           <span className="text-5xl">🎨</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-600">Sua galeria está vazia!</h3>
        <p className="text-slate-500 mt-2 max-w-xs">Pinte alguns desenhos mágicos e salve-os para vê-los aqui.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl p-4 animate-fade-in">
      <h2 className="text-3xl font-bold text-pink-500 mb-8 text-center flex items-center justify-center gap-3">
         <span>🖼️</span> Galeria de Arte
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {drawings.map((drawing) => (
          <div key={drawing.id} className="bg-white rounded-3xl p-4 shadow-xl border-4 border-white ring-4 ring-pink-50 hover:ring-pink-200 transition-all group relative">
            <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-slate-50 relative border-2 border-slate-100">
                <img 
                    src={drawing.dataUrl} 
                    alt="Desenho salvo" 
                    className="w-full h-full object-contain"
                />
            </div>
            
            <div className="flex justify-between items-center px-2">
                <span className="text-xs font-bold text-slate-400">
                    {new Date(drawing.date).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                     <a 
                        href={drawing.dataUrl} 
                        download={`bobbie-goods-${drawing.id}.png`}
                        className="p-2 bg-indigo-50 text-indigo-500 rounded-full hover:bg-indigo-100 transition-colors"
                        title="Baixar"
                     >
                        <Download size={18} />
                    </a>
                    <button 
                        onClick={() => onDelete(drawing.id)}
                        className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors"
                        title="Apagar"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};