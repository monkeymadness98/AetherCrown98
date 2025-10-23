"""
Database connection and utilities
"""

import os
from supabase import create_client, Client
from config import settings

# Initialize Supabase client
supabase_client: Client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_KEY
)

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
