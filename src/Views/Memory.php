<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Memory - Pingouins</title>
    <link rel="stylesheet" href="css/Memory.css">
</head>
<body>
    <div class="memory-container">
        <h1>Memory - Pingouins</h1>
        <div class="score-container">
            <div class="moves">Coups: <span id="moves">0</span></div>
            <div class="pairs">Paires: <span id="pairs">0</span> / <span id="totalPairs">0</span></div>
            <div class="time">Temps: <span id="time">0</span>s</div>
        </div>
        <div id="memoryBoard" class="memory-board"></div>
        <div class="controls">
            <button id="startBtn">Nouvelle partie</button>
            <button id="resetBtn">Réinitialiser</button>
        </div>
        <div id="memoryWin" class="memory-win hidden">
            <h2>🎉 Félicitations ! 🎉</h2>
            <p>Vous avez trouvé toutes les paires !</p>
            <p>Coups: <span id="finalMoves">0</span></p>
            <p>Temps: <span id="finalTime">0</span>s</p>
            <button id="playAgainBtn">Rejouer</button>
        </div>
    </div>
    <script src="js/Memory.js"></script>
</body>
</html>

