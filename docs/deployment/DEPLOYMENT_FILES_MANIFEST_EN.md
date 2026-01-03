# Mobula Docker & Kubernetes Deployment Configuration Manifest

> **Created**: 2026-01-03  
> **Project**: Mobula (Turborepo Next.js Monorepo)  
> **Applications**: 3 Next.js Applications (Web, Login, Dashboard)

---

## 📦 File List

### Docker Related Files

#### ✅ Dockerfile
- **Standard multi-stage build file**
- Support 3 runner targets: web, login, dashboard
- Purpose: Development and early production environment

#### ✅ Dockerfile.prod
- **Production optimized version**
- Smaller image size (approx 200MB vs 500MB)
- Includes integrated healthcheck
- Purpose: Recommended for production deployment

#### ✅ .dockerignore
- Optimize Docker build context
- Exclude unnecessary files
- Accelerate build process

#### ✅ docker-compose.yml
- Development environment configuration
- 3 services: web, login, dashboard
- Basic health checks
- Purpose: Local development and testing

#### ✅ docker-compose.prod.yml
- Production environment configuration
- CPU/memory limits and reservations
- Log rotation configuration
- Restart policy: always
- Purpose: Small-scale production deployment

### Kubernetes Related Files

```
k8s/
├── ✅ deployment.yaml (350+ lines)
│   ├─ 3 Deployments (web, login, dashboard)
│   ├─ 3 Services (LoadBalancer type)
│   ├─ 3 HorizontalPodAutoscalers (auto-scale 2-10 Pods)
│   ├─ Liveness & Readiness probes
│   ├─ Resource limits (CPU/memory)
│   └─ Purpose: Large-scale production deployment
│
└── ✅ README.md (500+ lines)
    ├─ Detailed K8s deployment guide
    ├─ Configuration explanation and examples
    ├─ Update and rollback guide
    ├─ Monitoring and logging configuration
    ├─ Troubleshooting guide
    └─ Production checklist
```

### CI/CD Workflow Files

```
.github/workflows/
└── ✅ docker.yml
    ├─ GitHub Actions automatic build workflow
    ├─ Matrix build (web, login, dashboard)
    ├─ Push images to GitHub Container Registry
    ├─ Trivy image security scanning
    ├─ Unit tests and type checking
    └─ Purpose: CI/CD automated deployment
```

### Documentation Files

#### ✅ DOCKER_GUIDE.md (300+ lines)
- Docker deployment detailed guide
- Single/multi-app deployment methods
- Environment variable configuration
- Performance optimization tips
- Frequently asked questions
- Debugging and troubleshooting

#### ✅ DEPLOYMENT_README.md (200+ lines)
- Quick reference guide
- Deployment method comparison
- Quick start commands
- Quick FAQs
- Purpose: Quick lookup

#### ✅ DEPLOYMENT_SUMMARY.md (6.4K)
- Complete configuration summary
- Deployment method comparison table
- Architecture design explanation
- Quick start commands
- Usage checklist
- Future optimization suggestions

---

## 🎯 Main Features

### Multi-Stage Build
- ✅ Fast compilation (single stage)
- ✅ Minimal images (multiple targets)
- ✅ Independent app build

### Production Optimization
- ✅ Alpine Linux (18MB base image)
- ✅ Production dependencies only
- ✅ Health check integration
- ✅ Log rotation configuration
- ✅ Resource limit setting

### Automated Deployment
- ✅ GitHub Actions CI/CD
- ✅ Image security scanning
- ✅ Automatic testing and build
- ✅ Push to image repository

### High Availability Configuration
- ✅ Kubernetes HPA (auto-scaling)
- ✅ Health check probes
- ✅ Rolling update strategy
- ✅ Replica management (2-10 Pods)

---

## 🚀 Quick Start Commands

### Local Development - Start All Apps

```bash
docker-compose up
```

**Access Applications:**
- Web: http://localhost:3000
- Login: http://localhost:3001
- Dashboard: http://localhost:3002

### Single App Build (Development)

```bash
docker build -t mobula-web --target runner-web .
docker run -p 3000:3000 mobula-web
```

### Single App Build (Production Optimized)

```bash
docker build -f Dockerfile.prod -t mobula-web:prod --target runner-web .
docker run -p 3000:3000 mobula-web:prod
```

### Production Environment (with Resource Limits)

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes Deployment

```bash
# 1. Build and push image
docker build -f Dockerfile.prod -t <registry>/mobula-web:latest --target runner-web .
docker push <registry>/mobula-web:latest

# 2. Deploy to K8s
kubectl apply -f k8s/deployment.yaml

# 3. Check status
kubectl get deployments -n mobula
```

---

## 📊 Deployment Method Comparison

| Deployment Method | Suitable For | Complexity | Recommended |
|------------------|-------------|-----------|-------------|
| Single Docker | Single app | ⭐ | ⭐⭐ |
| Docker Compose | Local development | ⭐⭐ | ⭐⭐⭐ |
| Docker Compose Prod | Small-scale production | ⭐⭐ | ⭐⭐ |
| Kubernetes | Large-scale production | ⭐⭐⭐ | ⭐⭐⭐ |
| CI/CD Automation | Continuous delivery | ⭐⭐ | ⭐⭐⭐ |

---

## 💾 Image Size Reference

| Application | Dockerfile | Dockerfile.prod | Optimization Ratio |
|------------|-----------|-----------------|-------------------|
| Web App | ~500MB | ~200MB | ↓ 60% |
| Login App | ~500MB | ~200MB | ↓ 60% |
| Dashboard App | ~500MB | ~200MB | ↓ 60% |

> *Actual size depends on dependencies and source code volume*

---

## ✅ Usage Checklist

