/**
 * سیستم لاگ‌گیری سبک و ساده برای DataSave
 * Simple and Lightweight Logging System for DataSave
 * 
 * @description سیستمی سبک برای لاگ‌گیری فقط در کنسول مرورگر
 * @author DataSave Team
 * @version 1.0.0
 */

'use strict';

/**
 * کلاس ساده لاگر
 * Simple Logger Class
 */
class SimpleLogger {
    constructor() {
        // سطوح لاگ
        this.levels = {
            DEBUG: 0,
            INFO: 1,
            WARN: 2,
            ERROR: 3,
            FATAL: 4
        };
        
        // پیکربندی پیش‌فرض
        this.config = {
            minLevel: 'INFO',
            showTimestamp: true,
            showPersianDate: true,
            enabled: true
        };
        
        // ایجاد متدهای عمومی
        this.createPublicMethods();
        
        // نمایش پیام خوش‌آمدگویی
        this.info('✅ سیستم لاگ‌گیری سبک بارگذاری شد');
    }
    
    /**
     * ایجاد متدهای عمومی برای لاگ‌گیری
     * Create public methods for logging
     */
    createPublicMethods() {
        Object.keys(this.levels).forEach(level => {
            this[level.toLowerCase()] = (message, data = null) => {
                this.log(level, message, data);
            };
        });
    }
    
    /**
     * لاگ‌گیری اصلی
     * Main logging function
     */
    log(level, message, data = null) {
        // بررسی فعال بودن سیستم
        if (!this.config.enabled) return;
        
        // بررسی سطح لاگ
        if (this.levels[level] < this.levels[this.config.minLevel]) return;
        
        // ایجاد پیام
        const logMessage = this.formatMessage(level, message);
        
        // نمایش در کنسول
        const consoleMethod = this.getConsoleMethod(level);
        if (data !== null) {
            console[consoleMethod](logMessage, data);
        } else {
            console[consoleMethod](logMessage);
        }
    }
    
    /**
     * قالب‌بندی پیام
     * Format message
     */
    formatMessage(level, message) {
        let formatted = '';
        
        // افزودن زمان
        if (this.config.showTimestamp) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            formatted += `[${timeString}] `;
        }
        
        // افزودن تاریخ فارسی
        if (this.config.showPersianDate) {
            const now = new Date();
            try {
                const persianDate = new Intl.DateTimeFormat('fa-IR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                }).format(now);
                formatted += `[${persianDate}] `;
            } catch (e) {
                // در صورت خطا، از تاریخ میلادی استفاده کن
                formatted += `[${now.toLocaleDateString('fa-IR')}] `;
            }
        }
        
        // افزودن سطح لاگ
        formatted += `[${level}] `;
        
        // افزودن پیام
        formatted += message;
        
        return formatted;
    }
    
    /**
     * دریافت متد مناسب کنسول
     * Get appropriate console method
     */
    getConsoleMethod(level) {
        switch (level) {
            case 'DEBUG':
                return 'debug';
            case 'INFO':
                return 'info';
            case 'WARN':
                return 'warn';
            case 'ERROR':
            case 'FATAL':
                return 'error';
            default:
                return 'log';
        }
    }
    
    /**
     * تنظیم سطح لاگ
     * Set log level
     */
    setLevel(level) {
        if (this.levels[level] !== undefined) {
            this.config.minLevel = level;
        }
    }
    
    /**
     * فعال/غیرفعال کردن لاگ‌گیری
     * Enable/disable logging
     */
    setEnabled(enabled) {
        this.config.enabled = enabled;
    }
    
    /**
     * تنظیم پیکربندی
     * Set configuration
     */
    configure(config) {
        this.config = { ...this.config, ...config };
    }
}

// ایجاد نمونه سراسری
if (typeof window !== 'undefined' && !window.Logger) {
    window.Logger = new SimpleLogger();
}

// صادرات برای استفاده در ماژول‌ها
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SimpleLogger };
}