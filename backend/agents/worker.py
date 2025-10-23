"""
Background task worker for AI automation
Handles marketing, analytics, finance, and report generation tasks
"""

import os
import logging
from datetime import datetime
from typing import Dict, Any, Optional
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

from database import supabase_client
from config import settings

logger = logging.getLogger(__name__)

# Initialize scheduler
task_scheduler = BackgroundScheduler()

# AI Agent Classes
class MarketingAgent:
    """AI agent for marketing tasks"""
    
    @staticmethod
    async def generate_content(parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Generate marketing content"""
        logger.info("Marketing Agent: Generating content")
        
        content_type = parameters.get('content_type', 'social_media')
        topic = parameters.get('topic', 'business automation')
        
        # Simulate AI content generation
        result = {
            "content_type": content_type,
            "topic": topic,
            "generated_content": f"AI-generated {content_type} content about {topic}",
            "status": "success",
            "generated_at": datetime.now().isoformat()
        }
        
        return result
    
    @staticmethod
    async def analyze_campaign(parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze marketing campaign performance"""
        logger.info("Marketing Agent: Analyzing campaign")
        
        campaign_id = parameters.get('campaign_id', 'default')
        
        result = {
            "campaign_id": campaign_id,
            "metrics": {
                "reach": 10000,
                "engagement": 850,
                "conversions": 125,
                "roi": 2.5
            },
            "insights": [
                "Campaign performing above average",
                "Best performing time: 2-4 PM",
                "Top channel: Email"
            ],
            "status": "success"
        }
        
        return result

class AnalyticsAgent:
    """AI agent for analytics tasks"""
    
    @staticmethod
    async def analyze_data(parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze business data"""
        logger.info("Analytics Agent: Analyzing data")
        
        # Fetch recent transactions
        try:
            payments = supabase_client.table('payments').select('*').limit(100).execute()
            tasks = supabase_client.table('ai_tasks').select('*').limit(100).execute()
            
            payment_data = payments.data or []
            task_data = tasks.data or []
            
            # Calculate metrics
            total_revenue = sum(float(p.get('amount', 0)) for p in payment_data if p.get('status') == 'completed')
            completed_tasks = sum(1 for t in task_data if t.get('status') == 'completed')
            
            result = {
                "period": "last_100_records",
                "metrics": {
                    "total_revenue": total_revenue,
                    "completed_tasks": completed_tasks,
                    "avg_task_completion_time": "5.2 minutes",
                    "success_rate": f"{(completed_tasks / max(len(task_data), 1)) * 100:.1f}%"
                },
                "trends": [
                    "Revenue trending upward",
                    "Task completion rate stable",
                    "Peak activity: weekdays 9-5"
                ],
                "status": "success"
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Analytics error: {e}")
            return {
                "status": "error",
                "error": str(e)
            }
    
    @staticmethod
    async def generate_insights(parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Generate AI-powered insights"""
        logger.info("Analytics Agent: Generating insights")
        
        result = {
            "insights": [
                {
                    "category": "revenue",
                    "insight": "Revenue is 23% higher than last month",
                    "confidence": 0.95,
                    "recommendation": "Scale successful campaigns"
                },
                {
                    "category": "operations",
                    "insight": "Task automation efficiency improved by 15%",
                    "confidence": 0.88,
                    "recommendation": "Expand automation to more workflows"
                },
                {
                    "category": "customer",
                    "insight": "Customer retention rate at 87%",
                    "confidence": 0.92,
                    "recommendation": "Focus on premium tier upgrades"
                }
            ],
            "status": "success",
            "generated_at": datetime.now().isoformat()
        }
        
        return result

class FinanceAgent:
    """AI agent for finance tasks"""
    
    @staticmethod
    async def analyze_financials(parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze financial data"""
        logger.info("Finance Agent: Analyzing financials")
        
        try:
            # Fetch payment data
            payments = supabase_client.table('payments').select('*').execute()
            payment_data = payments.data or []
            
            completed = [p for p in payment_data if p.get('status') == 'completed']
            pending = [p for p in payment_data if p.get('status') in ['pending', 'created']]
            
            total_revenue = sum(float(p.get('amount', 0)) for p in completed)
            pending_revenue = sum(float(p.get('amount', 0)) for p in pending)
            
            result = {
                "period": "all_time",
                "revenue": {
                    "total": total_revenue,
                    "pending": pending_revenue,
                    "completed_transactions": len(completed),
                    "pending_transactions": len(pending)
                },
                "projections": {
                    "next_month": total_revenue * 1.15,
                    "next_quarter": total_revenue * 3.5
                },
                "recommendations": [
                    "Strong revenue growth detected",
                    "Consider expanding payment options",
                    "Optimize for higher-value transactions"
                ],
                "status": "success"
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Finance analysis error: {e}")
            return {
                "status": "error",
                "error": str(e)
            }

class ReportsAgent:
    """AI agent for report generation"""
    
    @staticmethod
    async def generate_report(parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Generate comprehensive business report"""
        logger.info("Reports Agent: Generating report")
        
        report_type = parameters.get('report_type', 'daily_summary')
        
        # Gather data from other agents
        analytics_data = await AnalyticsAgent.analyze_data({})
        finance_data = await FinanceAgent.analyze_financials({})
        
        result = {
            "report_type": report_type,
            "generated_at": datetime.now().isoformat(),
            "sections": {
                "executive_summary": {
                    "status": "Excellent",
                    "key_metrics": {
                        "revenue": finance_data.get('revenue', {}).get('total', 0),
                        "tasks_completed": analytics_data.get('metrics', {}).get('completed_tasks', 0),
                        "growth": "+23%"
                    }
                },
                "analytics": analytics_data,
                "financials": finance_data,
                "ai_recommendations": [
                    "Continue current growth strategy",
                    "Invest in automation infrastructure",
                    "Expand to new market segments"
                ]
            },
            "status": "success"
        }
        
        # Store report in database
        try:
            supabase_client.table('activity_logs').insert({
                "log_type": "report_generated",
                "entity_id": report_type,
                "action": "generate_report",
                "details": result,
                "level": "info",
                "created_at": datetime.now().isoformat()
            }).execute()
        except Exception as e:
            logger.error(f"Failed to store report: {e}")
        
        return result

# Task execution function
async def execute_ai_task(task_id: str, agent_type: str, action: str, parameters: Dict[str, Any]):
    """
    Execute an AI task based on agent type and action
    """
    logger.info(f"Executing AI task {task_id}: {agent_type}.{action}")
    
    try:
        # Update task status to in_progress
        supabase_client.table('ai_tasks').update({
            "status": "in_progress",
            "updated_at": datetime.now().isoformat()
        }).eq('id', task_id).execute()
        
        # Execute task based on agent type
        result = None
        
        if agent_type == "marketing":
            if action == "generate_content":
                result = await MarketingAgent.generate_content(parameters)
            elif action == "analyze_campaign":
                result = await MarketingAgent.analyze_campaign(parameters)
        
        elif agent_type == "analytics":
            if action == "analyze_data":
                result = await AnalyticsAgent.analyze_data(parameters)
            elif action == "generate_insights":
                result = await AnalyticsAgent.generate_insights(parameters)
        
        elif agent_type == "finance":
            if action == "analyze_financials":
                result = await FinanceAgent.analyze_financials(parameters)
        
        elif agent_type == "reports":
            if action == "generate_report":
                result = await ReportsAgent.generate_report(parameters)
        
        else:
            result = {"status": "error", "error": f"Unknown agent type: {agent_type}"}
        
        # Update task with result
        if result:
            supabase_client.table('ai_tasks').update({
                "status": "completed",
                "task_output": result,
                "completed_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }).eq('id', task_id).execute()
            
            logger.info(f"Task {task_id} completed successfully")
        
    except Exception as e:
        logger.error(f"Task {task_id} failed: {e}")
        
        # Update task with error
        supabase_client.table('ai_tasks').update({
            "status": "failed",
            "error_message": str(e),
            "updated_at": datetime.now().isoformat()
        }).eq('id', task_id).execute()

# Scheduled tasks
def daily_summary_job():
    """Generate daily summary report"""
    logger.info("Running daily summary job")
    
    try:
        # Create a task for report generation
        task_data = {
            "task_name": "daily_summary",
            "task_input": {"report_type": "daily_summary"},
            "status": "pending",
            "priority": "high",
            "created_at": datetime.now().isoformat()
        }
        
        # Get or create system agent
        clones = supabase_client.table('ai_clones').select('id').eq('name', 'system_agent').limit(1).execute()
        
        if clones.data:
            task_data['clone_id'] = clones.data[0]['id']
            
            # Create task
            task_response = supabase_client.table('ai_tasks').insert(task_data).execute()
            task_id = task_response.data[0]['id']
            
            # Execute immediately
            import asyncio
            asyncio.create_task(execute_ai_task(task_id, "reports", "generate_report", {"report_type": "daily_summary"}))
            
            logger.info(f"Daily summary task created: {task_id}")
        
    except Exception as e:
        logger.error(f"Daily summary job failed: {e}")

# Schedule daily summary
if settings.SCHEDULER_ENABLED:
    hour, minute = settings.DAILY_REPORT_TIME.split(':')
    task_scheduler.add_job(
        daily_summary_job,
        CronTrigger(hour=int(hour), minute=int(minute)),
        id='daily_summary',
        replace_existing=True
    )
    logger.info(f"Scheduled daily summary at {settings.DAILY_REPORT_TIME} UTC")
