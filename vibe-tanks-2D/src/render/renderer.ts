import { GameState, GRID_SIZE } from "../state/gameState";
import type { Tank } from "../state/tank";
import { TerrainType } from "../state/terrain";
import {
  TILE_SIZE,
  Colors,
  rgbaString,
  type CanvasContext,
} from "./canvas";
import type { Animation } from "./animations";

export class Renderer {
  private ctx: CanvasContext;

  constructor(ctx: CanvasContext) {
    this.ctx = ctx;
  }

  render(gameState: GameState, animations: Animation[] = []): void {
    this.clear();
    this.renderGrid();
    this.renderTerrain(gameState);
    this.renderBonuses(gameState);
    this.renderTanks(gameState);
    this.renderAnimations(animations);
    this.renderUI(gameState);
  }

  private clear(): void {
    this.ctx.fillStyle = rgbaString(Colors.background);
    this.ctx.fillRect(0, 0, GRID_SIZE * TILE_SIZE, GRID_SIZE * TILE_SIZE);
  }

  private renderGrid(): void {
    this.ctx.strokeStyle = rgbaString(Colors.gridLine);
    this.ctx.lineWidth = 1;

    for (let i = 0; i <= GRID_SIZE; i++) {
      // Horizontal lines
      this.ctx.beginPath();
      this.ctx.moveTo(0, i * TILE_SIZE);
      this.ctx.lineTo(GRID_SIZE * TILE_SIZE, i * TILE_SIZE);
      this.ctx.stroke();

      // Vertical lines
      this.ctx.beginPath();
      this.ctx.moveTo(i * TILE_SIZE, 0);
      this.ctx.lineTo(i * TILE_SIZE, GRID_SIZE * TILE_SIZE);
      this.ctx.stroke();
    }
  }

  private renderTerrain(gameState: GameState): void {
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const terrain = gameState.getTileAt(x, y);
        if (!terrain) continue;

        const color =
          terrain.type === TerrainType.Water
            ? Colors.water
            : terrain.type === TerrainType.Brick
              ? Colors.brick
              : terrain.type === TerrainType.BrickedDamaged
                ? Colors.brickDamaged
                : terrain.type === TerrainType.Concrete
                  ? Colors.concrete
                  : Colors.empty;

        this.ctx.fillStyle = rgbaString(color);
        this.ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

        // Draw HP for destructible terrain
        if (terrain.hp) {
          this.ctx.fillStyle = rgbaString({ r: 255, g: 255, b: 255 });
          this.ctx.font = "12px Arial";
          this.ctx.textAlign = "center";
          this.ctx.textBaseline = "middle";
          this.ctx.fillText(
            terrain.hp.toString(),
            x * TILE_SIZE + TILE_SIZE / 2,
            y * TILE_SIZE + TILE_SIZE / 2
          );
        }
      }
    }
  }

  private renderBonuses(gameState: GameState): void {
    for (const bonus of gameState.bonuses) {
      this.ctx.fillStyle = rgbaString(Colors.bonus);
      this.ctx.beginPath();
      this.ctx.arc(
        bonus.x * TILE_SIZE + TILE_SIZE / 2,
        bonus.y * TILE_SIZE + TILE_SIZE / 2,
        8,
        0,
        Math.PI * 2
      );
      this.ctx.fill();

      // Draw bonus type letter
      this.ctx.fillStyle = rgbaString({ r: 0, g: 0, b: 0 });
      this.ctx.font = "bold 10px Arial";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      const label = bonus.type[0].toUpperCase();
      this.ctx.fillText(
        label,
        bonus.x * TILE_SIZE + TILE_SIZE / 2,
        bonus.y * TILE_SIZE + TILE_SIZE / 2
      );
    }
  }

  private renderTanks(gameState: GameState): void {
    this.renderTank(gameState.playerTank, Colors.playerTank);
    this.renderTank(gameState.aiTank, Colors.aiTank);
  }

  private renderTank(tank: Tank, color: any): void {
    const x = tank.x * TILE_SIZE + TILE_SIZE / 2;
    const y = tank.y * TILE_SIZE + TILE_SIZE / 2;

    // Tank body
    this.ctx.fillStyle = rgbaString(color);
    this.ctx.beginPath();
    this.ctx.arc(x, y, TILE_SIZE / 3, 0, Math.PI * 2);
    this.ctx.fill();

    // Tank direction indicator (barrel)
    const [dx, dy] = tank.getDirectionVector();
    this.ctx.strokeStyle = rgbaString({ r: 255, g: 255, b: 255 });
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + dx * (TILE_SIZE / 2), y + dy * (TILE_SIZE / 2));
    this.ctx.stroke();

    // HP indicator
    this.ctx.fillStyle = rgbaString({ r: 255, g: 255, b: 255 });
    this.ctx.font = "bold 12px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "top";
    this.ctx.fillText(tank.hp.toString(), x, y + TILE_SIZE / 1.5);

    // Armor charges indicator
    if (tank.armorCharges > 0) {
      this.ctx.fillStyle = rgbaString({ r: 100, g: 200, b: 255 });
      this.ctx.font = "bold 10px Arial";
      this.ctx.fillText(`A:${tank.armorCharges}`, x, y - TILE_SIZE / 2);
    }
  }

  private renderUI(gameState: GameState): void {
    const uiY = GRID_SIZE * TILE_SIZE + 30;
    const padding = 20;

    this.ctx.fillStyle = rgbaString({ r: 255, g: 255, b: 255 });
    this.ctx.font = "14px Arial";
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "top";

    const turnText = `Turn: ${gameState.currentTurn.toUpperCase()}`;
    const playerAPText = `Player AP: ${gameState.playerAP}/${gameState.playerTank.getAP()}`;
    const aiAPText = `AI AP: ${gameState.aiAP}/${gameState.aiTank.getAP()}`;

    this.ctx.fillText(turnText, padding, uiY);
    this.ctx.fillText(playerAPText, padding, uiY + 20);
    this.ctx.fillText(aiAPText, padding + 250, uiY + 20);
  }

  private renderAnimations(animations: Animation[]): void {
    for (const anim of animations) {
      const x = anim.x * TILE_SIZE + TILE_SIZE / 2;
      const y = anim.y * TILE_SIZE + TILE_SIZE / 2;
      const progress = anim.elapsed / anim.duration;
      const alpha = 1 - progress;

      this.ctx.save();
      this.ctx.globalAlpha = alpha;
      this.ctx.translate(x, y);
      this.ctx.scale(anim.scale, anim.scale);

      if (anim.type === "explosion") {
        // Orange explosion
        this.ctx.fillStyle = rgbaString({ r: 255, g: 165, b: 0 });
        this.ctx.beginPath();
        this.ctx.arc(0, 0, TILE_SIZE / 3, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (anim.type === "hit") {
        // Red hit effect
        this.ctx.fillStyle = rgbaString({ r: 255, g: 0, b: 0 });
        this.ctx.beginPath();
        this.ctx.arc(0, 0, TILE_SIZE / 4, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (anim.type === "pickup") {
        // Yellow pickup sparkle
        this.ctx.fillStyle = rgbaString({ r: 255, g: 255, b: 0 });
        this.ctx.beginPath();
        this.ctx.arc(0, 0, TILE_SIZE / 5, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }
  }
}
