'use client';

import { useAccount, usePublicClient } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { getContractAddress } from '@/contracts/addresses';
import { TokenModuleABI } from '@/contracts/abis/Token';
import { useSpendSaveContracts } from './useSpendSaveContracts';
import { useActiveChainId } from './useActiveChainId';

export interface TokenBalance {
  token: `0x${string}`;
  amount: bigint;
  decimals: number;
  symbol?: string;
  name?: string;
}

export function useSavingsBalance() {
  const { address } = useAccount();
  const chainId = useActiveChainId();
  const publicClient = usePublicClient();
  const contracts = useSpendSaveContracts();

  // Get contract address for current chain
  const contractAddress = getContractAddress(chainId, 'Token');

  // Fetch actual token balances from the contract
  const { data: tokenBalances, isLoading } = useQuery<TokenBalance[]>({
    queryKey: ['tokenBalances', address, chainId],
    queryFn: async (): Promise<TokenBalance[]> => {
      if (!address || !publicClient) return [];
      
      // Check if contracts are deployed on this chain
      if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
        console.warn(`Contracts not deployed on chain ${chainId}. Please switch to a supported network for testing.`);
        return [];
      }
      
      if (!contracts.savings.address || contracts.savings.address === '0x0000000000000000000000000000000000000000') {
        console.warn(`Savings contract not deployed on chain ${chainId}. Please switch to a supported network for testing.`);
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
    staleTime: 90000, // 90 seconds (increased from 30s)
    refetchInterval: 120000, // Refetch every 2 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
  });

  // Calculate total balance across all tokens
  const totalBalance = tokenBalances?.reduce((sum, balance) => sum + balance.amount, BigInt(0)) || BigInt(0);

  // Check if contracts are deployed on current chain
  const isContractsDeployed = contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000';
  const isSavingsContractDeployed = contracts.savings.address && contracts.savings.address !== '0x0000000000000000000000000000000000000000';
  
  // Get supported chain info
  const getSupportedChainInfo = () => {
    const isBaseSepolia = chainId === 84532;
    const isBaseMainnet = chainId === 8453;
    
    if (isBaseSepolia) {
      return {
        name: 'Base Sepolia',
        chainId: 84532,
        isSupported: true,
        isTestnet: true
      };
    } else if (isBaseMainnet) {
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
        message: 'Please switch to a supported network to use OneSeed features.'
      };
    }
  };

  return {
    tokenBalances: (tokenBalances || []) as TokenBalance[],
    totalBalance,
    isLoading,
    contractAddress,
    isContractsDeployed,
    isSavingsContractDeployed,
    getSupportedChainInfo,
    chainInfo: getSupportedChainInfo()
  };
}