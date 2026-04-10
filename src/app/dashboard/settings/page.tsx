"use client";

import { useAuth, useUser } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Database,
  Trash2,
  LogOut,
  Moon,
  Globe,
  Loader2,
} from "lucide-react";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
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

  if (!isLoaded || !user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Section */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="scale-90 md:scale-100 h-10 w-10 rounded-xl bg-linear-to-br from-indigo-600 to-cyan-500 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Manage your account information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-start md:items-center justify-between md:p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 md:h-16 md:w-16 rounded-xl ring-2 ring-border">
                  <AvatarImage src={user.profileImageUrl || ''} alt="Profile" />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-cyan-500 text-white text-xl font-bold">
                    {user.firstName?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>
              <EditProfileDialog />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-linear-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                <Moon className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your experience</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900 gap-2 md:gap-0">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Toggle dark theme
                  </p>
                </div>
              </div>
              <div className="bg-[#151e31] md:bg-transparent px-4 py-2 md:p-0 rounded-xl ml-4 md:ml-0">
              <p className="text-sm text-gray-500 ">
                Use the theme toggle in the sidebar
              </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Language</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Select language
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium">English</span>
            </div>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-linear-to-br from-emerald-600 to-teal-500 flex items-center justify-center">
                <Database className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>Connected services</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Sanity CMS */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="h-10 w-10 rounded-lg bg-[#00C7B7] flex items-center justify-center shrink-0">
                    <Database className="h-5 w-5 text-white" />
                  </div>
                  <p className="font-medium truncate">Sanity CMS</p>
                </div>
                <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 shrink-0">
                  Connected
                </span>
              </div>
              <div className="sm:hidden mt-2">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                  Connected
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Connected to your Sanity workspace
              </p>
            </div>

            {/* Custom Authentication */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="h-10 w-10 rounded-lg bg-[#412991] flex items-center justify-center shrink-0">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <p className="font-medium truncate">Custom Authentication</p>
                </div>
                <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 shrink-0">
                  Connected
                </span>
              </div>
              <div className="sm:hidden mt-2">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                  Connected
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Secure JWT-based authentication
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-linear-to-br from-red-600 to-orange-500 flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>Irreversible account actions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-red-900 dark:text-red-200">
                    Sign Out
                  </p>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  className="rounded-xl shrink-0"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <span className="flex items-center gap-2">
                    {isLoggingOut ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing out...
                      </>
                    ) : (
                      <>
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </>
                    )}
                  </span>
                </Button>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                Sign out from your account
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
