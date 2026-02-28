"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { Student } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  curriculum: z.string().optional(),
  grade: z.string().optional(),
  timezone: z.string().optional(),
});

type AddStudentFormProps = {
  addStudent: (student: Omit<Student, 'id' | 'enrolledDate' | 'progress' | 'status' | 'ownerId'>) => Promise<void>;
  setIsAddDialogOpen?: (isOpen: boolean) => void;
};

const majorTimezones = [
  { tzCode: 'America/New_York', label: '(GMT-04:00) Eastern Time (US & Canada)' },
  { tzCode: 'America/Chicago', label: '(GMT-05:00) Central Time (US & Canada)' },
  { tzCode: 'America/Denver', label: '(GMT-06:00) Mountain Time (US & Canada)' },
  { tzCode: 'America/Los_Angeles', label: '(GMT-07:00) Pacific Time (US & Canada)' },
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

export function AddStudentForm({ addStudent, setIsAddDialogOpen }: AddStudentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      curriculum: "",
      grade: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // @ts-ignore
      await addStudent({ ...values, courses: [], avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${values.email || values.name}` });
      if (setIsAddDialogOpen) setIsAddDialogOpen(false);
      form.reset();
    } catch (e) {
      // Error is handled by the parent component's toast
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address</FormLabel>
            <FormControl><Input placeholder="john.doe@example.com" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="phone" render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl><Input placeholder="+1 123-456-7890" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="curriculum" render={({ field }) => (
            <FormItem>
              <FormLabel>Curriculum</FormLabel>
              <FormControl><Input placeholder="e.g., IB, GCSE" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="grade" render={({ field }) => (
            <FormItem>
              <FormLabel>Grade</FormLabel>
              <FormControl><Input placeholder="e.g., 10th Grade" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <FormField control={form.control} name="timezone" render={({ field }) => (
          <FormItem>
            <FormLabel>Timezone</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a timezone" />
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
        )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
          Add Student
        </Button>
      </form>
    </Form>
  );
}
