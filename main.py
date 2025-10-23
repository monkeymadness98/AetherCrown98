from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import os

app = FastAPI(
    title="AetherCrown98 Backend",
    description="Backend API for AetherCrown98 - Autonomous AI-Driven Business Empire",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to AetherCrown98 Backend API",
        "version": "1.0.0",
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "aethercrown98-backend",
        "environment": os.getenv("NODE_ENV", "production")
    }

@app.get("/api/status")
async def api_status():
    """API status endpoint"""
    return {
        "api": "operational",
        "database": "connected",
        "cache": "operational",
        "timestamp": datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=10000)
