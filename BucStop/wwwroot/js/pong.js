
/*This is the JavaScript code for the Pong game with a timer and leaderboard functionality.
It should begin by displaying the current leaderboard on the canvas. Then the start button should appear.
Press the start button and the leaderboard and start button dissapear. The game is played. Then when the 
timer expires the game is over. The final scores are displayed. The player is promped to enter thier initials. 
The leaderboard is updated and the leaderboard and start button appear again to see if the player wants to plat again.*/

// Define all your variables and functions at the top level
// Get the canvas element and its context
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

// Set the size of the canvas
canvas.width = 600;
canvas.height = 800;

// Define basic measurements for game objects
const grid = 15;
const paddleWidth = grid * 5;
const paddleHeight = grid;

// Set initial speeds for paddles and ball
let topPaddleSpeed = 3.6;
let bottomPaddleSpeed = 9;
let ballSpeed = 4;

// Initialize scores and game state variables
let playerScore = 0;
let computerScore = 0;
let gameActive = false;
let totalTime = 30;
let timerId;

// Leaderboard logic
let leaderboard = JSON.parse(localStorage.getItem('pongLeaderboard')) || [];
const maxLeaderboardEntries = 10;

// Define the start button variable
let startButton;

// Initialize game objects
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
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: grid,
    height: grid,
    dy: ballSpeed,
    dx: ballSpeed
};

// Utility Functions
function isInside(point, rect) {
    return point.x >= rect.x && point.x <= rect.x + rect.width &&
        point.y >= rect.y && point.y <= rect.y + rect.height;
}

function collides(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y;
}

// Game Logic Functions
function controlAIPaddle() {
    if (!gameActive) return;
    const targetX = ball.x - topPaddle.width / 2;
    const dx = targetX - topPaddle.x;
    topPaddle.dx = dx > 0 ? Math.min(topPaddleSpeed, dx) : Math.max(-topPaddleSpeed, dx);
}

function movePaddle(paddle) {
    paddle.x += paddle.dx;
    paddle.x = Math.max(grid, Math.min(canvas.width - paddle.width - grid, paddle.x));
}

function updateScores() {
    if (ball.y < 0) {
        // Ball hits the top of the screen, player scores
        playerScore++;
        resetGame();
    } else if (ball.y + ball.height > canvas.height) {
        // Ball hits the bottom of the screen, computer scores
        computerScore++;
        resetGame();
    }
}


function checkCollisions() {
    // Check for collisions between the ball and the paddles
    if (collides(ball, topPaddle) || collides(ball, bottomPaddle)) {
        // Handle the collision by reversing the ball's direction and updating its speed
        ball.dy = -ball.dy;
        ball.dx += (ball.dx > 0 ? 1 : -1) * 0.5;

        // Adjust the ball's position to prevent it from getting stuck inside the paddle
        if (collides(ball, topPaddle)) {
            ball.y = topPaddle.y + topPaddle.height;
        } else {
            ball.y = bottomPaddle.y - ball.height;
        }
    }

    // Check for collisions between the ball and the canvas edges
    if (ball.x < 0 || ball.x + ball.width > canvas.width) {
        // Reverse the ball's horizontal direction and update its speed
        ball.dx = -ball.dx;
    }

    if (ball.y < 0 || ball.y + ball.height > canvas.height) {
        // Reverse the ball's vertical direction and update its speed
        ball.dy = -ball.dy;
    }
}

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

// Displays scores on the canvas
function displayScores() {
    // Choose a position on the canvas to display the scores, and set the font style
    context.font = '24px Arial';
    context.fillStyle = 'black';
    context.textAlign = 'left';
    context.fillText(`Player: ${playerScore}`, 20, 30);  // Display player score on the left
    context.textAlign = 'right';
    context.fillText(`Computer: ${computerScore}`, canvas.width - 20, 30);  // Display computer score on the right
}

//Displays final score at end of game
function displayFinalScore() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = '36px Arial';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(`Final Score - Player: ${playerScore}, Computer: ${computerScore}`, canvas.width / 2, canvas.height / 2);
}

