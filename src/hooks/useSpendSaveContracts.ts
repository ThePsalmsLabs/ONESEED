'use client';

import { useActiveChainId } from './useActiveChainId';
import { getContractAddress } from '@/contracts/addresses';
import { SavingsStrategyABI } from '@/contracts/abis/SavingStrategy';
import { SavingsModuleABI } from '@/contracts/abis/Savings';
import { TokenModuleABI } from '@/contracts/abis/Token';
import { DailySavingsABI } from '@/contracts/abis/DailySavings';
import { DCAABI } from '@/contracts/abis/DCA';
import { SlippageControlABI } from '@/contracts/abis/SlippageControl';
import { SpendSaveHookABI } from '@/contracts/abis/SpendSaveHook';

export function useSpendSaveContracts() {
  const chainId = useActiveChainId();

  return {
    savingStrategy: {
      address: getContractAddress(chainId, 'SavingStrategy'),
      abi: SavingsStrategyABI
    },
    savings: {
      address: getContractAddress(chainId, 'Savings'),
      abi: SavingsModuleABI
    },
    token: {
      address: getContractAddress(chainId, 'Token'),
      abi: TokenModuleABI
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

