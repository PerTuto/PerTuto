"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Student, Invoice, InvoiceStatus } from "@/lib/types";
import { getLedgerBalance, getInvoices, markInvoiceAsPaid } from "@/lib/firebase/financial-services";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Receipt, CreditCard, AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

interface ParentFinancesProps {
  children: Student[];
  selectedChild: Student | null;
}

export function ParentFinances({ children, selectedChild }: ParentFinancesProps) {
  const { userProfile, user } = useAuth();
  const { toast } = useToast();
  const [balance, setBalance] = useState<number>(0);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingFinance, setLoadingFinance] = useState(true);
  const [payingInvoiceId, setPayingInvoiceId] = useState<string | null>(null);

  const fetchFinancials = async () => {
    if (!userProfile?.tenantId || !user?.uid) return;
    setLoadingFinance(true);
    try {
      // Fetch Family-level balance + All Invoices for the tenant
      const [bal, allInvoices] = await Promise.all([
        getLedgerBalance(userProfile.tenantId, { parentId: user.uid }),
        getInvoices(userProfile.tenantId)
      ]);
      setBalance(bal);
      
      // Filter invoices for all children of this parent
      const childIds = children.map(c => c.id);
      setInvoices(allInvoices.filter(inv => inv.parentId === user.uid || childIds.includes(inv.studentId)));
    } catch (error: any) {
      console.error("Error fetching financial data:", error);
    } finally {
      setLoadingFinance(false);
    }
  };

  useEffect(() => {
    fetchFinancials();
  }, [userProfile?.tenantId, selectedChild]);

  const handlePayNow = async (invoice: Invoice) => {
    if (!user || !userProfile?.tenantId) return;
    setPayingInvoiceId(invoice.id);
    try {
      await markInvoiceAsPaid(userProfile.tenantId, invoice.id, user.uid);
      toast({
        title: "Payment Successful! ✅",
        description: `Invoice #${invoice.id.substring(0, 8)} has been marked as paid.`,
      });
      // Refresh data
      await fetchFinancials();
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "Could not process payment.",
        variant: "destructive",
      });
    } finally {
      setPayingInvoiceId(null);
    }
  };

  if (!selectedChild) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Select a child to view financial information.</p>
        </CardContent>
      </Card>
    );
  }

  const openInvoices = invoices.filter(i => i.status === InvoiceStatus.Unpaid || i.status === InvoiceStatus.Overdue);
  const paidInvoices = invoices.filter(i => i.status === InvoiceStatus.Paid);

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Ledger Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-destructive'}`}>
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(balance)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {balance >= 0 ? "You have credit on your account." : "Outstanding balance due."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Invoices</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openInvoices.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {openInvoices.length > 0
                ? `${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(openInvoices.reduce((s, i) => s + i.balanceDue, 0))} total due`
                : "All invoices paid! 🎉"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Open Invoices */}
      {openInvoices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Outstanding Invoices
            </CardTitle>
            <CardDescription>Invoices that require your attention.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {openInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">
                      {invoice.items.map(i => i.description).join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Due: {invoice.dueDate.toLocaleDateString()} &middot; Invoice #{invoice.id.substring(0, 8)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={invoice.status === InvoiceStatus.Overdue ? "destructive" : "secondary"}>
                      {invoice.status}
                    </Badge>
                    <span className="font-semibold">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(invoice.balanceDue)}
                    </span>
                    <Button size="sm" onClick={() => handlePayNow(invoice)} disabled={payingInvoiceId === invoice.id}>
                      <CreditCard className="h-4 w-4 me-1" /> {payingInvoiceId === invoice.id ? 'Processing...' : 'Pay Now'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Paid Invoices */}
      {paidInvoices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {paidInvoices.slice(0, 5).map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">
                      {invoice.items.map(i => i.description).join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Paid &middot; Invoice #{invoice.id.substring(0, 8)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="default">Paid</Badge>
                    <span className="font-medium text-muted-foreground">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(invoice.totalAmount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
