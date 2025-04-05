import { cellWidth, cellHeight } from "./simulation.js";

const canvas = document.getElementById("gameCanvas");

// Function to convert mouse position to grid position
const getGridPosition = (mouseX, mouseY) => {
  const gridX = Math.floor(mouseX / cellWidth);
  const gridY = Math.floor(mouseY / cellHeight);
  return { gridX, gridY };
};

// Add event listener to capture mouse position
canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const { gridX, gridY } = getGridPosition(mouseX, mouseY);

  console.log(`Mouse is over grid cell: (${gridX}, ${gridY})`);
});

export { getGridPosition };