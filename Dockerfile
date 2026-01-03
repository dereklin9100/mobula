# 使用说明 | Usage Instructions
# =====================================================================
# 此Dockerfile支持构建Turborepo monorepo中的三个Next.js应用
# This Dockerfile supports building three Next.js apps from the Turborepo monorepo
#
# 构建命令 | Build Commands:
# =====================================================================
#
# 构建web应用 (端口 3000):
# docker build -t mobula-web --target runner-web .
# docker run -p 3000:3000 mobula-web
#
# 构建login应用 (端口 3001):
# docker build -t mobula-login --target runner-login .
# docker run -p 3001:3001 mobula-login
#
# 构建dashboard应用 (端口 3002):
# docker build -t mobula-dashboard --target runner-dashboard .
# docker run -p 3002:3002 mobula-dashboard
#
# 或使用docker-compose统一部署三个应用:
# docker-compose up
#
# =====================================================================

FROM node:18-alpine AS builder

WORKDIR /app

# 安装pnpm | Install pnpm
RUN npm install -g pnpm@9.0.0

# 复制工作区配置 | Copy workspace configuration
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# 复制所有包和应用 | Copy all packages and apps
COPY packages ./packages
COPY apps ./apps

# 安装依赖 | Install dependencies
RUN pnpm install --frozen-lockfile

# 构建所有包和应用 | Build all packages and apps
RUN pnpm build

# =====================================================================
# Web应用 (端口 3000)
# =====================================================================
FROM node:18-alpine AS runner-web

WORKDIR /app

RUN npm install -g pnpm@9.0.0

ENV NODE_ENV=production

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/web ./apps/web

RUN pnpm install --frozen-lockfile --prod --filter=web

EXPOSE 3000

CMD ["pnpm", "start", "--filter=web"]

# =====================================================================
# Login应用 (端口 3001)
# =====================================================================
FROM node:18-alpine AS runner-login

WORKDIR /app

RUN npm install -g pnpm@9.0.0

ENV NODE_ENV=production

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/login ./apps/login

RUN pnpm install --frozen-lockfile --prod --filter=login

EXPOSE 3001

CMD ["pnpm", "start", "--filter=login"]

# =====================================================================
# Dashboard应用 (端口 3002)
# =====================================================================
FROM node:18-alpine AS runner-dashboard

WORKDIR /app

RUN npm install -g pnpm@9.0.0

ENV NODE_ENV=production

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/dashboard ./apps/dashboard

RUN pnpm install --frozen-lockfile --prod --filter=dashboard

EXPOSE 3002

CMD ["pnpm", "start", "--filter=dashboard"]
