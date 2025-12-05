const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverDiv = document.getElementById('gameOver');
const gameOverMessage = document.getElementById('gameOverMessage');
const gameWinDiv = document.getElementById('gameWin');
const restartBtn = document.getElementById('restartBtn');
const playAgainBtn = document.getElementById('playAgainBtn');

// Configuration
const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const WIN_SCORE = 10;
const ITEM_SIZE = 28; // Taille des items (plus grande que GRID_SIZE)
const SNAKE_SPEED = 4.5; // Vitesse du serpent en pixels par frame
const SEGMENT_FOLLOW_SPEED = 0.25; // Vitesse de suivi des segments (lerp factor, plus haut = plus réactif mais toujours fluide)
const TURN_SMOOTHNESS = 0.12; // Lissage des virages (plus bas = plus fluide)

// Calculer le nombre de cellules
const CELLS_X = Math.floor(CANVAS_SIZE / GRID_SIZE);
const CELLS_Y = Math.floor(CANVAS_SIZE / GRID_SIZE);

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

// État du jeu
let snake = [{ x: 200, y: 200 }]; // Positions en pixels
let targetX = 200; // Position cible X en pixels
let targetY = 200; // Position cible Y en pixels
let velocityX = 0; // Vélocité X pour mouvement fluide
let velocityY = 0; // Vélocité Y pour mouvement fluide
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
    const speed = 0.5 + Math.random() * 0.8; // Vitesse entre 0.5 et 1.3 (plus lent)
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
    if (snake.length < 1) return;

    const radius = GRID_SIZE / 2;
    const lineWidth = GRID_SIZE;

    // Dessiner le corps avec des courbes de Bézier pour un rendu ultra-fluide
    ctx.beginPath();

    if (snake.length === 1) {
        // Si un seul segment, juste dessiner la tête
        ctx.arc(snake[0].x, snake[0].y, radius, 0, Math.PI * 2);
    } else {
        // Commencer par la queue
        ctx.moveTo(snake[snake.length - 1].x, snake[snake.length - 1].y);

        // Dessiner des courbes quadratiques entre les segments pour un rendu ultra-lisse
        for (let i = snake.length - 2; i >= 0; i--) {
            const current = snake[i];
            const next = snake[i + 1];

            if (i === 0) {
                // Dernière courbe vers la tête
                ctx.quadraticCurveTo(next.x, next.y, current.x, current.y);
            } else {
                // Courbes quadratiques pour un rendu ultra-fluide
                const midX = (current.x + next.x) / 2;
                const midY = (current.y + next.y) / 2;
                ctx.quadraticCurveTo(next.x, next.y, midX, midY);
            }
        }
    }

    // Style de ligne avec extrémités arrondies pour un rendu ultra-fluide
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = '#51cf66';
    ctx.stroke();

    // Dessiner la tête (cercle plus clair et légèrement plus grand)
    ctx.beginPath();
    ctx.arc(snake[0].x, snake[0].y, radius * 1.2, 0, Math.PI * 2);
    ctx.fillStyle = '#69db7c';
    ctx.fill();

    // Contour de la tête avec un dégradé subtil
    ctx.strokeStyle = '#3d9b4f';
    ctx.lineWidth = 2.5;
    ctx.stroke();
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
    const head = { ...snake[0] };

    // Calculer la direction vers la cible avec interpolation fluide
    const dx = targetX - head.x;
    const dy = targetY - head.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Système de vélocité avec interpolation pour un mouvement ultra-fluide
    if (distance > 0.1) {
        // Normaliser la direction
        const dirX = dx / distance;
        const dirY = dy / distance;

        // Interpoler la vélocité vers la direction cible (smooth turning)
        velocityX += (dirX * SNAKE_SPEED - velocityX) * TURN_SMOOTHNESS;
        velocityY += (dirY * SNAKE_SPEED - velocityY) * TURN_SMOOTHNESS;

        // Limiter la vélocité maximale
        const velMag = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
        if (velMag > SNAKE_SPEED) {
            velocityX = (velocityX / velMag) * SNAKE_SPEED;
            velocityY = (velocityY / velMag) * SNAKE_SPEED;
        }

        // Appliquer la vélocité
        head.x += velocityX;
        head.y += velocityY;
    } else {
        // Ralentir progressivement quand on est proche de la cible
        velocityX *= 0.9;
        velocityY *= 0.9;
        head.x += velocityX;
        head.y += velocityY;
    }

    // Vérifier collision avec les parois
    if (head.x < GRID_SIZE / 2 || head.x >= CANVAS_SIZE - GRID_SIZE / 2 ||
        head.y < GRID_SIZE / 2 || head.y >= CANVAS_SIZE - GRID_SIZE / 2) {
        gameOver('Vous avez touché une paroi');
        return;
    }

    // Faire suivre chaque segment au précédent avec interpolation ultra-fluide (style slither.io)
    const segmentDistance = GRID_SIZE * 0.95; // Légèrement plus proche pour un rendu plus serré
    for (let i = 1; i < snake.length; i++) {
        const prevSegment = snake[i - 1];
        const currentSegment = snake[i];

        // Calculer la direction vers le segment précédent
        const dx = prevSegment.x - currentSegment.x;
        const dy = prevSegment.y - currentSegment.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Toujours interpoler pour un mouvement ultra-fluide, même si la distance est correcte
        if (dist > 0.1) {
            // Normaliser la direction
            const angle = Math.atan2(dy, dx);
            const targetX = prevSegment.x - Math.cos(angle) * segmentDistance;
            const targetY = prevSegment.y - Math.sin(angle) * segmentDistance;

            // Interpolation linéaire pour un mouvement ultra-fluide
            currentSegment.x += (targetX - currentSegment.x) * SEGMENT_FOLLOW_SPEED;
            currentSegment.y += (targetY - currentSegment.y) * SEGMENT_FOLLOW_SPEED;
        }
    }

    // Mettre à jour la tête
    snake[0] = head;

    // Vérifier collision avec soi-même (avec une distance minimale, mais seulement après quelques frames)
    const collisionDistance = GRID_SIZE * 0.7;
    // Ignorer les 2 premiers segments car ils sont toujours proches de la tête au début
    for (let i = 3; i < snake.length; i++) {
        const segment = snake[i];
        const dist = Math.sqrt(
            Math.pow(head.x - segment.x, 2) +
            Math.pow(head.y - segment.y, 2)
        );
        if (dist < collisionDistance) {
            gameOver('Vous vous êtes mordu la queue !');
            return;
        }
    }

    // Vérifier si on mange un item (collision avec la tête du serpent)
    const itemIndex = items.findIndex(item => {
        // Vérifier la collision entre la tête du serpent et l'item
        const itemCenterX = item.x + GRID_SIZE / 2;
        const itemCenterY = item.y + GRID_SIZE / 2;

        const distance = Math.sqrt(
            Math.pow(itemCenterX - head.x, 2) +
            Math.pow(itemCenterY - head.y, 2)
        );

        // Collision si distance < (taille de la tête + taille de l'item) / 2
        return distance < (GRID_SIZE + ITEM_SIZE) / 2;
    });

    if (itemIndex !== -1) {
        const item = items[itemIndex];

        // Si c'est un virus, on perd
        if (item.type === 'virus') {
            gameOver('Vous avez touché un virus !');
            return;
        }

        // Manger l'item (pas un virus)
        items.splice(itemIndex, 1);
        score++;
        scoreElement.textContent = score;

        // Ajouter un segment au serpent (grandir)
        const tail = snake[snake.length - 1];
        snake.push({ x: tail.x, y: tail.y });

        // Générer un nouvel item
        generateItem();

        // Vérifier la victoire
        if (score >= WIN_SCORE) {
            winGame();
            return;
        }
    }
    // Ne pas retirer la queue si on n'a pas mangé - garder la taille constante
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

    // Continuer la boucle avec requestAnimationFrame pour un rendu ultra-fluide
    if (gameRunning) {
        gameLoopId = requestAnimationFrame(gameLoop);
    }
}

