// Import the spritesData
import spritesData from './positions/sprites.json';

// Define layer depths for S, M, and L
export const layerDepths = {
    'S': 10,
    'M': 20,
    'L': 30
  };
  

// Initialize cell structure
const cells = {
    1: { sprites: [] },
    2: { sprites: [] },
    3: { sprites: [] },
    4: { sprites: [] },
    5: { sprites: [] },
    6: { sprites: [] },
    7: { sprites: [] },
    8: { sprites: [] },
    9: { sprites: [] }
  };



// Function to get all sprites in a specific cell
export function getSpritesInCell(scene, cell, coneSize, gridSize) {
    return scene.children.getAll().filter(sprite => {
        return Math.floor(sprite.x / coneSize) === cell % gridSize &&
               Math.floor(sprite.y / coneSize) === Math.floor(cell / gridSize);
    });
}

export function placeSpriteOnTop(sprite, existingSprites) {
    const spriteType = sprite.name.charAt(0); // Get sprite type (S, M, L)
    const zIndex = spriteLayers[spriteType];

    existingSprites.forEach(s => {
        const existingZIndex = spriteLayers[s.name.charAt(0)];
        if (existingZIndex < zIndex) {
            s.setDepth(zIndex); // Move existing sprites below the new sprite
        } else if (existingZIndex === zIndex) {
            s.setDepth(zIndex); // Keep existing sprites at the same depth if they are the same type
        }
    });

    sprite.setDepth(zIndex); // Set the new sprite's depth
}
