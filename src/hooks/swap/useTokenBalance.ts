'use client';

import { useAccount, useBalance, useReadContract } from 'wagmi';
import { Address, erc20Abi, formatUnits } from 'viem';
import { useMemo } from 'react';
import { useBiconomy } from '@/components/BiconomyProvider';

const NATIVE_ETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' as Address;

interface UseTokenBalanceProps {
  tokenAddress?: Address;
  decimals?: number;
}

export function useTokenBalance({ tokenAddress, decimals = 18 }: UseTokenBalanceProps) {
  const { address: eoaAddress, isConnected } = useAccount();
  const { smartAccountAddress } = useBiconomy();
  
  // Use Smart Account address if available, fallback to EOA
  const userAddress = smartAccountAddress || eoaAddress;
  
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
    address: userAddress as `0x${string}`,
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
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
    query: {
      enabled: isConnected && !!userAddress && !!tokenAddress && !isNativeETH,
    },
  });
  
  const balance = useMemo(() => {
    if (!isConnected) return BigInt(0);
    if (isNativeETH) return ethBalance?.value || BigInt(0);
    
    const tokenBal = (tokenBalance as bigint) || BigInt(0);
    
    // Debug logging for token balance
    if (tokenAddress && tokenBal > BigInt(0)) {
      console.log('💰 Token Balance Debug:', {
        eoaAddress,
        smartAccountAddress,
        addressUsed: userAddress,
        tokenAddress,
        balance: tokenBal.toString(),
        formatted: formatUnits(tokenBal, decimals)
      });
    }
    
    return tokenBal;
  }, [isConnected, isNativeETH, ethBalance, tokenBalance, eoaAddress, smartAccountAddress, userAddress, tokenAddress, decimals]);
  
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

