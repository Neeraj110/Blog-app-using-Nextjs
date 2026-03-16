"use client";

import React, { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog"; // ShadCN Dialog
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"), // Name validation
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const generateUsername = (name, email) => {
    const emailPrefix = email.split("@")[0];
    // Remove any non-alphanumeric characters and replace them with underscores
    const sanitizedUsername = emailPrefix.replace(/[^a-zA-Z0-9_]/g, "_");
    return sanitizedUsername;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const validationResult = formSchema.safeParse(formData);

    if (!validationResult.success) {
      toast.error("Please check the form for errors.");
      return;
    }

    setIsLoading(true);
    try {
      const { name, email, password } = formData;
      // Generate the username based on the name and email
      const username = generateUsername(name, email);

      // Sending the registration data along with the generated username
      const response = await axios.post("/api/user/register", {
        name,
        email,
        password,
        username, // Include generated username
      });
      if (response.status === 200) {
        setEmail(email);
        setIsModalOpen(true);
        toast.success("Registration successful! Please verify your email.");
      }
      setIsLoading(false);
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Registration failed. Try again."
      );
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
      const response = await axios.post("/api/user/verifyUser", {
        email,
        otp,
      });
      if (response.status === 200) {
        toast.success("OTP Verified Successfully!");
        setIsModalOpen(false);
        router.push("/auth/login");
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-purple-900/20 text-white">
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>

      <div className="w-full max-w-md p-8 rounded-3xl shadow-2xl bg-black/40 backdrop-blur-2xl border border-white/10 relative z-10 m-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Create Account
          </h2>
          <p className="text-gray-400">Join the SocialHub community</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Name Field */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 rounded-xl shadow-lg shadow-purple-500/25 transform hover:scale-[1.02] transition-all duration-300 mt-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex justify-center items-center gap-2">
                <div className="w-5 h-5 border-2 border-t-white border-white/30 rounded-full animate-spin"></div>
                <span>Registering...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        {/* Modal for OTP Verification */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-gray-900/95 backdrop-blur-xl border border-white/10 text-white rounded-2xl shadow-2xl p-8 max-w-[400px]">
            <h2 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Verify Your Email
            </h2>
            <p className="text-gray-400 text-center mb-6 text-sm">
              Enter the 6-digit OTP sent to <span className="text-white font-medium">{email}</span>
            </p>
            <div className="space-y-5">
              <input
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-center tracking-widest text-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder:text-gray-700 transition-all font-mono"
              />
              <Button
                onClick={handleOtpVerification}
                disabled={isVerifying}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all"
              >
                {isVerifying ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <p className="text-sm text-center mt-8 text-gray-400">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 hover:to-pink-400 font-semibold hover:underline decoration-purple-400/50 underline-offset-4 transition-all">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
