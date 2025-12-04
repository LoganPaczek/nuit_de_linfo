// Configuration du canvas
const canvas = document.getElementById('flappyBirdCanvas');
const ctx = canvas.getContext('2d');

// Améliorer la qualité du rendu
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

// Dimensions du canvas (carré au centre)
const CANVAS_SIZE = 500;
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

// Variables du jeu
let gameRunning = false;
let gamePaused = false;
let score = 0;
let highScore = localStorage.getItem('flappyBirdHighScore') || 0;
let lives = 2;
let gameSpeed = 2;

// Oiseau
const bird = {
    x: 100,
    y: CANVAS_SIZE / 2,
    width: 30,
    height: 30,
    velocity: 0,
    gravity: 0.5,
    jumpPower: -8,
    color: '#FFD700'
};

// Tuyaux
const pipes = [];
const pipeConfig = {
    width: 60,
    gap: 150,
    speed: 2,
    spacing: 200
};

let nextPipeX = CANVAS_SIZE;

// Initialiser le meilleur score
document.getElementById('highScore').textContent = highScore;

// Dessiner le fond
function drawBackground() {
    // Ciel dégradé
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_SIZE);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.5, '#98D8C8');
    gradient.addColorStop(1, '#4ECDC4');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Nuages
    drawClouds();
}

// Dessiner des nuages
function drawClouds() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    for (let i = 0; i < 3; i++) {
        const x = (Date.now() / 50 + i * 200) % (CANVAS_SIZE + 100) - 50;
        const y = 50 + i * 80;
        drawCloud(x, y);
    }
}

function drawCloud(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.arc(x + 25, y, 30, 0, Math.PI * 2);
    ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
    ctx.fill();
}

// Dessiner l'oiseau
function drawBird() {
    ctx.save();

    // Rotation selon la vélocité
    const rotation = Math.min(Math.max(bird.velocity * 0.1, -0.5), 0.5);
    ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
    ctx.rotate(rotation);

    // Corps de l'oiseau (cercle)
    ctx.beginPath();
    ctx.arc(0, 0, bird.width / 2, 0, Math.PI * 2);
    ctx.fillStyle = bird.color;
    ctx.fill();
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Œil
    ctx.beginPath();
    ctx.arc(5, -5, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(6, -5, 2, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();

    // Bec
    ctx.beginPath();
    ctx.moveTo(bird.width / 2 - 2, 0);
    ctx.lineTo(bird.width / 2 + 8, -3);
    ctx.lineTo(bird.width / 2 + 8, 3);
    ctx.closePath();
    ctx.fillStyle = '#FF6347';
    ctx.fill();

    ctx.restore();
}

// Dessiner les tuyaux
function drawPipes() {
    pipes.forEach(pipe => {
        // Tuyau du haut
        ctx.fillStyle = '#228B22';
        ctx.fillRect(pipe.x, 0, pipeConfig.width, pipe.topHeight);

        // Bordure du tuyau du haut
        ctx.strokeStyle = '#006400';
        ctx.lineWidth = 3;
        ctx.strokeRect(pipe.x, 0, pipeConfig.width, pipe.topHeight);

        // Capuchon du tuyau du haut
        ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, pipeConfig.width + 10, 20);
        ctx.strokeRect(pipe.x - 5, pipe.topHeight - 20, pipeConfig.width + 10, 20);

        // Tuyau du bas
        const bottomY = pipe.topHeight + pipeConfig.gap;
        ctx.fillRect(pipe.x, bottomY, pipeConfig.width, CANVAS_SIZE - bottomY);
        ctx.strokeRect(pipe.x, bottomY, pipeConfig.width, CANVAS_SIZE - bottomY);

        // Capuchon du tuyau du bas
        ctx.fillRect(pipe.x - 5, bottomY, pipeConfig.width + 10, 20);
        ctx.strokeRect(pipe.x - 5, bottomY, pipeConfig.width + 10, 20);
    });
}

// Mettre à jour l'oiseau
function updateBird() {
    if (!gameRunning || gamePaused) return;

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Limites du canvas
    if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }
    if (bird.y + bird.height > CANVAS_SIZE) {
        bird.y = CANVAS_SIZE - bird.height;
        hitGround();
    }
}

// Faire sauter l'oiseau
function jump() {
    if (!gameRunning || gamePaused) return;
    bird.velocity = bird.jumpPower;
}

