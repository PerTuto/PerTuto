import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Aligned with ChronoClass types
export interface Lead {
    name: string;
    email: string;
    phone?: string;
    status?: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
    source?: string;
    dateAdded?: Date; // Mapped from createdAt
    notes?: string;
    timezone?: string;

    // Pertuto Specifics
    studentGrade?: string;
    subject?: string;
    goals?: string;
    curriculum?: string;
    referralSource?: string;
}

export const leadService = {
    async submitLead(lead: Lead): Promise<void> {
        try {
            console.log('Submitting lead to Firestore:', lead);
            const leadsRef = collection(db, 'leads');

            await addDoc(leadsRef, {
                ...lead,
                status: lead.status || 'New',
                createdAt: serverTimestamp(),
                // Store dateAdded as ISO string if needed for strict compatibility, 
                // but serverTimestamp is better for Firestore. 
                // We'll rely on createdAt for sorting.
            });
        } catch (error) {
            console.error('Error submitting lead:', error);
            throw error;
        }
    }
};
