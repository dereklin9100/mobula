# Docker Deployment Guide | English Version

## Project Overview

Mobula is a Turborepo-based monorepo template containing three Next.js applications:
- **web** (Port 3000) - Homepage application
- **login** (Port 3001) - Login application with multi-language (i18n) support
- **dashboard** (Port 3002) - Dashboard application

## Dockerfile Selection

### 1. Dockerfile (Standard Version)
- For development and production environments
- Larger image but faster build time
- **Recommended for: Development environment, rapid iteration**

```bash
docker build -t mobula-web --target runner-web .
```

### 2. Dockerfile.prod (Optimized Version)
- Optimized for production environment
- Smaller image size
- Includes health checks
- **Recommended for: Production deployment**

```bash
docker build -f Dockerfile.prod -t mobula-web:prod --target runner-web .
```

## Single Application Deployment

### Web Application (Port 3000)

```bash
# Using standard Dockerfile
docker build -t mobula-web --target runner-web .
docker run -p 3000:3000 mobula-web

# Or using optimized Dockerfile.prod
docker build -f Dockerfile.prod -t mobula-web:prod --target runner-web .
docker run -p 3000:3000 mobula-web:prod
```

### Login Application (Port 3001)

```bash
docker build -t mobula-login --target runner-login .
docker run -p 3001:3001 mobula-login
```

### Dashboard Application (Port 3002)

```bash
docker build -t mobula-dashboard --target runner-dashboard .
docker run -p 3002:3002 mobula-dashboard
```

## Multi-Application Deployment

### Using Docker Compose (Recommended)

```bash
# Start all three applications
docker-compose up

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Using Docker Compose (Production Optimized)

```bash
# Use Dockerfile.prod in docker-compose.prod.yml:
docker-compose -f docker-compose.prod.yml up -d
```

## Environment Variable Configuration

Add environment variables in docker-compose.yml:

```yaml
services:
  web:
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.example.com
```

Or use .env file:

```bash
docker-compose --env-file .env.production up -d
```

## Health Checks

Dockerfile.prod includes built-in health checks:

```bash
# Check container health status
docker inspect --format='{{.State.Health.Status}}' mobula-web
```

## Network Configuration

### Inter-container Communication

With Docker Compose, containers can communicate via service names:

```bash
# Access login container from web container
curl http://login:3001
```

### External Access

Access applications through port mapping:
- Web: http://localhost:3000
- Login: http://localhost:3001
- Dashboard: http://localhost:3002

## Data Volumes

For persistent data, add volume configuration:

```yaml
services:
  web:
    volumes:
      - web-data:/app/data
volumes:
  web-data:
```

## Performance Optimization Tips

1. **Use Dockerfile.prod** - Production environment should use optimized version
2. **Image Caching** - Utilize Docker layer caching, avoid frequent rebuilds
3. **Multi-Stage Build** - Reduces final image size
4. **Resource Limits** - Set memory and CPU limits for containers:

```yaml
services:
  web:
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 512M
        reservations:
          cpus: "0.25"
          memory: 256M
```

## Debugging

### Enter Running Container

```bash
# Enter running container
docker exec -it mobula-web sh

# View logs
docker logs mobula-web
docker logs -f mobula-web  # Real-time logs
```

### Build Debugging

```bash
# View build logs
docker build --no-cache -t mobula-web --target runner-web .

# Enter container in build stage
docker build -t mobula-web --target builder --progress=plain .
```

## Frequently Asked Questions

### Q: Why is the image so large?
A: Node.js Alpine image + Next.js compiled output + dependencies. Using Dockerfile.prod can reduce size by 20-30%.

### Q: How to deploy on Kubernetes?
A: Convert docker-compose.yml to Kubernetes manifests, or use Kompose:

```bash
kompose convert -f docker-compose.yml -o k8s/
```

### Q: How to update application?
A: Rebuild and run:

```bash
docker-compose down
docker-compose build
docker-compose up -d
```

### Q: How to use private npm packages?
A: Pass npm auth info during build:

```bash
docker build --build-arg NPM_TOKEN=$NPM_TOKEN -t mobula-web .
```

Then use in Dockerfile:

```dockerfile
ARG NPM_TOKEN
RUN npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN
```

## Production Deployment Checklist

- [ ] Use Dockerfile.prod
- [ ] Configure environment variables
- [ ] Set resource limits
- [ ] Configure health checks
- [ ] Set restart policy (`restart: always`)
- [ ] Configure log collection
- [ ] Use private container registry
- [ ] Configure SSL/TLS
- [ ] Set up monitoring alerts
- [ ] Prepare disaster recovery plan

## Related Documentation

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Turborepo Docker Guide](https://turbo.build/repo/docs/guides/tools/docker)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
