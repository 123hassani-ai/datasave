/**
 * Content JavaScript Module for Glassmorphism Admin Dashboard
 * ماژول JavaScript محتوا برای داشبورد مدیریت شیشه‌ای
 * 
 * @description: مدیریت محتوای دینامیک، روتینگ و کارت‌های آماری
 * @version: 2.0.0
 * @author: DataSave Team
 */

'use strict';

// وارد کردن ماژول‌های مورد نیاز
import RouterModule from './router.js';
import EventManager from './utils/event-manager.js';

/**
 * ماژول مدیریت محتوا
 * Content Management Module
 */
const ContentModule = (function() {
    let isInitialized = false;
    
    /**
     * مقداردهی اولیه محتوا
     */
    function init() {
        if (isInitialized) return;
        
        try {
            // ایجاد HTML اولیه محتوا
            createContentHTML();
            
            // مقداردهی اولیه router
            try {
                RouterModule.init();
            } catch (routerError) {
                console.error('❌ RouterModule initialization failed:', routerError);
            }
            
            // اتصال رویدادها
            attachEventListeners();
            
            isInitialized = true;
            console.log('✅ Content module initialized');
            
        } catch (error) {
            console.error('❌ Content initialization failed:', error);
        }
    }
    
    /**
     * ایجاد HTML محتوا
     */
    function createContentHTML() {
        const contentHTML = `
            <main class="admin-content" id="adminContent">
                <div class="content-container" id="contentContainer">
                    <!-- محتوا اینجا بارگذاری می‌شود -->
                </div>
            </main>
        `;
        
        document.body.insertAdjacentHTML('beforeend', contentHTML);
    }
    
    /**
     * اتصال رویدادها
     */
    function attachEventListeners() {
        document.addEventListener('menuChange', handleMenuChange);
        document.addEventListener('showProfileSettings', handleProfileSettings);
        document.addEventListener('showUserPage', handleUserPage);
        
        // همچنین می‌توان از EventManager برای رویدادها استفاده کرد
        EventManager.subscribe('app:menuChange', handleMenuChange);
        
        console.log('✅ Event listeners attached');
    }
    
    /**
     * مدیریت تغییر منو
     */
    function handleMenuChange(event) {
        // دریافت مقدار menuId از event یا event.detail
        const menuId = event.detail?.menuId || event.menuId;
        
        try {
            RouterModule.navigate(menuId);
        } catch (error) {
            console.error('❌ Error navigating to', menuId, error);
        }
    }
    
    /**
     * مدیریت تنظیمات پروفایل
     */
    function handleProfileSettings(event) {
        // در نسخه‌های آینده: پیاده‌سازی تنظیمات پروفایل
        console.log('Profile settings requested');
        showComingSoon('تنظیمات پروفایل');
    }
    
    /**
     * مدیریت صفحه کاربر
     */
    function handleUserPage(event) {
        const { userId } = event.detail;
        // در نسخه‌های آینده: بارگذاری صفحه کاربر با شناسه خاص
        console.log(`User page requested for ID: ${userId}`);
        showComingSoon('صفحه کاربر');
    }
    
    /**
     * نمایش پیام به‌زودی
     */
    function showComingSoon(feature) {
        const container = document.createElement('div');
        container.className = 'coming-soon-modal';
        container.innerHTML = `
            <div class="modal-content">
                <h3>🚧 به زودی</h3>
                <p>بخش «${feature}» در حال توسعه است و به زودی اضافه خواهد شد.</p>
                <button onclick="this.parentElement.parentElement.remove()">باشه</button>
            </div>
        `;
        document.body.appendChild(container);
    }
    
    // API عمومی
    return {
        init: init
    };
})();

// صادر کردن ماژول
export default ContentModule;
