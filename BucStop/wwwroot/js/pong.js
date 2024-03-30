


// Function to update and display the game timer
function updateTimer() {
    if (totalTime <= 0) {
        endGame(); // End the game when the timer reaches 0
        return;
    }

    // Decrease total time every second
    totalTime--;

    // Display the updated time
    drawTimer();
}

// Function to draw the timer on the canvas
function drawTimer() {
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    // Clear the area where the timer is displayed to avoid overlap
    context.clearRect(canvas.width / 2 - 50, 0, 100, 30);
    context.font = '24px Arial';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.fillText(`Time: ${formattedTime}`, canvas.width / 2, 10);
}
// Get the canvas element and its context to draw on it
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

// Set the size of the canvas
canvas.width = 800;
canvas.height = 600;

// Define basic measurements for game objects
const grid = 15;
const paddleWidth = grid * 5; // Width of the paddles
const paddleHeight = grid;    // Height of the paddles

// Set initial speeds for paddles and ball
let topPaddleSpeed = 3.6; // Speed of the AI paddle
let bottomPaddleSpeed = 9; // Speed of the player's paddle
let ballSpeed = 4; // Speed of the ball

// Initialize scores and game state variables
let playerScore = 0;
let computerScore = 0;
let gameActive = false; // Tracks if the game is currently active
let totalTime = 30; // Total game time in seconds
let timerId; // For setting and clearing the interval

// Leaderboard logic
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
const maxLeaderboardEntries = 10;

// Updates the leaderboard with the new score
function updateLeaderboard(score, initials) {
    // Assume leaderboard is an array of { score, initials } objects
    leaderboard.push({ score, initials });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, maxLeaderboardEntries); // Keep only top entries
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}
// Draws the leaderboard on the canvas
function drawLeaderboard() {
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Set the font size 
    context.font = '32px Arial'; 
    context.fillStyle = 'white';

    // Calculate the starting point for the text to center it on the canvas
    const startX = canvas.width / 2;
    const startY = canvas.height / 2 - (leaderboard.length * 32) / 2; // Adjust the Y position based on the number of entries

    // Display the leaderboard title
    context.textAlign = 'center';
    context.fillText('Leaderboard', startX, startY);

    // Display each leaderboard entry
    leaderboard.forEach((entry, index) => {
        context.fillText(`${index + 1}. ${entry.initials} - ${entry.score}`, startX, startY + 32 * (index + 1));
    });
}

// Function to draw the start button on the canvas
function drawStartButton() {
    const buttonWidth = 100;
    const buttonHeight = 50;
    const buttonX = canvas.width / 2 - buttonWidth / 2;
    const buttonY = canvas.height - buttonHeight - 30; // 30 pixels from the bottom

    context.fillStyle = 'blue';
    context.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    context.fillStyle = 'white';
    context.font = '20px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText("Start Game", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);

    // Store button dimensions for click detection
    startButton = { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight };
}
// Function to end the game
function endGame() {
    clearInterval(timerId); // Stop the timer
    gameActive = false;

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Display the final score
    context.font = '36px Arial';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(`Final Score - Player: ${playerScore}, Computer: ${computerScore}`, canvas.width / 2, canvas.height / 2);

    // Wait for a moment before prompting for initials
    setTimeout(() => {
        const initials = prompt("Enter your initials:") || "AAA"; // Default to "AAA" if no input
        updateLeaderboard(playerScore, initials);
        drawLeaderboard();

        // Show the start button after the leaderboard
        setTimeout(drawStartButton, 3000); // Adjust delay as needed
    }, 3000); // Adjust delay as needed for the player to read the final score
}

// Function to check if a point is inside a rectangle
function isInside(point, rect) {
    return point.x >= rect.x && point.x <= rect.x + rect.width &&
        point.y >= rect.y && point.y <= rect.y + rect.height;
}

// Event listener to handle clicks on the canvas and start the game if the button is clicked
canvas.addEventListener('click', function (event) {
    const rect = canvas.getBoundingClientRect();
    const clickPosition = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };

    if (isInside(clickPosition, startButton)) {
        startGame();
    }
});

// Initialize top paddle properties (AI-controlled)
const topPaddle = {
    y: grid * 2,
    x: canvas.width / 2 - paddleWidth / 2,
    height: paddleHeight,
    width: paddleWidth,
    dx: 0 // Horizontal velocity
};

