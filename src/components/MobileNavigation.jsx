import React, { useState } from "react";
import {
  Home,
  Search,
  Bell,
  User,
  PlusCircle,
  LogOut,
  MoreVertical,
  Brain,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";

const MobileNavigation = ({
  pathname,
  onSearchClick,
  onPostClick,
  handleLogout,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSheetClose = () => setIsOpen(false);

  const navigate = (path) => {
    router.push(path);
    handleSheetClose(); // Close the sheet after navigation
  };

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex items-center justify-around px-2 py-3">
        <button onClick={() => navigate("/dashboard/content")} className="p-2 relative group flex flex-col items-center">
          <Home
            className={`h-6 w-6 transition-all duration-300 ${
              pathname === "/dashboard/content" ? "text-indigo-400 scale-110" : "text-gray-400 group-hover:text-white group-hover:scale-110"
            }`}
          />
          {pathname === "/dashboard/content" && (
            <span className="absolute -bottom-1 w-1 h-1 bg-indigo-400 rounded-full"></span>
          )}
        </button>

        <button className="p-2 relative group flex flex-col items-center" onClick={onSearchClick}>
          <Search className="h-6 w-6 text-gray-400 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
        </button>

        <button className="p-2 relative group flex flex-col items-center -mt-6" onClick={onPostClick}>
          <div className="bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-3 rounded-full shadow-lg shadow-purple-500/30 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 border border-white/20">
            <PlusCircle className="h-6 w-6 text-white" />
          </div>
        </button>

        <button
          onClick={() => navigate("/dashboard/notifications")}
          className="p-2 relative group flex flex-col items-center"
        >
          <Bell
            className={`h-6 w-6 transition-all duration-300 ${
              pathname === "/dashboard/notifications"
                ? "text-purple-400 scale-110"
                : "text-gray-400 group-hover:text-white group-hover:scale-110"
            }`}
          />
          {pathname === "/dashboard/notifications" && (
            <span className="absolute -bottom-1 w-1 h-1 bg-purple-400 rounded-full"></span>
          )}
        </button>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="p-2 relative group flex flex-col items-center">
              <MoreVertical className="h-6 w-6 text-gray-400 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
            </button>
          </SheetTrigger>

          <SheetContent side="right" className="bg-black/95 backdrop-blur-3xl text-white w-[14rem] border-l border-white/10 rounded-l-3xl p-6">
            <SheetHeader>
              <SheetTitle className="text-white text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-3 mt-8">
              <button
                onClick={() => navigate("/dashboard/profile")}
                className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-xl w-full text-left transition-all duration-300 group"
              >
                <div className="bg-white/5 p-2 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                  <User className="h-5 w-5 text-gray-300 group-hover:text-indigo-400" />
                </div>
                <span className="text-gray-300 group-hover:text-white font-medium">Profile</span>
              </button>
              <button
                onClick={() => navigate("/dashboard/ai")}
                className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-xl w-full text-left transition-all duration-300 group"
              >
                 <div className="bg-white/5 p-2 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                  <Brain className="h-5 w-5 text-gray-300 group-hover:text-purple-400" />
                </div>
                <span className="text-gray-300 group-hover:text-white font-medium">Ask AI</span>
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  handleSheetClose();
                }}
                className="flex items-center gap-4 p-3 hover:bg-red-500/10 rounded-xl w-full text-left transition-all duration-300 group mt-auto"
              >
                 <div className="bg-white/5 p-2 rounded-lg group-hover:bg-red-500/20 transition-colors">
                  <LogOut className="h-5 w-5 text-gray-300 group-hover:text-red-400" />
                </div>
                <span className="text-gray-300 group-hover:text-red-400 font-medium">Logout</span>
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileNavigation;
