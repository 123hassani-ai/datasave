# راهنمای توسعه ماژول تنظیمات هوش مصنوعی
## AI Settings Module Development Guide

### 📝 نسخه نهایی
**نسخه**: 1.1.0  
**تاریخ به‌روزرسانی**: 1404/06/20  
**وضعیت**: تکمیل شده و آماده برای استفاده ✅

### 📋 فهرست مطالب
1. [معرفی](#معرفی)
2. [مشخصات فنی](#مشخصات-فنی)
3. [معماری پیشنهادی](#معماری-پیشنهادی)
4. [ساختار فایل‌ها](#ساختار-فایلها)
5. [پیاده‌سازی جزئیات](#پیادهسازی-جزئیات)
6. [رابط کاربری](#رابط-کاربری)
7. [پایگاه داده](#پایگاه-داده)
8. [APIها و سرویس‌ها](#apiها-و-سرویسها)
9. [چک لیست توسعه](#چک-لیست-توسعه)
10. [تست‌ها](#تستها)
11. [مستندات](#مستندات)

## معرفی

این سند راهنمای توسعه ماژول "تنظیمات هوش مصنوعی" برای پنل مدیریت DataSave است. این ماژول شامل سه تب اصلی است:
1. تب تنظیمات مدل (Model Settings)
2. تب تنظیمات صوتی (Audio Settings)
3. تب تنظیمات تصویری (Image Settings)

### ویژگی‌های کلیدی
- **پشتیبانی از مدل‌های جدید OpenAI** شامل GPT-4o، GPT-4 Turbo و GPT-3.5 Turbo
- **قابلیت چت هوش مصنوعی** با مدل‌های مختلف
- **تبدیل متن به صوت (TTS)** با پشتیبانی از OpenAI و Google TTS
- **تبدیل صوت به متن (STT)** با استفاده از میکروفون و OpenAI Whisper API
- **تولید تصویر** با استفاده از DALL-E
- **تحلیل تصویر** با استفاده از GPT-4 Vision API
- **استخراج متن از تصویر (OCR)** با پشتیبانی از زبان فارسی

## مشخصات فنی

### فناوری‌های استفاده شده
- **Frontend**: JavaScript ES6 Modules, HTML5, CSS3
- **Backend**: PHP 8+, MySQL/MariaDB
- **APIها**: OpenAI API, TTS/STT Services, OCR Services
- **معماری**: Modular Architecture (بر اساس ساختار موجود پروژه)

### الزامات سیستم
- پشتیبانی از ES6 Modules در مرورگر
- دسترسی به پایگاه داده MySQL
- اتصال اینترنت برای APIهای خارجی
- پشتیبانی از UTF-8 برای زبان فارسی

## معماری پیشنهادی

### ساختار ماژولار
```
assets/js/admin/modules/
├── ai-settings.js          # ماژول اصلی تنظیمات هوش مصنوعی
assets/js/modules/
├── aiUtils.js              # ابزارهای مرتبط با AI (در صورت نیاز)
backend/api/v1/
├── ai-settings.php         # API مدیریت تنظیمات AI
backend/database/
├── ai-settings-schema.sql  # اسکریپت ساختار جداول AI
```

### ادغام با سیستم موجود
- اضافه شدن route جدید در [router.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/router.js)
- اضافه شدن آیتم منو در [sidebar.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/sidebar.js)
- اضافه شدن کارت در [settings.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/modules/settings.js)

## ساختار فایل‌ها

### فایل اصلی ماژول (ai-settings.js)
```javascript
/**
 * ماژول تنظیمات هوش مصنوعی
 * AI Settings Module
 */
export default {
    /**
     * بارگذاری محتوای تنظیمات هوش مصنوعی
     */
    async loadContent() {
        // پیاده‌سازی محتوای تب‌ها
    },
    
    /**
     * مقداردهی اولیه ماژول
     */
    async init() {
        // پیاده‌سازی رویدادها و تب‌ها
    }
};
```

### API تنظیمات (ai-settings.php)
```php
<?php
/**
 * API تنظیمات هوش مصنوعی
 */
class AISettingsManager {
    // پیاده‌سازی متدهای ذخیره/بازیابی تنظیمات
}
```

## پیاده‌سازی جزئیات

### 1. تب تنظیمات مدل (Model Settings)

#### ویژگی‌ها:
- فیلد API Key برای OpenAI
- انتخاب مدل (GPT-4o, GPT-4 Turbo, GPT-4, GPT-3.5 Turbo)
- تنظیمات پیشرفته مدل (temperature, max_tokens, etc.)
- شبیه‌ساز چت برای تست مدل‌ها

#### المان‌های UI:
``html
<!-- فرم تنظیمات مدل -->
<form id="modelSettingsForm">
    <div class="form-group">
        <label>API Key</label>
        <input type="password" id="openai_api_key" class="form-input">
    </div>
    
    <div class="form-group">
        <label>انتخاب مدل</label>
        <select id="ai_model" class="form-select">
            <option value="gpt-4o">GPT-4o (جدیدترین)</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
        </select>
    </div>
    
    <!-- سایر تنظیمات -->
    
    <!-- شبیه‌ساز چت -->
    <div class="chat-simulator">
        <div class="chat-messages" id="chatMessages"></div>
        <div class="chat-input">
            <input type="text" id="chatInput" placeholder="پیام خود را وارد کنید...">
            <button id="sendChatBtn">ارسال</button>
        </div>
    </div>
</form>
```

### 2. تب تنظیمات صوتی (Audio Settings)

#### ویژگی‌ها:
- تنظیمات TTS (Text-to-Speech) با پشتیبانی از OpenAI و Google TTS
- تنظیمات STT (Speech-to-Text) با استفاده از میکروفون و OpenAI Whisper API
- انتخاب صدا (مرد/زن)
- کنترل سرعت و تنظیمات صوتی
- قابلیت تست صدا با پخش زنده

#### المان‌های UI:
``html
<!-- فرم تنظیمات صوتی -->
<form id="audioSettingsForm">
    <div class="form-group">
        <label>سرویس TTS</label>
        <select id="tts_service" class="form-select">
            <option value="openai">OpenAI TTS</option>
            <option value="google">Google TTS</option>
        </select>
    </div>
    
    <div class="form-group">
        <label>انتخاب صدا</label>
        <select id="voice_selection" class="form-select">
            <option value="male">مرد</option>
            <option value="female">زن</option>
        </select>
    </div>
    
    <div class="form-group">
        <label>سرعت</label>
        <input type="range" id="speech_speed" min="0.5" max="2" step="0.1" value="1">
        <span id="speedValue">1.0x</span>
    </div>
    
    <!-- تست صدا -->
    <div class="audio-test">
        <textarea id="testText" placeholder="متن برای تبدیل به صدا..."></textarea>
        <button id="testTTSBtn">تست TTS</button>
        <button id="testSTTBtn">تست STT</button>
        <audio id="audioPlayer" controls></audio>
    </div>
</form>
```

### نحوه استفاده از قابلیت\u200cهای صوتی

#### تبدیل متن به صوت (TTS)
1. **انتخاب سرویس TTS**: در حال حاضر OpenAI TTS پشتیبانی می\u200cشود. گزینه Google TTS برای توسعه آینده اضافه شده است.
2. **انتخاب صدا**: می\u200cتوانید بین صدای مرد (onyx) و صدای زن (nova) انتخاب کنید.
3. **تنظیم سرعت**: با استفاده از اسلایدر می\u200cتوانید سرعت تبدیل صوت را بین 0.5x تا 2.0x تنظیم کنید.
4. **تست TTS**: 
   - متن مورد نظر خود را در textarea وارد کنید
   - روی دکمه "تست TTS" کلیک کنید
   - صوت تولید شده به صورت خودکار پخش می\u200cشود

#### تبدیل صوت به متن (STT)
1. **دسترسی به میکروفون**: برای استفاده از این قابلیت نیاز به دسترسی به میکروفون دارید.
2. **ضبط صدا**: 
   - روی دکمه "تست STT" کلیک کنید
   - مجوز دسترسی به میکروفون را تأیید کنید
   - صحبت کنید (ضبط به صورت خودکار شروع می\u200cشود)
   - برای توقف ضبط، دوباره روی دکمه کلیک کنید یا 10 ثانیه صبر کنید
3. **دریافت متن**: متن استخراج شده به صورت خودکار در textarea قرار می\u200cگیرد.

### 3. تب تنظیمات تصویری (Image Settings)

#### ویژگی‌ها:
- تنظیمات تولید تصویر با استفاده از DALL-E 3
- تحلیل تصویر با استفاده از GPT-4 Vision API
- استخراج متن از تصویر (OCR) با پشتیبانی از زبان فارسی
- قابلیت تست هر سه عملکرد

#### المان‌های UI:
``html
<!-- فرم تنظیمات تصویری -->
<form id="imageSettingsForm">
    <div class="form-group">
        <label>سرویس تولید تصویر</label>
        <select id="image_generation_service" class="form-select">
            <option value="openai">OpenAI DALL-E</option>
            <option value="stability">Stability AI</option>
        </select>
    </div>
    
    <!-- تست تولید تصویر -->
    <div class="image-test">
        <textarea id="imagePrompt" placeholder="توضیح تصویر مورد نظر..."></textarea>
        <button id="generateImageBtn">تولید تصویر</button>
        <div id="generatedImageContainer"></div>
    </div>
    
    <!-- تست تحلیل تصویر -->
    <div class="image-analysis">
        <input type="file" id="imageToAnalyze" accept="image/*">
        <button id="analyzeImageBtn">تحلیل تصویر</button>
        <div id="imageAnalysisResult"></div>
    </div>
    
    <!-- تست OCR فارسی -->
    <div class="ocr-test">
        <input type="file" id="imageForOCR" accept="image/*">
        <button id="ocrBtn">استخراج متن (OCR)</button>
        <div id="ocrResult"></div>
    </div>
</form>
```

### نحوه استفاده از قابلیت\u200cهای تصویری

#### تولید تصویر با DALL-E
1. **انتخاب سرویس**: در حال حاضر OpenAI DALL-E 3 پشتیبانی می\u200cشود.
2. **تولید تصویر**:
   - توضیح تصویر مورد نظر خود را به زبان انگلیسی در textarea وارد کنید
   - روی دکمه "تولید تصویر" کلیک کنید
   - تصویر تولید شده به صورت خودکار نمایش داده می\u200cشود

#### تحلیل تصویر با GPT-4 Vision
1. **انتخاب تصویر**: 
   - روی دکمه "انتخاب فایل" در بخش "تحلیل تصویر" کلیک کنید
   - یک تصویر از کامپیوتر خود انتخاب کنید
2. **تحلیل تصویر**:
   - روی دکمه "تحلیل تصویر" کلیک کنید
   - نتیجه تحلیل به زبان فارسی نمایش داده می\u200cشود
   - تحلیل شامل شناسایی اشیاء، صحنه و محتوای تصویر است

#### استخراج متن از تصویر (OCR)
1. **انتخاب تصویر**:
   - روی دکمه "انتخاب فایل" در بخش "استخراج متن (OCR)" کلیک کنید
   - یک تصویر حاوی متن از کامپیوتر خود انتخاب کنید
2. **استخراج متن**:
   - روی دکمه "استخراج متن (OCR)" کلیک کنید
   - متن استخراج شده به زبان فارسی نمایش داده می\u200cشود
   - این قابلیت با استفاده از GPT-4 Vision API پیاده\u200cسازی شده است

## رابط کاربری

### طراحی رسپانسیو
- استفاده از Grid/Flexbox برای طراحی انعطاف‌پذیر
- اندازه فونت نسبی (rem/em)
- media queries برای سه breakpoints اصلی:
  - موبایل: تا 768px
  - تبلت: 769px تا 1024px
  - دسکتاپ: بالای 1024px

### استایل‌ها
- استفاده از متغیرهای CSS موجود در پروژه
- رعایت تم روشن/تاریک
- انیمیشن‌های ملایم برای تغییرات UI
- افکت‌های glassmorphism بر اساس استاندارد پروژه

## پایگاه داده

### جدول تنظیمات AI
```
CREATE TABLE IF NOT EXISTS `ai_settings` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `setting_key` varchar(100) NOT NULL,
    `setting_value` text DEFAULT NULL,
    `setting_type` enum('string', 'integer', 'boolean', 'json') NOT NULL DEFAULT 'string',
    `description` varchar(255) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### تنظیمات پیش‌فرض
```
INSERT INTO `ai_settings` (`setting_key`, `setting_value`, `setting_type`, `description`) VALUES
('openai_api_key', '', 'string', 'کلید API OpenAI'),
('ai_model', 'gpt-4o', 'string', 'مدل پیش‌فرض AI'),
('tts_service', 'openai', 'string', 'سرویس تبدیل متن به صوت'),
('voice_selection', 'female', 'string', 'انتخاب صدای پیش‌فرض'),
('speech_speed', '1.0', 'string', 'سرعت تبدیل متن به صوت'),
('image_generation_service', 'openai', 'string', 'سرویس تولید تصویر');
```

## APIها و سرویس‌ها

### OpenAI API
- **Endpoint**: `https://api.openai.com/v1/`
- **Authentication**: Bearer Token
- **Models**: gpt-4o, gpt-4-turbo, gpt-4, gpt-3.5-turbo, dall-e-3, tts-1, whisper-1
- **Vision API**: GPT-4 Vision برای تحلیل تصویر و OCR

### خدمات صوتی
- **TTS**: OpenAI TTS API با پشتیبانی از صداهای onyx (مرد) و nova (زن)
- **STT**: OpenAI Whisper API برای تبدیل صوت به متن با استفاده از میکروفون

### خدمات تصویری
- **تولید تصویر**: DALL-E 3 API
- **تحلیل تصویر**: GPT-4 Vision API با پشتیبانی از زبان فارسی
- **OCR فارسی**: GPT-4 Vision API برای استخراج متن فارسی از تصاویر

## چک لیست توسعه

### مرحله 1: آماده‌سازی پایگاه داده
- [ ] ایجاد جدول ai_settings
- [ ] درج تنظیمات پیش‌فرض
- [ ] اطمینان از اتصال صحیح به دیتابیس

### مرحله 2: پیاده‌سازی API
- [ ] ایجاد فایل ai-settings.php
- [ ] پیاده‌سازی متدهای getSettings و saveSettings
- [ ] تست APIها با Postman یا curl

### مرحله 3: توسعه فرانت‌اند
- [ ] ایجاد فایل ai-settings.js
- [ ] پیاده‌سازی ساختار تب‌ها
- [ ] اضافه کردن ماژول به router.js
- [ ] اضافه کردن آیتم منو به sidebar.js

### مرحله 4: پیاده‌سازی تب‌ها
- [x] تب تنظیمات مدل
  - [x] فرم API Key
  - [x] انتخاب مدل
  - [x] تنظیمات پیشرفته
  - [x] شبیه‌ساز چت
- [x] تب تنظیمات صوتی
  - [x] تنظیمات TTS
  - [x] تنظیمات STT با استفاده از میکروفون
  - [x] تست صدا
- [x] تب تنظیمات تصویری
  - [x] تنظیمات تولید تصویر
  - [x] تست تولید تصویر
  - [x] تست تحلیل تصویر
  - [x] تست OCR فارسی

### مرحله 5: ادغام با سیستم موجود
- [ ] اضافه کردن کارت AI Settings به settings.js
- [ ] تست ناوبری و عملکرد کامل
- [ ] بررسی سازگاری با تم‌های مختلف

### مرحله 6: تست‌ها
- [ ] تست عملکرد فرم‌ها
- [ ] تست ذخیره/بازیابی تنظیمات
- [ ] تست APIها
- [ ] تست رسپانسیو بودن
- [ ] تست در مرورگرهای مختلف

## تست‌ها

### تست واحد (Unit Tests)
- تست توابع ذخیره/بازیابی تنظیمات
- تست اعتبارسنجی فرم‌ها
- تست تبدیل داده‌ها

### تست ادغام (Integration Tests)
- تست اتصال به پایگاه داده
- تست APIها
- تست ناوبری بین تب‌ها

### تست پذیرش (Acceptance Tests)
- تست کاربردی تمامی ویژگی‌ها
- تست UI/UX
- تست عملکرد در دستگاه‌های مختلف

## مستندات

### مستندات توسعه‌دهنده
- توضیح ساختار کد
- راهنمای API
- نحوه اضافه کردن ویژگی جدید

### مستندات کاربر
- راهنمای استفاده از هر تب
- توضیح تنظیمات پیشرفته
- رفع مشکلات رایج

### مستندات API

### دریافت تنظیمات AI
**متد**: GET  
**آدرس**: `/backend/api/v1/ai-settings.php`  
**توضیح**: دریافت تمام تنظیمات AI از پایگاه داده  
**پارامترها**: بدون پارامتر  
**پاسخ موفق**:
``json
{
  "success": true,
  "data": {
    "openai_api_key": {
      "value": "sk-...",
      "type": "string"
    },
    "ai_model": {
      "value": "gpt-4o",
      "type": "string"
    },
    "temperature": {
      "value": 0.7,
      "type": "float"
    },
    "max_tokens": {
      "value": 1000,
      "type": "integer"
    },
    "tts_service": {
      "value": "openai",
      "type": "string"
    },
    "voice_selection": {
      "value": "female",
      "type": "string"
    },
    "speech_speed": {
      "value": 1.0,
      "type": "float"
    },
    "image_generation_service": {
      "value": "openai",
      "type": "string"
    }
  },
  "message": "تنظیمات AI با موفقیت بارگذاری شد"
}
```

### ذخیره تنظیمات AI
**متد**: POST  
**آدرس**: `/backend/api/v1/ai-settings.php`  
**توضیح**: ذخیره تنظیمات AI در پایگاه داده  
**پارامترها**:
```json
{
  "action": "save",
  "settings": {
    "openai_api_key": "sk-...",
    "ai_model": "gpt-4o",
    "temperature": 0.7,
    "max_tokens": 1000,
    "tts_service": "openai",
    "voice_selection": "female",
    "speech_speed": 1.0,
    "image_generation_service": "openai"
  }
}
```
**پاسخ موفق**:
``json
{
  "success": true,
  "message": "تنظیمات AI با موفقیت ذخیره شد",
  "data": {
    "saved_count": 8
  }
}
```

---

**نسخه**: 1.0.0  
**تاریخ ایجاد**: 1404/06/20  
**وضعیت**: آماده برای توسعه ✅
```

```
# راهنمای توسعه ماژول تنظیمات هوش مصنوعی
## AI Settings Module Development Guide

### 📝 نسخه نهایی
**نسخه**: 1.1.0  
**تاریخ به‌روزرسانی**: 1404/06/20  
**وضعیت**: تکمیل شده و آماده برای استفاده ✅

### 📋 فهرست مطالب
1. [معرفی](#معرفی)
2. [مشخصات فنی](#مشخصات-فنی)
3. [معماری پیشنهادی](#معماری-پیشنهادی)
4. [ساختار فایل‌ها](#ساختار-فایلها)
5. [پیاده‌سازی جزئیات](#پیادهسازی-جزئیات)
6. [رابط کاربری](#رابط-کاربری)
7. [پایگاه داده](#پایگاه-داده)
8. [APIها و سرویس‌ها](#apiها-و-سرویسها)
9. [چک لیست توسعه](#چک-لیست-توسعه)
10. [تست‌ها](#تستها)
11. [مستندات](#مستندات)

## معرفی

این سند راهنمای توسعه ماژول "تنظیمات هوش مصنوعی" برای پنل مدیریت DataSave است. این ماژول شامل سه تب اصلی است:
1. تب تنظیمات مدل (Model Settings)
2. تب تنظیمات صوتی (Audio Settings)
3. تب تنظیمات تصویری (Image Settings)

### ویژگی‌های کلیدی
- **پشتیبانی از مدل‌های جدید OpenAI** شامل GPT-4o، GPT-4 Turbo و GPT-3.5 Turbo
- **قابلیت چت هوش مصنوعی** با مدل‌های مختلف
- **تبدیل متن به صوت (TTS)** با پشتیبانی از OpenAI و Google TTS
- **تبدیل صوت به متن (STT)** با استفاده از میکروفون و OpenAI Whisper API
- **تولید تصویر** با استفاده از DALL-E
- **تحلیل تصویر** با استفاده از GPT-4 Vision API
- **استخراج متن از تصویر (OCR)** با پشتیبانی از زبان فارسی

## مشخصات فنی

### فناوری‌های استفاده شده
- **Frontend**: JavaScript ES6 Modules, HTML5, CSS3
- **Backend**: PHP 8+, MySQL/MariaDB
- **APIها**: OpenAI API, TTS/STT Services, OCR Services
- **معماری**: Modular Architecture (بر اساس ساختار موجود پروژه)

### الزامات سیستم
- پشتیبانی از ES6 Modules در مرورگر
- دسترسی به پایگاه داده MySQL
- اتصال اینترنت برای APIهای خارجی
- پشتیبانی از UTF-8 برای زبان فارسی

## معماری پیشنهادی

### ساختار ماژولار
```
assets/js/admin/modules/
├── ai-settings.js          # ماژول اصلی تنظیمات هوش مصنوعی
assets/js/modules/
├── aiUtils.js              # ابزارهای مرتبط با AI (در صورت نیاز)
backend/api/v1/
├── ai-settings.php         # API مدیریت تنظیمات AI
backend/database/
├── ai-settings-schema.sql  # اسکریپت ساختار جداول AI
```

### ادغام با سیستم موجود
- اضافه شدن route جدید در [router.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/router.js)
- اضافه شدن آیتم منو در [sidebar.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/sidebar.js)
- اضافه شدن کارت در [settings.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/modules/settings.js)

## ساختار فایل‌ها

### فایل اصلی ماژول (ai-settings.js)
```javascript
/**
 * ماژول تنظیمات هوش مصنوعی
 * AI Settings Module
 */
export default {
    /**
     * بارگذاری محتوای تنظیمات هوش مصنوعی
     */
    async loadContent() {
        // پیاده‌سازی محتوای تب‌ها
    },
    
    /**
     * مقداردهی اولیه ماژول
     */
    async init() {
        // پیاده‌سازی رویدادها و تب‌ها
    }
};
```

### API تنظیمات (ai-settings.php)
```php
<?php
/**
 * API تنظیمات هوش مصنوعی
 */
class AISettingsManager {
    // پیاده‌سازی متدهای ذخیره/بازیابی تنظیمات
}
```

## پیاده‌سازی جزئیات

### 1. تب تنظیمات مدل (Model Settings)

#### ویژگی‌ها:
- فیلد API Key برای OpenAI
- انتخاب مدل (GPT-4o, GPT-4 Turbo, GPT-4, GPT-3.5 Turbo)
- تنظیمات پیشرفته مدل (temperature, max_tokens, etc.)
- شبیه‌ساز چت برای تست مدل‌ها

#### المان‌های UI:
``html
<!-- فرم تنظیمات مدل -->
<form id="modelSettingsForm">
    <div class="form-group">
        <label>API Key</label>
        <input type="password" id="openai_api_key" class="form-input">
    </div>
    
    <div class="form-group">
        <label>انتخاب مدل</label>
        <select id="ai_model" class="form-select">
            <option value="gpt-4o">GPT-4o (جدیدترین)</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
        </select>
    </div>
    
    <!-- سایر تنظیمات -->
    
    <!-- شبیه‌ساز چت -->
    <div class="chat-simulator">
        <div class="chat-messages" id="chatMessages"></div>
        <div class="chat-input">
            <input type="text" id="chatInput" placeholder="پیام خود را وارد کنید...">
            <button id="sendChatBtn">ارسال</button>
        </div>
    </div>
</form>
```

### 2. تب تنظیمات صوتی (Audio Settings)

#### ویژگی‌ها:
- تنظیمات TTS (Text-to-Speech) با پشتیبانی از OpenAI و Google TTS
- تنظیمات STT (Speech-to-Text) با استفاده از میکروفون و OpenAI Whisper API
- انتخاب صدا (مرد/زن)
- کنترل سرعت و تنظیمات صوتی
- قابلیت تست صدا با پخش زنده

#### المان‌های UI:
``html
<!-- فرم تنظیمات صوتی -->
<form id="audioSettingsForm">
    <div class="form-group">
        <label>سرویس TTS</label>
        <select id="tts_service" class="form-select">
            <option value="openai">OpenAI TTS</option>
            <option value="google">Google TTS</option>
        </select>
    </div>
    
    <div class="form-group">
        <label>انتخاب صدا</label>
        <select id="voice_selection" class="form-select">
            <option value="male">مرد</option>
            <option value="female">زن</option>
        </select>
    </div>
    
    <div class="form-group">
        <label>سرعت</label>
        <input type="range" id="speech_speed" min="0.5" max="2" step="0.1" value="1">
        <span id="speedValue">1.0x</span>
    </div>
    
    <!-- تست صدا -->
    <div class="audio-test">
        <textarea id="testText" placeholder="متن برای تبدیل به صدا..."></textarea>
        <button id="testTTSBtn">تست TTS</button>
        <button id="testSTTBtn">تست STT</button>
        <audio id="audioPlayer" controls></audio>
    </div>
</form>
```

### نحوه استفاده از قابلیت\u200cهای صوتی

#### تبدیل متن به صوت (TTS)
1. **انتخاب سرویس TTS**: در حال حاضر OpenAI TTS پشتیبانی می\u200cشود. گزینه Google TTS برای توسعه آینده اضافه شده است.
2. **انتخاب صدا**: می\u200cتوانید بین صدای مرد (onyx) و صدای زن (nova) انتخاب کنید.
3. **تنظیم سرعت**: با استفاده از اسلایدر می\u200cتوانید سرعت تبدیل صوت را بین 0.5x تا 2.0x تنظیم کنید.
4. **تست TTS**: 
   - متن مورد نظر خود را در textarea وارد کنید
   - روی دکمه "تست TTS" کلیک کنید
   - صوت تولید شده به صورت خودکار پخش می\u200cشود

#### تبدیل صوت به متن (STT)
1. **دسترسی به میکروفون**: برای استفاده از این قابلیت نیاز به دسترسی به میکروفون دارید.
2. **ضبط صدا**: 
   - روی دکمه "تست STT" کلیک کنید
   - مجوز دسترسی به میکروفون را تأیید کنید
   - صحبت کنید (ضبط به صورت خودکار شروع می\u200cشود)
   - برای توقف ضبط، دوباره روی دکمه کلیک کنید یا 10 ثانیه صبر کنید
3. **دریافت متن**: متن استخراج شده به صورت خودکار در textarea قرار می\u200cگیرد.

### 3. تب تنظیمات تصویری (Image Settings)

#### ویژگی‌ها:
- تنظیمات تولید تصویر با استفاده از DALL-E 3
- تحلیل تصویر با استفاده از GPT-4 Vision API
- استخراج متن از تصویر (OCR) با پشتیبانی از زبان فارسی
- قابلیت تست هر سه عملکرد

#### المان‌های UI:
``html
<!-- فرم تنظیمات تصویری -->
<form id="imageSettingsForm">
    <div class="form-group">
        <label>سرویس تولید تصویر</label>
        <select id="image_generation_service" class="form-select">
            <option value="openai">OpenAI DALL-E</option>
            <option value="stability">Stability AI</option>
        </select>
    </div>
    
    <!-- تست تولید تصویر -->
    <div class="image-test">
        <textarea id="imagePrompt" placeholder="توضیح تصویر مورد نظر..."></textarea>
        <button id="generateImageBtn">تولید تصویر</button>
        <div id="generatedImageContainer"></div>
    </div>
    
    <!-- تست تحلیل تصویر -->
    <div class="image-analysis">
        <input type="file" id="imageToAnalyze" accept="image/*">
        <button id="analyzeImageBtn">تحلیل تصویر</button>
        <div id="imageAnalysisResult"></div>
    </div>
    
    <!-- تست OCR فارسی -->
    <div class="ocr-test">
        <input type="file" id="imageForOCR" accept="image/*">
        <button id="ocrBtn">استخراج متن (OCR)</button>
        <div id="ocrResult"></div>
    </div>
</form>
```

### نحوه استفاده از قابلیت\u200cهای تصویری

#### تولید تصویر با DALL-E
1. **انتخاب سرویس**: در حال حاضر OpenAI DALL-E 3 پشتیبانی می\u200cشود.
2. **تولید تصویر**:
   - توضیح تصویر مورد نظر خود را به زبان انگلیسی در textarea وارد کنید
   - روی دکمه "تولید تصویر" کلیک کنید
   - تصویر تولید شده به صورت خودکار نمایش داده می\u200cشود

#### تحلیل تصویر با GPT-4 Vision
1. **انتخاب تصویر**: 
   - روی دکمه "انتخاب فایل" در بخش "تحلیل تصویر" کلیک کنید
   - یک تصویر از کامپیوتر خود انتخاب کنید
2. **تحلیل تصویر**:
   - روی دکمه "تحلیل تصویر" کلیک کنید
   - نتیجه تحلیل به زبان فارسی نمایش داده می\u200cشود
   - تحلیل شامل شناسایی اشیاء، صحنه و محتوای تصویر است

#### استخراج متن از تصویر (OCR)
1. **انتخاب تصویر**:
   - روی دکمه "انتخاب فایل" در بخش "استخراج متن (OCR)" کلیک کنید
   - یک تصویر حاوی متن از کامپیوتر خود انتخاب کنید
2. **استخراج متن**:
   - روی دکمه "استخراج متن (OCR)" کلیک کنید
   - متن استخراج شده به زبان فارسی نمایش داده می\u200cشود
   - این قابلیت با استفاده از GPT-4 Vision API پیاده\u200cسازی شده است

## رابط کاربری

### طراحی رسپانسیو
- استفاده از Grid/Flexbox برای طراحی انعطاف‌پذیر
- اندازه فونت نسبی (rem/em)
- media queries برای سه breakpoints اصلی:
  - موبایل: تا 768px
  - تبلت: 769px تا 1024px
  - دسکتاپ: بالای 1024px

### استایل‌ها
- استفاده از متغیرهای CSS موجود در پروژه
- رعایت تم روشن/تاریک
- انیمیشن‌های ملایم برای تغییرات UI
- افکت‌های glassmorphism بر اساس استاندارد پروژه

## پایگاه داده

### جدول تنظیمات AI
```
CREATE TABLE IF NOT EXISTS `ai_settings` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `setting_key` varchar(100) NOT NULL,
    `setting_value` text DEFAULT NULL,
    `setting_type` enum('string', 'integer', 'boolean', 'json') NOT NULL DEFAULT 'string',
    `description` varchar(255) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### تنظیمات پیش‌فرض
```
INSERT INTO `ai_settings` (`setting_key`, `setting_value`, `setting_type`, `description`) VALUES
('openai_api_key', '', 'string', 'کلید API OpenAI'),
('ai_model', 'gpt-4o', 'string', 'مدل پیش‌فرض AI'),
('tts_service', 'openai', 'string', 'سرویس تبدیل متن به صوت'),
('voice_selection', 'female', 'string', 'انتخاب صدای پیش‌فرض'),
('speech_speed', '1.0', 'string', 'سرعت تبدیل متن به صوت'),
('image_generation_service', 'openai', 'string', 'سرویس تولید تصویر');
```

## APIها و سرویس‌ها

### OpenAI API
- **Endpoint**: `https://api.openai.com/v1/`
- **Authentication**: Bearer Token
- **Models**: gpt-4o, gpt-4-turbo, gpt-4, gpt-3.5-turbo, dall-e-3, tts-1, whisper-1
- **Vision API**: GPT-4 Vision برای تحلیل تصویر و OCR

### خدمات صوتی
- **TTS**: OpenAI TTS API با پشتیبانی از صداهای onyx (مرد) و nova (زن)
- **STT**: OpenAI Whisper API برای تبدیل صوت به متن با استفاده از میکروفون

### خدمات تصویری
- **تولید تصویر**: DALL-E 3 API
- **تحلیل تصویر**: GPT-4 Vision API با پشتیبانی از زبان فارسی
- **OCR فارسی**: GPT-4 Vision API برای استخراج متن فارسی از تصاویر

## چک لیست توسعه

### مرحله 1: آماده‌سازی پایگاه داده
- [ ] ایجاد جدول ai_settings
- [ ] درج تنظیمات پیش‌فرض
- [ ] اطمینان از اتصال صحیح به دیتابیس

### مرحله 2: پیاده‌سازی API
- [ ] ایجاد فایل ai-settings.php
- [ ] پیاده‌سازی متدهای getSettings و saveSettings
- [ ] تست APIها با Postman یا curl

### مرحله 3: توسعه فرانت‌اند
- [ ] ایجاد فایل ai-settings.js
- [ ] پیاده‌سازی ساختار تب‌ها
- [ ] اضافه کردن ماژول به router.js
- [ ] اضافه کردن آیتم منو به sidebar.js

### مرحله 4: پیاده‌سازی تب‌ها
- [x] تب تنظیمات مدل
  - [x] فرم API Key
  - [x] انتخاب مدل
  - [x] تنظیمات پیشرفته
  - [x] شبیه‌ساز چت
- [x] تب تنظیمات صوتی
  - [x] تنظیمات TTS
  - [x] تنظیمات STT با استفاده از میکروفون
  - [x] تست صدا
- [x] تب تنظیمات تصویری
  - [x] تنظیمات تولید تصویر
  - [x] تست تولید تصویر
  - [x] تست تحلیل تصویر
  - [x] تست OCR فارسی

### مرحله 5: ادغام با سیستم موجود
- [ ] اضافه کردن کارت AI Settings به settings.js
- [ ] تست ناوبری و عملکرد کامل
- [ ] بررسی سازگاری با تم‌های مختلف

### مرحله 6: تست‌ها
- [ ] تست عملکرد فرم‌ها
- [ ] تست ذخیره/بازیابی تنظیمات
- [ ] تست APIها
- [ ] تست رسپانسیو بودن
- [ ] تست در مرورگرهای مختلف

## تست‌ها

### تست واحد (Unit Tests)
- تست توابع ذخیره/بازیابی تنظیمات
- تست اعتبارسنجی فرم‌ها
- تست تبدیل داده‌ها

### تست ادغام (Integration Tests)
- تست اتصال به پایگاه داده
- تست APIها
- تست ناوبری بین تب‌ها

### تست پذیرش (Acceptance Tests)
- تست کاربردی تمامی ویژگی‌ها
- تست UI/UX
- تست عملکرد در دستگاه‌های مختلف

## مستندات

### مستندات توسعه‌دهنده
- توضیح ساختار کد
- راهنمای API
- نحوه اضافه کردن ویژگی جدید

### مستندات کاربر
- راهنمای استفاده از هر تب
- توضیح تنظیمات پیشرفته
- رفع مشکلات رایج

### مستندات API

### دریافت تنظیمات AI
**متد**: GET  
**آدرس**: `/backend/api/v1/ai-settings.php`  
**توضیح**: دریافت تمام تنظیمات AI از پایگاه داده  
**پارامترها**: بدون پارامتر  
**پاسخ موفق**:
``json
{
  "success": true,
  "data": {
    "openai_api_key": {
      "value": "sk-...",
      "type": "string"
    },
    "ai_model": {
      "value": "gpt-4o",
      "type": "string"
    },
    "temperature": {
      "value": 0.7,
      "type": "float"
    },
    "max_tokens": {
      "value": 1000,
      "type": "integer"
    },
    "tts_service": {
      "value": "openai",
      "type": "string"
    },
    "voice_selection": {
      "value": "female",
      "type": "string"
    },
    "speech_speed": {
      "value": 1.0,
      "type": "float"
    },
    "image_generation_service": {
      "value": "openai",
      "type": "string"
    }
  },
  "message": "تنظیمات AI با موفقیت بارگذاری شد"
}
```

### ذخیره تنظیمات AI
**متد**: POST  
**آدرس**: `/backend/api/v1/ai-settings.php`  
**توضیح**: ذخیره تنظیمات AI در پایگاه داده  
**پارامترها**:
```json
{
  "action": "save",
  "settings": {
    "openai_api_key": "sk-...",
    "ai_model": "gpt-4o",
    "temperature": 0.7,
    "max_tokens": 1000,
    "tts_service": "openai",
    "voice_selection": "female",
    "speech_speed": 1.0,
    "image_generation_service": "openai"
  }
}
```
**پاسخ موفق**:
``json
{
  "success": true,
  "message": "تنظیمات AI با موفقیت ذخیره شد",
  "data": {
    "saved_count": 8
  }
}
```

---

**نسخه**: 1.0.0  
**تاریخ ایجاد**: 1404/06/20  
**وضعیت**: آماده برای توسعه ✅
```

```
# راهنمای توسعه ماژول تنظیمات هوش مصنوعی
## AI Settings Module Development Guide

### 📝 نسخه نهایی
**نسخه**: 1.1.0  
**تاریخ به‌روزرسانی**: 1404/06/20  
**وضعیت**: تکمیل شده و آماده برای استفاده ✅

### 📋 فهرست مطالب
1. [معرفی](#معرفی)
2. [مشخصات فنی](#مشخصات-فنی)
3. [معماری پیشنهادی](#معماری-پیشنهادی)
4. [ساختار فایل‌ها](#ساختار-فایلها)
5. [پیاده‌سازی جزئیات](#پیادهسازی-جزئیات)
6. [رابط کاربری](#رابط-کاربری)
7. [پایگاه داده](#پایگاه-داده)
8. [APIها و سرویس‌ها](#apiها-و-سرویسها)
9. [چک لیست توسعه](#چک-لیست-توسعه)
10. [تست‌ها](#تستها)
11. [مستندات](#مستندات)

## معرفی

این سند راهنمای توسعه ماژول "تنظیمات هوش مصنوعی" برای پنل مدیریت DataSave است. این ماژول شامل سه تب اصلی است:
1. تب تنظیمات مدل (Model Settings)
2. تب تنظیمات صوتی (Audio Settings)
3. تب تنظیمات تصویری (Image Settings)

### ویژگی‌های کلیدی
- **پشتیبانی از مدل‌های جدید OpenAI** شامل GPT-4o، GPT-4 Turbo و GPT-3.5 Turbo
- **قابلیت چت هوش مصنوعی** با مدل‌های مختلف
- **تبدیل متن به صوت (TTS)** با پشتیبانی از OpenAI و Google TTS
- **تبدیل صوت به متن (STT)** با استفاده از میکروفون و OpenAI Whisper API
- **تولید تصویر** با استفاده از DALL-E
- **تحلیل تصویر** با استفاده از GPT-4 Vision API
- **استخراج متن از تصویر (OCR)** با پشتیبانی از زبان فارسی

## مشخصات فنی

### فناوری‌های استفاده شده
- **Frontend**: JavaScript ES6 Modules, HTML5, CSS3
- **Backend**: PHP 8+, MySQL/MariaDB
- **APIها**: OpenAI API, TTS/STT Services, OCR Services
- **معماری**: Modular Architecture (بر اساس ساختار موجود پروژه)

### الزامات سیستم
- پشتیبانی از ES6 Modules در مرورگر
- دسترسی به پایگاه داده MySQL
- اتصال اینترنت برای APIهای خارجی
- پشتیبانی از UTF-8 برای زبان فارسی

## معماری پیشنهادی

### ساختار ماژولار
```
assets/js/admin/modules/
├── ai-settings.js          # ماژول اصلی تنظیمات هوش مصنوعی
assets/js/modules/
├── aiUtils.js              # ابزارهای مرتبط با AI (در صورت نیاز)
backend/api/v1/
├── ai-settings.php         # API مدیریت تنظیمات AI
backend/database/
├── ai-settings-schema.sql  # اسکریپت ساختار جداول AI
```

### ادغام با سیستم موجود
- اضافه شدن route جدید در [router.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/router.js)
- اضافه شدن آیتم منو در [sidebar.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/sidebar.js)
- اضافه شدن کارت در [settings.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/modules/settings.js)

## ساختار فایل‌ها

### فایل اصلی ماژول (ai-settings.js)
```javascript
/**
 * ماژول تنظیمات هوش مصنوعی
 * AI Settings Module
 */
export default {
    /**
     * بارگذاری محتوای تنظیمات هوش مصنوعی
     */
    async loadContent() {
        // پیاده‌سازی محتوای تب‌ها
    },
    
    /**
     * مقداردهی اولیه ماژول
     */
    async init() {
        // پیاده‌سازی رویدادها و تب‌ها
    }
};
```

### API تنظیمات (ai-settings.php)
```php
<?php
/**
 * API تنظیمات هوش مصنوعی
 */
class AISettingsManager {
    // پیاده‌سازی متدهای ذخیره/بازیابی تنظیمات
}
```

## پیاده‌سازی جزئیات

### 1. تب تنظیمات مدل (Model Settings)

#### ویژگی‌ها:
- فیلد API Key برای OpenAI
- انتخاب مدل (GPT-4o, GPT-4 Turbo, GPT-4, GPT-3.5 Turbo)
- تنظیمات پیشرفته مدل (temperature, max_tokens, etc.)
- شبیه‌ساز چت برای تست مدل‌ها

#### المان‌های UI:
``html
<!-- فرم تنظیمات مدل -->
<form id="modelSettingsForm">
    <div class="form-group">
        <label>API Key</label>
        <input type="password" id="openai_api_key" class="form-input">
    </div>
    
    <div class="form-group">
        <label>انتخاب مدل</label>
        <select id="ai_model" class="form-select">
            <option value="gpt-4o">GPT-4o (جدیدترین)</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
        </select>
    </div>
    
    <!-- سایر تنظیمات -->
    
    <!-- شبیه‌ساز چت -->
    <div class="chat-simulator">
        <div class="chat-messages" id="chatMessages"></div>
        <div class="chat-input">
            <input type="text" id="chatInput" placeholder="پیام خود را وارد کنید...">
            <button id="sendChatBtn">ارسال</button>
        </div>
    </div>
</form>
```

### 2. تب تنظیمات صوتی (Audio Settings)

#### ویژگی‌ها:
- تنظیمات TTS (Text-to-Speech) با پشتیبانی از OpenAI و Google TTS
- تنظیمات STT (Speech-to-Text) با استفاده از میکروفون و OpenAI Whisper API
- انتخاب صدا (مرد/زن)
- کنترل سرعت و تنظیمات صوتی
- قابلیت تست صدا با پخش زنده

#### المان‌های UI:
``html
<!-- فرم تنظیمات صوتی -->
<form id="audioSettingsForm">
    <div class="form-group">
        <label>سرویس TTS</label>
        <select id="tts_service" class="form-select">
            <option value="openai">OpenAI TTS</option>
            <option value="google">Google TTS</option>
        </select>
    </div>
    
    <div class="form-group">
        <label>انتخاب صدا</label>
        <select id="voice_selection" class="form-select">
            <option value="male">مرد</option>
            <option value="female">زن</option>
        </select>
    </div>
    
    <div class="form-group">
        <label>سرعت</label>
        <input type="range" id="speech_speed" min="0.5" max="2" step="0.1" value="1">
        <span id="speedValue">1.0x</span>
    </div>
    
    <!-- تست صدا -->
    <div class="audio-test">
        <textarea id="testText" placeholder="متن برای تبدیل به صدا..."></textarea>
        <button id="testTTSBtn">تست TTS</button>
        <button id="testSTTBtn">تست STT</button>
        <audio id="audioPlayer" controls></audio>
    </div>
</form>
```

### نحوه استفاده از قابلیت\u200cهای صوتی

#### تبدیل متن به صوت (TTS)
1. **انتخاب سرویس TTS**: در حال حاضر OpenAI TTS پشتیبانی می\u200cشود. گزینه Google TTS برای توسعه آینده اضافه شده است.
2. **انتخاب صدا**: می\u200cتوانید بین صدای مرد (onyx) و صدای زن (nova) انتخاب کنید.
3. **تنظیم سرعت**: با استفاده از اسلایدر می\u200cتوانید سرعت تبدیل صوت را بین 0.5x تا 2.0x تنظیم کنید.
4. **تست TTS**: 
   - متن مورد نظر خود را در textarea وارد کنید
   - روی دکمه "تست TTS" کلیک کنید
   - صوت تولید شده به صورت خودکار پخش می\u200cشود

#### تبدیل صوت به متن (STT)
1. **دسترسی به میکروفون**: برای استفاده از این قابلیت نیاز به دسترسی به میکروفون دارید.
2. **ضبط صدا**: 
   - روی دکمه "تست STT" کلیک کنید
   - مجوز دسترسی به میکروفون را تأیید کنید
   - صحبت کنید (ضبط به صورت خودکار شروع می\u200cشود)
   - برای توقف ضبط، دوباره روی دکمه کلیک کنید یا 10 ثانیه صبر کنید
3. **دریافت متن**: متن استخراج شده به صورت خودکار در textarea قرار می\u200cگیرد.

### 3. تب تنظیمات تصویری (Image Settings)

#### ویژگی‌ها:
- تنظیمات تولید تصویر با استفاده از DALL-E 3
- تحلیل تصویر با استفاده از GPT-4 Vision API
- استخراج متن از تصویر (OCR) با پشتیبانی از زبان فارسی
- قابلیت تست هر سه عملکرد

#### المان‌های UI:
``html
<!-- فرم تنظیمات تصویری -->
<form id="imageSettingsForm">
    <div class="form-group">
        <label>سرویس تولید تصویر</label>
        <select id="image_generation_service" class="form-select">
            <option value="openai">OpenAI DALL-E</option>
            <option value="stability">Stability AI</option>
        </select>
    </div>
    
    <!-- تست تولید تصویر -->
    <div class="image-test">
        <textarea id="imagePrompt" placeholder="توضیح تصویر مورد نظر..."></textarea>
        <button id="generateImageBtn">تولید تصویر</button>
        <div id="generatedImageContainer"></div>
    </div>
    
    <!-- تست تحلیل تصویر -->
    <div class="image-analysis">
        <input type="file" id="imageToAnalyze" accept="image/*">
        <button id="analyzeImageBtn">تحلیل تصویر</button>
        <div id="imageAnalysisResult"></div>
    </div>
    
    <!-- تست OCR فارسی -->
    <div class="ocr-test">
        <input type="file" id="imageForOCR" accept="image/*">
        <button id="ocrBtn">استخراج متن (OCR)</button>
        <div id="ocrResult"></div>
    </div>
</form>
```

### نحوه استفاده از قابلیت\u200cهای تصویری

#### تولید تصویر با DALL-E
1. **انتخاب سرویس**: در حال حاضر OpenAI DALL-E 3 پشتیبانی می\u200cشود.
2. **تولید تصویر**:
   - توضیح تصویر مورد نظر خود را به زبان انگلیسی در textarea وارد کنید
   - روی دکمه "تولید تصویر" کلیک کنید
   - تصویر تولید شده به صورت خودکار نمایش داده می\u200cشود

#### تحلیل تصویر با GPT-4 Vision
1. **انتخاب تصویر**: 
   - روی دکمه "انتخاب فایل" در بخش "تحلیل تصویر" کلیک کنید
   - یک تصویر از کامپیوتر خود انتخاب کنید
2. **تحلیل تصویر**:
   - روی دکمه "تحلیل تصویر" کلیک کنید
   - نتیجه تحلیل به زبان فارسی نمایش داده می\u200cشود
   - تحلیل شامل شناسایی اشیاء، صحنه و محتوای تصویر است

#### استخراج متن از تصویر (OCR)
1. **انتخاب تصویر**:
   - روی دکمه "انتخاب فایل" در بخش "استخراج متن (OCR)" کلیک کنید
   - یک تصویر حاوی متن از کامپیوتر خود انتخاب کنید
2. **استخراج متن**:
   - روی دکمه "استخراج متن (OCR)" کلیک کنید
   - متن استخراج شده به زبان فارسی نمایش داده می\u200cشود
   - این قابلیت با استفاده از GPT-4 Vision API پیاده\u200cسازی شده است

## رابط کاربری

### طراحی رسپانسیو
- استفاده از Grid/Flexbox برای طراحی انعطاف‌پذیر
- اندازه فونت نسبی (rem/em)
- media queries برای سه breakpoints اصلی:
  - موبایل: تا 768px
  - تبلت: 769px تا 1024px
  - دسکتاپ: بالای 1024px

### استایل‌ها
- استفاده از متغیرهای CSS موجود در پروژه
- رعایت تم روشن/تاریک
- انیمیشن‌های ملایم برای تغییرات UI
- افکت‌های glassmorphism بر اساس استاندارد پروژه

## پایگاه داده

### جدول تنظیمات AI
```
CREATE TABLE IF NOT EXISTS `ai_settings` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `setting_key` varchar(100) NOT NULL,
    `setting_value` text DEFAULT NULL,
    `setting_type` enum('string', 'integer', 'boolean', 'json') NOT NULL DEFAULT 'string',
    `description` varchar(255) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### تنظیمات پیش‌فرض
```
INSERT INTO `ai_settings` (`setting_key`, `setting_value`, `setting_type`, `description`) VALUES
('openai_api_key', '', 'string', 'کلید API OpenAI'),
('ai_model', 'gpt-4o', 'string', 'مدل پیش‌فرض AI'),
('tts_service', 'openai', 'string', 'سرویس تبدیل متن به صوت'),
('voice_selection', 'female', 'string', 'انتخاب صدای پیش‌فرض'),
('speech_speed', '1.0', 'string', 'سرعت تبدیل متن به صوت'),
('image_generation_service', 'openai', 'string', 'سرویس تولید تصویر');
```

## APIها و سرویس‌ها

### OpenAI API
- **Endpoint**: `https://api.openai.com/v1/`
- **Authentication**: Bearer Token
- **Models**: gpt-4o, gpt-4-turbo, gpt-4, gpt-3.5-turbo, dall-e-3, tts-1, whisper-1
- **Vision API**: GPT-4 Vision برای تحلیل تصویر و OCR

### خدمات صوتی
- **TTS**: OpenAI TTS API با پشتیبانی از صداهای onyx (مرد) و nova (زن)
- **STT**: OpenAI Whisper API برای تبدیل صوت به متن با استفاده از میکروفون

### خدمات تصویری
- **تولید تصویر**: DALL-E 3 API
- **تحلیل تصویر**: GPT-4 Vision API با پشتیبانی از زبان فارسی
- **OCR فارسی**: GPT-4 Vision API برای استخراج متن فارسی از تصاویر

## چک لیست توسعه

### مرحله 1: آماده‌سازی پایگاه داده
- [ ] ایجاد جدول ai_settings
- [ ] درج تنظیمات پیش‌فرض
- [ ] اطمینان از اتصال صحیح به دیتابیس

### مرحله 2: پیاده‌سازی API
- [ ] ایجاد فایل ai-settings.php
- [ ] پیاده‌سازی متدهای getSettings و saveSettings
- [ ] تست APIها با Postman یا curl

### مرحله 3: توسعه فرانت‌اند
- [ ] ایجاد فایل ai-settings.js
- [ ] پیاده‌سازی ساختار تب‌ها
- [ ] اضافه کردن ماژول به router.js
- [ ] اضافه کردن آیتم منو به sidebar.js

### مرحله 4: پیاده‌سازی تب‌ها
- [x] تب تنظیمات مدل
  - [x] فرم API Key
  - [x] انتخاب مدل
  - [x] تنظیمات پیشرفته
  - [x] شبیه‌ساز چت
- [x] تب تنظیمات صوتی
  - [x] تنظیمات TTS
  - [x] تنظیمات STT با استفاده از میکروفون
  - [x] تست صدا
- [x] تب تنظیمات تصویری
  - [x] تنظیمات تولید تصویر
  - [x] تست تولید تصویر
  - [x] تست تحلیل تصویر
  - [x] تست OCR فارسی

### مرحله 5: ادغام با سیستم موجود
- [ ] اضافه کردن کارت AI Settings به settings.js
- [ ] تست ناوبری و عملکرد کامل
- [ ] بررسی سازگاری با تم‌های مختلف

### مرحله 6: تست‌ها
- [ ] تست عملکرد فرم‌ها
- [ ] تست ذخیره/بازیابی تنظیمات
- [ ] تست APIها
- [ ] تست رسپانسیو بودن
- [ ] تست در مرورگرهای مختلف

## تست‌ها

### تست واحد (Unit Tests)
- تست توابع ذخیره/بازیابی تنظیمات
- تست اعتبارسنجی فرم‌ها
- تست تبدیل داده‌ها

### تست ادغام (Integration Tests)
- تست اتصال به پایگاه داده
- تست APIها
- تست ناوبری بین تب‌ها

### تست پذیرش (Acceptance Tests)
- تست کاربردی تمامی ویژگی‌ها
- تست UI/UX
- تست عملکرد در دستگاه‌های مختلف

## مستندات

### مستندات توسعه‌دهنده
- توضیح ساختار کد
- راهنمای API
- نحوه اضافه کردن ویژگی جدید

### مستندات کاربر
- راهنمای استفاده از هر تب
- توضیح تنظیمات پیشرفته
- رفع مشکلات رایج

### مستندات API

### دریافت تنظیمات AI
**متد**: GET  
**آدرس**: `/backend/api/v1/ai-settings.php`  
**توضیح**: دریافت تمام تنظیمات AI از پایگاه داده  
**پارامترها**: بدون پارامتر  
**پاسخ موفق**:
``json
{
  "success": true,
  "data": {
    "openai_api_key": {
      "value": "sk-...",
      "type": "string"
    },
    "ai_model": {
      "value": "gpt-4o",
      "type": "string"
    },
    "temperature": {
      "value": 0.7,
      "type": "float"
    },
    "max_tokens": {
      "value": 1000,
      "type": "integer"
    },
    "tts_service": {
      "value": "openai",
      "type": "string"
    },
    "voice_selection": {
      "value": "female",
      "type": "string"
    },
    "speech_speed": {
      "value": 1.0,
      "type": "float"
    },
    "image_generation_service": {
      "value": "openai",
      "type": "string"
    }
  },
  "message": "تنظیمات AI با موفقیت بارگذاری شد"
}
```

### ذخیره تنظیمات AI
**متد**: POST  
**آدرس**: `/backend/api/v1/ai-settings.php`  
**توضیح**: ذخیره تنظیمات AI در پایگاه داده  
**پارامترها**:
```json
{
  "action": "save",
  "settings": {
    "openai_api_key": "sk-...",
    "ai_model": "gpt-4o",
    "temperature": 0.7,
    "max_tokens": 1000,
    "tts_service": "openai",
    "voice_selection": "female",
    "speech_speed": 1.0,
    "image_generation_service": "openai"
  }
}
```
**پاسخ موفق**:
``json
{
  "success": true,
  "message": "تنظیمات AI با موفقیت ذخیره شد",
  "data": {
    "saved_count": 8
  }
}
```

---

**نسخه**: 1.0.0  
**تاریخ ایجاد**: 1404/06/20  
**وضعیت**: آماده برای توسعه ✅
```

```
# راهنمای توسعه ماژول تنظیمات هوش مصنوعی
## AI Settings Module Development Guide

### 📝 نسخه نهایی
**نسخه**: 1.1.0  
**تاریخ به‌روزرسانی**: 1404/06/20  
**وضعیت**: تکمیل شده و آماده برای استفاده ✅

### 📋 فهرست مطالب
1. [معرفی](#معرفی)
2. [مشخصات فنی](#مشخصات-فنی)
3. [معماری پیشنهادی](#معماری-پیشنهادی)
4. [ساختار فایل‌ها](#ساختار-فایلها)
5. [پیاده‌سازی جزئیات](#پیادهسازی-جزئیات)
6. [رابط کاربری](#رابط-کاربری)
7. [پایگاه داده](#پایگاه-داده)
8. [APIها و سرویس‌ها](#apiها-و-سرویسها)
9. [چک لیست توسعه](#چک-لیست-توسعه)
10. [تست‌ها](#تستها)
11. [مستندات](#مستندات)

## معرفی

این سند راهنمای توسعه ماژول "تنظیمات هوش مصنوعی" برای پنل مدیریت DataSave است. این ماژول شامل سه تب اصلی است:
1. تب تنظیمات مدل (Model Settings)
2. تب تنظیمات صوتی (Audio Settings)
3. تب تنظیمات تصویری (Image Settings)

### ویژگی‌های کلیدی
- **پشتیبانی از مدل‌های جدید OpenAI** شامل GPT-4o، GPT-4 Turbo و GPT-3.5 Turbo
- **قابلیت چت هوش مصنوعی** با مدل‌های مختلف
- **تبدیل متن به صوت (TTS)** با پشتیبانی از OpenAI و Google TTS
- **تبدیل صوت به متن (STT)** با استفاده از میکروفون و OpenAI Whisper API
- **تولید تصویر** با استفاده از DALL-E
- **تحلیل تصویر** با استفاده از GPT-4 Vision API
- **استخراج متن از تصویر (OCR)** با پشتیبانی از زبان فارسی

## مشخصات فنی

### فناوری‌های استفاده شده
- **Frontend**: JavaScript ES6 Modules, HTML5, CSS3
- **Backend**: PHP 8+, MySQL/MariaDB
- **APIها**: OpenAI API, TTS/STT Services, OCR Services
- **معماری**: Modular Architecture (بر اساس ساختار موجود پروژه)

### الزامات سیستم
- پشتیبانی از ES6 Modules در مرورگر
- دسترسی به پایگاه داده MySQL
- اتصال اینترنت برای APIهای خارجی
- پشتیبانی از UTF-8 برای زبان فارسی

## معماری پیشنهادی

### ساختار ماژولار
```
assets/js/admin/modules/
├── ai-settings.js          # ماژول اصلی تنظیمات هوش مصنوعی
assets/js/modules/
├── aiUtils.js              # ابزارهای مرتبط با AI (در صورت نیاز)
backend/api/v1/
├── ai-settings.php         # API مدیریت تنظیمات AI
backend/database/
├── ai-settings-schema.sql  # اسکریپت ساختار جداول AI
```

### ادغام با سیستم موجود
- اضافه شدن route جدید در [router.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/router.js)
- اضافه شدن آیتم منو در [sidebar.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/sidebar.js)
- اضافه شدن کارت در [settings.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/modules/settings.js)

## ساختار فایل‌ها

### فایل اصلی ماژول (ai-settings.js)
```javascript
/**
 * ماژول تنظیمات هوش مصنوعی
 * AI Settings Module
 */
export default {
    /**
     * بارگذاری محتوای تنظیمات هوش مصنوعی
     */
    async loadContent() {
        // پیاده‌سازی محتوای تب‌ها
    },
    
    /**
     * مقداردهی اولیه ماژول
     */
    async init() {
        // پیاده‌سازی رویدادها و تب‌ها
    }
};
```

### API تنظیمات (ai-settings.php)
```php
<?php
/**
 * API تنظیمات هوش مصنوعی
 */
class AISettingsManager {
    // پیاده‌سازی متدهای ذخیره/بازیابی تنظیمات
}
```

## پیاده‌سازی جزئیات

### 1. تب تنظیمات مدل (Model Settings)

#### ویژگی‌ها:
- فیلد API Key برای OpenAI
- انتخاب مدل (GPT-4o, GPT-4 Turbo, GPT-4, GPT-3.5 Turbo)
- تنظیمات پیشرفته مدل (temperature, max_tokens, etc.)
- شبیه‌ساز چت برای تست مدل‌ها

#### المان‌های UI:
``html
<!-- فرم تنظیمات مدل -->
<form id="modelSettingsForm">
    <div class="form-group">
        <label>API Key</label>
        <input type="password" id="openai_api_key" class="form-input">
    </div>
    
    <div class="form-group">
        <label>انتخاب مدل</label>
        <select id="ai_model" class="form-select">
            <option value="gpt-4o">GPT-4o (جدیدترین)</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
        </select>
    </div>
    
    <!-- سایر تنظیمات -->
    
    <!-- شبیه‌ساز چت -->
    <div class="chat-simulator">
        <div class="chat-messages" id="chatMessages"></div>
        <div class="chat-input">
            <input type="text" id="chatInput" placeholder="پیام خود را وارد کنید...">
            <button id="sendChatBtn">ارسال</button>
        </div>
    </div>
</form>
```

### 2. تب تنظیمات صوتی (Audio Settings)

#### ویژگی‌ها:
- تنظیمات TTS (Text-to-Speech) با پشتیبانی از OpenAI و Google TTS
- تنظیمات STT (Speech-to-Text) با استفاده از میکروفون و OpenAI Whisper API
- انتخاب صدا (مرد/زن)
- کنترل سرعت و تنظیمات صوتی
- قابلیت تست صدا با پخش زنده

#### المان‌های UI:
``html
<!-- فرم تنظیمات صوتی -->
<form id="audioSettingsForm">
    <div class="form-group">
        <label>سرویس TTS</label>
        <select id="tts_service" class="form-select">
            <option value="openai">OpenAI TTS</option>
            <option value="google">Google TTS</option>
        </select>
    </div>
    
    <div class="form-group">
        <label>انتخاب صدا</label>
        <select id="voice_selection" class="form-select">
            <option value="male">مرد</option>
            <option value="female">زن</option>
        </select>
    </div>
    
    <div class="form-group">
        <label>سرعت</label>
        <input type="range" id="speech_speed" min="0.5" max="2" step="0.1" value="1">
        <span id="speedValue">1.0x</span>
    </div>
    
    <!-- تست صدا -->
    <div class="audio-test">
        <textarea id="testText" placeholder="متن برای تبدیل به صدا..."></textarea>
        <button id="testTTSBtn">تست TTS</button>
        <button id="testSTTBtn">تست STT</button>
        <audio id="audioPlayer" controls></audio>
    </div>
</form>
```

### نحوه استفاده از قابلیت\u200cهای صوتی

#### تبدیل متن به صوت (TTS)
1. **انتخاب سرویس TTS**: در حال حاضر OpenAI TTS پشتیبانی می\u200cشود. گزینه Google TTS برای توسعه آینده اضافه شده است.
2. **انتخاب صدا**: می\u200cتوانید بین صدای مرد (onyx) و صدای زن (nova) انتخاب کنید.
3. **تنظیم سرعت**: با استفاده از اسلایدر می\u200cتوانید سرعت تبدیل صوت را بین 0.5x تا 2.0x تنظیم کنید.
4. **تست TTS**: 
   - متن مورد نظر خود را در textarea وارد کنید
   - روی دکمه "تست TTS" کلیک کنید
   - صوت تولید شده به صورت خودکار پخش می\u200cشود

#### تبدیل صوت به متن (STT)
1. **دسترسی به میکروفون**: برای استفاده از این قابلیت نیاز به دسترسی به میکروفون دارید.
2. **ضبط صدا**: 
   - روی دکمه "تست STT" کلیک کنید
   - مجوز دسترسی به میکروفون را تأیید کنید
   - صحبت کنید (ضبط به صورت خودکار شروع می\u200cشود)
   - برای توقف ضبط، دوباره روی دکمه کلیک کنید یا 10 ثانیه صبر کنید
3. **دریافت متن**: متن استخراج شده به صورت خودکار در textarea قرار می\u200cگیرد.

### 3. تب تنظیمات تصویری (Image Settings)

#### ویژگی‌ها:
- تنظیمات تولید تصویر با استفاده از DALL-E 3
- تحلیل تصویر با استفاده از GPT-4 Vision API
- استخراج متن از تصویر (OCR) با پشتیبانی از زبان فارسی
- قابلیت تست هر سه عملکرد

#### المان‌های UI:
``html
<!-- فرم تنظیمات تصویری -->
<form id="imageSettingsForm">
    <div class="form-group">
        <label>سرویس تولید تصویر</label>
        <select id="image_generation_service" class="form-select">
            <option value="openai">OpenAI DALL-E</option>
            <option value="stability">Stability AI</option>
        </select>
    </div>
    
    <!-- تست تولید تصویر -->
    <div class="image-test">
        <textarea id="imagePrompt" placeholder="توضیح تصویر مورد نظر..."></textarea>
        <button id="generateImageBtn">تولید تصویر</button>
        <div id="generatedImageContainer"></div>
    </div>
    
    <!-- تست تحلیل تصویر -->
    <div class="image-analysis">
        <input type="file" id="imageToAnalyze" accept="image/*">
        <button id="analyzeImageBtn">تحلیل تصویر</button>
        <div id="imageAnalysisResult"></div>
    </div>
    
    <!-- تست OCR فارسی -->
    <div class="ocr-test">
        <input type="file" id="imageForOCR" accept="image/*">
        <button id="ocrBtn">استخراج متن (OCR)</button>
        <div id="ocrResult"></div>
    </div>
</form>
```

### نحوه استفاده از قابلیت\u200cهای تصویری

#### تولید تصویر با DALL-E
1. **انتخاب سرویس**: در حال حاضر OpenAI DALL-E 3 پشتیبانی می\u200cشود.
2. **تولید تصویر**:
   - توضیح تصویر مورد نظر خود را به زبان انگلیسی در textarea وارد کنید
   - روی دکمه "تولید تصویر" کلیک کنید
   - تصویر تولید شده به صورت خودکار نمایش داده می\u200cشود

#### تحلیل تصویر با GPT-4 Vision
1. **انتخاب تصویر**: 
   - روی دکمه "انتخاب فایل" در بخش "تحلیل تصویر" کلیک کنید
   - یک تصویر از کامپیوتر خود انتخاب کنید
2. **تحلیل تصویر**:
   - روی دکمه "تحلیل تصویر" کلیک کنید
   - نتیجه تحلیل به زبان فارسی نمایش داده می\u200cشود
   - تحلیل شامل شناسایی اشیاء، صحنه و محتوای تصویر است

#### استخراج متن از تصویر (OCR)
1. **انتخاب تصویر**:
   - روی دکمه "انتخاب فایل" در بخش "استخراج متن (OCR)" کلیک کنید
   - یک تصویر حاوی متن از کامپیوتر خود انتخاب کنید
2. **استخراج متن**:
   - روی دکمه "استخراج متن (OCR)" کلیک کنید
   - متن استخراج شده به زبان فارسی نمایش داده می\u200cشود
   - این قابلیت با استفاده از GPT-4 Vision API پیاده\u200cسازی شده است

## رابط کاربری

### طراحی رسپانسیو
- استفاده از Grid/Flexbox برای طراحی انعطاف‌پذیر
- اندازه فونت نسبی (rem/em)
- media queries برای سه breakpoints اصلی:
  - موبایل: تا 768px
  - تبلت: 769px تا 1024px
  - دسکتاپ: بالای 1024px

### استایل‌ها
- استفاده از متغیرهای CSS موجود در پروژه
- رعایت تم روشن/تاریک
- انیمیشن‌های ملایم برای تغییرات UI
- افکت‌های glassmorphism بر اساس استاندارد پروژه

## پایگاه داده

### جدول تنظیمات AI
```
CREATE TABLE IF NOT EXISTS `ai_settings` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `setting_key` varchar(100) NOT NULL,
    `setting_value` text DEFAULT NULL,
    `setting_type` enum('string', 'integer', 'boolean', 'json') NOT NULL DEFAULT 'string',
    `description` varchar(255) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### تنظیمات پیش‌فرض
```
INSERT INTO `ai_settings` (`setting_key`, `setting_value`, `setting_type`, `description`) VALUES
('openai_api_key', '', 'string', 'کلید API OpenAI'),
('ai_model', 'gpt-4o', 'string', 'مدل پیش‌فرض AI'),
('tts_service', 'openai', 'string', 'سرویس تبدیل متن به صوت'),
('voice_selection', 'female', 'string', 'انتخاب صدای پیش‌فرض'),
('speech_speed', '1.0', 'string', 'سرعت تبدیل متن به صوت'),
('image_generation_service', 'openai', 'string', 'سرویس تولید تصویر');
```

## APIها و سرویس‌ها

### OpenAI API
- **Endpoint**: `https://api.openai.com/v1/`
- **Authentication**: Bearer Token
- **Models**: gpt-4o, gpt-4-turbo, gpt-4, gpt-3.5-turbo, dall-e-3, tts-1, whisper-1
- **Vision API**: GPT-4 Vision برای تحلیل تصویر و OCR

### خدمات صوتی
- **TTS**: OpenAI TTS API با پشتیبانی از صداهای onyx (مرد) و nova (زن)
- **STT**: OpenAI Whisper API برای تبدیل صوت به متن با استفاده از میکروفون

### خدمات تصویری
- **تولید تصویر**: DALL-E 3 API
- **تحلیل تصویر**: GPT-4 Vision API با پشتیبانی از زبان فارسی
- **OCR فارسی**: GPT-4 Vision API برای استخراج متن فارسی از تصاویر

## چک لیست توسعه

### مرحله 1: آماده‌سازی پایگاه داده
- [ ] ایجاد جدول ai_settings
- [ ] درج تنظیمات پیش‌فرض
- [ ] اطمینان از اتصال صحیح به دیتابیس

### مرحله 2: پیاده‌سازی API
- [ ] ایجاد فایل ai-settings.php
- [ ] پیاده‌سازی متدهای getSettings و saveSettings
- [ ] تست APIها با Postman یا curl

### مرحله 3: توسعه فرانت‌اند
- [ ] ایجاد فایل ai-settings.js
- [ ] پیاده‌سازی ساختار تب‌ها
- [ ] اضافه کردن ماژول به router.js
- [ ] اضافه کردن آیتم منو به sidebar.js

### مرحله 4: پیاده‌سازی تب‌ها
- [x] تب تنظیمات مدل
  - [x] فرم API Key
  - [x] انتخاب مدل
  - [x] تنظیمات پیشرفته
  - [x] شبیه‌ساز چت
- [x] تب تنظیمات صوتی
  - [x] تنظیمات TTS
  - [x] تنظیمات STT با استفاده از میکروفون
  - [x] تست صدا
- [x] تب تنظیمات تصویری
  - [x] تنظیمات تولید تصویر
  - [x] تست تولید تصویر
  - [x] تست تحلیل تصویر
  - [x] تست OCR فارسی

### مرحله 5: ادغام با سیستم موجود
- [ ] اضافه کردن کارت AI Settings به settings.js
- [ ] تست ناوبری و عملکرد کامل
- [ ] بررسی سازگاری با تم‌های مختلف

### مرحله 6: تست‌ها
- [ ] تست عملکرد فرم‌ها
- [ ] تست ذخیره/بازیابی تنظیمات
- [ ] تست APIها
- [ ] تست رسپانسیو بودن
- [ ] تست در مرورگرهای مختلف

## تست‌ها

### تست واحد (Unit Tests)
- تست توابع ذخیره/بازیابی تنظیمات
- تست اعتبارسنجی فرم‌ها
- تست تبدیل داده‌ها

### تست ادغام (Integration Tests)
- تست اتصال به پایگاه داده
- تست APIها
- تست ناوبری بین تب‌ها

### تست پذیرش (Acceptance Tests)
- تست کاربردی تمامی ویژگی‌ها
- تست UI/UX
- تست عملکرد در دستگاه‌های مختلف

## مستندات

### مستندات توسعه‌دهنده
- توضیح ساختار کد
- راهنمای API
- نحوه اضافه کردن ویژگی جدید

### مستندات کاربر
- راهنمای استفاده از هر تب
- توضیح تنظیمات پیشرفته
- رفع مشکلات رایج

### مستندات API

### دریافت تنظیمات AI
**متد**: GET  
**آدرس**: `/backend/api/v1/ai-settings.php`  
**توضیح**: دریافت تمام تنظیمات AI از پایگاه داده  
**پارامترها**: بدون پارامتر  
**پاسخ موفق**:
``json
{
  "success": true,
  "data": {
    "openai_api_key": {
      "value": "sk-...",
      "type": "string"
    },
    "ai_model": {
      "value": "gpt-4o",
      "type": "string"
    },
    "temperature": {
      "value": 0.7,
      "type": "float"
    },
    "max_tokens": {
      "value": 1000,
      "type": "integer"
    },
    "tts_service": {
      "value": "openai",
      "type": "string"
    },
    "voice_selection": {
      "value": "female",
      "type": "string"
    },
    "speech_speed": {
      "value": 1.0,
      "type": "float"
    },
    "image_generation_service": {
      "value": "openai",
      "type": "string"
    }
  },
  "message": "تنظیمات AI با موفقیت بارگذاری شد"
}
```

### ذخیره تنظیمات AI
**متد**: POST  
**آدرس**: `/backend/api/v1/ai-settings.php`  
**توضیح**: ذخیره تنظیمات AI در پایگاه داده  
**پارامترها**:
``json
{
  "action": "save",
  "settings": {
    "openai_api_key": "sk-...",
    "ai_model": "gpt-4o",
    "temperature": 0.7,
    "max_tokens": 1000,
    "tts_service": "openai",
    "voice_selection": "female",
    "speech_speed": 1.0,
    "image_generation_service": "openai"
  }
}
```
**پاسخ موفق**:
``json
{
  "success": true,
  "message": "تنظیمات AI با موفقیت ذخیره شد",
  "data": {
    "saved_count": 8
  }
}
```

---

**نسخه**: 1.0.0  
**تاریخ ایجاد**: 1404/06/20  
**وضعیت**: آماده برای توسعه ✅
```

```
# راهنمای توسعه ماژول تنظیمات هوش مصنوعی
## AI Settings Module Development Guide

### 📝 نسخه نهایی
**نسخه**: 1.1.0  
**تاریخ به‌روزرسانی**: 1404/06/20  
**وضعیت**: تکمیل شده و آماده برای استفاده ✅

### 📋 فهرست مطالب
1. [معرفی](#معرفی)
2. [مشخصات فنی](#مشخصات-فنی)
3. [معماری پیشنهادی](#معماری-پیشنهادی)
4. [ساختار فایل‌ها](#ساختار-فایلها)
5. [پیاده‌سازی جزئیات](#پیادهسازی-جزئیات)
6. [رابط کاربری](#رابط-کاربری)
7. [پایگاه داده](#پایگاه-داده)
8. [APIها و سرویس‌ها](#apiها-و-سرویسها)
9. [چک لیست توسعه](#چک-لیست-توسعه)
10. [تست‌ها](#تستها)
11. [مستندات](#مستندات)

## معرفی

این سند راهنمای توسعه ماژول "تنظیمات هوش مصنوعی" برای پنل مدیریت DataSave است. این ماژول شامل سه تب اصلی است:
1. تب تنظیمات مدل (Model Settings)
2. تب تنظیمات صوتی (Audio Settings)
3. تب تنظیمات تصویری (Image Settings)

### ویژگی‌های کلیدی
- **پشتیبانی از مدل‌های جدید OpenAI** شامل GPT-4o، GPT-4 Turbo و GPT-3.5 Turbo
- **قابلیت چت هوش مصنوعی** با مدل‌های مختلف
- **تبدیل متن به صوت (TTS)** با پشتیبانی از OpenAI و Google TTS
- **تبدیل صوت به متن (STT)** با استفاده از میکروفون و OpenAI Whisper API
- **تولید تصویر** با استفاده از DALL-E
- **تحلیل تصویر** با استفاده از GPT-4 Vision API
- **استخراج متن از تصویر (OCR)** با پشتیبانی از زبان فارسی

## مشخصات فنی

### فناوری‌های استفاده شده
- **Frontend**: JavaScript ES6 Modules, HTML5, CSS3
- **Backend**: PHP 8+, MySQL/MariaDB
- **APIها**: OpenAI API, TTS/STT Services, OCR Services
- **معماری**: Modular Architecture (بر اساس ساختار موجود پروژه)

### الزامات سیستم
- پشتیبانی از ES6 Modules در مرورگر
- دسترسی به پایگاه داده MySQL
- اتصال اینترنت برای APIهای خارجی
- پشتیبانی از UTF-8 برای زبان فارسی

## معماری پیشنهادی

### ساختار ماژولار
```
assets/js/admin/modules/
├── ai-settings.js          # ماژول اصلی تنظیمات هوش مصنوعی
assets/js/modules/
├── aiUtils.js              # ابزارهای مرتبط با AI (در صورت نیاز)
backend/api/v1/
├── ai-settings.php         # API مدیریت تنظیمات AI
backend/database/
├── ai-settings-schema.sql  # اسکریپت ساختار جداول AI
```

### ادغام با سیستم موجود
- اضافه شدن route جدید در [router.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/router.js)
- اضافه شدن آیتم منو در [sidebar.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/sidebar.js)
- اضافه شدن کارت در [settings.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/modules/settings.js)

## ساختار فایل‌ها

### فایل اصلی ماژول (ai-settings.js)
```javascript
/**
 * ماژول تنظیمات هوش مصنوعی
 * AI Settings Module
 */
export default {
    /**
     * بارگذاری محتوای تنظیمات هوش مصنوعی
     */
    async loadContent() {
        // پیاده‌سازی محتوای تب‌ها
    },
    
    /**
     * مقداردهی اولیه ماژول
     */
    async init() {
        // پیاده‌سازی رویدادها و تب‌ها
    }
};
```

### API تنظیمات (ai-settings.php)
```php
<?php
/**
 * API تنظیمات هوش مصنوعی
 */
class AISettingsManager {
    // پیاده‌سازی متدهای ذخیره/بازیابی تنظیمات
}
```

## پیاده‌سازی جزئیات

### 1. تب تنظیمات مدل (Model Settings)

#### ویژگی‌ها:
- فیلد API Key برای OpenAI
- انتخاب مدل (GPT-4o, GPT-4 Turbo, GPT-4, GPT-3.5 Turbo)
- تنظیمات پیشرفته مدل (temperature, max_tokens, etc.)
- شبیه‌ساز چت برای تست مدل‌ها

#### المان‌های UI:
``html
<!-- فرم تنظیمات مدل -->
<form id="modelSettingsForm">
    <div class="form-group">
        <label>API Key</label>
        <input type="password" id="openai_api_key" class="form-input">
    </div>
    
    <div class="form-group">
        <label>انتخاب مدل</label>
        <select id="ai_model" class="form-select">
            <option value="gpt-4o">GPT-4o (جدیدترین)</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
        </select>
    </div>
    
    <!-- سایر تنظیمات -->
    
    <!-- شبیه‌ساز چت -->
    <div class="chat-simulator">
        <div class="chat-messages" id="chatMessages"></div>
        <div class="chat-input">
            <input type="text" id="chatInput" placeholder="پیام خود را وارد کنید...">
            <button id="sendChatBtn">ارسال</button>
        </div>
    </div>
</form>
```

### 2. تب تنظیمات صوتی (Audio Settings)

#### ویژگی‌ها:
- تنظیمات TTS (Text-to-Speech) با پشتیبانی از OpenAI و Google TTS
- تنظیمات STT (Speech-to-Text) با استفاده از میکروفون و OpenAI Whisper API
- انتخاب صدا (مرد/زن)
- کنترل سرعت و تنظیمات صوتی
- قابلیت تست صدا با پخش زنده

#### المان‌های UI:
``html
<!-- فرم تنظیمات صوتی -->
<form id="audioSettingsForm">
    <div class="form-group">
        <label>سرویس TTS</label>
        <select id="tts_service" class="form-select">
            <option value="openai">OpenAI TTS</option>
            <option value="google">Google TTS</option>
        </select>
    </div>
    
    <div class="form-group">
        <label>انتخاب صدا</label>
        <select id="voice_selection" class="form-select">
            <option value="male">مرد</option>
            <option value="female">زن</option>
        </select>
    </div>
    
    <div class="form-group">
        <label>سرعت</label>
        <input type="range" id="speech_speed" min="0.5" max="2" step="0.1" value="1">
        <span id="speedValue">1.0x</span>
    </div>
    
    <!-- تست صدا -->
    <div class="audio-test">
        <textarea id="testText" placeholder="متن برای تبدیل به صدا..."></textarea>
        <button id="testTTSBtn">تست TTS</button>
        <button id="testSTTBtn">تست STT</button>
        <audio id="audioPlayer" controls></audio>
    </div>
</form>
```

### نحوه استفاده از قابلیت\u200cهای صوتی

#### تبدیل متن به صوت (TTS)
1. **انتخاب سرویس TTS**: در حال حاضر OpenAI TTS پشتیبانی می\u200cشود. گزینه Google TTS برای توسعه آینده اضافه شده است.
2. **انتخاب صدا**: می\u200cتوانید بین صدای مرد (onyx) و صدای زن (nova) انتخاب کنید.
3. **تنظیم سرعت**: با استفاده از اسلایدر می\u200cتوانید سرعت تبدیل صوت را بین 0.5x تا 2.0x تنظیم کنید.
4. **تست TTS**: 
   - متن مورد نظر خود را در textarea وارد کنید
   - روی دکمه "تست TTS" کلیک کنید
   - صوت تولید شده به صورت خودکار پخش می\u200cشود

#### تبدیل صوت به متن (STT)
1. **دسترسی به میکروفون**: برای استفاده از این قابلیت نیاز به دسترسی به میکروفون دارید.
2. **ضبط صدا**: 
   - روی دکمه "تست STT" کلیک کنید
   - مجوز دسترسی به میکروفون را تأیید کنید
   - صحبت کنید (ضبط به صورت خودکار شروع می\u200cشود)
   - برای توقف ضبط، دوباره روی دکمه کلیک کنید یا 10 ثانیه صبر کنید
3. **دریافت متن**: متن استخراج شده به صورت خودکار در textarea قرار می\u200cگیرد.

### 3. تب تنظیمات تصویری (Image Settings)

#### ویژگی‌ها:
- تنظیمات تولید تصویر با استفاده از DALL-E 3
- تحلیل تصویر با استفاده از GPT-4 Vision API
- استخراج متن از تصویر (OCR) با پشتیبانی از زبان فارسی
- قابلیت تست هر سه عملکرد

#### المان‌های UI:
``html
<!-- فرم تنظیمات تصویری -->
<form id="imageSettingsForm">
    <div class="form-group">
        <label>سرویس تولید تصویر</label>
        <select id="image_generation_service" class="form-select">
            <option value="openai">OpenAI DALL-E</option>
            <option value="stability">Stability AI</option>
        </select>
    </div>
    
    <!-- تست تولید تصویر -->
    <div class="image-test">
        <textarea id="imagePrompt" placeholder="توضیح تصویر مورد نظر..."></textarea>
        <button id="generateImageBtn">تولید تصویر</button>
        <div id="generatedImageContainer"></div>
    </div>
    
    <!-- تست تحلیل تصویر -->
    <div class="image-analysis">
        <input type="file" id="imageToAnalyze" accept="image/*">
        <button id="analyzeImageBtn">تحلیل تصویر</button>
        <div id="imageAnalysisResult"></div>
    </div>
    
    <!-- تست OCR فارسی -->
    <div class="ocr-test">
        <input type="file" id="imageForOCR" accept="image/*">
        <button id="ocrBtn">استخراج متن (OCR)</button>
        <div id="ocrResult"></div>
    </div>
</form>
```

### نحوه استفاده از قابلیت\u200cهای تصویری

#### تولید تصویر با DALL-E
1. **انتخاب سرویس**: در حال حاضر OpenAI DALL-E 3 پشتیبانی می\u200cشود.
2. **تولید تصویر**:
   - توضیح تصویر مورد نظر خود را به زبان انگلیسی در textarea وارد کنید
   - روی دکمه "تولید تصویر" کلیک کنید
   - تصویر تولید شده به صورت خودکار نمایش داده می\u200cشود

#### تحلیل تصویر با GPT-4 Vision
1. **انتخاب تصویر**: 
   - روی دکمه "انتخاب فایل" در بخش "تحلیل تصویر" کلیک کنید
   - یک تصویر از کامپیوتر خود انتخاب کنید
2. **تحلیل تصویر**:
   - روی دکمه "تحلیل تصویر" کلیک کنید
   - نتیجه تحلیل به زبان فارسی نمایش داده می\u200cشود
   - تحلیل شامل شناسایی اشیاء، صحنه و محتوای تصویر است

#### استخراج متن از تصویر (OCR)
1. **انتخاب تصویر**:
   - روی دکمه "انتخاب فایل" در بخش "استخراج متن (OCR)" کلیک کنید
   - یک تصویر حاوی متن از کامپیوتر خود انتخاب کنید
2. **استخراج متن**:
   - روی دکمه "استخراج متن (OCR)" کلیک کنید
   - متن استخراج شده به زبان فارسی نمایش داده می\u200cشود
   - این قابلیت با استفاده از GPT-4 Vision API پیاده\u200cسازی شده است

## رابط کاربری

### طراحی رسپانسیو
- استفاده از Grid/Flexbox برای طراحی انعطاف‌پذیر
- اندازه فونت نسبی (rem/em)
- media queries برای سه breakpoints اصلی:
  - موبایل: تا 768px
  - تبلت: 769px تا 1024px
  - دسکتاپ: بالای 1024px

### استایل‌ها
- استفاده از متغیرهای CSS موجود در پروژه
- رعایت تم روشن/تاریک
- انیمیشن‌های ملایم برای تغییرات UI
- افکت‌های glassmorphism بر اساس استاندارد پروژه

## پایگاه داده

### جدول تنظیمات AI
```
CREATE TABLE IF NOT EXISTS `ai_settings` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `setting_key` varchar(100) NOT NULL,
    `setting_value` text DEFAULT NULL,
    `setting_type` enum('string', 'integer', 'boolean', 'json') NOT NULL DEFAULT 'string',
    `description` varchar(255) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### تنظیمات پیش‌فرض
```
INSERT INTO `ai_settings` (`setting_key`, `setting_value`, `setting_type`, `description`) VALUES
('openai_api_key', '', 'string', 'کلید API OpenAI'),
('ai_model', 'gpt-4o', 'string', 'مدل پیش‌فرض AI'),
('tts_service', 'openai', 'string', 'سرویس تبدیل متن به صوت'),
('voice_selection', 'female', 'string', 'انتخاب صدای پیش‌فرض'),
('speech_speed', '1.0', 'string', 'سرعت تبدیل متن به صوت'),
('image_generation_service', 'openai', 'string', 'سرویس تولید تصویر');
```

## APIها و سرویس‌ها

### OpenAI API
- **Endpoint**: `https://api.openai.com/v1/`
- **Authentication**: Bearer Token
- **Models**: gpt-4o, gpt-4-turbo, gpt-4, gpt-3.5-turbo, dall-e-3, tts-1, whisper-1
- **Vision API**: GPT-4 Vision برای تحلیل تصویر و OCR

### خدمات صوتی
- **TTS**: OpenAI TTS API با پشتیبانی از صداهای onyx (مرد) و nova (زن)
- **STT**: OpenAI Whisper API برای تبدیل صوت به متن با استفاده از میکروفون

### خدمات تصویری
- **تولید تصویر**: DALL-E 3 API
- **تحلیل تصویر**: GPT-4 Vision API با پشتیبانی از زبان فارسی
- **OCR فارسی**: GPT-4 Vision API برای استخراج متن فارسی از تصاویر

## چک لیست توسعه

### مرحله 1: آماده‌سازی پایگاه داده
- [ ] ایجاد جدول ai_settings
- [ ] درج تنظیمات پیش‌فرض
- [ ] اطمینان از اتصال صحیح به دیتابیس

### مرحله 2: پیاده‌سازی API
- [ ] ایجاد فایل ai-settings.php
- [ ] پیاده‌سازی متدهای getSettings و saveSettings
- [ ] تست APIها با Postman یا curl

### مرحله 3: توسعه فرانت‌اند
- [ ] ایجاد فایل ai-settings.js
- [ ] پیاده‌سازی ساختار تب‌ها
- [ ] اضافه کردن ماژول به router.js
- [ ] اضافه کردن آیتم منو به sidebar.js

### مرحله 4: پیاده‌سازی تب‌ها
- [x] تب تنظیمات مدل
  - [x] فرم API Key
  - [x] انتخاب مدل
  - [x] تنظیمات پیشرفته
  - [x] شبیه‌ساز چت
- [x] تب تنظیمات صوتی
  - [x] تنظیمات TTS
  - [x] تنظیمات STT با استفاده از میکروفون
  - [x] تست صدا
- [x] تب تنظیمات تصویری
  - [x] تنظیمات تولید تصویر
  - [x] تست تولید تصویر
  - [x] تست تحلیل تصویر
  - [x] تست OCR فارسی

### مرحله 5: ادغام با سیستم موجود
- [ ] اضافه کردن کارت AI Settings به settings.js
- [ ] تست ناوبری و عملکرد کامل
- [ ] بررسی سازگاری با تم‌های مختلف

### مرحله 6: تست‌ها
- [ ] تست عملکرد فرم‌ها
- [ ] تست ذخیره/بازیابی تنظیمات
- [ ] تست APIها
- [ ] تست رسپانسیو بودن
- [ ] تست در مرورگرهای مختلف

## تست‌ها

### تست واحد (Unit Tests)
- تست توابع ذخیره/بازیابی تنظیمات
- تست اعتبارسنجی فرم‌ها
- تست تبدیل داده‌ها

### تست ادغام (Integration Tests)
- تست اتصال به پایگاه داده
- تست APIها
- تست ناوبری بین تب‌ها

### تست پذیرش (Acceptance Tests)
- تست کاربردی تمامی ویژگی‌ها
- تست UI/UX
- تست عملکرد در دستگاه‌های مختلف

## مستندات

### مستندات توسعه‌دهنده
- توضیح ساختار کد
- راهنمای API
- نحوه اضافه کردن ویژگی جدید

### مستندات کاربر
- راهنمای استفاده از هر تب
- توضیح تنظیمات پیشرفته
- رفع مشکلات رایج

### مستندات API

### دریافت تنظیمات AI
**متد**: GET  
**آدرس**: `/backend/api/v1/ai-settings.php`  
**توضیح**: دریافت تمام تنظیمات AI از پایگاه داده  
**پارامترها**: بدون پارامتر  
**پاسخ موفق**:
``json
{
  "success": true,
  "data": {
    "openai_api_key": {
      "value": "sk-...",
      "type": "string"
    },
    "ai_model": {
      "value": "gpt-4o",
      "type": "string"
    },
    "temperature": {
      "value": 0.7,
      "type": "float"
    },
    "max_tokens": {
      "value": 1000,
      "type": "integer"
    },
    "tts_service": {
      "value": "openai",
      "type": "string"
    },
    "voice_selection": {
      "value": "female",
      "type": "string"
    },
    "speech_speed": {
      "value": 1.0,
      "type": "float"
    },
    "image_generation_service": {
      "value": "openai",
      "type": "string"
    }
  },
  "message": "تنظیمات AI با موفقیت بارگذاری شد"
}
```

### ذخیره تنظیمات AI
**متد**: POST  
**آدرس**: `/backend/api/v1/ai-settings.php`  
**توضیح**: ذخیره تنظیمات AI در پایگاه داده  
**پارامترها**:
``json
{
  "action": "save",
  "settings": {
    "openai_api_key": "sk-...",
    "ai_model": "gpt-4o",
    "temperature": 0.7,
    "max_tokens": 1000,
    "tts_service": "openai",
    "voice_selection": "female",
    "speech_speed": 1.0,
    "image_generation_service": "openai"
  }
}
```
**پاسخ موفق**:
``json
{
  "success": true,
  "message": "تنظیمات AI با موفقیت ذخیره شد",
  "data": {
    "saved_count": 8
  }
}
```

---

**نسخه**: 1.0.0  
**تاریخ ایجاد**: 1404/06/20  
**وضعیت**: آماده برای توسعه ✅
```

```
# راهنمای توسعه ماژول تنظیمات هوش مصنوعی
## AI Settings Module Development Guide

### 📝 نسخه نهایی
**نسخه**: 1.1.0  
**تاریخ به‌روزرسانی**: 1404/06/20  
**وضعیت**: تکمیل شده و آماده برای استفاده ✅

### 📋 فهرست مطالب
1. [معرفی](#معرفی)
2. [مشخصات فنی](#مشخصات-فنی)
3. [معماری پیشنهادی](#معماری-پیشنهادی)
4. [ساختار فایل‌ها](#ساختار-فایلها)
5. [پیاده‌سازی جزئیات](#پیادهسازی-جزئیات)
6. [رابط کاربری](#رابط-کاربری)
7. [پایگاه داده](#پایگاه-داده)
8. [APIها و سرویس‌ها](#apiها-و-سرویسها)
9. [چک لیست توسعه](#چک-لیست-توسعه)
10. [تست‌ها](#تستها)
11. [مستندات](#مستندات)

## معرفی

این سند راهنمای توسعه ماژول "تنظیمات هوش مصنوعی" برای پنل مدیریت DataSave است. این ماژول شامل سه تب اصلی است:
1. تب تنظیمات مدل (Model Settings)
2. تب تنظیمات صوتی (Audio Settings)
3. تب تنظیمات تصویری (Image Settings)

### ویژگی‌های کلیدی
- **پشتیبانی از مدل‌های جدید OpenAI** شامل GPT-4o، GPT-4 Turbo و GPT-3.5 Turbo
- **قابلیت چت هوش مصنوعی** با مدل‌های مختلف
- **تبدیل متن به صوت (TTS)** با پشتیبانی از OpenAI و Google TTS
- **تبدیل صوت به متن (STT)** با استفاده از میکروفون و OpenAI Whisper API
- **تولید تصویر** با استفاده از DALL-E
- **تحلیل تصویر** با استفاده از GPT-4 Vision API
- **استخراج متن از تصویر (OCR)** با پشتیبانی از زبان فارسی

## مشخصات فنی

### فناوری‌های استفاده شده
- **Frontend**: JavaScript ES6 Modules, HTML5, CSS3
- **Backend**: PHP 8+, MySQL/MariaDB
- **APIها**: OpenAI API, TTS/STT Services, OCR Services
- **معماری**: Modular Architecture (بر اساس ساختار موجود پروژه)

### الزامات سیستم
- پشتیبانی از ES6 Modules در مرورگر
- دسترسی به پایگاه داده MySQL
- اتصال اینترنت برای APIهای خارجی
- پشتیبانی از UTF-8 برای زبان فارسی

## معماری پیشنهادی

### ساختار ماژولار
```
assets/js/admin/modules/
├── ai-settings.js          # ماژول اصلی تنظیمات هوش مصنوعی
assets/js/modules/
├── aiUtils.js              # ابزارهای مرتبط با AI (در صورت نیاز)
backend/api/v1/
├── ai-settings.php         # API مدیریت تنظیمات AI
backend/database/
├── ai-settings-schema.sql  # اسکریپت ساختار جداول AI
```

### ادغام با سیستم موجود
- اضافه شدن route جدید در [router.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/router.js)
- اضافه شدن آیتم منو در [sidebar.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/sidebar.js)
- اضافه شدن کارت در [settings.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/modules/settings.js)

## ساختار فایل‌ها

### فایل اصلی ماژول (ai-settings.js)
```javascript
/**
 * ماژول تنظیمات هوش مصنوعی
 * AI Settings Module
 */
export default {
    /**
     * بارگذاری محتوای تنظیمات هوش مصنوعی
     */
    async loadContent() {
        // پیاده‌سازی محتوای تب‌ها
    },
    
    /**
     * مقداردهی اولیه ماژول
     */
    async init() {
        // پیاده‌سازی رویدادها و تب‌ها
    }
};
```

### API تنظیمات (ai-settings.php)
```php
<?php
/**
 * API تنظیمات هوش مصنوعی
 */
class AISettingsManager {
    // پیاده‌سازی متدهای ذخیره/بازیابی تنظیمات
}
```

## پیاده‌سازی جزئیات

### 1. تب تنظیمات مدل (Model Settings)

#### ویژگی‌ها:
- فیلد API Key برای OpenAI
- انتخاب مدل (GPT-4o, GPT-4 Turbo, GPT-4, GPT-3.5 Turbo)
- تنظیمات پیشرفته مدل (temperature, max_tokens, etc.)
- شبیه‌ساز چت برای تست مدل‌ها

#### المان‌های UI:
``html
<!-- فرم تنظیمات مدل -->
<form id="modelSettingsForm">
    <div class="form-group">
        <label>API Key</label>
        <input type="password" id="openai_api_key" class="form-input">
    </div>
    
    <div class="form-group">
        <label>انتخاب مدل</label>
        <select id="ai_model" class="form-select">
            <option value="gpt-4o">GPT-4o (جدیدترین)</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
        </select>
    </div>
    
    <!-- سایر تنظیمات -->
    
    <!-- شبیه‌ساز چت -->
    <div class="chat-simulator">
        <div class="chat-messages" id="chatMessages"></div>
        <div class="chat-input">
            <input type="text" id="chatInput" placeholder="پیام خود را وارد کنید...">
            <button id="sendChatBtn">ارسال</button>
        </div>
    </div>
</form>
```

### 2. تب تنظیمات صوتی (Audio Settings)

#### ویژگی‌ها:
- تنظیمات TTS (Text-to-Speech) با پشتیبانی از OpenAI و Google TTS
- تنظیمات STT (Speech-to-Text) با استفاده از میکروفون و OpenAI Whisper API
- انتخاب صدا (مرد/زن)
- کنترل سرعت و تنظیمات صوتی
- قابلیت تست صدا با پخش زنده

#### المان‌های UI:
``html
<!-- فرم تنظیمات صوتی -->
<form id="audioSettingsForm">
    <div class="form-group">
        <label>سرویس TTS</label>
        <select id="tts_service" class="form-select">
            <option value="openai">OpenAI TTS</option>
            <option value="google">Google TTS</option>
        </select>
    </div>
    
    <div class="form-group">
        <label>انتخاب صدا</label>
        <select id="voice_selection" class="form-select">
            <option value="male">مرد</option>
            <option value="female">زن</option>
        </select>
    </div>
    
    <div class="form-group">
        <label>سرعت</label>
        <input type="range" id="speech_speed" min="0.5" max="2" step="0.1" value="1">
        <span id="speedValue">1.0x</span>
    </div>
    
    <!-- تست صدا -->
    <div class="audio-test">
        <textarea id="testText" placeholder="متن برای تبدیل به صدا..."></textarea>
        <button id="testTTSBtn">تست TTS</button>
        <button id="testSTTBtn">تست STT</button>
        <audio id="audioPlayer" controls></audio>
    </div>
</form>
```

### نحوه استفاده از قابلیت\u200cهای صوتی

#### تبدیل متن به صوت (TTS)
1. **انتخاب سرویس TTS**: در حال حاضر OpenAI TTS پشتیبانی می\u200cشود. گزینه Google TTS برای توسعه آینده اضافه شده است.
2. **انتخاب صدا**: می\u200cتوانید بین صدای مرد (onyx) و صدای زن (nova) انتخاب کنید.
3. **تنظیم سرعت**: با استفاده از اسلایدر می\u200cتوانید سرعت تبدیل صوت را بین 0.5x تا 2.0x تنظیم کنید.
4. **تست TTS**: 
   - متن مورد نظر خود را در textarea وارد کنید
   - روی دکمه "تست TTS" کلیک کنید
   - صوت تولید شده به صورت خودکار پخش می\u200cشود

#### تبدیل صوت به متن (STT)
1. **دسترسی به میکروفون**: برای استفاده از این قابلیت نیاز به دسترسی به میکروفون دارید.
2. **ضبط صدا**: 
   - روی دکمه "تست STT" کلیک کنید
   - مجوز دسترسی به میکروفون را تأیید کنید
   - صحبت کنید (ضبط به صورت خودکار شروع می\u200cشود)
   - برای توقف ضبط، دوباره روی دکمه کلیک کنید یا 10 ثانیه صبر کنید
3. **دریافت متن**: متن استخراج شده به صورت خودکار در textarea قرار می\u200cگیرد.

### 3. تب تنظیمات تصویری (Image Settings)

#### ویژگی‌ها:
- تنظیمات تولید تصویر با استفاده از DALL-E 3
- تحلیل تصویر با استفاده از GPT-4 Vision API
- استخراج متن از تصویر (OCR) با پشتیبانی از زبان فارسی
- قابلیت تست هر سه عملکرد

#### المان‌های UI:
``html
<!-- فرم تنظیمات تصویری -->
<form id="imageSettingsForm">
    <div class="form-group">
        <label>سرویس تولید تصویر</label>
        <select id="image_generation_service" class="form-select">
            <option value="openai">OpenAI DALL-E</option>
            <option value="stability">Stability AI</option>
        </select>
    </div>
    
    <!-- تست تولید تصویر -->
    <div class="image-test">
        <textarea id="imagePrompt" placeholder="توضیح تصویر مورد نظر..."></textarea>
        <button id="generateImageBtn">تولید تصویر</button>
        <div id="generatedImageContainer"></div>
    </div>
    
    <!-- تست تحلیل تصویر -->
    <div class="image-analysis">
        <input type="file" id="imageToAnalyze" accept="image/*">
        <button id="analyzeImageBtn">تحلیل تصویر</button>
        <div id="imageAnalysisResult"></div>
    </div>
    
    <!-- تست OCR فارسی -->
    <div class="ocr-test">
        <input type="file" id="imageForOCR" accept="image/*">
        <button id="ocrBtn">استخراج متن (OCR)</button>
        <div id="ocrResult"></div>
    </div>
</form>
```

### نحوه استفاده از قابلیت\u200cهای تصویری

#### تولید تصویر با DALL-E
1. **انتخاب سرویس**: در حال حاضر OpenAI DALL-E 3 پشتیبانی می\u200cشود.
2. **تولید تصویر**:
   - توضیح تصویر مورد نظر خود را به زبان انگلیسی در textarea وارد کنید
   - روی دکمه "تولید تصویر" کلیک کنید
   - تصویر تولید شده به صورت خودکار نمایش داده می\u200cشود

#### تحلیل تصویر با GPT-4 Vision
1. **انتخاب تصویر**: 
   - روی دکمه "انتخاب فایل" در بخش "تحلیل تصویر" کلیک کنید
   - یک تصویر از کامپیوتر خود انتخاب کنید
2. **تحلیل تصویر**:
   - روی دکمه "تحلیل تصویر" کلیک کنید
   - نتیجه تحلیل به زبان فارسی نمایش داده می\u200cشود
   - تحلیل شامل شناسایی اشیاء، صحنه و محتوای تصویر است

#### استخراج متن از تصویر (OCR)
1. **انتخاب تصویر**:
   - روی دکمه "انتخاب فایل" در بخش "استخراج متن (OCR)" کلیک کنید
   - یک تصویر حاوی متن از کامپیوتر خود انتخاب کنید
2. **استخراج متن**:
   - روی دکمه "استخراج متن (OCR)" کلیک کنید
   - متن استخراج شده به زبان فارسی نمایش داده می\u200cشود
   - این قابلیت با استفاده از GPT-4 Vision API پیاده\u200cسازی شده است

## رابط کاربری

### طراحی رسپانسیو
- استفاده از Grid/Flexbox برای طراحی انعطاف‌پذیر
- اندازه فونت نسبی (rem/em)
- media queries برای سه breakpoints اصلی:
  - موبایل: تا 768px
  - تبلت: 769px تا 1024px
  - دسکتاپ: بالای 1024px

### استایل‌ها
- استفاده از متغیرهای CSS موجود در پروژه
- رعایت تم روشن/تاریک
- انیمیشن‌های ملایم برای تغییرات UI
- افکت‌های glassmorphism بر اساس استاندارد پروژه

## پایگاه داده

### جدول تنظیمات AI
```
CREATE TABLE IF NOT EXISTS `ai_settings` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `setting_key` varchar(100) NOT NULL,
    `setting_value` text DEFAULT NULL,
    `setting_type` enum('string', 'integer', 'boolean', 'json') NOT NULL DEFAULT 'string',
    `description` varchar(255) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### تنظیمات پیش‌فرض
```
INSERT INTO `ai_settings` (`setting_key`, `setting_value`, `setting_type`, `description`) VALUES
('openai_api_key', '', 'string', 'کلید API OpenAI'),
('ai_model', 'gpt-4o', 'string', 'مدل پیش‌فرض AI'),
('tts_service', 'openai', 'string', 'سرویس تبدیل متن به صوت'),
('voice_selection', 'female', 'string', 'انتخاب صدای پیش‌فرض'),
('speech_speed', '1.0', 'string', 'سرعت تبدیل متن به صوت'),
('image_generation_service', 'openai', 'string', 'سرویس تولید تصویر');
```

## APIها و سرویس‌ها

### OpenAI API
- **Endpoint**: `https://api.openai.com/v1/`
- **Authentication**: Bearer Token
- **Models**: gpt-4o, gpt-4-turbo, gpt-4, gpt-3.5-turbo, dall-e-3, tts-1, whisper-1
- **Vision API**: GPT-4 Vision برای تحلیل تصویر و OCR

### خدمات صوتی
- **TTS**: OpenAI TTS API با پشتیبانی از صداهای onyx (مرد) و nova (زن)
- **STT**: OpenAI Whisper API برای تبدیل صوت به متن با استفاده از میکروفون

### خدمات تصویری
- **تولید تصویر**: DALL-E 3 API
- **تحلیل تصویر**: GPT-4 Vision API با پشتیبانی از زبان فارسی
- **OCR فارسی**: GPT-4 Vision API برای استخراج متن فارسی از تصاویر

## چک لیست توسعه

### مرحله 1: آماده‌سازی پایگاه داده
- [ ] ایجاد جدول ai_settings
- [ ] درج تنظیمات پیش‌فرض
- [ ] اطمینان از اتصال صحیح به دیتابیس

### مرحله 2: پیاده‌سازی API
- [ ] ایجاد فایل ai-settings.php
- [ ] پیاده‌سازی متدهای getSettings و saveSettings
- [ ] تست APIها با Postman یا curl

### مرحله 3: توسعه فرانت‌اند
- [ ] ایجاد فایل ai-settings.js
- [ ] پیاده‌سازی ساختار تب‌ها
- [ ] اضافه کردن ماژول به router.js
- [ ] اضافه کردن آیتم منو به sidebar.js

### مرحله 4: پیاده‌سازی تب‌ها
- [x] تب تنظیمات مدل
  - [x] فرم API Key
  - [x] انتخاب مدل
  - [x] تنظیمات پیشرفته
  - [x] شبیه‌ساز چت
- [x] تب تنظیمات صوتی
  - [x] تنظیمات TTS
  - [x] تنظیمات STT با استفاده از میکروفون
  - [x] تست صدا
- [x] تب تنظیمات تصویری
  - [x] تنظیمات تولید تصویر
  - [x] تست تولید تصویر
  - [x] تست تحلیل تصویر
  - [x] تست OCR فارسی

### مرحله 5: ادغام با سیستم موجود
- [ ] اضافه کردن کارت AI Settings به settings.js
- [ ] تست ناوبری و عملکرد کامل
- [ ] بررسی سازگاری با تم‌های مختلف

### مرحله 6: تست‌ها
- [ ] تست عملکرد فرم‌ها
- [ ] تست ذخیره/بازیابی تنظیمات
- [ ] تست APIها
- [ ] تست رسپانسیو بودن
- [ ] تست در مرورگرهای مختلف

## تست‌ها

### تست واحد (Unit Tests)
- تست توابع ذخیره/بازیابی تنظیمات
- تست اعتبارسنجی فرم‌ها
- تست تبدیل داده‌ها

### تست ادغام (Integration Tests)
- تست اتصال به پایگاه داده
- تست APIها
- تست ناوبری بین تب‌ها

### تست پذیرش (Acceptance Tests)
- تست کاربردی تمامی ویژگی‌ها
- تست UI/UX
- تست عملکرد در دستگاه‌های مختلف

## مستندات

### مستندات توسعه‌دهنده
- توضیح ساختار کد
- راهنمای API
- نحوه اضافه کردن ویژگی جدید

### مستندات کاربر
- راهنمای استفاده از هر تب
- توضیح تنظیمات پیشرفته
- رفع مشکلات رایج

### مستندات API

### دریافت تنظیمات AI
**متد**: GET  
**آدرس**: `/backend/api/v1/ai-settings.php`  
**توضیح**: دریافت تمام تنظیمات AI از پایگاه داده  
**پارامترها**: بدون پارامتر  
**پاسخ موفق**:
``json
{
  "success": true,
  "data": {
    "openai_api_key": {
      "value": "sk-...",
      "type": "string"
    },
    "ai_model": {
      "value": "gpt-4o",
      "type": "string"
    },
    "temperature": {
      "value": 0.7,
      "type": "float"
    },
    "max_tokens": {
      "value": 1000,
      "type": "integer"
    },
    "tts_service": {
      "value": "openai",
      "type": "string"
    },
    "voice_selection": {
      "value": "female",
      "type": "string"
    },
    "speech_speed": {
      "value": 1.0,
      "type": "float"
    },
    "image_generation_service": {
      "value": "openai",
      "type": "string"
    }
  },
  "message": "تنظیمات AI با موفقیت بارگذاری شد"
}
```

### ذخیره تنظیمات AI
**متد**: POST  
**آدرس**: `/backend/api/v1/ai-settings.php`  
**توضیح**: ذخیره تنظیمات AI در پایگاه داده  
**پارامترها**:
``json
{
  "action": "save",
  "settings": {
    "openai_api_key": "sk-...",
    "ai_model": "gpt-4o",
    "temperature": 0.7,
    "max_tokens": 1000,
    "tts_service": "openai",
    "voice_selection": "female",
    "speech_speed": 1.0,
    "image_generation_service": "openai"
  }
}
```
**پاسخ موفق**:
``json
{
  "success": true,
  "message": "تنظیمات AI با موفقیت ذخیره شد",
  "data": {
    "saved_count": 8
  }
}
```

---

**نسخه**: 1.0.0  
**تاریخ ایجاد**: 1404/06/20  
**وضعیت**: آماده برای توسعه ✅
```

```
# راهنمای توسعه ماژول تنظیمات هوش مصنوعی
## AI Settings Module Development Guide

### 📝 نسخه نهایی
**نسخه**: 1.1.0  
**تاریخ به‌روزرسانی**: 1404/06/20  
**وضعیت**: تکمیل شده و آماده برای استفاده ✅

### 📋 فهرست مطالب
1. [معرفی](#معرفی)
2. [مشخصات فنی](#مشخصات-فنی)
3. [معماری پیشنهادی](#معماری-پیشنهادی)
4. [ساختار فایل‌ها](#ساختار-فایلها)
5. [پیاده‌سازی جزئیات](#پیادهسازی-جزئیات)
6. [رابط کاربری](#رابط-کاربری)
7. [پایگاه داده](#پایگاه-داده)
8. [APIها و سرویس‌ها](#apiها-و-سرویسها)
9. [چک لیست توسعه](#چک-لیست-توسعه)
10. [تست‌ها](#تستها)
11. [مستندات](#مستندات)

## معرفی

این سند راهنمای توسعه ماژول "تنظیمات هوش مصنوعی" برای پنل مدیریت DataSave است. این ماژول شامل سه تب اصلی است:
1. تب تنظیمات مدل (Model Settings)
2. تب تنظیمات صوتی (Audio Settings)
3. تب تنظیمات تصویری (Image Settings)

### ویژگی‌های کلیدی
- **پشتیبانی از مدل‌های جدید OpenAI** شامل GPT-4o، GPT-4 Turbo و GPT-3.5 Turbo
- **قابلیت چت هوش مصنوعی** با مدل‌های مختلف
- **تبدیل متن به صوت (TTS)** با پشتیبانی از OpenAI و Google TTS
- **تبدیل صوت به متن (STT)** با استفاده از میکروفون و OpenAI Whisper API
- **تولید تصویر** با استفاده از DALL-E
- **تحلیل تصویر** با استفاده از GPT-4 Vision API
- **استخراج متن از تصویر (OCR)** با پشتیبانی از زبان فارسی

## مشخصات فنی

### فناوری‌های استفاده شده
- **Frontend**: JavaScript ES6 Modules, HTML5, CSS3
- **Backend**: PHP 8+, MySQL/MariaDB
- **APIها**: OpenAI API, TTS/STT Services, OCR Services
- **معماری**: Modular Architecture (بر اساس ساختار موجود پروژه)

### الزامات سیستم
- پشتیبانی از ES6 Modules در مرورگر
- دسترسی به پایگاه داده MySQL
- اتصال اینترنت برای APIهای خارجی
- پشتیبانی از UTF-8 برای زبان فارسی

## معماری پیشنهادی

### ساختار ماژولار
```
assets/js/admin/modules/
├── ai-settings.js          # ماژول اصلی تنظیمات هوش مصنوعی
assets/js/modules/
├── aiUtils.js              # ابزارهای مرتبط با AI (در صورت نیاز)
backend/api/v1/
├── ai-settings.php         # API مدیریت تنظیمات AI
backend/database/
├── ai-settings-schema.sql  # اسکریپت ساختار جداول AI
```

### ادغام با سیستم موجود
- اضافه شدن route جدید در [router.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/router.js)
- اضافه شدن آیتم منو در [sidebar.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/sidebar.js)
- اضافه شدن کارت در [settings.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/modules/settings.js)

## ساختار فایل‌ها

### فایل اصلی ماژول (ai-settings.js)
```javascript
/**
 * ماژول تنظیمات هوش مصنوعی
 * AI Settings Module
 */
export default {
    /**
     * بارگذاری محتوای تنظیمات هوش مصنوعی
     */
    async loadContent() {
        // پیاده‌سازی محتوای تب‌ها
    },
    
    /**
     * مقداردهی اولیه ماژول
     */
    async init() {
        // پیاده‌سازی رویدادها و تب‌ها
    }
};
```

### API تنظیمات (ai-settings.php)
```php
<?php
/**
 * API تنظیمات هوش مصنوعی
 */
class AISettingsManager {
    // پیاده‌سازی متدهای ذخیره/بازیابی تنظیمات
}
```

## پیاده‌سازی جزئیات

### 1. تب تنظیمات مدل (Model Settings)

#### ویژگی‌ها:
- فیلد API Key برای OpenAI
- انتخاب مدل (GPT-4o, GPT-4 Turbo, GPT-4, GPT-3.5 Turbo)
- تنظیمات پیشرفته مدل (temperature, max_tokens, etc.)
- شبیه‌ساز چت برای تست مدل‌ها

#### المان‌های UI:
``html
<!-- فرم تنظیمات مدل -->
<form id="modelSettingsForm">
    <div class="form-group">
        <label>API Key</label>
        <input type="password" id="openai_api_key" class="form-input">
    </div>
    
    <div class="form-group">
        <label>انتخاب مدل</label>
        <select id="ai_model" class="form-select">
            <option value="gpt-4o">GPT-4o (جدیدترین)</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
        </select>
    </div>
    
    <!-- سایر تنظیمات -->
    
    <!-- شبیه‌ساز چت -->
    <div class="chat-simulator">
        <div class="chat-messages" id="chatMessages"></div>
        <div class="chat-input">
            <input type="text" id="chatInput" placeholder="پیام خود را وارد کنید...">
            <button id="sendChatBtn">ارسال</button>
        </div>
    </div>
</form>
```

### 2. تب تنظیمات صوتی (Audio Settings)

#### ویژگی‌ها:
- تنظیمات TTS (Text-to-Speech) با پشتیبانی از OpenAI و Google TTS
- تنظیمات STT (Speech-to-Text) با استفاده از میکروفون و OpenAI Whisper API
- انتخاب صدا (مرد/زن)
- کنترل سرعت و تنظیمات صوتی
- قابلیت تست صدا با پخش زنده

#### المان‌های UI:
``html
<!-- فرم تنظیمات صوتی -->
<form id="audioSettingsForm">
    <div class="form-group">
        <label>سرویس TTS</label>
        <select id="tts_service" class="form-select">
            <option value="openai">OpenAI TTS</option>
            <option value="google">Google TTS</option>
        </select>
    </div>
    
    <div class="form-group">
        <label>انتخاب صدا</label>
        <select id="voice_selection" class="form-select">
            <option value="male">مرد</option>
            <option value="female">زن</option>
        </select>
    </div>
    
    <div class="form-group">
        <label>سرعت</label>
        <input type="range" id="speech_speed" min="0.5" max="2" step="0.1" value="1">
        <span id="speedValue">1.0x</span>
    </div>
    
    <!-- تست صدا -->
    <div class="audio-test">
        <textarea id="testText" placeholder="متن برای تبدیل به صدا..."></textarea>
        <button id="testTTSBtn">تست TTS</button>
        <button id="testSTTBtn">تست STT</button>
        <audio id="audioPlayer" controls></audio>
    </div>
</form>
```

### نحوه استفاده از قابلیت\u200cهای صوتی

#### تبدیل متن به صوت (TTS)
1. **انتخاب سرویس TTS**: در حال حاضر OpenAI TTS پشتیبانی می\u200cشود. گزینه Google TTS برای توسعه آینده اضافه شده است.
2. **انتخاب صدا**: می\u200cتوانید بین صدای مرد (onyx) و صدای زن (nova) انتخاب کنید.
3. **تنظیم سرعت**: با استفاده از اسلایدر می\u200cتوانید سرعت تبدیل صوت را بین 0.5x تا 2.0x تنظیم کنید.
4. **تست TTS**: 
   - متن مورد نظر خود را در textarea وارد کنید
   - روی دکمه "تست TTS" کلیک کنید
   - صوت تولید شده به صورت خودکار پخش می\u200cشود

#### تبدیل صوت به متن (STT)
1. **دسترسی به میکروفون**: برای استفاده از این قابلیت نیاز به دسترسی به میکروفون دارید.
2. **ضبط صدا**: 
   - روی دکمه "تست STT" کلیک کنید
   - مجوز دسترسی به میکروفون را تأیید کنید
   - صحبت کنید (ضبط به صورت خودکار شروع می\u200cشود)
   - برای توقف ضبط، دوباره روی دکمه کلیک کنید یا 10 ثانیه صبر کنید
3. **دریافت متن**: متن استخراج شده به صورت خودکار در textarea قرار می\u200cگیرد.

### 3. تب تنظیمات تصویری (Image Settings)

#### ویژگی‌ها:
- تنظیمات تولید تصویر با استفاده از DALL-E 3
- تحلیل تصویر با استفاده از GPT-4 Vision API
- استخراج متن از تصویر (OCR) با پشتیبانی از زبان فارسی
- قابلیت تست هر سه عملکرد

#### المان‌های UI:
``html
<!-- فرم تنظیمات تصویری -->
<form id="imageSettingsForm">
    <div class="form-group">
        <label>سرویس تولید تصویر</label>
        <select id="image_generation_service" class="form-select">
            <option value="openai">OpenAI DALL-E</option>
            <option value="stability">Stability AI</option>
        </select>
    </div>
    
    <!-- تست تولید تصویر -->
    <div class="image-test">
        <textarea id="imagePrompt" placeholder="توضیح تصویر مورد نظر..."></textarea>
        <button id="generateImageBtn">تولید تصویر</button>
        <div id="generatedImageContainer"></div>
    </div>
    
    <!-- تست تحلیل تصویر -->
    <div class="image-analysis">
        <input type="file" id="imageToAnalyze" accept="image/*">
        <button id="analyzeImageBtn">تحلیل تصویر</button>
        <div id="imageAnalysisResult"></div>
    </div>
    
    <!-- تست OCR فارسی -->
    <div class="ocr-test">
        <input type="file" id="imageForOCR" accept="image/*">
        <button id="ocrBtn">استخراج متن (OCR)</button>
        <div id="ocrResult"></div>
    </div>
</form>
```

### نحوه استفاده از قابلیت\u200cهای تصویری

#### تولید تصویر با DALL-E
1. **انتخاب سرویس**: در حال حاضر OpenAI DALL-E 3 پشتیبانی می\u200cشود.
2. **تولید تصویر**:
   - توضیح تصویر مورد نظر خود را به زبان انگلیسی در textarea وارد کنید
   - روی دکمه "تولید تصویر" کلیک کنید
   - تصویر تولید شده به صورت خودکار نمایش داده می\u200cشود

#### تحلیل تصویر با GPT-4 Vision
1. **انتخاب تصویر**: 
   - روی دکمه "انتخاب فایل" در بخش "تحلیل تصویر" کلیک کنید
   - یک تصویر از کامپیوتر خود انتخاب کنید
2. **تحلیل تصویر**:
   - روی دکمه "تحلیل تصویر" کلیک کنید
   - نتیجه تحلیل به زبان فارسی نمایش داده می\u200cشود
   - تحلیل شامل شناسایی اشیاء، صحنه و محتوای تصویر است

#### استخراج متن از تصویر (OCR)
1. **انتخاب تصویر**:
   - روی دکمه "انتخاب فایل" در بخش "استخراج متن (OCR)" کلیک کنید
   - یک تصویر حاوی متن از کامپیوتر خود انتخاب کنید
2. **استخراج متن**:
   - روی دکمه "استخراج متن (OCR)" کلیک کنید
   - متن استخراج شده به زبان فارسی نمایش داده می\u200cشود
   - این قابلیت با استفاده از GPT-4 Vision API پیاده\u200cسازی شده است

## رابط کاربری

### طراحی رسپانسیو
- استفاده از Grid/Flexbox برای طراحی انعطاف‌پذیر
- اندازه فونت نسبی (rem/em)
- media queries برای سه breakpoints اصلی:
  - موبایل: تا 768px
  - تبلت: 769px تا 1024px
  - دسکتاپ: بالای 1024px

### استایل‌ها
- استفاده از متغیرهای CSS موجود در پروژه
- رعایت تم روشن/تاریک
- انیمیشن‌های ملایم برای تغییرات UI
- افکت‌های glassmorphism بر اساس استاندارد پروژه

## پایگاه داده

### جدول تنظیمات AI
```
CREATE TABLE IF NOT EXISTS `ai_settings` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `setting_key` varchar(100) NOT NULL,
    `setting_value` text DEFAULT NULL,
    `setting_type` enum('string', 'integer', 'boolean', 'json') NOT NULL DEFAULT 'string',
    `description` varchar(255) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### تنظیمات پیش‌فرض
```
INSERT INTO `ai_settings` (`setting_key`, `setting_value`, `setting_type`, `description`) VALUES
('openai_api_key', '', 'string', 'کلید API OpenAI'),
('ai_model', 'gpt-4o', 'string', 'مدل پیش‌فرض AI'),
('tts_service', 'openai', 'string', 'سرویس تبدیل متن به صوت'),
('voice_selection', 'female', 'string', 'انتخاب صدای پیش‌فرض'),
('speech_speed', '1.0', 'string', 'سرعت تبدیل متن به صوت'),
('image_generation_service', 'openai', 'string', 'سرویس تولید تصویر');
```

## APIها و سرویس‌ها

### OpenAI API
- **Endpoint**: `https://api.openai.com/v1/`
- **Authentication**: Bearer Token
- **Models**: gpt-4o, gpt-4-turbo, gpt-4, gpt-3.5-turbo, dall-e-3, tts-1, whisper-1
- **Vision API**: GPT-4 Vision برای تحلیل تصویر و OCR

### خدمات صوتی
- **TTS**: OpenAI TTS API با پشتیبانی از صداهای onyx (مرد) و nova (زن)
- **STT**: OpenAI Whisper API برای تبدیل صوت به متن با استفاده از میکروفون

### خدمات تصویری
- **تولید تصویر**: DALL-E 3 API
- **تحلیل تصویر**: GPT-4 Vision API با پشتیبانی از زبان فارسی
- **OCR فارسی**: GPT-4 Vision API برای استخراج متن فارسی از تصاویر

## چک لیست توسعه

### مرحله 1: آماده‌سازی پایگاه داده
- [ ] ایجاد جدول ai_settings
- [ ] درج تنظیمات پیش‌فرض
- [ ] اطمینان از اتصال صحیح به دیتابیس

### مرحله 2: پیاده‌سازی API
- [ ] ایجاد فایل ai-settings.php
- [ ] پیاده‌سازی متدهای getSettings و saveSettings
- [ ] تست APIها با Postman یا curl

### مرحله 3: توسعه فرانت‌اند
- [ ] ایجاد فایل ai-settings.js
- [ ] پیاده‌سازی ساختار تب‌ها
- [ ] اضافه کردن ماژول به router.js
- [ ] اضافه کردن آیتم منو به sidebar.js

### مرحله 4: پیاده‌سازی تب‌ها
- [x] تب تنظیمات مدل
  - [x] فرم API Key
  - [x] انتخاب مدل
  - [x] تنظیمات پیشرفته
  - [x] شبیه‌ساز چت
- [x] تب تنظیمات صوتی
  - [x] تنظیمات TTS
  - [x] تنظیمات STT با استفاده از میکروفون
  - [x] تست صدا
- [x] تب تنظیمات تصویری
  - [x] تنظیمات تولید تصویر
  - [x] تست تولید تصویر
  - [x] تست تحلیل تصویر
  - [x] تست OCR فارسی

### مرحله 5: ادغام با سیستم موجود
- [ ] اضافه کردن کارت AI Settings به settings.js
- [ ] تست ناوبری و عملکرد کامل
- [ ] بررسی سازگاری با تم‌های مختلف

### مرحله 6: تست‌ها
- [ ] تست عملکرد فرم‌ها
- [ ] تست ذخیره/بازیابی تنظیمات
- [ ] تست APIها
- [ ] تست رسپانسیو بودن
- [ ] تست در مرورگرهای مختلف

## تست‌ها

### تست واحد (Unit Tests)
- تست توابع ذخیره/بازیابی تنظیمات
- تست اعتبارسنجی فرم‌ها
- تست تبدیل داده‌ها

### تست ادغام (Integration Tests)
- تست اتصال به پایگاه داده
- تست APIها
- تست ناوبری بین تب‌ها

### تست پذیرش (Acceptance Tests)
- تست کاربردی تمامی ویژگی‌ها
- تست UI/UX
- تست عملکرد در دستگاه‌های مختلف

## مستندات

### مستندات توسعه‌دهنده
- توضیح ساختار کد
- راهنمای API
- نحوه اضافه کردن ویژگی جدید

### مستندات کاربر
- راهنمای استفاده از هر تب
- توضیح تنظیمات پیشرفته
- رفع مشکلات رایج

### مستندات API

### دریافت تنظیمات AI
**متد**: GET  
**آدرس**: `/backend/api/v1/ai-settings.php`  
**توضیح**: دریافت تمام تنظیمات AI از پایگاه داده  
**پارامترها**: بدون پارامتر  
**پاسخ موفق**:
``json
{
  "success": true,
  "data": {
    "openai_api_key": {
      "value": "sk-...",
      "type": "string"
    },
    "ai_model": {
      "value": "gpt-4o",
      "type": "string"
    },
    "temperature": {
      "value": 0.7,
      "type": "float"
    },
    "max_tokens": {
      "value": 1000,
      "type": "integer"
    },
    "tts_service": {
      "value": "openai",
      "type": "string"
    },
    "voice_selection": {
      "value": "female",
      "type": "string"
    },
    "speech_speed": {
      "value": 1.0,
      "type": "float"
    },
    "image_generation_service": {
      "value": "openai",
      "type": "string"
    }
  },
  "message": "تنظیمات AI با موفقیت بارگذاری شد"
}
```

### ذخیره تنظیمات AI
**متد**: POST  
**آدرس**: `/backend/api/v1/ai-settings.php`  
**توضیح**: ذخیره تنظیمات AI در پایگاه داده  
**پارامترها**:
``json
{
  "action": "save",
  "settings": {
    "openai_api_key": "sk-...",
    "ai_model": "gpt-4o",
    "temperature": 0.7,
    "max_tokens": 1000,
    "tts_service": "openai",
    "voice_selection": "female",
    "speech_speed": 1.0,
    "image_generation_service": "openai"
  }
}
```
**پاسخ موفق**:
``json
{
  "success": true,
  "message": "تنظیمات AI با موفقیت ذخیره شد",
  "data": {
    "saved_count": 8
  }
}
```

---

**نسخه**: 1.0.0  
**تاریخ ایجاد**: 1404/06/20  
**وضعیت**: آماده برای توسعه ✅
```

```
# راهنمای توسعه ماژول تنظیمات هوش مصنوعی
## AI Settings Module Development Guide

### 📝 نسخه نهایی
**نسخه**: 1.1.0  
**تاریخ به‌روزرسانی**: 1404/06/20  
**وضعیت**: تکمیل شده و آماده برای استفاده ✅

### 📋 فهرست مطالب
1. [معرفی](#معرفی)
2. [مشخصات فنی](#مشخصات-فنی)
3. [معماری پیشنهادی](#معماری-پیشنهادی)
4. [ساختار فایل‌ها](#ساختار-فایلها)
5. [پیاده‌سازی جزئیات](#پیادهسازی-جزئیات)
6. [رابط کاربری](#رابط-کاربری)
7. [پایگاه داده](#پایگاه-داده)
8. [APIها و سرویس‌ها](#apiها-و-سرویسها)
9. [چک لیست توسعه](#چک-لیست-توسعه)
10. [تست‌ها](#تستها)
11. [مستندات](#مستندات)

## معرفی

این سند راهنمای توسعه ماژول "تنظیمات هوش مصنوعی" برای پنل مدیریت DataSave است. این ماژول شامل سه تب اصلی است:
1. تب تنظیمات مدل (Model Settings)
2. تب تنظیمات صوتی (Audio Settings)
3. تب تنظیمات تصویری (Image Settings)

### ویژگی‌های کلیدی
- **پشتیبانی از مدل‌های جدید OpenAI** شامل GPT-4o، GPT-4 Turbo و GPT-3.5 Turbo
- **قابلیت چت هوش مصنوعی** با مدل‌های مختلف
- **تبدیل متن به صوت (TTS)** با پشتیبانی از OpenAI و Google TTS
- **تبدیل صوت به متن (STT)** با استفاده از میکروفون و OpenAI Whisper API
- **تولید تصویر** با استفاده از DALL-E
- **تحلیل تصویر** با استفاده از GPT-4 Vision API
- **استخراج متن از تصویر (OCR)** با پشتیبانی از زبان فارسی

## مشخصات فنی

### فناوری‌های استفاده شده
- **Frontend**: JavaScript ES6 Modules, HTML5, CSS3
- **Backend**: PHP 8+, MySQL/MariaDB
- **APIها**: OpenAI API, TTS/STT Services, OCR Services
- **معماری**: Modular Architecture (بر اساس ساختار موجود پروژه)

### الزامات سیستم
- پشتیبانی از ES6 Modules در مرورگر
- دسترسی به پایگاه داده MySQL
- اتصال اینترنت برای APIهای خارجی
- پشتیبانی از UTF-8 برای زبان فارسی

## معماری پیشنهادی

### ساختار ماژولار
```
assets/js/admin/modules/
├── ai-settings.js          # ماژول اصلی تنظیمات هوش مصنوعی
assets/js/modules/
├── aiUtils.js              # ابزارهای مرتبط با AI (در صورت نیاز)
backend/api/v1/
├── ai-settings.php         # API مدیریت تنظیمات AI
backend/database/
├── ai-settings-schema.sql  # اسکریپت ساختار جداول AI
```

### ادغام با سیستم موجود
- اضافه شدن route جدید در [router.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/router.js)
- اضافه شدن آیتم منو در [sidebar.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/sidebar.js)
- اضافه شدن کارت در [settings.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/modules/settings.js)

## ساختار فایل‌ها

### فایل اصلی ماژول (ai-settings.js)
```javascript
/**
 * ماژول تنظیمات هوش مصنوعی
 * AI Settings Module
 */
export default {
    /**
     * بارگذاری محتوای تنظیمات هوش مصنوعی
     */
    async loadContent() {
        // پیاده‌سازی محتوای تب‌ها
    },
    
    /**
     * مقداردهی اولیه ماژول
     */
    async init() {
        // پیاده‌سازی رویدادها و تب‌ها
    }
};
```

### API تنظیمات (ai-settings.php)
```php
<?php
/**
 * API تنظیمات هوش مصنوعی
 */
class AISettingsManager {
    // پیاده‌سازی متدهای ذخیره/بازیابی تنظیمات
}
```

## پیاده‌سازی جزئیات

### 1. تب تنظیمات مدل (Model Settings)

#### ویژگی‌ها:
- فیلد API Key برای OpenAI
- انتخاب مدل (GPT-4o, GPT-4 Turbo, GPT-4, GPT-3.5 Turbo)
- تنظیمات پیشرفته مدل (temperature, max_tokens, etc.)
- شبیه‌ساز چت برای تست مدل‌ها

#### المان‌های UI:
``html
<!-- فرم تنظیمات مدل -->
<form id="modelSettingsForm">
    <div class="form-group">
        <label>API Key</label>
        <input type="password" id="openai_api_key" class="form-input">
    </div>
    
    <div class="form-group">
        <label>انتخاب مدل</label>
        <select id="ai_model" class="form-select">
            <option value="gpt-4o">GPT-4o (جدیدترین)</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
        </select>
    </div>
    
    <!-- سایر تنظیمات -->
    
    <!-- شبیه‌ساز چت -->
    <div class="chat-simulator">
        <div class="chat-messages" id="chatMessages"></div>
        <div class="chat-input">
            <input type="text" id="chatInput" placeholder="پیام خود را وارد کنید...">
            <button id="sendChatBtn">ارسال</button>
        </div>
    </div>
</form>
```

### 2. تب تنظیمات صوتی (Audio Settings)

#### ویژگی‌ها:
- تنظیمات TTS (Text-to-Speech) با پشتیبانی از OpenAI و Google TTS
- تنظیمات STT (Speech-to-Text) با استفاده از میکروفون و OpenAI Whisper API
- انتخاب صدا (مرد/زن)
- کنترل سرعت و تنظیمات صوتی
- قابلیت تست صدا با پخش زنده

#### المان‌های UI:
``html
<!-- فرم تنظیمات صوتی -->
<form id="audioSettingsForm">
    <div class="form-group">
        <label>سرویس TTS</label>
        <select id="tts_service" class="form-select">
            <option value="openai">OpenAI TTS</option>
            <option value="google">Google TTS</option>
        </select>
    </div>
    
    <div class="form-group">
        <label>انتخاب صدا</label>
        <select id="voice_selection" class="form-select">
            <option value="male">مرد</option>
            <option value="female">زن</option>
        </select>
    </div>
    
    <div class="form-group">
        <label>سرعت</label>
        <input type="range" id="speech_speed" min="0.5" max="2" step="0.1" value="1">
        <span id="speedValue">1.0x</span>
    </div>
    
    <!-- تست صدا -->
    <div class="audio-test">
        <textarea id="testText" placeholder="متن برای تبدیل به صدا..."></textarea>
        <button id="testTTSBtn">تست TTS</button>
        <button id="testSTTBtn">تست STT</button>
        <audio id="audioPlayer" controls></audio>
    </div>
</form>
```

### نحوه استفاده از قابلیت\u200cهای صوتی

#### تبدیل متن به صوت (TTS)
1. **انتخاب سرویس TTS**: در حال حاضر OpenAI TTS پشتیبانی می\u200cشود. گزینه Google TTS برای توسعه آینده اضافه شده است.
2. **انتخاب صدا**: می\u200cتوانید بین صدای مرد (onyx) و صدای زن (nova) انتخاب کنید.
3. **تنظیم سرعت**: با استفاده از اسلایدر می\u200cتوانید سرعت تبدیل صوت را بین 0.5x تا 2.0x تنظیم کنید.
4. **تست TTS**: 
   - متن مورد نظر خود را در textarea وارد کنید
   - روی دکمه "تست TTS" کلیک کنید
   - صوت تولید شده به صورت خودکار پخش می\u200cشود

#### تبدیل صوت به متن (STT)
1. **دسترسی به میکروفون**: برای استفاده از این قابلیت نیاز به دسترسی به میکروفون دارید.
2. **ضبط صدا**: 
   - روی دکمه "تست STT" کلیک کنید
   - مجوز دسترسی به میکروفون را تأیید کنید
   - صحبت کنید (ضبط به صورت خودکار شروع می\u200cشود)
   - برای توقف ضبط، دوباره روی دکمه کلیک کنید یا 10 ثانیه صبر کنید
3. **دریافت متن**: متن استخراج شده به صورت خودکار در textarea قرار می\u200cگیرد.

### 3. تب تنظیمات تصویری (Image Settings)

#### ویژگی‌ها:
- تنظیمات تولید تصویر با استفاده از DALL-E 3
- تحلیل تصویر با استفاده از GPT-4 Vision API
- استخراج متن از تصویر (OCR) با پشتیبانی از زبان فارسی
- قابلیت تست هر سه عملکرد

#### المان‌های UI:
``html
<!-- فرم تنظیمات تصویری -->
<form id="imageSettingsForm">
    <div class="form-group">
        <label>سرویس تولید تصویر</label>
        <select id="image_generation_service" class="form-select">
            <option value="openai">OpenAI DALL-E</option>
            <option value="stability">Stability AI</option>
        </select>
    </div>
    
    <!-- تست تولید تصویر -->
    <div class="image-test">
        <textarea id="imagePrompt" placeholder="توضیح تصویر مورد نظر..."></textarea>
        <button id="generateImageBtn">تولید تصویر</button>
        <div id="generatedImageContainer"></div>
    </div>
    
    <!-- تست تحلیل تصویر -->
    <div class="image-analysis">
        <input type="file" id="imageToAnalyze" accept="image/*">
        <button id="analyzeImageBtn">تحلیل تصویر</button>
        <div id="imageAnalysisResult"></div>
    </div>
    
    <!-- تست OCR فارسی -->
    <div class="ocr-test">
        <input type="file" id="imageForOCR" accept="image/*">
        <button id="ocrBtn">استخراج متن (OCR)</button>
        <div id="ocrResult"></div>
    </div>
</form>
```

### نحوه استفاده از قابلیت\u200cهای تصویری

#### تولید تصویر با DALL-E
1. **انتخاب سرویس**: در حال حاضر OpenAI DALL-E 3 پشتیبانی می\u200cشود.
2. **تولید تصویر**:
   - توضیح تصویر مورد نظر خود را به زبان انگلیسی در textarea وارد کنید
   - روی دکمه "تولید تصویر" کلیک کنید
   - تصویر تولید شده به صورت خودکار نمایش داده می\u200cشود

#### تحلیل تصویر با GPT-4 Vision
1. **انتخاب تصویر**: 
   - روی دکمه "انتخاب فایل" در بخش "تحلیل تصویر" کلیک کنید
   - یک تصویر از کامپیوتر خود انتخاب کنید
2. **تحلیل تصویر**:
   - روی دکمه "تحلیل تصویر" کلیک کنید
   - نتیجه تحلیل به زبان فارسی نمایش داده می\u200cشود
   - تحلیل شامل شناسایی اشیاء، صحنه و محتوای تصویر است

#### استخراج متن از تصویر (OCR)
1. **انتخاب تصویر**:
   - روی دکمه "انتخاب فایل" در بخش "استخراج متن (OCR)" کلیک کنید
   - یک تصویر حاوی متن از کامپیوتر خود انتخاب کنید
2. **استخراج متن**:
   - روی دکمه "استخراج متن (OCR)" کلیک کنید
   - متن استخراج شده به زبان فارسی نمایش داده می\u200cشود
   - این قابلیت با استفاده از GPT-4 Vision API پیاده\u200cسازی شده است

## رابط کاربری

### طراحی رسپانسیو
- استفاده از Grid/Flexbox برای طراحی انعطاف‌پذیر
- اندازه فونت نسبی (rem/em)
- media queries برای سه breakpoints اصلی:
  - موبایل: تا 768px
  - تبلت: 769px تا 1024px
  - دسکتاپ: بالای 1024px

### استایل‌ها
- استفاده از متغیرهای CSS موجود در پروژه
- رعایت تم روشن/تاریک
- انیمیشن‌های ملایم برای تغییرات UI
- افکت‌های glassmorphism بر اساس استاندارد پروژه

## پایگاه داده

### جدول تنظیمات AI
```
CREATE TABLE IF NOT EXISTS `ai_settings` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `setting_key` varchar(100) NOT NULL,
    `setting_value` text DEFAULT NULL,
    `setting_type` enum('string', 'integer', 'boolean', 'json') NOT NULL DEFAULT 'string',
    `description` varchar(255) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### تنظیمات پیش‌فرض
```
INSERT INTO `ai_settings` (`setting_key`, `setting_value`, `setting_type`, `description`) VALUES
('openai_api_key', '', 'string', 'کلید API OpenAI'),
('ai_model', 'gpt-4o', 'string', 'مدل پیش‌فرض AI'),
('tts_service', 'openai', 'string', 'سرویس تبدیل متن به صوت'),
('voice_selection', 'female', 'string', 'انتخاب صدای پیش‌فرض'),
('speech_speed', '1.0', 'string', 'سرعت تبدیل متن به صوت'),
('image_generation_service', 'openai', 'string', 'سرویس تولید تصویر');
```

## APIها و سرویس‌ها

### OpenAI API
- **Endpoint**: `https://api.openai.com/v1/`
- **Authentication**: Bearer Token
- **Models**: gpt-4o, gpt-4-turbo, gpt-4, gpt-3.5-turbo, dall-e-3, tts-1, whisper-1
- **Vision API**: GPT-4 Vision برای تحلیل تصویر و OCR

### خدمات صوتی
- **TTS**: OpenAI TTS API با پشتیبانی از صداهای onyx (مرد) و nova (زن)
- **STT**: OpenAI Whisper API برای تبدیل صوت به متن با استفاده از میکروفون

### خدمات تصویری
- **تولید تصویر**: DALL-E 3 API
- **تحلیل تصویر**: GPT-4 Vision API با پشتیبانی از زبان فارسی
- **OCR فارسی**: GPT-4 Vision API برای استخراج متن فارسی از تصاویر

## چک لیست توسعه

### مرحله 1: آماده‌سازی پایگاه داده
- [ ] ایجاد جدول ai_settings
- [ ] درج تنظیمات پیش‌فرض
- [ ] اطمینان از اتصال صحیح به دیتابیس

### مرحله 2: پیاده‌سازی API
- [ ] ایجاد فایل ai-settings.php
- [ ] پیاده‌سازی متدهای getSettings و saveSettings
- [ ] تست APIها با Postman یا curl

### مرحله 3: توسعه فرانت‌اند
- [ ] ایجاد فایل ai-settings.js
- [ ] پیاده‌سازی ساختار تب‌ها
- [ ] اضافه کردن ماژول به router.js
- [ ] اضافه کردن آیتم منو به sidebar.js

### مرحله 4: پیاده‌سازی تب‌ها
- [x] تب تنظیمات مدل
  - [x] فرم API Key
  - [x] انتخاب مدل
  - [x] تنظیمات پیشرفته
  - [x] شبیه‌ساز چت
- [x] تب تنظیمات صوتی
  - [x] تنظیمات TTS
  - [x] تنظیمات STT با استفاده از میکروفون
  - [x] تست صدا
- [x] تب تنظیمات تصویری
  - [x] تنظیمات تولید تصویر
  - [x] تست تولید تصویر
  - [x] تست تحلیل تصویر
  - [x] تست OCR فارسی

### مرحله 5: ادغام با سیستم موجود
- [ ] اضافه کردن کارت AI Settings به settings.js
- [ ] تست ناوبری و عملکرد کامل
- [ ] بررسی سازگاری با تم‌های مختلف

### مرحله 6: تست‌ها
- [ ] تست عملکرد فرم‌ها
- [ ] تست ذخیره/بازیابی تنظیمات
- [ ] تست APIها
- [ ] تست رسپانسیو بودن
- [ ] تست در مرورگرهای مختلف

## تست‌ها

### تست واحد (Unit Tests)
- تست توابع ذخیره/بازیابی تنظیمات
- تست اعتبارسنجی فرم‌ها
- تست تبدیل داده‌ها

### تست ادغام (Integration Tests)
- تست اتصال به پایگاه داده
- تست APIها
- تست ناوبری بین تب‌ها

### تست پذیرش (Acceptance Tests)
- تست کاربردی تمامی ویژگی‌ها
- تست UI/UX
- تست عملکرد در دستگاه‌های مختلف

## مستندات

### مستندات توسعه‌دهنده
- توضیح ساختار کد
- راهنمای API
- نحوه اضافه کردن ویژگی جدید

### مستندات کاربر
- راهنمای استفاده از هر تب
- توضیح تنظیمات پیشرفته
- رفع مشکلات رایج

### مستندات API

### دریافت تنظیمات AI
**متد**: GET  
**آدرس**: `/backend/api/v1/ai-settings.php`  
**توضیح**: دریافت تمام تنظیمات AI از پایگاه داده  
**پارامترها**: بدون پارامتر  
**پاسخ موفق**:
``json
{
  "success": true,
  "data": {
    "openai_api_key": {
      "value": "sk-...",
      "type": "string"
    },
    "ai_model": {
      "value": "gpt-4o",
      "type": "string"
    },
    "temperature": {
      "value": 0.7,
      "type": "float"
    },
    "max_tokens": {
      "value": 1000,
      "type": "integer"
    },
    "tts_service": {
      "value": "openai",
      "type": "string"
    },
    "voice_selection": {
      "value": "female",
      "type": "string"
    },
    "speech_speed": {
      "value": 1.0,
      "type": "float"
    },
    "image_generation_service": {
      "value": "openai",
      "type": "string"
    }
  },
  "message": "تنظیمات AI با موفقیت بارگذاری شد"
}
```

### ذخیره تنظیمات AI
**متد**: POST  
**آدرس**: `/backend/api/v1/ai-settings.php`  
**توضیح**: ذخیره تنظیمات AI در پایگاه داده  
**پارامترها**:
``json
{
  "action": "save",
  "settings": {
    "openai_api_key": "sk-...",
    "ai_model": "gpt-4o",
    "temperature": 0.7,
    "max_tokens": 1000,
    "tts_service": "openai",
    "voice_selection": "female",
    "speech_speed": 1.0,
    "image_generation_service": "openai"
  }
}
```
**پاسخ موفق**:
``json
{
  "success": true,
  "message": "تنظیمات AI با موفقیت ذخیره شد",
  "data": {
    "saved_count": 8
  }
}
```

---

**نسخه**: 1.0.0  
**تاریخ ایجاد**: 1404/06/20  
**وضعیت**: آماده برای توسعه ✅
```

```
# راهنمای توسعه ماژول تنظیمات هوش مصنوعی
## AI Settings Module Development Guide

### 📝 نسخه نهایی
**نسخه**: 1.1.0  
**تاریخ به‌روزرسانی**: 1404/06/20  
**وضعیت**: تکمیل شده و آماده برای استفاده ✅

### 📋 فهرست مطالب
1. [معرفی](#معرفی)
2. [مشخصات فنی](#مشخصات-فنی)
3. [معماری پیشنهادی](#معماری-پیشنهادی)
4. [ساختار فایل‌ها](#ساختار-فایلها)
5. [پیاده‌سازی جزئیات](#پیادهسازی-جزئیات)
6. [رابط کاربری](#رابط-کاربری)
7. [پایگاه داده](#پایگاه-داده)
8. [APIها و سرویس‌ها](#apiها-و-سرویسها)
9. [چک لیست توسعه](#چک-لیست-توسعه)
10. [تست‌ها](#تستها)
11. [مستندات](#مستندات)

## معرفی

این سند راهنمای توسعه ماژول "تنظیمات هوش مصنوعی" برای پنل مدیریت DataSave است. این ماژول شامل سه تب اصلی است:
1. تب تنظیمات مدل (Model Settings)
2. تب تنظیمات صوتی (Audio Settings)
3. تب تنظیمات تصویری (Image Settings)

### ویژگی‌های کلیدی
- **پشتیبانی از مدل‌های جدید OpenAI** شامل GPT-4o، GPT-4 Turbo و GPT-3.5 Turbo
- **قابلیت چت هوش مصنوعی** با مدل‌های مختلف
- **تبدیل متن به صوت (TTS)** با پشتیبانی از OpenAI و Google TTS
- **تبدیل صوت به متن (STT)** با استفاده از میکروفون و OpenAI Whisper API
- **تولید تصویر** با استفاده از DALL-E
- **تحلیل تصویر** با استفاده از GPT-4 Vision API
- **استخراج متن از تصویر (OCR)** با پشتیبانی از زبان فارسی

## مشخصات فنی

### فناوری‌های استفاده شده
- **Frontend**: JavaScript ES6 Modules, HTML5, CSS3
- **Backend**: PHP 8+, MySQL/MariaDB
- **APIها**: OpenAI API, TTS/STT Services, OCR Services
- **معماری**: Modular Architecture (بر اساس ساختار موجود پروژه)

### الزامات سیستم
- پشتیبانی از ES6 Modules در مرورگر
- دسترسی به پایگاه داده MySQL
- اتصال اینترنت برای APIهای خارجی
- پشتیبانی از UTF-8 برای زبان فارسی

## معماری پیشنهادی

### ساختار ماژولار
```
assets/js/admin/modules/
├── ai-settings.js          # ماژول اصلی تنظیمات هوش مصنوعی
assets/js/modules/
├── aiUtils.js              # ابزارهای مرتبط با AI (در صورت نیاز)
backend/api/v1/
├── ai-settings.php         # API مدیریت تنظیمات AI
backend/database/
├── ai-settings-schema.sql  # اسکریپت ساختار جداول AI
```

### ادغام با سیستم موجود
- اضافه شدن route جدید در [router.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/router.js)
- اضافه شدن آیتم منو در [sidebar.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/sidebar.js)
- اضافه شدن کارت در [settings.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/modules/settings.js)

## ساختار فایل‌ها

### فایل اصلی ماژول (ai-settings.js)
```javascript
/**
 * ماژول تنظیمات هوش مصنوعی
 * AI Settings Module
 */
export default {
    /**
     * بارگذاری محتوای تنظیمات هوش مصنوعی
     */
    async loadContent() {
        // پیاده‌سازی محتوای تب‌ها
    },
    
    /**
     * مقداردهی اولیه ماژول
     */
    async init() {
        // پیاده‌سازی رویدادها و تب‌ها
    }
};
```

### API تنظیمات (ai-settings.php)
```php
<?php
/**
 * API تنظیمات هوش مصنوعی
 */
class AISettingsManager {
    // پیاده‌سازی متدهای ذخیره/بازیابی تنظیمات
}
```

## پیاده‌سازی جزئیات

### 1. تب تنظیمات مدل (Model Settings)

#### ویژگی‌ها:
- فیلد API Key برای OpenAI
- انتخاب مدل (GPT-4o, GPT-4 Turbo, GPT-4, GPT-3.5 Turbo)
- تنظیمات پیشرفته مدل (temperature, max_tokens, etc.)
- شبیه‌ساز چت برای تست مدل‌ها

#### المان‌های UI:
``html
<!-- فرم تنظیمات مدل -->
<form id="modelSettingsForm">
    <div class="form-group">
        <label>API Key</label>
        <input type="password" id="openai_api_key" class="form-input">
    </div>
    
    <div class="form-group">
        <label>انتخاب مدل</label>
        <select id="ai_model" class="form-select">
            <option value="gpt-4o">GPT-4o (جدیدترین)</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
        </select>
    </div>
    
    <!-- سایر تنظیمات -->
    
    <!-- شبیه‌ساز چت -->
    <div class="chat-simulator">
        <div class="chat-messages" id="chatMessages"></div>
        <div class="chat-input">
            <input type="text" id="chatInput" placeholder="پیام خود را وارد کنید...">
            <button id="sendChatBtn">ارسال</button>
        </div>
    </div>
</form>
```

### 2. تب تنظیمات صوتی (Audio Settings)

#### ویژگی‌ها:
- تنظیمات TTS (Text-to-Speech) با پشتیبانی از OpenAI و Google TTS
- تنظیمات STT (Speech-to-Text) با استفاده از میکروفون و OpenAI Whisper API
- انتخاب صدا (مرد/زن)
- کنترل سرعت و تنظیمات صوتی
- قابلیت تست صدا با پخش زنده

#### المان‌های UI:
``html
<!-- فرم تنظیمات صوتی -->
<form id="audioSettingsForm">
    <div class="form-group">
        <label>سرویس TTS</label>
        <select id="tts_service" class="form-select">
            <option value="openai">OpenAI TTS</option>
            <option value="google">Google TTS</option>
        </select>
    </div>
    
    <div class="form-group">
        <label>انتخاب صدا</label>
        <select id="voice_selection" class="form-select">
            <option value="male">مرد</option>
            <option value="female">زن</option>
        </select>
    </div>
    
    <div class="form-group">
        <label>سرعت</label>
        <input type="range" id="speech_speed" min="0.5" max="2" step="0.1" value="1">
        <span id="speedValue">1.0x</span>
    </div>
    
    <!-- تست صدا -->
    <div class="audio-test">
        <textarea id="testText" placeholder="متن برای تبدیل به صدا..."></textarea>
        <button id="testTTSBtn">تست TTS</button>
        <button id="testSTTBtn">تست STT</button>
        <audio id="audioPlayer" controls></audio>
    </div>
</form>
```

### نحوه استفاده از قابلیت\u200cهای صوتی

#### تبدیل متن به صوت (TTS)
1. **انتخاب سرویس TTS**: در حال حاضر OpenAI TTS پشتیبانی می\u200cشود. گزینه Google TTS برای توسعه آینده اضافه شده است.
2. **انتخاب صدا**: می\u200cتوانید بین صدای مرد (onyx) و صدای زن (nova) انتخاب کنید.
3. **تنظیم سرعت**: با استفاده از اسلایدر می\u200cتوانید سرعت تبدیل صوت را بین 0.5x تا 2.0x تنظیم کنید.
4. **تست TTS**: 
   - متن مورد نظر خود را در textarea وارد کنید
   - روی دکمه "تست TTS" کلیک کنید
   - صوت تولید شده به صورت خودکار پخش می\u200cشود

#### تبدیل صوت به متن (STT)
1. **دسترسی به میکروفون**: برای استفاده از این قابلیت نیاز به دسترسی به میکروفون دارید.
2. **ضبط صدا**: 
   - روی دکمه "تست STT" کلیک کنید
   - مجوز دسترسی به میکروفون را تأیید کنید
   - صحبت کنید (ضبط به صورت خودکار شروع می\u200cشود)
   - برای توقف ضبط، دوباره روی دکمه کلیک کنید یا 10 ثانیه صبر کنید
3. **دریافت متن**: متن استخراج شده به صورت خودکار در textarea قرار می\u200cگیرد.

### 3. تب تنظیمات تصویری (Image Settings)

#### ویژگی‌ها:
- تنظیمات تولید تصویر با استفاده از DALL-E 3
- تحلیل تصویر با استفاده از GPT-4 Vision API
- استخراج متن از تصویر (OCR) با پشتیبانی از زبان فارسی
- قابلیت تست هر سه عملکرد

#### المان‌های UI:
``html
<!-- فرم تنظیمات تصویری -->
<form id="imageSettingsForm">
    <div class="form-group">
        <label>سرویس تولید تصویر</label>
        <select id="image_generation_service" class="form-select">
            <option value="openai">OpenAI DALL-E</option>
            <option value="stability">Stability AI</option>
        </select>
    </div>
    
    <!-- تست تولید تصویر -->
    <div class="image-test">
        <textarea id="imagePrompt" placeholder="توضیح تصویر مورد نظر..."></textarea>
        <button id="generateImageBtn">تولید تصویر</button>
        <div id="generatedImageContainer"></div>
    </div>
    
    <!-- تست تحلیل تصویر -->
    <div class="image-analysis">
        <input type="file" id="imageToAnalyze" accept="image/*">
        <button id="analyzeImageBtn">تحلیل تصویر</button>
        <div id="imageAnalysisResult"></div>
    </div>
    
    <!-- تست OCR فارسی -->
    <div class="ocr-test">
        <input type="file" id="imageForOCR" accept="image/*">
        <button id="ocrBtn">استخراج متن (OCR)</button>
        <div id="ocrResult"></div>
    </div>
</form>
```

### نحوه استفاده از قابلیت\u200cهای تصویری

#### تولید تصویر با DALL-E
1. **انتخاب سرویس**: در حال حاضر OpenAI DALL-E 3 پشتیبانی می\u200cشود.
2. **تولید تصویر**:
   - توضیح تصویر مورد نظر خود را به زبان انگلیسی در textarea وارد کنید
   - روی دکمه "تولید تصویر" کلیک کنید
   - تصویر تولید شده به صورت خودکار نمایش داده می\u200cشود

#### تحلیل تصویر با GPT-4 Vision
1. **انتخاب تصویر**: 
   - روی دکمه "انتخاب فایل" در بخش "تحلیل تصویر" کلیک کنید
   - یک تصویر از کامپیوتر خود انتخاب کنید
2. **تحلیل تصویر**:
   - روی دکمه "تحلیل تصویر" کلیک کنید
   - نتیجه تحلیل به زبان فارسی نمایش داده می\u200cشود
   - تحلیل شامل شناسایی اشیاء، صحنه و محتوای تصویر است

#### استخراج متن از تصویر (OCR)
1. **انتخاب تصویر**:
   - روی دکمه "انتخاب فایل" در بخش "استخراج متن (OCR)" کلیک کنید
   - یک تصویر حاوی متن از کامپیوتر خود انتخاب کنید
2. **استخراج متن**:
   - روی دکمه "استخراج متن (OCR)" کلیک کنید
   - متن استخراج شده به زبان فارسی نمایش داده می\u200cشود
   - این قابلیت با استفاده از GPT-4 Vision API پیاده\u200cسازی شده است

## رابط کاربری

### طراحی رسپانسیو
- استفاده از Grid/Flexbox برای طراحی انعطاف‌پذیر
- اندازه فونت نسبی (rem/em)
- media queries برای سه breakpoints اصلی:
  - موبایل: تا 768px
  - تبلت: 769px تا 1024px
  - دسکتاپ: بالای 1024px

### استایل‌ها
- استفاده از متغیرهای CSS موجود در پروژه
- رعایت تم روشن/تاریک
- انیمیشن‌های ملایم برای تغییرات UI
- افکت‌های glassmorphism بر اساس استاندارد پروژه

## پایگاه داده

### جدول تنظیمات AI
```
CREATE TABLE IF NOT EXISTS `ai_settings` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `setting_key` varchar(100) NOT NULL,
    `setting_value` text DEFAULT NULL,
    `setting_type` enum('string', 'integer', 'boolean', 'json') NOT NULL DEFAULT 'string',
    `description` varchar(255) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### تنظیمات پیش‌فرض
```
INSERT INTO `ai_settings` (`setting_key`, `setting_value`, `setting_type`, `description`) VALUES
('openai_api_key', '', 'string', 'کلید API OpenAI'),
('ai_model', 'gpt-4o', 'string', 'مدل پیش‌فرض AI'),
('tts_service', 'openai', 'string', 'سرویس تبدیل متن به صوت'),
('voice_selection', 'female', 'string', 'انتخاب صدای پیش‌فرض'),
('speech_speed', '1.0', 'string', 'سرعت تبدیل متن به صوت'),
('image_generation_service', 'openai', 'string', 'سرویس تولید تصویر');
```

## APIها و سرویس‌ها

### OpenAI API
- **Endpoint**: `https://api.openai.com/v1/`
- **Authentication**: Bearer Token
- **Models**: gpt-4o, gpt-4-turbo, gpt-4, gpt-3.5-turbo, dall-e-3, tts-1, whisper-1
- **Vision API**: GPT-4 Vision برای تحلیل تصویر و OCR

### خدمات صوتی
- **TTS**: OpenAI TTS API با پشتیبانی از صداهای onyx (مرد) و nova (زن)
- **STT**: OpenAI Whisper API برای تبدیل صوت به متن با استفاده از میکروفون

### خدمات تصویری
- **تولید تصویر**: DALL-E 3 API
- **تحلیل تصویر**: GPT-4 Vision API با پشتیبانی از زبان فارسی
- **OCR فارسی**: GPT-4 Vision API برای استخراج متن فارسی از تصاویر

## چک لیست توسعه

### مرحله 1: آماده‌سازی پایگاه داده
- [ ] ایجاد جدول ai_settings
- [ ] درج تنظیمات پیش‌فرض
- [ ] اطمینان از اتصال صحیح به دیتابیس

### مرحله 2: پیاده‌سازی API
- [ ] ایجاد فایل ai-settings.php
- [ ] پیاده‌سازی متدهای getSettings و saveSettings
- [ ] تست APIها با Postman یا curl

### مرحله 3: توسعه فرانت‌اند
- [ ] ایجاد فایل ai-settings.js
- [ ] پیاده‌سازی ساختار تب‌ها
- [ ] اضافه کردن ماژول به router.js
- [ ] اضافه کردن آیتم منو به sidebar.js

### مرحله 4: پیاده‌سازی تب‌ها
- [x] تب تنظیمات مدل
  - [x] فرم API Key
  - [x] انتخاب مدل
  - [x] تنظیمات پیشرفته
  - [x] شبیه‌ساز چت
- [x] تب تنظیمات صوتی
  - [x] تنظیمات TTS
  - [x] تنظیمات STT با استفاده از میکروفون
  - [x] تست صدا
- [x] تب تنظیمات تصویری
  - [x] تنظیمات تولید تصویر
  - [x] تست تولید تصویر
  - [x] تست تحلیل تصویر
  - [x] تست OCR فارسی

### مرحله 5: ادغام با سیستم موجود
- [ ] اضافه کردن کارت AI Settings به settings.js
- [ ] تست ناوبری و عملکرد کامل
- [ ] بررسی سازگاری با تم‌های مختلف

### مرحله 6: تست‌ها
- [ ] تست عملکرد فرم‌ها
- [ ] تست ذخیره/بازیابی تنظیمات
- [ ] تست APIها
- [ ] تست رسپانسیو بودن
- [ ] تست در مرورگرهای مختلف

## تست‌ها

### تست واحد (Unit Tests)
- تست توابع ذخیره/بازیابی تنظیمات
- تست اعتبارسنجی فرم‌ها
- تست تبدیل داده‌ها

### تست ادغام (Integration Tests)
- تست اتصال به پایگاه داده
- تست APIها
- تست ناوبری بین تب‌ها

### تست پذیرش (Acceptance Tests)
- تست کاربردی تمامی ویژگی‌ها
- تست UI/UX
- تست عملکرد در دستگاه‌های مختلف

## مستندات

### مستندات توسعه‌دهنده
- توضیح ساختار کد
- راهنمای API
- نحوه اضافه کردن ویژگی جدید

### مستندات کاربر
- راهنمای استفاده از هر تب
- توضیح تنظیمات پیشرفته
- رفع مشکلات رایج

### مستندات API

### دریافت تنظیمات AI
**متد**: GET  
**آدرس**: `/backend/api/v1/ai-settings.php`  
**توضیح**: دریافت تمام تنظیمات AI از پایگاه داده  
**پارامترها**: بدون پارامتر  
**پاسخ موفق**:
``json
{
  "success": true,
  "data": {
    "openai_api_key": {
      "value": "sk-...",
      "type": "string"
    },
    "ai_model": {
      "value": "gpt-4o",
      "type": "string"
    },
    "temperature": {
      "value": 0.7,
      "type": "float"
    },
    "max_tokens": {
      "value": 1000,
      "type": "integer"
    },
    "tts_service": {
      "value": "openai",
      "type": "string"
    },
    "voice_selection": {
      "value": "female",
      "type": "string"
    },
    "speech_speed": {
      "value": 1.0,
      "type": "float"
    },
    "image_generation_service": {
      "value": "openai",
      "type": "string"
    }
  },
  "message": "تنظیمات AI با موفقیت بارگذاری شد"
}
```

### ذخیره تنظیمات AI
**متد**: POST  
**آدرس**: `/backend/api/v1/ai-settings.php`  
**توضیح**: ذخیره تنظیمات AI در پایگاه داده  
**پارامترها**:
``json
{
  "action": "save",
  "settings": {
    "openai_api_key": "sk-...",
    "ai_model": "gpt-4o",
    "temperature": 0.7,
    "max_tokens": 1000,
    "tts_service": "openai",
    "voice_selection": "female",
    "speech_speed": 1.0,
    "image_generation_service": "openai"
  }
}
```
**پاسخ موفق**:
``json
{
  "success": true,
  "message": "تنظیمات AI با موفقیت ذخیره شد",
  "data": {
    "saved_count": 8
  }
}
```

---

**نسخه**: 1.0.0  
**تاریخ ایجاد**: 1404/06/20  
**وضعیت**: آماده برای توسعه ✅
```

```
# راهنمای توسعه ماژول تنظیمات هوش مصنوعی
## AI Settings Module Development Guide

### 📝 نسخه نهایی
**نسخه**: 1.1.0  
**تاریخ به‌روزرسانی**: 1404/06/20  
**وضعیت**: تکمیل شده و آماده برای استفاده ✅

### 📋 فهرست مطالب
1. [معرفی](#معرفی)
2. [مشخصات فنی](#مشخصات-فنی)
3. [معماری پیشنهادی](#معماری-پیشنهادی)
4. [ساختار فایل‌ها](#ساختار-فایلها)
5. [پیاده‌سازی جزئیات](#پیادهسازی-جزئیات)
6. [رابط کاربری](#رابط-کاربری)
7. [پایگاه داده](#پایگاه-داده)
8. [APIها و سرویس‌ها](#apiها-و-سرویسها)
9. [چک لیست توسعه](#چک-لیست-توسعه)
10. [تست‌ها](#تستها)
11. [مستندات](#مستندات)

## معرفی

این سند راهنمای توسعه ماژول "تنظیمات هوش مصنوعی" برای پنل مدیریت DataSave است. این ماژول شامل سه تب اصلی است:
1. تب تنظیمات مدل (Model Settings)
2. تب تنظیمات صوتی (Audio Settings)
3. تب تنظیمات تصویری (Image Settings)

### ویژگی‌های کلیدی
- **پشتیبانی از مدل‌های جدید OpenAI** شامل GPT-4o، GPT-4 Turbo و GPT-3.5 Turbo
- **قابلیت چت هوش مصنوعی** با مدل‌های مختلف
- **تبدیل متن به صوت (TTS)** با پشتیبانی از OpenAI و Google TTS
- **تبدیل صوت به متن (STT)** با استفاده از میکروفون و OpenAI Whisper API
- **تولید تصویر** با استفاده از DALL-E
- **تحلیل تصویر** با استفاده از GPT-4 Vision API
- **استخراج متن از تصویر (OCR)** با پشتیبانی از زبان فارسی

## مشخصات فنی

### فناوری‌های استفاده شده
- **Frontend**: JavaScript ES6 Modules, HTML5, CSS3
- **Backend**: PHP 8+, MySQL/MariaDB
- **APIها**: OpenAI API, TTS/STT Services, OCR Services
- **معماری**: Modular Architecture (بر اساس ساختار موجود پروژه)

### الزامات سیستم
- پشتیبانی از ES6 Modules در مرورگر
- دسترسی به پایگاه داده MySQL
- اتصال اینترنت برای APIهای خارجی
- پشتیبانی از UTF-8 برای زبان فارسی

## معماری پیشنهادی

### ساختار ماژولار
```
assets/js/admin/modules/
├── ai-settings.js          # ماژول اصلی تنظیمات هوش مصنوعی
assets/js/modules/
├── aiUtils.js              # ابزارهای مرتبط با AI (در صورت نیاز)
backend/api/v1/
├── ai-settings.php         # API مدیریت تنظیمات AI
backend/database/
├── ai-settings-schema.sql  # اسکریپت ساختار جداول AI
```

### ادغام با سیستم موجود
- اضافه شدن route جدید در [router.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/router.js)
- اضافه شدن آیتم منو در [sidebar.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/sidebar.js)
- اضافه شدن کارت در [settings.js](file:///Applications/XAMPP/xamppfiles/htdocs/datasave/assets/js/admin/modules/settings.js)

## ساختار فایل‌ها

### فایل اصلی ماژول (ai-settings.js)
```javascript
/**
 * ماژول تنظیمات هوش مصنوعی
 * AI Settings Module
 */
export default {
    /**
     * بارگذاری محتوای تنظیمات هوش مصنوعی
     */
    async loadContent() {
        // پیاده‌سازی محتوای تب‌ها
    },
    
    /**
     * مقداردهی اولیه ماژول
     */
    async init() {
        // پیاده‌سازی رویدادها و تب‌ها
    }
};
```

### API تنظیمات (ai-settings.php)
```php
<?php
/**
 * API تنظیمات هوش مصنوعی
 */
class AISettingsManager {
    // پیاده‌سازی متدهای ذخیره/بازیابی تنظیمات
}
```

## پیاده‌سازی جزئیات

### 1. تب تنظیمات مدل (Model Settings)

#### ویژگی‌ها:
- فیلد API Key برای OpenAI
- انتخاب مدل (GPT-4o, GPT-4 Turbo, GPT-4, GPT-3.5 Turbo)
- تنظیمات پیشرفته مدل (temperature, max_tokens, etc.)
- شبیه‌ساز چت برای تست مدل‌ها

#### المان‌های UI:
``html
<!-- فرم تنظیمات مدل -->
<form id="modelSettingsForm">
    <div class="form-group">
        <label>API Key</label>
        <input type="password" id="openai_api_key" class="form-input">
    </div>
    
    <div class="form-group">
        <label>انتخاب مدل</label>
        <select id="ai_model" class="form-select">
            <option value="gpt-4o">GPT-4o (جدیدترین)</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
        </select>
    </div>
    
    <!-- سایر تنظیمات -->
    
    <!-- شبیه‌ساز چت -->
    <div class="chat-simulator">
        <div class="chat-messages" id="chatMessages"></div>
        <div class="chat-input">
            <input type="text" id="chatInput" placeholder="پیام خود را وارد کنید...">
            <button id="sendChatBtn">ارسال</button>
        </div>
    </div>
</form>
```

### 2. تب تنظیمات صوتی (Audio Settings)

#### ویژگی‌ها:
- تنظیمات TTS (Text-to-Speech) با پشتیبانی از OpenAI و Google TTS
- تنظیمات STT (Speech-to-Text) با استفاده از میکروفون و OpenAI Whisper API
- انتخاب صدا (مرد/زن)
- کنترل سرعت و تنظیمات صوتی
- قابلیت تست صدا با پخش زنده

#### المان‌های UI:
``html
<!-- فرم تنظیمات صوتی -->
<form id="audioSettingsForm">
    <div class="form-group">
        <label>سرویس TTS</label>
        <select id="tts_service" class="form-select">
            <option value="openai">OpenAI TTS</option>
            <option value="google">Google TTS</option>
        </select>
    </div>
    
    <div class="form-group">
        <label>انتخاب صدا</label>
        <select id="voice_selection" class="form-select">
            <option value="male">مرد</option>
            <option value="female">زن</option>
        </select>
    </div>
    
    <div class="form-group">
        <label>سرعت</label>
        <input type="range" id="speech_speed" min="0.5" max="2" step="0.1" value="1">
        <span id="speedValue">1.0x</span>
    </div>
    
    <!-- تست صدا -->
    <div class="audio-test">
        <textarea id="testText" placeholder="متن برای تبدیل به صدا..."></textarea>
        <button id="testTTSBtn">تست TTS</button>
        <button id="testSTTBtn">تست STT</button>
        <audio id="audioPlayer" controls></audio>
    </div>
</form>
```

### نحوه استفاده از قابلیت\u200cهای صوتی

#### تبدیل متن به صوت (TTS)
1. **انتخاب سرویس TTS**: در حال حاضر OpenAI TTS پشتیبانی می\u200cشود. گزینه Google TTS برای توسعه آینده اضافه شده است.
2. **انتخاب صدا**: می\u200cتوانید بین صدای مرد (onyx) و صدای زن (nova) انتخاب کنید.
3. **تنظیم سرعت**: با استفاده از اسلایدر می\u200cتوانید سرعت تبدیل صوت را بین 0.5x تا 2.0x تنظیم کنید.
4. **تست TTS**: 
   - متن مورد نظر خود را در textarea وارد کنید
   - روی دکمه "تست TTS" کلیک کنید
   - صوت تولید شده به صورت خودکار پخش می\u200cشود

#### تبدیل صوت به متن (STT)
1. **دسترسی به میکروفون**: برای استفاده از این قابلیت نیاز به دسترسی به میکروفون دارید.
2. **ضبط صدا**: 
   - روی دکمه "تست STT" کلیک کنید
   - مجوز دسترسی به میکروفون را تأیید کنید
   - صحبت کنید (ضبط به صورت خودکار شروع می\u200cشود)
   - برای توقف ضبط، دوباره روی دکمه کلیک کنید یا 10 ثانیه صبر کنید
3. **دریافت متن**: متن استخراج شده به صورت خودکار در textarea قرار می\u200cگیرد.

### 3. تب تنظیمات تصویری (Image Settings)

#### ویژگی‌ها:
- تنظیمات تولید تصویر با استفاده از DALL-E 3
- تحلیل تصویر با استفاده از GPT-4 Vision API
- استخراج متن از تصویر (OCR) با پشتیبانی از زبان فارسی
- قابلیت تست هر سه عملکرد

#### المان‌های UI:
``html
<!-- فرم تنظیمات تصویری -->
<form id="imageSettingsForm">
    <div class="form-group">
        <label>سرویس تولید تصویر</label>
        <select id="image_generation_service" class="form-select">
            <option value="openai">OpenAI DALL-E</option>
            <option value="stability">Stability AI</option>
        </select>
    </div>
    
    <!-- تست تولید تصویر -->
    <div class="image-test">
        <textarea id="imagePrompt" placeholder="توضیح تصویر مورد نظر..."></textarea>
        <button id="generateImageBtn">تولید تصویر</button>
        <div id="generatedImageContainer"></div>
    </div>
    
    <!-- تست تحلیل تصویر -->
    <div class="image-analysis">
        <input type="file" id="imageToAnalyze" accept="image/*">
        <button id="analyzeImageBtn">تحلیل تصویر</button>
        <div id="imageAnalysisResult"></div>
    </div>
    
    <!-- تست OCR فارسی -->
    <div class="ocr-test">
        <input type="file" id="imageForOCR" accept="image/*">
        <button id="ocrBtn">استخراج متن (OCR)</button>
        <div id="ocrResult"></div>
    </div>
</form>
```

### نحوه استفاده از قابلیت\u200cهای تصویری

#### تولید تصویر با DALL-E
1. **انتخاب سرویس**: در حال حاضر OpenAI DALL-E 3 پشتیبانی می\u200cشود.
2. **تولید تصویر**:
   - توضیح تصویر مورد نظر خود را به زبان انگلیسی در textarea وارد کنید
   - روی دکمه "تولید تصویر" کلیک کنید
   - تصویر تولید شده به صورت خودکار نمایش داده می\u200cشود

#### تحلیل تصویر با GPT-4 Vision
1. **انتخاب تصویر**: 
   - روی دکمه "انتخاب فایل" در بخش "تحلیل تصویر" کلیک کنید
   - یک تصویر از کامپیوتر خود انتخاب کنید
2. **تحلیل تصویر**:
   - روی دکمه "تحلیل تصویر" کلیک کنید
   - نتیجه تحلیل به زبان فارسی نمایش داده می\u200cشود
   - تحلیل شامل شناسایی اشیاء، صحنه و محتوای تصویر است

#### استخراج متن از تصویر (OCR)
1. **انتخاب تصویر**:
   - روی دکمه "انتخاب فایل" در بخش "استخراج متن (OCR)" کلیک کنید
   - یک تصویر حاوی متن از کامپیوتر خود انتخاب کنید
2. **استخراج متن**:
   - روی دکمه "استخراج متن (OCR)" کلیک کنید
   - متن استخراج شده به زبان فارسی نمایش داده می\u200cشود
   - این قابلیت با استفاده از GPT-4 Vision API پیاده\u200cسازی شده است

## رابط کاربری

### طراحی رسپانسیو
- استفاده از Grid/Flexbox برای طراحی انعطاف‌پذیر
- اندازه فونت نسبی (rem/em)
- media queries برای سه breakpoints اصلی:
  - موبایل: تا 768px
  - تبلت: 769px تا 1024px
  - دسکتاپ: بالای 1024px

### استایل‌ها
- استفاده از متغیرهای CSS موجود در پروژه
- رعایت تم روشن/تاریک
- انیمیشن‌های ملایم برای تغییرات UI
- افکت‌های glassmorphism بر اساس استاندارد پروژه

## پایگاه داده

### جدول تنظیمات AI
```
CREATE TABLE IF NOT EXISTS `ai_settings` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `setting_key` varchar(100) NOT NULL,
    `setting_value` text DEFAULT NULL,
    `setting_type` enum('string', 'integer', 'boolean', 'json') NOT NULL DEFAULT 'string',
    `description` varchar(255) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### تنظیمات پیش‌فرض
```
INSERT INTO `ai_settings` (`setting_key`, `setting_value`, `setting_type`, `description`) VALUES
('openai_api_key', '', 'string', 'کلید API OpenAI'),
('ai_model', 'gpt-4o', 'string', 'مدل پیش‌فرض AI'),
('tts_service', 'openai', 'string', 'سرویس تبدیل متن به صوت'),
('voice_selection', 'female', 'string', 'انتخاب صدای پیش‌فرض'),
('speech_speed', '1.0', 'string', 'سرعت تبدیل متن به صوت'),
('image_generation_service', 'openai', 'string', 'سرویس تولید تصویر');
```

## APIها و سرویس‌ها

### OpenAI API
- **Endpoint**: `https://api.openai.com/v1/`
- **Authentication**: Bearer Token
- **Models**: gpt-4o, gpt-4-turbo, gpt-4, gpt-3.5-turbo, dall-e-3, tts-1, whisper-1
- **Vision API**: GPT-4 Vision برای تحلیل تصویر و OCR

### خدمات صوتی
- **TTS**: OpenAI TTS API با پشتیبانی از صداهای onyx (مرد) و nova (زن)
- **STT**: OpenAI Whisper API برای تبدیل صوت به متن با استفاده از میکروفون

### خدمات تصویری
- **تولید تصویر**: DALL-E 3 API
- **تحلیل تصویر**: GPT-4 Vision API با پشتیبانی از زبان فارسی
- **OCR فارسی**: GPT-4 Vision API برای استخراج متن فارسی از تصاویر

## چک لیست توسعه

### مرحله 1: آماده‌سازی پایگاه داده
- [ ] ایجاد جدول ai_settings
- [ ] درج تنظیمات پیش‌فرض
- [ ] اطمینان از اتصال صحیح به دیتابیس

### مرحله 2: پیاده‌سازی API
- [ ] ایجاد فایل ai-settings.php
- [ ] پیاده‌سازی متدهای getSettings و saveSettings
- [ ] تست APIها با Postman یا curl

### مرحله 3: توسعه فرانت‌اند
- [ ] ایجاد فایل ai-settings.js
- [ ] پیاده‌سازی ساختار تب‌ها
- [ ] اضافه کردن ماژول به router.js
- [ ] اضافه کردن آیتم منو به sidebar.js

### مرحله 4: پیاده