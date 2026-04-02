import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/helper/useDebounced";
import UserCard from "@/components/userCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetAllUsersQuery,
  useLazySearchUsersQuery,
} from "@/redux/api/userApi";

const SearchModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");

  const debouncedName = useDebounce(name, 300);
  const { data: allUsersData, isFetching: isFetchingAllUsers } =
    useGetAllUsersQuery(undefined, {
      skip: !!debouncedName,
    });
  const [searchUsers, { data: searchedUsersData, isFetching: isSearching }] =
    useLazySearchUsersQuery();

  useEffect(() => {
    if (debouncedName) {
      searchUsers(debouncedName);
    }
  }, [debouncedName, searchUsers]);

  const users = debouncedName
    ? searchedUsersData?.users || []
    : allUsersData?.users || [];
  const loading = debouncedName ? isSearching : isFetchingAllUsers;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-[85vh] w-[95vw] bg-surface-container-low text-on-surface border border-outline-variant/20 rounded-2xl">
        {/* Header */}
        <DialogHeader className="py-2">
          <DialogClose></DialogClose>
          <DialogTitle className="text-lg font-bold">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Search users..."
              className="w-full rounded-full bg-surface-container-lowest border-outline-variant/20 text-on-surface px-4 py-3 focus:border-primary/30 focus:ring-primary/30 placeholder:text-on-surface-variant"
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
              <p className="text-on-surface-variant text-base">
                No users found
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
