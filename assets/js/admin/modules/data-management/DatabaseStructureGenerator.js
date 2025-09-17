/**
 * Database Structure Generator
 * تولیدکننده ساختار دیتابیس
 * 
 * @description: مسئول تولید ساختار دیتابیس، کد SQL و HTML از روی داده‌های تحلیل شده
 * @version: 1.0.0
 * @author: DataSave Team
 */

'use strict';

class DatabaseStructureGenerator {
    constructor(config = {}) {
        this.config = {
            fixedDbName: 'ai_excell2form', // نام ثابت دیتابیس
            defaultTablePrefix: 'xls2tbl_',
            ...config
        };
        
        this.fieldStructure = [];
        this.analysisResult = null;
        
        // Event callbacks
        this.onStructureGenerated = null;
        this.onSQLGenerated = null;
        this.onHTMLGenerated = null;
        this.onError = null;
    }
    
    /**
     * تنظیم callback ها
     */
    setCallbacks(callbacks = {}) {
        this.onStructureGenerated = callbacks.onStructureGenerated || null;
        this.onSQLGenerated = callbacks.onSQLGenerated || null;
        this.onHTMLGenerated = callbacks.onHTMLGenerated || null;
        this.onError = callbacks.onError || null;
    }
    
    /**
     * تنظیم نتایج تحلیل
     */
    setAnalysisResult(analysisResult) {
        this.analysisResult = analysisResult;
    }
    
    /**
     * تولید ساختار از روی نتایج تحلیل (بدون AI)
     */
    generateFromAnalysis(analysisResult, previewData, fileName = '') {
        try {
            console.log('🔄 Generating structure from analysis:', {
                analysisResult: !!analysisResult,
                previewData: previewData?.length || 0,
                fileName
            });
            
            // بررسی وجود داده‌های تحلیل
            if (!analysisResult) {
                throw new Error('داده‌های تحلیل موجود نیست');
            }
            
            // استخراج ستون‌ها از preview data یا columns
            let columns = [];
            if (analysisResult.columns) {
                columns = analysisResult.columns;
            } else if (analysisResult.preview && analysisResult.preview.length > 0) {
                // استفاده از ردیف اول به عنوان header
                columns = analysisResult.preview[0];
            } else if (previewData && previewData.length > 0) {
                // استفاده از ردیف اول previewData
                columns = previewData[0];
            } else {
                throw new Error('ستون‌های داده یافت نشد');
            }
            
            if (!Array.isArray(columns) || columns.length === 0) {
                throw new Error('ستون‌های معتبر یافت نشد');
            }
            
            // استخراج نام جدول از نام فایل
            const baseName = fileName ? fileName.replace(/\.(xlsx|xls|csv)$/i, '') : 'data';
            const cleanBaseName = this.sanitizeName(baseName);
            const tableName = this.config.defaultTablePrefix + cleanBaseName;
            
            // تولید فیلدها از ستون‌ها
            const fields = columns.map((column, index) => {
                const fieldName = column || `field_${index + 1}`;
                let sqlName = this.sanitizeName(fieldName);
                
                // اطمینان از اینکه sqlName معتبر است
                if (!sqlName || sqlName === 'field') {
                    sqlName = `field_${index + 1}`;
                }
                
                // تشخیص نوع داده بر اساس نمونه داده‌ها
                let dataType = this.detectDataType(previewData, index);
                
                return {
                    persianName: fieldName, // نام اصلی فارسی
                    name: fieldName,
                    englishName: sqlName, // نام انگلیسی برای نمایش
                    sqlName: sqlName, // نام انگلیسی SQL
                    type: dataType.type,
                    length: dataType.length,
                    nullable: true,
                    selected: true,
                    originalIndex: index
                };
            });
            
            const structure = {
                database: this.config.fixedDbName, // همیشه ai_excell2form
                table: tableName,
                tableName: tableName, // Add both for compatibility
                table_name: tableName, // Add both for compatibility
                fields: fields,
                totalColumns: analysisResult.totalColumns || fields.length,
                totalRows: analysisResult.totalRows || 0,
                hasHeader: analysisResult.hasHeader !== false,
                createdAt: new Date().toISOString(),
                source: 'analysis'
            };
            
            console.log('✅ Structure generated from analysis:', structure);
            
            if (this.onStructureGenerated) {
                this.onStructureGenerated(structure);
            }
            
            return structure;
            
        } catch (error) {
            console.error('❌ Error generating structure from analysis:', error);
            this.triggerError('خطا در تولید ساختار: ' + error.message);
            throw error;
        }
    }
    
