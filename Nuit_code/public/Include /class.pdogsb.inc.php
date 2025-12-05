<?php
class PdoCodeNuit {
    private static $serveur = 'mysql:host=localhost';
    private static $bdd = 'dbname=Code_Nuit';
    private static $user = 'phpuser';
    private static $mdp = '1234';
    public static $monPdo = null;
    private static $instance = null;
    
    private function __construct() {
        self::$monPdo = new PDO(
            self::$serveur . ';' . self::$bdd . ';charset=utf8mb4',
            self::$user, 
            self::$mdp,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
        self::$monPdo->query("SET NAMES utf8mb4");
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }




     public static function mailExiste($mail) {
        $pdo = PdoCodeNuit::$monPdo;
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE Mail = :mail");
        $stmt->execute([':mail' => $mail]);
        return $stmt->fetchColumn() > 0;
    }
  
     public static function ajouterUser($mail, $nom, $prenom, $dateNaissance) {
         if (self::mailExiste($mail)) {
            return false;  // Mail déjà utilisé
        }
        
        $pdo = PdoCodeNuit::$monPdo;
        $stmt = $pdo->prepare("INSERT INTO users (Mail, Nom, Prenom, Date_Naissance) VALUES (:mail, :nom, :prenom, :datenaissance)");
        $stmt->bindValue(':mail', $mail, PDO::PARAM_STR);
        $stmt->bindValue(':nom', $nom, PDO::PARAM_STR);
        $stmt->bindValue(':prenom', $prenom, PDO::PARAM_STR);
        $stmt->bindValue(':datenaissance', $dateNaissance, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public static function ValideExitUser($mail) {
        $pdo = PdoCodeNuit::$monPdo;
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE Mail = :mail");
        $stmt->execute(['mail' => $mail]);
        return $stmt->fetchColumn() > 0;
    }
    




}
?>
