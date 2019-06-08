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
	
	// 登录
	if (strcmp($method,"login")==0){
		$username=$request["data"]["username"];
		$password=$request["data"]["password"];
		
		$sql="select password,usercode,name,rank from user where username = '".$username."'";
		$result=$conn->query($sql);
	
		if ($record=$result->fetch_assoc()) {
			if ($password==$record["password"]) {
				echo '{"msgcode":"1"'
				.',"msgmain":{'
				.'"usercode":"'.$record["usercode"].'"'
				.',"name":"'.$record["name"].'"'
				.',"rank":"'.$record["rank"].'"'
				.'}}';
			}else{
				echo '{"msgcode":"2"}';
			}
		}else{
			echo '{"msgcode":"3"}';
		}
	} 
	
	// 获取个人信息
	else if (strcmp($method,"getPerson")==0){
		$username=$request["username"];
		
		$sql="select usercode, name, phone from user where username = '".$username."'";
		$result=$conn->query($sql);
	
		if ($record=$result->fetch_assoc()) {
			echo '{"msgcode":"1"'
				.',"msgmain":{'
				.'"usercode":"'.$record["usercode"].'"'
				.',"name":"'.$record["name"].'"'
				.',"phone":"'.$record["phone"].'"'
				.'}}';
		}else{
			echo '{"msgcode":"2"}';
		}
	}
	
	// 修改个人信息
	else if (strcmp($method,"settingPerson")==0){
		$username=$request["data"]["username"];
		$name=$request["data"]["name"];
		$phone=$request["data"]["phone"];

		$sql="update user set name='".$name."', phone='".$phone
			."' where username = '".$username."'";
	
		if ($conn->query($sql)===true) {
			echo '{"msgcode":"1"}';
		}else{
			echo '{"msgcode":"2","msgmain":"'.$conn->error.'"}';
		}
	}

	$conn->close();
?>