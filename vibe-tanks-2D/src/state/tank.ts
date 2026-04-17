import type { BonusTypeValue } from "./bonus";
import { BonusType } from "./bonus";

export const Direction = {
  Up: 0,
  Right: 1,
  Down: 2,
  Left: 3,
} as const;

export type DirectionValue = (typeof Direction)[keyof typeof Direction];

export class Tank {
  x: number;
  y: number;
  direction: DirectionValue;
  hp: number;
  armor: number;
  armorCharges: number;
  damageBonus: number;
  speedBonus: number;
  isPlayer: boolean;

  constructor(
    x: number,
    y: number,
    isPlayer: boolean = false,
    direction: DirectionValue = Direction.Up
  ) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.hp = 1;
    this.armor = 0;
    this.armorCharges = 0;
    this.damageBonus = 0;
    this.speedBonus = 0;
    this.isPlayer = isPlayer;
  }

  getAP(): number {
    return 3 + this.speedBonus;
  }

  getDamage(): number {
    return 1 + this.damageBonus;
  }

  takeDamage(damage: number): boolean {
    // Armor absorbs hits first
    if (this.armorCharges > 0) {
      this.armorCharges--;
      return this.hp > 0; // Not dead
    }
    this.hp -= damage;
    return this.hp > 0;
  }

  pickupBonus(type: BonusTypeValue): void {
    const MAX_PER_TYPE = 2;
    switch (type) {
      case BonusType.Armor:
        if (this.armorCharges < MAX_PER_TYPE * 1) {
          this.armorCharges++;
          this.speedBonus = Math.max(0, this.speedBonus - 1);
        }
        break;
      case BonusType.Damage:
        if (this.damageBonus < MAX_PER_TYPE) {
          this.damageBonus++;
        }
        break;
      case BonusType.Speed:
        if (this.speedBonus < MAX_PER_TYPE) {
          this.speedBonus++;
        }
        break;
    }
  }

  rotate(clockwise: boolean): void {
    const directions: DirectionValue[] = [
      Direction.Up,
      Direction.Right,
      Direction.Down,
      Direction.Left,
    ];
    const currentIndex = directions.indexOf(this.direction);
    const newIndex = clockwise
      ? (currentIndex + 1) % 4
      : (currentIndex + 3) % 4;
    this.direction = directions[newIndex];
  }

  getDirectionVector(): [number, number] {
    switch (this.direction) {
      case Direction.Up:
        return [0, -1];
      case Direction.Right:
        return [1, 0];
      case Direction.Down:
        return [0, 1];
      case Direction.Left:
        return [-1, 0];
      default:
        throw new Error(`Unknown direction: ${this.direction}`);
    }
  }
}
