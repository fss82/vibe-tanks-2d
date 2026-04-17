import type { GameState } from "../state/gameState";
import { GRID_SIZE } from "../state/gameState";
import { createTerrain, TerrainType } from "../state/terrain";
import { BonusType } from "../state/bonus";

export function generateMapTerrain(gameState: GameState): void {
  // Random terrain generation with density distribution
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      // Don't place terrain on tank starting positions
      if (
        (x === gameState.playerTank.x && y === gameState.playerTank.y) ||
        (x === gameState.aiTank.x && y === gameState.aiTank.y)
      ) {
        continue;
      }

      // Avoid placing terrain in corners/edges for early game
      if (
        (x < 2 && y < 2) ||
        (x >= GRID_SIZE - 2 && y < 2) ||
        (x < 2 && y >= GRID_SIZE - 2) ||
        (x >= GRID_SIZE - 2 && y >= GRID_SIZE - 2)
      ) {
        continue;
      }

      const rand = Math.random();
      if (rand < 0.1) {
        gameState.setTileAt(x, y, createTerrain(TerrainType.Water));
      } else if (rand < 0.4) {
        gameState.setTileAt(x, y, createTerrain(TerrainType.Brick));
      } else if (rand < 0.55) {
        gameState.setTileAt(x, y, createTerrain(TerrainType.Concrete));
      }
    }
  }
}

export function generateMapBonuses(gameState: GameState): void {
  const bonusCount = 4; // 4 bonuses total on map
  const bonusTypes = [BonusType.Armor, BonusType.Damage, BonusType.Speed];

  for (let i = 0; i < bonusCount; i++) {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 50) {
      const x = Math.floor(Math.random() * GRID_SIZE);
      const y = Math.floor(Math.random() * GRID_SIZE);

      // Don't place on terrain or tanks
      if (
        gameState.getTileAt(x, y) === null &&
        !gameState.getBonusAt(x, y) &&
        !((x === gameState.playerTank.x && y === gameState.playerTank.y) ||
          (x === gameState.aiTank.x && y === gameState.aiTank.y))
      ) {
        const bonusType =
          bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
        gameState.bonuses.push({ type: bonusType, x, y });
        placed = true;
      }
      attempts++;
    }
  }
}
