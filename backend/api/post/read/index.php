<?php

include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/authorize.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_api_request.php");

// Authenticate the user and retrieve their user login ID
$user_login_id = authorize($mySQL);

// Handle the API request
handle_api_request('GET', 'Request method must be GET', 405);

// Prepare a SQL query to fetch all posts
$stmt = $mySQL->prepare("SELECT * FROM post");
$stmt->execute();

// Get the result of the query
$result = $stmt->get_result();
$posts = [];

// Fetch all posts
while ($row = $result->fetch_assoc()) {
    $posts[] = $row;
}

if (!$result) {
    http_response_code(404);
    echo json_encode(['error' => 'Failed to fetch posts']);
    exit();
}

// Return the data as JSON
http_response_code(200);
echo json_encode($posts);

// Close the statement and database connection
$stmt->close();
$mySQL->close();
