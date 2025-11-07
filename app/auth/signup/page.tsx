'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { toast } from 'sonner';
import Link from 'next/link';
import { Mail, Lock, User } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup, loginWithGoogle, loginWithGitHub, loginWithApple } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeToTerms) {
      toast.error('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await signup(formData.email, formData.password, formData.name);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to create account. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      // In a real app, you would use Google OAuth SDK
      // For now, we'll show a demo
      toast.info('Google signup would be configured with OAuth credentials');
      // Example: await loginWithGoogle(email, name, googleId);
    } catch (error: any) {
      toast.error('Google signup failed');
    }
  };

  const handleGitHubSignup = async () => {
    try {
      // In a real app, you would use GitHub OAuth SDK
      toast.info('GitHub signup would be configured with OAuth credentials');
      // Example: await loginWithGitHub(email, name, githubId);
    } catch (error: any) {
      toast.error('GitHub signup failed');
    }
  };

  const handleAppleSignup = async () => {
    try {
      // In a real app, you would use Apple Sign In SDK
      toast.info('Apple signup would be configured with OAuth credentials');
      // Example: await loginWithApple(email, name, appleId);
    } catch (error: any) {
      toast.error('Apple signup failed');
    }
  };

  const getPasswordStrengthText = () => {
    const texts = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    return texts[passwordStrength] || '';
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-500';
    if (passwordStrength === 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-yellow-500';
    if (passwordStrength === 3) return 'bg-blue-500';
    return 'bg-green-500';
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

          <h1 className="text-3xl font-bold text-white text-center mb-2">Create Account</h1>
          <p className="text-gray-400 text-center mb-8">Join thousands managing their finances smarter</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  value={formData.password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getPasswordStrengthColor()} transition-all`}
                        style={{ width: `${(passwordStrength / 4) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">
                      Password strength: <span className="text-gray-300">{getPasswordStrengthText()}</span>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>
              {formData.confirmPassword && (
                <div className="mt-1">
                  {formData.password === formData.confirmPassword ? (
                    <p className="text-xs text-green-400">✓ Passwords match</p>
                  ) : (
                    <p className="text-xs text-red-400">✗ Passwords do not match</p>
                  )}
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-slate-700 cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-gray-400">
                I agree to the{' '}
                <Link href="/terms" className="text-purple-400 hover:text-purple-300">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
              {!isLoading && <span>→</span>}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800/50 text-gray-400">Or sign up with</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg py-2.5 text-white font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>🔵</span>
              <span className="hidden sm:inline text-sm">Google</span>
            </button>
            <button
              type="button"
              onClick={handleGitHubSignup}
              className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg py-2.5 text-white font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>⚫</span>
              <span className="hidden sm:inline text-sm">GitHub</span>
            </button>
            <button
              type="button"
              onClick={handleAppleSignup}
              className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg py-2.5 text-white font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>🍎</span>
              <span className="hidden sm:inline text-sm">Apple</span>
            </button>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 font-medium">
              Sign in
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
