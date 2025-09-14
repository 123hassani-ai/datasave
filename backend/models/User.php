<?php
/**
 * مدل کاربر - User Model
 * @description کلاس مدیریت کاربران سیستم
 * @author Excel Import AI Team
 * @version 1.0.0
 */

require_once __DIR__ . '/../config/database.php';

class User {
    private $db;
    private $table_name = "ai_users";
    private $groups_table = "ai_user_groups";
    
    // خصوصیات کاربر
    public $id;
    public $username;
    public $email;
    public $mobile;
    public $password;
    public $first_name;
    public $last_name;
    public $full_name;
    public $national_id;
    public $birth_date;
    public $gender;
    public $phone;
    public $address;
    public $city;
    public $state;
    public $postal_code;
    public $country;
    public $user_group_id;
    public $is_active;
    public $is_verified;
    public $is_email_verified;
    public $is_mobile_verified;
    public $avatar_path;
    public $bio;
    public $website;
    public $timezone;
    public $language;
    public $last_login_at;
    public $last_login_ip;
    public $login_attempts;
    public $locked_until;
    public $password_changed_at;
    public $two_factor_enabled;
    public $two_factor_secret;
    public $created_at;
    public $updated_at;
    public $created_by;
    public $updated_by;
    public $deleted_at;
    
