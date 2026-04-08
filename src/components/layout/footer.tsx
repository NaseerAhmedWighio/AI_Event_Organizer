"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import AIEvent from "../../../public/ai_event-organizers.png";

export function Footer() {
  const pathname = usePathname();
  
  // Hide footer on authentication pages and dashboard
  if (
    pathname?.startsWith("/sign-in") ||
    pathname?.startsWith("/sign-up") ||
    pathname?.startsWith("/dashboard")
  ) {
    return null;
  }

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left side - Logo & Brand */}
          <div className="flex flex-col items-center sm:items-start gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              {/* <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110"> */}
                <Image src={AIEvent} width={28} height={28} alt="AI Event Organizer logo" className="rounded-lg" style={{ width: 'auto', height: 'auto' }} />
              {/* </div> */}
              <span className="font-bold text-base text-foreground">
                AI Event Organizer
              </span>
            </Link>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} AI Event Organizer. All rights reserved.
            </p>
          </div>

          {/* Right side - Portfolio Attribution */}
          <div className="flex flex-col items-center sm:items-end gap-2 text-center sm:text-right">
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
        </div>
      </div>
    </footer>
  );
}
