<?php

include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_api_request.php");

// Handle GET requests only
handle_api_request('GET', 'Request method must be GET', 405);

try {
    // Get post ID from the query string
    $post_id = isset($_GET['id']) ? intval($_GET['id']) : null;

    if (!$post_id) {
        throw new Exception("Post ID is required.");
    }

    // Fetch specific post and its product details, including the first picture
    $query = "
        SELECT 
            p.PK_ID AS post_id,
            p.description,
            p.price_per_day,
            p.location,
            pr.PK_ID AS product_id,
            pr.name AS product_name,
            pr.brand,
            pr.product_type,
            pr.size,
            pr.color,
            pr.product_condition,
            pp.picture_path
        FROM 
            post p
        INNER JOIN 
            product pr ON p.product_id = pr.PK_ID
        LEFT JOIN 
            product_pictures pp ON pr.PK_ID = pp.product_id
        WHERE 
            p.PK_ID = ?
        LIMIT 1
    ";

    // Prepare and execute the query
    $stmt = $mySQL->prepare($query);
    $stmt->bind_param("i", $post_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if (!$result || $result->num_rows === 0) {
        throw new Exception("Post not found.");
    }

    // Fetch the data
    $post = $result->fetch_assoc();

    // Return the post as JSON
    echo json_encode($post, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $e) {
    // Log and return error
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
