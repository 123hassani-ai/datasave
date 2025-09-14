<?php
/**
 * اسکریپت نصب و راه‌اندازی پایگاه داده
 * @description راه‌اندازی خودکار پایگاه داده برای پروژه
 * @author DataSave Team
 * @version 1.0.0
 */

require_once __DIR__ . '/../config/database.php';

class DatabaseInstaller {
    private $db;
    private $errors = [];
    private $logs = [];
    
    public function __construct() {
        $this->log('شروع فرآیند نصب پایگاه داده...');
    }
    
    /**
     * اجرای فرآیند نصب کامل
     */
    public function install() {
        try {
            $this->log('=== شروع نصب پایگاه داده DataSave ===');
            
            // اتصال به MySQL (بدون انتخاب دیتابیس)
            $this->connectToMySQL();
            
            // ایجاد پایگاه داده
            $this->createDatabase();
            
            // اتصال مجدد به پایگاه داده ایجاد شده
            $this->connectToDatabase();
            
            // اجرای اسکریپت schema
            $this->executeSchemaFile();
            
            // بررسی نصب
            $this->verifyInstallation();
            
            $this->log('=== نصب پایگاه داده با موفقیت تکمیل شد ===');
            
            return [
                'success' => true,
                'message' => 'پایگاه داده با موفقیت نصب شد',
                'logs' => $this->logs
            ];
            
        } catch (Exception $e) {
            $this->error('خطا در نصب: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'خطا در نصب پایگاه داده: ' . $e->getMessage(),
                'errors' => $this->errors,
                'logs' => $this->logs
            ];
        }
    }
    
