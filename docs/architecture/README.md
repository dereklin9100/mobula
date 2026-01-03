# 🏗️ 架构文档导航 | Architecture Documentation Navigation

> **了解 Mobula 的系统设计和技术架构**

**创建时间**: 2026-01-03  
**文档版本**: 1.0.0

---

## 📚 文档列表 | Documentation List

### 🇨🇳 中文版本 | Chinese Version

#### 核心文档
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Mobula 架构设计完整指南
  - 📊 系统概览和架构图
  - 🏛️ 核心架构（Turborepo + pnpm）
  - 📁 详细项目结构说明
  - 🔗 依赖关系分析
  - 📈 数据流和工作流
  - 🛠️ 技术栈详解
  - 💡 设计原则和最佳实践

**推荐阅读时间**: 30-40 分钟

---

### 🇬🇧 English Version

#### Core Documentation
- **[ARCHITECTURE_EN.md](./ARCHITECTURE_EN.md)** - Mobula Architecture Design Complete Guide
  - 📊 System overview and architecture diagrams
  - 🏛️ Core architecture (Turborepo + pnpm)
  - 📁 Detailed project structure explanation
  - 🔗 Dependency relationship analysis
  - 📈 Data flow and workflows
  - 🛠️ Technology stack details
  - 💡 Design principles and best practices

**Recommended Reading Time**: 30-40 minutes

---

## 🎯 快速导航 | Quick Navigation

### 如果我想了解... | If I want to understand...

