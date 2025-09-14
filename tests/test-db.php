<?php
require_once 'backend/config/database.php';

try {
    $database = Database::getInstance();
    $db = $database->getConnection();
    
    echo "Database connection successful\n";
    
    // بررسی ساختار جدول
    $stmt = $db->query("DESCRIBE ai_sms_logs");
    $columns = $stmt->fetchAll();
    
    echo "Table structure:\n";
    foreach ($columns as $column) {
        echo "- {$column['Field']}: {$column['Type']}\n";
    }
    
    // نمونه داده‌ها
    $stmt = $db->query("SELECT * FROM ai_sms_logs ORDER BY created_at DESC LIMIT 3");
    $samples = $stmt->fetchAll();
    
    echo "\nSample data:\n";
    foreach ($samples as $i => $row) {
        echo "Record " . ($i+1) . ":\n";
        foreach ($row as $key => $value) {
            echo "  $key: $value\n";
        }
        echo "\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
