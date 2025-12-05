<?php
function Deconnexion($email) {

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

    $stmt = $pdo->prepare("DELETE FROM users WHERE Mail = :email");
    $stmt->bindValue(':email', $email, PDO::PARAM_STR);
    $stmt->execute();
   
    exit;
}

?>
