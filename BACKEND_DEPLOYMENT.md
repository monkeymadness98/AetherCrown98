# Backend Deployment Guide

## Overview

The AetherCrown98 backend is a Python FastAPI application that provides REST API endpoints for the frontend application. It's configured for easy deployment on Render.com with support for Docker containerization.

## Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (Next.js)              │
│      Deployed on Vercel                 │
└────────────────┬────────────────────────┘
                 │
                 │ HTTPS
                 ▼
┌─────────────────────────────────────────┐
│    Backend API (FastAPI + Python)       │
│      Deployed on Render.com             │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │  Gunicorn (Process Manager)      │   │
│  │    ├─ Uvicorn Worker 1           │   │
│  │    ├─ Uvicorn Worker 2           │   │
│  │    ├─ Uvicorn Worker 3           │   │
│  │    └─ Uvicorn Worker 4           │   │
│  └──────────────────────────────────┘   │
└────────────────┬────────────────────────┘
                 │
                 ├─ Supabase (Database)
                 ├─ OpenAI API (AI Features)
                 └─ PayPal API (Payments)
```

## Files Structure

### Core Backend Files

```
backend/
├── main.py              # FastAPI application entry point
├── requirements.txt     # Python dependencies
└── README.md           # Backend API documentation
```

### Deployment Configuration

```
├── render.yaml         # Render.com deployment config
├── Dockerfile          # Docker containerization config
└── .github/workflows/
    └── backend-test-and-deploy.yml  # CI/CD pipeline
```

## Deployment Options

### Option 1: Render with render.yaml (Recommended)

The `render.yaml` file provides automatic deployment configuration:

**Configuration:**
- Service Type: Web Service
- Environment: Python 3.12
- Build Command: `pip install -r backend/requirements.txt`
- Start Command: `gunicorn backend.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --timeout 120`
- Plan: Free tier
- Region: Oregon
- Auto Deploy: Enabled

**Deployment Steps:**
1. Push code to GitHub
2. Sign in to [render.com](https://render.com)
3. Click "New +" → "Web Service"
4. Connect your repository
5. Render auto-detects `render.yaml`
6. Configure environment variables (see below)
7. Click "Create Web Service"

### Option 2: Docker Deployment

The `Dockerfile` provides containerized deployment:

**Build locally:**
```bash
docker build -t aethercrown98-backend -f Dockerfile .
docker run -p 8000:8000 -e PORT=8000 aethercrown98-backend
```

**Deploy to Render:**
1. In Render dashboard, select "Deploy from Dockerfile"
2. Connect repository
3. Configure environment variables
4. Deploy

## Environment Variables

Required environment variables to configure in Render dashboard:

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (auto-set by Render) | Auto |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_KEY` | Supabase API key | Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes |
| `PAYPAL_CLIENT_ID` | PayPal client ID for payments | Yes |
| `PAYPAL_SECRET` | PayPal secret key | Yes |
| `PYTHON_VERSION` | Python version (3.12.0) | Auto |

## API Endpoints

Once deployed, the backend provides these endpoints:

### Health & Status
- `GET /` - API information
- `GET /health` - Health check with environment status
- `GET /docs` - Auto-generated API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation

### Business APIs
- `GET /api/metrics` - Business performance metrics
- `GET /api/insights` - AI-powered business insights
- `GET /api/analytics` - Detailed analytics data
- `POST /api/payments/process` - Payment processing

## Testing the Deployment

After deployment, test the backend:

```bash
# Replace with your Render URL
BACKEND_URL="https://aethercrown98-backend.onrender.com"

# Test root endpoint
curl $BACKEND_URL/

# Test health check
curl $BACKEND_URL/health

# Test metrics
curl $BACKEND_URL/api/metrics

# Test insights
curl $BACKEND_URL/api/insights

# View API documentation
open $BACKEND_URL/docs
```

