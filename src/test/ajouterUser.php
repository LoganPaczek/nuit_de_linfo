<?php
// test_insert.php - Dans C:\xampp\htdocs\mon_projet\
require_once 'PDO.php';

// Initialiser
PdoCodeNuit::getInstance();

echo "Test INSERT en cours...<br><br>";

// TEST INSERT UNIQUEMENT
if (PdoCodeNuit::ajouterUser('nouveu@gmail.com', 'Leroy', 'Sophie', '1996')) {
    echo " SUCCÈS ! Utilisateur ajouté (Leroy Sophie, 1992)";
} else {
    echo " ÉCHEC de l'insertion";
}

echo "<br><br><a href='test_insert.php'>🔄 Retester</a>";
?>
