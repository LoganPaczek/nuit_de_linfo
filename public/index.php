<?php
//require_once("../src/Include /fct.inc.php");
//require_once ("../src/Include /class.pdogsb.inc.php");

session_start();
date_default_timezone_set('Europe/Paris');
//$pdo = PdoCodeNuit::getInstance();

if(!isset($_GET['uc'])){
     $_GET['uc'] = 'Accueil';
}

$uc = $_GET['uc'];

?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="./css/Navbar.css">
	<link rel="stylesheet" href="./css/Global.css">
	<link rel="stylesheet" href="./css/Reset.css">
	<?php if($uc == 'Accueil'): ?>
		<link rel="stylesheet" href="./css/Acceuil.css">
	<?php endif; ?>
	<?php if($uc == 'Linux'): ?>
		<link rel="stylesheet" href="./css/Linux.css">
	<?php endif; ?>
	<?php if($uc == 'Responsabilité'): ?>
		<link rel="stylesheet" href="./css/Responsabilite.css">
	<?php endif; ?>
	<?php if($uc == 'Inscription'): ?>
		<link rel="stylesheet" href="./css/Inscription.css">
	<?php endif; ?>
	<?php if($uc == 'Memory'): ?>
		<link rel="stylesheet" href="./css/Memory.css">
	<?php endif; ?>
	<?php if($uc == 'Durabilité'): ?>
		<link rel="stylesheet" href="./css/Durabilite.css">
	<?php endif; ?>
	<title>Document</title>
</head>
<body>
	<?php include("../src/Views/navbar.php"); ?>
	<?php
		switch($uc){
			case 'Accueil':{
				include("../src/Views/vue_Accueil.php");
				break;
			}

			case 'Linux':{
				include("../src/controleurs/c_linux.php");
				break;
			}

			case 'Responsabilité':{
				include("../src/Views/Vue_Responsabilite.php");
				break;
			}

			case 'Durabilité':{
				include("../src/Views/Vue_Durabilite.php");
				break;
			}

			case "Inscription":{
				include("../src/Views/vue_inscription.php");
				break;
			}

			case "Memory":{
				include("../src/Views/Memory.php");
				break;
			}
			
			default: {
				include ("../src/controleurs/c_acueil.php");
				break;
			}
		}
	?>
</body>
</html>


