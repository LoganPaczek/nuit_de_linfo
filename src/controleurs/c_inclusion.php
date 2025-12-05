<?php
// Vérifier si l'utilisateur a résolu le Sudoku
if (!isset($_SESSION['sudoku_won']) || $_SESSION['sudoku_won'] !== true) {
    // Rediriger vers le jeu Sudoku
    header('Location: index.php?uc=Sudoku');
    exit();
}

// Si la victoire est enregistrée, afficher la page Inclusion
include("../src/Views/Vue_Inclusion.php");
?>


