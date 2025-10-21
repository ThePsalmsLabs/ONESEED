import { useAccount, useWriteContract } from 'wagmi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CONTRACT_ADDRESSES } from '@/contracts/addresses';
import { SlippageControlABI } from '@/contracts/abis/SlippageControl';
import { 
  SlippageSettings, 
  SlippageAction,
  TransactionResult 
} from '@/contracts/types';

export function useSlippageControl() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const queryClient = useQueryClient();

  // Get slippage settings
  const getSlippageSettings = useQuery({
    queryKey: ['slippageSettings', address],
    queryFn: async (): Promise<SlippageSettings | null> => {
      if (!address) return null;
      
      // This would need to be implemented based on the actual contract interface
      return {
        tolerance: 300n, // 3% default
        action: SlippageAction.CONTINUE,
        tokenTolerance: {}
      };
    },
    enabled: !!address
  });

  // Get effective slippage tolerance for a specific token
  const getEffectiveSlippageTolerance = useQuery({
    queryKey: ['effectiveSlippageTolerance', address],
    queryFn: async (token: `0x${string}`): Promise<bigint | null> => {
      if (!address) return BigInt(300); // 3% default
      
      // This would need to be implemented based on the actual contract interface
      return BigInt(300);
    },
    enabled: !!address
  });

  // Get minimum amount out for a swap
  const getMinimumAmountOut = useQuery({
    queryKey: ['minimumAmountOut', address],
    queryFn: async (params: {
      expectedAmount: string;
      token: `0x${string}`;
    }): Promise<string> => {
      if (!address) return '0';
      
      // This would need to be implemented based on the actual contract interface
      return '0';
    },
    enabled: !!address
  });

  // Set slippage tolerance
  const setSlippageTolerance = useMutation({
    mutationFn: async (basisPoints: number): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');
      
      const basisPointsWei = BigInt(basisPoints);
      
      const hash = await writeContract({
        address: CONTRACT_ADDRESSES[84532].SlippageControl as `0x${string}`,
        abi: SlippageControlABI,
        functionName: 'setSlippageTolerance',
        args: [address, basisPointsWei]
      });

      return hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slippageSettings', address] });
    }
  });

  // Set token-specific slippage tolerance
  const setTokenSlippageTolerance = useMutation({
    mutationFn: async (params: {
      token: `0x${string}`;
      basisPoints: number;
    }): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');
      
      const basisPointsWei = BigInt(params.basisPoints);
      
      const hash = await writeContract({
        address: CONTRACT_ADDRESSES[84532].SlippageControl as `0x${string}`,
        abi: SlippageControlABI,
        functionName: 'setTokenSlippageTolerance',
        args: [address, params.token, basisPointsWei]
      });

      return hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slippageSettings', address] });
    }
  });

  // Set slippage action
  const setSlippageAction = useMutation({
    mutationFn: async (action: SlippageAction): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');
      
      const hash = await writeContract({
        address: CONTRACT_ADDRESSES[84532].SlippageControl as `0x${string}`,
        abi: SlippageControlABI,
        functionName: 'setSlippageAction',
        args: [address, action]
      });

      return hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slippageSettings', address] });
    }
  });

  // Handle slippage exceeded
  const handleSlippageExceeded = useMutation({
    mutationFn: async (params: {
      expectedAmount: string;
      actualAmount: string;
      token: `0x${string}`;
    }): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');
      
      const expectedAmountWei = BigInt(params.expectedAmount);
      const actualAmountWei = BigInt(params.actualAmount);
      
      const hash = await writeContract({
        address: CONTRACT_ADDRESSES[84532].SlippageControl as `0x${string}`,
        abi: SlippageControlABI,
        functionName: 'handleSlippageExceeded',
        args: [address, expectedAmountWei, actualAmountWei, params.token]
      });

      return hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slippageSettings', address] });
    }
  });

  // Calculate slippage percentage
  const calculateSlippagePercentage = (expected: bigint, actual: bigint): number => {
    if (expected === 0n) return 0;
    const slippage = Number(expected - actual) / Number(expected) * 100;
    return Math.abs(slippage);
  };

  // Check if slippage is within tolerance
  const isSlippageWithinTolerance = (
    expected: bigint, 
    actual: bigint, 
    tolerance: bigint
  ): boolean => {
    const slippagePercentage = calculateSlippagePercentage(expected, actual);
    const tolerancePercentage = Number(tolerance) / 100;
    return slippagePercentage <= tolerancePercentage;
  };

  // Get slippage warning level
  const getSlippageWarningLevel = (
    expected: bigint, 
    actual: bigint, 
    tolerance: bigint
  ): 'low' | 'medium' | 'high' | 'critical' => {
    const slippagePercentage = calculateSlippagePercentage(expected, actual);
    const tolerancePercentage = Number(tolerance) / 100;
    
    if (slippagePercentage <= tolerancePercentage * 0.5) return 'low';
    if (slippagePercentage <= tolerancePercentage * 0.8) return 'medium';
    if (slippagePercentage <= tolerancePercentage) return 'high';
    return 'critical';
  };

  return {
    // Queries
    settings: getSlippageSettings.data,
    effectiveTolerance: getEffectiveSlippageTolerance.data,
    minimumAmountOut: getMinimumAmountOut.data,
    
    // Loading states
    isLoadingSettings: getSlippageSettings.isLoading,
    isLoadingEffective: getEffectiveSlippageTolerance.isLoading,
    isLoadingMinimum: getMinimumAmountOut.isLoading,
    
    // Mutations
    setSlippageTolerance: setSlippageTolerance.mutateAsync,
    setTokenSlippageTolerance: setTokenSlippageTolerance.mutateAsync,
    setSlippageAction: setSlippageAction.mutateAsync,
    handleSlippageExceeded: handleSlippageExceeded.mutateAsync,
    
    // Mutation states
    isSettingTolerance: setSlippageTolerance.isPending,
    isSettingTokenTolerance: setTokenSlippageTolerance.isPending,
    isSettingAction: setSlippageAction.isPending,
    isHandlingExceeded: handleSlippageExceeded.isPending,
    
    // Error states
    settingsError: getSlippageSettings.error,
    effectiveError: getEffectiveSlippageTolerance.error,
    minimumError: getMinimumAmountOut.error,
    setToleranceError: setSlippageTolerance.error,
    setTokenToleranceError: setTokenSlippageTolerance.error,
    setActionError: setSlippageAction.error,
    handleExceededError: handleSlippageExceeded.error,
    
    // Utility functions
    calculateSlippagePercentage,
    isSlippageWithinTolerance,
    getSlippageWarningLevel
  };
}
