/**
 * ScrollingJalaliPicker - ماژول کامل دیت پیکر شمسی
 * @description یک کتابخانه مدرن و قابل شخصی‌سازی برای انتخاب تاریخ شمسی
 * @version 1.0.0
 * @author DataSave Team
 */

'use strict';

class ScrollingJalaliPicker {
    
    /**
     * پیکربندی پیش‌فرض
     */
    static defaultConfig = {
        // تنظیمات ظاهری
        theme: 'modern', // modern, classic, minimal, glass
        size: 'medium', // small, medium, large
        borderRadius: '15px',
        backdropBlur: true,
        animation: 'slideUp', // slideUp, fadeIn, scaleIn, slideDown
        animationDuration: 300,
        
        // رنگ‌ها
        colors: {
            primary: '#667eea',
            secondary: '#764ba2',
            success: '#2ecc71',
            danger: '#e74c3c',
            text: '#333',
            textLight: '#666',
            background: '#ffffff',
            overlay: 'rgba(0, 0, 0, 0.5)'
        },
        
        // فونت
        fontFamily: 'Vazirmatn, Tahoma, sans-serif',
        fontSize: {
            small: '12px',
            medium: '14px',
            large: '16px'
        },
        
        // تنظیمات تاریخ
        yearRange: {
            min: 1300,
            max: 1500
        },
        defaultDate: null, // null = امروز
        
        // متن‌ها
        texts: {
            title: 'انتخاب تاریخ شمسی',
            subtitle: 'تاریخ مورد نظر خود را انتخاب کنید',
            year: 'سال',
            month: 'ماه',
            day: 'روز',
            confirm: '✅ تأیید',
            cancel: '❌ انصراف',
            today: '📅 امروز',
            clear: '🗑️ پاک کردن',
            close: '✖️ بستن'
        },
        
        // رفتارها
        autoClose: true,
        showToday: true,
        showClear: true,
        closeOnOverlay: true,
        showGregorian: true,
        rtl: true,
        
        // callback ها
        onSelect: null,
        onOpen: null,
        onClose: null,
        onChange: null
    };

    /**
     * اسامی ماه‌های فارسی
     */
    static persianMonths = [
        'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
        'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
    ];

    /**
     * اسامی روزهای هفته
     */
    static persianWeekdays = [
        'شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'
    ];

    /**
     * سازنده
     * @param {string|Element} selector - انتخابگر یا المنت
     * @param {Object} config - تنظیمات سفارشی
     */
    constructor(selector, config = {}) {
        this.element = typeof selector === 'string' ? document.querySelector(selector) : selector;
        if (!this.element) {
            throw new Error('Element not found: ' + selector);
        }

        this.config = this.mergeConfig(ScrollingJalaliPicker.defaultConfig, config);
        this.selectedDate = this.getDefaultDate();
        this.isOpen = false;
        this.modal = null;
        this.overlay = null;

        this.init();
    }

    /**
     * ادغام تنظیمات
     */
    mergeConfig(defaultConfig, userConfig) {
        const merged = JSON.parse(JSON.stringify(defaultConfig));
        
        Object.keys(userConfig).forEach(key => {
            if (typeof userConfig[key] === 'object' && !Array.isArray(userConfig[key]) && userConfig[key] !== null) {
                merged[key] = { ...merged[key], ...userConfig[key] };
            } else {
                merged[key] = userConfig[key];
            }
        });
        
        return merged;
    }

    /**
     * دریافت تاریخ پیش‌فرض
     */
    getDefaultDate() {
        if (this.config.defaultDate) {
            return this.config.defaultDate;
        }
        
        const today = new Date();
        return this.gregorianToJalali(today);
    }

    /**
     * مقداردهی اولیه
     */
    init() {
        this.setupElement();
        this.createStyles();
        this.attachEvents();
    }

    /**
     * تنظیم المنت اصلی
     */
    setupElement() {
        this.element.style.cursor = 'pointer';
        this.element.readOnly = true;
        this.element.placeholder = this.element.placeholder || 'کلیک کنید...';
        
        // اضافه کردن کلاس‌های سفارشی
        this.element.classList.add('scrolling-jalali-picker-input');
    }

