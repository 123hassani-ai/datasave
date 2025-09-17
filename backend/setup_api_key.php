<?php
require_once('config/database.php');

try {
    // Get PDO connection
    $pdo = getDB();
    
    // Insert or update OpenAI API key
    $stmt = $pdo->prepare("
        INSERT INTO ai_settings (setting_key, setting_value, description) 
        VALUES ('openai_api_key', 'sk-test-key', 'OpenAI API Key for AI Analysis')
        ON DUPLICATE KEY UPDATE 
        setting_value = 'sk-test-key',
        description = 'OpenAI API Key for AI Analysis'
    ");
    
    $stmt->execute();
    
    echo "OpenAI API key added successfully!\n";
    
    // Verify
    $stmt = $pdo->prepare("SELECT * FROM ai_settings WHERE setting_key = 'openai_api_key'");
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result) {
        echo "Verified: Key exists in database\n";
        echo "ID: " . $result['id'] . "\n";
        echo "Key: " . $result['setting_key'] . "\n";
        echo "Value: " . substr($result['setting_value'], 0, 10) . "...\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>