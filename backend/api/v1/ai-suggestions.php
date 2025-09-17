<?php
/**
 * AI Suggestions API
 * API پیشنهادات هوش مصنوعی
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Only POST method is allowed');
    }

    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['prompt'])) {
        throw new Exception('Prompt is required');
    }

    $prompt = $input['prompt'];
    $maxTokens = $input['max_tokens'] ?? 1000;
    $temperature = $input['temperature'] ?? 0.3;

    // شبیه‌سازی پاسخ هوش مصنوعی
    // در production، اینجا با API واقعی ChatGPT یا Claude ارتباط برقرار می‌شود
    $aiResponse = simulateAIResponse($prompt);
    
    echo json_encode([
        'success' => true,
        'data' => $aiResponse,
        'usage' => [
            'prompt_tokens' => strlen($prompt) / 4, // تخمینی
            'completion_tokens' => strlen($aiResponse) / 4,
            'total_tokens' => (strlen($prompt) + strlen($aiResponse)) / 4
        ]
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

/**
 * شبیه‌سازی پاسخ هوش مصنوعی
 * در production این تابع با API واقعی جایگزین می‌شود
 */
function simulateAIResponse($prompt) {
    // استخراج فیلدها از prompt
    preg_match('/فیلدها: (.+?)(?:\n|$)/u', $prompt, $fieldsMatch);
    $fieldsText = $fieldsMatch[1] ?? '';
    $fields = explode(' - ', $fieldsText);
    
    // استخراج نام فایل
    preg_match('/نام فایل: (.+?)(?:\n|$)/u', $prompt, $fileMatch);
    $fileName = $fileMatch[1] ?? 'data';
    
    // تشخیص موضوع فرم
    $topic = detectFormTopic($fields);
    $tableName = generateTableName($fileName, $topic);
    
    // تولید پاسخ JSON
    $response = [
        'form_topic' => $topic,
        'form_description' => "فرم $topic برای مدیریت و ثبت اطلاعات مربوطه",
        'table_name' => $tableName,
        'fields' => []
    ];
    
    foreach ($fields as $field) {
        $field = trim($field);
        if (empty($field)) continue;
        
        $response['fields'][] = [
            'original' => $field,
            'english' => translateToEnglish($field),
            'type' => suggestDataType($field),
            'description' => generateFieldDescription($field)
        ];
    }
    
    return json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}

/**
 * تشخیص موضوع فرم
 */
function detectFormTopic($fields) {
    $fieldsText = implode(' ', $fields);
    
    $topics = [
        'مدیریت مشتریان' => ['مشتری', 'نام', 'تلفن', 'آدرس', 'ایمیل', 'موبایل'],
        'مدیریت فروش' => ['فروش', 'قیمت', 'مبلغ', 'سود', 'درصد', 'فروشنده'],
        'مدیریت انبار' => ['موجودی', 'کالا', 'تعداد', 'خرید', 'محصول'],
        'مدیریت مالی' => ['پرداخت', 'حساب', 'درآمد', 'هزینه', 'مالی'],
        'گزارشات' => ['گزارش', 'تاریخ', 'ماه', 'سال', 'آمار'],
        'مدیریت پرسنل' => ['کارمند', 'پرسنل', 'حقوق', 'شغل', 'واحد']
    ];
    
    foreach ($topics as $topic => $keywords) {
        foreach ($keywords as $keyword) {
            if (strpos($fieldsText, $keyword) !== false) {
                return $topic;
            }
        }
    }
    
    return 'مدیریت داده‌ها';
}

/**
 * تولید نام جدول
 */
function generateTableName($fileName, $topic) {
    $baseName = preg_replace('/\.(xlsx|xls|csv)$/i', '', $fileName);
    $englishName = translateToEnglish($baseName);
    $cleanName = preg_replace('/[^a-z0-9]/', '_', strtolower($englishName));
    $cleanName = preg_replace('/_+/', '_', $cleanName);
    $cleanName = trim($cleanName, '_');
    
    return 'xls2tbl_' . ($cleanName ?: 'data');
}

/**
 * ترجمه به انگلیسی
 */
