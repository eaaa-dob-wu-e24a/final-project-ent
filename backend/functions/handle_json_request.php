<?php

function handle_json_request() {

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
