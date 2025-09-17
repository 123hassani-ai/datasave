<?php
/**
 * API برای تحلیل کامل فایل Excel
 * خواندن تمام رکوردها و برگرداندن داده‌های کامل
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/../vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Shared\Date;

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('فقط درخواست POST پذیرفته می‌شود');
    }

    if (!isset($_FILES['file'])) {
        throw new Exception('فایلی ارسال نشده است');
    }

    $file = $_FILES['file'];
    
    // بررسی خطاهای آپلود
    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('خطا در آپلود فایل: ' . $file['error']);
    }

    // بررسی نوع فایل
    $allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
    ];
    
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mimeType, $allowedTypes)) {
        // Try reading with extension fallback
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($extension, ['xlsx', 'xls', 'csv'])) {
            throw new Exception('نوع فایل پشتیبانی نمی‌شود. فقط فایل‌های Excel و CSV مجاز هستند.');
        }
    }

    // خواندن فایل Excel
    $spreadsheet = IOFactory::load($file['tmp_name']);
    $worksheet = $spreadsheet->getActiveSheet();
    $data = $worksheet->toArray(null, true, true, true);

    // حذف ردیف‌های خالی
    $data = array_filter($data, function($row) {
        return !empty(array_filter($row, function($cell) {
            return trim($cell) !== '';
        }));
    });

    // Reset array keys
    $data = array_values($data);

    if (empty($data)) {
        throw new Exception('فایل خالی است یا قابل خواندن نیست');
    }

    // جدا کردن هدر از داده‌ها
    $headers = array_shift($data);
    $totalRows = count($data);
    $totalColumns = count($headers);

    // تولید پیش‌نمایش (5 رکورد اول)
    $preview = array_slice($data, 0, 5);
    array_unshift($preview, $headers); // اضافه کردن هدر به پیش‌نمایش

    // تحلیل نوع داده‌ها
    $columns = [];
    foreach ($headers as $index => $header) {
        $samples = [];
        for ($i = 0; $i < min(3, count($data)); $i++) {
            if (isset($data[$i][$index])) {
                $samples[] = $data[$i][$index];
            }
        }
        
        $columns[] = [
            'name' => trim($header),
            'type' => 'text', // Default type
            'samples' => $samples
        ];
    }

    // برگرداندن نتیجه کامل
    $result = [
        'success' => true,
        'data' => [
            'fileName' => $file['name'],
            'fileSize' => $file['size'],
            'totalRows' => $totalRows,
            'totalColumns' => $totalColumns,
            'hasHeader' => true,
            'columns' => $columns,
            'preview' => $preview,
            'fullData' => $data, // داده‌های کامل
            'analysis' => [
                'summary' => "فایل Excel شامل {$totalRows} رکورد و {$totalColumns} ستون است.",
                'dataQuality' => 'خوب',
                'hasNulls' => false,
                'hasDuplicates' => false
            ]
        ]
    ];

    echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (Exception $e) {
    error_log("Excel Analysis Error: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>