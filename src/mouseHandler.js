import { cellWidth, cellHeight, spawnParticle } from "./simulation.js";

const canvas = document.getElementById("gameCanvas");

let isMouseDown = false; // Track whether the mouse button is held down

// Function to convert mouse position to grid position
const getGridPosition = (mouseX, mouseY) => {
  const gridX = Math.floor(mouseX / cellWidth);
  const gridY = Math.floor(mouseY / cellHeight);
  return { gridX, gridY };
};

// Add event listeners for mouse actions
canvas.addEventListener("mousedown", (event) => {
  isMouseDown = true;
  spawnAtMouse(event); // Spawn a particle immediately when the mouse is pressed
});

canvas.addEventListener("mouseup", () => {
  isMouseDown = false; // Stop spawning when the mouse button is released
});

canvas.addEventListener("mousemove", (event) => {
  if (isMouseDown) {
    spawnAtMouse(event); // Continuously spawn particles while the mouse is held down
  }
});

// Function to spawn a particle at the mouse position
const spawnAtMouse = (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const { gridX, gridY } = getGridPosition(mouseX, mouseY);
  spawnParticle(gridX, gridY); // Spawn a particle at the calculated grid position
};

export { getGridPosition };