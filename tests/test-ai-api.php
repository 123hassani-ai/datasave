<?php
/**
 * تست API هوش مصنوعی
 * AI API Test
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// برای درخواست‌های OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // خواندن کلید API از فایل
    $apiKeyFile = __DIR__ . '/Docs/Prompts/api-openai.txt';
    if (!file_exists($apiKeyFile)) {
        throw new Exception("فایل کلید API یافت نشد: " . $apiKeyFile);
    }
    
    $apiKey = trim(file_get_contents($apiKeyFile));
    if (empty($apiKey)) {
        throw new Exception("کلید API خالی است");
    }
    
    // حذف فاصله‌ها
    $apiKey = str_replace(["\n", "\r", "\t", " "], "", $apiKey);
    
    // دریافت عملیات از پارامترهای درخواست
    $action = $_GET['action'] ?? $_POST['action'] ?? 'info';
    
    switch ($action) {
        case 'info':
            // اطلاعات کلید
            $response = [
                'success' => true,
                'data' => [
                    'key_length' => strlen($apiKey),
                    'key_prefix' => substr($apiKey, 0, min(10, strlen($apiKey))),
                    'key_suffix' => substr($apiKey, -5),
                    'is_valid_format' => strpos($apiKey, 'sk-') === 0 && strlen($apiKey) > 20
                ],
                'message' => 'اطلاعات کلید API'
            ];
            break;
            
        case 'chat':
            // تست Chat Completion
            $message = $_POST['message'] ?? 'سلام، یک جمله کوتاه فارسی بگو';
            
            $postData = json_encode([
                'model' => 'gpt-3.5-turbo',
                'messages' => [['role' => 'user', 'content' => $message]],
                'max_tokens' => 100
            ]);
            
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, 'https://api.openai.com/v1/chat/completions');
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $apiKey
            ]);
            
            $apiResponse = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            
            if ($httpCode === 200) {
                $responseData = json_decode($apiResponse, true);
                $response = [
                    'success' => true,
                    'data' => $responseData,
                    'message' => 'پاسخ از OpenAI دریافت شد'
                ];
            } else {
                $response = [
                    'success' => false,
                    'data' => null,
                    'message' => "خطا در API: HTTP $httpCode - $apiResponse"
                ];
            }
            break;
            
        case 'models':
            // دریافت لیست مدل‌ها
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, 'https://api.openai.com/v1/models');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Authorization: Bearer ' . $apiKey
            ]);
            
            $apiResponse = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            
            if ($httpCode === 200) {
                $responseData = json_decode($apiResponse, true);
                $response = [
                    'success' => true,
                    'data' => $responseData,
                    'message' => 'لیست مدل‌ها دریافت شد'
                ];
            } else {
                $response = [
                    'success' => false,
                    'data' => null,
                    'message' => "خطا در دریافت مدل‌ها: HTTP $httpCode - $apiResponse"
                ];
            }
            break;
            
        default:
            $response = [
                'success' => false,
                'data' => null,
                'message' => 'عملیات نامعتبر: ' . $action
            ];
    }
    
} catch (Exception $e) {
    $response = [
        'success' => false,
        'data' => null,
        'message' => 'خطا: ' . $e->getMessage()
    ];
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);