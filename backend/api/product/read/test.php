<?php

include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/authorize.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_api_request.php");

$user_login_id = authorize($mySQL);

handle_api_request('GET', 'Request method must be GET', 405);

// SQL query to join product and product_pictures tables
$query = "
    SELECT 
        p.PK_ID AS product_id,
        p.brand,
        p.name,
        p.product_type,
        p.size,
        p.color,
        p.product_condition,
        pp.picture_path
    FROM 
        product p
    LEFT JOIN 
        product_pictures pp 
    ON 
        p.PK_ID = pp.product_id
    WHERE 
        p.user_login_id = ?
";

$stmt = $mySQL->prepare($query);
$stmt->bind_param("i", $user_login_id);
$stmt->execute();

$result = $stmt->get_result();

$products = [];
while ($product = $result->fetch_assoc()) {
    // Collect products and their associated picture paths
    $products[] = $product;
}

echo json_encode($products);