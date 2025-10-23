"""
AetherCrown98 Backend API
FastAPI-based AI automation API with Supabase, OpenAI, and PayPal integrations
"""

import os
import logging
from datetime import datetime
from typing import Optional, Dict, Any
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Import custom modules
from config import settings
from database import supabase_client
from agents.worker import task_scheduler, execute_ai_task
from utils.logging_config import setup_logging, get_logger

# Load environment variables
load_dotenv()

# Setup logging
setup_logging()
logger = get_logger(__name__)

# Lifespan context manager for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    logger.info("🚀 Starting AetherCrown98 Backend API")
    # Start background task scheduler
    task_scheduler.start()
    logger.info("✅ Background task scheduler started")
    yield
    # Shutdown
    logger.info("🛑 Shutting down AetherCrown98 Backend API")
    task_scheduler.shutdown()
    logger.info("✅ Background task scheduler stopped")

# Create FastAPI app
app = FastAPI(
    title="AetherCrown98 API",
    description="AI-Driven Business Empire Backend",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://aethercrown98.vercel.app",
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response Models
class HealthResponse(BaseModel):
    status: str
    timestamp: str
    version: str
    services: Dict[str, Any]
    uptime_seconds: float

class TaskCreateRequest(BaseModel):
    clone_id: str
    task_name: str
    task_input: Optional[Dict[str, Any]] = {}
    priority: str = Field(default="medium", pattern="^(low|medium|high)$")

class TaskResponse(BaseModel):
    success: bool
    task_id: Optional[str] = None
    status: Optional[str] = None
    message: str

class AIAgentRequest(BaseModel):
    agent_type: str = Field(..., pattern="^(marketing|analytics|finance|reports)$")
    action: str
    parameters: Optional[Dict[str, Any]] = {}

class PaymentCreateRequest(BaseModel):
    amount: float = Field(..., gt=0)
    currency: str = "USD"
    description: str = "AetherCrown98 Payment"
    user_id: Optional[str] = None

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "AetherCrown98 Backend API",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs"
    }

