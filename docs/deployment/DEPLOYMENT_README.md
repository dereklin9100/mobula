# Docker & Kubernetes 部署快速指南

这个目录包含了为 Mobula Turborepo 项目完整的 Docker 和 Kubernetes 部署配置。

## 文件说明

### Docker 相关文件

| 文件 | 用途 |
|------|------|
| `Dockerfile` | 标准多阶段构建文件，适合开发和生产 |
| `Dockerfile.prod` | 生产环境优化版本，更小的镜像大小 |
| `.dockerignore` | 优化 Docker 构建上下文 |
| `docker-compose.yml` | 开发环境多应用编排文件 |
| `docker-compose.prod.yml` | 生产环境多应用编排文件，包含资源限制 |
| `DOCKER_GUIDE.md` | Docker 详细部署指南 |

### Kubernetes 相关文件

| 文件 | 用途 |
|------|------|
| `k8s/deployment.yaml` | Kubernetes 应用部署清单 |
| `k8s/README.md` | Kubernetes 详细部署指南 |

### CI/CD 相关文件

| 文件 | 用途 |
|------|------|
| `.github/workflows/docker.yml` | GitHub Actions 自动构建和推送镜像 |

## 快速开始

### 1. 本地开发 (Docker Compose)

```bash
# 启动所有应用
docker-compose up

# 访问应用
# - Web: http://localhost:3000
# - Login: http://localhost:3001
# - Dashboard: http://localhost:3002
```

### 2. 生产部署 (Docker)

```bash
# 使用优化版 Dockerfile
docker build -f Dockerfile.prod -t mobula-web:latest --target runner-web .
docker run -p 3000:3000 mobula-web:latest
```

### 3. 生产部署 (Docker Compose)

```bash
# 使用生产配置，包含资源限制和健康检查
docker-compose -f docker-compose.prod.yml up -d
```

### 4. Kubernetes 部署

```bash
# 1. 构建并推送镜像到仓库
docker build -f Dockerfile.prod -t <registry>/mobula-web:latest --target runner-web .
docker push <registry>/mobula-web:latest

# 2. 更新 k8s/deployment.yaml 中的镜像地址

# 3. 部署到 Kubernetes
kubectl apply -f k8s/deployment.yaml

# 4. 查看部署状态
kubectl get deployments -n mobula
```

## 应用架构

```
Mobula (Turborepo Monorepo)
├── Web (端口 3000)
│   └── 主页应用
├── Login (端口 3001)
│   └── 登录应用 + i18n
└── Dashboard (端口 3002)
    └── 仪表板应用
```

## 特性

### 多阶段构建 (Multi-stage Build)
- 快速构建
- 最小化最终镜像大小
- 每个应用独立的 Docker target

### 多应用支持
- `runner-web`: Web 应用
- `runner-login`: Login 应用  
- `runner-dashboard`: Dashboard 应用

### 生产优化
- Alpine Linux 基础镜像 (18MB)
- 最小化依赖 (仅需生产依赖)
- 内置健康检查
- 资源限制和请求
- 日志轮转配置

### 自动化 CI/CD
- GitHub Actions 自动构建
- 镜像安全扫描 (Trivy)
- 自动推送到镜像仓库

## 镜像大小参考

| 应用 | 大小 | 优化后 |
|------|------|--------|
| Web | ~500MB | ~200MB |
| Login | ~500MB | ~200MB |
| Dashboard | ~500MB | ~200MB |

*实际大小取决于依赖和源代码大小*

## 环境变量配置

### Docker Compose

```bash
# 创建 .env 文件
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.example.com
```

使用环境文件：
```bash
docker-compose --env-file .env.production up
```

### Kubernetes

使用 ConfigMap 或 Secrets：
```bash
kubectl create configmap app-config --from-literal=NODE_ENV=production -n mobula
```

## 监控和日志

### Docker
```bash
# 查看日志
docker logs mobula-web

# 实时日志
docker logs -f mobula-web

# 查看容器统计
docker stats
```

### Kubernetes
```bash
# 查看 Pod 日志
kubectl logs -n mobula web-xxx

# 实时日志
kubectl logs -f -n mobula web-xxx

# 查看资源使用
kubectl top pods -n mobula
```

## 常见问题

**Q: 如何在 Docker 中运行多个应用？**
A: 使用 Docker Compose 或 Kubernetes，详见各自的指南。

**Q: 如何更新应用版本？**
A: 重新构建镜像并运行新版本容器。

**Q: 如何实现 0 停机更新？**
A: 使用 Kubernetes 的滚动更新，或 Docker Compose 配合反向代理。

**Q: 如何收集日志到外部服务？**
A: 配置日志驱动，详见 DOCKER_GUIDE.md 和 k8s/README.md。

## 更多信息

- [Docker 详细指南](./DOCKER_GUIDE.md)
- [Kubernetes 详细指南](./k8s/README.md)
- [Turborepo 文档](https://turbo.build/repo)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)

## 许可证

请参考项目根目录的 LICENSE 文件。