Expected responses:
- Status 200 OK
- JSON responses with data
- Health check shows configured services

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/backend-test-and-deploy.yml`) automatically:

1. **On Pull Request & Push:**
   - Tests frontend (Node.js)
   - Tests backend (Python)
   - Validates backend imports
   - Tests backend endpoints

2. **On Push to Main:**
   - Runs all tests
   - Triggers Render deployment
   - Sends deployment notification

## Monitoring & Logs

### View Logs on Render
1. Go to Render dashboard
2. Select your backend service
3. Click "Logs" tab
4. View real-time logs

### Expected Log Output
```
[INFO] Starting gunicorn 23.0.0
[INFO] Listening at: http://0.0.0.0:10000
[INFO] Using worker: uvicorn.workers.UvicornWorker
[INFO] Booting worker with pid: 1
[INFO] Started server process [1]
[INFO] Waiting for application startup.
[INFO] Application startup complete.
```

## Troubleshooting

### Build Fails

**Problem:** Dependencies installation fails
```bash
# Solution: Check requirements.txt syntax
pip install -r backend/requirements.txt
```

**Problem:** Python version mismatch
```bash
# Solution: Verify Python version in render.yaml
PYTHON_VERSION: 3.12.0
```

### Runtime Errors

**Problem:** Application won't start
- Check environment variables are set
- Verify PORT binding in start command
- Check logs for specific error messages

**Problem:** 502 Bad Gateway
- Backend may be still starting (wait 1-2 minutes)
- Check if service is running in Render dashboard
- Verify start command is correct

**Problem:** Environment not configured
- Check /health endpoint shows services as configured
- Add missing environment variables in Render dashboard

### Performance Issues

**Problem:** Slow response times
- Increase worker count in start command
- Upgrade Render plan from Free to Starter
- Check external API response times (Supabase, OpenAI)

**Problem:** Timeout errors
- Increase timeout in start command (currently 120s)
- Optimize database queries
- Add caching for frequently accessed data

## Local Development

### Setup
```bash
cd /path/to/AetherCrown98

# Install dependencies
pip install -r backend/requirements.txt

# Run with auto-reload (development)
uvicorn backend.main:app --reload --port 8000

# Run with gunicorn (production-like)
gunicorn backend.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --timeout 120
```

### Environment Variables
Create a `.env` file in the backend directory:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
OPENAI_API_KEY=your_openai_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET=your_paypal_secret
```

Load environment variables:
```bash
# Option 1: Export manually
export $(cat backend/.env | xargs)

# Option 2: Use with python-dotenv (already in requirements.txt)
# It will auto-load from .env file
```

## Scaling

### Vertical Scaling (Render)
Upgrade plan for more resources:
- Free: 512MB RAM, shared CPU
- Starter: 1GB RAM, dedicated CPU
- Standard: 2GB RAM, dedicated CPU

### Horizontal Scaling
Increase worker count in `render.yaml`:
```yaml
startCommand: gunicorn backend.main:app --workers 8 ...
```

Recommended worker formula: `(2 × CPU cores) + 1`

## Security

### Best Practices
- ✅ Environment variables stored in Render (not in code)
- ✅ CORS configured (update for production domains)
- ✅ HTTPS enabled by default on Render
- ✅ Dependencies regularly updated
- ✅ No secrets in git repository

### Hardening Checklist
- [ ] Update CORS origins to specific domains
- [ ] Add rate limiting middleware
- [ ] Implement authentication/authorization
- [ ] Add input validation on all endpoints
- [ ] Enable logging and monitoring
- [ ] Set up alerts for errors

## Next Steps

1. **Deploy to Render:**
   - Follow deployment steps above
   - Configure environment variables
   - Test all endpoints

2. **Connect Frontend:**
   - Update frontend to use Render backend URL
   - Update CORS settings with frontend domain
   - Test end-to-end flow

3. **Monitor & Optimize:**
   - Watch logs for errors
   - Monitor response times
   - Optimize slow endpoints
   - Scale as needed

## Support & Resources

- **Render Documentation:** https://render.com/docs
- **FastAPI Documentation:** https://fastapi.tiangolo.com
- **Gunicorn Documentation:** https://docs.gunicorn.org
- **Backend README:** [backend/README.md](backend/README.md)
- **Main Deployment Guide:** [DEPLOYMENT.md](DEPLOYMENT.md)

## Summary

The backend is ready for deployment with:
- ✅ Python 3.12 with FastAPI
- ✅ Gunicorn + Uvicorn for production
- ✅ Render.yaml for easy deployment
- ✅ Dockerfile for containerization
- ✅ CI/CD pipeline for testing
- ✅ Auto-generated API documentation
- ✅ Health monitoring endpoints
- ✅ Comprehensive error handling

Deploy with confidence! 🚀
