// src/app/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle,
  Heart,
  Bell,
  Bot,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  Star,
  Check,
  Menu,
  X,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Rich Posts & Media",
      desc: "Share text, images, and videos with up to 10 files per post.",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Engage Deeply",
      desc: "Like, comment, reply, and bookmark your favorite content.",
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Real-time Notifications",
      desc: "Stay updated with likes, comments, and new followers.",
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: "AI-Powered Chat",
      desc: "Talk to Google Gemini or Grok AI directly in-app.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      desc: "JWT auth, HTTP-only cookies, and verified accounts.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Blazing Fast",
      desc: "Optimized with Next.js 15, Cloudinary CDN, and caching.",
    },
  ];

  const stats = [
    { label: "Active Users", value: "50K+" },
    { label: "Posts Daily", value: "120K+" },
    { label: "AI Conversations", value: "1M+" },
    { label: "Secure Logins", value: "99.9%" },
  ];

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-md z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  SocialHub
                </span>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-300 hover:text-white transition"
              >
                Features
              </a>
              <a
                href="#security"
                className="text-gray-300 hover:text-white transition"
              >
                Security
              </a>
              <a
                href="#testimonials"
                className="text-gray-300 hover:text-white transition"
              >
                Testimonials
              </a>
              <Button
                onClick={() => router.push("/auth/login")}
                variant="ghost"
                className="text-gray-300"
              >
                Sign In
              </Button>
              <Button
                onClick={() => router.push("/auth/register")}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-300"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black border-t border-gray-800">
            <div className="px-4 py-6 space-y-4">
              <a href="#features" className="block text-lg text-gray-300">
                Features
              </a>
              <a href="#security" className="block text-lg text-gray-300">
                Security
              </a>
              <a href="#testimonials" className="block text-lg text-gray-300">
                Testimonials
              </a>
              <Separator className="bg-gray-800" />
              <Button
                onClick={() => router.push("/auth/login")}
                className="w-full"
                variant="outline"
              >
                Sign In
              </Button>
              <Button
                onClick={() => router.push("/auth/register")}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge className="mb-4 bg-gray-800 text-gray-300 border-gray-700">
              <Star className="w-3 h-3 mr-1" /> Launched with Next.js 15 & AI
            </Badge>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
              Connect. Create.{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Inspire.
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              A modern social platform with AI chat, rich media posts, real-time
              notifications, and privacy-first design.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => router.push("/auth/register")}
                className="text-lg px-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                Start Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-2xl p-8 shadow-2xl">
              <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl w-full h-96 flex items-center justify-center">
                <div className="text-center">
                  <Globe className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-500">App Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl sm:text-4xl font-bold text-indigo-400">
                  {stat.value}
                </div>
                <div className="text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-gray-400">
              Built for creators, communities, and conversations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <Card
                key={idx}
                className="p-6 bg-gray-900 border-gray-800 hover:border-indigo-600 transition"
              >
                <div className="w-12 h-12 bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Showcase */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-gray-800 text-gray-300 border-gray-700">
                Media-Rich Experience
              </Badge>
              <h2 className="text-4xl font-bold text-white mb-6">
                Post Like a Pro
              </h2>
              <p className="text-lg text-gray-400 mb-6">
                Upload images, videos, and text — all in one post.
                Cloudinary-powered delivery ensures fast loading worldwide.
              </p>
              <ul className="space-y-3">
                {[
                  "Up to 10 files per post",
                  "Auto-generated video thumbnails",
                  "Responsive & optimized media",
                  "Drag & drop upload",
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl h-48" />
              <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl h-48" />
              <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl h-48" />
              <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl h-48" />
            </div>
          </div>
        </div>
      </section>

      {/* AI Integration */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto text-center">
          <Bot className="w-16 h-16 mx-auto mb-6 text-purple-500" />
          <h2 className="text-4xl font-bold text-white mb-4">
            Chat with AI — Anytime
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Powered by{" "}
            <strong className="text-indigo-400">Google Gemini</strong> and{" "}
            <strong className="text-purple-400">xAI Grok</strong> — generate
            ideas, get answers, or just chat.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge
              variant="outline"
              className="text-lg py-2 px-4 border-gray-700 text-gray-300"
            >
              Gemini 1.5 Pro
            </Badge>
            <Badge
              variant="outline"
              className="text-lg py-2 px-4 border-gray-700 text-gray-300"
            >
              Grok-1.5
            </Badge>
            <Badge
              variant="outline"
              className="text-lg py-2 px-4 border-gray-700 text-gray-300"
            >
              Conversation History
            </Badge>
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Shield className="w-16 h-16 mx-auto mb-6 text-green-500" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Security You Can Trust
            </h2>
            <p className="text-xl text-gray-400">
              Enterprise-grade protection for your data and privacy.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "JWT + HTTP-only Cookies",
                desc: "No token exposure in JS",
              },
              {
                title: "Bcrypt Password Hashing",
                desc: "12-round salt protection",
              },
              {
                title: "Email OTP Verification",
                desc: "No unverified accounts",
              },
            ].map((sec, i) => (
              <Card
                key={i}
                className="p-6 bg-black border-gray-800 text-center"
              >
                <div className="w-12 h-12 bg-green-900/30 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="font-semibold text-white mb-2">{sec.title}</h3>
                <p className="text-sm text-gray-400">{sec.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Loved by Creators
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Content Creator",
                text: "The AI chat helps me brainstorm post ideas instantly!",
              },
              {
                name: "Alex Rivera",
                role: "Developer",
                text: "Clean code, great DX. Deployed in minutes.",
              },
              {
                name: "Maya Patel",
                role: "Community Manager",
                text: "Notifications keep my audience engaged 24/7.",
              },
            ].map((t, i) => (
              <Card key={i} className="p-6 bg-gray-900 border-gray-800">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, s) => (
                    <Star
                      key={s}
                      className="w-5 h-5 text-yellow-500 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Join the Future of Social?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Sign up in 30 seconds. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 bg-white text-black hover:bg-gray-200"
              onClick={() => router.push("/auth/register")}
            >
              Create Free Account
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-white/30 text-white hover:bg-white/10"
            >
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-500 py-12 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">SocialHub</span>
              </div>
              <p className="text-sm">The next-generation social platform.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <Separator className="bg-gray-800 mb-6" />
          <div className="text-center text-sm">
            © 2025 SocialHub. All rights reserved. Built with love using Next.js
            15.
          </div>
        </div>
      </footer>
    </>
  );
}
