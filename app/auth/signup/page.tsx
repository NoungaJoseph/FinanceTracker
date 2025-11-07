'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Wallet, Check } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    calculatePasswordStrength(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      await signup(formData.name, formData.email, formData.password);
      toast.success('Account created successfully!');
      router.push('/onboarding');
    } catch (error) {
      toast.error('Failed to create account. Email may already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-500';
    if (passwordStrength === 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-yellow-500';
    if (passwordStrength === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return 'No password';
    if (passwordStrength === 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Good';
    return 'Strong';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden flex items-center justify-center py-12">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              FinancePro
            </span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-400">Join thousands managing their finances smarter</p>
        </div>

        {/* Signup Card */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 backdrop-blur-xl p-8 animate-fade-in animation-delay-200">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isLoading}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isLoading}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                  required
                />
              </div>
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i < passwordStrength ? getPasswordStrengthColor() : 'bg-slate-700'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    Password strength: <span className="text-gray-300 font-semibold">{getPasswordStrengthText()}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  disabled={isLoading}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                  required
                />
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Passwords match
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 mt-1"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-400">
                I agree to the{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 transition">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 transition">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 group"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900 text-gray-400">Or sign up with</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              className="border-slate-600 text-gray-300 hover:bg-slate-700/50"
            >
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-slate-600 text-gray-300 hover:bg-slate-700/50"
            >
              GitHub
            </Button>
          </div>
        </Card>

        {/* Login Link */}
        <div className="text-center mt-6 animate-fade-in animation-delay-400">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-semibold transition">
              Sign in
            </Link>
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-12 space-y-3 animate-fade-in animation-delay-600">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-green-400" />
            </div>
            <span className="text-gray-300">Free forever - no credit card required</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-green-400" />
            </div>
            <span className="text-gray-300">AI-powered financial insights</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-green-400" />
            </div>
            <span className="text-gray-300">Bank-level security</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </div>
  );
}
