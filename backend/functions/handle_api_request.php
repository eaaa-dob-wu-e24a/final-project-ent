<?php

// function to gennerally handle the api request
define("BASE_PATH", dirname(__DIR__, 1)); // Adjust if necessary
include(BASE_PATH . "/mysql.php");

function handle_api_request($method, $error_message, $error_code)
{

    header("Content-Type: application/json");

    if ($_SERVER["REQUEST_METHOD"] !== $method) {
        http_response_code($error_code);
        echo json_encode(["error" => $error_message]);
        exit();
    }

    $input = json_decode(file_get_contents("php://input"), true);

    return $input;
}