function translateToEnglish($text) {
    $translations = [
        'شناسه' => 'id',
        'نام' => 'name',
        'تاریخ' => 'date',
        'زمان' => 'time',
        'قیمت' => 'price',
        'مبلغ' => 'amount',
        'تعداد' => 'count',
        'توضیحات' => 'description',
        'توضیح' => 'comment',
        'ماه' => 'month',
        'سال' => 'year',
        'روز' => 'day',
        'کاربر' => 'user',
        'مشتری' => 'customer',
        'فروش' => 'sale',
        'خرید' => 'purchase',
        'سود' => 'profit',
        'درصد' => 'percentage',
        'وضعیت' => 'status',
        'نوع' => 'type',
        'گروه' => 'group',
        'دسته' => 'category',
        'کد' => 'code',
        'شماره' => 'number',
        'آدرس' => 'address',
        'تلفن' => 'phone',
        'موبایل' => 'mobile',
        'ایمیل' => 'email',
        'محل' => 'location',
        'موقعیت' => 'position',
        'انتخاب' => 'selection',
        'بخش' => 'section',
        'واحد' => 'unit',
        'اپراتور' => 'operator',
        'ثبت' => 'register',
        'ویرایش' => 'edit',
        'اصلی' => 'main',
        'اینترنتی' => 'web',
        'مرورگر' => 'browser',
        'مکانی' => 'location',
        'آنلاین' => 'online',
        'کاری' => 'work',
        'فروشنده' => 'seller',
        'جمع' => 'total',
        'محاسبه' => 'calculation',
        'عنوان' => 'title',
        'موجودی' => 'inventory',
        'کالا' => 'product',
        'پایان' => 'end'
    ];
    
    $result = $text;
    foreach ($translations as $persian => $english) {
        $result = str_replace($persian, $english, $result);
    }
    
    // پاکسازی و تبدیل به snake_case
    $result = preg_replace('/[^a-z0-9\s]/', '', strtolower($result));
    $result = preg_replace('/\s+/', '_', $result);
    $result = preg_replace('/_+/', '_', $result);
    $result = trim($result, '_');
    
    return $result ?: 'field';
}

/**
 * پیشنهاد نوع داده
 */
function suggestDataType($fieldName) {
    $name = strtolower($fieldName);
    
    if (strpos($name, 'شناسه') !== false || strpos($name, 'id') !== false) {
        return 'INT AUTO_INCREMENT PRIMARY KEY';
    } elseif (strpos($name, 'تاریخ') !== false || strpos($name, 'date') !== false) {
        return 'DATE';
    } elseif (strpos($name, 'زمان') !== false || strpos($name, 'time') !== false) {
        return 'DATETIME';
    } elseif (strpos($name, 'قیمت') !== false || strpos($name, 'مبلغ') !== false || strpos($name, 'سود') !== false) {
        return 'DECIMAL(15,2)';
    } elseif (strpos($name, 'تعداد') !== false || strpos($name, 'count') !== false) {
        return 'INT';
    } elseif (strpos($name, 'توضیحات') !== false || strpos($name, 'comment') !== false) {
        return 'TEXT';
    } elseif (strpos($name, 'ایمیل') !== false || strpos($name, 'email') !== false) {
        return 'VARCHAR(255)';
    } elseif (strpos($name, 'تلفن') !== false || strpos($name, 'موبایل') !== false || strpos($name, 'phone') !== false) {
        return 'VARCHAR(20)';
    } else {
        return 'VARCHAR(255)';
    }
}

/**
 * تولید توضیح فیلد
 */
function generateFieldDescription($fieldName) {
    $descriptions = [
        'شناسه' => 'شناسه یکتا و منحصربه‌فرد',
        'نام' => 'نام کامل',
        'تاریخ' => 'تاریخ ثبت اطلاعات',
        'قیمت' => 'قیمت به ریال',
        'مبلغ' => 'مبلغ کل',
        'تعداد' => 'تعداد آیتم',
        'توضیحات' => 'توضیحات تکمیلی و یادداشت',
        'آدرس' => 'آدرس کامل',
        'تلفن' => 'شماره تلفن',
        'موبایل' => 'شماره موبایل',
        'ایمیل' => 'آدرس ایمیل',
        'فروش' => 'مبلغ فروش',
        'سود' => 'مبلغ سود'
    ];
    
    foreach ($descriptions as $key => $desc) {
        if (strpos($fieldName, $key) !== false) {
            return $desc;
        }
    }
    
    return "فیلد $fieldName";
}
?>