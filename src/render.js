import { columns, rows, cellWidth, cellHeight, particles, loop } from "./simulation.js";
import { elements } from "../common/elements.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const render = () => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

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
  loop();
  render();
  requestAnimationFrame(gameLoop);
};

gameLoop();