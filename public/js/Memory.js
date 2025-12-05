// Images des pingouins
const penguinImages = [
    'images/linuxMemory/christmasPinguin.png',
    'images/linuxMemory/heathPinguin.png',
    'images/linuxMemory/laptopPinguin.png',
    'images/linuxMemory/pinguin.png',
    'images/linuxMemory/skiPinguin.png'
];

// Variables du jeu
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let gameStarted = false;
let startTime = 0;
let timerInterval = null;
let canFlip = true;
let imagesLoaded = 0;
let imagesPreloaded = false;

// Précharger toutes les images
function preloadImages() {
    return new Promise((resolve) => {
        let loaded = 0;
        const total = penguinImages.length;

        if (total === 0) {
            resolve();
            return;
        }

        penguinImages.forEach((src) => {
            const img = new Image();
            img.onload = () => {
                loaded++;
                if (loaded === total) {
                    imagesPreloaded = true;
                    resolve();
                }
            };
            img.onerror = () => {
                loaded++;
                if (loaded === total) {
                    imagesPreloaded = true;
                    resolve();
                }
            };
            img.src = src;
        });
    });
}

// Initialiser le jeu
async function initGame() {
    const board = document.getElementById('memoryBoard');
    board.innerHTML = '<p>Chargement des images...</p>';
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    canFlip = true;
    gameStarted = false;

    // Arrêter le timer s'il existe
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    document.getElementById('moves').textContent = moves;
    document.getElementById('pairs').textContent = matchedPairs;
    document.getElementById('time').textContent = 0;
    document.getElementById('memoryWin').classList.add('hidden');

    // Précharger les images avant de créer les cartes
    await preloadImages();

    board.innerHTML = '';

    // Créer les paires de cartes (2 de chaque image)
    const cardPairs = [...penguinImages, ...penguinImages];

    // Mélanger les cartes
    shuffleArray(cardPairs);

    // Créer les cartes
    cardPairs.forEach((imageSrc, index) => {
        const card = {
            id: index,
            image: imageSrc,
            flipped: false,
            matched: false
        };
        cards.push(card);

        // Créer l'élément DOM
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card';
        cardElement.dataset.cardId = index;

        // Créer l'image (déjà préchargée)
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = 'Pingouin';
        img.loading = 'eager'; // Charger immédiatement
        cardElement.appendChild(img);

        // Ajouter l'événement de clic
        cardElement.addEventListener('click', () => flipCard(index));

        board.appendChild(cardElement);
    });

    document.getElementById('totalPairs').textContent = penguinImages.length;
}

// Mélanger un tableau
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Retourner une carte
function flipCard(cardId) {
    if (!canFlip || cards[cardId].flipped || cards[cardId].matched) {
        return;
    }

    // Démarrer le timer au premier clic
    if (!gameStarted) {
        gameStarted = true;
        startTime = Date.now();
        startTimer();
    }

    // Retourner la carte
    cards[cardId].flipped = true;
    updateCardDisplay(cardId);

    // Ajouter à la liste des cartes retournées
    flippedCards.push(cardId);

    // Si 2 cartes sont retournées, vérifier si elles correspondent
    if (flippedCards.length === 2) {
        canFlip = false;
        moves++;
        document.getElementById('moves').textContent = moves;

        setTimeout(() => {
            checkMatch();
        }, 1000);
    }
}

// Vérifier si les deux cartes correspondent
function checkMatch() {
    const [firstId, secondId] = flippedCards;
    const firstCard = cards[firstId];
    const secondCard = cards[secondId];

    if (firstCard.image === secondCard.image) {
        // Les cartes correspondent
        firstCard.matched = true;
        secondCard.matched = true;
        matchedPairs++;

        document.getElementById('pairs').textContent = matchedPairs;
        updateCardDisplay(firstId);
        updateCardDisplay(secondId);

        // Vérifier si toutes les paires sont trouvées
        if (matchedPairs === penguinImages.length) {
            setTimeout(() => {
                winGame();
            }, 500);
        }
    } else {
        // Les cartes ne correspondent pas
        firstCard.flipped = false;
        secondCard.flipped = false;
        updateCardDisplay(firstId);
        updateCardDisplay(secondId);
    }

    // Réinitialiser
    flippedCards = [];
    canFlip = true;
}

// Mettre à jour l'affichage d'une carte
function updateCardDisplay(cardId) {
    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
    const card = cards[cardId];

    if (card.matched) {
        cardElement.classList.add('matched');
        cardElement.classList.add('flipped');
    } else if (card.flipped) {
        cardElement.classList.add('flipped');
    } else {
        cardElement.classList.remove('flipped');
    }
}

// Démarrer le timer
function startTimer() {
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById('time').textContent = elapsed;
    }, 1000);
}

// Arrêter le timer
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Victoire
function winGame() {
    stopTimer();
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('finalMoves').textContent = moves;
    document.getElementById('finalTime').textContent = elapsed;
    document.getElementById('memoryWin').classList.remove('hidden');
    
    // Sauvegarder la victoire en session
    fetch('save_memory_win.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Victoire sauvegardée en session');
        }
    })
    .catch(error => {
        console.error('Erreur lors de la sauvegarde:', error);
    });
}

// Réinitialiser le jeu
function resetGame() {
    stopTimer();
    initGame();
}

// Événements des boutons
document.getElementById('startBtn').addEventListener('click', initGame);
document.getElementById('resetBtn').addEventListener('click', resetGame);
document.getElementById('playAgainBtn').addEventListener('click', () => {
    document.getElementById('memoryWin').classList.add('hidden');
    initGame();
});

// Bouton pour continuer vers Linux après la victoire
const continueBtn = document.getElementById('continueBtn');
if (continueBtn) {
    continueBtn.addEventListener('click', () => {
        window.location.href = 'index.php?uc=Linux';
    });
}

// Initialisation au chargement
initGame();

