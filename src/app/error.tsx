'use client';

import { useEffect } from 'react';
import { Aurora } from '@/components/public/aurora';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Global Application Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-background">
            <Aurora colorStops={['#ef4444', '#7f1d1d', '#450a0a']} speed={0.1} />

            <div className="relative z-10 max-w-2xl px-6 text-center space-y-8 p-12 rounded-3xl bg-card/60 backdrop-blur-xl border border-destructive/20 shadow-2xl">
                <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
                
                <div className="space-y-4">
                    <h1 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
                        Something went wrong
                    </h1>
                    <p className="text-muted-foreground">
                        A critical error occurred while rendering this page. Our team has been automatically notified.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Button 
                        variant="default" 
                        size="lg" 
                        className="w-full sm:w-auto h-12 px-8 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                        onClick={() => reset()}
                    >
                        Try Again
                    </Button>
                    <Link href="/">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8">
                            Return Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
