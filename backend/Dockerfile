# Multi-stage build to reduce image size
FROM python:3.11-slim as builder

WORKDIR /app

# Install only essential build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
# Use --no-cache-dir and --user to reduce size
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Clean up pip cache
RUN pip cache purge || true

# Final stage - minimal runtime image
FROM python:3.11-slim

WORKDIR /app

# Install only runtime dependencies (no build tools)
RUN apt-get update && apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Copy only installed packages from builder (not build tools)
COPY --from=builder /root/.local /root/.local

# Copy application code only
COPY main.py .

# Make sure scripts in .local are usable
ENV PATH=/root/.local/bin:$PATH

# Set Python to not buffer output
ENV PYTHONUNBUFFERED=1

# Expose port (Railway sets PORT env var)
EXPOSE 8080

# Start the application
# Railway will set PORT env var automatically
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]

