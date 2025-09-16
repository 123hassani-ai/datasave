/**
 * Data Management UI
 * رابط کاربری مدیریت داده‌ها
 * 
 * @description: مسئول مدیریت رابط کاربری، المنت‌های DOM و تعاملات کاربر
 * @version: 1.0.0
 * @author: DataSave Team
 */

'use strict';

import AIAssistant from './AIAssistant.js';

class DataManagementUI {
    constructor() {
        this.elements = {};
        this.isInitialized = false;
        
        // Event callbacks object
        this.callbacks = {};
        
        // Individual callbacks (for backward compatibility)
        this.onFileSelected = null;
        this.onFieldUpdate = null;
        this.onGenerateStructure = null;
        this.onTabSwitch = null;
        
        // Initialize AI Assistant
        this.aiAssistant = new AIAssistant();
    }
    
    /**
     * تنظیم callback ها
     */
    setCallbacks(callbacks = {}) {
        // Store callbacks object
        this.callbacks = { ...this.callbacks, ...callbacks };
        
        // Individual callbacks (for backward compatibility)
        this.onFileSelected = callbacks.onFileSelected || null;
        this.onFieldUpdate = callbacks.onFieldUpdate || null;
        this.onGenerateStructure = callbacks.onGenerateStructure || null;
        this.onTabSwitch = callbacks.onTabSwitch || null;
    }
    
    /**
     * بارگذاری محتوای ماژول
     */
    loadContent() {
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
        
        return content;
    }
    
