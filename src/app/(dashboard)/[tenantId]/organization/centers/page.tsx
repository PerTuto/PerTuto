
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getCenters, createCenter, updateCenter, deleteCenter } from "@/lib/firebase/services/centers";
import { Center } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Plus, 
  Search, 
  Landmark, 
  MoreVertical, 
  Trash2, 
  Edit, 
  MapPin,
  Mail,
  Phone,
  Loader2,
  Building2,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function CentersPage() {
  const { tenantId } = useParams() as { tenantId: string };
  const { toast } = useToast();
  
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCenter, setEditingCenter] = useState<Center | null>(null);
  const [search, setSearch] = useState("");

  // Form State
  const [formData, setFormData] = useState<Omit<Center, "id" | "createdAt">>({
    name: "",
    address: "",
    city: "",
    contactEmail: "",
    contactPhone: "",
    status: "active"
  });

  const fetchCenters = async () => {
    setLoading(true);
    try {
      const data = await getCenters(tenantId);
      setCenters(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load centers", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, [tenantId]);

  const handleOpenDialog = (center?: Center) => {
    if (center) {
      setEditingCenter(center);
      setFormData({
        name: center.name,
        address: center.address,
        city: center.city,
        contactEmail: center.contactEmail || "",
        contactPhone: center.contactPhone || "",
        status: center.status
      });
    } else {
      setEditingCenter(null);
      setFormData({
        name: "",
        address: "",
        city: "",
        contactEmail: "",
        contactPhone: "",
        status: "active"
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.city) {
      toast({ title: "Error", description: "Name and City are required", variant: "destructive" });
      return;
    }

    try {
      if (editingCenter) {
        await updateCenter(tenantId, editingCenter.id, formData);
        toast({ title: "Success", description: "Center updated successfully" });
      } else {
        await createCenter(tenantId, formData);
        toast({ title: "Success", description: "Center created successfully" });
      }
      setIsDialogOpen(false);
      fetchCenters();
    } catch (error) {
      toast({ title: "Error", description: "Save operation failed", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this center?")) return;
    try {
      await deleteCenter(tenantId, id);
      setCenters(prev => prev.filter(c => c.id !== id));
      toast({ title: "Deleted", description: "Center has been removed" });
    } catch (error) {
      toast({ title: "Error", description: "Delete failed", variant: "destructive" });
    }
  };

  const filteredCenters = centers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black font-outfit text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <Landmark className="w-8 h-8 text-primary" /> Center Management
          </h1>
          <p className="text-muted-foreground dark:text-white/40">Manage your institute branches and virtual centers.</p>
        </div>

        <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl h-11 px-6 shadow-lg shadow-primary/20" onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 me-2" /> Add Center
        </Button>
      </div>

      <div className="relative group max-w-md">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 dark:text-white/20 group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="Search by name or city..." 
          className="ps-10 bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 h-11 rounded-xl text-slate-900 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground dark:text-white/20 font-medium">Loading centers...</p>
        </div>
      ) : filteredCenters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCenters.map((center) => (
            <Card key={center.id} className="bg-glass border-slate-200 dark:border-white/5 group hover:border-primary/30 transition-all duration-500 overflow-hidden flex flex-col">
              <div className="absolute top-0 end-0 p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground dark:text-white/20 hover:text-slate-900 dark:hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-glass-heavy border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                    <DropdownMenuItem className="cursor-pointer" onClick={() => handleOpenDialog(center)}>
                      <Edit className="w-4 h-4 me-2" /> Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500" onClick={() => handleDelete(center.id)}>
                      <Trash2 className="w-4 h-4 me-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-widest ${
                    center.status === 'active' 
                      ? "border-green-500/30 bg-green-500/5 text-green-600 dark:text-green-500" 
                      : "border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-muted-foreground dark:text-white/40"
                  }`}>
                    {center.status === 'active' ? <CheckCircle2 className="w-3 h-3 me-1" /> : <XCircle className="w-3 h-3 me-1" />}
                    {center.status}
                  </Badge>
                </div>
                <CardTitle className="font-outfit text-xl font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-muted-foreground dark:text-white/20" /> {center.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" /> {center.city}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-4 mt-auto border-t border-slate-200 dark:border-white/5 space-y-3">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground dark:text-white/60 line-clamp-2 italic">{center.address}</p>
                </div>
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-white/5">
                  {center.contactEmail && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-white/40">
                      <Mail className="w-3.5 h-3.5" /> {center.contactEmail}
                    </div>
                  )}
                  {center.contactPhone && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-white/40">
                      <Phone className="w-3.5 h-3.5" /> {center.contactPhone}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-slate-50 dark:bg-white/5 border-dashed border-slate-200 dark:border-white/10 p-24 text-center">
          <CardContent className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-6">
              <Landmark className="w-8 h-8 text-muted-foreground dark:text-white/20" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No centers foundations</h3>
            <p className="text-muted-foreground dark:text-white/40 max-w-sm mx-auto">
              Ready to expand? Add your first physical branch or virtual learning center.
            </p>
            <Button className="mt-6 bg-primary" onClick={() => handleOpenDialog()}>
              Add Your First Center
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-glass-heavy border-slate-200 dark:border-white/10 text-slate-900 dark:text-white max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black font-outfit text-slate-900 dark:text-white">
              {editingCenter ? "Edit Center" : "Add New Center"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground dark:text-white/40">
              Configure branch settings and contact information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground/80 dark:text-white/40 tracking-widest">Center Name</Label>
                  <Input 
                    placeholder="e.g. Downtown Campus" 
                    className="bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 h-10 rounded-xl text-slate-900 dark:text-white"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground/80 dark:text-white/40 tracking-widest">City</Label>
                  <Input 
                    placeholder="e.g. London" 
                    className="bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 h-10 rounded-xl text-slate-900 dark:text-white"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground/80 dark:text-white/40 tracking-widest">Full Address</Label>
                <Input 
                  placeholder="Street name, building, floor..." 
                  className="bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 h-10 rounded-xl text-slate-900 dark:text-white"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground/80 dark:text-white/40 tracking-widest">Contact Email</Label>
                  <Input 
                    type="email"
                    placeholder="branch@pertuto.com" 
                    className="bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 h-10 rounded-xl text-slate-900 dark:text-white"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground/80 dark:text-white/40 tracking-widest">Contact Phone</Label>
                  <Input 
                    placeholder="+1 234 567 890" 
                    className="bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 h-10 rounded-xl text-slate-900 dark:text-white"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-white/40">Cancel</Button>
            <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 h-10 font-bold">
              {editingCenter ? "Save Changes" : "Create Center"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
