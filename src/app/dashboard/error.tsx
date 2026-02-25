"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard caught error:", error);
  }, [error]);

  return (
    <Card className="border-destructive/50 bg-destructive/5 m-4">
      <CardContent className="flex flex-col items-center justify-center py-10 text-center">
        <div className="rounded-full bg-destructive/10 p-3 mb-4">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          We encountered an error loading this part of your dashboard. This could be due to a network connection issue or permission error.
        </p>
        <Button onClick={() => reset()} variant="outline" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}
