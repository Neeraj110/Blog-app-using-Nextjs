"use client";

import { useState } from "react";
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
  Sparkles,
  Users,
  TrendingUp,
} from "lucide-react";

export default function HomePage() {
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
    {
      label: "Active Users",
      value: "50K+",
      icon: <Users className="w-8 h-8" />,
    },
    {
      label: "Posts Daily",
      value: "120K+",
      icon: <TrendingUp className="w-8 h-8" />,
    },
    {
      label: "AI Conversations",
      value: "1M+",
      icon: <Bot className="w-8 h-8" />,
    },
    {
      label: "Secure Logins",
      value: "99.9%",
      icon: <Shield className="w-8 h-8" />,
    },
  ];

  return (
    <>
      {/* Navigation - Ultra modern with glassmorphism */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl bg-white/5 backdrop-blur-2xl z-50 border border-white/10 rounded-full shadow-2xl shadow-purple-500/10">
        <div className="px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50 transform hover:rotate-12 transition-transform duration-300">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                SocialHub
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {["Features", "Security", "Testimonials"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-white transition-all duration-300 text-lg font-medium hover:scale-110 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white text-lg hover:bg-white/10 rounded-full px-6"
              >
                Sign In
              </Button>
              <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-lg px-8 py-6 shadow-xl shadow-purple-500/50 rounded-full transform hover:scale-105 transition-all duration-300">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            {/* Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-3 text-gray-300 hover:bg-white/10 rounded-full transition-all"
            >
              {mobileMenuOpen ? (
                <X className="w-7 h-7" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Floating dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-24 left-0 right-0 bg-black/95 backdrop-blur-2xl border border-white/10 rounded-3xl mx-4 shadow-2xl">
            <div className="p-8 space-y-6">
              {["Features", "Security", "Testimonials"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-xl text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300"
                >
                  {item}
                </a>
              ))}
              <Separator className="bg-white/10" />
              <div className="space-y-4">
                <Button
                  className="w-full text-lg rounded-full"
                  variant="outline"
                >
                  Sign In
                </Button>
                <Button className="w-full text-lg bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-lg">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero - Enhanced with floating elements */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden bg-gradient-to-br from-gray-900 via-black to-purple-900/20">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <Badge className="mb-8 text-lg px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-gray-200 rounded-full shadow-lg hover:scale-105 transition-transform duration-300 inline-flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
            Launched with Next.js 15 & AI
          </Badge>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white mb-10 leading-tight">
            Connect. Create.{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              Inspire.
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto font-light leading-relaxed">
            A modern social platform with AI chat, rich media posts, real-time
            notifications, and privacy-first design.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="text-xl px-12 py-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 rounded-full shadow-2xl shadow-purple-500/50 transform hover:scale-110 transition-all duration-300"
            >
              Start Free <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-xl px-12 py-8 border-2 border-white/30 backdrop-blur-xl rounded-full hover:bg-white/10 hover:scale-105 transition-all duration-300"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Floating Dashboard Preview */}
      {/* <div className="relative -mt-24 max-w-6xl mx-auto px-6 z-10">
        <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-2xl rounded-[3rem] p-8 shadow-2xl border border-white/10 transform hover:scale-[1.02] transition-all duration-500">
          <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border-2 border-dashed border-gray-700/50 rounded-[2.5rem] w-full h-96 flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5"></div>
            <div className="text-center relative z-10">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center backdrop-blur-xl">
                <Globe className="w-14 h-14 text-indigo-400" />
              </div>
              <p className="text-2xl text-gray-400 font-medium">
                App Dashboard Preview
              </p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Stats - Enhanced cards */}
      <section className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center group bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="mb-4 text-indigo-400 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <p className="text-gray-400 mt-3 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Ultra modern cards */}
      <section
        id="features"
        className="py-32 px-6 bg-gradient-to-b from-black to-gray-900"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <Badge className="mb-6 text-lg px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full">
              ✨ Features
            </Badge>
            <h2 className="text-6xl font-bold text-white mb-6">
              Everything You Need
            </h2>
            <p className="text-2xl text-gray-400">
              Built for creators, communities, and conversations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <Card
                key={idx}
                className="p-10 bg-gradient-to-br from-gray-900/80 via-black/80 to-purple-900/10 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-4 transition-all duration-500 group overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-bl-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Showcase */}
      <section className="py-32 bg-gradient-to-r from-gray-900 via-black to-purple-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <Badge className="mb-6 text-lg px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
                📸 Media-Rich Experience
              </Badge>
              <h2 className="text-6xl font-bold text-white mb-8">
                Post Like a Pro
              </h2>
              <p className="text-2xl text-gray-300 mb-12 leading-relaxed">
                Upload images, videos, and text — all in one post.
                Cloudinary-powered delivery ensures fast loading worldwide.
              </p>
              <ul className="space-y-6">
                {[
                  "Up to 10 files per post",
                  "Auto-generated video thumbnails",
                  "Responsive & optimized media",
                  "Drag & drop upload",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center text-xl text-gray-300 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <Check className="w-6 h-6 text-green-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-[2rem] h-64 shadow-xl border border-white/10 hover:scale-105 transition-all duration-300"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="py-40 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-5xl mx-auto text-center px-6">
          <div className="w-40 h-40 mx-auto mb-12 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-full flex items-center justify-center backdrop-blur-2xl border border-white/20 shadow-2xl shadow-purple-500/50 hover:scale-110 transition-transform duration-500">
            <Bot className="w-24 h-24 text-purple-400" />
          </div>
          <h2 className="text-6xl font-bold text-white mb-8">
            Chat with AI — Anytime
          </h2>
          <p className="text-3xl text-gray-300 mb-14">
            Powered by{" "}
            <strong className="text-indigo-400">Google Gemini</strong> and{" "}
            <strong className="text-purple-400">xAI Grok</strong>
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {["Gemini 1.5 Pro", "Grok-1.5", "Conversation History"].map(
              (tag) => (
                <Badge
                  key={tag}
                  className="text-lg px-10 py-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full hover:scale-110 transition-all duration-300 hover:bg-white/20"
                >
                  {tag}
                </Badge>
              )
            )}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-t-[5rem] overflow-hidden relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-5xl mx-auto text-center px-6">
          <h2 className="text-6xl sm:text-7xl font-bold text-white mb-10 leading-tight">
            Ready to Join the Future of Social?
          </h2>
          <p className="text-3xl text-indigo-100 mb-14 leading-relaxed">
            Sign up in 30 seconds. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <Button
              size="lg"
              className="text-2xl px-16 py-10 bg-white text-black hover:bg-gray-100 rounded-full shadow-2xl font-bold transform hover:scale-110 transition-all duration-300"
            >
              Create Free Account
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-2xl px-16 py-10 border-2 border-white/50 text-white hover:bg-white/10 rounded-full backdrop-blur-xl hover:scale-110 transition-all duration-300"
            >
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/95 backdrop-blur-2xl text-gray-400 py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-16 mb-16">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">SocialHub</span>
              </div>
              <p className="text-gray-500 text-lg">
                The next-generation social platform.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">Product</h4>
              <ul className="space-y-3">
                {["Features", "Security", "Pricing", "API"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">Company</h4>
              <ul className="space-y-3">
                {["About", "Blog", "Careers", "Press"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">Legal</h4>
              <ul className="space-y-3">
                {["Privacy", "Terms", "Cookie Policy"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Separator className="bg-white/10 mb-10" />
          <p className="text-center text-gray-500 text-lg">
            © 2025 SocialHub. Crafted with love using Next.js 15.
          </p>
        </div>
      </footer>
    </>
  );
}
