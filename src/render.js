import { columns, rows, cellWidth, cellHeight, particles, loop } from "./simulation.js";
import { elements } from "../common/elements.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let isPaused = false; // Track whether the simulation is paused
let lastFrameTime = performance.now();
let fps = 0;

let lastMouseX = null;
let lastMouseY = null;

canvas.addEventListener("mousemove", (event) => {
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
});

const updateTemperatureDisplay = () => {
  if (lastMouseX !== null && lastMouseY !== null) {
    const x = Math.floor(lastMouseX / cellWidth);
    const y = Math.floor(lastMouseY / cellHeight);
    const infoElement = document.getElementById("info");

    if (particles[x] && particles[x][y]) {
      const particle = particles[x][y];
      const element = elements[particle.type];
      infoElement.innerText = `Element: ${element.name}, Type: ${particle.type}, Temperature: ${particle.temperature.toFixed(1)}°C`;
    } else {
      infoElement.innerText = "Element: None, Type: None, Temperature: N/A";
    }
  }
};

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

  updateTemperatureDisplay(); // Update temperature display continuously
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