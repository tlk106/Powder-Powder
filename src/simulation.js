const screenWidth = window.innerWidth; // Full screen width
const screenHeight = window.innerHeight; // Full screen height
import { getGridPosition } from "./mouseHandler.js";

const columns = 190; // Number of columns
const rows = 100; // Number of rows

const cellWidth = screenWidth / columns; // Width of each cell
const cellHeight = screenHeight / rows; // Height of each cell

// Initialize the particles array
const particles = Array.from({ length: columns }, () => Array(rows).fill(null));

// Define a single particle
const particle = { x: Math.floor(columns / 2), y: 0 }; // Start in the middle of the grid

// Place the particle in the particles array
particles[particle.x][particle.y] = true;

// Function to update the particle's position
const loop = () => {
    if (particle.y < rows - 1) {
        particles[particle.x][particle.y] = null; // Clear the current position
        particle.y += 1; // Move the particle down
        particles[particle.x][particle.y] = true; // Set the new position
        getGridPosition(); // Call the function to get the grid position
    }
};

// Function to capture mouse input
const captureMouseInput = () => {
    document.addEventListener('click', (event) => {
        
    });
};

// Call the function to start capturing mouse input
captureMouseInput();

export { columns, rows, cellWidth, cellHeight, particles, particle, loop, captureMouseInput };