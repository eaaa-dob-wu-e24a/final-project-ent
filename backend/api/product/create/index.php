<?php
// Include the authorize and handle_api_request functions
include_once("../../../functions/authorize.php");
include_once("../../../functions/handle_api_request.php");
ob_start();

// Authenticate the user and retrieve their user login ID
$user_login_id = authorize($mySQL);
$input = handle_api_request('POST', 'Request method must be POST', 405);

// Ensure the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Request method must be POST']);
    ob_end_flush();
    exit();
}

// Validate that all required fields are provided in $_POST
$requiredFields = ['name', 'product_type', 'size', 'color', 'product_condition'];
foreach ($requiredFields as $field) {
    if (empty($_POST[$field])) {
        http_response_code(400);
        echo json_encode(['error' => 'Please fill out all required fields']);
        ob_end_flush();
        exit();
    }
}

// Extract the input data into variables
$name = $_POST['name'];
$brand = isset($_POST['brand']) ? $_POST['brand'] : null; // Make brand optional
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
if ($image['size'] > 2 * 1024 * 1024) { // 2MB limit
    http_response_code(400);
    echo json_encode(['error' => 'File size exceeds 2MB limit']);
    ob_end_flush();
    exit();
}

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

    // Prepare the SQL statement to call the stored procedure with 7 parameters
    $stmt = $mySQL->prepare("CALL create_user_product(?, ?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . $mySQL->error);
    }

    // Bind the parameters to the SQL statement. (s = string, i = integer)
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

    // Execute the statement / stored procedure
    if (!$stmt->execute()) {
        throw new Exception("Failed to execute stored procedure: " . $stmt->error);
    }

    // Fetch the result set containing the new product ID
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $result->free(); // Free the first result set

    // Process any additional result sets to avoid "Commands out of sync" errors
    while ($stmt->more_results() && $stmt->next_result()) {
        $extraResult = $stmt->get_result();
        if ($extraResult) {
            $extraResult->free();
        }
    }

    $stmt->close();

    if ($row && isset($row['new_product_id'])) {
        $new_product_id = $row['new_product_id'];

        // Prepare the SQL statement to insert the image path into 'product_pictures' table
        $insert_stmt = $mySQL->prepare("INSERT INTO product_pictures (picture_path, product_id) VALUES (?, ?)");
        if (!$insert_stmt) {
            throw new Exception("Failed to prepare statement for image insertion: " . $mySQL->error);
        }

        // Bind parameters
        $insert_stmt->bind_param("si", $image_path, $new_product_id);

        // Execute the insert statement
        if (!$insert_stmt->execute()) {
            throw new Exception("Failed to execute insert statement: " . $insert_stmt->error);
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
        // Ensure all result sets are processed before rollback
        while ($mySQL->more_results() && $mySQL->next_result()) {
            $extraResult = $mySQL->store_result();
            if ($extraResult) {
                $extraResult->free();
            }
        }
        $mySQL->rollback();
    }
    // Send error response
    http_response_code(500);
    echo json_encode(['error' => 'An error occurred: ' . $e->getMessage()]);
}

// Close the database connection to release resources
$mySQL->close();

// End output buffering
ob_end_flush();
?>
