"use client";

import React, { useEffect, useState } from 'react';
import { type Lead, LeadStatus } from '@/lib/types';
import { AddLeadForm } from '@/components/leads/add-lead-form';
import { EditLeadDialog } from '@/components/leads/edit-lead-dialog';
import { KanbanBoard } from '@/components/leads/kanban-board';
import { getLeads, addLead as addLeadToFirestore, convertLeadToStudent, updateLead, deleteLead } from "@/lib/firebase/services";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RoleGuard } from "@/components/auth/role-guard";
import type { UserRole } from "@/lib/types";

export default function LeadsPage() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  useEffect(() => {
    async function fetchLeads() {
      if (userProfile?.tenantId) {
        setLoading(true);
        try {
          const { leads: data, lastVisible: newLastVisible } = await import('@/lib/firebase/services').then(m => m.getLeadsPaginated(userProfile.tenantId, 50));
          setLeads(data);
          setLastVisible(newLastVisible);
        } catch (error) {
          console.error("Failed to fetch leads:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchLeads();
  }, [userProfile?.tenantId]);

  const loadMore = async () => {
    if (!userProfile?.tenantId || !lastVisible) return;
    setLoadingMore(true);
    try {
      const { leads: newLeads, lastVisible: newLastVisible } = await import('@/lib/firebase/services').then(m => m.getLeadsPaginated(userProfile.tenantId, 50, lastVisible));
      setLeads(prev => [...prev, ...newLeads]);
      setLastVisible(newLastVisible);
    } catch (error) {
      console.error("Failed to load more leads:", error);
      toast({ title: "Error", description: "Failed to load more leads.", variant: "destructive" });
    } finally {
      setLoadingMore(false);
    }
  };

  const addLead = async (lead: Omit<Lead, 'id' | 'dateAdded' | 'status'>) => {
    if (!userProfile?.tenantId) return;

    try {
      const newLeadData: Omit<Lead, 'id'> = {
        ...lead,
        status: LeadStatus.New,
        dateAdded: new Date().toISOString().split('T')[0],
      };

      const savedLead = await addLeadToFirestore(userProfile.tenantId, newLeadData);
      setLeads(prev => [savedLead, ...prev]);
      
      toast({
        title: "Lead added",
        description: `${lead.name} has been added to the pipeline.`,
      });
    } catch (error) {
      console.error("Failed to add lead:", error);
      toast({
        title: "Error",
        description: "Failed to add lead.",
        variant: "destructive"
      });
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: Lead['status']) => {
    if (!userProfile?.tenantId) return;

    try {
      await updateLead(userProfile.tenantId, leadId, { status: newStatus });
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
      toast({ title: 'Status Updated', description: `Lead moved to ${newStatus}` });
    } catch (error) {
      console.error("Failed to update status:", error);
      toast({ title: 'Error', description: 'Failed to update lead status.', variant: 'destructive' });
    }
  };

  const handleEditLead = async (leadId: string, data: Partial<Omit<Lead, 'id'>>) => {
    if (!userProfile?.tenantId) return;

    try {
      await updateLead(userProfile.tenantId, leadId, data);
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, ...data } : l));
      toast({ title: 'Lead Updated', description: 'Changes saved successfully.' });
    } catch (error) {
      console.error("Failed to update lead:", error);
      toast({ title: 'Error', description: 'Failed to update lead.', variant: 'destructive' });
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!userProfile?.tenantId) return;

    try {
      await deleteLead(userProfile.tenantId, leadId);
      setLeads(prev => prev.filter(l => l.id !== leadId));
      toast({ title: 'Lead Deleted', description: 'Lead has been removed.' });
    } catch (error) {
      console.error("Failed to delete lead:", error);
      toast({ title: 'Error', description: 'Failed to delete lead.', variant: 'destructive' });
    }
  };

  const handleConvert = async (lead: Lead) => {
    if (!userProfile?.tenantId) return;

    try {
      toast({
        title: "Converting Lead...",
        description: `Creating student profile for ${lead.name}`,
      });

      await convertLeadToStudent(userProfile.tenantId, lead);

      // Update local state for lead status
      setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: LeadStatus.Converted } : l));

      toast({
        title: "Success",
        description: `${lead.name} is now an enrolled student!`,
      });
    } catch (error) {
      console.error("Conversion failed:", error);
      toast({
        title: "Error",
        description: "Failed to convert lead to student.",
        variant: "destructive"
      });
    }
  };

  if (loading && !userProfile) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['super', 'admin', 'executive'] as UserRole[]}>
      <div className="space-y-4 flex flex-col h-full">
        <KanbanBoard 
          leads={leads}
          onStatusChange={handleStatusChange}
          onConvert={handleConvert}
          onAddLeadClick={() => setIsAddDialogOpen(true)}
          onEditClick={(lead) => setEditingLead(lead)}
        />

        {lastVisible && (
          <div className="flex justify-center mt-4 mb-4">
            <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
              {loadingMore ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Load More
            </Button>
          </div>
        )}

        {/* Add Lead Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add a new lead</DialogTitle>
              <DialogDescription>Fill in the details below to add a new lead to the pipeline.</DialogDescription>
            </DialogHeader>
            <AddLeadForm addLead={addLead} setIsAddDialogOpen={setIsAddDialogOpen} />
          </DialogContent>
        </Dialog>

        {/* Edit Lead Dialog */}
        <EditLeadDialog
          lead={editingLead}
          open={!!editingLead}
          onOpenChange={(open) => { if (!open) setEditingLead(null); }}
          onSave={handleEditLead}
          onDelete={handleDeleteLead}
          onConvert={handleConvert}
        />
      </div>
    </RoleGuard>
  );
}
