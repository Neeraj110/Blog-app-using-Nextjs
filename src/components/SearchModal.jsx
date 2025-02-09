import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/helper/useDebounced";
import UserCard from "@/components/userCard";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

const SearchModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedName = useDebounce(name, 300);

  const loadUsers = useCallback(async (searchQuery) => {
    setLoading(true);
    try {
      const response = searchQuery
        ? await axios.get(`/api/user/search-user/${searchQuery}`)
        : await axios.get("/api/user/fetch-alluser");

      const usersData = response.data.users || [];
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (debouncedName !== "") {
      loadUsers(debouncedName);
    }
  }, [debouncedName, loadUsers]);

  const userList = useMemo(() => {
    if (loading) {
      return (
        <div className="flex flex-col space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-3 p-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-3 w-32 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (users && users.length > 0) {
      return users.map((user) => (
        <UserCard key={user._id} user={user} mobile={true} onClose={onClose} />
      ));
    }

    return (
      <div className="flex flex-col items-center justify-center py-8 px-4">
        <p className="text-gray-400 text-base text-center">No users found</p>
      </div>
    );
  }, [users, loading, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-[100vh] w-full max-w-full md:h-[80vh] md:w-[80%] md:max-w-[600px] p-0 overflow-hidden rounded-none md:rounded-3xl bg-gradient-to-br from-gray-900 to-black text-white shadow-xl border-0 md:border md:border-gray-800">
        <DialogHeader className="px-4 py-3 md:px-6 md:py-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg md:text-xl font-bold">
              Search Users
            </DialogTitle>
            <DialogClose className="p-2 hover:bg-gray-800 rounded-full transition-colors"></DialogClose>
          </div>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 h-12 text-base md:text-lg w-full rounded-2xl bg-gray-800/50 border-gray-700 focus:border-gray-600 focus:ring-1 focus:ring-gray-600 placeholder:text-gray-500"
            />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="px-4 py-3 md:px-6">
            <h2 className="text-base md:text-lg font-semibold text-white mb-3">
              Who to follow
            </h2>
            <div className="space-y-2">{userList}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
