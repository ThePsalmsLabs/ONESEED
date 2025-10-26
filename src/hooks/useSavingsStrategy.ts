'use client';

import { useAccount, useReadContract } from 'wagmi';
import { getContractAddress } from '@/contracts/addresses';
import { SavingsStrategyABI } from '@/contracts/abis/SavingStrategy';
import { SavingsTokenType } from '@/contracts/types';
import { useSmartContractWrite } from './useSmartContractWrite';
import { useActiveChainId } from './useActiveChainId';
import { useBiconomy } from '@/components/BiconomyProvider';

export function useSavingsStrategy() {
  const { address: eoaAddress } = useAccount();
  const { smartAccountAddress } = useBiconomy();
  const chainId = useActiveChainId();

  // Use Smart Account address if available, fallback to EOA
  const address = smartAccountAddress || eoaAddress;

  // Get contract address for current chain
  const contractAddress = getContractAddress(chainId, 'SavingStrategy');

  // Read user strategy
  const { data: strategy, isLoading, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SavingsStrategyABI,
    functionName: 'getUserStrategy',
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address && !!contractAddress
    }
  });

  // Check if user has active strategy
  const { data: hasStrategy } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SavingsStrategyABI,
    functionName: 'hasActiveStrategy',
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address && !!contractAddress
    }
  });

  // Preview savings for a given swap amount
  const usePreviewSavings = (swapAmount: bigint) => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: SavingsStrategyABI,
      functionName: 'previewSavings',
      args: address && swapAmount ? [address as `0x${string}`, swapAmount] : undefined,
      query: {
        enabled: !!address && !!swapAmount && !!contractAddress
      }
    });
  };

  // Write: Set saving strategy (gasless via Biconomy)
  const { write, isPending } = useSmartContractWrite();

  const setSavingStrategy = async (params: {
    percentage: bigint;
    autoIncrement: bigint;
    maxPercentage: bigint;
    roundUpSavings: boolean;
    savingsTokenType: SavingsTokenType;
    specificSavingsToken?: `0x${string}`;
  }) => {
    if (!address) throw new Error('No wallet connected');
    if (!contractAddress) throw new Error('Contract not deployed on this network');

    return write({
      address: contractAddress as `0x${string}`,
      abi: SavingsStrategyABI,
      functionName: 'setSavingStrategy',
      args: [
        address,
        params.percentage,
        params.autoIncrement,
        params.maxPercentage,
        params.roundUpSavings,
        params.savingsTokenType,
        params.specificSavingsToken || '0x0000000000000000000000000000000000000000'
      ]
    });
  };

  return {
    strategy: strategy ? {
      percentage: strategy[0],
      autoIncrement: strategy[1],
      maxPercentage: strategy[2],
      roundUpSavings: strategy[3],
      savingsTokenType: strategy[4] as SavingsTokenType
    } : undefined,
    hasStrategy: hasStrategy ?? false,
    isLoading,
    refetch,
    setSavingStrategy,
    isPending,
    usePreviewSavings,
    contractAddress
  };
}

