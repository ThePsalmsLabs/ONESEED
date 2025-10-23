'use client';

import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { getContractAddress } from '@/contracts/addresses';
import { SavingsStrategyABI } from '@/contracts/abis/SavingStrategy';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface SavingsStrategyConfig {
  percentage: number; // 0-100
  autoIncrement: number;
  maxPercentage: number;
  roundUpSavings: boolean;
  tokenType: 0 | 1; // 0 = INPUT, 1 = OUTPUT
  specificToken: string;
  enableDCA: boolean;
}

export interface StrategyParams {
  percentage: number; // 0-100 (will be converted to basis points)
  autoIncrement?: number;
  maxPercentage?: number;
  roundUpSavings?: boolean;
  tokenType?: 0 | 1;
  specificToken?: string;
}

export function useSavingsStrategy() {
  const { address } = useAccount();
  const chainId = useActiveChainId();
  const [isSettingStrategy, setIsSettingStrategy] = useState(false);
  
  // Read current strategy
  const { data: strategyData, isLoading, refetch } = useReadContract({
    address: address ? getContractAddress(chainId, 'SavingStrategy') : undefined,
    abi: SavingsStrategyABI,
    functionName: 'getUserStrategy',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
  
  // Parse strategy data
  const strategy: SavingsStrategyConfig | null = strategyData ? {
    percentage: Number(strategyData[0]) / 100, // Convert from basis points to percentage
    autoIncrement: Number(strategyData[1]),
    maxPercentage: Number(strategyData[2]) / 100,
    roundUpSavings: Boolean(strategyData[3]),
    tokenType: Number(strategyData[4]) as 0 | 1,
    specificToken: '0x0000000000000000000000000000000000000000', // Default value since not returned by getUserStrategy
    enableDCA: false, // Default value since not returned by getUserStrategy
  } : null;
  
  const hasStrategy = strategy ? strategy.percentage > 0 : false;
  
  // Write contract hook
  const { writeContractAsync } = useWriteContract();
  
  const setStrategy = useCallback(async (params: StrategyParams) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return { success: false, error: 'No wallet connected' };
    }
    
    setIsSettingStrategy(true);
    
    try {
      const strategyAddress = getContractAddress(chainId, 'SavingStrategy');
      
      // Validate percentage
      if (params.percentage < 0 || params.percentage > 100) {
        throw new Error('Percentage must be between 0 and 100');
      }
      
      const tx = await writeContractAsync({
        address: strategyAddress,
        abi: SavingsStrategyABI,
        functionName: 'setSavingStrategy',
        args: [
          address,
          BigInt(params.percentage * 100), // Convert to basis points
          BigInt(params.autoIncrement || 0),
          BigInt((params.maxPercentage || 100) * 100),
          params.roundUpSavings || false,
          params.tokenType || 0,
          (params.specificToken || '0x0000000000000000000000000000000000000000') as `0x${string}`,
        ],
      });
      
      toast.success(`Savings strategy configured: ${params.percentage}% per swap`);
      
      // Refetch strategy after a short delay
      setTimeout(() => {
        refetch();
      }, 2000);
      
      setIsSettingStrategy(false);
      return { success: true, txHash: tx };
    } catch (err) {
      console.error('Failed to set savings strategy:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to configure savings';
      toast.error(errorMessage);
      setIsSettingStrategy(false);
      return { success: false, error: errorMessage };
    }
  }, [address, chainId, writeContractAsync, refetch]);
  
  return {
    strategy,
    hasStrategy,
    isLoading,
    isSettingStrategy,
    setStrategy,
    refetch,
  };
}

