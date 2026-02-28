import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in duration-500">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black text-gradient-primary tracking-tight mb-2">
            TutorOS
          </h1>
          <p className="text-white/50 text-sm">
            AI-Powered Math Tutoring Platform
          </p>
        </div>

        {children}

        <p className="mt-8 text-center text-xs text-white/30">
          &copy; 2026 24x7Tutors. All rights reserved.
        </p>
      </div>
    </div>
  );
}
