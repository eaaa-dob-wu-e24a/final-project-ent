<?php
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/authorize.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_api_request.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_multipart_request.php");

// Authenticate the user and retrieve their user login ID
$user_login_id = authorize($mySQL);

// Handle the API request
handle_api_request('POST', 'Request method must be POST', 405);

// Handle the multipart request
$input = handle_multipart_request();

// Validate that product id is provided in the input
if (!isset($input['product_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Product ID is required']);
    exit();
}

// Get the product id from the input
$product_id = $input['product_id'];

// Initialize an array to hold the response
$response = [];

// Function to upload the image and delete the old image if it exists
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
    $upload_dir = __DIR__ . '/../create/uploads/';
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
        $old_image_path = __DIR__ . '/../create/' . $row['picture_path']; // Construct the old image path
        if (file_exists($old_image_path)) {
            unlink($old_image_path); // Delete the old file if it exists
        }
    }

    return 'uploads/' . $file_name;
}

// Update the product picture
if (isset($input['files']['image'])) {
    try {
        $image = $input['files']['image'];
        $picture_path = upload_image($image, $product_id, $mySQL); // Pass the product_id and mySQL connection

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


// Update other fields. The key is on the left and the value is on the right
$fields = [
    'brand' => 'brand',
    'name' => 'name',
    'product_type' => 'product_type',
    'size' => 'size',
    'color' => 'color',
    'product_condition' => 'product_condition',
];


foreach ($fields as $field_key => $table_column) {
    // Check if the current input field is present in the incoming request
    if (isset($input[$field_key])) {
        // Get the value of the input field
        $field_value = $input[$field_key];

        // Prepare the SQL statement to update the corresponding column in the product table
        // The `$table_column` dynamically specifies which database column to update
        $update_stmt = $mySQL->prepare("UPDATE product SET $table_column = ? WHERE PK_ID = ? AND user_login_id = ?");

        // Bind parameters to the prepared statement:
        // "sii" indicates a string for the field value, and integers for the product ID and user ID
        $update_stmt->bind_param("sii", $field_value, $product_id, $user_login_id);

        // Execute the SQL statement and check if any rows were affected
        if ($update_stmt->execute() && $update_stmt->affected_rows > 0) {
            // If the update was successful, add a success message for this field to the response
            $response[$field_key] = ucfirst($table_column) . ' updated successfully';
        } else {
            // If the update failed, add an error message for this field to the response
            $response[$field_key] = ucfirst($table_column) . ' update failed';
        }
    }
}


// Return the response
echo json_encode($response);

// Close the database connection
$mySQL->close();
