"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button"; // Assuming you are using ShadCN for UI
import axios from "axios";

function VerifyPage() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Handle OTP input change
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  // Handle OTP submission
  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post("/api/user/verifyUser", otp);
      if (response.status === 200) {
        toast.success("OTP Verified Successfully");
        router.push("/auth/login");
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP Verification Failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-black p-4">
      <div className="mx-auto w-full max-w-md rounded-lg  p-8 shadow-lg ">
        <div className="space-y-1 text-center">
          <p className="text-gray-300 text-xl">
            Please enter the 6-digit OTP sent to your email.
          </p>
        </div>
        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-300"
            >
              OTP
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={handleOtpChange}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              required
              className="block w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <Button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default VerifyPage;
