'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDailySavings } from '@/hooks/useDailySavings';
import { useAccount } from 'wagmi';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  CalendarIcon,
  CurrencyDollarIcon,
  TargetIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { formatEther, parseEther } from 'viem';

interface DailySavingsWizardProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const steps: WizardStep[] = [
  {
    id: 'token',
    title: 'Select Token',
    description: 'Choose the token you want to save daily',
    icon: CurrencyDollarIcon
  },
  {
    id: 'amount',
    title: 'Daily Amount',
    description: 'Set how much you want to save each day',
    icon: TargetIcon
  },
  {
    id: 'goal',
    title: 'Savings Goal',
    description: 'Define your target savings amount',
    icon: TargetIcon
  },
  {
    id: 'penalty',
    title: 'Penalty Settings',
    description: 'Configure early withdrawal penalties',
    icon: ExclamationTriangleIcon
  },
  {
    id: 'schedule',
    title: 'Schedule',
    description: 'Set your savings timeline',
    icon: CalendarIcon
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Confirm your daily savings configuration',
    icon: CheckCircleIcon
  }
];

export function DailySavingsWizard({ onComplete, onCancel }: DailySavingsWizardProps) {
  const { address } = useAccount();
  const { configureDailySavings, isConfiguring, configureError } = useDailySavings();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    token: '' as `0x${string}`,
    dailyAmount: '',
    goalAmount: '',
    penaltyBps: 5, // 0.05% default
    endTime: 0
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const validateStep = (stepId: string): boolean => {
    const newErrors: Record<string, string> = {};

    switch (stepId) {
      case 'token':
        if (!formData.token) {
          newErrors.token = 'Please select a token';
        }
        break;
      case 'amount':
        if (!formData.dailyAmount || parseFloat(formData.dailyAmount) <= 0) {
          newErrors.dailyAmount = 'Please enter a valid daily amount';
        }
        break;
      case 'goal':
        if (!formData.goalAmount || parseFloat(formData.goalAmount) <= 0) {
          newErrors.goalAmount = 'Please enter a valid goal amount';
        } else if (parseFloat(formData.goalAmount) < parseFloat(formData.dailyAmount)) {
          newErrors.goalAmount = 'Goal amount must be greater than daily amount';
        }
        break;
      case 'penalty':
        if (formData.penaltyBps < 0 || formData.penaltyBps > 100) {
          newErrors.penaltyBps = 'Penalty must be between 0% and 100%';
        }
        break;
      case 'schedule':
        if (formData.endTime <= 0) {
          newErrors.endTime = 'Please set a valid end time';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStepData.id)) {
      if (isLastStep) {
        handleSubmit();
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      await configureDailySavings({
        token: formData.token,
        dailyAmount: formData.dailyAmount,
        goalAmount: formData.goalAmount,
        penaltyBps: formData.penaltyBps,
        endTime: formData.endTime
      });
      onComplete?.();
    } catch (error) {
      console.error('Failed to configure daily savings:', error);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderStepContent = () => {
    switch (currentStepData.id) {
      case 'token':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {[
                { address: '0x4200000000000000000000000000000000000006' as `0x${string}`, symbol: 'WETH', name: 'Wrapped Ether' },
                { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as `0x${string}`, symbol: 'USDC', name: 'USD Coin' },
                { address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb' as `0x${string}`, symbol: 'DAI', name: 'Dai Stablecoin' }
              ].map((token) => (
                <button
                  key={token.address}
                  onClick={() => updateFormData('token', token.address)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.token === token.address
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <CurrencyDollarIcon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{token.symbol}</div>
                        <div className="text-sm text-muted-foreground">{token.name}</div>
                      </div>
                    </div>
                    {formData.token === token.address && (
                      <CheckCircleIcon className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            {errors.token && (
              <p className="text-sm text-red-500">{errors.token}</p>
            )}
          </div>
        );

      case 'amount':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Daily Savings Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.dailyAmount}
                  onChange={(e) => updateFormData('dailyAmount', e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  ETH
                </div>
              </div>
            </div>
            {errors.dailyAmount && (
              <p className="text-sm text-red-500">{errors.dailyAmount}</p>
            )}
          </div>
        );

      case 'goal':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Total Savings Goal
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.goalAmount}
                  onChange={(e) => updateFormData('goalAmount', e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  ETH
                </div>
              </div>
            </div>
            {errors.goalAmount && (
              <p className="text-sm text-red-500">{errors.goalAmount}</p>
            )}
          </div>
        );

      case 'penalty':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Early Withdrawal Penalty (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.penaltyBps}
                onChange={(e) => updateFormData('penaltyBps', parseFloat(e.target.value))}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-yellow-800">
                <ExclamationTriangleIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Penalty Notice</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Early withdrawals will incur a {formData.penaltyBps}% penalty fee.
              </p>
            </div>
            {errors.penaltyBps && (
              <p className="text-sm text-red-500">{errors.penaltyBps}</p>
            )}
          </div>
        );

      case 'schedule':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                End Date
              </label>
              <input
                type="date"
                value={new Date(formData.endTime * 1000).toISOString().split('T')[0]}
                onChange={(e) => updateFormData('endTime', Math.floor(new Date(e.target.value).getTime() / 1000))}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            {errors.endTime && (
              <p className="text-sm text-red-500">{errors.endTime}</p>
            )}
          </div>
        );

      case 'review':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h3 className="font-medium">Configuration Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Token:</span>
                  <span>WETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Daily Amount:</span>
                  <span>{formData.dailyAmount} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Goal Amount:</span>
                  <span>{formData.goalAmount} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Penalty:</span>
                  <span>{formData.penaltyBps}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End Date:</span>
                  <span>{new Date(formData.endTime * 1000).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Daily Savings Setup</h2>
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentStep ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {index < currentStep ? (
                  <CheckCircleIcon className="w-4 h-4" />
                ) : (
                  <step.icon className="w-4 h-4" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 ${
                  index < currentStep ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <currentStepData.icon className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold">{currentStepData.title}</h3>
          </div>
          <p className="text-muted-foreground">{currentStepData.description}</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={isFirstStep ? onCancel : handlePrevious}
            disabled={isConfiguring}
          >
            {isFirstStep ? 'Cancel' : 'Previous'}
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={isConfiguring}
            className="min-w-[120px]"
          >
            {isConfiguring ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Configuring...
              </div>
            ) : isLastStep ? (
              'Complete Setup'
            ) : (
              'Next'
            )}
          </Button>
        </div>

        {configureError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              {configureError.message || 'Failed to configure daily savings'}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
