<?php
/**
 * API کاربران - Users API
 * @description رابط برنامه‌نویسی برای مدیریت کاربران
 * @author Excel Import AI Team
 * @version 1.0.0
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

require_once __DIR__ . '/../../models/User.php';
require_once __DIR__ . '/../auth.php';

try {
    $method = $_SERVER['REQUEST_METHOD'];
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $pathParts = explode('/', trim($path, '/'));
    
    // دریافت شناسه کاربر از URL (در صورت وجود)
    $userId = isset($pathParts[3]) && is_numeric($pathParts[3]) ? (int)$pathParts[3] : null;
    
    // دریافت داده‌های JSON از درخواست
    $input = json_decode(file_get_contents('php://input'), true);
    
    $userModel = new User();
    $response = [];
    
    switch ($method) {
        case 'GET':
            if ($userId) {
                // دریافت کاربر مشخص
                $response = handleGetUser($userModel, $userId);
            } else {
                // دریافت لیست کاربران
                $response = handleGetUsers($userModel);
            }
            break;
            
        case 'POST':
            // ایجاد کاربر جدید
            $response = handleCreateUser($userModel, $input);
            break;
            
        case 'PUT':
            if ($userId) {
                // بروزرسانی کاربر
                $response = handleUpdateUser($userModel, $userId, $input);
            } else {
                $response = [
                    'success' => false,
                    'message' => 'شناسه کاربر مشخص نشده است'
                ];
            }
            break;
            
        case 'DELETE':
            if ($userId) {
                // حذف کاربر
                $response = handleDeleteUser($userModel, $userId);
            } else {
                $response = [
                    'success' => false,
                    'message' => 'شناسه کاربر مشخص نشده است'
                ];
            }
            break;
            
        default:
            http_response_code(405);
            $response = [
                'success' => false,
                'message' => 'متد درخواست پشتیبانی نمی‌شود'
            ];
    }
    
} catch (Exception $e) {
    http_response_code(500);
    $response = [
        'success' => false,
        'message' => 'خطای سرور: ' . $e->getMessage(),
        'error_code' => 'SERVER_ERROR'
    ];
    
    error_log("API Error: " . $e->getMessage());
}

echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

/**
 * دریافت اطلاعات یک کاربر
 */
function handleGetUser($userModel, $userId) {
    try {
        $user = $userModel->getById($userId);
        
        if (!$user) {
            http_response_code(404);
            return [
                'success' => false,
                'message' => 'کاربر یافت نشد'
            ];
        }
        
        // حذف اطلاعات حساس
        unset($user['password'], $user['two_factor_secret']);
        
        return [
            'success' => true,
            'data' => $user
        ];
        
    } catch (Exception $e) {
        http_response_code(500);
        return [
            'success' => false,
            'message' => 'خطا در دریافت اطلاعات کاربر: ' . $e->getMessage()
        ];
    }
}

/**
 * دریافت لیست کاربران
 */
function handleGetUsers($userModel) {
    try {
        $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
        $limit = isset($_GET['limit']) ? min(100, max(10, (int)$_GET['limit'])) : 20;
        
        $filters = [];
        
        // فیلتر جستجو
        if (!empty($_GET['search'])) {
            $filters['search'] = $_GET['search'];
        }
        
        // فیلتر وضعیت فعالی
        if (isset($_GET['is_active'])) {
            $filters['is_active'] = (bool)$_GET['is_active'];
        }
        
        // فیلتر گروه کاربری
        if (!empty($_GET['user_group_id'])) {
            $filters['user_group_id'] = (int)$_GET['user_group_id'];
        }
        
        $result = $userModel->getList($filters, $page, $limit);
        
        // حذف اطلاعات حساس از همه کاربران
        foreach ($result['data'] as &$user) {
            unset($user['password'], $user['two_factor_secret']);
        }
        
        return [
            'success' => true,
            'data' => $result['data'],
            'pagination' => [
                'page' => $result['page'],
                'limit' => $result['limit'],
                'total' => $result['total'],
                'pages' => $result['pages']
            ]
        ];
        
    } catch (Exception $e) {
        http_response_code(500);
        return [
            'success' => false,
            'message' => 'خطا در دریافت لیست کاربران: ' . $e->getMessage()
        ];
    }
}

/**
 * ایجاد کاربر جدید
 */
