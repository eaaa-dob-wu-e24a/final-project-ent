<?php 
/*===============================================
=          Fetch all users           =
===============================================*/

include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_api_request.php");

handle_api_request('GET', 'Request method must be GET', 405);

$stmt = $mySQL->prepare("SELECT PK_ID, username, phone_number, rating, user_login_id FROM user_profile");
$stmt->execute();

$result = $stmt->get_result();

$users = [];

while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

if (empty($users)) {
    http_response_code(404);
    echo json_encode(['error' => 'No users found']);
    exit();
}

echo json_encode($users);