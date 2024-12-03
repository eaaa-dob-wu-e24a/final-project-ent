<?php

include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/authorize.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_api_request.php");

$user_login_id = authorize($mySQL);

handle_api_request('GET', 'Request method must be GET', 405);

$product_id = intval($_GET['product_id']);

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
        p.user_login_id = ? AND p.PK_ID = ?
";

$stmt = $mySQL->prepare($query);
$stmt->bind_param("ii", $user_login_id, $product_id);
$stmt->execute();

$result = $stmt->get_result();

$product = $result->fetch_assoc();

if (!$product) {
    http_response_code(404);
    echo json_encode(["error" => "Product not found"]);
    exit;
}

echo json_encode($product);
?>
