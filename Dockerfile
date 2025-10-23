# Dockerfile for aethercrown98-backend
FROM python:3.12-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Expose port (will be overridden by $PORT on Render)
EXPOSE 8000

# Run gunicorn with uvicorn workers for async support
CMD gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:${PORT:-8000} --timeout 120
