<?php
/**
 * Proxy for SMS Test API calls when using Live Server
 * پروکسی برای فراخوانی API تست SMS هنگام استفاده از Live Server
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

// Check if we're in the correct directory structure
$smsTestPath = __DIR__ . '/backend/api/v1/sms-test.php';

if (file_exists($smsTestPath)) {
    // Include the actual SMS test API file
    include $smsTestPath;
} else {
    // Return a mock response for now
    echo json_encode([
        'success' => true,
        'message' => 'SMS Test API - Mock Response (File not found)',
        'data' => [
            'phone' => $_POST['phone'] ?? 'N/A',
            'message' => $_POST['message'] ?? 'N/A',
            'status' => 'mock_sent'
        ]
    ], JSON_UNESCAPED_UNICODE);
}
?>
