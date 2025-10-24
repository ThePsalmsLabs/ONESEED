import { useAccount, usePublicClient } from 'wagmi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { parseEther } from 'viem';
import { getContractAddress } from '@/contracts/addresses';
import { TokenModuleABI } from '@/contracts/abis/Token';
import { useSmartContractWrite } from './useSmartContractWrite';
import { useActiveChainId } from './useActiveChainId';
import {
  TokenInfo
} from '@/contracts/types';

export function useToken() {
  const { address } = useAccount();
  const chainId = useActiveChainId();
  const queryClient = useQueryClient();
  const { write: writeSmartContract } = useSmartContractWrite();

  // Register token
  const registerToken = useMutation({
    mutationFn: async (tokenAddress: `0x${string}`): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');

      const hash = await writeSmartContract({
        address: getContractAddress(chainId, 'Token'),
        abi: TokenModuleABI,
        functionName: 'registerToken',
        args: [tokenAddress]
      });

      return hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isTokenRegistered'] });
    }
  });

  // Batch register tokens
  const batchRegisterTokens = useMutation({
    mutationFn: async (tokenAddresses: `0x${string}`[]): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');

      const hash = await writeSmartContract({
        address: getContractAddress(chainId, 'Token'),
        abi: TokenModuleABI,
        functionName: 'batchRegisterTokens',
        args: [tokenAddresses]
      });

      return hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isTokenRegistered'] });
    }
  });

  // Mint savings token
  const mintSavingsToken = useMutation({
    mutationFn: async (params: {
      tokenId: bigint;
      amount: string;
    }): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');

      const amountWei = parseEther(params.amount);

      const hash = await writeSmartContract({
        address: getContractAddress(chainId, 'Token'),
        abi: TokenModuleABI,
        functionName: 'mintSavingsToken',
        args: [address, params.tokenId, amountWei]
      });

      return hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tokenBalance', address] });
      queryClient.invalidateQueries({ queryKey: ['totalSupply', address] });
    }
  });

  // Batch mint savings tokens
  const batchMintSavingsTokens = useMutation({
    mutationFn: async (params: {
      tokenIds: bigint[];
      amounts: string[];
    }): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');

      const amountsWei = params.amounts.map(amount => parseEther(amount));

      const hash = await writeSmartContract({
        address: getContractAddress(chainId, 'Token'),
        abi: TokenModuleABI,
        functionName: 'batchMintSavingsTokens',
        args: [address, params.tokenIds, amountsWei]
      });

      return hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tokenBalance', address] });
      queryClient.invalidateQueries({ queryKey: ['totalSupply', address] });
    }
  });

  // Burn savings token
  const burnSavingsToken = useMutation({
    mutationFn: async (params: {
      tokenId: bigint;
      amount: string;
    }): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');

      const amountWei = parseEther(params.amount);

      const hash = await writeSmartContract({
        address: getContractAddress(chainId, 'Token'),
        abi: TokenModuleABI,
        functionName: 'burnSavingsToken',
        args: [address, params.tokenId, amountWei]
      });

      return hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tokenBalance', address] });
      queryClient.invalidateQueries({ queryKey: ['totalSupply', address] });
    }
  });

  // Batch burn savings tokens
  const batchBurnSavingsTokens = useMutation({
    mutationFn: async (params: {
      tokenIds: bigint[];
      amounts: string[];
    }): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');

      const amountsWei = params.amounts.map(amount => parseEther(amount));

      const hash = await writeSmartContract({
        address: getContractAddress(chainId, 'Token'),
        abi: TokenModuleABI,
        functionName: 'batchBurnSavingsTokens',
        args: [address, params.tokenIds, amountsWei]
      });

      return hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tokenBalance', address] });
      queryClient.invalidateQueries({ queryKey: ['totalSupply', address] });
    }
  });

  // Transfer token
  const transferToken = useMutation({
    mutationFn: async (params: {
      receiver: `0x${string}`;
      tokenId: bigint;
      amount: string;
    }): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');

      const amountWei = parseEther(params.amount);

      const hash = await writeSmartContract({
        address: getContractAddress(chainId, 'Token'),
        abi: TokenModuleABI,
        functionName: 'transfer',
        args: [address, params.receiver, params.tokenId, amountWei]
      });

      return hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tokenBalance', address] });
    }
  });

  // Batch transfer tokens
  const batchTransferTokens = useMutation({
    mutationFn: async (params: {
      from: `0x${string}`;
      to: `0x${string}`[];
      tokenIds: bigint[];
      amounts: string[];
    }): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');

      const amountsWei = params.amounts.map(amount => parseEther(amount));

      const hash = await writeSmartContract({
        address: getContractAddress(chainId, 'Token'),
        abi: TokenModuleABI,
        functionName: 'batchTransfer',
        args: [params.from, params.to, params.tokenIds, amountsWei]
      });

      return hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tokenBalance', address] });
    }
  });

  // Approve token
  const approveToken = useMutation({
    mutationFn: async (params: {
      spender: `0x${string}`;
      tokenId: bigint;
      amount: string;
    }): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');

      const amountWei = parseEther(params.amount);

      const hash = await writeSmartContract({
        address: getContractAddress(chainId, 'Token'),
        abi: TokenModuleABI,
        functionName: 'approve',
        args: [params.spender, params.tokenId, amountWei]
      });

      return hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allowance', address] });
    }
  });

  // Set operator
  const setOperator = useMutation({
    mutationFn: async (params: {
      operator: `0x${string}`;
      approved: boolean;
    }): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');

      const hash = await writeSmartContract({
        address: getContractAddress(chainId, 'Token'),
        abi: TokenModuleABI,
        functionName: 'setOperator',
        args: [params.operator, params.approved]
      });

      return hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allowance', address] });
    }
  });

  return {
    // Mutations
    registerToken: registerToken.mutateAsync,
    batchRegisterTokens: batchRegisterTokens.mutateAsync,
    mintSavingsToken: mintSavingsToken.mutateAsync,
    batchMintSavingsTokens: batchMintSavingsTokens.mutateAsync,
    burnSavingsToken: burnSavingsToken.mutateAsync,
    batchBurnSavingsTokens: batchBurnSavingsTokens.mutateAsync,
    transferToken: transferToken.mutateAsync,
    batchTransferTokens: batchTransferTokens.mutateAsync,
    approveToken: approveToken.mutateAsync,
    setOperator: setOperator.mutateAsync,

    // Mutation states
    isRegistering: registerToken.isPending,
    isBatchRegistering: batchRegisterTokens.isPending,
    isMinting: mintSavingsToken.isPending,
    isBatchMinting: batchMintSavingsTokens.isPending,
    isBurning: burnSavingsToken.isPending,
    isBatchBurning: batchBurnSavingsTokens.isPending,
    isTransferring: transferToken.isPending,
    isBatchTransferring: batchTransferTokens.isPending,
    isApproving: approveToken.isPending,
    isSettingOperator: setOperator.isPending,

    // Error states
    registerError: registerToken.error,
    batchRegisterError: batchRegisterTokens.error,
    mintError: mintSavingsToken.error,
    batchMintError: batchMintSavingsTokens.error,
    burnError: burnSavingsToken.error,
    batchBurnError: batchBurnSavingsTokens.error,
    transferError: transferToken.error,
    batchTransferError: batchTransferTokens.error,
    approveError: approveToken.error,
    setOperatorError: setOperator.error
  };
}

