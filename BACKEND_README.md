# Backend Infrastructure Setup

This document describes the backend infrastructure setup for AetherCrown98.

## Overview

The backend service (`aethercrown98-backend`) is a FastAPI application that runs on port 10000 and is designed to be deployed on Render using Docker.

## Files

### 1. `main.py`
The main FastAPI application with the following endpoints:
- `GET /` - Root endpoint returning service information
- `GET /health` - Health check endpoint for monitoring
- `GET /api/status` - API status endpoint showing service status

### 2. `requirements.txt`
Python dependencies for the backend:
- `fastapi==0.109.1` - Web framework
- `uvicorn==0.27.0` - ASGI server
- `gunicorn==22.0.0` - Production WSGI HTTP server
- `python-dotenv==1.0.1` - Environment variable management
- `pydantic==2.5.3` - Data validation

### 3. `Dockerfile`
Multi-stage Docker build configuration:
- Base image: Python 3.11 slim
- Installs system dependencies (gcc)
- Installs Python dependencies
- Exposes port 10000
- Includes health check
- Runs with gunicorn + uvicorn workers

### 4. `render.yaml`
Render deployment configuration:
- Service name: `aethercrown98-backend`
- Runtime: Docker
- Auto-deploy from main branch
- Health check: `/health`
- Environment variables configured
- Free plan tier

## Local Development

### Prerequisites
- Python 3.11 or higher
- pip

### Setup
```bash
# Install dependencies
pip install -r requirements.txt

# Run with uvicorn (development)
uvicorn main:app --reload --host 0.0.0.0 --port 10000

# Run with gunicorn (production-like)
gunicorn main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:10000
```

### Test Endpoints
```bash
# Root endpoint
curl http://localhost:10000/

# Health check
curl http://localhost:10000/health

# API status
curl http://localhost:10000/api/status
```

## Docker Deployment

### Build Docker Image
```bash
docker build -t aethercrown98-backend .
```

### Run Docker Container
```bash
docker run -p 10000:10000 aethercrown98-backend
```

### Test Docker Container
```bash
curl http://localhost:10000/health
```

## Render Deployment

The `render.yaml` file is configured for automatic deployment:

1. **Manual Deployment**: 
   - Push changes to the `main` branch
   - Render will automatically detect the `render.yaml` and deploy

2. **Via Render Dashboard**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Create New → Blueprint
   - Connect your GitHub repository
   - Render will read `render.yaml` and create the service

3. **Expected Service URL**:
   - `https://aethercrown98-backend.onrender.com`

### Environment Variables
The following environment variables are configured in `render.yaml`:
- `NODE_ENV=production`
- `PORT=10000`
- `PYTHON_VERSION=3.11`

## API Documentation

Once deployed, FastAPI provides automatic API documentation:
- Swagger UI: `https://aethercrown98-backend.onrender.com/docs`
- ReDoc: `https://aethercrown98-backend.onrender.com/redoc`

## Health Monitoring

The `/health` endpoint returns:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-23T02:52:23.461976",
  "service": "aethercrown98-backend",
  "environment": "production"
}
```

This endpoint is used by Render for health checks and can be used by monitoring tools.

## Security Notes

1. The CORS middleware is currently configured to allow all origins (`allow_origins=["*"]`). In production, update this to specify exact allowed origins.
2. Add authentication/authorization middleware as needed for your use case.
3. Consider adding rate limiting for production deployments.

## Troubleshooting

### Port Already in Use
If port 10000 is already in use locally, change the port in the command:
```bash
gunicorn main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Docker Build Issues
If experiencing SSL certificate issues during Docker build in certain environments, this is expected in CI/CD environments with proxy configurations. The build will work correctly in Render's environment.

## Next Steps

1. Add database connection (e.g., PostgreSQL, MongoDB)
2. Implement authentication/authorization
3. Add more API endpoints as needed
4. Set up logging and monitoring
5. Configure secrets and environment variables in Render dashboard
