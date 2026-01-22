import { Injectable, signal } from '@angular/core';

export interface Lead {
  name: string;
  email: string;
  studentGrade: string;
  subject: string;
  goals: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  // Simulate loading state
  private _isSubmitting = signal(false);
  isSubmitting = this._isSubmitting.asReadonly();

  async submitLead(lead: Lead): Promise<{ success: boolean; message: string }> {
    this._isSubmitting.set(true);

    // Simulate Network Latency (Firebase interaction)
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('--- FIREBASE MOCK ---');
    console.log('Collection: "leads"');
    console.log('Data:', lead);
    console.log('---------------------');

    this._isSubmitting.set(false);
    return { success: true, message: 'Your request has been received! We will be in touch shortly.' };
  }
}