<?php

// Include necessary files

include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/authorize.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_api_request.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_multipart_request.php");

// Authorize the user and get the user_login_id
$user_login_id = authorize($mySQL);

// Get JSON input
handle_api_request('POST', 'Request method must be POST', 405);
$input = handle_multipart_request();

function upload_image($image)
{

    // check for upload errors
    if ($image['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('An error occurred while uploading the image');
    }

    // Validate the image file type (only allow PNG and JPEG images)
    $allowed_types = ['image/png', 'image/jpeg'];
    if (!in_array($image['type'], $allowed_types)) {
        throw new Exception('Only PNG and JPEG images are allowed');
    }

    // Limit file size to 2MB
    if ($image['size'] > 2 * 1024 * 1024) {
        throw new Exception('Image must be less than 2MB');
    }

    // Generate a unique filename for the image
    $extension = pathinfo($image['name'], PATHINFO_EXTENSION);
    $file_name = uniqid() . '.' . $extension;

    // Define the upload directory
    $upload_dir = __DIR__ . '/uploads/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }

    // Move the uploaded file to the upload directory
    $destination = $upload_dir . $file_name;
    if (!move_uploaded_file($image['tmp_name'], $destination)) {
        throw new Exception('Failed to move uploaded file');
    }

    // Return the relative path of the uploaded image
    return './uploads/' . $file_name;
}

if (isset($input['username'])) {
    $username = $input['username'];

    $stmt = $mySQL->prepare("UPDATE user_profile SET username = ? WHERE user_login_id = ?");
    $stmt->bind_param("si", $username, $user_login_id);

    if ($stmt->execute() && $stmt->affected_rows > 0) {

        echo json_encode(['success' => 'Username updated successfully']);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'User not found or you do not have permission to update this user']);
    }
}

if (isset($input['files']['profile_picture'])) {
    $profile_picture = upload_image($input['files']['profile_picture']);

    $stmt = $mySQL->prepare("UPDATE user_profile SET profile_picture = ? WHERE user_login_id = ?");
    $stmt->bind_param("si", $profile_picture, $user_login_id);

    if ($stmt->execute() && $stmt->affected_rows > 0) {
        echo json_encode(['success' => 'Profile picture updated successfully']);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'User not found or you do not have permission to update this user']);
    }
}

if (isset($input['email'])) {
    $email = $input['email'];

    $stmt = $mySQL->prepare("UPDATE user_login SET email = ? WHERE PK_ID = ?");
    $stmt->bind_param("si", $email, $user_login_id);

    if ($stmt->execute() && $stmt->affected_rows > 0) {
        echo json_encode(['success' => 'Email updated successfully']);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'User not found or you do not have permission to update this user']);
    }
}

if (isset($input['phone_number'])) {
    $phone_number = $input['phone_number'];

    $stmt = $mySQL->prepare("UPDATE user_profile SET phone_number = ? WHERE user_login_id = ?");
    $stmt->bind_param("si", $phone_number, $user_login_id);

    if ($stmt->execute() && $stmt->affected_rows > 0) {
        echo json_encode(['success' => 'Phone number updated successfully']);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'User not found or you do not have permission to update this user']);
    }
}
