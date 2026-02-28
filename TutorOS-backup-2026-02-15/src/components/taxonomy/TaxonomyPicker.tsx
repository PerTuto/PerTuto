"use client";

import React, { useEffect, useState } from "react";
import { getDomains, getTopics, getSubTopics } from "@/lib/firebase/taxonomy";
import {
  TaxonomyDomain,
  TaxonomyTopic,
  TaxonomySubTopic,
} from "@/types/taxonomy";
import { ChevronRight, Loader } from "lucide-react";

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
  const [domains, setDomains] = useState<TaxonomyDomain[]>([]);
  const [topics, setTopics] = useState<TaxonomyTopic[]>([]);
  const [subTopics, setSubTopics] = useState<TaxonomySubTopic[]>([]);

  const [loading, setLoading] = useState(true);

  // Load Domains on mount
  useEffect(() => {
    const loadDomains = async () => {
      try {
        const data = await getDomains();
        setDomains(data);
      } catch (error) {
        console.error("Failed to load domains", error);
      } finally {
        setLoading(false);
      }
    };
    loadDomains();
  }, []);

  // Load Topics when Domain changes
  useEffect(() => {
    if (value?.domainId) {
      const loadTopics = async () => {
        const data = await getTopics(value.domainId!);
        setTopics(data);
        setSubTopics([]); // Reset subtopics
      };
      loadTopics();
    } else {
      setTopics([]);
      setSubTopics([]);
    }
  }, [value?.domainId]);

  // Load Subtopics when Topic changes
  useEffect(() => {
    if (value?.topicId) {
      const loadSubTopics = async () => {
        const data = await getSubTopics(value.topicId!);
        setSubTopics(data);
      };
      loadSubTopics();
    } else {
      setSubTopics([]);
    }
  }, [value?.topicId]);

  if (loading)
    return (
      <div className="flex items-center gap-2 text-white/40">
        <Loader className="w-4 h-4 animate-spin" /> Loading Taxonomy...
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Domain Column */}
      <div className="space-y-2">
        <label className="text-xs uppercase font-semibold text-white/60 tracking-wider">
          Domain
        </label>
        <div className="bg-white/4 border border-white/15 p-2 rounded-xl max-h-60 overflow-y-auto">
          {domains.map((domain) => (
            <button
              key={domain.id}
              type="button"
              onClick={() => onChange({ domainId: domain.id })}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                value?.domainId === domain.id
                  ? "bg-primary/20 text-white"
                  : "text-white/60 hover:bg-white/5"
              }`}
            >
              {domain.name}
              {value?.domainId === domain.id && (
                <ChevronRight className="w-4 h-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Topic Column */}
      <div className="space-y-2">
        <label className="text-xs uppercase font-semibold text-white/60 tracking-wider">
          Topic
        </label>
        <div className="bg-white/4 border border-white/15 p-2 rounded-xl max-h-60 overflow-y-auto min-h-[120px]">
          {topics.length === 0 && (
            <div className="h-full flex items-center justify-center text-xs text-white/20 italic p-4">
              Select a domain
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
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                value?.topicId === topic.id
                  ? "bg-secondary/20 text-white"
                  : "text-white/60 hover:bg-white/5"
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
        <label className="text-xs uppercase font-semibold text-white/60 tracking-wider">
          Subtopic
        </label>
        <div className="bg-white/4 border border-white/15 p-2 rounded-xl max-h-60 overflow-y-auto min-h-[120px]">
          {subTopics.length === 0 && (
            <div className="h-full flex items-center justify-center text-xs text-white/20 italic p-4">
              {value?.topicId ? "No subtopics" : "Select a topic"}
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
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                value?.subTopicId === sub.id
                  ? "bg-white/10 text-white font-medium"
                  : "text-white/60 hover:bg-white/5"
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
