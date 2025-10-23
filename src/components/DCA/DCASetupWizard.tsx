'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Slider } from '@/components/ui/Slider';
import { Badge } from '../ui/Badge';
import { useDCA } from '@/hooks/useDCA';
import { parseEther, formatEther } from 'viem';
import { ArrowLeft, ArrowRight, Check, Zap, Shield, TrendingUp } from 'lucide-react';

interface DCASetupWizardProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

interface TokenOption {
  address: `0x${string}`;
  symbol: string;
  name: string;
  icon: string;
  reason?: string;
}

// Popular tokens for DCA
const POPULAR_TOKENS: TokenOption[] = [
  {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '💰',
    reason: 'Stable value, perfect for beginners'
  },
  {
    address: '0x4200000000000000000000000000000000000006', // WETH on Base
    symbol: 'ETH',
    name: 'Ethereum',
    icon: '🔷',
    reason: 'You already save in ETH'
  },
  {
    address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // USDbC on Base
    symbol: 'USDbC',
    name: 'USD Base Coin',
    icon: '🏦',
    reason: 'Native Base stablecoin'
  }
];

const FREQUENCY_OPTIONS = [
  { value: 'swap', label: 'Every swap', description: 'Execute DCA whenever you make a swap' },
  { value: 'daily', label: 'Daily', description: 'Execute DCA once per day' },
  { value: 'weekly', label: 'Weekly', description: 'Execute DCA once per week' },
  { value: 'balance', label: 'When balance > $50', description: 'Execute when savings balance exceeds threshold' }
];

export function DCASetupWizard({ onComplete, onCancel }: DCASetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedToken, setSelectedToken] = useState<TokenOption | null>(null);
  const [amount, setAmount] = useState(25);
  const [frequency, setFrequency] = useState('swap');
  const [slippage, setSlippage] = useState(0.5);
  const [customTokenAddress, setCustomTokenAddress] = useState('');

  const { enableDCA, isEnabling, contractAddress } = useDCA();

  const totalSteps = 3;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!selectedToken) return;

    try {
      await enableDCA({
        targetToken: selectedToken.address,
        minAmount: amount.toString(),
        maxSlippage: slippage * 100 // Convert to basis points
      });
      
      onComplete?.();
    } catch (error) {
      console.error('Failed to enable DCA:', error);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl mb-4">🎯</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Investment Target</h2>
        <p className="text-gray-600">What token would you like to buy automatically?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {POPULAR_TOKENS.map((token) => (
          <Card
            key={token.address}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedToken?.address === token.address
                ? 'ring-2 ring-blue-500 bg-blue-50'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setSelectedToken(token)}
          >
            <CardContent className="p-4 text-center">
              <div className="text-4xl mb-2">{token.icon}</div>
              <h3 className="font-semibold text-gray-900">{token.symbol}</h3>
              <p className="text-sm text-gray-600 mb-2">{token.name}</p>
              {token.reason && (
                <Badge variant="default">
                  {token.reason}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or add custom token</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customToken">Token Address</Label>
          <Input
            id="customToken"
            placeholder="0x..."
            value={customTokenAddress}
            onChange={(e) => setCustomTokenAddress(e.target.value)}
          />
          {customTokenAddress && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // In a real implementation, you'd fetch token metadata
                setSelectedToken({
                  address: customTokenAddress as `0x${string}`,
                  symbol: 'CUSTOM',
                  name: 'Custom Token',
                  icon: '🔍'
                });
              }}
            >
              Add Custom Token
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl mb-4">💵</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Set Your Investment Amount</h2>
        <p className="text-gray-600">How much would you like to invest each time?</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="amount">Amount: ${amount}</Label>
          <Slider
            id="amount"
            min={5}
            max={500}
            step={5}
            value={[amount]}
            onValueChange={(value: number[]) => setAmount(value[0])}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>$5</span>
            <span>$500</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[10, 25, 50, 100].map((preset) => (
            <Button
              key={preset}
              variant={amount === preset ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAmount(preset)}
            >
              ${preset}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          <Label>Frequency</Label>
          <div className="space-y-2">
            {FREQUENCY_OPTIONS.map((option) => (
              <Card
                key={option.value}
                className={`cursor-pointer transition-all duration-200 ${
                  frequency === option.value
                    ? 'ring-2 ring-blue-500 bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setFrequency(option.value)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      frequency === option.value
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {frequency === option.value && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{option.label}</h4>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="slippage">Slippage Tolerance: {slippage}%</Label>
          <Slider
            id="slippage"
            min={0.1}
            max={5}
            step={0.1}
            value={[slippage]}
            onValueChange={(value: number[]) => setSlippage(value[0])}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>0.1%</span>
            <span>5%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl mb-4">✨</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Auto-Invest Setup</h2>
        <p className="text-gray-600">Everything looks good? Let&apos;s activate it!</p>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Check className="w-5 h-5 text-green-600" />
            <span>Your DCA Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Target Token:</span>
              <div className="font-medium flex items-center space-x-2">
                <span>{selectedToken?.icon}</span>
                <span>{selectedToken?.symbol}</span>
              </div>
            </div>
            <div>
              <span className="text-gray-600">Amount:</span>
              <div className="font-medium">${amount} per execution</div>
            </div>
            <div>
              <span className="text-gray-600">Frequency:</span>
              <div className="font-medium">
                {FREQUENCY_OPTIONS.find(f => f.value === frequency)?.label}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Slippage:</span>
              <div className="font-medium">{slippage}%</div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Gas Cost:</span>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-600">$0 (Gas-free!)</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600">Next Execution:</span>
              <span className="font-medium">After your next swap</span>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedToken !== null;
      case 2:
        return amount > 0;
      case 3:
        return selectedToken !== null;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Auto-Invest Setup</span>
            </CardTitle>
            <Badge variant="secondary">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {renderCurrentStep()}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? onCancel : handleBack}
              disabled={isEnabling}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!canProceed() || isEnabling}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                {isEnabling ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Start Auto-Investing
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}