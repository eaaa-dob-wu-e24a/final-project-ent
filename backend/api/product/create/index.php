<?php

// Include the authorize and handle_api_request functions
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/authorize.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_api_request.php");

// Authenticate the user and retrieve their user login ID
$user_login_id = authorize($mySQL);

// Handle the API request
$input = handle_api_request('POST', 'Request method must be POST', 405);

// Validate that all required fields are provided in the input
if (!isset($input['name']) || !isset($input['brand']) || !isset($input['product_type']) || 
    !isset($input['size']) || !isset($input['color']) || !isset($input['product_condition']) || !isset($input['files']['image'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Please fill out all required fields, including an image']);
    exit();
}

// Extract the input data into variables from the input array
$name = $input['name'];
$brand = $input['brand'];
$product_type = $input['product_type'];
$size = $input['size'];
$color = $input['color'];
$product_condition = $input['product_condition'];
$image = $input['files']['image'];  // Extract the image file from the input using the 'files' key

// Function to handle image upload
function upload_image($image){

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

try {
    // upload the image
    $image_path = upload_image($_FILES['image']);

    // Prepare the SQL statement to call the stored procedure
    $stmt = $mySQL->prepare("CALL create_user_product_with_image(?, ?, ?, ?, ?, ?, ?, ?)");
    
    // Bind the parameters to the SQL statement. (s = string, i = integer)
    $stmt->bind_param("ssssssis", $name, $product_type, $size, $color, $product_condition, $brand, $user_login_id, $image_path);

    // Execute the statement / stored procedure
    if ($stmt->execute()) {
        // Fetch the result set containing the new product ID
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        if ($row && isset($row['new_product_id'])) {
         // Return success response with the new product ID and image path
         echo json_encode([
            'message' => 'Product created successfully',
            'product_id' => $row['new_product_id'],
            'image_path' => $image_path
        ]);
        } else {
            // If no product ID is returned, respond with an error. If the procedure runs successfully, but does not return a valid result.
            http_response_code(500);
            echo json_encode(['error' => 'Failed to retrieve the new product ID']);
        }
    } else {
        // If the stored procedure execution fails altogether, then respond with an error.
        http_response_code(500);
        echo json_encode(['error' => 'An error occurred while creating the product']);
    }

    // Close the prepared statement
    $stmt->close();
} catch (mysqli_sql_exception $e) {
    // Catch any database-related exceptions and return a 500 Internal Server Error with the exception message
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

// Close the database connection to release resources
$mySQL->close();

?>
