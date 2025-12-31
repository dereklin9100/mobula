# Turborepo Development Guide (EN)

> Based on **Turborepo + Next.js 16 + Tailwind CSS v4 + Shadcn UI + Next-intl**
> 

## 🎯 Design Goals

Adopt a **Turborepo Monorepo architecture**:

1. Maximize code reuse
2. Clear boundaries and single responsibility
3. Each sub-app is autonomous, while sharing infrastructure
4. Avoid “implicit coupling” and “configuration pollution”
5. Support long-term scalability (multiple apps, multiple languages, multiple themes)

---

## ❓ Why Turborepo

- Strong cross-project sharing capabilities
    - UI components
    - Tailwind themes
    - i18n copy/messages
    - ESLint / TypeScript configs
- Consistent engineering standards
- Atomic caching & parallel builds
- Avoid version drift

Turborepo’s incremental caching ensures:

- Only the modified packages are built
- Sub-apps do not pollute each other
- CI and local development become significantly faster

---

## 🏗️ Project Structure

> apps = products
packages = infrastructure / capability modules
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

## 📦 Packages Design Notes

- 1️⃣ eslint-config
    
    ```
    eslint-config
    ├── base.js // common ESLint base rules
    ├── next.js // Next.js rules (app router / rsc friendly)
    ├── react-internal.js // internal React / UI component conventions
    └── package.json
    ```
    
    **Responsibilities**
    
    - Provide a unified ESLint ruleset
    - Cover base JS/TS, React, and Next.js
    
    **Design Principles**
    
    - Centralized rule management
    - Disallow adding random ESLint rules inside apps
    
    **Benefits**
    
    - All apps/packages use the same linting standard
    - Avoid rule drift
    - Maintain ESLint config only once
- 2️⃣ typescript-config
    
    ```
    typescript-config
    ├── base.json // turborepo general TS base config
    ├── nextjs.json // Next.js project config
    ├── react-library.json // libraries config (UI/hooks/utils, etc.)
    └── package.json 
    ```
    
    **Responsibilities**
    
    - Provide unified tsconfig templates
    - Separate base / react-library / nextjs
    
    **Design Principles**
    
    - TS config should not be scattered across apps
    - Sub-projects should only need `extends`
    
    **Benefits**
    
    - Avoid rewriting tsconfig in every project, ensuring:
        - consistent path resolution
        - consistent JSX/RSC behavior
        - consistent type generation strategy
    - Prevent one app from loosening TS rules and reducing overall quality
- 3️⃣ tailwind-config
    
    ```
    tailwind-config
    ├── base.css // base styles
    ├── postcss.config.mjs // PostCSS plugin config for v4
    ├── tailwind.config.ts // unified theme and content scanning strategy
    └── package.json
    ```
    
    **Responsibilities**
    
    - Provide a shared Tailwind v4 design-system foundation across apps
    - Provide a scanning strategy across packages
    
    **Design Principles**
    
    - Tailwind is compiled only at the app layer
    - UI components must not import Tailwind directly
    - Theme is fully driven by CSS variables
    
    **Benefits**
    
    - Single source of truth
    - UI package is not tightly coupled to Tailwind
    - Easy to support multi-theme / white-label in the future
- 4️⃣ ui
    
    ```
    ui
    ├── scripts // helper scripts
    ├── src
    │   ├── components // component library
    │   │   │   └── base // shadcn base components
    │   │   └── [custom components] // composite components built on shadcn
    │   ├── hooks // UI-related hooks
    │   ├── lib // utilities (cn, format, etc.)
    │   ├── providers // UI providers (Theme, etc.)
    │   ├── styles // base styles required by shadcn
    │   └── index.ts
    ├── components.json
    ├── eslint.config.mjs
    ├── package.json
    └── tsconfig.json
    ```
    
    **Responsibilities**
    
    - Provide pure UI capabilities (components, hooks, lib, providers)
    - Contains no business logic
    
    **Design Principles**
    
    - UI is stateless and business-agnostic
    - UI does not handle i18n
    - UI does not handle routing
    - UI does not compile Tailwind
    
    **Benefits**
    
    - Sub-apps can import on demand
    - Less risk of “UI changes breaking apps”
    - UI package can be published independently in the future
