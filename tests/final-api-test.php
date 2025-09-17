<?php
/**
 * Final API Test - Test the exact flow used in the application
 */

// Simulate exactly what the ai-settings.php does
require_once __DIR__ . '/backend/config/database.php';

try {
    // Connect to database
    $database = Database::getInstance();
    $db = $database->getConnection();
    
    // Get the API key from the database (as the application does)
    $stmt = $db->prepare("SELECT setting_value FROM ai_settings WHERE setting_key = 'openai_api_key'");
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result) {
        $dbApiKey = $result['setting_value'];
        echo "=== API Key from Database ===\n";
        echo "Key Length: " . strlen($dbApiKey) . "\n";
        echo "Key Preview: " . substr($dbApiKey, 0, 20) . "..." . substr($dbApiKey, -5) . "\n";
        
        // Compare with file key
        $fileApiKey = trim(file_get_contents(__DIR__ . '/Docs/Prompts/api-openai.txt'));
        $cleanFileApiKey = str_replace(["\n", "\r", "\t", " "], "", $fileApiKey);
        
        echo "Keys match: " . ($dbApiKey === $cleanFileApiKey ? "YES" : "NO") . "\n";
        
        if ($dbApiKey !== $cleanFileApiKey) {
            echo "Database key length: " . strlen($dbApiKey) . "\n";
            echo "File key length: " . strlen($cleanFileApiKey) . "\n";
        }
        
        // Test the database key
        echo "\n=== Testing Database Key ===\n";
        testApiKey($dbApiKey);
        
        // Test the file key
        echo "\n=== Testing File Key ===\n";
        testApiKey($cleanFileApiKey);
    } else {
        echo "No API key found in database\n";
        
        // Test the file key
        echo "\n=== Testing File Key ===\n";
        $fileApiKey = trim(file_get_contents(__DIR__ . '/Docs/Prompts/api-openai.txt'));
        $cleanFileApiKey = str_replace(["\n", "\r", "\t", " "], "", $fileApiKey);
        testApiKey($cleanFileApiKey);
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

function testApiKey($apiKey) {
    // Test models endpoint
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://api.openai.com/v1/models');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $apiKey
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "HTTP Status: " . $httpCode . "\n";
    
    if ($httpCode === 401) {
        echo "Result: API key is invalid\n";
    } else if ($httpCode === 200) {
        echo "Result: API key is valid\n";
    } else {
        echo "Result: Unexpected response\n";
        echo "Response preview: " . substr($response, 0, 200) . "\n";
    }
}