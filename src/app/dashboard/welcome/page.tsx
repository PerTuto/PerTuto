
"use client";

import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, GraduationCap, BookOpen, Users } from "lucide-react";
import { createUserProfile } from '@/lib/firebase/services';
import { useEffect } from 'react';
import { PerTutoLogo } from "@/components/brand/logo";

const formSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters."),
  role: z.enum(["teacher", "student", "parent"], {
    required_error: "You need to select a role.",
  }),
});

const ROLE_OPTIONS = [
  {
    value: "teacher",
    label: "Teacher / Instructor",
    description: "I teach classes and manage students",
    icon: BookOpen,
  },
  {
    value: "student",
    label: "Student",
    description: "I'm here to learn and attend classes",
    icon: GraduationCap,
  },
  {
    value: "parent",
    label: "Parent / Guardian",
    description: "I'm monitoring my child's education",
    icon: Users,
  },
];

export default function WelcomePage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // If the user already has a complete profile with tenantId, skip onboarding
  useEffect(() => {
    if (!loading && userProfile?.tenantId && userProfile?.role) {
      router.push("/dashboard");
    }
  }, [loading, userProfile, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.displayName || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
        toast({ title: "Error", description: "You are not logged in.", variant: "destructive" });
        return;
    }

    // If user has no tenantId from invite, they can't proceed
    const existingTenantId = userProfile?.tenantId;
    if (!existingTenantId) {
      toast({
        title: "No Organization Found",
        description: "Please ask your administrator to send you an invite link to join an organization.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await createUserProfile(user.uid, {
        fullName: values.fullName,
        email: user.email!,
        role: values.role as any,
        tenantId: existingTenantId,
      });
      toast({ title: "Profile Created", description: "Welcome to PerTuto!" });
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Profile Creation Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };
  
  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <PerTutoLogo size="md" />
            </div>
            <CardTitle className="font-headline text-2xl">Welcome to PerTuto!</CardTitle>
            <CardDescription>Let's set up your profile to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Ahmed Khan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>What is your role?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid gap-3"
                        >
                          {ROLE_OPTIONS.map((option) => (
                            <FormItem key={option.value} className="flex items-start space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={option.value} />
                              </FormControl>
                              <div className="flex items-center gap-3">
                                <option.icon className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <FormLabel className="font-medium cursor-pointer">
                                    {option.label}
                                  </FormLabel>
                                  <p className="text-xs text-muted-foreground">
                                    {option.description}
                                  </p>
                                </div>
                              </div>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className="mr-2 animate-spin" />}
                  Continue to Dashboard
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
    </div>
  );
}
