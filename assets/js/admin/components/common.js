/**
 * ماژول کامپوننت‌های مشترک
 * Common Components Module
 * 
 * @description: کامپوننت‌های مشترک قابل استفاده در تمام ماژول‌ها
 * @version: 1.0.0
 * @author: DataSave Team
 */

'use strict';

/**
 * ماژول کامپوننت‌های مشترک
 * Common Components Module
 */
export default {
    /**
     * ایجاد یک کارت
     * 
     * @param {Object} options - تنظیمات کارت
     * @returns {string} - HTML کارت
     */
    createCard(options = {}) {
        const {
            title = '',
            content = '',
            icon = '',
            iconClass = '',
            footer = '',
            className = ''
        } = options;
        
        return `
            <div class="component-card ${className}" style="background: var(--glass-bg); border-radius: var(--radius-lg); border: 1px solid var(--glass-border); padding: var(--spacing-4); margin-bottom: var(--spacing-4);">
                ${title ? `
                    <div class="card-header" style="display: flex; align-items: center; margin-bottom: var(--spacing-4);">
                        ${icon ? `
                            <div class="card-icon ${iconClass}" style="width: 40px; height: 40px; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; color: white; margin-left: var(--spacing-3); background: var(--primary-gradient);">
                                <i class="${icon}"></i>
                            </div>
                        ` : ''}
                        <h3 class="card-title" style="margin: 0; font-size: var(--font-size-lg);">${title}</h3>
                    </div>
                ` : ''}
                
                <div class="card-content">
                    ${content}
                </div>
                
                ${footer ? `
                    <div class="card-footer" style="margin-top: var(--spacing-4); padding-top: var(--spacing-4); border-top: 1px solid var(--glass-border);">
                        ${footer}
                    </div>
                ` : ''}
            </div>
        `;
    },
    
    /**
     * ایجاد یک جدول داده
     * 
     * @param {Object} options - تنظیمات جدول
     * @returns {string} - HTML جدول
     */
    createDataTable(options = {}) {
        const {
            headers = [],
            data = [],
            id = '',
            className = '',
            emptyMessage = 'داده‌ای موجود نیست'
        } = options;
        
        // اگر داده‌ای موجود نیست
        if (!data || data.length === 0) {
            return `
                <div class="empty-data" style="text-align: center; padding: var(--spacing-6); color: var(--text-secondary);">
                    <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: var(--spacing-4); opacity: 0.5;"></i>
                    <p>${emptyMessage}</p>
                </div>
            `;
        }
        
        // ایجاد ستون‌های جدول
        const headerRow = headers.map(header => `
            <th style="text-align: right; padding: var(--spacing-3); border-bottom: 1px solid var(--glass-border);">
                ${header.label || ''}
            </th>
        `).join('');
        
        // ایجاد سطرهای جدول
        const rows = data.map(row => {
            const cells = headers.map(header => {
                const key = header.key;
                const value = row[key] || '';
                
                // اگر renderer تعریف شده باشد، از آن استفاده می‌کنیم
                if (header.renderer && typeof header.renderer === 'function') {
                    return `<td style="padding: var(--spacing-3); border-bottom: 1px solid var(--glass-border-lighter);">${header.renderer(value, row)}</td>`;
                }
                
                return `<td style="padding: var(--spacing-3); border-bottom: 1px solid var(--glass-border-lighter);">${value}</td>`;
            }).join('');
            
            return `<tr>${cells}</tr>`;
        }).join('');
        
        return `
            <div class="data-table-container" style="overflow-x: auto;">
                <table class="data-table ${className}" id="${id}" style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>${headerRow}</tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        `;
    },
    
    /**
     * ایجاد یک مودال
     * 
     * @param {Object} options - تنظیمات مودال
     * @returns {HTMLElement} - المنت مودال
     */
    createModal(options = {}) {
        const {
            id = 'modal-' + Date.now(),
            title = '',
            content = '',
            footer = '',
            size = 'medium', // small, medium, large
            closeOnOverlayClick = true,
            onClose = null
        } = options;
        
        // تعیین کلاس سایز مودال
        let sizeClass = '';
        let maxWidth = '500px';
        
        switch (size) {
            case 'small':
                maxWidth = '400px';
                break;
            case 'large':
                maxWidth = '800px';
                break;
            default:
                maxWidth = '500px';
        }
        
        // ایجاد المنت مودال
        const modalElement = document.createElement('div');
        modalElement.className = 'modal-overlay';
        modalElement.id = id;
        modalElement.style = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        modalElement.innerHTML = `
            <div class="modal-content" style="background: var(--glass-bg); backdrop-filter: var(--glass-blur); border-radius: var(--radius-lg); border: 1px solid var(--glass-border); width: 100%; max-width: ${maxWidth}; max-height: 90vh; overflow-y: auto; transform: translateY(20px); transition: transform 0.3s ease;">
                <div class="modal-header" style="display: flex; align-items: center; justify-content: space-between; padding: var(--spacing-4); border-bottom: 1px solid var(--glass-border);">
                    <h3 style="margin: 0; font-size: var(--font-size-xl);">${title}</h3>
                    <button class="modal-close-btn" style="background: none; border: none; cursor: pointer; font-size: 20px; color: var(--text-secondary);">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body" style="padding: var(--spacing-4);">
                    ${content}
                </div>
                ${footer ? `
                    <div class="modal-footer" style="padding: var(--spacing-4); border-top: 1px solid var(--glass-border); display: flex; justify-content: flex-end; gap: var(--spacing-3);">
                        ${footer}
                    </div>
                ` : ''}
            </div>
        `;
        
        // اضافه کردن به DOM
        document.body.appendChild(modalElement);
        
        // رویدادها
        const closeButton = modalElement.querySelector('.modal-close-btn');
        closeButton.addEventListener('click', () => {
            this.closeModal(modalElement.id);
            if (onClose && typeof onClose === 'function') {
                onClose();
            }
        });
        
        // کلیک روی overlay
        if (closeOnOverlayClick) {
            modalElement.addEventListener('click', (e) => {
                if (e.target === modalElement) {
                    this.closeModal(modalElement.id);
                    if (onClose && typeof onClose === 'function') {
                        onClose();
                    }
                }
            });
        }
        
        // نمایش مودال با انیمیشن
        setTimeout(() => {
            modalElement.style.opacity = '1';
            modalElement.querySelector('.modal-content').style.transform = 'translateY(0)';
        }, 10);
        
        return modalElement;
    },
    
    /**
     * بستن یک مودال
     * 
     * @param {string} id - شناسه مودال
     */
    closeModal(id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        
        // انیمیشن بستن
        modal.style.opacity = '0';
        modal.querySelector('.modal-content').style.transform = 'translateY(20px)';
        
        // حذف از DOM پس از اتمام انیمیشن
        setTimeout(() => {
            modal.remove();
        }, 300);
    },
    
    /**
     * نمایش اعلان (toast)
     * 
     * @param {Object} options - تنظیمات اعلان
     */
    showToast(options = {}) {
        const {
            message = '',
            type = 'info', // info, success, warning, error
            duration = 3000,
            position = 'bottom-left' // top-left, top-right, bottom-left, bottom-right
        } = options;
        
        // تعیین کلاس و آیکون بر اساس نوع اعلان
        let icon = 'fas fa-info-circle';
        let bgColor = 'var(--info-gradient, linear-gradient(135deg, #2196F3, #03A9F4))';
        
        switch (type) {
            case 'success':
                icon = 'fas fa-check-circle';
                bgColor = 'var(--success-gradient, linear-gradient(135deg, #4CAF50, #8BC34A))';
                break;
            case 'warning':
                icon = 'fas fa-exclamation-triangle';
                bgColor = 'var(--warning-gradient, linear-gradient(135deg, #FF9800, #FFC107))';
                break;
            case 'error':
                icon = 'fas fa-times-circle';
                bgColor = 'var(--error-gradient, linear-gradient(135deg, #F44336, #E91E63))';
                break;
        }
        
        // تعیین موقعیت
        let positionStyle = 'bottom: 20px; left: 20px;';
        
        switch (position) {
            case 'top-left':
                positionStyle = 'top: 20px; left: 20px;';
                break;
            case 'top-right':
                positionStyle = 'top: 20px; right: 20px;';
                break;
            case 'bottom-right':
                positionStyle = 'bottom: 20px; right: 20px;';
                break;
        }
        
        // ایجاد المنت اعلان
        const toastElement = document.createElement('div');
        toastElement.className = 'toast';
        toastElement.style = `
            position: fixed;
            ${positionStyle}
            background: ${bgColor};
            color: white;
            padding: var(--spacing-3) var(--spacing-4);
            border-radius: var(--radius-md);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            min-width: 250px;
            max-width: 350px;
            z-index: 10000;
            transform: translateY(20px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
        `;
        
        toastElement.innerHTML = `
            <i class="${icon}" style="margin-left: var(--spacing-3); font-size: 20px;"></i>
            <div style="flex: 1;">${message}</div>
            <button class="toast-close-btn" style="background: none; border: none; color: white; cursor: pointer; margin-right: var(--spacing-2);">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // اضافه کردن به DOM
        document.body.appendChild(toastElement);
        
        // نمایش با انیمیشن
        setTimeout(() => {
            toastElement.style.transform = 'translateY(0)';
            toastElement.style.opacity = '1';
        }, 10);
        
        // رویداد دکمه بستن
        const closeButton = toastElement.querySelector('.toast-close-btn');
        closeButton.addEventListener('click', () => {
            this.closeToast(toastElement);
        });
        
        // بستن خودکار پس از زمان مشخص
        if (duration > 0) {
            setTimeout(() => {
                this.closeToast(toastElement);
            }, duration);
        }
        
        return toastElement;
    },
    
    /**
     * بستن یک اعلان
     * 
     * @param {HTMLElement} toastElement - المنت اعلان
     */
    closeToast(toastElement) {
        if (!toastElement) return;
        
        // انیمیشن بستن
        toastElement.style.opacity = '0';
        toastElement.style.transform = 'translateY(20px)';
        
        // حذف از DOM پس از اتمام انیمیشن
        setTimeout(() => {
            toastElement.remove();
        }, 300);
    }
};
