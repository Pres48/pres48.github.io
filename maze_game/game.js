const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

let speed = 1.2;   // slower speed so movement feels controlled

let ball = { x: 295, y: 570, r: 8 };
let direction = null;
let gameRunning = false;

function setDirection(dir) {
  direction = dir;
}

function startGame() {
  gameRunning = true;
}

function resetGame() {
  ball.x = 295;
  ball.y = 570;
  direction = null;
  gameRunning = false;
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") direction = "up";
  if (e.key === "ArrowDown") direction = "down";
  if (e.key === "ArrowLeft") direction = "left";
  if (e.key === "ArrowRight") direction = "right";
});

// -------------------------
// MAZE DRAWING
// -------------------------

function drawMaze() {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 8;

  ctx.beginPath();

  // OUTER BORDER
  ctx.rect(20, 20, 560, 560);

  // OPENING (start)
  ctx.clearRect(280, 580, 40, 30);

  // EXIT (finish)
  ctx.clearRect(280, 0, 40, 30);

  // INTERNAL MAZE WALLS
  drawLine(100, 20, 100, 400);
  drawLine(100, 400, 300, 400);
  drawLine(300, 400, 300, 200);
  drawLine(300, 200, 450, 200);
  drawLine(450, 200, 450, 550);
  drawLine(450, 550, 200, 550);
  drawLine(200, 550, 200, 300);
  drawLine(200, 300, 350, 300);
  drawLine(350, 300, 350, 100);
  drawLine(350, 100, 100, 100);

  ctx.stroke();
}

function drawLine(x1, y1, x2, y2) {
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
}

// -------------------------
// GAME LOOP
// -------------------------

function moveBall() {
  if (!gameRunning) return;

  let nextX = ball.x;
  let nextY = ball.y;

  if (direction === "up") nextY -= speed;
  if (direction === "down") nextY += speed;
  if (direction === "left") nextX -= speed;
  if (direction === "right") nextX += speed;

  let imgData = ctx.getImageData(nextX, nextY, 1, 1).data;

  // collision detect (black walls)
  if (imgData[0] < 50 && imgData[1] < 50 && imgData[2] < 50) {
    alert("GAME OVER! You hit a wall.");
    resetGame();
    return;
  }

  ball.x = nextX;
  ball.y = nextY;
}

function drawBall() {
  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMaze();
  moveBall();
  drawBall();
  requestAnimationFrame(gameLoop);
}

gameLoop();
