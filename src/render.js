import { columns, rows, cellWidth, cellHeight, particles, loop } from "./simulation.js";
import { powder } from "../common/elements.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const render = () => {
  // Fill the entire canvas with black
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw all particles on top of the black background
  ctx.fillStyle = powder.color; // Use the particle's color
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      if (particles[x][y]) {
        ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
      }
    }
  }
};

const gameLoop = () => {
  loop(); // Update particle positions
  render(); // Render updated state
  requestAnimationFrame(gameLoop); // Schedule the next frame
};

// Start the game loop
gameLoop();