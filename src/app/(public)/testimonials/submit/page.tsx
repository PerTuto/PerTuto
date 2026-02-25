"use client";

import { useState } from "react";
import { Star, Send, CheckCircle, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { submitTestimonial } from "@/app/actions/testimonials";
import { Suspense } from "react";

function TestimonialForm() {
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenant") || "";

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!tenantId) {
      setError("Invalid submission link. Please contact the organization.");
      return;
    }

    setSubmitting(true);
    setError("");

    const result = await submitTestimonial({ tenantId, name, role, quote, rating });

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || "Something went wrong.");
    }
    setSubmitting(false);
  }

  if (!tenantId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-2">Invalid Link</h1>
          <p className="text-muted-foreground">This testimonial submission link is invalid. Please contact the organization for a valid link.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
        <div className="text-center max-w-md space-y-4">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold">Thank You!</h1>
          <p className="text-muted-foreground text-lg">
            Your testimonial has been submitted and is awaiting review. We truly appreciate your feedback!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="w-full max-w-xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Share Your Experience
          </h1>
          <p className="text-muted-foreground text-lg">
            Your feedback helps others discover quality tutoring. We'd love to hear from you!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border p-8 space-y-6">
          {/* Star Rating */}
          <div className="text-center">
            <label className="block text-sm font-medium mb-3">How would you rate your experience?</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300 dark:text-slate-600"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div className="space-y-2">
            <label htmlFor="quote" className="block text-sm font-medium">Your Testimonial</label>
            <textarea
              id="quote"
              value={quote}
              onChange={e => setQuote(e.target.value)}
              rows={4}
              required
              minLength={10}
              maxLength={1000}
              placeholder="Tell us about your experience..."
              className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">{quote.length}/1000</p>
          </div>

          {/* Name */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">Your Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                minLength={2}
                maxLength={100}
                placeholder="Jane Smith"
                className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium">Your Role</label>
              <input
                id="role"
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                required
                minLength={2}
                maxLength={150}
                placeholder="Parent of IGCSE Student"
                className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 rounded-lg px-4 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
            ) : (
              <><Send className="w-4 h-4" /> Submit Testimonial</>
            )}
          </button>

          <p className="text-xs text-muted-foreground text-center">
            Your testimonial will be reviewed before being published.
          </p>
        </form>
      </div>
    </div>
  );
}

export default function TestimonialSubmitPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <TestimonialForm />
    </Suspense>
  );
}
