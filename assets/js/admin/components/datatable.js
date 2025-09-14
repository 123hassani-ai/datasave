/**
 * ماژول جدول‌های داده
 * Data Tables Module
 * 
 * @description: ماژول مدیریت جدول‌های داده با قابلیت صفحه‌بندی، مرتب‌سازی و جستجو
 * @version: 1.0.0
 * @author: DataSave Team
 */

'use strict';

import EventManager from '../utils/event-manager.js';

/**
 * ماژول جدول‌های داده
 * Data Tables Module
 */
export default class DataTable {
    /**
     * سازنده کلاس DataTable
     * 
     * @param {Object} options - تنظیمات جدول داده
     */
    constructor(options = {}) {
        // تنظیمات پیش‌فرض
        this.options = {
            element: null,
            selector: '',
            columns: [],
            data: [],
            pageSize: 10,
            currentPage: 1,
            sortColumn: '',
            sortDirection: 'asc',
            searchable: true,
            pagination: true,
            selectable: false,
            loading: false,
            emptyMessage: 'داده‌ای موجود نیست',
            rowIdField: 'id',
            onRowClick: null,
            onSelectionChange: null,
            onSort: null,
            onPageChange: null,
            onSearch: null,
            ...options
        };
        
        // مقداردهی اولیه متغیرها
        this.filteredData = [...this.options.data];
        this.selectedRows = [];
        this.searchQuery = '';
        
        // پیدا کردن المنت جدول
        if (this.options.element) {
            this.tableElement = this.options.element;
        } else if (this.options.selector) {
            this.tableElement = document.querySelector(this.options.selector);
        }
        
        // اگر المنت یافت نشد، خطا نمایش داده می‌شود
        if (!this.tableElement) {
            console.error('DataTable Error: No valid element or selector provided');
            return;
        }
        
        // ثبت رویدادها در مدیریت رویداد
        EventManager.subscribe('datatable:refresh', () => this.refresh());
        
        // اجرای متد رندر
        this.render();
    }
    
    /**
     * رندر جدول
     */
    render() {
        // اگر جدول در حال بارگذاری است
        if (this.options.loading) {
            this.renderLoading();
            return;
        }
        
        // فیلتر و مرتب‌سازی داده‌ها
        this.prepareData();
        
        // ایجاد ساختار اصلی جدول
        this.tableElement.innerHTML = `
            <div class="datatable-container">
                ${this.options.searchable ? this.renderSearchBar() : ''}
                <div class="datatable-table-wrapper">
                    ${this.renderTable()}
                </div>
                ${this.options.pagination ? this.renderPagination() : ''}
            </div>
        `;
        
        // اضافه کردن رویدادها
        this.attachEventListeners();
    }
    
    /**
     * آماده‌سازی داده‌ها (فیلتر و مرتب‌سازی)
     */
    prepareData() {
        // فیلتر کردن بر اساس جستجو
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            this.filteredData = this.options.data.filter(row => {
                return this.options.columns.some(column => {
                    if (!column.searchable) return false;
                    
                    const value = this.getCellValue(row, column);
                    if (value === null || value === undefined) return false;
                    
                    return String(value).toLowerCase().includes(query);
                });
            });
        } else {
            this.filteredData = [...this.options.data];
        }
        
