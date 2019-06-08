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
	
	// 加载日结信息
	if(strcmp($method,"loadDayover")==0){
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

		$hasChange=false;
		
		$sql="select sale_pay.paycode, sale_pay.payname, sum(sale_pay.paytotal) paytotal "
			."from sale, sale_pay "
			."where sale.parcode=sale_pay.parcode "
			."and sale.parcode='".$parcode."' "
			."and sale.ordernum=sale_pay.ordernum "
			."and sale.ordernum like '".$ordernum."%' "
			."group by paycode";
		$result=$conn->query($sql);

		$sql="select sum(changetotal) changetotal "
			."from sale "
			."where ordernum like '".$ordernum."%'";
		$resultChange=$conn->query($sql);
		
		$sql="select sum(total) total "
			."from returns "
			."where ordernum like '".$ordernum."%'";
		$resultReturns=$conn->query($sql);

		if ($result->num_rows>0) {
			$change=$resultChange->fetch_assoc();
			$change=$change["changetotal"];
			
			$returns=$resultReturns->fetch_assoc();
			$returns=$returns["total"];
			
			while($record=$result->fetch_assoc()){
				if($record["paycode"]==0){
					$record["paytotal"] =$record["paytotal"] - $change - $returns;
					$hasChange=true;
				}
			
				if($msgmain==''){
					$msgmain='{"paycode":"'.$record["paycode"].'"'
						.',"payname":"'.$record["payname"].'"'
						.',"paytotal":"'.$record["paytotal"].'"}';
				}else{
					$msgmain=$msgmain
						.',{"paycode":"'.$record["paycode"].'"'
						.',"payname":"'.$record["payname"].'"'
						.',"paytotal":"'.$record["paytotal"].'"}';
				}
			}
			
			if(!$hasChange){
				$cash = $change + $returns;
				$msgmain=$msgmain
					.',{"paycode":"0"'
					.',"payname":"现金"'
					.',"paytotal":"-'.$cash.'"}';
			}
			
			echo '{"msgcode":"1"'
				.',"msgmain":['
				.$msgmain
				.']}';
		}else{
			echo '{"msgcode":"2"}';
		}
	}

	// 日结
	else if (strcmp($method,"dayover")==0){
		$data=$request["data"];
		$date=$request["date"];
		$total=$request["total"];
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

		// 是否已经日结
		$sql="select * from dayover "
			."where parcode='".$parcode."' "
			."and date='".$date."'";
		$result=$conn->query($sql);
		
		if ($record=$result->fetch_assoc()) {
			echo '{"msgcode":"2","msgmain":"has dayover"}';
			return false;
		}

		$sql="insert into dayover (parcode, date, operator, total, info) "
			."values ('"
			.$parcode."', '"
			.$date."', '"
			.$username."', '"
			.$total."', '"
			.$username
			."')";
		
		if ($conn->query($sql)===true) {
			echo '{"msgcode":"1"}';
		}else{
			echo '{"msgcode":"2","msgmain":"'.$conn->error.'"}';
		}
	}

	$conn->close();
?>