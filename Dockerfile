# ==============================================================================
# Production Unified Dockerfile
# Machine Learning-Based Urban Heat Hotspot Detection — Mysuru
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Frontend React Single Page Application (SPA)
# ------------------------------------------------------------------------------
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy dependency manifests and install packages
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci || npm install

# Copy frontend source code
COPY frontend/ ./

# Build arguments for frontend environment injection
# In a unified container, Nginx reverse-proxies /api/v1 to FastAPI
ARG VITE_API_BASE_URL=/api/v1
ARG VITE_CARTO_API_KEY=""
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_CARTO_API_KEY=${VITE_CARTO_API_KEY}

# Compile TypeScript and bundle Vite production assets
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Production Python Backend + Nginx Reverse Proxy
# ------------------------------------------------------------------------------
FROM python:3.12-slim AS runner

# Environment variables
ENV DEBIAN_FRONTEND=noninteractive \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Install Nginx, supervisor, curl, and runtime libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    supervisor \
    curl \
    libgomp1 \
    procps \
    && rm -rf /var/lib/apt/lists/*

# Application root directory
WORKDIR /app

# Install backend Python dependencies
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend application source
COPY backend/ ./backend/

# Copy authoritative research assets (~110 MB total volume)
COPY data/ ./data/
COPY models/ ./models/
COPY results/ ./results/

# Copy compiled frontend assets to Nginx document root
COPY --from=frontend-builder /app/frontend/dist /var/www/html

# Copy Nginx server configuration
COPY deploy/nginx.conf /etc/nginx/sites-available/default

# Copy Supervisor process management configuration
COPY deploy/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Initialize runtime tile cache directory
RUN mkdir -p /app/.tile_cache && chmod 777 /app/.tile_cache

# Expose HTTP port
EXPOSE 80

# Container healthcheck testing the complete stack via Nginx reverse proxy
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD curl -f http://localhost/api/v1/health || exit 1

# Start process supervisor managing both Uvicorn and Nginx
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
