<?php

// Include necessary files
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/authorize.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_api_request.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_multipart_request.php");

// Authorize the user and retrieve the user login ID
$user_login_id = authorize($mySQL);

// Handle the API request
handle_api_request('POST', 'Request method must be POST', 405);

// Handle the multipart request
$input = handle_multipart_request();

// Initialize an array to hold the response
$response = [];

// Function to upload the image and delete the old profile picture
function upload_image($image, $user_login_id, $mySQL)
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

    // Delete the old profile picture if it exists
    $stmt = $mySQL->prepare("SELECT profile_picture FROM user_profile WHERE user_login_id = ?");
    $stmt->bind_param("i", $user_login_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) { // If the user has a profile picture
        $row = $result->fetch_assoc();
        $old_image_path = __DIR__ . '/' . $row['profile_picture']; // Construct the old image path
        
        if ($row['profile_picture'] && file_exists($old_image_path)) { // Check if the old image exists
            // Delete the old file if it exists
            if (!unlink($old_image_path)) {
                error_log("Failed to delete old profile picture: $old_image_path");
            }
        }
    }

    // Get file extension and create a unique file name
    $extension = pathinfo($image['name'], PATHINFO_EXTENSION);
    $file_name = uniqid() . '.' . $extension;

    // Define the upload directory
    $upload_dir = __DIR__ . '/uploads/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }

    // Construct the destination path
    $destination = $upload_dir . $file_name;

    // Move the uploaded file to the destination
    if (!move_uploaded_file($image['tmp_name'], $destination)) {
        throw new Exception('Failed to move uploaded file');
    }

    return 'uploads/' . $file_name;
}

// Update the profile picture
if (isset($input['files']['profile_picture'])) {
    try {
        $image = $input['files']['profile_picture'];
        $profile_picture_path = upload_image($image, $user_login_id, $mySQL);

        $stmt = $mySQL->prepare("UPDATE user_profile SET profile_picture = ? WHERE user_login_id = ?");
        $stmt->bind_param("si", $profile_picture_path, $user_login_id);

        if ($stmt->execute() && $stmt->affected_rows > 0) {
            $response['profile_picture'] = 'Profile picture updated successfully';
        } else {
            $response['profile_picture'] = 'Profile picture update failed';
        }
    } catch (Exception $e) {
        $response['profile_picture_error'] = $e->getMessage();
    }
}

// Update other fields. The key is on the left and the value is on the right
$fields = [
    'username' => 'username',
    'phone_number' => 'phone_number',
];

foreach ($fields as $field_key => $table_column) {
    if (isset($input[$field_key])) {
        $field_value = $input[$field_key];
        $update_stmt = $mySQL->prepare("UPDATE user_profile SET $table_column = ? WHERE user_login_id = ?");
        $update_stmt->bind_param("si", $field_value, $user_login_id);

        if ($update_stmt->execute() && $update_stmt->affected_rows > 0) {
            $response[$field_key] = ucfirst($table_column) . ' updated successfully';
        } else {
            $response[$field_key] = ucfirst($table_column) . ' update failed';
        }
    }
}

// Update the email field in the user_login table
if (isset($input['email'])) {
    $email = $input['email'];
    $email_stmt = $mySQL->prepare("UPDATE user_login SET email = ? WHERE PK_ID = ?");
    $email_stmt->bind_param("si", $email, $user_login_id);

    if ($email_stmt->execute() && $email_stmt->affected_rows > 0) {
        $response['email'] = 'Email updated successfully';
    } else {
        $response['email'] = 'Email update failed';
    }
}

// Return the response
echo json_encode($response);

// Close the database connection
$mySQL->close();
