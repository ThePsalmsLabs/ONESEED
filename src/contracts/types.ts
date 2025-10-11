// TypeScript types matching Solidity structs

export enum SavingsTokenType {
  INPUT = 0,
  OUTPUT = 1,
  SPECIFIC = 2
}

export interface SavingStrategy {
  percentage: bigint;
  autoIncrement: bigint;
  maxPercentage: bigint;
  roundUpSavings: boolean;
  savingsTokenType: SavingsTokenType;
  specificSavingsToken?: `0x${string}`;
}

export interface PackedUserConfig {
  percentage: number;
  autoIncrement: number;
  maxPercentage: number;
  roundUpSavings: boolean;
  enableDCA: boolean;
  savingsTokenType: SavingsTokenType;
}

export interface SavingsDetails {
  balance: bigint;
  totalSaved: bigint;
  lastSaveTime: bigint;
  isLocked: boolean;
  unlockTime: bigint;
}

export interface TokenBalance {
  token: `0x${string}`;
  amount: bigint;
  symbol?: string;
  decimals?: number;
  usdValue?: number;
}

export interface WithdrawalPreview {
  actualAmount: bigint;
  penalty: bigint;
  penaltyPercentage: number;
}

