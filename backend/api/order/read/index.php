<?php

// include the necessary files
include_once($_SERVER['DOCUMENT_ROOT'] . '/functions/authorize.php');
include_once($_SERVER['DOCUMENT_ROOT'] . '/functions/handle_api_request.php');

try {

    handle_api_request('GET', 'Request must be GET', 405);

    $user_login_id = authorize($mySQL);

    $order_id = $_GET['order_id'] ?? null;
    $renter_only = ($_GET['renter_only'] ?? null);
    $owner_only = ($_GET['owner_only'] ?? null);

    if ($order_id) {
        $sql = "
            SELECT 
                o.PK_ID AS order_id,
                o.renter_id,
                o.owner_id,
                o.rental_period,
                o.order_status,
                o.start_date,
                o.end_date,
                o.destination,
                o.post_id,
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
                product_order o
            INNER JOIN 
                post p ON o.post_id = p.PK_ID
            INNER JOIN 
                product pr ON p.product_id = pr.PK_ID
            LEFT JOIN 
                product_pictures pp ON pr.PK_ID = pp.product_id
            WHERE 
                o.PK_ID = ?
        ";

        if ($renter_only === 'true') {
            $sql .= " AND o.renter_id = ?";
            $stmt = $mySQL->prepare($sql);
            $stmt->bind_param('ii', $order_id, $user_login_id);
        } elseif ($renter_only === 'false') {
            $sql .= " AND o.renter_id != ?";
            $stmt = $mySQL->prepare($sql);
            $stmt->bind_param('ii', $order_id, $user_login_id);
        } elseif ($owner_only === 'true') {
            $sql .= " AND o.owner_id = ?";
            $stmt = $mySQL->prepare($sql);
            $stmt->bind_param('ii', $order_id, $user_login_id);
        } elseif ($owner_only === 'false') {
            $sql .= " AND o.owner_id != ?";
            $stmt = $mySQL->prepare($sql);
            $stmt->bind_param('ii', $order_id, $user_login_id);
        } else {
            $stmt = $mySQL->prepare($sql);
            $stmt->bind_param('i', $order_id);
        }
    } else if ($renter_only === 'true') {
        $sql = "
            SELECT 
                o.PK_ID AS order_id,
                o.renter_id,
                o.owner_id,
                o.rental_period,
                o.order_status,
                o.start_date,
                o.end_date,
                o.destination,
                o.post_id,
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
                product_order o
            INNER JOIN 
                post p ON o.post_id = p.PK_ID
            INNER JOIN 
                product pr ON p.product_id = pr.PK_ID
            LEFT JOIN 
                product_pictures pp ON pr.PK_ID = pp.product_id
            WHERE 
                o.renter_id = ?";

        $stmt = $mySQL->prepare($sql);
        $stmt->bind_param('i', $user_login_id);
    } elseif ($renter_only === 'false') {

        http_response_code(200);
        echo json_encode(['message' => 'Cannot fetch orders for other users']);
        exit();
    } elseif ($owner_only === 'true') {

        $sql = "
            SELECT 
                o.PK_ID AS order_id,
                o.renter_id,
                o.owner_id,
                o.rental_period,
                o.order_status,
                o.start_date,
                o.end_date,
                o.destination,
                o.post_id,
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
                product_order o
            INNER JOIN 
                post p ON o.post_id = p.PK_ID
            INNER JOIN 
                product pr ON p.product_id = pr.PK_ID
            LEFT JOIN 
                product_pictures pp ON pr.PK_ID = pp.product_id
            WHERE 
                o.owner_id = ?";

        $stmt = $mySQL->prepare($sql);
        $stmt->bind_param('i', $user_login_id);
    } elseif ($owner_only === 'false') {

        http_response_code(200);
        echo json_encode(['message' => 'Cannot fetch orders for other users']);
        exit();
    } else {

        // Fetch all orders using no filter (for admin)
        $sql = "
            SELECT 
                o.PK_ID AS order_id,
                o.renter_id,
                o.owner_id,
                o.rental_period,
                o.order_status,
                o.start_date,
                o.end_date,
                o.destination,
                o.post_id,
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
                product_order o
            INNER JOIN 
                post p ON o.post_id = p.PK_ID
            INNER JOIN 
                product pr ON p.product_id = pr.PK_ID
            LEFT JOIN 
                product_pictures pp ON pr.PK_ID = pp.product_id
            ORDER BY 
                o.PK_ID DESC
            ";

        $stmt = $mySQL->prepare($sql);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(200);
        echo json_encode([]);
        exit();
    }

    if ($order_id) {
        // for single use cases
        $row = $result->fetch_assoc();
        $order_data = [
            'order_id' => $row['order_id'],
            'renter_id' => $row['renter_id'],
            'owner_id' => $row['owner_id'],
            'rental_period' => $row['rental_period'],
            'order_status' => $row['order_status'],
            'start_date' => $row['start_date'],
            'end_date' => $row['end_date'],
            'destination' => $row['destination'],
            'post_id' => $row['post_id'],
            'description' => $row['description'],
            'price_per_day' => $row['price_per_day'],
            'location' => $row['location'],
            'product_id' => $row['product_id'],
            'product_name' => $row['product_name'],
            'brand' => $row['brand'],
            'product_type' => $row['product_type'],
            'size' => $row['size'],
            'color' => $row['color'],
            'product_condition' => $row['product_condition'],
            'pictures' => !empty($row['picture_path']) ? [$row['picture_path']] : []
        ];

        echo json_encode($order_data);
    } else {
        // for multiple use cases
        $orders = [];

        while ($row = $result->fetch_assoc()) {
            $order_data = [
                'order_id' => $row['order_id'],
                'rental_period' => $row['rental_period'],
                'owner_id' => $row['owner_id'],
                'renter_id' => $row['renter_id'],
                'order_status' => $row['order_status'],
                'start_date' => $row['start_date'],
                'end_date' => $row['end_date'],
                'destination' => $row['destination'],
                'post_id' => $row['post_id'],
                'description' => $row['description'],
                'price_per_day' => $row['price_per_day'],
                'location' => $row['location'],
                'product_id' => $row['product_id'],
                'product_name' => $row['product_name'],
                'brand' => $row['brand'],
                'product_type' => $row['product_type'],
                'size' => $row['size'],
                'color' => $row['color'],
                'product_condition' => $row['product_condition'],
                'pictures' => !empty($row['picture_path']) ? [$row['picture_path']] : []
            ];

            $orders[] = $order_data;
        }

        echo json_encode($orders);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