// Démarrer le jeu
function startGame() {
    // Initialiser le serpent avec 4 segments alignés horizontalement
    const startX = 200;
    const startY = 200;
    const segmentSpacing = GRID_SIZE; // Espacement entre les segments

    snake = [];
    for (let i = 0; i < 4; i++) {
        snake.push({
            x: startX - (i * segmentSpacing),
            y: startY
        });
    }

    // Positionner la cible légèrement à droite pour que le serpent commence à bouger
    targetX = startX + 30;
    targetY = startY;
    velocityX = 2; // Vitesse initiale
    velocityY = 0;
    score = 0;
    scoreElement.textContent = score;
    gameRunning = true;
    gameOverDiv.classList.add('hidden');
    gameWinDiv.classList.add('hidden');

    initItems();
    gameLoop();
}

// Game Over
function gameOver(message = 'Vous avez touché une paroi') {
    gameRunning = false;
    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
    }
    gameOverMessage.textContent = message;
    gameOverDiv.classList.remove('hidden');
}

// Victoire
function winGame() {
    gameRunning = false;
    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
    }
    gameWinDiv.classList.remove('hidden');
}

// Contrôles clavier
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;

    const head = snake[0];
    const moveDistance = 50; // Distance de déplacement en pixels

    switch (e.key) {
        case 'ArrowUp':
            targetY = Math.max(GRID_SIZE / 2, head.y - moveDistance);
            break;
        case 'ArrowDown':
            targetY = Math.min(CANVAS_SIZE - GRID_SIZE / 2, head.y + moveDistance);
            break;
        case 'ArrowLeft':
            targetX = Math.max(GRID_SIZE / 2, head.x - moveDistance);
            break;
        case 'ArrowRight':
            targetX = Math.min(CANVAS_SIZE - GRID_SIZE / 2, head.x + moveDistance);
            break;
    }
});

// Contrôles souris
canvas.addEventListener('mousemove', (e) => {
    if (!gameRunning) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Limiter la position cible dans les limites du canvas
    targetX = Math.max(GRID_SIZE / 2, Math.min(CANVAS_SIZE - GRID_SIZE / 2, mouseX));
    targetY = Math.max(GRID_SIZE / 2, Math.min(CANVAS_SIZE - GRID_SIZE / 2, mouseY));
});

// Boutons
restartBtn.addEventListener('click', startGame);
playAgainBtn.addEventListener('click', startGame);

// Démarrer le jeu au chargement si les images sont déjà chargées
if (imagesLoaded === totalImages) {
    startGame();
}

