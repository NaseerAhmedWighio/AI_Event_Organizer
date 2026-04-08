import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Event Organizer - Plan Smarter Events with AI",
  description:
    "Transform your event planning with AI-powered suggestions, smart scheduling, and intelligent analytics. Create memorable events in minutes, not weeks.",
  keywords: [
    "event planning",
    "AI events",
    "event management",
    "smart scheduling",
    "event organizer",
  ],
  authors: [{ name: "AI Event Organizer" }],
  icons: {
    icon: "/ai_event-organizers.png",
  },
  openGraph: {
    title: "AI Event Organizer - Plan Smarter Events with AI",
    description:
      "Transform your event planning with AI-powered suggestions and smart scheduling.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <head>
          <Script
            id="theme-init"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    var theme = localStorage.getItem('theme');
                    var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (theme === 'dark' || (!theme && systemPrefersDark)) {
                      document.documentElement.classList.add('dark');
                    }
                  } catch (e) {}
                })();
              `,
            }}
          />
        </head>
        <body
          className="min-h-full flex flex-col font-sans"
          suppressHydrationWarning
        >
          <ThemeProvider>
            <div className="flex flex-col min-h-full">
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </AuthProvider>
  );
}
