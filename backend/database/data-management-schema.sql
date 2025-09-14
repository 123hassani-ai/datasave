-- ===================================
-- Schema مدیریت داده‌ها - Data Management Schema
-- Excel to MySQL Conversion System
-- ===================================

USE `ai_excell2form`;

-- ===================================
-- جدول پروژه‌های داده (Data Projects)
-- ===================================
CREATE TABLE IF NOT EXISTS `ai_data_projects` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL COMMENT 'نام پروژه',
    `description` TEXT COMMENT 'توضیحات پروژه',
    `original_filename` VARCHAR(255) NOT NULL COMMENT 'نام فایل اصلی',
    `file_path` VARCHAR(500) COMMENT 'مسیر ذخیره فایل',
    `file_size` BIGINT UNSIGNED DEFAULT 0 COMMENT 'حجم فایل (بایت)',
    `database_name` VARCHAR(64) COMMENT 'نام پایگاه داده ایجاد شده',
    `table_name` VARCHAR(64) COMMENT 'نام جدول ایجاد شده',
    `schema_data` JSON COMMENT 'داده‌های ساختار جدول',
    `status` ENUM('pending', 'analyzing', 'schema_ready', 'creating_db', 'importing_data', 'completed', 'failed') DEFAULT 'pending',
    `total_rows` INT UNSIGNED DEFAULT 0 COMMENT 'تعداد کل ردیف‌ها',
    `processed_rows` INT UNSIGNED DEFAULT 0 COMMENT 'تعداد ردیف‌های پردازش شده',
    `failed_rows` INT UNSIGNED DEFAULT 0 COMMENT 'تعداد ردیف‌های ناموفق',
    `processing_time` DECIMAL(8,3) DEFAULT 0.000 COMMENT 'زمان پردازش (ثانیه)',
    `ai_model_used` VARCHAR(50) DEFAULT 'gpt-4' COMMENT 'مدل هوش مصنوعی استفاده شده',
    `created_by` INT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `completed_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'زمان تکمیل پروژه',
    
    PRIMARY KEY (`id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_created_by` (`created_by`),
    INDEX `idx_created_at` (`created_at`),
    INDEX `idx_database_table` (`database_name`, `table_name`),
    FOREIGN KEY (`created_by`) REFERENCES `ai_users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول پروژه‌های تبدیل داده';

-- ===================================
-- جدول مراحل پردازش (Processing Steps)
-- ===================================
CREATE TABLE IF NOT EXISTS `ai_processing_steps` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `project_id` INT UNSIGNED NOT NULL,
    `step_number` TINYINT UNSIGNED NOT NULL COMMENT 'شماره مرحله (1-6)',
    `step_name` VARCHAR(100) NOT NULL COMMENT 'نام مرحله',
    `step_description` TEXT COMMENT 'توضیحات مرحله',
    `status` ENUM('pending', 'processing', 'completed', 'failed', 'skipped') DEFAULT 'pending',
    `ai_prompt` TEXT COMMENT 'پرامپت ارسال شده به AI',
    `ai_response` JSON COMMENT 'پاسخ هوش مصنوعی',
    `user_input` JSON COMMENT 'ورودی کاربر',
    `user_feedback` JSON COMMENT 'بازخورد کاربر',
    `execution_time` DECIMAL(8,3) DEFAULT 0.000 COMMENT 'زمان اجرا (ثانیه)',
    `error_message` TEXT COMMENT 'پیام خطا در صورت وجود',
    `started_at` TIMESTAMP NULL DEFAULT NULL,
    `completed_at` TIMESTAMP NULL DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_project_step` (`project_id`, `step_number`),
    INDEX `idx_project_step` (`project_id`, `step_number`),
    INDEX `idx_status` (`status`),
    FOREIGN KEY (`project_id`) REFERENCES `ai_data_projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول مراحل پردازش پروژه';

