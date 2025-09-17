# Frontend Implementation Guide - Data Management Module

## 📁 File Location
`/assets/js/admin/modules/data-management.js`

---

## 🏗️ Module Architecture

### Core Functions Overview

| Function | Purpose | Dependencies |
|----------|---------|-------------|
| `calculateFileHash()` | Generate SHA-256 hash from file content | Web Crypto API |
| `checkFileExistence()` | Query backend for file processing history | Fetch API, xls-tracking.php |
| `parseAndDisplayStructure()` | Extract and display Excel structure | AI integration, DOM manipulation |
| `showNotification()` | Display user feedback messages | CSS animations, glassmorphism |
| `createUniqueTableName()` | Generate safe database table names | String manipulation |

---

## 🔧 Implementation Details

### File Hashing System

**Purpose**: Create unique fingerprints for Excel files to detect duplicates

```javascript
async function calculateFileHash(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        console.log('File hash calculated successfully:', hashHex);
        return hashHex;
    } catch (error) {
        console.error('Error calculating file hash:', error);
        throw new Error('خطا در محاسبه هش فایل');
    }
}
```

**Usage**:
```javascript
const fileHash = await calculateFileHash(selectedFile);
```

**Technical Notes**:
- Uses SHA-256 algorithm for cryptographic strength
- Reads entire file content into memory (suitable for Excel files < 100MB)
- Returns 64-character hexadecimal string
- Throws Persian error messages for user feedback

---

### File Existence Check

**Purpose**: Determine if file has been processed before and what action to take

```javascript
async function checkFileExistence(fileHash, columnsData) {
    try {
        const formData = new FormData();
        formData.append('action', 'check_file_exists');
        formData.append('file_hash', fileHash);
        formData.append('columns_data', columnsData);

        const response = await fetch('/datasave/backend/api/v1/xls-tracking.php', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || 'خطای نامشخص در بررسی فایل');
        }

        return result;
    } catch (error) {
        console.error('Error checking file existence:', error);
        throw error;
    }
}
```

**Response Handling**:
```javascript
const checkResult = await checkFileExistence(fileHash, columnsString);

switch (checkResult.action) {
    case 'create_table':
        showNotification('فایل جدید تشخیص داده شد. جدول جدید ایجاد می‌شود.', 'info');
        break;
        
    case 'update_data':
        showNotification('فایل موجود است. داده‌ها به‌روزرسانی می‌شوند.', 'success');
        break;
        
    case 'structure_changed':
        showNotification('ساختار فایل تغییر کرده است.', 'warning');
        break;
}
```

---

### AI Integration with Fallback

**Purpose**: Parse AI-generated database structure with robust error handling

```javascript
function extractJsonFromAiResponse(responseText) {
    const cleanedText = responseText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .replace(/^\s*[\[\{]/, match => match.trim())
        .replace(/[\]\}]\s*$/, match => match.trim())
        .trim();

    // Multiple extraction strategies
    const strategies = [
        // Strategy 1: Direct JSON.parse
        () => JSON.parse(cleanedText),
        
        // Strategy 2: Extract JSON between braces
        () => {
            const match = cleanedText.match(/\{[\s\S]*\}/);
            return match ? JSON.parse(match[0]) : null;
        },
        
        // Strategy 3: Extract array between brackets
        () => {
            const match = cleanedText.match(/\[[\s\S]*\]/);
            return match ? JSON.parse(match[0]) : null;
        },
        
        // Strategy 4: Clean and retry
        () => {
            const superCleaned = cleanedText
                .replace(/،\s*\]/g, ']')
                .replace(/،\s*\}/g, '}')
                .replace(/,(\s*[}\]])/g, '$1');
            return JSON.parse(superCleaned);
        }
    ];

    for (let i = 0; i < strategies.length; i++) {
        try {
            const result = strategies[i]();
            if (result) {
                console.log(`✅ JSON extraction successful with strategy ${i + 1}`);
                return result;
            }
        } catch (error) {
            console.log(`❌ Strategy ${i + 1} failed:`, error.message);
        }
    }
    
    throw new Error('تمام روش‌های استخراج JSON ناموفق بودند');
}
```

