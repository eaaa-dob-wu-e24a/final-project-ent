<?php
// backend/api/product_order/create/index.php

include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/authorize.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_api_request.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_json_request.php");

// Authenticate the user and retrieve their user login ID
$user_login_id = authorize($mySQL);

// Handle the API request
handle_api_request('POST', 'Request method must be POST', 405);

// Handle the JSON request
$input = handle_json_request();

// function to format the dates
function format_date($date)
{
    $formats = [
        'Y-m-d',     // ISO/MySQL format
        'd-m-Y',     // Danish format
        'm/d/Y',     // US format
        'd/m/Y',     // EU format
        'Y/m/d',     // Alternative ISO format
    ];

    foreach ($formats as $format) {
        $parsed_date = DateTime::createFromFormat($format, $date);
        if ($parsed_date) {
            return $parsed_date->format('Y-m-d'); // Convert to MySQL format
        }
    }

    // Fallback to strtotime if none of the above formats match
    $timestamp = strtotime($date);
    if ($timestamp) {
        return date('Y-m-d', $timestamp);
    }

    return false; // Return false if parsing fails
}

// Validate that all required fields are provided in the input
if (!isset($input['rental_period']) || !isset($input['order_status']) || !isset($input['post_id']) || !isset($input['start_date']) || !isset($input['end_date'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Please fill out all required fields']);
    exit();
}

// Extract the input data into variables
$rental_period = $input['rental_period'];
$order_status = $input['order_status'];
$post_id = $input['post_id'];
$start_date = format_date($input['start_date']);
$end_date = format_date($input['end_date']);

if (!$start_date || !$end_date) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid date format. Please use a valid date format']);
    exit();
}

// Validate logical order of dates
if (strtotime($end_date) < strtotime($start_date)) {
    http_response_code(400);
    echo json_encode(['error' => 'End date must be after start date']);
    exit();
}

// Validate inputs
if (!is_numeric($post_id) || $post_id <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid post ID']);
    exit();
}

if (!is_numeric($rental_period) || $rental_period <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Rental period must be a positive number']);
    exit();
}

// Fetch the price_per_day for the given post_id
$stmt = $mySQL->prepare("SELECT price_per_day, user_login_id FROM post WHERE PK_ID = ?");
$stmt->bind_param("i", $post_id);
$stmt->execute();
$stmt->bind_result($price_per_day, $owner_id);
$stmt->fetch();
$stmt->close();

// Validate if the post exists and price_per_day is retrieved
if (is_null($price_per_day)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid post ID or post does not exist']);
    exit();
}

// Ensure price_per_day is valid
if ($price_per_day <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Price per day must be greater than 0']);
    exit();
}

// Calculate the deposit
$deposit = $rental_period * $price_per_day;

// Generate a unique 5-digit order number
function generate_unique_order_number($mySQL)
{
    do {
        $order_number = random_int(10000, 99999); // Generate a 5-digit number

        $stmt = $mySQL->prepare("SELECT COUNT(*) AS count FROM product_order WHERE order_number = ?");
        $stmt->bind_param("i", $order_number);
        $stmt->execute();

        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $count = $row['count'];

        $stmt->close();
    } while ($count > 0); // Repeat until a unique number is found

    return $order_number;
}

$order_number = generate_unique_order_number($mySQL);

// Prepare the SQL statement
$stmt = $mySQL->prepare("INSERT INTO product_order (order_number, deposit, rental_period, order_status, post_id, renter_id, owner_id, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("idssiiiss", $order_number, $deposit, $rental_period, $order_status, $post_id, $user_login_id, $owner_id, $start_date, $end_date);

try {
    if ($stmt->execute()) {
        // Retrieve the ID of the newly created order
        $order_id = $stmt->insert_id;

        // Return a success response with the order details
        echo json_encode([
            'success' => 'Order created successfully',
            'order_id' => $order_id,
            'order_number' => $order_number,
            'deposit' => $deposit,
            'rental_period' => $rental_period,
            'order_status' => $order_status,
            'post_id' => $post_id,
            'renter_id' => $user_login_id,
            'owner_id' => $owner_id,
            'start_date' => $start_date,
            'end_date' => $end_date,
        ]);
    }
} catch (mysqli_sql_exception $e) {
    if (strpos($e->getMessage(), 'foreign key constraint fails') !== false) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid post ID or user login ID']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'An error occurred while creating the order']);
    }
} finally {
    $stmt->close();
}

// Close the database connection
$mySQL->close();
