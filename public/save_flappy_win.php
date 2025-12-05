<?php
session_start();

// Sauvegarder la victoire du FlappyEarth en session
$_SESSION['flappy_earth_won'] = true;

// Retourner une réponse JSON
header('Content-Type: application/json');
echo json_encode(['success' => true, 'message' => 'Victoire sauvegardée']);
?>


