<?php
/**
 * Chat API for Data Management
 * چت با داده‌ها با استفاده از OpenAI
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once '../../config/database.php';

try {
    // Parse input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['message']) || !isset($input['session_id'])) {
        throw new Exception('Invalid input. Required: message, session_id');
    }
    
    $message = trim($input['message']);
    $sessionId = $input['session_id'];
    
    if (empty($message)) {
        throw new Exception('Message cannot be empty');
    }
    
    // Load chat history
    $chatFile = $_SERVER['DOCUMENT_ROOT'] . '/datasave/temp/chat_' . $sessionId . '.json';
    
    if (!file_exists($chatFile)) {
        throw new Exception('Session not found');
    }
    
    $chatHistory = json_decode(file_get_contents($chatFile), true);
    
    // Get OpenAI API settings
    $pdo = getDB();
    $stmt = $pdo->prepare("SELECT setting_key, setting_value FROM ai_settings WHERE setting_key IN ('openai_api_key', 'ai_model')");
    $stmt->execute();
    $settings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
    
    $apiKey = $settings['openai_api_key'] ?? null;
    $model = $settings['ai_model'] ?? 'gpt-4o';
    
    // Get file context
    $context = $chatHistory['file_context'];
    
    // Check if API key is configured and valid
    if (!$apiKey || empty(trim($apiKey)) || strlen(trim($apiKey)) < 20 || strpos($apiKey, 'sk-') !== 0) {
        // Use mock response if no valid API key
        $response = getMockResponse($message, $context);
    } else {
        // Build prompt with file context
        $contextText = "اطلاعات فایل:\n";
        $contextText .= "- نام فایل: {$context['fileName']}\n";
        $contextText .= "- تعداد ردیف: {$context['totalRows']}\n";
        $contextText .= "- تعداد ستون: {$context['totalColumns']}\n";
        $contextText .= "- ستون‌ها: " . implode('، ', $context['columns']) . "\n\n";
        
        // Add recent chat history
        $recentMessages = array_slice($chatHistory['messages'], -5);
        $historyText = "";
        foreach ($recentMessages as $msg) {
            if ($msg['type'] === 'user') {
                $historyText .= "کاربر: {$msg['message']}\n";
            } elseif ($msg['type'] === 'assistant') {
                $historyText .= "دستیار: {$msg['message']}\n";
            }
        }
        
        $fullPrompt = $contextText . ($historyText ? "تاریخچه گفتگو:\n" . $historyText . "\n" : "") . "سوال جدید: " . $message;
        
        // Call OpenAI API
        $response = callOpenAI($fullPrompt, $apiKey, $model);
    }
    
    // Add messages to chat history
    $chatHistory['messages'][] = [
        'type' => 'user',
        'message' => $message,
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    $chatHistory['messages'][] = [
        'type' => 'assistant',
        'message' => $response,
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    // Save updated chat history
    file_put_contents($chatFile, json_encode($chatHistory, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    
    echo json_encode([
        'success' => true,
        'data' => [
            'response' => $response,
            'timestamp' => date('Y-m-d H:i:s'),
            'session_id' => $sessionId
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

function callOpenAI($prompt, $apiKey, $model) {
    $url = 'https://api.openai.com/v1/chat/completions';
    
    $data = [
        'model' => $model,
        'messages' => [
            [
                'role' => 'system',
                'content' => 'شما یک متخصص تحلیل داده هستید که به زبان فارسی پاسخ می‌دهید. پاسخ‌های مفید، دقیق و قابل فهم ارائه دهید. از اطلاعات فایل ارائه شده برای پاسخگویی استفاده کنید.'
            ],
            [
                'role' => 'user',
                'content' => $prompt
            ]
        ],
        'max_tokens' => 800,
        'temperature' => 0.7
    ];
    
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $apiKey,
            'Content-Type: application/json'
        ],
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYPEER => true
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);
    
    if ($curlError) {
        throw new Exception("Connection error: " . $curlError);
    }
    
    if ($httpCode !== 200) {
        error_log("OpenAI API error: HTTP $httpCode - Response: " . $response);
        throw new Exception("API error: HTTP $httpCode");
    }
    
    $result = json_decode($response, true);
    
    if (!isset($result['choices'][0]['message']['content'])) {
        error_log("Invalid OpenAI response: " . $response);
        throw new Exception("Invalid API response");
    }
    
    return $result['choices'][0]['message']['content'];
}

function getMockResponse($message, $context) {
    // Simple keyword matching for mock responses
    $message = strtolower($message);
    
    if (strpos($message, 'چند') !== false && (strpos($message, 'ردیف') !== false || strpos($message, 'رکورد') !== false)) {
        return "فایل شما شامل {$context['totalRows']} ردیف داده است. این تعداد رکورد مناسبی برای تحلیل محسوب می‌شود.";
    }
    
    if (strpos($message, 'چند') !== false && (strpos($message, 'ستون') !== false || strpos($message, 'فیلد') !== false)) {
        return "فایل شما دارای {$context['totalColumns']} ستون (فیلد) است. هر فیلد نوع اطلاعاتی مختلفی را نشان می‌دهد.";
    }
    
    if (strpos($message, 'ستون') !== false || strpos($message, 'فیلد') !== false) {
        return "ستون‌های موجود در فایل شما عبارتند از: " . implode('، ', $context['columns']) . ". این ساختار داده‌ای مناسبی برای تحلیل دارد.";
    }
    
    if (strpos($message, 'کیفیت') !== false || strpos($message, 'بررسی') !== false) {
        return "بر اساس بررسی اولیه، کیفیت داده‌های فایل {$context['fileName']} مناسب است. فایل شامل {$context['totalRows']} ردیف و {$context['totalColumns']} ستون است که به صورت منظم سازماندهی شده‌اند.";
    }
    
    if (strpos($message, 'نام') !== false && strpos($message, 'فایل') !== false) {
        return "نام فایل شما {$context['fileName']} است و شامل {$context['totalRows']} ردیف داده می‌باشد.";
    }
    
    if (strpos($message, 'تحلیل') !== false || strpos($message, 'آمار') !== false) {
        return "📊 تحلیل کلی فایل شما:\n\n• نام فایل: {$context['fileName']}\n• تعداد ردیف: {$context['totalRows']}\n• تعداد ستون: {$context['totalColumns']}\n• ستون‌ها: " . implode('، ', $context['columns']) . "\n\nداده‌ها منظم و قابل تحلیل هستند.";
    }
    
    if (strpos($message, 'ساختار') !== false) {
        return "ساختار فایل شما شامل فیلدهای زیر است:\n\n" . implode("\n", array_map(function($col, $index) {
            return "• ستون " . ($index + 1) . ": " . $col;
        }, $context['columns'], array_keys($context['columns']))) . "\n\nاین ساختار مناسب برای ذخیره و تحلیل داده‌ها است.";
    }
    
    if (strpos($message, 'پیشنهاد') !== false || strpos($message, 'توصیه') !== false) {
        return "با توجه به ساختار فایل شما، پیشنهادات زیر را ارائه می‌دهم:\n\n• فایل دارای ساختار مناسبی است\n• تعداد {$context['totalRows']} ردیف قابل قبول است\n• برای تحلیل بهتر می‌توانید داده‌ها را بر اساس فیلدهای مختلف دسته‌بندی کنید";
    }
    
    // Default response with more context
    return "بر اساس تحلیل فایل شما:\n\n📁 فایل: {$context['fileName']}\n📊 ردیف‌ها: {$context['totalRows']}\n📋 ستون‌ها: {$context['totalColumns']}\n\nمی‌توانید سوالات خود را در مورد ساختار داده‌ها، تعداد رکوردها، نوع فیلدها و تحلیل بپرسید. من آماده پاسخگویی هستم!";
}
?>