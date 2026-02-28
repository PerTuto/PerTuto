"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { smartScheduleAssistant, SmartScheduleAssistantOutput } from "@/ai/flows/smart-schedule-assistant";
import { Loader2, Wand2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Separator } from "../ui/separator";

const formSchema = z.object({
  className: z.string().min(2, "Class name is required."),
  classDuration: z.string().min(2, "Duration is required."),
  instructorAvailability: z.string().min(10, "Instructor availability is required."),
  classroomResources: z.string().min(10, "Classroom resources are required."),
  studentPreferences: z.string().min(10, "Student preferences are required."),
});

export function SmartSchedule() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<SmartScheduleAssistantOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      className: "New Quantum Physics Class",
      classDuration: "90 minutes",
      instructorAvailability: "Mon-Fri, 9:00 AM - 5:00 PM PST",
      classroomResources: "Room 101 with projector, Room 203 with smartboard",
      studentPreferences: "Majority prefer afternoons, some require evenings. No classes on Fridays.",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
        setResult(null);
        toast({title: "AI is thinking...", description: "Analyzing constraints to find the best schedule."})
      try {
        const response = await smartScheduleAssistant(values);
        setResult(response);
        toast({title: "Suggestion Ready!", description: "The AI has generated a schedule suggestion."})
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Could not generate a schedule. Please try again.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="space-y-6">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
            <FormField control={form.control} name="className" render={({ field }) => (
                <FormItem><FormLabel>Class Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="classDuration" render={({ field }) => (
                <FormItem><FormLabel>Class Duration</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
        <FormField control={form.control} name="instructorAvailability" render={({ field }) => (
            <FormItem><FormLabel>Instructor Availability</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="classroomResources" render={({ field }) => (
            <FormItem><FormLabel>Classroom Resources</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="studentPreferences" render={({ field }) => (
            <FormItem><FormLabel>Student Preferences</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : <Wand2 className="me-2 h-4 w-4" />}
          Generate Suggestion
        </Button>
      </form>
    </Form>

    {result && (
        <>
            <Separator className="my-8" />
            <div className="space-y-4">
                <h3 className="font-headline text-lg">AI Suggestion</h3>
                 <Alert variant="default" className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
                    <AlertTitle className="text-green-900 dark:text-green-300 font-headline">Suggested Schedule</AlertTitle>
                    <AlertDescription className="text-green-800 dark:text-green-400">
                        {result.suggestedSchedule}
                    </AlertDescription>
                </Alert>
                
                {result.conflictsDetected && (
                     <Alert variant="destructive">
                        <AlertTitle className="font-headline">Conflicts Detected</AlertTitle>
                        <AlertDescription>
                            {result.conflictsDetected}
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </>
    )}
    </div>
  );
}