**Integration in Main Flow**:
```javascript
try {
    // First, analyze file with AI
    const analysisResult = await analyzeFileWithAI(file);
    const columnsStructure = extractJsonFromAiResponse(analysisResult);
    
    // Then check if file exists
    const checkResult = await checkFileExistence(fileHash, columnsString);
    
    // Continue with processing...
} catch (error) {
    showNotification(`خطا در تحلیل فایل: ${error.message}`, 'error');
}
```

---

### Notification System

**Purpose**: Provide visual feedback to users with glassmorphism design

```javascript
function showNotification(message, type = 'info', duration = 5000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            ${getNotificationIcon(type)}
        </div>
        <div class="notification-content">
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Auto-remove after duration
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
    }
}

function getNotificationIcon(type) {
    const icons = {
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'info': 'ℹ️'
    };
    return icons[type] || icons.info;
}
```

**CSS Integration** (in appropriate stylesheet):
```css
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    max-width: 400px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    animation: slideInRight 0.3s ease-out;
    direction: rtl;
}

@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
```

---

### Table Name Generation

**Purpose**: Create safe, unique table names for MySQL

```javascript
function createUniqueTableName(fileName) {
    // Remove file extension
    const baseName = fileName.replace(/\.[^/.]+$/, '');
    
    // Convert Persian/Arabic to English
    const persianToEnglish = {
        'ا': 'a', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ث': 's',
        'ج': 'j', 'چ': 'ch', 'ح': 'h', 'خ': 'kh', 'د': 'd',
        'ذ': 'z', 'ر': 'r', 'ز': 'z', 'ژ': 'zh', 'س': 's',
        'ش': 'sh', 'ص': 's', 'ض': 'z', 'ط': 't', 'ظ': 'z',
        'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'gh', 'ک': 'k',
        'گ': 'g', 'ل': 'l', 'م': 'm', 'ن': 'n', 'و': 'v',
        'ه': 'h', 'ی': 'y', ' ': '_'
    };
    
    let englishName = '';
    for (const char of baseName) {
        englishName += persianToEnglish[char] || char;
    }
    
    // Clean and format
    const cleanName = englishName
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')
        .substring(0, 50); // MySQL table name limit
    
    // Add prefix and timestamp for uniqueness
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').substring(0, 15);
    return `xlstbl_${cleanName}_${timestamp}`;
}
```

**Usage Example**:
```javascript
const tableName = createUniqueTableName('گزارش فروش.xlsx');
// Result: "xlstbl_gzarsh_frosh_20250915t103045"
```

---

## 🔄 Complete Workflow Integration

### Main Processing Function

```javascript
async function processExcelFile(file) {
    let processingStep = 'initialization';
    
    try {
        // Step 1: Calculate file hash
        processingStep = 'hashing';
        showNotification('در حال محاسبه هش فایل...', 'info');
        const fileHash = await calculateFileHash(file);
        
        // Step 2: Analyze file structure with AI
        processingStep = 'ai_analysis';
        showNotification('در حال تحلیل ساختار فایل با هوش مصنوعی...', 'info');
        const analysisResult = await analyzeFileWithAI(file);
        const columnsStructure = extractJsonFromAiResponse(analysisResult);
        
        // Step 3: Check file existence
        processingStep = 'existence_check';
        const columnsString = columnsStructure.map(col => col.name).join(',');
        const checkResult = await checkFileExistence(fileHash, columnsString);
        
        // Step 4: Handle based on result
        processingStep = 'action_handling';
        await handleProcessingAction(checkResult, file, fileHash, columnsStructure);
        
    } catch (error) {
        console.error(`Error in step ${processingStep}:`, error);
        showNotification(`خطا در مرحله ${getStepName(processingStep)}: ${error.message}`, 'error');
    }
}

function getStepName(step) {
    const stepNames = {
        'initialization': 'آماده‌سازی',
        'hashing': 'محاسبه هش',
        'ai_analysis': 'تحلیل هوش مصنوعی',
        'existence_check': 'بررسی وجود فایل',
        'action_handling': 'پردازش اقدام'
    };
    return stepNames[step] || step;
}
```

