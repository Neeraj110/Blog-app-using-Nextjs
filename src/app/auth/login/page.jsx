"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Moon, Sun } from "lucide-react";
import { setCredential } from "@/redux/slices/authSlice";
import { useLoginMutation } from "@/redux/api/userApi";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const applyTheme = (mode) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (mode === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  window.localStorage.setItem("theme", mode);
};

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const [isThemeReady, setIsThemeReady] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    const mode = getInitialTheme();
    setTheme(mode);
    applyTheme(mode);
    setIsThemeReady(true);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const response = await login(values).unwrap();
      dispatch(setCredential(response.user));
      router.push("/dashboard");
    } catch (error) {
      form.setError("root", {
        message: error?.data?.error || "Login failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <header className="fixed top-0 w-full z-50 glass-surface border-b border-outline-variant/20">
        <div className="flex justify-between items-center px-6 md:px-8 py-5 max-w-7xl mx-auto">
          <div className="text-2xl font-bold tracking-tighter text-on-surface">
            Social Next
          </div>
          <div className="flex items-center gap-4">
            <a
              className="hidden md:inline text-on-surface-variant font-medium hover:text-primary transition-colors"
              href="#"
            >
              Help Center
            </a>
            {isThemeReady && (
              <button
                type="button"
                onClick={toggleTheme}
                className="h-10 w-10 rounded-full bg-surface-container-low hover:bg-surface-container-high flex items-center justify-center transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-5 md:px-6 pt-24 pb-12">
        <div className="w-full max-w-[480px] space-y-10">
          <div className="text-center md:text-left space-y-4">
            <h1 className="text-5xl font-bold tracking-tight leading-tight">
              Welcome Back
            </h1>
            <p className="text-on-surface-variant text-lg max-w-md leading-relaxed">
              Enter your credentials to access your developer-first feed.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-8 md:p-10 rounded-2xl shadow-[0_20px_40px_rgba(25,28,30,0.06)] border border-outline-variant/20">
            <form className="space-y-7" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-3">
                <label
                  className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1"
                  htmlFor="email"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  {...form.register("email")}
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-4 text-on-surface placeholder:text-on-surface-variant/60 focus:ring-2 focus:ring-primary/20 focus:border-primary/20 transition-all"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label
                    className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <a
                    className="text-xs font-semibold text-primary hover:opacity-80 transition-colors"
                    href="#"
                  >
                    Forgot password?
                  </a>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...form.register("password")}
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-4 text-on-surface placeholder:text-on-surface-variant/60 focus:ring-2 focus:ring-primary/20 focus:border-primary/20 transition-all"
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              {form.formState.errors.root && (
                <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-3">
                  {form.formState.errors.root.message}
                </p>
              )}

              <div className="pt-1">
                <button
                  className="w-full gradient-primary text-white font-semibold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[0.99] transition-transform duration-200 disabled:opacity-70"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-on-surface-variant font-medium">
                Don&apos;t have an account?
                <Link
                  className="text-primary hover:underline underline-offset-4 font-bold ml-1"
                  href="/auth/register"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col md:flex-row items-center gap-5 text-on-surface-variant">
            <div className="flex -space-x-3 overflow-hidden">
              <img
                alt="Developer avatar"
                className="inline-block h-8 w-8 rounded-full ring-4 ring-surface"
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop"
              />
              <img
                alt="Designer avatar"
                className="inline-block h-8 w-8 rounded-full ring-4 ring-surface"
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=120&auto=format&fit=crop"
              />
              <img
                alt="Engineer avatar"
                className="inline-block h-8 w-8 rounded-full ring-4 ring-surface"
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop"
              />
            </div>
            <p className="text-xs font-medium tracking-tight">
              Join <span className="text-on-surface font-bold">12,400+</span>{" "}
              developers building the future.
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full bg-surface-container-low mt-auto border-t border-outline-variant/20">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 py-10 gap-6 max-w-7xl mx-auto">
          <div className="text-sm font-medium text-on-surface-variant">
            © 2026 Social Next. Designed for clarity.
          </div>
          <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium text-on-surface-variant">
            <a className="hover:text-primary transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-primary transition-colors" href="#">
              Terms of Service
            </a>
            <a className="hover:text-primary transition-colors" href="#">
              Help Center
            </a>
            <a className="hover:text-primary transition-colors" href="#">
              Contact
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default LoginPage;
