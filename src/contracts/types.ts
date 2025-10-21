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

// Daily Savings Types
export interface DailySavingsConfig {
  enabled: boolean;
  dailyAmount: bigint;
  goalAmount: bigint;
  penaltyBps: bigint;
  endTime: bigint;
  startTime: bigint;
  lastExecutionTime: bigint;
  currentAmount: bigint;
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

export interface DailyExecutionStatus {
  canExecute: boolean;
  daysPassed: bigint;
  amountToSave: bigint;
}

// DCA Types
export interface DCAConfig {
  enabled: boolean;
  targetToken: `0x${string}`;
  minAmount: bigint;
  maxSlippage: bigint;
  lowerTick: number;
  upperTick: number;
}

export interface DCAExecution {
  fromToken: `0x${string}`;
  toToken: `0x${string}`;
  amount: bigint;
  timestamp: bigint;
  executedPrice: bigint;
}

export interface PendingDCA {
  tokens: `0x${string}`[];
  amounts: bigint[];
  targets: `0x${string}`[];
}

// Yield Strategy Types
export enum YieldStrategy {
  NONE = 0,
  COMPOUND = 1,
  AAVE = 2,
  COMPOUND_V3 = 3
}

// Slippage Control Types
export enum SlippageAction {
  REVERT = 0,
  CONTINUE = 1
}

export interface SlippageSettings {
  tolerance: bigint;
  action: SlippageAction;
  tokenTolerance?: Record<`0x${string}`, bigint>;
}

// Token Types (ERC6909)
export interface TokenInfo {
  id: bigint;
  address: `0x${string}`;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
}

export interface TokenTransfer {
  from: `0x${string}`;
  to: `0x${string}`;
  id: bigint;
  amount: bigint;
}

// Hook Types
export interface HookPermissions {
  beforeInitialize: boolean;
  afterInitialize: boolean;
  beforeAddLiquidity: boolean;
  afterAddLiquidity: boolean;
  beforeRemoveLiquidity: boolean;
  afterRemoveLiquidity: boolean;
  beforeSwap: boolean;
  afterSwap: boolean;
  beforeDonate: boolean;
  afterDonate: boolean;
  beforeSwapReturnDelta: boolean;
  afterSwapReturnDelta: boolean;
}

export interface SwapContext {
  enableDCA: boolean;
  user: `0x${string}`;
  fromToken: `0x${string}`;
  toToken: `0x${string}`;
  amount: bigint;
  slippageTolerance: bigint;
}

// Analytics Types
export interface SavingsAnalytics {
  totalSaved: bigint;
  totalWithdrawn: bigint;
  averageDailySave: bigint;
  savingsStreak: bigint;
  goalCompletionRate: number;
  topTokens: Array<{
    token: `0x${string}`;
    amount: bigint;
    percentage: number;
  }>;
}

export interface DCAAnalytics {
  totalExecutions: bigint;
  totalVolume: bigint;
  averageExecutionPrice: bigint;
  successRate: number;
  topPairs: Array<{
    fromToken: `0x${string}`;
    toToken: `0x${string}`;
    volume: bigint;
    executions: bigint;
  }>;
}

// Error Types
export interface ContractError {
  code: string;
  message: string;
  details?: any;
}

// Transaction Types
export interface TransactionResult {
  hash: `0x${string}`;
  success: boolean;
  gasUsed: bigint;
  blockNumber: bigint;
  timestamp: bigint;
}

export interface BatchTransactionResult {
  results: TransactionResult[];
  successCount: number;
  failureCount: number;
  totalGasUsed: bigint;
}

