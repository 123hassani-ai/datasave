/**
 * ماژول مشتریان
 * Customers Module
 * 
 * @description: ماژول مدیریت مشتریان سیستم
 * @version: 1.0.0
 * @author: DataSave Team
 */

'use strict';

/**
 * ماژول مشتریان
 * Customers Module
 */
export default {
    /**
     * بارگذاری محتوای مدیریت مشتریان
     */
    async loadContent() {
        try {
            return `
                <div class="page-header">
                    <h1 class="page-title">
                        <div class="page-title-icon">
                            <i class="fas fa-user-friends"></i>
                        </div>
                        مدیریت مشتریان
                    </h1>
                    <p class="page-subtitle">مدیریت و پیگیری اطلاعات مشتریان</p>
                </div>
                
                <div class="content-sections">
                    <div class="content-section">
                        <div class="section-header">
                            <h3 class="section-title">
                                <i class="fas fa-users"></i>
                                لیست مشتریان
                            </h3>
                            <div class="section-actions">
                                <button id="addCustomerBtn" class="btn btn-primary">
                                    <i class="fas fa-plus"></i> افزودن مشتری
                                </button>
                                <button id="importCustomersBtn" class="btn btn-secondary">
                                    <i class="fas fa-file-import"></i> ورود از فایل
                                </button>
                            </div>
                        </div>
                        <div class="section-content">
                            <div class="filters-container">
                                <div class="search-container">
                                    <input type="text" class="search-input" placeholder="جستجو در مشتریان...">
                                    <i class="fas fa-search search-icon"></i>
                                </div>
                                <div class="filter-options">
                                    <select class="filter-select">
                                        <option value="">همه مشتریان</option>
                                        <option value="active">فعال</option>
                                        <option value="inactive">غیرفعال</option>
                                        <option value="new">جدید</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="data-table-container">
                                <table class="data-table">
                                    <thead>
                                        <tr>
                                            <th>شناسه</th>
                                            <th>نام و نام خانوادگی</th>
                                            <th>شماره تماس</th>
                                            <th>ایمیل</th>
                                            <th>تاریخ عضویت</th>
                                            <th>وضعیت</th>
                                            <th>عملیات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${await this.generateCustomersList()}
                                    </tbody>
                                </table>
                            </div>
                            
                            <div class="pagination">
                                <button class="pagination-btn pagination-prev">
                                    <i class="fas fa-chevron-right"></i>
                                </button>
                                <div class="pagination-numbers">
                                    <span class="pagination-number active">1</span>
                                    <span class="pagination-number">2</span>
                                    <span class="pagination-number">3</span>
                                    <span class="pagination-number">4</span>
                                    <span class="pagination-number">5</span>
                                </div>
                                <button class="pagination-btn pagination-next">
                                    <i class="fas fa-chevron-left"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="content-section">
                        <div class="section-header">
                            <h3 class="section-title">
                                <i class="fas fa-chart-pie"></i>
                                آمار مشتریان
                            </h3>
                        </div>
                        <div class="section-content">
                            <div class="stats-cards">
                                <div class="stats-card">
                                    <div class="stats-icon">
                                        <i class="fas fa-users"></i>
                                    </div>
                                    <div class="stats-info">
                                        <div class="stats-value">1,248</div>
                                        <div class="stats-label">کل مشتریان</div>
                                    </div>
                                </div>
                                
                                <div class="stats-card">
                                    <div class="stats-icon">
                                        <i class="fas fa-user-plus"></i>
                                    </div>
                                    <div class="stats-info">
                                        <div class="stats-value">38</div>
                                        <div class="stats-label">مشتریان جدید (30 روز اخیر)</div>
                                    </div>
                                </div>
                                
                                <div class="stats-card">
                                    <div class="stats-icon">
                                        <i class="fas fa-percentage"></i>
                                    </div>
                                    <div class="stats-info">
                                        <div class="stats-value">67%</div>
                                        <div class="stats-label">نرخ بازگشت</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="chart-container">
                                <h4 class="chart-title">روند عضویت مشتریان</h4>
                                <div class="chart-placeholder">
                                    <i class="fas fa-chart-line"></i>
                                    <p>نمودار روند رشد مشتریان</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error loading customers content:', error);
            return `
                <div class="error-container">
                    <h2>خطا در بارگذاری صفحه</h2>
                    <p>${error.message}</p>
                </div>
            `;
        }
    },
    
    /**
     * تولید لیست مشتریان
     */
    async generateCustomersList() {
        try {
            // در یک برنامه واقعی، این داده‌ها از API دریافت می‌شوند
            const customersData = [
                { id: 1001, name: 'علی محمدی', phone: '09123456789', email: 'ali@example.com', date: '1404/03/15', status: 'فعال' },
                { id: 1002, name: 'مریم احمدی', phone: '09187654321', email: 'maryam@example.com', date: '1404/04/20', status: 'فعال' },
                { id: 1003, name: 'رضا کریمی', phone: '09361234567', email: 'reza@example.com', date: '1404/05/10', status: 'غیرفعال' },
                { id: 1004, name: 'سارا اکبری', phone: '09331234567', email: 'sara@example.com', date: '1404/06/05', status: 'فعال' },
                { id: 1005, name: 'محمد رضایی', phone: '09121234567', email: 'mohammad@example.com', date: '1404/06/18', status: 'فعال' }
            ];
            
            return customersData.map(customer => `
                <tr>
                    <td>${customer.id}</td>
                    <td>${customer.name}</td>
                    <td>${customer.phone}</td>
                    <td>${customer.email}</td>
                    <td>${customer.date}</td>
                    <td>
                        <span class="status-badge ${customer.status === 'فعال' ? 'status-active' : 'status-inactive'}">
                            ${customer.status}
                        </span>
                    </td>
                    <td class="actions-cell">
                        <button class="btn btn-icon btn-sm" title="ویرایش">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-icon btn-sm" title="مشاهده جزئیات">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-icon btn-sm btn-danger" title="حذف">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error generating customers list:', error);
            return `<tr><td colspan="7">خطا در بارگذاری لیست مشتریان</td></tr>`;
        }
    },
    
    /**
     * مقداردهی اولیه ماژول
     */
    async init() {
        console.log('Customers module initialized');
        this.attachEventListeners();
    },
    
    /**
     * اتصال رویدادها
     */
    attachEventListeners() {
        document.addEventListener('click', (event) => {
            // افزودن مشتری جدید
            if (event.target.id === 'addCustomerBtn' || event.target.closest('#addCustomerBtn')) {
                this.showAddCustomerModal();
            }
            
            // ورود از فایل
            if (event.target.id === 'importCustomersBtn' || event.target.closest('#importCustomersBtn')) {
                this.showImportModal();
            }
            
            // رویدادهای دیگر
        });
    },
    
    /**
     * نمایش مودال افزودن مشتری
     */
    showAddCustomerModal() {
        const modalHTML = `
            <div class="modal-overlay">
                <div class="modal-container">
                    <div class="modal-header">
                        <h3>افزودن مشتری جدید</h3>
                        <button class="close-modal"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="customerName">نام و نام خانوادگی</label>
                                <input type="text" id="customerName" class="form-control" placeholder="نام و نام خانوادگی">
                            </div>
                            <div class="form-group">
                                <label for="customerPhone">شماره تماس</label>
                                <input type="text" id="customerPhone" class="form-control" placeholder="شماره تماس">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="customerEmail">ایمیل</label>
                            <input type="email" id="customerEmail" class="form-control" placeholder="ایمیل">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="customerStatus">وضعیت</label>
                                <select id="customerStatus" class="form-control">
                                    <option value="active">فعال</option>
                                    <option value="inactive">غیرفعال</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="customerGroup">گروه</label>
                                <select id="customerGroup" class="form-control">
                                    <option value="normal">عادی</option>
                                    <option value="vip">VIP</option>
                                    <option value="business">تجاری</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="customerNotes">یادداشت</label>
                            <textarea id="customerNotes" class="form-control" rows="3" placeholder="یادداشت"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary close-modal">انصراف</button>
                        <button class="btn btn-primary" id="saveCustomerBtn">ذخیره</button>
                    </div>
                </div>
            </div>
        `;
        
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
        
        // اتصال رویدادها
        const closeButtons = modalContainer.querySelectorAll('.close-modal');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                modalContainer.remove();
            });
        });
        
        const saveButton = modalContainer.querySelector('#saveCustomerBtn');
        saveButton.addEventListener('click', () => {
            // در یک برنامه واقعی، اینجا اطلاعات مشتری ذخیره می‌شود
            alert('مشتری با موفقیت اضافه شد');
            modalContainer.remove();
        });
    },
    
    /**
     * نمایش مودال ورود از فایل
     */
    showImportModal() {
        const modalHTML = `
            <div class="modal-overlay">
                <div class="modal-container">
                    <div class="modal-header">
                        <h3>ورود مشتریان از فایل</h3>
                        <button class="close-modal"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body">
                        <div class="import-instructions">
                            <p>لطفاً یک فایل اکسل با ساختار زیر بارگذاری کنید:</p>
                            <ul>
                                <li>ستون اول: نام و نام خانوادگی</li>
                                <li>ستون دوم: شماره تماس</li>
                                <li>ستون سوم: ایمیل</li>
                                <li>ستون چهارم: گروه (اختیاری)</li>
                            </ul>
                        </div>
                        <div class="file-upload-container">
                            <input type="file" id="importFile" accept=".xlsx, .xls, .csv" class="file-input">
                            <label for="importFile" class="file-label">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <span>فایل را انتخاب کنید یا به اینجا بکشید</span>
                            </label>
                        </div>
                        <div class="import-options">
                            <div class="form-check">
                                <input type="checkbox" id="skipHeader" class="form-check-input" checked>
                                <label for="skipHeader" class="form-check-label">سطر اول شامل سرتیتر است (نادیده گرفته شود)</label>
                            </div>
                            <div class="form-check">
                                <input type="checkbox" id="updateExisting" class="form-check-input">
                                <label for="updateExisting" class="form-check-label">به‌روزرسانی مشتریان موجود</label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary close-modal">انصراف</button>
                        <button class="btn btn-primary" id="startImportBtn">شروع ورود</button>
                    </div>
                </div>
            </div>
        `;
        
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
        
        // اتصال رویدادها
        const closeButtons = modalContainer.querySelectorAll('.close-modal');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                modalContainer.remove();
            });
        });
        
        const importButton = modalContainer.querySelector('#startImportBtn');
        importButton.addEventListener('click', () => {
            // در یک برنامه واقعی، اینجا فایل پردازش می‌شود
            alert('فرآیند ورود اطلاعات آغاز شد');
            modalContainer.remove();
        });
    }
};
