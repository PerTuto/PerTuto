"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { getColumns } from "./columns";
import { DataTable } from "@/components/data-table";
import type { Lead } from '@/lib/types';
import { AddLeadForm } from '@/components/leads/add-lead-form';
import { getLeads, addLead as addLeadToFirestore, convertLeadToStudent } from "@/lib/firebase/services";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LeadsPage() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
      if (userProfile?.tenantId) {
        setLoading(true);
        try {
          const data = await getLeads(userProfile.tenantId);
          setLeads(data);
        } catch (error) {
          console.error("Failed to fetch leads:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchLeads();
  }, [userProfile?.tenantId]);

  const addLead = async (lead: Omit<Lead, 'id' | 'dateAdded' | 'status'>) => {
    if (!userProfile?.tenantId) return;

    try {
      const newLeadData: Omit<Lead, 'id'> = {
        ...lead,
        status: 'New',
        dateAdded: new Date().toISOString().split('T')[0],
      };

      const savedLead = await addLeadToFirestore(userProfile.tenantId, newLeadData);
      setLeads(prev => [savedLead, ...prev]);
    } catch (error) {
      console.error("Failed to add lead:", error);
    }
  };

  const handleConvert = async (lead: Lead) => {
    if (!userProfile?.tenantId) return;

    try {
      toast({
        title: "Converting Lead...",
        description: `Creating student profile for ${lead.name}`,
      });

      const newStudent = await convertLeadToStudent(userProfile.tenantId, lead);

      // Update local state for lead status
      setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: 'Converted' } : l));

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

  const tableColumns = useMemo(() => getColumns(handleConvert), [userProfile?.tenantId]);

  if (loading && !userProfile) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Leads</h2>
      </div>
      <DataTable
        columns={tableColumns}
        data={leads}
        filterColumn="name"
        addEntityContext={{
          addLabel: 'Add Lead',
          dialogTitle: 'Add a new lead',
          dialogDescription: 'Fill in the details below to add a new lead.',
          dialogContent: <AddLeadForm addLead={addLead} setIsAddDialogOpen={() => { }} />
        }}
      />
    </div>
  );
}
