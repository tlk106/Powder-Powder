import { getGridPosition } from "./mouseAndKeyHandler.js";
import { elements } from "../common/elements.js";
import { random } from "../common/utils.js";
 
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

const columns = 190;
const rows = 100;

const simulationTemperature = 21; // Default temperature in Celsius

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
            particles[x][y] = { 
                type: elementType, 
                temperature: elements[elementType].starttemp // Initialize with starting temperature
            };
        }
    }
};

// Function to update the temperature of a particle based on Newton's Law of Cooling
const updateTemperature = (particle, deltaTime = 1 / 60) => {
    const ABSOLUTE_ZERO = -273.15;
    const T_env = simulationTemperature;

    if (particle.temperature < ABSOLUTE_ZERO) {
        particle.temperature = ABSOLUTE_ZERO;
        return;
    }

   
    const tau = 30;
    const k = 1 / tau;


    const decayFactor = Math.exp(-k * deltaTime);
    particle.temperature = T_env + (particle.temperature - T_env) * decayFactor;

    if (particle.temperature < ABSOLUTE_ZERO) {
        particle.temperature = ABSOLUTE_ZERO;
    }
};




// Function to determine the type of a particle based on its temperature
const determineType = (particle) => {
    const element = elements[particle.type];
    // Always treat fire as fire
    if (particle.type === "fire") {
        return "fire";
    }
    // Always treat smoke as gas
    if (particle.type === "smoke") {
        return "gas";
    }
    // Water transitions
    if (particle.type === "water") {
        if (particle.temperature < 0) {
            particle.type = "ice"; // Change type to ice
        } else if (particle.temperature > 100) {
            particle.type = "steam"; // Change type to steam
        }
    } else if (particle.type === "ice" && particle.temperature >= 0) {
        particle.type = "water"; // Change type back to water
    } else if (particle.type === "steam" && particle.temperature <= 100) {
        particle.type = "water"; // Change type back to water
    }
    // Stone <-> Lava transitions
    else if (particle.type === "stone" && particle.temperature > element.meltingpoint) {
        particle.type = "lava";
    } else if (particle.type === "lava" && particle.temperature <= elements.stone.meltingpoint) {
        particle.type = "stone";
    }
    // Wood turns into fire instead of melting
    else if (particle.type === "wood" && particle.temperature > element.meltingpoint) {
        particle.type = "fire";
        particle.temperature = Math.max(particle.temperature, 300);
    }

    if (particle.temperature < element.meltingpoint) {
        return element.ispowder ? "powder" : "solid";
    } else if (particle.temperature < element.boilingpoint) {
        return "liquid";
    } else {
        return "gas";
    }
};

// Function to conduct heat between two particles
const conductHeat = (particle1, particle2) => {
    if (!particle1 || !particle2) return;

    const element1 = elements[particle1.type];
    const element2 = elements[particle2.type];

    // Use average conductivity of both elements
    const thermalConductivity = (element1.conductivity + element2.conductivity) / 2;
    const temperatureDifference = particle1.temperature - particle2.temperature;

    const heatTransfer = thermalConductivity * temperatureDifference * 0.1; // scaling factor

    particle1.temperature -= heatTransfer;
    particle2.temperature += heatTransfer;
};

