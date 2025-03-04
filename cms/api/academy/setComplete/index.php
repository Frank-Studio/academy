<?php 

include '../../../wp-load.php';

$status = true;

$id = ($_REQUEST['id']) ? $_REQUEST['id'] : false;
$user_id = ($_REQUEST['user_id']) ? $_REQUEST['user_id'] : false;
$set = ($_REQUEST['set'] && $_REQUEST['set'] == 'true') ? true : false;

if($set){
    $a = 'h1';
    add_user_meta($user_id, 'course_completed_'.$id, true);
} else {
    $a = 'h2';
    delete_user_meta($user_id, 'course_completed_'.$id);
}

$response = array(
    'status' => $status,
    'a' => $a,
    'set' => $set
);

wp_send_json($response);