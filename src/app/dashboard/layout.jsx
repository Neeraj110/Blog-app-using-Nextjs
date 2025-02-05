"use client";

import React from "react";
import RightBar from "@/components/RightBar";
import SideBar from "@/components/SideBar";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="flex flex-col lg:flex-row mx-auto max-w-7xl h-screen">
        {/* Sidebar */}
        <div className="w-16 md:w-[15rem] border-gray-800 border-r flex-shrink-0 overflow-y-auto">
          <SideBar />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className=" min-h-[calc(100vh)]">{children}</div>
        </main>

        {/* Right Sidebar */}
        <div className="hidden lg:block w-[20rem] flex-shrink-0 border-l border-gray-800 overflow-y-auto">
          <RightBar />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
