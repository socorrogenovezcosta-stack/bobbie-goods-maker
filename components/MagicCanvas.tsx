import React, { useRef, useState, useEffect } from 'react';
import { Download, Eraser, RefreshCw, Palette, Brush as BrushIcon, Hand, ZoomIn, ZoomOut, RotateCcw, Heart } from 'lucide-react';

interface MagicCanvasProps {
  originalImage?: string; // Optional now for generated random drawings
  generatedImage: string;
  onSaveToGallery: (dataUrl: string) => void;
}

export const MagicCanvas: React.FC<MagicCanvasProps> = ({ originalImage, generatedImage, onSaveToGallery }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // App States
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ec4899');
  const [brushSize, setBrushSize] = useState(3);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'move'>('brush');
  const [showOriginal, setShowOriginal] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Zoom & Pan States
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Extended Palette
  const colors = [
    '#ef4444', '#f87171', '#fca5a5', 
    '#f97316', '#fdba74', '#ffedd5', 
    '#eab308', '#fde047', '#fef08a', 
    '#84cc16', '#bef264', '#ecfccb', 
    '#22c55e', '#86efac', '#dcfce7', 
    '#06b6d4', '#67e8f9', '#cffafe', 
    '#3b82f6', '#93c5fd', '#dbeafe', 
    '#6366f1', '#a5b4fc', '#e0e7ff', 
    '#a855f7', '#d8b4fe', '#f3e8ff', 
    '#d946ef', '#f0abfc', '#fae8ff', 
    '#ec4899', '#f9a8d4', '#fce7f3', 
    '#881337', '#be123c', '#fb7185', 
    '#78350f', '#b45309', '#d97706', 
    '#000000', '#525252', '#a3a3a3', '#ffffff'
  ];

  useEffect(() => {
    const img = new Image();
    img.src = generatedImage;
    img.onload = () => {
      const maxWidth = Math.min(800, window.innerWidth - 40);
      const maxHeight = window.innerHeight * 0.7; 
      
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
      }

      setImageSize({ width, height });

      if (drawingCanvasRef.current) {
        drawingCanvasRef.current.width = width;
        drawingCanvasRef.current.height = height;
        const ctx = drawingCanvasRef.current.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
        }
      }
    };
  }, [generatedImage]);

  // --- MOUSE / TOUCH HANDLERS ---
  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (showOriginal) return;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    if (tool === 'move') {
      setIsPanning(true);
      dragStartRef.current = { x: clientX - pan.x, y: clientY - pan.y };
    } else {
      setIsDrawing(true);
      
      const canvas = drawingCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const x = (clientX - rect.left) * scaleX;
      const y = (clientY - rect.top) * scaleY;

      ctx.beginPath();
      ctx.moveTo(x, y);
      draw(x, y);
    }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    let clientX, clientY;
    if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
    }

    if (cursorRef.current) {
        cursorRef.current.style.left = `${clientX}px`;
        cursorRef.current.style.top = `${clientY}px`;
    }

    if (isPanning && tool === 'move') {
        e.preventDefault();
        setPan({
            x: clientX - dragStartRef.current.x,
            y: clientY - dragStartRef.current.y
        });
        return;
    }

    if (!isDrawing || tool === 'move' || !drawingCanvasRef.current || showOriginal) return;
    
    e.preventDefault();

    const canvas = drawingCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    draw(x, y);
  };

  const draw = (x: number, y: number) => {
      const ctx = drawingCanvasRef.current?.getContext('2d');
      if (!ctx) return;

      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      if (tool === 'eraser') {
          ctx.strokeStyle = '#ffffff';
      } else {
          ctx.strokeStyle = color;
      }
      
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
  };

  const handleEnd = () => {
    if (isPanning) {
        setIsPanning(false);
    }
    if (isDrawing) {
        setIsDrawing(false);
        const ctx = drawingCanvasRef.current?.getContext('2d');
        ctx?.beginPath(); 
    }
  };

  const resetZoom = () => {
      setScale(1);
      setPan({ x: 0, y: 0 });
  };

  const generateCompositeImage = (): string | null => {
    if (!drawingCanvasRef.current) return null;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = imageSize.width;
    tempCanvas.height = imageSize.height;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return null;

    // Bottom: Colors
    ctx.drawImage(drawingCanvasRef.current, 0, 0);

    // Top: Line Art (Multiply)
    ctx.globalCompositeOperation = 'multiply';
    if (imageRef.current) {
        ctx.drawImage(imageRef.current, 0, 0, imageSize.width, imageSize.height);
    }

    return tempCanvas.toDataURL('image/png');
  };

  const downloadArt = () => {
    const dataUrl = generateCompositeImage();
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.download = 'minha-arte-bobbie-goods.png';
    link.href = dataUrl;
    link.click();
  };

  const saveToGallery = () => {
      const dataUrl = generateCompositeImage();
      if (dataUrl) {
          onSaveToGallery(dataUrl);
      }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full justify-center animate-fade-in relative">
      
      {/* Custom Cursor */}
      <div 
        ref={cursorRef}
        className="fixed pointer-events-none rounded-full z-[9999] transition-transform duration-75"
        style={{ 
            width: `${Math.max(4, brushSize * scale)}px`, 
            height: `${Math.max(4, brushSize * scale)}px`, 
            transform: 'translate(-50%, -50%)',
            backgroundColor: tool === 'eraser' ? '#ffffff' : color,
            border: tool === 'eraser' ? '2px solid #94a3b8' : '2px solid white',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)',
            display: (isHovering && !showOriginal && tool !== 'move') ? 'block' : 'none',
        }}
      />

      {/* Tools Panel (Sidebar) */}
      <div className="bg-white p-6 rounded-3xl shadow-xl flex flex-col gap-6 w-full lg:w-72 border-2 border-pink-100 order-2 lg:order-1 sticky top-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-pink-500 flex items-center gap-2">
            <Palette size={20} />
            Pincéis & Cores
        </h3>
        
        {/* Colors */}
        <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-500">Paleta Completa</label>
            <div className="grid grid-cols-6 gap-2">
                <div className="col-span-1 relative group">
                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 via-green-500 to-blue-500 border-2 border-white ring-2 ring-slate-200 cursor-pointer hover:scale-110 transition-transform flex items-center justify-center">
                        <span className="text-white font-bold text-[10px]">+</span>
                     </div>
                     <input 
                        type="color" 
                        value={color}
                        onChange={(e) => { setColor(e.target.value); setTool('brush'); }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                </div>
                {colors.map((c, i) => (
                    <button
                        key={i}
                        onClick={() => { setColor(c); setTool('brush'); }}
                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 shadow-sm ${color === c && tool === 'brush' ? 'border-slate-600 scale-110 ring-2 ring-pink-200' : 'border-white ring-1 ring-slate-100'}`}
                        style={{ backgroundColor: c }}
                        aria-label={`Cor ${c}`}
                    />
                ))}
            </div>
        </div>

         {/* Action Buttons */}
         {originalImage && (
             <button 
                onClick={() => setShowOriginal(!showOriginal)}
                className="w-full py-3 rounded-xl bg-indigo-50 text-indigo-600 font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2 border border-indigo-200"
            >
                <RefreshCw size={18} />
                {showOriginal ? "Ver Desenho" : "Ver Foto Original"}
            </button>
         )}

         <button 
            onClick={saveToGallery}
            className="w-full py-3 rounded-xl bg-pink-500 text-white font-bold hover:bg-pink-600 shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
        >
            <Heart size={20} fill="currentColor" />
            Salvar na Galeria
        </button>

         <button 
            onClick={downloadArt}
            className="w-full py-3 rounded-xl bg-white text-emerald-600 font-bold border-2 border-emerald-100 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
        >
            <Download size={20} />
            Baixar no Celular
        </button>
      </div>

      {/* Main Canvas Area Wrapper */}
      <div className="flex flex-col gap-4 order-1 lg:order-2 w-full items-center">
        
        {/* Top Toolbar: Zoom, Brush Size & Tools */}
        {/* Added mt-14 to prevent overlap with the global Back button on mobile screens */}
        <div className="bg-white px-4 py-3 rounded-2xl shadow-lg border border-pink-100 flex items-center gap-4 w-full max-w-2xl animate-fade-in-up justify-between mt-14 md:mt-0">
            
            {/* Left Section: Sliders Column */}
            <div className="flex flex-col gap-2 flex-1 max-w-xs sm:max-w-sm">
                
                {/* Row 1: Zoom */}
                <div className="flex items-center gap-2">
                    <ZoomOut size={16} className="text-pink-400 shrink-0" />
                    <input 
                        type="range" 
                        min="1" 
                        max="5" 
                        step="0.1"
                        value={scale} 
                        onChange={(e) => setScale(Number(e.target.value))}
                        className="w-full h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
                        title="Zoom"
                    />
                    <ZoomIn size={16} className="text-pink-400 shrink-0" />
                </div>

                {/* Row 2: Brush Size (Below Zoom) */}
                <div className="flex items-center gap-2">
                     <div className="w-4 flex justify-center shrink-0">
                        <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                     </div>
                    <input 
                        type="range" 
                        min="1" 
                        max="50" 
                        value={brushSize} 
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                        className="w-full h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
                        title="Tamanho do Pincel"
                    />
                     <div className="w-4 flex justify-center shrink-0">
                        <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                     </div>
                </div>

            </div>

            {/* Divider */}
            <div className="w-px h-12 bg-slate-100 mx-1"></div>

            {/* Right Section: Tools */}
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => setTool('move')}
                    className={`p-2 rounded-xl transition-all flex items-center justify-center gap-2 ${tool === 'move' ? 'bg-pink-500 text-white shadow-lg scale-110' : 'bg-slate-50 text-slate-500 hover:bg-pink-50'}`}
                    title="Mover (Arrastar)"
                >
                    <Hand size={20} />
                    <span className="text-xs font-bold hidden sm:inline">Mover</span>
                </button>

                <div className="w-px h-8 bg-slate-100 mx-1 hidden sm:block"></div>

                <button 
                    onClick={() => setTool('brush')}
                    className={`p-2 rounded-xl transition-all flex items-center justify-center gap-2 ${tool === 'brush' ? 'bg-pink-500 text-white shadow-lg scale-110' : 'bg-slate-50 text-slate-500 hover:bg-pink-50'}`}
                    title="Pincel"
                >
                    <BrushIcon size={20} />
                    <span className="text-xs font-bold hidden sm:inline">Pincel</span>
                </button>

                <button 
                    onClick={() => setTool('eraser')}
                    className={`p-2 rounded-xl transition-all flex items-center justify-center gap-2 ${tool === 'eraser' ? 'bg-pink-500 text-white shadow-lg scale-110' : 'bg-slate-50 text-slate-500 hover:bg-pink-50'}`}
                    title="Apagar"
                >
                    <Eraser size={20} />
                    <span className="text-xs font-bold hidden sm:inline">Apagar</span>
                </button>
            </div>

            <button onClick={resetZoom} className="p-2 ml-1 hover:bg-slate-50 rounded-full text-slate-400 hidden sm:block" title="Resetar Zoom"><RotateCcw size={18} /></button>
        </div>

        {/* Viewport Container */}
        <div 
            ref={containerRef}
            className="relative overflow-hidden rounded-[2rem] shadow-2xl border-[8px] border-white ring-4 ring-pink-100 bg-slate-50"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMove}
            onTouchMove={handleMove}
            style={{ 
                width: imageSize.width || '100%', 
                height: imageSize.height || 'auto',
                maxWidth: '100%',
                cursor: tool === 'move' ? (isPanning ? 'grabbing' : 'grab') : 'none'
            }}
        >
            <div 
                style={{ 
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                    transformOrigin: 'top left',
                    width: '100%',
                    height: '100%',
                    transition: isPanning ? 'none' : 'transform 0.1s ease-out'
                }}
            >
                {/* Original Image Layer (If exists) */}
                {originalImage && (
                    <img 
                        src={originalImage} 
                        alt="Original" 
                        className="absolute top-0 left-0 w-full h-full object-contain select-none pointer-events-none" 
                        style={{ display: showOriginal ? 'block' : 'none' }}
                    />
                )}

                {/* Layer 1: Painting Canvas (Bottom) */}
                <canvas
                    ref={drawingCanvasRef}
                    onMouseDown={handleStart}
                    onMouseUp={handleEnd}
                    onMouseOut={handleEnd}
                    onTouchStart={handleStart}
                    onTouchEnd={handleEnd}
                    className="absolute top-0 left-0 w-full h-full touch-none"
                    style={{ display: showOriginal ? 'none' : 'block' }}
                />

                {/* Layer 2: Line Art Image (Top) */}
                <img 
                    ref={imageRef}
                    src={generatedImage} 
                    alt="Line Art" 
                    className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none mix-blend-multiply z-10 select-none" 
                    style={{ display: showOriginal ? 'none' : 'block' }}
                />
            </div>
        </div>
      </div>

    </div>
  );
};