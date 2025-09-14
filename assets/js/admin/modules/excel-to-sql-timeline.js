/**
 * Excel to SQL Timeline Module
 * ماژول تایم‌لاین حرفه‌ای تبدیل اکسل به SQL
 */

// ایجاد namespace برای ماژول
const ExcelToSQLTimeline = (function() {
    // متغیرهای خصوصی
    let currentStep = 1;
    let totalSteps = 12;
    let activeTab = 'dashboard';
    let fileData = null;
    let projectName = '';
    let dbStructure = null;
    let fieldMapping = [];
    let sqlQuery = '';
    let importStartTime = null;
    let importTimer = null;
    let importProgress = 0;
    let totalRows = 0;
    let processedRows = 0;
    
    // شناسه‌های عناصر DOM
    const DOM = {
        // تب‌ها
        tabs: document.querySelectorAll('.timeline-tab'),
        tabContents: document.querySelectorAll('.timeline-tab-content'),
        
        // دکمه‌ها
        startNewProject: document.getElementById('start-new-project'),
        backToDashboard: document.getElementById('back-to-dashboard'),
        backToDashboardFinal: document.getElementById('back-to-dashboard-final'),
        viewTable: document.getElementById('view-table'),
        
        // بخش‌های تایم‌لاین
        timelineTrackProgress: document.querySelector('.dm-timeline-track-progress'),
        timelineSteps: document.querySelectorAll('.dm-timeline-step'),
        
        // مرحله 1: انتخاب فایل اکسل
        excelFile: document.getElementById('excel-file'),
        excelDropArea: document.getElementById('excel-drop-area'),
        excelFileInfo: document.getElementById('excel-file-info'),
        nextStep1: document.getElementById('next-step-1'),
        
        // فیلدهای فرم
        projectNameInput: document.getElementById('project-name'),
        dbNameInput: document.getElementById('db-name'),
        dbDescriptionInput: document.getElementById('db-description'),
        
        // مرحله 2: شناسایی فایل
        fileName: document.getElementById('file-name'),
        fileSize: document.getElementById('file-size'),
        fileSheets: document.getElementById('file-sheets'),
        fileRows: document.getElementById('file-rows'),
        fileCols: document.getElementById('file-cols'),
        fileStructurePreview: document.getElementById('file-structure-preview'),
        prevStep2: document.getElementById('prev-step-2'),
        nextStep2: document.getElementById('next-step-2'),
        
        // مرحله 3: شروع پردازش
        sheetSelector: document.getElementById('sheet-selector'),
        prevStep3: document.getElementById('prev-step-3'),
        startProcessing: document.getElementById('start-processing'),
        
        // مرحله 4: تحلیل اولیه
        fileAnalysis: document.getElementById('file-analysis'),
        prevStep4: document.getElementById('prev-step-4'),
        nextStep4: document.getElementById('next-step-4'),
        
        // مرحله 5: پیام هوش مصنوعی
        aiChatMessages: document.getElementById('ai-chat-messages'),
        aiChatInput: document.getElementById('ai-chat-input'),
        aiChatSend: document.getElementById('ai-chat-send'),
        prevStep5: document.getElementById('prev-step-5'),
        nextStep5: document.getElementById('next-step-5'),
        
        // مرحله 6: نگاشت فیلدها
        fieldMappingBody: document.getElementById('field-mapping-body'),
        fieldChatMessages: document.getElementById('field-chat-messages'),
        fieldChatInput: document.getElementById('field-chat-input'),
        fieldChatSend: document.getElementById('field-chat-send'),
        prevStep6: document.getElementById('prev-step-6'),
        nextStep6: document.getElementById('next-step-6'),
        
        // مرحله 7: تولید کوئری SQL
        sqlQueryPreview: document.getElementById('sql-query-preview'),
        prevStep7: document.getElementById('prev-step-7'),
        executeSql: document.getElementById('execute-sql'),
        
        // مرحله 8: اجرای دستور SQL
        sqlExecutionResult: document.getElementById('sql-execution-result'),
        prevStep8: document.getElementById('prev-step-8'),
        nextStep8: document.getElementById('next-step-8'),
        
        // مرحله 9: تأیید ورود داده‌ها
        totalRowsCount: document.getElementById('total-rows-count'),
        totalColsCount: document.getElementById('total-cols-count'),
        dataSize: document.getElementById('data-size'),
        importHeaders: document.getElementById('import-headers'),
        prevStep9: document.getElementById('prev-step-9'),
        startDataImport: document.getElementById('start-data-import'),
        
        // مرحله 10: پیشرفت ورود داده‌ها
        importProgressBar: document.getElementById('import-progress-bar'),
        importProgressText: document.getElementById('import-progress-text'),
        processedRecords: document.getElementById('processed-records'),
        importTime: document.getElementById('import-time'),
        importLog: document.getElementById('import-log'),
        cancelImport: document.getElementById('cancel-import'),
        nextStep10: document.getElementById('next-step-10'),
        
        // مرحله 11: نتیجه ورود داده‌ها
        importResultSummary: document.getElementById('import-result-summary'),
        prevStep11: document.getElementById('prev-step-11'),
        nextStep11: document.getElementById('next-step-11'),
        
        // مرحله 12: تکمیل
        completionTableName: document.getElementById('completion-table-name'),
        completionRecordCount: document.getElementById('completion-record-count'),
        completionFieldCount: document.getElementById('completion-field-count'),
        completionDuration: document.getElementById('completion-duration'),
        
        // سایر
        activeProjectBadge: document.getElementById('active-project-badge')
    };
    
    /**
     * نمایش یک تب خاص
     * @param {string} tabId شناسه تب
     */
    function showTab(tabId) {
        activeTab = tabId;
        
        // حذف کلاس active از تمام تب‌ها
        DOM.tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        
        // حذف کلاس active از تمام محتواهای تب‌ها
        DOM.tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // اضافه کردن کلاس active به تب انتخاب شده
        document.querySelector(`.timeline-tab[data-tab="${tabId}"]`).classList.add('active');
        
        // اضافه کردن کلاس active به محتوای تب انتخاب شده
        document.getElementById(`${tabId}-tab`).classList.add('active');
    }
    
    /**
     * نمایش یک مرحله خاص
     * @param {number} step شماره مرحله
     */
    function showStep(step) {
        currentStep = step;
        
        // به‌روزرسانی وضعیت تمام مراحل
        DOM.timelineSteps.forEach(stepEl => {
            const stepNumber = parseInt(stepEl.dataset.step);
            
            // حذف تمام کلاس‌های وضعیت
            stepEl.classList.remove('active', 'completed', 'error');
            
            // اضافه کردن کلاس مناسب بر اساس وضعیت مرحله
            if (stepNumber < currentStep) {
                stepEl.classList.add('completed');
                stepEl.querySelector('.dm-step-status').textContent = 'تکمیل شده';
                stepEl.querySelector('.dm-step-status').className = 'dm-step-status completed';
            } else if (stepNumber === currentStep) {
                stepEl.classList.add('active');
                stepEl.querySelector('.dm-step-status').textContent = 'در حال انجام';
                stepEl.querySelector('.dm-step-status').className = 'dm-step-status in-progress';
            } else {
                stepEl.querySelector('.dm-step-status').textContent = 'در انتظار';
                stepEl.querySelector('.dm-step-status').className = 'dm-step-status waiting';
            }
            
            // نمایش یا مخفی کردن محتوای مرحله
            const stepBody = stepEl.querySelector('.dm-step-body');
            if (stepNumber === currentStep) {
                stepBody.classList.remove('hidden');
            } else {
                stepBody.classList.add('hidden');
            }
        });
        
        // به‌روزرسانی نوار پیشرفت تایم‌لاین
        const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
        DOM.timelineTrackProgress.style.height = `${progressPercentage}%`;
        
        // اسکرول به مرحله فعلی
        const activeStepEl = document.querySelector(`.dm-timeline-step[data-step="${currentStep}"]`);
        if (activeStepEl) {
            activeStepEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    /**
     * تنظیم مرحله بعدی
     */
    function goToNextStep() {
        if (currentStep < totalSteps) {
            showStep(currentStep + 1);
        }
    }
    
    /**
     * تنظیم مرحله قبلی
     */
    function goToPrevStep() {
        if (currentStep > 1) {
            showStep(currentStep - 1);
        }
    }
    
    /**
     * اضافه کردن یک پیام به چت
     * @param {string} message متن پیام
     * @param {string} sender فرستنده پیام (user یا ai)
     * @param {HTMLElement} chatContainer محل نمایش پیام‌ها
     */
    function addChatMessage(message, sender, chatContainer) {
        const messageEl = document.createElement('div');
        messageEl.className = `dm-chat-message ${sender}`;
        
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        messageEl.innerHTML = `
            <div class="dm-chat-avatar ${sender}">
                <i class="fas ${sender === 'user' ? 'fa-user' : 'fa-robot'}"></i>
            </div>
            <div class="dm-chat-content">
                <div class="dm-chat-bubble">${message}</div>
                <div class="dm-chat-time">${timeString}</div>
            </div>
        `;
        
        chatContainer.appendChild(messageEl);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    /**
     * فرمت کردن حجم فایل
     * @param {number} bytes حجم به بایت
     * @returns {string} حجم فرمت شده
     */
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    /**
     * فرمت کردن زمان
     * @param {number} seconds زمان به ثانیه
     * @returns {string} زمان فرمت شده (HH:MM:SS)
     */
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            secs.toString().padStart(2, '0')
        ].join(':');
    }
    
    /**
     * به‌روزرسانی تایمر واردسازی
     */
    function updateImportTimer() {
        if (!importStartTime) return;
        
        const elapsedTime = Math.floor((Date.now() - importStartTime) / 1000);
        DOM.importTime.textContent = formatTime(elapsedTime);
    }
    
    /**
     * اضافه کردن یک لاگ به لاگ واردسازی
     * @param {string} message پیام لاگ
     */
    function addImportLog(message) {
        const now = new Date();
        const timeString = formatTime(
            now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
        );
        
        const logEntry = document.createElement('div');
        logEntry.className = 'dm-log-entry';
        logEntry.innerHTML = `
            <span class="dm-log-time">${timeString}</span>
            <span class="dm-log-message">${message}</span>
        `;
        
        DOM.importLog.appendChild(logEntry);
        DOM.importLog.scrollTop = DOM.importLog.scrollHeight;
    }
    
    /**
     * شبیه‌سازی تحلیل فایل اکسل
     */
    function simulateFileAnalysis() {
        setTimeout(() => {
            // شبیه‌سازی نتیجه تحلیل
            const analysisResult = `
                <div class="dm-analysis-header">
                    <h5>تحلیل فایل اکسل</h5>
                </div>
                <div class="dm-analysis-content">
                    <p>فایل اکسل شما دارای 5 ستون و 100 سطر است. ساختار فایل شما شامل موارد زیر است:</p>
                    
                    <div class="dm-analysis-section">
                        <h6>ستون‌های شناسایی شده:</h6>
                        <ul class="dm-analysis-list">
                            <li><strong>ستون 1 (شناسه):</strong> عدد صحیح، شماره منحصر به فرد</li>
                            <li><strong>ستون 2 (نام):</strong> متن، نام کامل</li>
                            <li><strong>ستون 3 (تاریخ):</strong> تاریخ، فرمت تاریخ استاندارد</li>
                            <li><strong>ستون 4 (مقدار):</strong> عدد اعشاری، مقادیر عددی</li>
                            <li><strong>ستون 5 (وضعیت):</strong> متن، وضعیت (فعال/غیرفعال)</li>
                        </ul>
                    </div>
                    
                    <div class="dm-analysis-section">
                        <h6>آمار کلی:</h6>
                        <ul class="dm-analysis-list">
                            <li><strong>سطرهای خالی:</strong> 0 سطر</li>
                            <li><strong>داده‌های تکراری:</strong> 0 مورد</li>
                            <li><strong>فرمت‌های ناسازگار:</strong> 0 مورد</li>
                        </ul>
                    </div>
                </div>
            `;
            
            DOM.fileAnalysis.innerHTML = analysisResult;
        }, 1500);
    }
    
    /**
     * شبیه‌سازی پیام هوش مصنوعی
     */
    function simulateAIMessage() {
        setTimeout(() => {
            // نام پیشنهادی برای دیتابیس
            DOM.dbNameInput.value = 'users_database';
            
            // توضیحات پیشنهادی برای دیتابیس
            DOM.dbDescriptionInput.value = 'دیتابیس کاربران شامل اطلاعات شناسایی، تاریخ ثبت‌نام و وضعیت کاربران';
            
            // افزودن پیام هوش مصنوعی
            addChatMessage('سلام! من فایل اکسل شما را بررسی کردم. به نظر می‌رسد این فایل شامل اطلاعات کاربران است. من یک ساختار دیتابیس برای شما پیشنهاد داده‌ام. آیا تغییراتی مد نظر دارید؟', 'ai', DOM.aiChatMessages);
        }, 1500);
    }
    
    /**
     * شبیه‌سازی نگاشت فیلدها
     */
    function simulateFieldMapping() {
        setTimeout(() => {
            // شبیه‌سازی نگاشت فیلدها
            const mappingData = [
                { excel: 'شناسه', excelType: 'عدد صحیح', db: 'id', dbType: 'INT' },
                { excel: 'نام', excelType: 'متن', db: 'name', dbType: 'VARCHAR(255)' },
                { excel: 'تاریخ', excelType: 'تاریخ', db: 'date', dbType: 'DATE' },
                { excel: 'مقدار', excelType: 'عدد اعشاری', db: 'amount', dbType: 'DECIMAL(10,2)' },
                { excel: 'وضعیت', excelType: 'متن', db: 'status', dbType: 'VARCHAR(50)' }
            ];
            
            // افزودن ردیف‌های نگاشت به جدول
            DOM.fieldMappingBody.innerHTML = '';
            mappingData.forEach((mapping, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <div class="dm-excel-field">
                            <div class="dm-excel-field-name">${mapping.excel}</div>
                            <div class="dm-excel-field-type">${mapping.excelType}</div>
                        </div>
                    </td>
                    <td>
                        <div class="dm-db-field">
                            <input type="text" class="dm-db-field-input" value="${mapping.db}" placeholder="نام فیلد">
                            <div class="dm-db-field-type">
                                <select class="dm-db-field-type-select">
                                    <option value="INT" ${mapping.dbType === 'INT' ? 'selected' : ''}>INT</option>
                                    <option value="VARCHAR(255)" ${mapping.dbType === 'VARCHAR(255)' ? 'selected' : ''}>VARCHAR(255)</option>
                                    <option value="DATE" ${mapping.dbType === 'DATE' ? 'selected' : ''}>DATE</option>
                                    <option value="DECIMAL(10,2)" ${mapping.dbType === 'DECIMAL(10,2)' ? 'selected' : ''}>DECIMAL(10,2)</option>
                                    <option value="TEXT" ${mapping.dbType === 'TEXT' ? 'selected' : ''}>TEXT</option>
                                </select>
                            </div>
                        </div>
                    </td>
                    <td>
                        <button class="dm-action-btn edit" title="ویرایش">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                `;
                DOM.fieldMappingBody.appendChild(row);
            });
            
            // افزودن پیام هوش مصنوعی
            addChatMessage('من فیلدهای دیتابیس را بر اساس ستون‌های فایل اکسل پیشنهاد داده‌ام. نام‌های فیلدها به انگلیسی تبدیل شده‌اند و نوع داده مناسب برای هر ستون انتخاب شده است. آیا تغییراتی مد نظر دارید؟', 'ai', DOM.fieldChatMessages);
        }, 1500);
    }
    
    /**
     * شبیه‌سازی تولید کوئری SQL
     */
    function simulateSQLGeneration() {
        setTimeout(() => {
            // شبیه‌سازی کوئری SQL
            const sql = `CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    date DATE,
    amount DECIMAL(10,2),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;
            
            DOM.sqlQueryPreview.textContent = sql;
            sqlQuery = sql;
        }, 1500);
    }
    
    /**
     * شبیه‌سازی اجرای کوئری SQL
     */
    function simulateSQLExecution() {
        setTimeout(() => {
            // شبیه‌سازی نتیجه اجرا
            const result = `
                <div class="dm-alert success">
                    <div class="dm-alert-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="dm-alert-content">
                        <h5 class="dm-alert-title">کوئری با موفقیت اجرا شد</h5>
                        <p class="dm-alert-message">
                            جدول <strong>users</strong> با موفقیت در دیتابیس ایجاد شد.
                        </p>
                    </div>
                </div>
                
                <div class="dm-sql-execution-details">
                    <div class="dm-execution-time">
                        <strong>زمان اجرا:</strong> 0.024 ثانیه
                    </div>
                    <div class="dm-execution-message">
                        <strong>پیام سرور:</strong> Query OK, 0 rows affected
                    </div>
                </div>
            `;
            
            DOM.sqlExecutionResult.innerHTML = result;
        }, 2000);
    }
    
    /**
     * شبیه‌سازی ورود داده‌ها
     */
    function simulateDataImport() {
        // تنظیم تعداد کل سطرها
        totalRows = 100;
        processedRows = 0;
        
        // به‌روزرسانی اطلاعات
        DOM.totalRowsCount.textContent = totalRows.toString();
        DOM.totalColsCount.textContent = '5';
        DOM.dataSize.textContent = '24.5 KB';
        
        // تنظیم زمان شروع
        importStartTime = Date.now();
        
        // تنظیم تایمر برای به‌روزرسانی زمان
        if (importTimer) clearInterval(importTimer);
        importTimer = setInterval(updateImportTimer, 1000);
        
        // غیرفعال کردن دکمه لغو
        DOM.cancelImport.disabled = false;
        
        // اضافه کردن لاگ‌های اولیه
        addImportLog('آماده شروع ورود داده‌ها...');
        addImportLog('اتصال به دیتابیس برقرار شد.');
        addImportLog('شروع واردسازی داده‌ها...');
        
        // شبیه‌سازی پیشرفت
        let progress = 0;
        const interval = setInterval(() => {
            progress += 1;
            processedRows = Math.floor((progress / 100) * totalRows);
            
            // به‌روزرسانی نوار پیشرفت
            DOM.importProgressBar.style.width = `${progress}%`;
            DOM.importProgressText.textContent = `${progress}%`;
            DOM.processedRecords.textContent = `${processedRows} / ${totalRows} رکورد`;
            
            // اضافه کردن لاگ‌ها
            if (progress === 25) {
                addImportLog('25% از داده‌ها وارد شد.');
            } else if (progress === 50) {
                addImportLog('50% از داده‌ها وارد شد.');
            } else if (progress === 75) {
                addImportLog('75% از داده‌ها وارد شد.');
            }
            
            // پایان واردسازی
            if (progress >= 100) {
                clearInterval(interval);
                DOM.importProgressBar.style.width = '100%';
                DOM.importProgressText.textContent = '100%';
                DOM.processedRecords.textContent = `${totalRows} / ${totalRows} رکورد`;
                
                // اضافه کردن لاگ پایان
                addImportLog('100% از داده‌ها با موفقیت وارد شد.');
                addImportLog('عملیات واردسازی با موفقیت به پایان رسید.');
                
                // فعال کردن دکمه مرحله بعد
                DOM.nextStep10.disabled = false;
                
                // غیرفعال کردن دکمه لغو
                DOM.cancelImport.disabled = true;
            }
        }, 100);
    }
    
    /**
     * شبیه‌سازی نتیجه ورود داده‌ها
     */
    function simulateImportResult() {
        // محاسبه زمان سپری شده
        const elapsedTime = Math.floor((Date.now() - importStartTime) / 1000);
        const formattedTime = formatTime(elapsedTime);
        
        // شبیه‌سازی نتیجه
        const result = `
            <div class="dm-alert success">
                <div class="dm-alert-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="dm-alert-content">
                    <h5 class="dm-alert-title">ورود داده‌ها با موفقیت انجام شد</h5>
                    <p class="dm-alert-message">
                        تمام ${totalRows} رکورد با موفقیت به دیتابیس وارد شد.
                    </p>
                </div>
            </div>
            
            <div class="dm-import-stats">
                <div class="dm-stats">
                    <div class="dm-stat-card">
                        <div class="dm-stat-content">
                            <div class="dm-stat-info">
                                <h3>${totalRows}</h3>
                                <p>تعداد کل رکوردها</p>
                            </div>
                            <div class="dm-stat-icon success">
                                <i class="fas fa-database"></i>
                            </div>
                        </div>
                    </div>
                    
                    <div class="dm-stat-card">
                        <div class="dm-stat-content">
                            <div class="dm-stat-info">
                                <h3>5</h3>
                                <p>تعداد فیلدها</p>
                            </div>
                            <div class="dm-stat-icon primary">
                                <i class="fas fa-columns"></i>
                            </div>
                        </div>
                    </div>
                    
                    <div class="dm-stat-card">
                        <div class="dm-stat-content">
                            <div class="dm-stat-info">
                                <h3>${formattedTime}</h3>
                                <p>زمان کل</p>
                            </div>
                            <div class="dm-stat-icon secondary">
                                <i class="fas fa-clock"></i>
                            </div>
                        </div>
                    </div>
                    
                    <div class="dm-stat-card">
                        <div class="dm-stat-content">
                            <div class="dm-stat-info">
                                <h3>0</h3>
                                <p>خطاها</p>
                            </div>
                            <div class="dm-stat-icon success">
                                <i class="fas fa-check-circle"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        DOM.importResultSummary.innerHTML = result;
        
        // ذخیره اطلاعات برای مرحله پایانی
        DOM.completionTableName.textContent = 'users';
        DOM.completionRecordCount.textContent = totalRows.toString();
        DOM.completionFieldCount.textContent = '5';
        DOM.completionDuration.textContent = formattedTime;
    }
    
    /**
     * شبیه‌سازی شناسایی فایل
     * @param {File} file فایل انتخاب شده
     */
    function simulateFileIdentification(file) {
        // نمایش اطلاعات فایل
        DOM.fileName.textContent = file.name;
        DOM.fileSize.textContent = formatFileSize(file.size);
        DOM.fileSheets.textContent = '1 شیت';
        DOM.fileRows.textContent = '100 سطر';
        DOM.fileCols.textContent = '5 ستون';
        
        // شبیه‌سازی ساختار فایل
        const sheetStructure = `
            <div class="dm-sheet-preview">
                <div class="dm-sheet-header">
                    <h6>پیش‌نمایش ساختار</h6>
                </div>
                <div class="dm-sheet-columns">
                    <div class="dm-sheet-column">
                        <div class="dm-column-name">شناسه</div>
                        <div class="dm-column-type">عدد صحیح</div>
                        <div class="dm-column-sample">1, 2, 3, ...</div>
                    </div>
                    <div class="dm-sheet-column">
                        <div class="dm-column-name">نام</div>
                        <div class="dm-column-type">متن</div>
                        <div class="dm-column-sample">محمد، علی، رضا، ...</div>
                    </div>
                    <div class="dm-sheet-column">
                        <div class="dm-column-name">تاریخ</div>
                        <div class="dm-column-type">تاریخ</div>
                        <div class="dm-column-sample">1402/01/01, ...</div>
                    </div>
                    <div class="dm-sheet-column">
                        <div class="dm-column-name">مقدار</div>
                        <div class="dm-column-type">عدد اعشاری</div>
                        <div class="dm-column-sample">10.5, 20.75, ...</div>
                    </div>
                    <div class="dm-sheet-column">
                        <div class="dm-column-name">وضعیت</div>
                        <div class="dm-column-type">متن</div>
                        <div class="dm-column-sample">فعال، غیرفعال، ...</div>
                    </div>
                </div>
            </div>
        `;
        
        DOM.fileStructurePreview.innerHTML = sheetStructure;
        
        // اضافه کردن گزینه‌های انتخاب شیت
        DOM.sheetSelector.innerHTML = '<option value="Sheet1">Sheet1 (پیش‌فرض)</option>';
    }
    
    /**
     * تنظیم رویدادها
     */
    function setupEventListeners() {
        // تب‌ها
        DOM.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                showTab(tab.dataset.tab);
            });
        });
        
        // شروع پروژه جدید
        DOM.startNewProject.addEventListener('click', () => {
            projectName = DOM.projectNameInput.value || 'پروژه جدید';
            showTab('import-wizard');
            showStep(1);
            DOM.activeProjectBadge.classList.remove('hidden');
        });
        
        // بازگشت به داشبورد
        DOM.backToDashboard.addEventListener('click', () => {
            showTab('dashboard');
        });
        
        // بازگشت به داشبورد از مرحله آخر
        DOM.backToDashboardFinal.addEventListener('click', () => {
            showTab('dashboard');
            DOM.activeProjectBadge.classList.add('hidden');
        });
        
        // مرحله 1: انتخاب فایل اکسل
        DOM.excelFile.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                fileData = file;
                
                // نمایش اطلاعات فایل
                DOM.excelFileInfo.innerHTML = `
                    <div class="dm-file-name">
                        <i class="fas fa-check-circle"></i>
                        ${file.name}
                    </div>
                    <div class="dm-file-meta">
                        <div class="dm-file-meta-item">
                            <i class="fas fa-weight"></i>
                            ${formatFileSize(file.size)}
                        </div>
                        <div class="dm-file-meta-item">
                            <i class="fas fa-file-excel"></i>
                            فایل اکسل
                        </div>
                    </div>
                `;
                DOM.excelFileInfo.classList.add('active');
                DOM.excelDropArea.classList.add('active');
                
                // فعال کردن دکمه مرحله بعد
                DOM.nextStep1.disabled = false;
                
                // شبیه‌سازی شناسایی فایل
                simulateFileIdentification(file);
            }
        });
        
        // ناحیه رها کردن فایل
        DOM.excelDropArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            DOM.excelDropArea.classList.add('active');
        });
        
        DOM.excelDropArea.addEventListener('dragleave', () => {
            if (!fileData) {
                DOM.excelDropArea.classList.remove('active');
            }
        });
        
        DOM.excelDropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            
            if (e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0];
                fileData = file;
                DOM.excelFile.files = e.dataTransfer.files;
                
                // نمایش اطلاعات فایل
                DOM.excelFileInfo.innerHTML = `
                    <div class="dm-file-name">
                        <i class="fas fa-check-circle"></i>
                        ${file.name}
                    </div>
                    <div class="dm-file-meta">
                        <div class="dm-file-meta-item">
                            <i class="fas fa-weight"></i>
                            ${formatFileSize(file.size)}
                        </div>
                        <div class="dm-file-meta-item">
                            <i class="fas fa-file-excel"></i>
                            فایل اکسل
                        </div>
                    </div>
                `;
                DOM.excelFileInfo.classList.add('active');
                
                // فعال کردن دکمه مرحله بعد
                DOM.nextStep1.disabled = false;
                
                // شبیه‌سازی شناسایی فایل
                simulateFileIdentification(file);
            }
        });
        
        // دکمه‌های مراحل
        DOM.nextStep1.addEventListener('click', () => {
            goToNextStep();
        });
        
        DOM.prevStep2.addEventListener('click', () => {
            goToPrevStep();
        });
        
        DOM.nextStep2.addEventListener('click', () => {
            goToNextStep();
        });
        
        DOM.prevStep3.addEventListener('click', () => {
            goToPrevStep();
        });
        
        DOM.startProcessing.addEventListener('click', () => {
            goToNextStep();
            simulateFileAnalysis();
        });
        
        DOM.prevStep4.addEventListener('click', () => {
            goToPrevStep();
        });
        
        DOM.nextStep4.addEventListener('click', () => {
            goToNextStep();
            simulateAIMessage();
        });
        
        DOM.prevStep5.addEventListener('click', () => {
            goToPrevStep();
        });
        
        DOM.nextStep5.addEventListener('click', () => {
            goToNextStep();
            simulateFieldMapping();
        });
        
        DOM.prevStep6.addEventListener('click', () => {
            goToPrevStep();
        });
        
        DOM.nextStep6.addEventListener('click', () => {
            goToNextStep();
            simulateSQLGeneration();
        });
        
        DOM.prevStep7.addEventListener('click', () => {
            goToPrevStep();
        });
        
        DOM.executeSql.addEventListener('click', () => {
            goToNextStep();
            simulateSQLExecution();
        });
        
        DOM.prevStep8.addEventListener('click', () => {
            goToPrevStep();
        });
        
        DOM.nextStep8.addEventListener('click', () => {
            goToNextStep();
        });
        
        DOM.prevStep9.addEventListener('click', () => {
            goToPrevStep();
        });
        
        DOM.startDataImport.addEventListener('click', () => {
            goToNextStep();
            simulateDataImport();
        });
        
        DOM.nextStep10.addEventListener('click', () => {
            goToNextStep();
            simulateImportResult();
            
            // توقف تایمر
            if (importTimer) {
                clearInterval(importTimer);
                importTimer = null;
            }
        });
        
        DOM.prevStep11.addEventListener('click', () => {
            goToPrevStep();
        });
        
        DOM.nextStep11.addEventListener('click', () => {
            goToNextStep();
        });
        
        // ارسال پیام در چت
        DOM.aiChatSend.addEventListener('click', () => {
            const message = DOM.aiChatInput.value.trim();
            if (message) {
                addChatMessage(message, 'user', DOM.aiChatMessages);
                DOM.aiChatInput.value = '';
                
                // شبیه‌سازی پاسخ هوش مصنوعی
                setTimeout(() => {
                    addChatMessage('من متوجه شدم. با توجه به درخواست شما، پیشنهاد می‌کنم این تغییرات را اعمال کنیم. آیا تغییرات دیگری مد نظر دارید؟', 'ai', DOM.aiChatMessages);
                }, 1000);
            }
        });
        
        DOM.aiChatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                DOM.aiChatSend.click();
            }
        });
        
        DOM.fieldChatSend.addEventListener('click', () => {
            const message = DOM.fieldChatInput.value.trim();
            if (message) {
                addChatMessage(message, 'user', DOM.fieldChatMessages);
                DOM.fieldChatInput.value = '';
                
                // شبیه‌سازی پاسخ هوش مصنوعی
                setTimeout(() => {
                    addChatMessage('من تغییرات را اعمال کردم. نگاشت فیلدها به‌روزرسانی شده است. آیا تغییرات دیگری مد نظر دارید؟', 'ai', DOM.fieldChatMessages);
                }, 1000);
            }
        });
        
        DOM.fieldChatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                DOM.fieldChatSend.click();
            }
        });
    }
    
    /**
     * راه‌اندازی کامپوننت
     */
    function init() {
        setupEventListeners();
        showTab('dashboard');
    }
    
    // API عمومی
    return {
        init: init
    };
})();

// راه‌اندازی ماژول هنگام بارگذاری صفحه
document.addEventListener('DOMContentLoaded', function() {
    ExcelToSQLTimeline.init();
});