- 5️⃣ intl
    
    ```
    intl
    ├── src
    │    ├── index.ts // exports messages / locales
    │    ├── locales.ts // single source of truth for locales
    │    └── messages // copy
    │        ├── en.json
    │        ├── kr.json
    │        └── zh.json
    └── package.json
    ```
    
    **Responsibilities**
    
    - Only manages i18n messages
    - Does not depend on next-intl
    - Contains no runtime code
    
    **Design Principles**
    
    - Messages are decoupled from apps. Messages are “data”, not “logic”.
    - intl package is the “language data source”
    - apps are the “runtime host”
    - Do not break next-intl’s runtime logic and dependency constraints:
        - next-intl depends on Next.js App Router
        - proxy / headers / cookies must live at the app layer
        - Moving runtime logic into packages may cause:
            - no tree-shaking
            - confusing type inference
            - unstable Turbopack / RSC behavior
    
    **Goals**
    
    - Centralized message management
    - Automatically shared across multiple apps
    - Enable future automation for syncing/validation
    
    **How to use**
    
    ```bash
    # Run in repo root
    # Sync to all sub apps
    pnpm run sync-intl
    
    # Sync to a specific sub app
    pnpm run sync-intl [sub-app]
    ```
    

---

## 🚀 How to Add a New Sub-App

- 1️⃣ Initialize
    
    ```bash
    cd apps
    pnpm create next-app@latest [sub-app] --yes
    
    # back to repo root, sync dependencies
    cd ..
    pnpm install
    ```
    
