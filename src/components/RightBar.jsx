"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight } from "lucide-react";
import { useDebounce } from "@/helper/useDebounced";
import UserCard from "@/components/userCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetAllUsersQuery,
  useLazySearchUsersQuery,
} from "@/redux/api/userApi";

function RightBar() {
  const [name, setName] = useState("");
  const trendingTags = [
    "#NextJS",
    "#FullStack",
    "#OpenSource",
    "#DevTools",
    "#AIUX",
    "#BuildInPublic",
  ];

  const footerLinks = [
    "Terms",
    "Privacy",
    "Cookies",
    "Accessibility",
    "Ads",
    "More",
  ];

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
        <p className="text-on-surface-variant text-sm">No users found</p>
      </div>
    );
  }, [users, loading]);

  return (
    <aside className="w-full h-screen">
      <div className="h-full flex flex-col">
        <div className="sticky top-0 glass-surface px-4 py-4 z-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="text-on-surface-variant w-4 h-4" />
            </div>
            <Input
              placeholder="Search users..."
              className="w-full bg-surface-container-lowest border-outline-variant/30 pl-10 pr-3 py-2.5 rounded-full text-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary/40 focus:ring-1 focus:ring-primary/30 transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="px-4 py-4 space-y-4">
            <section className="editorial-panel rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-on-surface">
                  Trends For You
                </h3>
                <button className="text-primary text-sm hover:underline">
                  See all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map((tag) => (
                  <button
                    key={tag}
                    className="rounded-full px-3 py-1.5 text-xs font-medium bg-surface-container-lowest text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </section>

            <section className="editorial-panel rounded-2xl p-4 space-y-3">
              <h2 className="text-base font-semibold text-on-surface">
                Who to follow
              </h2>
              <div className="space-y-2">{userList}</div>
              <button className="w-full flex items-center justify-between text-primary text-sm font-medium pt-1 hover:underline">
                Discover more
                <ChevronRight size={16} />
              </button>
            </section>

            <section className="px-2 pb-4">
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-on-surface-variant">
                {footerLinks.map((link) => (
                  <button
                    key={link}
                    className="hover:text-primary transition-colors"
                  >
                    {link}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-on-surface-variant mt-2">
                Codeverse @ 2024
              </p>
            </section>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default RightBar;
