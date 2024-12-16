<?php
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/authorize.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_api_request.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_json_request.php");

// Ensure the request method is POST
handle_api_request('POST', 'Request method must be POST', 405);

// Authorize user
$user_login_id = authorize($mySQL);

// Parse JSON input (unnecessary since we are using Authorization header)
$input = handle_json_request();

// Delete session in the database (We can skip passing the access token since it is already validated in the authorize function). Only the user_login_id is required.
$stmt = $mySQL->prepare("DELETE FROM session WHERE user_login_id = ?");
$stmt->bind_param("i", $user_login_id);

// Execute the statement
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
