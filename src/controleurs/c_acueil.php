<?php

if(!isset($_GET['action'])){
	$_GET['action'] = 'Zebii';
}
$action = $_GET['action'];

switch($action){
	case 'Connexion':{
                

		break;
	}
	case 'Sinscrire':{
        include("../src/Views/vue_inscription.php");
			break;	
	}

	
	default :{
		include("../src/Views/vue_Accueil.php");
		break;
	}
}
?>