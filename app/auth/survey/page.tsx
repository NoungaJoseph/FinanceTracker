'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { toast } from 'sonner';
import { ArrowRight, DollarSign } from 'lucide-react';

export default function SurveyPage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    monthlyExpenses: '',
    savingsRate: '',
    financialGoals: [] as string[],
    riskTolerance: '',
    householdSize: '',
    livingWith: '',
    occupation: '',
    location: '',
  });

  const financialGoalsOptions = [
    'Build Emergency Fund',
    'Save for Retirement',
    'Buy a Home',
    'Pay Off Debt',
    'Invest & Grow Wealth',
    'Education Fund',
    'Travel & Experiences',
    'Start a Business',
  ];

  const riskToleranceOptions = [
    { value: 'conservative', label: 'Conservative (Low Risk)', description: 'Prefer stable, predictable returns' },
    { value: 'moderate', label: 'Moderate (Medium Risk)', description: 'Balance between growth and stability' },
    { value: 'aggressive', label: 'Aggressive (High Risk)', description: 'Willing to take risks for higher returns' },
  ];

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      financialGoals: prev.financialGoals.includes(goal)
        ? prev.financialGoals.filter(g => g !== goal)
        : [...prev.financialGoals, goal]
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.monthlyIncome || !formData.monthlyExpenses) {
        toast.error('Please fill in all fields');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (formData.financialGoals.length === 0) {
        toast.error('Please select at least one financial goal');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!formData.riskTolerance) {
        toast.error('Please select your risk tolerance');
        return;
      }
      setStep(4);
    }
  };

  const handleSubmit = async () => {
    if (!formData.householdSize || !formData.occupation) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile({
        income: parseInt(formData.monthlyIncome),
        monthlyBudget: parseInt(formData.monthlyExpenses),
        savingsRate: parseInt(formData.savingsRate),
        riskTolerance: formData.riskTolerance,
        householdSize: parseInt(formData.householdSize),
        livingWith: formData.livingWith,
        occupation: formData.occupation,
        location: formData.location,
      });
      toast.success('Profile updated successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Let's Personalize Your Experience</h1>
          <p className="text-gray-400">Help us understand your financial situation better</p>
          <div className="flex justify-center gap-2 mt-6">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s <= step ? 'bg-purple-500 w-8' : 'bg-slate-700 w-2'
                }`}
              />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Income & Expenses</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Income</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                    placeholder="e.g., 5000"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Expenses</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    value={formData.monthlyExpenses}
                    onChange={(e) => setFormData({ ...formData, monthlyExpenses: e.target.value })}
                    placeholder="e.g., 3000"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Savings Rate (%)</label>
                <input
                  type="number"
                  value={formData.savingsRate}
                  onChange={(e) => setFormData({ ...formData, savingsRate: e.target.value })}
                  placeholder="e.g., 20"
                  min="0"
                  max="100"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full mt-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">What are your financial goals?</h2>
            <p className="text-gray-400 mb-6">Select all that apply</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {financialGoalsOptions.map(goal => (
                <button
                  key={goal}
                  onClick={() => toggleGoal(goal)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    formData.financialGoals.includes(goal)
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-slate-600 bg-slate-700/50 hover:border-purple-500/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      formData.financialGoals.includes(goal)
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-slate-500'
                    }`}>
                      {formData.financialGoals.includes(goal) && (
                        <span className="text-white text-sm">✓</span>
                      )}
                    </div>
                    <span className="text-white font-medium">{goal}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2.5 rounded-lg transition-all"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">What's your risk tolerance?</h2>
            
            <div className="space-y-3 mb-8">
              {riskToleranceOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setFormData({ ...formData, riskTolerance: option.value })}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    formData.riskTolerance === option.value
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-slate-600 bg-slate-700/50 hover:border-purple-500/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.riskTolerance === option.value
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-slate-500'
                    }`}>
                      {formData.riskTolerance === option.value && (
                        <span className="text-white text-sm">✓</span>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">{option.label}</p>
                      <p className="text-gray-400 text-sm">{option.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2.5 rounded-lg transition-all"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Occupation</label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  placeholder="e.g., Software Engineer"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Household Size</label>
                <select
                  value={formData.householdSize}
                  onChange={(e) => setFormData({ ...formData, householdSize: e.target.value })}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                >
                  <option value="">Select household size</option>
                  <option value="1">1 (Just me)</option>
                  <option value="2">2 (Me + 1)</option>
                  <option value="3">3 (Me + 2)</option>
                  <option value="4">4 (Me + 3)</option>
                  <option value="5">5+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Living Situation</label>
                <select
                  value={formData.livingWith}
                  onChange={(e) => setFormData({ ...formData, livingWith: e.target.value })}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                >
                  <option value="">Select living situation</option>
                  <option value="alone">Living Alone</option>
                  <option value="family">Living with Family</option>
                  <option value="partner">Living with Partner</option>
                  <option value="roommates">Living with Roommates</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location (City/Country)</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Lagos, Nigeria"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2.5 rounded-lg transition-all"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? 'Saving...' : 'Complete Setup'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
