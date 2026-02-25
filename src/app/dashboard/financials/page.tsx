"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getInvoices, recordPayment } from "@/lib/firebase/financial-services";
import { getStudents } from "@/lib/firebase/services";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { InvoiceDialog } from "@/components/financials/invoice-dialog";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { Invoice, InvoiceStatus, Student, PaymentMethod } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Landmark, ReceiptText, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function FinancialsPage() {
  const [invoices, setInvoices] = useState<(Invoice & { studentName?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const { userProfile, user } = useAuth();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    if (!userProfile?.tenantId) return;
    setLoading(true);
    try {
      const [invoiceList, studentList] = await Promise.all([
        getInvoices(userProfile.tenantId),
        getStudents(userProfile.tenantId)
      ]);

      // Create Student Map for fast lookup
      const studentMap = new Map(studentList.map(s => [s.id, s.name]));

      // Enrich Invoices with Student Names
      const enrichedInvoices = invoiceList.map(inv => ({
        ...inv,
        studentName: studentMap.get(inv.studentId) || 'Unknown Student'
      }));

      setInvoices(enrichedInvoices);
    } catch (error: any) {
      console.error("Error fetching financials:", error);
      toast({
        title: "Error",
        description: "Could not fetch financial records.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [userProfile?.tenantId, toast]);

  useEffect(() => {
    if (userProfile?.tenantId) {
      fetchData();
    }
  }, [userProfile?.tenantId, fetchData]);

  // Listen for "Record Payment" events from the columns action dropdown
  useEffect(() => {
    const handlePaymentEvent = async (e: Event) => {
      const invoice = (e as CustomEvent).detail as Invoice;
      if (!user || !userProfile?.tenantId) return;
      
      try {
        await recordPayment(userProfile.tenantId, {
          tenantId: userProfile.tenantId,
          invoiceId: invoice.id,
          studentId: invoice.studentId,
          parentId: invoice.parentId,
          amount: invoice.balanceDue,
          method: PaymentMethod.Other,
          date: new Date(),
          recordedBy: user.uid,
          notes: `Full payment for invoice #${invoice.id.substring(0, 8)}`,
        });
        toast({ title: "Payment Recorded", description: `Payment of ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(invoice.balanceDue)} recorded successfully.` });
        fetchData();
      } catch (error: any) {
        toast({ title: "Error", description: error.message || "Failed to record payment.", variant: "destructive" });
      }
    };

    window.addEventListener('openPaymentDialog', handlePaymentEvent);
    return () => window.removeEventListener('openPaymentDialog', handlePaymentEvent);
  }, [user, userProfile?.tenantId, fetchData, toast]);

  // Derived Metrics
  const totalOutstanding = invoices
    .filter(i => i.status !== InvoiceStatus.Paid && i.status !== InvoiceStatus.Cancelled && i.status !== InvoiceStatus.Draft)
    .reduce((sum, inv) => sum + inv.balanceDue, 0);

  const totalCollected = invoices
    .reduce((sum, inv) => sum + inv.amountPaid, 0);

  const overdueCount = invoices
    .filter(i => i.status === InvoiceStatus.Overdue).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-96 w-full mt-6" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Financials</h1>
          <p className="text-muted-foreground">
            Manage your organization's invoicing, payments, and family ledgers.
          </p>
        </div>
        <InvoiceDialog onInvoiceCreated={fetchData} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalOutstanding)}
            </div>
            <p className="text-xs text-muted-foreground">Across all unpaid invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalCollected)}
            </div>
            <p className="text-xs text-muted-foreground">Lifetime revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
            <AlertCircle className={`h-4 w-4 ${overdueCount > 0 ? "text-destructive" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueCount}</div>
            <p className="text-xs text-muted-foreground">Invoices past their due date</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold tracking-tight">Recent Invoices</h2>
        </div>
        <DataTable columns={columns} data={invoices} filterColumn="studentName" />
      </div>
    </div>
  );
}
