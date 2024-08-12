// import { onDrag, enableDragAndSnap} from "./game";
import  {onDrag, onDragEnd,onSpriteClick} from "./game";
import { applyClickEffect, removeClickEffect, toggleClickEffect } from "./game";
import {setCurrentlySelectedSprite,getCurrentlySelectedSprite, clearCurrentlySelectedSprite} from './game';
import {getPositionFromCellNumber} from './game';
import { isClickInsideCell, deselectSprite } from "./game";
import { layerDepths, getSpritesInCell,placeSpriteOnTop } from "./gameLogic";

//import spritesData from './positions/sprites.json'

// import { currentlySelectedSprite } from "./game";


//imprt soundManager.js
import {preloadSounds, createSounds, playClickSound,playSnapSound} from './SoundManager';

const config = {
  type: Phaser.AUTO,
  width: 1300,  // Canvas width
  height: 700, // Canvas height
  parent: 'game-container', // Place the canvas inside the game-container div
  scene: {
      preload: preload,
      create: create
  }
};


const game = new Phaser.Game(config);

const gridSize = 3;
const gridWidth = 360;  // Fixed width for the grid
const gridHeight = 360; // Fixed height for the grid
const cellSize = gridWidth / gridSize; // Calculate the size of each cell

const playerWidth = 500;  // Width for player 1 grid
const playerHeight = 600; // Height for player 1 grid

const defaultColor = getComputedStyle(document.documentElement).getPropertyValue('--cell-default-color').trim();
const hoverColor = getComputedStyle(document.documentElement).getPropertyValue('--cell-hover-color').trim();
const borderColorHover = getComputedStyle(document.documentElement).getPropertyValue('--cell-border-color').trim();

// let currentlySelectedSprite = null; // To track the currently selected sprite
// export let currentlySelectedSprite = null; // To track the currently selected sprite

export function preload() {

  preloadSounds(this);

  // Preload any assets here
  this.load.image('background', './assets/canvabg.jpg');
  this.load.image('player1Image', './assets/players/board.png'); 
  this.load.image('player2Image', './assets/players/board.png');
  //load snapPositions and sprutes prior to the sprites
  this.load.json('snapPositions', './positions/snapPositions.json');
  this.load.json('sprites', './positions/sprites.json');

  //BLUE
  this.load.image('S1_blue', './assets/images/S_blue.png');
  this.load.image('S2_blue', './assets/images/S_blue.png');
  this.load.image('S3_blue', './assets/images/S_blue.png');
  this.load.image('M1_blue', './assets/images/M_blue.png');
  this.load.image('M2_blue', './assets/images/M_blue.png');
  this.load.image('M3_blue', './assets/images/M_blue.png');
  this.load.image('L1_blue', './assets/images/L_blue.png');
  this.load.image('L2_blue', './assets/images/L_blue.png');
  this.load.image('L3_blue', './assets/images/L_blue.png');
//RED 
  this.load.image('S1_red', './assets/images/S_red.png');
  this.load.image('S2_red', './assets/images/S_red.png');
  this.load.image('S3_red', './assets/images/S_red.png');
  this.load.image('M1_red', './assets/images/M_red.png');
  this.load.image('M2_red', './assets/images/M_red.png');
  this.load.image('M3_red', './assets/images/M_red.png');
  this.load.image('L1_red', './assets/images/L_red.png');
  this.load.image('L2_red', './assets/images/L_red.png');
  this.load.image('L3_red', './assets/images/L_red.png');
  }

