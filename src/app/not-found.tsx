import { Aurora } from '@/components/public/aurora';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-background">
            <Aurora colorStops={['#3B82F6', '#1E3A8A', '#0f172a']} speed={0.2} />
            
            <div className="relative z-10 max-w-2xl px-6 text-center space-y-8">
                <div className="space-y-4">
                    <h1 className="text-8xl md:text-9xl font-headline font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary/50">
                        404
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-headline font-bold text-foreground">
                        We couldn't find that page.
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-md mx-auto">
                        The link you followed might be broken, or the page may have been moved. Let's get you back on track.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                    <Link href="/">
                        <Button variant="default" size="lg" className="w-full sm:w-auto h-12 px-8">
                            Return Home
                        </Button>
                    </Link>
                    <Link href="/contact">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8">
                            Contact Support
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
