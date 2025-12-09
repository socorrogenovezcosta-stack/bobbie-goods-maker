
import React, { useState } from 'react';
import { Home, Sparkles, Images, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentView: number;
  onNavigate: (view: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Início', icon: Home, view: 0 }, // AppState.LANDING
    { label: 'Criar Mágica', icon: Sparkles, view: 1 }, // AppState.CREATE
    { label: 'Galeria', icon: Images, view: 4 } // AppState.GALLERY
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b-2 border-pink-100 z-50 px-4 py-3">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div 
            onClick={() => onNavigate(0)}
            className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-pink-400 to-purple-400 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
            <span className="text-2xl">🧸</span>
          </div>
          <span className="font-bold text-xl text-slate-700 tracking-tight group-hover:text-pink-500 transition-colors">
            Bobbie<span className="text-pink-500">Maker</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.view)}
              className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all ${
                currentView === item.view 
                  ? 'bg-pink-100 text-pink-600 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-pink-500'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b-2 border-pink-100 shadow-xl p-4 flex flex-col gap-2 md:hidden animate-fade-in">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                onNavigate(item.view);
                setIsOpen(false);
              }}
              className={`p-4 rounded-xl font-bold flex items-center gap-3 ${
                currentView === item.view 
                  ? 'bg-pink-50 text-pink-600' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};
