"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const featureCards = [
  {
    icon: "psychology",
    title: "Intelligent AI Ecosystem",
    desc: "Seamless integration with Gemini Pro and Grok-1. Your feed becomes context-aware for debugging, refactoring, and learning.",
    type: "large",
  },
  {
    icon: "notifications_active",
    title: "Real-time Pulse",
    desc: "Instant notifications for code reviews, deployment updates, and network engagement.",
    type: "small",
  },
  {
    icon: "code",
    title: "Developer-First Feed",
    desc: "Native support for technical snippets and long-form engineering discussions.",
    type: "medium-left",
  },
  {
    icon: "badge",
    title: "Professional Identity",
    desc: "Showcase technical depth with structured profiles built for networking and recruiting.",
    type: "medium-right",
  },
];

const footerColumns = [
  {
    title: "Product",
    links: ["Features", "AI Assistant", "Pricing", "API Docs"],
  },
  {
    title: "Resources",
    links: ["Community", "About", "Terms", "Privacy"],
  },
  {
    title: "Connect",
    links: ["Twitter", "GitHub", "Discord"],
  },
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-surface text-on-surface">
      <nav className="fixed top-0 w-full z-50 glass-surface border-b border-outline-variant/20">
        <div className="flex justify-between items-center px-5 md:px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-10">
            <span className="text-xl font-bold tracking-tighter text-on-surface">
              Social Next
            </span>
            <div className="hidden md:flex gap-8 items-center">
              <a
                className="text-primary font-semibold tracking-tight hover:opacity-80 transition-colors"
                href="#features"
              >
                Features
              </a>
              <a
                className="text-on-surface-variant tracking-tight hover:text-primary transition-colors"
                href="#community"
              >
                Community
              </a>
              <a
                className="text-on-surface-variant tracking-tight hover:text-primary transition-colors"
                href="#ai-assistant"
              >
                AI Assistant
              </a>
              <a
                className="text-on-surface-variant tracking-tight hover:text-primary transition-colors"
                href="#pricing"
              >
                Pricing
              </a>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-on-surface-variant hover:text-on-surface font-medium px-4 py-2 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="gradient-primary text-primary-foreground px-6 py-2.5 rounded-2xl font-semibold transition-opacity hover:opacity-90"
            >
              Get Started
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-on-surface-variant"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-outline-variant/20 bg-surface-container-low px-5 py-4 space-y-3">
            <a className="block text-on-surface-variant" href="#features">
              Features
            </a>
            <a className="block text-on-surface-variant" href="#community">
              Community
            </a>
            <a className="block text-on-surface-variant" href="#ai-assistant">
              AI Assistant
            </a>
            <a className="block text-on-surface-variant" href="#pricing">
              Pricing
            </a>
            <div className="pt-2 flex gap-2">
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-xl border border-outline-variant/30 text-sm"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-28">
        <section className="max-w-7xl mx-auto px-5 md:px-8 mb-24 lg:mb-32">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-xs font-bold tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Next.js 15 Ready
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.07] text-on-surface">
                Social Media for the{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary-container">
                  Modern Architect
                </span>
              </h1>

              <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-xl">
                A curated ecosystem for developers. Integrated AI, native code
                snippet workflows, and a high-performance network built for
                technical communities.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/auth/register"
                  className="gradient-primary text-primary-foreground px-8 py-4 rounded-2xl text-lg font-bold text-center"
                >
                  Join the Network
                </Link>
                <a
                  href="#features"
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-lg font-bold border border-outline-variant/40 hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined">terminal</span>
                  View Features
                </a>
              </div>

              <div className="flex items-center gap-5 pt-2">
                <div className="flex -space-x-3">
                  <img
                    className="w-10 h-10 rounded-full border-2 border-surface"
                    src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=200&auto=format&fit=crop"
                    alt="Community member"
                  />
                  <img
                    className="w-10 h-10 rounded-full border-2 border-surface"
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
                    alt="Community member"
                  />
                  <img
                    className="w-10 h-10 rounded-full border-2 border-surface"
                    src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop"
                    alt="Community member"
                  />
                </div>
                <p className="text-sm text-on-surface-variant font-medium">
                  Join 50k+ architects building the future
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-surface-container-lowest rounded-2xl p-4 editorial-panel">
                <img
                  className="rounded-xl w-full h-auto"
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop"
                  alt="Product dashboard preview"
                />

                <div className="absolute -bottom-6 -left-4 md:-left-6 bg-surface-container-lowest p-4 md:p-6 rounded-2xl shadow-xl max-w-[240px] border border-outline-variant/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-sm">
                        auto_awesome
                      </span>
                    </div>
                    <span className="text-sm font-bold">
                      AI Assistant Active
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant italic">
                    "I optimized your deployment strategy and reduced build time
                    by 27%."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low py-24 mb-28">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="space-y-2">
                <p className="text-5xl font-extrabold tracking-tighter text-on-surface">
                  50k+
                </p>
                <p className="text-on-surface-variant font-medium tracking-wide uppercase text-xs">
                  Active Developers
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-5xl font-extrabold tracking-tighter text-on-surface">
                  1.2M
                </p>
                <p className="text-on-surface-variant font-medium tracking-wide uppercase text-xs">
                  Technical Discussions
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-5xl font-extrabold tracking-tighter text-on-surface">
                  99.9%
                </p>
                <p className="text-on-surface-variant font-medium tracking-wide uppercase text-xs">
                  Uptime Performance
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="max-w-7xl mx-auto px-5 md:px-8 mb-28">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-on-surface mb-6">
              Designed for the Editorial Architect
            </h2>
            <p className="text-on-surface-variant text-lg">
              We remove noise from traditional social media and focus on what
              matters: engineering craft and quality discussion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {featureCards.map((card) => {
              const areaClass =
                card.type === "large"
                  ? "md:col-span-8"
                  : card.type === "small"
                    ? "md:col-span-4"
                    : card.type === "medium-left"
                      ? "md:col-span-5"
                      : "md:col-span-7";

              return (
                <div
                  key={card.title}
                  className={`${areaClass} ${card.type === "large" || card.type === "medium-right" ? "bg-surface-container-lowest" : "bg-surface-container-low"} rounded-2xl p-8 md:p-10 ${card.type === "large" || card.type === "medium-right" ? "editorial-shadow border border-outline-variant/15" : ""}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-primary">
                      {card.icon}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-on-surface">
                    {card.title}
                  </h3>
                  <p className="text-on-surface-variant leading-relaxed">
                    {card.desc}
                  </p>

                  {card.type === "medium-left" && (
                    <div className="bg-[#0f172a] rounded-xl p-4 mt-7 font-mono text-xs text-indigo-300 overflow-x-auto">
                      <p>
                        <span className="text-pink-400">
                          export default function
                        </span>{" "}
                        <span className="text-blue-300">Hero</span>() {"{"}
                      </p>
                      <p className="pl-4">
                        <span className="text-pink-400">return</span> (
                      </p>
                      <p className="pl-8 text-slate-400">
                        &lt;div className=\"architect\"&gt;
                      </p>
                      <p className="pl-12 text-slate-400">...</p>
                    </div>
                  )}

                  {card.type === "small" && (
                    <div className="space-y-3 mt-8">
                      <div className="bg-surface-container-lowest p-3 rounded-xl shadow-sm flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-[10px] font-bold">
                          JD
                        </div>
                        <div className="text-[11px] font-medium text-on-surface">
                          John commented on your post
                        </div>
                      </div>
                      <div className="bg-surface-container-lowest p-3 rounded-xl shadow-sm flex items-center gap-3 opacity-70">
                        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-[10px] font-bold">
                          AS
                        </div>
                        <div className="text-[11px] font-medium text-on-surface">
                          Alice followed you
                        </div>
                      </div>
                    </div>
                  )}

                  {card.type === "medium-right" && (
                    <div className="mt-8 flex flex-wrap gap-2">
                      {[
                        "Next.js 15",
                        "TypeScript",
                        "Tailwind CSS",
                        "Node.js",
                      ].map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-surface-container-highest rounded-full text-[10px] font-bold text-on-surface uppercase tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section id="pricing" className="max-w-7xl mx-auto px-5 md:px-8 mb-28">
          <div className="bg-gradient-to-br from-indigo-700 to-indigo-500 rounded-2xl p-12 md:p-20 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <span
                className="material-symbols-outlined text-[200px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                architecture
              </span>
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Ready to build your stack?
              </h2>
              <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto opacity-90 leading-relaxed">
                Join the fastest-growing professional network for modern
                engineers. Claim your handle and start shipping in public.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/auth/register"
                  className="bg-white text-indigo-700 px-10 py-4 rounded-2xl text-lg font-bold hover:opacity-90 transition-opacity"
                >
                  Get Started for Free
                </Link>
                <a
                  href="#community"
                  className="bg-indigo-500/30 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-2xl text-lg font-bold hover:bg-white/10 transition-colors"
                >
                  Talk to Our Team
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer
        id="community"
        className="bg-surface-container-low border-t border-outline-variant/20"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2 md:col-span-1 space-y-5">
              <span className="text-lg font-bold text-on-surface">
                Social Next
              </span>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Built for the modern architect. A new standard for technical
                networking and developer collaboration.
              </p>
            </div>

            {footerColumns.map((col) => (
              <div key={col.title}>
                <h4 className="text-on-surface font-bold text-sm mb-5 uppercase tracking-widest">
                  {col.title}
                </h4>
                <ul className="space-y-3 text-on-surface-variant text-sm">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        className="hover:text-on-surface transition-colors"
                        href="#"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-on-surface-variant text-xs">
              © 2026 Social Next. Built for the modern architect.
            </p>
            <div className="flex gap-6">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Secure by design
              </span>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Powered by Next.js
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