// Separate hooks for queries that can be used independently
export function useTokenInfo(tokenAddress: `0x${string}` | undefined) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const chainId = useActiveChainId();

  return useQuery({
    queryKey: ['tokenInfo', tokenAddress],
    queryFn: async (): Promise<TokenInfo | null> => {
      if (!address || !publicClient || !tokenAddress) return null;

      try {
        // Get token ID from Token contract
        const tokenId = await publicClient.readContract({
          address: getContractAddress(chainId, 'Token'),
          abi: TokenModuleABI,
          functionName: 'getTokenId',
          args: [tokenAddress]
        });

        // Get token metadata
        const [name, symbol, decimals, totalSupply] = await Promise.all([
          publicClient.readContract({
            address: getContractAddress(chainId, 'Token'),
            abi: TokenModuleABI,
            functionName: 'name',
            args: [tokenId]
          }).catch(() => 'Unknown Token'),
          publicClient.readContract({
            address: getContractAddress(chainId, 'Token'),
            abi: TokenModuleABI,
            functionName: 'symbol',
            args: [tokenId]
          }).catch(() => 'UNK'),
          publicClient.readContract({
            address: getContractAddress(chainId, 'Token'),
            abi: TokenModuleABI,
            functionName: 'decimals',
            args: [tokenId]
          }).catch(() => 18),
          publicClient.readContract({
            address: getContractAddress(chainId, 'Token'),
            abi: TokenModuleABI,
            functionName: 'totalSupply',
            args: [tokenId]
          }).catch(() => BigInt(0))
        ]);

        return {
          id: tokenId,
          address: tokenAddress,
          name: name as string,
          symbol: symbol as string,
          decimals: Number(decimals),
          totalSupply: totalSupply as bigint
        };
      } catch (error) {
        console.error('Error fetching token info:', error);
        return null;
      }
    },
    enabled: !!address && !!tokenAddress
  });
}

