/**
 * SpendSave DCAModule Contract ABI
 * TypeScript Definition (production-ready)
 *
 * Export:
 *   - SpendSaveDCAModuleABI (const ABI)
 *   - typed interfaces for structs used by the ABI
 *
 * Notes:
 *  - uint256/uint128 -> bigint
 *  - int24/uint24 -> number
 *  - addresses -> Address (alias for `0x${string}`)
 */

export const DCA = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [{ internalType: "address", name: "target", type: "address" }], name: "AddressEmptyCode", type: "error" },
  { inputs: [{ internalType: "address", name: "account", type: "address" }], name: "AddressInsufficientBalance", type: "error" },
  { inputs: [], name: "AlreadyInitialized", type: "error" },
  { inputs: [], name: "DCANotEnabled", type: "error" },
  { inputs: [], name: "FailedInnerCall", type: "error" },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "requested", type: "uint256" },
      { internalType: "uint256", name: "available", type: "uint256" },
    ],
    name: "InsufficientSavings",
    type: "error",
  },
  { inputs: [], name: "InvalidDCAExecution", type: "error" },
  { inputs: [], name: "InvalidTickBounds", type: "error" },
  { inputs: [], name: "NoTargetTokenSet", type: "error" },
  { inputs: [], name: "OnlyOwner", type: "error" },
  { inputs: [], name: "ReentrancyGuardReentrantCall", type: "error" },
  { inputs: [{ internalType: "address", name: "token", type: "address" }], name: "SafeERC20FailedOperation", type: "error" },
  { inputs: [{ internalType: "uint256", name: "received", type: "uint256" }, { internalType: "uint256", name: "expected", type: "uint256" }], name: "SlippageToleranceExceeded", type: "error" },
  { inputs: [], name: "SwapExecutionFailed", type: "error" },
  { inputs: [], name: "TokenTransferFailed", type: "error" },
  { inputs: [], name: "UnauthorizedCaller", type: "error" },
  { inputs: [], name: "ZeroAmountSwap", type: "error" },

  // Events
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: "address", name: "user", type: "address" }],
    name: "DCADisabled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "address", name: "targetToken", type: "address" },
      { indexed: false, internalType: "bool", name: "enabled", type: "bool" },
    ],
    name: "DCAEnabled",
    type: "event",
  },
  // duplicated event name in ABI (keeps original)
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "address", name: "targetToken", type: "address" },
    ],
    name: "DCAEnabled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "address", name: "fromToken", type: "address" },
      { indexed: false, internalType: "address", name: "toToken", type: "address" },
      { indexed: false, internalType: "uint256", name: "fromAmount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "toAmount", type: "uint256" },
    ],
    name: "DCAExecuted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "address", name: "fromToken", type: "address" },
      { indexed: true, internalType: "address", name: "toToken", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "DCAExecuted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "address", name: "fromToken", type: "address" },
      { indexed: false, internalType: "address", name: "toToken", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "int24", name: "executionTick", type: "int24" },
    ],
    name: "DCAQueued",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "address", name: "fromToken", type: "address" },
      { indexed: true, internalType: "address", name: "toToken", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "DCAQueued",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "int24", name: "tickDelta", type: "int24" },
      { indexed: false, internalType: "uint256", name: "tickExpiryTime", type: "uint256" },
      { indexed: false, internalType: "bool", name: "onlyImprovePrice", type: "bool" },
    ],
    name: "DCATickStrategySet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "address", name: "storage_", type: "address" }],
    name: "ModuleInitialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "address", name: "tokenModule", type: "address" },
      { indexed: false, internalType: "address", name: "slippageModule", type: "address" },
      { indexed: false, internalType: "address", name: "savingsModule", type: "address" },
    ],
    name: "ModuleReferencesSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "address", name: "fromToken", type: "address" },
      { indexed: true, internalType: "address", name: "toToken", type: "address" },
      { indexed: false, internalType: "string", name: "reason", type: "string" },
    ],
    name: "SpecificTokenSwapFailed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "address", name: "fromToken", type: "address" },
      { indexed: true, internalType: "address", name: "toToken", type: "address" },
      { indexed: false, internalType: "uint256", name: "inputAmount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "outputAmount", type: "uint256" },
    ],
    name: "SpecificTokenSwapProcessed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "bool", name: "zeroForOne", type: "bool" },
    ],
    name: "SwapExecutionZeroOutput",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "int24", name: "lowerTick", type: "int24" },
      { indexed: false, internalType: "int24", name: "upperTick", type: "int24" },
    ],
    name: "TickStrategySet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "PoolId", name: "poolId", type: "bytes32" },
      { indexed: false, internalType: "int24", name: "oldTick", type: "int24" },
      { indexed: false, internalType: "int24", name: "newTick", type: "int24" },
    ],
    name: "TickUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "address", name: "token", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "bytes", name: "reason", type: "bytes" },
    ],
    name: "TransferFailure",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "address", name: "token", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "TreasuryFeeCollected",
    type: "event",
  },

  // Functions (a selection follows directly mirroring the ABI you provided)
  {
    inputs: [{ internalType: "address[]", name: "users", type: "address[]" }],
    name: "batchExecuteDCA",
    outputs: [
      {
        components: [
          { internalType: "address", name: "fromToken", type: "address" },
          { internalType: "address", name: "toToken", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "uint256", name: "executedPrice", type: "uint256" },
        ],
        internalType: "struct IDCAModule.DCAExecution[]",
        name: "executions",
        type: "tuple[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "address", name: "fromToken", type: "address" },
      { internalType: "address", name: "toToken", type: "address" },
      { internalType: "uint256", name: "availableAmount", type: "uint256" },
    ],
    name: "calculateOptimalDCAAmount",
    outputs: [{ internalType: "uint256", name: "optimalAmount", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
    name: "decodeSwapCallbackData",
    outputs: [
      {
        components: [
          {
            components: [
              { internalType: "Currency", name: "currency0", type: "address" },
              { internalType: "Currency", name: "currency1", type: "address" },
              { internalType: "uint24", name: "fee", type: "uint24" },
              { internalType: "int24", name: "tickSpacing", type: "int24" },
              { internalType: "contract IHooks", name: "hooks", type: "address" },
            ],
            internalType: "struct PoolKey",
            name: "poolKey",
            type: "tuple",
          },
          {
            components: [
              { internalType: "bool", name: "zeroForOne", type: "bool" },
              { internalType: "int256", name: "amountSpecified", type: "int256" },
              { internalType: "uint160", name: "sqrtPriceLimitX96", type: "uint160" },
            ],
            internalType: "struct SwapParams",
            name: "params",
            type: "tuple",
          },
          { internalType: "address", name: "user", type: "address" },
          { internalType: "address", name: "fromToken", type: "address" },
          { internalType: "address", name: "toToken", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "bool", name: "isExecuteDCA", type: "bool" },
        ],
        internalType: "struct DCA.SwapCallbackData",
        name: "decoded",
        type: "tuple",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "disableDCA",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "address", name: "targetToken", type: "address" },
      { internalType: "uint256", name: "minAmount", type: "uint256" },
      { internalType: "uint256", name: "maxSlippage", type: "uint256" },
    ],
    name: "enableDCA",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "executeDCA",
    outputs: [
      { internalType: "bool", name: "executed", type: "bool" },
      { internalType: "uint256", name: "totalAmount", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "address", name: "fromToken", type: "address" },
      { internalType: "address", name: "toToken", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      {
        components: [
          { internalType: "Currency", name: "currency0", type: "address" },
          { internalType: "Currency", name: "currency1", type: "address" },
          { internalType: "uint24", name: "fee", type: "uint24" },
          { internalType: "int24", name: "tickSpacing", type: "int24" },
          { internalType: "contract IHooks", name: "hooks", type: "address" },
        ],
        internalType: "struct PoolKey",
        name: "poolKey",
        type: "tuple",
      },
      { internalType: "bool", name: "zeroForOne", type: "bool" },
      { internalType: "uint256", name: "customSlippageTolerance", type: "uint256" },
    ],
    name: "executeDCASwap",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ components: [{ internalType: "Currency", name: "currency0", type: "address" }, { internalType: "Currency", name: "currency1", type: "address" }, { internalType: "uint24", name: "fee", type: "uint24" }, { internalType: "int24", name: "tickSpacing", type: "int24" }, { internalType: "contract IHooks", name: "hooks", type: "address" }], internalType: "struct PoolKey", name: "poolKey", type: "tuple" }],
    name: "getCurrentTick",
    outputs: [{ internalType: "int24", name: "", type: "int24" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getDCAConfig",
    outputs: [
      {
        components: [
          { internalType: "bool", name: "enabled", type: "bool" },
          { internalType: "address", name: "targetToken", type: "address" },
          { internalType: "uint256", name: "minAmount", type: "uint256" },
          { internalType: "uint256", name: "maxSlippage", type: "uint256" },
          { internalType: "int24", name: "lowerTick", type: "int24" },
          { internalType: "int24", name: "upperTick", type: "int24" },
        ],
        internalType: "struct IDCAModule.DCAConfig",
        name: "config",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }, { internalType: "uint256", name: "limit", type: "uint256" }],
    name: "getDCAHistory",
    outputs: [
      {
        components: [
          { internalType: "address", name: "fromToken", type: "address" },
          { internalType: "address", name: "toToken", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "uint256", name: "executedPrice", type: "uint256" },
        ],
        internalType: "struct IDCAModule.DCAExecution[]",
        name: "history",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getPendingDCA",
    outputs: [
      { internalType: "address[]", name: "tokens", type: "address[]" },
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
      { internalType: "address[]", name: "targets", type: "address[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "contract SpendSaveStorage", name: "_storage", type: "address" }],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "poolManager",
    outputs: [{ internalType: "contract IPoolManager", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "address", name: "savedToken", type: "address" },
      { internalType: "uint256", name: "savedAmount", type: "uint256" },
      {
        components: [
          { internalType: "bool", name: "hasStrategy", type: "bool" },
          { internalType: "uint256", name: "currentPercentage", type: "uint256" },
          { internalType: "uint256", name: "inputAmount", type: "uint256" },
          { internalType: "address", name: "inputToken", type: "address" },
          { internalType: "bool", name: "roundUpSavings", type: "bool" },
          { internalType: "bool", name: "enableDCA", type: "bool" },
          { internalType: "address", name: "dcaTargetToken", type: "address" },
          { internalType: "int24", name: "currentTick", type: "int24" },
          { internalType: "enum SpendSaveStorage.SavingsTokenType", name: "savingsTokenType", type: "uint8" },
          { internalType: "address", name: "specificSavingsToken", type: "address" },
          { internalType: "uint256", name: "pendingSaveAmount", type: "uint256" },
        ],
        internalType: "struct SpendSaveStorage.SwapContext",
        name: "context",
        type: "tuple",
      },
    ],
    name: "processDCAFromSavings",
    outputs: [{ internalType: "bool", name: "queued", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "address", name: "fromToken", type: "address" },
      { internalType: "address", name: "toToken", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "queueDCAExecution",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "address", name: "fromToken", type: "address" },
      {
        components: [
          { internalType: "bool", name: "hasStrategy", type: "bool" },
          { internalType: "uint256", name: "currentPercentage", type: "uint256" },
          { internalType: "uint256", name: "inputAmount", type: "uint256" },
          { internalType: "address", name: "inputToken", type: "address" },
          { internalType: "bool", name: "roundUpSavings", type: "bool" },
          { internalType: "bool", name: "enableDCA", type: "bool" },
          { internalType: "address", name: "dcaTargetToken", type: "address" },
          { internalType: "int24", name: "currentTick", type: "int24" },
          { internalType: "enum SpendSaveStorage.SavingsTokenType", name: "savingsTokenType", type: "uint8" },
          { internalType: "address", name: "specificSavingsToken", type: "address" },
          { internalType: "uint256", name: "pendingSaveAmount", type: "uint256" },
        ],
        internalType: "struct SpendSaveStorage.SwapContext",
        name: "context",
        type: "tuple",
      },
    ],
    name: "queueDCAFromSwap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "savingsModule",
    outputs: [{ internalType: "contract ISavingsModule", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }, { internalType: "int24", name: "lowerTick", type: "int24" }, { internalType: "int24", name: "upperTick", type: "int24" }],
    name: "setDCATickStrategy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_savingStrategy", type: "address" },
      { internalType: "address", name: "_savings", type: "address" },
      { internalType: "address", name: "_dca", type: "address" },
      { internalType: "address", name: "_slippage", type: "address" },
      { internalType: "address", name: "_token", type: "address" },
      { internalType: "address", name: "_dailySavings", type: "address" },
    ],
    name: "setModuleReferences",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }, { components: [{ internalType: "Currency", name: "currency0", type: "address" }, { internalType: "Currency", name: "currency1", type: "address" }, { internalType: "uint24", name: "fee", type: "uint24" }, { internalType: "int24", name: "tickSpacing", type: "int24" }, { internalType: "contract IHooks", name: "hooks", type: "address" }], internalType: "struct PoolKey", name: "poolKey", type: "tuple" }],
    name: "shouldExecuteDCA",
    outputs: [{ internalType: "bool", name: "shouldExecute", type: "bool" }, { internalType: "int24", name: "currentTick", type: "int24" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }, { internalType: "uint256", name: "index", type: "uint256" }, { internalType: "int24", name: "currentTick", type: "int24" }],
    name: "shouldExecuteDCAAtTickPublic",
    outputs: [{ internalType: "bool", name: "shouldExecute", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "slippageModule",
    outputs: [{ internalType: "contract ISlippageControlModule", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "storage_",
    outputs: [{ internalType: "contract SpendSaveStorage", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
    name: "unlockCallback",
    outputs: [{ internalType: "bytes", name: "result", type: "bytes" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// Export DCA as DCAABI for compatibility
export const DCAABI = DCA;

/* -----------------------
   TypeScript Interfaces
   ----------------------- */

export type Address = `0x${string}`;
export type BasisPoints = number;

/** PoolKey mirrors the ABI tuple used across functions */
export interface PoolKey {
  currency0: Address; // Currency address (token)
  currency1: Address; // Currency address (token)
  fee: number; // uint24
  tickSpacing: number; // int24
  hooks: Address; // contract IHooks address
}

/** SwapParams used inside callback decode */
export interface SwapParams {
  zeroForOne: boolean;
  amountSpecified: bigint; // int256
  sqrtPriceLimitX96: bigint; // uint160
}

/** SwapCallbackData (decoded result) */
export interface SwapCallbackData {
  poolKey: PoolKey;
  params: SwapParams;
  user: Address;
  fromToken: Address;
  toToken: Address;
  amount: bigint; // uint256
  isExecuteDCA: boolean;
}

/** DCA execution record returned by functions like batchExecuteDCA */
export interface DCAExecution {
  fromToken: Address;
  toToken: Address;
  amount: bigint; // uint256
  timestamp: bigint; // uint256
  executedPrice: bigint; // uint256
}

/** DCA configuration for a user */
export interface DCAConfig {
  enabled: boolean;
  targetToken: Address;
  minAmount: bigint;
  maxSlippage: bigint;
  lowerTick: number; // int24
  upperTick: number; // int24
}

/** SwapContext used in several functions (SpendSaveStorage.SwapContext) */
export interface SwapContext {
  hasStrategy: boolean;
  currentPercentage: bigint;
  inputAmount: bigint;
  inputToken: Address;
  roundUpSavings: boolean;
  enableDCA: boolean;
  dcaTargetToken: Address;
  currentTick: number;
  savingsTokenType: number; // enum stored as uint8
  specificSavingsToken: Address;
  pendingSaveAmount: bigint;
}

/* -----------------------
   Small helper utils
   ----------------------- */

/**
 * Format a bigint token amount to a decimal string with `decimals`.
 * Note: naive conversion — for production use a decimal library or ethers/viem formatters.
 */
export const formatTokenAmount = (amount: bigint, decimals = 18): string => {
  if (amount === BigInt(0)) return "0";
  const base = BigInt(10) ** BigInt(decimals);
  const whole = amount / base;
  const frac = (amount % base).toString().padStart(decimals, "0").slice(0, 6); // 6 fractional digits
  return `${whole.toString()}.${frac}`;
};

/**
 * Convert an integer (uint256) returned from contract into a JS bigint safely.
 * Many ethers/viem providers already return bigints — this is just a convenience.
 */
export const toBigIntSafe = (value: any): bigint => {
  if (typeof value === "bigint") return value;
  if (typeof value === "number") return BigInt(value);
  if (typeof value === "string") {
    // hex or decimal string
    return value.startsWith("0x") ? BigInt(value) : BigInt(value);
  }
  // fallback
  return BigInt(value.toString());
};

/* -----------------------
   Example usage (viem / ethers)
   -----------------------

import { getContract } from 'viem';
import { SpendSaveDCAModuleABI } from './SpendSaveDCAModule';

const contract = getContract({
  address: '0xYourContractAddress' as Address,
  abi: SpendSaveDCAModuleABI,
  client: publicClient,
});

// e.g. get a user's DCA config:
const config = await contract.read.getDCAConfig([userAddress]);
// map to typed DCAConfig if necessary

----------------------- */

export default DCA;
