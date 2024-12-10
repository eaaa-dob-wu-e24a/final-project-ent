<?php
// Include necessary files
include_once($_SERVER['DOCUMENT_ROOT'] . '/functions/authorize.php');
include_once($_SERVER['DOCUMENT_ROOT'] . '/functions/handle_api_request.php');
include_once($_SERVER['DOCUMENT_ROOT'] . '/functions/common.php'); // Contains is_admin()

try {
    // Handle the API request
    handle_api_request('GET', 'Request method must be GET', 405);

    // Authenticate the user
    $user_login_id = authorize($mySQL);

    // Check for query parameters
    $target_user_id = $_GET['target_user_id'] ?? null; // Admin fetches a specific user
    $user_list = ($_GET['user_list'] ?? 'false') === 'true'; // Admin fetches all users

    if ($target_user_id) {
        // Admin fetching a specific user
        if (!is_admin($user_login_id, $mySQL)) {
            throw new Exception('Unauthorized access');
        }

        $sql = "CALL get_user_profile(?)";
        $stmt = $mySQL->prepare($sql);
        $stmt->bind_param("i", $target_user_id);

    } else if ($user_list) {
        // Admin fetching all users
        if (!is_admin($user_login_id, $mySQL)) {
            throw new Exception('Unauthorized access');
        }

        $sql = "SELECT * FROM user_profile";
        $stmt = $mySQL->prepare($sql);

    } else if ($user_login_id) {
        // Normal user fetching their own profile
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

    // Handle the result
    if ($target_user_id || ($user_login_id && !$user_list)) {
        // Single user cases
        $user = $result->fetch_assoc();
        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            exit();
        }
        echo json_encode($user);

    } else {
        // Multiple user cases
        $users = [];
        while ($user = $result->fetch_assoc()) {
            $users[] = $user;
        }

        if (empty($users)) {
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
