"use client";

import Link from "next/link";
import { useUser } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import {
  Calendar,
  Sparkles,
  BarChart3,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-provider";
import { DotBackground } from "@/components/ui/grid-background";
import { ReviewsSection } from "@/components/landing/reviews-section";
import { CountUp } from "@/components/ui/count-up";
import { FluidGradientText } from "@/app/component2/ui/fluid-gradient-text";
import AIEvent from "../../public/ai_event-organizers.png"
import Image from "next/image"

// Dynamic import for GSAP to prevent SSR issues
// Using any type to avoid GSAP module type issues
let gsap: any = null;
let ScrollTrigger: any = null;

async function loadGSAP() {
  if (!gsap) {
    const gsapModule = await import("gsap");
    const scrollTriggerModule = await import("gsap/ScrollTrigger");
    gsapModule.gsap.registerPlugin(scrollTriggerModule.ScrollTrigger);
    gsap = gsapModule.gsap;
    ScrollTrigger = scrollTriggerModule.ScrollTrigger;
  }
  return { gsap: gsap!, ScrollTrigger: ScrollTrigger! };
}

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Planning",
    description:
      "Get intelligent event suggestions, optimized schedules, and smart recommendations powered by advanced AI.",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description:
      "Automatically find the best time slots, avoid conflicts, and coordinate with attendees seamlessly.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track event performance, attendance trends, and get insights to improve future events.",
  },
  {
    icon: Clock,
    title: "Time Optimization",
    description:
      "AI analyzes your event to suggest optimal timing for each activity and break.",
  },
  {
    icon: Users,
    title: "Guest Management",
    description:
      "Get AI suggestions for guest lists and manage attendees with ease.",
  },
  {
    icon: CheckCircle,
    title: "Task Automation",
    description:
      "Automated checklists and reminders ensure nothing falls through the cracks.",
  },
];

const stats = [
  { value: "10,000+", label: "Events Planned" },
  { value: "500K+", label: "Attendees Managed" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "50M+", label: "Time Saved (hrs)" },
];

