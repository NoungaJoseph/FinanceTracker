'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { toast } from 'sonner';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, loginWithGitHub, loginWithApple } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = error?.message || 'Invalid email or password';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // In a real app, you would use Google OAuth SDK
      toast.info('Google login would be configured with OAuth credentials');
      // Example: await loginWithGoogle(email, name, googleId);
    } catch (error: any) {
      toast.error('Google login failed');
    }
  };

  const handleGitHubLogin = async () => {
    try {
      // In a real app, you would use GitHub OAuth SDK
      toast.info('GitHub login would be configured with OAuth credentials');
      // Example: await loginWithGitHub(email, name, githubId);
    } catch (error: any) {
      toast.error('GitHub login failed');
    }
  };

  const handleAppleLogin = async () => {
    try {
      // In a real app, you would use Apple Sign In SDK
      toast.info('Apple login would be configured with OAuth credentials');
      // Example: await loginWithApple(email, name, appleId);
    } catch (error: any) {
      toast.error('Apple login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">💰</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white text-center mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-center mb-8">Sign in to your Finance Dashboard</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-slate-700 cursor-pointer"
                />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-purple-400 hover:text-purple-300">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              {!isLoading && <span>→</span>}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800/50 text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg py-2.5 text-white font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>🔵</span>
              <span className="hidden sm:inline text-sm">Google</span>
            </button>
            <button
              type="button"
              onClick={handleGitHubLogin}
              className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg py-2.5 text-white font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>⚫</span>
              <span className="hidden sm:inline text-sm">GitHub</span>
            </button>
            <button
              type="button"
              onClick={handleAppleLogin}
              className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg py-2.5 text-white font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>🍎</span>
              <span className="hidden sm:inline text-sm">Apple</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-purple-400 hover:text-purple-300 font-medium">
              Sign up
            </Link>
          </p>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-700/50 text-center text-xs text-gray-500 space-y-1">
            <p>✓ Free forever - no credit card required</p>
            <p>✓ AI-powered financial insights</p>
            <p>✓ Bank-level security</p>
          </div>
        </div>
      </div>
    </div>
  );
}
