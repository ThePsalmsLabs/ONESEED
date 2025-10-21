/**
 * SavingsStrategy Contract ABI
 * TypeScript Definition
 */

export const SavingsStrategyABI = [
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
    inputs: [],
    name: "InvalidModule",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidPercentage",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidSpecificToken",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "maxPercentage",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "percentage",
        type: "uint256",
      },
    ],
    name: "MaxPercentageTooLow",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "moduleName",
        type: "string",
      },
    ],
    name: "ModuleNotInitialized",
    type: "error",
  },
  {
    inputs: [],
    name: "NotInitialized",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyHook",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyUserOrHook",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "provided",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "max",
        type: "uint256",
      },
    ],
    name: "PercentageTooHigh",
    type: "error",
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentrantCall",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saveAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "inputAmount",
        type: "uint256",
      },
    ],
    name: "SavingsTooHigh",
    type: "error",
  },
  {
    inputs: [],
    name: "UnauthorizedCaller",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actualUser",
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
        name: "allowance",
        type: "uint256",
      },
    ],
    name: "AllowanceChecked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "FailedToApplySavings",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actualUser",
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
        name: "feeAmount",
        type: "uint256",
      },
    ],
    name: "FeeApplied",
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
    ],
    name: "GoalSet",
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
        name: "savedAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "remainingSwapAmount",
        type: "uint256",
      },
    ],
    name: "InputTokenSaved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actualUser",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "InputTokenSavingsSkipped",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actualUser",
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
        name: "required",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "available",
        type: "uint256",
      },
    ],
    name: "InsufficientAllowance",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actualUser",
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
        name: "required",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "available",
        type: "uint256",
      },
    ],
    name: "InsufficientBalance",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "storageAddress",
        type: "address",
      },
    ],
    name: "ModuleInitialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "savingsModule",
        type: "address",
      },
    ],
    name: "ModuleReferencesSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actualUser",
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
        name: "netAmount",
        type: "uint256",
      },
    ],
    name: "NetAmountAfterFee",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actualUser",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "inputToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "pendingSaveAmount",
        type: "uint256",
      },
    ],
    name: "ProcessInputSavingsAfterSwapCalled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actualUser",
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
    ],
    name: "ProcessingInputTokenSavings",
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
        indexed: false,
        internalType: "uint256",
        name: "percentage",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "autoIncrement",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "maxPercentage",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum SpendSaveStorage.SavingsTokenType",
        name: "tokenType",
        type: "uint8",
      },
    ],
    name: "SavingStrategySet",
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
        indexed: false,
        internalType: "uint256",
        name: "newPercentage",
        type: "uint256",
      },
    ],
    name: "SavingStrategyUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actualUser",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "saveAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "reducedSwapAmount",
        type: "uint256",
      },
    ],
    name: "SavingsCalculated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actualUser",
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
    ],
    name: "SavingsProcessedSuccessfully",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actualUser",
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
        internalType: "bytes",
        name: "reason",
        type: "bytes",
      },
    ],
    name: "SavingsProcessingFailed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actualUser",
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
        internalType: "bytes",
        name: "reason",
        type: "bytes",
      },
    ],
    name: "SavingsTransferFailure",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actualUser",
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
    ],
    name: "SavingsTransferInitiated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actualUser",
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
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    name: "SavingsTransferStatus",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actualUser",
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
        name: "contractBalance",
        type: "uint256",
      },
    ],
    name: "SavingsTransferSuccess",
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
    name: "SpecificSavingsTokenSet",
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
        indexed: false,
        internalType: "uint256",
        name: "newPercentage",
        type: "uint256",
      },
    ],
    name: "StrategyUpdated",
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
        indexed: false,
        internalType: "uint256",
        name: "currentSavePercentage",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum SpendSaveStorage.SavingsTokenType",
        name: "tokenType",
        type: "uint8",
      },
    ],
    name: "SwapPrepared",
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
        name: "fee",
        type: "uint256",
      },
    ],
    name: "TreasuryFeeCollected",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actualUser",
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
        name: "balance",
        type: "uint256",
      },
    ],
    name: "UserBalanceChecked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actualUser",
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
        name: "newSavings",
        type: "uint256",
      },
    ],
    name: "UserSavingsUpdated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "actualUser",
        type: "address",
      },
      {
        components: [
          {
            internalType: "Currency",
            name: "currency0",
            type: "address",
          },
          {
            internalType: "Currency",
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
            internalType: "contract IHooks",
            name: "hooks",
            type: "address",
          },
        ],
        internalType: "struct PoolKey",
        name: "key",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "bool",
            name: "zeroForOne",
            type: "bool",
          },
          {
            internalType: "int256",
            name: "amountSpecified",
            type: "int256",
          },
          {
            internalType: "uint160",
            name: "sqrtPriceLimitX96",
            type: "uint160",
          },
        ],
        internalType: "struct SwapParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "beforeSwap",
    outputs: [
      {
        internalType: "BeforeSwapDelta",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "percentage",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "roundUp",
        type: "bool",
      },
    ],
    name: "calculateSavingsAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "saveAmount",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
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
    name: "emergencyDisableStrategy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getModuleVersion",
    outputs: [
      {
        internalType: "string",
        name: "version",
        type: "string",
      },
    ],
    stateMutability: "pure",
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
    name: "getUserSavingsGoal",
    outputs: [
      {
        internalType: "uint256",
        name: "goalAmount",
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
    name: "getUserStrategy",
    outputs: [
      {
        internalType: "uint256",
        name: "percentage",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "autoIncrement",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxPercentage",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "roundUpSavings",
        type: "bool",
      },
      {
        internalType: "enum SpendSaveStorage.SavingsTokenType",
        name: "savingsTokenType",
        type: "uint8",
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
    name: "hasActiveStrategy",
    outputs: [
      {
        internalType: "bool",
        name: "hasStrategy",
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
        internalType: "uint256",
        name: "swapAmount",
        type: "uint256",
      },
    ],
    name: "previewSavings",
    outputs: [
      {
        internalType: "uint256",
        name: "saveAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "remainingSwapAmount",
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
        name: "actualUser",
        type: "address",
      },
      {
        components: [
          {
            internalType: "bool",
            name: "hasStrategy",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "currentPercentage",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "inputAmount",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "inputToken",
            type: "address",
          },
          {
            internalType: "bool",
            name: "roundUpSavings",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "enableDCA",
            type: "bool",
          },
          {
            internalType: "address",
            name: "dcaTargetToken",
            type: "address",
          },
          {
            internalType: "int24",
            name: "currentTick",
            type: "int24",
          },
          {
            internalType: "enum SpendSaveStorage.SavingsTokenType",
            name: "savingsTokenType",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "specificSavingsToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "pendingSaveAmount",
            type: "uint256",
          },
        ],
        internalType: "struct SpendSaveStorage.SwapContext",
        name: "context",
        type: "tuple",
      },
    ],
    name: "processInputSavingsAfterSwap",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "savingsModule",
    outputs: [
      {
        internalType: "contract ISavingsModule",
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
        name: "savingStrategyModule",
        type: "address",
      },
      {
        internalType: "address",
        name: "newSavingsModule",
        type: "address",
      },
      {
        internalType: "address",
        name: "dcaModule",
        type: "address",
      },
      {
        internalType: "address",
        name: "slippageModule",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenModule",
        type: "address",
      },
      {
        internalType: "address",
        name: "dailySavingsModule",
        type: "address",
      },
    ],
    name: "setModuleReferences",
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
        internalType: "uint256",
        name: "percentage",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "autoIncrement",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxPercentage",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "roundUpSavings",
        type: "bool",
      },
      {
        internalType: "enum SpendSaveStorage.SavingsTokenType",
        name: "savingsTokenType",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "specificSavingsToken",
        type: "address",
      },
    ],
    name: "setSavingStrategy",
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
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "setSavingsGoal",
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
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        components: [
          {
            internalType: "bool",
            name: "hasStrategy",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "currentPercentage",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "inputAmount",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "inputToken",
            type: "address",
          },
          {
            internalType: "bool",
            name: "roundUpSavings",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "enableDCA",
            type: "bool",
          },
          {
            internalType: "address",
            name: "dcaTargetToken",
            type: "address",
          },
          {
            internalType: "int24",
            name: "currentTick",
            type: "int24",
          },
          {
            internalType: "enum SpendSaveStorage.SavingsTokenType",
            name: "savingsTokenType",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "specificSavingsToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "pendingSaveAmount",
            type: "uint256",
          },
        ],
        internalType: "struct SpendSaveStorage.SwapContext",
        name: "context",
        type: "tuple",
      },
    ],
    name: "updateSavingStrategy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// Type definitions for structs

