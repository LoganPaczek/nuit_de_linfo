<?php
// Vérifier si l'utilisateur a gagné le jeu BreakBrick
if (!isset($_SESSION['breakbrick_won']) || $_SESSION['breakbrick_won'] !== true) {
    // Rediriger vers le jeu BreakBrick
    header('Location: index.php?uc=BreakBrick');
    exit();
}

// Si la victoire est enregistrée, afficher la page Responsabilité
include("../src/Views/Vue_Responsabilite.php");
?>

