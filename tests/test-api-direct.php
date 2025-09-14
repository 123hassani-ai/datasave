<?php
// تست مستقیم API تنظیمات
header('Content-Type: text/html; charset=utf-8');

echo "<!DOCTYPE html>";
echo "<html lang='fa' dir='rtl'>";
echo "<head><meta charset='UTF-8'><title>تست مستقیم API</title></head>";
echo "<body style='font-family: Tahoma; margin: 20px;'>";
echo "<h2>🔧 تست مستقیم API تنظیمات</h2>";

echo "<h3>✅ PHP Working:</h3>";
echo "<p>PHP Version: " . PHP_VERSION . "</p>";
echo "<p>Current Time: " . date('Y-m-d H:i:s') . "</p>";

echo "<h3>🔗 API Test Links:</h3>";
echo "<ul>";
echo "<li><a href='/datasave/backend/api/v1/settings.php' target='_blank'>Direct API Call</a></li>";
echo "<li><a href='/datasave/test-settings-api.html' target='_blank'>Settings API Test Page</a></li>";
echo "</ul>";

// تست اتصال دیتابیس
echo "<h3>💾 Database Connection Test:</h3>";
try {
    require_once __DIR__ . '/backend/config/database.php';
    $db = getDB();
    echo "<p style='color: green;'>✅ Database connection successful!</p>";
    
    // بررسی جدول تنظیمات
    $stmt = $db->query("SHOW TABLES LIKE 'ai_user_settings'");
    if ($stmt->rowCount() > 0) {
        echo "<p style='color: green;'>✅ Table 'ai_user_settings' exists!</p>";
        
        // شمارش رکوردها
        $stmt = $db->query("SELECT COUNT(*) as count FROM ai_user_settings");
        $count = $stmt->fetch()['count'];
        echo "<p>📊 Settings records: $count</p>";
    } else {
        echo "<p style='color: red;'>❌ Table 'ai_user_settings' not found!</p>";
    }
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Database error: " . $e->getMessage() . "</p>";
}

echo "</body></html>";
?>