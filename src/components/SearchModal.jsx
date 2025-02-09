import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
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

      setUsers(response.data.users || []);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" h-[85vh] w-[95vw]  bg-black text-white border-0">
        {/* Header */}
        <DialogHeader className="py-2">
        <DialogClose></DialogClose>
          <DialogTitle className="text-lg font-bold">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Search users..."
              className="w-full rounded-full bg-gray-800 border-gray-700 text-white px-4 py-3 focus:border-gray-600 focus:ring-gray-600 placeholder:text-gray-500"
            />
          </DialogTitle>
          
        </DialogHeader>

        {/* Users List */}
        <div className="overflow-y-auto px-4 ">
          {loading ? (
            <div className="flex flex-col space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="animate-pulse flex items-center space-x-3 p-3"
                >
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24 rounded" />
                    <Skeleton className="h-3 w-32 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : users.length > 0 ? (
            users.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                mobile={true}
                onClose={onClose}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-gray-400 text-base">No users found</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
