/**
 * SpendSave Analytics Contract ABI
 * TypeScript Definition
 * Real-time analytics and portfolio tracking using StateView
 */

export const SpendSaveAnalyticsABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_storage",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_stateView",
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
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserPortfolio",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "tokens",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "savings",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "dcaAmounts",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256",
        "name": "totalValueUSD",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "currency0",
            "type": "address"
          },
          {
            "internalType": "address",
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
            "internalType": "address",
            "name": "hooks",
            "type": "address"
          }
        ],
        "internalType": "struct PoolKey",
        "name": "poolKey",
        "type": "tuple"
      }
    ],
    "name": "getPoolAnalytics",
    "outputs": [
      {
        "internalType": "uint160",
        "name": "sqrtPriceX96",
        "type": "uint160"
      },
      {
        "internalType": "int24",
        "name": "tick",
        "type": "int24"
      },
      {
        "internalType": "uint128",
        "name": "liquidity",
        "type": "uint128"
      },
      {
        "internalType": "uint256",
        "name": "feeGrowthGlobal0",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "feeGrowthGlobal1",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "currency0",
            "type": "address"
          },
          {
            "internalType": "address",
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
            "internalType": "address",
            "name": "hooks",
            "type": "address"
          }
        ],
        "internalType": "struct PoolKey",
        "name": "poolKey",
        "type": "tuple"
      },
      {
        "internalType": "uint256",
        "name": "tickRange",
        "type": "uint256"
      }
    ],
    "name": "getTickLiquidityDistribution",
    "outputs": [
      {
        "internalType": "int24",
        "name": "currentTick",
        "type": "int24"
      },
      {
        "internalType": "int24[]",
        "name": "ticks",
        "type": "int24[]"
      },
      {
        "internalType": "uint128[]",
        "name": "liquidityGross",
        "type": "uint128[]"
      },
      {
        "internalType": "int128[]",
        "name": "liquidityNet",
        "type": "int128[]"
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
    "inputs": [],
    "name": "stateView",
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
    "name": "storage_",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
