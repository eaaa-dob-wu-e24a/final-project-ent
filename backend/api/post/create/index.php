<?php
// backend/api/post/create/index.php


include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/authorize.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_api_request.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_json_request.php");

// Authenticate the user and retrieve their user login ID
$user_login_id = authorize($mySQL);

// Handle the API request
handle_api_request('POST', 'Request method must be POST', 405);

// Handle the JSON request
$input = handle_json_request();

// Validate that all required fields are provided in the input
if (!isset($input['description']) || !isset($input['price_per_day']) || !isset($input['product_id']) || !isset($input['location'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Please fill out all required fields']);
    exit();
}

// Extract the input data into variables
$description = $input['description'];
$price_per_day = $input['price_per_day'];
$product_id = $input['product_id'];
$location = $input['location'];

// prepare statement and bind parameters
$stmt = $mySQL->prepare("INSERT INTO post (description, price_per_day, product_id, user_login_id, location) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("ssiss", $description, $price_per_day, $product_id, $user_login_id, $location);

// try catch block to catch any database errors that may occur
try {

    // if the statement is executed successfully
    if ($stmt->execute()) {

        // Retrieve the ID of the newly created post so it can be returned in the response
        $post_id = $stmt->insert_id;

        // Return a success response with the post details
        echo json_encode([
            'success' => 'Post created successfully',
            'post_id' => $post_id,
            'description' => $description,
            'price_per_day' => $price_per_day,
            'product_id' => $product_id,
            'user_login_id' => $user_login_id,
            'location' => $location
        ]);
    }

    // Close the statement
    $stmt->close();

    // catch any database-related errors and return an error response
} catch (mysqli_sql_exception $e) {

    // check for invalid product id
    if (strpos($e->getMessage(), 'foreign key constraint fails') !== false) {
        http_response_code(400); 
        echo json_encode(['error' => 'Product does not exist or you do not own the product']);

    // check for duplicate entry
    } else if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
        http_response_code(400); 
        echo json_encode(['error' => 'You have already created a post for this product']);

    // return a generic error message for any other database-related errors
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'An error occurred while creating the post']);
    }
}

// Close the database connection
$mySQL->close();