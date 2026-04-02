"use client";
import React, { useState, useEffect } from "react";
import { Home, Bell, User, LogOut, Brain, Sun, Moon } from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/slices/authSlice";
import { useRouter, usePathname } from "next/navigation";
import MobileNavigation from "./MobileNavigation";
import CreatePostModal from "./CreatePostModal";
import SearchModal from "./SearchModal";
import { useLogoutMutation } from "@/redux/api/userApi";

function SideBar() {
  const [loading, setLoading] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { userInfo } = useSelector((state) => state.auth);
  const [logout] = useLogoutMutation();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    const saved = window.localStorage.getItem("theme");
    const initialTheme =
      saved === "light" || saved === "dark"
        ? saved
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    setTheme(initialTheme);

    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleThemeToggle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    window.localStorage.setItem("theme", nextTheme);
  };

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await logout().unwrap();
      dispatch(logoutUser());
      router.push("/auth/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(
        error.response?.data?.message || "Logout failed. Please try again.",
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
        className={`flex text-sm items-center space-x-3 p-3 rounded-2xl transition-all duration-300 group
          hover:bg-surface-container ${isActive ? "font-semibold text-on-surface bg-surface-container-high" : "text-on-surface-variant hover:text-on-surface"}
          md:w-fit md:min-w-[150px]`}
      >
        <div
          className={`p-1.5 rounded-lg transition-colors ${isActive ? "bg-primary/15" : "group-hover:bg-surface-container-high"}`}
        >
          <Icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
        </div>
        <span className="hidden md:inline group-hover:translate-x-1 transition-transform tracking-tight">
          {label}
        </span>
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
      userInfo?.name || "User",
    )}`;
  const userName = userInfo?.name || "User";
  const userUsername = userInfo?.username || "user";

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex items-start flex-col fixed h-screen w-[18rem] px-5 py-6">
        <div className="mb-10 px-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            SocialNext
          </h1>
          <p className="text-[11px] mt-1 uppercase tracking-[0.18em] text-on-surface-variant">
            v1.0.4
          </p>
        </div>

        <nav className="flex flex-col space-y-2 w-full">
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
            className="gradient-primary text-primary-foreground rounded-full px-6 py-3 mt-6 font-semibold shadow-[0_20px_40px_rgba(47,46,190,0.18)] flex items-center justify-center transition-all hover:opacity-95"
          >
            <span>Post</span>
          </button>

          <button
            onClick={handleThemeToggle}
            className="flex text-sm items-center space-x-3 p-3 rounded-2xl transition-all duration-300 group mt-2 hover:bg-surface-container text-on-surface-variant hover:text-on-surface md:w-fit md:min-w-[150px]"
          >
            <div className="p-1.5 rounded-lg transition-colors group-hover:bg-surface-container-high">
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </div>
            <span className="hidden md:inline group-hover:translate-x-1 transition-transform tracking-tight">
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </span>
          </button>
        </nav>

        {/* User Profile */}
        <div className="flex flex-col items-center mt-auto mb-4 w-full">
          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-surface-container 
                     transition-colors w-full disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-t-transparent border-on-surface rounded-full animate-spin" />
            ) : (
              <div className="flex items-center space-x-2">
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-8 h-8 rounded-full"
                />
                <div className="hidden md:block flex-1 min-w-0">
                  <p className="font-semibold truncate text-sm">{userName}</p>
                  <p className="text-on-surface-variant text-xs truncate">
                    @{userUsername}
                  </p>
                </div>
                <LogOut className="h-5 w-5 text-on-surface-variant" />
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
