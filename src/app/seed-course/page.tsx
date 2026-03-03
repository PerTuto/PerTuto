"use client";

import { useEffect, useState } from 'react';
import { firestore } from '@/lib/firebase/client-app';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function SeedCoursePage() {
    const [msg, setMsg] = useState('Seeding...');
    useEffect(() => {
        const seed = async () => {
            try {
                await addDoc(collection(firestore, "tenants/test-tenant-001/courses"), {
                    title: "Mathematics (Grade 10)",
                    description: "Core mathematics for Grade 10 students.",
                    subject: "Mathematics",
                    grade: "10",
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    status: "published",
                    tenantId: "test-tenant-001"
                });
                setMsg('Success');
            } catch (e: any) {
                setMsg('Error: ' + e.message);
            }
        };
        seed();
    }, []);
    return <div>{msg}</div>;
}
