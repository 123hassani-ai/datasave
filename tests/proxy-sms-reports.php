<?php
/**
 * Proxy for SMS Reports API calls when using Live Server
 * پروکسی برای فراخوانی API گزارشات SMS هنگام استفاده از Live Server
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
$smsReportsPath = __DIR__ . '/backend/api/v1/sms-reports.php';

if (file_exists($smsReportsPath)) {
    // Include the actual SMS reports API file
    include $smsReportsPath;
} else {
    // Return a mock response for now
    echo json_encode([
        'success' => true,
        'message' => 'SMS Reports loaded successfully (Mock)',
        'data' => [
            'total_sent' => 0,
            'total_delivered' => 0,
            'total_failed' => 0,
            'reports' => []
        ]
    ], JSON_UNESCAPED_UNICODE);
}
?>
