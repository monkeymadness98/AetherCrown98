#!/bin/bash
# Test script for AetherCrown98 Backend API
# Usage: ./test-backend.sh [backend-url]
# Example: ./test-backend.sh http://localhost:8000
# Example: ./test-backend.sh https://aethercrown98-backend.onrender.com

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend URL (default to localhost)
BACKEND_URL="${1:-http://localhost:8000}"

echo -e "${YELLOW}Testing AetherCrown98 Backend API${NC}"
echo -e "${YELLOW}Backend URL: ${BACKEND_URL}${NC}"
echo ""

# Function to test endpoint
test_endpoint() {
    local endpoint=$1
    local description=$2
    
    echo -n "Testing ${description}... "
    
    if response=$(curl -s -f "${BACKEND_URL}${endpoint}"); then
        echo -e "${GREEN}✓ PASSED${NC}"
        echo "  Response: ${response}" | head -c 100
        echo ""
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        return 1
    fi
}

# Run tests
echo -e "${YELLOW}Running API Tests...${NC}"
echo ""

test_endpoint "/" "Root endpoint"
test_endpoint "/health" "Health check"
test_endpoint "/api/metrics" "Metrics endpoint"
test_endpoint "/api/insights" "Insights endpoint"
test_endpoint "/api/analytics" "Analytics endpoint"

echo ""
echo -e "${YELLOW}Testing documentation endpoints...${NC}"
test_endpoint "/docs" "Swagger docs"
test_endpoint "/redoc" "ReDoc docs"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}All tests passed! Backend is working! ✓${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}API Documentation:${NC}"
echo "  Swagger UI: ${BACKEND_URL}/docs"
echo "  ReDoc: ${BACKEND_URL}/redoc"
echo ""
