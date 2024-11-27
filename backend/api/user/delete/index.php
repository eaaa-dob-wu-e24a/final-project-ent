<?php

include_once("../../../functions/authorize.php");
include_once("../../../functions/handle_api_request.php");

$user_login_id = authorize($mySQL);

$input = handle_api_request('DELETE', 'Request method must be DELETE', 405);

$stmt = $mySQL->prepare("DELETE FROM user_profile WHERE user_login_id = ?");
