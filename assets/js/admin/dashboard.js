/**
 * DataSave Admin Dashboard - Dashboard Module
 * @description مدیریت صفحه داشبورد اصلی
 * @author DataSave Team
 * @version 1.0.0
 */

'use strict';

/**
 * Dashboard module for admin panel
 * ماژول داشبورد برای پنل ادمین
 */
const AdminDashboard = {
    // حالت ماژول
    // Module state
    state: {
        stats: {},
        charts: {},
        refreshInterval: null,
        isAutoRefresh: true,
        lastUpdate: null
    },

    // کش عناصر DOM
    // DOM elements cache
    elements: {},

    /**
     * مقداردهی ماژول داشبورد
     * Initialize dashboard module
     */
    init() {
        const exitTrace = Logger.trace?.('AdminDashboard.init');
        
        try {
            Logger.info('مقداردهی ماژول داشبورد شروع شد', {
                module: 'AdminDashboard',
                action: 'init'
            });
            
            this.cacheElements();
            this.bindEvents();
            this.loadDashboardData();
            this.initializeCharts();
            this.startAutoRefresh();
            
            Logger.info('ماژول داشبورد با موفقیت مقداردهی شد');
        } catch (error) {
            Logger.error('خطا در مقداردهی ماژول داشبورد', error);
            AdminUtils?.showToast('خطا در بارگذاری داشبورد', 'error');
        } finally {
            exitTrace?.();
        }
    },

    /**
     * کش کردن عناصر DOM
     * Cache DOM elements
     */
    cacheElements() {
        this.elements = {
            dashboardContent: document.getElementById('dashboardContent'),
            statsCards: document.querySelectorAll('.quick-stat-card'),
            chartContainers: document.querySelectorAll('.chart-container'),
            refreshButton: document.querySelector('[data-action="refresh"]'),
            lastUpdateTime: document.getElementById('lastUpdateTime')
        };
    },

    /**
     * اتصال رویدادها
     * Bind events
     */
    bindEvents() {
        // رویداد refresh دستی
        // Manual refresh event
        if (this.elements.refreshButton) {
            this.elements.refreshButton.addEventListener('click', this.handleManualRefresh.bind(this));
        }

        // رویداد تغییر صفحه
        // Page change event
        document.addEventListener('contentPageChanged', this.handlePageChange.bind(this));

        // رویداد resize window
        // Window resize event
        window.addEventListener('resize', AdminUtils?.throttle(this.handleResize.bind(this), 250));
    },

    /**
     * بارگذاری داده‌های داشبورد
     * Load dashboard data
     */
    async loadDashboardData() {
        const timer = Logger.time?.('AdminDashboard.loadDashboardData');
        
        try {
            // نمایش loading
            // Show loading state
            this.showLoading();
            
            // بارگذاری آمار
            // Load statistics
            await this.loadStatistics();
            
            // رندر محتوای داشبورد
            // Render dashboard content
            this.renderDashboard();
            
            // به‌روزرسانی زمان آخرین بروزرسانی
            // Update last update time
            this.updateLastUpdateTime();
            
            Logger.info('داده‌های داشبورد با موفقیت بارگذاری شد');
            
        } catch (error) {
            Logger.error('خطا در بارگذاری داده‌های داشبورد', error);
            this.showError('خطا در بارگذاری داشبورد');
        } finally {
            this.hideLoading();
            timer?.();
        }
    },

    /**
     * بارگذاری آمار
     * Load statistics
     */
    async loadStatistics() {
        // شبیه‌سازی بارگذاری آمار
        // Simulate loading statistics
        return new Promise((resolve) => {
            setTimeout(() => {
                this.state.stats = {
                    totalUsers: 1247,
                    totalForms: 89,
                    totalCustomers: 3456,
                    monthlyGrowth: 12.5,
                    systemLoad: 67,
                    activeUsers: 156,
                    pendingTasks: 23,
                    completedTasks: 145
                };
                resolve(this.state.stats);
            }, 1000);
        });
    },

    /**
     * رندر داشبورد
     * Render dashboard
     */
    renderDashboard() {
        if (!this.elements.dashboardContent) return;

        const dashboardHTML = `
            <!-- Quick Stats -->
            <div class="quick-stats">
                <div class="quick-stat-card" data-stat="users">
                    <div class="stat-icon-wrapper primary">
                        <i class="fas fa-users stat-icon"></i>
                    </div>
                    <div class="stat-content">
                        <h3>${this.formatNumber(this.state.stats.totalUsers)}</h3>
                        <p>کل کاربران</p>
                        <div class="stat-trend up">
                            <i class="fas fa-arrow-up"></i>
                            <span>+${this.state.stats.monthlyGrowth}%</span>
                        </div>
                    </div>
                </div>

                <div class="quick-stat-card" data-stat="forms">
                    <div class="stat-icon-wrapper success">
                        <i class="fas fa-file-alt stat-icon"></i>
                    </div>
                    <div class="stat-content">
                        <h3>${this.formatNumber(this.state.stats.totalForms)}</h3>
                        <p>فرم‌های فعال</p>
                        <div class="stat-trend up">
                            <i class="fas fa-arrow-up"></i>
                            <span>+8.2%</span>
                        </div>
                    </div>
                </div>

                <div class="quick-stat-card" data-stat="customers">
                    <div class="stat-icon-wrapper warning">
                        <i class="fas fa-handshake stat-icon"></i>
                    </div>
                    <div class="stat-content">
                        <h3>${this.formatNumber(this.state.stats.totalCustomers)}</h3>
                        <p>مشتریان</p>
                        <div class="stat-trend up">
                            <i class="fas fa-arrow-up"></i>
                            <span>+15.7%</span>
                        </div>
                    </div>
                </div>

                <div class="quick-stat-card" data-stat="load">
                    <div class="stat-icon-wrapper info">
                        <i class="fas fa-tachometer-alt stat-icon"></i>
                    </div>
                    <div class="stat-content">
                        <h3>${this.state.stats.systemLoad}%</h3>
                        <p>بار سیستم</p>
                        <div class="stat-trend ${this.state.stats.systemLoad > 80 ? 'down' : 'up'}">
                            <i class="fas fa-${this.state.stats.systemLoad > 80 ? 'arrow-down' : 'arrow-up'}"></i>
                            <span>عادی</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Charts Section -->
            <div class="dashboard-charts">
                <div class="chart-card">
                    <div class="chart-header">
                        <h5 class="chart-title">
                            <i class="fas fa-chart-line me-2"></i>
                            آمار عملکرد ماهانه
                        </h5>
                        <div class="chart-actions">
                            <select class="form-select form-select-sm">
                                <option>6 ماه گذشته</option>
                                <option>سال جاری</option>
                                <option>سال گذشته</option>
                            </select>
                        </div>
                    </div>
                    <div class="chart-body">
                        <canvas id="performanceChart" width="400" height="200"></canvas>
                    </div>
                </div>

                <div class="chart-card">
                    <div class="chart-header">
                        <h5 class="chart-title">
                            <i class="fas fa-pie-chart me-2"></i>
                            توزیع کاربران
                        </h5>
                    </div>
                    <div class="chart-body">
                        <canvas id="usersChart" width="200" height="200"></canvas>
                    </div>
                </div>
            </div>

            <!-- Recent Activity & Quick Actions -->
            <div class="dashboard-widgets">
                <div class="widget-card recent-activity">
                    <div class="widget-header">
                        <h5 class="widget-title">
                            <i class="fas fa-clock me-2"></i>
                            فعالیت‌های اخیر
                        </h5>
                        <a href="#" class="widget-action">مشاهده همه</a>
                    </div>
                    <div class="widget-body">
                        <div class="activity-list">
                            <div class="activity-item">
                                <div class="activity-icon success">
                                    <i class="fas fa-user-plus"></i>
                                </div>
                                <div class="activity-content">
                                    <p class="activity-text">کاربر جدید ثبت‌نام کرد</p>
                                    <span class="activity-time">5 دقیقه پیش</span>
                                </div>
                            </div>
                            <div class="activity-item">
                                <div class="activity-icon info">
                                    <i class="fas fa-file-alt"></i>
                                </div>
                                <div class="activity-content">
                                    <p class="activity-text">فرم جدید ایجاد شد</p>
                                    <span class="activity-time">15 دقیقه پیش</span>
                                </div>
                            </div>
                            <div class="activity-item">
                                <div class="activity-icon warning">
                                    <i class="fas fa-exclamation-triangle"></i>
                                </div>
                                <div class="activity-content">
                                    <p class="activity-text">هشدار سیستمی</p>
                                    <span class="activity-time">30 دقیقه پیش</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="widget-card quick-actions">
                    <div class="widget-header">
                        <h5 class="widget-title">
                            <i class="fas fa-bolt me-2"></i>
                            عملیات سریع
                        </h5>
                    </div>
                    <div class="widget-body">
                        <div class="quick-action-grid">
                            <button class="quick-action-btn" data-action="add-user">
                                <i class="fas fa-user-plus"></i>
                                <span>افزودن کاربر</span>
                            </button>
                            <button class="quick-action-btn" data-action="create-form">
                                <i class="fas fa-plus"></i>
                                <span>ایجاد فرم</span>
                            </button>
                            <button class="quick-action-btn" data-action="view-reports">
                                <i class="fas fa-chart-bar"></i>
                                <span>مشاهده گزارش</span>
                            </button>
                            <button class="quick-action-btn" data-action="system-settings">
                                <i class="fas fa-cog"></i>
                                <span>تنظیمات</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.elements.dashboardContent.innerHTML = dashboardHTML;
        
        // کش مجدد عناصر جدید
        // Re-cache new elements
        this.cacheNewElements();
        
        // اتصال رویدادهای جدید
        // Bind new events
        this.bindNewEvents();
    },

    /**
     * کش عناصر جدید پس از رندر
     * Cache new elements after render
     */
    cacheNewElements() {
        this.elements.performanceChart = document.getElementById('performanceChart');
        this.elements.usersChart = document.getElementById('usersChart');
        this.elements.quickActionBtns = document.querySelectorAll('.quick-action-btn');
        this.elements.statsCards = document.querySelectorAll('.quick-stat-card');
    },

    /**
     * اتصال رویدادهای جدید
     * Bind new elements events
     */
    bindNewEvents() {
        // رویدادهای عملیات سریع
        // Quick action events
        this.elements.quickActionBtns?.forEach(btn => {
            btn.addEventListener('click', this.handleQuickAction.bind(this));
        });

        // رویدادهای کارت آمار
        // Stats card events
        this.elements.statsCards?.forEach(card => {
            card.addEventListener('click', this.handleStatsCardClick.bind(this));
        });
    },

    /**
     * مقداردهی نمودارها
     * Initialize charts
     */
    initializeCharts() {
        if (typeof Chart === 'undefined') {
            Logger.warn('Chart.js not loaded, skipping chart initialization');
            return;
        }

        setTimeout(() => {
            this.initPerformanceChart();
            this.initUsersChart();
        }, 500);
    },

    /**
     * مقداردهی نمودار عملکرد
     * Initialize performance chart
     */
    initPerformanceChart() {
        const canvas = this.elements.performanceChart;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.state.charts.performance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور'],
                datasets: [{
                    label: 'کاربران فعال',
                    data: [300, 350, 400, 380, 420, 450],
                    borderColor: 'rgb(0, 123, 255)',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
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
                            color: 'rgba(0, 0, 0, 0.1)'
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
    },

    /**
     * مقداردهی نمودار کاربران
     * Initialize users chart
     */
    initUsersChart() {
        const canvas = this.elements.usersChart;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.state.charts.users = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['ادمین', 'کاربر عادی', 'مدیر', 'مهمان'],
                datasets: [{
                    data: [5, 85, 8, 2],
                    backgroundColor: [
                        '#007bff',
                        '#28a745',
                        '#ffc107',
                        '#6c757d'
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
                            usePointStyle: true,
                            padding: 15
                        }
                    }
                }
            }
        });
    },

    /**
     * فرمت کردن اعداد
     * Format numbers
     * @param {number} num - عدد
     * @returns {string} عدد فرمت شده
     */
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },

    /**
     * نمایش loading
     * Show loading state
     */
    showLoading() {
        if (this.elements.dashboardContent) {
            this.elements.dashboardContent.innerHTML = `
                <div class="dashboard-loading d-flex justify-content-center align-items-center" style="min-height: 400px;">
                    <div class="text-center">
                        <div class="spinner-border text-primary mb-3" role="status">
                            <span class="visually-hidden">در حال بارگذاری...</span>
                        </div>
                        <p class="text-muted">در حال بارگذاری داشبورد...</p>
                    </div>
                </div>
            `;
        }
    },

    /**
     * پنهان کردن loading
     * Hide loading state
     */
    hideLoading() {
        // Loading will be hidden when content is rendered
    },

    /**
     * نمایش خطا
     * Show error
     * @param {string} message - پیام خطا
     */
    showError(message) {
        if (this.elements.dashboardContent) {
            this.elements.dashboardContent.innerHTML = `
                <div class="dashboard-error d-flex justify-content-center align-items-center" style="min-height: 400px;">
                    <div class="text-center">
                        <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                        <h4>خطا در بارگذاری داشبورد</h4>
                        <p class="text-muted">${message}</p>
                        <button class="btn btn-primary" onclick="AdminDashboard.loadDashboardData()">
                            تلاش مجدد
                        </button>
                    </div>
                </div>
            `;
        }
    },

    /**
     * شروع به‌روزرسانی خودکار
     * Start auto refresh
     */
    startAutoRefresh() {
        if (this.state.refreshInterval) {
            clearInterval(this.state.refreshInterval);
        }

        if (this.state.isAutoRefresh) {
            this.state.refreshInterval = setInterval(() => {
                this.loadDashboardData();
            }, 5 * 60 * 1000); // هر 5 دقیقه
        }
    },

    /**
     * به‌روزرسانی زمان آخرین بروزرسانی
     * Update last update time
     */
    updateLastUpdateTime() {
        this.state.lastUpdate = new Date();
        if (this.elements.lastUpdateTime) {
            this.elements.lastUpdateTime.textContent = this.state.lastUpdate.toLocaleTimeString('fa-IR');
        }
    },

    /**
     * مدیریت refresh دستی
     * Handle manual refresh
     */
    handleManualRefresh() {
        Logger.info('بروزرسانی دستی داشبورد');
        this.loadDashboardData();
    },

    /**
     * مدیریت کلیک کارت آمار
     * Handle stats card click
     * @param {Event} event - رویداد کلیک
     */
    handleStatsCardClick(event) {
        const card = event.currentTarget;
        const statType = card.dataset.stat;
        
        Logger.info(`کلیک روی کارت آمار: ${statType}`);
        
        // انیمیشن کلیک
        card.classList.add('clicked');
        setTimeout(() => card.classList.remove('clicked'), 200);
    },

    /**
     * مدیریت عملیات سریع
     * Handle quick actions
     * @param {Event} event - رویداد کلیک
     */
    handleQuickAction(event) {
        const button = event.currentTarget;
        const action = button.dataset.action;
        
        Logger.info(`عملیات سریع: ${action}`);
        
        switch (action) {
            case 'add-user':
                AdminUtils?.showToast('صفحه افزودن کاربر', 'info');
                break;
            case 'create-form':
                AdminUtils?.showToast('صفحه ایجاد فرم', 'info');
                break;
            case 'view-reports':
                AdminContent?.loadPage('reports');
                break;
            case 'system-settings':
                AdminContent?.loadPage('settings');
                break;
        }
    },

    /**
     * مدیریت تغییر صفحه
     * Handle page change
     * @param {CustomEvent} event - رویداد
     */
    handlePageChange(event) {
        const { pageId } = event.detail;
        
        if (pageId === 'dashboard') {
            // بارگذاری مجدد داشبورد
            setTimeout(() => this.initializeCharts(), 100);
        }
    },

    /**
     * مدیریت resize
     * Handle window resize
     */
    handleResize() {
        // به‌روزرسانی نمودارها
        Object.values(this.state.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    },

    /**
     * پاکسازی منابع
     * Cleanup resources
     */
    cleanup() {
        if (this.state.refreshInterval) {
            clearInterval(this.state.refreshInterval);
        }

        Object.values(this.state.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
    }
};

// اتصال به window برای دسترسی global
// Attach to window for global access
window.AdminDashboard = AdminDashboard;