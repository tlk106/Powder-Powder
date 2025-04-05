import { columns, rows, cellWidth, cellHeight, particles, particle, loop } from "./simulation.js";
import { powder } from "../common/elements.js";
import { getGridPosition } from "./mouseHandler.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const render = () => {
  // Fill the entire canvas with black
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the single particle on top of the black background
  if (particles[particle.x][particle.y]) {
    ctx.fillStyle = powder.color; // Use the particle's color
    ctx.fillRect(particle.x * cellWidth, particle.y * cellHeight, cellWidth, cellHeight);
  }
};

const gameLoop = () => {
  loop(); // Update particle position
  render(); // Render updated state
  requestAnimationFrame(gameLoop); // Schedule the next frame
};

// Start the game loop
gameLoop();