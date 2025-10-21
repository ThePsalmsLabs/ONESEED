/**
 * Savings Module Contract ABI
 * TypeScript Definition
 */

export const SavingsModuleABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "AddressEmptyCode",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "AddressInsufficientBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "AlreadyInitialized",
    type: "error",
  },
  {
    inputs: [],
    name: "BatchSizeTooLarge",
    type: "error",
  },
  {
    inputs: [],
    name: "FailedInnerCall",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidModule",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidTimelock",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidToken",
    type: "error",
  },
  {
    inputs: [],
    name: "NotInitialized",
    type: "error",
  },
  {
    inputs: [],
    name: "Paused",
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
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "SafeERC20FailedOperation",
    type: "error",
  },
  {
    inputs: [],
    name: "Unauthorized",
    type: "error",
  },
  {
    inputs: [],
    name: "WithdrawalLocked",
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
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "enabled",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "minAmount",
        type: "uint256",
      },
    ],
    name: "AutoCompoundConfigured",
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
        name: "totalAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalFee",
        type: "uint256",
      },
    ],
    name: "BatchSavingsProcessed",
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
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "EmergencyWithdrawal",
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
        name: "totalSaved",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "goalAmount",
        type: "uint256",
      },
    ],
    name: "GoalReached",
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
        name: "tokenModule",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "dcaModule",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "strategyModule",
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
        indexed: false,
        internalType: "bool",
        name: "isPaused",
        type: "bool",
      },
    ],
    name: "PauseStateChanged",
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
        name: "netAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
    ],
    name: "SavingsProcessed",
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
        name: "fromToken",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "targetToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "SavingsQueuedForDCA",
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
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "SavingsTokenBurnFailed",
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
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "SavingsTokenBurned",
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
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "SavingsTokenMintFailed",
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
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "SavingsTokenMinted",
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
        name: "fromToken",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "targetToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "SwapQueueingFailed",
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
        name: "actualAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "earlyWithdrawal",
        type: "bool",
      },
    ],
    name: "WithdrawalProcessed",
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
    name: "WithdrawalProcessed",
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
        name: "oldTimelock",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newTimelock",
        type: "uint256",
      },
    ],
    name: "WithdrawalTimelockUpdated",
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
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
    ],
    name: "batchProcessSavings",
    outputs: [
      {
        internalType: "uint256",
        name: "totalNetAmount",
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
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
    ],
    name: "batchWithdraw",
    outputs: [
      {
        internalType: "uint256[]",
        name: "actualAmounts",
        type: "uint256[]",
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
      {
        internalType: "uint256",
        name: "requestedAmount",
        type: "uint256",
      },
    ],
    name: "calculateWithdrawalAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "actualAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "penalty",
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
      {
        internalType: "bool",
        name: "enableCompound",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "minCompoundAmount",
        type: "uint256",
      },
    ],
    name: "configureAutoCompound",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "dcaModule",
    outputs: [
      {
        internalType: "contract IDCAModule",
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
    name: "depositSavings",
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
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "emergencyWithdraw",
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
    name: "getSavingsDetails",
    outputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalSaved",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastSaveTime",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isLocked",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "unlockTime",
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
    name: "getUserSavings",
    outputs: [
      {
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
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
    inputs: [],
    name: "pauseSavings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
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
    name: "processInputSavingsAfterSwap",
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
    name: "processSavings",
    outputs: [
      {
        internalType: "uint256",
        name: "netAmount",
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
        name: "outputToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "outputAmount",
        type: "uint256",
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
    name: "processSavingsFromOutput",
    outputs: [
      {
        internalType: "uint256",
        name: "savedAmount",
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
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint16",
            name: "percentage",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "autoIncrement",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "maxPercentage",
            type: "uint16",
          },
          {
            internalType: "uint8",
            name: "roundUpSavings",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "enableDCA",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "savingsTokenType",
            type: "uint8",
          },
          {
            internalType: "uint184",
            name: "reserved",
            type: "uint184",
          },
        ],
        internalType: "struct SpendSaveStorage.PackedUserConfig",
        name: "packedConfig",
        type: "tuple",
      },
    ],
    name: "processSavingsOptimized",
    outputs: [
      {
        internalType: "uint256",
        name: "netAmount",
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
        name: "outputToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "outputAmount",
        type: "uint256",
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
    name: "processSavingsToSpecificToken",
    outputs: [
      {
        internalType: "uint256",
        name: "savedAmount",
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
        name: "fromToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "targetToken",
        type: "address",
      },
    ],
    name: "queueForDCA",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "resumeSavings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "savingStrategyModule",
    outputs: [
      {
        internalType: "contract ISavingStrategyModule",
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
        name: "newSavingStrategyModule",
        type: "address",
      },
      {
        internalType: "address",
        name: "newSavingsModule",
        type: "address",
      },
      {
        internalType: "address",
        name: "newDcaModule",
        type: "address",
      },
      {
        internalType: "address",
        name: "slippageModule",
        type: "address",
      },
      {
        internalType: "address",
        name: "newTokenModule",
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
        name: "timelock",
        type: "uint256",
      },
    ],
    name: "setWithdrawalTimelock",
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
      {
        internalType: "bool",
        name: "force",
        type: "bool",
      },
    ],
    name: "withdraw",
    outputs: [
      {
        internalType: "uint256",
        name: "actualAmount",
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
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdrawSavings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// Type definitions for structs

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

export interface PackedUserConfig {
  percentage: number;
  autoIncrement: number;
  maxPercentage: number;
  roundUpSavings: number;
  enableDCA: number;
  savingsTokenType: number;
  reserved: bigint;
}

export interface SavingsDetails {
  balance: bigint;
  totalSaved: bigint;
  lastSaveTime: bigint;
  isLocked: boolean;
  unlockTime: bigint;
}

export interface WithdrawalCalculation {
  actualAmount: bigint;
  penalty: bigint;
}

// Enum for SavingsTokenType (shared with SavingsStrategy)
export enum SavingsTokenType {
  INPUT_TOKEN = 0,
  OUTPUT_TOKEN = 1,
  SPECIFIC_TOKEN = 2,
}

// Export the contract address type for convenience
export type Address = `0x${string}`;

// Example usage with ethers.js v6:
// import { ethers } from 'ethers';
// import { SavingsModuleABI, SavingsTokenType } from './savings-module-abi';
//
// const contract = new ethers.Contract(address, SavingsModuleABI, signer);
//
// // Process savings with full context
// const context: SwapContext = {
//   hasStrategy: true,
//   currentPercentage: 1000n, // 10%
//   inputAmount: ethers.parseEther("100"),
//   inputToken: tokenAddress,
//   roundUpSavings: true,
//   enableDCA: false,
//   dcaTargetToken: ethers.ZeroAddress,
//   currentTick: 0,
//   savingsTokenType: SavingsTokenType.INPUT_TOKEN,
//   specificSavingsToken: ethers.ZeroAddress,
//   pendingSaveAmount: 0n,
// };
//
// const netAmount = await contract.processSavings(
//   userAddress,
//   tokenAddress,
//   ethers.parseEther("10"),
//   context
// );
//
// // Get user savings details
// const details = await contract.getSavingsDetails(userAddress, tokenAddress);
// console.log('Balance:', ethers.formatEther(details.balance));
// console.log('Total saved:', ethers.formatEther(details.totalSaved));
// console.log('Is locked:', details.isLocked);
//
// // Withdraw with optional force flag
// const withdrawn = await contract.withdraw(
//   userAddress,
//   tokenAddress,
//   ethers.parseEther("50"),
//   false // force withdrawal even if locked
// );
//
// // Configure auto-compound
// await contract.configureAutoCompound(
//   userAddress,
//   tokenAddress,
//   true, // enable
//   ethers.parseEther("10") // min amount
// );
//
// // Batch process multiple tokens
// const tokens = [token1, token2, token3];
// const amounts = [
//   ethers.parseEther("10"),
//   ethers.parseEther("20"),
//   ethers.parseEther("30")
// ];
// const totalNet = await contract.batchProcessSavings(
//   userAddress,
//   tokens,
//   amounts
// );