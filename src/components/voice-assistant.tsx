"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, X, Loader2, Volume2, Sparkles } from "lucide-react";
import { voiceCommandClassManagement } from "@/ai/flows/voice-command-class-management";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const resultTranscript = event.results[current][0].transcript;
        setTranscript(resultTranscript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech Recognition Error", event.error);
        setIsListening(false);
        toast({
          title: "Voice Error",
          description: "Could not hear you. Please check your mic permissions.",
          variant: "destructive",
        });
      };
    }
  }, [toast]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript("");
      setAiResponse(null);
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const handleProcessCommand = async () => {
    if (!transcript) return;
    setIsProcessing(true);
    try {
      const result = await voiceCommandClassManagement({ voiceCommand: transcript });
      setAiResponse(result.message);
      if (result.success) {
        toast({
          title: "Gemini Assistant",
          description: result.message,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Assistant Error",
        description: "Failed to process voice command.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-72 bg-card border rounded-2xl shadow-2xl overflow-hidden glassmorphism"
          >
            <div className="p-4 bg-primary/10 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-semibold font-headline text-primary">Gemini Assistant</span>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <div className={cn(
                "min-h-[60px] p-3 rounded-lg bg-muted/30 text-sm border border-dashed text-muted-foreground italic",
                transcript && "text-foreground not-italic border-solid"
              )}>
                {transcript || "Say something like \"Schedule Math on Monday at 2pm\""}
              </div>

              {aiResponse && (
                <div className="p-3 rounded-lg bg-primary/5 text-sm border border-primary/20 text-primary">
                  <div className="flex items-start gap-2">
                    <Volume2 className="h-4 w-4 shrink-0 mt-0.5" />
                    <p>{aiResponse}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  className={cn(
                    "flex-1 rounded-full gap-2 transition-all",
                    isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-primary"
                  )}
                  onClick={toggleListening}
                  disabled={isProcessing}
                >
                  {isListening ? (
                    <>
                      <div className="flex gap-1 items-center h-4">
                        <span className="w-1 h-3 bg-white/80 rounded-full animate-bounce" />
                        <span className="w-1 h-4 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                      Stop
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4" />
                      Listen
                    </>
                  )}
                </Button>
                {transcript && !isListening && (
                  <Button
                    variant="outline"
                    className="rounded-full flex-1"
                    onClick={handleProcessCommand}
                    disabled={isProcessing}
                  >
                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Process"}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="icon"
        className={cn(
          "h-14 w-14 rounded-full shadow-lg transition-all duration-300 scale-100 hover:scale-110",
          isOpen ? "rotate-90 bg-card border-2 border-primary text-primary" : "bg-primary text-primary-foreground"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        {!isOpen && (
          <motion.span
            layoutId="dot"
            className="absolute -top-1 -right-1 flex h-4 w-4"
          >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-primary border-2 border-background"></span>
          </motion.span>
        )}
      </Button>
    </div>
  );
}
