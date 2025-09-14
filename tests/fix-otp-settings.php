<?php
// اصلاح تنظیمات OTP
require_once 'backend/config/database.php';

try {
    $db = Database::getInstance()->getConnection();
    
    // افزایش مدت انقضا به 10 دقیقه
    $stmt = $db->prepare("UPDATE ai_sms_settings SET setting_value = '10' WHERE setting_key = 'otp_expiry_minutes'");
    $stmt->execute();
    
    // بررسی تنظیمات جدید
    $stmt = $db->prepare("SELECT setting_key, setting_value FROM ai_sms_settings WHERE setting_key LIKE '%otp%'");
    $stmt->execute();
    $settings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<h2>OTP Settings Updated:</h2>";
    foreach ($settings as $setting) {
        echo "<p><strong>{$setting['setting_key']}:</strong> {$setting['setting_value']}</p>";
    }
    
    // پاک کردن OTPهای قدیمی برای تست جدید
    $stmt = $db->prepare("DELETE FROM ai_sms_logs WHERE message_type = 'otp'");
    $stmt->execute();
    
    echo "<p style='color: green;'>✅ تنظیمات OTP به‌روزرسانی شد و رکوردهای قدیمی پاک شدند</p>";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