export interface PoolKey {
  currency0: string;
  currency1: string;
  fee: number;
  tickSpacing: number;
  hooks: string;
}

export interface SwapParams {
  zeroForOne: boolean;
  amountSpecified: bigint;
  sqrtPriceLimitX96: bigint;
}

export interface SwapContext {
  hasStrategy: boolean;
  currentPercentage: bigint;
  inputAmount: bigint;
  inputToken: string;
  roundUpSavings: boolean;
  enableDCA: boolean;
  dcaTargetToken: string;
  currentTick: number;
  savingsTokenType: SavingsTokenType;
  specificSavingsToken: string;
  pendingSaveAmount: bigint;
}

export interface UserStrategy {
  percentage: bigint;
  autoIncrement: bigint;
  maxPercentage: bigint;
  roundUpSavings: boolean;
  savingsTokenType: SavingsTokenType;
}

// Enum for SavingsTokenType
export enum SavingsTokenType {
  INPUT_TOKEN = 0,
  OUTPUT_TOKEN = 1,
  SPECIFIC_TOKEN = 2,
}

// Export the contract address type for convenience
export type Address = `0x${string}`;

// Example usage with ethers.js v6:
// import { ethers } from 'ethers';
// import { SavingsStrategyABI, SavingsTokenType } from './savings-strategy-abi';
//
// const contract = new ethers.Contract(address, SavingsStrategyABI, signer);
//
// // Set a savings strategy
// await contract.setSavingStrategy(
//   userAddress,
//   1000, // 10% (basis points)
//   50,   // auto increment
//   2000, // max 20%
//   true, // round up
//   SavingsTokenType.INPUT_TOKEN,
//   ethers.ZeroAddress // no specific token
// );
//
// // Get user strategy
// const strategy = await contract.getUserStrategy(userAddress);
// console.log('Percentage:', strategy.percentage.toString());
//
// // Preview savings
// const [saveAmount, remainingSwap] = await contract.previewSavings(
//   userAddress,
//   ethers.parseEther("100")
// );