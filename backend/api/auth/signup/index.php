<?php
include("../../../functions/handle_api_request.php");

$input = handle_api_request("POST", "Invalid request method", 405);

if (!isset($input["username"]) || !isset($input["email"]) || !isset($input["password"]) || !isset($input["phone_number"])) {
    http_response_code(400);
    echo json_encode(["error" => "Please fill out all required fields"]);
    exit();
}

$username = $input["username"];
$email = $input["email"];
$password = $input["password"];
$phone_number = $input["phone_number"];

// Hash the password
$password_hash = password_hash($password, PASSWORD_DEFAULT);

// Enable exceptions for MySQLi
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    // Prepare the SQL statement
    $stmt = $mySQL->prepare("CALL create_user(?, ?, ?, ?)");
    $stmt->bind_param("ssss", $username, $email, $password_hash, $phone_number);
    $stmt->execute();
    $stmt->close();

    echo json_encode(["message" => "User created successfully"]);
} catch (mysqli_sql_exception $e) {
    $error_message = $e->getMessage();

    if (strpos($error_message, 'Email already exists') !== false) {
        http_response_code(400);
        echo json_encode(["error" => "The email address is already registered. Please use a different email."]);
    } elseif (strpos($error_message, 'Username already exists') !== false) {
        http_response_code(400);
        echo json_encode(["error" => "The username is already taken. Please choose a different username."]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "An unexpected error occurred while creating the user. Please try again later."]);
    }
}
?>