    /**
     * تولید ساختار با کمک AI
     */
    async generateWithAI(analysisResult, previewData, fileName = '') {
        try {
            console.log('🤖 Generating structure with AI...');
            
            // ابتدا ساختار پایه تولید کنیم
            const baseStructure = this.generateFromAnalysis(analysisResult, previewData, fileName);
            
            // سپس با AI بهبود دهیم (فعلاً همین ساختار پایه را برمی‌گردانیم)
            // در آینده می‌توان AI واقعی اضافه کرد
            
            return baseStructure;
            
        } catch (error) {
            console.error('❌ Error generating structure with AI:', error);
            // در صورت خطا، ساختار پایه را برمی‌گردانیم
            return this.generateFromAnalysis(analysisResult, previewData, fileName);
        }
    }
    
    /**
     * تشخیص نوع داده بر اساس محتوای ستون
     */
    detectDataType(previewData, columnIndex) {
        if (!previewData || previewData.length < 2) {
            return { type: 'VARCHAR', length: 255 };
        }
        
        // بررسی چند سطر برای تشخیص نوع داده
        const samples = [];
        for (let i = 1; i < Math.min(6, previewData.length); i++) {
            if (previewData[i] && previewData[i][columnIndex] !== undefined) {
                samples.push(previewData[i][columnIndex]);
            }
        }
        
        if (samples.length === 0) {
            return { type: 'VARCHAR', length: 255 };
        }
        
        // بررسی اینکه آیا همه نمونه‌ها عدد هستند
        const isNumeric = samples.every(sample => {
            const num = parseFloat(sample);
            return !isNaN(num) && isFinite(num);
        });
        
        if (isNumeric) {
            // بررسی اینکه آیا عدد اعشاری است
            const hasDecimal = samples.some(sample => sample.toString().includes('.'));
            if (hasDecimal) {
                return { type: 'DECIMAL', length: '10,2' };
            } else {
                return { type: 'INT', length: null };
            }
        }
        
        // بررسی طول رشته‌ها
        const maxLength = Math.max(...samples.map(s => s.toString().length));
        if (maxLength > 255) {
            return { type: 'TEXT', length: null };
        } else {
            return { type: 'VARCHAR', length: Math.max(255, maxLength * 2) };
        }
    }
    
    /**
     * پاکسازی نام برای استفاده در SQL
     */
    sanitizeName(name) {
        if (!name) return '';
        
        // Dictionary کامل برای تبدیل فارسی به انگلیسی
        const persianToEnglish = {
            // کلمات پایه
            'شناسه': 'id',
            'نام': 'name',
            'تاریخ': 'date',
            'زمان': 'time',
            'مبلغ': 'amount',
            'قیمت': 'price',
            'تعداد': 'count',
            'توضیحات': 'description',
            'آدرس': 'address',
            'تلفن': 'phone',
            'ایمیل': 'email',
            
            // کلمات مالی و فروش
            'سال': 'year',
            'ماه': 'month',
            'روز': 'day',
            'انتخاب': 'select',
            'بخش': 'section',
            'کاری': 'work',
            'فروشنده': 'seller',
            'فروش': 'sales',
            'جمع': 'total',
            'سود': 'profit',
            'محاسبه': 'calculate',
            'درصد': 'percentage',
            'عنوان': 'title',
            'گزارش': 'report',
            'موجودی': 'inventory',
            'کالا': 'goods',
            'پایان': 'end',
            'خرید': 'purchase',
            
            // کلمات عمومی
            'مشتری': 'customer',
            'محصول': 'product',
            'سفارش': 'order',
            'وضعیت': 'status',
            'کد': 'code',
            'رنگ': 'color',
            'سایز': 'size',
            'وزن': 'weight',
            'ارتفاع': 'height',
            'عرض': 'width',
            'طول': 'length'
        };
        
        // ابتدا سعی کن کل عبارت رو پیدا کنی
        if (persianToEnglish[name.trim()]) {
            return persianToEnglish[name.trim()];
        }
        
        // اگر پیدا نشد، کلمه به کلمه تبدیل کن
        let englishName = name;
        
        // جایگزینی کلمات فارسی
        Object.keys(persianToEnglish).forEach(persian => {
            const englishWord = persianToEnglish[persian];
            // برای کلمات کامل
            englishName = englishName.replace(new RegExp(`\\b${persian}\\b`, 'g'), englishWord);
            // برای کلمات در وسط جمله
            englishName = englishName.replace(new RegExp(persian, 'g'), englishWord);
        });
        
        // اگر هنوز فارسی باقی مانده، به transliteration بزن
        englishName = this.transliteratePersian(englishName);
        
        // حذف کاراکترهای غیرمجاز و تبدیل به snake_case
        const cleaned = englishName
            .replace(/[^\w\s]/g, '') // حذف نقطه‌گذاری
            .replace(/\s+/g, '_')    // فاصله‌ها به underscore
            .toLowerCase()           // کوچک کردن
            .replace(/_{2,}/g, '_')  // حذف underscore های اضافی
            .replace(/^_|_$/g, '');  // حذف underscore از ابتدا و انتها
        
        // اگر نتیجه خالی بود، 'field' برگردان
        return cleaned || 'field';
    }
    
