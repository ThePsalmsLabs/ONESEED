'use client';

import { useAccount, useReadContract, useChainId, usePublicClient } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { CONTRACT_ADDRESSES } from '@/contracts/addresses';
import { TokenModuleABI } from '@/contracts/abis/Token';
import { useSpendSaveContracts } from './useSpendSaveContracts';

export interface TokenBalance {
  token: `0x${string}`;
  amount: bigint;
  decimals: number;
  symbol?: string;
  name?: string;
}

export function useSavingsBalance() {
  const { address } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const contracts = useSpendSaveContracts();

  // Get contract address for current chain
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]?.Token;

  // Fetch actual token balances from the contract
  const { data: tokenBalances, isLoading } = useQuery<TokenBalance[]>({
    queryKey: ['tokenBalances', address, chainId],
    queryFn: async (): Promise<TokenBalance[]> => {
      if (!address || !publicClient) return [];
      
      // Check if contracts are deployed on this chain
      if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
        console.warn(`Contracts not deployed on chain ${chainId}. Please switch to Base Sepolia (84532) for testing.`);
        return [];
      }
      
      if (!contracts.savings.address || contracts.savings.address === '0x0000000000000000000000000000000000000000') {
        console.warn(`Savings contract not deployed on chain ${chainId}. Please switch to Base Sepolia (84532) for testing.`);
        return [];
      }
      
      try {
        // Get user's savings data from Savings contract
        const savingsData = await publicClient.readContract({
          address: contracts.savings.address,
          abi: contracts.savings.abi,
          functionName: 'getUserSavings',
          args: [address]
        });

        const [tokens, amounts] = savingsData as [readonly `0x${string}`[], readonly bigint[]];
        
        if (!tokens || tokens.length === 0) return [];

        const balances: TokenBalance[] = [];

        // Process each token
        for (let i = 0; i < tokens.length; i++) {
          const tokenAddress = tokens[i];
          const amount = amounts[i];

          // Skip tokens with zero balance
          if (amount === BigInt(0)) continue;

          try {
            // Get token ID from Token contract
            const tokenId = await publicClient.readContract({
              address: contractAddress,
              abi: TokenModuleABI,
              functionName: 'getTokenId',
              args: [tokenAddress]
            });

            // Get token metadata
            const [name, symbol, decimals] = await Promise.all([
              publicClient.readContract({
                address: contractAddress,
                abi: TokenModuleABI,
                functionName: 'name',
                args: [tokenId]
              }).catch(() => 'Unknown Token'),
              publicClient.readContract({
                address: contractAddress,
                abi: TokenModuleABI,
                functionName: 'symbol',
                args: [tokenId]
              }).catch(() => 'UNK'),
              publicClient.readContract({
                address: contractAddress,
                abi: TokenModuleABI,
                functionName: 'decimals',
                args: [tokenId]
              }).catch(() => 18)
            ]);

            balances.push({
              token: tokenAddress,
              amount,
              decimals: Number(decimals),
              symbol: symbol as string,
              name: name as string
            });
          } catch (error) {
            console.error(`Error fetching metadata for token ${tokenAddress}:`, error);
            // Add token with basic info if metadata fails
            balances.push({
              token: tokenAddress,
              amount,
              decimals: 18,
              symbol: 'UNK',
              name: 'Unknown Token'
            });
          }
        }

        return balances;
      } catch (error) {
        console.error('Error fetching token balances:', error);
        return [];
      }
    },
    enabled: !!address && !!contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000',
    staleTime: 30000, // 30 seconds
  });

  // Get balance for a specific token
  const getTokenBalance = (tokenId: bigint) => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: TokenModuleABI,
      functionName: 'balanceOf',
      args: address && tokenId ? [address, tokenId] : undefined,
      query: {
        enabled: !!address && !!tokenId && !!contractAddress
      }
    });
  };

  // Get balances for multiple tokens at once
  const getTokenBalances = (tokenIds: bigint[]) => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: TokenModuleABI,
      functionName: 'balanceOfBatch',
      args: address && tokenIds.length > 0 ? [address, tokenIds] : undefined,
      query: {
        enabled: !!address && tokenIds.length > 0 && !!contractAddress
      }
    });
  };

  // Helper function to fetch balances for known token addresses
  const fetchBalancesForTokens = async (tokenAddresses: `0x${string}`[]): Promise<TokenBalance[]> => {
    if (!address || !contractAddress || tokenAddresses.length === 0) return [];
    
    try {
      const balances: TokenBalance[] = [];
      
      for (const tokenAddress of tokenAddresses) {
        try {
          // Check if token is registered
          const isRegisteredResult = isTokenRegistered(tokenAddress);
          if (!isRegisteredResult.data) continue;
          
          // Get token ID
          const tokenIdResult = getTokenId(tokenAddress);
          if (!tokenIdResult.data) continue;
          
          // Get user's balance
          const balanceResult = getTokenBalance(tokenIdResult.data);
          if (!balanceResult.data || balanceResult.data === BigInt(0)) continue;
          
          // Get token metadata
          const [nameResult, symbolResult, decimalsResult] = await Promise.all([
            getTokenName(tokenIdResult.data),
            getTokenSymbol(tokenIdResult.data),
            getTokenDecimals(tokenIdResult.data)
          ]);
          
          balances.push({
            token: tokenAddress,
            amount: balanceResult.data,
            decimals: decimalsResult.data || 18,
            symbol: symbolResult.data || 'UNKNOWN',
            name: nameResult.data || 'Unknown Token'
          });
        } catch (error) {
          console.error(`Error fetching balance for token ${tokenAddress}:`, error);
          continue;
        }
      }
      
      return balances;
    } catch (error) {
      console.error('Error fetching balances for tokens:', error);
      return [];
    }
  };

  // Get token address from token ID
  const getTokenAddress = (tokenId: bigint) => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: TokenModuleABI,
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
      abi: TokenModuleABI,
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
      abi: TokenModuleABI,
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
      abi: TokenModuleABI,
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
      abi: TokenModuleABI,
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
      abi: TokenModuleABI,
      functionName: 'decimals',
      args: tokenId ? [tokenId] : undefined,
      query: {
        enabled: !!tokenId && !!contractAddress
      }
    });
  };

  // Calculate total balance across all tokens
  const totalBalance = tokenBalances?.reduce((sum, balance) => sum + balance.amount, BigInt(0)) || BigInt(0);

  // Check if contracts are deployed on current chain
  const isContractsDeployed = contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000';
  const isSavingsContractDeployed = contracts.savings.address && contracts.savings.address !== '0x0000000000000000000000000000000000000000';
  
  // Get supported chain info
  const getSupportedChainInfo = () => {
    if (chainId === 84532) {
      return {
        name: 'Base Sepolia',
        chainId: 84532,
        isSupported: true,
        isTestnet: true
      };
    } else if (chainId === 8453) {
      return {
        name: 'Base Mainnet',
        chainId: 8453,
        isSupported: false,
        isTestnet: false,
        message: 'Contracts not yet deployed on Base Mainnet. Please switch to Base Sepolia for testing.'
      };
    } else {
      return {
        name: 'Unsupported Network',
        chainId,
        isSupported: false,
        isTestnet: false,
        message: 'Please switch to Base Sepolia (84532) to use OneSeed features.'
      };
    }
  };

  return {
    tokenBalances: (tokenBalances || []) as TokenBalance[],
    totalBalance,
    isLoading,
    getTokenBalance,
    getTokenBalances,
    fetchBalancesForTokens,
    getTokenAddress,
    getTokenId,
    isTokenRegistered,
    getTokenName,
    getTokenSymbol,
    getTokenDecimals,
    contractAddress,
    isContractsDeployed,
    isSavingsContractDeployed,
    getSupportedChainInfo,
    chainInfo: getSupportedChainInfo()
  };
}