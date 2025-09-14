/**
 * ماژول مدیریت داده‌ها - Data Management Module
 * Excel to MySQL Conversion System
 * 
 * @description: سیستم تبدیل فایل‌های Excel به MySQL با استفاده از AI
 * @version: 1.0.0
 * @author: DataSave Team
 */

'use strict';

/**
 * کلاس اصلی مدیریت داده‌ها
 */
class DataManagementModule {
    constructor() {
        this.projects = [];
        this.currentProject = null;
        this.isProcessing = false;
        this.stats = {
            totalProjects: 0,
            completedProjects: 0,
            failedProjects: 0,
            totalRecords: 0
        };
        
        // Logger reference
        this.logger = window.Logger || console;
        
        console.log('📊 Data Management Module initialized');
    }

    /**
     * Helper function برای جایگزینی jQuery
     * @param {string} selector 
     * @returns {Element|null}
     */
    $(selector) {
        return document.querySelector(selector);
    }

    /**
     * Helper function برای جایگزینی jQuery.val()
     */
    getValue(selector) {
        const element = this.$(selector);
        return element ? element.value : '';
    }

    /**
     * Helper function برای جایگزینی jQuery.val(value)
     */
    setValue(selector, value) {
        const element = this.$(selector);
        if (element) element.value = value;
    }

    /**
     * Helper function برای جایگزینی jQuery.text()
     */
    setText(selector, text) {
        const element = this.$(selector);
        if (element) element.textContent = text;
    }

    /**
     * Helper function برای نمایش/مخفی کردن Bootstrap Modal
     */
    showModal(selector) {
        const element = this.$(selector);
        if (element && typeof bootstrap !== 'undefined') {
            const modal = new bootstrap.Modal(element);
            modal.show();
        }
    }

    hideModal(selector) {
        const element = this.$(selector);
        if (element && typeof bootstrap !== 'undefined') {
            const modal = bootstrap.Modal.getInstance(element);
            if (modal) modal.hide();
        }
    }
    
