# Phaser-3InaRow

## ALTERNATIVES
  1.  # Cone Clash: Advanced Strategy Version

## Objective
Align three cones of the same color in a row, column, or diagonal on a 3x3 grid. The alignment does not need to be of the same size, and the game incorporates complex mechanics to increase strategic depth.

## Setup
- **Grid**: 3x3 board.
- **Cones**: Each player has 9 cones of their own color (e.g., red and blue):
  - 3 Small cones
  - 3 Medium cones
  - 3 Large cones

## Rules

### Placement Rules
- Cones can be placed in any cell or stacked on top of existing cones.
- Cones can be placed only if the size is larger than the cone currently in that cell.

### Winning Conditions
- Align three cones of the same color in a row, column, or diagonal. The alignment can be of any size.

### Special Grid Mechanics
- **Randomized Cells**: After every 3 turns, a random cell will either:
  - Swap its contents with another cell.
  - Change its state (e.g., become a "No Placement" cell where no cones can be placed until a future round).
- **Dynamic Obstacles**: Introduce dynamic obstacles that randomly appear on the grid. For instance, every few turns, an obstacle could block one cell temporarily, making it unavailable for a few turns.

### Special Moves
- **Swap**: Swap the positions of two cones anywhere on the grid.
- **Remove**: Remove an opponent’s cone from the grid (excluding the winning alignment).
- **Reposition**: Move a cone from one cell to another cell of the same or larger size.

### Limited Moves
- Each player has 6 moves total (including placement and special moves). The game ends when all moves are used, and the player with the most alignments wins.

### Victory Points
- Points are awarded based on the complexity of the alignment:
  - **Simple Alignment**: 3 cones of the same color in a row, column, or diagonal. (5 points)
  - **Mixed Size Alignment**: 3 cones of the same color with different sizes. (7 points)
  - **Stacked Alignment**: Three cones of the same color in a single cell. (10 points)

## Example Gameplay

1. **Player 1 (Red)**: Places a Medium red cone in cell 5.
2. **Player 2 (Blue)**: Places a Small blue cone in cell 1.
3. **Player 1 (Red)**: Places a Large red cone in cell 2.
4. **Player 2 (Blue)**: Places a Medium blue cone in cell 3.
5. **Player 1 (Red)**: Uses "Reposition" to move a Small red cone from cell 4 to cell 6.
6. **Player 2 (Blue)**: Uses "Swap" to swap the Medium blue cone in cell 3 with the Small blue cone in cell 1.
7. **Player 1 (Red)**: Places a Large red cone in cell 7.
8. **Player 2 (Blue)**: Uses "Remove" to remove the Medium blue cone from cell 3.

   **Dynamic Mechanic Trigger**: After every 3 turns, cell 6 becomes a "No Placement" cell for the next round.

9. **Player 1 (Red)**: Places a Medium red cone in cell 8.
10. **Player 2 (Blue)**: Places a Large blue cone in cell 9.

   **Dynamic Mechanic Trigger**: After the next 3 turns, a random cell swap occurs.

### **Current Grid**


## Strategy Tips
- **Adaptive Planning**: Be ready to adjust strategies based on dynamic grid changes and obstacles.
- **Optimize Special Moves**: Use special moves to disrupt your opponent’s strategy or to create winning opportunities.
- **Anticipate Random Changes**: Plan for possible grid changes and obstacles, and adapt your strategy accordingly.

This advanced version of Cone Clash introduces elements of randomness and complexity that encourage deeper strategic thinking and adaptation, making the game more challenging and engaging.

