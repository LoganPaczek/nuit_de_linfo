<?php
session_start();

// Sauvegarder la victoire du Sudoku en session
$_SESSION['sudoku_won'] = true;

// Retourner une réponse JSON
header('Content-Type: application/json');
echo json_encode(['success' => true, 'message' => 'Victoire sauvegardée']);
?>


