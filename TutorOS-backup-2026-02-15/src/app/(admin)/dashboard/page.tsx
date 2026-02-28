"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    {
      label: "Questions",
      value: "1.24M",
      change: "+12.4%",
      positive: true,
      icon: "📚",
    },
    {
      label: "Active Quizzes",
      value: "452",
      change: "+5.1%",
      positive: true,
      icon: "🎯",
    },
    {
      label: "Students",
      value: "8,920",
      change: "+24.8%",
      positive: true,
      icon: "👥",
    },
  ];

  const activities = [
    { title: "AMC 12 Question Set imported", time: "2 hours ago" },
    { title: "Quiz #452 generated via AI Curator", time: "4 hours ago" },
    { title: "Taxonomy sync completed", time: "6 hours ago" },
    { title: "New worksheet extracted (24 questions)", time: "8 hours ago" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-black text-gradient mb-3">
          Welcome back, {user?.displayName?.split(" ")[0] || "Admin"}
        </h1>
        <p className="text-lg text-white/40">
          Your AI-powered math ecosystem is running smoothly.
        </p>
      </motion.header>

      {/* Stats Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="card group"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-3xl opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                {stat.icon}
              </span>
              <span
                className={`tag ${stat.positive ? "tag-secondary" : "tag-accent"}`}
              >
                {stat.change}
              </span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2">
              {stat.label}
            </p>
            <p className="text-3xl font-black text-white">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white/90 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-sm">
              🚀
            </span>
            Quick Actions
          </h2>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.1, delayChildren: 0.3 },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              <Link
                href="/dashboard/extractor"
                className="card group border-primary/20 hover:border-primary/40 bg-primary/2 block h-full"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  🤖
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                  AI Extractor
                </h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  Import questions from PDF worksheets with automatic taxonomy
                  tagging.
                </p>
              </Link>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              <Link
                href="/dashboard/curator"
                className="card group border-secondary/20 hover:border-secondary/40 bg-secondary/2 block h-full"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  🎯
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-secondary transition-colors">
                  Quiz Curator
                </h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  Build quizzes using natural language commands powered by AI.
                </p>
              </Link>
            </motion.div>
          </motion.div>

          {/* System Status */}
          <div className="card mt-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-6">
              System Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-1 h-10 rounded-full bg-secondary" />
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Gemini 3 Pro</span>
                    <span className="text-secondary font-bold">
                      Operational
                    </span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-[94%] h-full bg-secondary rounded-full" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-1 h-10 rounded-full bg-primary" />
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Firestore</span>
                    <span className="text-primary font-bold">Healthy</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-[88%] h-full bg-primary rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-1">
          <div className="glass rounded-2xl p-6 h-full">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-6">
              Recent Activity
            </h2>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.05, delayChildren: 0.5 },
                },
              }}
              className="space-y-6"
            >
              {activities.map((activity, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  className="relative pl-6 group"
                >
                  <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-primary group-hover:scale-150 transition-transform" />
                  <div className="absolute left-[3px] top-4 w-0.5 h-full bg-white/5" />
                  <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                    {activity.title}
                  </p>
                  <p className="text-xs text-white/30 mt-1">{activity.time}</p>
                </motion.div>
              ))}
            </motion.div>
            <button className="btn btn-outline w-full mt-8 text-xs">
              View All Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
