<?php
/**
 * API مدیریت داده‌ها - Data Management API
 * Excel to MySQL Conversion System
 * 
 * @description: API endpoints برای سیستم تبدیل Excel به MySQL
 * @version: 1.0.0
 * @author: DataSave Team
 */

// Headers مورد نیاز
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// مدیریت CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// بارگذاری فایل‌های مورد نیاز
require_once '../../config/database.php';
require_once '../../models/DataProject.php';

/**
 * کلاس API مدیریت داده‌ها
 */
class DataManagementAPI {
    private $db;
    private $project;
    
    public function __construct() {
        try {
            $database = Database::getInstance();
            $this->db = $database->getConnection();
            $this->project = new DataProject($this->db);
        } catch (Exception $e) {
            $this->sendError('Database connection failed', 500, $e->getMessage());
        }
    }
    
    /**
     * مدیریت درخواست‌ها
     */
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $pathParts = explode('/', trim($path, '/'));
        
        // استخراج action از URL
        $action = end($pathParts);
        
        try {
            switch ($method) {
                case 'GET':
                    $this->handleGet($action);
                    break;
                case 'POST':
                    $this->handlePost($action);
                    break;
                case 'PUT':
                    $this->handlePut($action);
                    break;
                case 'DELETE':
                    $this->handleDelete($action);
                    break;
                default:
                    $this->sendError('Method not allowed', 405);
            }
        } catch (Exception $e) {
            $this->sendError('Internal server error', 500, $e->getMessage());
        }
    }
    
    /**
     * مدیریت درخواست‌های GET
     */
    private function handleGet($action) {
        switch ($action) {
            case 'stats':
                $this->getStats();
                break;
            case 'projects':
                $this->getProjects();
                break;
            case 'project':
                $projectId = $_GET['id'] ?? null;
                if ($projectId) {
                    $this->getProject($projectId);
                } else {
                    $this->sendError('Project ID required', 400);
                }
                break;
            case 'chat':
                $projectId = $_GET['project_id'] ?? null;
                if ($projectId) {
                    $this->getChatHistory($projectId);
                } else {
                    $this->sendError('Project ID required', 400);
                }
                break;
            case 'timeline':
                $projectId = $_GET['project_id'] ?? null;
                if ($projectId) {
                    $this->getTimeline($projectId);
                } else {
                    $this->sendError('Project ID required', 400);
                }
                break;
            default:
                $this->sendError('Endpoint not found', 404);
        }
    }
    
    /**
     * مدیریت درخواست‌های POST
     */
    private function handlePost($action) {
        switch ($action) {
            case 'upload':
                $this->uploadExcel();
                break;
            case 'create-project':
                $this->createProject();
                break;
            case 'analyze-file':
                $this->analyzeFile();
                break;
            case 'chat-message':
                $this->sendChatMessage();
                break;
            case 'create-database':
                $this->createDatabase();
                break;
            case 'import-data':
                $this->importData();
                break;
            default:
                $this->sendError('Endpoint not found', 404);
        }
    }
    
    /**
     * دریافت آمار کلی
     */
    private function getStats() {
        try {
            $query = "SELECT * FROM v_dashboard_stats";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $stats = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$stats) {
                $stats = [
                    'total_projects' => 0,
                    'completed_projects' => 0,
                    'failed_projects' => 0,
                    'processing_projects' => 0,
                    'total_records' => 0,
                    'avg_processing_time' => 0,
                    'total_file_size' => 0
                ];
            }
            
            $this->sendSuccess('Stats retrieved successfully', $stats);
            
        } catch (Exception $e) {
            $this->sendError('Failed to retrieve stats', 500, $e->getMessage());
        }
    }
    
    /**
     * دریافت لیست پروژه‌ها
     */
    private function getProjects() {
        try {
            $page = max(1, intval($_GET['page'] ?? 1));
            $limit = min(50, max(1, intval($_GET['limit'] ?? 10)));
            $status = $_GET['status'] ?? 'all';
            $sort = $_GET['sort'] ?? 'created_desc';
            
            $offset = ($page - 1) * $limit;
            
            // ساخت کوئری
            $whereClause = '';
            $params = [];
            
            if ($status !== 'all') {
                $whereClause = 'WHERE status = :status';
                $params[':status'] = $status;
            }
            
            // ترتیب‌بندی
            $orderClause = match($sort) {
                'created_asc' => 'ORDER BY created_at ASC',
                'name_asc' => 'ORDER BY name ASC',
                'name_desc' => 'ORDER BY name DESC',
                default => 'ORDER BY created_at DESC'
            };
            
            $query = "
                SELECT * FROM v_projects_summary 
                {$whereClause} 
                {$orderClause} 
                LIMIT :limit OFFSET :offset
            ";
            
            $stmt = $this->db->prepare($query);
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            
            $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // شمارش کل
            $countQuery = "SELECT COUNT(*) as total FROM ai_data_projects " . $whereClause;
            $countStmt = $this->db->prepare($countQuery);
            foreach ($params as $key => $value) {
                $countStmt->bindValue($key, $value);
            }
            $countStmt->execute();
            $totalCount = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            $response = [
                'projects' => $projects,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => intval($totalCount),
                    'pages' => ceil($totalCount / $limit)
                ]
            ];
            
            $this->sendSuccess('Projects retrieved successfully', $response);
            
        } catch (Exception $e) {
            $this->sendError('Failed to retrieve projects', 500, $e->getMessage());
        }
    }
    
    /**
     * آپلود فایل Excel
     */
    private function uploadExcel() {
        try {
            // بررسی وجود فایل
            if (!isset($_FILES['excel_file']) || $_FILES['excel_file']['error'] !== UPLOAD_ERR_OK) {
                $this->sendError('File upload failed', 400, 'No file uploaded or upload error');
            }
            
            $file = $_FILES['excel_file'];
            $projectName = $_POST['project_name'] ?? '';
            $projectDescription = $_POST['project_description'] ?? '';
            
            // اعتبارسنجی
            if (empty($projectName)) {
                $this->sendError('Project name is required', 400);
            }
            
            // بررسی نوع فایل
            $allowedMimes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel'
            ];
            
            if (!in_array($file['type'], $allowedMimes)) {
                $this->sendError('Invalid file type', 400, 'Only Excel files are allowed');
            }
            
            // بررسی حجم فایل (50MB)
            $maxSize = 50 * 1024 * 1024;
            if ($file['size'] > $maxSize) {
                $this->sendError('File too large', 400, 'File size must be less than 50MB');
            }
            
            // ایجاد مسیر ذخیره
            $uploadDir = '../../../uploads/excel/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            
            // نام یکتا برای فایل
            $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $uniqueFileName = uniqid() . '_' . time() . '.' . $fileExtension;
            $filePath = $uploadDir . $uniqueFileName;
            
            // جابجایی فایل
            if (!move_uploaded_file($file['tmp_name'], $filePath)) {
                $this->sendError('Failed to save file', 500);
            }
            
            // ایجاد پروژه جدید
            $userId = $this->getCurrentUserId(); // باید پیاده‌سازی شود
            
            $stmt = $this->db->prepare("
                CALL sp_create_new_project(
                    :name, :description, :filename, :file_size, :created_by, @project_id
                )
            ");
            $stmt->bindParam(':name', $projectName);
            $stmt->bindParam(':description', $projectDescription);
            $stmt->bindParam(':filename', $file['name']);
            $stmt->bindParam(':file_size', $file['size'], PDO::PARAM_INT);
            $stmt->bindParam(':created_by', $userId, PDO::PARAM_INT);
            $stmt->execute();
            
            // دریافت ID پروژه
            $result = $this->db->query("SELECT @project_id as project_id");
            $projectId = $result->fetch(PDO::FETCH_ASSOC)['project_id'];
            
            // به‌روزرسانی مسیر فایل
            $updateStmt = $this->db->prepare("
                UPDATE ai_data_projects 
                SET file_path = :file_path 
                WHERE id = :id
            ");
            $updateStmt->bindParam(':file_path', $filePath);
            $updateStmt->bindParam(':id', $projectId);
            $updateStmt->execute();
            
            $response = [
                'project_id' => intval($projectId),
                'file_name' => $file['name'],
                'file_size' => $file['size'],
                'status' => 'uploaded'
            ];
            
            $this->sendSuccess('File uploaded successfully', $response);
            
        } catch (Exception $e) {
            $this->sendError('Upload failed', 500, $e->getMessage());
        }
    }
    
    /**
     * تحلیل فایل Excel
     */
    private function analyzeFile() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            $projectId = $input['project_id'] ?? null;
            
            if (!$projectId) {
                $this->sendError('Project ID is required', 400);
            }
            
            // دریافت اطلاعات پروژه
            $project = $this->project->getById($projectId);
            if (!$project) {
                $this->sendError('Project not found', 404);
            }
            
            // شبیه‌سازی تحلیل فایل (در نسخه واقعی باید PhpSpreadsheet استفاده شود)
            $analysis = [
                'rows' => 1500,
                'columns' => 8,
                'column_names' => ['نام', 'نام خانوادگی', 'شماره تماس', 'ایمیل', 'آدرس', 'شهر', 'کد پستی', 'تاریخ ثبت'],
                'data_types' => ['string', 'string', 'string', 'email', 'text', 'string', 'integer', 'date'],
                'sample_data' => [
                    ['احمد', 'محمدی', '09123456789', 'ahmad@example.com', 'خیابان آزادی', 'تهران', '1234567890', '2024-01-15'],
                    ['فاطمه', 'رضایی', '09987654321', 'fateme@example.com', 'خیابان ولیعصر', 'اصفهان', '0987654321', '2024-01-16']
                ],
                'estimated_processing_time' => 45
            ];
            
            // پیشنهاد نام پایگاه داده
            $suggestedDbName = strtolower(str_replace([' ', '-', '.'], '_', $project['name'])) . '_data';
            $suggestedTableName = 'main_data';
            
            $suggested_schema = [
                'database_name' => $suggestedDbName,
                'table_name' => $suggestedTableName,
                'sql_create' => $this->generateCreateTableSQL($suggestedTableName, $analysis['column_names'], $analysis['data_types'])
            ];
            
            // به‌روزرسانی وضعیت پروژه
            $this->db->beginTransaction();
            
            $updateStmt = $this->db->prepare("
                UPDATE ai_data_projects 
                SET status = 'analyzing', 
                    total_rows = :total_rows,
                    schema_data = :schema_data,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = :id
            ");
            $updateStmt->bindParam(':total_rows', $analysis['rows']);
            $updateStmt->bindParam(':schema_data', json_encode($suggested_schema));
            $updateStmt->bindParam(':id', $projectId);
            $updateStmt->execute();
            
            // به‌روزرسانی مرحله 2
            $stepStmt = $this->db->prepare("
                UPDATE ai_processing_steps 
                SET status = 'completed', 
                    ai_response = :ai_response,
                    completed_at = CURRENT_TIMESTAMP
                WHERE project_id = :project_id AND step_number = 2
            ");
            $stepStmt->bindParam(':ai_response', json_encode($analysis));
            $stepStmt->bindParam(':project_id', $projectId);
            $stepStmt->execute();
            
            $this->db->commit();
            
            $response = [
                'project_id' => intval($projectId),
                'analysis' => $analysis,
                'suggested_schema' => $suggested_schema
            ];
            
            $this->sendSuccess('File analyzed successfully', $response);
            
        } catch (Exception $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollback();
            }
            $this->sendError('Analysis failed', 500, $e->getMessage());
        }
    }
    
    /**
     * تولید SQL CREATE TABLE
     */
    private function generateCreateTableSQL($tableName, $columns, $types) {
        $sql = "CREATE TABLE `{$tableName}` (\n";
        $sql .= "  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,\n";
        
        for ($i = 0; $i < count($columns); $i++) {
            $columnName = $this->sanitizeColumnName($columns[$i]);
            $columnType = $this->mapDataType($types[$i]);
            $sql .= "  `{$columnName}` {$columnType},\n";
        }
        
        $sql .= "  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n";
        $sql .= "  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP\n";
        $sql .= ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
        
        return $sql;
    }
    
    /**
     * تمیز کردن نام ستون
     */
    private function sanitizeColumnName($name) {
        // تبدیل حروف فارسی به انگلیسی (ساده)
        $map = [
            'نام' => 'name',
            'نام خانوادگی' => 'last_name', 
            'شماره تماس' => 'phone',
            'ایمیل' => 'email',
            'آدرس' => 'address',
            'شهر' => 'city',
            'کد پستی' => 'postal_code',
            'تاریخ ثبت' => 'registration_date'
        ];
        
        return $map[$name] ?? strtolower(str_replace([' ', '-'], '_', $name));
    }
    
    /**
     * تبدیل نوع داده
     */
    private function mapDataType($type) {
        return match($type) {
            'string' => 'VARCHAR(255)',
            'text' => 'TEXT',
            'email' => 'VARCHAR(255)',
            'integer' => 'INT',
            'date' => 'DATE',
            'datetime' => 'DATETIME',
            'decimal' => 'DECIMAL(10,2)',
            default => 'VARCHAR(255)'
        };
    }
    
    /**
     * دریافت ID کاربر فعلی
     */
    private function getCurrentUserId() {
        // شبیه‌سازی - در نسخه واقعی از session یا JWT استفاده شود
        return 1;
    }
    
    /**
     * ارسال پاسخ موفقیت‌آمیز
     */
    private function sendSuccess($message, $data = null, $code = 200) {
        http_response_code($code);
        $response = [
            'success' => true,
            'message' => $message,
            'timestamp' => date('c')
        ];
        
        if ($data !== null) {
            $response['data'] = $data;
        }
        
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    /**
     * ارسال پاسخ خطا
     */
    private function sendError($message, $code = 400, $details = null) {
        http_response_code($code);
        $response = [
            'success' => false,
            'error' => $message,
            'code' => $code,
            'timestamp' => date('c')
        ];
        
        if ($details !== null) {
            $response['details'] = $details;
        }
        
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        exit();
    }
}

// اجرای API
try {
    $api = new DataManagementAPI();
    $api->handleRequest();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Internal server error',
        'timestamp' => date('c')
    ], JSON_UNESCAPED_UNICODE);
}
