<?php

include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/authorize.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_api_request.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_multipart_request.php");

// Authenticate the user and retrieve their user login ID
$user_login_id = authorize($mySQL);

// Handle the API request
handle_api_request('POST', 'Request method must be POST', 405);

// Handle the JSON request
$input = handle_multipart_request();

// Validate that post id is provided in the input
if (!isset($input['post_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Post ID is required']);
    exit();
}

// Get the post id from the input
$post_id = $input['post_id'];

// Initialize an array to hold the response
$response = [];

$fields = [
    'description' => 'description',
    'price' => 'price_per_day'
];

foreach ($fields as $field_key => $table_column) {
    if (isset($input[$field_key])) {
        // Extract the field from the input
        $field_value = $input[$field_key];

        // Prepare and bind the parameters
        $stmt = $mySQL->prepare("UPDATE post SET $table_column = ? WHERE PK_ID = ? AND user_login_id = ?");
        $stmt->bind_param("sii", $field_value, $post_id, $user_login_id);

        // Execute the statement
        if ($stmt->execute() && $stmt->affected_rows > 0) {
            $response[$field_key] = ucfirst($table_column) . ' updated successfully';
        } else {
            $response[$field_key] = ucfirst($table_column) . ' update failed';
        }
    }
}

// Return the response
echo json_encode($response);

// close the database connection
$mySQL->close();
