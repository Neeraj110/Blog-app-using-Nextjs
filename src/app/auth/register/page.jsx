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
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md p-6 rounded-xl shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-6">Register</h2>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 rounded border bg-black"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 rounded border bg-black"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 rounded border bg-black"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
                <div className="w-4 h-4 border-2 border-t-white border-blue-300 rounded-full animate-spin"></div>
              </div>
            ) : (
              "Register"
            )}
          </Button>
        </form>

        {/* Modal for OTP Verification */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-white text-black">
            <h2 className="text-xl font-semibold text-center mb-4">
              Verify Your Email
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Enter the 6-digit OTP sent to {email}.
            </p>
            <div className="space-y-4">
              <input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="w-full p-2 rounded"
              />
              <Button
                onClick={handleOtpVerification}
                disabled={isVerifying}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                {isVerifying ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-400 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
