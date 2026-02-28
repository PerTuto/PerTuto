"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronRight, Edit2, Trash2, Brain } from "lucide-react";
import { TaxonomyNode } from "@/types/taxonomy";

export default function CourseManagerPage() {
  const [nodes, setNodes] = useState<TaxonomyNode[]>([]);
  const [, setLoading] = useState(true);

  // Sample data for initial UI build
  useEffect(() => {
    const fetchInitialData = async () => {
      const sampleNodes: TaxonomyNode[] = [
        {
          id: "alg-1",
          parentId: null,
          level: "subject",
          name: "Algebra 1",
          order: 1,
        },
        {
          id: "geo",
          parentId: null,
          level: "subject",
          name: "Geometry",
          order: 2,
        },
        {
          id: "alg-2",
          parentId: null,
          level: "subject",
          name: "Algebra 2",
          order: 3,
        },
      ];
      setNodes(sampleNodes);
      setLoading(false);
    };
    fetchInitialData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-gradient mb-2">
            Course Manager
          </h1>
          <p className="text-white/40">
            Manage your agency&apos;s educational hierarchy and skill trees.
          </p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus size={18} />
          Add Curriculum
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card group cursor-pointer hover:border-primary/50 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  📚
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button className="p-2 hover:bg-red-500/10 rounded-lg text-white/40 hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{node.name}</h3>
              <p className="text-sm text-white/40 mb-6 line-clamp-2">
                {node.description ||
                  "Standard agency curriculum for mathematical excellence."}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-4 text-xs font-medium text-white/30">
                  <span className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    12 Units
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    45 Topics
                  </span>
                </div>
                <ChevronRight
                  size={18}
                  className="text-white/20 group-hover:translate-x-1 group-hover:text-primary transition-all"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* AI Suggestions Section */}
      <section className="mt-12">
        <div className="glass p-8 rounded-3xl border border-primary/20 bg-primary/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Brain size={120} className="text-primary" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Brain className="text-secondary" />
              AI Syllabus Assistant
            </h2>
            <p className="text-white/60 mb-6">
              Transitioning to a new state or exam board? Use Gemini 3 Deep
              Think to instantly generate a full hierarchy of units, topics, and
              micro-skills for any curriculum.
            </p>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="e.g. IB Analysis and Approaches SL"
                className="input flex-1"
              />
              <button className="btn btn-secondary">Generate</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
