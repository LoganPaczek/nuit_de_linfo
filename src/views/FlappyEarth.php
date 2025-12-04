<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flappy Earth</title>
    <link rel="stylesheet" href="css/FlappyEarth.css">
</head>
<body>
    <div class="flappyEarth-container">
        <h1>Flappy Earth</h1>
        <div class="score-container">
            <div class="score">Score: <span id="score">0</span></div>
            <div class="highScore">Meilleur: <span id="highScore">0</span></div>
            <div class="lives">Vies: <span id="lives">2</span></div>
        </div>
        <canvas id="flappyEarthCanvas"></canvas>
        <div class="controls">
            <p>Appuyez sur ESPACE ou cliquez pour faire voler la Terre</p>
            <button id="startBtn">Commencer</button>
            <button id="pauseBtn">Pause</button>
        </div>
        <div id="flappyEarthOver" class="flappyEarth-over hidden">
            <h2>Partie terminée !</h2>
            <p>Score final: <span id="finalScore">0</span></p>
            <button id="restartBtn">Rejouer</button>
        </div>
        <div id="flappyEarthSuccess" class="flappyEarth-success hidden">
            <h2>🎉 Excellent ! 🎉</h2>
            <p>Nouveau record !</p>
        </div>
    </div>
    <script src="js/FlappyEarth.js"></script>
</body>
</html>

