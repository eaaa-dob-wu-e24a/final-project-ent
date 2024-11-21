<?php
include("../../../functions/handle_api_request.php");

try {
    $input = handle_api_request("POST", "Invalid request method", 405);

    // Validate input data
    if (
        !isset($input["name"]) ||
        !isset($input["product_type"]) ||
        !isset($input["size"]) ||
        !isset($input["color"]) ||
        !isset($input["product_condition"])
    ) {
        http_response_code(400);
        echo json_encode(["error" => "Please fill out all required fields"]);
        exit();
    }

    // Extract input data
    $name = $input["name"];
    $product_type = $input["product_type"];
    $size = $input["size"];
    $color = $input["color"];
    $product_condition = $input["product_condition"];
    $brand = isset($input["brand"]) ? $input["brand"] : null;

    // Retrieve the user_id from the session or authentication context
    session_start();
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit();
    }
    $user_id = $_SESSION['user_id'];

    // Prepare the SQL statement
    $stmt = $mySQL->prepare("CALL create_product(?, ?, ?, ?, ?, ?, ?)");

    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . $mySQL->error);
    }

    $stmt->bind_param("ssssssi", $name, $product_type, $size, $color, $product_condition, $brand, $user_id);
    $stmt->execute();
    $stmt->close();

    // Close the database connection
    $mySQL->close();

    // Send success response
    echo json_encode(["message" => "Dit produkt er nu oprettet"]);
} catch (Exception $e) {
    // Log the error message
    error_log($e->getMessage());

    // Send error response
    http_response_code(500);
    echo json_encode(["error" => "Der skete en fejl under oprettelsen af produktet"]);
}