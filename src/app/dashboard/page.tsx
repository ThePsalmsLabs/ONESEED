'use client';

import { Layout } from '@/components/Layout';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { QuickActions } from '@/components/Dashboard/QuickActions';
import { SavingsRadialProgress } from '@/components/Dashboard/SavingsRadialProgress';
import { ActivityTimeline } from '@/components/Dashboard/ActivityTimeline';
import { useSavingsBalance } from '@/hooks/useSavingsBalance';
import { useSavingsStrategy } from '@/hooks/useSavingsStrategy';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatUnits } from 'viem';

export default function DashboardPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const savingsBalance = useSavingsBalance();
  const { hasStrategy, strategy, isLoading: isLoadingStrategy } = useSavingsStrategy();

  // Redirect to home if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  if (!isConnected || isLoadingStrategy) {
    return null;
  }

  // Calculate metrics
  const strategyPercentage = strategy ? Number(strategy.percentage) / 100 : 0;
  const totalSaved = savingsBalance.totalBalance 
    ? parseFloat(formatUnits(savingsBalance.totalBalance, 18))
    : 0;
  const savingsGoal = 10000; // Example goal, can be made configurable
  
  // Mock activity data (replace with real data from blockchain)
  const recentActivities = [
    {
      id: '1',
      type: 'swap' as const,
      description: 'Swapped ETH for USDC',
      amount: '+$12.50',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: 'success' as const,
      txHash: '0x...',
    },
    {
      id: '2',
      type: 'save' as const,
      description: 'Auto-saved from transaction',
      amount: '+$5.25',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: 'success' as const,
    },
    {
      id: '3',
      type: 'config' as const,
      description: 'Updated savings strategy',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      status: 'success' as const,
    },
  ];

  // Trend data for sparklines
  const savingsTrend = [30, 45, 35, 55, 40, 65, 50, 75, 60, 80, 70, 85];
  const swapsTrend = [10, 15, 12, 18, 22, 19, 25, 28, 23, 30, 27, 32];

  return (
    <div className="min-h-screen bg-bg-primary relative">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-80 h-80 bg-accent-purple/10 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent-cyan/10 rounded-full blur-3xl"
          animate={{
            x: [-30, 30, -30],
            y: [-30, 30, -30],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <Layout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Hero Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl font-black text-text-primary mb-2">
                Your <span className="gradient-text">Savings</span> Hub
              </h1>
              <p className="text-text-secondary text-lg">
                {strategyPercentage > 0 
                  ? `Saving ${strategyPercentage}% of every swap • Growing automatically`
                  : 'Configure your strategy to start saving'
                }
              </p>
            </motion.div>

            {/* Strategy Status Badge */}
            {hasStrategy && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="glass-solid-dark rounded-full px-6 py-3 border border-primary-400/30 flex items-center gap-3"
              >
                <motion.div
                  className="w-3 h-3 bg-primary-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <span className="text-sm font-medium text-primary-400">
                  Strategy Active
                </span>
              </motion.div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Saved"
              value={`$${totalSaved.toFixed(2)}`}
              change={{ value: '+12.5%', positive: true }}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              trend={savingsTrend}
              isLoading={isLoadingStrategy}
            />

            <StatsCard
              title="This Month"
              value="$287.50"
              change={{ value: '+8.2%', positive: true }}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              isLoading={isLoadingStrategy}
            />

            <StatsCard
              title="Total Swaps"
              value="127"
              change={{ value: '+5', positive: true }}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              }
              trend={swapsTrend}
              isLoading={isLoadingStrategy}
            />

            <StatsCard
              title="Gas Saved"
              value="$45.32"
              change={{ value: '+$12.10', positive: true }}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              isLoading={isLoadingStrategy}
            />
          </div>

          {/* Quick Actions */}
          <QuickActions />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Savings Progress - Spans 1 column */}
            <div className="lg:col-span-1">
              <SavingsRadialProgress
                current={totalSaved}
                goal={savingsGoal}
                currency="$"
                isLoading={isLoadingStrategy}
              />
            </div>

            {/* Activity Timeline - Spans 2 columns */}
            <div className="lg:col-span-2">
              <ActivityTimeline
                activities={recentActivities}
                isLoading={isLoadingStrategy}
              />
            </div>
          </div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strategy Details */}
            <motion.div
              className="glass-solid-dark rounded-2xl p-6 border border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Strategy Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-muted">Savings Rate</span>
                  <span className="text-sm font-semibold text-text-primary">
                    {strategyPercentage}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-muted">Auto Increment</span>
                  <span className="text-sm font-semibold text-text-primary">
                    {strategy?.autoIncrement ? `${Number(strategy.autoIncrement) / 100}%` : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-muted">Max Rate</span>
                  <span className="text-sm font-semibold text-text-primary">
                    {strategy?.maxPercentage ? `${Number(strategy.maxPercentage) / 100}%` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-muted">Round Up</span>
                  <span className="text-sm font-semibold text-text-primary">
                    {strategy?.roundUpSavings ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Achievements / Milestones */}
            <motion.div
              className="glass-solid-dark rounded-2xl p-6 border border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Milestones
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'First Swap', unlocked: true, icon: '🎉' },
                  { label: 'Save $100', unlocked: totalSaved >= 100, icon: '💯' },
                  { label: 'Save $500', unlocked: totalSaved >= 500, icon: '🚀' },
                  { label: 'Save $1000', unlocked: totalSaved >= 1000, icon: '🏆' },
                ].map((milestone) => (
                  <div
                    key={milestone.label}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      milestone.unlocked
                        ? 'bg-primary-400/10 border border-primary-400/20'
                        : 'bg-bg-tertiary/30 border border-border opacity-50'
                    }`}
                  >
                    <span className="text-2xl">{milestone.icon}</span>
                    <span className="text-sm font-medium text-text-primary">
                      {milestone.label}
                    </span>
                    {milestone.unlocked && (
                      <svg
                        className="w-5 h-5 text-primary-400 ml-auto"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </Layout>
    </div>
  );
}