-- ===================================
-- جدول چت و تعاملات (Chat Conversations)
-- ===================================
CREATE TABLE IF NOT EXISTS `ai_chat_conversations` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `project_id` INT UNSIGNED NOT NULL,
    `step_id` INT UNSIGNED NULL DEFAULT NULL COMMENT 'ارجاع به مرحله',
    `message_type` ENUM('user', 'ai', 'system') NOT NULL,
    `message_content` TEXT NOT NULL COMMENT 'محتوای پیام',
    `message_data` JSON COMMENT 'داده‌های اضافی پیام (مثل گزینه‌ها)',
    `user_selection` VARCHAR(255) COMMENT 'انتخاب کاربر در صورت وجود',
    `ai_tokens_used` INT UNSIGNED DEFAULT 0 COMMENT 'تعداد توکن‌های استفاده شده',
    `message_order` INT UNSIGNED NOT NULL COMMENT 'ترتیب پیام در چت',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    INDEX `idx_project_conversation` (`project_id`, `created_at`),
    INDEX `idx_project_order` (`project_id`, `message_order`),
    INDEX `idx_step_messages` (`step_id`),
    FOREIGN KEY (`project_id`) REFERENCES `ai_data_projects`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`step_id`) REFERENCES `ai_processing_steps`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول چت و تعاملات با AI';

-- ===================================
-- جدول لاگ عملیات (Operation Logs)
-- ===================================
CREATE TABLE IF NOT EXISTS `ai_operation_logs` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `project_id` INT UNSIGNED NOT NULL,
    `operation_type` VARCHAR(50) NOT NULL COMMENT 'نوع عملیات',
    `operation_detail` TEXT COMMENT 'جزئیات عملیات',
    `sql_query` TEXT COMMENT 'کوئری اجرا شده',
    `query_params` JSON COMMENT 'پارامترهای کوئری',
    `execution_time` DECIMAL(8,3) COMMENT 'زمان اجرا (میلی‌ثانیه)',
    `memory_usage` INT UNSIGNED COMMENT 'مصرف حافظه (بایت)',
    `rows_affected` INT UNSIGNED DEFAULT 0 COMMENT 'تعداد ردیف‌های تأثیر یافته',
    `status` ENUM('success', 'error', 'warning') NOT NULL,
    `error_code` VARCHAR(10) COMMENT 'کد خطا',
    `error_message` TEXT COMMENT 'پیام خطا در صورت وجود',
    `user_agent` VARCHAR(255) COMMENT 'اطلاعات مرورگر کاربر',
    `ip_address` VARCHAR(45) COMMENT 'آدرس IP کاربر',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    INDEX `idx_project_operation` (`project_id`, `operation_type`),
    INDEX `idx_status_date` (`status`, `created_at`),
    INDEX `idx_operation_type` (`operation_type`),
    INDEX `idx_execution_time` (`execution_time`),
    FOREIGN KEY (`project_id`) REFERENCES `ai_data_projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول لاگ عملیات سیستم';

-- ===================================
-- جدول تنظیمات AI (AI Settings)
-- ===================================
CREATE TABLE IF NOT EXISTS `ai_settings` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `setting_key` VARCHAR(100) NOT NULL COMMENT 'کلید تنظیم',
    `setting_value` JSON NOT NULL COMMENT 'مقدار تنظیم',
    `setting_type` ENUM('openai', 'model', 'prompt', 'system') NOT NULL,
    `description` TEXT COMMENT 'توضیحات تنظیم',
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_by` INT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_setting_key` (`setting_key`),
    INDEX `idx_setting_type` (`setting_type`),
    INDEX `idx_is_active` (`is_active`),
    FOREIGN KEY (`created_by`) REFERENCES `ai_users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول تنظیمات هوش مصنوعی';

-- ===================================
-- جدول آمار و گزارشات (Statistics)
-- ===================================
CREATE TABLE IF NOT EXISTS `ai_statistics` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `stat_date` DATE NOT NULL COMMENT 'تاریخ آمار',
    `total_projects` INT UNSIGNED DEFAULT 0,
    `completed_projects` INT UNSIGNED DEFAULT 0,
    `failed_projects` INT UNSIGNED DEFAULT 0,
    `total_records_processed` INT UNSIGNED DEFAULT 0,
    `avg_processing_time` DECIMAL(8,3) DEFAULT 0.000,
    `total_ai_tokens_used` INT UNSIGNED DEFAULT 0,
    `total_file_size_processed` BIGINT UNSIGNED DEFAULT 0,
    `unique_users` INT UNSIGNED DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_stat_date` (`stat_date`),
    INDEX `idx_stat_date` (`stat_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول آمار روزانه سیستم';

-- ===================================
-- ایجاد مراحل پیش‌فرض پردازش
-- ===================================
-- این مراحل برای هر پروژه جدید ایجاد می‌شوند

