<?php
/**
 * API for creating database tables from Excel data
 * API ایجاد جداول دیتابیس از داده‌های Excel
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
    if (!isset($data['sql']) || empty($data['sql'])) {
        throw new Exception('SQL query is required');
    }
    
    if (!isset($data['table_info'])) {
        throw new Exception('Table info is required');
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
    
    // Execute the CREATE TABLE SQL
    $sql = $data['sql'];
    
    // Log the SQL for debugging
    error_log("Creating table with SQL: " . $sql);
    
    $pdo->exec($sql);
    
    // Save table info to tracking table
    $tableInfo = $data['table_info'];
    
    $insertSql = "INSERT INTO xls2tbl_00data (
        table_name, 
        file_name, 
        file_hash, 
        data_type, 
        columns_number, 
        columns_data, 
        total_records,
        processed_records
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $pdo->prepare($insertSql);
    $stmt->execute([
        $tableInfo['table_name'],
        $tableInfo['file_name'],
        $tableInfo['file_hash'],
        'create_table',
        $tableInfo['columns_number'],
        $tableInfo['columns_data'],
        $tableInfo['total_records'] ?? 0,
        0 // processed_records starts at 0
    ]);
    
    $trackingId = $pdo->lastInsertId();
    
    // Save field mappings
    if (isset($tableInfo['field_mappings']) && is_array($tableInfo['field_mappings'])) {
        $fieldSql = "INSERT INTO xls2tbl_00field_mapping (
            xls_data_id,
            field_order,
            persian_name,
            english_name,
            field_type,
            field_length,
            is_primary_key,
            is_nullable,
            field_comment
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $fieldStmt = $pdo->prepare($fieldSql);
        
        foreach ($tableInfo['field_mappings'] as $index => $field) {
            $fieldStmt->execute([
                $trackingId,
                $index + 1,
                $field['persian_name'] ?? '',
                $field['english_name'] ?? '',
                $field['field_type'] ?? 'VARCHAR',
                $field['field_length'] ?? null,
                ($field['is_primary_key'] ?? false) ? 1 : 0,
                ($field['is_nullable'] ?? true) ? 1 : 0,
                $field['field_comment'] ?? ''
            ]);
        }
    }
    
    // Log success
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
        'create',
        1,
        1,
        0,
        0.5 // approximate processing time
    ]);
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Table created successfully',
        'tracking_id' => $trackingId,
        'table_name' => $tableInfo['table_name']
    ]);
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
    
} catch (Exception $e) {
    error_log("General error: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>