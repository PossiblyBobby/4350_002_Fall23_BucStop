/*
 * Ping-Pong Fever!
 *
 * Base game created by straker on GitHub
 *  https://gist.github.com/straker/81b59eecf70da93af396f963596dfdc5
 *
 * Extended by Chris Seals and Jacob Klucher
 *
 * Fall 2023, ETSU
 *
 * Edited by Christian Crawford
 *
 * Spring 2024, ETSU
 *
 * Edited By Jean Bilong
 *
 * Spring 2024, ETSU
 */

const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const grid = 15; // Standard size used by most elements. Also provides offset to prevent elements from going off the left side.
const paddleWidth = grid * 5; // 75 normally
const maxPaddleX = canvas.width - grid - paddleWidth; // The furthest that a paddle can move to the right

var paddleSpeed = 5; // Speed that the paddle moves per tick
var ballSpeed = 4; // Speed that the ball moves per tick
var playerScore = 0;
var computerScore = 0;
var resetting = false;
var allowResetClick = false; // This flag will control if the click should reset the game
var animationFrameId; // Track the animation frame ID

// Struct which holds the data for the top paddle (the computer)
const topPaddle = {
  // start in the middle of the game on the top side
  // X and y position of this object is the top left point
  y: grid * 2,
  x: canvas.width / 2 - paddleWidth / 2,
  height: grid,
  width: paddleWidth,

  // paddle velocity
  dy: 0,
};

// Struct which holds data for the bottom paddle (the user)
const bottomPaddle = {
  // start in the middle of the game on the bottom side
  // X and y position of this object is the top left point
  y: canvas.height - grid * 3,
  x: canvas.width / 2 - paddleWidth / 2,
  height: grid,
  width: paddleWidth,

  // paddle velocity
  dy: 0,
};

// Struct which holds the data for the key state. Instead of directly changing the paddle's velocity (dy) on key down and key up events, maintain an object that tracks the state of the arrow keys.
const keyState = {
  left: false,
  right: false,
};

// Struct which holds the data for the ball
const ball = {
  // start in the middle of the game
  // X and y position of the ball is the top left corner
  x: canvas.width / 2 - grid / 2, // Adjust for grid size
  y: canvas.height / 2 - grid / 2, // Adjust for grid size
  width: grid,
  height: grid,

  // keep track of when need to reset the ball position
  resetting: false,

  // ball velocity (start going to the top-right corner)
  dy: ballSpeed,
  dx: -ballSpeed,
};

// check for collision between two objects using axis-aligned bounding box (AABB)
// @see https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
function collides(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
}

// Add an AI-controlled paddle
const aiPaddleSpeed = 3; // Adjust the AI paddle speed as needed

// Function to control the AI paddle
function controlAIPaddle() {
  // Calculate the AI paddle's target position based on the ball's position
  const targetX = ball.x - topPaddle.width / 2;

  // Calculate the difference between the current position and the target position
  const dx = targetX - topPaddle.x;

  // Limit the AI paddle's maximum speed
  const aiPaddleVelocity = Math.min(aiPaddleSpeed, Math.abs(dx));

  // Move the AI paddle towards the target position
  if (dx > 0) {
    topPaddle.dy = aiPaddleVelocity;
  } else {
    topPaddle.dy = -aiPaddleVelocity;
  }
}

// Function to reset the game
function resetGame() {
  // Reset the game state
  allowResetClick = false; // Prevent further resets until the game is over
  // Reset the ball and paddle positions
  ball.x = canvas.width / 2 - grid / 2; // Adjust for grid size
  ball.y = canvas.height / 3 - grid / 2; // Ball set higher for more reaction time by the user
  // Recenter the two paddles
  topPaddle.x = canvas.width / 2 - paddleWidth / 2;
  bottomPaddle.x = canvas.width / 2 - paddleWidth / 2;

  // Reset the ball's velocity
  ball.dy = ballSpeed;
  ball.dx = Math.random() < 0.5 ? ballSpeed : -ballSpeed; // Randomizes ball direction per round
  resetting = false;
}

// Function to end the game
function endGame() {
  resetting = true;
  allowResetClick = true; // Allow the game to be reset by clicking
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);
  // Display the winner
  const winner = playerScore === 7 ? "Player" : "Computer";
  context.font = "36px Arial";
  // If-statement for positioning how the winner is displayed
  if (winner == "Player") {
    context.fillText(
      `${winner} wins!`,
      canvas.width / 2 - 100,
      canvas.height / 2
    );
  } else {
    context.fillText(
      `${winner} wins!`,
      canvas.width / 2 - 125,
      canvas.height / 2
    );
  }
  // Stop the game loop
  cancelAnimationFrame(loop);
}

