document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('pingPongCanvas');
    const ctx = canvas.getContext('2d');

    const paddleWidth = 10;
    const paddleHeight = 60;
    const ballSize = 10;

    let paddle1Y = canvas.height / 2 - paddleHeight / 2;
    let paddle2Y = canvas.height / 2 - paddleHeight / 2;
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 2;
    let ballSpeedY = 2;

    let player1Score = 0;
    let player2Score = 0;

    const maxScore = 5;

    let gameOver = false;

    function draw() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw paddles
        drawPaddle(0, paddle1Y, paddleWidth, paddleHeight);
        drawPaddle(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);

        // Draw the ball
        drawBall(ballX, ballY, ballSize);

        // Draw the scores
        drawScore();

        // Move the ball
        if (!gameOver) {
            ballX += ballSpeedX;
            ballY += ballSpeedY;

            // Check for collisions with walls
            if (ballY < 0 || ballY > canvas.height) {
                ballSpeedY = -ballSpeedY;
            }

            // Check for collisions with paddles
            if (
                (ballX < paddleWidth && ballY > paddle1Y && ballY < paddle1Y + paddleHeight) ||
                (ballX > canvas.width - paddleWidth - ballSize &&
                    ballY > paddle2Y && ballY < paddle2Y + paddleHeight)
            ) {
                ballSpeedX = -ballSpeedX;
            }

            // AI for the right paddle
            if (ballX > canvas.width / 2) {
                if (paddle2Y + paddleHeight / 2 < ballY) {
                    paddle2Y += 1.5;
                } else {
                    paddle2Y -= 1.5;
                }
            }

            // Check for scoring
            if (ballX < 0) {
                // Player 2 scores
                player2Score++;
                if (player2Score === maxScore) {
                    displayWinMessage("Player 2");
                    gameOver = true;
                } else {
                    resetBall();
                }
            } else if (ballX > canvas.width) {
                // Player 1 scores
                player1Score++;
                if (player1Score === maxScore) {
                    displayWinMessage("Player 1");
                    gameOver = true;
                } else {
                    resetBall();
                }
            }
        }

        // Repeat the draw function
        requestAnimationFrame(draw);
    }

    function drawPaddle(x, y, width, height) {
        ctx.fillStyle = '#000';
        ctx.fillRect(x, y, width, height);
    }

    function drawBall(x, y, size) {
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawScore() {
        ctx.fillStyle = '#000';
        ctx.font = '18px Arial';
        ctx.fillText(`Player 1: ${player1Score}`, 50, 30);
        ctx.fillText(`Player 2: ${player2Score}`, canvas.width - 150, 30);
    }

    function resetBall() {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = -ballSpeedX;
    }

    function restartGame() {
        resetScores();
        resetBall();
        gameOver = false;
        draw();
    }

    function resetScores() {
        player1Score = 0;
        player2Score = 0;
    }

    function displayWinMessage(player) {
        alert(`${player} wins! refresh page to play again`);
    }

    function showRestartButton() {
        const restartButton = document.getElementById('restartButton');
        restartButton.style.display = 'block';
    }

    function hideRestartButton() {
        const restartButton = document.getElementById('restartButton');
        restartButton.style.display = 'none';
    }

    // Listen for mouse movement to control the left paddle
    canvas.addEventListener('mousemove', (e) => {
        const mouseY = calculateMousePos(e).y;
        paddle1Y = mouseY - paddleHeight / 2;
    });

    // Function to calculate mouse position on the canvas
    function calculateMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        const root = document.documentElement;
        const mouseX = e.clientX - rect.left - root.scrollLeft;
        const mouseY = e.clientY - rect.top - root.scrollTop;
        return { x: mouseX, y: mouseY };
    }

    // Start the game loop
    draw();
});
