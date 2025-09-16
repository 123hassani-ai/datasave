# DataSave - سیستم مدیریت جامع#### 📊 **مدیریت داده‌ها (Data Management) - 🆕 تازه تکمیل شده!**
- 📥 **Excel Import** با پردازش کامل فایل‌های فارسی
- 🔄 **تبدیل خودکار Excel به MySQL** با ساختار بهینه
- 🧠 **تحلیل هوشمند AI** برای پیشنهاد ساختار جدول
- 📈 **نمایش پیشرفت Timeline** تعاملی و زیبا
- 🗃️ **ایجاد جدول واقعی** در دیتابیس MySQL
- 📦 **انتقال داده‌ها** از Excel به جدول با mapping فیلدها
- 🔤 **ترجمه نام فیلدها** از فارسی به انگلیسی (شناسه → id, نام → name)
- 📊 **مدیریت تاریخچه** جداول ایجاد شده با آمار کامل
- 🎛️ **تنظیمات پیشرفته** فیلدها (نوع، طول، nullable، primary key)
- 🔍 **پیش‌نمایش SQL زنده** با نمایش ساختار جدول
- ✅ **تست شده و آماده تولید** - کاملاً عملیاتیها 🚀

![DataSave Logo](https://img.shields.io/badge/DataSave-v2.1-blue?style=for-the-badge)
![PHP](https://img.shields.io/badge/PHP-8.0+-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 📖 درباره پروژه

**DataSave** یک سیستم مدیریت جامع داده‌ها با رابط کاربری مدرن و قابلیت‌های پیشرفته است که در تاریخ **16 سپتامبر 2025** به مرحله Production رسیده است. این پروژه شامل:

- 🏢 **پنل مدیریت حرفه‌ای** با پشتیبانی کامل RTL
- 🤖 **یکپارچگی هوش مصنوعی** با تحلیل خلاقانه داده‌ها
- 📊 **سیستم تبدیل Excel به MySQL** با پشتیبانی کامل فارسی
- 📱 **SMS Management System** با API متنوع
- 🔐 **سیستم احراز هویت قدرتمند**
- 📈 **Dashboard آنالیتیک** با نمودارهای زنده
- 🌍 **پشتیبانی کامل زبان فارسی** در تمام بخش‌ها

## 🌟 ویژگی‌های کامل

### ✅ **ویژگی‌های پیاده‌سازی شده و تست شده**

#### 🏢 **پنل مدیریت (Admin Dashboard)**
- 📊 **Dashboard تعاملی** با نمودارها و آمار زنده
- 🎨 **طراحی مدرن RTL** با فونت Vazirmatn
- 🌙 **حالت تاریک/روشن** با تغییر آسان تم
- 📱 **Responsive Design** برای همه دستگاه‌ها
- 🎯 **Navigation پیشرفته** با menu های کشویی

#### 📊 **مدیریت داده‌ها (Data Management)**
- � **Excel Import** با timeline و مراحل نمایشی
- 🔄 **پردازش خودکار** فایل‌های Excel به SQL
- 📈 **نمایش پیشرفت** با نوار Timeline تعاملی
- 💾 **ذخیره پروژه‌ها** در IndexedDB
- 🔍 **جستجو و فیلتر** در داده‌ها

#### 🤖 **تنظیمات هوش مصنوعی (AI Settings)**
- 🔑 **مدیریت API Keys** (OpenAI, Google AI)
- ⚙️ **پیکربندی مدل‌ها** (GPT-4, Claude, Gemini)
- 🎚️ **تنظیمات پیشرفته** (Temperature, Max Tokens)
- 🔒 **امنیت کلیدها** با رمزنگاری
- 📊 **مانیتورینگ استفاده** API

#### � **مدیریت SMS**
- 📞 **ارسال SMS** با API های متنوع (0098SMS, Ghasedak)
- � **گزارشات کامل** ارسال و دریافت
- 📊 **آمار و تحلیل** پیام‌ها
- ⏰ **برنامه‌ریزی ارسال** (OTP Timing)
- 🔄 **سینک چندگانه** با سرویس‌های مختلف

#### 🔐 **سیستم احراز هویت**
- � **مدیریت کاربران** با نقش‌های مختلف
- 🔑 **JWT Authentication** امن
- 🛡️ **Authorization** سطح‌بندی شده
- 📝 **Session Management** پیشرفته

### 🔄 **در حال توسعه**
- � **Analytics Dashboard** با نمودارهای پیشرفته
- 🔔 **Notification System** در زمان واقعی
- 📦 **Export/Import** داده‌ها
- 🌐 **Multi-language Support**
- 🔄 **Real-time Updates** با WebSocket

## 🛠 تکنولوژی‌ها و معماری

### 🎨 **Frontend Architecture**
```
assets/
├── css/
│   ├── main.css                    # استایل‌های اصلی
│   ├── admin/                      # استایل‌های پنل مدیریت
│   │   ├── dashboard.css           # داشبورد
│   │   ├── sidebar.css             # نوار کناری
│   │   ├── header.css              # هدر
│   │   └── modules/                # ماژول‌های مختلف
│   └── components/                 # کامپوننت‌های قابل استفاده مجدد
├── js/
│   ├── main.js                     # اسکریپت اصلی
│   ├── admin/                      # اسکریپت‌های پنل مدیریت
│   │   ├── dashboard.js            # داشبورد
│   │   ├── router.js               # مسیریابی SPA
│   │   ├── sidebar.js              # مدیریت sidebar
│   │   └── modules/                # ماژول‌های تخصصی
│   └── modules/                    # ماژول‌های عمومی
│       ├── numberUtils.js          # ابزار عددی فارسی
│       ├── persian-calendar.js     # تقویم فارسی
│       └── simple-logger.js        # سیستم لاگ
├── fonts/
│   └── vazirmatn/                  # فونت فارسی Vazirmatn
└── templates/                      # قالب‌های HTML
```

### ⚙️ **Backend Architecture**
```
backend/
├── api/
│   ├── create-table.php            # 🆕 ایجاد جدول MySQL واقعی
│   ├── import-data.php             # 🆕 انتقال داده از Excel
│   ├── verify-table.php            # 🆕 تأیید وجود جدول
│   └── v1/                         # API Version 1
│       ├── auth.php                # احراز هویت
│       ├── users.php               # مدیریت کاربران
│       ├── data-management.php     # مدیریت داده‌ها
│       ├── ai-settings.php         # تنظیمات AI
│       └── sms.php                 # سرویس SMS
├── config/
│   └── database.php                # تنظیمات دیتابیس
├── models/
│   ├── User.php                    # مدل کاربر
│   └── DataProject.php             # مدل پروژه داده
└── database/
    ├── schema.sql                  # ساختار دیتابیس
    ├── ai-settings-schema.sql      # جداول AI
    ├── sms-schema.sql              # جداول SMS
    └── install.php                 # نصب‌کننده خودکار
```

### 🛠 **Backend APIs - تازه پیاده‌سازی شده**

#### 📊 **Excel-to-Database APIs**
```php
// 🗃️ ایجاد جدول MySQL واقعی
POST /backend/api/create-table.php
{
    "tableName": "customers",
    "fields": [
        {"name": "id", "type": "INT", "primaryKey": true, "autoIncrement": true},
        {"name": "name", "type": "VARCHAR", "length": 255},
        {"name": "phone", "type": "VARCHAR", "length": 20}
    ]
}

// 📦 انتقال داده از Excel به جدول
POST /backend/api/import-data.php
{
    "tableName": "customers",
    "data": [
        {"name": "علی احمدی", "phone": "09123456789"},
        {"name": "فاطمه رضایی", "phone": "09876543210"}
    ],
    "mapping": {"نام": "name", "تلفن": "phone"}
}

// ✅ تأیید وجود جدول
GET /backend/api/verify-table.php?table=customers
```

#### 🔤 **Persian Field Translation System**
- **شناسه/کد** → `id`
- **نام/نام_خانوادگی** → `name`
- **تلفن/موبایل** → `phone`
- **آدرس** → `address`
- **تاریخ/تاریخ_تولد** → `date`
- **قیمت/مبلغ** → `price`
- **توضیحات** → `description`
- و بیش از 100 ترجمه دیگر...

### 📚 **Technology Stack**

#### Frontend Technologies
- **Core**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Bootstrap 5 RTL
- **Icons**: Font Awesome 6 + Minimal Icons
- **Charts**: Chart.js برای نمودارها
- **Storage**: IndexedDB + localStorage
- **Typography**: Vazirmatn Font Family

#### Backend Technologies  
- **Language**: PHP 8.0+
- **Database**: MySQL 8.0+
- **API**: RESTful Architecture
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Password Hashing, SQL Injection Prevention

#### Development Tools
- **Version Control**: Git + GitHub
- **Code Quality**: ESLint, PHP CodeSniffer
- **Documentation**: Markdown
- **Testing**: PHPUnit, Jest

## 🚀 نصب و راه‌اندازی

### پیش‌نیازها
- **XAMPP 8.0+** یا سرور مشابه (Apache, PHP 8.0+, MySQL 8.0+)
- **مرورگر مدرن** (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **Git** برای کلون پروژه

### 📥 مراحل نصب سریع

#### 1. کلون پروژه
```bash
git clone https://github.com/123hassani-ai/datasave.git
cd datasave
```

#### 2. راه‌اندازی دیتابیس
```bash
# ورود به MySQL
mysql -u root -p

# ایجاد دیتابیس
CREATE DATABASE datasave_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE datasave_db;

# اجرای اسکریپت نصب
SOURCE backend/database/schema.sql;
SOURCE backend/database/ai-settings-schema.sql;
SOURCE backend/database/sms-schema.sql;
```

#### 3. تنظیمات Backend
```php
// backend/config/database.php
<?php
return [
    'host' => 'localhost',
    'database' => 'datasave_db',
    'username' => 'root',
    'password' => '',
    'charset' => 'utf8mb4'
];
```

#### 4. تنظیمات API Keys
```bash
# کپی فایل template
cp Docs/Prompts/api-openai-template.txt Docs/Prompts/api-openai-local.txt

# ویرایش و اضافه کردن کلیدهای واقعی
# OPENAI_API_KEY=your_actual_key_here
# GOOGLE_AI_API_KEY=your_actual_key_here
```

#### 5. راه‌اندازی سرور
```bash
# اگر از XAMPP استفاده می‌کنید
# فایل‌ها را در htdocs/datasave قرار دهید

# یا با PHP Built-in Server
php -S localhost:8000
```

### 🔧 تنظیمات پیشرفته

#### تنظیمات Apache (.htaccess)
```apache
# فعال‌سازی URL Rewriting
RewriteEngine On
RewriteRule ^api/(.*)$ backend/api/$1 [QSA,L]

# تنظیمات امنیتی
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
```

#### تنظیمات PHP (php.ini)
```ini
# حداکثر اندازه فایل آپلود
upload_max_filesize = 50M
post_max_size = 50M

# فعال‌سازی خطاها در development
display_errors = On
error_reporting = E_ALL
```

## 📱 راهنمای استفاده

### 🏠 **دسترسی به پنل مدیریت**
1. باز کردن `http://localhost/datasave` در مرورگر
2. ورود با اطلاعات مدیر (admin/admin)
3. استفاده از منوی کناری برای دسترسی به بخش‌های مختلف

### 📊 **مدیریت داده‌ها**
- **آپلود Excel**: از منوی "مدیریت داده‌ها" > "ایمپورت Excel"
- **نمایش Timeline**: مشاهده مراحل پردازش در timeline تعاملی
- **ذخیره پروژه**: پروژه‌ها به صورت خودکار در IndexedDB ذخیره می‌شوند

### 🤖 **تنظیمات AI**
- **API Keys**: تنظیم کلیدهای OpenAI و Google AI
- **Model Configuration**: انتخاب مدل و پارامترهای آن
- **Usage Monitoring**: مشاهده آمار استفاده از API

### 📱 **سیستم SMS**
- **ارسال SMS**: از منوی "SMS" > "ارسال جدید"
- **گزارشات**: مشاهده آمار ارسال و دریافت
- **تنظیمات**: پیکربندی API های SMS

## 🔌 API Documentation

### 🔐 **Authentication Endpoints**
```http
POST /api/v1/auth/login
Content-Type: application/json

{
    "username": "admin",
    "password": "admin"
}
```

### 👤 **User Management**
```http
GET /api/v1/users
Authorization: Bearer {jwt_token}

POST /api/v1/users
Content-Type: application/json
{
    "username": "newuser",
    "email": "user@example.com",
    "role": "user"
}
```

### 📊 **Data Management**
```http
POST /api/v1/data-management/projects
Content-Type: multipart/form-data

file: excel_file.xlsx
project_name: "پروژه جدید"
```

### 🤖 **AI Settings**
```http
GET /api/v1/ai-settings
Authorization: Bearer {jwt_token}

PUT /api/v1/ai-settings
Content-Type: application/json
{
    "openai_key": "sk-...",
    "model": "gpt-4",
    "temperature": 0.7
}
```

### 📱 **SMS Services**
```http
POST /api/v1/sms/send
Content-Type: application/json
{
    "to": "09123456789",
    "message": "متن پیام",
    "provider": "0098sms"
}
```

## 🧪 تست و توسعه

### 🔍 **فایل‌های تست**
```
tests/
├── test-admin-modules.html         # تست ماژول‌های ادمین
├── test-api-connection.html        # تست اتصال API
├── test-database.php               # تست دیتابیس
├── test-endpoints.php              # تست endpoint های API
├── test-scrolling-jalali-module.html  # تست تقویم فارسی
└── test-sms-reports-api.php        # تست API SMS
```

### 🐛 **Debug و عیب‌یابی**
```bash
# فعال‌سازی لاگ‌های PHP
tail -f backend/logs/database.log

# بررسی Network Tab در مرورگر
# Console Log برای JavaScript errors
```

## 📄 ساختار فایل‌ها

```
datasave/
├── 📁 assets/                      # فایل‌های استاتیک
│   ├── 📁 css/                     # استایل‌ها
│   │   ├── main.css                # استایل اصلی
│   │   ├── 📁 admin/               # استایل‌های پنل مدیریت
│   │   │   ├── dashboard.css       # داشبورد
│   │   │   ├── sidebar.css         # نوار کناری
│   │   │   ├── header.css          # هدر
│   │   │   └── 📁 modules/         # ماژول‌های تخصصی
│   │   └── 📁 components/          # کامپوننت‌های UI
│   ├── 📁 js/                      # اسکریپت‌ها
│   │   ├── main.js                 # اسکریپت اصلی
│   │   ├── 📁 admin/               # اسکریپت‌های ادمین
│   │   │   ├── dashboard.js        # مدیریت داشبورد
│   │   │   ├── router.js           # SPA Router
│   │   │   ├── sidebar.js          # مدیریت منو
│   │   │   └── 📁 modules/         # ماژول‌های تخصصی
│   │   └── 📁 modules/             # ماژول‌های مشترک
│   │       ├── numberUtils.js      # ابزار عددی فارسی
│   │       ├── persian-calendar.js # تقویم فارسی
│   │       └── simple-logger.js    # سیستم لاگ
│   ├── 📁 fonts/                   # فونت‌ها
│   │   └── vazirmatn/              # فونت فارسی
│   └── 📁 templates/               # قالب‌های HTML
├── 📁 backend/                     # Backend API
│   ├── 📁 api/v1/                  # API Version 1
│   │   ├── auth.php                # احراز هویت
│   │   ├── users.php               # مدیریت کاربران
│   │   ├── data-management.php     # مدیریت داده‌ها
│   │   ├── ai-settings.php         # تنظیمات AI
│   │   └── sms.php                 # سرویس SMS
│   ├── 📁 config/                  # تنظیمات
│   ├── 📁 models/                  # مدل‌های داده
│   └── 📁 database/                # اسکریپت‌های دیتابیس
├── 📁 Docs/                        # مستندات
│   ├── 📁 fa/                      # مستندات فارسی
│   └── 📁 Prompts/                 # راهنماهای توسعه
├── 📁 tests/                       # فایل‌های تست
└── 📁 pages/                       # صفحات اضافی
```

## 🔒 امنیت

### 🛡️ **تدابیر امنیتی پیاده‌شده**
- ✅ **SQL Injection Prevention** با Prepared Statements
- ✅ **XSS Protection** با Data Validation
- ✅ **JWT Authentication** برای API
- ✅ **Password Hashing** با bcrypt
- ✅ **HTTPS Enforcement** در production
- ✅ **API Keys Protection** با .gitignore

### ⚠️ **نکات امنیتی مهم**
```bash
# هرگز کلیدهای API را commit نکنید
echo "Docs/Prompts/api-openai-local.txt" >> .gitignore

# تغییر پسوردهای پیش‌فرض
# admin/admin -> پسورد قوی

# تنظیم مجوزهای فایل در سرور
chmod 644 *.php
chmod 755 directories/
```

## 🤝 مشارکت در پروژه

### 📋 **راهنمای مشارکت**
1. **Fork** کردن پروژه
2. ایجاد **branch** جدید: `git checkout -b feature/amazing-feature`
3. **Commit** تغییرات: `git commit -m 'Add amazing feature'`
4. **Push** به branch: `git push origin feature/amazing-feature`
5. ایجاد **Pull Request**

### 🐛 **گزارش مشکلات**
- از [GitHub Issues](https://github.com/123hassani-ai/datasave/issues) استفاده کنید
- توضیح کامل مشکل + اسکرین‌شات
- محیط توسعه (OS, Browser, PHP Version)

## 📚 منابع و مستندات

### 📖 **مستندات تفصیلی**
- [راهنمای توسعه](Docs/fa/complete-guide.md)
- [مستندات Backend](Docs/fa/Backend-Documentation.md)
- [راهنمای AI Settings](Docs/fa/AI_SETTINGS_DEVELOPMENT_GUIDE.md)
- [مستندات Excel Import](Docs/fa/EXCEL_TO_MYSQL_DEVELOPMENT_ROADMAP.md)

### 🔗 **لینک‌های مفید**
- [PHP Official Documentation](https://www.php.net/docs.php)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Bootstrap RTL](https://github.com/MahdiMajidzadeh/bootstrap-v4-rtl)
- [Vazirmatn Font](https://github.com/rastikerdar/vazirmatn)

## 📞 پشتیبانی

### 💬 **راه‌های ارتباط**
- **GitHub Issues**: برای گزارش مشکلات
- **Email**: 123hassani.ai@gmail.com
- **Telegram**: @hassani_ai_dev

### ❓ **سوالات متداول**
**Q: چگونه API Key را تنظیم کنم؟**
A: فایل `api-openai-template.txt` را کپی کرده و کلیدهای واقعی را وارد کنید.

**Q: چگونه دیتابیس را reset کنم؟**
A: اسکریپت‌های موجود در `backend/database/` را مجدداً اجرا کنید.

**Q: پروژه روی hosting های مشترک کار می‌کند؟**
A: بله، فقط PHP 8.0+ و MySQL 8.0+ نیاز دارد.

---

## 📄 لایسنس

این پروژه تحت لایسنس **MIT** منتشر شده است. برای جزئیات بیشتر فایل `LICENSE` را مطالعه کنید.

---

<div align="center">
    <p>ساخته شده با ❤️ توسط <a href="https://github.com/123hassani-ai">123hassani-ai</a></p>
    <p>⭐ اگر از پروژه راضی هستید، یک ستاره بدهید!</p>
</div>
post_max_size = 50M

# فعال‌سازی خطاها در development
display_errors = On
error_reporting = E_ALL
```

2. **تنظیم پایگاه داده**:
```bash
# اجرای اسکریپت پایگاه داده
mysql -u root -p < backend/database/schema.sql
```

3. **تنظیم فایل کانفیگ**:
```php
// backend/config/database.php
$host = '127.0.0.1';
$port = '3307';
$dbname = 'ai_excell2form';
$username = 'root';
$password = 'YourPassword';
```

4. **راه‌اندازی سرور**:
```bash
# در پوشه اصلی XAMPP
cd /Applications/XAMPP/xamppfiles/htdocs/datasave
php -S localhost:8000
```

5. **دسترسی به برنامه**:
- آدرس اصلی: `http://localhost:8000`
- داشبورد ادمین: `http://localhost:8000/admin`
- صفحه تست: `http://localhost:8000/tests/`

## 📁 ساختار پروژه

```
datasave/
├── index.html              # صفحه اصلی
├── assets/                 # فایل‌های استاتیک
│   ├── css/               # استایل‌ها
│   │   ├── admin/         # استایل‌های داشبورد
│   │   └── main.css       # استایل اصلی
│   └── js/                # جاوااسکریپت
│       ├── admin/         # ماژول‌های داشبورد
│       └── modules/       # ماژول‌های اصلی
├── backend/               # API و سرور
│   ├── api/v1/           # نسخه ۱ API
│   ├── config/           # تنظیمات
│   ├── database/         # اسکریپت‌های پایگاه داده
│   └── models/           # مدل‌های داده
├── tests/                # فایل‌های تست
├── logs/                 # فایل‌های لاگ
└── docs/                 # مستندات
    └── fa/               # مستندات فارسی
```

## 🧪 تست سیستم

### تست‌های موجود

- **تست خطاها**: `tests/test-errors.html`
- **تست بک‌اند**: `tests/test-backend.html`
- **تست سریع**: `tests/quick-test.html`

### راه‌اندازی تست‌ها
```bash
# بعد از راه‌اندازی سرور اصلی
open http://localhost:8000/tests/test-logging.html
```

## 🔐 احراز هویت

### کاربر پیش‌فرض
- **نام کاربری**: `admin`
- **رمز عبور**: `admin123`
- **نقش**: مدیر سیستم

### نقش‌های کاربری
1. **مدیر سیستم**: دسترسی کامل
2. **کاربر عادی**: دسترسی محدود
3. **نظارتی**: مدیریت محتوا
4. **مهمان**: فقط مشاهده

## 📊 سیستم لاگ‌گیری

### ویژگی‌های جدید
- **سیستم سبک و ساده**: فقط لاگ در کنسول مرورگر
- **پشتیبانی کامل از فارسی**: نمایش صحیح تاریخ و زمان فارسی
- **عدم نیاز به ذخیره‌سازی فایل**: کاهش مصرف منابع
- **عملکرد بهینه**: سرعت بالا و مصرف حافظه کم

### نحوه استفاده
```javascript
// لاگ‌های ساده
Logger.info('کاربر وارد سیستم شد');
Logger.warn('فضای ذخیره‌سازی کم است');
Logger.error('خطا در اتصال به سرور');

// لاگ با داده‌های اضافی
Logger.info('فایل آپلود شد', {
    fileName: 'document.pdf',
    fileSize: '2.5MB',
    userId: 12345
});
```

### سطوح لاگ
- **DEBUG**: اطلاعات توسعه
- **INFO**: اطلاعات عمومی
- **WARN**: هشدارها
- **ERROR**: خطاها
- **FATAL**: خطاهای مهلک

### تست سیستم لاگ‌گیری
- **صفحه تست**: `tests/test-logging.html`
- **پنل مدیریت**: `admin/logger-panel.html`

## 🔧 تنظیمات

### متغیرهای محیط
- `DB_HOST`: آدرس پایگاه داده (پیش‌فرض: 127.0.0.1)
- `DB_PORT`: پورت پایگاه داده (پیش‌فرض: 3307)
- `DB_NAME`: نام پایگاه داده (پیش‌فرض: ai_excell2form)

## 🐛 عیب‌یابی

### مشکلات شایع

1. **مشکل اتصال سرور**:
   - بررسی اجرای سرور: `php -S localhost:8000`
   - تست اتصال سرور: `tests/test-backend.html`

2. **مشکل اتصال پایگاه داده**:
   - بررسی تنظیمات `backend/config/database.php`
   - اطمینان از اجرای MySQL روی پورت ۳۳۰۷

3. **فایل‌ها لود نمی‌شوند**:
   - بررسی مسیر سرور: `http://localhost:8000`
   - تست CORS و مجوزات فایل‌ها

### لاگ‌های سیستم
- **مسیر لاگ‌ها**: فقط در کنسول مرورگر
- **فرمت**: قالب‌بندی شده با زمان و تاریخ فارسی
- **ذخیره‌سازی**: بدون ذخیره‌سازی فایل (فقط کنسول)

---

## 📝 تاریخچه تغییرات (Changelog)

### 🎉 **نسخه 2.1.0** - ۱۴ دسامبر ۲۰۲۴
#### ✨ **ویژگی‌های جدید**
- 🗃️ **ایجاد جدول واقعی MySQL** - تبدیل Excel به جداول واقعی دیتابیس
- 📦 **انتقال داده‌های Excel** - import کامل داده‌ها با mapping فیلدها
- 🔤 **سیستم ترجمه فیلدها** - تبدیل نام‌های فارسی به انگلیسی
- 🧠 **تحلیل هوشمند AI** - پیشنهاد ساختار بهینه جدول
- 🔍 **پیش‌نمایش SQL زنده** - نمایش ساختار جدول در real-time
- ✅ **تست و تأیید** - سیستم verify برای بررسی جداول ایجاد شده

#### 🔧 **بهبودها**
- 📊 **Timeline بهتر** - نمایش دقیق‌تر مراحل پردازش
- 🚀 **Performance** - بهبود سرعت پردازش فایل‌های بزرگ
- 🛡️ **امنیت** - SQL injection prevention و validation
- 🎨 **UI/UX** - بهبود رابط کاربری و پیام‌های feedback

#### � **رفع مشکلات**
- ✅ جایگزینی simulation با API واقعی
- ✅ رفع مشکل نام‌گذاری جداول
- ✅ بهبود مدیریت خطاها
- ✅ رفع مشکلات encoding فارسی

### 📈 **نسخه 2.0.0** - ۹ سپتامبر ۲۰۲۴
#### 🎯 **ویژگی‌های اصلی**
- 🏢 **Admin Dashboard** کامل با طراحی RTL
- 📊 **Data Management** با Excel import
- 🤖 **AI Settings** برای مدیریت API keys
- 📱 **SMS Management** با چندین provider
- 🔐 **Authentication System** با JWT

#### 💫 **نسخه 1.0.0** - ابتدای پروژه
- 🌟 **راه‌اندازی اولیه** پروژه
- 🎨 **UI Framework** پایه
- 📱 **Responsive Design** اساسی

---

## �📞 پشتیبانی

### منابع کمک
- **مستندات فنی**: `docs/fa/`
- **راهنمای API**: `backend/api/v1/`
- **تست‌های سیستم**: `tests/`

### 📚 راهنماهای جامع
- **[راهنمای کامل UI/UX و RTL](Docs/fa/UI_UX_RTL_COMPLETE_GUIDE.md)** - طراحی RTL، فونت وزیرمتن و responsive design
- **[راهنمای کامل Admin Dashboard](Docs/fa/ADMIN_DASHBOARD_COMPLETE_GUIDE.md)** - معماری، migration و استانداردسازی داشبورد
- **[راهنمای کامل AI Settings](Docs/fa/AI_SETTINGS_COMPLETE_GUIDE.md)** - پیاده‌سازی کامل ماژول تنظیمات هوش مصنوعی
- **[راهنمای توسعه](Docs/fa/DEVELOPMENT_GUIDE.md)** - نصب، پیکربندی و workflow توسعه
- **[راهنمای امنیت](Docs/fa/SECURITY_GUIDE.md)** - best practices امنیتی و OWASP
- **[مستندات API](Docs/fa/API_DOCUMENTATION.md)** - مرجع کامل APIهای سیستم

### ارتباط
- **گزارش مشکلات**: از طریق صفحه تست‌ها

---

## 📜 مجوز

این پروژه تحت مجوز MIT منتشر شده است.

## 🙏 تشکر

از تمامی توسعه‌دهندگان و کاربرانی که در بهبود این پروژه مشارکت دارند، تشکر می‌کنیم.

---

**نسخه**: 2.1.0 🎉  
**آخرین بروزرسانی**: ۱۴ دسامبر ۲۰۲۴  
**وضعیت**: آماده تولید - Excel-to-Database کاملاً عملیاتی ✅