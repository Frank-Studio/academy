<?php 

include '../../../wp-load.php';

$status = true;

$ids = ($_REQUEST['ids']) ? $_REQUEST['ids'] : false;
$user_id = ($_REQUEST['user_id']) ? $_REQUEST['user_id'] : false;

$courses = array();
$totCompleted = 0;

foreach(explode(',',$ids) as $id){
    if(get_user_meta($user_id, 'course_completed_'.$id)){
        $courses[$id] = true;
        $totCompleted += 1;
    } else {
        $courses[$id] = false;
    }
}

$response = array(
    'status' => $status,
    'courses' => $courses,
    'totCompleted' => $totCompleted
);

wp_send_json($response);