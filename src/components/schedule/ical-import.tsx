"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Upload, Calendar, Loader2, CheckCircle2 } from "lucide-react";
import ICAL from "ical.js";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { batchAddClasses } from "@/lib/firebase/services";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

interface ICalEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
  selected: boolean;
}

interface ICalImportProps {
  onImportComplete?: () => void;
}

export function ICalImport({ onImportComplete }: ICalImportProps) {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState<ICalEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();
  const { userProfile, user } = useAuth();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const text = await file.text();
      const jcalData = ICAL.parse(text);
      const vcalendar = new ICAL.Component(jcalData);
      const vevents = vcalendar.getAllSubcomponents('vevent');
      
      const extractedEvents: ICalEvent[] = vevents.map((vevent: any) => {
        const event = new ICAL.Event(vevent);
        return {
          id: event.uid || Math.random().toString(36).substr(2, 9),
          title: event.summary || "Untitled Event",
          start: event.startDate.toJSDate(),
          end: event.endDate.toJSDate(),
          location: event.location,
          description: event.description,
          selected: true
        };
      });

      if (extractedEvents.length === 0) {
        toast({
          title: "No Events Found",
          description: "Could not find any standard VEVENT items in the file.",
          variant: "destructive"
        });
      } else {
        setEvents(extractedEvents.sort((a, b) => a.start.getTime() - b.start.getTime()));
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Parsing Error",
        description: "Failed to parse the iCal file.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleEvent = (id: string) => {
    setEvents(prev => prev.map(ev => 
      ev.id === id ? { ...ev, selected: !ev.selected } : ev
    ));
  };

  const handleImport = async () => {
    if (!user || !userProfile?.tenantId) return;

    const selectedEvents = events.filter(ev => ev.selected);
    if (selectedEvents.length === 0) {
      toast({ title: "No events selected", variant: "destructive" });
      return;
    }

    setImporting(true);
    try {
      const classesData = selectedEvents.map(ev => ({
        ownerId: user.uid,
        title: ev.title,
        start: ev.start,
        end: ev.end,
        meetLink: ev.location || "",
        status: 'scheduled',
        students: [] // Default to empty, user can assign later
      }));

      await batchAddClasses(userProfile.tenantId, classesData);
      
      toast({
        title: "Import Successful",
        description: `Imported ${selectedEvents.length} events to your calendar.`,
      });
      
      setOpen(false);
      setEvents([]);
      if (onImportComplete) onImportComplete();
    } catch (error) {
      console.error(error);
      toast({
        title: "Import Failed",
        description: "Failed to save events to the database.",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Upload className="h-4 w-4" />
          <span>Import iCal</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Import Schedule
          </DialogTitle>
          <DialogDescription>
            Upload an .ics file from Google Calendar, Outlook, or Apple Calendar.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4 py-4">
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-xl border-muted-foreground/20 bg-muted/5">
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-center px-4 font-medium">Click below to upload your .ics file</p>
                  <label className="mt-4">
                    <Button variant="secondary" size="sm" asChild>
                      <span>Choose File</span>
                    </Button>
                    <input 
                      type="file" 
                      accept=".ics,.ical" 
                      className="hidden" 
                      onChange={handleFileUpload}
                      disabled={loading}
                    />
                  </label>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3 h-full">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {events.filter(e => e.selected).length} of {events.length} Selected
                </span>
                <div className="flex items-center gap-1">
                  <label>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-primary/80 hover:text-primary" asChild>
                      <span>Change File</span>
                    </Button>
                    <input 
                      type="file" 
                      accept=".ics,.ical" 
                      className="hidden" 
                      onChange={handleFileUpload}
                      disabled={loading}
                      onClick={(e) => (e.currentTarget.value = '')} // Allow re-selecting same file
                    />
                  </label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs"
                    onClick={() => setEvents(events.map(e => ({ ...e, selected: true })))}
                  >
                    Select All
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="flex-1 border rounded-lg p-2 bg-muted/5">
                <div className="space-y-2">
                  {events.map((ev) => (
                    <div 
                      key={ev.id} 
                      className={`flex items-start gap-3 p-2 rounded-md border transition-colors ${
                        ev.selected ? 'bg-primary/5 border-primary/20' : 'bg-transparent border-transparent opacity-60'
                      }`}
                    >
                      <Checkbox 
                        id={ev.id} 
                        checked={ev.selected} 
                        onCheckedChange={() => toggleEvent(ev.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <label 
                          htmlFor={ev.id}
                          className="text-sm font-semibold truncate block cursor-pointer"
                        >
                          {ev.title}
                        </label>
                        <p className="text-[11px] text-muted-foreground">
                          {format(ev.start, 'MMM d, h:mm a')} - {format(ev.end, 'h:mm a')}
                        </p>
                        {ev.location && (
                          <p className="text-[10px] text-primary/70 mt-0.5 truncate italic">
                            {ev.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs h-8"
                onClick={() => setEvents([])}
              >
                Clear and Start Over
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={importing}>
            Cancel
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={importing || events.length === 0 || events.filter(e => e.selected).length === 0}
            className="bg-primary hover:bg-primary/90 min-w-[100px]"
          >
            {importing ? (
              <Loader2 className="h-4 w-4 animate-spin me-2" />
            ) : (
              <CheckCircle2 className="h-4 w-4 me-2" />
            )}
            Import Events
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
