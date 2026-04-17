
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

