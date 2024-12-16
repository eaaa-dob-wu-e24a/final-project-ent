<?php
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/authorize.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_api_request.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_json_request.php");

$user_login_id = authorize($mySQL);

handle_api_request('DELETE', 'Request method must be DELETE', 405);

// get the image paths associated with the user
$result = $mySQL->query("SELECT profile_picture FROM user_profile WHERE user_login_id = $user_login_id");
$row = $result->fetch_assoc();
$image_path = __DIR__ . '/../update/' . $row['profile_picture'];
if (file_exists($image_path)) {
    unlink($image_path); // Delete the image
}

if ($mySQL->query("DELETE FROM user_login WHERE PK_ID = $user_login_id")) {
    echo json_encode(['message' => 'User and associated images deleted successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to delete the user']);
}

$mySQL->close();
