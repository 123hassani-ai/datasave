<?php
declare(strict_types=1);

/**
 * AI Settings API Endpoint
 * API مدیریت تنظیمات هوش مصنوعی
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
error_log("[" . date('Y-m-d H:i:s') . "] AI Settings API called: " . $_SERVER['REQUEST_METHOD'] . " " . $_SERVER['REQUEST_URI']);

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
 * کلاس مدیریت تنظیمات هوش مصنوعی
 */
class AISettingsManager {
    private $db;
    private $user_id;
    
    public function __construct($database, $user_id = 1) {
        $this->db = $database;
        $this->user_id = $user_id; // فعلاً admin user (ID: 1)
    }
    
    /**
     * دریافت تنظیمات AI
     */
    public function getSettings(): array {
        try {
            $stmt = $this->db->prepare("
                SELECT setting_key, setting_value, setting_type 
                FROM ai_settings 
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
                    case 'float':
                        $value = (float)$value;
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
                'message' => 'تنظیمات AI با موفقیت بارگذاری شد'
            ];
            
        } catch (Exception $e) {
            error_log("AI Settings fetch error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'خطا در بارگذاری تنظیمات AI: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * ذخیره تنظیمات AI
     */
    public function saveSettings(array $settings, string $type = 'ai'): array {
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
                } elseif (is_float($value) || (is_string($value) && is_numeric($value) && strpos($value, '.') !== false)) {
                    $setting_type = 'float';
                    $value = (string)$value;
                } elseif (is_int($value) || (is_string($value) && is_numeric($value) && strpos($value, '.') === false)) {
                    $setting_type = 'integer';
                    $value = (string)$value;
                } elseif (is_array($value)) {
                    $setting_type = 'json';
                    $value = json_encode($value, JSON_UNESCAPED_UNICODE);
                }
                
                // بروزرسانی یا درج تنظیم در جدول ai_settings
                $stmt = $this->db->prepare("
                    INSERT INTO ai_settings (setting_key, setting_value, setting_type) 
                    VALUES (?, ?, ?)
                    ON DUPLICATE KEY UPDATE 
                        setting_value = VALUES(setting_value),
                        setting_type = VALUES(setting_type),
                        updated_at = CURRENT_TIMESTAMP
                ");
                
                $stmt->execute([$key, $value, $setting_type]);
            }
            
            // ثبت لاگ
            $this->logActivity('AI_SETTINGS_SAVE', $type, [
                'settings_count' => count($settings),
                'settings_type' => $type
            ]);
            
            $this->db->commit();
            
            return [
                'success' => true,
                'message' => 'تنظیمات AI با موفقیت ذخیره شد',
                'data' => ['saved_count' => count($settings)]
            ];
            
        } catch (Exception $e) {
            $this->db->rollBack();
            error_log("AI Settings save error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'خطا در ذخیره تنظیمات AI: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * دریافت تنظیمات پیش‌فرض
     */
    private function getDefaultSettings(): array {
        return [
            'openai_api_key' => ['value' => '', 'type' => 'string'],
            'ai_model' => ['value' => 'gpt-4o', 'type' => 'string'],
            'temperature' => ['value' => 0.7, 'type' => 'float'],
            'max_tokens' => ['value' => 1000, 'type' => 'integer'],
            'tts_service' => ['value' => 'openai', 'type' => 'string'],
            'voice_selection' => ['value' => 'female', 'type' => 'string'],
            'speech_speed' => ['value' => 1.0, 'type' => 'float'],
            'image_generation_service' => ['value' => 'openai', 'type' => 'string']
        ];
    }
    
    /**
     * ثبت فعالیت در لاگ
     */
    private function logActivity(string $action, string $type, array $details = []): void {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO ai_system_logs (user_id, action, entity_type, details, ip_address) 
                VALUES (?, ?, ?, ?, ?)
            ");
            
            $stmt->execute([
                $this->user_id,
                $action,
                $type,
                json_encode($details, JSON_UNESCAPED_UNICODE),
                $_SERVER['REMOTE_ADDR'] ?? 'unknown'
            ]);
        } catch (Exception $e) {
            error_log("Failed to log activity: " . $e->getMessage());
        }
    }
}

// Main execution
try {
    // دریافت اتصال به دیتابیس
    $database = Database::getInstance();
    $db = $database->getConnection();
    
    // ایجاد نمونه مدیریت تنظیمات
    $settingsManager = new AISettingsManager($db);
    
    // تعیین متد HTTP
    $method = $_SERVER['REQUEST_METHOD'];
    
    switch ($method) {
        case 'GET':
            // دریافت تنظیمات
            $result = $settingsManager->getSettings();
            echo json_encode($result, JSON_UNESCAPED_UNICODE);
            break;
            
        case 'POST':
            // ذخیره تنظیمات
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('داده‌های ورودی معتبر نیستند: ' . json_last_error_msg());
            }
            
            if (!isset($input['action'])) {
                throw new Exception('پارامتر action الزامی است');
            }
            
            switch ($input['action']) {
                case 'save':
                    if (!isset($input['settings'])) {
                        throw new Exception('پارامتر settings الزامی است');
                    }
                    
                    $result = $settingsManager->saveSettings($input['settings']);
                    echo json_encode($result, JSON_UNESCAPED_UNICODE);
                    break;
                    
                default:
                    throw new Exception('عملیات نامعتبر: ' . $input['action']);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode([
                'success' => false,
                'message' => 'متد HTTP مجاز نیست'
            ], JSON_UNESCAPED_UNICODE);
    }
    
} catch (Exception $e) {
    error_log("AI Settings API Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'خطا در پردازش درخواست: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}