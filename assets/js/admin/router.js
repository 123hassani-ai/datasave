/**
 * ماژول Router
 * Route Management Module
 * 
 * @description: مدیریت مسیریابی و بارگذاری ماژول‌ها در داشبورد ادمین
 * @version: 1.0.0
 * @author: DataSave Team
 */

'use strict';

// وارد کردن ماژول‌های مورد نیاز
import EventManager from './utils/event-manager.js';
import Loader from './utils/loader.js';

/**
 * ماژول Router
 * Route Management Module
 */
const RouterModule = (function() {
    let routes = {};
    let currentRoute = null;
    let moduleCache = {}; // کش برای ماژول‌ها
    let isInitialized = false; // جلوگیری از مقداردهی مکرر
    
    /**
     * تنظیمات routeها
     */
    const routeConfig = {
        dashboard: { 
            title: 'داشبورد', 
            icon: 'fas fa-home',
            module: 'dashboard'
        },
        users: { 
            title: 'مدیریت کاربران', 
            icon: 'fas fa-users',
            module: 'users'
        },
        'data-management': { 
            title: 'مدیریت داده‌ها', 
            icon: 'fas fa-database',
            module: 'data-management'
        },
        forms: { 
            title: 'مدیریت فرم‌ها', 
            icon: 'fas fa-wpforms',
            module: 'forms'
        },
        customers: { 
            title: 'مشتریان', 
            icon: 'fas fa-user-friends',
            module: 'customers'
        },
        reports: { 
            title: 'گزارشات', 
            icon: 'fas fa-chart-bar',
            module: 'reports'
        },
        analytics: { 
            title: 'تحلیل داده‌ها', 
            icon: 'fas fa-chart-line',
            module: 'analytics'
        },
        settings: { 
            title: 'تنظیمات', 
            icon: 'fas fa-cog',
            module: 'settings'
        },
        'sms-settings': { 
            title: 'تنظیمات پیامک', 
            icon: 'fas fa-sms',
            module: 'sms-settings'
        },
        'ai-settings': { 
            title: 'تنظیمات هوش مصنوعی', 
            icon: 'fas fa-robot',
            module: 'ai-settings'
        },
        support: { 
            title: 'پشتیبانی', 
            icon: 'fas fa-life-ring',
            module: 'support'
        }
    };
    
    /**
     * مقداردهی اولیه router
     */
    function init() {
        // جلوگیری از مقداردهی مکرر
        if (isInitialized) {
            console.log('ℹ️ Router قبلاً مقداردهی شده است');
            return;
        }
        isInitialized = true;
        
        // تنظیم routeهای پیش‌فرض
        routes = routeConfig;
        
        // مدیریت تغییر URL
        window.addEventListener('popstate', handlePopState);
        
        // بررسی URL اولیه
        parseCurrentURL();
        
        console.log('✅ Router module initialized');
    }
    
    /**
     * بررسی URL اولیه
     */
    function parseCurrentURL() {
        const hash = window.location.hash;
        let routeId = 'dashboard';  // پیش‌فرض
        
        if (hash && hash.startsWith('#!')) {
            const requestedRoute = hash.substring(2);
            if (routes[requestedRoute]) {
                routeId = requestedRoute;
            }
        }
        
        // زمان‌بندی برای اطمینان از اینکه سایر ماژول‌ها به درستی مقداردهی شده‌اند
        setTimeout(() => {
            navigate(routeId, true);
        }, 100);
    }
    
    /**
     * ناوبری به route خاص
     * @param {string} routeId - شناسه مسیر
     * @param {boolean} isInitial - آیا این ناوبری اولیه است؟
     */
    async function navigate(routeId, isInitial = false) {
        try {
            // بررسی معتبر بودن route
            if (!routes[routeId]) {
                console.error(`Route not found: ${routeId}`);
                routeId = 'dashboard';  // بازگشت به داشبورد در صورت خطا
            }
            
            // اگر به همان صفحه ناوبری می‌کنیم (حتی در اولین بار)
            if (routeId === currentRoute) {
                if (!isInitial) {
                    console.log(`Already at ${routeId}`);
                }
                return;
            }
            
            // بارگذاری ماژول مربوطه
            const module = await loadModule(routeId);
            
            // بارگذاری محتوا
            await loadContent(module, routeId);
            
            // به‌روزرسانی URL (اگر ناوبری اولیه نیست)
            if (!isInitial) {
                updateURL(routeId);
            }
            
            currentRoute = routeId;
            
            // ارسال رویداد تغییر مسیر
            document.dispatchEvent(new CustomEvent('routeChanged', {
                detail: { 
                    routeId,
                    title: routes[routeId].title,
                    isInitial
                }
            }));
            
            console.log(`✅ Navigated to ${routeId}`);
        } catch (error) {
            console.error(`❌ Navigation failed for ${routeId}:`, error);
            if (routeId !== 'dashboard') {
                navigate('dashboard');  // بازگشت به داشبورد در صورت خطا
            } else {
                showErrorContent(error);
            }
        }
    }
    
    /**
     * بارگذاری ماژول
     */
    async function loadModule(routeId) {
        const route = routes[routeId];
        if (!route) {
            throw new Error(`Route not found: ${routeId}`);
        }
        
        // اگر ماژول در کش وجود دارد، از آن استفاده می‌کنیم
        if (moduleCache[routeId]) {
            return moduleCache[routeId];
        }
        
        try {
            // استفاده از import() برای بارگذاری داینامیک
            const modulePath = `./modules/${route.module}.js`;
            const module = await import(modulePath);
            
            // ذخیره در کش
            moduleCache[routeId] = module;
            
            return module;
        } catch (error) {
            console.error(`Failed to load module: ${route.module}.js`, error);
            throw new Error(`خطا در بارگذاری ماژول ${route.title}: ${error.message}`);
        }
    }
    
    /**
     * بارگذاری محتوا
     */
    async function loadContent(module, routeId) {
        const container = document.getElementById('contentContainer');
        if (!container) {
            throw new Error('Content container not found');
        }
        
        // انیمیشن خروج
        container.style.opacity = '0';
        container.style.transform = 'translateY(20px)';
        
        // انتظار برای انیمیشن
        await new Promise(resolve => setTimeout(resolve, 150));
        
        try {
            // فراخوانی تابع بارگذاری محتوای ماژول
            const content = await module.default.loadContent();
            container.innerHTML = content;
            
            // انیمیشن ورود
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
            
            // فراخوانی تابع مقداردهی اولیه ماژول
            if (module.default.init) {
                await module.default.init();
            }
        } catch (error) {
            container.innerHTML = generateErrorContent(error);
            throw error;
        }
    }
    
    /**
     * نمایش محتوای خطا
     */
    function showErrorContent(error) {
        const container = document.getElementById('contentContainer');
        if (!container) return;
        
        container.innerHTML = generateErrorContent(error);
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }
    
    /**
     * به‌روزرسانی URL
     */
    function updateURL(routeId) {
        const url = `#!/${routeId}`;
        history.pushState({ route: routeId }, '', url);
    }
    
    /**
     * مدیریت تغییر state
     */
    function handlePopState(event) {
        const routeId = event.state?.route || 'dashboard';
        navigate(routeId);
    }
    
    /**
     * تولید محتوای خطا
     */
    function generateErrorContent(error) {
        return `
            <div class="error-container">
                <h2>❌ خطا در بارگذاری صفحه</h2>
                <p>${error.message}</p>
                <button class="btn btn-primary" onclick="location.reload()">تلاش مجدد</button>
            </div>
        `;
    }
    
    // API عمومی
    return {
        init,
        navigate,
        getCurrentRoute: () => currentRoute,
        getRouteConfig: (routeId) => routes[routeId]
    };
})();

// صادر کردن ماژول
export default RouterModule;
