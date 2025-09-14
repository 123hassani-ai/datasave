<?php
declare(strict_types=1);

/**
 * Settings API Endpoint
 * API مدیریت تنظیمات سیستم
 * 
 * @package DataSave
 * @version 1.0.0
 */

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Start output buffering to catch any unwanted output
ob_start();

// Log all requests for debugging
error_log("[" . date('Y-m-d H:i:s') . "] Settings API called: " . $_SERVER['REQUEST_METHOD'] . " " . $_SERVER['REQUEST_URI']);

// Clean any output and set headers first
ob_clean();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

try {
    require_once __DIR__ . '/../../config/database.php';
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'خطا در بارگذاری پیکربندی دیتابیس: ' . $e->getMessage(),
        'error_code' => 'CONFIG_ERROR'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// رسیدگی به OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// رسیدگی به HEAD request
if ($_SERVER['REQUEST_METHOD'] === 'HEAD') {
    http_response_code(200);
    exit;
}

/**
 * کلاس مدیریت تنظیمات
 */
class SettingsManager {
    private $db;
    private $user_id;
    
    public function __construct($database, $user_id = 1) {
        $this->db = $database;
        $this->user_id = $user_id; // فعلاً admin user (ID: 1)
    }
    
    /**
     * دریافت تنظیمات SMS
     */
    public function getSettings(): array {
        try {
            $stmt = $this->db->prepare("
                SELECT setting_key, setting_value, setting_type 
                FROM ai_sms_settings 
                ORDER BY setting_key
            ");
            
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $settings = [];
            foreach ($results as $row) {
                $value = $row['setting_value'];
                
                // تبدیل مقدار بر اساس نوع
                switch ($row['setting_type']) {
                    case 'boolean':
                        $value = $value === '1' || $value === 'true';
                        break;
                    case 'integer':
                        $value = (int)$value;
                        break;
                    case 'json':
                        $value = json_decode($value, true);
                        break;
                }
                
                $settings[$row['setting_key']] = [
                    'value' => $value,
                    'type' => $row['setting_type']
                ];
            }
            
            // اگر تنظیمات خالی است، مقادیر پیش‌فرض را برگردان
            if (empty($settings)) {
                $settings = $this->getDefaultSettings();
            }
            
            return [
                'success' => true,
                'data' => $settings,
                'message' => 'تنظیمات با موفقیت بارگذاری شد'
            ];
            
        } catch (Exception $e) {
            error_log("Settings fetch error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'خطا در بارگذاری تنظیمات: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * ذخیره تنظیمات
     */
    public function saveSettings(array $settings, string $type = 'general'): array {
        try {
            $this->db->beginTransaction();
            
            foreach ($settings as $key => $value) {
                // تعیین نوع داده
                $setting_type = 'string';
                
                // بررسی boolean (هم bool و هم string)
                if (is_bool($value) || $value === 'true' || $value === 'false' || $value === true || $value === false) {
                    $setting_type = 'boolean';
                    // تبدیل به boolean واقعی
                    $boolValue = ($value === true || $value === 'true' || $value === '1' || $value === 1);
                    $value = $boolValue ? '1' : '0';
                } elseif (is_int($value) || (is_string($value) && is_numeric($value) && strpos($value, '.') === false)) {
                    $setting_type = 'integer';
                    $value = (string)$value;
                } elseif (is_array($value)) {
                    $setting_type = 'json';
                    $value = json_encode($value, JSON_UNESCAPED_UNICODE);
                }
                
                // بروزرسانی یا درج تنظیم در جدول ai_sms_settings
                $stmt = $this->db->prepare("
                    INSERT INTO ai_sms_settings (setting_key, setting_value, setting_type) 
                    VALUES (?, ?, ?)
                    ON DUPLICATE KEY UPDATE 
                        setting_value = VALUES(setting_value),
                        setting_type = VALUES(setting_type),
                        updated_at = CURRENT_TIMESTAMP
                ");
                
                $stmt->execute([$key, $value, $setting_type]);
            }
            
            // ثبت لاگ
            $this->logActivity('SETTINGS_SAVE', $type, [
                'settings_count' => count($settings),
                'settings_type' => $type
            ]);
            
            $this->db->commit();
            
            return [
                'success' => true,
                'message' => 'تنظیمات با موفقیت ذخیره شد',
                'data' => ['saved_count' => count($settings)]
            ];
            
        } catch (Exception $e) {
            $this->db->rollBack();
            error_log("Settings save error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'خطا در ذخیره تنظیمات: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * دریافت تنظیمات پیش‌فرض
     */
    private function getDefaultSettings(): array {
        return [
            'sms_username' => ['value' => '', 'type' => 'string'],
            'sms_password' => ['value' => '', 'type' => 'string'],
            'sms_panel_number' => ['value' => '', 'type' => 'string'],
            'sms_enabled' => ['value' => false, 'type' => 'boolean'],
            'otp_length' => ['value' => 5, 'type' => 'integer'],
            'otp_expiry_minutes' => ['value' => 5, 'type' => 'integer'],
            'otp_message_template' => ['value' => 'کد تایید شما: {code}', 'type' => 'string']
        ];
    }
    
    /**
     * ثبت فعالیت در لاگ
     */
    private function logActivity(string $action, string $entity_type, array $details = []): void {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO ai_system_logs (user_id, action, entity_type, details, ip_address, user_agent)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            
            $stmt->execute([
                $this->user_id,
                $action,
                $entity_type,
                json_encode($details, JSON_UNESCAPED_UNICODE),
                $_SERVER['REMOTE_ADDR'] ?? null,
                $_SERVER['HTTP_USER_AGENT'] ?? null
            ]);
        } catch (Exception $e) {
            error_log("Log activity error: " . $e->getMessage());
        }
    }
}

// پردازش درخواست
try {
    // اتصال به دیتابیس
    $database = getDB();
    $settingsManager = new SettingsManager($database);
    
    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    
    switch ($method) {
        case 'GET':
            $response = $settingsManager->getSettings();
            break;
            
        case 'POST':
            if (!isset($input['action'])) {
                throw new Exception('Action نامشخص است');
            }
            
            switch ($input['action']) {
                case 'save':
                    if (!isset($input['settings']) || !is_array($input['settings'])) {
                        throw new Exception('تنظیمات نامعتبر است');
                    }
                    
                    $type = $input['type'] ?? 'general';
                    $response = $settingsManager->saveSettings($input['settings'], $type);
                    break;
                    
                default:
                    throw new Exception('عملیات نامشخص: ' . $input['action']);
            }
            break;
            
        case 'PUT':
            // سازگاری با فرمت قدیمی
            if (isset($input['settings']) && is_array($input['settings'])) {
                $response = $settingsManager->saveSettings($input['settings']);
            } else {
                throw new Exception('تنظیمات نامعتبر است');
            }
            break;
            
        default:
            throw new Exception('متد HTTP پشتیبانی نمی‌شود: ' . $method);
    }
    
} catch (Exception $e) {
    error_log("Settings API Error: " . $e->getMessage());
    $response = [
        'success' => false,
        'message' => $e->getMessage(),
        'error_code' => 'SETTINGS_ERROR'
    ];
    http_response_code(400);
}

// خروجی JSON
echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>