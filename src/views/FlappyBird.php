<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flappy Bird</title>
    <link rel="stylesheet" href="css/FlappyBird.css">
</head>
<body>
    <div class="flappyBird-container">
        <h1>Flappy Bird</h1>
        <div class="score-container">
            <div class="score">Score: <span id="score">0</span></div>
            <div class="highScore">Meilleur: <span id="highScore">0</span></div>
            <div class="lives">Vies: <span id="lives">2</span></div>
        </div>
        <canvas id="flappyBirdCanvas"></canvas>
        <div class="controls">
            <p>Appuyez sur ESPACE ou cliquez pour faire voler l'oiseau</p>
            <button id="startBtn">Commencer</button>
            <button id="pauseBtn">Pause</button>
        </div>
        <div id="flappyBirdOver" class="flappyBird-over hidden">
            <h2>Partie terminée !</h2>
            <p>Score final: <span id="finalScore">0</span></p>
            <button id="restartBtn">Rejouer</button>
        </div>
        <div id="flappyBirdSuccess" class="flappyBird-success hidden">
            <h2>🎉 Excellent ! 🎉</h2>
            <p>Nouveau record !</p>
        </div>
    </div>
    <script src="js/FlappyBird.js"></script>
</body>
</html>