    /**
     * اتصال به MySQL
     */
    private function connectToMySQL() {
        try {
            $this->log('اتصال به سرور MySQL...');
            
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";charset=" . DB_CHARSET;
            $this->db = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);
            
            $this->log('✓ اتصال به MySQL برقرار شد');
            
        } catch (PDOException $e) {
            throw new Exception('اتصال به MySQL ناموفق: ' . $e->getMessage());
        }
    }
    
    /**
     * ایجاد پایگاه داده
     */
    private function createDatabase() {
        try {
            $this->log('ایجاد پایگاه داده ' . DB_NAME . '...');
            
            $sql = "CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` 
                    CHARACTER SET utf8mb4 
                    COLLATE utf8mb4_unicode_ci";
            
            $this->db->exec($sql);
            
            $this->log('✓ پایگاه داده ایجاد شد یا از قبل موجود بود');
            
        } catch (PDOException $e) {
            throw new Exception('خطا در ایجاد پایگاه داده: ' . $e->getMessage());
        }
    }
    
    /**
     * اتصال به پایگاه داده
     */
    private function connectToDatabase() {
        try {
            $this->log('اتصال به پایگاه داده ' . DB_NAME . '...');
            
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $this->db = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);
            
            $this->log('✓ اتصال به پایگاه داده برقرار شد');
            
        } catch (PDOException $e) {
            throw new Exception('اتصال به پایگاه داده ناموفق: ' . $e->getMessage());
        }
    }
    
    /**
     * اجرای فایل schema
     */
    private function executeSchemaFile() {
        try {
            $this->log('اجرای اسکریپت schema...');
            
            $schemaFile = __DIR__ . '/schema.sql';
            
            if (!file_exists($schemaFile)) {
                throw new Exception('فایل schema.sql یافت نشد');
            }
            
            $sql = file_get_contents($schemaFile);
            
            // حذف USE database از ابتدای فایل
            $sql = preg_replace('/USE\s+`[^`]+`\s*;/i', '', $sql);
            
            // تقسیم به کوئری‌های جداگانه
            $queries = $this->splitSQLQueries($sql);
            
            $successCount = 0;
            foreach ($queries as $query) {
                $query = trim($query);
                if (!empty($query)) {
                    try {
                        $this->db->exec($query);
                        $successCount++;
                    } catch (PDOException $e) {
                        // نادیده گرفتن خطاهای مربوط به وجود جدول
                        if (strpos($e->getMessage(), 'already exists') === false) {
                            $this->error('خطا در اجرای کوئری: ' . $e->getMessage());
                        }
                    }
                }
            }
            
            $this->log("✓ {$successCount} کوئری با موفقیت اجرا شد");
            
        } catch (Exception $e) {
            throw new Exception('خطا در اجرای schema: ' . $e->getMessage());
        }
    }
    
    /**
     * تقسیم SQL به کوئری‌های جداگانه
     */
    private function splitSQLQueries($sql) {
        // حذف کامنت‌ها
        $sql = preg_replace('/--.*$/m', '', $sql);
        $sql = preg_replace('/\/\*.*?\*\//s', '', $sql);
        
        $queries = [];
        $currentQuery = '';
        $inString = false;
        $stringChar = '';
        $delimiter = ';';
        
        for ($i = 0; $i < strlen($sql); $i++) {
            $char = $sql[$i];
            
            if (!$inString) {
                if ($char === '"' || $char === "'") {
                    $inString = true;
                    $stringChar = $char;
                } elseif ($char === $delimiter) {
                    $queries[] = trim($currentQuery);
                    $currentQuery = '';
                    continue;
                }
            } elseif ($char === $stringChar && $sql[$i-1] !== '\\') {
                $inString = false;
            }
            
            $currentQuery .= $char;
        }
        
        if (!empty(trim($currentQuery))) {
            $queries[] = trim($currentQuery);
        }
        
        return array_filter($queries);
    }
    
    /**
     * بررسی صحت نصب
     */
    private function verifyInstallation() {
        try {
            $this->log('بررسی صحت نصب...');
            
            $expectedTables = [
                'ai_user_groups',
                'ai_users', 
                'ai_user_sessions',
                'ai_system_logs',
                'ai_user_settings'
            ];
            
            foreach ($expectedTables as $table) {
                $stmt = $this->db->query("SHOW TABLES LIKE '{$table}'");
                if ($stmt->rowCount() === 0) {
                    throw new Exception("جدول {$table} ایجاد نشده است");
                }
                $this->log("✓ جدول {$table} موجود است");
            }
            
            // بررسی وجود کاربر مدیر
            $stmt = $this->db->query("SELECT COUNT(*) as count FROM ai_users WHERE username = 'admin'");
            $result = $stmt->fetch();
            
            if ($result['count'] > 0) {
                $this->log('✓ کاربر مدیر پیش‌فرض ایجاد شده است');
            } else {
                $this->error('کاربر مدیر پیش‌فرض ایجاد نشده است');
            }
            
            $this->log('✓ بررسی صحت نصب تکمیل شد');
            
        } catch (Exception $e) {
            throw new Exception('خطا در بررسی نصب: ' . $e->getMessage());
        }
    }
    
    /**
     * دریافت اطلاعات نصب
     */
    public function getInstallationInfo() {
        try {
            if (!$this->db) {
                $this->connectToDatabase();
            }
            
            // اطلاعات جداول
            $stmt = $this->db->query("SHOW TABLE STATUS WHERE Name LIKE 'ai_%'");
            $tables = $stmt->fetchAll();
            
            // تعداد کاربران
            $stmt = $this->db->query("SELECT COUNT(*) as count FROM ai_users WHERE deleted_at IS NULL");
            $userCount = $stmt->fetch()['count'];
            
            // تعداد گروه‌های کاربری
            $stmt = $this->db->query("SELECT COUNT(*) as count FROM ai_user_groups");
            $groupCount = $stmt->fetch()['count'];
            
            return [
                'database_name' => DB_NAME,
                'tables' => $tables,
                'user_count' => $userCount,
                'group_count' => $groupCount,
                'mysql_version' => $this->db->getAttribute(PDO::ATTR_SERVER_VERSION)
            ];
            
        } catch (Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
    
    /**
     * ثبت لاگ
     */
    private function log($message) {
        $timestamp = date('Y-m-d H:i:s');
        $logMessage = "[{$timestamp}] {$message}";
        $this->logs[] = $logMessage;
        echo $logMessage . "\n";
    }
    
    /**
     * ثبت خطا
     */
    private function error($message) {
        $timestamp = date('Y-m-d H:i:s');
        $errorMessage = "[{$timestamp}] ERROR: {$message}";
        $this->errors[] = $errorMessage;
        $this->logs[] = $errorMessage;
        echo $errorMessage . "\n";
    }
}

// اجرای نصب در صورت فراخوانی مستقیم
if (basename($_SERVER['PHP_SELF']) === 'install.php') {
    $installer = new DatabaseInstaller();
    $result = $installer->install();
    
    if ($result['success']) {
        echo "\n🎉 نصب با موفقیت تکمیل شد!\n";
        echo "اطلاعات ورود پیش‌فرض:\n";
        echo "نام کاربری: admin\n";
        echo "رمز عبور: admin123\n";
    } else {
        echo "\n❌ نصب ناموفق بود!\n";
        echo "خطاها:\n";
        foreach ($result['errors'] as $error) {
            echo "- {$error}\n";
        }
    }
}

?>