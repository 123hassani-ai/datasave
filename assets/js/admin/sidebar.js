/**
 * Sidebar JavaScript Module for Glassmorphism Admin Dashboard
 * ماژول JavaScript سایدبار برای داشبورد مدیریت شیشه‌ای
 * 
 * @description: مدیریت منوها، پروفایل و ناوبری
 * @version: 1.0.0
 * @author: DataSave Team
 */

'use strict';

/**
 * ماژول مدیریت سایدبار
 * Sidebar Management Module
 */
const SidebarModule = (function() {
    let isInitialized = false;
    let currentActiveMenu = 'dashboard';
    let profileDropdownOpen = false;
    let isMobile = false;
    
    // تنظیمات پیش‌فرض
    const config = {
        selectors: {
            sidebar: '.admin-sidebar',
            menuLink: '.menu-link',
            profileCard: '.profile-card',
            profileDropdown: '.profile-dropdown',
            backdrop: '.sidebar-backdrop'
        },
        classes: {
            active: 'active',
            show: 'show',
            sidebarOpen: 'sidebar-open',
            sidebarCollapsed: 'sidebar-collapsed'
        },
        breakpoints: {
            mobile: 768
        }
    };
    
    // منوهای سیستم
    const menuItems = [
        {
            id: 'dashboard',
            title: 'داشبورد',
            icon: 'fas fa-home',
            badge: null,
            section: 'main'
        },
        {
            id: 'users',
            title: 'مدیریت کاربران',
            icon: 'fas fa-users',
            badge: '24',
            section: 'main'
        },
        {
            id: 'data-management',
            title: 'مدیریت داده‌ها',
            icon: 'fas fa-database',
            badge: 'جدید',
            section: 'main'
        },
        {
            id: 'forms',
            title: 'مدیریت فرم‌ها',
            icon: 'fas fa-wpforms',
            badge: null,
            section: 'main'
        },
        {
            id: 'customers',
            title: 'مشتریان',
            icon: 'fas fa-user-friends',
            badge: '156',
            section: 'main'
        },
        {
            id: 'reports',
            title: 'گزارشات',
            icon: 'fas fa-chart-bar',
            badge: null,
            section: 'analytics'
        },
        {
            id: 'analytics',
            title: 'تحلیل داده‌ها',
            icon: 'fas fa-chart-line',
            badge: null,
            section: 'analytics'
        },
        {
            id: 'settings',
            title: 'تنظیمات',
            icon: 'fas fa-cog',
            badge: null,
            section: 'system',
            submenu: [
                {
                    id: 'general-settings',
                    title: 'تنظیمات عمومی',
                    icon: 'fas fa-cog'
                },
                {
                    id: 'sms-settings',
                    title: 'تنظیمات پیامک',
                    icon: 'fas fa-envelope'
                },
                {
                    id: 'ai-settings',
                    title: 'تنظیمات هوش مصنوعی',
                    icon: 'fas fa-robot'
                }
            ]
        },
        {
            id: 'support',
            title: 'پشتیبانی',
            icon: 'fas fa-life-ring',
            badge: '5',
            section: 'system'
        }
    ];
    
    // اطلاعات کاربر
    const userInfo = {
        name: 'احمد محمدی',
        role: 'مدیر سیستم',
        avatar: 'ا',
        email: 'admin@datasave.com'
    };
    
    /**
     * مقداردهی اولیه سایدبار
     * Initialize sidebar
     */
    function init() {
        if (isInitialized) {
            console.warn('Sidebar module already initialized');
            return;
        }
        
        try {
            createSidebarHTML();
            attachEventListeners();
            setupResponsiveHandlers();
            setActiveMenu(currentActiveMenu);
            
            isInitialized = true;
            console.log('✅ Sidebar module initialized successfully');
            
            // اطلاع‌رسانی به سایر ماژول‌ها
            document.dispatchEvent(new CustomEvent('sidebarReady', {
                detail: { module: 'sidebar' }
            }));
            
        } catch (error) {
            console.error('❌ Sidebar initialization failed:', error);
        }
    }
    
    /**
     * ایجاد HTML سایدبار
     * Create sidebar HTML
     */
    function createSidebarHTML() {
        const sidebarHTML = `
            <aside class="admin-sidebar" id="adminSidebar">
                <div class="sidebar-content">
                    <!-- لوگوی برنامه -->
                    <div class="sidebar-logo">
                        <div class="sidebar-logo-content">
                            <div class="sidebar-logo-icon">
                                <i class="fas fa-database"></i>
                            </div>
                            <span class="sidebar-logo-text">DataSave</span>
                        </div>
                    </div>
                    
                    <!-- منوهای سایدبار -->
                    <nav class="sidebar-menu">
                        ${generateMenuSections()}
                    </nav>
                    
                    <!-- بخش پروفایل -->
                    <div class="sidebar-profile">
                        <div class="profile-card" id="profileCard">
                            <div class="profile-info">
                                <div class="profile-avatar">${userInfo.avatar}</div>
                                <div class="profile-details">
                                    <div class="profile-name">${userInfo.name}</div>
                                    <div class="profile-role">${userInfo.role}</div>
                                </div>
                                <i class="fas fa-chevron-up profile-dropdown-icon"></i>
                            </div>
                        </div>
                        
                        <!-- منوی کشویی پروفایل -->
                        <div class="profile-dropdown" id="profileDropdown">
                            <ul class="dropdown-menu">
                                <li class="dropdown-item">
                                    <a href="#" class="dropdown-link" data-action="profile-settings">
                                        <i class="fas fa-user-cog dropdown-icon"></i>
                                        <span>تنظیمات پروفایل کاربر</span>
                                    </a>
                                </li>
                                <li class="dropdown-item">
                                    <a href="#" class="dropdown-link" data-action="user-page">
                                        <i class="fas fa-user dropdown-icon"></i>
                                        <span>نمایش صفحه کاربر</span>
                                    </a>
                                </li>
                                <li class="dropdown-item">
                                    <a href="#" class="dropdown-link danger" data-action="logout">
                                        <i class="fas fa-sign-out-alt dropdown-icon"></i>
                                        <span>خروج</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </aside>
            
            <!-- بک‌دراپ برای موبایل -->
            <div class="sidebar-backdrop" id="sidebarBackdrop"></div>
        `;
        
        // اضافه کردن به body
        document.body.insertAdjacentHTML('beforeend', sidebarHTML);
    }
    
    /**
     * ایجاد بخش‌های منو
     * Generate menu sections
     */
    function generateMenuSections() {
        const sections = {
            main: 'منوی اصلی',
            analytics: 'تحلیل و گزارش',
            system: 'سیستم'
        };
        
        let html = '';
        
        Object.keys(sections).forEach(sectionKey => {
            const sectionItems = menuItems.filter(item => item.section === sectionKey);
            
            if (sectionItems.length > 0) {
                html += `
                    <div class="menu-section">
                        <div class="menu-section-title">${sections[sectionKey]}</div>
                        <ul class="menu-list">
                            ${sectionItems.map(item => generateMenuItem(item)).join('')}
                        </ul>
                    </div>
                `;
            }
        });
        
        return html;
    }
    
    /**
     * ایجاد آیتم منو
     * Generate menu item
     */
    function generateMenuItem(item) {
        const badgeHTML = item.badge ? `<span class="menu-badge">${item.badge}</span>` : '';
        const hasSubmenu = item.submenu && item.submenu.length > 0;
        const arrowHTML = hasSubmenu ? '<i class="fas fa-chevron-down menu-arrow"></i>' : '';
        const itemUrl = item.url || '#';
        
        let html = `
            <li class="menu-item ${hasSubmenu ? 'has-submenu' : ''}">
                <a href="${itemUrl}" class="menu-link" data-menu="${item.id}" data-tooltip="${item.title}">
                    <i class="${item.icon} menu-icon"></i>
                    <span class="menu-text">${item.title}</span>
                    ${badgeHTML}
                    ${arrowHTML}
                </a>`;
        
        if (hasSubmenu) {
            html += `
                <ul class="submenu">
                    ${item.submenu.map(subItem => `
                        <li class="submenu-item">
                            <a href="${subItem.url || '#'}" class="submenu-link" data-menu="${subItem.id}">
                                <i class="${subItem.icon} submenu-icon"></i>
                                <span class="submenu-text">${subItem.title}</span>
                            </a>
                        </li>
                    `).join('')}
                </ul>`;
        }
        
        html += '</li>';
        return html;
    }
    
    /**
     * اتصال رویدادهای کلیک
     * Attach event listeners
     */
    function attachEventListeners() {
        // منوهای سایدبار
        const menuLinks = document.querySelectorAll(config.selectors.menuLink);
        menuLinks.forEach(link => {
            link.addEventListener('click', handleMenuClick);
        });
        
        // منوهای فرعی
        const submenuLinks = document.querySelectorAll('.submenu-link');
        submenuLinks.forEach(link => {
            link.addEventListener('click', handleSubmenuClick);
        });
        
        // کارت پروفایل
        const profileCard = document.querySelector(config.selectors.profileCard);
        if (profileCard) {
            profileCard.addEventListener('click', toggleProfileDropdown);
        }
        
        // منوی کشویی پروفایل
        const dropdownLinks = document.querySelectorAll('.dropdown-link');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', handleProfileAction);
        });
        
        // بک‌دراپ موبایل
        const backdrop = document.querySelector(config.selectors.backdrop);
        if (backdrop) {
            backdrop.addEventListener('click', closeSidebar);
        }
        
        // بستن منوی پروفایل با کلیک خارج
        document.addEventListener('click', handleOutsideClick);
        
        // رویداد تغییر سایدبار از هدر
        document.addEventListener('sidebarToggle', handleSidebarToggle);
        
        // کلیدهای میانبر
        document.addEventListener('keydown', handleKeyboardShortcuts);
    }
    
    /**
     * مدیریت کلیک منوی فرعی
     * Handle submenu click
     */
    function handleSubmenuClick(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const link = event.currentTarget;
        const href = link.getAttribute('href');
        
        // بستن سایدبار در موبایل
        if (isMobile) {
            closeSidebar();
        }
        
        // انتقال به صفحه
        if (href && href !== '#') {
            window.location.href = href;
        }
        
        console.log('Submenu clicked:', href);
    }
    
    /**
     * مدیریت کلیک منو
     * Handle menu click
     */
    function handleMenuClick(event) {
        event.preventDefault();
        
        const link = event.currentTarget;
        const menuId = link.getAttribute('data-menu');
        const href = link.getAttribute('href');
        
        if (menuId) {
            setActiveMenu(menuId);
            
            // بستن سایدبار در موبایل
            if (isMobile) {
                closeSidebar();
            }
            
            // بررسی وجود URL برای انتقال
            const menuItem = menuItems.find(item => item.id === menuId);
            if (menuItem && menuItem.url && href !== '#') {
                // انتقال به صفحه جدید
                window.location.href = href;
                return;
            }
            
            // اطلاع‌رسانی به ماژول محتوا برای منوهای داخلی
            document.dispatchEvent(new CustomEvent('menuChange', {
                detail: { 
                    menuId: menuId,
                    title: link.querySelector('.menu-text')?.textContent || menuId
                }
            }));
            
            console.log('Menu changed to:', menuId);
        }
    }
    
    /**
     * تنظیم منوی فعال
     * Set active menu
     */
    function setActiveMenu(menuId) {
        // حذف کلاس active از همه منوها
        const menuLinks = document.querySelectorAll(config.selectors.menuLink);
        menuLinks.forEach(link => {
            link.classList.remove(config.classes.active);
        });
        
        // اضافه کردن کلاس active به منوی انتخابی
        const activeLink = document.querySelector(`[data-menu="${menuId}"]`);
        if (activeLink) {
            activeLink.classList.add(config.classes.active);
            currentActiveMenu = menuId;
            
            // ذخیره در localStorage
            localStorage.setItem('activeMenu', menuId);
        }
    }
    
    /**
     * toggle منوی پروفایل
     * Toggle profile dropdown
     */
    function toggleProfileDropdown(event) {
        event.stopPropagation();
        
        const profileCard = event.currentTarget;
        const dropdown = document.querySelector(config.selectors.profileDropdown);
        
        if (!dropdown) return;
        
        profileDropdownOpen = !profileDropdownOpen;
        
        // تغییر وضعیت UI
        profileCard.classList.toggle(config.classes.active, profileDropdownOpen);
        dropdown.classList.toggle(config.classes.show, profileDropdownOpen);
        
        // انیمیشن
        if (profileDropdownOpen) {
            dropdown.style.animation = 'slideDown 0.3s ease-out';
        }
        
        console.log('Profile dropdown:', profileDropdownOpen ? 'opened' : 'closed');
    }
    
    /**
     * مدیریت عملیات پروفایل
     * Handle profile actions
     */
    function handleProfileAction(event) {
        event.preventDefault();
        
        const link = event.currentTarget;
        const action = link.getAttribute('data-action');
        
        // بستن منوی کشویی
        closeProfileDropdown();
        
        switch (action) {
            case 'profile-settings':
                handleProfileSettings();
                break;
            case 'user-page':
                handleUserPage();
                break;
            case 'logout':
                handleLogout();
                break;
            default:
                console.warn('Unknown profile action:', action);
        }
    }
    
    /**
     * تنظیمات پروفایل
     * Profile settings
     */
    function handleProfileSettings() {
        console.log('Opening profile settings...');
        
        // اطلاع‌رسانی به ماژول محتوا
        document.dispatchEvent(new CustomEvent('showProfileSettings', {
            detail: { userInfo: userInfo }
        }));
    }
    
    /**
     * صفحه کاربر
     * User page
     */
    function handleUserPage() {
        console.log('Opening user page...');
        
        // اطلاع‌رسانی به ماژول محتوا
        document.dispatchEvent(new CustomEvent('showUserPage', {
            detail: { userInfo: userInfo }
        }));
    }
    
    /**
     * خروج از سیستم
     * Logout
     */
    function handleLogout() {
        const confirmLogout = confirm('آیا مطمئن هستید که می‌خواهید از سیستم خارج شوید؟');
        
        if (confirmLogout) {
            console.log('Logging out...');
            
            // پاک کردن localStorage
            localStorage.removeItem('activeMenu');
            localStorage.removeItem('sidebarCollapsed');
            localStorage.removeItem('theme');
            
            // انیمیشن خروج
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease-out';
            
            // شبیه‌سازی خروج
            setTimeout(() => {
                alert('شما با موفقیت از سیستم خارج شدید.');
                location.reload();
            }, 500);
        }
    }
    
    /**
     * بستن منوی پروفایل
     * Close profile dropdown
     */
    function closeProfileDropdown() {
        const profileCard = document.querySelector(config.selectors.profileCard);
        const dropdown = document.querySelector(config.selectors.profileDropdown);
        
        if (profileCard && dropdown) {
            profileCard.classList.remove(config.classes.active);
            dropdown.classList.remove(config.classes.show);
            profileDropdownOpen = false;
        }
    }
    
    /**
     * مدیریت کلیک خارج از منو
     * Handle outside click
     */
    function handleOutsideClick(event) {
        const profileCard = document.querySelector(config.selectors.profileCard);
        const dropdown = document.querySelector(config.selectors.profileDropdown);
        
        if (profileDropdownOpen && profileCard && dropdown) {
            if (!profileCard.contains(event.target) && !dropdown.contains(event.target)) {
                closeProfileDropdown();
            }
        }
    }
    
    /**
     * مدیریت تغییر سایدبار از هدر
     * Handle sidebar toggle from header
     */
    function handleSidebarToggle(event) {
        const collapsed = event.detail.collapsed;
        
        // بستن منوی پروفایل در حالت جمع‌شده
        if (collapsed && profileDropdownOpen) {
            closeProfileDropdown();
        }
    }
    
    /**
     * باز کردن سایدبار (موبایل)
     * Open sidebar (mobile)
     */
    function openSidebar() {
        document.body.classList.add(config.classes.sidebarOpen);
        isMobile = window.innerWidth < config.breakpoints.mobile;
    }
    
    /**
     * بستن سایدبار (موبایل)
     * Close sidebar (mobile)
     */
    function closeSidebar() {
        document.body.classList.remove(config.classes.sidebarOpen);
    }
    
    /**
     * تنظیم responsive handlers
     * Setup responsive handlers
     */
    function setupResponsiveHandlers() {
        window.addEventListener('resize', () => {
            isMobile = window.innerWidth < config.breakpoints.mobile;
            
            // بستن خودکار در دسکتاپ
            if (!isMobile) {
                closeSidebar();
            }
        });
        
        // بررسی اولیه
        isMobile = window.innerWidth < config.breakpoints.mobile;
    }
    
    /**
     * مدیریت کلیدهای میانبر
     * Handle keyboard shortcuts
     */
    function handleKeyboardShortcuts(event) {
        // Escape برای بستن منوها
        if (event.key === 'Escape') {
            if (profileDropdownOpen) {
                closeProfileDropdown();
            } else if (isMobile && document.body.classList.contains(config.classes.sidebarOpen)) {
                closeSidebar();
            }
        }
        
        // کلیدهای عددی برای انتخاب منو (Ctrl + 1-8)
        if (event.ctrlKey && event.key >= '1' && event.key <= '8') {
            event.preventDefault();
            const menuIndex = parseInt(event.key) - 1;
            if (menuItems[menuIndex]) {
                setActiveMenu(menuItems[menuIndex].id);
            }
        }
    }
    
    /**
     * بروزرسانی نشان منو
     * Update menu badge
     */
    function updateMenuBadge(menuId, badgeText) {
        const menuLink = document.querySelector(`[data-menu="${menuId}"]`);
        if (!menuLink) return;
        
        let badge = menuLink.querySelector('.menu-badge');
        
        if (badgeText && badgeText !== '0') {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'menu-badge';
                menuLink.appendChild(badge);
            }
            badge.textContent = badgeText;
        } else if (badge) {
            badge.remove();
        }
    }
    
    /**
     * دریافت منوی فعال
     * Get active menu
     */
    function getActiveMenu() {
        return currentActiveMenu;
    }
    
    /**
     * دریافت اطلاعات کاربر
     * Get user info
     */
    function getUserInfo() {
        return { ...userInfo };
    }
    
    /**
     * بروزرسانی اطلاعات کاربر
     * Update user info
     */
    function updateUserInfo(newInfo) {
        Object.assign(userInfo, newInfo);
        
        // بروزرسانی UI
        const profileName = document.querySelector('.profile-name');
        const profileRole = document.querySelector('.profile-role');
        const profileAvatar = document.querySelector('.profile-avatar');
        
        if (profileName) profileName.textContent = userInfo.name;
        if (profileRole) profileRole.textContent = userInfo.role;
        if (profileAvatar) profileAvatar.textContent = userInfo.avatar;
    }
    
    // بارگذاری منوی ذخیره شده
    function loadSavedMenu() {
        const savedMenu = localStorage.getItem('activeMenu');
        if (savedMenu && menuItems.find(item => item.id === savedMenu)) {
            currentActiveMenu = savedMenu;
        }
    }
    
    // API عمومی
    return {
        init: init,
        setActiveMenu: setActiveMenu,
        getActiveMenu: getActiveMenu,
        updateMenuBadge: updateMenuBadge,
        getUserInfo: getUserInfo,
        updateUserInfo: updateUserInfo,
        openSidebar: openSidebar,
        closeSidebar: closeSidebar
    };
})();

// بارگذاری خودکار هنگام آماده شدن DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', SidebarModule.init);
} else {
    SidebarModule.init();
}

// اتصال به window برای دسترسی سراسری
window.SidebarModule = SidebarModule;

console.log('✅ Sidebar module loaded successfully');