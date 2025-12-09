export interface Brush {
  color: string;
  size: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface SavedDrawing {
  id: string;
  dataUrl: string;
  date: string;
  prompt?: string;
}