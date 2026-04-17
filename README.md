
# 2D Turn-Based Tank Game (Browser) - Technical Specification

## 1. General Concept
- Genre: turn-based strategy
- Mode: 1 player vs AI
- Grid: 9x9
- Victory: destroy enemy tank

## 2. Grid
Tiles:
- Empty
- Water (blocks movement and shots)
- Brick (HP=2)
- Damaged Brick (HP=1)
- Concrete (HP=4, takes only even damage)

Movement:
- Tanks cannot pass through any non-empty terrain except empty cells

## 3. Turn System
AP system:
AP = 3 + speedBonus

Actions:
- Move 1 cell = 1 AP
- Shoot = 1 AP
- Rotate = free

End turn manually or when AP=0

## 4. Shooting
- Straight line only
- Stops at tank / obstacle / edge

Interactions:
- Tank: damage
- Brick: 2-stage destruction
- Concrete: only even damage (floor(damage/2)*2)
- Water: blocks shot

## 5. Bonuses
Max 2 per type:
- Armor (charges)
- Damage
- Speed

Armor:
- Blocks 1 hit per charge
- On pickup: +armor, -speed

Speed:
- increases AP

Damage:
- increases damage

## 6. Damage system
damage = 1 + damageBonus

Armor absorbs hits before HP.

HP base = 1

## 7. Destructible objects
Brick:
- 2 HP -> damaged -> destroyed

Concrete:
- HP 4
- accepts only even damage

## 8. AI system
AI evaluates all possible moves (1 turn lookahead):

Scores:
- Win: +∞
- Death: -∞
- Kill enemy: +1000
- Line of fire: +50
- Safe attack: +100
- Bonus pickup: +6..10
- Reduce cover: +10

AI avoids suicidal moves.

Prefers:
- killing
- safe attacks
- line of fire positioning
- bonuses

## 9. Victory
- explosion animation
- modal dialog
- restart button resets full game state

## 10. Reset
Full recreation of:
- map
- tanks
- bonuses
- bullets
- state

## 11. Controls
**Player Controls:**
- **Arrow Keys** (Up/Down/Left/Right) - Set tank direction
- **Space** - Move tank in current direction (1 AP)
- **Ctrl** - Shoot (1 AP)
- **Shift** - End turn manually
- **R** - Restart game

**Game Flow:**
1. Set tank direction with arrows
2. Press Space to move or Ctrl to shoot
3. Each action costs 1 AP
4. Turn ends automatically when AP reaches 0
5. AI plays its turn automatically
6. First tank destroyed loses

## 12. Implementation Status
✅ **Completed Features:**
- 9x9 grid with procedural terrain generation
- Player and AI tanks with full mechanics
- AP-based turn system
- Line-of-sight shooting with terrain interactions
- Terrain destruction (Brick, Concrete)
- Armor, Speed, and Damage bonuses
- 1-turn lookahead AI with strategic evaluation
- Explosion and damage animations
- Victory modal with restart button
- Full game state reset

