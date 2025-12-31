# Mobula

**A modern Turborepo starter for scalable Next.js applications.**
**一个用于构建可规模化 Next.js 应用的现代化 Turborepo 模板。**

---

## ✨ What is Mobula?

**Mobula** is a production-ready **Turborepo monorepo template** built with:

* **Next.js 16 (App Router)**
* **React 19**
* **Tailwind CSS v4**
* **shadcn/ui**
* **next-intl (i18n)**
* **pnpm workspaces**

It is designed for **multi-app, multi-language, long-term scalable projects**.

**Mobula** 是一个**可直接用于生产的 Monorepo 模板**，专为：

* 多应用（Dashboard / Web / Login）
* 多语言（i18n）
* 多主题（Design System）
* 长期演进的大型项目

而设计。

---

## 🚀 Key Features | 核心特性

### 🧱 Monorepo Architecture

* Clear boundary between **apps** and **packages**
* Shared UI, theme, lint, TypeScript config
* No implicit coupling

### 🎨 Design System Ready

* Centralized Tailwind v4 theme
* CSS Variables based theming
* shadcn/ui friendly

### 🌍 Internationalization

* `next-intl` at app level
* Centralized message source (`packages/intl`)
* Auto-sync messages to sub apps

### ⚡ Developer Experience

* Fast builds with Turborepo cache
* Consistent tooling & conventions
* Easy onboarding with checklist & guides

---

## 📁 Project Structure

```bash
mobula
├── apps        # Next.js applications
│   ├── web
│   ├── dashboard
│   └── login
├── packages    # Shared infrastructure
│   ├── ui
│   ├── tailwind-config
│   ├── intl
│   ├── eslint-config
│   └── typescript-config
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## 🧠 Design Philosophy | 设计理念

* **Apps focus on business**
* **Packages focus on capabilities**
* **UI is stateless**
* **Config is centralized**
* **Sharing is non-intrusive**

> 子项目只“使用”能力，不“定义”能力
> Packages 永远不依赖具体 App

---

## ▶️ Getting Started | 快速开始

```bash
pnpm install
pnpm dev
```

Run a specific app:

```bash
pnpm dev --filter=login
```

---

## 📘 Documentation | 文档

* 📖 **Chinese (详细中文指南)**
  👉 [`README_ZH.md`](./README_ZH.md)

* 📖 **English (Detailed English Guide)**
  👉 [`README_EN.md`](./README_EN.md)

The detailed docs include:

* Architecture design rationale
* App creation checklist
* UI / Tailwind / i18n conventions
* Team development guidelines

---

## 🎯 Who is this for?

* Teams building **multiple Next.js apps**
* Projects needing **design system + i18n**
* Long-term products (not demo-only)
* Teams who care about **structure & consistency**

---

## 📄 License

MIT

---

