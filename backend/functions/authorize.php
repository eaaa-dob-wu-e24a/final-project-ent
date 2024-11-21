<?php
include("../../../functions/handle_api_request.php");

// authorize.php
function authorize($mySQL)
{
    // Check if the access token cookie is set
    if (isset($_COOKIE['access_token'])) {
        $access_token = $_COOKIE['access_token'];
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Access token missing']);
        exit();
    }

    // Prepare statement to check the access token
    $stmt = $mySQL->prepare("INSERT INTO session (user_login_id, access_token, access_token_expiry) VALUES (?, ?, ?)");    $stmt->bind_param("s", $access_token);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows == 0) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid access token']);
        exit();
    }

    $stmt->bind_result($user_login_id, $access_token_expiry);
    $stmt->fetch();
    $stmt->close();

    // Check if the access token has expired
    $currentDateTime = new DateTime();
    $expiryDateTime = new DateTime($access_token_expiry);

    if ($currentDateTime > $expiryDateTime) {
        http_response_code(401);
        echo json_encode(['error' => 'Access token expired']);
        exit();
    }

    // Return the user_login_id
    return $user_login_id;
}
?>
