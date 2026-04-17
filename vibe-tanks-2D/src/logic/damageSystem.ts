import type { Tank } from "../state/tank";
import { TerrainType, type TerrainTypeValue } from "../state/terrain";

export function calculateTankDamage(baseDamage: number, armor: number): number {
  // Armor absorbs damage at 1:1 ratio
  return Math.max(0, baseDamage - armor);
}

export function calculateTerrainDamage(
  baseDamage: number,
  terrainType: TerrainTypeValue
): number {
  if (terrainType === TerrainType.Concrete) {
    // Concrete only takes even damage
    return Math.floor(baseDamage / 2) * 2;
  }

  return baseDamage;
}

export function processTankDamage(tank: Tank, damage: number): boolean {
  // Armor absorbs hits first (each charge blocks 1 hit)
  if (tank.armorCharges > 0) {
    tank.armorCharges--;
    return tank.hp > 0; // Not dead
  }

  tank.hp -= damage;
  return tank.hp > 0; // Not dead if hp > 0
}

export function getTankHealthPercentage(tank: Tank): number {
  const maxHP = 1 + tank.armorCharges;
  return Math.max(0, (tank.hp / maxHP) * 100);
}
