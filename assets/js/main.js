/**
 * DataSave - Main Application
 * @description Main application script for handling UI interactions and core functionality
 * @author DataSave Team
 * @version 1.0.0
 */

'use strict';

// Import core modules
import { ExcelProcessor } from './modules/excel-processor.js';
import { SimpleLogger as Logger } from './modules/simple-logger.js';
import { NumberUtils } from './modules/numberUtils.js';
import { PersianCalendarAdapter } from './modules/persian-calendar-adapter.js';

/**
 * Application state management
 */
const AppState = {
    currentFile: null,
    isProcessing: false,
    statistics: {
        totalUploads: 0,
        successfulProcesses: 0,
        totalRecords: 0,
        avgProcessTime: 0
    },
    charts: {
        processChart: null,
        fileTypeChart: null
    },
    startTime: Date.now()
};

/**
 * DOM elements cache
 */
const Elements = {
    loadingSpinner: null,
    uploadArea: null,
    fileInput: null,
    uploadProgress: null,
    fileInfo: null,
    fileName: null,
    fileSize: null,
    processBtn: null,
    toastContainer: null,
    currentDateTime: null
};

/**
 * Application initialization
 */
class ExcelImportApp {
    constructor() {
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        const exitTrace = Logger?.trace?.('ExcelImportApp.init');
        
        try {
            Logger?.info('Application initialization started', {
                userAgent: navigator.userAgent,
                url: window.location.href,
                timestamp: new Date().toISOString()
            });
            
            this.cacheElements();
            this.bindEvents();
            this.loadStatistics();
            this.initializeCharts();
            this.updateDateTime();
            this.hideLoading();
            
            Logger?.info('Application initialized successfully', {
                initTime: Date.now() - AppState.startTime + 'ms'
            });
        } catch (error) {
            Logger?.error('Failed to initialize application', error, {
                initTime: Date.now() - AppState.startTime + 'ms'
            });
            this.showToast('خطا در بارگذاری اپلیکیشن', 'error');
        } finally {
            exitTrace?.();
        }
    }

