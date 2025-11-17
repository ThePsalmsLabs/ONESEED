'use client';

import { useState, useCallback } from 'react';
import { useBiconomy } from '@/components/BiconomyProvider';
import { useToast } from '@/components/ui/Toast';
import { PAYMASTER_POLICIES, getApplicablePolicy, calculateGasSponsorship } from '@/config/paymasterPolicies';
import { useAccount } from 'wagmi';
import { useReadContract } from 'wagmi';
import { useActiveChainId } from './useActiveChainId';
import { getContractAddress } from '@/contracts/addresses';
import { SavingsModuleABI } from '@/contracts/abis/Savings';

interface PaymasterServiceData {
  mode: 'SPONSORED' | 'PARTIAL' | 'NONE';
  sponsorshipPolicy?: string;
  userPays?: bigint;
  sponsorPays?: bigint;
  calculateGasLimits?: boolean;
}

export function useSmartPaymaster() {
  const { smartAccount, smartAccountAddress } = useBiconomy();
  const { address: eoaAddress } = useAccount();
  const chainId = useActiveChainId();
  const [isCalculating, setIsCalculating] = useState(false);

  // Use Smart Account address if available, fallback to EOA
  const address = smartAccountAddress || eoaAddress;

  // Get user's savings balance for policy determination
  const { data: userBalance } = useReadContract({
    address: getContractAddress(chainId, 'Savings'),
    abi: SavingsModuleABI,
    functionName: 'getUserSavings',
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address
    }
  });

  const getPaymasterServiceData = useCallback(async (
    operation: string,
    gasEstimate: bigint
  ): Promise<PaymasterServiceData> => {
    if (!smartAccount || !address) {
      return { mode: 'NONE' };
    }

    setIsCalculating(true);
    try {
      // Get user's balance and activity data
      const balance = typeof userBalance === 'bigint' ? userBalance : BigInt(0);
      const stakingAmount = BigInt(0); // Would need to fetch from staking contract
      const daysActive = 1; // Would need to track user registration date

      // Get applicable policy
      const policy = getApplicablePolicy(operation, balance, stakingAmount, daysActive);
      
      if (!policy) {
        return { mode: 'NONE' };
      }

      // Calculate gas sponsorship
      const { userPays, sponsorPays } = calculateGasSponsorship(policy, gasEstimate);

      if (userPays === BigInt(0)) {
        return {
          mode: 'SPONSORED',
          sponsorshipPolicy: policy.operations[0],
          userPays: BigInt(0),
          sponsorPays,
          calculateGasLimits: true
        };
      } else if (sponsorPays > BigInt(0)) {
        return {
          mode: 'PARTIAL',
          sponsorshipPolicy: policy.operations[0],
          userPays,
          sponsorPays,
          calculateGasLimits: true
        };
      } else {
        return { mode: 'NONE' };
      }
    } catch (error) {
      console.error('Error calculating paymaster service data:', error);
      return { mode: 'NONE' };
    } finally {
      setIsCalculating(false);
    }
  }, [smartAccount, address, userBalance]);

  const getGasSavings = useCallback(async (operation: string, gasEstimate: bigint) => {
    const paymasterData = await getPaymasterServiceData(operation, gasEstimate);
    
    if (paymasterData.mode === 'SPONSORED') {
      return {
        userPays: BigInt(0),
        sponsorPays: gasEstimate,
        savings: gasEstimate,
        savingsPercentage: 100
      };
    } else if (paymasterData.mode === 'PARTIAL') {
      const savings = gasEstimate - (paymasterData.userPays || BigInt(0));
      const savingsPercentage = Number((savings * BigInt(100)) / gasEstimate);
      
      return {
        userPays: paymasterData.userPays || BigInt(0),
        sponsorPays: paymasterData.sponsorPays || BigInt(0),
        savings,
        savingsPercentage
      };
    } else {
      return {
        userPays: gasEstimate,
        sponsorPays: BigInt(0),
        savings: BigInt(0),
        savingsPercentage: 0
      };
    }
  }, [getPaymasterServiceData]);

  const getPolicyInfo = useCallback((operation: string) => {
    const balance = typeof userBalance === 'bigint' ? userBalance : BigInt(0);
    const stakingAmount = BigInt(0);
    const daysActive = 1;
    
    const policy = getApplicablePolicy(operation, balance, stakingAmount, daysActive);
    
    if (!policy) {
      return {
        name: 'No Policy',
        description: 'User pays full gas',
        benefits: []
      };
    }

    const policyNames: Record<string, string> = {
      firstTimeSetup: 'First-Time Setup',
      dailyOperations: 'Daily Operations',
      withdrawals: 'Subsidized Withdrawals',
      premiumUsers: 'Premium User',
      loyalUsers: 'Loyal User',
      emergencyWithdrawals: 'Emergency Withdrawal',
      batchOperations: 'Batch Operations'
    };

    const policyDescriptions: Record<string, string> = {
      firstTimeSetup: 'Free setup for new users',
      dailyOperations: 'Free daily savings and DCA execution',
      withdrawals: '50% gas sponsorship for withdrawals',
      premiumUsers: 'Free gas for high-value users',
      loyalUsers: 'Free gas for loyal users',
      emergencyWithdrawals: 'Free emergency withdrawals',
      batchOperations: '75% gas sponsorship for batch operations'
    };

    const policyBenefits: Record<string, string[]> = {
      firstTimeSetup: ['Free first-time setup', 'No gas required'],
      dailyOperations: ['Free daily execution', 'Automated savings'],
      withdrawals: ['50% gas savings', 'Affordable withdrawals'],
      premiumUsers: ['100% gas sponsorship', 'All operations free'],
      loyalUsers: ['Free recurring operations', 'Loyalty rewards'],
      emergencyWithdrawals: ['Free emergency access', 'High-value protection'],
      batchOperations: ['75% gas savings', 'Efficient batch operations']
    };

    return {
      name: policyNames[Object.keys(PAYMASTER_POLICIES).find(key => PAYMASTER_POLICIES[key] === policy) || ''],
      description: policyDescriptions[Object.keys(PAYMASTER_POLICIES).find(key => PAYMASTER_POLICIES[key] === policy) || ''],
      benefits: policyBenefits[Object.keys(PAYMASTER_POLICIES).find(key => PAYMASTER_POLICIES[key] === policy) || '']
    };
  }, [userBalance]);

  return {
    getPaymasterServiceData,
    getGasSavings,
    getPolicyInfo,
    isCalculating
  };
}
