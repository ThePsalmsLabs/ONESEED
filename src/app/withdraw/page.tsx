'use client';

import { Layout } from '@/components/Layout';
import { useAccount } from 'wagmi';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSavingsBalance } from '@/hooks/useSavingsBalance';
import { useWithdraw } from '@/hooks/useWithdraw';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatUnits, parseUnits } from 'viem';
import Link from 'next/link';

export default function WithdrawPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isConnected } = useAccount();
  const { tokenBalances, isLoading: isLoadingBalances } = useSavingsBalance();
  const { withdraw, useCalculateWithdrawal, isPending } = useWithdraw();

  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Form state
  const [selectedToken, setSelectedToken] = useState<`0x${string}` | ''>('');
  const [amount, setAmount] = useState('');
  const [forceWithdraw, setForceWithdraw] = useState(false);

  const selectedBalance = tokenBalances?.find(b => b.token === selectedToken);
  const amountBigInt = amount ? parseUnits(amount, selectedBalance?.decimals || 18) : BigInt(0);

  const { preview, isLoading: isCalculating } = useCalculateWithdrawal(
    selectedToken || undefined,
    amountBigInt
  );

  // Trigger animations on mount
  useEffect(() => {
    setIsVisible(true);
    // Pre-select token from URL params if available
    const tokenParam = searchParams.get('token');
    if (tokenParam && tokenBalances?.some(b => b.token === tokenParam)) {
      setSelectedToken(tokenParam as `0x${string}`);
      setCurrentStep(1); // Skip to amount selection
    }
  }, [searchParams, tokenBalances]);

  // Redirect to home if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return null;
  }

  const handleWithdraw = async () => {
    if (!selectedToken || !amount) return;

    try {
      await withdraw(selectedToken, amountBigInt, forceWithdraw);
      setCurrentStep(3); // Success step
    } catch (error) {
      console.error('Withdrawal error:', error);
    }
  };

  const setMaxAmount = () => {
    if (selectedBalance) {
      setAmount(formatUnits(selectedBalance.amount, selectedBalance.decimals || 18));
    }
  };

  const hasPenalty = preview && preview.penalty > BigInt(0);
  const penaltyAmount = preview ? formatUnits(preview.penalty, selectedBalance?.decimals || 18) : '0';
  const actualAmount = preview ? formatUnits(preview.actualAmount, selectedBalance?.decimals || 18) : '0';

  if (isLoadingBalances) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 skeleton rounded-xl" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!tokenBalances || tokenBalances.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/50 to-purple-50/30">
        <Layout>
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="text-8xl mb-8 animate-float">🌱</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">No Savings Yet</h1>
            <p className="text-xl text-gray-600 mb-8">
              You haven't saved any tokens yet. Start saving to build your financial garden!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/configure">
                <Button variant="primary" size="lg" className="bg-gradient-to-r from-primary-500 to-blue-600 hover-lift">
                  Configure Savings →
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="lg" className="hover-lift">
                  ← Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </Layout>
      </div>
    );
  }

  const steps = [
    {
      title: "Select Token to Withdraw",
      component: (
        <div className="space-y-8">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-float">💰</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Token</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Select which token you'd like to withdraw from your savings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {tokenBalances.map((balance, index) => (
              <Card
                key={balance.token}
                className={`p-6 cursor-pointer transition-all duration-300 hover-lift transform ${
                  selectedToken === balance.token
                    ? 'ring-2 ring-primary-500 shadow-xl scale-105'
                    : 'hover:shadow-lg'
                } animate-slide-up`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedToken(balance.token)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {balance.symbol?.charAt(0) || '?'}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {balance.symbol || `${balance.token.slice(0, 6)}...${balance.token.slice(-4)}`}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{balance.token.slice(0, 10)}...</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary-600">
                        {formatUnits(balance.amount, balance.decimals || 18).substring(0, 8)}
                      </span>
                      <span className="text-sm text-gray-600">tokens</span>
                    </div>
                  </div>

                  {selectedToken === balance.token && (
                    <div className="text-primary-600 text-2xl">✓</div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Enter Withdrawal Amount",
      component: (
        <div className="space-y-8">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-float">📊</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Much to Withdraw?</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Enter the amount you want to withdraw from your savings
            </p>
          </div>

          {selectedBalance && (
            <div className="max-w-lg mx-auto space-y-6">
              {/* Token Display */}
              <Card className="p-6 glass bg-white/80 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold">
                    {selectedBalance.symbol?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedBalance.symbol || 'Selected Token'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Available: {formatUnits(selectedBalance.amount, selectedBalance.decimals || 18).substring(0, 10)} tokens
                    </p>
                  </div>
                </div>
              </Card>

              {/* Amount Input */}
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-6 py-4 text-3xl text-center border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-semibold"
                  />
                  <button
                    type="button"
                    onClick={setMaxAmount}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg text-sm font-semibold hover:bg-primary-200 transition-colors"
                  >
                    MAX
                  </button>
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-3">
                  {['25%', '50%', '75%', '100%'].map((percent) => (
                    <button
                      key={percent}
                      type="button"
                      onClick={() => {
                        const percentage = parseInt(percent) / 100;
                        const calculatedAmount = formatUnits(
                          selectedBalance.amount * BigInt(Math.floor(percentage * 100)) / BigInt(100),
                          selectedBalance.decimals || 18
                        );
                        setAmount(calculatedAmount);
                      }}
                      className="p-3 bg-white text-gray-700 border border-gray-200 rounded-xl text-sm font-semibold hover:border-primary-300 hover:bg-primary-50 transition-all hover-lift"
                    >
                      {percent}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview */}
              {amount && (
                <Card className="p-6 glass bg-white/60 backdrop-blur-sm animate-scale-in">
                  <h3 className="font-semibold text-gray-900 mb-4">Withdrawal Preview</h3>
                  
                  {isCalculating ? (
                    <div className="space-y-3">
                      <div className="h-4 skeleton rounded w-3/4"></div>
                      <div className="h-4 skeleton rounded w-1/2"></div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Requested Amount:</span>
                        <span className="font-semibold">{amount} tokens</span>
                      </div>
                      
                      {hasPenalty && (
                        <div className="flex justify-between items-center text-orange-600">
                          <span>Early Withdrawal Penalty:</span>
                          <span className="font-semibold">-{penaltyAmount}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center pt-3 border-t">
                        <span className="font-semibold text-gray-900">You'll Receive:</span>
                        <span className="font-bold text-primary-600 text-lg">{actualAmount} tokens</span>
                      </div>
                    </div>
                  )}
                </Card>
              )}

              {/* Penalty Warning */}
              {hasPenalty && (
                <Card className="p-6 bg-orange-50 border-orange-200 animate-scale-in">
                  <div className="flex gap-3">
                    <div className="text-2xl">⚠️</div>
                    <div>
                      <h3 className="font-semibold text-orange-900 mb-2">Early Withdrawal Penalty</h3>
                      <p className="text-sm text-orange-800 mb-4">
                        This withdrawal is subject to a penalty because your savings are still within the timelock period. 
                        You can avoid this penalty by waiting for the timelock to expire.
                      </p>
                      
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={forceWithdraw}
                          onChange={(e) => setForceWithdraw(e.target.checked)}
                          className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-orange-900">
                          I understand and accept the penalty
                        </span>
                      </label>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      )
    },
    {
      title: "Confirm Withdrawal",
      component: (
        <div className="space-y-8">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-float">✅</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Confirm Your Withdrawal</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Review the details below and confirm your withdrawal
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <Card className="p-8 glass bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Withdrawal Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Token:</span>
                  <span className="font-semibold">
                    {selectedBalance?.symbol || 'Unknown'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Requested:</span>
                  <span className="font-semibold">{amount} tokens</span>
                </div>
                
                {hasPenalty && (
                  <>
                    <div className="flex justify-between items-center text-orange-600">
                      <span>Penalty:</span>
                      <span className="font-semibold">-{penaltyAmount}</span>
                    </div>
                    <div className="flex justify-between items-center text-orange-600">
                      <span>Penalty Rate:</span>
                      <span className="font-semibold">{preview?.penaltyPercentage.toFixed(1)}%</span>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="font-bold text-gray-900">Final Amount:</span>
                  <span className="font-bold text-primary-600 text-xl">{actualAmount} tokens</span>
                </div>
              </div>

              <Button
                onClick={handleWithdraw}
                variant="primary"
                size="lg"
                className="w-full bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 shadow-xl hover-lift text-xl py-4"
                isLoading={isPending}
                disabled={isPending || (hasPenalty && !forceWithdraw)}
              >
                {isPending ? 'Processing Withdrawal...' : '💰 Confirm Withdrawal'}
              </Button>

              {hasPenalty && !forceWithdraw && (
                <p className="text-sm text-orange-600 text-center mt-3">
                  Please accept the penalty terms to proceed
                </p>
              )}
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "Withdrawal Complete",
      component: (
        <div className="space-y-8">
          <div className="text-center">
            <div className="text-8xl mb-8 animate-float">🎉</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Withdrawal Successful!</h2>
            <p className="text-xl text-gray-600 mb-8">
              Your tokens have been withdrawn to your wallet
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <Card className="p-8 glass bg-white/80 backdrop-blur-sm text-center">
              <div className="text-6xl font-bold text-primary-600 mb-2">{actualAmount}</div>
              <div className="text-lg text-gray-600 mb-8">
                {selectedBalance?.symbol || 'tokens'} withdrawn successfully
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="primary"
                  onClick={() => {
                    setCurrentStep(0);
                    setSelectedToken('');
                    setAmount('');
                    setForceWithdraw(false);
                  }}
                  className="flex-1 hover-lift"
                >
                  Make Another Withdrawal
                </Button>
                <Link href="/dashboard" className="flex-1">
                  <Button variant="ghost" className="w-full hover-lift">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
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
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Withdraw Savings
              </h1>
              {currentStep < 3 && (
                <div className="text-sm text-gray-500">
                  Step {currentStep + 1} of 3
                </div>
              )}
            </div>
            
            {/* Progress Bar */}
            {currentStep < 3 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / 3) * 100}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Step Content */}
          <div className="mb-12">
            {steps[currentStep].component}
          </div>

          {/* Navigation */}
          {currentStep < 3 && (
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={() => {
                  if (currentStep > 0) {
                    setCurrentStep(currentStep - 1);
                  } else {
                    router.push('/dashboard');
                  }
                }}
              >
                {currentStep > 0 ? '← Previous' : '← Dashboard'}
              </Button>

              {currentStep < 2 && (
                <Button
                  variant="primary"
                  onClick={() => {
                    if (currentStep === 0 && selectedToken) {
                      setCurrentStep(1);
                    } else if (currentStep === 1 && amount && (!hasPenalty || forceWithdraw)) {
                      setCurrentStep(2);
                    }
                  }}
                  disabled={
                    (currentStep === 0 && !selectedToken) ||
                    (currentStep === 1 && (!amount || (hasPenalty && !forceWithdraw)))
                  }
                  className="hover-lift"
                >
                  Continue →
                </Button>
              )}
            </div>
          )}
        </div>
      </Layout>
    </div>
  );
}