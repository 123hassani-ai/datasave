#!/bin/bash

# Test OpenAI API Key
echo "Testing OpenAI API Key..."

# Read API key from file
API_KEY=$(cat Docs/Prompts/api-openai.txt | tr -d '\n\r ')

echo "API Key Length: ${#API_KEY}"
echo "API Key Preview: ${API_KEY:0:20}...${API_KEY: -5}"

# Test models endpoint
echo "Testing models endpoint..."
curl -s -w "\nHTTP Status: %{http_code}\n" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  https://api.openai.com/v1/models | head -20

echo ""
echo "Testing chat completions endpoint..."
curl -s -w "\nHTTP Status: %{http_code}\n" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Say hello in Persian"}],
    "max_tokens": 50
  }' \
  https://api.openai.com/v1/chat/completions | head -20