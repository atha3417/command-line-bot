<?php 

header('Content-Type: application/json');

$conn = mysqli_connect('localhost', 'root', '', 'php_cli-bot');

$job = mysqli_real_escape_string($conn, $_POST['job']);
$table = mysqli_real_escape_string($conn, $_POST['table']);

call_user_func_array($job, [$table]);

function look($table) {
	global $conn;
	$sql = "SELECT * FROM $table";
	$result = mysqli_query($conn, $sql);

	echo json_encode(mysqli_fetch_all($result, MYSQLI_ASSOC));
	die();
}

function look_at($table) {
	global $conn;
	// $keyword = mysqli_real_escape_string($conn, $_POST['keyword']);
	$keyword = $_POST['keyword'];
	$sql = "SELECT * FROM $table WHERE title = '$keyword' OR description ='$keyword' OR id = '$keyword'";
	$result = mysqli_query($conn, $sql);

	echo json_encode(mysqli_fetch_all($result, MYSQLI_ASSOC));
	die();
}
