<?php
// initiate.php

require_once '../config/database.php';

function generateUniqueOrderId($pdo) {
    do {
        $uniqueId = 'LG' . str_pad(mt_rand(1, 999999999999), 12, '0', STR_PAD_LEFT);
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM recharge WHERE id_order = :uniqueId");
        $stmt->execute(['uniqueId' => $uniqueId]);
        $count = $stmt->fetchColumn();
    } while ($count > 0);
    
    return $uniqueId;
}

function getIndianTime() {
    $tz = new DateTimeZone('Asia/Kolkata');
    $date = new DateTime('now', $tz);
    return $date;
}

// Get the key and order parameter values
$key = isset($_GET['key']) ? $_GET['key'] : null;
$order = isset($_GET['order']) ? $_GET['order'] : null;

if ($key && $order) {
    // Retrieve phone from users table where token matches the key
    $stmt = $pdo->prepare("SELECT phone FROM users WHERE token = :key");
    $stmt->execute(['key' => $key]);
    $phone = $stmt->fetchColumn();

    if ($phone) {
        // Generate a unique order ID
        $uniqueOrderId = generateUniqueOrderId($pdo);

        // Get current Indian time
        $currentDateTime = getIndianTime();
        $today = $currentDateTime->format('Y-m-d H:i:s'); // Formatted date and time
        $timestamp = round(microtime(true) * 1000); // Unix timestamp in milliseconds since 1970-01-01 00:00:00 UTC

        // Insert into recharge table
        $stmt = $pdo->prepare("
            INSERT INTO recharge (id_order, transaction_id, phone, money, type, status, today, time) 
            VALUES (:id_order, :transaction_id, :phone, :money, :type, :status, :today, :time)
        ");
        $stmt->execute([
            'id_order' => $uniqueOrderId,
            'transaction_id' => 0,
            'phone' => $phone,
            'money' => $order,
            'type' => 'LGPay',
            'status' => 0,
            'today' => $today,
            'time' => $timestamp // Insert the current timestamp in milliseconds
        ]);

        // Construct the URL
        $url = "https://pay.okwiins.online/order/lgpay.php?mark={$uniqueOrderId}";

        // Redirect to the constructed URL or output it
        header("Location: $url");
        exit();
    } else {
        die("Invalid key provided.");
    }
} else {
    die("Key or order parameter missing.");
}
?>
