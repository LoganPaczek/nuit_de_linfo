<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Casse-Brique</title>
    <link rel="stylesheet" href="css/BreakBrick.css">
</head>
<body>
    <div class="breakBrick-container">
        <h1>Casse-Brique</h1>
        <div class="score-container">
            <div class="score">Score: <span id="score">0</span></div>
            <div class="lives">Vies: <span id="lives">2</span></div>
        </div>
        <canvas id="breakBrickCanvas"></canvas>
        <div class="controls">
            <p>Utilisez les flèches gauche/droite ou A/D pour déplacer la raquette</p>
            <button id="startBtn">Commencer</button>
            <button id="pauseBtn">Pause</button>
        </div>
        <div id="breakBrickOver" class="breakBrick-over hidden">
            <h2>Partie terminée !</h2>
            <p>Score final: <span id="finalScore">0</span></p>
            <button id="restartBtn">Rejouer</button>
        </div>
        <div id="breakBrickSuccess" class="breakBrick-success hidden">
            <h2>🎉 Félicitations ! 🎉</h2>
            <p>Vous avez détruit toutes les briques !</p>
            <p>Niveau suivant...</p>
        </div>
    </div>
    <script src="js/BreakBrick.js"></script>
</body>
</html>

