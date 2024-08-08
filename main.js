// import { onDrag, enableDragAndSnap} from "./game";
import  {onDrag, onDragEnd,onSpriteClick, snapToNearestCell} from "./game";
import { applyClickEffect, removeClickEffect, toggleClickEffect } from "./game";
import {setCurrentlySelectedSprite,getCurrentlySelectedSprite, clearCurrentlySelectedSprite} from './game';
import {getPositionFromCellNumber} from './game';
// import { currentlySelectedSprite } from "./game";

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

function preload() {
  // Preload any assets here
  this.load.image('background', './assets/canvabg.jpg');
  this.load.image('player1Image', './assets/players/board.png'); 
  this.load.image('player2Image', './assets/players/board.png');
  //load snapPositions.json file 
  this.load.json('snapPositions', './positions/snapPositions.json');

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

function create() {
  // Load the snapPositions JSON file
  const snapPositions = this.cache.json.get('snapPositions');
  const maskGraphics = this.add.graphics();

  // Add the background image and set it to cover the entire canvas
  const background = this.add.image(config.width / 2, config.height / 2, 'background');
  background.setDisplaySize(config.width, config.height);  // Scale the background to fit the canvas
  background.setAlpha(0.8); // Make the background slightly transparent
   
  function setupCone(cone) {
    cone.setInteractive({ draggable: true })
        .on('drag', (pointer, dragX, dragY) => onDrag(pointer, cone, dragX, dragY))
        .on('dragend', (pointer) => onDragEnd(pointer, cone, snapPositions));

    applyHoverEffect(cone);
    removeHoverEffect(cone);

    // Handle sprite clicks
    cone.on('pointerdown', (pointer) => handleSpriteClick(cone, pointer));}

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
  
    //PLAYER 1 CONTAINER
    const player1Container = this.add.container();
    player1Container.setPosition(playerWidth / 2 + x_margin, config.height / 2 + y_margin); // Set container position
    const player1Image = this.add.image(0, 0, 'player1Image');
    player1Image.setDisplaySize(playerWidth, playerHeight); // Set the image size
    player1Image.setOrigin(0.5); // Center the image on its coordinates
    player1Container.add(player1Image);

  //Create container for blue cones
  const blueConeContainer = this.add.container();
  player1Container.add(blueConeContainer);
    // Bring blueConeContainer to the top
    blueConeContainer.bringToTop();

  //Claculate positions for the blue cones of 3x3 grid
  const coneSize = 95; //sizeof each cone sprite
  const gridoffset = 110; //offset from the edge of the grid
  const startXCones = -(playerWidth / 2) + coneSize/2 +  gridoffset;
  const startYCones = -(playerHeight / 2) + coneSize/2 + gridoffset+50;

  const blueSprites = [
    'S1_blue', 'S2_blue', 'S3_blue',
    'M1_blue', 'M2_blue', 'M3_blue',
    'L1_blue', 'L2_blue', 'L3_blue'
  ];

  let index=0;
  const rowOffset = 25; //offset between rows
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const x = startXCones + col * coneSize;
      const y = startYCones + row * coneSize + row*rowOffset;
      const spriteKey = blueSprites[index];
      const cone = this.add.image(x, y, spriteKey);
  
      cone.setDisplaySize(coneSize, coneSize);
      cone.setOrigin(0.5);
      cone.setName('blue');

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

  // Add image to the Player 2 container
  const player2Image = this.add.image(0, 0, 'player2Image');
  player2Image.setDisplaySize(playerWidth, playerHeight); // Set the image size
  player2Image.setOrigin(0.5); // Center the image on its coordinates
  player2Container.add(player2Image);

  // Create container for red cones
  const redConeContainer = this.add.container();
  player2Container.add(redConeContainer);

  // Calculate positions for the red cones of 3x3 grid
  const startXConesRed = -(playerWidth / 2) + coneSize/2 +  gridoffset;
  const startYConesRed = -(playerHeight / 2) + coneSize/2 + gridoffset+50;

  const redSprites = [
    'S1_red', 'S2_red', 'S3_red',
    'M1_red', 'M2_red', 'M3_red',
    'L1_red', 'L2_red', 'L3_red'
  ];

  let indexRed=0;
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const x = startXConesRed + col * coneSize;
      const y = startYConesRed + row * coneSize + row*rowOffset;
      const spriteKey = redSprites[indexRed];
      const cone = this.add.image(x, y, spriteKey);

      cone.setDisplaySize(coneSize, coneSize);
      cone.setOrigin(0.5);
      cone.setName('red');
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

      // Loop through and set up blue sprites
      blueSprites.forEach(spriteData => {
        const cone = this.add.image(spriteData.x, spriteData.y, spriteData.key);
        cone.name = spriteData.name;
        setupCone.call(this, cone);
    });

    // Loop through and set up red sprites
    redSprites.forEach(spriteData => {
        const cone = this.add.image(spriteData.x, spriteData.y, spriteData.key);
        cone.name = spriteData.name;
        setupCone.call(this, cone);
    });
}

// Function to apply a glow effect on hover
function applyHoverEffect(sprite) {
  sprite.on('pointerover', function () {
    if (!sprite.getData('clicked')) { // Only apply hover effect if not clicked
      this.setTint(0xb9bab9); // Apply a glow tint for hover effect
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


function getCellNumberFromPosition(x, y) {
  const startX = (config.width - gridWidth) / 2;
  const startY = (config.height - gridHeight) / 2 + 50; // Offset the grid vertically by 50 pixels

  // Check each cell to find the one that contains the (x, y) position
  for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
          const cellX = startX + col * cellSize + cellSize / 2;
          const cellY = startY + row * cellSize + cellSize / 2;

          // Check if the (x, y) position is within this cell
          if (x >= cellX - cellSize / 2 && x <= cellX + cellSize / 2 &&
              y >= cellY - cellSize / 2 && y <= cellY + cellSize / 2) {
              // Return cell number (1 to 9)
              return row * gridSize + col + 1;
          }
      }
  }
  // Return null if no cell contains the (x, y) position
  return null;
}



function handleSpriteClick(sprite, pointer) {
  toggleClickEffect(sprite);
  clearCurrentlySelectedSprite(); // Clear previous selection
  setCurrentlySelectedSprite(sprite); // Set the clicked sprite as the current selection

  console.log('Sprite clicked:', sprite.name);

  // Get the click position relative to the grid
  const gridPosition = getCellNumberFromPosition(pointer.x, pointer.y);

  // Log the clicked position and cell number
  console.log('Clicked position:', { x: pointer.x, y: pointer.y });
  console.log('Clicked cell number:', gridPosition);

  if (gridPosition !== null) {
      // Get the snapping position from JSON
      const cellPosition = getPositionFromCellNumber(gridPosition, sprite.name); // Call the function to get the position

      if (cellPosition) {
          sprite.setPosition(cellPosition.x, cellPosition.y); // Snap sprite to the cell position
          console.log(`Sprite snapped to position ${gridPosition}:`, cellPosition);
      } else {
          console.log(`No snap position found for cell number ${gridPosition}`);
      }
  }
}


// Variables to track click positions
let previousClickPosition = null;
let currentClickPosition = null;
let clickCount = 0; // To count the number of clicks
let selectedSprite = null; // To track the currently selected sprite


// without this the cell number is not being displayed
// Function to handle cell clicks
function handleCellClick(pointer, row, col) {
  const cellNumber = row * gridSize + col + 1;
  console.log('Cell clicked:', cellNumber);
  console.log('Click coordinates:', { x: pointer.x, y: pointer.y });

  const selectedSprite = getCurrentlySelectedSprite(); // Retrieve the currently selected sprite
  console.log('Selected sprite:', selectedSprite);

  if (selectedSprite) {
      const color = selectedSprite.name; // "blue" or "red"
      console.log('Sprite color:', color);

      // Get the snap position using the getPositionFromCellNumber function
      const cellPosition = getPositionFromCellNumber(cellNumber, color);
      console.log('Cell position from snapPositions:', cellPosition);

      if (cellPosition) {
          selectedSprite.setPosition(cellPosition.x, cellPosition.y);
          console.log(`Sprite snapped to cell ${cellNumber}:`, cellPosition);
      } else {
          console.log(`No snap position found for cell number ${cellNumber}`);
      }
  } else {
      console.log('No sprite selected');
  }
}