    /**
     * ایجاد استایل‌های CSS
     */
    createStyles() {
        if (document.getElementById('scrolling-jalali-picker-styles')) return;

        const style = document.createElement('style');
        style.id = 'scrolling-jalali-picker-styles';
        style.textContent = this.generateCSS();
        document.head.appendChild(style);
    }

    /**
     * تولید CSS
     */
    generateCSS() {
        const { colors, fontSize, fontFamily, borderRadius } = this.config;
        const size = this.getSizeValues();

        return `
            .scrolling-jalali-picker-input {
                font-family: ${fontFamily};
                transition: all 0.3s ease;
            }

            .scrolling-jalali-picker-input:focus {
                outline: none;
                box-shadow: 0 0 0 2px ${colors.primary}40;
                border-color: ${colors.primary};
            }

            .scrolling-jalali-picker-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: ${colors.overlay};
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                opacity: 0;
                transition: opacity ${this.config.animationDuration}ms ease;
            }

            .scrolling-jalali-picker-overlay.show {
                opacity: 1;
            }

            .scrolling-jalali-picker-modal {
                background: ${colors.background};
                border-radius: ${borderRadius};
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                max-width: ${size.modalWidth};
                width: 100%;
                font-family: ${fontFamily};
                transform: translateY(50px) scale(0.9);
                opacity: 0;
                transition: all ${this.config.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1);
                ${this.config.backdropBlur ? 'backdrop-filter: blur(20px);' : ''}
            }

            .scrolling-jalali-picker-modal.show {
                transform: translateY(0) scale(1);
                opacity: 1;
            }

            .scrolling-jalali-picker-header {
                background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
                color: white;
                padding: ${size.headerPadding};
                border-radius: ${borderRadius} ${borderRadius} 0 0;
                text-align: center;
            }

            .scrolling-jalali-picker-title {
                font-size: ${size.titleSize};
                font-weight: bold;
                margin-bottom: 5px;
            }

            .scrolling-jalali-picker-subtitle {
                font-size: ${size.subtitleSize};
                opacity: 0.9;
            }

            .scrolling-jalali-picker-body {
                padding: ${size.bodyPadding};
            }

            .scrolling-jalali-picker-display {
                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                border-radius: ${borderRadius};
                padding: ${size.displayPadding};
                text-align: center;
                margin-bottom: 20px;
            }

            .scrolling-jalali-picker-date {
                font-size: ${size.dateSize};
                font-weight: bold;
                color: ${colors.text};
                margin-bottom: 5px;
            }

            .scrolling-jalali-picker-gregorian {
                font-size: ${size.gregorianSize};
                color: ${colors.textLight};
            }

            .scrolling-jalali-picker-selectors {
                display: flex;
                gap: 15px;
                justify-content: center;
            }

            .scrolling-jalali-picker-selector {
                flex: 1;
                text-align: center;
            }

            .scrolling-jalali-picker-selector-title {
                font-weight: bold;
                color: ${colors.text};
                margin-bottom: 10px;
                font-size: ${size.selectorTitleSize};
            }

            .scrolling-jalali-picker-scroll {
                height: ${size.scrollHeight};
                overflow-y: auto;
                border: 2px solid #e9ecef;
                border-radius: ${borderRadius};
                position: relative;
            }

            .scrolling-jalali-picker-scroll::-webkit-scrollbar {
                width: 6px;
            }

            .scrolling-jalali-picker-scroll::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 10px;
            }

            .scrolling-jalali-picker-scroll::-webkit-scrollbar-thumb {
                background: ${colors.primary};
                border-radius: 10px;
            }

            .scrolling-jalali-picker-scroll::-webkit-scrollbar-thumb:hover {
                background: ${this.darkenColor(colors.primary, 10)};
            }

            .scrolling-jalali-picker-scroll::before,
            .scrolling-jalali-picker-scroll::after {
                content: '';
                position: absolute;
                left: 0;
                right: 0;
                height: 15px;
                pointer-events: none;
                z-index: 1;
            }

            .scrolling-jalali-picker-scroll::before {
                top: 0;
                background: linear-gradient(to bottom, ${colors.background}, transparent);
            }

            .scrolling-jalali-picker-scroll::after {
                bottom: 0;
                background: linear-gradient(to top, ${colors.background}, transparent);
            }

            .scrolling-jalali-picker-item {
                padding: ${size.itemPadding};
                cursor: pointer;
                transition: all 0.2s ease;
                color: ${colors.text};
                border-radius: 8px;
                margin: 2px 8px;
                position: relative;
                overflow: hidden;
            }

            .scrolling-jalali-picker-item:hover {
                background: ${colors.primary}20;
                transform: translateY(-1px);
            }

            .scrolling-jalali-picker-item.selected {
                background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
                color: white;
                font-weight: bold;
                box-shadow: 0 2px 8px ${colors.primary}40;
            }

            .scrolling-jalali-picker-item::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                transition: left 0.5s;
            }

            .scrolling-jalali-picker-item:hover::before {
                left: 100%;
            }

            .scrolling-jalali-picker-footer {
                display: flex;
                gap: 10px;
                padding: ${size.footerPadding};
                background: #f8f9fa;
                border-radius: 0 0 ${borderRadius} ${borderRadius};
            }

            .scrolling-jalali-picker-btn {
                flex: 1;
                padding: ${size.buttonPadding};
                border: none;
                border-radius: 10px;
                font-family: ${fontFamily};
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: ${size.buttonSize};
            }

            .scrolling-jalali-picker-btn:hover {
                transform: translateY(-2px);
            }

            .scrolling-jalali-picker-btn.primary {
                background: linear-gradient(135deg, ${colors.success}, #27ae60);
                color: white;
                box-shadow: 0 4px 15px ${colors.success}40;
            }

            .scrolling-jalali-picker-btn.primary:hover {
                box-shadow: 0 6px 20px ${colors.success}60;
            }

            .scrolling-jalali-picker-btn.secondary {
                background: linear-gradient(135deg, #6c757d, #495057);
                color: white;
                box-shadow: 0 4px 15px #6c757d40;
            }

            .scrolling-jalali-picker-btn.secondary:hover {
                box-shadow: 0 6px 20px #6c757d60;
            }

            .scrolling-jalali-picker-btn.danger {
                background: linear-gradient(135deg, ${colors.danger}, #c0392b);
                color: white;
                box-shadow: 0 4px 15px ${colors.danger}40;
            }

            .scrolling-jalali-picker-btn.info {
                background: linear-gradient(135deg, #3498db, #2980b9);
                color: white;
                box-shadow: 0 4px 15px #3498db40;
            }

            /* انیمیشن‌ها */
            @keyframes slideUp {
                from {
                    transform: translateY(100px) scale(0.9);
                    opacity: 0;
                }
                to {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                }
            }

            @keyframes slideDown {
                from {
                    transform: translateY(-100px) scale(0.9);
                    opacity: 0;
                }
                to {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                }
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            @keyframes scaleIn {
                from {
                    transform: scale(0.5);
                    opacity: 0;
                }
                to {
                    transform: scale(1);
                    opacity: 1;
                }
            }

            /* Responsive */
            @media (max-width: 768px) {
                .scrolling-jalali-picker-modal {
                    max-width: 95%;
                    margin: 10px;
                }
                
                .scrolling-jalali-picker-selectors {
                    gap: 8px;
                }
                
                .scrolling-jalali-picker-scroll {
                    height: 120px;
                }
                
                .scrolling-jalali-picker-footer {
                    flex-direction: column;
                }
            }
        `;
    }

