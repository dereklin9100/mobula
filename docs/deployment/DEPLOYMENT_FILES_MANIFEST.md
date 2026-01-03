# Mobula Docker & Kubernetes 部署配置清单

> **创建时间**: 2026-01-03  
> **项目**: Mobula (Turborepo Next.js Monorepo)  
> **应用**: 3 个 Next.js 应用 (Web, Login, Dashboard)

---

## 📦 创建的文件列表

### Docker 相关文件

#### ✅ Dockerfile
- **标准多阶段构建文件**
- 支持 3 个 runner targets: web, login, dashboard
- 用途: 开发环境和生产初期

#### ✅ Dockerfile.prod
- **生产环境优化版本**
- 更小的镜像大小（约 200MB vs 500MB）
- 包含集成的 healthcheck
- 用途: 生产环境部署推荐

#### ✅ .dockerignore
- 优化 Docker 构建上下文
- 排除不必要的文件
- 加速构建过程

#### ✅ docker-compose.yml
- 开发环境配置
- 3 个服务: web, login, dashboard
- 基础的健康检查
- 用途: 本地开发和测试

#### ✅ docker-compose.prod.yml
- 生产环境配置
- CPU/内存限制和预留
- 日志轮转配置
- 重启策略: always
- 用途: 小规模生产部署

### Kubernetes 相关文件

```
k8s/
├── ✅ deployment.yaml (350+ 行)
│   ├─ 3 个 Deployment (web, login, dashboard)
│   ├─ 3 个 Service (LoadBalancer 类型)
│   ├─ 3 个 HorizontalPodAutoscaler (自动扩容 2-10 Pod)
│   ├─ Liveness & Readiness probes
│   ├─ 资源限制 (CPU/内存)
│   └─ 用途: 大规模生产部署
│
└── ✅ README.md (500+ 行)
    ├─ 详细的 K8s 部署指南
    ├─ 配置说明和示例
    ├─ 更新和回滚说明
    ├─ 监控和日志配置
    ├─ 故障排查指南
    └─ 生产检查清单
```

### CI/CD 工作流文件

```
.github/workflows/
└── ✅ docker.yml
    ├─ GitHub Actions 自动构建工作流
    ├─ 矩阵构建 (web, login, dashboard)
    ├─ 镜像推送到 GitHub Container Registry
    ├─ Trivy 镜像安全扫描
    ├─ 单元测试和类型检查
    └─ 用途: CI/CD 自动化部署
```

### 文档文件

#### ✅ DOCKER_GUIDE.md (300+ 行)
- Docker 部署详细指南
- 单应用/多应用部署方式
- 环境变量配置
- 性能优化建议
- 常见问题解答
- 调试和排查

#### ✅ DEPLOYMENT_README.md (200+ 行)
- 快速参考指南
- 部署方式对比
- 快速开始命令
- 常见问题速答
- 用途: 快速查阅

#### ✅ DEPLOYMENT_SUMMARY.md (6.4K)
- 完整配置总结
- 部署方式对比表
- 架构设计说明
- 快速开始命令
- 使用检查清单
- 后续优化建议

#### ✅ FINAL_SUMMARY.md
- 最终总结文档
- 核心功能说明
- 文档导航指南

---

## 🎯 主要特性

### 多阶段构建
- ✅ 快速编译 (单阶段)
- ✅ 最小化镜像 (多目标)
- ✅ 独立应用构建

### 生产优化
- ✅ Alpine Linux (18MB 基础镜像)
- ✅ 仅包含生产依赖
- ✅ 健康检查集成
- ✅ 日志轮转配置
- ✅ 资源限制设置

### 自动化部署
- ✅ GitHub Actions CI/CD
- ✅ 镜像安全扫描
- ✅ 自动测试和构建
- ✅ 推送到镜像仓库

### 高可用配置
- ✅ Kubernetes HPA (自动扩容)
- ✅ 健康检查探针
- ✅ 滚动更新策略
- ✅ 副本管理 (2-10 个 Pod)

