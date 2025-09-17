<?php
/**
 * سیستم ردیابی فایل‌های Excel (XLS Tracking System)
 * 
 * این فایل مسئول مدیریت و ردیابی فایل‌های Excel آپلود شده است
 * شامل قابلیت‌های:
 * - تشخیص فایل‌های تکراری با استفاده از SHA-256 hash
 * - ذخیره اطلاعات ساختار فایل‌ها
 * - لاگ کردن عملیات پردازش
 * - مدیریت تاریخچه پردازش
 * 
 * @author DataSave Development Team
 * @version 1.0.0
 * @since 2025-09-15
 */

// تنظیمات نمایش خطا برای مرحله توسعه
error_reporting(E_ALL);
ini_set('display_errors', 1);

// تنظیم هدرهای HTTP برای پاسخ JSON و CORS
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// مدیریت درخواست‌های OPTIONS برای CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// بارگذاری تنظیمات دیتابیس
require_once __DIR__ . '/../../config/database.php';

try {
    // لاگ اطلاعات درخواست ورودی برای دیباگ و نظارت
    error_log("XLS-Tracking Request: " . json_encode([
        'action' => $_GET['action'] ?? $_POST['action'] ?? 'no_action',
        'method' => $_SERVER['REQUEST_METHOD'],
        'get_data' => $_GET,
        'post_data' => $_POST
    ]));
    
    // ایجاد اتصال به دیتابیس با تنظیمات UTF-8 و مدیریت خطا
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET,
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,           // فعال‌سازی exception ها
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,      // حالت پیش‌فرض fetch
            PDO::ATTR_EMULATE_PREPARES => false,                   // غیرفعال کردن emulation
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        ]
    );
    
    // ایجاد جداول مورد نیاز اگر وجود ندارند
    createTablesIfNotExist($pdo);
    
    // دریافت action از GET یا POST parameters
    $action = $_GET['action'] ?? $_POST['action'] ?? '';
    
    // بررسی وجود action
    if (empty($action)) {
        throw new Exception('هیچ عملیاتی مشخص نشده است (action parameter required)');
    }
    
    // مسیریابی درخواست‌ها بر اساس action
    // مسیریابی درخواست‌ها بر اساس action
    switch ($action) {
        case 'check_file_exists':
            // بررسی وجود فایل بر اساس hash و ساختار ستون‌ها
            checkFileExists($pdo);
            break;
            
        case 'register_file':
            // ثبت اطلاعات فایل جدید در سیستم
            registerFile($pdo);
            break;
            
        case 'get_file_info':
            // دریافت اطلاعات تفصیلی فایل
            getFileInfo($pdo);
            break;
            
        case 'update_processing_status':
            // به‌روزرسانی وضعیت پردازش فایل
            updateProcessingStatus($pdo);
            break;
            
        case 'log_operation':
            // ثبت لاگ عملیات انجام شده
            logOperation($pdo);
            break;
            
        case 'get_processing_history':
            // دریافت تاریخچه پردازش فایل‌ها
            getProcessingHistory($pdo);
            break;
            
        default:
            // action نامعتبر
            throw new Exception('عملیات نامعتبر: ' . $action);
    }
    
    
} catch (Exception $e) {
    // مدیریت خطاها و ارسال پاسخ JSON با اطلاعات کامل خطا
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => $e->getTraceAsString(),
        'request_data' => [
            'GET' => $_GET,
            'POST' => $_POST
        ]
    ], JSON_UNESCAPED_UNICODE);
}

/**
 * ایجاد جداول مورد نیاز اگر وجود ندارند
 * 
 * این تابع دو جدول اصلی سیستم را ایجاد می‌کند:
 * 1. xls2tbl_00data: جدول اصلی ردیابی فایل‌ها
 * 2. xls2tbl_00logs: جدول لاگ عملیات
 * 
 * @param PDO $pdo اتصال دیتابیس
 */