function restartGame() {
  // Reset the game state
  allowResetClick = false; // Prevent further resets until the game is over
  // Reset speeds to their initial values
  paddleSpeed = 5; // Initial paddle speed
  ballSpeed = 4; // Initial ball speed
  // Reset scores
  playerScore = 0;
  computerScore = 0;

  // Reset paddle and ball positions
  resetGame(); // Assuming this function resets the ball and paddles to their starting positions

  // Ensure resetting is false so the game won't immediately restart on click
  resetting = false;

  // Ensure any existing game loop is stopped
  cancelAnimationFrame(animationFrameId);

  // Restart the game loop
  animationFrameId = requestAnimationFrame(loop);
}

// game loop
function loop() {
  // Cancel any previous frame request
  cancelAnimationFrame(animationFrameId);

  requestAnimationFrame(loop);
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Control the AI paddle
  controlAIPaddle();

  // move paddles by their velocity
  topPaddle.x += topPaddle.dy;
  // Move the paddle based on key state
  if (keyState.left && !keyState.right) {
    // Move left
    bottomPaddle.x -= paddleSpeed;
  } else if (keyState.right && !keyState.left) {
    // Move right
    bottomPaddle.x += paddleSpeed;
  }

  // prevent paddles from going through walls
  if (topPaddle.x < grid) {
    topPaddle.x = grid;
  } else if (topPaddle.x > maxPaddleX) {
    topPaddle.x = maxPaddleX;
  }

  if (bottomPaddle.x < grid) {
    bottomPaddle.x = grid;
  } else if (bottomPaddle.x > maxPaddleX) {
    bottomPaddle.x = maxPaddleX;
  }

  // draw paddles
  context.fillStyle = "black";
  context.fillRect(topPaddle.x, topPaddle.y, topPaddle.width, topPaddle.height);
  context.fillRect(
    bottomPaddle.x,
    bottomPaddle.y,
    bottomPaddle.width,
    bottomPaddle.height
  );

  // move ball by its velocity
  ball.x += ball.dx;
  ball.y += ball.dy;

  // prevent ball from going through walls by changing its velocity
  if (ball.x < grid) {
    ball.x = grid;
    ball.dx *= -1;
  } else if (ball.x + grid > canvas.width - grid) {
    ball.x = canvas.width - grid * 2;
    ball.dx *= -1;
  }

  // reset ball if computer scores
  if (ball.y > canvas.height && !resetting) {
    computerScore++;
    if (computerScore !== 7) {
      resetting = true;
      setTimeout(function () {
        resetGame();
      }, 1000);
    }
  }
  // reset ball if player scores
  if (ball.y < 0 && !resetting) {
    playerScore++;
    if (playerScore !== 7) {
      resetting = true;
      setTimeout(function () {
        resetGame();
      }, 1000);
    }
  }

  // Display the scores
  context.font = "24px Arial";
  context.fillText(`Player: ${playerScore}`, 20, 30);
  context.fillText(`Computer: ${computerScore}`, canvas.width - 150, 30);

  // End the game if either player or computer reaches 7 points
  if (playerScore === 7 || computerScore === 7) {
    endGame();
  }

  // check to see if ball collides with paddle. if they do change y velocity
  if (collides(ball, topPaddle)) {
    ball.dy *= -1;

    // move ball next to the paddle otherwise the collision will happen again
    // in the next frame
    ball.y = topPaddle.y + topPaddle.height;
  } else if (collides(ball, bottomPaddle)) {
    ball.dy *= -1;

    // move ball next to the paddle otherwise the collision will happen again
    // in the next frame
    ball.y = bottomPaddle.y - ball.height;
  }

  // draw ball
  context.fillRect(ball.x, ball.y, ball.width, ball.height);

  // draw walls
  context.fillStyle = "black";
  context.fillRect(0, 0, grid, canvas.height);
  context.fillRect(canvas.width - grid, 0, canvas.width, canvas.height);

  // Request the next animation frame and store its ID
  animationFrameId = requestAnimationFrame(loop);
}

// listen to keyboard events to move the paddles
document.addEventListener("keydown", function (e) {
  if (e.which === 37) {
    // Left arrow key
    keyState.left = true;
  } else if (e.which === 39) {
    // Right arrow key
    keyState.right = true;
  }
});

// listen to keyboard events to stop the paddle if key is released
document.addEventListener("keyup", function (e) {
  if (e.which === 37) {
    // Left arrow key
    keyState.left = false;
  } else if (e.which === 39) {
    // Right arrow key
    keyState.right = false;
  }
});

canvas.addEventListener("click", function () {
  if (resetting && allowResetClick) {
    // Only restart the game if it's in a resettable state
    restartGame();
    allowResetClick = false; // Prevent further resets until the game is over
  }
});

// start the game
requestAnimationFrame(loop);