export function create() {

  createSounds(this);
// Add this global pointerdown listener in your scene's create method or wherever appropriate
  this.input.on('pointerdown', handlePointerDown);


  // Load the snapPositions JSON file
  const snapPositions = this.cache.json.get('snapPositions');
  // Load the sprites data from JSON
  const spritesData = this.cache.json.get('sprites');
  console.log('Sprites Data:', spritesData);
  
  const maskGraphics = this.add.graphics();

  // Add the background image and set it to cover the entire canvas
  const background = this.add.image(config.width / 2, config.height / 2, 'background');
  background.setDisplaySize(config.width, config.height);  // Scale the background to fit the canvas
  background.setAlpha(0.8); // Make the background slightly transparent

  function setupCone(cone) {


    cone.setInteractive({ draggable: true })
        .on('drag', (pointer, dragX, dragY) => onDrag(pointer, cone, dragX, dragY))
        .on('dragend', (pointer) => onDragEnd(pointer, cone, snapPositions))
        .on('pointerdown', (pointer) => onSpriteClick(cone, pointer)); // Use `onSpriteClick` for handling clicks

    applyHoverEffect(cone);
    removeHoverEffect(cone);

    // Set the depth based on the layer

}

  // Center the grid within the canvas
  const startX = (config.width - gridWidth) / 2;
  const startY = (config.height - gridHeight) / 2 + 50; // Offset the grid vertically by 50 pixels

  const gridLabels = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9'
  ];
  
  // Create a 3x3 grid of cells
  for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
          const x = startX + col * cellSize + cellSize / 2;
          const y = startY + row * cellSize + cellSize / 2;

          // Create each cell as a rectangle
          const cell = this.add.rectangle(x, y, cellSize, cellSize, Phaser.Display.Color.HexStringToColor(defaultColor).color)
              .setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(borderColorHover).color)
              .setOrigin(0.5)
              .setInteractive();

          // Add event listeners to handle interactions
          cell.on('pointerover', function () {
              this.setFillStyle(Phaser.Display.Color.HexStringToColor(hoverColor).color); // Change color on hover
          });
          cell.on('pointerout', function () {
              this.setFillStyle(Phaser.Display.Color.HexStringToColor(defaultColor).color); // Revert color when not hovering
          });

          // Handle cell click
          cell.on('pointerdown', (pointer) => {
            handleCellClick(pointer, row, col); // Adjust arguments if necessary
          });

      }
  }

    const x_margin = 5;//offset from the edge of the canvas
    const y_margin = 10;
    const coneContainerDepth = 1; // Cmmom Depth for the player containers

  
    //PLAYER 1 CONTAINER
    const player1Container = this.add.container();
    player1Container.setPosition(playerWidth / 2 + x_margin, config.height / 2 + y_margin); // Set container position
    const player1Image = this.add.image(0, 0, 'player1Image');
    player1Image.setDisplaySize(playerWidth, playerHeight); // Set the image size
    player1Image.setOrigin(0.5); // Center the image on its coordinates
    player1Container.add(player1Image);
    player1Container.setDepth(coneContainerDepth); // Set the depth of the container

  //Create container for blue cones
  const blueConeContainer = this.add.container();
  player1Container.add(blueConeContainer);
  blueConeContainer.setDepth(coneContainerDepth); // Set the depth of the container
    // Bring blueConeContainer to the top
  // blueConeContainer.bringToTop();

  //Claculate positions for the blue cones of 3x3 grid
  const coneSize = 95; //sizeof each cone sprite
  const gridoffset = 110; //offset from the edge of the grid
  const startXCones = -(playerWidth / 2) + coneSize/2 +  gridoffset;
  const startYCones = -(playerHeight / 2) + coneSize/2 + gridoffset+50;

    // const blueSprites = [
    //   'S1_blue', 'S2_blue', 'S3_blue',
    //   'M1_blue', 'M2_blue', 'M3_blue',
    //   'L1_blue', 'L2_blue', 'L3_blue'
    // ];

    // const blueSprites = spritesData.blueSprites.map(sprite=> sprite.key)
  const blueSprites = spritesData.blueSprites;
  console.log('Blue Sprites:', blueSprites);

  let index=0;
  const rowOffset = 25; //offset between rows
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const x = startXCones + col * coneSize;
      const y = startYCones + row * coneSize + row*rowOffset;

      const spriteData = blueSprites[index];
      const spriteKey = spriteData.key;
      const layer = spriteData.layer;
  
      const cone = this.add.image(x, y, spriteKey);
  
      cone.setDisplaySize(coneSize, coneSize);
      cone.setOrigin(0.5);
      cone.setName('blue');

    // Set depth based on layer
    const depth = layerDepths[layer];
    cone.setDepth(depth);
    console.log(`Depth for ${spriteKey} set to ${depth}`);
    blueConeContainer.add(cone);

      setupCone.call(this, cone); 
      index++;
    }
  }

  // Create and position text separately
    const player1Text = this.add.text(0, -playerHeight / 2 + 65, 'Player 1', {
      fontFamily: 'woodfont', // Font family
      fontSize: '50px',
      fontWeight: 'bold', // Font weight for bold text
      fill: '#008bff', // Text color
      align: 'center' // Text alignment
    });
    player1Text.setOrigin(0.5, 0); // Center horizontally and align text to the top
    player1Container.add(player1Text);
    player1Text.setStroke("#ffffff",1);
  


  // PLAYER 2 CONTAINER
  const player2Container = this.add.container();
  player2Container.setPosition(config.width - playerWidth / 2 - x_margin, config.height / 2 + y_margin); // Set container position
  player2Container.setDepth(coneContainerDepth); // Set the depth of the container

  // Add image to the Player 2 container
  const player2Image = this.add.image(0, 0, 'player2Image');
  player2Image.setDisplaySize(playerWidth, playerHeight); // Set the image size
  player2Image.setOrigin(0.5); // Center the image on its coordinates
  player2Container.add(player2Image);

  // Create container for red cones
  const redConeContainer = this.add.container();
  player2Container.add(redConeContainer);
  redConeContainer.setDepth(coneContainerDepth); // Set the depth of the container
  // Calculate positions for the red cones of 3x3 grid
  const startXConesRed = -(playerWidth / 2) + coneSize/2 +  gridoffset;
  const startYConesRed = -(playerHeight / 2) + coneSize/2 + gridoffset+50;

  // const redSprites = [
  //   'S1_red', 'S2_red', 'S3_red',
  //   'M1_red', 'M2_red', 'M3_red',
  //   'L1_red', 'L2_red', 'L3_red'
  // ];
