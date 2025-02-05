"use client";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import LoginPage from "./auth/login/page";
import DashboardLayout from "./dashboard/layout";

function page() {
  const router = useRouter();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      router.prefetch("/dashboard"); // Prefetch dashboard for faster navigation
    }
  }, [userInfo, router]);

  return <>{userInfo ? <DashboardLayout /> : <LoginPage />}</>;
}

export default page;
