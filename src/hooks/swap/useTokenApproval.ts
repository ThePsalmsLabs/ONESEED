'use client';

import { useState, useEffect } from 'react';
import { Address, erc20Abi, maxUint256 } from 'viem';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

interface UseTokenApprovalProps {
  tokenAddress?: Address;
  spenderAddress: Address;
  amount: bigint;
  enabled?: boolean;
}

export function useTokenApproval({
  tokenAddress,
  spenderAddress,
  amount,
  enabled = true,
}: UseTokenApprovalProps) {
  const { address: userAddress } = useAccount();
  const [needsApproval, setNeedsApproval] = useState(false);
  
  // Check current allowance
  const {
    data: allowance,
    isLoading: isLoadingAllowance,
    refetch: refetchAllowance,
  } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: userAddress && tokenAddress ? [userAddress, spenderAddress] : undefined,
    query: {
      enabled: enabled && !!userAddress && !!tokenAddress,
    },
  });
  
  // Approve transaction
  const {
    writeContract,
    data: approvalHash,
    isPending: isApproving,
    error: approvalError,
  } = useWriteContract();
  
  // Wait for approval transaction
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash: approvalHash,
  });
  
  // Check if approval is needed
  useEffect(() => {
    if (allowance !== undefined && amount > BigInt(0)) {
      setNeedsApproval(allowance < amount);
    } else {
      setNeedsApproval(false);
    }
  }, [allowance, amount]);
  
  // Refetch allowance after approval is confirmed
  useEffect(() => {
    if (isConfirmed) {
      refetchAllowance();
    }
  }, [isConfirmed, refetchAllowance]);
  
  const approve = async (useMaxApproval = true) => {
    if (!tokenAddress || !userAddress) {
      throw new Error('Token address or user address not available');
    }
    
    // Use max approval or exact amount
    const approvalAmount = useMaxApproval ? maxUint256 : amount;
    
    return writeContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'approve',
      args: [spenderAddress, approvalAmount],
    });
  };
  
  return {
    needsApproval,
    allowance: allowance || BigInt(0),
    approve,
    isLoadingAllowance,
    isApproving,
    isConfirming,
    isConfirmed,
    approvalError,
    approvalHash,
  };
}