        // مرتب‌سازی
        if (this.options.sortColumn) {
            const sortColumn = this.options.columns.find(col => col.field === this.options.sortColumn);
            
            if (sortColumn) {
                this.filteredData.sort((a, b) => {
                    let valueA = this.getCellValue(a, sortColumn);
                    let valueB = this.getCellValue(b, sortColumn);
                    
                    // تبدیل به نوع داده مناسب برای مقایسه
                    if (sortColumn.type === 'number') {
                        valueA = Number(valueA) || 0;
                        valueB = Number(valueB) || 0;
                    } else if (sortColumn.type === 'date') {
                        valueA = new Date(valueA).getTime() || 0;
                        valueB = new Date(valueB).getTime() || 0;
                    } else {
                        valueA = String(valueA || '').toLowerCase();
                        valueB = String(valueB || '').toLowerCase();
                    }
                    
                    // مقایسه مقادیر
                    if (valueA < valueB) {
                        return this.options.sortDirection === 'asc' ? -1 : 1;
                    }
                    if (valueA > valueB) {
                        return this.options.sortDirection === 'asc' ? 1 : -1;
                    }
                    return 0;
                });
            }
        }
    }
    
    /**
     * دریافت مقدار سلول بر اساس ستون
     * 
     * @param {Object} row - داده سطر
     * @param {Object} column - تنظیمات ستون
     * @returns {*} - مقدار سلول
     */
    getCellValue(row, column) {
        if (typeof column.valueGetter === 'function') {
            return column.valueGetter(row);
        }
        
        // پشتیبانی از نام‌های فیلد تودرتو (مثل user.name)
        if (column.field.includes('.')) {
            const fields = column.field.split('.');
            let value = row;
            
            for (const field of fields) {
                if (value === null || value === undefined) return null;
                value = value[field];
            }
            
            return value;
        }
        
        return row[column.field];
    }
    
    /**
     * رندر نوار جستجو
     * 
     * @returns {string} - HTML نوار جستجو
     */
    renderSearchBar() {
        return `
            <div class="datatable-search" style="margin-bottom: var(--spacing-4); display: flex; align-items: center;">
                <input 
                    type="text" 
                    class="datatable-search-input" 
                    placeholder="جستجو..." 
                    value="${this.searchQuery}"
                    style="flex: 1; padding: var(--spacing-2) var(--spacing-3); border-radius: var(--radius-md); border: 1px solid var(--glass-border); background: var(--glass-bg-lighter);"
                >
                <button class="datatable-search-button" style="margin-right: var(--spacing-2); padding: var(--spacing-2) var(--spacing-3); border-radius: var(--radius-md); border: none; background: var(--primary-gradient); color: white;">
                    <i class="fas fa-search"></i>
                </button>
                ${this.searchQuery ? `
                    <button class="datatable-search-clear" style="padding: var(--spacing-2) var(--spacing-3); border-radius: var(--radius-md); border: none; background: var(--glass-bg); color: var(--text);">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
            </div>
        `;
    }
    
    /**
     * رندر جدول اصلی
     * 
     * @returns {string} - HTML جدول
     */
    renderTable() {
        // اگر داده‌ای موجود نیست
        if (this.filteredData.length === 0) {
            return `
                <div class="datatable-empty" style="text-align: center; padding: var(--spacing-6); color: var(--text-secondary);">
                    <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: var(--spacing-4); opacity: 0.5;"></i>
                    <p>${this.options.emptyMessage}</p>
                </div>
            `;
        }
        
        // محاسبه داده‌های صفحه فعلی
        const startIndex = (this.options.currentPage - 1) * this.options.pageSize;
        const endIndex = startIndex + this.options.pageSize;
        const pageData = this.filteredData.slice(startIndex, endIndex);
        
        // ایجاد سرستون‌ها
        const headerCells = this.options.columns.map(column => {
            const isSorted = this.options.sortColumn === column.field;
            const sortIcon = isSorted 
                ? (this.options.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') 
                : 'fa-sort';
            
            return `
                <th 
                    class="datatable-header-cell ${column.sortable !== false ? 'sortable' : ''}" 
                    data-field="${column.field}"
                    style="
                        padding: var(--spacing-3); 
                        text-align: ${column.align || 'right'}; 
                        border-bottom: 1px solid var(--glass-border);
                        font-weight: 600;
                        ${column.width ? `width: ${column.width};` : ''}
                        ${column.minWidth ? `min-width: ${column.minWidth};` : ''}
                        ${column.maxWidth ? `max-width: ${column.maxWidth};` : ''}
                        white-space: nowrap;
                        position: relative;
                        cursor: ${column.sortable !== false ? 'pointer' : 'default'};
                    "
                >
                    <div style="display: flex; align-items: center; justify-content: ${column.align || 'right'};">
                        ${column.title}
                        
                        ${column.sortable !== false ? `
                            <i class="fas ${sortIcon}" style="margin-right: var(--spacing-2); font-size: 12px; ${isSorted ? 'opacity: 1;' : 'opacity: 0.3;'}"></i>
                        ` : ''}
                    </div>
                </th>
            `;
        }).join('');
        
        // ایجاد سطرها
        const rows = pageData.map(row => {
            // دریافت شناسه سطر
            const rowId = row[this.options.rowIdField];
            const isSelected = this.selectedRows.includes(rowId);
            
            // ایجاد سلول‌های سطر
            const cells = this.options.columns.map(column => {
                // دریافت مقدار سلول
                let cellValue = this.getCellValue(row, column);
                
                // اگر renderer تعریف شده باشد، از آن استفاده می‌کنیم
                if (column.renderer && typeof column.renderer === 'function') {
                    cellValue = column.renderer(cellValue, row);
                }
                
                return `
                    <td 
                        style="
                            padding: var(--spacing-3); 
                            text-align: ${column.align || 'right'}; 
                            border-bottom: 1px solid var(--glass-border-lighter);
                            ${column.ellipsis ? 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' : ''}
                        "
                    >
                        ${cellValue !== undefined && cellValue !== null ? cellValue : ''}
                    </td>
                `;
            }).join('');
            
            // ایجاد کل سطر
            return `
                <tr 
                    class="datatable-row ${isSelected ? 'selected' : ''}" 
                    data-id="${rowId}"
                    style="
                        background: ${isSelected ? 'var(--primary-light)' : 'transparent'};
                        transition: background-color 0.2s;
                        cursor: ${this.options.onRowClick ? 'pointer' : 'default'};
                    "
                >
                    ${this.options.selectable ? `
                        <td style="padding: var(--spacing-3); text-align: center; border-bottom: 1px solid var(--glass-border-lighter);">
                            <input 
                                type="checkbox" 
                                class="row-checkbox" 
                                ${isSelected ? 'checked' : ''}
                                style="width: 18px; height: 18px; accent-color: var(--primary);"
                            >
                        </td>
                    ` : ''}
                    ${cells}
                </tr>
            `;
        }).join('');
        
        // ایجاد کل جدول
        return `
            <table class="datatable-table" style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        ${this.options.selectable ? `
                            <th style="width: 40px; padding: var(--spacing-3); text-align: center; border-bottom: 1px solid var(--glass-border);">
                                <input 
                                    type="checkbox" 
                                    class="select-all-checkbox" 
                                    ${this.selectedRows.length > 0 && this.selectedRows.length === this.filteredData.length ? 'checked' : ''}
                                    style="width: 18px; height: 18px; accent-color: var(--primary);"
                                >
                            </th>
                        ` : ''}
                        ${headerCells}
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        `;
    }
    
    /**
     * رندر صفحه‌بندی
     * 
     * @returns {string} - HTML صفحه‌بندی
     */
    renderPagination() {
        // محاسبه تعداد کل صفحات
        const totalPages = Math.ceil(this.filteredData.length / this.options.pageSize);
        
        // اگر فقط یک صفحه داریم، صفحه‌بندی نمایش داده نمی‌شود
        if (totalPages <= 1) {
            return '';
        }
        
        // ایجاد دکمه‌های صفحه
        let pageButtons = '';
        
        // تعیین محدوده صفحات نمایش داده شده
        let startPage = Math.max(1, this.options.currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        // اگر کمتر از 5 صفحه نمایش داده می‌شود، محدوده را تنظیم می‌کنیم
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        
        // دکمه صفحه قبل
        pageButtons += `
            <button 
                class="datatable-pagination-button prev ${this.options.currentPage === 1 ? 'disabled' : ''}" 
                data-page="${this.options.currentPage - 1}"
                ${this.options.currentPage === 1 ? 'disabled' : ''}
                style="
                    margin: 0 var(--spacing-1);
                    padding: var(--spacing-2) var(--spacing-3);
                    border-radius: var(--radius-md);
                    border: 1px solid var(--glass-border);
                    background: var(--glass-bg);
                    cursor: ${this.options.currentPage === 1 ? 'not-allowed' : 'pointer'};
                    opacity: ${this.options.currentPage === 1 ? '0.5' : '1'};
                "
            >
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        // دکمه صفحه اول (اگر فاصله زیاد باشد)
        if (startPage > 1) {
            pageButtons += `
                <button 
                    class="datatable-pagination-button" 
                    data-page="1"
                    style="
                        margin: 0 var(--spacing-1);
                        padding: var(--spacing-2) var(--spacing-3);
                        border-radius: var(--radius-md);
                        border: 1px solid var(--glass-border);
                        background: var(--glass-bg);
                        cursor: pointer;
                    "
                >
                    1
                </button>
            `;
            
            if (startPage > 2) {
                pageButtons += `
                    <span class="datatable-pagination-ellipsis" style="margin: 0 var(--spacing-1);">...</span>
                `;
            }
        }
        
        // دکمه‌های صفحات
        for (let i = startPage; i <= endPage; i++) {
            const isActive = i === this.options.currentPage;
            
            pageButtons += `
                <button 
                    class="datatable-pagination-button ${isActive ? 'active' : ''}" 
                    data-page="${i}"
                    style="
                        margin: 0 var(--spacing-1);
                        padding: var(--spacing-2) var(--spacing-3);
                        border-radius: var(--radius-md);
                        border: 1px solid ${isActive ? 'var(--primary)' : 'var(--glass-border)'};
                        background: ${isActive ? 'var(--primary-gradient)' : 'var(--glass-bg)'};
                        color: ${isActive ? 'white' : 'var(--text)'};
                        cursor: ${isActive ? 'default' : 'pointer'};
                    "
                >
                    ${i}
                </button>
            `;
        }
        
        // دکمه صفحه آخر (اگر فاصله زیاد باشد)
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pageButtons += `
                    <span class="datatable-pagination-ellipsis" style="margin: 0 var(--spacing-1);">...</span>
                `;
            }
            
            pageButtons += `
                <button 
                    class="datatable-pagination-button" 
                    data-page="${totalPages}"
                    style="
                        margin: 0 var(--spacing-1);
                        padding: var(--spacing-2) var(--spacing-3);
                        border-radius: var(--radius-md);
                        border: 1px solid var(--glass-border);
                        background: var(--glass-bg);
                        cursor: pointer;
                    "
                >
                    ${totalPages}
                </button>
            `;
        }
        
        // دکمه صفحه بعد
        pageButtons += `
            <button 
                class="datatable-pagination-button next ${this.options.currentPage === totalPages ? 'disabled' : ''}" 
                data-page="${this.options.currentPage + 1}"
                ${this.options.currentPage === totalPages ? 'disabled' : ''}
                style="
                    margin: 0 var(--spacing-1);
                    padding: var(--spacing-2) var(--spacing-3);
                    border-radius: var(--radius-md);
                    border: 1px solid var(--glass-border);
                    background: var(--glass-bg);
                    cursor: ${this.options.currentPage === totalPages ? 'not-allowed' : 'pointer'};
                    opacity: ${this.options.currentPage === totalPages ? '0.5' : '1'};
                "
            >
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        
        // ایجاد کل بخش صفحه‌بندی
        return `
            <div class="datatable-pagination" style="margin-top: var(--spacing-4); display: flex; justify-content: center; align-items: center;">
                <div class="datatable-pagination-info" style="margin-left: auto; color: var(--text-secondary); font-size: var(--font-size-sm);">
                    نمایش ${Math.min(this.filteredData.length, (this.options.currentPage - 1) * this.options.pageSize + 1)} تا 
                    ${Math.min(this.filteredData.length, this.options.currentPage * this.options.pageSize)} 
                    از ${this.filteredData.length} مورد
                </div>
                
                <div class="datatable-pagination-buttons">
                    ${pageButtons}
                </div>
                
                <div class="datatable-pagination-sizes" style="margin-right: auto; display: flex; align-items: center;">
                    <span style="margin-left: var(--spacing-2); font-size: var(--font-size-sm); color: var(--text-secondary);">تعداد در صفحه:</span>
                    <select class="datatable-page-size" style="padding: var(--spacing-1) var(--spacing-2); border-radius: var(--radius-md); border: 1px solid var(--glass-border); background: var(--glass-bg);">
                        <option value="10" ${this.options.pageSize === 10 ? 'selected' : ''}>10</option>
                        <option value="25" ${this.options.pageSize === 25 ? 'selected' : ''}>25</option>
                        <option value="50" ${this.options.pageSize === 50 ? 'selected' : ''}>50</option>
                        <option value="100" ${this.options.pageSize === 100 ? 'selected' : ''}>100</option>
                    </select>
                </div>
            </div>
        `;
    }
    
    /**
     * رندر حالت بارگذاری
     */
    renderLoading() {
        this.tableElement.innerHTML = `
            <div class="datatable-loading" style="text-align: center; padding: var(--spacing-6);">
                <div class="spinner" style="width: 40px; height: 40px; margin: 0 auto; border: 4px solid var(--glass-border); border-radius: 50%; border-top-color: var(--primary); animation: spin 1s linear infinite;"></div>
                <p style="margin-top: var(--spacing-4); color: var(--text-secondary);">در حال بارگذاری...</p>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
    }
    
    /**
     * اضافه کردن رویدادها
     */
    attachEventListeners() {
        // رویداد مرتب‌سازی ستون‌ها
        const headerCells = this.tableElement.querySelectorAll('.datatable-header-cell.sortable');
        headerCells.forEach(cell => {
            cell.addEventListener('click', () => {
                const field = cell.getAttribute('data-field');
                
                // اگر روی ستون فعلی کلیک شده، جهت مرتب‌سازی را تغییر می‌دهیم
                if (field === this.options.sortColumn) {
                    this.options.sortDirection = this.options.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    this.options.sortColumn = field;
                    this.options.sortDirection = 'asc';
                }
                
                // اجرای callback مرتب‌سازی
                if (this.options.onSort && typeof this.options.onSort === 'function') {
                    this.options.onSort(this.options.sortColumn, this.options.sortDirection);
                }
                
                this.render();
            });
        });
        
        // رویداد جستجو
        const searchInput = this.tableElement.querySelector('.datatable-search-input');
        const searchButton = this.tableElement.querySelector('.datatable-search-button');
        const searchClear = this.tableElement.querySelector('.datatable-search-clear');
        
        if (searchInput && searchButton) {
            // جستجو با کلیک روی دکمه
            searchButton.addEventListener('click', () => {
                this.searchQuery = searchInput.value;
                this.options.currentPage = 1; // بازگشت به صفحه اول
                
                // اجرای callback جستجو
                if (this.options.onSearch && typeof this.options.onSearch === 'function') {
                    this.options.onSearch(this.searchQuery);
                }
                
                this.render();
            });
            
            // جستجو با فشردن کلید Enter
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.searchQuery = searchInput.value;
                    this.options.currentPage = 1; // بازگشت به صفحه اول
                    
                    // اجرای callback جستجو
                    if (this.options.onSearch && typeof this.options.onSearch === 'function') {
                        this.options.onSearch(this.searchQuery);
                    }
                    
                    this.render();
                }
            });
            
            // پاک کردن جستجو
            if (searchClear) {
                searchClear.addEventListener('click', () => {
                    this.searchQuery = '';
                    this.options.currentPage = 1; // بازگشت به صفحه اول
                    
                    // اجرای callback جستجو
                    if (this.options.onSearch && typeof this.options.onSearch === 'function') {
                        this.options.onSearch(this.searchQuery);
                    }
                    
                    this.render();
                });
            }
        }
        
        // رویداد صفحه‌بندی
        const pageButtons = this.tableElement.querySelectorAll('.datatable-pagination-button');
        pageButtons.forEach(button => {
            if (button.classList.contains('disabled')) return;
            
            button.addEventListener('click', () => {
                const page = parseInt(button.getAttribute('data-page'));
                if (page === this.options.currentPage) return;
                
                this.options.currentPage = page;
                
                // اجرای callback تغییر صفحه
                if (this.options.onPageChange && typeof this.options.onPageChange === 'function') {
                    this.options.onPageChange(this.options.currentPage);
                }
                
                this.render();
            });
        });
        
        // رویداد تغییر تعداد در صفحه
        const pageSizeSelect = this.tableElement.querySelector('.datatable-page-size');
        if (pageSizeSelect) {
            pageSizeSelect.addEventListener('change', () => {
                const newPageSize = parseInt(pageSizeSelect.value);
                this.options.pageSize = newPageSize;
                this.options.currentPage = 1; // بازگشت به صفحه اول
                
                // اجرای callback تغییر صفحه
                if (this.options.onPageChange && typeof this.options.onPageChange === 'function') {
                    this.options.onPageChange(this.options.currentPage);
                }
                
                this.render();
            });
        }
        
        // رویداد کلیک روی سطر
        if (this.options.onRowClick && typeof this.options.onRowClick === 'function') {
            const rows = this.tableElement.querySelectorAll('.datatable-row');
            rows.forEach(row => {
                row.addEventListener('click', (e) => {
                    // اگر روی چک‌باکس کلیک شده، رویداد کلیک سطر اجرا نمی‌شود
                    if (e.target.classList.contains('row-checkbox')) return;
                    
                    const rowId = row.getAttribute('data-id');
                    const rowData = this.filteredData.find(data => data[this.options.rowIdField] == rowId);
                    
                    this.options.onRowClick(rowData, row);
                });
            });
        }
        
        // رویداد انتخاب سطر
        if (this.options.selectable) {
            // چک‌باکس "انتخاب همه"
            const selectAllCheckbox = this.tableElement.querySelector('.select-all-checkbox');
            if (selectAllCheckbox) {
                selectAllCheckbox.addEventListener('change', () => {
                    if (selectAllCheckbox.checked) {
                        // انتخاب همه سطرها
                        this.selectedRows = this.filteredData.map(row => row[this.options.rowIdField]);
                    } else {
                        // لغو انتخاب همه سطرها
                        this.selectedRows = [];
                    }
                    
                    // اجرای callback تغییر انتخاب
                    if (this.options.onSelectionChange && typeof this.options.onSelectionChange === 'function') {
                        this.options.onSelectionChange(this.selectedRows);
                    }
                    
                    this.render();
                });
            }
            
            // چک‌باکس‌های سطرها
            const rowCheckboxes = this.tableElement.querySelectorAll('.row-checkbox');
            rowCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    const row = checkbox.closest('.datatable-row');
                    const rowId = row.getAttribute('data-id');
                    
                    if (checkbox.checked) {
                        // اضافه کردن به لیست انتخاب‌ها
                        if (!this.selectedRows.includes(rowId)) {
                            this.selectedRows.push(rowId);
                        }
                    } else {
                        // حذف از لیست انتخاب‌ها
                        this.selectedRows = this.selectedRows.filter(id => id !== rowId);
                    }
                    
                    // اجرای callback تغییر انتخاب
                    if (this.options.onSelectionChange && typeof this.options.onSelectionChange === 'function') {
                        this.options.onSelectionChange(this.selectedRows);
                    }
                    
                    this.render();
                });
            });
        }
    }
    
    /**
     * به‌روزرسانی داده‌های جدول
     * 
     * @param {Array} data - داده‌های جدید
     */
    updateData(data) {
        this.options.data = [...data];
        this.filteredData = [...data];
        this.options.currentPage = 1;
        this.render();
    }
    
    /**
     * به‌روزرسانی تنظیمات جدول
     * 
     * @param {Object} options - تنظیمات جدید
     */
    updateOptions(options) {
        this.options = {
            ...this.options,
            ...options
        };
        this.render();
    }
    
    /**
     * انتخاب سطرها
     * 
     * @param {Array} rowIds - شناسه‌های سطرها
     */
    selectRows(rowIds) {
        this.selectedRows = [...rowIds];
        this.render();
        
        // اجرای callback تغییر انتخاب
        if (this.options.onSelectionChange && typeof this.options.onSelectionChange === 'function') {
            this.options.onSelectionChange(this.selectedRows);
        }
    }
    
    /**
     * لغو انتخاب همه سطرها
     */
    clearSelection() {
        this.selectedRows = [];
        this.render();
        
        // اجرای callback تغییر انتخاب
        if (this.options.onSelectionChange && typeof this.options.onSelectionChange === 'function') {
            this.options.onSelectionChange(this.selectedRows);
        }
    }
    
    /**
     * دریافت سطرهای انتخاب شده
     * 
     * @returns {Array} - سطرهای انتخاب شده
     */
    getSelectedRows() {
        return this.options.data.filter(row => this.selectedRows.includes(row[this.options.rowIdField]));
    }
    
    /**
     * تنظیم وضعیت بارگذاری
     * 
     * @param {boolean} loading - آیا در حال بارگذاری است
     */
    setLoading(loading) {
        this.options.loading = loading;
        this.render();
    }
    
    /**
     * به‌روزرسانی جدول
     */
    refresh() {
        this.render();
    }
    
    /**
     * بازنشانی جدول به حالت اولیه
     */
    reset() {
        this.options.currentPage = 1;
        this.options.sortColumn = '';
        this.options.sortDirection = 'asc';
        this.searchQuery = '';
        this.selectedRows = [];
        this.render();
    }
};
