"use client";

import { useEffect, useState } from 'react';
import { firestore, auth } from '@/lib/firebase/client-app';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function SeedUserPage() {
    const [msg, setMsg] = useState('Seeding User...');
    useEffect(() => {
        const seed = async () => {
            try {
                const cred = await signInWithEmailAndPassword(auth, 'admin@demoschool.com', 'password123');
                const adminUid = cred.user.uid;
                const tenantId = 'test-tenant-001';
                
                await setDoc(doc(firestore, 'users', adminUid), {
                    email: 'admin@demoschool.com',
                    fullName: 'Admin User',
                    role: 'admin',
                    tenantId: tenantId,
                    onboardingCompleted: true
                });

                await setDoc(doc(firestore, `tenants/${tenantId}/users`, adminUid), {
                    email: 'admin@demoschool.com',
                    fullName: 'Admin User',
                    role: 'admin',
                    createdAt: serverTimestamp(),
                });
                
                setMsg('Success! User seeded with ID: ' + adminUid);
            } catch (e: any) {
                setMsg('Error: ' + e.message);
            }
        };
        seed();
    }, []);
    return <div style={{padding: '50px'}}>{msg}</div>;
}
