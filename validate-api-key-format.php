<?php
/**
 * Validate API Key Format
 */

// Read API key from file
$apiKeyFile = __DIR__ . '/Docs/Prompts/api-openai.txt';

if (!file_exists($apiKeyFile)) {
    die("API key file not found: " . $apiKeyFile . "\n");
}

$apiKey = trim(file_get_contents($apiKeyFile));
$cleanApiKey = str_replace(["\n", "\r", "\t", " "], "", $apiKey);

echo "=== API Key Format Validation ===\n";
echo "Key Length: " . strlen($cleanApiKey) . "\n";
echo "Starts with 'sk-': " . (strpos($cleanApiKey, 'sk-') === 0 ? 'YES' : 'NO') . "\n";
echo "Contains only valid characters: " . (preg_match('/^[a-zA-Z0-9\-_]+$/', $cleanApiKey) ? 'YES' : 'NO') . "\n";

// Check key structure
$parts = explode('-', $cleanApiKey);
echo "Number of parts: " . count($parts) . "\n";

if (count($parts) >= 3) {
    echo "Prefix: " . $parts[0] . "\n";
    echo "Project identifier: " . $parts[1] . "\n";
    echo "Last part length: " . strlen($parts[count($parts)-1]) . "\n";
}

// Check for common issues
if (strlen($cleanApiKey) < 50) {
    echo "WARNING: Key seems too short\n";
}

if (strlen($cleanApiKey) > 200) {
    echo "WARNING: Key seems too long\n";
}

echo "\n=== Key Preview ===\n";
echo "First 30 characters: " . substr($cleanApiKey, 0, 30) . "\n";
echo "Last 10 characters: " . substr($cleanApiKey, -10) . "\n";

// Try to create a new key with the same format (for testing purposes)
echo "\n=== Key Format Analysis ===\n";
echo "Key pattern: ";
for ($i = 0; $i < strlen($cleanApiKey); $i++) {
    $char = $cleanApiKey[$i];
    if (ctype_alpha($char)) {
        echo "L"; // Letter
    } else if (ctype_digit($char)) {
        echo "D"; // Digit
    } else if ($char == '-') {
        echo "-"; // Hyphen
    } else if ($char == '_') {
        echo "_"; // Underscore
    } else {
        echo "?"; // Unknown
    }
    
    // Add space every 10 characters for readability
    if (($i + 1) % 10 == 0) {
        echo " ";
    }
}
echo "\n";