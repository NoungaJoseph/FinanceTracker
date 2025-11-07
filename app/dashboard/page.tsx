'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { LogOut, Settings, Moon, Sun, TrendingUp, Wallet, Target } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) {
      router.push('/auth/login');
      return;
    }

    fetchData();
  }, [user, token, router]);

  const fetchData = async () => {
    try {
      const [transRes, goalsRes] = await Promise.all([
        fetch('/api/transactions', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/goals', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (transRes.ok) {
        setTransactions(await transRes.json());
      }
      if (goalsRes.ok) {
        setGoals(await goalsRes.json());
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-xl border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Finance Dashboard</h1>
            <p className="text-sm text-gray-400">Welcome, {user?.name}</p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-white hover:bg-slate-700"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/dashboard/settings')}
              className="text-white hover:bg-slate-700"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-white hover:bg-red-600/20"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8 flex gap-4 flex-wrap">
          <Link href="/dashboard">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              Overview
            </Button>
          </Link>
          <Link href="/dashboard/expenses">
            <Button variant="outline" className="border-purple-500/30 text-white hover:bg-slate-700">
              <Wallet className="w-4 h-4 mr-2" />
              Expense Tracker
            </Button>
          </Link>
          <Link href="/dashboard/goals">
            <Button variant="outline" className="border-purple-500/30 text-white hover:bg-slate-700">
              <Target className="w-4 h-4 mr-2" />
              Goals
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6">
            <p className="text-gray-400 text-sm mb-2">Total Income</p>
            <p className="text-3xl font-bold text-green-400">₦{totalIncome.toLocaleString()}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6">
            <p className="text-gray-400 text-sm mb-2">Total Expenses</p>
            <p className="text-3xl font-bold text-red-400">₦{totalExpenses.toLocaleString()}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6">
            <p className="text-gray-400 text-sm mb-2">Balance</p>
            <p className={`text-3xl font-bold ${balance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
              ₦{balance.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transactions */}
          <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Recent Transactions</h2>
            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg">
                    <div>
                      <p className="text-white font-semibold">{transaction.description}</p>
                      <p className="text-gray-400 text-sm">{transaction.category}</p>
                    </div>
                    <p className={`font-bold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                      {transaction.type === 'income' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No transactions yet</p>
            )}
          </div>

          {/* Goals */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Your Goals</h2>
            {goals.length > 0 ? (
              <div className="space-y-3">
                {goals.slice(0, 3).map((goal) => (
                  <div key={goal.id} className="bg-slate-700/50 p-3 rounded-lg">
                    <p className="text-white font-semibold text-sm">{goal.name}</p>
                    <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                        style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      ₦{goal.currentAmount.toLocaleString()} / ₦{goal.targetAmount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No goals yet</p>
            )}
          </div>
        </div>
      </main>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
}
