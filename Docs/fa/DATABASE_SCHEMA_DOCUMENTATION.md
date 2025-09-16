# Database Schema Documentation - Excel File Tracking System

## 📊 Database Overview

**Database Name**: `ai_excell2form`  
**Server**: localhost:3307  
**Engine**: MySQL 5.7+  
**Character Set**: utf8mb4  
**Collation**: utf8mb4_unicode_ci  

---

## 🗃️ Table Structures

### 1. Main Tracking Table: `xls2tbl_00data`

**Purpose**: Primary table for tracking Excel file processing history and metadata

```sql
CREATE TABLE xls2tbl_00data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL UNIQUE COMMENT 'نام جدول ایجاد شده برای داده‌های فایل',
    file_name VARCHAR(255) NOT NULL COMMENT 'نام اصلی فایل آپلود شده',
    file_hash VARCHAR(64) NOT NULL COMMENT 'SHA-256 hash برای تشخیص فایل‌های تکراری',
    data_type ENUM('create_table', 'update_data') DEFAULT 'create_table' COMMENT 'نوع عملیات انجام شده',
    columns_number INT NOT NULL COMMENT 'تعداد ستون‌های فایل',
    columns_data TEXT NOT NULL COMMENT 'نام ستون‌ها به صورت کاما separated',
    unique_field VARCHAR(100) NULL COMMENT 'نام فیلد یکتا برای به‌روزرسانی',
    total_records INT DEFAULT 0 COMMENT 'تعداد کل رکوردهای فایل',
    processed_records INT DEFAULT 0 COMMENT 'تعداد رکوردهای پردازش شده',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'زمان ایجاد رکورد',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'زمان آخرین به‌روزرسانی',
    
    -- Indexes for performance
    INDEX idx_table_name (table_name),
    INDEX idx_file_hash (file_hash),
    INDEX idx_file_name (file_name),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='جدول اصلی برای ردیابی فایل‌های Excel پردازش شده';
```

#### Field Descriptions

| Field | Type | Null | Default | Description |
|-------|------|------|---------|-------------|
| `id` | INT | NO | AUTO_INCREMENT | شناسه یکتای رکورد |
| `table_name` | VARCHAR(100) | NO | - | نام جدول ایجاد شده (xlstbl_prefix) |
| `file_name` | VARCHAR(255) | NO | - | نام فایل اصلی (مثل: users.xlsx) |
| `file_hash` | VARCHAR(64) | NO | - | هش SHA-256 محتوای فایل |
| `data_type` | ENUM | NO | create_table | نوع عملیات (ایجاد جدول یا به‌روزرسانی) |
| `columns_number` | INT | NO | - | تعداد ستون‌های فایل |
| `columns_data` | TEXT | NO | - | نام ستون‌ها (شناسه,نام,ایمیل) |
| `unique_field` | VARCHAR(100) | YES | NULL | فیلد یکتا برای به‌روزرسانی داده‌ها |
| `total_records` | INT | NO | 0 | تعداد کل رکوردهای فایل |
| `processed_records` | INT | NO | 0 | تعداد رکوردهای پردازش شده |
| `created_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | زمان ایجاد |
| `updated_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | زمان آخرین تغییر |

---

### 2. Operations Log Table: `xls2tbl_00logs`

**Purpose**: Detailed logging of all operations performed on Excel files

```sql
CREATE TABLE xls2tbl_00logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    xls_data_id INT NOT NULL COMMENT 'ارجاع به جدول اصلی xls2tbl_00data',
    operation_type ENUM('create', 'insert', 'update', 'delete') NOT NULL COMMENT 'نوع عملیات انجام شده',
    affected_records INT DEFAULT 0 COMMENT 'تعداد رکوردهای تحت تأثیر',
    success_count INT DEFAULT 0 COMMENT 'تعداد عملیات موفق',
    error_count INT DEFAULT 0 COMMENT 'تعداد خطاهای رخ داده',
    error_details TEXT NULL COMMENT 'جزئیات خطاهای رخ داده',
    processing_time DECIMAL(8,3) NULL COMMENT 'زمان پردازش به ثانیه',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'زمان انجام عملیات',
    
    -- Foreign Key
    FOREIGN KEY (xls_data_id) REFERENCES xls2tbl_00data(id) ON DELETE CASCADE,
    
    -- Indexes for performance
    INDEX idx_xls_data_id (xls_data_id),
    INDEX idx_operation_type (operation_type),
    INDEX idx_created_at (created_at),
    INDEX idx_processing_time (processing_time)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='جدول لاگ عملیات انجام شده روی فایل‌های Excel';
```

