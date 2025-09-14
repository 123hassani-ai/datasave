/**
 * کامپوننت‌های رابط کاربری داشبورد مدیریت
 * Admin Dashboard UI Components
 * 
 * @description: نقطه ورودی برای تمام کامپوننت‌های رابط کاربری ماژولار
 * @version: 1.0.0
 * @author: DataSave Team
 */

'use strict';

// صادر کردن کامپوننت‌های مختلف
export { default as CommonComponents } from './common.js';
export { default as FormComponents } from './forms.js';
export { default as DataTable } from './datatable.js';
export { default as ChartComponents } from './charts.js';
export { default as Notifications } from './notifications.js';

/**
 * یک مجموعه از کامپوننت‌های رابط کاربری قابل استفاده مجدد
 * در تمام ماژول‌های برنامه
 */
const UIComponents = {
    version: '1.0.0',
    
    /**
     * لیست تمام کامپوننت‌های موجود
     */
    getComponents() {
        return [
            'CommonComponents',
            'FormComponents',
            'DataTable',
            'ChartComponents',
            'Notifications'
        ];
    },
    
    /**
     * دریافت اطلاعات نسخه کامپوننت‌ها
     */
    getVersion() {
        return this.version;
    }
};

// صادر کردن کامپوننت اصلی
export default UIComponents;
