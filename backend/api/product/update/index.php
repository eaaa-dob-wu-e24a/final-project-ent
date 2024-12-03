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


function upload_image($image) {
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
        $upload_dir = __DIR__ . '/../create/uploads/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }
    
        // Move the uploaded file to the upload directory
        $destination = $upload_dir . $file_name;
        if (!move_uploaded_file($image['tmp_name'], $destination)) {
            throw new Exception('Failed to move uploaded file');
        }
    
        // Return the relative path of the uploaded image
        return 'uploads/' . $file_name;
}

// update the product picture
if (isset($input['files']['image'])) {
    // Extract the image from the input
    $image = $input['files']['image'];

    // Upload the image
    $picture_path = upload_image($image);

    // Prepare and bind the parameters
    $stmt = $mySQL->prepare("UPDATE product_pictures SET picture_path = ? WHERE product_id = ?");
    $stmt->bind_param("si", $picture_path, $product_id);

    // Execute the statement
    if ($stmt->execute() && $stmt->affected_rows > 0) {
        echo json_encode(['success' => 'Product picture updated successfully']);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Product not found or you do not have permission to update this product']);
    }
}


// update the product brand
if (isset($input['brand'])) {
    // Extract the brand from the input
    $brand = $input['brand'];

    // Prepare and bind the parameters
    $stmt = $mySQL->prepare("UPDATE product SET brand = ? WHERE PK_ID = ? AND user_login_id = ?");
    $stmt->bind_param("sii", $brand, $product_id, $user_login_id);

    // Execute the statement
    if ($stmt->execute() && $stmt->affected_rows > 0) {
        echo json_encode(['success' => 'Product brand updated successfully']);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Product not found or you do not have permission to update this product']);
    }
}

// update the product name
if (isset($input['name'])) {
    // Extract the name from the input
    $name = $input['name'];

    // Prepare and bind the parameters
    $stmt = $mySQL->prepare("UPDATE product SET name = ? WHERE PK_ID = ? AND user_login_id = ?");
    $stmt->bind_param("sii", $name, $product_id, $user_login_id);

    // Execute the statement
    if ($stmt->execute() && $stmt->affected_rows > 0) {
        echo json_encode(['success' => 'Product name updated successfully']);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Product not found or you do not have permission to update this product']);
    }
}

// update the product type
if (isset($input['product_type'])) {
    // Extract the product type from the input
    $product_type = $input['product_type'];

    // Prepare and bind the parameters
    $stmt = $mySQL->prepare("UPDATE product SET product_type = ? WHERE PK_ID = ? AND user_login_id = ?");
    $stmt->bind_param("sii", $product_type, $product_id, $user_login_id);

    // Execute the statement
    if ($stmt->execute() && $stmt->affected_rows > 0) {
        echo json_encode(['success' => 'Product type updated successfully']);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Product not found or you do not have permission to update this product']);
    }
}

// update the product size
if (isset($input['size'])) {
    // Extract the size from the input
    $size = $input['size'];

    // Prepare and bind the parameters
    $stmt = $mySQL->prepare("UPDATE product SET size = ? WHERE PK_ID = ? AND user_login_id = ?");
    $stmt->bind_param("sii", $size, $product_id, $user_login_id);

    // Execute the statement
    if ($stmt->execute() && $stmt->affected_rows > 0) {
        echo json_encode(['success' => 'Product size updated successfully']);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Product not found or you do not have permission to update this product']);
    }
}

// update the product color
if (isset($input['color'])) {
    // Extract the color from the input
    $color = $input['color'];

    // Prepare and bind the parameters
    $stmt = $mySQL->prepare("UPDATE product SET color = ? WHERE PK_ID = ? AND user_login_id = ?");
    $stmt->bind_param("sii", $color, $product_id, $user_login_id);

    // Execute the statement
    if ($stmt->execute() && $stmt->affected_rows > 0) {
        echo json_encode(['success' => 'Product color updated successfully']);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Product not found or you do not have permission to update this product']);
    }
}

// update the product condition
if (isset($input['product_condition'])) {
    // Extract the product condition from the input
    $product_condition = $input['product_condition'];

    // Prepare and bind the parameters
    $stmt = $mySQL->prepare("UPDATE product SET product_condition = ? WHERE PK_ID = ? AND user_login_id = ?");
    $stmt->bind_param("sii", $product_condition, $product_id, $user_login_id);

    // Execute the statement
    if ($stmt->execute() && $stmt->affected_rows > 0) {
        echo json_encode(['success' => 'Product condition updated successfully']);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Product not found or you do not have permission to update this product']);
    }
}


// close the database connection
$mySQL->close();
