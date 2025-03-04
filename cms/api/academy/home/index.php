<?php 

include '../../../wp-load.php';

$options = get_field('academy', 'options');

wp_send_json($options);