-- مرحله 1: آپلود و بررسی فایل
-- مرحله 2: تحلیل ساختار توسط AI
-- مرحله 3: طراحی Schema پایگاه داده
-- مرحله 4: ایجاد پایگاه داده و جدول
-- مرحله 5: انتقال داده‌ها
-- مرحله 6: تکمیل پروژه و گزارش نهایی

-- ===================================
-- تنظیمات اولیه AI
-- ===================================
INSERT INTO `ai_settings` (`setting_key`, `setting_value`, `setting_type`, `description`, `created_by`) VALUES
('openai_api_key', '""', 'openai', 'کلید API OpenAI', 1),
('default_model', '"gpt-4o"', 'model', 'مدل پیش‌فرض هوش مصنوعی', 1),
('max_tokens', '2000', 'model', 'حداکثر توکن برای هر درخواست', 1),
('temperature', '0.3', 'model', 'دمای مدل برای دقت بیشتر', 1),
('excel_analysis_prompt', '"شما یک متخصص تحلیل داده هستید. فایل Excel ارائه شده را تحلیل کنید و ساختار مناسب MySQL برای آن پیشنهاد دهید."', 'prompt', 'پرامپت تحلیل فایل Excel', 1),
('schema_generation_prompt', '"بر اساس داده‌های تحلیل شده، یک CREATE TABLE statement کامل و بهینه برای MySQL تولید کنید."', 'prompt', 'پرامپت تولید Schema', 1),
('batch_size', '100', 'system', 'تعداد ردیف در هر batch برای import', 1),
('max_file_size', '52428800', 'system', 'حداکثر حجم فایل مجاز (50MB)', 1),
('allowed_extensions', '["xlsx", "xls"]', 'system', 'پسوندهای مجاز فایل', 1),
('processing_timeout', '300', 'system', 'حداکثر زمان پردازش (ثانیه)', 1)
ON DUPLICATE KEY UPDATE 
    `setting_value` = VALUES(`setting_value`),
    `updated_at` = CURRENT_TIMESTAMP;

-- ===================================
-- ایجاد نمونه آمار اولیه
-- ===================================
INSERT INTO `ai_statistics` (`stat_date`) VALUES (CURDATE())
ON DUPLICATE KEY UPDATE `updated_at` = CURRENT_TIMESTAMP;

-- ===================================
-- Views برای گزارش‌گیری
-- ===================================

-- نمای خلاصه پروژه‌ها
CREATE OR REPLACE VIEW `v_projects_summary` AS
SELECT 
    p.id,
    p.name,
    p.description,
    p.original_filename,
    p.status,
    p.total_rows,
    p.processed_rows,
    p.processing_time,
    CONCAT(u.first_name, ' ', u.last_name) as created_by_name,
    p.created_at,
    p.completed_at,
    CASE 
        WHEN p.total_rows > 0 THEN ROUND((p.processed_rows / p.total_rows) * 100, 2)
        ELSE 0 
    END as progress_percentage
FROM ai_data_projects p
LEFT JOIN ai_users u ON p.created_by = u.id
ORDER BY p.created_at DESC;

-- نمای آمار کلی
CREATE OR REPLACE VIEW `v_dashboard_stats` AS
SELECT 
    COUNT(*) as total_projects,
    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_projects,
    SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_projects,
    SUM(CASE WHEN status IN ('analyzing', 'schema_ready', 'creating_db', 'importing_data') THEN 1 ELSE 0 END) as processing_projects,
    SUM(total_rows) as total_records,
    AVG(processing_time) as avg_processing_time,
    SUM(file_size) as total_file_size
FROM ai_data_projects;

-- نمای چت کامل پروژه‌ها
CREATE OR REPLACE VIEW `v_project_chats` AS
SELECT 
    c.id,
    c.project_id,
    p.name as project_name,
    c.step_id,
    s.step_name,
    c.message_type,
    c.message_content,
    c.user_selection,
    c.message_order,
    c.created_at
FROM ai_chat_conversations c
LEFT JOIN ai_data_projects p ON c.project_id = p.id
LEFT JOIN ai_processing_steps s ON c.step_id = s.id
ORDER BY c.project_id, c.message_order;

-- ===================================
-- Stored Procedures برای عملیات متداول
-- ===================================

-- پروسیجر ایجاد پروژه جدید
DELIMITER $$

