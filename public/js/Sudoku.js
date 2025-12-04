// Grille de Sudoku (9x9)
let grid = [];
let solution = [];
let selectedCell = null;

// Grille de départ (exemple de sudoku valide)
const initialGrid = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

// Solution complète
const completeSolution = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
];

// Initialiser le jeu
function initGame() {
    grid = initialGrid.map(row => [...row]);
    solution = completeSolution.map(row => [...row]);

    const sudokuBoard = document.getElementById('sudokuBoard');
    sudokuBoard.innerHTML = '';
    selectedCell = null;

    document.getElementById('sudokuWin').classList.add('hidden');

    // Créer la grille
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.className = 'sudoku-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.maxLength = 1;

            if (grid[row][col] !== 0) {
                cell.value = grid[row][col];
                cell.classList.add('given');
                cell.readOnly = true;
            } else {
                cell.classList.add('user-input');
                cell.addEventListener('input', (e) => handleInput(e, row, col));
                cell.addEventListener('focus', () => selectCell(row, col));
                cell.addEventListener('keydown', (e) => handleKeyDown(e, row, col));
            }

            sudokuBoard.appendChild(cell);
        }
    }
}

// Gérer l'input utilisateur
function handleInput(e, row, col) {
    const value = e.target.value;

    // N'autoriser que les chiffres de 1 à 9
    if (value && (!/^[1-9]$/.test(value))) {
        e.target.value = '';
        grid[row][col] = 0;
        return;
    }

    grid[row][col] = value ? parseInt(value) : 0;
    e.target.classList.remove('error');

    // Vérifier si la grille est complète
    if (isComplete()) {
        checkWin();
    }
}

// Gérer les touches du clavier
function handleKeyDown(e, row, col) {
    const key = e.key;

    // Flèches pour naviguer
    if (key === 'ArrowUp' && row > 0) {
        e.preventDefault();
        const cell = document.querySelector(`[data-row="${row - 1}"][data-col="${col}"]`);
        if (cell && !cell.readOnly) cell.focus();
    } else if (key === 'ArrowDown' && row < 8) {
        e.preventDefault();
        const cell = document.querySelector(`[data-row="${row + 1}"][data-col="${col}"]`);
        if (cell && !cell.readOnly) cell.focus();
    } else if (key === 'ArrowLeft' && col > 0) {
        e.preventDefault();
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col - 1}"]`);
        if (cell && !cell.readOnly) cell.focus();
    } else if (key === 'ArrowRight' && col < 8) {
        e.preventDefault();
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col + 1}"]`);
        if (cell && !cell.readOnly) cell.focus();
    } else if (key === 'Backspace' || key === 'Delete') {
        e.target.value = '';
        grid[row][col] = 0;
        e.target.classList.remove('error');
    }
}

// Sélectionner une cellule
function selectCell(row, col) {
    // Retirer la sélection précédente
    document.querySelectorAll('.sudoku-cell.selected').forEach(cell => {
        cell.classList.remove('selected');
    });

    // Sélectionner la nouvelle cellule
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (cell) {
        cell.classList.add('selected');
        selectedCell = { row, col };
    }
}

// Vérifier la grille
function checkGrid() {
    let hasErrors = false;

    // Vérifier chaque cellule
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            const value = grid[row][col];

            if (value !== 0 && !isValidMove(row, col, value)) {
                cell.classList.add('error');
                hasErrors = true;
            } else {
                cell.classList.remove('error');
            }
        }
    }

    return !hasErrors;
}

// Vérifier si un mouvement est valide
function isValidMove(row, col, value) {
    // Vérifier la ligne
    for (let c = 0; c < 9; c++) {
        if (c !== col && grid[row][c] === value) {
            return false;
        }
    }

    // Vérifier la colonne
    for (let r = 0; r < 9; r++) {
        if (r !== row && grid[r][col] === value) {
            return false;
        }
    }

    // Vérifier la région 3x3
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            if (r !== row && c !== col && grid[r][c] === value) {
                return false;
            }
        }
    }

    return true;
}

// Vérifier si la grille est complète
function isComplete() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                return false;
            }
        }
    }
    return true;
}

// Vérifier la victoire
function checkWin() {
    if (isComplete() && checkGrid()) {
        // Vérifier si la solution est correcte
        let isCorrect = true;
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] !== solution[row][col]) {
                    isCorrect = false;
                    break;
                }
            }
            if (!isCorrect) break;
        }

        if (isCorrect) {
            document.getElementById('sudokuWin').classList.remove('hidden');
        }
    }
}

// Résoudre le sudoku
function solveSudoku() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (!cell.readOnly) {
                cell.value = solution[row][col];
                grid[row][col] = solution[row][col];
                cell.classList.remove('error');
            }
        }
    }
    checkWin();
}

// Événements des boutons
document.getElementById('newGameBtn').addEventListener('click', initGame);
document.getElementById('checkBtn').addEventListener('click', () => {
    if (checkGrid()) {
        alert('La grille est correcte !');
    } else {
        alert('Il y a des erreurs dans la grille.');
    }
});
document.getElementById('solveBtn').addEventListener('click', solveSudoku);
document.getElementById('playAgainBtn').addEventListener('click', () => {
    document.getElementById('sudokuWin').classList.add('hidden');
    initGame();
});

// Initialisation au chargement
initGame();

