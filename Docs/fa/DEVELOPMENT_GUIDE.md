# راهنمای توسعه و نصب - DataSave

![Development](https://img.shields.io/badge/Development-Guide-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-2.0-orange?style=for-the-badge)

## 📋 فهرست مطالب
- [🚀 نصب سریع](#-نصب-سریع)
- [🔧 نصب تفصیلی](#-نصب-تفصیلی)
- [🏗️ معماری پروژه](#️-معماری-پروژه)
- [💻 محیط توسعه](#-محیط-توسعه)
- [📝 استانداردهای کدنویسی](#-استانداردهای-کدنویسی)
- [🧪 تست و Debug](#-تست-و-debug)
- [🚀 Deploy و Production](#-deploy-و-production)

---

## 🚀 نصب سریع

### ⚡ نصب Express (5 دقیقه)
```bash
# 1. کلون پروژه
git clone https://github.com/123hassani-ai/datasave.git
cd datasave

# 2. کپی در XAMPP
cp -r . /Applications/XAMPP/xamppfiles/htdocs/datasave/

# 3. راه‌اندازی دیتابیس
mysql -u root -p
> CREATE DATABASE datasave_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> USE datasave_db;
> SOURCE backend/database/schema.sql;
> SOURCE backend/database/ai-settings-schema.sql;
> SOURCE backend/database/sms-schema.sql;
> EXIT;

# 4. تنظیم API Keys
cp Docs/Prompts/api-openai-template.txt Docs/Prompts/api-openai-local.txt
# ویرایش فایل و اضافه کردن کلیدهای واقعی

# 5. تست اپلیکیشن
open http://localhost/datasave
```

---

## 🔧 نصب تفصیلی

### 1️⃣ پیش‌نیازها

#### سیستم‌عامل
- **macOS**: 10.15+ (Catalina یا بالاتر)
- **Windows**: 10 یا 11
- **Linux**: Ubuntu 20.04+ یا CentOS 8+

#### نرم‌افزارهای مورد نیاز
```bash
# XAMPP Stack
- Apache 2.4+
- PHP 8.0+ (با extensions زیر)
  • mysqli
  • pdo_mysql
  • json
  • curl
  • mbstring
  • openssl
- MySQL 8.0+

# Development Tools
- Git 2.30+
- Node.js 16+ (اختیاری برای build tools)
- Code Editor (VS Code توصیه می‌شود)
```

### 2️⃣ تنظیمات PHP

#### php.ini Configuration
```ini
# حداکثر اندازه فایل آپلود
upload_max_filesize = 50M
post_max_size = 50M
max_execution_time = 300
memory_limit = 256M

# تنظیمات امنیتی
expose_php = Off
allow_url_fopen = Off
allow_url_include = Off

# Session تنظیمات
session.cookie_httponly = 1
session.cookie_secure = 1
session.use_strict_mode = 1

# Error Reporting (Development)
display_errors = On
error_reporting = E_ALL
log_errors = On
error_log = /path/to/error.log
```

### 3️⃣ تنظیمات MySQL

#### ایجاد دیتابیس
```sql
-- ایجاد دیتابیس
CREATE DATABASE datasave_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- ایجاد کاربر مخصوص (برای Production)
CREATE USER 'datasave_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON datasave_db.* TO 'datasave_user'@'localhost';
FLUSH PRIVILEGES;

-- استفاده از دیتابیس
USE datasave_db;
```

#### اجرای Schema ها
```bash
# ترتیب اجرا مهم است
mysql -u root -p datasave_db < backend/database/schema.sql
mysql -u root -p datasave_db < backend/database/ai-settings-schema.sql
mysql -u root -p datasave_db < backend/database/sms-schema.sql
mysql -u root -p datasave_db < backend/database/data-management-schema.sql
```

### 4️⃣ تنظیمات Apache

#### Virtual Host Configuration
```apache
# httpd-vhosts.conf
<VirtualHost *:80>
    ServerName datasave.local
    DocumentRoot "/Applications/XAMPP/xamppfiles/htdocs/datasave"
    
    <Directory "/Applications/XAMPP/xamppfiles/htdocs/datasave">
        AllowOverride All
        Require all granted
    </Directory>
    
    # Logging
    ErrorLog logs/datasave_error.log
    CustomLog logs/datasave_access.log combined
</VirtualHost>

# SSL (Production)
<VirtualHost *:443>
    ServerName datasave.com
    DocumentRoot "/var/www/datasave"
    
    SSLEngine on
    SSLCertificateFile /path/to/certificate.crt
    SSLCertificateKeyFile /path/to/private.key
    
    Header always set Strict-Transport-Security "max-age=63072000"
    Header always set X-Frame-Options DENY
    Header always set X-Content-Type-Options nosniff
</VirtualHost>
```

#### .htaccess Rules
```apache
# .htaccess در root
RewriteEngine On

# API Routing
RewriteRule ^api/(.*)$ backend/api/$1 [QSA,L]

# Security Headers
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# GZIP Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache Control
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

---

## 🏗️ معماری پروژه

### 📐 Architecture Overview
```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │     SPA     │  │   Admin     │  │   Mobile    │    │
│  │   Router    │  │   Panel     │  │  Responsive │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────┐
│                   API Gateway Layer                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │    Auth     │  │   Router    │  │ Rate Limit  │    │
│  │ Middleware  │  │ Middleware  │  │ Middleware  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────┐
│                  Business Logic Layer                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Users     │  │    Data     │  │     AI      │    │
│  │  Service    │  │ Management  │  │  Service    │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │     SMS     │  │   Excel     │  │    Auth     │    │
│  │  Service    │  │ Processor   │  │  Service    │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────┐
│                   Data Access Layer                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   MySQL     │  │ IndexedDB   │  │ External    │    │
│  │  Database   │  │   Cache     │  │    APIs     │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### 🗂️ Directory Structure Logic
```
datasave/
├── 🎨 Frontend Assets
│   ├── assets/css/           # Styling Layer
│   │   ├── main.css          # Base styles
│   │   ├── admin/            # Admin-specific styles
│   │   └── components/       # Component styles
│   ├── assets/js/            # Logic Layer
│   │   ├── main.js           # Application entry
│   │   ├── admin/            # Admin modules
│   │   └── modules/          # Shared modules
│   └── assets/fonts/         # Typography
│
├── ⚙️ Backend Services
│   ├── backend/api/v1/       # RESTful Endpoints
│   ├── backend/config/       # Configuration
│   ├── backend/models/       # Data Models
│   └── backend/database/     # Database Schema
│
├── 📚 Documentation
│   ├── Docs/fa/              # Persian docs
│   └── Docs/Prompts/         # Development guides
│
└── 🧪 Testing & QA
    └── tests/                # Test suites
```

---

## 💻 محیط توسعه

### 🛠️ IDE Setup (VS Code)

#### Extensions Pack
```json
{
    "recommendations": [
        "ms-vscode.vscode-typescript-next",
        "esbenp.prettier-vscode",
        "ms-vscode.vscode-json",
        "formulahendry.auto-rename-tag",
        "bradlc.vscode-tailwindcss",
        "ms-vscode.live-server",
        "felixfbecker.php-intellisense",
        "bmewburn.vscode-intelephense-client"
    ]
}
```

#### Settings Configuration
```json
{
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    "files.associations": {
        "*.php": "php"
    },
    "php.validate.executablePath": "/Applications/XAMPP/bin/php",
    "emmet.includeLanguages": {
        "php": "html"
    }
}
```

### 🐛 Debug Configuration

#### VS Code launch.json
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Launch Chrome",
            "request": "launch",
            "type": "chrome",
            "url": "http://localhost/datasave",
            "webRoot": "${workspaceFolder}"
        },
        {
            "name": "Listen for Xdebug",
            "type": "php",
            "request": "launch",
            "port": 9003,
            "pathMappings": {
                "/Applications/XAMPP/xamppfiles/htdocs/datasave": "${workspaceFolder}"
            }
        }
    ]
}
```

#### Xdebug Setup (php.ini)
```ini
[XDebug]
zend_extension=xdebug.so
xdebug.mode=debug
xdebug.start_with_request=yes
xdebug.client_port=9003
xdebug.client_host=127.0.0.1
xdebug.log=/tmp/xdebug.log
```

---

## 📝 استانداردهای کدنویسی

### 🎨 Frontend Standards

#### JavaScript (ES6+)
```javascript
// ✅ خوب
class DataManager {
    constructor(apiEndpoint) {
        this.apiEndpoint = apiEndpoint;
        this.cache = new Map();
    }
    
    async fetchData(id) {
        if (this.cache.has(id)) {
            return this.cache.get(id);
        }
        
        try {
            const response = await fetch(`${this.apiEndpoint}/${id}`);
            const data = await response.json();
            this.cache.set(id, data);
            return data;
        } catch (error) {
            console.error('خطا در دریافت داده:', error);
            throw error;
        }
    }
}

// ❌ بد
function getData(id) {
    var data;
    $.ajax({
        url: '/api/data/' + id,
        async: false,
        success: function(result) {
            data = result;
        }
    });
    return data;
}
```

#### CSS/SCSS
```scss
// ✅ خوب - BEM Methodology
.data-card {
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    
    &__header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
    }
    
    &__title {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary);
    }
    
    &--loading {
        opacity: 0.6;
        pointer-events: none;
    }
}

// RTL Support
[dir="rtl"] .data-card {
    text-align: right;
    
    &__header {
        flex-direction: row-reverse;
    }
}
```

### ⚙️ Backend Standards

#### PHP (PSR-12)
```php
<?php
declare(strict_types=1);

namespace DataSave\Models;

use PDO;
use PDOException;

/**
 * مدل مدیریت کاربران
 */
class User
{
    private PDO $db;
    
    public function __construct(PDO $database)
    {
        $this->db = $database;
    }
    
    /**
     * دریافت کاربر بر اساس ID
     */
    public function findById(int $id): ?array
    {
        try {
            $stmt = $this->db->prepare('SELECT * FROM users WHERE id = ?');
            $stmt->execute([$id]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            return $result ?: null;
        } catch (PDOException $e) {
            error_log("خطا در دریافت کاربر: " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * ایجاد کاربر جدید
     */
    public function create(array $userData): bool
    {
        $requiredFields = ['username', 'email', 'password'];
        foreach ($requiredFields as $field) {
            if (empty($userData[$field])) {
                throw new InvalidArgumentException("فیلد {$field} الزامی است");
            }
        }
        
        $userData['password'] = password_hash($userData['password'], PASSWORD_ARGON2ID);
        $userData['created_at'] = date('Y-m-d H:i:s');
        
        try {
            $stmt = $this->db->prepare(
                'INSERT INTO users (username, email, password, role, created_at) 
                 VALUES (?, ?, ?, ?, ?)'
            );
            
            return $stmt->execute([
                $userData['username'],
                $userData['email'],
                $userData['password'],
                $userData['role'] ?? 'user',
                $userData['created_at']
            ]);
        } catch (PDOException $e) {
            error_log("خطا در ایجاد کاربر: " . $e->getMessage());
            return false;
        }
    }
}
```

#### Database Design
```sql
-- ✅ خوب - استاندارد نام‌گذاری
CREATE TABLE user_sessions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_sessions_user_id (user_id),
    INDEX idx_user_sessions_token (session_token),
    INDEX idx_user_sessions_expires (expires_at),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ❌ بد
CREATE TABLE session (
    sessionid int AUTO_INCREMENT PRIMARY KEY,
    userid int,
    token varchar(100),
    exp datetime
);
```

---

## 🧪 تست و Debug

### 🔍 Testing Strategy

#### Frontend Testing
```javascript
// Jest Test Example
describe('DataManager', () => {
    let dataManager;
    
    beforeEach(() => {
        dataManager = new DataManager('/api/data');
    });
    
    test('should cache fetched data', async () => {
        const mockData = { id: 1, name: 'تست' };
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockData)
            })
        );
        
        const result1 = await dataManager.fetchData(1);
        const result2 = await dataManager.fetchData(1);
        
        expect(result1).toEqual(mockData);
        expect(result2).toEqual(mockData);
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});
```

#### Backend Testing (PHPUnit)
```php
<?php
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{
    private $user;
    private $pdo;
    
    protected function setUp(): void
    {
        $this->pdo = new PDO('sqlite::memory:');
        $this->pdo->exec('CREATE TABLE users (
            id INTEGER PRIMARY KEY,
            username VARCHAR(50),
            email VARCHAR(100),
            password VARCHAR(255),
            role VARCHAR(20),
            created_at DATETIME
        )');
        
        $this->user = new User($this->pdo);
    }
    
    public function testCreateUser(): void
    {
        $userData = [
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => 'password123',
            'role' => 'user'
        ];
        
        $result = $this->user->create($userData);
        $this->assertTrue($result);
        
        $createdUser = $this->user->findByUsername('testuser');
        $this->assertNotNull($createdUser);
        $this->assertEquals('testuser', $createdUser['username']);
    }
}
```

### 📊 Performance Monitoring

#### Frontend Performance
```javascript
// Performance Monitoring
class PerformanceMonitor {
    static measurePageLoad() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
            
            console.log(`زمان بارگذاری صفحه: ${loadTime}ms`);
            
            // ارسال به Analytics
            this.sendMetric('page_load_time', loadTime);
        });
    }
    
    static measureAPICall(endpoint, startTime) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        console.log(`API ${endpoint}: ${duration}ms`);
        this.sendMetric('api_call_duration', duration, { endpoint });
    }
    
    static sendMetric(name, value, labels = {}) {
        // ارسال متریک به سرویس monitoring
        fetch('/api/metrics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, value, labels, timestamp: Date.now() })
        });
    }
}
```

---

## 🚀 Deploy و Production

### 🌐 Production Checklist

#### Pre-Deploy Checklist
```bash
# ✅ Security
- [ ] تغییر پسوردهای پیش‌فرض
- [ ] حذف فایل‌های debug
- [ ] تنظیم HTTPS
- [ ] کانفیگ Firewall

