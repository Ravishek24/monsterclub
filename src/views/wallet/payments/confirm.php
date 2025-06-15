<?php

$servername = "localhost";
$username = "epqahhly_dubai";
$password = "epqahhly_dubai";
$dbname = "epqahhly_dubai";

// Establish a database connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

include ('signapi.php');

$merchant_key = "1bc3990b3cde4069b06c05d22a9dd860";

$amount = $_POST["amount"];    

$mchId = $_POST["mchId"];

$mchOrderNo = $_POST["mchOrderNo"];

$merRetMsg = $_POST["merRetMsg"];

$orderDate = $_POST["orderDate"];

$orderNo = $_POST["orderNo"];    

$oriAmount = $_POST["oriAmount"];

$tradeResult = $_POST["tradeResult"];

$signType = $_POST["signType"];

$sign = $_POST["sign"];

$am = $_POST['oriAmount'];
$amount = $am;
$orderid = $_POST['mchOrderNo'];
$order = explode('xx',$_POST['mchOrderNo']);
$user = $order[1];
$username = $user;


function random_strings($length_of_string)
{
	$str_result = '0123456789AXYZ012345678901234567890123456789';
	return substr(str_shuffle($str_result),0,$length_of_string);
}

$rand = random_strings(22);

$sql1 = "INSERT INTO recharge (username, recharge,status,upi,utr,rand) VALUES ('$user', '$am','unpaid','$rand','$orderid','$rand')";
$conn->query($sql1);

$opt = "SELECT COUNT(*) as total FROM `recharge` WHERE username='$user' AND status='Success'";
$optres = $conn->query($opt);
$sum = mysqli_fetch_assoc($optres);

if ($sum['total'] == "" or $sum['total'] <= 2) {
    
    if ($sum['total'] == 1 && $amount >= 600) {
		$bonus = 150;
	} elseif ($sum['total'] == 2 && $amount >= 1000) {
		$bonus = 200;
	} else {
		$bonus = 100;
	}

	$win = "select refcode FROM `users` WHERE  username ='$username' ";
	$result3 = $conn->query($win);
	$row3 = mysqli_fetch_assoc($result3);
	$refcode = $row3['refcode'];
	$adb = "UPDATE users SET bonus= bonus + $bonus WHERE usercode='$refcode'";
	$conn->query($adb);
	$transquery = "INSERT INTO trans (username,reason,amount) VALUES ('$refcode' ,'CheckIn Bonus',$bonus)";
	$conn->query($transquery);
	$addbrec = "INSERT INTO bonus (giver,usercode,amount,level) VALUES ('$username','$refcode','$bonus','1')";
	$conn->query($addbrec);
}

$addwin00 = "UPDATE recharge SET status = 'Success' WHERE username='$username' AND recharge='$amount' AND utr='$orderid'";
$conn->query($addwin00);
$transquery = "INSERT INTO trans (username,reason,amount) VALUES ('$username', 'Recharge',$amount)";
$conn->query($transquery);

$addwin0 = "UPDATE users SET balance= balance + $amount WHERE username='$username'";
$conn->query($addwin0);

echo 'success';

?>