# Turborepo 开发指南

> 基于 **Turborepo + Next.js 16 + Tailwind CSS v4 + Shadcn UI + Next-intl**
> 

## 🎯 设计目标

采用 **Turborepo Monorepo 架构**

1. 代码复用最大化
2. 边界清晰、职责单一
3. 子应用自治，但共享基础设施
4. 避免“隐式耦合”和“配置污染”
5. 支持长期规模化（多 App、多语言、多主题）

---

## ❓ 为什么使用 Turborepo

- 跨项目共享能力强
    - UI 组件
    - Tailwind 主题
    - 国际化文案
    - ESLint / TypeScript 配置
- 一致的工程规范
- 原子级缓存 & 并行构建
- 避免版本漂移（Version Drift）

Turborepo 的增量缓存保证了：

- 只构建被修改的 package
- 子 app 之间不会互相污染
- CI / 本地开发速度显著提升

---

## 🏗️ 项目结构

> apps = 产品
> 
> 
> packages = 基础设施 / 能力模块
> 

```
Turborepo
├── apps
│   ├── dashboard (Next.js App)
│   ├── login (Next.js App)
│   └── web (Next.js App)
├── packages
│   ├── eslint-config
│   ├── intl
│   ├── tailwind-config
│   ├── typescript-config
│   └── ui
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── turbo.json
```

---

## 📦 Packages 设计说明

- 1️⃣ eslint-config
    
    ```
    eslint-config
    ├── base.js // 通用 ESLint 基础规则
    ├── next.js // Next.js 专用规则（app router / rsc 友好）
    ├── react-internal.js // 内部 React / UI 组件规范
    └── package.json
    ```
    
    **职责**
    
    - 提供统一的 ESLint 规则
    - 覆盖基础 JS / TS、React、Next.js
    
    **设计原则**
    
    - 规则集中管理
    - 禁止在 app 内随意新增 ESLint 规则
    
    **设计收益**
    
    - 所有 app / package 使用同一套 lint 标准
    - 避免规则漂移（rule drift）
    - ESLint 配置只维护一份
- 2️⃣ typescript-config
    
    ```
    typescript-config
    ├── base.json //turborepo 通用 TS 基础配置
    ├── nextjs.json // Next.js 项目专用配置
    ├── react-library.json // UI、hooks、utils 等库配置
    └── package.json 
    ```
    
    **职责**
    
    - 提供统一的 tsconfig 基础模板
    - 区分base、react-library、nextjs
    
    **设计原则**
    
    - TS 配置不可散落在各 app
    - 子项目只需 `extends`
    
    **设计收益**
    
    - 避免每个项目重复写 tsconfig，确保：
        - 路径解析一致
        - JSX / RSC 行为一致
        - 类型生成策略一致
    - 避免某个 app 放宽 TS 规则导致整体质量下降
    
- 3️⃣ tailwind-config
    
    ```
    tailwind-config
    ├── base.css //提供基本样式
    ├── postcss.config.mjs // v4 的 PostCSS 插件配置
    ├── tailwind.config.ts // 统一 theme、content 扫描策略
    └── package.json
    ```
    
    **职责**
    
    - 提供跨 App 共享的 Tailwind v4 设计系统基础
    - 提供跨 package 的扫描策略
    
    **设计原则**
    
    - Tailwind 只在 app 层编译
    - UI 组件不引入 Tailwind
    - 主题完全由 CSS Variables 驱动
    
    **设计收益**
    
    - 单一设计源（Single Source of Truth）
    - UI package 不和 Tailwind 强绑定
    - 将来支持多主题 / 白标（white-label）非常容易
- 4️⃣ ui
    
    ```
    ui
    ├── scripts // 辅助脚本
    ├── src
    │   ├── components // 组件库
    │   │   │   └── base // shadcn 基础组件
    │   │   └── [custom components] // 基于 shadcn 的复合组件
    │   ├── hooks // UI 相关的 hooks
    │   ├── lib // 工具函数（cn、format 等）
    │   ├── providers // UI Provider（Theme 等）
    │   ├── styles // shadcn 依赖的基础样式
    │   └── index.ts
    ├── components.json
    ├── eslint.config.mjs
    ├── package.json
    └── tsconfig.json
    ```
    
    **职责**
    
    - 提供纯 UI 能力 (components、hooks、lib、providers)
    - 不包含任何业务逻辑
    
    **设计原则**
    
    - UI 是无状态、无业务的
    - UI 不关心国际化
    - UI 不关心路由
    - UI 不负责 Tailwind 编译
    
    **设计收益**
    
    - 子 app 可按需引用
    - 不易出现“UI 改动导致 App 崩”的情况
    - UI 包可以未来独立发布
    
