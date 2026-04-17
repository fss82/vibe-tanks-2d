import type { Terrain } from "./terrain";
import type { Bonus } from "./bonus";
import { Tank, Direction } from "./tank";
import { generateMapTerrain, generateMapBonuses } from "../logic/mapGenerator";

export const GRID_SIZE = 9;

export class GameState {
  grid: (Terrain | null)[][];
  playerTank: Tank;
  aiTank: Tank;
  bonuses: Bonus[];
  currentTurn: "player" | "ai";
  playerAP: number;
  aiAP: number;
  gameOver: boolean;
  winner: "player" | "ai" | null;

  constructor() {
    this.grid = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(null));
    this.bonuses = [];
    this.currentTurn = "player";
    this.gameOver = false;
    this.winner = null;

    // Place tanks
    this.playerTank = new Tank(1, 7, true, Direction.Up);
    this.aiTank = new Tank(7, 1, false, Direction.Down);

    this.playerAP = this.playerTank.getAP();
    this.aiAP = this.aiTank.getAP();

    // Generate map
    this.generateMap();
  }

  private generateMap(): void {
    generateMapTerrain(this);
    generateMapBonuses(this);
  }

  getTileAt(x: number, y: number): Terrain | null {
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) {
      return null;
    }
    return this.grid[y][x];
  }

  setTileAt(x: number, y: number, terrain: Terrain | null): void {
    if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
      this.grid[y][x] = terrain;
    }
  }

  getBonusAt(x: number, y: number): Bonus | undefined {
    return this.bonuses.find((b) => b.x === x && b.y === y);
  }

  removeBonusAt(x: number, y: number): void {
    this.bonuses = this.bonuses.filter((b) => !(b.x === x && b.y === y));
  }

  reset(): void {
    this.grid = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(null));
    this.bonuses = [];
    this.currentTurn = "player";
    this.gameOver = false;
    this.winner = null;

    this.playerTank = new Tank(1, 7, true, Direction.Up);
    this.aiTank = new Tank(7, 1, false, Direction.Down);

    this.playerAP = this.playerTank.getAP();
    this.aiAP = this.aiTank.getAP();

    this.generateMap();
  }
}
