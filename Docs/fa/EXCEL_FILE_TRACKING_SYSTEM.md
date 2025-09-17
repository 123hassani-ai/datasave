# سیستم ردیابی فایل‌های Excel - مستندات کامل

## 📋 خلاصه پروژه

این سیستم برای ردیابی و مدیریت فایل‌های Excel طراحی شده که امکانات زیر را فراهم می‌کند:
- ردیابی فایل‌های آپلود شده با استفاده از SHA-256 hash
- تشخیص فایل‌های تکراری و تغییرات ساختار
- تولید ساختار دیتابیس با کمک هوش مصنوعی
- ایجاد خودکار جداول MySQL
- سیستم notification زیبا و کاربردی

---

## 🗂️ فایل‌های ایجاد شده

### 1. **Backend API Files**

#### `/backend/api/v1/xls-tracking.php`
**هدف**: API اصلی برای ردیابی فایل‌های Excel

**ویژگی‌ها**:
- بررسی وجود فایل بر اساس hash
- ثبت فایل‌های جدید
- مدیریت وضعیت پردازش
- سیستم لاگ عملیات

**توابع اصلی**:
```php
- checkFileExists($pdo)     // بررسی وجود فایل
- registerFile($pdo)        // ثبت فایل جدید
- getFileInfo($pdo)         // دریافت اطلاعات فایل
- updateProcessingStatus($pdo) // بروزرسانی وضعیت
- logOperation($pdo)        // ثبت لاگ عملیات
- getProcessingHistory($pdo) // دریافت تاریخچه
```

**API Endpoints**:
```
POST /backend/api/v1/xls-tracking.php?action=check_file_exists
POST /backend/api/v1/xls-tracking.php?action=register_file
GET  /backend/api/v1/xls-tracking.php?action=get_file_info
POST /backend/api/v1/xls-tracking.php?action=update_processing_status
```

---

### 2. **Database Schema**

#### `/backend/database/xls2tbl-schema.sql`
**هدف**: ساختار جداول ردیابی فایل‌ها

**جداول**:

##### `xls2tbl_00data` - جدول اصلی ردیابی
```sql
- id (INT, PRIMARY KEY)
- table_name (VARCHAR(100), UNIQUE) // نام جدول ایجاد شده
- file_name (VARCHAR(255))          // نام فایل اصلی
- file_hash (VARCHAR(64))           // SHA-256 hash فایل
- data_type (ENUM)                  // نوع عملیات
- columns_number (INT)              // تعداد ستون‌ها
- columns_data (TEXT)               // نام ستون‌های فایل
- unique_field (VARCHAR(100))       // فیلد کلیدی
- total_records (INT)               // تعداد کل رکوردها
- processed_records (INT)           // تعداد رکوردهای پردازش شده
- created_at, updated_at (TIMESTAMP)
```

##### `xls2tbl_00logs` - جدول لاگ عملیات
```sql
- id (INT, PRIMARY KEY)
- xls_data_id (INT, FK)
- operation_type (ENUM)             // نوع عملیات
- affected_records (INT)            // تعداد رکوردهای تأثیر یافته
- success_count, error_count (INT)  // آمار موفقیت/خطا
- error_details (TEXT)              // جزئیات خطاها
- processing_time (DECIMAL)         // زمان پردازش
- created_at (TIMESTAMP)
```

---

### 3. **Frontend Enhancements**

#### تغییرات `/assets/js/admin/modules/data-management.js`

**ویژگی‌های جدید اضافه شده**:

##### الف) سیستم File Hashing
```javascript
async calculateFileHash(file) {
    // محاسبه SHA-256 hash برای فایل
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
```

##### ب) سیستم File Tracking
```javascript
async checkFileExistence(fileHash, columnsData) {
    // بررسی وجود فایل در سیستم با API call
    // مدیریت حالات: جدید، موجود، تغییر ساختار
}
```

##### ج) سیستم Notification
```javascript
showNotification(message, type = 'info') {
    // نمایش پیام‌های زیبا با انیمیشن CSS
    // انواع: success, error, warning, info
}
```

##### د) تقویت AI Integration
```javascript
parseAndDisplayStructure(aiResponse, columns) {
    // تجزیه هوشمند پاسخ AI
    // پاک‌سازی JSON و مدیریت خطاها
    // Fallback به ساختار پیش‌فرض
}
```

##### ه) سیستم Field Translation
```javascript
translateFieldName(persianName) {
    // ترجمه نام‌های فارسی به انگلیسی
    // مدیریت کاراکترهای خاص
    // Fallback برای نام‌های نامشخص
}
```

---

### 4. **Test Files**

#### `/test-api.html`
**هدف**: تست مستقل API ردیابی فایل

**ویژگی‌ها**:
- تست check_file_exists
- تست register_file
- نمایش زیبای نتایج JSON
- رابط کاربری ساده

#### `/test-data.csv`
**هدف**: فایل نمونه برای تست سیستم
```csv
نام,سن,شهر
علی,25,تهران
فاطمه,30,اصفهان
محمد,28,شیراز
```

---

## 🏗️ معماری سیستم

### Flow Diagram
```
[فایل Excel] → [File Upload] → [Calculate Hash] → [AI Analysis] 
     ↓
[Check Existence API] → [Parse Results] → [Generate Structure]
     ↓
[Display UI] → [User Interaction] → [Create Table] → [Import Data]
```

### Database Architecture
```
ai_excell2form (Database)
├── xls2tbl_00data (Tracking Table)
├── xls2tbl_00logs (Operation Logs)
└── xlstbl_* (Generated Tables with prefix)
```

---

## 🔧 تنظیمات پیکربندی

