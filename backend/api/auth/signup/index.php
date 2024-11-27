<?php 
include("../../../functions/handle_api_request.php");

    $input = handle_api_request("POST", "Invalid request method", 405);

if (
    empty($input["username"]) ||
    empty($input["email"]) ||
    empty($input["password"]) ||
    empty($input["phone_number"])
) {
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
    $stmt = $mySQL->prepare("CALL create_user(?, ?, ?, ?)");
    $stmt->bind_param("ssss", $username, $email, $password_hash, $phone_number);
    $stmt->execute();
    $stmt->close();

    echo json_encode(["message" => "User created successfully"]);
} catch (mysqli_sql_exception $e) {
    if (strpos($e->getMessage(), 'Email already exists') !== false) {
        http_response_code(400);
        echo json_encode(["error" => "Email already exists."]);
    } elseif (strpos($e->getMessage(), 'Username already exists') !== false) {
        http_response_code(400);
        echo json_encode(["error" => "Username already exists."]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "An error occurred."]);
    }
}
