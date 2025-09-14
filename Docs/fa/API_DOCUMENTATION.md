# مستندات API - DataSave

![API Version](https://img.shields.io/badge/API-v1.0-blue?style=for-the-badge)
![PHP](https://img.shields.io/badge/PHP-8.0+-777BB4?style=for-the-badge)
![REST](https://img.shields.io/badge/REST-API-green?style=for-the-badge)

## 📋 فهرست مطالب
- [🔐 احراز هویت](#-احراز-هویت)
- [👤 مدیریت کاربران](#-مدیریت-کاربران)
- [📊 مدیریت داده‌ها](#-مدیریت-داده‌ها)
- [🤖 تنظیمات AI](#-تنظیمات-ai)
- [📱 سرویس SMS](#-سرویس-sms)
- [🔧 کدهای خطا](#-کدهای-خطا)

---

## 🔐 احراز هویت

### Base URL
```
http://localhost/datasave/backend/api/v1/
```

### ورود (Login)
```http
POST /auth/login
Content-Type: application/json

{
    "username": "admin",
    "password": "admin123"
}
```

**پاسخ موفق:**
```json
{
    "success": true,
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
        "id": 1,
        "username": "admin",
        "email": "admin@example.com",
        "role": "admin",
        "created_at": "2024-01-01 10:00:00"
    },
    "expires_at": 1640995200
}
```

### تایید Token
```http
POST /auth/verify
Authorization: Bearer {jwt_token}
```

**پاسخ موفق:**
```json
{
    "success": true,
    "valid": true,
    "user": {
        "id": 1,
        "username": "admin",
        "role": "admin"
    }
}
```

### خروج (Logout)
```http
POST /auth/logout
Authorization: Bearer {jwt_token}
```

---

## 👤 مدیریت کاربران

### دریافت لیست کاربران
```http
GET /users
Authorization: Bearer {jwt_token}
```

**پارامترهای اختیاری:**
- `page`: شماره صفحه (پیش‌فرض: 1)
- `limit`: تعداد رکورد در صفحه (پیش‌فرض: 10)
- `search`: جستجو در نام کاربری و ایمیل
- `role`: فیلتر بر اساس نقش

**مثال:**
```http
GET /users?page=1&limit=5&role=admin&search=john
```

**پاسخ:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "username": "admin",
            "email": "admin@example.com",
            "role": "admin",
            "status": "active",
            "last_login": "2024-01-01 10:00:00",
            "created_at": "2024-01-01 09:00:00"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 5,
        "total": 25,
        "pages": 5
    }
}
```

### ایجاد کاربر جدید
```http
POST /users
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
    "username": "newuser",
    "email": "user@example.com",
    "password": "securepassword123",
    "role": "user",
    "status": "active"
}
```

### ویرایش کاربر
```http
PUT /users/{id}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
    "email": "newemail@example.com",
    "role": "moderator",
    "status": "inactive"
}
```

### حذف کاربر
```http
DELETE /users/{id}
Authorization: Bearer {jwt_token}
```

---

## 📊 مدیریت داده‌ها

### دریافت لیست پروژه‌ها
```http
GET /data-management/projects
Authorization: Bearer {jwt_token}
```

**پاسخ:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "پروژه فروش",
            "description": "تحلیل داده‌های فروش ماهانه",
            "file_name": "sales_data.xlsx",
            "status": "completed",
            "progress": 100,
            "created_at": "2024-01-01 10:00:00",
            "updated_at": "2024-01-01 11:30:00"
        }
    ]
}
```

### آپلود فایل Excel
```http
POST /data-management/upload
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data

file: [excel_file.xlsx]
project_name: "نام پروژه"
description: "توضیحات پروژه"
```

**پاسخ:**
```json
{
    "success": true,
    "message": "فایل با موفقیت آپلود شد",
    "project_id": 123,
    "file_info": {
        "name": "data.xlsx",
        "size": 2048576,
        "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }
}
```

### پردازش پروژه
```http
POST /data-management/process/{project_id}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
    "options": {
        "validate_data": true,
        "create_sql": true,
        "auto_import": false
    }
}
```

### دریافت وضعیت پردازش
```http
GET /data-management/status/{project_id}
Authorization: Bearer {jwt_token}
```

**پاسخ:**
```json
{
    "success": true,
    "status": "processing",
    "progress": 65,
    "current_step": "تبدیل داده‌ها",
    "steps": [
        {
            "name": "خواندن فایل",
            "status": "completed",
            "progress": 100
        },
        {
            "name": "اعتبارسنجی",
            "status": "completed", 
            "progress": 100
        },
        {
            "name": "تبدیل داده‌ها",
            "status": "processing",
            "progress": 65
        }
    ]
}
```

---

## 🤖 تنظیمات AI

### دریافت تنظیمات فعلی
```http
GET /ai-settings
Authorization: Bearer {jwt_token}
```

**پاسخ:**
```json
{
    "success": true,
    "data": {
        "openai": {
            "api_key": "sk-****************************",
            "model": "gpt-4",
            "temperature": 0.7,
            "max_tokens": 1000,
            "enabled": true
        },
        "google_ai": {
            "api_key": "AIza****************************",
            "model": "gemini-pro",
            "temperature": 0.5,
            "enabled": false
        },
        "usage_stats": {
            "total_requests": 1250,
            "monthly_usage": 245,
            "remaining_quota": 8755
        }
    }
}
```

### بروزرسانی تنظیمات
```http
PUT /ai-settings
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
    "openai": {
        "api_key": "sk-new-api-key-here",
        "model": "gpt-4-turbo",
        "temperature": 0.8,
        "max_tokens": 2000,
        "enabled": true
    },
    "google_ai": {
        "api_key": "AIza-new-google-key",
        "model": "gemini-pro",
        "enabled": true
    }
}
```

### تست اتصال API
```http
POST /ai-settings/test
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
    "provider": "openai", // یا "google_ai"
    "test_prompt": "سلام، این یک تست است"
}
```

**پاسخ:**
```json
{
    "success": true,
    "provider": "openai",
    "response_time": 1.25,
    "test_result": {
        "status": "success",
        "response": "سلام! تست اتصال موفقیت‌آمیز بود.",
        "tokens_used": 15
    }
}
```

---

## 📱 سرویس SMS

### ارسال SMS
```http
POST /sms/send
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
    "to": "09123456789",
    "message": "متن پیام شما",
    "provider": "0098sms", // یا "ghasedak"
    "priority": "normal" // normal, high, urgent
}
```

**پاسخ:**
```json
{
    "success": true,
    "message_id": "msg_123456789",
    "provider": "0098sms",
    "status": "sent",
    "cost": 150,
    "sent_at": "2024-01-01 10:30:00"
}
```

### دریافت گزارشات SMS
```http
GET /sms/reports
Authorization: Bearer {jwt_token}
```

**پارامترها:**
- `date_from`: تاریخ شروع (YYYY-MM-DD)
- `date_to`: تاریخ پایان
- `status`: وضعیت (sent, failed, pending)
- `provider`: ارائه‌دهنده سرویس

**پاسخ:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "to": "09123456789",
            "message": "متن پیام",
            "provider": "0098sms",
            "status": "delivered",
            "cost": 150,
            "sent_at": "2024-01-01 10:30:00",
            "delivered_at": "2024-01-01 10:30:15"
        }
    ],
    "statistics": {
        "total_sent": 1250,
        "total_delivered": 1180,
        "total_failed": 70,
        "total_cost": 187500
    }
}
```

### تنظیمات SMS
```http
GET /sms/settings
Authorization: Bearer {jwt_token}
```

```http
PUT /sms/settings
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
    "providers": {
        "0098sms": {
            "api_key": "your-0098sms-key",
            "username": "your-username",
            "enabled": true,
            "priority": 1
        },
        "ghasedak": {
            "api_key": "your-ghasedak-key",
            "enabled": false,
            "priority": 2
        }
    },
    "default_provider": "0098sms",
    "retry_attempts": 3,
    "retry_delay": 5
}
```

---

## 🔧 کدهای خطا

### کدهای HTTP استاندارد
| کد | توضیح | مثال |
|-----|--------|-------|
| `200` | موفقیت‌آمیز | درخواست با موفقیت پردازش شد |
| `201` | ایجاد شد | رکورد جدید ایجاد شد |
| `400` | درخواست نامعتبر | پارامترهای اشتباه |
| `401` | غیرمجاز | نیاز به احراز هویت |
| `403` | ممنوع | عدم دسترسی |
| `404` | یافت نشد | منبع موجود نیست |
| `500` | خطای سرور | خطای داخلی |

### کدهای خطای سفارشی
```json
{
    "success": false,
    "error": {
        "code": "AUTH_001",
        "message": "نام کاربری یا رمز عبور اشتباه است",
        "details": "اطلاعات اضافی در صورت نیاز"
    }
}
```

### فهرست کدهای خطا
| کد | توضیح |
|-----|--------|
| `AUTH_001` | اطلاعات ورود نامعتبر |
| `AUTH_002` | توکن منقضی شده |
| `AUTH_003` | توکن نامعتبر |
| `USER_001` | کاربر یافت نشد |
| `USER_002` | نام کاربری تکراری |
| `DATA_001` | فایل نامعتبر |
| `DATA_002` | خطا در پردازش |
| `AI_001` | کلید API نامعتبر |
| `AI_002` | خطای اتصال به AI |
| `SMS_001` | خطا در ارسال پیام |
| `SMS_002` | اعتبار ناکافی |

---

## 🔧 نمونه کدهای Client

### JavaScript (Fetch API)
```javascript
// تابع کمکی برای درخواست‌های API
class DataSaveAPI {
    constructor(baseURL, token = null) {
        this.baseURL = baseURL;
        this.token = token;
    }
    
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        const response = await fetch(url, {
            ...options,
            headers
        });
        
        return await response.json();
    }
    
    // ورود
    async login(username, password) {
        const result = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        
        if (result.success) {
            this.token = result.token;
        }
        
        return result;
    }
    
    // دریافت کاربران
    async getUsers(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await this.request(`/users?${queryString}`);
    }
    
    // آپلود فایل
    async uploadFile(file, projectName, description) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('project_name', projectName);
        formData.append('description', description);
        
        return await this.request('/data-management/upload', {
            method: 'POST',
            body: formData,
            headers: {} // حذف Content-Type برای FormData
        });
    }
}

