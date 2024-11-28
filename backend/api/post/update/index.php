<?php

include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/authorize.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_api_request.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_json_request.php");

// Authenticate the user and retrieve their user login ID
$user_login_id = authorize($mySQL);

// Handle the API request
handle_api_request('PUT', 'Request method must be PUT', 405);

// Handle the JSON request
$input = handle_json_request();

// Validate that post id is provided in the input
if (!isset($input['post_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Post ID is required']);
    exit();
}

// Get the post id from the input
$post_id = $input['post_id'];

// update the post description
if (isset($input['description'])) {
    // Extract the description from the input
    $description = $input['description'];

    // Prepare and bind the parameters
    $stmt = $mySQL->prepare("UPDATE post SET description = ? WHERE PK_ID = ? AND user_login_id = ?");
    $stmt->bind_param("sii", $description, $post_id, $user_login_id);

    // Execute the statement
    if ($stmt->execute() && $stmt->affected_rows > 0) {
        echo json_encode(['success' => 'Post description updated successfully']);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Post not found or you do not have permission to update this post']);
    }
}

// update the post price per day
if (isset($input['price_per_day'])) {
    // Extract the price per day from the input
    $price_per_day = $input['price_per_day'];

    // Prepare and bind the parameters
    $stmt = $mySQL->prepare("UPDATE post SET price_per_day = ? WHERE PK_ID = ? AND user_login_id = ?");
    $stmt->bind_param("sii", $price_per_day, $post_id, $user_login_id);

    // Execute the statement
    if ($stmt->execute() && $stmt->affected_rows > 0) {
        echo json_encode(['success' => 'Post price per day updated successfully']);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Post not found or you do not have permission to update this post']);
    }
}

// close the database connection
$mySQL->close();

// ____________________ INFO  ____________________
// If the description/price_per_day is provided in the input but with no changes (for a valid post id), the error will still be shown as: 
// 'Post not found or you do not have permission to update this post'.
// Since the frontend will not send the specific field in the request if there are no changes, this is not a problem.
