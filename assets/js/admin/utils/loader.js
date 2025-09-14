/**
 * ماژول بارگذاری
 * Loader Module
 * 
 * @description: مدیریت بارگذاری داینامیک اسکریپت‌ها و استایل‌ها
 * @version: 1.0.0
 * @author: DataSave Team
 */

'use strict';

/**
 * ماژول بارگذاری داینامیک
 * Dynamic Loader Module
 */
export default {
    /**
     * کش اسکریپت‌های بارگذاری شده
     */
    loadedScripts: {},
    
    /**
     * کش استایل‌های بارگذاری شده
     */
    loadedStyles: {},
    
    /**
     * بارگذاری اسکریپت
     * 
     * @param {string} url - آدرس اسکریپت
     * @param {boolean} cache - آیا از کش استفاده شود؟
     * @returns {Promise} - Promise که با بارگذاری اسکریپت کامل می‌شود
     */
    loadScript(url, cache = true) {
        // اگر اسکریپت قبلاً بارگذاری شده است، از کش استفاده کنیم
        if (cache && this.loadedScripts[url]) {
            return Promise.resolve(this.loadedScripts[url]);
        }
        
        // ایجاد Promise برای بارگذاری اسکریپت
        const promise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            
            // رویداد load
            script.onload = () => {
                this.loadedScripts[url] = true;
                resolve(script);
            };
            
            // رویداد error
            script.onerror = (error) => {
                reject(new Error(`Failed to load script: ${url}`));
            };
            
            // اضافه کردن به DOM
            document.head.appendChild(script);
        });
        
        // ذخیره Promise در کش
        if (cache) {
            this.loadedScripts[url] = promise;
        }
        
        return promise;
    },
    
    /**
     * بارگذاری استایل
     * 
     * @param {string} url - آدرس فایل CSS
     * @param {boolean} cache - آیا از کش استفاده شود؟
     * @returns {Promise} - Promise که با بارگذاری استایل کامل می‌شود
     */
    loadStyle(url, cache = true) {
        // اگر استایل قبلاً بارگذاری شده است، از کش استفاده کنیم
        if (cache && this.loadedStyles[url]) {
            return Promise.resolve(this.loadedStyles[url]);
        }
        
        // ایجاد Promise برای بارگذاری استایل
        const promise = new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            
            // رویداد load
            link.onload = () => {
                this.loadedStyles[url] = true;
                resolve(link);
            };
            
            // رویداد error
            link.onerror = (error) => {
                reject(new Error(`Failed to load style: ${url}`));
            };
            
            // اضافه کردن به DOM
            document.head.appendChild(link);
        });
        
        // ذخیره Promise در کش
        if (cache) {
            this.loadedStyles[url] = promise;
        }
        
        return promise;
    },
    
    /**
     * بارگذاری چندین اسکریپت به صورت متوالی
     * 
     * @param {Array<string>} urls - آرایه‌ای از آدرس‌های اسکریپت‌ها
     * @returns {Promise} - Promise که با بارگذاری همه اسکریپت‌ها کامل می‌شود
     */
    loadScriptsSequentially(urls) {
        return urls.reduce((prevPromise, url) => {
            return prevPromise.then(() => this.loadScript(url));
        }, Promise.resolve());
    },
    
    /**
     * بارگذاری چندین اسکریپت به صورت موازی
     * 
     * @param {Array<string>} urls - آرایه‌ای از آدرس‌های اسکریپت‌ها
     * @returns {Promise} - Promise که با بارگذاری همه اسکریپت‌ها کامل می‌شود
     */
    loadScriptsParallel(urls) {
        return Promise.all(urls.map(url => this.loadScript(url)));
    },
    
    /**
     * بارگذاری چندین استایل به صورت موازی
     * 
     * @param {Array<string>} urls - آرایه‌ای از آدرس‌های استایل‌ها
     * @returns {Promise} - Promise که با بارگذاری همه استایل‌ها کامل می‌شود
     */
    loadStyles(urls) {
        return Promise.all(urls.map(url => this.loadStyle(url)));
    },
    
    /**
     * حذف یک اسکریپت از DOM
     * 
     * @param {string} url - آدرس اسکریپت
     */
    removeScript(url) {
        const scripts = document.querySelectorAll(`script[src="${url}"]`);
        scripts.forEach(script => script.remove());
        delete this.loadedScripts[url];
    },
    
    /**
     * حذف یک استایل از DOM
     * 
     * @param {string} url - آدرس استایل
     */
    removeStyle(url) {
        const links = document.querySelectorAll(`link[href="${url}"]`);
        links.forEach(link => link.remove());
        delete this.loadedStyles[url];
    }
};
