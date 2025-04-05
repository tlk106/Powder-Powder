import { getGridPosition } from "./mouseHandler.js";

const screenWidth = window.innerWidth; // Full screen width
const screenHeight = window.innerHeight; // Full screen height

const columns = 190; // Number of columns
const rows = 100; // Number of rows

const cellWidth = screenWidth / columns; // Width of each cell
const cellHeight = screenHeight / rows; // Height of each cell

// Initialize the particles array
const particles = Array.from({ length: columns }, () => Array(rows).fill(null));

// Function to spawn a particle at the clicked position
const spawnParticle = (x, y) => {
    if (y < rows) {
        particles[x][y] = true; // Mark the position as occupied by a particle
    }
};

// Function to update the particles' positions
const loop = () => {
    for (let x = 0; x < columns; x++) {
        for (let y = rows - 1; y >= 0; y--) { // Start from the bottom row
            if (particles[x][y]) { // If there's a particle at this position
                const belowY = y + 1;
                const leftX = x - 1;
                const rightX = x + 1;

                // Check if the space below is empty
                if (belowY < rows && !particles[x][belowY]) {
                    particles[x][y] = null; // Clear the current position
                    particles[x][belowY] = true; // Move the particle down
                } 
                // Check if the left position is empty
                else if (leftX >= 0 && !particles[leftX][y] && belowY < rows && !particles[leftX][belowY]) {
                    particles[x][y] = null; // Clear the current position
                    particles[leftX][y] = true; // Move the particle left
                } 
                // Check if the right position is empty
                else if (rightX < columns && !particles[rightX][y] && belowY < rows && !particles[rightX][belowY]) {
                    particles[x][y] = null; // Clear the current position
                    particles[rightX][y] = true; // Move the particle right
                }
            }
        }
    }
    getGridPosition(); // Call the function to get the grid position (if needed)
};

// Function to capture mouse input
const captureMouseInput = () => {
    document.addEventListener('click', (event) => {
        const x = Math.floor(event.clientX / cellWidth); // Calculate column index
        const y = Math.floor(event.clientY / cellHeight); // Calculate row index
        spawnParticle(x, y); // Spawn a particle at the clicked position
    });
};

// Call the function to start capturing mouse input
captureMouseInput();

export { columns, rows, cellWidth, cellHeight, particles, spawnParticle, loop, captureMouseInput };