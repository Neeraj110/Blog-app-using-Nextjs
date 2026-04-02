"use client";

import React from "react";
import RightBar from "@/components/RightBar";
import SideBar from "@/components/SideBar";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-hidden">
      <div className="flex flex-col lg:flex-row mx-auto max-w-[92rem] h-screen">
        {/* Sidebar */}
        <div className="w-16 md:w-[18rem] flex-shrink-0 overflow-y-auto bg-surface-container-low">
          <SideBar />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0 bg-surface">
          <div className="min-h-[calc(100vh)]">{children}</div>
        </main>

        {/* Right Sidebar */}
        <div className="hidden lg:block w-[21.5rem] flex-shrink-0 overflow-y-auto bg-surface-container-low">
          <RightBar />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
