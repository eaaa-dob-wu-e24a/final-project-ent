<?php
require_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_api_request.php");
require_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_json_request.php");
require_once($_SERVER["DOCUMENT_ROOT"] . "/functions/common.php"); // Contains is_admin()

// Set the default timezone
date_default_timezone_set('Europe/Copenhagen');

// Ensure the request method is POST
handle_api_request("POST", "Invalid request method", 405);

// Retrieve and decode the JSON input
$input = handle_json_request();

try {
    // Check for required fields
    if (!isset($input["email"]) || !isset($input["password"])) {
        http_response_code(400);
        echo json_encode(["error" => "Please fill out all required fields"]);
        ob_end_flush();
        exit();
    }

    $email = $input["email"];
    $password = $input["password"];
    $adminRequest = isset($input['admin']) && $input['admin'] === true; // True if this is an admin site login

    // Enable exceptions for MySQLi
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    // Prepare statement to get user with the given email
    $stmt = $mySQL->prepare("SELECT PK_ID, password, is_admin FROM user_login WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    // Check if user exists
    if ($stmt->num_rows == 0) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid email or password"]);
        ob_end_flush();
        exit();
    }

    // Bind result variables
    $stmt->bind_result($PK_ID, $password_hash_db, $is_admin);
    $stmt->fetch();
    $stmt->close();

    // Verify the password
    if (!password_verify($password, $password_hash_db)) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid email or password"]);
        ob_end_flush();
        exit();
    }

    // Ensure users and admins only log into their respective frontends
    if ($adminRequest && !$is_admin) {
        // User attempting to log into the admin site
        http_response_code(403); // Forbidden
        echo json_encode(["error" => "Insufficient privileges for admin site", "admin" => false]);
        ob_end_flush();
        exit();
    } elseif (!$adminRequest && $is_admin) {
        // Admin attempting to log into the user site
        http_response_code(403); // Forbidden
        echo json_encode(["error" => "Admins cannot log into the user site", "admin" => false]);
        ob_end_flush();
        exit();
    }

    // Generate an access token
    $access_token = bin2hex(random_bytes(16)); // Generates a 32-character hexadecimal token
    $expiry_time = date('Y-m-d H:i:s', strtotime('+1 hour')); // Token valid for 1 hour

    // Delete existing sessions for this user
    $stmt = $mySQL->prepare("DELETE FROM session WHERE user_login_id = ?");
    $stmt->bind_param("i", $PK_ID);
    $stmt->execute();
    $stmt->close();

    // Insert new session
    $stmt = $mySQL->prepare("INSERT INTO session (user_login_id, access_token, access_token_expiry) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $PK_ID, $access_token, $expiry_time);
    $stmt->execute();
    $stmt->close();

    // Set the access token as an HTTP-only cookie
    setcookie(
        'access_token',
        $access_token,
        [
            'expires' => time() + 3600, // 1 hour from now
            'path' => '/',
            // 'domain' => 'localhost',  // Adjust as needed
            'secure' => true,        // Set to true if using HTTPS
            'httponly' => true,
            'samesite' => 'None'
        ]
    );

    // Return a single JSON response
    echo json_encode([
        "message" => "Login successful",
        "access_token" => $access_token, // Optional: include if needed on the client side
        "is_admin" => (bool)$is_admin
    ]);
} catch (Exception $e) {
    // Log the error message (adjust the path as needed)
    error_log($e->getMessage());

    // Send error response
    http_response_code(500);
    echo json_encode(["error" => "An error occurred during login. Please try again later."]);
}

ob_end_flush();
