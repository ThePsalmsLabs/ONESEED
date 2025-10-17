import { useAccount, useWriteContract } from 'wagmi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { parseEther, formatEther } from 'viem';
import { CONTRACT_ADDRESSES } from '@/contracts/addresses';
import { TokenABI } from '@/contracts/abis';
import { 
  TokenInfo, 
  TokenTransfer,
  TransactionResult 
} from '@/contracts/types';

export function useToken() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const queryClient = useQueryClient();

  // Get token info by address
  const getTokenInfo = useQuery({
    queryKey: ['tokenInfo', address],
    queryFn: async (tokenAddress: `0x${string}`): Promise<TokenInfo | null> => {
      if (!address) return null;
      
      // This would need to be implemented based on the actual contract interface
      return {
        id: BigInt(0),
        address: tokenAddress,
        name: 'Unknown Token',
        symbol: 'UNK',
        decimals: 18,
        totalSupply: BigInt(0)
      };
    },
    enabled: !!address
  });

  // Get token balance for user
  const getTokenBalance = useQuery({
    queryKey: ['tokenBalance', address],
    queryFn: async (params: {
      tokenId: bigint;
    }): Promise<bigint> => {
      if (!address) return BigInt(0);
      
      // This would need to be implemented based on the actual contract interface
      return BigInt(0);
    },
    enabled: !!address
  });

  // Get batch token balances
  const getBatchTokenBalances = useQuery({
    queryKey: ['batchTokenBalances', address],
    queryFn: async (tokenIds: bigint[]): Promise<bigint[]> => {
      if (!address) return [];
      
      // This would need to be implemented based on the actual contract interface
      return tokenIds.map(() => BigInt(0));
    },
    enabled: !!address
  });

  // Get total supply for token
  const getTotalSupply = useQuery({
    queryKey: ['totalSupply', address],
    queryFn: async (tokenId: bigint): Promise<bigint> => {
      if (!address) return BigInt(0);
      
      // This would need to be implemented based on the actual contract interface
      return BigInt(0);
    },
    enabled: !!address
  });

  // Get allowance for token
  const getAllowance = useQuery({
    queryKey: ['allowance', address],
    queryFn: async (params: {
      owner: `0x${string}`;
      spender: `0x${string}`;
      tokenId: bigint;
    }): Promise<bigint> => {
      if (!address) return BigInt(0);
      
      // This would need to be implemented based on the actual contract interface
      return BigInt(0);
    },
    enabled: !!address
  });

  // Check if token is registered
  const isTokenRegistered = useQuery({
    queryKey: ['isTokenRegistered', address],
    queryFn: async (tokenAddress: `0x${string}`): Promise<boolean> => {
      if (!address) return false;
      
      // This would need to be implemented based on the actual contract interface
      return false;
    },
    enabled: !!address
  });

  // Register token
  const registerToken = useMutation({
    mutationFn: async (tokenAddress: `0x${string}`): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');
      
      const hash = await writeContract({
        address: CONTRACT_ADDRESSES[84532].Token as `0x${string}`,
        abi: TokenABI,
        functionName: 'registerToken',
        args: [tokenAddress]
      });

      return hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isTokenRegistered', address] });
    }
  });

  // Batch register tokens
  const batchRegisterTokens = useMutation({
    mutationFn: async (tokenAddresses: `0x${string}`[]): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');
      
      const hash = await writeContract({
        address: CONTRACT_ADDRESSES[84532].Token as `0x${string}`,
        abi: TokenABI,
        functionName: 'batchRegisterTokens',
        args: [tokenAddresses]
      });

      return hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isTokenRegistered', address] });
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
      
      const hash = await writeContract({
        address: CONTRACT_ADDRESSES[84532].Token as `0x${string}`,
        abi: TokenABI,
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
      
      const hash = await writeContract({
        address: CONTRACT_ADDRESSES[84532].Token as `0x${string}`,
        abi: TokenABI,
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
      
      const hash = await writeContract({
        address: CONTRACT_ADDRESSES[84532].Token as `0x${string}`,
        abi: TokenABI,
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
      
      const hash = await writeContract({
        address: CONTRACT_ADDRESSES[84532].Token as `0x${string}`,
        abi: TokenABI,
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
      
      const hash = await writeContract({
        address: CONTRACT_ADDRESSES[84532].Token as `0x${string}`,
        abi: TokenABI,
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
      
      const hash = await writeContract({
        address: CONTRACT_ADDRESSES[84532].Token as `0x${string}`,
        abi: TokenABI,
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
      
      const hash = await writeContract({
        address: CONTRACT_ADDRESSES[84532].Token as `0x${string}`,
        abi: TokenABI,
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
      
      const hash = await writeContract({
        address: CONTRACT_ADDRESSES[84532].Token as `0x${string}`,
        abi: TokenABI,
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
    // Queries
    tokenInfo: getTokenInfo.data,
    tokenBalance: getTokenBalance.data,
    batchBalances: getBatchTokenBalances.data,
    totalSupply: getTotalSupply.data,
    allowance: getAllowance.data,
    isRegistered: isTokenRegistered.data,
    
    // Loading states
    isLoadingInfo: getTokenInfo.isLoading,
    isLoadingBalance: getTokenBalance.isLoading,
    isLoadingBatch: getBatchTokenBalances.isLoading,
    isLoadingSupply: getTotalSupply.isLoading,
    isLoadingAllowance: getAllowance.isLoading,
    isLoadingRegistered: isTokenRegistered.isLoading,
    
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
    infoError: getTokenInfo.error,
    balanceError: getTokenBalance.error,
    batchError: getBatchTokenBalances.error,
    supplyError: getTotalSupply.error,
    allowanceError: getAllowance.error,
    registeredError: isTokenRegistered.error,
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
