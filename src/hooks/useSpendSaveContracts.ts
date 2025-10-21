'use client';

import { useChainId } from 'wagmi';
import { getContractAddress } from '@/contracts/addresses';
import { SavingsStrategyABI as SavingStrategyABI } from '@/contracts/abis/SavingStrategy';
import { SavingsModuleABI as SavingsABI } from '@/contracts/abis/Savings';
import { TokenModuleABI as TokenABI } from '@/contracts/abis/Token';
import { DailySavingsABI } from '@/contracts/abis/DailySavings';
import { DCA as DCAABI } from '@/contracts/abis/DCA';
import { SlippageControlABI } from '@/contracts/abis/SlippageControl';
import { SpendSaveHookABI } from '@/contracts/abis/SpendSaveHook';

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

