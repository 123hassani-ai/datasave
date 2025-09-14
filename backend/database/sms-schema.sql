-- جداول مربوط به سیستم پیامک 0098SMS
-- SMS Tables for 0098SMS System

-- تنظیمات سامانه پیامک
CREATE TABLE IF NOT EXISTS `ai_sms_settings` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `setting_key` varchar(100) NOT NULL,
    `setting_value` text DEFAULT NULL,
    `setting_type` enum('string', 'integer', 'boolean', 'text') NOT NULL DEFAULT 'string',
    `description` varchar(255) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- لاگ ارسال پیامک‌ها
CREATE TABLE IF NOT EXISTS `ai_sms_logs` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `recipient_phone` varchar(20) NOT NULL,
    `message_text` text NOT NULL,
    `message_type` enum('general', 'otp', 'notification', 'test') NOT NULL DEFAULT 'general',
    `sms_id` varchar(50) DEFAULT NULL COMMENT 'شناسه پیامک از سامانه 0098',
    `status_code` varchar(10) DEFAULT NULL COMMENT 'کد وضعیت از سامانه',
    `status_text` varchar(100) DEFAULT NULL COMMENT 'متن وضعیت',
    `delivery_status` enum('pending', 'sent', 'delivered', 'failed', 'unknown') NOT NULL DEFAULT 'pending',
    `otp_code` varchar(10) DEFAULT NULL COMMENT 'کد OTP در صورت وجود',
    `otp_expires_at` timestamp NULL DEFAULT NULL COMMENT 'زمان انقضای OTP',
    `created_by` int(11) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_recipient_phone` (`recipient_phone`),
    KEY `idx_message_type` (`message_type`),
    KEY `idx_created_at` (`created_at`),
    KEY `idx_delivery_status` (`delivery_status`),
    KEY `fk_sms_created_by` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- تنظیمات پیش‌فرض
INSERT INTO `ai_sms_settings` (`setting_key`, `setting_value`, `setting_type`, `description`) VALUES
('sms_username', 'zsms8829', 'string', 'نام کاربری سامانه 0098SMS'),
('sms_password', 'ZRtn63e*)Od1', 'string', 'رمز عبور سامانه 0098SMS'),
('sms_panel_number', '3000164545', 'string', 'شماره پنل اختصاصی'),
('sms_domain', '0098', 'string', 'دامین سامانه'),
('sms_enabled', '1', 'boolean', 'فعال/غیرفعال بودن سامانه پیامک'),
('otp_length', '5', 'integer', 'تعداد رقم کد OTP'),
('otp_expiry_minutes', '5', 'integer', 'مدت زمان اعتبار OTP (دقیقه)'),
('otp_message_template', 'کد تایید شما: {OTP_CODE}\nاین کد تا {EXPIRY_MINUTES} دقیقه معتبر است.\nDataSave', 'text', 'قالب پیام OTP'),
('test_phone_number', '09123456789', 'string', 'شماره تست پیامک'),
('test_message_text', 'این یک پیام تست از سیستم DataSave است.', 'text', 'متن پیش‌فرض پیام تست'),
('daily_sms_limit', '1000', 'integer', 'محدودیت ارسال روزانه پیامک'),
('api_endpoint', 'https://0098sms.com/sendsmslink.aspx', 'string', 'آدرس API سامانه'),
('webservice_endpoint', 'https://webservice.0098sms.com/service.asmx', 'string', 'آدرس وب سرویس');