import { ArrowRight, Github } from "lucide-react"

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b-8 border-foreground bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          {/* Logo */}
          <div className="flex items-center gap-3 border-4 border-foreground bg-foreground px-4 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 md:h-8 md:w-8"
            >
              {/* Geometric M shape inspired by manta ray wings */}
              <path
                d="M4 28 L4 12 L16 4 L28 12 L28 28 L22 22 L16 26 L10 22 Z"
                fill="#000000"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinejoin="miter"
              />
              {/* Center accent */}
              <circle cx="10" cy="11" r="3" fill="#ffffff" />
              <circle cx="22" cy="11" r="3" fill="#ffffff" />
            </svg>
            <span className="text-xl font-black uppercase tracking-tight text-background md:text-2xl">Mobula</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden items-center gap-2 md:flex">
            <a
              href="#why"
              className="border-4 border-foreground bg-background px-4 py-2 font-black uppercase tracking-wide transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Why
            </a>
            <a
              href="#architecture"
              className="border-4 border-foreground bg-background px-4 py-2 font-black uppercase tracking-wide transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Architecture
            </a>
            <a
              href="#design"
              className="border-4 border-foreground bg-background px-4 py-2 font-black uppercase tracking-wide transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Design
            </a>
            <a
              href="#github"
              className="flex items-center gap-2 border-4 border-foreground bg-primary px-4 py-2 font-black uppercase tracking-wide text-primary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button className="border-4 border-foreground bg-primary px-4 py-2 font-black uppercase tracking-wide text-primary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:hidden">
            Menu
          </button>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section id="hero" className="border-b-8 border-foreground px-6 py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-12">
            <h1 className="text-7xl font-black uppercase tracking-tighter text-balance leading-[0.85] md:text-8xl lg:text-9xl">
              MOBULA
              <br />
              MONOREPO
            </h1>
            <p className="text-4xl font-black uppercase tracking-tight md:text-5xl lg:text-6xl">
              Build once. Scale everywhere.
            </p>
            <div className="max-w-3xl space-y-6">
              <p className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
                A production-ready monorepo for building and scaling multi-app Next.js products.
              </p>
              <p className="text-lg font-semibold leading-relaxed md:text-xl">
                Built on Turborepo, powered by Next.js 16, Tailwind CSS v4, and shadcn/ui.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="group flex items-center gap-3 border-4 border-foreground bg-primary px-8 py-4 text-lg font-black uppercase tracking-wider text-primary-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-2 active:translate-y-2 active:shadow-none">
                Get Started
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button className="group flex items-center gap-3 border-4 border-foreground bg-background px-8 py-4 text-lg font-black uppercase tracking-wider text-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-2 active:translate-y-2 active:shadow-none">
                <Github className="h-5 w-5" />
                View on GitHub
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Mobula Section */}
      <section id="why" className="border-b-8 border-foreground px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-16 text-5xl font-black uppercase tracking-tighter md:text-6xl lg:text-7xl">Why Mobula</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="border-4 border-foreground bg-background p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="mb-6 inline-block border-4 border-foreground bg-foreground px-4 py-2">
                <span className="text-2xl font-black text-background">01</span>
              </div>
              <h3 className="mb-4 text-3xl font-black uppercase leading-tight">Multi-App by Default</h3>
              <p className="text-lg font-semibold leading-relaxed">
                Designed from day one for teams running more than one application. Apps, shared packages, and design
                systems live together with clean boundaries.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="border-4 border-foreground bg-primary p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="mb-6 inline-block border-4 border-foreground bg-background px-4 py-2">
                <span className="text-2xl font-black">02</span>
              </div>
              <h3 className="mb-4 text-3xl font-black uppercase leading-tight text-primary-foreground">
                Modern Stack, No Guesswork
              </h3>
              <p className="text-lg font-semibold leading-relaxed text-primary-foreground">
                Next.js 16 with App Router, Tailwind CSS v4, and shadcn/ui out of the box. No legacy patterns. No
                unnecessary abstractions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="border-4 border-foreground bg-secondary p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="mb-6 inline-block border-4 border-foreground bg-foreground px-4 py-2">
                <span className="text-2xl font-black text-background">03</span>
              </div>
              <h3 className="mb-4 text-3xl font-black uppercase leading-tight text-secondary-foreground">
                Design System Ready
              </h3>
              <p className="text-lg font-semibold leading-relaxed text-secondary-foreground">
                Shared Tailwind configuration and reusable UI packages ensure consistency across every application.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="border-b-8 border-foreground px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-5xl font-black uppercase tracking-tighter md:text-6xl lg:text-7xl">Architecture</h2>
          <p className="mb-16 max-w-4xl text-xl font-semibold leading-relaxed md:text-2xl">
            Mobula follows a clear, scalable monorepo architecture. Each layer has a single responsibility, making the
            system easy to extend, maintain, and onboard.
          </p>

          {/* Repository Structure */}
          <div className="space-y-12">
            {/* Apps Section */}
            <div className="border-4 border-foreground bg-background p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:p-12">
              <div className="mb-6 inline-block border-4 border-foreground bg-foreground px-4 py-2">
                <span className="font-mono text-xl font-black text-background">apps/</span>
              </div>
              <div className="mb-8 space-y-3 pl-8 font-mono text-lg font-bold">
                <p>web → Main product application</p>
                <p>docs → Documentation site</p>
              </div>
              <p className="text-lg font-semibold leading-relaxed">
                Product-facing applications live here. Each app is isolated, but shares the same design system and
                tooling.
              </p>
            </div>

            {/* Packages Section */}
            <div className="border-4 border-foreground bg-primary p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:p-12">
              <div className="mb-8 inline-block border-4 border-foreground bg-background px-4 py-2">
                <span className="font-mono text-xl font-black">packages/</span>
              </div>
              <p className="mb-8 text-lg font-semibold leading-relaxed text-primary-foreground">
                Shared packages that power every application. Reusable, isolated, and version-controlled.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                {/* UI Package */}
                <div className="border-4 border-foreground bg-background p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="mb-4 inline-block border-2 border-foreground bg-accent px-3 py-1">
                    <span className="font-mono text-sm font-black uppercase">ui</span>
                  </div>
                  <h3 className="mb-3 text-xl font-black uppercase leading-tight">UI Components</h3>
                  <p className="text-base font-semibold leading-relaxed">
                    Shared shadcn-based components that ensure design consistency across all applications.
                  </p>
                </div>

                {/* Tailwind Config Package */}
                <div className="border-4 border-foreground bg-background p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="mb-4 inline-block border-2 border-foreground bg-secondary px-3 py-1">
                    <span className="font-mono text-sm font-black uppercase">tailwind-config</span>
                  </div>
                  <h3 className="mb-3 text-xl font-black uppercase leading-tight">Design Tokens</h3>
                  <p className="text-base font-semibold leading-relaxed">
                    Centralized Tailwind CSS v4 configuration with unified design tokens and theme settings.
                  </p>
                </div>

                {/* ESLint Config Package */}
                <div className="border-4 border-foreground bg-background p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="mb-4 inline-block border-2 border-foreground bg-primary px-3 py-1">
                    <span className="font-mono text-sm font-black uppercase text-primary-foreground">
                      eslint-config
                    </span>
                  </div>
                  <h3 className="mb-3 text-xl font-black uppercase leading-tight">Code Quality</h3>
                  <p className="text-base font-semibold leading-relaxed">
                    Shared linting rules that enforce quality standards and conventions across the monorepo.
                  </p>
                </div>

                {/* TypeScript Config Package */}
                <div className="border-4 border-foreground bg-background p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="mb-4 inline-block border-2 border-foreground bg-foreground px-3 py-1">
                    <span className="font-mono text-sm font-black uppercase text-background">tsconfig</span>
                  </div>
                  <h3 className="mb-3 text-xl font-black uppercase leading-tight">Type Safety</h3>
                  <p className="text-base font-semibold leading-relaxed">
                    Unified TypeScript settings that reduce friction and ensure type consistency between apps.
                  </p>
                </div>
              </div>
            </div>

            {/* Closing Statement */}
            <div className="border-4 border-foreground bg-accent p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:p-12">
              <p className="text-center text-2xl font-black uppercase tracking-tight text-accent-foreground md:text-3xl lg:text-4xl">
                Clear boundaries. Shared standards. Zero guesswork.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Design Section */}
      <section id="design" className="border-b-8 border-foreground px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-5xl font-black uppercase tracking-tighter md:text-6xl lg:text-7xl">
            Design
          </h2>
          <p className="mb-16 max-w-4xl text-xl font-semibold leading-relaxed md:text-2xl">
            Mobula embraces Neo Brutalism as a design language — bold, functional, and honest. Design is not decoration
            here. It defines structure, hierarchy, and intent.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-6">
              <div className="aspect-square border-4 border-foreground bg-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
              <div>
                <p className="mb-2 text-2xl font-black uppercase">Primary</p>
                <p className="text-lg font-semibold">Bold & Assertive</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="aspect-square border-4 border-foreground bg-secondary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
              <div>
                <p className="mb-2 text-2xl font-black uppercase">Secondary</p>
                <p className="text-lg font-semibold">Structured & Neutral</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="aspect-square border-4 border-foreground bg-accent shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
              <div>
                <p className="mb-2 text-2xl font-black uppercase">Accent</p>
                <p className="text-lg font-semibold">Expressive & Experimental</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="border-b-8 border-foreground px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-5xl font-black uppercase tracking-tighter md:text-6xl lg:text-7xl">
            Built For Teams Who Ship
          </h2>
          <div className="border-4 border-foreground bg-accent p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:p-16">
            <p className="max-w-4xl text-xl font-semibold leading-relaxed text-accent-foreground md:text-2xl">
              Mobula is built for product teams, startups, and internal platforms that have outgrown a single Next.js
              app. If you maintain multiple frontends, shared UI, or internal tools, Mobula provides a clean foundation
              to scale without rewrites.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-8 border-foreground px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-lg font-black uppercase tracking-wider md:text-xl">
            Mobula · A Monorepo for Modern Web Teams
          </p>
        </div>
      </footer>
    </main>
  )
}