'use client';

import { Layout } from '@/components/Layout';
import { SavingsOverview } from '@/components/Dashboard/SavingsOverview';
import { TokenBalanceCard } from '@/components/Dashboard/TokenBalanceCard';
import { GoalProgress } from '@/components/Dashboard/GoalProgress';
import { RecentActivity } from '@/components/Dashboard/RecentActivity';
import { GasSavingsCounter } from '@/components/Dashboard/GasSavingsCounter';
import { useSavingsBalance } from '@/hooks/useSavingsBalance';
import { useSavingsStrategy } from '@/hooks/useSavingsStrategy';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatUnits } from 'viem';
import { SavingsTokenType } from '@/contracts/types';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const savingsBalance = useSavingsBalance();
  const { hasStrategy, strategy, isLoading: isLoadingStrategy, contractAddress } = useSavingsStrategy();
  const [isVisible, setIsVisible] = useState(false);

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

  // Optional: Allow viewing dashboard without strategy
  // Users can explore the interface before configuring
  // useEffect(() => {
  //   if (!isLoadingStrategy && !hasStrategy) {
  //     router.push('/configure');
  //   }
  // }, [hasStrategy, isLoadingStrategy, router]);

  if (!isConnected || isLoadingStrategy) {
    return null;
  }

  // Show contract deployment status
  if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/50 to-purple-50/30 flex items-center justify-center">
          <Card className="max-w-md mx-auto p-8 text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contracts Not Deployed</h2>
            <p className="text-gray-600 mb-6">
              The OneSeed smart contracts haven't been deployed to this network yet.
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                className="w-full"
              >
                ← Back to Home
              </Button>
              <div className="text-sm text-gray-500">
                <p>To deploy contracts:</p>
                <p>1. Run: <code className="bg-gray-100 px-2 py-1 rounded">npx hardhat run scripts/deploy-contracts.js --network baseSepolia</code></p>
                <p>2. Update contract addresses in <code className="bg-gray-100 px-2 py-1 rounded">src/contracts/addresses.ts</code></p>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  // Calculate strategy-based metrics
  const strategyPercentage = strategy ? Number(strategy.percentage) / 100 : 0;
  const hasAutoIncrement = strategy ? Number(strategy.autoIncrement) > 0 : false;
  const maxPercentage = strategy ? Number(strategy.maxPercentage) / 100 : 0;

  // Mock data for now - will be replaced with real contract data
  const mockTokenBalances = [
    { token: 'USDC', balance: BigInt('1000000000'), symbol: 'USDC', decimals: 6 },
    { token: 'ETH', balance: BigInt('500000000000000000'), symbol: 'ETH', decimals: 18 }
  ];
  const mockTotalBalance = mockTokenBalances.reduce((sum, token) => sum + token.balance, BigInt(0));
  const savingsTokenTypeLabel = strategy 
    ? strategy.savingsTokenType === SavingsTokenType.INPUT 
      ? 'Input Token' 
      : strategy.savingsTokenType === SavingsTokenType.OUTPUT 
        ? 'Output Token'
        : 'Specific Token'
    : 'Not Set';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/50 to-purple-50/30">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-1s' }}></div>
      </div>

      <Layout>
        <div className={`space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">
                Your <span className="gradient-text">Savings</span> Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                {strategyPercentage > 0 
                  ? `Saving ${strategyPercentage}% of every transaction`
                  : 'Your automated savings overview'
                }
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/withdraw">
                <Button variant="ghost" size="sm" className="hover-lift">
                  💰 Withdraw
                </Button>
              </Link>
              <Link href="/configure">
                <Button variant="secondary" size="sm" className="hover-lift">
                  ⚙️ Settings
                </Button>
              </Link>
            </div>
          </div>

          {/* Strategy Overview Cards */}
          {strategy && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 hover-lift glass bg-white/80 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">📊</div>
                  <div>
                    <div className="text-xl font-bold text-primary-600">{strategyPercentage}%</div>
                    <div className="text-xs text-gray-500 font-medium">Savings Rate</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 hover-lift glass bg-white/80 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{hasAutoIncrement ? '📈' : '📌'}</div>
                  <div>
                    <div className="text-xl font-bold text-blue-600">
                      {hasAutoIncrement ? `+${Number(strategy.autoIncrement) / 100}%` : 'Fixed'}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">Auto Increment</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 hover-lift glass bg-white/80 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <div className="text-xl font-bold text-purple-600">{maxPercentage}%</div>
                    <div className="text-xs text-gray-500 font-medium">Max Rate</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 hover-lift glass bg-white/80 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🪙</div>
                  <div>
                    <div className="text-sm font-bold text-orange-600">{savingsTokenTypeLabel}</div>
                    <div className="text-xs text-gray-500 font-medium">Save As</div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Main Overview */}
          <div className="transform transition-all duration-1000 delay-200">
            <SavingsOverview 
              totalBalance={mockTotalBalance} 
              tokenCount={mockTokenBalances.length} 
              isLoading={false} 
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Savings Portfolio */}
            <div className="xl:col-span-2 space-y-8">
              
              {/* Token Balances */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Your Portfolio</h2>
                  {mockTokenBalances.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      {mockTokenBalances.length} Token{mockTokenBalances.length !== 1 ? 's' : ''} Active
                    </div>
                  )}
                </div>
                
                {false ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-32 skeleton rounded-xl" />
                    ))}
                  </div>
                ) : mockTokenBalances.length === 0 ? (
                  <Card className="p-12 text-center glass bg-white/60 backdrop-blur-sm">
                    <div className="text-6xl mb-4 animate-float">🌱</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Plant Your First Seed?</h3>
                    <p className="text-gray-600 mb-6">
                      Make your first swap to begin growing your savings automatically with your {strategyPercentage}% strategy
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button variant="primary" className="bg-gradient-to-r from-primary-500 to-blue-600 hover-lift">
                        Start Trading →
                      </Button>
                      <Link href="/configure">
                        <Button variant="ghost" className="hover-lift">
                          Adjust Strategy
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mockTokenBalances.map((balance, index) => (
                      <div key={balance.token} className="transform transition-all duration-700" style={{ animationDelay: `${400 + index * 100}ms` }}>
                        <TokenBalanceCard balance={balance} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Savings Strategy Details */}
              {strategy && tokenBalances.length > 0 && (
                <Card className="p-8 glass bg-white/60 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Strategy Performance</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">Current Settings</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Savings Rate:</span>
                          <span className="font-semibold">{strategyPercentage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Round Up:</span>
                          <span className="font-semibold">{strategy.roundUpSavings ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Auto Increment:</span>
                          <span className="font-semibold">
                            {hasAutoIncrement ? `+${Number(strategy.autoIncrement) / 100}%` : 'Disabled'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">Portfolio Stats</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Tokens:</span>
                          <span className="font-semibold">{mockTokenBalances.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Largest Balance:</span>
                          <span className="font-semibold">
                            {mockTokenBalances.length > 0 
                              ? formatUnits(
                                  mockTokenBalances.reduce((max, b) => b.balance > max ? b.balance : max, BigInt(0)), 
                                  18
                                ).substring(0, 8)
                              : '0'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Save Token Type:</span>
                          <span className="font-semibold text-sm">{savingsTokenTypeLabel}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column - Goals & Actions */}
            <div className="space-y-6">
              
              {/* Gas Savings Counter */}
              <div className="transform transition-all duration-1000 delay-500">
                <GasSavingsCounter 
                  transactionCount={5} // Mock data - will be real in production
                  averageGasPrice={0.001}
                />
              </div>
              
              {/* Goal Progress - Only show if user has savings */}
              {mockTokenBalances.length > 0 && (
                <div className="transform transition-all duration-1000 delay-600">
                  <GoalProgress
                    currentAmount={mockTotalBalance}
                    goalAmount={BigInt(0)} // No hardcoded goals
                    tokenSymbol="tokens"
                  />
                </div>
              )}

              {/* Strategy Preview Tool */}
              <Card className="p-6 glass bg-white/60 backdrop-blur-sm transform transition-all duration-1000 delay-700">
                <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Strategy Preview</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview Swap Amount
                    </label>
                    <input
                      type="number"
                      placeholder="1000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">You'll save:</span>
                      <span className="font-semibold text-primary-600">
                        {strategyPercentage > 0 ? `${strategyPercentage}%` : 'Configure strategy first'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Recent Activity */}
              <div className="transform transition-all duration-1000 delay-800">
                <RecentActivity activities={[]} />
              </div>

              {/* Quick Actions */}
              <Card className="p-6 glass bg-white/60 backdrop-blur-sm transform transition-all duration-1000 delay-900">
                <h3 className="text-lg font-bold text-gray-900 mb-4">⚡ Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/configure" className="block">
                    <Button variant="ghost" size="sm" className="w-full hover-lift text-left justify-start">
                      <div>
                        <div className="font-medium">⚙️ Adjust Strategy</div>
                        <div className="text-xs text-gray-500">
                          Current: {strategyPercentage}% savings rate
                        </div>
                      </div>
                    </Button>
                  </Link>
                  
                  {tokenBalances.length > 0 && (
                    <Link href="/withdraw" className="block">
                      <Button variant="ghost" size="sm" className="w-full hover-lift text-left justify-start">
                        <div>
                          <div className="font-medium">💰 Withdraw Funds</div>
                          <div className="text-xs text-gray-500">
                            {tokenBalances.length} token{tokenBalances.length !== 1 ? 's' : ''} available
                          </div>
                        </div>
                      </Button>
                    </Link>
                  )}

                  <Button variant="ghost" size="sm" className="w-full hover-lift text-left justify-start">
                    <div>
                      <div className="font-medium">📊 Export Data</div>
                      <div className="text-xs text-gray-500">Download savings history</div>
                    </div>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}