<?php
// تست OTP timing
require_once 'backend/config/database.php';

try {
    $db = Database::getInstance()->getConnection();
    
    // بررسی آخرین رکورد OTP
    $stmt = $db->prepare("
        SELECT recipient_phone, otp_code, otp_expires_at, created_at, 
               NOW() as current_time,
               TIMESTAMPDIFF(SECOND, NOW(), otp_expires_at) as seconds_remaining,
               delivery_status
        FROM ai_sms_logs 
        WHERE message_type = 'otp' 
        ORDER BY created_at DESC 
        LIMIT 5
    ");
    
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<h2>OTP Records Analysis</h2>";
    echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
    echo "<tr><th>Phone</th><th>Code</th><th>Created</th><th>Expires At</th><th>Current Time</th><th>Seconds Remaining</th><th>Status</th></tr>";
    
    foreach ($results as $row) {
        $style = $row['seconds_remaining'] > 0 ? 'color: green;' : 'color: red;';
        echo "<tr style='$style'>";
        echo "<td>{$row['recipient_phone']}</td>";
        echo "<td>{$row['otp_code']}</td>";
        echo "<td>{$row['created_at']}</td>";
        echo "<td>{$row['otp_expires_at']}</td>";
        echo "<td>{$row['current_time']}</td>";
        echo "<td>{$row['seconds_remaining']}</td>";
        echo "<td>{$row['delivery_status']}</td>";
        echo "</tr>";
    }
    echo "</table>";
    
    // بررسی تنظیمات OTP
    $stmt = $db->prepare("
        SELECT setting_key, setting_value 
        FROM ai_sms_settings 
        WHERE setting_key LIKE '%otp%'
    ");
    
    $stmt->execute();
    $settings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<h3>OTP Settings</h3>";
    foreach ($settings as $setting) {
        echo "<p><strong>{$setting['setting_key']}:</strong> {$setting['setting_value']}</p>";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