function resetGame() {
    ball.x = canvas.width / 2 - grid / 2;
    ball.y = canvas.height / 2 - grid / 2;
    topPaddle.x = canvas.width / 2 - paddleWidth / 2;
    bottomPaddle.x = canvas.width / 2 - paddleWidth / 2;
    ball.dy = ballSpeed;
    ball.dx = Math.random() < 0.5 ? ballSpeed : -ballSpeed; // Randomize the ball's horizontal direction
}


// Rendering Functions
function drawGameObjects() {
    context.clearRect(0, 0, canvas.width, canvas.height);
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
function drawStartButton() {
    const buttonWidth = 100;
    const buttonHeight = 50;
    const buttonX = canvas.width / 2 - buttonWidth / 2;
    const buttonY = canvas.height - buttonHeight - 30;

    context.fillStyle = 'blue';
    context.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    context.fillStyle = 'white';
    context.font = '20px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText("Start Game", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);

    startButton = { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight };
}


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



// Game Flow Control functions
// Function to start the game, initialize scores, and set the game to active
function startGame() {
    if (gameActive) return; // Prevent restarting the game if it's already active

    gameActive = true;
    playerScore = 0;
    computerScore = 0;
    totalTime = 30; // Reset the timer to 5 minutes for each game
    resetGame();
    timerId = setInterval(updateTimer, 1000); // Start the timer

    loop(); // Start the game loop
}

function drawTimer() {
    context.font = '24px Arial';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.fillText(`Time Left: ${totalTime}`, canvas.width / 2, 25);
}

function drawLeaderboard() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Use a monospace font for equal character width
    context.font = '32px Monospace';  // Monospace font for even alignment
    context.fillStyle = 'white';

    const title = 'Leaderboard';

    // Start drawing the leaderboard from the middle of the canvas
    let startY = canvas.height / 2 - (leaderboard.length * 32) / 2;
    const titleX = canvas.width / 2 - context.measureText(title).width / 2;
    context.fillText(title, titleX, startY - 40);  // Draw title above the leaderboard entries
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



//function to end the game
function endGame() {
    clearInterval(timerId);
    gameActive = false;
    displayFinalScore();

    setTimeout(() => {
        drawLeaderboard();
        setTimeout(async () => {
            const initials = await promptForInitials();
            updateLeaderboard(playerScore, initials);
            drawLeaderboard();
            setTimeout(drawStartButton, 3000);  // Show start button after a delay
        }, 3000);  // Time to read the score before prompting
    }, 1000); // Delay before showing the leaderboard
}


// Function to prompt for player's initials on the canvas
function promptForInitials() {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter your initials';
    input.style.position = 'absolute';
    input.style.top = '50%';
    input.style.left = '50%';
    input.style.transform = 'translate(-50%, -50%)';
    input.style.fontSize = '24px';
    input.style.padding = '10px';
    input.style.border = '2px solid black';

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.style.fontSize = '24px';
    submitButton.style.padding = '10px';
    // Update the style of the submit button to lower its position
    submitButton.style.marginTop = '90px';
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';

    container.appendChild(input);
    container.appendChild(submitButton);
    document.body.appendChild(container);

    return new Promise((resolve) => {
        submitButton.addEventListener('click', () => {
            const initials = input.value || 'AAA'; // Default to "AAA" if no input
            document.body.removeChild(container);
            resolve(initials);
        });
    });
}

// Updates the leaderboard with the new score
function updateLeaderboard(score, initials) {
    // Assume leaderboard is an array of { score, initials } objects
    leaderboard.push({ score, initials });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, maxLeaderboardEntries); // Keep only top entries
    localStorage.setItem('pongLeaderboard', JSON.stringify(leaderboard));
}

function loop() {
    if (!gameActive) return;

    // Clear the canvas for the new frame
    context.clearRect(0, 0, canvas.width, canvas.height);


    // Check for scoring
    updateScores();

    // Update and render game objects
    controlAIPaddle();
    movePaddle(topPaddle);
    movePaddle(bottomPaddle);

    // Update ball position
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Check for and handle collisions
    checkCollisions();

    // Draw the game objects and display scores
    drawGameObjects();
    displayScores();
    drawTimer();

    requestAnimationFrame(loop);

}







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

