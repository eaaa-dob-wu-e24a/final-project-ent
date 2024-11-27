<?php 

include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/authorize.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_api_request.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_json_request.php");

$user_login_id = authorize($mySQL);

handle_api_request('GET', 'Request method must be GET', 405);
$input = handle_json_request();

$stmt = $mySQL->prepare("CALL get_user_profile(?)");
$stmt->bind_param("i", $user_login_id);
$stmt->execute();

$result = $stmt->get_result()->fetch_assoc();

if (!$result) {
    http_response_code(404);
    echo json_encode(['error' => 'User not found']);
    exit();
}

echo json_encode($result);
