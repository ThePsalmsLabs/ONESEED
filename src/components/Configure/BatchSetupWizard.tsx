'use client';

import { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { SavingsTokenType } from '@/contracts/types';
import { useBatchTransactions } from '@/hooks/useBatchTransactions';

interface BatchSetupWizardProps {
  onComplete: () => void;
}

export function BatchSetupWizard({ onComplete }: BatchSetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  // Form state
  const [percentage, setPercentage] = useState(500); // 5%
  const [tokenType, setTokenType] = useState<SavingsTokenType>(SavingsTokenType.INPUT);
  const [enableDCA, setEnableDCA] = useState(false);
  const [enableDailySavings, setEnableDailySavings] = useState(false);
  const [dcaTargetToken, setDcaTargetToken] = useState('');
  const [dailyAmount, setDailyAmount] = useState('');

  const { batchSavingsSetup, isPending } = useBatchTransactions();

  const steps = [
    {
      title: "Quick Setup",
      subtitle: "Configure everything in one gas-free transaction",
      icon: "⚡",
      component: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">One-Click Setup</h3>
            <p className="text-gray-600">
              Set up your savings strategy, DCA, and daily savings all at once with zero gas fees!
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">💰</div>
              <div>
                <div className="font-semibold text-green-800">Save on Gas</div>
                <div className="text-sm text-green-600">
                  Instead of 3 separate transactions (~$15), pay $0 with batch setup
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setCurrentStep(1)}
            variant="primary"
            size="lg"
            className="w-full bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700"
          >
            Start Quick Setup →
          </Button>
        </div>
      )
    },
    {
      title: "Savings Strategy",
      subtitle: "Set your base savings percentage",
      icon: "💰",
      component: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Savings Rate</h3>
            <p className="text-gray-600">How much to save from each transaction</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Savings Percentage
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={percentage}
                  onChange={(e) => setPercentage(Number(e.target.value))}
                  className="flex-1"
                />
                <div className="text-2xl font-bold text-primary-600 min-w-[60px]">
                  {(percentage / 100).toFixed(1)}%
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Save From
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: SavingsTokenType.INPUT, label: 'Input', desc: 'What you spend' },
                  { value: SavingsTokenType.OUTPUT, label: 'Output', desc: 'What you receive' },
                  { value: SavingsTokenType.SPECIFIC, label: 'Convert', desc: 'To target token' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTokenType(option.value)}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      tokenType === option.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setCurrentStep(0)}
              variant="secondary"
              className="flex-1"
            >
              ← Back
            </Button>
            <Button
              onClick={() => setCurrentStep(2)}
              variant="primary"
              className="flex-1"
            >
              Next →
            </Button>
          </div>
        </div>
      )
    },
    {
      title: "Optional Features",
      subtitle: "Enable DCA and daily savings",
      icon: "⚙️",
      component: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl mb-4">🔧</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Advanced Features</h3>
            <p className="text-gray-600">Optional: Set up automated investing and daily savings</p>
          </div>

          <div className="space-y-4">
            {/* DCA Option */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">Dollar-Cost Averaging</h4>
                  <p className="text-sm text-gray-600">Auto-convert savings to target token</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableDCA}
                    onChange={(e) => setEnableDCA(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              {enableDCA && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Token (e.g., USDC, ETH)
                    </label>
                    <input
                      type="text"
                      placeholder="0x..."
                      value={dcaTargetToken}
                      onChange={(e) => setDcaTargetToken(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Daily Savings Option */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">Daily Savings</h4>
                  <p className="text-sm text-gray-600">Set daily savings goals with penalties</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableDailySavings}
                    onChange={(e) => setEnableDailySavings(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              {enableDailySavings && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Daily Amount (USD)
                    </label>
                    <input
                      type="number"
                      placeholder="5"
                      value={dailyAmount}
                      onChange={(e) => setDailyAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setCurrentStep(1)}
              variant="secondary"
              className="flex-1"
            >
              ← Back
            </Button>
            <Button
              onClick={() => setCurrentStep(3)}
              variant="primary"
              className="flex-1"
            >
              Review →
            </Button>
          </div>
        </div>
      )
    },
    {
      title: "Review & Execute",
      subtitle: "One gas-free transaction to set everything up",
      icon: "🚀",
      component: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to Launch</h3>
            <p className="text-gray-600">Review your settings and execute the batch setup</p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Your Configuration</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Savings Rate:</span>
                  <span className="font-semibold">{(percentage / 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Save From:</span>
                  <span className="font-semibold">
                    {tokenType === SavingsTokenType.INPUT ? 'Input Token' :
                     tokenType === SavingsTokenType.OUTPUT ? 'Output Token' : 'Convert to Target'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">DCA:</span>
                  <span className="font-semibold">{enableDCA ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Daily Savings:</span>
                  <span className="font-semibold">{enableDailySavings ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl">⚡</div>
                <div>
                  <div className="font-semibold text-green-800">Gas-Free Batch Setup</div>
                  <div className="text-sm text-green-600">
                    All configurations in one transaction - $0 gas fees
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setCurrentStep(2)}
              variant="secondary"
              className="flex-1"
            >
              ← Back
            </Button>
            <Button
              onClick={async () => {
                try {
                  await batchSavingsSetup({
                    percentage: BigInt(percentage),
                    autoIncrement: BigInt(0),
                    maxPercentage: BigInt(2000),
                    roundUpSavings: false,
                    savingsTokenType: tokenType,
                    enableDCA,
                    dcaTargetToken: enableDCA ? dcaTargetToken as `0x${string}` : undefined,
                    enableDailySavings,
                    dailyAmount: enableDailySavings ? dailyAmount : undefined
                  });
                  onComplete();
                } catch (error) {
                  console.error('Batch setup failed:', error);
                }
              }}
              variant="primary"
              size="lg"
              className="flex-1 bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700"
              isLoading={isPending}
              disabled={isPending}
            >
              {isPending ? 'Setting Up...' : '🚀 Execute Batch Setup'}
            </Button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8">
        <CardContent>
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {steps[currentStep].title}
              </h1>
              <div className="text-sm text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {steps[currentStep].component}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
