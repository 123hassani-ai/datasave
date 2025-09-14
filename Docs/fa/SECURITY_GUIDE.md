# راهنمای امنیت و پیکربندی - DataSave

![Security](https://img.shields.io/badge/Security-First-red?style=for-the-badge)
![Compliance](https://img.shields.io/badge/OWASP-Compliant-green?style=for-the-badge)

## 📋 فهرست مطالب
- [🛡️ نمای کلی امنیت](#️-نمای-کلی-امنیت)
- [🔐 احراز هویت و مجوزها](#-احراز-هویت-و-مجوزها)
- [🔒 حفاظت از داده‌ها](#-حفاظت-از-داده‌ها)
- [🚨 تشخیص تهدیدات](#-تشخیص-تهدیدات)
- [📝 لاگ‌گیری امنیتی](#-لاگ‌گیری-امنیتی)
- [🔧 پیکربندی Production](#-پیکربندی-production)
- [📊 Monitoring و Alerting](#-monitoring-و-alerting)

---

## 🛡️ نمای کلی امنیت

### 🎯 اصول امنیتی پیاده‌شده

#### 1. Defense in Depth (دفاع چندلایه)
```
┌─────────────────────────────────────────────────────────┐
│                   🌐 Network Layer                      │
│  • Firewall Rules    • DDoS Protection    • VPN        │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                 🔒 Application Layer                    │
│  • WAF Protection   • Rate Limiting    • CSRF Guards   │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                  🔐 Authentication                      │
│  • JWT Tokens      • 2FA Support      • Session Mgmt   │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                  🗃️ Data Protection                     │
│  • Encryption      • Input Validation  • SQL Injection │
└─────────────────────────────────────────────────────────┘
```

#### 2. Security by Design
- **Least Privilege**: حداقل دسترسی‌های لازم
- **Fail Secure**: در صورت خطا، حالت امن
- **Zero Trust**: هیچ entity را بدون تایید trust نکن
- **Data Minimization**: کمترین داده لازم را جمع‌آوری کن

### 🚨 OWASP Top 10 Coverage

| تهدید | وضعیت | پیاده‌سازی |
|--------|---------|-------------|
| Injection | ✅ محافظت شده | Prepared Statements |
| Broken Authentication | ✅ محافظت شده | JWT + bcrypt |
| Sensitive Data Exposure | ✅ محافظت شده | AES Encryption |
| XML External Entities | ✅ محافظت شده | XML Parser Disabled |
| Broken Access Control | ✅ محافظت شده | RBAC System |
| Security Misconfiguration | ✅ محافظت شده | Security Headers |
| Cross-Site Scripting | ✅ محافظت شده | CSP + Sanitization |
| Insecure Deserialization | ✅ محافظت شده | Safe JSON Only |
| Known Vulnerabilities | ✅ محافظت شده | Dependency Scanning |
| Insufficient Logging | ✅ محافظت شده | Comprehensive Logs |

---

## 🔐 احراز هویت و مجوزها

### 🎫 JWT Authentication System

#### Token Structure
```javascript
// Header
{
    "alg": "HS256",
    "typ": "JWT"
}

// Payload
{
    "user_id": 123,
    "username": "admin",
    "role": "admin",
    "permissions": ["read", "write", "admin"],
    "iat": 1640995200,    // Issued At
    "exp": 1641081600,    // Expiration
    "iss": "datasave",    // Issuer
    "aud": "datasave-api" // Audience
}
```

#### Secure Token Implementation
```php
<?php
class JWTManager
{
    private string $secret;
    private int $expiration;
    
    public function __construct()
    {
        $this->secret = $_ENV['JWT_SECRET'] ?? throw new Exception('JWT_SECRET not set');
        $this->expiration = 3600; // 1 hour
    }
    
    public function generateToken(array $payload): string
    {
        $header = base64url_encode(json_encode([
            'alg' => 'HS256',
            'typ' => 'JWT'
        ]));
        
        $payload['iat'] = time();
        $payload['exp'] = time() + $this->expiration;
        $payload['iss'] = 'datasave';
        $payload['aud'] = 'datasave-api';
        
        $payloadEncoded = base64url_encode(json_encode($payload));
        $signature = base64url_encode(hash_hmac('sha256', 
            $header . '.' . $payloadEncoded, 
            $this->secret, 
            true
        ));
        
        return $header . '.' . $payloadEncoded . '.' . $signature;
    }
    
    public function validateToken(string $token): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }
        
        [$header, $payload, $signature] = $parts;
        
        // Verify signature
        $expectedSignature = base64url_encode(hash_hmac('sha256',
            $header . '.' . $payload,
            $this->secret,
            true
        ));
        
        if (!hash_equals($signature, $expectedSignature)) {
            return null;
        }
        
        $payloadData = json_decode(base64url_decode($payload), true);
        
        // Check expiration
        if ($payloadData['exp'] < time()) {
            return null;
        }
        
        return $payloadData;
    }
}
```

### 🔑 Password Security

#### Secure Password Hashing
```php
<?php
class PasswordManager
{
    public static function hash(string $password): string
    {
        // استفاده از Argon2ID (بهترین الگوریتم فعلی)
        return password_hash($password, PASSWORD_ARGON2ID, [
            'memory_cost' => 65536,  // 64 MB
            'time_cost' => 4,        // 4 iterations
            'threads' => 3           // 3 threads
        ]);
    }
    
    public static function verify(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }
    
    public static function needsRehash(string $hash): bool
    {
        return password_needs_rehash($hash, PASSWORD_ARGON2ID, [
            'memory_cost' => 65536,
            'time_cost' => 4,
            'threads' => 3
        ]);
    }
}
```

#### Password Policy
```javascript
// Frontend Password Validation
class PasswordValidator {
    static validatePassword(password) {
        const rules = {
            minLength: password.length >= 12,
            hasUpper: /[A-Z]/.test(password),
            hasLower: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
            noCommon: !this.isCommonPassword(password),
            noPersonal: !this.containsPersonalInfo(password)
        };
        
        const score = Object.values(rules).filter(Boolean).length;
        
        return {
            isValid: score >= 6,
            score: score,
            rules: rules,
            strength: this.getStrengthLevel(score)
        };
    }
    
    static isCommonPassword(password) {
        const commonPasswords = [
            'password', '123456', 'admin', 'qwerty',
            'password123', 'admin123', '123456789'
        ];
        return commonPasswords.includes(password.toLowerCase());
    }
    
    static getStrengthLevel(score) {
        if (score <= 3) return 'ضعیف';
        if (score <= 5) return 'متوسط';
        if (score <= 6) return 'قوی';
        return 'بسیار قوی';
    }
}
```

### 👥 Role-Based Access Control (RBAC)

#### Permission System
```php
<?php
class PermissionManager
{
    private PDO $db;
    
    // Roles و Permissions
    private const ROLES = [
        'admin' => [
            'user:create', 'user:read', 'user:update', 'user:delete',
            'data:create', 'data:read', 'data:update', 'data:delete',
            'ai:configure', 'sms:send', 'system:configure'
        ],
        'manager' => [
            'user:read', 'user:update',
            'data:create', 'data:read', 'data:update',
            'ai:use', 'sms:send'
        ],
        'user' => [
            'data:read', 'data:create',
            'profile:update'
        ],
        'viewer' => [
            'data:read'
        ]
    ];
    
    public function hasPermission(string $userRole, string $permission): bool
    {
        return in_array($permission, self::ROLES[$userRole] ?? []);
    }
    
    public function checkAccess(int $userId, string $resource, string $action): bool
    {
        $user = $this->getUserById($userId);
        if (!$user) return false;
        
        $permission = $resource . ':' . $action;
        return $this->hasPermission($user['role'], $permission);
    }
    
    public function requirePermission(string $permission): void
    {
        $user = $this->getCurrentUser();
        if (!$this->hasPermission($user['role'], $permission)) {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'error' => 'دسترسی غیرمجاز: ' . $permission
            ]);
            exit;
        }
    }
}
```

---

## 🔒 حفاظت از داده‌ها

### 🔐 Data Encryption

#### Sensitive Data Encryption
```php
<?php
class DataEncryption
{
    private string $key;
    private string $cipher = 'AES-256-GCM';
    
    public function __construct()
    {
        $this->key = $_ENV['ENCRYPTION_KEY'] ?? $this->generateKey();
    }
    
    public function encrypt(string $data): string
    {
        $iv = random_bytes(12); // 96-bit IV for GCM
        $tag = '';
        
        $encrypted = openssl_encrypt(
            $data, 
            $this->cipher, 
            $this->key, 
            OPENSSL_RAW_DATA, 
            $iv, 
            $tag
        );
        
        // Combine IV + tag + encrypted data
        return base64_encode($iv . $tag . $encrypted);
    }
    
    public function decrypt(string $encryptedData): ?string
    {
        $data = base64_decode($encryptedData);
        if ($data === false) return null;
        
        $iv = substr($data, 0, 12);
        $tag = substr($data, 12, 16);
        $encrypted = substr($data, 28);
        
        $decrypted = openssl_decrypt(
            $encrypted,
            $this->cipher,
            $this->key,
            OPENSSL_RAW_DATA,
            $iv,
            $tag
        );
        
        return $decrypted !== false ? $decrypted : null;
    }
    
    private function generateKey(): string
    {
        return random_bytes(32); // 256-bit key
    }
}
```

#### Database Encryption for API Keys
```sql
-- جدول ذخیره کلیدهای API با رمزنگاری
CREATE TABLE encrypted_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    setting_name VARCHAR(100) NOT NULL,
    encrypted_value TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_user_setting (user_id, setting_name),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 🛡️ Input Validation & Sanitization

#### Comprehensive Input Validator
```php
<?php
class InputValidator
{
    public static function validateAndSanitize(array $data, array $rules): array
    {
        $validated = [];
        $errors = [];
        
        foreach ($rules as $field => $rule) {
            $value = $data[$field] ?? null;
            
            try {
                $validated[$field] = self::applyRule($value, $rule);
            } catch (ValidationException $e) {
                $errors[$field] = $e->getMessage();
            }
        }
        
        if (!empty($errors)) {
            throw new ValidationException('Validation failed', $errors);
        }
        
        return $validated;
    }
    
    private static function applyRule($value, array $rule)
    {
        // Required check
        if (isset($rule['required']) && $rule['required'] && empty($value)) {
            throw new ValidationException('این فیلد الزامی است');
        }
        
        if (empty($value)) {
            return $rule['default'] ?? null;
        }
        
        // Type validation
        switch ($rule['type']) {
            case 'email':
                $value = filter_var($value, FILTER_SANITIZE_EMAIL);
                if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    throw new ValidationException('ایمیل نامعتبر');
                }
                break;
                
            case 'username':
                $value = preg_replace('/[^a-zA-Z0-9_.-]/', '', $value);
                if (strlen($value) < 3 || strlen($value) > 50) {
                    throw new ValidationException('نام کاربری باید بین 3 تا 50 کاراکتر باشد');
                }
                break;
                
            case 'integer':
                if (!filter_var($value, FILTER_VALIDATE_INT)) {
                    throw new ValidationException('مقدار باید عدد صحیح باشد');
                }
                $value = (int)$value;
                break;
                
            case 'string':
                $value = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
                if (isset($rule['max_length']) && strlen($value) > $rule['max_length']) {
                    throw new ValidationException('طول متن بیش از حد مجاز');
                }
                break;
                
            case 'json':
                $decoded = json_decode($value, true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    throw new ValidationException('فرمت JSON نامعتبر');
                }
                $value = $decoded;
                break;
        }
        
        return $value;
    }
}

// Usage Example
$rules = [
    'username' => ['type' => 'username', 'required' => true],
    'email' => ['type' => 'email', 'required' => true],
    'age' => ['type' => 'integer', 'required' => false, 'default' => 0],
    'bio' => ['type' => 'string', 'max_length' => 500]
];

$validatedData = InputValidator::validateAndSanitize($_POST, $rules);
```

### 🔍 SQL Injection Prevention

#### Safe Database Operations
```php
<?php
class SafeDatabase
{
    private PDO $pdo;
    
    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
        
        // تنظیمات امنیتی PDO
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    }
    
    public function select(string $table, array $conditions = [], array $columns = ['*']): array
    {
        $columnsStr = implode(', ', array_map([$this, 'escapeColumn'], $columns));
        $table = $this->escapeTable($table);
        
        $sql = "SELECT {$columnsStr} FROM {$table}";
        $params = [];
        
        if (!empty($conditions)) {
            $whereClauses = [];
            foreach ($conditions as $column => $value) {
                $placeholder = ':' . $column;
                $whereClauses[] = $this->escapeColumn($column) . ' = ' . $placeholder;
                $params[$placeholder] = $value;
            }
            $sql .= ' WHERE ' . implode(' AND ', $whereClauses);
        }
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        
        return $stmt->fetchAll();
    }
    
    public function insert(string $table, array $data): int
    {
        $table = $this->escapeTable($table);
        $columns = array_map([$this, 'escapeColumn'], array_keys($data));
        $placeholders = array_map(fn($col) => ':' . $col, array_keys($data));
        
        $sql = "INSERT INTO {$table} (" . implode(', ', $columns) . ") 
                VALUES (" . implode(', ', $placeholders) . ")";
        
        $params = [];
        foreach ($data as $key => $value) {
            $params[':' . $key] = $value;
        }
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        
        return $this->pdo->lastInsertId();
    }
    
    private function escapeColumn(string $column): string
    {
        // فقط نام‌های ستون معتبر را اجازه بده
        if (!preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $column)) {
            throw new InvalidArgumentException('نام ستون نامعتبر: ' . $column);
        }
        return '`' . $column . '`';
    }
    
    private function escapeTable(string $table): string
    {
        if (!preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $table)) {
            throw new InvalidArgumentException('نام جدول نامعتبر: ' . $table);
        }
        return '`' . $table . '`';
    }
}
```

---

## 🚨 تشخیص تهدیدات

### 🛡️ Web Application Firewall (WAF)

#### PHP-based WAF Implementation
```php
<?php
class SimpleWAF
{
    private array $rules;
    private string $logFile;
    
    public function __construct()
    {
        $this->logFile = 'backend/logs/waf.log';
        $this->rules = [
            'sql_injection' => [
                '/\\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\\b/i',
                '/[\'\"](\\s*)(union|select|insert)(.*)([\'\"]);/i',
                '/\\b(or|and)\\s+[\'\"]*\\d+[\'\"]*\\s*=\\s*[\'\"]*\\d+[\'\"]*\\b/i'
            ],
            'xss' => [
                '/<script[^>]*>.*?<\\/script>/is',
                '/javascript:/i',
                '/on\\w+\\s*=/i',
                '/<iframe[^>]*>.*?<\\/iframe>/is'
            ],
            'path_traversal' => [
                '/\\.\\.[\\/\\\\]/i',
                '/\\.\\.%2f/i',
                '/\\.\\.%5c/i'
            ],
            'command_injection' => [
                '/[;&|`]\\s*(cat|ls|pwd|whoami|id|uname)/i',
                '/\\$\\([^)]*\\)/i',
                '/`[^`]*`/i'
            ]
        ];
    }
    
    public function checkRequest(): bool
    {
        $threats = [];
        
        // بررسی تمام input ها
        $inputs = array_merge($_GET, $_POST, $_COOKIE);
        foreach ($inputs as $key => $value) {
            $threat = $this->detectThreat($value);
            if ($threat) {
                $threats[] = [
                    'type' => $threat,
                    'field' => $key,
                    'value' => $value,
                    'ip' => $_SERVER['REMOTE_ADDR'],
                    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
                    'timestamp' => date('Y-m-d H:i:s')
                ];
            }
        }
        
        if (!empty($threats)) {
            $this->logThreats($threats);
            $this->blockRequest($threats);
            return false;
        }
        
        return true;
    }
    
    private function detectThreat(string $input): ?string
    {
        foreach ($this->rules as $threatType => $patterns) {
            foreach ($patterns as $pattern) {
                if (preg_match($pattern, $input)) {
                    return $threatType;
                }
            }
        }
        return null;
    }
    
    private function logThreats(array $threats): void
    {
        $logEntry = [
            'timestamp' => date('Y-m-d H:i:s'),
            'ip' => $_SERVER['REMOTE_ADDR'],
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
            'uri' => $_SERVER['REQUEST_URI'],
            'method' => $_SERVER['REQUEST_METHOD'],
            'threats' => $threats
        ];
        
        file_put_contents(
            $this->logFile,
            json_encode($logEntry) . "\n",
            FILE_APPEND | LOCK_EX
        );
    }
    
    private function blockRequest(array $threats): void
    {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'error' => 'درخواست مشکوک تشخیص داده شد',
            'code' => 'SECURITY_THREAT_DETECTED',
            'threat_id' => uniqid('threat_', true)
        ]);
        exit;
    }
}
```

### 🔒 Rate Limiting

#### Advanced Rate Limiter
```php
<?php
class RateLimiter
{
    private Redis $redis;
    private array $limits;
    
    public function __construct(Redis $redis)
    {
        $this->redis = $redis;
        $this->limits = [
            'api' => ['requests' => 100, 'window' => 3600],      // 100 per hour
            'login' => ['requests' => 5, 'window' => 900],       // 5 per 15 min
            'upload' => ['requests' => 10, 'window' => 3600],    // 10 per hour
            'sms' => ['requests' => 50, 'window' => 3600]        // 50 per hour
        ];
    }
    
    public function checkLimit(string $identifier, string $action): bool
    {
        if (!isset($this->limits[$action])) {
            return true; // No limit defined
        }
        
        $limit = $this->limits[$action];
        $key = "rate_limit:{$action}:{$identifier}";
        
        // استفاده از Redis sliding window
        $window = $limit['window'];
        $maxRequests = $limit['requests'];
        $now = time();
        
        // حذف درخواست‌های قدیمی
        $this->redis->zRemRangeByScore($key, 0, $now - $window);
        
        // شمارش درخواست‌های فعلی
        $currentRequests = $this->redis->zCard($key);
        
        if ($currentRequests >= $maxRequests) {
            $this->logRateLimit($identifier, $action, $currentRequests);
            return false;
        }
        
        // اضافه کردن درخواست فعلی
        $this->redis->zAdd($key, $now, uniqid());
        $this->redis->expire($key, $window);
        
        return true;
    }
    
    public function getRemainingRequests(string $identifier, string $action): int
    {
        if (!isset($this->limits[$action])) {
            return -1; // Unlimited
        }
        
        $limit = $this->limits[$action];
        $key = "rate_limit:{$action}:{$identifier}";
        $window = $limit['window'];
        $now = time();
        
        $this->redis->zRemRangeByScore($key, 0, $now - $window);
        $currentRequests = $this->redis->zCard($key);
        
        return max(0, $limit['requests'] - $currentRequests);
    }
    
    private function logRateLimit(string $identifier, string $action, int $attempts): void
    {
        $logEntry = [
            'timestamp' => date('Y-m-d H:i:s'),
            'identifier' => $identifier,
            'action' => $action,
            'attempts' => $attempts,
            'ip' => $_SERVER['REMOTE_ADDR'],
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? ''
        ];
        
        file_put_contents(
            'backend/logs/rate_limit.log',
            json_encode($logEntry) . "\n",
            FILE_APPEND | LOCK_EX
        );
    }
}
```

---

## 📝 لاگ‌گیری امنیتی

### 📊 Security Event Logging

#### Comprehensive Security Logger
```php
<?php
class SecurityLogger
{
    private string $logFile;
    private PDO $db;
    
    public function __construct(PDO $db)
    {
        $this->db = $db;
        $this->logFile = 'backend/logs/security.log';
    }
    
    public function logSecurityEvent(string $eventType, array $details): void
    {
        $event = [
            'id' => uniqid('sec_', true),
            'timestamp' => date('Y-m-d H:i:s'),
            'event_type' => $eventType,
            'severity' => $this->getSeverity($eventType),
            'ip_address' => $_SERVER['REMOTE_ADDR'],
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
            'session_id' => session_id(),
            'user_id' => $details['user_id'] ?? null,
            'details' => $details,
            'uri' => $_SERVER['REQUEST_URI'] ?? '',
            'method' => $_SERVER['REQUEST_METHOD'] ?? ''
        ];
        
        // Log to file
        file_put_contents(
            $this->logFile,
            json_encode($event) . "\n",
            FILE_APPEND | LOCK_EX
        );
        
        // Log to database
        $this->logToDatabase($event);
        
        // Alert if critical
        if ($event['severity'] === 'critical') {
            $this->sendAlert($event);
        }
    }
    
    private function getSeverity(string $eventType): string
    {
        $severityMap = [
            'login_failed' => 'medium',
            'login_success' => 'low',
            'bruteforce_attempt' => 'high',
            'sql_injection' => 'critical',
            'xss_attempt' => 'high',
            'unauthorized_access' => 'high',
            'privilege_escalation' => 'critical',
            'data_breach' => 'critical',
            'suspicious_activity' => 'medium'
        ];
        
        return $severityMap[$eventType] ?? 'low';
    }
    
    private function logToDatabase(array $event): void
    {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO security_logs 
                (event_id, timestamp, event_type, severity, ip_address, 
                 user_agent, user_id, details, uri, method) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            $stmt->execute([
                $event['id'],
                $event['timestamp'],
                $event['event_type'],
                $event['severity'],
                $event['ip_address'],
                $event['user_agent'],
                $event['user_id'],
                json_encode($event['details']),
                $event['uri'],
                $event['method']
            ]);
        } catch (PDOException $e) {
            error_log("Failed to log security event: " . $e->getMessage());
        }
    }
    
    private function sendAlert(array $event): void
    {
        // ارسال ایمیل یا webhook برای رویدادهای critical
        $alertMessage = "Security Alert: {$event['event_type']}\n";
        $alertMessage .= "Time: {$event['timestamp']}\n";
        $alertMessage .= "IP: {$event['ip_address']}\n";
        $alertMessage .= "Details: " . json_encode($event['details']);
        
        // Send email or notification
        // mail('admin@example.com', 'Security Alert', $alertMessage);
        
        // Or send to Slack/Discord webhook
        // $this->sendWebhookAlert($alertMessage);
    }
}
```

### 📈 Security Analytics

#### Real-time Threat Analysis
```php
<?php
class SecurityAnalytics
{
    private PDO $db;
    private Redis $redis;
    
    public function __construct(PDO $db, Redis $redis)
    {
        $this->db = $db;
        $this->redis = $redis;
    }
    
    public function analyzeThreats(): array
    {
        return [
            'failed_logins' => $this->getFailedLoginStats(),
            'blocked_ips' => $this->getBlockedIPs(),
            'threat_types' => $this->getThreatTypeStats(),
            'geographic_threats' => $this->getGeographicThreats(),
            'trending_attacks' => $this->getTrendingAttacks()
        ];
    }
    
    private function getFailedLoginStats(): array
    {
        $stmt = $this->db->prepare("
            SELECT 
                DATE(timestamp) as date,
                COUNT(*) as failed_attempts,
                COUNT(DISTINCT ip_address) as unique_ips
            FROM security_logs 
            WHERE event_type = 'login_failed' 
                AND timestamp > DATE_SUB(NOW(), INTERVAL 7 DAY)
            GROUP BY DATE(timestamp)
            ORDER BY date DESC
        ");
        
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    private function getBlockedIPs(): array
    {
        $stmt = $this->db->prepare("
            SELECT 
                ip_address,
                COUNT(*) as incident_count,
                MAX(timestamp) as last_seen,
                GROUP_CONCAT(DISTINCT event_type) as threat_types
            FROM security_logs 
            WHERE severity IN ('high', 'critical')
                AND timestamp > DATE_SUB(NOW(), INTERVAL 24 HOUR)
            GROUP BY ip_address
            HAVING incident_count >= 5
            ORDER BY incident_count DESC
        ");
        
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    public function getSecurityScore(): array
    {
        $last24Hours = $this->getThreatsInTimeframe(24);
        $lastWeek = $this->getThreatsInTimeframe(168);
        
        $score = 100;
        
        // Deduct points based on threats
        $score -= min(30, $last24Hours['critical'] * 10);
        $score -= min(20, $last24Hours['high'] * 2);
        $score -= min(10, $last24Hours['medium'] * 0.5);
        
        return [
            'score' => max(0, $score),
            'level' => $this->getSecurityLevel($score),
            'threats_24h' => $last24Hours,
            'trends' => $this->compareTrends($last24Hours, $lastWeek)
        ];
    }
    
    private function getSecurityLevel(int $score): string
    {
        if ($score >= 90) return 'excellent';
        if ($score >= 75) return 'good';
        if ($score >= 50) return 'fair';
        if ($score >= 25) return 'poor';
        return 'critical';
    }
}
```

---

## 🔧 پیکربندی Production

### 🛡️ Server Hardening

#### Apache Security Configuration
```apache
# httpd.conf / .htaccess

# Hide server information
ServerTokens Prod
ServerSignature Off

# Security headers
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"

# Content Security Policy
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';"

# Prevent access to sensitive files
<FilesMatch "\\.(log|sql|md|txt|conf)$">
    Require all denied
</FilesMatch>

<DirectoryMatch "\\.(git|svn|hg)">
    Require all denied
</DirectoryMatch>

# Disable directory browsing
Options -Indexes -FollowSymLinks

# Prevent PHP execution in upload directories
<Directory "/path/to/uploads">
    php_flag engine off
    AddType text/plain .php .php3 .phtml .pht
</Directory>
```

#### MySQL Security Settings
```sql
-- mysql secure installation equivalent

-- Remove anonymous users
DELETE FROM mysql.user WHERE User='';

-- Remove remote root login
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');

-- Remove test database
DROP DATABASE IF EXISTS test;
DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';

-- Create dedicated user for application
CREATE USER 'datasave_app'@'localhost' IDENTIFIED BY 'strong_random_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON datasave_db.* TO 'datasave_app'@'localhost';

-- Set secure password policy
INSTALL PLUGIN validate_password SONAME 'validate_password.so';
SET GLOBAL validate_password.policy = STRONG;
SET GLOBAL validate_password.length = 12;

-- Enable query logging for monitoring
SET GLOBAL general_log = 'ON';
SET GLOBAL log_queries_not_using_indexes = 'ON';

FLUSH PRIVILEGES;
```

### 🔐 SSL/TLS Configuration

#### Strong SSL Configuration
```apache
# SSL Virtual Host
<VirtualHost *:443>
    ServerName datasave.com
    DocumentRoot /var/www/datasave
    
    # SSL Engine
    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/datasave.crt
    SSLCertificateKeyFile /etc/ssl/private/datasave.key
    SSLCertificateChainFile /etc/ssl/certs/intermediate.crt
    
    # Modern SSL Configuration
    SSLProtocol -all +TLSv1.2 +TLSv1.3
    SSLCipherSuite ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305
    SSLHonorCipherOrder On
    
    # HSTS
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    
    # OCSP Stapling
    SSLUseStapling On
    SSLStaplingCache "shmcb:logs/ssl_stapling(32768)"
</VirtualHost>

# Redirect HTTP to HTTPS
<VirtualHost *:80>
    ServerName datasave.com
    Redirect permanent / https://datasave.com/
</VirtualHost>
```

---

## 📊 Monitoring و Alerting

### 🔍 Security Monitoring Dashboard

#### Real-time Security Monitoring
```javascript
// Frontend Security Monitor
class SecurityMonitor {
    constructor() {
        this.alerts = [];
        this.metrics = {};
        this.init();
    }
    
    init() {
        this.startRealTimeMonitoring();
        this.setupAlertHandlers();
    }
    
    startRealTimeMonitoring() {
        // WebSocket connection for real-time alerts
        const ws = new WebSocket('wss://datasave.com/security-stream');
        
        ws.onmessage = (event) => {
            const alert = JSON.parse(event.data);
            this.handleSecurityAlert(alert);
        };
        
        // Periodic metrics update
        setInterval(() => {
            this.updateSecurityMetrics();
        }, 30000); // Every 30 seconds
    }
    
    async updateSecurityMetrics() {
        try {
            const response = await fetch('/api/security/metrics');
            this.metrics = await response.json();
            this.updateDashboard();
        } catch (error) {
            console.error('خطا در دریافت آمار امنیتی:', error);
        }
    }
    
    handleSecurityAlert(alert) {
        this.alerts.unshift(alert);
        
        // Show notification
        this.showNotification(alert);
        
        // Auto-response for critical threats
        if (alert.severity === 'critical') {
            this.handleCriticalThreat(alert);
        }
    }
    
    handleCriticalThreat(alert) {
        // Automatic responses
        switch (alert.type) {
            case 'brute_force':
                this.blockIP(alert.ip);
                break;
            case 'sql_injection':
                this.enableEmergencyMode();
                break;
            case 'data_breach':
                this.lockDownSystem();
                break;
        }
    }
    
    showNotification(alert) {
        const severity = alert.severity;
        const color = {
            'low': 'info',
            'medium': 'warning', 
            'high': 'danger',
            'critical': 'danger'
        }[severity];
        
        const notification = `
            <div class="alert alert-${color} alert-dismissible fade show">
                <strong>هشدار امنیتی ${severity}:</strong> ${alert.message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        document.getElementById('alerts-container').insertAdjacentHTML('afterbegin', notification);
    }
}
```

### 📧 Automated Alerting System

#### Multi-channel Alert System
```php
<?php
class AlertSystem
{
    private array $channels;
    
    public function __construct()
    {
        $this->channels = [
            'email' => new EmailAlerter(),
            'slack' => new SlackAlerter(),
            'sms' => new SMSAlerter(),
            'webhook' => new WebhookAlerter()
        ];
    }
    
    public function sendAlert(SecurityEvent $event): void
    {
        $severity = $event->getSeverity();
        $channels = $this->getChannelsForSeverity($severity);
        
        foreach ($channels as $channelName) {
            try {
                $this->channels[$channelName]->send($event);
            } catch (Exception $e) {
                error_log("Failed to send alert via {$channelName}: " . $e->getMessage());
            }
        }
    }
    
    private function getChannelsForSeverity(string $severity): array
    {
        return match($severity) {
            'critical' => ['email', 'slack', 'sms'],
            'high' => ['email', 'slack'],
            'medium' => ['slack'],
            'low' => ['webhook']
        };
    }
}

class EmailAlerter
{
    public function send(SecurityEvent $event): void
    {
        $subject = "🚨 هشدار امنیتی: " . $event->getType();
        $body = $this->formatEmailBody($event);
        
        mail(
            'security@datasave.com',
            $subject,
            $body,
            $this->getEmailHeaders()
        );
    }
    
    private function formatEmailBody(SecurityEvent $event): string
    {
        return "
        🚨 Security Alert - {$event->getSeverity()}
        
        Event Type: {$event->getType()}
        Time: {$event->getTimestamp()}
        IP Address: {$event->getIP()}
        User Agent: {$event->getUserAgent()}
        
        Details:
        {$event->getDetails()}
        
        Action Required: {$this->getRecommendedAction($event)}
        ";
    }
}
```

---

*این مستندات شامل تمامی جنبه‌های امنیتی پروژه DataSave می‌باشد و باید به‌طور منظم بروزرسانی شود.*

*آخرین بروزرسانی: سپتامبر 2025*