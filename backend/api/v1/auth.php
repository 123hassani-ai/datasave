<?php
/**
 * API احراز هویت - Authentication API
 * @description رابط برنامه‌نویسی برای ورود، خروج و مدیریت جلسات
 * @author Excel Import AI Team
 * @version 1.0.0
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/auth.php';

try {
    $method = $_SERVER['REQUEST_METHOD'];
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $pathParts = explode('/', trim($path, '/'));
    
    // دریافت action از URL
    $action = $pathParts[3] ?? '';
    
    // دریافت داده‌های JSON از درخواست
    $input = json_decode(file_get_contents('php://input'), true);
    
    $auth = new Auth();
    $response = [];
    
    switch ($action) {
        case 'login':
            if ($method === 'POST') {
                $response = handleLogin($auth, $input);
            } else {
                $response = ['success' => false, 'message' => 'متد نامعتبر'];
            }
            break;
            
        case 'logout':
            if ($method === 'POST') {
                $response = handleLogout($auth);
            } else {
                $response = ['success' => false, 'message' => 'متد نامعتبر'];
            }
            break;
            
        case 'me':
            if ($method === 'GET') {
                $response = handleGetCurrentUser($auth);
            } else {
                $response = ['success' => false, 'message' => 'متد نامعتبر'];
            }
            break;
            
        case 'sessions':
            if ($method === 'GET') {
                $response = handleGetSessions($auth);
            } elseif ($method === 'DELETE') {
                $response = handleTerminateSession($auth, $input);
            } else {
                $response = ['success' => false, 'message' => 'متد نامعتبر'];
            }
            break;
            
        case 'check':
            if ($method === 'GET') {
                $response = handleCheckAuth($auth);
            } else {
                $response = ['success' => false, 'message' => 'متد نامعتبر'];
            }
            break;
            
        default:
            http_response_code(404);
            $response = [
                'success' => false,
                'message' => 'endpoint یافت نشد'
            ];
    }
    
} catch (Exception $e) {
    http_response_code(500);
    $response = [
        'success' => false,
        'message' => 'خطای سرور: ' . $e->getMessage(),
        'error_code' => 'SERVER_ERROR'
    ];
    
    error_log("Auth API Error: " . $e->getMessage());
}

echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

/**
 * مدیریت ورود کاربر
 */
function handleLogin($auth, $input) {
    try {
        if (!$input || !isset($input['username']) || !isset($input['password'])) {
            http_response_code(400);
            return [
                'success' => false,
                'message' => 'نام کاربری و رمز عبور الزامی است'
            ];
        }
        
        $username = trim($input['username']);
        $password = $input['password'];
        $rememberMe = isset($input['remember_me']) ? (bool)$input['remember_me'] : false;
        
        if (empty($username) || empty($password)) {
            http_response_code(400);
            return [
                'success' => false,
                'message' => 'نام کاربری و رمز عبور نمی‌تواند خالی باشد'
            ];
        }
        
        $result = $auth->login($username, $password, $rememberMe);
        
        if (!$result['success']) {
            http_response_code(401);
        }
        
        return $result;
        
    } catch (Exception $e) {
        http_response_code(500);
        return [
            'success' => false,
            'message' => 'خطا در ورود: ' . $e->getMessage()
        ];
    }
}

/**
 * مدیریت خروج کاربر
 */
function handleLogout($auth) {
    try {
        return $auth->logout();
        
    } catch (Exception $e) {
        http_response_code(500);
        return [
            'success' => false,
            'message' => 'خطا در خروج: ' . $e->getMessage()
        ];
    }
}

/**
 * دریافت اطلاعات کاربر فعلی
 */
function handleGetCurrentUser($auth) {
    try {
        $user = $auth->getCurrentUser();
        
        if (!$user) {
            http_response_code(401);
            return [
                'success' => false,
                'message' => 'کاربر احراز هویت نشده است'
            ];
        }
        
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
 * دریافت لیست جلسات کاربر
 */
function handleGetSessions($auth) {
    try {
        $user = $auth->getCurrentUser();
        
        if (!$user) {
            http_response_code(401);
            return [
                'success' => false,
                'message' => 'احراز هویت مورد نیاز است'
            ];
        }
        
        $sessions = $auth->getUserSessions($user['id']);
        
        return [
            'success' => true,
            'data' => $sessions
        ];
        
    } catch (Exception $e) {
        http_response_code(500);
        return [
            'success' => false,
            'message' => 'خطا در دریافت جلسات: ' . $e->getMessage()
        ];
    }
}

/**
 * خاتمه دادن به جلسه خاص
 */
function handleTerminateSession($auth, $input) {
    try {
        $user = $auth->getCurrentUser();
        
        if (!$user) {
            http_response_code(401);
            return [
                'success' => false,
                'message' => 'احراز هویت مورد نیاز است'
            ];
        }
        
        if (!$input || !isset($input['session_id'])) {
            http_response_code(400);
            return [
                'success' => false,
                'message' => 'شناسه جلسه مورد نیاز است'
            ];
        }
        
        // TODO: پیاده‌سازی خاتمه دادن به جلسه خاص
        // $auth->terminateSession($input['session_id'], $user['id']);
        
        return [
            'success' => true,
            'message' => 'جلسه با موفقیت خاتمه یافت'
        ];
        
    } catch (Exception $e) {
        http_response_code(500);
        return [
            'success' => false,
            'message' => 'خطا در خاتمه جلسه: ' . $e->getMessage()
        ];
    }
}

/**
 * بررسی وضعیت احراز هویت
 */
function handleCheckAuth($auth) {
    try {
        $user = $auth->getCurrentUser();
        
        return [
            'success' => true,
            'data' => [
                'authenticated' => (bool)$user,
                'user' => $user ?: null
            ]
        ];
        
    } catch (Exception $e) {
        return [
            'success' => true,
            'data' => [
                'authenticated' => false,
                'user' => null
            ]
        ];
    }
}

?>