// // Import the JSON file for snap positions
// import snapPositions from './positions/snapPositions.json';
// import { playClickSound ,playSnapSound} from './SoundManager';
// import { placeSpriteOnTop,getSpritesInCell } from './gameLogic';
// // import { currentlySelectedSprite } from './main';

// //incase of any error, please check the cenyres for calculation of 1,2,3,4....
// const gridcentre = { x: 650, y: 320 };
// const player1_center = { x: 255, y: 360 };
// const player2_center = { x: 1045, y: 360 };

// let currentlySelectedSprite = null; // To track the currently selected sprite

// const snapThreshold = 60;// for snapping the cones on the grid
// //onselecting the sprite, it appears 6 more than the current depth
// const selectedDepthOffset = 30;


// // Function to handle dragging of sprites
// export function onDrag(pointer, gameObject, dragX, dragY) {
//     if (gameObject) {
//         gameObject.x = dragX;
//         gameObject.y = dragY;
//     } else {
//         console.error("gameObject is undefined in onDrag");
//     }
// }

// // Function to handle the end of dragging
// export function onDragEnd(pointer, gameObject) {
//     // Check if the sprite has already been snapped
//     if (gameObject.getData('snapped')) {
//         console.log('Sprite is immovable.');
//         return; // Do not move the sprite if it is immovable
//     }

//     const color = gameObject.name; // "blue" or "red"
//     const snapPoints = snapPositions[color]; // Get the corresponding snap points
//     let closestDistance = Infinity;
//     let closestSnapPoint = null;

//     // Calculate the closest snap point
//     for (const key in snapPoints) {
//         const snapPoint = snapPoints[key];
//         const distance = Phaser.Math.Distance.Between(gameObject.x, gameObject.y, snapPoint.x, snapPoint.y);

//         if (distance < closestDistance) {
//             closestDistance = distance;
//             closestSnapPoint = snapPoint;
//         }
//     }

//     // If within a minimum distance, snap to the closest point
//     const minimumSnapDistance = 50; // Define the minimum distance for snapping
//     if (closestDistance <= minimumSnapDistance) {
//         gameObject.x = closestSnapPoint.x;
//         gameObject.y = closestSnapPoint.y;

//         // Play the snap sound effect
//         playSnapSound({ volume: 0.5 });

//         // Mark the sprite as 'snapped' and disable interactions
//         gameObject.setData('snapped', true);
//         gameObject.input.draggable = false;  // Disable dragging
//         gameObject.disableInteractive();     // Completely disable interaction

//         // Deselect the sprite after snapping
//         clearCurrentlySelectedSprite();
//         removeClickEffect(gameObject);


//         // Log the sprite's depth after snapping to the cell
//         console.log(`Sprite snapped to cell. Depth after snapping: ${gameObject.depth}`);
//     } else {
//         // Return to the initial position if not within snapping range
//         gameObject.x = gameObject.input.dragStartX;
//         gameObject.y = gameObject.input.dragStartY;
//     }

//     // Revert depth to the original value after dragging ends
//     const originalDepth = gameObject.getData('originalDepth');
//     if (originalDepth !== undefined) {
//         gameObject.setDepth(originalDepth);
//     }
// }


// function getPositionFromCellNumber(cellNumber, color) {
//     if (!snapPositions[color]) {
//         console.error(`No snap positions found for color: ${color}`);
//         return null;
//     }
    
//     const cellPosition = snapPositions[color][cellNumber];
//     if (!cellPosition) {
//         console.error(`No snap position found for cell number ${cellNumber} and color ${color}`);
//         return null;
//     }
    
//     return cellPosition;
// }

// // function snapToNearestCell(x, y, sprite) {
// //     // Find the nearest cell and update sprite position
// //     // const snapPosition =    findNearestCell(x, y); // Replace with your actual snapping logic
// //     // // const snapPosition = {x,y};
// //     // sprite.setPosition(snapPosition.x, snapPosition.y);
// //     // sprite.setData('snapped', true); // Mark the sprite as snapped

// //     // // Log the snapped position
// //     // console.log(`Sprite snapped to cell: ${snapPosition.cellNumber}`, snapPosition);

// //     // Clear the selected sprite after snapping
// //     clearCurrentlySelectedSprite();
// //     removeClickEffect(sprite);
// // }


// export function onSpriteClick(sprite, pointer) {
//     console.log(`Sprite clicked: ${sprite.texture.key}, Depth: ${sprite.depth}`);


//     playClickSound({ volume: 0.5 }); // Play the click sound
//     console.log('Sprite clicked:', sprite.name);

//     if (isSpriteSnapped(sprite)) {
//         console.log(`Sprite ${sprite.name} is already snapped and immovable.`);
//         handleSnappedSprite(sprite);
//         return; // Exit if the sprite is already snapped
//     }

//     if (currentlySelectedSprite && currentlySelectedSprite !== sprite) {
//         console.log('Deselecting currently selected sprite:', currentlySelectedSprite.name);
//         deselectSprite(currentlySelectedSprite);
//     }

//     console.log('Toggling selection for sprite:', sprite.name);
//     toggleSpriteSelection(sprite);
// }

// // Check if the sprite is snapped
// function isSpriteSnapped(sprite) {
//     return sprite.getData('snapped');
// }

