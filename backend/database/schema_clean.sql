-- ===================================
-- DataSave Project Database Schema (Clean Version)
-- ===================================

USE `ai_excell2form`;

-- ===================================
-- جدول گروه‌های کاربری
-- ===================================
CREATE TABLE IF NOT EXISTS `ai_user_groups` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL COMMENT 'نام گروه کاربری',
    `name_fa` VARCHAR(100) NOT NULL COMMENT 'نام فارسی گروه',
    `description` TEXT DEFAULT NULL COMMENT 'توضیحات گروه',
    `permissions` JSON DEFAULT NULL COMMENT 'مجوزهای دسترسی',
    `is_active` BOOLEAN DEFAULT TRUE COMMENT 'وضعیت فعال/غیرفعال',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_groups_name` (`name`),
    INDEX `idx_user_groups_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول گروه‌های کاربری';

-- ===================================
-- جدول کاربران اصلی
-- ===================================
CREATE TABLE IF NOT EXISTS `ai_users` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    
    -- اطلاعات اساسی
    `username` VARCHAR(50) NOT NULL COMMENT 'نام کاربری',
    `email` VARCHAR(100) NOT NULL COMMENT 'ایمیل',
    `mobile` VARCHAR(15) DEFAULT NULL COMMENT 'شماره موبایل',
    `password` VARCHAR(255) NOT NULL COMMENT 'رمز عبور (هش شده)',
    
    -- اطلاعات شخصی
    `first_name` VARCHAR(50) DEFAULT NULL COMMENT 'نام',
    `last_name` VARCHAR(50) DEFAULT NULL COMMENT 'نام خانوادگی',
    `full_name` VARCHAR(100) GENERATED ALWAYS AS (CONCAT_WS(' ', first_name, last_name)) STORED COMMENT 'نام کامل',
    `national_id` VARCHAR(10) DEFAULT NULL COMMENT 'کد ملی',
    `birth_date` DATE DEFAULT NULL COMMENT 'تاریخ تولد',
    `gender` ENUM('male', 'female', 'other') DEFAULT NULL COMMENT 'جنسیت',
    
    -- اطلاعات تماس
    `phone` VARCHAR(15) DEFAULT NULL COMMENT 'تلفن ثابت',
    `address` TEXT DEFAULT NULL COMMENT 'آدرس',
    `city` VARCHAR(50) DEFAULT NULL COMMENT 'شهر',
    `state` VARCHAR(50) DEFAULT NULL COMMENT 'استان',
    `postal_code` VARCHAR(10) DEFAULT NULL COMMENT 'کد پستی',
    `country` VARCHAR(50) DEFAULT 'Iran' COMMENT 'کشور',
    
    -- اطلاعات حساب کاربری
    `user_group_id` INT UNSIGNED DEFAULT 2 COMMENT 'شناسه گروه کاربری',
    `is_active` BOOLEAN DEFAULT TRUE COMMENT 'وضعیت فعال/غیرفعال',
    `is_verified` BOOLEAN DEFAULT FALSE COMMENT 'تایید حساب کاربری',
    `is_email_verified` BOOLEAN DEFAULT FALSE COMMENT 'تایید ایمیل',
    `is_mobile_verified` BOOLEAN DEFAULT FALSE COMMENT 'تایید موبایل',
    
    -- اطلاعات نمایه
    `avatar_path` VARCHAR(255) DEFAULT NULL COMMENT 'مسیر تصویر آواتار',
    `bio` TEXT DEFAULT NULL COMMENT 'بیوگرافی',
    `website` VARCHAR(255) DEFAULT NULL COMMENT 'وب‌سایت شخصی',
    `timezone` VARCHAR(50) DEFAULT 'Asia/Tehran' COMMENT 'منطقه زمانی',
    `language` VARCHAR(5) DEFAULT 'fa' COMMENT 'زبان ترجیحی',
    
    -- اطلاعات امنیتی
    `last_login_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'آخرین ورود',
    `last_login_ip` VARCHAR(45) DEFAULT NULL COMMENT 'آی‌پی آخرین ورود',
    `login_attempts` INT DEFAULT 0 COMMENT 'تعداد تلاش‌های ورود ناموفق',
    `locked_until` TIMESTAMP NULL DEFAULT NULL COMMENT 'قفل حساب تا',
    `password_changed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'تاریخ تغییر رمز عبور',
    `two_factor_enabled` BOOLEAN DEFAULT FALSE COMMENT 'احراز هویت دو مرحله‌ای',
    `two_factor_secret` VARCHAR(32) DEFAULT NULL COMMENT 'کلید احراز هویت دو مرحله‌ای',
    
    -- اطلاعات سیستمی
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'تاریخ ایجاد',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'تاریخ بروزرسانی',
    `created_by` INT UNSIGNED DEFAULT NULL COMMENT 'ایجاد شده توسط',
    `updated_by` INT UNSIGNED DEFAULT NULL COMMENT 'بروزرسانی شده توسط',
    `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'تاریخ حذف (soft delete)',
    
    -- کلیدهای اصلی و فهرست‌ها
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_users_username` (`username`),
    UNIQUE KEY `uk_users_email` (`email`),
    UNIQUE KEY `uk_users_mobile` (`mobile`),
    UNIQUE KEY `uk_users_national_id` (`national_id`),
    
    -- فهرست‌های عملکردی
    INDEX `idx_users_active` (`is_active`),
    INDEX `idx_users_verified` (`is_verified`),
    INDEX `idx_users_group` (`user_group_id`),
    INDEX `idx_users_created` (`created_at`),
    INDEX `idx_users_login` (`last_login_at`),
    INDEX `idx_users_name` (`first_name`, `last_name`),
    INDEX `idx_users_soft_delete` (`deleted_at`),
    
    -- کلیدهای خارجی
    CONSTRAINT `fk_users_group` FOREIGN KEY (`user_group_id`) REFERENCES `ai_user_groups` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول کاربران سیستم';

