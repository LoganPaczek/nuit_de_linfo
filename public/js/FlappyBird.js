const canvas = document.getElementById('flappyBirdCanvas');
const ctx = canvas.getContext('2d');

ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

// Dimensions du canvas (carré au centre)
const CANVAS_SIZE = 500;
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

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

// Arbres
const trees = [];
const treeConfig = {
    width: 60,
    gap: 150,
    speed: 2,
    spacing: 200,
    trunkWidth: 20,
    foliageSize: 80  // Grand feuillage
};

let nextTreeX = CANVAS_SIZE;

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

// Dessiner les arbres
function drawTrees() {
    trees.forEach(tree => {
        const centerX = tree.x + treeConfig.width / 2;
        const treeWidth = treeConfig.width;

        // Arbre du haut (inversé)
        drawBeautifulTree(centerX, tree.topHeight, treeWidth, true);

        // Arbre du bas
        const bottomY = tree.topHeight + treeConfig.gap;
        drawBeautifulTree(centerX, bottomY, treeWidth, false);
    });
}

// Dessiner un bel arbre stylisé
function drawBeautifulTree(centerX, baseY, width, isTop) {
    ctx.save();

    const trunkWidth = width * 0.25;
    const foliageRadius = width * 0.5;

    if (isTop) {
        // Arbre du haut - s'étend de 0 à baseY
        // Le tronc est en haut
        const trunkTop = 0;
        // Le feuillage est en bas (près du gap)
        const foliageCenterY = baseY - foliageRadius;
        const trunkBottom = foliageCenterY - foliageRadius;
        const trunkHeight = trunkBottom - trunkTop;

        // Dessiner le tronc qui remplit depuis le haut
        if (trunkHeight > 0) {
            drawBeautifulTrunk(centerX, trunkTop, trunkWidth, trunkHeight, true);
        }

        // Dessiner le feuillage en bas (près du gap)
        drawBeautifulFoliage(centerX, foliageCenterY, foliageRadius, true);
    } else {
        // Arbre du bas - s'étend de baseY à CANVAS_SIZE
        // Le feuillage est en haut (près du gap)
        const foliageCenterY = baseY + foliageRadius;
        // Le tronc va du feuillage jusqu'en bas
        const trunkTop = foliageCenterY + foliageRadius;
        const trunkHeight = CANVAS_SIZE - trunkTop;

        // Dessiner le feuillage en haut (près du gap)
        drawBeautifulFoliage(centerX, foliageCenterY, foliageRadius, false);

        // Dessiner le tronc qui remplit jusqu'en bas
        if (trunkHeight > 0) {
            drawBeautifulTrunk(centerX, trunkTop, trunkWidth, trunkHeight, false);
        }
    }

    ctx.restore();
}

// Dessiner un beau feuillage
function drawBeautifulFoliage(centerX, centerY, radius, isTop) {
    ctx.save();

    // Ombre portée
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = isTop ? -3 : 3;

    // Couche principale - grand cercle avec dégradé
    const mainGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
    );
    mainGradient.addColorStop(0, '#0d5f0d');
    mainGradient.addColorStop(0.3, '#1a7a1a');
    mainGradient.addColorStop(0.6, '#228B22');
    mainGradient.addColorStop(1, '#32CD32');

    ctx.fillStyle = mainGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Couche 2 - cercles moyens pour volume
    ctx.fillStyle = '#228B22';
    const offset1 = radius * 0.4;
    const offset2 = radius * 0.3;

    // Cercles latéraux
    ctx.beginPath();
    ctx.arc(centerX - offset1, centerY - offset2, radius * 0.65, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX + offset1, centerY - offset2, radius * 0.65, 0, Math.PI * 2);
    ctx.fill();

    // Cercles verticaux
    const verticalOffset = isTop ? offset2 : -offset2;
    ctx.beginPath();
    ctx.arc(centerX, centerY + verticalOffset, radius * 0.7, 0, Math.PI * 2);
    ctx.fill();

    // Couche 3 - petits cercles pour texture
    ctx.fillStyle = '#32CD32';
    ctx.beginPath();
    ctx.arc(centerX - offset2, centerY + verticalOffset * 0.5, radius * 0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX + offset2, centerY + verticalOffset * 0.5, radius * 0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY - verticalOffset, radius * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // Highlights pour la lumière
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(centerX - radius * 0.2, centerY - radius * 0.3, radius * 0.15, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX + radius * 0.15, centerY - radius * 0.25, radius * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Bordure définie
    ctx.strokeStyle = '#006400';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
}

// Dessiner un beau tronc
function drawBeautifulTrunk(centerX, topY, width, height, isTop) {
    ctx.save();

    const trunkX = centerX - width / 2;

    // Ombre portée
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = isTop ? -2 : 2;

    // Dégradé pour le tronc
    const gradient = ctx.createLinearGradient(trunkX, topY, trunkX + width, topY);
    gradient.addColorStop(0, '#5C3317');
    gradient.addColorStop(0.2, '#8B4513');
    gradient.addColorStop(0.5, '#A0522D');
    gradient.addColorStop(0.8, '#8B4513');
    gradient.addColorStop(1, '#5C3317');

    ctx.fillStyle = gradient;
    ctx.fillRect(trunkX, topY, width, height);

    // Lignes de texture pour l'écorce
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < height; i += 6) {
        ctx.beginPath();
        ctx.moveTo(trunkX + 2, topY + i);
        ctx.lineTo(trunkX + width - 2, topY + i);
        ctx.stroke();
    }

    // Ligne verticale centrale
    ctx.strokeStyle = '#4A2C17';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX, topY);
    ctx.lineTo(centerX, topY + height);
    ctx.stroke();

    // Highlight sur le côté
    ctx.strokeStyle = 'rgba(160, 82, 45, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(trunkX + 1, topY);
    ctx.lineTo(trunkX + 1, topY + height);
    ctx.stroke();

    // Bordure
    ctx.strokeStyle = '#3D2817';
    ctx.lineWidth = 2;
    ctx.strokeRect(trunkX, topY, width, height);

    ctx.restore();
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

