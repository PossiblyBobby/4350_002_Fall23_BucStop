/**
 * Improved Snake Game
 *
 * Original base game created by straker on GitHub:
 * https://gist.github.com/straker/81b59eecf70da93af396f963596dfdc5
 *
 * Improvements and modifications by Jean Bilong and Christian Crawford, Spring 2024, ETSU.
 * Enhancements include modularization, use of ES6 features, improved game loop,
 * and additional game states for a better user experience.
 */

// Leaderboard logic
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
let gameStarted = false;
const maxLeaderboardEntries = 10;

function updateLeaderboard(newScore) {
    const initials = prompt('Enter your initials (max 3 characters):').substr(0, 3);
    leaderboard.push({ score: newScore, initials });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, maxLeaderboardEntries);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}
// creates the leaderboard
function drawLeaderboard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    context.font = '16px Arial';
    context.fillText('Leaderboard:', 10, 20);
    leaderboard.forEach((entry, index) => {
        context.fillText(`${index + 1}. ${entry.initials} - ${entry.score}`, 10, 40 + 20 * index);
    });
}

// Setup canvas and context for drawing
const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

// Define grid size for the game board
const grid = 16;
// Frame counter to control game speed
let count = 0;
// Variable to keep track of score
let score = 0;

// Snake object with properties for position, direction, body cells, and size
const snake = {
    x: 160,
    y: 160,
    dx: grid, // Movement in the x-direction
    dy: 0, // Movement in the y-direction
    cells: [], // Array to store the segments of the snake's body
    maxCells: 4, // Initial length of the snake
};

// Apple object with properties for position
let apple = {
    x: getRandomInt(0, 25) * grid,
    y: getRandomInt(0, 25) * grid,
};

// Utility function to generate a random integer within a range
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


// Main game loop function
function gameLoop() {
    if (!gameStarted) return;

    requestAnimationFrame(gameLoop);

    if (++count < 6) {
        return;
    }

    count = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);
    moveSnake();
    checkCollision();
    drawApple();
    drawSnake();
}

// Function to update the snake's position and handle wrapping
function moveSnake() {
    snake.x += snake.dx;
    snake.y += snake.dy;
    snake.x = wrapPosition(snake.x, canvas.width);
    snake.y = wrapPosition(snake.y, canvas.height);
    snake.cells.unshift({ x: snake.x, y: snake.y });
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }
}

// Function to wrap snake position around the canvas
function wrapPosition(position, max) {
    if (position < 0) {
        return max - grid;
    } else if (position >= max) {
        return 0;
    }
    return position;
}

// Function to check for collisions with the apple or with itself
function checkCollision() {
    if (snake.cells[0].x === apple.x && snake.cells[0].y === apple.y) {
        snake.maxCells++;
        score++;
        apple = { x: getRandomInt(0, 25) * grid, y: getRandomInt(0, 25) * grid };
    }
    snake.cells.slice(1).forEach(cell => {
        if (snake.x === cell.x && snake.y === cell.y) {
            resetGame();
        }
    });
}

// Function to draw the apple on the canvas
function drawApple() {
    context.fillStyle = "red";
    context.fillRect(apple.x, apple.y, grid - 1, grid - 1);
}

// Function to draw the snake on the canvas
function drawSnake() {
    context.fillStyle = "green";
    snake.cells.forEach(cell => {
        context.fillRect(cell.x, cell.y, grid - 1, grid - 1); // Create a grid effect
    });
}

// Function to reset the game after a collision with the snake itself
function resetGame() {
    updateLeaderboard(score);
    score = 0;
    snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid;
    snake.dy = 0;
    apple = { x: getRandomInt(0, 25) * grid, y: getRandomInt(0, 25) * grid };
    gameStarted = false;
    drawLeaderboard();
    drawStartButton();
}

// Start button functionality
function drawStartButton() {
    context.fillStyle = 'blue';
    context.fillRect(canvas.width / 2 - 50, canvas.height / 2 - 25, 100, 50);
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('Start Game', canvas.width / 2, canvas.height / 2);
}

canvas.addEventListener('click', function (event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (x > canvas.width / 2 - 50 && x < canvas.width / 2 + 50 &&
        y > canvas.height / 2 - 25 && y < canvas.height / 2 + 25 && !gameStarted) {
        gameStarted = true;
        score = 0; // Reset score on game start
        snake.cells = []; // Clear snake segments
        snake.maxCells = 4; // Reset initial snake length
        apple = { x: getRandomInt(0, 25) * grid, y: getRandomInt(0, 25) * grid };
        requestAnimationFrame(gameLoop);
    }
});

// Initialize the game view on load
function initializeGame() {
    drawLeaderboard();
    drawStartButton();
}

initializeGame(); // Call the initialization function to set up the game view
// Event listener for keyboard input to control snake direction
document.addEventListener("keydown", (e) => {
    // Prevent the snake from reversing onto itself
    if (e.which === 37 && snake.dx === 0) { // Left arrow
        snake.dx = -grid;
        snake.dy = 0;
    } else if (e.which === 38 && snake.dy === 0) { // Up arrow
        snake.dy = -grid;
        snake.dx = 0;
    } else if (e.which === 39 && snake.dx === 0) { // Right arrow
        snake.dx = grid;
        snake.dy = 0;
    } else if (e.which === 40 && snake.dy === 0) { // Down arrow
        snake.dy = grid;
        snake.dx = 0;
    }

    // Prevent default behavior for arrow keys
    if ([37, 38, 39, 40].includes(e.which)) {
        e.preventDefault();
    }
});