// Initial setup
function initializeGame() {
    drawLeaderboard();
    drawStartButton();
}


// Add an event listener to the canvas to handle the start button click
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

initializeGame();
































/* Get the canvas element and its context to draw on it
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

// Set the size of the canvas
canvas.width = 400;
canvas.height = 500;

// Define basic measurements for game objects
const grid = 15;
const paddleWidth = grid * 5;  // Width of the paddles
const paddleHeight = grid;     // Height of the paddles

// Set initial speeds for paddles and ball
let topPaddleSpeed = 3.6;  // Speed of the AI paddle
let bottomPaddleSpeed = 9; // Speed of the player's paddle
let ballSpeed = 4;         // Speed of the ball

// Initialize scores and game state variables
let playerScore = 0;
let computerScore = 0;
let gameActive = false;    // Tracks if the game is currently active
let totalTime = 300;       // Total game time in seconds (e.g., 5 minutes)
let timerId;               // For setting and clearing the interval

// Leaderboard logic
let leaderboard = JSON.parse(localStorage.getItem('pongLeaderboard')) || [];
const maxLeaderboardEntries = 10;

// Define the start button variable at a higher scope to access it globally
let startButton;

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

// Function to draw the start button on the canvas
function drawStartButton() {
    const buttonWidth = 100;
    const buttonHeight = 50;
    const buttonX = canvas.width / 2 - buttonWidth / 2;
    const buttonY = canvas.height - buttonHeight - 30; // Position 30 pixels from the bottom

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

// Function to check if a point is inside a rectangle
function isInside(point, rect) {
    return point.x >= rect.x && point.x <= rect.x + rect.width &&
        point.y >= rect.y && point.y <= rect.y + rect.height;
}
// Function to prompt for player's initials on the canvas
function promptForInitials() {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter your initials';
    input.style.position = 'absolute';
    input.style.top = '50%';
    input.style.left = '50%';
    input.style.transform = 'translate(-50%, -50%)';
    input.style.fontSize = '24px';
    input.style.padding = '10px';
    input.style.border = '2px solid black';

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.style.fontSize = '24px';
    submitButton.style.padding = '10px';
    submitButton.style.marginTop = '10px';

    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';

    container.appendChild(input);
    container.appendChild(submitButton);
    document.body.appendChild(container);

    return new Promise((resolve) => {
        submitButton.addEventListener('click', () => {
            const initials = input.value || 'AAA'; // Default to "AAA" if no input
            document.body.removeChild(container);
            resolve(initials);
        });
    });
}


// Function to start the game, initialize scores, and set the game to active
function startGame() {
    if (gameActive) return; // Prevent restarting the game if it's already active

    gameActive = true;
    playerScore = 0;
    computerScore = 0;
    totalTime = 30; // Reset the timer to 5 minutes for each game
    resetGame();
    timerId = setInterval(updateTimer, 1000); // Start the timer

    loop(); // Start the game loop
}




// Function to end the game
function endGame() {
    clearInterval(timerId); // Stop the timer
    gameActive = false;
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Display the final score
    context.font = '36px Arial';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(`Final Score - Player: ${playerScore}, Computer: ${computerScore}`, canvas.width / 2, canvas.height / 2);

   

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
              // Set the font size 
        context.font = '32px Arial';
        context.fillStyle = 'white';
        // Display each leaderboard entry
        leaderboard.forEach((entry, index) => {
            context.fillText(`${index + 1}. ${entry.initials} - ${entry.score}`, startX, startY + 32 * (index + 1));
        });
        // Wait for a moment before prompting for initials on the canvas
        setTimeout(async () => {
            const initials = await promptForInitials();
            updateLeaderboard(playerScore, initials);
            drawLeaderboard();
            // Show the start button after the leaderboard
            setTimeout(drawStartButton, 3000); // Adjust delay as needed
        }, 3000); // Adjust delay as needed for the player to read the final score


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
            drawLeaderboard();
            updateGameObjects(); // Update positions and check for game events
            drawGameObjects(); // Draw paddles and ball on the canvas
            displayScores(); // Display the current scores
            drawTimer(); // Ensure the timer is redrawn on each frame

        }

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
}
*/