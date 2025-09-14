<?php
/**
 * Comprehensive AI API Test
 * This test will help diagnose issues with the OpenAI API key and commands
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// For OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Read API key from file
    $apiKeyFile = __DIR__ . '/Docs/Prompts/api-openai.txt';
    if (!file_exists($apiKeyFile)) {
        throw new Exception("API key file not found: " . $apiKeyFile);
    }
    
    $apiKey = trim(file_get_contents($apiKeyFile));
    
    // Debug information about the API key
    $debugInfo = [
        'key_length' => strlen($apiKey),
        'key_preview' => substr($apiKey, 0, min(20, strlen($apiKey))) . '...' . substr($apiKey, -5),
        'has_sk_prefix' => strpos($apiKey, 'sk-') === 0,
        'has_whitespace' => preg_match('/\s/', $apiKey) > 0,
        'has_newlines' => preg_match('/[\r\n]/', $apiKey) > 0,
        'has_unicode' => mb_check_encoding($apiKey, 'UTF-8') && !mb_check_encoding($apiKey, 'ASCII')
    ];
    
    // Clean the API key
    $cleanApiKey = str_replace(["\n", "\r", "\t", " "], "", $apiKey);
    
    // Get action from request
    $action = $_GET['action'] ?? $_POST['action'] ?? 'info';
    
    switch ($action) {
        case 'info':
            $response = [
                'success' => true,
                'debug_info' => $debugInfo,
                'clean_key_preview' => substr($cleanApiKey, 0, min(20, strlen($cleanApiKey))) . '...' . substr($cleanApiKey, -5),
                'message' => 'API key information retrieved successfully'
            ];
            break;
            
        case 'validate_key':
            // Test the API key with a simple models endpoint call
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, 'https://api.openai.com/v1/models');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Authorization: Bearer ' . $cleanApiKey
            ]);
            curl_setopt($ch, CURLOPT_TIMEOUT, 10);
            
            $apiResponse = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlError = curl_error($ch);
            curl_close($ch);
            
            if ($curlError) {
                $response = [
                    'success' => false,
                    'debug_info' => $debugInfo,
                    'error' => 'Curl Error: ' . $curlError,
                    'http_code' => null,
                    'message' => 'Failed to connect to OpenAI API'
                ];
            } elseif ($httpCode === 401) {
                $response = [
                    'success' => false,
                    'debug_info' => $debugInfo,
                    'error' => 'Unauthorized (401) - Invalid API key',
                    'http_code' => $httpCode,
                    'api_response' => substr($apiResponse, 0, 200),
                    'message' => 'API key validation failed'
                ];
            } elseif ($httpCode === 200) {
                $response = [
                    'success' => true,
                    'debug_info' => $debugInfo,
                    'message' => 'API key is valid',
                    'http_code' => $httpCode
                ];
            } else {
                $response = [
                    'success' => false,
                    'debug_info' => $debugInfo,
                    'error' => 'HTTP Error: ' . $httpCode,
                    'http_code' => $httpCode,
                    'api_response' => substr($apiResponse, 0, 200),
                    'message' => 'Unexpected response from OpenAI API'
                ];
            }
            break;
            
        case 'test_chat':
            // Test chat completion
            $message = $_POST['message'] ?? 'Say hello in Persian';
            
            $postData = json_encode([
                'model' => 'gpt-3.5-turbo',
                'messages' => [['role' => 'user', 'content' => $message]],
                'max_tokens' => 50
            ]);
            
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, 'https://api.openai.com/v1/chat/completions');
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $cleanApiKey
            ]);
            
            $apiResponse = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlError = curl_error($ch);
            curl_close($ch);
            
            if ($curlError) {
                $response = [
                    'success' => false,
                    'debug_info' => $debugInfo,
                    'error' => 'Curl Error: ' . $curlError,
                    'http_code' => null,
                    'message' => 'Failed to connect to OpenAI Chat API'
                ];
            } elseif ($httpCode === 401) {
                $response = [
                    'success' => false,
                    'debug_info' => $debugInfo,
                    'error' => 'Unauthorized (401) - Invalid API key',
                    'http_code' => $httpCode,
                    'api_response' => substr($apiResponse, 0, 200),
                    'message' => 'API key validation failed for chat API'
                ];
            } elseif ($httpCode === 200) {
                $responseData = json_decode($apiResponse, true);
                $response = [
                    'success' => true,
                    'debug_info' => $debugInfo,
                    'response' => $responseData,
                    'message' => 'Chat API test successful'
                ];
            } else {
                $response = [
                    'success' => false,
                    'debug_info' => $debugInfo,
                    'error' => 'HTTP Error: ' . $httpCode,
                    'http_code' => $httpCode,
                    'api_response' => $apiResponse,
                    'message' => 'Unexpected response from OpenAI Chat API'
                ];
            }
            break;
            
        default:
            $response = [
                'success' => false,
                'message' => 'Invalid action: ' . $action
            ];
    }
    
} catch (Exception $e) {
    $response = [
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ];
}

echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);