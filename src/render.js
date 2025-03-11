import tick from './simulation.js';

const canvas = document.createElement('canvas'); 
const context = canvas.getContext('2d');
document.body.appendChild(canvas);

const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const render = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = '20px Arial';
  context.fillStyle = 'black';
  
  const powder = tick();
  context.fillText(`Name: ${powder.name}`, 10, 30);
  context.fillText(`Type: ${powder.type}`, 10, 60);
  context.fillText(`ID: ${powder.id}`, 10, 90);

  requestAnimationFrame(render);
}

render();