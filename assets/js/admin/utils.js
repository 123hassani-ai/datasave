/**
 * DataSave Admin Dashboard - Utility Functions
 * @description Common utility functions for the admin dashboard
 * @author DataSave Team
 * @version 1.0.0
 */

'use strict';

/**
 * Utility functions for admin dashboard
 */
const AdminUtils = {
    /**
     * Format numbers with Persian digits if NumberUtils is available
     * @param {number} num - Number to format
     * @returns {string} Formatted number
     */
    formatNumber(num) {
        if (typeof NumberUtils !== 'undefined' && NumberUtils.toPersian) {
            return NumberUtils.toPersian(num.toLocaleString('fa-IR'));
        }
        return num.toLocaleString('fa-IR');
    },

    /**
     * Format currency with Persian digits
     * @param {number} amount - Amount to format
     * @param {string} currency - Currency symbol (default: تومان)
     * @returns {string} Formatted currency
     */
    formatCurrency(amount, currency = 'تومان') {
        const formatted = this.formatNumber(amount);
        return `${formatted} ${currency}`;
    },

    /**
     * Get Persian date string
     * @param {Date} date - Date object (default: now)
     * @returns {string} Persian date string
     */
    getPersianDate(date = new Date()) {
        if (typeof PersianCalendar !== 'undefined' && PersianCalendar.format) {
            return PersianCalendar.format(date, 'DD MMMM YYYY');
        }
        return date.toLocaleDateString('fa-IR');
    },

    /**
     * Get Persian time string
     * @param {Date} date - Date object (default: now)
     * @returns {string} Persian time string
     */
    getPersianTime(date = new Date()) {
        return date.toLocaleTimeString('fa-IR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * Get Persian datetime string
     * @param {Date} date - Date object (default: now)
     * @returns {string} Persian datetime string
     */
    getPersianDateTime(date = new Date()) {
        const dateStr = this.getPersianDate(date);
        const timeStr = this.getPersianTime(date);
        return `${dateStr} - ${timeStr}`;
    },

    /**
     * Debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function calls
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} Throttled function
     */
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Show toast notification
     * @param {string} message - Toast message
     * @param {string} type - Toast type (success, warning, error, info)
     * @param {number} duration - Duration in milliseconds (default: 3000)
     */
    showToast(message, type = 'info', duration = 3000) {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toastId = `toast_${Date.now()}`;
        const iconMap = {
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            error: 'fa-times-circle',
            info: 'fa-info-circle'
        };

        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = `toast show align-items-center text-bg-${type} border-0`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body d-flex align-items-center">
                    <i class="fas ${iconMap[type] || iconMap.info} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" 
                        onclick="AdminUtils.removeToast('${toastId}')" aria-label="بستن"></button>
            </div>
        `;

        toastContainer.appendChild(toast);

        // Auto remove after duration
        setTimeout(() => {
            this.removeToast(toastId);
        }, duration);

        // Log toast if Logger is available
        if (window.safeLogger) {
            window.safeLogger('info', 'Toast notification displayed', {
                message,
                type,
                duration,
                toastId
            });
        }
    },

    /**
     * Remove toast notification
     * @param {string} toastId - Toast element ID
     */
    removeToast(toastId) {
        const toast = document.getElementById(toastId);
        if (toast) {
            toast.classList.add('fade');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 150);
        }
    },

    /**
     * Generate random ID
     * @param {number} length - ID length (default: 8)
     * @returns {string} Random ID
     */
    generateId(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },

    /**
     * Validate email address
     * @param {string} email - Email address to validate
     * @returns {boolean} True if valid email
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validate Iranian mobile number
     * @param {string} mobile - Mobile number to validate
     * @returns {boolean} True if valid mobile number
     */
    isValidMobile(mobile) {
        const mobileRegex = /^09[0-9]{9}$/;
        return mobileRegex.test(mobile);
    },

    /**
     * Format file size
     * @param {number} bytes - File size in bytes
     * @returns {string} Formatted file size
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 بایت';
        
        const k = 1024;
        const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
        return `${this.formatNumber(size)} ${sizes[i]}`;
    },

    /**
     * Get time ago string in Persian
     * @param {Date} date - Date object
     * @returns {string} Time ago string
     */
    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) {
            return 'همین الان';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${this.formatNumber(minutes)} دقیقه پیش`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${this.formatNumber(hours)} ساعت پیش`;
        } else if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${this.formatNumber(days)} روز پیش`;
        } else {
            return this.getPersianDate(date);
        }
    },

    /**
     * Animate number counting
     * @param {HTMLElement} element - Element to animate
     * @param {number} start - Start value
     * @param {number} end - End value
     * @param {number} duration - Animation duration in milliseconds
     */
    animateNumber(element, start, end, duration = 1000) {
        const startTime = performance.now();
        const change = end - start;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(start + change * easeOut);
            
            element.textContent = this.formatNumber(currentValue);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    },

    /**
     * Create loading placeholder
     * @param {number} width - Width percentage (default: 100)
     * @param {number} height - Height in pixels (default: 20)
     * @returns {HTMLElement} Loading placeholder element
     */
    createLoadingPlaceholder(width = 100, height = 20) {
        const placeholder = document.createElement('div');
        placeholder.className = 'loading-placeholder';
        placeholder.style.width = `${width}%`;
        placeholder.style.height = `${height}px`;
        placeholder.style.background = 'var(--border-light)';
        placeholder.style.borderRadius = 'var(--border-radius-sm)';
        placeholder.style.animation = 'shimmer 1.5s infinite';
        return placeholder;
    },

    /**
     * Handle keyboard navigation
     * @param {Event} event - Keyboard event
     * @param {Object} handlers - Key handler functions
     */
    handleKeyNavigation(event, handlers) {
        const key = event.key;
        if (handlers[key] && typeof handlers[key] === 'function') {
            event.preventDefault();
            handlers[key](event);
        }
    },

    /**
     * Check if device is mobile
     * @returns {boolean} True if mobile device
     */
    isMobile() {
        return window.innerWidth <= 768;
    },

    /**
     * Check if device supports touch
     * @returns {boolean} True if touch is supported
     */
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    /**
     * Get browser information
     * @returns {Object} Browser information
     */
    getBrowserInfo() {
        const ua = navigator.userAgent;
        let browserName = 'Unknown';
        
        if (ua.includes('Firefox')) {
            browserName = 'Firefox';
        } else if (ua.includes('Chrome')) {
            browserName = 'Chrome';
        } else if (ua.includes('Safari')) {
            browserName = 'Safari';
        } else if (ua.includes('Edge')) {
            browserName = 'Edge';
        }
        
        return {
            name: browserName,
            userAgent: ua,
            language: navigator.language || navigator.languages[0],
            platform: navigator.platform
        };
    }
};

// حذف global error handlers از این فایل چون در logging.js مدیریت می‌شوند
// Global error handlers removed - managed in logging.js

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.AdminUtils = AdminUtils;
}