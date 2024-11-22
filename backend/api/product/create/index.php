<?php
// Start output buffering
ob_start();

// Include necessary files
include("../../../functions/handle_api_request.php");

// Bring $mySQL into the current scope
global $mySQL;

try {
    // For now, hardcode the user_id to 6
    $user_id = 6;

    // Validate input data
    $requiredFields = ['name', 'product_type', 'size', 'color', 'product_condition'];
    foreach ($requiredFields as $field) {
        if (!isset($_POST[$field]) || empty($_POST[$field])) {
            http_response_code(400);
            echo json_encode(["error" => "Please fill out all required fields"]);
            ob_end_flush();
            exit();
        }
    }

    // Extract input data
    $name = $_POST["name"];
    $product_type = $_POST["product_type"];
    $size = $_POST["size"];
    $color = $_POST["color"];
    $product_condition = $_POST["product_condition"];
    $brand = isset($_POST["brand"]) ? $_POST["brand"] : null;

    // Handle file upload
    if (!isset($_FILES['image'])) {
        http_response_code(400);
        echo json_encode(["error" => "Image file is required"]);
        ob_end_flush();
        exit();
    }

    $image = $_FILES['image'];

    // Check for upload errors
    if ($image['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(["error" => "An error occurred during file upload"]);
        ob_end_flush();
        exit();
    }

    // Validate file type (allow only JPEG and PNG)
    $allowedTypes = ['image/jpeg', 'image/png'];
    if (!in_array($image['type'], $allowedTypes)) {
        http_response_code(400);
        echo json_encode(["error" => "Only JPEG and PNG images are allowed"]);
        ob_end_flush();
        exit();
    }

    // Limit file size to 2MB
    if ($image['size'] > 2 * 1024 * 1024) { // 2MB limit
        http_response_code(400);
        echo json_encode(["error" => "File size exceeds 2MB limit"]);
        ob_end_flush();
        exit();
    }

    // Generate a unique file name
    $extension = pathinfo($image['name'], PATHINFO_EXTENSION);
    $fileName = uniqid() . '.' . $extension;

    // Set the upload directory
    $uploadDir = __DIR__ . '/uploads/'; // Adjust the path if necessary

    // Create the upload directory if it doesn't exist
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            throw new Exception("Failed to create upload directory.");
        }
    }

    // Move the uploaded file to the upload directory
    $filePath = $uploadDir . $fileName;
    if (!move_uploaded_file($image['tmp_name'], $filePath)) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to save the uploaded file"]);
        ob_end_flush();
        exit();
    }

    // Prepare the SQL statement with an OUT parameter
    $stmt = $mySQL->prepare("CALL create_product(?, ?, ?, ?, ?, ?, ?, @new_product_id)");
    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . $mySQL->error);
    }

    $stmt->bind_param("ssssssi", $name, $product_type, $size, $color, $product_condition, $brand, $user_id);
    $stmt->execute();
    $stmt->close();

    // Retrieve the OUT parameter
    $result = $mySQL->query("SELECT @new_product_id AS product_id");
    if ($result) {
        $row = $result->fetch_assoc();
        $product_id = $row['product_id'];
        $result->close();
    } else {
        throw new Exception("Failed to retrieve inserted product ID");
    }

    // Check if product_id was retrieved
    if (!$product_id) {
        throw new Exception("Failed to retrieve inserted product ID");
    }

    // Prepare the SQL statement to insert the image path
    $stmt = $mySQL->prepare("INSERT INTO product_pictures (picture_path, product_id) VALUES (?, ?)");
    if (!$stmt) {
        throw new Exception("Failed to prepare statement for image insertion: " . $mySQL->error);
    }

    $relativeFilePath = 'uploads/' . $fileName; // Use relative path for storage
    $stmt->bind_param("si", $relativeFilePath, $product_id);
    $stmt->execute();
    $stmt->close();

    // Close the database connection
    $mySQL->close();

    // Send success response
    echo json_encode(["message" => "Dit produkt er nu oprettet"]);
} catch (Exception $e) {
    // Log the error message
    error_log($e->getMessage());

    // Send error response
    http_response_code(500);
    echo json_encode(["error" => "Der skete en fejl under oprettelsen af produktet"]);
}

ob_end_flush();
?>