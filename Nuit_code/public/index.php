<?php
require_once("./Include /fct.inc.php");
require_once ("./Include /class.pdogsb.inc.php");
session_start();
date_default_timezone_set('Europe/Paris');
$pdo = PdoCodeNuit::getInstance();
if(!isset($_GET['uc'])){
     $_GET['uc'] = 'Accueil';
}
$uc = $_GET['uc'];
switch($uc){
	case 'Accueil':{
		include("controleurs/c_acueil.php");
		break;
	}
     
	default: {
        include ("controleurs/c_acueil.php");
        break;
    }}
?>