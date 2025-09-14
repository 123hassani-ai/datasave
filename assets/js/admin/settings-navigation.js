/**
 * مدیریت ناوبری صفحات تنظیمات - Settings Navigation Manager
 * @description مدیریت انتقال بین صفحات مختلف تنظیمات
 * @version 1.0.0
 * @author DataSave Team
 */

'use strict';

/**
 * کلاس مدیریت ناوبری تنظیمات
 */
class SettingsNavigation {
    
    /**
     * لیست صفحات تنظیمات موجود
     */
    static pages = {
        main: {
            url: 'pages/settings.html',
            title: 'تنظیمات سیستم',
            icon: 'fas fa-cog'
        },
        sms: {
            url: 'pages/sms-settings.html',
            title: 'تنظیمات پیامک',
            icon: 'fas fa-envelope'
        },
        general: {
            url: 'pages/general-settings.html',
            title: 'تنظیمات عمومی',
            icon: 'fas fa-cog'
        },
        security: {
            url: 'pages/security-settings.html',
            title: 'تنظیمات امنیتی',
            icon: 'fas fa-shield-alt'
        },
        backup: {
            url: 'pages/backup-settings.html',
            title: 'پشتیبان‌گیری',
            icon: 'fas fa-database'
        },
        api: {
            url: 'pages/api-settings.html',
            title: 'تنظیمات API',
            icon: 'fas fa-code'
        },
        users: {
            url: 'pages/user-settings.html',
            title: 'تنظیمات کاربران',
            icon: 'fas fa-users'
        }
    };
    
    /**
     * انتقال به صفحه تنظیمات مشخص
     * @param {string} pageKey - کلید صفحه مورد نظر
     */
    static navigateTo(pageKey) {
        try {
            const page = this.pages[pageKey];
            if (!page) {
                console.warn(`صفحه ${pageKey} یافت نشد`);
                return false;
            }
            
            // بررسی اینکه آیا در صفحه فعلی هستیم یا خیر
            const currentPath = window.location.pathname;
            if (currentPath.includes(page.url)) {
                console.log('در حال حاضر در این صفحه هستید');
                return true;
            }
            
            // انتقال به صفحه جدید
            window.location.href = page.url;
            return true;
            
        } catch (error) {
            console.error('خطا در انتقال به صفحه:', error);
            return false;
        }
    }
    
    /**
     * بازگشت به صفحه اصلی تنظیمات
     */
    static goBack() {
        this.navigateTo('main');
    }
    
    /**
     * دریافت اطلاعات صفحه فعلی
     */
    static getCurrentPage() {
        const currentPath = window.location.pathname;
        
        for (const [key, page] of Object.entries(this.pages)) {
            if (currentPath.includes(page.url)) {
                return {
                    key: key,
                    ...page
                };
            }
        }
        
        return null;
    }
    
    /**
     * ایجاد breadcrumb برای صفحه فعلی
     */
    static createBreadcrumb() {
        const currentPage = this.getCurrentPage();
        if (!currentPage) return '';
        
        let breadcrumb = `
            <nav class="breadcrumb">
                <a href="../index.html" class="breadcrumb-item">
                    <i class="fas fa-home"></i>
                    داشبورد
                </a>
                <span class="breadcrumb-separator">/</span>
        `;
        
        // اگر در صفحه اصلی تنظیمات نیستیم، لینک تنظیمات را اضافه می‌کنیم
        if (currentPage.key !== 'main') {
            breadcrumb += `
                <a href="settings.html" class="breadcrumb-item">
                    <i class="fas fa-cog"></i>
                    تنظیمات سیستم
                </a>
                <span class="breadcrumb-separator">/</span>
            `;
        }
        
        breadcrumb += `
                <span class="breadcrumb-current">
                    <i class="${currentPage.icon}"></i>
                    ${currentPage.title}
                </span>
            </nav>
        `;
        
        return breadcrumb;
    }
    
    /**
     * اضافه کردن breadcrumb به صفحه
     */
    static addBreadcrumb() {
        const breadcrumb = this.createBreadcrumb();
        if (!breadcrumb) return;
        
        // جستجو برای container مناسب
        const container = document.querySelector('.settings-container') || 
                         document.querySelector('.sms-settings-container') ||
                         document.querySelector('body > div:first-child');
        
        if (container) {
            container.insertAdjacentHTML('afterbegin', breadcrumb);
        }
    }
    
    /**
     * اضافه کردن دکمه بازگشت
     */
    static addBackButton() {
        const currentPage = this.getCurrentPage();
        if (!currentPage || currentPage.key === 'main') return;
        
        const backButton = `
            <button onclick="SettingsNavigation.goBack()" class="back-button">
                <i class="fas fa-arrow-right"></i>
                بازگشت به تنظیمات
            </button>
        `;
        
        // جستجو برای مکان مناسب
        const header = document.querySelector('h1') || document.querySelector('.settings-title');
        if (header) {
            header.insertAdjacentHTML('beforebegin', backButton);
        }
    }
    
    /**
     * مقداردهی اولیه
     */
    static init() {
        try {
            // اضافه کردن استایل‌های مورد نیاز
            this.addStyles();
            
            // اضافه کردن breadcrumb
            this.addBreadcrumb();
            
            // اضافه کردن دکمه بازگشت
            this.addBackButton();
            
            console.log('SettingsNavigation آماده شد');
            
        } catch (error) {
            console.error('خطا در مقداردهی SettingsNavigation:', error);
        }
    }
    
    /**
     * اضافه کردن استایل‌های مورد نیاز
     */
    static addStyles() {
        const styles = `
            <style>
                .breadcrumb {
                    display: flex;
                    align-items: center;
                    margin-bottom: var(--spacing-6);
                    padding: var(--spacing-3) var(--spacing-4);
                    background: var(--glass-bg-light);
                    border-radius: var(--radius-lg);
                    font-size: var(--font-size-sm);
                }
                
                .breadcrumb-item {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-2);
                    color: var(--text-secondary);
                    text-decoration: none;
                    transition: color var(--transition-fast);
                }
                
                .breadcrumb-item:hover {
                    color: var(--primary-color);
                }
                
                .breadcrumb-separator {
                    margin: 0 var(--spacing-3);
                    color: var(--text-tertiary);
                }
                
                .breadcrumb-current {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-2);
                    color: var(--text-primary);
                    font-weight: var(--font-weight-medium);
                }
                
                .back-button {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-2);
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: var(--radius-md);
                    padding: var(--spacing-2) var(--spacing-4);
                    color: var(--text-secondary);
                    cursor: pointer;
                    transition: all var(--transition-fast);
                    margin-bottom: var(--spacing-4);
                    font-family: inherit;
                }
                
                .back-button:hover {
                    background: var(--glass-bg-hover);
                    color: var(--primary-color);
                    transform: translateX(2px);
                }
                
                .back-button i {
                    font-size: var(--font-size-sm);
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
}

// اتصال به window برای دسترسی سراسری
window.SettingsNavigation = SettingsNavigation;

// مقداردهی خودکار
document.addEventListener('DOMContentLoaded', function() {
    SettingsNavigation.init();
});

console.log('✅ Settings Navigation loaded successfully');