// استفاده
const api = new DataSaveAPI('http://localhost/datasave/backend/api/v1');

// ورود
const loginResult = await api.login('admin', 'admin123');
console.log(loginResult);

// دریافت کاربران
const users = await api.getUsers({ page: 1, limit: 10 });
console.log(users);
```

### PHP (cURL)
```php
<?php
class DataSaveAPIClient {
    private $baseURL;
    private $token;
    
    public function __construct($baseURL, $token = null) {
        $this->baseURL = rtrim($baseURL, '/');
        $this->token = $token;
    }
    
    private function request($endpoint, $data = null, $method = 'GET', $headers = []) {
        $url = $this->baseURL . $endpoint;
        $ch = curl_init();
        
        $defaultHeaders = ['Content-Type: application/json'];
        if ($this->token) {
            $defaultHeaders[] = 'Authorization: Bearer ' . $this->token;
        }
        
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => array_merge($defaultHeaders, $headers),
            CURLOPT_CUSTOMREQUEST => $method
        ]);
        
        if ($data && in_array($method, ['POST', 'PUT', 'PATCH'])) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        return json_decode($response, true);
    }
    
    // ورود
    public function login($username, $password) {
        $result = $this->request('/auth/login', [
            'username' => $username,
            'password' => $password
        ], 'POST');
        
        if ($result['success']) {
            $this->token = $result['token'];
        }
        
        return $result;
    }
    
    // دریافت کاربران
    public function getUsers($params = []) {
        $queryString = http_build_query($params);
        return $this->request('/users?' . $queryString);
    }
}

// استفاده
$api = new DataSaveAPIClient('http://localhost/datasave/backend/api/v1');

// ورود
$loginResult = $api->login('admin', 'admin123');
var_dump($loginResult);

// دریافت کاربران
$users = $api->getUsers(['page' => 1, 'limit' => 10]);
var_dump($users);
?>
```

---

## 📝 نکات مهم

1. **همیشه از HTTPS استفاده کنید** در محیط production
2. **Token ها را در localStorage یا sessionStorage ذخیره نکنید** - از httpOnly cookies استفاده کنید
3. **Rate Limiting** در نظر بگیرید برای API های حساس
4. **Input Validation** را در سمت client و server انجام دهید
5. **Error Handling** مناسب پیاده‌سازی کنید

---

*آخرین بروزرسانی: سپتامبر 2025*