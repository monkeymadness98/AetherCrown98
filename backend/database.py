"""
Database connection and utilities
"""

import os
import logging
from typing import Optional
from supabase import create_client, Client
from config import settings

logger = logging.getLogger(__name__)

# Supabase client instance
_supabase_client: Optional[Client] = None

def init_supabase() -> Optional[Client]:
    """Initialize Supabase client with error handling"""
    global _supabase_client
    
    if _supabase_client is not None:
        return _supabase_client
    
    # Check if credentials are configured
    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
        logger.warning("Supabase credentials not configured")
        return None
    
    # Validate key format (should start with eyJ for JWT)
    if not settings.SUPABASE_KEY.startswith('eyJ'):
        logger.warning("Supabase key format appears invalid")
        return None
    
    try:
        _supabase_client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_KEY
        )
        logger.info("Supabase client initialized successfully")
        return _supabase_client
    except Exception as e:
        logger.error(f"Failed to initialize Supabase client: {e}")
        return None

# Initialize on module import
supabase_client = init_supabase()

def get_supabase_client() -> Optional[Client]:
    """Get Supabase client instance"""
    if supabase_client is None:
        return init_supabase()
    return supabase_client

async def test_database_connection():
    """Test database connection"""
    try:
        response = supabase_client.table('users').select('count').limit(1).execute()
        return {"success": True, "message": "Database connection successful"}
    except Exception as e:
        return {"success": False, "error": str(e)}

def get_supabase_client() -> Client:
    """Get Supabase client instance"""
    return supabase_client
