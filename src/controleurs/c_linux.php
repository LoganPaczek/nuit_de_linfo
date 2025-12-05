<?php
// Vérifier si l'utilisateur a gagné le jeu Memory
if (!isset($_SESSION['memory_linux_won']) || $_SESSION['memory_linux_won'] !== true) {
    // Rediriger vers le jeu Memory
    header('Location: index.php?uc=Memory');
    exit();
}

// Si la victoire est enregistrée, afficher la page Linux
include("../src/Views/Vue_Linux.php");
?>