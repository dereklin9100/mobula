# 🏗️ Mobula Architecture Design Guide

> **Mobula is a modern Monorepo architecture based on Turborepo, designed for building scalable multi-application systems.**

**Created**: 2026-01-03  
**Version**: 1.0.0

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Core Architecture](#core-architecture)
3. [Project Structure](#project-structure)
4. [Dependency Relationships](#dependency-relationships)
5. [Data Flow](#data-flow)
6. [Technology Stack](#technology-stack)
7. [Design Principles](#design-principles)
8. [Development Workflow](#development-workflow)

---

## System Overview

### Project Positioning

**Mobula** is a production-grade Turborepo Monorepo template supporting:
- 📱 **Multi-App**: Three independent applications - Web, Login, and Dashboard
- 🌍 **Multi-Language**: Integrated next-intl for internationalization
- 🎨 **Design System**: Unified UI component library and theme system
- 📦 **Package Management**: pnpm workspaces for shared package management

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Mobula Monorepo                          │
│                    (Turborepo + pnpm)                       │
└─────────────────────────────────────────────────────────────┘
                              ▲
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼──────┐      ┌────────▼─────────┐  ┌──────▼──────┐
│   Web App    │      │   Login App      │  │ Dashboard   │
│  (Next.js)   │      │   (Next.js)      │  │  (Next.js)  │
│  Port: 3000  │      │   Port: 3001     │  │ Port: 3002  │
└───────┬──────┘      └────────┬─────────┘  └──────┬──────┘
        │                      │                    │
        └──────────────────────┼────────────────────┘
                               │
        ┌──────────────────────┼────────────────────┐
        │                      │                    │
┌───────▼──────────┐  ┌────────▼────────┐  ┌──────▼──────────┐
│ @repo/ui         │  │ @repo/intl      │  │ @repo/tailwind  │
│ (Component Lib)  │  │ (i18n Messages) │  │ (Theme Config)  │
└──────────────────┘  └─────────────────┘  └─────────────────┘
        │                      │                    │
        └──────────────────────┼────────────────────┘
                               │
        ┌──────────────────────┼────────────────────┐
        │                      │                    │
┌───────▼─────────┐  ┌────────▼──────────┐  ┌──────▼──────────┐
│ @repo/eslint    │  │ @repo/typescript  │  │ pnpm workspaces │
│ (Lint Config)   │  │ (TS Config)       │  │ (Package Mgmt)  │
└─────────────────┘  └───────────────────┘  └─────────────────┘
```

---

## Core Architecture

### 1. Monorepo Architecture (Turborepo)

Mobula uses **Turborepo** as the Monorepo build system, providing:

#### Advantages
- ✅ **Task Orchestration**: Automatic dependency calculation with fast caching
- ✅ **Incremental Build**: Rebuild only changed packages
- ✅ **Remote Cache**: Support distributed caching, accelerate CI/CD
- ✅ **Parallel Execution**: Fully utilize multi-core CPUs

#### Task Configuration (turbo.json)

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],        // Build dependencies first
      "outputs": [".next/**"],        // Build outputs
      "cache": true
    },
    "dev": {
      "cache": false,                 // No caching for dev
      "persistent": true              // Long-running process
    }
  }
}
```

### 2. Package Management Architecture (pnpm)

Uses **pnpm workspaces** for dependency management:

```yaml
pnpm-workspace.yaml:
packages:
  - 'apps/*'      # Application directory
  - 'packages/*'  # Shared packages directory
```

#### Dependency Resolution
- `workspace:*` - Local package dependencies (auto-linked)
- `^1.0.0` - External npm dependencies

---

## Project Structure

### Directory Tree

```
mobula/
├── apps/                          # Application Layer
│   ├── web/                       # Main website app (3000)
│   │   ├── app/                   # Next.js App Router
│   │   │   ├── layout.tsx         # Global layout
│   │   │   └── page.tsx           # Home page
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   ├── tsconfig.json
│   │   └── tailwind.config.ts
│   │
│   ├── login/                     # Authentication app (3001)
│   │   ├── app/
│   │   │   └── [locale]/          # i18n dynamic routes
│   │   │       ├── layout.tsx
│   │   │       └── page.tsx
│   │   ├── i18n/                  # i18n configuration
│   │   │   ├── navigation.ts
│   │   │   ├── routing.ts
│   │   │   └── languages.ts
│   │   ├── messages/              # Translation files
│   │   │   ├── en.json
│   │   │   └── zh.json
│   │   └── proxy.ts               # Proxy configuration
│   │
│   └── dashboard/                 # Dashboard app (3002)
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   └── data.json          # Sample data
│       └── package.json
│
├── packages/                      # Shared Package Layer
│   ├── ui/                        # UI Component Library
│   │   ├── src/
│   │   │   ├── components/        # shadcn/ui components
│   │   │   ├── hooks/             # Custom React hooks
│   │   │   ├── lib/               # Utility functions
│   │   │   └── index.ts           # Public API
│   │   └── package.json
│   │
│   ├── intl/                      # Internationalization Package
│   │   ├── src/
│   │   │   ├── messages/          # Translation messages
│   │   │   ├── locales.ts         # Language list
│   │   │   └── index.ts           # Exports
│   │   ├── scripts/
│   │   │   └── sync.ts            # Message sync script
│   │   └── package.json
│   │
│   ├── tailwind-config/           # Tailwind Configuration Package
│   │   ├── tailwind.config.ts     # Theme configuration
│   │   ├── base.css               # Global styles
│   │   └── package.json
│   │
│   ├── typescript-config/         # TypeScript Configuration Package
│   │   ├── base.json              # Base configuration
│   │   ├── nextjs.json            # Next.js-specific config
│   │   └── package.json
│   │
│   └── eslint-config/             # ESLint Configuration Package
│       ├── base.js                # Base rules
│       ├── next.js                # Next.js rules
│       └── package.json
│
├── k8s/                           # Kubernetes Configuration
│   ├── deployment.yaml            # K8s deployment manifest
│   └── README.md                  # K8s deployment guide
│
├── docs/                          # Documentation
│   ├── deployment/                # Deployment documentation
│   ├── architecture/              # Architecture documentation
│   └── ...
│
├── .github/
│   └── workflows/                 # GitHub Actions CI/CD
│       └── docker.yml
│
├── Dockerfile                     # Standard build image
├── Dockerfile.prod                # Production-optimized image
├── docker-compose.yml             # Development orchestration
├── docker-compose.prod.yml        # Production orchestration
├── package.json                   # Root workspace config
├── pnpm-workspace.yaml            # pnpm workspace config
├── turbo.json                     # Turborepo config
└── tsconfig.json                  # Root TypeScript config
```

### Application Layer Explained

#### 🌐 Web Application (Port 3000)
**Purpose**: Main website, public-facing application
- Clean homepage
- Minimal dependency configuration
- Integrated UI component library

#### 🔐 Login Application (Port 3001)
**Purpose**: Authentication and authorization
- Complete i18n support (English/Chinese)
- Dynamic routing `[locale]`
- Internationalization navigation config

#### 📊 Dashboard Application (Port 3002)
**Purpose**: Data display and management
- Dashboard interface
- Data visualization
- Management features

### Package Layer Explained

#### 📦 @repo/ui
**UI Component Library**
- Collection of shadcn/ui components
- Custom React hooks
- Utility functions
- Unified UI foundation for all apps

#### 📦 @repo/intl
**Internationalization Management**
- Translation message management
- Language list definition
- Sync scripts (synchronize messages to sub-apps)

#### 📦 @repo/tailwind-config
**Design System**
- Unified Tailwind theme
- Global styles and CSS variables
- Brand colors and typography

#### 📦 @repo/typescript-config
**TypeScript Configuration Standardization**
- Base TS configuration
- Next.js-specific configuration
- Unified compilation targets and strictness

#### 📦 @repo/eslint-config
**Code Quality Management**
- Unified code rules
- Next.js ESLint best practices
- Auto-formatting configuration

---

## Dependency Relationships

### Dependency Tree

```
app:web
├── @repo/ui@workspace:*
│   ├── @radix-ui/react-*
│   ├── tailwind-merge
│   ├── class-variance-authority
│   └── ...
├── @repo/tailwind-config@workspace:*
│   └── tailwindcss@^4.1.18
├── next@16.1.0
└── react@^19.2.0

app:login
├── @repo/ui@workspace:*
├── @repo/intl@workspace:*
│   └── next-intl@^15.x
├── @repo/tailwind-config@workspace:*
├── next@16.1.0
└── react@^19.2.0

app:dashboard
├── @repo/ui@workspace:*
├── @repo/tailwind-config@workspace:*
├── next@16.1.0
├── react@^19.2.0
└── recharts@^3.6.0 (Data visualization)

@repo/ui
├── @radix-ui/react-avatar
├── @radix-ui/react-dialog
├── @radix-ui/react-tooltip
├── lucide-react (Icons)
├── @tanstack/react-table (Tables)
└── ...

@repo/intl
├── next-intl (Internationalization)
└── (Message files)

@repo/tailwind-config
├── tailwindcss@^4.1.18
├── postcss@^8.5.6
└── autoprefixer@^10.4.23

@repo/typescript-config
└── typescript@5.9.2

@repo/eslint-config
└── eslint@^9.39.1
```

### Dependency Isolation

```
Root Workspace
│
├── Application Layer
│   ├── app:web (Independent deployment)
│   ├── app:login (Independent deployment)
│   └── app:dashboard (Independent deployment)
│
└── Package Layer (Shared)
    ├── @repo/ui (Shared by all apps)
    ├── @repo/intl (Strong dependency for login)
    ├── @repo/tailwind-config (Shared by all apps)
    ├── @repo/typescript-config (Dev tools)
    └── @repo/eslint-config (Dev tools)
```

---

## Data Flow

### 1. Development Flow

```
Developer modifies code
    ↓
pnpm dev
    ↓
Turbo analyzes dependencies
    ↓
Run all app dev tasks in parallel
    ↓
Web: http://localhost:3000
Login: http://localhost:3001
Dashboard: http://localhost:3002
```

### 2. Build Flow

```
git push
    ↓
GitHub Actions triggered
    ↓
1. Run pnpm install (freeze dependencies)
2. Run turbo build (build in dependency order)
   ├── Build packages/* (shared packages)
   └── Build apps/* (applications)
3. Build Docker images (multi-target)
   ├── runner-web
   ├── runner-login
   └── runner-dashboard
4. Push to ghcr.io
```

### 3. Deployment Flow

#### Docker Compose (Local/Small-scale)
```
docker-compose up
    ↓
Start 3 containers
├── web:3000
├── login:3001
└── dashboard:3002
```

#### Kubernetes (Production/Large-scale)
```
kubectl apply -f k8s/deployment.yaml
    ↓
Create 3 Deployments
├── web-deployment (2-10 replicas)
├── login-deployment (2-10 replicas)
└── dashboard-deployment (2-10 replicas)
    ↓
HPA auto-scales based on metrics
    ↓
Load balancer routes to services
```

---

## Technology Stack

### Core Frameworks
| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.1.0 | React app framework, SSR/SSG |
| React | 19.2.0 | UI library |
| Turborepo | 2.7.2 | Monorepo build system |
| TypeScript | 5.9.2 | Type-safe language |
| pnpm | 9.0.0 | Package manager |

### UI/Styling
| Technology | Version | Purpose |
|-----------|---------|---------|
| Tailwind CSS | 4.1.18 | Utility-first CSS framework |
| shadcn/ui | Latest | Radix UI component collection |
| Radix UI | Latest | Headless UI components |
| lucide-react | 0.562.0 | Icon library |

### Internationalization
| Technology | Version | Purpose |
|-----------|---------|---------|
| next-intl | 15.x | Next.js i18n integration |

### Data & Charts
| Technology | Version | Purpose |
|-----------|---------|---------|
| @tanstack/react-table | 8.21.3 | High-performance tables |
| recharts | 3.6.0 | React charting library |

### Development Tools
| Technology | Version | Purpose |
|-----------|---------|---------|
| ESLint | 9.39.1 | Code quality checking |
| Prettier | 3.7.4 | Code formatting |
| Docker | Latest | Containerization |

### DevOps
| Technology | Version | Purpose |
|-----------|---------|---------|
| Kubernetes | 1.19+ | Container orchestration |
| GitHub Actions | Built-in | CI/CD automation |

---

## Design Principles

### 1. Separation of Concerns

```
Application Layer (App)
    ↓
    Consume components and hooks
    ↓
Package Layer (Packages)
    ↓
    Provide reusable functionality
```

**Practice**:
- Each app deploys independently with independent routing
- Shared packages only provide generic functionality
- UI component library has no business logic

### 2. Single Responsibility Principle

**Package Responsibilities**:
- `@repo/ui` - Provides UI components only
- `@repo/intl` - Handles internationalization only
- `@repo/tailwind-config` - Manages design system only
- `@repo/typescript-config` - Configures TS compilation only

### 3. DRY Principle (Don't Repeat Yourself)

**Shared**:
- Component library
- Style configuration
- Type definitions
- Build configuration

**Not Shared**:
- Business logic
- Data sources
- Routing structure

### 4. Scalability

**Supporting Growth**:
- Add new app → Copy app structure, reuse shared packages
- Add new component → Develop in @repo/ui
- Add new language → Add translations in @repo/intl

---

## Development Workflow

### 1. Local Development

```bash
# Install dependencies
pnpm install

# Run all apps and packages in development mode
pnpm dev

# Result:
# - Web: http://localhost:3000
# - Login: http://localhost:3001
# - Dashboard: http://localhost:3002

# Run specific app
pnpm --filter=web dev

# Run specific package task
pnpm --filter=@repo/ui lint
```

### 2. Code Modification Flow

```
Modify @repo/ui component
    ↓
Auto-reload all dependent apps
    ↓
See changes instantly without restart

Modify @repo/intl messages
    ↓
Run sync script
    ↓
Update translations in all apps
```

### 3. Build and Deploy

```bash
# Test build locally
pnpm build
turbo build

# Build Docker image
docker build -t mobula:latest .

# Deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Deploy with Kubernetes
kubectl apply -f k8s/deployment.yaml
```

### 4. Quality Checks

```bash
# Code quality
pnpm lint

# Type checking
pnpm check-types

# Formatting
pnpm format
```

---

## Performance Considerations

### 1. Build Performance

- **Turborepo Cache**: Avoid rebuilds, accelerate CI/CD
- **Incremental Build**: Only build changed packages
- **Parallel Tasks**: Utilize multi-core processors

### 2. Runtime Performance

- **Code Splitting**: Next.js auto code splitting
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Dynamic component imports

### 3. Container Image Optimization

- **Multi-Stage Build**: Separate Builder and Runner
- **Alpine Linux**: Minimize image size (18MB base)
- **Layer Caching**: Optimize Docker build layers

---

## Monitoring and Logging

### Application-Level Monitoring
- Next.js performance metrics
- Error capturing and reporting
- User behavior tracking

### Container-Level Monitoring
- CPU/memory usage
- Network traffic
- Log aggregation

### Kubernetes Monitoring
- Pod status and logs
- HPA scaling metrics
- Service availability

---

## Summary

Core advantages of Mobula architecture:

1. ✅ **Monorepo**: Unified management of multi-app and shared packages
2. ✅ **Turborepo**: Efficient task orchestration and caching
3. ✅ **Type Safety**: Complete TypeScript support
4. ✅ **Design System**: Unified UI and styling
5. ✅ **Internationalization**: Built-in i18n support
6. ✅ **Deployment Flexibility**: Docker + Kubernetes
7. ✅ **Extensibility**: Easy to add new apps and features
8. ✅ **Developer Experience**: Fast feedback loops

---

**Related Documentation**:
- 📖 [Deployment Guide](../deployment/README_DEPLOYMENT_EN.md)
- 🐳 [Docker Guide](../deployment/DOCKER_GUIDE_EN.md)
- ☸️ [Kubernetes Guide](../deployment/k8s/README_EN.md)

