/**
 * Data Management Module
 * ماژول مدیریت داده‌ها
 * 
 * @description: مدیریت آپلود، تحلیل فایل‌های Excel و تولید ساختار دیتابیس
 * @version: 3.0.0 - Modular Architecture
 * @author: DataSave Team
 */

'use strict';

import DataManagementController from './data-management/DataManagementController.js';

class DataManagementModule {
    constructor() {
        this.controller = null;
        this.isInitialized = false;
        
        // Legacy properties for backward compatibility
        this.currentFile = null;
        this.analysisResult = null;
        this.currentStructure = null;
        this.previewData = null;
        
        // Configuration
        this.config = {
            maxFileSize: 10 * 1024 * 1024, // 10MB
            supportedFormats: ['.xlsx', '.xls', '.csv'],
            previewRows: 10
        };
    }
    
    /**
     * بارگذاری محتوای ماژول
     */
    async loadContent() {
        try {
            console.log('🚀 Loading Data Management Module content...');
            
            // Return the actual UI content immediately
            const content = `
                <div class="data-management-container dm-fade-in">
                    <!-- Header -->
                    <div class="dm-page-header">
                        <h1 class="dm-page-title">
                            <i class="fas fa-database"></i>
                            مدیریت داده‌ها
                        </h1>
                        <p class="dm-page-subtitle">
                            آپلود، تحلیل فایل‌های Excel و تولید ساختار دیتابیس
                        </p>
                    </div>
                    
                    <!-- Main Layout -->
                    <div class="dm-main-layout-single">
                        <!-- Content Area -->
                        <div class="dm-content-area">
                            <!-- Upload Section -->
                            <div class="dm-upload-section" id="uploadSection">
                                <div class="dm-upload-content">
                                    <i class="fas fa-cloud-upload-alt dm-upload-icon"></i>
                                    <h3 class="dm-upload-title">آپلود فایل Excel</h3>
                                    <p class="dm-upload-subtitle">
                                        فایل Excel خود را اینجا بکشید یا کلیک کنید تا انتخاب کنید
                                        <br>
                                        <span class="dm-upload-specs">حداکثر حجم: 10 مگابایت | فرمت‌های پشتیبانی شده: .xlsx, .xls, .csv</span>
                                    </p>
                                    <button class="dm-upload-button" id="uploadButton">
                                        <i class="fas fa-folder-open"></i>
                                        انتخاب فایل
                                    </button>
                                    <input type="file" id="fileInput" class="dm-file-input" accept=".xlsx,.xls,.csv">
                                </div>
                            </div>
                            
                            <!-- Progress Bar -->
                            <div class="dm-progress-container" id="progressContainer" style="display: none;">
                                <div class="dm-progress-label">
                                    <span id="progressLabel">در حال آپلود...</span>
                                    <span id="progressPercent">0%</span>
                                </div>
                                <div class="dm-progress-bar">
                                    <div class="dm-progress-fill" id="progressFill" style="width: 0%"></div>
                                </div>
                            </div>
                            
                            <!-- File Info -->
                            <div class="dm-file-info" id="fileInfo" style="display: none;">
                                <div class="dm-file-header">
                                    <i class="fas fa-file-excel dm-file-icon"></i>
                                    <div class="dm-file-details">
                                        <h4 id="fileName">نام فایل</h4>
                                        <p id="fileDetails">جزئیات فایل</p>
                                    </div>
                                </div>
                                <div class="dm-file-stats" id="fileStats">
                                    <!-- File statistics will be populated here -->
                                </div>
                            </div>
                            
                            <!-- Table Preview -->
                            <div class="dm-table-preview" id="tablePreview" style="display: none;">
                                <div class="dm-table-header">
                                    <i class="fas fa-table"></i>
                                    پیش‌نمایش داده‌ها
                                </div>
                                <div class="dm-table-container">
                                    <table class="dm-table" id="dataTable">
                                        <!-- Table content will be populated here -->
                                    </table>
                                </div>
                            </div>
                            
                            <!-- Field Selection Panel -->
                            <div class="dm-field-selection" id="fieldSelection" style="display: none;">
                                <div class="dm-field-selection-header">
                                    <i class="fas fa-check-square"></i>
                                    انتخاب فیلدهای مورد نیاز
                                    <p>فیلدهایی را که برای ایجاد دیتابیس نیاز دارید انتخاب کنید:</p>
                                </div>
                                <div class="dm-field-checkboxes" id="fieldCheckboxes">
                                    <!-- Field checkboxes will be populated here -->
                                </div>
                                <div class="dm-field-selection-actions">
                                    <button class="dm-btn dm-btn-primary" id="generateDbStructure">
                                        <i class="fas fa-database"></i>
                                        تولید ساختار دیتابیس با هوش مصنوعی
                                    </button>
                                    <button class="dm-btn dm-btn-secondary" id="selectAllFields">
                                        <i class="fas fa-check-double"></i>
                                        انتخاب همه فیلدها
                                    </button>
                                    <button class="dm-btn dm-btn-secondary" id="deselectAllFields">
                                        <i class="fas fa-times"></i>
                                        لغو انتخاب همه
                                    </button>
                                </div>
                                
                              <!-- Unique Field Selection -->
                             
                            </div>
                            
                            <!-- Table Configuration Panel -->
                            <div class="dm-table-config" id="tableConfig" style="display: none;">
                                <div class="dm-table-config-header">
                                    <i class="fas fa-cogs"></i>
                                    تنظیمات جدول و فیلدها
                                    <p>نام جدول و تنظیمات فیلدهای انتخاب شده را مشخص کنید:</p>
                                </div>
                                
                                <!-- Table Info Section -->
                                <div class="dm-table-info">
                                    <div class="dm-table-info-row">
                                        <div class="dm-info-group">
                                            <label for="configTableName">نام جدول (انگلیسی):</label>
                                            <input type="text" id="configTableName" class="dm-table-input" placeholder="xls2tbl_example" />
                                            <small class="dm-help-text">نام جدول باید با xls2tbl_ شروع شود</small>
                                        </div>
                                        <div class="dm-info-group">
                                            <label for="configTableDesc">توضیحات جدول:</label>
                                            <input type="text" id="configTableDesc" class="dm-table-input" placeholder="توضیح مختصر درباره جدول" />
                                            <small class="dm-help-text">توضیحات به فارسی وارد کنید</small>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Fields Configuration Grid -->
                                <div class="dm-fields-grid" id="fieldsGrid">
                                    <!-- Fields will be populated here dynamically -->
                                </div>
                                
                                <!-- Actions -->
                                <div class="dm-table-config-actions">
                                    <button class="dm-btn dm-btn-primary" id="generateFinalStructure">
                                        <i class="fas fa-database"></i>
                                        تولید نهایی ساختار دیتابیس
                                    </button>
                                    <button class="dm-btn dm-btn-secondary" id="resetToDefaults">
                                        <i class="fas fa-undo"></i>
                                        بازگشت به پیش‌فرض
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Database Structure Preview -->
                            <div class="dm-database-preview" id="databasePreview" style="display: none;">
                                <div class="dm-database-header">
                                    <i class="fas fa-database"></i>
                                    ساختار دیتابیس پیشنهادی
                                    <div class="dm-database-actions">
                                        <button class="dm-btn dm-btn-secondary" id="regenerateStructure">
                                            <i class="fas fa-sync-alt"></i>
                                            تولید مجدد
                                        </button>
                                        <button class="dm-btn dm-btn-primary" id="generateDbStructure">
                                            <i class="fas fa-database"></i>
                                            تولید با AI
                                        </button>
                                    </div>
                                </div>
                                
                                <!-- Database Info Section -->
                                <div class="dm-database-info">
                                    <div class="dm-info-section">
                                        <label>نام پیشنهادی دیتابیس:</label>
                                        <div class="dm-database-name">
                                            <input type="text" id="suggestedDbName" readonly />
                                            <button class="dm-edit-btn" onclick="this.previousElementSibling.readOnly = false; this.style.display = 'none'; this.nextElementSibling.style.display = 'inline';">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="dm-save-btn" style="display: none;" onclick="this.previousElementSibling.previousElementSibling.readOnly = true; this.style.display = 'none'; this.previousElementSibling.style.display = 'inline';">
                                                <i class="fas fa-check"></i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="dm-info-section">
                                        <label>نام پیشنهادی جدول:</label>
                                        <div class="dm-table-name">
                                            <input type="text" id="suggestedTableName" readonly />
                                            <button class="dm-edit-btn" onclick="this.previousElementSibling.readOnly = false; this.style.display = 'none'; this.nextElementSibling.style.display = 'inline';">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="dm-save-btn" style="display: none;" onclick="this.previousElementSibling.previousElementSibling.readOnly = true; this.style.display = 'none'; this.previousElementSibling.style.display = 'inline';">
                                                <i class="fas fa-check"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- HTML/CSS Preview -->
                                <div class="dm-code-preview">
                                    <div class="dm-code-tabs">
                                        <button class="dm-code-tab active" data-tab="structure">ساختار فیلدها</button>
                                        <button class="dm-code-tab" data-tab="sql">کد SQL</button>
                                        <button class="dm-code-tab" data-tab="html">کد HTML</button>
                                    </div>
                                    
                                    <div class="dm-code-content">
                                        <!-- Structure Tab -->
                                        <div class="dm-code-panel active" id="structurePanel">
                                            <div class="dm-fields-container" id="fieldsContainer">
                                                <!-- Dynamic fields will be generated here -->
                                            </div>
                                        </div>
                                        
                                        <!-- SQL Tab -->
                                        <div class="dm-code-panel" id="sqlPanel">
                                            <pre><code id="sqlCode"><!-- SQL code will be generated here --></code></pre>
                                            <button class="dm-copy-btn" onclick="navigator.clipboard.writeText(document.getElementById('sqlCode').textContent)">
                                                <i class="fas fa-copy"></i>
                                                کپی کد SQL
                                            </button>
                                        </div>
                                        
                                        <!-- HTML Tab -->
                                        <div class="dm-code-panel" id="htmlPanel">
                                            <pre><code id="htmlCode"><!-- HTML code will be generated here --></code></pre>
                                            <button class="dm-copy-btn" onclick="navigator.clipboard.writeText(document.getElementById('htmlCode').textContent)">
                                                <i class="fas fa-copy"></i>
                                                کپی کد HTML
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Action Buttons -->
                                <div class="dm-actions">
                                    <button class="dm-action-btn" id="selectAllFields">
                                        <i class="fas fa-check-square"></i>
                                        انتخاب همه
                                    </button>
                                    <button class="dm-action-btn" id="deselectAllFields">
                                        <i class="fas fa-square"></i>
                                        عدم انتخاب همه
                                    </button>
                                    <button class="dm-action-btn dm-primary" id="createTableAndImport">
                                        <i class="fas fa-database"></i>
                                        ایجاد جدول و وارد کردن داده‌ها
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            console.log('✅ Data Management Module content loaded');
            return content;
            
        } catch (error) {
            console.error('❌ Error loading Data Management Module content:', error);
            return this.getErrorContent();
        }
    }
    
    /**
     * مقداردهی اولیه ماژول
     */
    async init() {
        try {
            console.log('🚀 Initializing Data Management Module...');
            
            if (this.isInitialized) {
                console.log('⚠️ Module already initialized');
                return;
            }
            
            // Initialize controller
            this.controller = new DataManagementController();
            await this.controller.init();
            
            // Set up legacy property sync for backward compatibility
            this.setupLegacySync();
            
            this.isInitialized = true;
            console.log('✅ Data Management Module initialized successfully');
            
        } catch (error) {
            console.error('❌ Error initializing Data Management Module:', error);
            throw error;
        }
    }
    
    /**
     * تنظیم همگام‌سازی با خصوصیات قدیمی برای سازگاری
     */
    setupLegacySync() {
        // Create getters that sync with controller state
        Object.defineProperty(this, 'currentFile', {
            get: () => this.controller?.getCurrentState()?.file || null
        });
        
        Object.defineProperty(this, 'analysisResult', {
            get: () => this.controller?.getCurrentState()?.analysis || null
        });
        
        Object.defineProperty(this, 'currentStructure', {
            get: () => this.controller?.getCurrentState()?.structure || null
        });
        
        Object.defineProperty(this, 'previewData', {
            get: () => this.controller?.getCurrentState()?.preview || null
        });
    }
    
    /**
     * محتوای پیش‌فرض در صورت عدم دسترسی به کنترلر
     */
    async getDefaultContent() {
        return `
            <div class="data-management-container dm-fade-in">
                <!-- Header -->
                <div class="dm-page-header">
                    <h1 class="dm-page-title">
                        <i class="fas fa-database"></i>
                        مدیریت داده‌ها
                    </h1>
                    <p class="dm-page-subtitle">
                        آپلود، تحلیل فایل‌های Excel و تولید ساختار دیتابیس
                    </p>
                </div>
                
                <!-- Loading State -->
                <div class="dm-loading-state">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>در حال بارگذاری ماژول...</p>
                </div>
            </div>
        `;
    }
    
    /**
     * محتوای خطا
     */
    getErrorContent() {
        return `
            <div class="data-management-container">
                <div class="dm-error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>خطا در بارگذاری ماژول</h3>
                    <p>متأسفانه مشکلی در بارگذاری ماژول مدیریت داده‌ها پیش آمده است.</p>
                    <button onclick="location.reload()" class="dm-btn dm-btn-primary">
                        <i class="fas fa-refresh"></i>
                        تلاش مجدد
                    </button>
                </div>
            </div>
        `;
    }
    
    // Legacy Methods for Backward Compatibility
    
    /**
     * پردازش انتخاب فایل (legacy method)
     */
    async handleFileSelection(file) {
        if (this.controller) {
            return await this.controller.handleFileSelection(file);
        }
        console.warn('⚠️ Controller not initialized, cannot handle file selection');
    }
    
    /**
     * تولید ساختار دیتابیس (legacy method)
     */
    async generateDatabaseStructure() {
        if (this.controller) {
            return await this.controller.handleGenerateStructure();
        }
        console.warn('⚠️ Controller not initialized, cannot generate structure');
    }
    
    /**
     * بروزرسانی فیلد (legacy method)
     */
    updateField(index, property, value) {
        if (this.controller) {
            return this.controller.handleFieldUpdate(index, property, value);
        }
        console.warn('⚠️ Controller not initialized, cannot update field');
    }
    
    /**
     * ریست ماژول (legacy method)
     */
    reset() {
        if (this.controller) {
            return this.controller.reset();
        }
        console.warn('⚠️ Controller not initialized, cannot reset');
    }
    
    /**
     * دریافت وضعیت فعلی (legacy method)
     */
    getCurrentState() {
        if (this.controller) {
            return this.controller.getCurrentState();
        }
        return {
            file: null,
            analysis: null,
            structure: null,
            preview: null
        };
    }
    
    /**
     * دریافت پیکربندی (legacy method)
     */
    getConfig() {
        if (this.controller) {
            return this.controller.getConfig();
        }
        return this.config;
    }
    
    /**
     * بروزرسانی پیکربندی (legacy method)
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        if (this.controller) {
            this.controller.updateConfig(newConfig);
        }
    }
    
    /**
     * دریافت نمونه کنترلر
     */
    getController() {
        return this.controller;
    }
    
    /**
     * بررسی وضعیت مقداردهی اولیه
     */
    isReady() {
        return this.isInitialized && this.controller !== null;
    }
    
    /**
     * دریافت آمار ماژول
     */
    getStats() {
        const state = this.getCurrentState();
        return {
            hasFile: !!state.file,
            hasAnalysis: !!state.analysis,
            hasStructure: !!state.structure,
            hasPreview: !!state.preview,
            isInitialized: this.isInitialized,
            controllerReady: !!this.controller
        };
    }
    
    /**
     * نمایش اطلاعات دیباگ
     */
    debug() {
        console.group('🔍 Data Management Module Debug Info');
        console.log('📊 Stats:', this.getStats());
        console.log('⚙️ Config:', this.getConfig());
        console.log('📁 Current State:', this.getCurrentState());
        console.log('🎛️ Controller:', this.controller);
        console.groupEnd();
    }
}

// Legacy global object for backward compatibility
const DataManagement = new DataManagementModule();

// Export both the class and the instance
export { DataManagementModule, DataManagement };
export default DataManagement;