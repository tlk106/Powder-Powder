import { columns, rows, cellWidth, cellHeight, particles, loop } from "./simulation.js";
import { elements } from "../common/elements.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let isPaused = false; // Track whether the simulation is paused
let lastFrameTime = performance.now();
let fps = 0;

// Move mousemove event listeners outside the render function
canvas.addEventListener("mousemove", (event) => {
  const x = Math.floor(event.clientX / cellWidth);
  const y = Math.floor(event.clientY / cellHeight);
  const infoElement = document.getElementById("info");

  if (particles[x] && particles[x][y]) {
    const particle = particles[x][y];
    const element = elements[particle.type];
    infoElement.innerText = `Element: ${element.name}, Type: ${element.type}`; // Show element properties
  } else {
    infoElement.innerText = "Element: None, Type: None"; // Clear the info text if no particle exists
  }
});

canvas.addEventListener("mousemove", (event) => {
  const x = Math.floor(event.clientX / cellWidth);
  const y = Math.floor(event.clientY / cellHeight);
  const infoElement = document.getElementById("mouseLocation");

  infoElement.innerText = `Mouse Location: (${x}, ${y})`;
});

const render = () => {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, 50); // Clear the top area for info
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Display FPS
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`FPS: ${fps.toFixed(1)}`, 10, 50);

  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      const particle = particles[x][y];
      if (particle) {
        ctx.fillStyle = elements[particle.type].color;
        ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
      }
    }
  }
};

const gameLoop = () => {
  const currentFrameTime = performance.now();
  fps = 1000 / (currentFrameTime - lastFrameTime);
  lastFrameTime = currentFrameTime;

  if (!isPaused) {
    loop(); // Update simulation only when not paused
  }
  render(); // Always render, even when paused
  requestAnimationFrame(gameLoop);
};

// Add an event listener for the spacebar to toggle pause
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    isPaused = !isPaused; // Toggle the paused state
  }
});

gameLoop();