function handleCreateUser($userModel, $input) {
    try {
        if (!$input) {
            http_response_code(400);
            return [
                'success' => false,
                'message' => 'داده‌های ورودی نامعتبر است'
            ];
        }
        
        // اعتبارسنجی فیلدهای اجباری
        $required = ['username', 'email', 'password'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                http_response_code(400);
                return [
                    'success' => false,
                    'message' => "فیلد {$field} اجباری است"
                ];
            }
        }
        
        // تمیزکاری و اعتبارسنجی داده‌ها
        $userData = sanitizeUserData($input);
        
        $userId = $userModel->create($userData);
        
        if ($userId) {
            $newUser = $userModel->getById($userId);
            unset($newUser['password'], $newUser['two_factor_secret']);
            
            http_response_code(201);
            return [
                'success' => true,
                'message' => 'کاربر با موفقیت ایجاد شد',
                'data' => $newUser
            ];
        } else {
            http_response_code(400);
            return [
                'success' => false,
                'message' => 'خطا در ایجاد کاربر'
            ];
        }
        
    } catch (Exception $e) {
        http_response_code(400);
        return [
            'success' => false,
            'message' => $e->getMessage()
        ];
    }
}

/**
 * بروزرسانی کاربر
 */
function handleUpdateUser($userModel, $userId, $input) {
    try {
        if (!$input) {
            http_response_code(400);
            return [
                'success' => false,
                'message' => 'داده‌های ورودی نامعتبر است'
            ];
        }
        
        // بررسی وجود کاربر
        $existingUser = $userModel->getById($userId);
        if (!$existingUser) {
            http_response_code(404);
            return [
                'success' => false,
                'message' => 'کاربر یافت نشد'
            ];
        }
        
        // تمیزکاری داده‌ها
        $userData = sanitizeUserData($input, false);
        
        $success = $userModel->update($userId, $userData);
        
        if ($success) {
            $updatedUser = $userModel->getById($userId);
            unset($updatedUser['password'], $updatedUser['two_factor_secret']);
            
            return [
                'success' => true,
                'message' => 'اطلاعات کاربر با موفقیت بروزرسانی شد',
                'data' => $updatedUser
            ];
        } else {
            http_response_code(400);
            return [
                'success' => false,
                'message' => 'خطا در بروزرسانی کاربر'
            ];
        }
        
    } catch (Exception $e) {
        http_response_code(400);
        return [
            'success' => false,
            'message' => $e->getMessage()
        ];
    }
}

/**
 * حذف کاربر
 */
function handleDeleteUser($userModel, $userId) {
    try {
        // بررسی وجود کاربر
        $existingUser = $userModel->getById($userId);
        if (!$existingUser) {
            http_response_code(404);
            return [
                'success' => false,
                'message' => 'کاربر یافت نشد'
            ];
        }
        
        $success = $userModel->delete($userId);
        
        if ($success) {
            return [
                'success' => true,
                'message' => 'کاربر با موفقیت حذف شد'
            ];
        } else {
            http_response_code(400);
            return [
                'success' => false,
                'message' => 'خطا در حذف کاربر'
            ];
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        return [
            'success' => false,
            'message' => 'خطا در حذف کاربر: ' . $e->getMessage()
        ];
    }
}

/**
 * تمیزکاری و اعتبارسنجی داده‌های کاربر
 */
function sanitizeUserData($input, $isCreate = true) {
    $allowedFields = [
        'username', 'email', 'mobile', 'password', 'first_name', 'last_name',
        'national_id', 'birth_date', 'gender', 'phone', 'address', 'city',
        'state', 'postal_code', 'country', 'user_group_id', 'is_active',
        'is_verified', 'is_email_verified', 'is_mobile_verified', 'avatar_path',
        'bio', 'website', 'timezone', 'language', 'two_factor_enabled'
    ];
    
    $userData = [];
    
    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            $value = $input[$field];
            
            // تمیزکاری داده‌ها
            if (is_string($value)) {
                $value = trim($value);
            }
            
            // اعتبارسنجی خاص فیلدها
            switch ($field) {
                case 'email':
                    if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                        throw new Exception('فرمت ایمیل نامعتبر است');
                    }
                    break;
                    
                case 'mobile':
                    if ($value && !preg_match('/^09\d{9}$/', $value)) {
                        throw new Exception('فرمت شماره موبایل نامعتبر است');
                    }
                    break;
                    
                case 'national_id':
                    if ($value && !preg_match('/^\d{10}$/', $value)) {
                        throw new Exception('کد ملی باید 10 رقم باشد');
                    }
                    break;
                    
                case 'birth_date':
                    if ($value && !strtotime($value)) {
                        throw new Exception('فرمت تاریخ تولد نامعتبر است');
                    }
                    break;
                    
                case 'website':
                    if ($value && !filter_var($value, FILTER_VALIDATE_URL)) {
                        throw new Exception('آدرس وب‌سایت نامعتبر است');
                    }
                    break;
            }
            
            $userData[$field] = $value;
        }
    }
    
    return $userData;
}

?>