    /**
     * مقداردهی اولیه UI
     */
    async init() {
        try {
            // جلوگیری از اجرای چندباره
            if (this.isInitialized) {
                console.log('⚠️ DataManagementUI already initialized');
                return;
            }
            
            this.cacheElements();
            this.bindEvents();
            this.setupDropZone();
            
            this.isInitialized = true;
            console.log('✅ Data Management UI initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing Data Management UI:', error);
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
        // پاک کردن event listener های قبلی برای جلوگیری از تکرار
        this.removeExistingEventListeners();
        
        // Upload button click
        if (this.elements.uploadButton) {
            this.uploadButtonHandler = this.debounce(() => {
                this.elements.fileInput?.click();
            }, 300);
            this.elements.uploadButton.addEventListener('click', this.uploadButtonHandler);
        }
        
        // File input change
        if (this.elements.fileInput) {
            this.fileInputHandler = this.debounce((e) => {
                const file = e.target.files[0];
                if (file && this.onFileSelected) {
                    // پاک کردن input بعد از انتخاب فایل
                    e.target.value = '';
                    this.onFileSelected(file);
                }
            }, 500);
            this.elements.fileInput.addEventListener('change', this.fileInputHandler);
        }
        
        // Database structure tabs
        this.documentClickHandler = (e) => {
            if (e.target.classList.contains('dm-code-tab')) {
                this.switchCodeTab(e.target.dataset.tab);
                if (this.onTabSwitch) {
                    this.onTabSwitch(e.target.dataset.tab);
                }
            }
        };
        document.addEventListener('click', this.documentClickHandler);
        
        // Regenerate structure button
        const regenerateBtn = document.getElementById('regenerateStructure');
        if (regenerateBtn) {
            this.regenerateHandler = () => {
                if (this.onGenerateStructure) {
                    this.onGenerateStructure();
                }
            };
            regenerateBtn.addEventListener('click', this.regenerateHandler);
        }
        
        // Generate database structure button
        const generateBtn = document.getElementById('generateDbStructure');
        if (generateBtn) {
            this.generateHandler = () => {
                // Show table configuration panel instead of direct generation
                if (this.callbacks && this.callbacks.onShowTableConfig) {
                    this.callbacks.onShowTableConfig();
                }
            };
            generateBtn.addEventListener('click', this.generateHandler);
        }
        
        // Select all fields button
        const selectAllBtn = document.getElementById('selectAllFields');
        if (selectAllBtn) {
            this.selectAllHandler = () => {
                this.selectAllFields();
            };
            selectAllBtn.addEventListener('click', this.selectAllHandler);
        }
        
        // Deselect all fields button
        const deselectAllBtn = document.getElementById('deselectAllFields');
        if (deselectAllBtn) {
            this.deselectAllHandler = () => {
                this.deselectAllFields();
            };
            deselectAllBtn.addEventListener('click', this.deselectAllHandler);
        }
        
        // Create table and import button
        const createTableBtn = document.getElementById('createTableAndImport');
        if (createTableBtn) {
            this.createTableHandler = async () => {
                await this.handleCreateTableAndImport();
            };
            createTableBtn.addEventListener('click', this.createTableHandler);
        }
    }
    
    /**
     * حذف event listener های قبلی
     */
    removeExistingEventListeners() {
        // Remove upload button listener
        if (this.elements.uploadButton && this.uploadButtonHandler) {
            this.elements.uploadButton.removeEventListener('click', this.uploadButtonHandler);
        }
        
        // Remove file input listener
        if (this.elements.fileInput && this.fileInputHandler) {
            this.elements.fileInput.removeEventListener('change', this.fileInputHandler);
        }
        
        // Remove document listener
        if (this.documentClickHandler) {
            document.removeEventListener('click', this.documentClickHandler);
        }
        
        // Remove other button listeners
        const regenerateBtn = document.getElementById('regenerateStructure');
        if (regenerateBtn && this.regenerateHandler) {
            regenerateBtn.removeEventListener('click', this.regenerateHandler);
        }
        
        const generateBtn = document.getElementById('generateDbStructure');
        if (generateBtn && this.generateHandler) {
            generateBtn.removeEventListener('click', this.generateHandler);
        }
        
        const selectAllBtn = document.getElementById('selectAllFields');
        if (selectAllBtn && this.selectAllHandler) {
            selectAllBtn.removeEventListener('click', this.selectAllHandler);
        }
        
        const deselectAllBtn = document.getElementById('deselectAllFields');
        if (deselectAllBtn && this.deselectAllHandler) {
            deselectAllBtn.removeEventListener('click', this.deselectAllHandler);
        }
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
            if (files.length > 0 && this.onFileSelected) {
                this.onFileSelected(files[0]);
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
     * نمایش نوار پیشرفت
     */
    showProgress(label, percent = 0) {
        const progressContainer = this.elements.progressContainer;
        const progressLabel = this.elements.progressLabel;
        const progressPercent = this.elements.progressPercent;
        
        if (progressContainer && progressLabel && progressPercent) {
            progressLabel.textContent = label;
            progressPercent.textContent = percent + '%';
            progressContainer.style.display = 'block';
            this.updateProgress(percent);
        }
    }
    
    /**
     * بروزرسانی نوار پیشرفت
     */
    updateProgress(percent, label = null) {
        const progressFill = this.elements.progressFill;
        const progressPercent = this.elements.progressPercent;
        const progressLabel = this.elements.progressLabel;
        
        if (progressFill && progressPercent) {
            progressFill.style.width = percent + '%';
            progressPercent.textContent = percent + '%';
            
            if (label && progressLabel) {
                progressLabel.textContent = label;
            }
        }
    }
    
    /**
     * مخفی کردن نوار پیشرفت
     */
    hideProgress() {
        const progressContainer = this.elements.progressContainer;
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }
    }
    
    /**
     * نمایش اطلاعات فایل
     */
    displayFileInfo(file, analysis) {
        console.log('🔍 displayFileInfo called with:', { file: file?.name, analysis });
        
        const fileInfo = this.elements.fileInfo;
        const fileName = this.elements.fileName;
        const fileDetails = this.elements.fileDetails;
        const fileStats = this.elements.fileStats;
        
        console.log('📋 Elements found:', {
            fileInfo: !!fileInfo,
            fileName: !!fileName,
            fileDetails: !!fileDetails,
            fileStats: !!fileStats
        });
        
        if (!fileInfo || !fileName || !fileDetails || !fileStats) {
            console.error('❌ Required elements not found for displayFileInfo');
            // Try to cache elements again
            this.cacheElements();
            return;
        }
        
        // Update file name and details
        fileName.textContent = file.name;
        fileDetails.textContent = `${this.formatFileSize(file.size)} • ${analysis.totalRows.toLocaleString('fa-IR')} ردیف • ${analysis.totalColumns} ستون`;
        
        // Create stats
        const stats = [
            { label: 'تعداد ردیف', value: analysis.totalRows.toLocaleString('fa-IR') },
            { label: 'تعداد ستون', value: analysis.totalColumns },
            { label: 'کیفیت داده', value: analysis.analysis?.dataQuality || 'خوب' },
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
        
        console.log('✅ File info displayed successfully');
    }
    
    /**
     * نمایش پیش‌نمایش جدول
     */
    /**
     * نمایش پیش‌نمایش جدول
     */
    displayTablePreview(preview) {
        console.log('📊 displayTablePreview called with:', preview?.length, 'rows');
        
        const tablePreview = this.elements.tablePreview;
        const dataTable = this.elements.dataTable;
        
        console.log('📋 Table elements found:', {
            tablePreview: !!tablePreview,
            dataTable: !!dataTable
        });
        
        if (!tablePreview || !dataTable || !preview || preview.length === 0) {
            console.error('❌ Required elements or data not found for table preview');
            return;
        }
        
        // Create table HTML
        const [headers, ...rows] = preview;
        
        let tableHTML = '<thead><tr>';
        headers.forEach(header => {
            tableHTML += `<th>${header}</th>`;
        });
        tableHTML += '</tr></thead><tbody>';
        
        rows.forEach(row => {
            tableHTML += '<tr>';
            row.forEach(cell => {
                tableHTML += `<td>${cell}</td>`;
            });
            tableHTML += '</tr>';
        });
        tableHTML += '</tbody>';
        
        dataTable.innerHTML = tableHTML;
        
        // Show table preview with animation
        tablePreview.style.display = 'block';
        setTimeout(() => {
            tablePreview.classList.add('show');
        }, 200);
        
        console.log('✅ Table preview displayed successfully');
    }
    
    /**
     * نمایش پیش‌نمایش ساختار دیتابیس
     */
    showDatabasePreview() {
        console.log('🔄 Attempting to show database preview...');
        
        // First try cached element
        let databasePreview = this.elements.databasePreview;
        
        // If not found, try to find it again
        if (!databasePreview) {
            console.log('🔍 Database preview element not cached, searching...');
            databasePreview = document.getElementById('databasePreview');
            
            // Update cache
            if (databasePreview) {
                this.elements.databasePreview = databasePreview;
                console.log('✅ Database preview element found and cached');
            }
        }
        
        console.log('📋 Database preview element:', databasePreview);
        
        if (databasePreview) {
            console.log('✅ Database preview element found, showing...');
            console.log('📊 Database preview innerHTML:', databasePreview.innerHTML.substring(0, 200) + '...');
            console.log('📊 Database preview style:', window.getComputedStyle(databasePreview).display);
            
            databasePreview.style.display = 'block';
            setTimeout(() => {
                databasePreview.classList.add('show');
                databasePreview.classList.add('dm-fade-in'); // اضافه شده
                console.log('✅ Database preview shown with animation');
                console.log('📊 Final classes:', databasePreview.className);
                console.log('📊 Final computed opacity:', window.getComputedStyle(databasePreview).opacity);
            }, 300);
        } else {
            console.error('❌ Database preview element not found in DOM');
            console.log('🔍 Available elements in container:', document.querySelectorAll('.dm-container *[id]'));
        }
    }
    
    /**
     * تعویض تب کد
     */
    switchCodeTab(tabName) {
        // Remove active class from all tabs and panels
        document.querySelectorAll('.dm-code-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.dm-code-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        // Add active class to selected tab and panel
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
        document.getElementById(`${tabName}Panel`)?.classList.add('active');
    }
    
    /**
     * تولید پنل انتخاب فیلدها
     */
    generateFieldSelection(structure) {
        const fieldsContainer = document.getElementById('fieldsContainer');
        if (!fieldsContainer || !structure.fields) return;
        
        let fieldsHTML = `
            <div class="dm-fields-header">
                <h4>انتخاب و تنظیم فیلدها</h4>
                <p>فیلدهای مورد نظر خود را انتخاب کرده و تنظیمات آنها را ویرایش کنید</p>
            </div>
        `;
        
        structure.fields.forEach((field, index) => {
            fieldsHTML += `
                <div class="dm-field-item" data-index="${index}">
                    <div class="dm-field-checkbox">
                        <input type="checkbox" id="field_${index}" ${field.selected !== false ? 'checked' : ''} 
                               onchange="window.dataManagement.updateField(${index}, 'selected', this.checked)">
                        <label for="field_${index}"></label>
                    </div>
                    
                    <div class="dm-field-info">
                        <div class="dm-field-name">
                            <label>نام فارسی:</label>
                            <input type="text" value="${field.name}" 
                                   onchange="window.dataManagement.updateField(${index}, 'name', this.value)">
                        </div>
                        
                        <div class="dm-field-sql">
                            <label>نام SQL:</label>
                            <input type="text" value="${field.sqlName}" 
                                   onchange="window.dataManagement.updateField(${index}, 'sqlName', this.value)">
                        </div>
                        
                        <div class="dm-field-type">
                            <label>نوع داده:</label>
                            <select onchange="window.dataManagement.updateField(${index}, 'type', this.value)">
                                <option value="VARCHAR" ${field.type === 'VARCHAR' ? 'selected' : ''}>VARCHAR</option>
                                <option value="INT" ${field.type === 'INT' ? 'selected' : ''}>INT</option>
                                <option value="DECIMAL" ${field.type === 'DECIMAL' ? 'selected' : ''}>DECIMAL</option>
                                <option value="DATE" ${field.type === 'DATE' ? 'selected' : ''}>DATE</option>
                                <option value="DATETIME" ${field.type === 'DATETIME' ? 'selected' : ''}>DATETIME</option>
                                <option value="TEXT" ${field.type === 'TEXT' ? 'selected' : ''}>TEXT</option>
                                <option value="ENUM" ${field.type === 'ENUM' ? 'selected' : ''}>ENUM</option>
                            </select>
                        </div>
                        
                        <div class="dm-field-length">
                            <label>طول:</label>
                            <input type="text" value="${field.length || ''}" 
                                   onchange="window.dataManagement.updateField(${index}, 'length', this.value)">
                        </div>
                        
                        <div class="dm-field-nullable">
                            <input type="checkbox" id="nullable_${index}" ${field.nullable ? 'checked' : ''} 
                                   onchange="window.dataManagement.updateField(${index}, 'nullable', this.checked)">
                            <label for="nullable_${index}">NULL مجاز</label>
                        </div>
                    </div>
                </div>
            `;
        });
        
        fieldsContainer.innerHTML = fieldsHTML;
    }
    
    /**
     * انتخاب همه فیلدها
     */
    selectAllFields() {
        document.querySelectorAll('.dm-field-item input[type="checkbox"]').forEach(checkbox => {
            if (checkbox.id.startsWith('field_')) {
                checkbox.checked = true;
                checkbox.dispatchEvent(new Event('change'));
            }
        });
    }
    
    /**
     * عدم انتخاب همه فیلدها
     */
    deselectAllFields() {
        document.querySelectorAll('.dm-field-item input[type="checkbox"]').forEach(checkbox => {
            if (checkbox.id.startsWith('field_')) {
                checkbox.checked = false;
                checkbox.dispatchEvent(new Event('change'));
            }
        });
    }
    
    /**
     * نمایش کد SQL
     */
    displaySQLCode(sqlCode) {
        const sqlCodeElement = document.getElementById('sqlCode');
        if (sqlCodeElement) {
            sqlCodeElement.textContent = sqlCode;
            
            // Show database preview panel if not visible
            const databasePreview = document.getElementById('databasePreview');
            if (databasePreview && databasePreview.style.display === 'none') {
                this.showDatabasePreview();
            }
            
            // Auto-switch to SQL tab
            this.switchCodeTab('sql');
            
            console.log('✅ SQL code displayed successfully');
        } else {
            console.warn('⚠️ SQL code element not found');
        }
    }
    
    /**
     * نمایش کد SQL و تبدیل به تب SQL
     */
    showSQLCodeAndSwitch(sqlCode) {
        try {
            // Update SQL code
            this.displaySQLCode(sqlCode);
            
            // Show database preview section
            this.showDatabasePreview();
            
            // Switch to SQL tab automatically
            setTimeout(() => {
                this.switchCodeTab('sql');
            }, 300);
            
            console.log('✅ SQL code displayed and tab switched');
            
        } catch (error) {
            console.error('❌ Error showing SQL code:', error);
        }
    }
    
    /**
     * نمایش کد HTML
     */
    displayHTMLCode(htmlCode) {
        const htmlCodeElement = document.getElementById('htmlCode');
        if (htmlCodeElement) {
            htmlCodeElement.textContent = htmlCode;
        }
    }
    
    /**
     * نمایش نام‌های پیشنهادی دیتابیس و جدول
     */
    displayDatabaseInfo(structure) {
        console.log('🔄 Displaying database info:', structure);
        
        const dbNameInput = document.getElementById('suggestedDbName');
        const tableNameInput = document.getElementById('suggestedTableName');
        
        console.log('📋 Database elements:', { dbNameInput, tableNameInput });
        
        if (dbNameInput) {
            dbNameInput.value = structure.database || 'my_database';
            console.log('✅ Database name set:', dbNameInput.value);
        } else {
            console.warn('⚠️ Database name input not found');
        }
        
        if (tableNameInput) {
            tableNameInput.value = structure.tableName || structure.table || 'data_table';
            console.log('✅ Table name set:', tableNameInput.value);
        } else {
            console.warn('⚠️ Table name input not found');
        }
    }
    
    /**
     * نمایش پیام خطا
     */
    showErrorMessage(message) {
        // Create error toast or modal
        const errorDiv = document.createElement('div');
        errorDiv.className = 'dm-error-message';
        errorDiv.innerHTML = `
            <div class="dm-error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
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
     * نمایش پیام موفقیت
     */
    showSuccessMessage(message) {
        // Create success toast
        const successDiv = document.createElement('div');
        successDiv.className = 'dm-success-message';
        successDiv.innerHTML = `
            <div class="dm-success-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(successDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (successDiv.parentElement) {
                successDiv.remove();
            }
        }, 5000);
        
        console.log('✅ Success:', message);
    }
    
    /**
     * مدیریت ایجاد جدول و وارد کردن داده‌ها
     */
    async handleCreateTableAndImport() {
        try {
            console.log('🔄 Starting table creation and data import...');
            
            // Show confirmation dialog
            const confirmed = await this.showCreateTableConfirmation();
            
            if (!confirmed) {
                console.log('❌ Table creation cancelled by user');
                return;
            }
            
            // Call controller method
            if (this.callbacks.onCreateTableAndImport) {
                await this.callbacks.onCreateTableAndImport();
            } else {
                console.warn('⚠️ onCreateTableAndImport callback not set');
                this.showErrorMessage('عملکرد ایجاد جدول در دسترس نیست');
            }
            
        } catch (error) {
            console.error('❌ Error in handleCreateTableAndImport:', error);
            this.showErrorMessage('خطا در ایجاد جدول: ' + error.message);
        }
    }
    
    /**
     * نمایش dialog تایید ایجاد جدول
     */
    async showCreateTableConfirmation() {
        return new Promise((resolve) => {
            // Get current structure info for the modal
            const currentStructure = this.getCurrentStructureInfo();
            
            // Create confirmation modal
            const modal = document.createElement('div');
            modal.className = 'dm-modal dm-create-table-modal';
            modal.innerHTML = `
                <div class="dm-modal-overlay"></div>
                <div class="dm-modal-content">
                    <div class="dm-modal-header">
                        <h3>
                            <i class="fas fa-database"></i>
                            تایید ایجاد جدول
                        </h3>
                    </div>
                    <div class="dm-modal-body">
                        <div class="dm-confirmation-message">
                            <p>آیا از ایجاد جدول در دیتابیس و وارد کردن داده‌ها مطمئن هستید؟</p>
                            <p class="dm-warning">
                                <i class="fas fa-exclamation-triangle"></i>
                                این عملیات قابل برگشت نیست و جدول جدیدی در دیتابیس ایجاد خواهد شد!
                            </p>
                        </div>
                        <div class="dm-table-preview">
                            <strong>دیتابیس:</strong> ai_excell2form<br>
                            <strong>جدول:</strong> ${currentStructure.tableName}<br>
                            <strong>فیلدهای انتخاب شده:</strong> ${currentStructure.selectedFieldsCount} از ${currentStructure.totalFields}<br>
                            <strong>تعداد رکوردها:</strong> ${currentStructure.totalRecords} رکورد
                        </div>
                    </div>
                    <div class="dm-modal-actions">
                        <button class="dm-btn dm-btn-secondary" id="cancelCreate">
                            <i class="fas fa-times"></i>
                            انصراف
                        </button>
                        <button class="dm-btn dm-btn-primary" id="confirmCreate">
                            <i class="fas fa-check"></i>
                            تایید و ایجاد جدول
                        </button>
                    </div>
                </div>
            `;
            
            // Add event listeners
            const cancelBtn = modal.querySelector('#cancelCreate');
            const confirmBtn = modal.querySelector('#confirmCreate');
            const overlay = modal.querySelector('.dm-modal-overlay');
            
            const closeModal = () => {
                modal.remove();
                resolve(false);
            };
            
            const confirmModal = () => {
                modal.remove();
                resolve(true);
            };
            
            cancelBtn.addEventListener('click', closeModal);
            overlay.addEventListener('click', closeModal);
            confirmBtn.addEventListener('click', confirmModal);
            
            // Handle ESC key
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    closeModal();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
            
            // Add to page
            document.body.appendChild(modal);
            
            // Focus confirm button after animation
            setTimeout(() => confirmBtn.focus(), 100);
        });
    }
    
    /**
     * دریافت اطلاعات ساختار فعلی
     */
    getCurrentStructureInfo() {
        // Get structure info from controller callback or default values
        let tableName = 'جدول جدید';
        let selectedFieldsCount = 0;
        let totalFields = 0;
        let totalRecords = 0;
        
        try {
            // Try to get actual data from DOM elements
            const tableNameInput = document.getElementById('suggestedTableName');
            if (tableNameInput && tableNameInput.value) {
                tableName = tableNameInput.value;
            }
            
            // Count selected fields
            const fieldCheckboxes = document.querySelectorAll('.dm-field-checkbox input[type="checkbox"]');
            totalFields = fieldCheckboxes.length;
            selectedFieldsCount = Array.from(fieldCheckboxes).filter(cb => cb.checked).length;
            
            // Get record count from file stats or elsewhere
            const statsElement = document.querySelector('[data-stat="totalRows"]');
            if (statsElement) {
                totalRecords = parseInt(statsElement.textContent) || 0;
            }
            
        } catch (error) {
            console.warn('Could not get current structure info:', error);
        }
        
        return {
            tableName,
            selectedFieldsCount,
            totalFields,
            totalRecords
        };
    }

    /**
     * نمایش پیام اطلاعات
     */
    showInfoMessage(message) {
        // Create info toast
        const infoDiv = document.createElement('div');
        infoDiv.className = 'dm-info-message';
        infoDiv.innerHTML = `
            <div class="dm-info-content">
                <i class="fas fa-info-circle"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(infoDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (infoDiv.parentElement) {
                infoDiv.remove();
            }
        }, 5000);
        
        console.log('ℹ️ Info:', message);
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
     * پاکسازی UI و حذف event listener ها
     */
    cleanup() {
        this.removeExistingEventListeners();
        this.elements = {};
        this.isInitialized = false;
        console.log('🗑️ DataManagementUI cleaned up');
    }
    
    /**
     * Debounce function برای جلوگیری از اجرای مکرر
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * تولید پنل انتخاب فیلدها
     */
    generateFieldSelection(structure) {
        try {
            console.log('🔄 Generating field selection for structure:', structure);
            
            const fieldSelection = document.getElementById('fieldSelection');
            const fieldCheckboxes = document.getElementById('fieldCheckboxes');
            
            if (!fieldSelection || !fieldCheckboxes) {
                console.warn('⚠️ Field selection elements not found');
                return;
            }
            
            if (!structure || !structure.fields || !Array.isArray(structure.fields)) {
                console.warn('⚠️ Invalid structure for field selection:', structure);
                return;
            }
            
            // Clear previous checkboxes
            fieldCheckboxes.innerHTML = '';
            
            // Create checkbox for each field
            structure.fields.forEach((field, index) => {
                const checkboxItem = document.createElement('div');
                checkboxItem.className = 'dm-field-checkbox';
                checkboxItem.innerHTML = `
                    <input type="checkbox" id="field_${index}" value="${field.name}" ${field.selected ? 'checked' : ''}>
                    <label for="field_${index}">
                        <span class="field-name">${field.name}</span>
                        <span class="field-type">${field.type}${field.length ? `(${field.length})` : ''}</span>
                    </label>
                `;
                
                // Add click event to the container
                checkboxItem.addEventListener('click', (e) => {
                    if (e.target.tagName !== 'INPUT') {
                        const checkbox = checkboxItem.querySelector('input');
                        checkbox.checked = !checkbox.checked;
                        // Trigger change event
                        checkbox.dispatchEvent(new Event('change'));
                    }
                });
                
                // Add change event to checkbox
                const checkbox = checkboxItem.querySelector('input');
                checkbox.addEventListener('change', () => {
                    checkboxItem.classList.toggle('selected', checkbox.checked);
                    // Update structure
                    structure.fields[index].selected = checkbox.checked;
                    // Trigger callback if provided
                    if (this.callbacks && this.callbacks.onFieldSelectionChange) {
                        this.callbacks.onFieldSelectionChange(structure);
                    }
                });
                
                // Set initial state
                if (field.selected) {
                    checkboxItem.classList.add('selected');
                }
                
                fieldCheckboxes.appendChild(checkboxItem);
            });
            
            // Show field selection panel
            fieldSelection.style.display = 'block';
            setTimeout(() => {
                fieldSelection.classList.add('dm-fade-in');
            }, 300);
            
            // Generate unique field selector
            this.generateUniqueFieldSelector(structure.fields);
            
            // Bind field selection action buttons
            this.bindFieldSelectionActions(structure);
            
            // Validate initial selection and update UI
            this.validateAndUpdateFieldSelection(structure);
            
            console.log('✅ Field selection generated successfully');
            
        } catch (error) {
            console.error('❌ Error generating field selection:', error);
        }
    }
    
    /**
     * تولید انتخابگر فیلد کلیدی
     */
    generateUniqueFieldSelector(fields) {
        try {
            const uniqueFieldSection = document.getElementById('uniqueFieldSection');
            const uniqueFieldSelect = document.getElementById('uniqueFieldSelect');
            
            if (!uniqueFieldSection || !uniqueFieldSelect || !fields) return;
            
            // Clear previous options (except first one)
            uniqueFieldSelect.innerHTML = '<option value="">فیلد کلیدی انتخاب کنید...</option>';
            
            // Add option for each selected field
            fields.forEach((field, index) => {
                if (field.selected) {
                    const option = document.createElement('option');
                    option.value = field.name;
                    option.textContent = field.name;
                    uniqueFieldSelect.appendChild(option);
                }
            });
            
            // Show unique field section if there are selected fields
            const hasSelectedFields = fields.some(field => field.selected);
            uniqueFieldSection.style.display = hasSelectedFields ? 'block' : 'none';
            
        } catch (error) {
            console.error('❌ Error generating unique field selector:', error);
        }
    }
    
    /**
     * اتصال event های دکمه‌های انتخاب فیلد
     */
    bindFieldSelectionActions(structure) {
        try {
            // Select All Fields button
            const selectAllBtn = document.getElementById('selectAllFields');
            if (selectAllBtn) {
                selectAllBtn.onclick = () => {
                    const checkboxes = document.querySelectorAll('#fieldCheckboxes input[type="checkbox"]');
                    checkboxes.forEach((checkbox, index) => {
                        checkbox.checked = true;
                        checkbox.closest('.dm-field-checkbox').classList.add('selected');
                        if (structure.fields[index]) {
                            structure.fields[index].selected = true;
                        }
                    });
                    this.generateUniqueFieldSelector(structure.fields);
                    if (this.callbacks && this.callbacks.onFieldSelectionChange) {
                        this.callbacks.onFieldSelectionChange(structure);
                    }
                };
            }
            
            // Deselect All Fields button
            const deselectAllBtn = document.getElementById('deselectAllFields');
            if (deselectAllBtn) {
                deselectAllBtn.onclick = () => {
                    const checkboxes = document.querySelectorAll('#fieldCheckboxes input[type="checkbox"]');
                    checkboxes.forEach((checkbox, index) => {
                        checkbox.checked = false;
                        checkbox.closest('.dm-field-checkbox').classList.remove('selected');
                        if (structure.fields[index]) {
                            structure.fields[index].selected = false;
                        }
                    });
                    this.generateUniqueFieldSelector(structure.fields);
                    if (this.callbacks && this.callbacks.onFieldSelectionChange) {
                        this.callbacks.onFieldSelectionChange(structure);
                    }
                };
            }
            
        } catch (error) {
            console.error('❌ Error binding field selection actions:', error);
        }
    }
    
    /**
     * اعتبارسنجی و بروزرسانی UI بر اساس انتخاب فیلدها
     */
    validateAndUpdateFieldSelection(structure) {
        try {
            if (!structure || !structure.fields) return;
            
            const selectedCount = structure.fields.filter(field => field.selected).length;
            
            // Trigger the selection change callback to update UI
            if (this.callbacks && this.callbacks.onFieldSelectionChange) {
                this.callbacks.onFieldSelectionChange(structure);
            }
            
            console.log(`✅ Field selection validated: ${selectedCount} fields selected`);
            
        } catch (error) {
            console.error('❌ Error validating field selection:', error);
        }
    }
    
    /**
     * نمایش پنل تنظیمات جدول
     */
    async showTableConfig(structure) {
        try {
            console.log('🔄 Showing table configuration panel');
            
            const tableConfig = document.getElementById('tableConfig');
            if (!tableConfig) {
                console.warn('⚠️ Table config panel not found');
                return;
            }
            
            // Show loading state
            this.showConfigLoading(true);
            
            // Generate AI suggestions with timeout
            const selectedFields = structure.fields.filter(field => field.selected);
            
            // Create timeout promise to prevent hanging
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('AI analysis timeout')), 15000);
            });
            
            let aiSuggestions;
            try {
                aiSuggestions = await Promise.race([
                    this.aiAssistant.analyzeFields(selectedFields, structure.fileName),
                    timeoutPromise
                ]);
            } catch (timeoutError) {
                console.warn('⚠️ AI analysis timed out, using fallback');
                aiSuggestions = { success: false, error: 'timeout' };
            }
            
            if (aiSuggestions.success) {
                console.log('✅ AI suggestions received:', aiSuggestions.data);
                
                // Apply AI suggestions to structure
                this.applyAISuggestions(structure, aiSuggestions.data);
                
                // Set suggested values
                const configTableName = document.getElementById('configTableName');
                const configTableDesc = document.getElementById('configTableDesc');
                
                if (configTableName) {
                    configTableName.value = aiSuggestions.data.tableName;
                }
                if (configTableDesc) {
                    configTableDesc.value = aiSuggestions.data.tableDescription;
                }
                
                // Generate fields grid with AI suggestions
                this.generateFieldsGridWithAI(structure, aiSuggestions.data.fields);
                
            } else {
                console.warn('⚠️ AI suggestions failed, using fallback');
                this.showTableConfigFallback(structure);
            }
            
            // Hide loading state
            this.showConfigLoading(false);
            
            // Show the panel
            tableConfig.style.display = 'block';
            setTimeout(() => {
                tableConfig.classList.add('dm-fade-in');
            }, 300);
            
            // Bind events for table config
            this.bindTableConfigEvents(structure);
            
            console.log('✅ Table configuration panel shown');
            
        } catch (error) {
            console.error('❌ Error showing table config:', error);
            this.showConfigLoading(false);
            this.showTableConfigFallback(structure);
        }
    }
    
    /**
     * تولید پیشنهاد نام جدول با هوش مصنوعی
     */
    generateTableNameSuggestion(structure) {
        try {
            // Simple AI logic for table name suggestion
            const fileName = structure.fileName || 'data';
            const baseName = fileName.replace(/\.(xlsx|xls|csv)$/i, '');
            
            // Convert Persian/Arabic to English equivalent
            const englishName = this.convertToEnglish(baseName);
            
            // Clean and format
            const cleanName = englishName
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '_')
                .replace(/_+/g, '_')
                .replace(/^_|_$/g, '');
            
            return `xls2tbl_${cleanName || 'imported_data'}`;
            
        } catch (error) {
            console.error('❌ Error generating table name:', error);
            return 'xls2tbl_imported_data';
        }
    }
    
    /**
     * تولید پیشنهاد توضیحات جدول
     */
    generateTableDescSuggestion(structure) {
        try {
            const fieldCount = structure.fields ? structure.fields.filter(f => f.selected).length : 0;
            const fileName = structure.fileName || 'فایل';
            
            return `جدول داده‌های وارد شده از ${fileName} شامل ${fieldCount} فیلد`;
            
        } catch (error) {
            console.error('❌ Error generating table description:', error);
            return 'جدول داده‌های وارد شده از فایل اکسل';
        }
    }
    
    /**
     * تبدیل نام فارسی/عربی به انگلیسی
     */
    convertToEnglish(text) {
        const persianToEnglish = {
            'شناسه': 'id',
            'نام': 'name',
            'تاریخ': 'date',
            'زمان': 'time',
            'قیمت': 'price',
            'مبلغ': 'amount',
            'تعداد': 'count',
            'توضیحات': 'description',
            'توضیح': 'comment',
            'ماه': 'month',
            'سال': 'year',
            'روز': 'day',
            'کاربر': 'user',
            'مشتری': 'customer',
            'فروش': 'sale',
            'خرید': 'purchase',
            'سود': 'profit',
            'درصد': 'percent',
            'وضعیت': 'status',
            'نوع': 'type',
            'گروه': 'group',
            'دسته': 'category',
            'کد': 'code',
            'شماره': 'number',
            'آدرس': 'address',
            'تلفن': 'phone',
            'ایمیل': 'email',
            'محل': 'location',
            'موقعیت': 'position'
        };
        
        let result = text;
        for (const [persian, english] of Object.entries(persianToEnglish)) {
            result = result.replace(new RegExp(persian, 'g'), english);
        }
        
        return result;
    }
    
    /**
     * تولید گرید فیلدها
     */
    generateFieldsGrid(structure) {
        try {
            console.log('🔄 Generating fields grid');
            
            const fieldsGrid = document.getElementById('fieldsGrid');
            if (!fieldsGrid || !structure.fields) return;
            
            // Filter selected fields only
            const selectedFields = structure.fields.filter(field => field.selected);
            
            fieldsGrid.innerHTML = '';
            
            selectedFields.forEach((field, index) => {
                const fieldCard = this.createFieldCard(field, index);
                fieldsGrid.appendChild(fieldCard);
            });
            
            console.log(`✅ Generated ${selectedFields.length} field cards`);
            
        } catch (error) {
            console.error('❌ Error generating fields grid:', error);
        }
    }
    
    /**
     * ایجاد کارت فیلد
     */
    createFieldCard(field, index) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'dm-field-card';
        cardDiv.setAttribute('data-index', index);
        
        // Generate English name suggestion
        const englishSuggestion = this.convertToEnglish(field.name)
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '') || `field_${index + 1}`;
        
        // Get suggested length for field
        const suggestedLength = this.suggestFieldLength(field);
        
        cardDiv.innerHTML = `
            <div class="dm-field-card-header">
                <span class="dm-field-original">${field.name}</span>
                <span class="dm-field-type-badge">${field.type}</span>
            </div>
            <div class="dm-field-card-body">
                <div class="dm-field-input-group">
                    <label>نام انگلیسی:</label>
                    <input type="text" class="dm-field-english-name" value="${englishSuggestion}" 
                           data-field-index="${index}" data-property="englishName">
                </div>
                <div class="dm-field-input-row">
                    <div class="dm-field-input-group">
                        <label>نوع داده:</label>
                        <select class="dm-field-data-type" data-field-index="${index}" data-property="type">
                            <option value="VARCHAR" ${field.type === 'VARCHAR' ? 'selected' : ''}>VARCHAR</option>
                            <option value="INT" ${field.type === 'INT' ? 'selected' : ''}>INT</option>
                            <option value="DECIMAL" ${field.type === 'DECIMAL' ? 'selected' : ''}>DECIMAL</option>
                            <option value="DATE" ${field.type === 'DATE' ? 'selected' : ''}>DATE</option>
                            <option value="DATETIME" ${field.type === 'DATETIME' ? 'selected' : ''}>DATETIME</option>
                            <option value="TEXT" ${field.type === 'TEXT' ? 'selected' : ''}>TEXT</option>
                        </select>
                    </div>
                    <div class="dm-field-input-group">
                        <label>طول:</label>
                        <input type="text" class="dm-field-length" value="${suggestedLength || field.length || ''}" 
                               data-field-index="${index}" data-property="length">
                    </div>
                </div>
                <div class="dm-field-input-row">
                    <div class="dm-field-input-group">
                        <label>NULL مجاز:</label>
                        <select class="dm-field-nullable" data-field-index="${index}" data-property="nullable">
                            <option value="true" ${field.nullable ? 'selected' : ''}>بله</option>
                            <option value="false" ${!field.nullable ? 'selected' : ''}>خیر</option>
                        </select>
                    </div>
                    <div class="dm-field-input-group">
                        <label>کلید اصلی:</label>
                        <input type="radio" name="primaryKey" value="${index}" class="dm-field-primary" 
                               data-field-index="${index}" ${index === 0 ? 'checked' : ''}>
                    </div>
                </div>
            </div>
        `;
        
        return cardDiv;
    }

    /**
     * پیشنهاد طول فیلد بر اساس نوع داده
     */
    suggestFieldLength(field) {
        const fieldName = field.name.toLowerCase();
        const fieldType = field.type;
        
        // قوانین هوشمند برای طول فیلد
        if (fieldType === 'INT') {
            if (fieldName.includes('شناسه') || fieldName.includes('id')) return '11';
            if (fieldName.includes('سال')) return '4';
            if (fieldName.includes('ماه') || fieldName.includes('روز')) return '2';
            if (fieldName.includes('تعداد') || fieldName.includes('مقدار')) return '10';
            return '11';
        }
        
        if (fieldType === 'DECIMAL') {
            if (fieldName.includes('قیمت') || fieldName.includes('مبلغ') || fieldName.includes('درآمد')) return '15,2';
            if (fieldName.includes('درصد') || fieldName.includes('نرخ')) return '5,2';
            return '10,2';
        }
        
        if (fieldType === 'VARCHAR') {
            if (fieldName.includes('نام') && fieldName.includes('خانوادگی')) return '100';
            if (fieldName.includes('نام')) return '50';
            if (fieldName.includes('کد ملی') || fieldName.includes('شناسه ملی')) return '10';
            if (fieldName.includes('تلفن') || fieldName.includes('موبایل')) return '15';
            if (fieldName.includes('ایمیل')) return '100';
            if (fieldName.includes('آدرس') || fieldName.includes('نشانی')) return '255';
            if (fieldName.includes('توضیحات') || fieldName.includes('شرح')) return '500';
            if (fieldName.includes('عنوان') || fieldName.includes('موضوع')) return '150';
            if (fieldName.includes('انتخاب') || fieldName.includes('نوع')) return '50';
            return '100'; // پیش‌فرض
        }
        
        if (fieldType === 'DATE') return null; // DATE نیاز به length ندارد
        
        return '100'; // پیش‌فرض
    }
    
    /**
     * اتصال رویدادهای پنل تنظیمات جدول
     */
    bindTableConfigEvents(structure) {
        try {
            // Field change events
            const fieldsGrid = document.getElementById('fieldsGrid');
            if (fieldsGrid) {
                fieldsGrid.addEventListener('change', (e) => {
                    this.handleFieldConfigChange(e, structure);
                });
                
                fieldsGrid.addEventListener('input', (e) => {
                    this.handleFieldConfigChange(e, structure);
                });
            }
            
            // Table name and description changes
            const configTableName = document.getElementById('configTableName');
            const configTableDesc = document.getElementById('configTableDesc');
            
            if (configTableName) {
                configTableName.addEventListener('input', () => {
                    this.handleTableConfigChange(structure);
                });
            }
            
            if (configTableDesc) {
                configTableDesc.addEventListener('input', () => {
                    this.handleTableConfigChange(structure);
                });
            }
            
            // Action buttons
            const generateBtn = document.getElementById('generateFinalStructure');
            const resetBtn = document.getElementById('resetToDefaults');
            
            if (generateBtn) {
                generateBtn.onclick = () => {
                    this.handleGenerateFinalStructure(structure);
                };
            }
            
            if (resetBtn) {
                resetBtn.onclick = () => {
                    this.handleResetToDefaults(structure);
                };
            }
            
            console.log('✅ Table config events bound');
            
        } catch (error) {
            console.error('❌ Error binding table config events:', error);
        }
    }
    
    /**
     * پردازش تغییر تنظیمات فیلد
     */
    handleFieldConfigChange(event, structure) {
        try {
            const target = event.target;
            const fieldIndex = parseInt(target.getAttribute('data-field-index'));
            const property = target.getAttribute('data-property');
            
            if (isNaN(fieldIndex)) return;
            
            const selectedFields = structure.fields.filter(field => field.selected);
            if (fieldIndex >= selectedFields.length) return;
            
            // Handle primary key radio button
            if (target.name === 'primaryKey' && target.type === 'radio') {
                console.log('🔑 Primary key changed to field index:', fieldIndex);
                
                // Clear all primary keys first
                selectedFields.forEach(field => {
                    field.isPrimary = false;
                });
                
                // Set new primary key
                selectedFields[fieldIndex].isPrimary = true;
                
                console.log('🔑 Primary key set on field:', selectedFields[fieldIndex].name);
                this.updateSQLPreview(structure);
                return;
            }
            
            // Handle other properties
            if (!property) return;
            
            let value = target.value;
            if (property === 'nullable') {
                value = value === 'true';
            }
            
            // Update field property
            selectedFields[fieldIndex][property] = value;
            
            console.log(`🔄 Field ${fieldIndex} ${property} updated to:`, value);
            
            // Trigger real-time SQL update
            this.updateSQLPreview(structure);
            
        } catch (error) {
            console.error('❌ Error handling field config change:', error);
        }
    }
    
    /**
     * پردازش تغییر تنظیمات جدول
     */
    handleTableConfigChange(structure) {
        try {
            console.log('🔄 Table config changed');
            
            // Update table info in structure
            const configTableName = document.getElementById('configTableName');
            const configTableDesc = document.getElementById('configTableDesc');
            
            if (configTableName) {
                structure.tableName = configTableName.value;
            }
            if (configTableDesc) {
                structure.tableDescription = configTableDesc.value;
            }
            
            // Trigger real-time SQL update
            this.updateSQLPreview(structure);
            
        } catch (error) {
            console.error('❌ Error handling table config change:', error);
        }
    }
    
    /**
     * بروزرسانی پیش‌نمایش SQL بلادرنگ
     */
    updateSQLPreview(structure) {
        try {
            // Trigger callback for real-time SQL generation
            if (this.callbacks && this.callbacks.onTableConfigChange) {
                this.callbacks.onTableConfigChange(structure);
            }
            
            // Generate SQL immediately for real-time update
            if (this.callbacks && this.callbacks.onGenerateSQL) {
                const sqlCode = this.callbacks.onGenerateSQL(structure);
                if (sqlCode) {
                    this.displaySQLCode(sqlCode);
                }
            }
            
        } catch (error) {
            console.error('❌ Error updating SQL preview:', error);
        }
    }
    
    /**
     * پردازش تولید نهایی ساختار
     */
    handleGenerateFinalStructure(structure) {
        try {
            console.log('🔄 Starting final structure generation from UI...');
            console.log('📊 Structure to generate:', structure);
            
            // Update structure with current form values
            this.updateStructureFromForm(structure);
            
            console.log('📊 Updated structure with form values:', structure);
            
            if (this.callbacks && this.callbacks.onGenerateFinalStructure) {
                console.log('🔄 Calling controller callback...');
                this.callbacks.onGenerateFinalStructure(structure);
            } else {
                console.error('❌ No callback available for final structure generation');
            }
            
        } catch (error) {
            console.error('❌ Error generating final structure from UI:', error);
        }
    }

    /**
     * بروزرسانی ساختار از مقادیر فرم
     */
    updateStructureFromForm(structure) {
        try {
            console.log('🔄 Updating structure from form values...');
            
            // Update table info
            const configTableName = document.getElementById('configTableName');
            const configTableDesc = document.getElementById('configTableDesc');
            
            if (configTableName) {
                structure.tableName = configTableName.value;
                console.log('🔄 Table name updated:', structure.tableName);
            }
            if (configTableDesc) {
                structure.tableDescription = configTableDesc.value;
                console.log('🔄 Table description updated:', structure.tableDescription);
            }
            
            // Update field configurations from the form
            const selectedFields = structure.fields.filter(field => field.selected);
            const fieldsGrid = document.getElementById('fieldsGrid');
            
            if (fieldsGrid) {
                selectedFields.forEach((field, index) => {
                    const fieldCard = fieldsGrid.querySelector(`[data-index="${index}"]`);
                    if (fieldCard) {
                        // Update english name
                        const englishNameInput = fieldCard.querySelector('.dm-field-english-name');
                        if (englishNameInput) {
                            field.englishName = englishNameInput.value;
                        }
                        
                        // Update data type
                        const dataTypeSelect = fieldCard.querySelector('.dm-field-data-type');
                        if (dataTypeSelect) {
                            field.type = dataTypeSelect.value;
                        }
                        
                        // Update length
                        const lengthInput = fieldCard.querySelector('.dm-field-length');
                        if (lengthInput) {
                            field.length = lengthInput.value;
                        }
                        
                        // Update nullable
                        const nullableSelect = fieldCard.querySelector('.dm-field-nullable');
                        if (nullableSelect) {
                            field.nullable = nullableSelect.value === 'true';
                        }
                        
                        // Check if this is primary key
                        const primaryKeyRadio = fieldCard.querySelector('.dm-field-primary');
                        if (primaryKeyRadio && primaryKeyRadio.checked) {
                            field.isPrimary = true;
                            console.log('🔑 Primary key found on field:', field.name);
                        } else {
                            field.isPrimary = false;
                        }
                    }
                });
            }
            
            console.log('✅ Structure updated from form values');
            
        } catch (error) {
            console.error('❌ Error updating structure from form:', error);
        }
    }
    
    /**
     * پردازش بازگشت به تنظیمات پیش‌فرض
     */
    handleResetToDefaults(structure) {
        try {
            console.log('🔄 Resetting to defaults');
            
            // Regenerate with default values
            this.showTableConfig(structure);
            
        } catch (error) {
            console.error('❌ Error resetting to defaults:', error);
        }
    }
    
    /**
     * نمایش loading برای پنل تنظیمات
     */
    showConfigLoading(show) {
        const tableConfig = document.getElementById('tableConfig');
        if (!tableConfig) return;
        
        if (show) {
            // Create or show loading overlay
            let loadingOverlay = tableConfig.querySelector('.dm-config-loading-overlay');
            if (!loadingOverlay) {
                loadingOverlay = document.createElement('div');
                loadingOverlay.className = 'dm-config-loading-overlay';
                loadingOverlay.innerHTML = `
                    <div class="dm-config-loading">
                        <div class="dm-loading-spinner"></div>
                        <p>🤖 در حال تحلیل فیلدها با هوش مصنوعی...</p>
                        <small>لطفاً صبر کنید...</small>
                    </div>
                `;
                tableConfig.appendChild(loadingOverlay);
            }
            loadingOverlay.style.display = 'flex';
            tableConfig.style.display = 'block';
        } else {
            // Hide and remove loading overlay
            const loadingOverlay = tableConfig.querySelector('.dm-config-loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.remove();
            }
        }
    }
    
    /**
     * اعمال پیشنهادات هوش مصنوعی
     */
    applyAISuggestions(structure, aiData) {
        try {
            // Update structure with AI suggestions
            structure.tableName = aiData.tableName;
            structure.tableDescription = aiData.tableDescription;
            structure.formTopic = aiData.formTopic;
            
            // Update selected fields with AI suggestions
            const selectedFields = structure.fields.filter(field => field.selected);
            
            selectedFields.forEach((field, index) => {
                const aiField = aiData.fields[index];
                if (aiField) {
                    field.englishName = aiField.englishName;
                    field.suggestedType = aiField.suggestedType || field.type;
                    field.description = aiField.description;
                    field.aiSuggested = aiField.aiSuggested;
                }
            });
            
            console.log('✅ AI suggestions applied to structure');
            
        } catch (error) {
            console.error('❌ Error applying AI suggestions:', error);
        }
    }
    
    /**
     * تولید گرید فیلدها با پیشنهادات هوش مصنوعی
     */
    generateFieldsGridWithAI(structure, aiFields) {
        try {
            console.log('🔄 Generating fields grid with AI suggestions');
            
            const fieldsGrid = document.getElementById('fieldsGrid');
            if (!fieldsGrid || !structure.fields) return;
            
            // Filter selected fields only
            const selectedFields = structure.fields.filter(field => field.selected);
            
            fieldsGrid.innerHTML = '';
            
            selectedFields.forEach((field, index) => {
                const aiField = aiFields[index];
                const fieldCard = this.createFieldCardWithAI(field, aiField, index);
                fieldsGrid.appendChild(fieldCard);
            });
            
            console.log(`✅ Generated ${selectedFields.length} field cards with AI suggestions`);
            
        } catch (error) {
            console.error('❌ Error generating fields grid with AI:', error);
            // Fallback to basic grid
            this.generateFieldsGrid(structure);
        }
    }
    
    /**
     * ایجاد کارت فیلد با پیشنهادات هوش مصنوعی
     */
    createFieldCardWithAI(field, aiField, index) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'dm-field-card';
        cardDiv.setAttribute('data-index', index);
        
        // Use AI suggestions if available
        const englishSuggestion = aiField?.englishName || this.convertToEnglish(field.name) || `field_${index + 1}`;
        const typeSuggestion = aiField?.suggestedType || field.type;
        const description = aiField?.description || '';
        const isAISuggested = aiField?.aiSuggested || false;
        
        cardDiv.innerHTML = `
            <div class="dm-field-card-header">
                <span class="dm-field-original">${field.name}</span>
                <div class="dm-field-badges">
                    <span class="dm-field-type-badge">${typeSuggestion}</span>
                    ${isAISuggested ? '<span class="dm-ai-badge">🤖 AI</span>' : ''}
                </div>
            </div>
            <div class="dm-field-card-body">
                <div class="dm-field-input-group">
                    <label>نام انگلیسی:</label>
                    <input type="text" class="dm-field-english-name" value="${englishSuggestion}" 
                           data-field-index="${index}" data-property="englishName">
                </div>
                ${description ? `<div class="dm-field-description">💡 ${description}</div>` : ''}
                <div class="dm-field-input-row">
                    <div class="dm-field-input-group">
                        <label>نوع داده:</label>
                        <select class="dm-field-data-type" data-field-index="${index}" data-property="type">
                            <option value="VARCHAR" ${typeSuggestion.includes('VARCHAR') ? 'selected' : ''}>VARCHAR</option>
                            <option value="INT" ${typeSuggestion.includes('INT') ? 'selected' : ''}>INT</option>
                            <option value="DECIMAL" ${typeSuggestion.includes('DECIMAL') ? 'selected' : ''}>DECIMAL</option>
                            <option value="DATE" ${typeSuggestion.includes('DATE') ? 'selected' : ''}>DATE</option>
                            <option value="DATETIME" ${typeSuggestion.includes('DATETIME') ? 'selected' : ''}>DATETIME</option>
                            <option value="TEXT" ${typeSuggestion.includes('TEXT') ? 'selected' : ''}>TEXT</option>
                        </select>
                    </div>
                    <div class="dm-field-input-group">
                        <label>طول:</label>
                        <input type="text" class="dm-field-length" value="${aiField?.maxLength || this.extractLength(typeSuggestion)}" 
                               data-field-index="${index}" data-property="length">
                    </div>
                </div>
                <div class="dm-field-input-row">
                    <div class="dm-field-input-group">
                        <label>NULL مجاز:</label>
                        <select class="dm-field-nullable" data-field-index="${index}" data-property="nullable">
                            <option value="true" ${field.nullable ? 'selected' : ''}>بله</option>
                            <option value="false" ${!field.nullable ? 'selected' : ''}>خیر</option>
                        </select>
                    </div>
                    <div class="dm-field-input-group">
                        <label>کلید اصلی:</label>
                        <input type="radio" name="primaryKey" value="${index}" class="dm-field-primary" 
                               data-field-index="${index}" ${index === 0 || typeSuggestion.includes('PRIMARY KEY') ? 'checked' : ''}>
                    </div>
                </div>
            </div>
        `;
        
        return cardDiv;
    }
    
    /**
     * استخراج طول از نوع داده
     */
    extractLength(dataType) {
        const match = dataType.match(/\(([^)]+)\)/);
        return match ? match[1] : '';
    }
    
    /**
     * نمایش پنل تنظیمات بدون هوش مصنوعی (fallback)
     */
    showTableConfigFallback(structure) {
        try {
            const tableConfig = document.getElementById('tableConfig');
            if (!tableConfig) return;
            
            // Generate basic suggestions
            const tableNameSuggestion = this.generateTableNameSuggestion(structure);
            const tableDescSuggestion = this.generateTableDescSuggestion(structure);
            
            // Rebuild table config HTML
            this.buildTableConfigHTML();
            
            // Set suggested values
            const configTableName = document.getElementById('configTableName');
            const configTableDesc = document.getElementById('configTableDesc');
            
            if (configTableName) {
                configTableName.value = tableNameSuggestion;
            }
            if (configTableDesc) {
                configTableDesc.value = tableDescSuggestion;
            }
            
            // Generate basic fields grid
            this.generateFieldsGrid(structure);
            
            console.log('✅ Table configuration fallback loaded');
            
        } catch (error) {
            console.error('❌ Error in table config fallback:', error);
        }
    }
    
    /**
     * بازسازی HTML پنل تنظیمات جدول
     */
    buildTableConfigHTML() {
        const tableConfig = document.getElementById('tableConfig');
        if (!tableConfig) return;
        
        tableConfig.innerHTML = `
            <div class="dm-table-config-header">
                <i class="fas fa-cogs"></i>
                <div>
                    <h3>تنظیمات جدول و فیلدها</h3>
                    <p>نام جدول و تنظیمات فیلدهای انتخاب شده را مشخص کنید:</p>
                </div>
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
        `;
    }
    
    /**
     * دریافت المنت‌های cached
     */
    getCachedElements() {
        if (!this.cachedElements) {
            this.cachedElements = {
                fileInput: document.getElementById('excelFileInput'),
                fileInfo: document.getElementById('fileInfo'),
                previewContainer: document.getElementById('previewContainer'),
                fieldSelection: document.getElementById('fieldSelection'),
                tableConfig: document.getElementById('tableConfig'),
                sqlPreview: document.getElementById('sqlPreview'),
                generateButton: document.getElementById('generateStructure')
            };
        }
        return this.cachedElements;
    }
    
    /**
     * تمیز کردن cache
     */
    clearCache() {
        this.cachedElements = null;
    }
    
    /**
     * نمایش خطا در UI
     */
    showError(message, duration = 5000) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'dm-error-notification';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
            <button class="dm-error-close">&times;</button>
        `;
        
        // Add to page
        document.body.appendChild(errorDiv);
        
        // Auto remove after duration
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, duration);
        
        // Manual close handler
        const closeBtn = errorDiv.querySelector('.dm-error-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            });
        }
    }
    
