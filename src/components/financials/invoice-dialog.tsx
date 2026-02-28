"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Receipt, Trash2 } from "lucide-react";
import { createInvoice } from "@/lib/firebase/financial-services";
import { getStudents } from "@/lib/firebase/services";
import { InvoiceStatus, InvoiceLineItem, Student } from "@/lib/types";

interface InvoiceDialogProps {
  onInvoiceCreated?: () => void;
  trigger?: React.ReactNode;
}

export function InvoiceDialog({ onInvoiceCreated, trigger }: InvoiceDialogProps) {
  const { userProfile, user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  
  const [studentId, setStudentId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<Omit<InvoiceLineItem, 'id' | 'total'>[]>([
    { description: "", quantity: 1, unitPrice: 0 }
  ]);

  useEffect(() => {
    if (open && userProfile?.tenantId && students.length === 0) {
      getStudents(userProfile.tenantId).then(setStudents).catch(console.error);
    }
  }, [open, userProfile?.tenantId, students.length]);

  const handleAddItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleChangeItem = (index: number, field: keyof typeof items[0], value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxAmount = 0; // Keeping simple for MVP
  const totalAmount = subtotal + taxAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userProfile?.tenantId) return;
    if (!studentId) {
      toast({ title: "Error", description: "Please specify a student.", variant: "destructive" });
      return;
    }
    if (items.some(i => !i.description || i.quantity <= 0 || i.unitPrice <= 0)) {
      toast({ title: "Error", description: "Please fill out all line items correctly.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const finalItems: InvoiceLineItem[] = items.map((item, idx) => ({
        ...item,
        id: `line-${idx}-${Date.now()}`,
        total: item.quantity * item.unitPrice
      }));

      const invoiceData = {
        tenantId: userProfile.tenantId,
        studentId,
        status: InvoiceStatus.Unpaid,
        issueDate: new Date(),
        dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Default 14 days
        items: finalItems,
        subtotal,
        taxAmount,
        totalAmount,
        amountPaid: 0,
        balanceDue: totalAmount,
        notes,
        createdBy: user.uid
      };

      await createInvoice(userProfile.tenantId, invoiceData);

      toast({
        title: "Invoice Generated",
        description: `Successfully created invoice for ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalAmount)}.`,
      });
      setOpen(false);
      
      // Reset form
      setStudentId("");
      setDueDate("");
      setNotes("");
      setItems([{ description: "", quantity: 1, unitPrice: 0 }]);
      
      onInvoiceCreated?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create invoice.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Invoice
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Generate New Invoice
            </DialogTitle>
            <DialogDescription>
              Create an invoice for a student. This will automatically charge their family ledger.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="student">Bill To (Student) <span className="text-destructive">*</span></Label>
                <Select value={studentId} onValueChange={setStudentId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student..." />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Line Items</h4>
                <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                  <Plus className="h-3 w-3 me-1" /> Add Item
                </Button>
              </div>

              {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="grid gap-2 flex-1">
                    <Input 
                      placeholder="Description (e.g. Math Tutoring)" 
                      value={item.description}
                      onChange={(e) => handleChangeItem(index, 'description', e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2 w-20">
                    <Input 
                      type="number" 
                      min="1" 
                      placeholder="Qty" 
                      value={item.quantity || ''}
                      onChange={(e) => handleChangeItem(index, 'quantity', parseInt(e.target.value))}
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">$</span>
                    <Input 
                      type="number" 
                      min="0" 
                      step="0.01"
                      className="w-24"
                      placeholder="Price" 
                      value={item.unitPrice || ''}
                      onChange={(e) => handleChangeItem(index, 'unitPrice', parseFloat(e.target.value))}
                      required
                    />
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="text-destructive h-10 w-10 flex-shrink-0" onClick={() => handleRemoveItem(index)} disabled={items.length === 1}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <div className="flex justify-end pt-2 text-sm">
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-end">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                  <span className="font-semibold">Total:</span>
                  <span className="font-semibold text-lg">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <Label htmlFor="notes">Notes for customer (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Thank you for your business!"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="me-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Issue Invoice"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
