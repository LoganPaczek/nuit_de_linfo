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

// Générer un item aléatoire
function generateItem() {
    const x = Math.floor(Math.random() * CELLS_X);
    const y = Math.floor(Math.random() * CELLS_Y);
    const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];

    // Vérifier que l'item n'est pas sur le serpent
    const onSnake = snake.some(segment => segment.x === x && segment.y === y);
    if (!onSnake) {
        items.push({ x, y, type });
    }
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

// Dessiner les items
function drawItems() {
    items.forEach(item => {
        const img = itemImages[item.type];
        if (img && img.complete) {
            ctx.drawImage(
                img,
                item.x * GRID_SIZE + 2,
                item.y * GRID_SIZE + 2,
                GRID_SIZE - 4,
                GRID_SIZE - 4
            );
        } else {
            // Fallback si l'image n'est pas chargée
            ctx.fillStyle = '#ffd43b';
            ctx.fillRect(
                item.x * GRID_SIZE + 2,
                item.y * GRID_SIZE + 2,
                GRID_SIZE - 4,
                GRID_SIZE - 4
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

    // Vérifier si on mange un item
    const itemIndex = items.findIndex(item => item.x === head.x && item.y === head.y);
    if (itemIndex !== -1) {
        // Manger l'item
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