-- ===================================
-- جدول جلسات کاربری (Sessions)
-- ===================================
CREATE TABLE IF NOT EXISTS `ai_user_sessions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INT UNSIGNED NOT NULL,
    `session_id` VARCHAR(128) NOT NULL COMMENT 'شناسه جلسه',
    `ip_address` VARCHAR(45) NOT NULL COMMENT 'آدرس IP',
    `user_agent` TEXT DEFAULT NULL COMMENT 'اطلاعات مرورگر',
    `device_info` JSON DEFAULT NULL COMMENT 'اطلاعات دستگاه',
    `location_info` JSON DEFAULT NULL COMMENT 'اطلاعات مکانی',
    `is_active` BOOLEAN DEFAULT TRUE COMMENT 'وضعیت فعال جلسه',
    `last_activity` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `expires_at` TIMESTAMP NOT NULL COMMENT 'انقضای جلسه',
    
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_sessions_session_id` (`session_id`),
    INDEX `idx_sessions_user` (`user_id`),
    INDEX `idx_sessions_active` (`is_active`),
    INDEX `idx_sessions_expires` (`expires_at`),
    
    CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `ai_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول جلسات کاربری';

-- ===================================
-- جدول لاگ‌های سیستم
-- ===================================
CREATE TABLE IF NOT EXISTS `ai_system_logs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INT UNSIGNED DEFAULT NULL,
    `action` VARCHAR(100) NOT NULL COMMENT 'نوع عملیات',
    `entity_type` VARCHAR(50) DEFAULT NULL COMMENT 'نوع موجودیت',
    `entity_id` INT UNSIGNED DEFAULT NULL COMMENT 'شناسه موجودیت',
    `details` JSON DEFAULT NULL COMMENT 'جزئیات عملیات',
    `ip_address` VARCHAR(45) DEFAULT NULL COMMENT 'آدرس IP',
    `user_agent` TEXT DEFAULT NULL COMMENT 'اطلاعات مرورگر',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    INDEX `idx_logs_user` (`user_id`),
    INDEX `idx_logs_action` (`action`),
    INDEX `idx_logs_entity` (`entity_type`, `entity_id`),
    INDEX `idx_logs_created` (`created_at`),
    
    CONSTRAINT `fk_logs_user` FOREIGN KEY (`user_id`) REFERENCES `ai_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول لاگ‌های سیستم';

-- ===================================
-- جدول تنظیمات کاربران
-- ===================================
CREATE TABLE IF NOT EXISTS `ai_user_settings` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INT UNSIGNED NOT NULL,
    `setting_key` VARCHAR(100) NOT NULL COMMENT 'کلید تنظیم',
    `setting_value` TEXT DEFAULT NULL COMMENT 'مقدار تنظیم',
    `setting_type` ENUM('string', 'integer', 'boolean', 'json', 'text') DEFAULT 'string' COMMENT 'نوع داده',
    `is_encrypted` BOOLEAN DEFAULT FALSE COMMENT 'رمزگذاری شده',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_settings_user_key` (`user_id`, `setting_key`),
    INDEX `idx_settings_key` (`setting_key`),
    
    CONSTRAINT `fk_settings_user` FOREIGN KEY (`user_id`) REFERENCES `ai_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول تنظیمات کاربران';

-- ===================================
-- درج داده‌های پیش‌فرض
-- ===================================

-- گروه‌های کاربری پیش‌فرض
INSERT INTO `ai_user_groups` (`id`, `name`, `name_fa`, `description`, `permissions`) VALUES
(1, 'administrator', 'مدیر سیستم', 'دسترسی کامل به تمام قسمت‌های سیستم', JSON_OBJECT('all', true)),
(2, 'user', 'کاربر عادی', 'دسترسی محدود برای کاربران عادی', JSON_OBJECT('read', true, 'upload', true)),
(3, 'moderator', 'نظارتی', 'دسترسی نظارتی بر محتوا و کاربران', JSON_OBJECT('read', true, 'moderate', true)),
(4, 'guest', 'مهمان', 'دسترسی فقط خواندنی', JSON_OBJECT('read', true))
ON DUPLICATE KEY UPDATE 
    `name_fa` = VALUES(`name_fa`),
    `description` = VALUES(`description`),
    `permissions` = VALUES(`permissions`);

-- کاربر مدیر پیش‌فرض (رمز عبور: admin123)
INSERT INTO `ai_users` (
    `username`, `email`, `password`, `first_name`, `last_name`, 
    `user_group_id`, `is_active`, `is_verified`, `is_email_verified`,
    `created_by`
) VALUES (
    'admin', 
    'admin@datasave.local', 
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- admin123
    'مدیر', 
    'سیستم',
    1, 
    TRUE, 
    TRUE, 
    TRUE,
    NULL
) ON DUPLICATE KEY UPDATE 
    `first_name` = VALUES(`first_name`),
    `last_name` = VALUES(`last_name`);

-- ===================================
-- Views مفید
-- ===================================

-- نمای کاربران فعال با اطلاعات گروه
CREATE OR REPLACE VIEW `v_active_users` AS
SELECT 
    u.id,
    u.username,
    u.email,
    u.mobile,
    u.full_name,
    u.avatar_path,
    u.last_login_at,
    ug.name as group_name,
    ug.name_fa as group_name_fa,
    u.created_at
FROM `ai_users` u
LEFT JOIN `ai_user_groups` ug ON u.user_group_id = ug.id
WHERE u.is_active = TRUE AND u.deleted_at IS NULL;

-- نمای آمار کاربران
CREATE OR REPLACE VIEW `v_user_statistics` AS
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_users,
    COUNT(CASE WHEN is_verified = TRUE THEN 1 END) as verified_users,
    COUNT(CASE WHEN last_login_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as active_last_30_days,
    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as new_last_7_days
FROM `ai_users` 
WHERE deleted_at IS NULL;