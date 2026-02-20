"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Loader2 } from "lucide-react";
import { naturalLanguageClassCreation } from "@/ai/flows/natural-language-class-creation";
import { useToast } from "@/hooks/use-toast";

interface AIQuickAddProps {
    onResult: (result: any) => void;
}

export function AIQuickAdd({ onResult }: AIQuickAddProps) {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setLoading(true);
        try {
            const result = await naturalLanguageClassCreation({ naturalLanguageInput: input });
            if (result) {
                onResult(result);
                setInput("");
                toast({
                    title: "AI Analysis Complete",
                    description: `Found: ${result.className} for ${result.course} on ${result.dayOfWeek} at ${result.time}`,
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "AI Error",
                description: "Failed to process your request.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-1 items-center gap-2 max-w-lg">
            <div className="relative flex-1">
                <Sparkles className="absolute left-2.5 top-2.5 h-4 w-4 text-primary animate-pulse" />
                <Input
                    placeholder="e.g. Schedule Math on Monday at 2 PM"
                    className="pl-9 bg-primary/5 border-primary/20 focus-visible:ring-primary"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                />
            </div>
            <Button type="submit" disabled={loading || !input.trim()} size="sm" className="shrink-0 bg-primary/90 hover:bg-primary">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Plan"}
            </Button>
        </form>
    );
}
