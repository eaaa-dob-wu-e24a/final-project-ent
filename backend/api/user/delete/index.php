<?php

include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/authorize.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_api_request.php");
include_once($_SERVER["DOCUMENT_ROOT"] . "/functions/handle_json_request.php");


$user_login_id = authorize($mySQL);

handle_api_request('DEL', 'Request method must be DELETE', 405);

$input = handle_json_request();

$stmt = $mySQL->prepare("DELETE FROM user_profile WHERE user_login_id = ?");