    /**
     * تبدیل حروف فارسی به انگلیسی (Transliteration)
     */
    transliteratePersian(text) {
        const persianMap = {
            'آ': 'a', 'ا': 'a', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ث': 's', 'ج': 'j', 'چ': 'ch',
            'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z', 'ژ': 'zh', 'س': 's',
            'ش': 'sh', 'ص': 's', 'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f',
            'ق': 'q', 'ک': 'k', 'گ': 'g', 'ل': 'l', 'م': 'm', 'ن': 'n', 'و': 'v', 'ه': 'h',
            'ی': 'y', 'ئ': 'y', 'ء': '', 'ة': 'h',
            // اعداد فارسی
            '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4', '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9'
        };
        
        let result = text;
        Object.keys(persianMap).forEach(persian => {
            result = result.replace(new RegExp(persian, 'g'), persianMap[persian]);
        });
        
        return result;
    }
    
    /**
     * تولید کد SQL
     */
    generateSQL(structure) {
        try {
            console.log('🔧 Generating SQL for structure:', structure);
            
            if (!structure || !structure.fields) {
                throw new Error('ساختار معتبر نیست');
            }
            
            const selectedFields = structure.fields.filter(field => field.selected !== false);
            
            if (selectedFields.length === 0) {
                throw new Error('هیچ فیلدی انتخاب نشده است');
            }
            
            // بررسی و حل مشکل نام‌های تکراری
            const usedNames = new Set(['id', 'created_at', 'updated_at']);
            selectedFields.forEach((field, index) => {
                let baseName = field.sqlName;
                
                // اگر sqlName خالی یا نامعتبر است
                if (!baseName || baseName.trim() === '' || baseName === 'field') {
                    console.warn(`⚠️ Invalid sqlName for field "${field.persianName}", regenerating...`);
                    baseName = this.sanitizeName(field.persianName || field.name || `field_${index + 1}`);
                    
                    // اگر هنوز مشکل دارد
                    if (!baseName || baseName === 'field') {
                        baseName = `field_${index + 1}`;
                    }
                }
                
                let finalName = baseName;
                let counter = 1;
                
                // اگر نام تکراری است، شماره اضافه کن
                while (usedNames.has(finalName)) {
                    finalName = `${baseName}_${counter}`;
                    counter++;
                }
                
                field.sqlName = finalName;
                usedNames.add(finalName);
            });
            
            // استفاده از نام جدول درست
            const actualTableName = structure.tableName || structure.table;
            
            let sql = `-- Table: ${actualTableName}\n`;
            sql += `-- Generated: ${new Date().toLocaleString('fa-IR')}\n`;
            sql += `-- Original Fields Mapping:\n`;
            
            // اضافه کردن mapping فیلدها
            selectedFields.forEach(field => {
                sql += `-- ${field.persianName || field.name} → ${field.sqlName}\n`;
            });
            
            sql += `\nUSE \`${structure.database}\`;\n\n`;
            
            sql += `CREATE TABLE IF NOT EXISTS \`${actualTableName}\` (\n`;
            sql += `  id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'شناسه یکتا',\n`;
            
            const fieldDefinitions = selectedFields.map(field => {
                let definition = `  \`${field.sqlName}\``;
                
                if (field.type === 'VARCHAR' && field.length) {
                    definition += ` VARCHAR(${field.length})`;
                } else if (field.type === 'DECIMAL' && field.length) {
                    definition += ` DECIMAL(${field.length})`;
                } else if (field.type === 'TEXT') {
                    definition += ` TEXT`;
                } else if (field.type === 'INT') {
                    definition += ` INT`;
                } else {
                    definition += ` VARCHAR(255)`;
                }
                
                if (!field.nullable) {
                    definition += ' NOT NULL';
                }
                
                definition += ` COMMENT '${field.persianName || field.name}'`;
                
                return definition;
            });
            
            sql += fieldDefinitions.join(',\n');
            sql += ',\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT \'زمان ایجاد\',';
            sql += '\n  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT \'زمان به‌روزرسانی\'';
            sql += '\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;';
            
            console.log('✅ SQL code generated');
            
            if (this.onSQLGenerated) {
                this.onSQLGenerated(sql);
            }
            
            return sql;
            
        } catch (error) {
            console.error('❌ Error generating SQL:', error);
            this.triggerError('خطا در تولید کد SQL: ' + error.message);
            return '';
        }
    }
    