# ✅ Performance  
- [ ] Minify CSS/JS
- [ ] تنظیم Cache Headers
- [ ] تنظیم GZIP
- [ ] بهینه‌سازی تصاویر

# ✅ Database
- [ ] Backup دیتابیس
- [ ] تنظیم Indexing
- [ ] بررسی Query Performance
- [ ] تنظیم Connection Pool

# ✅ Monitoring
- [ ] تنظیم Error Logging
- [ ] تنظیم Access Logs
- [ ] تنظیم Alerts
- [ ] تنظیم Uptime Monitoring
```

#### Production Environment Variables
```bash
# .env.production
DB_HOST=localhost
DB_NAME=datasave_prod
DB_USER=datasave_user
DB_PASS=strong_production_password

# Security
JWT_SECRET=very_long_random_string_for_production
ENCRYPTION_KEY=another_very_long_random_string

# API Keys (از محیط سرور بخوانید)
OPENAI_API_KEY=${OPENAI_API_KEY}
GOOGLE_AI_API_KEY=${GOOGLE_AI_API_KEY}

# Cache
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=redis_password

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@example.com
SMTP_PASS=smtp_password
```

#### Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name datasave.com www.datasave.com;
    
    # SSL Configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    root /var/www/datasave;
    index index.html index.php;
    
    # PHP-FPM
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.0-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
    
    # API Routes
    location /api/ {
        try_files $uri $uri/ /backend/api/index.php?$query_string;
    }
    
    # Static Assets Cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2|woff)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary Accept-Encoding;
        gzip_static on;
    }
    
    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    location /api/ {
        limit_req zone=api burst=20 nodelay;
    }
}
```

