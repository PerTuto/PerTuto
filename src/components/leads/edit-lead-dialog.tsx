"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { type Lead, LeadStatus } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  source: z.string().min(1, "Source is required."),
  status: z.nativeEnum(LeadStatus),
  notes: z.string().optional(),
  timezone: z.string().optional(),
});

type EditLeadDialogProps = {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (leadId: string, data: Partial<Omit<Lead, 'id'>>) => Promise<void>;
  onDelete: (leadId: string) => Promise<void>;
  onConvert?: (lead: Lead) => Promise<void>;
};

const majorTimezones = [
  { tzCode: 'America/New_York', label: '(GMT-04:00) Eastern Time' },
  { tzCode: 'America/Chicago', label: '(GMT-05:00) Central Time' },
  { tzCode: 'America/Denver', label: '(GMT-06:00) Mountain Time' },
  { tzCode: 'America/Los_Angeles', label: '(GMT-07:00) Pacific Time' },
  { tzCode: 'Europe/London', label: '(GMT+01:00) London' },
  { tzCode: 'Europe/Paris', label: '(GMT+02:00) Paris' },
  { tzCode: 'Europe/Berlin', label: '(GMT+02:00) Berlin' },
  { tzCode: 'Asia/Dubai', label: '(GMT+04:00) Dubai' },
  { tzCode: 'Asia/Kolkata', label: '(GMT+05:30) India' },
  { tzCode: 'Asia/Singapore', label: '(GMT+08:00) Singapore' },
  { tzCode: 'Asia/Hong_Kong', label: '(GMT+08:00) Hong Kong' },
  { tzCode: 'Asia/Jakarta', label: '(GMT+07:00) Jakarta' },
  { tzCode: 'Africa/Dakar', label: '(GMT+00:00) Dakar' },
];

export function EditLeadDialog({ lead, open, onOpenChange, onSave, onDelete, onConvert }: EditLeadDialogProps) {
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [converting, setConverting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: lead ? {
      name: lead.name,
      email: lead.email || '',
      phone: lead.phone || '',
      source: lead.source || 'Website',
      status: lead.status,
      notes: lead.notes || '',
      timezone: lead.timezone || '',
    } : undefined,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!lead) return;
    setSaving(true);
    try {
      await onSave(lead.id, values);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!lead) return;
    setSaving(true);
    try {
      await onDelete(lead.id);
      onOpenChange(false);
      setConfirmDelete(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleConvert() {
    if (!lead || !onConvert) return;
    setConverting(true);
    try {
      await onConvert(lead);
      onOpenChange(false);
    } finally {
      setConverting(false);
    }
  }

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); setConfirmDelete(false); }}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-xl">Edit Lead</DialogTitle>
          <DialogDescription>Update the details for this lead. Changes are saved immediately.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="New">🔵 New</SelectItem>
                      <SelectItem value="Contacted">🟡 Contacted</SelectItem>
                      <SelectItem value="Qualified">🟢 Qualified</SelectItem>
                      <SelectItem value="Converted">✅ Converted</SelectItem>
                      <SelectItem value="Lost">🔴 Lost</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="source" render={({ field }) => (
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="website">website</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                      <SelectItem value="Social Media">Social Media</SelectItem>
                      <SelectItem value="Event">Event</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="timezone" render={({ field }) => (
              <FormItem>
                <FormLabel>Timezone</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {majorTimezones.map((tz) => (
                      <SelectItem key={tz.tzCode} value={tz.tzCode}>{tz.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl><Textarea rows={3} placeholder="Notes about this lead..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border mt-4">
              <div className="w-full sm:w-auto">
                {confirmDelete ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-destructive font-medium">Delete this lead?</span>
                    <Button type="button" variant="destructive" size="sm" onClick={handleDelete} disabled={saving || converting}>
                      {saving || converting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, delete"}
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setConfirmDelete(false)}>Cancel</Button>
                  </div>
                ) : (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setConfirmDelete(true)} className="text-muted-foreground hover:text-destructive w-full sm:w-auto justify-start px-2">
                    <Trash2 className="w-4 h-4 me-2" /> Delete Lead
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                {lead.status === LeadStatus.Converted && onConvert && (
                  <Button 
                    type="button" 
                    variant="default" 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
                    onClick={handleConvert}
                    disabled={saving || converting}
                  >
                    {converting ? <Loader2 className="w-4 h-4 animate-spin me-2" /> : null}
                    Convert to Student
                  </Button>
                )}
                <Button type="submit" disabled={saving || converting} className="w-full sm:w-auto">
                  {saving && !converting ? <Loader2 className="w-4 h-4 animate-spin me-2" /> : null}
                  Save Changes
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
