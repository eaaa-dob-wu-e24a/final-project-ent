<?php
include($_SERVER["DOCUMENT_ROOT"] . "/functions/authorize.php");
include_once($_SERVER['DOCUMENT_ROOT'] . '/functions/handle_api_request.php');

try {

    // handle the api request
    handle_api_request('GET', 'Request must be GET', 405);

    // authenticate the user
    $user_login_id = authorize($mySQL);

    // check for query parameters
    $product_id = $_GET['product_id'] ?? null;
    $user_only = ($_GET['user_only'] ?? null);

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
                p.PK_ID = ?
        ";

        // check if the user_only parameter is set
        if ($user_only === 'true') {
            $sql .= " AND p.user_login_id = ?";
            $stmt = $mySQL->prepare($sql);
            $stmt->bind_param('ii', $product_id, $user_login_id);
        } elseif ($user_only === 'false') {
            $sql .= " AND p.user_login_id != ?";
            $stmt = $mySQL->prepare($sql);
            $stmt->bind_param('ii', $product_id, $user_login_id);
        } else {
            $stmt = $mySQL->prepare($sql);
            $stmt->bind_param('i', $product_id);
        }
    } else if ($user_only === 'true') {

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

    // If no products are found, respond with an empty array
    if ($result->num_rows === 0) {
        http_response_code(200); // Indicate success, but no content
        echo json_encode([]); // Return an empty array
        exit();
    }


    // process the results____________________________
    if ($product_id) {
        // For single product queries
        $row = $result->fetch_assoc();
        if (!$row) {
            // No product found
            http_response_code(404);
            echo json_encode(["error" => "No product found for the specified product_id."]);
            exit();
        }

        // Build the product data structure
        $product_data = [
            'product_id' => $row['product_id'],
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
            $product_data['pictures'][] = $row['picture_path'];
        }

        // Return the single product as JSON
        echo json_encode($product_data);
    } else {
        // For multiple product queries. Initialize an empty array
        $products = [];

        // Loop through the results
        while ($row = $result->fetch_assoc()) {
            $product_id = $row['product_id']; // Extract product ID

            // Build the product data structure
            $product_data = [
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
                $product_data['pictures'][] = $row['picture_path'];
            }

            // Append the product data to the array
            $products[] = $product_data;
        }

        // Return the products array as a JSON response
        echo json_encode($products);
    }
} catch (Exception $e) {
    // Respond with a 500 error for any server-side issues
    http_response_code(500);
    echo json_encode(["error" => "An error occurred while fetching products."]);
}
