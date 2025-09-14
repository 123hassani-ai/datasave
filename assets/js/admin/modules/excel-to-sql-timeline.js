/**
 * Excel to SQL Timeline Module
 * ماژول تایم‌لاین حرفه‌ای تبدیل اکسل به SQL
 * Version: 2.0.0
 */

class ExcelToSQLTimeline {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 12;
        this.fileData = null;
        this.projectData = null;
        this.chatHistory = [];
        this.fieldMapping = [];
        this.sqlQuery = '';
        this.importProgress = 0;
        this.importTimer = null;
        
        this.init();
    }
    
    /**
     * مقداردهی اولیه
     */
    init() {
        this.bindEvents();
        this.initializeTimeline();
        this.setupDropZone();
        this.loadChatEngine();
    }
    
    /**
     * اتصال رویدادها
     */
    bindEvents() {
        // تب‌ها
        document.querySelectorAll('.timeline-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
        
        // دکمه شروع پروژه جدید
        const startBtn = document.getElementById('start-new-project');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startNewProject());
        }
        
        // دکمه برگشت به داشبورد
        document.querySelectorAll('[id^="back-to-dashboard"]').forEach(btn => {
            btn.addEventListener('click', () => this.backToDashboard());
        });
        
        // انتخاب فایل
        const fileInput = document.getElementById('excel-file');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }
        
        // دکمه‌های Next در هر مرحله
        for (let i = 1; i <= this.totalSteps; i++) {
            const nextBtn = document.getElementById(`next-step-${i}`);
            if (nextBtn) {
                nextBtn.addEventListener('click', () => this.nextStep());
            }
        }
        
        // دکمه‌های اختصاصی
        this.bindSpecialButtons();
    }
    
    /**
     * اتصال دکمه‌های اختصاصی
     */
    bindSpecialButtons() {
        // شروع پردازش
        const startProcessBtn = document.getElementById('start-processing');
        if (startProcessBtn) {
            startProcessBtn.addEventListener('click', () => this.startProcessing());
        }
        
        // تایید schema
        const confirmSchemaBtn = document.getElementById('confirm-schema');
        if (confirmSchemaBtn) {
            confirmSchemaBtn.addEventListener('click', () => this.confirmSchema());
        }
        
        // اجرای SQL
        const executeSQLBtn = document.getElementById('execute-sql');
        if (executeSQLBtn) {
            executeSQLBtn.addEventListener('click', () => this.executeSQL());
        }
        
        // شروع import
        const startImportBtn = document.getElementById('start-import');
        if (startImportBtn) {
            startImportBtn.addEventListener('click', () => this.startDataImport());
        }
        
        // ارسال پیام چت
        const sendChatBtn = document.getElementById('send-chat-message');
        if (sendChatBtn) {
            sendChatBtn.addEventListener('click', () => this.sendChatMessage());
        }
        
        // Enter در چت
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendChatMessage();
                }
            });
        }
    }
    
    /**
     * مقداردهی تایم‌لاین
     */
    initializeTimeline() {
        this.updateTimelineProgress(1);
        this.setStepStatus(1, 'active');
    }
    
    /**
     * تنظیم Drop Zone برای آپلود فایل
     */
    setupDropZone() {
        const dropArea = document.getElementById('excel-drop-area');
        if (!dropArea) return;
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, this.preventDefaults, false);
        });
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => {
                dropArea.classList.add('dm-file-drop-active');
            }, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => {
                dropArea.classList.remove('dm-file-drop-active');
            }, false);
        });
        
        dropArea.addEventListener('drop', (e) => this.handleFileDrop(e), false);
        dropArea.addEventListener('click', () => {
            document.getElementById('excel-file').click();
        });
    }
    
    /**
     * جلوگیری از رویدادهای پیش‌فرض
     */
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    /**
     * تعویض تب
     */
    switchTab(tabName) {
        // فعال‌سازی تب
        document.querySelectorAll('.timeline-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // نمایش محتوا
        document.querySelectorAll('.timeline-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        if (tabName === 'new-project') {
            this.resetTimeline();
        }
    }
    
    /**
     * شروع پروژه جدید
     */
    startNewProject() {
        this.switchTab('new-project');
        this.resetTimeline();
        this.currentStep = 1;
        this.updateTimelineProgress(1);
        
        // پاک کردن داده‌های قبلی
        this.fileData = null;
        this.projectData = null;
        this.chatHistory = [];
        this.fieldMapping = [];
        this.sqlQuery = '';
        
        Logger.info('شروع پروژه جدید', { step: 1 });
    }
    
    /**
     * ریست کردن تایم‌لاین
     */
    resetTimeline() {
        // ریست همه مراحل
        for (let i = 1; i <= this.totalSteps; i++) {
            this.setStepStatus(i, 'pending');
            this.hideStep(i);
        }
        
        // نمایش مرحله اول
        this.showStep(1);
        this.setStepStatus(1, 'active');
        this.updateTimelineProgress(1);
    }
    
    /**
     * بازگشت به داشبورد
     */
    backToDashboard() {
        this.switchTab('dashboard');
        this.currentStep = 1;
        
        // بارگذاری مجدد آمار
        if (window.dataManagement) {
            window.dataManagement.loadStats();
        }
    }
    
    /**
     * مدیریت انتخاب فایل
     */
    handleFileSelect(event) {
        const file = event.target.files[0];
        this.processSelectedFile(file);
    }
    
    /**
     * مدیریت drop فایل
     */
    handleFileDrop(event) {
        const dt = event.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            this.processSelectedFile(files[0]);
        }
    }
    
    /**
     * پردازش فایل انتخاب شده
     */
    async processSelectedFile(file) {
        if (!file) {
            this.showError('لطفا فایل Excel را انتخاب کنید.');
            return;
        }
        
        // بررسی نوع فایل
        const allowedTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ];
        
        if (!allowedTypes.includes(file.type)) {
            this.showError('لطفا فقط فایل‌های Excel (.xlsx, .xls) انتخاب کنید.');
            return;
        }
        
        // بررسی اندازه فایل (حداکثر 50MB)
        if (file.size > 50 * 1024 * 1024) {
            this.showError('حجم فایل نباید بیشتر از 50 مگابایت باشد.');
            return;
        }
        
        this.fileData = file;
        this.displayFileInfo(file);
        this.enableNextButton(1);
        
        Logger.info('فایل Excel انتخاب شد', { 
            fileName: file.name, 
            fileSize: file.size,
            fileType: file.type 
        });
    }
    
    /**
     * نمایش اطلاعات فایل
     */
    displayFileInfo(file) {
        const fileInfoElement = document.getElementById('excel-file-info');
        if (!fileInfoElement) return;
        
        const fileSize = this.formatFileSize(file.size);
        const fileIcon = this.getFileIcon(file.name);
        
        fileInfoElement.innerHTML = `
            <div class="dm-file-info-card">
                <div class="dm-file-icon">
                    <i class="${fileIcon}"></i>
                </div>
                <div class="dm-file-details">
                    <h4 class="dm-file-name">${file.name}</h4>
                    <p class="dm-file-size">حجم: ${fileSize}</p>
                    <p class="dm-file-type">نوع: فایل Excel</p>
                    <div class="dm-file-status">
                        <i class="fas fa-check-circle text-success"></i>
                        <span>فایل آماده برای پردازش</span>
                    </div>
                </div>
            </div>
        `;
        
        fileInfoElement.style.display = 'block';
    }
    
    /**
     * قالب‌بندی اندازه فایل
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 بایت';
        
        const k = 1024;
        const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    /**
     * دریافت آیکون فایل
     */
    getFileIcon(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        
        switch (extension) {
            case 'xlsx':
                return 'fas fa-file-excel text-success';
            case 'xls':
                return 'fas fa-file-excel text-warning';
            default:
                return 'fas fa-file text-secondary';
        }
    }
    
    /**
     * انتقال به مرحله بعد
     */
    async nextStep() {
        if (this.currentStep >= this.totalSteps) return;
        
        // اعتبارسنجی مرحله فعلی
        if (!await this.validateCurrentStep()) {
            return;
        }
        
        // تکمیل مرحله فعلی
        this.setStepStatus(this.currentStep, 'completed');
        this.hideStep(this.currentStep);
        
        // انتقال به مرحله بعد
        this.currentStep++;
        this.showStep(this.currentStep);
        this.setStepStatus(this.currentStep, 'active');
        this.updateTimelineProgress(this.currentStep);
        
        // عملیات مخصوص هر مرحله
        await this.handleStepTransition(this.currentStep);
        
        Logger.info('انتقال به مرحله بعد', { 
            currentStep: this.currentStep,
            totalSteps: this.totalSteps 
        });
    }
    
    /**
     * اعتبارسنجی مرحله فعلی
     */
    async validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return this.fileData !== null;
            case 2:
                return true; // مرحله شناسایی همیشه معتبر است
            case 3:
                return true; // تایید شروع پردازش
            case 4:
                return this.projectData && this.projectData.analysis;
            case 5:
                return this.projectData && this.projectData.aiSuggestion;
            case 6:
                return this.fieldMapping.length > 0;
            case 7:
                return this.sqlQuery.length > 0;
            case 8:
                return this.projectData && this.projectData.databaseCreated;
            case 9:
                return true; // تایید import
            case 10:
                return true; // در حال import
            case 11:
                return this.projectData && this.projectData.importCompleted;
            case 12:
                return true; // نتیجه نهایی
            default:
                return true;
        }
    }
    
    /**
     * مدیریت تغییر مرحله
     */
    async handleStepTransition(step) {
        switch (step) {
            case 2:
                await this.analyzeFile();
                break;
            case 3:
                this.showProcessingOptions();
                break;
            case 4:
                await this.performInitialAnalysis();
                break;
            case 5:
                await this.getAISuggestions();
                break;
            case 6:
                await this.generateFieldMapping();
                break;
            case 7:
                await this.generateSQLQuery();
                break;
            case 8:
                this.showSQLPreview();
                break;
            case 9:
                this.showImportConfirmation();
                break;
            case 10:
                // مرحله import که بصورت خودکار اداره می‌شود
                break;
            case 11:
                this.showImportResults();
                break;
            case 12:
                this.showFinalResults();
                break;
        }
    }
    
    /**
     * تحلیل فایل - مرحله 2
     */
    async analyzeFile() {
        if (!this.fileData) return;
        
        this.showLoading('در حال تحلیل فایل...');
        
        try {
            const formData = new FormData();
            formData.append('excel_file', this.fileData);
            
            const response = await fetch('/backend/api/v1/excel-processor.php?action=analyze', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.projectData = {
                    ...this.projectData,
                    analysis: result.data
                };
                
                this.displayAnalysisResults(result.data);
                this.enableNextButton(2);
            } else {
                this.showError('خطا در تحلیل فایل: ' + result.message);
            }
        } catch (error) {
            this.showError('خطا در ارتباط با سرور: ' + error.message);
            Logger.error('خطا در تحلیل فایل', error);
        } finally {
            this.hideLoading();
        }
    }
    
    /**
     * نمایش نتایج تحلیل
     */
    displayAnalysisResults(analysis) {
        // نمایش اطلاعات فایل
        const elements = {
            'file-name': this.fileData.name,
            'file-size': this.formatFileSize(this.fileData.size),
            'file-sheets': `${analysis.sheets} شیت`,
            'file-rows': `${analysis.totalRows.toLocaleString('fa-IR')} سطر`,
            'file-cols': `${analysis.totalColumns} ستون`
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
        
        // نمایش پیش‌نمایش ساختار
        this.displayStructurePreview(analysis);
    }
    
    /**
     * نمایش پیش‌نمایش ساختار
     */
    displayStructurePreview(analysis) {
        const previewContainer = document.getElementById('structure-preview');
        if (!previewContainer) return;
        
        let previewHTML = `
            <div class="dm-sheet-preview">
                <div class="dm-sheet-header">
                    <h6>پیش‌نمایش ساختار ${analysis.primarySheet}</h6>
                </div>
                <div class="dm-sheet-columns">
        `;
        
        analysis.columns.slice(0, 5).forEach((column, index) => {
            previewHTML += `
                <div class="dm-sheet-column">
                    <div class="dm-column-name">${column.name}</div>
                    <div class="dm-column-type">${this.translateDataType(column.type)}</div>
                    <div class="dm-column-sample">${column.sample || 'نمونه داده'}</div>
                </div>
            `;
        });
        
        if (analysis.columns.length > 5) {
            previewHTML += `
                <div class="dm-sheet-column dm-more-columns">
                    <div class="dm-column-name">...</div>
                    <div class="dm-column-info">+${analysis.columns.length - 5} ستون دیگر</div>
                </div>
            `;
        }
        
        previewHTML += `
                </div>
            </div>
        `;
        
        previewContainer.innerHTML = previewHTML;
    }
    
    /**
     * ترجمه نوع داده
     */
    translateDataType(type) {
        const typeMap = {
            'string': 'متن',
            'number': 'عدد',
            'date': 'تاریخ',
            'boolean': 'بولین',
            'mixed': 'مختلط'
        };
        
        return typeMap[type] || type;
    }
    
    /**
     * شروع پردازش - مرحله 3
     */
    startProcessing() {
        this.showStep(4);
        this.setStepStatus(4, 'active');
        this.currentStep = 4;
        this.updateTimelineProgress(4);
        
        // شروع تحلیل اولیه
        this.performInitialAnalysis();
    }
    
    /**
     * انجام تحلیل اولیه - مرحله 4
     */
    async performInitialAnalysis() {
        this.showLoading('در حال تحلیل محتوای فایل...');
        
        try {
            const response = await fetch('/backend/api/v1/excel-processor.php?action=detailed_analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    project_data: this.projectData
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.projectData = {
                    ...this.projectData,
                    detailedAnalysis: result.data
                };
                
                this.displayDetailedAnalysis(result.data);
                this.enableNextButton(4);
            } else {
                this.showError('خطا در تحلیل تفصیلی: ' + result.message);
            }
        } catch (error) {
            this.showError('خطا در ارتباط با سرور: ' + error.message);
            Logger.error('خطا در تحلیل تفصیلی', error);
        } finally {
            this.hideLoading();
        }
    }
    
    /**
     * نمایش تحلیل تفصیلی
     */
    displayDetailedAnalysis(analysis) {
        const summaryContainer = document.getElementById('analysis-summary');
        if (!summaryContainer) return;
        
        summaryContainer.innerHTML = `
            <div class="dm-analysis-summary">
                <div class="dm-analysis-stats">
                    <div class="stat-item">
                        <div class="stat-value">${analysis.totalRecords.toLocaleString('fa-IR')}</div>
                        <div class="stat-label">کل رکوردها</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${analysis.validRecords.toLocaleString('fa-IR')}</div>
                        <div class="stat-label">رکوردهای معتبر</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${analysis.emptyRecords.toLocaleString('fa-IR')}</div>
                        <div class="stat-label">رکوردهای خالی</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${analysis.duplicateRecords.toLocaleString('fa-IR')}</div>
                        <div class="stat-label">رکوردهای تکراری</div>
                    </div>
                </div>
                
                <div class="dm-analysis-insights">
                    <h5>نکات مهم:</h5>
                    <ul>
                        ${analysis.insights.map(insight => `<li>${insight}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
    
    /**
     * دریافت پیشنهادات AI - مرحله 5
     */
    async getAISuggestions() {
        this.showLoading('در حال دریافت پیشنهادات هوش مصنوعی...');
        
        try {
            const response = await fetch('/backend/api/v1/ai-integration.php?action=generate_suggestions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    project_data: this.projectData
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.projectData = {
                    ...this.projectData,
                    aiSuggestion: result.data
                };
                
                this.displayAISuggestions(result.data);
                this.initializeChat();
                this.enableNextButton(5);
            } else {
                this.showError('خطا در دریافت پیشنهادات AI: ' + result.message);
            }
        } catch (error) {
            this.showError('خطا در ارتباط با AI: ' + error.message);
            Logger.error('خطا در دریافت پیشنهادات AI', error);
        } finally {
            this.hideLoading();
        }
    }
    
    /**
     * نمایش پیشنهادات AI
     */
    displayAISuggestions(suggestions) {
        // نام پایگاه داده پیشنهادی
        const dbNameInput = document.getElementById('suggested-db-name');
        if (dbNameInput) {
            dbNameInput.value = suggestions.databaseName;
        }
        
        // توضیحات پایگاه داده
        const dbDescInput = document.getElementById('suggested-db-description');
        if (dbDescInput) {
            dbDescInput.value = suggestions.description;
        }
        
        // نمایش توضیحات AI
        const aiExplanation = document.getElementById('ai-explanation');
        if (aiExplanation) {
            aiExplanation.innerHTML = `
                <div class="dm-ai-message">
                    <div class="dm-ai-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="dm-ai-content">
                        <p>${suggestions.explanation}</p>
                        <div class="dm-ai-suggestions">
                            <strong>پیشنهادات:</strong>
                            <ul>
                                ${suggestions.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    /**
     * مقداردهی موتور چت
     */
    initializeChat() {
        const chatContainer = document.getElementById('ai-chat-container');
        if (!chatContainer) return;
        
        // پیام خوش‌آمدگویی
        this.addChatMessage('ai', 
            'سلام! من دستیار هوش مصنوعی شما هستم. برای بهبود ساختار پایگاه داده یا هر سؤال دیگری در خدمت شما هستم. 🤖'
        );
    }
    
    /**
     * ارسال پیام چت
     */
    async sendChatMessage() {
        const chatInput = document.getElementById('chat-input');
        if (!chatInput || !chatInput.value.trim()) return;
        
        const message = chatInput.value.trim();
        chatInput.value = '';
        
        // اضافه کردن پیام کاربر
        this.addChatMessage('user', message);
        
        // نمایش در حال تایپ
        this.showTypingIndicator();
        
        try {
            const response = await fetch('/backend/api/v1/ai-integration.php?action=chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    context: this.projectData,
                    chat_history: this.chatHistory
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.addChatMessage('ai', result.data.response);
                
                // اگر AI تغییراتی پیشنهاد داده، اعمال کن
                if (result.data.suggestions) {
                    this.applyAISuggestions(result.data.suggestions);
                }
            } else {
                this.addChatMessage('ai', 'متأسفانه خطایی رخ داد. لطفا دوباره تلاش کنید.');
            }
        } catch (error) {
            this.addChatMessage('ai', 'خطا در ارتباط با سرور. لطفا اتصال اینترنت خود را بررسی کنید.');
            Logger.error('خطا در چت با AI', error);
        } finally {
            this.hideTypingIndicator();
        }
    }
    
    /**
     * اضافه کردن پیام به چت
     */
    addChatMessage(sender, message) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `dm-chat-message ${sender}`;
        
        if (sender === 'ai') {
            messageDiv.innerHTML = `
                <div class="dm-message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="dm-message-content">
                    <div class="dm-message-bubble">${message}</div>
                    <div class="dm-message-time">${new Date().toLocaleTimeString('fa-IR')}</div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="dm-message-content">
                    <div class="dm-message-bubble">${message}</div>
                    <div class="dm-message-time">${new Date().toLocaleTimeString('fa-IR')}</div>
                </div>
                <div class="dm-message-avatar">
                    <i class="fas fa-user"></i>
                </div>
            `;
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // ذخیره در تاریخچه
        this.chatHistory.push({
            sender: sender,
            message: message,
            timestamp: new Date().toISOString()
        });
    }
    
    /**
     * نمایش شاخص در حال تایپ
     */
    showTypingIndicator() {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'dm-chat-message ai typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="dm-message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="dm-message-content">
                <div class="dm-message-bubble">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    /**
     * مخفی کردن شاخص در حال تایپ
     */
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    /**
     * بروزرسانی پیشرفت تایم‌لاین
     */
    updateTimelineProgress(step) {
        const progress = (step / this.totalSteps) * 100;
        const progressBar = document.querySelector('.dm-timeline-track-progress');
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        // بروزرسانی شماره مرحله
        const stepNumber = document.getElementById('current-step-number');
        if (stepNumber) {
            stepNumber.textContent = step;
        }
        
        const totalStepsElement = document.getElementById('total-steps-number');
        if (totalStepsElement) {
            totalStepsElement.textContent = this.totalSteps;
        }
    }
    
    /**
     * تنظیم وضعیت مرحله
     */
    setStepStatus(stepNumber, status) {
        const stepElement = document.querySelector(`.dm-timeline-step[data-step="${stepNumber}"]`);
        if (!stepElement) return;
        
        // پاک کردن کلاس‌های قبلی
        stepElement.classList.remove('pending', 'active', 'completed', 'failed');
        
        // اضافه کردن کلاس جدید
        stepElement.classList.add(status);
        
        // تغییر آیکون
        const icon = stepElement.querySelector('.dm-step-icon i');
        if (icon) {
            icon.className = this.getStepIcon(status);
        }
    }
    
    /**
     * دریافت آیکون مرحله
     */
    getStepIcon(status) {
        const icons = {
            'pending': 'fas fa-clock',
            'active': 'fas fa-play',
            'completed': 'fas fa-check',
            'failed': 'fas fa-times'
        };
        
        return icons[status] || 'fas fa-clock';
    }
    
    /**
     * نمایش مرحله
     */
    showStep(stepNumber) {
        const stepElement = document.getElementById(`step-${stepNumber}`);
        if (stepElement) {
            stepElement.style.display = 'block';
            stepElement.classList.add('animate-slide-up');
        }
    }
    
    /**
     * مخفی کردن مرحله
     */
    hideStep(stepNumber) {
        const stepElement = document.getElementById(`step-${stepNumber}`);
        if (stepElement) {
            stepElement.style.display = 'none';
            stepElement.classList.remove('animate-slide-up');
        }
    }
    
    /**
     * فعال کردن دکمه Next
     */
    enableNextButton(stepNumber) {
        const nextButton = document.getElementById(`next-step-${stepNumber}`);
        if (nextButton) {
            nextButton.disabled = false;
            nextButton.classList.remove('disabled');
        }
    }
    
    /**
     * غیرفعال کردن دکمه Next
     */
    disableNextButton(stepNumber) {
        const nextButton = document.getElementById(`next-step-${stepNumber}`);
        if (nextButton) {
            nextButton.disabled = true;
            nextButton.classList.add('disabled');
        }
    }
    
    /**
     * نمایش Loading
     */
    showLoading(message = 'در حال پردازش...') {
        const loadingElement = document.getElementById('timeline-loading');
        if (loadingElement) {
            loadingElement.innerHTML = `
                <div class="dm-loading-content">
                    <div class="dm-spinner"></div>
                    <p>${message}</p>
                </div>
            `;
            loadingElement.style.display = 'flex';
        }
    }
    
    /**
     * مخفی کردن Loading
     */
    hideLoading() {
        const loadingElement = document.getElementById('timeline-loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }
    
    /**
     * نمایش خطا
     */
    showError(message) {
        const errorElement = document.getElementById('timeline-error');
        if (errorElement) {
            errorElement.innerHTML = `
                <div class="dm-alert danger">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>${message}</span>
                </div>
            `;
            errorElement.style.display = 'block';
            
            // مخفی کردن خودکار بعد از 5 ثانیه
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 5000);
        }
    }
    
    /**
     * بارگذاری موتور چت
     */
    loadChatEngine() {
        // مقداردهی موتور چت در اینجا انجام می‌شود
        Logger.info('موتور چت بارگذاری شد');
    }
}

// ایجاد instance سراسری
let excelTimeline;

// مقداردهی بعد از بارگذاری DOM
document.addEventListener('DOMContentLoaded', function() {
    excelTimeline = new ExcelToSQLTimeline();
});

// Export برای استفاده در سایر ماژول‌ها
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExcelToSQLTimeline;
}