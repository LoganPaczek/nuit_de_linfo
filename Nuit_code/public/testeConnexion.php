<?php

require_once '../Include/class.pdogsb.inc.php';
PdoCodeNuit::getInstance();
$email = "khalsiadem86@gmail.com";

if (PdoCodeNuit::ValideExitUser($email)) {
    echo "L'utilisateur '$email' existe dans la base.";
} else {
    echo "L'utilisateur '$email' n'existe PAS dans la base.";
}
