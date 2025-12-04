<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Casse-Brique</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="game-container">
        <h1>Casse-Brique</h1>
        <div class="score-container">
            <div class="score">Score: <span id="score">0</span></div>
            <div class="lives">Vies: <span id="lives">3</span></div>
        </div>
        <canvas id="gameCanvas"></canvas>
        <div class="controls">
            <p>Utilisez les flèches gauche/droite ou A/D pour déplacer la raquette</p>
            <button id="startBtn">Commencer</button>
            <button id="pauseBtn">Pause</button>
        </div>
        <div id="gameOver" class="game-over hidden">
            <h2>Partie terminée !</h2>
            <p>Score final: <span id="finalScore">0</span></p>
            <button id="restartBtn">Rejouer</button>
        </div>
    </div>
    <script src="js/game.js"></script>
</body>
</html>

