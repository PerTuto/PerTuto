import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface Lead {
    name: string;
    email: string;
    studentGrade: string;
    subject: string;
    goals: string;
    source?: string;
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
                createdAt: serverTimestamp(),
                status: 'new'
            });
        } catch (error) {
            console.error('Error submitting lead:', error);
            throw error;
        }
    }
};
