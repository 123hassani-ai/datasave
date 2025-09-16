<?php
/**
 * API for importing Excel data into database tables
 * API وارد کردن داده‌های Excel به جداول دیتابیس
 * 
 * @author DataSave Team
 * @version 1.0.0
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    // Get JSON input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        throw new Exception('Invalid JSON data');
    }
    
    // Validate required fields
    if (!isset($data['table_name']) || empty($data['table_name'])) {
        throw new Exception('Table name is required');
    }
    
    if (!isset($data['excel_data']) || !is_array($data['excel_data'])) {
        throw new Exception('Excel data is required');
    }
    
    if (!isset($data['field_mappings']) || !is_array($data['field_mappings'])) {
        throw new Exception('Field mappings are required');
    }
    
    // Database connection
    $host = '127.0.0.1';
    $port = '3307';
    $dbname = 'ai_excell2form';
    $username = 'root';
    $password = 'Mojtab@123';
    
    $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    
    $pdo = new PDO($dsn, $username, $password, $options);
    
    $tableName = $data['table_name'];
    $excelData = $data['excel_data'];
    $fieldMappings = $data['field_mappings'];
    $trackingId = $data['tracking_id'] ?? null;
    
    // Prepare field mapping
    $englishFields = [];
    foreach ($fieldMappings as $mapping) {
        $englishFields[] = $mapping['english_name'];
    }
    
    // Build INSERT SQL
    $fieldList = implode('`, `', $englishFields);
    $placeholders = implode(', ', array_fill(0, count($englishFields), '?'));
    $insertSql = "INSERT INTO `{$tableName}` (`{$fieldList}`) VALUES ({$placeholders})";
    
    error_log("Insert SQL: " . $insertSql);
    
    $stmt = $pdo->prepare($insertSql);
    
    $successCount = 0;
    $errorCount = 0;
    $startTime = microtime(true);
    
    // Start transaction
    $pdo->beginTransaction();
    
    // Skip header row (first row)
    $dataRows = array_slice($excelData, 1);
    
    foreach ($dataRows as $rowIndex => $row) {
        try {
            // Map Persian data to English fields
            $values = [];
            
            foreach ($fieldMappings as $fieldIndex => $mapping) {
                $value = isset($row[$fieldIndex]) ? $row[$fieldIndex] : null;
                
                // Clean and validate data
                if ($value !== null) {
                    $value = trim($value);
                    if ($value === '') {
                        $value = null;
                    }
                }
                
                // Type conversion based on field type
                if ($value !== null && isset($mapping['field_type'])) {
                    switch (strtoupper($mapping['field_type'])) {
                        case 'INT':
                        case 'INTEGER':
                        case 'BIGINT':
                            $value = is_numeric($value) ? (int)$value : null;
                            break;
                        case 'DECIMAL':
                        case 'FLOAT':
                        case 'DOUBLE':
                            $value = is_numeric($value) ? (float)$value : null;
                            break;
                        case 'DATE':
                            if ($value && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) {
                                // Try to convert different date formats
                                $timestamp = strtotime($value);
                                $value = $timestamp ? date('Y-m-d', $timestamp) : null;
                            }
                            break;
                        case 'DATETIME':
                        case 'TIMESTAMP':
                            if ($value && !preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/', $value)) {
                                $timestamp = strtotime($value);
                                $value = $timestamp ? date('Y-m-d H:i:s', $timestamp) : null;
                            }
                            break;
                    }
                }
                
                $values[] = $value;
            }
            
            // Execute insert
            $stmt->execute($values);
            $successCount++;
            
        } catch (PDOException $e) {
            $errorCount++;
            error_log("Row {$rowIndex} insert error: " . $e->getMessage() . " | Data: " . json_encode($row));
        }
    }
    
    // Commit transaction
    $pdo->commit();
    
    $endTime = microtime(true);
    $processingTime = round($endTime - $startTime, 3);
    
    // Update tracking record
    if ($trackingId) {
        $updateSql = "UPDATE xls2tbl_00data SET 
                      processed_records = ?, 
                      updated_at = NOW() 
                      WHERE id = ?";
        $updateStmt = $pdo->prepare($updateSql);
        $updateStmt->execute([$successCount, $trackingId]);
        
        // Log the import operation
        $logSql = "INSERT INTO xls2tbl_00logs (
            xls_data_id,
            operation_type,
            affected_records,
            success_count,
            error_count,
            processing_time
        ) VALUES (?, ?, ?, ?, ?, ?)";
        
        $logStmt = $pdo->prepare($logSql);
        $logStmt->execute([
            $trackingId,
            'import',
            count($dataRows),
            $successCount,
            $errorCount,
            $processingTime
        ]);
    }
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Data imported successfully',
        'total_rows' => count($dataRows),
        'success_count' => $successCount,
        'error_count' => $errorCount,
        'processing_time' => $processingTime . ' seconds'
    ]);
    
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
    
} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("General error: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>