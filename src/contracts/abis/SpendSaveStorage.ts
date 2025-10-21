/**
 * SpendSave Storage Contract ABI
 * TypeScript Definition
 * Core storage contract for savings strategies, DCA, and liquidity management
 */

export const SpendSaveStorageABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_poolManager",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "target",
                "type": "address"
            }
        ],
        "name": "AddressEmptyCode",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "AddressInsufficientBalance",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "AlreadyInitialized",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "FailedInnerCall",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "IndexOutOfBounds",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InsufficientBalance",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidInput",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ModuleNotFound",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ReentrancyGuardReentrantCall",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "SafeERC20FailedOperation",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "Unauthorized",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "DCAExecuted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "executionTime",
                "type": "uint256"
            }
        ],
        "name": "DCAQueued",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "DCATargetTokenSet",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "int24",
                "name": "tickDelta",
                "type": "int24"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tickExpiryTime",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "onlyImprovePrice",
                "type": "bool"
            }
        ],
        "name": "DCATickStrategySet",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "dailyAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address[]",
                        "name": "tokens",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256",
                        "name": "lastExecution",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isActive",
                        "type": "bool"
                    }
                ],
                "indexed": false,
                "internalType": "struct SpendSaveStorage.DailySavingsConfig",
                "name": "config",
                "type": "tuple"
            }
        ],
        "name": "DailySavingsConfigured",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newCurrentAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "DailySavingsExecutionUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "enum SpendSaveStorage.YieldStrategy",
                "name": "strategy",
                "type": "uint8"
            }
        ],
        "name": "DailySavingsYieldStrategyUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address[]",
                "name": "tokens",
                "type": "address[]"
            }
        ],
        "name": "IntermediaryTokensUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "moduleId",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "moduleAddress",
                "type": "address"
            }
        ],
        "name": "ModuleRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "OperatorSet",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "PoolId",
                "name": "poolId",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "int24",
                "name": "tick",
                "type": "int24"
            }
        ],
        "name": "PoolTickUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "percentage",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "autoIncrement",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "maxPercentage",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "goalAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "roundUpSavings",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "enableDCA",
                        "type": "bool"
                    },
                    {
                        "internalType": "enum SpendSaveStorage.SavingsTokenType",
                        "name": "savingsTokenType",
                        "type": "uint8"
                    },
                    {
                        "internalType": "address",
                        "name": "specificSavingsToken",
                        "type": "address"
                    }
                ],
                "indexed": false,
                "internalType": "struct SpendSaveStorage.SavingStrategy",
                "name": "strategy",
                "type": "tuple"
            }
        ],
        "name": "SavingStrategySet",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "SavingsIncreased",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tolerance",
                "type": "uint256"
            }
        ],
        "name": "SlippageToleranceUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "poolManager",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spendSaveHook",
                "type": "address"
            }
        ],
        "name": "StorageInitialized",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            }
        ],
        "name": "TokensReleasedForLP",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "caller",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "components": [
                    {
                        "internalType": "uint16",
                        "name": "percentage",
                        "type": "uint16"
                    },
                    {
                        "internalType": "uint16",
                        "name": "autoIncrement",
                        "type": "uint16"
                    },
                    {
                        "internalType": "uint16",
                        "name": "maxPercentage",
                        "type": "uint16"
                    },
                    {
                        "internalType": "uint8",
                        "name": "roundUpSavings",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint8",
                        "name": "enableDCA",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint8",
                        "name": "savingsTokenType",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint184",
                        "name": "reserved",
                        "type": "uint184"
                    }
                ],
                "indexed": false,
                "internalType": "struct SpendSaveStorage.PackedUserConfig",
                "name": "config",
                "type": "tuple"
            }
        ],
        "name": "UserConfigUpdated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "_savings",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "token",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "executionTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "successful",
                        "type": "bool"
                    }
                ],
                "internalType": "struct SpendSaveStorage.DCAExecution",
                "name": "execution",
                "type": "tuple"
            }
        ],
        "name": "addDcaExecution",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "fromToken",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "toToken",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "int24",
                "name": "executionTick",
                "type": "int24"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "customSlippageTolerance",
                "type": "uint256"
            }
        ],
        "name": "addToDcaQueue",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "executionTime",
                "type": "uint256"
            }
        ],
        "name": "addToDcaQueue",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "addUserSavingsToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "authorizedModules",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "savingsAmount",
                "type": "uint256"
            }
        ],
        "name": "batchUpdateUserSavings",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "netSavings",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "clearDcaQueue",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "clearTransientSwapContext",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token0",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "token1",
                "type": "address"
            },
            {
                "internalType": "uint24",
                "name": "fee",
                "type": "uint24"
            },
            {
                "internalType": "int24",
                "name": "tickSpacing",
                "type": "int24"
            },
            {
                "internalType": "address",
                "name": "hooks",
                "type": "address"
            }
        ],
        "name": "createPoolKey",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "Currency",
                        "name": "currency0",
                        "type": "address"
                    },
                    {
                        "internalType": "Currency",
                        "name": "currency1",
                        "type": "address"
                    },
                    {
                        "internalType": "uint24",
                        "name": "fee",
                        "type": "uint24"
                    },
                    {
                        "internalType": "int24",
                        "name": "tickSpacing",
                        "type": "int24"
                    },
                    {
                        "internalType": "contract IHooks",
                        "name": "hooks",
                        "type": "address"
                    }
                ],
                "internalType": "struct PoolKey",
                "name": "key",
                "type": "tuple"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token0",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "token1",
                "type": "address"
            }
        ],
        "name": "createPoolKey",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "Currency",
                        "name": "currency0",
                        "type": "address"
                    },
                    {
                        "internalType": "Currency",
                        "name": "currency1",
                        "type": "address"
                    },
                    {
                        "internalType": "uint24",
                        "name": "fee",
                        "type": "uint24"
                    },
                    {
                        "internalType": "int24",
                        "name": "tickSpacing",
                        "type": "int24"
                    },
                    {
                        "internalType": "contract IHooks",
                        "name": "hooks",
                        "type": "address"
                    }
                ],
                "internalType": "struct PoolKey",
                "name": "key",
                "type": "tuple"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "dailyExecutions",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "successful",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "dailySavingsAmounts",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "dailySavingsConfigParams",
        "outputs": [
            {
                "internalType": "bool",
                "name": "enabled",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "lastExecutionTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "startTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "goalAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "currentAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "penaltyBps",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "endTime",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "dailySavingsConfigs",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "dailyAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "lastExecution",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "dailySavingsYieldStrategies",
        "outputs": [
            {
                "internalType": "enum SpendSaveStorage.YieldStrategy",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "dcaMinAmounts",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "dcaModule",
        "outputs": [
            {
                "internalType": "address",
                "name": "dcaAddress",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "dcaQueues",
        "outputs": [
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "dcaTargetToken",
        "outputs": [
            {
                "internalType": "address",
                "name": "targetToken",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "dcaTargetTokens",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "dcaTickStrategies",
        "outputs": [
            {
                "internalType": "int24",
                "name": "tickDelta",
                "type": "int24"
            },
            {
                "internalType": "uint256",
                "name": "tickExpiryTime",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "onlyImprovePrice",
                "type": "bool"
            },
            {
                "internalType": "int24",
                "name": "minTickImprovement",
                "type": "int24"
            },
            {
                "internalType": "bool",
                "name": "dynamicSizing",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "customSlippageTolerance",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "decreaseBalance",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "decreaseSavings",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "decreaseTotalSupply",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "defaultSlippageTolerance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "emergencyPause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "tokenOwner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "getAllowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "allowance",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "tokenOwner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "getBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "getDailySavingsConfig",
        "outputs": [
            {
                "internalType": "bool",
                "name": "enabled",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "lastExecutionTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "startTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "goalAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "currentAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "penaltyBps",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "endTime",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getDailySavingsConfig",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "dailyAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address[]",
                        "name": "tokens",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256",
                        "name": "lastExecution",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isActive",
                        "type": "bool"
                    }
                ],
                "internalType": "struct SpendSaveStorage.DailySavingsConfig",
                "name": "config",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "getDailySavingsConfigParams",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "bool",
                        "name": "enabled",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "lastExecutionTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "startTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "goalAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "currentAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "penaltyBps",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "endTime",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct SpendSaveStorage.DailySavingsConfigParams",
                "name": "params",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "getDailySavingsYieldStrategy",
        "outputs": [
            {
                "internalType": "enum SpendSaveStorage.YieldStrategy",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getDcaExecutionCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "count",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "limit",
                "type": "uint256"
            }
        ],
        "name": "getDcaExecutionHistory",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "token",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "executionTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "successful",
                        "type": "bool"
                    }
                ],
                "internalType": "struct SpendSaveStorage.DCAExecution[]",
                "name": "history",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getDcaQueue",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256[]",
                        "name": "amounts",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "address[]",
                        "name": "tokens",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "executionTimes",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "bool",
                        "name": "isActive",
                        "type": "bool"
                    }
                ],
                "internalType": "struct SpendSaveStorage.DCAQueue",
                "name": "queue",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "getDcaQueueItem",
        "outputs": [
            {
                "internalType": "address",
                "name": "fromToken",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "toToken",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "int24",
                "name": "executionTick",
                "type": "int24"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "executed",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "customSlippageTolerance",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getDcaQueueLength",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "length",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getDcaTickStrategy",
        "outputs": [
            {
                "internalType": "int24",
                "name": "tickDelta",
                "type": "int24"
            },
            {
                "internalType": "uint256",
                "name": "tickExpiryTime",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "onlyImprovePrice",
                "type": "bool"
            },
            {
                "internalType": "int24",
                "name": "minTickImprovement",
                "type": "int24"
            },
            {
                "internalType": "bool",
                "name": "dynamicSizing",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "customSlippageTolerance",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getIntermediaryTokens",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "tokens",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "poolId",
                "type": "bytes32"
            }
        ],
        "name": "getLastDcaExecutionTick",
        "outputs": [
            {
                "internalType": "int24",
                "name": "tick",
                "type": "int24"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "moduleId",
                "type": "bytes32"
            }
        ],
        "name": "getModule",
        "outputs": [
            {
                "internalType": "address",
                "name": "moduleAddress",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getNextTokenId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "nextId",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getPackedUserConfig",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "percentage",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "roundUpSavings",
                "type": "bool"
            },
            {
                "internalType": "uint8",
                "name": "savingsTokenType",
                "type": "uint8"
            },
            {
                "internalType": "bool",
                "name": "enableDCA",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getPendingDCAOrders",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "fromToken",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "toToken",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "int24",
                        "name": "executionTick",
                        "type": "int24"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deadline",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "customSlippageTolerance",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "executed",
                        "type": "bool"
                    }
                ],
                "internalType": "struct SpendSaveStorage.DCAQueueItem[]",
                "name": "pendingOrders",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token0",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "token1",
                "type": "address"
            }
        ],
        "name": "getPoolKey",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "Currency",
                        "name": "currency0",
                        "type": "address"
                    },
                    {
                        "internalType": "Currency",
                        "name": "currency1",
                        "type": "address"
                    },
                    {
                        "internalType": "uint24",
                        "name": "fee",
                        "type": "uint24"
                    },
                    {
                        "internalType": "int24",
                        "name": "tickSpacing",
                        "type": "int24"
                    },
                    {
                        "internalType": "contract IHooks",
                        "name": "hooks",
                        "type": "address"
                    }
                ],
                "internalType": "struct PoolKey",
                "name": "key",
                "type": "tuple"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "keyHash",
                "type": "bytes32"
            }
        ],
        "name": "getPoolKey",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "Currency",
                        "name": "currency0",
                        "type": "address"
                    },
                    {
                        "internalType": "Currency",
                        "name": "currency1",
                        "type": "address"
                    },
                    {
                        "internalType": "uint24",
                        "name": "fee",
                        "type": "uint24"
                    },
                    {
                        "internalType": "int24",
                        "name": "tickSpacing",
                        "type": "int24"
                    },
                    {
                        "internalType": "contract IHooks",
                        "name": "hooks",
                        "type": "address"
                    }
                ],
                "internalType": "struct PoolKey",
                "name": "key",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "getSavingsDetails",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_totalSaved",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_lastSaveTime",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isLocked",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "_withdrawalTimelock",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getSwapContext",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "bool",
                        "name": "hasStrategy",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "currentPercentage",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "inputAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "inputToken",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "roundUpSavings",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "enableDCA",
                        "type": "bool"
                    },
                    {
                        "internalType": "address",
                        "name": "dcaTargetToken",
                        "type": "address"
                    },
                    {
                        "internalType": "int24",
                        "name": "currentTick",
                        "type": "int24"
                    },
                    {
                        "internalType": "enum SpendSaveStorage.SavingsTokenType",
                        "name": "savingsTokenType",
                        "type": "uint8"
                    },
                    {
                        "internalType": "address",
                        "name": "specificSavingsToken",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "pendingSaveAmount",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct SpendSaveStorage.SwapContext",
                "name": "context",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "getTotalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "totalSupply",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getTransientSwapContext",
        "outputs": [
            {
                "internalType": "uint128",
                "name": "pendingSaveAmount",
                "type": "uint128"
            },
            {
                "internalType": "uint128",
                "name": "currentPercentage",
                "type": "uint128"
            },
            {
                "internalType": "uint8",
                "name": "savingsTokenType",
                "type": "uint8"
            },
            {
                "internalType": "bool",
                "name": "roundUpSavings",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "enableDCA",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getUserDcaConfig",
        "outputs": [
            {
                "internalType": "bool",
                "name": "enabled",
                "type": "bool"
            },
            {
                "internalType": "address",
                "name": "targetToken",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "minAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "maxSlippage",
                "type": "uint256"
            },
            {
                "internalType": "int24",
                "name": "lowerTick",
                "type": "int24"
            },
            {
                "internalType": "int24",
                "name": "upperTick",
                "type": "int24"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getUserSavingStrategy",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "percentage",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "autoIncrement",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "maxPercentage",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "goalAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "roundUpSavings",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "enableDCA",
                        "type": "bool"
                    },
                    {
                        "internalType": "enum SpendSaveStorage.SavingsTokenType",
                        "name": "savingsTokenType",
                        "type": "uint8"
                    },
                    {
                        "internalType": "address",
                        "name": "specificSavingsToken",
                        "type": "address"
                    }
                ],
                "internalType": "struct SpendSaveStorage.SavingStrategy",
                "name": "strategy",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getUserSavingsTokens",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getUserTokensForDailySavings",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "tokens",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getWithdrawalTimelock",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "hasPendingDCAOrders",
        "outputs": [
            {
                "internalType": "bool",
                "name": "hasPending",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "idToToken",
        "outputs": [
            {
                "internalType": "address",
                "name": "tokenAddress",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "increaseBalance",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "increaseSavings",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "increaseTotalSupply",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "incrementNextTokenId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "currentId",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_spendSaveHook",
                "type": "address"
            }
        ],
        "name": "initialize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "moduleAddress",
                "type": "address"
            }
        ],
        "name": "isAuthorizedModule",
        "outputs": [
            {
                "internalType": "bool",
                "name": "authorized",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "isOperator",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "lastSaveTime",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "markDcaExecuted",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "maxSavingsPercentage",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "moduleRegistry",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "poolInitialized",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "poolManager",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "PoolId",
                "name": "poolId",
                "type": "bytes32"
            }
        ],
        "name": "poolTicks",
        "outputs": [
            {
                "internalType": "int24",
                "name": "tick",
                "type": "int24"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "moduleId",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "moduleAddress",
                "type": "address"
            }
        ],
        "name": "registerModule",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            }
        ],
        "name": "releaseTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            }
        ],
        "name": "releaseTokensForLP",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "removeExecutedDcaItems",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "savingStrategyModule",
        "outputs": [
            {
                "internalType": "address",
                "name": "strategyAddress",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "savings",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "savingsGoals",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "savingsModule",
        "outputs": [
            {
                "internalType": "address",
                "name": "savingsAddress",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "tokenOwner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "setAllowance",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "setBalance",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "setDailySavingsAmount",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "components": [
                    {
                        "internalType": "bool",
                        "name": "enabled",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "lastExecutionTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "startTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "goalAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "currentAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "penaltyBps",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "endTime",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct SpendSaveStorage.DailySavingsConfigParams",
                "name": "params",
                "type": "tuple"
            }
        ],
        "name": "setDailySavingsConfig",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "dailyAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address[]",
                        "name": "tokens",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256",
                        "name": "lastExecution",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isActive",
                        "type": "bool"
                    }
                ],
                "internalType": "struct SpendSaveStorage.DailySavingsConfig",
                "name": "config",
                "type": "tuple"
            }
        ],
        "name": "setDailySavingsConfig",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "enum SpendSaveStorage.YieldStrategy",
                "name": "strategy",
                "type": "uint8"
            }
        ],
        "name": "setDailySavingsYieldStrategy",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "enabled",
                "type": "bool"
            }
        ],
        "name": "setDcaEnabled",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "setDcaTargetToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "int24",
                "name": "lowerTick",
                "type": "int24"
            },
            {
                "internalType": "int24",
                "name": "upperTick",
                "type": "int24"
            }
        ],
        "name": "setDcaTickStrategy",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "int24",
                "name": "tickDelta",
                "type": "int24"
            },
            {
                "internalType": "uint256",
                "name": "tickExpiryTime",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "onlyImprovePrice",
                "type": "bool"
            },
            {
                "internalType": "int24",
                "name": "minTickImprovement",
                "type": "int24"
            },
            {
                "internalType": "bool",
                "name": "dynamicSizing",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "customSlippageTolerance",
                "type": "uint256"
            }
        ],
        "name": "setDcaTickStrategy",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tolerance",
                "type": "uint256"
            }
        ],
        "name": "setDefaultSlippageTolerance",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "setIdToToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address[]",
                "name": "tokens",
                "type": "address[]"
            }
        ],
        "name": "setIntermediaryTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "poolId",
                "type": "bytes32"
            },
            {
                "internalType": "int24",
                "name": "tick",
                "type": "int24"
            }
        ],
        "name": "setLastDcaExecutionTick",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "newMaxPercentage",
                "type": "uint256"
            }
        ],
        "name": "setMaxSavingsPercentage",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "setOperator",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "uint16",
                "name": "percentage",
                "type": "uint16"
            },
            {
                "internalType": "uint16",
                "name": "autoIncrement",
                "type": "uint16"
            },
            {
                "internalType": "uint16",
                "name": "maxPercentage",
                "type": "uint16"
            },
            {
                "internalType": "bool",
                "name": "roundUpSavings",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "enableDCA",
                "type": "bool"
            },
            {
                "internalType": "uint8",
                "name": "savingsTokenType",
                "type": "uint8"
            }
        ],
        "name": "setPackedUserConfig",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "PoolId",
                "name": "poolId",
                "type": "bytes32"
            },
            {
                "internalType": "int24",
                "name": "tick",
                "type": "int24"
            }
        ],
        "name": "setPoolTick",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "percentage",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "autoIncrement",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "maxPercentage",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "goalAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "roundUpSavings",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "enableDCA",
                        "type": "bool"
                    },
                    {
                        "internalType": "enum SpendSaveStorage.SavingsTokenType",
                        "name": "savingsTokenType",
                        "type": "uint8"
                    },
                    {
                        "internalType": "address",
                        "name": "specificSavingsToken",
                        "type": "address"
                    }
                ],
                "internalType": "struct SpendSaveStorage.SavingStrategy",
                "name": "strategy",
                "type": "tuple"
            }
        ],
        "name": "setSavingStrategy",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "enum SpendSaveStorage.SlippageAction",
                "name": "action",
                "type": "uint8"
            }
        ],
        "name": "setSlippageExceededAction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "components": [
                    {
                        "internalType": "bool",
                        "name": "hasStrategy",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "currentPercentage",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "inputAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "inputToken",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "roundUpSavings",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "enableDCA",
                        "type": "bool"
                    },
                    {
                        "internalType": "address",
                        "name": "dcaTargetToken",
                        "type": "address"
                    },
                    {
                        "internalType": "int24",
                        "name": "currentTick",
                        "type": "int24"
                    },
                    {
                        "internalType": "enum SpendSaveStorage.SavingsTokenType",
                        "name": "savingsTokenType",
                        "type": "uint8"
                    },
                    {
                        "internalType": "address",
                        "name": "specificSavingsToken",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "pendingSaveAmount",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct SpendSaveStorage.SwapContext",
                "name": "context",
                "type": "tuple"
            }
        ],
        "name": "setSwapContext",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "components": [
                    {
                        "internalType": "bool",
                        "name": "hasStrategy",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "currentPercentage",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "inputAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "inputToken",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "roundUpSavings",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "enableDCA",
                        "type": "bool"
                    },
                    {
                        "internalType": "address",
                        "name": "dcaTargetToken",
                        "type": "address"
                    },
                    {
                        "internalType": "int24",
                        "name": "currentTick",
                        "type": "int24"
                    },
                    {
                        "internalType": "enum SpendSaveStorage.SavingsTokenType",
                        "name": "savingsTokenType",
                        "type": "uint8"
                    },
                    {
                        "internalType": "address",
                        "name": "specificSavingsToken",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "pendingSaveAmount",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct SpendSaveStorage.SwapContext",
                "name": "context",
                "type": "tuple"
            },
            {
                "internalType": "int24",
                "name": "currentTick",
                "type": "int24"
            }
        ],
        "name": "setSwapContextWithTick",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tolerance",
                "type": "uint256"
            }
        ],
        "name": "setTokenSlippageTolerance",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "setTokenToId",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "uint128",
                "name": "pendingSaveAmount",
                "type": "uint128"
            },
            {
                "internalType": "uint128",
                "name": "currentPercentage",
                "type": "uint128"
            },
            {
                "internalType": "bool",
                "name": "hasStrategy",
                "type": "bool"
            },
            {
                "internalType": "uint8",
                "name": "savingsTokenType",
                "type": "uint8"
            },
            {
                "internalType": "bool",
                "name": "roundUpSavings",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "enableDCA",
                "type": "bool"
            }
        ],
        "name": "setTransientSwapContext",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newTreasury",
                "type": "address"
            }
        ],
        "name": "setTreasury",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "newFee",
                "type": "uint256"
            }
        ],
        "name": "setTreasuryFee",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tolerance",
                "type": "uint256"
            }
        ],
        "name": "setUserSlippageTolerance",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "timelock",
                "type": "uint256"
            }
        ],
        "name": "setWithdrawalTimelock",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "slippageExceededAction",
        "outputs": [
            {
                "internalType": "enum SpendSaveStorage.SlippageAction",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "specificSavingsToken",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "spendSaveHook",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "tokenSlippageTolerance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "tokenToId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "totalSaved",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "treasury",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "treasuryFee",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "updateDailySavingsExecution",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "userSlippageTolerance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "userWithdrawalTimelocks",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "withdrawalTimelock",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
] as const;

/**
 * TypeScript Types and Enums
 */

export enum SavingsTokenType {
    NATIVE = 0,
    STABLECOIN = 1,
    SPECIFIC_TOKEN = 2,
}

export enum YieldStrategy {
    NONE = 0,
    AAVE = 1,
    COMPOUND = 2,
    UNISWAP_V4_LP = 3,
}

export interface SavingStrategy {
    percentage: bigint;
    autoIncrement: bigint;
    maxPercentage: bigint;
    goalAmount: bigint;
    roundUpSavings: boolean;
    enableDCA: boolean;
    savingsTokenType: SavingsTokenType;
    specificSavingsToken: string;
}

export interface DCAExecution {
    amount: bigint;
    token: string;
    executionTime: bigint;
    price: bigint;
    successful: boolean;
}

export interface DCAQueueItem {
    fromToken: string;
    toToken: string;
    amount: bigint;
    executionTick: number;
    deadline: bigint;
    customSlippageTolerance: bigint;
    executed: boolean;
}

export interface DailySavingsConfig {
    dailyAmount: bigint;
    tokens: string[];
    lastExecution: bigint;
    isActive: boolean;
}

export interface DailySavingsConfigParams {
    enabled: boolean;
    lastExecutionTime: bigint;
    startTime: bigint;
    goalAmount: bigint;
    currentAmount: bigint;
    penaltyBps: bigint;
    endTime: bigint;
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

/**
 * Helper Functions
 */

/**
 * Convert basis points to percentage
 */
export const bpsToPercentage = (bps: bigint): number => {
    return Number(bps) / 100;
};

/**
 * Convert percentage to basis points
 */
export const percentageToBps = (percentage: number): bigint => {
    return BigInt(Math.round(percentage * 100));
};

/**
 * Check if a percentage is valid (0-10000 bps = 0-100%)
 */
export const isValidPercentage = (bps: bigint): boolean => {
    return bps >= BigInt(0) && bps <= BigInt(10000);
};

/**
 * Calculate savings amount from transaction amount and percentage
 */
export const calculateSavingsAmount = (
    transactionAmount: bigint,
    savingsPercentageBps: bigint
): bigint => {
    return (transactionAmount * savingsPercentageBps) / BigInt(10000);
};

/**
 * Round up to nearest unit (for round-up savings feature)
 */
export const calculateRoundUpAmount = (
    amount: bigint,
    decimals: number = 18
): bigint => {
    const unit = BigInt(10 ** decimals);
    const remainder = amount % unit;
    if (remainder === BigInt(0)) return BigInt(0);
    return unit - remainder;
};

/**
 * Validate a saving strategy
 */
export const validateSavingStrategy = (
    strategy: SavingStrategy
): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!isValidPercentage(strategy.percentage)) {
        errors.push("Invalid percentage (must be 0-10000 bps)");
    }

    if (!isValidPercentage(strategy.maxPercentage)) {
        errors.push("Invalid max percentage (must be 0-10000 bps)");
    }

    if (strategy.percentage > strategy.maxPercentage) {
        errors.push("Percentage cannot exceed max percentage");
    }

    if (
        strategy.savingsTokenType === SavingsTokenType.SPECIFIC_TOKEN &&
        strategy.specificSavingsToken === "0x0000000000000000000000000000000000000000"
    ) {
        errors.push("Specific savings token must be set");
    }

    return {
        valid: errors.length === 0,
        errors,
    };
};

/**
 * Format timelock duration in human-readable format
 */
export const formatTimelockDuration = (seconds: bigint): string => {
    const numSeconds = Number(seconds);

    if (numSeconds === 0) return "No timelock";
    if (numSeconds < 60) return `${numSeconds} seconds`;
    if (numSeconds < 3600) return `${Math.floor(numSeconds / 60)} minutes`;
    if (numSeconds < 86400) return `${Math.floor(numSeconds / 3600)} hours`;

    return `${Math.floor(numSeconds / 86400)} days`;
};

/**
 * Calculate time until withdrawal is unlocked
 */
export const getTimeUntilUnlock = (
    lastSaveTime: bigint,
    withdrawalTimelock: bigint,
    currentTimestamp: bigint
): bigint => {
    const unlockTime = lastSaveTime + withdrawalTimelock;
    if (currentTimestamp >= unlockTime) return BigInt(0);
    return unlockTime - currentTimestamp;
};

/**
 * Contract address placeholder - update with actual deployed address
 */
export const SPEND_SAVE_STORAGE_ADDRESS = process.env.NEXT_PUBLIC_SPEND_SAVE_STORAGE_ADDRESS || "";
