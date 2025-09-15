/**
 * Excel to SQL Timeline Module
 * ماژول تایم‌لاین تبدیل فایل Excel به پایگاه داده MySQL
 * 
 * این ماژول شامل ۱۲ مرحله کامل برای تبدیل فایل Excel به پایگاه داده است:
 * 1. انتخاب فایل Excel
 * 2. شناسایی فایل و اطلاعات
 * 3. شروع پردازش
 * 4. تحلیل اولیه محتوا
 * 5. پیشنهاد نام دیتابیس و چت با AI
 * 6. نمایش فیلدهای پیشنهادی
 * 7. تایید کوئری SQL
 * 8. اجرای دستور SQL
 * 9. تایید انتقال داده‌ها
 * 10. نمایش پروگرس بار انتقال
 * 11. نتیجه نهایی
 * 12. پایان و بازگشت
 */

class ExcelToSqlTimeline {
    constructor(container) {
        this.container = container;
        this.currentStep = 1;
        this.totalSteps = 12;
        this.projectData = {
            file: null,
            fileName: '',
            fileSize: 0,
            fileType: '',
            analysis: null,
            dbName: '',
            dbDescription: '',
            fields: [],
            sqlQuery: '',
            chatHistory: []
        };
        
        this.init();
    }

    /**
     * مقداردهی اولیه ماژول
     */
    init() {
        this.render();
        this.attachEventListeners();
        this.showStep(1);
    }

    /**
     * رندر کردن تایم‌لاین کامل
     */
    render() {
        const timelineHTML = `
            <div class="e2s-timeline-container">
                <!-- Timeline Progress Header -->
                <div class="e2s-timeline-header">
                    <div class="e2s-progress-bar">
                        <div class="e2s-progress-fill" style="width: ${(this.currentStep / this.totalSteps) * 100}%"></div>
                    </div>
                    <div class="e2s-step-counter">
                        مرحله <span id="e2s-current-step">${this.currentStep}</span> از ${this.totalSteps}
                    </div>
                </div>

                <!-- Timeline Steps -->
                <div class="e2s-timeline-steps">
                    ${this.generateStepsHTML()}
                </div>

                <!-- Timeline Navigation -->
                <div class="e2s-timeline-navigation">
                    <button class="e2s-btn secondary" id="e2s-prev-step" disabled>
                        <i class="fas fa-arrow-right"></i>
                        مرحله قبل
                    </button>
                    <button class="e2s-btn primary" id="e2s-next-step">
                        <i class="fas fa-arrow-left"></i>
                        مرحله بعد
                    </button>
                    <button class="e2s-btn danger" id="e2s-cancel-process" style="margin-right: auto;">
                        <i class="fas fa-times"></i>
                        لغو فرآیند
                    </button>
                </div>
            </div>
        `;

        this.container.innerHTML = timelineHTML;
    }

    /**
     * تولید HTML برای تمام مراحل
     */
    generateStepsHTML() {
        const steps = [
            {
                id: 'file-selection',
                icon: 'fas fa-file-excel',
                title: 'انتخاب فایل Excel',
                subtitle: 'فایل Excel خود را آپلود کنید',
                content: this.getFileSelectionHTML()
            },
            {
                id: 'file-analysis',
                icon: 'fas fa-search',
                title: 'شناسایی فایل',
                subtitle: 'بررسی اطلاعات و ساختار فایل',
                content: this.getFileAnalysisHTML()
            },
            {
                id: 'start-processing',
                icon: 'fas fa-play',
                title: 'شروع پردازش',
                subtitle: 'آغاز تحلیل هوشمند فایل',
                content: this.getStartProcessingHTML()
            },
            {
                id: 'initial-analysis',
                icon: 'fas fa-chart-bar',
                title: 'تحلیل اولیه',
                subtitle: 'نمایش خلاصه محتوای فایل',
                content: this.getInitialAnalysisHTML()
            },
            {
                id: 'ai-suggestions',
                icon: 'fas fa-robot',
                title: 'پیشنهادات هوش مصنوعی',
                subtitle: 'نام دیتابیس و توضیحات پیشنهادی',
                content: this.getAiSuggestionsHTML()
            },
            {
                id: 'field-mapping',
                icon: 'fas fa-table',
                title: 'نقشه‌برداری فیلدها',
                subtitle: 'تطبیق ستون‌های Excel با فیلدهای دیتابیس',
                content: this.getFieldMappingHTML()
            },
            {
                id: 'sql-confirmation',
                icon: 'fas fa-code',
                title: 'تایید کوئری SQL',
                subtitle: 'بررسی و تایید کوئری ایجاد دیتابیس',
                content: this.getSqlConfirmationHTML()
            },
            {
                id: 'sql-execution',
                icon: 'fas fa-database',
                title: 'اجرای کوئری',
                subtitle: 'ایجاد دیتابیس و جداول',
                content: this.getSqlExecutionHTML()
            },
            {
                id: 'data-confirmation',
                icon: 'fas fa-check-circle',
                title: 'تایید انتقال داده‌ها',
                subtitle: 'تایید وارد کردن داده‌ها به دیتابیس',
                content: this.getDataConfirmationHTML()
            },
            {
                id: 'data-transfer',
                icon: 'fas fa-sync',
                title: 'انتقال داده‌ها',
                subtitle: 'وارد کردن داده‌ها با نمایش پیشرفت',
                content: this.getDataTransferHTML()
            },
            {
                id: 'final-result',
                icon: 'fas fa-check',
                title: 'نتیجه نهایی',
                subtitle: 'گزارش کامل عملیات انجام شده',
                content: this.getFinalResultHTML()
            },
            {
                id: 'completion',
                icon: 'fas fa-flag-checkered',
                title: 'تکمیل فرآیند',
                subtitle: 'پایان موفقیت‌آمیز و بازگشت به داشبورد',
                content: this.getCompletionHTML()
            }
        ];

        return steps.map((step, index) => `
            <div class="e2s-step ${index + 1 === this.currentStep ? 'active' : ''}" 
                 data-step="${index + 1}" id="step-${step.id}">
                <div class="e2s-step-header">
                    <div class="e2s-step-icon">
                        <i class="${step.icon}"></i>
                    </div>
                    <div class="e2s-step-info">
                        <h4 class="e2s-step-title">${step.title}</h4>
                        <p class="e2s-step-subtitle">${step.subtitle}</p>
                    </div>
                    <div class="e2s-step-status">
                        ${this.getStepStatus(index + 1)}
                    </div>
                </div>
                <div class="e2s-step-body ${index + 1 === this.currentStep ? 'active' : ''}">
                    ${step.content}
                </div>
            </div>
        `).join('');
    }

    /**
     * تعیین وضعیت هر مرحله
     */
    getStepStatus(stepNumber) {
        if (stepNumber < this.currentStep) {
            return '<span class="e2s-status completed"><i class="fas fa-check"></i> تکمیل شده</span>';
        } else if (stepNumber === this.currentStep) {
            return '<span class="e2s-status active"><i class="fas fa-spinner fa-spin"></i> در حال انجام</span>';
        } else {
            return '<span class="e2s-status pending"><i class="fas fa-clock"></i> در انتظار</span>';
        }
    }

