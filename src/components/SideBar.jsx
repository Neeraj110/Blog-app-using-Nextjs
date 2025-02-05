"use client";
import React, { useState, useEffect } from "react";
import { Home, Bell, User, LogOut,  Brain } from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/slices/authSlice";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import MobileNavigation from "./MobileNavigation";
import CreatePostModal from "./CreatePostModal";
import SearchModal from "./SearchModal";

function SideBar() {
  const [loading, setLoading] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { userInfo } = useSelector((state) => state.auth);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await axios.post("/api/user/logout");
      dispatch(logoutUser());
      router.push("/auth/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(
        error.response?.data?.message || "Logout failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const NavLink = React.memo(({ href, icon: Icon, label }) => {
    const isActive = pathname === href;
    const handleClick = () => {
      if (pathname !== href) {
        router.push(href);
      }
    };
    return (
      <button
        onClick={handleClick}
        className={`flex text-[1.1rem] items-center space-x-4 p-3 rounded-full transition-colors
          hover:bg-gray-900 ${isActive ? "font-bold" : "text-gray-200"}
          md:w-fit md:min-w-[150px]`}
      >
        <Icon className="h-6 w-6" />
        <span className="hidden md:inline">{label}</span>
      </button>
    );
  });

  // Navigation items configuration
  const navItems = [
    { href: "/dashboard/content", icon: Home, label: "Home" },
    { href: "/dashboard/ai", icon: Brain, label: "AskToAi" },
    { href: "/dashboard/notifications", icon: Bell, label: "Notifications" },
    { href: "/dashboard/profile", icon: User, label: "Profile" },
  ];

  if (!mounted) {
    return null; // Prevent hydration issues
  }

  const userAvatar =
    userInfo?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      userInfo?.name || "User"
    )}`;
  const userName = userInfo?.name || "User";
  const userUsername = userInfo?.username || "user";

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex items-center flex-col fixed h-screen">
        <nav className="flex flex-col space-y-2 pt-[3rem] pl-8">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
            />
          ))}

          <button
            onClick={() => setIsPostModalOpen(true)}
            className="bg-white hover:bg-gray-200 text-black rounded-full px-5 py-2 font-bold 
                     shadow-lg flex items-center justify-center transition-colors"
          >
            <span>Post</span>
          </button>
        </nav>

        {/* User Profile */}
        <div className="flex flex-col items-center mt-auto mb-[2rem]">
          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center space-x-3 p-3 rounded-full hover:bg-gray-900 
                     transition-colors w-full disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin" />
            ) : (
              <div className="flex items-center space-x-2">
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-8 h-8 rounded-full"
                />
                <div className="hidden md:block flex-1 min-w-0">
                  <p className="font-semibold truncate text-sm">{userName}</p>
                  <p className="text-gray-500 text-xs truncate">
                    @{userUsername}
                  </p>
                </div>
                <LogOut className="h-5 w-5 text-gray-400" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation
        pathname={pathname}
        onSearchClick={() => setIsSearchModalOpen(true)}
        onPostClick={() => setIsPostModalOpen(true)}
        handleLogout={handleLogout}
      />

      {/* Modals */}
      {isPostModalOpen && (
        <CreatePostModal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          user={userInfo}
        />
      )}

      {isSearchModalOpen && (
        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
        />
      )}
    </>
  );
}

export default SideBar;
