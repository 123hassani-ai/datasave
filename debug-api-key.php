<?php
/**
 * Debug API Key Issues
 */

// Read API key from file
$apiKeyFile = __DIR__ . '/Docs/Prompts/api-openai.txt';

echo "=== API Key Debug Information ===\n";

if (!file_exists($apiKeyFile)) {
    die("API key file not found: " . $apiKeyFile . "\n");
}

echo "File exists: YES\n";
echo "File size: " . filesize($apiKeyFile) . " bytes\n";

// Read raw content
$rawContent = file_get_contents($apiKeyFile);
echo "Raw content length: " . strlen($rawContent) . " characters\n";
echo "Raw content bytes: " . strlen($rawContent) . "\n";

// Display raw content in hex
echo "Raw content (hex): ";
for ($i = 0; $i < min(strlen($rawContent), 20); $i++) {
    echo sprintf("%02x ", ord($rawContent[$i]));
}
echo "\n";

// Trim and clean
$trimmedContent = trim($rawContent);
echo "Trimmed content length: " . strlen($trimmedContent) . " characters\n";

$cleanApiKey = str_replace(["\n", "\r", "\t", " "], "", $trimmedContent);
echo "Cleaned content length: " . strlen($cleanApiKey) . " characters\n";

// Display cleaned content in hex
echo "Cleaned content (hex): ";
for ($i = 0; $i < min(strlen($cleanApiKey), 20); $i++) {
    echo sprintf("%02x ", ord($cleanApiKey[$i]));
}
echo "\n";

// Check if it starts with sk-
if (strpos($cleanApiKey, 'sk-') === 0) {
    echo "Starts with 'sk-': YES\n";
} else {
    echo "Starts with 'sk-': NO\n";
}

// Display key preview
echo "Key preview: " . substr($cleanApiKey, 0, 20) . "..." . substr($cleanApiKey, -5) . "\n";

// Test with curl
echo "\n=== Testing with cURL ===\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.openai.com/v1/models');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $cleanApiKey
]);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_VERBOSE, true);
curl_setopt($ch, CURLOPT_HEADER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);

curl_close($ch);

echo "HTTP Status Code: " . $httpCode . "\n";
echo "Response headers:\n" . substr($response, 0, $headerSize) . "\n";
echo "Response body preview:\n" . substr($response, $headerSize, 500) . "\n";