"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function AvailabilityForm() {
  const [availability, setAvailability] = useState(
    "Mon-Fri, 9:00 AM - 5:00 PM PST\nTue/Thu, 7:00 PM - 9:00 PM EST for remote classes."
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call to save availability
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Availability Updated",
        description: "Your new working hours have been saved.",
      });
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={availability}
        onChange={(e) => setAvailability(e.target.value)}
        rows={5}
        placeholder="e.g., Mon-Fri, 9am-5pm EST"
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Availability
      </Button>
    </form>
  );
}
