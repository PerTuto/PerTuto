"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUpWithEmail } from "@/lib/firebase/auth";
import { Mail, Lock, User, ArrowRight, Loader } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signUpWithEmail(email, password, name);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-8 rounded-2xl border border-white/10 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Create Administrator
      </h2>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/40 ml-1">
            Full Name
          </label>
          <div className="relative group">
            <User className="absolute left-4 top-3.5 w-5 h-5 text-white/30 group-focus-within:text-secondary transition-colors" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input pl-12 focus:border-secondary/50 focus:ring-secondary/20"
              placeholder="John Doe"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/40 ml-1">
            Email Address
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-white/30 group-focus-within:text-secondary transition-colors" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input pl-12 focus:border-secondary/50 focus:ring-secondary/20"
              placeholder="admin@24x7tutors.com"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/40 ml-1">
            Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-white/30 group-focus-within:text-secondary transition-colors" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pl-12 focus:border-secondary/50 focus:ring-secondary/20"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-secondary w-full flex items-center justify-center gap-2 group mt-2"
        >
          {loading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Create Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-white/40">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-white hover:text-secondary font-medium transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
