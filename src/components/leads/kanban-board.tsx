"use client";

import React, { useState } from 'react';
import { type Lead, LeadStatus } from '@/lib/types';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragStartEvent, 
  DragOverEvent, 
  DragEndEvent,
  defaultDropAnimationSideEffects,
  DropAnimation
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal, Globe, Mail, Briefcase, Phone, Check, ArrowRight, Plus, Pencil, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface KanbanBoardProps {
  leads: Lead[];
  onStatusChange: (leadId: string, newStatus: Lead['status']) => Promise<void>;
  onConvert: (lead: Lead) => Promise<void>;
  onAddLeadClick: () => void;
  onEditClick: (lead: Lead) => void;
}

const COLUMNS: { id: LeadStatus, label: string, color: string }[] = [
  { id: LeadStatus.New, label: 'New', color: 'bg-blue-500' },
  { id: LeadStatus.Contacted, label: 'Contacted', color: 'bg-yellow-500' },
  { id: LeadStatus.Qualified, label: 'Qualified', color: 'bg-primary' },
  { id: LeadStatus.Converted, label: 'Converted', color: 'bg-green-500' },
  { id: LeadStatus.Lost, label: 'Lost', color: 'bg-red-500' },
  { id: LeadStatus.Waitlisted, label: 'Waitlisted', color: 'bg-yellow-600' }
];

function formatLeadDate(dateAdded: any): string {
  if (!dateAdded) return 'New';
  const date = dateAdded?.seconds
    ? new Date(dateAdded.seconds * 1000)
    : new Date(dateAdded);
  return isNaN(date.getTime())
    ? 'New'
    : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function getSourceIcon(source: string) {
  const s = source?.toLowerCase() || '';
  if (s.includes('web') || s.includes('inbound')) return <Globe className="w-4 h-4" />;
  if (s.includes('email')) return <Mail className="w-4 h-4" />;
  if (s.includes('linkedin') || s.includes('b2b')) return <Briefcase className="w-4 h-4" />;
  return <Phone className="w-4 h-4" />;
}

// --- Sortable Lead Card ---
function SortableLeadCard({ lead, isProcessing, onEditClick }: { lead: Lead, isProcessing: boolean, onEditClick: (lead: Lead) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: lead.id, data: { lead } });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative bg-white p-4 rounded-xl border border-border hover:border-primary/50 transition-all text-left shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing",
        lead.status === LeadStatus.Converted ? "opacity-75" : "",
        isDragging && "opacity-30 border-primary",
        isProcessing && "opacity-50 pointer-events-none"
      )}
      onClick={() => onEditClick(lead)}
      {...attributes}
      {...listeners}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className={cn("font-bold text-foreground text-base", lead.status === LeadStatus.Converted && "line-through text-muted-foreground")}>
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
      
      <div className="flex flex-wrap gap-2 mb-2">
        <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20 truncate max-w-full">
          {lead.notes ? lead.notes.substring(0, 20) + (lead.notes.length > 20 ? '...' : '') : 'Lead'}
        </span>
        {lead.aiCategory && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-[10px] font-bold gap-1",
                  lead.aiCategory === 'Hot' && "bg-orange-100 text-orange-700 border-orange-200",
                  lead.aiCategory === 'Warm' && "bg-yellow-100 text-yellow-700 border-yellow-200",
                  lead.aiCategory === 'Cold' && "bg-slate-100 text-slate-500 border-slate-200"
                )}
              >
                <Zap className="w-2.5 h-2.5 fill-current" />
                {lead.aiCategory} {lead.aiScore}%
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[180px] text-[11px]">
              {lead.aiReasoning}
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      <div className="flex items-center justify-between mt-2 pt-3 border-t border-border">
        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white">
          {lead.name.charAt(0).toUpperCase()}
        </div>
        {lead.status === LeadStatus.Qualified && (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none text-[10px]">Qualified</Badge>
        )}
      </div>
    </div>
  );
}



export function KanbanBoard({ leads, onStatusChange, onConvert, onAddLeadClick, onEditClick }: KanbanBoardProps) {
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveLead(event.active.data.current?.lead);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveLead(null);

    if (!over) return;

    const leadId = active.id as string;
    const newStatus = over.id as LeadStatus;

    // Check if it's a valid status column
    if (Object.values(LeadStatus).includes(newStatus) && active.data.current?.lead.status !== newStatus) {
      setLoadingId(leadId);
      await onStatusChange(leadId, newStatus);
      setLoadingId(null);
    }
  }

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <TooltipProvider delayDuration={300}>
        <div className="flex-1 overflow-x-auto overflow-y-hidden pt-4 pb-8 min-h-[calc(100vh-140px)]">
        <div className="flex h-full gap-6 min-w-max items-start">
          {COLUMNS.map(column => {
            const columnLeads = leads.filter(l => l.status === column.id);
            
            return (
              <div key={column.id} className="flex flex-col w-[320px] flex-shrink-0 max-h-full rounded-2xl bg-secondary/50 border border-border">
                {/* Column Header */}
                <div className="p-4 flex items-center justify-between border-b border-border shrink-0">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", column.color)}></div>
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
                <SortableContext 
                  id={column.id}
                  items={columnLeads.map(l => l.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex-1 overflow-y-auto kanban-col p-3 space-y-3 min-h-[150px]">
                    {columnLeads.map(lead => (
                      <SortableLeadCard 
                        key={lead.id} 
                        lead={lead} 
                        isProcessing={loadingId === lead.id}
                        onEditClick={onEditClick}
                      />
                    ))}

                    {/* Quick Add Action (only for New/Contacted) */}
                    {(column.id === LeadStatus.New || column.id === LeadStatus.Contacted) && (
                      <button 
                        onClick={onAddLeadClick}
                        className="w-full py-2.5 mt-2 flex items-center justify-center gap-2 rounded-xl border border-dashed border-border text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        New Lead
                      </button>
                    )}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>
      </div>
    </TooltipProvider>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeLead ? (
          <div className="bg-white p-4 rounded-xl border border-primary shadow-xl w-[296px] rotate-3 cursor-grabbing">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-foreground text-base">{activeLead.name}</h4>
              <span className="text-xs text-muted-foreground font-mono">{formatLeadDate(activeLead.dateAdded)}</span>
            </div>
            <div className="flex items-center gap-2 mb-3 text-muted-foreground">
              {getSourceIcon(activeLead.source)}
              <span className="text-xs text-muted-foreground truncate">{activeLead.source || 'Direct'}</span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
