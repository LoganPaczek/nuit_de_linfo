// Configuration du canvas
const canvas = document.getElementById('breakBrickCanvas');
const ctx = canvas.getContext('2d');

// Améliorer la qualité du rendu
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

const CANVAS_SIZE = 500;
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

let gameRunning = false;
let gamePaused = false;
let score = 0;
let lives = 2;

// Images
const backgroundImage = new Image();
backgroundImage.crossOrigin = 'anonymous';
backgroundImage.src = 'images/background.jpg'; // Image de fond

const towerImage = new Image();
towerImage.crossOrigin = 'anonymous';
towerImage.src = 'images/tower.png';

let imagesLoaded = 0;
const totalImages = 2;
let allImagesReady = false;

function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        allImagesReady = true;
        console.log('Toutes les images sont chargées');
        // Redessiner si le jeu est déjà en cours
        if (gameRunning) {
            gameLoop();
        }
    }
}

backgroundImage.onload = () => {
    console.log('Image de fond chargée:', backgroundImage.width, 'x', backgroundImage.height);
    checkImagesLoaded();
};
backgroundImage.onerror = (e) => {
    console.warn('Image de fond non trouvée:', backgroundImage.src, e);
    checkImagesLoaded();
};

towerImage.onload = () => {
    console.log('Image de tour chargée:', towerImage.width, 'x', towerImage.height);
    checkImagesLoaded();
};
towerImage.onerror = (e) => {
    console.warn('Image de tour non trouvée:', towerImage.src, e);
    checkImagesLoaded();
};

const paddle = {
    x: CANVAS_SIZE / 2 - 60,
    y: CANVAS_SIZE - 30,
    width: 120,
    height: 15,
    speed: 8,
    color: '#4CAF50'
};

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
    width: 70,
    height: 40,
    padding: 5,
    offsetTop: 50,
    offsetLeft: 20,
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

// Dessiner le fond
function drawBackground() {
    if (backgroundImage.complete && backgroundImage.naturalWidth > 0 && backgroundImage.naturalHeight > 0) {
        // Dessiner l'image de fond avec meilleure qualité
        ctx.save();
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(backgroundImage, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
        ctx.restore();
    } else {
        // Fond par défaut si l'image n'est pas chargée
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }
}

// Dessiner les briques (tours d'ordinateurs)
function drawBricks() {
    bricks.forEach(brick => {
        if (brick.visible) {
            if (towerImage.complete && towerImage.naturalWidth > 0 && towerImage.naturalHeight > 0) {
                // Dessiner l'image de tour d'ordinateur avec meilleure qualité
                ctx.save();

                // Améliorer la qualité du rendu
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                // Ajouter une ombre pour plus de profondeur
                ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
                ctx.shadowBlur = 6;
                ctx.shadowOffsetX = 3;
                ctx.shadowOffsetY = 3;

                // Dessiner l'image avec un meilleur positionnement
                ctx.drawImage(
                    towerImage,
                    0, 0, towerImage.naturalWidth, towerImage.naturalHeight,
                    brick.x,
                    brick.y,
                    brick.width,
                    brick.height
                );

                ctx.restore();
            } else {
                // Fallback : rectangles colorés si l'image n'est pas chargée
                const gradient = ctx.createLinearGradient(
                    brick.x, brick.y,
                    brick.x, brick.y + brick.height
                );
                gradient.addColorStop(0, brick.color);
                gradient.addColorStop(1, darkenColor(brick.color, 20));

                ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                ctx.shadowBlur = 5;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;

                ctx.fillStyle = gradient;
                ctx.fillRect(brick.x, brick.y, brick.width, brick.height);

                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.lineWidth = 2;
                ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);

                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
            }
        }
    });
}

function darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, Math.min(255, (num >> 16) + amt));
    const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
    const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
    return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

function updatePaddle() {
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        paddle.x = Math.max(0, paddle.x - paddle.speed);
    }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        paddle.x = Math.min(CANVAS_SIZE - paddle.width, paddle.x + paddle.speed);
    }
}

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
                    // Arrêter le jeu au lieu de le relancer automatiquement
                    gameRunning = false;
                    showSuccess();
                    
                    // Sauvegarder la victoire en session
                    fetch('save_breakbrick_win.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            console.log('Victoire BreakBrick sauvegardée en session');
                        }
                    })
                    .catch(error => {
                        console.error('Erreur lors de la sauvegarde:', error);
                    });
                }
            }
        }
    });
}

function resetBall() {
    ball.x = CANVAS_SIZE / 2;
    ball.y = CANVAS_SIZE - 60;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = -ball.speed;
}

const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function gameLoop() {
    if (!gameRunning || gamePaused) {
        return;
    }

    drawBackground();

    drawBricks();
    drawPaddle();
    drawBall();

    updatePaddle();
    updateBall();

    requestAnimationFrame(gameLoop);
}

function startGame() {
    gameRunning = true;
    gamePaused = false;
    score = 0;
    lives = 2;
    ball.speed = 4;
    document.getElementById('score').textContent = score;
    document.getElementById('lives').textContent = lives;
    document.getElementById('breakBrickOver').classList.add('hidden');
    hideSuccess();
    initBricks();
    resetBall();
    gameLoop();
}


function togglePause() {
    if (!gameRunning) return;
    gamePaused = !gamePaused;
    if (!gamePaused) {
        gameLoop();
    }
}

function showSuccess() {
    document.getElementById('breakBrickSuccess').classList.remove('hidden');
}

function hideSuccess() {
    document.getElementById('breakBrickSuccess').classList.add('hidden');
}

function endGame() {
    gameRunning = false;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('breakBrickOver').classList.remove('hidden');
}

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('pauseBtn').addEventListener('click', togglePause);
document.getElementById('restartBtn').addEventListener('click', startGame);

// Bouton pour continuer vers Responsabilité après la victoire
const continueBtn = document.getElementById('continueBtn');
if (continueBtn) {
    continueBtn.addEventListener('click', () => {
        window.location.href = 'index.php?uc=Responsabilité';
    });
}

initBricks();