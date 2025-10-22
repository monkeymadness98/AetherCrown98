"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      // Simulate signup - in production, this would create user in Supabase
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any valid data
      if (formData.email && formData.password && formData.name) {
        // Store a simple session indicator
        localStorage.setItem('user', JSON.stringify({ 
          email: formData.email,
          name: formData.name 
        }));
        router.push('/dashboard');
      } else {
        setError('Please fill in all required fields');
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 animate-fade-in">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mx-auto mb-4 shadow-glow">
            <span className="text-3xl font-bold text-black">A</span>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Create Account</h1>
          <p className="text-gray-400">Join AetherCrown98 and start your AI journey</p>
        </div>

        <div className="card-glow">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-gray-400 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-futuristic w-full"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-futuristic w-full"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-futuristic w-full"
                placeholder="••••••••"
                minLength={8}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="input-futuristic w-full"
                placeholder="••••••••"
                minLength={8}
                required
              />
            </div>

            <div className="flex items-start text-sm">
              <input type="checkbox" className="mt-1 mr-2" required />
              <label className="text-gray-400">
                I agree to the{' '}
                <span className="text-accent hover:text-accent-light cursor-pointer">Terms of Service</span>
                {' '}and{' '}
                <span className="text-accent hover:text-accent-light cursor-pointer">Privacy Policy</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-accent hover:text-accent-light font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
