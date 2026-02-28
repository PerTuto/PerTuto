"use client";

import { useEffect, useState } from "react";
import { getTenants } from "@/lib/firebase/services";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/lib/types";
import { AddTenantDialog } from "@/components/platform/add-tenant-dialog";
import { Loader2, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TenantsPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const isSuper = userProfile?.role === UserRole.Super || 
    (Array.isArray(userProfile?.role) && userProfile?.role.includes(UserRole.Super as any));

  const fetchTenantsData = async () => {
    setIsLoading(true);
    try {
      const data = await getTenants();
      // Sort by newest first
      data.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setTenants(data);
    } catch (error: any) {
      toast({
        title: "Error fetching tenants",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isSuper) {
      fetchTenantsData();
    } else {
      setIsLoading(false);
    }
  }, [isSuper]);

  if (!isSuper && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-full">
        <div className="h-16 w-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
          <Building2 className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">This area is restricted to Platform Administrators only.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Platform Organizations</h1>
          <p className="text-muted-foreground">
            Manage all active tutoring organizations on PerTuto.
          </p>
        </div>
        <AddTenantDialog onTenantAdded={fetchTenantsData} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : tenants.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-xl font-medium mb-2">No organizations found</p>
          <p className="text-muted-foreground mb-6">Create the first tenant to start managing schools and tutoring centers.</p>
          <AddTenantDialog onTenantAdded={fetchTenantsData} />
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tenants.map((tenant) => (
            <Card key={tenant.id} className="flex flex-col">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="font-headline text-lg line-clamp-1">{tenant.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {tenant.id}
                  </CardDescription>
                </div>
                <Badge variant={tenant.status === 'active' ? 'default' : 'secondary'}>
                  {tenant.status || 'Active'}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mt-4 grid gap-2">
                  <div className="flex justify-between items-center pb-2 border-b border-border/50">
                    <span className="font-medium">Created</span>
                    <span>{new Date(tenant.createdAt).toLocaleDateString()}</span>
                  </div>
                  {/* Additional tenant stats could go here in the future */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
