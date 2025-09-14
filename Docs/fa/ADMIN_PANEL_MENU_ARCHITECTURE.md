# معماری منو و ساختار ماژولار صفحه ادمین DataSave

## 📋 فهرست مطالب
1. [معرفی](#معرفی)
2. [معماری کلی سیستم](#معماری-کلی-سیستم)
3. [ساختار منوی سایدبار](#ساختار-منوی-سایدبار)
4. [سیستم مسیریابی (Router)](#سیستم-مسیریابی-router)
5. [ساختار ماژول‌ها](#ساختار-ماژولها)
6. [الگوی طراحی ماژول‌ها](#الگوی-طراحی-ماژولها)
7. [سیستم بارگذاری داینامیک](#سیستم-بارگذاری-داینامیک)
8. [ارتباط بین ماژول‌ها](#ارتباط-بین-ماژولها)
9. [نحوه ایجاد منوی جدید](#نحوه-ایجاد-منوی-جدید)
10. [نحوه ایجاد ماژول جدید](#نحوه-ایجاد-ماژول-جدید)
11. [بهینه‌سازی عملکرد](#بهینهسازی-عملکرد)

## معرفی

این مستندات به طور کامل معماری منو و ساختار ماژولار صفحه ادمین DataSave را توضیح می‌دهد. سیستم طوری طراحی شده است که هر بخش به صورت مستقل توسعه یابد و قابلیت نگهداری، تست‌پذیری و مقیاس‌پذیری بالایی داشته باشد.

## معماری کلی سیستم

### مولفه‌های اصلی
```
assets/js/admin/
├── admin-main.js          # نقطه ورود اصلی
├── router.js              # سیستم مسیریابی
├── header.js              # ماژول هدر
├── sidebar.js             # ماژول سایدبار
├── content.js             # ماژول محتوای قدیمی (در حال حذف)
├── modules/               # ماژول‌های صفحات
│   ├── dashboard.js       # داشبورد
│   ├── users.js           # مدیریت کاربران
│   ├── forms.js           # مدیریت فرم‌ها
│   ├── customers.js       # مشتریان
│   ├── reports.js         # گزارشات
│   ├── analytics.js       # تحلیل داده‌ها
│   ├── settings.js        # تنظیمات عمومی
│   ├── sms-settings.js    # تنظیمات پیامک
│   └── support.js         # پشتیبانی
└── utils/                 # ابزارهای کمکی
    ├── event-manager.js   # مدیریت رویدادها
    └── loader.js          # سیستم بارگذاری
```

### جریان کاری
1. **بارگذاری اولیه**: `admin-main.js` تمام ماژول‌های اصلی را مقداردهی می‌کند
2. **ایجاد منو**: `sidebar.js` منوهای سایدبار را ایجاد و مدیریت می‌کند
3. **مسیریابی**: `router.js` مسئولیت ناوبری بین صفحات را بر عهده دارد
4. **بارگذاری محتوا**: هر ماژول مسئولیت بارگذاری محتوای خود را دارد

## ساختار منوی سایدبار

### تعریف منوها
منوها در فایل `sidebar.js` در آرایه `menuItems` تعریف می‌شوند:

```javascript
const menuItems = [
    {
        id: 'dashboard',           // شناسه منحصر به فرد
        title: 'داشبورد',          // عنوان نمایشی
        icon: 'fas fa-home',       // آیکون Font Awesome
        badge: null,               // نشانگر (اختیاری)
        section: 'main',           // بخش منو (main, analytics, system)
        submenu: [                 // منوی فرعی (اختیاری)
            {
                id: 'general-settings',
                title: 'تنظیمات عمومی',
                icon: 'fas fa-cog'
            }
        ]
    }
];
```

### بخش‌های منو
- **منوی اصلی** (`main`): داشبورد، کاربران، فرم‌ها، مشتریان
- **تحلیل و گزارش** (`analytics`): گزارشات، تحلیل داده‌ها
- **سیستم** (`system`): تنظیمات، پشتیبانی

### مدیریت کلیک منو
```javascript
function handleMenuClick(event) {
    event.preventDefault();
    
    const link = event.currentTarget;
    const menuId = link.getAttribute('data-menu');
    
    if (menuId) {
        setActiveMenu(menuId);
        
        // اطلاع‌رسانی به ماژول محتوا
        document.dispatchEvent(new CustomEvent('menuChange', {
            detail: { 
                menuId: menuId,
                title: link.querySelector('.menu-text')?.textContent || menuId
            }
        }));
    }
}
```

## سیستم مسیریابی (Router)

### پیکربندی مسیرها
مسیرها در فایل `router.js` در آبجکت `routeConfig` تعریف می‌شوند:

```javascript
const routeConfig = {
    dashboard: { 
        title: 'داشبورد', 
        icon: 'fas fa-home',
        module: 'dashboard'      // نام فایل ماژول بدون پسوند
    },
    'sms-settings': { 
        title: 'تنظیمات پیامک', 
        icon: 'fas fa-sms',
        module: 'sms-settings'
    }
};
```

### ناوبری بین صفحات
```javascript
// ناوبری به صفحه خاص
RouterModule.navigate('sms-settings');

// دریافت مسیر فعلی
const currentRoute = RouterModule.getCurrentRoute();
```

### بارگذاری داینامیک ماژول‌ها
```javascript
async function loadModule(routeId) {
    const route = routes[routeId];
    if (!route) {
        throw new Error(`Route not found: ${routeId}`);
    }
    
    // استفاده از import() برای بارگذاری داینامیک
    const modulePath = `./modules/${route.module}.js`;
    const module = await import(modulePath);
    
    return module;
}
```

## ساختار ماژول‌ها

### الگوی استاندارد ماژول
هر ماژول باید از الگوی زیر پیروی کند:

```javascript
/**
 * ماژول نام_ماژول
 * Module Name Module
 */
export default {
    /**
     * بارگذاری محتوای ماژول
     */
    async loadContent() {
        try {
            return `
                <!-- HTML محتوای ماژول -->
            `;
        } catch (error) {
            // مدیریت خطا
        }
    },
    
    /**
     * مقداردهی اولیه ماژول
     */
    async init() {
        try {
            // مقداردهی اولیه
        } catch (error) {
            // مدیریت خطا
        }
    }
};
```

### مثال عملی: ماژول داشبورد
```javascript
export default {
    async loadContent() {
        try {
            return `
                <div class="page-header">
                    <h1 class="page-title">
                        <div class="page-title-icon">
                            <i class="fas fa-home"></i>
                        </div>
                        داشبورد
                    </h1>
                    <p class="page-subtitle">نمای کلی سیستم مدیریت DataSave</p>
                </div>
                
                <div class="stats-grid">
                    ${await this.generateStatsCards()}
                </div>
            `;
        } catch (error) {
            console.error('Failed to load dashboard content:', error);
            return `
                <div class="error-container">
                    <h2>❌ خطا در بارگذاری داشبورد</h2>
                    <p>${error.message}</p>
                </div>
            `;
        }
    },
    
    async init() {
        try {
            console.log('Dashboard module initialized');
        } catch (error) {
            console.error('Failed to initialize dashboard:', error);
        }
    }
};
```

## الگوی طراحی ماژول‌ها

### API استاندارد
هر ماژول باید دو تابع اصلی داشته باشد:

1. **`loadContent()`**: بارگذاری محتوای HTML ماژول
2. **`init()`**: مقداردهی اولیه و اتصال رویدادها

### استایل‌دهی
- استفاده از متغیرهای CSS از فایل `variables.css`
- رعایت طراحی Responsive
- استفاده از کلاس‌های استاندارد طراحی

### مدیریت خطا
```javascript
async loadContent() {
    try {
        // کد اصلی
    } catch (error) {
        console.error('Error message:', error);
        return `
            <div class="error-container">
                <h2>❌ خطا در بارگذاری</h2>
                <p>${error.message}</p>
            </div>
        `;
    }
}
```

## سیستم بارگذاری داینامیک

### مزایای Lazy Loading
- کاهش حجم بارگذاری اولیه
- بهبود عملکرد اولیه
- بارگذاری در زمان نیاز

### پیاده‌سازی
```javascript
// بارگذاری داینامیک ماژول
const module = await import('./modules/dashboard.js');

// فراخوانی توابع ماژول
const content = await module.default.loadContent();
```

### کش ماژول‌ها
```javascript
let moduleCache = {};

async function loadModule(routeId) {
    // اگر ماژول در کش وجود دارد
    if (moduleCache[routeId]) {
        return moduleCache[routeId];
    }
    
    // بارگذاری و ذخیره در کش
    const module = await import(modulePath);
    moduleCache[routeId] = module;
    return module;
}
```

## ارتباط بین ماژول‌ها

### الگوی Observer
```javascript
// ارسال رویداد
document.dispatchEvent(new CustomEvent('menuChange', {
    detail: { menuId: 'dashboard' }
}));

// دریافت رویداد
document.addEventListener('menuChange', function(event) {
    const menuId = event.detail.menuId;
    // پردازش رویداد
});
```

### رویدادهای مهم
- `menuChange`: تغییر منو
- `routeChanged`: تغییر مسیر
- `sidebarReady`: آماده شدن سایدبار
- `contentLoaded`: بارگذاری محتوا

## نحوه ایجاد منوی جدید

### 1. اضافه کردن به menuItems
در فایل `sidebar.js`:

```javascript
const menuItems = [
    // ... منوهای موجود ...
    {
        id: 'new-feature',
        title: 'ویژگی جدید',
        icon: 'fas fa-star',
        badge: 'جدید',
        section: 'main'
    }
];
```

### 2. تعریف مسیر
در فایل `router.js`:

```javascript
const routeConfig = {
    // ... مسیرهای موجود ...
    'new-feature': { 
        title: 'ویژگی جدید', 
        icon: 'fas fa-star',
        module: 'new-feature'
    }
};
```

### 3. ایجاد ماژول
ایجاد فایل `new-feature.js` در `modules/`:

```javascript
export default {
    async loadContent() {
        return `
            <div class="page-header">
                <h1 class="page-title">ویژگی جدید</h1>
            </div>
            <!-- محتوای ماژول -->
        `;
    },
    
    async init() {
        // مقداردهی اولیه
    }
};
```

## نحوه ایجاد ماژول جدید

### 1. ایجاد فایل ماژول
ایجاد فایل جدید در `assets/js/admin/modules/`:

```javascript
/**
 * ماژول نام_ماژول
 * Module Name Module
 */
export default {
    /**
     * بارگذاری محتوای ماژول
     */
    async loadContent() {
        try {
            return `
                <div class="page-header">
                    <h1 class="page-title">عنوان صفحه</h1>
                </div>
                <div class="content-section">
                    <!-- محتوای صفحه -->
                </div>
            `;
        } catch (error) {
            console.error('Failed to load content:', error);
            return `
                <div class="error-container">
                    <h2>❌ خطا در بارگذاری</h2>
                    <p>${error.message}</p>
                </div>
            `;
        }
    },
    
    /**
     * مقداردهی اولیه ماژول
     */
    async init() {
        try {
            console.log('Module initialized');
            // اتصال رویدادها و مقداردهی اولیه
        } catch (error) {
            console.error('Failed to initialize module:', error);
        }
    }
};
```

### 2. اضافه کردن به مسیریاب
در فایل `router.js`:

```javascript
const routeConfig = {
    // ... مسیرهای موجود ...
    'module-id': { 
        title: 'عنوان ماژول', 
        icon: 'fas fa-icon',
        module: 'module-filename'
    }
};
```

### 3. اضافه کردن به منو (اختیاری)
در فایل `sidebar.js`:

```javascript
const menuItems = [
    // ... منوها ...
    {
        id: 'module-id',
        title: 'عنوان منو',
        icon: 'fas fa-icon',
        section: 'main'
    }
];
```

## بهینه‌سازی عملکرد

### 1. کش ماژول‌ها
استفاده از کش برای جلوگیری از بارگذاری مجدد:

```javascript
let moduleCache = {};

function loadModule(routeId) {
    if (moduleCache[routeId]) {
        return moduleCache[routeId];
    }
    
    // بارگذاری و ذخیره در کش
}
```

### 2. انیمیشن‌های بهینه
استفاده از انیمیشن‌های سبک برای تغییر صفحات:

```javascript
// انیمیشن خروج
container.style.opacity = '0';
container.style.transform = 'translateY(20px)';

// انتظار کوتاه
await new Promise(resolve => setTimeout(resolve, 150));

// انیمیشن ورود
container.style.opacity = '1';
container.style.transform = 'translateY(0)';
```

### 3. مدیریت خطا
پیاده‌سازی مدیریت خطا در تمام سطوح:

```javascript
try {
    // کد اصلی
} catch (error) {
    console.error('Error:', error);
    // نمایش پیام خطا به کاربر
}
```

---

## 📞 پشتیبانی و ارتباط

- **مستندات**: `Docs/fa/`
- **مثال‌ها**: `examples/`
- **گزارش مشکلات**: از طریق سیستم لاگ‌گیری

---

**نسخه**: 1.0.0  
**تاریخ بروزرسانی**: ۱۰ سپتامبر ۲۰۲۵  
**وضعیت**: فعال ✅