<?php 
require_once ("../public/Deconnexion.php");
function TesteDeconnexion(){
$email="khalsi@gmail.com";
    var_dump(Deconnexion($email));

}
TesteDeconnexion();