const redSprites = spritesData.redSprites;
let indexRed = 0;

for (let row = 0; row < gridSize; row++) {
  for (let col = 0; col < gridSize; col++) {
    const x = startXConesRed + col * coneSize;
    const y = startYConesRed + row * coneSize + row * rowOffset;

    const spriteData = redSprites[indexRed];
    const spriteKey = spriteData.key;
    const layer = spriteData.layer;

    const cone = this.add.image(x, y, spriteKey);

    cone.setDisplaySize(coneSize, coneSize);
    cone.setOrigin(0.5);
    cone.setName('red');

    // Set depth based on layer
    const depth = layerDepths[layer];
    cone.setDepth(depth);
    console.log(`Depth for ${spriteKey} set to ${depth}`);
   


    redConeContainer.add(cone);

    setupCone.call(this, cone);
    indexRed++;
  }
}
    
  // Create and position text separately
  const player2Text = this.add.text(0, -playerHeight / 2 + 65, 'Player 2', {
    fontFamily: 'woodfont', // Font family

    fontSize: '50px',
    fontWeight: 'bold', // Font weight for bold text
    fill: '#ff2600  ', // Text color
    align: 'center' // Text alignment
  });
  player2Text.setOrigin(0.5, 0); // Center horizontally and align text to the top
  player2Container.add(player2Text);
  // Apply a shadow to the text to create a glowing effect
  player2Text.setShadow(0, 0, '#ffffff', 10, false,false);
  player2Text.setStroke("#ffffff",1);

// // Example for setting up sprites
// blueSprites.forEach((spriteData, index) => {
//   const x = startXCones + (index % gridSize) * coneSize;
//   const y = startYCones + Math.floor(index / gridSize) * coneSize + Math.floor(index / gridSize) * rowOffset;

//   const cone = this.add.image(x, y, spriteData.key);
//   cone.name = spriteData.key;
//   cone.layer = spriteData.layer;  // Attach the layer information to the cone
//   console.log('layer for cone:', cone.layer);

//   setupCone.call(this, cone);  // Pass the cone to the setup function
//   blueConeContainer.add(cone); // Assuming you want to add it to a container
// });


// redSprites.forEach((spriteData, index) => {
//   const x = startXCones + (index % gridSize) * coneSize; // Adjust this if the red cones should be placed differently
//   const y = startYCones + Math.floor(index / gridSize) * coneSize + Math.floor(index / gridSize) * rowOffset;

//   const cone = this.add.image(x, y, spriteData.key);
//   cone.name = spriteData.key;
//   cone.layer = spriteData.layer;  // Attach the layer information to the cone
//   console.log('layer for cone:', cone.layer);

