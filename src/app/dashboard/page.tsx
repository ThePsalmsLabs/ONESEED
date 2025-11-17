'use client';

import { Layout } from '@/components/Layout';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { QuickActions } from '@/components/Dashboard/QuickActions';
import { SavingsRadialProgress } from '@/components/Dashboard/SavingsRadialProgress';
import { ActivityTimeline } from '@/components/Dashboard/ActivityTimeline';
import { SavingsGoalSetter } from '@/components/Dashboard/SavingsGoalSetter';
import { useSavingsBalance } from '@/hooks/useSavingsBalance';
import { useSavingsStrategy } from '@/hooks/useSavingsStrategy';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useSavingsTrend } from '@/hooks/useSavingsTrend';
import { useSavingsGoal } from '@/hooks/useSavingsGoal';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { formatUnits } from 'viem';

export default function DashboardPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const savingsBalance = useSavingsBalance();
  const { hasStrategy, strategy, isLoading: isLoadingStrategy } = useSavingsStrategy();
  const { activities, isLoading: isLoadingActivities, refetch: refetchActivities } = useActivityFeed();
  const { goal, setSavingsGoal, isLoading: isLoadingGoal } = useSavingsGoal();
  const { thisMonth, thisMonthChange, totalSwaps, totalSwapsChange, gasSaved, gasSavedChange, isLoading: isLoadingStats } = useDashboardStats();
  const { savingsTrend, swapsTrend } = useSavingsTrend();

  // Redirect to home if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  // Map activity feed to ActivityTimeline format
  const recentActivities = useMemo(() => {
    return activities.slice(0, 10).map(activity => ({
      id: activity.id,
      type: activity.type === 'strategy' ? 'config' as const : 
            activity.type === 'dca' ? 'swap' as const : 
            activity.type as 'save' | 'withdraw' | 'config' | 'swap',
      description: activity.description,
      amount: activity.type === 'save' ? `+$${parseFloat(activity.amountFormatted).toFixed(2)}` : undefined,
      timestamp: new Date(activity.timestamp * 1000),
      status: activity.status,
      txHash: activity.hash
    }));
  }, [activities]);

  if (!isConnected || isLoadingStrategy) {
    return null;
  }

  // Calculate metrics
  const strategyPercentage = strategy ? Number(strategy.percentage) / 100 : 0;
  const totalSaved = savingsBalance.totalBalance 
    ? parseFloat(formatUnits(savingsBalance.totalBalance, 18))
    : 0;

  const isLoading = isLoadingStrategy || isLoadingActivities || isLoadingStats;

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

            {/* Right side buttons */}
            <div className="flex items-center gap-3">
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                onClick={() => refetchActivities()}
                disabled={isLoading}
                className="glass-solid-dark rounded-full px-4 py-2 border border-border hover:border-primary-400/30 transition-colors flex items-center gap-2"
              >
                <svg 
                  className={`w-4 h-4 text-primary-400 ${isLoading ? 'animate-spin' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm font-medium text-text-secondary">
                  Refresh
                </span>
              </motion.button>

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
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Saved"
              value={`$${totalSaved.toFixed(2)}`}
              change={{ value: `$${thisMonth.toFixed(2)} this month`, positive: true }}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              trend={savingsTrend}
              isLoading={isLoading}
            />

            <StatsCard
              title="This Month"
              value={`$${thisMonth.toFixed(2)}`}
              change={thisMonthChange}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              isLoading={isLoading}
            />

            <StatsCard
              title="Total Swaps"
              value={totalSwaps.toString()}
              change={totalSwapsChange}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              }
              trend={swapsTrend}
              isLoading={isLoading}
            />

            <StatsCard
              title="Gas Saved"
              value={`$${gasSaved.toFixed(2)}`}
              change={gasSavedChange}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              isLoading={isLoading}
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
                goal={goal}
                currency="$"
                isLoading={isLoading}
              />
              <div className="mt-4">
                <SavingsGoalSetter 
                  goal={goal} 
                  onUpdate={setSavingsGoal}
                  isLoading={isLoadingGoal}
                />
              </div>
            </div>

            {/* Activity Timeline - Spans 2 columns */}
            <div className="lg:col-span-2">
              <ActivityTimeline
                activities={recentActivities}
                isLoading={isLoading}
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
