<?php
/**
 * Proxy for API calls when using Live Server
 * پروکسی برای فراخوانی API هنگام استفاده از Live Server
 */

// Set proper headers first
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Log request for debugging
error_log("[" . date('Y-m-d H:i:s') . "] Proxy called: " . $_SERVER['REQUEST_METHOD'] . " from " . ($_SERVER['HTTP_REFERER'] ?? 'unknown'));

try {
    // Try to use cURL to call the actual API
    $apiUrl = 'http://localhost/datasave/backend/api/v1/settings.php';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);
    
    // Set headers
    $headers = [
        'Content-Type: application/json',
        'Accept: application/json'
    ];
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    // Forward body for POST/PUT requests
    if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT'])) {
        $body = file_get_contents('php://input');
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        throw new Exception("cURL Error: " . $error);
    }
    
    if ($httpCode !== 200) {
        throw new Exception("API returned status: " . $httpCode);
    }
    
    // Validate JSON response
    $decoded = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON response: " . json_last_error_msg());
    }
    
    echo $response;
    
} catch (Exception $e) {
    // Return fallback data if API fails
    error_log("[" . date('Y-m-d H:i:s') . "] Proxy error: " . $e->getMessage());
    
    http_response_code(200); // Don't fail the client
    echo json_encode([
        'success' => true,
        'message' => 'تنظیمات پیش‌فرض بارگذاری شد (Proxy Mode)',
        'data' => [
            'sms_username' => [
                'value' => '',
                'type' => 'string'
            ],
            'sms_password' => [
                'value' => '',
                'type' => 'string'
            ],
            'sms_panel_number' => [
                'value' => '',
                'type' => 'string'
            ],
            'sms_enabled' => [
                'value' => false,
                'type' => 'boolean'
            ],
            'otp_length' => [
                'value' => 5,
                'type' => 'integer'
            ],
            'otp_expiry_minutes' => [
                'value' => 5,
                'type' => 'integer'
            ],
            'otp_message_template' => [
                'value' => 'کد تایید شما: {code}',
                'type' => 'string'
            ]
        ]
    ], JSON_UNESCAPED_UNICODE);
}
?>