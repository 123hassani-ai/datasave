<?php
/**
 * SMS Reports API Testing
 * تست API گزارشات پیامک
 */

// تنظیمات دیتابیس
$host = 'localhost';
$port = '3307';
$dbname = 'ai_excell2form';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "✅ اتصال به دیتابیس موفقیت‌آمیز بود<br><br>";
    
    // تست API گزارشات SMS
    echo "<h2>🧪 تست API گزارشات SMS</h2>";
    
    $apiUrl = 'http://localhost/datasave/backend/api/v1/sms.php';
    
    // تست 1: دریافت گزارشات پایه
    echo "<h3>تست 1: دریافت گزارشات پایه</h3>";
    $testData = [
        'action' => 'get_reports',
        'limit' => 20,
        'offset' => 0
    ];
    
    $result = callSMSAPI($apiUrl, $testData);
    echo "<strong>نتیجه:</strong> " . json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "<br><br>";
    
    // تست 2: فیلتر بر اساس وضعیت
    echo "<h3>تست 2: فیلتر بر اساس وضعیت</h3>";
    $testData = [
        'action' => 'get_reports',
        'status' => 'verified',
        'limit' => 10
    ];
    
    $result = callSMSAPI($apiUrl, $testData);
    echo "<strong>نتیجه:</strong> " . json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "<br><br>";
    
    // تست 3: فیلتر بر اساس نوع پیام
    echo "<h3>تست 3: فیلتر بر اساس نوع پیام</h3>";
    $testData = [
        'action' => 'get_reports',
        'type' => 'otp',
        'limit' => 10
    ];
    
    $result = callSMSAPI($apiUrl, $testData);
    echo "<strong>نتیجه:</strong> " . json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "<br><br>";
    
    // تست 4: جستجو در شماره تلفن
    echo "<h3>تست 4: جستجو در شماره تلفن</h3>";
    $testData = [
        'action' => 'get_reports',
        'phone' => '09120540123',
        'limit' => 5
    ];
    
    $result = callSMSAPI($apiUrl, $testData);
    echo "<strong>نتیجه:</strong> " . json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "<br><br>";
    
    // تست 5: جستجوی عمومی
    echo "<h3>تست 5: جستجوی عمومی</h3>";
    $testData = [
        'action' => 'get_reports',
        'search' => 'کد',
        'limit' => 5
    ];
    
    $result = callSMSAPI($apiUrl, $testData);
    echo "<strong>نتیجه:</strong> " . json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "<br><br>";
    
    // تست مستقیم دیتابیس برای مقایسه
    echo "<h2>📊 بررسی مستقیم دیتابیس</h2>";
    
    $sql = "SELECT 
                COUNT(*) as total,
                delivery_status,
                message_type
            FROM ai_sms_logs 
            GROUP BY delivery_status, message_type
            ORDER BY delivery_status, message_type";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $stats = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<table border='1' cellpadding='5' cellspacing='0'>";
    echo "<tr><th>تعداد</th><th>وضعیت</th><th>نوع پیام</th></tr>";
    foreach ($stats as $stat) {
        echo "<tr>";
        echo "<td>" . $stat['total'] . "</td>";
        echo "<td>" . getStatusLabel($stat['delivery_status']) . "</td>";
        echo "<td>" . getTypeLabel($stat['message_type']) . "</td>";
        echo "</tr>";
    }
    echo "</table><br>";
    
    // نمونه رکوردهای اخیر
    echo "<h3>📝 آخرین رکوردها</h3>";
    $sql = "SELECT * FROM ai_sms_logs ORDER BY created_at DESC LIMIT 5";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $recent = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<table border='1' cellpadding='5' cellspacing='0'>";
    echo "<tr><th>شناسه</th><th>شماره</th><th>متن</th><th>وضعیت</th><th>نوع</th><th>تاریخ</th></tr>";
    foreach ($recent as $record) {
        $statusClass = getStatusClass($record['delivery_status']);
        echo "<tr>";
        echo "<td>" . $record['id'] . "</td>";
        echo "<td>" . $record['recipient_phone'] . "</td>";
        echo "<td>" . substr($record['message_text'], 0, 30) . "..." . "</td>";
        echo "<td style='color: $statusClass'>" . getStatusLabel($record['delivery_status']) . "</td>";
        echo "<td>" . getTypeLabel($record['message_type']) . "</td>";
        echo "<td>" . $record['created_at'] . "</td>";
        echo "</tr>";
    }
    echo "</table>";
    
} catch (PDOException $e) {
    echo "❌ خطا در اتصال به دیتابیس: " . $e->getMessage();
}

/**
 * فراخوانی API پیامک
 */
function callSMSAPI($url, $data) {
    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json'
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    
    curl_close($ch);
    
    if ($error) {
        return [
            'error' => true,
            'message' => 'خطای cURL: ' . $error
        ];
    }
    
    if ($httpCode !== 200) {
        return [
            'error' => true,
            'message' => 'HTTP Error: ' . $httpCode,
            'response' => $response
        ];
    }
    
    $result = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        return [
            'error' => true,
            'message' => 'خطای JSON: ' . json_last_error_msg(),
            'raw_response' => $response
        ];
    }
    
    return $result;
}

/**
 * دریافت برچسب وضعیت
 */
function getStatusLabel($status) {
    $labels = [
        'pending' => '⏳ در انتظار',
        'sent' => '📤 ارسال شده',
        'delivered' => '✅ تحویل داده شده',
        'failed' => '❌ ناموفق',
        'expired' => '⏰ منقضی شده',
        'verified' => '✅ تأیید شده',
        'saved' => '💾 ذخیره شده',
        'blocked' => '🚫 مسدود شده',
        'undelivered' => '📵 عدم تحویل',
        'unknown' => '❓ نامشخص'
    ];
    
    return $labels[$status] ?? $status;
}

/**
 * دریافت برچسب نوع پیام
 */
function getTypeLabel($type) {
    $labels = [
        'general' => '📄 عمومی',
        'otp' => '🔐 کد یکبار مصرف',
        'notification' => '🔔 اطلاع‌رسانی',
        'test' => '🧪 تست'
    ];
    
    return $labels[$type] ?? $type;
}

/**
 * دریافت کلاس رنگ وضعیت
 */
function getStatusClass($status) {
    $classes = [
        'delivered' => 'green',
        'verified' => 'green',
        'failed' => 'red',
        'expired' => 'red',
        'blocked' => 'red',
        'undelivered' => 'red',
        'pending' => 'orange',
        'sent' => 'orange',
        'saved' => 'blue',
        'unknown' => 'gray'
    ];
    
    return $classes[$status] ?? 'black';
}
?>

<style>
body {
    font-family: Tahoma, Arial, sans-serif;
    direction: rtl;
    text-align: right;
    margin: 20px;
    background-color: #f5f5f5;
}

table {
    background: white;
    border-collapse: collapse;
    width: 100%;
    margin: 10px 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

th {
    background-color: #007cba;
    color: white;
    padding: 10px;
    text-align: center;
}

td {
    padding: 8px;
    text-align: center;
    border-bottom: 1px solid #ddd;
}

pre {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    padding: 15px;
    overflow-x: auto;
    direction: ltr;
    text-align: left;
}

h2 {
    color: #007cba;
    border-bottom: 2px solid #007cba;
    padding-bottom: 5px;
}

h3 {
    color: #28a745;
    margin-top: 20px;
}
</style>