function createTablesIfNotExist($pdo) {
    // ایجاد جدول اصلی ردیابی فایل‌های Excel
    $sql1 = "CREATE TABLE IF NOT EXISTS xls2tbl_00data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        table_name VARCHAR(100) NOT NULL UNIQUE COMMENT 'نام جدول ایجاد شده',
        file_name VARCHAR(255) NOT NULL COMMENT 'نام فایل اصلی',
        file_hash VARCHAR(64) NOT NULL COMMENT 'هش فایل برای تشخیص تغییرات',
        data_type ENUM('create_table', 'update_data') NOT NULL DEFAULT 'create_table' COMMENT 'نوع عملیات',
        columns_number INT NOT NULL COMMENT 'تعداد ستون‌ها',
        columns_data TEXT NOT NULL COMMENT 'نام تمامی ستون‌های فایل اصلی',
        unique_field VARCHAR(100) NULL COMMENT 'نام فیلد منحصر به فرد برای آپدیت',
        total_records INT DEFAULT 0 COMMENT 'تعداد کل رکوردها',
        processed_records INT DEFAULT 0 COMMENT 'تعداد رکوردهای پردازش شده',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_table_name (table_name),
        INDEX idx_file_hash (file_hash),
        INDEX idx_file_name (file_name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول ردیابی فایل‌های Excel پردازش شده'";
    
    // اجرای کوئری ایجاد جدول اصلی
    $pdo->exec($sql1);
    
    // ایجاد جدول لاگ عملیات برای ردیابی تاریخچه پردازش
    $sql2 = "CREATE TABLE IF NOT EXISTS xls2tbl_00logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        xls_data_id INT NOT NULL,
        operation_type ENUM('create', 'insert', 'update', 'delete') NOT NULL,
        affected_records INT DEFAULT 0,
        success_count INT DEFAULT 0,
        error_count INT DEFAULT 0,
        error_details TEXT NULL,
        processing_time DECIMAL(8,3) NULL COMMENT 'زمان پردازش به ثانیه',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_xls_data_id (xls_data_id),
        INDEX idx_operation_type (operation_type),
        INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='لاگ عملیات پردازش فایل‌ها'";
    
    // اجرای کوئری ایجاد جدول لاگ
    $pdo->exec($sql2);
}

/**
 * بررسی وجود فایل و تعیین نوع عملیات مورد نیاز
 * 
 * این تابع بر اساس hash فایل بررسی می‌کند که آیا فایل قبلاً پردازش شده یا خیر
 * و در صورت وجود، ساختار ستون‌ها را مقایسه می‌کند
 * 
 * خروجی‌های ممکن:
 * - create_table: فایل جدید است و باید جدول جدید ایجاد شود
 * - update_data: فایل موجود و ساختار یکسان - داده‌ها به‌روزرسانی شوند
 * - structure_changed: فایل موجود اما ساختار تغییر کرده
 * 
 * @param PDO $pdo اتصال دیتابیس
 */
function checkFileExists($pdo) {
    // دریافت پارامترهای ورودی
    $file_hash = $_POST['file_hash'] ?? '';
    $columns_data = $_POST['columns_data'] ?? '';
    
    // اعتبارسنجی پارامترهای اجباری
    if (empty($file_hash)) {
        throw new Exception('هش فایل ارسال نشده است');
    }
    
    if (empty($columns_data)) {
        throw new Exception('اطلاعات ستون‌های فایل ارسال نشده است');
    }
    
    // جستجو در دیتابیس بر اساس هش فایل
    $stmt = $pdo->prepare("SELECT * FROM xls2tbl_00data WHERE file_hash = ?");
    $stmt->execute([$file_hash]);
    $existing_file = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($existing_file) {
        // فایل موجود است - بررسی تطابق ساختار ستون‌ها
        if ($existing_file['columns_data'] === $columns_data) {
            // ساختار یکسان - امکان به‌روزرسانی داده‌ها
            echo json_encode([
                'success' => true,
                'exists' => true,
                'action' => 'update_data',
                'table_name' => $existing_file['table_name'],
                'unique_field' => $existing_file['unique_field'],
                'file_info' => $existing_file
            ], JSON_UNESCAPED_UNICODE);
        } else {
            // ساختار تغییر کرده - نیاز به تصمیم کاربر
            echo json_encode([
                'success' => true,
                'exists' => true,
                'action' => 'structure_changed',
                'message' => 'ساختار فایل تغییر کرده است. آیا می‌خواهید جدول جدید ایجاد شود؟'
            ], JSON_UNESCAPED_UNICODE);
        }
    } else {
        // فایل جدید - ایجاد جدول جدید
        echo json_encode([
            'success' => true,
            'exists' => false,
            'action' => 'create_table'
        ], JSON_UNESCAPED_UNICODE);
    }
}

/**
 * ثبت اطلاعات فایل جدید در سیستم
 * 
 * این تابع اطلاعات کاملی از فایل پردازش شده را در دیتابیس ذخیره می‌کند
 * شامل نام جدول، نام فایل، هش، تعداد ستون‌ها و سایر metadata
 * 
 * @param PDO $pdo اتصال دیتابیس
 */
function registerFile($pdo) {
    // دریافت و اعتبارسنجی پارامترهای ورودی
    $table_name = $_POST['table_name'] ?? '';
    $file_name = $_POST['file_name'] ?? '';
    $file_hash = $_POST['file_hash'] ?? '';
    $data_type = $_POST['data_type'] ?? 'create_table';
    $columns_number = intval($_POST['columns_number'] ?? 0);
    $columns_data = $_POST['columns_data'] ?? '';
    $unique_field = $_POST['unique_field'] ?? null;
    $total_records = intval($_POST['total_records'] ?? 0);
    
    // بررسی وجود فیلدهای اجباری
    if (empty($table_name) || empty($file_name) || empty($file_hash) || empty($columns_data)) {
        throw new Exception('فیلدهای اجباری ارسال نشده');
    }
    
    // آماده‌سازی و اجرای کوئری INSERT
    $stmt = $pdo->prepare("
        INSERT INTO xls2tbl_00data 
        (table_name, file_name, file_hash, data_type, columns_number, columns_data, unique_field, total_records) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $result = $stmt->execute([
        $table_name, $file_name, $file_hash, $data_type, 
        $columns_number, $columns_data, $unique_field, $total_records
    ]);
    
    if ($result) {
        // دریافت ID رکورد ایجاد شده و ارسال پاسخ موفقیت
        $file_id = $pdo->lastInsertId();
        echo json_encode([
            'success' => true,
            'file_id' => $file_id,
            'message' => 'فایل با موفقیت ثبت شد'
        ], JSON_UNESCAPED_UNICODE);
    } else {
        throw new Exception('خطا در ثبت فایل');
    }
}

/**
 * دریافت اطلاعات تفصیلی فایل
 * 
 * این تابع اطلاعات کامل یک فایل را بر اساس hash یا نام جدول بازگردانی می‌کند
 * 
 * @param PDO $pdo اتصال دیتابیس
 */
function getFileInfo($pdo) {
    // دریافت پارامترهای جستجو
    $file_hash = $_GET['file_hash'] ?? '';
    $table_name = $_GET['table_name'] ?? '';
    
    // بررسی وجود حداقل یکی از پارامترهای جستجو
    if (empty($file_hash) && empty($table_name)) {
        throw new Exception('حداقل یکی از پارامترهای file_hash یا table_name ارسال شود');
    }
    
    // انتخاب نوع جستجو بر اساس پارامتر موجود
    if (!empty($file_hash)) {
        // جستجو بر اساس hash فایل
        $stmt = $pdo->prepare("SELECT * FROM xls2tbl_00data WHERE file_hash = ?");
        $stmt->execute([$file_hash]);
    } else {
        // جستجو بر اساس نام جدول
        $stmt = $pdo->prepare("SELECT * FROM xls2tbl_00data WHERE table_name = ?");
        $stmt->execute([$table_name]);
    }
    
    $file_info = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($file_info) {
        // فایل یافت شد - ارسال اطلاعات
        echo json_encode([
            'success' => true,
            'file_info' => $file_info
        ], JSON_UNESCAPED_UNICODE);
    } else {
        // فایل یافت نشد
        echo json_encode([
            'success' => false,
            'message' => 'فایل یافت نشد'
        ], JSON_UNESCAPED_UNICODE);
    }
}

/**
 * به‌روزرسانی وضعیت پردازش فایل
 * 
 * این تابع امکان به‌روزرسانی پیشرفت پردازش یک فایل را فراهم می‌کند
 * شامل تعداد رکوردهای پردازش شده و نوع عملیات
 * 
 * @param PDO $pdo اتصال دیتابیس
 */
function updateProcessingStatus($pdo) {
    // دریافت پارامترهای ورودی
    $file_id = intval($_POST['file_id'] ?? 0);
    $processed_records = intval($_POST['processed_records'] ?? 0);
    $data_type = $_POST['data_type'] ?? '';
    
    // اعتبارسنجی شناسه فایل
    if ($file_id <= 0) {
        throw new Exception('شناسه فایل نامعتبر');
    }
    
    // آماده‌سازی فیلدهای قابل به‌روزرسانی
    $update_fields = [];
    $params = [];
    
    if ($processed_records > 0) {
        $update_fields[] = "processed_records = ?";
        $params[] = $processed_records;
    }
    
    if (!empty($data_type)) {
        $update_fields[] = "data_type = ?";
        $params[] = $data_type;
    }
    
    // اضافه کردن timestamp به‌روزرسانی
    $update_fields[] = "updated_at = CURRENT_TIMESTAMP";
    $params[] = $file_id;
    
    // ساخت و اجرای کوئری UPDATE
    $sql = "UPDATE xls2tbl_00data SET " . implode(', ', $update_fields) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    
    if ($stmt->execute($params)) {
        echo json_encode([
            'success' => true,
            'message' => 'وضعیت پردازش به‌روزرسانی شد'
        ], JSON_UNESCAPED_UNICODE);
    } else {
        throw new Exception('خطا در به‌روزرسانی وضعیت');
    }
}

/**
 * ثبت لاگ عملیات انجام شده
 * 
 * این تابع جزئیات کامل عملیات انجام شده روی یک فایل را ثبت می‌کند
 * شامل نوع عملیات، تعداد رکوردهای تحت تأثیر، خطاها و زمان پردازش
 * 
 * @param PDO $pdo اتصال دیتابیس
 */
function logOperation($pdo) {
    // دریافت پارامترهای ورودی
    $xls_data_id = intval($_POST['xls_data_id'] ?? 0);
    $operation_type = $_POST['operation_type'] ?? '';
    $affected_records = intval($_POST['affected_records'] ?? 0);
    $success_count = intval($_POST['success_count'] ?? 0);
    $error_count = intval($_POST['error_count'] ?? 0);
    $error_details = $_POST['error_details'] ?? null;
    $processing_time = floatval($_POST['processing_time'] ?? 0);
    
    // اعتبارسنجی فیلدهای اجباری
    if ($xls_data_id <= 0 || empty($operation_type)) {
        throw new Exception('فیلدهای اجباری ارسال نشده');
    }
    
    // آماده‌سازی و اجرای کوئری INSERT برای ثبت لاگ
    $stmt = $pdo->prepare("
        INSERT INTO xls2tbl_00logs 
        (xls_data_id, operation_type, affected_records, success_count, error_count, error_details, processing_time) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    
    if ($stmt->execute([$xls_data_id, $operation_type, $affected_records, $success_count, $error_count, $error_details, $processing_time])) {
        echo json_encode([
            'success' => true,
            'message' => 'لاگ عملیات ثبت شد'
        ], JSON_UNESCAPED_UNICODE);
    } else {
        throw new Exception('خطا در ثبت لاگ');
    }
}

/**
 * دریافت تاریخچه پردازش فایل‌ها
 * 
 * این تابع لیست کاملی از فایل‌های پردازش شده و لاگ عملیات آن‌ها را برمی‌گرداند
 * امکان فیلتر بر اساس نام جدول و محدود کردن تعداد نتایج وجود دارد
 * 
 * @param PDO $pdo اتصال دیتابیس
 */
function getProcessingHistory($pdo) {
    // دریافت پارامترهای اختیاری
    $table_name = $_GET['table_name'] ?? '';
    $limit = intval($_GET['limit'] ?? 50);
    
    if (!empty($table_name)) {
        // جستجو برای یک جدول خاص
        $stmt = $pdo->prepare("
            SELECT d.*, l.operation_type, l.affected_records, l.success_count, l.error_count, l.processing_time, l.created_at as log_date
            FROM xls2tbl_00data d
            LEFT JOIN xls2tbl_00logs l ON d.id = l.xls_data_id
            WHERE d.table_name = ?
            ORDER BY l.created_at DESC
            LIMIT ?
        ");
        $stmt->execute([$table_name, $limit]);
    } else {
        // جستجو در تمام فایل‌ها
        $stmt = $pdo->prepare("
            SELECT d.*, l.operation_type, l.affected_records, l.success_count, l.error_count, l.processing_time, l.created_at as log_date
            FROM xls2tbl_00data d
            LEFT JOIN xls2tbl_00logs l ON d.id = l.xls_data_id
            ORDER BY d.updated_at DESC, l.created_at DESC
            LIMIT ?
        ");
        $stmt->execute([$limit]);
    }
    
    // دریافت نتایج و ارسال پاسخ
    $history = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'history' => $history
    ], JSON_UNESCAPED_UNICODE);
}
?>