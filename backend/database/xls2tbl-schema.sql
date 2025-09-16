-- Schema for Excel to Table tracking system
-- جدول مرجع برای ردیابی فایل‌های پردازش شده

USE ai_excell2form;

-- جدول ردیابی فایل‌های Excel پردازش شده
CREATE TABLE IF NOT EXISTS xls2tbl_00data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL UNIQUE COMMENT 'نام جدول ایجاد شده',
    file_name VARCHAR(255) NOT NULL COMMENT 'نام فایل اصلی',
    file_hash VARCHAR(64) NOT NULL COMMENT 'هش فایل برای تشخیص تغییرات',
    data_type ENUM('create_table', 'update_data') NOT NULL DEFAULT 'create_table' COMMENT 'نوع عملیات',
    columns_number INT NOT NULL COMMENT 'تعداد ستون‌ها',
    columns_data TEXT NOT NULL COMMENT 'نام تمامی ستون‌های فایل اصلی',
    unique_field VARCHAR(100) NULL COMMENT 'نام فیلد منحصر به فرد برای آپدیت',
    total_records INT DEFAULT 0 COMMENT 'تعداد کل رکوردها',
    processed_records INT DEFAULT 0 COMMENT 'تعداد رکوردهای پردازش شده',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_table_name (table_name),
    INDEX idx_file_hash (file_hash),
    INDEX idx_file_name (file_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول ردیابی فایل‌های Excel پردازش شده';

-- جدول نگاشت فیلدهای فارسی به انگلیسی
CREATE TABLE IF NOT EXISTS xls2tbl_00field_mapping (
    id INT AUTO_INCREMENT PRIMARY KEY,
    xls_data_id INT NOT NULL,
    field_order INT NOT NULL COMMENT 'ترتیب فیلد در جدول',
    persian_name VARCHAR(255) NOT NULL COMMENT 'نام اصلی فارسی فیلد',
    english_name VARCHAR(100) NOT NULL COMMENT 'نام انگلیسی تبدیل شده',
    field_type VARCHAR(50) NOT NULL COMMENT 'نوع داده فیلد',
    field_length INT NULL COMMENT 'طول فیلد',
    is_primary_key BOOLEAN DEFAULT FALSE COMMENT 'آیا کلید اصلی است',
    is_nullable BOOLEAN DEFAULT TRUE COMMENT 'آیا nullable است',
    default_value TEXT NULL COMMENT 'مقدار پیش فرض',
    field_comment TEXT NULL COMMENT 'توضیحات فیلد',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (xls_data_id) REFERENCES xls2tbl_00data(id) ON DELETE CASCADE,
    INDEX idx_xls_data_id (xls_data_id),
    INDEX idx_persian_name (persian_name),
    INDEX idx_english_name (english_name),
    INDEX idx_field_order (field_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='نگاشت فیلدهای فارسی به انگلیسی';

-- جدول لاگ عملیات پردازش
CREATE TABLE IF NOT EXISTS xls2tbl_00logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    xls_data_id INT NOT NULL,
    operation_type ENUM('create', 'insert', 'update', 'delete') NOT NULL,
    affected_records INT DEFAULT 0,
    success_count INT DEFAULT 0,
    error_count INT DEFAULT 0,
    error_details TEXT NULL,
    processing_time DECIMAL(8,3) NULL COMMENT 'زمان پردازش به ثانیه',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (xls_data_id) REFERENCES xls2tbl_00data(id) ON DELETE CASCADE,
    INDEX idx_xls_data_id (xls_data_id),
    INDEX idx_operation_type (operation_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='لاگ عملیات پردازش فایل‌ها';