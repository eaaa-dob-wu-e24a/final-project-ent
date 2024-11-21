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

    // $mySQL is available from mysql.php

    // Prepare the SQL statement
    $stmt = $mySQL->prepare("CALL create_product(?, ?, ?, ?, ?, ?)");

    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . $mySQL->error);
    }

    $stmt->bind_param("ssssss", $name, $product_type, $size, $color, $product_condition, $brand);
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

// No closing PHP tag