<?php
// authorize.php
function authorize($mySQL)
{
    // Get headers
    $headers = getallheaders();

    // Check if the Authorization header is present
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Authorization header missing']);
        exit();
    }

    // Parse the Bearer token
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $bearerToken = $matches[1];
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid authorization format']);
        exit();
    }

    // Prepare statement to check the access token
    $stmt = $mySQL->prepare("SELECT user_login_id, access_token_expiry FROM session WHERE access_token = ?");
    $stmt->bind_param("s", $bearerToken);
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