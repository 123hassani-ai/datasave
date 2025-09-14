/**
 * Persian Calendar Adapter - سازگار کننده برای ScrollingJalaliPicker
 * @description این فایل یک adapter برای سازگاری با کدهای قدیمی است که از PersianCalendar استفاده می\u200cکنند
 * @author DataSave Team
 * @version 1.0.0
 */

'use strict';

// بررسی وجود ScrollingJalaliPicker
if (typeof ScrollingJalaliPicker === 'undefined') {
    console.error('❌ ScrollingJalaliPicker not found! Please include scrolling-jalali-picker.js first.');
} else {
    /**
     * کلاس PersianCalendar برای سازگاری با کدهای قدیمی
     */
    class PersianCalendar {
        /**
         * اسامی ماه\u200cهای فارسی
         */
        static MONTHS = ScrollingJalaliPicker.persianMonths;

        /**
         * اسامی ماه\u200cهای فارسی - کوتاه
         */
        static MONTHS_SHORT = [
            'فرو', 'ارد', 'خرد', 'تیر', 'مرد', 'شهر',
            'مهر', 'آبا', 'آذر', 'دی', 'بهم', 'اسف'
        ];

        /**
         * اسامی روزهای هفته
         */
        static WEEKDAYS = [
            'شنبه', 'یکشنبه', 'دوشنبه', 'سه\u200cشنبه', 'چهارشنبه', 'پنج\u200cشنبه', 'جمعه'
        ];

        /**
         * اسامی روزهای هفته - کوتاه
         */
        static WEEKDAYS_SHORT = [
            'ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'
        ];

        /**
         * تعداد روزهای ماه\u200cها در سال عادی
         */
        static DAYS_IN_MONTH = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

        /**
         * تعداد روزهای ماه\u200cها در سال کبیسه
         */
        static DAYS_IN_MONTH_LEAP = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30];

        /**
         * تبدیل تاریخ میلادی به شمسی
         * @param {Date} gregorianDate - تاریخ میلادی
         * @returns {Object} - {year, month, day}
         */
        static gregorianToJalali(gregorianDate) {
            const picker = new ScrollingJalaliPicker(document.createElement('input'));
            return picker.gregorianToJalali(gregorianDate);
        }

        /**
         * تبدیل تاریخ شمسی به میلادی
         * @param {number} jYear - سال شمسی
         * @param {number} jMonth - ماه شمسی
         * @param {number} jDay - روز شمسی
         * @returns {Date} - تاریخ میلادی
         */
        static jalaliToGregorian(jYear, jMonth, jDay) {
            const picker = new ScrollingJalaliPicker(document.createElement('input'));
            return picker.jalaliToGregorian(jYear, jMonth, jDay);
        }

        /**
         * بررسی سال کبیسه
         * @param {number} year - سال شمسی
         * @returns {boolean}
         */
        static isLeapYear(year) {
            const picker = new ScrollingJalaliPicker(document.createElement('input'));
            return picker.isLeapYear(year);
        }

        /**
         * دریافت تعداد روزهای ماه
         * @param {number} year - سال شمسی
         * @param {number} month - ماه شمسی
         * @returns {number}
         */
        static getDaysInMonth(year, month) {
            const picker = new ScrollingJalaliPicker(document.createElement('input'));
            return picker.getDaysInMonth(year, month);
        }

        /**
         * فرمت کردن تاریخ
         * @param {Date|Object} date - تاریخ میلادی یا شمسی
         * @param {string} format - فرمت مورد نظر
         * @returns {string}
         */
        static format(date, format = 'DD MMMM YYYY') {
            const picker = new ScrollingJalaliPicker(document.createElement('input'));
            
            let jalaliDate;
            if (date instanceof Date) {
                jalaliDate = picker.gregorianToJalali(date);
            } else if (typeof date === 'object' && date.year) {
                jalaliDate = date;
            } else {
                jalaliDate = picker.gregorianToJalali(new Date());
            }

            const { year, month, day } = jalaliDate;
            
            const replacements = {
                'YYYY': year.toString(),
                'YY': year.toString().slice(-2),
                'MMMM': ScrollingJalaliPicker.persianMonths[month - 1] || '',
                'MMM': PersianCalendar.MONTHS_SHORT[month - 1] || '',
                'MM': month.toString().padStart(2, '0'),
                'M': month.toString(),
                'DD': day.toString().padStart(2, '0'),
                'D': day.toString()
            };

            let formatted = format;
            Object.keys(replacements).forEach(key => {
                formatted = formatted.replace(new RegExp(key, 'g'), replacements[key]);
            });

            return formatted;
        }

        /**
         * دریافت تاریخ امروز
         * @param {string} format - فرمت مورد نظر
         * @returns {string|Object}
         */
        static now(format = null) {
            const picker = new ScrollingJalaliPicker(document.createElement('input'));
            const today = new Date();
            const jalaliToday = picker.gregorianToJalali(today);
            
            if (format) {
                return PersianCalendar.format(jalaliToday, format);
            }
            
            return jalaliToday;
        }
    }

    // تعریف سراسری برای مرورگر
    window.PersianCalendar = PersianCalendar;
    
    console.log('✅ PersianCalendar adapter loaded successfully');
}