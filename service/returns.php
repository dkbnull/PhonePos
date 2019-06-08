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
	
	// 查询订单
	if (strcmp($method,"selectOrder")==0){
		$ordernum=$request["data"];
		$username=$request["username"];
		
		// 取得 parcode
		$sql="select parcode from system where username='".$username."'";
		$result=$conn->query($sql);
		
		if ($record=$result->fetch_assoc()) {
			$parcode=$record["parcode"];
		}else{
			echo '{"msgcode":"2","msgmain":"parcode not select"}';
			return false;
		}
		
		//查询订单是否已退款
		$sql="select * from returns "
			."where parcode = '".$parcode."' "
			."and ordernum = '".$ordernum."'";
		$result=$conn->query($sql);
	
		if ($record=$result->fetch_assoc()) {
			echo '{"msgcode":"1"'
				.',"msgmain":{'
				.'"username":"'.$record["username"].'"'
				.'}}';
			return false;
		}
		
		// 查询订单
		$sql="select commodityinfo, payinfo from sale "
			."where parcode = '".$parcode."' "
			."and ordernum = '".$ordernum."'";
		$result=$conn->query($sql);
	
		if ($record=$result->fetch_assoc()) {
			echo '{"msgcode":"1"'
				.',"msgmain":{'
				.'"commodityinfo":'.$record["commodityinfo"].''
				.',"payinfo":'.$record["payinfo"].''
				.'}}';
		}else{
			echo '{"msgcode":"2"}';
		}
	} 
	
	// 查询是否使用了该支付方式支付
	else if (strcmp($method,"selectPayType")==0){
		$ordernum=$request["ordernum"];
		$paycode=$request["data"];
	
		$sql="select count(paycode) as paynum, sum(paytotal) as paytotal from sale_pay "
			."where ordernum = '".$ordernum."' "
			."and paycode = '".$paycode."'";
		$result=$conn->query($sql);
	
		if ($record=$result->fetch_assoc()) {
			echo '{"msgcode":"1"'
				.',"msgmain":{'
				.'"paynum":"'.$record["paynum"].'"'
				.',"paytotal":"'.$record["paytotal"].'"'
				.'}}';
		}else{
			echo '{"msgcode":"2"}';
		}
	} 
	
	// 保存退款信息
	else if (strcmp($method,"saveReturns")==0){
		$commodity=$GLOBALS["HTTP_RAW_POST_DATA"];
		$data=$request["data"];
		$username=$request["username"];
		$ordernum=$request["order"];
		$total=$request["total"];
		$cardfaceno=$request["cardfaceno"];
		
		// 保存退款信息到 returns 表是否成功
		$hasReturns=false;
		// 保存退款信息到 returns_commodity 表是否成功
		$hasReturnsCommodity=false;
		
		// 取得 parcode
		$sql="select parcode from system where username='".$username."'";
		$result=$conn->query($sql);
		
		if ($record=$result->fetch_assoc()) {
			$parcode=$record["parcode"];
		}else{
			echo '{"msgcode":"2","msgmain":"parcode not select"}';
			return false;
		}
		
		// 保存退款信息到 returns 表
		if($cardfaceno==""){
			$sql="insert into returns "
				."(parcode,ordernum,username,total,commodityinfo) "
				."values ('".$parcode."', '".$ordernum."', '".$username."', '"
				.$total."', '".$commodity."')";
		}else{
			$sql="insert into returns "
				."(parcode,ordernum,username,total,cardfaceno,commodityinfo) "
				."values ('".$parcode."', '".$ordernum."', '".$username."', '"
				.$total."', '".$cardfaceno."', '".$commodity."')";
		}
		
		if ($conn->query($sql)===true) {
			$hasReturns=true;
		}else{
			$hasReturns=false;
			echo '{"msgcode":"2","msgmain":"'.$conn->error.'"}';
			return false;
		}
		
		// 保存退款信息到 returns_commodity 表
		for($i = 0; $i < count($data); $i++){
			$no=$data[$i]["no"];
			$plucode=$data[$i]["code"];
			$pluname=$data[$i]["name"];
			$price=$data[$i]["price"];
			$number=$data[$i]["number"];
			$total=$data[$i]["total"];
			
			$sql="insert into returns_commodity ("
				."parcode,ordernum,no,plucode,pluname,price,number,total) "
				."values ('".$parcode."', '".$ordernum."', '".$no."', '"
				.$plucode."', '".$pluname."', '".$price."', '"
				.$number."', '".$total."')";
			
			if ($conn->query($sql)===true) {
				$hasReturnsCommodity=true;
			}else{
				$hasReturnsCommodity=false;
				echo '{"msgcode":"2","msgmain":"'.$conn->error.'"}';
				return false;
			}
		}
		
		if($hasReturns&&$hasReturnsCommodity){
			echo '{"msgcode":"1"}';
		}
	}
	
	// 保存退款支付信息
	else if (strcmp($method,"saveReturnsPay")==0){
		$pay=$GLOBALS["HTTP_RAW_POST_DATA"];
		$data=$request["data"];
		$username=$request["username"];
		$ordernum=$request["order"];
		$haspay=$request["haspay"];
		
		// 保存退款信息到 returns 表是否成功
		$hasReturns=false;
		// 保存退款信息到 returns_pay 表是否成功
		$hasReturnsPay=false;
		
		// 取得 parcode
		$sql="select parcode from system where username='".$username."'";
		$result=$conn->query($sql);
		
		if ($record=$result->fetch_assoc()) {
			$parcode=$record["parcode"];
		}else{
			echo '{"msgcode":"2","msgmain":"parcode not select"}';
		}
		
		// 保存退款信息到 returns 表
		$sql="update returns set refund='".$haspay
			."', payinfo='".$pay
			."' where parcode = '".$parcode
			."' and ordernum = '".$ordernum."'";
		
		if ($conn->query($sql)===true) {
			$hasReturns=true;
		}else{
			$hasReturns=false;
			echo '{"msgcode":"2","msgmain":"'.$conn->error.'"}';
			return false;
		}
		
		// 保存退款信息到 returns_pay 表
		for($i = 0; $i < count($data); $i++){
			$no=$data[$i]["no"];
			$paycode=$data[$i]["code"];
			$payname=$data[$i]["name"];
			$paytotal=$data[$i]["total"];
			
			$sql="insert into returns_pay ("
				."parcode,ordernum,no,paycode,payname,paytotal) "
				."values ('".$parcode."', '".$ordernum."', '".$no."', '"
				.$paycode."', '".$payname."', '".$paytotal."')";
			
			if ($conn->query($sql)===true) {
				$hasReturnsPay=true;
			}else{
				$hasReturnsPay=false;
				echo '{"msgcode":"2","msgmain":"'.$conn->error.'"}';
				return false;
			}
		}
		
		if($hasReturns&&$hasReturnsPay){
			echo '{"msgcode":"1"}';
		}
	}
	
	$conn->close();
?>