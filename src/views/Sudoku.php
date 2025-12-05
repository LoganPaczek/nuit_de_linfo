<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sudoku</title>
    <link rel="stylesheet" href="css/Sudoku.css">
</head>
<body>
    <div class="sudoku-container">
        <h1>🧩 Sudoku</h1>
        <div class="controls">
            <button id="newGameBtn">Nouvelle partie</button>
            <button id="checkBtn">Vérifier</button>
            <button id="solveBtn">Résoudre</button>
        </div>
        <div id="sudokuBoard" class="sudoku-board"></div>
        <div class="info">
            <p>💡 Utilisez les flèches du clavier pour naviguer</p>
            <p>📝 Entrez un chiffre de 1 à 9 dans chaque case</p>
        </div>
        <div id="sudokuWin" class="sudoku-win hidden">
            <h2>🎉 Félicitations ! 🎉</h2>
            <p>Vous avez complété le Sudoku !</p>
            <button id="playAgainBtn">Rejouer</button>
        </div>
    </div>
    <script src="js/Sudoku.js"></script>
</body>
</html>

