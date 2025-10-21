/**
 * Liquidity Manager Contract ABI
 * TypeScript Definition
 */

export const LiquidityManagerABI = [
    {
      inputs: [
        {
          internalType: "address",
          name: "_storage",
          type: "address",
        },
        {
          internalType: "address",
          name: "_positionManager",
          type: "address",
        },
        {
          internalType: "address",
          name: "_permit2",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "ReentrancyGuardReentrantCall",
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
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount0",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount1",
          type: "uint256",
        },
      ],
      name: "FeesCollected",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [],
      name: "MinAmountsInitialized",
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
          internalType: "uint256",
          name: "oldTokenId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "newTokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "int24",
          name: "newTickLower",
          type: "int24",
        },
        {
          indexed: false,
          internalType: "int24",
          name: "newTickUpper",
          type: "int24",
        },
      ],
      name: "PositionRebalanced",
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
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "poolToken0",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "poolToken1",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount0",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount1",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint128",
          name: "liquidity",
          type: "uint128",
        },
      ],
      name: "SavingsConvertedToLP",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "token",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "requestedAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "actualAmount",
          type: "uint256",
        },
      ],
      name: "TokensRequestedFromStorage",
      type: "event",
    },
    {
      inputs: [],
      name: "DEFAULT_TICK_RANGE",
      outputs: [
        {
          internalType: "int24",
          name: "",
          type: "int24",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "MIN_LIQUIDITY",
      outputs: [
        {
          internalType: "uint128",
          name: "",
          type: "uint128",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address[]",
          name: "users",
          type: "address[]",
        },
        {
          components: [
            {
              internalType: "address",
              name: "token0",
              type: "address",
            },
            {
              internalType: "address",
              name: "token1",
              type: "address",
            },
            {
              internalType: "int24",
              name: "tickLower",
              type: "int24",
            },
            {
              internalType: "int24",
              name: "tickUpper",
              type: "int24",
            },
          ],
          internalType: "struct SpendSaveLiquidityManager.ConversionParams[]",
          name: "params",
          type: "tuple[]",
        },
        {
          internalType: "uint256",
          name: "deadline",
          type: "uint256",
        },
      ],
      name: "batchConvertSavingsToLP",
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
      name: "collectAndCompoundFees",
      outputs: [
        {
          internalType: "uint256",
          name: "totalFees0",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "totalFees1",
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
          name: "token0",
          type: "address",
        },
        {
          internalType: "address",
          name: "token1",
          type: "address",
        },
        {
          internalType: "int24",
          name: "tickLower",
          type: "int24",
        },
        {
          internalType: "int24",
          name: "tickUpper",
          type: "int24",
        },
        {
          internalType: "uint256",
          name: "deadline",
          type: "uint256",
        },
      ],
      name: "convertSavingsToLP",
      outputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "uint128",
          name: "liquidity",
          type: "uint128",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "defaultMinAmount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "getPositionDetails",
      outputs: [
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
          name: "poolKey",
          type: "tuple",
        },
        {
          internalType: "PositionInfo",
          name: "positionInfo",
          type: "uint256",
        },
        {
          internalType: "uint128",
          name: "liquidity",
          type: "uint128",
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
      name: "getUserPositions",
      outputs: [
        {
          internalType: "uint256[]",
          name: "tokenIds",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "token",
          type: "address",
        },
      ],
      name: "minConversionAmounts",
      outputs: [
        {
          internalType: "uint256",
          name: "minAmount",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "permit2",
      outputs: [
        {
          internalType: "contract IAllowanceTransfer",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "poolHook",
      outputs: [
        {
          internalType: "contract IHooks",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "poolManager",
      outputs: [
        {
          internalType: "contract IPoolManager",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "positionManager",
      outputs: [
        {
          internalType: "contract IPositionManager",
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
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "positionOwner",
      outputs: [
        {
          internalType: "address",
          name: "user",
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
          name: "token0",
          type: "address",
        },
        {
          internalType: "address",
          name: "token1",
          type: "address",
        },
        {
          internalType: "int24",
          name: "tickLower",
          type: "int24",
        },
        {
          internalType: "int24",
          name: "tickUpper",
          type: "int24",
        },
      ],
      name: "previewSavingsToLP",
      outputs: [
        {
          internalType: "uint256",
          name: "amount0",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "amount1",
          type: "uint256",
        },
        {
          internalType: "uint128",
          name: "liquidity",
          type: "uint128",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "int24",
          name: "newTickLower",
          type: "int24",
        },
        {
          internalType: "int24",
          name: "newTickUpper",
          type: "int24",
        },
        {
          internalType: "uint256",
          name: "deadline",
          type: "uint256",
        },
      ],
      name: "rebalancePosition",
      outputs: [
        {
          internalType: "uint256",
          name: "newTokenId",
          type: "uint256",
        },
      ],
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
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "userPositions",
      outputs: [
        {
          internalType: "uint256",
          name: "tokenIds",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ] as const;
  
  // Type definitions for structs
  
  export interface ConversionParams {
    token0: string;
    token1: string;
    tickLower: number;
    tickUpper: number;
  }
  
  export interface PoolKey {
    currency0: string;
    currency1: string;
    fee: number;
    tickSpacing: number;
    hooks: string;
  }
  
  export interface PositionDetails {
    poolKey: PoolKey;
    positionInfo: bigint;
    liquidity: bigint;
  }
  
  export interface LiquidityPreview {
    amount0: bigint;
    amount1: bigint;
    liquidity: bigint;
  }
  
  export interface FeesCollected {
    totalFees0: bigint;
    totalFees1: bigint;
  }
  
  export interface ConversionResult {
    tokenId: bigint;
    liquidity: bigint;
  }
  
  // Export the contract address type for convenience
  export type Address = `0x${string}`;
  
  // Helper type for tick ranges
  export type TickRange = {
    lower: number;
    upper: number;
  };
  
  // Example usage with ethers.js v6:
  // import { ethers } from 'ethers';
  // import { LiquidityManagerABI, ConversionParams } from './liquidity-manager-abi';
  //
  // const contract = new ethers.Contract(address, LiquidityManagerABI, signer);
  //
  // // Preview conversion before executing
  // const [amount0, amount1, liquidity] = await contract.previewSavingsToLP(
  //   userAddress,
  //   token0Address,
  //   token1Address,
  //   -887220, // tickLower (full range example)
  //   887220   // tickUpper
  // );
  //
  // console.log('Will add:', ethers.formatEther(amount0), 'of token0');
  // console.log('Will add:', ethers.formatEther(amount1), 'of token1');
  // console.log('Expected liquidity:', liquidity.toString());
  //
  // // Convert savings to LP position
  // const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
  // const [tokenId, liquidityAdded] = await contract.convertSavingsToLP(
  //   userAddress,
  //   token0Address,
  //   token1Address,
  //   -887220, // tickLower
  //   887220,  // tickUpper
  //   deadline
  // );
  //
  // console.log('Created position with tokenId:', tokenId.toString());
  // console.log('Liquidity added:', liquidityAdded.toString());
  //
  // // Get all user positions
  // const positions = await contract.getUserPositions(userAddress);
  // console.log('User has', positions.length, 'positions');
  //
  // // Get details of a specific position
  // const details = await contract.getPositionDetails(tokenId);
  // console.log('Position pool:', details.poolKey.currency0, details.poolKey.currency1);
  // console.log('Position liquidity:', details.liquidity.toString());
  //
  // // Collect and auto-compound fees
  // const [fees0, fees1] = await contract.collectAndCompoundFees(userAddress);
  // console.log('Collected fees:', ethers.formatEther(fees0), 'and', ethers.formatEther(fees1));
  //
  // // Rebalance a position to new tick range
  // const newTokenId = await contract.rebalancePosition(
  //   tokenId,
  //   -443610, // new lower tick
  //   443610,  // new upper tick
  //   deadline
  // );
  // console.log('Rebalanced to new position:', newTokenId.toString());
  //
  // // Batch convert multiple users' savings
  // const users = [user1, user2, user3];
  // const params: ConversionParams[] = [
  //   { token0: token0Addr, token1: token1Addr, tickLower: -887220, tickUpper: 887220 },
  //   { token0: token0Addr, token1: token1Addr, tickLower: -443610, tickUpper: 443610 },
  //   { token0: token0Addr, token1: token1Addr, tickLower: -221805, tickUpper: 221805 },
  // ];
  // await contract.batchConvertSavingsToLP(users, params, deadline);
  //
  // // Check minimum conversion amounts
  // const minAmount = await contract.minConversionAmounts(tokenAddress);
  // console.log('Minimum conversion amount:', ethers.formatEther(minAmount));
  //
  // // Get constants
  // const defaultTickRange = await contract.DEFAULT_TICK_RANGE();
  // const minLiquidity = await contract.MIN_LIQUIDITY();
  // console.log('Default tick range:', defaultTickRange);
  // console.log('Minimum liquidity:', minLiquidity.toString());