---

## 🚀 快速开始命令

### 本地开发 - 启动所有应用

```bash
docker-compose up
```

**访问应用:**
- Web: http://localhost:3000
- Login: http://localhost:3001
- Dashboard: http://localhost:3002

### 单应用构建 (开发)

```bash
docker build -t mobula-web --target runner-web .
docker run -p 3000:3000 mobula-web
```

### 单应用构建 (生产优化)

```bash
docker build -f Dockerfile.prod -t mobula-web:prod --target runner-web .
docker run -p 3000:3000 mobula-web:prod
```

### 生产环境 (带资源限制)

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes 部署

```bash
# 1. 构建并推送镜像
docker build -f Dockerfile.prod -t <registry>/mobula-web:latest --target runner-web .
docker push <registry>/mobula-web:latest

# 2. 部署到 K8s
kubectl apply -f k8s/deployment.yaml

# 3. 查看状态
kubectl get deployments -n mobula
```

---

## 📊 部署方式对比

| 部署方式 | 适用场景 | 复杂度 | 推荐度 |
|---------|--------|--------|--------|
| 单 Docker | 单应用 | ⭐ | ⭐⭐ |
| Docker Compose | 本地开发 | ⭐⭐ | ⭐⭐⭐ |
| Docker Compose Prod | 小规模生产 | ⭐⭐ | ⭐⭐ |
| Kubernetes | 大规模生产 | ⭐⭐⭐ | ⭐⭐⭐ |
| CI/CD 自动化 | 持续交付 | ⭐⭐ | ⭐⭐⭐ |

---

## 💾 镜像大小参考

| 应用 | Dockerfile | Dockerfile.prod | 优化比例 |
|------|-----------|-----------------|---------|
| Web 应用 | ~500MB | ~200MB | ↓ 60% |
| Login 应用 | ~500MB | ~200MB | ↓ 60% |
| Dashboard 应用 | ~500MB | ~200MB | ↓ 60% |

> *实际大小取决于依赖和源代码体积*

---

## ✅ 使用检查清单

### 部署前检查
- [ ] 已安装 Docker & Docker Compose (若使用 Compose)
- [ ] 已安装 Kubernetes & kubectl (若使用 K8s)
- [ ] 已理解项目结构和应用配置
- [ ] 已准备环境变量文件

### Docker 部署
- [ ] 镜像成功构建
- [ ] 应用可通过容器端口访问
- [ ] 健康检查正常工作
- [ ] 日志输出正确

### 生产部署 (Compose)
- [ ] 配置了环境变量
- [ ] 设置了资源限制
- [ ] 配置了日志收集
- [ ] 设置了重启策略
- [ ] 测试了容器重启

### Kubernetes 部署
- [ ] 镜像推送到仓库
- [ ] 更新了镜像地址
- [ ] 配置了命名空间
- [ ] 创建了 Service
- [ ] 配置了 Ingress
- [ ] 启用了日志收集
- [ ] 启用了监控告警

---

## 📚 文档导航

### 快速参考
- **[DEPLOYMENT_README.md](./DEPLOYMENT_README.md)** - 快速查询，3-5 分钟阅读

### Docker 详细指南
- **[DOCKER_GUIDE.md](./DOCKER_GUIDE.md)** - 完整教程，15-20 分钟阅读
  - 单应用部署
  - 多应用编排
  - 环境变量配置
  - 优化建议

### Kubernetes 详细指南
- **[k8s/README.md](./k8s/README.md)** - K8s 完整教程，20-30 分钟阅读
  - 部署步骤
  - 配置管理
  - 更新策略
  - 故障排查

### 配置示例
- **[Dockerfile](./Dockerfile)** - 标准多阶段构建
- **[Dockerfile.prod](./Dockerfile.prod)** - 生产优化版本
- **[docker-compose.yml](./docker-compose.yml)** - 开发环境配置
- **[docker-compose.prod.yml](./docker-compose.prod.yml)** - 生产配置
- **[k8s/deployment.yaml](./k8s/deployment.yaml)** - K8s 清单
- **[.github/workflows/docker.yml](./.github/workflows/docker.yml)** - CI/CD 工作流