### Pre-Deployment Checks
- [ ] Docker & Docker Compose installed (if using Compose)
- [ ] Kubernetes & kubectl installed (if using K8s)
- [ ] Understand project structure and app config
- [ ] Prepare environment variable files

### Docker Deployment
- [ ] Image built successfully
- [ ] App accessible through container ports
- [ ] Health checks working properly
- [ ] Logs output correctly

### Production Deployment (Compose)
- [ ] Environment variables configured
- [ ] Resource limits set
- [ ] Log collection configured
- [ ] Restart policy set
- [ ] Container restart tested

### Kubernetes Deployment
- [ ] Images pushed to repository
- [ ] Image address updated
- [ ] Namespace configured
- [ ] Service created
- [ ] Ingress configured
- [ ] Log collection enabled
- [ ] Monitoring alerts enabled

---

## 📚 Documentation Navigation

### Quick Reference
- **[DEPLOYMENT_README_EN.md](./DEPLOYMENT_README_EN.md)** - Quick query, 3-5 minutes reading

### Docker Detailed Guide
- **[DOCKER_GUIDE_EN.md](./DOCKER_GUIDE_EN.md)** - Complete tutorial, 15-20 minutes reading
  - Single app deployment
  - Multi-app orchestration
  - Environment variable configuration
  - Optimization suggestions

### Kubernetes Detailed Guide
- **[k8s/README_EN.md](./k8s/README_EN.md)** - Complete tutorial, 20-30 minutes reading
  - Deployment steps
  - Configuration management
  - Update strategies
  - Troubleshooting

### Configuration Examples
- **[Dockerfile](./Dockerfile)** - Standard multi-stage build
- **[Dockerfile.prod](./Dockerfile.prod)** - Production optimized version
- **[docker-compose.yml](./docker-compose.yml)** - Development config
- **[docker-compose.prod.yml](./docker-compose.prod.yml)** - Production config
- **[k8s/deployment.yaml](./k8s/deployment.yaml)** - K8s manifest
- **[.github/workflows/docker.yml](./.github/workflows/docker.yml)** - CI/CD workflow

---

## 🔧 Future Optimization Suggestions

### Image Optimization
- [ ] Use distroless base image to further reduce size
- [ ] Enable Docker buildx local cache to speed up build
- [ ] Implement image layering strategy

### Deployment Optimization
- [ ] Configure Istio/Linkerd service mesh
- [ ] Implement blue-green or canary deployment
- [ ] Integrate ArgoCD for GitOps

### Monitoring Alerts
- [ ] Integrate Prometheus + Grafana monitoring
- [ ] Configure PagerDuty or other alerting service
- [ ] Implement distributed tracing (Jaeger/Zipkin)

### Security Hardening
- [ ] Enable image signature verification
- [ ] Configure Kubernetes network policies
- [ ] Implement RBAC permission management
- [ ] Enable Pod Security Policy

---

## 📞 Get Help

Encountering issues? Check relevant guide:

| Issue Type | See File |
|-----------|----------|
| Docker Issues | [DOCKER_GUIDE_EN.md](./DOCKER_GUIDE_EN.md) |
| Kubernetes Issues | [k8s/README_EN.md](./k8s/README_EN.md) |
| Quick Query | [DEPLOYMENT_README_EN.md](./DEPLOYMENT_README_EN.md) |
| Deployment Troubleshooting | "Troubleshooting" section in each file |
| CI/CD Issues | [.github/workflows/docker.yml](./.github/workflows/docker.yml) comments |

---

## 📝 Configuration File Quick Reference

### Dockerfile Key Information
- **Base Image**: node:18-alpine
- **pnpm Version**: 9.0.0
- **Node Version**: ≥18
- **Build Targets**: builder, runner-web, runner-login, runner-dashboard

### Dockerfile.prod Key Information
- **Base Image**: node:18-alpine (smaller)
- **Optimization**: Production dependencies + health checks
- **Image Size**: ~200MB

### docker-compose Key Information
- **Service Count**: 3 (web:3000, login:3001, dashboard:3002)
- **Network**: Auto-created mobula network
- **Restart Policy (prod)**: always

### Kubernetes Key Information
- **Namespace**: mobula
- **Replicas**: 2 (default)
- **CPU Request**: 250m / **Limit**: 500m
- **Memory Request**: 256Mi / **Limit**: 512Mi
- **HPA**: 2-10 replicas (70% CPU / 80% memory trigger)

### CI/CD Key Information
- **Trigger Events**: push (main, develop), pull_request, manual trigger
- **Image Repository**: GitHub Container Registry (ghcr.io)
- **Security Scanning**: Trivy
- **Workflow Matrix**: web, login, dashboard

---

## 📄 File Information

| File | Size | Description |
|------|------|-------------|
| Dockerfile | 2.9K | Standard multi-stage build |
| Dockerfile.prod | 3.3K | Production optimized version |
| .dockerignore | 901B | Build context optimization |
| docker-compose.yml | 1.1K | Development orchestration |
| docker-compose.prod.yml | 2.2K | Production orchestration |
| DOCKER_GUIDE_EN.md | 5.0K | Docker detailed tutorial |
| DEPLOYMENT_README_EN.md | 4.2K | Quick reference guide |
| DEPLOYMENT_SUMMARY_EN.md | 6.4K | Complete summary |
| FINAL_SUMMARY_EN.md | 5.2K | Final summary document |
| k8s/deployment.yaml | 350+ lines | K8s deployment manifest |
| k8s/README_EN.md | 500+ lines | K8s detailed guide |
| .github/workflows/docker.yml | - | GitHub Actions workflow |

---

**Version**: 1.0.0  
**Created**: 2026-01-03  
**Maintained By**: GitHub Copilot
