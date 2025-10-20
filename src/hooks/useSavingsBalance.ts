'use client';

import { useAccount, useReadContract, useChainId } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/contracts/addresses';
import { TokenABI } from '@/contracts/abis/Token';

export function useSavingsBalance() {
  const { address } = useAccount();
  const chainId = useChainId();

  // Get contract address for current chain
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]?.Token;

  // Get balance for a specific token
  const getTokenBalance = (tokenId: bigint) => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: TokenABI,
      functionName: 'balanceOf',
      args: address && tokenId ? [address, tokenId] : undefined,
      query: {
        enabled: !!address && !!tokenId && !!contractAddress
      }
    });
  };

  // Get token address from token ID
  const getTokenAddress = (tokenId: bigint) => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: TokenABI,
      functionName: 'getTokenAddress',
      args: tokenId ? [tokenId] : undefined,
      query: {
        enabled: !!tokenId && !!contractAddress
      }
    });
  };

  // Get token ID from token address
  const getTokenId = (tokenAddress: `0x${string}`) => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: TokenABI,
      functionName: 'getTokenId',
      args: tokenAddress ? [tokenAddress] : undefined,
      query: {
        enabled: !!tokenAddress && !!contractAddress
      }
    });
  };

  // Check if token is registered
  const isTokenRegistered = (tokenAddress: `0x${string}`) => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: TokenABI,
      functionName: 'isTokenRegistered',
      args: tokenAddress ? [tokenAddress] : undefined,
      query: {
        enabled: !!tokenAddress && !!contractAddress
      }
    });
  };

  // Get token name
  const getTokenName = (tokenId: bigint) => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: TokenABI,
      functionName: 'name',
      args: tokenId ? [tokenId] : undefined,
      query: {
        enabled: !!tokenId && !!contractAddress
      }
    });
  };

  // Get token symbol
  const getTokenSymbol = (tokenId: bigint) => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: TokenABI,
      functionName: 'symbol',
      args: tokenId ? [tokenId] : undefined,
      query: {
        enabled: !!tokenId && !!contractAddress
      }
    });
  };

  // Get token decimals
  const getTokenDecimals = (tokenId: bigint) => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: TokenABI,
      functionName: 'decimals',
      args: tokenId ? [tokenId] : undefined,
      query: {
        enabled: !!tokenId && !!contractAddress
      }
    });
  };

  return {
    getTokenBalance,
    getTokenAddress,
    getTokenId,
    isTokenRegistered,
    getTokenName,
    getTokenSymbol,
    getTokenDecimals,
    contractAddress
  };
}