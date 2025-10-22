'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAccount, useReadContract, useChainId } from 'wagmi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { parseEther, formatEther } from 'viem';
import { CONTRACT_ADDRESSES } from '@/contracts/addresses';
import { SlippageControlABI, SlippageAction, SLIPPAGE_PRESETS, bpsToPercent, percentToBps, calculateSlippage } from '@/contracts/abis/SlippageControl';
import { useSmartContractWrite } from './useSmartContractWrite';

export function useSlippageControl() {
  const { address } = useAccount();
  const chainId = useChainId();
  const queryClient = useQueryClient();

  // Get contract address for current chain
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]?.SlippageControl;

  // Biconomy write hook for gasless transactions
  const { write: writeContract, isPending: isWritePending, hash } = useSmartContractWrite();

  // Set user slippage tolerance
  const setSlippageTolerance = useMutation({
    mutationFn: async (params: {
      tolerance: number; // basis points
    }): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');
      if (!contractAddress) throw new Error('Contract not deployed on this network');
      
      const toleranceBps = BigInt(params.tolerance);
      
      return await writeContract({
        address: contractAddress as `0x${string}`,
        abi: SlippageControlABI,
        functionName: 'setSlippageTolerance',
        args: [address, toleranceBps]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slippageSettings'] });
    }
  });

  // Set token-specific slippage tolerance
  const setTokenSlippageTolerance = useMutation({
    mutationFn: async (params: {
      token: `0x${string}`;
      tolerance: number; // basis points
    }): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');
      if (!contractAddress) throw new Error('Contract not deployed on this network');
      
      const toleranceBps = BigInt(params.tolerance);
      
      return await writeContract({
        address: contractAddress as `0x${string}`,
        abi: SlippageControlABI,
        functionName: 'setTokenSlippageTolerance',
        args: [address, params.token, toleranceBps]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slippageSettings'] });
      queryClient.invalidateQueries({ queryKey: ['tokenSlippageSettings'] });
    }
  });

  // Set slippage action
  const setSlippageAction = useMutation({
    mutationFn: async (params: {
      action: SlippageAction;
    }): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');
      if (!contractAddress) throw new Error('Contract not deployed on this network');
      
      return await writeContract({
        address: contractAddress as `0x${string}`,
        abi: SlippageControlABI,
        functionName: 'setSlippageAction',
        args: [address, params.action]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slippageSettings'] });
    }
  });

  // Set default slippage tolerance (admin only)
  const setDefaultSlippageTolerance = useMutation({
    mutationFn: async (params: {
      tolerance: number; // basis points
    }): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');
      if (!contractAddress) throw new Error('Contract not deployed on this network');
      
      const toleranceBps = BigInt(params.tolerance);
      
      return await writeContract({
        address: contractAddress as `0x${string}`,
        abi: SlippageControlABI,
        functionName: 'setDefaultSlippageTolerance',
        args: [toleranceBps]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defaultSlippageSettings'] });
    }
  });

  // Local state management for user slippage preferences
  // Since the contract doesn't have read functions for user settings
  const [userSlippageTolerance, setUserSlippageTolerance] = useState<number>(SLIPPAGE_PRESETS.MEDIUM);
  const [userSlippageAction, setUserSlippageAction] = useState<SlippageAction>(SlippageAction.REVERT);
  const [tokenSlippageSettings, setTokenSlippageSettings] = useState<Record<string, number>>({});

  // Load user preferences from localStorage on mount
  useEffect(() => {
    if (address) {
      const savedTolerance = localStorage.getItem(`slippage_tolerance_${address}`);
      const savedAction = localStorage.getItem(`slippage_action_${address}`);
      const savedTokenSettings = localStorage.getItem(`token_slippage_${address}`);
      
      if (savedTolerance) {
        setUserSlippageTolerance(parseInt(savedTolerance));
      }
      if (savedAction) {
        setUserSlippageAction(parseInt(savedAction) as SlippageAction);
      }
      if (savedTokenSettings) {
        setTokenSlippageSettings(JSON.parse(savedTokenSettings));
      }
    }
  }, [address]);

  // Save user preferences to localStorage
  const saveUserPreferences = useCallback((tolerance?: number, action?: SlippageAction, tokenSettings?: Record<string, number>) => {
    if (address) {
      if (tolerance !== undefined) {
        localStorage.setItem(`slippage_tolerance_${address}`, tolerance.toString());
        setUserSlippageTolerance(tolerance);
      }
      if (action !== undefined) {
        localStorage.setItem(`slippage_action_${address}`, action.toString());
        setUserSlippageAction(action);
      }
      if (tokenSettings !== undefined) {
        localStorage.setItem(`token_slippage_${address}`, JSON.stringify(tokenSettings));
        setTokenSlippageSettings(tokenSettings);
      }
    }
  }, [address]);

  // Get minimum amount out (view function)
  const useGetMinimumAmountOut = (params: {
    fromToken: `0x${string}`;
    toToken: `0x${string}`;
    amountIn: bigint;
    customTolerance?: number;
  }) => {
    const customToleranceBps = params.customTolerance ? BigInt(params.customTolerance) : BigInt(0);
    
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: SlippageControlABI,
      functionName: 'getMinimumAmountOut',
      args: address && params.fromToken && params.toToken ? [
        address, 
        params.fromToken, 
        params.toToken, 
        params.amountIn, 
        customToleranceBps
      ] : undefined,
      query: {
        enabled: !!address && !!params.fromToken && !!params.toToken && !!contractAddress
      }
    });
  };

  // Handle slippage exceeded
  const handleSlippageExceeded = useMutation({
    mutationFn: async (params: {
      fromToken: `0x${string}`;
      toToken: `0x${string}`;
      fromAmount: bigint;
      receivedAmount: bigint;
      expectedMinimum: bigint;
    }): Promise<{ hash: `0x${string}`; shouldContinue: boolean }> => {
      if (!address) throw new Error('No wallet connected');
      if (!contractAddress) throw new Error('Contract not deployed on this network');
      
      const hash = await writeContract({
        address: contractAddress as `0x${string}`,
        abi: SlippageControlABI,
        functionName: 'handleSlippageExceeded',
        args: [
          address,
          params.fromToken,
          params.toToken,
          params.fromAmount,
          params.receivedAmount,
          params.expectedMinimum
        ]
      });

      return { hash, shouldContinue: true }; // Placeholder - actual implementation would parse the result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slippageEvents'] });
    }
  });

  // Utility functions
  const formatSlippage = (toleranceBps: number) => {
    return `${bpsToPercent(toleranceBps).toFixed(2)}%`;
  };

  const parseSlippageInput = (input: string): number => {
    const percent = parseFloat(input);
    return percentToBps(percent);
  };

  const getSlippagePreset = (toleranceBps: number) => {
    if (toleranceBps <= SLIPPAGE_PRESETS.VERY_LOW) return 'Very Low';
    if (toleranceBps <= SLIPPAGE_PRESETS.LOW) return 'Low';
    if (toleranceBps <= SLIPPAGE_PRESETS.MEDIUM) return 'Medium';
    if (toleranceBps <= SLIPPAGE_PRESETS.HIGH) return 'High';
    return 'Very High';
  };

  const getSlippageActionDescription = (action: SlippageAction): string => {
    const descriptions: Record<SlippageAction, string> = {
      [SlippageAction.REVERT]: "Revert transaction if slippage is exceeded",
      [SlippageAction.SKIP_SWAP]: "Skip swap but continue transaction",
      [SlippageAction.CONTINUE_ANYWAY]: "Continue swap regardless of slippage",
      [SlippageAction.RETRY_WITH_HIGHER_TOLERANCE]: "Retry with higher tolerance",
    };
    return descriptions[action];
  };

  const calculateSlippagePercent = (expected: bigint, actual: bigint): number => {
    return calculateSlippage(expected, actual);
  };

  const isSlippageWithinTolerance = (
    expected: bigint,
    actual: bigint,
    toleranceBps: number
  ): boolean => {
    const slippagePercent = calculateSlippage(expected, actual);
    const tolerancePercent = bpsToPercent(toleranceBps);
    return slippagePercent <= tolerancePercent;
  };

  return {
    // Contract data
    contractAddress,

    // Loading states
    isWritePending,

    // Mutations (gasless)
    setSlippageTolerance: setSlippageTolerance.mutateAsync,
    setTokenSlippageTolerance: setTokenSlippageTolerance.mutateAsync,
    setSlippageAction: setSlippageAction.mutateAsync,
    setDefaultSlippageTolerance: setDefaultSlippageTolerance.mutateAsync,
    handleSlippageExceeded: handleSlippageExceeded.mutateAsync,

    // Read functions
    useGetMinimumAmountOut,

    // Local state management
    userSlippageTolerance,
    userSlippageAction,
    tokenSlippageSettings,
    saveUserPreferences,

    // Mutation states
    isSettingTolerance: setSlippageTolerance.isPending,
    isSettingTokenTolerance: setTokenSlippageTolerance.isPending,
    isSettingAction: setSlippageAction.isPending,
    isSettingDefault: setDefaultSlippageTolerance.isPending,
    isHandlingSlippage: handleSlippageExceeded.isPending,

    // Utility functions
    formatSlippage,
    parseSlippageInput,
    getSlippagePreset,
    getSlippageActionDescription,
    calculateSlippagePercent,
    isSlippageWithinTolerance,

    // Constants
    SLIPPAGE_PRESETS,
    SlippageAction,

    // Transaction hash
    hash,

    // Error states
    setToleranceError: setSlippageTolerance.error,
    setTokenToleranceError: setTokenSlippageTolerance.error,
    setActionError: setSlippageAction.error,
    setDefaultError: setDefaultSlippageTolerance.error,
    handleSlippageError: handleSlippageExceeded.error
  };
}