/**
 * ماژول فرم‌ها
 * Forms Module
 * 
 * @description: ماژول مدیریت فرم‌ها و المان‌های فرم
 * @version: 1.0.0
 * @author: DataSave Team
 */

'use strict';

/**
 * ماژول فرم‌ها
 * Forms Module
 */
export default {
    /**
     * ایجاد یک فرم
     * 
     * @param {Object} options - تنظیمات فرم
     * @returns {string} - HTML فرم
     */
    createForm(options = {}) {
        const {
            id = 'form-' + Date.now(),
            className = '',
            fields = [],
            values = {},
            submitButton = { text: 'ذخیره', className: 'btn-primary' },
            cancelButton = null,
            layout = 'vertical' // vertical, horizontal, grid
        } = options;
        
        // تعیین کلاس‌های لایه‌بندی
        let formClass = 'data-form';
        
        switch (layout) {
            case 'horizontal':
                formClass += ' form-horizontal';
                break;
            case 'grid':
                formClass += ' form-grid';
                break;
            default:
                formClass += ' form-vertical';
        }
        
        // ایجاد فیلدهای فرم
        const formFields = fields.map(field => this.createFormField(field, values[field.name], layout)).join('');
        
        // ایجاد دکمه‌های فرم
        const buttons = `
            <div class="form-actions" style="display: flex; justify-content: ${cancelButton ? 'space-between' : 'flex-end'}; margin-top: var(--spacing-4);">
                ${cancelButton ? `
                    <button type="button" class="btn ${cancelButton.className || 'btn-secondary'}" id="${id}-cancel">
                        ${cancelButton.text || 'انصراف'}
                    </button>
                ` : ''}
                <button type="submit" class="btn ${submitButton.className}" id="${id}-submit">
                    ${submitButton.text}
                </button>
            </div>
        `;
        
        // ایجاد کل فرم
        return `
            <form id="${id}" class="${formClass} ${className}" style="width: 100%;">
                ${formFields}
                ${buttons}
            </form>
        `;
    },
    
    /**
     * ایجاد یک فیلد فرم
     * 
     * @param {Object} field - تنظیمات فیلد
     * @param {*} value - مقدار پیش‌فرض فیلد
     * @param {string} layout - نوع لایه‌بندی فرم
     * @returns {string} - HTML فیلد فرم
     */
    createFormField(field, value = '', layout = 'vertical') {
        const {
            type = 'text',
            name,
            label = '',
            placeholder = '',
            required = false,
            disabled = false,
            readOnly = false,
            className = '',
            options = [],
            cols = 1, // تعداد ستون‌ها در حالت grid
            help = '',
            validation = {},
            attributes = {}
        } = field;
        
        // تبدیل attributes به رشته
        const attrString = Object.entries(attributes)
            .map(([key, val]) => `${key}="${val}"`)
            .join(' ');
        
        // مقدار پیش‌فرض
        const defaultValue = value !== undefined ? value : (field.defaultValue || '');
        
        // تعیین کلاس‌های لایه‌بندی
        let fieldWrapperClass = 'form-field';
        let labelClass = 'form-label';
        let inputWrapperClass = 'form-input-wrapper';
        
        if (layout === 'horizontal') {
            fieldWrapperClass += ' form-field-horizontal';
        } else if (layout === 'grid') {
            fieldWrapperClass += ' form-field-grid';
            fieldWrapperClass += ` grid-cols-${cols}`;
        }
        
        // ایجاد بخش ورودی بر اساس نوع فیلد
        let inputHtml = '';
        
        switch (type) {
            case 'text':
            case 'email':
            case 'password':
            case 'number':
            case 'tel':
            case 'url':
            case 'date':
                inputHtml = `
                    <input 
                        type="${type}" 
                        id="${name}" 
                        name="${name}" 
                        class="form-input ${className}"
                        placeholder="${placeholder}"
                        value="${defaultValue}"
                        ${required ? 'required' : ''}
                        ${disabled ? 'disabled' : ''}
                        ${readOnly ? 'readonly' : ''}
                        ${attrString}
                        style="width: 100%; padding: var(--spacing-3); border-radius: var(--radius-md); border: 1px solid var(--glass-border); background: var(--glass-bg-lighter); outline: none; transition: border-color 0.3s, box-shadow 0.3s;"
                    >
                `;
                break;
                
            case 'textarea':
                inputHtml = `
                    <textarea 
                        id="${name}" 
                        name="${name}" 
                        class="form-textarea ${className}"
                        placeholder="${placeholder}"
                        ${required ? 'required' : ''}
                        ${disabled ? 'disabled' : ''}
                        ${readOnly ? 'readonly' : ''}
                        rows="${field.rows || 4}"
                        ${attrString}
                        style="width: 100%; padding: var(--spacing-3); border-radius: var(--radius-md); border: 1px solid var(--glass-border); background: var(--glass-bg-lighter); outline: none; resize: vertical; min-height: 100px; transition: border-color 0.3s, box-shadow 0.3s;"
                    >${defaultValue}</textarea>
                `;
                break;
                
            case 'select':
                const optionsHtml = options.map(option => {
                    const isSelected = option.value == defaultValue;
                    return `<option value="${option.value}" ${isSelected ? 'selected' : ''}>${option.label}</option>`;
                }).join('');
                
                inputHtml = `
                    <select 
                        id="${name}" 
                        name="${name}" 
                        class="form-select ${className}"
                        ${required ? 'required' : ''}
                        ${disabled ? 'disabled' : ''}
                        ${attrString}
                        style="width: 100%; padding: var(--spacing-3); border-radius: var(--radius-md); border: 1px solid var(--glass-border); background: var(--glass-bg-lighter); outline: none; transition: border-color 0.3s, box-shadow 0.3s; appearance: none; background-image: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 9l6 6 6-6\"/></svg>'); background-repeat: no-repeat; background-position: left 10px center; background-size: 16px;"
                    >
                        ${placeholder ? `<option value="" ${!defaultValue ? 'selected' : ''}>${placeholder}</option>` : ''}
                        ${optionsHtml}
                    </select>
                `;
                break;
                
            case 'checkbox':
                inputHtml = `
                    <div class="checkbox-wrapper" style="display: flex; align-items: center;">
                        <input 
                            type="checkbox" 
                            id="${name}" 
                            name="${name}" 
                            class="form-checkbox ${className}"
                            value="1"
                            ${defaultValue ? 'checked' : ''}
                            ${required ? 'required' : ''}
                            ${disabled ? 'disabled' : ''}
                            ${attrString}
                            style="margin-left: var(--spacing-2); width: 18px; height: 18px; accent-color: var(--primary);"
                        >
                        <label for="${name}" style="font-weight: normal; margin-bottom: 0;">${label}</label>
                    </div>
                `;
                // در چک‌باکس، لیبل داخل المان ورودی قرار می‌گیرد
                label = '';
                break;
                
            case 'radio':
                inputHtml = `
                    <div class="radio-group" style="display: flex; flex-direction: column; gap: var(--spacing-2);">
                        ${options.map(option => `
                            <div class="radio-wrapper" style="display: flex; align-items: center;">
                                <input 
                                    type="radio" 
                                    id="${name}_${option.value}" 
                                    name="${name}" 
                                    class="form-radio ${className}"
                                    value="${option.value}"
                                    ${option.value == defaultValue ? 'checked' : ''}
                                    ${required ? 'required' : ''}
                                    ${disabled ? 'disabled' : ''}
                                    ${attrString}
                                    style="margin-left: var(--spacing-2); width: 18px; height: 18px; accent-color: var(--primary);"
                                >
                                <label for="${name}_${option.value}" style="font-weight: normal; margin-bottom: 0;">${option.label}</label>
                            </div>
                        `).join('')}
                    </div>
                `;
                break;
                
            case 'file':
                inputHtml = `
                    <input 
                        type="file" 
                        id="${name}" 
                        name="${name}" 
                        class="form-file ${className}"
                        ${field.accept ? `accept="${field.accept}"` : ''}
                        ${field.multiple ? 'multiple' : ''}
                        ${required ? 'required' : ''}
                        ${disabled ? 'disabled' : ''}
                        ${attrString}
                        style="width: 100%;"
                    >
                `;
                break;
                
            case 'hidden':
                inputHtml = `
                    <input 
                        type="hidden" 
                        id="${name}" 
                        name="${name}" 
                        value="${defaultValue}"
                        ${attrString}
                    >
                `;
                break;
        }
        
        // ایجاد راهنمای فیلد
        const helpHtml = help ? `
            <div class="form-help" style="font-size: var(--font-size-sm); color: var(--text-secondary); margin-top: var(--spacing-1);">
                ${help}
            </div>
        ` : '';
        
        // ایجاد پیام خطا
        const errorHtml = `<div class="form-error" id="${name}-error" style="display: none; font-size: var(--font-size-sm); color: var(--error); margin-top: var(--spacing-1);"></div>`;
        
        // ایجاد کل فیلد
        if (type === 'hidden') {
            return inputHtml;
        } else {
            return `
                <div class="${fieldWrapperClass}" style="margin-bottom: var(--spacing-4);">
                    ${label && type !== 'checkbox' ? `
                        <label for="${name}" class="${labelClass}" style="display: block; margin-bottom: var(--spacing-2); font-weight: 500;">
                            ${label} ${required ? '<span style="color: var(--error);">*</span>' : ''}
                        </label>
                    ` : ''}
                    
                    <div class="${inputWrapperClass}">
                        ${inputHtml}
                        ${helpHtml}
                        ${errorHtml}
                    </div>
                </div>
            `;
        }
    },
    
    /**
     * اعتبارسنجی یک فرم
     * 
     * @param {HTMLFormElement} formElement - المنت فرم
     * @param {Object} rules - قوانین اعتبارسنجی
     * @returns {boolean} - آیا فرم معتبر است یا خیر
     */
    validateForm(formElement, rules = {}) {
        if (!formElement) return false;
        
        let isValid = true;
        
        // پاک کردن خطاهای قبلی
        const errorElements = formElement.querySelectorAll('.form-error');
        errorElements.forEach(el => {
            el.style.display = 'none';
            el.textContent = '';
        });
        
        // بررسی هر فیلد
        for (const fieldName in rules) {
            const fieldRules = rules[fieldName];
            const fieldElement = formElement.elements[fieldName];
            
            if (!fieldElement) continue;
            
            const errorElement = document.getElementById(`${fieldName}-error`);
            let fieldValue = fieldElement.value.trim();
            
            // بررسی قوانین مختلف
            for (const rule in fieldRules) {
                let ruleValue = fieldRules[rule];
                let errorMessage = '';
                
                switch (rule) {
                    case 'required':
                        if (ruleValue && !fieldValue) {
                            errorMessage = 'این فیلد الزامی است';
                        }
                        break;
                        
                    case 'minLength':
                        if (fieldValue.length < ruleValue) {
                            errorMessage = `حداقل ${ruleValue} کاراکتر وارد کنید`;
                        }
                        break;
                        
                    case 'maxLength':
                        if (fieldValue.length > ruleValue) {
                            errorMessage = `حداکثر ${ruleValue} کاراکتر مجاز است`;
                        }
                        break;
                        
                    case 'pattern':
                        const regex = new RegExp(ruleValue);
                        if (fieldValue && !regex.test(fieldValue)) {
                            errorMessage = 'فرمت وارد شده صحیح نیست';
                        }
                        break;
                        
                    case 'email':
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (ruleValue && fieldValue && !emailRegex.test(fieldValue)) {
                            errorMessage = 'ایمیل وارد شده معتبر نیست';
                        }
                        break;
                        
                    case 'number':
                        if (ruleValue && fieldValue && isNaN(Number(fieldValue))) {
                            errorMessage = 'لطفاً یک عدد معتبر وارد کنید';
                        }
                        break;
                        
                    case 'min':
                        if (fieldValue && Number(fieldValue) < ruleValue) {
                            errorMessage = `حداقل مقدار مجاز ${ruleValue} است`;
                        }
                        break;
                        
                    case 'max':
                        if (fieldValue && Number(fieldValue) > ruleValue) {
                            errorMessage = `حداکثر مقدار مجاز ${ruleValue} است`;
                        }
                        break;
                        
                    case 'match':
                        const matchField = formElement.elements[ruleValue];
                        if (matchField && fieldValue !== matchField.value) {
                            errorMessage = 'مقادیر وارد شده یکسان نیستند';
                        }
                        break;
                        
                    case 'custom':
                        if (typeof ruleValue === 'function') {
                            const customError = ruleValue(fieldValue, formElement);
                            if (customError) {
                                errorMessage = customError;
                            }
                        }
                        break;
                }
                
                // نمایش خطا
                if (errorMessage && errorElement) {
                    errorElement.textContent = errorMessage;
                    errorElement.style.display = 'block';
                    fieldElement.classList.add('is-invalid');
                    isValid = false;
                    break; // فقط اولین خطا نمایش داده می‌شود
                }
            }
        }
        
        return isValid;
    },
    
    /**
     * جمع‌آوری داده‌های فرم
     * 
     * @param {HTMLFormElement} formElement - المنت فرم
     * @returns {Object} - داده‌های فرم
     */
    getFormData(formElement) {
        if (!formElement) return {};
        
        const formData = {};
        const elements = formElement.elements;
        
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const name = element.name;
            
            if (!name || element.tagName === 'BUTTON') continue;
            
            switch (element.type) {
                case 'checkbox':
                    formData[name] = element.checked ? (element.value !== 'on' ? element.value : true) : false;
                    break;
                    
                case 'radio':
                    if (element.checked) {
                        formData[name] = element.value;
                    }
                    break;
                    
                case 'select-multiple':
                    const selectedOptions = Array.from(element.selectedOptions).map(option => option.value);
                    formData[name] = selectedOptions;
                    break;
                    
                case 'file':
                    if (element.files.length > 0) {
                        formData[name] = element.multiple ? element.files : element.files[0];
                    }
                    break;
                    
                default:
                    if (name in formData) {
                        if (!Array.isArray(formData[name])) {
                            formData[name] = [formData[name]];
                        }
                        formData[name].push(element.value);
                    } else {
                        formData[name] = element.value;
                    }
            }
        }
        
        return formData;
    },
    
    /**
     * پر کردن فرم با داده‌ها
     * 
     * @param {HTMLFormElement} formElement - المنت فرم
     * @param {Object} data - داده‌ها
     */
    fillForm(formElement, data = {}) {
        if (!formElement || !data) return;
        
        const elements = formElement.elements;
        
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const name = element.name;
            
            if (!name || !(name in data)) continue;
            
            const value = data[name];
            
            switch (element.type) {
                case 'checkbox':
                    element.checked = Boolean(value);
                    break;
                    
                case 'radio':
                    element.checked = (element.value == value);
                    break;
                    
                case 'select-one':
                case 'select-multiple':
                    if (Array.isArray(value)) {
                        Array.from(element.options).forEach(option => {
                            option.selected = value.includes(option.value);
                        });
                    } else {
                        element.value = value;
                    }
                    break;
                    
                default:
                    element.value = value;
            }
        }
    },
    
    /**
     * راه‌اندازی یک فرم
     * 
     * @param {string} formId - شناسه فرم
     * @param {Object} options - تنظیمات
     */
    setupForm(formId, options = {}) {
        const {
            onSubmit,
            onCancel,
            validation = {},
            beforeSubmit,
            afterSubmit
        } = options;
        
        const formElement = document.getElementById(formId);
        if (!formElement) return;
        
        // رویداد ارسال فرم
        formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // اعتبارسنجی فرم
            const isValid = this.validateForm(formElement, validation);
            if (!isValid) return;
            
            // اجرای callback قبل از ارسال
            if (beforeSubmit && typeof beforeSubmit === 'function') {
                const shouldContinue = beforeSubmit(formElement);
                if (shouldContinue === false) return;
            }
            
            // جمع‌آوری داده‌ها
            const formData = this.getFormData(formElement);
            
            // اجرای callback ارسال
            if (onSubmit && typeof onSubmit === 'function') {
                onSubmit(formData, formElement);
            }
            
            // اجرای callback بعد از ارسال
            if (afterSubmit && typeof afterSubmit === 'function') {
                afterSubmit(formData, formElement);
            }
        });
        
        // رویداد دکمه انصراف
        const cancelButton = document.getElementById(`${formId}-cancel`);
        if (cancelButton && onCancel && typeof onCancel === 'function') {
            cancelButton.addEventListener('click', () => {
                onCancel(formElement);
            });
        }
        
        return formElement;
    }
};
