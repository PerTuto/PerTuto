"use client";

import { useEffect, useState } from "react";
import { getTenants, createTenant } from "@/lib/firebase/services";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Building2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Tenant = {
    id: string;
    name: string;
    plan: string;
    createdAt: any;
};

export default function AdminDashboard() {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newTenant, setNewTenant] = useState({ name: '', plan: 'basic' as const });
    const { user } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        loadTenants();
    }, []);

    async function loadTenants() {
        setLoading(true);
        try {
            const data = await getTenants();
            setTenants(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateTenant() {
        if (!user || !newTenant.name.trim()) return;
        setCreating(true);
        try {
            await createTenant({ name: newTenant.name, plan: newTenant.plan }, user.uid);
            toast({ title: "Tenant Created", description: `${newTenant.name} has been created.` });
            setNewTenant({ name: '', plan: 'basic' });
            setDialogOpen(false);
            loadTenants();
        } catch (e: any) {
            toast({ title: "Error", description: e.message, variant: "destructive" });
        } finally {
            setCreating(false);
        }
    }

    const planColors: Record<string, string> = {
        basic: 'bg-gray-500',
        pro: 'bg-blue-500',
        enterprise: 'bg-purple-500',
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Tenants</h2>
                    <p className="text-muted-foreground">Manage organizations on the platform.</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="h-4 w-4 me-2" /> Create Tenant</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Tenant</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Organization Name</Label>
                                <Input
                                    placeholder="e.g. ABC School"
                                    value={newTenant.name}
                                    onChange={(e) => setNewTenant(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Plan</Label>
                                <Select
                                    value={newTenant.plan}
                                    onValueChange={(v) => setNewTenant(prev => ({ ...prev, plan: v as any }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="basic">Basic</SelectItem>
                                        <SelectItem value="pro">Pro</SelectItem>
                                        <SelectItem value="enterprise">Enterprise</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreateTenant} disabled={creating || !newTenant.name.trim()}>
                                {creating && <Loader2 className="h-4 w-4 me-2 animate-spin" />}
                                Create Tenant
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : tenants.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No tenants yet. Create your first one!</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tenants.map((tenant) => (
                        <Card key={tenant.id} className="cursor-pointer hover:border-primary transition-colors">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">{tenant.name}</CardTitle>
                                    <Badge className={planColors[tenant.plan] || 'bg-gray-500'}>
                                        {tenant.plan}
                                    </Badge>
                                </div>
                                <CardDescription>ID: {tenant.id}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" size="sm" className="w-full">
                                    Manage Users
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
