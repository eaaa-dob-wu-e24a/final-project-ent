<?php
// /functions/authorize.php

include("handle_api_request.php");

function authorize($mySQL)
{
    // Initialize access token variable
    $access_token = null;

    // Get all request headers sent by the client using the getallheaders() function
    $headers = getallheaders();

    // Check if the Authorization header is set 
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization']; // Extract the value of the Authorization header

        // Extract the access token from the Authorization header
        // Match the Authorization header against the Bearer token
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $access_token = $matches[1]; // If a match is found, save the extracted token in the $access_token variable
        }
    }

    // If the Authorization header is not set, check if the access token is available in a cookie
    if (!$access_token && isset($_COOKIE['access_token'])) {
        $access_token = $_COOKIE['access_token'];
    }

    // If access token is still not found, return an error
    if (!$access_token) {
        http_response_code(401); // Unauthorized
        echo json_encode(['error' => 'Access token missing']);
        exit();
    }

    // Validate the access token
    // Prepare SQL query to check if the access token exists in the session table
    $stmt = $mySQL->prepare("SELECT user_login_id, access_token_expiry FROM session WHERE access_token = ?");
    // Bind the access token to the query
    $stmt->bind_param("s", $access_token);
    // Execute the query and store the result
    $stmt->execute();
    $stmt->store_result();

    // If no matching session is found, return an error response
    if ($stmt->num_rows == 0) {
        http_response_code(401); // Unauthorized
        echo json_encode(['error' => 'Invalid access token']);
        exit();
    }

    // Initialize variables to store the user_login_id and access_token_expiry
    $user_login_id = null;
    $access_token_expiry = "";

    // Retrieve the user_login_id and access_token_expiry from the session table
    $stmt->bind_result($user_login_id, $access_token_expiry);
    $stmt->fetch();
    $stmt->close();

    // Check if the access token has expired
    $currentDateTime = new DateTime();
    $expiryDateTime = new DateTime($access_token_expiry);

    if ($currentDateTime > $expiryDateTime) {
        http_response_code(401); // Unauthorized
        echo json_encode(['error' => 'Access token expired']);
        exit();
    }

    // Return the user_login_id
    return $user_login_id;
}
?>