'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDCA } from '@/hooks/useDCA';
import { useAccount } from 'wagmi';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  TargetIcon,
  ChartBarIcon,
  CogIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { formatEther, parseEther } from 'viem';

interface DCASetupWizardProps {
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
    id: 'target',
    title: 'Target Token',
    description: 'Choose the token you want to DCA into',
    icon: TargetIcon
  },
  {
    id: 'amount',
    title: 'DCA Amount',
    description: 'Set your DCA amount and frequency',
    icon: CurrencyDollarIcon
  },
  {
    id: 'strategy',
    title: 'Tick Strategy',
    description: 'Configure your price-based execution strategy',
    icon: ChartBarIcon
  },
  {
    id: 'slippage',
    title: 'Slippage Protection',
    description: 'Set maximum slippage tolerance',
    icon: ExclamationTriangleIcon
  },
  {
    id: 'schedule',
    title: 'Execution Schedule',
    description: 'Configure when DCA should execute',
    icon: ClockIcon
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Confirm your DCA configuration',
    icon: CheckCircleIcon
  }
];

export function DCASetupWizard({ onComplete, onCancel }: DCASetupWizardProps) {
  const { address } = useAccount();
  const { enableDCA, setDCATickStrategy, isEnabling, isSettingStrategy, enableError } = useDCA();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    targetToken: '' as `0x${string}`,
    minAmount: '',
    maxSlippage: 1, // 1% default
    lowerTick: 0,
    upperTick: 0,
    executionFrequency: 'daily' as 'daily' | 'weekly' | 'monthly',
    maxExecutions: 30
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const validateStep = (stepId: string): boolean => {
    const newErrors: Record<string, string> = {};

    switch (stepId) {
      case 'target':
        if (!formData.targetToken) {
          newErrors.targetToken = 'Please select a target token';
        }
        break;
      case 'amount':
        if (!formData.minAmount || parseFloat(formData.minAmount) <= 0) {
          newErrors.minAmount = 'Please enter a valid minimum amount';
        }
        break;
      case 'strategy':
        if (formData.lowerTick >= formData.upperTick) {
          newErrors.tickRange = 'Lower tick must be less than upper tick';
        }
        break;
      case 'slippage':
        if (formData.maxSlippage < 0 || formData.maxSlippage > 50) {
          newErrors.maxSlippage = 'Slippage must be between 0% and 50%';
        }
        break;
      case 'schedule':
        if (formData.maxExecutions < 1 || formData.maxExecutions > 365) {
          newErrors.maxExecutions = 'Max executions must be between 1 and 365';
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
      // Enable DCA
      await enableDCA({
        targetToken: formData.targetToken,
        minAmount: formData.minAmount,
        maxSlippage: formData.maxSlippage
      });

      // Set tick strategy
      await setDCATickStrategy({
        lowerTick: formData.lowerTick,
        upperTick: formData.upperTick
      });

      onComplete?.();
    } catch (error) {
      console.error('Failed to setup DCA:', error);
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
      case 'target':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {[
                { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as `0x${string}`, symbol: 'USDC', name: 'USD Coin' },
                { address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb' as `0x${string}`, symbol: 'DAI', name: 'Dai Stablecoin' },
                { address: '0x4200000000000000000000000000000000000006' as `0x${string}`, symbol: 'WETH', name: 'Wrapped Ether' }
              ].map((token) => (
                <button
                  key={token.address}
                  onClick={() => updateFormData('targetToken', token.address)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.targetToken === token.address
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <TargetIcon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{token.symbol}</div>
                        <div className="text-sm text-muted-foreground">{token.name}</div>
                      </div>
                    </div>
                    {formData.targetToken === token.address && (
                      <CheckCircleIcon className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            {errors.targetToken && (
              <p className="text-sm text-red-500">{errors.targetToken}</p>
            )}
          </div>
        );

      case 'amount':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Minimum DCA Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.minAmount}
                  onChange={(e) => updateFormData('minAmount', e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  ETH
                </div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-800">
                <ArrowTrendingUpIcon className="w-4 h-4" />
                <span className="text-sm font-medium">DCA Strategy</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                This amount will be used for each DCA execution when price conditions are met.
              </p>
            </div>
            {errors.minAmount && (
              <p className="text-sm text-red-500">{errors.minAmount}</p>
            )}
          </div>
        );

      case 'strategy':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Lower Tick
                </label>
                <input
                  type="number"
                  value={formData.lowerTick}
                  onChange={(e) => updateFormData('lowerTick', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Upper Tick
                </label>
                <input
                  type="number"
                  value={formData.upperTick}
                  onChange={(e) => updateFormData('upperTick', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-yellow-800">
                <ChartBarIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Tick Strategy</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                DCA will execute when the current price tick is within your specified range.
              </p>
            </div>
            {errors.tickRange && (
              <p className="text-sm text-red-500">{errors.tickRange}</p>
            )}
          </div>
        );

      case 'slippage':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Maximum Slippage (%)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                step="0.1"
                value={formData.maxSlippage}
                onChange={(e) => updateFormData('maxSlippage', parseFloat(e.target.value))}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-800">
                <ExclamationTriangleIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Slippage Protection</span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                Transactions will revert if slippage exceeds {formData.maxSlippage}%.
              </p>
            </div>
            {errors.maxSlippage && (
              <p className="text-sm text-red-500">{errors.maxSlippage}</p>
            )}
          </div>
        );

      case 'schedule':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Execution Frequency
              </label>
              <select
                value={formData.executionFrequency}
                onChange={(e) => updateFormData('executionFrequency', e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Maximum Executions
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={formData.maxExecutions}
                onChange={(e) => updateFormData('maxExecutions', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            {errors.maxExecutions && (
              <p className="text-sm text-red-500">{errors.maxExecutions}</p>
            )}
          </div>
        );

      case 'review':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h3 className="font-medium">DCA Configuration Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target Token:</span>
                  <span>USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Min Amount:</span>
                  <span>{formData.minAmount} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Slippage:</span>
                  <span>{formData.maxSlippage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tick Range:</span>
                  <span>{formData.lowerTick} - {formData.upperTick}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frequency:</span>
                  <span className="capitalize">{formData.executionFrequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Executions:</span>
                  <span>{formData.maxExecutions}</span>
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
          <h2 className="text-2xl font-bold">DCA Setup</h2>
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
            disabled={isEnabling || isSettingStrategy}
          >
            {isFirstStep ? 'Cancel' : 'Previous'}
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={isEnabling || isSettingStrategy}
            className="min-w-[120px]"
          >
            {(isEnabling || isSettingStrategy) ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Setting up...
              </div>
            ) : isLastStep ? (
              'Complete Setup'
            ) : (
              'Next'
            )}
          </Button>
        </div>

        {enableError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              {enableError.message || 'Failed to setup DCA'}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
