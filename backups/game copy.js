// Import the JSON file for snap positions
import snapPositions from './positions/snapPositions.json';
// import { currentlySelectedSprite } from './main';

//incase of any error, please check the cenyres for calculation of 1,2,3,4....
const gridcentre = { x: 650, y: 320 };
const player1_center = { x: 255, y: 360 };
const player2_center = { x: 1045, y: 360 };

let currentlySelectedSprite = null; // To track the currently selected sprite



const snapThreshold = 50;// for snapping the cones on the grid


// Function to handle dragging of sprites
export function onDrag(pointer, gameObject, dragX, dragY) {
    if (gameObject) {
        gameObject.x = dragX;
        gameObject.y = dragY;
    } else {
        console.error("gameObject is undefined in onDrag");
    }
}

// Function to handle the end of dragging
export function onDragEnd(pointer, gameObject) {
    const color = gameObject.name; // "blue" or "red"
    const snapPoints = snapPositions[color]; // Get the corresponding snap points
    let closestDistance = Infinity;
    let closestSnapPoint = null;

    // Calculate the closest snap point
    for (const key in snapPoints) {
        const snapPoint = snapPoints[key];
        const distance = Phaser.Math.Distance.Between(gameObject.x, gameObject.y, snapPoint.x, snapPoint.y);

        if (distance < closestDistance) {
            closestDistance = distance;
            closestSnapPoint = snapPoint;
        }
    }

    // If within a minimum distance, snap to the closest point
    const minimumSnapDistance = 50; // Define the minimum distance for snapping
    if (closestDistance <= minimumSnapDistance) {
        gameObject.x = closestSnapPoint.x;
        gameObject.y = closestSnapPoint.y;
    } else {
        // Return to the initial position if not within snapping range
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
    }
}


function getPositionFromCellNumber(cellNumber, color) {
    if (!snapPositions[color]) {
        console.error(`No snap positions found for color: ${color}`);
        return null;
    }
    
    const cellPosition = snapPositions[color][cellNumber];
    if (!cellPosition) {
        console.error(`No snap position found for cell number ${cellNumber} and color ${color}`);
        return null;
    }
    
    return cellPosition;
}


// Function to snap a sprite to the cell position based on the clicked cell
function snapToNearestCell(clickX, clickY, sprite) {
    if (!sprite) return;

    const color = sprite.name; // "blue" or "red"
    const cellNumber = getCellNumberFromPosition(clickX, clickY); // Determine the cell number from the click position
    const cellPosition = getPositionFromCellNumber(cellNumber, color); // Get position from JSON

    if (cellPosition) {
        sprite.setPosition(cellPosition.x, cellPosition.y);
        console.log(`Sprite snapped to position ${cellNumber}:`, cellPosition);
    } else {
        console.log(`No snap position found for cell number ${cellNumber}`);
    }
}



// Function to handle sprite clicks
export function onSpriteClick(sprite, pointer) {
    // Check if the sprite is already selected
    const isSelected = sprite.getData('clicked');

    if (currentlySelectedSprite && currentlySelectedSprite !== sprite) {
        // Remove the click effect from the previously selected sprite
        removeClickEffect(currentlySelectedSprite);
        currentlySelectedSprite.setData('clicked', false);
    }

    if (isSelected) {
        // Deselect the sprite if it was previously clicked
        removeClickEffect(sprite);
        sprite.setData('clicked', false);
        currentlySelectedSprite = null; // No sprite is currently selected
    } else {
        // Select the new sprite and apply a click effect
        applyClickEffect(sprite);
        sprite.setData('clicked', true);
        currentlySelectedSprite = sprite; // Set as selected
    }

    // Handle snap to nearest grid position if a sprite is selected
    if (currentlySelectedSprite) {
        console.log('Snapping sprite to nearest grid:', currentlySelectedSprite.name);
        snapToNearestCell(currentlySelectedSprite);
    }

    // Log the sprite click
    console.log(`Sprite clicked: ${sprite.name}`);
}



// Getter function to access the currently selected sprite
function getCurrentlySelectedSprite() {
    return currentlySelectedSprite;
}

// Setter function to update the currently selected sprite
function setCurrentlySelectedSprite(sprite) {
    currentlySelectedSprite = sprite;
}

// Function to clear the currently selected sprite
function clearCurrentlySelectedSprite() {
    currentlySelectedSprite = null;
}


// Function to toggle the click effect on the sprite
//edit this fucntion to make hover and click efefeects
// at same time or disable hover effect when clicked
// function toggleClickEffect(sprite) {
//     if (currentlySelectedSprite && currentlySelectedSprite !== sprite) {
//         // Remove tint from the previously selected sprite
//         removeClickEffect(currentlySelectedSprite);
//         currentlySelectedSprite.setData('clicked', false); // Update its 'clicked' state
//     }

//     if (sprite.getData('clicked')) {
//         // Deselect the sprite if it was previously clicked
//         removeClickEffect(sprite);
//         sprite.setData('clicked', false);
//         currentlySelectedSprite = null; // No sprite is currently selected
//     } else {
//         // Apply the click effect and select the sprite
//         applyClickEffect(sprite);
//         sprite.setData('clicked', true);
//         currentlySelectedSprite = sprite; // Update the currently selected sprite

//         // Disable hover effect when clicked
//         sprite.off('pointerover');
//         sprite.off('pointerout');
//     }
// }
//ENABLE THIS if YOU WANT BOTH

function toggleClickEffect(sprite) {
    if (currentlySelectedSprite && currentlySelectedSprite !== sprite) {
        removeClickEffect(currentlySelectedSprite);
        currentlySelectedSprite.setData('clicked', false);
    }

    if (sprite.getData('clicked')) {
        removeClickEffect(sprite);
        sprite.setData('clicked', false);
        currentlySelectedSprite = null;
    } else {
        applyClickEffect(sprite);
        sprite.setData('clicked', true);
        currentlySelectedSprite = sprite;
    }
}



// Function to apply a click effect on the sprite
function applyClickEffect(sprite) {
    sprite.setTint(0xb9bab9); // Apply a green tint for click effect
}

// Function to remove the click effect from the sprite
function removeClickEffect(sprite) {
    sprite.clearTint(); // Remove the tint
}

export { snapToNearestCell ,getCurrentlySelectedSprite, setCurrentlySelectedSprite, clearCurrentlySelectedSprite, toggleClickEffect, 
    getPositionFromCellNumber,
    applyClickEffect, removeClickEffect};


