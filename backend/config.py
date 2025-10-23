"""
Configuration settings for AetherCrown98 Backend
"""

import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """Application settings"""
    
    # API Configuration
    API_TITLE: str = "AetherCrown98 API"
    API_VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"
    
    # Environment
    ENVIRONMENT: str = os.getenv("NODE_ENV", "development")
    DEBUG: bool = ENVIRONMENT == "development"
    PORT: int = int(os.getenv("PORT", 8000))
    
    # Supabase
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    
    # OpenAI
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4")
    
    # PayPal
    PAYPAL_CLIENT_ID: str = os.getenv("PAYPAL_CLIENT_ID", "")
    PAYPAL_CLIENT_SECRET: str = os.getenv("PAYPAL_CLIENT_SECRET", "")
    PAYPAL_MODE: str = "sandbox" if ENVIRONMENT != "production" else "live"
    
    # Stripe (fallback)
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "")
    STRIPE_PUBLISHABLE_KEY: str = os.getenv("STRIPE_PUBLISHABLE_KEY", "")
    
    # CORS
    CORS_ORIGINS: list = [
        "https://aethercrown98.vercel.app",
        "http://localhost:3000",
        "http://localhost:3001",
    ]
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FORMAT: str = "json"
    
    # Task Scheduler
    SCHEDULER_ENABLED: bool = True
    DAILY_REPORT_TIME: str = "09:00"  # UTC time for daily reports
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
