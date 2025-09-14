/**
 * ماژول فرم‌ها
 * Forms Module
 * 
 * @description: ماژول مدیریت فرم‌های سیستم
 * @version: 1.0.0
 * @author: DataSave Team
 */

'use strict';

/**
 * ماژول فرم‌ها
 * Forms Module
 */
export default {
    /**
     * بارگذاری محتوای مدیریت فرم‌ها
     */
    async loadContent() {
        try {
            return `
                <div class="page-header">
                    <h1 class="page-title">
                        <div class="page-title-icon">
                            <i class="fas fa-wpforms"></i>
                        </div>
                        مدیریت فرم‌ها
                    </h1>
                    <p class="page-subtitle">ایجاد و مدیریت فرم‌های اطلاعاتی</p>
                </div>
                
                <div class="content-sections">
                    <div class="content-section">
                        <div class="section-header">
                            <h3 class="section-title">
                                <i class="fas fa-list"></i>
                                لیست فرم‌ها
                            </h3>
                            <div class="section-actions">
                                <button id="addFormBtn" class="btn btn-primary">
                                    <i class="fas fa-plus"></i> ایجاد فرم جدید
                                </button>
                            </div>
                        </div>
                        <div class="section-content">
                            <div class="data-table-container">
                                <table class="data-table">
                                    <thead>
                                        <tr>
                                            <th>شناسه</th>
                                            <th>عنوان فرم</th>
                                            <th>تاریخ ایجاد</th>
                                            <th>وضعیت</th>
                                            <th>عملیات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${await this.generateFormsList()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <div class="content-section">
                        <div class="section-header">
                            <h3 class="section-title">
                                <i class="fas fa-chart-pie"></i>
                                آمار فرم‌ها
                            </h3>
                        </div>
                        <div class="section-content">
                            <div class="stats-cards">
                                <div class="stats-card">
                                    <div class="stats-icon">
                                        <i class="fas fa-wpforms"></i>
                                    </div>
                                    <div class="stats-info">
                                        <div class="stats-value">24</div>
                                        <div class="stats-label">فرم فعال</div>
                                    </div>
                                </div>
                                
                                <div class="stats-card">
                                    <div class="stats-icon">
                                        <i class="fas fa-users"></i>
                                    </div>
                                    <div class="stats-info">
                                        <div class="stats-value">1,285</div>
                                        <div class="stats-label">پاسخ‌دهنده</div>
                                    </div>
                                </div>
                                
                                <div class="stats-card">
                                    <div class="stats-icon">
                                        <i class="fas fa-clipboard-list"></i>
                                    </div>
                                    <div class="stats-info">
                                        <div class="stats-value">3,492</div>
                                        <div class="stats-label">پاسخ ثبت شده</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error loading forms content:', error);
            return `
                <div class="error-container">
                    <h2>خطا در بارگذاری صفحه</h2>
                    <p>${error.message}</p>
                </div>
            `;
        }
    },
    
    /**
     * تولید لیست فرم‌ها
     */
    async generateFormsList() {
        try {
            // در یک برنامه واقعی، این داده‌ها از API دریافت می‌شوند
            const formsData = [
                { id: 1, title: 'فرم ثبت‌نام مشتریان', created: '1404/04/12', status: 'فعال' },
                { id: 2, title: 'فرم نظرسنجی محصولات', created: '1404/05/23', status: 'فعال' },
                { id: 3, title: 'فرم درخواست پشتیبانی', created: '1404/06/01', status: 'فعال' },
                { id: 4, title: 'فرم استخدام', created: '1404/03/15', status: 'غیرفعال' }
            ];
            
            return formsData.map(form => `
                <tr>
                    <td>${form.id}</td>
                    <td>${form.title}</td>
                    <td>${form.created}</td>
                    <td>
                        <span class="status-badge ${form.status === 'فعال' ? 'status-active' : 'status-inactive'}">
                            ${form.status}
                        </span>
                    </td>
                    <td class="actions-cell">
                        <button class="btn btn-icon btn-sm" title="ویرایش">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-icon btn-sm" title="مشاهده پاسخ‌ها">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-icon btn-sm btn-danger" title="حذف">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error generating forms list:', error);
            return `<tr><td colspan="5">خطا در بارگذاری لیست فرم‌ها</td></tr>`;
        }
    },
    
    /**
     * مقداردهی اولیه ماژول
     */
    async init() {
        console.log('Forms module initialized');
        this.attachEventListeners();
    },
    
    /**
     * اتصال رویدادها
     */
    attachEventListeners() {
        document.addEventListener('click', (event) => {
            // افزودن فرم جدید
            if (event.target.id === 'addFormBtn' || event.target.closest('#addFormBtn')) {
                this.showAddFormModal();
            }
            
            // رویدادهای دیگر
        });
    },
    
    /**
     * نمایش مودال افزودن فرم
     */
    showAddFormModal() {
        const modalHTML = `
            <div class="modal-overlay">
                <div class="modal-container">
                    <div class="modal-header">
                        <h3>ایجاد فرم جدید</h3>
                        <button class="close-modal"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="formTitle">عنوان فرم</label>
                            <input type="text" id="formTitle" class="form-control" placeholder="عنوان فرم را وارد کنید">
                        </div>
                        <div class="form-group">
                            <label for="formDescription">توضیحات</label>
                            <textarea id="formDescription" class="form-control" rows="4" placeholder="توضیحات فرم را وارد کنید"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="formStatus">وضعیت</label>
                            <select id="formStatus" class="form-control">
                                <option value="active">فعال</option>
                                <option value="inactive">غیرفعال</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary close-modal">انصراف</button>
                        <button class="btn btn-primary" id="saveFormBtn">ذخیره</button>
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
        
        const saveButton = modalContainer.querySelector('#saveFormBtn');
        saveButton.addEventListener('click', () => {
            // در یک برنامه واقعی، اینجا فرم ذخیره می‌شود
            alert('فرم با موفقیت ایجاد شد');
            modalContainer.remove();
        });
    }
};
