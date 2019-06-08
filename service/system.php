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
	
	// 获取系统配置
	if (strcmp($method,"getSystem")==0){
		$username=$request["username"];
		
		$sql="select orgcode, shopcode from system, partner "
			."where system.parcode=partner.parcode and username = '".$username."'";
		$result=$conn->query($sql);
	
		if ($record=$result->fetch_assoc()) {
			echo '{"msgcode":"1"'
				.',"msgmain":{'
				.'"orgcode":"'.$record["orgcode"].'"'
				.',"shopcode":"'.$record["shopcode"].'"'
				.'}}';
		}else{
			echo '{"msgcode":"2"}';
		}
	} 
	
	// 修改系统配置
	else if (strcmp($method,"settingSystem")==0){
//		$username=$request["username"];
//		$systemnull=$request["systemNull"];
//		$orgcode=$request["data"]["orgcode"];
//		$shopcode=$request["data"]["shopcode"];
//
//		if($systemnull){
//			$sql="insert into system (username,orgcode,shopcode) values ('"
//				.$username."', '".$orgcode."', '".$shopcode."')";
//		}else{
//			$sql="update system set orgcode='".$orgcode."', shopcode='".$shopcode
//				."' where username = '".$username."'";
//		}
//		
//		if ($conn->query($sql)===true) {
//			echo '{"msgcode":"1"}';
//		}else{
//			echo '{"msgcode":"2","msgmain":"'.$conn->error.'"}';
//		}
	}

	$conn->close();
?>