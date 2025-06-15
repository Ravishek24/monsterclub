
<?php

$servername = "localhost";
$username = "diuwin756hg";
$password = "diuwin756hg";
$dbname = "diuwin756hg";

// Establish a database connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
if (!$_SERVER["REQUEST_METHOD"] == "POST" && !$_POST['status'] == "2")  {
   echo "It is not You! It is us.. We are having problems processing your request. Please head over to the main page."; 
}else{
    $payorderid = $_POST['payOrderId']; //datas received from trading fenter
    $mchorder = $_POST['mchOrderNo'];
    $am = $_POST['amount'];
    $currency = $_POST['currency'];
    $status = $_POST['status'];
    $amount=$am/100;
    $user = (explode("xx",$mchorder));
    $username = $user[1];
    $rand = rand(000000000000,999999999999);
    
  if(!$mchorder==""){ //prevent empty order id 
        $sql1 = "INSERT INTO `dragonpay` (`id`, `username`, `payOrderId`, `mchOrderNo`, `amount`, `currency`, `status`) VALUES (NULL, '$username', '$payorderid', '$mchorder', '$amount', '$currency', 'Success')";  
  }
    if($conn->query($sql1)){
        $sql2 = "UPDATE users SET  money = money+$amount WHERE phone='$username' "; 
        echo 'success';
    }
    if($conn->query($sql2)){
    $sql3 = "INSERT INTO `recharge` (`id`, `id_order`, `transaction_id`, `utr`, `phone`, `money`, `type`, `status`, `today`, `url`, `time`) VALUES (NULL, '$rand', '$payorderid', '$rand', '$username', '$amount', 'upiauto', '1', current_timestamp(), 'NULL', current_timestamp())";    
        $conn->query($sql3);
        }else{
        $sql4 = "INSERT INTO `recharge` (`id`, `id_order`, `transaction_id`, `utr`, `phone`, `money`, `type`, `status`, `today`, `url`, `time`) VALUES (NULL, '$rand', '$payorderid', '$rand', '$username', '$amount', 'upiauto', '2', current_timestamp(), 'NULL', current_timestamp())";    
        $conn->query($sql4);    
  }
$conn -> close();

}

?>