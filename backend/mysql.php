<?php
require_once __DIR__ . "/functions/load_env.php";

loadEnv(__DIR__ . '/.env');

$server = getenv('DB_SERVER');
$username = getenv('DB_USERNAME');
$password = getenv('DB_PASSWORD');
$database = getenv('DB_DATABASE');

$mySQL = new mysqli($server, $username, $password, $database);
if (!$mySQL) {
    die("Could not connect to the MySQL server: " . mysqli_connect_error());
}

echo "Connected to the MySQL server successfully";