<?php
// Enable error reporting (remove in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Add CORS headers
header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow requests from your frontend
header("Access-Control-Allow-Credentials: true"); // Allow cookies to be sent
header("Access-Control-Allow-Headers: Content-Type"); // Allow the Content-Type header
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Allow POST and OPTIONS methods

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Return only the headers and not the content
    exit(0);
}

/*===============================================
=          Sign in endpoint           =
===============================================*/

include("../../../functions/handle_api_request.php");
$input = handle_api_request("POST", "Invalid request method", 405);

if (!isset($input["email"]) || !isset($input["password"])) {
    http_response_code(400);
    echo json_encode(["error" => "Please fill out all required fields"]);
    exit();
}

$email = $input["email"];
$password = $input["password"];

// Enable exceptions for MySQLi
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    // Prepare statement to get user with the given email
    $stmt = $mySQL->prepare("SELECT PK_ID, password FROM user_login WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    // Check if user exists
    if ($stmt->num_rows == 0) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid email or password"]);
        exit();
    }

    // Bind result variables
    $stmt->bind_result($PK_ID, $password_hash_db);
    $stmt->fetch();
    $stmt->close();

    // Verify the password
    if (!password_verify($password, $password_hash_db)) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid email or password"]);
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

    // Return the access token to the client
    echo json_encode(["access_token" => $access_token]);

} catch (mysqli_sql_exception $e) {
    // Handle exception
    http_response_code(500);
    echo json_encode(["error" => "An error occurred during login. Please try again later."]);
    // Optionally, log $e->getMessage() to a file for debugging
}


// Set the access token as an HTTP-only cookie
setcookie(
    'access_token',
    $access_token,
    [
        'expires' => strtotime('+1 hour'),
        'path' => '/',
        'domain' => 'localhost',  // Adjust as needed
        'secure' => false,        // Set to true if using HTTPS
        'httponly' => true,
        'samesite' => 'Lax'       // Adjust based on your requirements
    ]
);

// Return a success message (optional)
echo json_encode(["message" => "Login successful"]);

?>