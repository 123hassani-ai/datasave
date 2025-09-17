/**
 * AI Assistant Module
 * ماژول دستیار هوش مصنوعی
 * 
 * @description: ماژول تخصصی برای تعامل با هوش مصنوعی جهت تحلیل و پیشنهاد ساختار دیتابیس
 * @version: 1.0.0
 * @author: DataSave Team
 */

'use strict';

class AIAssistant {
    constructor() {
        this.apiEndpoint = '/datasave/backend/api/v1/ai-suggestions.php';
        this.maxRetries = 3;
        this.retryDelay = 1000; // 1 second
    }

    /**
     * تحلیل فیلدها و تولید پیشنهادات هوش مصنوعی
     */
    async analyzeFields(fields, fileName = '') {
        try {
            // موقتاً از fallback استفاده می‌کنیم تا برنامه قفل نکند
            return this.generateFallbackSuggestions(fields, fileName);

            // کد اصلی که بعداً فعال می‌شود:
            /*
            const prompt = this.generateOptimizedPrompt(fields, fileName);
            const response = await this.callAIAPI(prompt);
            
            if (response.success) {
                console.log('✅ AI analysis completed successfully');
                return this.parseAIResponse(response.data, fields);
            } else {
                throw new Error(response.message || 'خطا در تحلیل هوش مصنوعی');
            }
            */

        } catch (error) {
            console.error('❌ Error in AI analysis:', error);
            // Fallback to rule-based suggestions
            return this.generateFallbackSuggestions(fields, fileName);
        }
    }

    /**
     * تولید پرامپت بهینه برای هوش مصنوعی
     */
    generateOptimizedPrompt(fields, fileName) {
        const fieldsList = fields.map(field => field.name).join(' - ');
        
        const prompt = `شما یک متخصص طراحی پایگاه داده هستید. یک فرم اکسل با فیلدهای زیر دارم:

فیلدها: ${fieldsList}
نام فایل: ${fileName}

لطفاً موارد زیر را دقیقاً در قالب JSON ارائه دهید:

{
  "form_topic": "موضوع کلی این فرم (مثلاً مدیریت مشتریان، فروش، انبار و...)",
  "form_description": "توضیح کوتاه و مفید درباره کاربرد این فرم (حداکثر 50 کلمه)",
  "table_name": "نام مناسب جدول به انگلیسی (snake_case)",
  "fields": [
    {
      "original": "نام فیلد اصلی",
      "english": "نام انگلیسی مناسب (snake_case)",
      "type": "نوع داده SQL مناسب",
      "description": "توضیح مختصر فیلد"
    }
  ]
}

نکات مهم:
- نام جدول باید با xls2tbl_ شروع شود
- نام فیلدهای انگلیسی باید snake_case باشند
- انواع داده مناسب SQL انتخاب کنید
- پاسخ فقط JSON باشد بدون توضیح اضافی`;

        return prompt;
    }

    /**
     * فراخوانی API هوش مصنوعی
     */
    async callAIAPI(prompt, attempt = 1) {
        try {
            console.log(`🔄 Calling AI API (attempt ${attempt}/${this.maxRetries})`);

            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    max_tokens: 1000,
                    temperature: 0.3 // کم برای پاسخ‌های دقیق‌تر
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result;

        } catch (error) {
            console.warn(`⚠️ AI API attempt ${attempt} failed:`, error);
            
            if (attempt < this.maxRetries) {
                await this.delay(this.retryDelay * attempt);
                return this.callAIAPI(prompt, attempt + 1);
            } else {
                throw error;
            }
        }
    }

    /**
     * تجزیه پاسخ هوش مصنوعی
     */
    parseAIResponse(aiData, originalFields) {
        try {
            // اگر پاسخ string است، آن را parse کنیم
            const parsed = typeof aiData === 'string' ? JSON.parse(aiData) : aiData;
            
            // اعتبارسنجی ساختار پاسخ
            if (!parsed.form_topic || !parsed.table_name || !Array.isArray(parsed.fields)) {
                throw new Error('Invalid AI response structure');
            }

            // اطمینان از وجود پیشوند در نام جدول
            let tableName = parsed.table_name;
            if (!tableName.startsWith('xls2tbl_')) {
                tableName = `xls2tbl_${tableName}`;
            }

            return {
                success: true,
                data: {
                    formTopic: parsed.form_topic,
                    formDescription: parsed.form_description || 'فرم داده‌های وارد شده از فایل اکسل',
                    tableName: tableName,
                    tableDescription: parsed.form_description || 'جدول داده‌های وارد شده از فایل اکسل',
                    fields: this.mapFieldSuggestions(parsed.fields, originalFields)
                }
            };

        } catch (error) {
            console.error('❌ Error parsing AI response:', error);
            throw new Error('خطا در تجزیه پاسخ هوش مصنوعی');
        }
    }

