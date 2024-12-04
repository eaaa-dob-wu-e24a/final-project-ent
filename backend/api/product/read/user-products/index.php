<?php
// File: /api/product/my-products/index.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");

// Include necessary files
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/authorize.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_api_request.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_json_request.php");
// Bring $mySQL into the current scope
global $mySQL;

// Authenticate the user and retrieve their user_login_id
try {
    $user_login_id = authorize($mySQL);
} catch (Exception $e) {
    http_response_code(401); // Unauthorized
    echo json_encode(["error" => "Unauthorized: " . $e->getMessage()]);
    exit();
}

// Ensure the request method is GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["error" => "Method Not Allowed. Use GET instead."]);
    exit();
}

try {
    // Prepare the SQL query to fetch products belonging to the authenticated user
    $query = "
        SELECT 
            p.PK_ID AS product_id,
            p.name,
            p.product_type,
            p.size,
            p.color,
            p.product_condition,
            p.brand,
            pp.picture_path
        FROM 
            product p
        LEFT JOIN 
            product_pictures pp ON p.PK_ID = pp.product_id
        WHERE
            p.user_login_id = ?
        ORDER BY 
            p.PK_ID ASC
    ";

    // Prepare the statement
    if (!$stmt = $mySQL->prepare($query)) {
        throw new Exception("Failed to prepare statement: " . $mySQL->error);
    }

    // Bind the user_login_id parameter
    $stmt->bind_param("i", $user_login_id);

    // Execute the statement
    if (!$stmt->execute()) {
        throw new Exception("Failed to execute statement: " . $stmt->error);
    }

    // Get the result set
    $result = $stmt->get_result();

    // Initialize an array to hold products
    $products = [];

    // Process each row in the result set
    while ($row = $result->fetch_assoc()) {
        $product_id = $row['product_id'];

        // If the product isn't already in the array, add it
        if (!isset($products[$product_id])) {
            $products[$product_id] = [
                'product_id'         => $product_id,
                'name'               => $row['name'],
                'product_type'       => $row['product_type'],
                'size'               => $row['size'],
                'color'              => $row['color'],
                'product_condition'  => $row['product_condition'],
                'brand'              => $row['brand'],
                'pictures'           => []
            ];
        }

        // Add the picture path if available
        if (!empty($row['picture_path'])) {
            $products[$product_id]['pictures'][] = $row['picture_path'];
        }
    }

    // Re-index the products array to have sequential numeric keys
    $products = array_values($products);

    // Close the statement and database connection
    $stmt->close();
    $mySQL->close();

    // Send the response as JSON
    echo json_encode($products, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $e) {
    // Log the error message (ensure your server is configured to handle logs)
    error_log($e->getMessage());

    // Send a generic error response
    http_response_code(500); // Internal Server Error
    echo json_encode(["error" => "An error occurred while fetching your products. Please try again later."]);
}
?>