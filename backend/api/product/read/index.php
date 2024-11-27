<?php
// Start output buffering
ob_start();

// Include necessary files
include($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_api_request.php");



// Bring $mySQL into the current scope
global $mySQL;

try {
    // Only allow GET requests
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);
        echo json_encode(["error" => "Method Not Allowed"]);
        ob_end_flush();
        exit();
    }

    // SQL query to fetch all products and their associated images
    $query = "
        SELECT 
            p.PK_ID,
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

    $result = $mySQL->query($query);

    if (!$result) {
        throw new Exception("Database query failed: " . $mySQL->error);
    }

    $products = [];

    while ($row = $result->fetch_assoc()) {
        $product_id = $row['PK_ID'];

        // Initialize the product entry if not already set
        if (!isset($products[$product_id])) {
            $products[$product_id] = [
                'PK_ID' => $product_id,
                'name' => $row['name'],
                'product_type' => $row['product_type'],
                'size' => $row['size'],
                'color' => $row['color'],
                'product_condition' => $row['product_condition'],
                'brand' => $row['brand'],
                'user_id' => $row['user_login_id'],
                'pictures' => []
            ];
        }

        // Add the picture path if available
        if (!empty($row['picture_path'])) {
            $products[$product_id]['pictures'][] = $row['picture_path'];
        }
    }

    // Re-index the products array to have sequential numeric keys
    $products = array_values($products);

    // Close the database connection
    $mySQL->close();

    // Send the response as JSON
    echo json_encode($products, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (Exception $e) {
    // Log the error message
    error_log($e->getMessage());

    // Send error response
    http_response_code(500);
    echo json_encode(["error" => "Der skete en fejl under hentning af produktdata"]);
}

ob_end_flush();
?>