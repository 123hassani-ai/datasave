/**
 * Content JavaScript Module for Glassmorphism Admin Dashboard
 * ماژول JavaScript محتوا برای داشبورد مدیریت شیشه‌ای
 * 
 * @description: مدیریت محتوای دینامیک، روتینگ و کارت‌های آماری
 * @version: 1.0.0
 * @author: DataSave Team
 */

'use strict';

/**
 * ماژول مدیریت محتوا
 * Content Management Module
 */
const ContentModule = (function() {
    let isInitialized = false;
    let currentPage = 'dashboard';
    let statsData = {};
    
    // تنظیمات پیش‌فرض
    const config = {
        selectors: {
            content: '.admin-content',
            container: '.content-container'
        },
        routes: {
            dashboard: { title: 'داشبورد', icon: 'fas fa-home' },
            users: { title: 'مدیریت کاربران', icon: 'fas fa-users' },
            forms: { title: 'مدیریت فرم‌ها', icon: 'fas fa-wpforms' },
            customers: { title: 'مشتریان', icon: 'fas fa-user-friends' },
            reports: { title: 'گزارشات', icon: 'fas fa-chart-bar' },
            analytics: { title: 'تحلیل داده‌ها', icon: 'fas fa-chart-line' },
            settings: { title: 'تنظیمات', icon: 'fas fa-cog' },
            support: { title: 'پشتیبانی', icon: 'fas fa-life-ring' }
        }
    };
    
    /**
     * مقداردهی اولیه محتوا
     */
    function init() {
        if (isInitialized) return;
        
        try {
            createContentHTML();
            attachEventListeners();
            loadDashboard();
            
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
        document.addEventListener('showProfileSettings', loadProfileSettings);
        document.addEventListener('showUserPage', loadUserPage);
    }
    
    /**
     * مدیریت تغییر منو
     */
    function handleMenuChange(event) {
        const { menuId, title } = event.detail;
        loadPage(menuId);
    }
    
    /**
     * بارگذاری صفحه
     */
    function loadPage(pageId) {
        currentPage = pageId;
        const container = document.getElementById('contentContainer');
        
        if (!container) return;
        
        // انیمیشن خروج
        container.style.opacity = '0';
        container.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            container.innerHTML = generatePageContent(pageId);
            
            // انیمیشن ورود
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
            
            // Post-loading initialization for specific pages
            setTimeout(() => {
                if (pageId === 'reports') {
                    // Initialize advanced SMS reports
                    console.log('🚀 Initializing advanced SMS reports...');
                    loadSMSReports();
                    
                    // Initialize Persian date pickers
                    initializePersianDatePickers();
                    
                    // Add keyboard shortcuts for reports page
                    document.addEventListener('keydown', handleReportsKeyboard);
                } else if (pageId === 'sms-settings') {
                    // Initialize SMS settings if needed
                    loadSMSSettingsData();
                }
            }, 100);
            
            console.log('Page loaded:', pageId);
        }, 150);
    }
    
    /**
     * تولید محتوای صفحه
     */
    function generatePageContent(pageId) {
        const route = config.routes[pageId] || config.routes.dashboard;
        
        switch (pageId) {
            case 'dashboard':
                return generateDashboardContent();
            case 'users':
                return generateUsersContent();
            case 'forms':
                return generateFormsContent();
            case 'customers':
                return generateCustomersContent();
            case 'reports':
                return generateReportsContent();
            case 'analytics':
                return generateAnalyticsContent();
            case 'settings':
                return generateSettingsContent();
            case 'sms-settings':
                return generateSMSSettingsContent();
            case 'support':
                return generateSupportContent();
            default:
                return generateDefaultContent(route);
        }
    }
    
    /**
     * تولید محتوای داشبورد
     */
    function generateDashboardContent() {
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
                ${generateStatsCards()}
            </div>
            
            <div class="content-sections">
                <div class="content-section">
                    <div class="section-header">
                        <h3 class="section-title">
                            <i class="fas fa-chart-line"></i>
                            آمار بازدید امروز
                        </h3>
                    </div>
                    <div class="section-content">
                        <div class="chart-container">
                            <div class="chart-placeholder">
                                <i class="fas fa-chart-area"></i>
                                <p>نمودار آمار بازدید</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * تولید محتوای تنظیمات
     */
    function generateSettingsContent() {
        return `
            <div class="page-header">
                <h1 class="page-title">
                    <div class="page-title-icon">
                        <i class="fas fa-cog"></i>
                    </div>
                    تنظیمات سیستم
                </h1>
                <p class="page-subtitle">مدیریت تمامی بخش‌های سیستم DataSave</p>
            </div>
            
            <div class="content-sections">
                <div class="content-section">
                    <div class="section-header">
                        <h3 class="section-title">
                            <i class="fas fa-sliders-h"></i>
                            دسته‌بندی تنظیمات
                        </h3>
                    </div>
                    <div class="section-content">
                        <div class="settings-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--spacing-4);">
                            <div class="settings-card" style="background: var(--glass-bg); border-radius: var(--radius-lg); border: 1px solid var(--glass-border); padding: var(--spacing-4); cursor: pointer; transition: all var(--transition-normal);" onclick="loadSMSSettings()">
                                <div class="card-icon sms" style="width: 50px; height: 50px; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; color: white; margin-bottom: var(--spacing-3); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                                    <i class="fas fa-envelope"></i>
                                </div>
                                <h3 style="margin-bottom: var(--spacing-2);">تنظیمات پیامک</h3>
                                <p style="color: var(--text-secondary); margin-bottom: var(--spacing-3);">مدیریت سامانه ۰۰۹۸SMS و کدهای یکبار مصرف</p>
                                <button style="background: var(--primary-gradient); color: white; border: none; padding: var(--spacing-2) var(--spacing-4); border-radius: var(--radius-md); cursor: pointer;">
                                    تنظیمات <i class="fas fa-arrow-left"></i>
                                </button>
                            </div>
                            
                            <div class="settings-card" style="background: var(--glass-bg); border-radius: var(--radius-lg); border: 1px solid var(--glass-border); padding: var(--spacing-4); cursor: pointer; transition: all var(--transition-normal);" onclick="showComingSoon('تنظیمات عمومی')">
                                <div class="card-icon general" style="width: 50px; height: 50px; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; color: white; margin-bottom: var(--spacing-3); background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                                    <i class="fas fa-cog"></i>
                                </div>
                                <h3 style="margin-bottom: var(--spacing-2);">تنظیمات عمومی</h3>
                                <p style="color: var(--text-secondary); margin-bottom: var(--spacing-3);">تنظیمات کلی سیستم و زبان</p>
                                <button style="background: var(--primary-gradient); color: white; border: none; padding: var(--spacing-2) var(--spacing-4); border-radius: var(--radius-md); cursor: pointer;">
                                    تنظیمات <i class="fas fa-arrow-left"></i>
                                </button>
                            </div>
                            
                            <div class="settings-card" style="background: var(--glass-bg); border-radius: var(--radius-lg); border: 1px solid var(--glass-border); padding: var(--spacing-4); cursor: pointer; transition: all var(--transition-normal);" onclick="showComingSoon('تنظیمات امنیتی')">
                                <div class="card-icon security" style="width: 50px; height: 50px; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; color: white; margin-bottom: var(--spacing-3); background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                                    <i class="fas fa-shield-alt"></i>
                                </div>
                                <h3 style="margin-bottom: var(--spacing-2);">تنظیمات امنیتی</h3>
                                <p style="color: var(--text-secondary); margin-bottom: var(--spacing-3);">مدیریت امنیت و سطوح دسترسی</p>
                                <button style="background: var(--primary-gradient); color: white; border: none; padding: var(--spacing-2) var(--spacing-4); border-radius: var(--radius-md); cursor: pointer;">
                                    تنظیمات <i class="fas fa-arrow-left"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * تولید محتوای تنظیمات پیامک
     */
    function generateSMSSettingsContent() {
        return `
            <div class="page-header">
                <h1 class="page-title">
                    <div class="page-title-icon">
                        <i class="fas fa-envelope"></i>
                    </div>
                    تنظیمات سامانه پیامک ۰۰۹۸SMS
                </h1>
                <p class="page-subtitle">مدیریت کامل سامانه ارسال پیامک و کدهای یکبار مصرف</p>
            </div>
            
            <div class="content-sections">
                <div class="content-section">
                    <div class="tabs-container" style="background: var(--glass-bg); backdrop-filter: var(--glass-blur); border-radius: var(--radius-xl); border: 1px solid var(--glass-border); overflow: hidden;">
                        <nav class="tabs-nav" style="display: flex; background: var(--glass-bg-lighter); border-bottom: 1px solid var(--glass-border);">
                            <button class="tab-button active" data-tab="connection" style="flex: 1; padding: var(--spacing-4); border: none; background: transparent; color: var(--text-primary); cursor: pointer; transition: all var(--transition-normal); border-bottom: 2px solid transparent;">
                                <i class="fas fa-link"></i> تنظیمات اتصال
                            </button>
                            <button class="tab-button" data-tab="otp" style="flex: 1; padding: var(--spacing-4); border: none; background: transparent; color: var(--text-primary); cursor: pointer; transition: all var(--transition-normal); border-bottom: 2px solid transparent;">
                                <i class="fas fa-key"></i> کد یکبار مصرف
                            </button>
                            <button class="tab-button" data-tab="test" style="flex: 1; padding: var(--spacing-4); border: none; background: transparent; color: var(--text-primary); cursor: pointer; transition: all var(--transition-normal); border-bottom: 2px solid transparent;">
                                <i class="fas fa-flask"></i> تست ارسال
                            </button>
                            <button class="tab-button" data-tab="reports" style="flex: 1; padding: var(--spacing-4); border: none; background: transparent; color: var(--text-primary); cursor: pointer; transition: all var(--transition-normal); border-bottom: 2px solid transparent;">
                                <i class="fas fa-chart-bar"></i> گزارشات
                            </button>
                        </nav>
                        
                        <div class="tabs-content" style="padding: var(--spacing-6);">
                            <!-- Connection Tab -->
                            <div class="tab-pane active" id="connection-tab">
                                <h3 style="margin-bottom: var(--spacing-4); color: var(--text-primary);">تنظیمات اتصال به سامانه ۰۰۹۸SMS</h3>
                                <form id="connectionForm" style="max-width: 600px;">
                                    <div class="form-group" style="margin-bottom: var(--spacing-4);">
                                        <label class="form-label" style="display: block; margin-bottom: var(--spacing-2); color: var(--text-primary); font-weight: var(--font-weight-medium);">نام کاربری:</label>
                                        <input type="text" id="sms_username" name="sms_username" class="form-input" style="width: 100%; padding: var(--spacing-3); border: 1px solid var(--glass-border); border-radius: var(--radius-md); background: var(--glass-bg-lighter); color: var(--text-primary);" required>
                                    </div>
                                    <div class="form-group" style="margin-bottom: var(--spacing-4);">
                                        <label class="form-label" style="display: block; margin-bottom: var(--spacing-2); color: var(--text-primary); font-weight: var(--font-weight-medium);">رمز عبور:</label>
                                        <input type="password" id="sms_password" name="sms_password" class="form-input" style="width: 100%; padding: var(--spacing-3); border: 1px solid var(--glass-border); border-radius: var(--radius-md); background: var(--glass-bg-lighter); color: var(--text-primary);" required>
                                    </div>
                                    <div class="form-group" style="margin-bottom: var(--spacing-4);">
                                        <label class="form-label" style="display: block; margin-bottom: var(--spacing-2); color: var(--text-primary); font-weight: var(--font-weight-medium);">شماره پنل:</label>
                                        <input type="text" id="sms_panel_number" name="sms_panel_number" class="form-input" style="width: 100%; padding: var(--spacing-3); border: 1px solid var(--glass-border); border-radius: var(--radius-md); background: var(--glass-bg-lighter); color: var(--text-primary);" required>
                                    </div>
                                    
                                    <!-- API Endpoints Section -->
                                    <div class="form-section" style="margin: var(--spacing-6) 0; padding: var(--spacing-4); background: var(--glass-bg); border-radius: var(--radius-md); border: 1px solid var(--glass-border);">
                                        <h4 style="color: var(--text-primary); margin-bottom: var(--spacing-4); display: flex; align-items: center;">
                                            <i class="fas fa-globe" style="margin-left: var(--spacing-2);"></i>
                                            تنظیمات API Endpoints
                                        </h4>
                                        <div class="form-group" style="margin-bottom: var(--spacing-4);">
                                            <label class="form-label" style="display: block; margin-bottom: var(--spacing-2); color: var(--text-primary); font-weight: var(--font-weight-medium);">API Endpoint (Link):</label>
                                            <input type="url" id="api_endpoint" name="api_endpoint" class="form-input" placeholder="https://0098sms.com/sendsmslink.aspx" style="width: 100%; padding: var(--spacing-3); border: 1px solid var(--glass-border); border-radius: var(--radius-md); background: var(--glass-bg-lighter); color: var(--text-primary);" required>
                                            <small style="color: var(--text-secondary); margin-top: var(--spacing-1); display: block;">آدرس API برای ارسال پیامک از طریق لینک</small>
                                        </div>
                                        <div class="form-group" style="margin-bottom: var(--spacing-4);">
                                            <label class="form-label" style="display: block; margin-bottom: var(--spacing-2); color: var(--text-primary); font-weight: var(--font-weight-medium);">Web Service Endpoint:</label>
                                            <input type="url" id="webservice_endpoint" name="webservice_endpoint" class="form-input" placeholder="https://webservice.0098sms.com/service.asmx" style="width: 100%; padding: var(--spacing-3); border: 1px solid var(--glass-border); border-radius: var(--radius-md); background: var(--glass-bg-lighter); color: var(--text-primary);" required>
                                            <small style="color: var(--text-secondary); margin-top: var(--spacing-1); display: block;">آدرس وب سرویس SOAP برای ارسال پیامک</small>
                                        </div>
                                    </div>
                                    
                                    <div class="form-group" style="margin-bottom: var(--spacing-4);">
                                        <label style="display: flex; align-items: center; color: var(--text-primary); cursor: pointer;">
                                            <input type="checkbox" id="sms_enabled" name="sms_enabled" style="margin-left: var(--spacing-2);">
                                            فعال‌سازی سامانه پیامک
                                        </label>
                                    </div>
                                    <button type="submit" class="btn btn-primary" style="background: var(--primary-gradient); color: white; border: none; padding: var(--spacing-3) var(--spacing-6); border-radius: var(--radius-md); cursor: pointer; font-weight: var(--font-weight-medium);">
                                        <i class="fas fa-save"></i> ذخیره تنظیمات
                                    </button>
                                </form>
                            </div>
                            
                            <!-- OTP Tab -->
                            <div class="tab-pane" id="otp-tab" style="display: none;">
                                <h3 style="margin-bottom: var(--spacing-4); color: var(--text-primary);">تنظیمات کد یکبار مصرف (OTP)</h3>
                                <form id="otpForm" style="max-width: 600px;">
                                    <div class="form-group" style="margin-bottom: var(--spacing-4);">
                                        <label class="form-label" style="display: block; margin-bottom: var(--spacing-2); color: var(--text-primary); font-weight: var(--font-weight-medium);">تعداد رقم کد:</label>
                                        <select id="otp_length" name="otp_length" class="form-select" style="width: 100%; padding: var(--spacing-3); border: 1px solid var(--glass-border); border-radius: var(--radius-md); background: var(--glass-bg-lighter); color: var(--text-primary);">
                                            <option value="4">۴ رقمی</option>
                                            <option value="5">۵ رقمی</option>
                                            <option value="6">۶ رقمی</option>
                                        </select>
                                    </div>
                                    <div class="form-group" style="margin-bottom: var(--spacing-4);">
                                        <label class="form-label" style="display: block; margin-bottom: var(--spacing-2); color: var(--text-primary); font-weight: var(--font-weight-medium);">مدت اعتبار (دقیقه):</label>
                                        <select id="otp_expiry_minutes" name="otp_expiry_minutes" class="form-select" style="width: 100%; padding: var(--spacing-3); border: 1px solid var(--glass-border); border-radius: var(--radius-md); background: var(--glass-bg-lighter); color: var(--text-primary);">
                                            <option value="3">۳ دقیقه</option>
                                            <option value="5">۵ دقیقه</option>
                                            <option value="10">۱۰ دقیقه</option>
                                        </select>
                                    </div>
                                    <div class="form-group" style="margin-bottom: var(--spacing-4);">
                                        <label class="form-label" style="display: block; margin-bottom: var(--spacing-2); color: var(--text-primary); font-weight: var(--font-weight-medium);">قالب پیام:</label>
                                        <textarea id="otp_message_template" name="otp_message_template" class="form-textarea" rows="4" placeholder="کد تایید شما: {code}" style="width: 100%; padding: var(--spacing-3); border: 1px solid var(--glass-border); border-radius: var(--radius-md); background: var(--glass-bg-lighter); color: var(--text-primary); resize: vertical;"></textarea>
                                    </div>
                                    <button type="submit" class="btn btn-primary" style="background: var(--primary-gradient); color: white; border: none; padding: var(--spacing-3) var(--spacing-6); border-radius: var(--radius-md); cursor: pointer; font-weight: var(--font-weight-medium);">
                                        <i class="fas fa-key"></i> ذخیره تنظیمات OTP
                                    </button>
                                </form>
                            </div>
                            
                            <!-- Test Tab -->
                            <div class="tab-pane" id="test-tab" style="display: none;">
                                <h3 style="margin-bottom: var(--spacing-4); color: var(--text-primary);">تست ارسال پیامک</h3>
                                
                                <!-- Test General SMS -->
                                <div class="test-card" style="background: var(--glass-bg-lighter); border-radius: var(--radius-lg); padding: var(--spacing-4); margin-bottom: var(--spacing-4); max-width: 600px;">
                                    <h4 style="color: var(--text-primary); margin-bottom: var(--spacing-3);">📧 تست ارسال پیام معمولی</h4>
                                    <form id="testSmsForm">
                                        <div class="form-group" style="margin-bottom: var(--spacing-4);">
                                            <label class="form-label" style="display: block; margin-bottom: var(--spacing-2); color: var(--text-primary); font-weight: var(--font-weight-medium);">شماره تلفن:</label>
                                            <input type="tel" id="test_phone_number" class="form-input" placeholder="09123456789" style="width: 100%; padding: var(--spacing-3); border: 1px solid var(--glass-border); border-radius: var(--radius-md); background: var(--glass-bg-lighter); color: var(--text-primary);" required>
                                        </div>
                                        <div class="form-group" style="margin-bottom: var(--spacing-4);">
                                            <label class="form-label" style="display: block; margin-bottom: var(--spacing-2); color: var(--text-primary); font-weight: var(--font-weight-medium);">متن پیام:</label>
                                            <textarea id="test_message_text" class="form-textarea" rows="3" placeholder="متن پیام تست..." style="width: 100%; padding: var(--spacing-3); border: 1px solid var(--glass-border); border-radius: var(--radius-md); background: var(--glass-bg-lighter); color: var(--text-primary); resize: vertical;" required></textarea>
                                        </div>
                                        <div class="form-actions" style="display: flex; gap: var(--spacing-3); flex-wrap: wrap;">
                                            <button type="button" id="saveTestDataBtn" class="btn btn-secondary" style="background: var(--glass-bg); color: var(--text-primary); border: 1px solid var(--glass-border); padding: var(--spacing-3) var(--spacing-4); border-radius: var(--radius-md); cursor: pointer;">
                                                <i class="fas fa-save"></i> ذخیره در دیتابیس
                                            </button>
                                            <button type="submit" class="btn btn-primary" style="background: var(--primary-gradient); color: white; border: none; padding: var(--spacing-3) var(--spacing-6); border-radius: var(--radius-md); cursor: pointer; font-weight: var(--font-weight-medium);">
                                                <i class="fas fa-paper-plane"></i> ارسال پیام
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                
                                <!-- Test OTP -->
                                <div class="test-card" style="background: var(--glass-bg-lighter); border-radius: var(--radius-lg); padding: var(--spacing-4); margin-bottom: var(--spacing-4); max-width: 600px;">
                                    <h4 style="color: var(--text-primary); margin-bottom: var(--spacing-3);">🔐 تست ارسال کد یکبار مصرف (OTP)</h4>
                                    <form id="testOtpForm">
                                        <div class="form-group" style="margin-bottom: var(--spacing-4);">
                                            <label class="form-label" style="display: block; margin-bottom: var(--spacing-2); color: var(--text-primary); font-weight: var(--font-weight-medium);">شماره تلفن:</label>
                                            <input type="tel" id="otp_test_phone" class="form-input" placeholder="09123456789" style="width: 100%; padding: var(--spacing-3); border: 1px solid var(--glass-border); border-radius: var(--radius-md); background: var(--glass-bg-lighter); color: var(--text-primary);" required>
                                        </div>
                                        <button type="submit" class="btn btn-warning" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border: none; padding: var(--spacing-3) var(--spacing-6); border-radius: var(--radius-md); cursor: pointer; font-weight: var(--font-weight-medium);">
                                            <i class="fas fa-key"></i> ارسال کد OTP
                                        </button>
                                    </form>
                                    
                                    <!-- OTP Verification Card -->
                                    <div id="otpVerificationCard" class="verification-card" style="display: none; margin-top: var(--spacing-4); padding: var(--spacing-4); border: 2px solid #f59e0b; border-radius: var(--radius-md); background: rgba(245, 158, 11, 0.1);">
                                        <div class="card-content">
                                            <h5 style="color: #d97706; margin-bottom: var(--spacing-3);">✅ راستی‌آزمایی کد OTP</h5>
                                            <p style="color: var(--text-secondary); margin-bottom: var(--spacing-3);">کد OTP به شماره <span id="sentPhoneNumber"></span> ارسال شد.</p>
                                            <form id="verifyOtpForm">
                                                <div class="form-group" style="margin-bottom: var(--spacing-3);">
                                                    <label class="form-label" style="display: block; margin-bottom: var(--spacing-2); color: var(--text-primary);">کد دریافتی:</label>
                                                    <input type="text" id="verification_code" class="form-input" placeholder="12345" maxlength="6" style="width: 150px; padding: var(--spacing-3); border: 1px solid #f59e0b; border-radius: var(--radius-md); background: white; color: var(--text-primary); text-align: center; font-size: 18px; letter-spacing: 2px;" required>
                                                </div>
                                                <div class="form-actions" style="display: flex; gap: var(--spacing-2);">
                                                    <button type="submit" class="btn btn-success" style="background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; padding: var(--spacing-2) var(--spacing-4); border-radius: var(--radius-md); cursor: pointer;">
                                                        <i class="fas fa-check"></i> تایید کد
                                                    </button>
                                                    <button type="button" id="cancelVerificationBtn" class="btn btn-secondary" style="background: var(--glass-bg); color: var(--text-primary); border: 1px solid var(--glass-border); padding: var(--spacing-2) var(--spacing-4); border-radius: var(--radius-md); cursor: pointer;">
                                                        <i class="fas fa-times"></i> لغو
                                                    </button>
                                                </div>
                                            </form>
                                            <div id="otpCountdown" style="margin-top: var(--spacing-3); color: #d97706; font-weight: var(--font-weight-medium);"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Reports Tab -->
                            <div class="tab-pane" id="reports-tab" style="display: none;">
                                <h3 style="margin-bottom: var(--spacing-4); color: var(--text-primary);">گزارشات ارسال پیامک</h3>
                                <div class="form-group" style="margin-bottom: var(--spacing-4);">
                                    <input type="text" id="filter_phone" class="form-input" placeholder="جستجو بر اساس شماره تلفن..." style="width: 100%; max-width: 400px; padding: var(--spacing-3); border: 1px solid var(--glass-border); border-radius: var(--radius-md); background: var(--glass-bg-lighter); color: var(--text-primary);">
                                </div>
                                <div class="table-container" style="background: var(--glass-bg-lighter); border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--glass-border);">
                                    <table class="reports-table" style="width: 100%; border-collapse: collapse;">
                                        <thead>
                                            <tr style="background: var(--glass-bg); border-bottom: 1px solid var(--glass-border);">
                                                <th style="padding: var(--spacing-4); text-align: right; color: var(--text-primary); font-weight: var(--font-weight-medium);">شناسه</th>
                                                <th style="padding: var(--spacing-4); text-align: right; color: var(--text-primary); font-weight: var(--font-weight-medium);">شماره گیرنده</th>
                                                <th style="padding: var(--spacing-4); text-align: right; color: var(--text-primary); font-weight: var(--font-weight-medium);">نوع پیام</th>
                                                <th style="padding: var(--spacing-4); text-align: right; color: var(--text-primary); font-weight: var(--font-weight-medium);">وضعیت</th>
                                                <th style="padding: var(--spacing-4); text-align: right; color: var(--text-primary); font-weight: var(--font-weight-medium);">تاریخ ارسال</th>
                                            </tr>
                                        </thead>
                                        <tbody id="reportsTableBody">
                                            <tr>
                                                <td colspan="5" style="padding: var(--spacing-6); text-align: center; color: var(--text-secondary);">در حال بارگذاری گزارشات...</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * تولید محتوای کاربران
     */
    function generateUsersContent() {
        return `
            <div class="page-header">
                <h1 class="page-title">
                    <div class="page-title-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    مدیریت کاربران
                </h1>
                <p class="page-subtitle">مدیریت و نظارت بر کاربران سیستم</p>
            </div>
            
            <div class="content-sections">
                <div class="content-section">
                    <div class="section-header">
                        <h3 class="section-title">
                            <i class="fas fa-table"></i>
                            لیست کاربران
                        </h3>
                        <button class="btn btn-primary">
                            <i class="fas fa-plus"></i>
                            افزودن کاربر جدید
                        </button>
                    </div>
                    <div class="section-content">
                        <div class="table-placeholder">
                            <i class="fas fa-users"></i>
                            <p>جدول کاربران اینجا نمایش داده می‌شود</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * تولید محتوای پیش‌فرض
     */
    function generateDefaultContent(route) {
        return `
            <div class="page-header">
                <h1 class="page-title">
                    <div class="page-title-icon">
                        <i class="${route.icon}"></i>
                    </div>
                    ${route.title}
                </h1>
                <p class="page-subtitle">این بخش در حال توسعه است</p>
            </div>
            
            <div class="content-sections">
                <div class="content-section">
                    <div class="section-content">
                        <div class="placeholder-content">
                            <i class="${route.icon}" style="font-size: 4rem; opacity: 0.3;"></i>
                            <h3>در حال توسعه</h3>
                            <p>این بخش به زودی در دسترس خواهد بود</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * تولید محتوای فرم‌ها
     */
    function generateFormsContent() {
        return generateDefaultContent({title: 'مدیریت فرم‌ها', icon: 'fas fa-wpforms'});
    }
    
    /**
     * تولید محتوای مشتریان
     */
    function generateCustomersContent() {
        return generateDefaultContent({title: 'مشتریان', icon: 'fas fa-user-friends'});
    }
    
    /**
     * تولید محتوای گزارشات
     */
    function generateReportsContent() {
        return `
            <div class="content-header">
                <div class="header-content">
                    <div class="page-title">
                        <div class="title-wrapper">
                            <div class="title-icon">
                                <i class="fas fa-chart-bar"></i>
                            </div>
                            <h1 class="title-text">گزارشات پیامک</h1>
                        </div>
                        <p class="title-description">مشاهده و مدیریت کامل گزارشات ارسال پیامک با امکانات فیلتر و جستجوی پیشرفته</p>
                    </div>
                </div>
            </div>
            
            <div class="content-body">
                <!-- Statistics Cards -->
                <div class="stats-grid" id="smsStatsGrid">
                    <div class="stat-card stat-total">
                        <div class="stat-header">
                            <span class="stat-title">کل پیام‌ها</span>
                            <div class="stat-icon">
                                <i class="fas fa-sms"></i>
                            </div>
                        </div>
                        <div class="stat-value" id="totalSMSCount">-</div>
                        <div class="stat-trend">
                            <span class="trend-text">مجموع کل</span>
                        </div>
                    </div>
                    
                    <div class="stat-card stat-success">
                        <div class="stat-header">
                            <span class="stat-title">موفق</span>
                            <div class="stat-icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                        </div>
                        <div class="stat-value" id="successSMSCount">-</div>
                        <div class="stat-trend trend-up">
                            <span class="trend-text">تحویل و تأیید شده</span>
                        </div>
                    </div>
                    
                    <div class="stat-card stat-warning">
                        <div class="stat-header">
                            <span class="stat-title">در انتظار</span>
                            <div class="stat-icon">
                                <i class="fas fa-clock"></i>
                            </div>
                        </div>
                        <div class="stat-value" id="pendingSMSCount">-</div>
                        <div class="stat-trend">
                            <span class="trend-text">ارسال و انتظار</span>
                        </div>
                    </div>
                    
                    <div class="stat-card stat-error">
                        <div class="stat-header">
                            <span class="stat-title">ناموفق</span>
                            <div class="stat-icon">
                                <i class="fas fa-times-circle"></i>
                            </div>
                        </div>
                        <div class="stat-value" id="failedSMSCount">-</div>
                        <div class="stat-trend trend-down">
                            <span class="trend-text">خطا و مسدود شده</span>
                        </div>
                    </div>
                </div>
                
                <!-- Advanced Filters -->
                <div class="action-card">
                    <div class="card-header">
                        <div class="header-content">
                            <div class="header-icon">
                                <i class="fas fa-filter"></i>
                            </div>
                            <div class="header-text">
                                <h3 class="card-title">فیلتر و جستجوی پیشرفته</h3>
                                <p class="card-subtitle">گزارشات را بر اساس معیارهای مختلف فیلتر کنید</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card-content">
                        <div class="filter-grid">
                            <div class="filter-group">
                                <label class="filter-label">وضعیت</label>
                                <select id="statusFilter" class="filter-select">
                                    <option value="">همه وضعیت‌ها</option>
                                    <option value="delivered">✅ تحویل داده شده</option>
                                    <option value="verified">✅ تأیید شده</option>
                                    <option value="pending">⏳ در انتظار</option>
                                    <option value="sent">📤 ارسال شده</option>
                                    <option value="failed">❌ ناموفق</option>
                                    <option value="expired">⏰ منقضی شده</option>
                                    <option value="blocked">🚫 مسدود شده</option>
                                    <option value="undelivered">📵 عدم تحویل</option>
                                </select>
                            </div>
                            
                            <div class="filter-group">
                                <label class="filter-label">نوع پیام</label>
                                <select id="typeFilter" class="filter-select">
                                    <option value="">همه انواع</option>
                                    <option value="otp">🔐 کد یکبار مصرف</option>
                                    <option value="general">📄 عمومی</option>
                                    <option value="notification">🔔 اطلاع‌رسانی</option>
                                    <option value="test">🧪 تست</option>
                                </select>
                            </div>
                            
                            <div class="filter-group">
                                <label class="filter-label">شماره تلفن</label>
                                <input type="text" id="phoneFilter" class="filter-input" placeholder="09123456789">
                            </div>
                            
                            <div class="filter-group">
                                <label class="filter-label">جستجو در متن</label>
                                <input type="text" id="searchFilter" class="filter-input" placeholder="جستجو در متن پیام...">
                            </div>
                            
                            <div class="filter-group">
                                <label class="filter-label">از تاریخ</label>
                                <input type="text" id="dateFromFilter" class="filter-input persian-datepicker" placeholder="۱۴۰۳/۰۶/۰۱" readonly>
                                <div class="datepicker-icon">
                                    <i class="fas fa-calendar-alt"></i>
                                </div>
                            </div>
                            
                            <div class="filter-group">
                                <label class="filter-label">تا تاریخ</label>
                                <input type="text" id="dateToFilter" class="filter-input persian-datepicker" placeholder="۱۴۰۳/۰۶/۲۰" readonly>
                                <div class="datepicker-icon">
                                    <i class="fas fa-calendar-alt"></i>
                                </div>
                            </div>
                        </div>
                        
                        <div class="filter-actions">
                            <button class="btn btn-primary" onclick="ContentModule.applyReportsFilters()">
                                <i class="fas fa-search"></i>
                                اعمال فیلتر
                            </button>
                            <button class="btn btn-secondary" onclick="ContentModule.clearReportsFilters()">
                                <i class="fas fa-times"></i>
                                پاک کردن
                            </button>
                            <button class="btn btn-info" onclick="ContentModule.refreshReports()">
                                <i class="fas fa-sync-alt"></i>
                                بازخوانی
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Reports Table -->
                <div class="data-card">
                    <div class="card-header">
                        <div class="header-content">
                            <div class="header-icon">
                                <i class="fas fa-table"></i>
                            </div>
                            <div class="header-text">
                                <h3 class="card-title">فهرست گزارشات</h3>
                                <p class="card-subtitle" id="reportsMetaInfo">در حال بارگذاری...</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card-content">
                        <div class="table-container">
                            <div id="reportsLoadingIndicator" class="loading-state">
                                <div class="loading-spinner"></div>
                                <p>در حال بارگذاری گزارشات...</p>
                            </div>
                            
                            <div id="reportsErrorIndicator" class="error-state" style="display: none;">
                                <div class="error-icon">
                                    <i class="fas fa-exclamation-triangle"></i>
                                </div>
                                <h3>خطا در بارگذاری گزارشات</h3>
                                <p id="reportsErrorMessage"></p>
                                <button class="btn btn-primary" onclick="ContentModule.refreshReports()">
                                    <i class="fas fa-sync-alt"></i>
                                    تلاش مجدد
                                </button>
                            </div>
                            
                            <table class="advanced-table" id="reportsTable" style="display: none;">
                                <thead>
                                    <tr>
                                        <th>شناسه</th>
                                        <th>شماره تلفن</th>
                                        <th>متن پیام</th>
                                        <th>نوع</th>
                                        <th>وضعیت</th>
                                        <th>کد OTP</th>
                                        <th>تاریخ ایجاد</th>
                                        <th>آخرین بروزرسانی</th>
                                    </tr>
                                </thead>
                                <tbody id="advancedReportsTableBody">
                                </tbody>
                            </table>
                            
                            <div id="emptyReportsState" class="empty-state" style="display: none;">
                                <div class="empty-icon">
                                    <i class="fas fa-inbox"></i>
                                </div>
                                <h3>هیچ گزارشی یافت نشد</h3>
                                <p>با تغییر فیلترهای جستجو، گزارشات مورد نظر خود را پیدا کنید.</p>
                            </div>
                        </div>
                        
                        <!-- Pagination -->
                        <div class="pagination-container" id="reportsPaginationContainer" style="display: none;">
                            <div class="pagination-info">
                                <span id="reportsPageInfo">صفحه 1 از 1</span>
                            </div>
                            <div class="pagination-controls">
                                <button class="btn btn-outline" id="prevReportsPage" onclick="ContentModule.goToReportsPage(-1)">
                                    <i class="fas fa-chevron-right"></i>
                                    قبلی
                                </button>
                                <button class="btn btn-outline" id="nextReportsPage" onclick="ContentModule.goToReportsPage(1)">
                                    بعدی
                                    <i class="fas fa-chevron-left"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * تولید محتوای تحلیل داده‌ها
     */
    function generateAnalyticsContent() {
        return generateDefaultContent({title: 'تحلیل داده‌ها', icon: 'fas fa-chart-line'});
    }
    
    /**
     * تولید محتوای پشتیبانی
     */
    function generateSupportContent() {
        return generateDefaultContent({title: 'پشتیبانی', icon: 'fas fa-life-ring'});
    }
    
    /**
     * تولید کارت‌های آماری
     */
    function generateStatsCards() {
        const stats = [
            { title: 'کل کاربران', value: '1,234', trend: '+12%', icon: 'fas fa-users', color: 'primary' },
            { title: 'فرم‌های فعال', value: '45', trend: '+8%', icon: 'fas fa-wpforms', color: 'success' },
            { title: 'بازدید امروز', value: '856', trend: '+23%', icon: 'fas fa-eye', color: 'info' },
            { title: 'درآمد ماه', value: '₹12,500', trend: '+15%', icon: 'fas fa-dollar-sign', color: 'warning' }
        ];
        
        return stats.map(stat => `
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">${stat.title}</span>
                    <div class="stat-icon">
                        <i class="${stat.icon}"></i>
                    </div>
                </div>
                <div class="stat-value">${stat.value}</div>
                <div class="stat-trend trend-up">
                    <i class="fas fa-arrow-up trend-icon"></i>
                    <span>${stat.trend}</span>
                    <span class="trend-text">نسبت به ماه قبل</span>
                </div>
            </div>
        `).join('');
    }
    
    /**
     * بارگذاری داشبورد
     */
    function loadDashboard() {
        loadPage('dashboard');
    }
    
    /**
     * بارگذاری تنظیمات پروفایل
     */
    function loadProfileSettings() {
        loadPage('profile-settings');
        console.log('👤 Profile settings loaded');
    }
    
    /**
     * نمایش صفحه کاربر
     */
    function loadUserPage() {
        loadPage('user-page');
        console.log('👥 User page loaded');
    }
    
    /**
     * بارگذاری تنظیمات SMS
     */
    function loadSMSSettings() {
        loadPage('sms-settings');
        
        // Initialize SMS tabs and functionality after content loads
        // Give more time for DOM to be ready
        setTimeout(() => {
            const checkTabsReady = () => {
                const tabButtons = document.querySelectorAll('.tab-button');
                if (tabButtons.length > 0) {
                    initializeSMSTabs();
                    loadSMSSettingsData();
                } else {
                    // Retry after another 100ms if tabs not ready
                    setTimeout(checkTabsReady, 100);
                }
            };
            checkTabsReady();
        }, 200);
    }
    
    /**
     * مقداردهی اولیه تب‌های SMS
     */
    function initializeSMSTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        if (tabButtons.length === 0) {
            console.warn('SMS tabs not found, retrying...');
            return;
        }
        
        // Style active tab
        const activeTab = document.querySelector('.tab-button.active');
        if (activeTab) {
            activeTab.style.borderBottomColor = 'var(--primary-color)';
            activeTab.style.background = 'var(--glass-bg-lighter)';
        }
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Remove active from all
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.style.borderBottomColor = 'transparent';
                    btn.style.background = 'transparent';
                });
                tabPanes.forEach(pane => {
                    pane.classList.remove('active');
                    pane.style.display = 'none';
                });
                
                // Add active to current
                this.classList.add('active');
                this.style.borderBottomColor = 'var(--primary-color)';
                this.style.background = 'var(--glass-bg-lighter)';
                
                const targetPane = document.getElementById(tabId + '-tab');
                if (targetPane) {
                    targetPane.classList.add('active');
                    targetPane.style.display = 'block';
                }
                
                // Load reports data when reports tab is clicked
                if (tabId === 'reports') {
                    loadSMSReports();
                }
            });
        });
        
        // Setup form event listeners
        setupSMSFormHandlers();
        
        console.log('✅ SMS tabs initialized successfully');
    }
    
    /**
     * تنظیم رویدادهای فرم‌های SMS
     */
    function setupSMSFormHandlers() {
        const connectionForm = document.getElementById('connectionForm');
        const otpForm = document.getElementById('otpForm');
        const testForm = document.getElementById('testSmsForm');
        const testOtpForm = document.getElementById('testOtpForm');
        const verifyOtpForm = document.getElementById('verifyOtpForm');
        const saveTestDataBtn = document.getElementById('saveTestDataBtn');
        const cancelVerificationBtn = document.getElementById('cancelVerificationBtn');
        
        if (connectionForm) {
            connectionForm.addEventListener('submit', handleConnectionFormSubmit);
        }
        
        if (otpForm) {
            otpForm.addEventListener('submit', handleOTPFormSubmit);
        }
        
        if (testForm) {
            testForm.addEventListener('submit', handleTestSMSSubmit);
        }
        
        if (testOtpForm) {
            testOtpForm.addEventListener('submit', handleTestOTPSubmit);
        }
        
        if (verifyOtpForm) {
            verifyOtpForm.addEventListener('submit', handleOTPVerification);
        }
        
        if (saveTestDataBtn) {
            saveTestDataBtn.addEventListener('click', handleSaveTestData);
        }
        
        // Event listeners برای OTP form
        const otpTestForm = document.getElementById('otpTestForm');
        if (otpTestForm) {
            otpTestForm.addEventListener('submit', handleTestOTPSubmit);
        }
        
        const verifyButton = document.querySelector('#otpVerificationCard .btn-success');
        if (verifyButton) {
            verifyButton.addEventListener('click', handleOTPVerification);
        }
        
        if (cancelVerificationBtn) {
            cancelVerificationBtn.addEventListener('click', handleCancelVerification);
        }
        
        // اضافه کردن event listener برای تبدیل اعداد فارسی به انگلیسی در شماره پنل
        const panelNumberInput = document.getElementById('sms_panel_number');
        if (panelNumberInput && typeof NumberUtils !== 'undefined') {
            panelNumberInput.addEventListener('input', function(e) {
                const originalValue = e.target.value;
                const convertedValue = NumberUtils.toEnglish(originalValue);
                
                // تنها در صورت تغییر، مقدار را به‌روزرسانی کن
                if (originalValue !== convertedValue) {
                    e.target.value = convertedValue;
                    console.log('📞 Panel number auto-converted:', originalValue, '→', convertedValue);
                }
            });
            
            panelNumberInput.addEventListener('paste', function(e) {
                // تأخیر کوتاه برای اجازه دادن به paste
                setTimeout(() => {
                    const originalValue = e.target.value;
                    const convertedValue = NumberUtils.toEnglish(originalValue);
                    if (originalValue !== convertedValue) {
                        e.target.value = convertedValue;
                        console.log('📋 Panel number paste-converted:', originalValue, '→', convertedValue);
                    }
                }, 1);
            });
        }
        
        // اضافه کردن event listener برای شماره تست SMS
        const testPhoneInput = document.getElementById('test_phone_number');
        const otpTestPhoneInput = document.getElementById('otp_test_phone');
        
        if (testPhoneInput && typeof NumberUtils !== 'undefined') {
            testPhoneInput.addEventListener('input', function(e) {
                const originalValue = e.target.value;
                const convertedValue = NumberUtils.toEnglish(originalValue);
                
                if (originalValue !== convertedValue) {
                    e.target.value = convertedValue;
                    console.log('📱 Test phone auto-converted:', originalValue, '→', convertedValue);
                }
            });
            
            testPhoneInput.addEventListener('paste', function(e) {
                setTimeout(() => {
                    const originalValue = e.target.value;
                    const convertedValue = NumberUtils.toEnglish(originalValue);
                    if (originalValue !== convertedValue) {
                        e.target.value = convertedValue;
                        console.log('📋 Test phone paste-converted:', originalValue, '→', convertedValue);
                    }
                }, 1);
            });
        }
        
        if (otpTestPhoneInput && typeof NumberUtils !== 'undefined') {
            otpTestPhoneInput.addEventListener('input', function(e) {
                const originalValue = e.target.value;
                const convertedValue = NumberUtils.toEnglish(originalValue);
                
                if (originalValue !== convertedValue) {
                    e.target.value = convertedValue;
                    console.log('📱 OTP Test phone auto-converted:', originalValue, '→', convertedValue);
                }
            });
            
            otpTestPhoneInput.addEventListener('paste', function(e) {
                setTimeout(() => {
                    const originalValue = e.target.value;
                    const convertedValue = NumberUtils.toEnglish(originalValue);
                    if (originalValue !== convertedValue) {
                        e.target.value = convertedValue;
                        console.log('📋 OTP Test phone paste-converted:', originalValue, '→', convertedValue);
                    }
                }, 1);
            });
        }
    }
    
    /**
     * بارگذاری داده‌های تنظیمات SMS
     */
    async function loadSMSSettingsData() {
        try {
            console.log('📤 Loading SMS settings from database...');
            
            // Create multiple API path options for XAMPP server
            const apiPaths = [
                'http://localhost/datasave/backend/api/v1/settings.php', // Primary: Direct XAMPP
                'http://127.0.0.1/datasave/backend/api/v1/settings.php',
                'proxy-settings.php', // Fallback: For Live Server
                '/datasave/backend/api/v1/settings.php',
                '../backend/api/v1/settings.php',
                'backend/api/v1/settings.php'
            ];
            
            let response = null;
            let lastError = null;
            
            // Try each path until one works
            for (const apiPath of apiPaths) {
                try {
                    console.log('🔍 Trying API path:', apiPath);
                    
                    response = await fetch(apiPath, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    console.log('📋 Response status:', response.status, 'for path:', apiPath);
                    
                    if (response.ok) {
                        const contentType = response.headers.get('content-type');
                        console.log('📝 Content-Type:', contentType);
                        
                        if (contentType && contentType.includes('application/json')) {
                            break; // Found working API endpoint
                        } else {
                            console.warn('⚠️ Wrong content type:', contentType);
                            lastError = new Error(`نوع محتوا نادرست: ${contentType}`);
                            response = null;
                        }
                    } else {
                        lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
                        response = null;
                    }
                } catch (error) {
                    console.warn('❌ Failed with path:', apiPath, error.message);
                    lastError = error;
                    response = null;
                }
            }
            
            if (!response) {
                throw lastError || new Error('هیچ API endpoint در دسترس نیست');
            }
            
            const data = await response.json();
            console.log('📊 SMS settings data received:', data);
            
            if (data.success && data.data) {
                populateSMSForms(data.data);
                console.log('✅ SMS settings loaded successfully');
            } else {
                console.warn('⚠️ No SMS settings data found, using defaults');
                populateSMSForms({});
            }
        } catch (error) {
            console.error('❌ Error loading SMS settings:', error);
            
            // Show user-friendly error message
            showErrorMessage('خطا در بارگذاری تنظیمات SMS. بررسی کنید که سرور XAMPP روشن باشد.');
            
            // Load empty form with defaults
            populateSMSForms({});
        }
    }
    
    /**
     * پر کردن فرم‌های SMS با داده‌ها
     */
    function populateSMSForms(settings) {
        console.log('📋 Populating SMS forms with data:', settings);
        
        // Connection settings
        const usernameField = document.getElementById('sms_username');
        const passwordField = document.getElementById('sms_password');
        const panelField = document.getElementById('sms_panel_number');
        const enabledField = document.getElementById('sms_enabled');
        const apiEndpointField = document.getElementById('api_endpoint');
        const webserviceEndpointField = document.getElementById('webservice_endpoint');
        
        if (usernameField) {
            usernameField.value = (settings.sms_username && settings.sms_username.value) || '';
        }
        if (passwordField) {
            passwordField.value = (settings.sms_password && settings.sms_password.value) || '';
        }
        if (panelField) {
            panelField.value = (settings.sms_panel_number && settings.sms_panel_number.value) || '';
        }
        if (apiEndpointField) {
            apiEndpointField.value = (settings.api_endpoint && settings.api_endpoint.value) || 'https://0098sms.com/sendsmslink.aspx';
        }
        if (webserviceEndpointField) {
            webserviceEndpointField.value = (settings.webservice_endpoint && settings.webservice_endpoint.value) || 'https://webservice.0098sms.com/service.asmx';
        }
        if (enabledField) {
            // پشتیبانی از boolean یا string value
            const isEnabled = settings.sms_enabled && 
                (settings.sms_enabled.value === true || 
                 settings.sms_enabled.value === '1' || 
                 settings.sms_enabled.value === 1);
            enabledField.checked = isEnabled;
            console.log('🔧 SMS Enabled checkbox set to:', isEnabled, 'from value:', settings.sms_enabled?.value);
        }
        
        // OTP settings
        const lengthField = document.getElementById('otp_length');
        const expiryField = document.getElementById('otp_expiry_minutes');
        const templateField = document.getElementById('otp_message_template');
        
        if (lengthField) {
            lengthField.value = (settings.otp_length && settings.otp_length.value) || '5';
        }
        if (expiryField) {
            expiryField.value = (settings.otp_expiry_minutes && settings.otp_expiry_minutes.value) || '5';
        }
        if (templateField) {
            templateField.value = (settings.otp_message_template && settings.otp_message_template.value) || 'کد تایید شما: {code}';
        }
        
        // Test settings - بارگذاری داده‌های تست از دیتابیس
        const testPhoneField = document.getElementById('test_phone_number');
        const testMessageField = document.getElementById('test_message_text');
        
        if (testPhoneField) {
            testPhoneField.value = (settings.test_phone_number && settings.test_phone_number.value) || '';
            console.log('📱 Test phone loaded:', testPhoneField.value);
        }
        if (testMessageField) {
            testMessageField.value = (settings.test_message_text && settings.test_message_text.value) || '';
            console.log('💬 Test message loaded:', testMessageField.value);
        }
        
        console.log('✅ SMS forms populated successfully');
    }
    
    /**
     * مدیریت ارسال فرم اتصال
     */
    async function handleConnectionFormSubmit(e) {
        e.preventDefault();
        
        try {
            console.log('💾 Saving SMS connection settings...');
            
            const formData = new FormData(e.target);
            const settings = {};
            
            // پردازش تمام فیلدهای فرم
            for (let [key, value] of formData.entries()) {
                // تبدیل شماره پنل به انگلیسی با استفاده از NumberUtils
                if (key === 'sms_panel_number' && value) {
                    value = NumberUtils.toEnglish(value);
                    console.log('📞 Panel number converted:', formData.get(key), '→', value);
                }
                settings[key] = value;
            }
            
            // اضافه کردن وضعیت چک‌باکس به طور مستقل (حتی اگر unchecked باشد)
            const enabledCheckbox = document.getElementById('sms_enabled');
            if (enabledCheckbox) {
                settings['sms_enabled'] = enabledCheckbox.checked;
            }
            
            console.log('Settings to save:', settings);
            
            // Create API path that works with XAMPP
            const apiPaths = [
                'proxy-settings.php', // Primary: For Live Server
                'http://localhost/datasave/backend/api/v1/settings.php',
                'http://127.0.0.1/datasave/backend/api/v1/settings.php',
                '/datasave/backend/api/v1/settings.php',
                '../backend/api/v1/settings.php'
            ];
            
            let apiPath = apiPaths[0]; // Default to proxy
            
            const response = await fetch(apiPath, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    action: 'save',
                    type: 'sms_connection',
                    settings: settings 
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Save response:', data);
            
            if (data.success) {
                showSuccessMessage('تنظیمات اتصال با موفقیت ذخیره شد');
                // Reload settings to confirm save
                await loadSMSSettingsData();
            } else {
                throw new Error(data.message || 'خطای نامشخص');
            }
        } catch (error) {
            console.error('❌ Error saving SMS connection settings:', error);
            showErrorMessage('خطا در ذخیره تنظیمات: ' + error.message);
        }
    }
    
    /**
     * مدیریت ارسال فرم OTP
     */
    async function handleOTPFormSubmit(e) {
        e.preventDefault();
        
        try {
            console.log('💾 Saving OTP settings...');
            
            const formData = new FormData(e.target);
            const settings = Object.fromEntries(formData);
            
            console.log('OTP settings to save:', settings);
            
            // Create API path that works with XAMPP
            const apiPaths = [
                'http://localhost/datasave/backend/api/v1/settings.php', // Primary: Direct XAMPP
                'http://127.0.0.1/datasave/backend/api/v1/settings.php',
                'proxy-settings.php', // Fallback: For Live Server
                '/datasave/backend/api/v1/settings.php',
                '../backend/api/v1/settings.php'
            ];
            
            let apiPath = apiPaths[0]; // Default to direct XAMPP
            
            const response = await fetch(apiPath, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    action: 'save',
                    type: 'sms_otp',
                    settings: settings 
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('OTP save response:', data);
            
            if (data.success) {
                showSuccessMessage('تنظیمات OTP با موفقیت ذخیره شد');
                // Reload settings to confirm save
                await loadSMSSettingsData();
            } else {
                throw new Error(data.message || 'خطای نامشخص');
            }
        } catch (error) {
            console.error('❌ Error saving OTP settings:', error);
            showErrorMessage('خطا در ذخیره تنظیمات OTP: ' + error.message);
        }
    }
    
    /**
     * مدیریت ارسال تست SMS
     */
    async function handleTestSMSSubmit(e) {
        e.preventDefault();
        
        try {
            console.log('📧 Sending test SMS...');
            
            let phone = document.getElementById('test_phone_number').value;
            const message = document.getElementById('test_message_text').value;
            
            // تبدیل شماره تلفن به انگلیسی
            if (phone && typeof NumberUtils !== 'undefined') {
                const originalPhone = phone;
                phone = NumberUtils.toEnglish(phone);
                if (originalPhone !== phone) {
                    console.log('📱 Phone number converted for SMS:', originalPhone, '→', phone);
                }
            }
            
            if (!phone || !message) {
                throw new Error('لطفاً شماره تلفن و متن پیام را وارد کنید');
            }
            
            console.log('Sending SMS to:', phone, 'Message:', message);
            
            // Create API path that works with XAMPP  
            const apiPaths = [
                'http://localhost/datasave/backend/api/v1/sms.php', // Primary: Direct XAMPP
                'http://127.0.0.1/datasave/backend/api/v1/sms.php',
                'proxy-sms-test.php', // Fallback: For Live Server
                '/datasave/backend/api/v1/sms.php',
                '../backend/api/v1/sms.php'
            ];
            
            let apiPath = apiPaths[0]; // Default to direct XAMPP
            
            const response = await fetch(apiPath, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    action: 'test_sms',
                    phone: phone, 
                    message: message 
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Test SMS response:', data);
            
            if (data.success) {
                showSuccessMessage('پیامک تست با موفقیت ارسال شد');
                // Clear form
                document.getElementById('test_phone_number').value = '';
                document.getElementById('test_message_text').value = '';
            } else {
                throw new Error(data.message || 'خطای نامشخص در ارسال پیامک');
            }
        } catch (error) {
            console.error('❌ Error sending test SMS:', error);
            showErrorMessage('خطا در ارسال پیامک تست: ' + error.message);
        }
    }
    
    /**
     * بارگذاری گزارشات SMS پیشرفته
     */
    async function loadSMSReports(filters = {}) {
        try {
            console.log('📊 Loading advanced SMS reports with filters:', filters);
            
            showReportsLoading();
            
            const params = {
                action: 'get_reports',
                limit: 50,
                offset: (currentReportsPage - 1) * 50,
                ...filters
            };
            
            const apiPaths = [
                'http://localhost/datasave/backend/api/v1/sms.php',
                'http://127.0.0.1/datasave/backend/api/v1/sms.php',
                '/datasave/backend/api/v1/sms.php',
                '../backend/api/v1/sms.php'
            ];
            
            const response = await fetch(apiPaths[0], {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(params)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('📊 Advanced SMS reports data received:', data);
            
            if (data.success && data.data) {
                displayAdvancedReports(data.data);
                updateReportsStatistics(data.data.stats);
                updateReportsPagination(data.data);
            } else {
                showReportsError(data.message || 'خطای نامشخص در دریافت گزارشات');
            }
            
            hideReportsLoading();
            
        } catch (error) {
            console.error('❌ Error loading advanced SMS reports:', error);
            showReportsError(error.message);
            hideReportsLoading();
        }
    }

    /**
     * نمایش گزارشات در جدول پیشرفته
     */
    function displayAdvancedReports(data) {
        const tableBody = document.getElementById('advancedReportsTableBody');
        const reportsTable = document.getElementById('reportsTable');
        const emptyState = document.getElementById('emptyReportsState');
        const metaInfo = document.getElementById('reportsMetaInfo');
        
        if (!data.reports || data.reports.length === 0) {
            reportsTable.style.display = 'none';
            emptyState.style.display = 'block';
            metaInfo.textContent = 'هیچ گزارشی یافت نشد';
            return;
        }
        
        // Update meta information
        metaInfo.textContent = `${data.reports.length} گزارش از ${data.total} (صفحه ${currentReportsPage} از ${Math.ceil(data.total / data.limit)})`;
        
        // Clear existing rows
        tableBody.innerHTML = '';
        
        // Add new rows with enhanced styling
        data.reports.forEach(report => {
            const row = document.createElement('tr');
            row.className = 'table-row-hover';
            
            const statusClass = getAdvancedStatusClass(report.delivery_status);
            const statusLabel = getAdvancedStatusLabel(report.delivery_status);
            const typeLabel = getAdvancedTypeLabel(report.message_type);
            
            row.innerHTML = `
                <td class="cell-id">${report.id}</td>
                <td class="cell-phone">
                    <div class="phone-display">${report.recipient_phone}</div>
                </td>
                <td class="cell-message">
                    <div class="message-preview" title="${escapeHtml(report.message_text)}">
                        ${escapeHtml(report.message_text.substring(0, 50))}${report.message_text.length > 50 ? '...' : ''}
                    </div>
                </td>
                <td class="cell-type">
                    <span class="type-badge">${typeLabel}</span>
                </td>
                <td class="cell-status">
                    <span class="status-badge ${statusClass}">${statusLabel}</span>
                </td>
                <td class="cell-otp">
                    <code class="otp-code">${report.otp_code || '-'}</code>
                </td>
                <td class="cell-datetime">
                    <div class="datetime-display">${formatAdvancedDateTime(report.created_at)}</div>
                </td>
                <td class="cell-datetime">
                    <div class="datetime-display">${formatAdvancedDateTime(report.updated_at)}</div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        reportsTable.style.display = 'table';
        emptyState.style.display = 'none';
    }

    /**
     * بروزرسانی آمار گزارشات
     */
    function updateReportsStatistics(stats) {
        if (!stats) return;
        
        const statusStats = stats.status || {};
        const typeStats = stats.types || {};
        
        // محاسبه مجموع‌ها
        const total = Object.values(statusStats).reduce((sum, count) => sum + parseInt(count), 0);
        const successful = (parseInt(statusStats.delivered) || 0) + (parseInt(statusStats.verified) || 0);
        const pending = (parseInt(statusStats.pending) || 0) + (parseInt(statusStats.sent) || 0);
        const failed = (parseInt(statusStats.failed) || 0) + (parseInt(statusStats.expired) || 0) + 
                      (parseInt(statusStats.blocked) || 0) + (parseInt(statusStats.undelivered) || 0);
        
        // بروزرسانی کارت‌ها
        const totalElement = document.getElementById('totalSMSCount');
        const successElement = document.getElementById('successSMSCount');
        const pendingElement = document.getElementById('pendingSMSCount');
        const failedElement = document.getElementById('failedSMSCount');
        
        if (totalElement) totalElement.textContent = total.toLocaleString('fa-IR');
        if (successElement) successElement.textContent = successful.toLocaleString('fa-IR');
        if (pendingElement) pendingElement.textContent = pending.toLocaleString('fa-IR');
        if (failedElement) failedElement.textContent = failed.toLocaleString('fa-IR');
    }

    /**
     * بروزرسانی صفحه‌بندی گزارشات
     */
    function updateReportsPagination(data) {
        const paginationContainer = document.getElementById('reportsPaginationContainer');
        const prevButton = document.getElementById('prevReportsPage');
        const nextButton = document.getElementById('nextReportsPage');
        const pageInfo = document.getElementById('reportsPageInfo');
        
        if (data.total <= data.limit) {
            paginationContainer.style.display = 'none';
            return;
        }
        
        totalReportsPages = Math.ceil(data.total / data.limit);
        
        if (prevButton) prevButton.disabled = currentReportsPage <= 1;
        if (nextButton) nextButton.disabled = currentReportsPage >= totalReportsPages;
        if (pageInfo) pageInfo.textContent = `صفحه ${currentReportsPage} از ${totalReportsPages}`;
        
        paginationContainer.style.display = 'flex';
    }

    /**
     * نمایش حالت بارگذاری گزارشات
     */
    function showReportsLoading() {
        document.getElementById('reportsLoadingIndicator').style.display = 'block';
        document.getElementById('reportsTable').style.display = 'none';
        document.getElementById('emptyReportsState').style.display = 'none';
        document.getElementById('reportsErrorIndicator').style.display = 'none';
    }

    /**
     * مخفی کردن حالت بارگذاری گزارشات
     */
    function hideReportsLoading() {
        document.getElementById('reportsLoadingIndicator').style.display = 'none';
    }

    /**
     * نمایش خطای گزارشات
     */
    function showReportsError(message) {
        document.getElementById('reportsErrorMessage').textContent = message;
        document.getElementById('reportsErrorIndicator').style.display = 'block';
        document.getElementById('reportsTable').style.display = 'none';
        document.getElementById('emptyReportsState').style.display = 'none';
    }

    // متغیرهای گزارشات
    let currentReportsPage = 1;
    let totalReportsPages = 1;
    let currentReportsFilters = {};

    /**
     * اعمال فیلترهای گزارشات
     */
    function applyReportsFilters() {
        const dateFromElement = document.getElementById('dateFromFilter');
        const dateToElement = document.getElementById('dateToFilter');
        
        currentReportsFilters = {
            status: document.getElementById('statusFilter')?.value || '',
            type: document.getElementById('typeFilter')?.value || '',
            phone: document.getElementById('phoneFilter')?.value || '',
            search: document.getElementById('searchFilter')?.value || '',
            date_from: convertPersianDateToGregorian(dateFromElement?.value || '') || '',
            date_to: convertPersianDateToGregorian(dateToElement?.value || '') || ''
        };
        
        // حذف فیلترهای خالی
        Object.keys(currentReportsFilters).forEach(key => {
            if (!currentReportsFilters[key]) {
                delete currentReportsFilters[key];
            }
        });
        
        currentReportsPage = 1;
        console.log('🔍 Applying reports filters:', currentReportsFilters);
        loadSMSReports(currentReportsFilters);
    }

    /**
     * تبدیل تاریخ فارسی به میلادی برای API
     */
    function convertPersianDateToGregorian(persianDateString) {
        if (!persianDateString) return '';
        
        try {
            // اگر المنت data-gregorian دارد، از آن استفاده کن
            const dateElement = document.querySelector(`input[value="${persianDateString}"]`);
            if (dateElement && dateElement.getAttribute('data-gregorian')) {
                return dateElement.getAttribute('data-gregorian');
            }
            
            // در غیر این صورت تجزیه و تبدیل کن
            const parts = persianDateString.split('/');
            if (parts.length === 3) {
                const year = parseInt(NumberUtils?.toEnglish(parts[0]) || parts[0]);
                const month = parseInt(NumberUtils?.toEnglish(parts[1]) || parts[1]);
                const day = parseInt(NumberUtils?.toEnglish(parts[2]) || parts[2]);
                
                // استفاده از ScrollingJalaliPicker به جای PersianCalendar
                const picker = new ScrollingJalaliPicker(document.createElement('input'));
                const gregorianDate = picker.jalaliToGregorian(year, month, day);
                return gregorianDate.toISOString().split('T')[0]; // YYYY-MM-DD format
            }
        } catch (error) {
            console.error('Error converting Persian date to Gregorian:', error);
        }
        
        return '';
    }

    /**
     * پاک کردن فیلترهای گزارشات
     */
    function clearReportsFilters() {
        ['statusFilter', 'typeFilter', 'phoneFilter', 'searchFilter', 'dateFromFilter', 'dateToFilter']
            .forEach(id => {
                const element = document.getElementById(id);
                if (element) element.value = '';
            });
        
        currentReportsFilters = {};
        currentReportsPage = 1;
        loadSMSReports();
    }

    /**
     * رفرش گزارشات
     */
    function refreshReports() {
        console.log('🔄 Refreshing reports...');
        loadSMSReports(currentReportsFilters);
    }

    /**
     * رفتن به صفحه خاص گزارشات
     */
    function goToReportsPage(direction) {
        if (direction === -1 && currentReportsPage > 1) {
            currentReportsPage--;
        } else if (direction === 1 && currentReportsPage < totalReportsPages) {
            currentReportsPage++;
        }
        
        loadSMSReports(currentReportsFilters);
    }

    /**
     * دریافت کلاس CSS برای وضعیت پیشرفته
     */
    function getAdvancedStatusClass(status) {
        const classes = {
            'delivered': 'status-success',
            'verified': 'status-success',
            'pending': 'status-warning',
            'sent': 'status-warning',
            'failed': 'status-danger',
            'expired': 'status-danger',
            'blocked': 'status-danger',
            'undelivered': 'status-danger',
            'saved': 'status-info',
            'unknown': 'status-secondary'
        };
        return classes[status] || 'status-secondary';
    }

    /**
     * دریافت برچسب وضعیت پیشرفته
     */
    function getAdvancedStatusLabel(status) {
        const labels = {
            'pending': '⏳ در انتظار',
            'sent': '📤 ارسال شده',
            'delivered': '✅ تحویل داده شده',
            'failed': '❌ ناموفق',
            'expired': '⏰ منقضی شده',
            'verified': '✅ تأیید شده',
            'saved': '💾 ذخیره شده',
            'blocked': '🚫 مسدود شده',
            'undelivered': '📵 عدم تحویل',
            'unknown': '❓ نامشخص'
        };
        return labels[status] || status;
    }

    /**
     * دریافت برچسب نوع پیام پیشرفته
     */
    function getAdvancedTypeLabel(type) {
        const labels = {
            'general': '📄 عمومی',
            'otp': '🔐 OTP',
            'notification': '🔔 اطلاع‌رسانی',
            'test': '🧪 تست'
        };
        return labels[type] || type;
    }

    /**
     * فرمت‌دهی تاریخ و زمان پیشرفته
     */
    function formatAdvancedDateTime(dateTime) {
        if (!dateTime) return '-';
        
        const date = new Date(dateTime);
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        
        return date.toLocaleString('fa-IR', options);
    }

    /**
     * فرار از HTML برای جلوگیری از XSS
     */
    function escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    /**
     * مقداردهی اولیه date picker های فارسی
     */
    function initializePersianDatePickers() {
        try {
            console.log('📅 Initializing Persian date pickers...');
            
            // استفاده از ScrollingJalaliPicker به جای PersianCalendar
            setupDatePickers();
        } catch (error) {
            console.error('❌ Error initializing Persian date pickers:', error);
            convertToRegularDateInputs();
        }
    }

    /**
     * بارگذاری ماژول تقویم فارسی
     */
    function loadPersianCalendarModule() {
        // استفاده از ScrollingJalaliPicker به جای PersianCalendar
        return Promise.resolve();
    }

    /**
     * راه‌اندازی date picker های فارسی
     */
    function setupDatePickers() {
        try {
            const dateInputs = document.querySelectorAll('.persian-datepicker');
            
            dateInputs.forEach(input => {
                // استفاده از ScrollingJalaliPicker به جای تقویم سفارشی
                input.addEventListener('click', () => {
                    const picker = new ScrollingJalaliPicker(input, {
                        onSelect: (selectedDate, persianDate, isoDate) => {
                            // تاریخ انتخاب شده در input قرار می‌گیرد
                            input.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    });
                    picker.open();
                });
            });
            
            console.log(`✅ ${dateInputs.length} Persian date pickers initialized`);
        } catch (error) {
            console.error('❌ Error setting up date pickers:', error);
        }
    }

    /**
     * ایجاد wrapper برای date picker
     */
    function createDatePickerWrapper(input) {
        // استفاده از ScrollingJalaliPicker به جای wrapper سفارشی
        return input.parentNode;
    }

    /**
     * راه‌اندازی رویدادهای date picker
     */
    function setupDatePickerEvents(input, wrapper) {
        // استفاده از ScrollingJalaliPicker به جای رویدادهای سفارشی
        // تمام رویدادها در setupDatePickers مدیریت می‌شوند
    }

    /**
     * نمایش date picker فارسی
     */
    function showPersianDatePicker(input) {
        // استفاده از ScrollingJalaliPicker به جای date picker سفارشی
        const picker = new ScrollingJalaliPicker(input);
        picker.open();
    }

    /**
     * ایجاد popup تقویم فارسی
     */
    function createPersianCalendarPopup(input) {
        // استفاده از ScrollingJalaliPicker به جای popup سفارشی
        return document.createElement('div');
    }

    /**
     * ایجاد HTML تقویم
     */
    function createCalendarHTML(date, input) {
        // استفاده از ScrollingJalaliPicker به جای HTML سفارشی
        return '<div></div>';
    }

    /**
     * راه‌اندازی رویدادهای تقویم
     */
    function setupCalendarEvents(popup, input) {
        // استفاده از ScrollingJalaliPicker به جای رویدادهای سفارشی
    }

    /**
     * تجزیه تاریخ فارسی از رشته
     */
    function parsePersianDate(dateString) {
        try {
            const parts = dateString.split('/');
            if (parts.length === 3) {
                const year = parseInt(NumberUtils?.toEnglish(parts[0]) || parts[0]);
                const month = parseInt(NumberUtils?.toEnglish(parts[1]) || parts[1]);
                const day = parseInt(NumberUtils?.toEnglish(parts[2]) || parts[2]);
                
                return { year, month, day };
            }
        } catch (error) {
            console.error('Error parsing Persian date:', error);
        }
        
        // استفاده از ScrollingJalaliPicker به جای PersianCalendar
        const picker = new ScrollingJalaliPicker(document.createElement('input'));
        return picker.gregorianToJalali(new Date());
    }

    /**
     * فرمت کردن تاریخ میلادی برای API
     */
    function formatGregorianDate(jYear, jMonth, jDay) {
        try {
            // استفاده از ScrollingJalaliPicker به جای PersianCalendar
            const picker = new ScrollingJalaliPicker(document.createElement('input'));
            const gregorianDate = picker.jalaliToGregorian(jYear, jMonth, jDay);
            return gregorianDate.toISOString().split('T')[0]; // YYYY-MM-DD
        } catch (error) {
            console.error('Error formatting Gregorian date:', error);
            return new Date().toISOString().split('T')[0];
        }
    }

    /**
     * موقعیت‌یابی popup تقویم
     */
    function positionCalendarPopup(popup, input) {
        const rect = input.getBoundingClientRect();
        const popupRect = popup.getBoundingClientRect();
        
        let top = rect.bottom + window.scrollY + 5;
        let left = rect.left + window.scrollX;
        
        // اگر popup از صفحه خارج می‌شود، موقعیت را تنظیم کن
        if (left + popupRect.width > window.innerWidth) {
            left = window.innerWidth - popupRect.width - 10;
        }
        
        if (top + popupRect.height > window.innerHeight + window.scrollY) {
            top = rect.top + window.scrollY - popupRect.height - 5;
        }
        
        popup.style.top = top + 'px';
        popup.style.left = left + 'px';
    }

    /**
     * تبدیل به input های تاریخ معمولی در صورت خطا
     */
    function convertToRegularDateInputs() {
        // استفاده از ScrollingJalaliPicker به جای تبدیل به input های معمولی
        console.log('⚠️ Using ScrollingJalaliPicker as fallback');
    }
    
    /**
     * پر کردن جدول گزارشات SMS
     */
    function populateSMSReportsTable(reports) {
        const tbody = document.getElementById('reportsTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (reports.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="padding: var(--spacing-6); text-align: center; color: var(--text-secondary);">هیچ گزارشی یافت نشد</td></tr>';
            return;
        }
        
        reports.forEach(report => {
            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid var(--glass-border)';
            row.innerHTML = `
                <td style="padding: var(--spacing-3); color: var(--text-primary);">${report.id}</td>
                <td style="padding: var(--spacing-3); color: var(--text-primary);">${report.recipient_phone}</td>
                <td style="padding: var(--spacing-3); color: var(--text-primary);">${getSMSMessageTypeText(report.message_type)}</td>
                <td style="padding: var(--spacing-3);"><span class="status-badge status-${report.delivery_status}" style="padding: var(--spacing-1) var(--spacing-2); border-radius: var(--radius-sm); font-size: var(--font-size-sm);">${getSMSStatusText(report.delivery_status)}</span></td>
                <td style="padding: var(--spacing-3); color: var(--text-primary);">${formatSMSDate(report.created_at)}</td>
            `;
            tbody.appendChild(row);
        });
    }
    
    /**
     * تبدیل نوع پیام به متن فارسی
     */
    function getSMSMessageTypeText(type) {
        const types = { 'general': 'عادی', 'otp': 'کد OTP', 'test': 'تست' };
        return types[type] || type;
    }
    
    /**
     * تبدیل وضعیت به متن فارسی
     */
    function getSMSStatusText(status) {
        const statuses = { 'sent': 'ارسال شده', 'failed': 'ناموفق', 'pending': 'در انتظار' };
        return statuses[status] || status;
    }
    
    /**
     * فرمت کردن تاریخ
     */
    function formatSMSDate(dateString) {
        return new Date(dateString).toLocaleDateString('fa-IR');
    }
    
    /**
     * نمایش پیام خطا
     */
    function showErrorMessage(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: #ff6b6b;
            color: white; padding: 16px; border-radius: 8px; z-index: 10000;
            font-family: 'Vazirmatn', sans-serif;
        `;
        notification.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }
    
    /**
     * نمایش پیام موفقیت
     */
    function showSuccessMessage(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: #51cf66;
            color: white; padding: 16px; border-radius: 8px; z-index: 10000;
            font-family: 'Vazirmatn', sans-serif;
        `;
        notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    function showMessage(message, type = 'info') {
        alert(message);
    }

    /**
     * نمایش پیام "به زودی"
     */
    function showComingSoon(feature) {
        alert(`${feature} در حال توسعه است.`);
    }
    
    /**
     * ذخیره داده‌های تست در دیتابیس به عنوان تنظیمات
     */
    async function handleSaveTestData() {
        try {
            console.log('💾 Saving test data to database as settings...');
            
            let phone = document.getElementById('test_phone_number').value;
            const message = document.getElementById('test_message_text').value;
            
            if (phone && typeof NumberUtils !== 'undefined') {
                phone = NumberUtils.toEnglish(phone);
            }
            
            if (!phone || !message) {
                throw new Error('لطفاً شماره تلفن و متن پیام را وارد کنید');
            }
            
            // ذخیره داده‌ها به عنوان تنظیمات SMS
            const response = await fetch('proxy-settings.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    action: 'save',
                    settings: {
                        test_phone_number: phone,
                        test_message_text: message
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                showSuccessMessage('داده‌های تست با موفقیت در دیتابیس ذخیره شد');
                console.log('✅ Test data saved as settings successfully:', data);
                
                // همزمان در لاگ SMS نیز ثبت کن
                try {
                    await fetch('http://localhost/datasave/backend/api/v1/sms.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            action: 'save_test_data',
                            phone: phone,
                            message: message,
                            message_type: 'test_saved'
                        })
                    });
                    console.log('📝 Test data also logged in SMS logs');
                } catch (logError) {
                    console.warn('⚠️ Failed to log test data:', logError);
                    // ادامه می‌دهیم چون اصل کار (ذخیره settings) موفق بوده
                }
            } else {
                throw new Error(data.message || 'خطای نامشخص در ذخیره‌سازی');
            }
        } catch (error) {
            console.error('❌ Error saving test data:', error);
            showErrorMessage('خطا در ذخیره داده‌های تست: ' + error.message);
        }
    }
    
    /**
     * ارسال OTP تست
     */
    async function handleTestOTPSubmit(e) {
        e.preventDefault();
        
        try {
            console.log('🔐 Sending test OTP...');
            
            let phone = document.getElementById('otp_test_phone').value;
            
            if (phone && typeof NumberUtils !== 'undefined') {
                const originalPhone = phone;
                phone = NumberUtils.toEnglish(phone);
                if (originalPhone !== phone) {
                    console.log('📱 OTP Phone number converted:', originalPhone, '→', phone);
                }
            }
            
            if (!phone) {
                throw new Error('لطفاً شماره تلفن را وارد کنید');
            }
            
            const response = await fetch('http://localhost/datasave/backend/api/v1/sms.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    action: 'send_otp',
                    phone: phone,
                    message_type: 'otp'
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                console.log('✅ OTP Response Data:', data);
                
                // استفاده از expires_at_iso برای timing دقیق
                const expiryTime = data.expires_at_iso || data.expires_at;
                const otpLength = data.otp_length || 5;
                
                // نمایش کارت تایید OTP
                showOTPVerificationCard(phone, data.otp_code, expiryTime, otpLength);
                showSuccessMessage(`کد OTP به شماره ${phone} ارسال شد`);
                console.log('✅ OTP sent successfully:', data);
            } else {
                throw new Error(data.message || 'خطای نامشخص در ارسال OTP');
            }
        } catch (error) {
            console.error('❌ Error sending OTP:', error);
            showErrorMessage('خطا در ارسال OTP: ' + error.message);
        }
    }
    
    /**
     * راستی‌آزمایی OTP
     */
    async function handleOTPVerification(e) {
        e.preventDefault();
        
        try {
            console.log('✅ Verifying OTP...');
            
            let enteredCode = document.getElementById('verification_code').value;
            const phoneElement = document.getElementById('sentPhoneNumber');
            let phone = phoneElement ? phoneElement.textContent : '';
            
            // تبدیل کد وارد شده به انگلیسی
            if (NumberUtils) {
                enteredCode = NumberUtils.toEnglish(enteredCode);
                phone = NumberUtils.toEnglish(phone); // شماره تلفن هم باید انگلیسی باشد
            }
            
            if (!enteredCode || !enteredCode.trim()) {
                throw new Error('لطفاً کد را وارد کنید');
            }
            
            // اعتبارسنجی کد با NumberUtils
            if (NumberUtils && !NumberUtils.validateOTP(enteredCode)) {
                throw new Error('کد وارد شده معتبر نیست');
            }
            
            console.log('🔍 Verifying OTP code:', { phone, code: enteredCode });
            
            const response = await fetch('http://localhost/datasave/backend/api/v1/sms.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    action: 'verify_otp',
                    phone: phone,
                    code: enteredCode
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('📨 OTP verification response:', data);
            
            if (data.success) {
                // موفقیت - متوقف کردن شمارش معکوس
                if (window.otpCountdownTimer) {
                    clearInterval(window.otpCountdownTimer);
                }
                
                // نمایش پیام موفقیت در کارت
                showOTPSuccessMessage();
                console.log('✅ OTP verified successfully');
                
                // پاک کردن فیلد شماره تلفن بعد از 5 ثانیه
                setTimeout(() => {
                    hideOTPVerificationCard();
                    const phoneInput = document.getElementById('otp_test_phone');
                    if (phoneInput) {
                        phoneInput.value = '';
                    }
                }, 5000);
                
            } else {
                // نمایش خطا بر اساس نوع مشکل
                let errorClass = 'error';
                let errorMessage = data.message;
                
                if (data.message.includes('منقضی')) {
                    errorClass = 'warning';
                    errorMessage = '⏰ زمان کد به پایان رسیده است';
                } else if (data.message.includes('نادرست')) {
                    errorClass = 'error';  
                    errorMessage = '❌ کد وارد شده اشتباه است';
                }
                
                showErrorMessage(errorMessage);
                
                // اگر منقضی شده، شمارش معکوس را متوقف کن
                if (data.message.includes('منقضی')) {
                    if (window.otpCountdownTimer) {
                        clearInterval(window.otpCountdownTimer);
                    }
                    const countdownDiv = document.getElementById('otpCountdown');
                    if (countdownDiv) {
                        countdownDiv.innerHTML = '⏰ کد منقضی شده است';
                        countdownDiv.style.color = '#dc2626';
                    }
                    
                    // غیرفعال کردن کادر ورودی
                    const codeInput = document.getElementById('verification_code');
                    if (codeInput) {
                        codeInput.disabled = true;
                        codeInput.style.backgroundColor = '#f3f4f6';
                        codeInput.style.color = '#9ca3af';
                        codeInput.placeholder = 'کد منقضی شده';
                    }
                }
            }
        } catch (error) {
            console.error('❌ Error verifying OTP:', error);
            showErrorMessage('خطا در تایید OTP: ' + error.message);
        }
    }
    
    /**
     * لغو راستی‌آزمایی OTP
     */
    function handleCancelVerification() {
        hideOTPVerificationCard();
        document.getElementById('otp_test_phone').value = '';
        document.getElementById('verification_code').value = '';
    }
    
    /**
     * نمایش کارت راستی‌آزمایی OTP
     */
    function showOTPVerificationCard(phone, otpCode, expiresAt, otpLength = 5) {
        const card = document.getElementById('otpVerificationCard');
        
        // اطمینان از بازیابی محتوای اصلی کارت
        resetOTPCardContent();
        
        const phoneSpan = document.getElementById('sentPhoneNumber');
        const countdownDiv = document.getElementById('otpCountdown');
        const codeInput = document.getElementById('verification_code');
        
        if (card && phoneSpan) {
            phoneSpan.textContent = NumberUtils ? NumberUtils.toPersian(phone) : phone;
            card.style.display = 'block';
            
            // تنظیم placeholder بر اساس طول کد OTP دریافت شده از سرور
            if (codeInput) {
                // استفاده از otpLength از پارامتر یا از طول otpCode
                const length = otpLength || (otpCode ? otpCode.length : 5);
                let placeholder = '';
                for (let i = 1; i <= length; i++) {
                    placeholder += i.toString();
                }
                
                // تبدیل placeholder به فارسی اگر NumberUtils موجود باشد
                codeInput.placeholder = NumberUtils ? NumberUtils.toPersian(placeholder) : placeholder;
                codeInput.maxLength = length.toString();
                
                console.log('📝 OTP Input configured:', { length, placeholder: codeInput.placeholder });
                
                // بهبود استایل کادر ورودی
                codeInput.style.background = '#ffffff';
                codeInput.style.color = '#1f2937';
                codeInput.style.fontSize = '18px';
                codeInput.style.fontWeight = 'bold';
                codeInput.style.letterSpacing = '3px';
                codeInput.style.textAlign = 'center';
                codeInput.style.border = '2px solid #f59e0b';
                codeInput.style.borderRadius = '8px';
                codeInput.style.boxShadow = '0 2px 4px rgba(245, 158, 11, 0.2)';
                
                // پاک کردن event listener قبلی (اگر موجود باشد)
                const newCodeInput = codeInput.cloneNode(true);
                codeInput.parentNode.replaceChild(newCodeInput, codeInput);
                
                // افزودن event listener جدید برای تبدیل اعداد فارسی
                newCodeInput.addEventListener('input', function(e) {
                    if (NumberUtils) {
                        // تبدیل فوری اعداد فارسی به انگلیسی
                        const englishValue = NumberUtils.toEnglish(e.target.value);
                        // حذف کاراکترهای غیرعددی
                        const numericValue = englishValue.replace(/\D/g, '');
                        e.target.value = numericValue;
                        
                        // محدود کردن به طول مشخص
                        if (numericValue.length > length) {
                            e.target.value = numericValue.substring(0, length);
                        }
                    }
                });
                
                // پاک کردن مقدار قبلی و ریست کردن وضعیت
                newCodeInput.value = '';
                newCodeInput.disabled = false;
                newCodeInput.style.backgroundColor = '#ffffff';
                newCodeInput.style.color = '#1f2937';
                newCodeInput.style.borderColor = '#f59e0b';
                
                // فوکوس روی فیلد کد جدید
                setTimeout(() => {
                    newCodeInput.focus();
                }, 100);
            }
            
            // شروع شمارش معکوس
            if (countdownDiv && expiresAt) {
                startOTPCountdown(expiresAt, countdownDiv);
            }
        }
    }
    
    /**
     * نمایش پیام موفقیت OTP در کارت
     */
    function showOTPSuccessMessage() {
        const card = document.getElementById('otpVerificationCard');
        if (!card) return;
        
        // پیدا کردن محتوای کارت
        const cardContent = card.querySelector('.card-content') || card;
        
        // ایجاد پیام موفقیت
        const successDiv = document.createElement('div');
        successDiv.innerHTML = `
            <div style="text-align: center; padding: 30px;">
                <div style="font-size: 4rem; color: #059669; margin-bottom: 20px;">
                    ✅
                </div>
                <h2 style="color: #059669; font-size: 1.5rem; font-weight: bold; margin-bottom: 10px;">
                    راستی‌آزمایی موفق
                </h2>
                <p style="color: #6b7280; font-size: 1rem;">
                    کد OTP با موفقیت تایید شد
                </p>
                <div style="margin-top: 20px; font-size: 0.9rem; color: #9ca3af;">
                    این پنجره در 5 ثانیه بسته می‌شود...
                </div>
            </div>
        `;
        
        // جایگزینی محتوای کارت
        cardContent.innerHTML = successDiv.innerHTML;
        
        // افکت انیمیشن
        card.style.transform = 'scale(1.05)';
        card.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 300);
    }

    /**
     * مخفی کردن کارت راستی‌آزمایی OTP
     */
    function hideOTPVerificationCard() {
        const card = document.getElementById('otpVerificationCard');
        if (card) {
            card.style.display = 'none';
            
            // بازیابی محتوای اصلی کارت
            resetOTPCardContent();
        }
        
        // پاک کردن timer
        if (window.otpCountdownTimer) {
            clearInterval(window.otpCountdownTimer);
            delete window.otpCountdownTimer;
        }
    }
    
    /**
     * بازیابی محتوای اصلی کارت OTP
     */
    function resetOTPCardContent() {
        const card = document.getElementById('otpVerificationCard');
        if (!card) return;
        
        // محتوای اصلی کارت OTP
        const originalContent = `
            <div class="glass-card" style="margin: 20px 0;">
                <h3 style="color: #059669; margin-bottom: 15px;">
                    📱 تایید کد OTP
                </h3>
                <p style="margin-bottom: 15px;">
                    کد تایید به شماره <span id="sentPhoneNumber" style="font-weight: bold; color: #f59e0b;"></span> ارسال شد
                </p>
                
                <div id="otpCountdown" style="margin-bottom: 15px; font-weight: bold; color: #059669;">
                    ⏱️ در حال بارگذاری...
                </div>
                
                <div style="margin-bottom: 20px;">
                    <input type="text" 
                           id="verification_code" 
                           placeholder="کد تایید را وارد کنید"
                           maxlength="6"
                           style="width: 100%; padding: 12px; border: 2px solid #f59e0b; border-radius: 8px; font-size: 18px; font-weight: bold; text-align: center; letter-spacing: 3px;">
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button onclick="handleOTPVerification(event)" 
                            style="flex: 1; padding: 12px; background: linear-gradient(135deg, #059669, #065f46); color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
                        ✅ تایید کد
                    </button>
                    <button onclick="handleCancelVerification()" 
                            style="flex: 1; padding: 12px; background: linear-gradient(135deg, #dc2626, #991b1b); color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
                        ❌ لغو
                    </button>
                </div>
            </div>
        `;
        
        card.innerHTML = originalContent;
        
        // ریست کردن استایل‌های انیمیشن
        card.style.transform = 'scale(1)';
        card.style.transition = '';
    }
    
    /**
     * شروع شمارش معکوس OTP
     */
    function startOTPCountdown(expiresAt, countdownElement) {
        // پاک کردن timer قبلی اگر وجود دارد
        if (window.otpCountdownTimer) {
            clearInterval(window.otpCountdownTimer);
        }
        
        console.log('🕒 Starting OTP countdown', { expiresAt, currentTime: new Date().toISOString() });
        
        // تبدیل زمان انقضا به timestamp
        let expireTime;
        try {
            if (typeof expiresAt === 'string') {
                // اگر رشته است، تبدیل به تاریخ
                expireTime = new Date(expiresAt.replace(' ', 'T')).getTime();
            } else {
                expireTime = new Date(expiresAt).getTime();
            }
        } catch (error) {
            console.error('❌ Error parsing expiry time:', error, { expiresAt });
            countdownElement.innerHTML = '⚠️ خطا در محاسبه زمان انقضا';
            return;
        }
        
        if (isNaN(expireTime)) {
            console.error('❌ Invalid expiry time:', expiresAt);
            countdownElement.innerHTML = '⚠️ زمان انقضا نامعتبر';
            return;
        }
        
        // شروع countdown
        const updateCountdown = () => {
            const now = Date.now();
            const distance = expireTime - now;
            
            console.log('⏱️ Countdown update', { 
                now: new Date(now).toISOString(), 
                expiry: new Date(expireTime).toISOString(), 
                distance: distance / 1000 + ' seconds' 
            });
            
            if (distance <= 0) {
                clearInterval(window.otpCountdownTimer);
                countdownElement.innerHTML = '⏰ کد منقضی شده است';
                countdownElement.style.color = '#dc2626';
                
                // غیرفعال کردن کادر ورودی
                const codeInput = document.getElementById('verification_code');
                if (codeInput) {
                    codeInput.disabled = true;
                    codeInput.style.backgroundColor = '#f3f4f6';
                    codeInput.style.color = '#9ca3af';
                    codeInput.placeholder = 'کد منقضی شده';
                }
                return;
            }
            
            const totalMinutes = Math.floor(distance / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // تبدیل به فارسی اگر امکان دارد
            const minutesText = NumberUtils ? NumberUtils.toPersian(totalMinutes.toString()) : totalMinutes;
            const secondsText = NumberUtils ? NumberUtils.toPersian(seconds.toString().padStart(2, '0')) : seconds.toString().padStart(2, '0');
            
            countdownElement.innerHTML = `⏱️ زمان باقی‌مانده: ${minutesText}:${secondsText}`;
            countdownElement.style.color = distance < 60000 ? '#dc2626' : '#059669'; // قرمز اگر کمتر از 1 دقیقه
        };
        
        // اجرای فوری و سپس هر ثانیه
        updateCountdown();
        window.otpCountdownTimer = setInterval(updateCountdown, 1000);
    }
    
    /**
     * مدیریت کلیدهای میانبر برای صفحه گزارشات
     */
    function handleReportsKeyboard(e) {
        // Only handle if we're on reports page
        if (currentPage !== 'reports') return;
        
        // Ctrl+R or F5: Refresh reports
        if ((e.ctrlKey && e.key === 'r') || e.key === 'F5') {
            e.preventDefault();
            refreshReports();
        }
        
        // Ctrl+F: Focus search filter
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            const searchFilter = document.getElementById('searchFilter');
            if (searchFilter) searchFilter.focus();
        }
        
        // Enter in filter fields: Apply filters
        if (e.key === 'Enter' && e.target.matches('.filter-input, .filter-select')) {
            applyReportsFilters();
        }
    }
    
    // API عمومی
    return {
        init: init,
        loadPage: loadPage,
        loadDashboard: loadDashboard,
        loadProfileSettings: loadProfileSettings,
        loadUserPage: loadUserPage,
        loadSMSSettings: loadSMSSettings,
        showComingSoon: showComingSoon,
        // Reports API
        applyReportsFilters: applyReportsFilters,
        clearReportsFilters: clearReportsFilters,
        refreshReports: refreshReports,
        goToReportsPage: goToReportsPage
    };
})();

// بارگذاری خودکار هنگام آماده شدن DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ContentModule.init);
} else {
    ContentModule.init();
}

// اتصال به window برای دسترسی سراسری
window.ContentModule = ContentModule;

// Global functions for HTML access
window.loadSMSSettings = function() {
    ContentModule.loadSMSSettings();
};

window.showComingSoon = function(feature) {
    ContentModule.showComingSoon(feature);
};

// Global OTP functions for HTML onclick events
window.handleOTPVerification = async function(event) {
    try {
        event.preventDefault();
        
        console.log('✅ Verifying OTP...');
        
        let enteredCode = document.getElementById('verification_code').value;
        const phoneElement = document.getElementById('sentPhoneNumber');
        let phone = phoneElement ? phoneElement.textContent : '';
        
        // تبدیل کد وارد شده به انگلیسی
        if (typeof NumberUtils !== 'undefined') {
            enteredCode = NumberUtils.toEnglish(enteredCode);
            phone = NumberUtils.toEnglish(phone); // شماره تلفن هم باید انگلیسی باشد
        }
        
        if (!enteredCode || !enteredCode.trim()) {
            throw new Error('لطفاً کد را وارد کنید');
        }
        
        console.log('🔍 Verifying OTP code:', { phone, code: enteredCode });
        
        const response = await fetch('http://localhost/datasave/backend/api/v1/sms.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                action: 'verify_otp',
                phone: phone,
                code: enteredCode
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📨 OTP verification response:', data);
        
        if (data.success) {
            // موفقیت - متوقف کردن شمارش معکوس
            if (window.otpCountdownTimer) {
                clearInterval(window.otpCountdownTimer);
            }
            
            // نمایش پیام موفقیت در کارت
            showOTPSuccessMessage();
            console.log('✅ OTP verified successfully');
            
            // پاک کردن فیلد شماره تلفن بعد از 5 ثانیه
            setTimeout(() => {
                hideOTPVerificationCard();
                const phoneInput = document.getElementById('otp_test_phone');
                if (phoneInput) {
                    phoneInput.value = '';
                }
            }, 5000);
            
        } else {
            // خطا - بررسی نوع خطا و نمایش پیام مناسب
            let errorMessage = data.message || 'کد وارد شده نادرست است';
            
            // بررسی نوع خطا بر اساس پیام
            if (errorMessage.includes('منقضی')) {
                // کد منقضی شده - متوقف کردن timer
                if (window.otpCountdownTimer) {
                    clearInterval(window.otpCountdownTimer);
                }
                
                const countdownDiv = document.getElementById('otpCountdown');
                if (countdownDiv) {
                    countdownDiv.innerHTML = '⏰ کد منقضی شده است';
                    countdownDiv.style.color = '#dc2626';
                }
                
                // غیرفعال کردن کادر ورودی
                const codeInput = document.getElementById('verification_code');
                if (codeInput) {
                    codeInput.disabled = true;
                    codeInput.style.backgroundColor = '#f3f4f6';
                    codeInput.style.color = '#9ca3af';
                    codeInput.placeholder = 'کد منقضی شده';
                }
                
                showErrorMessage('⏰ کد OTP منقضی شده است. لطفاً کد جدید درخواست کنید.');
            } else if (errorMessage.includes('نادرست') || errorMessage.includes('wrong')) {
                // کد اشتباه - پاک کردن فیلد ورودی
                const codeInput = document.getElementById('verification_code');
                if (codeInput) {
                    codeInput.value = '';
                    codeInput.focus();
                    // انیمیشن اشتباه
                    codeInput.style.borderColor = '#dc2626';
                    setTimeout(() => {
                        codeInput.style.borderColor = '#f59e0b';
                    }, 2000);
                }
                
                showErrorMessage('❌ کد وارد شده اشتباه است. مجدداً تلاش کنید.');
            } else {
                // سایر خطاها
                showErrorMessage('❌ خطا در تایید کد: ' + errorMessage);
            }
            
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('❌ Error verifying OTP:', error);
        showErrorMessage('خطا در تایید OTP: ' + error.message);
    }
};

window.handleCancelVerification = function() {
    hideOTPVerificationCard();
    document.getElementById('otp_test_phone').value = '';
    const verificationInput = document.getElementById('verification_code');
    if (verificationInput) {
        verificationInput.value = '';
    }
};

// Helper functions for OTP
window.showOTPSuccessMessage = function() {
    const card = document.getElementById('otpVerificationCard');
    if (!card) return;
    
    // پیدا کردن محتوای کارت
    const cardContent = card.querySelector('.card-content') || card;
    
    // ایجاد پیام موفقیت
    const successDiv = document.createElement('div');
    successDiv.innerHTML = `
        <div style="text-align: center; padding: 30px;">
            <div style="font-size: 4rem; color: #059669; margin-bottom: 20px;">
                ✅
            </div>
            <h2 style="color: #059669; font-size: 1.5rem; font-weight: bold; margin-bottom: 10px;">
                راستی‌آزمایی موفق
            </h2>
            <p style="color: #6b7280; font-size: 1rem;">
                کد OTP با موفقیت تایید شد
            </p>
            <div style="margin-top: 20px; font-size: 0.9rem; color: #9ca3af;">
                این پنجره در 5 ثانیه بسته می‌شود...
            </div>
        </div>
    `;
    
    // جایگزینی محتوای کارت
    cardContent.innerHTML = successDiv.innerHTML;
    
    // افکت انیمیشن
    card.style.transform = 'scale(1.05)';
    card.style.transition = 'transform 0.3s ease';
    
    setTimeout(() => {
        card.style.transform = 'scale(1)';
    }, 300);
};

window.hideOTPVerificationCard = function() {
    const card = document.getElementById('otpVerificationCard');
    if (card) {
        card.style.display = 'none';
        
        // بازیابی محتوای اصلی کارت
        resetOTPCardContent();
    }
    
    // پاک کردن timer
    if (window.otpCountdownTimer) {
        clearInterval(window.otpCountdownTimer);
        delete window.otpCountdownTimer;
    }
};

window.resetOTPCardContent = function() {
    const card = document.getElementById('otpVerificationCard');
    if (!card) return;
    
    // محتوای اصلی کارت OTP
    const originalContent = `
        <div class="glass-card" style="margin: 20px 0;">
            <h3 style="color: #059669; margin-bottom: 15px;">
                📱 تایید کد OTP
            </h3>
            <p style="margin-bottom: 15px;">
                کد تایید به شماره <span id="sentPhoneNumber" style="font-weight: bold; color: #f59e0b;"></span> ارسال شد
            </p>
            
            <div id="otpCountdown" style="margin-bottom: 15px; font-weight: bold; color: #059669;">
                ⏱️ در حال بارگذاری...
            </div>
            
            <div style="margin-bottom: 20px;">
                <input type="text" 
                       id="verification_code" 
                       placeholder="کد تایید را وارد کنید"
                       maxlength="6"
                       style="width: 100%; padding: 12px; border: 2px solid #f59e0b; border-radius: 8px; font-size: 18px; font-weight: bold; text-align: center; letter-spacing: 3px;">
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button onclick="handleOTPVerification(event)" 
                        style="flex: 1; padding: 12px; background: linear-gradient(135deg, #059669, #065f46); color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
                    ✅ تایید کد
                </button>
                <button onclick="handleCancelVerification()" 
                        style="flex: 1; padding: 12px; background: linear-gradient(135deg, #dc2626, #991b1b); color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
                    ❌ لغو
                </button>
            </div>
        </div>
    `;
    
    card.innerHTML = originalContent;
    
    // ریست کردن استایل‌های انیمیشن
    card.style.transform = 'scale(1)';
    card.style.transition = '';
};

// Helper functions for showing messages
window.showSuccessMessage = function(message) {
    // Implementation for success message
    console.log('✅ Success:', message);
    // Add your success message display logic here
};

window.showErrorMessage = function(message) {
    // Implementation for error message
    console.error('❌ Error:', message);
    alert(message); // Temporary - replace with better UI
};

console.log('✅ Content module loaded successfully');