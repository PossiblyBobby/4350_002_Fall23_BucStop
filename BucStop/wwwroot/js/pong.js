// Get the canvas element and its context to draw on it
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

// Set the size of the canvas
canvas.width = 800;
canvas.height = 600;

// Define basic measurements for game objects
const grid = 15;
const paddleWidth = grid * 5;
const paddleHeight = grid;

// Slower speed for top paddle
let topPaddleSpeed = 3.6; // Slower speed for top paddle
let bottomPaddleSpeed = 9; // Faster speed for bottom paddle

let ballSpeed = 4;
let playerScore = 0;
let computerScore = 0;
let gameActive = false;
let totalTime = 180; // 3 minutes in seconds

// Initialize top paddle properties
const topPaddle = {
    y: grid * 2,
    x: canvas.width / 2 - paddleWidth / 2,
    height: paddleHeight,
    width: paddleWidth,
    dx: 0
};

// Initialize bottom paddle properties
const bottomPaddle = {
    y: canvas.height - grid * 3,
    x: canvas.width / 2 - paddleWidth / 2,
    height: paddleHeight,
    width: paddleWidth,
    dx: 0
};

// Initialize ball properties
const ball = {
    x: canvas.width / 2 - grid / 2,
    y: canvas.height / 2 - grid / 2,
    width: grid,
    height: grid,
    dy: ballSpeed,
    dx: -ballSpeed
};

// Check collision between two objects
function collides(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y;
}

// AI for controlling the top paddle
function controlAIPaddle() {
    if (!gameActive) return;

    const targetX = ball.x - topPaddle.width / 2;
    const dx = targetX - topPaddle.x;
    topPaddle.dx = dx > 0 ? Math.min(topPaddleSpeed, dx) : Math.max(-topPaddleSpeed, dx);
}

// Move a paddle within the boundaries of the canvas
function movePaddle(paddle) {
    paddle.x = Math.max(grid, Math.min(paddle.x + paddle.dx, canvas.width - paddleWidth - grid));
}

// Update positions and check for game events
function updateGameObjects() {
    controlAIPaddle();
    movePaddle(topPaddle);
    movePaddle(bottomPaddle);

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x < grid || ball.x > canvas.width - grid - ball.width) {
        ball.dx *= -1;
    }

    // Ball collision with paddles
      if (collides(ball, topPaddle)) {
        ball.dy = -ball.dy;
        ball.y = topPaddle.y + topPaddle.height;
    } else if (collides(ball, bottomPaddle)) {
        ball.dy = -ball.dy;
        ball.y = bottomPaddle.y - ball.height;
    }

    // Update scores if ball passes paddles
    updateScores();
}

// Draw the paddles on the canvas

function drawPaddles() {
    context.fillStyle = 'black';
    context.fillRect(topPaddle.x, topPaddle.y, topPaddle.width, topPaddle.height);
    context.fillRect(bottomPaddle.x, bottomPaddle.y, bottomPaddle.width, bottomPaddle.height);
}

// Draw the ball on the canvas

function drawBall() {
    context.fillRect(ball.x, ball.y, ball.width, ball.height);
}

// Display the scores on the canvas

function displayScores() {
    context.font = '24px Arial';
    context.textAlign = 'left';
    context.fillText(`Player: ${playerScore}`, 40, 30);
    context.textAlign = 'right';
    context.fillText(`Computer: ${computerScore}`, canvas.width - 40, 30);
}

// Update scores and reset game state if a point is scored

function updateScores() {
    if (ball.y < 0) {
        playerScore++;
        resetGame();
    } else if (ball.y > canvas.height) {
        computerScore++;
        resetGame();
    }
}

// Reset the game to initial state after a point is scored
function resetGame() {
    ball.x = canvas.width / 2 - grid / 2;
    ball.y = canvas.height / 2 - grid / 2;
    topPaddle.x = canvas.width / 2 - paddleWidth / 2;                            
    bottomPaddle.x = canvas.width / 2 - paddleWidth / 2;
    ball.dy = ballSpeed;
    // Randomize the ball's horizontal direction at the start

    ball.dx = Math.random() < 0.5 ? ballSpeed : -ballSpeed;
}

// Main loop of the game, called every frame

function loop() {
    if (!gameActive) return;

    requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);

    updateGameObjects(); // Update positions and check for game events
    drawPaddles(); // Draw paddles on the canvas
    drawBall(); // Draw the ball on the canvas
    displayScores(); // Display the current scores
    drawTimer(); // Draw the countdown timer
}

// Start the game, initialize scores, and set the game to active

function startGame() {
    if (gameActive) return;
    gameActive = true;
    playerScore = 0;
    computerScore = 0;
    totalTime = 180; // Reset the timer to 3 minutes if you change this change in both places
    resetGame(); // Set the game objects to their starting positions
    loop(); // Start the game loop
    timerId = setInterval(updateTimer, 1000); // Start the countdown timer
}

// Update the countdown timer every second

function updateTimer() {
    if (!gameActive) return;

    totalTime--;
    if (totalTime <= 0) {
        endGame();
    }
}
// Draw the countdown timer on the canvas
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

// End the game, display the winner, and stop the game loop

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

// Event listeners for paddle control using arrow keys
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

// Initialize timer
let timerId = setInterval(updateTimer, 1000); 

// Start the game automatically on page load
startGame(); 
       