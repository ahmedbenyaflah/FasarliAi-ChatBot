# Multi-stage build to reduce image size
FROM python:3.11-slim as builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Final stage - minimal runtime image
FROM python:3.11-slim

WORKDIR /app

# Copy only installed packages from builder
COPY --from=builder /root/.local /root/.local

# Make sure scripts in .local are usable
ENV PATH=/root/.local/bin:$PATH

# Copy only necessary application files
COPY main.py .
COPY requirements.txt .

# Clean up any unnecessary files
RUN find /root/.local -type d -name "__pycache__" -exec rm -r {} + 2>/dev/null || true && \
    find /root/.local -type f -name "*.pyc" -delete && \
    find /root/.local -type f -name "*.pyo" -delete

# Expose port (Railway will set PORT env var)
EXPOSE 8000

# Use Railway's PORT environment variable (defaults to 8000 if not set)
CMD sh -c "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"

