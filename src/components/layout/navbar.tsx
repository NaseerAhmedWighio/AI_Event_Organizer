"use client";

import { useUser, useUserDisplayName, useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { GlobalSearch } from "./global-search";
import { NotificationDropdown } from "./notification-dropdown";
import { ThemeToggle } from "@/components/theme-provider";
import { LogIn, User as UserIcon, Menu, LogOut, Moon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import AIEvent from "../../../public/ai_event-organizers.png";

export function Navbar() {
  const { user, isSignedIn } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const displayName = useUserDisplayName(user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex flex-col gap-2 border-b border-border/50 glass px-4 sm:px-6 lg:px-8">
      {/* Main row */}
      <div className="flex h-16 items-center gap-2 sm:gap-3 sm:h-16">
        {/* Logo - always visible */}
        <button onClick={() => window.location.href = "/"} className="lg:hidden flex items-center gap-2 flex-shrink-0 cursor-pointer">
          <Image src={AIEvent} width={32} height={32} alt="AI Event Organizer logo" className="rounded-xl shrink-0" style={{ width: 'auto', height: 'auto' }} />
          <span className="hidden sm:inline font-bold text-sm sm:text-base bg-linear-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent truncate max-w-[120px]">
            AI Event Organizer
          </span>
        </button>

        {/* Search */}
        <div className="flex-1 flex items-center gap-2 sm:gap-4 min-w-0">
          <GlobalSearch />
        </div>

        {/* Right section - desktop only */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <NotificationDropdown />

          {/* Sign in button for non-authenticated users */}
          {!isSignedIn && (
            <Link href="/sign-in">
              <Button className="shadow-sm rounded-xl px-3 sm:px-5 text-sm sm:text-base">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Profile section - always visible when signed in (2nd last) */}
        {isSignedIn && user && (
          <DropdownMenu open={isProfileMenuOpen} onOpenChange={setIsProfileMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer">
                <div className="hidden sm:flex flex-col items-end text-right max-w-[120px]">
                  <p className="text-xs font-semibold text-foreground truncate">{displayName}</p>
                  <p className="text-[10px] text-muted-foreground truncate max-w-full">{user?.email}</p>
                </div>
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg ring-2 ring-border hover:ring-primary transition-all overflow-hidden bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white flex-shrink-0">
                  {user?.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-sm sm:text-base font-bold">
                      {user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2">
              <div className="px-2 py-2 mb-2 border-b border-border">
                <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="flex items-center gap-3 cursor-pointer">
                  <UserIcon className="h-4 w-4" />
                  <span>Edit Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  setIsProfileMenuOpen(false);
                  await handleLogout();
                }}
                disabled={isLoggingOut}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>{isLoggingOut ? "Signing out..." : "Logout"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Hamburger menu for md and below - LAST */}
        <div className="flex md:hidden">
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="w-64 p-2">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="flex items-center gap-3 cursor-pointer">
                  <UserIcon className="h-4 w-4" />
                  <span>Profile Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <p className="text-xs font-medium text-muted-foreground mb-2">Appearance</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    <span className="text-sm">Theme</span>
                  </div>
                  <ThemeToggle />
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <p className="text-xs font-medium text-muted-foreground mb-2">Notifications</p>
                <NotificationDropdown />
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
