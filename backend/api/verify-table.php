<?php
/**
 * API for verifying table creation and data
 * API بررسی ایجاد جدول و داده‌ها
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    $tableName = $_GET['table'] ?? '';
    
    if (empty($tableName)) {
        throw new Exception('Table name is required');
    }
    
    // Sanitize table name
    $tableName = preg_replace('/[^a-zA-Z0-9_]/', '', $tableName);
    
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
    
    // Check if table exists
    $stmt = $pdo->prepare("SHOW TABLES LIKE ?");
    $stmt->execute([$tableName]);
    $tableExists = $stmt->fetch() !== false;
    
    if (!$tableExists) {
        throw new Exception("Table '{$tableName}' does not exist");
    }
    
    // Get table structure
    $stmt = $pdo->prepare("DESCRIBE `{$tableName}`");
    $stmt->execute();
    $structure = $stmt->fetchAll();
    
    // Get table data
    $stmt = $pdo->prepare("SELECT * FROM `{$tableName}` LIMIT 10");
    $stmt->execute();
    $data = $stmt->fetchAll();
    
    // Get row count
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM `{$tableName}`");
    $stmt->execute();
    $count = $stmt->fetch()['count'];
    
    // Return verification result
    echo json_encode([
        'success' => true,
        'table_name' => $tableName,
        'table_exists' => true,
        'structure' => $structure,
        'sample_data' => $data,
        'total_rows' => $count,
        'message' => 'Table verified successfully'
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>