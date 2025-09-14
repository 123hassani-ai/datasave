/**
 * ماژول مدیریت رویدادها
 * Event Manager Module
 * 
 * @description: مدیریت رویدادها و ارتباط بین ماژول‌ها
 * @version: 1.0.0
 * @author: DataSave Team
 */

'use strict';

/**
 * ماژول مدیریت رویدادها
 * Event Manager Module
 */
export default {
    /**
     * ذخیره‌سازی event listeners
     */
    listeners: {},
    
    /**
     * اضافه کردن یک event listener
     * 
     * @param {string} eventName - نام رویداد
     * @param {Function} callback - تابع callback
     * @param {Object} context - context برای اجرای callback
     * @returns {string} - شناسه listener برای حذف آن
     */
    on(eventName, callback, context = null) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        
        const id = this.generateId();
        
        this.listeners[eventName].push({
            id,
            callback,
            context
        });
        
        return id;
    },
    
    /**
     * Subscribe یک alias برای متد on
     * برای سازگاری با کدهای قدیمی
     * 
     * @param {string} eventName - نام رویداد
     * @param {Function} callback - تابع callback
     * @param {Object} context - context برای اجرای callback
     * @returns {string} - شناسه listener برای حذف آن
     */
    subscribe(eventName, callback, context = null) {
        return this.on(eventName, callback, context);
    },
    
    /**
     * حذف یک event listener با شناسه
     * 
     * @param {string} eventName - نام رویداد
     * @param {string} id - شناسه listener
     * @returns {boolean} - آیا listener با موفقیت حذف شد؟
     */
    off(eventName, id) {
        if (!this.listeners[eventName]) return false;
        
        const initialLength = this.listeners[eventName].length;
        this.listeners[eventName] = this.listeners[eventName].filter(listener => listener.id !== id);
        
        return this.listeners[eventName].length < initialLength;
    },
    
    /**
     * Unsubscribe یک alias برای متد off
     * برای سازگاری با کدهای قدیمی
     * 
     * @param {string} eventName - نام رویداد
     * @param {string} id - شناسه listener
     * @returns {boolean} - آیا listener با موفقیت حذف شد؟
     */
    unsubscribe(eventName, id) {
        return this.off(eventName, id);
    },
    
    /**
     * حذف همه event listener‌ها برای یک رویداد
     * 
     * @param {string} eventName - نام رویداد
     */
    offAll(eventName) {
        if (eventName) {
            delete this.listeners[eventName];
        } else {
            this.listeners = {};
        }
    },
    
    /**
     * UnsubscribeAll یک alias برای متد offAll
     * برای سازگاری با کدهای قدیمی
     * 
     * @param {string} eventName - نام رویداد
     */
    unsubscribeAll(eventName) {
        this.offAll(eventName);
    },
    
    /**
     * ارسال یک رویداد
     * 
     * @param {string} eventName - نام رویداد
     * @param {Object} data - داده‌های رویداد
     */
    emit(eventName, data = {}) {
        if (!this.listeners[eventName]) return;
        
        this.listeners[eventName].forEach(listener => {
            try {
                if (listener.context) {
                    listener.callback.call(listener.context, data);
                } else {
                    listener.callback(data);
                }
            } catch (error) {
                console.error(`Error in event listener for ${eventName}:`, error);
            }
        });
    },
    
    /**
     * Publish یک alias برای متد emit
     * برای سازگاری با کدهای قدیمی
     * 
     * @param {string} eventName - نام رویداد
     * @param {Object} data - داده‌های رویداد
     */
    publish(eventName, data = {}) {
        this.emit(eventName, data);
    },
    
    /**
     * ارسال یک رویداد به صورت async
     * 
     * @param {string} eventName - نام رویداد
     * @param {Object} data - داده‌های رویداد
     * @returns {Promise} - Promise که با اجرای همه listener‌ها کامل می‌شود
     */
    async emitAsync(eventName, data = {}) {
        if (!this.listeners[eventName]) return;
        
        const promises = this.listeners[eventName].map(listener => {
            return new Promise((resolve, reject) => {
                try {
                    const result = listener.callback.call(listener.context, data);
                    resolve(result);
                } catch (error) {
                    console.error(`Error in async event listener for ${eventName}:`, error);
                    reject(error);
                }
            });
        });
        
        return Promise.all(promises);
    },
    
    /**
     * PublishAsync یک alias برای متد emitAsync
     * برای سازگاری با کدهای قدیمی
     * 
     * @param {string} eventName - نام رویداد
     * @param {Object} data - داده‌های رویداد
     * @returns {Promise} - Promise که با اجرای همه listener‌ها کامل می‌شود
     */
    async publishAsync(eventName, data = {}) {
        return this.emitAsync(eventName, data);
    },
    
    /**
     * اضافه کردن یک event listener که فقط یک بار اجرا می‌شود
     * 
     * @param {string} eventName - نام رویداد
     * @param {Function} callback - تابع callback
     * @param {Object} context - context برای اجرای callback
     * @returns {string} - شناسه listener برای حذف آن
     */
    once(eventName, callback, context = null) {
        const self = this;
        const wrappedCallback = function(data) {
            self.off(eventName, id);
            return callback.call(this, data);
        };
        
        const id = this.on(eventName, wrappedCallback, context);
        return id;
    },
    
    /**
     * SubscribeOnce یک alias برای متد once
     * برای سازگاری با کدهای قدیمی
     * 
     * @param {string} eventName - نام رویداد
     * @param {Function} callback - تابع callback
     * @param {Object} context - context برای اجرای callback
     * @returns {string} - شناسه listener برای حذف آن
     */
    subscribeOnce(eventName, callback, context = null) {
        return this.once(eventName, callback, context);
    },
    
    /**
     * تولید یک شناسه تصادفی
     * 
     * @returns {string} - شناسه تصادفی
     */
    generateId() {
        return Math.random().toString(36).substring(2, 9);
    }
};