- 5️⃣ intl
    
    ```
    intl
    ├── src
    │    ├── index.ts // 对外导出 messages / locales
    │    ├── locales.ts // 语言单一来源
    │    └── messages // 文案
    │        ├── en.json
    │        ├── kr.json
    │        └── zh.json
    └── package.json
    ```
    
    **职责**
    
    - 只负责国际化文案
    - 不依赖 next-intl
    - 不包含运行时代码
    
    **设计原则**
    
    - 文案与 App 解耦，文案只是“数据”，而不是“逻辑”
    - intl package 是「语言数据源」
    - app 是「运行时载体」
    - 不破坏 next-intl 的运行逻辑跟依赖
        - next-intl 依赖 Next.js App Router
        - proxy / headers / cookies 只能在 app 层
        - 放到 package 可能会导致：
            - 无法 tree-shake
            - 类型推断混乱
            - Turbopack / RSC 不稳定
    
    **目标**
    
    - 文案统一管理
    - 多 app 自动共享
    - 支持后期自动化同步 / 校验
    
    **如何使用**
    
    ```bash
    # 根目录中运行
    # 同步到全部 sub apps
    pnpm run sync-intl
    
    # 同步到指定 sub app
    pnpm run sync-intl [sub-app]
    ```
    

---

## 🚀 如何添加新的子项目

- 1️⃣ 初始化
    
    ```bash
    cd apps
    pnpm create next-app@latest [sub-app] --yes
    
    # 返回根目录，同步依赖
    cd ..
    pnpm install
    ```
    
- 2️⃣ 删除 [sub-app] 的以下文件
    1. pnpm-lock.yaml
    2. pnpm-workspace.yaml
    3. README.md
- 3️⃣ 修改 [sub-app] 以下文件
    1. *apps/sub-app/package.json*
        
        ```json
        {
          "name": "sub-app",
          "version": "0.1.0",
          "type": "module",
          "private": true,
          "scripts": {
            "dev": "next dev --port 3002", // 指定端口
            "build": "next build",
            "start": "next start",
            "lint": "eslint --max-warnings 0",
            "check-types": "next typegen && tsc --noEmit"
          },
          "dependencies": {
            "@repo/ui": "workspace:*",
            "next": "16.1.1",
            "react": "19.2.3",
            "react-dom": "19.2.3"
          },
          "devDependencies": {
            "@repo/tailwind-config": "workspace:*",
            "@repo/eslint-config": "workspace:*",
            "@repo/typescript-config": "workspace:*",
            "@types/node": "^22.15.3",
            "@types/react": "19.2.2",
            "@types/react-dom": "19.2.2",
            "eslint": "^9.39.1",
            "typescript": "5.9.2"
          }
        }
        ```
        
        - ⚠️ Workspace 依赖放置规范
            
            凡是会被 React / Next.js 代码 import 的 workspace 包，必须放在 `dependencies`
            
            - 如：`@repo/ui`
            
            凡是仅用于构建、检查、生成的 workspace 包，必须放在 `devDependencies`
            
            - 如：`@repo/eslint-config`
            - 如：`@repo/typescript-config`
            - 如：`@repo/tailwind-config`
            
            禁止为了“简化”而将所有 workspace 依赖统一放入同一个依赖区间
            
    2. *apps/sub-app/eslint.config.mjs*
        
        ```jsx
        import { nextJsConfig } from "@repo/eslint-config/next-js";
        
        /** @type {import("eslint").Linter.Config[]} */
        export default nextJsConfig;
        ```
        
    3. *apps/sub-app/next.config.ts*
        
        ```tsx
        import type { NextConfig } from "next";
        
        const nextConfig: NextConfig = {
          transpilePackages: ["@repo/ui", "@repo/tailwind-config"],
        };
        
        export default nextConfig;
        ```
        
    4. *apps/sub-app/postcss.config.mjs*
        
        ```jsx
        export default {
          plugins: {
            "@tailwindcss/postcss": {},
            autoprefixer: {},
          },
        };
        ```
        
    5. *apps/sub-app/tailwind.config.ts*
        
        ```tsx
        import tailwindConfig from "@repo/tailwind-config/tailwind.config";
        import type { Config } from "tailwindcss";
        
        const config: Config = {
          presets: [tailwindConfig],
          content: ["./src/**/*.{js,ts,jsx,tsx}"],
        };
        
        export default config;
        ```
        
    6. *apps/sub-app/tsconfig.json*
        
        ```json
         {
          "extends": "@repo/typescript-config/nextjs.json",
          "compilerOptions": {
            "plugins": [
              {
                "name": "next"
              }
            ],
            "baseUrl": ".",
            "paths": {
              "@/*": ["./*"],
              "@repo/ui/*": ["../../packages/ui/src/*"]
            }
          },
          "include": [
            "**/*.ts",
            "**/*.tsx",
            "next-env.d.ts",
            "next.config.ts",
            ".next/types/**/*.ts"
          ],
          "exclude": [
            "node_modules"
          ]
        }
        
        ```
        
    
