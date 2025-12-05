<?php
session_start();

// Sauvegarder la victoire du BreakBrick en session
$_SESSION['breakbrick_won'] = true;

// Retourner une réponse JSON
header('Content-Type: application/json');
echo json_encode(['success' => true, 'message' => 'Victoire sauvegardée']);
?>

