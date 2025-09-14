/**
 * ماژول تنظیمات پیامک
 * SMS Settings Module
 * 
 * @description: ماژول مدیریت تنظیمات سامانه پیامک 0098SMS
 * @version: 1.0.0
 * @author: DataSave Team
 */

'use strict';

/**
 * ماژول تنظیمات پیامک
 * SMS Settings Module
 */
export default {
    // API paths for XAMPP server
    apiPaths: [
        'http://localhost/datasave/backend/api/v1/settings.php', // Primary: Direct XAMPP
        'http://127.0.0.1/datasave/backend/api/v1/settings.php',
        'proxy-settings.php', // Fallback: For Live Server
        '/datasave/backend/api/v1/settings.php',
        '../backend/api/v1/settings.php',
        'backend/api/v1/settings.php'
    ],
    
    /**
     * بارگذاری محتوای تنظیمات پیامک
     */
    async loadContent() {
        try {
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
                                        <h4 style="color: var(--text-primary); margin-bottom: var(--spacing-3);">🔑 تست ارسال کد یکبار مصرف</h4>
                                        <form id="testOtpForm">
                                            <div class="form-group" style="margin-bottom: var(--spacing-4);">
                                                <label class="form-label" style="display: block; margin-bottom: var(--spacing-2); color: var(--text-primary); font-weight: var(--font-weight-medium);">شماره تلفن:</label>
                                                <input type="tel" id="test_otp_phone" class="form-input" placeholder="09123456789" style="width: 100%; padding: var(--spacing-3); border: 1px solid var(--glass-border); border-radius: var(--radius-md); background: var(--glass-bg-lighter); color: var(--text-primary);" required>
                                            </div>
                                            <div class="form-actions" style="display: flex; gap: var(--spacing-3);">
                                                <button type="submit" class="btn btn-primary" style="background: var(--primary-gradient); color: white; border: none; padding: var(--spacing-3) var(--spacing-6); border-radius: var(--radius-md); cursor: pointer; font-weight: var(--font-weight-medium);">
                                                    <i class="fas fa-key"></i> ارسال کد OTP
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                    
                                    <!-- OTP Verification Card - اضافه کردن کارت تایید OTP -->
                                    <div id="otpVerificationCard" style="display: none; max-width: 500px; margin: 20px auto; background: var(--glass-bg); border-radius: var(--radius-lg); padding: var(--spacing-4); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);">
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
                                                <button id="verifyOtpBtn" 
                                                        style="flex: 1; padding: 12px; background: linear-gradient(135deg, #059669, #065f46); color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
                                                    ✅ تایید کد
                                                </button>
                                                <button id="cancelOtpBtn" 
                                                        style="flex: 1; padding: 12px; background: linear-gradient(135deg, #dc2626, #991b1b); color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
                                                    ❌ لغو
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Reports Tab -->
                                <div class="tab-pane" id="reports-tab" style="display: none;">
                                    <h3 style="margin-bottom: var(--spacing-4); color: var(--text-primary);">گزارشات ارسال پیامک</h3>
                                    <a href="pages/sms-reports.html" target="_blank" class="btn btn-primary" style="background: var(--primary-gradient); color: white; border: none; padding: var(--spacing-3) var(--spacing-6); border-radius: var(--radius-md); cursor: pointer; font-weight: var(--font-weight-medium); text-decoration: none; display: inline-block; margin-bottom: var(--spacing-4);">
                                        <i class="fas fa-external-link-alt"></i> صفحه گزارشات کامل
                                    </a>
                                    
                                    <div id="recentSmsLogs" class="reports-table-container" style="background: var(--glass-bg-lighter); border-radius: var(--radius-lg); padding: var(--spacing-4); overflow-x: auto;">
                                        <table class="reports-table" style="width: 100%; border-collapse: collapse;">
                                            <thead>
                                                <tr>
                                                    <th style="text-align: right; padding: var(--spacing-3); border-bottom: 1px solid var(--glass-border);">شماره گیرنده</th>
                                                    <th style="text-align: right; padding: var(--spacing-3); border-bottom: 1px solid var(--glass-border);">نوع پیام</th>
                                                    <th style="text-align: right; padding: var(--spacing-3); border-bottom: 1px solid var(--glass-border);">وضعیت</th>
                                                    <th style="text-align: right; padding: var(--spacing-3); border-bottom: 1px solid var(--glass-border);">تاریخ ارسال</th>
                                                </tr>
                                            </thead>
                                            <tbody id="smsLogsTableBody">
                                                <!-- سطرهای جدول با JavaScript پر می‌شوند -->
                                                <tr>
                                                    <td colspan="4" style="text-align: center; padding: var(--spacing-4);">
                                                        <div class="loading-spinner" style="display: inline-block;">
                                                            <i class="fas fa-spinner fa-spin"></i> در حال بارگذاری...
                                                        </div>
                                                    </td>
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
        } catch (error) {
            console.error('Failed to load SMS settings content:', error);
            return `
                <div class="error-container">
                    <h2>❌ خطا در بارگذاری تنظیمات پیامک</h2>
                    <p>${error.message}</p>
                    <button class="btn btn-primary" onclick="location.reload()">تلاش مجدد</button>
                </div>
            `;
        }
    },
    
    /**
     * بارگذاری تنظیمات SMS از دیتابیس
     */
    async loadSMSSettingsData() {
        try {
            console.log('📤 Loading SMS settings from database...');
            
            let response = null;
            let lastError = null;
            
            // Try each path until one works
            for (const apiPath of this.apiPaths) {
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
            console.log('📊 SMS settings data received:', JSON.stringify(data, null, 2));
            
            // بررسی کامل داده‌های دریافتی برای sms_enabled
            if (data.data) {
                console.log('🔍 Full data structure:', {
                    hasSettings: data.data !== undefined,
                    hasEnabledField: data.data.sms_enabled !== undefined,
                    sms_enabled: data.data.sms_enabled
                });
                
                // بررسی نوع داده sms_enabled
                if (data.data.sms_enabled !== undefined) {
                    console.log(' SMS Enabled data type:', typeof data.data.sms_enabled);
                    
                    if (typeof data.data.sms_enabled === 'object') {
                        console.log('🔬 SMS Enabled value type:', typeof data.data.sms_enabled.value);
                        console.log('🔬 SMS Enabled raw value:', data.data.sms_enabled.value);
                    } else {
                        console.log('🔬 SMS Enabled is not an object, direct value:', data.data.sms_enabled);
                    }
                }
            }
            
            if (data.success && data.data) {
                this.populateSMSForms(data.data);
                console.log('✅ SMS settings loaded successfully');
            } else {
                console.warn('⚠️ No SMS settings data found, using defaults');
                this.populateSMSForms({});
            }
        } catch (error) {
            console.error('❌ Error loading SMS settings:', error);
            
            // Show user-friendly error message
            this.showErrorMessage('خطا در بارگذاری تنظیمات SMS. بررسی کنید که سرور XAMPP روشن باشد.');
            
            // Load empty form with defaults
            this.populateSMSForms({});
        }
    },
    
    /**
     * پر کردن فرم‌های SMS با داده‌ها
     */
    populateSMSForms(data) {
        console.log('🔄 populateSMSForms called with data:', data);
        
        const defaults = {
            sms_username: 'zsms8829',
            sms_password: '********',
            sms_panel_number: '3000164545',
            sms_domain: '0098',
            sms_enabled: true,
            api_endpoint: 'https://0098sms.com/sendsmslink.aspx',
            webservice_endpoint: 'https://webservice.0098sms.com/service.asmx',
            otp_length: 5,
            otp_expiry_minutes: 5,
            otp_message_template: 'کد تایید شما: {OTP_CODE}\nاین کد تا {EXPIRY_MINUTES} دقیقه معتبر است.\nDataSave',
            test_phone_number: '09123456789',
            test_message_text: 'این یک پیامک تست است' // اضافه کردن مقدار پیش‌فرض برای متن پیام تست
        };
        
        // Connection Tab
        const connectionFields = [
            'sms_username', 'sms_password', 'sms_panel_number', 
            'sms_domain', 'api_endpoint', 'webservice_endpoint'
        ];
        
        connectionFields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                const value = data[field]?.value || defaults[field] || '';
                element.value = value;
            }
        });
        
        // SMS Enabled checkbox
        const smsEnabledElement = document.getElementById('sms_enabled');
        if (smsEnabledElement) {
            // برای دیباگ مقدار sms_enabled را با جزئیات کامل نمایش می‌دهیم
            console.log('🔍 SMS Enabled value from data:', {
                exists: data.sms_enabled !== undefined,
                rawValue: data.sms_enabled,
                valueProperty: data.sms_enabled?.value,
                typeProperty: data.sms_enabled?.type
            });
            
            // فقط زمانی از مقدار پیش‌فرض استفاده می‌کنیم که داده‌ای از سرور وجود نداشته باشد
            let isEnabled;
            
            if (data.sms_enabled !== undefined) {
                // مقدار از سرور آمده است
                const value = data.sms_enabled.value;
                isEnabled = value === true || value === 1 || value === '1' || value === 'true';
                console.log('⚙️ Using server value for sms_enabled:', value, '-> converted to:', isEnabled);
            } else {
                // از مقدار پیش‌فرض استفاده می‌کنیم
                isEnabled = defaults.sms_enabled;
                console.log('⚙️ Using default value for sms_enabled:', isEnabled);
            }
            
            // تنظیم مقدار چک‌باکس
            smsEnabledElement.checked = isEnabled;
            console.log('✅ Set sms_enabled checkbox to:', isEnabled);
        }
        
        // OTP Tab
        const otpLengthElement = document.getElementById('otp_length');
        if (otpLengthElement) {
            const otpLength = data.otp_length?.value || defaults.otp_length;
            this.setSelectValue(otpLengthElement, otpLength);
        }
        
        const otpExpiryElement = document.getElementById('otp_expiry_minutes');
        if (otpExpiryElement) {
            const otpExpiry = data.otp_expiry_minutes?.value || defaults.otp_expiry_minutes;
            this.setSelectValue(otpExpiryElement, otpExpiry);
        }
        
        const otpTemplateElement = document.getElementById('otp_message_template');
        if (otpTemplateElement) {
            otpTemplateElement.value = data.otp_message_template?.value || defaults.otp_message_template;
        }
        
        // Test Tab - اصلاح بارگذاری فیلدها
        const testPhoneElement = document.getElementById('test_phone_number');
        if (testPhoneElement) {
            testPhoneElement.value = data.test_phone_number?.value || defaults.test_phone_number;
        }
        
        const testMessageElement = document.getElementById('test_message_text');
        if (testMessageElement) {
            testMessageElement.value = data.test_message_text?.value || defaults.test_message_text;
        }
        
        const testOtpPhoneElement = document.getElementById('test_otp_phone');
        if (testOtpPhoneElement) {
            testOtpPhoneElement.value = data.test_phone_number?.value || defaults.test_phone_number;
        }
    },
    
    /**
     * تنظیم مقدار یک select element
     */
    setSelectValue(selectElement, value) {
        if (!selectElement) return;
        
        for (let i = 0; i < selectElement.options.length; i++) {
            if (selectElement.options[i].value == value) {
                selectElement.selectedIndex = i;
                break;
            }
        }
    },
    
    /**
     * نمایش پیام خطا
     */
    showErrorMessage(message) {
        const container = document.createElement('div');
        container.className = 'error-message';
        container.style = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--error-gradient);
            color: white;
            padding: var(--spacing-4);
            border-radius: var(--radius-lg);
            z-index: 9999;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        `;
        
        container.innerHTML = `
            <div style="display: flex; align-items: center; gap: var(--spacing-3);">
                <i class="fas fa-exclamation-circle" style="font-size: 24px;"></i>
                <p style="margin: 0;">${message}</p>
            </div>
            <button style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; color: white; cursor: pointer;">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(container);
        
        // حذف پیام خطا پس از 5 ثانیه
        setTimeout(() => {
            container.remove();
        }, 5000);
        
        // دکمه بستن پیام خطا
        const closeButton = container.querySelector('button');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                container.remove();
            });
        }
    },
    
    /**
     * ذخیره تنظیمات SMS
     */
    async saveSMSSettings(formData) {
        try {
            console.log('📤 Saving SMS settings...', formData);
            
            let response = null;
            let lastError = null;
            
            // Try each path until one works
            for (const apiPath of this.apiPaths) {
                try {
                    console.log('🔍 Trying API path for saving:', apiPath);
                    
                    const requestData = {
                        action: 'save', // Changed to match the backend API expectation
                        settings: formData
                    };
                    
                    console.log('📝 Request data:', JSON.stringify(requestData));
                    
                    response = await fetch(apiPath, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(requestData)
                    });
                    
                    console.log(`📋 Response status: ${response.status} for path: ${apiPath}`);
                    
                    if (response.ok) {
                        const contentType = response.headers.get('content-type');
                        console.log('📝 Content-Type:', contentType);
                        
                        if (contentType && contentType.includes('application/json')) {
                            break; // Found working API endpoint
                        } else {
                            lastError = new Error(`نوع محتوا نادرست: ${contentType}`);
                            response = null;
                        }
                    } else {
                    // Try to get more information about the error
                        try {
                            // If the response is JSON, parse it for better error info
                            const contentType = response.headers.get('content-type');
                            if (contentType && contentType.includes('application/json')) {
                                const errorJson = await response.json();
                                console.error(`❌ HTTP Error ${response.status}: JSON response`, errorJson);
                                lastError = new Error(`HTTP ${response.status}: ${errorJson.message || response.statusText}`);
                            } else {
                                const errorText = await response.text();
                                console.error(`❌ HTTP Error ${response.status}: ${response.statusText}`, errorText);
                                lastError = new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
                            }
                        } catch (textError) {
                            lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
                        }
                        response = null;
                    }
                } catch (error) {
                    console.warn('❌ Failed saving with path:', apiPath, error.message);
                    lastError = error;
                    response = null;
                }
            }
            
            if (!response) {
                throw lastError || new Error('هیچ API endpoint در دسترس نیست');
            }
            
            try {
                const data = await response.json();
                console.log('📊 API response data:', data);
                
                if (data.success) {
                    console.log('✅ SMS settings saved successfully');
                    return true;
                } else {
                    throw new Error(data.message || 'خطا در ذخیره تنظیمات');
                }
            } catch (jsonError) {
                console.error('❌ Failed to parse response:', jsonError);
                throw new Error('خطا در پردازش پاسخ سرور');
            }
        } catch (error) {
            console.error('❌ Error saving SMS settings:', error);
            this.showErrorMessage('خطا در ذخیره تنظیمات: ' + error.message);
            return false;
        }
    },
    
    /**
     * مقداردهی اولیه تنظیمات پیامک
     */
    async init() {
        try {
            console.log('SMS Settings module initialized');
            
            // مقداردهی اولیه تب‌ها
            document.querySelectorAll('.tab-button').forEach(button => {
                button.addEventListener('click', () => {
                    const tabId = button.getAttribute('data-tab');
                    this.switchTab(tabId);
                });
            });
            
            // مقداردهی اولیه فرم‌های تنظیمات
            document.getElementById('connectionForm')?.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleConnectionFormSubmit(e.target);
            });
            
            document.getElementById('otpForm')?.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleOtpFormSubmit(e.target);
            });
            
            document.getElementById('testSmsForm')?.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleTestSmsFormSubmit(e.target);
            });
            
            document.getElementById('testOtpForm')?.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleTestOtpFormSubmit(e.target);
            });
            
            // اضافه کردن event listener برای دکمه ذخیره داده‌های تست
            document.getElementById('saveTestDataBtn')?.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSaveTestData();
            });
            
            // اضافه کردن event listenerها برای دکمه‌های کارت OTP
            document.getElementById('verifyOtpBtn')?.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleOTPVerification();
            });
            
            document.getElementById('cancelOtpBtn')?.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCancelVerification();
            });
            
            // بارگذاری تنظیمات از دیتابیس
            await this.loadSMSSettingsData();
            
        } catch (error) {
            console.error('Failed to initialize SMS settings:', error);
        }
    },
    
    /**
     * تغییر تب
     */
    switchTab(tabId) {
        // غیرفعال کردن همه تب‌ها
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.style.display = 'none';
            pane.classList.remove('active');
        });
        
        // فعال کردن تب موردنظر
        const activeButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
        
        const activePane = document.getElementById(`${tabId}-tab`);
        if (activePane) {
            activePane.style.display = 'block';
            activePane.classList.add('active');
        }
    },
    
    /**
     * مدیریت ارسال فرم تنظیمات اتصال
     */
    async handleConnectionFormSubmit(form) {
        // تبدیل مقادیر به نوع مناسب
        const formData = {
            sms_username: form.sms_username.value.trim(),
            sms_password: form.sms_password.value.trim(),
            sms_panel_number: form.sms_panel_number.value.trim(),
            sms_enabled: form.sms_enabled.checked, // ارسال به صورت boolean
            api_endpoint: form.api_endpoint.value.trim(),
            webservice_endpoint: form.webservice_endpoint.value.trim()
        };
        
        console.log('📦 Connection form data:', formData);
        console.log('🔍 SMS Enabled form value:', form.sms_enabled.checked);
        
        const success = await this.saveSMSSettings(formData);
        if (success) {
            this.showSuccessMessage('تنظیمات اتصال با موفقیت ذخیره شد');
            
            // بارگذاری مجدد تنظیمات از سرور برای اطمینان از صحت نمایش
            await this.loadSMSSettingsData();
        }
    },
    
    /**
     * مدیریت ارسال فرم تنظیمات OTP
     */
    async handleOtpFormSubmit(form) {
        // تبدیل مقادیر به نوع مناسب
        const formData = {
            otp_length: parseInt(form.otp_length.value, 10), // تبدیل به عدد
            otp_expiry_minutes: parseInt(form.otp_expiry_minutes.value, 10), // تبدیل به عدد
            otp_message_template: form.otp_message_template.value.trim()
        };
        
        console.log('📦 OTP form data:', formData);
        
        const success = await this.saveSMSSettings(formData);
        if (success) {
            this.showSuccessMessage('تنظیمات کد یکبار مصرف با موفقیت ذخیره شد');
        }
    },
    
    /**
     * مدیریت ارسال فرم تست پیامک
     */
    async handleTestSmsFormSubmit(form) {
        try {
            let phone = form.test_phone_number.value;
            const message = form.test_message_text.value;
            
            // استفاده از NumberUtils برای تبدیل شماره تلفن
            if (phone && typeof NumberUtils !== 'undefined') {
                const originalPhone = phone;
                phone = NumberUtils.toEnglish(phone);
                if (originalPhone !== phone) {
                    console.log('📱 Test SMS Phone number converted:', originalPhone, '→', phone);
                }
            }
            
            if (!phone || !message) {
                throw new Error('لطفاً شماره تلفن و متن پیام را وارد کنید');
            }
            
            console.log('📤 Sending test SMS...');
            
            // نمایش پیام در حال انجام
            this.showInfoMessage('در حال ارسال پیامک...');
            
            // ارسال پیامک تست
            const response = await fetch('http://localhost/datasave/backend/api/v1/sms.php', {
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
            
            if (data.success) {
                // نمایش پیام موفقیت
                this.showSuccessMessage(`پیامک با موفقیت به شماره ${phone} ارسال شد`);
            } else {
                throw new Error(data.message || 'خطای نامشخص در ارسال پیامک');
            }
            
        } catch (error) {
            console.error('❌ Error sending test SMS:', error);
            this.showErrorMessage('خطا در ارسال پیامک: ' + error.message);
        }
    },
    
    /**
     * مدیریت ارسال فرم تست OTP
     */
    async handleTestOtpFormSubmit(form) {
        try {
            let phone = form.test_otp_phone.value;
            
            // استفاده از NumberUtils برای تبدیل شماره تلفن
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
            
            console.log('📤 Sending test OTP...');
            
            // نمایش پیام در حال انجام
            this.showInfoMessage('در حال ارسال کد یکبار مصرف...');
            
            // ارسال OTP
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
                this.showOTPVerificationCard(phone, data.otp_code, expiryTime, otpLength);
                this.showSuccessMessage(`کد OTP به شماره ${phone} ارسال شد`);
                console.log('✅ OTP sent successfully:', data);
            } else {
                throw new Error(data.message || 'خطای نامشخص در ارسال OTP');
            }
            
        } catch (error) {
            console.error('❌ Error sending test OTP:', error);
            this.showErrorMessage('خطا در ارسال کد یکبار مصرف: ' + error.message);
        }
    },
    
    /**
     * نمایش پیام موفقیت
     */
    showSuccessMessage(message) {
        const container = document.createElement('div');
        container.className = 'success-message';
        container.style = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--success-gradient, linear-gradient(135deg, #4CAF50, #8BC34A));
            color: white;
            padding: var(--spacing-4);
            border-radius: var(--radius-lg);
            z-index: 9999;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        `;
        
        container.innerHTML = `
            <div style="display: flex; align-items: center; gap: var(--spacing-3);">
                <i class="fas fa-check-circle" style="font-size: 24px;"></i>
                <p style="margin: 0;">${message}</p>
            </div>
            <button style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; color: white; cursor: pointer;">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(container);
        
        // حذف پیام پس از 3 ثانیه
        setTimeout(() => {
            container.remove();
        }, 3000);
        
        // دکمه بستن پیام
        const closeButton = container.querySelector('button');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                container.remove();
            });
        }
    },
    
    /**
     * نمایش پیام اطلاعات
     */
    showInfoMessage(message) {
        const container = document.createElement('div');
        container.className = 'info-message';
        container.style = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--info-gradient, linear-gradient(135deg, #2196F3, #03A9F4));
            color: white;
            padding: var(--spacing-4);
            border-radius: var(--radius-lg);
            z-index: 9999;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        `;
        
        container.innerHTML = `
            <div style="display: flex; align-items: center; gap: var(--spacing-3);">
                <i class="fas fa-info-circle" style="font-size: 24px;"></i>
                <p style="margin: 0;">${message}</p>
            </div>
            <button style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; color: white; cursor: pointer;">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(container);
        
        // دکمه بستن پیام
        const closeButton = container.querySelector('button');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                container.remove();
            });
        }
        
        return container;
    },
    
    /**
     * ذخیره داده‌های تست در دیتابیس به عنوان تنظیمات
     */
    async handleSaveTestData() {
        try {
            console.log('💾 Saving test data to database as settings...');
            
            let phone = document.getElementById('test_phone_number').value;
            const message = document.getElementById('test_message_text').value;
            
            // استفاده از NumberUtils برای تبدیل شماره تلفن
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
                this.showSuccessMessage('داده‌های تست با موفقیت در دیتابیس ذخیره شد');
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
            this.showErrorMessage('خطا در ذخیره داده‌های تست: ' + error.message);
        }
    },
    
    /**
     * نمایش کارت راستی‌آزمایی OTP
     */
    showOTPVerificationCard(phone, otpCode, expiresAt, otpLength = 5) {
        const card = document.getElementById('otpVerificationCard');
        
        // اطمینان از بازیابی محتوای اصلی کارت
        this.resetOTPCardContent();
        
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
                newCodeInput.addEventListener('input', (e) => {
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
                this.startOTPCountdown(expiresAt, countdownDiv);
            }
        }
    },
    
    /**
     * نمایش پیام موفقیت OTP در کارت
     */
    showOTPSuccessMessage() {
        const card = document.getElementById('otpVerificationCard');
        if (!card) return;
        
        // پیدا کردن محتوای کارت
        const cardContent = card.querySelector('.glass-card') || card;
        
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
    },
    
    /**
     * مخفی کردن کارت راستی‌آزمایی OTP
     */
    hideOTPVerificationCard() {
        const card = document.getElementById('otpVerificationCard');
        if (card) {
            card.style.display = 'none';
            
            // بازیابی محتوای اصلی کارت
            this.resetOTPCardContent();
        }
        
        // پاک کردن timer
        if (this.otpCountdownTimer) {
            clearInterval(this.otpCountdownTimer);
            delete this.otpCountdownTimer;
        }
    },
    
    /**
     * بازیابی محتوای اصلی کارت OTP
     */
    resetOTPCardContent() {
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
                    <button id="verifyOtpBtn" 
                            style="flex: 1; padding: 12px; background: linear-gradient(135deg, #059669, #065f46); color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
                        ✅ تایید کد
                    </button>
                    <button id="cancelOtpBtn" 
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
        
        // اضافه کردن event listenerها برای دکمه‌های جدید
        document.getElementById('verifyOtpBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleOTPVerification();
        });
        
        document.getElementById('cancelOtpBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleCancelVerification();
        });
    },
    
    /**
     * شروع شمارش معکوس OTP
     */
    startOTPCountdown(expiresAt, countdownElement) {
        // پاک کردن timer قبلی اگر وجود دارد
        if (this.otpCountdownTimer) {
            clearInterval(this.otpCountdownTimer);
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
                clearInterval(this.otpCountdownTimer);
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
        this.otpCountdownTimer = setInterval(updateCountdown, 1000);
    },
    
    /**
     * راستی‌آزمایی OTP
     */
    async handleOTPVerification() {
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
                if (this.otpCountdownTimer) {
                    clearInterval(this.otpCountdownTimer);
                }
                
                // نمایش پیام موفقیت در کارت
                this.showOTPSuccessMessage();
                console.log('✅ OTP verified successfully');
                
                // پاک کردن فیلد شماره تلفن بعد از 5 ثانیه
                setTimeout(() => {
                    this.hideOTPVerificationCard();
                    const phoneInput = document.getElementById('test_otp_phone');
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
                
                this.showErrorMessage(errorMessage);
                
                // اگر منقضی شده، شمارش معکوس را متوقف کن
                if (data.message.includes('منقضی')) {
                    if (this.otpCountdownTimer) {
                        clearInterval(this.otpCountdownTimer);
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
            this.showErrorMessage('خطا در تایید OTP: ' + error.message);
        }
    },
    
    /**
     * لغو راستی‌آزمایی OTP
     */
    handleCancelVerification() {
        this.hideOTPVerificationCard();
        document.getElementById('test_otp_phone').value = '';
        document.getElementById('verification_code').value = '';
    }
};