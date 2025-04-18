import { cellWidth, cellHeight, spawnParticle } from "./simulation.js";
import { elements } from "../common/elements.js";

const canvas = document.getElementById("gameCanvas");

let isMouseDown = false;
let selectedElement = "powder"; // Default element
let currentMouseButton = null; // Track which mouse button is pressed
let cursorRadius = 0; // Default radius for spawning particles

const getGridPosition = (mouseX, mouseY) => {
  const gridX = Math.floor(mouseX / cellWidth);
  const gridY = Math.floor(mouseY / cellHeight);
  return { gridX, gridY };
};

canvas.addEventListener("mousedown", (event) => {
  isMouseDown = true;
  currentMouseButton = event.button; // Track which button is pressed
  handleMouseAction(event);
});

canvas.addEventListener("mouseup", () => {
  isMouseDown = false;
  currentMouseButton = null; // Reset the button state
});

canvas.addEventListener("mousemove", (event) => {
  if (isMouseDown) {
    handleMouseAction(event);
  }
});

const handleMouseAction = (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const { gridX, gridY } = getGridPosition(mouseX, mouseY);

  for (let dx = -cursorRadius; dx <= cursorRadius; dx++) {
    for (let dy = -cursorRadius; dy <= cursorRadius; dy++) {
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= cursorRadius) {
        const targetX = gridX + dx;
        const targetY = gridY + dy;

        if (targetX >= 0 && targetX < 190 && targetY >= 0 && targetY < 100) {
          if (currentMouseButton === 2) { // Right-click for erase mode
            spawnParticle(targetX, targetY, null); // Erase particle
          } else if (currentMouseButton === 0) { // Left-click for placing particles
            spawnParticle(targetX, targetY, selectedElement); // Spawn selected element
          }
        }
      }
    }
  }
};

// Prevent the context menu from appearing on right-click
canvas.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

document.addEventListener("keydown", (event) => {
  const elementKeys = {
    "1": "powder",
    "2": "water",
    "3": "oxygen",
    "4": "stone",
    "5": "oil",
  };

  if (elementKeys[event.key] && elements[elementKeys[event.key]]) {
    selectedElement = elementKeys[event.key];
  }

  // Adjust cursor radius with '+' and '-' keys
  if (event.key === "+") {
    cursorRadius = Math.min(cursorRadius + 1, 10); // Limit max radius to 10
  } else if (event.key === "-") {
    cursorRadius = Math.max(cursorRadius - 1, 0); // Limit min radius to 1
  }
});

export { getGridPosition };