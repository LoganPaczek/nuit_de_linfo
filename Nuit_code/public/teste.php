<?php 
require_once ("../public/Include/class.pdogsb.inc/Deconnexion.php");

function TesteConnexion(){
$email="khalsi@gmail.com";
    var_dump(ValideExitUser($email));
}
TesteConnexion();