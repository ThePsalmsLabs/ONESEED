'use client';

import { useAccount, useBalance, useReadContract } from 'wagmi';
import { Address, erc20Abi, formatUnits } from 'viem';
import { useMemo } from 'react';

const NATIVE_ETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' as Address;

interface UseTokenBalanceProps {
  tokenAddress?: Address;
  decimals?: number;
}

export function useTokenBalance({ tokenAddress, decimals = 18 }: UseTokenBalanceProps) {
  const { address: userAddress, isConnected } = useAccount();
  
  // Check if token is native ETH
  const isNativeETH = !tokenAddress || 
    tokenAddress === NATIVE_ETH_ADDRESS || 
    tokenAddress === '0x0000000000000000000000000000000000000000';
  
  // Fetch native ETH balance
  const {
    data: ethBalance,
    isLoading: ethLoading,
    refetch: refetchEth,
  } = useBalance({
    address: userAddress,
    query: {
      enabled: isConnected && isNativeETH,
    },
  });
  
  // Fetch ERC20 token balance
  const {
    data: tokenBalance,
    isLoading: tokenLoading,
    refetch: refetchToken,
  } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: isConnected && !!userAddress && !!tokenAddress && !isNativeETH,
    },
  });
  
  const balance = useMemo(() => {
    if (!isConnected) return BigInt(0);
    if (isNativeETH) return ethBalance?.value || BigInt(0);
    return (tokenBalance as bigint) || BigInt(0);
  }, [isConnected, isNativeETH, ethBalance, tokenBalance]);
  
  const formatted = useMemo(() => {
    try {
      return formatUnits(balance, decimals);
    } catch {
      return '0';
    }
  }, [balance, decimals]);
  
  const isLoading = isNativeETH ? ethLoading : tokenLoading;
  
  const refetch = isNativeETH ? refetchEth : refetchToken;
  
  return {
    balance,
    formatted,
    isLoading,
    refetch,
    hasBalance: balance > BigInt(0),
  };
}

