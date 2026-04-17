import type { GameState } from "../state/gameState";
import { GRID_SIZE } from "../state/gameState";
import type { Tank } from "../state/tank";
import { type DirectionValue } from "../state/tank";
import { blocksShot, TerrainType } from "../state/terrain";

export interface ShotResult {
  hit: boolean;
  targetTank?: Tank;
  terrainX?: number;
  terrainY?: number;
  distance: number;
}

export function getShootingLine(
  tank: Tank,
  direction: DirectionValue
): [number, number][] {
  const line: [number, number][] = [];
  const directions = [
    [0, -1], // Up
    [1, 0], // Right
    [0, 1], // Down
    [-1, 0], // Left
  ];

  const [dx, dy] = directions[direction];
  let x = tank.x + dx;
  let y = tank.y + dy;

  while (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
    line.push([x, y]);
    x += dx;
    y += dy;
  }

  return line;
}

export function shoot(gameState: GameState, tank: Tank): ShotResult {
  const line = getShootingLine(tank, tank.direction);

  for (const [x, y] of line) {
    // Check if hit player or AI tank
    if (gameState.playerTank.x === x && gameState.playerTank.y === y) {
      return {
        hit: true,
        targetTank: gameState.playerTank,
        distance: Math.abs(x - tank.x) + Math.abs(y - tank.y),
      };
    }
    if (gameState.aiTank.x === x && gameState.aiTank.y === y) {
      return {
        hit: true,
        targetTank: gameState.aiTank,
        distance: Math.abs(x - tank.x) + Math.abs(y - tank.y),
      };
    }

    // Check if hit terrain
    const terrain = gameState.getTileAt(x, y);
    if (terrain && blocksShot(terrain)) {
      return {
        hit: true,
        terrainX: x,
        terrainY: y,
        distance: Math.abs(x - tank.x) + Math.abs(y - tank.y),
      };
    }
  }

  return { hit: false, distance: line.length };
}

export function applyDamage(
  gameState: GameState,
  targetTank: Tank,
  damage: number
): void {
  const survived = targetTank.takeDamage(damage);
  if (!survived) {
    gameState.gameOver = true;
    gameState.winner = targetTank.isPlayer ? "ai" : "player";
  }
}

export function applyTerrainDamage(
  gameState: GameState,
  x: number,
  y: number,
  damage: number
): void {
  const terrain = gameState.getTileAt(x, y);
  if (!terrain || !terrain.hp) return;

  // Apply damage based on terrain type
  let actualDamage = damage;

  if (terrain.type === TerrainType.Concrete) {
    // Concrete only takes even damage
    actualDamage = Math.floor(damage / 2) * 2;
  }

  terrain.hp -= actualDamage;

  if (terrain.hp <= 0) {
    // Destroyed - change to empty
    gameState.setTileAt(x, y, null);
  } else if (terrain.type === TerrainType.Brick && terrain.hp === 1) {
    // Brick damaged - update type
    gameState.setTileAt(x, y, { type: TerrainType.BrickedDamaged, hp: 1 });
  }
}
