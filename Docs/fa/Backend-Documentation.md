# مستندات Backend و پایگاه داده - DataSave

## 📋 فهرست مطالب

- [نصب و راه‌اندازی](#نصب-و-راه‌اندازی)
- [پیکربندی](#پیکربندی)
- [ساختار پایگاه داده](#ساختار-پایگاه-داده)
- [API Documentation](#api-documentation)
- [احراز هویت](#احراز-هویت)
- [مدیریت کاربران](#مدیریت-کاربران)
- [نمونه‌های استفاده](#نمونه‌های-استفاده)
- [عیب‌یابی](#عیب‌یابی)

---

## 🚀 نصب و راه‌اندازی

### پیش‌نیازها

- **XAMPP/MAMP**: نسخه 7.4 یا بالاتر
- **MySQL**: نسخه 5.7 یا بالاتر
- **PHP**: نسخه 7.4 یا بالاتر
- **PDO Extension**: فعال

### تنظیمات XAMPP

1. **راه‌اندازی XAMPP**:
   ```bash
   # راه‌اندازی Apache و MySQL
   sudo /Applications/XAMPP/xamppfiles/xampp start
   ```

2. **تنظیم پورت MySQL به 3307**:
   - فایل `/Applications/XAMPP/xamppfiles/etc/my.cnf` را ویرایش کنید
   - خط `port = 3307` را اضافه کنید

3. **تنظیم رمز عبور MySQL**:
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'Mojtab@123';
   FLUSH PRIVILEGES;
   ```

### نصب خودکار

```bash
# نصب پایگاه داده
php backend/database/install.php
```

### نصب دستی

1. **ایجاد پایگاه داده**:
   ```sql
   CREATE DATABASE ai_excell2form CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **اجرای اسکریپت Schema**:
   ```bash
   mysql -u root -p'Mojtab@123' -P 3307 ai_excell2form < backend/database/schema.sql
   ```

---

## ⚙️ پیکربندی

### فایل تنظیمات پایگاه داده

مسیر: `backend/config/database.php`

```php
define('DB_HOST', 'localhost');
define('DB_PORT', '3307');
define('DB_NAME', 'ai_excell2form');
define('DB_USER', 'root');
define('DB_PASS', 'Mojtab@123');
define('DB_CHARSET', 'utf8mb4');
```

### تنظیمات محیطی

```php
// تنظیمات امنیتی
define('SESSION_TIMEOUT', 7200); // 2 ساعت
define('REMEMBER_ME_TIMEOUT', 2592000); // 30 روز
define('MAX_LOGIN_ATTEMPTS', 5);
define('ACCOUNT_LOCK_TIME', 1800); // 30 دقیقه
```

---

## 🗄️ ساختار پایگاه داده

### جداول اصلی

#### 1. جدول گروه‌های کاربری (`ai_user_groups`)

| فیلد | نوع | توضیح |
|------|-----|-------|
| `id` | INT | شناسه منحصر به فرد |
| `name` | VARCHAR(50) | نام انگلیسی گروه |
| `name_fa` | VARCHAR(100) | نام فارسی گروه |
| `permissions` | JSON | مجوزهای دسترسی |
| `is_active` | BOOLEAN | وضعیت فعال/غیرفعال |

#### 2. جدول کاربران (`ai_users`)

| فیلد | نوع | توضیح |
|------|-----|-------|
| `id` | INT | شناسه منحصر به فرد |
| `username` | VARCHAR(50) | نام کاربری |
| `email` | VARCHAR(100) | ایمیل |
| `mobile` | VARCHAR(15) | شماره موبایل |
| `password` | VARCHAR(255) | رمز عبور (هش شده) |
| `first_name` | VARCHAR(50) | نام |
| `last_name` | VARCHAR(50) | نام خانوادگی |
| `full_name` | VARCHAR(100) | نام کامل (محاسبه شده) |
| `national_id` | VARCHAR(10) | کد ملی |
| `birth_date` | DATE | تاریخ تولد |
| `gender` | ENUM | جنسیت |
| `user_group_id` | INT | شناسه گروه کاربری |
| `is_active` | BOOLEAN | وضعیت فعال |
| `is_verified` | BOOLEAN | تایید حساب |
| `avatar_path` | VARCHAR(255) | مسیر تصویر آواتار |
| `last_login_at` | TIMESTAMP | آخرین ورود |
| `login_attempts` | INT | تلاش‌های ورود ناموفق |
| `two_factor_enabled` | BOOLEAN | احراز هویت دو مرحله‌ای |

#### 3. جدول جلسات (`ai_user_sessions`)

| فیلد | نوع | توضیح |
|------|-----|-------|
| `id` | BIGINT | شناسه منحصر به فرد |
| `user_id` | INT | شناسه کاربر |
| `session_id` | VARCHAR(128) | شناسه جلسه |
| `ip_address` | VARCHAR(45) | آدرس IP |
| `device_info` | JSON | اطلاعات دستگاه |
| `expires_at` | TIMESTAMP | انقضای جلسه |

#### 4. جدول لاگ‌ها (`ai_system_logs`)

| فیلد | نوع | توضیح |
|------|-----|-------|
| `id` | BIGINT | شناسه منحصر به فرد |
| `user_id` | INT | شناسه کاربر |
| `action` | VARCHAR(100) | نوع عملیات |
| `entity_type` | VARCHAR(50) | نوع موجودیت |
| `details` | JSON | جزئیات |

### گروه‌های کاربری پیش‌فرض

1. **Administrator** (`administrator`): دسترسی کامل
2. **User** (`user`): کاربر عادی
3. **Moderator** (`moderator`): نظارتی
4. **Guest** (`guest`): مهمان

### کاربر مدیر پیش‌فرض

- **نام کاربری**: `admin`
- **رمز عبور**: `admin123`
- **ایمیل**: `admin@ai-excell2form.local`

---

## 🔗 API Documentation

### Base URL
```
http://localhost/DataSave/backend/api/v1/
```

### Authentication API

#### ورود کاربر
```http
POST /auth/login
Content-Type: application/json

{
    "username": "admin",
    "password": "admin123",
    "remember_me": false
}
```

**پاسخ موفق**:
```json
{
    "success": true,
    "message": "ورود موفقیت‌آمیز",
    "data": {
        "user": {
            "id": 1,
            "username": "admin",
            "email": "admin@ai-excell2form.local",
            "full_name": "مدیر سیستم",
            "group_name": "administrator"
        },
        "session_id": "abc123...",
        "expires_in": 7200
    }
}
```

#### خروج کاربر
```http
POST /auth/logout
```

#### بررسی وضعیت احراز هویت
```http
GET /auth/me
```

#### دریافت جلسات فعال
```http
GET /auth/sessions
```

### Users API

#### دریافت لیست کاربران
```http
GET /users?page=1&limit=20&search=نام&is_active=true
```

#### دریافت کاربر خاص
```http
GET /users/{id}
```

#### ایجاد کاربر جدید
```http
POST /users
Content-Type: application/json

{
    "username": "newuser",
    "email": "user@example.com",
    "password": "password123",
    "first_name": "نام",
    "last_name": "نام خانوادگی",
    "mobile": "09123456789",
    "user_group_id": 2
}
```

#### بروزرسانی کاربر
```http
PUT /users/{id}
Content-Type: application/json

{
    "first_name": "نام جدید",
    "is_active": true
}
```

#### حذف کاربر (Soft Delete)
```http
DELETE /users/{id}
```

---

## 🔐 احراز هویت

### مکانیزم احراز هویت

1. **Session-based Authentication**: جلسات PHP
2. **Remember Me**: کوکی طولانی مدت
3. **Account Locking**: قفل حساب پس از تلاش‌های ناموفق
4. **Password Hashing**: bcrypt
5. **Two-Factor Authentication**: آماده برای پیاده‌سازی

### نحوه کار

```php
// بررسی احراز هویت
$user = requireAuth();

// بررسی دسترسی
requirePermission('admin');

// دریافت کاربر فعلی
$auth = new Auth();
$currentUser = $auth->getCurrentUser();
```

### مدیریت جلسات

- **مدت زمان جلسه عادی**: 2 ساعت
- **مدت زمان Remember Me**: 30 روز
- **پاک‌سازی خودکار**: جلسات منقضی شده

---

## 👥 مدیریت کاربران

### ایجاد کاربر

```php
$userModel = new User();

$userData = [
    'username' => 'testuser',
    'email' => 'test@example.com',
    'password' => 'password123',
    'first_name' => 'نام',
    'last_name' => 'نام خانوادگی'
];

$userId = $userModel->create($userData);
```

### احراز هویت

```php
$user = $userModel->authenticate('username', 'password');
if ($user) {
    // ورود موفق
    session_start();
    $_SESSION['user_id'] = $user['id'];
}
```

### اعتبارسنجی

- **نام کاربری**: 3-50 کاراکتر، a-z, 0-9, _
- **ایمیل**: فرمت معتبر
- **رمز عبور**: حداقل 6 کاراکتر
- **موبایل**: فرمت ایرانی (09xxxxxxxxx)
- **کد ملی**: 10 رقم

---

## 💻 نمونه‌های استفاده

### JavaScript (Frontend)

```javascript
// ورود کاربر
async function login(username, password) {
    try {
        const response = await fetch('/backend/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
                remember_me: false
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            localStorage.setItem('user', JSON.stringify(result.data.user));
            window.location.href = '/dashboard';
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('خطا در ورود:', error);
    }
}

// دریافت لیست کاربران
async function getUsers(page = 1) {
    try {
        const response = await fetch(`/backend/api/v1/users?page=${page}`);
        const result = await response.json();
        
        if (result.success) {
            displayUsers(result.data);
        }
    } catch (error) {
        console.error('خطا در دریافت کاربران:', error);
    }
}
```

### PHP (Backend)

```php
// استفاده از User Model
require_once 'backend/models/User.php';

$userModel = new User();

// ایجاد کاربر
$newUser = $userModel->create([
    'username' => 'john_doe',
    'email' => 'john@example.com',
    'password' => 'secure_password',
    'first_name' => 'John',
    'last_name' => 'Doe'
]);

// دریافت کاربر
$user = $userModel->getById(1);

// به‌روزرسانی
$userModel->update(1, ['is_active' => true]);
```

---

## 🔧 عیب‌یابی

### مشکلات رایج

#### 1. خطای اتصال به پایگاه داده

```
PDOException: SQLSTATE[HY000] [2002] Connection refused
```

**راه‌حل**:
- بررسی کنید XAMPP/MySQL در حال اجرا باشد
- پورت 3307 را بررسی کنید
- تنظیمات `database.php` را چک کنید

#### 2. خطای مجوز MySQL

```
Access denied for user 'root'@'localhost'
```

**راه‌حل**:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'Mojtab@123';
FLUSH PRIVILEGES;
```

#### 3. خطای 404 در API

**راه‌حل**:
- بررسی کنید Apache در حال اجرا باشد
- فایل `.htaccess` را بررسی کنید
- مسیر URL را چک کنید

#### 4. خطای Session

**راه‌حل**:
```php
// بررسی تنظیمات session در php.ini
session.save_path = "/tmp"
session.gc_maxlifetime = 7200
```

### لاگ‌ها

- **Database Logs**: `backend/logs/database.log`
- **PHP Error Logs**: در پوشه لاگ XAMPP
- **System Logs**: جدول `ai_system_logs`

### بررسی سلامت سیستم

```php
// تست اتصال پایگاه داده
$db = Database::getInstance();
if ($db->isConnected()) {
    echo "✓ اتصال پایگاه داده برقرار است";
}

// بررسی جداول
$installer = new DatabaseInstaller();
$info = $installer->getInstallationInfo();
print_r($info);
```

---

## 📁 ساختار فایل‌ها

```
backend/
├── api/
│   ├── auth.php                 # کلاس احراز هویت
│   └── v1/
│       ├── auth.php            # API احراز هویت
│       └── users.php           # API کاربران
├── config/
│   └── database.php            # پیکربندی پایگاه داده
├── database/
│   ├── install.php             # اسکریپت نصب
│   └── schema.sql              # ساختار پایگاه داده
├── models/
│   └── User.php                # مدل کاربر
└── logs/
    └── database.log            # لاگ‌های پایگاه داده
```

---

## 🚀 مراحل بعدی

### قابلیت‌های آینده

1. **Two-Factor Authentication**: احراز هویت دو مرحله‌ای
2. **API Rate Limiting**: محدودیت درخواست
3. **File Upload**: آپلود فایل و آواتار
4. **Email Verification**: تایید ایمیل
5. **Password Reset**: بازیابی رمز عبور
6. **Audit Trail**: رهگیری تغییرات
7. **Role-based Permissions**: مجوزهای پیچیده‌تر

### بهینه‌سازی

1. **Database Indexing**: بهینه‌سازی نمایه‌ها
2. **Query Optimization**: بهینه‌سازی کوئری‌ها
3. **Caching**: کش کردن داده‌ها
4. **Connection Pooling**: مدیریت اتصالات

---

## 📞 پشتیبانی

برای مشکلات فنی یا سؤالات:

- **ایمیل**: support@ai-excell2form.local
- **مستندات**: این فایل
- **لاگ‌ها**: بررسی فایل‌های لاگ در پوشه `backend/logs/`

---

*آخرین بروزرسانی: 2024*
*DataSave Team*