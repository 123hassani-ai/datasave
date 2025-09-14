# DataSave - سیستم مدیریت جامع داده‌ها

[![وضعیت](https://img.shields.io/badge/%D9%88%D8%B6%D8%B9%DB%8C%D8%AA-%D9%81%D8%A7%D8%B2%203%20%DA%A9%D8%A7%D9%85%D9%84-brightgreen)](https://github.com/123hassani-ai/datasave)
[![نسخه](https://img.shields.io/badge/%D9%86%D8%B3%D8%AE%D9%87-2.0-orange)](README.md)
[![لایسنس](https://img.shields.io/badge/%D9%84%D8%A7%DB%8C%D8%B3%D9%86%D8%B3-MIT-green)](LICENSE)
[![PHP](https://img.shields.io/badge/PHP-8.0+-777BB4)](backend/)

یک اپلیکیشن وب حرفه‌ای و جامع برای مدیریت داده‌ها با قابلیت‌های پردازش Excel، یکپارچگی AI، سیستم SMS و پنل مدیریت مدرن.

## 🎯 نمای کلی پروژه

این پروژه در چندین فاز توسعه یافته و هم‌اکنون به یک سیستم کامل و حرفه‌ای تبدیل شده است که شامل تمامی امکانات مورد نیاز یک سیستم مدیریت داده‌های مدرن می‌باشد.

### ✅ فازهای تکمیل شده

#### فاز 1: زیرساخت پروژه ✅
- **ساختار حرفه‌ای**: سازماندهی مدرن فایل‌ها و دایرکتوری‌ها
- **UI/UX مدرن**: طراحی ریسپانسیو با پشتیبانی کامل RTL
- **Architecture**: معماری مبتنی بر ES6+ و ماژولار
- **مستندات کامل**: راهنماهای جامع توسعه و استفاده

#### فاز 2: سیستم لاگ و مانیتورینگ ✅  
- **سیستم لاگ حرفه‌ای**: ذخیره‌سازی در IndexedDB با عملکرد بهینه
- **رابط مدیریت**: پنل وب‌بیسد با آمار real-time
- **یکپارچگی کامل**: پوشش کل اپلیکیشن با error handling
- **مجموعه تست**: رابط تست جامع برای اعتبارسنجی

#### فاز 3: پنل مدیریت و Backend ✅
- **Admin Dashboard**: پنل مدیریت کامل با قابلیت‌های پیشرفته
- **Backend API**: RESTful API با PHP و MySQL
- **احراز هویت**: سیستم JWT-based authentication  
- **مدیریت کاربران**: سیستم نقش‌بندی و مجوزها

#### فاز 4: مدیریت داده‌ها و Excel ✅
- **Excel Import**: آپلود و پردازش فایل‌های Excel
- **Timeline Interface**: نمایش مراحل پردازش به صورت تعاملی
- **Data Validation**: اعتبارسنجی و تصحیح داده‌ها
- **Project Management**: مدیریت پروژه‌ها در IndexedDB

#### فاز 5: یکپارچگی AI و SMS ✅
- **AI Integration**: تنظیمات OpenAI و Google AI
- **SMS System**: ارسال و مدیریت پیامک با API های متنوع
- **Configuration**: پنل تنظیمات پیشرفته
- **Monitoring**: نظارت بر استفاده و آمارگیری

## 📁 ساختار کامل پروژه

```
datasave/
├── 📄 index.html                          # صفحه اصلی اپلیکیشن
├── 📄 README.md                           # مستندات اصلی پروژه
├── 📁 assets/                             # منابع استاتیک
│   ├── 📁 css/                            # استایل‌ها
│   │   ├── 📄 main.css                    # استایل اصلی
│   │   ├── 📁 admin/                      # استایل‌های پنل مدیریت
│   │   │   ├── 📄 dashboard.css           # داشبورد
│   │   │   ├── 📄 sidebar.css             # نوار کناری
│   │   │   ├── 📄 header.css              # هدر
│   │   │   └── 📁 modules/                # ماژول‌های تخصصی
│   │   └── 📁 components/                 # کامپوننت‌های UI
│   ├── 📁 js/                             # اسکریپت‌ها
│   │   ├── 📄 main.js                     # اسکریپت اصلی
│   │   ├── 📁 admin/                      # اسکریپت‌های ادمین
│   │   │   ├── 📄 dashboard.js            # مدیریت داشبورد
│   │   │   ├── 📄 router.js               # مسیریابی SPA
│   │   │   ├── 📄 sidebar.js              # مدیریت منو
│   │   │   └── 📁 modules/                # ماژول‌های عملکردی
│   │   │       ├── 📄 ai-settings.js      # ✅ تنظیمات AI
│   │   │       ├── 📄 data-management.js  # ✅ مدیریت داده‌ها
│   │   │       ├── 📄 excel-to-sql-timeline.js # ✅ Timeline Excel
│   │   │       ├── 📄 sms-settings.js     # ✅ تنظیمات SMS
│   │   │       └── 📄 users.js            # ✅ مدیریت کاربران
│   │   └── 📁 modules/                    # ماژول‌های مشترک
│   │       ├── 📄 simple-logger.js        # ✅ سیستم لاگ
│   │       ├── 📄 numberUtils.js          # ✅ ابزار عددی فارسی
│   │       ├── 📄 persian-calendar.js     # ✅ تقویم فارسی
│   │       └── 📄 excel-processor.js      # ✅ پردازشگر Excel
│   ├── 📁 fonts/                          # فونت‌ها
│   │   └── 📁 vazirmatn/                  # ✅ فونت فارسی کامل
│   └── 📁 templates/                      # قالب‌های HTML
├── 📁 backend/                            # Backend و API
│   ├── 📁 api/v1/                         # API نسخه 1
│   │   ├── 📄 auth.php                    # ✅ احراز هویت
│   │   ├── 📄 users.php                   # ✅ مدیریت کاربران
│   │   ├── � data-management.php         # ✅ مدیریت داده‌ها
│   │   ├── 📄 ai-settings.php             # ✅ تنظیمات AI
│   │   └── 📄 sms.php                     # ✅ سرویس SMS
│   ├── 📁 config/                         # تنظیمات
│   │   └── 📄 database.php                # ✅ تنظیمات دیتابیس
│   ├── 📁 models/                         # مدل‌های داده
│   │   ├── 📄 User.php                    # ✅ مدل کاربر
│   │   └── 📄 DataProject.php             # ✅ مدل پروژه
│   └── 📁 database/                       # اسکریپت‌های دیتابیس
│       ├── 📄 schema.sql                  # ✅ ساختار اصلی
│       ├── 📄 ai-settings-schema.sql      # ✅ جداول AI
│       └── 📄 sms-schema.sql              # ✅ جداول SMS
├── 📁 Docs/                               # مستندات
│   ├── � fa/                             # مستندات فارسی
│   │   ├── 📄 complete-guide.md           # ✅ راهنمای کامل
│   │   ├── 📄 Backend-Documentation.md    # ✅ مستندات Backend
│   │   ├── 📄 AI_SETTINGS_GUIDE.md        # ✅ راهنمای AI
│   │   └── 📄 EXCEL_ROADMAP.md            # ✅ نقشه راه Excel
│   └── 📁 Prompts/                        # راهنماهای توسعه
├── 📁 tests/                              # فایل‌های تست
│   ├── 📄 test-admin-modules.html         # ✅ تست ماژول‌های ادمین
│   ├── 📄 test-api-connection.html        # ✅ تست اتصال API
│   ├── 📄 test-database.php               # ✅ تست دیتابیس
│   └── 📄 test-logging.html               # ✅ تست سیستم لاگ
└── 📁 pages/                              # صفحات اضافی
    └── 📄 sms-reports.html                # ✅ گزارشات SMS
```
│   └── admin/                     # Admin panel pages (future)
└── Docs/
    └── Prompts/                   # Development documentation
        ├── 01-instructions-rols.md # ✅ Project rules & guidelines
        └── 02-Logging-module.md    # ✅ Logging implementation docs
```

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Bootstrap 5 RTL
- **Icons**: Font Awesome 6
- **Charts**: Chart.js
- **Storage**: IndexedDB with localStorage fallback
- **Testing**: Custom test suite with real-time monitoring

## 🎯 Key Features

### Implemented Features ✅

#### Professional Logging System
- **IndexedDB Storage**: Persistent, high-performance log storage
- **Automatic Log Rotation**: Maintains optimal database size
- **Multiple Log Levels**: DEBUG, INFO, WARN, ERROR, FATAL
- **Real-time Statistics**: Live monitoring of application state
- **Performance Timing**: Built-in operation duration tracking
- **Function Tracing**: Entry/exit monitoring for debugging
- **Global Error Handling**: Automatic capture of uncaught exceptions
- **Configuration Management**: Web-based admin panel
- **Export Capabilities**: JSON export for external analysis

#### Application Infrastructure
- **Responsive Design**: Mobile-first approach with RTL support
- **Modern JavaScript**: ES6+ with modular architecture
- **Error Boundaries**: Comprehensive error handling
- **Performance Optimized**: Lazy loading and efficient operations
- **Accessibility**: ARIA labels and semantic markup

### Planned Features 🔄

- **ScrollingJalaliPicker Module**: Modern Persian date picker with advanced UI
- **Number Utilities**: Persian/English number conversion
- **Excel Processing Engine**: Advanced file parsing with AI integration
- **Admin Dashboard**: Comprehensive management interface
- **Advanced Analytics**: Detailed reporting and insights

## 🔧 Getting Started

### Prerequisites
- Modern web browser with IndexedDB support
- Local web server (for testing)

### Installation & Running

1. **Clone/Download** the project files
2. **Start a local server**:
   ```bash
   # Using Python
   python3 -m http.server 8080
   
   # Using Node.js
   npx http-server -p 8080
   
   # Using PHP
   php -S localhost:8080
   ```
3. **Open in browser**: `http://localhost:8080`

### Testing the Logging System

Visit `http://localhost:8080/test-logging.html` for comprehensive logging tests:
- ✅ All log level testing (DEBUG through FATAL)
- ✅ Performance benchmarking
- ✅ Bulk logging tests (100+ logs)
- ✅ Function tracing validation
- ✅ Real-time statistics monitoring
- ✅ Configuration panel testing
- ✅ Export/import functionality

## 📊 Logging System Usage

### Basic Logging
```javascript
// Different log levels
Logger.debug('Debug information', { userId: 123 });
Logger.info('User action completed', { action: 'file_upload' });
Logger.warn('Performance warning', { loadTime: 5000 });
Logger.error('Operation failed', error, { context: 'file_processing' });
Logger.fatal('Critical system error', error, { systemState: 'unstable' });
```

### Performance Monitoring
```javascript
// Time operations
const timer = Logger.time('File Processing');
// ... do work ...
const duration = timer(); // Automatically logs completion time

// Trace function calls
const exitTrace = Logger.trace('processExcelFile');
// ... function work ...
exitTrace(); // Logs function exit
```

### Admin Interface Access
- **Keyboard Shortcut**: `Ctrl+Shift+L` (open logger configuration)
- **Navigation Menu**: Click "لاگ‌ها" in the main navigation
- **Programmatic**: `window.loggerAdmin.showPanel()`

## 🔐 Security & Privacy

- ✅ **Client-side Storage**: No external data transmission
- ✅ **Data Sanitization**: Safe handling of user input
- ✅ **Error Boundaries**: Contained error handling
- ✅ **Performance Isolation**: No impact on main thread

## 📈 Performance Metrics

The logging system is designed for minimal performance impact:
- **Log Operation**: <1ms per log entry
- **Batch Processing**: 50-log batches for efficiency
- **Memory Management**: Automatic cleanup and rotation
- **Storage**: IndexedDB for optimal performance

## 🔄 Development Roadmap

### Phase 3: ScrollingJalaliPicker Module ✅
- **Modern Date Picker**: Professional Persian calendar with scrolling interface
- **Advanced UI**: Glass morphism design with smooth animations
- **Complete API**: Full method suite for date manipulation and validation
- **Mobile Optimized**: Responsive design for all devices
- **Performance Focused**: Optimized for speed and memory efficiency
- **Comprehensive Documentation**: Complete guide in Persian
- Complete Persian/Gregorian date conversion
- Holiday support and calculation
- Localized date formatting
- Integration with existing logging system

### Future Phases
1. **Number Utilities Module**: Persian/English number conversion
2. **Admin Dashboard**: Complete management interface
3. **Excel Processing Engine**: AI-powered file processing
4. **Advanced Analytics**: Comprehensive reporting system

## 🤝 Development Guidelines

This project follows strict professional standards:
- **Code Quality**: ESLint compliance, JSDoc documentation
- **Performance**: Optimized operations, lazy loading
- **Accessibility**: WCAG 2.1 compliance
- **Security**: Input validation, XSS protection
- **Testing**: Comprehensive test coverage
- **Documentation**: Detailed inline and external docs

## 📝 Documentation

- **Project Rules**: [`Docs/Prompts/01-instructions-rols.md`](Docs/Prompts/01-instructions-rols.md)
- **Logging Documentation**: [`Docs/Prompts/02-Logging-module.md`](Docs/Prompts/02-Logging-module.md)
- **ScrollingJalaliPicker Guide**: [`Docs/fa/SCROLLING_JALALI_PICKER_GUIDE.md`](Docs/fa/SCROLLING_JALALI_PICKER_GUIDE.md)
- **Module Documentation**: [`Docs/Prompts/07-scrolling-jalali-picker-module.md`](Docs/Prompts/07-scrolling-jalali-picker-module.md)
- **Usage Examples**: [`docs/scrolling-jalali-picker-usage.js`](docs/scrolling-jalali-picker-usage.js)
- **API Documentation**: Available in source code JSDoc comments

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **RTL Support**: Full Persian language support
- **Responsive Layout**: Mobile-first design
- **Dark Mode**: System preference detection
- **Smooth Animations**: CSS transitions and transforms
- **Accessibility**: Screen reader support

## 🧪 Testing

The project includes comprehensive testing capabilities:
- **Unit Testing**: Individual component validation
- **Integration Testing**: Cross-module functionality
- **Performance Testing**: Load and stress testing
- **User Interface Testing**: Interactive validation
- **Real-time Monitoring**: Live system state tracking

## 📞 Support & Contribution

This is a professional development project with structured phases. Each module is carefully designed, implemented, and tested before proceeding to the next phase.

---

**Project Status**: ✅ Phase 2 Complete - Logging System Fully Operational  
**Next Phase**: 🔄 NumberUtils Module Development  
**Version**: 1.0.0  
**Last Updated**: December 2024