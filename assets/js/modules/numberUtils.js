/**
 * ماژول ابزارهای مدیریت اعداد - NumberUtils Module
 * @description ابزارهای جامع برای مدیریت اعداد در محیط‌های دوزبانه (فارسی/انگلیسی)
 * @author Excel Import AI Team
 * @version 2.0.0
 */

'use strict';

/**
 * کلاس ابزارهای مدیریت اعداد
 * این کلاس شامل توابع مختلفی برای کار با اعداد فارسی و انگلیسی است
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
        const exitTrace = (typeof Logger !== 'undefined' && Logger?.trace) ? Logger.trace('NumberUtils.toEnglish') : null;
        
        try {
            if (input === null || input === undefined) {
                if (typeof Logger !== 'undefined' && Logger?.warn) {
                    Logger.warn('NumberUtils.toEnglish called with null/undefined input');
                }
                return '';
            }
            
            if (typeof Logger !== 'undefined' && Logger?.debug) {
                Logger.debug('NumberUtils.toEnglish called', { 
                    input, 
                    type: typeof input
                });
            }
            
            let result = String(input);
            
            // تبدیل هر کاراکتر فارسی به معادل انگلیسی
            for (const [persian, english] of Object.entries(this.#persianToEnglishMap)) {
                result = result.replace(new RegExp(persian, 'g'), english);
            }
            
            if (typeof Logger !== 'undefined' && Logger?.debug) {
                Logger.debug('Number conversion to English completed', {
                    original: input,
                    converted: result
                });
            }
            
            return result;
        } catch (error) {
            if (typeof Logger !== 'undefined' && Logger?.error) {
                Logger.error('Error converting to English numbers', error, { input });
            }
            return String(input);
        } finally {
            if (exitTrace && typeof exitTrace === 'function') {
                exitTrace();
            }
        }
    }
    
    /**
     * تبدیل اعداد انگلیسی به فارسی
     * @param {string|number} input - ورودی برای تبدیل
     * @returns {string} رشته با اعداد فارسی
     */
    static toPersian(input) {
        const exitTrace = Logger?.trace?.('NumberUtils.toPersian');
        
        try {
            if (input === null || input === undefined) {
                Logger?.warn('NumberUtils.toPersian called with null/undefined input');
                return '';
            }
            
            Logger?.debug('NumberUtils.toPersian called', { 
                input, 
                type: typeof input
            });
            
            let result = String(input);
            
            // تبدیل هر کاراکتر انگلیسی به معادل فارسی
            for (const [english, persian] of Object.entries(this.#englishToPersianMap)) {
                result = result.replace(new RegExp('\\' + english, 'g'), persian);
            }
            
            Logger?.debug('Number conversion to Persian completed', {
                original: input,
                converted: result
            });
            
            return result;
        } catch (error) {
            Logger?.error('Error converting to Persian numbers', error, { input });
            return String(input);
        } finally {
            exitTrace?.();
        }
    }
    
    /**
     * پارس کردن رشته عددی به عدد
     * @param {string} str - رشته عددی
     * @returns {number|null} عدد پارس شده یا null در صورت عدم موفقیت
     */
    static parseNumber(str) {
        const exitTrace = Logger?.trace?.('NumberUtils.parseNumber');
        
        try {
            if (!str || typeof str !== 'string') {
                Logger?.warn('NumberUtils.parseNumber called with invalid input', { str, type: typeof str });
                return null;
            }
            
            Logger?.debug('NumberUtils.parseNumber called', { input: str });
            
            // تبدیل به انگلیسی
            let englishStr = this.toEnglish(str);
            
            // حذف جداکننده‌های هزارگان
            englishStr = englishStr.replace(/,/g, '');
            
            // تلاش برای پارس کردن
            const parsed = parseFloat(englishStr);
            
            if (isNaN(parsed)) {
                Logger?.warn('Failed to parse number', { original: str, processed: englishStr });
                return null;
            }
            
            Logger?.debug('Number parsing successful', {
                original: str,
                processed: englishStr,
                result: parsed
            });
            
            return parsed;
        } catch (error) {
            Logger?.error('Error parsing number', error, { str });
            return null;
        } finally {
            exitTrace?.();
        }
    }
    
    /**
     * فرمت‌بندی عدد با جداکننده هزارگان
     * @param {number} number - عدد برای فرمت
     * @param {Object} options - تنظیمات فرمت
     * @returns {string} عدد فرمت شده
     */
    static formatWithSeparators(number, options = {}) {
        const exitTrace = Logger?.trace?.('NumberUtils.formatWithSeparators');
        
        try {
            const {
                separator = ',',
                decimals = null,
                persian = false
            } = options;
            
            Logger?.debug('NumberUtils.formatWithSeparators called', { 
                number, 
                options 
            });
            
            if (typeof number !== 'number' || isNaN(number)) {
                Logger?.warn('Invalid number provided for formatting', { number, type: typeof number });
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
            
            Logger?.debug('Number formatting completed', {
                original: number,
                formatted: finalResult,
                options
            });
            
            return finalResult;
        } catch (error) {
            Logger?.error('Error formatting number with separators', error, { number, options });
            return persian ? this.toPersian(String(number)) : String(number);
        } finally {
            exitTrace?.();
        }
    }
    
    /**
     * فرمت‌بندی مبلغ پولی
     * @param {number} amount - مبلغ
     * @param {Object} options - تنظیمات فرمت
     * @returns {string} مبلغ فرمت شده
     */
    static formatCurrency(amount, options = {}) {
        const exitTrace = Logger?.trace?.('NumberUtils.formatCurrency');
        
        try {
            const {
                currency = 'تومان',
                persian = true,
                separator = persian ? '،' : ',',
                decimals = 0
            } = options;
            
            Logger?.debug('NumberUtils.formatCurrency called', { 
                amount, 
                options 
            });
            
            if (typeof amount !== 'number' || isNaN(amount)) {
                Logger?.warn('Invalid amount provided for currency formatting', { amount });
                return persian ? `۰ ${currency}` : `0 ${currency}`;
            }
            
            const formattedAmount = this.formatWithSeparators(amount, {
                separator,
                decimals,
                persian
            });
            
            const result = `${formattedAmount} ${currency}`;
            
            Logger?.debug('Currency formatting completed', {
                original: amount,
                formatted: result,
                options
            });
            
            return result;
        } catch (error) {
            Logger?.error('Error formatting currency', error, { amount, options });
            return `${amount} ${options.currency || 'تومان'}`;
        } finally {
            exitTrace?.();
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
            Logger?.error('Error validating phone number', error, { phone });
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
            Logger?.error('Error validating OTP', error, { otp });
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
            Logger?.error('Error validating number', error, { str });
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
            Logger?.error('Error in financial rounding', error, { number, decimals });
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
            Logger?.error('Error formatting file size', error, { bytes, persian });
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
            Logger?.error('Error normalizing phone number', error, { phone });
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

/*
=== نمونه‌های استفاده / Usage Examples ===

// تبدیل اعداد
NumberUtils.toPersian('1234'); // '۱۲۳۴'
NumberUtils.toEnglish('۱۲۳۴'); // '1234'

// پارس کردن اعداد
NumberUtils.parseNumber('۱۲۳٫۴۵'); // 123.45
NumberUtils.parseNumber('1,234.56'); // 1234.56

// فرمت‌بندی مالی
NumberUtils.formatCurrency(1234567); // '۱،۲۳۴،۵۶۷ تومان'
NumberUtils.formatCurrency(1234.56, {currency: 'IRR', persian: false}); // '1,234.56 IRR'

// فرمت با جداکننده
NumberUtils.formatWithSeparators(1234567.89); // '1,234,567.89'
NumberUtils.formatWithSeparators(1234567, {persian: true}); // '۱،۲۳۴،۵۶۷'

// اعتبارسنجی
NumberUtils.validatePhone('09123456789'); // true
NumberUtils.validatePhone('۰۹۱۲۳۴۵۶۷۸۹'); // true
NumberUtils.validateOTP('1234'); // true
NumberUtils.isValidNumber('۱۲۳'); // true

// گرد کردن مالی
NumberUtils.roundFinancial(123.456); // 123.46

// فرمت اندازه فایل
NumberUtils.formatFileSize(1024); // '۱ کیلوبایت'
NumberUtils.formatFileSize(1048576, false); // '1 MB'

// نرمال‌سازی شماره
NumberUtils.normalizePhone('۰۹۱۲۳۴۵۶۷۸۹'); // '09123456789'
*/