"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Users, Eye, EyeOff, Copy, CheckCircle, Shield, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface UserData {
  _id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: string;
  createdAt: string;
  lastLoginAt: string;
}

interface SubAdminData {
  _id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  role: string;
  createdAt: string;
  lastLoginAt: string;
}

export default function AdminUsersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [subAdmins, setSubAdmins] = useState<SubAdminData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMainAdmin, setIsMainAdmin] = useState(false);
  const [newSubAdminEmail, setNewSubAdminEmail] = useState("");
  const [isAddingSubAdmin, setIsAddingSubAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'subadmins'>('users');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/sign-in");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      checkAdminAccess();
    }
  }, [user]);

  const checkAdminAccess = async () => {
    try {
      const response = await fetch("/api/admin/check-access");
      if (response.ok) {
        const data = await response.json();
        if (data.isAdmin) {
          setIsAdmin(true);
          setIsMainAdmin(data.isMainAdmin);
          fetchData();
        } else {
          toast.error("Access Denied", {
            description: "You don't have permission to access the admin panel.",
          });
          router.push("/dashboard");
        }
      } else {
        toast.error("Unauthorized");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Admin check error:", error);
      router.push("/dashboard");
    }
  };

  const fetchData = async () => {
    try {
      const [usersRes, subAdminsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/sub-admins"),
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users);
      }

      if (subAdminsRes.ok) {
        const subAdminsData = await subAdminsRes.json();
        setSubAdmins(subAdminsData.subAdmins);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const copyToClipboard = (text: string, userId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(userId);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddSubAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubAdminEmail) {
      toast.error("Please enter an email address");
      return;
    }

    setIsAddingSubAdmin(true);
    try {
      const response = await fetch("/api/admin/sub-admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newSubAdminEmail }),
      });

      if (response.ok) {
        toast.success("Sub-admin access granted!");
        setNewSubAdminEmail("");
        fetchData();
      } else {
        const data = await response.json();
        toast.error("Failed to grant access", {
          description: data.error,
        });
      }
    } catch (error) {
      console.error("Error adding sub-admin:", error);
      toast.error("Error adding sub-admin");
    } finally {
      setIsAddingSubAdmin(false);
    }
  };

  const handleRemoveSubAdmin = async (email: string) => {
    try {
      const response = await fetch("/api/admin/sub-admins", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success("Sub-admin access removed!");
        fetchData();
      } else {
        const data = await response.json();
        toast.error("Failed to remove access", {
          description: data.error,
        });
      }
    } catch (error) {
      console.error("Error removing sub-admin:", error);
      toast.error("Error removing sub-admin");
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8" />
              Admin Panel
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {isMainAdmin ? "Main Admin Access" : "Sub-Admin Access"}
            </p>
          </div>
          <Button onClick={() => router.push("/dashboard")} className="rounded-xl">
            Back to Dashboard
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'users' ? 'default' : 'outline'}
            onClick={() => setActiveTab('users')}
            className="rounded-xl"
          >
            <Users className="h-4 w-4 mr-2" />
            All Users
          </Button>
          {isMainAdmin && (
            <Button
              variant={activeTab === 'subadmins' ? 'default' : 'outline'}
              onClick={() => setActiveTab('subadmins')}
              className="rounded-xl"
            >
              <Shield className="h-4 w-4 mr-2" />
              Sub-Admins ({subAdmins.length})
            </Button>
          )}
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </CardContent>
          </Card>
        ) : (
          <>
            {/* All Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Users: {users.length}</CardTitle>
                    <CardDescription>
                      All registered users with their credentials
                    </CardDescription>
                  </CardHeader>
                </Card>

                {users.map((userData) => (
                  <Card key={userData.userId} className="border-0 shadow-lg">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {userData.firstName} {userData.lastName}
                            {userData.role === 'admin' && (
                              <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full">
                                Admin
                              </span>
                            )}
                            {userData.role === 'subadmin' && (
                              <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full">
                                Sub-Admin
                              </span>
                            )}
                          </CardTitle>
                          <CardDescription>{userData.email}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            User ID
                          </label>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                              {userData.userId}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyToClipboard(userData.userId, userData.userId)}
                            >
                              {copiedId === userData.userId ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Email
                          </label>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                              {userData.email}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyToClipboard(userData.email, `email-${userData.userId}`)}
                            >
                              {copiedId === `email-${userData.userId}` ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Password Hash
                          </label>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm break-all">
                              {showPasswords[userData.userId]
                                ? userData.password
                                : "••••••••••••••••••••••••"}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => togglePasswordVisibility(userData.userId)}
                            >
                              {showPasswords[userData.userId] ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Created At
                          </label>
                          <p className="mt-1 text-sm">
                            {new Date(userData.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Last Login
                          </label>
                          <p className="mt-1 text-sm">
                            {userData.lastLoginAt === "Never"
                              ? "Never"
                              : new Date(userData.lastLoginAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Sub-Admins Tab */}
            {activeTab === 'subadmins' && isMainAdmin && (
              <div className="space-y-6">
                {/* Add Sub-Admin Form */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Manage Sub-Admin Access
                    </CardTitle>
                    <CardDescription>
                      Add or remove sub-admin access for users
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddSubAdmin} className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="Enter user email to grant sub-admin access..."
                        value={newSubAdminEmail}
                        onChange={(e) => setNewSubAdminEmail(e.target.value)}
                        className="rounded-xl flex-1"
                      />
                      <Button
                        type="submit"
                        disabled={isAddingSubAdmin || !newSubAdminEmail}
                        className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600"
                      >
                        {isAddingSubAdmin ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Sub-Admin
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Sub-Admins List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Current Sub-Admins: {subAdmins.length}</CardTitle>
                    <CardDescription>
                      Users with admin panel access
                    </CardDescription>
                  </CardHeader>
                </Card>

                {subAdmins.map((subAdmin) => (
                  <Card key={subAdmin.userId} className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white text-lg font-bold">
                            {subAdmin.firstName?.[0]?.toUpperCase() || subAdmin.email[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold flex items-center gap-2">
                              {subAdmin.firstName} {subAdmin.lastName}
                              {subAdmin.role === 'admin' ? (
                                <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full">
                                  Main Admin
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full">
                                  Sub-Admin
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {subAdmin.email}
                            </p>
                          </div>
                        </div>
                        {subAdmin.role !== 'admin' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveSubAdmin(subAdmin.email)}
                            className="rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Access
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