#### Field Descriptions

| Field | Type | Null | Default | Description |
|-------|------|------|---------|-------------|
| `id` | INT | NO | AUTO_INCREMENT | شناسه یکتای لاگ |
| `xls_data_id` | INT | NO | - | ارجاع به رکورد فایل در جدول اصلی |
| `operation_type` | ENUM | NO | - | نوع عملیات (create/insert/update/delete) |
| `affected_records` | INT | NO | 0 | تعداد رکوردهای تحت تأثیر عملیات |
| `success_count` | INT | NO | 0 | تعداد عملیات موفقیت‌آمیز |
| `error_count` | INT | NO | 0 | تعداد خطاهای رخ داده |
| `error_details` | TEXT | YES | NULL | توضیح کامل خطاهای رخ داده |
| `processing_time` | DECIMAL(8,3) | YES | NULL | مدت زمان پردازش (ثانیه) |
| `created_at` | TIMESTAMP | NO | CURRENT_TIMESTAMP | زمان انجام عملیات |

---

## 🔧 Installation Script

### Complete Schema Installation

```sql
-- Create database if not exists
CREATE DATABASE IF NOT EXISTS ai_excell2form 
    DEFAULT CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE ai_excell2form;

-- Drop existing tables if they exist (for clean installation)
DROP TABLE IF EXISTS xls2tbl_00logs;
DROP TABLE IF EXISTS xls2tbl_00data;

-- Create main tracking table
CREATE TABLE xls2tbl_00data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL UNIQUE COMMENT 'نام جدول ایجاد شده برای داده‌های فایل',
    file_name VARCHAR(255) NOT NULL COMMENT 'نام اصلی فایل آپلود شده',
    file_hash VARCHAR(64) NOT NULL COMMENT 'SHA-256 hash برای تشخیص فایل‌های تکراری',
    data_type ENUM('create_table', 'update_data') DEFAULT 'create_table' COMMENT 'نوع عملیات انجام شده',
    columns_number INT NOT NULL COMMENT 'تعداد ستون‌های فایل',
    columns_data TEXT NOT NULL COMMENT 'نام ستون‌ها به صورت کاما separated',
    unique_field VARCHAR(100) NULL COMMENT 'نام فیلد یکتا برای به‌روزرسانی',
    total_records INT DEFAULT 0 COMMENT 'تعداد کل رکوردهای فایل',
    processed_records INT DEFAULT 0 COMMENT 'تعداد رکوردهای پردازش شده',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'زمان ایجاد رکورد',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'زمان آخرین به‌روزرسانی',
    
    INDEX idx_table_name (table_name),
    INDEX idx_file_hash (file_hash),
    INDEX idx_file_name (file_name),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='جدول اصلی برای ردیابی فایل‌های Excel پردازش شده';

-- Create operations log table
CREATE TABLE xls2tbl_00logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    xls_data_id INT NOT NULL COMMENT 'ارجاع به جدول اصلی xls2tbl_00data',
    operation_type ENUM('create', 'insert', 'update', 'delete') NOT NULL COMMENT 'نوع عملیات انجام شده',
    affected_records INT DEFAULT 0 COMMENT 'تعداد رکوردهای تحت تأثیر',
    success_count INT DEFAULT 0 COMMENT 'تعداد عملیات موفق',
    error_count INT DEFAULT 0 COMMENT 'تعداد خطاهای رخ داده',
    error_details TEXT NULL COMMENT 'جزئیات خطاهای رخ داده',
    processing_time DECIMAL(8,3) NULL COMMENT 'زمان پردازش به ثانیه',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'زمان انجام عملیات',
    
    FOREIGN KEY (xls_data_id) REFERENCES xls2tbl_00data(id) ON DELETE CASCADE,
    
    INDEX idx_xls_data_id (xls_data_id),
    INDEX idx_operation_type (operation_type),
    INDEX idx_created_at (created_at),
    INDEX idx_processing_time (processing_time)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='جدول لاگ عملیات انجام شده روی فایل‌های Excel';

-- Insert initial test data (optional)
INSERT INTO xls2tbl_00data (
    table_name, file_name, file_hash, data_type, 
    columns_number, columns_data, unique_field, 
    total_records, processed_records
) VALUES (
    'xlstbl_test_sample', 
    'test-sample.xlsx', 
    'abc123def456789...',  -- Sample hash
    'create_table',
    4,
    'شناسه,نام,ایمیل,تلفن',
    'شناسه',
    100,
    100
);

-- Verify installation
SELECT 'Schema installed successfully' as Status;
SELECT COUNT(*) as InitialRecords FROM xls2tbl_00data;

SHOW TABLES LIKE 'xls2tbl_%';
```

