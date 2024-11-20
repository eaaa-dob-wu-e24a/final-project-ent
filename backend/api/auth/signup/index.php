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

// hash the password
$password_hash = password_hash($password, PASSWORD_DEFAULT);

$sql = "CALL create_user('$username', '$email', '$password_hash', '$phone_number')";
$result = $mySQL->query($sql);

if ($result) {
    echo json_encode(["message" => "User created successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "An error occurred while creating the user"]);
}