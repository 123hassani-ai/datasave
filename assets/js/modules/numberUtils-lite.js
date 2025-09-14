/**
 * ماژول ابزارهای مدیریت اعداد - Lightweight NumberUtils Module
 * @description نسخه سبک بدون وابستگی به Logger
 * @author DataSave Team
 * @version 2.1.0
 */

'use strict';

/**
 * کلاس ابزارهای مدیریت اعداد (نسخه سبک)
 */
class NumberUtils {
    
    /**
     * نقشه تبدیل اعداد فارسی به انگلیسی
     * @private
     * @static
     */
    static #persianToEnglishMap = {
        '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
        '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
        '٫': '.', '،': ','
    };
    
    /**
     * نقشه تبدیل اعداد انگلیسی به فارسی
     * @private
     * @static
     */
    static #englishToPersianMap = {
        '0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴',
        '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹',
        '.': '٫', ',': '،'
    };
    
    /**
     * الگوی شماره تلفن ایرانی
     * @private
     */
    static #iranPhonePattern = /^(\+98|0)?9\d{9}$/;
    
    /**
     * الگوی کد OTP (4 تا 6 رقم)
     * @private
     */
    static #otpPattern = /^\d{4,6}$/;
    
    /**
     * تبدیل اعداد فارسی به انگلیسی
     * @param {string|number} input - ورودی برای تبدیل
     * @returns {string} رشته با اعداد انگلیسی
     */
    static toEnglish(input) {
        try {
            if (input === null || input === undefined) {
                return '';
            }
            
            let result = String(input);
            
            // تبدیل هر کاراکتر فارسی به معادل انگلیسی
            for (const [persian, english] of Object.entries(this.#persianToEnglishMap)) {
                result = result.replace(new RegExp(persian, 'g'), english);
            }
            
            return result;
        } catch (error) {
            console.warn('Error converting to English numbers:', error);
            return String(input);
        }
    }
    
    /**
     * تبدیل اعداد انگلیسی به فارسی
     * @param {string|number} input - ورودی برای تبدیل
     * @returns {string} رشته با اعداد فارسی
     */
    static toPersian(input) {
        try {
            if (input === null || input === undefined) {
                return '';
            }
            
            let result = String(input);
            
            // تبدیل هر کاراکتر انگلیسی به معادل فارسی
            for (const [english, persian] of Object.entries(this.#englishToPersianMap)) {
                result = result.replace(new RegExp('\\' + english, 'g'), persian);
            }
            
            return result;
        } catch (error) {
            console.warn('Error converting to Persian numbers:', error);
            return String(input);
        }
    }
    
    /**
     * پارس کردن رشته عددی به عدد
     * @param {string} str - رشته عددی
     * @returns {number|null} عدد پارس شده یا null در صورت عدم موفقیت
     */
    static parseNumber(str) {
        try {
            if (!str || typeof str !== 'string') {
                return null;
            }
            
            // تبدیل به انگلیسی
            let englishStr = this.toEnglish(str);
            
            // حذف جداکننده‌های هزارگان
            englishStr = englishStr.replace(/,/g, '');
            
            // تلاش برای پارس کردن
            const parsed = parseFloat(englishStr);
            
            if (isNaN(parsed)) {
                return null;
            }
            
            return parsed;
        } catch (error) {
            console.warn('Error parsing number:', error);
            return null;
        }
    }
    
    /**
     * فرمت‌بندی عدد با جداکننده هزارگان
     * @param {number} number - عدد برای فرمت
     * @param {Object} options - تنظیمات فرمت
     * @returns {string} عدد فرمت شده
     */
    static formatWithSeparators(number, options = {}) {
        try {
            const {
                separator = ',',
                decimals = null,
                persian = false
            } = options;
            
            if (typeof number !== 'number' || isNaN(number)) {
                return persian ? this.toPersian('0') : '0';
            }
            
            // تعیین تعداد اعشار
            let formattedNumber;
            if (decimals !== null) {
                formattedNumber = number.toFixed(decimals);
            } else {
                formattedNumber = number.toString();
            }
            
            // اضافه کردن جداکننده هزارگان
            const parts = formattedNumber.split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
            
            const result = parts.join('.');
            const finalResult = persian ? this.toPersian(result) : result;
            
            return finalResult;
        } catch (error) {
            console.warn('Error formatting number with separators:', error);
            return persian ? this.toPersian(String(number)) : String(number);
        }
    }
    
    /**
     * فرمت‌بندی مبلغ پولی
     * @param {number} amount - مبلغ
     * @param {Object} options - تنظیمات فرمت
     * @returns {string} مبلغ فرمت شده
     */
    static formatCurrency(amount, options = {}) {
        try {
            const {
                currency = 'تومان',
                persian = true,
                separator = persian ? '،' : ',',
                decimals = 0
            } = options;
            
            if (typeof amount !== 'number' || isNaN(amount)) {
                return persian ? `۰ ${currency}` : `0 ${currency}`;
            }
            
            const formattedAmount = this.formatWithSeparators(amount, {
                separator,
                decimals,
                persian
            });
            
            return `${formattedAmount} ${currency}`;
        } catch (error) {
            console.warn('Error formatting currency:', error);
            return `${amount} ${options.currency || 'تومان'}`;
        }
    }
    
    /**
     * اعتبارسنجی شماره تلفن ایرانی
     * @param {string} phone - شماره تلفن
     * @returns {boolean} نتیجه اعتبارسنجی
     */
    static validatePhone(phone) {
        try {
            if (!phone || typeof phone !== 'string') return false;
            
            const englishPhone = this.toEnglish(phone.trim());
            const cleanPhone = englishPhone.replace(/[\s-]/g, '');
            
            return this.#iranPhonePattern.test(cleanPhone);
        } catch (error) {
            console.warn('Error validating phone number:', error);
            return false;
        }
    }
    
    /**
     * اعتبارسنجی کد OTP
     * @param {string} otp - کد OTP
     * @returns {boolean} نتیجه اعتبارسنجی
     */
    static validateOTP(otp) {
        try {
            if (!otp || typeof otp !== 'string') return false;
            
            const englishOTP = this.toEnglish(otp.trim());
            return this.#otpPattern.test(englishOTP);
        } catch (error) {
            console.warn('Error validating OTP:', error);
            return false;
        }
    }
    
    /**
     * بررسی معتبر بودن عدد
     * @param {string} str - رشته برای بررسی
     * @returns {boolean} نتیجه بررسی
     */
    static isValidNumber(str) {
        try {
            const parsed = this.parseNumber(str);
            return parsed !== null && !isNaN(parsed);
        } catch (error) {
            console.warn('Error validating number:', error);
            return false;
        }
    }
    
    /**
     * گرد کردن عدد برای محاسبات مالی
     * @param {number} number - عدد برای گرد کردن
     * @param {number} decimals - تعداد رقم اعشار
     * @returns {number} عدد گرد شده
     */
    static roundFinancial(number, decimals = 2) {
        try {
            if (typeof number !== 'number' || isNaN(number)) return 0;
            
            const multiplier = Math.pow(10, decimals);
            return Math.round((number + Number.EPSILON) * multiplier) / multiplier;
        } catch (error) {
            console.warn('Error in financial rounding:', error);
            return number;
        }
    }
    
    /**
     * فرمت‌بندی اندازه فایل به صورت قابل خواندن
     * @param {number} bytes - اندازه به بایت
     * @param {boolean} persian - نمایش با اعداد فارسی
     * @returns {string} اندازه فرمت شده
     */
    static formatFileSize(bytes, persian = true) {
        try {
            if (typeof bytes !== 'number' || bytes < 0) {
                return persian ? '۰ بایت' : '0 bytes';
            }
            
            if (bytes === 0) {
                return persian ? '۰ بایت' : '0 bytes';
            }
            
            const k = 1024;
            const sizes = persian 
                ? ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت', 'ترابایت']
                : ['bytes', 'KB', 'MB', 'GB', 'TB'];
            
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
            
            const formattedSize = persian ? this.toPersian(size.toString()) : size.toString();
            return `${formattedSize} ${sizes[i]}`;
        } catch (error) {
            console.warn('Error formatting file size:', error);
            return persian ? `${bytes} بایت` : `${bytes} bytes`;
        }
    }
    
    /**
     * نرمال‌سازی شماره تلفن برای ذخیره در دیتابیس
     * @param {string} phone - شماره تلفن
     * @returns {string|null} شماره تلفن نرمال شده یا null
     */
    static normalizePhone(phone) {
        try {
            if (!this.validatePhone(phone)) return null;
            
            let normalized = this.toEnglish(phone)
                .replace(/[\s-]/g, '')
                .replace(/^\+98/, '0')
                .replace(/^98/, '0');
            
            if (!normalized.startsWith('0')) {
                normalized = '0' + normalized;
            }
            
            return normalized;
        } catch (error) {
            console.warn('Error normalizing phone number:', error);
            return null;
        }
    }
}

// Export برای استفاده global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NumberUtils;
} else {
    window.NumberUtils = NumberUtils;
}

console.log('✅ NumberUtils (Lightweight) loaded successfully');
