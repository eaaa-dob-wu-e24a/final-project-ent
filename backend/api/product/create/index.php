<?php

// Include the authorize and handle_api_request functions
include_once("../../../functions/authorize.php");
include_once("../../../functions/handle_api_request.php");

// Authenticate the user and retrieve their user login ID
$user_login_id = authorize($mySQL);

// Handle the API request
$input = handle_api_request('POST', 'Request method must be POST', 405);

// Validate that all required fields are provided in the input
if (!isset($input['name']) || !isset($input['brand']) || !isset($input['product_type']) || 
    !isset($input['size']) || !isset($input['color']) || !isset($input['product_condition'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Please fill out all required fields']);
    exit();
}

// Extract the input data into variables
$name = $input['name'];
$brand = $input['brand'];
$product_type = $input['product_type'];
$size = $input['size'];
$color = $input['color'];
$product_condition = $input['product_condition'];

try {
    // Prepare the SQL statement to call the stored procedure
    $stmt = $mySQL->prepare("CALL create_user_product(?, ?, ?, ?, ?, ?, ?)");
    
    // Bind the parameters to the SQL statement. (s = string, i = integer)
    $stmt->bind_param("ssssssi", $name, $product_type, $size, $color, $product_condition, $brand, $user_login_id);

    // Execute the statement / stored procedure
    if ($stmt->execute()) {
        // Fetch the result set containing the new product ID
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        if ($row && isset($row['new_product_id'])) {
            // Return a success response with the new product ID
            echo json_encode(['message' => 'Product created successfully', 'product_id' => $row['new_product_id']]);
        } else {
            // If no product ID is returned, respond with an error
            http_response_code(500);
            echo json_encode(['error' => 'Failed to retrieve the new product ID']);
        }
    } else {
        // If the stored procedure execution fails, return a 500 Internal Server Error
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
