'use client';

import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useSavingsBalance } from './useSavingsBalance';
import { useDCA } from './useDCA';
import { useDailySavings } from './useDailySavings';
import { formatUnits } from 'viem';

export interface PortfolioData {
  totalValue: number;
  totalSavings: number;
  totalDCA: number;
  totalWithdrawn: number;
  netGrowth: number;
  growthPercentage: number;
  activeStrategies: number;
  completedGoals: number;
}

export interface TokenAllocation {
  token: string;
  symbol: string;
  amount: number;
  value: number;
  percentage: number;
  color: string;
}

export interface PerformanceData {
  date: string;
  value: number;
  savings: number;
  dca: number;
  growth: number;
}

const TOKEN_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F43F5E'];

export function usePortfolio() {
  const { address } = useAccount();
  const { tokenBalances, totalBalance, isLoading: isLoadingSavings } = useSavingsBalance();
  const { config: dcaConfig, history: dcaHistory, isLoadingConfig: isLoadingDCA } = useDCA();
  const { status: dailySavingsStatus, isLoadingStatus: isLoadingDaily } = useDailySavings();

  // Calculate portfolio metrics
  const portfolioData: PortfolioData = useMemo(() => {
    // Calculate total savings value (would need price data for accurate USD value)
    const totalSavings = Number(formatUnits(totalBalance, 18));

    // Calculate total DCA volume from history
    const totalDCA = dcaHistory?.reduce((sum, exec) => {
      return sum + Number(formatUnits(exec.amount, 18));
    }, 0) || 0;

    // Daily savings current amount
    const dailySavingsAmount = dailySavingsStatus
      ? Number(formatUnits(dailySavingsStatus.currentAmount, 18))
      : 0;

    // Total portfolio value (savings + DCA + daily savings)
    const totalValue = totalSavings + totalDCA + dailySavingsAmount;

    // Calculate active strategies
    const activeStrategies = [
      totalSavings > 0,
      dcaConfig?.enabled,
      dailySavingsStatus?.enabled
    ].filter(Boolean).length;

    // Completed goals (would need goal tracking from contract)
    const completedGoals = dailySavingsStatus &&
      dailySavingsStatus.currentAmount >= dailySavingsStatus.goalAmount ? 1 : 0;

    // Net growth (would need historical data)
    const netGrowth = totalValue;
    const growthPercentage = totalValue > 0 ? 12.4 : 0; // Placeholder until we have historical data

    return {
      totalValue,
      totalSavings,
      totalDCA,
      totalWithdrawn: 0, // Would need withdrawal history
      netGrowth,
      growthPercentage,
      activeStrategies,
      completedGoals
    };
  }, [totalBalance, dcaHistory, dcaConfig, dailySavingsStatus]);

  // Calculate token allocations
  const tokenAllocations: TokenAllocation[] = useMemo(() => {
    if (!tokenBalances.length) return [];

    const totalValue = tokenBalances.reduce((sum, bal) => sum + Number(formatUnits(bal.amount, 18)), 0);

    return tokenBalances.map((balance, index) => {
      const amount = Number(formatUnits(balance.amount, 18));
      const value = amount; // Would multiply by token price
      const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;

      return {
        token: balance.token,
        symbol: balance.symbol || `Token ${index + 1}`,
        amount,
        value,
        percentage: Number(percentage.toFixed(1)),
        color: TOKEN_COLORS[index % TOKEN_COLORS.length]
      };
    }).sort((a, b) => b.value - a.value);
  }, [tokenBalances]);

  // Generate performance data (would need historical data from events)
  const performanceData: PerformanceData[] = useMemo(() => {
    // For now, return empty array - this should be populated from event history
    return [];
  }, []);

  const isLoading = isLoadingSavings || isLoadingDCA || isLoadingDaily;

  return {
    portfolioData,
    tokenAllocations,
    performanceData,
    isLoading,
    hasData: tokenBalances.length > 0
  };
}
