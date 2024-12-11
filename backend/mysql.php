<?php
require_once($_SERVER["DOCUMENT_ROOT"] . "/functions/load_env.php");

loadEnv($_SERVER["DOCUMENT_ROOT"] . '/.env');

$server = getenv('DB_SERVER');
$username = getenv('DB_USERNAME');
$password = getenv('DB_PASSWORD');
$database = getenv('DB_DATABASE');

// Allowed origins
$allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://lendr-nine.vercel.app",
    "https://lendr.tobiaswolmar.dk",
    "https://lendr-2cbp.vercel.app"
];

// Check the Origin header and set the appropriate CORS headers
if (!headers_sent()) {
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

    // Verify if the origin is allowed
    if (in_array($origin, $allowedOrigins)) {
        header("Access-Control-Allow-Origin: $origin");
    }

    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json");
}

// Handle OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // No Content
    exit();
}

// Establish database connection
$mySQL = new mysqli($server, $username, $password, $database);
if ($mySQL->connect_error) {
    throw new Exception("Could not connect to the MySQL server: " . $mySQL->connect_error);
}

// No output should be generated after this point

// Do not include closing PHP tag to prevent accidental whitespace