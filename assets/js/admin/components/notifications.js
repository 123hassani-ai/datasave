/**
 * ماژول مدیریت و نمایش اعلان‌ها
 * Notifications Module
 * 
 * @description: ماژول مدیریت و نمایش اعلان‌ها (toast، نوتیفیکیشن، مودال)
 * @version: 1.0.0
 * @author: DataSave Team
 */

'use strict';

/**
 * ماژول اعلان‌ها
 * Notifications Module
 */
export default {
    /**
     * نمایش اعلان (toast)
     * 
     * @param {Object} options - تنظیمات اعلان
     * @returns {HTMLElement} - المنت اعلان
     */
    showToast(options = {}) {
        const {
            message = '',
            type = 'info', // info, success, warning, error
            duration = 3000,
            position = 'bottom-left', // top-left, top-right, bottom-left, bottom-right
            onClose = null
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
        
        // ایجاد کانتینر اعلان‌ها اگر وجود نداشته باشد
        let container = document.querySelector(`.toast-container.${position}`);
        if (!container) {
            container = document.createElement('div');
            container.className = `toast-container ${position}`;
            container.style = `
                position: fixed;
                ${positionStyle}
                display: flex;
                flex-direction: column;
                gap: 10px;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
        
        // ایجاد المنت اعلان
        const toastElement = document.createElement('div');
        toastElement.className = 'toast';
        toastElement.style = `
            background: ${bgColor};
            color: white;
            padding: var(--spacing-3) var(--spacing-4);
            border-radius: var(--radius-md);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            min-width: 250px;
            max-width: 350px;
            transform: translateY(20px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
            pointer-events: auto;
        `;
        
        toastElement.innerHTML = `
            <i class="${icon}" style="margin-left: var(--spacing-3); font-size: 20px;"></i>
            <div style="flex: 1;">${message}</div>
            <button class="toast-close-btn" style="background: none; border: none; color: white; cursor: pointer; margin-right: var(--spacing-2);">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // اضافه کردن به کانتینر
        container.appendChild(toastElement);
        
        // نمایش با انیمیشن
        setTimeout(() => {
            toastElement.style.transform = 'translateY(0)';
            toastElement.style.opacity = '1';
        }, 10);
        
        // رویداد دکمه بستن
        const closeButton = toastElement.querySelector('.toast-close-btn');
        closeButton.addEventListener('click', () => {
            this.closeToast(toastElement, onClose);
        });
        
        // بستن خودکار پس از زمان مشخص
        if (duration > 0) {
            setTimeout(() => {
                this.closeToast(toastElement, onClose);
            }, duration);
        }
        
        return toastElement;
    },
    
    /**
     * بستن یک اعلان
     * 
     * @param {HTMLElement} toastElement - المنت اعلان
     * @param {Function} onClose - تابع callback برای زمان بسته شدن
     */
    closeToast(toastElement, onClose = null) {
        if (!toastElement) return;
        
        // انیمیشن بستن
        toastElement.style.opacity = '0';
        toastElement.style.transform = 'translateY(20px)';
        
        // حذف از DOM پس از اتمام انیمیشن
        setTimeout(() => {
            toastElement.remove();
            
            // اجرای callback
            if (onClose && typeof onClose === 'function') {
                onClose();
            }
            
            // حذف کانتینر اگر خالی است
            const container = toastElement.parentElement;
            if (container && container.childElementCount === 0) {
                container.remove();
            }
        }, 300);
    },
    
    /**
     * نمایش اعلان موفقیت
     * 
     * @param {string} message - پیام اعلان
     * @param {Object} options - تنظیمات اضافی
     * @returns {HTMLElement} - المنت اعلان
     */
    success(message, options = {}) {
        return this.showToast({
            message,
            type: 'success',
            ...options
        });
    },
    
    /**
     * نمایش اعلان خطا
     * 
     * @param {string} message - پیام اعلان
     * @param {Object} options - تنظیمات اضافی
     * @returns {HTMLElement} - المنت اعلان
     */
    error(message, options = {}) {
        return this.showToast({
            message,
            type: 'error',
            ...options
        });
    },
    
    /**
     * نمایش اعلان هشدار
     * 
     * @param {string} message - پیام اعلان
     * @param {Object} options - تنظیمات اضافی
     * @returns {HTMLElement} - المنت اعلان
     */
    warning(message, options = {}) {
        return this.showToast({
            message,
            type: 'warning',
            ...options
        });
    },
    
    /**
     * نمایش اعلان اطلاعات
     * 
     * @param {string} message - پیام اعلان
     * @param {Object} options - تنظیمات اضافی
     * @returns {HTMLElement} - المنت اعلان
     */
    info(message, options = {}) {
        return this.showToast({
            message,
            type: 'info',
            ...options
        });
    },
    
    /**
     * نمایش مودال
     * 
     * @param {Object} options - تنظیمات مودال
     * @returns {HTMLElement} - المنت مودال
     */
    showModal(options = {}) {
        const {
            id = 'modal-' + Date.now(),
            title = '',
            content = '',
            footer = '',
            size = 'medium', // small, medium, large
            closeOnOverlayClick = true,
            closable = true,
            onOpen = null,
            onClose = null,
            buttons = []
        } = options;
        
        // تعیین کلاس سایز مودال
        let maxWidth = '500px';
        
        switch (size) {
            case 'small':
                maxWidth = '400px';
                break;
            case 'large':
                maxWidth = '800px';
                break;
            case 'full':
                maxWidth = '95%';
                break;
            default:
                maxWidth = '500px';
        }
        
        // ایجاد کانتینر مودال‌ها اگر وجود نداشته باشد
        let container = document.querySelector('.modal-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'modal-container';
            document.body.appendChild(container);
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
        
        // ایجاد دکمه‌های فوتر
        let footerButtons = '';
        if (buttons.length > 0) {
            footerButtons = buttons.map(button => {
                const btnType = button.type || 'default';
                let btnClass = 'btn-default';
                
                switch (btnType) {
                    case 'primary':
                        btnClass = 'btn-primary';
                        break;
                    case 'danger':
                        btnClass = 'btn-danger';
                        break;
                    case 'success':
                        btnClass = 'btn-success';
                        break;
                    case 'warning':
                        btnClass = 'btn-warning';
                        break;
                }
                
                return `
                    <button 
                        class="btn ${btnClass} ${button.className || ''}" 
                        id="${id}-btn-${button.id || btnType}"
                        style="${button.style || ''}"
                    >
                        ${button.icon ? `<i class="${button.icon}" style="margin-left: var(--spacing-2);"></i>` : ''}
                        ${button.text || 'دکمه'}
                    </button>
                `;
            }).join('');
        }
        
        // تعیین محتوای فوتر
        let footerContent = footer;
        if (footerButtons) {
            footerContent = footerButtons;
        }
        
        modalElement.innerHTML = `
            <div class="modal-content" style="background: var(--glass-bg); backdrop-filter: var(--glass-blur); border-radius: var(--radius-lg); border: 1px solid var(--glass-border); width: 100%; max-width: ${maxWidth}; max-height: 90vh; overflow-y: auto; transform: translateY(20px); transition: transform 0.3s ease;">
                <div class="modal-header" style="display: flex; align-items: center; justify-content: space-between; padding: var(--spacing-4); border-bottom: 1px solid var(--glass-border);">
                    <h3 style="margin: 0; font-size: var(--font-size-xl);">${title}</h3>
                    ${closable ? `
                        <button class="modal-close-btn" style="background: none; border: none; cursor: pointer; font-size: 20px; color: var(--text-secondary);">
                            <i class="fas fa-times"></i>
                        </button>
                    ` : ''}
                </div>
                <div class="modal-body" style="padding: var(--spacing-4);">
                    ${content}
                </div>
                ${footerContent ? `
                    <div class="modal-footer" style="padding: var(--spacing-4); border-top: 1px solid var(--glass-border); display: flex; justify-content: flex-end; gap: var(--spacing-3);">
                        ${footerContent}
                    </div>
                ` : ''}
            </div>
        `;
        
        // اضافه کردن به DOM
        container.appendChild(modalElement);
        
        // جلوگیری از اسکرول صفحه اصلی
        document.body.style.overflow = 'hidden';
        
        // رویدادها
        if (closable) {
            const closeButton = modalElement.querySelector('.modal-close-btn');
            closeButton.addEventListener('click', () => {
                this.closeModal(modalElement.id, onClose);
            });
        }
        
        // کلیک روی overlay
        if (closeOnOverlayClick) {
            modalElement.addEventListener('click', (e) => {
                if (e.target === modalElement) {
                    this.closeModal(modalElement.id, onClose);
                }
            });
        }
        
        // اضافه کردن رویداد به دکمه‌های سفارشی
        buttons.forEach(button => {
            const buttonElement = modalElement.querySelector(`#${id}-btn-${button.id || button.type || 'default'}`);
            if (buttonElement && button.onClick && typeof button.onClick === 'function') {
                buttonElement.addEventListener('click', (e) => {
                    button.onClick(e, () => this.closeModal(modalElement.id, onClose));
                });
            }
        });
        
        // نمایش مودال با انیمیشن
        setTimeout(() => {
            modalElement.style.opacity = '1';
            modalElement.querySelector('.modal-content').style.transform = 'translateY(0)';
            
            // اجرای callback باز شدن
            if (onOpen && typeof onOpen === 'function') {
                onOpen(modalElement);
            }
        }, 10);
        
        return modalElement;
    },
    
    /**
     * بستن یک مودال
     * 
     * @param {string} id - شناسه مودال
     * @param {Function} onClose - تابع callback برای زمان بسته شدن
     */
    closeModal(id, onClose = null) {
        const modal = document.getElementById(id);
        if (!modal) return;
        
        // انیمیشن بستن
        modal.style.opacity = '0';
        modal.querySelector('.modal-content').style.transform = 'translateY(20px)';
        
        // حذف از DOM پس از اتمام انیمیشن
        setTimeout(() => {
            modal.remove();
            
            // بررسی اگر آخرین مودال است
            const container = document.querySelector('.modal-container');
            if (container && container.childElementCount === 0) {
                // فعال کردن مجدد اسکرول صفحه
                document.body.style.overflow = '';
            }
            
            // اجرای callback
            if (onClose && typeof onClose === 'function') {
                onClose();
            }
        }, 300);
    },
    
    /**
     * نمایش مودال تایید
     * 
     * @param {Object} options - تنظیمات مودال
     * @returns {Promise} - پرامیس نتیجه
     */
    confirm(options = {}) {
        return new Promise((resolve) => {
            const {
                title = 'تایید',
                message = 'آیا از انجام این عملیات اطمینان دارید؟',
                confirmText = 'تایید',
                cancelText = 'انصراف',
                confirmIcon = 'fas fa-check',
                cancelIcon = 'fas fa-times',
                type = 'warning'
            } = options;
            
            // تعیین آیکون و رنگ بر اساس نوع
            let icon = 'fas fa-question-circle';
            let iconColor = 'var(--primary)';
            
            switch (type) {
                case 'warning':
                    icon = 'fas fa-exclamation-triangle';
                    iconColor = 'var(--warning)';
                    break;
                case 'danger':
                case 'error':
                    icon = 'fas fa-exclamation-circle';
                    iconColor = 'var(--error)';
                    break;
                case 'success':
                    icon = 'fas fa-check-circle';
                    iconColor = 'var(--success)';
                    break;
                case 'info':
                    icon = 'fas fa-info-circle';
                    iconColor = 'var(--info)';
                    break;
            }
            
            // ایجاد محتوای مودال
            const content = `
                <div style="display: flex; align-items: center; gap: var(--spacing-4);">
                    <div style="font-size: 48px; color: ${iconColor};">
                        <i class="${icon}"></i>
                    </div>
                    <div>${message}</div>
                </div>
            `;
            
            // تعریف دکمه‌ها
            const buttons = [
                {
                    id: 'cancel',
                    text: cancelText,
                    icon: cancelIcon,
                    type: 'default',
                    onClick: (e, close) => {
                        close();
                        resolve(false);
                    }
                },
                {
                    id: 'confirm',
                    text: confirmText,
                    icon: confirmIcon,
                    type: type === 'error' || type === 'danger' ? 'danger' : 'primary',
                    onClick: (e, close) => {
                        close();
                        resolve(true);
                    }
                }
            ];
            
            // نمایش مودال
            this.showModal({
                title,
                content,
                size: 'small',
                buttons,
                onClose: () => resolve(false)
            });
        });
    },
    
    /**
     * نمایش مودال پرامپت (ورودی)
     * 
     * @param {Object} options - تنظیمات مودال
     * @returns {Promise} - پرامیس نتیجه
     */
    prompt(options = {}) {
        return new Promise((resolve) => {
            const {
                title = 'ورودی',
                message = 'لطفاً مقدار را وارد کنید:',
                placeholder = '',
                defaultValue = '',
                confirmText = 'تایید',
                cancelText = 'انصراف',
                confirmIcon = 'fas fa-check',
                cancelIcon = 'fas fa-times',
                multiline = false,
                validate = null
            } = options;
            
            // ایجاد محتوای مودال
            const inputId = 'prompt-input-' + Date.now();
            const errorId = 'prompt-error-' + Date.now();
            
            const content = `
                <div>
                    <p>${message}</p>
                    ${multiline ? `
                        <textarea 
                            id="${inputId}" 
                            placeholder="${placeholder}" 
                            rows="4"
                            style="width: 100%; padding: var(--spacing-3); border-radius: var(--radius-md); border: 1px solid var(--glass-border); background: var(--glass-bg-lighter); resize: vertical;"
                        >${defaultValue}</textarea>
                    ` : `
                        <input 
                            type="text" 
                            id="${inputId}" 
                            placeholder="${placeholder}" 
                            value="${defaultValue}"
                            style="width: 100%; padding: var(--spacing-3); border-radius: var(--radius-md); border: 1px solid var(--glass-border); background: var(--glass-bg-lighter);"
                        >
                    `}
                    <div id="${errorId}" style="color: var(--error); margin-top: var(--spacing-2); font-size: var(--font-size-sm); display: none;"></div>
                </div>
            `;
            
            // تعریف دکمه‌ها
            const buttons = [
                {
                    id: 'cancel',
                    text: cancelText,
                    icon: cancelIcon,
                    type: 'default',
                    onClick: (e, close) => {
                        close();
                        resolve(null);
                    }
                },
                {
                    id: 'confirm',
                    text: confirmText,
                    icon: confirmIcon,
                    type: 'primary',
                    onClick: (e, close) => {
                        const inputElement = document.getElementById(inputId);
                        const errorElement = document.getElementById(errorId);
                        const value = inputElement.value;
                        
                        // اعتبارسنجی
                        if (validate && typeof validate === 'function') {
                            const error = validate(value);
                            if (error) {
                                errorElement.textContent = error;
                                errorElement.style.display = 'block';
                                return;
                            }
                        }
                        
                        close();
                        resolve(value);
                    }
                }
            ];
            
            // نمایش مودال
            const modal = this.showModal({
                title,
                content,
                size: 'small',
                buttons,
                onClose: () => resolve(null)
            });
            
            // فوکوس روی ورودی
            setTimeout(() => {
                const inputElement = document.getElementById(inputId);
                if (inputElement) {
                    inputElement.focus();
                    inputElement.select();
                }
            }, 300);
        });
    }
};
