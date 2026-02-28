"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "lucide-react";

export default function Home() {
  const { user, loading, isAdmin, isStudent } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (isAdmin) {
          router.push("/dashboard");
        } else if (isStudent) {
          router.push("/student/dashboard");
        } else {
          // Default to student dashboard or show role selection if no profile
          router.push("/student/dashboard");
        }
      } else {
        router.push("/login");
      }
    }
  }, [user, loading, isAdmin, isStudent, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader className="w-8 h-8 text-primary animate-spin" />
    </div>
  );
}
