/**
 * اسکریپت اعمال خودکار فونت وزیرمتن
 * Auto-apply Vazirmatn Font Script
 * 
 * @description: این اسکریپت به طور خودکار فونت وزیرمتن را به تمام عناصر صفحه اعمال می‌کند
 * @version: 1.0.0
 * @author: DataSave Team
 */

(function() {
    'use strict';
    
    /**
     * اعمال فونت وزیرمتن به تمام عناصر
     * Apply Vazirmatn font to all elements
     */
    function applyVazirmatnFont() {
        try {
            // ایجاد لینک CSS فونت در صورت عدم وجود
            if (!document.querySelector('link[href*="vazirmatn.css"]')) {
                const fontLink = document.createElement('link');
                fontLink.rel = 'stylesheet';
                fontLink.href = getBasePath() + 'assets/fonts/vazirmatn.css';
                fontLink.onerror = function() {
                    console.warn('خطا در بارگذاری فایل CSS فونت');
                };
                document.head.appendChild(fontLink);
            }
        
        // ایجاد استایل برای اعمال فونت
        const styleElement = document.createElement('style');
        styleElement.id = 'vazirmatn-font-styles';
        styleElement.innerHTML = `
            /* اعمال فونت وزیرمتن به تمام عناصر */
            *, *::before, *::after {
                font-family: 'Vazirmatn', 'Tahoma', 'Arial', sans-serif !important;
            }
            
            body {
                font-family: 'Vazirmatn', 'Tahoma', 'Arial', sans-serif !important;
                font-weight: 400;
            }
            
            /* عناصر ورودی */
            input, textarea, select, button {
                font-family: 'Vazirmatn', 'Tahoma', 'Arial', sans-serif !important;
            }
            
            /* عناوین */
            h1, h2, h3, h4, h5, h6 {
                font-family: 'Vazirmatn', 'Tahoma', 'Arial', sans-serif !important;
                font-weight: 600;
            }
            
            /* کدها و متن‌های monospace */
            code, pre, .monospace {
                font-family: 'Vazirmatn', 'Courier New', 'Monaco', monospace !important;
            }
            
            /* فونت فال‌بک برای عناصر خاص */
            .font-vazirmatn {
                font-family: 'Vazirmatn', 'Tahoma', 'Arial', sans-serif !important;
            }
            
            .font-regular {
                font-weight: 400 !important;
            }
            
            .font-medium {
                font-weight: 500 !important;
            }
            
            .font-semibold {
                font-weight: 600 !important;
            }
            
            .font-bold {
                font-weight: 700 !important;
            }
        `;
        
        // حذف استایل قبلی در صورت وجود
        const existingStyle = document.getElementById('vazirmatn-font-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        // اضافه کردن استایل جدید
        document.head.appendChild(styleElement);
        
        console.log('✅ فونت وزیرمتن به طور خودکار اعمال شد');
        
        } catch (error) {
            console.error('خطا در اعمال فونت وزیرمتن:', error);
        }
    }
    
    /**
     * تشخیص مسیر پایه پروژه
     * Detect project base path
     */
    function getBasePath() {
        try {
            const currentPath = window.location.pathname;
            
            // اگر در پوشه tests هستیم
            if (currentPath.includes('/tests/')) {
                return '../';
            }
            
            // اگر در پوشه admin هستیم
            if (currentPath.includes('/admin/')) {
                return '../';
            }
            
            // اگر در root هستیم
            return './';
        } catch (error) {
            console.warn('خطا در تشخیص مسیر پایه:', error);
            return './';
        }
    }
    
    /**
     * بررسی آماده بودن DOM
     * Check DOM readiness
     */
    function whenDOMReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }
    
    /**
     * اضافه کردن observer برای عناصر جدید
     * Add observer for new elements
     */
    function observeNewElements() {
        if (!window.MutationObserver) {
            console.warn('MutationObserver پشتیبانی نمی‌شود');
            return;
        }
        
        try {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // اعمال فونت به عناصر جدید
                        mutation.addedNodes.forEach(function(node) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                applyFontToElement(node);
                            }
                        });
                    }
                });
            });
            
            if (document.body) {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        } catch (error) {
            console.warn('خطا در راه‌اندازی observer:', error);
        }
    }
    
    /**
     * اعمال فونت به عنصر خاص
     * Apply font to specific element
     */
    function applyFontToElement(element) {
        if (element && element.style) {
            try {
                element.style.fontFamily = "'Vazirmatn', 'Tahoma', 'Arial', sans-serif";
            } catch (error) {
                console.warn('خطا در اعمال فونت به عنصر:', error);
            }
        }
    }
    
    /**
     * تست بارگذاری فونت
     * Test font loading
     */
    function testFontLoading() {
        if (document.fonts && document.fonts.check) {
            const fontLoaded = document.fonts.check("1em Vazirmatn");
            if (fontLoaded) {
                console.log('✅ فونت وزیرمتن با موفقیت بارگذاری شد');
            } else {
                console.warn('⚠️ فونت وزیرمتن هنوز بارگذاری نشده - از فال‌بک استفاده می‌شود');
                
                // تلاش مجدد بعد از 2 ثانیه
                setTimeout(() => {
                    if (document.fonts.check("1em Vazirmatn")) {
                        console.log('✅ فونت وزیرمتن دیرهنگام بارگذاری شد');
                    }
                }, 2000);
            }
        }
    }
    
    /**
     * مقداردهی اولیه
     * Initialize
     */
    function init() {
        try {
            // اعمال فونت
            applyVazirmatnFont();
            
            // تست بارگذاری فونت
            setTimeout(testFontLoading, 100);
            
            // شروع نظارت بر عناصر جدید
            observeNewElements();
            
            // ایجاد متغیر سراسری برای دسترسی
            window.VazirmatnFontManager = {
                apply: applyVazirmatnFont,
                test: testFontLoading,
                applyToElement: applyFontToElement,
                version: '1.1.0'
            };
            
            console.log('✅ مدیر فونت وزیرمتن آماده شد');
            
        } catch (error) {
            console.error('خطا در مقداردهی فونت وزیرمتن:', error);
        }
    }
    
    // اجرای اولیه
    whenDOMReady(init);
    
})();