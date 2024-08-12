// Import the spritesData
import spritesData from './positions/sprites.json';

// Define layer depths for S, M, and L
export const layerDepths = {
    'S': 10,
    'M': 20,
    'L': 30
};

// Define the initial cell states
const initialCellState = {
    "cell1": [],
    "cell2": [],
    "cell3": [],
    "cell4": [],
    "cell5": [],
    "cell6": [],
    "cell7": [],
    "cell8": [],
    "cell9": []
};

// // 1. Initializing the Cells on Game Reload
// // Function to initialize cells on game reload
// function initializeCells() {
//     writeJSONToFile('positions/cellState.json', initialCellState);
// }

// initializeCells();

// // 2. Updating the JSON File on Sprite Placement
// // Function to update cell data in the JSON file
// function updateCellData(cellNumber, sprite) {
//     // Read the current state from the JSON file
//     const cellState = readJSONFromFile('positions/cellState.json');

//     // Ensure the cell exists in the state
//     if (!cellState[`cell${cellNumber}`]) {
//         cellState[`cell${cellNumber}`] = [];
//     }

//     // Add the sprite to the cell stack
//     cellState[`cell${cellNumber}`].push({
//         name: sprite.name,
//         color: sprite.color,
//         priority: sprite.priority
//     });

//     // Write the updated state back to the JSON file
//     writeJSONToFile('positions/cellState.json', cellState);
// }

// // 3. Reading and Writing JSON Files
// const fs = require('fs');

// // Function to read JSON from a file
// function readJSONFromFile(fileName) {
//     try {
//         const data = fs.readFileSync(fileName, 'utf8');
//         return JSON.parse(data);
//     } catch (err) {
//         console.error("Error reading JSON file:", err);
//         return {};
//     }
// }

// // Function to write JSON to a file
// function writeJSONToFile(fileName, data) {
//     try {
//         fs.writeFileSync(fileName, JSON.stringify(data, null, 2), 'utf8');
//     } catch (err) {
//         console.error("Error writing JSON file:", err);
//     }
// }

// export { updateCellData };
