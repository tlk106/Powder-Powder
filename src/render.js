import { columns, rows, size, particles, loop } from './simulation.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            if (particles[x][y]) {
                ctx.fillStyle = 'black'; // You can change the color as needed
                ctx.fillRect(x * size, y * size, size, size);
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