// Initialize bottom paddle properties (Player-controlled)
const bottomPaddle = {
    y: canvas.height - grid * 3,
    x: canvas.width / 2 - paddleWidth / 2,
    height: paddleHeight,
    width: paddleWidth,
    dx: 0 // Horizontal velocity
};

// Initialize ball properties
const ball = {
    x: canvas.width / 2 - grid / 2,
    y: canvas.height / 2 - grid / 2,
    width: grid,
    height: grid,
    dy: ballSpeed, // Vertical velocity
    dx: -ballSpeed // Horizontal velocity
};

// Checks for collision between two objects, such as the ball and paddles
function collides(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y;
}

// Controls the AI paddle movement to follow the ball
function controlAIPaddle() {
    if (!gameActive) return;

    const targetX = ball.x - topPaddle.width / 2;
    const dx = targetX - topPaddle.x;
    topPaddle.dx = dx > 0 ? Math.min(topPaddleSpeed, dx) : Math.max(-topPaddleSpeed, dx);
}

// Moves a paddle within the boundaries of the canvas
function movePaddle(paddle) {
    paddle.x = Math.max(grid, Math.min(paddle.x + paddle.dx, canvas.width - paddleWidth - grid));
}

// Main function to update positions and check for game events like collisions
function updateGameObjects() {
    controlAIPaddle();
    movePaddle(topPaddle);
    movePaddle(bottomPaddle);

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x < grid || ball.x > canvas.width - grid - ball.width) {
        ball.dx *= -1; // Reverse ball's horizontal direction on wall hit
    }

    // Ball collision with paddles
    if (collides(ball, topPaddle)) {
        ball.dy = -ball.dy; // Reverse ball's vertical direction
        ball.y = topPaddle.y + topPaddle.height; // Position ball outside the paddle
    } else if (collides(ball, bottomPaddle)) {
        ball.dy = -ball.dy; // Reverse ball's vertical direction
        ball.y = bottomPaddle.y - ball.height; // Position ball outside the paddle
    }

    // Update scores if the ball passes paddles
    updateScores();
}
// Function to draw the paddles and ball on the canvas
function drawGameObjects() {
    context.fillStyle = 'black';
    context.fillRect(topPaddle.x, topPaddle.y, topPaddle.width, topPaddle.height);
    context.fillRect(bottomPaddle.x, bottomPaddle.y, bottomPaddle.width, bottomPaddle.height);
    context.fillRect(ball.x, ball.y, ball.width, ball.height);
}

// Function to display the scores on the canvas
function displayScores() {
    context.font = '24px Arial';
    context.textAlign = 'left';
    context.fillText(`Player: ${playerScore}`, 40, 30);
    context.textAlign = 'right';
    context.fillText(`Computer: ${computerScore}`, canvas.width - 40, 30);
}

// Function to update scores and reset game state if a point is scored
function updateScores() {
    if (ball.y < 0) {
        playerScore++;
        resetGame();
    } else if (ball.y > canvas.height) {
        computerScore++;
        resetGame();
    }
}

// Function to reset the game to initial state after a point is scored
function resetGame() {
    ball.x = canvas.width / 2 - grid / 2;
    ball.y = canvas.height / 2 - grid / 2;
    topPaddle.x = canvas.width / 2 - paddleWidth / 2;
    bottomPaddle.x = canvas.width / 2 - paddleWidth / 2;
    ball.dy = ballSpeed;
    ball.dx = Math.random() < 0.5 ? ballSpeed : -ballSpeed; // Randomize the ball's horizontal direction
}

// Main game loop function, called every frame
function loop() {
    if (!gameActive) return;

    requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);

    updateGameObjects(); // Update positions and check for game events
    drawGameObjects(); // Draw paddles and ball on the canvas
    displayScores(); // Display the current scores
    drawTimer(); // Ensure the timer is redrawn on each frame
}


// Function to start the game, initialize scores, and set the game to active
function startGame() {
    if (gameActive) return;

    gameActive = true;
    playerScore = 0;
    computerScore = 0;
    totalTime = 30; // Reset the timer to 3 minutes
    resetGame();
    drawTimer(); // Initialize the timer display
    loop();
    timerId = setInterval(updateTimer, 1000); // Start the timer
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

// Initialize the game with the start button
function initializeGame() {
    drawLeaderboard();
    drawStartButton();
    drawTimer();
}

initializeGame();