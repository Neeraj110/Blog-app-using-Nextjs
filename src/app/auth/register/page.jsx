"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  // Function to generate a unique username
  const generateUsername = (name, email) => {
    const emailPrefix = email.split("@")[0];
    return `${emailPrefix}`;
  };

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      // Generate the username based on the name and email
      const username = generateUsername(values.name, values.email);

      // Sending the registration data along with the generated username
      const response = await axios.post("/api/user/register", {
        ...values,
        username, // Include generated username
      });
      if (response.status === 200) {
        setEmail(values.email);
        setIsModalOpen(true);
        toast.success("Registration successful! Please verify your email.");
      }
      setIsLoading(false);
    } catch (error) {
      form.setError("root", {
        message:
          error.response?.data?.error || "Registration failed. Try again.",
      });
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
    <div className="flex items-center justify-center min-h-screen text-white">
      <div className="w-full max-w-md p-6 rounded-xl shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-6">Register</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field (Replaces the Username Field) */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      {...field}
                      className="rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      className="rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      className="rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.root.message}
              </p>
            )}

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
        </Form>

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
              <Input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="rounded"
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