// // Handle actions for a snapped sprite
// function handleSnappedSprite(sprite) {
//     console.log(`Sprite ${sprite.name} is snapped and cannot be clicked or dragged.`);
//     removeClickEffect(sprite);
//     sprite.setData('clicked', false);
//     currentlySelectedSprite = null; // Clear the currently selected sprite
// }

// function deselectSprite(sprite) {
//     console.log(`Sprite ${sprite.name} is now deselected.`);
//     removeClickEffect(sprite);
//     sprite.setData('clicked', false);
//     clearCurrentlySelectedSprite();

//     // Revert depth to the original value
//     const originalDepth = sprite.getData('originalDepth');
//     if (originalDepth !== undefined) {
//         sprite.setDepth(originalDepth);
//     }

//     // Log the state of the currently selected sprite after deselection
//     const newSelectedSprite = getCurrentlySelectedSprite();
//     console.log('Currently selected sprite after deselection:', newSelectedSprite ? newSelectedSprite.name : 'null');
// }



// // Update the toggleSpriteSelection function to select the sprite
// function toggleSpriteSelection(sprite) {
//     const isSelected = sprite.getData('clicked');

//     if (isSelected) {
//         // Deselect the sprite if it was previously selected
//         deselectSprite(sprite);
//     } else {
//         // Apply click effect and select the sprite
//         applyClickEffect(sprite);
//         sprite.setData('clicked', true);
//         currentlySelectedSprite = sprite;

//         // Store the original depth and set depth for the selected sprite
//         const originalDepth = sprite.depth;
//         sprite.setData('originalDepth', originalDepth);
//         sprite.setDepth(originalDepth + selectedDepthOffset);

//         // Set up a global click listener to handle deselection
//         sprite.scene.input.once('pointerdown', (pointer) => {
//             if (!sprite.getBounds().contains(pointer.x, pointer.y) && !isClickInsideCell(pointer.x, pointer.y)) {
//                 // If the click is outside the sprite and not in a cell, deselect the sprite
//                 deselectSprite(sprite);
//             }
//         });
//     }
// }
// // Utility function to check if a click is inside a cell
// function isClickInsideCell(x, y) {
//     for (const color in snapPositions) {
//         for (const key in snapPositions[color]) {
//             const cellPosition = snapPositions[color][key];
//             const distance = Phaser.Math.Distance.Between(x, y, cellPosition.x, cellPosition.y);
//             if (distance <= snapThreshold) {
//                 return true; // Click is inside a cell
//             }
//         }
//     }
//     return false; // Click is not inside any cell
// }



// // Getter function to access the currently selected sprite
// function getCurrentlySelectedSprite() {
//     return currentlySelectedSprite;
// }

// // Setter function to update the currently selected sprite
// function setCurrentlySelectedSprite(sprite) {
//     currentlySelectedSprite = sprite;
// }

// // Function to clear the currently selected sprite
// function clearCurrentlySelectedSprite() {
//     currentlySelectedSprite = null;
// }


// // Function to toggle the click effect on the sprite
// //edit this fucntion to make hover and click efefeects
// // at same time or disable hover effect when clicked
// // function toggleClickEffect(sprite) {
// //     if (currentlySelectedSprite && currentlySelectedSprite !== sprite) {
// //         // Remove tint from the previously selected sprite
// //         removeClickEffect(currentlySelectedSprite);
// //         currentlySelectedSprite.setData('clicked', false); // Update its 'clicked' state
// //     }

// //     if (sprite.getData('clicked')) {
// //         // Deselect the sprite if it was previously clicked
// //         removeClickEffect(sprite);
// //         sprite.setData('clicked', false);
// //         currentlySelectedSprite = null; // No sprite is currently selected
// //     } else {
// //         // Apply the click effect and select the sprite
// //         applyClickEffect(sprite);
// //         sprite.setData('clicked', true);
// //         currentlySelectedSprite = sprite; // Update the currently selected sprite

// //         // Disable hover effect when clicked
// //         sprite.off('pointerover');
// //         sprite.off('pointerout');
// //     }
// // }
// //ENABLE THIS if YOU WANT BOTH

// function toggleClickEffect(sprite) {
//     if (currentlySelectedSprite && currentlySelectedSprite !== sprite) {
//         removeClickEffect(currentlySelectedSprite);
//         currentlySelectedSprite.setData('clicked', false);
//     }

//     if (sprite.getData('clicked')) {
//         removeClickEffect(sprite);
//         sprite.setData('clicked', false);
//         currentlySelectedSprite = null;
//     } else {
//         applyClickEffect(sprite);
//         sprite.setData('clicked', true);
//         currentlySelectedSprite = sprite;

        
//     }
// }



// // Function to apply a click effect on the sprite
// function applyClickEffect(sprite) {
//     sprite.setTint(0x939393); // Apply a green tint for click effect
// }

// // Function to remove the click effect from the sprite
// function removeClickEffect(sprite) {
//     sprite.clearTint(); // Remove the tint
// }

// export { deselectSprite,isClickInsideCell,getCurrentlySelectedSprite, setCurrentlySelectedSprite, clearCurrentlySelectedSprite, toggleClickEffect, 
//     getPositionFromCellNumber,
//     applyClickEffect, removeClickEffect};