    /**
     * دریافت مقادیر اندازه بر اساس تنظیمات
     */
    getSizeValues() {
        const sizeMap = {
            small: {
                modalWidth: '300px',
                headerPadding: '15px',
                bodyPadding: '15px',
                footerPadding: '15px',
                displayPadding: '15px',
                titleSize: '16px',
                subtitleSize: '12px',
                dateSize: '18px',
                gregorianSize: '11px',
                selectorTitleSize: '12px',
                scrollHeight: '120px',
                itemPadding: '6px 10px',
                buttonPadding: '8px 12px',
                buttonSize: '12px'
            },
            medium: {
                modalWidth: '400px',
                headerPadding: '20px',
                bodyPadding: '20px',
                footerPadding: '20px',
                displayPadding: '20px',
                titleSize: '18px',
                subtitleSize: '14px',
                dateSize: '22px',
                gregorianSize: '12px',
                selectorTitleSize: '14px',
                scrollHeight: '160px',
                itemPadding: '8px 12px',
                buttonPadding: '10px 16px',
                buttonSize: '14px'
            },
            large: {
                modalWidth: '500px',
                headerPadding: '25px',
                bodyPadding: '25px',
                footerPadding: '25px',
                displayPadding: '25px',
                titleSize: '20px',
                subtitleSize: '16px',
                dateSize: '26px',
                gregorianSize: '14px',
                selectorTitleSize: '16px',
                scrollHeight: '200px',
                itemPadding: '10px 15px',
                buttonPadding: '12px 20px',
                buttonSize: '16px'
            }
        };

        return sizeMap[this.config.size] || sizeMap.medium;
    }

