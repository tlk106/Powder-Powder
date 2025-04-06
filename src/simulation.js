import { getGridPosition } from "./mouseHandler.js";
import { elements } from "../common/elements.js";
import { random } from "../common/utils.js";
 
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

const columns = 190;
const rows = 100;

const cellWidth = screenWidth / columns;
const cellHeight = screenHeight / rows;

// Initialize the particles array
const particles = Array.from({ length: columns }, () => Array(rows).fill(null));

// Function to spawn a particle of a specific type at the clicked position
const spawnParticle = (x, y, elementType) => {
  if (y < rows && !particles[x][y]) {
    particles[x][y] = { type: elementType }; // Assign the element type
  }
};

// Function to update the particles' positions
const loop = () => {
  for (let x = 0; x < columns; x++) {
      for (let y = rows - 1; y >= 0; y--) {
          const particle = particles[x][y];
          if (particle) {
              const belowY = y + 1;
              const leftX = x - 1;
              const rightX = x + 1;

              // Behavior for powder-like particles
              if (elements[particle.type].isType("powder")) {
                  if (
                      belowY < rows &&
                      (!particles[x][belowY] || elements[particles[x][belowY]?.type]?.isType("liquid"))
                  ) {
                      particles[x][y] = particles[x][belowY]; // Move water up if present
                      particles[x][belowY] = particle; // Move powder down
                  } else if (
                      leftX >= 0 &&
                      belowY < rows &&
                      (!particles[leftX][belowY] || elements[particles[leftX][belowY]?.type]?.isType("liquid"))
                  ) {
                      particles[x][y] = particles[leftX][belowY]; // Move water up if present
                      particles[leftX][belowY] = particle; // Move powder down-left
                  } else if (
                      rightX < columns &&
                      belowY < rows &&
                      (!particles[rightX][belowY] || elements[particles[rightX][belowY]?.type]?.isType("liquid"))
                  ) {
                      particles[x][y] = particles[rightX][belowY]; // Move water up if present
                      particles[rightX][belowY] = particle; // Move powder down-right
                  }
              }

              // Behavior for liquid-like particles
              if (elements[particle.type].isType("liquid")) {
                  // Try to move down first
                  if (belowY < rows && !particles[x][belowY]) {
                      particles[x][y] = null;
                      particles[x][belowY] = particle; // Move down
                  } else {
                      // If it can't move down, try to move left or right
                      let moved = false;

                      // Randomly decide to move left or right
                      if (Math.random() < 0.5) {
                          // Attempt to move left
                          if (leftX >= 0 && !particles[leftX][y]) {
                              particles[x][y] = null;
                              particles[leftX][y] = particle; // Move left
                              moved = true;
                          }
                      } else {
                          // Attempt to move right
                          if (rightX < columns && !particles[rightX][y]) {
                              particles[x][y] = null;
                              particles[rightX][y] = particle; // Move right
                              moved = true;
                          }
                      }

                      // After moving left or right, check if it can fall down
                      if (moved) {
                          // Check for left movement
                          if (belowY < rows && leftX >= 0 && !particles[leftX][belowY]) {
                              particles[leftX][y] = null;
                              particles[leftX][belowY] = particle; // Move down after moving left
                          }
                          // Check for right movement
                          else if (belowY < rows && rightX < columns && !particles[rightX][belowY]) {
                              particles[rightX][y] = null;
                              particles[rightX][belowY] = particle; // Move down after moving right
                          }
                      }
                  }
              }
          }
      }
  }
};

const captureMouseInput = () => {
  document.addEventListener("click", (event) => {
    const x = Math.floor(event.clientX / cellWidth);
    const y = Math.floor(event.clientY / cellHeight);
    spawnParticle(x, y, "powder"); // Default to spawning powder
  });
};

captureMouseInput();

export { columns, rows, cellWidth, cellHeight, particles, spawnParticle, loop };