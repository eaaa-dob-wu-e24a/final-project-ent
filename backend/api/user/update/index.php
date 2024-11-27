<?php

// Include necessary files

include_once("../../../functions/authorize.php");
include_once("../../../functions/handle_api_request.php");

// Authorize the user and get the user_login_id
$user_login_id = authorize($mySQL);

// Get JSON input
$data = handle_api_request('PUT', 'Request method must be PUT', 405);

// Validate input data
if (!isset($data['username']) || !isset($data['phone_number'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Username and phone number are required']);
    exit();
}

// Extract and sanitize inputs
$username = $data['username'];
$phone_number = $data['phone_number'];
$profile_picture = $data['profile_picture'] ?? null; // Optional field

// Prepare and execute the SQL statement to update the user profile
$stmt = $mySQL->prepare("UPDATE user_profile SET username = ?, phone_number = ?, profile_picture = ? WHERE user_login_id = ?");
$stmt->bind_param("sssi", $username, $phone_number, $profile_picture, $user_login_id);

if ($stmt->execute()) {
    // Fetch the updated profile to return
    $stmt = $mySQL->prepare("SELECT username, phone_number, profile_picture, rating FROM user_profile WHERE user_login_id = ?");
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
