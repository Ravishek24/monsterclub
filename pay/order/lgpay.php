<?php
// Replace with your actual app_id and secret key
$app_id = 'YD3762'; // Merchant ID
$secret_key = 'mhr28zXffxdny2mh'; // Secret key

// Include the database connection
require_once '../config/database.php';

// Function to log actions with a formatted style
function logAction($message) {
    $logFile = 'logfile.log'; // Log file path
    $timeStamp = date('Y-m-d H:i:s');
    $formattedMessage = "[$timeStamp] - $message" . PHP_EOL . str_repeat("=", 50) . PHP_EOL;
    file_put_contents($logFile, $formattedMessage, FILE_APPEND);
}

// Log start of the script
logAction("New Transaction Start");

// Retrieve the mark parameter
$mark = isset($_GET['mark']) ? $_GET['mark'] : null;

if (!$mark) {
    logAction("Mark parameter missing.");
    die('Mark parameter missing.');
}

logAction("Mark parameter received: $mark");

// Fetch money and phone from recharge table where id_order matches the mark parameter
$stmt = $pdo->prepare("SELECT money, phone FROM recharge WHERE id_order = :mark");
$stmt->execute(['mark' => $mark]);
$rechargeData = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$rechargeData) {
    logAction("No record found for the given mark parameter.");
    die('No record found for the given mark parameter.');
}

logAction("Record found. Money: {$rechargeData['money']}, Phone: {$rechargeData['phone']}");

$money = $rechargeData['money'] * 100; // Convert to currency units (e.g., 10000 for 100.00 INR)
$phone = $rechargeData['phone'];

// Set order_sn to the retrieved mark value
$order_sn = $mark; // Using mark as the unique order ID

// Request parameters
$trade_type = 'INRUPI'; // Product code, use "test" for testing
$notify_url = 'https://pay.okwiins.online/notify/lgpay.php'; // Payment success callback URL
$return_url = 'https://okwiins.online/wallet/rechargerecord'; // Redirect URL after payment success
$remark = 'inr888'; // Optional remark
$ip = '84.247.164.188'; // Set static IP as specified

// Log the parameters before sorting
logAction("Parameters before sorting: " . json_encode([
    'app_id' => $app_id,
    'trade_type' => $trade_type,
    'order_sn' => $order_sn,
    'money' => $money,
    'notify_url' => $notify_url,
    'return_url' => $return_url,
    'ip' => $ip,
    'remark' => $remark
], JSON_PRETTY_PRINT));

// Prepare parameters
$params = [
    'app_id' => $app_id,
    'trade_type' => $trade_type,
    'order_sn' => $order_sn,
    'money' => $money,
    'notify_url' => $notify_url,
    'return_url' => $return_url,
    'ip' => $ip,
    'remark' => $remark
];

// Sort parameters alphabetically by key
ksort($params);

// Create the query string without URL encoding
$queryString = '';
foreach ($params as $key => $value) {
    if (!empty($value)) {
        $queryString .= $key . '=' . $value . '&';
    }
}
$queryString = rtrim($queryString, '&');

// Append the secret key to the query string
$signString = $queryString . '&key=' . $secret_key;

// Generate the MD5 hash and convert it to uppercase
$sign = strtoupper(md5($signString));

// Log the sign string and generated MD5 sign
logAction("Sign string: $signString");
logAction("Generated sign: $sign");

// Add the signature to the parameters
$params['sign'] = $sign;

// Prepare POST data with URL encoding
$postData = '';
foreach ($params as $key => $value) {
    $postData .= $key . '=' . urlencode($value) . '&';
}
$postData = rtrim($postData, '&');

// Log the final POST data
logAction("Final POST data: $postData");

// Collection interface URL
$url = 'https://www.lg-pay.com/api/order/create';

// Initialize cURL
$ch = curl_init($url);

// Set cURL options
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/x-www-form-urlencoded',
]);

// Execute cURL request and capture the response
$response = curl_exec($ch);

// Check for cURL errors
if ($response === false) {
    $error = curl_error($ch);
    logAction("cURL Error: $error");
    curl_close($ch);
    die('Error occurred while making the request: ' . $error);
}

// Close cURL resource
curl_close($ch);

// Log the raw response
logAction("Raw response: $response");

// Decode JSON response
$responseData = json_decode($response, true);

// Check for JSON decoding errors
if (json_last_error() !== JSON_ERROR_NONE) {
    $jsonError = json_last_error_msg();
    logAction("Error decoding JSON response: $jsonError");
    die('Error decoding JSON response: ' . $jsonError);
}

// Log the decoded response
logAction("Decoded response: " . json_encode($responseData, JSON_PRETTY_PRINT));

// If the status is 1, redirect to the pay_url
if (isset($responseData['status']) && $responseData['status'] == 1) {
    $pay_url = $responseData['data']['pay_url'];
    logAction("Payment URL received: $pay_url");
    
    // Redirect to the pay_url
    logAction("Redirecting to payment URL...");
    header("Location: $pay_url");
    exit();
}

// Optionally handle other statuses or errors
logAction("Error: " . $responseData['msg']);
die('Error: ' . $responseData['msg']);
?>
