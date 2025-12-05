<div class="flappyEarth-container">
    <h1>Flappy Earth</h1>
    <p class="flappy-instruction">Gagnez ce jeu (score de 10) pour accéder à la page Durabilité !</p>
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
        <h2 id="successTitle">🎉 Excellent ! 🎉</h2>
        <p id="successMessage">Nouveau record !</p>
        <button id="continueBtn">Continuer vers Durabilité</button>
    </div>
</div>
<script src="js/FlappyEarth.js"></script>