    /**
     * سازنده کلاس
     */
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    /**
     * ایجاد کاربر جدید
     * @param array $userData
     * @return bool|int
     */
    public function create($userData) {
        try {
            // اعتبارسنجی داده‌های ورودی
            if (!$this->validateUserData($userData)) {
                return false;
            }
            
            // بررسی تکراری نبودن نام کاربری و ایمیل
            if ($this->isUsernameExists($userData['username'])) {
                throw new Exception('نام کاربری قبلاً ثبت شده است');
            }
            
            if ($this->isEmailExists($userData['email'])) {
                throw new Exception('ایمیل قبلاً ثبت شده است');
            }
            
            // هش کردن رمز عبور
            $userData['password'] = $this->hashPassword($userData['password']);
            
            // تنظیم مقادیر پیش‌فرض
            $userData = array_merge([
                'user_group_id' => 2, // کاربر عادی
                'is_active' => true,
                'is_verified' => false,
                'is_email_verified' => false,
                'is_mobile_verified' => false,
                'timezone' => 'Asia/Tehran',
                'language' => 'fa',
                'country' => 'Iran'
            ], $userData);
            
            // ساخت کوئری INSERT
            $fields = array_keys($userData);
            $placeholders = ':' . implode(', :', $fields);
            
            $sql = "INSERT INTO {$this->table_name} (" . implode(', ', $fields) . ") 
                    VALUES ({$placeholders})";
            
            $stmt = $this->db->query($sql, $userData);
            
            if ($stmt) {
                $userId = $this->db->getLastInsertId();
                $this->logActivity($userId, 'USER_CREATED', 'users', $userId, $userData);
                return $userId;
            }
            
            return false;
            
        } catch (Exception $e) {
            error_log("خطا در ایجاد کاربر: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * بروزرسانی اطلاعات کاربر
     * @param int $userId
     * @param array $userData
     * @return bool
     */
    public function update($userId, $userData) {
        try {
            // حذف فیلدهای غیرقابل تغییر
            unset($userData['id'], $userData['created_at'], $userData['password_changed_at']);
            
            // اگر رمز عبور تغییر کرده، هش کن
            if (isset($userData['password'])) {
                $userData['password'] = $this->hashPassword($userData['password']);
            }
            
            $userData['updated_at'] = date('Y-m-d H:i:s');
            
            // ساخت کوئری UPDATE
            $setParts = [];
            foreach ($userData as $field => $value) {
                $setParts[] = "{$field} = :{$field}";
            }
            
            $sql = "UPDATE {$this->table_name} SET " . implode(', ', $setParts) . " WHERE id = :id";
            $userData['id'] = $userId;
            
            $stmt = $this->db->query($sql, $userData);
            
            if ($stmt) {
                $this->logActivity(null, 'USER_UPDATED', 'users', $userId, $userData);
                return true;
            }
            
            return false;
            
        } catch (Exception $e) {
            error_log("خطا در بروزرسانی کاربر: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * حذف کاربر (soft delete)
     * @param int $userId
     * @return bool
     */
    public function delete($userId) {
        try {
            $sql = "UPDATE {$this->table_name} SET deleted_at = NOW(), is_active = FALSE WHERE id = :id";
            $stmt = $this->db->query($sql, ['id' => $userId]);
            
            if ($stmt) {
                $this->logActivity(null, 'USER_DELETED', 'users', $userId);
                return true;
            }
            
            return false;
            
        } catch (Exception $e) {
            error_log("خطا در حذف کاربر: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * دریافت کاربر با شناسه
     * @param int $userId
     * @return array|false
     */
    public function getById($userId) {
        try {
            $sql = "SELECT u.*, ug.name as group_name, ug.name_fa as group_name_fa, ug.permissions 
                    FROM {$this->table_name} u 
                    LEFT JOIN {$this->groups_table} ug ON u.user_group_id = ug.id 
                    WHERE u.id = :id AND u.deleted_at IS NULL";
            
            $stmt = $this->db->query($sql, ['id' => $userId]);
            return $stmt->fetch();
            
        } catch (Exception $e) {
            error_log("خطا در دریافت کاربر: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * دریافت کاربر با نام کاربری
     * @param string $username
     * @return array|false
     */
    public function getByUsername($username) {
        try {
            $sql = "SELECT u.*, ug.name as group_name, ug.name_fa as group_name_fa, ug.permissions 
                    FROM {$this->table_name} u 
                    LEFT JOIN {$this->groups_table} ug ON u.user_group_id = ug.id 
                    WHERE u.username = :username AND u.deleted_at IS NULL";
            
            $stmt = $this->db->query($sql, ['username' => $username]);
            return $stmt->fetch();
            
        } catch (Exception $e) {
            error_log("خطا در دریافت کاربر: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * دریافت کاربر با ایمیل
     * @param string $email
     * @return array|false
     */
    public function getByEmail($email) {
        try {
            $sql = "SELECT u.*, ug.name as group_name, ug.name_fa as group_name_fa 
                    FROM {$this->table_name} u 
                    LEFT JOIN {$this->groups_table} ug ON u.user_group_id = ug.id 
                    WHERE u.email = :email AND u.deleted_at IS NULL";
            
            $stmt = $this->db->query($sql, ['email' => $email]);
            return $stmt->fetch();
            
        } catch (Exception $e) {
            error_log("خطا در دریافت کاربر: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * دریافت لیست کاربران با فیلتر و صفحه‌بندی
     * @param array $filters
     * @param int $page
     * @param int $limit
     * @return array
     */
    public function getList($filters = [], $page = 1, $limit = 20) {
        try {
            $where = ["u.deleted_at IS NULL"];
            $params = [];
            
            // اعمال فیلترها
            if (!empty($filters['search'])) {
                $where[] = "(u.username LIKE :search OR u.email LIKE :search OR u.first_name LIKE :search OR u.last_name LIKE :search)";
                $params['search'] = '%' . $filters['search'] . '%';
            }
            
            if (isset($filters['is_active'])) {
                $where[] = "u.is_active = :is_active";
                $params['is_active'] = $filters['is_active'];
            }
            
            if (!empty($filters['user_group_id'])) {
                $where[] = "u.user_group_id = :user_group_id";
                $params['user_group_id'] = $filters['user_group_id'];
            }
            
            $whereClause = implode(' AND ', $where);
            $offset = ($page - 1) * $limit;
            
            // کوئری اصلی
            $sql = "SELECT u.*, ug.name as group_name, ug.name_fa as group_name_fa 
                    FROM {$this->table_name} u 
                    LEFT JOIN {$this->groups_table} ug ON u.user_group_id = ug.id 
                    WHERE {$whereClause} 
                    ORDER BY u.created_at DESC 
                    LIMIT {$limit} OFFSET {$offset}";
            
            $stmt = $this->db->query($sql, $params);
            $users = $stmt->fetchAll();
            
            // شمارش کل رکوردها
            $countSql = "SELECT COUNT(*) as total FROM {$this->table_name} u WHERE {$whereClause}";
            $countStmt = $this->db->query($countSql, $params);
            $total = $countStmt->fetch()['total'];
            
            return [
                'data' => $users,
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'pages' => ceil($total / $limit)
            ];
            
        } catch (Exception $e) {
            error_log("خطا در دریافت لیست کاربران: " . $e->getMessage());
            return ['data' => [], 'total' => 0, 'page' => $page, 'limit' => $limit, 'pages' => 0];
        }
    }
    
    /**
     * احراز هویت کاربر
     * @param string $username
     * @param string $password
     * @return array|false
     */
    public function authenticate($username, $password) {
        try {
            $user = $this->getByUsername($username) ?: $this->getByEmail($username);
            
            if (!$user) {
                return false;
            }
            
            // بررسی قفل بودن حساب
            if ($user['locked_until'] && strtotime($user['locked_until']) > time()) {
                throw new Exception('حساب کاربری قفل شده است');
            }
            
            // بررسی رمز عبور
            if (!password_verify($password, $user['password'])) {
                $this->incrementLoginAttempts($user['id']);
                return false;
            }
            
            // بروزرسانی اطلاعات ورود
            $this->updateLoginInfo($user['id']);
            
            // حذف رمز عبور از نتیجه
            unset($user['password']);
            
            return $user;
            
        } catch (Exception $e) {
            error_log("خطا در احراز هویت: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * بررسی وجود نام کاربری
     * @param string $username
     * @return bool
     */
    public function isUsernameExists($username) {
        try {
            $sql = "SELECT id FROM {$this->table_name} WHERE username = :username AND deleted_at IS NULL";
            $stmt = $this->db->query($sql, ['username' => $username]);
            return $stmt->rowCount() > 0;
        } catch (Exception $e) {
            return false;
        }
    }
    
    /**
     * بررسی وجود ایمیل
     * @param string $email
     * @return bool
     */
    public function isEmailExists($email) {
        try {
            $sql = "SELECT id FROM {$this->table_name} WHERE email = :email AND deleted_at IS NULL";
            $stmt = $this->db->query($sql, ['email' => $email]);
            return $stmt->rowCount() > 0;
        } catch (Exception $e) {
            return false;
        }
    }
    
    /**
     * هش کردن رمز عبور
     * @param string $password
     * @return string
     */
    private function hashPassword($password) {
        return password_hash($password, PASSWORD_DEFAULT);
    }
    
    /**
     * اعتبارسنجی داده‌های کاربر
     * @param array $userData
     * @return bool
     */
    private function validateUserData($userData) {
        // بررسی فیلدهای اجباری
        $required = ['username', 'email', 'password'];
        foreach ($required as $field) {
            if (empty($userData[$field])) {
                throw new Exception("فیلد {$field} اجباری است");
            }
        }
        
        // اعتبارسنجی ایمیل
        if (!filter_var($userData['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception('فرمت ایمیل نامعتبر است');
        }
        
        // اعتبارسنجی نام کاربری
        if (!preg_match('/^[a-zA-Z0-9_]{3,50}$/', $userData['username'])) {
            throw new Exception('نام کاربری باید بین 3 تا 50 کاراکتر و شامل حروف، اعداد و _ باشد');
        }
        
        // اعتبارسنجی رمز عبور
        if (strlen($userData['password']) < 6) {
            throw new Exception('رمز عبور باید حداقل 6 کاراکتر باشد');
        }
        
        return true;
    }
    
    /**
     * افزایش تعداد تلاش‌های ورود ناموفق
     * @param int $userId
     */
    private function incrementLoginAttempts($userId) {
        try {
            $sql = "UPDATE {$this->table_name} SET 
                    login_attempts = login_attempts + 1,
                    locked_until = CASE 
                        WHEN login_attempts >= 4 THEN DATE_ADD(NOW(), INTERVAL 30 MINUTE)
                        ELSE locked_until 
                    END
                    WHERE id = :id";
            
            $this->db->query($sql, ['id' => $userId]);
        } catch (Exception $e) {
            error_log("خطا در افزایش تلاش‌های ورود: " . $e->getMessage());
        }
    }
    
    /**
     * بروزرسانی اطلاعات ورود
     * @param int $userId
     */
    private function updateLoginInfo($userId) {
        try {
            $sql = "UPDATE {$this->table_name} SET 
                    last_login_at = NOW(),
                    last_login_ip = :ip,
                    login_attempts = 0,
                    locked_until = NULL
                    WHERE id = :id";
            
            $this->db->query($sql, [
                'id' => $userId,
                'ip' => $_SERVER['REMOTE_ADDR'] ?? ''
            ]);
        } catch (Exception $e) {
            error_log("خطا در بروزرسانی اطلاعات ورود: " . $e->getMessage());
        }
    }
    
    /**
     * ثبت فعالیت کاربر
     * @param int|null $userId
     * @param string $action
     * @param string $entityType
     * @param int|null $entityId
     * @param array|null $details
     */
    private function logActivity($userId, $action, $entityType, $entityId = null, $details = null) {
        try {
            $sql = "INSERT INTO ai_system_logs (user_id, action, entity_type, entity_id, details, ip_address, user_agent) 
                    VALUES (:user_id, :action, :entity_type, :entity_id, :details, :ip_address, :user_agent)";
            
            $this->db->query($sql, [
                'user_id' => $userId,
                'action' => $action,
                'entity_type' => $entityType,
                'entity_id' => $entityId,
                'details' => $details ? json_encode($details) : null,
                'ip_address' => $_SERVER['REMOTE_ADDR'] ?? '',
                'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? ''
            ]);
        } catch (Exception $e) {
            error_log("خطا در ثبت لاگ فعالیت: " . $e->getMessage());
        }
    }
}

?>