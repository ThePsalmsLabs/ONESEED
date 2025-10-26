'use client';

import { useReadContract } from 'wagmi';
import { useAccount } from 'wagmi';
import { useActiveChainId } from './useActiveChainId';
import { getContractAddress } from '@/contracts/addresses';
import { SpendSaveStorageABI } from '@/contracts/abis/SpendSaveStorage';
import { formatUnits } from 'viem';

export interface UserStrategy {
  id: string;
  token: `0x${string}`;
  percentage: bigint;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StrategyTemplate {
  id: string;
  name: string;
  description: string;
  category: 'savings' | 'dca' | 'withdrawal' | 'trading' | 'custom';
  type: 'daily' | 'weekly' | 'monthly' | 'conditional' | 'optimized';
  parameters: Record<string, any>;
  performance: {
    successRate: number;
    averageReturn: number;
    riskLevel: 'low' | 'medium' | 'high';
    popularity: number;
  };
  tags: string[];
  isPublic: boolean;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: string;
}

export function useStrategyTemplates() {
  const { address } = useAccount();
  const chainId = useActiveChainId();
  
  const storageAddress = getContractAddress(chainId, 'SpendSaveStorage');

  // Get user's active strategies
  const {
    data: userStrategiesData,
    isLoading: isLoadingUserStrategies,
    error: userStrategiesError,
    refetch: refetchUserStrategies
  } = useReadContract({
    address: storageAddress,
    abi: SpendSaveStorageABI,
    functionName: 'getUserSavingsTokens',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      retry: 3,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 30000,
      refetchInterval: 60000,
    }
  });

  // Get user's strategy configuration
  const {
    data: userConfigData,
    isLoading: isLoadingUserConfig,
    error: userConfigError,
    refetch: refetchUserConfig
  } = useReadContract({
    address: storageAddress,
    abi: SpendSaveStorageABI,
    functionName: 'getUserSavingStrategy',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      retry: 3,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 30000,
      refetchInterval: 60000,
    }
  });

  // Process user strategies
  const userStrategies: UserStrategy[] = userStrategiesData ? 
    (userStrategiesData as `0x${string}`[]).map((token, index) => ({
      id: `strategy-${index}`,
      token,
      percentage: BigInt(0), // Would need to get from config
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })) : [];

  // Generate strategy templates from user data
  const strategyTemplates: StrategyTemplate[] = userStrategies.map((strategy, index) => ({
    id: strategy.id,
    name: `Strategy ${index + 1}`,
    description: `Active savings strategy for token ${strategy.token.slice(0, 6)}...`,
    category: 'savings' as const,
    type: 'daily' as const,
    parameters: {
      token: strategy.token,
      percentage: Number(strategy.percentage),
      isActive: strategy.isActive
    },
    performance: {
      successRate: 95, // Placeholder - would need historical data
      averageReturn: 8.5, // Placeholder - would need historical data
      riskLevel: 'low' as const,
      popularity: 85 // Placeholder
    },
    tags: ['active', 'savings'],
    isPublic: false,
    isDefault: false,
    createdAt: strategy.createdAt,
    updatedAt: strategy.updatedAt,
    author: 'You'
  }));

  // Add default templates if no user strategies
  const defaultTemplates: StrategyTemplate[] = [
    {
      id: 'default-conservative',
      name: 'Conservative Daily Savings',
      description: 'Low-risk daily savings strategy',
      category: 'savings',
      type: 'daily',
      parameters: {
        percentage: 5, // 5% savings
        frequency: 'daily',
        slippage: 0.5,
        autoCompound: true
      },
      performance: {
        successRate: 95,
        averageReturn: 8.5,
        riskLevel: 'low',
        popularity: 85
      },
      tags: ['conservative', 'daily', 'low-risk'],
      isPublic: true,
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: 'SpendSave'
    },
    {
      id: 'default-moderate',
      name: 'Moderate Weekly Savings',
      description: 'Balanced weekly savings strategy',
      category: 'savings',
      type: 'weekly',
      parameters: {
        percentage: 10, // 10% savings
        frequency: 'weekly',
        slippage: 1.0,
        autoCompound: true
      },
      performance: {
        successRate: 92,
        averageReturn: 12.3,
        riskLevel: 'medium',
        popularity: 78
      },
      tags: ['moderate', 'weekly', 'balanced'],
      isPublic: true,
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: 'SpendSave'
    },
    {
      id: 'default-aggressive',
      name: 'Aggressive Monthly Savings',
      description: 'High-return monthly savings strategy',
      category: 'savings',
      type: 'monthly',
      parameters: {
        percentage: 20, // 20% savings
        frequency: 'monthly',
        slippage: 2.0,
        autoCompound: true
      },
      performance: {
        successRate: 88,
        averageReturn: 18.7,
        riskLevel: 'high',
        popularity: 65
      },
      tags: ['aggressive', 'monthly', 'high-return'],
      isPublic: true,
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: 'SpendSave'
    }
  ];

  const allTemplates = strategyTemplates.length > 0 ? strategyTemplates : defaultTemplates;

  return {
    templates: allTemplates,
    userStrategies,
    isLoading: isLoadingUserStrategies || isLoadingUserConfig,
    error: userStrategiesError || userConfigError,
    refetch: () => {
      refetchUserStrategies();
      refetchUserConfig();
    }
  };
}