    /**
     * تطبیق پیشنهادات فیلدها با فیلدهای اصلی
     */
    mapFieldSuggestions(aiFields, originalFields) {
        const mappedFields = [];

        originalFields.forEach((originalField, index) => {
            // پیدا کردن فیلد متناظر در پاسخ AI
            const aiField = aiFields.find(af => 
                af.original === originalField.name || 
                af.original.includes(originalField.name) ||
                originalField.name.includes(af.original)
            );

            if (aiField) {
                mappedFields.push({
                    ...originalField,
                    englishName: aiField.english,
                    suggestedType: aiField.type || originalField.type,
                    description: aiField.description || '',
                    aiSuggested: true
                });
            } else {
                // Fallback برای فیلدهایی که AI پیشنهادی ندارد
                mappedFields.push({
                    ...originalField,
                    englishName: this.generateEnglishName(originalField.name),
                    suggestedType: originalField.type,
                    description: '',
                    aiSuggested: false
                });
            }
        });

        return mappedFields;
    }

    /**
     * تولید پیشنهادات جایگزین در صورت عدم دسترسی به AI
     */
    generateFallbackSuggestions(fields, fileName) {
        const analysis = this.analyzeFieldsIntelligently(fields);
        const tableName = this.generateIntelligentTableName(fileName, analysis);
        
        return {
            success: true,
            data: {
                formTopic: analysis.topic,
                formDescription: this.generateIntelligentDescription(analysis, fileName, fields.length),
                tableName: tableName,
                tableDescription: this.generateIntelligentTableDescription(analysis, fields.length),
                fields: fields.map(field => ({
                    ...field,
                    englishName: this.generateEnglishName(field.name),
                    suggestedType: this.suggestDataType(field),
                    description: this.generateFieldDescription(field.name),
                    maxLength: this.suggestFieldLength(field), // اضافه شده
                    aiSuggested: false
                }))
            }
        };
    }

    /**
     * تشخیص موضوع فرم بر اساس نام فیلدها
     */
    detectFormTopic(fields) {
        const fieldNames = fields.map(f => f.name.toLowerCase()).join(' ');
        
        const topics = {
            'مدیریت مشتریان': ['مشتری', 'نام', 'تلفن', 'آدرس', 'ایمیل'],
            'مدیریت فروش': ['فروش', 'قیمت', 'مبلغ', 'سود', 'درصد'],
            'مدیریت انبار': ['موجودی', 'کالا', 'تعداد', 'خرید'],
            'مدیریت مالی': ['پرداخت', 'حساب', 'درآمد', 'هزینه'],
            'مدیریت پرسنل': ['کارمند', 'حقوق', 'شغل', 'واحد'],
            'گزارشات': ['گزارش', 'تاریخ', 'ماه', 'سال']
        };

        for (const [topic, keywords] of Object.entries(topics)) {
            if (keywords.some(keyword => fieldNames.includes(keyword))) {
                return topic;
            }
        }

        return 'مدیریت داده‌ها';
    }

    /**
     * تولید نام انگلیسی برای فیلد
     */
    generateEnglishName(persianName) {
        const translations = {
            'شناسه': 'id',
            'نام': 'name',
            'تاریخ': 'date',
            'زمان': 'time',
            'قیمت': 'price',
            'مبلغ': 'amount',
            'تعداد': 'count',
            'توضیحات': 'description',
            'توضیح': 'comment',
            'ماه': 'month',
            'سال': 'year',
            'روز': 'day',
            'کاربر': 'user',
            'مشتری': 'customer',
            'فروش': 'sales',
            'خرید': 'purchase',
            'سود': 'profit',
            'درصد': 'percentage',
            'وضعیت': 'status',
            'نوع': 'type',
            'گروه': 'group',
            'دسته': 'category',
            'کد': 'code',
            'شماره': 'number',
            'آدرس': 'address',
            'تلفن': 'phone',
            'موبایل': 'mobile',
            'ایمیل': 'email',
            'محل': 'location',
            'موقعیت': 'position',
            'انتخاب': 'select',
            'بخش': 'section',
            'واحد': 'unit',
            'اپراتور': 'operator',
            'ثبت': 'register',
            'ویرایش': 'edit',
            'اصلی': 'main',
            'اینترنتی': 'web',
            'مرورگر': 'browser',
            'مکانی': 'location',
            'آنلاین': 'online',
            'کاری': 'work',
            'فروشنده': 'seller',
            'جمع': 'total',
            'محاسبه': 'calculate',
            'عنوان': 'title',
            'موجودی': 'inventory',
            'کالا': 'goods',
            'پایان': 'end'
        };

        let result = persianName.toLowerCase();
        
        // جایگزینی کلمات فارسی با انگلیسی
        for (const [persian, english] of Object.entries(translations)) {
            result = result.replace(new RegExp(persian, 'g'), english);
        }

        // پاکسازی و تبدیل به snake_case
        result = result
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');

        return result || 'field';
    }

