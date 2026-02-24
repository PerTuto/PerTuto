"use client";

import React, { useState } from 'react';
import type { Lead } from '@/lib/types';
import { MoreHorizontal, Globe, Mail, Briefcase, Phone, Check, ArrowRight, Plus, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KanbanBoardProps {
  leads: Lead[];
  onStatusChange: (leadId: string, newStatus: Lead['status']) => Promise<void>;
  onConvert: (lead: Lead) => Promise<void>;
  onAddLeadClick: () => void;
  onEditClick: (lead: Lead) => void;
}

function formatLeadDate(dateAdded: any): string {
  if (!dateAdded) return 'New';
  const date = dateAdded?.seconds
    ? new Date(dateAdded.seconds * 1000)
    : new Date(dateAdded);
  return isNaN(date.getTime())
    ? 'New'
    : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const COLUMNS: { id: Lead['status'], label: string, color: string }[] = [
  { id: 'New', label: 'New', color: 'bg-blue-500' },
  { id: 'Contacted', label: 'Contacted', color: 'bg-yellow-500' },
  { id: 'Qualified', label: 'Qualified', color: 'bg-primary' },
  { id: 'Converted', label: 'Converted', color: 'bg-green-500' },
  { id: 'Lost', label: 'Lost', color: 'bg-red-500' },
];

export function KanbanBoard({ leads, onStatusChange, onConvert, onAddLeadClick, onEditClick }: KanbanBoardProps) {
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
    if (idx >= 0 && idx < COLUMNS.length - 2) {
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
            <div key={column.id} className="flex flex-col w-[320px] flex-shrink-0 max-h-full rounded-2xl bg-secondary/50 border border-border">
              {/* Column Header */}
              <div className="p-4 flex items-center justify-between border-b border-border shrink-0">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${column.color}`}></div>
                  <h3 className="font-bold text-foreground tracking-wide">{column.label}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                    {columnLeads.length}
                  </span>
                </div>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
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
                        "group relative bg-white p-4 rounded-xl border border-border hover:border-primary/50 transition-all text-left shadow-sm hover:shadow-md cursor-pointer",
                        lead.status === 'Converted' ? "opacity-75 hover:opacity-100" : "",
                        isProcessing && "opacity-50 pointer-events-none"
                      )}
                      onClick={() => onEditClick(lead)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={cn("font-bold text-foreground text-base", lead.status === 'Converted' && "line-through text-muted-foreground")}>
                          {lead.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground font-mono">
                            {formatLeadDate(lead.dateAdded)}
                          </span>
                          <Pencil className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                        {getSourceIcon(lead.source)}
                        <span className="text-xs text-muted-foreground truncate">{lead.source || 'Direct'}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20 truncate max-w-full">
                          {lead.notes ? lead.notes.substring(0, 20) + (lead.notes.length > 20 ? '...' : '') : 'Lead'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2 pt-3 border-t border-border">
                        <div className="flex -space-x-2">
                           <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-white">
                             {lead.name.charAt(0).toUpperCase()}
                           </div>
                        </div>
                        
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          {nextStatus && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleMove(lead, nextStatus); }}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary hover:bg-primary hover:text-white text-muted-foreground transition-colors"
                              title={`Move to ${nextStatus}`}
                            >
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          )}
                          
                          {lead.status === 'Qualified' && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleConvert(lead); }}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary hover:bg-green-500 hover:text-white text-muted-foreground transition-colors"
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
                    className="w-full py-2.5 mt-2 flex items-center justify-center gap-2 rounded-xl border border-dashed border-border text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm font-medium"
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
