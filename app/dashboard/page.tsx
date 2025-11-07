'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { LogOut, Settings, Moon, Sun } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Finance Dashboard</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Welcome, {user?.name}</p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => router.push('/settings')}>
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Stats and Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Income</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
                    ${totalIncome.toFixed(2)}
                  </p>
                </Card>
                <Card className="p-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">
                    ${totalExpenses.toFixed(2)}
                  </p>
                </Card>
                <Card className="p-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Balance</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                    ${balance.toFixed(2)}
                  </p>
                </Card>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="transactions" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="goals">Goals</TabsTrigger>
                </TabsList>

                <TabsContent value="transactions">
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Recent Transactions
                    </h2>
                    <div className="space-y-2">
                      {transactions.slice(0, 5).map((t) => (
                        <div key={t.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800 rounded">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{t.description}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t.category}</p>
                          </div>
                          <p
                            className={`font-semibold ${
                              t.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="goals">
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Financial Goals
                    </h2>
                    <div className="space-y-4">
                      {goals.map((goal) => (
                        <div key={goal.id} className="p-4 bg-gray-50 dark:bg-slate-800 rounded">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-medium text-gray-900 dark:text-white">{goal.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                            </p>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${(goal.currentAmount / goal.targetAmount) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - AI Assistant */}
            <div className="lg:col-span-1">
              <AIAssistant />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
