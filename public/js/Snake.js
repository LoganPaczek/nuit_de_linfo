const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverDiv = document.getElementById('gameOver');
const gameWinDiv = document.getElementById('gameWin');
const restartBtn = document.getElementById('restartBtn');
const playAgainBtn = document.getElementById('playAgainBtn');

// Configuration
const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const WIN_SCORE = 10;
const ITEM_SIZE = 28; // Taille des items (plus grande que GRID_SIZE)

// Calculer le nombre de cellules
const CELLS_X = Math.floor(CANVAS_SIZE / GRID_SIZE);
const CELLS_Y = Math.floor(CANVAS_SIZE / GRID_SIZE);

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

// État du jeu
let snake = [{ x: 10, y: 10 }];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let items = [];
let score = 0;
let gameRunning = false;
let gameLoopId = null;

// Images des items
const itemImages = {
    keyboard: new Image(),
    laptop: new Image(),
    screen: new Image(),
    virus: new Image()
};

// Charger les images
itemImages.keyboard.src = 'image/snake/keyboard.svg';
itemImages.laptop.src = 'image/snake/laptop.svg';
itemImages.screen.src = 'image/snake/screen.svg';
itemImages.virus.src = 'image/snake/virus.svg';

let imagesLoaded = 0;
const totalImages = 4;

Object.values(itemImages).forEach(img => {
    img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === totalImages && !gameRunning) {
            startGame();
        }
    };
    img.onerror = () => {
        imagesLoaded++;
        if (imagesLoaded === totalImages && !gameRunning) {
            startGame();
        }
    };
});

// Types d'items disponibles
const itemTypes = ['keyboard', 'laptop', 'screen', 'virus'];

// Générer un item aléatoire avec mouvement
function generateItem() {
    // Position de départ aléatoire (en pixels)
    const startX = Math.random() * (CANVAS_SIZE - GRID_SIZE);
    const startY = Math.random() * (CANVAS_SIZE - GRID_SIZE);
    const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];

    // Direction aléatoire
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.5 + Math.random() * 2; // Vitesse entre 1.5 et 3.5
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    items.push({
        x: startX,
        y: startY,
        type,
        vx: vx,
        vy: vy
    });
}

// Initialiser plusieurs items au début
function initItems() {
    items = [];
    const numItems = 3; // 3 items au début
    for (let i = 0; i < numItems; i++) {
        generateItem();
    }
}

// Dessiner le serpent
function drawSnake() {
    ctx.fillStyle = '#51cf66';
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Tête du serpent
            ctx.fillStyle = '#69db7c';
        } else {
            ctx.fillStyle = '#51cf66';
        }
        ctx.fillRect(
            segment.x * GRID_SIZE,
            segment.y * GRID_SIZE,
            GRID_SIZE - 2,
            GRID_SIZE - 2
        );
    });
}

// Mettre à jour les items (mouvement)
function updateItems() {
    for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];

        // Déplacer l'item
        item.x += item.vx;
        item.y += item.vy;

        // Vérifier si l'item sort du cadre
        if (item.x < -GRID_SIZE || item.x > CANVAS_SIZE ||
            item.y < -GRID_SIZE || item.y > CANVAS_SIZE) {
            // Supprimer l'item qui sort
            items.splice(i, 1);
            // Générer un nouvel item ailleurs
            generateItem();
        }
    }
}

// Dessiner les items
function drawItems() {
    items.forEach(item => {
        const img = itemImages[item.type];
        const offset = (GRID_SIZE - ITEM_SIZE) / 2; // Centrer l'item
        if (img && img.complete) {
            ctx.drawImage(
                img,
                item.x + offset,
                item.y + offset,
                ITEM_SIZE,
                ITEM_SIZE
            );
        } else {
            // Fallback si l'image n'est pas chargée
            ctx.fillStyle = '#ffd43b';
            ctx.fillRect(
                item.x + offset,
                item.y + offset,
                ITEM_SIZE,
                ITEM_SIZE
            );
        }
    });
}

