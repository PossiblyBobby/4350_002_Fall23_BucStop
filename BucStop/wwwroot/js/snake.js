/**
 * Improved Snake Game
 *
 * Original base game created by straker on GitHub:
 * https://gist.github.com/straker/81b59eecf70da93af396f963596dfdc5
 *
 * Improvements and modifications by Jean Bilong and Christian Crawford, Spring 2024, ETSU.
 * Enhancements include modularization, use of ES6 features, improved game loop,
 * and additional game states for a better user experience.
 * 
 * The game begins with the leaderboard and start button displayed. When the start button
 * is pressed the game should begin. The snake eats food to score points. When the snake
 * collides with itself the game is over and it prompts for player's initials. It updates
 * the leaderboard. It then shows the leaderboard and start button so the player can choose to play again
 * 
 */



function updateLeaderboardRepo(score, initials) {
    fetch('https://localhost:7078/bucstopapi/gameinfo/updateleaderboard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            gameName: "Snake",
            initials: initials,
            score: score,
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Leaderboard updated successfully.');
            } else {
                console.error('Failed to update leaderboard early in JavaScript:', data.message);
            }
        })
        .catch((error) => console.error('Error updating leaderboard in JavaScript:', error));
}

// Calls the leaderboard and initializes the game
document.addEventListener('DOMContentLoaded', initializeGame);
// Leaderboard logic
let leaderboard = JSON.parse(localStorage.getItem('snakeLeaderboard')) || [];
let gameStarted = false;
const maxLeaderboardEntries = 10;

// Function to update the leaderboard with a new score
function updateLeaderboard(newScore) {
    const initials = prompt('Enter your initials (max 3 characters):').substr(0, 3);
    leaderboard.push({ score: newScore, initials });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, maxLeaderboardEntries);
    localStorage.setItem('snakeLeaderboard', JSON.stringify(leaderboard));
}
// Creates the leaderboard
function drawLeaderboard() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Use a monospace font for equal character width
    context.font = '20px Monospace';  // Monospace font for even alignment
    context.fillStyle = 'black';

    const title = 'Snake Leaderboard';

    // Start drawing the leaderboard from the top of the canvas
    let startY = 30;
    const titleX = canvas.width / 2 - context.measureText(title).width / 2;
    context.fillText(title, titleX + 60, startY);  // Draw title above the leaderboard entries
    context.textAlign = 'center'
    // Calculate maximum width of initials and scores for alignment
    let maxInitialsWidth = 0;
    let maxScoreWidth = 0;
    leaderboard.forEach((entry) => {
        const initialsWidth = context.measureText(entry.initials.toUpperCase()).width;
        const scoreWidth = context.measureText(entry.score.toString()).width;
        if (initialsWidth > maxInitialsWidth) {
            maxInitialsWidth = initialsWidth;
        }
        if (scoreWidth > maxScoreWidth) {
            maxScoreWidth = scoreWidth;
        }
    });

    // Calculate starting X position based on the widest element (for centering)
    const startX = (canvas.width - (maxInitialsWidth + maxScoreWidth + 40)) / 2; // 40 is padding between columns

    // Display each leaderboard entry in a table-like format
    leaderboard.forEach((entry, index) => {
        const initials = entry.initials.toUpperCase();
        const score = entry.score.toString();
        const rowY = startY + 32 * (index + 1);

        // Draw initials and scores in 'columns'
        context.fillText(initials, startX, rowY);
        context.fillText(score, startX + maxInitialsWidth + 40, rowY);  // Add padding for the second column
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

// Global variables for handling initials input
let currentPlayerInitials = '';
let awaitingInitials = false;

// Function to draw text input on the canvas
function drawTextInput() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawLeaderboard(); // Optional: Redraw the leaderboard in the background
    context.font = '20px Monospace';
    context.fillStyle = 'black';
    context.fillText('Enter your initials:', canvas.width / 2 - 100, canvas.height / 2 - 20);
    context.fillText(currentPlayerInitials + '_', canvas.width / 2 - 100, canvas.height / 2 + 20);
    awaitingInitials = true;
}

// Event listener for capturing initials input
document.addEventListener('keydown', handleKeyInput);

// Function to handle keyboard input for initials
function handleKeyInput(event) {
    const allowedChars = /^[A-Za-z]$/;
    if (awaitingInitials && allowedChars.test(event.key) && currentPlayerInitials.length < 3) {
        currentPlayerInitials += event.key.toUpperCase();
        drawTextInput(); // Refresh the input display
    }

    if (event.keyCode === 13 && currentPlayerInitials.length > 0) { // Enter key to finalize input
        awaitingInitials = false;
        updateLeaderboard(score, currentPlayerInitials);
        updateLeaderboardRepo(score, currentPlayerInitials);
        currentPlayerInitials = ''; // Reset for next game
        initializeGame(); // Reset the game view
    }
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
    // Check for collision with the apple
    if (snake.cells[0].x === apple.x && snake.cells[0].y === apple.y) {
        snake.maxCells++;
        score++;
        apple = { x: getRandomInt(0, 25) * grid, y: getRandomInt(0, 25) * grid };
    }

    // Check for collision with itself
    // Start checking from the second cell to avoid comparing the head with itself
    for (let i = 1; i < snake.cells.length; i++) {
        if (snake.cells[0].x === snake.cells[i].x && snake.cells[0].y === snake.cells[i].y) {
            // Reset the game if there's a collision with itself
            resetGame();
            break; // Exit the loop as the game is over
        }
    }
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

function promptForInitials() {
    return new Promise(resolve => {
        const initials = prompt('Enter your initials (max 3 characters):');
        resolve(initials ? initials.substr(0, 3) : 'AAA'); // Default initials if none entered
    });
}

// Function to reset the game after a collision with the snake itself
async function resetGame() {
    drawTextInput();
    const newScore = score;
    const initials = await promptForInitials();
    updateLeaderboard(newScore, initials);

    score = 0;
    snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid;
    snake.dy = 0;
    apple = { x: getRandomInt(0, 25) * grid, y: getRandomInt(0, 25) * grid };
    gameStarted = false;

    // Call drawLeaderboard and drawStartButton after the player has entered their initials
    drawLeaderboard();
    drawStartButton();
}

// updates the leaderboard
function updateLeaderboard(newScore, initials) {
    leaderboard.push({ score: newScore, initials: initials.substr(0, 3) });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, maxLeaderboardEntries);
    localStorage.setItem('snakeLeaderboard', JSON.stringify(leaderboard));
    drawLeaderboard(); // Refresh the leaderboard display
}


// Start button functionality
function drawStartButton() {
    const buttonWidth = 100;
    const buttonHeight = 30;
    const buttonX = canvas.width / 2 - buttonWidth / 2;
    const buttonY = canvas.height - buttonHeight - 2; // 20 pixels above the bottom edge

    context.fillStyle = 'blue';
    context.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    context.fillStyle = 'white';
    context.textAlign = 'center';
    // Use a monospace font for equal character width
    context.font = '10px Monospace';  // Monospace font for even alignment
    context.textBaseline = 'middle';
    context.fillText('Start Game', canvas.width / 2, buttonY + buttonHeight / 2);
}

// Listener for the start button
canvas.addEventListener('click', function (event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const buttonWidth = 100;
    const buttonHeight = 50;
    const buttonX = canvas.width / 2 - buttonWidth / 2;
    const buttonY = canvas.height - buttonHeight - 20;

    if (x > buttonX && x < buttonX + buttonWidth &&
        y > buttonY && y < buttonY + buttonHeight && !gameStarted) {
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
    gameStarted = false; // Ensure the game state is reset
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