export function useTokenBalance(tokenId: bigint | undefined) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const chainId = useActiveChainId();

  return useQuery({
    queryKey: ['tokenBalance', address, tokenId],
    queryFn: async (): Promise<bigint> => {
      if (!address || !publicClient || !tokenId) return BigInt(0);

      try {
        const balance = await publicClient.readContract({
          address: getContractAddress(chainId, 'Token'),
          abi: TokenModuleABI,
          functionName: 'balanceOf',
          args: [address, tokenId]
        });
        return balance as bigint;
      } catch (error) {
        console.error('Error fetching token balance:', error);
        return BigInt(0);
      }
    },
    enabled: !!address && !!tokenId
  });
}

export function useBatchTokenBalances(tokenIds: bigint[]) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const chainId = useActiveChainId();

  return useQuery({
    queryKey: ['batchTokenBalances', address, tokenIds],
    queryFn: async (): Promise<bigint[]> => {
      if (!address || !publicClient) return [];

      try {
        const balances = await publicClient.readContract({
          address: getContractAddress(chainId, 'Token'),
          abi: TokenModuleABI,
          functionName: 'balanceOfBatch',
          args: [address, tokenIds]
        });
        return balances as bigint[];
      } catch (error) {
        console.error('Error fetching batch token balances:', error);
        return tokenIds.map(() => BigInt(0));
      }
    },
    enabled: !!address && tokenIds.length > 0
  });
}

export function useTotalSupply(tokenId: bigint | undefined) {
  const publicClient = usePublicClient();
  const chainId = useActiveChainId();

  return useQuery({
    queryKey: ['totalSupply', tokenId],
    queryFn: async (): Promise<bigint> => {
      if (!publicClient || !tokenId) return BigInt(0);

      try {
        const totalSupply = await publicClient.readContract({
          address: getContractAddress(chainId, 'Token'),
          abi: TokenModuleABI,
          functionName: 'totalSupply',
          args: [tokenId]
        });
        return totalSupply as bigint;
      } catch (error) {
        console.error('Error fetching total supply:', error);
        return BigInt(0);
      }
    },
    enabled: !!tokenId
  });
}

export function useAllowance(params: {
  owner?: `0x${string}`;
  spender?: `0x${string}`;
  tokenId?: bigint;
}) {
  const publicClient = usePublicClient();
  const chainId = useActiveChainId();

  return useQuery({
    queryKey: ['allowance', params.owner, params.spender, params.tokenId],
    queryFn: async (): Promise<bigint> => {
      if (!publicClient || !params.owner || !params.spender || !params.tokenId) return BigInt(0);

      try {
        const allowance = await publicClient.readContract({
          address: getContractAddress(chainId, 'Token'),
          abi: TokenModuleABI,
          functionName: 'allowance',
          args: [params.owner, params.spender, params.tokenId]
        });
        return allowance as bigint;
      } catch (error) {
        console.error('Error fetching allowance:', error);
        return BigInt(0);
      }
    },
    enabled: !!params.owner && !!params.spender && !!params.tokenId
  });
}

export function useIsTokenRegistered(tokenAddress: `0x${string}` | undefined) {
  const publicClient = usePublicClient();
  const chainId = useActiveChainId();

  return useQuery({
    queryKey: ['isTokenRegistered', tokenAddress],
    queryFn: async (): Promise<boolean> => {
      if (!publicClient || !tokenAddress) return false;

      try {
        const isRegistered = await publicClient.readContract({
          address: getContractAddress(chainId, 'Token'),
          abi: TokenModuleABI,
          functionName: 'isTokenRegistered',
          args: [tokenAddress]
        });
        return isRegistered as boolean;
      } catch (error) {
        console.error('Error checking token registration:', error);
        return false;
      }
    },
    enabled: !!tokenAddress
  });
}
