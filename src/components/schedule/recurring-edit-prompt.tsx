"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Repeat, Calendar, ArrowRight } from "lucide-react";

export type RecurringEditChoice = 'this' | 'future' | 'cancel';

interface RecurringEditPromptProps {
  open: boolean;
  onChoice: (choice: RecurringEditChoice) => void;
  eventTitle?: string;
}

export function RecurringEditPrompt({ open, onChoice, eventTitle }: RecurringEditPromptProps) {
  return (
    <AlertDialog open={open} onOpenChange={(o) => { if (!o) onChoice('cancel'); }}>
      <AlertDialogContent className="max-w-[380px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Repeat className="h-5 w-5 text-primary" />
            Edit Recurring Event
          </AlertDialogTitle>
          <AlertDialogDescription>
            {eventTitle ? `"${eventTitle}" is ` : 'This event is '}
            part of a recurring series. How would you like to apply the change?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-2 py-2">
          <Button
            variant="outline"
            className="justify-start h-auto py-3 px-4"
            onClick={() => onChoice('this')}
          >
            <Calendar className="h-4 w-4 me-3 text-muted-foreground flex-shrink-0" />
            <div className="text-start">
              <p className="text-sm font-medium">Only This Event</p>
              <p className="text-xs text-muted-foreground">Change only this occurrence</p>
            </div>
          </Button>
          <Button
            variant="outline"
            className="justify-start h-auto py-3 px-4"
            onClick={() => onChoice('future')}
          >
            <ArrowRight className="h-4 w-4 me-3 text-muted-foreground flex-shrink-0" />
            <div className="text-start">
              <p className="text-sm font-medium">This & Future Events</p>
              <p className="text-xs text-muted-foreground">Apply to all upcoming occurrences</p>
            </div>
          </Button>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onChoice('cancel')}>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
