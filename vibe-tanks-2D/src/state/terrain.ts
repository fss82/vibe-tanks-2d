export const TerrainType = {
  Empty: "empty",
  Water: "water",
  Brick: "brick",
  BrickedDamaged: "brick_damaged",
  Concrete: "concrete",
} as const;

export type TerrainTypeValue = (typeof TerrainType)[keyof typeof TerrainType];

export interface Terrain {
  type: TerrainTypeValue;
  hp?: number;
}

export function createTerrain(type: TerrainTypeValue): Terrain {
  switch (type) {
    case TerrainType.Brick:
      return { type, hp: 2 };
    case TerrainType.BrickedDamaged:
      return { type, hp: 1 };
    case TerrainType.Concrete:
      return { type, hp: 4 };
    default:
      return { type };
  }
}

export function isPassable(terrain: Terrain | null): boolean {
  if (!terrain || terrain.type === TerrainType.Empty) return true;
  return false;
}

export function blocksShot(terrain: Terrain | null): boolean {
  if (!terrain || terrain.type === TerrainType.Empty || terrain.type === TerrainType.Water) {
    return false;
  }
  return true;
}
