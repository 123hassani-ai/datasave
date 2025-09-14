<?php
/**
 * سیستم احراز هویت - Authentication System
 * @description مدیریت احراز هویت و جلسات کاربری
 * @author Excel Import AI Team
 * @version 1.0.0
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/User.php';

class Auth {
    private $db;
    private $sessionTable = 'ai_user_sessions';
    private $userModel;
    
    public function __construct() {
        $this->db = Database::getInstance();
        $this->userModel = new User();
        
        // شروع جلسه PHP
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
    }
    
    /**
     * ورود کاربر
     * @param string $username
     * @param string $password
     * @param bool $rememberMe
     * @return array
     */
    public function login($username, $password, $rememberMe = false) {
        try {
            // احراز هویت کاربر
            $user = $this->userModel->authenticate($username, $password);
            
            if (!$user) {
                return [
                    'success' => false,
                    'message' => 'نام کاربری یا رمز عبور اشتباه است'
                ];
            }
            
            // بررسی فعال بودن حساب
            if (!$user['is_active']) {
                return [
                    'success' => false,
                    'message' => 'حساب کاربری غیرفعال است'
                ];
            }
            
            // ایجاد جلسه جدید
            $sessionId = $this->createSession($user['id'], $rememberMe);
            
            // تنظیم متغیرهای جلسه
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['session_id'] = $sessionId;
            $_SESSION['login_time'] = time();
            
            // تنظیم کوکی (در صورت Remember Me)
            if ($rememberMe) {
                setcookie('remember_token', $sessionId, time() + (30 * 24 * 60 * 60), '/', '', false, true);
            }
            
            // حذف اطلاعات حساس
            unset($user['password'], $user['two_factor_secret']);
            
            return [
                'success' => true,
                'message' => 'ورود موفقیت‌آمیز',
                'data' => [
                    'user' => $user,
                    'session_id' => $sessionId,
                    'expires_in' => $rememberMe ? 30 * 24 * 60 * 60 : 2 * 60 * 60
                ]
            ];
            
        } catch (Exception $e) {
            error_log("خطا در ورود کاربر: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'خطای سیستم در ورود'
            ];
        }
    }
    
    /**
     * خروج کاربر
     * @return array
     */
    public function logout() {
        try {
            $sessionId = $_SESSION['session_id'] ?? null;
            
            if ($sessionId) {
                $this->invalidateSession($sessionId);
            }
            
            // پاک کردن جلسه PHP
            session_destroy();
            
            // پاک کردن کوکی Remember Me
            if (isset($_COOKIE['remember_token'])) {
                setcookie('remember_token', '', time() - 3600, '/', '', false, true);
            }
            
            return [
                'success' => true,
                'message' => 'خروج موفقیت‌آمیز'
            ];
            
        } catch (Exception $e) {
            error_log("خطا در خروج کاربر: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'خطای سیستم در خروج'
            ];
        }
    }
    
    /**
     * بررسی احراز هویت کاربر فعلی
     * @return array|false
     */
    public function getCurrentUser() {
        try {
            $userId = $_SESSION['user_id'] ?? null;
            $sessionId = $_SESSION['session_id'] ?? $_COOKIE['remember_token'] ?? null;
            
            if (!$userId || !$sessionId) {
                return false;
            }
            
            // بررسی معتبر بودن جلسه
            if (!$this->isSessionValid($sessionId, $userId)) {
                $this->logout();
                return false;
            }
            
            // دریافت اطلاعات کاربر
            $user = $this->userModel->getById($userId);
            
            if (!$user || !$user['is_active']) {
                $this->logout();
                return false;
            }
            
            // بروزرسانی آخرین فعالیت
            $this->updateSessionActivity($sessionId);
            
            // حذف اطلاعات حساس
            unset($user['password'], $user['two_factor_secret']);
            
            return $user;
            
        } catch (Exception $e) {
            error_log("خطا در بررسی کاربر فعلی: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * بررسی دسترسی کاربر
     * @param string|array $permission
     * @return bool
     */
    public function hasPermission($permission) {
        $user = $this->getCurrentUser();
        
        if (!$user) {
            return false;
        }
        
        $userPermissions = json_decode($user['permissions'] ?? '{}', true);
        
        if (isset($userPermissions['all']) && $userPermissions['all']) {
            return true;
        }
        
        if (is_string($permission)) {
            return isset($userPermissions[$permission]) && $userPermissions[$permission];
        }
        
        if (is_array($permission)) {
            foreach ($permission as $perm) {
                if (isset($userPermissions[$perm]) && $userPermissions[$perm]) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    /**
     * ایجاد جلسه جدید
     * @param int $userId
     * @param bool $longTerm
     * @return string
     */
    private function createSession($userId, $longTerm = false) {
        try {
            $sessionId = bin2hex(random_bytes(32));
            $expiresAt = date('Y-m-d H:i:s', time() + ($longTerm ? 30 * 24 * 60 * 60 : 2 * 60 * 60));
            
            // اطلاعات دستگاه و مرورگر
            $deviceInfo = [
                'platform' => $this->detectPlatform(),
                'browser' => $this->detectBrowser(),
                'is_mobile' => $this->isMobile()
            ];
            
            $sql = "INSERT INTO {$this->sessionTable} 
                    (user_id, session_id, ip_address, user_agent, device_info, expires_at) 
                    VALUES (:user_id, :session_id, :ip_address, :user_agent, :device_info, :expires_at)";
            
            $this->db->query($sql, [
                'user_id' => $userId,
                'session_id' => $sessionId,
                'ip_address' => $_SERVER['REMOTE_ADDR'] ?? '',
                'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
                'device_info' => json_encode($deviceInfo),
                'expires_at' => $expiresAt
            ]);
            
            return $sessionId;
            
        } catch (Exception $e) {
            error_log("خطا در ایجاد جلسه: " . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * بررسی معتبر بودن جلسه
     * @param string $sessionId
     * @param int $userId
     * @return bool
     */
    private function isSessionValid($sessionId, $userId) {
        try {
            $sql = "SELECT id FROM {$this->sessionTable} 
                    WHERE session_id = :session_id 
                    AND user_id = :user_id 
                    AND is_active = 1 
                    AND expires_at > NOW()";
            
            $stmt = $this->db->query($sql, [
                'session_id' => $sessionId,
                'user_id' => $userId
            ]);
            
            return $stmt->rowCount() > 0;
            
        } catch (Exception $e) {
            error_log("خطا در بررسی جلسه: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * بروزرسانی آخرین فعالیت جلسه
     * @param string $sessionId
     */
    private function updateSessionActivity($sessionId) {
        try {
            $sql = "UPDATE {$this->sessionTable} 
                    SET last_activity = NOW() 
                    WHERE session_id = :session_id";
            
            $this->db->query($sql, ['session_id' => $sessionId]);
            
        } catch (Exception $e) {
            error_log("خطا در بروزرسانی فعالیت جلسه: " . $e->getMessage());
        }
    }
    
    /**
     * باطل کردن جلسه
     * @param string $sessionId
     */
    private function invalidateSession($sessionId) {
        try {
            $sql = "UPDATE {$this->sessionTable} 
                    SET is_active = 0 
                    WHERE session_id = :session_id";
            
            $this->db->query($sql, ['session_id' => $sessionId]);
            
        } catch (Exception $e) {
            error_log("خطا در باطل کردن جلسه: " . $e->getMessage());
        }
    }
    
    /**
     * تشخیص پلتفرم
     * @return string
     */
    private function detectPlatform() {
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
        
        if (preg_match('/Windows/i', $userAgent)) return 'Windows';
        if (preg_match('/Mac/i', $userAgent)) return 'Mac';
        if (preg_match('/Linux/i', $userAgent)) return 'Linux';
        if (preg_match('/Android/i', $userAgent)) return 'Android';
        if (preg_match('/iOS|iPhone|iPad/i', $userAgent)) return 'iOS';
        
        return 'Unknown';
    }
    
    /**
     * تشخیص مرورگر
     * @return string
     */
    private function detectBrowser() {
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
        
        if (preg_match('/Edge/i', $userAgent)) return 'Edge';
        if (preg_match('/Chrome/i', $userAgent)) return 'Chrome';
        if (preg_match('/Firefox/i', $userAgent)) return 'Firefox';
        if (preg_match('/Safari/i', $userAgent)) return 'Safari';
        if (preg_match('/Opera/i', $userAgent)) return 'Opera';
        
        return 'Unknown';
    }
    
    /**
     * تشخیص دستگاه موبایل
     * @return bool
     */
    private function isMobile() {
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
        return preg_match('/Mobile|Android|iPhone|iPad/i', $userAgent);
    }
    
    /**
     * دریافت لیست جلسات فعال کاربر
     * @param int $userId
     * @return array
     */
    public function getUserSessions($userId) {
        try {
            $sql = "SELECT session_id, ip_address, device_info, last_activity, created_at, expires_at 
                    FROM {$this->sessionTable} 
                    WHERE user_id = :user_id AND is_active = 1 AND expires_at > NOW() 
                    ORDER BY last_activity DESC";
            
            $stmt = $this->db->query($sql, ['user_id' => $userId]);
            $sessions = $stmt->fetchAll();
            
            foreach ($sessions as &$session) {
                $session['device_info'] = json_decode($session['device_info'], true);
                $session['is_current'] = $session['session_id'] === ($_SESSION['session_id'] ?? '');
            }
            
            return $sessions;
            
        } catch (Exception $e) {
            error_log("خطا در دریافت جلسات کاربر: " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * پاک کردن جلسات منقضی شده
     */
    public function cleanExpiredSessions() {
        try {
            $sql = "DELETE FROM {$this->sessionTable} WHERE expires_at < NOW()";
            $this->db->query($sql);
            
        } catch (Exception $e) {
            error_log("خطا در پاک کردن جلسات منقضی: " . $e->getMessage());
        }
    }
}

/**
 * middleware بررسی احراز هویت
 */
function requireAuth() {
    $auth = new Auth();
    $user = $auth->getCurrentUser();
    
    if (!$user) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'احراز هویت مورد نیاز است',
            'error_code' => 'UNAUTHORIZED'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    return $user;
}

/**
 * middleware بررسی دسترسی
 */
function requirePermission($permission) {
    $auth = new Auth();
    
    if (!$auth->hasPermission($permission)) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'عدم دسترسی کافی',
            'error_code' => 'FORBIDDEN'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

?>