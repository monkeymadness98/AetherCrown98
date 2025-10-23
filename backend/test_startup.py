#!/usr/bin/env python3
"""
Test script to verify backend can start without errors
"""

import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

def test_imports():
    """Test that all required modules can be imported"""
    print("Testing imports...")
    
    try:
        import fastapi
        print("✓ FastAPI imported")
        
        import supabase
        print("✓ Supabase imported")
        
        import openai
        print("✓ OpenAI imported")
        
        from config import settings
        print("✓ Config imported")
        
        from database import supabase_client
        print("✓ Database module imported")
        
        from agents.worker import task_scheduler
        print("✓ Worker module imported")
        
        from services.payment_service import create_payment_order
        print("✓ Payment service imported")
        
        from services.report_service import generate_ai_report
        print("✓ Report service imported")
        
        return True
    except Exception as e:
        print(f"✗ Import error: {e}")
        return False

def test_config():
    """Test configuration settings"""
    print("\nTesting configuration...")
    
    try:
        from config import settings
        
        print(f"  Environment: {settings.ENVIRONMENT}")
        print(f"  Debug mode: {settings.DEBUG}")
        print(f"  API version: {settings.API_VERSION}")
        print(f"  Port: {settings.PORT}")
        print(f"  Supabase URL configured: {bool(settings.SUPABASE_URL)}")
        print(f"  PayPal mode: {settings.PAYPAL_MODE}")
        print(f"  Scheduler enabled: {settings.SCHEDULER_ENABLED}")
        
        return True
    except Exception as e:
        print(f"✗ Config error: {e}")
        return False

def test_app_creation():
    """Test that FastAPI app can be created"""
    print("\nTesting FastAPI app creation...")
    
    try:
        # Suppress startup logs
        import logging
        logging.getLogger("uvicorn").setLevel(logging.ERROR)
        
        from main import app
        
        print("✓ FastAPI app created successfully")
        print(f"  Title: {app.title}")
        print(f"  Version: {app.version}")
        print(f"  Routes: {len(app.routes)}")
        
        return True
    except Exception as e:
        print(f"✗ App creation error: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Run all tests"""
    print("="*60)
    print("AetherCrown98 Backend Startup Test")
    print("="*60)
    
    results = []
    
    results.append(("Imports", test_imports()))
    results.append(("Configuration", test_config()))
    results.append(("App Creation", test_app_creation()))
    
    print("\n" + "="*60)
    print("Test Results:")
    print("="*60)
    
    for test_name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{test_name:20} {status}")
    
    all_passed = all(result for _, result in results)
    
    print("="*60)
    if all_passed:
        print("✓ All tests passed! Backend is ready to run.")
        return 0
    else:
        print("✗ Some tests failed. Please check errors above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