export default function LandingPage() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();

  // GSAP refs for hero animations
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);
  const dashboardRef = useRef(null);

  // GSAP refs for features section
  const featuresSectionRef = useRef(null);
  const featuresHeadingRef = useRef(null);
  const featuresSubheadingRef = useRef(null);

  // Check if user is authenticated (from localStorage or session)
  const isAuthenticated = isSignedIn || !!user;

  const handleStartPlanning = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/sign-up");
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initAnimations = async () => {
      const { gsap: gsapLib, ScrollTrigger: ScrollTriggerLib } = await loadGSAP();

      if (!isMounted) return;

      // Kill all existing animations and scroll triggers before creating new ones
      gsapLib.globalTimeline?.clear();
      ScrollTriggerLib.getAll().forEach(st => st.kill());

      // Reset all animated elements to initial state
      const elementsToReset = [badgeRef.current, titleRef.current, subtitleRef.current, buttonsRef.current];
      elementsToReset.forEach(el => {
        if (el) {
          gsapLib.set(el, { opacity: 1, y: 0, scale: 1 });
        }
      });

      const ctx = gsapLib.context(() => {
        // Hero animations
        const tl = gsapLib.timeline({ defaults: { ease: "power3.out" } });

        tl.from(badgeRef.current, {
          opacity: 0,
          y: 30,
          scale: 0.9,
          duration: 0.8,
        })
          .from(titleRef.current, {
            opacity: 0,
            y: 40,
            duration: 1,
          }, "-=0.5")
          .from(subtitleRef.current, {
            opacity: 0,
            y: 30,
            duration: 0.8,
          }, "-=0.6")
          .from(buttonsRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.6,
          }, "-=0.4");

        // Dashboard scroll-triggered scale animation
        if (dashboardRef.current) {
          gsapLib.fromTo(
            dashboardRef.current,
            {
              scale: 0.88,
              opacity: 0.8,
            },
            {
              scale: 1,
              opacity: 1,
              duration: 1.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: dashboardRef.current,
                start: "top 85%",
                end: "top 30%",
                scrub: 1,
              },
            }
          );
        }

        // Features section scroll-triggered animations
        const featuresTl = gsapLib.timeline({
          scrollTrigger: {
            trigger: featuresSectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
          defaults: { ease: "power3.out" },
        });

        // Animate heading and subheading
        if (featuresHeadingRef.current) {
          featuresTl.from(featuresHeadingRef.current, {
            opacity: 0,
            y: 50,
            scale: 0.95,
            duration: 0.8,
          });
        }

        if (featuresSubheadingRef.current) {
          featuresTl.from(
            featuresSubheadingRef.current,
            {
              opacity: 0,
              y: 30,
              duration: 0.6,
            },
            "-=0.4"
          );
        }

        // Animate feature cards with stagger using scoped selector
        const cards = gsapLib.utils.toArray(
          ".feature-card",
          featuresSectionRef.current
        );

        if (cards.length > 0) {
          gsapLib.fromTo(
            cards,
            {
              opacity: 0,
              y: 60,
              scale: 0.9,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              stagger: 0.1,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: featuresSectionRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      return () => {
        isMounted = false;
        ctx.revert();
      };
    };

    initAnimations();
    
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* Navigation - Fixed with proper z-index and backdrop blur */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border/20 bg-background/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            <button onClick={() => window.location.href = "/"} className="flex items-center gap-2 min-w-0 shrink cursor-pointer">
              <Image src={AIEvent} width={32} height={32} alt="AI Event Organizer logo" className="rounded-xl shrink-0" style={{ width: 'auto', height: 'auto' }} />
              <span className="font-bold text-base sm:text-xl bg-linear-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent truncate">
                AI Event Organizer
              </span>
            </button>
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <ThemeToggle />
              {isSignedIn && user ? (
                <>
                  <Link href="/dashboard" className="hidden sm:inline-flex">
                    <Button variant="ghost" className="text-foreground/80">Dashboard</Button>
                  </Link>
                  <div className="hidden lg:flex flex-col items-end">
                    <span className="text-sm font-medium text-foreground/80 max-w-[150px] truncate">
                      {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email || "User"}
                    </span>
                    <span className="text-xs text-muted-foreground max-w-[150px] truncate">
                      {user.email}
                    </span>
                  </div>
                  <Link href="/dashboard/settings">
                    <div className="w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white cursor-pointer">
                      {user.profileImageUrl ? (
                        <img src={user.profileImageUrl} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold">
                          {user.firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                        </span>
                      )}
                    </div>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/sign-in">
                    <Button variant="ghost" className="text-foreground/80 hidden sm:inline-flex">Sign In</Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button size="sm" className="sm:size-default">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Dot Background */}
      <DotBackground
        dotSize={1}
        dotColor="#c7d2fe"
        darkDotColor="#312e81"
        spacing={25}
        showFade={false}
        className="w-full h-auto min-h-screen"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center w-full pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20">
          {/* Badge */}
          <div ref={badgeRef} className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-linear-to-r from-primary/40 to-secondary/20 dark:from-primary/40 dark:to-secondary/20 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI-Powered Event Planning
            </span>
          </div>

          {/* Title */}
          <h1 ref={titleRef} className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight">
            Plan Events{" "}
            <FluidGradientText
              text="Smarter"
              colors={["#6366f1", "#8b5cf6", "#06b6d4", "#6366f1"]}
              duration={4}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl"
            />
            <br />
            Not Harder
          </h1>

          {/* Subtitle */}
          <p ref={subtitleRef} className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 lg:mb-10 px-4 sm:px-0">
            Transform your event planning with AI-powered suggestions, smart
            scheduling, and intelligent analytics. Create memorable events in
            minutes, not weeks.
          </p>

          {/* Buttons */}
          <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 w-full sm:w-auto px-4 sm:px-0">
            <button onClick={handleStartPlanning} className="w-full sm:w-auto">
              <Button size="lg" className="text-base px-6 sm:px-8 h-11 sm:h-12 w-full sm:w-auto">
                Start Planning Free
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </button>
            <Link href="#how-it-works" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="text-base px-6 sm:px-8 h-11 sm:h-12 w-full sm:w-auto"
              >
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Hero Dashboard Mockup - Fully Responsive */}
          <div ref={dashboardRef} className="relative w-full max-w-[95vw] xs:max-w-[90vw] sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto will-change-transform">
            <div className="relative mx-auto">
              {/* Glow effect */}
              <div className="absolute -inset-3 xs:-inset-4 sm:-inset-6 bg-linear-to-r from-primary to-secondary rounded-[1.5rem] xs:rounded-[2rem] sm:rounded-[2.5rem] blur-2xl opacity-20" />

              {/* Main dashboard frame */}
              <div className="relative rounded-xl xs:rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-border bg-card">
                {/* Browser chrome */}
                <div className="bg-muted border-b border-border p-1.5 xs:p-2 sm:p-3 flex items-center gap-1.5 xs:gap-2">
                  <div className="flex gap-1 xs:gap-1.5 shrink-0">
                    <div className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 rounded-full bg-danger" />
                    <div className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 rounded-full bg-warning" />
                    <div className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 rounded-full bg-success" />
                  </div>
                  <div className="flex-1 mx-1.5 xs:mx-2 sm:mx-4 min-w-0">
                    <div className="bg-background rounded-sm xs:rounded-md px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 sm:py-1.5 text-[8px] xs:text-[10px] sm:text-xs text-muted-foreground truncate font-mono">
                      ai-event-organizer.app/dashboard
                    </div>
                  </div>
                </div>

                {/* Dashboard content - Light mode (hidden in dark) */}
                <div className="aspect-[16/10] xs:aspect-[16/9] sm:aspect-[16/10] p-0.5 xs:p-1 dark:hidden">
                  <div className="h-full w-full rounded-lg xs:rounded-xl sm:rounded-2xl p-2 xs:p-3 sm:p-6 lg:p-8 flex flex-col items-center justify-center overflow-hidden" >
                    {/* Dashboard mockup UI - Fully contained */}
                    <div className="w-full max-w-[95%] xs:max-w-lg sm:max-w-2xl lg:max-w-4xl space-y-1.5 xs:space-y-2 sm:space-y-4 lg:space-y-6">
                      {/* Top bar */}
                      <div className="flex items-center justify-between gap-1 xs:gap-2 sm:gap-4">
                        <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 min-w-0 flex-1">
                          <div className="h-4 w-4 xs:h-6 xs:w-6 sm:h-10 sm:w-10 rounded-md xs:rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-2 w-2 xs:h-3 xs:w-3 sm:h-5 sm:w-5 text-primary-foreground" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="h-1.5 xs:h-2 sm:h-3 md:h-4 w-12 xs:w-16 sm:w-24 md:w-32 bg-foreground/20 rounded-sm" />
                            <div className="h-1 xs:h-1.5 sm:h-2 md:h-3 w-8 xs:w-10 sm:w-16 md:w-24 bg-muted-foreground/20 rounded-sm mt-0.5 xs:mt-1 sm:mt-1.5" />
                          </div>
                        </div>
                        <div className="flex gap-1 xs:gap-1.5 sm:gap-2 flex-shrink-0">
                          <div className="h-4 xs:h-6 sm:h-8 w-8 xs:w-12 sm:w-16 md:w-20 bg-primary/20 rounded-xs xs:rounded-md sm:rounded-lg" />
                          <div className="h-4 xs:h-6 sm:h-8 w-4 xs:w-6 sm:w-6 md:w-8 bg-muted rounded-xs xs:rounded-md sm:rounded-lg" />
                        </div>
                      </div>

                      {/* Stats cards - 2x2 on mobile/tablet, 4 on desktop */}
                      <div className="grid grid-cols-2 gap-1 xs:gap-1.5 sm:gap-3 lg:gap-4">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="bg-muted rounded-sm xs:rounded-lg sm:rounded-xl p-1 xs:p-1.5 sm:p-3 lg:p-4 space-y-1 xs:space-y-1.5 sm:space-y-2">
                            <div className="h-3 w-3 xs:h-4 xs:w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 bg-primary/20 rounded-xs xs:rounded-md sm:rounded-lg" />
                            <div className="h-2 xs:h-3 sm:h-4 md:h-6 w-6 xs:w-8 sm:w-10 md:w-16 bg-foreground/20 rounded-sm" />
                            <div className="h-1 xs:h-1.5 sm:h-2 md:h-3 w-8 xs:w-10 sm:w-14 md:w-20 bg-muted-foreground/20 rounded-sm" />
                          </div>
                        ))}
                      </div>

                      {/* Main content area - stacks on mobile, 3 cols on desktop */}
                      <div className="grid grid-cols-1 xs:grid-cols-3 gap-1 xs:gap-1.5 sm:gap-3 lg:gap-4">
                        <div className="xs:col-span-2 bg-muted rounded-sm xs:rounded-lg sm:rounded-xl p-1.5 xs:p-2 sm:p-4 lg:p-6 space-y-1 xs:space-y-1.5 sm:space-y-2 lg:space-y-3">
                          <div className="h-2 xs:h-3 sm:h-4 md:h-5 w-12 xs:w-16 sm:w-24 md:w-32 lg:w-40 bg-foreground/20 rounded-sm" />
                          <div className="flex gap-1 xs:gap-1.5 sm:gap-2">
                            {[...Array(6)].map((_, i) => (
                              <div key={i} className="flex-1 h-10 xs:h-14 sm:h-16 md:h-20 lg:h-24 bg-primary/10 rounded-xs xs:rounded-md sm:rounded-lg" />
                            ))}
                          </div>
                        </div>
                        <div className="bg-muted rounded-sm xs:rounded-lg sm:rounded-xl p-1.5 xs:p-2 sm:p-4 lg:p-6 space-y-1 xs:space-y-1.5 sm:space-y-2 lg:space-y-3">
                          <div className="h-2 xs:h-3 sm:h-4 md:h-5 w-8 xs:w-12 sm:w-16 md:w-20 lg:w-24 bg-foreground/20 rounded-sm" />
                          <div className="h-8 xs:h-10 sm:h-14 md:h-16 lg:h-20 bg-secondary/10 rounded-xs xs:rounded-md sm:rounded-lg" />
                          <div className="h-1 xs:h-1.5 sm:h-2 md:h-3 w-full bg-muted-foreground/20 rounded-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dashboard content - Dark mode (hidden in light) */}
                <div className="hidden dark:block aspect-[16/10] xs:aspect-[16/9] sm:aspect-[16/10] p-0.5 xs:p-1">
                  <div className="h-full w-full rounded-lg xs:rounded-xl sm:rounded-2xl p-2 xs:p-3 sm:p-6 lg:p-8 flex flex-col items-center justify-center overflow-hidden" >
                    {/* Dashboard mockup UI - Fully contained */}
                    <div className="w-full max-w-[95%] xs:max-w-lg sm:max-w-2xl lg:max-w-4xl space-y-1.5 xs:space-y-2 sm:space-y-4 lg:space-y-6">
                      {/* Top bar */}
                      <div className="flex items-center justify-between gap-1 xs:gap-2 sm:gap-4">
                        <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 min-w-0 flex-1">
                          <div className="h-4 w-4 xs:h-6 xs:w-6 sm:h-10 sm:w-10 rounded-md xs:rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-2 w-2 xs:h-3 xs:w-3 sm:h-5 sm:w-5 text-primary-foreground" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="h-1.5 xs:h-2 sm:h-3 md:h-4 w-12 xs:w-16 sm:w-24 md:w-32 bg-foreground/20 rounded-sm" />
                            <div className="h-1 xs:h-1.5 sm:h-2 md:h-3 w-8 xs:w-10 sm:w-16 md:w-24 bg-muted-foreground/20 rounded-sm mt-0.5 xs:mt-1 sm:mt-1.5" />
                          </div>
                        </div>
                        <div className="flex gap-1 xs:gap-1.5 sm:gap-2 flex-shrink-0">
                          <div className="h-4 xs:h-6 sm:h-8 w-8 xs:w-12 sm:w-16 md:w-20 bg-primary/20 rounded-xs xs:rounded-md sm:rounded-lg" />
                          <div className="h-4 xs:h-6 sm:h-8 w-4 xs:w-6 sm:w-6 md:w-8 bg-muted rounded-xs xs:rounded-md sm:rounded-lg" />
                        </div>
                      </div>

                      {/* Stats cards - 2x2 on mobile/tablet, 4 on desktop */}
                      <div className="grid grid-cols-2 gap-1 xs:gap-1.5 sm:gap-3 lg:gap-4">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="bg-muted rounded-sm xs:rounded-lg sm:rounded-xl p-1 xs:p-1.5 sm:p-3 lg:p-4 space-y-1 xs:space-y-1.5 sm:space-y-2">
                            <div className="h-3 w-3 xs:h-4 xs:w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 bg-primary/20 rounded-xs xs:rounded-md sm:rounded-lg" />
                            <div className="h-2 xs:h-3 sm:h-4 md:h-6 w-6 xs:w-8 sm:w-10 md:w-16 bg-foreground/20 rounded-sm" />
                            <div className="h-1 xs:h-1.5 sm:h-2 md:h-3 w-8 xs:w-10 sm:w-14 md:w-20 bg-muted-foreground/20 rounded-sm" />
                          </div>
                        ))}
                      </div>

                      {/* Main content area - stacks on mobile, 3 cols on desktop */}
                      <div className="grid grid-cols-1 xs:grid-cols-3 gap-1 xs:gap-1.5 sm:gap-3 lg:gap-4">
                        <div className="xs:col-span-2 bg-muted rounded-sm xs:rounded-lg sm:rounded-xl p-1.5 xs:p-2 sm:p-4 lg:p-6 space-y-1 xs:space-y-1.5 sm:space-y-2 lg:space-y-3">
                          <div className="h-2 xs:h-3 sm:h-4 md:h-5 w-12 xs:w-16 sm:w-24 md:w-32 lg:w-40 bg-foreground/20 rounded-sm" />
                          <div className="flex gap-1 xs:gap-1.5 sm:gap-2">
                            {[...Array(6)].map((_, i) => (
                              <div key={i} className="flex-1 h-10 xs:h-14 sm:h-16 md:h-20 lg:h-24 bg-primary/10 rounded-xs xs:rounded-md sm:rounded-lg" />
                            ))}
                          </div>
                        </div>
                        <div className="bg-muted rounded-sm xs:rounded-lg sm:rounded-xl p-1.5 xs:p-2 sm:p-4 lg:p-6 space-y-1 xs:space-y-1.5 sm:space-y-2 lg:space-y-3">
                          <div className="h-2 xs:h-3 sm:h-4 md:h-5 w-8 xs:w-12 sm:w-16 md:w-20 lg:w-24 bg-foreground/20 rounded-sm" />
                          <div className="h-8 xs:h-10 sm:h-14 md:h-16 lg:h-20 bg-secondary/10 rounded-xs xs:rounded-md sm:rounded-lg" />
                          <div className="h-1 xs:h-1.5 sm:h-2 md:h-3 w-full bg-muted-foreground/20 rounded-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DotBackground>

      {/* Stats Section - Improved spacing and animations */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-border bg-background/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                  <CountUp value={stat.value} delay={index * 0.2} />
                </div>
                <div className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium px-2">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Improved spacing */}
      <section id="features" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8" ref={featuresSectionRef}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 ref={featuresHeadingRef} className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2">
              Everything You Need to{" "}
              <span className="bg-linear-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                Plan Perfect Events
              </span>
            </h2>
            <p ref={featuresSubheadingRef} className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              Powerful features powered by AI to make event planning effortless
              and enjoyable.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="feature-card group p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-card border border-border hover:border-primary transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section - Improved spacing */}
      <section
        id="how-it-works"
        className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-indigo-600 via-purple-600 to-cyan-600"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 px-2">
              How It Works
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto px-2">
              Get started in minutes and plan your first AI-powered event today.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                step: "01",
                title: "Create Your Event",
                description:
                  "Enter basic details about your event - type, date, location, and expected attendees.",
              },
              {
                step: "02",
                title: "AI Generates Plan",
                description:
                  "Our AI creates a comprehensive plan with schedule, budget, suggestions, and checklists.",
              },
              {
                step: "03",
                title: "Execute & Optimize",
                description:
                  "Follow your plan, track progress, and get real-time suggestions for improvements.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 hover:scale-[1.02] sm:hover:scale-110 transition-all duration-300 ease-in-out cursor-pointer"
              >
                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white/20 mb-3 sm:mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-2 sm:mb-3">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-indigo-100 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Dynamic Reviews */}
      <ReviewsSection />

      {/* CTA Section - Improved spacing */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative p-6 sm:p-10 lg:p-12 rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-600 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative text-center">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-2">
                Ready to Plan Your First Event?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-indigo-100 mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto px-2">
                Join thousands of event planners who save time and create better
                events with AI.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
                <Link href="/sign-up" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="text-base px-6 sm:px-8 h-11 sm:h-12 bg-white text-indigo-600 hover:bg-foreground/70 w-full sm:w-auto"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-base px-6 sm:px-8 h-11 sm:h-12 border-white hover:bg-white/10 w-full sm:w-auto"
                  >
                    View Demo
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
