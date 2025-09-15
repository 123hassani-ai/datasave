/**
 * Data Management Module - Enhanced with Excel to SQL Timeline
 * ماژول مدیریت داده‌ها - بروزرسانی شده با تایم‌لاین تبدیل Excel به SQL
 * 
 * این ماژول شامل:
 * - داشبورد اصلی مدیریت داده‌ها
 * - تب جدید Excel to SQL Timeline
 * - تاریخچه پروژه‌ها
 * - تنظیمات سیستم
 * - یکپارچگی با ماژول ExcelToSqlTimeline
 */

class DataManagement {
    constructor() {
        this.currentTab = 'overview';
        this.excelTimeline = null;
        this.projects = [];
        this.stats = {
            totalProjects: 0,
            completedProjects: 0,
            activeProjects: 0,
            totalTables: 0,
            totalRecords: 0
        };
        
        this.initialized = false;
    }

    /**
     * بارگذاری محتوا برای router
     */
    async loadContent() {
        console.log('📊 Loading Data Management content...');
        
        if (!this.initialized) {
            await this.init();
        }
        
        return this.render();
    }

    /**
     * مقداردهی اولیه ماژول
     */
    async init() {
        if (this.initialized) return;
        
        console.log('📊 Initializing Data Management Module...');
        this.loadDependencies();
        await this.loadData();
        
        // Attach event listeners after a short delay
        setTimeout(() => {
            this.attachEventListeners();
        }, 100);
        
        this.initialized = true;
        console.log('✅ Data Management Module initialized');
    }

    /**
     * بارگذاری وابستگی‌ها
     */
    loadDependencies() {
        // تعیین مسیر پایه
        const basePath = this.getBasePath();
        
        // بارگذاری استایل مدیریت داده‌ها
        this.loadStylesheet(`${basePath}/assets/css/admin/modules/data-management.css`);
        
        // بارگذاری استایل تایم‌لاین Excel to SQL
        this.loadStylesheet(`${basePath}/assets/js/admin/modules/excel-to-sql-timeline.css`);
    }

