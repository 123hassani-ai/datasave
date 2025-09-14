<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

echo json_encode([
    'success' => true,
    'message' => 'PHP is working!',
    'php_version' => PHP_VERSION,
    'timestamp' => date('Y-m-d H:i:s'),
    'data' => [
        'sms_username' => '',
        'sms_password' => '',
        'sms_panel_number' => '',
        'sms_enabled' => false,
        'otp_length' => 5,
        'otp_expiry_minutes' => 5,
        'otp_message_template' => 'کد تایید شما: {code}'
    ]
], JSON_UNESCAPED_UNICODE);
?>
