"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-white/3 flex items-center justify-center mb-6 border border-white/5 shadow-xl">
        <Icon className="w-8 h-8 text-white/20" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-white/40 text-sm max-w-xs mx-auto leading-relaxed mb-8">
        {description}
      </p>
      {action && <div>{action}</div>}
    </motion.div>
  );
}
