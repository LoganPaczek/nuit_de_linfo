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
	<?php if($uc == 'Accueil'): ?>
		<link rel="stylesheet" href="./css/Acceuil.css">
	<?php endif; ?>
	<?php if($uc == 'Linux'): ?>
		<link rel="stylesheet" href="./css/Linux.css">
	<?php endif; ?>
	<title>Document</title>
</head>
<body>
	<?php include("../src/Views/navbar.php"); ?>
	<?php
		switch($uc){
			case 'Accueil':{
				include("../src/controleurs/c_acueil.php");
				break;
			}

			case 'Linux':{
				include("../src/Views/Vue_Linux.php");
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


