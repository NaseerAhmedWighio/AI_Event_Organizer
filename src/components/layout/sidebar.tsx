"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Calendar,
  LayoutDashboard,
  Sparkles,
  BarChart3,
  Settings,
  Menu,
  X,
  ListTodo,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-provider";
import { NotificationDropdown } from "./notification-dropdown";
import AIEvent from "../../../public/ai_event-organizers.png"
import Image from "next/image"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Events", href: "/dashboard/events", icon: Calendar },
  { name: "Planner", href: "/dashboard/planner", icon: ListTodo },
  { name: "AI Assistant", href: "/dashboard/ai-assistant", icon: Sparkles },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm pt-16">
          <div className="flex items-center justify-around p-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Notifications</span>
              <NotificationDropdown />
            </div>
          </div>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  pathname === item.href
                    ? "bg-linear-to-r from-primary to-secondary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:bg-muted"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-72 flex-col border-r border-border/50 glass pb-16">
        {/* Logo */}
        <button onClick={() => window.location.href = "/"} className="flex items-center gap-2 cursor-pointer w-full">
          <div className="flex items-center gap-3 p-6 border-b border-border/50 cursor-pointer w-full">
              <Image src={AIEvent} width={40} height={40} alt="AI Event Organizer logo" className="rounded-xl shrink-0" style={{ width: 'auto', height: 'auto' }} />
            <div>
              <h1 className="font-black text-lg text-foreground">AI Event Organizer</h1>
              <p className="text-xs text-muted-foreground">Plan smarter</p>
            </div>
          </div>
        </button>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                pathname === item.href
                  ? "bg-linear-to-r from-primary to-secondary text-primary-foreground shadow-lg"
                  : "text-foreground hover:bg-muted/50"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-transform group-hover:scale-110",
                  pathname === item.href ? "text-primary-foreground" : ""
                )}
              />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom section - removed theme toggle, now in navbar */}
         <div className="flex flex-col items-start gap-2 text-left pl-6">
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Crafted by{" "}
              <Link
                href="https://naseerahmedwighio.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:text-primary-hover transition-colors"
              >
                Naseer Ahmed Wighio
              </Link>
              {" "}— Expert in{" "}
              <span className="text-foreground/80">
                custom web development, AI-powered applications, and scalable SaaS solutions
              </span>
              .{" "}
              <span className="text-muted-foreground">
                Let&apos;s build your next digital product.
              </span>
            </p>
            <Link
              href="https://naseerahmedwighio.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-hover transition-colors group"
            >
              <span>View Portfolio & Get Started</span>
              <svg
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
      </aside>
    </>
  );
}
