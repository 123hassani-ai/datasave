/**
 * ماژول پشتیبانی
 * Support Module
 * 
 * @description: ماژول مدیریت درخواست‌های پشتیبانی و تیکت‌ها
 * @version: 1.0.0
 * @author: DataSave Team
 */

'use strict';

/**
 * ماژول پشتیبانی
 * Support Module
 */
export default {
    /**
     * بارگذاری محتوای صفحه پشتیبانی
     */
    async loadContent() {
        try {
            return `
                <div class="page-header">
                    <h1 class="page-title">
                        <div class="page-title-icon">
                            <i class="fas fa-life-ring"></i>
                        </div>
                        مرکز پشتیبانی
                    </h1>
                    <p class="page-subtitle">مدیریت تیکت‌های پشتیبانی و پاسخگویی به کاربران</p>
                </div>
                
                <div class="content-sections">
                    <div class="support-dashboard">
                        <div class="stats-cards">
                            <div class="stats-card">
                                <div class="stats-icon">
                                    <i class="fas fa-ticket-alt"></i>
                                </div>
                                <div class="stats-info">
                                    <div class="stats-value">42</div>
                                    <div class="stats-label">تیکت‌های باز</div>
                                </div>
                            </div>
                            
                            <div class="stats-card">
                                <div class="stats-icon">
                                    <i class="fas fa-clock"></i>
                                </div>
                                <div class="stats-info">
                                    <div class="stats-value">8</div>
                                    <div class="stats-label">در انتظار پاسخ</div>
                                </div>
                            </div>
                            
                            <div class="stats-card">
                                <div class="stats-icon">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                                <div class="stats-info">
                                    <div class="stats-value">184</div>
                                    <div class="stats-label">حل شده (30 روز اخیر)</div>
                                </div>
                            </div>
                            
                            <div class="stats-card">
                                <div class="stats-icon">
                                    <i class="fas fa-hourglass-half"></i>
                                </div>
                                <div class="stats-info">
                                    <div class="stats-value">2:45</div>
                                    <div class="stats-label">میانگین زمان پاسخ (ساعت)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="content-section">
                        <div class="section-header">
                            <h3 class="section-title">
                                <i class="fas fa-ticket-alt"></i>
                                تیکت‌های پشتیبانی
                            </h3>
                            <div class="section-actions">
                                <div class="search-container">
                                    <input type="text" class="search-input" placeholder="جستجو در تیکت‌ها...">
                                    <i class="fas fa-search search-icon"></i>
                                </div>
                                <div class="filter-container">
                                    <select class="filter-select">
                                        <option value="all">همه تیکت‌ها</option>
                                        <option value="open">باز</option>
                                        <option value="pending">در انتظار پاسخ</option>
                                        <option value="resolved">حل شده</option>
                                        <option value="closed">بسته شده</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="section-content">
                            <div class="data-table-container">
                                <table class="data-table">
                                    <thead>
                                        <tr>
                                            <th>شماره تیکت</th>
                                            <th>عنوان</th>
                                            <th>کاربر</th>
                                            <th>دسته</th>
                                            <th>تاریخ ایجاد</th>
                                            <th>آخرین به‌روزرسانی</th>
                                            <th>وضعیت</th>
                                            <th>اولویت</th>
                                            <th>عملیات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${await this.generateTicketsList()}
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
                                </div>
                                <button class="pagination-btn pagination-next">
                                    <i class="fas fa-chevron-left"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="support-sections-grid">
                        <div class="content-section">
                            <div class="section-header">
                                <h3 class="section-title">
                                    <i class="fas fa-tasks"></i>
                                    وظایف امروز
                                </h3>
                            </div>
                            <div class="section-content">
                                <div class="task-list">
                                    <div class="task-item">
                                        <div class="task-checkbox">
                                            <input type="checkbox" id="task1">
                                            <label for="task1"></label>
                                        </div>
                                        <div class="task-content">
                                            <div class="task-title">پاسخ به تیکت #4582 - مشکل در ثبت‌نام</div>
                                            <div class="task-meta">
                                                <span class="task-deadline">تا 12:30</span>
                                                <span class="task-priority high">اولویت بالا</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="task-item">
                                        <div class="task-checkbox">
                                            <input type="checkbox" id="task2">
                                            <label for="task2"></label>
                                        </div>
                                        <div class="task-content">
                                            <div class="task-title">بررسی تیکت #4595 - مشکل پرداخت</div>
                                            <div class="task-meta">
                                                <span class="task-deadline">تا 14:00</span>
                                                <span class="task-priority medium">اولویت متوسط</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="task-item">
                                        <div class="task-checkbox">
                                            <input type="checkbox" id="task3" checked>
                                            <label for="task3"></label>
                                        </div>
                                        <div class="task-content">
                                            <div class="task-title">تهیه گزارش هفتگی پشتیبانی</div>
                                            <div class="task-meta">
                                                <span class="task-deadline">تا 16:00</span>
                                                <span class="task-priority medium">اولویت متوسط</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="task-item">
                                        <div class="task-checkbox">
                                            <input type="checkbox" id="task4">
                                            <label for="task4"></label>
                                        </div>
                                        <div class="task-content">
                                            <div class="task-title">به‌روزرسانی پایگاه دانش</div>
                                            <div class="task-meta">
                                                <span class="task-deadline">تا پایان روز</span>
                                                <span class="task-priority low">اولویت پایین</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="content-section">
                            <div class="section-header">
                                <h3 class="section-title">
                                    <i class="fas fa-chart-pie"></i>
                                    آمار تیکت‌ها
                                </h3>
                            </div>
                            <div class="section-content">
                                <div class="chart-container">
                                    <div class="chart-placeholder">
                                        <i class="fas fa-chart-pie"></i>
                                        <p>نمودار وضعیت تیکت‌ها</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error loading support content:', error);
            return `
                <div class="error-container">
                    <h2>خطا در بارگذاری صفحه</h2>
                    <p>${error.message}</p>
                </div>
            `;
        }
    },
    
    /**
     * تولید لیست تیکت‌ها
     */
    async generateTicketsList() {
        try {
            // در یک برنامه واقعی، این داده‌ها از API دریافت می‌شوند
            const ticketsData = [
                { id: 4598, title: 'مشکل در تغییر رمز عبور', user: 'علی محمدی', category: 'حساب کاربری', created: '1404/06/18 10:45', updated: '1404/06/18 11:30', status: 'باز', priority: 'بالا' },
                { id: 4597, title: 'سوال درباره نحوه استفاده از سیستم', user: 'مریم احمدی', category: 'راهنمایی', created: '1404/06/17 14:20', updated: '1404/06/17 15:45', status: 'در انتظار پاسخ', priority: 'متوسط' },
                { id: 4596, title: 'گزارش خطا در فرم ثبت‌نام', user: 'رضا کریمی', category: 'خطای سیستم', created: '1404/06/16 09:30', updated: '1404/06/16 12:15', status: 'در حال بررسی', priority: 'بالا' },
                { id: 4595, title: 'مشکل در پرداخت آنلاین', user: 'سارا اکبری', category: 'پرداخت', created: '1404/06/15 16:40', updated: '1404/06/16 10:20', status: 'باز', priority: 'بالا' },
                { id: 4594, title: 'درخواست ویژگی جدید', user: 'محمد رضایی', category: 'پیشنهادات', created: '1404/06/14 11:25', updated: '1404/06/14 13:50', status: 'حل شده', priority: 'پایین' }
            ];
            
            return ticketsData.map(ticket => `
                <tr>
                    <td>#${ticket.id}</td>
                    <td class="ticket-title">${ticket.title}</td>
                    <td>${ticket.user}</td>
                    <td>${ticket.category}</td>
                    <td>${ticket.created}</td>
                    <td>${ticket.updated}</td>
                    <td>
                        <span class="status-badge ${this.getStatusClass(ticket.status)}">
                            ${ticket.status}
                        </span>
                    </td>
                    <td>
                        <span class="priority-badge ${this.getPriorityClass(ticket.priority)}">
                            ${ticket.priority}
                        </span>
                    </td>
                    <td class="actions-cell">
                        <button class="btn btn-icon btn-sm" title="مشاهده و پاسخ">
                            <i class="fas fa-reply"></i>
                        </button>
                        <button class="btn btn-icon btn-sm" title="تغییر وضعیت">
                            <i class="fas fa-cog"></i>
                        </button>
                        <button class="btn btn-icon btn-sm" title="مشاهده تاریخچه">
                            <i class="fas fa-history"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error generating tickets list:', error);
            return `<tr><td colspan="9">خطا در بارگذاری لیست تیکت‌ها</td></tr>`;
        }
    },
    
    /**
     * تعیین کلاس CSS بر اساس وضعیت تیکت
     */
    getStatusClass(status) {
        switch (status) {
            case 'باز':
                return 'status-open';
            case 'در انتظار پاسخ':
                return 'status-pending';
            case 'در حال بررسی':
                return 'status-processing';
            case 'حل شده':
                return 'status-resolved';
            case 'بسته شده':
                return 'status-closed';
            default:
                return '';
        }
    },
    
    /**
     * تعیین کلاس CSS بر اساس اولویت تیکت
     */
    getPriorityClass(priority) {
        switch (priority) {
            case 'بالا':
                return 'priority-high';
            case 'متوسط':
                return 'priority-medium';
            case 'پایین':
                return 'priority-low';
            default:
                return '';
        }
    },
    
    /**
     * مقداردهی اولیه ماژول
     */
    async init() {
        console.log('Support module initialized');
        this.attachEventListeners();
    },
    
    /**
     * اتصال رویدادها
     */
    attachEventListeners() {
        document.addEventListener('click', (event) => {
            // پاسخ به تیکت
            if (event.target.closest('.btn-icon') && event.target.closest('.btn-icon').querySelector('i.fas.fa-reply')) {
                const ticketId = event.target.closest('tr').querySelector('td:first-child').textContent;
                this.showTicketReplyModal(ticketId);
            }
            
            // تغییر وضعیت تیکت
            if (event.target.closest('.btn-icon') && event.target.closest('.btn-icon').querySelector('i.fas.fa-cog')) {
                const ticketId = event.target.closest('tr').querySelector('td:first-child').textContent;
                this.showChangeStatusModal(ticketId);
            }
            
            // مشاهده تاریخچه تیکت
            if (event.target.closest('.btn-icon') && event.target.closest('.btn-icon').querySelector('i.fas.fa-history')) {
                const ticketId = event.target.closest('tr').querySelector('td:first-child').textContent;
                this.showTicketHistoryModal(ticketId);
            }
        });
    },
    
    /**
     * نمایش مودال پاسخ به تیکت
     */
    showTicketReplyModal(ticketId) {
        alert(`مودال پاسخ به تیکت ${ticketId} باز شد`);
        // در یک برنامه واقعی، اینجا مودال پاسخ به تیکت نمایش داده می‌شود
    },
    
    /**
     * نمایش مودال تغییر وضعیت تیکت
     */
    showChangeStatusModal(ticketId) {
        alert(`مودال تغییر وضعیت تیکت ${ticketId} باز شد`);
        // در یک برنامه واقعی، اینجا مودال تغییر وضعیت تیکت نمایش داده می‌شود
    },
    
    /**
     * نمایش مودال تاریخچه تیکت
     */
    showTicketHistoryModal(ticketId) {
        alert(`مودال تاریخچه تیکت ${ticketId} باز شد`);
        // در یک برنامه واقعی، اینجا مودال تاریخچه تیکت نمایش داده می‌شود
    }
};
