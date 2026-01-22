"use client";

import React, { useState, useTransition } from "react";
import { Wand2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createEntityWithNaturalLanguage } from "@/ai/flows/entity-creation-flow";

type QuickAddProps = {
  onEntityAdd?: (entity: any, type: 'student' | 'lead' | 'class') => void;
};


export function QuickAdd({ onEntityAdd }: QuickAddProps) {
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;

    startTransition(async () => {
      try {
        const result = await createEntityWithNaturalLanguage({
          naturalLanguageInput: input,
        });

        if (result && result.entityType !== 'none') {
           toast({
            title: `${result.entityType.charAt(0).toUpperCase() + result.entityType.slice(1)} Created!`,
            description: `Successfully created ${result.name}.`,
          });
          if (onEntityAdd && (result.entityType === 'student' || result.entityType === 'lead')) {
            onEntityAdd(result, result.entityType);
          }
          setInput("");
        } else {
           toast({
            title: "Could not create entity",
            description: "The AI could not determine what to create. Please try rephrasing your request, for example: 'new student John Doe' or 'new lead Jane Smith'.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "An error occurred",
          description: "Failed to process request. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative"
    >
      <Wand2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Quick Add: 'new student John Doe' or 'new lead Jane Smith'..."
        className="pl-10 pr-24 h-12 text-base"
        disabled={isPending}
      />
      <Button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2"
        disabled={isPending || !input}
      >
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Add
      </Button>
    </form>
  );
}
