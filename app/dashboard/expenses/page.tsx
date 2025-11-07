'use client';

import { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, AlertCircle, Calendar, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DailyExpense {
  date: string;
  day: string;
  amount: number;
  category: string;
  description: string;
}

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
}

export default function ExpensesPage() {
  const [currentMoney, setCurrentMoney] = useState<number>(0);
  const [dailyBudget, setDailyBudget] = useState<number>(0);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(0);
  const [expenses, setExpenses] = useState<DailyExpense[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    priority: 'medium' as const,
  });

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('expenseData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setCurrentMoney(data.currentMoney || 0);
      setDailyBudget(data.dailyBudget || 0);
      setMonthlyBudget(data.monthlyBudget || 0);
      setExpenses(data.expenses || []);
      setGoals(data.goals || []);
    }
  }, []);

  // Save data to localStorage
  const saveData = (updatedExpenses: DailyExpense[], updatedGoals: Goal[], updatedCurrent: number, updatedDaily: number, updatedMonthly: number) => {
    localStorage.setItem('expenseData', JSON.stringify({
      currentMoney: updatedCurrent,
      dailyBudget: updatedDaily,
      monthlyBudget: updatedMonthly,
      expenses: updatedExpenses,
      goals: updatedGoals,
    }));
  };

  const handleAddExpense = () => {
    if (!newExpense.amount || !newExpense.description) {
      toast.error('Please fill in all fields');
      return;
    }

    const amount = parseFloat(newExpense.amount);
    const updatedExpenses = [...expenses, {
      date: newExpense.date,
      day: new Date(newExpense.date).toLocaleDateString('en-US', { weekday: 'short' }),
      amount,
      category: newExpense.category,
      description: newExpense.description,
    }];

    const updatedCurrent = currentMoney - amount;
    setCurrentMoney(updatedCurrent);
    setExpenses(updatedExpenses);
    saveData(updatedExpenses, goals, updatedCurrent, dailyBudget, monthlyBudget);

    setNewExpense({
      amount: '',
      category: 'Food',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setShowAddExpense(false);
    toast.success('Expense added successfully!');
  };

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.deadline) {
      toast.error('Please fill in all fields');
      return;
    }

    const goal: Goal = {
      id: 'goal-' + Date.now(),
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: 0,
      deadline: newGoal.deadline,
      priority: newGoal.priority,
    };

    const updatedGoals = [...goals, goal];
    setGoals(updatedGoals);
    saveData(expenses, updatedGoals, currentMoney, dailyBudget, monthlyBudget);

    setNewGoal({
      name: '',
      targetAmount: '',
      deadline: '',
      priority: 'medium',
    });
    setShowAddGoal(false);
    toast.success('Goal created successfully!');
  };

  // Calculate statistics
  const getTodayExpenses = () => {
    const today = new Date().toISOString().split('T')[0];
    return expenses
      .filter(e => e.date === today)
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const getMonthExpenses = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    return expenses
      .filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      })
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const getDailyChartData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayExpenses = expenses
        .filter(e => e.date === dateStr)
        .reduce((sum, e) => sum + e.amount, 0);
      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        amount: dayExpenses,
        budget: dailyBudget,
      });
    }
    return last7Days;
  };

  const getMonthlyChartData = () => {
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.getMonth();
      const year = date.getFullYear();
      const monthExpenses = expenses
        .filter(e => {
          const expenseDate = new Date(e.date);
          return expenseDate.getMonth() === month && expenseDate.getFullYear() === year;
        })
        .reduce((sum, e) => sum + e.amount, 0);
      months.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        amount: monthExpenses,
        budget: monthlyBudget,
      });
    }
    return months;
  };

  const getCategoryData = () => {
    const categoryMap: { [key: string]: number } = {};
    expenses.forEach(e => {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    });
    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  };

  const todayExpenses = getTodayExpenses();
  const monthExpenses = getMonthExpenses();
  const isOverDailyBudget = dailyBudget > 0 && todayExpenses > dailyBudget;
  const isOverMonthlyBudget = monthlyBudget > 0 && monthExpenses > monthlyBudget;

  const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Expense Tracker</h1>
          <p className="text-gray-400">Track your spending and achieve your financial goals</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Current Money */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Current Balance</p>
                <p className="text-3xl font-bold text-white">₦{currentMoney.toLocaleString()}</p>
              </div>
              <DollarSign className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
            <button
              onClick={() => {
                const amount = prompt('Enter current money amount:');
                if (amount) {
                  const newAmount = parseFloat(amount);
                  setCurrentMoney(newAmount);
                  saveData(expenses, goals, newAmount, dailyBudget, monthlyBudget);
                  toast.success('Balance updated!');
                }
              }}
              className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 rounded-lg transition-all"
            >
              Update Balance
            </button>
          </div>

          {/* Today's Spending */}
          <div className={`rounded-xl border backdrop-blur-xl p-6 ${isOverDailyBudget ? 'bg-red-900/30 border-red-500/30' : 'bg-slate-800/50 border-purple-500/20'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Today's Spending</p>
                <p className={`text-3xl font-bold ${isOverDailyBudget ? 'text-red-400' : 'text-white'}`}>
                  ₦{todayExpenses.toLocaleString()}
                </p>
                {dailyBudget > 0 && (
                  <p className="text-xs text-gray-400 mt-1">Budget: ₦{dailyBudget.toLocaleString()}</p>
                )}
              </div>
              {isOverDailyBudget && <AlertCircle className="w-12 h-12 text-red-500 opacity-20" />}
            </div>
          </div>

          {/* Month's Spending */}
          <div className={`rounded-xl border backdrop-blur-xl p-6 ${isOverMonthlyBudget ? 'bg-red-900/30 border-red-500/30' : 'bg-slate-800/50 border-purple-500/20'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">This Month's Spending</p>
                <p className={`text-3xl font-bold ${isOverMonthlyBudget ? 'text-red-400' : 'text-white'}`}>
                  ₦{monthExpenses.toLocaleString()}
                </p>
                {monthlyBudget > 0 && (
                  <p className="text-xs text-gray-400 mt-1">Budget: ₦{monthlyBudget.toLocaleString()}</p>
                )}
              </div>
              {isOverMonthlyBudget && <AlertCircle className="w-12 h-12 text-red-500 opacity-20" />}
            </div>
          </div>

          {/* Budget Settings */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6">
            <p className="text-gray-400 text-sm mb-3">Budget Settings</p>
            <div className="space-y-2">
              <input
                type="number"
                value={dailyBudget}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setDailyBudget(val);
                  saveData(expenses, goals, currentMoney, val, monthlyBudget);
                }}
                placeholder="Daily budget"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <input
                type="number"
                value={monthlyBudget}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setMonthlyBudget(val);
                  saveData(expenses, goals, currentMoney, dailyBudget, val);
                }}
                placeholder="Monthly budget"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Add Expense & Goal Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setShowAddExpense(!showAddExpense)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Expense
          </button>
          <button
            onClick={() => setShowAddGoal(!showAddGoal)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Goal
          </button>
        </div>

        {/* Add Expense Form */}
        {showAddExpense && (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Add New Expense</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
              />
              <input
                type="number"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                placeholder="Amount"
                className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
              >
                <option>Food</option>
                <option>Transport</option>
                <option>Entertainment</option>
                <option>Shopping</option>
                <option>Bills</option>
                <option>Other</option>
              </select>
              <input
                type="text"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                placeholder="Description"
                className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleAddExpense}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition-all"
              >
                Add Expense
              </button>
              <button
                onClick={() => setShowAddExpense(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Add Goal Form */}
        {showAddGoal && (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Create New Goal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                placeholder="Goal name (e.g., Save for vacation)"
                className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <input
                type="number"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                placeholder="Target amount"
                className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
              />
              <select
                value={newGoal.priority}
                onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as any })}
                className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleAddGoal}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-all"
              >
                Create Goal
              </button>
              <button
                onClick={() => setShowAddGoal(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Spending Chart */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Daily Spending (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getDailyChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Legend />
                <Bar dataKey="amount" fill="#8b5cf6" name="Spent" />
                <Bar dataKey="budget" fill="#10b981" name="Budget" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Spending Chart */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Monthly Spending (Last 12 Months)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getMonthlyChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#8b5cf6" name="Spent" strokeWidth={2} />
                <Line type="monotone" dataKey="budget" stroke="#10b981" name="Budget" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        {getCategoryData().length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Spending by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getCategoryData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ₦${value.toLocaleString()}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getCategoryData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Goals Section */}
        {goals.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Your Financial Goals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map(goal => (
                <div key={goal.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-semibold">{goal.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      goal.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      goal.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {goal.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">Target: ₦{goal.targetAmount.toLocaleString()}</p>
                  <div className="w-full bg-slate-600 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                      style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400">Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Expenses */}
        {expenses.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Recent Expenses</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {[...expenses].reverse().slice(0, 10).map((expense, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg">
                  <div>
                    <p className="text-white font-semibold">{expense.description}</p>
                    <p className="text-gray-400 text-sm">{expense.category} • {expense.day}</p>
                  </div>
                  <p className="text-white font-bold">₦{expense.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
