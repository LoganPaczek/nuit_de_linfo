// Configuration du canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Dimensions du canvas (carré au centre)
const CANVAS_SIZE = 500;
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

// Variables du jeu
let gameRunning = false;
let gamePaused = false;
let score = 0;
let lives = 2

// Raquette
const paddle = {
    x: CANVAS_SIZE / 2 - 60,
    y: CANVAS_SIZE - 30,
    width: 120,
    height: 15,
    speed: 8,
    color: '#4CAF50'
};

// Balle
const ball = {
    x: CANVAS_SIZE / 2,
    y: CANVAS_SIZE - 60,
    radius: 10,
    dx: 4,
    dy: -4,
    color: '#FFD700',
    speed: 4
};

// Configuration des briques
const brickConfig = {
    rows: 3,
    cols: 6,
    width: 60,
    height: 25,
    padding: 5,
    offsetTop: 50,
    offsetLeft: 30,
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1']
};

let bricks = [];

// Initialisation des briques
function initBricks() {
    bricks = [];
    for (let r = 0; r < brickConfig.rows; r++) {
        for (let c = 0; c < brickConfig.cols; c++) {
            bricks.push({
                x: c * (brickConfig.width + brickConfig.padding) + brickConfig.offsetLeft,
                y: r * (brickConfig.height + brickConfig.padding) + brickConfig.offsetTop,
                width: brickConfig.width,
                height: brickConfig.height,
                color: brickConfig.colors[r],
                visible: true
            });
        }
    }
}

// Dessiner la raquette
function drawPaddle() {
    ctx.fillStyle = paddle.color;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Dessiner la balle
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

// Dessiner les briques
function drawBricks() {
    bricks.forEach(brick => {
        if (brick.visible) {
            ctx.fillStyle = brick.color;
            ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 1;
            ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
        }
    });
}

// Mettre à jour la position de la raquette
function updatePaddle() {
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        paddle.x = Math.max(0, paddle.x - paddle.speed);
    }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        paddle.x = Math.min(CANVAS_SIZE - paddle.width, paddle.x + paddle.speed);
    }
}

// Mettre à jour la position de la balle
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Collision avec les murs latéraux
    if (ball.x + ball.radius > CANVAS_SIZE || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }

    // Collision avec le mur du haut
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }

    // Collision avec le mur du bas (perte de vie)
    if (ball.y + ball.radius > CANVAS_SIZE) {
        lives--;
        document.getElementById('lives').textContent = lives;
        resetBall();
        if (lives <= 0) {
            endGame();
        }
    }

    // Collision avec la raquette
    if (ball.y + ball.radius > paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width &&
        ball.y < paddle.y + paddle.height) {
        ball.dy = -Math.abs(ball.dy);
        // Angle selon où la balle touche la raquette
        const hitPos = (ball.x - paddle.x) / paddle.width;
        ball.dx = (hitPos - 0.5) * 8;
    }

    // Collision avec les briques
    bricks.forEach(brick => {
        if (brick.visible) {
            if (ball.x + ball.radius > brick.x &&
                ball.x - ball.radius < brick.x + brick.width &&
                ball.y + ball.radius > brick.y &&
                ball.y - ball.radius < brick.y + brick.height) {
                brick.visible = false;
                ball.dy = -ball.dy;
                score += 10;
                document.getElementById('score').textContent = score;

                // Vérifier si toutes les briques sont détruites
                if (bricks.every(b => !b.visible)) {
                    initBricks();
                    resetBall();
                    ball.speed += 0.5;
                }
            }
        }
    });
}

// Réinitialiser la balle
function resetBall() {
    ball.x = CANVAS_SIZE / 2;
    ball.y = CANVAS_SIZE - 60;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = -ball.speed;
}

// Gestion des touches
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Boucle de jeu
function gameLoop() {
    if (!gameRunning || gamePaused) {
        return;
    }

    // Effacer le canvas
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Dessiner les éléments
    drawBricks();
    drawPaddle();
    drawBall();

    // Mettre à jour les positions
    updatePaddle();
    updateBall();

    requestAnimationFrame(gameLoop);
}

// Démarrer le jeu
function startGame() {
    gameRunning = true;
    gamePaused = false;
    score = 0;
    lives = 3;
    ball.speed = 4;
    document.getElementById('score').textContent = score;
    document.getElementById('lives').textContent = lives;
    document.getElementById('gameOver').classList.add('hidden');
    initBricks();
    resetBall();
    gameLoop();
}

// Mettre en pause / Reprendre
function togglePause() {
    if (!gameRunning) return;
    gamePaused = !gamePaused;
    if (!gamePaused) {
        gameLoop();
    }
}

// Fin du jeu
function endGame() {
    gameRunning = false;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOver').classList.remove('hidden');
}

// Événements des boutons
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('pauseBtn').addEventListener('click', togglePause);
document.getElementById('restartBtn').addEventListener('click', startGame);

// Initialisation
initBricks();

