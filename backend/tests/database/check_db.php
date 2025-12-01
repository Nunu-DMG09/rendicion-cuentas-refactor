<?php
// check_db.php

$host = '127.0.0.1';
$user = 'root';
$pass = 'Rakion2016123!';
$db   = 'rendicion_cuenta';

$conn = @mysqli_connect($host, $user, $pass, $db);
if ($conn) {
    echo "OK - connected to " . mysqli_get_host_info($conn) . PHP_EOL;
    mysqli_close($conn);
} else {
    echo "FAILED: " . mysqli_connect_error() . PHP_EOL;
}