<?php

// Include necessary files

include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/authorize.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_api_request.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_json_request.php");

// Authorize the user and get the user_login_id
$user_login_id = authorize($mySQL);

// Get JSON input
handle_api_request('PUT', 'Request method must be PUT', 405);
$input = handle_json_request();

// Validate input data
if (!isset($input['username']) || !isset($input['phone_number']) || (!isset($input['email'])) ) {
    http_response_code(400);
    echo json_encode(['error' => 'Username and phone number are required']);
    exit();
}

// Extract and sanitize inputs
$username = $input['username'];
$phone_number = $input['phone_number'];
$profile_picture = $input['profile_picture'] ?? null; 
$email = $input['email']; 

// Prepare and execute the SQL statement to update the user profile
$stmt = $mySQL->prepare("CALL update_user_profile(?, ?, ?, ?, ?)");
$stmt->bind_param("issss", $user_login_id, $email, $username, $phone_number, $profile_picture);

if ($stmt->execute()) {
    // Fetch the updated profile to return
    $stmt = $mySQL->prepare("SELECT username, phone_number, profile_picture, email, rating 
                             FROM user_profile 
                             INNER JOIN user_login 
                             ON user_profile.user_login_id = user_login.PK_ID 
                             WHERE user_login_id = ?");
    $stmt->bind_param("i", $user_login_id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();

    echo json_encode($result);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update profile']);
}

$stmt->close();
$mySQL->close();
