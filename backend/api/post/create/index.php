<?php

// Include the authorize and handle_api_request functions
include_once("../../../functions/authorize.php");
include_once("../../../functions/handle_api_request.php");

// Authenticate the user and retrieve their user login ID
$user_login_id = authorize($mySQL);

// Handle the API request
$input = handle_api_request('POST', 'Request method must be POST', 405);

// Validate that all required fields are provided in the input
if (!isset($input['description']) || !isset($input['price_per_day']) || !isset($input['product_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Please fill out all required fields']);
    exit();
}