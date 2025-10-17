'use client';

import { Layout } from '@/components/Layout';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSavingsStrategy } from '@/hooks/useSavingsStrategy';
import { SavingsTokenType } from '@/contracts/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function ConfigurePage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { strategy, setSavingStrategy, isPending } = useSavingsStrategy();

  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  // Form state
  const [percentage, setPercentage] = useState(strategy?.percentage ? Number(strategy.percentage) / 100 : 500); // Default 5%
  const [tokenType, setTokenType] = useState<SavingsTokenType>(strategy?.savingsTokenType || SavingsTokenType.INPUT);
  const [specificToken, setSpecificToken] = useState<string>('');
  const [autoIncrement, setAutoIncrement] = useState(strategy?.autoIncrement ? Number(strategy.autoIncrement) / 100 : 0);
  const [maxPercentage, setMaxPercentage] = useState(strategy?.maxPercentage ? Number(strategy.maxPercentage) / 100 : 2000);
  const [roundUp, setRoundUp] = useState(strategy?.roundUpSavings || false);

  // Trigger animations on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Redirect to home if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return null;
  }

  const steps = [
    {
      title: "Let's Set Your Savings Rate",
      subtitle: "How much would you like to save from each transaction?",
      icon: "💰",
      component: (
        <div className="space-y-8">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-float">💰</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Savings Percentage</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              This percentage will be automatically saved from every swap you make. Start conservative and increase over time!
            </p>
          </div>

          <div className="max-w-lg mx-auto space-y-6">
            {/* Visual Percentage Display */}
            <div className="text-center">
              <div className="text-7xl font-black gradient-text mb-2">
                {(percentage / 100).toFixed(1)}%
              </div>
              <p className="text-gray-500">of every transaction</p>
            </div>

            {/* Interactive Slider */}
            <div className="space-y-4">
              <input
                type="range"
                min="50"
                max="2000"
                step="50"
                value={percentage}
                onChange={(e) => setPercentage(parseInt(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-primary-200 to-primary-400 rounded-lg appearance-none cursor-pointer slider"
              />
              
              {/* Quick Presets */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: '1%', value: 100 },
                  { label: '5%', value: 500 },
                  { label: '10%', value: 1000 },
                  { label: '15%', value: 1500 },
                ].map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setPercentage(preset.value)}
                    className={`p-3 rounded-xl text-sm font-semibold transition-all hover-lift ${
                      percentage === preset.value
                        ? 'bg-gradient-to-r from-primary-500 to-blue-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Preview */}
            <div className="glass rounded-2xl p-6 bg-white/60 backdrop-blur-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Preview Example</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Swap $1,000 USDC</span>
                  <span className="font-semibold">${((1000 * percentage) / 10000).toFixed(2)} saved</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Swap $100 ETH</span>
                  <span className="font-semibold">${((100 * percentage) / 10000).toFixed(2)} saved</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center text-primary-600">
                    <span className="font-semibold">Monthly estimate (20 swaps):</span>
                    <span className="font-bold">${((1100 * percentage * 20) / 10000).toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Choose What to Save",
      subtitle: "Which tokens should we save for you?",
      icon: "🪙",
      component: (
        <div className="space-y-8">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-float">🪙</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Token Savings Strategy</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Decide which tokens to accumulate in your savings. Each option has different benefits.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                type: SavingsTokenType.INPUT,
                title: 'Input Token',
                description: 'Save the token you\'re swapping from',
                example: 'Swapping USDC → ETH saves USDC',
                pros: ['Stable value preservation', 'Dollar-cost averaging'],
                icon: '📥',
                color: 'from-green-400 to-emerald-600'
              },
              {
                type: SavingsTokenType.OUTPUT,
                title: 'Output Token',
                description: 'Save the token you\'re swapping to',
                example: 'Swapping USDC → ETH saves ETH',
                pros: ['Exposure to price appreciation', 'Automatic DCA into target'],
                icon: '📤',
                color: 'from-blue-400 to-indigo-600'
              },
              {
                type: SavingsTokenType.SPECIFIC,
                title: 'Specific Token',
                description: 'Always save a specific token',
                example: 'Always save USDC regardless of swap',
                pros: ['Consistent accumulation', 'Predictable savings'],
                icon: '🎯',
                color: 'from-purple-400 to-pink-600'
              }
            ].map((option) => (
              <Card
                key={option.type}
                className={`p-6 cursor-pointer transition-all duration-300 hover-lift ${
                  tokenType === option.type
                    ? 'ring-2 ring-primary-500 shadow-xl scale-105'
                    : 'hover:shadow-lg'
                }`}
                onClick={() => setTokenType(option.type)}
              >
                <div className="text-center space-y-4">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${option.color} flex items-center justify-center text-2xl text-white shadow-lg`}>
                    {option.icon}
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{option.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{option.description}</p>
                    <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500 mb-4">
                      {option.example}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {option.pros.map((pro, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></div>
                        {pro}
                      </div>
                    ))}
                  </div>

                  {tokenType === option.type && (
                    <div className="text-primary-600 font-semibold text-sm">
                      ✓ Selected
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {tokenType === SavingsTokenType.SPECIFIC && (
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="Enter token address (0x...)"
                value={specificToken}
                onChange={(e) => setSpecificToken(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          )}
        </div>
      )
    },
    {
      title: "Advanced Features",
      subtitle: "Optional: Enhance your savings strategy",
      icon: "⚙️",
      component: (
        <div className="space-y-8">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-float">⚙️</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Power User Features</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              These features help you save more over time. All are optional and can be changed later.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            {/* Auto Increment */}
            <Card className="p-6 glass bg-white/60 backdrop-blur-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center text-white">
                    📈
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Auto-Increment Savings</h3>
                    <p className="text-sm text-gray-600">Gradually increase your savings rate over time</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">+{(autoIncrement / 100).toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">per month</div>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="200"
                step="25"
                value={autoIncrement}
                onChange={(e) => setAutoIncrement(parseInt(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-500 mb-4"
              />

              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  {autoIncrement > 0 
                    ? `Your savings rate will increase by ${(autoIncrement / 100).toFixed(1)}% monthly, up to ${(maxPercentage / 100).toFixed(1)}% maximum`
                    : 'Disabled - your savings rate will stay constant'
                  }
                </p>
              </div>
            </Card>

            {/* Max Percentage */}
            <Card className="p-6 glass bg-white/60 backdrop-blur-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center text-white">
                    🎯
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Maximum Savings Rate</h3>
                    <p className="text-sm text-gray-600">Cap your savings rate at this percentage</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">{(maxPercentage / 100).toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">maximum</div>
                </div>
              </div>

              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={maxPercentage}
                onChange={(e) => setMaxPercentage(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-500 mb-4"
              />

              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-800">
                  Your savings rate will never exceed {(maxPercentage / 100).toFixed(1)}%, even with auto-increment enabled
                </p>
              </div>
            </Card>

            {/* Round Up Savings */}
            <Card 
              className={`p-6 glass cursor-pointer transition-all hover-lift ${
                roundUp ? 'bg-green-50 border-green-200' : 'bg-white/60'
              } backdrop-blur-sm`}
              onClick={() => setRoundUp(!roundUp)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${
                    roundUp ? 'bg-gradient-to-br from-green-400 to-emerald-600' : 'bg-gray-400'
                  }`}>
                    {roundUp ? '✅' : '⬆️'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Round Up Savings</h3>
                    <p className="text-sm text-gray-600">Round savings amounts up to the nearest whole number</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className={`w-12 h-6 rounded-full transition-colors ${
                    roundUp ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                      roundUp ? 'translate-x-6' : ''
                    }`}></div>
                  </div>
                </div>
              </div>

              {roundUp && (
                <div className="mt-4 bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    Example: Saving $4.7 becomes $5.00. This helps you save a bit more while keeping round numbers.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "Review & Launch",
      subtitle: "Your savings strategy is ready!",
      icon: "🚀",
      component: (
        <div className="space-y-8">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-float">🚀</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Launch Your Savings!</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Review your strategy below. Once activated, you'll start saving automatically with every swap.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="p-8 glass bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Your Strategy Summary</h3>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-black text-primary-600 mb-1">
                    {(percentage / 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Savings Rate</div>
                </div>

                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600 mb-1">
                    {tokenType === SavingsTokenType.INPUT 
                      ? 'Input Token' 
                      : tokenType === SavingsTokenType.OUTPUT 
                        ? 'Output Token'
                        : 'Specific Token'
                    }
                  </div>
                  <div className="text-sm text-gray-600">Save As</div>
                </div>

                {autoIncrement > 0 && (
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-600 mb-1">
                      +{(autoIncrement / 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Monthly Increase</div>
                  </div>
                )}

                <div className="text-center">
                  <div className="text-lg font-semibold text-orange-600 mb-1">
                    {(maxPercentage / 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Maximum Rate</div>
                </div>
              </div>

              {/* Projected Savings */}
              <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6 mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">📊 Projected Monthly Savings</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">10 swaps × $500 avg:</span>
                    <span className="font-semibold">${((5000 * percentage) / 10000).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">20 swaps × $500 avg:</span>
                    <span className="font-semibold">${((10000 * percentage) / 10000).toFixed(0)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-primary-600">
                      <span className="font-semibold">Annual potential:</span>
                      <span className="font-bold">${((10000 * percentage * 12) / 10000).toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600 mb-6">
                <div className="text-green-500">✓</div>
                <span>{roundUp ? 'Round-up savings enabled' : 'Exact percentage savings'}</span>
              </div>

              <Button
                onClick={async () => {
                  try {
                    await setSavingStrategy({
                      percentage: BigInt(percentage),
                      autoIncrement: BigInt(autoIncrement),
                      maxPercentage: BigInt(maxPercentage),
                      roundUpSavings: roundUp,
                      savingsTokenType: tokenType,
                      specificSavingsToken: tokenType === SavingsTokenType.SPECIFIC && specificToken
                        ? specificToken as `0x${string}`
                        : undefined
                    });
                    router.push('/dashboard');
                  } catch (error) {
                    console.error('Error setting strategy:', error);
                  }
                }}
                variant="primary"
                size="lg"
                className="w-full bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 shadow-xl hover-lift text-xl py-4"
                isLoading={isPending}
                disabled={isPending}
              >
                {isPending ? 'Activating Strategy...' : '🚀 Activate My Savings Strategy'}
              </Button>
            </Card>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/50 to-purple-50/30">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-1s' }}></div>
      </div>

      <Layout>
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {strategy ? 'Update Strategy' : 'Setup Your Savings'}
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
          <div className="mb-12">
            {steps[currentStep].component}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : router.push('/')}
            >
              {currentStep > 0 ? '← Previous' : '← Home'}
            </Button>

            {currentStep < steps.length - 1 && (
              <Button
                variant="primary"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="hover-lift"
              >
                Continue →
              </Button>
            )}
          </div>
        </div>
      </Layout>
    </div>
  );
}