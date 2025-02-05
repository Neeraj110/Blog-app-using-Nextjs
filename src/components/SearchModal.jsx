// components/modals/SearchModal.jsx
"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
        <UserCard key={user._id} user={user} mobile={true} onClose={onClose} />
      ));
    }

    return (
      <div className="text-center py-4">
        <p className="text-gray-400 text-sm">No users found</p>
      </div>
    );
  }, [users, loading]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="h-[80vh] w-[80%] max-w-[600px] overflow-y-auto rounded-3xl md:rounded-3xl bg-gradient-to-br from-gray-900 to-black text-white  shadow-xl border border-gray-800">
          <DialogHeader>
            <DialogTitle>Search Users</DialogTitle>
            <DialogClose className="absolute right-4 top-4" />
          </DialogHeader>

          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Search..."
            className="  text-white mb-4 p-3 rounded-3xl md:rounded-3xl bg-gradient-to-br from-gray-600 to-black   shadow-xl border border-gray-500"
          />
          {/* 
          <div className="overflow-y-auto max-h-[65vh]">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <Skeleton className="w-3/4 h-4" />
                  </div>
                ))}
              </div>
            ) : users.length > 0 ? (
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center space-x-2 p-2 rounded-[10px] bg-gray-900 border hover:bg-gray-700 transition"
                  >
                    <img
                      src={
                        user.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.name
                        )}`
                      }
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-white">{user.name}</p>
                      <p className="text-gray-400 text-sm">@{user.username}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center">No users found</p>
            )}
          </div> */}

          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="px-3 py-2">
              <h2 className="text-lg font-bold text-white mb-2">
                Who to follow
              </h2>
              <div className="space-y-1">{userList}</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchModal;
