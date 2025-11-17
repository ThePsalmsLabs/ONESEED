'use client';

import { useAccount, useBalance, usePublicClient } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { useActiveChainId } from './useActiveChainId';
import { BASE_SEPOLIA_TOKENS, CHAIN_IDS } from '@/config/network';
import { useBiconomy } from '@/components/BiconomyProvider';

export interface BalanceCheckResult {
  hasETH: boolean;
  hasUSDC: boolean;
  isReady: boolean;
  needsETH: boolean;
  needsUSDC: boolean;
  ethBalance: bigint;
  usdcBalance: bigint;
  ethFormatted: string;
  usdcFormatted: string;
  isLoading: boolean;
  error?: string;
}

export function useBalanceCheck() {
  const { address: eoaAddress } = useAccount();
  const { smartAccountAddress } = useBiconomy();
  const currentChainId = useActiveChainId();
  const publicClient = usePublicClient();

  // Use Smart Account address if available, fallback to EOA
  const address = smartAccountAddress || eoaAddress;

  console.log('🔍 Balance Check Debug:', {
    eoaAddress,
    smartAccountAddress,
    addressUsed: address,
    currentChainId,
    isOnBaseSepolia: currentChainId === CHAIN_IDS.BASE_SEPOLIA,
    isOnBaseMainnet: currentChainId === CHAIN_IDS.BASE_MAINNET
  });

  // Check ETH balance - use wallet's current network
  const { data: ethBalance, isLoading: ethLoading } = useBalance({
    address: address as `0x${string}`,
    chainId: currentChainId, // Use wallet's current network
  });

  // Check USDC balance - use wallet's current network
  const { data: usdcBalance, isLoading: usdcLoading } = useQuery({
    queryKey: ['usdcBalance', address, currentChainId], // Use wallet's current network
    queryFn: async () => {
      if (!address || !publicClient) {
        console.log('❌ Missing address or publicClient for USDC balance check');
        return BigInt(0);
      }

      // Get the correct USDC token address for the current network
      const usdcTokenAddress = currentChainId === CHAIN_IDS.BASE_SEPOLIA 
        ? BASE_SEPOLIA_TOKENS.USDC 
        : '0xA0b86a33E6441b8C4C8C0d3736aFb0b8f9C2d6c8'; // Base Mainnet USDC (example)

      console.log('🔍 Checking USDC balance:', {
        eoaAddress,
        smartAccountAddress,
        addressUsed: address,
        usdcToken: usdcTokenAddress,
        chainId: currentChainId,
        isBaseSepolia: currentChainId === CHAIN_IDS.BASE_SEPOLIA
      });

      try {
        const balance = await publicClient.readContract({
          address: usdcTokenAddress as `0x${string}`,
          abi: [
            {
              name: 'balanceOf',
              type: 'function',
              stateMutability: 'view',
              inputs: [{ name: 'account', type: 'address' }],
              outputs: [{ name: 'balance', type: 'uint256' }],
            }
          ],
          functionName: 'balanceOf',
          args: [address as `0x${string}`]
        });

        console.log('✅ USDC Balance fetched:', {
          eoaAddress,
          smartAccountAddress,
          addressUsed: address,
          balance: balance.toString(),
          formatted: (Number(balance) / 1e6).toFixed(2) + ' USDC'
        });
        return balance as bigint;
      } catch (error) {
        console.error('❌ Error fetching USDC balance:', error);
        return BigInt(0);
      }
    },
    enabled: !!address && !!publicClient,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const isLoading = ethLoading || usdcLoading;

  // Calculate thresholds
  const minETH = BigInt(1000000000000000); // 0.001 ETH (for gas)
  const minUSDC = BigInt(1000000); // 1 USDC (6 decimals)

  const ethBalanceBigInt = ethBalance?.value || BigInt(0);
  const usdcBalanceBigInt = usdcBalance || BigInt(0);

  const hasETH = ethBalanceBigInt >= minETH;
  const hasUSDC = usdcBalanceBigInt >= minUSDC;
  const isReady = hasETH && hasUSDC;
  const needsETH = !hasETH;
  const needsUSDC = !hasUSDC;

  // Format balances for display
  const ethFormatted = ethBalance?.formatted || '0';
  const usdcFormatted = usdcBalanceBigInt ? (Number(usdcBalanceBigInt) / 1e6).toFixed(2) : '0';

  return {
    hasETH,
    hasUSDC,
    isReady,
    needsETH,
    needsUSDC,
    ethBalance: ethBalanceBigInt,
    usdcBalance: usdcBalanceBigInt,
    ethFormatted,
    usdcFormatted,
    isLoading,
  };
}

// Hook to check if user needs to get test tokens
export function useNeedsTestTokens() {
  const balanceCheck = useBalanceCheck();
  
  return {
    needsTokens: balanceCheck.needsETH || balanceCheck.needsUSDC,
    ...balanceCheck
  };
}
