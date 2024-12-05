<?php

// include the necessary files
include_once($_SERVER['DOCUMENT_ROOT'] . '/functions/authorize.php');
include_once($_SERVER['DOCUMENT_ROOT'] . '/functions/handle_api_request.php');

try {

    // handle the api request
    handle_api_request('GET', 'Request method must be GET', 405);

    // authenticate the user
    $user_login_id = authorize($mySQL);

    // check for query parameters
    $target_user_id = $_GET['target_user_id'] ?? null; // admin fetches a specific user
    $user_list = ($_GET['user_list'] ?? 'false') === 'true'; // admin fetches all normal users

    if ($target_user_id) {

        // Logic goes here for fetching a specific user by the admin

    } else if ($user_list) {

        // Logic goes here for fetching all normal users by the admin

    } else if ($user_login_id) {

        $sql = "CALL get_user_profile(?)";
        $stmt = $mySQL->prepare($sql);
        $stmt->bind_param("i", $user_login_id);

    } else {
        throw new Exception('Invalid query parameters');
    }

    $stmt->execute();
    $result = $stmt->get_result();

    if (!$result) {
        http_response_code(400);
        echo json_encode(['error' => 'An error occurred']);
        exit();
    }

    // handle the result
    if ($target_user_id || $user_login_id) {
        // single user cases

        $user = $result->fetch_assoc();
        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            exit();
        }
        echo json_encode($user);

    } else {
        // multiple user cases
        $users = [];
        while ($user = $result->fetch_assoc()) {
            $users[] = $user;
        }

        if(empty($users)) {
            http_response_code(404);
            echo json_encode(['error' => 'No users found']);
            exit();
        }

        echo json_encode($users);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
