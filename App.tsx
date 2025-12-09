
import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Landing } from './components/Landing';
import { Navbar } from './components/Navbar';
import { ImageUploader } from './components/ImageUploader';
import { MagicCanvas } from './components/MagicCanvas';
import { generateBobbieGoodsArt, generateRandomLineArt } from './services/geminiService';
import { Loader } from './components/Loader';
import { ErrorModal } from './components/ErrorModal';
import { Gallery } from './components/Gallery';
import { ArrowLeft } from 'lucide-react';
import { SavedDrawing } from './types';

// CONSTANTE DEFINIDA AQUI PARA EVITAR ERROS DE IMPORTAÇÃO
const STORAGE_KEY = 'bobbie_goods_gallery';

// Updated Enum for clarity
enum AppState {
  LANDING = 0,
  CREATE = 1,
  PROCESSING = 2,
  RESULT = 3,
  GALLERY = 4
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>("Preparando os pincéis mágicos...");
  const [savedDrawings, setSavedDrawings] = useState<SavedDrawing[]>([]);

  // Load drawings from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedDrawings(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load gallery:", e);
    }
  }, []);

  const saveDrawingToGallery = (dataUrl: string) => {
    try {
        const newDrawing: SavedDrawing = {
            id: Date.now().toString(),
            dataUrl,
            date: new Date().toISOString()
        };
        const updatedDrawings = [newDrawing, ...savedDrawings];
        setSavedDrawings(updatedDrawings);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDrawings));
        alert("Desenho salvo com sucesso na sua galeria mágica! ✨");
    } catch (e) {
        console.error("Storage limit reached", e);
        setError("Sua galeria está cheia! Tente apagar alguns desenhos antigos.");
    }
  };

  const deleteDrawing = (id: string) => {
      const updated = savedDrawings.filter(d => d.id !== id);
      setSavedDrawings(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleImageUpload = async (base64Image: string) => {
    setOriginalImage(base64Image);
    setAppState(AppState.PROCESSING);
    
    const messages = [
      "Misturando cores fofas...",
      "Chamando a Gemini para desenhar...",
      "Adicionando contornos mágicos...",
      "Quase pronto para colorir!",
      "Aplicando o estilo Bobbie Goods..."
    ];
    
    startLoadingCycle(messages);

    try {
      const result = await generateBobbieGoodsArt(base64Image);
      setGeneratedImage(result);
      setAppState(AppState.RESULT);
    } catch (err: any) {
      console.error(err);
      setError("Ops! Algo deu errado ao criar sua arte. Tente novamente! ✨");
      setAppState(AppState.CREATE);
    }
  };

  const handleGenerateRandom = async () => {
    setOriginalImage(null); // No original photo for random generation
    setAppState(AppState.PROCESSING);

    const messages = [
        "Imaginando uma cena fofa...",
        "Desenhando ursinhos e coelhinhos...",
        "Criando um mundo mágico...",
        "Preparando o papel de colorir..."
    ];

    startLoadingCycle(messages);

    try {
        const result = await generateRandomLineArt();
        setGeneratedImage(result);
        setAppState(AppState.RESULT);
    } catch (err: any) {
        console.error(err);
        setError("Não consegui imaginar um desenho agora. Tente novamente! 🐻");
        setAppState(AppState.CREATE);
    }
  };

  const startLoadingCycle = (messages: string[]) => {
    let msgIndex = 0;
    setLoadingMessage(messages[0]);
    const interval = setInterval(() => {
        msgIndex = (msgIndex + 1) % messages.length;
        setLoadingMessage(messages[msgIndex]);
    }, 2500);
    return interval;
  };

  const handleReset = () => {
    setAppState(AppState.CREATE);
    setOriginalImage(null);
    setGeneratedImage(null);
    setError(null);
  };

  const navigate = (view: AppState) => {
      setAppState(view);
      if (view === AppState.CREATE || view === AppState.LANDING) {
        setOriginalImage(null);
        setGeneratedImage(null);
      }
  };

  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden pt-20">
      
      {/* Decorative background elements */}
      <div className="fixed top-20 left-10 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob pointer-events-none"></div>
      <div className="fixed top-40 right-10 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="fixed -bottom-8 left-20 w-48 h-48 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 pointer-events-none"></div>

      <Navbar currentView={appState} onNavigate={(view) => navigate(view)} />

      {/* Back Button for specific sub-states */}
      {(appState === AppState.RESULT) && (
        <button 
          onClick={handleReset}
          className="absolute top-24 left-6 bg-white hover:bg-pink-50 text-pink-500 rounded-full p-3 shadow-lg transition-all transform hover:scale-110 z-40 border-2 border-pink-100"
        >
          <ArrowLeft size={24} />
        </button>
      )}

      <main className="w-full max-w-7xl z-10 flex flex-col items-center px-4 mb-12">
        
        {appState === AppState.LANDING && (
           <Landing onStart={() => setAppState(AppState.CREATE)} />
        )}

        {appState === AppState.CREATE && (
          <div className="mt-8 w-full max-w-xl animate-fade-in-up flex flex-col items-center gap-8">
            <Hero compact />
            <ImageUploader 
              onImageSelected={handleImageUpload} 
              onGenerateRandom={handleGenerateRandom}
            />
          </div>
        )}

        {appState === AppState.PROCESSING && (
           <Loader message={loadingMessage} />
        )}

        {appState === AppState.RESULT && generatedImage && (
          <MagicCanvas 
            originalImage={originalImage || undefined} 
            generatedImage={generatedImage} 
            onSaveToGallery={saveDrawingToGallery}
          />
        )}

        {appState === AppState.GALLERY && (
            <Gallery drawings={savedDrawings} onDelete={deleteDrawing} />
        )}

      </main>

      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
      
      <footer className="mt-auto py-8 text-slate-400 text-sm font-semibold text-center z-10 w-full border-t border-white/50 bg-white/30 backdrop-blur-sm">
        <p>Feito com muito ❤️ e ✨ Gemini AI</p>
        <p className="text-xs mt-2 font-normal">Transformando memórias em arte estilo Bobbie Goods</p>
      </footer>
    </div>
  );
};

export default App;