// Update the loop function to include temperature updates
const loop = () => {
    for (let x = 0; x < columns; x++) {
        for (let y = rows - 1; y >= 0; y--) {
            const particle = particles[x][y];
            if (particle) {
                updateTemperature(particle); // Update the particle's temperature
                const currentType = determineType(particle); // Determine its current type

                // Conduct heat with neighboring particles
                const neighbors = [
                    particles[x - 1]?.[y], // Left
                    particles[x + 1]?.[y], // Right
                    particles[x]?.[y - 1], // Above
                    particles[x]?.[y + 1], // Below
                ];

                for (const neighbor of neighbors) {
                    conductHeat(particle, neighbor);
                }

                // Behavior for powder-like particles
                if (currentType === "powder") {
                    const belowY = y + 1;
                    const leftX = x - 1;
                    const rightX = x + 1;

                    if (
                        belowY < rows &&
                        (!particles[x][belowY] || 
                        determineType(particles[x][belowY]) === "liquid" || 
                        determineType(particles[x][belowY]) === "gas" ||
                        (particles[x][belowY] && determineType(particles[x][belowY]) !== "solid" && elements[particles[x][belowY]?.type]?.mass < elements[particle.type].mass)) // Check density
                    ) {
                        particles[x][y] = particles[x][belowY]; // Move water up if present
                        particles[x][belowY] = particle; // Move powder down
                    } else if (
                        leftX >= 0 &&
                        belowY < rows &&
                        (!particles[leftX][belowY] || 
                        determineType(particles[leftX][belowY]) === "liquid" || 
                        determineType(particles[leftX][belowY]) === "gas" ||
                        (particles[leftX][belowY] && determineType(particles[leftX][belowY]) !== "solid" && elements[particles[leftX][belowY]?.type]?.mass < elements[particle.type].mass)) // Check density
                    ) {
                        particles[x][y] = particles[leftX][belowY]; // Move water up if present
                        particles[leftX][belowY] = particle; // Move powder down-left
                    } else if (
                        rightX < columns &&
                        belowY < rows &&
                        (!particles[rightX][belowY] || 
                        determineType(particles[rightX][belowY]) === "liquid" || 
                        determineType(particles[rightX][belowY]) === "gas" ||
                        (particles[rightX][belowY] && determineType(particles[rightX][belowY]) !== "solid" && elements[particles[rightX][belowY]?.type]?.mass < elements[particle.type].mass)) // Check density
                    ) {
                        particles[x][y] = particles[rightX][belowY]; // Move water up if present
                        particles[rightX][belowY] = particle; // Move powder down-right
                    }
                }

                // Behavior for liquid-like particles
                if (currentType === "liquid") {
                    const belowY = y + 1;
                    const leftX = x - 1;
                    const rightX = x + 1;

                    if (
                        belowY < rows &&
                        (!particles[x][belowY] || 
                        determineType(particles[x][belowY]) === "gas" || 
                        (particles[x][belowY] && determineType(particles[x][belowY]) !== "solid" && elements[particles[x][belowY]?.type]?.mass < elements[particle.type].mass)) // Check density
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
                                determineType(particles[leftX][y]) === "gas" || 
                                (particles[leftX][y] && determineType(particles[leftX][y]) !== "solid" && elements[particles[leftX][y]?.type]?.mass < elements[particle.type].mass)) // Check density
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
                                determineType(particles[rightX][y]) === "gas" || 
                                (particles[rightX][y] && determineType(particles[rightX][y]) !== "solid" && elements[particles[rightX][y]?.type]?.mass < elements[particle.type].mass)) // Check density
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
                if (currentType === "gas") {
                    const belowY = y + 1;
                    const leftX = x - 1;
                    const rightX = x + 1;
                    const randomDirection = random(0, 4);

                    // Helper to check if gas can move into a cell (empty or lighter)
                    const canMoveTo = (tx, ty) => {
                        if (tx < 0 || tx >= columns || ty < 0 || ty >= rows) return false;
                        const target = particles[tx][ty];
                        if (!target) return true;
                        // Allow swap if target is not solid and lighter than this gas
                        const targetType = determineType(target);
                        return (
                            targetType !== "solid" &&
                            elements[target.type]?.mass < elements[particle.type].mass
                        );
                    };

                    if (randomDirection === 0 && canMoveTo(leftX, y)) {
                        if (particles[leftX][y]) {
                            // Swap if lighter
                            const lighterParticle = particles[leftX][y];
                            particles[leftX][y] = particle;
                            particles[x][y] = lighterParticle;
                        } else {
                            particles[leftX][y] = particle;
                            particles[x][y] = null;
                        }
                    } else if (randomDirection === 1 && canMoveTo(rightX, y)) {
                        if (particles[rightX][y]) {
                            const lighterParticle = particles[rightX][y];
                            particles[rightX][y] = particle;
                            particles[x][y] = lighterParticle;
                        } else {
                            particles[rightX][y] = particle;
                            particles[x][y] = null;
                        }
                    } else if (randomDirection === 2 && canMoveTo(x, y - 1)) {
                        if (particles[x][y - 1]) {
                            const lighterParticle = particles[x][y - 1];
                            particles[x][y - 1] = particle;
                            particles[x][y] = lighterParticle;
                        } else {
                            particles[x][y - 1] = particle;
                            particles[x][y] = null;
                        }
                    } else if (randomDirection === 3 && canMoveTo(x, belowY)) {
                        if (particles[x][belowY]) {
                            const lighterParticle = particles[x][belowY];
                            particles[x][belowY] = particle;
                            particles[x][y] = lighterParticle;
                        } else {
                            particles[x][belowY] = particle;
                            particles[x][y] = null;
                        }
                    }
                }

                // Behavior for fire
                if (currentType === "fire") {
                    // Fire spreading to flammable neighbors
                    const fireNeighbors = [
                        [x - 1, y], // Left
                        [x + 1, y], // Right
                        [x, y - 1], // Up
                        [x, y + 1], // Down
                    ];
                    for (const [nx, ny] of fireNeighbors) {
                        if (
                            nx >= 0 && nx < columns && ny >= 0 && ny < rows &&
                            particles[nx][ny] &&
                            elements[particles[nx][ny].type] &&
                            elements[particles[nx][ny].type].isflammable &&
                            particles[nx][ny].type !== "fire"
                        ) {
                            particles[nx][ny].type = "fire";
                            particles[nx][ny].temperature = Math.max(particles[nx][ny].temperature, 250); // Ignite
                        }
                    }

                    // Turn fire into smoke if cooled
                    if (particle.temperature < 100) {
                        particles[x][y] = { 
                            type: "smoke", 
                            temperature: particle.temperature 
                        };
                        continue;
                    }
                    const belowY = y + 1;
                    const leftX = x - 1;
                    const rightX = x + 1;

                    const randomDirection = random(0, 5);
                    if (randomDirection === 0 && leftX >= 0 && !particles[leftX][y]) {
                        particles[x][y] = null;
                        particles[leftX][y] = particle;
                    } else if (randomDirection === 1 && rightX < columns && !particles[rightX][y]) {
                        particles[x][y] = null;
                        particles[rightX][y] = particle;
                    } else if (randomDirection === 2 && y > 0 && !particles[x][y - 1]) {
                        particles[x][y] = null;
                        particles[x][y - 1] = particle;
                    } else if (randomDirection === 3 && y > 0 && !particles[x][y - 1]) {
                        particles[x][y] = null;
                        particles[x][y - 1] = particle;
                    } else if (randomDirection === 4 && belowY < rows && !particles[x][belowY]) {
                        particles[x][y] = null;
                        particles[x][belowY] = particle;
                    }
                }

                // Behavior for solid-like particles
                if (currentType === "solid") {
                    continue;
                }
            }
        }
    }
};

export { columns, rows, cellWidth, cellHeight, particles, spawnParticle, loop };