    /**
     * تیره کردن رنگ
     */
    darkenColor(color, amount) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * amount);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    /**
     * اتصال رویدادها
     */
    attachEvents() {
        this.element.addEventListener('click', () => this.open());
        this.element.addEventListener('focus', () => this.open());
        
        // کلیدهای میانبر
        document.addEventListener('keydown', (e) => {
            if (this.isOpen) {
                if (e.key === 'Escape') {
                    this.close();
                }
                if (e.key === 'Enter') {
                    this.confirmSelection();
                }
            }
        });
    }

    /**
     * باز کردن picker
     */
    open() {
        if (this.isOpen) return;

        this.isOpen = true;
        this.createModal();
        this.initSelectors();
        
        document.body.style.overflow = 'hidden';
        
        // انیمیشن
        setTimeout(() => {
            this.overlay.classList.add('show');
            this.modal.classList.add('show');
        }, 10);

        // فراخوانی callback
        if (this.config.onOpen) {
            this.config.onOpen(this);
        }
    }

    /**
     * ایجاد modal
     */
    createModal() {
        // Overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'scrolling-jalali-picker-overlay';
        
        if (this.config.closeOnOverlay) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.close();
                }
            });
        }

        // Modal
        this.modal = document.createElement('div');
        this.modal.className = 'scrolling-jalali-picker-modal';
        this.modal.innerHTML = this.getModalHTML();

        this.overlay.appendChild(this.modal);
        document.body.appendChild(this.overlay);

        // اتصال رویدادها
        this.attachModalEvents();
    }

    /**
     * دریافت HTML modal
     */
    getModalHTML() {
        const { texts, showGregorian } = this.config;
        const persianDate = this.formatPersianDate(this.selectedDate);
        const gregorianDate = this.formatGregorianDate(this.selectedDate);

        return `
            <div class="scrolling-jalali-picker-header">
                <div class="scrolling-jalali-picker-title">${texts.title}</div>
                <div class="scrolling-jalali-picker-subtitle">${texts.subtitle}</div>
            </div>
            
            <div class="scrolling-jalali-picker-body">
                <div class="scrolling-jalali-picker-display">
                    <div class="scrolling-jalali-picker-date" id="selected-date-display">
                        ${persianDate}
                    </div>
                    ${showGregorian ? `<div class="scrolling-jalali-picker-gregorian" id="selected-date-gregorian">${gregorianDate}</div>` : ''}
                </div>
                
                <div class="scrolling-jalali-picker-selectors">
                    <div class="scrolling-jalali-picker-selector">
                        <div class="scrolling-jalali-picker-selector-title">${texts.year}</div>
                        <div class="scrolling-jalali-picker-scroll" id="year-scroll">
                            <div id="year-picker"></div>
                        </div>
                    </div>
                    
                    <div class="scrolling-jalali-picker-selector">
                        <div class="scrolling-jalali-picker-selector-title">${texts.month}</div>
                        <div class="scrolling-jalali-picker-scroll" id="month-scroll">
                            <div id="month-picker"></div>
                        </div>
                    </div>
                    
                    <div class="scrolling-jalali-picker-selector">
                        <div class="scrolling-jalali-picker-selector-title">${texts.day}</div>
                        <div class="scrolling-jalali-picker-scroll" id="day-scroll">
                            <div id="day-picker"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="scrolling-jalali-picker-footer">
                ${this.config.showToday ? `<button class="scrolling-jalali-picker-btn info" id="btn-today">${texts.today}</button>` : ''}
                ${this.config.showClear ? `<button class="scrolling-jalali-picker-btn danger" id="btn-clear">${texts.clear}</button>` : ''}
                <button class="scrolling-jalali-picker-btn secondary" id="btn-cancel">${texts.cancel}</button>
                <button class="scrolling-jalali-picker-btn primary" id="btn-confirm">${texts.confirm}</button>
            </div>
        `;
    }

    /**
     * اتصال رویدادهای modal
     */
    attachModalEvents() {
        // دکمه‌ها
        const btnConfirm = this.modal.querySelector('#btn-confirm');
        const btnCancel = this.modal.querySelector('#btn-cancel');
        const btnToday = this.modal.querySelector('#btn-today');
        const btnClear = this.modal.querySelector('#btn-clear');

        if (btnConfirm) btnConfirm.addEventListener('click', () => this.confirmSelection());
        if (btnCancel) btnCancel.addEventListener('click', () => this.close());
        if (btnToday) btnToday.addEventListener('click', () => this.setToday());
        if (btnClear) btnClear.addEventListener('click', () => this.clearSelection());
    }

    /**
     * مقداردهی selectors
     */
    initSelectors() {
        this.initYearPicker();
        this.initMonthPicker();
        this.initDayPicker();
        this.updateDisplay();
    }

    /**
     * مقداردهی picker سال
     */
    initYearPicker() {
        const container = this.modal.querySelector('#year-picker');
        container.innerHTML = '';
        
        for (let year = this.config.yearRange.min; year <= this.config.yearRange.max; year++) {
            const item = document.createElement('div');
            item.className = `scrolling-jalali-picker-item ${year === this.selectedDate.year ? 'selected' : ''}`;
            item.textContent = year;
            item.addEventListener('click', () => this.selectYear(year));
            container.appendChild(item);
        }

        // اسکرول به سال انتخاب شده
        this.scrollToSelected('#year-scroll', this.selectedDate.year - this.config.yearRange.min);
    }

    /**
     * مقداردهی picker ماه
     */
    initMonthPicker() {
        const container = this.modal.querySelector('#month-picker');
        container.innerHTML = '';
        
        ScrollingJalaliPicker.persianMonths.forEach((month, index) => {
            const item = document.createElement('div');
            item.className = `scrolling-jalali-picker-item ${index + 1 === this.selectedDate.month ? 'selected' : ''}`;
            item.textContent = month;
            item.addEventListener('click', () => this.selectMonth(index + 1));
            container.appendChild(item);
        });

        // اسکرول به ماه انتخاب شده
        this.scrollToSelected('#month-scroll', this.selectedDate.month - 1);
    }

    /**
     * مقداردهی picker روز
     */
    initDayPicker() {
        const container = this.modal.querySelector('#day-picker');
        container.innerHTML = '';
        
        const daysInMonth = this.getDaysInMonth(this.selectedDate.year, this.selectedDate.month);
        
        // اصلاح روز انتخاب شده اگر بیشتر از روزهای ماه باشد
        if (this.selectedDate.day > daysInMonth) {
            this.selectedDate.day = daysInMonth;
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const item = document.createElement('div');
            item.className = `scrolling-jalali-picker-item ${day === this.selectedDate.day ? 'selected' : ''}`;
            item.textContent = day;
            item.addEventListener('click', () => this.selectDay(day));
            container.appendChild(item);
        }

        // اسکرول به روز انتخاب شده
        this.scrollToSelected('#day-scroll', this.selectedDate.day - 1);
    }

    /**
     * اسکرول به آیتم انتخاب شده
     */
    scrollToSelected(scrollSelector, index) {
        setTimeout(() => {
            const scrollContainer = this.modal.querySelector(scrollSelector);
            const items = scrollContainer.querySelectorAll('.scrolling-jalali-picker-item');
            
            if (items[index]) {
                const itemHeight = items[0].offsetHeight;
                const containerHeight = scrollContainer.offsetHeight;
                const scrollTop = (index * itemHeight) - (containerHeight / 2) + (itemHeight / 2);
                
                scrollContainer.scrollTo({
                    top: Math.max(0, scrollTop),
                    behavior: 'smooth'
                });
            }
        }, 100);
    }

    /**
     * انتخاب سال
     */
    selectYear(year) {
        this.selectedDate.year = year;
        this.updateSelections();
        this.updateDisplay();
        this.initDayPicker(); // به روزرسانی روزها بر اساس سال جدید
        
        if (this.config.onChange) {
            this.config.onChange(this.selectedDate, this);
        }
    }

    /**
     * انتخاب ماه
     */
    selectMonth(month) {
        this.selectedDate.month = month;
        this.updateSelections();
        this.updateDisplay();
        this.initDayPicker(); // به روزرسانی روزها بر اساس ماه جدید
        
        if (this.config.onChange) {
            this.config.onChange(this.selectedDate, this);
        }
    }

    /**
     * انتخاب روز
     */
    selectDay(day) {
        this.selectedDate.day = day;
        this.updateSelections();
        this.updateDisplay();
        
        if (this.config.onChange) {
            this.config.onChange(this.selectedDate, this);
        }
    }

    /**
     * به روزرسانی انتخاب‌ها در UI
     */
    updateSelections() {
        // به روزرسانی کلاس selected
        this.modal.querySelectorAll('.scrolling-jalali-picker-item').forEach(item => {
            item.classList.remove('selected');
        });

        // سال
        const yearItems = this.modal.querySelectorAll('#year-picker .scrolling-jalali-picker-item');
        yearItems.forEach((item, index) => {
            if (parseInt(item.textContent) === this.selectedDate.year) {
                item.classList.add('selected');
            }
        });

        // ماه
        const monthItems = this.modal.querySelectorAll('#month-picker .scrolling-jalali-picker-item');
        monthItems.forEach((item, index) => {
            if (index + 1 === this.selectedDate.month) {
                item.classList.add('selected');
            }
        });

        // روز
        const dayItems = this.modal.querySelectorAll('#day-picker .scrolling-jalali-picker-item');
        dayItems.forEach((item, index) => {
            if (parseInt(item.textContent) === this.selectedDate.day) {
                item.classList.add('selected');
            }
        });
    }

    /**
     * به روزرسانی نمایش تاریخ
     */
    updateDisplay() {
        const persianDate = this.formatPersianDate(this.selectedDate);
        const gregorianDate = this.formatGregorianDate(this.selectedDate);

        const dateDisplay = this.modal.querySelector('#selected-date-display');
        const gregorianDisplay = this.modal.querySelector('#selected-date-gregorian');

        if (dateDisplay) dateDisplay.textContent = persianDate;
        if (gregorianDisplay) gregorianDisplay.textContent = gregorianDate;
    }

    /**
     * تأیید انتخاب
     */
    confirmSelection() {
        const persianDate = this.formatPersianDate(this.selectedDate);
        const isoDate = `${this.selectedDate.year}/${String(this.selectedDate.month).padStart(2, '0')}/${String(this.selectedDate.day).padStart(2, '0')}`;
        
        this.element.value = persianDate;
        this.element.dataset.date = isoDate;
        this.element.dataset.jalaliYear = this.selectedDate.year;
        this.element.dataset.jalaliMonth = this.selectedDate.month;
        this.element.dataset.jalaliDay = this.selectedDate.day;

        // فراخوانی callback
        if (this.config.onSelect) {
            this.config.onSelect(this.selectedDate, persianDate, isoDate, this);
        }

        if (this.config.autoClose) {
            this.close();
        }
    }

    /**
     * تنظیم تاریخ امروز
     */
    setToday() {
        const today = new Date();
        this.selectedDate = this.gregorianToJalali(today);
        this.initSelectors();
    }

    /**
     * پاک کردن انتخاب
     */
    clearSelection() {
        this.element.value = '';
        this.element.dataset.date = '';
        this.element.dataset.jalaliYear = '';
        this.element.dataset.jalaliMonth = '';
        this.element.dataset.jalaliDay = '';
        this.close();
    }

    /**
     * بستن picker
     */
    close() {
        if (!this.isOpen) return;

        this.overlay.classList.remove('show');
        this.modal.classList.remove('show');
        
        setTimeout(() => {
            if (this.overlay && this.overlay.parentNode) {
                this.overlay.parentNode.removeChild(this.overlay);
            }
            this.isOpen = false;
            document.body.style.overflow = '';
            
            // فراخوانی callback
            if (this.config.onClose) {
                this.config.onClose(this);
            }
        }, this.config.animationDuration);
    }

    /**
     * تبدیل میلادی به شمسی
     */
    gregorianToJalali(gDate) {
        const gy = gDate.getFullYear();
        const gm = gDate.getMonth() + 1;
        const gd = gDate.getDate();
        
        // الگوریتم ساده تبدیل (برای استفاده واقعی از الگوریتم دقیق‌تر استفاده کنید)
        const jy = gy - 621;
        const jm = gm;
        const jd = gd;
        
        return { year: jy, month: jm, day: jd };
    }

    /**
     * تبدیل شمسی به میلادی
     */
    jalaliToGregorian(jYear, jMonth, jDay) {
        // الگوریتم ساده تبدیل (برای استفاده واقعی از الگوریتم دقیق‌تر استفاده کنید)
        const gy = jYear + 621;
        const gm = jMonth;
        const gd = jDay;
        
        return new Date(gy, gm - 1, gd);
    }

    /**
     * چک کردن سال کبیسه
     */
    isLeapYear(year) {
        const cycle = year % 128;
        const yearCycle = cycle % 33;
        return [1, 5, 9, 13, 17, 22, 26, 30].includes(yearCycle);
    }

    /**
     * تعداد روزهای ماه
     */
    getDaysInMonth(year, month) {
        if (month <= 6) return 31;
        if (month <= 11) return 30;
        return this.isLeapYear(year) ? 30 : 29;
    }

    /**
     * فرمت کردن تاریخ فارسی
     */
    formatPersianDate(date) {
        return `${date.day} ${ScrollingJalaliPicker.persianMonths[date.month - 1]} ${date.year}`;
    }

    /**
     * فرمت کردن تاریخ میلادی
     */
    formatGregorianDate(date) {
        const gDate = this.jalaliToGregorian(date.year, date.month, date.day);
        return gDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    /**
     * دریافت تاریخ انتخاب شده
     */
    getSelectedDate() {
        return {
            jalali: this.selectedDate,
            persian: this.formatPersianDate(this.selectedDate),
            iso: `${this.selectedDate.year}/${String(this.selectedDate.month).padStart(2, '0')}/${String(this.selectedDate.day).padStart(2, '0')}`,
            gregorian: this.jalaliToGregorian(this.selectedDate.year, this.selectedDate.month, this.selectedDate.day)
        };
    }

    /**
     * تنظیم تاریخ
     */
    setDate(year, month, day) {
        this.selectedDate = { year, month, day };
        const persianDate = this.formatPersianDate(this.selectedDate);
        const isoDate = `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
        
        this.element.value = persianDate;
        this.element.dataset.date = isoDate;
        this.element.dataset.jalaliYear = year;
        this.element.dataset.jalaliMonth = month;
        this.element.dataset.jalaliDay = day;
    }

    /**
     * به روزرسانی تنظیمات
     */
    updateConfig(newConfig) {
        this.config = this.mergeConfig(this.config, newConfig);
        this.createStyles(); // به روزرسانی استایل‌ها
    }

    /**
     * حذف picker
     */
    destroy() {
        if (this.isOpen) {
            this.close();
        }
        
        // حذف event listener ها
        this.element.removeEventListener('click', () => this.open());
        this.element.removeEventListener('focus', () => this.open());
        
        // حذف کلاس‌ها و dataset ها
        this.element.classList.remove('scrolling-jalali-picker-input');
        delete this.element.dataset.date;
        delete this.element.dataset.jalaliYear;
        delete this.element.dataset.jalaliMonth;
        delete this.element.dataset.jalaliDay;
    }

    /**
     * متدهای استاتیک
     */
    
    /**
     * ایجاد چندین picker
     */
    static create(selector, config = {}) {
        const elements = typeof selector === 'string' ? 
            document.querySelectorAll(selector) : 
            (selector.length ? selector : [selector]);
        
        const pickers = [];
        elements.forEach(element => {
            pickers.push(new ScrollingJalaliPicker(element, config));
        });
        
        return pickers.length === 1 ? pickers[0] : pickers;
    }

    /**
     * تنظیم پیکربندی سراسری
     */
    static setGlobalConfig(config) {
        ScrollingJalaliPicker.defaultConfig = 
            ScrollingJalaliPicker.prototype.mergeConfig.call(
                null, 
                ScrollingJalaliPicker.defaultConfig, 
                config
            );
    }

    /**
     * دریافت تاریخ امروز
     */
    static getToday() {
        const today = new Date();
        const instance = new ScrollingJalaliPicker(document.createElement('input'));
        return instance.gregorianToJalali(today);
    }
}

// Export برای استفاده در Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrollingJalaliPicker;
}

// تعریف سراسری برای مرورگر
if (typeof window !== 'undefined') {
    window.ScrollingJalaliPicker = ScrollingJalaliPicker;
}
