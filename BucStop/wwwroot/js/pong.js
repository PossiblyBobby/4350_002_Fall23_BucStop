
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

function updateLeaderboardRepo(score, initials) {
    fetch('https://localhost:7078/bucstopapi/gameinfo/updateleaderboard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            gameName: "Pong",
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
            updateLeaderboardRepo(playerScore, initials);
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

document.addEventListener('touchmove', function (e) {
    e.preventDefault();
    let touch = e.touches[0];
    bottomPaddle.x = touch.clientX - bottomPaddle.width / 2;
}, false);


    if (isInside(clickPosition, startButton)) {
        startGame();
    }
});

initializeGame();
