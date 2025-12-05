<?php
header("Content-Type: application/json");


$host = "127.0.0.1";
$dbname = "Code_Nuit";
$user = "phpuser";     
$pass = "1234";       
$charset = "utf8";
try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=$charset",
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
} catch (PDOException $e) {
    echo json_encode([
        "existe" => false,
        "error"  => "Erreur connexion BDD",
        "msg"    => $e->getMessage()
    ]);
    exit;
}


if (!isset($_GET["annee"])) {
    echo json_encode(["existe" => false, "error" => "Aucune année envoyée"]);
    exit;
}

$annee = intval($_GET["annee"]);  


try {
    $sql = "SELECT COUNT(*) FROM users WHERE Date_Naissance = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$annee]);

    $existe = $stmt->fetchColumn() > 0;

    echo json_encode(["existe" => $existe]);
} catch (PDOException $e) {
    echo json_encode([
        "existe" => false,
        "error"  => "Erreur SQL",
        "msg"    => $e->getMessage()
    ]);
}
exit;












