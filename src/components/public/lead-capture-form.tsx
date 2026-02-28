'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { submitPublicLead } from '@/app/actions/leads';
import { trackEvent } from '@/components/analytics/google-analytics';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';

// ... (Rest of imports and types stay the same)

const SUBJECTS = [
    "Mathematics", "Physics", "Chemistry", "Biology",
    "Computer Science", "English", "Business Studies",
    "AI & Data Science", "Programming", "Professional Upskilling",
    "Higher Education", "Other"
];

interface LeadFormData {
    name: string;
    phone: string;
    email?: string;
    subject: string;
}

interface LeadCaptureFormProps {
    variant?: 'minimal' | 'full';
    className?: string;
}

export function LeadCaptureForm({ variant = 'minimal', className = '' }: LeadCaptureFormProps) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<LeadFormData>();
    const [subject, setSubject] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { toast } = useToast();

    const onSubmit = async (data: LeadFormData) => {
        if (!subject && variant === 'minimal') {
            toast({ title: "Please select a subject", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            const finalSubject = subject || data.subject || '';
            const result = await submitPublicLead({
                name: data.name,
                phone: data.phone,
                email: data.email || '',
                subject: finalSubject,
            });

            if (result.success) {
                // Trigger GA4 Conversion Event
                trackEvent('generate_lead', {
                    subject: finalSubject,
                    lead_type: variant
                });

                setIsSuccess(true);
                reset();
                setSubject('');
                toast({ title: "Request received!", description: "We'll be in touch shortly." });

                setTimeout(() => setIsSuccess(false), 4000);
            } else {
                throw new Error(result.error || 'Failed to submit');
            }
        } catch (error) {
            console.error('Lead submission error:', error);
            toast({ title: "Something went wrong", description: "Please try again or WhatsApp us.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className={`flex flex-col items-center justify-center gap-4 py-8 ${className}`}>
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-lg font-semibold text-foreground">We&apos;ll call you within 2 hours!</p>
                <p className="text-sm text-muted-foreground">Check your WhatsApp for instant confirmation.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={`space-y-4 ${className}`}>
            <div className={variant === 'minimal' ? 'flex flex-col sm:flex-row gap-3' : 'space-y-4'}>
                <Input
                    placeholder="Your name"
                    {...register('name', { required: true })}
                    className="bg-background/50 border-border/50 h-12"
                />
                <Input
                    placeholder="Phone number"
                    type="tel"
                    {...register('phone', { required: true })}
                    className="bg-background/50 border-border/50 h-12"
                />
                {variant === 'full' && (
                    <Input
                        placeholder="Email (optional)"
                        type="email"
                        {...register('email')}
                        className="bg-background/50 border-border/50 h-12"
                    />
                )}
                <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger className="bg-background/50 border-border/50 h-12">
                        <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                        {SUBJECTS.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {(errors.name || errors.phone) && (
                <p className="text-sm text-destructive">Name and phone are required.</p>
            )}

            <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base"
            >
                {isSubmitting ? (
                    <><Loader2 className="me-2 h-4 w-4 animate-spin" /> Submitting...</>
                ) : (
                    <><Send className="me-2 h-4 w-4" /> Book My Free Demo</>
                )}
            </Button>
        </form>
    );
}
