import { powder } from '../common/elements.js';

const columns = 50;
const rows = 50;
const size = 4;
const particles = Array.from({ length: columns }, () => Array.from({ length: rows }, () => null));


class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const tick = () => {
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            const particle = particles[x][y];
            if (particle) {
                if (y < rows - 1 && !particles[x][y + 1]) {
                    particles[x][y + 1] = particle;
                    particles[x][y] = null;
                    particle.y++;
                }
            }
        }
    }
}

const addParticle = (x, y) => {
    if (x >= 0 && x < columns && y >= 0 && y < rows) {
        particles[x][y] = new Particle(x, y);
    }
}

// Game loop
const loop = () => {
    tick();
    addParticle(25, 0);
}

while (true) {
    loop();
}

export { columns, rows, size, particles, Particle, tick, loop };