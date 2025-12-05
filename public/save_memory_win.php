<?php
session_start();

// Sauvegarder la victoire du Memory en session
$_SESSION['memory_linux_won'] = true;

// Retourner une réponse JSON
header('Content-Type: application/json');
echo json_encode(['success' => true, 'message' => 'Victoire sauvegardée']);
?>


