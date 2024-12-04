<?php

//include necessary files
include($_SERVER["DOCUMENT_ROOT"] . "/functions/authorize.php");
include_once($_SERVER['DOCUMENT_ROOT'] . '/functions/handle_api_request.php');

try {

    // handle the api request
    handle_api_request('GET', 'Request must be GET', 405);

    // authenticate the user
    $user_login_id = authorize($mySQL);

    // check for query parameters
    $product_id = $_GET['product_id'] ?? null;
    $user_only = ($_GET['user_only'] ?? 'false') === 'true';

    // SQL query and parameters
    if ($product_id) {

        // fetch a specific product for a authenticated user
        $sql = "
            SELECT 
                p.PK_ID AS product_id,
                p.brand,
                p.name,
                p.product_type,
                p.size,
                p.color,
                p.product_condition,
                p.user_login_id,
                pp.picture_path
            FROM 
                product p
            LEFT JOIN 
                product_pictures pp ON p.PK_ID = pp.product_id
            WHERE 
                p.user_login_id = ? AND p.PK_ID = ?
        ";

        $stmt = $mySQL->prepare($sql);
        $stmt->bind_param('ii', $user_login_id, $product_id);
    } else if ($user_only) {

        // fetch all products for a authenticated user
        $sql = "
            SELECT 
                p.PK_ID AS product_id,
                p.name,
                p.product_type,
                p.size,
                p.color,
                p.product_condition,
                p.brand,
                p.user_login_id,
                pp.picture_path
            FROM 
                product p
            LEFT JOIN 
                product_pictures pp ON p.PK_ID = pp.product_id
            WHERE 
                p.user_login_id = ?
            ORDER BY 
                p.PK_ID ASC
        ";

        $stmt = $mySQL->prepare($sql);
        $stmt->bind_param("i", $user_login_id);
    } else {
        // fetch all products using no filter (for admin)

        $sql = "
            SELECT 
                p.PK_ID AS product_id,
                p.name,
                p.product_type,
                p.size,
                p.color,
                p.product_condition,
                p.brand,
                p.user_login_id,
                pp.picture_path
            FROM 
                product p
            LEFT JOIN 
                product_pictures pp ON p.PK_ID = pp.product_id
            ORDER BY 
                p.PK_ID ASC
        ";

        $stmt = $mySQL->prepare($sql);
    }

    // execute the query and get the result
    $stmt->execute();
    $result = $stmt->get_result();

    // If no products are found, respond with a 404 error
    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(["error" => "No products found for the specified criteria."]);
        exit();
    }

    // process the results
    // Initialize an empty array to store products
    $products = [];

    while ($row = $result->fetch_assoc()) {
        $product_id = $row['product_id']; // Extract product ID

        // Build the product data structure
        $productData = [
            'product_id' => $product_id,
            'name' => $row['name'],
            'product_type' => $row['product_type'],
            'size' => $row['size'],
            'color' => $row['color'],
            'product_condition' => $row['product_condition'],
            'brand' => $row['brand'],
            'user_id' => $row['user_login_id'],
            'pictures' => []
        ];

        // Add the picture path if available
        if (!empty($row['picture_path'])) {
            $productData['pictures'][] = $row['picture_path'];
        }

        // Append the product data to the array
        $products[] = $productData;
    }

    // Return the products array as a JSON response
    echo json_encode($products);
} catch (Exception $e) {
    // Respond with a 500 error for any server-side issues
    http_response_code(500);
    echo json_encode(["error" => "An error occurred while fetching products."]);
}
