import { getAuthUser } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
export default async function SettingsPage() {
  const user = await getAuthUser();

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
              <div className="h-10 w-10 rounded-xl bg-linear-to-br from-indigo-600 to-cyan-500 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Manage your account information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white text-xl font-bold">{user.firstName?.[0]?.toUpperCase() || user.email[0].toUpperCase()}</div>
                <div>
                  <p className="font-semibold">Your Profile</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Update your photo and personal details
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
              <div className="h-10 w-10 rounded-xl bg-linear-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                <Moon className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your experience</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Toggle dark theme
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Use the theme toggle in the sidebar
              </p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Language</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Select your preferred language
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
              <div className="h-10 w-10 rounded-xl bg-linear-to-br from-emerald-600 to-teal-500 flex items-center justify-center">
                <Database className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>Connected services</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#00C7B7] flex items-center justify-center">
                  <Database className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">Sanity CMS</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Connected to your Sanity workspace
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                Connected
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#412991] flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">Clerk Authentication</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Secure authentication powered by Clerk
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                Connected
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-linear-to-br from-red-600 to-orange-500 flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>Irreversible account actions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900">
              <div>
                <p className="font-medium text-red-900 dark:text-red-200">
                  Sign Out
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Sign out from your account
                </p>
              </div>
              <form action={async () => {
                "use server";
                await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/auth/logout`, { method: "POST" });
                redirect("/sign-in");
              }}>
                <Button type="submit" variant="destructive" className="rounded-xl">
                  <span className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </span>
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
