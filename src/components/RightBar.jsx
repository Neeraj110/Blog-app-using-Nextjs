"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebounce } from "@/helper/useDebounced";
import UserCard from "@/components/userCard";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

function RightBar() {
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
        <div className="flex flex-col space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-2 p-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3 w-20 rounded" />
                  <Skeleton className="h-2 w-28 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (users && users.length > 0) {
      return users.map((user) => (
        <UserCard
          key={user._id}
          user={user}
          mobile={false}
          onClose={() => {}}
        />
      ));
    }

    return (
      <div className="text-center py-4">
        <p className="text-gray-400 text-sm">No users found</p>
      </div>
    );
  }, [users, loading]);

  return (
    <div className="w-[96%] h-screen border-l border-gray-800">
      <div className="h-full flex flex-col">
        {/* Fixed Search Header */}
        <div className="sticky top-0 bg-black/80 backdrop-blur-md px-3 py-1.5 z-10">
          <div className="relative group">
            <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
              <Search className="text-gray-400 w-4 h-4" />
            </div>
            <Input
              placeholder="Search users..."
              className="w-full bg-gray-900 border-gray-800 pl-8 pr-3 py-2 rounded-full
                      text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1
                      focus:ring-blue-500 transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="px-3 py-2">
            <h2 className="text-lg font-bold text-white mb-2">Who to follow</h2>
            <div className="space-y-1">{userList}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RightBar;
