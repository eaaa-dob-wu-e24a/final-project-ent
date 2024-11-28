<?php
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/authorize.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_api_request.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_json_request.php");

// Ensure the request method is POST
handle_api_request('POST', 'Request method must be POST', 405);

// Authorize user
$user_login_id = authorize($mySQL);

// Parse JSON input
$input = handle_json_request();

// Ensure the access token is provided
if (!isset($input["access_token"])) {
    http_response_code(400);
    echo json_encode(["error" => "Please provide an access token"]);
    exit();
}

// Extract the access token from the request
$access_token = $input["access_token"];

// Delete the cookie
setcookie('access_token', '', time() - 3600, '/', 'localhost', false, true);

// Delete session in the database
$stmt = $mySQL->prepare("DELETE FROM session WHERE access_token = ? AND user_login_id = ?");
$stmt->bind_param("si", $access_token, $user_login_id);

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(["message" => "Logout successful"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to log out user"]);
}

$stmt->close();
$mySQL->close();
exit();
