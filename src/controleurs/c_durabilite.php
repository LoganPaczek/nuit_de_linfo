<?php
// Vérifier si l'utilisateur a gagné le jeu FlappyEarth
if (!isset($_SESSION['flappy_earth_won']) || $_SESSION['flappy_earth_won'] !== true) {
    // Rediriger vers le jeu FlappyEarth
    header('Location: index.php?uc=FlappyEarth');
    exit();
}

// Si la victoire est enregistrée, afficher la page Durabilité
include("../src/Views/Vue_Durabilite.php");
?>

