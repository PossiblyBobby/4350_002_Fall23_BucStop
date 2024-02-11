/**
 * Improved Snake Game
 *
 * Original base game created by straker on GitHub:
 * https://gist.github.com/straker/81b59eecf70da93af396f963596dfdc5
 *
 * Improvements and modifications by Jean Bilong, Spring 2024, ETSU.
 * Enhancements include modularization, use of ES6 features, improved game loop,
 * and additional game states for a better user experience.
 */

// Setup canvas and context for drawing
const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

// Define grid size for the game board
const grid = 16;
// Frame counter to control game speed
let count = 0;

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
  requestAnimationFrame(gameLoop);

  // Control game update speed by skipping frame updates
  if (++count < 6) {
    return;
  }

  count = 0;
  // Clear the canvas for the new frame
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Update snake position and check for game events
  moveSnake();
  checkCollision();
  // Draw apple and snake on the canvas
  drawApple();
  drawSnake();
}

// Function to update the snake's position and handle wrapping
function moveSnake() {
  // Update snake position based on direction
  snake.x += snake.dx;
  snake.y += snake.dy;

  // Handle wrapping of snake position horizontally and vertically
  snake.x = wrapPosition(snake.x, canvas.width);
  snake.y = wrapPosition(snake.y, canvas.height);

  // Add new position to the beginning of the cells array
  snake.cells.unshift({ x: snake.x, y: snake.y });
  // Remove cells as snake moves to maintain its length
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
  // Check collision with the apple
  if (snake.cells[0].x === apple.x && snake.cells[0].y === apple.y) {
    snake.maxCells++;
    apple = { x: getRandomInt(0, 25) * grid, y: getRandomInt(0, 25) * grid };
  }

  // Check collision with itself, starting from the second cell
  if (
    snake.cells
      .slice(1)
      .some((cell) => cell.x === snake.x && cell.y === snake.y)
  ) {
    resetGame();
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
  snake.cells.forEach((cell) => {
    context.fillRect(cell.x, cell.y, grid - 1, grid - 1); // Create a grid effect
  });
}

// Function to reset the game after a collision with the snake itself
function resetGame() {
  // Show game over message with a slight delay to ensure the canvas updates if needed
  setTimeout(() => {
    alert("Game Over! Press OK to restart.");
    // Reset snake properties
    snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid;
    snake.dy = 0;
    // Reset game speed control
    count = 0; // Ensure the game speed is reset for the new game
    // Generate new apple position
    apple = { x: getRandomInt(0, 25) * grid, y: getRandomInt(0, 25) * grid };
    // Clear any previous game loop to prevent speedup from multiple loops running
    cancelAnimationFrame(requestAnimationFrameId);
    // Restart the game loop
    requestAnimationFrame(gameLoop);
  }, 100);
}

// Event listener for keyboard input to control snake direction
document.addEventListener("keydown", (e) => {
  // Prevent the snake from reversing onto itself
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  } else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  } else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  } else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

// Start the game loop
requestAnimationFrame(gameLoop);
