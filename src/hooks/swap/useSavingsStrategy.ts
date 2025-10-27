'use client';

import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { getContractAddress } from '@/contracts/addresses';
import { SavingsStrategyABI } from '@/contracts/abis/SavingStrategy';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useBiconomy } from '@/components/BiconomyProvider';
import { useBiconomyTransaction } from '@/hooks/useBiconomyTransaction';
import { encodeFunctionData } from 'viem';
import { useQueryClient } from '@tanstack/react-query';

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
  const { address: eoaAddress } = useAccount();
  const { smartAccountAddress } = useBiconomy();
  const { sendTransaction } = useBiconomyTransaction();
  const { writeContractAsync } = useWriteContract(); // Fallback to EOA
  const chainId = useActiveChainId();
  const queryClient = useQueryClient();
  const [isSettingStrategy, setIsSettingStrategy] = useState(false);
  
  // Use Smart Account address if available, fallback to EOA
  const address = smartAccountAddress || eoaAddress;
  
  // Read current strategy
  const { data: strategyData, isLoading, refetch } = useReadContract({
    address: address ? getContractAddress(chainId, 'SavingStrategy') : undefined,
    abi: SavingsStrategyABI,
    functionName: 'getUserStrategy',
    args: address ? [address as `0x${string}`] : undefined,
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
  
  const hasStrategy = strategy ? strategy.percentage >= 0 : true; // Allow 0% savings (no strategy required)
  
  // Write contract hook
  // const { writeContractAsync } = useWriteContract();
  
  const setStrategy = useCallback(async (params: StrategyParams) => {
    console.log('🔧 Starting setStrategy with Smart Account:', {
      smartAccount: smartAccountAddress,
      eoa: eoaAddress,
      addressUsed: address,
      sendTransaction: typeof sendTransaction,
      writeContractAsync: typeof writeContractAsync,
      hasSmartAccount: !!smartAccountAddress,
      hasSendTransaction: !!sendTransaction,
      hasWriteContractAsync: !!writeContractAsync,
      params
    });
    
    if (!address) {
      const errorMsg = 'No address available';
      console.error('❌ Missing requirements:', errorMsg);
      toast.error(`Please connect your wallet: ${errorMsg}`);
      return { success: false, error: errorMsg };
    }
    
    setIsSettingStrategy(true);
    
    try {
      const strategyAddress = getContractAddress(chainId, 'SavingStrategy');
      
      // Validate percentage (accept both percentage 0-100 and basis points 0-10000)
      console.log('🔍 Validating percentage:', {
        percentage: params.percentage,
        type: typeof params.percentage,
        isValidPercentage: params.percentage >= 0 && params.percentage <= 100,
        isValidBasisPoints: params.percentage >= 0 && params.percentage <= 10000
      });
      
      if (params.percentage < 0 || params.percentage > 10000) {
        throw new Error(`Percentage must be between 0 and 10000 (basis points), got: ${params.percentage}`);
      }
      
      // Convert to basis points if needed (if percentage is 0-100, convert to basis points)
      const percentageInBasisPoints = params.percentage <= 100 ? params.percentage * 100 : params.percentage;
      
      // Convert maxPercentage to basis points if needed
      const maxPercentageInBasisPoints = (params.maxPercentage || 100) <= 100 ? 
        (params.maxPercentage || 100) * 100 : 
        (params.maxPercentage || 100);
      
      console.log('🔄 Converting percentages to basis points:', {
        percentage: {
          original: params.percentage,
          basisPoints: percentageInBasisPoints
        },
        maxPercentage: {
          original: params.maxPercentage,
          basisPoints: maxPercentageInBasisPoints
        }
      });
      
      console.log('🔧 Setting savings strategy:', {
        smartAccount: smartAccountAddress,
        eoa: eoaAddress,
        addressUsed: address,
        strategyAddress,
        params
      });
      
      // Try Smart Account first, fallback to EOA if it fails
      let txHash: string;
      
      if (smartAccountAddress && sendTransaction) {
        try {
          console.log('🚀 Attempting Smart Account transaction...');
          
          // Encode the setSavingStrategy call
          const calldata = encodeFunctionData({
            abi: SavingsStrategyABI,
            functionName: 'setSavingStrategy',
            args: [
              address as `0x${string}`,
              BigInt(percentageInBasisPoints), // Use converted basis points
              BigInt(params.autoIncrement || 0),
              BigInt(maxPercentageInBasisPoints),
              params.roundUpSavings || false,
              params.tokenType || 0,
              (params.specificToken || '0x0000000000000000000000000000000000000000') as `0x${string}`,
            ],
          });
          
          console.log('📦 Encoded calldata:', calldata);
          
          txHash = await sendTransaction(
            strategyAddress,
            calldata,
            BigInt(0)
          );
          console.log('✅ Smart Account transaction successful:', txHash);
        } catch (smartAccountError) {
          console.warn('⚠️ Smart Account transaction failed, falling back to EOA:', smartAccountError);
          console.log('🔄 Falling back to EOA transaction...');
          
          if (!writeContractAsync) {
            throw new Error('No transaction method available');
          }
          
          // Fallback to EOA
          txHash = await writeContractAsync({
            address: strategyAddress,
            abi: SavingsStrategyABI,
            functionName: 'setSavingStrategy',
            args: [
              eoaAddress as `0x${string}`,
              BigInt(percentageInBasisPoints), // Use converted basis points
              BigInt(params.autoIncrement || 0),
              BigInt(maxPercentageInBasisPoints),
              params.roundUpSavings || false,
              params.tokenType || 0,
              (params.specificToken || '0x0000000000000000000000000000000000000000') as `0x${string}`,
            ],
          });
          console.log('✅ EOA fallback transaction successful:', txHash);
        }
      } else {
        console.log('🔄 No Smart Account available, using EOA...');
        
        if (!writeContractAsync) {
          throw new Error('No transaction method available');
        }
        
        txHash = await writeContractAsync({
          address: strategyAddress,
          abi: SavingsStrategyABI,
          functionName: 'setSavingStrategy',
          args: [
            eoaAddress as `0x${string}`,
            BigInt(percentageInBasisPoints), // Use converted basis points
            BigInt(params.autoIncrement || 0),
            BigInt((params.maxPercentage || 100) * 100),
            params.roundUpSavings || false,
            params.tokenType || 0,
            (params.specificToken || '0x0000000000000000000000000000000000000000') as `0x${string}`,
          ],
        });
        console.log('✅ EOA transaction successful:', txHash);
      }
      
      console.log('✅ Savings strategy set successfully:', txHash);
      toast.success(`Savings strategy configured: ${params.percentage}% per swap`);
      
      // Invalidate and refetch strategy data
      queryClient.invalidateQueries({ 
        queryKey: ['readContract'] 
      });
      
      // Also refetch after a short delay to ensure blockchain state is updated
      setTimeout(() => {
        refetch();
      }, 2000);
      
      setIsSettingStrategy(false);
      console.log('🎯 Returning success result:', { success: true, txHash });
      return { success: true, txHash };
    } catch (err) {
      console.error('❌ Failed to set savings strategy:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to configure savings';
      toast.error(errorMessage);
      setIsSettingStrategy(false);
      console.log('🎯 Returning error result:', { success: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, [address, smartAccountAddress, eoaAddress, chainId, sendTransaction, writeContractAsync, refetch]);
  
  return {
    strategy,
    hasStrategy,
    isLoading,
    isSettingStrategy,
    setStrategy,
    refetch,
  };
}