- 2️⃣ Delete the following files in [sub-app]
    1. pnpm-lock.yaml
    2. pnpm-workspace.yaml
    3. [README.md](http://README.md)
- 3️⃣ Modify the following files in [sub-app]
    1. *apps/sub-app/package.json*
        
        ```json
        {
          "name": "sub-app",
          "version": "0.1.0",
          "type": "module",
          "private": true,
          "scripts": {
            "dev": "next dev --port 3002", // specify port
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
        
        - ⚠️ Workspace dependency placement rules
        - Any workspace package imported by React / Next.js code must go into `dependencies`
            - e.g. `@repo/ui`
        - Workspace packages used only for build/lint/type-check/generation must go into `devDependencies`
            - e.g. `@repo/eslint-config`
            - e.g. `@repo/typescript-config`
            - e.g. `@repo/tailwind-config`
        - Do not “simplify” by putting all workspace deps into a single section
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
            "plugins": [{ "name": "next" }],
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
          "exclude": ["node_modules"]
        }
        ```
        
    
- 4️⃣ Add context paths in package/tailwind-config
    
    ```tsx
    import type { Config } from "tailwindcss";
    
    const config: Config = {
      content: [
        ...
        "../../apps/[sub-app]/src/**/*.{js,ts,jsx,tsx}" // add context
      ],
      theme: {
        extend: {},
      },
    };
    
    export default config;
    ```
    
- 5️⃣ Add base/theme styles
    1. Create `apps/[sub-app]/styles/globals.css`
        
        ```css
        @import "@repo/tailwind-config/base.css"; // ‼️ must be first line
        @import "tailwindcss";
        @source "../../../packages/ui/src/**/*.{ts,tsx}"; // ‼️ must add source
        
        // theme configs below will override base.css
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
        
    2. Import it in `apps/dashboard/app/layout.tsx`
        
        ```tsx
        import type { Metadata } from "next";
        import "../styles/globals.css"; // import css
        
        ...
        ```
        
- 6️⃣ How to import components from `package/ui` in a sub-app
    1. Import shadcn base components via `@repo/ui/components/base/[name]`
    2. Import composite components via `@repo/ui/components/[name]`
    
    > New sub-apps may get an import error `@repo/[package]` not found. Run `pnpm install` in repo root to sync dependencies.
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
    
- 7️⃣ How to enable theme switching in a sub-app
    1. Update `apps/login/app/layout.tsx` and add `<ThemeProvider>…</ThemeProvider>`
        
        ```tsx
        import type { Metadata } from "next";
        import "../styles/globals.css";
        import { ThemeProvider } from "@repo/ui/providers/theme-provider"; // import theme-provider from @repo/ui
        
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
        
    2. Add `<ModeToggle />` in pages/navigation components
        
        ```tsx
        import { ModeToggle } from "@repo/ui/components/modeToggle" // import modeToggle from @repo/ui
        
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
        
- 8️⃣ How to add multi-language support in a sub-app
    1. Install dependencies
        
        ```bash
        cd apps/[sub-app]
        pnpm add next-intl
        # If in repo root: pnpm add next-intl --filter [sub-app] 
        
        # Install Country Flag icons in repo root
        pnpm add country-flag-icons -w
        pnpm install
        ```
        
        ‼️ Do not run `pnpm add next-intl` in repo root
        
        ‼️ Do not run `pnpm add next-intl` in packages/intl
        
    2. Follow the official Next-intl guide to complete configuration
        
        [https://next-intl.dev/docs/getting-started/app-router](https://next-intl.dev/docs/getting-started/app-router)
        
        [https://next-intl.dev/docs/routing/setup](https://next-intl.dev/docs/routing/setup)
        Reference file structure:
        
        ```
        sub-app
        ├── app
        │   └── [locale]
        │        ├── layout.tsx
        │        └── page.tsx
        ├── i18n
        │   ├── languages.ts // language options
        │   ├── navigation.ts
        │   ├── request.ts
        │   └── routing.ts
        ├── messages
        │   ├── en.json
        │   └── zh.json
        ├── proxy.ts
        ├── ...
        ```
        
    3. Run `pnpm run sync-intl` or `pnpm run sync-intl [sub-app]` in repo root to sync messages
    4. Page example
        
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
              <div className="absolute top-4 right-4 md:top-8 md:right--8">
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
        
        > LanguageSwitcher does not implement business logic. It only handles UI and interaction. Add new language options in `@/i18n/languages.ts`.
        > 

---

## ⚡️ Start the Project

```bash
# Run in repo root

# start
pnpm dev
# or >> pnpm exec turbo dev

# target a specific app
pnpm dev --filter=[sub-app]
# or >> pnpm exec turbo dev --filter=[sub-app]

# examples with different themes
# Landing page example
pnpm dev --filter=web

# Dashboard example
pnpm dev --filter=dashboard

# Theme toggle & language switch example
pnpm dev --filter=login
```

---

## 🗂️ Add Shadcn UI Base Components

Base component list: [https://ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)

```bash
cd packages/ui
pnpm add-shadcn-component [name]
```

⚠️ This script fixes compatibility issues of the current Shadcn UI version in a monorepo structure, and corrects import paths when consuming modules.

- Common components
    1. User interaction & forms
        
        ```bash
        pnpm add-shadcn-component button input checkbox radio-group switch textarea label field
        ```
        
    2. Navigation & layout
        
        ```bash
        pnpm add-shadcn-component sidebar navigation-menu breadcrumb tabs separator
        ```
        
    3. Data display
        
        ```bash
        pnpm add-shadcn-component table data-table chart pagination item empty skeleton badge avatar
        ```
        
    4. Dialogs & feedback
        
        ```bash
        pnpm add-shadcn-component dialog drawer dropdown-menu popover tooltip progress
        ```
        

After installing new components, run `pnpm install` in repo root.

---

## 📝 Development Conventions

These conventions guide daily development in a Turborepo multi-app architecture.

- 🎯 Ensure
    - High consistency across sub-apps
    - Central maintenance of core capabilities
    - Avoid “local fix, global explosion”
    - New members can develop correctly by following the checklist
- 1️⃣ Single Responsibility
    
    
    | Layer | Responsibility |
    | --- | --- |
    | apps/* | Business implementation (routing, pages, interactions, next-intl integration) |
    | packages/ui | UI components + hooks + providers |
    | packages/tailwind-config | Design system / themes / CSS variables |
    | packages/intl | Copy and multi-language messages |
    | packages/eslint-config | Code quality constraints |
    | packages/typescript-config | Type-system constraints |
    
    ❗ Do not implement UI components, theme variables, or base hooks inside sub-apps.
    
- 2️⃣ Non-intrusive Sharing
    
    Core principle: packages are the “capability layer”, apps are the “runtime layer”.
    
    - `packages/*` must not depend on any specific sub-app
    - `apps/*` can only consume packages
    - `packages` must not contain any Next.js runtime logic
    
    Do not do the following inside `packages/*`:
    
    - import any code from `apps/*`
    - read sub-app paths, env vars, or runtime config
    - assume any specific app must exist
    
    Reverse dependency (packages → apps) can cause:
    
    - Turborepo cache invalidation
    - implicit dependencies
    - uncontrollable CI build order
    - circular dependency risks
    
    This design ensures:
    
    - packages can be upgraded and tested independently
    - sub-apps can evolve and deploy independently
    - stable Turborepo caching
    - clear architectural boundaries
    - no circular dependencies or implicit coupling
- 3️⃣ Convention over Configuration
    - All sub-apps share the same structure
    - All configs are imported from packages
    - New projects = copy checklist + small tweaks
- 4️⃣ Sub-app (apps/*) Structure Standard
    
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
    
    ❌ Forbidden structures
    
    - create pages/ outside app
    - create components/ui inside the sub-app
    - store messages/*.json inside sub-app
- 5️⃣ Dependency Management
    
    **Workspace dependency placement rules**
    
    | Package type | Where to place |
    | --- | --- |
    | UI / runtime required | dependencies |
    | build / lint / types | devDependencies |
    
    **Example**
    
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
    
    **❌ Forbidden**
    
    - put everything into dependencies (increases runtime size)
    - put everything into devDependencies (may break build)
- 6️⃣ UI Component Development Rules (packages/ui)
    1. Component responsibilities
        - Only presentation + minimal interactions
        - Must not include: next-intl, routing, business state
    2. Folder conventions
        
        ```
        src/components
        ├── base        # atomic base components (Button / Card / Input)
        ├── [composite]   # composite components (optional)
        ```
        
    3. Styling rules
        - Must use Tailwind
        - No inline style
        - No third-party CSS imports
    4. Import rules: must use aliases
        
        ```tsx
        import { cn }from"@repo/ui/lib/utils";
        import {Button }from"@repo/ui/components/base/button";
        ```
        
        ❌ Forbidden:
        
        ```tsx
        import { cn }from"../../../lib/utils";
        ```
        
    5. ❌ Do not use useRouter / usePathname / cookies / headers inside ui
- 7️⃣ Tailwind / CSS Rules
    1. Global styles source: `@repo/tailwind-config/base.css`
    2. In sub-app `app/styles/globals.css`, ensure the order:
    
    ```css
    @import"@repo/tailwind-config/base.css";
    @import "tailwindcss";
    @source "../../../packages/ui/src/**/*.{ts,tsx}";
    
    /* sub app theme */
    ```
    
- 8️⃣ i18n (intl) Rules
    1. Message source
        - All messages must live in packages/intl/messages/
        - Sub-apps must not maintain their own message JSON
    2. Sub-app responsibilities
        - next-intl provider
        - locale routing
        - useTranslations()
    3. ❌ Forbidden
        - hardcode text in components
        - import next-intl inside ui package
- 9️⃣ TypeScript Rules
    1. tsconfig source in sub-app:
        
        ```json
        {
        	"extends":"@repo/typescript-config/nextjs.json"
        }
        ```
        
    2. Enforced rules
        - strict: true
        - noImplicitAny
        - noUncheckedIndexedAccess
    3. ❌ Forbidden
        - use `any`
        - turn off strict
        - ts-ignore without explanation
- 🔟 New Sub-App Self-check Checklist
    1. Initialization checks
        - [ ]  package.json dependency placement is correct
        - [ ]  import repo packages using workspace:*
        - [ ]  next.config.ts has transpilePackages configured
        - [ ]  tailwind.config.ts paths are correct
        - [ ]  globals.css imports base.css
        - [ ]  pnpm lint has no errors
        - [ ]  pnpm check-types passes
    2. Feature checks
        - [ ]  UI components import correctly
        - [ ]  Tailwind styles work
        - [ ]  utils / cn resolves correctly
        - [ ]  next-intl messages display correctly
        - [ ]  pnpm dev shows no workspace warnings
    3. Common mistakes
        
        
        | Action | Consequence |
        | --- | --- |
        | Copy UI components into a sub-app | UI evolution becomes uncontrolled |
        | packages import next | architecture pollution |
        | use relative imports | build & typing failures |
        | modify shared config | impacts all projects |
- 🤝 Collaboration Agreement
    1. Changes in packages must go through PR
    2. UI / theme / intl changes must be communicated
    3. Sub-app commits should only contain business-related changes

---

## 🎨 Collaboration Suggestions for UI / Design Teams

The project uses **a Design System + component-based UI** development approach.
A design file is not “a single page”. It is a reusable component set.

- 1️⃣ Treat “components” as the top priority
    
    When designing, prioritize:
    
    - Button
    - Input / Select / Checkbox
    - Card / Modal / Table
    - Sidebar / Header / Navigation
    
    ✅ Same component reused across pages: change content, not style
    
    ❌ Avoid:
    
    - designing a unique button style for every page
    - inconsistent size/radius/colors for similar buttons
- 2️⃣ Use Shadcn UI as the baseline
    
    Our frontend UI is based on Shadcn UI, which already defines:
    
    - button sizes
    - typography scale
    - spacing rules
    - interaction states (hover / active / disabled)
    
    👉 Keep designs close to Shadcn UI component structure.
    
    Recommended tool:
    
    - Shadcn UI Figma Kit
        
        👉 [https://ui.shadcn.com/figma](https://ui.shadcn.com/figma)
        
    
    This ensures:
    
    - design ≈ code
    - less back-and-forth styling tweaks
    - very low design-dev communication cost
    - consistency in final delivery
- 3️⃣ Don’t pick colors “randomly”. Use the theme system
    
    The project supports Light/Dark themes via CSS variables.
    
    For example:
    
    1. Use tweakcn to generate theme colors (not limited to this tool)
        
        👉 [https://tweakcn.com](https://tweakcn.com)
        
    2. Export color variables (primary / secondary / muted, etc.)
    3. Use those variables consistently across pages
    
    ✅ Benefits:
    
    - change once, update the whole site
    - automatically supports dark mode
    - supports white-label branding later
    
    ❌ Avoid:
    
    - lots of custom colors in designs
    - hardcoded hex colors like #123456
- 4️⃣ Design is not “pages”. Design is “systems”
    
    Prioritize:
    
    - component styles (Button / Input / Card)
    - state specs (hover / disabled / error)
    - spacing and hierarchy rules
    - font size and weight conventions
    
    Pages are just combinations of components.
    
- 5️⃣ Collaboration tips
    
    In design files, clearly mark:
    
    - is this a **new component** or a **variant** of an existing one
    - does it affect global styles
    - does it need dark mode support
    - does it need multi-language fit (text length)
    
    💡 If it can be reused, don’t create a new one. If it can be systematized, don’t design it as a one-off.