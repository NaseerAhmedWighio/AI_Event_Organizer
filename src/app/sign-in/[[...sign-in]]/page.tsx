"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AIEvent from "../../../../public/ai_event-organizers.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function SignInPage() {
  const { signIn, isSignedIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect to dashboard if already signed in
  React.useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn(email, password);
      if (result.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(result.error || "Invalid email or password");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-600 text-white">
        <div>
          <button onClick={() => window.location.href = "/"} className="flex items-center gap-2 min-w-0 shrink cursor-pointer">
            <Image src={AIEvent} width={32} height={32} alt="AI Event Organizer logo" className="rounded-xl shrink-0" style={{ width: 'auto', height: 'auto' }} />
            <span className="font-bold text-base sm:text-xl text-white">
              AI Event Organizer
            </span>
          </button>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
            Plan Events Smarter
            <br />
            Not Harder
          </h1>
          <p className="text-lg xl:text-xl text-indigo-100 max-w-md">
            AI-powered event planning that saves you time and helps you create
            memorable experiences.
          </p>
        </div>

        <div className="text-sm text-indigo-200">
          © {new Date().getFullYear()} AI Event Organizer. All rights reserved.
        </div>
      </div>

      {/* Right side - Sign In Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          <div className="text-center lg:text-left">
            <button onClick={() => window.location.href = "/"} className="flex items-center gap-2 min-w-0 shrink mx-auto lg:mx-0 cursor-pointer">
              <Image src={AIEvent} width={32} height={32} alt="AI Event Organizer logo" className="rounded-xl shrink-0" style={{ width: 'auto', height: 'auto' }} />
              <span className="font-bold text-base sm:text-xl bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent truncate">
                AI Event Organizer
              </span>
            </button>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 mt-4">
              Welcome back
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Sign in to your account to continue planning
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 rounded-xl h-11"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