---

## 📈 Query Examples

### Common Queries for File Management

#### 1. Check if File Exists by Hash

```sql
SELECT 
    id,
    table_name,
    file_name,
    data_type,
    columns_data,
    unique_field,
    total_records,
    processed_records,
    created_at
FROM xls2tbl_00data 
WHERE file_hash = 'your_file_hash_here'
LIMIT 1;
```

#### 2. Find Files with Same Structure

```sql
SELECT 
    file_name,
    table_name,
    columns_number,
    columns_data,
    total_records,
    created_at
FROM xls2tbl_00data 
WHERE columns_data = 'شناسه,نام,ایمیل,تلفن'
ORDER BY created_at DESC;
```

#### 3. Get Processing Statistics

```sql
SELECT 
    d.file_name,
    d.total_records,
    d.processed_records,
    ROUND((d.processed_records / d.total_records) * 100, 2) as completion_percentage,
    COUNT(l.id) as total_operations,
    SUM(l.success_count) as total_success,
    SUM(l.error_count) as total_errors,
    AVG(l.processing_time) as avg_processing_time
FROM xls2tbl_00data d
LEFT JOIN xls2tbl_00logs l ON d.id = l.xls_data_id
GROUP BY d.id
ORDER BY d.created_at DESC;
```

#### 4. Find Recent Processing History

```sql
SELECT 
    d.file_name,
    d.table_name,
    l.operation_type,
    l.affected_records,
    l.success_count,
    l.error_count,
    l.processing_time,
    l.created_at
FROM xls2tbl_00logs l
JOIN xls2tbl_00data d ON l.xls_data_id = d.id
WHERE l.created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
ORDER BY l.created_at DESC
LIMIT 50;
```

#### 5. Identify Failed Processing Attempts

```sql
SELECT 
    d.file_name,
    d.table_name,
    d.total_records,
    d.processed_records,
    l.error_count,
    l.error_details,
    l.created_at
FROM xls2tbl_00data d
JOIN xls2tbl_00logs l ON d.id = l.xls_data_id
WHERE l.error_count > 0
   OR d.processed_records < d.total_records
ORDER BY l.created_at DESC;
```

---

## 🧹 Maintenance Queries

### Regular Maintenance Tasks

#### 1. Clean Old Log Entries (6+ months old)

```sql
-- Check what will be deleted first
SELECT COUNT(*) as records_to_delete
FROM xls2tbl_00logs 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 6 MONTH);

-- Delete old logs
DELETE FROM xls2tbl_00logs 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 6 MONTH);
```

#### 2. Remove Incomplete Processing Records

