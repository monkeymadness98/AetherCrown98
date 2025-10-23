# AetherCrown98 Backend API

FastAPI backend for the AetherCrown98 AI-Driven Business Empire platform.

## Setup

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Locally

```bash
# Using uvicorn (development)
uvicorn main:app --reload --port 8000

# Using gunicorn (production-like)
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Run with Docker

```bash
# Build image
docker build -t aethercrown98-backend -f ../Dockerfile ..

# Run container
docker run -p 8000:8000 -e PORT=8000 aethercrown98-backend
```

## API Endpoints

### Health & Status

- `GET /` - Root endpoint with API info
- `GET /health` - Health check with environment status

### Business Metrics

- `GET /api/metrics` - Get business performance metrics
  - Returns: revenue, transactions, growth, customers

### AI Insights

- `GET /api/insights` - Get AI-powered business insights
  - Returns: Array of insights with title, description, confidence

### Analytics

- `GET /api/analytics` - Get detailed analytics data
  - Returns: revenue trends, traffic sources, top products

### Payments

- `POST /api/payments/process` - Process payment transaction
  - Body: `{ "amount": number, "method": string }`

## Environment Variables

Required environment variables:

- `PORT` - Server port (default: 8000)
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase API key
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `PAYPAL_CLIENT_ID` - PayPal client ID
- `PAYPAL_SECRET` - PayPal secret key

## Deployment

### Render

The backend is configured for deployment on Render using the `render.yaml` file in the root directory.

Deploy steps:
1. Push code to GitHub
2. Connect repository to Render
3. Render will auto-detect `render.yaml` and deploy
4. Configure environment variables in Render dashboard

### Docker Deployment

Use the `Dockerfile` in the root directory for containerized deployment.

## Testing

```bash
# Test endpoints
curl http://localhost:8000/
curl http://localhost:8000/health
curl http://localhost:8000/api/metrics
curl http://localhost:8000/api/insights
curl http://localhost:8000/api/analytics
```

## Development

The backend is built with:
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **Gunicorn** - Production WSGI server
- **Pydantic** - Data validation
- **Supabase** - Database and authentication
- **OpenAI** - AI-powered features
