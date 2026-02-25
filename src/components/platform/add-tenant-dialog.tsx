"use client";

import { useState } from "react";
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
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Building2 } from "lucide-react";
import { createTenant } from "@/app/actions/tenant-actions";

interface AddTenantDialogProps {
  onTenantAdded?: () => void;
  trigger?: React.ReactNode;
}

export function AddTenantDialog({ onTenantAdded, trigger }: AddTenantDialogProps) {
  const { userProfile, user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tenantName: "",
    adminFullName: "",
    adminEmail: "",
    adminPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      const result = await createTenant(user.uid, formData);

      if (result.success) {
        toast({
          title: "Tenant Created",
          description: `${formData.tenantName} has been successfully provisioned.`,
        });
        setOpen(false);
        setFormData({ tenantName: "", adminFullName: "", adminEmail: "", adminPassword: "" });
        onTenantAdded?.();
      } else {
        throw new Error(result.message || "Failed to create tenant.");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
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
            Add Organization
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Provision New Tenant
            </DialogTitle>
            <DialogDescription>
              Create a new organization workspace and assign its primary administrator.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="tenantName">Organization Name <span className="text-destructive">*</span></Label>
              <Input
                id="tenantName"
                placeholder="e.g. Acme Tutoring"
                value={formData.tenantName}
                onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-4 pt-4 border-t">
              <h4 className="text-sm font-medium">Initial Administrator Account</h4>
              
              <div className="space-y-2">
                <Label htmlFor="adminFullName">Admin Full Name <span className="text-destructive">*</span></Label>
                <Input
                  id="adminFullName"
                  placeholder="e.g. Jane Doe"
                  value={formData.adminFullName}
                  onChange={(e) => setFormData({ ...formData, adminFullName: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email <span className="text-destructive">*</span></Label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder="admin@acme.com"
                  value={formData.adminEmail}
                  onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminPassword">Initial Password (Optional)</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  placeholder="Leave empty for auto-generated"
                  value={formData.adminPassword}
                  onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  If left blank, a temporary password ('tempPassword123!') will be assigned. The admin should reset it upon first login.
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Tenant"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
