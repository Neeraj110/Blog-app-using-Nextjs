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
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50">
      <div className="flex items-center justify-around px-1 py-1 relative">
        <button onClick={() => navigate("/dashboard/content")} className="p-1">
          <Home
            className={`h-5 w-5 ${
              pathname === "/dashboard/content" ? "font-bold" : "text-white"
            }`}
          />
        </button>

        <button className="p-1" onClick={onSearchClick}>
          <Search className="h-5 w-5 text-white" />
        </button>
        <button className="p-1" onClick={onPostClick}>
          <PlusCircle className="h-5 w-5 text-white" />
        </button>
        <button
          onClick={() => navigate("/dashboard/notifications")}
          className="p-1"
        >
          <Bell
            className={`h-5 w-5 ${
              pathname === "/dashboard/notifications"
                ? "font-bold"
                : "text-white"
            }`}
          />
        </button>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="p-1">
              <MoreVertical className="h-5 w-5 text-white" />
            </button>
          </SheetTrigger>

          <SheetContent side="right" className="bg-black text-white w-[10rem]">
            <SheetHeader>
              <SheetTitle className="text-white">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-4">
              <button
                onClick={() => navigate("/dashboard/profile")}
                className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-lg w-full text-left"
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => navigate("/dashboard/ai")}
                className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-lg w-full text-left"
              >
                <Brain className="h-5 w-5" />
                <span>AskToAi</span>
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  handleSheetClose();
                }}
                className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-lg w-full text-left"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileNavigation;
