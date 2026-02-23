"use client";

import React, { useState } from 'react';
import type { Lead } from '@/lib/types';
import { MoreHorizontal, Globe, Mail, Briefcase, Phone, Check, ArrowRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface KanbanBoardProps {
  leads: Lead[];
  onStatusChange: (leadId: string, newStatus: Lead['status']) => Promise<void>;
  onConvert: (lead: Lead) => Promise<void>;
  onAddLeadClick: () => void;
}

const COLUMNS: { id: Lead['status'], label: string, color: string }[] = [
  { id: 'New', label: 'New', color: 'bg-blue-500' },
  { id: 'Contacted', label: 'Contacted', color: 'bg-yellow-500' },
  { id: 'Qualified', label: 'Qualified', color: 'bg-primary' },
  { id: 'Converted', label: 'Converted', color: 'bg-green-500' },
  { id: 'Lost', label: 'Lost', color: 'bg-red-500' },
];

export function KanbanBoard({ leads, onStatusChange, onConvert, onAddLeadClick }: KanbanBoardProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleMove = async (lead: Lead, nextStatus: Lead['status']) => {
    setLoadingId(lead.id);
    await onStatusChange(lead.id, nextStatus);
    setLoadingId(null);
  };

  const handleConvert = async (lead: Lead) => {
    setLoadingId(lead.id);
    await onConvert(lead);
    setLoadingId(null);
  };

  const getSourceIcon = (source: string) => {
    const s = source.toLowerCase();
    if (s.includes('web') || s.includes('inbound')) return <Globe className="w-4 h-4" />;
    if (s.includes('email')) return <Mail className="w-4 h-4" />;
    if (s.includes('linkedin') || s.includes('b2b')) return <Briefcase className="w-4 h-4" />;
    return <Phone className="w-4 h-4" />;
  };

  const getNextStatus = (currentStatus: Lead['status']): Lead['status'] | null => {
    const idx = COLUMNS.findIndex(c => c.id === currentStatus);
    if (idx >= 0 && idx < COLUMNS.length - 2) { // Allow moving up to Qualified (before Converted/Lost)
      return COLUMNS[idx + 1].id;
    }
    return null;
  };

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden pt-4 pb-8 min-h-[calc(100vh-140px)]">
      <div className="flex h-full gap-6 min-w-max items-start">
        {COLUMNS.map(column => {
          const columnLeads = leads.filter(l => l.status === column.id);
          
          return (
            <div key={column.id} className="flex flex-col w-[320px] flex-shrink-0 max-h-full rounded-2xl bg-surface-dark/50 border border-border-dark/50">
              {/* Column Header */}
              <div className="p-4 flex items-center justify-between border-b border-border-dark/50 shrink-0">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${column.color}`}></div>
                  <h3 className="font-bold text-white tracking-wide">{column.label}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-border-dark text-xs font-medium text-slate-400">
                    {columnLeads.length}
                  </span>
                </div>
                <button className="text-slate-500 hover:text-white transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Column Content */}
              <div className="flex-1 overflow-y-auto kanban-col p-3 space-y-3">
                {columnLeads.map(lead => {
                  const isProcessing = loadingId === lead.id;
                  const nextStatus = getNextStatus(lead.status);
                  
                  return (
                    <div 
                      key={lead.id} 
                      className={cn(
                        "group relative bg-card-dark p-4 rounded-xl border border-border-dark hover:border-primary/50 transition-all text-left",
                        lead.status === 'Converted' ? "opacity-75 hover:opacity-100" : "hover:shadow-[0_0_15px_-5px_rgba(157,43,238,0.3)]",
                        isProcessing && "opacity-50 pointer-events-none"
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={cn("font-bold text-white text-base", lead.status === 'Converted' && "line-through text-slate-400")}>
                          {lead.name}
                        </h4>
                        <span className="text-xs text-slate-500 font-mono">
                          {lead.dateAdded ? new Date(lead.dateAdded).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'New'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3 text-slate-500">
                        {getSourceIcon(lead.source)}
                        <span className="text-xs text-slate-400 truncate">{lead.source || 'Direct'}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {/* Need mock tags for now since Leads don't have arrays of tags natively right now */}
                        <span className="px-2.5 py-1 rounded-full bg-primary/20 text-primary-glow text-xs font-medium border border-primary/20 truncate max-w-full">
                          {lead.notes ? lead.notes.substring(0, 20) + (lead.notes.length > 20 ? '...' : '') : 'Lead'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2 pt-3 border-t border-border-dark/50">
                        <div className="flex -space-x-2">
                           <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-card-dark">
                             {lead.name.charAt(0).toUpperCase()}
                           </div>
                        </div>
                        
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          {nextStatus && (
                            <button 
                              onClick={() => handleMove(lead, nextStatus)}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-dark hover:bg-primary hover:text-white text-slate-400 transition-colors"
                              title={`Move to ${nextStatus}`}
                            >
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          )}
                          
                          {lead.status === 'Qualified' && (
                            <button 
                              onClick={() => handleConvert(lead)}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-dark hover:bg-green-500 hover:text-white text-slate-400 transition-colors"
                              title="Convert to Student"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Quick Add Action (only for New/Contacted) */}
                {(column.id === 'New' || column.id === 'Contacted') && (
                  <button 
                    onClick={onAddLeadClick}
                    className="w-full py-2.5 mt-2 flex items-center justify-center gap-2 rounded-xl border border-dashed border-border-dark text-slate-500 hover:text-primary-glow hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    New Lead
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
