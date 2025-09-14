<?php
/**
 * SMS Management API - 0098SMS Integration
 * مدیریت سامانه پیامک ۰۰۹۸
 * 
 * @author DataSave Team
 * @version 1.0.0
 */

require_once __DIR__ . '/../../config/database.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

class SMSManager {
    
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
        
        // تنظیم timezone پیش‌فرض
        date_default_timezone_set('Asia/Tehran');
        
        // تنظیم timezone دیتابیس
        try {
            $this->db->exec("SET time_zone = '+03:30'");
        } catch (Exception $e) {
            error_log("Warning: Could not set database timezone: " . $e->getMessage());
        }
        
        error_log("SMS Manager initialized with Tehran timezone");
    }
    
    /**
     * دریافت تنظیمات پیامک
     * Get SMS settings
     */
    public function getSettings() {
        try {
            $sql = "SELECT setting_key, setting_value, setting_type, description 
                    FROM ai_sms_settings 
                    ORDER BY setting_key";
            
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $settings = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Convert to key-value pairs
            $result = [];
            foreach ($settings as $setting) {
                $value = $setting['setting_value'];
                
                // Convert based on type
                switch ($setting['setting_type']) {
                    case 'boolean':
                        $value = (bool) $value;
                        break;
                    case 'integer':
                        $value = (int) $value;
                        break;
                    case 'string':
                    case 'text':
                    default:
                        $value = (string) $value;
                        break;
                }
                
                $result[$setting['setting_key']] = [
                    'value' => $value,
                    'type' => $setting['setting_type'],
                    'description' => $setting['description']
                ];
            }
            
            return [
                'success' => true,
                'data' => $result
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'خطا در دریافت تنظیمات: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * بروزرسانی تنظیمات پیامک
     * Update SMS settings
     */
    public function updateSettings($settings) {
        try {
            $this->db->beginTransaction();
            
            foreach ($settings as $key => $value) {
                $sql = "UPDATE ai_sms_settings 
                        SET setting_value = :value, updated_at = NOW() 
                        WHERE setting_key = :key";
                
                $stmt = $this->db->prepare($sql);
                $stmt->bindParam(':value', $value);
                $stmt->bindParam(':key', $key);
                $stmt->execute();
            }
            
            $this->db->commit();
            
            return [
                'success' => true,
                'message' => 'تنظیمات با موفقیت بروزرسانی شد'
            ];
            
        } catch (Exception $e) {
            $this->db->rollBack();
            return [
                'success' => false,
                'message' => 'خطا در بروزرسانی تنظیمات: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * ارسال پیامک تست
     * Send test SMS
     */
    public function sendTestSMS($phoneNumber, $message) {
        try {
            // دریافت تنظیمات
            $settings = $this->getSettings();
            if (!$settings['success']) {
                throw new Exception('خطا در دریافت تنظیمات');
            }
            
            $config = $settings['data'];
            
            // بررسی فعال بودن سامانه
            if (!$config['sms_enabled']['value']) {
                throw new Exception('سامانه پیامک غیرفعال است');
            }
            
            // ارسال پیامک
            $result = $this->sendSMSViaAPI(
                $phoneNumber,
                $message,
                $config,
                'test'
            );
            
            return $result;
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'خطا در ارسال پیامک تست: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * ارسال کد OTP
     * Send OTP SMS
     */
    public function sendOTP($phoneNumber, $userId = null) {
        try {
            // دریافت تنظیمات
            $settings = $this->getSettings();
            if (!$settings['success']) {
                throw new Exception('خطا در دریافت تنظیمات');
            }
            
            $config = $settings['data'];
            
            // تولید کد OTP
            $otpLength = $config['otp_length']['value'];
            $otpCode = $this->generateOTP($otpLength);
            
            // ساخت پیام OTP
            $template = $config['otp_message_template']['value'];
            $expiryMinutes = $config['otp_expiry_minutes']['value'];
            
            $message = str_replace(
                ['{OTP_CODE}', '{EXPIRY_MINUTES}'],
                [$otpCode, $expiryMinutes],
                $template
            );
            
            // ارسال پیامک
            $result = $this->sendSMSViaAPI(
                $phoneNumber,
                $message,
                $config,
                'otp',
                $otpCode,
                $expiryMinutes,
                $userId
            );
            
            // اضافه کردن اطلاعات OTP به پاسخ
            if ($result['success']) {
                $result['otp_code'] = $otpCode;
                $result['otp_length'] = $otpLength;
                $result['expiry_minutes'] = $expiryMinutes;
                
                // محاسبه زمان انقضای دقیق
                $expiresAt = new DateTime();
                $expiresAt->add(new DateInterval('PT' . $expiryMinutes . 'M'));
                $result['expires_at'] = $expiresAt->format('Y-m-d H:i:s');
                $result['expires_at_iso'] = $expiresAt->format('c'); // ISO format for JavaScript
            }
            
            return $result;
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'خطا در ارسال کد OTP: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * ارسال پیامک از طریق API سامانه ۰۰۹۸
     * Send SMS via 0098SMS API
     */
    private function sendSMSViaAPI($phone, $message, $config, $type = 'general', $otpCode = null, $expiryMinutes = null, $userId = null) {
        try {
            // بررسی وجود فیلدهای ضروری
            if (!isset($config['sms_username']['value']) || empty($config['sms_username']['value'])) {
                throw new Exception('نام کاربری SMS تنظیم نشده است');
            }
            if (!isset($config['sms_password']['value']) || empty($config['sms_password']['value'])) {
                throw new Exception('رمز عبور SMS تنظیم نشده است');
            }
            if (!isset($config['sms_panel_number']['value']) || empty($config['sms_panel_number']['value'])) {
                throw new Exception('شماره پنل SMS تنظیم نشده است');
            }
            
            // استفاده از endpoint از دیتابیس یا مقدار پیش‌فرض
            $apiUrl = isset($config['api_endpoint']) && !empty($config['api_endpoint']['value']) 
                ? $config['api_endpoint']['value'] 
                : 'https://0098sms.com/sendsmslink.aspx';
            
            $params = [
                'FROM' => $config['sms_panel_number']['value'],  // شماره پنل
                'TO' => $phone,                                   // شماره مقصد
                'TEXT' => $message,                              // متن پیام
                'USERNAME' => $config['sms_username']['value'],   // نام کاربری
                'PASSWORD' => $config['sms_password']['value'],   // رمز عبور
                'DOMAIN' => '0098'                               // دامین ثابت
            ];
            
            $url = $apiUrl . '?' . http_build_query($params);
            
            // ارسال درخواست
            $context = stream_context_create([
                'http' => [
                    'method' => 'GET',
                    'timeout' => 30,
                    'header' => "User-Agent: DataSave SMS Client\r\n"
                ]
            ]);
            
            $response = file_get_contents($url, false, $context);
            
            if ($response === false) {
                throw new Exception('خطا در ارتباط با سامانه پیامک 0098');
            }
            
            // تحلیل پاسخ - بر اساس مستندات، کد 0 یعنی موفق
            $statusCode = trim($response);
            
            // اگر پاسخ HTML است، احتمالاً خطا دارد
            if (strpos($statusCode, '<!DOCTYPE') !== false || strpos($statusCode, '<html') !== false) {
                // استخراج کد خطا از HTML (اگر موجود باشد)
                if (preg_match('/(\d+)/', $statusCode, $matches)) {
                    $statusCode = $matches[1];
                } else {
                    $statusCode = 'html_response';
                }
            }
            
            $statusText = $this->getStatusText($statusCode);
            $deliveryStatus = $this->getDeliveryStatus($statusCode);
            
            // ذخیره در لاگ
            $logId = $this->saveSMSLog(
                $phone,
                $message,
                $type,
                $statusCode,
                $statusText,
                $deliveryStatus,
                $otpCode,
                $expiryMinutes,
                $userId
            );
            
            return [
                'success' => $statusCode === '0',
                'status_code' => $statusCode,
                'status_text' => $statusText,
                'delivery_status' => $deliveryStatus,
                'log_id' => $logId,
                'message' => $statusCode === '0' ? 'پیامک با موفقیت ارسال شد' : $statusText
            ];
            
        } catch (Exception $e) {
            // ذخیره خطا در لاگ
            $logId = $this->saveSMSLog(
                $phone,
                $message,
                $type,
                'error',
                $e->getMessage(),
                'failed',
                $otpCode,
                $expiryMinutes,
                $userId
            );
            
            return [
                'success' => false,
                'status_code' => 'error',
                'status_text' => $e->getMessage(),
                'delivery_status' => 'failed',
                'log_id' => $logId,
                'message' => 'خطا در ارسال پیامک: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * ذخیره لاگ پیامک
     * Save SMS log
     */
    private function saveSMSLog($phone, $message, $type, $statusCode, $statusText, $deliveryStatus, $otpCode = null, $expiryMinutes = null, $userId = null) {
        try {
            $sql = "INSERT INTO ai_sms_logs 
                    (recipient_phone, message_text, message_type, status_code, status_text, 
                     delivery_status, otp_code, otp_expires_at, created_by) 
                    VALUES (:phone, :message, :type, :status_code, :status_text, 
                            :delivery_status, :otp_code, :otp_expires_at, :created_by)";
            
            $stmt = $this->db->prepare($sql);
            
            // محاسبه زمان انقضای OTP
            $otpExpiresAt = null;
            if ($otpCode && $expiryMinutes) {
                $otpExpiresAt = date('Y-m-d H:i:s', strtotime("+{$expiryMinutes} minutes"));
            }
            
            $stmt->bindParam(':phone', $phone);
            $stmt->bindParam(':message', $message);
            $stmt->bindParam(':type', $type);
            $stmt->bindParam(':status_code', $statusCode);
            $stmt->bindParam(':status_text', $statusText);
            $stmt->bindParam(':delivery_status', $deliveryStatus);
            $stmt->bindParam(':otp_code', $otpCode);
            $stmt->bindParam(':otp_expires_at', $otpExpiresAt);
            $stmt->bindParam(':created_by', $userId);
            
            $stmt->execute();
            
            return $this->db->lastInsertId();
            
        } catch (Exception $e) {
            error_log('Error saving SMS log: ' . $e->getMessage());
            return null;
        }
    }
    
    /**
     * دریافت متن وضعیت بر اساس کد
     * Get status text based on code
     */
    private function getStatusText($code) {
        // خطاهای لینک API 0098SMS
        $linkErrors = [
            '0' => 'عملیات با موفقیت به پایان رسید',
            '1' => 'شماره گیرنده اشتباه است',
            '2' => 'گیرنده تعریف نشده است',
            '3' => 'فرستنده تعریف نشده است',
            '4' => 'متن تنظیم نشده است',
            '5' => 'نام کاربری تنظیم نشده است',
            '6' => 'کلمه عبور تنظیم نشده است',
            '7' => 'نام دامین تنظیم نشده است',
            '8' => 'مجوز شما باطل شده است',
            '9' => 'اعتبار پیامک شما کافی نیست',
            '10' => 'برای این شماره لینک تعریف نشده است',
            '11' => 'عدم مجوز برای اتصال لینک',
            '12' => 'نام کاربری و کلمه عبور اشتباه است',
            '13' => 'کاراکتر غیرمجاز در متن وجود دارد',
            '14' => 'سقف ارسال روزانه پر شده است',
            '16' => 'عدم مجوز شماره برای ارسال از لینک',
            '17' => 'خطا در شماره پنل. لطفا با پشتیبانی تماس بگیرید',
            '18' => 'اتمام تاریخ اعتبار شماره پنل. برای استفاده تمدید شود',
            '19' => 'تنظیمات کد OTP انجام نشده است',
            '20' => 'فرمت کد OTP صحیح نیست',
            '21' => 'تنظیمات کد OTP توسط ادمین تایید نشده است',
            '22' => 'اطلاعات مالک شماره ثبت و تایید نشده است',
            '23' => 'هنوز اجازه ارسال به این شماره پنل داده نشده است',
            '24' => 'ارسال از IP غیرمجاز انجام شده است'
        ];

        // خطاهای وب سرویس 0098SMS
        $webServiceErrors = [
            '2' => 'ارسال با موفقیت انجام شد',
            '3' => 'عدم تطابق نام کاربری و کلمه عبور. لطفا با پشتیبانی تماس بگیرید',
            '10' => 'نام کاربری یا کلمه عبور اشتباه است. لطفا با پشتیبانی تماس بگیرید',
            '11' => 'کاراکتر غیر مجاز در متن وجود دارد',
            '17' => 'متن پیامک خالی است',
            '18' => 'خطای شارژ. لطفا با پشتیبانی تماس بگیرید',
            '19' => 'شارژ پنل شما برای ارسال کافی نیست. لطفا اقدام به شارژ پنل نمایید',
            '22' => 'شماره موبایل صحیح نیست',
            '66' => 'عدم تطابق نام کاربری و کلمه عبور. لطفا با پشتیبانی تماس بگیرید',
            '1111' => 'کاراکتر غیرمجاز در متن وجود دارد',
            '-23' => 'عدم مجوز شماره برای ارسال از لینک',
            '-24' => 'خطا در شماره پنل. لطفا با پشتیبانی تماس بگیرید',
            '-25' => 'اتمام تاریخ اعتبار شماره پنل. برای استفاده تمدید شود',
            '-26' => 'تنظیمات کد OTP انجام نشده است',
            '-27' => 'فرمت کد OTP صحیح نیست',
            '-28' => 'تنظیمات کد OTP توسط ادمین تایید نشده است',
            '-29' => 'فرمت کد OTP صحیح نیست',
            '-31' => 'SMS ID یافت نشد',
            '-32' => 'SMS ID مطابقت ندارد',
            // وضعیت‌های دیگر
            '4' => 'مخاطب دریافت پیام‌های تبلیغاتی خود را بسته است',
            '5' => 'رسیده به گوشی',
            '6' => 'نرسیده به گوشی',
            '7' => 'وضعیت دریافت پیامک منقضی شده است',
            '8' => 'وضعیت پیامک نامشخص است',
            '9' => 'اطلاعات مالک شماره، ثبت و تایید نشده است',
            '21' => 'هنوز اجازه ارسال به این شماره پنل داده نشده است',
            '31' => 'ارسال از IP غیر مجاز انجام شده است',
            // پیام‌های خاص
            'Hang' => 'حساب کاربری شما مسدود است. لطفا با پشتیبانی تماس بگیرید',
            'No Doc' => 'مرحله دوم ثبت نام شما انجام نگرفته است. لطفا ثبت نام را کامل نمایید',
            'Wrong timestamp' => 'تایم استمپ ارسال شده صحیح نیست',
            'Wrong time' => 'زمان مورد نظر در بازه صحیح نیست (تنظیم زمان ارسال از همان روز تا یک سال بعد مجاز است)'
        ];

        // ابتدا در لیست خطاهای لینک جستجو کن
        if (isset($linkErrors[$code])) {
            return $linkErrors[$code];
        }
        
        // سپس در لیست خطاهای وب سرویس جستجو کن
        if (isset($webServiceErrors[$code])) {
            return $webServiceErrors[$code];
        }
        
        // اگر کد عددی 9 رقمی یا بیشتر باشد، یعنی ارسال موفق وب سرویس
        if (is_numeric($code) && strlen($code) >= 9) {
            return 'ارسال با موفقیت انجام شد (برای تابع ارسال با قابلیت دریافت دلیوری)';
        }
        
        return 'وضعیت نامشخص: ' . $code;
    }
    
    /**
     * تعیین وضعیت تحویل بر اساس کد
     * Determine delivery status based on code
     */
    private function getDeliveryStatus($code) {
        // کدهای موفقیت
        $successCodes = ['0', '2'];
        
        // کدهای تحویل موفق وب سرویس (کد عددی 9 رقمی یا بیشتر)
        if (is_numeric($code) && strlen($code) >= 9) {
            return 'delivered';
        }
        
        // کدهای موفقیت ارسال
        if (in_array($code, $successCodes)) {
            return 'sent';
        }
        
        // کد 5 = رسیده به گوشی
        if ($code === '5') {
            return 'delivered';
        }
        
        // کدهای مسدودی و مشکلات کاربر
        $blockedCodes = ['4', '8', 'Hang', 'No Doc'];
        if (in_array($code, $blockedCodes)) {
            return 'blocked';
        }
        
        // کدهای عدم تحویل
        $undeliveredCodes = ['6', '7'];
        if (in_array($code, $undeliveredCodes)) {
            return 'undelivered';
        }
        
        // کدهای خطای سیستمی (اعتبار، شارژ، تنظیمات)
        $systemErrorCodes = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '16', '17', '18', '19', '20', '21', '22', '23', '24', '31',
            '3', '10', '11', '17', '18', '19', '22', '66', '1111', '-23', '-24', '-25', '-26', '-27', '-28', '-29', '-31', '-32',
            'Wrong timestamp', 'Wrong time'
        ];
        
        if (in_array($code, $systemErrorCodes)) {
            return 'failed';
        }
        
        return 'unknown';
    }
    
    /**
     * تولید کد OTP
     * Generate OTP code
     */
    private function generateOTP($length) {
        $otp = '';
        for ($i = 0; $i < $length; $i++) {
            $otp .= rand(0, 9);
        }
        return $otp;
    }
    
    /**
     * ذخیره داده‌های تست SMS در دیتابیس
     * Save SMS test data to database
     */
    public function saveTestData($phone, $message, $messageType = 'test') {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO ai_sms_logs (recipient_phone, message_text, message_type, delivery_status, created_at, updated_at) 
                VALUES (?, ?, ?, 'saved', NOW(), NOW())
            ");
            
            $result = $stmt->execute([$phone, $message, $messageType]);
            
            if ($result) {
                $logId = $this->db->lastInsertId();
                
                return [
                    'success' => true,
                    'message' => 'داده‌های تست با موفقیت ذخیره شد',
                    'log_id' => $logId,
                    'phone' => $phone,
                    'text' => $message
                ];
            } else {
                throw new Exception('خطا در ذخیره داده‌های تست');
            }
        } catch (Exception $e) {
            error_log("SMS Test Data Save Error: " . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'خطا در ذخیره داده‌های تست: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * راستی‌آزمایی کد OTP
     * Verify OTP code
     */
    public function verifyOTPCode($phone, $enteredCode) {
        try {
            // لاگ درخواست
            error_log("SMS OTP Verify Request: Phone=$phone, Code=$enteredCode");
            
            // جستجوی آخرین کد OTP برای این شماره
            $stmt = $this->db->prepare("
                SELECT id, otp_code, otp_expires_at, delivery_status, created_at
                FROM ai_sms_logs 
                WHERE recipient_phone = ? AND message_type = 'otp' AND delivery_status = 'sent'
                ORDER BY created_at DESC 
                LIMIT 1
            ");
            
            $stmt->execute([$phone]);
            $otpRecord = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$otpRecord) {
                error_log("SMS OTP Verify: No OTP record found for $phone");
                return [
                    'success' => false,
                    'message' => 'کد OTP یافت نشد یا منقضی شده است',
                    'debug_info' => 'no_record_found'
                ];
            }
            
            error_log("SMS OTP Verify: Found record - ID={$otpRecord['id']}, Code={$otpRecord['otp_code']}, Expires={$otpRecord['otp_expires_at']}");
            
            // بررسی انقضا - استفاده از MySQL CURRENT_TIMESTAMP
            $checkExpiryStmt = $this->db->prepare("
                SELECT 
                    CASE WHEN otp_expires_at > NOW() THEN 1 ELSE 0 END as is_valid,
                    otp_expires_at,
                    NOW() as server_time,
                    TIMESTAMPDIFF(SECOND, NOW(), otp_expires_at) as seconds_remaining
                FROM ai_sms_logs 
                WHERE id = ?
            ");
            $checkExpiryStmt->execute([$otpRecord['id']]);
            $expiryCheck = $checkExpiryStmt->fetch(PDO::FETCH_ASSOC);
            
            error_log("SMS OTP Verify: Expiry check - Valid={$expiryCheck['is_valid']}, Seconds remaining={$expiryCheck['seconds_remaining']}");
            
            if (!$expiryCheck['is_valid']) {
                // به‌روزرسانی وضعیت به expired
                $updateStmt = $this->db->prepare("
                    UPDATE ai_sms_logs 
                    SET delivery_status = 'expired', updated_at = NOW() 
                    WHERE id = ?
                ");
                $updateStmt->execute([$otpRecord['id']]);
                
                error_log("SMS OTP Verify: Code expired for $phone");
                return [
                    'success' => false,
                    'message' => 'کد OTP منقضی شده است',
                    'debug_info' => [
                        'expires_at' => $expiryCheck['otp_expires_at'],
                        'server_time' => $expiryCheck['server_time'],
                        'seconds_remaining' => $expiryCheck['seconds_remaining']
                    ]
                ];
            }
            
            // بررسی صحت کد
            if ($otpRecord['otp_code'] !== $enteredCode) {
                error_log("SMS OTP Verify: Wrong code for $phone - Expected: {$otpRecord['otp_code']}, Got: $enteredCode");
                
                // به‌روزرسانی وضعیت به failed
                $updateStmt = $this->db->prepare("
                    UPDATE ai_sms_logs 
                    SET delivery_status = 'failed', updated_at = NOW() 
                    WHERE id = ?
                ");
                $updateStmt->execute([$otpRecord['id']]);
                
                return [
                    'success' => false,
                    'message' => 'کد وارد شده نادرست است',
                    'debug_info' => 'wrong_code'
                ];
            }
            
            // کد صحیح است - به‌روزرسانی وضعیت
            $updateStmt = $this->db->prepare("
                UPDATE ai_sms_logs 
                SET delivery_status = 'verified', updated_at = NOW() 
                WHERE id = ?
            ");
            $updateStmt->execute([$otpRecord['id']]);
            
            error_log("SMS OTP Verify: Success for $phone");
            
            return [
                'success' => true,
                'message' => 'کد OTP با موفقیت تایید شد',
                'log_id' => $otpRecord['id'],
                'phone' => $phone
            ];
            
        } catch (Exception $e) {
            error_log("SMS OTP Verify Error: " . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'خطا در تایید کد OTP: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * دریافت زمان انقضا OTP
     * Get OTP expiration time
     */
    public function getOTPExpirationTime($logId) {
        try {
            $stmt = $this->db->prepare("SELECT otp_expires_at FROM ai_sms_logs WHERE id = ?");
            $stmt->execute([$logId]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            return $result ? $result['otp_expires_at'] : null;
        } catch (Exception $e) {
            error_log("Error getting OTP expiration time: " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * دریافت گزارش پیامک‌ها
     * Get SMS reports
     */
    public function getReports($filters = []) {
        try {
            $sql = "SELECT * FROM ai_sms_logs WHERE 1=1";
            $params = [];
            
            // اعمال فیلترها
            if (!empty($filters['phone'])) {
                $sql .= " AND recipient_phone LIKE :phone";
                $params[':phone'] = '%' . $filters['phone'] . '%';
            }
            
            if (!empty($filters['type'])) {
                $sql .= " AND message_type = :type";
                $params[':type'] = $filters['type'];
            }
            
            if (!empty($filters['status'])) {
                $sql .= " AND delivery_status = :status";
                $params[':status'] = $filters['status'];
            }
            
            if (!empty($filters['date_from'])) {
                $sql .= " AND DATE(created_at) >= :date_from";
                $params[':date_from'] = $filters['date_from'];
            }
            
            if (!empty($filters['date_to'])) {
                $sql .= " AND DATE(created_at) <= :date_to";
                $params[':date_to'] = $filters['date_to'];
            }
            
            $sql .= " ORDER BY created_at DESC";
            
            // Pagination
            $page = isset($filters['page']) ? (int)$filters['page'] : 1;
            $limit = isset($filters['limit']) ? (int)$filters['limit'] : 50;
            $offset = ($page - 1) * $limit;
            
            $sql .= " LIMIT :limit OFFSET :offset";
            
            $stmt = $this->db->prepare($sql);
            
            // Bind parameters
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            
            $stmt->execute();
            $reports = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Count total records
            $countSql = str_replace("SELECT * FROM", "SELECT COUNT(*) as total FROM", explode(" ORDER BY", $sql)[0]);
            $countStmt = $this->db->prepare($countSql);
            foreach ($params as $key => $value) {
                $countStmt->bindValue($key, $value);
            }
            $countStmt->execute();
            $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            return [
                'success' => true,
                'data' => $reports,
                'pagination' => [
                    'total' => $total,
                    'page' => $page,
                    'limit' => $limit,
                    'pages' => ceil($total / $limit)
                ]
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'خطا در دریافت گزارشات: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * دریافت گزارشات SMS پیشرفته
     * Get Advanced SMS Reports
     */
    public function getSMSReports($params) {
        try {
            // پارامترهای فیلتر
            $limit = (int)($params['limit'] ?? 50);
            $offset = (int)($params['offset'] ?? 0);
            $status = $params['status'] ?? '';
            $type = $params['type'] ?? '';
            $phone = $params['phone'] ?? '';
            $dateFrom = $params['date_from'] ?? '';
            $dateTo = $params['date_to'] ?? '';
            $search = $params['search'] ?? '';
            
            // ساخت کوئری پایه
            $whereConditions = [];
            $queryParams = [];
            
            // فیلتر بر اساس وضعیت
            if (!empty($status)) {
                $whereConditions[] = "delivery_status = ?";
                $queryParams[] = $status;
            }
            
            // فیلتر بر اساس نوع پیام
            if (!empty($type)) {
                $whereConditions[] = "message_type = ?";
                $queryParams[] = $type;
            }
            
            // فیلتر بر اساس شماره تلفن
            if (!empty($phone)) {
                $whereConditions[] = "recipient_phone LIKE ?";
                $queryParams[] = "%$phone%";
            }
            
            // فیلتر بر اساس تاریخ از
            if (!empty($dateFrom)) {
                $whereConditions[] = "created_at >= ?";
                $queryParams[] = $dateFrom . ' 00:00:00';
            }
            
            // فیلتر بر اساس تاریخ تا
            if (!empty($dateTo)) {
                $whereConditions[] = "created_at <= ?";
                $queryParams[] = $dateTo . ' 23:59:59';
            }
            
            // جستجو در متن پیام
            if (!empty($search)) {
                $whereConditions[] = "(message_text LIKE ? OR recipient_phone LIKE ? OR status_text LIKE ?)";
                $queryParams[] = "%$search%";
                $queryParams[] = "%$search%";
                $queryParams[] = "%$search%";
            }
            
            // ساخت WHERE clause
            $whereClause = '';
            if (!empty($whereConditions)) {
                $whereClause = 'WHERE ' . implode(' AND ', $whereConditions);
            }
            
            // شمارش کل رکوردها
            $countQuery = "SELECT COUNT(*) as total FROM ai_sms_logs $whereClause";
            $countStmt = $this->db->prepare($countQuery);
            $countStmt->execute($queryParams);
            $totalCount = $countStmt->fetchColumn();
            
            // دریافت داده‌های اصلی
            $queryParams[] = $limit;
            $queryParams[] = $offset;
            
            $mainQuery = "SELECT 
                            id,
                            recipient_phone,
                            message_text,
                            message_type,
                            delivery_status,
                            status_text,
                            otp_code,
                            created_at,
                            updated_at,
                            CASE 
                                WHEN delivery_status IN ('delivered', 'verified') THEN 'success'
                                WHEN delivery_status IN ('failed', 'expired', 'blocked', 'undelivered') THEN 'danger'
                                WHEN delivery_status IN ('pending', 'sent') THEN 'warning'
                                ELSE 'secondary'
                            END as status_class
                          FROM ai_sms_logs 
                          $whereClause 
                          ORDER BY created_at DESC 
                          LIMIT ? OFFSET ?";
            
            $mainStmt = $this->db->prepare($mainQuery);
            $mainStmt->execute($queryParams);
            $reports = $mainStmt->fetchAll(PDO::FETCH_ASSOC);
            
            // آمار وضعیت‌ها
            $statsQuery = "SELECT 
                             delivery_status, 
                             COUNT(*) as count 
                           FROM ai_sms_logs 
                           $whereClause 
                           GROUP BY delivery_status";
            
            $statsStmt = $this->db->prepare($statsQuery);
            $statsStmt->execute(array_slice($queryParams, 0, -2)); // حذف limit و offset
            $statusStats = $statsStmt->fetchAll(PDO::FETCH_KEY_PAIR);
            
            // آمار نوع پیام‌ها
            $typeStatsQuery = "SELECT 
                                message_type, 
                                COUNT(*) as count 
                              FROM ai_sms_logs 
                              $whereClause 
                              GROUP BY message_type";
            
            $typeStatsStmt = $this->db->prepare($typeStatsQuery);
            $typeStatsStmt->execute(array_slice($queryParams, 0, -2)); // حذف limit و offset
            $typeStats = $typeStatsStmt->fetchAll(PDO::FETCH_KEY_PAIR);
            
            return [
                'success' => true,
                'message' => 'گزارشات با موفقیت دریافت شد',
                'data' => [
                    'reports' => $reports,
                    'total' => $totalCount,
                    'limit' => $limit,
                    'offset' => $offset,
                    'stats' => [
                        'status' => $statusStats,
                        'types' => $typeStats
                    ]
                ]
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'خطا در دریافت گزارشات: ' . $e->getMessage()
            ];
        }
    }
}

// Main API handler
try {
    $database = Database::getInstance();
    $db = $database->getConnection();
    $smsManager = new SMSManager($db);
    
    $method = $_SERVER['REQUEST_METHOD'];
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    
    // Parse request body
    $input = json_decode(file_get_contents('php://input'), true);
    
    switch ($method) {
        case 'GET':
            if (strpos($path, '/settings') !== false) {
                $response = $smsManager->getSettings();
            } elseif (strpos($path, '/reports') !== false) {
                $filters = $_GET;
                $response = $smsManager->getReports($filters);
            } else {
                $response = ['success' => false, 'message' => 'نامشخص endpoint'];
            }
            break;
            
        case 'POST':
            // بررسی action در body داده
            $action = $input['action'] ?? '';
            
            if ($action === 'save_test_data') {
                $phone = $input['phone'] ?? '';
                $message = $input['message'] ?? '';
                $messageType = $input['message_type'] ?? 'test';
                
                if (empty($phone) || empty($message)) {
                    $response = [
                        'success' => false,
                        'message' => 'شماره تلفن و متن پیام الزامی است'
                    ];
                } else {
                    $response = $smsManager->saveTestData($phone, $message, $messageType);
                }
            } elseif ($action === 'send_otp') {
                $phone = $input['phone'] ?? '';
                $userId = $input['user_id'] ?? null;
                
                if (empty($phone)) {
                    $response = [
                        'success' => false,
                        'message' => 'شماره تلفن الزامی است'
                    ];
                } else {
                    // استفاده از متد موجود sendOTP و سپس اطلاعات اضافی برگردان
                    $response = $smsManager->sendOTP($phone, $userId);
                    
                    // اضافه کردن زمان انقضا برای UI
                    if ($response['success'] && isset($response['log_id'])) {
                        $expirationTime = $smsManager->getOTPExpirationTime($response['log_id']);
                        if ($expirationTime) {
                            $response['expires_at'] = $expirationTime;
                        }
                    }
                }
            } elseif ($action === 'verify_otp') {
                $phone = $input['phone'] ?? '';
                $code = $input['code'] ?? '';
                
                if (empty($phone) || empty($code)) {
                    $response = [
                        'success' => false,
                        'message' => 'شماره تلفن و کد الزامی است'
                    ];
                } else {
                    $response = $smsManager->verifyOTPCode($phone, $code);
                }
            } elseif ($action === 'get_reports') {
                $response = $smsManager->getSMSReports($input);
            } elseif ($action === 'test_sms') {
                $phone = $input['phone'] ?? '';
                $message = $input['message'] ?? '';
                
                if (empty($phone) || empty($message)) {
                    $response = [
                        'success' => false,
                        'message' => 'شماره تلفن و متن پیام الزامی است'
                    ];
                } else {
                    $response = $smsManager->sendTestSMS($phone, $message);
                }
            } elseif (strpos($path, '/test-sms') !== false) {
                $phone = $input['phone'] ?? '';
                $message = $input['message'] ?? '';
                $response = $smsManager->sendTestSMS($phone, $message);
            } elseif (strpos($path, '/send-otp') !== false) {
                $phone = $input['phone'] ?? '';
                $userId = $input['user_id'] ?? null;
                $response = $smsManager->sendOTP($phone, $userId);
            } else {
                $response = ['success' => false, 'message' => 'نامشخص endpoint'];
            }
            break;
            
        case 'PUT':
            if (strpos($path, '/settings') !== false) {
                $settings = $input['settings'] ?? [];
                $response = $smsManager->updateSettings($settings);
            } else {
                $response = ['success' => false, 'message' => 'نامشخص endpoint'];
            }
    }
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'خطای سرور: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>