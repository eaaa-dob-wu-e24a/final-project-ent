<?php

include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/authorize.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_api_request.php");

// Authenticate the user and retrieve their user_login_id
$user_login_id = authorize($mySQL);

// Handle the API request
handle_api_request('GET', 'Request method must be GET', 405);

try {
    // Prepare the SQL query to fetch posts for the authenticated user
    $query = "
        SELECT 
            p.PK_ID AS post_id,
            p.description,
            p.price_per_day,
            p.product_id,
            pr.name AS product_name,
            pr.product_type,
            pr.size,
            pr.color,
            pr.product_condition,
            pr.brand,
            pp.picture_path
        FROM 
            post p
        INNER JOIN 
            product pr ON p.product_id = pr.PK_ID
        LEFT JOIN 
            product_pictures pp ON pr.PK_ID = pp.product_id
        WHERE 
            p.user_login_id = ?
        ORDER BY 
            p.PK_ID DESC
    ";

    // Prepare the statement
    $stmt = $mySQL->prepare($query);
    $stmt->bind_param("i", $user_login_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if (!$result) {
        throw new Exception("Database query failed: " . $mySQL->error);
    }

    $posts = [];

    while ($row = $result->fetch_assoc()) {
        $post_id = $row['post_id'];
        $product_id = $row['product_id'];

        // Initialize the post entry if not already set
        if (!isset($posts[$post_id])) {
            $posts[$post_id] = [
                'post_id' => $post_id,
                'description' => $row['description'],
                'price_per_day' => $row['price_per_day'],
                'product' => [
                    'product_id' => $product_id,
                    'name' => $row['product_name'],
                    'product_type' => $row['product_type'],
                    'size' => $row['size'],
                    'color' => $row['color'],
                    'product_condition' => $row['product_condition'],
                    'brand' => $row['brand'],
                    'pictures' => []
                ]
            ];
        }

        // Add the picture path if available
        if (!empty($row['picture_path'])) {
            $posts[$post_id]['product']['pictures'][] = $row['picture_path'];
        }
    }

    // Re-index the posts array to have sequential numeric keys
    $posts = array_values($posts);

    // Close the statement and database connection
    $stmt->close();
    $mySQL->close();

    // Send the response as JSON
    echo json_encode($posts, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (Exception $e) {
    // Log the error message
    error_log($e->getMessage());

    // Send error response
    http_response_code(500);
    echo json_encode(["error" => "An error occurred while fetching posts. Please try again later."]);
}

?>
