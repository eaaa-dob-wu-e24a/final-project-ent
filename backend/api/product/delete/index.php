<?php
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/authorize.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_api_request.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_json_request.php");

// Authenticate the user
$user_login_id = authorize($mySQL);

// Handle the API request
handle_api_request('DELETE', 'Request method must be DELETE', 405);

// Parse the input
$input = handle_json_request();

// Validate input
if (!isset($input['product_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Please provide the product_id']);
    exit();
}

// Get the product ID from the input
$product_id = $input['product_id'];

// Get the the image paths associated with the product
$result = $mySQL->query("SELECT picture_path FROM product_pictures WHERE product_id = $product_id");
// Loop through each image path and delete the file from the server
while ($row = $result->fetch_assoc()) {
    $image_path = __DIR__ . '/../create/' . $row['picture_path'];
    if (file_exists($image_path)) {
        unlink($image_path); // Delete the image
    }
}

// Delete the product from the database
if ($mySQL->query("DELETE FROM product WHERE PK_ID = $product_id AND user_login_id = $user_login_id")) {
    echo json_encode(['message' => 'Product and associated images deleted successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to delete the product']);
}

$mySQL->close();
