<?php

function generateSignature($params, $key) {
    // Step 1: Filter out parameters with empty values and the 'sign' parameter
    $filteredParams = array_filter($params, function($value, $key) {
        return $value !== '' && $key !== 'sign';
    }, ARRAY_FILTER_USE_BOTH);

    // Step 2: Sort the parameters by key in lexicographic order (case-sensitive)
    ksort($filteredParams);

    // Step 3: Create a query string with the parameters
    $queryString = http_build_query($filteredParams, '', '&');

    // Step 4: Append the key to the query string
    $stringSignTemp = $queryString . "&key=" . $key;

    // Step 5: Perform an MD5 hash on the resulting string and convert to uppercase
    $signValue = strtoupper(md5($stringSignTemp));

    return $signValue;
}

function sendCurlRequest($url, $params) {
    // Initialize cURL session
    $ch = curl_init();

    // Set the URL and other options
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    // Execute the cURL session and get the response
    $response = curl_exec($ch);
    
    // Check for errors
    if (curl_errno($ch)) {
        echo 'Error:' . curl_error($ch);
    }
    
    // Close the cURL session
    curl_close($ch);

    return $response;
}
$user=$_POST['user'];
$am=$_POST['am'];
$amount=$am*100;
// Example usage
$params = [
    'mchId' => '2434',
    'productId' => '8044',
    'mchOrderNo' => 'DUWNxx'.$_POST['user'].'xx'.time(),
    'currency' => 'INR',
    'amount' => $amount,
    'notifyUrl' => 'https://pay.diuwin.network/verificationdragonpay.php',
    'subject' => 'This is a payment from Mahaloot',
    'body' => 'Payment Initialised'
];

// Generate the signature
ksort($params);

// Concatenate the sorted parameters in the format of "key=value&"
$concatenatedString = "";
foreach ($params as $key => $value) {
    if (!empty($value) && $key !== 'sign') {
        $concatenatedString .= $key . "=" . $value . "&";
    }
}

// Append the merchant's private key
$merchantPrivateKey = "LG3iL3pMalJyQNUJmptNfg3Y"; // Replace with your actual merchant private key
$concatenatedString .= "key=" . $merchantPrivateKey;

// Calculate the MD5 hash of the concatenated string to generate the signature
$signature = md5($concatenatedString);

// Include the signature in the request parameters
// Append the signature to the parameters
$params['sign'] = $signature;

// The URL to send the request to
$url = 'https://initpay.dragon1942.net/api/pay/neworder';

// Send the cURL request
$response = sendCurlRequest($url, $params);
echo $response;
// Decode the JSON response
$jsonresponse = json_decode($response, true);

// Get the payUrl from the decoded response
$payUrl = $jsonresponse['payParams']['payUrl'];

// Redirect to the payUrl
header("Location: $payUrl");
exit();

?>