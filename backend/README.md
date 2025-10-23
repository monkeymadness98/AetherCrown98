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

#### `GET /`
Returns API information and status.

**Response:**
```json
{
  "service": "AetherCrown98 Backend API",
  "version": "1.0.0",
  "status": "operational",
  "docs": "/docs"
}
```

#### `GET /healthz`
Health check endpoint with detailed service status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-23T12:00:00Z",
  "version": "1.0.0",
  "services": {
    "api": {"status": "operational", "message": "API is running"},
    "database": {"status": "operational", "message": "Connected to Supabase"},
    "scheduler": {"status": "operational"}
  },
  "uptime_seconds": 0.123
}
```

#### `GET /metrics`
Prometheus-compatible metrics for monitoring.

**Response:**
```json
{
  "tasks_total": 150,
  "tasks_pending": 5,
  "tasks_completed": 140,
  "tasks_failed": 5,
  "payments_total": 50,
  "revenue_total": 12450.00,
  "scheduler_running": true
}
```

### AI Agents

#### `POST /ai_agent`
Delegate a task to an AI agent for processing.

**Request Body:**
```json
{
  "agent_type": "marketing",
  "action": "generate_content",
  "parameters": {
    "content_type": "social_media",
    "topic": "business automation"
  }
}
```

**Agent Types:**
- `marketing`: Content generation, campaign analysis
- `analytics`: Data analysis, insights generation
- `finance`: Financial analysis, projections
- `reports`: Comprehensive business reports

**Response:**
```json
{
  "success": true,
  "task_id": "uuid",
  "agent_type": "marketing",
  "action": "generate_content",
  "status": "queued",
  "message": "AI agent task queued for execution"
}
```

### Tasks

#### `POST /tasks/assign`
Assign a new task to an AI clone.

**Request Body:**
```json
{
  "clone_id": "uuid",
  "task_name": "analyze_sales_data",
  "task_input": {
    "dataset": "Q4_2024_sales.csv",
    "metrics": ["revenue", "growth"]
  },
  "priority": "high"
}
```

**Response:**
```json
{
  "success": true,
  "task_id": "uuid",
  "status": "pending",
  "message": "Task assigned successfully"
}
```

#### `GET /tasks/status/{task_id}`
Get the current status and output of a task.

**Response:**
```json
{
  "success": true,
  "task": {
    "id": "uuid",
    "task_name": "analyze_sales_data",
    "status": "completed",
    "priority": "high",
    "created_at": "2025-10-23T10:00:00Z",
    "completed_at": "2025-10-23T10:05:00Z",
    "task_output": {
      "result": "success",
      "insights": ["Revenue up 23%", "Top product: AI Suite"]
    }
  }
}
```

### Payments

#### `POST /payments/create`
Create a new payment order.

**Request Body:**
```json
{
  "amount": 299.00,
  "currency": "USD",
  "description": "Professional Plan - Monthly",
  "user_id": "optional_user_id"
}
```

**Response:**
```json
{
  "success": true,
  "order_id": "ORDER_20251023_120000_29900",
  "amount": 299.00,
  "currency": "USD",
  "status": "created",
  "payment_method": "paypal",
  "sandbox_mode": true
}
```

#### `POST /payments/webhook`
Webhook endpoint for payment provider notifications.

**Request Body:** (varies by provider)

**Response:**
```json
{
  "success": true,
  "message": "Webhook processed"
}
```

### Reports

#### `POST /reports/generate`
Generate an AI-powered business report.

**Query Parameters:**
- `report_type`: Type of report (default: "daily_summary")
  - `daily_summary`: Daily business summary
  - `weekly_report`: Weekly performance report
  - `monthly_analysis`: Monthly comprehensive analysis

**Response:**
```json
{
  "success": true,
  "report_type": "daily_summary",
  "status": "generating",
  "message": "daily_summary report generation started"
}
```

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
