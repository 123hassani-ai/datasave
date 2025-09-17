/**
 * Data Management Module
 * ماژول مدیریت داده‌ها
 * 
 * @description: مدیریت آپلود، تحلیل فایل‌های Excel و تولید ساختار دیتابیس
 * @version: 1.0.0
 * @author: DataSave Team
 */

'use strict';

class DataManagementModule {
    constructor() {
        this.currentFile = null;
        this.fileData = null;
        this.analysisResult = null;
        this.isProcessing = false;
        this.isUploading = false;
        
        // DOM elements cache
        this.elements = {};
        
        // Configuration
        this.config = {
            maxFileSize: 10 * 1024 * 1024, // 10MB
            allowedTypes: [
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'text/csv'
            ],
            apiEndpoint: '/datasave/backend/api/v1/data-simple.php'
        };
    }
    
    /**
     * بارگذاری محتوای ماژول
     */
    async loadContent() {
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
                            <i class="fas fa-cloud-upload-alt dm-upload-icon"></i>
                            <h3 class="dm-upload-title">آپلود فایل Excel</h3>
                            <p class="dm-upload-subtitle">
                                فایل Excel خود را اینجا بکشید یا کلیک کنید تا انتخاب کنید
                                <br>
                                حداکثر حجم: 10 مگابایت | فرمت‌های پشتیبانی شده: .xlsx, .xls, .csv
                            </p>
                            <button class="dm-upload-button" id="uploadButton">
                                <i class="fas fa-folder-open"></i>
                                انتخاب فایل
                            </button>
                            <input type="file" id="fileInput" class="dm-file-input" accept=".xlsx,.xls,.csv">
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
                            <div class="dm-unique-field-section" id="uniqueFieldSection" style="display: none;">
                                <div class="dm-unique-field-header">
                                    <i class="fas fa-key"></i>
                                    <h4>انتخاب فیلد کلیدی (برای آپدیت داده‌ها)</h4>
                                </div>
                                <p class="dm-help-text">
                                    یک فیلد منحصر به فرد انتخاب کنید که برای تشخیص و آپدیت رکوردهای موجود استفاده شود
                                </p>
                                <select id="uniqueFieldSelect" class="dm-unique-field-select">
                                    <option value="">فیلد کلیدی انتخاب کنید...</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Database Structure Preview -->
                        <div class="dm-database-preview" id="databasePreview" style="display: none;">
                            <div class="dm-database-header">
                                <i class="fas fa-database"></i>
                                پیشنهاد ساختار دیتابیس
                                <button class="dm-regenerate-btn" id="regenerateStructure" title="تولید مجدد ساختار">
                                    <i class="fas fa-sync-alt"></i>
                                </button>
                            </div>
                            
                            <!-- Database Name Section -->
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
                                            <i class="fas fa-copy"></i> کپی کد SQL
                                        </button>
                                    </div>
                                    
                                    <!-- HTML Tab -->
                                    <div class="dm-code-panel" id="htmlPanel">
                                        <pre><code id="htmlCode"><!-- HTML code will be generated here --></code></pre>
                                        <button class="dm-copy-btn" onclick="navigator.clipboard.writeText(document.getElementById('htmlCode').textContent)">
                                            <i class="fas fa-copy"></i> کپی کد HTML
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return content;
    }
    
    /**
     * مقداردهی اولیه ماژول
     */
    async init() {
        try {
            this.cacheElements();
            this.bindEvents();
            this.setupDropZone();
            console.log('✅ Data Management Module initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing Data Management Module:', error);
        }
    }
    
    /**
     * کش کردن المنت‌های DOM
     */
    cacheElements() {
        this.elements = {
            uploadSection: document.getElementById('uploadSection'),
            uploadButton: document.getElementById('uploadButton'),
            fileInput: document.getElementById('fileInput'),
            progressContainer: document.getElementById('progressContainer'),
            progressLabel: document.getElementById('progressLabel'),
            progressPercent: document.getElementById('progressPercent'),
            progressFill: document.getElementById('progressFill'),
            fileInfo: document.getElementById('fileInfo'),
            fileName: document.getElementById('fileName'),
            fileDetails: document.getElementById('fileDetails'),
            fileStats: document.getElementById('fileStats'),
            tablePreview: document.getElementById('tablePreview'),
            dataTable: document.getElementById('dataTable'),
            databasePreview: document.getElementById('databasePreview')
        };
    }
    
