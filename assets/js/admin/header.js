/**
 * Header JavaScript Module for Glassmorphism Admin Dashboard
 * ماژول JavaScript هدر برای داشبورد مدیریت شیشه‌ای
 * 
 * @description: مدیریت عملکرد هدر، toggle سایدبار و اعلانات
 * @version: 1.0.0
 * @author: DataSave Team
 */

'use strict';

/**
 * ماژول مدیریت هدر
 * Header Management Module
 */
const HeaderModule = (function() {
    let isInitialized = false;
    let sidebarCollapsed = false;
    let currentTheme = 'light';
    
    // تنظیمات پیش‌فرض
    const config = {
        selectors: {
            header: '.admin-header',
            sidebarToggle: '.sidebar-toggle',
            themeToggle: '.theme-toggle',
            searchInput: '.search-input',
            notificationBtn: '.notification-btn',
            actionBtns: '.action-btn'
        },
        classes: {
            sidebarCollapsed: 'sidebar-collapsed',
            darkTheme: 'dark-theme',
            headerHidden: 'header-hidden',
            headerFloating: 'header-floating'
        },
        breakpoints: {
            mobile: 768,
            tablet: 1024
        }
    };
    
    /**
     * مقداردهی اولیه هدر
     * Initialize header
     */
    function init() {
        if (isInitialized) {
            console.warn('Header module already initialized');
            return;
        }
        
        try {
            createHeaderHTML();
            attachEventListeners();
            setupResponsiveHandlers();
            loadThemePreference();
            updateNotificationCount();
            
            isInitialized = true;
            console.log('✅ Header module initialized successfully');
            
            // اطلاع‌رسانی به سایر ماژول‌ها
            document.dispatchEvent(new CustomEvent('headerReady', {
                detail: { module: 'header' }
            }));
            
        } catch (error) {
            console.error('❌ Header initialization failed:', error);
        }
    }
    
    /**
     * ایجاد HTML هدر
     * Create header HTML
     */
    function createHeaderHTML() {
        const headerHTML = `
            <header class="admin-header" id="adminHeader">
                <div class="header-content">
                    <!-- بخش چپ: نام برنامه و دکمه toggle (order: 1) -->
                    <div class="header-left">
                        <button class="sidebar-toggle" id="sidebarToggle" title="تغییر حالت سایدبار">
                            <i class="fas fa-bars"></i>
                        </button>
                        <a href="#" class="app-logo">
                            <div class="app-logo-icon">
                                <i class="fas fa-database"></i>
                            </div>
                            <span class="app-logo-text">DataSave</span>
                        </a>
                    </div>
                    
                    <!-- بخش راست: جستجو و عملیات (order: 3) -->
                    <div class="header-right">
                        <!-- نوار جستجو -->
                        <div class="header-search">
                            <input type="text" class="search-input" placeholder="جستجو در سیستم...">
                            <i class="fas fa-search search-icon"></i>
                        </div>
                        
                        <!-- دکمه‌های عمل -->
                        <div class="header-actions">
                            <!-- اعلانات -->
                            <button class="action-btn notification-btn" title="اعلانات">
                                <i class="fas fa-bell"></i>
                                <span class="notification-badge" id="notificationBadge">3</span>
                            </button>
                            
                            <!-- پیام‌ها -->
                            <button class="action-btn" title="پیام‌ها">
                                <i class="fas fa-envelope"></i>
                            </button>
                            
                            <!-- تنظیمات سریع -->
                            <button class="action-btn" title="تنظیمات سریع">
                                <i class="fas fa-cog"></i>
                            </button>
                            
                            <!-- تغییر تم -->
                            <button class="theme-toggle" id="themeToggle" title="تغییر تم">
                                <i class="fas fa-moon theme-icon"></i>
                                <span class="theme-text">تم تاریک</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        `;
        
        // اضافه کردن به ابتدای body
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
    }
    
    /**
     * اتصال رویدادهای کلیک
     * Attach event listeners
     */
    function attachEventListeners() {
        // دکمه toggle سایدبار
        const sidebarToggle = document.querySelector(config.selectors.sidebarToggle);
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', toggleSidebar);
        }
        
        // دکمه تغییر تم
        const themeToggle = document.querySelector(config.selectors.themeToggle);
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        
        // نوار جستجو
        const searchInput = document.querySelector(config.selectors.searchInput);
        if (searchInput) {
            searchInput.addEventListener('input', handleSearch);
            searchInput.addEventListener('keypress', handleSearchKeypress);
        }
        
        // دکمه اعلانات
        const notificationBtn = document.querySelector(config.selectors.notificationBtn);
        if (notificationBtn) {
            notificationBtn.addEventListener('click', toggleNotifications);
        }
        
        // سایر دکمه‌های عمل
        const actionBtns = document.querySelectorAll(config.selectors.actionBtns);
        actionBtns.forEach(btn => {
            btn.addEventListener('click', handleActionClick);
        });
        
        // رویداد اسکرول برای مخفی کردن هدر
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            handleScroll(lastScrollY);
            lastScrollY = window.scrollY;
        });
    }
    
    /**
     * toggle کردن سایدبار
     * Toggle sidebar
     */
    function toggleSidebar() {
        sidebarCollapsed = !sidebarCollapsed;
        
        // اعمال کلاس به body
        document.body.classList.toggle(config.classes.sidebarCollapsed, sidebarCollapsed);
        
        // انیمیشن دکمه toggle
        const toggleBtn = document.querySelector(config.selectors.sidebarToggle);
        if (toggleBtn) {
            const icon = toggleBtn.querySelector('i');
            icon.style.transform = sidebarCollapsed ? 'rotate(180deg)' : 'rotate(0deg)';
        }
        
        // ذخیره در localStorage
        localStorage.setItem('sidebarCollapsed', sidebarCollapsed);
        
        // اطلاع‌رسانی به سایر ماژول‌ها
        document.dispatchEvent(new CustomEvent('sidebarToggle', {
            detail: { collapsed: sidebarCollapsed }
        }));
        
        console.log(`Sidebar ${sidebarCollapsed ? 'collapsed' : 'expanded'}`);
    }
    
    /**
     * تغییر تم
     * Toggle theme
     */
    function toggleTheme() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // اعمال تم
        document.documentElement.setAttribute('data-theme', currentTheme);
        document.body.classList.toggle(config.classes.darkTheme, currentTheme === 'dark');
        
        // بروزرسانی آیکون و متن
        const themeToggle = document.querySelector(config.selectors.themeToggle);
        if (themeToggle) {
            const icon = themeToggle.querySelector('.theme-icon');
            const text = themeToggle.querySelector('.theme-text');
            
            if (currentTheme === 'dark') {
                icon.className = 'fas fa-sun theme-icon';
                text.textContent = 'تم روشن';
            } else {
                icon.className = 'fas fa-moon theme-icon';
                text.textContent = 'تم تاریک';
            }
        }
        
        // ذخیره در localStorage
        localStorage.setItem('theme', currentTheme);
        
        // اطلاع‌رسانی به سایر ماژول‌ها
        document.dispatchEvent(new CustomEvent('themeChange', {
            detail: { theme: currentTheme }
        }));
        
        console.log(`Theme switched to: ${currentTheme}`);
    }
    
    /**
     * مدیریت جستجو
     * Handle search
     */
    function handleSearch(event) {
        const query = event.target.value.trim();
        
        if (query.length >= 2) {
            // شبیه‌سازی جستجو
            console.log('Searching for:', query);
            
            // اطلاع‌رسانی به سایر ماژول‌ها
            document.dispatchEvent(new CustomEvent('searchQuery', {
                detail: { query: query }
            }));
        }
    }
    
    /**
     * مدیریت کلید enter در جستجو
     * Handle search keypress
     */
    function handleSearchKeypress(event) {
        if (event.key === 'Enter') {
            const query = event.target.value.trim();
            if (query) {
                console.log('Search submitted:', query);
                // اجرای جستجوی کامل
                performSearch(query);
            }
        }
    }
    
    /**
     * اجرای جستجو
     * Perform search
     */
    function performSearch(query) {
        // شبیه‌سازی جستجو
        console.log('Performing full search for:', query);
        
        // اطلاع‌رسانی به ماژول محتوا
        document.dispatchEvent(new CustomEvent('performSearch', {
            detail: { query: query }
        }));
    }
    
    /**
     * مدیریت اعلانات
     * Toggle notifications
     */
    function toggleNotifications() {
        console.log('Notifications clicked');
        
        // شبیه‌سازی بازکردن پنل اعلانات
        document.dispatchEvent(new CustomEvent('showNotifications'));
    }
    
    /**
     * مدیریت کلیک دکمه‌های عمل
     * Handle action button clicks
     */
    function handleActionClick(event) {
        const button = event.currentTarget;
        const icon = button.querySelector('i');
        
        if (icon) {
            const iconClass = icon.className;
            console.log('Action button clicked:', iconClass);
            
            // مدیریت بر اساس نوع آیکون
            if (iconClass.includes('envelope')) {
                document.dispatchEvent(new CustomEvent('showMessages'));
            } else if (iconClass.includes('cog')) {
                document.dispatchEvent(new CustomEvent('showQuickSettings'));
            }
        }
    }
    
    /**
     * مدیریت اسکرول
     * Handle scroll
     */
    function handleScroll(lastScrollY) {
        const currentScrollY = window.scrollY;
        const header = document.querySelector(config.selectors.header);
        
        if (!header) return;
        
        // مخفی کردن هدر هنگام اسکرول به پایین
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.classList.add(config.classes.headerHidden);
        } else {
            header.classList.remove(config.classes.headerHidden);
        }
        
        // افکت شناور برای هدر
        if (currentScrollY > 50) {
            header.classList.add(config.classes.headerFloating);
        } else {
            header.classList.remove(config.classes.headerFloating);
        }
    }
    
    /**
     * تنظیم responsive handlers
     * Setup responsive handlers
     */
    function setupResponsiveHandlers() {
        // بررسی اندازه صفحه هنگام تغییر
        window.addEventListener('resize', () => {
            const isMobile = window.innerWidth < config.breakpoints.mobile;
            
            if (isMobile && !sidebarCollapsed) {
                toggleSidebar(); // بستن خودکار سایدبار در موبایل
            }
        });
    }
    
    /**
     * بارگذاری تنظیمات تم
     * Load theme preference
     */
    function loadThemePreference() {
        const savedTheme = localStorage.getItem('theme');
        const savedSidebarState = localStorage.getItem('sidebarCollapsed');
        
        if (savedTheme && savedTheme !== currentTheme) {
            toggleTheme();
        }
        
        if (savedSidebarState === 'true' && !sidebarCollapsed) {
            toggleSidebar();
        }
    }
    
    /**
     * بروزرسانی تعداد اعلانات
     * Update notification count
     */
    function updateNotificationCount(count = null) {
        const badge = document.getElementById('notificationBadge');
        if (!badge) return;
        
        if (count === null) {
            // دریافت تعداد از سرور (شبیه‌سازی)
            count = Math.floor(Math.random() * 10);
        }
        
        if (count > 0) {
            badge.textContent = count > 99 ? '99+' : count;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
    
    /**
     * دریافت وضعیت فعلی
     * Get current state
     */
    function getState() {
        return {
            initialized: isInitialized,
            sidebarCollapsed: sidebarCollapsed,
            currentTheme: currentTheme
        };
    }
    
    /**
     * نمایش پیام در هدر
     * Show message in header
     */
    function showMessage(message, type = 'info') {
        const header = document.querySelector(config.selectors.header);
        if (!header) return;
        
        const messageEl = document.createElement('div');
        messageEl.className = `header-message header-message-${type}`;
        messageEl.textContent = message;
        
        header.appendChild(messageEl);
        
        // حذف خودکار بعد از 3 ثانیه
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 3000);
    }
    
    // API عمومی
    return {
        init: init,
        toggle: toggleSidebar,
        toggleTheme: toggleTheme,
        updateNotificationCount: updateNotificationCount,
        getState: getState,
        showMessage: showMessage
    };
})();

// بارگذاری خودکار هنگام آماده شدن DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', HeaderModule.init);
} else {
    HeaderModule.init();
}

// اتصال به window برای دسترسی سراسری
window.HeaderModule = HeaderModule;

console.log('✅ Header module loaded successfully');