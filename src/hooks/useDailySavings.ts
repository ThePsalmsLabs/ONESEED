import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { parseEther, formatEther } from 'viem';
import { CONTRACT_ADDRESSES } from '@/contracts/addresses';
import { DailySavingsABI } from '@/contracts/abis';
import { 
  DailySavingsConfig, 
  DailySavingsStatus, 
  DailyExecutionStatus,
  TransactionResult 
} from '@/contracts/types';

export function useDailySavings() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const queryClient = useQueryClient();

  // Get daily savings configuration
  const getDailySavingsConfig = useQuery({
    queryKey: ['dailySavingsConfig', address],
    queryFn: async (): Promise<DailySavingsConfig | null> => {
      if (!address) return null;
      
      // This would need to be implemented based on the actual contract interface
      // For now, returning a placeholder
      return {
        enabled: false,
        dailyAmount: BigInt(0),
        goalAmount: BigInt(0),
        penaltyBps: BigInt(0),
        endTime: BigInt(0),
        startTime: BigInt(0),
        lastExecutionTime: BigInt(0),
        currentAmount: BigInt(0)
      };
    },
    enabled: !!address
  });

  // Get daily savings status
  const getDailySavingsStatus = useQuery({
    queryKey: ['dailySavingsStatus', address],
    queryFn: async (): Promise<DailySavingsStatus | null> => {
      if (!address) return null;
      
      // This would need to be implemented based on the actual contract interface
      return {
        enabled: false,
        dailyAmount: BigInt(0),
        goalAmount: BigInt(0),
        currentAmount: BigInt(0),
        remainingAmount: BigInt(0),
        penaltyAmount: BigInt(0),
        estimatedCompletionDate: BigInt(0)
      };
    },
    enabled: !!address
  });

  // Check if user has pending daily savings
  const hasPendingDailySavings = useQuery({
    queryKey: ['hasPendingDailySavings', address],
    queryFn: async (): Promise<boolean> => {
      if (!address) return false;
      
      // This would need to be implemented based on the actual contract interface
      return false;
    },
    enabled: !!address
  });

  // Configure daily savings
  const configureDailySavings = useMutation({
    mutationFn: async (params: {
      token: `0x${string}`;
      dailyAmount: string;
      goalAmount: string;
      penaltyBps: number;
      endTime?: number;
    }) => {
      if (!address) throw new Error('No wallet connected');
      
      const dailyAmountWei = parseEther(params.dailyAmount);
      const goalAmountWei = parseEther(params.goalAmount);
      const penaltyBpsWei = BigInt(params.penaltyBps);
      const endTimeWei = BigInt(params.endTime || Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60);

      const hash = await writeContract({
        address: CONTRACT_ADDRESSES[84532].DailySavings as `0x${string}`,
        abi: DailySavingsABI,
        functionName: 'configureDailySavings',
        args: [
          address,
          params.token,
          dailyAmountWei,
          goalAmountWei,
          penaltyBpsWei,
          endTimeWei
        ]
      });

      return hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailySavingsConfig', address] });
      queryClient.invalidateQueries({ queryKey: ['dailySavingsStatus', address] });
    }
  });

  // Execute daily savings
  const executeDailySavings = useMutation({
    mutationFn: async (): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');
      
      const hash = await writeContract({
        address: CONTRACT_ADDRESSES[84532].DailySavings as `0x${string}`,
        abi: DailySavingsABI,
        functionName: 'executeDailySavings',
        args: [address]
      });

      return hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailySavingsStatus', address] });
      queryClient.invalidateQueries({ queryKey: ['hasPendingDailySavings', address] });
    }
  });

  // Execute daily savings for specific token
  const executeDailySavingsForToken = useMutation({
    mutationFn: async (token: `0x${string}`): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');
      
      const hash = await writeContract({
        address: CONTRACT_ADDRESSES[84532].DailySavings as `0x${string}`,
        abi: DailySavingsABI,
        functionName: 'executeDailySavingsForToken',
        args: [address, token]
      });

      return hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailySavingsStatus', address] });
      queryClient.invalidateQueries({ queryKey: ['hasPendingDailySavings', address] });
    }
  });

  // Withdraw daily savings
  const withdrawDailySavings = useMutation({
    mutationFn: async (params: {
      token: `0x${string}`;
      amount: string;
    }): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');
      
      const amountWei = parseEther(params.amount);
      
      const hash = await writeContract({
        address: CONTRACT_ADDRESSES[84532].DailySavings as `0x${string}`,
        abi: DailySavingsABI,
        functionName: 'withdrawDailySavings',
        args: [address, params.token, amountWei]
      });

      return hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailySavingsStatus', address] });
      queryClient.invalidateQueries({ queryKey: ['dailySavingsConfig', address] });
    }
  });

  // Disable daily savings
  const disableDailySavings = useMutation({
    mutationFn: async (token: `0x${string}`): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');
      
      const hash = await writeContract({
        address: CONTRACT_ADDRESSES[84532].DailySavings as `0x${string}`,
        abi: DailySavingsABI,
        functionName: 'disableDailySavings',
        args: [address, token]
      });

      return hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailySavingsConfig', address] });
      queryClient.invalidateQueries({ queryKey: ['dailySavingsStatus', address] });
    }
  });

  // Get daily execution status
  const getDailyExecutionStatus = useQuery({
    queryKey: ['dailyExecutionStatus', address],
    queryFn: async (): Promise<DailyExecutionStatus | null> => {
      if (!address) return null;
      
      // This would need to be implemented based on the actual contract interface
      return {
        canExecute: false,
        daysPassed: BigInt(0),
        amountToSave: BigInt(0)
      };
    },
    enabled: !!address
  });

  return {
    // Queries
    config: getDailySavingsConfig.data,
    status: getDailySavingsStatus.data,
    hasPending: hasPendingDailySavings.data,
    executionStatus: getDailyExecutionStatus.data,
    
    // Loading states
    isLoadingConfig: getDailySavingsConfig.isLoading,
    isLoadingStatus: getDailySavingsStatus.isLoading,
    isLoadingPending: hasPendingDailySavings.isLoading,
    isLoadingExecution: getDailyExecutionStatus.isLoading,
    
    // Mutations
    configureDailySavings: configureDailySavings.mutateAsync,
    executeDailySavings: executeDailySavings.mutateAsync,
    executeDailySavingsForToken: executeDailySavingsForToken.mutateAsync,
    withdrawDailySavings: withdrawDailySavings.mutateAsync,
    disableDailySavings: disableDailySavings.mutateAsync,
    
    // Mutation states
    isConfiguring: configureDailySavings.isPending,
    isExecuting: executeDailySavings.isPending,
    isExecutingToken: executeDailySavingsForToken.isPending,
    isWithdrawing: withdrawDailySavings.isPending,
    isDisabling: disableDailySavings.isPending,
    
    // Error states
    configError: getDailySavingsConfig.error,
    statusError: getDailySavingsStatus.error,
    pendingError: hasPendingDailySavings.error,
    executionError: getDailyExecutionStatus.error,
    configureError: configureDailySavings.error,
    executeError: executeDailySavings.error,
    executeTokenError: executeDailySavingsForToken.error,
    withdrawError: withdrawDailySavings.error,
    disableError: disableDailySavings.error
  };
}