    /**
     * تشخیص مسیر پایه
     */
    getBasePath() {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/datasave/')) {
            return '/datasave';
        }
        return '';
    }

    /**
     * بارگذاری فایل استایل
     */
    loadStylesheet(href) {
        if (!document.querySelector(`link[href="${href}"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onerror = () => {
                console.warn(`⚠️ Could not load stylesheet: ${href}`);
            };
            document.head.appendChild(link);
        }
    }

    /**
     * بارگذاری داده‌ها
     */
    async loadData() {
        try {
            // بارگذاری آمار از API
            const response = await fetch('/datasave/backend/api/v1/data-management.php?action=stats');
            if (response.ok) {
                const data = await response.json();
                this.stats = { ...this.stats, ...data };
            }

            // بارگذاری پروژه‌ها
            const projectsResponse = await fetch('/datasave/backend/api/v1/data-management.php?action=projects');
            if (projectsResponse.ok) {
                const projectsData = await projectsResponse.json();
                this.projects = projectsData;
            }
        } catch (error) {
            console.error('❌ Error loading data:', error);
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

                <!-- Tab Navigation -->
                <nav class="dm-tab-navigation">
                    <div class="dm-tab active" data-tab="overview">
                        <i class="fas fa-tachometer-alt"></i>
                        <span>داشبورد</span>
                    </div>
                    <div class="dm-tab" data-tab="excel-to-sql">
                        <i class="fas fa-exchange-alt"></i>
                        <span>تبدیل Excel به SQL</span>
                    </div>
                    <div class="dm-tab" data-tab="history">
                        <i class="fas fa-history"></i>
                        <span>تاریخچه</span>
                    </div>
                    <div class="dm-tab" data-tab="settings">
                        <i class="fas fa-cog"></i>
                        <span>تنظیمات</span>
                    </div>
                </nav>

                <!-- Tab Content -->
                <main class="dm-content">
                    <!-- Overview Tab -->
                    <div class="dm-tab-content active" id="overview-tab">
                        ${this.renderOverviewTab()}
                    </div>
                    
                    <!-- Excel to SQL Timeline Tab -->
                    <div class="dm-tab-content" id="excel-to-sql-tab">
                        ${this.renderExcelToSqlTab()}
                    </div>
                    
                    <!-- History Tab -->
                    <div class="dm-tab-content" id="history-tab">
                        ${this.renderHistoryTab()}
                    </div>
                    
                    <!-- Settings Tab -->
                    <div class="dm-tab-content" id="settings-tab">
                        ${this.renderSettingsTab()}
                    </div>
                </main>
            </div>
        `;
    }

    /**
     * رندر تب داشبورد (Overview)
     */
    renderOverviewTab() {
        return `
            <div class="dm-overview">
                <!-- Stats Cards -->
                <div class="dm-stats-grid">
                    <div class="dm-stat-card primary">
                        <div class="dm-stat-icon">
                            <i class="fas fa-project-diagram"></i>
                        </div>
                        <div class="dm-stat-content">
                            <h3>${this.stats.totalProjects}</h3>
                            <p>کل پروژه‌ها</p>
                        </div>
                        <div class="dm-stat-trend positive">
                            <i class="fas fa-arrow-up"></i>
                            <span>+12%</span>
                        </div>
                    </div>
                    
                    <div class="dm-stat-card success">
                        <div class="dm-stat-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="dm-stat-content">
                            <h3>${this.stats.completedProjects}</h3>
                            <p>پروژه‌های تکمیل شده</p>
                        </div>
                        <div class="dm-stat-trend positive">
                            <i class="fas fa-arrow-up"></i>
                            <span>+8%</span>
                        </div>
                    </div>
                    
                    <div class="dm-stat-card warning">
                        <div class="dm-stat-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="dm-stat-content">
                            <h3>${this.stats.activeProjects}</h3>
                            <p>پروژه‌های فعال</p>
                        </div>
                        <div class="dm-stat-trend neutral">
                            <i class="fas fa-minus"></i>
                            <span>0%</span>
                        </div>
                    </div>
                    
                    <div class="dm-stat-card info">
                        <div class="dm-stat-icon">
                            <i class="fas fa-table"></i>
                        </div>
                        <div class="dm-stat-content">
                            <h3>${this.stats.totalTables}</h3>
                            <p>جداول ایجاد شده</p>
                        </div>
                        <div class="dm-stat-trend positive">
                            <i class="fas fa-arrow-up"></i>
                            <span>+25%</span>
                        </div>
                    </div>
                </div>

                <!-- Recent Projects -->
                <div class="dm-section">
                    <div class="dm-section-header">
                        <h2>پروژه‌های اخیر</h2>
                        <button class="dm-btn secondary sm" onclick="window.dataManagement.showTab('history')">
                            <i class="fas fa-eye"></i>
                            مشاهده همه
                        </button>
                    </div>
                    <div class="dm-projects-list">
                        ${this.renderRecentProjects()}
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="dm-section">
                    <div class="dm-section-header">
                        <h2>اقدامات سریع</h2>
                    </div>
                    <div class="dm-quick-actions">
                        <div class="dm-action-card" onclick="window.dataManagement.startNewProject()">
                            <div class="dm-action-icon">
                                <i class="fas fa-plus-circle"></i>
                            </div>
                            <h3>پروژه جدید</h3>
                            <p>شروع تبدیل فایل Excel جدید</p>
                        </div>
                        
                        <div class="dm-action-card" onclick="window.dataManagement.showTab('history')">
                            <div class="dm-action-icon">
                                <i class="fas fa-history"></i>
                            </div>
                            <h3>تاریخچه</h3>
                            <p>مشاهده پروژه‌های قبلی</p>
                        </div>
                        
                        <div class="dm-action-card" onclick="window.dataManagement.showTab('settings')">
                            <div class="dm-action-icon">
                                <i class="fas fa-cog"></i>
                            </div>
                            <h3>تنظیمات</h3>
                            <p>پیکربندی سیستم</p>
                        </div>
                        
                        <div class="dm-action-card" onclick="window.dataManagement.showHelp()">
                            <div class="dm-action-icon">
                                <i class="fas fa-question-circle"></i>
                            </div>
                            <h3>راهنما</h3>
                            <p>نحوه استفاده از سیستم</p>
                        </div>
                    </div>
                </div>

                <!-- System Status -->
                <div class="dm-section">
                    <div class="dm-section-header">
                        <h2>وضعیت سیستم</h2>
                    </div>
                    <div class="dm-system-status">
                        <div class="dm-status-item">
                            <div class="dm-status-indicator success"></div>
                            <span>پایگاه داده MySQL</span>
                            <span class="dm-status-value">متصل</span>
                        </div>
                        
                        <div class="dm-status-item">
                            <div class="dm-status-indicator success"></div>
                            <span>API هوش مصنوعی</span>
                            <span class="dm-status-value">آماده</span>
                        </div>
                        
                        <div class="dm-status-item">
                            <div class="dm-status-indicator warning"></div>
                            <span>فضای ذخیره‌سازی</span>
                            <span class="dm-status-value">75% استفاده</span>
                        </div>
                        
                        <div class="dm-status-item">
                            <div class="dm-status-indicator success"></div>
                            <span>سرویس پردازش</span>
                            <span class="dm-status-value">فعال</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * رندر تب تایم‌لاین Excel to SQL
     */
    renderExcelToSqlTab() {
        return `
            <div class="dm-excel-to-sql">
                <div class="dm-timeline-header">
                    <div class="dm-timeline-intro">
                        <h2>تبدیل فایل Excel به پایگاه داده MySQL</h2>
                        <p>با استفاده از هوش مصنوعی، فایل Excel خود را به یک پایگاه داده MySQL کامل تبدیل کنید</p>
                    </div>
                    
                    <div class="dm-timeline-features">
                        <div class="dm-feature">
                            <i class="fas fa-robot"></i>
                            <span>هوش مصنوعی</span>
                        </div>
                        <div class="dm-feature">
                            <i class="fas fa-comments"></i>
                            <span>چت تعاملی</span>
                        </div>
                        <div class="dm-feature">
                            <i class="fas fa-magic"></i>
                            <span>تبدیل خودکار</span>
                        </div>
                        <div class="dm-feature">
                            <i class="fas fa-shield-alt"></i>
                            <span>امن و قابل اعتماد</span>
                        </div>
                    </div>
                </div>
                
                <!-- Timeline Container -->
                <div id="excel-to-sql-timeline-container">
                    <div class="dm-timeline-loading">
                        <div class="dm-spinner"></div>
                        <p>در حال بارگذاری تایم‌لاین...</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * رندر تب تاریخچه
     */
    renderHistoryTab() {
        return `
            <div class="dm-history">
                <div class="dm-history-header">
                    <h2>تاریخچه پروژه‌ها</h2>
                    <div class="dm-history-filters">
                        <select class="dm-form-control" id="statusFilter">
                            <option value="">همه وضعیت‌ها</option>
                            <option value="completed">تکمیل شده</option>
                            <option value="failed">ناموفق</option>
                            <option value="in_progress">در حال انجام</option>
                        </select>
                        
                        <select class="dm-form-control" id="dateFilter">
                            <option value="">همه تاریخ‌ها</option>
                            <option value="today">امروز</option>
                            <option value="week">این هفته</option>
                            <option value="month">این ماه</option>
                        </select>
                        
                        <button class="dm-btn secondary" id="exportHistoryBtn">
                            <i class="fas fa-download"></i>
                            خروجی Excel
                        </button>
                    </div>
                </div>
                
                <div class="dm-history-content">
                    ${this.renderProjectsHistory()}
                </div>
            </div>
        `;
    }

    /**
     * رندر تب تنظیمات
     */
    renderSettingsTab() {
        return `
            <div class="dm-settings">
                <div class="dm-settings-grid">
                    <!-- Database Settings -->
                    <div class="dm-settings-card">
                        <div class="dm-settings-header">
                            <h3><i class="fas fa-database"></i> تنظیمات پایگاه داده</h3>
                        </div>
                        <div class="dm-settings-body">
                            <div class="dm-form-group">
                                <label class="dm-form-label">سرور پایگاه داده</label>
                                <input type="text" class="dm-form-control" value="localhost" readonly>
                            </div>
                            
                            <div class="dm-form-group">
                                <label class="dm-form-label">پورت</label>
                                <input type="number" class="dm-form-control" value="3306" readonly>
                            </div>
                            
                            <div class="dm-form-group">
                                <label class="dm-form-label">رمزگذاری</label>
                                <select class="dm-form-control">
                                    <option value="utf8mb4">UTF8MB4</option>
                                    <option value="utf8">UTF8</option>
                                </select>
                            </div>
                            
                            <button class="dm-btn primary">
                                <i class="fas fa-save"></i>
                                ذخیره تنظیمات
                            </button>
                        </div>
                    </div>

                    <!-- AI Settings -->
                    <div class="dm-settings-card">
                        <div class="dm-settings-header">
                            <h3><i class="fas fa-robot"></i> تنظیمات هوش مصنوعی</h3>
                        </div>
                        <div class="dm-settings-body">
                            <div class="dm-form-group">
                                <label class="dm-form-label">ارائه‌دهنده AI</label>
                                <select class="dm-form-control">
                                    <option value="openai">OpenAI</option>
                                    <option value="google">Google AI</option>
                                    <option value="anthropic">Anthropic</option>
                                </select>
                            </div>
                            
                            <div class="dm-form-group">
                                <label class="dm-form-label">مدل</label>
                                <select class="dm-form-control">
                                    <option value="gpt-4">GPT-4</option>
                                    <option value="gpt-3.5">GPT-3.5 Turbo</option>
                                </select>
                            </div>
                            
                            <div class="dm-form-group">
                                <label class="dm-form-label">دما (Temperature)</label>
                                <input type="range" class="dm-form-range" min="0" max="1" step="0.1" value="0.7">
                                <span class="dm-range-value">0.7</span>
                            </div>
                            
                            <button class="dm-btn success" onclick="window.dataManagement.testAI()">
                                <i class="fas fa-vial"></i>
                                تست اتصال AI
                            </button>
                        </div>
                    </div>

                    <!-- Processing Settings -->
                    <div class="dm-settings-card">
                        <div class="dm-settings-header">
                            <h3><i class="fas fa-cogs"></i> تنظیمات پردازش</h3>
                        </div>
                        <div class="dm-settings-body">
                            <div class="dm-form-group">
                                <label class="dm-form-label">حداکثر اندازه فایل (MB)</label>
                                <input type="number" class="dm-form-control" value="50">
                            </div>
                            
                            <div class="dm-form-group">
                                <label class="dm-form-label">اندازه دسته (Batch Size)</label>
                                <input type="number" class="dm-form-control" value="1000">
                            </div>
                            
                            <div class="dm-form-group">
                                <label class="dm-form-label">زمان انتظار (ثانیه)</label>
                                <input type="number" class="dm-form-control" value="30">
                            </div>
                            
                            <div class="dm-form-group">
                                <label class="dm-checkbox">
                                    <input type="checkbox" checked>
                                    <span class="dm-checkmark"></span>
                                    پشتیبان‌گیری خودکار
                                </label>
                            </div>
                            
                            <div class="dm-form-group">
                                <label class="dm-checkbox">
                                    <input type="checkbox" checked>
                                    <span class="dm-checkmark"></span>
                                    اعتبارسنجی داده‌ها
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Notification Settings -->
                    <div class="dm-settings-card">
                        <div class="dm-settings-header">
                            <h3><i class="fas fa-bell"></i> تنظیمات اعلان‌ها</h3>
                        </div>
                        <div class="dm-settings-body">
                            <div class="dm-form-group">
                                <label class="dm-checkbox">
                                    <input type="checkbox" checked>
                                    <span class="dm-checkmark"></span>
                                    اعلان تکمیل پروژه
                                </label>
                            </div>
                            
                            <div class="dm-form-group">
                                <label class="dm-checkbox">
                                    <input type="checkbox">
                                    <span class="dm-checkmark"></span>
                                    اعلان خطاها
                                </label>
                            </div>
                            
                            <div class="dm-form-group">
                                <label class="dm-checkbox">
                                    <input type="checkbox" checked>
                                    <span class="dm-checkmark"></span>
                                    ایمیل گزارش روزانه
                                </label>
                            </div>
                            
                            <div class="dm-form-group">
                                <label class="dm-form-label">ایمیل دریافت اعلان‌ها</label>
                                <input type="email" class="dm-form-control" placeholder="admin@example.com">
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Global Actions -->
                <div class="dm-settings-actions">
                    <button class="dm-btn success lg">
                        <i class="fas fa-save"></i>
                        ذخیره همه تنظیمات
                    </button>
                    
                    <button class="dm-btn secondary lg">
                        <i class="fas fa-undo"></i>
                        بازگردانی پیش‌فرض
                    </button>
                    
                    <button class="dm-btn warning lg">
                        <i class="fas fa-download"></i>
                        پشتیبان تنظیمات
                    </button>
                    
                    <button class="dm-btn danger lg">
                        <i class="fas fa-trash"></i>
                        پاک‌سازی کامل
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * رندر پروژه‌های اخیر
     */
    renderRecentProjects() {
        if (this.projects.length === 0) {
            return `
                <div class="dm-empty-state">
                    <div class="dm-empty-icon">
                        <i class="fas fa-folder-open"></i>
                    </div>
                    <h3>هیچ پروژه‌ای یافت نشد</h3>
                    <p>برای شروع، پروژه جدیدی ایجاد کنید</p>
                    <button class="dm-btn primary" onclick="window.dataManagement.startNewProject()">
                        <i class="fas fa-plus"></i>
                        پروژه جدید
                    </button>
                </div>
            `;
        }

        return this.projects.slice(0, 5).map(project => `
            <div class="dm-project-item">
                <div class="dm-project-icon">
                    <i class="fas fa-file-excel"></i>
                </div>
                <div class="dm-project-info">
                    <h4>${project.name}</h4>
                    <p>${project.file_name}</p>
                    <small>${this.formatDate(project.created_at)}</small>
                </div>
                <div class="dm-project-status">
                    <span class="dm-status-badge ${project.status}">${this.getStatusLabel(project.status)}</span>
                </div>
                <div class="dm-project-actions">
                    <button class="dm-btn secondary xs" onclick="window.dataManagement.viewProject(${project.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="dm-btn danger xs" onclick="window.dataManagement.deleteProject(${project.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    /**
     * رندر تاریخچه پروژه‌ها
     */
    renderProjectsHistory() {
        if (this.projects.length === 0) {
            return `
                <div class="dm-empty-state">
                    <div class="dm-empty-icon">
                        <i class="fas fa-history"></i>
                    </div>
                    <h3>تاریخچه‌ای وجود ندارد</h3>
                    <p>هنوز هیچ پروژه‌ای تکمیل نشده است</p>
                </div>
            `;
        }

        return `
            <div class="dm-history-table-container">
                <table class="dm-table">
                    <thead>
                        <tr>
                            <th>نام پروژه</th>
                            <th>فایل</th>
                            <th>وضعیت</th>
                            <th>تاریخ ایجاد</th>
                            <th>تاریخ تکمیل</th>
                            <th>عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.projects.map(project => `
                            <tr>
                                <td>${project.name}</td>
                                <td>
                                    <div class="dm-file-info">
                                        <i class="fas fa-file-excel"></i>
                                        <span>${project.file_name}</span>
                                    </div>
                                </td>
                                <td>
                                    <span class="dm-status-badge ${project.status}">
                                        ${this.getStatusLabel(project.status)}
                                    </span>
                                </td>
                                <td>${this.formatDate(project.created_at)}</td>
                                <td>${project.completed_at ? this.formatDate(project.completed_at) : '-'}</td>
                                <td>
                                    <div class="dm-action-buttons">
                                        <button class="dm-btn secondary xs" onclick="window.dataManagement.viewProject(${project.id})" title="مشاهده">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="dm-btn primary xs" onclick="window.dataManagement.downloadReport(${project.id})" title="دانلود گزارش">
                                            <i class="fas fa-download"></i>
                                        </button>
                                        <button class="dm-btn danger xs" onclick="window.dataManagement.deleteProject(${project.id})" title="حذف">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    /**
     * اتصال رویدادها
     */
    attachEventListeners() {
        // Tab navigation
        document.querySelectorAll('.dm-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.getAttribute('data-tab');
                this.showTab(tabName);
            });
        });

        // Header buttons
        document.getElementById('newProjectBtn')?.addEventListener('click', () => {
            this.startNewProject();
        });

        document.getElementById('refreshBtn')?.addEventListener('click', () => {
            this.refreshData();
        });

        // Range input updates
        document.querySelectorAll('.dm-form-range').forEach(range => {
            range.addEventListener('input', (e) => {
                const valueSpan = e.target.nextElementSibling;
                if (valueSpan && valueSpan.classList.contains('dm-range-value')) {
                    valueSpan.textContent = e.target.value;
                }
            });
        });

        // Filter changes in history
        document.getElementById('statusFilter')?.addEventListener('change', () => {
            this.filterHistory();
        });

        document.getElementById('dateFilter')?.addEventListener('change', () => {
            this.filterHistory();
        });

        // Export history
        document.getElementById('exportHistoryBtn')?.addEventListener('click', () => {
            this.exportHistory();
        });
    }

    /**
     * نمایش تب مشخص
     */
    showTab(tabName) {
        // Update active tab
        document.querySelectorAll('.dm-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

        // Update active content
        document.querySelectorAll('.dm-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`)?.classList.add('active');

        // Store current tab
        this.currentTab = tabName;

        // Handle special tab loading
        if (tabName === 'excel-to-sql') {
            this.loadExcelToSqlTimeline();
        }

        console.log(`📋 Switched to tab: ${tabName}`);
    }

    /**
     * بارگذاری تایم‌لاین Excel to SQL
     */
    loadExcelToSqlTimeline() {
        const container = document.getElementById('excel-to-sql-timeline-container');
        if (!container) return;

        // Wait for ExcelToSqlTimeline class to be available
        if (typeof window.ExcelToSqlTimeline === 'undefined') {
            setTimeout(() => this.loadExcelToSqlTimeline(), 500);
            return;
        }

        // Clear loading state
        container.innerHTML = '';

        try {
            // Initialize timeline
            this.excelTimeline = new window.ExcelToSqlTimeline(container);
            console.log('✅ Excel to SQL Timeline initialized');
        } catch (error) {
            console.error('❌ Error initializing timeline:', error);
            container.innerHTML = `
                <div class="dm-error-state">
                    <div class="dm-error-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3>خطا در بارگذاری تایم‌لاین</h3>
                    <p>لطفاً صفحه را تازه‌سازی کنید</p>
                    <button class="dm-btn primary" onclick="location.reload()">
                        <i class="fas fa-sync-alt"></i>
                        تازه‌سازی
                    </button>
                </div>
            `;
        }
    }

    /**
     * شروع پروژه جدید
     */
    startNewProject() {
        // Switch to Excel to SQL tab
        this.showTab('excel-to-sql');
        
        // Reset timeline if exists
        if (this.excelTimeline && typeof this.excelTimeline.reset === 'function') {
            this.excelTimeline.reset();
        }

        console.log('🚀 Starting new project');
    }

    /**
     * تازه‌سازی داده‌ها
     */
    async refreshData() {
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> در حال بروزرسانی...';
            refreshBtn.disabled = true;
        }

        try {
            await this.loadData();
            
            // Re-render current tab content
            const activeTab = document.querySelector('.dm-tab-content.active');
            if (activeTab) {
                switch (this.currentTab) {
                    case 'overview':
                        activeTab.innerHTML = this.renderOverviewTab();
                        break;
                    case 'history':
                        activeTab.innerHTML = this.renderHistoryTab();
                        break;
                    case 'settings':
                        activeTab.innerHTML = this.renderSettingsTab();
                        break;
                }
            }

            this.showNotification('داده‌ها با موفقیت بروزرسانی شد', 'success');
        } catch (error) {
            console.error('❌ Error refreshing data:', error);
            this.showNotification('خطا در بروزرسانی داده‌ها', 'error');
        } finally {
            if (refreshBtn) {
                refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> تازه‌سازی';
                refreshBtn.disabled = false;
            }
        }
    }

    /**
     * مشاهده پروژه
     */
    viewProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        // Create modal for project details
        const modal = document.createElement('div');
        modal.className = 'dm-modal';
        modal.innerHTML = `
            <div class="dm-modal-content">
                <div class="dm-modal-header">
                    <h3>جزئیات پروژه: ${project.name}</h3>
                    <button class="dm-modal-close">&times;</button>
                </div>
                <div class="dm-modal-body">
                    <div class="dm-project-details">
                        <div class="dm-detail-group">
                            <label>نام پروژه:</label>
                            <span>${project.name}</span>
                        </div>
                        <div class="dm-detail-group">
                            <label>فایل:</label>
                            <span>${project.file_name}</span>
                        </div>
                        <div class="dm-detail-group">
                            <label>وضعیت:</label>
                            <span class="dm-status-badge ${project.status}">${this.getStatusLabel(project.status)}</span>
                        </div>
                        <div class="dm-detail-group">
                            <label>تاریخ ایجاد:</label>
                            <span>${this.formatDate(project.created_at)}</span>
                        </div>
                        <div class="dm-detail-group">
                            <label>تاریخ تکمیل:</label>
                            <span>${project.completed_at ? this.formatDate(project.completed_at) : 'در حال انجام'}</span>
                        </div>
                        <div class="dm-detail-group">
                            <label>دیتابیس ایجاد شده:</label>
                            <span>${project.database_name || 'نامشخص'}</span>
                        </div>
                        <div class="dm-detail-group">
                            <label>توضیحات:</label>
                            <span>${project.description || 'بدون توضیحات'}</span>
                        </div>
                    </div>
                </div>
                <div class="dm-modal-footer">
                    <button class="dm-btn primary" onclick="window.dataManagement.downloadReport(${projectId})">
                        <i class="fas fa-download"></i>
                        دانلود گزارش
                    </button>
                    <button class="dm-btn secondary" onclick="this.closest('.dm-modal').remove()">
                        بستن
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle close
        modal.querySelector('.dm-modal-close').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }

    /**
     * حذف پروژه
     */
    async deleteProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        const confirmed = confirm(`آیا از حذف پروژه "${project.name}" مطمئن هستید؟`);
        if (!confirmed) return;

        try {
            const response = await fetch(`/datasave/backend/api/v1/data-management.php?action=delete&id=${projectId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.projects = this.projects.filter(p => p.id !== projectId);
                this.refreshData();
                this.showNotification('پروژه با موفقیت حذف شد', 'success');
            } else {
                throw new Error('خطا در حذف پروژه');
            }
        } catch (error) {
            console.error('❌ Error deleting project:', error);
            this.showNotification('خطا در حذف پروژه', 'error');
        }
    }

    /**
     * دانلود گزارش پروژه
     */
    async downloadReport(projectId) {
        try {
            const response = await fetch(`/datasave/backend/api/v1/data-management.php?action=report&id=${projectId}`);
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `project_${projectId}_report.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                this.showNotification('گزارش دانلود شد', 'success');
            } else {
                throw new Error('خطا در دانلود گزارش');
            }
        } catch (error) {
            console.error('❌ Error downloading report:', error);
            this.showNotification('خطا در دانلود گزارش', 'error');
        }
    }

    /**
     * فیلتر تاریخچه
     */
    filterHistory() {
        const statusFilter = document.getElementById('statusFilter')?.value;
        const dateFilter = document.getElementById('dateFilter')?.value;

        let filteredProjects = [...this.projects];

        // Filter by status
        if (statusFilter) {
            filteredProjects = filteredProjects.filter(project => project.status === statusFilter);
        }

        // Filter by date
        if (dateFilter) {
            const now = new Date();
            filteredProjects = filteredProjects.filter(project => {
                const projectDate = new Date(project.created_at);
                switch (dateFilter) {
                    case 'today':
                        return projectDate.toDateString() === now.toDateString();
                    case 'week':
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return projectDate >= weekAgo;
                    case 'month':
                        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        return projectDate >= monthAgo;
                    default:
                        return true;
                }
            });
        }

        // Update display
        const historyContent = document.querySelector('.dm-history-content');
        if (historyContent) {
            const originalProjects = this.projects;
            this.projects = filteredProjects;
            historyContent.innerHTML = this.renderProjectsHistory();
            this.projects = originalProjects;
        }
    }

    /**
     * خروجی تاریخچه
     */
    async exportHistory() {
        try {
            const csvContent = this.generateCSV(this.projects);
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `projects_history_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            this.showNotification('فایل Excel تاریخچه دانلود شد', 'success');
        } catch (error) {
            console.error('❌ Error exporting history:', error);
            this.showNotification('خطا در خروجی تاریخچه', 'error');
        }
    }

    /**
     * تولید CSV از داده‌ها
     */
    generateCSV(projects) {
        const headers = ['نام پروژه', 'فایل', 'وضعیت', 'تاریخ ایجاد', 'تاریخ تکمیل', 'دیتابیس'];
        const rows = projects.map(project => [
            project.name,
            project.file_name,
            this.getStatusLabel(project.status),
            this.formatDate(project.created_at),
            project.completed_at ? this.formatDate(project.completed_at) : '',
            project.database_name || ''
        ]);

        return [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
    }

    /**
     * تست اتصال AI
     */
    async testAI() {
        const testBtn = document.querySelector('button[onclick="window.dataManagement.testAI()"]');
        if (testBtn) {
            testBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال تست...';
            testBtn.disabled = true;
        }

        try {
            const response = await fetch('/datasave/backend/api/v1/ai-test.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'test connection'
                })
            });

            if (response.ok) {
                const result = await response.json();
                this.showNotification('اتصال AI موفقیت‌آمیز است', 'success');
            } else {
                throw new Error('خطا در اتصال');
            }
        } catch (error) {
            console.error('❌ AI test failed:', error);
            this.showNotification('خطا در اتصال به AI', 'error');
        } finally {
            if (testBtn) {
                testBtn.innerHTML = '<i class="fas fa-vial"></i> تست اتصال AI';
                testBtn.disabled = false;
            }
        }
    }

    /**
     * نمایش راهنما
     */
    showHelp() {
        const modal = document.createElement('div');
        modal.className = 'dm-modal';
        modal.innerHTML = `
            <div class="dm-modal-content large">
                <div class="dm-modal-header">
                    <h3>راهنمای استفاده از سیستم</h3>
                    <button class="dm-modal-close">&times;</button>
                </div>
                <div class="dm-modal-body">
                    <div class="dm-help-content">
                        <div class="dm-help-section">
                            <h4><i class="fas fa-play"></i> شروع سریع</h4>
                            <ol>
                                <li>بر روی "پروژه جدید" کلیک کنید</li>
                                <li>فایل Excel خود را آپلود کنید</li>
                                <li>مراحل تایم‌لاین را دنبال کنید</li>
                                <li>با هوش مصنوعی در مورد ساختار بحث کنید</li>
                                <li>تایید نهایی و ایجاد دیتابیس</li>
                            </ol>
                        </div>
                        
                        <div class="dm-help-section">
                            <h4><i class="fas fa-file-excel"></i> فایل‌های پشتیبانی شده</h4>
                            <ul>
                                <li>فرمت: .xlsx، .xls</li>
                                <li>حداکثر اندازه: 50 مگابایت</li>
                                <li>داده‌های ساختاریافته</li>
                            </ul>
                        </div>
                        
                        <div class="dm-help-section">
                            <h4><i class="fas fa-robot"></i> نکات کار با هوش مصنوعی</h4>
                            <ul>
                                <li>سوالات خود را واضح بپرسید</li>
                                <li>از نام‌های معنادار برای فیلدها استفاده کنید</li>
                                <li>ساختار پیشنهادی را بررسی کنید</li>
                            </ul>
                        </div>
                        
                        <div class="dm-help-section">
                            <h4><i class="fas fa-question-circle"></i> رفع مشکلات رایج</h4>
                            <ul>
                                <li>اگر آپلود متوقف شد، اندازه فایل را بررسی کنید</li>
                                <li>در صورت خطای AI، اتصال اینترنت را چک کنید</li>
                                <li>برای فایل‌های بزرگ، صبور باشید</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="dm-modal-footer">
                    <button class="dm-btn primary" onclick="this.closest('.dm-modal').remove()">
                        متوجه شدم
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle close
        modal.querySelector('.dm-modal-close').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }

    /**
     * نمایش نوتیفیکیشن
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `dm-notification ${type}`;
        notification.innerHTML = `
            <div class="dm-notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="dm-notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
    }

    /**
     * فرمت کردن تاریخ
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * دریافت برچسب وضعیت
     */
    getStatusLabel(status) {
        const labels = {
            'pending': 'در انتظار',
            'in_progress': 'در حال انجام',
            'completed': 'تکمیل شده',
            'failed': 'ناموفق',
            'cancelled': 'لغو شده'
        };
        return labels[status] || status;
    }

    /**
     * دریافت داده‌های پروژه
     */
    getProjects() {
        return this.projects;
    }

    /**
     * دریافت آمار
     */
    getStats() {
        return this.stats;
    }

    /**
     * دریافت تب فعلی
     */
    getCurrentTab() {
        return this.currentTab;
    }

    /**
     * دریافت نمونه تایم‌لاین
     */
    getTimelineInstance() {
        return this.excelTimeline;
    }

    /**
     * تخریب ماژول
     */
    destroy() {
        // Destroy timeline if exists
        if (this.excelTimeline && typeof this.excelTimeline.destroy === 'function') {
            this.excelTimeline.destroy();
        }

        // Clear data
        this.projects = [];
        this.stats = {};
        this.currentTab = 'overview';
        this.excelTimeline = null;

        console.log('🗑️ Data Management Module destroyed');
    }
}

// Initialize global instance
if (typeof window !== 'undefined') {
    window.DataManagement = DataManagement;
    
}

// Create instance for export and global use
const dataManagementInstance = new DataManagement();

// Make available globally for testing
if (typeof window !== 'undefined') {
    window.DataManagement = DataManagement;
    window.dataManagement = dataManagementInstance;
}

// ES6 Module Export for router
export default dataManagementInstance;