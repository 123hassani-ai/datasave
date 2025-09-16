/**
 * Table History Manager
 * مدیریت تاریخچه و جداول ایجاد شده
 * 
 * @description: مدیریت جداول ایجاد شده، نمایش تاریخچه و امکانات مدیریتی
 * @version: 1.0.0
 * @author: DataSave Team
 */

'use strict';

class TableHistoryManager {
    constructor() {
        this.tables = [];
        this.isLoading = false;
        
        // Event callbacks
        this.onTableView = null;
        this.onTableEdit = null;
        this.onTableExport = null;
        this.onTableDelete = null;
    }
    
    /**
     * مقداردهی اولیه
     */
    async init() {
        try {
            console.log('🚀 Initializing Table History Manager...');
            
            await this.loadTablesHistory();
            this.setupEventHandlers();
            
            console.log('✅ Table History Manager initialized');
            
        } catch (error) {
            console.error('❌ Error initializing Table History Manager:', error);
            throw error;
        }
    }
    
    /**
     * بارگذاری تاریخچه جداول
     */
    async loadTablesHistory() {
        try {
            this.isLoading = true;
            console.log('📊 Loading tables history...');
            
            // اینجا باید API call به backend برای دریافت لیست جداول انجام دهید
            // فعلاً شبیه‌سازی می‌کنیم
            await this.simulateLoadTablesFromAPI();
            
            console.log(`✅ Loaded ${this.tables.length} tables`);
            
        } catch (error) {
            console.error('❌ Error loading tables history:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }
    
    /**
     * شبیه‌سازی بارگذاری جداول از API
     */
    async simulateLoadTablesFromAPI() {
        // شبیه‌سازی تاخیر شبکه
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // داده‌های نمونه
        this.tables = [
            {
                id: 1,
                table_name: 'xls2tbl_customers',
                persian_name: 'مشتریان',
                file_name: 'customers.xlsx',
                columns_number: 8,
                total_records: 250,
                processed_records: 250,
                created_at: '2024-01-15 14:30:00',
                status: 'completed'
            },
            {
                id: 2,
                table_name: 'xls2tbl_products',
                persian_name: 'محصولات', 
                file_name: 'products.xlsx',
                columns_number: 12,
                total_records: 150,
                processed_records: 148,
                created_at: '2024-01-14 10:15:00',
                status: 'completed'
            },
            {
                id: 3,
                table_name: 'xls2tbl_orders',
                persian_name: 'سفارشات',
                file_name: 'orders.xlsx',
                columns_number: 6,
                total_records: 1200,
                processed_records: 1150,
                created_at: '2024-01-13 16:45:00',
                status: 'processing'
            }
        ];
    }
    
    /**
     * تنظیم event handler ها
     */
    setupEventHandlers() {
        // اینجا event listener های مربوط به مدیریت جداول تنظیم می‌شوند
        document.addEventListener('click', (e) => {
            if (e.target.closest('.dm-table-action')) {
                this.handleTableAction(e);
            }
        });
    }
    
    /**
     * مدیریت اکشن‌های جداول
     */
    async handleTableAction(event) {
        const actionBtn = event.target.closest('.dm-table-action');
        const action = actionBtn.dataset.action;
        const tableId = parseInt(actionBtn.dataset.tableId);
        const table = this.tables.find(t => t.id === tableId);
        
        if (!table) {
            console.error('Table not found:', tableId);
            return;
        }
        
        console.log(`🔧 Performing action: ${action} on table:`, table.table_name);
        
        switch (action) {
            case 'view':
                await this.viewTable(table);
                break;
            case 'edit':
                await this.editTable(table);
                break;
            case 'export':
                await this.exportTable(table);
                break;
            case 'delete':
                await this.deleteTable(table);
                break;
            default:
                console.warn('Unknown action:', action);
        }
    }
    
    /**
     * مشاهده داده‌های جدول
     */
    async viewTable(table) {
        try {
            console.log('👁️ Viewing table:', table.table_name);
            
            // ایجاد modal برای نمایش داده‌ها
            const modal = this.createTableViewModal(table);
            document.body.appendChild(modal);
            
            // بارگذاری داده‌ها
            await this.loadTableData(table, modal);
            
        } catch (error) {
            console.error('❌ Error viewing table:', error);
            this.showError('خطا در نمایش جدول: ' + error.message);
        }
    }
    
    /**
     * ویرایش ساختار جدول
     */
    async editTable(table) {
        try {
            console.log('✏️ Editing table:', table.table_name);
            
            if (this.onTableEdit) {
                await this.onTableEdit(table);
            } else {
                this.showInfo('امکان ویرایش در حال توسعه است');
            }
            
        } catch (error) {
            console.error('❌ Error editing table:', error);
            this.showError('خطا در ویرایش جدول: ' + error.message);
        }
    }
    
    /**
     * خروجی گرفتن از جدول
     */
    async exportTable(table) {
        try {
            console.log('📤 Exporting table:', table.table_name);
            
            // نمایش گزینه‌های خروجی
            const format = await this.showExportOptions();
            
            if (!format) return; // کاربر انصراف داد
            
            // شروع فرآیند خروجی
            await this.performExport(table, format);
            
        } catch (error) {
            console.error('❌ Error exporting table:', error);
            this.showError('خطا در خروجی گرفتن: ' + error.message);
        }
    }
    
    /**
     * حذف جدول
     */
    async deleteTable(table) {
        try {
            console.log('🗑️ Deleting table:', table.table_name);
            
            // تایید حذف
            const confirmed = await this.confirmDelete(table);
            
            if (!confirmed) return;
            
            // حذف جدول
            await this.performDelete(table);
            
            // به‌روزرسانی لیست
            await this.loadTablesHistory();
            this.renderTablesHistory();
            
        } catch (error) {
            console.error('❌ Error deleting table:', error);
            this.showError('خطا در حذف جدول: ' + error.message);
        }
    }
    
    /**
     * ایجاد modal نمایش جدول
     */
    createTableViewModal(table) {
        const modal = document.createElement('div');
        modal.className = 'dm-modal dm-table-view-modal';
        modal.innerHTML = `
            <div class="dm-modal-overlay"></div>
            <div class="dm-modal-content dm-large">
                <div class="dm-modal-header">
                    <h3>
                        <i class="fas fa-table"></i>
                        مشاهده جدول: ${table.persian_name || table.table_name}
                    </h3>
                    <button class="dm-modal-close" onclick="this.closest('.dm-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="dm-modal-body">
                    <div class="dm-table-info">
                        <div class="dm-info-grid">
                            <div class="dm-info-item">
                                <label>نام جدول:</label>
                                <span>${table.table_name}</span>
                            </div>
                            <div class="dm-info-item">
                                <label>فایل اصلی:</label>
                                <span>${table.file_name}</span>
                            </div>
                            <div class="dm-info-item">
                                <label>تعداد ستون‌ها:</label>
                                <span>${table.columns_number}</span>
                            </div>
                            <div class="dm-info-item">
                                <label>تعداد رکوردها:</label>
                                <span>${table.total_records}</span>
                            </div>
                        </div>
                    </div>
                    <div class="dm-table-data-container">
                        <div class="dm-loading-placeholder">
                            <i class="fas fa-spinner fa-spin"></i>
                            در حال بارگذاری داده‌ها...
                        </div>
                    </div>
                </div>
                <div class="dm-modal-actions">
                    <button class="dm-btn dm-btn-primary" onclick="this.exportData('${table.table_name}')">
                        <i class="fas fa-download"></i>
                        خروجی Excel
                    </button>
                    <button class="dm-btn dm-btn-secondary" onclick="this.closest('.dm-modal').remove()">
                        <i class="fas fa-times"></i>
                        بستن
                    </button>
                </div>
            </div>
        `;
        
        return modal;
    }
    
    /**
     * رندر تاریخچه جداول
     */
    renderTablesHistory() {
        const container = document.getElementById('tablesHistoryContainer');
        
        if (!container) {
            console.warn('Tables history container not found');
            return;
        }
        
        if (this.isLoading) {
            container.innerHTML = this.getLoadingHTML();
            return;
        }
        
        if (this.tables.length === 0) {
            container.innerHTML = this.getEmptyStateHTML();
            return;
        }
        
        container.innerHTML = this.getTablesHTML();
    }
    
    /**
     * HTML برای حالت بارگذاری
     */
    getLoadingHTML() {
        return `
            <div class="dm-loading-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>در حال بارگذاری تاریخچه جداول...</p>
            </div>
        `;
    }
    
    /**
     * HTML برای حالت خالی بودن
     */
    getEmptyStateHTML() {
        return `
            <div class="dm-empty-state">
                <i class="fas fa-database"></i>
                <h3>هیچ جدولی ایجاد نشده است</h3>
                <p>پس از ایجاد اولین جدول، تاریخچه آن اینجا نمایش داده خواهد شد.</p>
            </div>
        `;
    }
    
    /**
     * HTML برای نمایش جداول
     */
    getTablesHTML() {
        return `
            <div class="dm-tables-grid">
                ${this.tables.map(table => this.getTableCardHTML(table)).join('')}
            </div>
        `;
    }
    
    /**
     * HTML برای کارت هر جدول
     */
    getTableCardHTML(table) {
        const statusClass = table.status === 'completed' ? 'success' : 
                           table.status === 'processing' ? 'warning' : 'danger';
        const statusText = table.status === 'completed' ? 'تکمیل شده' :
                          table.status === 'processing' ? 'در حال پردازش' : 'خطا';
        
        return `
            <div class="dm-table-card" data-table-id="${table.id}">
                <div class="dm-card-header">
                    <h4>${table.persian_name || table.table_name}</h4>
                    <span class="dm-status dm-status-${statusClass}">${statusText}</span>
                </div>
                <div class="dm-card-body">
                    <div class="dm-table-stats">
                        <div class="dm-stat">
                            <i class="fas fa-file-excel"></i>
                            <span>${table.file_name}</span>
                        </div>
                        <div class="dm-stat">
                            <i class="fas fa-columns"></i>
                            <span>${table.columns_number} ستون</span>
                        </div>
                        <div class="dm-stat">
                            <i class="fas fa-list"></i>
                            <span>${table.total_records} رکورد</span>
                        </div>
                        <div class="dm-stat">
                            <i class="fas fa-calendar"></i>
                            <span>${this.formatDate(table.created_at)}</span>
                        </div>
                    </div>
                </div>
                <div class="dm-card-actions">
                    <button class="dm-btn dm-btn-sm dm-table-action" data-action="view" data-table-id="${table.id}">
                        <i class="fas fa-eye"></i>
                        مشاهده
                    </button>
                    <button class="dm-btn dm-btn-sm dm-btn-secondary dm-table-action" data-action="export" data-table-id="${table.id}">
                        <i class="fas fa-download"></i>
                        خروجی
                    </button>
                    <button class="dm-btn dm-btn-sm dm-btn-danger dm-table-action" data-action="delete" data-table-id="${table.id}">
                        <i class="fas fa-trash"></i>
                        حذف
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * فرمت کردن تاریخ
     */
    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('fa-IR');
        } catch (error) {
            return dateString;
        }
    }
    
    /**
     * نمایش پیام خطا
     */
    showError(message) {
        // این method باید با سیستم notification اصلی هماهنگ باشد
        console.error('Error:', message);
        alert(message); // موقتی
    }
    
    /**
     * نمایش پیام اطلاعات
     */
    showInfo(message) {
        console.info('Info:', message);
        alert(message); // موقتی
    }
    
    /**
     * دریافت محتوای HTML کامل
     */
    getHistoryPageHTML() {
        return `
            <div class="dm-history-container dm-fade-in">
                <div class="dm-page-header">
                    <h1 class="dm-page-title">
                        <i class="fas fa-history"></i>
                        تاریخچه جداول
                    </h1>
                    <p class="dm-page-subtitle">
                        مدیریت و مشاهده جداول ایجاد شده از فایل‌های Excel
                    </p>
                </div>
                
                <div class="dm-history-content">
                    <div id="tablesHistoryContainer">
                        <!-- محتوا بصورت پویا لود می‌شود -->
                    </div>
                </div>
            </div>
        `;
    }
}

export default TableHistoryManager;