    /**
     * Cache DOM elements for better performance
     */
    cacheElements() {
        const exitTrace = Logger?.trace?.('ExcelImportApp.cacheElements');
        
        try {
            Elements.loadingSpinner = document.getElementById('loading-spinner');
            Elements.uploadArea = document.getElementById('uploadArea');
            Elements.fileInput = document.getElementById('fileInput');
            Elements.uploadProgress = document.getElementById('uploadProgress');
            Elements.fileInfo = document.getElementById('fileInfo');
            Elements.fileName = document.getElementById('fileName');
            Elements.fileSize = document.getElementById('fileSize');
            Elements.processBtn = document.getElementById('processBtn');
            Elements.toastContainer = document.getElementById('toastContainer');
            Elements.currentDateTime = document.getElementById('currentDateTime');
            
            // Validate critical elements
            const criticalElements = ['uploadArea', 'fileInput', 'toastContainer'];
            const missingElements = criticalElements.filter(id => !Elements[id]);
            
            if (missingElements.length > 0) {
                throw new Error(`Critical elements missing: ${missingElements.join(', ')}`);
            }
            
            Logger?.debug('DOM elements cached successfully', {
                cachedElements: Object.keys(Elements).length,
                missingElements
            });
        } catch (error) {
            Logger?.error('Failed to cache DOM elements', error);
            throw error;
        } finally {
            exitTrace?.();
        }
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // File input events
        Elements.fileInput.addEventListener('change', this.handleFileSelect.bind(this));
        
        // Drag and drop events
        Elements.uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        Elements.uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        Elements.uploadArea.addEventListener('drop', this.handleFileDrop.bind(this));
        Elements.uploadArea.addEventListener('click', () => Elements.fileInput.click());
        
        // Scroll events for navbar
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', this.handleSmoothScroll.bind(this));
        });
        
        // Update time every minute
        setInterval(() => this.updateDateTime(), 60000);
    }

    /**
     * Handle file selection
     * @param {Event} event - File input change event
     */
    handleFileSelect(event) {
        const exitTrace = Logger?.trace?.('ExcelImportApp.handleFileSelect');
        
        try {
            const file = event.target.files[0];
            if (file) {
                Logger?.info('File selected via input', {
                    fileName: file.name,
                    fileSize: file.size,
                    fileType: file.type,
                    lastModified: file.lastModified
                });
                this.validateAndDisplayFile(file);
            } else {
                Logger?.warn('File selection cancelled or no file selected');
            }
        } catch (error) {
            Logger?.error('Error handling file selection', error);
            this.showToast('خطا در انتخاب فایل', 'error');
        } finally {
            exitTrace?.();
        }
    }

    /**
     * Handle drag over event
     * @param {DragEvent} event - Drag over event
     */
    handleDragOver(event) {
        event.preventDefault();
        Elements.uploadArea.classList.add('dragover');
    }

    /**
     * Handle drag leave event
     * @param {DragEvent} event - Drag leave event
     */
    handleDragLeave(event) {
        event.preventDefault();
        Elements.uploadArea.classList.remove('dragover');
    }

    /**
     * Handle file drop event
     * @param {DragEvent} event - Drop event
     */
    handleFileDrop(event) {
        const exitTrace = Logger?.trace?.('ExcelImportApp.handleFileDrop');
        
        try {
            event.preventDefault();
            Elements.uploadArea.classList.remove('dragover');
            
            const files = event.dataTransfer.files;
            Logger?.info('Files dropped', {
                fileCount: files.length,
                fileNames: Array.from(files).map(f => f.name)
            });
            
            if (files.length > 0) {
                if (files.length > 1) {
                    Logger?.warn('Multiple files dropped, using first file only', {
                        droppedCount: files.length
                    });
                    this.showToast('فقط یک فایل در هر بار قابل پردازش است', 'warning');
                }
                this.validateAndDisplayFile(files[0]);
            } else {
                Logger?.warn('No files in drop event');
            }
        } catch (error) {
            Logger?.error('Error handling file drop', error);
            this.showToast('خطا در پردازش فایل افتاده', 'error');
        } finally {
            exitTrace?.();
        }
    }

    /**
     * Validate and display selected file
     * @param {File} file - Selected file
     */
    validateAndDisplayFile(file) {
        const exitTrace = Logger?.trace?.('ExcelImportApp.validateAndDisplayFile');
        const timer = Logger?.time?.('File validation');
        
        try {
            Logger?.info('Starting file validation', {
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type
            });
            
            // Validate file type
            const allowedTypes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
                'application/vnd.ms-excel' // .xls
            ];

            if (!allowedTypes.includes(file.type)) {
                const error = new Error('Invalid file type');
                Logger?.warn('File type validation failed', null, {
                    expectedTypes: allowedTypes,
                    actualType: file.type,
                    fileName: file.name
                });
                this.showToast('نوع فایل پشتیبانی نمی‌شود. لطفاً فایل Excel انتخاب کنید.', 'error');
                return;
            }

            // Validate file size (max 10MB)
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                Logger?.warn('File size validation failed', null, {
                    fileSize: file.size,
                    maxSize: maxSize,
                    fileName: file.name
                });
                this.showToast('حجم فایل نباید بیشتر از 10 مگابایت باشد.', 'error');
                return;
            }

            // Store file and display info
            AppState.currentFile = file;
            this.displayFileInfo(file);
            
            Logger?.info('File validation successful', {
                fileName: file.name,
                fileSize: file.size,
                validationType: 'passed'
            });
        } catch (error) {
            Logger?.error('Error during file validation', error, {
                fileName: file?.name,
                fileSize: file?.size
            });
            this.showToast('خطا در بررسی فایل', 'error');
        } finally {
            timer?.();
            exitTrace?.();
        }
    }

    /**
     * Display file information
     * @param {File} file - Selected file
     */
    displayFileInfo(file) {
        Elements.fileName.textContent = file.name;
        Elements.fileSize.textContent = NumberUtils.formatFileSize(file.size);
        
        Elements.fileInfo.classList.remove('d-none');
        Elements.processBtn.classList.remove('d-none');
        
        // Add animation
        Elements.fileInfo.classList.add('animate-fade-in-up');
        Elements.processBtn.classList.add('animate-fade-in-up');
    }

    /**
     * Clear selected file
     */
    clearFile() {
        const exitTrace = Logger?.trace?.('ExcelImportApp.clearFile');
        
        try {
            Logger?.info('Clearing selected file', {
                previousFile: AppState.currentFile?.name || 'none'
            });
            
            AppState.currentFile = null;
            Elements.fileInput.value = '';
            Elements.fileInfo.classList.add('d-none');
            Elements.processBtn.classList.add('d-none');
            Elements.uploadProgress.classList.add('d-none');
            
            Logger?.debug('File cleared successfully');
        } catch (error) {
            Logger?.error('Error clearing file', error);
        } finally {
            exitTrace?.();
        }
    }

    /**
     * Process selected file
     */
    async processFile() {
        if (!AppState.currentFile || AppState.isProcessing) {
            Logger?.warn('Process file called but conditions not met', {
                hasFile: !!AppState.currentFile,
                isProcessing: AppState.isProcessing
            });
            return;
        }

        const exitTrace = Logger?.trace?.('ExcelImportApp.processFile');
        const timer = Logger?.time?.('File processing');
        AppState.isProcessing = true;
        const startTime = Date.now();

        try {
            Logger?.info('Starting file processing', {
                fileName: AppState.currentFile.name,
                fileSize: AppState.currentFile.size,
                startTime: new Date().toISOString()
            });
            
            // Show progress
            this.showProgress(0);
            Elements.processBtn.disabled = true;
            Elements.processBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>در حال پردازش...';

            // Simulate processing steps
            await this.simulateProgress();

            // Process Excel file
            Logger?.debug('Calling ExcelProcessor.processFile');
            const result = await ExcelProcessor.processFile(AppState.currentFile);
            
            if (result.success) {
                const processingTime = Date.now() - startTime;
                
                Logger?.info('File processing completed successfully', {
                    fileName: AppState.currentFile.name,
                    recordCount: result.data.length,
                    processingTime: processingTime + 'ms',
                    endTime: new Date().toISOString()
                });
                
                // Update statistics
                this.updateStatistics(result.data.length, processingTime);
                
                // Show success
                this.showProgress(100);
                this.showToast(
                    `فایل با موفقیت پردازش شد. ${NumberUtils.toPersian(result.data.length)} رکورد پردازش گردید.`,
                    'success'
                );
                
                // Display results (could open in modal or new page)
                this.displayResults(result.data);
                
            } else {
                const error = new Error(result.error || 'خطا در پردازش فایل');
                Logger?.error('File processing failed', error, {
                    fileName: AppState.currentFile.name,
                    processingTime: Date.now() - startTime + 'ms',
                    resultError: result.error
                });
                throw error;
            }

        } catch (error) {
            Logger?.error('File processing failed with exception', error, {
                fileName: AppState.currentFile.name,
                processingTime: Date.now() - startTime + 'ms'
            });
            this.showToast('خطا در پردازش فایل: ' + error.message, 'error');
        } finally {
            AppState.isProcessing = false;
            Elements.processBtn.disabled = false;
            Elements.processBtn.innerHTML = '<i class="fas fa-cogs me-2"></i>شروع پردازش';
            
            setTimeout(() => {
                Elements.uploadProgress.classList.add('d-none');
            }, 2000);
            
            timer?.();
            exitTrace?.();
        }
    }

    /**
     * Show upload progress
     * @param {number} percentage - Progress percentage
     */
    showProgress(percentage) {
        Elements.uploadProgress.classList.remove('d-none');
        const progressBar = Elements.uploadProgress.querySelector('.progress-bar');
        progressBar.style.width = `${percentage}%`;
        progressBar.setAttribute('aria-valuenow', percentage);
    }

    /**
     * Simulate processing progress
     */
    async simulateProgress() {
        const steps = [10, 25, 45, 70, 85, 95];
        
        for (const step of steps) {
            this.showProgress(step);
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    }

    /**
     * Display processing results
     * @param {Array} data - Processed data
     */
    displayResults(data) {
        // This could open a modal, navigate to results page, or show inline results
        console.log('Processing results:', data);
        
        // For now, we'll just update the dashboard
        this.updateDashboard();
    }

    /**
     * Update statistics
     * @param {number} recordCount - Number of processed records
     * @param {number} processingTime - Processing time in milliseconds
     */
    updateStatistics(recordCount, processingTime) {
        AppState.statistics.totalUploads++;
        AppState.statistics.successfulProcesses++;
        AppState.statistics.totalRecords += recordCount;
        
        // Calculate average processing time
        AppState.statistics.avgProcessTime = Math.round(
            (AppState.statistics.avgProcessTime + processingTime) / 2
        );

        // Save to localStorage
        this.saveStatistics();
        this.updateDashboard();
    }

    /**
     * Load statistics from localStorage
     */
    loadStatistics() {
        const saved = localStorage.getItem('excelImportStats');
        if (saved) {
            try {
                AppState.statistics = { ...AppState.statistics, ...JSON.parse(saved) };
            } catch (error) {
                Logger.warn('Failed to load statistics from localStorage', error);
            }
        }
        this.updateDashboard();
    }

    /**
     * Save statistics to localStorage
     */
    saveStatistics() {
        try {
            localStorage.setItem('excelImportStats', JSON.stringify(AppState.statistics));
        } catch (error) {
            Logger.warn('Failed to save statistics to localStorage', error);
        }
    }

    /**
     * Update dashboard with current statistics
     */
    updateDashboard() {
        const { statistics } = AppState;
        
        document.getElementById('totalUploads').textContent = NumberUtils.toPersian(statistics.totalUploads);
        document.getElementById('successfulProcesses').textContent = NumberUtils.toPersian(statistics.successfulProcesses);
        document.getElementById('totalRecords').textContent = NumberUtils.toPersian(statistics.totalRecords);
        document.getElementById('avgProcessTime').textContent = NumberUtils.toPersian(Math.round(statistics.avgProcessTime / 1000)) + ' ثانیه';
        
        // Update charts
        this.updateCharts();
    }

    /**
     * Initialize charts
     */
    initializeCharts() {
        // Process Chart
        const processCtx = document.getElementById('processChart');
        if (processCtx) {
            AppState.charts.processChart = new Chart(processCtx, {
                type: 'line',
                data: {
                    labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور'],
                    datasets: [{
                        label: 'تعداد پردازش',
                        data: [12, 19, 3, 5, 2, 3],
                        borderColor: 'rgb(13, 110, 253)',
                        backgroundColor: 'rgba(13, 110, 253, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }

        // File Type Chart
        const fileTypeCtx = document.getElementById('fileTypeChart');
        if (fileTypeCtx) {
            AppState.charts.fileTypeChart = new Chart(fileTypeCtx, {
                type: 'doughnut',
                data: {
                    labels: ['XLSX', 'XLS'],
                    datasets: [{
                        data: [65, 35],
                        backgroundColor: [
                            'rgb(13, 110, 253)',
                            'rgb(25, 135, 84)'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true
                            }
                        }
                    }
                }
            });
        }
    }

    /**
     * Update charts with current data
     */
    updateCharts() {
        // Update charts when new data is available
        // This would be implemented based on actual data structure
    }

    /**
     * Handle scroll events for navbar effects
     */
    handleScroll() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(13, 110, 253, 0.95)';
        } else {
            navbar.style.backgroundColor = '';
        }
    }

    /**
     * Handle smooth scrolling for navigation links
     * @param {Event} event - Click event
     */
    handleSmoothScroll(event) {
        const targetId = event.target.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
            event.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    }

    /**
     * Update current date and time display
     */
    updateDateTime() {
        if (Elements.currentDateTime) {
            const now = new Date();
            const persianDate = PersianCalendar.format(now);
            const time = now.toLocaleTimeString('fa-IR');
            Elements.currentDateTime.textContent = `${persianDate} - ${time}`;
        }
    }

    /**
     * Hide loading spinner
     */
    hideLoading() {
        if (Elements.loadingSpinner) {
            Elements.loadingSpinner.classList.add('fade-out');
            setTimeout(() => {
                Elements.loadingSpinner.style.display = 'none';
            }, 300);
        }
    }

    /**
     * Show toast notification
     * @param {string} message - Toast message
     * @param {string} type - Toast type (success, error, warning, info)
     */
    showToast(message, type = 'info') {
        const toastId = 'toast-' + Date.now();
        const iconMap = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-triangle',
            warning: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };

        const toast = document.createElement('div');
        toast.className = `toast show`;
        toast.id = toastId;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="toast-header">
                <i class="fas ${iconMap[type]} me-2 text-${type === 'error' ? 'danger' : type}"></i>
                <strong class="me-auto">اعلان</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;

        Elements.toastContainer.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            const toastEl = document.getElementById(toastId);
            if (toastEl) {
                const bsToast = new bootstrap.Toast(toastEl);
                bsToast.hide();
                setTimeout(() => toastEl.remove(), 300);
            }
        }, 5000);
    }
}

/**
 * Global utility functions
 */

/**
 * Scroll to specific section
 * @param {string} sectionId - Section ID to scroll to
 */
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Clear selected file (global function for HTML onclick)
 */
function clearFile() {
    if (window.app) {
        window.app.clearFile();
    }
}

/**
 * Process file (global function for HTML onclick)
 */
function processFile() {
    if (window.app) {
        window.app.processFile();
    }
}

/**
 * Application startup
 */
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ExcelImportApp();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ExcelImportApp, AppState };
}