// Mettre à jour les arbres
function updateTrees() {
    if (!gameRunning || gamePaused) return;

    // Créer un nouvel arbre
    if (nextTreeX < 0) {
        createTree();
        nextTreeX = treeConfig.spacing;
    }
    nextTreeX -= treeConfig.speed * gameSpeed;

    // Mettre à jour les arbres existants
    trees.forEach((tree, index) => {
        tree.x -= treeConfig.speed * gameSpeed;

        // Vérifier si l'oiseau a passé l'arbre
        if (!tree.passed && tree.x + treeConfig.width < bird.x) {
            tree.passed = true;
            score++;
            document.getElementById('score').textContent = score;

            // Augmenter la vitesse progressivement
            gameSpeed = Math.min(gameSpeed + 0.01, 3);
        }

        // Vérifier les collisions
        if (checkCollision(tree)) {
            hitTree();
        }
    });

    // Supprimer les arbres hors écran
    trees.forEach((tree, index) => {
        if (tree.x + treeConfig.width < 0) {
            trees.splice(index, 1);
        }
    });
}

// Créer un nouvel arbre
function createTree() {
    // Calculer la hauteur minimale en fonction des dimensions du nouvel arbre
    const trunkHeight = treeConfig.width * 0.6;
    const foliageRadius = treeConfig.width * 0.5;
    const minTreeHeight = trunkHeight + foliageRadius * 2;

    const minHeight = minTreeHeight + 20; // Marge pour éviter que l'arbre soit coupé
    const maxHeight = CANVAS_SIZE - treeConfig.gap - minHeight;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;

    trees.push({
        x: CANVAS_SIZE,
        topHeight: topHeight,
        passed: false
    });
}

// Vérifier les collisions
function checkCollision(tree) {
    const birdRight = bird.x + bird.width;
    const birdBottom = bird.y + bird.height;
    const treeRight = tree.x + treeConfig.width;
    const bottomY = tree.topHeight + treeConfig.gap;
    const centerX = tree.x + treeConfig.width / 2;

    // Dimensions du nouvel arbre dessiné
    const trunkWidth = treeConfig.width * 0.25;
    const foliageRadius = treeConfig.width * 0.5;

    // Vérifier collision avec l'arbre du haut
    if (bird.x < treeRight && birdRight > tree.x) {
        const topTreeBottom = tree.topHeight;
        // Tronc en haut
        const topTrunkTop = 0;
        // Feuillage en bas (près du gap)
        const topFoliageCenterY = topTreeBottom - foliageRadius;
        const topTrunkBottom = topFoliageCenterY - foliageRadius;

        // Collision avec le tronc du haut (qui va de 0 à topTrunkBottom)
        const trunkLeft = centerX - trunkWidth / 2;
        const trunkRight = centerX + trunkWidth / 2;
        if (bird.x < trunkRight && birdRight > trunkLeft &&
            bird.y < topTrunkBottom && birdBottom > topTrunkTop) {
            return true;
        }

        // Collision avec le feuillage du haut (cercle en bas, près du gap)
        const distToFoliage = Math.sqrt(
            Math.pow(bird.x + bird.width / 2 - centerX, 2) +
            Math.pow(bird.y + bird.height / 2 - topFoliageCenterY, 2)
        );
        if (distToFoliage < foliageRadius + bird.width / 2 && bird.y > topTrunkBottom) {
            return true;
        }

        // Collision avec l'arbre du bas
        if (birdBottom > bottomY) {
            // Feuillage en haut (près du gap)
            const bottomFoliageCenterY = bottomY + foliageRadius;
            // Tronc va du feuillage jusqu'en bas
            const bottomTrunkTop = bottomFoliageCenterY + foliageRadius;
            const bottomTrunkBottom = CANVAS_SIZE;

            // Collision avec le feuillage du bas (cercle en haut, près du gap)
            const distToBottomFoliage = Math.sqrt(
                Math.pow(bird.x + bird.width / 2 - centerX, 2) +
                Math.pow(bird.y + bird.height / 2 - bottomFoliageCenterY, 2)
            );
            if (distToBottomFoliage < foliageRadius + bird.width / 2 && bird.y < bottomTrunkTop) {
                return true;
            }

            // Collision avec le tronc du bas (qui va de bottomTrunkTop jusqu'en bas)
            if (bird.x < trunkRight && birdRight > trunkLeft &&
                birdBottom > bottomTrunkTop && bird.y < bottomTrunkBottom) {
                return true;
            }
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

// Collision avec un arbre
function hitTree() {
    lives--;
    document.getElementById('lives').textContent = lives;
    if (lives <= 0) {
        endGame();
    } else {
        resetBird();
        // Retirer l'arbre qui a causé la collision
        trees.shift();
    }
}

// Réinitialiser l'oiseau
function resetBird() {
    bird.y = CANVAS_SIZE / 2;
    bird.velocity = 0;
    nextTreeX = CANVAS_SIZE;
    trees.length = 0;
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
    drawTrees();
    drawBird();

    // Mettre à jour
    updateBird();
    updateTrees();

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

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('pauseBtn').addEventListener('click', togglePause);
document.getElementById('restartBtn').addEventListener('click', startGame);

resetBird();