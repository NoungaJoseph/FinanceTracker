'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowRight, ArrowLeft, Briefcase, Home, MapPin, TrendingUp, Wallet } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, token, updateProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    occupation: '',
    income: '',
    householdSize: '',
    livingWith: '',
    location: '',
    riskTolerance: '',
    monthlyBudget: '',
  });

  useEffect(() => {
    if (!user || !token) {
      router.push('/auth/login');
    }
  }, [user, token, router]);

  const handleNext = () => {
    if (step === 1 && !formData.occupation) {
      toast.error('Please enter your occupation');
      return;
    }
    if (step === 1 && !formData.income) {
      toast.error('Please enter your monthly income');
      return;
    }
    if (step === 2 && !formData.householdSize) {
      toast.error('Please enter household size');
      return;
    }
    if (step === 2 && !formData.livingWith) {
      toast.error('Please select who you live with');
      return;
    }
    if (step === 3 && !formData.location) {
      toast.error('Please enter your location');
      return;
    }
    if (step === 4 && !formData.riskTolerance) {
      toast.error('Please select your risk tolerance');
      return;
    }
    if (step === 4 && !formData.monthlyBudget) {
      toast.error('Please enter your monthly budget');
      return;
    }

    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleComplete = async () => {
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
      toast.error('Failed to complete setup');
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = (step / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden flex items-center justify-center py-12">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl px-6">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              FinancePro
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Let's Get Started</h1>
          <p className="text-gray-400">Help us understand your financial situation (Step {step} of 4)</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 animate-fade-in animation-delay-200">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                  s <= step
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-slate-700 text-gray-400'
                }`}
              >
                {s}
              </div>
            ))}
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 backdrop-blur-xl p-8 animate-fade-in animation-delay-400">
          {/* Step 1: Occupation & Income */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold">Career & Income</h2>
                </div>
                <p className="text-gray-400 mb-6">Tell us about your professional background</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">What's your occupation?</label>
                  <Input
                    type="text"
                    placeholder="e.g., Software Engineer, Teacher, Accountant"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Income ($)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.income}
                    onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Household */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Home className="w-6 h-6 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold">Household Information</h2>
                </div>
                <p className="text-gray-400 mb-6">Help us understand your living situation</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Household Size</label>
                  <Input
                    type="number"
                    placeholder="1"
                    value={formData.householdSize}
                    onChange={(e) => setFormData({ ...formData, householdSize: e.target.value })}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Who do you live with?</label>
                  <Select value={formData.livingWith} onValueChange={(value) => setFormData({ ...formData, livingWith: value })}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="alone">Alone</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="roommates">Roommates</SelectItem>
                      <SelectItem value="partner">Partner/Spouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-pink-400" />
                  </div>
                  <h2 className="text-2xl font-bold">Location</h2>
                </div>
                <p className="text-gray-400 mb-6">Where are you located?</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">City, Country</label>
                <Input
                  type="text"
                  placeholder="e.g., Lagos, Nigeria"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>
          )}

          {/* Step 4: Financial Preferences */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold">Financial Preferences</h2>
                </div>
                <p className="text-gray-400 mb-6">Tell us about your financial goals and preferences</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Risk Tolerance</label>
                  <Select value={formData.riskTolerance} onValueChange={(value) => setFormData({ ...formData, riskTolerance: value })}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="low">Low (Conservative)</SelectItem>
                      <SelectItem value="medium">Medium (Balanced)</SelectItem>
                      <SelectItem value="high">High (Aggressive)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Budget ($)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.monthlyBudget}
                    onChange={(e) => setFormData({ ...formData, monthlyBudget: e.target.value })}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1 || isLoading}
              className="flex-1 border-slate-600 text-gray-300 hover:bg-slate-700/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {step < 4 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 group"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleComplete}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Completing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Complete Setup
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            )}
          </div>
        </Card>

        {/* Skip Option */}
        <div className="text-center mt-6 animate-fade-in animation-delay-600">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-400 hover:text-gray-300 text-sm transition"
          >
            Skip for now
          </button>
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
