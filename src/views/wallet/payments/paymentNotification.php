<?php
require_once "conn.php";
require_once "./payment.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $requestBody = file_get_contents('php://input');
    $data = json_decode($requestBody);

    if (Xdpay::verify($data)) {
        $query = "SELECT * FROM `recharge` WHERE rand='$data->orderId' AND status != 'Success'";
        $result = mysqli_query($conn, $query);

        if ($result == TRUE && mysqli_num_rows($result) > 0) {
            $status;

            if ($data->status == 0) {
                $status = "unpaid";
            } else if ($data->status == 1) {
                $status = "Success";
            } else {
                $status = "Failed";
            }

            $rechargeData = mysqli_fetch_array($result);
            $userName = $rechargeData['username'];

            if ($status == "Success") {

                $opt = "SELECT SUM(recharge) as total FROM `recharge` WHERE username='$userName' AND status='Success'";
                $optres = $conn->query($opt);
                $sum = mysqli_fetch_assoc($optres);
                if ($sum['total'] == "" or $sum['total'] == "0") {

                    if ($data->amount >= 500 && $data->amount <= 999) {
                        $bonus = 150;
                        $bonus2 = 50;
                    } elseif ($data->amount >= 1000 && $data->amount <= 2999) {
                        $bonus = 200;
                        $bonus2 = 100;
                    } elseif ($data->amount >= 3000 && $data->amount <= 3999) {
                        $bonus = 400;
                        $bonus2 = 150;
                    } elseif ($data->amount >= 4000 && $data->amount <= 4999) {
                        $bonus = 500;
                        $bonus2 = 250;
                    } elseif ($data->amount >= 5000 && $data->amount <= 9999) {
                        $bonus = 600;
                        $bonus2 = 350;
                    } elseif ($data->amount >= 10000 && $data->amount <= 49999) {
                        $bonus = 1100;
                        $bonus2 = 500;
                    } elseif ($data->amount >= 50000 && $data->amount <= 99999) {
                        $bonus = 2300;
                        $bonus2 = 650;
                    } elseif ($data->amount >= 100000) {
                        $bonus = 5500;
                        $bonus2 = 1000;
                    } else {
                        $bonus = 0;
                        $bonus2 = 0;
                    }

                    $win = "select refcode FROM `users` WHERE  username='$username' ";
                    $result3 = $conn->query($win);
                    $row3 = mysqli_fetch_assoc($result3);
                    $refcode = $row3['refcode'];
                    $adb = "UPDATE users SET balance= balance + '$bonus' WHERE usercode='$refcode'";
                    $conn->query($adb);
                    $addbrec = "INSERT INTO bonus (giver,usercode,amount,level) VALUES ('$username','$refcode','$bonus','1')";
                    $conn->query($addbrec);
                } else {
                    $bonus = 0;
                    $bonus2 = 0;
                }

                $sql2 = "UPDATE recharge SET status = 'Success' WHERE rand = '$data->orderId'";
                $sql = "UPDATE users SET balance = balance + '$data->amount' + '$bonus2' WHERE username = '$userName'";

                if ($conn->query($sql) == TRUE && $conn->query($sql2) == TRUE) {
                    echo "success";
                    die();
                } else {
                    echo "non-success";
                    die();
                }
            }
            $sql1 = "UPDATE recharge SET status = '$status' WHERE rand = '$data->orderId'";

            if ($conn->query($sql1) == TRUE) {
                echo "success";
            } else {
                echo "non-success";
            }
        } else {
            echo "non-success";
        }
    } else {
        echo "non-success not verify";
    }
} else {
    echo "non-success";
}
