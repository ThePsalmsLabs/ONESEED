import { parseEther } from 'viem';

export interface PaymasterPolicy {
  maxGasPerUser?: bigint;
  maxGasPerDay?: bigint;
  maxGasPerMonth?: bigint;
  operations: string[];
  oneTimeOnly?: boolean;
  resetPeriod?: number; // seconds
  userPays?: number; // percentage
  sponsorPays?: number; // percentage
  minSavingsBalance?: bigint;
  requirement?: {
    minBalance?: bigint;
    stakingAmount?: bigint;
  };
}

export const PAYMASTER_POLICIES: Record<string, PaymasterPolicy> = {
  // Free onboarding - first-time user setup
  firstTimeSetup: {
    maxGasPerUser: parseEther('0.01'), // First setup free up to $3
    operations: ['setSavingStrategy'],
    oneTimeOnly: true
  },
  
  // Free daily operations
  dailyOperations: {
    maxGasPerDay: parseEther('0.005'), // $1.50/day max
    operations: ['executeDailySavings', 'executeDCA'],
    resetPeriod: 86400 // 24 hours
  },
  
  // Subsidized withdrawals
  withdrawals: {
    userPays: 50, // User pays 50% gas
    sponsorPays: 50, // Protocol pays 50%
    operations: ['withdraw'],
    minSavingsBalance: parseEther('10') // Only if balance > $10
  },
  
  // Free for high-value users
  premiumUsers: {
    maxGasPerMonth: parseEther('0.1'), // $30/month
    operations: ['*'], // All operations free
    requirement: {
      minBalance: parseEther('1000'), // $1000+ saved
      stakingAmount: parseEther('500') // OR staking $500
    }
  },
  
  // Free for loyal users (30+ days)
  loyalUsers: {
    maxGasPerMonth: parseEther('0.05'), // $15/month
    operations: ['executeDailySavings', 'executeDCA', 'withdraw'],
    requirement: {
      minBalance: parseEther('100') // $100+ saved for 30+ days
    }
  },
  
  // Emergency withdrawals (always free)
  emergencyWithdrawals: {
    operations: ['withdraw'],
    userPays: 0,
    sponsorPays: 100,
    requirement: {
      minBalance: parseEther('1000') // Only for high-value users
    }
  },
  
  // Batch operations (discounted)
  batchOperations: {
    userPays: 25, // User pays 25% gas
    sponsorPays: 75, // Protocol pays 75%
    operations: ['batchSavingsSetup', 'batchWithdraw'],
    maxGasPerUser: parseEther('0.02') // Up to $6 per batch
  }
};

export function getApplicablePolicy(
  operation: string,
  userBalance: bigint,
  userStakingAmount: bigint,
  daysActive: number
): PaymasterPolicy | null {
  // Check premium users first
  if (PAYMASTER_POLICIES.premiumUsers.requirement && 
      PAYMASTER_POLICIES.premiumUsers.requirement.minBalance !== undefined &&
      PAYMASTER_POLICIES.premiumUsers.requirement.stakingAmount !== undefined &&
      (userBalance >= PAYMASTER_POLICIES.premiumUsers.requirement.minBalance ||
       userStakingAmount >= PAYMASTER_POLICIES.premiumUsers.requirement.stakingAmount)) {
    return PAYMASTER_POLICIES.premiumUsers;
  }
  
  // Check loyal users
  if (PAYMASTER_POLICIES.loyalUsers.requirement && 
      PAYMASTER_POLICIES.loyalUsers.requirement.minBalance !== undefined &&
      daysActive >= 30 && userBalance >= PAYMASTER_POLICIES.loyalUsers.requirement.minBalance) {
    return PAYMASTER_POLICIES.loyalUsers;
  }
  
  // Check emergency withdrawals
  if (PAYMASTER_POLICIES.emergencyWithdrawals.requirement && 
      PAYMASTER_POLICIES.emergencyWithdrawals.requirement.minBalance !== undefined &&
      operation === 'withdraw' && userBalance >= PAYMASTER_POLICIES.emergencyWithdrawals.requirement.minBalance) {
    return PAYMASTER_POLICIES.emergencyWithdrawals;
  }
  
  // Check batch operations
  if (operation.startsWith('batch')) {
    return PAYMASTER_POLICIES.batchOperations;
  }
  
  // Check daily operations
  if (['executeDailySavings', 'executeDCA'].includes(operation)) {
    return PAYMASTER_POLICIES.dailyOperations;
  }
  
  // Check withdrawals
  if (operation === 'withdraw') {
    return PAYMASTER_POLICIES.withdrawals;
  }
  
  // Check first-time setup
  if (operation === 'setSavingStrategy') {
    return PAYMASTER_POLICIES.firstTimeSetup;
  }
  
  return null;
}

export function calculateGasSponsorship(
  policy: PaymasterPolicy,
  gasCost: bigint
): { userPays: bigint; sponsorPays: bigint } {
  if (policy.userPays === 0) {
    return { userPays: BigInt(0), sponsorPays: gasCost };
  }
  
  if (policy.sponsorPays === 0) {
    return { userPays: gasCost, sponsorPays: BigInt(0) };
  }
  
  const userPays = (gasCost * BigInt(policy.userPays!)) / BigInt(100);
  const sponsorPays = gasCost - userPays;
  
  return { userPays, sponsorPays };
}
