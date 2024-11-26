<?php
// function to generally handle the API request
define("BASE_PATH", dirname(__DIR__, 1)); // Adjust if necessary
include(BASE_PATH . "/mysql.php");

function handle_api_request($method, $error_message, $error_code) {
    // Check if the request method matches
    if ($_SERVER["REQUEST_METHOD"] !== $method) {
        http_response_code($error_code);
        echo json_encode(["error" => $error_message]);
        exit();
    }

       // For GET requests, return null as there is no body to parse
    if ($method === 'GET') {
        return null;
    }

    // Handle multipart/form-data. Used for file uploads in a form submission
    if (strpos($_SERVER['CONTENT_TYPE'], 'multipart/form-data') !== false) {
        // Extract the form data (excluding files) using the $_POST superglobal and save it to the $data array
        $data = $_POST;

        // Check if files are included in the request
        if (!empty($_FILES)) {
            $data['files'] = $_FILES; // Save the files to the 'files' key in the $data array
        }

        // Return the combined data, including both form data and uploaded files
        return $data;
    }

    // If the request is not multipart/form-data, assume it is JSON
    $input = json_decode(file_get_contents("php://input"), true); 

    // Check for JSON decoding errors
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON data"]);
        exit();
    }

    // Return the decoded JSON data if successful
    return $input;
}