---

## 🔧 后续优化建议

### 镜像优化
- [ ] 使用 distroless 基础镜像进一步减小体积
- [ ] 启用 Docker buildx 本地缓存加速构建
- [ ] 实施镜像分层策略

### 部署优化
- [ ] 配置 Istio/Linkerd 服务网格
- [ ] 实施蓝绿部署或金丝雀发布
- [ ] 集成 ArgoCD 实现 GitOps

### 监控告警
- [ ] 集成 Prometheus + Grafana 监控
- [ ] 配置 PagerDuty 或其他告警服务
- [ ] 实施分布式追踪 (Jaeger/Zipkin)

### 安全加固
- [ ] 启用镜像签名验证
- [ ] 配置 Kubernetes 网络策略
- [ ] 实施 RBAC 权限管理
- [ ] 启用 Pod Security Policy

---

## 📞 获取帮助

遇到问题？查看对应指南:

| 问题类型 | 查看文件 |
|---------|---------|
| Docker 问题 | [DOCKER_GUIDE.md](./DOCKER_GUIDE.md) |
| Kubernetes 问题 | [k8s/README.md](./k8s/README.md) |
| 快速查询 | [DEPLOYMENT_README.md](./DEPLOYMENT_README.md) |
| 部署问题排查 | 各文件的"故障排查"章节 |
| CI/CD 问题 | [.github/workflows/docker.yml](./.github/workflows/docker.yml) 注释 |

---

## 📝 配置文件关键信息速查

### Dockerfile 关键信息
- **基础镜像**: node:18-alpine
- **pnpm 版本**: 9.0.0
- **Node 版本**: ≥18
- **构建目标**: builder, runner-web, runner-login, runner-dashboard

### Dockerfile.prod 关键信息
- **基础镜像**: node:18-alpine (更小)
- **优化**: 生产依赖 + 健康检查
- **镜像大小**: 约 200MB

### docker-compose 关键信息
- **服务数**: 3 (web:3000, login:3001, dashboard:3002)
- **网络**: 自动创建 mobula 网络
- **重启策略 (prod)**: always

### Kubernetes 关键信息
- **命名空间**: mobula
- **副本数**: 2 (默认)
- **CPU 请求**: 250m / **限制**: 500m
- **内存请求**: 256Mi / **限制**: 512Mi
- **HPA**: 2-10 副本 (70% CPU / 80% 内存 触发)

### CI/CD 关键信息
- **触发事件**: push (main, develop), pull_request, 手动触发
- **镜像仓库**: GitHub Container Registry (ghcr.io)
- **安全扫描**: Trivy
- **工作矩阵**: web, login, dashboard

---

## 📄 文件信息

| 文件 | 大小 | 说明 |
|------|------|------|
| Dockerfile | 2.9K | 标准多阶段构建 |
| Dockerfile.prod | 3.3K | 生产优化版本 |
| .dockerignore | 901B | 构建上下文优化 |
| docker-compose.yml | 1.1K | 开发环境编排 |
| docker-compose.prod.yml | 2.2K | 生产环境编排 |
| DOCKER_GUIDE.md | 5.0K | Docker 详细教程 |
| DEPLOYMENT_README.md | 4.2K | 快速参考指南 |
| DEPLOYMENT_SUMMARY.md | 6.4K | 完整配置总结 |
| FINAL_SUMMARY.md | 5.2K | 最终总结文档 |
| k8s/deployment.yaml | 350+ 行 | K8s 部署清单 |
| k8s/README.md | 500+ 行 | K8s 详细指南 |
| .github/workflows/docker.yml | - | GitHub Actions 工作流 |

---

**版本**: 1.0.0  
**创建时间**: 2026-01-03  
**维护**: GitHub Copilot
