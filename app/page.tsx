'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Target, Zap, BarChart3, PieChart, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isLoading) {
      if (user) {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, router]);

  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex justify-between items-center px-6 sm:px-12 py-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            FinancePro
          </span>
        </div>
        <div className="flex gap-4">
          <Link href="/auth/login">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Login
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-20 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                Take Control of Your{' '}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Finances
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-xl">
                Manage your money smarter with AI-powered insights, real-time tracking, and personalized financial advice.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/signup">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-6 rounded-lg group">
                  Start Free Today
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" className="w-full sm:w-auto border-gray-600 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-lg">
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="space-y-2">
                <p className="text-3xl font-bold text-blue-400">10K+</p>
                <p className="text-sm text-gray-400">Active Users</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-purple-400">$500M+</p>
                <p className="text-sm text-gray-400">Tracked</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-pink-400">4.9★</p>
                <p className="text-sm text-gray-400">Rating</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative h-96 sm:h-full min-h-96 animate-float">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700/50 backdrop-blur-xl">
              <div className="space-y-6">
                {/* Chart Preview */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-400">Monthly Overview</p>
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex items-end gap-2 h-32">
                    {[40, 60, 45, 75, 55, 80, 65].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t opacity-80 hover:opacity-100 transition-opacity"
                        style={{ height: `${height}%` }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
                    <p className="text-xs text-gray-400">Income</p>
                    <p className="text-lg font-bold text-green-400">$5,000</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
                    <p className="text-xs text-gray-400">Expenses</p>
                    <p className="text-lg font-bold text-red-400">$2,000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-400">Everything you need to manage your finances</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Tracking</h3>
            <p className="text-gray-400">Track all your income and expenses in real-time with intelligent categorization.</p>
          </div>

          {/* Feature 2 */}
          <div className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Goal Setting</h3>
            <p className="text-gray-400">Set financial goals and track your progress with visual indicators.</p>
          </div>

          {/* Feature 3 */}
          <div className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50 hover:border-pink-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI Advisor</h3>
            <p className="text-gray-400">Get personalized financial advice powered by advanced AI technology.</p>
          </div>

          {/* Feature 4 */}
          <div className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <PieChart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Analytics</h3>
            <p className="text-gray-400">Detailed insights and analytics to understand your spending patterns.</p>
          </div>

          {/* Feature 5 */}
          <div className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Budget Planning</h3>
            <p className="text-gray-400">Create and manage budgets with smart recommendations.</p>
          </div>

          {/* Feature 6 */}
          <div className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Growth Tracking</h3>
            <p className="text-gray-400">Monitor your financial growth and wealth accumulation over time.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 sm:px-12 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 sm:p-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Ready to Transform Your Finances?</h2>
          <p className="text-lg text-blue-100 mb-8">Join thousands of users who are taking control of their financial future.</p>
          <Link href="/auth/signup">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-lg font-semibold">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-700/50 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold">FinancePro</span>
              </div>
              <p className="text-gray-400 text-sm">Your personal finance companion.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700/50 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 FinancePro. All rights reserved.</p>
          </div>
        </div>
      </footer>

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

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
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
          animation: fade-in 0.8s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
