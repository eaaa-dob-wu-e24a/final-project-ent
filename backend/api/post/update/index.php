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

// Get the product id associated with the post
$stmt = $mySQL->prepare("SELECT product_id FROM post WHERE PK_ID = ? AND user_login_id = ?");
$stmt->bind_param("ii", $post_id, $user_login_id);
$stmt->execute();
$stmt->store_result();

// Check if the post exists
if ($stmt->num_rows === 0) {
    http_response_code(404);
    echo json_encode(['error' => 'Post not found']);
    exit();
}

// Bind the result to a variable
$stmt->bind_result($product_id);
$stmt->fetch();

// function to upload and replace the image
function upload_image($image, $product_id, $mySQL)
{

    // Check for upload errors
    if ($image['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('An error occurred while uploading the image');
    }

    // Validate file type
    $allowed_types = ['image/png', 'image/jpeg'];
    if (!in_array($image['type'], $allowed_types)) {
        throw new Exception('Only PNG and JPEG images are allowed');
    }

    // Validate file size
    if ($image['size'] > 2 * 1024 * 1024) {
        throw new Exception('Image must be less than 2MB');
    }

    // Get file extension and create a unique file name
    $extension = pathinfo($image['name'], PATHINFO_EXTENSION);
    $file_name = uniqid() . '.' . $extension;

    // Define the upload directory
    $upload_dir = __DIR__ . '/../../product/create/uploads/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }

    // Construct the destination path
    $destination = $upload_dir . $file_name;

    // Move the uploaded file to the destination
    if (!move_uploaded_file($image['tmp_name'], $destination)) {
        throw new Exception('Failed to move uploaded file');
    }

    // Delete the old image if it exists
    $stmt = $mySQL->prepare("SELECT picture_path FROM product_pictures WHERE product_id = ?");
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) { // Check if the product has an image
        $row = $result->fetch_assoc();
        $old_image_path = __DIR__ . '/../../product/create/' . $row['picture_path']; // Construct the old image path
        if (file_exists($old_image_path)) {
            unlink($old_image_path); // Delete the old file if it exists
        }
    }

    return 'uploads/' . $file_name;
}

// Handle image upload for the associated product
if (isset($input['files']['image'])) {
    try {
        // Upload the image and update the product's picture path
        $image = $input['files']['image'];
        $picture_path = upload_image($image, $product_id, $mySQL);

        $stmt = $mySQL->prepare("UPDATE product_pictures SET picture_path = ? WHERE product_id = ?");
        $stmt->bind_param("si", $picture_path, $product_id);

        if ($stmt->execute() && $stmt->affected_rows > 0) {
            $response['picture'] = 'Product picture updated successfully';
        } else {
            $response['picture'] = 'Product picture update failed';
        }
    } catch (Exception $e) {
        $response['picture_error'] = $e->getMessage();
    }
}


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
