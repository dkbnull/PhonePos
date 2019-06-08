<?php
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
	header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
	header("Content-Type: application/json; charset=UTF-8");

	$dbhost="localhost";
	$dbuser="root";
	$dbpassword="DuKunBiao";
	$dbname="phonepos";
	
	$conn= new mysqli($dbhost,$dbuser,$dbpassword,$dbname);
	if($conn->connect_error){
		die("数据库连接失败。".$conn->connect_error);
	}
	
	$request=json_decode($GLOBALS["HTTP_RAW_POST_DATA"], true);
	$method=$request["method"];
	
	// 反馈
	if (strcmp($method,"feedback")==0){
		$username=$request["username"];
		$problem=$request["data"]["problem"];
		$phone=$request["data"]["phone"];
		
		$sql="insert into feedback (username,problem,phone) values ('"
				.$username."', '".$problem."', '".$phone."')";
	
		if ($conn->query($sql)===true) {
			echo '{"msgcode":"1"}';
		}else{
			echo '{"msgcode":"2","msgmain":"'.$conn->error.'"}';
		}
	}
	
	$conn->close();
?>