# Health check endpoint
@app.get("/healthz", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint for monitoring
    Checks API, database, and service status
    """
    start_time = datetime.now()
    
    services_status = {
        "api": {"status": "operational", "message": "API is running"},
        "database": {"status": "unknown", "message": "Checking..."},
        "scheduler": {"status": "operational" if task_scheduler.running else "stopped"}
    }
    
    # Check database connection
    try:
        response = supabase_client.table('users').select('count').limit(1).execute()
        services_status["database"] = {
            "status": "operational",
            "message": "Connected to Supabase"
        }
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        services_status["database"] = {
            "status": "degraded",
            "message": str(e)
        }
    
    response_time = (datetime.now() - start_time).total_seconds()
    
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now().isoformat(),
        version="1.0.0",
        services=services_status,
        uptime_seconds=response_time
    )

# Metrics endpoint for Prometheus
@app.get("/metrics")
async def metrics():
    """
    Prometheus-compatible metrics endpoint
    """
    try:
        # Get task statistics
        tasks_response = supabase_client.table('ai_tasks').select('status').execute()
        tasks = tasks_response.data or []
        
        task_counts = {
            "pending": sum(1 for t in tasks if t.get('status') == 'pending'),
            "in_progress": sum(1 for t in tasks if t.get('status') == 'in_progress'),
            "completed": sum(1 for t in tasks if t.get('status') == 'completed'),
            "failed": sum(1 for t in tasks if t.get('status') == 'failed'),
        }
        
        # Get payment statistics
        payments_response = supabase_client.table('payments').select('amount,status').execute()
        payments = payments_response.data or []
        
        total_revenue = sum(float(p.get('amount', 0)) for p in payments if p.get('status') == 'completed')
        
        metrics_data = {
            "tasks_total": len(tasks),
            "tasks_pending": task_counts["pending"],
            "tasks_in_progress": task_counts["in_progress"],
            "tasks_completed": task_counts["completed"],
            "tasks_failed": task_counts["failed"],
            "payments_total": len(payments),
            "revenue_total": total_revenue,
            "scheduler_running": task_scheduler.running
        }
        
        return JSONResponse(content=metrics_data)
        
    except Exception as e:
        logger.error(f"Metrics collection failed: {e}")
        raise HTTPException(status_code=500, detail=f"Metrics collection failed: {str(e)}")

# AI Agent endpoint
@app.post("/ai_agent")
async def ai_agent_endpoint(request: AIAgentRequest, background_tasks: BackgroundTasks):
    """
    AI Agent task delegation endpoint
    Accepts agent type and action to perform
    """
    logger.info(f"AI Agent request: {request.agent_type} - {request.action}")
    
    try:
        # Create task in database
        task_data = {
            "task_name": f"{request.agent_type}_{request.action}",
            "task_input": {
                "agent_type": request.agent_type,
                "action": request.action,
                "parameters": request.parameters
            },
            "status": "pending",
            "priority": "high",
            "created_at": datetime.now().isoformat()
        }
        
        # If we don't have a clone_id, create a system agent entry
        clones_response = supabase_client.table('ai_clones').select('id').eq('name', 'system_agent').limit(1).execute()
        
        if not clones_response.data:
            # Create system agent
            clone_response = supabase_client.table('ai_clones').insert({
                "name": "system_agent",
                "description": "System AI agent for automated tasks",
                "model_type": "gpt-4",
                "status": "active",
                "created_at": datetime.now().isoformat()
            }).execute()
            clone_id = clone_response.data[0]['id']
        else:
            clone_id = clones_response.data[0]['id']
        
        task_data['clone_id'] = clone_id
        
        # Insert task
        task_response = supabase_client.table('ai_tasks').insert(task_data).execute()
        task_id = task_response.data[0]['id']
        
        # Execute task in background
        background_tasks.add_task(execute_ai_task, task_id, request.agent_type, request.action, request.parameters)
        
        logger.info(f"AI Agent task created: {task_id}")
        
        return {
            "success": True,
            "task_id": task_id,
            "agent_type": request.agent_type,
            "action": request.action,
            "status": "queued",
            "message": "AI agent task queued for execution"
        }
        
    except Exception as e:
        logger.error(f"AI Agent endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Task assignment endpoint
@app.post("/tasks/assign", response_model=TaskResponse)
async def assign_task(request: TaskCreateRequest, background_tasks: BackgroundTasks):
    """
    Assign a new task to an AI clone
    """
    logger.info(f"Task assignment: {request.task_name} for clone {request.clone_id}")
    
    try:
        # Validate clone exists
        clone_response = supabase_client.table('ai_clones').select('id,status').eq('id', request.clone_id).execute()
        
        if not clone_response.data:
            raise HTTPException(status_code=404, detail="Clone not found")
        
        if clone_response.data[0].get('status') != 'active':
            raise HTTPException(status_code=400, detail="Clone is not active")
        
        # Create task
        task_data = {
            "clone_id": request.clone_id,
            "task_name": request.task_name,
            "task_input": request.task_input,
            "status": "pending",
            "priority": request.priority,
            "created_at": datetime.now().isoformat()
        }
        
        task_response = supabase_client.table('ai_tasks').insert(task_data).execute()
        task_id = task_response.data[0]['id']
        
        # Queue task for execution
        background_tasks.add_task(execute_ai_task, task_id, "general", "execute", request.task_input)
        
        logger.info(f"Task assigned successfully: {task_id}")
        
        return TaskResponse(
            success=True,
            task_id=task_id,
            status="pending",
            message="Task assigned successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Task assignment error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Task status endpoint
@app.get("/tasks/status/{task_id}")
async def get_task_status(task_id: str):
    """
    Get the status of a specific task
    """
    try:
        task_response = supabase_client.table('ai_tasks').select('*').eq('id', task_id).execute()
        
        if not task_response.data:
            raise HTTPException(status_code=404, detail="Task not found")
        
        task = task_response.data[0]
        
        return {
            "success": True,
            "task": {
                "id": task['id'],
                "task_name": task['task_name'],
                "status": task['status'],
                "priority": task.get('priority', 'medium'),
                "created_at": task['created_at'],
                "updated_at": task.get('updated_at'),
                "completed_at": task.get('completed_at'),
                "task_output": task.get('task_output', {}),
                "error_message": task.get('error_message')
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Task status retrieval error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Payment creation endpoint
@app.post("/payments/create")
async def create_payment(request: PaymentCreateRequest):
    """
    Create a new payment order
    """
    logger.info(f"Creating payment: {request.amount} {request.currency}")
    
    try:
        from services.payment_service import create_payment_order
        
        result = await create_payment_order(
            amount=request.amount,
            currency=request.currency,
            description=request.description,
            user_id=request.user_id
        )
        
        return result
        
    except Exception as e:
        logger.error(f"Payment creation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Payment webhook endpoint
@app.post("/payments/webhook")
async def payment_webhook(request: Request):
    """
    Handle payment provider webhooks
    """
    logger.info("Payment webhook received")
    
    try:
        body = await request.json()
        
        # Log webhook for debugging
        logger.info(f"Webhook payload: {body}")
        
        # Store webhook in activity logs
        log_data = {
            "log_type": "payment_webhook",
            "entity_id": body.get('order_id', 'unknown'),
            "action": "webhook_received",
            "details": body,
            "level": "info",
            "created_at": datetime.now().isoformat()
        }
        
        supabase_client.table('activity_logs').insert(log_data).execute()
        
        # Process webhook based on event type
        event_type = body.get('event_type') or body.get('type')
        
        if event_type in ['PAYMENT.CAPTURE.COMPLETED', 'payment_intent.succeeded']:
            # Update payment status
            order_id = body.get('order_id') or body.get('resource', {}).get('id')
            
            if order_id:
                supabase_client.table('payments').update({
                    "status": "completed",
                    "completed_at": datetime.now().isoformat(),
                    "updated_at": datetime.now().isoformat(),
                    "metadata": body
                }).eq('order_id', order_id).execute()
                
                logger.info(f"Payment completed: {order_id}")
        
        return {"success": True, "message": "Webhook processed"}
        
    except Exception as e:
        logger.error(f"Webhook processing error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Report generation endpoint
@app.post("/reports/generate")
async def generate_report(background_tasks: BackgroundTasks, report_type: str = "daily_summary"):
    """
    Generate AI-powered business reports
    """
    logger.info(f"Generating report: {report_type}")
    
    try:
        from services.report_service import generate_ai_report
        
        # Queue report generation
        background_tasks.add_task(generate_ai_report, report_type)
        
        return {
            "success": True,
            "report_type": report_type,
            "status": "generating",
            "message": f"{report_type} report generation started"
        }
        
    except Exception as e:
        logger.error(f"Report generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "message": str(exc)
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True
    )
