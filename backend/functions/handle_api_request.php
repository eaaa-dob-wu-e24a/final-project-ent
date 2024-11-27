<?php
// function to generally handle the API request
include($_SERVER["DOCUMENT_ROOT"] . "/mysql.php");

function handle_api_request($method, $error_message, $error_code) {
    // Check if the request method matches
    if ($_SERVER["REQUEST_METHOD"] !== $method) {
        http_response_code($error_code);
        echo json_encode(["error" => $error_message]);
        exit();
    }

}
