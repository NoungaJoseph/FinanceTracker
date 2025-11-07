'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    occupation: '',
    income: '',
    householdSize: '',
    livingWith: '',
    location: '',
    riskTolerance: '',
    monthlyBudget: '',
  });

  const handleNext = async () => {
    if (step === 4) {
      setIsLoading(true);
      try {
        await updateProfile({
          occupation: formData.occupation,
          income: parseFloat(formData.income),
          householdSize: parseInt(formData.householdSize),
          livingWith: formData.livingWith,
          location: formData.location,
          riskTolerance: formData.riskTolerance,
          monthlyBudget: parseFloat(formData.monthlyBudget),
        });
        toast.success('Profile setup complete!');
        router.push('/dashboard');
      } catch (error) {
        toast.error('Failed to save profile');
      } finally {
        setIsLoading(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Let's Get to Know You</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Step {step} of 4</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">What's your occupation?</h2>
              <Input
                type="text"
                placeholder="e.g., Software Engineer, Teacher, Freelancer"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This helps us understand your income patterns and provide better recommendations.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">What's your monthly income?</h2>
              <Input
                type="number"
                placeholder="e.g., 5000"
                value={formData.income}
                onChange={(e) => setFormData({ ...formData, income: e.target.value })}
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enter your average monthly income (after taxes).
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Tell us about your household</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  How many people live with you?
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 1"
                  value={formData.householdSize}
                  onChange={(e) => setFormData({ ...formData, householdSize: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Who do you live with?
                </label>
                <Select value={formData.livingWith} onValueChange={(value) => setFormData({ ...formData, livingWith: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alone">Alone</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="roommates">Roommates</SelectItem>
                    <SelectItem value="partner">Partner/Spouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Lagos, Nigeria"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Financial Preferences</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What's your risk tolerance?
                </label>
                <Select value={formData.riskTolerance} onValueChange={(value) => setFormData({ ...formData, riskTolerance: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (Conservative)</SelectItem>
                    <SelectItem value="medium">Medium (Balanced)</SelectItem>
                    <SelectItem value="high">High (Aggressive)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Monthly budget for expenses
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 2000"
                  value={formData.monthlyBudget}
                  onChange={(e) => setFormData({ ...formData, monthlyBudget: e.target.value })}
                />
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                We'll use this information to provide personalized financial advice and recommendations.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1 || isLoading}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Saving...' : step === 4 ? 'Complete' : 'Next'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