    /**
     * تولید کد HTML
     */
    generateHTML(structure) {
        try {
            if (!structure || !structure.fields) {
                throw new Error('ساختار معتبر نیست');
            }
            
            const selectedFields = structure.fields.filter(field => field.selected !== false);
            
            if (selectedFields.length === 0) {
                throw new Error('هیچ فیلدی انتخاب نشده است');
            }
            
            let html = `<!-- Form for ${structure.table} -->\n`;
            html += `<form class="data-form" id="${structure.table}-form">\n`;
            html += `  <h2>فرم ${structure.table}</h2>\n\n`;
            
            selectedFields.forEach(field => {
                html += `  <div class="form-group">\n`;
                html += `    <label for="${field.sqlName}">${field.name}:</label>\n`;
                
                if (field.type === 'TEXT') {
                    html += `    <textarea id="${field.sqlName}" name="${field.sqlName}" `;
                    if (!field.nullable) html += 'required ';
                    html += `placeholder="${field.name} را وارد کنید"></textarea>\n`;
                } else {
                    html += `    <input type="`;
                    
                    if (field.type === 'INT' || field.type === 'DECIMAL') {
                        html += 'number';
                    } else if (field.sqlName.includes('email')) {
                        html += 'email';
                    } else if (field.sqlName.includes('phone') || field.sqlName.includes('tel')) {
                        html += 'tel';
                    } else if (field.sqlName.includes('date')) {
                        html += 'date';
                    } else {
                        html += 'text';
                    }
                    
                    html += `" id="${field.sqlName}" name="${field.sqlName}" `;
                    if (!field.nullable) html += 'required ';
                    html += `placeholder="${field.name} را وارد کنید">\n`;
                }
                
                html += `  </div>\n\n`;
            });
            
            html += `  <div class="form-actions">\n`;
            html += `    <button type="submit">ذخیره</button>\n`;
            html += `    <button type="reset">پاک کردن</button>\n`;
            html += `  </div>\n`;
            html += `</form>`;
            
            console.log('✅ HTML code generated');
            
            if (this.onHTMLGenerated) {
                this.onHTMLGenerated(html);
            }
            
            return html;
            
        } catch (error) {
            console.error('❌ Error generating HTML:', error);
            this.triggerError('خطا در تولید کد HTML: ' + error.message);
            return '';
        }
    }
    
    /**
     * تولید خطا
     */
    triggerError(message) {
        console.error('🚨 DatabaseStructureGenerator Error:', message);
        if (this.onError) {
            this.onError(message);
        }
    }
}

// Export as ES6 module
export default DatabaseStructureGenerator;