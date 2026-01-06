# Docker 部署指南 | Docker Deployment Guide

## 项目概述 | Overview

Mobula 是一个基于 Turborepo 的 monorepo 模板，包含三个 Next.js 应用：
- **web** (端口 3000) - 主页应用
- **login** (端口 3001) - 登录应用，支持多语言 (i18n)
- **dashboard** (端口 3002) - 仪表板应用

## Dockerfile 选择 | Choose Your Dockerfile

### 1. Dockerfile (标准版) | Standard Version
- 用于开发和生产环境
- **Base Image**: Node.js 22 (支持 Next.js 16)
- 包含完整依赖确保运行时兼容性
- **推荐用于：开发环境、生产部署**

```bash
docker build -t mobula-web --target runner-web .
```

### 2. Dockerfile.prod (优化版) | Optimized Version
- 为生产环境优化
- **Base Image**: Node.js 22
- 包含健康检查和资源限制配置
- 启动命令优化
- **推荐用于：生产环境部署、资源受限场景**

```bash
docker build -f Dockerfile.prod -t mobula-web:prod --target runner-web .
```

> **注意**: 两个版本现在都使用 Node.js 22，以确保与 Next.js 16 的完整兼容性

## 单个应用部署 | Single App Deployment

### Web 应用 (端口 3000)

```bash
# 使用标准版 Dockerfile
docker build -t mobula-web --target runner-web .
docker run -p 3000:3000 mobula-web

# 或使用优化版 Dockerfile.prod
docker build -f Dockerfile.prod -t mobula-web:prod --target runner-web .
docker run -p 3000:3000 mobula-web:prod
```

### Login 应用 (端口 3001)

```bash
docker build -t mobula-login --target runner-login .
docker run -p 3001:3001 mobula-login
```

### Dashboard 应用 (端口 3002)

```bash
docker build -t mobula-dashboard --target runner-dashboard .
docker run -p 3002:3002 mobula-dashboard
```

## 多应用部署 | Multi-App Deployment

### 使用 Docker Compose (推荐)

```bash
# 启动所有三个应用
docker-compose up

# 后台运行
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 使用 Docker Compose (生产优化版)

```bash
# 创建 docker-compose.prod.yml 文件，修改 Dockerfile 为 Dockerfile.prod：
docker-compose -f docker-compose.prod.yml up -d
```

## 环境变量配置 | Environment Variables

在 docker-compose.yml 中添加环境变量：

```yaml
services:
  web:
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.example.com
```

或使用 .env 文件：

```bash
docker-compose --env-file .env.production up -d
```

## 健康检查 | Health Checks

Dockerfile.prod 包含内置的健康检查：

```bash
# 检查容器健康状态
docker inspect --format='{{.State.Health.Status}}' mobula-web
```

## 网络配置 | Network Configuration

### 容器间通信

使用 Docker Compose 时，容器可以通过服务名相互通信：

```bash
# 从 web 容器访问 login 容器
curl http://login:3001
```

### 外部访问

通过端口映射访问应用：
- Web: http://localhost:3000
- Login: http://localhost:3001
- Dashboard: http://localhost:3002

## 数据卷 | Volumes

如需持久化数据，可添加卷配置：

```yaml
services:
  web:
    volumes:
      - web-data:/app/data
volumes:
  web-data:
```

## 性能优化建议 | Performance Tips

1. **使用 Dockerfile.prod** - 生产环境使用优化版本
2. **镜像缓存** - 利用 Docker 层缓存，避免频繁重建
3. **多阶段构建** - 减小最终镜像大小
4. **资源限制** - 为容器设置内存和 CPU 限制：

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

## 调试 | Debugging

### 进入容器调试

```bash
# 进入运行中的容器
docker exec -it mobula-web sh

# 查看日志
docker logs mobula-web
docker logs -f mobula-web  # 实时日志
```

### 构建调试

```bash
# 查看构建日志
docker build --no-cache -t mobula-web --target runner-web .

# 进入构建阶段的容器
docker build -t mobula-web --target builder --progress=plain .
```

## 常见问题 | FAQs

### Q: Node.js 18 与 Next.js 16 兼容吗？
A: 不兼容。Next.js 16 要求 Node.js >=20.9.0。本项目已升级到 Node.js 22，确保完全兼容。

### Q: 为什么镜像大小约为 800MB？
A: Node.js 22 基础镜像 (~200MB) + Next.js 编译产物 (~150MB) + 完整依赖 (~450MB)。这是确保应用稳定运行所必需的。如需减小镜像，可考虑使用 distroless 基础镜像（需额外配置）。

### Q: Dockerfile 中为什么要复制 turbo.json？
A: turbo.json 是 Turborepo 的配置文件，构建时需要它来正确识别和构建工作区中的各个包。

### Q: 为什么 runner 阶段要复制 node_modules？
A: 为了确保 Next.js 在运行时有所有必需的依赖。即使是生产环境，Next.js 也需要某些开发时依赖（如编译器、打包器等）才能正常运行。

### Q: 如何在 Kubernetes 上部署？
A: 将 docker-compose.yml 转换为 Kubernetes manifests，或使用 Kompose：

```bash
kompose convert -f docker-compose.yml -o k8s/
```

### Q: 如何更新应用？
A: 重新构建并运行：

```bash
docker-compose down
docker-compose build
docker-compose up -d
```

### Q: 如何使用私有 npm 包？
A: 在构建时传递 npm 认证信息：

```bash
docker build --build-arg NPM_TOKEN=$NPM_TOKEN -t mobula-web .
```

然后在 Dockerfile 中使用：

```dockerfile
ARG NPM_TOKEN
RUN npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN
```

## 生产部署检查清单 | Production Checklist

- [ ] 使用 Dockerfile.prod
- [ ] 配置环境变量
- [ ] 设置资源限制
- [ ] 配置健康检查
- [ ] 设置重启策略 (`restart: always`)
- [ ] 配置日志收集
- [ ] 使用私有容器注册表
- [ ] 配置 SSL/TLS
- [ ] 设置监控告警
- [ ] 准备灾难恢复计划

## 相关文档 | References

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Turborepo Docker Guide](https://turbo.build/repo/docs/guides/tools/docker)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
