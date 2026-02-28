"use client";

import React, { useState } from "react";
import {
  seedInitialTaxonomy,
  seedOpenStaxTaxonomy,
} from "@/lib/firebase/taxonomy";
import { seedOpenStaxQuestions } from "@/lib/firebase/questions";
import { Database, Loader, BookOpen } from "lucide-react";
import { toast } from "react-hot-toast";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSeedTaxonomy = async () => {
    if (
      !confirm("This will overwrite existing taxonomy structure. Are you sure?")
    )
      return;

    setLoading(true);
    try {
      await seedInitialTaxonomy();
      toast.success("Default taxonomy initialized!");
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Seeding failed: " + message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStaxSeed = async () => {
    setLoading(true);
    try {
      await seedOpenStaxTaxonomy();
      toast.success("OpenStax (Algebra & Trig) seeded successfully!");
    } catch (e: unknown) {
      console.error(e);
      const message = e instanceof Error ? e.message : String(e);
      toast.error("Failed to seed OpenStax: " + message);
    } finally {
      setLoading(false);
    }
  };

  const handleHydrateQuestions = async () => {
    setLoading(true);
    try {
      await seedOpenStaxQuestions();
      toast.success("OpenStax questions hydrated!");
    } catch (e: unknown) {
      console.error(e);
      const message = e instanceof Error ? e.message : String(e);
      toast.error("Failed to hydrate questions: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">System Settings</h1>
        <p className="text-white/40">
          Manage platform configuration and data initialization.
        </p>
      </header>

      <div className="space-y-6">
        {/* Data Management Section */}
        <section className="card p-6 border-white/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
              <Database className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">
                Taxonomy Data
              </h3>
              <p className="text-sm text-white/50 mb-6">
                Initialize or reset the core taxonomy structure (Domains,
                Topics, Subtopics). This is required for the Question Bank to
                function.
              </p>

              <button
                onClick={handleSeedTaxonomy}
                disabled={loading}
                className="btn btn-secondary flex items-center gap-2"
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Database className="w-4 h-4" />
                )}
                Initialize Default Taxonomy
              </button>
              <button
                onClick={handleOpenStaxSeed}
                disabled={loading}
                className="btn bg-white/5 border border-white/10 hover:bg-white/10 text-white w-full justify-center py-4 mt-4"
              >
                {loading ? (
                  <Loader className="animate-spin mr-2" />
                ) : (
                  <BookOpen className="mr-2 text-blue-400" />
                )}
                Ingest OpenStax Curriculum
              </button>
              <button
                onClick={handleHydrateQuestions}
                disabled={loading}
                className="btn bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 text-blue-400 w-full justify-center py-4 mt-4"
              >
                {loading ? (
                  <Loader className="animate-spin mr-2" />
                ) : (
                  <Database className="mr-2" />
                )}
                Hydrate OpenStax Questions
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
