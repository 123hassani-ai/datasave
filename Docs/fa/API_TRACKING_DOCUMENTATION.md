# API Documentation - Excel File Tracking System

## 📡 Base URL
```
http://localhost/datasave/backend/api/v1/xls-tracking.php
```

---

## 🔐 Authentication
Currently no authentication required (development environment)

---

## 📋 Available Endpoints

### 1. Check File Existence

**Endpoint**: `POST /xls-tracking.php?action=check_file_exists`

**Purpose**: Determine if a file has been processed before based on its hash and structure

**Parameters**:
```json
{
    "file_hash": "string (64 chars SHA-256)",
    "columns_data": "string (comma-separated column names)"
}
```

**Response Examples**:

**New File**:
```json
{
    "success": true,
    "exists": false,
    "action": "create_table"
}
```

**Existing File (Same Structure)**:
```json
{
    "success": true,
    "exists": true,
    "action": "update_data",
    "table_name": "xlstbl_users_data",
    "unique_field": "id",
    "file_info": {
        "id": 1,
        "table_name": "xlstbl_users_data",
        "file_name": "users.xlsx",
        "columns_number": 5,
        "total_records": 1000,
        "processed_records": 1000,
        "created_at": "2025-09-15 10:30:00"
    }
}
```

**Structure Changed**:
```json
{
    "success": true,
    "exists": true,
    "action": "structure_changed",
    "message": "ساختار فایل تغییر کرده است. آیا می‌خواهید جدول جدید ایجاد شود؟"
}
```

---

### 2. Register New File

**Endpoint**: `POST /xls-tracking.php?action=register_file`

**Purpose**: Register a new file processing attempt in the tracking system

**Parameters**:
```json
{
    "table_name": "xlstbl_example",
    "file_name": "data.xlsx",
    "file_hash": "abc123...",
    "data_type": "create_table|update_data",
    "columns_number": 10,
    "columns_data": "id,name,email,phone",
    "unique_field": "id",
    "total_records": 500
}
```

**Response**:
```json
{
    "success": true,
    "message": "فایل با موفقیت ثبت شد",
    "file_id": 15
}
```

---

### 3. Get File Information

**Endpoint**: `GET /xls-tracking.php?action=get_file_info`

**Purpose**: Retrieve detailed information about a processed file

**Parameters**:
```
file_hash=abc123...
OR
table_name=xlstbl_example
```

**Response**:
```json
{
    "success": true,
    "file_info": {
        "id": 1,
        "table_name": "xlstbl_users_data",
        "file_name": "users.xlsx",
        "file_hash": "beb4928e8b5885080870c86...",
        "data_type": "create_table",
        "columns_number": 8,
        "columns_data": "شناسه,نام,ایمیل,تلفن",
        "unique_field": "شناسه",
        "total_records": 1500,
        "processed_records": 1500,
        "created_at": "2025-09-15 09:15:22",
        "updated_at": "2025-09-15 09:20:45"
    }
}
```

---

### 4. Update Processing Status

**Endpoint**: `POST /xls-tracking.php?action=update_processing_status`

**Purpose**: Update the processing progress of a file

**Parameters**:
```json
{
    "file_id": 15,
    "processed_records": 250,
    "data_type": "completed"
}
```

**Response**:
```json
{
    "success": true,
    "message": "وضعیت پردازش به‌روزرسانی شد"
}
```

---

### 5. Log Operation

**Endpoint**: `POST /xls-tracking.php?action=log_operation`

**Purpose**: Record an operation performed on a file

**Parameters**:
```json
{
    "xls_data_id": 15,
    "operation_type": "create|insert|update|delete",
    "affected_records": 100,
    "success_count": 98,
    "error_count": 2,
    "error_details": "2 rows had invalid email format",
    "processing_time": 5.234
}
```

**Response**:
```json
{
    "success": true,
    "message": "لاگ عملیات ثبت شد"
}
```

---

### 6. Get Processing History

**Endpoint**: `GET /xls-tracking.php?action=get_processing_history`

**Purpose**: Retrieve processing history for files

**Parameters** (Optional):
```
table_name=xlstbl_example  // Filter by specific table
limit=50                   // Number of records (default: 50)
```

**Response**:
```json
{
    "success": true,
    "history": [
        {
            "id": 1,
            "table_name": "xlstbl_users_data",
            "file_name": "users.xlsx",
            "operation_type": "create",
            "affected_records": 1500,
            "success_count": 1500,
            "error_count": 0,
            "processing_time": 12.456,
            "log_date": "2025-09-15 09:20:45"
        },
        {
            "id": 2,
            "table_name": "xlstbl_products",
            "file_name": "products.xlsx",
            "operation_type": "insert",
            "affected_records": 300,
            "success_count": 295,
            "error_count": 5,
            "processing_time": 3.721,
            "log_date": "2025-09-15 10:15:32"
        }
    ]
}
```

