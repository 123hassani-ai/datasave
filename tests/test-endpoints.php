<?php
// Test endpoint settings in database
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    require_once __DIR__ . '/backend/config/database.php';
    
    $db = Database::getInstance()->getConnection();
    
    echo "<h2>بررسی Endpoint های فعلی در دیتابیس</h2>";
    
    $stmt = $db->prepare("SELECT setting_key, setting_value, setting_type FROM ai_sms_settings WHERE setting_key IN ('api_endpoint', 'webservice_endpoint', 'test_phone_number', 'test_message_text', 'sms_username', 'sms_password', 'sms_panel_number', 'sms_enabled') ORDER BY setting_key");
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($results) > 0) {
        echo "<table border='1' style='border-collapse: collapse; width: 100%; margin: 20px 0;'>";
        echo "<tr><th style='padding: 10px; background: #f5f5f5;'>Setting Key</th><th style='padding: 10px; background: #f5f5f5;'>Setting Value</th><th style='padding: 10px; background: #f5f5f5;'>Type</th></tr>";
        
        foreach ($results as $row) {
            echo "<tr>";
            echo "<td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($row['setting_key']) . "</td>";
            echo "<td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($row['setting_value']) . "</td>";
            echo "<td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($row['setting_type']) . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "<p style='color: orange;'>هیچ endpoint تنظیم نشده‌ای پیدا نشد!</p>";
        
        // درج endpoint های پیش‌فرض
        echo "<h3>درج endpoint ها و داده‌های تست پیش‌فرض...</h3>";
        
        $defaultSettings = [
            'api_endpoint' => 'https://0098sms.com/sendsmslink.aspx',
            'webservice_endpoint' => 'https://webservice.0098sms.com/service.asmx',
            'test_phone_number' => '09132323123',
            'test_message_text' => 'این یک پیام تست است.',
            'sms_username' => 'demo_user',
            'sms_password' => 'demo_pass',
            'sms_panel_number' => '50004000',
            'sms_enabled' => '1'
        ];
        
        foreach ($defaultSettings as $key => $value) {
            $insertStmt = $db->prepare("
                INSERT INTO ai_sms_settings (setting_key, setting_value, setting_type) 
                VALUES (?, ?, 'string')
                ON DUPLICATE KEY UPDATE 
                    setting_value = VALUES(setting_value),
                    updated_at = CURRENT_TIMESTAMP
            ");
            
            if ($insertStmt->execute([$key, $value])) {
                echo "<p style='color: green;'>✅ {$key} = {$value} ذخیره شد</p>";
            } else {
                echo "<p style='color: red;'>❌ خطا در ذخیره {$key}</p>";
            }
        }
        
        echo "<p><a href='test-endpoints.php'>رفرش برای مشاهده نتایج</a></p>";
    }
    
    // نمایش همه تنظیمات SMS
    echo "<hr><h3>تمام تنظیمات SMS:</h3>";
    $allStmt = $db->prepare("SELECT * FROM ai_sms_settings ORDER BY setting_key");
    $allStmt->execute();
    $allResults = $allStmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($allResults) > 0) {
        echo "<table border='1' style='border-collapse: collapse; width: 100%; margin: 20px 0;'>";
        echo "<tr><th style='padding: 10px; background: #f5f5f5;'>Key</th><th style='padding: 10px; background: #f5f5f5;'>Value</th><th style='padding: 10px; background: #f5f5f5;'>Type</th><th style='padding: 10px; background: #f5f5f5;'>Updated</th></tr>";
        
        foreach ($allResults as $row) {
            echo "<tr>";
            echo "<td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($row['setting_key']) . "</td>";
            echo "<td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($row['setting_value']) . "</td>";
            echo "<td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($row['setting_type']) . "</td>";
            echo "<td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($row['updated_at']) . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'>خطا: " . $e->getMessage() . "</p>";
}
?>
