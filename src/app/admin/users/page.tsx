"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, Eye, EyeOff, Copy, CheckCircle, Shield, Mail, Calendar, Clock, User, Search, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

interface UserData {
  _id: string;
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  profileImageUrl?: string;
  role?: string;
  createdAt: string;
  lastLoginAt: string;
}

export default function AdminUsersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
          fetchUsers();
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

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (userId: string) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  // Users List View with Expandable Cards
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8" />
              User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Click on a user to expand and view their details
            </p>
          </div>
          <Button onClick={() => router.push("/dashboard")} className="rounded-xl">
            Back to Dashboard
          </Button>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by email or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Total Users: {filteredUsers.length}</CardTitle>
                <CardDescription>
                  All registered users - click to expand
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="space-y-3">
              {filteredUsers.map((userData) => {
                const isExpanded = expandedUserId === userData.userId;
                const showPassword = showPasswords[userData.userId];

                return (
                  <Card 
                    key={userData.userId} 
                    className={`border-0 shadow-lg transition-all duration-300 ${
                      isExpanded ? 'ring-2 ring-indigo-500 shadow-xl' : 'hover:shadow-xl'
                    }`}
                  >
                    {/* Collapsed View - Always Visible */}
                    <CardContent 
                      className="p-4 cursor-pointer"
                      onClick={() => toggleExpand(userData.userId)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="h-12 w-12 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                            {userData.profileImageUrl ? (
                              <img src={userData.profileImageUrl} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <span>{userData.firstName?.[0]?.toUpperCase() || userData.email[0].toUpperCase()}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">
                              {userData.firstName} {userData.lastName}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {userData.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <Badge className={
                            userData.role === 'admin' 
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600' 
                              : userData.role === 'subadmin'
                              ? 'bg-gradient-to-r from-cyan-600 to-blue-600'
                              : 'bg-gray-500'
                          }>
                            {userData.role === 'admin' ? 'Admin' : userData.role === 'subadmin' ? 'Sub-Admin' : 'User'}
                          </Badge>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                      </div>
                    </CardContent>

                    {/* Expanded View - Only Visible When Expanded */}
                    {isExpanded && (
                      <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-6 bg-gray-50 dark:bg-gray-900/50">
                        {/* Avatar and Name Header */}
                        <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-indigo-950 dark:to-cyan-950 rounded-xl">
                          <div className="h-16 w-16 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white text-xl font-bold">
                            {userData.profileImageUrl ? (
                              <img src={userData.profileImageUrl} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                              <span>{userData.firstName?.[0]?.toUpperCase() || userData.email[0].toUpperCase()}</span>
                            )}
                          </div>
                          <div>
                            <p className="text-lg font-bold">
                              {userData.firstName} {userData.lastName}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{userData.email}</p>
                          </div>
                        </div>

                        {/* User Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              Email
                            </label>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="flex-1 p-3 bg-white dark:bg-gray-800 rounded-lg text-sm break-all">
                                {userData.email}
                              </code>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(userData.email, `email-${userData.userId}`);
                                }}
                              >
                                {copiedField === `email-${userData.userId}` ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                              <User className="h-4 w-4" />
                              User ID
                            </label>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="flex-1 p-3 bg-white dark:bg-gray-800 rounded-lg text-sm break-all">
                                {userData.userId}
                              </code>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(userData.userId, `userId-${userData.userId}`);
                                }}
                              >
                                {copiedField === `userId-${userData.userId}` ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Created At
                            </label>
                            <p className="mt-1 p-3 bg-white dark:bg-gray-800 rounded-lg text-sm">
                              {new Date(userData.createdAt).toLocaleString()}
                            </p>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Last Login
                            </label>
                            <p className="mt-1 p-3 bg-white dark:bg-gray-800 rounded-lg text-sm">
                              {userData.lastLoginAt === "Never"
                                ? "Never logged in"
                                : new Date(userData.lastLoginAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Password Hash */}
                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Password Hash
                          </label>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="flex-1 p-3 bg-white dark:bg-gray-800 rounded-lg text-sm break-all font-mono">
                              {showPassword
                                ? userData.password
                                : "••••••••••••••••••••••••••••••••••••••••••••"}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePasswordVisibility(userData.userId);
                              }}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(userData.password, `password-${userData.userId}`);
                              }}
                            >
                              {copiedField === `password-${userData.userId}` ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