// Mettre à jour les tuyaux
function updatePipes() {
    if (!gameRunning || gamePaused) return;

    // Créer un nouveau tuyau
    if (nextPipeX < 0) {
        createPipe();
        nextPipeX = pipeConfig.spacing;
    }
    nextPipeX -= pipeConfig.speed * gameSpeed;

    // Mettre à jour les tuyaux existants
    pipes.forEach((pipe, index) => {
        pipe.x -= pipeConfig.speed * gameSpeed;

        // Vérifier si l'oiseau a passé le tuyau
        if (!pipe.passed && pipe.x + pipeConfig.width < bird.x) {
            pipe.passed = true;
            score++;
            document.getElementById('score').textContent = score;

            // Augmenter la vitesse progressivement
            gameSpeed = Math.min(gameSpeed + 0.01, 3);
        }

        // Vérifier les collisions
        if (checkCollision(pipe)) {
            hitPipe();
        }
    });

    // Supprimer les tuyaux hors écran
    pipes.forEach((pipe, index) => {
        if (pipe.x + pipeConfig.width < 0) {
            pipes.splice(index, 1);
        }
    });
}

// Créer un nouveau tuyau
function createPipe() {
    const minHeight = 50;
    const maxHeight = CANVAS_SIZE - pipeConfig.gap - minHeight;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;

    pipes.push({
        x: CANVAS_SIZE,
        topHeight: topHeight,
        passed: false
    });
}

// Vérifier les collisions
function checkCollision(pipe) {
    const birdRight = bird.x + bird.width;
    const birdBottom = bird.y + bird.height;
    const pipeRight = pipe.x + pipeConfig.width;
    const bottomY = pipe.topHeight + pipeConfig.gap;

    if (bird.x < pipeRight && birdRight > pipe.x) {
        if (bird.y < pipe.topHeight || birdBottom > bottomY) {
            return true;
        }
    }
    return false;
}

// Collision avec le sol
function hitGround() {
    lives--;
    document.getElementById('lives').textContent = lives;
    if (lives <= 0) {
        endGame();
    } else {
        resetBird();
    }
}

// Collision avec un tuyau
function hitPipe() {
    lives--;
    document.getElementById('lives').textContent = lives;
    if (lives <= 0) {
        endGame();
    } else {
        resetBird();
        // Retirer le tuyau qui a causé la collision
        pipes.shift();
    }
}

// Réinitialiser l'oiseau
function resetBird() {
    bird.y = CANVAS_SIZE / 2;
    bird.velocity = 0;
    nextPipeX = CANVAS_SIZE;
    pipes.length = 0;
    gameSpeed = 2;
}

// Gestion des touches et clics
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        jump();
    }
    if (e.code === 'KeyP') {
        togglePause();
    }
});

canvas.addEventListener('click', () => {
    jump();
});

// Boucle de jeu
function gameLoop() {
    if (!gameRunning || gamePaused) {
        return;
    }

    // Dessiner
    drawBackground();
    drawPipes();
    drawBird();

    // Mettre à jour
    updateBird();
    updatePipes();

    requestAnimationFrame(gameLoop);
}

// Démarrer le jeu
function startGame() {
    gameRunning = true;
    gamePaused = false;
    score = 0;
    lives = 2;
    gameSpeed = 2;
    document.getElementById('score').textContent = score;
    document.getElementById('lives').textContent = lives;
    document.getElementById('flappyBirdOver').classList.add('hidden');
    hideSuccess();
    resetBird();
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

// Afficher le message de succès
function showSuccess() {
    document.getElementById('flappyBirdSuccess').classList.remove('hidden');
    setTimeout(() => {
        hideSuccess();
    }, 2000);
}

// Masquer le message de succès
function hideSuccess() {
    document.getElementById('flappyBirdSuccess').classList.add('hidden');
}

// Fin du jeu
function endGame() {
    gameRunning = false;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('flappyBirdOver').classList.remove('hidden');

    // Vérifier le meilleur score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('flappyBirdHighScore', highScore);
        document.getElementById('highScore').textContent = highScore;
        showSuccess();
    }
}

// Événements des boutons
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('pauseBtn').addEventListener('click', togglePause);
document.getElementById('restartBtn').addEventListener('click', startGame);

// Initialisation
resetBird();

