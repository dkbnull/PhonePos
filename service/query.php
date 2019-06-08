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
	if (strcmp($method,"queryOrder")==0){
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
				.'}}';
		}else{
			echo '{"msgcode":"2"}';
		}
	} 
	
	// 查询所有商品
	else if (strcmp($method,"queryCommodityAll")==0){
		$username=$request["username"];
		
		$sql="select plucode, pluname, price, vipprice, isinventory, ispresent, issale, remark "
			."from commodity, user, system "
			."where commodity.parcode=system.parcode "
			."and system.username=user.username "
			."and commodity.issale='1' "
			."and user.username='".$username."'";
			
		$result=$conn->query($sql);
	
		if ($result->num_rows>0) {
			while($record=$result->fetch_assoc()){
				if($record["isinventory"]==1){
					$record["isinventory"]="是";
				}else{
					$record["isinventory"]="否";
				}
				if($record["ispresent"]==1){
					$record["ispresent"]="是";
				}else{
					$record["ispresent"]="否";
				}
				
				if($msgmain==''){
					$msgmain='{"code":"'.$record["plucode"].'"'
							.',"name":"'.$record["pluname"].'"'
							.',"price":"'.$record["price"].'"'
							.',"vipprice":"'.$record["vipprice"].'"'
							.',"isinventory":"'.$record["isinventory"].'"'
							.',"ispresent":"'.$record["ispresent"].'"'
							.',"remark":"'.$record["remark"].'"'
							.'}';
				}
				else{
					$msgmain=$msgmain
							.',{"code":"'.$record["plucode"].'"'
							.',"name":"'.$record["pluname"].'"'
							.',"price":"'.$record["price"].'"'
							.',"vipprice":"'.$record["vipprice"].'"'
							.',"isinventory":"'.$record["isinventory"].'"'
							.',"ispresent":"'.$record["ispresent"].'"'
							.',"remark":"'.$record["remark"].'"'
							.'}';
				}
			}
			
			echo '{"msgcode":"1"'
				.',"msgmain":['
				.$msgmain
				.']}';
		}else{
			echo '{"msgcode":"2"}';
		}
	} 
	
	// 按编码查询商品
	else if (strcmp($method,"queryCommodityCode")==0){
		$plucode=$request["data"];
		$username=$request["username"];
		
		$sql="select plucode, pluname, price, vipprice, isinventory, ispresent, issale, remark "
			."from commodity, user, system "
			."where commodity.parcode=system.parcode "
			."and system.username=user.username "
			."and commodity.issale='1' "
			."and commodity.plucode like '%".$plucode."%' "
			."and user.username='".$username."'";
			
		$result=$conn->query($sql);
	
		if ($result->num_rows>0) {
			while($record=$result->fetch_assoc()){
				if($record["isinventory"]==1){
					$record["isinventory"]="是";
				}else{
					$record["isinventory"]="否";
				}
				if($record["ispresent"]==1){
					$record["ispresent"]="是";
				}else{
					$record["ispresent"]="否";
				}
				
				if($msgmain==''){
					$msgmain='{"code":"'.$record["plucode"].'"'
							.',"name":"'.$record["pluname"].'"'
							.',"price":"'.$record["price"].'"'
							.',"vipprice":"'.$record["vipprice"].'"'
							.',"isinventory":"'.$record["isinventory"].'"'
							.',"ispresent":"'.$record["ispresent"].'"'
							.',"remark":"'.$record["remark"].'"'
							.'}';
				}
				else{
					$msgmain=$msgmain
							.',{"code":"'.$record["plucode"].'"'
							.',"name":"'.$record["pluname"].'"'
							.',"price":"'.$record["price"].'"'
							.',"vipprice":"'.$record["vipprice"].'"'
							.',"isinventory":"'.$record["isinventory"].'"'
							.',"ispresent":"'.$record["ispresent"].'"'
							.',"remark":"'.$record["remark"].'"'
							.'}';
				}
			}
			
			echo '{"msgcode":"1"'
				.',"msgmain":['
				.$msgmain
				.']}';
		}else{
			echo '{"msgcode":"2"}';
		}
	} 
	
	// 按名称查询商品
	else if (strcmp($method,"queryCommodityName")==0){
		$pluname=$request["data"];
		$username=$request["username"];
		
		$sql="select plucode, pluname, price, vipprice, isinventory, ispresent, issale, remark "
			."from commodity, user, system "
			."where commodity.parcode=system.parcode "
			."and system.username=user.username "
			."and commodity.issale='1' "
			."and commodity.pluname like '%".$pluname."%' "
			."and user.username='".$username."'";
			
		$result=$conn->query($sql);
	
		if ($result->num_rows>0) {
			while($record=$result->fetch_assoc()){
				if($record["isinventory"]==1){
					$record["isinventory"]="是";
				}else{
					$record["isinventory"]="否";
				}
				if($record["ispresent"]==1){
					$record["ispresent"]="是";
				}else{
					$record["ispresent"]="否";
				}
				
				if($msgmain==''){
					$msgmain='{"code":"'.$record["plucode"].'"'
							.',"name":"'.$record["pluname"].'"'
							.',"price":"'.$record["price"].'"'
							.',"vipprice":"'.$record["vipprice"].'"'
							.',"isinventory":"'.$record["isinventory"].'"'
							.',"ispresent":"'.$record["ispresent"].'"'
							.',"remark":"'.$record["remark"].'"'
							.'}';
				}
				else{
					$msgmain=$msgmain
							.',{"code":"'.$record["plucode"].'"'
							.',"name":"'.$record["pluname"].'"'
							.',"price":"'.$record["price"].'"'
							.',"vipprice":"'.$record["vipprice"].'"'
							.',"isinventory":"'.$record["isinventory"].'"'
							.',"ispresent":"'.$record["ispresent"].'"'
							.',"remark":"'.$record["remark"].'"'
							.'}';
				}
			}
			
			echo '{"msgcode":"1"'
				.',"msgmain":['
				.$msgmain
				.']}';
		}else{
			echo '{"msgcode":"2"}';
		}
	} 
	
	$conn->close();
?>