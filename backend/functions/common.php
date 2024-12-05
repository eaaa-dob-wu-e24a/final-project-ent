<?php
function is_admin($user_login_id, $mySQL) {
    $sql = "SELECT is_admin FROM user_login WHERE PK_ID = ?";
    $stmt = $mySQL->prepare($sql);
    $stmt->bind_param("i", $user_login_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    return isset($user['is_admin']) && $user['is_admin'] == 1;
}
?>