    /**
     * نمایش موفقیت در UI
     */
    showSuccess(message, duration = 3000) {
        // Create success notification
        const successDiv = document.createElement('div');
        successDiv.className = 'dm-success-notification';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        // Add to page
        document.body.appendChild(successDiv);
        
        // Auto remove after duration
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, duration);
    }
    
    /**
     * Debug log با فرمت بهتر
     */
    debugLog(message, data = null) {
        if (this.debug) {
            console.log(`🔧 DataManagementUI: ${message}`, data || '');
        }
    }
    
    /**
     * اضافه کردن المنت‌های مخفی برای پنل‌های جدید
     */
    addMissingElements() {
        try {
            // Add field selection panel if not exists
            if (!document.getElementById('fieldSelection')) {
                const fieldSelectionHTML = `
                    <div class="dm-field-selection" id="fieldSelection" style="display: none;">
                        <div class="dm-field-selection-header">
                            <i class="fas fa-list-check"></i>
                            <div>
                                <h3>انتخاب فیلدها</h3>
                                <p>فیلدهای مورد نظر خود را برای ایجاد جدول انتخاب کنید:</p>
                            </div>
                        </div>
                        
                        <div class="dm-field-checkboxes" id="fieldCheckboxes">
                            <!-- Dynamic field checkboxes will be generated here -->
                        </div>
                        
                        <div class="dm-field-selection-actions">
                            <button class="dm-btn dm-btn-secondary" id="selectAllFields">
                                <i class="fas fa-check-square"></i>
                                انتخاب همه
                            </button>
                            <button class="dm-btn dm-btn-secondary" id="deselectAllFields">
                                <i class="fas fa-square"></i>
                                عدم انتخاب همه
                            </button>
                            <button class="dm-btn dm-btn-primary" id="proceedToConfig" style="display: none;">
                                <i class="fas fa-arrow-right"></i>
                                ادامه به تنظیمات
                            </button>
                             
                `;
                
                // Insert after table preview
                const tablePreview = document.getElementById('tablePreview');
                if (tablePreview) {
                    tablePreview.insertAdjacentHTML('afterend', fieldSelectionHTML);
                }
            }
            
            // Add table config panel if not exists
            if (!document.getElementById('tableConfig')) {
                const tableConfigHTML = `
                    <div class="dm-table-config" id="tableConfig" style="display: none;">
                        <!-- Table config content will be dynamically generated -->
                    </div>
                `;
                
                // Insert after field selection
                const fieldSelection = document.getElementById('fieldSelection');
                if (fieldSelection) {
                    fieldSelection.insertAdjacentHTML('afterend', tableConfigHTML);
                }
            }
            
            // Add SQL preview panel if not exists
            if (!document.getElementById('sqlPreview')) {
                const sqlPreviewHTML = `
                    <div class="dm-sql-preview" id="sqlPreview" style="display: none;">
                        <div class="dm-sql-preview-header">
                            <i class="fas fa-code"></i>
                            <div>
                                <h3>پیش‌نمایش SQL</h3>
                                <p>کد SQL نهایی برای ایجاد جدول:</p>
                            </div>
                        </div>
                        
                        <div class="dm-sql-code-container">
                            <pre><code id="sqlCodePreview" class="language-sql"><!-- SQL code will be generated here --></code></pre>
                            <div class="dm-sql-actions">
                                <button class="dm-btn dm-btn-secondary" id="copySqlCode">
                                    <i class="fas fa-copy"></i>
                                    کپی کد SQL
                                </button>
                                <button class="dm-btn dm-btn-primary" id="executeSQL">
                                    <i class="fas fa-play"></i>
                                    اجرای کد SQL
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                
                // Insert after table config
                const tableConfig = document.getElementById('tableConfig');
                if (tableConfig) {
                    tableConfig.insertAdjacentHTML('afterend', sqlPreviewHTML);
                }
            }
            
            console.log('✅ Missing elements added to UI');
            
        } catch (error) {
            console.error('❌ Error adding missing elements:', error);
        }
    }
    
    /**
     * تنظیم callback برای SQL preview
     */
    setupSQLPreviewCallbacks() {
        try {
            // Copy SQL code button
            const copySqlBtn = document.getElementById('copySqlCode');
            if (copySqlBtn) {
                copySqlBtn.addEventListener('click', () => {
                    const sqlCode = document.getElementById('sqlCodePreview');
                    if (sqlCode && sqlCode.textContent) {
                        navigator.clipboard.writeText(sqlCode.textContent)
                            .then(() => {
                                this.showSuccess('کد SQL کپی شد');
                            })
                            .catch(err => {
                                console.error('❌ Error copying SQL code:', err);
                                this.showError('خطا در کپی کردن کد SQL');
                            });
                    }
                });
            }
            
            // Execute SQL button
            const executeSqlBtn = document.getElementById('executeSQL');
            if (executeSqlBtn) {
                executeSqlBtn.addEventListener('click', () => {
                    if (this.callbacks && this.callbacks.onExecuteSQL) {
                        this.callbacks.onExecuteSQL();
                    }
                });
            }
            
        } catch (error) {
            console.error('❌ Error setting up SQL preview callbacks:', error);
        }
    }
    
    /**
     * نمایش SQL preview panel
     */
    showSQLPreview(sqlCode) {
        try {
            console.log('🔄 Showing SQL preview');
            
            const sqlPreview = document.getElementById('sqlPreview');
            const sqlCodePreview = document.getElementById('sqlCodePreview');
            
            if (!sqlPreview || !sqlCodePreview) {
                console.warn('⚠️ SQL preview elements not found');
                this.addMissingElements();
                return this.showSQLPreview(sqlCode);
            }
            
            // Update SQL code
            sqlCodePreview.textContent = sqlCode;
            
            // Show SQL preview panel
            sqlPreview.style.display = 'block';
            setTimeout(() => {
                sqlPreview.classList.add('dm-fade-in');
            }, 300);
            
            // Setup callbacks if not already done
            this.setupSQLPreviewCallbacks();
            
            console.log('✅ SQL preview shown successfully');
            
        } catch (error) {
            console.error('❌ Error showing SQL preview:', error);
        }
    }
    
    /**
     * مخفی کردن تمام پنل‌ها
     */
    hideAllPanels() {
        const panels = [
            'fileInfo',
            'tablePreview', 
            'fieldSelection',
            'tableConfig',
            'sqlPreview',
            'databasePreview'
        ];
        
        panels.forEach(panelId => {
            const panel = document.getElementById(panelId);
            if (panel) {
                panel.style.display = 'none';
                panel.classList.remove('dm-fade-in', 'show');
            }
        });
    }
    
    /**
     * نمایش پنل مشخص
     */
    showPanel(panelId, fadeIn = true) {
        const panel = document.getElementById(panelId);
        if (panel) {
            panel.style.display = 'block';
            if (fadeIn) {
                setTimeout(() => {
                    panel.classList.add('dm-fade-in');
                }, 100);
            }
        }
    }
    
    /**
     * بروزرسانی وضعیت دکمه "ادامه به تنظیمات"
     */
    updateProceedButton(structure) {
        try {
            const proceedBtn = document.getElementById('proceedToConfig');
            if (!proceedBtn || !structure || !structure.fields) return;
            
            const selectedCount = structure.fields.filter(field => field.selected).length;
            
            if (selectedCount > 0) {
                proceedBtn.style.display = 'inline-block';
                proceedBtn.onclick = () => {
                    if (this.callbacks && this.callbacks.onShowTableConfig) {
                        this.callbacks.onShowTableConfig(structure);
                    }
                };
            } else {
                proceedBtn.style.display = 'none';
            }
            
        } catch (error) {
            console.error('❌ Error updating proceed button:', error);
        }
    }
    
    /**
     * اولویت‌بندی فیلدهای کلیدی
     */
    prioritizeKeyFields(fields) {
        if (!fields || !Array.isArray(fields)) return fields;
        
        // Keywords that suggest primary key or important fields
        const keywordPriority = {
            'شناسه': 10,
            'کد': 9,
            'شماره': 8,
            'id': 10,
            'code': 9,
            'number': 8
        };
        
        return fields.map(field => {
            let priority = 0;
            const name = field.name?.toLowerCase() || '';
            
            for (const [keyword, points] of Object.entries(keywordPriority)) {
                if (name.includes(keyword)) {
                    priority += points;
                }
            }
            
            return { ...field, priority };
        }).sort((a, b) => (b.priority || 0) - (a.priority || 0));
    }
    
    getElements() {
        return this.elements;
    }
}

// Export as ES6 module
export default DataManagementUI;