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
	
	// 查询商品
	if (strcmp($method,"selectCommodity")==0){
		$plucode=$request["data"];
		$username=$request["username"];
		 
		$sql="select pluname, price, vipprice, isinventory, ispresent, issale "
			."from commodity, user, system "
			."where commodity.parcode=system.parcode "
			."and system.username=user.username "
			."and user.username='".$username."' "
			."and commodity.plucode = '".$plucode."'";
		$result=$conn->query($sql);
	
		if ($record=$result->fetch_assoc()) {
			echo '{"msgcode":"1"'
				.',"msgmain":{'
				.'"pluname":"'.$record["pluname"].'"'
				.',"price":"'.$record["price"].'"'
				.',"vipprice":"'.$record["vipprice"].'"'
				.',"isinventory":"'.$record["isinventory"].'"'
				.',"ispresent":"'.$record["ispresent"].'"'
				.',"issale":"'.$record["issale"].'"'
				.'}}';
		}else{
			echo '{"msgcode":"2"}';
		}
	} 
	
	// 会员验证
	else if(strcmp($method,"vipVerify")==0){
		$cardfaceno=$request["data"];
		$username=$request["username"];
		
		$sql="select member.cardtype, member.name, member.phone, member.enddate "
			."from member, user, system "
			."where member.parcode=system.parcode "
			."and system.username=user.username "
			."and user.username='".$username."' "
			."and member.cardfaceno = '".$cardfaceno."'";
		$result=$conn->query($sql);
	
		if ($record=$result->fetch_assoc()) {
			echo '{"msgcode":"1"'
				.',"msgmain":{'
				.'"cardtype":"'.$record["cardtype"].'"'
				.',"name":"'.$record["name"].'"'
				.',"phone":"'.$record["phone"].'"'
				.',"enddate":"'.$record["enddate"].'"'
				.'}}';
		}else{
			echo '{"msgcode":"2"}';
		}
	}
	
	// 加载支付方式
	else if(strcmp($method,"loadPayMode")==0){
		$sql="select paycode, payname, paytype from paymode";
		$result=$conn->query($sql);

		if ($result->num_rows>0) {
			while($record=$result->fetch_assoc()){
				if($msgmain==''){
					$msgmain='{"paycode":"'.$record["paycode"].'"'
						.',"payname":"'.$record["payname"].'"'
						.',"paytype":"'.$record["paytype"].'"}';
				}else{
					$msgmain=$msgmain
						.',{"paycode":"'.$record["paycode"].'"'
						.',"payname":"'.$record["payname"].'"'
						.',"paytype":"'.$record["paytype"].'"}';
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
	
	// 保存流水信息
	else if (strcmp($method,"saveOrder")==0){
		$commodity=$GLOBALS["HTTP_RAW_POST_DATA"];
		$data=$request["data"];
		$username=$request["username"];
		$ordernum=$request["order"];
		$total=$request["total"];
		$cardfaceno=$request["cardfaceno"];
		
		// 保存流水信息到 sale 表是否成功
		$hasSale=false;
		// 保存流水信息到 sale_commodity 表是否成功
		$hasSaleCommodity=false;
		
		// 取得 parcode
		$sql="select parcode from system where username='".$username."'";
		$result=$conn->query($sql);
		
		if ($record=$result->fetch_assoc()) {
			$parcode=$record["parcode"];
		}else{
			echo '{"msgcode":"2","msgmain":"parcode not select"}';
			return false;
		}
		
		// 保存流水信息到 sale 表
		if($cardfaceno==""){
			$sql="insert into sale "
				."(parcode,ordernum,username,shouldtotal,actualtotal,commodityinfo) "
				."values ('".$parcode."', '".$ordernum."', '".$username."', '"
				.$total."', '".$total."', '".$commodity."')";
		}else{
			$sql="insert into sale "
				."(parcode,ordernum,username,shouldtotal,actualtotal,cardfaceno,commodityinfo) "
				."values ('".$parcode."', '".$ordernum."', '".$username."', '"
				.$total."', '".$total."', '".$cardfaceno."', '".$commodity."')";
		}
		
		if ($conn->query($sql)===true) {
			$hasSale=true;
		}else{
			$hasSale=false;
			echo '{"msgcode":"2","msgmain":"'.$conn->error.'"}';
			return false;
		}
		
		// 保存流水信息到 sale_commodity 表
		for($i = 0; $i < count($data); $i++){
			$no=$data[$i]["no"];
			$plucode=$data[$i]["code"];
			$pluname=$data[$i]["name"];
			$price=$data[$i]["price"];
			$number=$data[$i]["number"];
			$total=$data[$i]["total"];
			
			$sql="insert into sale_commodity ("
				."parcode,ordernum,no,plucode,pluname,price,number,total) "
				."values ('".$parcode."', '".$ordernum."', '".$no."', '"
				.$plucode."', '".$pluname."', '".$price."', '"
				.$number."', '".$total."')";
			
			if ($conn->query($sql)===true) {
				$hasSaleCommodity=true;
			}else{
				$hasSaleCommodity=false;
				echo '{"msgcode":"2","msgmain":"'.$conn->error.'"}';
				return false;
			}
		}
		
		if($hasSale&&$hasSaleCommodity){
			echo '{"msgcode":"1"}';
		}
	}
	
	// 保存支付信息
	else if (strcmp($method,"savePay")==0){
		$pay=$GLOBALS["HTTP_RAW_POST_DATA"];
		$data=$request["data"];
		$username=$request["username"];
		$ordernum=$request["order"];
		$haspay=$request["haspay"];
		$change=$request["change"];
		
		// 保存支付信息到 sale 表是否成功
		$hasSale=false;
		// 保存支付信息到 sale_pay 表是否成功
		$hasSalePay=false;
		
		// 取得 parcode
		$sql="select parcode from system where username='".$username."'";
		$result=$conn->query($sql);
		
		if ($record=$result->fetch_assoc()) {
			$parcode=$record["parcode"];
		}else{
			echo '{"msgcode":"2","msgmain":"parcode not select"}';
			return false;
		}
		
		// 保存支付信息到 sale 表
		$sql="update sale set paytotal='".$haspay
			."', changetotal='".$change
			."', paydate='".date("Y-m-d h:m:s",time())
			."', payinfo='".$pay
			."' where parcode = '".$parcode
			."' and ordernum = '".$ordernum."'";
		
		if ($conn->query($sql)===true) {
			$hasSale=true;
		}else{
			$hasSale=false;
			echo '{"msgcode":"2","msgmain":"'.$conn->error.'"}';
			return false;
		}
		
		// 保存流水信息到 sale_pay 表
		for($i = 0; $i < count($data); $i++){
			$no=$data[$i]["no"];
			$paycode=$data[$i]["code"];
			$payname=$data[$i]["name"];
			$paytotal=$data[$i]["total"];
			
			$sql="insert into sale_pay ("
				."parcode,ordernum,no,paycode,payname,paytotal) "
				."values ('".$parcode."', '".$ordernum."', '".$no."', '"
				.$paycode."', '".$payname."', '".$paytotal."')";
			
			if ($conn->query($sql)===true) {
				$hasSalePay=true;
			}else{
				$hasSalePay=false;
				echo '{"msgcode":"2","msgmain":"'.$conn->error.'"}';
				return false;
			}
		}
		
		if($hasSale&&$hasSalePay){
			echo '{"msgcode":"1"}';
		}
	}
	
	$conn->close();
?>