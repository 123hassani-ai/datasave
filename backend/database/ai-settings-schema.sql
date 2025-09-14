-- جداول مربوط به تنظیمات هوش مصنوعی
-- AI Settings Tables

-- تنظیمات سیستم هوش مصنوعی
CREATE TABLE IF NOT EXISTS `ai_settings` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `setting_key` varchar(100) NOT NULL,
    `setting_value` text DEFAULT NULL,
    `setting_type` enum('string', 'integer', 'float', 'boolean', 'json') NOT NULL DEFAULT 'string',
    `description` varchar(255) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- تنظیمات پیش‌فرض برای AI
INSERT IGNORE INTO `ai_settings` (`setting_key`, `setting_value`, `setting_type`, `description`) VALUES
('openai_api_key', '', 'string', 'کلید API OpenAI'),
('ai_model', 'gpt-4o', 'string', 'مدل پیش‌فرض AI'),
('temperature', '0.7', 'float', 'پارامتر دما برای مدل‌های زبانی'),
('max_tokens', '1000', 'integer', 'حداکثر تعداد توکن‌ها در پاسخ'),
('tts_service', 'openai', 'string', 'سرویس تبدیل متن به صوت'),
('voice_selection', 'female', 'string', 'انتخاب صدای پیش‌فرض'),
('speech_speed', '1.0', 'float', 'سرعت تبدیل متن به صوت'),
('image_generation_service', 'openai', 'string', 'سرویس تولید تصویر');