    /**
     * ثبت event listener ها
     */
    bindEvents() {
        // Upload button click
        this.elements.uploadButton?.addEventListener('click', () => {
            this.elements.fileInput?.click();
        });
        
        // File input change
        this.elements.fileInput?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleFileUpload(file);
            }
        });
        
        // Database structure tabs
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('dm-code-tab')) {
                this.switchCodeTab(e.target.dataset.tab);
            }
        });
        
        // Regenerate structure button
        document.getElementById('regenerateStructure')?.addEventListener('click', () => {
            this.generateDatabaseStructure();
        });
        
        // Generate database structure button
        document.getElementById('generateDbStructure')?.addEventListener('click', () => {
            this.generateDatabaseStructureWithAI();
        });
        
        // Select all fields button
        document.getElementById('selectAllFields')?.addEventListener('click', () => {
            this.selectAllFields();
        });
        
        // Deselect all fields button
        document.getElementById('deselectAllFields')?.addEventListener('click', () => {
            this.deselectAllFields();
        });
    }
    
    /**
     * تنظیم منطقه Drag & Drop
     */
    setupDropZone() {
        const uploadSection = this.elements.uploadSection;
        if (!uploadSection) return;
        
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadSection.addEventListener(eventName, this.preventDefaults, false);
            document.body.addEventListener(eventName, this.preventDefaults, false);
        });
        
        // Highlight drop area
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadSection.addEventListener(eventName, () => {
                uploadSection.classList.add('dragover');
            }, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            uploadSection.addEventListener(eventName, () => {
                uploadSection.classList.remove('dragover');
            }, false);
        });
        
        // Handle dropped files
        uploadSection.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileUpload(files[0]);
            }
        }, false);
    }
    
    /**
     * جلوگیری از رفتار پیش‌فرض drag & drop
     */
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    /**
     * مدیریت آپلود فایل
     */
    async handleFileUpload(file) {
        try {
            // Validation
            if (!this.validateFile(file)) {
                return;
            }
            
            this.isUploading = true;
            this.currentFile = file;
            
            // Show progress
            this.showProgress('در حال آپلود فایل...');
            
            // محاسبه hash فایل
            const fileHash = await this.calculateFileHash(file);
            
            // Read file content
            const fileContent = await this.readFileContent(file);
            
            // Update progress
            this.updateProgress(30, 'در حال تحلیل فایل...');
            
            // Send to AI for analysis first
            const analysisResult = await this.analyzeFileWithAI(file, fileContent);
            
            // اضافه کردن اطلاعات فایل و hash
            analysisResult.fileHash = fileHash;
            analysisResult.fileName = file.name;
            
            // Update progress
            this.updateProgress(50, 'در حال بررسی وجود فایل...');
            
            // بررسی وجود فایل در سیستم (استفاده از نتایج تحلیل)
            const columnsData = analysisResult.preview?.[0] || [];
            const columnsString = Array.isArray(columnsData) ? columnsData.join(',') : String(columnsData);
            
            // اگر columns خالی باشد، از filename استفاده کن
            let finalColumnsString = columnsString;
            if (!finalColumnsString || finalColumnsString.trim() === '') {
                finalColumnsString = `file_${file.name.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`;
            }
            
            console.log('🔍 Checking file existence with columns:', finalColumnsString);
            analysisResult.columnsData = columnsData;
            
            await this.checkFileExistence(fileHash, finalColumnsString);
            
            // Update progress
            this.updateProgress(90, 'در حال نمایش نتایج...');
            
            // Display results
            this.displayFileInfo(file, analysisResult);
            this.displayTablePreview(analysisResult.preview);
            
            // Complete progress
            this.updateProgress(100, 'تکمیل شد!');
            
            // Hide progress after delay
            setTimeout(() => {
                this.hideProgress();
            }, 1500);
            
            // Store analysis result
            this.analysisResult = analysisResult;
            this.fileData = fileContent;
            
            // Generate database structure
            await this.generateDatabaseStructure();
            
            this.isUploading = false;
            
        } catch (error) {
            console.error('خطا در آپلود فایل:', error);
            this.showErrorMessage('خطا در پردازش فایل: ' + error.message);
            this.isUploading = false;
            this.hideProgress();
        }
    }
    
    /**
     * محاسبه hash فایل
     */
    async calculateFileHash(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = async function(e) {
                const buffer = e.target.result;
                const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                resolve(hashHex);
            };
            reader.readAsArrayBuffer(file);
        });
    }
    
    /**
     * بررسی وجود فایل در سیستم
     */
    async checkFileExistence(fileHash, columnsData) {
        try {
            console.log('🔍 بررسی وجود فایل...', {fileHash, columnsData});
            
            const formData = new FormData();
            formData.append('action', 'check_file_exists');
            formData.append('file_hash', fileHash);
            formData.append('columns_data', typeof columnsData === 'string' ? columnsData : JSON.stringify(columnsData));
            
            console.log('📤 ارسال درخواست به API...');
            const response = await fetch('/datasave/backend/api/v1/xls-tracking.php', {
                method: 'POST',
                body: formData
            });
            
            console.log('📥 پاسخ API دریافت شد:', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ خطای API:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
            }
            
            const text = await response.text();
            console.log('📄 Raw API Response:', text);
            
            let result;
            try {
                result = JSON.parse(text);
            } catch (parseError) {
                console.error('❌ خطا در تجزیه JSON:', parseError);
                console.error('📄 پاسخ خام:', text);
                throw new Error('پاسخ API نامعتبر است: ' + text.substring(0, 200));
            }
            
            console.log('✅ پاسخ تجزیه شده:', result);
            
            if (result.success && result.exists) {
                this.fileExistenceStatus = result;
                this.handleExistingFile(result);
            } else {
                this.fileExistenceStatus = {
                    exists: false,
                    action: 'create_table'
                };
                console.log('✨ فایل جدید - جدول جدید ایجاد خواهد شد');
            }
            
        } catch (error) {
            console.error('💥 خطا در بررسی وجود فایل:', error);
            this.showNotification('خطا در بررسی وجود فایل: ' + error.message, 'error');
            this.fileExistenceStatus = {
                exists: false,
                action: 'create_table'
            };
        }
    }
    
    /**
     * مدیریت فایل موجود
     */
    handleExistingFile(result) {
        switch (result.action) {
            case 'update_data':
                this.showFileExistenceNotification(
                    'فایل مشابه یافت شد',
                    `این فایل قبلاً پردازش شده و جدول "${result.table_name}" ایجاد شده است. داده‌ها بروزرسانی خواهند شد.`,
                    'info'
                );
                break;
                
            case 'structure_changed':
                this.showFileExistenceNotification(
                    'ساختار فایل تغییر کرده',
                    result.message,
                    'warning'
                );
                break;
        }
    }
    
    /**
     * نمایش اطلاعیه وجود فایل
     */
    showFileExistenceNotification(title, message, type) {
        // ایجاد پنل اطلاعیه
        const notification = document.createElement('div');
        notification.className = `dm-file-notification dm-notification-${type}`;
        notification.innerHTML = `
            <div class="dm-notification-header">
                <i class="fas fa-${type === 'info' ? 'info-circle' : type === 'warning' ? 'exclamation-triangle' : 'check-circle'}"></i>
                <strong>${title}</strong>
                <button class="dm-notification-close" onclick="this.parentNode.parentNode.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="dm-notification-body">
                ${message}
            </div>
        `;
        
        // اضافه کردن به صفحه
        const contentArea = document.querySelector('.dm-content-area');
        if (contentArea) {
            contentArea.insertBefore(notification, contentArea.firstChild);
            
            // حذف خودکار بعد از 10 ثانیه
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 10000);
        }
    }
    
    /**
     * اعتبارسنجی فایل
     */
    validateFile(file) {
        // Check file size
        if (file.size > this.config.maxFileSize) {
            this.showErrorMessage('حجم فایل نباید بیشتر از 10 مگابایت باشد');
            return false;
        }
        
        // Check file type
        if (!this.config.allowedTypes.includes(file.type) && !file.name.match(/\.(xlsx?|csv)$/i)) {
            this.showErrorMessage('فرمت فایل پشتیبانی نمی‌شود. لطفاً فایل Excel یا CSV انتخاب کنید');
            return false;
        }
        
        return true;
    }
    
    /**
     * خواندن محتوای فایل
     */
    readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                resolve(e.target.result);
            };
            
            reader.onerror = () => {
                reject(new Error('خطا در خواندن فایل'));
            };
            
            // Read as array buffer for Excel files, text for CSV
            if (file.type.includes('csv') || file.name.endsWith('.csv')) {
                reader.readAsText(file);
            } else {
                reader.readAsArrayBuffer(file);
            }
        });
    }
    
    /**
     * تحلیل فایل با کمک AI
     */
    async analyzeFileWithAI(file, content) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch(this.config.apiEndpoint, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.message || 'خطا در تحلیل فایل');
            }
            
            return result.data;
            
        } catch (error) {
            console.error('خطا در تحلیل AI:', error);
            // Return mock data for now
            return this.getMockAnalysisResult(file);
        }
    }
    
    /**
     * نتیجه تحلیل آزمایشی (Mock)
     */
    getMockAnalysisResult(file) {
        return {
            fileName: file.name,
            fileSize: file.size,
            totalRows: Math.floor(Math.random() * 1000) + 100,
            totalColumns: Math.floor(Math.random() * 10) + 5,
            hasHeader: true,
            columns: [
                { name: 'شناسه', type: 'number', samples: ['1', '2', '3'] },
                { name: 'نام', type: 'text', samples: ['احمد رضایی', 'فاطمه احمدی', 'علی محمدی'] },
                { name: 'تاریخ', type: 'date', samples: ['1402/01/01', '1402/01/02', '1402/01/03'] },
                { name: 'مبلغ', type: 'currency', samples: ['1,500,000', '2,300,000', '950,000'] },
                { name: 'وضعیت', type: 'status', samples: ['فعال', 'غیرفعال', 'در انتظار'] }
            ],
            preview: [
                ['شناسه', 'نام', 'تاریخ', 'مبلغ', 'وضعیت'],
                ['1', 'احمد رضایی', '1402/01/01', '1,500,000', 'فعال'],
                ['2', 'فاطمه احمدی', '1402/01/02', '2,300,000', 'فعال'],
                ['3', 'علی محمدی', '1402/01/03', '950,000', 'غیرفعال'],
                ['4', 'زهرا حسینی', '1402/01/04', '1,800,000', 'در انتظار'],
                ['5', 'محسن کریمی', '1402/01/05', '2,100,000', 'فعال']
            ],
            analysis: {
                summary: 'این فایل حاوی اطلاعات مالی است شامل 5 ستون و تعداد زیادی رکورد. داده‌ها منظم هستند و هیچ خطای آشکاری ندارند.',
                dataQuality: 'عالی',
                suggestions: [
                    'ستون تاریخ به فرمت استاندارد تبدیل شود',
                    'مبالغ می‌توانند به عنوان عدد ذخیره شوند',
                    'ستون وضعیت می‌تواند به boolean تبدیل شود'
                ]
            }
        };
    }
    
    /**
     * نمایش اطلاعات فایل
     */
    displayFileInfo(file, analysis) {
        const fileInfo = this.elements.fileInfo;
        const fileName = this.elements.fileName;
        const fileDetails = this.elements.fileDetails;
        const fileStats = this.elements.fileStats;
        
        if (!fileInfo || !fileName || !fileDetails || !fileStats) return;
        
        // Update file name and details
        fileName.textContent = file.name;
        fileDetails.textContent = `${this.formatFileSize(file.size)} • ${analysis.totalRows.toLocaleString('fa-IR')} ردیف • ${analysis.totalColumns} ستون`;
        
        // Create stats
        const stats = [
            { label: 'تعداد ردیف', value: analysis.totalRows.toLocaleString('fa-IR') },
            { label: 'تعداد ستون', value: analysis.totalColumns },
            { label: 'کیفیت داده', value: 'خوب' }, // API جدید این فیلد را ندارد
            { label: 'هدر دارد', value: analysis.hasHeader ? 'بله' : 'خیر' }
        ];
        
        fileStats.innerHTML = stats.map(stat => `
            <div class="dm-stat-item">
                <span class="dm-stat-value">${stat.value}</span>
                <span class="dm-stat-label">${stat.label}</span>
            </div>
        `).join('');
        
        // Show file info with animation
        fileInfo.style.display = 'block';
        setTimeout(() => {
            fileInfo.classList.add('show');
        }, 100);
    }
    
    /**
     * نمایش پیش‌نمایش جدول
     */
    displayTablePreview(preview) {
        const tablePreview = this.elements.tablePreview;
        const dataTable = this.elements.dataTable;
        
        if (!tablePreview || !dataTable || !preview || preview.length === 0) return;
        
        // Create table HTML
        const [headers, ...rows] = preview;
        
        const tableHTML = `
            <thead>
                <tr>
                    ${headers.map(header => `<th>${header}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${rows.map(row => `
                    <tr>
                        ${row.map(cell => `<td>${cell}</td>`).join('')}
                    </tr>
                `).join('')}
            </tbody>
        `;
        
        dataTable.innerHTML = tableHTML;
        
        // Show table preview with animation
        tablePreview.style.display = 'block';
        setTimeout(() => {
            tablePreview.classList.add('dm-fade-in');
        }, 200);
        
        // Generate field selection panel
        this.generateFieldSelection(headers);
    }
    
    /**
     * تولید پنل انتخاب فیلدها
     */
    generateFieldSelection(headers) {
        const fieldSelection = document.getElementById('fieldSelection');
        const fieldCheckboxes = document.getElementById('fieldCheckboxes');
        
        if (!fieldSelection || !fieldCheckboxes || !headers) return;
        
        // Clear previous checkboxes
        fieldCheckboxes.innerHTML = '';
        
        // Create checkbox for each field
        headers.forEach((header, index) => {
            const checkboxItem = document.createElement('div');
            checkboxItem.className = 'dm-field-checkbox';
            checkboxItem.innerHTML = `
                <input type="checkbox" id="field_${index}" value="${header}" checked>
                <label for="field_${index}">${header}</label>
            `;
            
            // Add click event to the container
            checkboxItem.addEventListener('click', (e) => {
                if (e.target.tagName !== 'INPUT') {
                    const checkbox = checkboxItem.querySelector('input');
                    checkbox.checked = !checkbox.checked;
                }
                checkboxItem.classList.toggle('selected', checkboxItem.querySelector('input').checked);
            });
            
            // Add change event to checkbox
            const checkbox = checkboxItem.querySelector('input');
            checkbox.addEventListener('change', () => {
                checkboxItem.classList.toggle('selected', checkbox.checked);
            });
            
            fieldCheckboxes.appendChild(checkboxItem);
        });
        
        // Show field selection panel
        fieldSelection.style.display = 'block';
        setTimeout(() => {
            fieldSelection.classList.add('dm-fade-in');
        }, 300);
        
        // Generate unique field selector
        this.generateUniqueFieldSelector(headers);
    }
    
    /**
     * تولید انتخابگر فیلد کلیدی
     */
    generateUniqueFieldSelector(headers) {
        const uniqueFieldSection = document.getElementById('uniqueFieldSection');
        const uniqueFieldSelect = document.getElementById('uniqueFieldSelect');
        
        if (!uniqueFieldSection || !uniqueFieldSelect || !headers) return;
        
        // Clear previous options
        uniqueFieldSelect.innerHTML = '<option value="">فیلد کلیدی انتخاب کنید...</option>';
        
        // Add options for each header
        headers.forEach(header => {
            const option = document.createElement('option');
            option.value = header;
            option.textContent = header;
            uniqueFieldSelect.appendChild(option);
        });
        
        // Show unique field section if file exists
        if (this.fileExistenceStatus?.exists) {
            uniqueFieldSection.style.display = 'block';
            
            // Auto-select if already defined
            if (this.fileExistenceStatus.unique_field) {
                uniqueFieldSelect.value = this.fileExistenceStatus.unique_field;
            }
        }
    }

    /**
     * ارسال پیام به AI
     */
    async sendMessageToAI(message) {
        try {
            // دریافت تنظیمات AI از دیتابیس
            const settingsResponse = await fetch('/datasave/backend/api/v1/ai-settings.php?action=get');
            const settingsData = await settingsResponse.json();
            
            if (!settingsData.success) {
                console.warn('خطا در دریافت تنظیمات AI، استفاده از پاسخ Mock');
                return this.getMockAIResponse(message);
            }
            
            const settings = settingsData.data; // اصلاح: استفاده از data به جای settings
            const apiKey = settings.openai_api_key?.value?.trim().replace(/\s/g, ''); // اصلاح: دسترسی به value
            const model = settings.ai_model?.value || 'gpt-4o'; // اصلاح: دسترسی به value
            const temperature = parseFloat(settings.temperature?.value) || 0.7; // اصلاح: دسترسی به value
            const maxTokens = parseInt(settings.max_tokens?.value) || 1000; // اصلاح: دسترسی به value
            
            if (!apiKey || apiKey.length < 20) {
                console.warn('کلید OpenAI تنظیم نشده، استفاده از پاسخ Mock');
                return this.getMockAIResponse(message);
            }
            
            // ساخت context از داده‌های فایل
            let contextMessage = message;
            if (this.analysisResult) {
                const context = `
اطلاعات فایل آپلود شده:
- نام فایل: ${this.analysisResult.fileName}
- تعداد ردیف: ${this.analysisResult.totalRows}
- تعداد ستون: ${this.analysisResult.totalColumns}
- ستون‌ها: ${this.analysisResult.preview[0]?.join(', ') || 'نامشخص'}

سوال کاربر: ${message}

لطفاً بر اساس اطلاعات فایل پاسخ مفصل و کاربردی ارائه دهید.`;
                
                contextMessage = context;
            }
            
            // فراخوانی مستقیم OpenAI API
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        {
                            role: 'system',
                            content: 'شما یک متخصص تحلیل داده هستید که به زبان فارسی پاسخ می‌دهید. پاسخ‌های مفید، دقیق و قابل فهم ارائه دهید. از اطلاعات فایل ارائه شده برای پاسخگویی دقیق استفاده کنید.'
                        },
                        {
                            role: 'user',
                            content: contextMessage
                        }
                    ],
                    temperature: temperature,
                    max_tokens: maxTokens
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('OpenAI API Error:', errorText);
                throw new Error(`خطای API: ${response.status}`);
            }
            
            const data = await response.json();
            const aiResponse = data.choices[0]?.message?.content || "پاسخی دریافت نشد.";
            
            return aiResponse;
            
        } catch (error) {
            console.error('خطا در چت AI:', error);
            console.warn('استفاده از پاسخ Mock به دلیل خطا');
            return this.getMockAIResponse(message);
        }
    }
    
    /**
     * پاسخ آزمایشی AI
     */
    getMockAIResponse(message) {
        const responses = [
            'بر اساس تحلیل فایل شما، داده‌ها دارای کیفیت مناسبی هستند و ساختار منظمی دارند.',
            'فایل شما شامل ' + (this.analysisResult?.totalRows || 0) + ' ردیف داده است که در ' + (this.analysisResult?.totalColumns || 0) + ' ستون تقسیم شده‌اند.',
            'ستون‌های موجود در فایل شما شامل: ' + (this.analysisResult?.columns?.map(col => col.name).join('، ') || 'نامشخص'),
            'کیفیت داده‌های شما ' + (this.analysisResult?.analysis?.dataQuality || 'خوب') + ' است و نیاز به پردازش خاصی ندارد.',
            'برای بهبود داده‌هایتان پیشنهاد می‌کنم: ' + (this.analysisResult?.analysis?.suggestions?.[0] || 'بررسی دوباره ساختار داده‌ها')
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    /**
     * نمایش نوار پیشرفت
     */
    showProgress(label) {
        const progressContainer = this.elements.progressContainer;
        const progressLabel = this.elements.progressLabel;
        
        if (progressContainer && progressLabel) {
            progressLabel.textContent = label;
            progressContainer.style.display = 'block';
            setTimeout(() => {
                progressContainer.classList.add('show');
            }, 100);
        }
    }
    
    /**
     * بروزرسانی نوار پیشرفت
     */
    updateProgress(percent, label) {
        const progressFill = this.elements.progressFill;
        const progressPercent = this.elements.progressPercent;
        const progressLabel = this.elements.progressLabel;
        
        if (progressFill && progressPercent) {
            progressFill.style.width = percent + '%';
            progressPercent.textContent = percent + '%';
        }
        
        if (label && progressLabel) {
            progressLabel.textContent = label;
        }
    }
    
    /**
     * پنهان کردن نوار پیشرفت
     */
    hideProgress() {
        const progressContainer = this.elements.progressContainer;
        if (progressContainer) {
            progressContainer.classList.remove('show');
            setTimeout(() => {
                progressContainer.style.display = 'none';
                this.updateProgress(0, '');
            }, 300);
        }
    }
    
    /**
     * نمایش پیام خطا
     */
    showErrorMessage(message) {
        console.error(message);
        this.showNotification(message, 'error');
    }
    
    /**
     * فرمت کردن حجم فایل
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 بایت';
        
        const k = 1024;
        const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    /**
     * تولید ساختار دیتابیس با کمک AI
     */
    async generateDatabaseStructure() {
        if (!this.analysisResult) return;
        
        try {
            console.log('🔄 شروع تولید ساختار دیتابیس...');
            
            // نمایش پنل دیتابیس
            if (this.elements.databasePreview) {
                this.elements.databasePreview.style.display = 'block';
            }
            
            // تولید prompt برای AI
            const columns = this.analysisResult.preview[0] || [];
            const sampleData = this.analysisResult.preview.slice(1, 4) || [];
            
            console.log('📊 ستون‌ها:', columns);
            console.log('📄 نمونه داده‌ها:', sampleData);
            
            const prompt = `
بر اساس فایل Excel با ستون‌های زیر، لطفاً ساختار دیتابیس پیشنهاد دهید:

ستون‌ها: ${columns.join(', ')}
نمونه داده‌ها:
${sampleData.map(row => row.join(' | ')).join('\n')}

لطفاً موارد زیر را ارائه دهید:
1. نام مناسب برای دیتابیس (انگلیسی)
2. نام مناسب برای جدول (انگلیسی)
3. برای هر ستون:
   - نام انگلیسی مناسب
   - نوع داده SQL (VARCHAR, INT, DATE, etc.)
   - طول فیلد
   - آیا NULL قابل قبول است یا خیر

پاسخ را در قالب JSON ارائه دهید.`;

            console.log('🤖 ارسال prompt به AI...');
            const aiResponse = await this.sendMessageToAI(prompt);
            console.log('📥 پاسخ AI دریافت شد:', typeof aiResponse, aiResponse.substring(0, 500) + '...');
            
            // پردازش پاسخ AI و نمایش ساختار
            this.parseAndDisplayStructure(aiResponse, columns);
            
        } catch (error) {
            console.error('💥 خطا در تولید ساختار دیتابیس:', error);
            console.log('🔄 استفاده از ساختار پیش‌فرض...');
            
            // در صورت خطا، از ساختار پیش‌فرض استفاده کن
            const columns = this.analysisResult.preview[0] || [];
            this.generateDefaultStructure(columns);
        }
    }
    
    /**
     * پردازش پاسخ AI و نمایش ساختار
     */
    parseAndDisplayStructure(aiResponse, columns) {
        try {
            console.log('🔍 پردازش پاسخ AI...', aiResponse);
            
            let structure;
            
            // تلاش برای استخراج JSON از پاسخ AI
            let jsonString = '';
            
            // روش 1: جستجو برای کامل‌ترین JSON block
            const jsonMatches = aiResponse.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g);
            if (jsonMatches && jsonMatches.length > 0) {
                // انتخاب بزرگترین JSON block
                jsonString = jsonMatches.reduce((prev, current) => 
                    current.length > prev.length ? current : prev
                );
            }
            
            // روش 2: جستجو با regex پیشرفته‌تر
            if (!jsonString) {
                const advancedMatch = aiResponse.match(/\{[\s\S]*?\}/);
                if (advancedMatch) {
                    jsonString = advancedMatch[0];
                }
            }
            
            // روش 3: پاک‌سازی و تنظیم JSON
            if (jsonString) {
                try {
                    // پاک‌سازی کاراکترهای اضافی
                    jsonString = jsonString
                        .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // حذف کنترل کاراکترها
                        .replace(/,\s*([}\]])/g, "$1") // حذف کاما اضافی
                        .replace(/([{\[])\s*,/g, "$1") // حذف کاما در ابتدا
                        .trim();
                    
                    console.log('🧹 JSON پاک‌سازی شده:', jsonString);
                    structure = JSON.parse(jsonString);
                    
                } catch (parseError) {
                    console.warn('❌ خطا در تجزیه JSON:', parseError);
                    console.log('📄 JSON خراب:', jsonString);
                    throw parseError;
                }
            } else {
                throw new Error('هیچ JSON معتبری در پاسخ یافت نشد');
            }
            
            // اعتبارسنجی ساختار
            if (!structure || typeof structure !== 'object') {
                throw new Error('ساختار JSON نامعتبر است');
            }
            
            console.log('✅ ساختار تجزیه شده:', structure);
            
            // نمایش نام دیتابیس و جدول
            const dbNameInput = document.getElementById('suggestedDbName');
            const tableNameInput = document.getElementById('suggestedTableName');
            
            if (dbNameInput) dbNameInput.value = structure.database_name || 'ai_excell2form';
            if (tableNameInput) tableNameInput.value = structure.table_name || 'xlstbl_' + Date.now();
            
            // نمایش فیلدها
            this.displayFields(structure.fields || []);
            
            // تولید کدهای SQL و HTML
            this.generateCodes(structure);
            
        } catch (error) {
            console.error('💥 خطا در پردازش ساختار:', error);
            console.log('🔄 استفاده از ساختار پیش‌فرض...');
            this.generateDefaultStructure(columns);
        }
    }
    
    /**
     * ایجاد ساختار پیش‌فرض
     */
    createDefaultStructure(columns) {
        const fields = columns.map((col, index) => ({
            original_name: col,
            english_name: this.translateToEnglish(col),
            data_type: this.guessDataType(col),
            length: this.guessLength(col),
            nullable: index > 0, // اولین فیلد معمولاً ID است
            is_primary: index === 0
        }));
        
        return {
            database_name: 'excel_data',
            table_name: 'imported_data',
            fields: fields
        };
    }
    
    /**
     * ترجمه نام فارسی به انگلیسی
     */
    translateToEnglish(persianName) {
        const translations = {
            'شناسه': 'id',
            'نام': 'name',
            'سن': 'age',
            'سال': 'year',
            'تاریخ': 'date',
            'شهر': 'city',
            'حقوق': 'salary',
            'بخش': 'department',
            'رکورد': 'record',
            'شماره': 'number',
            'کد': 'code',
            'توضیحات': 'description',
            'آدرس': 'address',
            'تلفن': 'phone',
            'ایمیل': 'email'
        };
        
        const cleaned = persianName.trim().toLowerCase();
        return translations[cleaned] || 
               persianName.replace(/[\u0600-\u06FF\s]/g, '').toLowerCase() || 
               `field_${Math.random().toString(36).substr(2, 5)}`;
    }
    
    /**
     * حدس نوع داده
     */
    guessDataType(columnName) {
        const name = columnName.toLowerCase();
        
        if (name.includes('شناسه') || name.includes('کد') || name.includes('id')) {
            return 'INT';
        } else if (name.includes('سن') || name.includes('تعداد') || name.includes('عدد')) {
            return 'INT';
        } else if (name.includes('حقوق') || name.includes('قیمت') || name.includes('مبلغ')) {
            return 'DECIMAL(10,2)';
        } else if (name.includes('تاریخ') || name.includes('date')) {
            return 'DATE';
        } else if (name.includes('زمان') || name.includes('time')) {
            return 'DATETIME';
        } else {
            return 'VARCHAR';
        }
    }
    
    /**
     * حدس طول فیلد
     */
    guessLength(columnName) {
        const dataType = this.guessDataType(columnName);
        
        if (dataType === 'VARCHAR') {
            const name = columnName.toLowerCase();
            if (name.includes('نام') || name.includes('شهر')) {
                return '100';
            } else if (name.includes('آدرس') || name.includes('توضیحات')) {
                return '255';
            } else {
                return '50';
            }
        } else if (dataType === 'INT') {
            return '11';
        }
        
        return '';
    }
    
    /**
     * نمایش فیلدها
     */
    displayFields(fields) {
        const container = document.getElementById('fieldsContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        fields.forEach((field, index) => {
            const fieldHtml = `
                <div class="dm-field-item" data-index="${index}">
                    <div class="dm-field-header">
                        <span class="dm-field-original">${field.original_name}</span>
                        <span class="dm-field-status">فعال</span>
                    </div>
                    <div class="dm-field-details">
                        <div class="dm-field-row">
                            <label>نام انگلیسی:</label>
                            <input type="text" value="${field.english_name}" onchange="dataManagement.updateField(${index}, 'english_name', this.value)">
                        </div>
                        <div class="dm-field-row">
                            <label>نوع داده:</label>
                            <select onchange="dataManagement.updateField(${index}, 'data_type', this.value)">
                                <option value="VARCHAR" ${field.data_type === 'VARCHAR' ? 'selected' : ''}>VARCHAR</option>
                                <option value="INT" ${field.data_type === 'INT' ? 'selected' : ''}>INT</option>
                                <option value="DECIMAL(10,2)" ${field.data_type === 'DECIMAL(10,2)' ? 'selected' : ''}>DECIMAL</option>
                                <option value="DATE" ${field.data_type === 'DATE' ? 'selected' : ''}>DATE</option>
                                <option value="DATETIME" ${field.data_type === 'DATETIME' ? 'selected' : ''}>DATETIME</option>
                                <option value="TEXT" ${field.data_type === 'TEXT' ? 'selected' : ''}>TEXT</option>
                            </select>
                        </div>
                        <div class="dm-field-row">
                            <label>طول:</label>
                            <input type="text" value="${field.length || ''}" onchange="dataManagement.updateField(${index}, 'length', this.value)">
                        </div>
                        <div class="dm-field-row">
                            <label>NULL:</label>
                            <select onchange="dataManagement.updateField(${index}, 'nullable', this.value === 'true')">
                                <option value="true" ${field.nullable ? 'selected' : ''}>مجاز</option>
                                <option value="false" ${!field.nullable ? 'selected' : ''}>غیرمجاز</option>
                            </select>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', fieldHtml);
        });
        
        // ذخیره ساختار فعلی
        this.currentStructure = {
            database_name: document.getElementById('suggestedDbName')?.value || 'excel_data',
            table_name: document.getElementById('suggestedTableName')?.value || 'imported_data',
            fields: fields
        };
    }
    
    /**
     * بروزرسانی فیلد
     */
    updateField(index, property, value) {
        if (this.currentStructure && this.currentStructure.fields[index]) {
            this.currentStructure.fields[index][property] = value;
            this.generateCodes(this.currentStructure);
        }
    }
    
    /**
     * تغییر تب کد
     */
    switchCodeTab(tabName) {
        // حذف کلاس active از همه تب‌ها
        document.querySelectorAll('.dm-code-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.dm-code-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        // فعال کردن تب انتخابی
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}Panel`).classList.add('active');
    }
    
    /**
     * تولید کدهای SQL و HTML
     */
    generateCodes(structure) {
        this.generateSQLCode(structure);
        this.generateHTMLCode(structure);
    }
    
    /**
     * تولید کد SQL
     */
    generateSQLCode(structure) {
        const sqlCode = document.getElementById('sqlCode');
        if (!sqlCode) return;
        
        let sql = `-- ایجاد دیتابیس\nCREATE DATABASE IF NOT EXISTS \`${structure.database_name}\`;\nUSE \`${structure.database_name}\`;\n\n`;
        
        sql += `-- ایجاد جدول\nCREATE TABLE IF NOT EXISTS \`${structure.table_name}\` (\n`;
        
        const fieldDefinitions = structure.fields.map(field => {
            let def = `  \`${field.english_name}\` ${field.data_type}`;
            
            if (field.data_type === 'VARCHAR' && field.length) {
                def += `(${field.length})`;
            }
            
            if (!field.nullable) {
                def += ' NOT NULL';
            }
            
            if (field.is_primary) {
                def += ' PRIMARY KEY AUTO_INCREMENT';
            }
            
            return def;
        });
        
        sql += fieldDefinitions.join(',\n');
        sql += '\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;';
        
        sqlCode.textContent = sql;
    }
    
    /**
     * تولید کد HTML
     */
    generateHTMLCode(structure) {
        const htmlCode = document.getElementById('htmlCode');
        if (!htmlCode) return;
        
        let html = `<!-- فرم HTML برای جدول ${structure.table_name} -->\n`;
        html += `<form id="${structure.table_name}Form" class="data-form">\n`;
        
        structure.fields.forEach(field => {
            if (field.is_primary) return; // خودکار
            
            html += `  <div class="form-group">\n`;
            html += `    <label for="${field.english_name}">${field.original_name}:</label>\n`;
            
            if (field.data_type === 'TEXT') {
                html += `    <textarea id="${field.english_name}" name="${field.english_name}"${!field.nullable ? ' required' : ''}></textarea>\n`;
            } else if (field.data_type === 'DATE') {
                html += `    <input type="date" id="${field.english_name}" name="${field.english_name}"${!field.nullable ? ' required' : ''}>\n`;
            } else if (field.data_type === 'DATETIME') {
                html += `    <input type="datetime-local" id="${field.english_name}" name="${field.english_name}"${!field.nullable ? ' required' : ''}>\n`;
            } else {
                const inputType = field.data_type.includes('INT') || field.data_type.includes('DECIMAL') ? 'number' : 'text';
                html += `    <input type="${inputType}" id="${field.english_name}" name="${field.english_name}"${!field.nullable ? ' required' : ''}>\n`;
            }
            
            html += `  </div>\n\n`;
        });
        
        html += `  <button type="submit">ذخیره</button>\n`;
        html += `</form>`;
        
        htmlCode.textContent = html;
    }
    
    /**
     * ایجاد ساختار پیش‌فرض در صورت خطا
     */
    generateDefaultStructure(columns = null) {
        console.log('🔄 ایجاد ساختار پیش‌فرض...');
        
        if (!columns && this.analysisResult) {
            columns = this.analysisResult.preview[0] || [];
        }
        
        if (!columns || columns.length === 0) {
            console.warn('⚠️ هیچ ستونی یافت نشد - استفاده از ساختار نمونه');
            columns = ['field_1', 'field_2', 'field_3'];
        }
        
        const structure = this.createDefaultStructure(columns);
        console.log('✅ ساختار پیش‌فرض ایجاد شد:', structure);
        
        // مستقیماً نمایش دهیم
        try {
            // نمایش نام دیتابیس و جدول
            const dbNameInput = document.getElementById('suggestedDbName');
            const tableNameInput = document.getElementById('suggestedTableName');
            
            if (dbNameInput) dbNameInput.value = structure.database_name || 'ai_excell2form';
            if (tableNameInput) tableNameInput.value = structure.table_name || 'xlstbl_' + Date.now();
            
            // نمایش فیلدها
            this.displayFields(structure.fields || []);
            
            // تولید کدهای SQL و HTML
            this.generateCodes(structure);
            
        } catch (error) {
            console.error('❌ خطا در نمایش ساختار پیش‌فرض:', error);
        }
    }

    /**
     * انتخاب همه فیلدها
     */
    selectAllFields() {
        const checkboxes = document.querySelectorAll('#fieldCheckboxes input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = true;
            checkbox.closest('.dm-field-checkbox').classList.add('selected');
        });
    }
    
    /**
     * لغو انتخاب همه فیلدها
     */
    deselectAllFields() {
        const checkboxes = document.querySelectorAll('#fieldCheckboxes input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.closest('.dm-field-checkbox').classList.remove('selected');
        });
    }
    
    /**
     * دریافت فیلدهای انتخاب شده
     */
    getSelectedFields() {
        const checkboxes = document.querySelectorAll('#fieldCheckboxes input[type="checkbox"]:checked');
        return Array.from(checkboxes).map(checkbox => checkbox.value);
    }
    
    /**
     * تولید ساختار دیتابیس با کمک هوش مصنوعی
     */
    async generateDatabaseStructureWithAI() {
        const selectedFields = this.getSelectedFields();
        
        if (selectedFields.length === 0) {
            this.showNotification('لطفاً حداقل یک فیلد انتخاب کنید', 'warning');
            return;
        }
        
        // نمایش loading
        const generateBtn = document.getElementById('generateDbStructure');
        const originalText = generateBtn.innerHTML;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال تولید...';
        generateBtn.disabled = true;
        
        try {
            // آماده‌سازی پیام برای AI
            const aiPrompt = this.createAIPromptForDatabase(selectedFields);
            
            // ارسال درخواست به AI
            const aiResponse = await this.sendMessageToAI(aiPrompt);
            
            // تجزیه پاسخ AI و نمایش ساختار
            this.parseAIResponseAndDisplayStructure(aiResponse, selectedFields);
            
        } catch (error) {
            console.error('خطا در تولید ساختار دیتابیس:', error);
            this.showNotification('خطا در تولید ساختار دیتابیس', 'error');
        } finally {
            generateBtn.innerHTML = originalText;
            generateBtn.disabled = false;
        }
    }
    
    /**
     * ایجاد پیام برای هوش مصنوعی
     */
    createAIPromptForDatabase(selectedFields) {
        const fileName = this.analysisResult?.fileName || 'فایل';
        const sampleData = this.analysisResult?.preview?.slice(1, 3) || []; // نمونه داده‌ها
        
        return `
من یک فایل Excel با نام "${fileName}" دارم که شامل ${selectedFields.length} فیلد است:
${selectedFields.map((field, index) => `${index + 1}. ${field}`).join('\n')}

نمونه داده‌ها:
${sampleData.map(row => selectedFields.map((field, index) => `${field}: ${row[index] || 'خالی'}`).join(' | ')).join('\n')}

لطفاً برای این داده‌ها:
1. یک نام مناسب برای جدول به زبان انگلیسی پیشنهاد دهید (بدون prefix - فقط نام اصلی)
2. برای هر فیلد انتخاب شده:
   - نام انگلیسی مناسب پیشنهاد دهید
   - نوع فیلد مناسب (VARCHAR, INT, DATE, TEXT و...) تشخیص دهید
   - طول فیلد را مشخص کنید
   - اگر فیلد اجباری است یا نه
   - آیا فیلد منحصر به فرد است یا نه

توجه: نام جدول نهایی با prefix xlstbl_ شروع خواهد شد.
پاسخ را به صورت JSON ساختار یافته ارائه دهید.
        `;
    }
    
    /**
     * تجزیه پاسخ AI و نمایش ساختار
     */
    parseAIResponseAndDisplayStructure(aiResponse, selectedFields) {
        try {
            // تلاش برای استخراج JSON از پاسخ
            let structureData;
            
            // جستجوی JSON در پاسخ
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                structureData = JSON.parse(jsonMatch[0]);
            } else {
                // اگر JSON نبود، ساختار پیش‌فرض ایجاد کن
                structureData = this.createDefaultStructureForFields(selectedFields, aiResponse);
            }
            
            // نمایش ساختار تولید شده
            this.displayGeneratedStructure(structureData);
            
        } catch (error) {
            console.warn('خطا در تجزیه پاسخ JSON، استفاده از ساختار پیش‌فرض');
            const defaultStructure = this.createDefaultStructureForFields(selectedFields, aiResponse);
            this.displayGeneratedStructure(defaultStructure);
        }
    }
    
    /**
     * ایجاد ساختار پیش‌فرض
     */
    createDefaultStructureForFields(selectedFields, aiResponse) {
        // تولید نام جدول بر اساس محتوا
        const suggestedTableName = this.generateTableName(aiResponse);
        
        return {
            table_name: suggestedTableName,
            description: `جدول تولید شده از فایل ${this.analysisResult?.fileName}`,
            fields: selectedFields.map((field, index) => ({
                original_name: field,
                english_name: this.translateFieldName(field),
                type: this.guessFieldType(field, index),
                length: this.guessFieldLength(field),
                nullable: index > 0, // فیلد اول معمولاً شناسه است
                unique: index === 0,
                description: `فیلد ${field} تبدیل شده`
            }))
        };
    }
    
    /**
     * تولید نام جدول با prefix ثابت
     */
    generateTableName(aiResponse) {
        const fileName = this.analysisResult?.fileName || 'data';
        
        // استخراج نام پیشنهادی از پاسخ AI اگر وجود دارد
        const tableNameMatch = aiResponse?.match(/(?:table|جدول|نام).*?[:：]\s*([a-zA-Z_][a-zA-Z0-9_]*)/i);
        let baseName = tableNameMatch ? tableNameMatch[1] : fileName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        
        // حذف prefix قدیمی اگر وجود دارد
        baseName = baseName.replace(/^(xlstbl_|xls2tbl_)/, '');
        
        // اضافه کردن prefix ثابت
        return `xlstbl_${baseName}`;
    }
    
    /**
     * ترجمه نام فیلد
     */
    translateFieldName(persianName) {
        // نقشه ترجمه کلمات رایج
        const translations = {
            'نام': 'name',
            'نام خانوادگی': 'lastname',
            'شناسه': 'id',
            'کد': 'code',
            'کدملی': 'national_code',
            'کد ملی': 'national_code',
            'سن': 'age',
            'سال': 'year',
            'شهر': 'city',
            'استان': 'province',
            'کشور': 'country',
            'تاریخ': 'date',
            'تاریخ تولد': 'birth_date',
            'تلفن': 'phone',
            'موبایل': 'mobile',
            'همراه': 'mobile',
            'ایمیل': 'email',
            'آدرس': 'address',
            'حقوق': 'salary',
            'مبلغ': 'amount',
            'قیمت': 'price',
            'تعداد': 'count',
            'بخش': 'department',
            'رتبه': 'rank',
            'وضعیت': 'status',
            'جنسیت': 'gender',
            'تحصیلات': 'education',
            'شغل': 'job',
            'درآمد': 'income',
            'محل کار': 'workplace'
        };
        
        // بررسی مستقیم ترجمه
        const directTranslation = translations[persianName.trim()];
        if (directTranslation) {
            return directTranslation;
        }
        
        // تبدیل کاراکترهای فارسی/عربی به انگلیسی
        let englishName = persianName
            .replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g, '') // حذف کاراکترهای فارسی/عربی
            .replace(/\s+/g, '_') // جایگزینی فاصله با _
            .replace(/[^\w_]/g, '') // حذف کاراکترهای غیرمجاز
            .toLowerCase()
            .trim();
        
        // اگر نتیجه خالی باشد، نام پیش‌فرض
        if (!englishName || englishName.length === 0) {
            englishName = 'field_' + Math.random().toString(36).substr(2, 8);
        }
        
        // اگر با عدد شروع شود، prefix اضافه کن
        if (/^\d/.test(englishName)) {
            englishName = 'field_' + englishName;
        }
        
        return englishName;
    }
    
    /**
     * حدس نوع فیلد
     */
    guessFieldType(fieldName, index) {
        const name = fieldName.toLowerCase();
        
        if (name.includes('شناسه') || name.includes('کد') || index === 0) return 'INT';
        if (name.includes('سن') || name.includes('تعداد') || name.includes('سال')) return 'INT';
        if (name.includes('مبلغ') || name.includes('حقوق') || name.includes('قیمت')) return 'DECIMAL(10,2)';
        if (name.includes('تاریخ')) return 'DATE';
        if (name.includes('ایمیل')) return 'VARCHAR(100)';
        if (name.includes('تلفن') || name.includes('موبایل')) return 'VARCHAR(20)';
        if (name.includes('آدرس') || name.includes('توضیحات')) return 'TEXT';
        
        return 'VARCHAR(100)';
    }
    
    /**
     * حدس طول فیلد
     */
    guessFieldLength(fieldName) {
        const type = this.guessFieldType(fieldName, -1);
        if (type.includes('VARCHAR')) {
            const match = type.match(/VARCHAR\((\d+)\)/);
            return match ? parseInt(match[1]) : 100;
        }
        return null;
    }
    
    /**
     * نمایش ساختار تولید شده
     */
    displayGeneratedStructure(structureData) {
        // ذخیره ساختار فعلی
        this.currentStructure = structureData;
        
        // حذف پنل قدیمی اگر وجود دارد
        const oldPreview = document.getElementById('databasePreview');
        if (oldPreview) {
            oldPreview.remove();
        }
        
        // ایجاد پنل جدید
        const previewPanel = this.createDatabasePreviewPanel(structureData);
        
        // اضافه کردن بعد از پنل انتخاب فیلدها
        const fieldSelection = document.getElementById('fieldSelection');
        fieldSelection.parentNode.insertBefore(previewPanel, fieldSelection.nextSibling);
        
        // اضافه کردن event listener برای تب‌ها
        this.setupCodeTabListeners();
        
        // نمایش/مخفی کردن دکمه‌ها بر اساس وضعیت فایل
        this.setupActionButtons();
        
        // انیمیشن نمایش
        setTimeout(() => {
            previewPanel.classList.add('dm-fade-in');
        }, 100);
    }
    
    /**
     * تنظیم دکمه‌های عملیات
     */
    setupActionButtons() {
        const createTableBtn = document.getElementById('createTableBtn');
        const updateDataBtn = document.getElementById('updateDataBtn');
        
        if (this.fileExistenceStatus?.exists && this.fileExistenceStatus.action === 'update_data') {
            // نمایش دکمه آپدیت برای فایل‌های موجود
            if (createTableBtn) createTableBtn.style.display = 'none';
            if (updateDataBtn) updateDataBtn.style.display = 'inline-flex';
        } else {
            // نمایش دکمه ایجاد جدول برای فایل‌های جدید
            if (createTableBtn) createTableBtn.style.display = 'inline-flex';
            if (updateDataBtn) updateDataBtn.style.display = 'none';
        }
    }
    
    /**
     * ایجاد پنل پیش‌نمایش دیتابیس
     */
    createDatabasePreviewPanel(structureData) {
        const panel = document.createElement('div');
        panel.id = 'databasePreview';
        panel.className = 'dm-database-preview';
        
        panel.innerHTML = `
            <div class="dm-database-header">
                <h3>
                    <i class="fas fa-database"></i>
                    پیشنهاد ساختار دیتابیس
                </h3>
                <button class="dm-regenerate-btn" onclick="window.currentDataManagementInstance.generateDatabaseStructureWithAI()">
                    <i class="fas fa-redo"></i>
                </button>
            </div>
            
            <div class="dm-database-info">
                <div class="dm-info-section">
                    <label>نام جدول:</label>
                    <input type="text" value="${structureData.table_name}" id="tableName" class="dm-info-input">
                </div>
                <div class="dm-info-section">
                    <label>توضیحات:</label>
                    <input type="text" value="${structureData.description || ''}" id="tableDescription" class="dm-info-input">
                </div>
            </div>
            
            <div class="dm-database-content">
                <div class="dm-fields-container">
                    ${structureData.fields.map((field, index) => `
                        <div class="dm-field-item">
                            <div class="dm-field-header">
                                <span class="dm-field-original">${field.original_name}</span>
                                <span class="dm-field-arrow">→</span>
                                <span class="dm-field-english">${field.english_name}</span>
                            </div>
                            <div class="dm-field-details">
                                <div class="dm-field-row">
                                    <label>نام انگلیسی:</label>
                                    <input type="text" value="${field.english_name}" 
                                           onchange="window.dataManagement.updateField(${index}, 'english_name', this.value)">
                                </div>
                                <div class="dm-field-row">
                                    <label>نوع فیلد:</label>
                                    <select onchange="window.dataManagement.updateField(${index}, 'type', this.value)">
                                        <option value="VARCHAR(100)" ${field.type.includes('VARCHAR') ? 'selected' : ''}>VARCHAR</option>
                                        <option value="INT" ${field.type === 'INT' ? 'selected' : ''}>INT</option>
                                        <option value="DECIMAL(10,2)" ${field.type.includes('DECIMAL') ? 'selected' : ''}>DECIMAL</option>
                                        <option value="DATE" ${field.type === 'DATE' ? 'selected' : ''}>DATE</option>
                                        <option value="DATETIME" ${field.type === 'DATETIME' ? 'selected' : ''}>DATETIME</option>
                                        <option value="TEXT" ${field.type === 'TEXT' ? 'selected' : ''}>TEXT</option>
                                        <option value="BOOLEAN" ${field.type === 'BOOLEAN' ? 'selected' : ''}>BOOLEAN</option>
                                    </select>
                                </div>
                                <div class="dm-field-row">
                                    <label>
                                        <input type="checkbox" ${field.nullable ? '' : 'checked'} 
                                               onchange="window.dataManagement.updateField(${index}, 'nullable', !this.checked)">
                                        اجباری
                                    </label>
                                    <label>
                                        <input type="checkbox" ${field.unique ? 'checked' : ''} 
                                               onchange="window.dataManagement.updateField(${index}, 'unique', this.checked)">
                                        منحصر به فرد
                                    </label>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="dm-code-sections">
                <div class="dm-code-tabs">
                    <button class="dm-code-tab active" data-tab="sql">SQL</button>
                    <button class="dm-code-tab" data-tab="php">PHP</button>
                    <button class="dm-code-tab" data-tab="laravel">Laravel Migration</button>
                </div>
                <div class="dm-code-content">
                    <div class="dm-code-panel active" id="sql-panel">
                        <pre><code id="sql-code">${this.generateSQLCode(structureData)}</code></pre>
                    </div>
                    <div class="dm-code-panel" id="php-panel">
                        <pre><code id="php-code">${this.generatePHPCode(structureData)}</code></pre>
                    </div>
                    <div class="dm-code-panel" id="laravel-panel">
                        <pre><code id="laravel-code">${this.generateLaravelCode(structureData)}</code></pre>
                    </div>
                </div>
            </div>
            
            <div class="dm-database-actions">
                <button class="dm-btn dm-btn-success dm-action-btn" id="createTableBtn" onclick="window.currentDataManagementInstance.createTableAndImportData()">
                    <i class="fas fa-table"></i>
                    ایجاد جدول و وارد کردن داده‌ها
                </button>
                <button class="dm-btn dm-btn-warning dm-action-btn" id="updateDataBtn" onclick="window.currentDataManagementInstance.updateExistingData()" style="display: none;">
                    <i class="fas fa-sync-alt"></i>
                    بروزرسانی داده‌های موجود
                </button>
                <button class="dm-btn dm-btn-secondary dm-action-btn" id="downloadSqlBtn" onclick="window.currentDataManagementInstance.downloadSQL()">
                    <i class="fas fa-download"></i>
                    دانلود کد SQL
                </button>
            </div>
        `;
        
        return panel;
    }
    
    /**
     * تولید کد SQL
     */
    generateSQLCode(structureData) {
        if (!structureData || !structureData.fields || !Array.isArray(structureData.fields)) {
            throw new Error('ساختار داده نامعتبر است');
        }
        
        const fields = structureData.fields.map(field => {
            // اطمینان از وجود نام انگلیسی
            const englishName = field.english_name || this.translateFieldName(field.original_name || field.name || 'field');
            const fieldType = field.type || 'VARCHAR(255)';
            
            let sql = `    ${englishName} ${fieldType}`;
            if (!field.nullable) sql += ' NOT NULL';
            if (field.unique) sql += ' UNIQUE';
            if (field.comment) sql += ` COMMENT '${field.comment}'`;
            
            return sql;
        }).join(',\n');
        
        const tableName = structureData.table_name || 'xlstbl_new_table';
        
        return `USE ai_excell2form;

CREATE TABLE ${tableName} (
    id INT AUTO_INCREMENT PRIMARY KEY,
${fields},
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;
    }
    
    /**
     * تولید کد PHP
     */
    generatePHPCode(structureData) {
        return `<?php
// Database configuration
$host = 'localhost';
$dbname = 'ai_excell2form';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Insert data example
    $stmt = $pdo->prepare("INSERT INTO ${structureData.table_name} (${structureData.fields.map(f => f.english_name).join(', ')}) VALUES (${structureData.fields.map(() => '?').join(', ')})");
    
    // Execute with data
    // $stmt->execute([$value1, $value2, ...]);
    
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>`;
    }
    
    /**
     * تولید کد Laravel Migration
     */
    generateLaravelCode(structureData) {
        const fields = structureData.fields.map(field => {
            let migration = `            $table->`;
            
            if (field.type === 'INT') migration += 'integer';
            else if (field.type.includes('VARCHAR')) migration += `string('${field.english_name}', ${field.length || 100})`;
            else if (field.type === 'TEXT') migration += 'text';
            else if (field.type === 'DATE') migration += 'date';
            else if (field.type === 'DATETIME') migration += 'datetime';
            else if (field.type.includes('DECIMAL')) migration += 'decimal';
            else migration += 'string';
            
            migration += `('${field.english_name}')`;
            
            if (field.nullable) migration += '->nullable()';
            if (field.unique) migration += '->unique()';
            
            migration += ';';
            return migration;
        }).join('\n');
        
        const className = this.toPascalCase(structureData.table_name);
        
        return `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

class Create${className}Table extends Migration
{
    public function up()
    {
        Schema::create('${structureData.table_name}', function (Blueprint $table) {
            $table->id();
${fields}
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('${structureData.table_name}');
    }
}`;
    }
    
    /**
     * تبدیل نام به PascalCase
     */
    toPascalCase(str) {
        return str.replace(/(^|_)([a-z])/g, (match, p1, p2) => p2.toUpperCase());
    }
    
    /**
     * به‌روزرسانی فیلد
     */
    updateField(index, property, value) {
        if (!this.currentStructure || !this.currentStructure.fields[index]) return;
        
        this.currentStructure.fields[index][property] = value;
        
        // به‌روزرسانی کدهای تولید شده
        this.updateGeneratedCodes();
    }
    
    /**
     * تعویض تب کد
     */
    switchCodeTab(tabName) {
        // حذف کلاس active از همه تب‌ها
        document.querySelectorAll('.dm-code-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        document.querySelectorAll('.dm-code-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        // فعال کردن تب انتخاب شده
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
        document.getElementById(`${tabName}-panel`)?.classList.add('active');
    }
    
    /**
     * ایجاد جدول و وارد کردن داده‌ها
     */
    async createTableAndImportData() {
        if (!this.currentStructure || !this.analysisResult) {
            this.showNotification('ابتدا ساختار دیتابیس را تولید کنید', 'warning');
            return;
        }
        
        try {
            this.showStatus('در حال ایجاد جدول...', 'info');
            
            // ثبت فایل در سیستم ردیابی
            const fileId = await this.registerFileInSystem();
            
            // ایجاد جدول
            await this.executeCreateTable();
            
            // وارد کردن داده‌ها
            await this.importDataToTable();
            
            // به‌روزرسانی وضعیت پردازش
            await this.updateProcessingStatus(fileId, 'completed');
            
            this.showStatus('جدول با موفقیت ایجاد و داده‌ها وارد شدند', 'success');
            
        } catch (error) {
            console.error('خطا در ایجاد جدول:', error);
            this.showStatus('خطا در ایجاد جدول: ' + error.message, 'error');
        }
    }
    
    /**
     * بروزرسانی داده‌های موجود
     */
    async updateExistingData() {
        if (!this.fileExistenceStatus?.exists || !this.analysisResult) {
            this.showNotification('اطلاعات فایل موجود یافت نشد', 'warning');
            return;
        }
        
        const uniqueField = document.getElementById('uniqueFieldSelect')?.value;
        if (!uniqueField) {
            this.showNotification('لطفاً فیلد کلیدی را انتخاب کنید', 'warning');
            return;
        }
        
        try {
            this.showStatus('در حال بروزرسانی داده‌ها...', 'info');
            
            // بروزرسانی داده‌ها
            await this.performDataUpdate(uniqueField);
            
            // به‌روزرسانی وضعیت پردازش
            await this.updateProcessingStatus(this.fileExistenceStatus.file_info.id, 'updated');
            
            this.showStatus('داده‌ها با موفقیت بروزرسانی شدند', 'success');
            
        } catch (error) {
            console.error('خطا در بروزرسانی داده‌ها:', error);
            this.showStatus('خطا در بروزرسانی داده‌ها: ' + error.message, 'error');
        }
    }
    
    /**
     * ثبت فایل در سیستم ردیابی
     */
    async registerFileInSystem() {
        const formData = new FormData();
        formData.append('action', 'register_file');
        formData.append('table_name', this.currentStructure.table_name);
        formData.append('file_name', this.analysisResult.fileName);
        formData.append('file_hash', this.analysisResult.fileHash);
        formData.append('data_type', 'create_table');
        formData.append('columns_number', this.currentStructure.fields.length);
        formData.append('columns_data', this.analysisResult.columnsData);
        formData.append('total_records', this.analysisResult.totalRows || 0);
        
        const uniqueField = document.getElementById('uniqueFieldSelect')?.value;
        if (uniqueField) {
            formData.append('unique_field', uniqueField);
        }
        
        const response = await fetch('/datasave/backend/api/v1/xls-tracking.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error || 'خطا در ثبت فایل');
        }
        
        return result.file_id;
    }
    
    /**
     * اجرای دستور ایجاد جدول
     */
    async executeCreateTable() {
        const sqlCode = this.generateSQLCode(this.currentStructure);
        
        const formData = new FormData();
        formData.append('action', 'execute_sql');
        formData.append('sql', sqlCode);
        
        const response = await fetch('/datasave/backend/api/v1/data-simple.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error || 'خطا در ایجاد جدول');
        }
    }
    
    /**
     * وارد کردن داده‌ها به جدول
     */
    async importDataToTable() {
        // ارسال داده‌های فایل به API برای import
        const formData = new FormData();
        formData.append('action', 'import_data');
        formData.append('table_name', this.currentStructure.table_name);
        formData.append('file', this.currentFile);
        formData.append('field_mapping', JSON.stringify(this.currentStructure.fields));
        
        const response = await fetch('/datasave/backend/api/v1/data-simple.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error || 'خطا در وارد کردن داده‌ها');
        }
    }
    
    /**
     * بروزرسانی وضعیت پردازش
     */
    async updateProcessingStatus(fileId, status) {
        const formData = new FormData();
        formData.append('action', 'update_processing_status');
        formData.append('file_id', fileId);
        formData.append('processed_records', this.analysisResult.totalRows || 0);
        formData.append('data_type', status);
        
        const response = await fetch('/datasave/backend/api/v1/xls-tracking.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        if (!result.success) {
            console.warn('خطا در به‌روزرسانی وضعیت:', result.error);
        }
    }
    
    /**
     * دانلود کد SQL
     */
    downloadSQL() {
        if (!this.currentStructure) {
            this.showNotification('ابتدا ساختار دیتابیس را تولید کنید', 'warning');
            return;
        }
        
        const sqlCode = this.generateSQLCode(this.currentStructure);
        const blob = new Blob([sqlCode], { type: 'text/sql' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentStructure.table_name}.sql`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('فایل SQL دانلود شد', 'success');
    }
    
    /**
     * تنظیم event listener برای تب‌های کد
     */
    setupCodeTabListeners() {
        document.querySelectorAll('.dm-code-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                this.switchCodeTab(tabName);
            });
        });
    }
    
    /**
     * به‌روزرسانی کدهای تولید شده
     */
    updateGeneratedCodes() {
        if (!this.currentStructure) return;
        
        // به‌روزرسانی کد SQL
        const sqlCode = document.getElementById('sql-code');
        if (sqlCode) {
            sqlCode.textContent = this.generateSQLCode(this.currentStructure);
        }
        
        // به‌روزرسانی کد PHP
        const phpCode = document.getElementById('php-code');
        if (phpCode) {
            phpCode.textContent = this.generatePHPCode(this.currentStructure);
        }
        
        // به‌روزرسانی کد Laravel
        const laravelCode = document.getElementById('laravel-code');
        if (laravelCode) {
            laravelCode.textContent = this.generateLaravelCode(this.currentStructure);
        }
    }

    /**
     * تمیز کردن ماژول
     */
    destroy() {
        // Clean up event listeners and data
        this.currentFile = null;
        this.fileData = null;
        this.analysisResult = null;
        this.chatHistory = [];
        this.isProcessing = false;
        this.isUploading = false;
        this.elements = {};
        this.currentStructure = null;
    }
    
    /**
     * نمایش پیام اطلاع‌رسانی
     */
    showNotification(message, type = 'info') {
        // ایجاد المنت notification اگر وجود ندارد
        let notification = document.getElementById('data-management-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'data-management-notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                max-width: 400px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
                transform: translateX(100%);
                opacity: 0;
            `;
            document.body.appendChild(notification);
        }
        
        // تنظیم رنگ براساس نوع
        const colors = {
            success: '#10b981',
            error: '#ef4444', 
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        
        notification.style.backgroundColor = colors[type] || colors.info;
        notification.textContent = message;
        
        // نمایش
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 10);
        
        // مخفی کردن بعد از 4 ثانیه
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
        }, 4000);
    }
}

// Export module
export default {
    loadContent: async function() {
        const module = new DataManagementModule();
        return await module.loadContent();
    },
    
    init: async function() {
        // Initialize the module after content is loaded
        const module = new DataManagementModule();
        await module.init();
        
        // Store reference globally for field updates
        window.currentDataManagementInstance = module;
        
        return module;
    }
};

// Global functions for HTML event handlers
window.dataManagement = {
    updateField: function(index, property, value) {
        if (window.currentDataManagementInstance) {
            window.currentDataManagementInstance.updateField(index, property, value);
        }
    },
    
    switchCodeTab: function(tabName) {
        if (window.currentDataManagementInstance) {
            window.currentDataManagementInstance.switchCodeTab(tabName);
        }
    },
    
    generateDatabaseStructure: function() {
        if (window.currentDataManagementInstance) {
            window.currentDataManagementInstance.generateDatabaseStructure();
        }
    }
};