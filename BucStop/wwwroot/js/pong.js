const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

const grid = 15;
const paddleWidth = grid * 5;
const paddleHeight = grid;

let topPaddleSpeed = 3.6; // Slower speed for top paddle
let bottomPaddleSpeed = 9; // Faster speed for bottom paddle

let ballSpeed = 4;
let playerScore = 0;
let computerScore = 0;
let gameActive = false;
let totalTime = 180; // 3 minutes in seconds

const topPaddle = {
    y: grid * 2,
    x: canvas.width / 2 - paddleWidth / 2,
    height: paddleHeight,
    width: paddleWidth,
    dx: 0
};

const bottomPaddle = {
    y: canvas.height - grid * 3,
    x: canvas.width / 2 - paddleWidth / 2,
    height: paddleHeight,
    width: paddleWidth,
    dx: 0
};

const ball = {
    x: canvas.width / 2 - grid / 2,
    y: canvas.height / 2 - grid / 2,
    width: grid,
    height: grid,
    dy: ballSpeed,
    dx: -ballSpeed
};

function collides(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y;
}

function controlAIPaddle() {
    if (!gameActive) return;

    const targetX = ball.x - topPaddle.width / 2;
    const dx = targetX - topPaddle.x;
    topPaddle.dx = dx > 0 ? Math.min(topPaddleSpeed, dx) : Math.max(-topPaddleSpeed, dx);
}



function movePaddle(paddle) {
    paddle.x = Math.max(grid, Math.min(paddle.x + paddle.dx, canvas.width - paddle.width - grid));
}

function updateGameObjects() {
    controlAIPaddle();
    movePaddle(topPaddle);
    movePaddle(bottomPaddle);

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x < grid || ball.x > canvas.width - grid - ball.width) {
        ball.dx *= -1;
    }

    if (collides(ball, topPaddle)) {
        ball.dy = -ball.dy;
        ball.y = topPaddle.y + topPaddle.height;
    } else if (collides(ball, bottomPaddle)) {
        ball.dy = -ball.dy;
        ball.y = bottomPaddle.y - ball.height;
    }

    updateScores();
}

function drawPaddles() {
    context.fillStyle = 'black';
    context.fillRect(topPaddle.x, topPaddle.y, topPaddle.width, topPaddle.height);
    context.fillRect(bottomPaddle.x, bottomPaddle.y, bottomPaddle.width, bottomPaddle.height);
}

function drawBall() {
    context.fillRect(ball.x, ball.y, ball.width, ball.height);
}

function displayScores() {
    context.font = '24px Arial';
    context.textAlign = 'left';
    context.fillText(`Player: ${playerScore}`, 40, 30);
    context.textAlign = 'right';
    context.fillText(`Computer: ${computerScore}`, canvas.width - 40, 30);
}

function updateScores() {
    if (ball.y < 0) {
        playerScore++;
        resetGame();
    } else if (ball.y > canvas.height) {
        computerScore++;
        resetGame();
    }
}

function resetGame() {
    ball.x = canvas.width / 2 - grid / 2;
    ball.y = canvas.height / 2 - grid / 2;
    topPaddle.x = canvas.width / 2 - paddleWidth / 2;                            
    bottomPaddle.x = canvas.width / 2 - paddleWidth / 2;
    ball.dy = ballSpeed;
    ball.dx = Math.random() < 0.5 ? ballSpeed : -ballSpeed;
}

function loop() {
    if (!gameActive) return;

    requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);

    updateGameObjects();
    drawPaddles();
    drawBall();
    displayScores();
    drawTimer(); // Draw the timer every frame
}

function startGame() {
    if (gameActive) return;
    gameActive = true;
    playerScore = 0;
    computerScore = 0;
    totalTime = 180;
    resetGame();
    loop();
    timerId = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (!gameActive) return;

    totalTime--;
    if (totalTime <= 0) {
        endGame();
    }
}
function drawTimer() {
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    context.font = '24px Arial';
    context.fillStyle = 'black'; // Ensure the text color is visible
    context.textAlign = 'center';
    context.textBaseline = 'top'; // Align text at the top
    context.fillText(`Time: ${formattedTime}`, canvas.width / 2, 10); // Position near the top of the canvas
}


  
function endGame() {
    clearInterval(timerId);
    gameActive = false;
    let winner = playerScore > computerScore ? "Player" : "Computer";
    if (playerScore === computerScore) {
        winner = "No one";
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = '36px Arial';
    context.textAlign = 'center';
    context.fillText(`${winner} wins! Score ${playerScore}` , canvas.width / 2, canvas.height / 2);
}
// arrow keys to move paddles
document.addEventListener('keydown', function (e) {
    if (!gameActive) return;

    if (e.key === 'ArrowLeft') {
        bottomPaddle.dx = -bottomPaddleSpeed;
    } else if (e.key === 'ArrowRight') {
        bottomPaddle.dx = bottomPaddleSpeed;
    }
});

document.addEventListener('keyup', function (e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        bottomPaddle.dx = 0;
    }
});

document.addEventListener('touchmove', function (e) {
    e.preventDefault();
    let touch = e.touches[0];
    bottomPaddle.x = touch.clientX - bottomPaddle.width / 2;
}, false);

let timerId = setInterval(updateTimer, 1000); // Initialize timer

startGame(); // Start the game automatically on page load
       