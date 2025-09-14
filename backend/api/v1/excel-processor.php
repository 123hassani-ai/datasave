<?php
/**
 * Excel Processor API
 * پردازشگر فایل‌های Excel - تحلیل و استخراج داده‌ها
 * 
 * @description این API برای پردازش، تحلیل و استخراج داده‌ها از فایل‌های Excel استفاده می‌شود
 * @author DataSave Team
 * @version 2.0.0
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// شروع session برای ذخیره داده‌های موقت
session_start();

// اتصال به پایگاه داده و کلاس‌های مورد نیاز
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/User.php';

// بررسی نصب PhpSpreadsheet
if (!class_exists('PhpOffice\PhpSpreadsheet\IOFactory')) {
    // تلاش برای بارگذاری از vendor (اگر composer نصب شده باشد)
    if (file_exists(__DIR__ . '/../../vendor/autoload.php')) {
        require_once __DIR__ . '/../../vendor/autoload.php';
    } else {
        // اگر PhpSpreadsheet موجود نیست، از SimpleXLSX استفاده می‌کنیم
        require_once __DIR__ . '/../../libraries/SimpleXLSX.php';
    }
}

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class ExcelProcessor {
    private $db;
    private $uploadDir;
    private $maxFileSize;
    private $allowedExtensions;
    
    public function __construct() {
        $this->db = Database::getInstance();
        $this->uploadDir = __DIR__ . '/../../uploads/excel/';
        $this->maxFileSize = 50 * 1024 * 1024; // 50MB
        $this->allowedExtensions = ['xlsx', 'xls'];
        
        // ایجاد پوشه uploads در صورت عدم وجود
        if (!is_dir($this->uploadDir)) {
            mkdir($this->uploadDir, 0755, true);
        }
    }
    
    /**
     * تحلیل اولیه فایل Excel
     */
    public function analyzeFile() {
        try {
            if (!isset($_FILES['excel_file'])) {
                throw new Exception('فایل Excel انتخاب نشده است');
            }
            
            $file = $_FILES['excel_file'];
            
            // اعتبارسنجی فایل
            $this->validateFile($file);
            
            // آپلود فایل
            $uploadedPath = $this->uploadFile($file);
            
            // تحلیل ساختار فایل
            $analysis = $this->performFileAnalysis($uploadedPath);
            
            // ذخیره اطلاعات در session
            $_SESSION['excel_analysis'] = $analysis;
            $_SESSION['excel_file_path'] = $uploadedPath;
            
            return [
                'success' => true,
                'message' => 'فایل با موفقیت تحلیل شد',
                'data' => $analysis
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'خطا در تحلیل فایل: ' . $e->getMessage(),
                'error_code' => 'ANALYSIS_ERROR'
            ];
        }
    }
    
    /**
     * تحلیل تفصیلی محتوای فایل
     */
    public function detailedAnalysis() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($_SESSION['excel_file_path'])) {
                throw new Exception('فایل برای تحلیل یافت نشد');
            }
            
            $filePath = $_SESSION['excel_file_path'];
            $detailedAnalysis = $this->performDetailedAnalysis($filePath);
            
            // ذخیره در session
            $_SESSION['excel_detailed_analysis'] = $detailedAnalysis;
            
            return [
                'success' => true,
                'message' => 'تحلیل تفصیلی کامل شد',
                'data' => $detailedAnalysis
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'خطا در تحلیل تفصیلی: ' . $e->getMessage(),
                'error_code' => 'DETAILED_ANALYSIS_ERROR'
            ];
        }
    }
    
    /**
     * تولید schema پایگاه داده
     */
    public function generateSchema() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($_SESSION['excel_analysis'])) {
                throw new Exception('تحلیل اولیه فایل یافت نشد');
            }
            
            $analysis = $_SESSION['excel_analysis'];
            $aiSuggestions = $input['ai_suggestions'] ?? [];
            
            $schema = $this->createDatabaseSchema($analysis, $aiSuggestions);
            
            // ذخیره schema در session
            $_SESSION['database_schema'] = $schema;
            
            return [
                'success' => true,
                'message' => 'Schema پایگاه داده تولید شد',
                'data' => $schema
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'خطا در تولید schema: ' . $e->getMessage(),
                'error_code' => 'SCHEMA_GENERATION_ERROR'
            ];
        }
    }
    
    /**
     * ایجاد پایگاه داده و جدول
     */
    public function createDatabase() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($_SESSION['database_schema'])) {
                throw new Exception('Schema پایگاه داده یافت نشد');
            }
            
            $schema = $_SESSION['database_schema'];
            $sqlQuery = $input['sql_query'] ?? $schema['create_table_sql'];
            
            // اجرای کوئری ایجاد جدول
            $result = $this->executeDatabaseCreation($sqlQuery, $schema);
            
            return [
                'success' => true,
                'message' => 'پایگاه داده با موفقیت ایجاد شد',
                'data' => $result
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'خطا در ایجاد پایگاه داده: ' . $e->getMessage(),
                'error_code' => 'DATABASE_CREATION_ERROR'
            ];
        }
    }
    
    /**
     * وارد کردن داده‌ها به پایگاه داده
     */
    public function importData() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($_SESSION['excel_file_path']) || !isset($_SESSION['database_schema'])) {
                throw new Exception('اطلاعات لازم برای import یافت نشد');
            }
            
            $filePath = $_SESSION['excel_file_path'];
            $schema = $_SESSION['database_schema'];
            $options = $input['options'] ?? [];
            
            $result = $this->performDataImport($filePath, $schema, $options);
            
            return [
                'success' => true,
                'message' => 'داده‌ها با موفقیت وارد شدند',
                'data' => $result
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'خطا در وارد کردن داده‌ها: ' . $e->getMessage(),
                'error_code' => 'DATA_IMPORT_ERROR'
            ];
        }
    }
    
    /**
     * دریافت وضعیت import (برای progress bar)
     */
    public function getImportStatus() {
        try {
            $status = $_SESSION['import_status'] ?? [
                'total_rows' => 0,
                'processed_rows' => 0,
                'success_rows' => 0,
                'failed_rows' => 0,
                'progress_percentage' => 0,
                'status' => 'pending',
                'start_time' => null,
                'estimated_time' => null
            ];
            
            return [
                'success' => true,
                'data' => $status
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'خطا در دریافت وضعیت: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * اعتبارسنجی فایل آپلود شده
     */
    private function validateFile($file) {
        // بررسی خطاهای آپلود
        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('خطا در آپلود فایل: ' . $this->getUploadErrorMessage($file['error']));
        }
        
        // بررسی اندازه فایل
        if ($file['size'] > $this->maxFileSize) {
            throw new Exception('حجم فایل بیش از حد مجاز است (حداکثر 50MB)');
        }
        
        // بررسی نوع فایل
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($extension, $this->allowedExtensions)) {
            throw new Exception('فرمت فایل پشتیبانی نمی‌شود. فقط فایل‌های .xlsx و .xls مجاز هستند');
        }
        
        // بررسی MIME type
        $allowedMimes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ];
        
        if (!in_array($file['type'], $allowedMimes)) {
            // بررسی اضافی با finfo
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mimeType = finfo_file($finfo, $file['tmp_name']);
            finfo_close($finfo);
            
            if (!in_array($mimeType, $allowedMimes)) {
                throw new Exception('نوع فایل معتبر نیست');
            }
        }
    }
    
    /**
     * آپلود فایل به سرور
     */
    private function uploadFile($file) {
        $filename = uniqid('excel_') . '_' . time() . '.' . pathinfo($file['name'], PATHINFO_EXTENSION);
        $uploadPath = $this->uploadDir . $filename;
        
        if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
            throw new Exception('خطا در ذخیره فایل');
        }
        
        return $uploadPath;
    }
    
    /**
     * تحلیل ساختار فایل Excel
     */
    private function performFileAnalysis($filePath) {
        try {
            // بارگذاری فایل Excel
            if (class_exists('PhpOffice\PhpSpreadsheet\IOFactory')) {
                $spreadsheet = IOFactory::load($filePath);
                return $this->analyzeWithPhpSpreadsheet($spreadsheet);
            } else {
                // استفاده از SimpleXLSX در صورت عدم وجود PhpSpreadsheet
                return $this->analyzeWithSimpleXLSX($filePath);
            }
            
        } catch (Exception $e) {
            throw new Exception('خطا در خواندن فایل Excel: ' . $e->getMessage());
        }
    }
    
    /**
     * تحلیل فایل با PhpSpreadsheet
     */
    private function analyzeWithPhpSpreadsheet($spreadsheet) {
        $analysis = [
            'filename' => basename($_FILES['excel_file']['name']),
            'file_size' => $_FILES['excel_file']['size'],
            'sheets' => $spreadsheet->getSheetCount(),
            'primary_sheet' => '',
            'total_rows' => 0,
            'total_columns' => 0,
            'columns' => [],
            'sample_data' => [],
            'data_types' => []
        ];
        
        // تحلیل شیت اصلی (اولین شیت)
        $worksheet = $spreadsheet->getActiveSheet();
        $analysis['primary_sheet'] = $worksheet->getTitle();
        
        // دریافت محدوده داده‌ها
        $highestRow = $worksheet->getHighestRow();
        $highestColumn = $worksheet->getHighestColumn();
        $highestColumnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($highestColumn);
        
        $analysis['total_rows'] = $highestRow;
        $analysis['total_columns'] = $highestColumnIndex;
        
        // تحلیل ستون‌ها (سطر اول به عنوان header)
        for ($col = 1; $col <= $highestColumnIndex; $col++) {
            $columnLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($col);
            $headerCell = $worksheet->getCell($columnLetter . '1');
            $headerValue = $headerCell->getCalculatedValue();
            
            // تحلیل نوع داده در ستون
            $dataType = $this->analyzeColumnDataType($worksheet, $col, $highestRow);
            
            // نمونه داده
            $sampleData = [];
            for ($row = 2; $row <= min(6, $highestRow); $row++) {
                $cellValue = $worksheet->getCell($columnLetter . $row)->getCalculatedValue();
                if (!empty($cellValue)) {
                    $sampleData[] = $cellValue;
                }
            }
            
            $analysis['columns'][] = [
                'index' => $col,
                'letter' => $columnLetter,
                'name' => $headerValue ?: "ستون_$col",
                'type' => $dataType,
                'sample' => implode(', ', array_slice($sampleData, 0, 3)),
                'sample_data' => $sampleData
            ];
        }
        
        // نمونه داده‌های کامل (5 سطر اول)
        for ($row = 1; $row <= min(6, $highestRow); $row++) {
            $rowData = [];
            for ($col = 1; $col <= $highestColumnIndex; $col++) {
                $columnLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($col);
                $cellValue = $worksheet->getCell($columnLetter . $row)->getCalculatedValue();
                $rowData[] = $cellValue;
            }
            $analysis['sample_data'][] = $rowData;
        }
        
        return $analysis;
    }
    
    /**
     * تحلیل نوع داده ستون
     */
    private function analyzeColumnDataType($worksheet, $columnIndex, $maxRow) {
        $sampleSize = min(50, $maxRow - 1); // نمونه‌گیری از 50 سطر
        $types = [];
        
        $columnLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($columnIndex);
        
        for ($row = 2; $row <= min($sampleSize + 1, $maxRow); $row++) {
            $cell = $worksheet->getCell($columnLetter . $row);
            $value = $cell->getCalculatedValue();
            
            if (empty($value)) continue;
            
            // تشخیص نوع داده
            if (is_numeric($value)) {
                if (is_int($value) || (is_float($value) && floor($value) == $value)) {
                    $types['integer'] = ($types['integer'] ?? 0) + 1;
                } else {
                    $types['decimal'] = ($types['decimal'] ?? 0) + 1;
                }
            } elseif (Date::isDateTime($cell)) {
                $types['date'] = ($types['date'] ?? 0) + 1;
            } elseif (is_bool($value)) {
                $types['boolean'] = ($types['boolean'] ?? 0) + 1;
            } else {
                $types['text'] = ($types['text'] ?? 0) + 1;
            }
        }
        
        // تشخیص نوع غالب
        if (empty($types)) return 'text';
        
        arsort($types);
        $dominantType = array_key_first($types);
        
        // تبدیل به نوع MySQL
        switch ($dominantType) {
            case 'integer':
                return 'int';
            case 'decimal':
                return 'decimal';
            case 'date':
                return 'datetime';
            case 'boolean':
                return 'boolean';
            default:
                return 'varchar';
        }
    }
    
    /**
     * تحلیل تفصیلی داده‌ها
     */
    private function performDetailedAnalysis($filePath) {
        $analysis = $_SESSION['excel_analysis'];
        
        $detailedAnalysis = [
            'total_records' => $analysis['total_rows'] - 1, // حذف header
            'valid_records' => 0,
            'empty_records' => 0,
            'duplicate_records' => 0,
            'data_quality_issues' => [],
            'insights' => [],
            'recommendations' => []
        ];
        
        try {
            if (class_exists('PhpOffice\PhpSpreadsheet\IOFactory')) {
                $spreadsheet = IOFactory::load($filePath);
                $worksheet = $spreadsheet->getActiveSheet();
                
                $highestRow = $worksheet->getHighestRow();
                $highestColumnIndex = count($analysis['columns']);
                
                $duplicateCheck = [];
                $emptyRows = 0;
                $validRows = 0;
                
                // بررسی کیفیت داده‌ها
                for ($row = 2; $row <= $highestRow; $row++) {
                    $rowData = [];
                    $isEmpty = true;
                    
                    for ($col = 1; $col <= $highestColumnIndex; $col++) {
                        $columnLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($col);
                        $cellValue = $worksheet->getCell($columnLetter . $row)->getCalculatedValue();
                        $rowData[] = $cellValue;
                        
                        if (!empty($cellValue)) {
                            $isEmpty = false;
                        }
                    }
                    
                    if ($isEmpty) {
                        $emptyRows++;
                    } else {
                        $validRows++;
                        
                        // بررسی تکرار
                        $rowHash = md5(serialize($rowData));
                        if (isset($duplicateCheck[$rowHash])) {
                            $detailedAnalysis['duplicate_records']++;
                        } else {
                            $duplicateCheck[$rowHash] = true;
                        }
                    }
                }
                
                $detailedAnalysis['valid_records'] = $validRows;
                $detailedAnalysis['empty_records'] = $emptyRows;
                
                // تولید insights
                $detailedAnalysis['insights'] = $this->generateInsights($analysis, $detailedAnalysis);
                $detailedAnalysis['recommendations'] = $this->generateRecommendations($analysis, $detailedAnalysis);
            }
            
        } catch (Exception $e) {
            error_log("Error in detailed analysis: " . $e->getMessage());
        }
        
        return $detailedAnalysis;
    }
    
    /**
     * تولید بینش‌ها
     */
    private function generateInsights($analysis, $detailedAnalysis) {
        $insights = [];
        
        $totalRecords = $detailedAnalysis['total_records'];
        $validRecords = $detailedAnalysis['valid_records'];
        $emptyRecords = $detailedAnalysis['empty_records'];
        $duplicateRecords = $detailedAnalysis['duplicate_records'];
        
        // کیفیت داده‌ها
        $qualityPercentage = $totalRecords > 0 ? ($validRecords / $totalRecords) * 100 : 0;
        if ($qualityPercentage > 90) {
            $insights[] = "کیفیت داده‌ها عالی است ({$qualityPercentage}% داده‌های معتبر)";
        } elseif ($qualityPercentage > 70) {
            $insights[] = "کیفیت داده‌ها خوب است ({$qualityPercentage}% داده‌های معتبر)";
        } else {
            $insights[] = "کیفیت داده‌ها نیاز به بهبود دارد ({$qualityPercentage}% داده‌های معتبر)";
        }
        
        // سطرهای خالی
        if ($emptyRecords > 0) {
            $insights[] = "{$emptyRecords} سطر خالی شناسایی شد که باید حذف شوند";
        }
        
        // تکرارها
        if ($duplicateRecords > 0) {
            $insights[] = "{$duplicateRecords} سطر تکراری شناسایی شد";
        } else {
            $insights[] = "هیچ داده تکراری شناسایی نشد";
        }
        
        // تحلیل ستون‌ها
        $textColumns = array_filter($analysis['columns'], function($col) {
            return $col['type'] === 'varchar';
        });
        
        $numericColumns = array_filter($analysis['columns'], function($col) {
            return in_array($col['type'], ['int', 'decimal']);
        });
        
        if (count($numericColumns) > 0) {
            $insights[] = count($numericColumns) . " ستون عددی برای محاسبات و تحلیل آماری مناسب است";
        }
        
        return $insights;
    }
    
    /**
     * تولید توصیه‌ها
     */
    private function generateRecommendations($analysis, $detailedAnalysis) {
        $recommendations = [];
        
        // توصیه‌های کیفیت داده
        if ($detailedAnalysis['empty_records'] > 0) {
            $recommendations[] = "حذف سطرهای خالی قبل از import برای بهبود کارایی";
        }
        
        if ($detailedAnalysis['duplicate_records'] > 0) {
            $recommendations[] = "حذف یا ترکیب سطرهای تکراری برای جلوگیری از مشکلات داده‌ای";
        }
        
        // توصیه‌های ساختار جدول
        $longTextColumns = array_filter($analysis['columns'], function($col) {
            return $col['type'] === 'varchar' && strlen($col['sample']) > 100;
        });
        
        if (count($longTextColumns) > 0) {
            $recommendations[] = "استفاده از TEXT برای ستون‌های با محتوای طولانی";
        }
        
        // توصیه کلید اصلی
        $potentialPrimaryKeys = array_filter($analysis['columns'], function($col) {
            return $col['type'] === 'int' && strpos(strtolower($col['name']), 'id') !== false;
        });
        
        if (count($potentialPrimaryKeys) > 0) {
            $recommendations[] = "استفاده از ستون '{$potentialPrimaryKeys[0]['name']}' به عنوان کلید اصلی";
        } else {
            $recommendations[] = "اضافه کردن ستون ID به عنوان کلید اصلی خودکار";
        }
        
        return $recommendations;
    }
    
    /**
     * ایجاد schema پایگاه داده
     */
    private function createDatabaseSchema($analysis, $aiSuggestions = []) {
        $tableName = $aiSuggestions['table_name'] ?? $this->generateTableName($analysis['filename']);
        $databaseName = $aiSuggestions['database_name'] ?? $this->generateDatabaseName($analysis['filename']);
        
        $schema = [
            'database_name' => $databaseName,
            'table_name' => $tableName,
            'columns' => [],
            'primary_key' => 'id',
            'indexes' => [],
            'create_table_sql' => ''
        ];
        
        // اضافه کردن ستون ID خودکار
        $schema['columns'][] = [
            'name' => 'id',
            'type' => 'INT',
            'length' => 11,
            'nullable' => false,
            'auto_increment' => true,
            'primary_key' => true,
            'comment' => 'شناسه یکتا'
        ];
        
        // تبدیل ستون‌های Excel به فیلدهای پایگاه داده
        foreach ($analysis['columns'] as $column) {
            $fieldName = $this->sanitizeFieldName($column['name']);
            $fieldType = $this->convertToMySQLType($column['type'], $column['sample_data'] ?? []);
            
            $schema['columns'][] = [
                'name' => $fieldName,
                'type' => $fieldType['type'],
                'length' => $fieldType['length'],
                'nullable' => true,
                'default' => $fieldType['default'],
                'comment' => $column['name'],
                'original_name' => $column['name']
            ];
        }
        
        // تولید کوئری CREATE TABLE
        $schema['create_table_sql'] = $this->generateCreateTableSQL($schema);
        
        return $schema;
    }
    
    /**
     * تولید نام جدول از نام فایل
     */
    private function generateTableName($filename) {
        $name = pathinfo($filename, PATHINFO_FILENAME);
        $name = preg_replace('/[^a-zA-Z0-9_\u0600-\u06FF]/', '_', $name);
        $name = preg_replace('/_+/', '_', $name);
        $name = trim($name, '_');
        
        if (empty($name)) {
            $name = 'imported_data';
        }
        
        return strtolower($name);
    }
    
    /**
     * تولید نام پایگاه داده
     */
    private function generateDatabaseName($filename) {
        $name = $this->generateTableName($filename);
        return 'db_' . $name . '_' . date('Y');
    }
    
    /**
     * پاکسازی نام فیلد برای MySQL
     */
    private function sanitizeFieldName($name) {
        // تبدیل فارسی به انگلیسی
        $persianToEnglish = [
            'نام' => 'name',
            'نام خانوادگی' => 'family_name',
            'شماره' => 'number',
            'تلفن' => 'phone',
            'موبایل' => 'mobile',
            'آدرس' => 'address',
            'تاریخ' => 'date',
            'مبلغ' => 'amount',
            'قیمت' => 'price',
            'تعداد' => 'quantity',
            'توضیحات' => 'description'
        ];
        
        $name = trim($name);
        
        // جایگزینی کلمات فارسی
        foreach ($persianToEnglish as $persian => $english) {
            if (strpos($name, $persian) !== false) {
                $name = str_replace($persian, $english, $name);
            }
        }
        
        // پاکسازی کاراکترهای غیرمجاز
        $name = preg_replace('/[^a-zA-Z0-9_]/', '_', $name);
        $name = preg_replace('/_+/', '_', $name);
        $name = trim($name, '_');
        
        // اگر نام خالی شد، نام پیش‌فرض
        if (empty($name)) {
            $name = 'field_' . uniqid();
        }
        
        // اگر با عدد شروع می‌شود، پیشوند اضافه کن
        if (is_numeric(substr($name, 0, 1))) {
            $name = 'field_' . $name;
        }
        
        return strtolower($name);
    }
    
    /**
     * تبدیل نوع داده به MySQL
     */
    private function convertToMySQLType($type, $sampleData = []) {
        switch ($type) {
            case 'int':
                return [
                    'type' => 'INT',
                    'length' => 11,
                    'default' => null
                ];
                
            case 'decimal':
                return [
                    'type' => 'DECIMAL',
                    'length' => '10,2',
                    'default' => null
                ];
                
            case 'datetime':
                return [
                    'type' => 'DATETIME',
                    'length' => null,
                    'default' => null
                ];
                
            case 'boolean':
                return [
                    'type' => 'BOOLEAN',
                    'length' => null,
                    'default' => false
                ];
                
            default: // varchar
                // تشخیص طول بهینه برای VARCHAR
                $maxLength = 0;
                foreach ($sampleData as $data) {
                    $length = mb_strlen($data, 'UTF-8');
                    if ($length > $maxLength) {
                        $maxLength = $length;
                    }
                }
                
                // انتخاب طول مناسب
                if ($maxLength <= 50) {
                    $length = 100;
                } elseif ($maxLength <= 100) {
                    $length = 200;
                } elseif ($maxLength <= 255) {
                    $length = 255;
                } else {
                    return [
                        'type' => 'TEXT',
                        'length' => null,
                        'default' => null
                    ];
                }
                
                return [
                    'type' => 'VARCHAR',
                    'length' => $length,
                    'default' => null
                ];
        }
    }
    
    /**
     * تولید کوئری CREATE TABLE
     */
    private function generateCreateTableSQL($schema) {
        $sql = "CREATE TABLE IF NOT EXISTS `{$schema['table_name']}` (\n";
        
        $columnDefinitions = [];
        foreach ($schema['columns'] as $column) {
            $definition = "    `{$column['name']}` {$column['type']}";
            
            if ($column['length']) {
                $definition .= "({$column['length']})";
            }
            
            if (!$column['nullable']) {
                $definition .= " NOT NULL";
            }
            
            if (isset($column['auto_increment']) && $column['auto_increment']) {
                $definition .= " AUTO_INCREMENT";
            }
            
            if ($column['default'] !== null) {
                $definition .= " DEFAULT '{$column['default']}'";
            }
            
            if (!empty($column['comment'])) {
                $definition .= " COMMENT '{$column['comment']}'";
            }
            
            $columnDefinitions[] = $definition;
        }
        
        $sql .= implode(",\n", $columnDefinitions);
        
        // اضافه کردن کلید اصلی
        if (!empty($schema['primary_key'])) {
            $sql .= ",\n    PRIMARY KEY (`{$schema['primary_key']}`)";
        }
        
        $sql .= "\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
        
        return $sql;
    }
    
    /**
     * اجرای کوئری ایجاد پایگاه داده
     */
    private function executeDatabaseCreation($sqlQuery, $schema) {
        try {
            // اجرای کوئری
            $stmt = $this->db->prepare($sqlQuery);
            $result = $stmt->execute();
            
            if (!$result) {
                throw new Exception('خطا در اجرای کوئری SQL');
            }
            
            // ذخیره اطلاعات در session
            $_SESSION['created_table'] = [
                'table_name' => $schema['table_name'],
                'database_name' => $schema['database_name'],
                'created_at' => date('Y-m-d H:i:s'),
                'sql_query' => $sqlQuery
            ];
            
            return [
                'table_created' => true,
                'table_name' => $schema['table_name'],
                'execution_time' => 0.1, // مقدار نمونه
                'sql_query' => $sqlQuery
            ];
            
        } catch (Exception $e) {
            throw new Exception('خطا در ایجاد جدول: ' . $e->getMessage());
        }
    }
    
    /**
     * وارد کردن داده‌ها به پایگاه داده
     */
    private function performDataImport($filePath, $schema, $options = []) {
        try {
            $tableName = $schema['table_name'];
            $skipEmpty = $options['skip_empty_rows'] ?? true;
            $skipDuplicates = $options['skip_duplicate_rows'] ?? true;
            $validateData = $options['validate_data'] ?? true;
            
            // مقداردهی وضعیت import
            $_SESSION['import_status'] = [
                'total_rows' => 0,
                'processed_rows' => 0,
                'success_rows' => 0,
                'failed_rows' => 0,
                'progress_percentage' => 0,
                'status' => 'running',
                'start_time' => time(),
                'errors' => []
            ];
            
            if (class_exists('PhpOffice\PhpSpreadsheet\IOFactory')) {
                $spreadsheet = IOFactory::load($filePath);
                $worksheet = $spreadsheet->getActiveSheet();
                
                $highestRow = $worksheet->getHighestRow();
                $totalRows = $highestRow - 1; // حذف header
                
                $_SESSION['import_status']['total_rows'] = $totalRows;
                
                // آماده‌سازی کوئری INSERT
                $columns = array_slice($schema['columns'], 1); // حذف ID column
                $columnNames = array_map(function($col) { return $col['name']; }, $columns);
                $placeholders = str_repeat('?,', count($columnNames) - 1) . '?';
                
                $insertSQL = "INSERT INTO `{$tableName}` (`" . implode('`, `', $columnNames) . "`) VALUES ($placeholders)";
                $stmt = $this->db->prepare($insertSQL);
                
                $successCount = 0;
                $errorCount = 0;
                $processedCount = 0;
                
                // پردازش سطر به سطر
                for ($row = 2; $row <= $highestRow; $row++) {
                    $rowData = [];
                    $isEmpty = true;
                    
                    // خواندن داده‌های سطر
                    foreach ($columns as $index => $column) {
                        $columnLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($index + 1);
                        $cell = $worksheet->getCell($columnLetter . $row);
                        $value = $cell->getCalculatedValue();
                        
                        // تبدیل تاریخ
                        if ($column['type'] === 'DATETIME' && Date::isDateTime($cell)) {
                            $value = Date::excelToDateTimeObject($cell->getValue())->format('Y-m-d H:i:s');
                        }
                        
                        $rowData[] = $value;
                        
                        if (!empty($value)) {
                            $isEmpty = false;
                        }
                    }
                    
                    // نادیده گرفتن سطرهای خالی
                    if ($skipEmpty && $isEmpty) {
                        continue;
                    }
                    
                    try {
                        // اعتبارسنجی داده‌ها
                        if ($validateData) {
                            $this->validateRowData($rowData, $columns);
                        }
                        
                        // وارد کردن داده
                        if ($stmt->execute($rowData)) {
                            $successCount++;
                        } else {
                            $errorCount++;
                            $_SESSION['import_status']['errors'][] = "خطا در سطر $row";
                        }
                        
                    } catch (Exception $e) {
                        $errorCount++;
                        $_SESSION['import_status']['errors'][] = "خطا در سطر $row: " . $e->getMessage();
                    }
                    
                    $processedCount++;
                    
                    // بروزرسانی وضعیت
                    $_SESSION['import_status']['processed_rows'] = $processedCount;
                    $_SESSION['import_status']['success_rows'] = $successCount;
                    $_SESSION['import_status']['failed_rows'] = $errorCount;
                    $_SESSION['import_status']['progress_percentage'] = ($processedCount / $totalRows) * 100;
                    
                    // توقف کوتاه برای جلوگیری از timeout
                    if ($processedCount % 100 == 0) {
                        usleep(10000); // 0.01 ثانیه
                    }
                }
                
                $_SESSION['import_status']['status'] = 'completed';
                
                return [
                    'import_completed' => true,
                    'total_rows' => $totalRows,
                    'success_rows' => $successCount,
                    'failed_rows' => $errorCount,
                    'processing_time' => time() - $_SESSION['import_status']['start_time'],
                    'errors' => $_SESSION['import_status']['errors']
                ];
            }
            
        } catch (Exception $e) {
            $_SESSION['import_status']['status'] = 'failed';
            throw new Exception('خطا در وارد کردن داده‌ها: ' . $e->getMessage());
        }
    }
    
    /**
     * اعتبارسنجی داده‌های سطر
     */
    private function validateRowData($rowData, $columns) {
        foreach ($rowData as $index => $value) {
            $column = $columns[$index];
            
            // بررسی NULL برای فیلدهای اجباری
            if (!$column['nullable'] && empty($value)) {
                throw new Exception("فیلد {$column['name']} نمی‌تواند خالی باشد");
            }
            
            // بررسی نوع داده
            if (!empty($value)) {
                switch ($column['type']) {
                    case 'INT':
                        if (!is_numeric($value) || !is_int($value + 0)) {
                            throw new Exception("فیلد {$column['name']} باید عدد صحیح باشد");
                        }
                        break;
                        
                    case 'DECIMAL':
                        if (!is_numeric($value)) {
                            throw new Exception("فیلد {$column['name']} باید عدد باشد");
                        }
                        break;
                }
            }
        }
    }
    
    /**
     * دریافت پیام خطای آپلود
     */
    private function getUploadErrorMessage($errorCode) {
        switch ($errorCode) {
            case UPLOAD_ERR_INI_SIZE:
                return 'حجم فایل بیش از حد مجاز سرور';
            case UPLOAD_ERR_FORM_SIZE:
                return 'حجم فایل بیش از حد مجاز فرم';
            case UPLOAD_ERR_PARTIAL:
                return 'فایل به صورت ناقص آپلود شد';
            case UPLOAD_ERR_NO_FILE:
                return 'هیچ فایلی انتخاب نشده';
            case UPLOAD_ERR_NO_TMP_DIR:
                return 'پوشه موقت برای آپلود وجود ندارد';
            case UPLOAD_ERR_CANT_WRITE:
                return 'خطا در نوشتن فایل';
            case UPLOAD_ERR_EXTENSION:
                return 'آپلود فایل توسط extension متوقف شد';
            default:
                return 'خطای نامشخص در آپلود';
        }
    }
}

// مدیریت درخواست‌ها
try {
    $processor = new ExcelProcessor();
    $action = $_GET['action'] ?? '';
    
    switch ($action) {
        case 'analyze':
            $response = $processor->analyzeFile();
            break;
            
        case 'detailed_analysis':
            $response = $processor->detailedAnalysis();
            break;
            
        case 'generate_schema':
            $response = $processor->generateSchema();
            break;
            
        case 'create_database':
            $response = $processor->createDatabase();
            break;
            
        case 'import_data':
            $response = $processor->importData();
            break;
            
        case 'import_status':
            $response = $processor->getImportStatus();
            break;
            
        default:
            $response = [
                'success' => false,
                'message' => 'عملیات نامشخص',
                'error_code' => 'UNKNOWN_ACTION'
            ];
    }
    
} catch (Exception $e) {
    http_response_code(500);
    $response = [
        'success' => false,
        'message' => 'خطای سرور: ' . $e->getMessage(),
        'error_code' => 'SERVER_ERROR'
    ];
    
    error_log("Excel Processor Error: " . $e->getMessage());
}

// ارسال پاسخ JSON
echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>