<?php
/**
 * Proxy for AI Settings API
 * پروکسی برای API تنظیمات هوش مصنوعی
 * 
 * این فایل برای حل مشکل CORS در محیط توسعه استفاده می‌شود
 */

// تنظیم هدرهای CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

// رسیدگی به درخواست OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // تعیین URL هدف
    $targetUrl = 'http://localhost/datasave/backend/api/v1/ai-settings.php';
    
    // دریافت متد HTTP
    $method = $_SERVER['REQUEST_METHOD'];
    
    // آماده‌سازی درخواست
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $targetUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    
    // تنظیم هدرها
    $headers = [];
    foreach (getallheaders() as $key => $value) {
        // حذف هدرهایی که ممکن است مشکل ایجاد کنند
        if (strtolower($key) !== 'host' && strtolower($key) !== 'content-length') {
            $headers[] = "$key: $value";
        }
    }
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    // برای درخواست‌های POST/PUT، ارسال داده
    if ($method === 'POST' || $method === 'PUT') {
        $input = file_get_contents('php://input');
        curl_setopt($ch, CURLOPT_POSTFIELDS, $input);
    }
    
    // اجرای درخواست
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    
    if (curl_error($ch)) {
        throw new Exception('cURL Error: ' . curl_error($ch));
    }
    
    curl_close($ch);
    
    // جدا کردن هدرها و بدنه پاسخ
    $responseHeaders = substr($response, 0, $headerSize);
    $responseBody = substr($response, $headerSize);
    
    // تنظیم کد وضعیت HTTP
    http_response_code($httpCode);
    
    // ارسال پاسخ
    echo $responseBody;
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'خطا در پروکسی: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}