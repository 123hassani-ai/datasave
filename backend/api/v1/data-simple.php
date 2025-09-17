<?php
/**
 * Simple Data Management Test API
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once '../../config/database.php';
require_once '../../includes/SimpleXLSXReader.php';

try {
    if (!isset($_FILES['file'])) {
        throw new Exception('No file uploaded');
    }
    
    $file = $_FILES['file'];
    
    // Simple validation
    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('Upload error: ' . $file['error']);
    }
    
    // Save file
    $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/datasave/temp/uploads/';
    $fileName = uniqid() . '_' . basename($file['name']);
    $filePath = $uploadDir . $fileName;
    
    if (!move_uploaded_file($file['tmp_name'], $filePath)) {
        throw new Exception('Failed to save file');
    }
    
    // Read file
    $fileData = SimpleXLSXReader::readFile($filePath);
    
    // Basic analysis
    $totalRows = count($fileData);
    $totalColumns = $totalRows > 0 ? count($fileData[0]) : 0;
    $hasHeader = true;
    
    // Create simple analysis
    $analysis = [
        'fileName' => $file['name'],
        'fileSize' => $file['size'],
        'totalRows' => $totalRows,
        'totalColumns' => $totalColumns,
        'hasHeader' => $hasHeader,
        'preview' => array_slice($fileData, 0, 6),
        'session_id' => uniqid('session_'),
        'upload_time' => date('Y-m-d H:i:s'),
        'message' => 'فایل با موفقیت تحلیل شد - داده‌های واقعی'
    ];
    
    // Save analysis to JSON
    $sessionId = $analysis['session_id'];
    $analysisFile = $_SERVER['DOCUMENT_ROOT'] . '/datasave/temp/analysis_' . $sessionId . '.json';
    file_put_contents($analysisFile, json_encode($analysis, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    
    // Add analysis file path to response
    $analysis['analysis_file'] = 'temp/analysis_' . $sessionId . '.json';
    
    echo json_encode([
        'success' => true,
        'data' => $analysis
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>