---

## 📞 پشتیبانی و troubleshooting

### 🔧 مشکلات رایج

#### خطای اتصال دیتابیس
```bash
# بررسی سرویس MySQL
sudo systemctl status mysql

# بررسی لاگ‌های MySQL
tail -f /var/log/mysql/error.log

# تست اتصال
mysql -u datasave_user -p -h localhost
```

#### مشکلات Performance
```sql
-- بررسی Query های کند
SELECT * FROM information_schema.processlist 
WHERE time > 5 AND command != 'Sleep';

-- تحلیل Index Usage
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

-- آمار جداول
SELECT 
    table_name,
    table_rows,
    data_length,
    index_length,
    (data_length + index_length) as total_size
FROM information_schema.tables 
WHERE table_schema = 'datasave_db';
```

#### مشکلات JavaScript
```javascript
// Global Error Handler
window.addEventListener('error', (event) => {
    console.error('خطای JavaScript:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
    
    // ارسال به سرویس logging
    fetch('/api/log/error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: 'javascript_error',
            message: event.message,
            stack: event.error?.stack,
            url: window.location.href,
            userAgent: navigator.userAgent
        })
    });
});
```

---

## 📚 مستندات مرتبط

برای اطلاعات تکمیلی، راهنماهای تخصصی زیر را مطالعه کنید:

### 🎨 طراحی و UI/UX
- **[راهنمای کامل UI/UX و RTL](UI_UX_RTL_COMPLETE_GUIDE.md)** - پیاده‌سازی RTL، فونت وزیرمتن، آیکون‌ها و responsive design

### 🏠 مدیریت پنل ادمین  
- **[راهنمای کامل Admin Dashboard](ADMIN_DASHBOARD_COMPLETE_GUIDE.md)** - معماری، migration، استانداردسازی و ماژول‌های داشبورد

### 🤖 هوش مصنوعی
- **[راهنمای کامل AI Settings](AI_SETTINGS_COMPLETE_GUIDE.md)** - پیاده‌سازی کامل تنظیمات OpenAI، TTS، STT و image processing

### 🔐 امنیت و API
- **[راهنمای امنیت](SECURITY_GUIDE.md)** - best practices امنیتی، OWASP compliance و تست‌های نفوذ
- **[مستندات API](API_DOCUMENTATION.md)** - مرجع کامل تمام endpoints و integration guide

---

*آخرین بروزرسانی: سپتامبر 2025*