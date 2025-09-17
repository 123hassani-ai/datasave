/**
 * DataSave Admin Dashboard - Main Entry Point
 * @description نقطه ورود اصلی داشبورد ادمین - مقداردهی و هماهنگی تمام ماژول‌ها
 * @author DataSave Team
 * @version 1.0.0
 */

'use strict';

// وارد کردن ماژول‌های اصلی
import ContentModule from './content.js';
import RouterModule from './router.js';
import EventManager from './utils/event-manager.js';
import Loader from './utils/loader.js';

/**
 * Main admin application controller
 * کنترلر اصلی اپلیکیشن ادمین
 */
const AdminMain = {
    // حالت اپلیکیشن
    // Application state
    state: {
        isInitialized: false,
        currentModule: null,
        loadingOverlay: null,
        initStartTime: null,
        modules: []
    },

    // تنظیمات اپلیکیشن
    // Application configuration
    config: {
        loadingMinDuration: 1000,
        initTimeout: 10000,
        version: '1.0.0',
        buildDate: new Date().toISOString()
    },

    // Safe logger instance
    log: null,

    /**
     * مقداردهی اصلی اپلیکیشن
     * Initialize main application
     */
    async init() {
        // جلوگیری از اجرای مکرر
        if (this.state.isInitialized) {
            console.log('ℹ️ AdminMain قبلاً مقداردهی شده است');
            return;
        }
        
        // فلگ را بلافاصله set می‌کنیم
        this.state.isInitialized = true;
        
        // Initialize safe logger
        if (window.SafeLogger) {
            this.log = window.SafeLogger.create('ADMIN-MAIN');
        } else {
            // Create a fallback logger if SafeLogger is not available
            this.log = {
                info: (...args) => console.log('[INFO]', ...args),
                warn: (...args) => console.warn('[WARN]', ...args),
                error: (...args) => console.error('[ERROR]', ...args),
                fatal: (...args) => console.error('[FATAL]', ...args),
                debug: (...args) => console.debug('[DEBUG]', ...args),
                trace: (...args) => console.trace('[TRACE]', ...args)
            };
        }
        
        this.state.initStartTime = performance.now();
        
        try {
            this.log.info('🚀 شروع AdminMain', {
                version: this.config.version
            });

            // نمایش loading
            // Show loading overlay
            this.showLoadingOverlay();

            // انتظار برای حداقل مدت loading
            // Wait for minimum loading duration
            const initPromise = this.performInitialization();
            const minTimePromise = this.waitMinimumTime();

            await Promise.all([initPromise, minTimePromise]);

            // پنهان کردن loading
            // Hide loading overlay
            this.hideLoadingOverlay();

            // تکمیل مقداردهی
            // Complete initialization
            this.completeInitialization();

            this.log.info('✅ AdminMain آماده شد', {
                duration: Math.round(performance.now() - this.state.initStartTime),
                modules: this.state.modules.length
            });

        } catch (error) {
            this.log.error('خطا در مقداردهی اپلیکیشن ادمین', error);
            this.handleInitializationError(error);
        }
    },

    /**
     * انجام فرآیند مقداردهی
     * Perform initialization process
     */
    async performInitialization() {
        // مرحله 1: مقداردهی ماژول‌های اصلی
        // Step 1: Initialize core modules
        await this.initializeCoreModules();

        // مرحله 2: مقداردهی ماژول‌های رابط کاربری
        // Step 2: Initialize UI modules
        await this.initializeUIModules();

        // مرحله 3: مقداردهی ماژول‌های داده
        // Step 3: Initialize data modules
        await this.initializeDataModules();

        // مرحله 4: اتصال رویدادهای global
        // Step 4: Bind global events
        this.bindGlobalEvents();

        // مرحله 5: بارگذاری محتوای اولیه
        // Step 5: Load initial content
        await this.loadInitialContent();
    },

    /**
     * مقداردهی ماژول‌های اصلی
     * Initialize core modules
     */
    async initializeCoreModules() {
        this.log.info('مقداردهی ماژول‌های اصلی...');

        // بررسی وجود Logger
        if (typeof Logger === 'undefined') {
            console.warn('Logger module not found');
        } else {
            this.state.modules.push('Logger');
            this.log.info('ماژول Logger آماده است');
        }

        // بررسی وجود AdminUtils
        if (typeof AdminUtils !== 'undefined') {
            this.state.modules.push('AdminUtils');
            this.log.info('ماژول AdminUtils آماده است');
        }

        return Promise.resolve();
    },

    /**
     * مقداردهی ماژول‌های رابط کاربری
     * Initialize UI modules
     */
    async initializeUIModules() {
        this.log.info('مقداردهی ماژول‌های رابط کاربری...');

        // ماژول‌های وارد شده با ES Modules
        const esModules = [
            { name: 'ContentModule', module: ContentModule }
        ];
        
        // ماژول‌های سنتی که در window قرار می‌گیرند
        const legacyModules = [
            { name: 'HeaderModule', module: window.HeaderModule },
            { name: 'SidebarModule', module: window.SidebarModule }
        ];
        
        // مقداردهی ماژول‌های ES
        for (const { name, module } of esModules) {
            if (module && typeof module.init === 'function') {
                try {
                    await module.init();
                    this.state.modules.push(name);
                    this.log.info(`ماژول ${name} با موفقیت مقداردهی شد`);
                } catch (error) {
                    this.log.error(`خطا در مقداردهی ماژول ${name}`, error);
                }
            } else {
                this.log.warn(`ماژول ${name} یافت نشد یا تابع init ندارد`);
            }
        }
        
        // مقداردهی ماژول‌های سنتی
        for (const { name, module } of legacyModules) {
            if (module && typeof module.init === 'function') {
                try {
                    await module.init();
                    this.state.modules.push(name);
                    this.log.info(`ماژول ${name} با موفقیت مقداردهی شد`);
                } catch (error) {
                    this.log.error(`خطا در مقداردهی ماژول ${name}`, error);
                }
            } else {
                // هشدار نمی‌دهیم چون ممکن است این ماژول‌ها هنوز در حال بارگذاری باشند
                this.log.debug(`ماژول ${name} هنوز آماده نیست`);
            }
        }

        return Promise.resolve();
    },

    /**
     * مقداردهی ماژول‌های داده
     * Initialize data modules
     */
    async initializeDataModules() {
        this.log.info('مقداردهی ماژول‌های داده...');

        // مقداردهی ماژول روتر
        if (RouterModule && typeof RouterModule.init === 'function') {
            try {
                await RouterModule.init();
                this.state.modules.push('RouterModule');
                this.log.info('ماژول RouterModule با موفقیت مقداردهی شد');
            } catch (error) {
                this.log.error('خطا در مقداردهی ماژول RouterModule', error);
            }
        } else {
            this.log.warn('ماژول RouterModule یافت نشد یا تابع init ندارد');
        }

        // مقداردهی ماژول داشبورد سنتی (اگر وجود داشته باشد)
        if (typeof window.AdminDashboard !== 'undefined') {
            try {
                await window.AdminDashboard.init();
                this.state.modules.push('AdminDashboard');
                this.log.info('ماژول AdminDashboard با موفقیت مقداردهی شد');
            } catch (error) {
                this.log.error('خطا در مقداردهی ماژول AdminDashboard', error);
            }
        }

        return Promise.resolve();
    },

    /**
     * اتصال رویدادهای global
     * Bind global events
     */
    bindGlobalEvents() {
        this.log.info('اتصال رویدادهای global...');

        // حذف global error handlers از اینجا چون در logging.js مدیریت می‌شوند
        // Global error handlers removed - managed in logging.js

        // رویداد تغییر اتصال اینترنت
        // Network connectivity events
        window.addEventListener('online', this.handleNetworkOnline.bind(this));
        window.addEventListener('offline', this.handleNetworkOffline.bind(this));

        // رویداد visibility change
        // Page visibility change
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

        // رویداد کلیدهای میانبر
        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleGlobalKeydown.bind(this));

        // رویداد beforeunload
        // Before unload event
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    },

    /**
     * بارگذاری محتوای اولیه
     * Load initial content
     */
    async loadInitialContent() {
        this.log.info('بارگذاری محتوای اولیه...');

        // بارگذاری صفحه پیش‌فرض (داشبورد)
        // Load default page (dashboard)
        if (window.AdminContent) {
            await AdminContent.loadPage('dashboard');
        }

        return Promise.resolve();
    },

    /**
     * انتظار برای حداقل زمان loading
     * Wait for minimum loading time
     */
    async waitMinimumTime() {
        const elapsed = performance.now() - this.state.initStartTime;
        const remaining = Math.max(0, this.config.loadingMinDuration - elapsed);
        
        if (remaining > 0) {
            await new Promise(resolve => setTimeout(resolve, remaining));
        }
    },

    /**
     * نمایش overlay loading
     * Show loading overlay
     */
    showLoadingOverlay() {
        this.state.loadingOverlay = document.getElementById('loadingOverlay');
        if (this.state.loadingOverlay) {
            this.state.loadingOverlay.style.display = 'flex';
            this.state.loadingOverlay.classList.add('show');
        }
    },

    /**
     * پنهان کردن overlay loading
     * Hide loading overlay
     */
    hideLoadingOverlay() {
        if (this.state.loadingOverlay) {
            this.state.loadingOverlay.classList.add('fade-out');
            setTimeout(() => {
                if (this.state.loadingOverlay) {
                    this.state.loadingOverlay.style.display = 'none';
                    this.state.loadingOverlay.classList.remove('show', 'fade-out');
                }
            }, 500);
        }
    },

    /**
     * تکمیل مقداردهی
     * Complete initialization
     */
    completeInitialization() {
        // flag قبلاً در init set شده است
        // this.state.isInitialized = true;
        
        // ارسال رویداد initialized
        // Dispatch initialized event
        const event = new CustomEvent('adminInitialized', {
            detail: {
                modules: this.state.modules,
                duration: performance.now() - this.state.initStartTime,
                version: this.config.version
            }
        });
        document.dispatchEvent(event);

        // نمایش پیام خوش‌آمدگویی
        // Show welcome message
        this.showWelcomeMessage();
    },

    /**
     * نمایش پیام خوش‌آمدگویی
     * Show welcome message
     */
    showWelcomeMessage() {
        if (window.AdminUtils) {
            AdminUtils.showToast('خوش آمدید به پنل مدیریت DataSave', 'success', {
                duration: 3000,
                position: 'top-right'
            });
        }
    },

    /**
     * مدیریت خطای مقداردهی
     * Handle initialization error
     * @param {Error} error - خطا
     */
    handleInitializationError(error) {
        this.log.fatal('خطای مهلک در مقداردهی اپلیکیشن', error);
        
        this.hideLoadingOverlay();
        
        // نمایش صفحه خطا
        // Show error page
        document.body.innerHTML = `
            <div class="init-error-page">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-6 text-center">
                            <div class="error-content">
                                <i class="fas fa-exclamation-triangle fa-4x text-danger mb-4"></i>
                                <h2>خطا در بارگذاری اپلیکیشن</h2>
                                <p class="text-muted mb-4">متأسفانه خطایی در بارگذاری اپلیکیشن رخ داده است.</p>
                                <div class="error-details">
                                    <code>${error.message}</code>
                                </div>
                                <button class="btn btn-primary mt-3" onclick="location.reload()">
                                    <i class="fas fa-refresh me-2"></i>
                                    تلاش مجدد
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * مدیریت آنلاین شدن
     * Handle network online
     */
    handleNetworkOnline() {
        this.log.info('اتصال اینترنت برقرار شد');
        if (window.AdminUtils) {
            AdminUtils.showToast('اتصال اینترنت برقرار شد', 'success');
        }
    },

    /**
     * مدیریت آفلاین شدن
     * Handle network offline
     */
    handleNetworkOffline() {
        this.log.warn('اتصال اینترنت قطع شد');
        if (window.AdminUtils) {
            AdminUtils.showToast('اتصال اینترنت قطع شد', 'warning');
        }
    },

    /**
     * مدیریت تغییر visibility
     * Handle visibility change
     */
    handleVisibilityChange() {
        if (document.hidden) {
            this.log.info('صفحه مخفی شد');
        } else {
            this.log.info('صفحه نمایان شد');
        }
    },

    /**
     * مدیریت کلیدهای global
     * Handle global keydown
     * @param {KeyboardEvent} event - رویداد کلید
     */
    handleGlobalKeydown(event) {
        // Ctrl/Cmd + Shift + L: نمایش پنل لاگ
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'L') {
            event.preventDefault();
            if (window.loggerAdmin && typeof window.loggerAdmin.showPanel === 'function') {
                window.loggerAdmin.showPanel();
            }
        }

        // F5: رفرش صفحه
        if (event.key === 'F5') {
            this.log.info('رفرش صفحه با F5');
        }

        // Escape: بستن modal/panel های باز
        if (event.key === 'Escape') {
            // بستن منوهای باز
            document.querySelectorAll('.dropdown.show').forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        }
    },

    /**
     * مدیریت before unload
     * Handle before unload
     * @param {BeforeUnloadEvent} event - رویداد
     */
    handleBeforeUnload(event) {
        this.log.info('در حال خروج از اپلیکیشن');
        
        // پاکسازی منابع
        // Cleanup resources
        this.cleanup();
    },

    /**
     * پاکسازی منابع
     * Cleanup resources
     */
    cleanup() {
        this.log.info('پاکسازی منابع اپلیکیشن');

        // پاکسازی ماژول داشبورد
        if (window.AdminDashboard && typeof AdminDashboard.cleanup === 'function') {
            AdminDashboard.cleanup();
        }

        // پاکسازی سایر ماژول‌ها
        // Cleanup other modules
        // Additional cleanup logic here
    },

    /**
     * دریافت اطلاعات اپلیکیشن
     * Get application info
     * @returns {Object} اطلاعات اپلیکیشن
     */
    getAppInfo() {
        return {
            name: 'DataSave Admin Dashboard',
            version: this.config.version,
            buildDate: this.config.buildDate,
            modules: this.state.modules,
            isInitialized: this.state.isInitialized,
            initDuration: this.state.initStartTime ? performance.now() - this.state.initStartTime : null
        };
    }
};

// صادر کردن به عنوان ماژول پیش‌فرض
export default AdminMain;

// مقداردهی خودکار هنگام بارگذاری DOM
// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        AdminMain.init();
    });
} else {
    // DOM already loaded
    AdminMain.init();
}

// صادرات برای استفاده در ماژول‌ها
// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminMain;
}