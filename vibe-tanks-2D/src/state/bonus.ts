export const BonusType = {
  Armor: "armor",
  Damage: "damage",
  Speed: "speed",
} as const;

export type BonusTypeValue = (typeof BonusType)[keyof typeof BonusType];

export interface Bonus {
  type: BonusTypeValue;
  x: number;
  y: number;
}

export function createBonus(type: BonusTypeValue, x: number, y: number): Bonus {
  return { type, x, y };
}
