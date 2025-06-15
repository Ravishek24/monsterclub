<?php
// Include the database connection
require_once '../config/database.php';

// Define the allowed IP for the callback
$allowed_ip = '139.180.137.164';

// Define the log file
$log_file = '../logs/callbacklog.txt';

// Function to log messages
function log_message($message) {
    global $log_file;
    $timestamp = date('Y-m-d H:i:s');
    $formatted_message = "[$timestamp] - $message" . PHP_EOL . str_repeat("=", 50) . PHP_EOL;
    file_put_contents($log_file, $formatted_message, FILE_APPEND);
}

// Log the IP address of the request
log_message("Request received from IP: " . $_SERVER['REMOTE_ADDR']);

// Check if the request is coming from the allowed IP
if ($_SERVER['REMOTE_ADDR'] !== $allowed_ip) {
    // Log unauthorized access attempt
    log_message("Unauthorized access attempt from IP: " . $_SERVER['REMOTE_ADDR']);
    // If the IP is not allowed, do nothing or log the unauthorized attempt
    die('Unauthorized access.');
}

// Retrieve raw POST data
$raw_post_data = file_get_contents('php://input');
log_message("Raw POST data: " . $raw_post_data);

// Parse the URL-encoded POST data into an associative array
parse_str($raw_post_data, $post_data);
log_message("Parsed POST data: " . print_r($post_data, true));

// Check if the status parameter is present and equals '1'
if (isset($post_data['status']) && $post_data['status'] == '1') {
    // Retrieve the order_sn from the callback data
    $order_sn = $post_data['order_sn'];

    log_message("Processing order_sn: $order_sn");

    // Retrieve the status from the recharge table where id_order matches order_sn
    $stmt = $pdo->prepare("SELECT status, money, phone FROM recharge WHERE id_order = :order_sn");
    $stmt->execute(['order_sn' => $order_sn]);
    $rechargeData = $stmt->fetch(PDO::FETCH_ASSOC);

    // Check if a matching record is found
    if ($rechargeData) {
        $current_status = $rechargeData['status'];
        $phone = $rechargeData['phone'];
        $money = $rechargeData['money'];
        log_message("Record found. Current status: $current_status for phone: $phone");

        // If status is 1, return response "ok"
        if ($current_status == 1) {
            log_message("Order already processed. Returning 'ok'.");
            echo "ok";
            exit();
        }

        // If status is 0, update it to 1
        if ($current_status == 0) {
            // Begin a transaction
            $pdo->beginTransaction();
            log_message("Starting transaction for order_sn: $order_sn");

            try {
                // Update the status to 1 in the recharge table
                $update_stmt = $pdo->prepare("UPDATE recharge SET status = 1 WHERE id_order = :order_sn");
                $update_stmt->execute(['order_sn' => $order_sn]);
                log_message("Updated recharge status to 1 for order_sn: $order_sn");

                // Retrieve the current money from the users table where phone matches
                $user_stmt = $pdo->prepare("SELECT money, total_money FROM users WHERE phone = :phone");
                $user_stmt->execute(['phone' => $phone]);
                $userData = $user_stmt->fetch(PDO::FETCH_ASSOC);

                if ($userData) {
                    $current_user_money = $userData['money'];
                    $current_total_money = $userData['total_money'];

                    // Calculate the new money values
                    $new_user_money = $current_user_money + $money;
                    $new_total_money = $current_total_money + $money;

                    // Update the users table with the new money values
                    $update_user_stmt = $pdo->prepare("UPDATE users SET money = :new_money, total_money = :new_total_money WHERE phone = :phone");
                    $update_user_stmt->execute(['new_money' => $new_user_money, 'new_total_money' => $new_total_money, 'phone' => $phone]);
                    log_message("Updated user's money and total_money for phone: $phone. New values - money: $new_user_money, total_money: $new_total_money");
                }

                // Commit the transaction
                $pdo->commit();
                log_message("Transaction committed successfully for order_sn: $order_sn");

                // Return response "ok"
                echo "ok";
            } catch (Exception $e) {
                // Rollback the transaction if something went wrong
                $pdo->rollBack();
                log_message("Transaction failed and rolled back for order_sn: $order_sn. Error: " . $e->getMessage());
                die('Error processing payment: ' . $e->getMessage());
            }
        }
    } else {
        // If no matching record is found, return "error"
        log_message("No matching record found for order_sn: $order_sn. Returning 'error'.");
        echo "error";
    }
} else {
    // If status is not 1, return response "error"
    log_message("Status is not '1' or not present in POST data. Returning 'error'.");
    echo "error";
}
?>
