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

// Function to determine color based on temperature using gradients
const getColorByTemperature = (baseColor, temperature, elementType) => {
  // Convert baseColor to an array if it's a string
  if (typeof baseColor === "string" && baseColor.startsWith("rgb")) {
    baseColor = baseColor
      .match(/\d+/g)
      .map(Number); // Extract RGB values as an array
  }

  // Special case for steam
  if (elementType === "steam") {
    return `rgb(${baseColor.join(",")})`; // Always use base color for steam
  }

  // Special case for water
  if (elementType === "water") {
    return temperature > 100 ? "rgb(159, 162, 222)" : `rgb(${baseColor.join(",")})`;
  }

  const thresholds = [
    { temp: 0, color: baseColor }, // Base color as an array
    { temp: 525, color: [139, 0, 0] }, // Dull Red
    { temp: 650, color: [255, 48, 48] }, // Cherry Red
    { temp: 800, color: [255, 165, 0] }, // Orange
    { temp: 1000, color: [255, 255, 0] }, // Yellow
    { temp: 1200, color: [255, 255, 255] }, // White
    { temp: 1400, color: [173, 216, 230] }, // Blueish White
  ];

  // If temperature is below the first threshold, use the base color
  if (temperature < thresholds[0].temp) {
    return `rgb(${baseColor.join(",")})`;
  }

  // Find the two thresholds surrounding the temperature
  let start = thresholds[0];
  let end = thresholds[thresholds.length - 1];
  for (let i = 0; i < thresholds.length - 1; i++) {
    if (temperature >= thresholds[i].temp && temperature < thresholds[i + 1].temp) {
      start = thresholds[i];
      end = thresholds[i + 1];
      break;
    }
  }

  // Interpolate between the two colors
  const t = (temperature - start.temp) / (end.temp - start.temp);
  const interpolatedColor = start.color.map((startValue, index) =>
    Math.round(startValue + t * (end.color[index] - startValue))
  );

  // Return the color as a CSS-compatible string
  return `rgb(${interpolatedColor.join(",")})`;
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
        const baseColor = elements[particle.type].color;
        const color = getColorByTemperature(baseColor, particle.temperature, particle.type);
        ctx.fillStyle = color; // Apply gradient-based color
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