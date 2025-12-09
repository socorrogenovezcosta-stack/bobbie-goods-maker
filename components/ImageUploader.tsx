import React, { useRef } from 'react';
import { Camera, Upload, Stars, Sparkles, Wand2 } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  onGenerateRandom: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, onGenerateRandom }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onImageSelected(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-md rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(236,72,153,0.3)] border-4 border-white ring-4 ring-pink-100 transition-all hover:scale-[1.02] duration-300">
      <div className="mb-6 relative">
         <div className="absolute -top-4 -right-4 text-yellow-400 animate-spin-slow">
            <Stars size={40} fill="currentColor" />
         </div>
        <div className="w-56 h-56 bg-pink-50 rounded-full flex items-center justify-center border-4 border-dashed border-pink-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-100 to-blue-100 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute z-10 flex flex-col items-center text-pink-400">
                <Camera size={56} className="mb-2" />
                <span className="font-bold text-base">Sua Foto Aqui</span>
            </div>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="flex flex-col gap-4 w-full md:w-auto">
        <button
            onClick={handleButtonClick}
            className="relative group overflow-hidden px-10 py-5 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold text-xl shadow-[0_10px_20px_rgba(236,72,153,0.4)] hover:shadow-[0_15px_30px_rgba(236,72,153,0.6)] transition-all transform hover:-translate-y-1 active:scale-95 w-full"
        >
            <span className="relative z-10 flex items-center justify-center gap-3">
            <Upload size={24} />
            Transformar em Magia!
            </span>
            <div className="absolute inset-0 h-full w-full scale-0 rounded-full transition-all duration-300 group-hover:scale-100 group-hover:bg-white/20"></div>
        </button>

        <div className="flex items-center gap-4 w-full">
            <div className="h-px bg-pink-200 flex-1"></div>
            <span className="text-pink-300 font-bold text-sm">OU</span>
            <div className="h-px bg-pink-200 flex-1"></div>
        </div>

        <button
            onClick={onGenerateRandom}
            className="relative overflow-hidden px-10 py-5 rounded-full bg-white text-indigo-500 border-2 border-indigo-200 font-bold text-xl shadow-lg hover:shadow-indigo-200 transition-all transform hover:-translate-y-1 active:scale-95 w-full group"
        >
            <span className="relative z-10 flex items-center justify-center gap-3">
            <Wand2 size={24} className="group-hover:rotate-12 transition-transform" />
            Gerar Desenho Surpresa
            </span>
        </button>
      </div>
      
    </div>
  );
};