    /**
     * مرحله 1: انتخاب فایل Excel
     */
    getFileSelectionHTML() {
        return `
            <div class="e2s-file-selection">
                <div class="e2s-upload-area" id="e2s-upload-area">
                    <div class="e2s-upload-icon">
                        <i class="fas fa-cloud-upload-alt"></i>
                    </div>
                    <h3>فایل Excel خود را آپلود کنید</h3>
                    <p>فایل‌های پشتیبانی شده: .xlsx, .xls</p>
                    <p>حداکثر اندازه: 50 مگابایت</p>
                    <input type="file" id="e2s-file-input" accept=".xlsx,.xls" style="display: none;">
                    <button class="e2s-btn primary lg" onclick="document.getElementById('e2s-file-input').click()">
                        <i class="fas fa-plus"></i>
                        انتخاب فایل
                    </button>
                </div>
                
                <div class="e2s-file-info" id="e2s-file-info" style="display: none;">
                    <div class="e2s-file-icon">
                        <i class="fas fa-file-excel"></i>
                    </div>
                    <div class="e2s-file-details">
                        <h4 id="e2s-file-name">نام فایل</h4>
                        <p id="e2s-file-size">اندازه فایل</p>
                        <p id="e2s-file-type">نوع فایل</p>
                    </div>
                    <button class="e2s-btn danger sm" id="e2s-remove-file">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * مرحله 2: شناسایی فایل
     */
    getFileAnalysisHTML() {
        return `
            <div class="e2s-analysis-container">
                <div class="e2s-analysis-loading" id="e2s-analysis-loading">
                    <div class="e2s-spinner"></div>
                    <p>در حال تحلیل فایل...</p>
                </div>
                
                <div class="e2s-analysis-result" id="e2s-analysis-result" style="display: none;">
                    <div class="e2s-file-stats">
                        <div class="e2s-stat-card">
                            <div class="e2s-stat-icon">
                                <i class="fas fa-table"></i>
                            </div>
                            <div class="e2s-stat-info">
                                <h4 id="e2s-sheet-count">0</h4>
                                <p>برگه</p>
                            </div>
                        </div>
                        
                        <div class="e2s-stat-card">
                            <div class="e2s-stat-icon">
                                <i class="fas fa-list"></i>
                            </div>
                            <div class="e2s-stat-info">
                                <h4 id="e2s-row-count">0</h4>
                                <p>سطر</p>
                            </div>
                        </div>
                        
                        <div class="e2s-stat-card">
                            <div class="e2s-stat-icon">
                                <i class="fas fa-columns"></i>
                            </div>
                            <div class="e2s-stat-info">
                                <h4 id="e2s-column-count">0</h4>
                                <p>ستون</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="e2s-sheets-preview" id="e2s-sheets-preview">
                        <!-- Sheet previews will be loaded here -->
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * مرحله 3: شروع پردازش
     */
    getStartProcessingHTML() {
        return `
            <div class="e2s-processing-start">
                <div class="e2s-processing-info">
                    <div class="e2s-info-icon">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <div class="e2s-info-content">
                        <h4>آماده برای پردازش هوشمند</h4>
                        <p>فایل شما تحلیل شد و آماده پردازش با هوش مصنوعی است.</p>
                        <ul class="e2s-processing-features">
                            <li><i class="fas fa-check"></i> تحلیل ساختار داده‌ها</li>
                            <li><i class="fas fa-check"></i> تشخیص نوع فیلدها</li>
                            <li><i class="fas fa-check"></i> پیشنهاد نام مناسب برای دیتابیس</li>
                            <li><i class="fas fa-check"></i> بهینه‌سازی ساختار جداول</li>
                        </ul>
                    </div>
                </div>
                
                <div class="e2s-processing-actions">
                    <button class="e2s-btn primary lg" id="e2s-start-ai-processing">
                        <i class="fas fa-robot"></i>
                        شروع پردازش هوشمند
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * مرحله 4: تحلیل اولیه
     */
    getInitialAnalysisHTML() {
        return `
            <div class="e2s-initial-analysis">
                <div class="e2s-analysis-loading" id="e2s-initial-loading">
                    <div class="e2s-spinner"></div>
                    <p>هوش مصنوعی در حال تحلیل محتوای فایل...</p>
                </div>
                
                <div class="e2s-analysis-summary" id="e2s-analysis-summary" style="display: none;">
                    <h4>خلاصه تحلیل محتوا</h4>
                    
                    <div class="e2s-content-preview">
                        <div class="e2s-preview-table" id="e2s-preview-table">
                            <!-- Table preview will be loaded here -->
                        </div>
                    </div>
                    
                    <div class="e2s-analysis-insights" id="e2s-analysis-insights">
                        <!-- AI insights will be loaded here -->
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * مرحله 5: پیشنهادات هوش مصنوعی
     */
    getAiSuggestionsHTML() {
        return `
            <div class="e2s-ai-suggestions">
                <div class="e2s-suggestions-form">
                    <div class="e2s-form-group">
                        <label class="e2s-form-label">نام پیشنهادی دیتابیس</label>
                        <input type="text" class="e2s-form-control" id="e2s-suggested-db-name" 
                               placeholder="نام دیتابیس">
                    </div>
                    
                    <div class="e2s-form-group">
                        <label class="e2s-form-label">توضیحات دیتابیس</label>
                        <textarea class="e2s-form-control" id="e2s-suggested-db-description" 
                                  rows="4" placeholder="توضیحات دیتابیس"></textarea>
                    </div>
                </div>
                
                <div class="e2s-chat-interface">
                    <div class="e2s-chat-header">
                        <h4><i class="fas fa-comments"></i> گفتگو با هوش مصنوعی</h4>
                    </div>
                    <div class="e2s-chat-messages" id="e2s-chat-messages">
                        <!-- Chat messages will appear here -->
                    </div>
                    <div class="e2s-chat-input">
                        <input type="text" class="e2s-form-control" id="e2s-chat-input" 
                               placeholder="سوال یا دستور خود را وارد کنید...">
                        <button class="e2s-btn primary" id="e2s-send-chat">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * مرحله 6: نقشه‌برداری فیلدها
     */
    getFieldMappingHTML() {
        return `
            <div class="e2s-field-mapping">
                <div class="e2s-mapping-header">
                    <h4>تطبیق فیلدهای Excel با دیتابیس</h4>
                    <p>فیلدهای پیشنهادی هوش مصنوعی را بررسی و در صورت نیاز ویرایش کنید</p>
                </div>
                
                <div class="e2s-mapping-table">
                    <table class="e2s-table">
                        <thead>
                            <tr>
                                <th>ستون Excel</th>
                                <th>نوع داده</th>
                                <th>نام فیلد پیشنهادی</th>
                                <th>نوع فیلد SQL</th>
                                <th>تنظیمات</th>
                            </tr>
                        </thead>
                        <tbody id="e2s-mapping-tbody">
                            <!-- Field mappings will be loaded here -->
                        </tbody>
                    </table>
                </div>
                
                <div class="e2s-mapping-actions">
                    <button class="e2s-btn secondary" id="e2s-reset-mapping">
                        <i class="fas fa-undo"></i>
                        بازنشانی پیشنهادها
                    </button>
                    <button class="e2s-btn success" id="e2s-auto-optimize">
                        <i class="fas fa-magic"></i>
                        بهینه‌سازی خودکار
                    </button>
                </div>
                
                <div class="e2s-mapping-chat">
                    <h5>چت تخصصی فیلدها</h5>
                    <div class="e2s-chat-messages" id="e2s-mapping-chat-messages">
                        <!-- Chat messages for field mapping -->
                    </div>
                    <div class="e2s-chat-input">
                        <input type="text" class="e2s-form-control" id="e2s-mapping-chat-input" 
                               placeholder="سوال در مورد فیلدها...">
                        <button class="e2s-btn primary" id="e2s-send-mapping-chat">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * مرحله 7: تایید کوئری SQL
     */
    getSqlConfirmationHTML() {
        return `
            <div class="e2s-sql-confirmation">
                <div class="e2s-sql-preview">
                    <h4>کوئری SQL ایجاد دیتابیس</h4>
                    <div class="e2s-sql-editor">
                        <pre id="e2s-sql-code"><code></code></pre>
                        <div class="e2s-sql-actions">
                            <button class="e2s-btn secondary sm" id="e2s-copy-sql">
                                <i class="fas fa-copy"></i> کپی
                            </button>
                            <button class="e2s-btn secondary sm" id="e2s-edit-sql">
                                <i class="fas fa-edit"></i> ویرایش
                            </button>
                            <button class="e2s-btn success sm" id="e2s-validate-sql">
                                <i class="fas fa-check"></i> اعتبارسنجی
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="e2s-sql-explanation" id="e2s-sql-explanation">
                    <!-- SQL explanation will be loaded here -->
                </div>
            </div>
        `;
    }

    /**
     * مرحله 8: اجرای کوئری
     */
    getSqlExecutionHTML() {
        return `
            <div class="e2s-sql-execution">
                <div class="e2s-execution-status" id="e2s-execution-status">
                    <div class="e2s-status-pending">
                        <i class="fas fa-play"></i>
                        <h4>آماده برای اجرا</h4>
                        <p>کوئری SQL تأیید شده و آماده اجرا است</p>
                        <button class="e2s-btn primary lg" id="e2s-execute-sql">
                            <i class="fas fa-database"></i>
                            اجرای کوئری
                        </button>
                    </div>
                </div>
                
                <div class="e2s-execution-log" id="e2s-execution-log" style="display: none;">
                    <h5>لاگ اجرا</h5>
                    <div class="e2s-log-container" id="e2s-log-container">
                        <!-- Execution logs will appear here -->
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * مرحله 9: تایید انتقال داده‌ها
     */
    getDataConfirmationHTML() {
        return `
            <div class="e2s-data-confirmation">
                <div class="e2s-confirmation-summary">
                    <h4>تایید انتقال داده‌ها</h4>
                    <div class="e2s-summary-stats">
                        <div class="e2s-stat-item">
                            <span class="e2s-stat-number" id="e2s-total-rows">0</span>
                            <span class="e2s-stat-label">سطر داده</span>
                        </div>
                        <div class="e2s-stat-item">
                            <span class="e2s-stat-number" id="e2s-total-columns">0</span>
                            <span class="e2s-stat-label">ستون</span>
                        </div>
                        <div class="e2s-stat-item">
                            <span class="e2s-stat-number" id="e2s-estimated-time">0</span>
                            <span class="e2s-stat-label">ثانیه تخمینی</span>
                        </div>
                    </div>
                </div>
                
                <div class="e2s-confirmation-options">
                    <div class="e2s-option-group">
                        <label class="e2s-checkbox">
                            <input type="checkbox" id="e2s-validate-data" checked>
                            <span class="e2s-checkmark"></span>
                            اعتبارسنجی داده‌ها قبل از وارد کردن
                        </label>
                        
                        <label class="e2s-checkbox">
                            <input type="checkbox" id="e2s-skip-errors" checked>
                            <span class="e2s-checkmark"></span>
                            نادیده گرفتن خطاهای جزئی
                        </label>
                        
                        <label class="e2s-checkbox">
                            <input type="checkbox" id="e2s-backup-data">
                            <span class="e2s-checkmark"></span>
                            ایجاد پشتیبان قبل از وارد کردن
                        </label>
                    </div>
                    
                    <button class="e2s-btn success lg" id="e2s-confirm-transfer">
                        <i class="fas fa-check"></i>
                        تایید و شروع انتقال
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * مرحله 10: انتقال داده‌ها
     */
    getDataTransferHTML() {
        return `
            <div class="e2s-data-transfer">
                <div class="e2s-transfer-progress">
                    <div class="e2s-progress-info">
                        <h4>در حال انتقال داده‌ها...</h4>
                        <p id="e2s-transfer-status">آماده‌سازی...</p>
                    </div>
                    
                    <div class="e2s-progress-bar-container">
                        <div class="e2s-progress-bar">
                            <div class="e2s-progress-fill" id="e2s-transfer-progress-fill" style="width: 0%"></div>
                        </div>
                        <span class="e2s-progress-text" id="e2s-progress-text">0%</span>
                    </div>
                    
                    <div class="e2s-transfer-stats">
                        <div class="e2s-stat">
                            <span class="e2s-stat-value" id="e2s-transferred-rows">0</span>
                            <span class="e2s-stat-label">سطر منتقل شده</span>
                        </div>
                        <div class="e2s-stat">
                            <span class="e2s-stat-value" id="e2s-transfer-speed">0</span>
                            <span class="e2s-stat-label">سطر/ثانیه</span>
                        </div>
                        <div class="e2s-stat">
                            <span class="e2s-stat-value" id="e2s-remaining-time">--</span>
                            <span class="e2s-stat-label">زمان باقیمانده</span>
                        </div>
                    </div>
                </div>
                
                <div class="e2s-transfer-log">
                    <h5>لاگ انتقال</h5>
                    <div class="e2s-log-messages" id="e2s-transfer-log-messages">
                        <!-- Transfer log messages -->
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * مرحله 11: نتیجه نهایی
     */
    getFinalResultHTML() {
        return `
            <div class="e2s-final-result">
                <div class="e2s-result-header">
                    <div class="e2s-result-icon success" id="e2s-result-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3 id="e2s-result-title">عملیات با موفقیت تکمیل شد!</h3>
                    <p id="e2s-result-message">فایل Excel شما با موفقیت به پایگاه داده تبدیل شد.</p>
                </div>
                
                <div class="e2s-result-summary">
                    <div class="e2s-summary-grid">
                        <div class="e2s-summary-item">
                            <i class="fas fa-database"></i>
                            <div>
                                <h5>نام دیتابیس</h5>
                                <p id="e2s-final-db-name">-</p>
                            </div>
                        </div>
                        <div class="e2s-summary-item">
                            <i class="fas fa-table"></i>
                            <div>
                                <h5>جداول ایجاد شده</h5>
                                <p id="e2s-final-tables-count">-</p>
                            </div>
                        </div>
                        <div class="e2s-summary-item">
                            <i class="fas fa-list"></i>
                            <div>
                                <h5>رکوردهای وارد شده</h5>
                                <p id="e2s-final-records-count">-</p>
                            </div>
                        </div>
                        <div class="e2s-summary-item">
                            <i class="fas fa-clock"></i>
                            <div>
                                <h5>زمان کل</h5>
                                <p id="e2s-final-duration">-</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="e2s-result-actions">
                    <button class="e2s-btn secondary" id="e2s-download-report">
                        <i class="fas fa-download"></i>
                        دانلود گزارش
                    </button>
                    <button class="e2s-btn primary" id="e2s-view-database">
                        <i class="fas fa-eye"></i>
                        مشاهده دیتابیس
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * مرحله 12: تکمیل فرآیند
     */
    getCompletionHTML() {
        return `
            <div class="e2s-completion">
                <div class="e2s-completion-message">
                    <div class="e2s-completion-icon">
                        <i class="fas fa-flag-checkered"></i>
                    </div>
                    <h3>فرآیند تبدیل Excel به SQL تکمیل شد!</h3>
                    <p>تمام مراحل با موفقیت انجام شد. حالا می‌توانید به داشبورد بازگردید یا عملیات جدیدی شروع کنید.</p>
                </div>
                
                <div class="e2s-completion-options">
                    <div class="e2s-option-card">
                        <i class="fas fa-home"></i>
                        <h4>بازگشت به داشبورد</h4>
                        <p>بازگشت به صفحه اصلی مدیریت داده‌ها</p>
                        <button class="e2s-btn primary" id="e2s-return-dashboard">
                            برو به داشبورد
                        </button>
                    </div>
                    
                    <div class="e2s-option-card">
                        <i class="fas fa-plus"></i>
                        <h4>پروژه جدید</h4>
                        <p>شروع تبدیل فایل Excel جدید</p>
                        <button class="e2s-btn success" id="e2s-new-project">
                            پروژه جدید
                        </button>
                    </div>
                    
                    <div class="e2s-option-card">
                        <i class="fas fa-history"></i>
                        <h4>تاریخچه پروژه‌ها</h4>
                        <p>مشاهده پروژه‌های قبلی</p>
                        <button class="e2s-btn secondary" id="e2s-view-history">
                            تاریخچه
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * اتصال رویدادها
     */
    attachEventListeners() {
        // Navigation events
        document.addEventListener('click', (e) => {
            if (e.target.id === 'e2s-next-step') {
                this.nextStep();
            } else if (e.target.id === 'e2s-prev-step') {
                this.prevStep();
            } else if (e.target.id === 'e2s-cancel-process') {
                this.cancelProcess();
            }
        });

        // File selection events
        document.addEventListener('change', (e) => {
            if (e.target.id === 'e2s-file-input') {
                this.handleFileSelection(e.target.files[0]);
            }
        });

        // Drag and drop events
        document.addEventListener('dragover', (e) => {
            if (e.target.closest('#e2s-upload-area')) {
                e.preventDefault();
                e.target.closest('#e2s-upload-area').classList.add('dragover');
            }
        });

        document.addEventListener('dragleave', (e) => {
            if (e.target.closest('#e2s-upload-area')) {
                e.target.closest('#e2s-upload-area').classList.remove('dragover');
            }
        });

        document.addEventListener('drop', (e) => {
            if (e.target.closest('#e2s-upload-area')) {
                e.preventDefault();
                e.target.closest('#e2s-upload-area').classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handleFileSelection(files[0]);
                }
            }
        });

        // Chat events
        document.addEventListener('click', (e) => {
            if (e.target.id === 'e2s-send-chat') {
                this.sendChatMessage();
            } else if (e.target.id === 'e2s-send-mapping-chat') {
                this.sendMappingChatMessage();
            }
        });

        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (e.target.id === 'e2s-chat-input') {
                    this.sendChatMessage();
                } else if (e.target.id === 'e2s-mapping-chat-input') {
                    this.sendMappingChatMessage();
                }
            }
        });

        // Step-specific events
        this.attachStepSpecificEvents();
    }

    /**
     * اتصال رویدادهای مخصوص هر مرحله
     */
    attachStepSpecificEvents() {
        document.addEventListener('click', (e) => {
            // Step 3: Start processing
            if (e.target.id === 'e2s-start-ai-processing') {
                this.startAiProcessing();
            }
            // Step 7: SQL actions
            else if (e.target.id === 'e2s-copy-sql') {
                this.copySqlToClipboard();
            } else if (e.target.id === 'e2s-edit-sql') {
                this.editSqlQuery();
            } else if (e.target.id === 'e2s-validate-sql') {
                this.validateSqlQuery();
            }
            // Step 8: Execute SQL
            else if (e.target.id === 'e2s-execute-sql') {
                this.executeSqlQuery();
            }
            // Step 9: Confirm transfer
            else if (e.target.id === 'e2s-confirm-transfer') {
                this.confirmDataTransfer();
            }
            // Step 12: Completion actions
            else if (e.target.id === 'e2s-return-dashboard') {
                this.returnToDashboard();
            } else if (e.target.id === 'e2s-new-project') {
                this.startNewProject();
            } else if (e.target.id === 'e2s-view-history') {
                this.viewProjectHistory();
            }
        });
    }

    /**
     * مدیریت انتخاب فایل
     */
    handleFileSelection(file) {
        if (!file) return;

        // Validate file type
        const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
                              'application/vnd.ms-excel'];
        if (!allowedTypes.includes(file.type)) {
            this.showError('فقط فایل‌های Excel (.xlsx, .xls) پشتیبانی می‌شوند.');
            return;
        }

        // Validate file size (50MB)
        if (file.size > 50 * 1024 * 1024) {
            this.showError('حداکثر اندازه فایل 50 مگابایت است.');
            return;
        }

        // Store file data
        this.projectData.file = file;
        this.projectData.fileName = file.name;
        this.projectData.fileSize = file.size;
        this.projectData.fileType = file.type;

        // Update UI
        this.updateFileInfo();
        this.enableNextStep();
    }

    /**
     * بروزرسانی اطلاعات فایل در UI
     */
    updateFileInfo() {
        const uploadArea = document.getElementById('e2s-upload-area');
        const fileInfo = document.getElementById('e2s-file-info');
        
        if (uploadArea && fileInfo) {
            uploadArea.style.display = 'none';
            fileInfo.style.display = 'flex';
            
            document.getElementById('e2s-file-name').textContent = this.projectData.fileName;
            document.getElementById('e2s-file-size').textContent = this.formatFileSize(this.projectData.fileSize);
            document.getElementById('e2s-file-type').textContent = this.getFileTypeLabel(this.projectData.fileType);
        }
    }

    /**
     * فرمت کردن اندازه فایل
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 بایت';
        const k = 1024;
        const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * دریافت برچسب نوع فایل
     */
    getFileTypeLabel(mimeType) {
        const types = {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel 2007+ (.xlsx)',
            'application/vnd.ms-excel': 'Excel 97-2003 (.xls)'
        };
        return types[mimeType] || 'فایل Excel';
    }

    /**
     * نمایش مرحله مشخص
     */
    showStep(stepNumber) {
        // Update current step
        this.currentStep = stepNumber;

        // Update progress bar
        const progressFill = document.querySelector('.e2s-progress-fill');
        if (progressFill) {
            progressFill.style.width = `${(stepNumber / this.totalSteps) * 100}%`;
        }

        // Update step counter
        const stepCounter = document.getElementById('e2s-current-step');
        if (stepCounter) {
            stepCounter.textContent = stepNumber;
        }

        // Update step states
        document.querySelectorAll('.e2s-step').forEach((step, index) => {
            const stepNum = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNum < stepNumber) {
                step.classList.add('completed');
            } else if (stepNum === stepNumber) {
                step.classList.add('active');
            }

            // Update step body visibility
            const stepBody = step.querySelector('.e2s-step-body');
            if (stepBody) {
                stepBody.classList.toggle('active', stepNum === stepNumber);
            }

            // Update status
            const statusElement = step.querySelector('.e2s-step-status');
            if (statusElement) {
                statusElement.innerHTML = this.getStepStatus(stepNum);
            }
        });

        // Update navigation buttons
        this.updateNavigationButtons();
    }

    /**
     * بروزرسانی دکمه‌های ناوبری
     */
    updateNavigationButtons() {
        const prevBtn = document.getElementById('e2s-prev-step');
        const nextBtn = document.getElementById('e2s-next-step');

        if (prevBtn) {
            prevBtn.disabled = this.currentStep <= 1;
        }

        if (nextBtn) {
            if (this.currentStep >= this.totalSteps) {
                nextBtn.style.display = 'none';
            } else {
                nextBtn.style.display = 'inline-flex';
                nextBtn.disabled = !this.canProceedToNextStep();
            }
        }
    }

    /**
     * بررسی امکان ادامه به مرحله بعد
     */
    canProceedToNextStep() {
        switch (this.currentStep) {
            case 1:
                return this.projectData.file !== null;
            case 2:
                return this.projectData.analysis !== null;
            case 3:
            case 4:
            case 5:
                return true; // Auto-proceed after AI processing
            case 6:
                return this.projectData.fields.length > 0;
            case 7:
                return this.projectData.sqlQuery !== '';
            case 8:
            case 9:
            case 10:
            case 11:
                return true;
            default:
                return false;
        }
    }

    /**
     * رفتن به مرحله بعد
     */
    nextStep() {
        if (this.currentStep < this.totalSteps && this.canProceedToNextStep()) {
            this.showStep(this.currentStep + 1);
            this.executeStepActions(this.currentStep);
        }
    }

    /**
     * رفتن به مرحله قبل
     */
    prevStep() {
        if (this.currentStep > 1) {
            this.showStep(this.currentStep - 1);
        }
    }

    /**
     * اجرای اقدامات مخصوص هر مرحله
     */
    executeStepActions(stepNumber) {
        switch (stepNumber) {
            case 2:
                this.analyzeFile();
                break;
            case 4:
                this.performInitialAnalysis();
                break;
            case 5:
                this.getAiSuggestions();
                break;
            case 6:
                this.generateFieldMapping();
                break;
            case 7:
                this.generateSqlQuery();
                break;
        }
    }

    /**
     * تحلیل فایل (مرحله 2)
     */
    async analyzeFile() {
        const loadingEl = document.getElementById('e2s-analysis-loading');
        const resultEl = document.getElementById('e2s-analysis-result');

        if (loadingEl) loadingEl.style.display = 'block';
        if (resultEl) resultEl.style.display = 'none';

        try {
            // Simulate file analysis
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock analysis results
            const analysis = {
                sheets: 1,
                rows: 150,
                columns: 8,
                sheetsData: [
                    {
                        name: 'Sheet1',
                        rows: 150,
                        columns: 8,
                        preview: [
                            ['نام', 'نام خانوادگی', 'سن', 'شهر', 'تاریخ ثبت', 'وضعیت', 'درآمد', 'توضیحات'],
                            ['احمد', 'احمدی', '30', 'تهران', '1402/01/15', 'فعال', '5000000', 'کارمند شرکت'],
                            ['سارا', 'محمدی', '25', 'اصفهان', '1402/02/10', 'فعال', '4500000', 'مدیر فروش']
                        ]
                    }
                ]
            };

            this.projectData.analysis = analysis;

            // Update UI
            document.getElementById('e2s-sheet-count').textContent = analysis.sheets;
            document.getElementById('e2s-row-count').textContent = analysis.rows;
            document.getElementById('e2s-column-count').textContent = analysis.columns;

            if (loadingEl) loadingEl.style.display = 'none';
            if (resultEl) resultEl.style.display = 'block';

            this.enableNextStep();

        } catch (error) {
            this.showError('خطا در تحلیل فایل: ' + error.message);
        }
    }

    /**
     * فعال کردن دکمه مرحله بعد
     */
    enableNextStep() {
        const nextBtn = document.getElementById('e2s-next-step');
        if (nextBtn) {
            nextBtn.disabled = false;
        }
    }

    /**
     * نمایش خطا
     */
    showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'e2s-error-notification';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        document.body.appendChild(errorDiv);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }

    /**
     * شروع پردازش هوش مصنوعی
     */
    async startAiProcessing() {
        this.nextStep(); // Go to step 4
    }

    /**
     * تحلیل اولیه با هوش مصنوعی (مرحله 4)
     */
    async performInitialAnalysis() {
        const loadingEl = document.getElementById('e2s-initial-loading');
        const summaryEl = document.getElementById('e2s-analysis-summary');

        if (loadingEl) loadingEl.style.display = 'block';
        if (summaryEl) summaryEl.style.display = 'none';

        try {
            // Simulate AI analysis
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Mock AI insights
            const insights = {
                dataType: 'اطلاعات کارکنان',
                quality: 'عالی',
                recommendations: [
                    'ستون "نام" و "نام خانوادگی" را می‌توان ترکیب کرد',
                    'ستون "تاریخ ثبت" نیاز به تبدیل فرمت دارد',
                    'ستون "درآمد" باید به عنوان عدد ذخیره شود'
                ]
            };

            // Update UI with results
            if (summaryEl) {
                summaryEl.innerHTML = `
                    <h4>خلاصه تحلیل محتوا</h4>
                    <div class="e2s-insight-card">
                        <h5>نوع داده‌ها: ${insights.dataType}</h5>
                        <p>کیفیت داده‌ها: ${insights.quality}</p>
                        <h6>پیشنهادات:</h6>
                        <ul>
                            ${insights.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }

            if (loadingEl) loadingEl.style.display = 'none';
            if (summaryEl) summaryEl.style.display = 'block';

            // Auto proceed to next step after 2 seconds
            setTimeout(() => {
                this.nextStep();
            }, 2000);

        } catch (error) {
            this.showError('خطا در تحلیل هوش مصنوعی: ' + error.message);
        }
    }

    /**
     * دریافت پیشنهادات هوش مصنوعی (مرحله 5)
     */
    async getAiSuggestions() {
        // Mock AI suggestions
        const suggestions = {
            dbName: 'employees_database',
            description: 'پایگاه داده اطلاعات کارکنان شامل اطلاعات شخصی، تاریخ استخدام و درآمد'
        };

        // Update form fields
        const dbNameInput = document.getElementById('e2s-suggested-db-name');
        const dbDescInput = document.getElementById('e2s-suggested-db-description');

        if (dbNameInput) dbNameInput.value = suggestions.dbName;
        if (dbDescInput) dbDescInput.value = suggestions.description;

        // Add initial AI message
        this.addChatMessage('ai', 'سلام! من فایل Excel شما را تحلیل کردم. نام و توضیحات پیشنهادی برای دیتابیس را در بالا مشاهده می‌کنید. آیا می‌خواهید تغییری اعمال کنید؟');
    }

    /**
     * ارسال پیام چت
     */
    sendChatMessage() {
        const input = document.getElementById('e2s-chat-input');
        if (!input || !input.value.trim()) return;

        const message = input.value.trim();
        this.addChatMessage('user', message);
        input.value = '';

        // Simulate AI response
        setTimeout(() => {
            const aiResponse = this.generateAiResponse(message);
            this.addChatMessage('ai', aiResponse);
        }, 1000);
    }

    /**
     * اضافه کردن پیام به چت
     */
    addChatMessage(sender, message) {
        const chatMessages = document.getElementById('e2s-chat-messages');
        if (!chatMessages) return;

        const messageEl = document.createElement('div');
        messageEl.className = `e2s-chat-message ${sender}`;
        messageEl.innerHTML = `
            <div class="e2s-message-content">
                ${message}
            </div>
            <div class="e2s-message-time">
                ${new Date().toLocaleTimeString('fa-IR')}
            </div>
        `;

        chatMessages.appendChild(messageEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Store in project data
        this.projectData.chatHistory.push({
            sender,
            message,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * تولید پاسخ هوش مصنوعی
     */
    generateAiResponse(userMessage) {
        const responses = [
            'درک کردم. این تغییر اعمال شد.',
            'پیشنهاد خوبی است. بروزرسانی انجام شد.',
            'بسیار خب، این مورد را در نظر گرفتم.',
            'تغییرات شما ثبت شد و در مرحله بعد اعمال خواهد شد.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    /**
     * تولید نقشه‌برداری فیلدها (مرحله 6)
     */
    generateFieldMapping() {
        const mappingData = [
            { excelColumn: 'نام', dataType: 'متن', suggestedField: 'first_name', sqlType: 'VARCHAR(50)' },
            { excelColumn: 'نام خانوادگی', dataType: 'متن', suggestedField: 'last_name', sqlType: 'VARCHAR(50)' },
            { excelColumn: 'سن', dataType: 'عدد', suggestedField: 'age', sqlType: 'INT' },
            { excelColumn: 'شهر', dataType: 'متن', suggestedField: 'city', sqlType: 'VARCHAR(100)' },
            { excelColumn: 'تاریخ ثبت', dataType: 'تاریخ', suggestedField: 'registration_date', sqlType: 'DATE' },
            { excelColumn: 'وضعیت', dataType: 'متن', suggestedField: 'status', sqlType: 'ENUM("فعال","غیرفعال")' },
            { excelColumn: 'درآمد', dataType: 'عدد', suggestedField: 'salary', sqlType: 'DECIMAL(10,2)' },
            { excelColumn: 'توضیحات', dataType: 'متن', suggestedField: 'description', sqlType: 'TEXT' }
        ];

        this.projectData.fields = mappingData;

        // Update mapping table
        const tbody = document.getElementById('e2s-mapping-tbody');
        if (tbody) {
            tbody.innerHTML = mappingData.map(field => `
                <tr>
                    <td>${field.excelColumn}</td>
                    <td><span class="e2s-data-type">${field.dataType}</span></td>
                    <td>
                        <input type="text" class="e2s-form-control sm" value="${field.suggestedField}">
                    </td>
                    <td>
                        <select class="e2s-form-control sm">
                            <option value="${field.sqlType}" selected>${field.sqlType}</option>
                            <option value="VARCHAR(255)">VARCHAR(255)</option>
                            <option value="TEXT">TEXT</option>
                            <option value="INT">INT</option>
                            <option value="DECIMAL(10,2)">DECIMAL(10,2)</option>
                            <option value="DATE">DATE</option>
                            <option value="DATETIME">DATETIME</option>
                        </select>
                    </td>
                    <td>
                        <button class="e2s-btn secondary xs">
                            <i class="fas fa-cog"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    }

    /**
     * تولید کوئری SQL (مرحله 7)
     */
    generateSqlQuery() {
        const dbName = document.getElementById('e2s-suggested-db-name')?.value || 'new_database';
        
        const sqlQuery = `
-- ایجاد دیتابیس
CREATE DATABASE IF NOT EXISTS \`${dbName}\` 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE \`${dbName}\`;

-- ایجاد جدول employees
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL COMMENT 'نام',
    last_name VARCHAR(50) NOT NULL COMMENT 'نام خانوادگی',
    age INT COMMENT 'سن',
    city VARCHAR(100) COMMENT 'شهر',
    registration_date DATE COMMENT 'تاریخ ثبت',
    status ENUM('فعال','غیرفعال') DEFAULT 'فعال' COMMENT 'وضعیت',
    salary DECIMAL(10,2) COMMENT 'درآمد',
    description TEXT COMMENT 'توضیحات',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ایجاد ایندکس‌ها
CREATE INDEX idx_status ON employees(status);
CREATE INDEX idx_city ON employees(city);
CREATE INDEX idx_registration_date ON employees(registration_date);
        `.trim();

        this.projectData.sqlQuery = sqlQuery;

        // Update SQL preview
        const sqlCodeEl = document.querySelector('#e2s-sql-code code');
        if (sqlCodeEl) {
            sqlCodeEl.textContent = sqlQuery;
        }

        // Add explanation
        const explanationEl = document.getElementById('e2s-sql-explanation');
        if (explanationEl) {
            explanationEl.innerHTML = `
                <div class="e2s-explanation-card">
                    <h6>توضیحات کوئری:</h6>
                    <ul>
                        <li>دیتابیس با encoding UTF8MB4 برای پشتیبانی کامل فارسی</li>
                        <li>جدول employees با ${this.projectData.fields.length} فیلد اصلی</li>
                        <li>فیلد id به عنوان کلید اصلی با auto increment</li>
                        <li>فیلدهای created_at و updated_at برای ردیابی تغییرات</li>
                        <li>ایندکس‌های بهینه‌سازی شده برای جستجوی سریع</li>
                    </ul>
                </div>
            `;
        }
    }

    /**
     * کپی کوئری SQL
     */
    copySqlToClipboard() {
        const sqlCode = document.querySelector('#e2s-sql-code code');
        if (sqlCode) {
            navigator.clipboard.writeText(sqlCode.textContent)
                .then(() => {
                    this.showSuccess('کوئری با موفقیت کپی شد');
                })
                .catch(() => {
                    this.showError('خطا در کپی کردن کوئری');
                });
        }
    }

    /**
     * نمایش پیام موفقیت
     */
    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'e2s-success-notification';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        document.body.appendChild(successDiv);

        setTimeout(() => {
            if (successDiv.parentElement) {
                successDiv.remove();
            }
        }, 3000);
    }

    /**
     * ویرایش کوئری SQL
     */
    editSqlQuery() {
        const sqlCodeEl = document.querySelector('#e2s-sql-code code');
        if (sqlCodeEl) {
            const currentQuery = sqlCodeEl.textContent;
            
            // Create modal for editing
            const modal = document.createElement('div');
            modal.className = 'e2s-modal';
            modal.innerHTML = `
                <div class="e2s-modal-content">
                    <div class="e2s-modal-header">
                        <h4>ویرایش کوئری SQL</h4>
                        <button class="e2s-modal-close">&times;</button>
                    </div>
                    <div class="e2s-modal-body">
                        <textarea class="e2s-sql-editor" id="e2s-sql-textarea">${currentQuery}</textarea>
                    </div>
                    <div class="e2s-modal-footer">
                        <button class="e2s-btn secondary" onclick="this.closest('.e2s-modal').remove()">
                            لغو
                        </button>
                        <button class="e2s-btn primary" id="e2s-save-sql">
                            ذخیره تغییرات
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Handle save
            document.getElementById('e2s-save-sql').onclick = () => {
                const newQuery = document.getElementById('e2s-sql-textarea').value;
                sqlCodeEl.textContent = newQuery;
                this.projectData.sqlQuery = newQuery;
                modal.remove();
                this.showSuccess('کوئری بروزرسانی شد');
            };
            
            // Handle close
            modal.querySelector('.e2s-modal-close').onclick = () => modal.remove();
        }
    }

    /**
     * اعتبارسنجی کوئری SQL
     */
    async validateSqlQuery() {
        const validateBtn = document.getElementById('e2s-validate-sql');
        if (validateBtn) {
            validateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال بررسی...';
            validateBtn.disabled = true;
        }

        try {
            // Simulate validation
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Mock validation result
            const isValid = true;
            
            if (isValid) {
                this.showSuccess('کوئری معتبر است و آماده اجرا');
            } else {
                this.showError('کوئری دارای خطا است');
            }
            
        } catch (error) {
            this.showError('خطا در اعتبارسنجی: ' + error.message);
        } finally {
            if (validateBtn) {
                validateBtn.innerHTML = '<i class="fas fa-check"></i> اعتبارسنجی';
                validateBtn.disabled = false;
            }
        }
    }

    /**
     * اجرای کوئری SQL (مرحله 8)
     */
    async executeSqlQuery() {
        const statusEl = document.getElementById('e2s-execution-status');
        const logEl = document.getElementById('e2s-execution-log');
        
        if (statusEl) {
            statusEl.innerHTML = `
                <div class="e2s-status-running">
                    <i class="fas fa-spinner fa-spin"></i>
                    <h4>در حال اجرای کوئری...</h4>
                    <p>لطفاً صبر کنید</p>
                </div>
            `;
        }
        
        if (logEl) {
            logEl.style.display = 'block';
        }

        try {
            // Simulate SQL execution with progress logs
            const logs = [
                'اتصال به سرور MySQL...',
                'بررسی مجوزهای کاربر...',
                'ایجاد دیتابیس جدید...',
                'تنظیم encoding UTF8MB4...',
                'ایجاد جدول employees...',
                'اضافه کردن ایندکس‌ها...',
                'تکمیل موفقیت‌آمیز عملیات'
            ];

            const logContainer = document.getElementById('e2s-log-container');
            
            for (let i = 0; i < logs.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 800));
                
                if (logContainer) {
                    const logItem = document.createElement('div');
                    logItem.className = 'e2s-log-item success';
                    logItem.innerHTML = `
                        <i class="fas fa-check"></i>
                        <span>${logs[i]}</span>
                        <small>${new Date().toLocaleTimeString('fa-IR')}</small>
                    `;
                    logContainer.appendChild(logItem);
                    logContainer.scrollTop = logContainer.scrollHeight;
                }
            }

            // Show success status
            if (statusEl) {
                statusEl.innerHTML = `
                    <div class="e2s-status-success">
                        <i class="fas fa-check-circle"></i>
                        <h4>کوئری با موفقیت اجرا شد!</h4>
                        <p>دیتابیس و جداول آماده هستند</p>
                        <button class="e2s-btn primary" onclick="this.closest('.e2s-timeline-container').querySelector('#e2s-next-step').click()">
                            ادامه به مرحله بعد
                        </button>
                    </div>
                `;
            }

        } catch (error) {
            this.showError('خطا در اجرای کوئری: ' + error.message);
            
            if (statusEl) {
                statusEl.innerHTML = `
                    <div class="e2s-status-error">
                        <i class="fas fa-exclamation-circle"></i>
                        <h4>خطا در اجرای کوئری</h4>
                        <p>${error.message}</p>
                        <button class="e2s-btn danger" id="e2s-retry-execution">
                            تلاش مجدد
                        </button>
                    </div>
                `;
            }
        }
    }

    /**
     * تایید انتقال داده‌ها (مرحله 9)
     */
    confirmDataTransfer() {
        // Update data statistics
        const analysis = this.projectData.analysis;
        if (analysis) {
            document.getElementById('e2s-total-rows').textContent = analysis.rows;
            document.getElementById('e2s-total-columns').textContent = analysis.columns;
            document.getElementById('e2s-estimated-time').textContent = Math.ceil(analysis.rows / 100);
        }

        // Start data transfer
        this.nextStep(); // Go to step 10
        this.startDataTransfer();
    }

    /**
     * شروع انتقال داده‌ها (مرحله 10)
     */
    async startDataTransfer() {
        const progressFill = document.getElementById('e2s-transfer-progress-fill');
        const progressText = document.getElementById('e2s-progress-text');
        const statusEl = document.getElementById('e2s-transfer-status');
        const transferredRows = document.getElementById('e2s-transferred-rows');
        const transferSpeed = document.getElementById('e2s-transfer-speed');
        const remainingTime = document.getElementById('e2s-remaining-time');
        const logMessages = document.getElementById('e2s-transfer-log-messages');

        const totalRows = this.projectData.analysis?.rows || 150;
        let currentRow = 0;
        const batchSize = 5;
        const startTime = Date.now();

        // Transfer simulation
        const transferInterval = setInterval(async () => {
            currentRow += batchSize;
            const progress = Math.min((currentRow / totalRows) * 100, 100);
            const elapsed = (Date.now() - startTime) / 1000;
            const speed = Math.round(currentRow / elapsed);
            const remaining = Math.ceil((totalRows - currentRow) / speed);

            // Update progress
            if (progressFill) progressFill.style.width = `${progress}%`;
            if (progressText) progressText.textContent = `${Math.round(progress)}%`;
            if (transferredRows) transferredRows.textContent = currentRow;
            if (transferSpeed) transferSpeed.textContent = speed;
            if (remainingTime) remainingTime.textContent = remaining > 0 ? `${remaining}s` : 'تکمیل شد';

            // Update status
            if (statusEl) {
                if (progress < 100) {
                    statusEl.textContent = `در حال انتقال سطر ${currentRow} از ${totalRows}...`;
                } else {
                    statusEl.textContent = 'انتقال داده‌ها تکمیل شد';
                }
            }

            // Add log messages
            if (logMessages && currentRow % 25 === 0) {
                const logItem = document.createElement('div');
                logItem.className = 'e2s-log-message';
                logItem.innerHTML = `
                    <span class="e2s-log-time">${new Date().toLocaleTimeString('fa-IR')}</span>
                    <span class="e2s-log-text">انتقال ${currentRow} سطر تکمیل شد</span>
                `;
                logMessages.appendChild(logItem);
                logMessages.scrollTop = logMessages.scrollHeight;
            }

            // Check completion
            if (currentRow >= totalRows) {
                clearInterval(transferInterval);
                
                // Add final log
                if (logMessages) {
                    const logItem = document.createElement('div');
                    logItem.className = 'e2s-log-message success';
                    logItem.innerHTML = `
                        <span class="e2s-log-time">${new Date().toLocaleTimeString('fa-IR')}</span>
                        <span class="e2s-log-text">تمام داده‌ها با موفقیت منتقل شدند</span>
                    `;
                    logMessages.appendChild(logItem);
                }

                // Auto proceed to next step
                setTimeout(() => {
                    this.nextStep(); // Go to step 11
                    this.showFinalResults();
                }, 2000);
            }
        }, 500);
    }

    /**
     * نمایش نتایج نهایی (مرحله 11)
     */
    showFinalResults() {
        const analysis = this.projectData.analysis;
        const dbName = document.getElementById('e2s-suggested-db-name')?.value || 'new_database';
        
        // Update final result data
        document.getElementById('e2s-final-db-name').textContent = dbName;
        document.getElementById('e2s-final-tables-count').textContent = '1 جدول (employees)';
        document.getElementById('e2s-final-records-count').textContent = `${analysis?.rows || 150} رکورد`;
        document.getElementById('e2s-final-duration').textContent = '3 دقیقه و 45 ثانیه';

        // Auto proceed to completion step
        setTimeout(() => {
            this.nextStep(); // Go to step 12
        }, 3000);
    }

    /**
     * بازگشت به داشبورد
     */
    returnToDashboard() {
        // Reset timeline
        this.currentStep = 1;
        this.projectData = {
            file: null,
            fileName: '',
            fileSize: 0,
            fileType: '',
            analysis: null,
            dbName: '',
            dbDescription: '',
            fields: [],
            sqlQuery: '',
            chatHistory: []
        };

        // Trigger dashboard view
        if (window.dataManagement && typeof window.dataManagement.showTab === 'function') {
            window.dataManagement.showTab('overview');
        }
    }

    /**
     * شروع پروژه جدید
     */
    startNewProject() {
        // Reset and restart timeline
        this.currentStep = 1;
        this.projectData = {
            file: null,
            fileName: '',
            fileSize: 0,
            fileType: '',
            analysis: null,
            dbName: '',
            dbDescription: '',
            fields: [],
            sqlQuery: '',
            chatHistory: []
        };

        this.render();
        this.attachEventListeners();
        this.showStep(1);
    }

    /**
     * مشاهده تاریخچه پروژه‌ها
     */
    viewProjectHistory() {
        if (window.dataManagement && typeof window.dataManagement.showTab === 'function') {
            window.dataManagement.showTab('history');
        }
    }

    /**
     * لغو فرآیند
     */
    cancelProcess() {
        const confirmed = confirm('آیا مطمئن هستید که می‌خواهید فرآیند را لغو کنید؟ تمام تغییرات از دست خواهد رفت.');
        
        if (confirmed) {
            this.returnToDashboard();
        }
    }

    /**
     * ارسال پیام چت نقشه‌برداری
     */
    sendMappingChatMessage() {
        const input = document.getElementById('e2s-mapping-chat-input');
        if (!input || !input.value.trim()) return;

        const message = input.value.trim();
        this.addMappingChatMessage('user', message);
        input.value = '';

        // Simulate AI response for field mapping
        setTimeout(() => {
            const aiResponse = this.generateMappingAiResponse(message);
            this.addMappingChatMessage('ai', aiResponse);
        }, 1000);
    }

    /**
     * اضافه کردن پیام به چت نقشه‌برداری
     */
    addMappingChatMessage(sender, message) {
        const chatMessages = document.getElementById('e2s-mapping-chat-messages');
        if (!chatMessages) return;

        const messageEl = document.createElement('div');
        messageEl.className = `e2s-chat-message ${sender}`;
        messageEl.innerHTML = `
            <div class="e2s-message-content">
                ${message}
            </div>
            <div class="e2s-message-time">
                ${new Date().toLocaleTimeString('fa-IR')}
            </div>
        `;

        chatMessages.appendChild(messageEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    /**
     * تولید پاسخ هوش مصنوعی برای نقشه‌برداری
     */
    generateMappingAiResponse(userMessage) {
        const mappingResponses = [
            'فیلد مورد نظر بروزرسانی شد. نوع داده مناسب انتخاب شده است.',
            'پیشنهاد خوبی است. این تغییر در ساختار جدول اعمال خواهد شد.',
            'بر اساس نوع داده‌های شما، این mapping بهینه است.',
            'تغییرات اعمال شد. آیا فیلد دیگری نیاز به بررسی دارد؟'
        ];
        return mappingResponses[Math.floor(Math.random() * mappingResponses.length)];
    }

    /**
     * دریافت داده‌های پروژه
     */
    getProjectData() {
        return this.projectData;
    }

    /**
     * تنظیم داده‌های پروژه
     */
    setProjectData(data) {
        this.projectData = { ...this.projectData, ...data };
    }

    /**
     * دریافت مرحله فعلی
     */
    getCurrentStep() {
        return this.currentStep;
    }

    /**
     * رفتن به مرحله مشخص
     */
    goToStep(stepNumber) {
        if (stepNumber >= 1 && stepNumber <= this.totalSteps) {
            this.showStep(stepNumber);
        }
    }

    /**
     * بازنشانی تایم‌لاین
     */
    reset() {
        this.currentStep = 1;
        this.projectData = {
            file: null,
            fileName: '',
            fileSize: 0,
            fileType: '',
            analysis: null,
            dbName: '',
            dbDescription: '',
            fields: [],
            sqlQuery: '',
            chatHistory: []
        };
        this.render();
        this.attachEventListeners();
        this.showStep(1);
    }

    /**
     * تخریب ماژول
     */
    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        
        // Remove event listeners
        document.removeEventListener('click', this.handleClick);
        document.removeEventListener('change', this.handleChange);
        document.removeEventListener('dragover', this.handleDragOver);
        document.removeEventListener('dragleave', this.handleDragLeave);
        document.removeEventListener('drop', this.handleDrop);
        document.removeEventListener('keypress', this.handleKeyPress);
    }
}

// Export برای استفاده در سایر ماژول‌ها
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExcelToSqlTimeline;
} else if (typeof window !== 'undefined') {
    window.ExcelToSqlTimeline = ExcelToSqlTimeline;
}