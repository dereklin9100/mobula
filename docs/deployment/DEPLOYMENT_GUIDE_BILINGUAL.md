# Mobula Deployment Documentation - Bilingual Navigation Guide

## 📚 双语文档导航 | Bilingual Documentation Navigation

### 🇨🇳 中文版本 | Chinese Version

#### 快速导航
- **[README_DEPLOYMENT.md](./README_DEPLOYMENT.md)** - 部署文档导航指南
- **[FINAL_SUMMARY.md](./FINAL_SUMMARY.md)** - 最终总结（5分钟）
- **[DEPLOYMENT_README.md](./DEPLOYMENT_README.md)** - 快速参考指南（3分钟）

#### 详细教程
- **[DEPLOYMENT_FILES_MANIFEST.md](./DEPLOYMENT_FILES_MANIFEST.md)** - 完整文件清单和参考
- **[DOCKER_GUIDE.md](./DOCKER_GUIDE.md)** - Docker 详细教程（15-20分钟）
- **[k8s/README.md](./k8s/README.md)** - Kubernetes 详细教程（20-30分钟）

---

### 🇬🇧 English Version | 英文版本

#### Quick Navigation
- **[README_DEPLOYMENT_EN.md](./README_DEPLOYMENT_EN.md)** - Deployment Documentation Navigation Guide
- **[FINAL_SUMMARY_EN.md](./FINAL_SUMMARY_EN.md)** - Final Summary (5 minutes)
- **[DEPLOYMENT_README_EN.md](./DEPLOYMENT_README_EN.md)** - Quick Reference Guide (3 minutes)

#### Detailed Tutorials
- **[DEPLOYMENT_FILES_MANIFEST_EN.md](./DEPLOYMENT_FILES_MANIFEST_EN.md)** - Complete File Manifest and Reference
- **[DOCKER_GUIDE_EN.md](./DOCKER_GUIDE_EN.md)** - Docker Detailed Tutorial (15-20 minutes)
- **[k8s/README_EN.md](./k8s/README_EN.md)** - Kubernetes Detailed Tutorial (20-30 minutes)

---

## 📊 Documentation Overview | 文档概览

### 中文文档 | Chinese Documents

| 文档 | 时间 | 适合场景 | 深度 |
|------|------|--------|------|
| README_DEPLOYMENT.md | 5 min | 导航和快速查询 | ⭐⭐ |
| FINAL_SUMMARY.md | 5 min | 快速了解项目 | ⭐⭐ |
| DEPLOYMENT_README.md | 3 min | 快速开始 | ⭐⭐ |
| DEPLOYMENT_FILES_MANIFEST.md | 10 min | 详细清单查询 | ⭐⭐⭐ |
| DOCKER_GUIDE.md | 15-20 min | Docker 深度学习 | ⭐⭐⭐⭐ |
| k8s/README.md | 20-30 min | Kubernetes 深度学习 | ⭐⭐⭐⭐⭐ |

### English Documents | 英文文档

| Document | Time | Best For | Depth |
|----------|------|----------|-------|
| README_DEPLOYMENT_EN.md | 5 min | Navigation and quick lookup | ⭐⭐ |
| FINAL_SUMMARY_EN.md | 5 min | Quick project overview | ⭐⭐ |
| DEPLOYMENT_README_EN.md | 3 min | Quick start | ⭐⭐ |
| DEPLOYMENT_FILES_MANIFEST_EN.md | 10 min | Detailed manifest query | ⭐⭐⭐ |
| DOCKER_GUIDE_EN.md | 15-20 min | Docker deep dive | ⭐⭐⭐⭐ |
| k8s/README_EN.md | 20-30 min | Kubernetes deep dive | ⭐⭐⭐⭐⭐ |

---

## 🚀 快速开始命令 | Quick Start Commands

### 本地开发 | Local Development
```bash
docker-compose up
```

### 生产部署 | Production Deployment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes 部署 | Kubernetes Deployment
```bash
kubectl apply -f k8s/deployment.yaml
```

---

## 📁 文件结构 | File Structure

```
project-root/
├── 📍 中文导航 (Chinese Navigation)
│   ├── README_DEPLOYMENT.md
│   ├── FINAL_SUMMARY.md
│   ├── DEPLOYMENT_README.md
│   ├── DEPLOYMENT_FILES_MANIFEST.md
│   ├── DOCKER_GUIDE.md
│   └── DEPLOYMENT_SUMMARY.md
│
├── 📍 英文导航 (English Navigation)
│   ├── README_DEPLOYMENT_EN.md
│   ├── FINAL_SUMMARY_EN.md
│   ├── DEPLOYMENT_README_EN.md
│   ├── DEPLOYMENT_FILES_MANIFEST_EN.md
│   ├── DOCKER_GUIDE_EN.md
│   └── DEPLOYMENT_SUMMARY_EN.md (coming soon)
│
├── 📍 配置文件 (Configuration Files)
│   ├── Dockerfile
│   ├── Dockerfile.prod
│   ├── .dockerignore
│   ├── docker-compose.yml
│   └── docker-compose.prod.yml
│
├── 📍 Kubernetes
│   ├── k8s/deployment.yaml
│   ├── k8s/README.md
│   └── k8s/README_EN.md
│
└── 📍 CI/CD
    └── .github/workflows/docker.yml
```

