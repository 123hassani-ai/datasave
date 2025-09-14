# راهنمای کامل DataSave - سیستم لاگ‌گیری پیشرفته

## 📋 فهرست مطالب
1. [معرفی و بررسی کلی](#معرفی-و-بررسی-کلی)
2. [سیستم لاگ‌گیری](#سیستم-لاگ‌گیری)
3. [راه‌اندازی و نصب](#راه‌اندازی-و-نصب)
4. [عیب‌یابی مشکلات](#عیب‌یابی-مشکلات)
5. [API مرجع](#api-مرجع)

## 🎯 معرفی و بررسی کلی

DataSave یک سیستم مدیریت داده‌ها با تمرکز بر لاگ‌گیری حرفه‌ای و پردازش داده‌های Excel است. این سیستم طراحی شده تا نیازهای سازمان‌ها و توسعه‌دهندگان را در زمینه ثبت، مدیریت و تحلیل رویدادهای سیستم برآورده کند.

### ویژگی‌های کلیدی:
- **لاگ‌گیری دوگانه**: ذخیره همزمان در کلاینت (IndexedDB) و سرور (فایل‌های PHP)
- **مدیریت خطا**: رصد و ثبت خودکار خطاهای JavaScript
- **عملکرد بهینه**: سیستم Batch Processing و Lazy Loading
- **پشتیبانی RTL**: طراحی کامل برای زبان فارسی
- **رابط کاربری مدرن**: داشبورد تعاملی با Bootstrap 5

## 📊 سیستم لاگ‌گیری

### معماری لاگ‌گیری

#### 1. **سمت کلاینت (Client-Side)**
```javascript
// مسیر: assets/js/modules/logging.js
const Logger = {
    debug: (message, data) => { /* پیام‌های توسعه */ },
    info: (message, data) => { /* اطلاعات عمومی */ },
    warn: (message, data) => { /* هشدارها */ },
    error: (message, error, data) => { /* خطاها */ },
    fatal: (message, error, data) => { /* خطاهای مهلک */ }
};
```

#### 2. **سمت سرور (Server-Side)**
```php
// مسیر: backend/api/v1/logging.php
class ServerLogger {
    public function writeLog($level, $message, $data = null, $error = null);
    public function readLogs($options = []);
    public function getLogStats();
    public function cleanOldLogs($daysToKeep = 30);
}
```

### تنظیمات لاگ‌گیری

#### کانفیگ کلاینت:
```javascript
const LoggingConfig = {
    enableLogging: true,                    // فعال/غیرفعال کلی
    minLevel: 0,                           // DEBUG = 0, INFO = 1, WARN = 2, ERROR = 3, FATAL = 4
    
    storage: {
        dbName: 'DataSaveLogs',            // نام پایگاه داده محلی
        maxLogEntries: 10000,              // حداکثر ورودی قبل از چرخش
        serverEndpoint: './backend/api/v1/logging.php'
    },
    
    performance: {
        batchSize: 50,                     // اندازه دسته برای نوشتن
        flushInterval: 2000,               // تخلیه خودکار (میلی‌ثانیه)
        serverSyncInterval: 5000,          // همگام‌سازی با سرور
        enableServerLogging: true          // فعال‌سازی ارسال به سرور
    }
};
```

#### کانفیگ سرور:
```php
class ServerLogger {
    private $logsPath = '../../../logs/';   // مسیر پوشه لاگ‌ها
    private $maxFileSize = 5 * 1024 * 1024; // 5MB حداکثر اندازه فایل
    private $maxFiles = 10;                 // حداکثر تعداد فایل‌های چرخشی
}
```

### سطوح لاگ (Log Levels)

| سطح | عدد | کاربرد | مثال |
|-----|-----|--------|-------|
| **DEBUG** | 0 | اطلاعات توسعه | `Logger.debug('متغیر X دارای مقدار Y است', {x: value})` |
| **INFO** | 1 | اطلاعات عمومی | `Logger.info('کاربر وارد سیستم شد', {userId: 123})` |
| **WARN** | 2 | هشدارها | `Logger.warn('حافظه کم است', {freeMemory: '10MB'})` |
| **ERROR** | 3 | خطاها | `Logger.error('خطا در اتصال پایگاه داده', error, {query: 'SELECT ...'})` |
| **FATAL** | 4 | خطاهای مهلک | `Logger.fatal('سیستم غیرقابل ادامه', criticalError, {system: 'database'})` |

### مدیریت خطاهای JavaScript

سیستم به طور خودکار خطاهای JavaScript را رصد و ثبت می‌کند:

```javascript
// رصد خطاهای عمومی
window.addEventListener('error', (event) => {
    Logger.error('خطای JavaScript گرفته نشده', event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        message: event.message
    });
});

// رصد Promise های رد شده
window.addEventListener('unhandledrejection', (event) => {
    Logger.error('Promise رد شده که مدیریت نشده', event.reason);
});
```

## 🚀 راه‌اندازی و نصب

### پیش‌نیازها

1. **سرور وب**: Apache یا Nginx
2. **PHP**: نسخه 7.4 یا بالاتر
3. **MySQL**: نسخه 8.0 یا بالاتر (اختیاری)
4. **مرورگر**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+

### مراحل نصب

#### 1. **دانلود و استقرار**
```bash
# کلون کردن پروژه
git clone [repository-url] datasave
cd datasave

# تنظیم مجوزات
chmod 755 -R .
chmod 777 logs/
```

#### 2. **تنظیم سرور وب**

**XAMPP:**
```bash
# کپی به htdocs
cp -r datasave /Applications/XAMPP/xamppfiles/htdocs/

# راه‌اندازی سرور PHP داخلی
cd /Applications/XAMPP/xamppfiles/htdocs/datasave
php -S localhost:8000
```

**Apache Virtual Host:**
```apache
<VirtualHost *:80>
    DocumentRoot "/path/to/datasave"
    ServerName datasave.local
    
    <Directory "/path/to/datasave">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

#### 3. **تنظیم پایگاه داده (اختیاری)**
```sql
-- ایجاد پایگاه داده
CREATE DATABASE ai_excell2form CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- اجرای اسکریپت اولیه
mysql -u root -p ai_excell2form < backend/database/schema.sql
```

#### 4. **تنظیم کانفیگ**
```php
// backend/config/database.php
<?php
return [
    'host' => '127.0.0.1',
    'port' => '3307',
    'database' => 'ai_excell2form',
    'username' => 'root',
    'password' => 'your_password'
];
```

### تست نصب

1. **دسترسی به برنامه**: `http://localhost:8000`
2. **تست سیستم لاگ‌گیری**: `http://localhost:8000/tests/debug.html`
3. **تست API**: `http://localhost:8000/tests/test-backend.html`

## 🔧 عیب‌یابی مشکلات

### مشکلات شایع و راه‌حل‌ها

#### 1. **خطاها در فایل‌های لاگ ثبت نمی‌شوند**

**علت‌های ممکن:**
- مجوزات پوشه `logs/` 
- عدم دسترسی به API سرور
- خطا در تنظیمات JavaScript

**راه‌حل:**
```bash
# بررسی مجوزات
ls -la logs/
chmod 777 logs/

# تست API
curl -X GET "http://localhost:8000/backend/api/v1/logging.php?action=stats"

# بررسی کنسول مرورگر
# F12 → Console → بررسی خطاهای JavaScript
```

#### 2. **مشکل اتصال پایگاه داده**

**بررسی تنظیمات:**
```php
// تست اتصال
php -r "
try {
    \$pdo = new PDO('mysql:host=127.0.0.1;port=3307;dbname=ai_excell2form', 'root', 'password');
    echo 'اتصال موفق';
} catch (Exception \$e) {
    echo 'خطا: ' . \$e->getMessage();
}
"
```

#### 3. **مشکل CORS در API**

**تنظیم هدرها:**
```php
// backend/api/v1/logging.php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

#### 4. **Logger مقداردهی نمی‌شود**

**بررسی بارگذاری ماژول‌ها:**
```javascript
// کنسول مرورگر
console.log('Logger موجود است:', typeof window.Logger !== 'undefined');
console.log('تنظیمات:', window.LoggingConfig);

// تست دستی Logger
window.Logger.info('تست Logger', {test: true});
```

### ابزارهای عیب‌یابی

#### 1. **صفحه عیب‌یابی کامل**
```
http://localhost:8000/tests/debug.html
```

این صفحه شامل:
- بررسی بارگذاری ماژول‌ها
- تست API سرور
- تست خطاهای JavaScript
- مشاهده لاگ‌های سرور

#### 2. **لاگ‌های سیستم**
```bash
# لاگ‌های اصلی
tail -f logs/app_$(date +%Y-%m-%d).log

# لاگ‌های خطا
tail -f logs/error_$(date +%Y-%m-%d).log

# لاگ‌های Apache (در صورت استفاده)
tail -f /var/log/apache2/error.log
```

#### 3. **ابزارهای مرورگر**
- **DevTools → Console**: خطاهای JavaScript
- **DevTools → Network**: درخواست‌های AJAX/Fetch
- **DevTools → Application → IndexedDB**: لاگ‌های محلی

### بهینه‌سازی عملکرد

#### 1. **تنظیم مناسب Batch Size**
```javascript
// برای سیستم‌های کم‌حافظه
LoggingConfig.performance.batchSize = 25;
LoggingConfig.performance.flushInterval = 5000;

// برای سرورهای قدرتمند
LoggingConfig.performance.batchSize = 100;
LoggingConfig.performance.flushInterval = 1000;
```

#### 2. **مدیریت فضای دیسک**
```bash
# پاک‌سازی لاگ‌های قدیمی (بیش از 30 روز)
find logs/ -name "*.log" -mtime +30 -delete

# فشرده‌سازی لاگ‌های قدیمی
gzip logs/*.log
```

#### 3. **تنظیم چرخش لاگ‌ها**
```bash
# /etc/logrotate.d/datasave
/path/to/datasave/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 www-data www-data
}
```

## 📚 API مرجع

### Client-Side API

#### Logger Methods

```javascript
// پیام‌های اشکال‌زدایی
Logger.debug(message, data);

// اطلاعات عمومی
Logger.info(message, data);

// هشدارها
Logger.warn(message, data);

// خطاها
Logger.error(message, error, data);

// خطاهای مهلک
Logger.fatal(message, error, data);

// ردیابی عملکرد
const timer = Logger.time('operation_name');
// ... عملیات
timer(); // پایان و ثبت زمان

// ردیابی تابع
const trace = Logger.trace('function_name', args);
// ... اجرای تابع
trace(); // پایان ردیابی
```

#### Logger Configuration

```javascript
// دریافت لاگ‌ها
const logs = await Logger.getLogs({
    level: Logger.levels.ERROR,  // فقط خطاها
    limit: 100,                  // حداکثر 100 مورد
    startTime: new Date('2023-01-01'),
    endTime: new Date('2023-12-31')
});

// پاک کردن لاگ‌ها
await Logger.clearLogs();

// خروجی JSON
const jsonLogs = await Logger.exportLogs();

// آمار لاگ‌ها
const stats = await Logger.getStats();
```

### Server-Side API

#### Endpoints

**GET /backend/api/v1/logging.php**

```bash
# دریافت لاگ‌ها
GET /backend/api/v1/logging.php?action=logs&limit=50&level=error

# آمار لاگ‌ها  
GET /backend/api/v1/logging.php?action=stats

# پاک‌سازی لاگ‌های قدیمی
GET /backend/api/v1/logging.php?action=clean&days=30
```

**POST /backend/api/v1/logging.php**

```json
{
    "level": "error",
    "message": "خطا در اتصال پایگاه داده",
    "data": {
        "query": "SELECT * FROM users",
        "error_code": 1045
    },
    "error": {
        "name": "DatabaseError",
        "message": "Access denied",
        "stack": "..."
    }
}
```

#### Response Format

```json
{
    "success": true,
    "message": "عملیات موفقیت‌آمیز",
    "data": [
        {
            "timestamp": "2023-09-09 10:30:15",
            "level": "ERROR",
            "message": "خطا در سیستم",
            "data": {...},
            "error": {...},
            "ip": "192.168.1.100",
            "user_agent": "Mozilla/5.0...",
            "url": "/api/users",
            "session_id": "sess_abc123"
        }
    ]
}
```

### PHP Class Reference

```php
<?php
$logger = new ServerLogger();

// نوشتن لاگ
$logger->writeLog('error', 'خطا در سیستم', ['code' => 500], $errorObject);

// خواندن لاگ‌ها
$logs = $logger->readLogs([
    'limit' => 100,
    'level' => 'error',
    'start_date' => '2023-01-01',
    'end_date' => '2023-12-31'
]);

// آمار لاگ‌ها
$stats = $logger->getLogStats();

// پاک‌سازی
$deletedCount = $logger->cleanOldLogs(30);
?>
```

## 🎯 بهترین روش‌ها (Best Practices)

### 1. **استراتژی لاگ‌گیری**

```javascript
// ✅ درست
Logger.error('خطا در احراز هویت کاربر', error, {
    userId: user.id,
    action: 'login',
    ip: userIP,
    timestamp: Date.now()
});

// ❌ نادرست  
Logger.error('خطا!', error);
```

### 2. **مدیریت حافظه**

```javascript
// تنظیم مناسب برای محیط‌های مختلف
if (window.innerWidth < 768) {
    // دستگاه‌های موبایل
    LoggingConfig.performance.batchSize = 25;
    LoggingConfig.storage.maxLogEntries = 5000;
} else {
    // دسکتاپ
    LoggingConfig.performance.batchSize = 50;
    LoggingConfig.storage.maxLogEntries = 10000;
}
```

### 3. **امنیت**

```javascript
// حذف اطلاعات حساس قبل از لاگ
const sanitizedData = {
    ...userData,
    password: '[FILTERED]',
    creditCard: '[FILTERED]'
};

Logger.info('کاربر جدید ثبت شد', sanitizedData);
```

---

## 📞 پشتیبانی و ارتباط

- **مستندات**: `/docs/fa/`
- **تست‌ها**: `/tests/`
- **مثال‌ها**: `/examples/`
- **گزارش مشکلات**: از طریق سیستم لاگ‌گیری

---

**نسخه**: 2.0.0  
**تاریخ بروزرسانی**: ۹ سپتامبر ۲۰۲۵  
**وضعیت**: فعال و آماده استفاده ✅