"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  ChevronRight,
  ChevronLeft,
  Edit2,
  Trash2,
  Brain,
  Target,
  Zap,
  BookOpen,
} from "lucide-react";
import { TaxonomyNode } from "@/types/taxonomy";

type HierarchicalLevel = "unit" | "topic" | "skill";

export default function CourseDetailPage() {
  const { id } = useParams();
  const [subjectNode, setSubjectNode] = useState<TaxonomyNode | null>(null);
  const [currentLevel, setCurrentLevel] = useState<HierarchicalLevel>("unit");
  const [, setSelectedParentId] = useState<string | null>(null);
  const [nodes, setNodes] = useState<TaxonomyNode[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // In a real app, fetch from Firestore
      setSubjectNode({
        id: id as string,
        parentId: null,
        level: "subject",
        name: id === "alg-1" ? "Algebra 1" : (id as string),
        order: 1,
      });

      const sampleUnits: TaxonomyNode[] = [
        {
          id: "u1",
          parentId: id as string,
          level: "unit",
          name: "Linear Equations",
          order: 1,
        },
        {
          id: "u2",
          parentId: id as string,
          level: "unit",
          name: "Quadratics",
          order: 2,
        },
        {
          id: "u3",
          parentId: id as string,
          level: "unit",
          name: "Exponents",
          order: 3,
        },
      ];
      setNodes(sampleUnits);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const levelConfigs = {
    unit: {
      icon: BookOpen,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      next: "topic" as HierarchicalLevel,
    },
    topic: {
      icon: Target,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      next: "skill" as HierarchicalLevel,
    },
    skill: {
      icon: Zap,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      next: null,
    },
  };

  const handleNodeClick = (node: TaxonomyNode) => {
    if (node.level !== "skill") {
      const nextLevel = levelConfigs[node.level as HierarchicalLevel].next!;
      setCurrentLevel(nextLevel);
      setSelectedParentId(node.id);
      // Fetch nodes for node.id...
      setNodes([
        {
          id: `${node.id}-1`,
          parentId: node.id,
          level: nextLevel,
          name: `Sample ${nextLevel} 1`,
          order: 1,
        },
        {
          id: `${node.id}-2`,
          parentId: node.id,
          level: nextLevel,
          name: `Sample ${nextLevel} 2`,
          order: 2,
        },
      ]);
    }
  };

  const goBack = () => {
    if (currentLevel === "topic") {
      setCurrentLevel("unit");
      setSelectedParentId(id as string);
    } else if (currentLevel === "skill") {
      setCurrentLevel("topic");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-white/40">
        <Link
          href="/dashboard/courses"
          className="hover:text-white transition-colors"
        >
          Courses
        </Link>
        <ChevronRight size={14} />
        <span className="text-white/80 font-medium">{subjectNode?.name}</span>
      </nav>

      <header className="flex justify-between items-end">
        <div className="flex items-center gap-4">
          {currentLevel !== "unit" && (
            <button
              onClick={goBack}
              className="p-2 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${levelConfigs[currentLevel].bg} ${levelConfigs[currentLevel].color}`}
              >
                Managing {currentLevel}s
              </span>
            </div>
            <h1 className="text-3xl font-black text-white">
              {currentLevel === "unit"
                ? subjectNode?.name
                : "Current Selection Name"}
            </h1>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-outline flex items-center gap-2">
            <Brain size={18} className="text-secondary" />
            AI Suggest {currentLevel}s
          </button>
          <button className="btn btn-primary flex items-center gap-2">
            <Plus size={18} />
            Add {currentLevel}
          </button>
        </div>
      </header>

      {/* Node List */}
      <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
        <div className="grid grid-cols-1 divide-y divide-white/5">
          <AnimatePresence mode="popLayout">
            {nodes.map((node, i) => {
              const Icon = levelConfigs[node.level as HierarchicalLevel].icon;
              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleNodeClick(node)}
                  className="flex items-center justify-between p-5 hover:bg-white/10 active:bg-white/20 cursor-pointer group transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl ${levelConfigs[node.level as HierarchicalLevel].bg} flex items-center justify-center`}
                    >
                      <Icon
                        className={
                          levelConfigs[node.level as HierarchicalLevel].color
                        }
                        size={20}
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-primary transition-colors">
                        {node.name}
                      </h4>
                      <p className="text-xs text-white/30">
                        {(node.metadata?.count as number) || 0} items nested
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="invisible group-hover:visible flex items-center gap-1">
                      <button className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 hover:bg-red-500/10 rounded-lg text-white/40 hover:text-red-400">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {node.level !== "skill" && (
                      <ChevronRight
                        size={20}
                        className="text-white/10 group-hover:text-white/40 group-hover:translate-x-1 transition-all"
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {nodes.length === 0 && (
          <div className="p-20 text-center">
            <p className="text-white/20 font-medium">
              No {currentLevel}s found.
            </p>
            <button className="mt-4 text-primary font-bold hover:underline mb-2">
              Create your first {currentLevel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
