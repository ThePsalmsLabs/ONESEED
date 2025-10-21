/**
 * Daily Savings Module Contract ABI
 * TypeScript Definition
 * Automated daily savings with goals, penalties, and yield strategies
 */

export const DailySavingsABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AlreadyInitialized",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "required",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "available",
        type: "uint256",
      },
    ],
    name: "InsufficientAllowance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "required",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "available",
        type: "uint256",
      },
    ],
    name: "InsufficientBalance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "available",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "required",
        type: "uint256",
      },
    ],
    name: "InsufficientGas",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "required",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "available",
        type: "uint256",
      },
    ],
    name: "InsufficientSavings",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidEndTime",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidPenalty",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidToken",
    type: "error",
  },
  {
    inputs: [],
    name: "NoSavingsConfigured",
    type: "error",
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentered",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "TokenNotRegistered",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "UnauthorizedCaller",
    type: "error",
  },
  {
    inputs: [],
    name: "WithdrawalFailed",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenCount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalSaved",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "gasUsed",
        type: "uint256",
      },
    ],
    name: "BatchProcessingCompleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "dailyAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "goalAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
    ],
    name: "DailySavingsConfigured",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "DailySavingsDisabled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "gasUsed",
        type: "uint256",
      },
    ],
    name: "DailySavingsExecuted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "DailySavingsExecutionSkipped",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalAmount",
        type: "uint256",
      },
    ],
    name: "DailySavingsGoalReached",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "penalty",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "goalReached",
        type: "bool",
      },
    ],
    name: "DailySavingsWithdrawn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "enum SpendSaveStorage.YieldStrategy",
        name: "strategy",
        type: "uint8",
      },
    ],
    name: "DailySavingsYieldStrategySet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "ModuleReferencesSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "TransferError",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "YieldModuleNotInitialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "enum SpendSaveStorage.YieldStrategy",
        name: "strategy",
        type: "uint8",
      },
    ],
    name: "YieldStrategyApplied",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "YieldStrategyFailed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "dailyAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "goalAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "penaltyBps",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
    ],
    name: "configureDailySavings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "disableDailySavings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "executeDailySavings",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "executeDailySavingsForToken",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "executeTokenSavings",
    outputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "getDailyExecutionStatus",
    outputs: [
      {
        internalType: "bool",
        name: "canExecute",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "daysPassed",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountToSave",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "getDailySavingsStatus",
    outputs: [
      {
        internalType: "bool",
        name: "enabled",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "dailyAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "goalAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currentAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "remainingAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "penaltyAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "estimatedCompletionDate",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "hasPendingDailySavings",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract SpendSaveStorage",
        name: "_storage",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "enum SpendSaveStorage.YieldStrategy",
        name: "strategy",
        type: "uint8",
      },
    ],
    name: "setDailySavingsYieldStrategy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "savingStrategy",
        type: "address",
      },
      {
        internalType: "address",
        name: "savings",
        type: "address",
      },
      {
        internalType: "address",
        name: "dca",
        type: "address",
      },
      {
        internalType: "address",
        name: "slippage",
        type: "address",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "dailySavings",
        type: "address",
      },
    ],
    name: "setModuleReferences",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "storage_",
    outputs: [
      {
        internalType: "contract SpendSaveStorage",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenModule",
    outputs: [
      {
        internalType: "contract ITokenModule",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdrawDailySavings",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "yieldModule",
    outputs: [
      {
        internalType: "contract IYieldModule",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Enum for YieldStrategy (from SpendSaveStorage)
export enum YieldStrategy {
  NONE = 0,
  COMPOUND = 1,
  LIQUIDITY_POOL = 2,
  LENDING = 3,
}

// Type definitions

export interface DailySavingsConfig {
  user: string;
  token: string;
  dailyAmount: bigint;
  goalAmount: bigint;
  penaltyBps: number; // basis points (100 = 1%)
  endTime: bigint; // Unix timestamp
}

export interface DailySavingsStatus {
  enabled: boolean;
  dailyAmount: bigint;
  goalAmount: bigint;
  currentAmount: bigint;
  remainingAmount: bigint;
  penaltyAmount: bigint;
  estimatedCompletionDate: bigint;
}

export interface ExecutionStatus {
  canExecute: boolean;
  daysPassed: bigint;
  amountToSave: bigint;
}

export interface WithdrawalResult {
  amountWithdrawn: bigint;
  penaltyApplied: bigint;
  goalReached: boolean;
}

export interface BatchExecutionResult {
  tokenCount: number;
  totalSaved: bigint;
  gasUsed: bigint;
}

export interface SavingsProgress {
  percentComplete: number;
  daysElapsed: number;
  daysRemaining: number;
  onTrack: boolean;
}

// Helper types
export type Address = `0x${string}`;
export type BasisPoints = number;
export type UnixTimestamp = bigint;

// Helper functions

/**
 * Calculate savings progress percentage
 * @param currentAmount - Amount saved so far
 * @param goalAmount - Target goal amount
 * @returns Progress percentage (0-100)
 */
export const calculateProgress = (
  currentAmount: bigint,
  goalAmount: bigint
): number => {
  if (goalAmount === BigInt(0)) return 0;
  return Math.min(Number((currentAmount * BigInt(100)) / goalAmount), 100);
};

/**
 * Calculate days remaining until goal completion
 * @param currentAmount - Current savings
 * @param goalAmount - Goal amount
 * @param dailyAmount - Daily savings amount
 * @returns Estimated days remaining
 */
export const calculateDaysRemaining = (
  currentAmount: bigint,
  goalAmount: bigint,
  dailyAmount: bigint
): number => {
  if (dailyAmount === BigInt(0) || currentAmount >= goalAmount) return 0;
  const remaining = goalAmount - currentAmount;
  return Math.ceil(Number(remaining / dailyAmount));
};

/**
 * Calculate penalty amount for early withdrawal
 * @param amount - Amount to withdraw
 * @param penaltyBps - Penalty in basis points
 * @returns Penalty amount
 */
export const calculatePenalty = (
  amount: bigint,
  penaltyBps: number
): bigint => {
  return (amount * BigInt(penaltyBps)) / BigInt(10000);
};

/**
 * Calculate net amount after penalty
 * @param amount - Gross amount
 * @param penaltyBps - Penalty in basis points
 * @returns Net amount after penalty
 */
export const calculateNetAfterPenalty = (
  amount: bigint,
  penaltyBps: number
): bigint => {
  const penalty = calculatePenalty(amount, penaltyBps);
  return amount - penalty;
};

/**
 * Check if goal deadline has passed
 * @param endTime - Goal end time (Unix timestamp)
 * @returns True if deadline has passed
 */
export const isDeadlinePassed = (endTime: bigint): boolean => {
  return endTime > BigInt(0) && BigInt(Math.floor(Date.now() / 1000)) > endTime;
};

/**
 * Check if savings plan is on track
 * @param currentAmount - Current savings
 * @param goalAmount - Goal amount
 * @param startTime - Start timestamp
 * @param endTime - End timestamp
 * @returns True if on track or ahead
 */
export const isOnTrack = (
  currentAmount: bigint,
  goalAmount: bigint,
  startTime: bigint,
  endTime: bigint
): boolean => {
  const now = BigInt(Math.floor(Date.now() / 1000));
  if (now >= endTime) return currentAmount >= goalAmount;
  
  const totalTime = endTime - startTime;
  const elapsed = now - startTime;
  const expectedProgress = (goalAmount * elapsed) / totalTime;
  
  return currentAmount >= expectedProgress;
};

/**
 * Format estimated completion date
 * @param timestamp - Unix timestamp
 * @returns Formatted date string
 */
export const formatCompletionDate = (timestamp: bigint): string => {
  if (timestamp === BigInt(0)) return "No estimate";
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString();
};

/**
 * Calculate total savings needed
 * @param dailyAmount - Daily savings amount
 * @param days - Number of days
 * @returns Total amount needed
 */
export const calculateTotalNeeded = (
  dailyAmount: bigint,
  days: number
): bigint => {
  return dailyAmount * BigInt(days);
};

/**
 * Convert basis points to percentage
 * @param bps - Basis points
 * @returns Percentage
 */
export const bpsToPercent = (bps: number): number => bps / 100;

// Example usage with ethers.js v6:
// import { ethers } from 'ethers';
// import {
//   DailySavingsABI,
//   DailySavingsConfig,
//   YieldStrategy,
//   calculateProgress,
//   calculateDaysRemaining,
//   calculatePenalty,
//   isOnTrack,
// } from './daily-savings-abi';
//
// const contract = new ethers.Contract(address, DailySavingsABI, signer);
//
// // ===== CONFIGURE DAILY SAVINGS =====
//
// const config: DailySavingsConfig = {
//   user: userAddress,
//   token: usdcAddress,
//   dailyAmount: ethers.parseUnits("10", 6), // Save $10 per day
//   goalAmount: ethers.parseUnits("3650", 6), // Goal: $3,650 (1 year)
//   penaltyBps: 500, // 5% penalty for early withdrawal
//   endTime: BigInt(Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60), // 1 year
// };
//
// await contract.configureDailySavings(
//   config.user,
//   config.token,
//   config.dailyAmount,
//   config.goalAmount,
//   config.penaltyBps,
//   config.endTime
// );
//
// console.log('Daily Savings Configured:');
// console.log('  Daily:', ethers.formatUnits(config.dailyAmount, 6), 'USDC');
// console.log('  Goal:', ethers.formatUnits(config.goalAmount, 6), 'USDC');
// console.log('  Penalty:', bpsToPercent(config.penaltyBps), '%');
// console.log('  Deadline:', new Date(Number(config.endTime) * 1000).toLocaleDateString());
//
// // ===== CHECK SAVINGS STATUS =====
//
// const [
//   enabled,
//   dailyAmount,
//   goalAmount,
//   currentAmount,
//   remainingAmount,
//   penaltyAmount,
//   estimatedCompletionDate,
// ] = await contract.getDailySavingsStatus(userAddress, usdcAddress);
//
// console.log('\nSavings Status:');
// console.log('  Enabled:', enabled);
// console.log('  Current:', ethers.formatUnits(currentAmount, 6), 'USDC');
// console.log('  Goal:', ethers.formatUnits(goalAmount, 6), 'USDC');
// console.log('  Remaining:', ethers.formatUnits(remainingAmount, 6), 'USDC');
//
// const progress = calculateProgress(currentAmount, goalAmount);
// console.log('  Progress:', progress.toFixed(1), '%');
//
// const daysLeft = calculateDaysRemaining(currentAmount, goalAmount, dailyAmount);
// console.log('  Days remaining:', daysLeft);
// console.log('  Est. completion:', formatCompletionDate(estimatedCompletionDate));
//
// if (penaltyAmount > 0n) {
//   console.log('  Early withdrawal penalty:', ethers.formatUnits(penaltyAmount, 6), 'USDC');
// }
//
// // ===== CHECK IF CAN EXECUTE TODAY =====
//
// const [canExecute, daysPassed, amountToSave] = await contract.getDailyExecutionStatus(
//   userAddress,
//   usdcAddress
// );
//
// console.log('\nExecution Status:');
// console.log('  Can execute today:', canExecute);
// console.log('  Days passed:', daysPassed.toString());
// console.log('  Amount to save:', ethers.formatUnits(amountToSave, 6), 'USDC');
//
// // ===== EXECUTE DAILY SAVINGS =====
//
// if (canExecute) {
//   const savedAmount = await contract.executeDailySavingsForToken(
//     userAddress,
//     usdcAddress
//   );
//   
//   console.log('\n✅ Daily savings executed!');
//   console.log('  Saved:', ethers.formatUnits(savedAmount, 6), 'USDC');
// }
//
// // Execute for all tokens with configured savings
// const hasPending = await contract.hasPendingDailySavings(userAddress);
// if (hasPending) {
//   const totalSaved = await contract.executeDailySavings(userAddress);
//   console.log('Total saved across all tokens:', ethers.formatUnits(totalSaved, 6));
// }
//
// // ===== SET YIELD STRATEGY =====
//
// // Auto-compound earnings into savings
// await contract.setDailySavingsYieldStrategy(
//   userAddress,
//   usdcAddress,
//   YieldStrategy.COMPOUND
// );
//
// console.log('\n✅ Yield strategy set to COMPOUND');
//
// // Other strategies:
// // YieldStrategy.NONE - No yield
// // YieldStrategy.LIQUIDITY_POOL - Put into LP
// // YieldStrategy.LENDING - Lend to earn interest
//
// // ===== WITHDRAW WITH PENALTY =====
//
// const withdrawAmount = ethers.parseUnits("500", 6); // Withdraw $500
// const penaltyBps = 500; // 5%
//
// const penalty = calculatePenalty(withdrawAmount, penaltyBps);
// const netAmount = calculateNetAfterPenalty(withdrawAmount, penaltyBps);
//
// console.log('\nWithdrawal Preview:');
// console.log('  Requested:', ethers.formatUnits(withdrawAmount, 6), 'USDC');
// console.log('  Penalty:', ethers.formatUnits(penalty, 6), 'USDC');
// console.log('  You receive:', ethers.formatUnits(netAmount, 6), 'USDC');
//
// const received = await contract.withdrawDailySavings(
//   userAddress,
//   usdcAddress,
//   withdrawAmount
// );
//
// console.log('✅ Withdrawn:', ethers.formatUnits(received, 6), 'USDC');
//
// // ===== CHECK IF ON TRACK =====
//
// const startTime = BigInt(Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60); // 30 days ago
// const endTime = BigInt(Math.floor(Date.now() / 1000) + 335 * 24 * 60 * 60); // 335 days from now
//
// const onTrack = isOnTrack(
//   currentAmount,
//   goalAmount,
//   startTime,
//   endTime
// );
//
// console.log('\nProgress Analysis:');
// if (onTrack) {
//   console.log('✅ You are on track to reach your goal!');
// } else {
//   console.log('⚠️ You are behind schedule');
//   console.log('  Consider increasing daily amount to catch up');
// }
//
// // ===== DISABLE DAILY SAVINGS =====
//
// // Stop automatic daily savings
// await contract.disableDailySavings(userAddress, usdcAddress);
// console.log('Daily savings disabled');
//
// // ===== EVENT MONITORING =====
//
// // Listen to savings execution
// contract.on('DailySavingsExecuted', (user, token, amount, gasUsed) => {
//   console.log(`💰 Daily savings executed for ${user}`);
//   console.log(`  Token: ${token}`);
//   console.log(`  Amount: ${ethers.formatUnits(amount, 6)}`);
//   console.log(`  Gas used: ${gasUsed.toString()}`);
// });
//
// // Listen to goal reached
// contract.on('DailySavingsGoalReached', (user, token, totalAmount) => {
//   console.log(`🎉 Goal reached!`);
//   console.log(`  User: ${user}`);
//   console.log(`  Token: ${token}`);
//   console.log(`  Total saved: ${ethers.formatUnits(totalAmount, 6)}`);
// });
//
// // Listen to withdrawals
// contract.on('DailySavingsWithdrawn', (user, token, amount, penalty, goalReached) => {
//   console.log(`💸 Withdrawal by ${user}`);
//   console.log(`  Amount: ${ethers.formatUnits(amount, 6)}`);
//   console.log(`  Penalty: ${ethers.formatUnits(penalty, 6)}`);
//   console.log(`  Goal reached: ${goalReached ? 'Yes' : 'No'}`);
// });
//
// // Listen to execution skips
// contract.on('DailySavingsExecutionSkipped', (user, token, reason) => {
//   console.log(`⏭️ Execution skipped for ${user}`);
//   console.log(`  Reason: ${reason}`);
// });

// With viem:
// import { getContract, parseUnits, formatUnits } from 'viem';
// import { DailySavingsABI, YieldStrategy, calculateProgress } from './daily-savings-abi';
//
// const contract = getContract({
//   address: dailySavingsAddress,
//   abi: DailySavingsABI,
//   client: publicClient,
// });
//
// // Configure daily savings
// const hash = await contract.write.configureDailySavings([
//   userAddress,
//   tokenAddress,
//   parseUnits("10", 6),
//   parseUnits("3650", 6),
//   500n,
//   BigInt(Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60),
// ]);
//
// // Get status
// const status = await contract.read.getDailySavingsStatus([
//   userAddress,
//   tokenAddress,
// ]);
//
// const progress = calculateProgress(status[3], status[2]);
// console.log('Progress:', progress, '%');
//
// // Execute daily savings
// const saved = await contract.write.executeDailySavingsForToken([
//   userAddress,
//   tokenAddress,
// ]);
//
// // Watch events
// const unwatch = contract.watchEvent.DailySavingsExecuted(
//   { user: userAddress },
//   {
//     onLogs: (logs) => {
//       logs.forEach((log) => {
//         console.log('Daily savings executed:', {
//           token: log.args.token,
//           amount: formatUnits(log.args.amount, 6),
//         });
//       });
//     },
//   }
// );

// Advanced: Savings plan tracker
export class SavingsTracker {
  private contract: any;

  constructor(contract: any) {
    this.contract = contract;
  }

  async getFullStatus(user: string, token: string): Promise<SavingsProgress> {
    const [_, dailyAmount, goalAmount, currentAmount, __, ___, estimatedDate] =
      await this.contract.getDailySavingsStatus(user, token);

    const percentComplete = calculateProgress(currentAmount, goalAmount);
    const daysRemaining = calculateDaysRemaining(
      currentAmount,
      goalAmount,
      dailyAmount
    );

    const now = BigInt(Math.floor(Date.now() / 1000));
    const daysElapsed = Math.floor(
      Number(now - (estimatedDate - BigInt(daysRemaining * 24 * 60 * 60))) /
        (24 * 60 * 60)
    );

    const onTrack = percentComplete >= (daysElapsed / (daysElapsed + daysRemaining)) * 100;

    return {
      percentComplete,
      daysElapsed,
      daysRemaining,
      onTrack,
    };
  }

  async previewWithdrawal(
    user: string,
    token: string,
    amount: bigint
  ): Promise<WithdrawalResult> {
    const [_, __, ___, ____, _____, penaltyAmount] =
      await this.contract.getDailySavingsStatus(user, token);

    return {
      amountWithdrawn: amount,
      penaltyApplied: penaltyAmount,
      goalReached: false, // Would need to check current vs goal
    };
  }
}

// Helper: Get yield strategy description
export const getYieldStrategyDescription = (strategy: YieldStrategy): string => {
  const descriptions: Record<YieldStrategy, string> = {
    [YieldStrategy.NONE]: "No yield - keep as is",
    [YieldStrategy.COMPOUND]: "Auto-compound earnings",
    [YieldStrategy.LIQUIDITY_POOL]: "Deposit into liquidity pools",
    [YieldStrategy.LENDING]: "Lend to earn interest",
  };
  return descriptions[strategy];
};