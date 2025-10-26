'use client';

import { useReadContract } from 'wagmi';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { getContractAddress } from '@/contracts/addresses';

export interface ContractCallOptions {
  retries?: number;
  retryDelay?: (attemptIndex: number) => number;
  staleTime?: number;
  refetchInterval?: number;
  enabled?: boolean;
}

export interface ContractCallResult<T = any> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Enhanced contract call wrapper with automatic retry logic
 */
export function useContractCall<T = any>(
  contractName: string,
  abi: any,
  functionName: string,
  args?: any[],
  options: ContractCallOptions = {}
): ContractCallResult<T> {
  const chainId = useActiveChainId();
  const {
    retries = 3,
    retryDelay = (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime = 30000,
    refetchInterval = 60000,
    enabled = true
  } = options;

  let contractAddress: `0x${string}`;
  try {
    contractAddress = getContractAddress(chainId, contractName as any);
  } catch (error) {
    return {
      data: undefined,
      isLoading: false,
      error: error as Error,
      refetch: () => {}
    };
  }

  const result = useReadContract({
    address: contractAddress,
    abi,
    functionName,
    args,
    query: {
      enabled,
      retry: retries,
      retryDelay,
      staleTime,
      refetchInterval,
    }
  });

  return {
    data: result.data as T,
    isLoading: result.isLoading,
    error: result.error,
    refetch: result.refetch
  };
}

/**
 * Verify all contract deployments for the current chain
 */
export function useContractDeployments() {
  const chainId = useActiveChainId();
  
  const contracts = [
    'SpendSaveStorage',
    'SpendSaveHook',
    'StateView',
    'Analytics',
    'SavingStrategy',
    'Savings',
    'DCA',
    'Token',
    'SlippageControl',
    'DailySavings',
    'DCARouter',
    'LiquidityManager',
    'ModuleRegistry',
    'Multicall',
    'Quoter',
    'SlippageEnhanced',
    'UniswapV4PoolManager',
    'UniswapV4PositionManager',
    'UniswapV4Quoter',
    'UniswapV4StateView',
    'SwapRouter'
  ];

  const deploymentStatus = contracts.map(contractName => {
    try {
      const address = getContractAddress(chainId, contractName as any);
      return {
        name: contractName,
        address,
        deployed: address !== '0x0000000000000000000000000000000000000000',
        error: null
      };
    } catch (error) {
      return {
        name: contractName,
        address: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        deployed: false,
        error: error as Error
      };
    }
  });

  const deployedContracts = deploymentStatus.filter(c => c.deployed);
  const missingContracts = deploymentStatus.filter(c => !c.deployed);
  
  return {
    deploymentStatus,
    deployedContracts,
    missingContracts,
    allDeployed: missingContracts.length === 0,
    chainId
  };
}

/**
 * Network validation utility
 */
export function validateNetwork(chainId: number): {
  isValid: boolean;
  isSupported: boolean;
  networkName: string;
  error?: string;
} {
  const supportedChains = [8453, 84532]; // Base Mainnet, Base Sepolia
  
  if (supportedChains.includes(chainId)) {
    const networkName = chainId === 8453 ? 'Base Mainnet' : 'Base Sepolia';
    return {
      isValid: true,
      isSupported: true,
      networkName
    };
  }
  
  if (chainId === 31337) {
    return {
      isValid: false,
      isSupported: false,
      networkName: 'Localhost',
      error: 'Localhost is not supported. Please switch to Base Sepolia or Base Mainnet.'
    };
  }
  
  return {
    isValid: false,
    isSupported: false,
    networkName: `Chain ${chainId}`,
    error: `Chain ${chainId} is not supported. Please switch to Base Sepolia (84532) or Base Mainnet (8453).`
  };
}

/**
 * Contract call error handler
 */
export function handleContractError(error: Error, contractName: string): {
  userMessage: string;
  shouldRetry: boolean;
  logLevel: 'error' | 'warn' | 'info';
} {
  const errorMessage = error.message.toLowerCase();
  
  // Network errors - should retry
  if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
    return {
      userMessage: 'Network error. Please check your connection and try again.',
      shouldRetry: true,
      logLevel: 'warn'
    };
  }
  
  // Contract not found - should not retry
  if (errorMessage.includes('contract') && errorMessage.includes('not found')) {
    return {
      userMessage: `${contractName} contract is not deployed on this network.`,
      shouldRetry: false,
      logLevel: 'error'
    };
  }
  
  // RPC errors - should retry
  if (errorMessage.includes('rpc') || errorMessage.includes('provider')) {
    return {
      userMessage: 'Blockchain connection error. Please try again.',
      shouldRetry: true,
      logLevel: 'warn'
    };
  }
  
  // Gas estimation errors - should not retry
  if (errorMessage.includes('gas') || errorMessage.includes('execution reverted')) {
    return {
      userMessage: 'Transaction failed. Please check your parameters.',
      shouldRetry: false,
      logLevel: 'error'
    };
  }
  
  // Default case
  return {
    userMessage: `Error calling ${contractName}. Please try again.`,
    shouldRetry: true,
    logLevel: 'error'
  };
}

/**
 * Log contract call errors with appropriate level
 */
export function logContractError(
  error: Error, 
  contractName: string, 
  functionName: string,
  args?: any[]
): void {
  const { logLevel } = handleContractError(error, contractName);
  
  const logData = {
    contract: contractName,
    function: functionName,
    args: args ? JSON.stringify(args) : undefined,
    error: error.message,
    stack: error.stack
  };
  
  switch (logLevel) {
    case 'error':
      console.error(`Contract call failed: ${contractName}.${functionName}`, logData);
      break;
    case 'warn':
      console.warn(`Contract call warning: ${contractName}.${functionName}`, logData);
      break;
    case 'info':
      console.info(`Contract call info: ${contractName}.${functionName}`, logData);
      break;
  }
}
