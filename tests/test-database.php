<?php
/**
 * Test Database Connection for DataSave Project
 */

require_once 'backend/config/database.php';

try {
    echo "=== DataSave Database Connection Test ===\n\n";
    
    // Test database connection
    $db = Database::getInstance();
    echo "✓ Database connection successful!\n";
    
    // Get server info
    $serverInfo = $db->getServerInfo();
    echo "✓ MySQL Version: " . $serverInfo['version'] . "\n";
    
    // Test connection status
    if ($db->isConnected()) {
        echo "✓ Database connection is active\n";
    }
    
    echo "\n=== Database Information ===\n";
    echo "Host: " . DB_HOST . "\n";
    echo "Port: " . DB_PORT . "\n";
    echo "Database: " . DB_NAME . "\n";
    echo "User: " . DB_USER . "\n";
    
    echo "\n=== Testing Queries ===\n";
    
    // Test tables
    $stmt = $db->query("SHOW TABLES");
    $tables = $stmt->fetchAll();
    echo "✓ Tables found: " . count($tables) . "\n";
    
    foreach ($tables as $table) {
        $tableName = array_values($table)[0];
        echo "  - " . $tableName . "\n";
    }
    
    // Test user groups
    $stmt = $db->query("SELECT COUNT(*) as count FROM ai_user_groups");
    $groupCount = $stmt->fetch()['count'];
    echo "✓ User groups: " . $groupCount . "\n";
    
    // Test users
    $stmt = $db->query("SELECT COUNT(*) as count FROM ai_users WHERE deleted_at IS NULL");
    $userCount = $stmt->fetch()['count'];
    echo "✓ Users: " . $userCount . "\n";
    
    // Test admin user
    $stmt = $db->query("SELECT username, email, full_name FROM ai_users WHERE username = 'admin'");
    $admin = $stmt->fetch();
    if ($admin) {
        echo "✓ Admin user found: " . $admin['username'] . " (" . $admin['email'] . ")\n";
        echo "  Full name: " . $admin['full_name'] . "\n";
    }
    
    echo "\n🎉 Database setup completed successfully!\n";
    echo "Default login credentials:\n";
    echo "Username: admin\n";
    echo "Password: admin123\n";
    echo "Email: admin@datasave.local\n";
    
} catch (Exception $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n";
    exit(1);
}
?>