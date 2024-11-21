<?php
require_once __DIR__ . "/functions/load_env.php";

loadEnv(__DIR__ . '/.env');

$server = getenv('DB_SERVER');
$username = getenv('DB_USERNAME');
$password = getenv('DB_PASSWORD');
$database = getenv('DB_DATABASE');

// Start output buffering if not already started
if (!ob_get_level()) {
    ob_start();
}

// Set headers (if not already set)
if (!headers_sent()) {
    $origin = "http://localhost:3000"; // Adjust if necessary
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json");
}

// Handle OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // No Content
    ob_end_flush();
    exit();
}

// Establish database connection
$mySQL = new mysqli($server, $username, $password, $database);
if ($mySQL->connect_error) {
    throw new Exception("Could not connect to the MySQL server: " . $mySQL->connect_error);
}

// No output should be generated after this point

// Do not include closing PHP tag to prevent accidental whitespace