#### 1. 项目整体结构
**中文**: [ARCHITECTURE.md#项目结构](./ARCHITECTURE.md#项目结构)  
**English**: [ARCHITECTURE_EN.md#project-structure](./ARCHITECTURE_EN.md#project-structure)

查看 Monorepo 的目录组织，应用层和包层的划分。

#### 2. Monorepo 是如何工作的
**中文**: [ARCHITECTURE.md#核心架构](./ARCHITECTURE.md#核心架构)  
**English**: [ARCHITECTURE_EN.md#core-architecture](./ARCHITECTURE_EN.md#core-architecture)

了解 Turborepo 和 pnpm workspaces 如何协作。

#### 3. 各个应用的职责
**中文**: [ARCHITECTURE.md#应用层详解](./ARCHITECTURE.md#应用层详解)  
**English**: [ARCHITECTURE_EN.md#application-layer-explained](./ARCHITECTURE_EN.md#application-layer-explained)

- Web 应用 (Port 3000)
- Login 应用 (Port 3001)
- Dashboard 应用 (Port 3002)

#### 4. 共享包的设计
**中文**: [ARCHITECTURE.md#包层详解](./ARCHITECTURE.md#包层详解)  
**English**: [ARCHITECTURE_EN.md#package-layer-explained](./ARCHITECTURE_EN.md#package-layer-explained)

- @repo/ui 组件库
- @repo/intl 国际化
- @repo/tailwind-config 主题系统
- 其他配置包

#### 5. 依赖关系
**中文**: [ARCHITECTURE.md#依赖关系](./ARCHITECTURE.md#依赖关系)  
**English**: [ARCHITECTURE_EN.md#dependency-relationships](./ARCHITECTURE_EN.md#dependency-relationships)

查看应用和包之间的依赖图。

#### 6. 开发流程
**中文**: [ARCHITECTURE.md#开发工作流](./ARCHITECTURE.md#开发工作流)  
**English**: [ARCHITECTURE_EN.md#development-workflow](./ARCHITECTURE_EN.md#development-workflow)

本地开发、构建、部署的完整流程。

#### 7. 技术栈
**中文**: [ARCHITECTURE.md#技术栈](./ARCHITECTURE.md#技术栈)  
**English**: [ARCHITECTURE_EN.md#technology-stack](./ARCHITECTURE_EN.md#technology-stack)

所有使用的框架、库和工具。

#### 8. 设计原则
**中文**: [ARCHITECTURE.md#设计原则](./ARCHITECTURE.md#设计原则)  
**English**: [ARCHITECTURE_EN.md#design-principles](./ARCHITECTURE_EN.md#design-principles)

关注点分离、单一职责等核心原则。

---

## 📊 架构总结 | Architecture Summary

### Monorepo 结构

```
Mobula Monorepo
├── apps/                # 3 个 Next.js 应用
│   ├── web              # 主网站 (3000)
│   ├── login            # 认证系统 (3001)
│   └── dashboard        # 仪表板 (3002)
│
└── packages/            # 5 个共享包
    ├── ui               # 组件库
    ├── intl             # 国际化
    ├── tailwind-config  # 主题
    ├── typescript-config
    └── eslint-config
```

### 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 框架 | Next.js | 16.1.0 |
| 语言 | React + TypeScript | 19.2.0 + 5.9.2 |
| 样式 | Tailwind CSS + shadcn/ui | 4.1.18 |
| 包管理 | pnpm + Turborepo | 9.0.0 + 2.7.2 |
| i18n | next-intl | 15.x |

### 核心特性

✅ **Monorepo**: 统一管理多应用和共享包  
✅ **类型安全**: 完整的 TypeScript 支持  
✅ **设计系统**: 统一的 UI 和样式  
✅ **国际化**: 内置 i18n 支持  
✅ **自动化**: Turborepo 高效构建和缓存  
✅ **容器化**: Docker + Kubernetes 支持  

---

## 🔄 数据流示意 | Data Flow Diagram

### 开发流程

```
修改源代码
    ↓
pnpm dev
    ↓
Turborepo 分析依赖
    ↓
并行运行应用和包的开发任务
    ↓
实时预览
├── http://localhost:3000
├── http://localhost:3001
└── http://localhost:3002
```

### 构建部署流程

```
Git Push
    ↓
GitHub Actions 触发
    ↓
pnpm install
    ↓
turbo build (缓存优化)
    ↓
Docker 多阶段构建
    ↓
推送到容器镜像仓库
    ↓
部署到生产环境
├── Docker Compose (小规模)
└── Kubernetes (大规模)
```

---

## 📖 延伸阅读 | Further Reading

### 部署相关
- 📚 [部署文档导航](../deployment/README_DEPLOYMENT.md)
- 🐳 [Docker 完整指南](../deployment/DOCKER_GUIDE.md)
- ☸️ [Kubernetes 完整指南](../deployment/k8s/README.md)
- 📦 [文件清单和配置参考](../deployment/DEPLOYMENT_FILES_MANIFEST.md)

### 快速参考
- ⚡ [快速开始](../deployment/DEPLOYMENT_README.md)
- 📋 [最终总结](../deployment/FINAL_SUMMARY.md)

---

## 🎓 学习路径建议 | Recommended Learning Path

### 初学者 | Beginners

1. **5 分钟**: 了解[项目整体结构](./ARCHITECTURE.md#项目结构)
2. **10 分钟**: 学习[Monorepo 核心概念](./ARCHITECTURE.md#核心架构)
3. **15 分钟**: 了解[三个应用的职责](./ARCHITECTURE.md#应用层详解)

### 开发者 | Developers

1. **20 分钟**: 完整阅读[架构指南](./ARCHITECTURE.md)
2. **10 分钟**: 学习[开发工作流](./ARCHITECTURE.md#开发工作流)
3. **10 分钟**: 理解[依赖关系](./ARCHITECTURE.md#依赖关系)

### 架构师 | Architects

1. **40 分钟**: 深入阅读完整架构文档
2. **20 分钟**: 分析[设计原则](./ARCHITECTURE.md#设计原则)
3. **15 分钟**: 评估[性能考虑](./ARCHITECTURE.md#性能考虑)

---

## ❓ 常见问题 | FAQ

### 为什么使用 Monorepo？

**答**: Monorepo 允许：
- 共享代码和配置
- 统一的版本管理
- 原子性提交
- 更简单的依赖管理

### 如何添加新应用？

**答**: 
1. 复制现有应用结构 (如 `apps/web`)
2. 更新 `package.json` 和应用名称
3. 复用共享包（@repo/ui, @repo/tailwind-config 等）
4. 运行 `pnpm install` 和 `pnpm dev`

### 如何修改共享组件？

**答**:
1. 在 `packages/ui/src/components` 中修改
2. 保存后自动重新加载所有依赖应用
3. 无需重启开发服务器

### 如何处理应用特定的样式？

**答**:
1. 全局样式放在 `@repo/tailwind-config`
2. 应用特定样式放在各应用的 CSS 文件
3. 使用 CSS 变量实现主题定制

---

## 📞 获取帮助 | Getting Help

- 📖 查看[完整架构文档](./ARCHITECTURE.md)
- 🐳 查看[Docker 部署指南](../deployment/DOCKER_GUIDE.md)
- ☸️ 查看[Kubernetes 部署指南](../deployment/k8s/README.md)

---

**版本**: 1.0.0  
**最后更新**: 2026-01-03  
**维护者**: Mobula Team

