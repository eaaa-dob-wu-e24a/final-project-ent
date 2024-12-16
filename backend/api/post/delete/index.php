<?php
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/authorize.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_api_request.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_json_request.php");

// Authenticate the user and retrieve their user login ID
$user_login_id = authorize($mySQL);

// Handle the API request
handle_api_request('DELETE', 'Request method must be DELETE', 405);

// Handle the JSON request
$input = handle_json_request();

// check if the post_id is provided
if (!isset($input['post_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Please provide the post_id']);
    exit();
}

// get the post_id from the input
$post_id = $input['post_id'];

// sql query to delete the post
$sql = "DELETE FROM post WHERE PK_ID = $post_id AND user_login_id = $user_login_id";

// execute the query
if ($mySQL->query($sql)) {

    // check if any rows in the post table were affected. If so, the post was deleted successfully
    if ($mySQL->affected_rows > 0) {
        echo json_encode(['success' => 'Post deleted successfully']);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Post not found']);
    }

    // if the query was not executed successfully, return an error response
} else {
    http_response_code(500);
    echo json_encode(['error' => 'An error occurred while deleting the post']);
}

// close the database connection
$mySQL->close();
