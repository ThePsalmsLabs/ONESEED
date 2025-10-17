'use client';

import { useChainId } from 'wagmi';
import { getContractAddress } from '@/contracts/addresses';
import { 
  SavingStrategyABI, 
  SavingsABI, 
  TokenABI,
  DailySavingsABI,
  DCAABI,
  SlippageControlABI,
  SpendSaveHookABI
} from '@/contracts/abis';

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
    },
    dailySavings: {
      address: getContractAddress(chainId, 'DailySavings'),
      abi: DailySavingsABI
    },
    dca: {
      address: getContractAddress(chainId, 'DCA'),
      abi: DCAABI
    },
    slippageControl: {
      address: getContractAddress(chainId, 'SlippageControl'),
      abi: SlippageControlABI
    },
    spendSaveHook: {
      address: getContractAddress(chainId, 'SpendSaveHook'),
      abi: SpendSaveHookABI
    }
  };
}

