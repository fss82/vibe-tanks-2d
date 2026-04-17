import type { Tank } from "../state/tank";

export class TurnSystem {
  updateAP(_tank: Tank, _apUsed: number): void {
    // To be implemented based on turn context
  }

  reduceTank(_tank: Tank, _ap: number): void {
    // To be implemented based on current turn context
  }
}

export function calculateAP(tank: Tank): number {
  return 3 + tank.speedBonus;
}

export function isAPAvailable(currentAP: number, actionCost: number): boolean {
  return currentAP >= actionCost;
}
