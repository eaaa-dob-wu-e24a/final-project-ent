<?php
// check_admin.php

include_once($_SERVER['DOCUMENT_ROOT'] . '/functions/common.php'); // Contains is_admin()
include_once($_SERVER['DOCUMENT_ROOT'] . '/functions/authorize.php');

try {
    // Authenticate the user
    $user_login_id = authorize($mySQL);

    // Check if the user is an admin
    $isAdmin = is_admin($user_login_id, $mySQL);

    echo json_encode(['is_admin' => $isAdmin]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