- 4️⃣ 添加 package/tailwind-config 的上下文
    
    ```tsx
    import type { Config } from "tailwindcss";
    
    const config: Config = {
      content: [
        ...
        "../../apps/[sub-app]/src/**/*.{js,ts,jsx,tsx}" // 新增上下文
      ],
      theme: {
        extend: {},
      },
    };
    
    export default config;
    ```
    
- 5️⃣ 添加基础/主题样式
    1. 新增 `apps/[sub-app]/styles/globals.css`
        
        ```css
        @import "@repo/tailwind-config/base.css"; // ‼️ 必须在第一行
        @import "tailwindcss";
        @source "../../../packages/ui/src/**/*.{ts,tsx}"; // ‼️ 必须添加 source
        
        // 以下是主题配置，会覆盖 base.css
        :root {
        	...
        } 
        
        .dark {
        	...
        } 
        
        @theme inline {
        	...
        } 
        ```
        
    2. 在 `apps/dashboard/app/layout.tsx` 引入
        
        ```tsx
        import type { Metadata } from "next";
        import "../styles/globals.css"; // import css
        
        ...
        ```
        
- 6️⃣ 如何在子项目中引用 `package/ui` 的组件
    1. 使用 `@repo/ui/components/base/[name]` 引入 shadcn 基础组件
    2. 使用 `@repo/ui/components/[name]` 引入基于 shadcn 的复合组件
    
    > 新的 sub-app 在 import 时可能会提示 `@repo/[package]` 没找到的情况，在根目录运行 `pnpm install` 同步依赖即可
    > 
    
    ```tsx
    import { Button } from "@repo/ui/components/base/button"
    import { MainSidebar } from "@repo/ui/components/sidebar/main-sidebar"
    import { SidebarInset, SidebarProvider, SidebarTrigger } from "@repo/ui/components/base/sidebar"
    
    export default function Page() {
      return (
        <SidebarProvider>
          <MainSidebar />
          <SidebarInset className="bg-white py-2">
            <Button> Button <Button />
          </SidebarInset>
        </SidebarProvider>
      )
    }
    ```
    
- 7️⃣ 如何在子项目中使用主题切换
    1. 修改 `apps/login/app/layout.tsx` ，添加 `<ThemeProvider>… </ThemeProvider>`
        
        ```tsx
        import type { Metadata } from "next";
        import "../styles/globals.css";
        import { ThemeProvider } from "@repo/ui/providers/theme-provider"; // 引入 @repo/ui 的 theme-provider
        
        ... 
        
        export default function RootLayout({
          children,
        }: Readonly<{
          children: React.ReactNode;
        }>) {
          return (
          <html lang="en" suppressHydrationWarning>
                <body>
                  {/* Theme Provider */}
                  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                    {children}
                  </ThemeProvider>
                </body>
            </html>
          );
        }
        
        ```
        
    2. 在页面/导航组件中添加 `<ModeToggle />`
        
        ```tsx
        import { ModeToggle } from "@repo/ui/components/modeToggle" // 引入 @repo/ui 的 modeToggle
        
        export default function Page() {
          return (
            <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
              <div className="absolute top-4 right-4 md:top-8 md:right-8">
                <ModeToggle />
              </div>
            </div>
          )
        }
        ```
        