    /**
     * پیشنهاد نوع داده
     */
    suggestDataType(field) {
        const name = field.name.toLowerCase();
        
        if (name.includes('شناسه') || name.includes('id')) {
            return 'INT';
        } else if (name.includes('تاریخ') || name.includes('date')) {
            return 'DATE';
        } else if (name.includes('زمان') || name.includes('time')) {
            return 'DATETIME';
        } else if (name.includes('قیمت') || name.includes('مبلغ') || name.includes('سود')) {
            return 'DECIMAL';
        } else if (name.includes('تعداد') || name.includes('count')) {
            return 'INT';
        } else if (name.includes('توضیحات') || name.includes('comment')) {
            return 'TEXT';
        } else {
            return 'VARCHAR';
        }
    }

    /**
     * تولید توضیح فیلد
     */
    generateFieldDescription(fieldName) {
        const descriptions = {
            'شناسه': 'شناسه یکتا',
            'نام': 'نام کامل',
            'تاریخ': 'تاریخ ثبت',
            'قیمت': 'قیمت به ریال',
            'مبلغ': 'مبلغ کل',
            'تعداد': 'تعداد آیتم',
            'توضیحات': 'توضیحات تکمیلی'
        };

        for (const [key, desc] of Object.entries(descriptions)) {
            if (fieldName.includes(key)) {
                return desc;
            }
        }

        return `فیلد ${fieldName}`;
    }

    /**
     * تولید نام جدول
     */
    generateTableName(fileName, topic) {
        const baseName = fileName ? fileName.replace(/\.(xlsx|xls|csv)$/i, '') : 'data';
        const cleanName = this.generateEnglishName(baseName);
        return `xls2tbl_${cleanName}`;
    }

    /**
     * تحلیل هوشمند فیلدها
     */
    analyzeFieldsIntelligently(fields) {
        const fieldNames = fields.map(f => f.name.toLowerCase()).join(' ');
        
        const detailedTopics = {
            'customer_management': {
                name: 'مدیریت مشتریان',
                keywords: ['مشتری', 'نام', 'تلفن', 'آدرس', 'ایمیل', 'کد ملی'],
                tableSuffix: 'customers',
                description: 'مدیریت اطلاعات مشتریان و ارتباط با آنها'
            },
            'sales_management': {
                name: 'مدیریت فروش',
                keywords: ['فروش', 'قیمت', 'مبلغ', 'سود', 'درصد', 'فروشنده'],
                tableSuffix: 'sales',
                description: 'پیگیری و تحلیل عملکرد فروش'
            },
            'inventory_management': {
                name: 'مدیریت انبار',
                keywords: ['موجودی', 'کالا', 'تعداد', 'خرید', 'محصول'],
                tableSuffix: 'inventory',
                description: 'کنترل موجودی و مدیریت انبار'
            },
            'financial_management': {
                name: 'مدیریت مالی',
                keywords: ['پرداخت', 'حساب', 'درآمد', 'هزینه', 'سرمایه'],
                tableSuffix: 'finance',
                description: 'مدیریت امور مالی و حسابداری'
            },
            'staff_management': {
                name: 'مدیریت پرسنل',
                keywords: ['کارمند', 'حقوق', 'شغل', 'واحد', 'پرسنل'],
                tableSuffix: 'staff',
                description: 'مدیریت اطلاعات پرسنل و منابع انسانی'
            },
            'statistics_reports': {
                name: 'آمار و گزارشات',
                keywords: ['گزارش', 'تاریخ', 'ماه', 'سال', 'آمار'],
                tableSuffix: 'reports',
                description: 'تولید گزارشات و آمارهای مدیریتی'
            },
            'investment_management': {
                name: 'مدیریت سرمایه‌گذاری',
                keywords: ['سرمایه', 'سهام', 'بازگشت', 'ریسک', 'سود'],
                tableSuffix: 'investments',
                description: 'مدیریت و پیگیری سرمایه‌گذاری‌ها'
            }
        };

        for (const [key, topic] of Object.entries(detailedTopics)) {
            const matchCount = topic.keywords.filter(keyword => fieldNames.includes(keyword)).length;
            if (matchCount >= 2) { // حداقل 2 کلیده تطبیق داشته باشد
                return { key, ...topic, confidence: matchCount };
            }
        }

        return {
            key: 'general_data',
            name: 'مدیریت داده‌ها',
            tableSuffix: 'data',
            description: 'مدیریت و سازماندهی داده‌های سیستم',
            confidence: 0
        };
    }