---

## 🎯 场景选择指南 | Scenario Selection Guide

### 我想快速部署 | I want to deploy quickly

**中文用户**: [DEPLOYMENT_README.md](./DEPLOYMENT_README.md)  
**English Users**: [DEPLOYMENT_README_EN.md](./DEPLOYMENT_README_EN.md)

**Time**: 3 minutes | 3分钟

### 我想深入学习 Docker | I want to deep dive into Docker

**中文用户**: [DOCKER_GUIDE.md](./DOCKER_GUIDE.md)  
**English Users**: [DOCKER_GUIDE_EN.md](./DOCKER_GUIDE_EN.md)

**Time**: 15-20 minutes | 15-20分钟

### 我想深入学习 Kubernetes | I want to deep dive into Kubernetes

**中文用户**: [k8s/README.md](./k8s/README.md)  
**English Users**: [k8s/README_EN.md](./k8s/README_EN.md)

**Time**: 20-30 minutes | 20-30分钟

### 我想了解所有配置细节 | I want to understand all configuration details

**中文用户**: [DEPLOYMENT_FILES_MANIFEST.md](./DEPLOYMENT_FILES_MANIFEST.md)  
**English Users**: [DEPLOYMENT_FILES_MANIFEST_EN.md](./DEPLOYMENT_FILES_MANIFEST_EN.md)

**Time**: 10 minutes | 10分钟

---

## ✨ 主要特性 | Key Features

- ✅ **多应用支持** | Multi-app support (Web, Login, Dashboard)
- ✅ **多阶段构建** | Multi-stage build optimization
- ✅ **生产优化** | Production optimization (60% size reduction)
- ✅ **自动化部署** | Automated CI/CD with GitHub Actions
- ✅ **高可用配置** | High availability (K8s HPA, health checks)
- ✅ **双语文档** | Bilingual documentation (Chinese & English)

---

## 📞 常见问题速答 | Common Questions Quick Answers

### Docker
**中文**: [DOCKER_GUIDE.md#常见问题](./DOCKER_GUIDE.md#常见问题--faqs)  
**English**: [DOCKER_GUIDE_EN.md#frequently-asked-questions](./DOCKER_GUIDE_EN.md#frequently-asked-questions)

### Kubernetes  
**中文**: [k8s/README.md#故障排查](./k8s/README.md#故障排查--troubleshooting)  
**English**: [k8s/README_EN.md#troubleshooting](./k8s/README_EN.md#troubleshooting)

### Environment & Configuration
**中文**: [DOCKER_GUIDE.md#环境变量配置](./DOCKER_GUIDE.md#环境变量配置--environment-variables)  
**English**: [DOCKER_GUIDE_EN.md#environment-variable-configuration](./DOCKER_GUIDE_EN.md#environment-variable-configuration)

---

## 📝 文档维护信息 | Documentation Maintenance

| 类型 | 中文 | 英文 | 状态 |
|------|------|------|------|
| 快速导航 | ✅ | ✅ | 完成 |
| 快速开始 | ✅ | ✅ | 完成 |
| 详细指南 | ✅ | ✅ | 完成 |
| 文件清单 | ✅ | ✅ | 完成 |
| 最终总结 | ✅ | ✅ | 完成 |

**更新频率** | Update Frequency: 定期更新 | Regular updates

---

## 🌐 语言选择 | Language Selection

### 简体中文 | Simplified Chinese
👉 Start from [README_DEPLOYMENT.md](./README_DEPLOYMENT.md)

### English
👉 Start from [README_DEPLOYMENT_EN.md](./README_DEPLOYMENT_EN.md)

---

**Version**: 1.0.0  
**Created**: 2026-01-03  
**Supported Languages**: 中文 | English  
**Last Updated**: 2026-01-03

---

> **提示** | **Tip**: 建议中文用户从 `README_DEPLOYMENT.md` 开始，英文用户从 `README_DEPLOYMENT_EN.md` 开始。  
> **Recommendation**: Chinese users start from `README_DEPLOYMENT.md`, English users start from `README_DEPLOYMENT_EN.md`.
