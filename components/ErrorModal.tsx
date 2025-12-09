import React from 'react';
import { X } from 'lucide-react';

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative text-center border-4 border-red-100">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
            <X size={24} />
        </button>
        
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">😢</span>
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 mb-2">Ops!</h3>
        <p className="text-slate-600 font-medium mb-6">{message}</p>
        
        <button
          onClick={onClose}
          className="w-full py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg hover:shadow-red-200"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  );
};