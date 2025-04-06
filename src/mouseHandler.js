import { cellWidth, cellHeight, spawnParticle } from "./simulation.js";
import { elements } from "../common/elements.js";

const canvas = document.getElementById("gameCanvas");

let isMouseDown = false;
let selectedElement = "powder"; // Default element

const getGridPosition = (mouseX, mouseY) => {
  const gridX = Math.floor(mouseX / cellWidth);
  const gridY = Math.floor(mouseY / cellHeight);
  return { gridX, gridY };
};

canvas.addEventListener("mousedown", (event) => {
  isMouseDown = true;
  spawnAtMouse(event);
});

canvas.addEventListener("mouseup", () => {
  isMouseDown = false;
});

canvas.addEventListener("mousemove", (event) => {
  if (isMouseDown) {
    spawnAtMouse(event);
  }
});

const spawnAtMouse = (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const { gridX, gridY } = getGridPosition(mouseX, mouseY);
  spawnParticle(gridX, gridY, selectedElement);
};

// Add a way to change the selected element (e.g., keyboard shortcuts)
document.addEventListener("keydown", (event) => {
  const elementKeys = {
    "1": "powder",
    "2": "water",
    "3": "sand", // Ensure "sand" exists in elements.js
  };

  if (elementKeys[event.key] && elements[elementKeys[event.key]]) {
    selectedElement = elementKeys[event.key];
  }
});

export { getGridPosition };