---

## ❌ Error Responses

### Standard Error Format
```json
{
    "success": false,
    "error": "Error message in Persian",
    "file": "/path/to/php/file.php",
    "line": 123,
    "trace": "Stack trace...",
    "request_data": {
        "GET": {},
        "POST": {
            "action": "check_file_exists",
            "file_hash": "abc123"
        }
    }
}
```

### Common Error Codes

**400 Bad Request**:
```json
{
    "success": false,
    "error": "فیلدهای اجباری ارسال نشده"
}
```

**500 Internal Server Error**:
```json
{
    "success": false,
    "error": "خطا در اتصال به دیتابیس"
}
```

---

## 🧪 Testing Examples

### cURL Examples

**Check File Existence**:
```bash
curl -X POST "http://localhost/datasave/backend/api/v1/xls-tracking.php" \
  -d "action=check_file_exists" \
  -d "file_hash=abc123def456" \
  -d "columns_data=نام,سن,شهر"
```

**Register File**:
```bash
curl -X POST "http://localhost/datasave/backend/api/v1/xls-tracking.php" \
  -d "action=register_file" \
  -d "table_name=xlstbl_test" \
  -d "file_name=test.xlsx" \
  -d "file_hash=abc123def456" \
  -d "data_type=create_table" \
  -d "columns_number=3" \
  -d "columns_data=نام,سن,شهر" \
  -d "total_records=100"
```

**Get Processing History**:
```bash
curl "http://localhost/datasave/backend/api/v1/xls-tracking.php?action=get_processing_history&limit=10"
```

---

## 📊 Database Schema Reference

### `xls2tbl_00data` Table Structure
```sql
CREATE TABLE xls2tbl_00data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL UNIQUE,
    file_name VARCHAR(255) NOT NULL,
    file_hash VARCHAR(64) NOT NULL,
    data_type ENUM('create_table', 'update_data') DEFAULT 'create_table',
    columns_number INT NOT NULL,
    columns_data TEXT NOT NULL,
    unique_field VARCHAR(100) NULL,
    total_records INT DEFAULT 0,
    processed_records INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_table_name (table_name),
    INDEX idx_file_hash (file_hash),
    INDEX idx_file_name (file_name)
);
```

### `xls2tbl_00logs` Table Structure
```sql
CREATE TABLE xls2tbl_00logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    xls_data_id INT NOT NULL,
    operation_type ENUM('create', 'insert', 'update', 'delete') NOT NULL,
    affected_records INT DEFAULT 0,
    success_count INT DEFAULT 0,
    error_count INT DEFAULT 0,
    error_details TEXT NULL,
    processing_time DECIMAL(8,3) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_xls_data_id (xls_data_id),
    INDEX idx_operation_type (operation_type),
    INDEX idx_created_at (created_at)
);
```

---

## 🔄 Workflow Integration

### Typical File Processing Flow

1. **Calculate File Hash**:
```javascript
const fileHash = await calculateFileHash(file);
```

2. **Check Existence**:
```javascript
const response = await fetch('/xls-tracking.php', {
    method: 'POST',
    body: formData // action=check_file_exists
});
```

3. **Handle Response**:
```javascript
if (result.exists && result.action === 'update_data') {
    // Show update options to user
} else if (result.action === 'create_table') {
    // Proceed with new table creation
}
```

4. **Register File**:
```javascript
const registerResponse = await fetch('/xls-tracking.php', {
    method: 'POST', 
    body: registrationData // action=register_file
});
```

5. **Log Operations**:
```javascript
await fetch('/xls-tracking.php', {
    method: 'POST',
    body: logData // action=log_operation
});
```

---

## 🛠️ Maintenance

### Database Cleanup
```sql
-- Remove old logs (older than 6 months)
DELETE FROM xls2tbl_00logs 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 6 MONTH);

-- Clean up failed processing attempts
DELETE FROM xls2tbl_00data 
WHERE processed_records = 0 
  AND created_at < DATE_SUB(NOW(), INTERVAL 1 WEEK);
```

### Performance Monitoring
```sql
-- Find frequently processed files
SELECT file_name, COUNT(*) as processing_count
FROM xls2tbl_00data 
GROUP BY file_name 
ORDER BY processing_count DESC 
LIMIT 10;

-- Check processing performance
SELECT 
    AVG(processing_time) as avg_time,
    MAX(processing_time) as max_time,
    COUNT(*) as operations
FROM xls2tbl_00logs 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY);
```

---

*Last Updated: September 15, 2025*  
*API Version: 1.0.0*  
*Status: Production Ready*