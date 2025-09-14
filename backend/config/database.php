<?php
/**
 * پیکربندی پایگاه داده - Database Configuration
 * @description تنظیمات اتصال به MySQL برای پروژه DataSave
 * @author DataSave Team
 * @version 1.0.0
 */

// تنظیمات پایگاه داده برای XAMPP
define('DB_HOST', '127.0.0.1');
define('DB_PORT', '3307');
define('DB_NAME', 'ai_excell2form');
define('DB_USER', 'root');
define('DB_PASS', 'Mojtab@123');
define('DB_CHARSET', 'utf8mb4');

// تنظیمات عمومی
define('DB_PREFIX', 'ai_');
define('DB_TIMEZONE', 'Asia/Tehran');

/**
 * کلاس مدیریت اتصال به پایگاه داده
 */
class Database {
    private static $instance = null;
    private $connection;
    private $host = DB_HOST;
    private $port = DB_PORT;
    private $dbname = DB_NAME;
    private $username = DB_USER;
    private $password = DB_PASS;
    private $charset = DB_CHARSET;
    
    /**
     * سازنده کلاس - اتصال به پایگاه داده
     */
    private function __construct() {
        try {
            $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->dbname};charset={$this->charset}";
            
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
            ];
            
            $this->connection = new PDO($dsn, $this->username, $this->password, $options);
            
            // تنظیم منطقه زمانی
            $this->connection->exec("SET time_zone = '+03:30'");
            
            $this->logConnection('SUCCESS', 'Database connection established successfully');
            
        } catch (PDOException $e) {
            $this->logConnection('ERROR', 'Database connection failed: ' . $e->getMessage());
            throw new Exception('خطا در اتصال به پایگاه داده: ' . $e->getMessage());
        }
    }
    
    /**
     * دریافت نمونه واحد از کلاس (Singleton Pattern)
     * @return Database
     */
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }
    
    /**
     * دریافت اتصال به پایگاه داده
     * @return PDO
     */
    public function getConnection() {
        return $this->connection;
    }
    
    /**
     * بررسی سلامت اتصال
     * @return bool
     */
    public function isConnected() {
        try {
            return $this->connection->query('SELECT 1')->fetchColumn() == 1;
        } catch (Exception $e) {
            return false;
        }
    }
    
    /**
     * دریافت اطلاعات سرور
     * @return array
     */
    public function getServerInfo() {
        try {
            return [
                'version' => $this->connection->getAttribute(PDO::ATTR_SERVER_VERSION),
                'connection_status' => $this->connection->getAttribute(PDO::ATTR_CONNECTION_STATUS),
                'server_info' => $this->connection->getAttribute(PDO::ATTR_SERVER_INFO),
                'client_version' => $this->connection->getAttribute(PDO::ATTR_CLIENT_VERSION)
            ];
        } catch (Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
    
    /**
     * اجرای کوئری SQL
     * @param string $sql
     * @param array $params
     * @return PDOStatement
     */
    public function query($sql, $params = []) {
        try {
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            $this->logConnection('ERROR', 'Query execution failed: ' . $e->getMessage() . ' SQL: ' . $sql);
            throw new Exception('خطا در اجرای کوئری: ' . $e->getMessage());
        }
    }
    
    /**
     * دریافت آخرین ID وارد شده
     * @return string
     */
    public function getLastInsertId() {
        return $this->connection->lastInsertId();
    }
    
    /**
     * شروع تراکنش
     */
    public function beginTransaction() {
        return $this->connection->beginTransaction();
    }
    
    /**
     * تایید تراکنش
     */
    public function commit() {
        return $this->connection->commit();
    }
    
    /**
     * لغو تراکنش
     */
    public function rollback() {
        return $this->connection->rollback();
    }
    
    /**
     * ثبت لاگ اتصال
     * @param string $level
     * @param string $message
     */
    private function logConnection($level, $message) {
        $timestamp = date('Y-m-d H:i:s');
        $logMessage = "[{$timestamp}] [{$level}] {$message}" . PHP_EOL;
        
        // ثبت در فایل لاگ
        $logFile = __DIR__ . '/../logs/database.log';
        $logDir = dirname($logFile);
        
        // Create log directory if it doesn't exist
        if (!file_exists($logDir)) {
            try {
                mkdir($logDir, 0755, true);
            } catch (Exception $e) {
                // Silently fail if can't create directory
                return;
            }
        }
        
        // Write to log file, suppress errors if permission denied
        @file_put_contents($logFile, $logMessage, FILE_APPEND | LOCK_EX);
    }
    
    /**
     * جلوگیری از کلون کردن
     */
    private function __clone() {}
    
    /**
     * جلوگیری از unserialization
     */
    public function __wakeup() {
        throw new Exception("Cannot unserialize singleton");
    }
}

/**
 * توابع کمکی برای کار با پایگاه داده
 */

/**
 * دریافت اتصال به پایگاه داده
 * @return PDO
 */
function getDB() {
    return Database::getInstance()->getConnection();
}

/**
 * بررسی وجود جدول
 * @param string $tableName
 * @return bool
 */
function tableExists($tableName) {
    try {
        $db = Database::getInstance();
        $sql = "SHOW TABLES LIKE :tableName";
        $stmt = $db->query($sql, ['tableName' => $tableName]);
        return $stmt->rowCount() > 0;
    } catch (Exception $e) {
        return false;
    }
}

/**
 * اجرای فایل SQL
 * @param string $sqlFile
 * @return bool
 */
function executeSQLFile($sqlFile) {
    try {
        if (!file_exists($sqlFile)) {
            throw new Exception("فایل SQL یافت نشد: {$sqlFile}");
        }
        
        $sql = file_get_contents($sqlFile);
        $db = Database::getInstance();
        
        // تقسیم SQL به کوئری‌های جداگانه
        $queries = array_filter(array_map('trim', explode(';', $sql)));
        
        foreach ($queries as $query) {
            if (!empty($query)) {
                $db->query($query);
            }
        }
        
        return true;
    } catch (Exception $e) {
        error_log("خطا در اجرای فایل SQL: " . $e->getMessage());
        return false;
    }
}

?>