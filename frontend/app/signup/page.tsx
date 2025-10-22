"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;

      // Redirect to dashboard on success
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
      
      <div className="relative z-10 max-w-md w-full">
        <div className="card-glow">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">Join AetherCrown98</h1>
            <p className="text-gray-400">Create your account and start your AI empire</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-background-dark border border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-colors text-white"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-background-dark border border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-colors text-white"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-background-dark border border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-colors text-white"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-lg py-3"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-accent hover:text-accent-light transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Floating decoration elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-xl animate-float" style={{ animationDelay: "1s" }}></div>
      </div>
    </div>
  );
}