CREATE PROCEDURE `sp_create_new_project`(
    IN p_name VARCHAR(100),
    IN p_description TEXT,
    IN p_filename VARCHAR(255),
    IN p_file_size BIGINT,
    IN p_created_by INT,
    OUT p_project_id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- ایجاد پروژه
    INSERT INTO ai_data_projects (
        name, description, original_filename, file_size, created_by
    ) VALUES (
        p_name, p_description, p_filename, p_file_size, p_created_by
    );
    
    SET p_project_id = LAST_INSERT_ID();
    
    -- ایجاد مراحل پیش‌فرض
    INSERT INTO ai_processing_steps (project_id, step_number, step_name, step_description) VALUES
    (p_project_id, 1, 'آپلود و بررسی', 'بارگذاری فایل و بررسی اولیه'),
    (p_project_id, 2, 'تحلیل ساختار', 'تحلیل ساختار فایل توسط هوش مصنوعی'),
    (p_project_id, 3, 'طراحی جدول', 'طراحی Schema پایگاه داده'),
    (p_project_id, 4, 'ایجاد پایگاه داده', 'ایجاد جدول در MySQL'),
    (p_project_id, 5, 'انتقال داده‌ها', 'وارد کردن داده‌ها به جدول'),
    (p_project_id, 6, 'تکمیل پروژه', 'نهایی سازی و گزارش');
    
    -- پیام خوش‌آمدگویی اولیه
    INSERT INTO ai_chat_conversations (
        project_id, message_type, message_content, message_order
    ) VALUES (
        p_project_id, 'system', 'پروژه جدید ایجاد شد. آماده شروع پردازش هستیم!', 1
    );
    
    COMMIT;
END$$

DELIMITER ;

-- ===================================
-- Triggers برای به‌روزرسانی خودکار
-- ===================================

-- بروزرسانی آمار هنگام تغییر وضعیت پروژه
DELIMITER $$

CREATE TRIGGER `tr_update_project_stats` 
AFTER UPDATE ON `ai_data_projects`
FOR EACH ROW
BEGIN
    IF NEW.status != OLD.status THEN
        INSERT INTO ai_statistics (stat_date) VALUES (CURDATE())
        ON DUPLICATE KEY UPDATE 
            total_projects = (SELECT COUNT(*) FROM ai_data_projects WHERE DATE(created_at) = CURDATE()),
            completed_projects = (SELECT COUNT(*) FROM ai_data_projects WHERE status = 'completed' AND DATE(created_at) = CURDATE()),
            failed_projects = (SELECT COUNT(*) FROM ai_data_projects WHERE status = 'failed' AND DATE(created_at) = CURDATE()),
            total_records_processed = (SELECT SUM(processed_rows) FROM ai_data_projects WHERE DATE(created_at) = CURDATE()),
            avg_processing_time = (SELECT AVG(processing_time) FROM ai_data_projects WHERE status = 'completed' AND DATE(created_at) = CURDATE()),
            updated_at = CURRENT_TIMESTAMP;
    END IF;
END$$

DELIMITER ;

-- ===================================
-- Indexes برای بهینه‌سازی عملکرد
-- ===================================

-- Index مرکب برای جستجوی پروژه‌ها
CREATE INDEX `idx_projects_status_date` ON `ai_data_projects` (`status`, `created_at`);

-- Index برای جستجوی چت‌ها
CREATE INDEX `idx_chat_project_type` ON `ai_chat_conversations` (`project_id`, `message_type`);

-- Index برای آمار
CREATE INDEX `idx_logs_operation_date` ON `ai_operation_logs` (`operation_type`, `created_at`);

-- ===================================
-- نهایی سازی
-- ===================================

-- کامنت‌های نهایی
ALTER TABLE `ai_data_projects` COMMENT = 'جدول اصلی پروژه‌های تبدیل Excel به MySQL - نسخه 1.0';
ALTER TABLE `ai_processing_steps` COMMENT = 'مراحل پردازش هر پروژه - ۶ مرحله اصلی';
ALTER TABLE `ai_chat_conversations` COMMENT = 'تمام تعاملات چت کاربر با هوش مصنوعی';
ALTER TABLE `ai_operation_logs` COMMENT = 'لاگ کامل عملیات سیستم برای رفع اشکال';
ALTER TABLE `ai_settings` COMMENT = 'تنظیمات هوش مصنوعی و سیستم';
ALTER TABLE `ai_statistics` COMMENT = 'آمار روزانه برای داشبورد مدیریت';

-- بررسی نهایی
SELECT 'Data Management Schema created successfully!' as Status;
