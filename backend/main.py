"""
AetherCrown98 Backend API
FastAPI application with health checks, error tracking, and caching
"""
import os
from typing import Optional
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import redis
from datetime import datetime

# Initialize Sentry for error tracking
sentry_dsn = os.getenv("SENTRY_DSN")
if sentry_dsn:
    sentry_sdk.init(
        dsn=sentry_dsn,
        integrations=[FastApiIntegration()],
        traces_sample_rate=1.0,
        environment=os.getenv("ENVIRONMENT", "production")
    )

# Initialize Redis for caching and rate limiting
redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
try:
    redis_client = redis.from_url(redis_url, decode_responses=True)
    redis_available = redis_client.ping()
except Exception:
    redis_client = None
    redis_available = False

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address, storage_uri=redis_url if redis_available else "memory://")

# Create FastAPI app
app = FastAPI(
    title="AetherCrown98 Backend API",
    description="Autonomous AI-driven business empire backend",
    version="1.0.0"
)

# Add rate limiting error handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
@limiter.limit("10/minute")
async def root(request: Request):
    """Root endpoint"""
    return {
        "message": "AetherCrown98 Backend API",
        "version": "1.0.0",
        "status": "operational"
    }

@app.get("/api/health")
async def health_check():
    """
    Health check endpoint with comprehensive system status.
    Used by Render for auto-restart and monitoring services.
    """
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "aethercrown98-backend",
        "version": "1.0.0",
        "checks": {
            "api": "ok",
            "redis": "ok" if redis_available else "unavailable",
            "sentry": "ok" if sentry_dsn else "not_configured"
        }
    }
    
    # If critical services are down, return 503
    if not redis_available and os.getenv("REDIS_REQUIRED", "false").lower() == "true":
        health_status["status"] = "degraded"
        health_status["checks"]["redis"] = "failed"
        return JSONResponse(status_code=503, content=health_status)
    
    return health_status

@app.get("/api/health/ready")
async def readiness_check():
    """
    Readiness check - indicates if service is ready to accept traffic
    """
    return {
        "ready": True,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/health/live")
async def liveness_check():
    """
    Liveness check - indicates if service is alive
    """
    return {
        "alive": True,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/test-error")
@limiter.limit("5/minute")
async def test_error(request: Request):
    """
    Test endpoint to verify Sentry error tracking
    Only for development/testing
    """
    if os.getenv("ENVIRONMENT") == "production":
        raise HTTPException(status_code=404, detail="Not found")
    
    raise Exception("Test error for Sentry tracking")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler to catch and log all unhandled exceptions
    """
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": str(exc) if os.getenv("DEBUG") == "true" else "An error occurred",
            "timestamp": datetime.utcnow().isoformat()
        }
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
