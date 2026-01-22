"use client";

import { useEffect, useState } from 'react';
import { seedMultiTenant } from '@/lib/firebase/seed';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SeedPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSeed = async () => {
        setStatus('loading');
        setMessage('Seeding...');
        try {
            await seedMultiTenant();
            setStatus('success');
            setMessage('✅ Seeding complete! Check emulator UI at http://127.0.0.1:4000');
        } catch (e: any) {
            setStatus('error');
            setMessage(`❌ Error: ${e.message}`);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>🌱 Seed Emulator Database</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        This will create a test tenant with admin and teacher users in the Firebase Emulator.
                    </p>
                    <Button
                        onClick={handleSeed}
                        disabled={status === 'loading'}
                        className="w-full"
                    >
                        {status === 'loading' ? 'Seeding...' : 'Seed Database'}
                    </Button>
                    {message && (
                        <p className={`text-sm ${status === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                            {message}
                        </p>
                    )}
                    {status === 'success' && (
                        <div className="text-xs bg-muted p-3 rounded-md">
                            <p><strong>Test Credentials:</strong></p>
                            <p>Admin: admin@demoschool.com / password123</p>
                            <p>Teacher: teacher@demoschool.com / password123</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
