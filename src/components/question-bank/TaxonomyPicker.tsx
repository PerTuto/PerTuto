
"use client";

import React, { useEffect, useState } from "react";
import { getTaxonomyNodes } from "../../lib/firebase/services/taxonomy";
import { TaxonomyNode } from "../../lib/types";
import { ChevronRight, Loader } from "lucide-react";
import { useParams } from "next/navigation";

interface TaxonomyPickerProps {
  value?: { domainId?: string; topicId?: string; subTopicId?: string };
  onChange: (value: {
    domainId: string;
    topicId?: string;
    subTopicId?: string;
  }) => void;
}

export default function TaxonomyPicker({
  value,
  onChange,
}: TaxonomyPickerProps) {
  const { tenantId } = useParams() as { tenantId: string };
  const [domains, setDomains] = useState<TaxonomyNode[]>([]);
  const [topics, setTopics] = useState<TaxonomyNode[]>([]);
  const [subTopics, setSubTopics] = useState<TaxonomyNode[]>([]);

  const [loading, setLoading] = useState(true);

  // Load Domains (parentId null)
  useEffect(() => {
    const loadDomains = async () => {
      try {
        const data = await getTaxonomyNodes(tenantId, null);
        setDomains(data);
      } catch (error) {
        console.error("Failed to load domains", error);
      } finally {
        setLoading(false);
      }
    };
    loadDomains();
  }, [tenantId]);

  // Load Topics (parentId = domainId)
  useEffect(() => {
    if (value?.domainId) {
      const loadTopics = async () => {
        const data = await getTaxonomyNodes(tenantId, value.domainId!);
        setTopics(data);
        setSubTopics([]); 
      };
      loadTopics();
    } else {
      setTopics([]);
      setSubTopics([]);
    }
  }, [tenantId, value?.domainId]);

  // Load Subtopics (parentId = topicId)
  useEffect(() => {
    if (value?.topicId) {
      const loadSubTopics = async () => {
        const data = await getTaxonomyNodes(tenantId, value.topicId!);
        setSubTopics(data);
      };
      loadSubTopics();
    } else {
      setSubTopics([]);
    }
  }, [tenantId, value?.topicId]);

  if (loading)
    return (
      <div className="flex items-center gap-2 text-muted-foreground dark:text-white/40">
        <Loader className="w-4 h-4 animate-spin" /> Loading Taxonomy...
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Domain Column */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/30 tracking-widest">
          Domain
        </label>
        <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-2 rounded-xl h-48 overflow-y-auto custom-scrollbar">
          {domains.map((domain) => (
            <button
              key={domain.id}
              type="button"
              onClick={() => onChange({ domainId: domain.id })}
              className={`w-full text-start px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between group ${
                value?.domainId === domain.id
                  ? "bg-primary/10 dark:bg-primary/20 text-slate-900 dark:text-white font-medium"
                  : "text-slate-600 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {domain.name}
              {value?.domainId === domain.id && (
                <ChevronRight className="w-4 h-4 text-primary" />
              )}
            </button>
          ))}
          {domains.length === 0 && (
            <div className="h-full flex items-center justify-center text-[10px] text-muted-foreground dark:text-white/20 italic p-4 text-center">
              No domains found
            </div>
          )}
        </div>
      </div>

      {/* Topic Column */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/30 tracking-widest">
          Topic
        </label>
        <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-2 rounded-xl h-48 overflow-y-auto custom-scrollbar">
          {topics.length === 0 && (
            <div className="h-full flex items-center justify-center text-[10px] text-muted-foreground dark:text-white/20 italic p-4 text-center">
              {value?.domainId ? "No topics found" : "Select a domain"}
            </div>
          )}
          {topics.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() =>
                value?.domainId &&
                onChange({ domainId: value.domainId, topicId: topic.id })
              }
              className={`w-full text-start px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between group ${
                value?.topicId === topic.id
                  ? "bg-secondary/10 dark:bg-secondary/20 text-slate-900 dark:text-white font-medium"
                  : "text-slate-600 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {topic.name}
              {value?.topicId === topic.id && (
                <ChevronRight className="w-4 h-4 text-secondary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* SubTopic Column */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/30 tracking-widest">
          Subtopic
        </label>
        <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-2 rounded-xl h-48 overflow-y-auto custom-scrollbar">
          {subTopics.length === 0 && (
            <div className="h-full flex items-center justify-center text-[10px] text-muted-foreground dark:text-white/20 italic p-4 text-center">
              {value?.topicId ? "No subtopics found" : "Select a topic"}
            </div>
          )}
          {subTopics.map((sub) => (
            <button
              key={sub.id}
              type="button"
              onClick={() =>
                value?.domainId &&
                onChange({
                  domainId: value.domainId,
                  topicId: value.topicId,
                  subTopicId: sub.id,
                })
              }
              className={`w-full text-start px-3 py-2 rounded-lg text-xs transition-all ${
                value?.subTopicId === sub.id
                  ? "bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white font-medium"
                  : "text-slate-600 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
