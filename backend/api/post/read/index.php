<?php

// include the necessary files
include_once($_SERVER['DOCUMENT_ROOT'] . '/functions/authorize.php');
include_once($_SERVER['DOCUMENT_ROOT'] . '/functions/handle_api_request.php');

try {

    // handle the api request
    handle_api_request('GET', 'Request must be GET', 405);

    // authenticate the user
    $user_login_id = authorize($mySQL);

    // check for query parameters
    $post_id = $_GET['post_id'] ?? null;
    $user_only = ($_GET['user_only'] ?? 'false') === 'true';
    $non_user_posts = ($_GET['non_user_posts'] ?? 'false') === 'true';

    // SQL query and parameters
    if ($post_id) {

        // fetch a specific post for an authenticated user
        $sql = "
            SELECT 
                p.PK_ID AS post_id,
                p.user_login_id,
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
        ";

        if ($user_only) {
            $sql .= " AND p.user_login_id = ?";
            $stmt = $mySQL->prepare($sql);
            $stmt->bind_param('ii', $post_id, $user_login_id);
        } else {
            $stmt = $mySQL->prepare($sql);
            $stmt->bind_param('i', $post_id);
        }
    } else if ($user_only) {

        // fetch all posts for an authenticated user
        $sql = "
            SELECT 
                p.PK_ID AS post_id,
                p.user_login_id,
                p.description,
                p.price_per_day,
                p.location,
                pr.PK_ID AS product_id,
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

        $stmt = $mySQL->prepare($sql);
        $stmt->bind_param("i", $user_login_id);
    } else if ($non_user_posts) {

        // Fetch all posts not owned by the authenticated user
        $sql = "
            SELECT 
                p.PK_ID AS post_id,
                p.user_login_id,
                p.description,
                p.location,
                p.price_per_day,
                pr.PK_ID AS product_id,
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
                p.user_login_id != ?
            ORDER BY 
                p.PK_ID DESC
        ";

        $stmt = $mySQL->prepare($sql);
        $stmt->bind_param("i", $user_login_id);
    } else {

        // fetch all posts using no filter (for admin)
        $sql = "
                SELECT 
                    p.PK_ID AS post_id,
                    p.user_login_id,
                    p.description,
                    p.price_per_day,
                    p.location,
                    pr.PK_ID AS product_id,
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
                ORDER BY 
                    p.PK_ID DESC
            ";

        $stmt = $mySQL->prepare($sql);
    }

    // execute the statement
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(200);
        echo json_encode([]);
        exit();
    }

    if ($post_id) {
        // Single post query
        $row = $result->fetch_assoc();
        $post_data = [
            'post_id' => $row['post_id'],
            'description' => $row['description'],
            'price_per_day' => $row['price_per_day'],
            'location' => $row['location'],
            'user_id' => $row['user_login_id'],
            'product' => [
                'product_id' => $row['product_id'],
                'name' => $row['product_name'],
                'product_type' => $row['product_type'],
                'size' => $row['size'],
                'color' => $row['color'],
                'product_condition' => $row['product_condition'],
                'brand' => $row['brand'],
                'pictures' => !empty($row['picture_path']) ? [$row['picture_path']] : []
            ]
        ];

        // Return the single post as JSON
        echo json_encode($post_data);
    } else {
        // Multiple posts query
        $posts = [];

        while ($row = $result->fetch_assoc()) {
            $post_id = $row['post_id'];
            $product_id = $row['product_id'];

            $post_data = [
                'post_id' => $post_id,
                'description' => $row['description'],
                'price_per_day' => $row['price_per_day'],
                'location' => $row['location'],
                'user_id' => $row['user_login_id'],
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

            if (!empty($row['picture_path'])) {
                $post_data['product']['pictures'][] = $row['picture_path'];
            }

            $posts[] = $post_data;
        }

        echo json_encode($posts);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "An error occurred while processing the request: " . $e->getMessage()]);
}
