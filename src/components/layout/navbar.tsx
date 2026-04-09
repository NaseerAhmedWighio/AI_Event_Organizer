"use client";

import { useUser, useUserDisplayName } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { GlobalSearch } from "./global-search";
import { NotificationDropdown } from "./notification-dropdown";
import { ThemeToggle } from "@/components/theme-provider";
import { LogIn, User as UserIcon } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const { user, isSignedIn } = useUser();
  const displayName = useUserDisplayName(user);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 sm:gap-4 border-b border-border/50 glass px-4 sm:px-6 lg:px-8">
      {/* Search */}
      <div className="flex-1 flex items-center gap-2 sm:gap-4 min-w-0">
        <GlobalSearch />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <NotificationDropdown />

        {/* User actions */}
        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-border/50">
          {isSignedIn ? (
            <>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden lg:flex flex-col items-end text-right max-w-[120px] xl:max-w-[180px]">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate max-w-full">
                    {user?.email}
                  </p>
                </div>
                <Link href="/dashboard/settings">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl ring-2 ring-border hover:ring-primary transition-all overflow-hidden bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white cursor-pointer">
                    {user?.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold">
                        {user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="shadow-sm rounded-xl px-3 sm:px-5 text-sm sm:text-base">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
