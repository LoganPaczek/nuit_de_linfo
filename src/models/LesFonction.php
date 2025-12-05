<?php
function Deconnexion($email){
    $pdo = PdoGsb::$monPdo;
    
    $requette=$pdo->prepare("DELETE  FROM medecin WHERE id=:id");
    $v1=$requette->bindValue(':id', $id,PDO::PARAM_INT);
   return $requette->execute();
}

session_start();


if (!isset($_SESSION['mail'])) {
    header("Location: vue_inscription.php");
    exit;
}


$email = $_SESSION['mail'];


try {
    $pdo = new PDO(
        "mysql:host=127.0.0.1;dbname=Code_Nuit;charset=utf8",
        "phpuser",
        "1234",
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (Exception $e) {
    die("Erreur connexion : " . $e->getMessage());
}


$stmt = $pdo->prepare("DELETE FROM users WHERE Mail = ?");
$stmt->execute([$email]);


session_unset();
session_destroy();

header("Location: vue_inscription.php");
exit;
?>