```sql
-- Check incomplete records
SELECT 
    file_name,
    total_records,
    processed_records,
    created_at
FROM xls2tbl_00data 
WHERE processed_records = 0 
  AND created_at < DATE_SUB(NOW(), INTERVAL 1 WEEK);

-- Delete incomplete processing attempts older than 1 week
DELETE FROM xls2tbl_00data 
WHERE processed_records = 0 
  AND created_at < DATE_SUB(NOW(), INTERVAL 1 WEEK);
```

#### 3. Database Size Analysis

```sql
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)',
    table_rows as 'Rows'
FROM information_schema.TABLES 
WHERE table_schema = 'ai_excell2form'
  AND table_name LIKE 'xls2tbl_%'
ORDER BY (data_length + index_length) DESC;
```

#### 4. Performance Analysis

```sql
-- Find most frequently processed files
SELECT 
    file_name,
    COUNT(*) as processing_count,
    AVG(total_records) as avg_records,
    MIN(created_at) as first_processing,
    MAX(created_at) as last_processing
FROM xls2tbl_00data 
GROUP BY file_name
HAVING processing_count > 1
ORDER BY processing_count DESC;

-- Average processing times by operation type
SELECT 
    operation_type,
    COUNT(*) as operation_count,
    AVG(processing_time) as avg_time_seconds,
    MIN(processing_time) as min_time,
    MAX(processing_time) as max_time
FROM xls2tbl_00logs 
WHERE processing_time IS NOT NULL
GROUP BY operation_type
ORDER BY avg_time_seconds DESC;
```

---

## 🔒 Security Considerations

### Database Security

```sql
-- Create dedicated user for the application
CREATE USER 'excel_app'@'localhost' IDENTIFIED BY 'secure_password_here';

-- Grant minimal necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ai_excell2form.xls2tbl_00data TO 'excel_app'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON ai_excell2form.xls2tbl_00logs TO 'excel_app'@'localhost';

-- Grant permission to create tables (for dynamic Excel table creation)
GRANT CREATE ON ai_excell2form.* TO 'excel_app'@'localhost';

-- Apply privileges
FLUSH PRIVILEGES;
```

### Data Validation Constraints

```sql
-- Add check constraints (MySQL 8.0+)
ALTER TABLE xls2tbl_00data 
ADD CONSTRAINT chk_file_hash_length 
CHECK (CHAR_LENGTH(file_hash) = 64);

ALTER TABLE xls2tbl_00data 
ADD CONSTRAINT chk_positive_records 
CHECK (total_records >= 0 AND processed_records >= 0);

ALTER TABLE xls2tbl_00logs 
ADD CONSTRAINT chk_positive_counts 
CHECK (affected_records >= 0 AND success_count >= 0 AND error_count >= 0);
```

---

## 📊 Backup Strategy

### Automated Backup Script

```bash
#!/bin/bash
# backup-excel-tracking.sh

DB_NAME="ai_excell2form"
DB_USER="root"
DB_PASS="Mojtab@123"
DB_HOST="localhost"
DB_PORT="3307"
BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory if not exists
mkdir -p "$BACKUP_DIR"

# Backup tracking tables only
mysqldump -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" \
    --single-transaction \
    --routines \
    --triggers \
    "$DB_NAME" \
    xls2tbl_00data xls2tbl_00logs \
    > "$BACKUP_DIR/excel_tracking_${DATE}.sql"

# Compress backup
gzip "$BACKUP_DIR/excel_tracking_${DATE}.sql"

echo "Backup completed: excel_tracking_${DATE}.sql.gz"
```

### Restore Script

```bash
#!/bin/bash
# restore-excel-tracking.sh

BACKUP_FILE="$1"
DB_NAME="ai_excell2form"
DB_USER="root"
DB_PASS="Mojtab@123"
DB_HOST="localhost"
DB_PORT="3307"

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file.sql.gz>"
    exit 1
fi

# Decompress and restore
gunzip -c "$BACKUP_FILE" | mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" "$DB_NAME"

echo "Restore completed from: $BACKUP_FILE"
```

---

*Last Updated: September 15, 2025*  
*Schema Version: 1.0.0*  
*Status: Production Ready*