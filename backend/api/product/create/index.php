<?php
// Start output buffering
ob_start();

// Include necessary functions
include_once("../../../functions/authorize.php");

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
}

// Extract the input data into variables
$name = $_POST['name'];
$brand = isset($_POST['brand']) ? $_POST['brand'] : null; // Brand is optional
$product_type = $_POST['product_type'];
$size = $_POST['size'];
$color = $_POST['color'];
$product_condition = $_POST['product_condition'];

// Handle image upload
if (!isset($_FILES['image'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Image file is required']);
    ob_end_flush();
    exit();
}

$image = $_FILES['image'];

// Check for upload errors
if ($image['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'An error occurred during file upload']);
    ob_end_flush();
    exit();
}

// Validate the uploaded file type (only JPEG and PNG allowed)
$allowedTypes = ['image/jpeg', 'image/png'];
if (!in_array($image['type'], $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['error' => 'Only JPEG and PNG images are allowed']);
    ob_end_flush();
    exit();
}

// Limit file size to 2MB
if ($image['size'] > 2 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(['error' => 'File size exceeds 2MB limit']);
    ob_end_flush();
    exit();
}

// Generate a unique file name
$extension = pathinfo($image['name'], PATHINFO_EXTENSION);
$fileName = uniqid() . '.' . $extension;

// Define the uploads directory
$uploadsDir = __DIR__ . '/uploads/';

// Create the upload directory if it doesn't exist
if (!is_dir($uploadsDir)) {
    if (!mkdir($uploadsDir, 0755, true)) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create upload directory']);
        ob_end_flush();
        exit();
    }
}

// Move the uploaded file to the destination directory
$destination = $uploadsDir . $fileName;
if (!move_uploaded_file($image['tmp_name'], $destination)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save the uploaded image']);
    ob_end_flush();
    exit();
}

// Prepare to store the image path (relative to the web root)
$image_path = './uploads/' . $fileName;

$transaction_started = false;

try {
    // Begin a transaction
    $mySQL->begin_transaction();
    $transaction_started = true;

    // Prepare the SQL statement to call the stored procedure
    $stmt = $mySQL->prepare("CALL create_user_product(?, ?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . $mySQL->error);
    }

    // Bind the parameters to the SQL statement
    $stmt->bind_param(
        "ssssssi",
        $name,
        $product_type,
        $size,
        $color,
        $product_condition,
        $brand,
        $user_login_id
    );

    // Execute the stored procedure
    if (!$stmt->execute()) {
        throw new Exception("Failed to execute stored procedure: " . $stmt->error);
    }

    // Fetch the result containing the new product ID
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $result->free(); // Free the result set

    // Close the statement
    $stmt->close();

    if ($row && isset($row['new_product_id'])) {
        $new_product_id = $row['new_product_id'];

        // Insert the image path into 'product_pictures' table
        $insert_stmt = $mySQL->prepare("INSERT INTO product_pictures (picture_path, product_id) VALUES (?, ?)");
        if (!$insert_stmt) {
            throw new Exception("Failed to prepare image insertion: " . $mySQL->error);
        }

        // Bind parameters
        $insert_stmt->bind_param("si", $image_path, $new_product_id);

        // Execute the insert statement
        if (!$insert_stmt->execute()) {
            throw new Exception("Failed to insert image: " . $insert_stmt->error);
        }

        $insert_stmt->close();

        // Commit the transaction
        $mySQL->commit();
        $transaction_started = false;

        // Return a success response with the new product ID
        echo json_encode([
            'message' => 'Product created successfully',
            'product_id' => $new_product_id
        ]);
    } else {
        throw new Exception('Failed to retrieve the new product ID');
    }
} catch (Exception $e) {
    // Rollback the transaction if it was started
    if ($transaction_started) {
        // Process any remaining results to avoid "Commands out of sync" errors
        while ($mySQL->more_results() && $mySQL->next_result()) {
            $mySQL->store_result();
        }
        $mySQL->rollback();
    }
    // Send error response
    http_response_code(500);
    echo json_encode(['error' => 'An error occurred: ' . $e->getMessage()]);
}

// Close the database connection
$mySQL->close();

// End output buffering
ob_end_flush();
?>
