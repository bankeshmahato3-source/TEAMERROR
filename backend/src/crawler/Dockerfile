# Dockerfile for sandboxed Playwright fetcher
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

# Create non-root user
RUN groupadd -r crawler && useradd -r -g crawler crawler \
    && mkdir -p /home/crawler/Downloads \
    && chown -R crawler:crawler /home/crawler

# Set working directory
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Set permissions for evidence dir
RUN mkdir -p /app/data/crawler/evidence && chown -R crawler:crawler /app/data/crawler/evidence

# Run as non-root
USER crawler

# Ensure Playwright doesn't download browsers again
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV CRAWLER_ENABLED=true
ENV NODE_ENV=production

# The exact read-only mount and resource limits should be enforced via docker run:
# docker run --read-only --tmpfs /tmp --tmpfs /home/crawler --volume $(pwd)/data/crawler/evidence:/app/data/crawler/evidence -m 1g --cpus 1 my-fetcher

# Start worker
CMD ["node", "dist/crawler/scripts/runWorker.js"]