    /**
     * رندر صفحه اصلی مدیریت داده‌ها
     */
    render() {
        return `
            <div class="data-management-page">
                <!-- Header -->
                <header class="dm-header">
                    <div class="dm-header-content">
                        <div class="dm-header-title">
                            <div class="icon">
                                <i class="fas fa-database"></i>
                            </div>
                            <div>
                                <h1>مدیریت داده‌ها</h1>
                                <p class="dm-header-subtitle">تبدیل فایل‌های Excel به MySQL با هوش مصنوعی</p>
                            </div>
                        </div>
                        <div class="dm-header-actions">
                            <button class="dm-btn secondary" id="refreshBtn">
                                <i class="fas fa-sync-alt"></i>
                                تازه‌سازی
                            </button>
                            <button class="dm-btn primary lg" id="newProjectBtn">
                                <i class="fas fa-plus"></i>
                                پروژه جدید
                            </button>
                        </div>
                    </div>
                </header>

                <!-- Main Content -->
                <main class="dm-main">
                    <!-- Tab Navigation - Updated Design with Inline Attributes -->
                    <div class="dm-tab-navigation" style="display:flex !important; flex-direction:row !important; background:#2b3150 !important; border-radius:15px !important; padding:8px !important;">
                        <div class="dm-tab active" data-tab="dashboard" style="color:white !important; padding:10px 15px !important; margin:0 5px !important; cursor:pointer !important; border-radius:10px !important; background:#6772e5 !important; box-shadow:0 5px 15px rgba(103, 114, 229, 0.3) !important;">
                            <i class="fas fa-chart-pie"></i>
                            <span>داشبورد</span>
                        </div>
                        <div class="dm-tab" data-tab="excel-to-sql" style="color:white !important; padding:10px 15px !important; margin:0 5px !important; cursor:pointer !important; border-radius:10px !important;">
                            <i class="fas fa-exchange-alt"></i>
                            <span>تبدیل اکسل به SQL</span>
                        </div>
                        <div class="dm-tab" data-tab="history" style="color:white !important; padding:10px 15px !important; margin:0 5px !important; cursor:pointer !important; border-radius:10px !important;">
                            <i class="fas fa-history"></i>
                            <span>تاریخچه تبدیل‌ها</span>
                        </div>
                        <div class="dm-tab" data-tab="settings" style="color:white !important; padding:10px 15px !important; margin:0 5px !important; cursor:pointer !important; border-radius:10px !important;">
                            <i class="fas fa-cog"></i>
                            <span>تنظیمات</span>
                        </div>
                    </div>
                    
                    <!-- Tab Contents -->
                    <div class="dm-tab-contents">
                        <!-- Dashboard Tab -->
                        <div class="dm-tab-content active" id="dashboard-tab">
                            <!-- Stats -->
                            <section class="dm-stats">
                        <div class="dm-stat-card">
                            <div class="dm-stat-content">
                                <div class="dm-stat-info">
                                    <h3 id="totalProjectsCount">0</h3>
                                    <p>کل پروژه‌ها</p>
                                </div>
                                <div class="dm-stat-icon primary">
                                    <i class="fas fa-project-diagram"></i>
                                </div>
                            </div>
                        </div>
                        
                        <div class="dm-stat-card">
                            <div class="dm-stat-content">
                                <div class="dm-stat-info">
                                    <h3 id="completedProjectsCount">0</h3>
                                    <p>تکمیل شده</p>
                                </div>
                                <div class="dm-stat-icon success">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                            </div>
                        </div>
                        
                        <div class="dm-stat-card">
                            <div class="dm-stat-content">
                                <div class="dm-stat-info">
                                    <h3 id="processingProjectsCount">0</h3>
                                    <p>در حال پردازش</p>
                                </div>
                                <div class="dm-stat-icon warning">
                                    <i class="fas fa-clock"></i>
                                </div>
                            </div>
                        </div>
                        
                        <div class="dm-stat-card">
                            <div class="dm-stat-content">
                                <div class="dm-stat-info">
                                    <h3 id="totalRecordsCount">0</h3>
                                    <p>کل رکوردها</p>
                                </div>
                                <div class="dm-stat-icon secondary">
                                    <i class="fas fa-table"></i>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Projects Section -->
                    <section class="dm-projects-section">
                        <div class="dm-projects-header">
                            <h2 class="dm-projects-title">پروژه‌های داده</h2>
                            <div class="dm-projects-filters">
                                <select class="dm-select" id="statusFilter">
                                    <option value="all">همه وضعیت‌ها</option>
                                    <option value="completed">تکمیل شده</option>
                                    <option value="processing">در حال پردازش</option>
                                    <option value="pending">در انتظار</option>
                                    <option value="failed">ناموفق</option>
                                </select>
                                <select class="dm-select" id="sortBy">
                                    <option value="created_desc">جدیدترین</option>
                                    <option value="created_asc">قدیمی‌ترین</option>
                                    <option value="name_asc">نام A-Z</option>
                                    <option value="name_desc">نام Z-A</option>
                                </select>
                            </div>
                        </div>
                        
                        <div id="projectsContainer">
                            <div class="dm-empty-state">
                                <div class="icon">
                                    <i class="fas fa-database"></i>
                                </div>
                                <h3>هیچ پروژه‌ای یافت نشد</h3>
                                <p>برای شروع، اولین پروژه خود را ایجاد کنید</p>
                                <button class="dm-btn primary" id="createFirstProjectBtn">
                                    <i class="fas fa-plus"></i>
                                    ایجاد پروژه
                                </button>
                            </div>
                        </div>
                    </section>
                        </div>
                        
                        <!-- Excel to SQL Tab -->
                        <div class="dm-tab-content" id="excel-to-sql-tab">
                            <div id="excel-to-sql-timeline-container">
                                <!-- این محتوا توسط ماژول excel-to-sql-timeline.js بارگذاری می‌شود -->
                                <div class="dm-loading">
                                    <div class="dm-spinner"></div>
                                    <p>در حال بارگذاری تایم‌لاین تبدیل اکسل به SQL...</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- History Tab -->
                        <div class="dm-tab-content" id="history-tab">
                            <div class="dm-card">
                                <div class="dm-card-header">
                                    <h3 class="dm-card-title">
                                        <i class="fas fa-history"></i>
                                        تاریخچه تبدیل‌ها
                                    </h3>
                                </div>
                                <div class="dm-card-body">
                                    <p>تاریخچه تبدیل‌های انجام شده در اینجا نمایش داده می‌شود.</p>
                                    <div id="historyContainer">
                                        <div class="dm-empty-state">
                                            <div class="icon">
                                                <i class="fas fa-history"></i>
                                            </div>
                                            <h3>هیچ تاریخچه‌ای یافت نشد</h3>
                                            <p>هنوز هیچ تبدیلی انجام نشده است.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Settings Tab -->
                        <div class="dm-tab-content" id="settings-tab">
                            <div class="dm-card">
                                <div class="dm-card-header">
                                    <h3 class="dm-card-title">
                                        <i class="fas fa-cog"></i>
                                        تنظیمات مدیریت داده‌ها
                                    </h3>
                                </div>
                                <div class="dm-card-body">
                                    <p>تنظیمات مدیریت داده‌ها در اینجا قرار می‌گیرد.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <!-- Upload Modal -->
            <div class="modal fade" id="uploadModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content dm-modal-content">
                        <div class="modal-header dm-modal-header">
                            <h5 class="modal-title dm-modal-title">
                                <i class="fas fa-upload"></i>
                                پروژه جدید
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body dm-modal-body">
                            <form id="uploadForm">
                                <div class="dm-form-group">
                                    <label class="dm-form-label">نام پروژه</label>
                                    <input type="text" class="dm-form-input" id="projectName" 
                                           placeholder="نام دلخواه برای پروژه" required>
                                    <div class="dm-form-help">این نام برای شناسایی پروژه استفاده می‌شود</div>
                                </div>
                                
                                <div class="dm-form-group">
                                    <label class="dm-form-label">توضیحات (اختیاری)</label>
                                    <textarea class="dm-form-textarea" id="projectDescription" rows="3"
                                              placeholder="توضیحات کوتاه درباره این پروژه"></textarea>
                                </div>
                                
                                <div class="dm-form-group">
                                    <label class="dm-form-label">فایل Excel</label>
                                    <div class="dm-upload-area" id="uploadArea">
                                        <div class="icon">
                                            <i class="fas fa-file-excel"></i>
                                        </div>
                                        <h4>فایل را اینجا بکشید یا کلیک کنید</h4>
                                        <p>فرمت‌های مجاز: .xlsx, .xls | حداکثر ۵۰ مگابایت</p>
                                        <input type="file" class="d-none" id="fileInput" 
                                               accept=".xlsx,.xls" required>
                                        <button type="button" class="dm-btn secondary" 
                                                onclick="document.getElementById('fileInput').click()">
                                            <i class="fas fa-folder-open"></i>
                                            انتخاب فایل
                                        </button>
                                    </div>
                                    
                                    <div class="dm-file-info d-none" id="fileInfo">
                                        <div class="dm-file-info-header">
                                            <i class="fas fa-check-circle"></i>
                                            فایل انتخاب شد
                                        </div>
                                        <div class="dm-file-details">
                                            <div class="dm-file-detail">
                                                <i class="fas fa-file"></i>
                                                نام: <span id="fileName"></span>
                                            </div>
                                            <div class="dm-file-detail">
                                                <i class="fas fa-weight-hanging"></i>
                                                حجم: <span id="fileSize"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="dm-alert info">
                                    <i class="fas fa-robot me-2"></i>
                                    پس از آپلود، هوش مصنوعی ساختار فایل را تحلیل کرده و با شما درباره طراحی پایگاه داده گفتگو خواهد کرد.
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer border-0 px-2rem pb-2rem">
                            <button type="button" class="dm-btn secondary" data-bs-dismiss="modal">انصراف</button>
                            <button type="button" class="dm-btn primary" id="startProcessingBtn" disabled>
                                <i class="fas fa-rocket"></i>
                                شروع پردازش
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Processing Modal -->
            <div class="modal fade dm-processing-modal" id="processingModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content dm-modal-content">
                        <div class="modal-header dm-processing-header">
                            <h5 class="modal-title">
                                <i class="fas fa-magic"></i>
                                <span id="currentProjectName">پروژه جدید</span>
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body dm-processing-body">
                            <div class="dm-timeline-panel">
                                <h3 class="dm-timeline-title">
                                    <i class="fas fa-tasks"></i>
                                    مراحل پردازش
                                </h3>
                                <div class="dm-timeline" id="timelineSteps">
                                    <!-- Timeline steps will be loaded here -->
                                </div>
                            </div>
                            
                            <div class="dm-chat-panel">
                                <div class="dm-chat-messages" id="chatMessages">
                                    <div class="dm-chat-welcome">
                                        <div class="icon">
                                            <i class="fas fa-robot"></i>
                                        </div>
                                        <h3>دستیار هوش مصنوعی DataSave</h3>
                                        <p>آماده کمک به شما برای تبدیل Excel به پایگاه داده</p>
                                    </div>
                                </div>
                                
                                <div class="dm-chat-input-area">
                                    <div class="input-group">
                                        <input type="text" class="dm-form-input" id="chatInput" 
                                               placeholder="پیام خود را تایپ کنید..." disabled>
                                        <button class="dm-btn primary" id="sendMessageBtn" disabled>
                                            <i class="fas fa-paper-plane"></i>
                                        </button>
                                    </div>
                                    <div class="text-center mt-2">
                                        <small class="text-muted">
                                            <i class="fas fa-info-circle"></i>
                                            با هوش مصنوعی چت کنید تا بهترین ساختار پایگاه داده را طراحی کنید
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * مقداردهی اولیه صفحه - با تزریق مستقیم استایل‌ها برای حل مشکلات مسیر
     */
    init() {
        console.log('Data Management Module initializing...');
        
        // 1. تزریق مستقیم استایل‌های ضروری با اولویت بالا
        const criticalStyles = document.createElement('style');
        criticalStyles.textContent = `
            /* استایل‌های حیاتی تب‌ها */
            .dm-tab-navigation {
                display: flex !important;
                flex-direction: row !important;
                width: 100% !important;
                direction: rtl !important;
                background: #2b3150 !important;
                border-radius: 1px !important;
                padding: 8px !important;
                margin-bottom: 15px !important;
                overflow-x: auto !important;
            }
            .dm-tab {
                color: white !important;
                padding: 10px 15px !important;
                margin: 0 5px !important;
                cursor: pointer !important;
                border-radius: 10px !important;
                transition: all 0.3s !important;
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                white-space: nowrap !important;
            }
            .dm-tab i {
                font-size: 16px !important;
            }
            .dm-tab.active {
                background: #6772e5 !important;
                box-shadow: 0 5px 15px rgba(103, 114, 229, 0.3) !important;
            }
            .dm-tab-content {
                display: none !important;
            }
            .dm-tab-content.active {
                display: block !important;
            }
        `;
        document.head.appendChild(criticalStyles);
        
        // 2. سپس بقیه استایل‌ها را بارگذاری می‌کنیم
        this.loadRequiredStyles();
        
        // 3. رویدادها را متصل می‌کنیم
        this.attachEventListeners();
        
        // 4. و در نهایت داده‌ها را بارگذاری می‌کنیم
        this.loadStats();
        this.loadProjects();
        
        this.logger?.info?.('Data Management page initialized');
    }
    
    /**
     * بارگذاری استایل‌های مورد نیاز
     */
    loadRequiredStyles() {
        console.log('بارگذاری استایل‌ها...'); // برای دیباگ
        
        // حذف استایل‌های قبلی در صورت وجود
        const prevStyle = document.getElementById('data-management-tabs-css');
        if (prevStyle) {
            prevStyle.remove();
        }
        
        // بارگذاری فایل CSS اختصاصی با اولویت بالا - اصلاح مسیر با در نظر گرفتن datasave
        const tabStyles = document.createElement('link');
        tabStyles.id = 'data-management-tabs-css';
        tabStyles.rel = 'stylesheet';
        tabStyles.href = '/datasave/assets/css/admin/modules/data-management-tabs-fix.css';
        document.head.appendChild(tabStyles);
        
        // اضافه کردن استایل درون‌خطی برای اطمینان بیشتر
        const inlineStyle = document.createElement('style');
        inlineStyle.textContent = `
            .dm-tab-navigation {
                display: flex !important;
                flex-direction: row !important;
                width: 100% !important;
                direction: rtl !important;
                background: #2b3150 !important;
                border-radius: 15px !important;
                padding: 8px !important;
            }
            .dm-tab {
                color: white !important;
                padding: 10px 15px !important;
                margin: 0 5px !important;
                cursor: pointer !important;
                border-radius: 10px !important;
                transition: all 0.3s !important;
            }
            .dm-tab.active {
                background: #6772e5 !important;
                box-shadow: 0 5px 15px rgba(103, 114, 229, 0.3) !important;
            }
        `;
        document.head.appendChild(inlineStyle);
        
        // بارگذاری استایل تایم‌لاین اکسل به SQL - اصلاح مسیر
        const timelineStyle = document.createElement('link');
        timelineStyle.rel = 'stylesheet';
        timelineStyle.href = '/datasave/assets/css/admin/modules/excel-to-sql-timeline.css';
        document.head.appendChild(timelineStyle);
    }
    
    /**
     * اتصال رویدادها
     */
    attachEventListeners() {
        // سیستم تب با رویکرد اضافه کردن رویداد به والد (event delegation) - با پشتیبانی از استایل‌های درون‌خطی
        document.querySelector('.dm-tab-navigation').addEventListener('click', (event) => {
            // پیدا کردن تبی که کلیک شده است
            const clickedTab = event.target.closest('.dm-tab');
            if (!clickedTab) return; // اگر کلیک روی تب نبود، برگرد
            
            const tabName = clickedTab.getAttribute('data-tab');
            if (!tabName) return;
            
            console.log(`تب کلیک شده: ${tabName}`); // برای دیباگ
            
            // فعال کردن تب انتخاب شده - اصلاح استایل‌ها
            document.querySelectorAll('.dm-tab').forEach(tab => {
                tab.classList.remove('active');
                tab.style.background = 'transparent';
                tab.style.boxShadow = 'none';
            });
            
            clickedTab.classList.add('active');
            clickedTab.style.background = '#6772e5';
            clickedTab.style.boxShadow = '0 5px 15px rgba(103, 114, 229, 0.3)';
            
            // نمایش محتوای تب
            document.querySelectorAll('.dm-tab-content').forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none';
            });
            
            // پیدا کردن و فعال کردن محتوای تب
            const tabContent = document.getElementById(`${tabName}-tab`);
            if (tabContent) {
                tabContent.classList.add('active');
                tabContent.style.display = 'block';
                
                // بارگذاری محتوای تایم‌لاین در صورت انتخاب تب مربوطه
                if (tabName === 'excel-to-sql') {
                    this.loadExcelToSQLTimeline();
                }
            } else {
                console.error(`محتوای تب با شناسه ${tabName}-tab یافت نشد`);
            }
        });
        
        // دکمه پروژه جدید
        document.querySelectorAll('#newProjectBtn, #createFirstProjectBtn').forEach(btn => {
            btn.addEventListener('click', () => this.showUploadModal());
        });
        
        // دکمه تازه‌سازی
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshData());
        }
        
        // شروع پردازش
        const startProcessingBtn = document.getElementById('startProcessingBtn');
        if (startProcessingBtn) {
            startProcessingBtn.addEventListener('click', () => this.startProcessing());
        }
        
        // آپلود فایل
        document.addEventListener('change', (e) => {
            if (e.target.matches('#fileInput')) {
                this.handleFileSelect(e.target.files[0]);
            }
            
            // فیلترها
            if (e.target.matches('#statusFilter, #sortBy')) {
                this.filterProjects();
            }
        });
        
        // Drag & Drop
        document.addEventListener('dragover', (e) => {
            if (e.target.matches('#uploadArea')) {
                e.preventDefault();
                e.target.classList.add('border-primary', 'bg-light');
            }
        });
        
        document.addEventListener('dragleave', (e) => {
            if (e.target.matches('#uploadArea')) {
                e.preventDefault();
                e.target.classList.remove('border-primary', 'bg-light');
            }
        });
        
        document.addEventListener('drop', (e) => {
            if (e.target.matches('#uploadArea')) {
                e.preventDefault();
                e.target.classList.remove('border-primary', 'bg-light');
                const file = e.dataTransfer.files[0];
                if (file) {
                    const fileInput = document.getElementById('fileInput');
                    if (fileInput) {
                        fileInput.files = e.dataTransfer.files;
                        this.handleFileSelect(file);
                    }
                }
            }
        });
        
        console.log('✅ Event listeners attached for Data Management');
    }
    
    /**
     * نمایش Modal آپلود
     */
    showUploadModal() {
        this.showModal('#uploadModal');
        
        // Reset form
        const uploadForm = this.$('#uploadForm');
        if (uploadForm) uploadForm.reset();
        
        const fileInfo = this.$('#fileInfo');
        if (fileInfo) fileInfo.classList.add('d-none');
        
        const startBtn = this.$('#startProcessingBtn');
        if (startBtn) startBtn.disabled = true;
    }
    
    /**
     * مدیریت انتخاب فایل
     */
    handleFileSelect(file) {
        if (!file) return;
        
        // بررسی نوع فایل
        const allowedTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ];
        
        if (!allowedTypes.includes(file.type)) {
            this.showAlert('خطا', 'فقط فایل‌های Excel (.xlsx, .xls) مجاز هستند.', 'error');
            return;
        }
        
        // بررسی حجم فایل (50MB)
        if (file.size > 50 * 1024 * 1024) {
            this.showAlert('خطا', 'حجم فایل نباید بیش از ۵۰ مگابایت باشد.', 'error');
            return;
        }
        
        // نمایش اطلاعات فایل
        this.setText('#fileName', file.name);
        this.setText('#fileSize', this.formatFileSize(file.size));
        
        const fileInfo = this.$('#fileInfo');
        if (fileInfo) fileInfo.classList.remove('d-none');
        
        // فعال کردن دکمه پردازش
        const projectName = this.getValue('#projectName');
        const startBtn = this.$('#startProcessingBtn');
        
        if (projectName.trim()) {
            if (startBtn) startBtn.disabled = false;
        }
        
        // Auto-fill project name if empty
        if (!projectName.trim()) {
            const baseName = file.name.replace(/\.[^/.]+$/, '');
            this.setValue('#projectName', baseName);
            if (startBtn) startBtn.disabled = false;
        }
    }
    
    /**
     * شروع پردازش پروژه
     */
    async startProcessing() {
        try {
            const formData = new FormData();
            formData.append('project_name', this.getValue('#projectName'));
            formData.append('project_description', this.getValue('#projectDescription'));
            
            const fileInput = this.$('#fileInput');
            if (fileInput && fileInput.files[0]) {
                formData.append('excel_file', fileInput.files[0]);
            }
            
            // بستن modal آپلود و باز کردن modal پردازش
            this.hideModal('#uploadModal');
            this.showModal('#processingModal');
            
            // شروع پردازش
            this.isProcessing = true;
            this.initializeTimeline();
            this.startAiConversation(formData);
            
        } catch (error) {
            console.error('Error starting processing:', error);
            this.showAlert('خطا', 'خطا در شروع پردازش. لطفاً مجدداً تلاش کنید.', 'error');
        }
    }
    
    /**
     * مقداردهی Timeline
     */
    initializeTimeline() {
        const steps = [
            { id: 1, title: 'آپلود و بررسی', icon: 'fas fa-upload', status: 'active' },
            { id: 2, title: 'تحلیل ساختار', icon: 'fas fa-search', status: 'pending' },
            { id: 3, title: 'طراحی جدول', icon: 'fas fa-table', status: 'pending' },
            { id: 4, title: 'ایجاد پایگاه داده', icon: 'fas fa-database', status: 'pending' },
            { id: 5, title: 'انتقال داده‌ها', icon: 'fas fa-download', status: 'pending' },
            { id: 6, title: 'تکمیل پروژه', icon: 'fas fa-check-circle', status: 'pending' }
        ];
        
        const timelineHTML = steps.map(step => `
            <div class="dm-timeline-step ${step.status}" data-step="${step.id}">
                <div class="dm-timeline-step-icon">
                    <i class="${step.icon}"></i>
                </div>
                <div class="dm-timeline-step-info">
                    <h4>${step.title}</h4>
                    <p>${this.getStatusText(step.status)}</p>
                </div>
            </div>
        `).join('');
        
        const timelineSteps = this.$('#timelineSteps');
        if (timelineSteps) {
            timelineSteps.innerHTML = timelineHTML;
        }
    }

    /**
     * دریافت متن وضعیت
     */
    getStatusText(status) {
        const statusMap = {
            'pending': 'در انتظار',
            'active': 'در حال انجام',
            'completed': 'تکمیل شده',
            'processing': 'در حال پردازش'
        };
        return statusMap[status] || 'نامشخص';
    }
    
    /**
     * شروع مکالمه AI
     */
    async startAiConversation(formData) {
        // شبیه‌سازی شروع مکالمه (در نسخه واقعی با API ارتباط برقرار می‌شود)
        this.addChatMessage('ai', 'سلام! من دستیار هوش مصنوعی DataSave هستم. فایل شما در حال بررسی است...');
        
        setTimeout(() => {
            this.addChatMessage('ai', '✅ فایل با موفقیت آپلود شد. در حال تحلیل ساختار...');
            this.updateTimelineStep(1, 'completed');
            this.updateTimelineStep(2, 'processing');
        }, 2000);
        
        setTimeout(() => {
            this.addChatMessage('ai', '📊 تحلیل کامل شد:\n- ۱۵۰۰ ردیف داده\n- ۸ ستون\n- فرمت صحیح Excel\n\nآیا مایل به ادامه هستید؟');
            this.showChatOptions(['بله، ادامه دهید', 'نمایش جزئیات بیشتر']);
            this.updateTimelineStep(2, 'completed');
            this.updateTimelineStep(3, 'processing');
        }, 4000);
    }
    
    /**
     * اضافه کردن پیام به چت
     */
    addChatMessage(type, message) {
        const messageHTML = `
            <div class="chat-message ${type}-message mb-3">
                <div class="d-flex ${type === 'user' ? 'justify-content-end' : ''}">
                    <div class="message-bubble ${type === 'user' ? 'bg-primary text-white' : 'bg-light'} rounded-3 p-3" 
                         style="max-width: 80%;">
                        ${type === 'ai' ? '<i class="fas fa-robot me-2"></i>' : ''}
                        <span class="message-text">${message.replace(/\n/g, '<br>')}</span>
                        <small class="d-block mt-1 ${type === 'user' ? 'text-white-50' : 'text-muted'}">
                            ${new Date().toLocaleTimeString('fa-IR')}
                        </small>
                    </div>
                </div>
            </div>
        `;
        
        const chatMessages = this.$('#chatMessages');
        if (chatMessages) {
            chatMessages.insertAdjacentHTML('beforeend', messageHTML);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    
    /**
     * نمایش گزینه‌های چت
     */
    showChatOptions(options) {
        const optionsHTML = options.map(option => `
            <button class="btn btn-outline-primary btn-sm me-2 mb-2 chat-option-btn">
                ${option}
            </button>
        `).join('');
        
        const optionsContainer = `
            <div class="chat-options mb-3">
                <div class="text-center">
                    ${optionsHTML}
                </div>
            </div>
        `;
        
        const chatMessages = this.$('#chatMessages');
        if (chatMessages) {
            chatMessages.insertAdjacentHTML('beforeend', optionsContainer);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // Event listener برای گزینه‌ها
        setTimeout(() => {
            const chatOptionBtns = document.querySelectorAll('.chat-option-btn');
            chatOptionBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const selectedOption = e.target.textContent;
                    this.handleChatOption(selectedOption);
                    const chatOptions = document.querySelector('.chat-options');
                    if (chatOptions) chatOptions.remove();
                });
            });
        }, 100);
    }
    
    /**
     * مدیریت انتخاب گزینه‌های چت
     */
    handleChatOption(option) {
        this.addChatMessage('user', option);
        
        // شبیه‌سازی پاسخ AI
        setTimeout(() => {
            switch(option) {
                case 'بله، ادامه دهید':
                    this.addChatMessage('ai', '🎯 عالی! در حال طراحی ساختار جدول...');
                    // ادامه فرایند
                    break;
                case 'نمایش جزئیات بیشتر':
                    this.addChatMessage('ai', '📋 جزئیات کامل فایل:\n- نام ستون‌ها: نام، نام خانوادگی، تلفن، ایمیل، آدرس، شهر، کد پستی، تاریخ ثبت\n- نوع داده‌ها: متن، متن، عدد، ایمیل، متن طولانی، متن، عدد، تاریخ\n- صحت داده‌ها: ۹۸٪');
                    break;
            }
        }, 1000);
    }
    
    /**
     * بروزرسانی مرحله Timeline
     */
    updateTimelineStep(stepId, status) {
        const step = $(`.timeline-step[data-step="${stepId}"]`);
        step.removeClass('pending processing completed failed').addClass(status);
        step.find('.step-status').text(this.getStatusText(status));
    }
    
    /**
     * متن وضعیت
     */
    getStatusText(status) {
        const statusTexts = {
            'pending': 'در انتظار',
            'processing': 'در حال پردازش...',
            'completed': 'تکمیل شده ✓',
            'failed': 'ناموفق ✗'
        };
        return statusTexts[status] || status;
    }
    
    /**
     * بارگذاری آمار
     */
    async loadStats() {
        try {
            // شبیه‌سازی بارگذاری آمار (در نسخه واقعی از API دریافت می‌شود)
            const stats = {
                totalProjects: 12,
                completedProjects: 8,
                processingProjects: 2,
                totalRecords: 45678
            };
            
            // استفاده از vanilla JavaScript بجای jQuery
            const totalProjectsElement = document.getElementById('totalProjectsCount');
            const completedProjectsElement = document.getElementById('completedProjectsCount');
            const processingProjectsElement = document.getElementById('processingProjectsCount');
            const totalRecordsElement = document.getElementById('totalRecordsCount');
            
            if (totalProjectsElement) totalProjectsElement.textContent = stats.totalProjects.toLocaleString('fa-IR');
            if (completedProjectsElement) completedProjectsElement.textContent = stats.completedProjects.toLocaleString('fa-IR');
            if (processingProjectsElement) processingProjectsElement.textContent = stats.processingProjects.toLocaleString('fa-IR');
            if (totalRecordsElement) totalRecordsElement.textContent = stats.totalRecords.toLocaleString('fa-IR');
            
            this.stats = stats;
            
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }
    
    /**
     * بارگذاری پروژه‌ها
     */
    async loadProjects() {
        try {
            // شبیه‌سازی بارگذاری پروژه‌ها (در نسخه واقعی از API دریافت می‌شود)
            // فعلاً خالی نگه می‌داریم تا پیغام "پروژه‌ای یافت نشد" نمایش داده شود
            this.projects = [];
            this.renderProjects();
            
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }
    
    /**
     * رندر پروژه‌ها
     */
    renderProjects() {
        const container = document.getElementById('projectsContainer');
        
        if (!container) {
            console.warn('Projects container element not found');
            return;
        }
        
        if (this.projects.length === 0) {
            // پیغام خالی بودن فهرست (HTML موجود)
            return;
        }
        
        const projectsHTML = this.projects.map(project => this.renderProjectCard(project)).join('');
        container.innerHTML = `<div class="row">${projectsHTML}</div>`;
    }
    
    /**
     * رندر کارت پروژه
     */
    renderProjectCard(project) {
        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card project-card border-0 shadow-sm h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <h6 class="card-title mb-0">${project.name}</h6>
                            <span class="badge bg-${this.getStatusColor(project.status)} rounded-pill">
                                ${this.getStatusText(project.status)}
                            </span>
                        </div>
                        <p class="card-text text-muted small mb-3">${project.description || 'بدون توضیحات'}</p>
                        <div class="project-stats mb-3">
                            <small class="text-muted d-block">
                                <i class="fas fa-table me-1"></i>
                                ${project.total_rows.toLocaleString('fa-IR')} رکورد
                            </small>
                            <small class="text-muted d-block">
                                <i class="fas fa-calendar me-1"></i>
                                ${new Date(project.created_at).toLocaleDateString('fa-IR')}
                            </small>
                        </div>
                        <div class="card-actions d-flex gap-2">
                            <button class="btn btn-sm btn-outline-primary flex-fill" 
                                    onclick="dataManagement.viewProject(${project.id})">
                                <i class="fas fa-eye me-1"></i>
                                مشاهده
                            </button>
                            <button class="btn btn-sm btn-outline-secondary" 
                                    onclick="dataManagement.downloadProject(${project.id})">
                                <i class="fas fa-download"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * رنگ وضعیت
     */
    getStatusColor(status) {
        const colors = {
            'completed': 'success',
            'processing': 'warning',
            'pending': 'secondary',
            'failed': 'danger'
        };
        return colors[status] || 'secondary';
    }
    
    /**
     * فرمت اندازه فایل
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 بایت';
        
        const k = 1024;
        const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    /**
     * نمایش هشدار
     */
    showAlert(title, message, type = 'info') {
        // استفاده از Bootstrap Toast یا SweetAlert
        console.log(`${type.toUpperCase()}: ${title} - ${message}`);
        alert(`${title}\n\n${message}`);
    }
    
    /**
     * تازه‌سازی داده‌ها
     */
    async refreshData() {
        $('#refreshBtn').find('i').addClass('fa-spin');
        await this.loadStats();
        await this.loadProjects();
        setTimeout(() => {
            $('#refreshBtn').find('i').removeClass('fa-spin');
        }, 1000);
    }
    
    /**
     * فیلتر پروژه‌ها
     */
    filterProjects() {
        // پیاده‌سازی فیلتر در نسخه‌های بعدی
        console.log('Filtering projects...');
    }
    
    /**
     * مشاهده پروژه
     */
    viewProject(projectId) {
        console.log('Viewing project:', projectId);
    }
    
    /**
     * دانلود پروژه
     */
    downloadProject(projectId) {
        console.log('Downloading project:', projectId);
    }
    
    /**
     * بارگذاری تایم‌لاین تبدیل اکسل به SQL
     */
    loadExcelToSQLTimeline() {
        const container = document.getElementById('excel-to-sql-timeline-container');
        if (!container) return;
        
        // بررسی اینکه آیا قبلاً بارگذاری شده است
        if (container.dataset.loaded === 'true') return;
        
        // نمایش وضعیت بارگذاری
        container.innerHTML = `
            <div class="dm-loading">
                <div class="dm-spinner"></div>
                <p>در حال بارگذاری تایم‌لاین تبدیل اکسل به SQL...</p>
            </div>
        `;
        
        // بارگذاری فایل HTML تایم‌لاین
        fetch('/datasave/assets/templates/excel-to-sql-timeline.html')
            .then(response => response.text())
            .then(html => {
                // تنظیم محتوا
                container.innerHTML = html;
                container.dataset.loaded = 'true';
                
                // بارگذاری اسکریپت تایم‌لاین
                this.loadExcelToSQLTimelineScript();
            })
            .catch(error => {
                console.error('Error loading Excel to SQL Timeline:', error);
                container.innerHTML = `
                    <div class="dm-error">
                        <div class="icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <h3>خطا در بارگذاری</h3>
                        <p>متأسفانه امکان بارگذاری تایم‌لاین وجود ندارد.</p>
                        <button class="dm-btn primary" onclick="dataManagement.loadExcelToSQLTimeline()">
                            <i class="fas fa-sync"></i>
                            تلاش مجدد
                        </button>
                    </div>
                `;
            });
    }
    
    /**
     * بارگذاری اسکریپت تایم‌لاین تبدیل اکسل به SQL
     */
    loadExcelToSQLTimelineScript() {
        // بررسی اینکه آیا اسکریپت قبلاً بارگذاری شده است
        if (window.ExcelToSQLTimeline) return;
        
        const script = document.createElement('script');
        script.src = '/datasave/assets/js/admin/modules/excel-to-sql-timeline.js';
        script.onload = () => {
            console.log('Excel to SQL Timeline script loaded successfully');
            // راه‌اندازی ماژول در صورت وجود
            if (window.ExcelToSQLTimeline && typeof window.ExcelToSQLTimeline.init === 'function') {
                window.ExcelToSQLTimeline.init();
            }
        };
        script.onerror = () => {
            console.error('Error loading Excel to SQL Timeline script');
        };
        document.head.appendChild(script);
    }

    /**
     * بارگذاری محتوای صفحه - مورد نیاز Router
     * @returns {Promise<string>} HTML content
     */
    async loadContent() {
        try {
            // فقط HTML را برگردان، داده‌ها در init() بارگذاری می‌شوند
            return this.render();
        } catch (error) {
            this.logger.error('خطا در بارگذاری محتوای مدیریت داده‌ها:', error);
            return `
                <div class="alert alert-danger">
                    <h4>خطا در بارگذاری</h4>
                    <p>امکان بارگذاری محتوای مدیریت داده‌ها وجود ندارد.</p>
                </div>
            `;
        }
    }

    /**
     * مقداردهی اولیه صفحه پس از بارگذاری
     */
    async init() {
        try {
            // اتصال event listeners
            this.attachEventListeners();
            
            // بارگذاری داده‌های اولیه
            await this.loadStats();
            await this.loadProjects();
            
            this.logger.info('ماژول مدیریت داده‌ها با موفقیت مقداردهی شد');
        } catch (error) {
            this.logger.error('خطا در مقداردهی ماژول مدیریت داده‌ها:', error);
        }
    }
}

// Export برای استفاده در Router
const DataManagementPage = new DataManagementModule();

// اضافه کردن به window برای دسترسی global
window.dataManagement = DataManagementPage;

// Export object با متدهای مورد نیاز Router
export default {
    loadContent: () => DataManagementPage.loadContent(),
    init: () => DataManagementPage.init(),
    instance: DataManagementPage
};