---

## 🧪 Testing Functions

### Debug Console Integration

```javascript
// Debug mode toggle
let debugMode = false;

function enableDebugMode() {
    debugMode = true;
    console.log('🔍 Debug mode enabled for data-management module');
}

function debugLog(message, data = null) {
    if (debugMode) {
        console.log(`[DEBUG] ${message}`, data || '');
    }
}

// Test file processing with sample data
async function testFileProcessing() {
    try {
        // Create a test file
        const testData = 'نام,سن,شهر\nعلی,25,تهران\nمریم,30,اصفهان';
        const testFile = new File([testData], 'test-data.csv', { type: 'text/csv' });
        
        debugLog('Starting test file processing', testFile);
        await processExcelFile(testFile);
        
    } catch (error) {
        console.error('Test failed:', error);
    }
}

// Expose test functions to global scope for console access
window.testFileProcessing = testFileProcessing;
window.enableDebugMode = enableDebugMode;
```

---

## 📊 Performance Considerations

### Memory Management

```javascript
// File size validation
function validateFileSize(file) {
    const maxSize = 50 * 1024 * 1024; // 50MB limit
    
    if (file.size > maxSize) {
        throw new Error(`فایل بیش از حد بزرگ است. حداکثر اندازه مجاز: ${formatFileSize(maxSize)}`);
    }
    
    return true;
}

function formatFileSize(bytes) {
    const units = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
}
```

### Progress Tracking

```javascript
function updateProgress(current, total, message = '') {
    const percentage = Math.round((current / total) * 100);
    
    // Update progress bar if exists
    const progressBar = document.querySelector('#upload-progress');
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
        progressBar.textContent = `${percentage}%`;
    }
    
    // Show progress notification
    if (message) {
        showNotification(`${message} (${percentage}%)`, 'info', 0);
    }
    
    debugLog(`Progress: ${current}/${total} (${percentage}%)`, message);
}
```

---

## 🛠️ Troubleshooting Guide

### Common Issues and Solutions

**1. Hash Calculation Fails**:
```javascript
// Issue: Crypto API not available
// Solution: Check HTTPS or localhost environment
if (!window.crypto || !window.crypto.subtle) {
    throw new Error('رمزنگاری وب در این محیط پشتیبانی نمی‌شود. لطفاً از HTTPS استفاده کنید.');
}
```

**2. AI Response Parsing Fails**:
```javascript
// Issue: Malformed JSON from AI
// Solution: Multiple fallback strategies implemented
// Check extractJsonFromAiResponse() function above
```

**3. Network Request Failures**:
```javascript
// Issue: CORS or network errors
// Solution: Enhanced error handling
async function safeFetch(url, options) {
    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`خطای شبکه (${response.status}): ${errorText}`);
        }
        
        return response;
    } catch (error) {
        if (error.name === 'TypeError') {
            throw new Error('خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید.');
        }
        throw error;
    }
}
```

### Debug Console Commands

```javascript
// Check module status
console.log('DataManagement module status:', {
    hashingSupported: !!window.crypto?.subtle,
    apiEndpoint: '/datasave/backend/api/v1/xls-tracking.php',
    debugMode: debugMode
});

// Test individual functions
await calculateFileHash(file);  // Test hashing
showNotification('Test message', 'success');  // Test notifications
```

---

*Last Updated: September 15, 2025*  
*Module Version: 2.0.0*  
*Status: Production Ready*