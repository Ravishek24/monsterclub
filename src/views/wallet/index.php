<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pay</title>
</head>
<body>
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

   $token = $_POST['user'];
  $phoneselect="SELECT * FROM users  WHERE token='$token' ";
$phonefetch=$conn->query($phoneselect);
$phoneresult= mysqli_fetch_assoc($phonefetch);
$phone =  $phoneresult['phone'];
    ?>
<center><h4><b>Payment Is Initialising! Please Wait. <br>Heading you to payment page!!!</b></h4></center>
    <form id="autoForm" action="initialised.php" method="POST">
        <input type="hidden" name="user" value="<?php echo $phone;?>">
        <input type="hidden" name="am" value="<?php echo $_POST['am'];?>">
    </form>

    <script>
        // Coded By Ginibash
        setTimeout(function() {
            document.getElementById("autoForm").submit();
        }, 3000); // 10000 milliseconds = 10 seconds
    </script>
    
    
</body>
</html>