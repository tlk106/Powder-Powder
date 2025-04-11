import { getGridPosition } from "./mouseAndKeyHandler.js";
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
    if (y < rows && x >= 0 && x < columns) {
      if (elementType === null) {
        particles[x][y] = null; // Erase particle
      } else if (elements[elementType]) {
        particles[x][y] = { type: elementType }; // Spawn particle
      }
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
                      (!particles[x][belowY] || 
                      elements[particles[x][belowY]?.type]?.isType("liquid") || 
                      elements[particles[x][belowY]?.type]?.isType("gas") ||
                      (particles[x][belowY] && elements[particles[x][belowY]?.type]?.mass < elements[particle.type].mass)) // Check density
                  ) {
                      particles[x][y] = particles[x][belowY]; // Move water up if present
                      particles[x][belowY] = particle; // Move powder down
                  } else if (
                      leftX >= 0 &&
                      belowY < rows &&
                      (!particles[leftX][belowY] || 
                      elements[particles[leftX][belowY]?.type]?.isType("liquid") || 
                      elements[particles[leftX][belowY]?.type]?.isType("gas") ||
                      (particles[leftX][belowY] && elements[particles[leftX][belowY]?.type]?.mass < elements[particle.type].mass)) // Check density
                  ) {
                      particles[x][y] = particles[leftX][belowY]; // Move water up if present
                      particles[leftX][belowY] = particle; // Move powder down-left
                  } else if (
                      rightX < columns &&
                      belowY < rows &&
                      (!particles[rightX][belowY] || 
                      elements[particles[rightX][belowY]?.type]?.isType("liquid") || 
                      elements[particles[rightX][belowY]?.type]?.isType("gas") ||
                      (particles[rightX][belowY] && elements[particles[rightX][belowY]?.type]?.mass < elements[particle.type].mass)) // Check density
                  ) {
                      particles[x][y] = particles[rightX][belowY]; // Move water up if present
                      particles[rightX][belowY] = particle; // Move powder down-right
                  }
              }

              // Behavior for liquid-like particles
              if (elements[particle.type].isType("liquid")) {
                if (
                  belowY < rows &&
                  (!particles[x][belowY] || 
                  elements[particles[x][belowY]?.type]?.isType("gas") || 
                  (particles[x][belowY] && elements[particles[x][belowY]?.type]?.mass < elements[particle.type].mass)) // Check density
              ) {
                  if (particles[x][belowY]) {
                      // Swap positions if the lighter element can move up
                      const lighterParticle = particles[x][belowY];
                      particles[x][belowY] = particle; // Move the heavier element down
                      particles[x][y] = lighterParticle; // Move the lighter element up
                  } else {
                      particles[x][belowY] = particle; // Move the heavier element down
                      particles[x][y] = null; // Clear the current position
                  }
              } else {
                  // If it can't move down, try to move left or right
                  let moved = false;
              
                  if (Math.random() < 0.5) {
                      if (
                          leftX >= 0 &&
                          (!particles[leftX][y] || 
                          elements[particles[leftX][y]?.type]?.isType("gas") || 
                          (particles[leftX][y] && elements[particles[leftX][y]?.type]?.mass < elements[particle.type].mass)) // Check density
                      ) {
                          if (particles[leftX][y]) {
                              // Swap positions if the lighter element can move
                              const lighterParticle = particles[leftX][y];
                              particles[leftX][y] = particle; // Move the heavier element
                              particles[x][y] = lighterParticle; // Move the lighter element
                          } else {
                              particles[leftX][y] = particle; // Move left
                              particles[x][y] = null; // Clear the current position
                          }
                          moved = true;
                      }
                  } else {
                      if (
                          rightX < columns &&
                          (!particles[rightX][y] || 
                          elements[particles[rightX][y]?.type]?.isType("gas") || 
                          (particles[rightX][y] && elements[particles[rightX][y]?.type]?.mass < elements[particle.type].mass)) // Check density
                      ) {
                          if (particles[rightX][y]) {
                              // Swap positions if the lighter element can move
                              const lighterParticle = particles[rightX][y];
                              particles[rightX][y] = particle; // Move the heavier element
                              particles[x][y] = lighterParticle; // Move the lighter element
                          } else {
                              particles[rightX][y] = particle; // Move right
                              particles[x][y] = null; // Clear the current position
                          }
                          moved = true;
                      }
                  }
              
                  // Ensure the particle remains in place if no movement occurred
                  if (!moved) {
                      particles[x][y] = particle;
                  }
              }
              }

              // Behavior for gas-like particles
              if (elements[particle.type].isType("gas")) {
                  const randomDirection = random(0, 4);
                  if (randomDirection === 0 && leftX >= 0 && !particles[leftX][y]) {
                      particles[x][y] = null;
                      particles[leftX][y] = particle;
                  } else if (randomDirection === 1 && rightX < columns && !particles[rightX][y]) {
                      particles[x][y] = null;
                      particles[rightX][y] = particle;
                  } else if (randomDirection === 2 && y > 0 && !particles[x][y - 1]) {
                      particles[x][y] = null;
                      particles[x][y - 1] = particle;
                  } else if (randomDirection === 3 && belowY < rows && !particles[x][belowY]) {
                      particles[x][y] = null;
                      particles[x][belowY] = particle;
                  }
              }

              // Behavior for solid-like particles
              if (elements[particle.type].isType("solid")) {
                  continue;
              }
          }
      }
  }
};

export { columns, rows, cellWidth, cellHeight, particles, spawnParticle, loop };