    /**
     * تولید نام هوشمند جدول
     */
    generateIntelligentTableName(fileName, analysis) {
        const baseName = fileName ? fileName.replace(/\.(xlsx|xls|csv)$/i, '') : analysis.tableSuffix;
        const cleanName = this.generateEnglishName(baseName);
        
        // ترکیب خلاقانه‌تر نام
        if (analysis.confidence >= 2) {
            return `tbl_${analysis.tableSuffix}`;
        } else {
            return `tbl_${cleanName}`;
        }
    }

    /**
     * تولید توضیحات هوشمند فرم
     */
    generateIntelligentDescription(analysis, fileName, fieldCount) {
        const variations = [
            `سیستم ${analysis.name} - پردازش داده‌های ${fileName}`,
            `ماژول ${analysis.name} با ${fieldCount} فیلد اطلاعاتی`,
            `${analysis.description} - ${fileName}`,
            `پلتفرم ${analysis.name} جهت مدیریت اطلاعات`
        ];
        
        return variations[Math.floor(Math.random() * variations.length)];
    }

    /**
     * تولید توضیحات هوشمند جدول
     */
    generateIntelligentTableDescription(analysis, fieldCount) {
        const variations = [
            `${analysis.description} شامل ${fieldCount} فیلد تخصصی`,
            `جدول اطلاعات ${analysis.name} با ${fieldCount} ستون داده`,
            `ساختار داده‌ای ${analysis.name} برای ذخیره ${fieldCount} نوع اطلاعات`,
            `پایگاه داده ${analysis.name} با قابلیت مدیریت ${fieldCount} فیلد`
        ];
        
        return variations[Math.floor(Math.random() * variations.length)];
    }

    /**
     * پیشنهاد طول فیلد بر اساس نوع داده
     */
    suggestFieldLength(field) {
        const fieldName = field.name.toLowerCase();
        const fieldType = this.suggestDataType(field);
        
        // قوانین هوشمند برای طول فیلد
        if (fieldType === 'INT') {
            if (fieldName.includes('شناسه') || fieldName.includes('id')) return 11;
            if (fieldName.includes('سال')) return 4;
            if (fieldName.includes('ماه') || fieldName.includes('روز')) return 2;
            if (fieldName.includes('تعداد') || fieldName.includes('مقدار')) return 10;
            return 11;
        }
        
        if (fieldType === 'DECIMAL') {
            if (fieldName.includes('قیمت') || fieldName.includes('مبلغ') || fieldName.includes('درآمد')) return '15,2';
            if (fieldName.includes('درصد') || fieldName.includes('نرخ')) return '5,2';
            return '10,2';
        }
        
        if (fieldType === 'VARCHAR') {
            if (fieldName.includes('نام') && fieldName.includes('خانوادگی')) return 100;
            if (fieldName.includes('نام')) return 50;
            if (fieldName.includes('کد ملی') || fieldName.includes('شناسه ملی')) return 10;
            if (fieldName.includes('تلفن') || fieldName.includes('موبایل')) return 15;
            if (fieldName.includes('ایمیل')) return 100;
            if (fieldName.includes('آدرس') || fieldName.includes('نشانی')) return 255;
            if (fieldName.includes('توضیحات') || fieldName.includes('شرح')) return 500;
            if (fieldName.includes('عنوان') || fieldName.includes('موضوع')) return 150;
            if (fieldName.includes('انتخاب') || fieldName.includes('نوع')) return 50;
            return 100; // پیش‌فرض
        }
        
        if (fieldType === 'DATE') return null; // DATE نیاز به length ندارد
        
        return 100; // پیش‌فرض
    }

    /**
     * تاخیر برای retry
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * تولید پیشنهادات سریع بدون API
     */
    generateQuickSuggestions(fields, fileName) {
        return this.generateFallbackSuggestions(fields, fileName);
    }
}

// Export as ES6 module
export default AIAssistant;