'use client';

import { useAccount, usePublicClient } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { getContractAddress } from '@/contracts/addresses';
import { TokenModuleABI } from '@/contracts/abis/Token';
import { useSpendSaveContracts } from './useSpendSaveContracts';
import { useActiveChainId } from './useActiveChainId';
import { useBiconomy } from '@/components/BiconomyProvider';

export interface TokenBalance {
  token: `0x${string}`;
  tokenId: bigint; // ERC6909 token ID
  amount: bigint; // ERC6909 balance (primary)
  storageBalance?: bigint; // Storage balance (for reference/verification)
  decimals: number;
  symbol?: string;
  name?: string;
}

export function useSavingsBalance() {
  const { address: eoaAddress } = useAccount();
  const { smartAccountAddress } = useBiconomy();
  const chainId = useActiveChainId();
  const publicClient = usePublicClient();
  const contracts = useSpendSaveContracts();

  // Use Smart Account address if available, fallback to EOA
  const address = smartAccountAddress || eoaAddress;

  // Get contract address for current chain
  const contractAddress = getContractAddress(chainId, 'Token');

  console.log('🔍 useSavingsBalance - Address check:', {
    eoaAddress,
    smartAccountAddress,
    addressUsed: address,
    chainId,
    savingsContract: contracts.savings.address
  });

  // Fetch actual token balances from the contract
  const { data: tokenBalances, isLoading } = useQuery<TokenBalance[]>({
    queryKey: ['tokenBalances', address, chainId],
    queryFn: async (): Promise<TokenBalance[]> => {
      if (!address || !publicClient) {
        console.warn('❌ Missing address or publicClient');
        return [];
      }
      
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
        console.log('📞 Calling getUserSavings with address:', address);

        // Get user's savings data from Savings contract
        const savingsData = await publicClient.readContract({
          address: contracts.savings.address as `0x${string}`,
          abi: contracts.savings.abi,
          functionName: 'getUserSavings',
          args: [address as `0x${string}`]
        });

        console.log('📊 getUserSavings response:', savingsData);

        const [tokens, amounts] = savingsData as [readonly `0x${string}`[], readonly bigint[]];

        console.log('🪙 Tokens found:', {
          tokens,
          amounts: amounts?.map(a => a.toString()),
          count: tokens?.length || 0
        });

        if (!tokens || tokens.length === 0) {
          console.warn('⚠️ No tokens returned from getUserSavings');
          return [];
        }

        const balances: TokenBalance[] = [];

        // Process each token
        for (let i = 0; i < tokens.length; i++) {
          const tokenAddress = tokens[i];
          const amount = amounts[i];

          // Skip tokens with zero balance
          if (amount === BigInt(0)) continue;

          try {
            // Get token ID from Token contract (ERC6909 mapping)
            const tokenId = await publicClient.readContract({
              address: contractAddress,
              abi: TokenModuleABI,
              functionName: 'getTokenId',
              args: [tokenAddress]
            }) as bigint;

            // If token not registered (tokenId = 0), register it first
            let registeredTokenId = tokenId;
            if (tokenId === BigInt(0)) {
              console.log(`⚠️ Token ${tokenAddress} not registered, attempting registration...`);
              // Note: Registration requires a write transaction, so we'll just use 0 for now
              // In production, tokens should be registered automatically when first savings occur
            }

            // Query ERC6909 balance using tokenId (PRIMARY SOURCE OF TRUTH)
            const erc6909Balance = await publicClient.readContract({
              address: contractAddress,
              abi: TokenModuleABI,
              functionName: 'balanceOf',
              args: [address as `0x${string}`, registeredTokenId]
            }).catch((error) => {
              console.warn(`Failed to query ERC6909 balance for tokenId ${registeredTokenId}, using storage balance as fallback:`, error);
              return amount; // Fallback to storage balance
            }) as bigint;

            // Get token metadata
            // If token is not registered (tokenId = 0), fetch directly from token contract (ERC20)
            // Otherwise, fetch from Token module (ERC6909 metadata)
            let name: string, symbol: string, decimals: number;
            
            if (registeredTokenId === BigInt(0)) {
              // Token not registered - fetch metadata directly from token contract
              const erc20Abi = [
                { inputs: [], name: 'name', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
                { inputs: [], name: 'symbol', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
                { inputs: [], name: 'decimals', outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }], stateMutability: 'view', type: 'function' },
              ] as const;
              
              [name, symbol, decimals] = await Promise.all([
                publicClient.readContract({
                  address: tokenAddress,
                  abi: erc20Abi,
                  functionName: 'name'
                }).catch(() => 'Unknown Token'),
                publicClient.readContract({
                  address: tokenAddress,
                  abi: erc20Abi,
                  functionName: 'symbol'
                }).catch(() => 'UNK'),
                publicClient.readContract({
                  address: tokenAddress,
                  abi: erc20Abi,
                  functionName: 'decimals'
                }).catch(() => 18)
              ]);
            } else {
              // Token is registered - fetch from Token module (ERC6909)
              [name, symbol, decimals] = await Promise.all([
                publicClient.readContract({
                  address: contractAddress,
                  abi: TokenModuleABI,
                  functionName: 'name',
                  args: [registeredTokenId]
                }).catch(() => 'Unknown Token'),
                publicClient.readContract({
                  address: contractAddress,
                  abi: TokenModuleABI,
                  functionName: 'symbol',
                  args: [registeredTokenId]
                }).catch(() => 'UNK'),
                publicClient.readContract({
                  address: contractAddress,
                  abi: TokenModuleABI,
                  functionName: 'decimals',
                  args: [registeredTokenId]
                }).catch(() => 18)
              ]);
            }

            // Use ERC6909 balance if available, otherwise use storage balance
            const finalBalance = registeredTokenId > BigInt(0) && erc6909Balance > BigInt(0) 
              ? erc6909Balance 
              : amount; // Fallback to storage balance

            console.log(`✅ Token Info:`, {
              tokenAddress,
              tokenId: registeredTokenId.toString(),
              isRegistered: registeredTokenId > BigInt(0),
              erc6909Balance: erc6909Balance.toString(),
              storageBalance: amount.toString(),
              finalBalance: finalBalance.toString(),
              symbol: symbol as string,
              usingFallback: registeredTokenId === BigInt(0) || erc6909Balance === BigInt(0)
            });

            balances.push({
              token: tokenAddress,
              tokenId: registeredTokenId,
              amount: finalBalance, // Use ERC6909 balance if available, else storage
              storageBalance: amount, // Keep storage balance for reference
              decimals: Number(decimals),
              symbol: symbol as string,
              name: name as string
            });
          } catch (error) {
            console.error(`Error fetching ERC6909 data for token ${tokenAddress}:`, error);
            // Add token with basic info if ERC6909 queries fail
            balances.push({
              token: tokenAddress,
              tokenId: BigInt(0), // Unknown tokenId
              amount, // Use storage balance as fallback
              storageBalance: amount,
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