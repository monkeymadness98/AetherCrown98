"""
Report generation service
AI-powered business reports and summaries
"""

import logging
from datetime import datetime
from typing import Dict, Any

from database import supabase_client
from agents.worker import ReportsAgent

logger = logging.getLogger(__name__)

async def generate_ai_report(report_type: str = "daily_summary") -> Dict[str, Any]:
    """
    Generate AI-powered business report
    """
    logger.info(f"Generating AI report: {report_type}")
    
    try:
        # Use the Reports Agent to generate the report
        result = await ReportsAgent.generate_report({
            "report_type": report_type
        })
        
        # Store report metadata
        report_data = {
            "log_type": "ai_report",
            "entity_id": report_type,
            "action": "generated",
            "details": {
                "report_type": report_type,
                "status": result.get("status"),
                "summary": {
                    "sections": len(result.get("sections", {})),
                    "generated_at": result.get("generated_at")
                }
            },
            "level": "info",
            "created_at": datetime.now().isoformat()
        }
        
        supabase_client.table('activity_logs').insert(report_data).execute()
        
        logger.info(f"Report generated successfully: {report_type}")
        
        return result
        
    except Exception as e:
        logger.error(f"Report generation failed: {e}")
        return {
            "status": "error",
            "error": str(e)
        }

async def get_recent_reports(limit: int = 10) -> Dict[str, Any]:
    """Get recent generated reports"""
    try:
        response = supabase_client.table('activity_logs')\
            .select('*')\
            .eq('log_type', 'ai_report')\
            .order('created_at', desc=True)\
            .limit(limit)\
            .execute()
        
        return {
            "success": True,
            "reports": response.data or [],
            "count": len(response.data) if response.data else 0
        }
        
    except Exception as e:
        logger.error(f"Failed to retrieve reports: {e}")
        return {
            "success": False,
            "error": str(e)
        }