//   setupCone.call(this, cone);  // Pass the cone to the setup function
//   redConeContainer.add(cone); // Assuming you want to add it to a container
// });

}


// function handleSpriteClick(sprite, pointer) {
//   toggleClickEffect(sprite);
//   clearCurrentlySelectedSprite(); // Clear previous selection
//   setCurrentlySelectedSprite(sprite); // Set the clicked sprite as the current selection

//   console.log('Sprite clicked:', sprite.name);

//   // Get the click position relative to the grid
//   const gridPosition = getCellNumberFromPosition(pointer.x, pointer.y);

//   // Log the clicked position and cell number
//   console.log('Clicked position:', { x: pointer.x, y: pointer.y });
//   console.log('Clicked cell number:', gridPosition);

//   if (gridPosition !== null) {
//       // Get the snapping position from JSON
//       const cellPosition = getPositionFromCellNumber(gridPosition, sprite.name); // Call the function to get the position

//       if (cellPosition) {
//           sprite.setPosition(cellPosition.x, cellPosition.y); // Snap sprite to the cell position
//           console.log(`Sprite snapped to position ${gridPosition}:`, cellPosition);
//       } else {
//           console.log(`No snap position found for cell number ${gridPosition}`);
//       }
//   }
// }




// Function to apply a glow effect on hover
function applyHoverEffect(sprite) {
  sprite.on('pointerover', function () {
    if (!sprite.getData('clicked')) { // Only apply hover effect if not clicked
      this.setTint('0x939393'); // Apply a glow tint for hover effect
    }
  });
}
// Function to remove the glow effect when not hovering
function removeHoverEffect(sprite) {
  sprite.on('pointerout', function () {
    if (!sprite.getData('clicked')) { // Only remove tint if not clicked
      this.clearTint(); // Remove the tint when not hovering
    }
  });
}


function handleCellClick(pointer, row, col) {
  const cellNumber = row * gridSize + col + 1;
  console.log('Cell clicked:', cellNumber);
  console.log('Click coordinates:', { x: pointer.x, y: pointer.y });

  const selectedSprite = getCurrentlySelectedSprite(); // Retrieve the currently selected sprite
  console.log('Selected sprite:', selectedSprite);

  if (selectedSprite) {
      const color = selectedSprite.name; // "blue" or "red"
      console.log('Sprite color:', color);

      const cellPosition = getPositionFromCellNumber(cellNumber, color); // Get the snap position from JSON
      console.log('Cell position from snapPositions:', cellPosition);

      if (cellPosition) {
          selectedSprite.setPosition(cellPosition.x, cellPosition.y);
          console.log(`Sprite snapped to cell ${cellNumber}:`, cellPosition);

          playSnapSound({ volume: 0.5 }); // Play the snap sound

          // Disable dragging and clicking for the sprite
          selectedSprite.input.draggable = false; // Disable dragging
          selectedSprite.disableInteractive(); // Disable clicking

          // Deselect the sprite
          clearCurrentlySelectedSprite();
          removeClickEffect(selectedSprite);
      } else {
          console.log(`No snap position found for cell number ${cellNumber}`);
      }
  } else {
      console.log('No sprite selected');
  }
}

function handlePointerDown(pointer) {
  // Get the currently selected sprite
  const currentlySelectedSprite = getCurrentlySelectedSprite();
  
  // Log the currently selected sprite
  console.log('Currently selected sprite:', currentlySelectedSprite ? currentlySelectedSprite.name : 'null');
  
  // If there's no currently selected sprite, do nothing
  if (!currentlySelectedSprite) return;

  // Check if the click is inside the currently selected sprite
  const spriteBounds = currentlySelectedSprite.getBounds();
  const clickInsideSprite = spriteBounds.contains(pointer.x, pointer.y);

  // Check if the click is inside any cell
  const clickInsideCell = isClickInsideCell(pointer.x, pointer.y);

  // If the click is neither inside the sprite nor inside a cell, deselect the sprite
  if (!clickInsideSprite && !clickInsideCell) {
      console.log(`Sprite ${currentlySelectedSprite.name} is now deselected.`);
      deselectSprite(currentlySelectedSprite);
  } else {
      // Optionally log if click is inside the sprite or cell
      console.log('Click is inside sprite or cell.');
  }
}

