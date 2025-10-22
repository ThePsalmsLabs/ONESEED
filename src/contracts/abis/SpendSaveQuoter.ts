/**
 * SpendSave Quoter Contract ABI
 * Complete ABI from BaseScan with TypeScript types
 * Off-chain quote calculations for swaps, DCA, and savings impact
 */

export const SpendSaveQuoterABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_storage",
        type: "address",
      },
      {
        internalType: "address",
        name: "_quoter",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "currency0",
            type: "address",
          },
          {
            internalType: "address",
            name: "currency1",
            type: "address",
          },
          {
            internalType: "uint24",
            name: "fee",
            type: "uint24",
          },
          {
            internalType: "int24",
            name: "tickSpacing",
            type: "int24",
          },
          {
            internalType: "address",
            name: "hooks",
            type: "address",
          },
        ],
        internalType: "struct PoolKey",
        name: "poolKey",
        type: "tuple",
      },
      {
        internalType: "bool",
        name: "zeroForOne",
        type: "bool",
      },
      {
        internalType: "uint128",
        name: "amountIn",
        type: "uint128",
      },
    ],
    name: "getDCAQuote",
    outputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gasEstimate",
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
        name: "startingCurrency",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "intermediateCurrency",
            type: "address",
          },
          {
            internalType: "uint24",
            name: "fee",
            type: "uint24",
          },
          {
            internalType: "int24",
            name: "tickSpacing",
            type: "int24",
          },
          {
            internalType: "address",
            name: "hooks",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "hookData",
            type: "bytes",
          },
        ],
        internalType: "struct PathKey[]",
        name: "path",
        type: "tuple[]",
      },
      {
        internalType: "uint128",
        name: "amountIn",
        type: "uint128",
      },
    ],
    name: "previewMultiHopRouting",
    outputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gasEstimate",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "currency0",
            type: "address",
          },
          {
            internalType: "address",
            name: "currency1",
            type: "address",
          },
          {
            internalType: "uint24",
            name: "fee",
            type: "uint24",
          },
          {
            internalType: "int24",
            name: "tickSpacing",
            type: "int24",
          },
          {
            internalType: "address",
            name: "hooks",
            type: "address",
          },
        ],
        internalType: "struct PoolKey",
        name: "poolKey",
        type: "tuple",
      },
      {
        internalType: "bool",
        name: "zeroForOne",
        type: "bool",
      },
      {
        internalType: "uint128",
        name: "amountIn",
        type: "uint128",
      },
      {
        internalType: "uint256",
        name: "savingsPercentage",
        type: "uint256",
      },
    ],
    name: "previewSavingsImpact",
    outputs: [
      {
        internalType: "uint256",
        name: "swapOutput",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "savedAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "netOutput",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "quoter",
    outputs: [
      {
        internalType: "contract V4Quoter",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
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
] as const;

// Type definitions for contract functions
export type SpendSaveQuoterContract = {
  getDCAQuote: (poolKey: PoolKey, zeroForOne: boolean, amountIn: bigint) => Promise<[bigint, bigint]>;
  previewMultiHopRouting: (startingCurrency: `0x${string}`, path: PathKey[], amountIn: bigint) => Promise<[bigint, bigint]>;
  previewSavingsImpact: (poolKey: PoolKey, zeroForOne: boolean, amountIn: bigint, savingsPercentage: bigint) => Promise<[bigint, bigint, bigint]>;
  quoter: () => Promise<`0x${string}`>;
  storage_: () => Promise<`0x${string}`>;
};

// Create a properly typed ABI that TypeScript can understand
export const SpendSaveQuoterABITyped = SpendSaveQuoterABI;

// Type definitions

export interface PoolKey {
  currency0: `0x${string}`;
  currency1: `0x${string}`;
  fee: number;
  tickSpacing: number;
  hooks: `0x${string}`;
}

export interface PathKey {
  intermediateCurrency: `0x${string}`;
  fee: number;
  tickSpacing: number;
  hooks: `0x${string}`;
  hookData: `0x${string}`;
}

export interface DCAQuote {
  amountOut: bigint;
  gasEstimate: bigint;
}

export interface MultiHopQuote {
  amountOut: bigint;
  gasEstimate: bigint;
}

export interface SavingsImpact {
  swapOutput: bigint;
  savedAmount: bigint;
  netOutput: bigint;
  effectiveRate: number;
}

export interface QuoteParams {
  poolKey: PoolKey;
  zeroForOne: boolean;
  amountIn: bigint;
}

export interface MultiHopParams {
  startingCurrency: `0x${string}`;
  path: PathKey[];
  amountIn: bigint;
}

export interface SavingsImpactParams {
  poolKey: PoolKey;
  zeroForOne: boolean;
  amountIn: bigint;
  savingsPercentage: bigint;
}

// Helper functions

export const calculateEffectiveRate = (swapOutput: bigint, netOutput: bigint): number => {
  if (swapOutput === BigInt(0)) return 0;
  return Number((netOutput * BigInt(10000)) / swapOutput) / 100;
};

export const calculateGasCost = (gasEstimate: bigint, gasPrice: bigint): bigint => {
  return gasEstimate * gasPrice;
};

export const bpsToPercent = (bps: number): number => bps / 100;

// UI Helper: Format quote for display
export const formatQuote = (quote: DCAQuote, decimals: number = 18): {
  output: string;
  gas: string;
} => {
  return {
    output: (Number(quote.amountOut) / 10 ** decimals).toFixed(6),
    gas: quote.gasEstimate.toString(),
  };
};

// UI Helper: Format savings impact for display
export const formatSavingsImpact = (
  impact: SavingsImpact,
  inputDecimals: number = 6,
  outputDecimals: number = 18
): {
  swapOutput: string;
  savedAmount: string;
  netOutput: string;
  effectiveRate: string;
} => {
  return {
    swapOutput: (Number(impact.swapOutput) / 10 ** outputDecimals).toFixed(6),
    savedAmount: (Number(impact.savedAmount) / 10 ** inputDecimals).toFixed(6),
    netOutput: (Number(impact.netOutput) / 10 ** outputDecimals).toFixed(6),
    effectiveRate: calculateEffectiveRate(impact.swapOutput, impact.netOutput).toFixed(2),
  };
};

// Find best quote among multiple routes
export const findBestQuote =
  <T extends { amountOut: bigint }>(quoteSelector: (item: T) => bigint) =>
  (best: T | null, current: T): T | null => {
    if (!best) return current;
    return quoteSelector(current) > quoteSelector(best) ? current : best;
  };
