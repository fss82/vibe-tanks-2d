import type { GameState } from "../state/gameState";
import { GRID_SIZE } from "../state/gameState";
import type { Tank } from "../state/tank";
import { isPassable } from "../state/terrain";

export function canMoveTo(
  gameState: GameState,
  x: number,
  y: number,
  excludeTank?: Tank
): boolean {
  // Out of bounds
  if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) {
    return false;
  }

  // Check terrain
  const terrain = gameState.getTileAt(x, y);
  if (!isPassable(terrain)) {
    return false;
  }

  // Check if another tank is there
  if (gameState.playerTank.x === x && gameState.playerTank.y === y) {
    return excludeTank === gameState.playerTank;
  }
  if (gameState.aiTank.x === x && gameState.aiTank.y === y) {
    return excludeTank === gameState.aiTank;
  }

  return true;
}

export function moveToward(
  gameState: GameState,
  tank: Tank,
  dx: number,
  dy: number
): boolean {
  const newX = tank.x + dx;
  const newY = tank.y + dy;

  if (canMoveTo(gameState, newX, newY, tank)) {
    tank.x = newX;
    tank.y = newY;

    // Check for bonus pickup
    const bonus = gameState.getBonusAt(newX, newY);
    if (bonus) {
      tank.pickupBonus(bonus.type);
      gameState.removeBonusAt(newX, newY);
    }

    return true;
  }

  return false;
}

export function moveInDirection(
  gameState: GameState,
  tank: Tank,
  direction: 0 | 1 | 2 | 3
): boolean {
  // Direction mapping: 0=Up, 1=Right, 2=Down, 3=Left
  const directions = [
    [0, -1], // Up
    [1, 0], // Right
    [0, 1], // Down
    [-1, 0], // Left
  ];

  const [dx, dy] = directions[direction];
  return moveToward(gameState, tank, dx, dy);
}
