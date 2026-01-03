# Docker & Kubernetes Quick Deployment Guide

This directory contains complete Docker and Kubernetes deployment configuration for the Mobula Turborepo project.

## File Descriptions

### Docker Related Files

| File | Purpose |
|------|---------|
| `Dockerfile` | Standard multi-stage build file, suitable for development and production |
| `Dockerfile.prod` | Production optimized version with smaller image size |
| `.dockerignore` | Optimize Docker build context |
| `docker-compose.yml` | Development environment multi-app orchestration file |
| `docker-compose.prod.yml` | Production environment orchestration with resource limits |
| `DOCKER_GUIDE_EN.md` | Docker detailed deployment guide |

### Kubernetes Related Files

| File | Purpose |
|------|---------|
| `k8s/deployment.yaml` | Kubernetes application deployment manifest |
| `k8s/README_EN.md` | Kubernetes detailed deployment guide |

### CI/CD Related Files

| File | Purpose |
|------|---------|
| `.github/workflows/docker.yml` | GitHub Actions automatic image build and push |

## Quick Start

### 1. Local Development (Docker Compose)

```bash
# Start all applications
docker-compose up

# Access applications
# - Web: http://localhost:3000
# - Login: http://localhost:3001
# - Dashboard: http://localhost:3002
```

### 2. Production Deployment (Docker)

```bash
# Use optimized Dockerfile
docker build -f Dockerfile.prod -t mobula-web:latest --target runner-web .
docker run -p 3000:3000 mobula-web:latest
```

### 3. Production Deployment (Docker Compose)

```bash
# Use production config with resource limits and health checks
docker-compose -f docker-compose.prod.yml up -d
```

### 4. Kubernetes Deployment

```bash
# 1. Build and push image to registry
docker build -f Dockerfile.prod -t <registry>/mobula-web:latest --target runner-web .
docker push <registry>/mobula-web:latest

# 2. Update image address in k8s/deployment.yaml

# 3. Deploy to Kubernetes
kubectl apply -f k8s/deployment.yaml

# 4. Check deployment status
kubectl get deployments -n mobula
```

## Application Architecture

```
Mobula (Turborepo Monorepo)
├── Web (Port 3000)
│   └── Homepage application
├── Login (Port 3001)
│   └── Login application + i18n
└── Dashboard (Port 3002)
    └── Dashboard application
```

## Features

### Multi-Stage Build (Multi-stage Build)
- Fast compilation
- Minimal final image size
- Independent Docker target for each app

### Multi-App Support
- `runner-web`: Web application
- `runner-login`: Login application  
- `runner-dashboard`: Dashboard application

### Production Optimization
- Alpine Linux base image (18MB)
- Production dependencies only
- Integrated health checks
- Resource limits and requests
- Log rotation configuration

### Automated CI/CD
- GitHub Actions automatic build
- Image security scanning (Trivy)
- Automatic push to image registry

## Image Size Reference

| Application | Size | Optimized |
|-------------|------|-----------|
| Web | ~500MB | ~200MB |
| Login | ~500MB | ~200MB |
| Dashboard | ~500MB | ~200MB |

*Actual size depends on dependencies and source code size*

## Environment Variable Configuration

### Docker Compose

```bash
# Create .env file
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.example.com
```

Use environment file:
```bash
docker-compose --env-file .env.production up
```

### Kubernetes

Use ConfigMap or Secrets:
```bash
kubectl create configmap app-config --from-literal=NODE_ENV=production -n mobula
```

## Monitoring and Logging

### Docker
```bash
# View logs
docker logs mobula-web

# Real-time logs
docker logs -f mobula-web

# View container statistics
docker stats
```

### Kubernetes
```bash
# View Pod logs
kubectl logs -n mobula web-xxx

# Real-time logs
kubectl logs -f -n mobula web-xxx

# View resource usage
kubectl top pods -n mobula
```

## Common Questions

**Q: How to run multiple applications in Docker?**
A: Use Docker Compose or Kubernetes, see respective guides.

**Q: How to update application version?**
A: Rebuild the image and run the new version container.

**Q: How to achieve zero-downtime updates?**
A: Use Kubernetes rolling updates, or Docker Compose with reverse proxy.

**Q: How to collect logs to external service?**
A: Configure log driver, see DOCKER_GUIDE_EN.md and k8s/README_EN.md.

## More Information

- [Docker Detailed Guide](./DOCKER_GUIDE_EN.md)
- [Kubernetes Detailed Guide](./k8s/README_EN.md)
- [Turborepo Documentation](https://turbo.build/repo)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

## License

Please refer to the LICENSE file in the project root.
