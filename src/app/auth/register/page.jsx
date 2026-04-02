"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Info, Moon, Sun } from "lucide-react";
import {
  useRegisterMutation,
  useVerifyUserMutation,
} from "@/redux/api/userApi";

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

const generateUsername = (name, email) => {
  const emailPrefix = email.split("@")[0];
  return (
    emailPrefix.replace(/[^a-zA-Z0-9_]/g, "_") || name.replace(/\s+/g, "_")
  );
};

function RegisterPage() {
  const router = useRouter();
  const [theme, setTheme] = useState("light");
  const [isThemeReady, setIsThemeReady] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [otp, setOtp] = useState("");
  const [emailForOtp, setEmailForOtp] = useState("");

  const [registerUser] = useRegisterMutation();
  const [verifyUser] = useVerifyUserMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("All fields are required.");
      return;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const username = generateUsername(formData.name, formData.email);
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        username,
      }).unwrap();

      setEmailForOtp(formData.email);
      setIsModalOpen(true);
      toast.success("Registration successful. Check your email for OTP.");
    } catch (error) {
      toast.error(error?.data?.error || "Registration failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits.");
      return;
    }

    setIsVerifying(true);
    try {
      await verifyUser({ email: emailForOtp, otp }).unwrap();
      toast.success("OTP verified successfully.");
      setIsModalOpen(false);
      router.push("/auth/login");
    } catch (error) {
      toast.error(error?.data?.error || "Invalid OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-background font-body text-on-surface min-h-screen flex flex-col">
      <header className="fixed top-0 w-full z-50 glass-surface border-b border-outline-variant/20">
        <div className="flex justify-between items-center px-6 md:px-8 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-bold tracking-tighter text-on-surface">
            Social Next
          </div>
          <div className="flex items-center gap-4">
            <a className="hidden md:inline text-primary font-semibold" href="#">
              Sign Up
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

      <main className="flex-grow flex items-center justify-center px-5 md:px-6 py-24">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
          <div className="lg:col-span-6 space-y-7">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-highest text-primary font-semibold text-[0.7rem] uppercase tracking-wider mb-2">
              Architect Program 2026
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              Join the <span className="text-primary">Modern Architect</span>
            </h1>
            <p className="text-lg text-on-surface-variant max-w-md leading-relaxed">
              Create your account to start building your professional identity
              and join a curated network of visionary creators and engineers.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-3">
                <img
                  className="w-10 h-10 rounded-full border-2 border-surface object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop"
                  alt="User avatar"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-surface object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop"
                  alt="User avatar"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-surface object-cover"
                  src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=120&auto=format&fit=crop"
                  alt="User avatar"
                />
              </div>
              <span className="text-sm font-medium text-on-surface-variant">
                Joined by 2,000+ professionals
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-8 md:p-10 shadow-[0_20px_40px_rgba(25,28,30,0.06)] border border-outline-variant/20">
              <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight mb-2">
                  Create Account
                </h2>
                <p className="text-sm text-on-surface-variant">
                  Enter your details to get started.
                </p>
              </div>

              <form className="space-y-6" onSubmit={onSubmit}>
                <div className="space-y-2">
                  <label
                    className="block text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant"
                    htmlFor="full_name"
                  >
                    Full Name
                  </label>
                  <input
                    id="full_name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3.5 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/30 focus:border-primary/20 transition-all"
                    placeholder="Alex Rivera"
                    type="text"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="block text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant"
                    htmlFor="email"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3.5 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/30 focus:border-primary/20 transition-all"
                    placeholder="alex@studio.next"
                    type="email"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="block text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3.5 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/30 focus:border-primary/20 transition-all"
                    placeholder="••••••••"
                    type="password"
                  />
                  <p className="text-[0.7rem] text-outline mt-1 flex items-center gap-1.5">
                    <Info size={14} />
                    Must be at least 8 characters
                  </p>
                </div>

                <div className="pt-1">
                  <button
                    className="w-full py-4 gradient-primary text-white font-bold rounded-2xl hover:opacity-90 active:scale-95 transition-all duration-200 shadow-lg shadow-primary/20 disabled:opacity-70"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </button>
                </div>
              </form>

              <div className="mt-10 pt-8 border-t border-surface-container text-center">
                <p className="text-sm text-on-surface-variant">
                  Already have an account?
                  <Link
                    className="text-primary font-bold hover:underline underline-offset-4 ml-1"
                    href="/auth/login"
                  >
                    Log In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full mt-auto bg-surface-container-low border-t border-outline-variant/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 md:px-12 py-10 gap-6">
          <div className="text-sm text-on-surface-variant">
            © 2026 Social Next. Designed for clarity.
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              className="text-sm font-medium text-on-surface-variant hover:text-primary underline-offset-4 hover:underline transition-colors"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-sm font-medium text-on-surface-variant hover:text-primary underline-offset-4 hover:underline transition-colors"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="text-sm font-medium text-on-surface-variant hover:text-primary underline-offset-4 hover:underline transition-colors"
              href="#"
            >
              Help Center
            </a>
            <a
              className="text-sm font-medium text-on-surface-variant hover:text-primary underline-offset-4 hover:underline transition-colors"
              href="#"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-surface-container text-on-surface border border-outline-variant/30 rounded-2xl shadow-2xl p-8 max-w-[420px]">
          <h2 className="text-2xl font-bold text-center mb-2">
            Verify Your Email
          </h2>
          <p className="text-on-surface-variant text-center mb-6 text-sm">
            Enter the 6-digit OTP sent to{" "}
            <span className="text-on-surface font-medium">{emailForOtp}</span>
          </p>
          <div className="space-y-5">
            <input
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-center tracking-widest text-2xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-on-surface placeholder:text-on-surface-variant/40 transition-all font-mono"
            />
            <Button
              onClick={handleOtpVerification}
              disabled={isVerifying}
              className="w-full h-12 text-lg font-semibold gradient-primary rounded-xl shadow-lg"
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RegisterPage;
