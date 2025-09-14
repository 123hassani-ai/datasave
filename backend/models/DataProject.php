<?php
/**
 * مدل پروژه‌های داده - Data Project Model
 * 
 * @description: مدل برای مدیریت پروژه‌های تبدیل Excel به MySQL
 * @version: 1.0.0
 * @author: DataSave Team
 */

class DataProject {
    private $conn;
    private $table = 'ai_data_projects';
    
    // Properties
    public $id;
    public $name;
    public $description;
    public $original_filename;
    public $file_path;
    public $file_size;
    public $database_name;
    public $table_name;
    public $schema_data;
    public $status;
    public $total_rows;
    public $processed_rows;
    public $failed_rows;
    public $processing_time;
    public $ai_model_used;
    public $created_by;
    public $created_at;
    public $updated_at;
    public $completed_at;
    
    /**
     * سازنده کلاس
     */
    public function __construct($db) {
        $this->conn = $db;
    }
    
    /**
     * ایجاد پروژه جدید
     */
    public function create() {
        $query = "
            INSERT INTO {$this->table} 
            SET name = :name,
                description = :description,
                original_filename = :original_filename,
                file_path = :file_path,
                file_size = :file_size,
                created_by = :created_by
        ";
        
        $stmt = $this->conn->prepare($query);
        
        // Bind values
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':original_filename', $this->original_filename);
        $stmt->bindParam(':file_path', $this->file_path);
        $stmt->bindParam(':file_size', $this->file_size);
        $stmt->bindParam(':created_by', $this->created_by);
        
        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        
        return false;
    }
    
    /**
     * دریافت پروژه بر اساس ID
     */
    public function getById($id) {
        $query = "SELECT * FROM {$this->table} WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Set properties
            $this->id = $row['id'];
            $this->name = $row['name'];
            $this->description = $row['description'];
            $this->original_filename = $row['original_filename'];
            $this->file_path = $row['file_path'];
            $this->file_size = $row['file_size'];
            $this->database_name = $row['database_name'];
            $this->table_name = $row['table_name'];
            $this->schema_data = $row['schema_data'];
            $this->status = $row['status'];
            $this->total_rows = $row['total_rows'];
            $this->processed_rows = $row['processed_rows'];
            $this->failed_rows = $row['failed_rows'];
            $this->processing_time = $row['processing_time'];
            $this->ai_model_used = $row['ai_model_used'];
            $this->created_by = $row['created_by'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            $this->completed_at = $row['completed_at'];
            
            return $row;
        }
        
        return false;
    }
    
    /**
     * دریافت همه پروژه‌ها
     */
    public function getAll($limit = 10, $offset = 0, $status = null) {
        $whereClause = '';
        $params = [];
        
        if ($status && $status !== 'all') {
            $whereClause = 'WHERE status = :status';
            $params[':status'] = $status;
        }
        
        $query = "
            SELECT * FROM {$this->table} 
            {$whereClause}
            ORDER BY created_at DESC 
            LIMIT :limit OFFSET :offset
        ";
        
        $stmt = $this->conn->prepare($query);
        
        // Bind parameters
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    /**
     * شمارش کل پروژه‌ها
     */
    public function countAll($status = null) {
        $whereClause = '';
        $params = [];
        
        if ($status && $status !== 'all') {
            $whereClause = 'WHERE status = :status';
            $params[':status'] = $status;
        }
        
        $query = "SELECT COUNT(*) as total FROM {$this->table} {$whereClause}";
        $stmt = $this->conn->prepare($query);
        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return intval($row['total']);
    }
    
    /**
     * به‌روزرسانی پروژه
     */
    public function update() {
        $query = "
            UPDATE {$this->table} 
            SET name = :name,
                description = :description,
                database_name = :database_name,
                table_name = :table_name,
                schema_data = :schema_data,
                status = :status,
                total_rows = :total_rows,
                processed_rows = :processed_rows,
                failed_rows = :failed_rows,
                processing_time = :processing_time,
                ai_model_used = :ai_model_used,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
        ";
        
        $stmt = $this->conn->prepare($query);
        
        // Bind values
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':database_name', $this->database_name);
        $stmt->bindParam(':table_name', $this->table_name);
        $stmt->bindParam(':schema_data', $this->schema_data);
        $stmt->bindParam(':status', $this->status);
        $stmt->bindParam(':total_rows', $this->total_rows);
        $stmt->bindParam(':processed_rows', $this->processed_rows);
        $stmt->bindParam(':failed_rows', $this->failed_rows);
        $stmt->bindParam(':processing_time', $this->processing_time);
        $stmt->bindParam(':ai_model_used', $this->ai_model_used);
        $stmt->bindParam(':id', $this->id);
        
        return $stmt->execute();
    }
    
    /**
     * به‌روزرسانی وضعیت پروژه
     */
    public function updateStatus($id, $status) {
        $query = "
            UPDATE {$this->table} 
            SET status = :status,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
        ";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':id', $id);
        
        return $stmt->execute();
    }
    
    /**
     * به‌روزرسانی پیشرفت پروژه
     */
    public function updateProgress($id, $processed_rows, $failed_rows = 0) {
        $query = "
            UPDATE {$this->table} 
            SET processed_rows = :processed_rows,
                failed_rows = :failed_rows,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
        ";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':processed_rows', $processed_rows);
        $stmt->bindParam(':failed_rows', $failed_rows);
        $stmt->bindParam(':id', $id);
        
        return $stmt->execute();
    }
    
    /**
     * تکمیل پروژه
     */
    public function complete($id, $processing_time = null) {
        $query = "
            UPDATE {$this->table} 
            SET status = 'completed',
                processing_time = :processing_time,
                completed_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
        ";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':processing_time', $processing_time);
        $stmt->bindParam(':id', $id);
        
        return $stmt->execute();
    }
    
    /**
     * نشان‌دهی خطا در پروژه
     */
    public function markAsFailed($id, $error_message = null) {
        $query = "
            UPDATE {$this->table} 
            SET status = 'failed',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
        ";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        
        if ($stmt->execute()) {
            // ثبت خطا در لاگ
            if ($error_message) {
                $this->logError($id, $error_message);
            }
            return true;
        }
        
        return false;
    }
    
    /**
     * حذف پروژه
     */
    public function delete($id) {
        $query = "DELETE FROM {$this->table} WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        
        return $stmt->execute();
    }
    
    /**
     * دریافت پروژه‌های کاربر
     */
    public function getByUserId($user_id, $limit = 10, $offset = 0) {
        $query = "
            SELECT * FROM {$this->table} 
            WHERE created_by = :user_id 
            ORDER BY created_at DESC 
            LIMIT :limit OFFSET :offset
        ";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    /**
     * دریافت آمار پروژه‌ها
     */
    public function getStats() {
        $query = "
            SELECT 
                COUNT(*) as total_projects,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_projects,
                SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_projects,
                SUM(CASE WHEN status IN ('analyzing', 'schema_ready', 'creating_db', 'importing_data') THEN 1 ELSE 0 END) as processing_projects,
                SUM(total_rows) as total_records,
                AVG(processing_time) as avg_processing_time,
                SUM(file_size) as total_file_size
            FROM {$this->table}
        ";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    /**
     * جستجو در پروژه‌ها
     */
    public function search($keyword, $limit = 10, $offset = 0) {
        $query = "
            SELECT * FROM {$this->table} 
            WHERE name LIKE :keyword 
            OR description LIKE :keyword 
            OR original_filename LIKE :keyword
            ORDER BY created_at DESC 
            LIMIT :limit OFFSET :offset
        ";
        
        $stmt = $this->conn->prepare($query);
        $searchTerm = "%{$keyword}%";
        $stmt->bindParam(':keyword', $searchTerm);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    /**
     * ثبت خطا در لاگ
     */
    private function logError($project_id, $error_message) {
        try {
            $query = "
                INSERT INTO ai_operation_logs 
                (project_id, operation_type, operation_detail, status, error_message) 
                VALUES (:project_id, 'project_error', 'Project failed', 'error', :error_message)
            ";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':project_id', $project_id);
            $stmt->bindParam(':error_message', $error_message);
            $stmt->execute();
        } catch (Exception $e) {
            // در صورت خطا در لاگ، خطا را نادیده می‌گیریم
        }
    }
    
    /**
     * اعتبارسنجی داده‌های پروژه
     */
    public function validate() {
        $errors = [];
        
        if (empty($this->name)) {
            $errors[] = 'نام پروژه اجباری است';
        }
        
        if (strlen($this->name) > 100) {
            $errors[] = 'نام پروژه نباید بیش از 100 کاراکتر باشد';
        }
        
        if (empty($this->original_filename)) {
            $errors[] = 'نام فایل اجباری است';
        }
        
        if (empty($this->created_by)) {
            $errors[] = 'شناسه کاربر ایجادکننده اجباری است';
        }
        
        return $errors;
    }
    
    /**
     * تنظیم داده‌ها از آرایه
     */
    public function setFromArray($data) {
        if (isset($data['name'])) $this->name = $data['name'];
        if (isset($data['description'])) $this->description = $data['description'];
        if (isset($data['original_filename'])) $this->original_filename = $data['original_filename'];
        if (isset($data['file_path'])) $this->file_path = $data['file_path'];
        if (isset($data['file_size'])) $this->file_size = $data['file_size'];
        if (isset($data['database_name'])) $this->database_name = $data['database_name'];
        if (isset($data['table_name'])) $this->table_name = $data['table_name'];
        if (isset($data['schema_data'])) $this->schema_data = $data['schema_data'];
        if (isset($data['status'])) $this->status = $data['status'];
        if (isset($data['total_rows'])) $this->total_rows = $data['total_rows'];
        if (isset($data['processed_rows'])) $this->processed_rows = $data['processed_rows'];
        if (isset($data['failed_rows'])) $this->failed_rows = $data['failed_rows'];
        if (isset($data['processing_time'])) $this->processing_time = $data['processing_time'];
        if (isset($data['ai_model_used'])) $this->ai_model_used = $data['ai_model_used'];
        if (isset($data['created_by'])) $this->created_by = $data['created_by'];
    }
    
    /**
     * تبدیل به آرایه
     */
    public function toArray() {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'original_filename' => $this->original_filename,
            'file_path' => $this->file_path,
            'file_size' => $this->file_size,
            'database_name' => $this->database_name,
            'table_name' => $this->table_name,
            'schema_data' => $this->schema_data,
            'status' => $this->status,
            'total_rows' => $this->total_rows,
            'processed_rows' => $this->processed_rows,
            'failed_rows' => $this->failed_rows,
            'processing_time' => $this->processing_time,
            'ai_model_used' => $this->ai_model_used,
            'created_by' => $this->created_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'completed_at' => $this->completed_at
        ];
    }
}
