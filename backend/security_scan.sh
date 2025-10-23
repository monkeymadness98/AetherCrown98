#!/bin/bash
# Security scanning script using bandit and safety

echo "🔒 Running Security Scans for AetherCrown98 Backend"
echo "=================================================="

# Check if Python dependencies are installed
if ! command -v bandit &> /dev/null; then
    echo "Installing bandit..."
    pip install bandit
fi

if ! command -v safety &> /dev/null; then
    echo "Installing safety..."
    pip install safety
fi

# Run Bandit security scan
echo ""
echo "📋 Running Bandit - Python security linter"
echo "----------------------------------------"
bandit -r backend/ -f json -o bandit-report.json 2>/dev/null
bandit -r backend/ -f screen || echo "Bandit scan completed with findings"

# Run Safety check for vulnerable dependencies
echo ""
echo "🛡️  Running Safety - Dependency vulnerability check"
echo "---------------------------------------------------"
if [ -f "backend/requirements.txt" ]; then
    safety check -r backend/requirements.txt --json > safety-report.json 2>/dev/null || echo "Safety check completed"
    safety check -r backend/requirements.txt || echo "Safety scan completed with findings"
else
    echo "⚠️  No requirements.txt found, skipping Safety check"
fi

# Generate summary
echo ""
echo "📊 Security Scan Summary"
echo "========================"

if [ -f "bandit-report.json" ]; then
    echo "✅ Bandit report: bandit-report.json"
fi

if [ -f "safety-report.json" ]; then
    echo "✅ Safety report: safety-report.json"
fi

echo ""
echo "🎉 Security scans completed!"
echo ""
echo "📝 Next steps:"
echo "  1. Review reports for any critical issues"
echo "  2. Update vulnerable dependencies"
echo "  3. Fix security findings in code"
echo "  4. Re-run scans to verify fixes"
