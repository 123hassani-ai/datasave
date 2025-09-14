# راهنمای کامل Scrolling Jalali Picker
## تقویم شمسی مدرن و قابل شخصی‌سازی

### 📋 فهرست مطالب
1. [معرفی](#معرفی)
2. [نصب و راه‌اندازی](#نصب-و-راهاندازی)
3. [استفاده پایه](#استفاده-پایه)
4. [پیکربندی](#پیکربندی)
5. [متدهای عمومی](#متدهای-عمومی)
6. [رویدادها](#رویدادها)
7. [شخصی‌سازی ظاهر](#شخصیسازی-ظاهر)
8. [مثال‌های کاربردی](#مثالهای-کاربردی)
9. [بهینه‌سازی عملکرد](#بهینهسازی-عملکرد)
10. [رفع مشکلات](#رفع-مشکلات)
11. [بهترین شیوه‌ها](#بهترین-شیوهها)
12. [API کامل](#api-کامل)

## معرفی

Scrolling Jalali Picker یک کتابخانه مدرن و قابل شخصی‌سازی برای انتخاب تاریخ شمسی است. این کتابخانه با استفاده از رابط کاربری شیشه‌ای (Glassmorphism) و انیمیشن‌های روان، تجربه کاربری بی‌نظیری ارائه می‌دهد.

### ویژگی‌های کلیدی:
- 🎨 طراحی مدرن با Glassmorphism
- 📱 کاملاً واکنش‌گرا (Responsive)
- ⚙️ قابلیت شخصی‌سازی کامل
- 🌙 پشتیبانی از حالت تاریک
- 🔧 API ساده و قدرتمند
- 📦 بدون وابستگی به کتابخانه خارجی
- 🌐 پشتیبانی کامل از RTL
- ⌨️ پشتیبانی از کیبورد (Escape, Enter)

## نصب و راه‌اندازی

### روش 1: استفاده مستقیم در HTML
```html
<!-- لود کردن فایل جاوااسکریپت -->
<script src="assets/js/modules/scrolling-jalali-picker.js"></script>
```

### روش 2: استفاده در ماژول‌های ES6
```javascript
import ScrollingJalaliPicker from './assets/js/modules/scrolling-jalali-picker.js';
```

## استفاده پایه

### ایجاد یک input ساده
```html
<input type="text" id="date-picker" placeholder="تاریخ را انتخاب کنید...">
```

### مقداردهی اولیه
```javascript
// روش 1: استفاده از سلکتور
const picker = new ScrollingJalaliPicker('#date-picker');

// روش 2: استفاده از المنت
const element = document.getElementById('date-picker');
const picker = new ScrollingJalaliPicker(element);

// روش 3: ایجاد چندین picker
const pickers = ScrollingJalaliPicker.create('.date-input');
```

## پیکربندی

### تنظیمات پیش‌فرض
```javascript
const defaultConfig = {
    // تنظیمات ظاهری
    theme: 'modern', // modern, classic, minimal, glass
    size: 'medium', // small, medium, large
    borderRadius: '15px',
    backdropBlur: true,
    animation: 'slideUp', // slideUp, fadeIn, scaleIn, slideDown
    animationDuration: 300,
    
    // رنگ‌ها
    colors: {
        primary: '#667eea',
        secondary: '#764ba2',
        success: '#2ecc71',
        danger: '#e74c3c',
        text: '#333',
        textLight: '#666',
        background: '#ffffff',
        overlay: 'rgba(0, 0, 0, 0.5)'
    },
    
    // فونت
    fontFamily: 'Vazirmatn, Tahoma, sans-serif',
    fontSize: {
        small: '12px',
        medium: '14px',
        large: '16px'
    },
    
    // تنظیمات تاریخ
    yearRange: {
        min: 1300,
        max: 1500
    },
    defaultDate: null, // null = امروز
    
    // متن‌ها
    texts: {
        title: 'انتخاب تاریخ شمسی',
        subtitle: 'تاریخ مورد نظر خود را انتخاب کنید',
        year: 'سال',
        month: 'ماه',
        day: 'روز',
        confirm: '✅ تأیید',
        cancel: '❌ انصراف',
        today: '📅 امروز',
        clear: '🗑️ پاک کردن',
        close: '✖️ بستن'
    },
    
    // رفتارها
    autoClose: true,
    showToday: true,
    showClear: true,
    closeOnOverlay: true,
    showGregorian: true,
    rtl: true,
    
    // callback ها
    onSelect: null,
    onOpen: null,
    onClose: null,
    onChange: null
};
```

### تنظیم پیکربندی سفارشی
```javascript
const picker = new ScrollingJalaliPicker('#date-picker', {
    theme: 'glass',
    size: 'large',
    colors: {
        primary: '#ff6b6b',
        secondary: '#4ecdc4'
    },
    yearRange: {
        min: 1350,
        max: 1450
    },
    texts: {
        title: 'تاریخ تولد خود را انتخاب کنید',
        confirm: 'ثبت تاریخ'
    },
    autoClose: false
});
```

### تنظیم پیکربندی سراسری
```javascript
// تنظیم پیکربندی برای تمام picker ها
ScrollingJalaliPicker.setGlobalConfig({
    theme: 'glass',
    colors: {
        primary: '#3498db',
        background: '#f8f9fa'
    }
});
```

## متدهای عمومی

### باز کردن picker
```javascript
picker.open();
```

### بستن picker
```javascript
picker.close();
```

### دریافت تاریخ انتخاب شده
```javascript
const selectedDate = picker.getSelectedDate();
console.log(selectedDate);
// خروجی:
// {
//   jalali: { year: 1402, month: 9, day: 15 },
//   persian: "15 آذر 1402",
//   iso: "1402/09/15",
//   gregorian: Date object
// }
```

### تنظیم تاریخ
```javascript
// تنظیم تاریخ خاص
picker.setDate(1402, 9, 15);

// تنظیم تاریخ امروز
picker.setToday();
```

### به‌روزرسانی تنظیمات
```javascript
picker.updateConfig({
    theme: 'dark',
    autoClose: false
});
```

### حذف picker
```javascript
picker.destroy();
```

### پاک کردن انتخاب
```javascript
picker.clearSelection();
```

## رویدادها

### رویداد انتخاب تاریخ
```javascript
const picker = new ScrollingJalaliPicker('#date-picker', {
    onSelect: function(selectedDate, persianDate, isoDate, pickerInstance) {
        console.log('تاریخ انتخاب شد:', persianDate);
        console.log('تاریخ ISO:', isoDate);
        console.log('نمونه picker:', pickerInstance);
    }
});
```

### رویداد باز شدن picker
```javascript
const picker = new ScrollingJalaliPicker('#date-picker', {
    onOpen: function(pickerInstance) {
        console.log('Picker باز شد');
    }
});
```

### رویداد بسته شدن picker
```javascript
const picker = new ScrollingJalaliPicker('#date-picker', {
    onClose: function(pickerInstance) {
        console.log('Picker بسته شد');
    }
});
```

### رویداد تغییر تاریخ
```javascript
const picker = new ScrollingJalaliPicker('#date-picker', {
    onChange: function(selectedDate, pickerInstance) {
        console.log('تاریخ تغییر کرد:', selectedDate);
    }
});
```

## شخصی‌سازی ظاهر

### انواع تم
```javascript
// تم مدرن (پیش‌فرض)
const modernPicker = new ScrollingJalaliPicker('#picker1', {
    theme: 'modern'
});

// تم کلاسیک
const classicPicker = new ScrollingJalaliPicker('#picker2', {
    theme: 'classic'
});

// تم مینیمال
const minimalPicker = new ScrollingJalaliPicker('#picker3', {
    theme: 'minimal'
});

// تم شیشه‌ای
const glassPicker = new ScrollingJalaliPicker('#picker4', {
    theme: 'glass',
    backdropBlur: true
});
```

### اندازه‌ها
```javascript
// اندازه کوچک
const smallPicker = new ScrollingJalaliPicker('#picker1', {
    size: 'small'
});

// اندازه متوسط (پیش‌فرض)
const mediumPicker = new ScrollingJalaliPicker('#picker2', {
    size: 'medium'
});

// اندازه بزرگ
const largePicker = new ScrollingJalaliPicker('#picker3', {
    size: 'large'
});
```

### رنگ‌بندی سفارشی
```javascript
const customPicker = new ScrollingJalaliPicker('#picker', {
    colors: {
        primary: '#ff6b6b',      // رنگ اصلی
        secondary: '#4ecdc4',    // رنگ ثانویه
        success: '#1dd1a1',      // رنگ موفقیت
        danger: '#ff9f43',       // رنگ خطا
        text: '#2d3436',         // رنگ متن
        textLight: '#636e72',    // رنگ متن روشن
        background: '#ffffff',   // رنگ پس‌زمینه
        overlay: 'rgba(0, 0, 0, 0.7)' // رنگ پوشش
    }
});
```

### انیمیشن‌ها
```javascript
const animatedPicker = new ScrollingJalaliPicker('#picker', {
    animation: 'slideUp',        // slideUp, fadeIn, scaleIn, slideDown
    animationDuration: 500       // مدت زمان انیمیشن به میلی‌ثانیه
});
```

## مثال‌های کاربردی

### مثال 1: فرم ثبت‌نام
```html
<form id="registration-form">
    <div class="form-group">
        <label for="birth-date">تاریخ تولد:</label>
        <input type="text" id="birth-date" name="birth_date" class="form-control" readonly>
    </div>
    <button type="submit">ثبت نام</button>
</form>

<script>
const birthDatePicker = new ScrollingJalaliPicker('#birth-date', {
    texts: {
        title: 'تاریخ تولد خود را انتخاب کنید',
        subtitle: 'این اطلاعات برای اهدای هدیه تولد استفاده می‌شود'
    },
    yearRange: {
        min: 1300,
        max: 1402
    },
    onSelect: function(selectedDate, persianDate, isoDate) {
        console.log('تاریخ تولد انتخاب شد:', isoDate);
    }
});
</script>
```

### مثال 2: فیلتر تاریخ در گزارش‌ها
```html
<div class="date-filters">
    <input type="text" id="date-from" placeholder="از تاریخ">
    <input type="text" id="date-to" placeholder="تا تاریخ">
</div>

<script>
// ایجاد چندین picker
const datePickers = ScrollingJalaliPicker.create('.date-filters input', {
    showGregorian: false,
    texts: {
        title: 'انتخاب بازه زمانی',
        confirm: 'اعمال فیلتر'
    }
});

// رویداد تأیید
datePickers.forEach(picker => {
    picker.config.onSelect = function(selectedDate, persianDate, isoDate) {
        console.log('تاریخ انتخاب شد:', isoDate);
        // اعمال فیلتر در گزارش‌ها
        applyDateFilter();
    };
});
</script>
```

### مثال 3: تقویم تولد با تم سفارشی
```javascript
const birthdayPicker = new ScrollingJalaliPicker('#birthday', {
    theme: 'glass',
    size: 'large',
    colors: {
        primary: '#ff6b9d',
        secondary: '#a55eea',
        background: 'rgba(255, 255, 255, 0.9)'
    },
    texts: {
        title: '🎉 تاریخ تولد شما',
        subtitle: 'ما برای شما هدیه‌ای آماده کرده‌ایم!',
        confirm: 'ثبت و دریافت هدیه 🎁'
    },
    backdropBlur: true,
    autoClose: false,
    onSelect: function(selectedDate, persianDate, isoDate) {
        // ذخیره تاریخ تولد
        saveBirthday(isoDate);
        // نمایش پیام موفقیت
        showSuccessMessage('تاریخ تولد شما با موفقیت ثبت شد!');
        // بستن picker
        this.close();
    }
});
```

### مثال 4: مدیریت پیشرفته گزارش‌های SMS
```javascript
class SMSReportManager {
    constructor() {
        this.pickers = {};
        this.filters = {};
        this.init();
    }
    
    init() {
        this.initDatePickers();
        this.attachEvents();
    }
    
    initDatePickers() {
        // پیکر تاریخ شروع
        this.pickers.startDate = new ScrollingJalaliPicker('#start-date', {
            size: 'medium',
            colors: {
                primary: '#667eea',
                secondary: '#764ba2'
            },
            texts: {
                title: '📅 تاریخ شروع گزارش',
                subtitle: 'تاریخ آغاز دوره مورد نظر را انتخاب کنید'
            },
            yearRange: {
                min: 1400,
                max: 1404
            },
            onSelect: (date, persian, iso, picker) => {
                this.filters.startDate = { date, persian, iso };
                this.validateDateRange();
                this.updateUI();
            }
        });
        
        // پیکر تاریخ پایان
        this.pickers.endDate = new ScrollingJalaliPicker('#end-date', {
            size: 'medium',
            colors: {
                primary: '#667eea',
                secondary: '#764ba2'
            },
            texts: {
                title: '📅 تاریخ پایان گزارش',
                subtitle: 'تاریخ پایان دوره مورد نظر را انتخاب کنید'
            },
            yearRange: {
                min: 1400,
                max: 1404
            },
            onSelect: (date, persian, iso, picker) => {
                this.filters.endDate = { date, persian, iso };
                this.validateDateRange();
                this.updateUI();
            }
        });
    }
    
    validateDateRange() {
        if (this.filters.startDate && this.filters.endDate) {
            // اعتبارسنجی بازه تاریخ
            const startParts = this.filters.startDate.iso.split('/');
            const endParts = this.filters.endDate.iso.split('/');
            
            const startDate = new Date(parseInt(startParts[0]), parseInt(startParts[1])-1, parseInt(startParts[2]));
            const endDate = new Date(parseInt(endParts[0]), parseInt(endParts[1])-1, parseInt(endParts[2]));
            
            if (startDate > endDate) {
                this.showWarning('تاریخ شروع نمی‌تواند بعد از تاریخ پایان باشد');
                return false;
            }
        }
        return true;
    }
    
    updateUI() {
        this.updateDateRangeDisplay();
        if (this.filters.startDate && this.filters.endDate) {
            this.enableFilterButton();
        }
    }
    
    updateDateRangeDisplay() {
        const displayElement = document.getElementById('date-range-display');
        if (!displayElement) return;
        
        if (this.filters.startDate && this.filters.endDate) {
            displayElement.innerHTML = `
                <span class="date-range-text">
                    📅 از ${this.filters.startDate.persian} تا ${this.filters.endDate.persian}
                </span>
            `;
        } else if (this.filters.startDate) {
            displayElement.innerHTML = `
                <span class="date-range-partial">
                    📅 از ${this.filters.startDate.persian} (تاریخ پایان انتخاب نشده)
                </span>
            `;
        } else if (this.filters.endDate) {
            displayElement.innerHTML = `
                <span class="date-range-partial">
                    📅 تا ${this.filters.endDate.persian} (تاریخ شروع انتخاب نشده)
                </span>
            `;
        } else {
            displayElement.innerHTML = `
                <span class="date-range-empty">
                    دامنه تاریخ انتخاب نشده
                </span>
            `;
        }
    }
    
    enableFilterButton() {
        const button = document.getElementById('filter-sms-btn');
        if (button) {
            button.disabled = false;
            button.classList.add('enabled');
        }
    }
    
    showWarning(message) {
        console.warn(message);
        // نمایش هشدار به کاربر
    }
    
    attachEvents() {
        const filterButton = document.getElementById('filter-sms-btn');
        if (filterButton) {
            filterButton.addEventListener('click', () => this.applyFilter());
        }
        
        const clearButton = document.getElementById('clear-filter-btn');
        if (clearButton) {
            clearButton.addEventListener('click', () => this.clearFilters());
        }
    }
    
    applyFilter() {
        if (!this.validateDateRange()) return;
        
        const params = new URLSearchParams({
            start_date: this.filters.startDate.iso,
            end_date: this.filters.endDate.iso
        });
        
        // فرستادن درخواست
        this.fetchFilteredReports(params.toString());
    }
    
    async fetchFilteredReports(params) {
        try {
            const response = await fetch(`backend/api/v1/sms-reports.php?${params}`);
            const data = await response.json();
            
            if (data.success) {
                this.updateReportsTable(data.reports);
                this.showSuccess(`${data.reports.length} گزارش پیدا شد`);
            } else {
                this.showError(data.message);
            }
        } catch (error) {
            this.showError('خطا در ارتباط با سرور');
        }
    }
    
    clearFilters() {
        this.pickers.startDate.clearSelection();
        this.pickers.endDate.clearSelection();
        this.filters = {};
        this.updateUI();
        this.loadAllReports();
    }
    
    // متدهای کمکی برای UI
    showSuccess(message) {
        console.log('✅', message);
    }
    
    showError(message) {
        console.error('❌', message);
    }
    
    updateReportsTable(reports) {
        // به‌روزرسانی جدول گزارش‌ها
        console.log('Reports updated:', reports);
    }
    
    loadAllReports() {
        // بارگذاری تمام گزارش‌ها
        this.fetchFilteredReports('');
    }
}

// راه‌اندازی مدیر گزارش‌های SMS
const smsManager = new SMSReportManager();
```

## بهینه‌سازی عملکرد

### کاهش حجم فایل
```javascript
// تنظیم محدوده سال برای کاهش تعداد آیتم‌ها
const optimizedPicker = new ScrollingJalaliPicker('#picker', {
    yearRange: {
        min: 1380,  // فقط سال‌های اخیر
        max: 1402
    }
});
```

### غیرفعال کردن انیمیشن‌ها
```javascript
// برای دستگاه‌های ضعیف
const performancePicker = new ScrollingJalaliPicker('#picker', {
    animationDuration: 0,  // بدون انیمیشن
    backdropBlur: false    // بدون افکت blur
});
```

### استفاده از lazy loading
```javascript
// ایجاد picker در زمان نیاز
document.getElementById('date-input').addEventListener('focus', function() {
    if (!this.picker) {
        this.picker = new ScrollingJalaliPicker(this);
    }
    this.picker.open();
});
```

## رفع مشکلات

### مشکل 1: picker باز نمی‌شود
```javascript
// بررسی وجود المنت
const element = document.getElementById('date-picker');
if (element) {
    const picker = new ScrollingJalaliPicker(element);
} else {
    console.error('المنت مورد نظر یافت نشد');
}

// بررسی بارگذاری فایل
if (typeof ScrollingJalaliPicker === 'undefined') {
    console.error('فایل scrolling-jalali-picker.js بارگذاری نشده است');
}
```

### مشکل 2: تاریخ انتخاب شده ذخیره نمی‌شود
```javascript
// استفاده از رویداد onSelect
const picker = new ScrollingJalaliPicker('#date-picker', {
    onSelect: function(selectedDate, persianDate, isoDate) {
        // ذخیره در input
        this.element.value = persianDate;
        // ذخیره در dataset
        this.element.dataset.date = isoDate;
        // ذخیره در متغیر
        window.selectedDate = isoDate;
    }
});
```

### مشکل 3: مشکلات CSS
```javascript
// بررسی پشتیبانی از backdrop-filter
if (CSS.supports('backdrop-filter', 'blur(10px)')) {
    // استفاده از تم شیشه‌ای
    const picker = new ScrollingJalaliPicker('#picker', {
        theme: 'glass',
        backdropBlur: true
    });
} else {
    // استفاده از تم معمولی
    const picker = new ScrollingJalaliPicker('#picker', {
        theme: 'modern',
        backdropBlur: false
    });
}
```

### مشکل 4: مشکلات عملکردی
```javascript
// استفاده از تنظیمات بهینه
const optimizedPicker = new ScrollingJalaliPicker('#picker', {
    // محدود کردن محدوده سال
    yearRange: {
        min: new Date().getFullYear() - 10, // 10 سال اخیر
        max: new Date().getFullYear() + 5   // 5 سال آینده
    },
    // کاهش انیمیشن‌ها
    animationDuration: 150,
    // غیرفعال کردن افکت‌های بصری
    backdropBlur: false
});
```

## بهترین شیوه‌ها

### 1. استفاده از رویدادها
```javascript
// ✅ درست
const picker = new ScrollingJalaliPicker('#date-picker', {
    onSelect: function(selectedDate, persianDate, isoDate) {
        // پردازش تاریخ انتخاب شده
        processSelectedDate(isoDate);
    }
});

// ❌ اشتباه
const picker = new ScrollingJalaliPicker('#date-picker');
document.getElementById('date-picker').addEventListener('change', function() {
    // این روش قابل اعتماد نیست
});
```

### 2. مدیریت حافظه
```javascript
// حذف picker هنگام حذف المنت
function removeDatePicker(elementId) {
    const element = document.getElementById(elementId);
    if (element && element.picker) {
        element.picker.destroy();
    }
    element.remove();
}
```

### 3. شخصی‌سازی مناسب
```javascript
// تنظیم پیکربندی سراسری برای سازگاری با تم سایت
ScrollingJalaliPicker.setGlobalConfig({
    colors: {
        primary: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
        background: getComputedStyle(document.documentElement).getPropertyValue('--bg-color')
    },
    fontFamily: getComputedStyle(document.documentElement).getPropertyValue('--font-family')
});
```

### 4. مدیریت خطاها
```javascript
try {
    const picker = new ScrollingJalaliPicker('#date-picker');
} catch (error) {
    console.error('خطا در ایجاد تقویم:', error.message);
    // نمایش پیام مناسب به کاربر
}
```

### 5. استفاده از متدهای استاتیک
```javascript
// ایجاد چندین picker با تنظیمات یکسان
const pickers = ScrollingJalaliPicker.create('.date-input', {
    theme: 'glass',
    yearRange: { min: 1400, max: 1403 }
});

// تنظیم پیکربندی سراسری
ScrollingJalaliPicker.setGlobalConfig({
    theme: 'modern',
    size: 'medium'
});
```

## API کامل

### متدهای نمونه
| متد | توضیح | مثال |
|-----|------|------|
| `open()` | باز کردن picker | `picker.open()` |
| `close()` | بستن picker | `picker.close()` |
| `getSelectedDate()` | دریافت تاریخ انتخاب شده | `picker.getSelectedDate()` |
| `setDate(year, month, day)` | تنظیم تاریخ | `picker.setDate(1402, 9, 15)` |
| `setToday()` | تنظیم تاریخ امروز | `picker.setToday()` |
| `updateConfig(config)` | به‌روزرسانی تنظیمات | `picker.updateConfig({theme: 'dark'})` |
| `destroy()` | حذف picker | `picker.destroy()` |
| `clearSelection()` | پاک کردن انتخاب | `picker.clearSelection()` |

### متدهای استاتیک
| متد | توضیح | مثال |
|-----|------|------|
| `create(selector, config)` | ایجاد چندین picker | `ScrollingJalaliPicker.create('.date-input')` |
| `setGlobalConfig(config)` | تنظیم پیکربندی سراسری | `ScrollingJalaliPicker.setGlobalConfig({theme: 'glass'})` |
| `getToday()` | دریافت تاریخ امروز | `ScrollingJalaliPicker.getToday()` |

### خصوصیات
| خصوصیت | توضیح | مثال |
|--------|------|------|
| `element` | المنت مربوطه | `picker.element` |
| `config` | تنظیمات فعلی | `picker.config.theme` |
| `selectedDate` | تاریخ انتخاب شده | `picker.selectedDate.year` |
| `isOpen` | وضعیت باز/بسته | `picker.isOpen` |

### تنظیمات قابل پیکربندی
| تنظیم | نوع | پیش‌فرض | توضیح |
|-------|-----|--------|------|
| `theme` | string | 'modern' | تم ظاهری (modern, classic, minimal, glass) |
| `size` | string | 'medium' | اندازه (small, medium, large) |
| `borderRadius` | string | '15px' | شعاع گوشه‌ها |
| `backdropBlur` | boolean | true | افکت blur پس‌زمینه |
| `animation` | string | 'slideUp' | نوع انیمیشن |
| `animationDuration` | number | 300 | مدت زمان انیمیشن (میلی‌ثانیه) |
| `colors` | object | - | رنگ‌های ظاهری |
| `fontFamily` | string | 'Vazirmatn, Tahoma, sans-serif' | فونت |
| `yearRange` | object | {min: 1300, max: 1500} | محدوده سال‌ها |
| `defaultDate` | object/null | null | تاریخ پیش‌فرض |
| `texts` | object | - | متن‌های رابط کاربری |
| `autoClose` | boolean | true | بستن خودکار پس از انتخاب |
| `showToday` | boolean | true | نمایش دکمه امروز |
| `showClear` | boolean | true | نمایش دکمه پاک کردن |
| `closeOnOverlay` | boolean | true | بستن با کلیک روی پس‌زمینه |
| `showGregorian` | boolean | true | نمایش تاریخ میلادی |
| `rtl` | boolean | true | پشتیبانی از راست به چپ |
| `onSelect` | function | null | رویداد انتخاب تاریخ |
| `onOpen` | function | null | رویداد باز شدن |
| `onClose` | function | null | رویداد بسته شدن |
| `onChange` | function | null | رویداد تغییر تاریخ |

---

## 📞 پشتیبانی و ارتباط

- **مستندات**: `Docs/fa/`
- **مثال‌ها**: `examples/`
- **گزارش مشکلات**: از طریق سیستم لاگ‌گیری

---

**نسخه**: 1.0.0  
**تاریخ بروزرسانی**: ۱۰ سپتامبر ۲۰۲۵  
**وضعیت**: فعال و آماده استفاده ✅