### Database Configuration
```php
// backend/config/database.php
define('DB_HOST', '127.0.0.1');
define('DB_PORT', '3307');
define('DB_NAME', 'ai_excell2form');
define('DB_USER', 'root');
define('DB_PASS', 'Mojtab@123');
```

### Frontend Configuration
```javascript
// assets/js/admin/modules/data-management.js
this.config = {
    apiEndpoint: '/datasave/backend/api/v1/data-simple.php',
    trackingEndpoint: '/datasave/backend/api/v1/xls-tracking.php',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['.xlsx', '.xls', '.csv']
};
```

---

## 🚀 نحوه استفاده

### 1. آپلود فایل
```javascript
// انتخاب فایل توسط کاربر
const file = fileInput.files[0];

// محاسبه hash
const fileHash = await calculateFileHash(file);

// تحلیل با AI
const analysisResult = await analyzeFileWithAI(file);

// بررسی وجود
const existenceStatus = await checkFileExistence(fileHash, columns);
```

### 2. تولید ساختار دیتابیس
```javascript
// تولید prompt برای AI
const prompt = `بر اساس ستون‌های: ${columns.join(', ')} 
ساختار دیتابیس JSON پیشنهاد دهید`;

// ارسال به AI و دریافت پاسخ
const aiResponse = await sendMessageToAI(prompt);

// تجزیه و نمایش
parseAndDisplayStructure(aiResponse, columns);
```

### 3. ایجاد جدول
```javascript
// تولید SQL
const sqlCode = generateSQLCode(structure);

// ارسال به API
const response = await fetch('/datasave/backend/api/v1/data-simple.php', {
    method: 'POST',
    body: formData
});
```

---

## 🐛 مدیریت خطاها

### Frontend Error Handling
```javascript
try {
    // عملیات اصلی
} catch (error) {
    console.error('خطا:', error);
    this.showNotification('پیام خطا', 'error');
    // Fallback action
}
```

### Backend Error Handling
```php
try {
    // Database operations
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ], JSON_UNESCAPED_UNICODE);
}
```

---

## 📊 لاگ‌گذاری و مانیتورینگ

### PHP Logging
```php
error_log("XLS-Tracking Request: " . json_encode([
    'action' => $action,
    'method' => $_SERVER['REQUEST_METHOD'],
    'data' => $_POST
]));
```

### JavaScript Logging
```javascript
console.log('🔍 بررسی وجود فایل...', {fileHash, columnsData});
console.log('📤 ارسال درخواست به API...');
console.log('✅ پاسخ تجزیه شده:', result);
```

---

## 🔒 امنیت

### File Validation
```javascript
// بررسی نوع فایل
const allowedTypes = ['.xlsx', '.xls', '.csv'];
const isValidType = allowedTypes.some(type => 
    fileName.toLowerCase().endsWith(type)
);

// بررسی حجم فایل
const maxSize = 10 * 1024 * 1024; // 10MB
if (file.size > maxSize) {
    throw new Error('حجم فایل بیش از حد مجاز');
}
```

### SQL Injection Prevention
```php
// استفاده از Prepared Statements
$stmt = $pdo->prepare("SELECT * FROM xls2tbl_00data WHERE file_hash = ?");
$stmt->execute([$file_hash]);
```

---

## 🧪 تست‌ها

### Unit Tests
- تست محاسبه hash فایل
- تست ترجمه نام فیلدها
- تست تولید SQL

### Integration Tests  
- تست کامل flow آپلود فایل
- تست API endpoints
- تست ایجاد جدول و import داده

### Manual Tests
- تست با فایل‌های مختلف Excel/CSV
- تست حالات خطا
- تست رابط کاربری

---

## 📈 عملکرد و بهینه‌سازی

### Performance Optimizations
- استفاده از SHA-256 hash برای شناسایی سریع فایل‌ها
- Cache کردن نتایج تحلیل AI
- Lazy loading برای UI components

### Database Optimizations
- Index روی file_hash و table_name
- Partitioning برای جداول بزرگ
- Regular cleanup برای لاگ‌های قدیمی

---

## 🔄 آپدیت‌ها و نگهداری

### Version Control
- تمام تغییرات در Git track می‌شوند
- Branch-based development
- Code review process

### Backup Strategy
- Automated database backups
- File storage redundancy
- Configuration versioning

---

## 📞 پشتیبانی

### مشکلات رایج

#### 1. خطای "فیلدهای اجباری ارسال نشده"
**حل**: بررسی ارسال file_hash و columns_data

#### 2. خطای JSON Parse
**حل**: سیستم fallback به ساختار پیش‌فرض

#### 3. خطای اتصال دیتابیس
**حل**: بررسی تنظیمات database.php

### لاگ‌های مفید
```bash
# لاگ‌های PHP
tail -f /Applications/XAMPP/xamppfiles/logs/error_log

# لاگ‌های JavaScript
F12 → Console در مرورگر
```

---

## 🏁 نتیجه‌گیری

این سیستم ردیابی فایل‌های Excel یک راه‌حل کامل و مقیاس‌پذیر برای مدیریت فایل‌های Excel در پروژه DataSave محسوب می‌شود که شامل:

✅ **Backend قوی** با API RESTful  
✅ **Frontend ریسپانسیو** با UX/UI مدرن  
✅ **سیستم ردیابی هوشمند** با hash verification  
✅ **Integration با AI** برای تحلیل خودکار  
✅ **مدیریت خطای جامع** با fallback mechanisms  
✅ **مستندات کامل** برای نگهداری آسان  

---

*آخرین بروزرسانی: 15 سپتامبر 2025*  
*نسخه: 1.0.0*  
*توسعه‌دهنده: DataSave Team*