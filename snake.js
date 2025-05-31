const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const grid = 20;
let count = 0;
let snake = { x: 160, y: 160, dx: grid, dy: 0, cells: [], maxCells: 4 };
let apple = { x: 320, y: 320 };
let score = 0;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function resetGame() {
  snake.x = 160;
  snake.y = 160;
  snake.dx = grid;
  snake.dy = 0;
  snake.cells = [];
  snake.maxCells = 4;
  apple.x = getRandomInt(0, 20) * grid;
  apple.y = getRandomInt(0, 20) * grid;
  score = 0;
}

function gameLoop() {
  requestAnimationFrame(gameLoop);
  if (++count < 4) return;
  count = 0;
  // 풍경 배경 그리기
  if (!window.bgImage) {
    window.bgImage = new Image();
    window.bgImage.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'; // 예시 풍경 이미지
  }
  if (window.bgImage.complete) {
    ctx.drawImage(window.bgImage, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  snake.x += snake.dx;
  snake.y += snake.dy;

  // 벽에 닿으면 방향을 반대로 튕김
  if (snake.x < 0) {
    snake.x = 0;
    snake.dx = grid;
  } else if (snake.x >= canvas.width) {
    snake.x = canvas.width - grid;
    snake.dx = -grid;
  }
  if (snake.y < 0) {
    snake.y = 0;
    snake.dy = grid;
  } else if (snake.y >= canvas.height) {
    snake.y = canvas.height - grid;
    snake.dy = -grid;
  }

  snake.cells.unshift({x: snake.x, y: snake.y});
  if (snake.cells.length > snake.maxCells) snake.cells.pop();

  // 무지개색 뱀
  snake.cells.forEach((cell, index) => {
    const hue = (index * 30) % 360;
    ctx.fillStyle = `hsl(${hue}, 80%, 50%)`;
    ctx.fillRect(cell.x, cell.y, grid-1, grid-1);
    for (let i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        resetGame();
      }
    }
  });

  // 사과를 노란색 그라데이션으로
  const appleGradient = ctx.createRadialGradient(
    apple.x + grid/2, apple.y + grid/2, 2,
    apple.x + grid/2, apple.y + grid/2, grid/2
  );
  appleGradient.addColorStop(0, '#fff700');
  appleGradient.addColorStop(1, '#ff8800');
  ctx.fillStyle = appleGradient;
  ctx.beginPath();
  ctx.arc(apple.x + grid/2, apple.y + grid/2, grid/2-1, 0, Math.PI*2);
  ctx.fill();

  if (snake.x === apple.x && snake.y === apple.y) {
    snake.maxCells++;
    score++;
    apple.x = getRandomInt(0, 20) * grid;
    apple.y = getRandomInt(0, 20) * grid;
  }

  ctx.fillStyle = '#fff';
  ctx.font = '16px Arial';
  ctx.fillText('Score: ' + score, 10, 390);
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowLeft' && snake.dx === 0) {
    snake.dx = -grid; snake.dy = 0;
  } else if (e.key === 'ArrowUp' && snake.dy === 0) {
    snake.dy = -grid; snake.dx = 0;
  } else if (e.key === 'ArrowRight' && snake.dx === 0) {
    snake.dx = grid; snake.dy = 0;
  } else if (e.key === 'ArrowDown' && snake.dy === 0) {
    snake.dy = grid; snake.dx = 0;
  }
});

resetGame();
gameLoop();