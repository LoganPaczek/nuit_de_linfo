<div class="breakBrick-container">
    <h1>Casse-Brique</h1>
    <p class="breakBrick-instruction">Gagnez ce jeu (détruisez toutes les briques) pour accéder à la page Responsabilité !</p>
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
        <button id="continueBtn">Continuer vers Responsabilité</button>
    </div>
</div>
<script src="js/BreakBrick.js"></script>

