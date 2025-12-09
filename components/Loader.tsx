import React from 'react';

interface LoaderProps {
  message: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-96 animate-fade-in">
      <div className="relative mb-8">
        <div className="w-24 h-24 border-8 border-pink-200 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-24 h-24 border-8 border-t-pink-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl">
            🧸
        </div>
      </div>
      <h2 className="text-2xl font-bold text-slate-700 text-center animate-pulse">{message}</h2>
      <p className="mt-2 text-slate-500">Isso pode levar alguns segundos...</p>
    </div>
  );
};