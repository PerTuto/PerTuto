"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "@/lib/firebase/auth";
import "@/app/globals.css";
import {
  Loader,
  BarChart3,
  Book,
  Bot,
  Target,
  LogOut,
  Settings,
  Award,
  BookOpen,
  CheckCircle,
} from "lucide-react";
import TransitionProvider from "@/components/providers/TransitionProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, userProfile, loading, isAdmin, isStudent } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-10 h-10 text-primary animate-spin" />
          <p className="text-white/40 animate-pulse">Initializing TutorOS...</p>
        </div>
      </div>
    );
  }

  if (!user) return null; // Prevent flash of content before redirect

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-72 glass border-r border-white/5 flex flex-col p-6 sticky top-0 h-screen z-50">
        {/* Logo */}
        <div className="mb-10">
          <Link href="/dashboard" className="group block">
            <h1 className="text-2xl font-black text-gradient-primary tracking-tight group-hover:opacity-80 transition-opacity">
              TutorOS
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                AI Engine Active
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {isAdmin && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.05 } },
              }}
              className="space-y-1"
            >
              {[
                { href: "/dashboard", icon: BarChart3, label: "Dashboard" },
                {
                  href: "/dashboard/courses",
                  icon: BookOpen,
                  label: "Course Manager",
                },
                {
                  href: "/dashboard/questions",
                  icon: Book,
                  label: "Question Bank",
                },
                {
                  href: "/dashboard/extractor",
                  icon: Bot,
                  label: "AI Extractor",
                },
                {
                  href: "/dashboard/curator",
                  icon: CheckCircle,
                  label: "Quiz Curator",
                },
                {
                  href: "/dashboard/review",
                  icon: CheckCircle,
                  label: "Review Queue",
                },
                { href: "/dashboard/quizzes", icon: Target, label: "Quizzes" },
              ].map((link) => (
                <motion.div
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <Link
                    href={link.href}
                    className={`sidebar-link ${
                      pathname === link.href ||
                      (link.href !== "/dashboard" &&
                        pathname.startsWith(link.href))
                        ? "active"
                        : ""
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0 },
                }}
                className="my-2 border-t border-white/5 mx-2"
              />
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0 },
                }}
              >
                <Link
                  href="/dashboard/settings"
                  className={`sidebar-link ${pathname.startsWith("/dashboard/settings") ? "active" : ""}`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
              </motion.div>
            </motion.div>
          )}

          {isStudent && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.05 } },
              }}
              className="space-y-1"
            >
              {[
                {
                  href: "/student/dashboard",
                  icon: BarChart3,
                  label: "My Dashboard",
                },
                {
                  href: "/student/quizzes",
                  icon: Target,
                  label: "My Quizzes",
                },
                { href: "/student/results", icon: Award, label: "My Results" },
              ].map((link) => (
                <motion.div
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <Link
                    href={link.href}
                    className={`sidebar-link ${
                      pathname === link.href || pathname.startsWith(link.href)
                        ? "active"
                        : ""
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </nav>

        {/* User Profile */}
        <div className="pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/3 transition-colors cursor-pointer group relative">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center font-bold text-sm text-white">
                {user.displayName
                  ? user.displayName[0].toUpperCase()
                  : user.email?.[0].toUpperCase()}
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-secondary border-2 border-background rounded-full" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white/90 truncate">
                {user.displayName || "Admin User"}
              </p>
              <p className="text-xs text-white/40 truncate">
                {/* Using userProfile role or defaulting */}
                {userProfile?.role === "admin" ? "Administrator" : "User"}
              </p>
            </div>

            {/* Sign Out Button (visible on hover) */}
            <button
              onClick={handleSignOut}
              className="absolute right-2 p-2 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto w-full relative">
        {/* Background Gradients for Main Content Area */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-[-1] pointer-events-none">
          <div className="absolute top-[10%] right-[5%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-[10%] left-[20%] w-[20%] h-[20%] bg-secondary/5 rounded-full blur-[80px]" />
        </div>
        <TransitionProvider>{children}</TransitionProvider>
      </main>
    </div>
  );
}
