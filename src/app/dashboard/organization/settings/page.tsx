"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { getTenantById } from "@/lib/firebase/services";
import { updateDoc, doc } from "firebase/firestore";
import { firestore } from "@/lib/firebase/client-app";
import { Tenant, UserRole } from "@/lib/types";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Building, DollarSign, Image as ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrganizationSettingsPage() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [orgName, setOrgName] = useState("");
  const [defaultHourlyRate, setDefaultHourlyRate] = useState<number>(0);
  const [currency, setCurrency] = useState("USD");
  const [noShowPolicy, setNoShowPolicy] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>("12h");

  useEffect(() => {
    async function fetchSettings() {
      if (!userProfile?.tenantId) return;
      try {
        const data = await getTenantById(userProfile.tenantId);
        if (data) {
          setTenant(data as Tenant);
          setOrgName(data.name || "");
          setDefaultHourlyRate(data.settings?.defaultHourlyRate || 50);
          setCurrency(data.settings?.currency || "USD");
          setNoShowPolicy(data.settings?.noShowPolicy || "100% charge for no-shows or cancellations within 24 hours.");
          setLogoUrl(data.settings?.logoUrl || "");
          setTimeFormat(data.settings?.timeFormat || "12h");
        }
      } catch (error: any) {
        toast({ title: "Error", description: "Failed to load settings.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [userProfile?.tenantId, toast]);

  const handleSave = async (tabName: string) => {
    if (!userProfile?.tenantId) return;
    setSaving(true);
    
    try {
      const tenantRef = doc(firestore, `tenants`, userProfile.tenantId);
      
      const payload: any = {};
      
      if (tabName === "profile") {
        payload.name = orgName;
        payload["settings.timeFormat"] = timeFormat;
      } else if (tabName === "financials") {
        payload["settings.defaultHourlyRate"] = defaultHourlyRate;
        payload["settings.currency"] = currency;
        payload["settings.noShowPolicy"] = noShowPolicy;
      } else if (tabName === "branding") {
        payload["settings.logoUrl"] = logoUrl;
      }

      await updateDoc(tenantRef, payload);
      toast({ title: "Settings Saved", description: "Your organization settings have been updated." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to save settings.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full max-w-4xl" />
      </div>
    );
  }

  // RBAC protection
  const canEdit = userProfile?.role === UserRole.Super || userProfile?.role === UserRole.Executive || userProfile?.role === UserRole.Admin || 
                 (Array.isArray(userProfile?.role) && (userProfile?.role.includes(UserRole.Executive) || userProfile?.role.includes(UserRole.Admin) || userProfile?.role.includes(UserRole.Super)));
                 
  if (!canEdit) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-full">
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">You do not have permission to view organization settings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Organization Settings</h1>
        <p className="text-muted-foreground">
          Manage your tutoring business logic, branding, and defaults.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2"><Building className="h-4 w-4" /> Profile</TabsTrigger>
          <TabsTrigger value="financials" className="gap-2"><DollarSign className="h-4 w-4" /> Financial Policies</TabsTrigger>
          <TabsTrigger value="branding" className="gap-2"><ImageIcon className="h-4 w-4" /> Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Organization Profile</CardTitle>
              <CardDescription>Basic information about your organization.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input 
                  id="orgName" 
                  value={orgName} 
                  onChange={(e) => setOrgName(e.target.value)} 
                />
              </div>
              <div className="space-y-1">
                <Label>Tenant ID</Label>
                <Input value={tenant?.id || ""} disabled className="bg-muted text-muted-foreground font-mono text-xs" />
                <p className="text-xs text-muted-foreground">This is your unique system identifier. It cannot be changed.</p>
              </div>

              <div className="pt-4 border-t space-y-4">
                <h3 className="text-sm font-medium">Application Preferences</h3>
                <div className="space-y-1">
                  <Label>Time Format</Label>
                  <Select value={timeFormat} onValueChange={(v: any) => setTimeFormat(v)}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Select Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                      <SelectItem value="24h">24-hour (Military)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Set how time is displayed across the platform.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("profile")} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Profile
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="financials">
          <Card>
            <CardHeader>
              <CardTitle>Financial & Business Policies</CardTitle>
              <CardDescription>Configure billing rates, currencies, and cancellation rules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="rate">Default Hourly Rate</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="rate" 
                      type="number" 
                      className="pl-8" 
                      value={defaultHourlyRate} 
                      onChange={(e) => setDefaultHourlyRate(parseFloat(e.target.value))} 
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">This rate is auto-filled when generating invoices.</p>
                </div>
                
                <div className="space-y-1">
                  <Label>Default Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD ($)</SelectItem>
                      <SelectItem value="AUD">AUD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1 pt-4 border-t">
                <Label htmlFor="noShow">Cancellation & No-Show Policy</Label>
                <Textarea 
                  id="noShow" 
                  rows={4}
                  value={noShowPolicy} 
                  onChange={(e) => setNoShowPolicy(e.target.value)} 
                />
                <p className="text-xs text-muted-foreground">
                  This policy text can be displayed to parents on the Parent Portal and appended to invoices.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("financials")} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Financial Policies
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Brand Appearance</CardTitle>
              <CardDescription>Customize how your organization looks to students and parents.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input 
                    id="logoUrl" 
                    placeholder="https://example.com/logo.png"
                    value={logoUrl} 
                    onChange={(e) => setLogoUrl(e.target.value)} 
                  />
                  <p className="text-xs text-muted-foreground">Provide a link to your hosted logo image.</p>
                </div>
                
                {logoUrl && (
                  <div className="mt-4 p-4 border rounded-md inline-block bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-2">Preview</p>
                    <img src={logoUrl} alt="Logo Preview" className="max-h-16 max-w-[200px] object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("branding")} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Branding
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
