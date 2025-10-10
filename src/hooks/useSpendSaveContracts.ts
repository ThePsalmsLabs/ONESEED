'use client';

import { useChainId } from 'wagmi';
import { getContractAddress } from '@/contracts/addresses';
import { SavingStrategyABI, SavingsABI, TokenABI } from '@/contracts/abis';

export function useSpendSaveContracts() {
  const chainId = useChainId();

  return {
    savingStrategy: {
      address: getContractAddress(chainId, 'SavingStrategy'),
      abi: SavingStrategyABI
    },
    savings: {
      address: getContractAddress(chainId, 'Savings'),
      abi: SavingsABI
    },
    token: {
      address: getContractAddress(chainId, 'Token'),
      abi: TokenABI
    }
  };
}

