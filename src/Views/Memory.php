<?php include("../src/Views/navbar.php"); ?>
<div class="memory-page-wrapper">
<div class="memory-container">
    <h1>Memory - Pingouins</h1>
    <p class="memory-instruction">Gagnez ce jeu pour accéder à la page Linux !</p>
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
        <button id="continueBtn">Continuer vers Linux</button>
        <button id="playAgainBtn">Rejouer</button>
    </div>
</div>
</div>
<script src="js/Memory.js"></script>

