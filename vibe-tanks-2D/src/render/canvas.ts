export type CanvasContext = CanvasRenderingContext2D;

export const TILE_SIZE = 40;
export const GRID_SIZE = 9;
export const CANVAS_WIDTH = TILE_SIZE * GRID_SIZE;
export const CANVAS_HEIGHT = TILE_SIZE * GRID_SIZE;

export function initCanvas(): HTMLCanvasElement {
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  if (!canvas) {
    throw new Error("Canvas element not found");
  }
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  return canvas;
}

export function getCanvasContext(canvas: HTMLCanvasElement): CanvasContext {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }
  return ctx;
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export function rgbaString(color: Color): string {
  const a = color.a ?? 1;
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${a})`;
}

export const Colors = {
  background: { r: 50, g: 50, b: 50 },
  gridLine: { r: 100, g: 100, b: 100 },
  empty: { r: 80, g: 80, b: 80 },
  water: { r: 30, g: 100, b: 150 },
  brick: { r: 139, g: 69, b: 19 },
  brickDamaged: { r: 180, g: 90, b: 30 },
  concrete: { r: 120, g: 120, b: 120 },
  playerTank: { r: 50, g: 200, b: 50 },
  aiTank: { r: 200, g: 50, b: 50 },
  bonus: { r: 255, g: 215, b: 0 },
  grid: { r: 60, g: 60, b: 60 },
};
