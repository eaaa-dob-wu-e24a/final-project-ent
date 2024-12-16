<?php

function is_admin($user_login_id, $mySQL)
{
    // Prepare statement to get is_admin status
    $stmt = $mySQL->prepare("SELECT is_admin FROM user_login WHERE PK_ID = ?");
    $stmt->bind_param("i", $user_login_id);
    $stmt->execute();
    $stmt->bind_result($is_admin);
    $stmt->fetch();
    $stmt->close();

    return (bool)$is_admin;
}
