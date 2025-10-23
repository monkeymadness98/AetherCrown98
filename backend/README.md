# AetherCrown98 Backend API

FastAPI-based backend for AI automation, analytics, and business intelligence.

## Features

- **FastAPI Framework**: High-performance async API
- **AI Automation**: Multi-agent system for marketing, analytics, finance, and reporting
- **Supabase Integration**: PostgreSQL database with real-time capabilities
- **Payment Processing**: PayPal and Stripe integration
- **Background Tasks**: APScheduler for scheduled jobs
- **Structured Logging**: JSON logging for production monitoring
- **Health Checks**: `/healthz` and `/metrics` endpoints

## Setup

### Local Development

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment variables (create `.env` file):
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
OPENAI_API_KEY=your_openai_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
NODE_ENV=development
PORT=8000
```

3. Run the server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

4. Access API docs:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Health & Monitoring

- `GET /` - API info
- `GET /healthz` - Health check with service status
- `GET /metrics` - Prometheus-compatible metrics

### AI Agents

- `POST /ai_agent` - Delegate task to AI agent
  - Agent types: `marketing`, `analytics`, `finance`, `reports`
  - Actions: Various based on agent type

### Tasks

- `POST /tasks/assign` - Assign new task to AI clone
- `GET /tasks/status/{task_id}` - Get task status

### Payments

- `POST /payments/create` - Create payment order
- `POST /payments/webhook` - Payment provider webhook handler

### Reports

- `POST /reports/generate` - Generate AI-powered report
  - Report types: `daily_summary`, `weekly_report`, `monthly_analysis`

## AI Agents

### Marketing Agent
- Content generation
- Campaign analysis
- Social media automation

### Analytics Agent
- Data analysis
- Insight generation
- Performance metrics

### Finance Agent
- Financial analysis
- Revenue projections
- Transaction monitoring

### Reports Agent
- Executive summaries
- Comprehensive business reports
- Scheduled daily reports

## Background Tasks

The system uses APScheduler for background tasks:

- **Daily Summary**: Generates at 09:00 UTC daily
- **AI Task Execution**: Processes queued tasks asynchronously
- **Report Generation**: On-demand and scheduled

## Deployment

### Render

1. Push code to GitHub
2. Connect repository to Render
3. Use `render.yaml` for configuration
4. Set environment variables in Render dashboard

### Docker

Build and run:
```bash
docker build -t aethercrown98-backend .
docker run -p 8000:8000 --env-file .env aethercrown98-backend
```

## Database Schema

See `../DATABASE_SCHEMA.md` for complete database structure.

Required tables:
- `users`
- `ai_clones`
- `ai_tasks`
- `payments`
- `activity_logs`

## Logging

Structured JSON logging in production:
```json
{
  "timestamp": "2025-10-23T12:00:00Z",
  "level": "INFO",
  "service": "aethercrown98-backend",
  "logger": "main",
  "message": "Task completed"
}
```

## Testing

Run tests (when implemented):
```bash
pytest
```

## Contributing

See `../CONTRIBUTING.md` for guidelines.

## License

ISC