// Mettre à jour le serpent
function updateSnake() {
    direction = { ...nextDirection };

    const head = { ...snake[0] };
    head.x += direction.x;
    head.y += direction.y;

    // Vérifier collision avec les parois
    if (head.x < 0 || head.x >= CELLS_X || head.y < 0 || head.y >= CELLS_Y) {
        gameOver();
        return;
    }

    // Vérifier collision avec soi-même
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Vérifier si on mange un item (collision avec la tête du serpent)
    const headPixelX = head.x * GRID_SIZE;
    const headPixelY = head.y * GRID_SIZE;
    const itemIndex = items.findIndex(item => {
        // Vérifier la collision entre la tête du serpent et l'item
        const itemCenterX = item.x + GRID_SIZE / 2;
        const itemCenterY = item.y + GRID_SIZE / 2;
        const headCenterX = headPixelX + GRID_SIZE / 2;
        const headCenterY = headPixelY + GRID_SIZE / 2;

        const distance = Math.sqrt(
            Math.pow(itemCenterX - headCenterX, 2) +
            Math.pow(itemCenterY - headCenterY, 2)
        );

        // Collision si distance < (taille de la tête + taille de l'item) / 2
        return distance < (GRID_SIZE + ITEM_SIZE) / 2;
    });

    if (itemIndex !== -1) {
        const item = items[itemIndex];

        // Si c'est un virus, on perd
        if (item.type === 'virus') {
            gameOver();
            return;
        }

        // Manger l'item (pas un virus)
        items.splice(itemIndex, 1);
        score++;
        scoreElement.textContent = score;

        // Générer un nouvel item
        generateItem();

        // Vérifier la victoire
        if (score >= WIN_SCORE) {
            winGame();
            return;
        }
    } else {
        // Retirer la queue si on n'a pas mangé
        snake.pop();
    }
}

// Boucle de jeu
function gameLoop() {
    if (!gameRunning) return;

    // Effacer le canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Dessiner la grille (optionnel, pour le style)
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CELLS_X; i++) {
        ctx.beginPath();
        ctx.moveTo(i * GRID_SIZE, 0);
        ctx.lineTo(i * GRID_SIZE, CANVAS_SIZE);
        ctx.stroke();
    }
    for (let i = 0; i <= CELLS_Y; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * GRID_SIZE);
        ctx.lineTo(CANVAS_SIZE, i * GRID_SIZE);
        ctx.stroke();
    }

    // Mettre à jour et dessiner
    updateItems();
    updateSnake();
    if (gameRunning) {
        drawItems();
        drawSnake();
    }

    // Continuer la boucle
    if (gameRunning) {
        gameLoopId = setTimeout(gameLoop, 150);
    }
}

// Démarrer le jeu
function startGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    scoreElement.textContent = score;
    gameRunning = true;
    gameOverDiv.classList.add('hidden');
    gameWinDiv.classList.add('hidden');

    initItems();
    gameLoop();
}

// Game Over
function gameOver() {
    gameRunning = false;
    if (gameLoopId) {
        clearTimeout(gameLoopId);
    }
    gameOverDiv.classList.remove('hidden');
}

// Victoire
function winGame() {
    gameRunning = false;
    if (gameLoopId) {
        clearTimeout(gameLoopId);
    }
    gameWinDiv.classList.remove('hidden');
}

// Contrôles clavier
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;

    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) {
                nextDirection = { x: 0, y: -1 };
            }
            break;
        case 'ArrowDown':
            if (direction.y === 0) {
                nextDirection = { x: 0, y: 1 };
            }
            break;
        case 'ArrowLeft':
            if (direction.x === 0) {
                nextDirection = { x: -1, y: 0 };
            }
            break;
        case 'ArrowRight':
            if (direction.x === 0) {
                nextDirection = { x: 1, y: 0 };
            }
            break;
    }
});

// Boutons
restartBtn.addEventListener('click', startGame);
playAgainBtn.addEventListener('click', startGame);

// Démarrer le jeu au chargement si les images sont déjà chargées
if (imagesLoaded === totalImages) {
    startGame();
}

