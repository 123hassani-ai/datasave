<?php
// فایل تست سریع API
echo json_encode([
    'success' => true,
    'message' => 'API is working!',
    'data' => [
        'sms_username' => ['value' => 'test_user', 'type' => 'string'],
        'sms_password' => ['value' => '', 'type' => 'string'],
        'sms_panel_number' => ['value' => '123456', 'type' => 'string'],
        'sms_enabled' => ['value' => false, 'type' => 'boolean'],
        'otp_length' => ['value' => 5, 'type' => 'integer'],
        'otp_expiry_minutes' => ['value' => 5, 'type' => 'integer'],
        'otp_message_template' => ['value' => 'کد تایید شما: {code}', 'type' => 'string']
    ],
    'debug' => [
        'php_version' => PHP_VERSION,
        'timestamp' => date('Y-m-d H:i:s'),
        'method' => $_SERVER['REQUEST_METHOD'],
        'headers_sent' => headers_sent()
    ]
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>