- 8️⃣ 如何为子项目添加多语言支持
    1. 安装依赖
        
        ```bash
        cd apps/[sub-app]
        pnpm add next-intl
        # 如果在根目录 >> pnpm add next-intl --filter [sub-app] 
        
        # 在根目录安装 Country Flag
        pnpm add country-flag-icons -w
        pnpm install
        ```
        
        ‼️ 禁止在根目录运行 `pnpm add next-intl`
        
        ‼️ 禁止在 packages/intl 运行 `pnpm add next-intl`
        
    2. 按 Next-intl 官方指南完成配置
        
        [https://next-intl.dev/docs/getting-started/app-router](https://next-intl.dev/docs/getting-started/app-router)
        
        [https://next-intl.dev/docs/routing/setup](https://next-intl.dev/docs/routing/setup)
        参考文件结构
        
        ```
        sub-app
        ├── app
        │   └── [locale]
        │        ├── layout.tsx
        │        └── page.tsx
        ├── i18n
        │   ├── languages.ts // 配置语言选择项
        │   ├── navigation.ts
        │   ├── request.ts
        │   └── routing.ts
        ├── messages
        │   ├── en.json
        │   └── zh.json
        ├── proxy.ts
        ├── ...
        ```
        
    3. 在根目录中运行 `pnpm run sync-intl`或 `pnpm run sync-intl [sub-app]` 同步语言文案
    4. 页面示例
        
        ```tsx
        "use client";
        
        import { useLocale } from "next-intl"
        import { useTranslations } from "next-intl"
        
        import { LANGUAGES } from "@/i18n/languages"
        import { usePathname, useRouter } from "next/navigation"
        import { ModeToggle } from "@repo/ui/components/modeToggle"
        import { LanguageSwitcher } from "@repo/ui/components/languageSwitcher"
        
        export default function Page() {
        
          const locale = useLocale()
          const router = useRouter()
          const currentPathname = usePathname()
          const t = useTranslations("home")
        
          const handleLanguageChange = (value: string) => {
            router.push(currentPathname.replace(currentPathname, value))
          }
        
          return (
            <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
              <div className="absolute top-4 right-4 md:top-8 md:right-8">
                <div className="flex items-center gap-4">
                  <ModeToggle />
                  <LanguageSwitcher value={locale} languages={LANGUAGES} onChange={(value) => handleLanguageChange(value)} />
                </div>
              </div>
              <div className="w-full max-w-xl">
                <div>{t("title")}</div>
              </div>
            </div>
          )
        }
        
        ```
        
        > LanguageSwitcher 不处理实际逻辑，只负责展示 & 交互，新增语言选择项在@/i18n/languages.ts 中添加
        > 
    

---

## ⚡️ 启动项目

```bash
# 根目录下运行

# 启动
pnpm dev
# or >> pnpm exec turbo dev

# 指定
pnpm dev --filter=[sub-app]
# or >> pnpm exec turbo dev --filter=[sub-app]

# 以下示例配置了不同主题
# 落地页示例
pnpm dev --filter=web

# Dashboard 示例
pnpm dev --filter=dashboard

# 主题切换 & 多语言选择示例
pnpm dev --filter=login
```

---

## 🗂️ 添加 Shadcn UI 基础组件

基础组件列表： [https://ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)

```bash
cd packages/ui
pnpm add-shadcn-component [name]
```

⚠️ 这个脚本会修复 Shadcn UI 当前版本在 monorepo 项目结构中的兼容性，修正基础组件在引入module 时的路径错误

- 常用组件
    1. 用户交互 & 表单
        
        ```bash
        pnpm add-shadcn-component button input checkbox radio-group switch textarea label field
        ```
        
    2. 导航 & 布局
        
        ```bash
        pnpm add-shadcn-component sidebar navigation-menu breadcrumb tabs separator
        ```
        
    3. 数据展示
        
        ```bash
        pnpm add-shadcn-component table data-table chart pagination item empty skeleton badge avatar
        ```
        
    4. 弹窗 & 反馈
        
        ```bash
        pnpm add-shadcn-component dialog drawer dropdown-menu popover tooltip progress
        ```
        

安装完新组件后，在根目录运行 `pnpm install`

---

## 📝 开发规范

用于团队在 Turborepo 多项目架构下的日常开发行为

- 🎯 确保
    - 子项目之间高度一致
    - 基础能力集中维护
    - 避免“局部修复、全局爆炸”
    - 新成员照 checklist 即可正确开发
- 1️⃣ 单一职责（Single Responsibility）
    
    
    | 层级 | 职责 |
    | --- | --- |
    | apps/* | 业务实现（路由、页面、交互、next-intl 集成） |
    | packages/ui | UI 组件 + hooks + providers |
    | packages/tailwind-config | 设计系统 / 主题 / CSS 变量 |
    | packages/intl | 文案与多语言文本 |
    | packages/eslint-config | 代码质量约束 |
    | packages/typescript-config | 类型系统约束 |
    
    ❗ 禁止 子项目自行实现 UI 组件、主题变量、基础 hooks
    
- 2️⃣ 无侵入共享（Non-intrusive Sharing）
    
    核心原则：packages 是「能力层」，apps 是「运行层」
    
    - `packages/*` 不依赖任何具体子项目
    - `apps/*` 只能消费 packages
    - `packages` 不包含任何 Next.js runtime 逻辑
    
    禁止在 `packages/*` 中
    
    - import `apps/*` 的任何代码
    - 读取子项目路径、环境变量或运行态配置
    - 假设某个 app 一定存在
    
    packages 反向依赖 apps 可能会导致
    
    - Turborepo 缓存失效
        - package 的 hash 会隐式依赖 app
        - 修改 app → package 重新构建
    - 隐式依赖（Implicit Dependency）
        - 表面上没 import，实际却被运行逻辑绑定
    - CI 构建顺序不可控
        - packages 无法独立 build
    - 循环依赖风险
        - 在 TS / RSC / Turbopack 下运行失败
    
    这样设计是为了保证
    
    - packages 可独立升级、独立测试
    - 子项目可独立演进、独立部署
    - Turborepo 缓存稳定
    - 架构边界清晰
    - 不产生循环依赖与隐式耦合
- 3️⃣ 约定优于配置（Convention over Configuration）
    - 所有子项目结构一致
    - 所有配置从 packages 引入
    - 新项目 = 复制 checklist + 微调
- 4️⃣ 子项目（apps/*）结构规范
    
    ```
    apps/sub-app
    ├── app
    │   ├── [locale]
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   └── styles
    │       └──globals.css
    ├── eslint.config.mjs
    ├── next.config.ts
    ├── package.json
    ├── postcss.config.mjs
    ├── tailwind.config.ts
    └── tsconfig.json
    ```
    
    ❌ **禁止的结构**
    
    - 在 app 外创建 pages/
    - 在子项目内创建 components/ui
    - 在子项目内存放 messages/*.json
- 5️⃣ 依赖管理规范
    
    **workspace 依赖的放置规则**
    
    | 包类型 | 放置位置 |
    | --- | --- |
    | UI / 运行期需要 | dependencies |
    | 构建 / lint / 类型 | devDependencies |
    
    **示例**
    
    ```json
    {
    	"dependencies":{
    		"@repo/ui":"workspace:*",
    		"next":"16.x",
    		"react":"19.x"
    	},
    	"devDependencies":{
    		"@repo/tailwind-config":"workspace:*",
    		"@repo/eslint-config":"workspace:*",
    		"@repo/typescript-config":"workspace:*"
    	}
    }
    ```
    
    **❌ 禁止**
    
    - 全部塞进 dependencies（影响运行体积）
    - 全部塞进 devDependencies（可能影响构建）
- 6️⃣ UI 组件开发规范（packages/ui）
    1. 组件职责
        - 只负责展示 + 最小交互
        - 不包含：
            - next-intl
            - 路由
            - 业务状态
    2. 目录规范
        
        ```
        src/components
        ├── base        # 基础原子组件（Button / Card / Input）
        ├── [composite]   # 组合组件（可选）
        ```
        
    3. 样式规范
        - 必须使用 Tailwind
        - 禁止 inline style
        - 禁止引入第三方 CSS
    4. import 规范，需使用别名
        
        ```tsx
        import { cn }from"@repo/ui/lib/utils";
        import {Button }from"@repo/ui/components/base/button";
        ```
        
        ❌ 禁止：
        
        ```tsx
        import { cn }from"../../../lib/utils";
        ```
        
    5. ❌ 禁止在 ui 中使用 useRouter / usePathname / cookies / headers
- 7️⃣ Tailwind / CSS 规范
    1. 全局样式来源：`@repo/tailwind-config/base.css`
    2. 子项目 `app/styles/globals.css`中，注意顺序：
        
        ```css
        @import"@repo/tailwind-config/base.css";
        @import "tailwindcss";
        @source "../../../packages/ui/src/**/*.{ts,tsx}";
        
        /* sub app theme */
        ```
        
- 8️⃣ 国际化（intl）开发规范
    1. 文案来源
        - 所有文案只能写在 packages/intl/messages/
        - 子项目禁止维护自己的文案 JSON
    2. 子项目职责
        - next-intl provider
        - locale routing
        - 使用 useTranslations()
    3. ❌ 禁止
        - 在组件中 hardcode 文案
        - 在 ui package 中引入 next-intl
- 9️⃣ TypeScript 规范
    1. tsconfig 来源，在子项目：
        
        ```json
        {
        	"extends":"@repo/typescript-config/nextjs.json"
        }
        ```
        
    2. 强制规则
        - strict: true
        - noImplicitAny
        - noUncheckedIndexedAccess
    3. ❌ 禁止
        - 使用 `any`
        - 关闭 strict
        - ts-ignore 无说明
- 🔟 新增子项目自检 Checklist
    1. 初始化检查
        - [ ]  package.json 依赖放置正确
        - [ ]  使用 workspace:* 引入 repo 包
        - [ ]  next.config.ts 配置了 transpilePackages
        - [ ]  tailwind.config.ts paths 正确
        - [ ]  globals.css 引入 base.css
        - [ ]  pnpm lint 无错误
        - [ ]  pnpm check-types 通过
    2. 功能检查
        - [ ]  UI 组件可正常 import
        - [ ]  Tailwind 样式生效
        - [ ]  utils / cn 正确解析
        - [ ]  next-intl 文案正常显示
        - [ ]  pnpm dev 无 workspace 警告
    3. 常见错误
        
        
        | 行为 | 后果 |
        | --- | --- |
        | 子项目复制 UI 组件 | UI 演进失控 |
        | packages 引入 next | 架构污染 |
        | 使用相对路径 import | 构建 & 类型崩溃 |
        | 修改 shared config | 影响所有项目 |
- 🤝 协作约定
    1. packages 改动必须 PR
    2. UI / theme / intl 改动必须同步通知
    3. 子项目只允许业务相关 commit

## 🎨 给 UI / 设计团队的协作建议

项目采用 **设计系统（Design System）**+ **组件化 UI** 的方式开发

设计稿 ≠ 单个页面，而是「可复用的组件集合」

- 1️⃣ 把“组件”当成第一优先级
    
    在设计时，请优先考虑：
    
    - Button（按钮）
    - Input / Select / Checkbox（表单）
    - Card / Modal / Table（容器 & 结构）
    - Sidebar / Header / Navigation（布局）
    
    ✅ 同一个组件，在不同页面反复使用，只改内容，不改样式
    
    ❌ 避免：
    
    - 为每个页面单独设计一套按钮
    - 同类型按钮大小、圆角、颜色都不一致
    
- 2️⃣ 使用 Shadcn UI 作为设计基线
    
    我们前端 UI 基于 Shadcn UI，它已经定义了：
    
    - 按钮尺寸
    - 字体层级
    - 间距规范
    - 交互状态（hover / active / disabled）
    
    👉 设计时尽量贴近 Shadcn UI 的组件结构
    
    推荐使用官方工具：
    
    - Shadcn UI Figma Kit
        
        👉 [https://ui.shadcn.com/figma](https://ui.shadcn.com/figma)
        
    
    这样可以保证：
    
    - 设计稿 ≈ 实际代码
    - 减少反复调整样式
    - 设计 & 开发沟通成本极低
    - 保障设计跟最后交付的一致性
- 3️⃣ 颜色不要“随手选”，采用主题系统
    
    项目支持明暗主题（Light / Dark） + CSS Variables
    
    比如：
    
    1. 使用 tweakcn 生成主题色（不限于该工具）
        
        👉 [https://tweakcn.com](https://tweakcn.com/)
        
    2. 导出颜色变量（如 primary / secondary / muted）
    3. 所有页面统一使用这些颜色
    
    ✅ 好处：
    
    - 一次改色，全站生效
    - 自动支持暗色模式
    - 后期支持品牌换肤（white-label）
    
    ❌ 避免：
    
    - 设计稿里出现大量“自定义颜色”
    - 用 #123456 这种硬编码颜色
- 4️⃣ 设计 ≠ 页面，设计 = 系统
    
    请优先这些内容：
    
    - 组件样式（Button / Input / Card）
    - 状态说明（hover / disabled / error）
    - 间距与层级规则
    - 字体大小 & 字重规范
    
    页面只是组件的组合结果
    
- 5️⃣  协作小提示
    
    请在设计稿中明确：
    
    - 这是【新组件】还是【已有组件的变体】
    - 是否影响全局样式
    - 是否需要支持暗色模式
    - 是否需要多语言适配（文字长度）
    
    💡 能复用的，就不要新造；能系统化的，就不要一次性设计
    
